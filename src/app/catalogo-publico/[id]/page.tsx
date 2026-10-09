import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../_components/Header";
import { Gallery } from "../_components/Gallery";
import { getPublicWine } from "../_lib/catalog";
import styles from "../catalog.module.css";
import { wineProfile, additionalWineFacts } from "../_lib/wine-profiles";
import { WineDetailPage } from "../_components/WineDetailPage";
import { EditorialWinePage } from "../_components/EditorialWinePage";
import { editorialMetadata } from "../_lib/editorial-wine";
import { publicPhotograph } from "../_lib/public-photography";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/catalogo-publico/[id]">): Promise<Metadata> {
  const product = await getPublicWine((await params).id);
  if (!product) return { title: "Vino no encontrado", robots: { index: false } };
  const profile = wineProfile(product.id, product.anio);
  if (profile) return editorialMetadata(profile);
  const title = `${product.nombre}${product.anio ? ` · ${product.anio}` : ""}`;
  const description = product.descripcion?.slice(0, 180) ?? `${title}. Descubre la ficha y las fotografías de este vino.`;
  return { title, description, openGraph: { title, description, type: "website", images: product.fotoUrl ? [{ url: product.fotoUrl, alt: title }] : [] } };
}

export default async function WinePage({ params }: PageProps<"/catalogo-publico/[id]">) {
  const product = await getPublicWine((await params).id);
  if (!product) notFound();
  const profile = wineProfile(product.id, product.anio);
  if (profile) return <EditorialWinePage wine={profile} commerce={{ precioLista: product.precioLista, activo: product.activo }} />;
  const photos = [publicPhotograph(product.id, product.fotoUrl), ...product.imagenesExtra.map((p) => p.url)].filter((p): p is string => Boolean(p));
  const details = [
    ["Añada", product.anio], ["Región", product.region], ["Uva", product.varietal],
    ["Cuerpo", product.cuerpo], ["Alcohol", product.alcohol != null ? `${product.alcohol}%` : null],
  ].filter(([, value]) => value != null && value !== "");
  if (product.imagenesExtra.length) {
    // Extra images are the ambient gallery; the catalog packshot comes last.
    const ambient = product.imagenesExtra.map((photo, index) => ({ url: photo.url, caption: `Ambientación ${index + 1}`, ambient: true }));
    // Approved Tanya opening scene: the sunset table is its last uploaded image.
    if (product.id === "cmtssyq4u0006l404sytto49b" && ambient.length === 4) ambient.unshift(ambient.pop()!);
    const front = publicPhotograph(product.id, product.fotoUrl);
    const tanya = product.id === "cmtssyq4u0006l404sytto49b" && product.anio === 2021;
    const enosh = product.id === "cmtssyq4l0005l4047nx3t1lc" && product.anio === 2018;
    if (enosh) {
      ["Una mesa al anochecer", "El ritual del servicio", "Una copa entre luz y piedra", "Maridaje sugerido: res braseada con hongos"].forEach((caption, index) => {
        if (ambient[index]) ambient[index].caption = caption;
      });
      if (ambient[4]) {
        ambient[4].caption = "La contraetiqueta original";
        ambient[4].ambient = false;
      }
    }
    return <WineDetailPage wine={{
      name: product.nombre, title: tanya ? "Eliyah" : enosh ? "Enosh" : product.nombre,
      eyebrow: tanya ? "TANYA · ISRAEL · 2021" : enosh ? "BY TANYA · ISRAEL · 2018" : [product.categoria, product.anio].filter(Boolean).join(" · "),
      style: tanya ? "Cabernet Sauvignon · Reserve" : product.varietal ?? undefined,
      description: product.descripcion,
      commerce: { precioLista: product.precioLista, activo: product.activo },
      facts: [...additionalWineFacts(product.id, product.anio), ...details.map(([label, value]) => [String(label), String(value)])],
      photos: [...ambient, ...(front ? [{ url: front, caption: "La botella", ambient: false }] : [])],
      stories: [["En la copa", product.notas], ["En la mesa", product.maridaje]].flatMap(([title, text]) => text ? [{ title: title!, text }] : []),
    }} />;
  }
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
