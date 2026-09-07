import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/ordenes/${orden.id}`} className="text-sm text-wine underline">
          ← Volver a la orden
        </Link>
        <BotonImprimir />
      </div>

      <div className="max-w-lg mx-auto w-full rounded-lg border border-border bg-surface p-6 flex flex-col gap-6 print:border-0 print:p-0">
        <div className="text-center">
          <p className="text-2xl">🍷</p>
          <h1 className="text-xl font-bold text-wine">Vinos CRM</h1>
          <p className="text-sm text-muted">Recibo de venta</p>
        </div>

        <div className="flex justify-between text-sm border-y border-border py-3">
          <div>
            <p className="text-muted">Cliente</p>
            <p className="font-medium">{orden.cliente.nombre.replace("Cliente Especial - ", "")}</p>
          </div>
          <div className="text-right">
            <p className="text-muted">Folio</p>
            <p className="font-medium">{orden.folio}</p>
            <p className="text-muted mt-1">{new Date(orden.fecha).toLocaleDateString("es-MX")}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="pb-2 font-medium">Producto</th>
              <th className="pb-2 font-medium text-right">Cant.</th>
              <th className="pb-2 font-medium text-right">Precio</th>
              <th className="pb-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orden.lineas.map((l) => (
              <tr key={l.id} className="border-b border-border/50">
                <td className="py-2">{l.producto.nombre}</td>
                <td className="py-2 text-right">{l.cantidadBotellas}</td>
                <td className="py-2 text-right">{formatoMXN(l.precioUnitario)}</td>
                <td className="py-2 text-right">
                  {formatoMXN(l.cantidadBotellas * l.precioUnitario)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-1 items-end text-sm">
          <div className="flex justify-between w-48">
            <span className="text-muted">Total</span>
            <span className="font-semibold">{formatoMXN(total)}</span>
          </div>
          <div className="flex justify-between w-48">
            <span className="text-muted">Cobrado</span>
            <span>{formatoMXN(cobrado)}</span>
          </div>
          <div className="flex justify-between w-48 text-base">
            <span className="font-medium">{pendiente > 0 ? "Pendiente" : "Pagado"}</span>
            <span className={`font-bold ${pendiente > 0 ? "text-warn" : "text-ok"}`}>
              {pendiente > 0 ? formatoMXN(pendiente) : "✓"}
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-muted">¡Gracias por tu compra!</p>
      </div>
    </div>
  );
}
