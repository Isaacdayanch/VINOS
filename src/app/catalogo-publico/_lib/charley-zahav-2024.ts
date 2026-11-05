import type { EditorialWine } from "./editorial-wine";

// Front label (public/catalogo/charley-zahav-2024-front.webp): "Charley Winery · Zahav · Judean Hills · French
// tradition · Israeli terroir · 2024 · Cabernet Sauvignon · Reserve"; red wax seal on the neck. No rear-label photo
// yet, and the front label shows no alcohol, volume, kosher seal or serving temperature, so none is stated here.
// Producer (charleywinery.com, read via search; the site does not open from this sandbox):
// https://charleywinery.com/products/zahav-cabernet-sauvignon — grapes hand-harvested from top Judean Hills plots,
// matured 12 months in French oak barrels (the page describes the line; its listed vintage is 2023, with a new
// vintage arriving January 2026). https://charleywinery.com/pages/about-us and https://charleywinery.com/ —
// Charley Zerdoun began making wine in Bordeaux; Avraham Zerdoun brought the family's expertise to Israel and sources
// fruit from the Judean Hills (limestone-rich soils, Mediterranean climate); time-honored French methods, small runs.
// Retailers list 14% alc. for the 2023 vintage only (https://www.kosherwine.co.uk/…/charley-winery-zahav-cabernet-
// sauvignon-p16346, https://areleskosherwine.com/products/charley-winery-zahav-cabernet-sauvignon-2023): not used.
// Pairing and scenes are editorial / AI-generated.
export const charleyZahav2024: EditorialWine = {
  slug: "charley-zahav-2024",
  name: "Charley Winery Zahav Cabernet Sauvignon Reserve 2024",
  title: "Zahav Cabernet Sauvignon",
  year: 2024,
  producer: "CHARLEY WINERY · COLINAS DE JUDEA, ISRAEL",
  style: "Cabernet Sauvignon · Reserve · Tinto seco",
  storyHeading: "Tradición francesa, terruño israelí.",
  description: "Zahav —“oro”, en hebreo— es el Cabernet Sauvignon Reserve de Charley Winery, y su etiqueta lo resume en una frase: tradición francesa, terruño israelí. Las uvas se cosechan a mano en parcelas selectas de las Colinas de Judea, alrededor de Jerusalén, y el vino madura doce meses en barricas de roble francés, según la bodega. Esta es la añada 2024, reconocible por su etiqueta vino con letras doradas y el sello de cera roja en el cuello: un tinto para llevar a la mesa y compartir sin prisa.",
  pairing: "Nuestra sugerencia principal: brisket de res braseado lentamente, en rebanadas, con zanahorias y cebollas glaseadas en su propio jugo, preparado sin lácteos. La cocción larga y la carne jugosa acompañan la estructura de un Cabernet Sauvignon con crianza en roble. También proponemos costillar de cordero con romero o, como alternativa vegetal, hongos portobello a la parrilla con aceite de oliva. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Charley Winery nace de una historia familiar que empieza en Burdeos: ahí comenzó a hacer vino Charley Zerdoun, y Avraham Zerdoun trajo después ese oficio a Israel, según la bodega. Hoy trabaja con uvas de las Colinas de Judea, de suelos ricos en caliza y clima mediterráneo, cosechadas a mano y criadas con métodos tradicionales franceses en producciones pequeñas. De ahí la frase de la etiqueta: tradición francesa, terruño israelí. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Charley Winery"], ["Vino", "Zahav Cabernet Sauvignon"],
    ["Línea", "Reserve, según etiqueta"], ["Añada", "2024"],
    ["Origen", "Colinas de Judea (Judean Hills) · Israel"], ["Tipo", "Tinto seco"],
    ["Uva", "Cabernet Sauvignon"],
    ["Vendimia", "A mano, en parcelas selectas de las Colinas de Judea, según la bodega"],
    ["Crianza", "12 meses en barricas de roble francés, según la bodega"],
    ["Lema de la etiqueta", "French tradition · Israeli terroir"],
    ["Presentación", "Sello de cera roja en el cuello"],
  ],
  photos: ["/catalogo/charley-zahav-2024-front.webp", "", ...["service", "glass", "pairing", "table"].map(view => `/catalogo/charley-zahav-2024-${view}.webp`)],
  captions: ["La botella, sobre blanco", "", "El servicio, frente a las colinas de Judea", "Una copa sobre piedra caliza", "Maridaje sugerido: brisket de res con zanahorias", "Una mesa entre olivos al atardecer"],
};
