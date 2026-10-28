import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's photo of the real rear label (dalton-levantina-2021-label-original.jpeg):
// "Levantina 2021 Israeli dry red wine · 55% Petite Sirah / 20% Grenache / 20% Carignan / 5% Petit Verdot ·
// Galilee region · Aged 12 months in oak · Asufa is our winemaker Guy Eshel's personal playground at Dalton
// Winery… Levantina is a Middle Eastern, warm weather, spicy wine… This wine pairs perfectly with fatty and umami
// flavors · Front label illustration: Hagar Bareket · Non-mevushal · Kosher for Passover · OU-P · Beit Yoseph ·
// Vegan friendly · 750 ml · 13.5% alc · Contains sulfites · Produced and bottled by Dalton Winery Ltd, Merom
// Hagalil, Israel". Front and back packshots are Isaac's ChatGPT renders (originals kept as
// *-chatgpt-original.jpeg); the back text was checked letter by letter against the real label.
export const daltonLevantina2021: EditorialWine = {
  slug: "dalton-levantina-2021",
  name: "Dalton Asufa Levantina 2021",
  title: "Dalton Asufa Levantina",
  year: 2021,
  producer: "DALTON WINERY · GALILEA, ISRAEL",
  style: "55% Petite Sirah · 20% Grenache · 20% Carignan · 5% Petit Verdot · Tinto seco",
  storyHeading: "Un viaje especiado por las viñas de Israel.",
  description: "Levantina es un tinto seco de la serie Asufa, el terreno de juego personal del enólogo de Dalton, Guy Eshel: una colección de momentos y recuerdos de sus años en el campo. La contraetiqueta lo describe como un vino de Medio Oriente, de clima cálido y especiado, un viaje por las regiones vinícolas de Israel con tres variedades, Petite Sirah, Grenache y Carignan, más un toque de Petit Verdot. Doce meses de crianza en roble. La etiqueta, con sus colinas de colores, es una ilustración de Hagar Bareket.",
  pairing: "La propia bodega dice que marida perfecto con sabores grasos y umami. Nuestra sugerencia principal: brochetas de kofta de cordero a la parrilla con berenjena asada, tahini y granada, pimientos asados y pan pita, todo sin lácteos. La especia y la fruta del vino acompañan la grasa del cordero y el humo de la parrilla. También proponemos pollo rostizado con za'atar o, como alternativa vegetal, hongos portobello a la parrilla con hummus. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Dalton Winery se fundó en 1995 por la familia Haruni en la Alta Galilea, en el norte de Israel, y embotella en Merom Hagalil, según la contraetiqueta. Asufa, que en hebreo significa colección, es la serie donde su enólogo Guy Eshel experimenta con variedades mediterráneas; Levantina reúne uvas de distintas regiones vinícolas de Israel. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Dalton Winery · fundada en 1995"], ["Serie", "Asufa, del enólogo Guy Eshel"],
    ["Vino", "Levantina"], ["Añada", "2021"], ["Origen", "Galilea · Israel"],
    ["Tipo", "Tinto seco, según etiqueta"],
    ["Ensamblaje", "55% Petite Sirah · 20% Grenache · 20% Carignan · 5% Petit Verdot, según etiqueta"],
    ["Crianza", "12 meses en roble, según etiqueta"],
    ["Carácter según etiqueta", "Cálido, especiado, de Medio Oriente"],
    ["Alcohol", "13.5%"], ["Contenido", "750 ml"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj y lemehadrin (OU-P y Beit Yoseph), según etiqueta; consulta los sellos originales"],
    ["Vegano", "Apto para veganos, según sello de la etiqueta"],
    ["Ilustración de la etiqueta", "Hagar Bareket, según contraetiqueta"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/dalton-levantina-2021-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, en una azotea frente al mar", "Una copa sobre mosaico levantino", "Maridaje sugerido: kofta de cordero con berenjena, tahini y granada", "Una mesa de mezze bajo la parra"],
};
