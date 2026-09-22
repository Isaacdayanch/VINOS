import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FichaVinoPublicaPage({
  params,
}: PageProps<"/catalogo-publico/[id]">) {
  const { id } = await params;
  const [producto, ultimaPublicacion] = await Promise.all([
    prisma.producto.findUnique({
      where: { id },
      include: { imagenesExtra: { orderBy: { orden: "asc" } } },
    }),
    prisma.catalogoPublicado.findFirst({ orderBy: { fechaPublicado: "desc" } }),
  ]);
  if (!producto || !producto.activo) notFound();

  // El precio se toma del catálogo publicado (congelado), no del precio en vivo.
  type ProductoPublicado = { id?: string; precioLista: number | null };
  const publicados = (ultimaPublicacion?.productos as unknown as ProductoPublicado[]) ?? [];
  const publicado = publicados.find((p) => p.id === producto.id);
  const precio = publicado?.precioLista ?? null;

  const fotos = [producto.fotoUrl, ...producto.imagenesExtra.map((i) => i.url)].filter(
    (u): u is string => Boolean(u),
  );

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <Link href="/catalogo-publico" className="text-sm text-wine underline">
          ← Volver al catálogo
        </Link>

        {fotos.length > 0 && (
          <div>
            <div className="w-full aspect-[3/4] rounded-lg border border-border bg-surface overflow-hidden flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotos[0]} alt={producto.nombre} className="w-full h-full object-contain" />
            </div>
            {fotos.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {fotos.slice(1).map((url, i) => (
                  <div
                    key={i}
                    className="w-16 aspect-[3/4] rounded-md border border-border bg-surface overflow-hidden flex items-center justify-center p-1 shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-wine">
            {producto.nombre} {producto.anio ? `(${producto.anio})` : ""}
          </h1>
          {producto.categoria && <p className="text-muted text-sm">{producto.categoria}</p>}
          {precio && <p className="text-xl font-semibold text-wine mt-1">{formatoMXN(precio)}</p>}
        </div>

        {(producto.varietal || producto.region || producto.cuerpo || producto.alcohol) && (
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {producto.varietal && (
              <div>
                <span className="text-muted">Uva: </span>
                <span className="font-medium">{producto.varietal}</span>
              </div>
            )}
            {producto.region && (
              <div>
                <span className="text-muted">Región: </span>
                <span className="font-medium">{producto.region}</span>
              </div>
            )}
            {producto.cuerpo && (
              <div>
                <span className="text-muted">Cuerpo: </span>
                <span className="font-medium">{producto.cuerpo}</span>
              </div>
            )}
            {producto.alcohol && (
              <div>
                <span className="text-muted">Alcohol: </span>
                <span className="font-medium">{producto.alcohol}%</span>
              </div>
            )}
          </div>
        )}

        {producto.descripcion && (
          <div>
            <h2 className="font-medium text-sm mb-1">Descripción</h2>
            <p className="text-sm text-muted whitespace-pre-line">{producto.descripcion}</p>
          </div>
        )}

        {producto.maridaje && (
          <div>
            <h2 className="font-medium text-sm mb-1">Con qué comer</h2>
            <p className="text-sm text-muted whitespace-pre-line">{producto.maridaje}</p>
          </div>
        )}

        {producto.notas && (
          <div>
            <h2 className="font-medium text-sm mb-1">Notas de cata</h2>
            <p className="text-sm text-muted whitespace-pre-line">{producto.notas}</p>
          </div>
        )}
      </div>
    </div>
  );
}
