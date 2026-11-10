import { prisma } from "@/lib/prisma";
import { formatoMXN, totalOrden } from "@/lib/costeo";
import { SubmitButton } from "@/components/SubmitButton";
import { repartirCostoEnviosDia } from "@/app/(app)/ordenes/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

/** Día en la Ciudad de México como YYYY-MM-DD. */
function diaMexico(fecha: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(fecha);
}

export default async function EnviosDelDiaPage({ searchParams }: PageProps<"/ordenes/envios">) {
  const { fecha } = await searchParams;
  const dia = typeof fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : diaMexico(new Date());
  // Órdenes cuya fecha cae en ese día (hora de México), con envío cobrado o ya con costo capturado.
  const inicio = new Date(`${dia}T00:00:00-06:00`);
  const fin = new Date(`${dia}T23:59:59.999-06:00`);
  const ordenes = await prisma.orden.findMany({
    where: { fecha: { gte: inicio, lte: fin } },
    include: { lineas: true, cliente: true },
    orderBy: { createdAt: "asc" },
  });
  const conEnvio = ordenes.filter((o) => o.envioCobrado > 0 || o.envioCosto !== null);
  const sinEnvio = ordenes.filter((o) => !(o.envioCobrado > 0 || o.envioCosto !== null));
  const costoDia = conEnvio.reduce((acc, o) => acc + (o.envioCosto ?? 0), 0);
  const cobradoDia = conEnvio.reduce((acc, o) => acc + o.envioCobrado, 0);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link href="/ordenes" className="text-sm text-wine underline">← Volver a Órdenes</Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Envíos del día</h1>
        <p className="text-muted text-sm">Captura cuánto te costaron los envíos de un día y se reparte en partes iguales entre las órdenes de ese día.</p>
      </div>

      <form className="flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-muted">Día</span>
          <input type="date" name="fecha" defaultValue={dia} className="rounded-md border border-border bg-surface px-3 py-2" />
        </label>
        <button type="submit" className="rounded-md border border-border bg-surface px-4 py-2 font-medium">Ver</button>
      </form>

      <form action={repartirCostoEnviosDia} className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <input type="hidden" name="fecha" value={dia} />
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">{new Date(`${dia}T12:00:00-06:00`).toLocaleDateString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "full" })}</h2>
          <span className="text-xs text-muted whitespace-nowrap">Cobrado {formatoMXN(cobradoDia)} · Costo {formatoMXN(costoDia)}</span>
        </div>
        {ordenes.length === 0 ? (
          <p className="text-sm text-muted">No hay órdenes con fecha de ese día.</p>
        ) : (
          <div className="divide-y divide-border">
            {ordenes.map((o) => (
              <label key={o.id} className="py-2.5 flex items-center gap-3 text-sm cursor-pointer">
                <input type="checkbox" name="ordenId" value={o.id} defaultChecked={o.envioCobrado > 0 || o.envioCosto !== null} className="h-4 w-4" />
                <span className="flex-1 min-w-0">
                  <span className="font-medium">{o.folio}</span> · {o.cliente.nombre.replace("Cliente Especial - ", "")}
                  <span className="block text-xs text-muted">Orden {formatoMXN(totalOrden(o))} · envío cobrado {formatoMXN(o.envioCobrado)}{o.envioCosto !== null ? ` · costo ${formatoMXN(o.envioCosto)}` : ""}</span>
                </span>
                <Link href={`/ordenes/${o.id}`} className="text-xs text-wine underline whitespace-nowrap">Ver</Link>
              </label>
            ))}
          </div>
        )}
        {ordenes.length > 0 && (
          <>
            <label className="flex flex-col gap-1 text-sm max-w-xs">
              <span className="font-medium">Total que te costaron los envíos ese día (MXN)</span>
              <input name="total" type="number" min="0" step="0.01" required defaultValue={costoDia || ""} className="rounded-md border border-border bg-surface px-3 py-2" />
            </label>
            <p className="text-xs text-muted">Se divide entre las órdenes marcadas (las que no tengan palomita no se tocan). Si una orden ya tenía costo, se reemplaza.</p>
            <SubmitButton className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium self-start" pendingText="Repartiendo...">Repartir entre {conEnvio.length || ordenes.length} orden{(conEnvio.length || ordenes.length) === 1 ? "" : "es"}</SubmitButton>
            {sinEnvio.length > 0 && conEnvio.length > 0 && <p className="text-xs text-muted">{sinEnvio.length} orden{sinEnvio.length === 1 ? "" : "es"} de ese día sin envío cobrado quedan sin palomita; márcalas si también se entregaron.</p>}
          </>
        )}
      </form>
    </div>
  );
}
