import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdenesPage() {
  const ordenes = await prisma.orden.findMany({
    include: { lineas: true, cliente: true },
    orderBy: { fecha: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wine">Órdenes</h1>
          <p className="text-muted text-sm">Tus ventas registradas</p>
        </div>
        <Link
          href="/ordenes/nueva"
          className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
        >
          + Nueva orden
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {ordenes.map((o) => {
          const total = o.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
          return (
            <Link
              key={o.id}
              href={`/ordenes/${o.id}`}
              className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {o.folio} · {o.cliente.nombre.replace("Cliente Especial - ", "")}
                </p>
                <p className="text-xs text-muted">
                  {new Date(o.fecha).toLocaleDateString("es-MX")} · {o.estatus}
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
