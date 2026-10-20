import Link from "next/link";
import { Header } from "./Header";
import { OrderNotice } from "./OrderNotice";
import { WineHero, type WinePhoto } from "./WineHero";
import styles from "../catalog.module.css";

type WineDetail = {
  name: string; title: string; eyebrow: string; style?: string;
  description?: string | null; facts: string[][]; photos: WinePhoto[];
  stories: { title: string; text: string }[];
  commerce?: { precioLista: number | null; activo: boolean };
};

/** Public presentation shared by CRM galleries and verified editorial profiles. */
export function WineDetailPage({ wine }: { wine: WineDetail }) {
  return <>
    <Header />
    <main id="contenido" className={styles.immersivePage}>
      <Link href="/catalogo-publico/catalogo" className={styles.immersiveBack}>Volver a la selección</Link>
      <WineHero photos={wine.photos} name={wine.name}>
        <p className={styles.eyebrow}>{wine.eyebrow}</p><h1>{wine.title}</h1>
        {wine.style && <p className={styles.immersiveStyle}>{wine.style}</p>}
        <span className={styles.immersiveRule} aria-hidden="true" />
        {wine.description && <p className={styles.immersiveDescription}>{wine.description}</p>}
        {wine.commerce && <>
          <p className={styles.winePrice}>{wine.commerce.precioLista !== null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(wine.commerce.precioLista) : "Precio por confirmar"}{wine.commerce.precioLista !== null && <span>MXN</span>}</p>
          {wine.commerce.activo ? <OrderNotice /> : <p className={styles.purchaseNote}>Este vino no está disponible actualmente.</p>}
        </>}
        <a href="#ficha-tecnica" className={styles.immersiveLink}>Conoce el vino ↓</a>
      </WineHero>
      <section id="ficha-tecnica" className={styles.technicalSection} aria-labelledby="technical-heading">
        <div><p className={styles.eyebrow}>EL VINO EN DETALLE</p><h2 id="technical-heading">Ficha técnica</h2></div>
        <dl className={styles.technicalFacts}>{wine.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
      {wine.stories.length > 0 && <section id="sobre-el-vino" className={styles.immersiveStories} aria-label="En la copa y en la mesa">
        {wine.stories.map(story => <section key={story.title}><h2>{story.title}</h2><p>{story.text}</p></section>)}
      </section>}
      <div className={styles.immersiveContinue}><Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Seguir descubriendo</Link></div>
    </main>
  </>;
}
