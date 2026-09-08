import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const productos = await prisma.producto.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-wine">Productos</h1>
          <p className="text-muted text-sm">Tu catálogo de vinos</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/productos/nuevo"
            className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium whitespace-nowrap"
          >
            + Nuevo
          </Link>
          <div className="flex gap-3 text-xs">
            <Link href="/productos/catalogo?precios=si" className="text-wine underline whitespace-nowrap">
              Catálogo con precios
            </Link>
            <Link href="/productos/catalogo" className="text-wine underline whitespace-nowrap">
              Catálogo sin precios
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {productos.map((p) => (
          <Link
            key={p.id}
            href={`/productos/${p.id}/editar`}
            className="p-4 flex items-center gap-3 hover:bg-wine-light/40"
          >
            <div className="w-12 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
              {p.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl">🍷</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {p.nombre} {p.anio ? `(${p.anio})` : ""}
              </p>
              <p className="text-xs text-muted">
                {p.sku} · {p.piezasPorCaja} por caja
                {p.categoria ? ` · ${p.categoria}` : ""}
              </p>
            </div>
            {!p.activo && (
              <span className="text-xs text-muted border border-border rounded px-2 py-0.5">
                Inactivo
              </span>
            )}
          </Link>
        ))}
        {productos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes productos.{" "}
            <Link href="/productos/nuevo" className="text-wine underline">
              Crea el primero
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
