import "server-only";
import { CLAVES, leerConfiguracion } from "@/lib/tienda";
import { generarPdfPedido, type PedidoParaPdf } from "@/lib/pedido-pdf";

/**
 * Correo "Vendiste" con el PDF del pedido, por Resend (https://resend.com).
 * Variables en Vercel: RESEND_API_KEY y, opcional, CORREO_REMITENTE
 * (ej. "Cava 18 <pedidos@lacava18.com>"; sin dominio verificado en Resend
 * solo se puede mandar desde onboarding@resend.dev al correo de la cuenta).
 * Los destinatarios se administran en el CRM → Tienda en línea.
 */
export function correoConfigurado(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const escapar = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] ?? c));

export function destinatariosCorreo(config: Record<string, string>): string[] {
  return [...new Set((config[CLAVES.correoDestinatarios] ?? "").split(/[\s,;]+/).map((c) => c.trim().toLowerCase()).filter((c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)))];
}

function cuerpoHtml(pedido: PedidoParaPdf & { id: string }, urlCrm: string | null): string {
  const filas = pedido.lineas.map((l) => `<tr><td style="padding:6px 0;border-bottom:1px solid #e6dfd3">${l.cantidadBotellas} × ${escapar(l.nombreProducto)}</td><td style="padding:6px 0;border-bottom:1px solid #e6dfd3;text-align:right;white-space:nowrap">${pesos.format(l.cantidadBotellas * l.precioUnitario)}</td></tr>`).join("");
  const direccion = [pedido.calle, pedido.colonia, `CP ${pedido.codigoPostal}`, pedido.ciudad].filter(Boolean).join(", ");
  return `<div style="font-family:Helvetica,Arial,sans-serif;color:#272521;max-width:560px;margin:0 auto;padding:24px">
  <p style="font-size:11px;letter-spacing:.18em;color:#655e55;margin:0 0 6px">CAVA 18 · PEDIDO EN LÍNEA</p>
  <h1 style="font-family:Georgia,serif;font-weight:400;font-size:30px;margin:0 0 18px;color:#651b32">Vendiste ${pesos.format(pedido.total)}</h1>
  <p style="margin:0 0 4px;font-size:15px"><strong>${escapar(pedido.nombre)}</strong> · WhatsApp <a href="https://wa.me/52${pedido.telefono.replace(/\D/g, "").slice(-10)}" style="color:#651b32">${escapar(pedido.telefono)}</a></p>
  <p style="margin:0 0 4px;font-size:14px;color:#655e55">${escapar(direccion)}${pedido.zona ? ` · ${escapar(pedido.zona.nombre)}` : ""}</p>
  ${pedido.referencias ? `<p style="margin:0 0 4px;font-size:13px;color:#655e55">Referencias: ${escapar(pedido.referencias)}</p>` : ""}
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:18px 0 8px">${filas}
    <tr><td style="padding:6px 0;color:#655e55">Envío</td><td style="padding:6px 0;text-align:right">${pedido.envio ? pesos.format(pedido.envio) : "Gratis"}</td></tr>
    <tr><td style="padding:8px 0;font-size:17px"><strong>Total</strong></td><td style="padding:8px 0;text-align:right;font-size:17px"><strong>${pesos.format(pedido.total)}</strong></td></tr>
  </table>
  ${pedido.notas ? `<p style="font-size:13px;background:#fdf3dc;padding:10px 12px;border-radius:6px">💬 ${escapar(pedido.notas)}</p>` : ""}
  <p style="font-size:13px;color:#655e55">Pedido <strong>${escapar(pedido.folio)}</strong> · ${pedido.fecha.toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "long", timeStyle: "short" })}. El PDF va adjunto.</p>
  ${urlCrm ? `<p style="margin-top:22px"><a href="${urlCrm}/pedidos-web/${pedido.id}" style="display:inline-block;background:#651b32;color:#fff;text-decoration:none;padding:12px 22px;border-radius:30px;font-size:14px">Abrir en el CRM</a></p>` : ""}
</div>`;
}

export type ResultadoCorreo = { enviado: boolean; detalle: string };

/** Manda el correo a todos los destinatarios configurados. No truena: devuelve qué pasó. */
export async function enviarCorreoVenta(pedido: PedidoParaPdf & { id: string }): Promise<ResultadoCorreo> {
  if (!correoConfigurado()) return { enviado: false, detalle: "Correo todavía no conectado (falta RESEND_API_KEY)." };
  const destinatarios = destinatariosCorreo(await leerConfiguracion());
  if (!destinatarios.length) return { enviado: false, detalle: "No hay correos a los que avisar." };
  try {
    const pdf = await generarPdfPedido(pedido);
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CORREO_REMITENTE || "Cava 18 <onboarding@resend.dev>",
        to: destinatarios,
        subject: `Vendiste ${pesos.format(pedido.total)} · ${pedido.nombre} · ${pedido.folio}`,
        html: cuerpoHtml(pedido, process.env.URL_CRM ?? null),
        attachments: [{ filename: `Pedido-${pedido.folio}.pdf`, content: Buffer.from(pdf).toString("base64") }],
      }),
    });
    if (!respuesta.ok) return { enviado: false, detalle: `Correo: Resend ${respuesta.status}: ${(await respuesta.text()).slice(0, 200)}` };
    return { enviado: true, detalle: `Correo enviado a ${destinatarios.join(", ")}` };
  } catch (error) {
    return { enviado: false, detalle: `Correo: ${error instanceof Error ? error.message : String(error)}` };
  }
}
