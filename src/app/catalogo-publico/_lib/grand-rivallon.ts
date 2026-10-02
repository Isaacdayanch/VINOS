import type { EditorialWine } from "./editorial-wine";

// Public product ID verified 2026-10-02. Facts: IMG_0424 front, IMG_0426 back.
export const grandRivallonId = "cmtugbmde0002ih049z900g5i";
export const grandRivallon: EditorialWine = {
  slug: "grand-rivallon-2012",
  name: "Château Grand Rivallon Saint-Émilion Grand Cru 2012",
  title: "Château Grand Rivallon",
  year: 2012,
  producer: "SAINT-ÉMILION GRAND CRU · FRANCE",
  style: "Merlot · Cabernet Sauvignon · Cabernet Franc",
  storyHeading: "El acento de Saint-Émilion.",
  description: "Un vino de Saint-Émilion Grand Cru, en Burdeos, elaborado con 85% Merlot, 10% Cabernet Sauvignon y 5% Cabernet Franc. Su contraetiqueta lo describe como redondo, de cuerpo pleno y taninos delicados. Embotellado en el château, esta añada 2012 invita a una mesa pausada y una conversación larga.",
  pairing: "La contraetiqueta propone acompañarlo con carnes o quesos, en ocasiones separadas. Nuestra sugerencia para una mesa de carne: cordero braseado con romero, chalotas y zanahorias asadas, preparado sin lácteos. Es una propuesta editorial inspirada en el cuerpo pleno y los taninos delicados que describe la bodega.",
  wineryStory: "La etiqueta identifica a SCE des Vignobles Pierre Rivière, propietario en Saint-Émilion, Gironde, Francia, y señala el embotellado en el château. La denominación de esta botella es Saint-Émilion Grand Cru. Las escenas de la galería son ambientaciones creadas para esta presentación, no fotografías de la propiedad.",
  facts: [
    ["Nombre", "Château Grand Rivallon"], ["Origen", "Francia · Burdeos"],
    ["Denominación", "Saint-Émilion Grand Cru"], ["Añada", "2012"],
    ["Ensamblaje", "85% Merlot · 10% Cabernet Sauvignon · 5% Cabernet Franc"],
    ["Cuerpo", "Pleno, según contraetiqueta"], ["Taninos", "Delicados, según contraetiqueta"],
    ["Alcohol", "13%"], ["Contenido", "750 ml"], ["Embotellado", "En el château"],
    ["Alérgenos", "Contiene sulfitos"],
    ["Certificación kosher", "Consulta los sellos de la etiqueta original"],
    ["Mevushal", "Por confirmar"],
  ],
  photos: ["front", "back", "pour", "glass", "pairing", "table"].map(view => `/catalogo/grand-rivallon-2012-${view}.webp`),
  captions: ["Botella frontal en fondo blanco", "Reverso en fondo blanco", "El servicio, en un salón francés", "La copa: una interpretación visual", "Maridaje sugerido: cordero con hierbas y verduras", "Una mesa para dos"],
  labelImage: "/catalogo/grand-rivallon-2012-label-original.jpeg",
  originalFront: "/catalogo/grand-rivallon-2012-front-original.jpeg",
};
