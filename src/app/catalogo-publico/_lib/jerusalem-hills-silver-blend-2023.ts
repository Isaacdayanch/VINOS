import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (jerusalem-hills-silver-blend-2023-front-original.jpeg and
// -label-original.jpeg, 11-nov-2026). Front (black label, silver print): "Judean Vineyards · Jerusalem Winery · Israel ·
// Silver Blend · Jerusalem Hills". Rear: "Jerusalem Winery Israel · Alc. 13% by Vol. · 750 ml · 2023 · Cabernet Sauvignon 50%
// Merlot 50% · Dry red wine · Judean Heights · Product of Israel · Jerusalem Hills Silver Blend is a pleasant wine produced
// in the Judean hills by blending our cabernet sauvignon 50% and merlot 50%. The result is refreshingly full-bodied, with
// gorgeous berry and plum flavours combined with fine smoky oak. This wine is a great match for red meats, stews and
// burgers… Best bet: open or decant half hour prior to drinking and serve at 65°F · Kosher for Passover · Mevushal ·
// Contains sulfites". No back photo in the gallery (rule since 10-nov-2026).
export const jerusalemHillsSilverBlend2023: EditorialWine = {
  slug: "jerusalem-hills-silver-blend-2023",
  name: "Jerusalem Hills Silver Blend 2023",
  title: "Jerusalem Winery Silver Blend · Jerusalem Hills",
  year: 2023,
  producer: "JERUSALEM WINERY · MONTES DE JUDEA, ISRAEL",
  style: "50% Cabernet Sauvignon · 50% Merlot · Tinto seco · Mevushal · Colección Jerusalem Hills",
  storyHeading: "Mora, ciruela y un toque de roble ahumado.",
  description: "El Silver Blend es el ensamble de la colección Jerusalem Hills: mitad Cabernet Sauvignon y mitad Merlot de los montes de Judea. La contraetiqueta lo describe como un vino agradable, refrescante y de cuerpo pleno, con sabores de frutos del bosque y ciruela combinados con un fino roble ahumado. Es un tinto seco de 13% de alcohol, mevushal, y se distingue por su etiqueta negra con letras plateadas, la más elegante de la colección.",
  pairing: "La propia bodega lo recomienda con carnes rojas, guisos y hamburguesas. Nuestra sugerencia principal: hamburguesa de res a la parrilla en pan brioche con cebolla caramelizada y arúgula, y papas rústicas al horno con romero, todo sin lácteos. El cuerpo del ensamble y su roble ahumado acompañan la carne a la brasa. También proponemos un guiso de res con ciruelas o, como alternativa vegetal, lentejas estofadas con hongos. La etiqueta sugiere abrirlo o decantarlo media hora antes y servirlo a unos 18 °C (65 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Jerusalem Winery es una bodega de Jerusalén, Israel, con viñedos en los montes de Judea (Judean Vineyards), según la etiqueta. Su colección Jerusalem Hills reúne vinos jóvenes y accesibles; la misma contraetiqueta menciona Merlot, Cabernet-Shiraz, Gewürztraminer, Chardonnay, Sauvignon blanc, rosado, Riesling y Muscat dulce. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Jerusalem Winery · Jerusalén"], ["Línea", "Jerusalem Hills · Silver Blend"],
    ["Añada", "2023"], ["Origen", "Montes de Judea (Judean Heights) · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Ensamblaje", "50% Cabernet Sauvignon · 50% Merlot, según etiqueta"],
    ["Carácter según etiqueta", "Cuerpo pleno; frutos del bosque y ciruela con fino roble ahumado"],
    ["Servicio según etiqueta", "Abrir o decantar media hora antes; servir a 65 °F (unos 18 °C)"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/jerusalem-hills-silver-blend-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, en un bar de vinos de Jerusalén", "Una copa con ciruelas y tomillo bajo la lámpara", "Maridaje sugerido: hamburguesa de res a la parrilla con papas al romero", "Una terraza en Jerusalén al anochecer"],
};
