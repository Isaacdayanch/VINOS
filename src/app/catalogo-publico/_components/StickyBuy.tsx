"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../catalog.module.css";

/** Phones only: once the visitor scrolls past the home photograph, a slim bar
 *  with "Compra ahora" stays at the bottom of the screen. */
export function StickyBuy({ freeShipping }: { freeShipping: string | null }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight * 0.6);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className={`${styles.stickyBuy} ${shown ? styles.stickyBuyShown : ""}`} aria-hidden={!shown}>
    {freeShipping && <span>{freeShipping}</span>}
    <Link href="/catalogo-publico/catalogo" tabIndex={shown ? 0 : -1}>Compra ahora <span aria-hidden="true">→</span></Link>
  </div>;
}
