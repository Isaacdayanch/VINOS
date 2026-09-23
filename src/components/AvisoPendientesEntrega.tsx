import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function AvisoPendientesEntrega() {
  const pendientes = await prisma.ordenLinea.findMany({
    where: { entregado: false },
    include: { producto: true },
  });

  if (pendientes.length === 0) return null;

  const botellas = pendientes.reduce((acc, l) => acc + l.cantidadBotellas, 0);
  const nombres = [...new Set(pendientes.map((l) => l.producto.nombre))].slice(0, 3).join(", ");

  return (
    <Link
      href="/ordenes/pendientes-entrega"
      className="block bg-warn-bg text-warn text-sm px-4 py-2 hover:opacity-90 transition-opacity"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <span className="truncate">
          📦 Tienes {botellas} botella{botellas === 1 ? "" : "s"} pendiente
          {botellas === 1 ? "" : "s"} de entregar ({nombres}
          {pendientes.length > 3 ? "…" : ""})
        </span>
        <span className="whitespace-nowrap font-medium underline">Ver todas →</span>
      </div>
    </Link>
  );
}
