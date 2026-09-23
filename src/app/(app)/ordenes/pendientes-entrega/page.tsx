import { prisma } from "@/lib/prisma";
import { calcularResumenInventario } from "@/lib/costeo";
import { marcarLineaEntregada } from "@/app/(app)/ordenes/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PendientesEntregaPage() {
  const [lineas, resumen] = await Promise.all([
    prisma.ordenLinea.findMany({
      where: { entregado: false },
      include: { producto: true, orden: { include: { cliente: true } } },
      orderBy: { fechaEstimada: "asc" },
    }),
    calcularResumenInventario(),
  ]);

  const listas = lineas.filter(
    (l) => (resumen.get(l.productoId)?.stockActual ?? 0) >= l.cantidadBotellas,
  );
  const sinStock = lineas.filter((l) => !listas.includes(l));

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/ordenes" className="text-sm text-wine underline">
          ← Volver a Órdenes
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">📦 Pendientes de entregar</h1>
        <p className="text-muted text-sm">
          Vinos que ya vendiste pero todavía no le entregaste al cliente.
        </p>
      </div>

      {listas.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-ok">✅ Ya puedes entregar</h2>
          <ListaLineas lineas={listas} />
        </div>
      )}

      {sinStock.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-muted">⏳ Todavía sin stock</h2>
          <ListaLineas lineas={sinStock} />
        </div>
      )}

      {lineas.length === 0 && (
        <p className="p-6 text-center text-muted text-sm rounded-lg border border-border bg-surface">
          No tienes entregas pendientes.
        </p>
      )}
    </div>
  );
}

type LineaPendiente = {
  id: string;
  cantidadBotellas: number;
  fechaEstimada: Date | null;
  producto: { nombre: string; fotoUrl: string | null };
  orden: { id: string; folio: string; cliente: { nombre: string } };
};

function ListaLineas({ lineas }: { lineas: LineaPendiente[] }) {
  return (
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
    </div>
  );
}
