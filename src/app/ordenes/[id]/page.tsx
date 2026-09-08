import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DetalleOrdenPage({
  params,
}: PageProps<"/ordenes/[id]">) {
  const { id } = await params;
  const orden = await prisma.orden.findUnique({
    where: { id },
    include: { lineas: { include: { producto: true } }, cliente: true, cobros: true },
  });
  if (!orden) notFound();

  const total = orden.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
  const cobrado = orden.cobros.reduce((acc, c) => acc + c.monto, 0);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/ordenes" className="text-sm text-wine underline">
          ← Volver a Órdenes
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-bold text-wine">{orden.folio}</h1>
          <span className="text-sm text-muted">
            {new Date(orden.fecha).toLocaleDateString("es-MX")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">
            {orden.cliente.nombre.replace("Cliente Especial - ", "")} · {orden.estatus}
          </p>
          <Link
            href={`/ordenes/${orden.id}/recibo`}
            className="text-sm text-wine underline whitespace-nowrap"
          >
            Ver recibo
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {orden.lineas.map((l) => (
          <div key={l.id} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-wine-light overflow-hidden flex items-center justify-center shrink-0">
              {l.producto.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.producto.fotoUrl} alt={l.producto.nombre} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">🍷</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{l.producto.nombre}</p>
              <p className="text-xs text-muted">
                {l.cantidadBotellas} botella{l.cantidadBotellas === 1 ? "" : "s"} × {formatoMXN(l.precioUnitario)}
              </p>
            </div>
            <span className="font-semibold whitespace-nowrap">
              {formatoMXN(l.cantidadBotellas * l.precioUnitario)}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-wine text-lg">{formatoMXN(total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Cobrado</span>
          <span>{formatoMXN(cobrado)}</span>
        </div>
        {total - cobrado > 0 && (
          <div className="flex items-center justify-between text-sm text-warn">
            <span>Pendiente</span>
            <span>{formatoMXN(total - cobrado)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
