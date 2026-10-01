import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import styles from "./catalog.module.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], variable: "--catalog-serif" });
const sans = Manrope({ subsets: ["latin"], variable: "--catalog-sans" });

export const metadata: Metadata = {
  title: { default: "Vinos | Una selección con carácter", template: "%s | Vinos" },
  description: "El vino que convierte al plato principal en acompañamiento. Descubre nuestra selección de vinos.",
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${styles.shell} ${serif.variable} ${sans.variable}`}>
    <a className={styles.skip} href="#contenido">Ir al contenido</a>
    {children}
    <footer className={styles.footer}>
      <Link href="/catalogo-publico" className={styles.footerBrand}>VINOS</Link>
      <p>Una selección con carácter.</p>
      <p>Precios en pesos mexicanos · Venta exclusiva a mayores de edad.</p>
    </footer>
  </div>;
}
