"use client";

import { useMemo, useState } from "react";
import { crearOrden } from "@/app/ordenes/actions";
import { crearClienteRapido } from "@/app/clientes/actions";
import { ProductoPicker } from "@/components/ProductoPicker";

type Cliente = { id: string; nombre: string };
type Producto = { id: string; nombre: string; fotoUrl: string | null; piezasPorCaja: number };
type Unidad = "BOTELLAS" | "CAJAS";
type Linea = {
  key: string;
  productoId: string;
  piezasPorCaja: number;
  cantidad: number;
  unidad: Unidad;
  precioUnitario: number;
};

function lineaVacia(): Linea {
  return {
    key: Math.random().toString(36).slice(2),
    productoId: "",
    piezasPorCaja: 1,
    cantidad: 1,
    unidad: "BOTELLAS",
    precioUnitario: 0,
  };
}

export function OrdenForm({
  clientes: clientesIniciales,
  productos,
  preciosPorClienteProducto,
  categoriaPorCliente,
  esUltimoPrecio,
  clienteIdInicial,
  fechaInicial,
  lineasIniciales,
  action,
  botonTexto = "Crear orden",
}: {
  clientes: Cliente[];
  productos: Producto[];
  preciosPorClienteProducto: Record<string, Record<string, number>>;
  categoriaPorCliente: Record<string, string>;
  esUltimoPrecio: Record<string, Record<string, boolean>>;
  clienteIdInicial?: string;
  fechaInicial?: string;
  lineasIniciales?: { productoId: string; cantidadBotellas: number; precioUnitario: number }[];
  action?: (formData: FormData) => void;
  botonTexto?: string;
}) {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [clienteId, setClienteId] = useState(clienteIdInicial ?? clientes[0]?.id ?? "");
  const [fecha] = useState(fechaInicial ?? (() => new Date().toISOString().slice(0, 10))());
  const [lineas, setLineas] = useState<Linea[]>(() => {
    if (!lineasIniciales || lineasIniciales.length === 0) return [lineaVacia()];
    return lineasIniciales.map((l) => ({
      key: Math.random().toString(36).slice(2),
      productoId: l.productoId,
      piezasPorCaja: productos.find((p) => p.id === l.productoId)?.piezasPorCaja ?? 1,
      cantidad: l.cantidadBotellas,
      unidad: "BOTELLAS" as Unidad,
      precioUnitario: l.precioUnitario,
    }));
  });
  const [agregandoCliente, setAgregandoCliente] = useState(false);
  const [nombreNuevoCliente, setNombreNuevoCliente] = useState("");
  const [guardandoCliente, setGuardandoCliente] = useState(false);

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

  async function agregarClienteNuevo() {
    if (!nombreNuevoCliente.trim() || guardandoCliente) return;
    setGuardandoCliente(true);
    try {
      const nuevo = await crearClienteRapido(nombreNuevoCliente);
      setClientes((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setClienteId(nuevo.id);
      setNombreNuevoCliente("");
      setAgregandoCliente(false);
    } finally {
      setGuardandoCliente(false);
    }
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, lineaVacia()]);
  }

  function quitarLinea(index: number) {
    setLineas((prev) => prev.filter((_, i) => i !== index));
  }

  function cantidadBotellas(l: Linea) {
    return l.unidad === "CAJAS" ? l.cantidad * l.piezasPorCaja : l.cantidad;
  }

  const total = useMemo(
    () => lineas.reduce((acc, l) => acc + cantidadBotellas(l) * l.precioUnitario, 0),
    [lineas],
  );

  const lineasParaEnviar = lineas
    .filter((l) => l.productoId && cantidadBotellas(l) > 0)
    .map((l) => ({
      productoId: l.productoId,
      cantidadBotellas: cantidadBotellas(l),
      precioUnitario: l.precioUnitario,
    }));

  return (
    <form action={action ?? crearOrden} className="flex flex-col gap-4">
      <input type="hidden" name="fecha" value={fecha} />
      <input type="hidden" name="lineas" value={JSON.stringify(lineasParaEnviar)} />

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Cliente</span>
        {clientes.length > 0 && (
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
        )}
        {clienteId && categoriaPorCliente[clienteId] && (
          <p className="text-xs text-muted">
            Categoría de precio de este cliente: {categoriaPorCliente[clienteId]}
          </p>
        )}

        {agregandoCliente ? (
          <div className="flex gap-2 mt-1">
            <input
              autoFocus
              value={nombreNuevoCliente}
              onChange={(e) => setNombreNuevoCliente(e.target.value)}
              placeholder="Nombre del cliente nuevo"
              className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={agregarClienteNuevo}
              disabled={guardandoCliente}
              className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              {guardandoCliente ? "..." : "Agregar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAgregandoCliente(false);
                setNombreNuevoCliente("");
              }}
              className="text-sm text-muted underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAgregandoCliente(true)}
            className="text-sm text-wine underline text-left mt-1"
          >
            + Nuevo cliente
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Vinos</p>
        {lineas.map((l, i) => {
          const yaVendido = l.productoId && esUltimoPrecio[clienteId]?.[l.productoId];
          return (
            <div key={l.key} className="rounded-lg border border-border p-3 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <ProductoPicker
                    name={`__producto_${i}`}
                    productos={productos}
                    seleccionInicial={l.productoId || undefined}
                    sinSeleccionInicial={!l.productoId}
                    onSeleccionar={(p) =>
                      actualizarLinea(i, { productoId: p.id, piezasPorCaja: p.piezasPorCaja })
                    }
                  />
                </div>
                {lineas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => quitarLinea(i)}
                    className="text-muted hover:text-wine text-sm px-2 mt-6"
                    aria-label="Quitar vino"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs">
                  <span className="text-muted">Cantidad</span>
                  <input
                    type="number"
                    min={1}
                    value={l.cantidad}
                    onChange={(e) => actualizarLinea(i, { cantidad: Number(e.target.value) })}
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs">
                  <span className="text-muted">Unidad</span>
                  <select
                    value={l.unidad}
                    onChange={(e) => actualizarLinea(i, { unidad: e.target.value as Unidad })}
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  >
                    <option value="BOTELLAS">Botellas</option>
                    <option value="CAJAS">Cajas</option>
                  </select>
                </label>
              </div>
              {l.unidad === "CAJAS" && l.productoId && (
                <p className="text-xs text-muted -mt-1">
                  = {cantidadBotellas(l)} botella{cantidadBotellas(l) === 1 ? "" : "s"} ({l.piezasPorCaja}{" "}
                  por caja)
                </p>
              )}
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
              {l.productoId && (
                <p className="text-xs text-muted -mt-1">
                  {yaVendido
                    ? "Último precio que le diste a este cliente en este vino."
                    : "Precio sugerido según la categoría del cliente."}
                </p>
              )}
            </div>
          );
        })}
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
        {botonTexto}
      </button>
    </form>
  );
}
