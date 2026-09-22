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
    <div>
      <div className="flex items-center justify-between print:hidden mb-6">
        <Link href="/productos" className="text-sm text-wine underline">
          ← Volver a Productos
        </Link>
        <BotonImprimir />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-wine">Catálogo de Vinos</h1>
        <p className="text-muted text-sm">
          Toca &quot;Guardar como PDF&quot; para mandarlo a tus clientes.
        </p>
      </div>

      {/*
        A propósito NO se usa CSS grid/flex aquí: al imprimir, los navegadores
        no reparten bien las tarjetas entre hojas dentro de un grid/flex (el
        bloque entero se brinca de hoja, o se cortan a la mitad aunque tengan
        break-inside:avoid) — con flujo normal + inline-block sí lo respetan.
      */}
      <div>
        {productos.map((p) => (
          <div key={p.id} className="inline-block align-top w-1/2 sm:w-1/3 p-2">
            <div className="print-item rounded-lg border border-border bg-surface p-3 flex flex-col gap-2 break-inside-avoid">
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
          </div>
        ))}
      </div>
    </div>
  );
}
