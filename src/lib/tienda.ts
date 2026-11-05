import "server-only";
import { prisma } from "@/lib/prisma";

/** Ajustes de la tienda en línea guardados en ConfiguracionTienda (llave → valor). */
export const CLAVES = {
  anuncioActivo: "anuncio.activo", // "1" / "0"
  anuncioTitulo: "anuncio.titulo",
  anuncioTexto: "anuncio.texto",
  anuncioHasta: "anuncio.hasta", // YYYY-MM-DD, último día en que se muestra
  pedidosAbiertos: "pedidos.abiertos", // "1" / "0" — apaga el carrito sin tocar código
  whatsappDestinatarios: "whatsapp.destinatarios", // teléfonos separados por coma
} as const;

export async function leerConfiguracion(): Promise<Record<string, string>> {
  const filas = await prisma.configuracionTienda.findMany();
  return Object.fromEntries(filas.map((fila) => [fila.clave, fila.valor]));
}

export async function guardarConfiguracion(valores: Record<string, string>) {
  await prisma.$transaction(
    Object.entries(valores).map(([clave, valor]) =>
      prisma.configuracionTienda.upsert({ where: { clave }, create: { clave, valor }, update: { valor } }),
    ),
  );
}

/** Fecha de hoy en la Ciudad de México como YYYY-MM-DD (el servidor corre en UTC). */
export function hoyMexico(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export type Anuncio = { titulo: string; texto: string; hasta: string | null };

/** El anuncio de arriba de la página, solo si está prendido y no ha pasado su fecha. */
export function anuncioVigente(config: Record<string, string>): Anuncio | null {
  if (config[CLAVES.anuncioActivo] !== "1") return null;
  const texto = (config[CLAVES.anuncioTexto] ?? "").trim();
  if (!texto) return null;
  const hasta = (config[CLAVES.anuncioHasta] ?? "").trim() || null;
  if (hasta && hasta < hoyMexico()) return null;
  return { titulo: (config[CLAVES.anuncioTitulo] ?? "").trim(), texto, hasta };
}

export function pedidosAbiertos(config: Record<string, string>): boolean {
  return (config[CLAVES.pedidosAbiertos] ?? "1") !== "0";
}

export type Cotizacion =
  | { ok: true; zonaId: string; zona: string; envio: number; gratisDesde: number | null; botellasParaGratis: number }
  | { ok: false; motivo: string };

/** Zonas con sus inicios de código postal ya separados. */
export async function zonasEntrega() {
  const zonas = await prisma.zonaEntrega.findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }] });
  return zonas.map((zona) => ({ ...zona, prefijos: zona.codigosPostales.split(/[\s,;]+/).filter(Boolean) }));
}

/** Cuánto cuesta el envío a un código postal para cierto número de botellas. */
export async function cotizarEnvio(codigoPostal: string, botellas: number): Promise<Cotizacion> {
  const cp = codigoPostal.replace(/\D/g, "");
  if (cp.length !== 5) return { ok: false, motivo: "Escribe los 5 dígitos de tu código postal." };
  const zonas = await zonasEntrega();
  const zona = zonas.find((z) => z.activa && z.prefijos.some((prefijo) => cp.startsWith(prefijo)));
  if (!zona) {
    const apagada = zonas.find((z) => !z.activa && z.prefijos.some((prefijo) => cp.startsWith(prefijo)));
    return { ok: false, motivo: apagada ? `Por ahora no tenemos entregas en ${apagada.nombre}. Escríbenos y te avisamos cuando abramos fechas.` : "Todavía no llegamos a tu zona. Escríbenos y buscamos la manera." };
  }
  const gratis = zona.botellasEnvioGratis !== null && botellas >= zona.botellasEnvioGratis;
  return { ok: true, zonaId: zona.id, zona: zona.nombre, envio: gratis ? 0 : zona.costoEnvio, gratisDesde: zona.botellasEnvioGratis, botellasParaGratis: zona.botellasEnvioGratis ? Math.max(0, zona.botellasEnvioGratis - botellas) : 0 };
}

/** Teléfono mexicano a 10 dígitos (quita +52, espacios, guiones). */
export function telefonoLimpio(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length > 10 ? digitos.slice(-10) : digitos;
}
