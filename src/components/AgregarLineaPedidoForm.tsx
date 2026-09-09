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
  const [piezasPorCaja, setPiezasPorCaja] = useState<number | "">(inicial?.piezasPorCaja ?? 12);
  const [cajas, setCajas] = useState<number | "">("");
  const [costoBotella, setCostoBotella] = useState<number | "">("");

  const piezas = piezasPorCaja === "" ? 0 : piezasPorCaja;
  const totalBotellas = cajas === "" ? 0 : Number(cajas) * piezas;
  const costoPorCaja = costoBotella === "" ? 0 : Number(costoBotella) * piezas;
  const totalLinea = totalBotellas * (costoBotella === "" ? 0 : Number(costoBotella));

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

      <div className="grid grid-cols-2 gap-4">
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

      {cajas !== "" && (
        <p className="text-xs text-muted -mt-2">
          = {totalBotellas} botella{totalBotellas === 1 ? "" : "s"}
          {costoBotella !== "" && ` · Total: $${totalLinea.toLocaleString("es-MX")} USD`}
        </p>
      )}

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        Agregar al pedido
      </button>
    </form>
  );
}
