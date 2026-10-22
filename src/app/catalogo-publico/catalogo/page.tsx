import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { Collection } from "../_components/Collection";
import { getShopCollection } from "../_lib/catalog";
import styles from "../catalog.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Cava de vinos",
  description: "Encuentra tu próxima botella. Explora vinos por tipo, añada, uva, región, cuerpo y presupuesto, con precios en pesos mexicanos.",
};

export default async function ShopCatalogPage() {
  const { wines, date } = await getShopCollection("VINO");
  return <div className={`${styles.shopPage} ${styles.creamShop}`}>
    <Header />
    <main id="contenido">
      <Collection kind="VINO" wines={wines} date={date?.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }) ?? null} />
    </main>
  </div>;
}
