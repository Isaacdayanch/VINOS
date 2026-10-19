import type { EditorialWine } from "./editorial-wine";

// Owner-supplied 2021 front/rear labels and tasting notes, October 2026.
// Aeration is an editorial serving suggestion, adjusted by tasting, not a winery requirement.
export const tanyaEliya2021: EditorialWine = {
  slug: "tanya-eliya-2021", name: "Tanya Reserve Eliya Cabernet Sauvignon 2021",
  title: "Eliya Reserve", year: 2021, producer: "TANYA WINERY · ISRAEL",
  style: "Cabernet Sauvignon · Tinto seco",
  storyHeading: "Profundidad que merece una pausa.",
  description: "Un Cabernet Sauvignon de cuerpo pleno y color borgoña muy profundo, casi negro en el centro de la copa, como lo describe nuestra degustación. Procede de un viñedo en ladera en las colinas de Judea, de clima fresco, y pasa 24 meses en barricas de roble francés. Su presencia intensa invita a servirlo con calma y dejar que se exprese poco a poco en una copa amplia.",
  wineryStory: "La contraetiqueta de Eliya destaca el carácter de su viñedo único en las colinas de Judea y la crianza de 24 meses en roble francés. Explica que el reposo adicional en botella favorece el desarrollo de su expresión, y que se elabora sin clarificar ni filtrar para preservar sus sabores y aromas naturales. La firma del enólogo Yoram Cohen acompaña esta reserva de Tanya.",
  pairing: "Sugerencia de maridaje: cachete de res braseado con una reducción de sus jugos, hongos y verduras de raíz asadas, preparado con aceite de oliva y sin lácteos. También acompaña costilla de res o un corte a la parrilla. Son propuestas para su cuerpo pleno y carácter intenso.\n\nPara darle espacio a abrirse, sugerimos descorcharlo unos 30–60 minutos antes, servir una pequeña copa y probar su evolución. Si sigue cerrado, una aireación suave en decantador permite mayor contacto con el aire; conviene probarlo de nuevo durante el proceso. Es una orientación de servicio que se ajusta a cada botella. Servir en copa amplia tipo Bordeaux y respetar los 18–22 °C indicados en la etiqueta.",
  facts: [
    ["Bodega", "Tanya Winery"], ["Línea", "Reserve · Eliya"], ["Añada", "2021"],
    ["País", "Israel"], ["Origen según contraetiqueta", "Colinas de Judea"],
    ["Viñedo", "Un único viñedo en ladera, según etiqueta"],
    ["Clima del viñedo", "Fresco, según contraetiqueta"],
    ["Uva", "Cabernet Sauvignon"], ["Tipo", "Tinto seco"],
    ["Cuerpo en nuestra degustación", "Pleno"],
    ["Color en nuestra degustación", "Borgoña muy profundo, casi negro en copa"],
    ["Crianza", "24 meses"], ["Barrica", "Roble francés"],
    ["Afinamiento", "Reposo adicional en botella, sin duración indicada"],
    ["Elaboración", "Sin clarificar ni filtrar"],
    ["Enólogo", "Yoram Cohen"], ["Alcohol", "15.5%"], ["Contenido", "750 ml"],
    ["Servicio según etiqueta", "18–22 °C"],
    ["Aireación sugerida", "Abrir 30–60 minutos antes y ajustar según la evolución en copa"],
    ["Copa sugerida", "Copa amplia de vino tinto, tipo Bordeaux"],
    ["Kosher", "Para Pésaj y lemehadrin, según etiqueta"], ["Mevushal", "Sí, según contraetiqueta"],
    ["Alérgenos", "Contiene sulfitos"],
  ],
  photos: ["/catalogo/tanya-eliya-2021-front-v2.webp", "/catalogo/tanya-eliya-2021-back-v2.webp",
    "/catalogo/tanya-eliya-2021-service-v2.webp", "/catalogo/tanya-eliya-2021-glass-v2.webp",
    "/catalogo/tanya-eliya-2021-pairing-v2.webp", "/catalogo/tanya-eliya-2021-table-v2.webp"],
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El tiempo de respirar", "Profundidad en copa", "Maridaje sugerido: res braseada", "Una cena de líneas contemporáneas"],
};
