import { prisma } from "@/lib/prisma";
import Link from "next/link";

/** Franja en el Dashboard y en Órdenes cuando hay pedidos de la página sin atender. */
export async function AvisoPedidosWeb() {
  const nuevos = await prisma.pedidoWeb.count({ where: { estatus: "Nuevo" } });
  if (nuevos === 0) return null;
  return (
    <Link
      href="/pedidos-web?estatus=Nuevo"
      className="rounded-lg border border-wine/30 bg-wine-light text-wine text-sm px-4 py-3 flex items-center justify-between gap-3 hover:opacity-90 transition-opacity"
    >
      <span>🛒 Tienes {nuevos} pedido{nuevos === 1 ? "" : "s"} nuevo{nuevos === 1 ? "" : "s"} desde la página</span>
      <span className="whitespace-nowrap font-medium underline">Ver →</span>
    </Link>
  );
}
