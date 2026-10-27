import type { EditorialWine } from "./editorial-wine";
import { macallan12DoubleCask } from "./macallan-12-double-cask";
import { macallan15DoubleCask } from "./macallan-15-double-cask";
import { macallan18DoubleCask } from "./macallan-18-double-cask";
import { macallan25SherryOak } from "./macallan-25-sherry-oak";

// Spirits connect by CRM name instead of ID, so a ficha goes live as soon as
// Isaac publishes the product as DESTILADO. Exclude sibling bottlings.
const spirits: { match: (name: string) => boolean; profile: EditorialWine }[] = [
  { match: name => /macallan/i.test(name) && /\b12\b/.test(name) && !/sherry\s*oak|triple|fine\s*oak|harmony|colou?r/i.test(name), profile: macallan12DoubleCask },
  { match: name => /macallan/i.test(name) && /\b15\b/.test(name) && !/sherry\s*oak|triple|fine\s*oak|colou?r/i.test(name), profile: macallan15DoubleCask },
  { match: name => /macallan/i.test(name) && /\b18\b/.test(name) && !/sherry\s*oak|triple|fine\s*oak|colou?r/i.test(name), profile: macallan18DoubleCask },
  { match: name => /macallan/i.test(name) && /\b25\b/.test(name) && !/double\s*cask|triple|fine\s*oak|colou?r/i.test(name), profile: macallan25SherryOak },
];

export function spiritProfile(name: string, tipo: string | null | undefined) {
  return tipo === "DESTILADO" ? spirits.find(spirit => spirit.match(name))?.profile : undefined;
}

/** Card photo for a spirit without its own CRM photo. */
export function spiritPhoto(name: string, tipo: string | null | undefined) {
  return spiritProfile(name, tipo)?.photos[0] ?? null;
}
