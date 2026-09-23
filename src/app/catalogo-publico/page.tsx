import { prisma } from "@/lib/prisma";
import { formatoMXN } from "@/lib/costeo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo de Vinos",
};

type ProductoPublicado = {
  id?: string;
  nombre: string;
  fotoUrl: string | null;
  categoria: string | null;
  anio: number | null;
  precioLista: number | null;
};

export default async function CatalogoPublicoPage() {
  const ultimaPublicacion = await prisma.catalogoPublicado.findFirst({
    orderBy: { fechaPublicado: "desc" },
  });
  const productos = (ultimaPublicacion?.productos as unknown as ProductoPublicado[]) ?? [];

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-3 print:hidden mb-6">
          <div>
            <h1 className="text-2xl font-bold text-wine">Catálogo de Vinos</h1>
            <p className="text-muted text-sm">
              {ultimaPublicacion
                ? `Precios vigentes al ${new Date(ultimaPublicacion.fechaPublicado).toLocaleDateString("es-MX")}, en pesos mexicanos (MXN).`
                : "Todavía no hay catálogo publicado."}
            </p>
          </div>
          {productos.length > 0 && <BotonImprimir />}
        </div>

        {/*
          A propósito NO se usa CSS grid/flex aquí: al imprimir, los navegadores
          no reparten bien las tarjetas entre hojas dentro de un grid/flex (el
          bloque entero se brinca de hoja, o se cortan a la mitad aunque tengan
          break-inside:avoid) — con flujo normal + inline-block sí lo respetan.
        */}
        <div>
          {productos.map((p, i) => {
            const tarjeta = (
              <div className="print-item rounded-lg border border-border bg-surface p-3 flex flex-col gap-2 break-inside-avoid">
                <div className="relative w-full aspect-[3/5] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center p-2">
                  {p.fotoUrl ? (
                    <Image
                      src={p.fotoUrl}
                      alt={p.nombre}
                      fill
                      sizes="(max-width: 640px) 45vw, 30vw"
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-3xl">🍷</span>
                  )}
                </div>
                <div className="border-t border-border pt-2">
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
            );
            return (
              <div key={p.id ?? i} className="inline-block align-top w-1/2 sm:w-1/3 p-2">
                {p.id ? (
                  <Link href={`/catalogo-publico/${p.id}`} className="block">
                    {tarjeta}
                  </Link>
                ) : (
                  tarjeta
                )}
              </div>
            );
          })}
        </div>

        {productos.length === 0 && (
          <p className="text-center text-muted text-sm py-10">
            Todavía no hay catálogo publicado.
          </p>
        )}
      </div>
    </div>
  );
}
