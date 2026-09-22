"use client";

import { useState } from "react";
import { actualizarPrecioCliente } from "@/app/(app)/clientes/actions";

type Fila = {
  productoId: string;
  nombre: string;
  fotoUrl: string | null;
  precio: number;
  esPersonalizado: boolean;
};

export function PreciosClienteTabla({
  clienteId,
  filas,
}: {
  clienteId: string;
  filas: Fila[];
}) {
  return (
    <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
      {filas.map((f) => (
        <FilaPrecioCliente key={f.productoId} clienteId={clienteId} fila={f} />
      ))}
      {filas.length === 0 && (
        <p className="p-6 text-center text-muted text-sm">No tienes productos activos.</p>
      )}
    </div>
  );
}

function FilaPrecioCliente({ clienteId, fila: f }: { clienteId: string; fila: Fila }) {
  const [precio, setPrecio] = useState<number | "">(f.precio || "");
  const [estado, setEstado] = useState<"listo" | "guardando" | "guardado" | "error">("listo");
  const accion = actualizarPrecioCliente.bind(null, clienteId, f.productoId);

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
    <form action={guardar} className="p-3 flex items-center gap-3">
      <div className="w-8 aspect-[2/3] rounded bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
        {f.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.fotoUrl} alt={f.nombre} className="w-full h-full object-contain" />
        ) : (
          <span className="text-base">🍷</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-sm">{f.nombre}</p>
        <p className="text-xs text-muted">
          {f.esPersonalizado ? "Precio especial para este cliente" : "Precio de lista (sin personalizar)"}
        </p>
      </div>
      <div className="relative w-24 shrink-0">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted text-sm">
          $
        </span>
        <input
          name="precio"
          type="number"
          step="0.01"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full rounded-md border border-border bg-surface pl-5 pr-2 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={estado === "guardando"}
        className="shrink-0 rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-wine-dark active:bg-wine-dark active:scale-[0.97] disabled:opacity-60 disabled:cursor-default"
      >
        {estado === "guardando" ? "..." : "Guardar"}
      </button>
      {estado === "guardado" && <span className="text-xs font-medium text-ok shrink-0">✓</span>}
      {estado === "error" && (
        <span className="text-xs font-medium text-warn shrink-0">Error</span>
      )}
    </form>
  );
}
