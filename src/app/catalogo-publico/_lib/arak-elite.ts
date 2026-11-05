import type { EditorialWine } from "./editorial-wine";

// Isaac's photo (front packshot): Hebrew "עלית הארק" (Elite Ha'arak), two green deer on a green/yellow oval,
// small blue deer with "מאז 1824" (since 1824), green band "ELITE HA'ARAK" + Arabic "عيليت العرق",
// "40% כהל" (alcohol) and "750 מ"ל" (ml); glass embossed "...SONS". Green screw cap. No kosher mark readable on the front.
// Producer and history: Tablet Magazine, "The Magic of Arak"
// https://www.tabletmag.com/sections/food/articles/magic-arak-anise-flavored-liquor (Gold family, 1824, vodka in
// Ukraine before, Tirat Carmel near Haifa, also makes Alouf); https://en.wikipedia.org/wiki/Arak_(drink) (grape spirit
// + aniseed, second distillation with anise, louche with water). Triple distillation from grape distillate with aniseed
// and 40%: retailer listings https://www.masterofmalt.com/spirit/joseph-gold-and-sons/elite-arak-spirit/ ,
// https://kosherwinedirect.com/blogs/kosher-wine-guides/joseph-gold-arak-elite-vs-alouf ,
// https://www.totalwine.com/spirits/liqueurscordialsschnapps/unique-flavors/elite-arak-liqueur/p/192705750 .
// No official tasting notes from the producer were found; tasting below summarizes retailer descriptions
// (https://www.buymyliquor.com/products/arak-elite-750-ml , kosherwinedirect) and is labelled as such.
export const arakElite: EditorialWine = {
  slug: "arak-elite",
  kind: "DESTILADO",
  name: "Arak Elite",
  title: "Arak Elite",
  producer: "JOSEPH GOLD & SONS · ISRAEL",
  style: "Arak de uva y anís · Triple destilación",
  storyHeading: "El anís de la sobremesa mediterránea.",
  description: "Elit Ha'arak, «la élite del arak», es el arak clásico de la casa Joseph Gold & Sons, que en su etiqueta presume su origen en 1824. Se elabora con destilado de uva y semilla de anís, y, según sus distribuidores, pasa por tres destilaciones. En la botella es cristalino; al encontrarse con agua fría se vuelve blanco lechoso, el gesto que en todo el Levante anuncia que la mesa ya está servida.",
  tasting: {
    nose: "Anís intenso y limpio, con un fondo herbal discreto. Resumen de las descripciones de tiendas especializadas; la casa no publica notas de cata.",
    palate: "Regaliz franco y un dulzor suave de anís, con toques de hierbas secas. Según tiendas especializadas, es más suave y dulce que el Alouf, su hermano de la misma casa.",
    finish: "Limpio y cálido, con un recuerdo de anís que se queda. Según tiendas especializadas.",
  },
  serve: "Como se toma en el Levante: en vaso alto, una parte de arak y unas dos de agua bien fría, y al final el hielo; se pone blanco lechoso al instante. Servir primero el agua y luego el hielo evita que el anís se cristalice. Es la sugerencia tradicional; también se puede tomar más corto, con menos agua.",
  pairing: "El arak pide mezze y mesa larga. Proponemos hummus con aceite de oliva, tabule de perejil, aceitunas, berenjena asada, un pescado entero a la parrilla con limón y, para refrescar, rebanadas de sandía. Son sugerencias editoriales, no indicaciones de la casa.",
  wineryStory: "La familia Gold, que antes destilaba vodka en Ucrania, fundó su casa en 1824; hoy produce en Tirat Carmel, junto a Haifa, y además del Elite elabora otros araks como el Alouf. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la destilería.",
  facts: [
    ["Casa", "Joseph Gold & Sons · desde 1824, según la etiqueta"], ["Origen", "Israel"],
    ["Estilo", "Arak"], ["Base", "Destilado de uva con semilla de anís"],
    ["Destilación", "Triple, según sus distribuidores"],
    ["Alcohol", "40%"], ["Contenido", "750 ml"],
  ],
  // glass/pairing: generated with the Gemini API from the front packshot; never read facts from them.
  photos: ["front", "glass", "pairing"].map(view => `/catalogo/arak-elite-${view}.webp`),
  captions: [
    "La botella, sobre blanco",
    "Con agua fría y hielo, en vaso alto: el arak se vuelve blanco lechoso",
    "Maridaje sugerido: mezze de hummus, tabule, aceitunas, berenjena, pescado a la parrilla y sandía",
  ],
};
