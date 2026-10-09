import { grandRivallon, grandRivallonId } from "./grand-rivallon";
import { reserve2017 } from "./reserve-2017";
import { reserve2019 } from "./reserve-2019";
import { titoraReserve2023 } from "./titora-reserve-2023";
import type { EditorialWine } from "./editorial-wine";

// Published IDs, descriptive fields only. Prices and availability remain live.
const profiles: Record<string, EditorialWine> = {
  [grandRivallonId]: grandRivallon,
  cmu3qg06j0000ic04z60he8vj: reserve2017,
  cmtssyq4b0004l4044dcpucfr: reserve2019,
  cmu4gy9h10000jp04frrjexo4: titoraReserve2023,
};
export function wineProfile(id: string, year: number | null) {
  const profile = profiles[id];
  return profile && (year === null || year === profile.year) ? profile : undefined;
}

// Tanya front label + supplied tasting notes. Exact-vintage technical source:
// https://www.kosherwine.com/tanya-cabernet-eliya-tan-0002.html
// The winery's current Eliya Cabernet page also corroborates French-oak aging.
export function additionalWineFacts(id: string, year: number | null): string[][] {
  if (id === "cmtssyq4u0006l404sytto49b" && year === 2021) return [
    ["Bodega", "Tanya"], ["Línea", "Eliyah Reserve"], ["País", "Israel"],
    ["Tipo", "Tinto seco"], ["Contenido", "750 ml"], ["Crianza", "24 meses"],
    ["Barrica", "Roble francés"], ["Elaboración", "Sin clarificar ni filtrar"],
  ];
  // Supplied-label facts already recorded in this wine's public CRM description.
  if (id === "cmtssyq350000l404mdg2nzou" && year === 2023) return [
    ["Bodega", "Dādāh Winery"], ["País", "Israel"], ["Tipo", "Tinto seco"],
    ["Contenido", "750 ml"], ["Crianza", "18 meses en roble francés"],
    ["Mevushal", "No mevushal"], ["Kosher", "Para Pésaj, según etiqueta"],
  ];
  return [];
}
