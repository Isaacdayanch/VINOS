"use client";

import { useState } from "react";
import { useCart, type CartItem } from "../_lib/cart";
import styles from "../catalog.module.css";

export type CartProduct = Omit<CartItem, "cantidad">;

/** "Agregar" on a collection card: one tap adds a bottle and opens the basket. */
export function AddToCartCompact({ product }: { product: CartProduct }) {
  const { add } = useCart();
  return <button type="button" className={styles.addCompact} onClick={() => add(product)} aria-label={`Agregar ${product.nombre} a mi pedido`}>
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" /></svg>
    Agregar
  </button>;
}

/** Quantity and "Agregar a mi pedido" on a bottle's page. */
export function AddToCart({ product }: { product: CartProduct }) {
  const { add } = useCart();
  const [cantidad, setCantidad] = useState(1);
  return <div className={styles.addRow}>
    <div className={styles.qty} role="group" aria-label="Cantidad">
      <button type="button" onClick={() => setCantidad(n => Math.max(1, n - 1))} aria-label="Una botella menos">−</button>
      <span aria-live="polite">{cantidad}</span>
      <button type="button" onClick={() => setCantidad(n => Math.min(60, n + 1))} aria-label="Una botella más">+</button>
    </div>
    <button type="button" className={styles.orderPill} onClick={() => add(product, cantidad)}>Agregar a mi pedido</button>
  </div>;
}
