import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

/** PDF de un pedido en línea, para el correo "Vendiste" y para descargarlo desde el CRM. */
export type PedidoParaPdf = {
  folio: string; fecha: Date; nombre: string; telefono: string; email: string | null;
  calle: string; colonia: string | null; codigoPostal: string; ciudad: string | null; referencias: string | null; notas: string | null;
  botellas: number; subtotal: number; envio: number; total: number;
  zona?: { nombre: string } | null;
  lineas: { nombreProducto: string; cantidadBotellas: number; precioUnitario: number }[];
};

const BORDO = rgb(0.396, 0.106, 0.196);
const TINTA = rgb(0.153, 0.145, 0.129);
const GRIS = rgb(0.42, 0.39, 0.35);
const LINEA = rgb(0.84, 0.8, 0.74);
const CREMA = rgb(0.965, 0.949, 0.922);
const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

// Las fuentes estándar del PDF solo saben WinAnsi: se quitan emojis y símbolos raros.
const limpio = (texto: string) => texto.normalize("NFC").replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•…]/g, "");

async function logo(): Promise<Uint8Array | null> {
  try { return new Uint8Array(await readFile(path.join(process.cwd(), "public", "catalogo", "logo-cava18-completo.png"))); } catch {}
  const base = process.env.URL_CATALOGO_PUBLICO?.replace(/\/+$/, "");
  if (!base) return null;
  try {
    const respuesta = await fetch(`${base}/catalogo/logo-cava18-completo.png`);
    return respuesta.ok ? new Uint8Array(await respuesta.arrayBuffer()) : null;
  } catch { return null; }
}

function envolver(texto: string, font: PDFFont, size: number, ancho: number): string[] {
  const lineas: string[] = [];
  for (const parrafo of texto.split(/\r?\n/)) {
    let actual = "";
    for (const palabra of parrafo.split(/\s+/)) {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (font.widthOfTextAtSize(prueba, size) <= ancho || !actual) actual = prueba;
      else { lineas.push(actual); actual = palabra; }
    }
    lineas.push(actual);
  }
  return lineas;
}

export async function generarPdfPedido(pedido: PedidoParaPdf): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Pedido ${pedido.folio} · Cava 18`);
  const page = doc.addPage([595.28, 841.89]); // carta A4 vertical
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margen = 56;
  const ancho = page.getWidth() - margen * 2;
  let y = page.getHeight() - margen;

  const texto = (t: string, x: number, size: number, opciones: { font?: PDFFont; color?: ReturnType<typeof rgb>; derecha?: boolean } = {}) => {
    const font = opciones.font ?? sans;
    const limpioT = limpio(t);
    const px = opciones.derecha ? x - font.widthOfTextAtSize(limpioT, size) : x;
    page.drawText(limpioT, { x: px, y, size, font, color: opciones.color ?? TINTA });
  };
  const parrafo = (t: string, size: number, color = TINTA, font = sans) => {
    for (const linea of envolver(limpio(t), font, size, ancho)) { texto(linea, margen, size, { font, color }); y -= size * 1.5; }
  };
  const regla = (p: PDFPage) => { p.drawLine({ start: { x: margen, y }, end: { x: margen + ancho, y }, thickness: 0.6, color: LINEA }); };

  // Encabezado: logo o nombre
  const imagen = await logo();
  if (imagen) {
    const png = await doc.embedPng(imagen);
    const w = 190; const h = (png.height / png.width) * w;
    page.drawImage(png, { x: margen, y: y - h, width: w, height: h });
    y -= h + 10;
  } else {
    texto("Cava 18", margen, 30, { font: serif, color: BORDO }); y -= 36;
  }
  texto("PEDIDO EN LÍNEA", margen, 9, { color: GRIS });
  texto(pedido.folio, margen + ancho, 26, { font: serif, color: BORDO, derecha: true });
  y -= 16;
  texto(pedido.fecha.toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "long", timeStyle: "short" }), margen + ancho, 9, { color: GRIS, derecha: true });
  y -= 22; regla(page); y -= 26;

  // Cliente y entrega en dos columnas
  const col2 = margen + ancho / 2 + 10;
  const yCol = y;
  texto("CLIENTE", margen, 8, { color: GRIS }); y -= 16;
  texto(pedido.nombre, margen, 13, { font: sansBold }); y -= 17;
  texto(`WhatsApp ${pedido.telefono}`, margen, 10); y -= 14;
  if (pedido.email) { texto(pedido.email, margen, 10, { color: GRIS }); y -= 14; }
  const yFin1 = y;
  y = yCol;
  texto("ENTREGA", col2, 8, { color: GRIS }); y -= 16;
  const direccion = [pedido.calle, pedido.colonia, `CP ${pedido.codigoPostal}`, pedido.ciudad].filter(Boolean).join(", ");
  for (const linea of envolver(limpio(direccion), sans, 10, ancho / 2 - 10)) { texto(linea, col2, 10); y -= 14; }
  if (pedido.zona) { texto(pedido.zona.nombre, col2, 9, { color: GRIS }); y -= 14; }
  if (pedido.referencias) for (const linea of envolver(limpio(`Referencias: ${pedido.referencias}`), sans, 9, ancho / 2 - 10)) { texto(linea, col2, 9, { color: GRIS }); y -= 13; }
  y = Math.min(y, yFin1) - 24;

  // Tabla de botellas
  page.drawRectangle({ x: margen, y: y - 8, width: ancho, height: 22, color: CREMA });
  texto("BOTELLA", margen + 10, 8, { color: GRIS });
  texto("CANT.", margen + ancho - 150, 8, { color: GRIS, derecha: true });
  texto("PRECIO", margen + ancho - 80, 8, { color: GRIS, derecha: true });
  texto("IMPORTE", margen + ancho - 10, 8, { color: GRIS, derecha: true });
  y -= 28;
  for (const linea of pedido.lineas) {
    const nombre = envolver(limpio(linea.nombreProducto), serif, 12, ancho - 230);
    texto(nombre[0], margen + 10, 12, { font: serif });
    texto(String(linea.cantidadBotellas), margen + ancho - 150, 10, { derecha: true });
    texto(pesos.format(linea.precioUnitario), margen + ancho - 80, 10, { derecha: true });
    texto(pesos.format(linea.precioUnitario * linea.cantidadBotellas), margen + ancho - 10, 10, { font: sansBold, derecha: true });
    y -= 16;
    for (const resto of nombre.slice(1)) { texto(resto, margen + 10, 12, { font: serif }); y -= 16; }
    y -= 4; regla(page); y -= 16;
  }

  // Totales
  y -= 4;
  const total = (etiqueta: string, valor: string, grande = false) => {
    texto(etiqueta, margen + ancho - 130, grande ? 12 : 10, { color: grande ? TINTA : GRIS, derecha: true });
    texto(valor, margen + ancho - 10, grande ? 15 : 10, { font: grande ? sansBold : sans, derecha: true, color: grande ? BORDO : TINTA });
    y -= grande ? 24 : 16;
  };
  total(`${pedido.botellas} botella${pedido.botellas === 1 ? "" : "s"}`, pesos.format(pedido.subtotal));
  total("Envío a domicilio", pedido.envio ? pesos.format(pedido.envio) : "Gratis");
  total("Total", pesos.format(pedido.total), true);

  if (pedido.notas) {
    y -= 10; texto("COMENTARIOS DEL CLIENTE", margen, 8, { color: GRIS }); y -= 15;
    parrafo(pedido.notas, 10, TINTA, serif);
  }

  // Pie
  y = margen + 30; regla(page); y -= 16;
  texto("Pago por transferencia o al recibir. Confirmación por WhatsApp.", margen, 8, { color: GRIS });
  texto("lacava18.com", margen + ancho, 8, { color: GRIS, derecha: true });

  return doc.save();
}
