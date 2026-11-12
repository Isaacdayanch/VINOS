import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (jerusalem-hills-muscat-2023-front-original.jpeg and
// -label-original.jpeg, 12-nov-2026). Front: "Judean Vineyards · Jerusalem Winery · Israel · Muscat d'Alexandrie ·
// מוסקט אלכסנדרוני · Jerusalem Hills" (orange band, clear glass, cream capsule). Rear: "Jerusalem Winery Israel · Muscat
// d'Alexandrie · Alc. 12.5% by vol · 750 ml · 2023 · Sweet white wine · Judean Heights · Product of Israel · Our Muscat
// matures gently in the warm days and cool nights of the Judean Mountains surrounding Jerusalem, close to maritim breeze
// coming straight from the Israeli coastal plain. This ideal climate allows the fruit to reach its full potential, offering
// fruity and floral flavors and a lemon finish. This pleasant sweet Muscat was fermented from selected vineyards and is best
// served with gingered meat balls, fajitas, blue cheese and chocolate cake… Serve chilled at 45°F · Kosher for Passover ·
// Mevushal · Contains sulfites". The label's own pairing mixes meat and cheese; the page keeps them apart (kosher rule).
// No back photo in the gallery (rule since 10-nov-2026).
export const jerusalemHillsMuscat2023: EditorialWine = {
  slug: "jerusalem-hills-muscat-2023",
  name: "Jerusalem Hills Muscat d'Alexandrie 2023",
  title: "Jerusalem Winery Muscat d'Alexandrie · Jerusalem Hills",
  year: 2023,
  producer: "JERUSALEM WINERY · MONTES DE JUDEA, ISRAEL",
  style: "Muscat d'Alexandrie · Blanco dulce · Mevushal · Colección Jerusalem Hills",
  storyHeading: "Dulce, floral y con un final de limón.",
  description: "El único blanco dulce de nuestra selección de Jerusalem Hills: un Muscat d'Alexandrie de los montes de Judea, de color amarillo dorado y botella transparente. La contraetiqueta lo cuenta así: la uva madura despacio con los días cálidos y las noches frescas de la montaña, cerca de la brisa que llega directo desde la costa de Israel, y da sabores frutales y florales con un final de limón. Es un vino dulce y agradable, de 12.5% de alcohol, mevushal, hecho con uvas de viñedos seleccionados. Se sirve muy frío.",
  pairing: "La propia bodega lo recomienda con pastel de chocolate, con albóndigas al jengibre o con quesos azules. Nuestra sugerencia principal es de postre: pastel de chocolate oscuro con frambuesas y almendras caramelizadas. También va muy bien como aperitivo de sobremesa con higos, orejones, nueces y miel, o, en otra ocasión, con quesos frescos y uvas. La etiqueta pide servirlo bien frío, a unos 7 °C (45 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Jerusalem Winery es una bodega de Jerusalén, Israel, con viñedos en los montes de Judea (Judean Vineyards), según la etiqueta. Su colección Jerusalem Hills reúne vinos jóvenes y accesibles; la misma contraetiqueta menciona Cabernet Sauvignon, Merlot, Cabernet-Shiraz, Chardonnay, Riesling, Sauvignon blanc, rosado y Gewürztraminer. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Jerusalem Winery · Jerusalén"], ["Línea", "Jerusalem Hills"],
    ["Añada", "2023"], ["Origen", "Montes de Judea (Judean Heights) · Israel"], ["Tipo", "Blanco dulce, según etiqueta"],
    ["Uva", "Muscat d'Alexandrie"],
    ["Carácter según etiqueta", "Frutal y floral, con final de limón"],
    ["Servicio según etiqueta", "Bien frío, a 45 °F (unos 7 °C)"],
    ["Alcohol", "12.5%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/jerusalem-hills-muscat-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, bien frío, en una terraza con bugambilia", "Una copa con naranja y uvas moscatel al sol", "Maridaje sugerido: pastel de chocolate con frambuesas y almendras", "Un brunch bajo el olivo con higos, miel y quesos frescos"],
};
