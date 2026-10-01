import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../_components/Header";
import { Gallery } from "../../_components/Gallery";
import { reserve2017 as wine } from "../../_lib/reserve-2017";
import styles from "../../catalog.module.css";

export const metadata: Metadata = {
  title: wine.name,
  description: wine.description,
  openGraph: { title: wine.name, description: wine.description, type: "website", images: [{ url: "/catalogo/reserve-2017-table.webp", alt: wine.name }] },
};

/** Public editorial wine page. Price and availability remain in the published catalog. */
export default function Reserve2017Page() {
  return <>
    <Header />
    <main id="contenido" className={styles.winePage}>
      <Link href="/catalogo-publico#descubre-reserve-2017" className={styles.back}>Volver a las botellas</Link>
      <div className={styles.wineTop}>
        <div>
          <Gallery photos={wine.photos} captions={wine.captions} name={wine.name} editorial />
          <p className={styles.galleryNote}>Imágenes de ambientación creadas para esta presentación. Consulta la etiqueta original para los datos y sellos.</p>
        </div>
        <div className={styles.wineInfo}>
          <p className={styles.eyebrow}>DĀDĀH WINERY · ISRAEL</p>
          <h1>Special Reserve<br />2017</h1>
          <p className={styles.region}>Cabernet Sauvignon · Tinto seco</p>
          <p className={styles.showcaseDescription}>{wine.description}</p>
          <dl className={styles.details}>{wine.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Consultar catálogo con precios</Link>
        </div>
      </div>
      <section className={styles.wineStory} aria-labelledby="reserve-story">
        <p className={styles.eyebrow}>DEL PRIMER SORBO A LA MESA</p>
        <h2 id="reserve-story">Treinta meses.<br />Un carácter propio.</h2>
        <div className={styles.storySections}>
          <section><h3>En la copa</h3><p>{wine.description}</p></section>
          <section><h3>En la mesa</h3><p>{wine.pairing}</p></section>
          <section><h3>La bodega</h3><p>Según el estuche, Dādāh Winery fue fundada en 2007, inspirada en una tradición familiar de elaboración de vino procedente de Marruecos. La bodega se sitúa en Makura Farm, cerca de Kerem Maharal, en las laderas occidentales del monte Carmelo. Esta ubicación de la bodega no identifica por sí sola el origen de las uvas de esta añada.</p></section>
        </div>
        <a href="/catalogo/reserve-2017-label-original.webp" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Ver contraetiqueta original<span className={styles.srOnly}> (abre otra pestaña)</span></a>
      </section>
    </main>
  </>;
}
