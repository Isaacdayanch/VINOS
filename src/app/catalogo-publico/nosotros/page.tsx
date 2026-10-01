import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "../_components/Header";
import styles from "../catalog.module.css";

export const metadata: Metadata = {
  title: "Acerca de nosotros",
  description: "Una selección de vinos kosher de Israel y del mundo. Conoce nuestra forma de entender el vino: origen, carácter y el placer de compartir.",
};

export default function AboutPage() {
  return <>
    <Header />
    <main id="contenido" className={styles.aboutPage}>
      <section className={styles.aboutIntro} aria-labelledby="about-heading">
        <p className={styles.eyebrow}>ACERCA DE NOSOTROS</p>
        <h1 id="about-heading">El vino merece<br />el primer lugar.</h1>
        <p className={styles.aboutLead}>Una selección de vinos kosher de Israel y del mundo. Botellas con carácter, para quienes disfrutan descubrir algo que vale la pena abrir.</p>
      </section>
      <section className={styles.aboutFeature} aria-labelledby="about-selection">
        <div className={styles.aboutBottle}>
          <Image src="/catalogo/reserve-2017.webp" alt="Dādāh Special Reserve 2017, botella con etiqueta de colores" fill sizes="(max-width: 700px) 90vw, 45vw" className={styles.bottleImage} />
        </div>
        <div>
          <p className={styles.eyebrow}>NUESTRA SELECCIÓN</p>
          <h2 id="about-selection">Distintos orígenes.<br />Un mismo placer.</h2>
          <p>Nos interesa lo que hace especial a cada botella: su productor, su origen, su añada y su propia expresión. Israel ocupa un lugar protagonista, junto a vinos de otros países.</p>
          <p>Queremos que descubrirlos sea tan agradable como abrirlos. Puedes recorrer las botellas en la presentación o ir directamente al catálogo para consultar la selección y sus precios.</p>
          <Link href="/catalogo-publico/catalogo" className={styles.textLink}>Ver catálogo con precios <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className={styles.aboutPrinciples} aria-labelledby="about-philosophy">
        <p className={styles.eyebrow}>NUESTRA FORMA DE ENTENDER EL VINO</p>
        <h2 id="about-philosophy">Carácter en la botella.<br />Claridad al elegir.</h2>
        <div className={styles.aboutGrid}>
          <article><span className={styles.eyebrow}>01 / ORIGEN</span><h3>Una ventana al mundo.</h3><p>Una selección multimarca que reúne distintos productores, estilos y añadas. Cada vino tiene su propia identidad.</p></article>
          <article><span className={styles.eyebrow}>02 / KOSHER</span><h3>Parte de su identidad.</h3><p>El vino kosher es central en nuestra selección. La certificación y las características particulares se consultan por botella y añada, según la información disponible.</p></article>
          <article><span className={styles.eyebrow}>03 / DESCUBRIMIENTO</span><h3>No hace falta ser experto.</h3><p>Empieza por un tipo de vino, una añada o tu presupuesto. El catálogo te permite comparar con calma y conocer cada botella.</p></article>
        </div>
      </section>
      <section className={styles.aboutClosing} aria-labelledby="about-next">
        <p className={styles.eyebrow}>LA PRÓXIMA BOTELLA</p>
        <h2 id="about-next">Encuentra la tuya.</h2>
        <Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Explorar el catálogo <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  </>;
}
