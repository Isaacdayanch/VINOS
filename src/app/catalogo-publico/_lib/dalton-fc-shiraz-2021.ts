import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's ChatGPT renders of the front and rear labels (originals kept as
// dalton-fc-shiraz-2021-*-chatgpt-original.jpeg): "Dalton · family collection · Est. 1995 · Shiraz · Galilee — 2021";
// rear: "Shiraz 2021 Galilee · Estate bottled · Israeli dry red wine · Aged 18 months in oak · The Family Collection came
// together in celebration of our winery's 30th anniversary. A series of wines offering you the very best quality and most
// timeless bottles made with endless dedication and love. This is our family's legacy in the Galilee · 750 ml · 14.5% ·
// Contains sulfites · Vegan friendly · Not mevushal · Kosher for Passover · OU-P · Beit Yoseph · L40321".
// No photo of the real rear label yet: the barcode on the render (7290016922095) fails the EAN check digit, so it is invented.
export const daltonFcShiraz2021: EditorialWine = {
  slug: "dalton-fc-shiraz-2021",
  name: "Dalton Family Collection Shiraz 2021",
  title: "Dalton Family Collection Shiraz",
  year: 2021,
  producer: "DALTON WINERY · GALILEA, ISRAEL",
  style: "Shiraz · Tinto seco · 18 meses en roble · Edición 30 aniversario",
  storyHeading: "El Shiraz de la familia, con el ciervo de la Galilea.",
  description: "La Family Collection nació para celebrar los treinta años de Dalton, la bodega que la familia Haruni fundó en 1995 en la Alta Galilea: una serie de vinos que, según la contraetiqueta, ofrece la mejor calidad y las botellas más atemporales de la casa, hechas con dedicación y amor sin fin. Este Shiraz 2021 es un tinto seco de la Galilea, embotellado en la propia finca y criado dieciocho meses en roble, con 14.5% de alcohol. Es el hermano del Cabernet Sauvignon de la misma colección: la misma etiqueta con el ciervo grabado sobre la roca, ahora con la banda en color terracota que distingue al Shiraz.",
  pairing: "Nuestra sugerencia principal: pierna de cordero rostizada lentamente con romero, ajo y pimienta negra, con zanahorias y cebollas caramelizadas al horno, todo con aceite de oliva y sin lácteos. La fruta madura y la pimienta del Shiraz, junto con los dieciocho meses de roble, acompañan la carne especiada. También proponemos pollo rostizado con zaatar y limón o, como alternativa vegetal, berenjenas asadas con tahini y granada. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Dalton Winery se fundó en 1995 por la familia Haruni en la Alta Galilea, en el norte de Israel, y embotella en Merom Hagalil, según la contraetiqueta. La Family Collection, con su ciervo en la etiqueta, es la línea con la que la bodega celebró su trigésimo aniversario. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Dalton Winery · fundada en 1995"], ["Línea", "Family Collection · 30 aniversario"],
    ["Añada", "2021"], ["Origen", "Galilea · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Uva", "Shiraz"],
    ["Embotellado", "En la finca (estate bottled), según etiqueta"],
    ["Crianza", "18 meses en roble, según etiqueta"],
    ["Alcohol", "14.5%"], ["Contenido", "750 ml"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj y lemehadrin (OU-P y Beit Yoseph), según etiqueta; consulta los sellos originales"],
    ["Vegano", "Apto para veganos, según sello de la etiqueta"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/dalton-fc-shiraz-2021-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, en una pradera de la Galilea al atardecer", "Una copa en la ventana de una casa de campo", "Maridaje sugerido: pierna de cordero rostizada con romero y verduras", "Una sobremesa de campo con pan, dátiles e higos"],
};
