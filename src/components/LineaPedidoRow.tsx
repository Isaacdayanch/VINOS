"use client";

import { useState } from "react";
import { DateField } from "@/components/DateField";

export function LineaPedidoRow({
  producto,
  fecha,
  piezasPorCaja: piezasInicial,
  cajasRecibidas: cajasInicial,
  costoPorCaja: costoInicial,
  recibida,
  actualizarAction,
  marcarRecibidaAction,
  desmarcarAction,
  eliminarAction,
}: {
  producto: { nombre: string; fotoUrl: string | null };
  fecha: string;
  piezasPorCaja: number;
  cajasRecibidas: number;
  costoPorCaja: number;
  recibida: boolean;
  actualizarAction: (formData: FormData) => Promise<void>;
  marcarRecibidaAction: (formData: FormData) => void;
  desmarcarAction: (formData: FormData) => void;
  eliminarAction: (formData: FormData) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [piezasPorCaja, setPiezasPorCaja] = useState<number | "">(piezasInicial);
  const [cajas, setCajas] = useState<number | "">(cajasInicial);
  const [costoBotella, setCostoBotella] = useState<number | "">(
    piezasInicial > 0 ? Math.round((costoInicial / piezasInicial) * 100) / 100 : 0,
  );

  const piezas = piezasPorCaja === "" ? 0 : piezasPorCaja;
  const numCajas = cajas === "" ? 0 : cajas;
  const numCostoBotella = costoBotella === "" ? 0 : costoBotella;
  const costoPorCaja = numCostoBotella * piezas;
  const totalBotellas = numCajas * piezas;
  const totalLinea = numCajas * costoPorCaja;

  if (editando) {
    return (
      <div className="p-4 flex flex-col gap-3">
        <p className="font-medium">{producto.nombre}</p>
        <form
          action={async (fd) => {
            await actualizarAction(fd);
            setEditando(false);
          }}
          className="flex flex-col gap-3"
        >
          <DateField name="fecha" label="Fecha" defaultValue={fecha} />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Costo por botella (USD)</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costoBotella}
                onChange={(e) => setCostoBotella(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-md border border-border bg-surface pl-7 pr-3 py-2"
                required
              />
            </div>
          </label>
          <input type="hidden" name="costoPorCaja" value={costoPorCaja} />
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Piezas por caja</span>
              <input
                name="piezasPorCaja"
                type="number"
                step="1"
                min="1"
                value={piezasPorCaja}
                onChange={(e) => setPiezasPorCaja(e.target.value === "" ? "" : Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-3 py-2"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Cajas</span>
              <input
                name="cajasRecibidas"
                type="number"
                step="1"
                min="1"
                value={cajas}
                onChange={(e) => setCajas(e.target.value === "" ? "" : Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-3 py-2"
                required
              />
            </label>
          </div>
          <p className="text-xs text-muted -mt-1">
            = {totalBotellas} botella{totalBotellas === 1 ? "" : "s"} · Total: $
            {totalLinea.toLocaleString("es-MX")} USD
          </p>
          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium">
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="text-sm text-muted underline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-wine-light overflow-hidden flex items-center justify-center shrink-0">
        {producto.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={producto.fotoUrl} alt={producto.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg">🍷</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{producto.nombre}</p>
        <p className="text-xs text-muted">
          {cajasInicial} caja{cajasInicial === 1 ? "" : "s"} × {piezasInicial} ={" "}
          {cajasInicial * piezasInicial} botellas
        </p>
        <p className="text-xs text-muted">
          ${(costoInicial / piezasInicial).toFixed(2)} USD/botella · Total: $
          {(cajasInicial * costoInicial).toLocaleString("es-MX")} USD
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {recibida ? (
          <>
            <span className="text-xs font-medium text-wine">✓ Recibido</span>
            <form action={desmarcarAction}>
              <button type="submit" className="text-xs text-muted underline">
                Deshacer
              </button>
            </form>
          </>
        ) : (
          <form action={marcarRecibidaAction}>
            <button
              type="submit"
              className="rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            >
              Marcar recibido
            </button>
          </form>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={() => setEditando(true)} className="text-xs text-wine underline">
            Editar
          </button>
          {!recibida && (
            <form action={eliminarAction}>
              <button type="submit" className="text-xs text-muted underline">
                Quitar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
