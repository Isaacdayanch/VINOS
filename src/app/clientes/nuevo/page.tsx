import { crearCliente } from "@/app/clientes/actions";
import Link from "next/link";

export default function NuevoClientePage() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/clientes" className="text-sm text-wine underline">
          ← Volver a Clientes
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo cliente</h1>
      </div>

      <form action={crearCliente} className="flex flex-col gap-4">
        <Campo label="Nombre" name="nombre" required />
        <Campo label="Teléfono" name="telefono" />
        <Campo label="Email" name="email" type="email" />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Categoría de precio (por default)</span>
          <select
            name="categoriaPrecio"
            defaultValue="DESCUENTO_GRANDE"
            className="rounded-md border border-border bg-surface px-3 py-2"
          >
            <option value="LISTA">Precio de lista</option>
            <option value="DESCUENTO_CHICO">Descuento chico</option>
            <option value="DESCUENTO_GRANDE">Descuento grande</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Notas</span>
          <textarea
            name="notas"
            rows={3}
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>

        <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
          Crear cliente
        </button>
      </form>
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-border bg-surface px-3 py-2"
      />
    </label>
  );
}
