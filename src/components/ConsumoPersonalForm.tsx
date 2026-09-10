"use client";

import { useMemo, useState } from "react";
import { crearConsumoPersonal } from "@/app/finanzas/actions";
import { DateField } from "@/components/DateField";
import { ProductoPicker } from "@/components/ProductoPicker";
import { formatoMXN } from "@/lib/costeo";

type Producto = { id: string; nombre: string; fotoUrl: string | null; piezasPorCaja: number };
type Socio = { id: string; nombre: string };

export function ConsumoPersonalForm({
  productos,
  socios,
  costoPorProducto,
  hoy,
}: {
  productos: Producto[];
  socios: Socio[];
  costoPorProducto: Record<string, number>;
  hoy: string;
}) {
  const [productoId, setProductoId] = useState("");
  const [botellas, setBotellas] = useState<number | "">(1);
  const [repuso, setRepuso] = useState(false);
  const [montoRepuesto, setMontoRepuesto] = useState<number | "">("");

  const costoEstimado = useMemo(() => {
    const cantidad = botellas === "" ? 0 : botellas;
    return cantidad * (costoPorProducto[productoId] ?? 0);
  }, [botellas, productoId, costoPorProducto]);

  return (
    <form action={crearConsumoPersonal} className="flex flex-col gap-4">
      <ProductoPicker
        name="productoId"
        productos={productos}
        sinSeleccionInicial
        onSeleccionar={(p) => {
          setProductoId(p.id);
          if (repuso) {
            const cantidad = botellas === "" ? 0 : botellas;
            setMontoRepuesto(cantidad * (costoPorProducto[p.id] ?? 0));
          }
        }}
      />

      <DateField name="fecha" label="Fecha" defaultValue={hoy} />

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Botellas</span>
        <input
          name="botellas"
          type="number"
          step="1"
          min="1"
          value={botellas}
          onChange={(e) => {
            const v = e.target.value === "" ? "" : Number(e.target.value);
            setBotellas(v);
            if (repuso) {
              const cantidad = v === "" ? 0 : v;
              setMontoRepuesto(cantidad * (costoPorProducto[productoId] ?? 0));
            }
          }}
          className="rounded-md border border-border bg-surface px-3 py-2"
          required
        />
      </label>

      {productoId && costoEstimado > 0 && (
        <p className="text-xs text-muted -mt-2">
          Costo aproximado de esto: <span className="font-medium">{formatoMXN(costoEstimado)}</span>
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">¿Quién se la llevó?</span>
        <select
          name="quien"
          className="rounded-md border border-border bg-surface px-3 py-2"
          required
        >
          {socios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
          <option value="COMPARTIDO">Isaac y Beto (se la repartieron)</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm rounded-md border border-border bg-surface px-3 py-2">
        <input
          type="checkbox"
          checked={repuso}
          onChange={(e) => {
            setRepuso(e.target.checked);
            if (e.target.checked && montoRepuesto === "") {
              setMontoRepuesto(costoEstimado > 0 ? costoEstimado : "");
            }
          }}
          className="rounded border-border"
        />
        <span>Ya puse ese dinero de vuelta en Caja/Cuenta</span>
      </label>

      {repuso && (
        <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Monto que repusiste</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                $
              </span>
              <input
                name="montoRepuesto"
                type="number"
                step="0.01"
                min="0"
                value={montoRepuesto}
                onChange={(e) =>
                  setMontoRepuesto(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded-md border border-border bg-surface pl-7 pr-3 py-2"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">¿Dónde lo pusiste?</span>
            <select
              name="cuentaRepuesto"
              defaultValue="EFECTIVO"
              className="rounded-md border border-border bg-surface px-3 py-2"
            >
              <option value="EFECTIVO">Efectivo (a Caja)</option>
              <option value="CUENTA">Cuenta / tarjeta</option>
            </select>
          </label>
          <p className="text-xs text-muted">
            Este dinero se suma a tu saldo y ya no genera deuda contra tu socio por esta botella.
          </p>
        </div>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Notas (opcional)</span>
        <input name="notas" className="rounded-md border border-border bg-surface px-3 py-2" />
      </label>

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        Registrar
      </button>
    </form>
  );
}
