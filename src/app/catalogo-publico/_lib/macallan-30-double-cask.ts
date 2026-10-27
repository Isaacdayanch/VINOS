import type { EditorialWine } from "./editorial-wine";

// Isaac's photo: Annual 2021 Release in its oak box. Label reads "Natural Colour · Product of Scotland",
// 700 ml, 43% vol, "Matured in the perfect balance of hand-picked sherry seasoned American and European
// oak casks". Nose/palate/finish as published by the distillery for the Double Cask 30 (2021 release copy
// reproduced by retailers, e.g. https://www.thewhiskybarrel.com/products/macallan-30-year-old-double-cask-2021
// and https://nicks.com.au/products/the-macallan-double-cask-30-year-old-single-malt-scotch-whisky-700ml-annual-2021-release).
// themacallan.com not reachable from here.
export const macallan30DoubleCask: EditorialWine = {
  slug: "macallan-30-double-cask",
  kind: "DESTILADO",
  name: "The Macallan 30 Años Double Cask",
  title: "The Macallan 30 Años Double Cask",
  producer: "THE MACALLAN · ESCOCIA",
  style: "Single malt escocés · 30 años · Roble americano y europeo sazonados con jerez",
  storyHeading: "Treinta años en dos robles.",
  description: "La expresión de mayor edad de la colección Double Cask: un single malt escocés de treinta años madurado en barricas de roble americano y de roble europeo, ambas seleccionadas a mano y sazonadas con vino de jerez, según la etiqueta. El roble americano aporta miel, vainilla y dulzor; el europeo, fruta seca y especia. Tres décadas en esa madera le dan un color ámbar profundo, natural y sin colorante añadido. Edición anual 2021, en estuche de roble.",
  tasting: {
    nose: "Panal de miel fresco, toffee dulce, manzana roja, higo y vaina de vainilla. Notas de la destilería para el Double Cask 30.",
    palate: "Una melodía suave de canela, jengibre, vainilla de Madagascar, frutas secas y roble. Notas de la destilería para el Double Cask 30.",
    finish: "Roble dulce, especia suave y toffee. Notas de la destilería para el Double Cask 30.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata. Sírvelo con calma y déjalo abrirse unos minutos antes del primer sorbo; con un whisky de treinta años recomendamos no ponerle hielo ni agua, para no apagar la miel, la fruta seca y la especia. Un sorbo pequeño a la vez.",
  pairing: "Es un whisky de celebración, para la sobremesa más larga. Proponemos tarta de nuez pecana en porciones pequeñas, manzana asada con canela, higos frescos, almendras garapiñadas y un trozo de comté o gruyère de cueva. Acompaña muy bien un puro de cuerpo medio. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "The Macallan se fundó en 1824 en Easter Elchies, cerca de Craigellachie, en la región de Speyside, Escocia, dentro de las Highlands. La colección Double Cask reúne roble americano y europeo sazonados con jerez; el 30 años es su expresión más alta y se embotella en ediciones anuales numeradas por año. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "The Macallan · fundada en 1824"], ["Origen", "Speyside · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "30 años"],
    ["Barricas", "Roble americano y europeo sazonados con jerez, seleccionados a mano, según etiqueta"],
    ["Color", "Natural, sin colorante añadido, según etiqueta"], ["Colección", "Double Cask Collection"],
    ["Edición", "Annual 2021 Release, según etiqueta"], ["Presentación", "Estuche de roble"],
    ["Alcohol", "43%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "box", "glass", "pairing"].map(view => `/catalogo/macallan-30-double-cask-${view}.webp`),
  captions: [
    "La botella, sobre blanco", "El estuche de roble de la edición 2021",
    "Solo, sin hielo, en vaso de cata",
    "Maridaje sugerido: tarta de nuez pecana, manzana asada con canela, higos, almendras garapiñadas y comté",
  ],
};
