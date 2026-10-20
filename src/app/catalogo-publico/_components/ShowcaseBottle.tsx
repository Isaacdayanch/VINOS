"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../catalog.module.css";

/** Botella que entra acostada y se endereza al aparecer en pantalla.
 * Disparado con IntersectionObserver (no con animation-timeline: view(),
 * que Safari/iOS todavía no soporta bien) para que se vea en cualquier
 * teléfono, no solo en Chrome.
 */
export function ShowcaseBottle({
  src,
  alt,
  editorialHref,
  ariaLabel,
}: {
  src: string;
  alt: string;
  editorialHref?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.showcaseImage} ref={ref}>
      {editorialHref && <Link href={editorialHref} className={styles.showcaseBottleLink} aria-label={ariaLabel} />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 700px) 90vw, 48vw"
        className={`${styles.showcaseBottle} ${revealed ? styles.showcaseBottleIn : ""}`}
      />
    </div>
  );
}
