import type { EditorialWine } from "./editorial-wine";

// Upcoming vintage confirmed by the owner. The supplied label photos are from 2021.
export const titoraGrand2023: EditorialWine = {
  slug: "titora-grand-2023",
  name: "Givat Titora Cabernet Sauvignon Grande Réserve 2023",
  title: "Givat Titora Grande Réserve",
  year: 2023,
  producer: "LA CITADELLE DE DIAMANT · GIVAT TITORA",
  style: "Cabernet Sauvignon · Próxima llegada",
  storyHeading: "Una nueva añada por descubrir.",
  description: "Estamos preparando la llegada de Givat Titora Grande Réserve 2023. Las imágenes son una propuesta visual basada en la presentación de 2021, con la añada actualizada; el empaque definitivo está por confirmar. Publicaremos las notas de cata, el ensamblaje y la crianza cuando contemos con la etiqueta de 2023.",
  pairing: "Para esta presentación proponemos costilla de res braseada con hongos, chalotas y romero, preparada con aceite de oliva y sin lácteos. Como alternativa vegetal, portobello asado con lentejas y hierbas. Son ideas editoriales para acompañar un Cabernet Sauvignon; el maridaje definitivo se ajustará al perfil confirmado de la añada 2023.",
  wineryStory: "Givat Titora forma parte de la presentación La Citadelle de Diamant. Las fotos originales disponibles corresponden a la añada 2021 y se conservan únicamente como referencia del envase. Sus datos de alcohol, origen de las uvas, crianza y certificación no se atribuyen automáticamente a 2023. Las escenas creadas para la galería no son fotografías de la bodega.",
  facts: [
    ["Nombre", "Givat Titora Grande Réserve"], ["Añada", "2023"],
    ["Presentación", "Cabernet Sauvignon; composición por confirmar"],
    ["Disponibilidad", "Próxima llegada"], ["Ficha técnica 2023", "Pendiente de la etiqueta de esta añada"],
    ["Alcohol y contenido", "Por confirmar"], ["Crianza y origen de las uvas", "Por confirmar"],
    ["Certificación kosher", "Pendiente de comprobar en la etiqueta 2023"],
    ["Precio", "Se mostrará cuando la añada 2023 esté publicada en el catálogo"],
  ],
  photos: ["front", "back", "pour", "glass", "pairing", "table"].map(view => `/catalogo/titora-grand-2023-${view}.webp`),
  captions: ["Presentación 2023 · imagen provisional", "Contraetiqueta 2023 · pendiente de confirmar", "El ritual del servicio", "Una copa entre luz y piedra", "Maridaje sugerido: res braseada con hongos", "Una mesa al caer la tarde"],
  labelImage: "/catalogo/titora-grand-2021-label-original.jpeg",
  originalFront: "/catalogo/titora-grand-2021-front-original.jpeg",
};
