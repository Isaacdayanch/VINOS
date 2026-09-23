import { prisma } from "@/lib/prisma";
import { marcarLineaEntregada } from "@/app/(app)/ordenes/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PendientesEntregaPage() {
  const lineas = await prisma.ordenLinea.findMany({
    where: { entregado: false },
    include: { producto: true, orden: { include: { cliente: true } } },
    orderBy: { fechaEstimada: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/ordenes" className="text-sm text-wine underline">
          ← Volver a Órdenes
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">📦 Pendientes de entregar</h1>
        <p className="text-muted text-sm">
          Vinos que ya vendiste pero todavía no tienes en stock. En cuanto le des entrada al
          stock del proveedor, marca aquí lo que ya puedas entregar.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {lineas.map((l) => (
          <div key={l.id} className="p-4 flex items-center gap-3 text-sm">
            <div className="w-10 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
              {l.producto.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={l.producto.fotoUrl}
                  alt={l.producto.nombre}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-lg">🍷</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {l.cantidadBotellas}× {l.producto.nombre}
              </p>
              <p className="text-xs text-muted">
                <Link href={`/ordenes/${l.orden.id}`} className="underline">
                  {l.orden.folio}
                </Link>{" "}
                · {l.orden.cliente.nombre.replace("Cliente Especial - ", "")}
              </p>
              <p className="text-xs text-muted">
                {l.fechaEstimada
                  ? `Llega ${new Date(l.fechaEstimada).toLocaleDateString("es-MX")}`
                  : "Sin fecha estimada"}
              </p>
            </div>
            <form action={marcarLineaEntregada.bind(null, l.id, l.orden.id)}>
              <button
                type="submit"
                className="rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-wine-dark active:scale-[0.97] transition-colors"
              >
                Ya se la entregué
              </button>
            </form>
          </div>
        ))}
        {lineas.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">No tienes entregas pendientes.</p>
        )}
      </div>
    </div>
  );
}
