import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, formatoMXN } from "@/lib/costeo";
import { ajustarStock } from "@/app/(app)/stock/actions";
import { AjusteStockForm } from "@/components/AjusteStockForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AjustarStockPage({
  params,
}: PageProps<"/stock/[productoId]/ajustar">) {
  const { productoId } = await params;
  const [producto, resumen, socios] = await Promise.all([
    prisma.producto.findUnique({ where: { id: productoId } }),
    calcularResumenInventario(),
    prisma.socio.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  if (!producto) notFound();

  const r = resumen.get(productoId);
  const stockSistema = r?.stockActual ?? 0;
  const guardar = ajustarStock.bind(null, productoId);

  return (
    <div className="flex flex-col gap-6 max-w-sm">
      <div>
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Ajustar stock</h1>
        <p className="text-muted text-sm">{producto.nombre}</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-muted">El sistema dice que tienes</p>
        <p className="text-2xl font-bold text-wine">{stockSistema} botellas</p>
        {r && r.costoPromedioPorBotella > 0 && (
          <p className="text-xs text-muted mt-1">
            Costo promedio: {formatoMXN(r.costoPromedioPorBotella)} por botella
          </p>
        )}
      </div>

      <AjusteStockForm action={guardar} stockSistema={stockSistema} socios={socios} />
    </div>
  );
}
