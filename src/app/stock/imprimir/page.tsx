import { prisma } from "@/lib/prisma";
import {
  calcularResumenInventario,
  formatearCajasYBotellas,
  formatoMXN,
} from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ImprimirStockPage({
  searchParams,
}: PageProps<"/stock/imprimir">) {
  const params = await searchParams;
  const conPrecios = params.precios === "si";

  const [productos, resumen] = await Promise.all([
    prisma.producto.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    }),
    calcularResumenInventario(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <BotonImprimir />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-wine">
          Inventario disponible {conPrecios ? "" : "(sin precios)"}
        </h1>
        <p className="text-muted text-sm">
          {new Date().toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2 pr-3 font-medium">Foto</th>
            <th className="py-2 pr-4 font-medium">Vino</th>
            <th className="py-2 pr-4 font-medium whitespace-nowrap">Stock</th>
            {conPrecios && <th className="py-2 pl-2 font-medium text-right">Precio</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const stock = resumen.get(p.id)?.stockActual ?? 0;
            return (
              <tr key={p.id} className="print-item border-b border-border/50 break-inside-avoid">
                <td className="py-2.5 pr-3">
                  <div className="w-12 h-[72px] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center p-1">
                    {p.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.fotoUrl} alt={p.nombre} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-lg">🍷</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 pr-4">
                  <p className="font-medium">
                    {p.nombre} {p.anio ? `(${p.anio})` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    {p.sku} {p.categoria ? `· ${p.categoria}` : ""}
                  </p>
                </td>
                <td className="py-2.5 pr-4 tabular-nums whitespace-nowrap">
                  {formatearCajasYBotellas(stock, p.piezasPorCaja)}
                </td>
                {conPrecios && (
                  <td className="py-2.5 pl-2 text-right font-medium tabular-nums whitespace-nowrap">
                    {p.precioLista ? formatoMXN(p.precioLista) : "—"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
