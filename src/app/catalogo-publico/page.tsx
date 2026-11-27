import { Suspense } from "react";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { VerticalShowcase } from "./_components/VerticalShowcase";
import { textoEnvioGratis } from "./_lib/envio-gratis";
import { getStorefront } from "./_lib/storefront";

export const dynamic = "force-dynamic";

export default async function PresentationPage() {
  const { regla } = await getStorefront();
  const envioGratis = textoEnvioGratis(regla);
  return <>
    <Header overHero hideBrand />
    <main id="contenido">
      <Hero perk={envioGratis ? `${envioGratis} · CDMX` : undefined} />
      <Suspense fallback={<p role="status">Cargando selección de vinos…</p>}><VerticalShowcase /></Suspense>
    </main>
  </>;
}
