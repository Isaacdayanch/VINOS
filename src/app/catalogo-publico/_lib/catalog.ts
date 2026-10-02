import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type PublicWine = {
  id?: string;
  nombre: string;
  fotoUrl: string | null;
  categoria: string | null;
  anio: number | null;
  precioLista: number | null;
  varietal?: string | null;
  region?: string | null;
  cuerpo?: string | null;
  alcohol?: number | null;
  maridaje?: string | null;
};

// Legacy publications may not have IDs. Never expose private product fields.
export function parsePublication(value: unknown): PublicWine[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || typeof entry.nombre !== "string") return [];
    return [{
      id: typeof entry.id === "string" ? entry.id : undefined,
      nombre: entry.nombre,
      fotoUrl: typeof entry.fotoUrl === "string" ? entry.fotoUrl : null,
      categoria: typeof entry.categoria === "string" ? entry.categoria : null,
      anio: typeof entry.anio === "number" ? entry.anio : null,
      precioLista: typeof entry.precioLista === "number" && Number.isFinite(entry.precioLista) ? entry.precioLista : null,
    }];
  });
}

export const getPublication = cache(async () => {
  const publication = await prisma.catalogoPublicado.findFirst({ orderBy: { fechaPublicado: "desc" } });
  return { date: publication?.fechaPublicado ?? null, wines: parsePublication(publication?.productos) };
});

// Read only public descriptive fields, and only for products already published.
// The approved publication remains authoritative for price, membership and image.
export const getShopCollection = cache(async () => {
  const publication = await getPublication();
  const ids = publication.wines.flatMap(wine => wine.id ? [wine.id] : []);
  const products = ids.length ? await prisma.producto.findMany({
    where: { id: { in: ids } },
    select: { id: true, varietal: true, region: true, cuerpo: true, alcohol: true, maridaje: true },
  }) : [];
  const metadata = new Map(products.map(product => [product.id, product]));
  return { ...publication, wines: publication.wines.map(wine => ({
    ...wine, ...(wine.id ? metadata.get(wine.id) : {}),
  })) };
});

export const getPublicWine = cache(async (id: string) => {
  const publication = await getPublication();
  const published = publication.wines.find((wine) => wine.id === id);
  if (!published) return null;
  const product = await prisma.producto.findUnique({
    where: { id },
    select: {
      id: true, nombre: true, anio: true, categoria: true, activo: true,
      fotoUrl: true, descripcion: true, varietal: true, region: true,
      cuerpo: true, alcohol: true, notas: true, maridaje: true,
      imagenesExtra: { orderBy: { orden: "asc" }, select: { url: true } },
    },
  });
  if (!product) return null;
  // Keep published price; live content and availability may change independently.
  return { ...product, precioLista: published.precioLista };
});
