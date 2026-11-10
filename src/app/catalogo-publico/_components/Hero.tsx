"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../catalog.module.css";

// Approved by Isaac; they rotate with a soft fade (the first stays fixed with reduced motion).
const PHRASES = [
  "El vino que puede convertir al plato principal en un acompañamiento.",
  "Para brindar por lo que vale la pena.",
  "Del viñedo a tu mesa.",
  "Un buen vino no se bebe: se comparte.",
];

export function Hero({ freeShipping = null }: { freeShipping?: string | null }) {
  const hero = useRef<HTMLElement>(null);
  const [phrase, setPhrase] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setPhrase(current => (current + 1) % PHRASES.length), 6500);
    return () => clearInterval(timer);
  }, []);
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
    <Image src="/catalogo/terrace-deep-garnet.webp" alt="" fill priority sizes="100vw" className={styles.heroBackground} />
    <div className={styles.heroShade} />
    <div className={styles.heroLogo}>
      <Image src="/catalogo/logo-cava18-claro.png" alt="Cava 18" width={1140} height={291} priority sizes="(max-width: 700px) 88vw, 70vw" />
      <span className={styles.heroRule} aria-hidden="true" />
      <p className={styles.heroOrigin}>ISRAEL Y EL MUNDO</p>
    </div>
    <div className={styles.heroBottle}>
      <Image src="/catalogo/reserve-2017-softlight.webp" alt="Dādāh Special Reserve 2017, etiqueta de colores" fill priority sizes="(max-width: 700px) 48vw, 40vw" className={styles.bottleImage} />
    </div>
    <div className={styles.heroCopy}>
      <h1 key={phrase} className={styles.heroPhrase} aria-live="off">{PHRASES[phrase]}</h1>
      <Link href="/catalogo-publico/catalogo" className={styles.buyCta}>Compra ahora <span aria-hidden="true">→</span></Link>
      {freeShipping && <p className={styles.buyPerk}>{freeShipping}</p>}
    </div>
    <div className={styles.heroCaption}><span>DĀDĀH</span><span>Special Reserve · 2017</span></div>
    <a href="#historia" className={styles.scrollHint}>Desliza para descubrir </a>
  </section>;
}
