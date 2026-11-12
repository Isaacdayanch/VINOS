import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photos of the real bottle (jerusalem-hills-reserve-2023-front-original.jpeg and
// -label-original.jpeg, 12-nov-2026). Front (black label, gold and silver print): "2023 · 5703 · Judean Vineyards ·
// Jerusalem Hills · Reserve · Jerusalem Winery · Israel". Rear: "Judean Vineyards · Jerusalem Hills Reserve · Alc. 13% by
// Vol. · 750 ml · Dry red wine · Judean Heights · Product of Israel · Jerusalem Hills Reserve is a deep wine produced in the
// Judean hills by blending our best cabernet sauvignon 70%, merlot 20% and syrah 10%, then aged 12 months in french oak
// barrels. Rich red in colour, the nose is intense with aromas of ripe cassis, liquorice, and spicy notes, combined with
// fine smoky oak. It is best served with grilled meats and colourfull ethnic dishes. Best bet: open and decant an hour prior
// to drinking and serve at 65°F · Kosher for Passover · Mevushal · Contains sulfites". In the CRM this product is called
// "Jerusalem Hills Gold". No back photo in the gallery (rule since 10-nov-2026).
export const jerusalemHillsReserve2023: EditorialWine = {
  slug: "jerusalem-hills-reserve-2023",
  name: "Jerusalem Hills Reserve 2023",
  title: "Jerusalem Hills Reserve",
  year: 2023,
  producer: "JERUSALEM WINERY · MONTES DE JUDEA, ISRAEL",
  style: "70% Cabernet Sauvignon · 20% Merlot · 10% Syrah · 12 meses en roble francés · Mevushal",
  storyHeading: "La reserva de la casa: cassis, regaliz y roble ahumado.",
  description: "El Reserve es la cima de la colección Jerusalem Hills: un ensamble de los mejores Cabernet Sauvignon (70%), Merlot (20%) y Syrah (10%) de los montes de Judea, criado doce meses en barricas de roble francés. La contraetiqueta lo describe como un vino profundo, de color rojo intenso, con una nariz potente de cassis maduro, regaliz y notas especiadas, combinadas con un fino roble ahumado. Es un tinto seco de 13% de alcohol, mevushal, en una botella numerada con etiqueta negra y letras doradas: esta es la 5,703.",
  pairing: "La propia bodega lo recomienda con carnes a la parrilla y platos étnicos llenos de color. Nuestra sugerencia principal: rib eye de res a la parrilla con costra de pimienta, cebollas asadas y papas al horno con romero, todo sin lácteos. La estructura del Cabernet, el cuerpo del Merlot y la especia del Syrah piden un corte con carácter. También proponemos pierna de cordero al horno con ciruelas o, como alternativa vegetal, hongos portobello a la parrilla con reducción de granada. La etiqueta sugiere abrirlo y decantarlo una hora antes y servirlo a unos 18 °C (65 °F). Son sugerencias editoriales salvo donde se indica que vienen de la bodega.",
  wineryStory: "Jerusalem Winery es una bodega de Jerusalén, Israel, con viñedos en los montes de Judea (Judean Vineyards), según la etiqueta. Su colección Jerusalem Hills reúne vinos jóvenes y accesibles, y el Reserve es su selección de barrica. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Jerusalem Winery · Jerusalén"], ["Línea", "Jerusalem Hills · Reserve"],
    ["Añada", "2023"], ["Origen", "Montes de Judea (Judean Heights) · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Ensamblaje", "70% Cabernet Sauvignon · 20% Merlot · 10% Syrah, según etiqueta"],
    ["Crianza", "12 meses en barricas de roble francés, según etiqueta"],
    ["Carácter según etiqueta", "Cassis maduro, regaliz, notas especiadas y fino roble ahumado"],
    ["Edición", "Botella numerada: 5,703, según etiqueta"],
    ["Servicio según etiqueta", "Abrir y decantar una hora antes; servir a 65 °F (unos 18 °C)"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "Sí, mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "service", "glass", "pairing", "table"].map(view => `/catalogo/jerusalem-hills-reserve-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "El servicio, junto a la chimenea de una casa de piedra", "Una copa con grosellas negras y regaliz", "Maridaje sugerido: rib eye a la parrilla con cebollas asadas y papas al romero", "Una cena de celebración frente a la Ciudad Vieja"],
};
