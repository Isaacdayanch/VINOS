"use client";

import { useMemo, useState } from "react";
import { crearOrden } from "@/app/ordenes/actions";

type Cliente = { id: string; nombre: string };
type Producto = { id: string; nombre: string; piezasPorCaja: number };
type Linea = { productoId: string; cantidadBotellas: number; precioUnitario: number };

export function OrdenForm({
  clientes,
  productos,
  preciosPorClienteProducto,
  clienteIdInicial,
}: {
  clientes: Cliente[];
  productos: Producto[];
  preciosPorClienteProducto: Record<string, Record<string, number>>;
  clienteIdInicial?: string;
}) {
  const [clienteId, setClienteId] = useState(clienteIdInicial ?? clientes[0]?.id ?? "");
  const [fecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [lineas, setLineas] = useState<Linea[]>([{ productoId: "", cantidadBotellas: 1, precioUnitario: 0 }]);

  const precioSugerido = (cId: string, pId: string) =>
    preciosPorClienteProducto[cId]?.[pId] ?? 0;

  function actualizarLinea(index: number, cambios: Partial<Linea>) {
    setLineas((prev) =>
      prev.map((l, i) => {
        if (i !== index) return l;
        const nueva = { ...l, ...cambios };
        if (cambios.productoId !== undefined) {
          nueva.precioUnitario = precioSugerido(clienteId, cambios.productoId);
        }
        return nueva;
      }),
    );
  }

  function cambiarCliente(nuevoClienteId: string) {
    setClienteId(nuevoClienteId);
    setLineas((prev) =>
      prev.map((l) =>
        l.productoId ? { ...l, precioUnitario: precioSugerido(nuevoClienteId, l.productoId) } : l,
      ),
    );
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, { productoId: "", cantidadBotellas: 1, precioUnitario: 0 }]);
  }

  function quitarLinea(index: number) {
    setLineas((prev) => prev.filter((_, i) => i !== index));
  }

  const total = useMemo(
    () => lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0),
    [lineas],
  );

  return (
    <form action={crearOrden} className="flex flex-col gap-4">
      <input type="hidden" name="fecha" value={fecha} />
      <input type="hidden" name="lineas" value={JSON.stringify(lineas)} />

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Cliente</span>
        <select
          name="clienteId"
          value={clienteId}
          onChange={(e) => cambiarCliente(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2"
          required
        >
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre.replace("Cliente Especial - ", "")}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Vinos</p>
        {lineas.map((l, i) => (
          <div key={i} className="rounded-lg border border-border p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <select
                value={l.productoId}
                onChange={(e) => actualizarLinea(i, { productoId: e.target.value })}
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm min-w-0"
              >
                <option value="">Elige un vino…</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              {lineas.length > 1 && (
                <button
                  type="button"
                  onClick={() => quitarLinea(i)}
                  className="text-muted hover:text-wine text-sm px-2"
                  aria-label="Quitar vino"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-muted">Botellas</span>
                <input
                  type="number"
                  min={1}
                  value={l.cantidadBotellas}
                  onChange={(e) => actualizarLinea(i, { cantidadBotellas: Number(e.target.value) })}
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-muted">Precio por botella</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={l.precioUnitario}
                  onChange={(e) => actualizarLinea(i, { precioUnitario: Number(e.target.value) })}
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={agregarLinea}
          className="text-sm text-wine underline text-left"
        >
          + Agregar otro vino
        </button>
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-4 flex items-center justify-between">
        <span className="font-medium">Total</span>
        <span className="font-bold text-wine text-lg">
          {total.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })}
        </span>
      </div>

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        Crear orden
      </button>
    </form>
  );
}
