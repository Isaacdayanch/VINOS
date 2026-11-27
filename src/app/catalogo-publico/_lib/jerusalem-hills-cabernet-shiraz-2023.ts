import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (jerusalem-hills-cabernet-shiraz-2023-front-original.jpeg and
// -label-original.jpeg, 10-nov-2026). Front: "Judean Vineyards · Jerusalem Winery · Israel · Cabernet-Shiraz · קברנה שירז ·
// Jerusalem Hills" (purple band). Rear: "Jerusalem Winery Israel · Cabernet Sauvignon 70% - Shiraz 30% · Alc. 13% by vol ·
// 750 ml · 2023 · Dry red wine · Judean Heights · Product of Israel · Our Cabernet sauvignon and Shiraz matures gently in the
// warm days and cool nights in the Judean Mountains, surrounding Jerusalem, close to maritim breeze coming straight from the
// Israeli coastal plain. This ideal climate allows the fruit to reach its entire flavor potential, offering rich varietal
// flavors delicately balanced by a generous savory finish. It is best served with grilled lamb, duck or veal chops… Open and
// decant an hour prior to serving at 65°F · Jerusalem Winery · 42820 Geulim · Israel · Kosher for Passover · Mevushal ·
// Contains sulfites". No back photo in the gallery (rule since 10-nov-2026).
export const jerusalemHillsCabernetShiraz2023: EditorialWine = {
  slug: "jerusalem-hills-cabernet-shiraz-2023",
  name: "Jerusalem Hills Cabernet-Shiraz 2023",
  title: "Jerusalem Winery Cabernet-Shiraz · Jerusalem Hills",
  year: 2023,
  producer: "JERUSALEM WINERY · MONTES DE JUDEA, ISRAEL",
  style: "70% Cabernet Sauvignon · 30% Shiraz · Tinto seco · Mevushal · Colección Jerusalem Hills",
  storyHeading: "Dos uvas, un final sabroso y generoso.",
  description: "Un ensamble de 70% Cabernet Sauvignon y 30% Shiraz de la colección Jerusalem Hills de Jerusalem Winery, hecho en los montes de Judea que rodean Jerusalén. La contraetiqueta lo cuenta así: las dos uvas maduran despacio con los días cálidos y las noches frescas de la montaña, cerca de la brisa que llega directo desde la costa de Israel, y ese clima les permite dar sabores varietales ricos, equilibrados con delicadeza por un final sabroso y generoso. Es un tinto seco de 13% de alcohol, mevushal, con la banda morada que lo distingue dentro de la colección.",
  pairing: "La propia bodega lo recomienda con cordero a la parrilla, pato o chuletas de ternera. Nuestra sugerencia principal: chuletas de cordero a la parrilla con costra de hierbas, papas cambray asadas y zanahorias glaseadas con miel, todo con aceite de oliva y sin lácteos. La estructura del Cabernet y la especia del Shiraz acompañan la grasa del cordero. También proponemos magret de pato con salsa de ciruela o, como alternativa vegetal, portobellos asados con romero. La etiqueta sugiere abrirlo y decantarlo una hora antes y servirlo a unos 18 °C (65 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Jerusalem Winery es una bodega de Jerusalén, Israel, con viñedos en los montes de Judea (Judean Vineyards), según la etiqueta. Su colección Jerusalem Hills reúne vinos jóvenes y accesibles; la misma contraetiqueta menciona Cabernet Sauvignon, Merlot, Gewürztraminer, Chardonnay, Sauvignon blanc, rosado, Riesling y Muscat dulce. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Jerusalem Winery · Jerusalén"], ["Línea", "Jerusalem Hills"],
    ["Añada", "2023"], ["Origen", "Montes de Judea (Judean Heights) · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Ensamblaje", "70% Cabernet Sauvignon · 30% Shiraz, según etiqueta"],
    ["Carácter según etiqueta", "Sabores varietales ricos, con un final sabroso y generoso"],
    ["Servicio según etiqueta", "Abrir y decantar una hora antes; servir a 65 °F (unos 18 °C)"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/jerusalem-hills-cabernet-shiraz-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, en el mercado de especias de Jerusalén", "Una copa con moras y romero a la luz de una vela", "Maridaje sugerido: chuletas de cordero con hierbas, papas y zanahorias", "Una comida de sábado bajo la parra en un jardín de Jerusalén"],
};
