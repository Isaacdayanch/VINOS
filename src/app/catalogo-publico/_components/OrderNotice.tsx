"use client";

import { useRef } from "react";
import styles from "../catalog.module.css";

/** Preview-only CTA: no checkout, order submission or customer data collection. */
export function OrderNotice() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button type="button" className={styles.orderPill} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      <span>Haz tu pedido aquí</span><span className={styles.orderSoon}>Próximamente</span>
    </button>
    <dialog ref={dialog} className={styles.orderDialog} aria-labelledby="order-notice-title" aria-describedby="order-notice-description" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.orderDialogContent}>
        <p className={styles.eyebrow}>PEDIDOS EN LÍNEA</p>
        <h2 id="order-notice-title">Muy pronto,<br />a tu mesa.</h2>
        <p id="order-notice-description">Estamos preparando una forma sencilla de hacer tu pedido. Por ahora puedes explorar los vinos y consultar sus precios.</p>
        <button type="button" className={styles.darkPill} onClick={() => dialog.current?.close()}>Seguir viendo vinos</button>
      </div>
    </dialog>
  </>;
}
