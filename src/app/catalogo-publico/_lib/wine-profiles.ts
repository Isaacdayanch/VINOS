import { grandRivallon, grandRivallonId } from "./grand-rivallon";
import { reserve2017 } from "./reserve-2017";
import { reserve2018 } from "./reserve-2018";
import { reserve2019 } from "./reserve-2019";
import { titoraReserve2023 } from "./titora-reserve-2023";
import type { EditorialWine } from "./editorial-wine";
import { dadahCabernet2023 } from "./dadah-cabernet-2023";
import { tanyaLateHarvest2024 } from "./tanya-late-harvest-2024";
import { tanyaEliya2021 } from "./tanya-eliya-2021";
import { spiritProfile } from "./spirit-profiles";
import { tanyaTchelet2021 } from "./tanya-tchelet-2021";
import { macallan12DoubleCask } from "./macallan-12-double-cask";
import { macallan15DoubleCask } from "./macallan-15-double-cask";
import { macallan18DoubleCask } from "./macallan-18-double-cask";
import { macallan25SherryOak } from "./macallan-25-sherry-oak";
import { macallan30DoubleCask } from "./macallan-30-double-cask";
import { glenmorangieLasanta12 } from "./glenmorangie-lasanta-12";
import { glenmorangieElementa14 } from "./glenmorangie-elementa-14";
import { glenmorangieCadboll15 } from "./glenmorangie-cadboll-15";
import { hibikiHarmony } from "./hibiki-harmony";
import { nikkaCoffeyGrain } from "./nikka-coffey-grain";
import { nikkaCoffeyMalt } from "./nikka-coffey-malt";
import { nikkaFromTheBarrel } from "./nikka-from-the-barrel";
import { daltonMatatia2018 } from "./dalton-matatia-2018";
import { daltonLevantina2021 } from "./dalton-levantina-2021";
import { daltonFcCabernet2023 } from "./dalton-fc-cabernet-2023";
import { godinReserva2022 } from "./godin-reserva-2022";
import { binnunReserve2019 } from "./binnun-reserve-2019";
import { gvaotPinotNoir2020 } from "./gvaot-pinot-noir-2020";
import { daltonElkoshShiraz2019 } from "./dalton-elkosh-shiraz-2019";
import { daltonFcShiraz2021 } from "./dalton-fc-shiraz-2021";

// Published IDs, descriptive fields only. Prices and availability remain live.
const profiles: Record<string, EditorialWine> = {
  c6ae15c92857c780dc7be2157: daltonMatatia2018,
  c6ae16b6db4b3aa725552c266: daltonLevantina2021,
  c6ae24b67536c229b1869f979: daltonFcCabernet2023,
  c6ae28521772ffaa1b1badf67: godinReserva2022,
  c6ae285200c2ab56f6efc15ee: binnunReserve2019,
  c6ae3717ef4ac14d4dc38c396: gvaotPinotNoir2020,
  c6ae375ade5f4e53e85358b08: daltonElkoshShiraz2019,
  c6ae3b04524ebacd19bb68733: daltonFcShiraz2021,
  // Spirits (CRM IDs; spirit-profiles.ts also matches them by name as a fallback).
  c6adedb93be91f6dedc8a9b51: macallan12DoubleCask,
  c6ae00d97efe58da5d95dfe23: macallan15DoubleCask,
  c6adf8abf229f4f0769251295: macallan18DoubleCask,
  c6ae03474c27b323df6534c5e: macallan25SherryOak,
  c6ae03733c08d4ce2a2058de0: macallan30DoubleCask,
  c6ae03dca959de545c981a22e: glenmorangieLasanta12,
  c6ae0400cc4f20597a36ca8d4: glenmorangieElementa14,
  c6ae0427ac79a332af5a2e8f8: glenmorangieCadboll15,
  c6ae0a90453a0e669f653e0b8: hibikiHarmony,
  c6ae0b57e3bda5da40d60052d: nikkaCoffeyGrain,
  c6ae0b8be6a3bf99ec07f4a87: nikkaCoffeyMalt,
  c6ae0bc7cbd8722b0c63e5d01: nikkaFromTheBarrel,
  cmtssyq530007l404ab37xcal: tanyaTchelet2021,
  cmtssyq4u0006l404sytto49b: tanyaEliya2021,
  cmtssyq3t0002l404jdevszsb: reserve2018,
  cmtssyq5c0008l404fkede9in: tanyaLateHarvest2024,
  cmtssyq350000l404mdg2nzou: dadahCabernet2023,
  [grandRivallonId]: grandRivallon,
  cmu3qg06j0000ic04z60he8vj: reserve2017,
  cmtssyq4b0004l4044dcpucfr: reserve2019,
  cmu4gy9h10000jp04frrjexo4: titoraReserve2023,
};
export function wineProfile(id: string, year: number | null, name = "", tipo?: string | null) {
  const profile = profiles[id] ?? spiritProfile(name, tipo);
  return profile && (year === null || profile.year === undefined || year === profile.year) ? profile : undefined;
}

// Tanya front label + supplied tasting notes. Exact-vintage technical source:
// https://www.kosherwine.com/tanya-cabernet-eliya-tan-0002.html
// The winery's current Eliya Cabernet page also corroborates French-oak aging.
export function additionalWineFacts(id: string, year: number | null): string[][] {
  // Front and Hebrew rear labels supplied as IMG_0422 and IMG_0423.
  if (id === "cmtssyq3k0001l404n0341dmg" && year === 2023) return [
    ["Bodega", "Dadah Winery"], ["País", "Israel"],
    ["Tipo", "Tinto seco"], ["Contenido", "750 ml"],
    ["Ensamble", "50% Malbec · 50% Barbera"],
    ["Viñedos", "Laderas occidentales del Carmelo, cerca de Meir Shfeya"],
    ["Crianza", "18 meses"], ["Barrica", "Roble francés"],
    ["Elaboración", "Sin clarificar ni filtrar, según contraetiqueta"],
    ["Servicio según etiqueta", "17–19 °C"],
    ["Color", "Profundo con matices púrpura"],
    ["Textura", "Aterciopelada, según contraetiqueta"],
    ["Taninos", "Firmes, según contraetiqueta"],
    ["Mevushal", "No mevushal, según sello de la etiqueta"],
    ["Kosher", "Para Pésaj, según etiqueta"],
    ["Alérgenos", "Contiene sulfitos"],
  ];
  // Original 2018 labels supplied as IMG_0490, IMG_0491 and IMG_0492.
  // They do not specify an aging duration or grape percentages.
  if (id === "cmtssyq4l0005l4047nx3t1lc" && year === 2018) return [
    ["Bodega", "Tanya Winery"], ["Línea", "Enosh · Vino insignia de la bodega"],
    ["Tipo", "Tinto seco"], ["Contenido", "750 ml"],
    ["Viñedos", "Propios de la bodega, según contraetiqueta"],
    ["Altitud de los viñedos", "860 metros sobre el nivel del mar"],
    ["Crianza", "En barricas de roble francés"],
    ["Elaboración", "Sin clarificar ni filtrar"],
    ["Enólogo", "Yoram Cohen"], ["Servicio según etiqueta", "18–22 °C"],
    ["Color", "Oscuro y profundo, según etiqueta"],
    ["Taninos", "Definidos, según contraetiqueta"],
    ["Kosher", "Para Pésaj y lemehadrin, según etiqueta"],
    ["Alérgenos", "Contiene sulfitos"],
  ];
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
