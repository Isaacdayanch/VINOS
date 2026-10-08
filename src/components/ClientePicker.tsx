"use client";

import { useEffect, useRef, useState } from "react";

type ClienteOpcion = {
  id: string;
  nombre: string;
  codigo?: string | null;
  categoriaPrecio?: string;
};

const ETIQUETA_CATEGORIA: Record<string, string> = {
  LISTA: "Precio de lista",
  DESCUENTO_CHICO: "Descuento chico",
  DESCUENTO_GRANDE: "Descuento grande",
};

export function ClientePicker({
  name,
  label = "Cliente",
  clientes,
  value,
  onChange,
}: {
  name: string;
  label?: string;
  clientes: ClienteOpcion[];
  value: string;
  onChange: (clienteId: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
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

  const seleccionado = clientes.find((c) => c.id === value) ?? null;
  const nombreLimpio = (n: string) => n.replace("Cliente Especial - ", "");
  const filtrados = clientes.filter((c) => {
    const texto = `${nombreLimpio(c.nombre)} ${c.codigo ?? ""}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-1.5 text-sm relative" ref={contenedorRef}>
      <span className="font-semibold text-base">{label}</span>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-xl border-2 border-wine/30 bg-surface px-4 py-3 flex items-center gap-3 text-left shadow-sm hover:border-wine/60 active:scale-[0.99] transition-all"
      >
        <span className="w-9 h-9 rounded-full bg-wine-light flex items-center justify-center text-base shrink-0">
          👤
        </span>
        {seleccionado ? (
          <span className="flex-1 min-w-0">
            <span className="block truncate font-medium text-base">
              {nombreLimpio(seleccionado.nombre)}
            </span>
            {seleccionado.codigo && (
              <span className="block text-xs text-muted">{seleccionado.codigo}</span>
            )}
          </span>
        ) : (
          <span className="text-muted flex-1">Selecciona un cliente</span>
        )}
        <span className="text-muted shrink-0 text-lg">▾</span>
      </button>
      <input type="hidden" name={name} value={value} />

      {abierto && (
        <div className="absolute top-full left-0 z-30 mt-1 w-full min-w-72 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cliente por nombre o código..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtrados.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(c.id);
                  setAbierto(false);
                  setBusqueda("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-wine-light/50 ${
                  c.id === value ? "bg-wine-light/40" : ""
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-wine-light flex items-center justify-center text-sm shrink-0">
                  👤
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {nombreLimpio(c.nombre)}
                  </span>
                  <span className="block text-xs text-muted truncate">
                    {[c.codigo, c.categoriaPrecio ? ETIQUETA_CATEGORIA[c.categoriaPrecio] : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </button>
            ))}
            {filtrados.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
