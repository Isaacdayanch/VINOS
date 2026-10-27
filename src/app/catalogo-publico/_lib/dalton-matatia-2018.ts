import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos (front label, rear label, box). Rear label: "Israeli dry red wine ·
// Estate bottled Upper Galilee · Aged for 24 months in French oak barrels · Matatia is an extraordinary gift,
// honoring the man whose vision is the inspiration for Dalton Winery. Produced during outstanding years and in
// limited quantities… · Non-mevushal · Kosher for Passover · OU-P · Beit Yoseph · Vegan friendly · 750 ml ·
// 14.5% alc. · Contains sulfites · Produced and bottled by Dalton Winery Ltd, Merom Hagalil, Israel". Front:
// bottle 2139 / 4100. Capsule seal: "Dalton · Galilee · Israel · 1995". The grape blend is NOT printed on the
// label; third-party listings disagree (Vivino: Cabernet Sauvignon, Cabernet Franc, Merlot), so it is not stated
// as fact. Winery facts: founded 1995 by the Haruni family (https://en.wikipedia.org/wiki/Dalton_Winery);
// Matatia is the winery's flagship label, released only in select vintages (same source).
// Originals kept as dalton-matatia-2018-front-original.jpeg and dalton-matatia-2018-label-original.jpeg.
export const daltonMatatia2018: EditorialWine = {
  slug: "dalton-matatia-2018",
  name: "Dalton Matatia 2018",
  title: "Dalton Matatia",
  year: 2018,
  producer: "DALTON WINERY · ALTA GALILEA, ISRAEL",
  style: "Tinto seco · Alta Galilea · 24 meses en roble francés · Edición numerada",
  storyHeading: "El vino que Dalton reserva para los grandes años.",
  description: "Matatia es la joya de Dalton: su etiqueta insignia, que la bodega produce solo en años excepcionales y en cantidades limitadas. Esta botella es la número 2139 de 4100 de la añada 2018. Un tinto seco de la Alta Galilea, embotellado en la propia finca y criado veinticuatro meses en barricas de roble francés, según la contraetiqueta. Es un vino oscuro, de cuerpo pleno, hecho para guardarse y para abrirse con calma. La bodega lo describe como un regalo extraordinario en honor al hombre cuya visión inspiró Dalton Winery, y dice que encarna una eminencia tan rara y excepcional como él.",
  pairing: "Nuestra sugerencia principal: un rib eye de res a la parrilla, con costra dorada, acompañado de papas cambray asadas con romero y cebolla morada, todo con aceite de oliva y sin lácteos. La intensidad del asado acompaña el cuerpo y la crianza larga de este tinto. También proponemos costillar de cordero al horno con hierbas o, como alternativa vegetal, berenjena rostizada con tahini y granada. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Dalton Winery se fundó en 1995 por la familia Haruni en la Alta Galilea, en el norte de Israel, cerca de la localidad de Dalton; el sello de la cápsula lleva ese año. Sus viñedos están en la Galilea y la bodega embotella en la finca, en Merom Hagalil, según la contraetiqueta. Matatia lleva el nombre del hombre cuya visión inspiró la bodega, y Dalton reserva esta etiqueta para añadas sobresalientes. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Dalton Winery · fundada en 1995"], ["Vino", "Matatia"],
    ["Añada", "2018"], ["Origen", "Alta Galilea · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Embotellado", "En la finca (estate bottled), Alta Galilea, según etiqueta"],
    ["Crianza", "24 meses en barricas de roble francés, según etiqueta"],
    ["Edición", "Numerada: botella 2139 de 4100, según etiqueta"],
    ["Cuerpo", "Pleno"], ["Color", "Rubí muy oscuro"],
    ["Alcohol", "14.5%"], ["Contenido", "750 ml"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj y lemehadrin (OU-P y Beit Yoseph), según etiqueta; consulta los sellos originales"],
    ["Vegano", "Apto para veganos, según sello de la etiqueta"],
    ["Presentación", "Estuche rígido negro y dorado"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table", "box"].map(view => `/catalogo/dalton-matatia-2018-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, en una terraza de la Galilea", "Una copa a la luz del atardecer", "Maridaje sugerido: rib eye a la parrilla con papas y cebolla asadas", "Una mesa para compartir entre olivos", "El estuche de Matatia"],
};
