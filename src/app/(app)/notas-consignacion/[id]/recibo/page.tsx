import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/notas-consignacion/[id]/recibo">) {
  const { id } = await params;
  const nota = await prisma.notaConsignacion.findUnique({
    where: { id },
    include: { distribuidor: true },
  });
  return { title: `Vinos - ${nota?.distribuidor.nombre ?? ""}` };
}

export default async function ReciboNotaConsignacionPage({
  params,
}: PageProps<"/notas-consignacion/[id]/recibo">) {
  const { id } = await params;
  const nota = await prisma.notaConsignacion.findUnique({
    where: { id },
    include: { lineas: { include: { producto: true } }, distribuidor: true, cobros: true },
  });
  if (!nota) notFound();

  const total = nota.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
  const cobrado = nota.cobros.reduce((acc, c) => acc + c.monto, 0);
  const pendiente = total - cobrado;

  return (
    <div className="flex flex-col gap-6 bg-background print:bg-background">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/notas-consignacion/${nota.id}`} className="text-sm text-wine underline">
          ← Volver a la nota
        </Link>
        <BotonImprimir />
      </div>

      <div className="max-w-xl mx-auto w-full bg-background print:p-4 p-4 text-[12px] leading-snug">
        <div className="text-center print-no-break pb-0.5 mb-2">
          <h1 className="text-lg font-bold text-wine">Vinos</h1>
          <p className="text-[11px] text-muted">Nota de consignación</p>
        </div>

        <div className="print-no-break flex justify-between border-y border-border py-1.5 mb-2">
          <div>
            <p className="text-muted text-[11px]">Distribuidor</p>
            <p className="font-medium">{nota.distribuidor.nombre}</p>
          </div>
          <div className="text-right">
            <p className="text-muted text-[11px]">Folio</p>
            <p className="font-medium">{nota.folio}</p>
            <p className="text-muted text-[11px] mt-0.5">
              {new Date(nota.fecha).toLocaleDateString("es-MX")}
            </p>
          </div>
        </div>

        <table className="w-full border-separate border-spacing-0 mb-2">
          <colgroup>
            <col />
            <col className="w-10" />
            <col className="w-[4.5rem]" />
            <col className="w-[4.5rem]" />
            <col className="w-16" />
          </colgroup>
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="pb-1 pr-2 font-medium">Producto</th>
              <th className="pb-1 px-1.5 font-medium text-right">Cant.</th>
              <th className="pb-1 px-1.5 font-medium text-right">Vende
                <br />
                mínimo a
              </th>
              <th className="pb-1 px-1.5 font-medium text-right">Tu
                <br />
                precio
              </th>
              <th className="pb-1 pl-1.5 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {nota.lineas.map((l) => (
              <tr key={l.id} className="print-item border-b border-border/50 break-inside-avoid">
                <td className="py-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-7 rounded bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                      {l.producto.fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={l.producto.fotoUrl}
                          alt={l.producto.nombre}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px]">🍷</span>
                      )}
                    </div>
                    <span className="leading-tight">{l.producto.nombre}</span>
                  </div>
                </td>
                <td className="py-1 px-1.5 text-right tabular-nums whitespace-nowrap">
                  {l.cantidadBotellas}
                </td>
                <td className="py-1 px-1.5 text-right tabular-nums whitespace-nowrap">
                  {formatoMXN(l.producto.precioLista ?? 0)}
                </td>
                <td className="py-1 px-1.5 text-right tabular-nums whitespace-nowrap">
                  {formatoMXN(l.precioUnitario)}
                </td>
                <td className="py-1 pl-1.5 text-right tabular-nums font-medium whitespace-nowrap">
                  {formatoMXN(l.cantidadBotellas * l.precioUnitario)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-no-break">
          <div className="flex flex-col gap-0.5 items-end">
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

          <p className="text-center text-[9px] text-muted pt-0.5 mt-2 leading-snug">
            Mercancía entregada en consignación. El distribuidor es responsable de resguardarla
            y de regresar, por cada botella, la mercancía sin vender o su pago correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
}
