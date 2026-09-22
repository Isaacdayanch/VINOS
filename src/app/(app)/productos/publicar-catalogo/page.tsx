import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonPublicarCatalogo } from "@/components/BotonPublicarCatalogo";
import Link from "next/link";

export const dynamic = "force-dynamic";

type ProductoPublicado = {
  nombre: string;
  fotoUrl: string | null;
  categoria: string | null;
  anio: number | null;
  precioLista: number | null;
};

export default async function PublicarCatalogoPage() {
  const [productos, ultimaPublicacion] = await Promise.all([
    prisma.producto.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.catalogoPublicado.findFirst({
      orderBy: { fechaPublicado: "desc" },
    }),
  ]);

  const productosPublicados = (ultimaPublicacion?.productos as unknown as ProductoPublicado[]) ?? [];

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/productos" className="text-sm text-wine underline">
          ← Volver a Productos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Catálogo público</h1>
        <p className="text-muted text-sm">
          Un link aparte, solo con fotos y precios, para mandarle a tus clientes. No tiene
          nada del resto de tu sistema.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <div>
          <p className="font-medium text-sm">
            {ultimaPublicacion
              ? `Última publicación: ${new Date(ultimaPublicacion.fechaPublicado).toLocaleString("es-MX")}`
              : "Todavía no has publicado el catálogo"}
          </p>
          <p className="text-xs text-muted mt-1">
            Al publicar, se congelan los precios de tus {productos.length} productos activos
            de ahorita. Si después cambias precios en Productos, el catálogo público NO se
            mueve solo — tienes que volver a picarle aquí cuando quieras actualizarlo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BotonPublicarCatalogo />
          {ultimaPublicacion && (
            <Link
              href="/catalogo-publico"
              target="_blank"
              className="text-sm text-wine underline whitespace-nowrap"
            >
              Ver catálogo público →
            </Link>
          )}
        </div>
      </div>

      {ultimaPublicacion && (
        <div>
          <h2 className="font-medium text-sm mb-2">
            Lo que está publicado ahorita ({productosPublicados.length} vinos)
          </h2>
          <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
            {productosPublicados.map((p, i) => (
              <div key={i} className="p-3 flex items-center gap-3 text-sm">
                <div className="w-8 aspect-[2/3] rounded bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                  {p.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.fotoUrl} alt={p.nombre} className="w-full h-full object-contain" />
                  ) : (
                    <span>🍷</span>
                  )}
                </div>
                <span className="flex-1 min-w-0 truncate">
                  {p.nombre} {p.anio ? `(${p.anio})` : ""}
                </span>
                <span className="text-muted whitespace-nowrap">
                  {p.precioLista ? formatoMXN(p.precioLista) : "sin precio"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
