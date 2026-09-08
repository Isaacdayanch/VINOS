import { crearPago } from "@/app/finanzas/actions";
import { DateField } from "@/components/DateField";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevoPagoPage() {
  const [pedidos, socios] = await Promise.all([
    prisma.pedido.findMany({ orderBy: { fecha: "desc" } }),
    prisma.socio.findMany(),
  ]);
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/finanzas" className="text-sm text-wine underline">
          ← Volver a Finanzas
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Registrar pago o gasto</h1>
        <p className="text-muted text-sm">
          Puede ser un pago a tu proveedor (ligado a un pedido) o un gasto interno del
          negocio (Uber, envíos, etc.).
        </p>
      </div>

      <form action={crearPago} className="flex flex-col gap-4">
        <DateField name="fecha" label="Fecha" defaultValue={hoy} />
        <Campo label="Concepto" name="concepto" placeholder="Ej. Mercancía, flete, Uber, envío" required />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">¿A qué pedido pertenece? (opcional)</span>
          <select name="pedidoId" defaultValue="" className="rounded-md border border-border bg-surface px-3 py-2">
            <option value="">— No es de ningún pedido (gasto interno) —</option>
            {pedidos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.folio} {p.proveedor ? `· ${p.proveedor}` : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Moneda</span>
            <select name="moneda" defaultValue="MXN" className="rounded-md border border-border bg-surface px-3 py-2">
              <option value="MXN">Pesos (MXN)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </label>
          <Campo label="Monto" name="monto" type="number" step="0.01" min="0" required />
        </div>

        <Campo
          label="Tipo de cambio (solo si es en USD)"
          name="tipoCambio"
          type="number"
          step="0.01"
          placeholder="Ej. 17.20"
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">¿De dónde sale el dinero?</span>
          <select name="cuenta" defaultValue="EFECTIVO" className="rounded-md border border-border bg-surface px-3 py-2">
            <option value="EFECTIVO">Caja (efectivo)</option>
            <option value="CUENTA">Cuenta</option>
          </select>
        </label>

        <div className="rounded-lg border border-border p-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">¿Es dinero nuevo o ya estaba en el negocio?</span>
            <select name="origen" defaultValue="REINVERSION" className="rounded-md border border-border bg-surface px-3 py-2">
              <option value="REINVERSION">Reinversión (dinero que ya estaba en Caja/Cuenta)</option>
              <option value="INYECCION_CAPITAL">Inyección de capital (dinero nuevo de un socio)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Si es inyección de capital, ¿quién lo puso?</span>
            <select name="socioId" defaultValue="" className="rounded-md border border-border bg-surface px-3 py-2">
              <option value="">Isaac y Beto (dividido)</option>
              {socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm rounded-lg border border-border p-4">
          <input type="checkbox" name="esMaaser" />
          <span>
            <span className="font-medium">Es Maaser (diezmo)</span>
            <br />
            <span className="text-muted text-xs">
              No cuenta como inversión del negocio; se resta de lo que debes de Maaser.
            </span>
          </span>
        </label>

        <Campo label="Método de pago (opcional)" name="metodoPago" placeholder="Ej. Transferencia" />
        <Campo label="Notas (opcional)" name="notas" />

        <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
          Guardar
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
  defaultValue?: string;
  placeholder?: string;
  step?: string;
  min?: string;
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
