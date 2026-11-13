import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (noah-merlot-2023-front-original.jpeg and -label-original.jpeg,
// 13-nov-2026). Front: "Jerusalem Valley · Noah Estate · Product of Israel · מרלו · Merlot". Rear: "Noah Winery · Merlot ·
// 2023 · Alc. 13% by vol · 750 ml · Dry red wine · Judean Hills · Product of Israel · Noah merlot hails from the foothills
// of the Judean Mountains, south and east from Jerusalem near Beth Shemesh. Tempting flavours of blackberry, raspberry,
// chocolate and silky smooth notes. Open and decant at least a half hour prior to drinking. Best served at 18°C (65°F) with
// roast lamb, meatballs morrocan style or orange duck · Produced by Noah Winery, Geulim, Israel · Kosher for Passover ·
// Mevushal · Contains sulfites · 100% Vegan". CRM product was "Noah 1" (N-694). No back photo in the gallery.
export const noahMerlot2023: EditorialWine = {
  slug: "noah-merlot-2023",
  name: "Noah Estate Merlot 2023",
  title: "Noah Estate Merlot",
  year: 2023,
  producer: "NOAH WINERY · COLINAS DE JUDEA, ISRAEL",
  style: "Merlot · Tinto seco · Mevushal · Vegano · Jerusalem Valley",
  storyHeading: "Zarzamora, frambuesa y chocolate, de las faldas de los montes de Judea.",
  description: "Un Merlot de Noah Winery, de las faldas de los montes de Judea al sur y al este de Jerusalén, cerca de Beit Shemesh, según la contraetiqueta. La bodega lo describe con sabores tentadores de zarzamora, frambuesa y chocolate, y notas sedosas y suaves. Es un tinto seco de 13% de alcohol, mevushal y cien por ciento vegano, con una etiqueta de papel texturizado y un grabado azul de hojas y volutas que lo hace inconfundible en la mesa.",
  pairing: "La propia bodega lo recomienda con cordero rostizado, albóndigas estilo marroquí o pato a la naranja. Nuestra sugerencia principal: albóndigas de res estilo marroquí en salsa de jitomate con especias y garbanzos, con cuscús de pasas y almendras, todo sin lácteos. La fruta roja y la suavidad del Merlot acompañan muy bien las especias cálidas. También proponemos pierna de cordero al horno o, como alternativa vegetal, berenjena asada con granada. La etiqueta sugiere abrirlo y decantarlo al menos media hora antes y servirlo a 18 °C (65 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Noah Winery está en Geulim, Israel, y hace sus vinos con uvas del valle de Jerusalén, en las faldas de los montes de Judea cerca de Beit Shemesh, según la etiqueta. La línea Noah Estate reúne vinos jóvenes, mevushal y veganos. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Noah Winery · Geulim"], ["Línea", "Noah Estate · Jerusalem Valley"],
    ["Añada", "2023"], ["Origen", "Colinas de Judea (Judean Hills), cerca de Beit Shemesh · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Uva", "Merlot"],
    ["Carácter según etiqueta", "Zarzamora, frambuesa y chocolate; notas sedosas y suaves"],
    ["Servicio según etiqueta", "Decantar al menos media hora antes; servir a 18 °C (65 °F)"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Vegano", "100% vegano, según sello de la etiqueta"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/noah-merlot-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, en una bodega de piedra de las colinas de Judea", "Una copa con zarzamoras, frambuesas y chocolate", "Maridaje sugerido: albóndigas estilo marroquí con cuscús", "Una comida de domingo con vista a las colinas"],
};
