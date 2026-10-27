import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (Mexican release): label reads "Hibiki · Suntory Whisky · Japanese Harmony · A meticulous blend of
// the finest selection of whiskies · 43% ALC/VOL (86 PROOF) · 750 mL · Whisky japonés"; the box adds "Est 1923 ·
// Suntory Whisky · The founding house of Japanese whisky" and the importer (Beam Suntory México). Colour/nose/
// palate/finish are Suntory's official notes for Japanese Harmony as published on
// https://www.suntory.co.jp/factory/yamazaki/menu/en/list/hibiki.html (reproduced by retailers).
export const hibikiHarmony: EditorialWine = {
  slug: "hibiki-harmony",
  kind: "DESTILADO",
  name: "Hibiki Japanese Harmony",
  title: "Hibiki Japanese Harmony",
  producer: "SUNTORY · JAPÓN",
  style: "Whisky japonés · Mezcla de maltas y grano · Roble Mizunara",
  storyHeading: "La armonía japonesa, en una botella de 24 caras.",
  description: "El whisky insignia de la casa Suntory, fundada en 1923 y considerada la fundadora del whisky japonés. Japanese Harmony es, según su etiqueta, una mezcla meticulosa de la más fina selección de whiskies: maltas y whiskies de grano de las destilerías de Suntory, armonizados por su maestro mezclador y con un toque de roble japonés Mizunara. La botella de veinticuatro facetas representa las veinticuatro estaciones del antiguo calendario lunar japonés, y la etiqueta es papel washi hecho a mano. De color ámbar, delicado y floral.",
  tasting: {
    nose: "Rosa, lichi, un toque de romero, madera madura y sándalo. Notas de Suntory para Japanese Harmony.",
    palate: "Dulzor de miel, cáscara de naranja confitada y chocolate blanco. Notas de Suntory para Japanese Harmony.",
    finish: "Sutil, tierno y largo, con un toque de roble Mizunara, el roble japonés. Notas de Suntory para Japanese Harmony.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso corto de cristal, para apreciar lo floral y la delicadeza del Mizunara. También es espléndido al estilo japonés, en highball: un vaso alto lleno de hielo, una parte de whisky por tres de agua mineral muy fría, revuelto apenas una vez, con un twist de cáscara de naranja.",
  pairing: "Pide bocados delicados y limpios. Proponemos chocolate blanco, lichis frescos, cáscara de naranja confitada, mochi de té verde y nueces de macadamia tostadas; con salado, sashimi de salmón o edamame con sal de mar. Son sugerencias editoriales, no indicaciones de la casa.",
  wineryStory: "Suntory se fundó en 1923 en Japón, cuando Shinjiro Torii construyó la destilería de Yamazaki, la primera de whisky de malta del país. Hibiki, que significa resonancia o eco, nació en 1989 para celebrar el 90 aniversario de la casa y es su mezcla más alta: reúne maltas de Yamazaki y Hakushu con whisky de grano de Chita. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Casa", "Suntory · fundada en 1923"], ["Origen", "Japón"],
    ["Estilo", "Whisky japonés, mezcla de maltas y grano (blended)"],
    ["Edad", "Sin declaración de edad"],
    ["Barricas", "Variedad de barricas, con roble japonés Mizunara, según Suntory"],
    ["Color", "Ámbar, según Suntory"], ["Botella", "24 facetas, por las 24 estaciones del calendario lunar japonés"],
    ["Alcohol", "43%"], ["Contenido", "750 ml, según etiqueta"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "box", "glass", "pairing"].map(view => `/catalogo/hibiki-harmony-${view}.webp`),
  captions: [
    "La botella de 24 facetas, sobre blanco", "El estuche de Japanese Harmony",
    "Solo, sin hielo, en vaso corto de cristal",
    "Maridaje sugerido: chocolate blanco, lichis, naranja confitada, mochi de té verde y macadamias",
  ],
};
