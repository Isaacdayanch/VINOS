import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/ordenes/[id]/recibo">) {
  const { id } = await params;
  const orden = await prisma.orden.findUnique({ where: { id }, include: { cliente: true } });
  const nombreCliente = orden?.cliente.nombre.replace("Cliente Especial - ", "") ?? "";
  return { title: `Vinos - ${nombreCliente}` };
}

export default async function ReciboOrdenPage({
  params,
}: PageProps<"/ordenes/[id]/recibo">) {
  const { id } = await params;
  const orden = await prisma.orden.findUnique({
    where: { id },
    include: { lineas: { include: { producto: true } }, cliente: true, cobros: true },
  });
  if (!orden) notFound();

  const total = orden.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
  const cobrado = orden.cobros.reduce((acc, c) => acc + c.monto, 0);
  const pendiente = total - cobrado;

  return (
    <div className="flex flex-col gap-6 bg-background print:bg-background">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/ordenes/${orden.id}`} className="text-sm text-wine underline">
          ← Volver a la orden
        </Link>
        <BotonImprimir />
      </div>

      <div className="max-w-lg mx-auto w-full bg-background print:p-5 p-5 flex flex-col gap-3 text-[13px] leading-snug">
        <div className="text-center print-no-break pb-1">
          <h1 className="text-xl font-bold text-wine">Vinos</h1>
          <p className="text-xs text-muted">Recibo de venta</p>
        </div>

        <div className="print-no-break flex justify-between border-y border-border py-2">
          <div>
            <p className="text-muted text-xs">Cliente</p>
            <p className="font-medium">{orden.cliente.nombre.replace("Cliente Especial - ", "")}</p>
          </div>
          <div className="text-right">
            <p className="text-muted text-xs">Folio</p>
            <p className="font-medium">{orden.folio}</p>
            <p className="text-muted text-xs mt-0.5">
              {new Date(orden.fecha).toLocaleDateString("es-MX")}
            </p>
          </div>
        </div>

        <table className="w-full border-separate border-spacing-0">
          <colgroup>
            <col />
            <col className="w-10" />
            <col className="w-16" />
            <col className="w-16" />
          </colgroup>
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="pb-1.5 pr-2 font-medium">Producto</th>
              <th className="pb-1.5 px-2 font-medium text-right">Cant.</th>
              <th className="pb-1.5 px-2 font-medium text-right">Precio</th>
              <th className="pb-1.5 pl-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orden.lineas.map((l) => (
              <tr key={l.id} className="print-item border-b border-border/50 break-inside-avoid">
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-10 rounded bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                      {l.producto.fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={l.producto.fotoUrl}
                          alt={l.producto.nombre}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs">🍷</span>
                      )}
                    </div>
                    <span className="leading-snug">{l.producto.nombre}</span>
                  </div>
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {l.cantidadBotellas}
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">
                  {formatoMXN(l.precioUnitario)}
                </td>
                <td className="py-1.5 pl-2 text-right tabular-nums font-medium whitespace-nowrap">
                  {formatoMXN(l.cantidadBotellas * l.precioUnitario)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-no-break flex flex-col gap-0.5 items-end">
          <div className="flex justify-between w-44">
            <span className="text-muted">Total</span>
            <span className="font-semibold">{formatoMXN(total)}</span>
          </div>
          <div className="flex justify-between w-44">
            <span className="text-muted">Cobrado</span>
            <span>{formatoMXN(cobrado)}</span>
          </div>
          <div className="flex justify-between w-44 text-sm">
            <span className="font-medium">{pendiente > 0 ? "Pendiente" : "Pagado"}</span>
            <span className={`font-bold ${pendiente > 0 ? "text-warn" : "text-ok"}`}>
              {pendiente > 0 ? formatoMXN(pendiente) : "✓"}
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted pt-1">¡Gracias por tu compra!</p>
      </div>
    </div>
  );
}
