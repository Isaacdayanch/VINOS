"use client";

import { useState } from "react";

export function CostosPedidoForm({
  action,
  proveedor,
  tipoCambio,
  logisticaUSD,
  logisticaMXN,
  descuentoPct,
  costoMercanciaBrutoUSD,
}: {
  action: (formData: FormData) => void;
  proveedor?: string;
  tipoCambio?: number | null;
  logisticaUSD?: number | null;
  logisticaMXN?: number | null;
  descuentoPct?: number | null;
  costoMercanciaBrutoUSD: number;
}) {
  const [descuento, setDescuento] = useState<number | "">(descuentoPct ?? "");
  const [envioUSD, setEnvioUSD] = useState<number | "">(logisticaUSD ?? "");

  const descuentoNum = descuento === "" ? 0 : descuento;
  const envioNum = envioUSD === "" ? 0 : envioUSD;
  const costoMercanciaConDescuento = costoMercanciaBrutoUSD * (1 - descuentoNum / 100);
  const totalUSD = costoMercanciaConDescuento + envioNum;

  return (
    <form action={action} className="p-4 pt-0 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Proveedor</span>
        <input
          name="proveedor"
          defaultValue={proveedor}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Tipo de cambio (pesos por dólar)</span>
        <input
          name="tipoCambio"
          type="number"
          step="0.01"
          defaultValue={tipoCambio?.toString()}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Costo de envío del proveedor en EE.UU. (USD)</span>
        <input
          name="logisticaUSD"
          type="number"
          step="0.01"
          value={envioUSD}
          onChange={(e) => setEnvioUSD(e.target.value === "" ? "" : Number(e.target.value))}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Envío y aduana en México (MXN)</span>
        <input
          name="logisticaMXN"
          type="number"
          step="0.01"
          defaultValue={logisticaMXN?.toString()}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Descuento del proveedor (%)</span>
        <input
          name="descuentoPct"
          type="number"
          step="0.1"
          min="0"
          max="100"
          placeholder="Ej. 10"
          value={descuento}
          onChange={(e) => setDescuento(e.target.value === "" ? "" : Number(e.target.value))}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      {costoMercanciaBrutoUSD > 0 && (
        <div className="rounded-md border border-border bg-wine-light/30 p-3 flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Mercancía con descuento</span>
            <span className="font-medium">
              ${costoMercanciaConDescuento.toLocaleString("es-MX", { maximumFractionDigits: 2 })}{" "}
              USD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total (mercancía + envío EE.UU.)</span>
            <span className="font-bold text-wine">
              ${totalUSD.toLocaleString("es-MX", { maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>
      )}

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium text-sm">
        Guardar cambios
      </button>
    </form>
  );
}
