import Link from "next/link";
import { Header } from "./Header";
import { Gallery } from "./Gallery";
import type { EditorialWine } from "../_lib/editorial-wine";
import styles from "../catalog.module.css";
import { OrderNotice } from "./OrderNotice";

/** Shared public presentation; no purchase state or CRM mutations. */
export function EditorialWinePage({ wine, commerce }: { wine: EditorialWine; commerce?: { precioLista: number | null; activo: boolean } }) {
  return <>
    <Header />
    <main id="contenido" className={styles.winePage}>
      <Link href={`/catalogo-publico#descubre-${wine.slug}`} className={styles.back}>Volver a las botellas</Link>
      <div className={styles.wineTop}>
        <div>
          <Gallery photos={wine.photos} captions={wine.captions} name={wine.name} editorial />
          <p className={styles.galleryNote}>Imágenes de ambientación creadas para esta presentación. Consulta las etiquetas originales para los datos y sellos.</p>
        </div>
        <div className={styles.wineInfo}>
          <p className={styles.eyebrow}>{wine.producer}</p>
          <h1>{wine.title}<br />{wine.year}</h1>
          <p className={styles.region}>{wine.style}</p>
          {commerce && <>
            <p className={styles.winePrice}>{commerce.precioLista !== null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(commerce.precioLista) : "Precio por confirmar"}{commerce.precioLista !== null && <span>MXN</span>}</p>
            {commerce.activo ? <OrderNotice /> : <p className={styles.purchaseNote}>Este vino no está disponible actualmente.</p>}
          </>}
          <p className={styles.showcaseDescription}>{wine.description}</p>
          <dl className={styles.details}>{wine.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Consultar catálogo con precios</Link>
        </div>
      </div>
      <section className={styles.wineStory} aria-labelledby="editorial-story">
        <p className={styles.eyebrow}>DEL PRIMER SORBO A LA MESA</p>
        <h2 id="editorial-story">{wine.storyHeading}<br />Un carácter propio.</h2>
        <div className={styles.storySections}>
          <section><h3>En la copa</h3><p>{wine.description}</p></section>
          <section><h3>En la mesa</h3><p>{wine.pairing}</p></section>
          {wine.wineryStory && <section><h3>La bodega</h3><p>{wine.wineryStory}</p></section>}
        </div>
      </section>
    </main>
  </>;
}
