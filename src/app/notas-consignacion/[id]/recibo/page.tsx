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

      <div className="max-w-lg mx-auto w-full bg-background print:p-5 p-5 text-[13px] leading-snug">
        <div className="text-center print-no-break pb-1 mb-3">
          <h1 className="text-xl font-bold text-wine">Vinos</h1>
          <p className="text-xs text-muted">Nota de consignación</p>
        </div>

        <div className="print-no-break flex justify-between border-y border-border py-2 mb-3">
          <div>
            <p className="text-muted text-xs">Distribuidor</p>
            <p className="font-medium">{nota.distribuidor.nombre}</p>
          </div>
          <div className="text-right">
            <p className="text-muted text-xs">Folio</p>
            <p className="font-medium">{nota.folio}</p>
            <p className="text-muted text-xs mt-0.5">
              {new Date(nota.fecha).toLocaleDateString("es-MX")}
            </p>
          </div>
        </div>

        <table className="w-full border-separate border-spacing-0 mb-3">
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
            {nota.lineas.map((l) => (
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

          <p className="text-center text-[11px] text-muted pt-1 mt-3">
            Mercancía entregada en consignación. Se liquida conforme se vaya vendiendo.
          </p>
        </div>
      </div>
    </div>
  );
}
