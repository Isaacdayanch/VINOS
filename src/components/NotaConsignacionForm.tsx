"use client";

import { useMemo, useState } from "react";
import { ProductoPicker } from "@/components/ProductoPicker";

type Producto = {
  id: string;
  nombre: string;
  fotoUrl: string | null;
  piezasPorCaja: number;
  precioDistribuidor: number | null;
};
type Unidad = "BOTELLAS" | "CAJAS";
type Linea = {
  key: string;
  productoId: string;
  piezasPorCaja: number;
  cantidad: number | "";
  unidad: Unidad;
  precioUnitario: number | "";
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

export function NotaConsignacionForm({
  productos,
  stockPorProducto,
  action,
  fechaInicial,
}: {
  productos: Producto[];
  stockPorProducto?: Record<string, number>;
  action: (formData: FormData) => void;
  fechaInicial?: string;
}) {
  const [fecha] = useState(fechaInicial ?? (() => new Date().toISOString().slice(0, 10))());
  const [lineas, setLineas] = useState<Linea[]>([lineaVacia()]);

  function precioSugerido(productoId: string) {
    return productos.find((p) => p.id === productoId)?.precioDistribuidor ?? 0;
  }

  function actualizarLinea(index: number, cambios: Partial<Linea>) {
    setLineas((prev) =>
      prev.map((l, i) => {
        if (i !== index) return l;
        const nueva = { ...l, ...cambios };
        if (cambios.productoId !== undefined) {
          nueva.precioUnitario = precioSugerido(cambios.productoId);
        }
        return nueva;
      }),
    );
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, lineaVacia()]);
  }

  function quitarLinea(index: number) {
    setLineas((prev) => prev.filter((_, i) => i !== index));
  }

  function cantidadBotellas(l: Linea) {
    const cantidad = l.cantidad === "" ? 0 : l.cantidad;
    return l.unidad === "CAJAS" ? cantidad * l.piezasPorCaja : cantidad;
  }

  function precio(l: Linea) {
    return l.precioUnitario === "" ? 0 : l.precioUnitario;
  }

  const total = useMemo(
    () => lineas.reduce((acc, l) => acc + cantidadBotellas(l) * precio(l), 0),
    [lineas],
  );

  const lineasParaEnviar = lineas
    .filter((l) => l.productoId && cantidadBotellas(l) > 0)
    .map((l) => ({
      productoId: l.productoId,
      cantidadBotellas: cantidadBotellas(l),
      precioUnitario: precio(l),
    }));

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="fecha" value={fecha} />
      <input type="hidden" name="lineas" value={JSON.stringify(lineasParaEnviar)} />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Vinos que le das en consignación</p>
        {lineas.map((l, i) => (
          <div key={l.key} className="rounded-lg border border-border p-3 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <ProductoPicker
                  name={`__producto_${i}`}
                  productos={productos}
                  seleccionInicial={l.productoId || undefined}
                  sinSeleccionInicial={!l.productoId}
                  stockPorProducto={stockPorProducto}
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
                  onChange={(e) =>
                    actualizarLinea(i, { cantidad: e.target.value === "" ? "" : Number(e.target.value) })
                  }
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
              <span className="text-muted">Precio por botella (distribuidor)</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={l.precioUnitario}
                  onChange={(e) =>
                    actualizarLinea(i, {
                      precioUnitario: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-border bg-surface pl-7 pr-3 py-2 text-sm"
                />
              </div>
            </label>
          </div>
        ))}
        <button type="button" onClick={agregarLinea} className="text-sm text-wine underline text-left">
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
        Crear nota de consignación
      </button>
    </form>
  );
}
