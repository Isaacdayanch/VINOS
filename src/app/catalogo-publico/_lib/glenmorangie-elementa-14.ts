import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (554 px product shot, upscaled): label reads "Glenmorangie · The Elementa · Highland Single
// Malt Scotch Whisky · New Charred Oak Cask Finish · Aged 14 Years", 43%; the box adds "A spicy and deep
// whisky" and a "Traveller Exclusive" seal. Nose/palate/finish, casks and 1-litre volume from Glenmorangie's
// official page: https://glenmorangie.com/products/the-elementa-14-years-old
export const glenmorangieElementa14: EditorialWine = {
  slug: "glenmorangie-elementa-14",
  kind: "DESTILADO",
  name: "Glenmorangie The Elementa 14 Años",
  title: "Glenmorangie The Elementa 14 Años",
  producer: "GLENMORANGIE · ESCOCIA",
  style: "Single malt escocés · 14 años · Terminado en roble nuevo tostado",
  storyHeading: "Catorce años, con final en roble nuevo.",
  description: "Una edición exclusiva de tiendas de viaje: un single malt de las Highlands que madura primero en barricas de bourbon y después se termina en barricas de roble nuevo carbonizado por dentro, de donde toma, según la casa, capas de roble y chocolate. The Elementa celebra el juego entre el espíritu de Glenmorangie y la fuerza elemental del roble. Un whisky, como dice su estuche, especiado y profundo, en botella de un litro.",
  tasting: {
    nose: "Toffee especiado que estalla con aromas de pasto fresco, chocolate con leche y capas profundas de vainilla. Notas de la destilería para The Elementa 14.",
    palate: "Una boca intensamente especiada que trae una oleada de chocolate oscuro con jengibre y crema fondant. Notas de la destilería para The Elementa 14.",
    finish: "Un equilibrio delicioso de dulzor y especia, con una sugerencia persistente de comino. Notas de la destilería para The Elementa 14.",
  },
  serve: "Nuestra sugerencia: solo, en vaso de cata, o con unas gotas de agua para suavizar la especia y abrir la vainilla. También va bien en vaso corto con un solo hielo grande en una tarde calurosa. Déjalo respirar un minuto antes del primer sorbo.",
  pairing: "Pide bocados tostados y con especia. Proponemos chocolate oscuro con jengibre, duraznos asados con un toque de canela, galletas de jengibre, nueces pecanas garapiñadas y una rebanada de pastel de zanahoria; con quesos, un cheddar añejo. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "Glenmorangie se fundó en 1843 en Tain, en Ross-shire, al norte de las Highlands de Escocia, y es conocida por los alambiques más altos de Escocia, que dan un espíritu ligero y delicado. The Elementa es su edición de catorce años para tiendas de viaje, terminada en roble nuevo carbonizado. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "Glenmorangie · Tain, Ross-shire"], ["Origen", "Highlands · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "14 años"],
    ["Barricas", "Bourbon; terminado en barricas de roble nuevo carbonizado"],
    ["Terminado", "New Charred Oak Cask Finish, según etiqueta"], ["Carácter", "Especiado y profundo, según estuche"],
    ["Edición", "Exclusiva de tiendas de viaje, según estuche"],
    ["Alcohol", "43%"], ["Contenido", "1 litro"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "box", "glass", "pairing"].map(view => `/catalogo/glenmorangie-elementa-14-${view}.webp`),
  captions: [
    "La botella, sobre blanco", "El estuche naranja de The Elementa",
    "Solo o con unas gotas de agua, en vaso de cata",
    "Maridaje sugerido: chocolate con jengibre, duraznos asados, galletas de jengibre, nuez pecana y pastel de zanahoria",
  ],
};
