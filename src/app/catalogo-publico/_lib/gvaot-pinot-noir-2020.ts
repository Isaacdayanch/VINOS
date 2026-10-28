import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's ChatGPT renders of the front and rear labels (originals kept as
// gvaot-pinot-noir-2020-*-chatgpt-original.jpeg). Front: "Gva'ot · Gofna · Reserve · Pinot Noir 2020 · 750 ml · Alc. 12%
// by vol. · Bottle No. 3347 out of 4,500". Rear: "Dry red wine · Shomron region · Varieties: 100% Pinot Noir · Vineyards:
// Givat Harel, 720 meters above sea level · Barrel aging: 12 months in French oak barrels from the Burgundy region ·
// Characteristics: fruity, elegant, and balanced · Dr. Shivi Drori, winemaker · Kosher for Passover · Not mevushal ·
// Contains sulfites". No photo of the real rear label yet: barcode (7290018414323 on the render) unverified.
export const gvaotPinotNoir2020: EditorialWine = {
  slug: "gvaot-pinot-noir-2020",
  name: "Gva'ot Gofna Reserve Pinot Noir 2020",
  title: "Gva'ot Gofna Reserve Pinot Noir",
  year: 2020,
  producer: "GVA'OT WINERY · SAMARIA, ISRAEL",
  style: "100% Pinot Noir · Tinto seco · Reserve · Edición numerada",
  storyHeading: "Un Pinot Noir de altura, con alma de Borgoña.",
  description: "Un Pinot Noir cien por ciento, de la línea Gofna Reserve de Gva'ot, con uvas del viñedo de Givat Harel, a 720 metros sobre el nivel del mar en las colinas de Samaria. Madura doce meses en barricas de roble francés de la región de Borgoña, la cuna de esta uva, según la contraetiqueta, y la bodega lo describe como frutal, elegante y equilibrado. Es un tinto seco ligero, de solo 12% de alcohol, y una edición numerada: esta botella es la 3,347 de 4,500. Su enólogo es el doctor Shivi Drori.",
  pairing: "Nuestra sugerencia principal: pechuga de pato rostizada con salsa de cerezas y betabel asado con hierbas, preparado con aceite de oliva y sin lácteos. La fruta roja y la ligereza del Pinot Noir piden carnes delicadas, no asados pesados. También proponemos salmón al horno con hierbas o pollo rostizado con uvas y, como alternativa vegetal, hongos salteados con tomillo. Sírvelo ligeramente fresco, a unos 16 °C. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Gva'ot Winery está en las colinas de Samaria (Shomron), en Israel, y cultiva viñedos de altura como el de Givat Harel, según la contraetiqueta. Su enólogo, el doctor Shivi Drori, firma esta línea Gofna Reserve. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Gva'ot Winery"], ["Vino", "Gofna Reserve Pinot Noir"],
    ["Añada", "2020"], ["Origen", "Región de Samaria (Shomron) · Israel"], ["Tipo", "Tinto seco, según etiqueta"],
    ["Uva", "100% Pinot Noir, según etiqueta"],
    ["Viñedo", "Givat Harel, a 720 metros sobre el nivel del mar, según etiqueta"],
    ["Crianza", "12 meses en barricas de roble francés de Borgoña, según etiqueta"],
    ["Carácter según etiqueta", "Frutal, elegante y equilibrado"],
    ["Edición", "Numerada: botella 3,347 de 4,500, según etiqueta"],
    ["Enólogo", "Dr. Shivi Drori"],
    ["Alcohol", "12%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/gvaot-pinot-noir-2020-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, con la niebla de la mañana en Samaria", "Una copa a contraluz, con cerezas", "Maridaje sugerido: pato rostizado con cerezas y betabel", "Un picnic en el viñedo al atardecer"],
};
