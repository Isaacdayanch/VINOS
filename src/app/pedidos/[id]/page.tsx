import {
  actualizarPedido,
  agregarAbonoPedido,
  agregarLineaPedido,
  desmarcarLineaRecibida,
  eliminarLineaPedido,
  marcarLineaRecibida,
} from "@/app/pedidos/actions";
import { AgregarLineaPedidoForm } from "@/components/AgregarLineaPedidoForm";
import { DateField } from "@/components/DateField";
import { montoEnMXN, formatoMXN } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DetallePedidoPage({
  params,
  searchParams,
}: PageProps<"/pedidos/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const nuevoProducto = typeof sp.nuevoProducto === "string" ? sp.nuevoProducto : undefined;
  const [pedido, productos, socios, pagos] = await Promise.all([
    prisma.pedido.findUnique({
      where: { id },
      include: { entradas: { include: { producto: true }, orderBy: { createdAt: "asc" } } },
    }),
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.socio.findMany(),
    prisma.pago.findMany({
      where: { pedidoId: id },
      include: { socio: true },
      orderBy: { fecha: "desc" },
    }),
  ]);
  if (!pedido) notFound();

  const hoy = new Date().toISOString().slice(0, 10);
  const guardarPedido = actualizarPedido.bind(null, pedido.id);
  const agregarLinea = agregarLineaPedido.bind(null, pedido.id);
  const agregarAbono = agregarAbonoPedido.bind(null, pedido.id);

  const totalAbonadoMXN = pagos.reduce(
    (acc, p) => acc + montoEnMXN(p.moneda, p.monto, p.tipoCambio),
    0,
  );
  const totalAbonadoUSD = pagos
    .filter((p) => p.moneda === "USD")
    .reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/pedidos" className="text-sm text-wine underline">
          ← Volver a Pedidos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">{pedido.folio}</h1>
        <p className="text-muted text-sm">
          {new Date(pedido.fecha).toLocaleDateString("es-MX")}
          {pedido.proveedor ? ` · ${pedido.proveedor}` : ""}
        </p>
      </div>

      <details className="rounded-lg border border-border bg-surface">
        <summary className="p-4 cursor-pointer text-sm font-medium">
          Proveedor y costos de importación
        </summary>
        <form action={guardarPedido} className="p-4 pt-0 flex flex-col gap-4">
          <Campo label="Proveedor" name="proveedor" defaultValue={pedido.proveedor ?? undefined} />
          <Campo
            label="Tipo de cambio (pesos por dólar)"
            name="tipoCambio"
            type="number"
            step="0.01"
            defaultValue={pedido.tipoCambio?.toString()}
          />
          <Campo
            label="Flete + seguro en dólares (USD)"
            name="logisticaUSD"
            type="number"
            step="0.01"
            defaultValue={pedido.logisticaUSD?.toString()}
          />
          <Campo
            label="Aduana + maniobras en pesos (MXN)"
            name="logisticaMXN"
            type="number"
            step="0.01"
            defaultValue={pedido.logisticaMXN?.toString()}
          />
          <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm">
            Guardar cambios
          </button>
        </form>
      </details>

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Dinero abonado a este pedido</p>
          <p className="text-right">
            <span className="font-bold text-wine">{formatoMXN(totalAbonadoMXN)}</span>
            {totalAbonadoUSD > 0 && (
              <span className="block text-xs text-muted">
                (incluye ${totalAbonadoUSD.toLocaleString("es-MX")} USD)
              </span>
            )}
          </p>
        </div>

        {pagos.length > 0 && (
          <div className="rounded-md border border-border divide-y divide-border overflow-hidden">
            {pagos.map((p) => (
              <div key={p.id} className="p-3 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="text-xs text-muted">
                    {new Date(p.fecha).toLocaleDateString("es-MX")}
                    {p.socio ? ` · ${p.socio.nombre}` : p.dividido ? " · Isaac y Beto" : ""}
                  </p>
                  {p.notas && <p className="truncate">{p.notas}</p>}
                </div>
                <span className="font-medium whitespace-nowrap">
                  {p.moneda === "USD" ? `$${p.monto} USD` : formatoMXN(p.monto)}
                </span>
              </div>
            ))}
          </div>
        )}

        <details>
          <summary className="cursor-pointer text-sm font-medium text-wine">
            + Abonar dinero a este pedido
          </summary>
          <form action={agregarAbono} className="mt-4 flex flex-col gap-4">
            <DateField name="fecha" label="Fecha" defaultValue={hoy} />

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Monto" name="monto" type="number" step="0.01" min="0" required />
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Moneda</span>
                <select
                  name="moneda"
                  defaultValue="USD"
                  className="rounded-md border border-border bg-surface px-3 py-2"
                >
                  <option value="USD">Dólares (USD)</option>
                  <option value="MXN">Pesos (MXN)</option>
                </select>
              </label>
            </div>

            <Campo
              label="Tipo de cambio (solo si es en USD)"
              name="tipoCambio"
              type="number"
              step="0.01"
              defaultValue={pedido.tipoCambio?.toString()}
              placeholder="Ej. 17.20"
            />

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">¿Quién lo pagó?</span>
              <select
                name="socioId"
                defaultValue=""
                className="rounded-md border border-border bg-surface px-3 py-2"
              >
                <option value="">Isaac y Beto (dividido)</option>
                {socios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>

            <Campo label="Nota / memo (opcional)" name="notas" placeholder="Ej. transferencia, referencia..." />

            <details className="rounded-md border border-border p-3">
              <summary className="cursor-pointer text-xs font-medium text-muted">
                Detalles contables (opcional)
              </summary>
              <div className="mt-3 flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">¿De dónde sale el dinero?</span>
                  <select
                    name="cuenta"
                    defaultValue="CUENTA"
                    className="rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <option value="CUENTA">Cuenta</option>
                    <option value="EFECTIVO">Caja (efectivo)</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">¿Es dinero nuevo o ya estaba en el negocio?</span>
                  <select
                    name="origen"
                    defaultValue="REINVERSION"
                    className="rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <option value="REINVERSION">Reinversión (ya estaba en Caja/Cuenta)</option>
                    <option value="INYECCION_CAPITAL">Inyección de capital (dinero nuevo)</option>
                  </select>
                </label>
              </div>
            </details>

            <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm">
              Registrar abono
            </button>
          </form>
        </details>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {pedido.entradas.map((l) => {
          const marcarRecibida = marcarLineaRecibida.bind(null, pedido.id, l.id);
          const desmarcar = desmarcarLineaRecibida.bind(null, pedido.id, l.id);
          const eliminar = eliminarLineaPedido.bind(null, pedido.id, l.id);
          return (
            <div key={l.id} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-wine-light overflow-hidden flex items-center justify-center shrink-0">
                {l.producto.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.producto.fotoUrl} alt={l.producto.nombre} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">🍷</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{l.producto.nombre}</p>
                <p className="text-xs text-muted">
                  {l.cajasRecibidas} caja{l.cajasRecibidas === 1 ? "" : "s"} × {l.piezasPorCaja}{" "}
                  = {l.cajasRecibidas * l.piezasPorCaja} botellas · ${l.costoPorCaja} USD/caja
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {l.recibida ? (
                  <>
                    <span className="text-xs font-medium text-wine">✓ Recibido</span>
                    <form action={desmarcar}>
                      <button type="submit" className="text-xs text-muted underline">
                        Deshacer
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <form action={marcarRecibida}>
                      <button
                        type="submit"
                        className="rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap"
                      >
                        Marcar recibido
                      </button>
                    </form>
                    <form action={eliminar}>
                      <button type="submit" className="text-xs text-muted underline">
                        Quitar
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {pedido.entradas.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no le has agregado productos a este pedido.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-4">
        <p className="text-sm font-medium">+ Agregar producto al pedido</p>
        <AgregarLineaPedidoForm
          action={agregarLinea}
          productos={productos}
          nuevoHref={`/productos/nuevo?volver=${encodeURIComponent(`/pedidos/${pedido.id}`)}${
            pedido.proveedor ? `&proveedor=${encodeURIComponent(pedido.proveedor)}` : ""
          }`}
          seleccionInicial={nuevoProducto}
          hoy={hoy}
        />
        {productos.length === 0 && (
          <p className="text-sm text-warn">
            Todavía no tienes productos.{" "}
            <Link href={`/productos/nuevo?volver=/pedidos/${pedido.id}`} className="underline">
              Crea uno primero
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  step?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        className="rounded-md border border-border bg-surface px-3 py-2"
        {...rest}
      />
    </label>
  );
}
