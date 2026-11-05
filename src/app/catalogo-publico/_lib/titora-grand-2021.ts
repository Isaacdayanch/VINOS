import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from the original 2021 rear label (public/catalogo/titora-grand-2021-label-original.jpeg)
// and front label (public/catalogo/titora-grand-2021-front-original.jpeg: silver label, red wax capsule).
// Nothing copied from the 2023 vintage file. No producer page reachable from here; retail listing checked:
// https://bestbuyliquors.com/titora-la-citadelle-de-diamant
export const titoraGrand2021: EditorialWine = {
  slug: "titora-grand-2021",
  name: "Givat Titora Cabernet Sauvignon Grande Réserve 2021",
  title: "Givat Titora Grande Réserve",
  year: 2021,
  producer: "LA CITADELLE DE DIAMANT · GIVAT TITORA",
  style: "Cabernet Sauvignon predominante · Tinto seco",
  storyHeading: "Elegida para quedarse más tiempo en barrica.",
  description: "Un tinto seco de color rojo violáceo profundo, elaborado con dos variedades y predominio de Cabernet Sauvignon de Alta Galilea. Según su contraetiqueta, muestra notas pronunciadas de frutos rojos maduros, pimienta de Jamaica y tostados. Tras 24 meses en barricas de roble francés de primer y segundo uso, suma aromas terciarios de cacao y café, con una estructura aromática y tánica que anuncia un final equilibrado.",
  pairing: "Nuestra sugerencia principal: costilla de res braseada lentamente al vino tinto, sobre puré de camote con aceite de oliva y zanahorias glaseadas, sin lácteos. La cocción larga y las notas tostadas del plato acompañan el cacao, el café y la estructura tánica que describe la etiqueta. También proponemos pierna de cordero al horno o, como alternativa vegetal, hongos silvestres asados con lentejas. Son sugerencias editoriales, no indicaciones de la bodega.",
  wineryStory: "La Citadelle de Diamant presenta Givat Titora Grande Réserve 2021 con cápsula de cera roja y etiqueta plateada con el escudo de la casa. Según la contraetiqueta, este vino fue seleccionado para una crianza prolongada en barrica por sus propiedades organolépticas al final de la vinificación, y constituye la Grande Réserve de la añada 2021. El ensamblaje reúne dos variedades; la segunda uva y sus proporciones no se especifican. Las escenas de la galería son ambientaciones creadas para el catálogo.",
  facts: [
    ["Productor", "Titora · La Citadelle de Diamant"], ["Nombre", "Givat Titora Grande Réserve"], ["Añada", "2021"],
    ["Tipo", "Tinto seco"], ["Origen", "Alta Galilea · Israel (Cabernet Sauvignon, según etiqueta)"],
    ["Ensamblaje", "Dos variedades, con predominio de Cabernet Sauvignon; segunda uva y porcentajes no indicados"],
    ["Crianza", "24 meses en roble francés de primer y segundo uso"],
    ["Color según etiqueta", "Rojo violáceo profundo"],
    ["Notas según etiqueta", "Frutos rojos maduros, pimienta de Jamaica, tostados, cacao y café"],
    ["Alcohol", "14.3%"], ["Contenido", "750 ml"], ["Servicio según etiqueta", "18–22 °C"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Kosher", "Kosher para Pésaj y lemehadrin, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/titora-grand-2021-${view}.webp`),
  captions: ["La botella · Grande Réserve 2021", "La contraetiqueta · añada 2021", "El ritual del servicio", "Una copa junto a la chimenea", "Maridaje sugerido: costilla de res braseada", "Una cena a la luz del candil"],
};
