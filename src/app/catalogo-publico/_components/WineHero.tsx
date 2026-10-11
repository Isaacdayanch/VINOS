"use client";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import styles from "../catalog.module.css";

export type WinePhoto = { url: string; caption: string; ambient: boolean };

export function WineHero({ photos, name, children }: { photos: WinePhoto[]; name: string; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const [enlarged, setEnlarged] = useState<WinePhoto | null>(null);
  const [zoom, setZoom] = useState(1);
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
        {photo.ambient && <div className={styles.photoDissolve} aria-hidden="true" />}
        {photos.length > 1 && <div className={styles.photoNavigation}>
          <button type="button" className={styles.photoArrow} aria-label="Fotografía anterior" onClick={() => show((active - 1 + photos.length) % photos.length)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5" /></svg></button>
          <div className={styles.photoDots} role="group" aria-label="Elegir fotografía">
            {photos.map((item, index) => <button key={`${item.url}-${index}`} type="button" aria-label={`Ver ${item.caption}`} aria-pressed={active === index} onClick={() => show(index)}><span /></button>)}
          </div>
          <button type="button" className={styles.photoArrow} aria-label="Fotografía siguiente" onClick={() => show((active + 1) % photos.length)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5" /></svg></button>
        </div>}
        <p className={styles.photoAnnouncement} aria-live="polite" aria-atomic="true">{active + 1} de {photos.length}: {photo.caption}</p>
        {!photo.ambient && <button type="button" className={styles.photoEnlarge} onClick={() => {
          setEnlarged(photo); setZoom(1); viewer.current?.showModal();
        }}>Ampliar fotografía <span aria-hidden="true">＋</span></button>}
      </div>
      <div className={styles.immersiveIntro}>{children}</div>
    </section>
    <dialog ref={viewer} className={styles.photoViewer} aria-label={`Fotografía ampliada de ${name}`} onClose={() => setEnlarged(null)}>
      <div className={styles.photoViewerBar}>
        <p>{enlarged?.caption}</p>
        <div>
          <button type="button" aria-label="Reducir imagen" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .5))}>−</button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Acercar imagen" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .5))}>＋</button>
          <button type="button" aria-label="Cerrar fotografía ampliada" onClick={() => viewer.current?.close()}>×</button>
        </div>
      </div>
      <div className={styles.photoViewerScroll}>
        <div className={styles.photoViewerCanvas}>
          {enlarged && <Image src={enlarged.url} alt={`${name}: ${enlarged.caption}`} width={1600} height={2200} unoptimized style={{ width: `${zoom * 88}vw`, maxWidth: `${zoom * 900}px`, height: "auto" }} />}
        </div>
      </div>
    </dialog>
  </>;
}
