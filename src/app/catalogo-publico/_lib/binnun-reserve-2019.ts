import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's ChatGPT renders of the front and rear labels (originals kept as
// binnun-reserve-2019-*-chatgpt-original.jpeg). Rear label: "Binnun Winery Reserve · 70% Cabernet Sauvignon 22% Merlot
// 8% Malbec · Red wine · 2019 · Judean Hills · Bin Nun Winery and vineyards are situated in the coastal plain of Judea, at
// the foothills of Tel Gezer… King Solomon's wine-presses and vineyards were situated in this region · all from the same
// vine plot, strict thinning of grape clusters and hand-picked · stainless steel fermentation and 12 months aging in
// high-quality French oak barrels · full-body · will continue to develop… for the next five years · serving 18°C ·
// Winemakers: Eddie Gandler and Danny Yaniv · Consultant: Lewis Pasco · Non mevushal · Kosher for Passover · Alc. 14% ·
// Contains sulfites · Kfar Binnun, Israel". Checked against Isaac's photo of the real rear label
// (binnun-reserve-2019-label-original.jpeg): text and barcode 7290016742239 match.
export const binnunReserve2019: EditorialWine = {
  slug: "binnun-reserve-2019",
  name: "Bin Nun Reserve 2019",
  title: "Bin Nun Reserve",
  year: 2019,
  producer: "BINNUN WINERY · COLINAS DE JUDEA, ISRAEL",
  style: "70% Cabernet Sauvignon · 22% Merlot · 8% Malbec · Tinto · Judean Hills",
  storyHeading: "De la tierra de los lagares del rey Salomón.",
  description: "Un tinto reserva de las colinas de Judea, de una sola parcela de viñedo al pie de Tel Gezer, en la llanura costera de Judea, una zona vinícola conocida desde tiempos bíblicos. La contraetiqueta cuenta que aquí estaban los lagares y viñedos del rey Salomón, y que sus noches muy frías y días calurosos dan una maduración óptima. Setenta por ciento Cabernet Sauvignon, veintidós de Merlot y ocho de Malbec, con racimos aclarados y vendimia a mano; fermentación en acero inoxidable y doce meses en barricas de roble francés de alta calidad, para un vino de cuerpo pleno con fruta y roble en equilibrio, que seguirá ganando complejidad durante los próximos cinco años.",
  pairing: "Nuestra sugerencia principal: costillas de cordero a la parrilla con costra de hierbas, calabacitas y jitomates asados y cuscús con hierbas, todo con aceite de oliva y sin lácteos. El cuerpo pleno y el roble de este reserva acompañan la grasa del cordero y las hierbas. También proponemos pecho de res braseado o, como alternativa vegetal, berenjena rostizada con tahini y granada. La bodega recomienda servirlo a 18 °C. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Binnun Winery está en Kfar Binnun, en la llanura costera de Judea, al pie de Tel Gezer, según la contraetiqueta. Sus enólogos son Eddie Gandler y Danny Yaniv, con Lewis Pasco como consultor. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Binnun Winery · Kfar Binnun"], ["Vino", "Bin Nun Reserve"],
    ["Añada", "2019"], ["Origen", "Colinas de Judea (Judean Hills) · Israel"], ["Tipo", "Tinto, según etiqueta"],
    ["Ensamblaje", "70% Cabernet Sauvignon · 22% Merlot · 8% Malbec, de una sola parcela, según etiqueta"],
    ["Crianza", "12 meses en barricas de roble francés, según etiqueta"],
    ["Cuerpo", "Pleno, según etiqueta"], ["Guarda", "Seguirá desarrollándose los próximos cinco años, según etiqueta"],
    ["Servicio según etiqueta", "18 °C"],
    ["Enólogos", "Eddie Gandler y Danny Yaniv · Consultor: Lewis Pasco"],
    ["Alcohol", "14%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/binnun-reserve-2019-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, entre las vides al amanecer", "Una copa al sol de Judea", "Maridaje sugerido: costillas de cordero con hierbas y verduras asadas", "Una mesa de Shabat en las colinas"],
};
