import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's ChatGPT renders of the front and rear labels (originals kept as
// dalton-fc-cabernet-2023-*-chatgpt-original.jpeg): "Dalton · family collection · Est. 1995 · Cabernet Sauvignon ·
// Galilee — 2023"; rear: "Cabernet Sauvignon 2023 Galilee · Estate bottled Israeli dry red wine · Aged 18 months in
// oak · The Family Collection came together in celebration of our winery's 30th anniversary… This is our family's
// legacy in the Galilee · Non-mevushal · Kosher for Passover · OU-P · Beit Yoseph · Vegan friendly · 750 ml · 14.5%".
// No photo of the real rear label yet: the barcode and the fine print could not be checked against the bottle.
export const daltonFcCabernet2023: EditorialWine = {
  slug: "dalton-fc-cabernet-2023",
  name: "Dalton Family Collection Cabernet Sauvignon 2023",
  title: "Dalton Family Collection Cabernet Sauvignon",
  year: 2023,
  producer: "DALTON WINERY · GALILEA, ISRAEL",
  style: "Cabernet Sauvignon · Tinto seco · 18 meses en roble · Edición 30 aniversario",
  storyHeading: "El legado de una familia en la Galilea.",
  description: "La Family Collection nació para celebrar los treinta años de Dalton, la bodega que la familia Haruni fundó en 1995 en la Alta Galilea: una serie de vinos que, según la contraetiqueta, ofrece la mejor calidad y las botellas más atemporales de la casa, hechas con dedicación y amor sin fin. Este Cabernet Sauvignon 2023 es un tinto seco de la Galilea, embotellado en la propia finca y criado dieciocho meses en roble. El ciervo grabado en la etiqueta mira desde una roca hacia los viñedos: así se presenta, dice la bodega, el legado de la familia en la Galilea.",
  pairing: "Nuestra sugerencia principal: brisket de res braseado lentamente en su jugo, con zanahorias, cebollas y papas asadas al tomillo, todo con aceite de oliva y sin lácteos. La carne suave y jugosa va con la estructura y los dieciocho meses de roble de este Cabernet. También proponemos costillas de res al horno o, como alternativa vegetal, hongos portobello rostizados con lentejas y hierbas. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Dalton Winery se fundó en 1995 por la familia Haruni en la Alta Galilea, en el norte de Israel, y embotella en Merom Hagalil, según la contraetiqueta. La Family Collection, con su ciervo en la etiqueta, es la línea con la que la bodega celebró su trigésimo aniversario. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Dalton Winery · fundada en 1995"], ["Línea", "Family Collection · 30 aniversario"],
    ["Añada", "2023"], ["Origen", "Galilea · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Uva", "Cabernet Sauvignon"],
    ["Embotellado", "En la finca (estate bottled), según etiqueta"],
    ["Crianza", "18 meses en roble, según etiqueta"],
    ["Alcohol", "14.5%"], ["Contenido", "750 ml"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj y lemehadrin (OU-P y Beit Yoseph), según etiqueta; consulta los sellos originales"],
    ["Vegano", "Apto para veganos, según sello de la etiqueta"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/dalton-fc-cabernet-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, en un mirador del bosque", "Una copa junto a la chimenea", "Maridaje sugerido: brisket braseado con verduras asadas", "Una cena de otoño frente al bosque"],
};
