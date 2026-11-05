import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

const COLOR: Record<string, string> = {
  Nuevo: "bg-warn-bg text-warn",
  Confirmado: "bg-wine-light text-wine",
  Entregado: "bg-ok/10 text-ok",
  Cancelado: "bg-border text-muted",
};

export default async function PedidosWebPage({ searchParams }: PageProps<"/pedidos-web">) {
  const { estatus } = await searchParams;
  const filtro = typeof estatus === "string" && estatus in COLOR ? estatus : null;
  const [pedidos, conteos] = await Promise.all([
    prisma.pedidoWeb.findMany({ where: filtro ? { estatus: filtro } : undefined, include: { lineas: true, zona: true }, orderBy: { fecha: "desc" }, take: 200 }),
    prisma.pedidoWeb.groupBy({ by: ["estatus"], _count: { _all: true } }),
  ]);
  const cuenta = (e: string) => conteos.find((c) => c.estatus === e)?._count._all ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-wine">Pedidos en línea</h1>
          <p className="text-muted text-sm">Lo que tus clientes piden desde lacava18.com</p>
        </div>
        <Link href="/tienda" className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-wine-light/40">
          ⚙︎ Tienda en línea
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/pedidos-web" className={`rounded-full text-xs font-medium px-3 py-2 whitespace-nowrap ${!filtro ? "bg-wine text-white" : "border border-border bg-surface"}`}>Todos</Link>
        {Object.keys(COLOR).map((e) => (
          <Link key={e} href={`/pedidos-web?estatus=${e}`} className={`rounded-full text-xs font-medium px-3 py-2 whitespace-nowrap ${filtro === e ? "bg-wine text-white" : "border border-border bg-surface"}`}>
            {e === "Nuevo" ? "Nuevos" : e === "Confirmado" ? "Confirmados" : e === "Entregado" ? "Entregados" : "Cancelados"} · {cuenta(e)}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {pedidos.map((p) => (
          <Link key={p.id} href={`/pedidos-web/${p.id}`} className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40">
            <div className="min-w-0">
              <p className="font-medium truncate">
                {p.folio} · {p.nombre}
              </p>
              <p className="text-xs text-muted truncate">
                {new Date(p.fecha).toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "medium", timeStyle: "short" })} · {p.botellas} botella{p.botellas === 1 ? "" : "s"}
                {p.zona ? ` · ${p.zona.nombre}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${COLOR[p.estatus] ?? "bg-border"}`}>{p.estatus}</span>
              <span className="font-semibold text-wine whitespace-nowrap">{formatoMXN(p.total)}</span>
            </div>
          </Link>
        ))}
        {pedidos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            {filtro ? `No hay pedidos ${filtro.toLowerCase()}s.` : "Todavía no ha llegado ningún pedido desde la página."}
          </p>
        )}
      </div>
    </div>
  );
}
