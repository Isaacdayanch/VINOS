import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { GaleriaVinoPublica } from "@/components/GaleriaVinoPublica";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif-vino",
});

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
    <div className={`${playfair.variable} min-h-full bg-white text-wine-dark`}>
      <div className="relative">
        <GaleriaVinoPublica fotos={fotos} nombre={producto.nombre} />

        <Link
          href="/catalogo-publico"
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-wine text-lg"
        >
          ←
        </Link>

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-5 text-center">
          {producto.categoria && (
            <p className="uppercase tracking-[0.25em] text-xs text-wine/70 mb-1">
              {producto.categoria}
            </p>
          )}
          <h1 className="font-[family-name:var(--font-serif-vino)] text-3xl sm:text-4xl font-bold leading-tight">
            {producto.nombre} {producto.anio ? `· ${producto.anio}` : ""}
          </h1>
          {precio && <p className="text-2xl font-semibold text-wine mt-2">{formatoMXN(precio)}</p>}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-4 pb-10 flex flex-col gap-8">
        <button
          type="button"
          disabled
          className="w-full rounded-full bg-wine text-white px-6 py-3.5 text-sm font-medium tracking-wide cursor-not-allowed opacity-90"
        >
          🛒 Próximamente — haz tu pedido aquí
        </button>

        {(producto.varietal || producto.region || producto.cuerpo || producto.alcohol) && (
          <div className="flex flex-wrap justify-center gap-2">
            {producto.varietal && <Pill>🍇 {producto.varietal}</Pill>}
            {producto.region && <Pill>📍 {producto.region}</Pill>}
            {producto.cuerpo && <Pill>🍷 Cuerpo {producto.cuerpo}</Pill>}
            {producto.alcohol != null && <Pill>{producto.alcohol}% alc.</Pill>}
          </div>
        )}

        {producto.descripcion && <Seccion titulo="Descripción" texto={producto.descripcion} />}
        {producto.maridaje && <Seccion titulo="Con qué comer" texto={producto.maridaje} />}
        {producto.notas && <Seccion titulo="Notas de cata" texto={producto.notas} />}
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-wine-light text-wine-dark px-3 py-1.5 text-xs font-medium whitespace-nowrap">
      {children}
    </span>
  );
}

function Seccion({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="h-px flex-1 bg-border" />
        <h2 className="text-xs uppercase tracking-[0.2em] text-wine/70 whitespace-nowrap">
          {titulo}
        </h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      <p className="text-sm text-muted whitespace-pre-line text-center leading-relaxed">{texto}</p>
    </div>
  );
}
