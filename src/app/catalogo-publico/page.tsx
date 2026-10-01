import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { VerticalShowcase } from "./_components/VerticalShowcase";

export default function PresentationPage() {
  return <>
    <Header overHero />
    <main id="contenido">
      <Hero />
      <VerticalShowcase />
    </main>
  </>;
}
