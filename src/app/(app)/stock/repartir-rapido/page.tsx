import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, calcularStockPorUbicacion, stockEnUbicacion } from "@/lib/costeo";
import { repartirRapidoUbicaciones } from "@/app/(app)/stock/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RepartirRapidoPage({
  searchParams,
}: PageProps<"/stock/repartir-rapido">) {
  const sp = await searchParams;

  const [productos, ubicaciones, resumen, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
  ]);

  if (ubicaciones.length !== 2) {
    return (
      <div className="flex flex-col gap-6 max-w-lg">
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <p className="text-sm text-warn">
          Esta pantalla rápida solo funciona si tienes exactamente 2 ubicaciones (tú tienes{" "}
          {ubicaciones.length}). Usa{" "}
          <Link href="/stock/repartir" className="underline">
            Repartir stock por bodega
          </Link>{" "}
          en su lugar.
        </p>
      </div>
    );
  }

  const manualIdQuery = typeof sp.manual === "string" ? sp.manual : undefined;
  const manual = ubicaciones.find((u) => u.id === manualIdQuery) ?? ubicaciones[0];
  const resto = ubicaciones.find((u) => u.id !== manual.id)!;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Reparto rápido entre 2 bodegas</h1>
        <p className="text-muted text-sm">
          Pon nada más lo que hay en una bodega — lo que falta se carga solo a la otra
          (Consolidado menos lo que pongas aquí).
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Voy a dar los números de:</p>
        <div className="flex gap-2">
          {ubicaciones.map((u) => (
            <Link
              key={u.id}
              href={`/stock/repartir-rapido?manual=${u.id}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                u.id === manual.id ? "bg-wine text-white" : "bg-surface border border-border text-muted"
              }`}
            >
              {u.nombre}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted mt-1">
          El resto se va a cargar automático a <span className="font-medium">{resto.nombre}</span>.
        </p>
      </div>

      <form action={repartirRapidoUbicaciones} className="flex flex-col gap-3">
        <input type="hidden" name="ubicacionManualId" value={manual.id} />

        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {productos.map((p) => {
            const consolidado = resumen.get(p.id)?.stockActual ?? 0;
            const actualManual = stockEnUbicacion(stockUbicaciones, p.id, manual.id);
            return (
              <div key={p.id} className="p-4 flex items-center gap-3">
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
                  <p className="text-xs text-muted">Consolidado: {consolidado} botellas</p>
                </div>
                <label className="flex flex-col gap-1 text-xs shrink-0 w-24">
                  <span className="text-muted truncate">{manual.nombre}</span>
                  <input
                    name={`cantidad_${p.id}`}
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={actualManual}
                    className="rounded-md border border-border bg-surface px-3 py-2"
                  />
                </label>
              </div>
            );
          })}
          {productos.length === 0 && (
            <p className="p-6 text-center text-muted text-sm">Todavía no tienes productos.</p>
          )}
        </div>

        <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
          Guardar
        </button>
      </form>
    </div>
  );
}
