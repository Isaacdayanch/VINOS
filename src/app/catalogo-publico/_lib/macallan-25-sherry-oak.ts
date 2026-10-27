import type { EditorialWine } from "./editorial-wine";

// Isaac's photo: Annual 2019 Release in its oak box. The label itself reads "Natural Colour: Rich Mahogany ·
// Lingering wood smoke, Rich dried fruit, Vanilla, Ginger spice", 700 ml, 43% vol. Nose/palate/finish as published
// by the distillery for the Sherry Oak 25 (2019 release copy reproduced by retailers, e.g.
// https://theoldbarrelhouse.com.au/shop/scottish-whisky/the-macallan/the-macallan-25-year-old-sherry-oak-2019-release-700ml-43/
// and https://www.thewhiskybarrel.com/products/macallan-25-year-old-sherry-oak). themacallan.com not reachable from here.
export const macallan25SherryOak: EditorialWine = {
  slug: "macallan-25-sherry-oak",
  kind: "DESTILADO",
  name: "The Macallan 25 Años Sherry Oak",
  title: "The Macallan 25 Años Sherry Oak",
  producer: "THE MACALLAN · ESCOCIA",
  style: "Single malt escocés · 25 años · Solo barricas de roble sazonadas con jerez",
  storyHeading: "Veinticinco años en roble de jerez.",
  description: "La joya de la colección Sherry Oak: un single malt escocés de veinticinco años madurado únicamente en barricas de roble seleccionadas a mano y sazonadas con vino de jerez en Jerez, España, según la etiqueta. Un cuarto de siglo en esa madera le da su color caoba intenso, natural y sin colorante añadido, y un perfil de fruta seca, humo de madera y especia. Edición anual 2019, en estuche de roble.",
  tasting: {
    nose: "Cítricos equilibrados con canela, jerez y humo de madera. Notas de la destilería para el Sherry Oak 25.",
    palate: "Pleno y rico, con fruta seca y un toque de humo de madera. Notas de la destilería para el Sherry Oak 25.",
    finish: "Largo, con fruta seca, humo de madera y especia; la etiqueta resume: humo de madera persistente, fruta seca, vainilla y jengibre. Notas de la destilería para el Sherry Oak 25.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata. Sírvelo con calma y déjalo abrirse unos minutos; con un whisky de veinticinco años recomendamos no ponerle hielo ni agua, para no apagar la fruta seca y el humo. Un sorbo pequeño a la vez.",
  pairing: "Es un whisky para la sobremesa larga, después de cenar. Proponemos chocolate amargo, higos frescos o secos, dátiles rellenos de nuez, cáscara de naranja confitada cubierta de chocolate y lascas de parmesano añejo. Acompaña muy bien un puro de cuerpo medio. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "The Macallan se fundó en 1824 en Easter Elchies, cerca de Craigellachie, en la región de Speyside, Escocia, dentro de las Highlands. La colección Sherry Oak madura únicamente en barricas sazonadas con jerez; el 25 años es una de sus expresiones más altas y se embotella en ediciones anuales numeradas por año. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "The Macallan · fundada en 1824"], ["Origen", "Speyside · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky, según etiqueta"], ["Edad", "25 años"],
    ["Barricas", "Solo roble sazonado con jerez, seleccionado a mano en Jerez, España, según etiqueta"],
    ["Color", "Natural · caoba intenso (Rich Mahogany), según etiqueta"], ["Colección", "Sherry Oak"],
    ["Edición", "Annual 2019 Release, según etiqueta"], ["Presentación", "Estuche de roble"],
    ["Alcohol", "43%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "box", "glass", "pairing"].map(view => `/catalogo/macallan-25-sherry-oak-${view}.webp`),
  captions: [
    "La botella, sobre blanco", "El estuche de roble de la edición 2019",
    "Solo, sin hielo, en vaso de cata",
    "Maridaje sugerido: chocolate amargo, higos, dátiles con nuez, naranja confitada y parmesano añejo",
  ],
};
