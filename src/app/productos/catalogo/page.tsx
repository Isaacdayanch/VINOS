import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: PageProps<"/productos/catalogo">) {
  const params = await searchParams;
  const conPrecios = params.precios === "si";

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
            className="print-item rounded-lg border border-border bg-surface p-3 flex flex-col gap-2 break-inside-avoid"
          >
            <div className="w-full aspect-[3/5] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center p-2">
              {p.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-contain" />
              ) : (
                <span className="text-3xl">🍷</span>
              )}
            </div>
            <div className="border-t border-border pt-2">
              <p className="font-medium text-sm leading-tight">
                {p.nombre} {p.anio ? `(${p.anio})` : ""}
              </p>
              {p.categoria && <p className="text-xs text-muted">{p.categoria}</p>}
              {conPrecios && p.precioLista && (
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
