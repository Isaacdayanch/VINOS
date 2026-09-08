import { prisma } from "@/lib/prisma";
import {
  calcularResumenInventario,
  formatearCajasYBotellas,
  formatoMXN,
} from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const [productos, resumen] = await Promise.all([
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    calcularResumenInventario(),
  ]);

  const valorTotal = [...resumen.values()].reduce(
    (acc, r) => acc + r.valorInventario,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wine">Stock</h1>
          <p className="text-muted text-sm">
            Valor total del inventario: {formatoMXN(valorTotal)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/pedidos"
            className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            Pedidos a proveedores
          </Link>
          <div className="flex gap-3 text-xs">
            <Link href="/stock/imprimir?precios=si" className="text-wine underline whitespace-nowrap">
              Imprimir con precios
            </Link>
            <Link href="/stock/imprimir" className="text-wine underline whitespace-nowrap">
              Imprimir sin precios
            </Link>
          </div>
        </div>
      </div>

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
          const stock = r?.stockActual ?? 0;
          const minimo = p.stockMinimo ?? 8;
          const bajo = stock <= minimo;
          return (
            <Link
              key={p.id}
              href={`/productos/${p.id}/editar`}
              className="p-4 flex items-center gap-3 hover:bg-wine-light/40"
            >
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
              <div className="text-right">
                <p className={`font-semibold ${bajo ? "text-warn" : ""}`}>
                  {stock} bot.
                </p>
                {bajo && <p className="text-xs text-warn">⚠ Reponer</p>}
              </div>
            </Link>
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
