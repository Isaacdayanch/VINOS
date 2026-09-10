import { actualizarConsumoPersonal } from "@/app/finanzas/actions";
import { ConsumoPersonalForm } from "@/components/ConsumoPersonalForm";
import { calcularResumenInventario } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarConsumoPersonalPage({
  params,
}: PageProps<"/finanzas/consumo-personal/[id]/editar">) {
  const { id } = await params;

  const [salida, productos, socios, resumen] = await Promise.all([
    prisma.salida.findUnique({ where: { id } }),
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.socio.findMany(),
    calcularResumenInventario(),
  ]);
  if (!salida || salida.motivo !== "Consumo personal") notFound();

  const costoPorProducto: Record<string, number> = {};
  for (const p of productos) {
    costoPorProducto[p.id] = resumen.get(p.id)?.costoPromedioPorBotella ?? 0;
  }

  const guardar = actualizarConsumoPersonal.bind(null, salida.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/finanzas/consumo-personal" className="text-sm text-wine underline">
          ← Volver a Consumo personal
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Editar consumo</h1>
      </div>

      <ConsumoPersonalForm
        productos={productos}
        socios={socios}
        costoPorProducto={costoPorProducto}
        hoy={salida.fecha.toISOString().slice(0, 10)}
        initial={{
          productoId: salida.productoId,
          fecha: salida.fecha.toISOString().slice(0, 10),
          botellas: salida.botellas,
          quien: salida.dividido ? "COMPARTIDO" : (salida.socioId ?? ""),
          montoRepuesto: salida.montoRepuesto,
          cuentaRepuesto: salida.cuentaRepuesto,
          notas: salida.notas,
        }}
        action={guardar}
        botonTexto="Guardar cambios"
      />
    </div>
  );
}
