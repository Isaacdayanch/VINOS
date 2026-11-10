import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (jerusalem-hills-merlot-2023-front-original.jpeg and
// -label-original.jpeg, 10-nov-2026). Front: "Judean Vineyards · Jerusalem Winery · Israel · Merlot · מרלו · Jerusalem Hills".
// Rear: "Jerusalem Winery Israel · Merlot · Alc. 13% vol · 750 ml · 2023 · Dry red wine · Judean Heights · Product of Israel ·
// Our Merlot matures gently in the warm days and cool nights of the Judean Mountains surrounding Jerusalem, close to maritim
// breeze coming straight from the Israeli coastal plain. This ideal climate allows the fruit to reach its full potential,
// offering rich, ripe and concentrated flavors of juicy plums and black cherries. It is best served with roasted meats, grilled
// poultry or gourmet cheeses… Open and decant an hour prior to serving at 65°F · Imported by Happy Hearts Wine LLC, Brooklyn NY ·
// Jerusalem Winery · 9342122 Jerusalem · Israel · Kosher for Passover · Mevushal · Contains sulfites · barcode 8 44510 01312 4".
export const jerusalemHillsMerlot2023: EditorialWine = {
  slug: "jerusalem-hills-merlot-2023",
  name: "Jerusalem Hills Merlot 2023",
  title: "Jerusalem Winery Merlot · Jerusalem Hills",
  year: 2023,
  producer: "JERUSALEM WINERY · MONTES DE JUDEA, ISRAEL",
  style: "Merlot · Tinto seco · Mevushal · Colección Jerusalem Hills",
  storyHeading: "Días cálidos y noches frescas en los montes de Jerusalén.",
  description: "Un Merlot de la colección Jerusalem Hills de Jerusalem Winery, hecho en los montes de Judea que rodean Jerusalén. La contraetiqueta lo cuenta así: la uva madura despacio con los días cálidos y las noches frescas de la montaña, cerca de la brisa que llega directo desde la costa de Israel, y ese clima le da sabores ricos, maduros y concentrados de ciruela jugosa y cereza negra. Es un tinto seco de 13% de alcohol, mevushal, pensado para la mesa de todos los días y para las fiestas.",
  pairing: "La propia bodega lo recomienda con carnes rostizadas y aves a la parrilla. Nuestra sugerencia principal: pollo rostizado entero con hierbas y limón, papas doradas al horno y zanahorias asadas, todo con aceite de oliva y sin lácteos. La fruta madura y la suavidad del Merlot acompañan muy bien el pollo dorado. También proponemos albóndigas de res en salsa de jitomate o, como alternativa vegetal, berenjena rostizada con granada. La etiqueta sugiere abrirlo y decantarlo una hora antes y servirlo a unos 18 °C (65 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Jerusalem Winery es una bodega de Jerusalén, Israel, con viñedos en los montes de Judea (Judean Vineyards), según la etiqueta. Su colección Jerusalem Hills reúne vinos jóvenes y accesibles; la misma contraetiqueta menciona Cabernet Sauvignon, Cabernet-Shiraz, Gewürztraminer, Chardonnay, Sauvignon blanc, rosado, Riesling y Muscat dulce. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Jerusalem Winery · Jerusalén"], ["Línea", "Jerusalem Hills"],
    ["Añada", "2023"], ["Origen", "Montes de Judea (Judean Heights) · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Uva", "Merlot"],
    ["Carácter según etiqueta", "Ciruela jugosa y cereza negra; rico, maduro y concentrado"],
    ["Servicio según etiqueta", "Abrir y decantar una hora antes; servir a 65 °F (unos 18 °C)"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  // No back photo: Isaac decided on 10-nov-2026 that composited back labels look bad; the rear label
  // is only used as the source of the facts above (photo kept as -label-original.jpeg).
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/jerusalem-hills-merlot-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, en una terraza de Jerusalén al atardecer", "Una copa con ciruelas y cerezas sobre piedra de Jerusalén", "Maridaje sugerido: pollo rostizado con hierbas, papas y zanahorias", "Una mesa de Shabat en un patio de Jerusalén"],
};
