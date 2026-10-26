import type { EditorialWine } from "./editorial-wine";

// Notes published for the 2024 release (reproduced by retailers, e.g.
// https://www.htfw.com/the-macallan-2024-release-double-cask-highland-single-malt-scotch-18-year-old-whisky);
// 43% ABV across all sources. Confirm release year and ml against Isaac's bottle photo.
export const macallan18DoubleCask: EditorialWine = {
  slug: "macallan-18-double-cask",
  kind: "DESTILADO",
  name: "The Macallan 18 Años Double Cask",
  title: "The Macallan 18 Años Double Cask",
  producer: "THE MACALLAN · ESCOCIA",
  style: "Single malt escocés · 18 años · Barricas sazonadas con jerez",
  storyHeading: "Dieciocho años en dos robles.",
  description: "El hermano mayor del Double Cask 12: un single malt escocés de dieciocho años madurado en barricas de roble americano y de roble europeo, ambas sazonadas con vino de jerez. El roble americano aporta vainilla y dulzor; el europeo, fruta seca y especia. De color ámbar dorado, con más profundidad y un final más largo que su versión de doce años.",
  tasting: {
    nose: "Fruta seca y toffee, cáscara de cítricos confitada, jengibre cálido y un toque de nuez moscada. Notas publicadas para la edición 2024.",
    palate: "Pasas, uvas sultanas y chabacano seco, redondeados con toffee de melaza, vainilla y jengibre. Notas publicadas para la edición 2024.",
    finish: "Largo y aterciopelado, con roble cálido y cítricos brillantes. Notas publicadas para la edición 2024.",
  },
  serve: "Nuestra sugerencia: solo, a temperatura ambiente, en vaso de cata. Déjalo respirar un par de minutos antes del primer sorbo. Si quieres, unas gotas de agua; con un whisky de esta edad recomendamos no ponerle hielo para no apagar sus aromas.",
  pairing: "Es un whisky de sobremesa para disfrutar despacio. Proponemos chocolate amargo, dátiles o higos rellenos de nuez, cáscara de naranja cubierta de chocolate, y quesos curados como un manchego de más de doce meses o un parmesano añejo. Acompaña muy bien un puro suave después de cenar. Son sugerencias editoriales, no indicaciones de la destilería.",
  wineryStory: "The Macallan se fundó en 1824 en Easter Elchies, cerca de Craigellachie, en la región de Speyside, Escocia, dentro de las Highlands. La línea Double Cask reúne roble americano y europeo sazonados con jerez; el 18 años es su expresión de mayor edad. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Destilería", "The Macallan · fundada en 1824"], ["Origen", "Speyside · Escocia"],
    ["Estilo", "Highland Single Malt Scotch Whisky"], ["Edad", "18 años"],
    ["Barricas", "Roble americano y europeo sazonados con jerez"],
    ["Color", "Ámbar dorado"], ["Colección", "Double Cask Collection"],
    ["Alcohol", "43%"], ["Contenido", "700 ml"],
  ],
  photos: [],
  captions: [],
};
