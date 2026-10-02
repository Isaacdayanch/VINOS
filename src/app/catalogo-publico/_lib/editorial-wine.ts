import type { Metadata } from "next";

/** Label-based editorial content, independent of CRM identity, prices and stock. */
export type EditorialWine = {
  slug: string;
  name: string;
  title: string;
  year: number;
  producer: string;
  style: string;
  description: string;
  pairing: string;
  storyHeading: string;
  wineryStory?: string;
  facts: string[][];
  photos: string[];
  captions: string[];
  labelImage: string;
  originalFront?: string;
};

// Producer story supplied on Special Reserve packaging IMG_0409, not a grape-origin claim.
export const dadahStory = "Según el estuche de la Special Reserve, Dādāh Winery fue fundada en 2007, inspirada en una tradición familiar de elaboración de vino procedente de Marruecos. La bodega se sitúa en Makura Farm, cerca de Kerem Maharal, en las laderas occidentales del monte Carmelo. La ubicación de la bodega no identifica por sí sola el origen de las uvas de cada añada.";

export function editorialMetadata(wine: EditorialWine): Metadata {
  const domain = process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return {
    ...(domain ? { metadataBase: new URL(`https://${domain}`) } : {}),
    title: wine.name,
    description: wine.description,
    openGraph: { title: wine.name, description: wine.description, type: "website", images: [{ url: wine.photos[5], alt: wine.name }] },
  };
}
