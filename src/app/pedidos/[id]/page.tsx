import {
  actualizarPedido,
  agregarLineaPedido,
  desmarcarLineaRecibida,
  eliminarLineaPedido,
  marcarLineaRecibida,
} from "@/app/pedidos/actions";
import { AgregarLineaPedidoForm } from "@/components/AgregarLineaPedidoForm";
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
  const [pedido, productos] = await Promise.all([
    prisma.pedido.findUnique({
      where: { id },
      include: { entradas: { include: { producto: true }, orderBy: { createdAt: "asc" } } },
    }),
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  if (!pedido) notFound();

  const hoy = new Date().toISOString().slice(0, 10);
  const guardarPedido = actualizarPedido.bind(null, pedido.id);
  const agregarLinea = agregarLineaPedido.bind(null, pedido.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/pedidos" className="text-sm text-wine underline">
          ← Volver a Pedidos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">{pedido.folio}</h1>
        <p className="text-muted text-sm">
          {new Date(pedido.fecha).toLocaleDateString("es-MX")}
        </p>
      </div>

      <details className="rounded-lg border border-border bg-surface">
        <summary className="p-4 cursor-pointer text-sm font-medium">
          Proveedor y costos de importación
          {pedido.proveedor ? ` — ${pedido.proveedor}` : ""}
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
                  {l.cajasRecibidas} caja{l.cajasRecibidas === 1 ? "" : "s"} × ${l.costoPorCaja} USD
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
  step?: string;
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
