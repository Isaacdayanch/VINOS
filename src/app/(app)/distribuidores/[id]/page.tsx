import { eliminarDistribuidor, marcarListoEvento } from "@/app/(app)/distribuidores/actions";
import { BotonEliminarConfirmado } from "@/components/BotonEliminarConfirmado";
import { SubmitButton } from "@/components/SubmitButton";
import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function pendienteLinea(l: { cantidadBotellas: number; botellasPagadas: number; botellasDevueltas: number; precioUnitario: number }) {
  return (l.cantidadBotellas - l.botellasPagadas - l.botellasDevueltas) * l.precioUnitario;
}

export default async function DetalleDistribuidorPage({
  params,
}: PageProps<"/distribuidores/[id]">) {
  const { id } = await params;
  const distribuidor = await prisma.distribuidor.findUnique({
    where: { id },
    include: {
      notasConsignacion: {
        include: { lineas: true, cobros: true },
        orderBy: { fecha: "desc" },
      },
      cliente: true,
    },
  });
  if (!distribuidor) notFound();

  let total = 0;
  let cobrado = 0;
  let pendiente = 0;
  for (const n of distribuidor.notasConsignacion) {
    total += n.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
    cobrado += n.cobros.reduce((acc, c) => acc + c.monto, 0);
    pendiente += n.lineas.reduce((acc, l) => acc + pendienteLinea(l), 0);
  }
  const eliminar = eliminarDistribuidor.bind(null, distribuidor.id);
  const esEvento = distribuidor.tipo === "EVENTO";

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <div className="flex items-center justify-between gap-3">
          <Link href="/distribuidores" className="text-sm text-wine underline">
            ← Volver a Consignación
          </Link>
          {distribuidor.notasConsignacion.length === 0 && (
            <BotonEliminarConfirmado
              action={eliminar}
              mensaje={`¿Seguro que quieres eliminar a ${distribuidor.nombre}?`}
            >
              Eliminar {esEvento ? "evento" : "distribuidor"}
            </BotonEliminarConfirmado>
          )}
        </div>
        <h1 className="text-2xl font-bold text-wine mt-2">{distribuidor.nombre}</h1>
        <p className="text-muted text-sm">
          {esEvento ? "Evento" : "Distribuidor"}
          {distribuidor.telefono ? ` · ${distribuidor.telefono}` : ""}
        </p>
        {distribuidor.cliente && (
          <p className="text-sm mt-1">
            Cliente vinculado:{" "}
            <Link href={`/clientes/${distribuidor.cliente.id}`} className="text-wine underline">
              {distribuidor.cliente.nombre.replace("Cliente Especial - ", "")}
            </Link>
          </p>
        )}
        {distribuidor.notas && <p className="text-muted text-sm mt-1">{distribuidor.notas}</p>}
        {distribuidor.notasConsignacion.length > 0 && (
          <p className="text-xs text-muted mt-2">
            Para eliminar, primero elimina todas sus notas de consignación (nada más se puede si
            no tienen pagos ni devoluciones registradas).
          </p>
        )}
      </div>

      {esEvento && distribuidor.fechaEvento && (
        <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">
              Fecha del evento: {distribuidor.fechaEvento.toLocaleDateString("es-MX")}
            </p>
            <p className="text-xs text-muted mt-1">
              {distribuidor.listoEvento ? "✓ Ya estás listo para cuadrarlo" : "Todavía no marcas que estás listo"}
            </p>
          </div>
          <form action={marcarListoEvento.bind(null, distribuidor.id, !distribuidor.listoEvento)}>
            <SubmitButton
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                distribuidor.listoEvento
                  ? "border border-border text-muted"
                  : "bg-wine text-white"
              }`}
              pendingText="..."
            >
              {distribuidor.listoEvento ? "Marcar como no listo" : "Ya estoy listo"}
            </SubmitButton>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-border bg-wine-light p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total en consignación</span>
          <span className="font-bold text-wine text-lg">{formatoMXN(total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Cobrado</span>
          <span>{formatoMXN(cobrado)}</span>
        </div>
        {pendiente > 0.5 && (
          <div className="flex items-center justify-between text-sm text-warn">
            <span>Pendiente (ni pagado ni devuelto)</span>
            <span>{formatoMXN(pendiente)}</span>
          </div>
        )}
      </div>

      <Link
        href={`/distribuidores/${distribuidor.id}/nueva-nota`}
        className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm text-center"
      >
        + Nueva nota de consignación
      </Link>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {distribuidor.notasConsignacion.map((n) => {
          const totalNota = n.lineas.reduce(
            (acc, l) => acc + l.cantidadBotellas * l.precioUnitario,
            0,
          );
          const pendienteNota = n.lineas.reduce((acc, l) => acc + pendienteLinea(l), 0);
          return (
            <Link
              key={n.id}
              href={`/notas-consignacion/${n.id}`}
              className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{n.folio}</p>
                <p className="text-xs text-muted">
                  {new Date(n.fecha).toLocaleDateString("es-MX")} ·{" "}
                  {pendienteNota > 0.5 ? "Pendiente" : "Resuelta"}
                </p>
              </div>
              <span className="font-semibold text-wine whitespace-nowrap">
                {formatoMXN(totalNota)}
              </span>
            </Link>
          );
        })}
        {distribuidor.notasConsignacion.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no le has hecho ninguna nota de consignación.
          </p>
        )}
      </div>
    </div>
  );
}
