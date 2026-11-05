import { dadahStory, type EditorialWine } from "./editorial-wine";

// Facts transcribed from the front label (public/catalogo/dadah-petit-verdot-reserve-front.webp): "Dādāh winery ·
// Petit Verdot Syrah Reserve · פטיט ורדו סירה רזרב · 2019 · This wine is a blend of 80% Petit Verdot and 20% Syrah.
// The wine has a deep purple violete color made with aromas of wild black berries and dark chocolate. On the palate
// the wine is full bodied with a taste rich and characteristic tannins. The wine has aged in French oak for 20 months.
// 750 ml. | 14% alc." No rear-label photo yet: region, kosher supervision, mevushal and serving temperature are NOT
// stated (not on the front label). Web cross-check (no vintage or extra data found):
// https://idrinkkosher.com/?p=68423 · https://www.delectable.com/categories/dadah-winery
// Winery story: dadahStory (Special Reserve packaging). Pairing and service scenes are editorial / AI-generated.
export const dadahPetitVerdotReserve: EditorialWine = {
  slug: "dadah-petit-verdot-reserve",
  name: "Dādāh Petit Verdot Syrah Reserve 2019",
  title: "Petit Verdot Syrah Reserve",
  year: 2019,
  producer: "DĀDĀH WINERY · ISRAEL",
  style: "80% Petit Verdot · 20% Syrah · Tinto seco",
  storyHeading: "Violeta profundo, veinte meses de roble.",
  wineryStory: dadahStory,
  description: "Una Reserve poco común: el Petit Verdot, uva que casi siempre se usa en pequeñas dosis para dar color y estructura, aquí lleva la voz principal con 80% del ensamblaje, acompañado de 20% de Syrah. La etiqueta lo describe de un color púrpura violáceo profundo, con aromas de moras silvestres y chocolate amargo. En boca es de cuerpo pleno, de sabor rico y con taninos característicos. Pasó veinte meses en roble francés antes de embotellarse en esta añada 2019.",
  pairing: "Nuestra sugerencia principal: pechuga de pato sellada, en rebanadas, con salsa de moras y puré de betabel, terminada con tomillo y aceite de oliva, sin lácteos. La fruta negra del plato acompaña las moras silvestres y el chocolate amargo que describe la etiqueta, y la grasa del pato equilibra sus taninos. También proponemos cordero braseado con ciruelas o, como alternativa vegetal, berenjena rostizada con granada. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  facts: [
    ["Bodega", "Dādāh Winery"], ["Vino", "Petit Verdot Syrah Reserve"],
    ["Añada", "2019"], ["País", "Israel"], ["Tipo", "Tinto seco"],
    ["Ensamblaje", "80% Petit Verdot · 20% Syrah, según etiqueta"],
    ["Crianza", "20 meses en roble francés, según etiqueta"],
    ["Color según etiqueta", "Púrpura violáceo profundo"],
    ["Aromas según etiqueta", "Moras silvestres y chocolate amargo"],
    ["Boca según etiqueta", "Cuerpo pleno, sabor rico y taninos característicos"],
    ["Alcohol", "14%"], ["Contenido", "750 ml"],
    ["Ubicación de la bodega", "Kerem Maharal, Israel"],
  ],
  photos: ["/catalogo/dadah-petit-verdot-reserve-front.webp", "", ...["service", "glass", "pairing", "table"].map(view => `/catalogo/dadah-petit-verdot-reserve-${view}.webp`)],
  captions: ["La botella, sobre blanco", "", "El servicio, en la cava", "Una copa frente al Carmelo", "Maridaje sugerido: pato con salsa de moras y betabel", "Una mesa bajo la higuera"],
};
