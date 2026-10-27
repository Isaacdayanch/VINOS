import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (1361 px packshot, Japanese market label): "Nikka Whisky From the Barrel · alc. 51.4° · ウイスキー ·
// 原材料 モルト、グレーン · 500 ml · 51.4% ALC./VOL. · 製造者 ニッカウヰスキー株式会社". No box. Nose/palate/finish
// are Nikka's official notes from https://www.nikka.com/en/brands/fromthebarrel/ ; blend, marriage, bottle
// design concept from the Japanese product page https://www.nikka.com/products/blended/fromthebarrel/index.html ;
// awards from https://www.nikka.com/en/story/awards/ ; general highball ratio from https://www.nikka.com/en/discover/enjoy/
export const nikkaFromTheBarrel: EditorialWine = {
  slug: "nikka-from-the-barrel",
  kind: "DESTILADO",
  name: "Nikka From the Barrel",
  title: "Nikka From the Barrel",
  producer: "NIKKA WHISKY · JAPÓN",
  style: "Whisky japonés · Mezcla de más de cien maltas y granos · 51.4%",
  storyHeading: "Un pequeño bloque de whisky concentrado.",
  description: "El blend más celebrado de Nikka, con más de cuarenta años desde su debut: más de cien whiskies de malta y de grano, sobre todo maltas de sus dos destilerías japonesas, Yoichi y Miyagikyo, junto con sus whiskies de grano Coffey. Después de mezclarlos, Nikka los devuelve a barricas unos meses para que se casen, técnica que llama marriage, y los embotella a 51.4% de alcohol, casi a fuerza de barrica, para compartir, dicen sus mezcladores, la alegría de esa intensidad natural. La botella cuadrada nació del concepto de un pequeño bloque de whisky, comprimido y concentrado.",
  tasting: {
    nose: "Dulzor de vainilla y chocolate, cáscara de naranja espléndida y aroma a grano. Notas de Nikka para From the Barrel.",
    palate: "Boca densa y dulce; astringencia de roble y un sabor firme, de cuerpo pleno. Notas de Nikka para From the Barrel.",
    finish: "Amaderado y amargo. Notas de Nikka para From the Barrel.",
  },
  serve: "Nuestra sugerencia: solo, en vaso corto, en sorbos pequeños por su graduación, o con un hielo grande, que lo abre sin apagarlo. También en highball, con la proporción estándar de Nikka de una parte de whisky por tres de agua mineral muy fría, ajustada al gusto, y en coctel: la casa propone un Boulevardier con From the Barrel, licor amargo y vermut dulce a partes iguales.",
  pairing: "Pide bocados intensos que aguanten su fuerza. Proponemos chocolate amargo con naranja, nueces garapiñadas, higos secos, un trozo de queso gouda añejo o manchego curado y, de salado, jamón serrano o almendras ahumadas. Son sugerencias editoriales, no indicaciones de la casa.",
  wineryStory: "Nikka la fundó Masataka Taketsuru, el padre del whisky japonés, en 1934 en Yoichi, Hokkaido, después de aprender el oficio en Escocia; en 1969 abrió su segunda destilería, Miyagikyo, en Sendai. From the Barrel reúne las dos casas en una sola botella y ha sido nombrado mejor blended japonés en los World Whiskies Awards siete veces, de 2007 a 2012 y en 2014, y ganó el trofeo del International Spirits Challenge 2015 además de varios oros. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Casa", "Nikka Whisky · fundada en 1934"], ["Origen", "Japón"],
    ["Estilo", "Whisky japonés blended (maltas y granos), según etiqueta"],
    ["Mezcla", "Más de cien whiskies de malta y de grano, según Nikka"],
    ["Técnica", "Marriage: la mezcla vuelve a barrica unos meses"],
    ["Edad", "Sin declaración de edad"],
    ["Botella", "Cuadrada: un pequeño bloque de whisky, según Nikka"],
    ["Alcohol", "51.4%"], ["Contenido", "500 ml, según etiqueta"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "glass", "pairing"].map(view => `/catalogo/nikka-from-the-barrel-${view}.webp`),
  captions: [
    "La botella cuadrada, sobre blanco",
    "Con un hielo grande, en vaso corto",
    "Maridaje sugerido: chocolate amargo con naranja, nueces garapiñadas, higos secos y gouda añejo",
  ],
};
