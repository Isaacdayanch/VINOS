import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../_components/Header";
import { Gallery } from "../_components/Gallery";
import { getPublicWine } from "../_lib/catalog";
import styles from "../catalog.module.css";
import { grandRivallon, grandRivallonId } from "../_lib/grand-rivallon";
import { EditorialWinePage } from "../_components/EditorialWinePage";
import { editorialMetadata } from "../_lib/editorial-wine";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/catalogo-publico/[id]">): Promise<Metadata> {
  const product = await getPublicWine((await params).id);
  if (!product) return { title: "Botella no encontrada", robots: { index: false } };
  if (product.id === grandRivallonId && product.anio === 2012) return editorialMetadata(grandRivallon);
  const title = `${product.nombre}${product.anio ? ` · ${product.anio}` : ""}`;
  const noun = product.tipo === "DESTILADO" ? "destilado" : "vino";
  const description = product.descripcion?.slice(0, 180) ?? `${title}. Descubre la ficha y las fotografías de este ${noun}.`;
  return { title, description, openGraph: { title, description, type: "website", images: product.fotoUrl ? [{ url: product.fotoUrl, alt: title }] : [] } };
}

export default async function WinePage({ params }: PageProps<"/catalogo-publico/[id]">) {
  const product = await getPublicWine((await params).id);
  if (!product) notFound();
  if (product.id === grandRivallonId && product.anio === 2012) return <EditorialWinePage wine={grandRivallon} commerce={{ precioLista: product.precioLista, activo: product.activo }} />;
  const spirit = product.tipo === "DESTILADO";
  const collectionHref = spirit ? "/catalogo-publico/destilados" : "/catalogo-publico/catalogo";
  const photos = [product.fotoUrl, ...product.imagenesExtra.map((p) => p.url)].filter((p): p is string => Boolean(p));
  const details = (spirit
    ? [["Año", product.anio], ["Región", product.region], ["Hecho de", product.varietal], ["Alcohol", product.alcohol != null ? `${product.alcohol}%` : null]]
    : [["Añada", product.anio], ["Región", product.region], ["Uva", product.varietal], ["Cuerpo", product.cuerpo], ["Alcohol", product.alcohol != null ? `${product.alcohol}%` : null]]
  ).filter(([, value]) => value != null && value !== "");
  const story = spirit
    ? [["El destilado", product.descripcion], ["Notas de cata", product.notas], ["Cómo tomarlo", product.maridaje]]
    : [["El vino", product.descripcion], ["Notas de cata", product.notas], ["En la mesa", product.maridaje]];
  return <>
    <Header />
    <main id="contenido" className={styles.winePage}>
      <Link className={styles.back} href={collectionHref}>{spirit ? "Volver a destilados" : "Volver a la selección"}</Link>
      <div className={styles.wineTop}>
        <Gallery photos={photos} name={product.nombre} />
        <div className={styles.wineInfo}>
          <p className={styles.eyebrow}>{[product.categoria, product.anio].filter(Boolean).join(" · ")}</p>
          <h1>{product.nombre}</h1>
          {product.region && <p className={styles.region}>{product.region}</p>}
          <p className={styles.winePrice}>{product.precioLista !== null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(product.precioLista) : "Precio por confirmar"}<span>MXN</span></p>
          <p className={styles.purchaseNote}>{product.activo ? "Los pedidos en línea estarán disponibles próximamente." : "Esta botella no está disponible actualmente."}</p>
          <dl className={styles.details}>{details.map(([label, value]) => <div key={String(label)}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <a href="#sobre-el-vino" className={styles.textLink}>{spirit ? "Conoce este destilado " : "Conoce este vino "}</a>
        </div>
      </div>
      <section id="sobre-el-vino" className={styles.wineStory}>
        <p className={styles.eyebrow}>{spirit ? "DE LA BOTELLA AL VASO" : "DEL PRIMER SORBO A LA MESA"}</p>
        <h2>Cada botella,<br />una conversación.</h2>
        <div className={styles.storySections}>
          {story.filter(([, text]) => Boolean(text)).map(([title, text]) => <section key={title}><h3>{title}</h3><p>{text}</p></section>)}
        </div>
        <Link href={collectionHref} className={styles.darkPill}>Seguir descubriendo </Link>
      </section>
    </main>
  </>;
}
