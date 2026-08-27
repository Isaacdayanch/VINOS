import { crearEntrada } from "@/app/stock/actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevaEntradaPage({
  searchParams,
}: PageProps<"/stock/entradas/nueva">) {
  const params = await searchParams;
  const pedidoIdPreseleccionado =
    typeof params.pedidoId === "string" ? params.pedidoId : undefined;

  const [pedidos, productos] = await Promise.all([
    prisma.pedido.findMany({ orderBy: { fecha: "desc" } }),
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Registrar entrada</h1>
        <p className="text-muted text-sm">
          Anota qué vino llegó, cuántas cajas y su costo. El costo por botella se
          calcula solo.
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm flex flex-col gap-3">
          <p>Todavía no tienes ningún pedido registrado.</p>
          <Link
            href="/stock/pedidos/nuevo"
            className="rounded-md bg-wine text-white px-4 py-2 font-medium text-center"
          >
            + Crear pedido nuevo
          </Link>
        </div>
      ) : (
        <form action={crearEntrada} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Pedido</span>
            <select
              name="pedidoId"
              defaultValue={pedidoIdPreseleccionado ?? pedidos[0].id}
              className="rounded-md border border-border bg-surface px-3 py-2"
              required
            >
              {pedidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.folio} {p.proveedor ? `· ${p.proveedor}` : ""}
                </option>
              ))}
            </select>
          </label>

          <Link
            href="/stock/pedidos/nuevo"
            className="text-sm text-wine underline -mt-2"
          >
            + Es un pedido nuevo
          </Link>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Producto</span>
            <select
              name="productoId"
              className="rounded-md border border-border bg-surface px-3 py-2"
              required
            >
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.piezasPorCaja} por caja)
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Fecha en que llegó</span>
            <input
              name="fecha"
              type="date"
              defaultValue={hoy}
              className="rounded-md border border-border bg-surface px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Cajas recibidas</span>
            <input
              name="cajasRecibidas"
              type="number"
              step="1"
              min="1"
              className="rounded-md border border-border bg-surface px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Costo por caja (USD)</span>
            <input
              name="costoPorCaja"
              type="number"
              step="0.01"
              min="0"
              className="rounded-md border border-border bg-surface px-3 py-2"
              required
            />
          </label>

          <button
            type="submit"
            className="rounded-md bg-wine text-white px-4 py-2 font-medium"
          >
            Registrar entrada
          </button>

          {productos.length === 0 && (
            <p className="text-sm text-warn">
              Todavía no tienes productos.{" "}
              <Link href="/productos/nuevo" className="underline">
                Crea uno primero
              </Link>
              .
            </p>
          )}
        </form>
      )}
    </div>
  );
}
