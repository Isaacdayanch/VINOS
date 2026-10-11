"use client";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import styles from "../catalog.module.css";

export type WinePhoto = { url: string; caption: string; ambient: boolean };

export function WineHero({ photos, name, children }: { photos: WinePhoto[]; name: string; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const photo = photos[active];
  function show(index: number) {
    const element = track.current;
    if (!element) return;
    const next = Math.max(0, Math.min(index, photos.length - 1));
    element.scrollTo({ left: next * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <>
    <section className={styles.immersiveHero} aria-label={name}>
      <div className={styles.immersivePhoto}>
        <div ref={track} className={styles.photoTrack} tabIndex={0} role="region" aria-roledescription="carrusel" aria-label={`Fotografías de ${name}. Desliza para ver más fotos.`}
          onScroll={(event) => {
            const element = event.currentTarget;
            setActive(Math.max(0, Math.min(photos.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
          }}
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            show(event.key === "Home" ? 0 : event.key === "End" ? photos.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.dataset.dragging = "true";
          }}
          onPointerMove={(event) => {
            if (drag.current) event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX;
          }}
          onPointerUp={(event) => {
            if (!drag.current) return;
            const next = Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth);
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            show(next);
          }}
          onPointerCancel={(event) => { drag.current = null; delete event.currentTarget.dataset.dragging; }}>
          {photos.map((item, index) => <div key={`${item.url}-${index}`} className={`${styles.photoSlide} ${!item.ambient ? styles.immersiveBottle : ""}`} role="group" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${photos.length}: ${item.caption}`}>
            <Image src={item.url} alt={`${name}: ${item.caption}`} fill preload={index === 0} draggable={false} sizes="(max-width: 700px) 100vw, 57vw" />
          </div>)}
        </div>
        <div className={styles.photoDissolve} aria-hidden="true" />
        {photos.length > 1 && <div className={styles.photoNavigation}>
          <div className={styles.photoDots} role="group" aria-label="Elegir fotografía">
            {photos.map((item, index) => <button key={`${item.url}-${index}`} type="button" aria-label={`Ver ${item.caption}`} aria-pressed={active === index} onClick={() => show(index)}><span /></button>)}
          </div>
          <p>Desliza para ver más</p>
        </div>}
        <p className={styles.photoAnnouncement} aria-live="polite" aria-atomic="true">{active + 1} de {photos.length}: {photo.caption}</p>
      </div>
      <div className={styles.immersiveIntro}>{children}</div>
    </section>
  </>;
}
