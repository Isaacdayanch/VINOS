import type { EditorialWine } from "./editorial-wine";

// Owner-supplied original 2024 front/rear labels. The faint bubbles are his tasting note.
// Alcohol, residual sugar and harvest dates are omitted: unreadable/not stated in these photos.
export const tanyaLateHarvest2024: EditorialWine = {
  slug: "tanya-late-harvest-2024", name: "Tanya Late Harvest 2024",
  title: "Tanya", year: 2024, producer: "TANYA WINERY · ISRAEL",
  style: "Late Harvest · Vino de postre", storyHeading: "El tiempo se vuelve dorado.",
  description: "Un vino de postre de cosecha tardía, de hermoso color dorado. Chenin Blanc y Gewürztraminer se encuentran en un ensamble de 92% y 8%, de viñedos a 850 metros de altitud, según su contraetiqueta. Las burbujas muy tenues que percibimos en la degustación aportan un detalle delicado a una copa para disfrutar despacio, al terminar la comida.",
  wineryStory: "Late Harvest significa cosecha tardía: las uvas permanecen más tiempo en la vid y se recolectan con mayor madurez, buscando concentrar sus azúcares y su expresión aromática. Tanya presenta esta añada como vino de postre, firmado por el enólogo Yoram Cohen. Una invitación a prolongar la sobremesa con una copa fresca, pequeños bocados de fruta y la luz dorada del vino.",
  pairing: "Sugerencia de maridaje: una tartaleta de almendra y chabacano o pera asada, preparada sin lácteos. También puede acompañar fruta madura y almendras, o disfrutarse solo al terminar la comida. Busca postres de dulzor moderado para dar espacio al vino. Servir fresco, alrededor de 8–10 °C, es una propuesta de servicio editorial.",
  facts: [
    ["Bodega", "Tanya Winery"], ["País", "Israel"], ["Añada", "2024"],
    ["Estilo", "Late Harvest · Cosecha tardía"], ["Tipo según etiqueta", "Vino de postre"],
    ["Ensamble según contraetiqueta", "92% Chenin Blanc · 8% Gewürztraminer"],
    ["Altitud según contraetiqueta", "850 metros sobre el nivel del mar"],
    ["Enólogo", "Yoram Cohen"], ["Color observado", "Dorado"],
    ["Nota de Isaac", "Burbujas muy tenues en la degustación"],
    ["Servicio sugerido", "8–10 °C · Recomendación editorial"],
    ["Copa sugerida", "Copa de vino blanco o de postre, tipo tulipán"],
    ["Momento sugerido", "Postre o sobremesa"],
    ["Kosher", "Para Pésaj, según etiqueta"],
    ["Sellos", "Consultar la contraetiqueta original ampliable"],
  ],
  photos: ["/catalogo/tanya-late-harvest-2024-front-v2.webp", "/catalogo/tanya-late-harvest-2024-back-v2.webp",
    "/catalogo/tanya-late-harvest-2024-service-v3.webp", "/catalogo/tanya-late-harvest-2024-glass-v3.webp",
    "/catalogo/tanya-late-harvest-2024-pairing-v3.webp", "/catalogo/tanya-late-harvest-2024-table-v3.webp"],
  captions: ["La botella, sobre blanco", "La contraetiqueta, sobre blanco", "Burbujas sutiles en copa", "El dorado en copa", "Maridaje sugerido: fruta y almendra", "Una sobremesa dorada"],
  labelImage: "/catalogo/tanya-late-harvest-2024-label-original.jpeg",
  originalFront: "/catalogo/tanya-late-harvest-2024-front-label-original.jpeg",
};
