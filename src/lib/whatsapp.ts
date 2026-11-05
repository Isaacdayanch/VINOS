import "server-only";
import { prisma } from "@/lib/prisma";
import { CLAVES, leerConfiguracion, telefonoLimpio } from "@/lib/tienda";

/**
 * Aviso de pedido nuevo por WhatsApp (Twilio). Se manda a cada teléfono de la lista
 * `whatsapp.destinatarios` (se administra en el CRM → Tienda en línea).
 *
 * Variables de entorno en Vercel: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 * TWILIO_WHATSAPP_FROM (ej. "whatsapp:+14155238886") y, cuando la plantilla esté
 * aprobada por Meta, TWILIO_CONTENT_SID (las variables {{1}} folio y {{2}} resumen).
 * Mientras no estén puestas, no manda nada y el pedido se guarda igual.
 */
export function whatsappConfigurado(): boolean {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
}

type Linea = { nombreProducto: string; cantidadBotellas: number; precioUnitario: number };
type Pedido = { id: string; folio: string; nombre: string; telefono: string; calle: string; colonia: string | null; codigoPostal: string; ciudad: string | null; referencias: string | null; notas: string | null; botellas: number; envio: number; total: number; lineas: Linea[] };

const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export function textoAvisoPedido(pedido: Pedido, urlCrm: string | null): string {
  const lineas = pedido.lineas.map((l) => `• ${l.cantidadBotellas} × ${l.nombreProducto} (${pesos.format(l.precioUnitario)})`).join("\n");
  const direccion = [pedido.calle, pedido.colonia, `CP ${pedido.codigoPostal}`, pedido.ciudad].filter(Boolean).join(", ");
  return [
    `🍷 *Nuevo pedido ${pedido.folio}* · Cava 18`,
    ``,
    `*${pedido.nombre}* · ${pedido.telefono}`,
    direccion,
    pedido.referencias ? `Referencias: ${pedido.referencias}` : null,
    ``,
    lineas,
    ``,
    `${pedido.botellas} botella${pedido.botellas === 1 ? "" : "s"} · Envío ${pedido.envio ? pesos.format(pedido.envio) : "gratis"} · *Total ${pesos.format(pedido.total)}*`,
    pedido.notas ? `Nota del cliente: ${pedido.notas}` : null,
    urlCrm ? `Ver en el CRM: ${urlCrm}/pedidos-web/${pedido.id}` : null,
  ].filter((parte) => parte !== null).join("\n");
}

async function enviarWhatsApp(destino: string, cuerpo: string, variables: Record<string, string>) {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const params = new URLSearchParams({ From: process.env.TWILIO_WHATSAPP_FROM!, To: `whatsapp:+52${destino}` });
  if (process.env.TWILIO_CONTENT_SID) {
    params.set("ContentSid", process.env.TWILIO_CONTENT_SID);
    params.set("ContentVariables", JSON.stringify(variables));
  } else {
    params.set("Body", cuerpo);
  }
  const respuesta = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!respuesta.ok) throw new Error(`Twilio ${respuesta.status}: ${(await respuesta.text()).slice(0, 300)}`);
}

/** Manda el aviso a todos los destinatarios y deja constancia en el pedido. Nunca truena: el pedido ya está guardado. */
export async function avisarPedidoWeb(pedido: Pedido) {
  const config = await leerConfiguracion();
  const destinatarios = (config[CLAVES.whatsappDestinatarios] ?? "").split(/[\s,;]+/).map(telefonoLimpio).filter((t) => t.length === 10);
  if (!whatsappConfigurado() || destinatarios.length === 0) {
    await prisma.pedidoWeb.update({ where: { id: pedido.id }, data: { avisoError: !whatsappConfigurado() ? "WhatsApp todavía no está conectado (faltan las llaves de Twilio)." : "No hay teléfonos a los que avisar." } });
    return;
  }
  const cuerpo = textoAvisoPedido(pedido, process.env.URL_CRM ?? null);
  const resumen = `${pedido.nombre} · ${pedido.botellas} botella${pedido.botellas === 1 ? "" : "s"} · ${pesos.format(pedido.total)}`;
  const errores: string[] = [];
  for (const destino of destinatarios) {
    try { await enviarWhatsApp(destino, cuerpo, { "1": pedido.folio, "2": resumen }); } catch (error) { errores.push(`${destino}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  await prisma.pedidoWeb.update({ where: { id: pedido.id }, data: { avisoWhatsApp: errores.length < destinatarios.length ? new Date() : null, avisoError: errores.length ? errores.join(" | ").slice(0, 900) : null } });
}
