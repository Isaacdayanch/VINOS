"use client";
import styles from "./catalog.module.css";
export default function CatalogError({ reset }: { reset: () => void }) {
  return <main id="contenido" className={styles.empty}><h1>La selección estará de vuelta en un momento.</h1><p>No pudimos cargar los vinos. Intenta de nuevo.</p><button className={styles.darkPill} onClick={reset}>Volver a intentar →</button></main>;
}
