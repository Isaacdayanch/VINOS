import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { Collection } from "../_components/Collection";
import { getPublication } from "../_lib/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Catálogo con precios",
  description: "Explora nuestra selección de vinos. Consulta precios en pesos mexicanos y filtra por tipo, añada y presupuesto.",
};

export default async function ShopCatalogPage() {
  const { wines, date } = await getPublication();
  return <>
    <Header />
    <main id="contenido">
      <Collection wines={wines} date={date?.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" }) ?? null} />
    </main>
  </>;
}
