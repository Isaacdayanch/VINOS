"use client";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import styles from "../catalog.module.css";

export type WinePhoto = { url: string; caption: string; ambient: boolean };

export function WineHero({ photos, name, children }: { photos: WinePhoto[]; name: string; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const photo = photos[active];
  return <>
    <section className={styles.immersiveHero} aria-label={name}>
      <div className={`${styles.immersivePhoto} ${!photo.ambient ? styles.immersiveBottle : ""}`}>
        <Image src={photo.url} alt={`${name}: ${photo.caption}`} fill preload sizes="(max-width: 700px) 100vw, 57vw" />
        <div className={styles.photoDissolve} aria-hidden="true" />
      </div>
      <div className={styles.immersiveIntro}>{children}</div>
    </section>
    <div className={styles.immersiveGallery}>
      <div className={styles.immersiveThumbnails} role="group" aria-label={`Fotografías de ${name}`}>
        {photos.map((item, index) => <button key={`${item.url}-${index}`} type="button" aria-label={`Ver ${item.caption}`} aria-pressed={active === index} onClick={() => setActive(index)}>
          <Image src={item.url} alt="" width={48} height={64} sizes="48px" />
        </button>)}
      </div>
      <p aria-live="polite">{active + 1} / {photos.length} · {photo.caption}</p>
    </div>
  </>;
}
