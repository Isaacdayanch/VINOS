import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (jerusalem-hills-cabernet-2023-front-original.jpeg and
// -label-original.jpeg, 10-nov-2026). Front: "Judean Vineyards · Jerusalem Winery · Israel · Cabernet Sauvignon ·
// קברנה סוביניון · Jerusalem Hills" (red band). Rear: "Jerusalem Winery Israel · Cabernet Sauvignon · Alc. 13% by vol ·
// 750 ml · 2023 · Dry red wine · Judean Heights · Product of Israel · Our Cabernet sauvignon matures gently in the warm days
// and cool nights in the Judean Mountains, surrounding Jerusalem, close to maritim breeze coming straight from the Israeli
// coastal plain. This ideal climate allows the fruit to reach its entire flavor potential, offering full of ripe raspberry
// flavors, black cherries and hints of black pepper with a final note of aromatic spices. It is best served with grilled
// meats and colourfull ethnic dishes… Open and decant an hour prior to serving at 65°F · Kosher for Passover · Mevushal ·
// Contains sulfites". No back photo in the gallery (rule since 10-nov-2026).
export const jerusalemHillsCabernet2023: EditorialWine = {
  slug: "jerusalem-hills-cabernet-2023",
  name: "Jerusalem Hills Cabernet Sauvignon 2023",
  title: "Jerusalem Winery Cabernet Sauvignon · Jerusalem Hills",
  year: 2023,
  producer: "JERUSALEM WINERY · MONTES DE JUDEA, ISRAEL",
  style: "Cabernet Sauvignon · Tinto seco · Mevushal · Colección Jerusalem Hills",
  storyHeading: "Frambuesa, cereza negra y un toque de pimienta.",
  description: "Un Cabernet Sauvignon de la colección Jerusalem Hills de Jerusalem Winery, hecho en los montes de Judea que rodean Jerusalén. La contraetiqueta lo cuenta así: la uva madura despacio con los días cálidos y las noches frescas de la montaña, cerca de la brisa que llega directo desde la costa de Israel, y ese clima le da sabores llenos de frambuesa madura y cereza negra, con notas de pimienta negra y un final de especias aromáticas. Es un tinto seco de 13% de alcohol, mevushal, el hermano del Merlot de la misma colección, con la banda roja que lo distingue.",
  pairing: "La propia bodega lo recomienda con carnes a la parrilla y platos étnicos llenos de color. Nuestra sugerencia principal: brochetas de res a la parrilla con pimientos y cebolla morada, arroz con hierbas y granada, y pan pita caliente, todo con aceite de oliva y sin lácteos. La fruta madura y la pimienta del Cabernet acompañan las brasas y las especias. También proponemos pollo al horno con zaatar o, como alternativa vegetal, berenjena tatemada con tahini y granada. La etiqueta sugiere abrirlo y decantarlo una hora antes y servirlo a unos 18 °C (65 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Jerusalem Winery es una bodega de Jerusalén, Israel, con viñedos en los montes de Judea (Judean Vineyards), según la etiqueta. Su colección Jerusalem Hills reúne vinos jóvenes y accesibles; la misma contraetiqueta menciona Merlot, Cabernet-Shiraz, Gewürztraminer, Chardonnay, Sauvignon blanc, rosado, Riesling y Muscat dulce. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Jerusalem Winery · Jerusalén"], ["Línea", "Jerusalem Hills"],
    ["Añada", "2023"], ["Origen", "Montes de Judea (Judean Heights) · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Uva", "Cabernet Sauvignon"],
    ["Carácter según etiqueta", "Frambuesa madura, cereza negra, pimienta negra y especias aromáticas"],
    ["Servicio según etiqueta", "Abrir y decantar una hora antes; servir a 65 °F (unos 18 °C)"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/jerusalem-hills-cabernet-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, en un patio de la Ciudad Vieja con bugambilia", "Una copa con frambuesas, cerezas y pimienta sobre madera de olivo", "Maridaje sugerido: brochetas de res con arroz de granada y pita", "Una cena de viernes en una azotea de Jerusalén"],
};
