"use client";

import { useMemo, useState } from "react";
import { DateField } from "@/components/DateField";
import { formatoMXN } from "@/lib/costeo";

type Linea = {
  id: string;
  productoNombre: string;
  pendiente: number; // cantidadBotellas - botellasPagadas - botellasDevueltas
  precioUnitario: number;
};

export function LiquidacionConsignacionForm({
  lineas,
  hoy,
  action,
}: {
  lineas: Linea[];
  hoy: string;
  action: (formData: FormData) => void;
}) {
  const [valores, setValores] = useState<Record<string, { pagadas: number | ""; devueltas: number | "" }>>(
    () => Object.fromEntries(lineas.map((l) => [l.id, { pagadas: "", devueltas: "" }])),
  );

  function actualizar(lineaId: string, campo: "pagadas" | "devueltas", valor: number | "") {
    setValores((prev) => ({ ...prev, [lineaId]: { ...prev[lineaId], [campo]: valor } }));
  }

  const movimientos = lineas.map((l) => ({
    lineaId: l.id,
    pagadas: Number(valores[l.id]?.pagadas || 0),
    devueltas: Number(valores[l.id]?.devueltas || 0),
  }));

  const montoTotal = useMemo(
    () =>
      movimientos.reduce((acc, m) => {
        const linea = lineas.find((l) => l.id === m.lineaId);
        return acc + m.pagadas * (linea?.precioUnitario ?? 0);
      }, 0),
    [movimientos, lineas],
  );
  const botellasDevueltasTotal = movimientos.reduce((acc, m) => acc + m.devueltas, 0);
  const hayMovimiento = movimientos.some((m) => m.pagadas > 0 || m.devueltas > 0);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="lineas" value={JSON.stringify(movimientos)} />

      <div className="flex flex-col gap-3">
        {lineas.map((l) => (
          <div key={l.id} className="rounded-lg border border-border p-3 flex flex-col gap-2">
            <p className="text-sm font-medium">
              {l.productoNombre} · {l.pendiente} pendiente{l.pendiente === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-muted">Pagadas ahora</span>
                <input
                  type="number"
                  min={0}
                  max={l.pendiente}
                  value={valores[l.id]?.pagadas ?? ""}
                  onChange={(e) =>
                    actualizar(l.id, "pagadas", e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-muted">Devueltas ahora</span>
                <input
                  type="number"
                  min={0}
                  max={l.pendiente}
                  value={valores[l.id]?.devueltas ?? ""}
                  onChange={(e) =>
                    actualizar(l.id, "devueltas", e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-3 flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Total a cobrar ahora</span>
          <span className="font-bold text-wine">{formatoMXN(montoTotal)}</span>
        </div>
        {botellasDevueltasTotal > 0 && (
          <div className="flex items-center justify-between text-muted">
            <span>Botellas que regresan al stock</span>
            <span>{botellasDevueltasTotal}</span>
          </div>
        )}
      </div>

      {montoTotal > 0 && (
        <>
          <DateField name="fecha" label="Fecha del pago" defaultValue={hoy} />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">¿Dónde te llegó el dinero?</span>
            <select
              name="cuenta"
              defaultValue="EFECTIVO"
              className="rounded-md border border-border bg-surface px-3 py-2"
            >
              <option value="EFECTIVO">Efectivo (a Caja)</option>
              <option value="CUENTA">Transferencia</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Comisión % (solo si fue por Transferencia)</span>
            <input
              name="comisionPct"
              type="number"
              step="0.1"
              min="0"
              defaultValue={0.6}
              className="rounded-md border border-border bg-surface px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Método de pago (opcional)</span>
            <input
              name="metodoPago"
              placeholder="Ej. Transferencia, tarjeta, efectivo"
              className="rounded-md border border-border bg-surface px-3 py-2"
            />
          </label>
        </>
      )}
      {montoTotal === 0 && <input type="hidden" name="fecha" value={hoy} />}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Notas (opcional)</span>
        <input name="notas" className="rounded-md border border-border bg-surface px-3 py-2" />
      </label>

      <button
        type="submit"
        disabled={!hayMovimiento}
        className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm disabled:opacity-50"
      >
        Registrar
      </button>
    </form>
  );
}
