"use client";

import { useState } from "react";
import { actualizarPreciosProducto } from "@/app/precios/actions";
import { formatoMXN } from "@/lib/costeo";

type ProductoPrecio = {
  id: string;
  nombre: string;
  fotoUrl: string | null;
  sku: string;
  piezasPorCaja: number;
  costoActual: number;
  precioLista: number | null;
  precioDistribuidor: number | null;
};

export function TablaPrecios({ productos }: { productos: ProductoPrecio[] }) {
  return (
    <div className="flex flex-col gap-3">
      {productos.map((p) => (
        <FilaPrecio key={p.id} producto={p} />
      ))}
      {productos.length === 0 && (
        <p className="p-6 text-center text-muted text-sm rounded-lg border border-border bg-surface">
          Todavía no tienes productos activos.
        </p>
      )}
    </div>
  );
}

function Margen({ costo, precio }: { costo: number; precio: number | "" }) {
  if (precio === "" || precio <= 0) {
    return <p className="text-xs text-muted mt-1">Pon un precio para ver el margen</p>;
  }
  const ganancia = precio - costo;
  const margenPct = (ganancia / precio) * 100;
  const bien = ganancia > 0;
  return (
    <p className={`text-xs mt-1 font-medium ${bien ? "text-ok" : "text-warn"}`}>
      {bien ? "Ganas " : "Pierdes "}
      {formatoMXN(Math.abs(ganancia))} · {margenPct.toFixed(0)}% de margen
    </p>
  );
}

function FilaPrecio({ producto: p }: { producto: ProductoPrecio }) {
  const [precioLista, setPrecioLista] = useState<number | "">(p.precioLista ?? "");
  const [precioDistribuidor, setPrecioDistribuidor] = useState<number | "">(
    p.precioDistribuidor ?? "",
  );
  const accion = actualizarPreciosProducto.bind(null, p.id);

  return (
    <form action={accion} className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
          {p.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-contain" />
          ) : (
            <span className="text-lg">🍷</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{p.nombre}</p>
          <p className="text-xs text-muted">
            {p.sku} · Costo actual: {formatoMXN(p.costoActual)}/botella
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Precio de venta</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              $
            </span>
            <input
              name="precioLista"
              type="number"
              step="0.01"
              min="0"
              value={precioLista}
              onChange={(e) =>
                setPrecioLista(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-md border border-border bg-surface pl-7 pr-3 py-2"
            />
          </div>
          <Margen costo={p.costoActual} precio={precioLista} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Precio distribuidor</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              $
            </span>
            <input
              name="precioDistribuidor"
              type="number"
              step="0.01"
              min="0"
              value={precioDistribuidor}
              onChange={(e) =>
                setPrecioDistribuidor(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-md border border-border bg-surface pl-7 pr-3 py-2"
            />
          </div>
          <Margen costo={p.costoActual} precio={precioDistribuidor} />
        </label>
      </div>

      <button
        type="submit"
        className="self-start rounded-md bg-wine text-white px-3 py-1.5 text-sm font-medium"
      >
        Guardar
      </button>
    </form>
  );
}
