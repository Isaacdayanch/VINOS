import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, calcularStockPorUbicacion, stockEnUbicacion } from "@/lib/costeo";
import { repartirStockUbicaciones } from "@/app/(app)/stock/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RepartirStockPage() {
  const [productos, ubicaciones, resumen, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
  ]);

  if (ubicaciones.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-lg">
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <p className="text-sm text-warn">
          Primero necesitas crear al menos una ubicación.{" "}
          <Link href="/stock/ubicaciones" className="underline">
            Créala aquí
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Repartir stock por bodega</h1>
        <p className="text-muted text-sm">
          Por cada vino, pon cuántas botellas hay en cada bodega — lo que ya sabes de tu conteo
          físico. No tienes que llenar todos, solo los que quieras corregir. Al final le picas
          &quot;Guardar&quot; una sola vez.
        </p>
        {ubicaciones.length === 2 && (
          <p className="text-xs text-muted mt-1">
            ¿Solo tienes el conteo de una bodega?{" "}
            <Link href="/stock/repartir-rapido" className="text-wine underline">
              Usa el reparto rápido
            </Link>{" "}
            — pones esa nada más y el resto se carga solo a la otra.
          </p>
        )}
      </div>

      <form action={repartirStockUbicaciones} className="flex flex-col gap-3">
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {productos.map((p) => {
            const consolidado = resumen.get(p.id)?.stockActual ?? 0;
            return (
              <div key={p.id} className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
                    {p.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-lg">🍷</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.nombre}</p>
                    <p className="text-xs text-muted">Consolidado hoy: {consolidado} botellas</p>
                  </div>
                </div>
                <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${ubicaciones.length}, minmax(0, 1fr))` }}>
                  {ubicaciones.map((u) => (
                    <label key={u.id} className="flex flex-col gap-1 text-xs">
                      <span className="text-muted truncate">{u.nombre}</span>
                      <input
                        name={`cantidad_${p.id}_${u.id}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={stockEnUbicacion(stockUbicaciones, p.id, u.id)}
                        className="rounded-md border border-border bg-surface px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
          {productos.length === 0 && (
            <p className="p-6 text-center text-muted text-sm">Todavía no tienes productos.</p>
          )}
        </div>

        <button
          type="submit"
          className="rounded-md bg-wine text-white px-4 py-2 font-medium sticky bottom-3"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
