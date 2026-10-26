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
import type { WinePhoto } from "../_components/WineHero";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/catalogo-publico/[id]">): Promise<Metadata> {
  const product = await getPublicWine((await params).id);
  if (!product) return { title: "Botella no encontrada", robots: { index: false } };
  const profile = wineProfile(product.id, product.anio, product.nombre, product.tipo);
  if (profile) return editorialMetadata(profile);
  const title = `${product.nombre}${product.anio ? ` · ${product.anio}` : ""}`;
  const noun = product.tipo === "DESTILADO" ? "destilado" : "vino";
  const description = product.descripcion?.slice(0, 180) ?? `${title}. Descubre la ficha y las fotografías de este ${noun}.`;
  return { title, description, openGraph: { title, description, type: "website", images: product.fotoUrl ? [{ url: product.fotoUrl, alt: title }] : [] } };
}

export default async function WinePage({ params }: PageProps<"/catalogo-publico/[id]">) {
  const product = await getPublicWine((await params).id);
  if (!product) notFound();
  const profile = wineProfile(product.id, product.anio, product.nombre, product.tipo);
  if (profile) return <EditorialWinePage wine={profile} commerce={{ precioLista: product.precioLista, activo: product.activo }} />;
  const spirit = product.tipo === "DESTILADO";
  const collectionHref = spirit ? "/catalogo-publico/destilados" : "/catalogo-publico/catalogo";
  const photos = [publicPhotograph(product.id, product.fotoUrl), ...product.imagenesExtra.map((p) => p.url)].filter((p): p is string => Boolean(p));
  const details = (spirit
    ? [["Año", product.anio], ["Región", product.region], ["Hecho de", product.varietal], ["Alcohol", product.alcohol != null ? `${product.alcohol}%` : null]]
    : [["Añada", product.anio], ["Región", product.region], ["Uva", product.varietal], ["Cuerpo", product.cuerpo], ["Alcohol", product.alcohol != null ? `${product.alcohol}%` : null]]
  ).filter(([, value]) => value != null && value !== "");
  const story = spirit
    ? [["El destilado", product.descripcion], ["Notas de cata", product.notas], ["Cómo tomarlo", product.maridaje]]
    : [["El vino", product.descripcion], ["Notas de cata", product.notas], ["En la mesa", product.maridaje]];
  if (!spirit && product.imagenesExtra.length) {
    // Extra images are the ambient gallery; the catalog packshot comes last.
    // Keep the source photograph in the CRM while displaying its studio replacement.
    const sourceRear = "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/7b4dd274-4997-4d2f-a810-a8b1ba0279a9.jpeg";
    let gallery = product.id === "cmtssyq4l0005l4047nx3t1lc" && product.imagenesExtra.length > 5
      ? product.imagenesExtra.filter((photo) => photo.url !== sourceRear)
      : product.imagenesExtra;
    // The service retake is uploaded after Dadah's original four scenes.
    // Keep the source in the CRM and substitute it in the public gallery.
    if (product.id === "cmtssyq3k0001l404n0341dmg" && product.anio === 2023 && gallery.length >= 5) {
      gallery = [gallery[0], gallery[4], gallery[2], gallery[3], ...gallery.slice(5)];
    }
    const ambient: WinePhoto[] = gallery.map((photo, index) => ({ url: photo.url, caption: `Ambientación ${index + 1}`, ambient: true }));
    // Approved Tanya opening scene: the sunset table is its last uploaded image.
    if (product.id === "cmtssyq4u0006l404sytto49b" && ambient.length === 4) ambient.unshift(ambient.pop()!);
    const front = publicPhotograph(product.id, product.fotoUrl);
    const tanya = product.id === "cmtssyq4u0006l404sytto49b" && product.anio === 2021;
    const enosh = product.id === "cmtssyq4l0005l4047nx3t1lc" && product.anio === 2018;
    const dadahBlend = product.id === "cmtssyq3k0001l404n0341dmg" && product.anio === 2023;
    const rear: WinePhoto[] = [];
    if (enosh) {
      ["Una mesa al anochecer", "El ritual del servicio", "Una copa entre luz y piedra", "Maridaje sugerido: res braseada con hongos"].forEach((caption, index) => {
        if (ambient[index]) ambient[index].caption = caption;
      });
      if (ambient[4]) {
        const back = ambient.splice(4, 1)[0];
        rear.push({ ...back, caption: "La contraetiqueta, sobre blanco", ambient: false });
      }
    }
    if (dadahBlend) {
      rear.push({ url: "/catalogo/dadah-blend-2023-back.webp", caption: "La contraetiqueta, sobre blanco", ambient: false });
      ["Una mesa entre viñedos", "El ritual del servicio", "Una copa entre luz y piedra", "Maridaje sugerido: cordero y berenjena"].forEach((caption, index) => {
        if (ambient[index]) ambient[index].caption = caption;
      });
    }
    return <WineDetailPage wine={{
      name: product.nombre, title: tanya ? "Eliyah" : enosh ? "Enosh" : dadahBlend ? "Dadah" : product.nombre,
      eyebrow: tanya ? "TANYA · ISRAEL · 2021" : enosh ? "BY TANYA · ISRAEL · 2018" : dadahBlend ? "CARMELO · ISRAEL · 2023" : [product.categoria, product.anio].filter(Boolean).join(" · "),
      style: tanya ? "Cabernet Sauvignon · Reserve" : dadahBlend ? "Malbec–Barbera" : product.varietal ?? undefined,
      description: product.descripcion,
      commerce: { precioLista: product.precioLista, activo: product.activo },
      facts: [...additionalWineFacts(product.id, product.anio), ...details.map(([label, value]) => [String(label), String(value)])],
      photos: [...ambient, ...(front ? [{ url: front, caption: "La botella", ambient: false }] : []), ...rear],
      stories: [["En la copa", product.notas], ["En la mesa", product.maridaje]].flatMap(([title, text]) => text ? [{ title: title!, text }] : []),
    }} />;
  }
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
