import type { EditorialWine } from "../_lib/editorial-wine";
import { WineDetailPage, type Commerce } from "./WineDetailPage";

/** Keep label facts and lead with the ambient table photograph. */
export function EditorialWinePage({ wine, commerce }: { wine: EditorialWine; commerce?: Commerce }) {
  const spirit = wine.kind === "DESTILADO";
  // Spirits take any number of photos; packshots are named front/box/back. Like the wines, the
  // gallery opens on the most striking scene (the last ambient one, the pairing), then the
  // other scenes, then the bottle. photos[0] stays the front packshot for the collection card.
  // Packshots are named front/box/back; everything else is an ambient scene. Photos are found by
  // name, so a wine with no back photo (Isaac dropped them on 10-nov-2026) keeps the same order.
  const view = (index: number) => /-(front|box|back|service|glass|pairing|table)\.webp$/.exec(wine.photos[index])?.[1];
  const ambient = (index: number) => !["front", "box", "back"].includes(view(index) ?? "");
  const indexes = wine.photos.map((_, index) => index);
  const scenes = indexes.filter(ambient);
  const named = (name: string) => indexes.filter(index => view(index) === name);
  // Wines: table, service, glass, pairing (any other scene after), then front, back, box.
  const order = spirit
    ? [...scenes.slice(-1), ...scenes.slice(0, -1), ...indexes.filter(index => !ambient(index))]
    : [...["table", "service", "glass", "pairing"].flatMap(named), ...scenes.filter(index => !["table", "service", "glass", "pairing"].includes(view(index) ?? "")), ...["front", "back", "box"].flatMap(named)];
  const stories = spirit ? [
    ...(wine.tasting ? [{ title: "Nariz", text: wine.tasting.nose }, { title: "Boca", text: wine.tasting.palate }, { title: "Final", text: wine.tasting.finish }] : []),
    ...(wine.serve ? [{ title: "Cómo servirlo", text: wine.serve }] : []),
    { title: "Para acompañar", text: wine.pairing },
    ...(wine.wineryStory ? [{ title: "La destilería", text: wine.wineryStory }] : []),
  ] : [
    { title: "En la copa", text: wine.description },
    { title: "En la mesa", text: wine.pairing },
    ...(wine.wineryStory ? [{ title: "La bodega", text: wine.wineryStory }] : []),
  ];
  return <WineDetailPage spirit={spirit} wine={{
    name: wine.name, title: wine.title, eyebrow: wine.year ? `${wine.producer} · ${wine.year}` : wine.producer,
    style: wine.style, description: wine.description, facts: wine.facts, commerce,
    photos: order.filter(index => Boolean(wine.photos[index])).map(index => ({ url: wine.photos[index], caption: wine.captions[index], ambient: ambient(index) })),
    stories,
  }} />;
}
