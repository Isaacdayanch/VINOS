import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from the front label (public/catalogo/charley-romi-2021-front.webp): "Charley Winery · ROMI ·
// Spécial Reserve · Judean Hills · Cabernet and Petit Syrah · 2021", gold medallion with a portrait framed by laurels
// and a handwritten signature. No rear label available, so alcohol, oak ageing, kosher status and serving
// temperature are NOT stated (no source found for Romi's ageing).
// Retailer descriptions (not the winery): https://www.firstleaf.com/a/wine-directory/product/romi (Judean Hills,
// Cabernet Sauvignon and Petit Syrah, dry, full body, dark fruit and a hint of spice, moderate acidity);
// https://areleskosherwine.com/collections/israeli-dry-red-wine/products/charley-winery-romi-2021 (dark berries,
// plum, hints of spice, smooth tannins, refined lingering finish). The winery's own site could not be found.
export const charleyRomi2021: EditorialWine = {
  slug: "charley-romi-2021",
  name: "Charley Winery ROMI Spécial Reserve 2021",
  title: "Charley Winery ROMI Spécial Reserve",
  year: 2021,
  producer: "CHARLEY WINERY · MONTES DE JUDEA, ISRAEL",
  style: "Cabernet y Petite Sirah · Montes de Judea · Spécial Reserve · Tinto",
  storyHeading: "Dos uvas oscuras, una sola voz.",
  description: "ROMI es la Spécial Reserve de Charley Winery que une Cabernet y Petite Sirah —«Cabernet and Petit Syrah», dice su etiqueta— en la añada 2021, con uvas de los Montes de Judea. Las tiendas que lo venden lo describen como un tinto seco de cuerpo pleno, con fruta negra, ciruela y un toque de especia, taninos suaves y un final largo y refinado. Un tinto para la mesa de invierno y las noches largas.",
  pairing: "Nuestra sugerencia principal: una tabla de quesos curados de oveja con higos frescos, nueces, uvas negras y un poco de miel. La fruta negra y la especia del vino encuentran eco en el dulzor de los higos y la sal de los quesos. Como alternativa vegetal, berenjena asada con granada, tahini y hierbas frescas. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "ROMI comparte el diseño de la casa: etiqueta crema con un medallón dorado de retrato enmarcado en laureles, el nombre CHARLEY WINERY en letras doradas y una firma manuscrita junto a la añada. La mención Judean Hills señala los Montes de Judea, las colinas que rodean Jerusalén, como origen del vino. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Charley Winery"], ["Vino", "ROMI Spécial Reserve"],
    ["Añada", "2021"], ["Origen", "Montes de Judea (Judean Hills) · Israel, según etiqueta"], ["Tipo", "Tinto seco, según las tiendas que lo venden"],
    ["Uvas", "Cabernet y Petite Sirah («Cabernet and Petit Syrah»), según etiqueta"],
    ["Cuerpo", "Pleno, según las tiendas que lo venden"],
    ["Notas según tiendas", "Fruta negra, ciruela y especia; taninos suaves"],
  ],
  photos: ["/catalogo/charley-romi-2021-front.webp", "", "/catalogo/charley-romi-2021-service.webp", "/catalogo/charley-romi-2021-glass.webp", "/catalogo/charley-romi-2021-pairing.webp", "/catalogo/charley-romi-2021-table.webp"],
  captions: ["La botella, sobre blanco", "", "El servicio, en una cocina de campo", "Una copa en la ventana, una noche de lluvia", "Maridaje sugerido: quesos curados de oveja con higos y nueces", "Una cena de invierno frente a las colinas nevadas"],
};
