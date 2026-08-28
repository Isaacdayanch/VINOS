import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const etiquetaCategoria: Record<string, string> = {
  LISTA: "Precio de lista",
  DESCUENTO_CHICO: "Descuento chico",
  DESCUENTO_GRANDE: "Descuento grande",
};

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wine">Clientes</h1>
          <p className="text-muted text-sm">Tu catálogo de clientes</p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
        >
          + Nuevo
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {clientes.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{c.nombre.replace("Cliente Especial - ", "")}</p>
              <p className="text-xs text-muted">
                {c.telefono ?? "Sin teléfono"} · {etiquetaCategoria[c.categoriaPrecio]}
              </p>
            </div>
          </div>
        ))}
        {clientes.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes clientes.{" "}
            <Link href="/clientes/nuevo" className="text-wine underline">
              Crea el primero
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
