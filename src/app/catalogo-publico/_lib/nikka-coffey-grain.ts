import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (211 px product shot, upscaled 5x; soft): label reads "Nikka Coffey Grain Whisky", Nikka seal,
// Japanese カフェグレーン. No box in the photo. Aroma/taste are Nikka's official tasting notes (Japanese product
// page https://www.nikka.com/products/grain/coffeygrain/ — the notes are an image there — translated here);
// production facts from https://www.nikka.com/en/brands/coffey-grain-malt/ (corn, Coffey stills imported in
// 1963 and 1966, refilled/remade/re-charred American oak casks, released 2012, 45%).
export const nikkaCoffeyGrain: EditorialWine = {
  slug: "nikka-coffey-grain",
  kind: "DESTILADO",
  name: "Nikka Coffey Grain",
  title: "Nikka Coffey Grain",
  producer: "NIKKA WHISKY · JAPÓN",
  style: "Whisky japonés de grano · Alambique de columna Coffey · Roble americano",
  storyHeading: "El dulzor del grano, destilado en Coffey.",
  description: "El whisky de grano insignia de Nikka, lanzado en 2012. Se hace principalmente de maíz y se destila en alambiques Coffey, el primer alambique continuo patentado del mundo, inventado por Aeneas Coffey en 1830: Masataka Taketsuru, fundador de Nikka, aprendió a usarlo en Escocia en 1919 y trajo dos a Japón, en 1963 y 1966. Este alambique conserva el dulzor y el aroma del grano que otros eliminan. Madura en barricas de roble americano reutilizadas, rehechas y retostadas, que le dan, según la casa, sabores dulces y suaves.",
  tasting: {
    nose: "Vainilla amaderada y un tostado como de galleta; aromas dulces de crema pastelera, chocolate y azúcar quemada, con la fragancia ligera y expansiva propia del Coffey Grain. Notas de Nikka para Coffey Grain.",
    palate: "Textura limpia y ligera; vainilla con madera y un dulzor como de miel. Notas de Nikka para Coffey Grain.",
    finish: "Se desvanece limpio y fresco, con cuerpo ligero. Notas de Nikka para Coffey Grain.",
  },
  serve: "Nikka recomienda probar el primer trago solo, para sentir el dulzor del grano. Nuestra sugerencia: solo o con un hielo grande en vaso corto; también en highball con agua mineral muy fría. Y una idea de la propia casa: un Manhattan con Coffey Grain en lugar de whisky de centeno.",
  pairing: "Pide bocados dulces y tostados, de pastelería. Proponemos galletas de mantequilla, flan de vainilla, chocolate con leche, palomitas de caramelo, rebanadas de mango y nuez de la India tostada. Son sugerencias editoriales, no indicaciones de la casa.",
  wineryStory: "Nikka la fundó Masataka Taketsuru, el padre del whisky japonés, en 1934 en Yoichi, Hokkaido, después de aprender el oficio en Escocia. Sus whiskies de grano se destilan en los alambiques Coffey instalados en los años sesenta, hoy en la destilería de Miyagikyo, en Sendai. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Casa", "Nikka Whisky · fundada en 1934"], ["Origen", "Japón"],
    ["Estilo", "Whisky de grano japonés"], ["Grano", "Principalmente maíz, según Nikka"],
    ["Destilación", "Alambiques de columna Coffey, importados en 1963 y 1966"],
    ["Barricas", "Roble americano reutilizado, rehecho y retostado, según Nikka"],
    ["Edad", "Sin declaración de edad"], ["Lanzamiento", "2012"],
    ["Alcohol", "45%"], ["Contenido", "700 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "glass", "pairing"].map(view => `/catalogo/nikka-coffey-grain-${view}.webp`),
  captions: [
    "La botella, sobre blanco",
    "Solo, en vaso corto, como recomienda Nikka para el primer trago",
    "Maridaje sugerido: galletas de mantequilla, flan, chocolate con leche, palomitas de caramelo y mango",
  ],
};
