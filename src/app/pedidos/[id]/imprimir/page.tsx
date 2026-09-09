import { prisma } from "@/lib/prisma";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ImprimirPedidoPage({
  params,
}: PageProps<"/pedidos/[id]/imprimir">) {
  const { id } = await params;
  const [pedido, pagos] = await Promise.all([
    prisma.pedido.findUnique({
      where: { id },
      include: { entradas: { include: { producto: true }, orderBy: { createdAt: "asc" } } },
    }),
    prisma.pago.findMany({ where: { pedidoId: id } }),
  ]);
  if (!pedido) notFound();

  const costoMercanciaUSD = pedido.entradas.reduce(
    (acc, l) => acc + l.cajasRecibidas * l.costoPorCaja,
    0,
  );
  const costoTotalUSD = costoMercanciaUSD + (pedido.logisticaUSD ?? 0);
  const abonadoUSD = pagos
    .filter((p) => p.moneda === "USD")
    .reduce((acc, p) => acc + p.monto, 0);
  const saldoUSD = costoTotalUSD - abonadoUSD;

  return (
    <div className="flex flex-col gap-6 bg-background print:bg-background">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/pedidos/${pedido.id}`} className="text-sm text-wine underline">
          ← Volver al pedido
        </Link>
        <BotonImprimir />
      </div>

      <div className="max-w-2xl mx-auto w-full bg-background print:p-6 p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 pt-2 pb-5 border-b-2 border-wine print-no-break">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-wine tracking-wide">Vinos</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted mt-1">Purchase Order</p>
          </div>
          <div className="flex items-center justify-center gap-10 text-sm mt-2">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Order Number</p>
              <p className="font-bold text-wine">{pedido.folio}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Date</p>
              <p className="font-medium">
                {new Date(pedido.fecha).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Seller</p>
              <p className="font-medium">{pedido.proveedor || "—"}</p>
            </div>
          </div>
        </div>

        <table className="w-full text-sm border-separate border-spacing-0">
          <colgroup>
            <col className="w-16" />
            <col />
            <col className="w-16" />
            <col className="w-20" />
            <col className="w-24" />
            <col className="w-24" />
          </colgroup>
          <thead>
            <tr className="text-left text-muted border-b border-border print-no-break">
              <th className="pb-2 pr-2 font-medium">Image</th>
              <th className="pb-2 px-2 font-medium">Item</th>
              <th className="pb-2 px-2 font-medium text-right">Cases</th>
              <th className="pb-2 px-2 font-medium text-right">Btl/Case</th>
              <th className="pb-2 px-2 font-medium text-right">Price/Case</th>
              <th className="pb-2 pl-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {pedido.entradas.map((l) => (
              <tr key={l.id} className="print-item border-b border-border/50 break-inside-avoid">
                <td className="py-2.5 pr-2">
                  <div className="w-12 h-[72px] rounded bg-surface border border-border overflow-hidden flex items-center justify-center p-1">
                    {l.producto.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.producto.fotoUrl}
                        alt={l.producto.nombre}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg">🍷</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-2">{l.producto.nombre}</td>
                <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {l.cajasRecibidas}
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {l.piezasPorCaja}
                </td>
                <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap">
                  ${l.costoPorCaja.toFixed(2)}
                </td>
                <td className="py-2.5 pl-2 text-right tabular-nums font-medium whitespace-nowrap">
                  ${(l.cajasRecibidas * l.costoPorCaja).toLocaleString("en-US")}
                </td>
              </tr>
            ))}
            {pedido.entradas.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted">
                  No items yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="print-no-break flex flex-col gap-1 items-end text-sm ml-auto w-56">
          <div className="flex justify-between w-full">
            <span className="text-muted">Merchandise</span>
            <span className="tabular-nums">${costoMercanciaUSD.toLocaleString("en-US")}</span>
          </div>
          {pedido.logisticaUSD ? (
            <div className="flex justify-between w-full">
              <span className="text-muted">Freight</span>
              <span className="tabular-nums">${pedido.logisticaUSD.toLocaleString("en-US")}</span>
            </div>
          ) : null}
          <div className="flex justify-between w-full text-base border-t border-border pt-1 mt-1">
            <span className="font-semibold">Total (USD)</span>
            <span className="font-bold text-wine tabular-nums">
              ${costoTotalUSD.toLocaleString("en-US")}
            </span>
          </div>
          {abonadoUSD > 0 && (
            <>
              <div className="flex justify-between w-full">
                <span className="text-muted">Paid to date</span>
                <span className="tabular-nums">${abonadoUSD.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="font-medium">Balance due</span>
                <span className={`font-bold tabular-nums ${saldoUSD > 0.5 ? "text-warn" : "text-ok"}`}>
                  {saldoUSD > 0.5 ? `$${saldoUSD.toLocaleString("en-US")}` : "Paid in full"}
                </span>
              </div>
            </>
          )}
        </div>

        <p className="print-no-break text-center text-xs text-muted border-t border-border pt-4">
          Thank you for your business.
        </p>
      </div>
    </div>
  );
}
