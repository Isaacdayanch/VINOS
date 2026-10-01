import Image from "next/image";
import { showcaseWines } from "../_lib/showcase";
import styles from "../catalog.module.css";

/** Native vertical page scrolling: no wheel handlers or nested scroll container.
 * All wines remain visible without JS and with reduced motion enabled.
 */
export function VerticalShowcase() {
  return <section id="historia" className={styles.showcase} aria-label="Descubre nuestras botellas">
    <div className={styles.showcaseHeading}>
      <span className={styles.eyebrow}>Una selección con carácter</span>
      <h2>Cada botella.<br />Su propio mundo.</h2>
      <div className={styles.showcaseIntro}><p>Desliza hacia abajo para descubrir.</p><a href="#seleccion" className={styles.textLink}>Ir al catálogo <span aria-hidden="true">↗</span></a></div>
    </div>
    {showcaseWines.map((wine, index) => <article key={wine.slug} id={`descubre-${wine.slug}`} className={styles.showcaseScene} aria-labelledby={`titulo-${wine.slug}`}>
      <div className={styles.showcaseImage}>
        <Image src={`/catalogo/${wine.image}`} alt={`${wine.producer} ${wine.name} ${wine.year}, botella completa`} fill sizes="(max-width: 700px) 90vw, 48vw" className={styles.showcaseBottle} />
      </div>
      <div className={styles.showcaseCopy}>
        <span className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / {String(showcaseWines.length).padStart(2, "0")} <span aria-hidden="true">—</span> {wine.producer}</span>
        <h3 id={`titulo-${wine.slug}`}>{wine.name}</h3>
        <p className={styles.showcaseYear}>{wine.year}</p>
        {wine.description && <p className={styles.showcaseDescription}>{wine.description}</p>}
        {wine.facts && <details className={styles.showcaseFacts}><summary>Conocer este vino</summary><ul>{wine.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>{wine.labelImage && <a href={`/catalogo/${wine.labelImage}`} className={styles.textLink} target="_blank" rel="noopener noreferrer">Ver etiqueta original <span className={styles.srOnly}>(abre otra pestaña)</span><span aria-hidden="true">↗</span></a>}</details>}
        <div className={styles.showcaseActions}><a href="#seleccion" className={styles.textLink}>Explorar la selección <span aria-hidden="true">↗</span></a>
          {index < showcaseWines.length - 1 && <a href={`#descubre-${showcaseWines[index + 1].slug}`} className={styles.nextWine} aria-label={`Siguiente botella: ${showcaseWines[index + 1].producer} ${showcaseWines[index + 1].name}`}><span aria-hidden="true">↓</span></a>}
        </div>
      </div>
    </article>)}
  </section>;
}
