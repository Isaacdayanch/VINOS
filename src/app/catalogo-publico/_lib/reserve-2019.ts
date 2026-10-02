import { dadahStory, type EditorialWine } from "./editorial-wine";

/** Sources: front IMG_0417 and back IMG_0419. Never derive facts from generated images. */
export const reserve2019: EditorialWine = {
  slug: "dadah-cabernet-reserve-2019",
  name: "Dādāh Cabernet Sauvignon Reserve 2019",
  title: "Cabernet Sauvignon Reserve",
  year: 2019,
  producer: "DĀDĀH WINERY · ISRAEL",
  style: "Cabernet Sauvignon · Tinto seco",
  storyHeading: "Veinte meses.",
  wineryStory: dadahStory,
  description: "Un Cabernet Sauvignon de viñedo único en los Altos del Golán, según la etiqueta frontal. De color rojo profundo y cuerpo pleno, presenta aromas de moras silvestres, especias terrosas, hojas de tabaco y vainilla. La contraetiqueta describe taninos marcados, equilibrio y un final largo. Su crianza es de veinte meses en roble francés.",
  pairing: "Como sugerencia de maridaje, prueba carne de res a la parrilla con verduras asadas y hierbas. Es una recomendación editorial para explorar este estilo de vino; no forma parte del texto de la etiqueta.",
  facts: [
    ["Productor", "Dādāh Winery"], ["Origen", "Israel"],
    ["Región", "Altos del Golán · Single Vineyard, según frente"],
    ["Añada", "2019"], ["Uva", "100% Cabernet Sauvignon"],
    ["Tipo", "Tinto seco"], ["Cuerpo", "Pleno, según frente"],
    ["Crianza", "20 meses en roble francés"], ["Alcohol", "14%"],
    ["Contenido", "750 ml"], ["Servicio", "16–21 °C (60–70 °F según etiqueta)"],
    ["Kosher", "LeMehadrin · Para Pésaj, según etiqueta"],
    ["Supervisión", "Rabinato de Hof HaCarmel y Badatz Beit Yosef, según etiqueta"],
    ["Mevushal", "No mevushal"], ["Alérgenos", "Contiene sulfitos"],
  ],
  photos: [
    "/catalogo/dadah-cabernet-reserve-2019.webp", "/catalogo/dadah-reserve-2019-back.webp",
    "/catalogo/dadah-reserve-2019-pour.webp", "/catalogo/dadah-reserve-2019-glass.webp",
    "/catalogo/dadah-reserve-2019-pairing.webp", "/catalogo/dadah-reserve-2019-table.webp",
  ],
  captions: [
    "Botella frontal en fondo blanco", "Reverso en fondo blanco",
    "Vino sirviéndose", "Copa con vino rojo profundo",
    "Sugerencia de maridaje: res a la parrilla con verduras", "Una mesa para compartir",
  ],
  labelImage: "/catalogo/dadah-reserve-2019-label-original.webp",
  originalFront: "/catalogo/dadah-reserve-2019-front-original.webp",
};
