import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (front packshot): tall square-based clear bottle, light cork stopper, pale green-yellow liquid,
// round green seal "Zachlawi" (white script, heart over the i) + "PISTACHIO" (second line too blurry to read).
// No ABV, volume or kosher mark readable in the photo.
// Product: Royal Wine (US distributor) https://royalwine.com/spirits-liqueurs/zachlawi-pistachio-arak-750-ml-6/
// (750 ml, 30% ABV / 60 proof, not barrel aged); brand page https://royalwine.com/brand/zachlawi/ (distillery on the
// Jersey Shore, in operation since 2004). Producer description (roasted pistachio, velvety texture, neat or in drinks):
// https://67wine.com/products/zachlawi-arak-pistachio-kosher-750ml ; https://www.misterwrightfinewines.com/spirits/Zachlawi-Zachlawi-Pistachio-Arak-w4689020k1
// (750 ml, New Jersey). Founder story: OU Kosher https://oukosher.org/blog/news/zachlawi-fig-arak-personal-notes/
// (Marty Kairey, Syrian-Sephardi background, began distilling arak commercially in 2005, inspired by an Aleppo-born
// landlord who made arak from raisins and aniseed). ABV conflicts between shops (30/40/50%); we use Royal Wine's 30%.
// No official nose/palate/finish notes were found; tasting below paraphrases the producer's description.
export const arakZachlawiPistachio: EditorialWine = {
  slug: "arak-zachlawi-pistachio",
  kind: "DESTILADO",
  name: "Zachlawi Pistachio Arak",
  title: "Zachlawi Pistachio Arak",
  producer: "ZACHLAWI DISTILLERY · NUEVA JERSEY, EUA",
  style: "Arak de pistache · Pequeña destilería artesanal",
  storyHeading: "El arak se vuelve postre.",
  description: "Una versión golosa del arak, hecha por una pequeña destilería artesanal de la costa de Nueva Jersey. La casa la describe como un destilado único que captura la esencia del pistache tostado, con una textura aterciopelada en la que el pistache es el protagonista. En la botella luce un tono verde amarillento pálido, como el del propio pistache.",
  tasting: {
    nose: "Pistache tostado, según la descripción de la casa.",
    palate: "El pistache al centro, con una textura aterciopelada y un perfil rico e indulgente. Descripción de la casa; no publica notas de cata más detalladas.",
    finish: "La casa no publica notas del final. Sugerencia editorial: probarlo solo y frío para apreciar cómo se queda el pistache.",
  },
  serve: "La casa lo propone solo o como toque en tragos. Nuestra sugerencia: bien frío, en vaso corto con un hielo grande, como digestivo de sobremesa; también va de maravilla junto al café.",
  pairing: "Pide sobremesa dulce. Proponemos baklava de pistache, dátiles, halva, pistaches tostados y una tacita de café turco. Son sugerencias editoriales, no indicaciones de la casa.",
  wineryStory: "Zachlawi la fundó Marty Kairey, de raíces sefardíes sirias, que en 2005 empezó a destilar arak de forma comercial en la costa de Nueva Jersey. Lo inspiró su casero, originario de Alepo, que fermentaba pasas y las destilaba con anís en un alambique de olla. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Casa", "Zachlawi Distillery"], ["Origen", "Nueva Jersey, Estados Unidos"],
    ["Estilo", "Arak de pistache"], ["Barrica", "Sin crianza en barrica, según Royal Wine"],
    ["Alcohol", "30%, según su distribuidor Royal Wine"], ["Contenido", "750 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "glass", "pairing"].map(view => `/catalogo/arak-zachlawi-pistachio-${view}.webp`),
  captions: [
    "La botella, sobre blanco",
    "Frío, en vaso corto con un hielo grande, junto a unos pistaches",
    "Maridaje sugerido: baklava de pistache, dátiles, halva y café turco",
  ],
};
