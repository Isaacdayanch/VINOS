import { PreciosClienteTabla } from "@/components/PreciosClienteTabla";
import { DateField } from "@/components/DateField";
import { calcularEstadoCuentaCliente, formatoMXN } from "@/lib/costeo";
import { asegurarCodigoCliente } from "@/lib/clienteCodigo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marcarLineaEntregada } from "@/app/(app)/ordenes/actions";
import { registrarAbono } from "@/app/(app)/clientes/actions";

export const dynamic = "force-dynamic";

const etiquetaCategoria: Record<string, string> = {
  LISTA: "Precio de lista",
  DESCUENTO_CHICO: "Descuento chico",
  DESCUENTO_GRANDE: "Descuento grande",
};

export default async function DetalleClientePage({
  params,
}: PageProps<"/clientes/[id]">) {
  const { id } = await params;

  const [cliente, ordenes, productos, preciosGuardados, abonos, estadoCuenta] = await Promise.all([
    prisma.cliente.findUnique({ where: { id } }),
    prisma.orden.findMany({
      where: { clienteId: id },
      include: { lineas: { include: { producto: true } }, cobros: true },
      orderBy: { fecha: "desc" },
    }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.precioClienteProducto.findMany({ where: { clienteId: id } }),
    prisma.abonoCliente.findMany({ where: { clienteId: id }, orderBy: { fecha: "desc" } }),
    calcularEstadoCuentaCliente(id),
  ]);
  if (!cliente) notFound();
  const codigo = await asegurarCodigoCliente(cliente);
  const hoy = new Date().toISOString().slice(0, 10);
  const accionAbono = registrarAbono.bind(null, cliente.id);

  const lineasPendientes = ordenes.flatMap((o) =>
    o.lineas
      .filter((l) => !l.entregado)
      .map((l) => ({ ...l, ordenFolio: o.folio, ordenId: o.id })),
  );

  const precioPorProducto = new Map(preciosGuardados.map((pg) => [pg.productoId, pg.precio]));
  const filasPrecios = productos.map((p) => ({
    productoId: p.id,
    nombre: p.nombre,
    fotoUrl: p.fotoUrl,
    precio: precioPorProducto.get(p.id) ?? p.precioLista ?? 0,
    esPersonalizado: precioPorProducto.has(p.id),
  }));

  const { totalFacturado, totalCobrado, totalPendiente } = estadoCuenta;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/clientes" className="text-sm text-wine underline">
          ← Volver a Clientes
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">
          {cliente.nombre.replace("Cliente Especial - ", "")}
        </h1>
        <p className="text-muted text-sm">
          {codigo} · {cliente.telefono ?? "Sin teléfono"} · {etiquetaCategoria[cliente.categoriaPrecio]}
        </p>
        {cliente.notas && <p className="text-muted text-sm mt-1">{cliente.notas}</p>}
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total facturado</span>
          <span className="font-bold text-wine text-lg">{formatoMXN(totalFacturado)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Cobrado</span>
          <span>{formatoMXN(totalCobrado)}</span>
        </div>
        {totalPendiente > 0.5 && (
          <div className="flex items-center justify-between text-sm text-warn">
            <span>Pendiente</span>
            <span>{formatoMXN(totalPendiente)}</span>
          </div>
        )}
        {totalPendiente < -0.5 && (
          <div className="flex items-center justify-between text-sm text-ok">
            <span>Saldo a favor del cliente</span>
            <span>{formatoMXN(Math.abs(totalPendiente))}</span>
          </div>
        )}
        <Link
          href={`/clientes/${cliente.id}/estado-cuenta`}
          className="text-xs text-wine underline mt-1 w-fit"
        >
          Ver / mandar estado de cuenta →
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Abonos a cuenta</h2>
        <p className="text-xs text-muted -mt-1">
          Dinero que te manda el cliente sin ser para una orden específica — se descuenta del
          total que te debe en general, no de una orden en particular.
        </p>
        {abonos.length > 0 && (
          <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
            {abonos.map((a) => (
              <div key={a.id} className="p-3 flex items-center justify-between text-sm">
                <div>
                  <p>{new Date(a.fecha).toLocaleDateString("es-MX")}</p>
                  <p className="text-xs text-muted">
                    {a.cuenta === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                    {a.cuenta === "CUENTA" && a.comisionPct > 0 ? ` (comisión ${a.comisionPct}%)` : ""}
                    {a.metodoPago ? ` · ${a.metodoPago}` : ""}
                  </p>
                </div>
                <span className="font-medium">{formatoMXN(a.monto)}</span>
              </div>
            ))}
          </div>
        )}
        <details className="rounded-lg border border-border bg-surface">
          <summary className="p-4 cursor-pointer text-sm font-medium">+ Registrar abono</summary>
          <form action={accionAbono} className="p-4 pt-0 flex flex-col gap-4">
            <DateField name="fecha" label="Fecha" defaultValue={hoy} />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Monto (MXN)</span>
              <input
                name="monto"
                type="number"
                step="0.01"
                min="0"
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
                <option value="CUENTA">Transferencia</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Comisión % (solo si fue por Transferencia)</span>
              <input
                name="comisionPct"
                type="number"
                step="0.1"
                min="0"
                defaultValue={0.6}
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
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Notas (opcional)</span>
              <input
                name="notas"
                className="rounded-md border border-border bg-surface px-3 py-2"
              />
            </label>
            <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm">
              Registrar abono
            </button>
          </form>
        </details>
      </div>

      {lineasPendientes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">📦 Pendientes de entregar</h2>
          <p className="text-xs text-muted -mt-1">
            Vinos que ya vendiste en una orden pero todavía no tienes en stock. Se marcan al
            crear o editar una orden — no descuentan inventario hasta que le des &quot;Ya se la
            entregué&quot;.
          </p>
          <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
            {lineasPendientes.map((l) => (
              <div key={l.id} className="p-3 flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {l.cantidadBotellas}× {l.producto.nombre}
                  </p>
                  <p className="text-xs text-muted">
                    {l.ordenFolio} ·{" "}
                    {l.fechaEstimada
                      ? `Llega ${new Date(l.fechaEstimada).toLocaleDateString("es-MX")}`
                      : "Sin fecha estimada"}
                  </p>
                </div>
                <form action={marcarLineaEntregada.bind(null, l.id, l.ordenId)}>
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
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Precios que le has dado</h2>
        <p className="text-xs text-muted -mt-1">
          Ajusta aquí el precio de cada vino para este cliente en particular — así se guarda su
          perfil y se lo vas a sugerir en su próxima orden. Déjalo vacío para volver al precio de
          lista.
        </p>
        <PreciosClienteTabla clienteId={cliente.id} filas={filasPrecios} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Historial de recibos</h2>
          <Link href="/ordenes/nueva" className="text-xs text-wine underline whitespace-nowrap">
            + Nueva orden
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {ordenes.map((o) => {
            const total = o.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
            const cobrado = o.cobros.reduce((acc, c) => acc + c.monto, 0);
            const pendiente = total - cobrado;
            return (
              <Link
                key={o.id}
                href={`/ordenes/${o.id}`}
                className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{o.folio}</p>
                  <p className="text-xs text-muted">
                    {new Date(o.fecha).toLocaleDateString("es-MX")} ·{" "}
                    {pendiente > 0.5 ? "Pendiente" : "Pagado"}
                  </p>
                </div>
                <span className="font-semibold text-wine whitespace-nowrap">{formatoMXN(total)}</span>
              </Link>
            );
          })}
          {ordenes.length === 0 && (
            <p className="p-6 text-center text-muted text-sm">
              Todavía no le has hecho ninguna orden a este cliente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
