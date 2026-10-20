import { dadahStory, type EditorialWine } from "./editorial-wine";

// Exact 2018 original front and rear labels supplied by the owner, October 2026.
export const reserve2018: EditorialWine = {
  slug: "reserve-2018", name: "Dādāh Special Reserve 2018",
  title: "Special Reserve", year: 2018, producer: "DĀDĀH WINERY · ISRAEL",
  style: "Cabernet Sauvignon · Tinto seco", storyHeading: "Treinta meses de profundidad.",
  wineryStory: dadahStory,
  description: "Treinta meses en barricas de roble francés dan forma a este Cabernet Sauvignon de cuerpo pleno y color rojo profundo. La etiqueta describe moras silvestres, especias terrosas, hojas de tabaco y vainilla: una expresión compleja, con taninos profundos y un final notablemente largo. Una botella para servir con calma y convertir una cena especial en una ocasión memorable.",
  pairing: "Sugerencia de maridaje: rib eye a la parrilla con hongos salteados, papas al romero y aceite de oliva. La intensidad de la carne y su costra dorada acompañan el cuerpo pleno y los taninos del vino; los hongos conectan con sus notas terrosas. También puede acompañar costilla de res braseada. Preparar sin lácteos y servir en una copa amplia de vino tinto, tipo Bordeaux.",
  facts: [
    ["Bodega", "Dādāh Winery"], ["Línea", "Special Reserve"],
    ["País", "Israel"], ["Añada", "2018"], ["Tipo", "Tinto seco"],
    ["Uva", "100% Cabernet Sauvignon"], ["Cuerpo según etiqueta frontal", "Pleno"],
    ["Crianza", "30 meses"], ["Barrica", "Roble francés"],
    ["Color según contraetiqueta", "Rojo profundo"],
    ["Aromas según etiqueta", "Moras silvestres, especias terrosas, hojas de tabaco y vainilla"],
    ["Taninos", "Profundos y definidos"], ["Final", "Largo"],
    ["Alcohol", "14%"], ["Contenido", "750 ml"],
    ["Servicio según etiqueta", "60–65 °F · Aproximadamente 16–18 °C"],
    ["Copa sugerida", "Copa amplia de vino tinto, tipo Bordeaux"],
    ["Numeración en la botella fotografiada", "0351/1200"],
    ["Mevushal", "No mevushal"],
    ["Kosher", "LeMehadrin · Para Pésaj y todo el año, según etiqueta"],
    ["Supervisión según etiqueta", "Rabinato de Hof HaCarmel y Badatz Beit Yosef"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Ubicación de la bodega", "Kerem Maharal, Israel"],
  ],
  photos: ["/catalogo/reserve-2018-front-v1.webp", "/catalogo/reserve-2018-back-v1.webp",
    "/catalogo/reserve-2018-service-v1.webp", "/catalogo/reserve-2018-glass-v1.webp",
    "/catalogo/reserve-2018-pairing-v1.webp", "/catalogo/reserve-2018-table-v1.webp"],
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "Una cata entre luz y madera", "Profundidad en copa", "Maridaje sugerido: rib eye con hongos", "Una cena entre las colinas"],
};
