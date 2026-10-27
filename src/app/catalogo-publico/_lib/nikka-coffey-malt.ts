import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (211 px product shot, upscaled 5x; soft): label reads "Nikka Coffey Malt Whisky", Nikka seal,
// Japanese カフェモルト. No box in the photo. Aroma/taste are Nikka's official tasting notes (Japanese product
// page https://www.nikka.com/products/grain/coffeymalt/ — the notes are an image there — translated here);
// production facts from https://www.nikka.com/en/brands/coffey-grain-malt/ (100% malted barley distilled in
// Coffey stills, developed 2013, old casks, 45%; classed as grain whisky because it is not pot-distilled).
export const nikkaCoffeyMalt: EditorialWine = {
  slug: "nikka-coffey-malt",
  kind: "DESTILADO",
  name: "Nikka Coffey Malt",
  title: "Nikka Coffey Malt",
  producer: "NIKKA WHISKY · JAPÓN",
  style: "Whisky japonés · 100% cebada malteada · Alambique de columna Coffey",
  storyHeading: "Malta pura, destilada en Coffey.",
  description: "Una rareza de Nikka, creada en 2013 a partir de sus experimentos para ampliar la variedad: cebada 100% malteada, pero destilada en sus alambiques de columna Coffey en lugar de los alambiques de olla tradicionales. Por eso, según la propia casa, no se clasifica como whisky de malta sino como whisky de grano, aunque sea todo malta. Madura en barricas viejas para realzar, dice Nikka, su riqueza maltosa, su complejidad y una textura sedosa. Cremoso, frutal y ligero a la vez.",
  tasting: {
    nose: "Dulzor y tostado de malta, con un suave aroma a crianza en barrica; fruta como plátano y melón, miel y un toque de vainilla, y la fragancia ligera de malta propia del Coffey Malt. Notas de Nikka para Coffey Malt.",
    palate: "Entrada ligera y suave, con cuerpo delicado y carácter frutal; un dulzor cremoso que se expande con suavidad. Notas de Nikka para Coffey Malt.",
    finish: "Limpio y refrescante. Notas de Nikka para Coffey Malt.",
  },
  serve: "Nikka recomienda probarlo primero tal cual, solo. Nuestra sugerencia: solo en vaso corto, o con un hielo grande. Y la idea de la casa para lucirlo en coctel: un Old Fashioned con Coffey Malt, azúcar morena y amargos, con hielo y una cáscara de naranja.",
  pairing: "Pide bocados cremosos y frutales. Proponemos pan de plátano, rebanadas de melón, miel de panal con queso fresco, galletas de vainilla, chocolate con leche y almendras tostadas. Son sugerencias editoriales, no indicaciones de la casa.",
  wineryStory: "Nikka la fundó Masataka Taketsuru, el padre del whisky japonés, en 1934 en Yoichi, Hokkaido, después de aprender el oficio en Escocia. Sus alambiques de columna Coffey, instalados en los años sesenta, hoy destilan en Miyagikyo, en Sendai; el Coffey Malt es la prueba de que también saben tratar la malta. Nikka aclara que una parte de los lotes antiguos de la fórmula provenía de destilado importado de Ben Nevis, su destilería escocesa, por lo que no cumple todos los criterios de la denominación japonesa de whisky. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Casa", "Nikka Whisky · fundada en 1934"], ["Origen", "Japón"],
    ["Estilo", "Whisky de grano japonés (100% malta destilada en columna), según Nikka"],
    ["Cereal", "Cebada 100% malteada, según Nikka"],
    ["Destilación", "Alambiques de columna Coffey"],
    ["Barricas", "Barricas viejas, según Nikka"],
    ["Edad", "Sin declaración de edad"], ["Lanzamiento", "2013"],
    ["Alcohol", "45%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "glass", "pairing"].map(view => `/catalogo/nikka-coffey-malt-${view}.webp`),
  captions: [
    "La botella, sobre blanco",
    "Solo, en vaso corto, como recomienda Nikka para el primer trago",
    "Maridaje sugerido: pan de plátano, melón, miel de panal, galletas de vainilla, chocolate con leche y almendras",
  ],
};
