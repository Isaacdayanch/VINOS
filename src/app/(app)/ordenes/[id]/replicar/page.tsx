import { OrdenForm } from "@/components/OrdenForm";
import { construirDatosPrecios } from "@/lib/precios";
import { calcularResumenInventario } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReplicarOrdenPage({
  params,
}: PageProps<"/ordenes/[id]/replicar">) {
  const { id } = await params;

  const [orden, clientes, productos, preciosGuardados, resumen] = await Promise.all([
    prisma.orden.findUnique({ where: { id }, include: { lineas: true } }),
    prisma.cliente.findMany({ orderBy: { nombre: "asc" } }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.precioClienteProducto.findMany(),
    calcularResumenInventario(),
  ]);
  if (!orden) notFound();

  const { preciosPorClienteProducto, categoriaPorCliente, esUltimoPrecio } = construirDatosPrecios(
    clientes,
    productos,
    preciosGuardados,
  );
  const stockPorProducto: Record<string, number> = {};
  for (const p of productos) {
    stockPorProducto[p.id] = resumen.get(p.id)?.stockActual ?? 0;
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={`/ordenes/${orden.id}`} className="text-sm text-wine underline">
          ← Volver a la orden
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Replicar {orden.folio}</h1>
        <p className="text-muted text-sm">
          Se crea una orden nueva con los mismos vinos y cantidades. Cambia el cliente si es
          para alguien más.
        </p>
      </div>

      <OrdenForm
        clientes={clientes}
        productos={productos}
        preciosPorClienteProducto={preciosPorClienteProducto}
        categoriaPorCliente={categoriaPorCliente}
        esUltimoPrecio={esUltimoPrecio}
        stockPorProducto={stockPorProducto}
        clienteIdInicial={orden.clienteId}
        lineasIniciales={orden.lineas.map((l) => ({
          productoId: l.productoId,
          cantidadBotellas: l.cantidadBotellas,
          precioUnitario: l.precioUnitario,
        }))}
        botonTexto="Crear orden"
      />
    </div>
  );
}
