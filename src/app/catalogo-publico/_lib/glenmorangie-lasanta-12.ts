import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (480 px product shot, upscaled): label reads "Glenmorangie · The Lasanta · Highland Single
// Malt Scotch Whisky · Sherry Cask Finish · Aged 12 Years", 70cl, 43%; the box adds "A spicy and rich
// whisky". Nose/palate/finish are Glenmorangie's own notes for The Lasanta 12 as reproduced by retailers:
// https://www.thewhiskyexchange.com/p/12603/glenmorangie-lasanta-12-year-old-sherry-cask-finish
// and https://shop.klwines.com/products/details/1033608 (10 years in American white oak, then 2 in Oloroso
// and PX sherry casks). glenmorangie.com not reachable from here.
export const glenmorangieLasanta12: EditorialWine = {
  slug: "glenmorangie-lasanta-12",
  kind: "DESTILADO",
  name: "Glenmorangie The Lasanta 12 Años",
  title: "Glenmorangie The Lasanta 12 Años",
  producer: "GLENMORANGIE · ESCOCIA",
  style: "Single malt escocés · 12 años · Terminado en barricas de jerez",
  storyHeading: "Doce años, con final en jerez.",
  description: "El single malt de Glenmorangie con terminado en barricas de jerez: un whisky escocés de las Highlands que pasa diez años en barricas de roble blanco americano y después dos años más en barricas de jerez Oloroso y Pedro Ximénez, de donde toma su color cobrizo y su carácter de fruta seca, chocolate y especia cálida. Su nombre viene del gaélico escocés y la casa lo traduce como calidez y pasión. Un whisky, como dice su estuche, especiado y rico.",
  tasting: {
    nose: "Especias cálidas que se mezclan con pasas cubiertas de chocolate, panal de miel y toffee de caramelo. Notas de la destilería para The Lasanta 12.",
    palate: "Uvas sultanas dulces al jerez, gajos de naranja, nueces y butterscotch que se combinan en una especia cálida y compleja. Notas de la destilería para The Lasanta 12.",
    finish: "Largo y satisfactorio, con naranja especiada y avellanas cubiertas de chocolate. Notas de la destilería para The Lasanta 12.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata, o con unas gotas de agua para abrir la fruta seca y la especia. Si lo prefieres más fresco, en vaso corto con un solo hielo grande. Un whisky de sobremesa que también funciona como primer sorbo de la tarde.",
  pairing: "Pide bocados dulces y tostados. Proponemos chocolate con leche y avellanas, gajos de naranja o cáscara confitada, nueces de Castilla, pasas al jerez y un trozo de pastel de dátiles; con quesos, un idiazábal o un manchego semicurado. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "Glenmorangie se fundó en 1843 en Tain, en Ross-shire, al norte de las Highlands de Escocia, y es conocida por los alambiques más altos de Escocia, que dan un espíritu ligero y delicado. The Lasanta es su expresión terminada en barricas de jerez Oloroso y Pedro Ximénez, de doce años. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "Glenmorangie · Tain, Ross-shire"], ["Origen", "Highlands · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "12 años"],
    ["Barricas", "Roble blanco americano; terminado en barricas de jerez Oloroso y Pedro Ximénez"],
    ["Terminado", "Sherry Cask Finish, según etiqueta"], ["Carácter", "Especiado y rico, según estuche"],
    ["Alcohol", "43%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "box", "glass", "pairing"].map(view => `/catalogo/glenmorangie-lasanta-12-${view}.webp`),
  captions: [
    "La botella, sobre blanco", "El estuche rojo de The Lasanta",
    "Solo o con unas gotas de agua, en vaso de cata",
    "Maridaje sugerido: chocolate con avellanas, naranja, nueces, pasas al jerez y pastel de dátiles",
  ],
};
