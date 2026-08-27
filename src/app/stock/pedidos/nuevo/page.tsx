import { crearPedido } from "@/app/stock/actions";
import Link from "next/link";

export default function NuevoPedidoPage() {
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock/entradas/nueva" className="text-sm text-wine underline">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo pedido a proveedor</h1>
        <p className="text-muted text-sm">
          Captura los datos generales del pedido. Luego, en la siguiente pantalla,
          agregas cada vino que llegó y su costo.
        </p>
      </div>

      <form action={crearPedido} className="flex flex-col gap-4">
        <Campo label="Folio del pedido" name="folio" placeholder="Ej. P002" required />
        <Campo label="Proveedor" name="proveedor" placeholder="Ej. Rashbi Wines Corp" />
        <Campo label="Fecha del pedido" name="fecha" type="date" defaultValue={hoy} required />

        <div className="rounded-lg border border-border p-4 flex flex-col gap-4">
          <p className="text-sm font-medium">Costos de importación (opcional)</p>
          <Campo
            label="Tipo de cambio (pesos por dólar)"
            name="tipoCambio"
            type="number"
            step="0.01"
            placeholder="Ej. 17.20"
          />
          <Campo
            label="Flete + seguro en dólares (USD)"
            name="logisticaUSD"
            type="number"
            step="0.01"
            placeholder="Ej. 465"
          />
          <Campo
            label="Aduana + maniobras en pesos (MXN)"
            name="logisticaMXN"
            type="number"
            step="0.01"
            placeholder="Ej. 35000"
          />
          <p className="text-xs text-muted">
            Estos costos se reparten solos entre todas las botellas del pedido para
            calcular el costo real por botella.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-md bg-wine text-white px-4 py-2 font-medium"
        >
          Guardar y agregar vinos
        </button>
      </form>
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        className="rounded-md border border-border bg-surface px-3 py-2"
        {...rest}
      />
    </label>
  );
}
