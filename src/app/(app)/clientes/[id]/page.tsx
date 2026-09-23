import { PreciosClienteTabla } from "@/components/PreciosClienteTabla";
import { DateField } from "@/components/DateField";
import { formatoMXN } from "@/lib/costeo";
import { asegurarCodigoCliente } from "@/lib/clienteCodigo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  crearPendienteEntrega,
  marcarPendienteEntregado,
  eliminarPendienteEntrega,
} from "@/app/(app)/clientes/actions";

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

  const [cliente, ordenes, productos, preciosGuardados, pendientesEntrega] = await Promise.all([
    prisma.cliente.findUnique({ where: { id } }),
    prisma.orden.findMany({
      where: { clienteId: id },
      include: { lineas: true, cobros: true },
      orderBy: { fecha: "desc" },
    }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.precioClienteProducto.findMany({ where: { clienteId: id } }),
    prisma.pendienteEntrega.findMany({
      where: { clienteId: id, entregado: false },
      include: { producto: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);
  if (!cliente) notFound();
  const codigo = await asegurarCodigoCliente(cliente);

  const precioPorProducto = new Map(preciosGuardados.map((pg) => [pg.productoId, pg.precio]));
  const filasPrecios = productos.map((p) => ({
    productoId: p.id,
    nombre: p.nombre,
    fotoUrl: p.fotoUrl,
    precio: precioPorProducto.get(p.id) ?? p.precioLista ?? 0,
    esPersonalizado: precioPorProducto.has(p.id),
  }));

  let totalFacturado = 0;
  let totalCobrado = 0;
  for (const o of ordenes) {
    totalFacturado += o.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
    totalCobrado += o.cobros.reduce((acc, c) => acc + c.monto, 0);
  }
  const totalPendiente = totalFacturado - totalCobrado;

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
        <Link
          href={`/clientes/${cliente.id}/estado-cuenta`}
          className="text-xs text-wine underline mt-1 w-fit"
        >
          Ver / mandar estado de cuenta →
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Pendientes de entregar</h2>
        <p className="text-xs text-muted -mt-1">
          Para cuando ya te pagó una botella pero todavía no la tienes en stock (te va a llegar
          después). No descuenta inventario hasta que le des &quot;Ya se la entregué&quot;.
        </p>

        {pendientesEntrega.length > 0 && (
          <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
            {pendientesEntrega.map((p) => {
              const entregar = marcarPendienteEntregado.bind(null, p.id, cliente.id);
              const eliminar = eliminarPendienteEntrega.bind(null, p.id, cliente.id);
              return (
                <div key={p.id} className="p-3 flex items-center gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {p.cantidadBotellas}× {p.producto.nombre}
                    </p>
                    <p className="text-xs text-muted">
                      {p.fechaEstimada
                        ? `Llega ${new Date(p.fechaEstimada).toLocaleDateString("es-MX")}`
                        : "Sin fecha estimada"}
                      {p.notas ? ` · ${p.notas}` : ""}
                    </p>
                  </div>
                  <form action={entregar}>
                    <button
                      type="submit"
                      className="rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-wine-dark active:scale-[0.97] transition-colors"
                    >
                      Ya se la entregué
                    </button>
                  </form>
                  <form action={eliminar}>
                    <button
                      type="submit"
                      className="text-xs text-muted hover:text-warn underline whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}

        <details className="rounded-lg border border-border bg-surface">
          <summary className="p-3 cursor-pointer text-sm font-medium">
            + Registrar pendiente de entrega
          </summary>
          <form
            action={crearPendienteEntrega.bind(null, cliente.id)}
            className="p-3 pt-0 flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Vino</span>
              <select
                name="productoId"
                required
                className="rounded-md border border-border bg-surface px-3 py-2"
              >
                <option value="">Elige un vino</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Cantidad de botellas</span>
              <input
                name="cantidadBotellas"
                type="number"
                min="1"
                defaultValue={1}
                required
                className="rounded-md border border-border bg-surface px-3 py-2"
              />
            </label>
            <DateField name="fechaEstimada" label="Fecha estimada de llegada (opcional)" />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Notas (opcional)</span>
              <input
                name="notas"
                placeholder="Ej. viene en el pedido de octubre"
                className="rounded-md border border-border bg-surface px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium hover:bg-wine-dark active:scale-[0.97] transition-colors"
            >
              Registrar
            </button>
          </form>
        </details>
      </div>

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
