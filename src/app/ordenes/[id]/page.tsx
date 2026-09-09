import { crearCobro } from "@/app/ordenes/actions";
import { DateField } from "@/components/DateField";
import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DetalleOrdenPage({
  params,
}: PageProps<"/ordenes/[id]">) {
  const { id } = await params;
  const orden = await prisma.orden.findUnique({
    where: { id },
    include: {
      lineas: { include: { producto: true } },
      cliente: true,
      cobros: { orderBy: { fecha: "desc" } },
    },
  });
  if (!orden) notFound();

  const total = orden.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
  const cobrado = orden.cobros.reduce((acc, c) => acc + c.monto, 0);
  const pendiente = total - cobrado;
  const hoy = new Date().toISOString().slice(0, 10);
  const registrarCobro = crearCobro.bind(null, orden.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/ordenes" className="text-sm text-wine underline">
          ← Volver a Órdenes
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-bold text-wine">{orden.folio}</h1>
          <span className="text-sm text-muted">
            {new Date(orden.fecha).toLocaleDateString("es-MX")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">
            {orden.cliente.nombre.replace("Cliente Especial - ", "")} · {orden.estatus}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/ordenes/${orden.id}/editar`}
              className="text-sm text-wine underline whitespace-nowrap"
            >
              Editar
            </Link>
            <Link
              href={`/ordenes/${orden.id}/recibo`}
              className="text-sm text-wine underline whitespace-nowrap"
            >
              Ver recibo
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {orden.lineas.map((l) => (
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
            </div>
            <span className="font-semibold whitespace-nowrap">
              {formatoMXN(l.cantidadBotellas * l.precioUnitario)}
            </span>
          </div>
        ))}
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
        {pendiente > 0 && (
          <div className="flex items-center justify-between text-sm text-warn">
            <span>Pendiente</span>
            <span>{formatoMXN(pendiente)}</span>
          </div>
        )}
      </div>

      {orden.cobros.length > 0 && (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {orden.cobros.map((c) => (
            <div key={c.id} className="p-3 flex items-center justify-between text-sm">
              <div>
                <p>{new Date(c.fecha).toLocaleDateString("es-MX")}</p>
                <p className="text-xs text-muted">
                  {c.cuenta === "EFECTIVO" ? "Efectivo" : "Cuenta"}
                  {c.cuenta === "CUENTA" && c.comisionPct > 0 ? ` (comisión ${c.comisionPct}%)` : ""}
                  {c.metodoPago ? ` · ${c.metodoPago}` : ""}
                </p>
              </div>
              <span className="font-medium">{formatoMXN(c.monto)}</span>
            </div>
          ))}
        </div>
      )}

      {pendiente > 0 && (
        <details className="rounded-lg border border-border bg-surface">
          <summary className="p-4 cursor-pointer text-sm font-medium">
            + Registrar cobro
          </summary>
          <form action={registrarCobro} className="p-4 pt-0 flex flex-col gap-4">
            <DateField name="fecha" label="Fecha" defaultValue={hoy} />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Monto (MXN)</span>
              <input
                name="monto"
                type="number"
                step="0.01"
                min="0"
                defaultValue={pendiente}
                className="rounded-md border border-border bg-surface px-3 py-2"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">¿Dónde te llegó el dinero?</span>
              <select
                name="cuenta"
                defaultValue="EFECTIVO"
                className="rounded-md border border-border bg-surface px-3 py-2"
              >
                <option value="EFECTIVO">Efectivo (a Caja)</option>
                <option value="CUENTA">Cuenta / tarjeta</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Comisión % (solo si fue a Cuenta)</span>
              <input
                name="comisionPct"
                type="number"
                step="0.1"
                min="0"
                defaultValue={2}
                className="rounded-md border border-border bg-surface px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Método de pago (opcional)</span>
              <input
                name="metodoPago"
                placeholder="Ej. Transferencia, tarjeta, efectivo"
                className="rounded-md border border-border bg-surface px-3 py-2"
              />
            </label>
            <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm">
              Registrar cobro
            </button>
          </form>
        </details>
      )}
    </div>
  );
}
