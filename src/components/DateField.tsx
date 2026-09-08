"use client";

import { useEffect, useRef, useState } from "react";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS = ["D", "L", "M", "M", "J", "V", "S"];

function aISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function desdeISO(iso?: string | null): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function DateField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label?: string;
  defaultValue?: string;
}) {
  const inicial = desdeISO(defaultValue) ?? new Date();
  const [seleccion, setSeleccion] = useState<Date | null>(desdeISO(defaultValue));
  const [mesVisible, setMesVisible] = useState(
    new Date(inicial.getFullYear(), inicial.getMonth(), 1),
  );
  const [abierto, setAbierto] = useState(false);
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

  const primerDiaSemana = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1).getDay();
  const diasEnMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
  const celdas: (number | null)[] = [];
  for (let i = 0; i < primerDiaSemana; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

  const hoy = new Date();

  function cambiarMes(delta: number) {
    setMesVisible(new Date(mesVisible.getFullYear(), mesVisible.getMonth() + delta, 1));
  }

  return (
    <div className="flex flex-col gap-1 text-sm relative" ref={contenedorRef}>
      {label && <span className="font-medium">{label}</span>}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-md border border-border bg-surface px-3 py-2 text-left flex items-center justify-between gap-2"
      >
        <span className={seleccion ? "" : "text-muted"}>
          {seleccion
            ? seleccion.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
            : "Selecciona una fecha"}
        </span>
        <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
          <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
          <path d="M3.5 10h17M8 3v3.5M16 3v3.5" />
        </svg>
      </button>
      <input type="hidden" name={name} value={seleccion ? aISO(seleccion) : ""} />

      {abierto && (
        <div className="absolute top-full left-0 z-30 mt-1 w-72 rounded-2xl border border-border bg-surface shadow-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior"
              className="w-7 h-7 rounded-full hover:bg-wine-light/50 text-wine flex items-center justify-center"
            >
              ‹
            </button>
            <span className="font-semibold text-sm capitalize">
              {MESES[mesVisible.getMonth()]} {mesVisible.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              aria-label="Mes siguiente"
              className="w-7 h-7 rounded-full hover:bg-wine-light/50 text-wine flex items-center justify-center"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-muted mb-1">
            {DIAS.map((d, i) => (
              <span key={i} className="h-6 flex items-center justify-center">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {celdas.map((d, i) => {
              if (d === null) return <span key={i} />;
              const fecha = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), d);
              const esSeleccionado = seleccion !== null && aISO(seleccion) === aISO(fecha);
              const esHoy = aISO(hoy) === aISO(fecha);
              return (
                <div key={i} className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSeleccion(fecha);
                      setAbierto(false);
                    }}
                    className={`w-8 h-8 rounded-full text-sm transition-colors ${
                      esSeleccionado
                        ? "bg-wine text-white font-semibold"
                        : esHoy
                          ? "border border-wine text-wine"
                          : "hover:bg-wine-light/50"
                    }`}
                  >
                    {d}
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setSeleccion(hoy);
              setMesVisible(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
              setAbierto(false);
            }}
            className="mt-2 w-full text-center text-xs text-wine underline py-1"
          >
            Hoy
          </button>
        </div>
      )}
    </div>
  );
}
