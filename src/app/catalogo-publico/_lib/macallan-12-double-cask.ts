import type { EditorialWine } from "./editorial-wine";

// Front label and box from Isaac's photo (box cleaned: retailer badge removed, edge hidden by the bottle mirrored); tasting notes and casks from the producer:
// https://www.themacallan.com/en/single-malt-scotch-whisky/double-cask-12-years-old
// Distillery location: https://en.wikipedia.org/wiki/The_Macallan_distillery
export const macallan12DoubleCask: EditorialWine = {
  slug: "macallan-12-double-cask",
  kind: "DESTILADO",
  name: "The Macallan 12 Años Double Cask",
  title: "The Macallan 12 Años Double Cask",
  producer: "THE MACALLAN · ESCOCIA",
  style: "Single malt escocés · 12 años · Barricas sazonadas con jerez",
  storyHeading: "Dos robles, un jerez.",
  description: "Un single malt escocés de doce años que une dos maderas: barricas de roble americano y de roble europeo, ambas sazonadas con vino de jerez en Jerez de la Frontera, España. Según la destilería, el roble americano aporta vainilla y fruta fresca, y el europeo especias suaves y fruta seca. Color natural, sin colorante añadido, según la etiqueta.",
  tasting: {
    nose: "Dulce de leche tipo fudge con naranja y limón confitados, vainilla y especias suaves. Notas de la destilería.",
    palate: "Pasas cubiertas de chocolate con leche y toffee cremoso, equilibrados con cáscara de naranja y un toque de especia. Notas de la destilería.",
    finish: "Medio, con roble dulce. Notas de la destilería.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata o vaso corto. Unas gotas de agua abren la vainilla y los cítricos. Si lo prefieres frío, con un solo hielo grande que se derrita despacio.",
  pairing: "El whisky se acompaña con bocados más que con un plato fuerte. Con este proponemos chocolate con leche o semiamargo con naranja, nueces y almendras tostadas, higos o dátiles, y quesos maduros como un manchego añejo. De postre: flan, tarta de manzana o algo con caramelo. Es ideal para la sobremesa o como digestivo. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "The Macallan se fundó en 1824 en Easter Elchies, cerca de Craigellachie, en la región de Speyside, Escocia. La etiqueta lo presenta como «Highland Single Malt Scotch Whisky»: Speyside forma parte de las Highlands. Esta botella pertenece a la Double Cask Collection. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "The Macallan · fundada en 1824"], ["Origen", "Speyside · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "12 años"],
    ["Barricas", "Roble americano y europeo sazonados con jerez"],
    ["Color", "Natural, según etiqueta"], ["Colección", "Double Cask Collection"],
    ["Alcohol", "40%"], ["Contenido", "700 ml"],
  ],
  photos: ["front", "box"].map(view => `/catalogo/macallan-12-double-cask-${view}.webp`),
  captions: ["La botella, sobre blanco", "El estuche de la Double Cask Collection"],
};
