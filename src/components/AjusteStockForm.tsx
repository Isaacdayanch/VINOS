"use client";

import { useState } from "react";

type Socio = { id: string; nombre: string };

export function AjusteStockForm({
  action,
  stockSistema,
  socios,
}: {
  action: (formData: FormData) => void;
  stockSistema: number;
  socios: Socio[];
}) {
  const [cantidadReal, setCantidadReal] = useState<number | "">(stockSistema);
  const faltan = cantidadReal !== "" && cantidadReal < stockSistema;

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">¿Cuántas botellas tienes en realidad?</span>
        <input
          name="cantidadReal"
          type="number"
          min="0"
          value={cantidadReal}
          onChange={(e) => setCantidadReal(e.target.value === "" ? "" : Number(e.target.value))}
          required
          className="rounded-md border border-border bg-surface px-3 py-2 text-lg"
        />
        <span className="text-xs text-muted">
          Solo pon el número que de verdad contaste — no tienes que calcular la diferencia,
          el sistema la saca sola.
        </span>
      </label>

      {faltan && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">¿Qué pasó con las que faltan?</span>
          <select
            name="socioId"
            defaultValue=""
            className="rounded-md border border-border bg-surface px-3 py-2"
          >
            <option value="">No sé qué pasó (pérdida del negocio)</option>
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                Se las llevó {s.nombre}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted">
            Si se las llevó un socio, se descuenta de su cuenta como consumo personal. Si no
            sabes qué pasó, se registra como pérdida del negocio (se ve en Finanzas).
          </span>
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Motivo (opcional)</span>
        <input
          name="motivo"
          placeholder="Ej. Conteo físico de septiembre"
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-wine text-white px-4 py-2 font-medium hover:bg-wine-dark active:scale-[0.97] transition-colors"
      >
        Guardar ajuste
      </button>
    </form>
  );
}
