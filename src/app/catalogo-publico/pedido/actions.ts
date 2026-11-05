"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generarFolioAlAzar } from "@/lib/folio";
import { cotizarEnvio, leerConfiguracion, pedidosAbiertos, telefonoLimpio, type Cotizacion } from "@/lib/tienda";
import { avisarPedidoWeb } from "@/lib/whatsapp";
import { getPublication } from "../_lib/catalog";

export async function cotizarEnvioAction(codigoPostal: string, botellas: number): Promise<Cotizacion> {
  return cotizarEnvio(String(codigoPostal ?? ""), Math.max(0, Math.floor(Number(botellas) || 0)));
}

export type DatosPedido = {
  items: { id: string; cantidad: number }[];
  nombre: string; telefono: string; email: string;
  calle: string; colonia: string; codigoPostal: string; ciudad: string; referencias: string; notas: string;
  sitio: string; // honeypot: a person leaves it empty
};

export type ResultadoPedido = { ok: true; folio: string } | { ok: false; error: string };

const texto = (valor: unknown, max: number) => String(valor ?? "").trim().slice(0, max);

export async function crearPedidoWeb(datos: DatosPedido): Promise<ResultadoPedido> {
  try {
    if (texto(datos.sitio, 50)) return { ok: true, folio: "W-GRACIAS" }; // bots fill the hidden field; say nothing
    if (!pedidosAbiertos(await leerConfiguracion())) return { ok: false, error: "Por el momento no estamos tomando pedidos en línea." };

    const nombre = texto(datos.nombre, 120);
    const telefono = telefonoLimpio(texto(datos.telefono, 30));
    const email = texto(datos.email, 160);
    const calle = texto(datos.calle, 200);
    const colonia = texto(datos.colonia, 120);
    const codigoPostal = texto(datos.codigoPostal, 10).replace(/\D/g, "");
    const ciudad = texto(datos.ciudad, 120);
    const referencias = texto(datos.referencias, 400);
    const notas = texto(datos.notas, 600);
    if (nombre.length < 2) return { ok: false, error: "Escribe tu nombre." };
    if (telefono.length !== 10) return { ok: false, error: "Escribe un teléfono de 10 dígitos (es donde te confirmamos por WhatsApp)." };
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Revisa tu correo." };
    if (calle.length < 4) return { ok: false, error: "Escribe tu calle y número." };

    // Only published, available bottles, at the published price. Quantities come from the basket; prices never do.
    const pedidos = new Map<string, number>();
    for (const item of Array.isArray(datos.items) ? datos.items : []) {
      const cantidad = Math.floor(Number(item?.cantidad));
      if (typeof item?.id === "string" && cantidad > 0) pedidos.set(item.id, Math.min(60, (pedidos.get(item.id) ?? 0) + cantidad));
    }
    if (!pedidos.size) return { ok: false, error: "Tu pedido está vacío." };
    const publicacion = await getPublication();
    const productos = await prisma.producto.findMany({ where: { id: { in: [...pedidos.keys()] } }, select: { id: true, nombre: true, activo: true } });
    const lineas: { productoId: string; nombreProducto: string; cantidadBotellas: number; precioUnitario: number }[] = [];
    for (const [id, cantidad] of pedidos) {
      const publicado = publicacion.wines.find(wine => wine.id === id);
      const producto = productos.find(p => p.id === id);
      if (!publicado || !producto || !producto.activo || publicado.precioLista === null) return { ok: false, error: `"${producto?.nombre ?? publicado?.nombre ?? "Una botella"}" ya no está disponible. Quítala de tu pedido para continuar.` };
      lineas.push({ productoId: id, nombreProducto: producto.nombre, cantidadBotellas: cantidad, precioUnitario: publicado.precioLista });
    }
    const botellas = lineas.reduce((sum, l) => sum + l.cantidadBotellas, 0);
    const subtotal = lineas.reduce((sum, l) => sum + l.cantidadBotellas * l.precioUnitario, 0);
    const cotizacion = await cotizarEnvio(codigoPostal, botellas);
    if (!cotizacion.ok) return { ok: false, error: cotizacion.motivo };

    const folio = await generarFolioAlAzar("W", async f => (await prisma.pedidoWeb.findUnique({ where: { folio: f }, select: { id: true } })) !== null);
    const pedido = await prisma.pedidoWeb.create({
      data: {
        folio, nombre, telefono, email: email || null, calle, colonia: colonia || null, codigoPostal, ciudad: ciudad || null,
        referencias: referencias || null, notas: notas || null, zonaId: cotizacion.zonaId,
        botellas, subtotal, envio: cotizacion.envio, total: subtotal + cotizacion.envio,
        lineas: { create: lineas },
      },
      include: { lineas: true },
    });
    await avisarPedidoWeb(pedido);
    revalidatePath("/pedidos-web");
    revalidatePath("/");
    return { ok: true, folio };
  } catch (error) {
    console.error("crearPedidoWeb", error);
    return { ok: false, error: "No pudimos guardar tu pedido. Inténtalo de nuevo en un momento." };
  }
}
