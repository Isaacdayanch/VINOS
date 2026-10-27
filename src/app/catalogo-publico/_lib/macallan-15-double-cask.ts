import type { EditorialWine } from "./editorial-wine";

// Front label and box from the packshot Isaac sent (box edge hidden by the bottle rebuilt from the box's own pattern).
// Tasting notes as published for the Double Cask 15: https://www.thewhiskyexchange.com/p/55314/macallan-15-year-old-double-cask
// (also https://www.royalmilewhiskies.com/macallan-15-year-old-double-cask-43-70cl/). 43% and 700 ml from the label.
export const macallan15DoubleCask: EditorialWine = {
  slug: "macallan-15-double-cask",
  kind: "DESTILADO",
  name: "The Macallan 15 Años Double Cask",
  title: "The Macallan 15 Años Double Cask",
  producer: "THE MACALLAN · ESCOCIA",
  style: "Single malt escocés · 15 años · Barricas sazonadas con jerez",
  storyHeading: "Quince años, el punto medio.",
  description: "El escalón entre el Double Cask 12 y el 18: un single malt escocés de quince años madurado en barricas de roble americano y de roble europeo, ambas sazonadas con vino de jerez. Más redondo que el de doce, con fruta seca, toffee y vainilla, y un final cálido de jengibre. Color natural, sin colorante añadido, según la etiqueta.",
  tasting: {
    nose: "Fruta seca, toffee y vainilla, con roble suave y manzana horneada; equilibrado con notas de miel y chocolate. Notas publicadas para el Double Cask 15.",
    palate: "Pasas y uvas sultanas dulces, con vainilla, especias de la madera y cítricos. Notas publicadas para el Double Cask 15.",
    finish: "Cálido, con jengibre que se vuelve caramelo y cítricos; largo y de textura cremosa. Notas publicadas para el Double Cask 15.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata o vaso corto. Déjalo reposar un par de minutos; unas gotas de agua abren la manzana y la vainilla. Si lo prefieres frío, un solo hielo grande que se derrita despacio.",
  pairing: "Es un whisky de sobremesa. Proponemos manzana caramelizada o una tarta de manzana, chocolate con leche o semiamargo, nueces pecanas, higos secos y quesos maduros como un gouda añejo. También va bien con un puro suave después de cenar. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "The Macallan se fundó en 1824 en Easter Elchies, cerca de Craigellachie, en la región de Speyside, Escocia, dentro de las Highlands. La línea Double Cask reúne roble americano y europeo sazonados con jerez; el 15 años queda entre el 12 y el 18. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "The Macallan · fundada en 1824"], ["Origen", "Speyside · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "15 años"],
    ["Barricas", "Roble americano y europeo sazonados con jerez"],
    ["Color", "Natural, según etiqueta"], ["Colección", "Double Cask Collection"],
    ["Alcohol", "43%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "box", "glass", "pairing"].map(view => `/catalogo/macallan-15-double-cask-${view}.webp`),
  captions: [
    "La botella, sobre blanco", "El estuche de la Double Cask Collection",
    "Solo, en vaso corto, para la sobremesa",
    "Maridaje sugerido: manzana caramelizada, chocolate, nuez pecana, higos y gouda añejo",
  ],
};
