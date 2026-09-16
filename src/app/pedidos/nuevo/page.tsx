import { crearPedido, siguienteFolio } from "@/app/pedidos/actions";
import { DateField } from "@/components/DateField";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevoPedidoPage() {
  const hoy = new Date().toISOString().slice(0, 10);
  const folio = await siguienteFolio();

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/pedidos" className="text-sm text-wine underline">
          ← Volver a Pedidos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo pedido a proveedor</h1>
        <p className="text-muted text-sm">
          Se creará con el folio <span className="font-semibold">{folio}</span>. Después de
          guardar, le vas agregando productos poco a poco según se los vas apartando al
          proveedor.
        </p>
      </div>

      <form action={crearPedido} className="flex flex-col gap-4">
        <Campo label="Proveedor" name="proveedor" placeholder="Ej. Rashbi Wines Corp" />
        <DateField name="fecha" label="Fecha del pedido" defaultValue={hoy} />

        <div className="rounded-lg border border-border p-4 flex flex-col gap-4">
          <p className="text-sm font-medium">Costos de importación (opcional, se pueden editar después)</p>
          <Campo
            label="Tipo de cambio (pesos por dólar)"
            name="tipoCambio"
            type="number"
            step="0.01"
            placeholder="Ej. 17.20"
          />
          <Campo
            label="Costo de envío del proveedor en EE.UU. (USD)"
            name="logisticaUSD"
            type="number"
            step="0.01"
            placeholder="Ej. 465"
          />
          <Campo
            label="Envío y aduana en México (MXN)"
            name="logisticaMXN"
            type="number"
            step="0.01"
            placeholder="Ej. 35000"
          />
          <Campo
            label="Descuento del proveedor (%)"
            name="descuentoPct"
            type="number"
            step="0.1"
            placeholder="Ej. 10"
          />
          <p className="text-xs text-muted">
            El envío y la aduana se reparten solos entre las botellas que vayas marcando como
            recibidas. El descuento se aplica sobre el costo de la mercancía (no sobre el envío)
            y también se reparte solo. Los puedes ir ajustando mientras le mandas dinero al
            proveedor.
          </p>
        </div>

        <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
          Guardar pedido
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
