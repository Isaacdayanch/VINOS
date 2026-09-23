import { prisma } from "@/lib/prisma";
import type { Cliente } from "@prisma/client";

export async function siguienteCodigoCliente(): Promise<string> {
  const clientes = await prisma.cliente.findMany({
    where: { codigo: { not: null } },
    select: { codigo: true },
  });
  let maxNumero = 0;
  for (const c of clientes) {
    const match = c.codigo?.match(/CLI-(\d+)/);
    if (match) maxNumero = Math.max(maxNumero, parseInt(match[1], 10));
  }
  return `CLI-${String(maxNumero + 1).padStart(3, "0")}`;
}

/** Le asigna código al cliente si todavía no tiene (clientes creados antes de este cambio). */
export async function asegurarCodigoCliente(cliente: Cliente): Promise<string> {
  if (cliente.codigo) return cliente.codigo;
  const codigo = await siguienteCodigoCliente();
  await prisma.cliente.update({ where: { id: cliente.id }, data: { codigo } });
  return codigo;
}
