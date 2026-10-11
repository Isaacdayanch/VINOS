"use client";

import { useState } from "react";
import { actualizarPreciosProducto } from "@/app/(app)/precios/actions";
import { formatoMXN } from "@/lib/costeo";

type ProductoPrecio = {
  id: string;
  nombre: string;
  fotoUrl: string | null;
  sku: string;
  piezasPorCaja: number;
  costoActual: number;
  precioLista: number | null;
  precioDescuentoChico: number | null;
  precioDescuentoGrande: number | null;
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

function CampoPrecio({
  label,
  caption,
  name,
  value,
  onChange,
  costo,
}: {
  label: string;
  caption: string;
  name: string;
  value: number | "";
  onChange: (v: number | "") => void;
  costo: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          $
        </span>
        <input
          name={name}
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full rounded-md border border-border bg-surface pl-7 pr-3 py-2"
        />
      </div>
      <p className="text-[11px] text-muted leading-snug">{caption}</p>
      <Margen costo={costo} precio={value} />
    </label>
  );
}

function FilaPrecio({ producto: p }: { producto: ProductoPrecio }) {
  const [precioLista, setPrecioLista] = useState<number | "">(p.precioLista ?? "");
  const [precioDescuentoChico, setPrecioDescuentoChico] = useState<number | "">(
    p.precioDescuentoChico ?? "",
  );
  const [precioDescuentoGrande, setPrecioDescuentoGrande] = useState<number | "">(
    p.precioDescuentoGrande ?? "",
  );
  const [precioDistribuidor, setPrecioDistribuidor] = useState<number | "">(
    p.precioDistribuidor ?? "",
  );
  const [estado, setEstado] = useState<"listo" | "guardando" | "guardado" | "error">("listo");
  const accion = actualizarPreciosProducto.bind(null, p.id);

  async function guardar(formData: FormData) {
    setEstado("guardando");
    try {
      await accion(formData);
      setEstado("guardado");
      setTimeout(() => setEstado("listo"), 2000);
    } catch {
      setEstado("error");
    }
  }

  return (
    <form action={guardar} className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
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
        <CampoPrecio
          label="Precio de lista"
          caption="Catálogo público + clientes categoría Lista"
          name="precioLista"
          value={precioLista}
          onChange={setPrecioLista}
          costo={p.costoActual}
        />
        <CampoPrecio
          label="Descuento chico"
          caption="Clientes categoría Descuento chico"
          name="precioDescuentoChico"
          value={precioDescuentoChico}
          onChange={setPrecioDescuentoChico}
          costo={p.costoActual}
        />
        <CampoPrecio
          label="Descuento grande"
          caption="Clientes categoría Descuento grande"
          name="precioDescuentoGrande"
          value={precioDescuentoGrande}
          onChange={setPrecioDescuentoGrande}
          costo={p.costoActual}
        />
        <CampoPrecio
          label="Precio distribuidor"
          caption="Notas de consignación a distribuidores"
          name="precioDistribuidor"
          value={precioDistribuidor}
          onChange={setPrecioDistribuidor}
          costo={p.costoActual}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={estado === "guardando"}
          className="self-start rounded-md bg-wine text-white px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors hover:bg-wine-dark active:bg-wine-dark active:scale-[0.97] disabled:opacity-60 disabled:cursor-default"
        >
          {estado === "guardando" ? "Guardando..." : "Guardar"}
        </button>
        {estado === "guardado" && (
          <span className="text-sm font-medium text-ok">✓ Guardado</span>
        )}
        {estado === "error" && (
          <span className="text-sm font-medium text-warn">No se pudo guardar, intenta de nuevo</span>
        )}
      </div>
    </form>
  );
}
