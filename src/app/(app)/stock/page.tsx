import { prisma } from "@/lib/prisma";
import {
  calcularResumenInventario,
  calcularStockPorUbicacion,
  stockEnUbicacion,
  formatearCajasYBotellas,
  formatoMXN,
} from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StockPage({ searchParams }: PageProps<"/stock">) {
  const sp = await searchParams;
  const ubicacionSeleccionada = typeof sp.ubicacion === "string" ? sp.ubicacion : null;

  const [productos, resumen, ubicaciones, stockPorUbicacion] = await Promise.all([
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    calcularResumenInventario(),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularStockPorUbicacion(),
  ]);

  const ubicacionActual = ubicaciones.find((u) => u.id === ubicacionSeleccionada) ?? null;
  const consolidado = !ubicacionActual;

  const valorTotal = [...resumen.values()].reduce(
    (acc, r) => acc + r.valorInventario,
    0,
  );
  const valorEnUbicacion = ubicacionActual
    ? [...resumen.values()].reduce(
        (acc, r) =>
          acc + stockEnUbicacion(stockPorUbicacion, r.productoId, ubicacionActual.id) * r.costoPromedioPorBotella,
        0,
      )
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wine">Stock</h1>
          <p className="text-muted text-sm">
            {consolidado
              ? `Valor total del inventario: ${formatoMXN(valorTotal)}`
              : `Valor del inventario en ${ubicacionActual.nombre}: ${formatoMXN(valorEnUbicacion)}`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/pedidos"
            className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            Pedidos a proveedores
          </Link>
          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs">
            <Link href="/stock/imprimir?precios=si" className="text-wine underline whitespace-nowrap">
              Imprimir con precios
            </Link>
            <Link href="/stock/imprimir" className="text-wine underline whitespace-nowrap">
              Imprimir sin precios
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/stock"
            className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
              consolidado ? "bg-wine text-white" : "bg-surface border border-border text-muted"
            }`}
          >
            Consolidado
          </Link>
          {ubicaciones.map((u) => (
            <Link
              key={u.id}
              href={`/stock?ubicacion=${u.id}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                ubicacionActual?.id === u.id ? "bg-wine text-white" : "bg-surface border border-border text-muted"
              }`}
            >
              {u.nombre}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/stock/repartir" className="text-xs text-wine underline whitespace-nowrap">
            Repartir stock por bodega
          </Link>
          <Link href="/stock/ubicaciones" className="text-xs text-wine underline whitespace-nowrap">
            Editar ubicaciones
          </Link>
        </div>
      </div>

      {!consolidado && (
        <p className="text-xs text-muted -mt-2">
          Solo se cuentan los movimientos que ya se registraron con esta ubicación. Lo que
          entró o salió antes de tener ubicaciones sigue sumando al Consolidado, pero no
          aparece aquí.
        </p>
      )}

      <Link
        href="/productos"
        className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
      >
        <div>
          <p className="font-semibold text-wine">Productos</p>
          <p className="text-xs text-muted">Catálogo, precios y fotos de cada vino</p>
        </div>
        <span className="text-wine text-xl">→</span>
      </Link>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {productos.map((p) => {
          const r = resumen.get(p.id);
          const stock = consolidado
            ? r?.stockActual ?? 0
            : stockEnUbicacion(stockPorUbicacion, p.id, ubicacionActual.id);
          const minimo = p.stockMinimo ?? 8;
          const bajo = consolidado && stock <= minimo;
          return (
            <div key={p.id} className="p-4 flex items-center gap-3 hover:bg-wine-light/40">
              <Link href={`/productos/${p.id}/editar`} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
                  {p.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xl">🍷</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.nombre}</p>
                  <p className="text-xs text-muted">
                    {p.sku} · {formatearCajasYBotellas(stock, p.piezasPorCaja)}
                  </p>
                </div>
              </Link>
              <div className="text-right shrink-0">
                <p className={`font-semibold ${bajo ? "text-warn" : ""}`}>
                  {stock} bot.
                </p>
                {bajo && <p className="text-xs text-warn">⚠ Reponer</p>}
                <Link
                  href={`/stock/${p.id}/ajustar${ubicacionActual ? `?ubicacion=${ubicacionActual.id}` : ""}`}
                  className="text-xs text-wine underline whitespace-nowrap"
                >
                  Ajustar
                </Link>
              </div>
            </div>
          );
        })}
        {productos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes productos.{" "}
            <Link href="/productos/nuevo" className="text-wine underline">
              Crea el primero
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
