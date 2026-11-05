"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../catalog.module.css";

const KEY = "cava18-mayor-de-edad";
const DAYS = 30;

/** Elegant age check shown once per visitor (remembered 30 days in this browser).
 *  Rendered only after mount, so the page itself is still in the HTML for search engines. */
export function AgeGate() {
  const [state, setState] = useState<"hidden" | "ask" | "no">("hidden");
  const yes = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let confirmed = false;
    try { confirmed = Date.now() - Number(localStorage.getItem(KEY) ?? 0) < DAYS * 864e5; } catch {}
    // Deferred one frame: reading localStorage is the external system this effect syncs with.
    const frame = requestAnimationFrame(() => { if (!confirmed) setState("ask"); });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (state === "hidden") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus for keyboards and screen readers, without drawing the focus ring on load.
    yes.current?.focus({ focusVisible: false } as FocusOptions);
    return () => { document.body.style.overflow = previous; };
  }, [state]);

  if (state === "hidden") return null;
  function accept() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch {}
    setState("hidden");
  }

  return <div className={styles.ageGate} role="dialog" aria-modal="true" aria-labelledby="age-title" aria-describedby="age-text">
    <div className={styles.agePhoto}>
      <Image src="/catalogo/reserve-2017-pour.webp" alt="" fill priority sizes="(max-width: 700px) 100vw, 50vw" />
    </div>
    <div className={styles.agePanel}>
      <Image src="/catalogo/logo-cava18.png" alt="Cava 18" width={1140} height={291} className={styles.ageLogo} />
      {state === "ask" ? <>
        <p className={styles.eyebrow}>Bienvenido</p>
        <h2 id="age-title">¿Eres mayor de edad?</h2>
        <p id="age-text">Para entrar a Cava 18 confirma que tienes 18 años o más.</p>
        <div className={styles.ageActions}>
          <button ref={yes} type="button" className={styles.darkPill} onClick={accept}>Sí, tengo 18 o más</button>
          <button type="button" className={styles.ageNo} onClick={() => setState("no")}>No</button>
        </div>
      </> : <>
        <p className={styles.eyebrow}>Hasta pronto</p>
        <h2 id="age-title">Te esperamos a los 18.</h2>
        <p id="age-text">El contenido de Cava 18 es solo para mayores de edad.</p>
        <div className={styles.ageActions}>
          <button ref={yes} type="button" className={styles.ageNo} onClick={() => setState("ask")}>Regresar</button>
        </div>
      </>}
      <p className={styles.ageNote}>Disfruta con responsabilidad.</p>
    </div>
  </div>;
}
