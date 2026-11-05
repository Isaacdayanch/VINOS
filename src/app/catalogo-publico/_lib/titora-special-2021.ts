import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from the original 2021 rear label (public/catalogo/titora-special-label.webp)
// and the front label (public/catalogo/titora-special-2021-front.webp).
// Web checked, without a producer page reachable from here; retail listings conflict on the blend,
// so the rear label is the only source used:
// https://bestbuyliquors.com/titora-la-citadelle-de-diamant
// https://www.firstleaf.com/a/wine-directory/product/titora-special-reserve
export const titoraSpecial2021: EditorialWine = {
  slug: "titora-special-2021",
  name: "Titora Special Reserve Cabernet Sauvignon 2021",
  title: "Titora Réserve Spéciale",
  year: 2021,
  producer: "LA CITADELLE DE DIAMANT · GALILEA, ISRAEL",
  style: "80% Cabernet Sauvignon · 10% Shiraz · 10% Petit Verdot · Tinto seco",
  storyHeading: "Sellada en cera, criada sin prisa.",
  description: "Un tinto seco de viñedos especiales de Galilea que reúne 80% Cabernet Sauvignon, 10% Shiraz y 10% Petit Verdot. Según su contraetiqueta, es un vino de cuerpo medio a pleno, con una amplia variedad de aromas, texturas suaves y aterciopeladas y un final largo. Dieciocho meses en barricas de roble francés de Allier, en el centro de Francia, le dan intensidad y elegancia.",
  pairing: "Nuestra sugerencia principal: pechuga de pato sellada, con higos asados, granada y una reducción de vino tinto, sin lácteos. La grasa del pato y la fruta del plato acompañan la textura aterciopelada y el final largo que describe la etiqueta. También proponemos cordero al horno con hierbas o, como alternativa vegetal, berenjena asada con granada y aceite de oliva. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "La contraetiqueta identifica a Titora, de La Citadelle de Diamant, como productor, y señala viñedos especiales de Galilea como origen de las uvas. Su sello de cera roja cubre el cuello y los hombros de la botella, y la etiqueta dorada ovalada lleva el escudo de la casa y la leyenda Cabernet Sauvignon Réserve Spéciale 2021. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Productor", "Titora · La Citadelle de Diamant"], ["Vino", "Titora Special Reserve · Réserve Spéciale"],
    ["Añada", "2021"], ["Origen", "Viñedos especiales de Galilea · Israel"], ["Tipo", "Tinto seco"],
    ["Ensamblaje", "80% Cabernet Sauvignon · 10% Shiraz · 10% Petit Verdot"],
    ["Crianza", "18 meses en barricas de roble francés de Allier"],
    ["Cuerpo", "De medio a pleno, según etiqueta"],
    ["Textura según etiqueta", "Suave y aterciopelada, con final largo"],
    ["Alcohol", "14.3%"], ["Contenido", "750 ml"], ["Servicio según etiqueta", "18–22 °C"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Kosher", "Kosher para Pésaj y lemehadrin, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/titora-special-2021-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta · añada 2021", "El ritual del servicio, bajo el olivo", "Una copa a contraluz de la tarde", "Maridaje sugerido: pato con higos y granada", "Una mesa larga bajo la parra"],
};
