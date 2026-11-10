import { Suspense } from "react";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { VerticalShowcase } from "./_components/VerticalShowcase";
import { StickyBuy } from "./_components/StickyBuy";
import { prisma } from "@/lib/prisma";

// The free-shipping promise comes from the active delivery zones (CRM → Tienda en línea),
// so the home page never announces a rule the store does not apply.
async function freeShippingLine() {
  const zones = await prisma.zonaEntrega.findMany({ where: { activa: true, botellasEnvioGratis: { not: null } }, select: { botellasEnvioGratis: true } }).catch(() => []);
  const min = Math.min(...zones.map(z => z.botellasEnvioGratis ?? Infinity));
  return Number.isFinite(min) ? `Envío gratis desde ${min} ${min === 1 ? "botella" : "botellas"}` : null;
}

export const dynamic = "force-dynamic";

export default async function PresentationPage() {
  const freeShipping = await freeShippingLine();
  return <>
    <Header overHero hideBrand />
    <main id="contenido">
      <Hero freeShipping={freeShipping} />
      <Suspense fallback={<p role="status">Cargando selección de vinos…</p>}><VerticalShowcase /></Suspense>
    </main>
    <StickyBuy freeShipping={freeShipping} />
  </>;
}
