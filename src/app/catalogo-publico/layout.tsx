import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import styles from "./catalog.module.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], variable: "--catalog-serif" });
const sans = Manrope({ subsets: ["latin"], variable: "--catalog-sans" });

// Icon (the gold 18 seal), apple-icon and opengraph-image (full logo, the picture
// WhatsApp shows when the link is shared) live next to this file; the CRM keeps its own.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL_CATALOGO_PUBLICO || "https://lacava18.com"),
  openGraph: { type: "website", siteName: "Cava 18", locale: "es_MX" },
  title: { default: "Cava 18 | Vinos, whisky y destilados", template: "%s | Cava 18" },
  description: "El vino que puede convertir al plato principal en un acompañamiento. Descubre nuestra selección de vinos.",
  // The public site is deployed from the catalog-redesign branch (a Vercel "preview"),
  // so that branch must be indexable; other previews stay hidden from Google.
  robots: process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF !== "catalog-redesign" ? { index: false, follow: false } : { index: true, follow: true },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${styles.shell} ${serif.variable} ${sans.variable}`}>
    <a className={styles.skip} href="#contenido">Ir al contenido</a>
    {children}
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
