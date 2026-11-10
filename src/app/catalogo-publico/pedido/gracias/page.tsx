import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Header } from "../../_components/Header";
import styles from "../../catalog.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pedido recibido", robots: { index: false, follow: false } };

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export default async function GraciasPage({ searchParams }: PageProps<"/catalogo-publico/pedido/gracias">) {
  const { folio } = await searchParams;
  const pedido = typeof folio === "string" ? await prisma.pedidoWeb.findUnique({ where: { folio }, include: { lineas: true } }) : null;
  const telefono = pedido ? `••• ••• ${pedido.telefono.slice(-4)}` : null;
  return <div className={`${styles.shopPage} ${styles.creamShop}`}>
    <Header />
    <main id="contenido" className={styles.thanksPage}>
      <p className={styles.eyebrow}>PEDIDO RECIBIDO</p>
      <h1>Gracias,<br />{pedido ? pedido.nombre.split(" ")[0] : "ya casi"}.</h1>
      {pedido ? <>
        <p className={styles.thanksLead}>Tu pedido <strong>{pedido.folio}</strong> ya está con nosotros. En breve te escribimos al WhatsApp terminado en {telefono} para confirmar la entrega y la forma de pago.</p>
        <ul className={styles.thanksList}>
          {pedido.lineas.map(linea => <li key={linea.id}><span>{linea.cantidadBotellas} × {linea.nombreProducto}</span><span>{money.format(linea.cantidadBotellas * linea.precioUnitario)}</span></li>)}
          <li><span>Envío</span><span>{pedido.envio ? money.format(pedido.envio) : "Gratis"}</span></li>
          <li className={styles.thanksTotal}><span>Total</span><span>{money.format(pedido.total)}</span></li>
        </ul>
      </> : <p className={styles.thanksLead}>Recibimos tu pedido. En breve te escribimos por WhatsApp para confirmarlo.</p>}
      <Link href="/catalogo-publico/catalogo" className={styles.darkPill}>Seguir descubriendo</Link>
    </main>
  </div>;
}
