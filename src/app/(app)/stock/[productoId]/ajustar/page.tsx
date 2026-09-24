import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, formatoMXN } from "@/lib/costeo";
import { ajustarStock } from "@/app/(app)/stock/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AjustarStockPage({
  params,
}: PageProps<"/stock/[productoId]/ajustar">) {
  const { productoId } = await params;
  const [producto, resumen] = await Promise.all([
    prisma.producto.findUnique({ where: { id: productoId } }),
    calcularResumenInventario(),
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

      <form action={guardar} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">¿Cuántas botellas tienes en realidad?</span>
          <input
            name="cantidadReal"
            type="number"
            min="0"
            defaultValue={stockSistema}
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-lg"
          />
          <span className="text-xs text-muted">
            Solo pon el número que de verdad contaste — no tienes que calcular la
            diferencia, el sistema la saca sola.
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Motivo (opcional)</span>
          <input
            name="motivo"
            placeholder="Ej. Conteo físico de septiembre"
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-wine text-white px-4 py-2 font-medium hover:bg-wine-dark active:scale-[0.97] transition-colors"
        >
          Guardar ajuste
        </button>
      </form>
    </div>
  );
}
