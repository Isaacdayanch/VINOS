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
    <div
      className={`${playfair.variable} min-h-full bg-gradient-to-b from-[#2a0f1a] via-[#170810] to-[#2a0f1a] text-[#f3e6d2]`}
    >
      <div className="max-w-2xl mx-auto px-5 py-10 flex flex-col gap-8">
        <Link
          href="/catalogo-publico"
          className="text-sm text-[#d4af6a] hover:text-[#f3e6d2] transition-colors w-fit"
        >
          ← Volver al catálogo
        </Link>

        <GaleriaVinoPublica fotos={fotos} nombre={producto.nombre} />

        <div className="text-center">
          {producto.categoria && (
            <p className="uppercase tracking-[0.25em] text-xs text-[#d4af6a] mb-2">
              {producto.categoria}
            </p>
          )}
          <h1 className="font-[family-name:var(--font-serif-vino)] text-3xl sm:text-4xl font-bold leading-tight">
            {producto.nombre} {producto.anio ? `· ${producto.anio}` : ""}
          </h1>
          {precio && (
            <p className="text-2xl font-semibold text-[#d4af6a] mt-4">{formatoMXN(precio)}</p>
          )}
          <button
            type="button"
            disabled
            className="mt-5 w-full rounded-full border border-[#d4af6a] text-[#d4af6a] px-6 py-3.5 text-sm font-medium tracking-wide cursor-not-allowed hover:bg-[#d4af6a]/10 transition-colors"
          >
            🛒 Próximamente — haz tu pedido aquí
          </button>
        </div>

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
    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#f3e6d2] whitespace-nowrap">
      {children}
    </span>
  );
}

function Seccion({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="h-px flex-1 bg-white/10" />
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#d4af6a] whitespace-nowrap">
          {titulo}
        </h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <p className="text-sm text-[#e8d9c0] opacity-90 whitespace-pre-line text-center leading-relaxed">
        {texto}
      </p>
    </div>
  );
}
