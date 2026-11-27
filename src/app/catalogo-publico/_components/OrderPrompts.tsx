"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../_lib/cart";
import styles from "../catalog.module.css";

const CATALOGO = "/catalogo-publico/catalogo";
type Where = { home: boolean; shop: boolean; checkout: boolean };

// On lacava18.com the home page is served at "/", elsewhere at /catalogo-publico.
function where(path: string): Where {
  return {
    home: path === "/" || path === "/catalogo-publico",
    shop: /\/(catalogo|destilados)$/.test(path),
    checkout: path.includes("/pedido"),
  };
}

/** Thin bar at the very top of every public page: online orders are open. */
export function OrderBar({ abierto }: { abierto: boolean }) {
  const page = where(usePathname());
  const { bottles, ready, setOpen } = useCart();
  if (!abierto || page.checkout) return null;
  const withCart = ready && bottles > 0;
  return <div className={styles.orderBar}>
    <p><strong>Pedidos en línea</strong><span>Entrega a domicilio en CDMX y zona metropolitana</span></p>
    {withCart
      ? <button type="button" onClick={() => setOpen(true)}>Ver mi pedido ({bottles}) <span aria-hidden="true">→</span></button>
      : !page.shop && <Link href={CATALOGO}>Pide ahora <span aria-hidden="true">→</span></Link>}
  </div>;
}

/** Floating call to action: on the home page after a little scroll; elsewhere as soon as the cart has bottles. */
export function FloatingOrder({ abierto }: { abierto: boolean }) {
  const page = where(usePathname());
  const { bottles, ready, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.45);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  if (!abierto || page.checkout) return null;
  const withCart = ready && bottles > 0;
  const shown = withCart || (page.home && scrolled);
  return <div className={`${styles.floatOrder} ${shown ? styles.floatOrderShown : ""}`} aria-hidden={!shown}>
    {withCart
      ? <button type="button" tabIndex={shown ? 0 : -1} onClick={() => setOpen(true)}>
          <span className={styles.floatOrderCount}>{bottles}</span>
          <span>Ver mi pedido<small>{bottles} botella{bottles === 1 ? "" : "s"} · continuar</small></span>
          <span aria-hidden="true">→</span>
        </button>
      : <Link href={CATALOGO} tabIndex={shown ? 0 : -1}>
          <span>Haz tu pedido en línea<small>Entrega a domicilio</small></span>
          <span aria-hidden="true">→</span>
        </Link>}
  </div>;
}

/** Catalog: how ordering works, in three short steps. */
export function OrderSteps() {
  return <ol className={styles.orderSteps} aria-label="Cómo pedir en línea">
    <li><b>1</b>Elige tus botellas</li>
    <li><b>2</b>Confirma tus datos</li>
    <li><b>3</b>Te lo llevamos a casa</li>
  </ol>;
}
