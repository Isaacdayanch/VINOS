import { registrarLiquidacionConsignacion, eliminarNotaConsignacion } from "@/app/(app)/distribuidores/actions";
import { BotonEliminarConfirmado } from "@/components/BotonEliminarConfirmado";
import { LiquidacionConsignacionForm } from "@/components/LiquidacionConsignacionForm";
import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DetalleNotaConsignacionPage({
  params,
}: PageProps<"/notas-consignacion/[id]">) {
  const { id } = await params;
  const nota = await prisma.notaConsignacion.findUnique({
    where: { id },
    include: {
      lineas: { include: { producto: true } },
      distribuidor: true,
      cobros: { orderBy: { fecha: "desc" } },
    },
  });
  if (!nota) notFound();

  const total = nota.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
  const cobrado = nota.cobros.reduce((acc, c) => acc + c.monto, 0);
  const pendiente = nota.lineas.reduce(
    (acc, l) => acc + (l.cantidadBotellas - l.botellasPagadas - l.botellasDevueltas) * l.precioUnitario,
    0,
  );
  const totalDevuelto = nota.lineas.reduce((acc, l) => acc + l.botellasDevueltas, 0);
  const hoy = new Date().toISOString().slice(0, 10);
  const liquidar = registrarLiquidacionConsignacion.bind(null, nota.id);
  const eliminar = eliminarNotaConsignacion.bind(null, nota.id);
  const sinActividad =
    nota.cobros.length === 0 && nota.lineas.every((l) => l.botellasPagadas === 0 && l.botellasDevueltas === 0);

  const lineasPendientes = nota.lineas
    .map((l) => ({
      id: l.id,
      productoNombre: l.producto.nombre,
      pendiente: l.cantidadBotellas - l.botellasPagadas - l.botellasDevueltas,
      precioUnitario: l.precioUnitario,
    }))
    .filter((l) => l.pendiente > 0);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={`/distribuidores/${nota.distribuidorId}`} className="text-sm text-wine underline">
          ← Volver a {nota.distribuidor.nombre}
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-bold text-wine">{nota.folio}</h1>
          <span className="text-sm text-muted">
            {new Date(nota.fecha).toLocaleDateString("es-MX")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-muted text-sm">{nota.distribuidor.nombre}</p>
          <div className="flex items-center gap-3">
            <Link
              href={`/notas-consignacion/${nota.id}/recibo`}
              className="text-sm text-wine underline whitespace-nowrap"
            >
              Ver nota imprimible
            </Link>
            {sinActividad && (
              <BotonEliminarConfirmado
                action={eliminar}
                mensaje={`¿Seguro que quieres eliminar la nota ${nota.folio}? Esto le regresa las botellas al stock, como si nunca hubiera salido.`}
                className="text-sm text-warn underline whitespace-nowrap"
              >
                Eliminar nota
              </BotonEliminarConfirmado>
            )}
          </div>
        </div>
      </div>

      {!sinActividad && (
        <p className="text-xs text-muted -mt-4">
          Esta nota ya tiene pagos o devoluciones registradas, así que ya no se puede eliminar.
        </p>
      )}

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {nota.lineas.map((l) => {
          const pendienteLinea = l.cantidadBotellas - l.botellasPagadas - l.botellasDevueltas;
          return (
            <div key={l.id} className="p-4 flex items-center gap-3">
              <div className="w-10 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
                {l.producto.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.producto.fotoUrl} alt={l.producto.nombre} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-lg">🍷</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{l.producto.nombre}</p>
                <p className="text-xs text-muted">
                  {l.cantidadBotellas} botella{l.cantidadBotellas === 1 ? "" : "s"} × {formatoMXN(l.precioUnitario)}
                </p>
                {(l.botellasPagadas > 0 || l.botellasDevueltas > 0) && (
                  <p className="text-xs text-muted">
                    {l.botellasPagadas > 0 ? `${l.botellasPagadas} pagada${l.botellasPagadas === 1 ? "" : "s"}` : ""}
                    {l.botellasPagadas > 0 && l.botellasDevueltas > 0 ? " · " : ""}
                    {l.botellasDevueltas > 0 ? `${l.botellasDevueltas} devuelta${l.botellasDevueltas === 1 ? "" : "s"}` : ""}
                    {pendienteLinea > 0 ? ` · ${pendienteLinea} pendiente${pendienteLinea === 1 ? "" : "s"}` : ""}
                  </p>
                )}
              </div>
              <span className="font-semibold whitespace-nowrap">
                {formatoMXN(l.cantidadBotellas * l.precioUnitario)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-wine text-lg">{formatoMXN(total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Cobrado</span>
          <span>{formatoMXN(cobrado)}</span>
        </div>
        {totalDevuelto > 0 && (
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Devuelto</span>
            <span>{totalDevuelto} botella{totalDevuelto === 1 ? "" : "s"}</span>
          </div>
        )}
        {pendiente > 0 && (
          <div className="flex items-center justify-between text-sm text-warn">
            <span>Pendiente (ni pagado ni devuelto)</span>
            <span>{formatoMXN(pendiente)}</span>
          </div>
        )}
      </div>

      {nota.cobros.length > 0 && (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {nota.cobros.map((c) => (
            <div key={c.id} className="p-3 flex items-center justify-between text-sm">
              <div>
                <p>{new Date(c.fecha).toLocaleDateString("es-MX")}</p>
                <p className="text-xs text-muted">
                  {c.cuenta === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                  {c.cuenta === "CUENTA" && c.comisionPct > 0 ? ` (comisión ${c.comisionPct}%)` : ""}
                  {c.metodoPago ? ` · ${c.metodoPago}` : ""}
                </p>
              </div>
              <span className="font-medium">{formatoMXN(c.monto)}</span>
            </div>
          ))}
        </div>
      )}

      {lineasPendientes.length > 0 && (
        <details className="rounded-lg border border-border bg-surface">
          <summary className="p-4 cursor-pointer text-sm font-medium">
            + Registrar pago / devolución
          </summary>
          <div className="p-4 pt-0">
            <p className="text-xs text-muted mb-3">
              Por cada vino, pon cuántas botellas te pagaron y cuántas te regresaron sin vender.
              Las pagadas se cuentan como venta (con su ganancia); las devueltas regresan solas al
              stock.
            </p>
            <LiquidacionConsignacionForm lineas={lineasPendientes} hoy={hoy} action={liquidar} />
          </div>
        </details>
      )}
    </div>
  );
}
