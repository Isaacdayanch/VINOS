"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function numeroOpcional(valor: FormDataEntryValue | null) {
  if (!valor || valor === "") return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

export async function crearPedido(formData: FormData) {
  const folio = String(formData.get("folio") ?? "").trim();
  const proveedor = String(formData.get("proveedor") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "");
  const tipoCambio = numeroOpcional(formData.get("tipoCambio"));
  const logisticaUSD = numeroOpcional(formData.get("logisticaUSD"));
  const logisticaMXN = numeroOpcional(formData.get("logisticaMXN"));

  if (!folio || !fecha) {
    throw new Error("El folio y la fecha son obligatorios");
  }

  const pedido = await prisma.pedido.create({
    data: {
      folio,
      proveedor: proveedor || null,
      fecha: new Date(fecha),
      tipoCambio,
      logisticaUSD,
      logisticaMXN,
    },
  });

  revalidatePath("/stock");
  redirect(`/stock/entradas/nueva?pedidoId=${pedido.id}`);
}

export async function crearEntrada(formData: FormData) {
  const pedidoId = String(formData.get("pedidoId") ?? "");
  const productoId = String(formData.get("productoId") ?? "");
  const fecha = String(formData.get("fecha") ?? "");
  const cajasRecibidas = Number(formData.get("cajasRecibidas"));
  const costoPorCaja = Number(formData.get("costoPorCaja"));

  if (!pedidoId || !productoId || !fecha || !cajasRecibidas || !costoPorCaja) {
    throw new Error("Faltan datos para registrar la entrada");
  }

  const producto = await prisma.producto.findUniqueOrThrow({
    where: { id: productoId },
  });

  await prisma.entradaLinea.create({
    data: {
      pedidoId,
      productoId,
      fecha: new Date(fecha),
      cajasRecibidas,
      piezasPorCaja: producto.piezasPorCaja,
      costoPorCaja,
    },
  });

  revalidatePath("/stock");
  redirect("/stock");
}
