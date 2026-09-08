"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario } from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function siguienteFolio() {
  const ordenes = await prisma.orden.findMany({ select: { folio: true } });
  let maxNumero = 0;
  for (const o of ordenes) {
    const match = o.folio.match(/ORD-(\d+)/);
    if (match) maxNumero = Math.max(maxNumero, parseInt(match[1], 10));
  }
  return `ORD-${String(maxNumero + 1).padStart(3, "0")}`;
}

type LineaForm = { productoId: string; cantidadBotellas: number; precioUnitario: number };

export async function crearOrden(formData: FormData) {
  const clienteId = String(formData.get("clienteId") ?? "");
  const fecha = String(formData.get("fecha") ?? "");
  const lineasJson = String(formData.get("lineas") ?? "[]");

  if (!clienteId || !fecha) {
    throw new Error("Faltan datos de la orden");
  }

  const lineas: LineaForm[] = JSON.parse(lineasJson).filter(
    (l: LineaForm) => l.productoId && l.cantidadBotellas > 0,
  );

  if (lineas.length === 0) {
    throw new Error("Agrega al menos un vino a la orden");
  }

  const resumen = await calcularResumenInventario();
  const folio = await siguienteFolio();

  const orden = await prisma.orden.create({
    data: {
      folio,
      fecha: new Date(fecha),
      clienteId,
      estatus: "Surtida - pendiente de pago",
    },
  });

  for (const l of lineas) {
    const costoUnitario = resumen.get(l.productoId)?.costoPromedioPorBotella ?? 0;

    await prisma.ordenLinea.create({
      data: {
        ordenId: orden.id,
        productoId: l.productoId,
        cantidadBotellas: l.cantidadBotellas,
        precioUnitario: l.precioUnitario,
        costoUnitario,
      },
    });

    await prisma.salida.create({
      data: {
        fecha: new Date(fecha),
        productoId: l.productoId,
        botellas: l.cantidadBotellas,
        motivo: "Venta",
        ordenId: orden.id,
      },
    });

    await prisma.precioClienteProducto.upsert({
      where: { clienteId_productoId: { clienteId, productoId: l.productoId } },
      create: { clienteId, productoId: l.productoId, precio: l.precioUnitario },
      update: { precio: l.precioUnitario },
    });
  }

  revalidatePath("/ordenes");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect(`/ordenes/${orden.id}`);
}

export async function crearCobro(ordenId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const monto = Number(formData.get("monto"));
  const cuenta = String(formData.get("cuenta") ?? "EFECTIVO") as "EFECTIVO" | "CUENTA";
  const comisionPct = cuenta === "CUENTA" ? Number(formData.get("comisionPct") ?? 0) : 0;
  const metodoPago = String(formData.get("metodoPago") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !monto) {
    throw new Error("Faltan datos del cobro");
  }

  await prisma.cobro.create({
    data: { ordenId, fecha: new Date(fecha), monto, cuenta, comisionPct, metodoPago, notas },
  });

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/finanzas");
  revalidatePath("/");
}
