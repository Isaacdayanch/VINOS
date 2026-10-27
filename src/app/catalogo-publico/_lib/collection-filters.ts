import type { ProductKind, PublicWine } from "./catalog";

export const BUDGETS = [
  { label: "Todos los precios", min: -1, max: Infinity },
  { label: "Hasta $500", min: -1, max: 500 },
  { label: "$500–$1,000", min: 500, max: 1000 },
  { label: "$1,000–$2,000", min: 1000, max: 2000 },
  { label: "Más de $2,000", min: 2000, max: Infinity },
];
export const FACETS = [
  ["varietal", "Uva"], ["region", "Región"], ["cuerpo", "Cuerpo"], ["alcohol", "Alcohol"],
] as const;
export type FacetKey = typeof FACETS[number][0];
export type Facet = readonly [FacetKey, string];

/** Which descriptive filters make sense for each kind of product. */
export const FACETS_BY_KIND: Record<ProductKind, readonly Facet[]> = {
  VINO: FACETS,
  DESTILADO: [["varietal", "Hecho de"], ["region", "Región o país"], ["alcohol", "Alcohol"]],
};
export type CollectionFilters = {
  query: string; category: string; year: string; budget: number;
  facets: Partial<Record<FacetKey, string>>; sort: string; kind?: ProductKind;
};
const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** The spirits shelves always shown on the page, even before a bottle arrives. */
export const SPIRIT_TYPES = [
  { label: "Arak", match: /\bara[kcq]\b/ },
  { label: "Whisky", match: /whiske?y|scotch|bourbon|single malt/ },
  { label: "Tequila", match: /tequila/ },
  { label: "Mezcal", match: /mezcal|mescal/ },
] as const;

/** Shelf of a spirit: its CRM category first, then its name (some araks have no category). */
export function spiritType(wine: Pick<PublicWine, "categoria" | "nombre">): string | null {
  for (const text of [wine.categoria, wine.nombre]) {
    const found = text ? SPIRIT_TYPES.find(type => type.match.test(normalize(text))) : undefined;
    if (found) return found.label;
  }
  return null;
}

export function filterCollection(wines: PublicWine[], filters: CollectionFilters) {
  const { query, category, year, budget, facets, sort, kind } = filters;
  const range = BUDGETS[budget] ?? BUDGETS[0];
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return wines.filter(wine => {
    const search = normalize([wine.nombre, wine.categoria, wine.anio, wine.varietal, wine.region, wine.cuerpo, wine.maridaje].filter(Boolean).join(" "));
    return terms.every(term => search.includes(term))
      && (!category || (kind === "DESTILADO" ? spiritType(wine) === category : wine.categoria === category))
      && (!year || wine.anio === Number(year))
      && (!budget || (wine.precioLista !== null && wine.precioLista > range.min && wine.precioLista <= range.max))
      && FACETS.every(([key]) => !facets[key] || String(wine[key] ?? "") === facets[key]);
  }).sort((a, b) => {
    if (sort === "low" || sort === "high") {
      // Unknown prices always appear last, in either direction.
      if (a.precioLista === null && b.precioLista !== null) return 1;
      if (b.precioLista === null && a.precioLista !== null) return -1;
      if (a.precioLista !== null && b.precioLista !== null && a.precioLista !== b.precioLista)
        return (a.precioLista - b.precioLista) * (sort === "low" ? 1 : -1);
    }
    return a.nombre.localeCompare(b.nombre, "es");
  });
}
