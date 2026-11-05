import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from the front label (public/catalogo/charley-lior-2021-front.webp): "Charley Winery · LIOR ·
// Spécial Reserve · Judean Hills · Cabernet Sauvignon · 2021", gold medallion with a portrait framed by laurels and a
// handwritten signature. No rear label available, so alcohol, kosher status and serving temperature are NOT stated.
// Hand harvest in the Judean Hills and 24 months in French oak barrels: retailer listing (single source, not the
// winery) https://www.kosherwine.com/charley-winery-lior-cw-0001.html ("made of Cabernet Sauvignon grapes hand
// harvested from the most exclusive vineyards of Judean Hills and aged in French Oak barrels for 24 months").
// Retailer directory listing (100% Cabernet Sauvignon, Israel): https://www.firstleaf.com/a/wine-directory/product/lior
// The winery's own site could not be found; no history of the winery is stated.
export const charleyLior2021: EditorialWine = {
  slug: "charley-lior-2021",
  name: "Charley Winery LIOR Spécial Reserve 2021",
  title: "Charley Winery LIOR Spécial Reserve",
  year: 2021,
  producer: "CHARLEY WINERY · MONTES DE JUDEA, ISRAEL",
  style: "Cabernet Sauvignon · Montes de Judea · Spécial Reserve · Tinto",
  storyHeading: "Un Cabernet de montaña, sin prisa.",
  description: "LIOR es la Spécial Reserve de Cabernet Sauvignon de Charley Winery, de la añada 2021 y de los Montes de Judea, según su etiqueta. La tienda especializada KosherWine.com indica que sus uvas se cosechan a mano en viñedos de la región y que el vino reposa veinticuatro meses en barricas de roble francés. Un tinto para abrirse con calma, en la mesa larga y la conversación de sobremesa.",
  pairing: "Nuestra sugerencia principal: costillas cortas de res braseadas lentamente en vino tinto, glaseadas y servidas sobre puré de camote con aceite de oliva y tomillo, sin lácteos. El braseado largo acompaña la estructura de un Cabernet con crianza en barrica. También proponemos pecho de res al horno con cebollas caramelizadas o, como alternativa vegetal, hongos portobello asados con hierbas. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "La etiqueta crema de LIOR lleva al centro un medallón dorado con un retrato enmarcado en laureles, el nombre CHARLEY WINERY en letras doradas y una firma manuscrita junto a la añada. La mención Judean Hills señala los Montes de Judea, la zona de colinas que rodea Jerusalén, como origen del vino. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Charley Winery"], ["Vino", "LIOR Spécial Reserve"],
    ["Añada", "2021"], ["Origen", "Montes de Judea (Judean Hills) · Israel, según etiqueta"], ["Tipo", "Tinto"],
    ["Uva", "Cabernet Sauvignon, según etiqueta"],
    ["Cosecha", "A mano, según KosherWine.com"],
    ["Crianza", "24 meses en barricas de roble francés, según KosherWine.com"],
  ],
  photos: ["/catalogo/charley-lior-2021-front.webp", "", "/catalogo/charley-lior-2021-service.webp", "/catalogo/charley-lior-2021-glass.webp", "/catalogo/charley-lior-2021-pairing.webp", "/catalogo/charley-lior-2021-table.webp"],
  captions: ["La botella, sobre blanco", "", "El servicio, en una cava de piedra", "Una copa en la biblioteca", "Maridaje sugerido: costillas de res braseadas con puré de camote", "Una cena en un patio de piedra de Jerusalén"],
};
