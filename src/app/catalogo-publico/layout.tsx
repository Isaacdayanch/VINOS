import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import styles from "./catalog.module.css";
import { AgeGate } from "./_components/AgeGate";
import { Announcement } from "./_components/Announcement";
import { CartDrawer } from "./_components/CartDrawer";
import { CartProvider } from "./_lib/cart";
import { getStorefront } from "./_lib/storefront";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], variable: "--catalog-serif" });
const sans = Manrope({ subsets: ["latin"], variable: "--catalog-sans" });

// Icon and apple-icon (the gold 18 seal) live next to this file; the CRM keeps the
// wine glass (src/app/icon.svg). The share picture (full logo, what WhatsApp shows)
// is a plain file with an absolute URL: Next would point a file-based
// opengraph-image at the internal Vercel branch URL on this preview deployment.
const SITIO = "https://lacava18.com";
export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  openGraph: { type: "website", siteName: "Cava 18", locale: "es_MX", images: [{ url: `${SITIO}/catalogo/og-cava18.png`, width: 1200, height: 630, alt: "Cava 18 · Vinos, whisky y destilados" }] },
  title: { default: "Cava 18 | Vinos, whisky y destilados", template: "%s | Cava 18" },
  description: "El vino que puede convertir al plato principal en un acompañamiento. Descubre nuestra selección de vinos.",
  // The public site is deployed from the catalog-redesign branch (a Vercel "preview"),
  // so that branch must be indexable; other previews stay hidden from Google.
  robots: process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF !== "catalog-redesign" ? { index: false, follow: false } : { index: true, follow: true },
};

export default async function CatalogLayout({ children }: { children: React.ReactNode }) {
  const { regla, abierto } = await getStorefront();
  return <div className={`${styles.shell} ${serif.variable} ${sans.variable}`}>
    <a className={styles.skip} href="#contenido">Ir al contenido</a>
    <CartProvider>
    <Announcement />
    {/* Positioned wrapper: the home header is absolute and must start below the notice, not the page top. */}
    <div className={styles.pageBody}>{children}</div>
    <CartDrawer regla={regla} abierto={abierto} />
    </CartProvider>
    <AgeGate />
    <footer className={styles.footer}>
      <Link href="/catalogo-publico" className={styles.footerBrand} aria-label="Cava 18, inicio">
        <Image src="/catalogo/logo-cava18-completo.png" alt="Cava 18 · Vinos, whisky y destilados" width={1619} height={418} sizes="(max-width: 700px) 80vw, 420px" />
      </Link>
      <nav className={styles.footerNav} aria-label="Enlaces del pie de página">
        <Link href="/catalogo-publico">Inicio</Link>
        <Link href="/catalogo-publico/catalogo">Vinos</Link>
        <Link href="/catalogo-publico/destilados">Destilados</Link>
        <Link href="/catalogo-publico/nosotros">Acerca de nosotros</Link>
      </nav>
      <p>Venta exclusiva a mayores de edad.</p>
    </footer>
  </div>;
}
