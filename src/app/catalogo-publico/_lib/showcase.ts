import type { PublicWine } from "./catalog";
/** Editorial selection approved by Isaac. This does not publish or modify CRM products.
 * Product prices, availability and purchase links continue to come from getPublication.
 * Facts below come ONLY from the supplied original labels, never generated packshots.
 */
export type ShowcaseWine = {
  slug: string;
  productId?: string;
  producer: string;
  name: string;
  year: number;
  image: string;
  description?: string;
  facts?: readonly string[];
  labelImage?: string;
  editorialHref?: string;
};

const selection: readonly ShowcaseWine[] = [
  { slug: "grand-rivallon-2012", productId: "cmtugbmde0002ih049z900g5i", producer: "Château Grand Rivallon", name: "Saint-Émilion Grand Cru", year: 2012, image: "grand-rivallon-2012-front.webp", editorialHref: "/catalogo-publico/cmtugbmde0002ih049z900g5i", description: "Un ensamblaje de Merlot, Cabernet Sauvignon y Cabernet Franc. Redondo, de cuerpo pleno y taninos delicados, según su contraetiqueta." },
  { slug: "reserve-2017", productId: "cmu3qg06j0000ic04z60he8vj", producer: "Dādāh", name: "Special Reserve", year: 2017, image: "reserve-2017-softlight.webp", editorialHref: "/catalogo-publico/seleccion/reserve-2017" },
  { slug: "titora-special-2021", producer: "La Citadelle de Diamant · Titora", name: "Réserve Spéciale", year: 2021, image: "titora-special-2021.webp",
    labelImage: "titora-special-label.webp",
    description: "Un tinto seco de Galilea que combina 80% Cabernet Sauvignon, 10% Shiraz y 10% Petit Verdot. Su cuerpo va de medio a pleno, con una textura suave y aterciopelada y un final largo. Dieciocho meses en barricas de roble francés de Allier aportan intensidad y elegancia.",
    facts: ["Galilea · Israel", "18 meses en roble francés", "750 ml · 14.3% alc.", "Servir a 18–22 °C", "Kosher para Pésaj, según etiqueta"] },
  { slug: "titora-grand-2023", producer: "La Citadelle de Diamant · Givat Titora", name: "Grande Réserve", year: 2023, image: "titora-grand-2023-front.webp", editorialHref: "/catalogo-publico/seleccion/titora-grand-2023",
    description: "Próxima llegada: añada 2023. Descubre su presentación visual y nuestras propuestas de maridaje. Ficha técnica pendiente de confirmar con la nueva etiqueta." },
  { slug: "titora-reserve-2023", producer: "La Citadelle de Diamant · Givat Titora", name: "Cabernet Sauvignon Reserve", year: 2023, image: "titora-reserve-2023-front.webp", editorialHref: "/catalogo-publico/seleccion/titora-reserve-2023",
    description: "95% Cabernet Sauvignon y 5% Petit Verdot de Galilea. Frutos del bosque, cuerpo de medio a pleno y doce meses en roble francés, según su etiqueta." },
  { slug: "dadah-cabernet-reserve-2019", productId: "cmtssyq4b0004l4044dcpucfr", producer: "Dādāh", name: "Cabernet Sauvignon Reserve", year: 2019, image: "dadah-cabernet-reserve-2019.webp", editorialHref: "/catalogo-publico/seleccion/dadah-cabernet-reserve-2019" },
  { slug: "dadah-petit-syrah-reserve-2019", productId: "cmtssyq420003l4047ct1g5wa", producer: "Dādāh", name: "Petit Verdot Syrah Reserve", year: 2019, image: "dadah-petit-syrah-reserve-2019.webp" },
  { slug: "dadah-cabernet-2023", productId: "cmtssyq350000l404mdg2nzou", producer: "Dādāh", name: "Cabernet Sauvignon", year: 2023, image: "dadah-cabernet-2023.webp" },
  { slug: "dadah-malbec-barbera-2023", productId: "cmtssyq3k0001l404n0341dmg", producer: "Dādāh", name: "Malbec Barbera", year: 2023, image: "dadah-malbec-barbera-2023.webp" },
  { slug: "tanya-enosh-2018", producer: "Enosh by Tanya", name: "Cabernet Sauvignon", year: 2018, image: "tanya-enosh-2018.webp" },
  { slug: "tanya-petit-verdot-2021", producer: "Tanya", name: "Petit Verdot · Tchelet", year: 2021, image: "tanya-petit-verdot-2021.webp" },
  { slug: "tanya-late-harvest-2024", producer: "Tanya", name: "Cosecha tardía", year: 2024, image: "tanya-late-harvest-2024.webp" },
];

// Explicit IDs verified against the public catalog; never match commercial data by name.
export function orderShowcase(wines: readonly PublicWine[]): ShowcaseWine[] {
  const prices = new Map(wines.flatMap(w => w.id && w.precioLista !== null ? [[w.id, w.precioLista] as const] : []));
  const dadah = selection.filter(w => w.producer === "Dādāh").sort((a, b) => (prices.get(b.productId ?? "") ?? -1) - (prices.get(a.productId ?? "") ?? -1));
  const rivallon = selection.filter(w => w.slug === "grand-rivallon-2012" && wines.some(p => p.id === w.productId && p.anio === w.year));
  return [...dadah, ...rivallon, ...selection.filter(w => w.producer !== "Dādāh" && w.slug !== "grand-rivallon-2012")];
}