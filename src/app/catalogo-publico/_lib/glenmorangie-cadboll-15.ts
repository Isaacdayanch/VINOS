import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (336 px product shot, upscaled): label reads "Glenmorangie · The Cadboll Estate · Highland
// Single Malt Scotch Whisky · Matured in American Oak Bourbon Casks · Aged 15 Years · Batch No 2", 43%;
// the box adds "Limited Edition" and "A deep and creamy whisky". No box photo: in the photo the bottle
// hides the left edge of the box, where its texts begin, and that cannot be rebuilt without inventing letters.
// Nose/palate/finish are Glenmorangie's notes for Batch No. 2 as reproduced by retailers (e.g.
// https://reservebar.com/products/glenmorangie-cadboll-estate-batch-2). glenmorangie.com not reachable from here.
export const glenmorangieCadboll15: EditorialWine = {
  slug: "glenmorangie-cadboll-15",
  kind: "DESTILADO",
  name: "Glenmorangie The Cadboll Estate 15 Años",
  title: "Glenmorangie The Cadboll Estate 15 Años",
  producer: "GLENMORANGIE · ESCOCIA",
  style: "Single malt escocés · 15 años · Barricas de bourbon de roble americano · Edición limitada",
  storyHeading: "Quince años de una sola finca.",
  description: "Una edición limitada hecha con cebada de una sola finca: Cadboll Estate, las tierras que rodean la destilería en Tain, en el norte de las Highlands. Madura quince años únicamente en barricas de bourbon de roble americano, de donde toma su color dorado y su carácter de fruta de hueso, vainilla cremosa y almendra tostada. Es el segundo lote (Batch No. 2) de la serie y la casa lo describe como un whisky profundo y cremoso.",
  tasting: {
    nose: "Pleno y frutal, con naranja y chabacano con miel; dulce cremoso de vainilla, almendra tostada y un toque de coco y almendra garapiñada. Notas de la destilería para The Cadboll Estate 15, Batch No. 2.",
    palate: "Textura rica, suave y sedosa, seguida de un estallido de fruta dulce: pera pochada en almíbar, chabacano y limón. Jengibre y canela que chispean, templados por un frescor mentolado. Notas de la destilería para The Cadboll Estate 15, Batch No. 2.",
    finish: "Largo y persistente, con capas de aceite de naranja, roble tostado y eucalipto. Notas de la destilería para The Cadboll Estate 15, Batch No. 2.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata, para apreciar la textura cremosa; unas gotas de agua abren la fruta y la vainilla. Con un whisky de quince años recomendamos no ponerle hielo. Déjalo respirar un par de minutos antes del primer sorbo.",
  pairing: "Pide bocados de fruta y crema. Proponemos tarta de chabacano, pera pochada con vainilla, galletas de almendra, chocolate blanco con coco y cáscara de naranja confitada; con quesos, un brie maduro o un cheddar suave. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "Glenmorangie se fundó en 1843 en Tain, en Ross-shire, al norte de las Highlands de Escocia, y es conocida por los alambiques más altos de Escocia, que dan un espíritu ligero y delicado. The Cadboll Estate toma su nombre de la finca vecina a la destilería, cuya cebada se usa en esta serie de ediciones limitadas por lotes. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "Glenmorangie · Tain, Ross-shire"], ["Origen", "Highlands · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "15 años"],
    ["Barricas", "Bourbon de roble americano, según etiqueta"],
    ["Cebada", "De la finca Cadboll Estate, según estuche"], ["Lote", "Batch No. 2, según etiqueta"],
    ["Edición", "Limitada, según estuche"], ["Carácter", "Profundo y cremoso, según estuche"],
    ["Alcohol", "43%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "glass", "pairing"].map(view => `/catalogo/glenmorangie-cadboll-15-${view}.webp`),
  captions: [
    "La botella, sobre blanco",
    "Solo, sin hielo, en vaso de cata",
    "Maridaje sugerido: tarta de chabacano, pera pochada, galletas de almendra, chocolate blanco con coco y naranja confitada",
  ],
};
