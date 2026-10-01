import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Collection } from "./_components/Collection";
import { getPublication } from "./_lib/catalog";
import { VerticalShowcase } from "./_components/VerticalShowcase";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { wines, date } = await getPublication();
  return <>
    <Header overHero />
    <main id="contenido">
      <Hero />
      <VerticalShowcase />
      <Collection wines={wines} date={date?.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }) ?? null} />
    </main>
  </>;
}
