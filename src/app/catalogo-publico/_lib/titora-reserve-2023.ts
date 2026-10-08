import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from the supplied 2023 front and rear labels.
export const titoraReserve2023: EditorialWine = {
  slug: "titora-reserve-2023",
  name: "Givat Titora Cabernet Sauvignon Reserve 2023",
  title: "Givat Titora Cabernet Sauvignon Reserve",
  year: 2023,
  producer: "LA CITADELLE DE DIAMANT · GALILEA, ISRAEL",
  style: "95% Cabernet Sauvignon · 5% Petit Verdot · Tinto seco",
  storyHeading: "La fruta encuentra su tiempo.",
  description: "Un tinto seco de Galilea que reúne 95% Cabernet Sauvignon y 5% Petit Verdot. La contraetiqueta describe aromas sutiles de frutos del bosque y un cuerpo de medio a pleno. Doce meses de crianza en barricas de roble francés completan esta Reserve 2023 de La Citadelle de Diamant, pensada para acompañar una mesa con sabores intensos y una conversación sin prisa.",
  pairing: "Nuestra sugerencia principal: chuletas de cordero a la parrilla con romero, berenjena y zanahorias asadas, terminadas con aceite de oliva y un jugo de hierbas, sin lácteos. La intensidad del asado acompaña el cuerpo de medio a pleno que describe la etiqueta. También proponemos res a la parrilla o, como alternativa vegetal, portobello asado con lentejas. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "La etiqueta identifica a La Citadelle de Diamant como productor y señala viñedos de Galilea como origen de las uvas. Esta botella pertenece a la línea Cabernet Sauvignon Reserve y su añada es 2023. En el frente aparece una numeración de botella, 04808/10000, correspondiente al ejemplar fotografiado. Su cápsula negra y dorada, el escudo sobre el vidrio y la etiqueta marfil distinguen esta presentación. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Productor", "La Citadelle de Diamant"], ["Vino", "Givat Titora Cabernet Sauvignon Reserve"],
    ["Añada", "2023"], ["Origen", "Galilea · Israel"], ["Tipo", "Tinto seco"],
    ["Ensamblaje", "95% Cabernet Sauvignon · 5% Petit Verdot"],
    ["Crianza", "12 meses en barricas de roble francés"],
    ["Cuerpo", "De medio a pleno, según etiqueta"],
    ["Aromas según etiqueta", "Sutiles notas de frutos del bosque"],
    ["Alcohol", "14.5%"], ["Contenido", "750 ml"], ["Servicio según etiqueta", "18–20 °C"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Kosher", "Kosher para Pésaj y lemehadrin, según etiqueta; consulta los sellos originales"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/titora-reserve-2023-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El ritual del servicio", "Una copa a la luz de la ventana", "Maridaje sugerido: cordero con verduras asadas", "Una mesa íntima al anochecer"],
  labelImage: "/catalogo/titora-reserve-2023-label-original.jpeg",
  originalFront: "/catalogo/titora-reserve-2023-front-original.jpeg",
};