"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "../catalog.module.css";

export function Gallery({ photos, name }: { photos: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  function select(index: number) {
    const element = scroller.current;
    if (!element) return;
    element.scrollTo({ left: index * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActive(index);
  }
  if (!photos.length) return <div className={styles.galleryEmpty}>Fotografía próximamente</div>;
  return <div className={styles.gallery}>
    <div ref={scroller} className={styles.galleryScroller} aria-label={`Fotografías de ${name}`} tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); select(Math.max(0, Math.min(photos.length - 1, active + (e.key === "ArrowRight" ? 1 : -1)))); } }}
      onScroll={() => { if (scroller.current) setActive(Math.round(scroller.current.scrollLeft / scroller.current.clientWidth)); }}>
      {photos.map((photo, i) => <div className={styles.gallerySlide} key={`${photo}-${i}`}><Image src={photo} alt={`${name}, fotografía ${i + 1} de ${photos.length}`} fill priority={i === 0} sizes="(max-width: 700px) 100vw, 55vw" className={styles.bottleImage} /></div>)}
    </div>
    <p className={styles.galleryCount} aria-live="polite">{active + 1} / {photos.length}</p>
    {photos.length > 1 && <div className={styles.thumbnails}>{photos.map((photo, i) => <button type="button" key={`${photo}-${i}`} aria-label={`Ver fotografía ${i + 1}`} aria-pressed={active === i} onClick={() => select(i)}><Image src={photo} alt="" fill sizes="64px" className={styles.bottleImage} /></button>)}</div>}
  </div>;
}
