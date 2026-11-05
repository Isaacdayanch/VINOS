import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { getStorefront } from "../_lib/storefront";
import styles from "../catalog.module.css";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu pedido", robots: { index: false, follow: false } };

export default async function PedidoPage() {
  const { regla, abierto } = await getStorefront();
  return <div className={`${styles.shopPage} ${styles.creamShop}`}>
    <Header />
    <main id="contenido" className={styles.checkoutPage}>
      <div className={styles.checkoutIntro}><p className={styles.eyebrow}>CAVA 18</p><h1>Tu <em>pedido</em></h1></div>
      <CheckoutForm zonas={regla.zonas} abierto={abierto} />
    </main>
  </div>;
}
