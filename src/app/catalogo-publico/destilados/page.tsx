import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { Collection } from "../_components/Collection";
import { getShopCollection } from "../_lib/catalog";
import styles from "../catalog.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Cava de destilados",
  description: "Arak, whisky y otros destilados con carácter. Explora por tipo, país, alcohol y presupuesto, con precios en pesos mexicanos.",
};

export default async function SpiritsCatalogPage() {
  const { wines, date } = await getShopCollection("DESTILADO");
  return <div className={`${styles.shopPage} ${styles.spiritsPage}`}>
    <Header />
    <main id="contenido">
      <Collection kind="DESTILADO" wines={wines} date={date?.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }) ?? null} />
    </main>
  </div>;
}
