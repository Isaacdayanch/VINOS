import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/productos" className="text-sm text-wine underline">
          ← Volver a Productos
        </Link>
        <BotonImprimir />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-wine">Catálogo de Vinos</h1>
        <p className="text-muted text-sm">
          Toca &quot;Guardar como PDF&quot; para mandarlo a tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-2 break-inside-avoid"
          >
            <div className="w-full aspect-square rounded-md bg-wine-light overflow-hidden flex items-center justify-center">
              {p.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🍷</span>
              )}
            </div>
            <div>
              <p className="font-medium text-sm leading-tight">
                {p.nombre} {p.anio ? `(${p.anio})` : ""}
              </p>
              {p.categoria && <p className="text-xs text-muted">{p.categoria}</p>}
              {p.precioLista && (
                <p className="text-sm font-semibold text-wine mt-1">
                  {formatoMXN(p.precioLista)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
