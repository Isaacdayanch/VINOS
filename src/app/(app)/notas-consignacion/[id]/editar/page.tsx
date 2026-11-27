import { actualizarNotaConsignacion } from "@/app/(app)/distribuidores/actions";
import { NotaConsignacionForm } from "@/components/NotaConsignacionForm";
import { construirDatosPreciosDistribuidor } from "@/lib/precios";
import { calcularResumenInventario } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarNotaConsignacionPage({
  params,
}: PageProps<"/notas-consignacion/[id]/editar">) {
  const { id } = await params;

  const nota = await prisma.notaConsignacion.findUnique({
    where: { id },
    include: { lineas: true, cobros: true, distribuidor: true },
  });
  if (!nota) notFound();

  const sinActividad =
    nota.cobros.length === 0 && nota.lineas.every((l) => l.botellasPagadas === 0 && l.botellasDevueltas === 0);

  const [productos, resumen, ubicaciones, preciosGuardados] = await Promise.all([
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    calcularResumenInventario(),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.precioDistribuidorProducto.findMany({ where: { distribuidorId: nota.distribuidorId } }),
  ]);

  const { preciosPorProducto, esUltimoPrecio } = construirDatosPreciosDistribuidor(productos, preciosGuardados);

  // Las botellas de esta misma nota ya están descontadas del stock actual;
  // se le regresan para que "disponible" refleje lo que de verdad puedes editar.
  const stockPorProducto: Record<string, number> = {};
  for (const p of productos) {
    stockPorProducto[p.id] = resumen.get(p.id)?.stockActual ?? 0;
  }
  for (const l of nota.lineas) {
    stockPorProducto[l.productoId] = (stockPorProducto[l.productoId] ?? 0) + l.cantidadBotellas;
  }

  const guardar = actualizarNotaConsignacion.bind(null, nota.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={`/notas-consignacion/${nota.id}`} className="text-sm text-wine underline">
          ← Volver a la nota
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Editar {nota.folio}</h1>
        <p className="text-muted text-sm">{nota.distribuidor.nombre}</p>
      </div>

      {!sinActividad ? (
        <p className="text-sm text-warn">
          Esta nota ya tiene pagos o devoluciones registradas, así que ya no se puede editar.
        </p>
      ) : (
        <NotaConsignacionForm
          productos={productos}
          stockPorProducto={stockPorProducto}
          action={guardar}
          fechaInicial={nota.fecha.toISOString().slice(0, 10)}
          ubicaciones={ubicaciones}
          ubicacionIdInicial={nota.ubicacionId}
          preciosPorProducto={preciosPorProducto}
          esUltimoPrecio={esUltimoPrecio}
          lineasIniciales={nota.lineas.map((l) => ({
            productoId: l.productoId,
            cantidadBotellas: l.cantidadBotellas,
            precioUnitario: l.precioUnitario,
          }))}
          botonTexto="Guardar cambios"
        />
      )}
    </div>
  );
}
