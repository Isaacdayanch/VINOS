"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Cotizacion } from "@/lib/tienda";
import { money, useCart } from "../_lib/cart";
import styles from "../catalog.module.css";
import { cotizarEnvioAction, crearPedidoWeb } from "./actions";

const campos = { nombre: "", telefono: "", email: "", calle: "", colonia: "", codigoPostal: "", ciudad: "", referencias: "", notas: "", sitio: "" };

export function CheckoutForm({ zonas, abierto }: { zonas: string[]; abierto: boolean }) {
  const { items, bottles, subtotal, ready, setQuantity, clear } = useCart();
  const [valores, setValores] = useState(campos);
  const [quote, setQuote] = useState<{ cp: string; bottles: number; result: Cotizacion } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, startTransition] = useTransition();
  const router = useRouter();
  const cp = valores.codigoPostal.replace(/\D/g, "");

  // Shipping quote as soon as the postal code is complete, and again if the bottle count changes.
  useEffect(() => {
    if (cp.length !== 5) return;
    let vigente = true;
    cotizarEnvioAction(cp, bottles).then(result => { if (vigente) setQuote({ cp, bottles, result }); });
    return () => { vigente = false; };
  }, [cp, bottles]);
  // The quote only counts while it matches what is on screen; otherwise a new one is on its way.
  const cotizacion = quote && quote.cp === cp && quote.bottles === bottles ? quote.result : null;

  const set = (campo: keyof typeof campos) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValores(current => ({ ...current, [campo]: event.target.value }));
  const envio = cotizacion?.ok ? cotizacion.envio : null;
  const listo = ready && items.length > 0 && cotizacion?.ok && !enviando;

  function enviar(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await crearPedidoWeb({ ...valores, items: items.map(item => ({ id: item.id, cantidad: item.cantidad })) });
      if (!result.ok) { setError(result.error); return; }
      clear();
      router.push(`/catalogo-publico/pedido/gracias?folio=${encodeURIComponent(result.folio)}`);
    });
  }

  if (!ready) return <p className={styles.checkoutNote} role="status">Preparando tu pedido…</p>;
  if (!abierto) return <div className={styles.checkoutEmpty}><h2>Muy pronto,<br />a tu mesa.</h2><p>Por el momento no estamos tomando pedidos en línea. Vuelve muy pronto.</p><Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Ver la selección</Link></div>;
  if (!items.length) return <div className={styles.checkoutEmpty}><h2>Tu pedido está vacío.</h2><p>Elige tus botellas en la cava y vuelve aquí para cerrar tu pedido.</p><Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Ver la selección</Link></div>;

  return <form className={styles.checkout} onSubmit={enviar} noValidate>
    <div className={styles.checkoutForm}>
      <section>
        <p className={styles.eyebrow}>1 · PARA TI</p>
        <div className={styles.fields}>
          <label>Nombre completo<input required autoComplete="name" value={valores.nombre} onChange={set("nombre")} /></label>
          <label>WhatsApp (10 dígitos)<input required type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="55 1234 5678" value={valores.telefono} onChange={set("telefono")} /></label>
          <label>Correo <small>(opcional)</small><input type="email" autoComplete="email" value={valores.email} onChange={set("email")} /></label>
        </div>
      </section>
      <section>
        <p className={styles.eyebrow}>2 · ENTREGA</p>
        <p className={styles.checkoutNote}>Entregamos en {zonas.join(" y ") || "la Ciudad de México"}.</p>
        <div className={styles.fields}>
          <label>Calle y número<input required autoComplete="street-address" value={valores.calle} onChange={set("calle")} /></label>
          <div className={styles.fieldsRow}>
            <label>Colonia<input autoComplete="address-level3" value={valores.colonia} onChange={set("colonia")} /></label>
            <label>Código postal<input required inputMode="numeric" maxLength={5} autoComplete="postal-code" value={valores.codigoPostal} onChange={set("codigoPostal")} aria-describedby="cp-estado" /></label>
          </div>
          <p id="cp-estado" className={`${styles.cpStatus} ${cotizacion && !cotizacion.ok ? styles.cpBad : ""}`} role="status">
            {cp.length === 5 && !cotizacion && "Revisando tu zona…"}
            {cotizacion?.ok && <>{cotizacion.zona} · {cotizacion.envio ? `envío ${money.format(cotizacion.envio)}` : "envío gratis"}{cotizacion.botellasParaGratis > 0 && ` (gratis a partir de ${cotizacion.gratisDesde} botellas)`}</>}
            {cotizacion && !cotizacion.ok && cotizacion.motivo}
          </p>
          <label>Alcaldía o municipio<input autoComplete="address-level2" value={valores.ciudad} onChange={set("ciudad")} /></label>
          <label>Referencias <small>(entre qué calles, color de la casa, quién recibe)</small><input value={valores.referencias} onChange={set("referencias")} /></label>
        </div>
      </section>
      <section>
        <p className={styles.eyebrow}>3 · ALGO MÁS</p>
        <div className={styles.fields}>
          <label>Comentarios <small>(opcional)</small><textarea rows={3} value={valores.notas} onChange={set("notas")} /></label>
        </div>
        <label className={styles.honey} aria-hidden="true">Sitio web<input tabIndex={-1} autoComplete="off" value={valores.sitio} onChange={set("sitio")} /></label>
      </section>
    </div>

    <aside className={styles.checkoutSummary} aria-label="Resumen de tu pedido">
      <p className={styles.eyebrow}>TU PEDIDO</p>
      <ul className={styles.summaryList}>
        {items.map(item => <li key={item.id}>
          <div className={styles.cartThumb}>{item.foto ? <Image src={item.foto} alt="" fill unoptimized sizes="56px" /> : null}</div>
          <div className={styles.summaryInfo}>
            <h3>{item.nombre}</h3>
            <div className={styles.qty} role="group" aria-label={`Cantidad de ${item.nombre}`}>
              <button type="button" onClick={() => setQuantity(item.id, item.cantidad - 1)} aria-label="Una botella menos">−</button>
              <span>{item.cantidad}</span>
              <button type="button" onClick={() => setQuantity(item.id, item.cantidad + 1)} aria-label="Una botella más">+</button>
            </div>
          </div>
          <span className={styles.summaryPrice}>{item.precio !== null ? money.format(item.precio * item.cantidad) : "—"}</span>
        </li>)}
      </ul>
      <dl className={styles.summaryTotals}>
        <div><dt>{bottles} botella{bottles === 1 ? "" : "s"}</dt><dd>{money.format(subtotal)}</dd></div>
        <div><dt>Envío</dt><dd>{envio === null ? "Según tu código postal" : envio ? money.format(envio) : "Gratis"}</dd></div>
        <div className={styles.summaryTotal}><dt>Total</dt><dd>{money.format(subtotal + (envio ?? 0))}</dd></div>
      </dl>
      <p className={styles.checkoutNote}>Sin pago en línea: te escribimos por WhatsApp para confirmar tu pedido, la fecha de entrega y la forma de pago (transferencia o al recibir).</p>
      {error && <p className={styles.checkoutError} role="alert">{error}</p>}
      <button type="submit" className={styles.darkPill} disabled={!listo}>{enviando ? "Enviando tu pedido…" : "Hacer mi pedido"}</button>
      <Link href="/catalogo-publico/catalogo" className={styles.cartContinue}>Seguir viendo la selección</Link>
    </aside>
  </form>;
}
