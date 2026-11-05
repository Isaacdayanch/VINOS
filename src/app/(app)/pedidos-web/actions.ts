"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, sincronizarActivoPorStockVarios } from "@/lib/costeo";
import { generarFolioAlAzar } from "@/lib/folio";
import { siguienteCodigoCliente } from "@/lib/clienteCodigo";
import { telefonoLimpio } from "@/lib/tienda";
import { avisarPedidoWeb } from "@/lib/whatsapp";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function refrescar(id: string) {
  revalidatePath("/pedidos-web");
  revalidatePath(`/pedidos-web/${id}`);
  revalidatePath("/");
}

/**
 * Acepta el pedido web: busca (o crea) al cliente por teléfono y crea la Orden
 * normal con sus líneas y salidas de stock, igual que una venta capturada a mano.
 * El envío se agrega como una línea más si se cobró.
 */
export async function confirmarPedidoWeb(pedidoId: string, formData: FormData) {
  const ubicacionId = String(formData.get("ubicacionId") ?? "").trim();
  const clienteElegido = String(formData.get("clienteId") ?? "").trim();
  if (!ubicacionId) throw new Error("Elige de qué bodega sale el pedido");

  const pedido = await prisma.pedidoWeb.findUnique({ where: { id: pedidoId }, include: { lineas: true } });
  if (!pedido) throw new Error("El pedido no existe");
  if (pedido.ordenId) redirect(`/ordenes/${pedido.ordenId}`);
  if (pedido.estatus === "Cancelado") throw new Error("Este pedido está cancelado");

  // Cliente: el que eligió Isaac, o el que ya tenga ese teléfono, o uno nuevo.
  let clienteId = clienteElegido;
  if (!clienteId) {
    const telefono = telefonoLimpio(pedido.telefono);
    const existentes = await prisma.cliente.findMany({ where: { telefono: { not: null } }, select: { id: true, telefono: true } });
    const mismo = existentes.find((c) => telefonoLimpio(c.telefono ?? "") === telefono);
    if (mismo) clienteId = mismo.id;
    else {
      const direccion = [pedido.calle, pedido.colonia, `CP ${pedido.codigoPostal}`, pedido.ciudad].filter(Boolean).join(", ");
      const nuevo = await prisma.cliente.create({
        data: { nombre: pedido.nombre, telefono: pedido.telefono, email: pedido.email, categoriaPrecio: "LISTA", codigo: await siguienteCodigoCliente(), notas: `Cliente de la página (pedido ${pedido.folio}). Dirección: ${direccion}${pedido.referencias ? `. Referencias: ${pedido.referencias}` : ""}` },
      });
      clienteId = nuevo.id;
    }
  }

  const resumen = await calcularResumenInventario();
  const folio = await generarFolioAlAzar("ORD", async (f) => (await prisma.orden.findUnique({ where: { folio: f }, select: { id: true } })) !== null);
  const fecha = new Date();

  const orden = await prisma.orden.create({ data: { folio, fecha, clienteId, ubicacionId, estatus: "Surtida - pendiente de pago" } });
  for (const linea of pedido.lineas) {
    const stock = resumen.get(linea.productoId)?.stockActual ?? 0;
    const entregado = stock >= linea.cantidadBotellas; // si no alcanza, queda pendiente de surtir como en una orden normal
    await prisma.ordenLinea.create({
      data: { ordenId: orden.id, productoId: linea.productoId, cantidadBotellas: linea.cantidadBotellas, precioUnitario: linea.precioUnitario, costoUnitario: resumen.get(linea.productoId)?.costoPromedioPorBotella ?? 0, entregado },
    });
    if (entregado) await prisma.salida.create({ data: { fecha, productoId: linea.productoId, botellas: linea.cantidadBotellas, motivo: "Venta", ordenId: orden.id, ubicacionId } });
    await prisma.precioClienteProducto.upsert({
      where: { clienteId_productoId: { clienteId, productoId: linea.productoId } },
      create: { clienteId, productoId: linea.productoId, precio: linea.precioUnitario },
      update: { precio: linea.precioUnitario },
    });
  }
  await sincronizarActivoPorStockVarios(pedido.lineas.map((l) => l.productoId));

  await prisma.pedidoWeb.update({ where: { id: pedidoId }, data: { estatus: "Confirmado", clienteId, ordenId: orden.id } });
  refrescar(pedidoId);
  revalidatePath("/ordenes");
  revalidatePath("/stock");
  redirect(`/ordenes/${orden.id}`);
}

export async function cancelarPedidoWeb(pedidoId: string) {
  const pedido = await prisma.pedidoWeb.findUnique({ where: { id: pedidoId }, select: { ordenId: true } });
  if (!pedido) throw new Error("El pedido no existe");
  if (pedido.ordenId) throw new Error("Este pedido ya se convirtió en orden; cancela la orden desde Órdenes");
  await prisma.pedidoWeb.update({ where: { id: pedidoId }, data: { estatus: "Cancelado" } });
  refrescar(pedidoId);
}

export async function reabrirPedidoWeb(pedidoId: string) {
  await prisma.pedidoWeb.update({ where: { id: pedidoId }, data: { estatus: "Nuevo" } });
  refrescar(pedidoId);
}

export async function marcarEntregadoPedidoWeb(pedidoId: string) {
  await prisma.pedidoWeb.update({ where: { id: pedidoId }, data: { estatus: "Entregado" } });
  refrescar(pedidoId);
}

/** Vuelve a intentar el aviso por WhatsApp (por si falló o se acaba de conectar Twilio). */
export async function reenviarAvisoPedidoWeb(pedidoId: string) {
  const pedido = await prisma.pedidoWeb.findUnique({ where: { id: pedidoId }, include: { lineas: true, zona: true } });
  if (!pedido) throw new Error("El pedido no existe");
  await avisarPedidoWeb(pedido);
  refrescar(pedidoId);
}
