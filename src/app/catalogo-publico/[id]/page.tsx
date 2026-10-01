import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../_components/Header";
import { Gallery } from "../_components/Gallery";
import { getPublicWine } from "../_lib/catalog";
import styles from "../catalog.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/catalogo-publico/[id]">): Promise<Metadata> {
  const product = await getPublicWine((await params).id);
  if (!product) return { title: "Vino no encontrado", robots: { index: false } };
  const title = `${product.nombre}${product.anio ? ` · ${product.anio}` : ""}`;
  const description = product.descripcion?.slice(0, 180) ?? `${title}. Descubre la ficha y las fotografías de este vino.`;
  return { title, description, openGraph: { title, description, type: "website", images: product.fotoUrl ? [{ url: product.fotoUrl, alt: title }] : [] } };
}

export default async function WinePage({ params }: PageProps<"/catalogo-publico/[id]">) {
  const product = await getPublicWine((await params).id);
  if (!product) notFound();
  const photos = [product.fotoUrl, ...product.imagenesExtra.map((p) => p.url)].filter((p): p is string => Boolean(p));
  const details = [
    ["Añada", product.anio], ["Región", product.region], ["Uva", product.varietal],
    ["Cuerpo", product.cuerpo], ["Alcohol", product.alcohol != null ? `${product.alcohol}%` : null],
  ].filter(([, value]) => value != null && value !== "");
  return <>
    <Header />
    <main id="contenido" className={styles.winePage}>
      <Link className={styles.back} href="/catalogo-publico/catalogo">Volver a la selección</Link>
      <div className={styles.wineTop}>
        <Gallery photos={photos} name={product.nombre} />
        <div className={styles.wineInfo}>
          <p className={styles.eyebrow}>{[product.categoria, product.anio].filter(Boolean).join(" · ")}</p>
          <h1>{product.nombre}</h1>
          {product.region && <p className={styles.region}>{product.region}</p>}
          <p className={styles.winePrice}>{product.precioLista !== null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(product.precioLista) : "Precio por confirmar"}<span>MXN</span></p>
          <p className={styles.purchaseNote}>{product.activo ? "Los pedidos en línea estarán disponibles próximamente." : "Este vino no está disponible actualmente."}</p>
          <dl className={styles.details}>{details.map(([label, value]) => <div key={String(label)}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <a href="#sobre-el-vino" className={styles.textLink}>Conoce este vino </a>
        </div>
      </div>
      <section id="sobre-el-vino" className={styles.wineStory}>
        <p className={styles.eyebrow}>DEL PRIMER SORBO A LA MESA</p>
        <h2>Cada botella,<br />una conversación.</h2>
        <div className={styles.storySections}>
          {[["El vino", product.descripcion], ["Notas de cata", product.notas], ["En la mesa", product.maridaje]].filter(([, text]) => Boolean(text)).map(([title, text]) => <section key={title}><h3>{title}</h3><p>{text}</p></section>)}
        </div>
        <Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Seguir descubriendo </Link>
      </section>
    </main>
  </>;
}
