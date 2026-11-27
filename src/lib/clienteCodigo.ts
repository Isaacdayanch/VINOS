import { prisma } from "@/lib/prisma";
import type { Cliente } from "@prisma/client";

const MAPA_ACENTOS: Record<string, string> = {
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U", Ñ: "N",
};

function quitarAcentos(texto: string) {
  return texto
    .toUpperCase()
    .split("")
    .map((c) => MAPA_ACENTOS[c] ?? c)
    .join("");
}

// Primer nombre del cliente, sin el prefijo "Cliente Especial - " que usan
// algunos clientes viejos, y solo con letras (para que el código salga limpio).
function primerNombre(nombre: string): string {
  const limpio = nombre.replace(/^Cliente Especial - /, "").trim();
  const primeraPalabra = limpio.split(/\s+/)[0] ?? limpio;
  return quitarAcentos(primeraPalabra).replace(/[^A-Z]/g, "");
}

/**
 * Código corto y memorable a partir del nombre del cliente (ej. "Daniel
 * Tuachi" -> "DAN"), para que el folio de sus órdenes se lea como "DAN-03"
 * en vez de un código al azar. Si ya existe ese código, prueba con más
 * letras del nombre y, si de plano se repite, le agrega un número.
 */
export async function siguienteCodigoCliente(nombre: string): Promise<string> {
  const base = primerNombre(nombre) || "CLI";
  for (let longitud = 3; longitud <= Math.max(base.length, 3); longitud++) {
    const candidato = base.slice(0, longitud) || base;
    const existe = await prisma.cliente.findFirst({ where: { codigo: candidato }, select: { id: true } });
    if (!existe) return candidato;
  }
  const raiz = base.slice(0, 3) || "CLI";
  for (let n = 2; n < 100; n++) {
    const candidato = `${raiz}${n}`;
    const existe = await prisma.cliente.findFirst({ where: { codigo: candidato }, select: { id: true } });
    if (!existe) return candidato;
  }
  throw new Error("No se pudo generar un código de cliente único");
}

// El formato viejo era "CLI-001"; si un cliente se quedó con ese estilo
// (de antes de este cambio), se le regenera al nuevo formato por nombre.
const CODIGO_VIEJO = /^CLI-\d+$/;

/** Le asigna código al cliente si todavía no tiene uno, o si tiene el formato viejo. */
export async function asegurarCodigoCliente(cliente: Cliente): Promise<string> {
  if (cliente.codigo && !CODIGO_VIEJO.test(cliente.codigo)) return cliente.codigo;
  const codigo = await siguienteCodigoCliente(cliente.nombre);
  await prisma.cliente.update({ where: { id: cliente.id }, data: { codigo } });
  return codigo;
}
