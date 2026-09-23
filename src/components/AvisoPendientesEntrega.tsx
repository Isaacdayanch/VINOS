import { prisma } from "@/lib/prisma";
import { calcularResumenInventario } from "@/lib/costeo";
import Link from "next/link";

export async function AvisoPendientesEntrega() {
  const [pendientes, resumen] = await Promise.all([
    prisma.ordenLinea.findMany({
      where: { entregado: false },
      include: { producto: true },
    }),
    calcularResumenInventario(),
  ]);

  // Solo avisa de lo que YA se puede entregar (ya llegó suficiente stock) —
  // lo que sigue sin llegar no necesita estar molestando arriba todavía.
  const listas = pendientes.filter(
    (l) => (resumen.get(l.productoId)?.stockActual ?? 0) >= l.cantidadBotellas,
  );

  if (listas.length === 0) return null;

  const botellas = listas.reduce((acc, l) => acc + l.cantidadBotellas, 0);
  const nombres = [...new Set(listas.map((l) => l.producto.nombre))].slice(0, 3).join(", ");

  return (
    <Link
      href="/ordenes/pendientes-entrega"
      className="rounded-lg border border-warn/40 bg-warn-bg text-warn text-sm px-4 py-3 flex items-center justify-between gap-3 hover:opacity-90 transition-opacity"
    >
      <span className="truncate">
        ✅ Ya te llegó mercancía que le debes a un cliente: {botellas} botella
        {botellas === 1 ? "" : "s"} ({nombres}
        {listas.length > 3 ? "…" : ""})
      </span>
      <span className="whitespace-nowrap font-medium underline">Ver y entregar →</span>
    </Link>
  );
}
