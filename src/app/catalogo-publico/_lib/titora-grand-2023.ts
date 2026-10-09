import type { EditorialWine } from "./editorial-wine";

// Verified against the original front and rear labels of the 2023 bottle.
export const titoraGrand2023: EditorialWine = {
  slug: "titora-grand-2023",
  name: "Givat Titora Cabernet Sauvignon Grande Réserve 2023",
  title: "Givat Titora Grande Réserve",
  year: 2023,
  producer: "LA CITADELLE DE DIAMANT · GIVAT TITORA",
  style: "Cabernet Sauvignon predominante · Tinto seco",
  storyHeading: "Profundidad que se toma su tiempo.",
  description: "Un tinto seco de color rojo violáceo profundo, elaborado con dos variedades y predominio de Cabernet Sauvignon de Alta Galilea. Según su contraetiqueta, ofrece notas pronunciadas de frutos rojos maduros, pimienta de Jamaica y tostados. Sus 24 meses en barricas de roble francés de primer y segundo uso aportan notas de cacao y café, sobre una estructura aromática y tánica equilibrada.",
  pairing: "Proponemos costilla de res braseada con hongos, chalotas y romero, preparada con aceite de oliva y sin lácteos. La intensidad de la carne y sus notas tostadas acompañan el perfil de fruta madura, especias y cacao descrito en la etiqueta. También sugerimos cordero asado o, como alternativa vegetal, portobello con lentejas y hierbas. Son maridajes editoriales para esta ficha, no indicaciones de la bodega.",
  wineryStory: "La Citadelle de Diamant presenta Givat Titora Grande Réserve 2023 con sello de cera roja y etiqueta metálica. La contraetiqueta sitúa el Cabernet Sauvignon en Alta Galilea y explica que el vino fue seleccionado para una crianza prolongada por su estructura aromática y tánica. El ensamblaje reúne dos variedades; la segunda uva y sus proporciones no se especifican. Los datos de esta ficha se verificaron con la etiqueta de la añada 2023. Las escenas de la galería son ambientaciones creadas para el catálogo.",
  facts: [
    ["Productor", "La Citadelle de Diamant · Titora"], ["Nombre", "Givat Titora Grande Réserve"], ["Añada", "2023"],
    ["Tipo", "Tinto seco"], ["Origen", "Alta Galilea · Israel (Cabernet Sauvignon, según etiqueta)"],
    ["Ensamblaje", "Dos variedades, con predominio de Cabernet Sauvignon; segunda uva y porcentajes no indicados"],
    ["Crianza", "24 meses en roble francés de primer y segundo uso"],
    ["Color según etiqueta", "Rojo violáceo profundo"],
    ["Notas según etiqueta", "Frutos rojos maduros, pimienta de Jamaica, tostados, cacao y café"],
    ["Alcohol", "14.5%"], ["Contenido", "750 ml"], ["Servicio según etiqueta", "18–22 °C"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Kosher", "Kosher para Pésaj y lemehadrin, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back-verified", "pour", "glass", "pairing", "table"].map(view => `/catalogo/titora-grand-2023-${view}.webp`),
  captions: ["La botella · Grande Réserve 2023", "La contraetiqueta · añada 2023", "El ritual del servicio", "Una copa entre luz y piedra", "Maridaje sugerido: res braseada con hongos", "Una mesa al caer la tarde"],
  labelImage: "/catalogo/titora-grand-2023-back-verified.webp",
};
