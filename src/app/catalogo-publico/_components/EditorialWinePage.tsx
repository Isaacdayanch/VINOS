import type { EditorialWine } from "../_lib/editorial-wine";
import { WineDetailPage } from "./WineDetailPage";

/** Keep label facts and lead with the ambient table photograph. */
export function EditorialWinePage({ wine, commerce }: { wine: EditorialWine; commerce?: { precioLista: number | null; activo: boolean } }) {
  const order = [5, 2, 3, 4, 0, 1];
  return <WineDetailPage wine={{
    name: wine.name, title: wine.title, eyebrow: `${wine.producer} · ${wine.year}`,
    style: wine.style, description: wine.description, facts: wine.facts, commerce,
    photos: order.filter(index => Boolean(wine.photos[index])).map(index => ({ url: wine.photos[index], caption: wine.captions[index], ambient: index >= 2 })),
    stories: [
      { title: "En la copa", text: wine.description },
      { title: "En la mesa", text: wine.pairing },
      ...(wine.wineryStory ? [{ title: "La bodega", text: wine.wineryStory }] : []),
    ],
  }} />;
}
