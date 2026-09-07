import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecibosPage() {
  const ordenes = await prisma.orden.findMany({
    include: { lineas: true, cliente: true },
    orderBy: { fecha: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-wine">Recibos</h1>
        <p className="text-muted text-sm">
          Elige una orden para ver e imprimir su recibo de venta
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {ordenes.map((o) => {
          const total = o.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
          return (
            <Link
              key={o.id}
              href={`/ordenes/${o.id}/recibo`}
              className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {o.folio} · {o.cliente.nombre.replace("Cliente Especial - ", "")}
                </p>
                <p className="text-xs text-muted">
                  {new Date(o.fecha).toLocaleDateString("es-MX")}
                </p>
              </div>
              <span className="font-semibold text-wine whitespace-nowrap">{formatoMXN(total)}</span>
            </Link>
          );
        })}
        {ordenes.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes órdenes.{" "}
            <Link href="/ordenes/nueva" className="text-wine underline">
              Crea la primera
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
