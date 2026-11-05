"use client";

import { useCart } from "../_lib/cart";
import styles from "../catalog.module.css";

/** Header basket: a bag with the bottle count; opens the basket drawer. */
export function CartButton() {
  const { bottles, ready, setOpen } = useCart();
  return <button type="button" className={styles.cartButton} onClick={() => setOpen(true)} aria-label={`Mi pedido, ${bottles} botella${bottles === 1 ? "" : "s"}`}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 8.5h13l-1 11h-11l-1-11Z" stroke="currentColor" strokeWidth="1.3" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" stroke="currentColor" strokeWidth="1.3" /></svg>
    {ready && bottles > 0 && <span className={styles.cartCount}>{bottles}</span>}
  </button>;
}
