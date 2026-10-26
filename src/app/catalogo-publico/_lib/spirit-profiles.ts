import type { EditorialWine } from "./editorial-wine";
import { macallan12DoubleCask } from "./macallan-12-double-cask";

// Spirits connect by CRM name instead of ID, so a ficha goes live as soon as
// Isaac publishes the product as DESTILADO. Exclude sibling bottlings.
const spirits: { match: (name: string) => boolean; profile: EditorialWine }[] = [
  { match: name => /macallan/i.test(name) && /\b12\b/.test(name) && !/sherry\s*oak|triple|fine\s*oak|harmony|colou?r/i.test(name), profile: macallan12DoubleCask },
];

export function spiritProfile(name: string, tipo: string | null | undefined) {
  return tipo === "DESTILADO" ? spirits.find(spirit => spirit.match(name))?.profile : undefined;
}

/** Card photo for a spirit without its own CRM photo. */
export function spiritPhoto(name: string, tipo: string | null | undefined) {
  return spiritProfile(name, tipo)?.photos[0] ?? null;
}
