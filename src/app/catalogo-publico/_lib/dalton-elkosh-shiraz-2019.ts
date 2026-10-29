import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's ChatGPT renders of the front, rear and box (originals kept as
// dalton-elkosh-shiraz-2019-*-chatgpt-original.jpeg). Front: "Dalton · Elkosh · Single Vineyard · Shiraz · 2019 · 2374/4500".
// Rear: "Elkosh Single Vineyard Shiraz 2019 · Each wine in our Single Vineyard series encapsulates the nature of a site
// specific micro cosmos: the soil, its landscape and the climate that shapes them. Elkosh is our parcel in the heart of the
// Galilee, where buttercups dance on ammonite and chalky soil, 600 meters above sea level. This wine is made entirely of
// Shiraz grapes, hand harvested and aged in French oak · Region: Upper Galilee · Soil type: Limestone · Altitude: 600 m ·
// Barrel: 18 months · Vegan friendly · Not mevushal · Kosher for Passover · 750 ml · 13.5% alc · Contains sulfites ·
// Imported by Allied Importers, Brooklyn NY · Produced and bottled by Dalton Winery Ltd., Merom Hagalil, Israel".
// Checked against Isaac's photo of the real rear label (dalton-elkosh-shiraz-2019-label-original.jpeg, 29-oct): the render had
// "UNDER THE MEHADRIN" / "SHVITT" / lot L60519 / "600 m" / barcode 7229016607543; fixed to "KOSHER LE MEHADRIN" / "SHVI'IT" /
// L40519 / "600+ m" / real barcode 0033115003222. Only layout difference left: the vegan badge sits bottom-left on the real label.
export const daltonElkoshShiraz2019: EditorialWine = {
  slug: "dalton-elkosh-shiraz-2019",
  name: "Dalton Elkosh Single Vineyard Shiraz 2019",
  title: "Dalton Elkosh Single Vineyard Shiraz",
  year: 2019,
  producer: "DALTON WINERY · ALTA GALILEA, ISRAEL",
  style: "100% Shiraz · Tinto · Viñedo único · Edición numerada",
  storyHeading: "Un Shiraz de una sola parcela, sobre piedra caliza y amonitas.",
  description: "Un Shiraz cien por ciento de la serie Single Vineyard de Dalton, hecho solo con uvas de Elkosh, la parcela de la bodega en el corazón de la Galilea. La contraetiqueta lo cuenta así: cada vino de esta serie captura el microcosmos de un sitio, su suelo, su paisaje y su clima; en Elkosh, las flores silvestres crecen sobre suelo calcáreo lleno de amonitas, a 600 metros sobre el nivel del mar. De ahí el fósil que lleva la botella en relieve. Las uvas se vendimian a mano y el vino madura dieciocho meses en roble francés. Es un tinto de 13.5% de alcohol, apto para veganos según la etiqueta, y una edición numerada: esta botella es la 2,374 de 4,500.",
  pairing: "Nuestra sugerencia principal: arrachera de res a la parrilla con chimichurri de hierbas, elotes asados y pimientos tatemados, todo con aceite de oliva y sin lácteos. La fruta negra y el toque especiado del Shiraz piden brasas y hierbas frescas. También proponemos pierna de cordero rostizada con ajo y romero o, como alternativa vegetal, portobellos a la parrilla con salsa de chile ancho. Sírvelo a unos 17 °C, abierto media hora antes. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Dalton Winery está en Merom Hagalil, en la Alta Galilea, en el norte de Israel, según la contraetiqueta. Su serie Single Vineyard embotella parcelas únicas, como Elkosh, cada una con su propio suelo y clima. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Dalton Winery · Merom Hagalil"], ["Vino", "Elkosh Single Vineyard Shiraz"],
    ["Añada", "2019"], ["Origen", "Alta Galilea (Upper Galilee) · Israel"], ["Tipo", "Tinto"],
    ["Uva", "100% Shiraz, según etiqueta"],
    ["Viñedo", "Elkosh, a 600 metros sobre el nivel del mar, según etiqueta"],
    ["Suelo", "Piedra caliza (limestone), según etiqueta"],
    ["Crianza", "18 meses en barricas de roble francés, según etiqueta"],
    ["Vendimia", "A mano, según etiqueta"],
    ["Edición", "Numerada: botella 2,374 de 4,500, según etiqueta"],
    ["Alcohol", "13.5%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Vegano", "Apto para veganos, según etiqueta"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table", "box"].map(view => `/catalogo/dalton-elkosh-shiraz-2019-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, en una terraza de piedra de la Alta Galilea", "Una copa sobre piedra caliza, con una amonita", "Maridaje sugerido: arrachera a la parrilla con chimichurri y verduras tatemadas", "Una cena de otoño bajo las luces", "El estuche de Elkosh"],
};
