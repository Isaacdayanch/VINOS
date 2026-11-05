"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { money, useCart } from "../_lib/cart";
import styles from "../catalog.module.css";

export type ReglaEnvio = { costo: number; gratisDesde: number | null; zonas: string[] };

function CloseIcon() { return <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" /></svg>; }

/** The basket, as a side panel. Lives in the layout so every public page shares it. */
export function CartDrawer({ regla, abierto }: { regla: ReglaEnvio; abierto: boolean }) {
  const { items, bottles, subtotal, open, setOpen, setQuantity, remove } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const faltan = regla.gratisDesde ? Math.max(0, regla.gratisDesde - bottles) : 0;
  const envioTexto = !bottles ? null : regla.gratisDesde && faltan === 0 ? "Envío gratis" : `Envío ${money.format(regla.costo)}${regla.gratisDesde ? ` · gratis desde ${regla.gratisDesde} botellas` : ""}`;

  return <dialog ref={dialog} className={styles.cartDrawer} aria-labelledby="cart-title" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
    <div className={styles.cartHeading}>
      <p className={styles.eyebrow}>MI PEDIDO</p>
      <button type="button" className={styles.close} aria-label="Cerrar mi pedido" onClick={() => setOpen(false)}><CloseIcon /></button>
      <h2 id="cart-title">{bottles ? <>{bottles} botella{bottles === 1 ? "" : "s"}</> : "Tu pedido está vacío."}</h2>
    </div>
    <div className={styles.cartBody}>
      {!items.length && <p className={styles.cartEmpty}>Elige una botella y aparecerá aquí. Entregamos en {regla.zonas.join(" y ") || "la Ciudad de México"}.</p>}
      <ul className={styles.cartList}>
        {items.map(item => <li key={item.id} className={styles.cartItem}>
          <div className={styles.cartThumb}>{item.foto ? <Image src={item.foto} alt="" fill unoptimized sizes="64px" /> : null}</div>
          <div className={styles.cartInfo}>
            {item.detalle && <p className={styles.eyebrow}>{item.detalle}</p>}
            <h3>{item.nombre}</h3>
            <p className={styles.cartPrice}>{item.precio !== null ? money.format(item.precio) : "Precio por confirmar"}</p>
            <div className={styles.cartItemActions}>
              <div className={styles.qty} role="group" aria-label={`Cantidad de ${item.nombre}`}>
                <button type="button" onClick={() => setQuantity(item.id, item.cantidad - 1)} aria-label="Una botella menos">−</button>
                <span>{item.cantidad}</span>
                <button type="button" onClick={() => setQuantity(item.id, item.cantidad + 1)} aria-label="Una botella más">+</button>
              </div>
              <button type="button" className={styles.cartRemove} onClick={() => remove(item.id)}>Quitar</button>
            </div>
          </div>
        </li>)}
      </ul>
    </div>
    <div className={styles.cartFooter}>
      {items.length > 0 && <>
        <div className={styles.cartTotals}>
          <p><span>Subtotal</span><span>{money.format(subtotal)}</span></p>
          {envioTexto && <p className={styles.cartShipping}><span>{envioTexto}</span>{faltan > 0 && <span>Te falta{faltan === 1 ? "" : "n"} {faltan} para envío gratis</span>}</p>}
        </div>
        {abierto
          ? <Link href="/catalogo-publico/pedido" className={styles.darkPill} onClick={() => setOpen(false)}>Continuar con mi pedido</Link>
          : <p className={styles.cartEmpty}>Por el momento no estamos tomando pedidos en línea. Vuelve muy pronto.</p>}
      </>}
      <button type="button" className={styles.cartContinue} onClick={() => setOpen(false)}>Seguir viendo la selección</button>
    </div>
  </dialog>;
}
