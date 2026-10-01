/** Editorial selection approved by Isaac. This does not publish or modify CRM products.
 * Product prices, availability and purchase links continue to come from getPublication.
 * Facts below come ONLY from the supplied original labels, never generated packshots.
 */
export type ShowcaseWine = {
  slug: string;
  producer: string;
  name: string;
  year: number;
  image: string;
  description?: string;
  facts?: readonly string[];
  labelImage?: string;
  editorialHref?: string;
};

export const showcaseWines: readonly ShowcaseWine[] = [
  { slug: "reserve-2017", producer: "Dādāh", name: "Special Reserve", year: 2017, image: "reserve-2017.webp", editorialHref: "/catalogo-publico/seleccion/reserve-2017" },
  { slug: "titora-special-2021", producer: "La Citadelle de Diamant · Titora", name: "Réserve Spéciale", year: 2021, image: "titora-special-2021.webp",
    labelImage: "titora-special-label.webp",
    description: "Un tinto seco de Galilea que combina 80% Cabernet Sauvignon, 10% Shiraz y 10% Petit Verdot. Su cuerpo va de medio a pleno, con una textura suave y aterciopelada y un final largo. Dieciocho meses en barricas de roble francés de Allier aportan intensidad y elegancia.",
    facts: ["Galilea · Israel", "18 meses en roble francés", "750 ml · 14.3% alc.", "Servir a 18–22 °C", "Kosher para Pésaj, según etiqueta"] },
  { slug: "titora-grand-2021", producer: "La Citadelle de Diamant · Givat Titora", name: "Grande Réserve", year: 2021, image: "titora-grand-2021.webp",
    labelImage: "titora-grand-label.webp",
    description: "Una selección de la añada 2021 con Cabernet Sauvignon dominante, procedente de Alta Galilea. La etiqueta describe fruta roja, pimienta inglesa y notas tostadas. Su crianza de veinticuatro meses en barricas francesas de primer y segundo uso desarrolla matices de cacao y café, con estructura tánica y un color rojo intenso.",
    facts: ["Alta Galilea · Israel", "24 meses en roble francés", "750 ml · 14.3% alc.", "Servir a 18–22 °C", "Kosher para Pésaj, según etiqueta"] },
  { slug: "dadah-cabernet-reserve-2019", producer: "Dādāh", name: "Cabernet Sauvignon Reserve", year: 2019, image: "dadah-cabernet-reserve-2019.webp" },
  { slug: "dadah-petit-syrah-reserve-2019", producer: "Dādāh", name: "Petit Verdot Syrah Reserve", year: 2019, image: "dadah-petit-syrah-reserve-2019.webp" },
  { slug: "dadah-cabernet-2023", producer: "Dādāh", name: "Cabernet Sauvignon", year: 2023, image: "dadah-cabernet-2023.webp" },
  { slug: "dadah-malbec-barbera-2023", producer: "Dādāh", name: "Malbec Barbera", year: 2023, image: "dadah-malbec-barbera-2023.webp" },
  { slug: "tanya-enosh-2018", producer: "Enosh by Tanya", name: "Cabernet Sauvignon", year: 2018, image: "tanya-enosh-2018.webp" },
  { slug: "tanya-petit-verdot-2021", producer: "Tanya", name: "Petit Verdot · Tchelet", year: 2021, image: "tanya-petit-verdot-2021.webp" },
  { slug: "tanya-late-harvest-2024", producer: "Tanya", name: "Cosecha tardía", year: 2024, image: "tanya-late-harvest-2024.webp" },
];
