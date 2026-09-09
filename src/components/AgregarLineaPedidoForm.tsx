"use client";

import { useState } from "react";
import { DateField } from "@/components/DateField";
import { ProductoPicker } from "@/components/ProductoPicker";

type ProductoOpcion = {
  id: string;
  nombre: string;
  fotoUrl: string | null;
  piezasPorCaja: number;
};

export function AgregarLineaPedidoForm({
  action,
  productos,
  nuevoHref,
  seleccionInicial,
  hoy,
}: {
  action: (formData: FormData) => void;
  productos: ProductoOpcion[];
  nuevoHref: string;
  seleccionInicial?: string;
  hoy: string;
}) {
  const inicial =
    productos.find((p) => p.id === seleccionInicial) ?? productos[0] ?? null;
  const [piezasPorCaja, setPiezasPorCaja] = useState(inicial?.piezasPorCaja ?? 12);
  const [cajas, setCajas] = useState<number | "">("");

  const totalBotellas = cajas === "" ? 0 : Number(cajas) * piezasPorCaja;

  return (
    <form action={action} className="flex flex-col gap-4">
      <ProductoPicker
        name="productoId"
        productos={productos}
        nuevoHref={nuevoHref}
        seleccionInicial={seleccionInicial}
        onSeleccionar={(p) => setPiezasPorCaja(p.piezasPorCaja)}
      />

      <DateField name="fecha" label="Fecha en que lo apartaste" defaultValue={hoy} />

      <div className="grid grid-cols-2 gap-4">
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
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Piezas por caja</span>
          <input
            name="piezasPorCaja"
            type="number"
            step="1"
            min="1"
            value={piezasPorCaja}
            onChange={(e) => setPiezasPorCaja(Number(e.target.value) || 0)}
            className="rounded-md border border-border bg-surface px-3 py-2"
            required
          />
        </label>
      </div>

      {cajas !== "" && (
        <p className="text-xs text-muted -mt-2">
          = {totalBotellas} botella{totalBotellas === 1 ? "" : "s"}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Costo por caja (USD)</span>
        <input
          name="costoPorCaja"
          type="number"
          step="0.01"
          min="0"
          className="rounded-md border border-border bg-surface px-3 py-2"
          required
        />
      </label>

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        Agregar al pedido
      </button>
    </form>
  );
}
