import { prisma } from "@/lib/prisma";

// Variantes del mismo proveedor que Isaac ya confirmó que son uno solo, para
// que no cuenten como proveedores distintos por una diferencia de captura.
const SINONIMOS_PROVEEDOR: Record<string, string> = {
  "rashbi wine corp": "Rashbi Wines Corp",
  "rashbi wines corp": "Rashbi Wines Corp",
};

/** Corrige variantes conocidas del mismo proveedor antes de guardarlas. */
export function normalizarProveedor(texto: string): string {
  const limpio = texto.trim();
  if (!limpio) return limpio;
  return SINONIMOS_PROVEEDOR[limpio.toLowerCase()] ?? limpio;
}

/** Proveedores ya usados antes, para sugerirlos al capturar uno nuevo. */
export async function proveedoresConocidos(): Promise<string[]> {
  const pedidos = await prisma.pedido.findMany({
    where: { proveedor: { not: null } },
    select: { proveedor: true },
  });
  const nombres = new Set(
    pedidos.flatMap((p) => (p.proveedor ? [normalizarProveedor(p.proveedor)] : [])),
  );
  return [...nombres].sort((a, b) => a.localeCompare(b, "es"));
}
