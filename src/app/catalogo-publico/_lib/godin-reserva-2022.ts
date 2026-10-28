import type { EditorialWine } from "./editorial-wine";

// Facts transcribed from Isaac's ChatGPT render of both labels (original kept as godin-reserva-2022-chatgpt-original.jpeg)
// and his photo of the real bottle (black capsule with "DOURO" in gold, not the red one of the render — Gemini recoloured it).
// Real rear label (Isaac's photo, godin-reserva-2022-label-original.jpeg): "Godin · DOC Douro · Red Wine Reserva 2022 · Reccua
// Winery Godin Red Blend Douro valley portugal · …ancient winemaking traditions passed down through generations within the
// family… vineyards meticulously managed under regional traditions… · 35% Touriga Nacional, 35% Tinta Roriz, 30% Touriga
// Franca · aged for 12 months in 500-liter Portuguese oak barrels · Porto Reccua Vinhos S.A., Rua da Lousada, Godim 5050-262
// Peso da Régua · Imported for Kiddush.co.il · 750 ml · 13,5% · Dry red wine · Contains sulfites · OU-P · Kosher for Passover ·
// Non Mevushal · DOP Douro Garantia WVH 83391 · barcode 5601176003462". The back packshot is Gemini's flat re-set of that
// photo (text checked letter by letter) pasted on the black-capsule bottle; the ChatGPT render's rear label was different.
export const godinReserva2022: EditorialWine = {
  slug: "godin-reserva-2022",
  name: "Godin Reserva 2022",
  title: "Godin Reserva",
  year: 2022,
  producer: "RECCUA WINERY · DOURO, PORTUGAL",
  style: "35% Touriga Nacional · 35% Tinta Roriz · 30% Touriga Franca · Tinto · DOC Douro",
  storyHeading: "Un guerrero del Douro.",
  description: "Un tinto reserva del valle del Douro, en Portugal, una de las regiones vinícolas más antiguas del mundo. Godin mezcla tres uvas autóctonas portuguesas, Touriga Nacional, Tinta Roriz y Touriga Franca, y madura doce meses en barricas portuguesas de roble de quinientos litros, según la contraetiqueta, para un perfil equilibrado y elegante. La bodega, Reccua Winery, combina instalaciones de vanguardia con tradiciones vinícolas antiguas transmitidas por generaciones dentro de la familia, y cuida sus viñedos bajo las tradiciones de la región, al pie de la belleza natural del valle. El casco de guerrero en dorado sobre la etiqueta negra le da su nombre y su carácter.",
  pairing: "Nuestra sugerencia principal: un corte de res a las brasas, como un vacío o un asado de tira, con pimientos y cebollas asados y papas al romero, todo con aceite de oliva y sin lácteos. La fruta madura y los taninos del Douro acompañan la carne a la leña. También proponemos pollo al horno con aceitunas negras y hierbas o, como alternativa vegetal, hongos portobello a la parrilla con pimentón ahumado. Son sugerencias editoriales, no indicaciones impresas por la bodega.",
  wineryStory: "Reccua Winery, Porto Reccua Vinhos, está en Godim, en el corazón del valle del Douro, al norte de Portugal; la contraetiqueta la describe como un nombre reconocido de la industria vinícola portuguesa, con instalaciones de vanguardia y tradiciones vinícolas antiguas transmitidas por generaciones dentro de la familia, y viñedos manejados con meticulosidad bajo las tradiciones regionales. El vino lleva el sello DOP Douro Garantia del Instituto dos Vinhos do Douro e do Porto. Las escenas de la galería son ambientaciones creadas para el catálogo, no fotografías de la bodega.",
  facts: [
    ["Bodega", "Reccua Winery · Porto Reccua Vinhos, Godim, Peso da Régua"], ["Vino", "Godin Red Wine Reserva"],
    ["Añada", "2022"], ["Origen", "DOC Douro · Portugal"], ["Tipo", "Tinto reserva"],
    ["Ensamblaje", "35% Touriga Nacional · 35% Tinta Roriz · 30% Touriga Franca, según etiqueta"],
    ["Crianza", "12 meses en barricas portuguesas de roble de 500 litros, según etiqueta"],
    ["Alcohol", "13.5%"], ["Contenido", "750 ml"], ["Alérgenos", "Contiene sulfitos"],
    ["Mevushal", "No mevushal, según etiqueta"],
    ["Kosher", "Kosher para Pésaj (OU-P), según etiqueta; consulta los sellos originales"],
    ["Denominación", "DOP Douro Garantia · Instituto dos Vinhos do Douro e do Porto, según etiqueta"],
  ],
  photos: ["front", "back", "service", "glass", "pairing", "table"].map(view => `/catalogo/godin-reserva-2022-${view}.webp`),
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "El servicio, frente a las terrazas del Douro", "Una copa en la bodega de piedra", "Maridaje sugerido: corte de res a las brasas con pimientos asados", "Una mesa en una quinta del Douro"],
};
