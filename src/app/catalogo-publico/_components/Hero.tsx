"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "../catalog.module.css";

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = hero.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || reduced.matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, -element.getBoundingClientRect().top / element.offsetHeight));
      element.style.setProperty("--hero-shift", `${progress * 45}px`);
      element.style.setProperty("--bottle-angle", `${progress * -5}deg`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      window.removeEventListener("scroll", onScroll);
      if (entry.isIntersecting && !reduced.matches) window.addEventListener("scroll", onScroll, { passive: true });
    });
    observer.observe(element);
    const motionChange = () => {
      window.removeEventListener("scroll", onScroll);
      if (reduced.matches) { element.style.removeProperty("--hero-shift"); element.style.removeProperty("--bottle-angle"); }
      else window.addEventListener("scroll", onScroll, { passive: true });
    };
    reduced.addEventListener("change", motionChange);
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); reduced.removeEventListener("change", motionChange); cancelAnimationFrame(frame); };
  }, []);

  return <section ref={hero} className={styles.hero} aria-label="Bienvenida">
    <Image src="/catalogo/terrace.webp" alt="" fill priority sizes="100vw" className={styles.heroBackground} />
    <div className={styles.heroShade} />
    <div className={styles.heroWordmark} aria-hidden="true">VINOS</div>
    <p className={styles.heroOrigin}>ISRAEL Y EL MUNDO</p>
    <div className={styles.heroBottle}>
      <Image src="/catalogo/reserve-2017.webp" alt="Dādāh Special Reserve 2017, etiqueta de colores" fill priority sizes="(max-width: 700px) 48vw, 40vw" className={styles.bottleImage} />
    </div>
    <div className={styles.heroCopy}>
      <h1>El vino que convierte al plato principal en acompañamiento.</h1>
      <a href="#seleccion" className={styles.pill}>Explorar vinos <span aria-hidden="true">→</span></a>
    </div>
    <div className={styles.heroCaption}><span>DĀDĀH</span><span>Special Reserve · 2017</span></div>
    <a href="#historia" className={styles.scrollHint}>Desliza para descubrir <span aria-hidden="true">↓</span></a>
  </section>;
}
