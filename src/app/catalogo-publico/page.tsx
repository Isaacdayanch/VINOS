import Image from "next/image";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Collection } from "./_components/Collection";
import { getPublication } from "./_lib/catalog";
import styles from "./catalog.module.css";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { wines, date } = await getPublication();
  return <>
    <Header overHero />
    <main id="contenido">
      <Hero />
      <section id="historia" className={styles.editorial}>
        <div className={styles.editorialHeading}><h2>Una selección<br />con carácter.</h2><p>Hay una botella para cada mesa.<br />Y algunas que cambian la conversación.</p></div>
        <div className={styles.editorialRail} aria-label="Botellas de nuestra selección" tabIndex={0}>
          {[
            { image: "dadah-original.jpg", name: "Dādāh", note: "Cabernet Sauvignon · Malbec Barbera", year: "2023" },
            { image: "tanya-original.jpg", name: "Tanya", note: "Enosh · Petit Verdot · Cosecha tardía", year: "2018 / 2021 / 2024" },
            { image: "rivallon-original.jpg", name: "Château Grand Rivallon", note: "Saint-Émilion Grand Cru", year: "2012" },
          ].map((item, i) => <figure key={item.image} className={styles.editorialFigure}>
            <div className={styles.editorialPhoto}><Image src={`/catalogo/${item.image}`} alt={`${item.name}, ${item.note}`} fill sizes="(max-width: 700px) 85vw, 40vw" className={styles.editorialImg} /></div>
            <figcaption><span className={styles.eyebrow}>0{i + 1} / {item.year}</span><h3>{item.name}</h3><p>{item.note}</p></figcaption>
          </figure>)}
        </div>
        <div className={styles.railHint}><span>Descubre las botellas</span><span aria-hidden="true">Desliza ↔</span></div>
      </section>
      <Collection wines={wines} date={date?.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }) ?? null} />
    </main>
  </>;
}
