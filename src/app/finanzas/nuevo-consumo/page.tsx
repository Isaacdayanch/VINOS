import { ConsumoPersonalForm } from "@/components/ConsumoPersonalForm";
import { calcularResumenInventario } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevoConsumoPersonalPage() {
  const [productos, socios, resumen] = await Promise.all([
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.socio.findMany(),
    calcularResumenInventario(),
  ]);
  const hoy = new Date().toISOString().slice(0, 10);
  const costoPorProducto: Record<string, number> = {};
  for (const p of productos) {
    costoPorProducto[p.id] = resumen.get(p.id)?.costoPromedioPorBotella ?? 0;
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/finanzas" className="text-sm text-wine underline">
          ← Volver a Finanzas
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Registrar consumo personal</h1>
        <p className="text-muted text-sm">
          Cuando alguien se lleva una botella para consumo propio (no es venta). Sale del
          stock y se anota el costo a nombre de quién se la llevó.
        </p>
      </div>

      <ConsumoPersonalForm
        productos={productos}
        socios={socios}
        costoPorProducto={costoPorProducto}
        hoy={hoy}
      />
    </div>
  );
}
