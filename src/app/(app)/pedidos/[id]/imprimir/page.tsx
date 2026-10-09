import { prisma } from "@/lib/prisma";
import { BotonImprimir } from "@/components/BotonImprimir";
import { calcularCostosPedido, formatoMXN, tipoCambioEstimadoDePagos } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ImprimirPedidoPage({
  params,
  searchParams,
}: PageProps<"/pedidos/[id]/imprimir">) {
  const { id } = await params;
  const sp = await searchParams;
  const completa = sp.vista === "completa";
  const [pedido, pagos] = await Promise.all([
    prisma.pedido.findUnique({
      where: { id },
      include: { entradas: { include: { producto: true }, orderBy: { createdAt: "asc" } } },
    }),
    prisma.pago.findMany({ where: { pedidoId: id } }),
  ]);
  if (!pedido) notFound();

  const costoMercanciaBrutoUSD = pedido.entradas.reduce((acc, l) => {
    const costoPorBotella = l.piezasPorCaja > 0 ? l.costoPorCaja / l.piezasPorCaja : 0;
    return acc + (l.cajasRecibidas * l.piezasPorCaja + l.botellasExtra) * costoPorBotella;
  }, 0);
  const descuentoUSD = (costoMercanciaBrutoUSD * (pedido.descuentoPct ?? 0)) / 100;
  const costoMercanciaUSD = costoMercanciaBrutoUSD - descuentoUSD;
  const costoTotalUSD = costoMercanciaUSD + (pedido.logisticaUSD ?? 0);
  const abonadoUSD = pagos
    .filter((p) => p.moneda === "USD")
    .reduce((acc, p) => acc + p.monto, 0);
  const saldoUSD = costoTotalUSD - abonadoUSD;

  // Datos internos (solo en la vista completa) — al proveedor no le interesa
  // el tipo de cambio ni lo que pagas de aduana en México.
  const tipoCambioEstimado = tipoCambioEstimadoDePagos(pagos);
  const tipoCambioEfectivo = pedido.tipoCambio || tipoCambioEstimado;
  const tipoCambioEsEstimado = !pedido.tipoCambio && tipoCambioEstimado != null;
  const costosPorEntrada =
    completa && tipoCambioEfectivo
      ? new Map((await calcularCostosPedido(pedido.id)).map((c) => [c.entradaId, c.costoPorBotella]))
      : new Map<string, number>();
  const totalBotellas = pedido.entradas.reduce(
    (acc, l) => acc + l.cajasRecibidas * l.piezasPorCaja + l.botellasExtra,
    0,
  );
  const totalCajas = pedido.entradas.reduce((acc, l) => acc + l.cajasRecibidas, 0);
  const totalBotellasExtra = pedido.entradas.reduce((acc, l) => acc + l.botellasExtra, 0);

  return (
    <div className="flex flex-col gap-6 bg-background print:bg-background">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/pedidos/${pedido.id}`} className="text-sm text-wine underline">
          ← Volver al pedido
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/pedidos/${pedido.id}/imprimir${completa ? "" : "?vista=completa"}`}
            className="text-xs text-wine underline whitespace-nowrap"
          >
            {completa ? "Ver versión para el proveedor →" : "Ver versión completa (para ti) →"}
          </Link>
          <BotonImprimir />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full bg-background print:p-5 p-5 flex flex-col gap-4 text-[13px] leading-snug">
        <div className="flex flex-col items-center gap-3 pt-1 pb-4 border-b-2 border-wine print-no-break">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-wine tracking-wide">Vinos</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted mt-1">
              Purchase Order
            </p>
          </div>
          <div className="flex items-center justify-center gap-x-10 gap-y-2 flex-wrap">
            <div className="text-center w-28">
              <p className="text-[10px] uppercase tracking-wide text-muted">Order Number</p>
              <p className="font-bold text-wine">{pedido.folio}</p>
            </div>
            <div className="text-center w-28">
              <p className="text-[10px] uppercase tracking-wide text-muted">Date</p>
              <p className="font-medium">
                {new Date(pedido.fecha).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center w-28">
              <p className="text-[10px] uppercase tracking-wide text-muted">Seller</p>
              <p className="font-medium">{pedido.proveedor || "—"}</p>
            </div>
          </div>
        </div>

        <table className="w-full border-separate border-spacing-0">
          <colgroup>
            <col className="w-10" />
            <col />
            <col className="w-10" />
            <col className="w-12" />
            <col className="w-16" />
            <col className="w-14" />
            <col className="w-16" />
          </colgroup>
          <thead>
            <tr className="text-left text-muted border-b border-border print-no-break">
              <th className="pb-1.5 pr-2 font-medium">Image</th>
              <th className="pb-1.5 px-2 font-medium">Item</th>
              <th className="pb-1.5 px-2 font-medium text-right">Cases</th>
              <th className="pb-1.5 px-2 font-medium text-right">Btl/Case</th>
              <th className="pb-1.5 px-2 font-medium text-right">Total Btl</th>
              <th className="pb-1.5 px-2 font-medium text-right">Price/Case</th>
              <th className="pb-1.5 pl-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {pedido.entradas.map((l) => (
              <tr key={l.id} className="print-item border-b border-border/50 break-inside-avoid">
                <td className="py-1.5 pr-2">
                  <div className="w-9 h-12 rounded bg-surface border border-border overflow-hidden flex items-center justify-center p-0.5">
                    {l.producto.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.producto.fotoUrl}
                        alt={l.producto.nombre}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-base">🍷</span>
                    )}
                  </div>
                </td>
                <td className="py-1.5 px-2 leading-snug">{l.producto.nombre}</td>
                <td className="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {l.cajasRecibidas}
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {l.piezasPorCaja}
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {l.cajasRecibidas * l.piezasPorCaja + l.botellasExtra}
                  {l.botellasExtra !== 0
                    ? ` (${l.botellasExtra > 0 ? "+" : ""}${l.botellasExtra})`
                    : ""}
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">
                  ${l.costoPorCaja.toFixed(2)}
                </td>
                <td className="py-1.5 pl-2 text-right tabular-nums font-medium whitespace-nowrap">
                  <span>
                    $
                    {(
                      (l.cajasRecibidas * l.piezasPorCaja + l.botellasExtra) *
                      (l.piezasPorCaja > 0 ? l.costoPorCaja / l.piezasPorCaja : 0)
                    ).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                  {completa && costosPorEntrada.has(l.id) && (
                    <span className="block text-[10px] font-normal text-wine">
                      {formatoMXN(costosPorEntrada.get(l.id)!)}/botella
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {pedido.entradas.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted">
                  No items yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="print-no-break flex flex-col gap-0.5 items-end ml-auto w-52">
          <div className="flex justify-between w-full">
            <span className="text-muted">Merchandise</span>
            <span className="tabular-nums">${costoMercanciaBrutoUSD.toLocaleString("en-US")}</span>
          </div>
          {pedido.descuentoPct ? (
            <div className="flex justify-between w-full">
              <span className="text-muted">Discount ({pedido.descuentoPct}%)</span>
              <span className="tabular-nums">-${descuentoUSD.toLocaleString("en-US")}</span>
            </div>
          ) : null}
          {pedido.logisticaUSD ? (
            <div className="flex justify-between w-full">
              <span className="text-muted">Freight</span>
              <span className="tabular-nums">${pedido.logisticaUSD.toLocaleString("en-US")}</span>
            </div>
          ) : null}
          <div className="flex justify-between w-full text-sm border-t border-border pt-0.5 mt-0.5">
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

        {completa && (
          <div className="print-no-break rounded-md border border-wine/30 bg-wine-light/30 p-3 flex flex-col gap-1 text-[12px]">
            <p className="font-semibold text-wine mb-0.5">
              Datos internos — no se manda al proveedor
            </p>
            <div className="flex justify-between">
              <span className="text-muted">Total de botellas</span>
              <span className="tabular-nums font-medium">
                {totalBotellas} ({totalCajas} cajas
                {totalBotellasExtra > 0 ? ` + ${totalBotellasExtra} sueltas` : ""})
              </span>
            </div>
            {pedido.logisticaMXN ? (
              <div className="flex justify-between">
                <span className="text-muted">Envío y aduana en México</span>
                <span className="tabular-nums font-medium">{formatoMXN(pedido.logisticaMXN)}</span>
              </div>
            ) : null}
            {tipoCambioEfectivo ? (
              <div className="flex justify-between">
                <span className="text-muted">
                  Tipo de cambio{tipoCambioEsEstimado ? " (estimado)" : ""}
                </span>
                <span className="tabular-nums font-medium">${tipoCambioEfectivo.toFixed(2)}</span>
              </div>
            ) : null}
            {pedido.fechaVencimientoCredito ? (
              <div className="flex justify-between">
                <span className="text-muted">Fecha límite de crédito</span>
                <span className="tabular-nums font-medium">
                  {pedido.fechaVencimientoCredito.toLocaleDateString("es-MX")}
                </span>
              </div>
            ) : null}
          </div>
        )}

        <p className="print-no-break text-center text-[11px] text-muted border-t border-border pt-2">
          Thank you for your business.
        </p>
      </div>
    </div>
  );
}
