import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, calcularStockPorUbicacion, stockEnUbicacion, formatoMXN } from "@/lib/costeo";
import { ajustarStock } from "@/app/(app)/stock/actions";
import { AjusteStockForm } from "@/components/AjusteStockForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AjustarStockPage({
  params,
  searchParams,
}: PageProps<"/stock/[productoId]/ajustar">) {
  const { productoId } = await params;
  const sp = await searchParams;
  const ubicacionQuery = typeof sp.ubicacion === "string" ? sp.ubicacion : null;

  const [producto, resumen, socios, ubicaciones, stockPorUbicacion] = await Promise.all([
    prisma.producto.findUnique({ where: { id: productoId } }),
    calcularResumenInventario(),
    prisma.socio.findMany({ orderBy: { nombre: "asc" } }),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularStockPorUbicacion(),
  ]);
  if (!producto) notFound();

  if (ubicaciones.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-sm">
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <p className="text-sm text-warn">
          Primero necesitas crear al menos una ubicación.{" "}
          <Link href="/stock/ubicaciones" className="underline">
            Créala aquí
          </Link>
          .
        </p>
      </div>
    );
  }

  const ubicacionActual = ubicaciones.find((u) => u.id === ubicacionQuery) ?? ubicaciones[0];
  const r = resumen.get(productoId);
  const stockSistema = stockEnUbicacion(stockPorUbicacion, productoId, ubicacionActual.id);
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

      {ubicaciones.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {ubicaciones.map((u) => (
            <Link
              key={u.id}
              href={`/stock/${productoId}/ajustar?ubicacion=${u.id}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                u.id === ubicacionActual.id ? "bg-wine text-white" : "bg-surface border border-border text-muted"
              }`}
            >
              {u.nombre}
            </Link>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-muted">El sistema dice que tienes en {ubicacionActual.nombre}</p>
        <p className="text-2xl font-bold text-wine">{stockSistema} botellas</p>
        {r && r.costoPromedioPorBotella > 0 && (
          <p className="text-xs text-muted mt-1">
            Costo promedio: {formatoMXN(r.costoPromedioPorBotella)} por botella
          </p>
        )}
      </div>

      <AjusteStockForm
        action={guardar}
        stockSistema={stockSistema}
        socios={socios}
        ubicacionIdInicial={ubicacionActual.id}
      />
    </div>
  );
}
