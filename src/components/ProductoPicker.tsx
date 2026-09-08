"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProductoOpcion = {
  id: string;
  nombre: string;
  fotoUrl: string | null;
  piezasPorCaja: number;
};

function FotoChica({ producto }: { producto: ProductoOpcion }) {
  return (
    <div className="w-7 aspect-[2/3] rounded bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-0.5">
      {producto.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={producto.fotoUrl} alt="" className="w-full h-full object-contain" />
      ) : (
        <span className="text-xs">🍷</span>
      )}
    </div>
  );
}

export function ProductoPicker({
  name,
  label = "Producto",
  productos,
  nuevoHref,
  seleccionInicial,
}: {
  name: string;
  label?: string;
  productos: ProductoOpcion[];
  nuevoHref: string;
  seleccionInicial?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState(
    seleccionInicial && productos.some((p) => p.id === seleccionInicial)
      ? seleccionInicial
      : (productos[0]?.id ?? ""),
  );
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function alHacerClic(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", alHacerClic);
    return () => document.removeEventListener("mousedown", alHacerClic);
  }, []);

  const seleccionado = productos.find((p) => p.id === seleccionadoId) ?? null;
  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-1 text-sm relative" ref={contenedorRef}>
      <span className="font-medium">{label}</span>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-md border border-border bg-surface px-3 py-2 flex items-center gap-2 text-left"
      >
        {seleccionado ? (
          <>
            <FotoChica producto={seleccionado} />
            <span className="flex-1 min-w-0 truncate">{seleccionado.nombre}</span>
          </>
        ) : (
          <span className="text-muted flex-1">Selecciona un producto</span>
        )}
        <span className="text-muted shrink-0">▾</span>
      </button>
      <input type="hidden" name={name} value={seleccionadoId} />

      {abierto && (
        <div className="absolute top-full left-0 z-30 mt-1 w-full min-w-72 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtrados.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSeleccionadoId(p.id);
                  setAbierto(false);
                  setBusqueda("");
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-wine-light/50 ${
                  p.id === seleccionadoId ? "bg-wine-light/40" : ""
                }`}
              >
                <FotoChica producto={p} />
                <span className="flex-1 min-w-0 truncate text-sm">{p.nombre}</span>
                <span className="text-xs text-muted whitespace-nowrap">{p.piezasPorCaja}/caja</span>
              </button>
            ))}
            {filtrados.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted">Sin resultados</p>
            )}
          </div>
          <Link
            href={nuevoHref}
            className="border-t border-border px-3 py-2.5 text-sm font-medium text-wine hover:bg-wine-light/50 text-center"
          >
            + Agregar producto nuevo
          </Link>
        </div>
      )}
    </div>
  );
}
