import { calcularResumenDistribuidores, calcularEventosProximos } from "@/lib/consignacion";
import { marcarListoEvento } from "@/app/(app)/distribuidores/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ETIQUETA_TIPO: Record<string, string> = { DISTRIBUIDOR: "Distribuidor", EVENTO: "Evento" };
const FILTROS = ["TODOS", "DISTRIBUIDOR", "EVENTO"] as const;
const ETIQUETA_FILTRO: Record<(typeof FILTROS)[number], string> = {
  TODOS: "Todos",
  DISTRIBUIDOR: "Distribuidores",
  EVENTO: "Eventos",
};

export default async function DistribuidoresPage({
  searchParams,
}: PageProps<"/distribuidores">) {
  const sp = await searchParams;
  const filtroRaw = typeof sp.tipo === "string" ? sp.tipo : "TODOS";
  const filtro = (FILTROS as readonly string[]).includes(filtroRaw)
    ? (filtroRaw as (typeof FILTROS)[number])
    : "TODOS";

  const [distribuidores, eventosProximos] = await Promise.all([
    calcularResumenDistribuidores(),
    calcularEventosProximos(),
  ]);

  const filtrados =
    filtro === "TODOS" ? distribuidores : distribuidores.filter((d) => d.tipo === filtro);
  const eventosPendientes = eventosProximos.filter((e) => !e.listoEvento);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-wine">Consignación</h1>
          <p className="text-muted text-sm">Distribuidores y eventos con mercancía en consignación</p>
        </div>
        <Link
          href="/distribuidores/nuevo"
          className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium whitespace-nowrap"
        >
          + Nuevo
        </Link>
      </div>

      {eventosPendientes.length > 0 && (
        <div className="rounded-lg border border-warn/40 bg-warn-bg p-4 flex flex-col gap-3">
          <p className="font-semibold text-warn">⏰ Tienes evento pronto</p>
          {eventosPendientes.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <Link href={`/distribuidores/${e.id}`} className="font-medium text-wine underline truncate block">
                  {e.nombre}
                </Link>
                <p className="text-xs text-muted">
                  {e.diasFaltantes === 0 ? "Es hoy" : e.diasFaltantes === 1 ? "Es mañana" : `En ${e.diasFaltantes} días`}
                  {" · "}
                  {e.fechaEvento.toLocaleDateString("es-MX")}
                </p>
              </div>
              <form action={marcarListoEvento.bind(null, e.id, true)}>
                <SubmitButton
                  className="rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap"
                  pendingText="..."
                >
                  Ya estoy listo
                </SubmitButton>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {FILTROS.map((t) => (
          <Link
            key={t}
            href={t === "TODOS" ? "/distribuidores" : `/distribuidores?tipo=${t}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
              filtro === t ? "bg-wine text-white" : "bg-surface border border-border text-muted"
            }`}
          >
            {ETIQUETA_FILTRO[t]}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {filtrados.map((d) => (
          <Link
            key={d.id}
            href={`/distribuidores/${d.id}`}
            className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{d.nombre}</p>
              <p className="text-xs text-muted">
                {ETIQUETA_TIPO[d.tipo]}
                {d.tipo === "EVENTO" && d.fechaEvento ? ` · ${d.fechaEvento.toLocaleDateString("es-MX")}` : ""}
                {d.telefono ? ` · ${d.telefono}` : ""}
              </p>
            </div>
            {d.pendiente > 0.5 ? (
              <span className="font-semibold text-warn whitespace-nowrap">
                {formatoMXN(d.pendiente)} pendiente
              </span>
            ) : (
              <span className="text-xs text-ok font-medium whitespace-nowrap">Al corriente</span>
            )}
          </Link>
        ))}
        {filtrados.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes{" "}
            {filtro === "EVENTO" ? "eventos" : filtro === "DISTRIBUIDOR" ? "distribuidores" : "nada aquí"}.{" "}
            <Link href="/distribuidores/nuevo" className="text-wine underline">
              Da de alta el primero
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
