"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function numeroOpcional(valor: FormDataEntryValue | null) {
  if (!valor || valor === "") return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

export async function siguienteFolio() {
  const pedidos = await prisma.pedido.findMany({ select: { folio: true } });
  let max = 0;
  for (const p of pedidos) {
    const m = /^P(\d+)$/i.exec(p.folio.trim());
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `P${String(max + 1).padStart(3, "0")}`;
}

export async function crearPedido(formData: FormData) {
  const proveedor = String(formData.get("proveedor") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "");
  const tipoCambio = numeroOpcional(formData.get("tipoCambio"));
  const logisticaUSD = numeroOpcional(formData.get("logisticaUSD"));
  const logisticaMXN = numeroOpcional(formData.get("logisticaMXN"));

  if (!fecha) {
    throw new Error("La fecha es obligatoria");
  }

  const folio = await siguienteFolio();

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

  revalidatePath("/pedidos");
  redirect(`/pedidos/${pedido.id}`);
}

export async function actualizarPedido(pedidoId: string, formData: FormData) {
  const proveedor = String(formData.get("proveedor") ?? "").trim();
  const tipoCambio = numeroOpcional(formData.get("tipoCambio"));
  const logisticaUSD = numeroOpcional(formData.get("logisticaUSD"));
  const logisticaMXN = numeroOpcional(formData.get("logisticaMXN"));

  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { proveedor: proveedor || null, tipoCambio, logisticaUSD, logisticaMXN },
  });

  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/stock");
  redirect(`/pedidos/${pedidoId}`);
}

export async function agregarLineaPedido(pedidoId: string, formData: FormData) {
  const productoId = String(formData.get("productoId") ?? "");
  const fecha = String(formData.get("fecha") ?? "");
  const cajasRecibidas = Number(formData.get("cajasRecibidas"));
  const costoPorCaja = Number(formData.get("costoPorCaja"));
  const piezasPorCajaForm = numeroOpcional(formData.get("piezasPorCaja"));

  if (!productoId || !fecha || !cajasRecibidas || !costoPorCaja) {
    throw new Error("Faltan datos para agregar el producto al pedido");
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
      piezasPorCaja: piezasPorCajaForm ?? producto.piezasPorCaja,
      costoPorCaja,
      recibida: false,
    },
  });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
  redirect(`/pedidos/${pedidoId}`);
}

export async function agregarAbonoPedido(pedidoId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const monto = Number(formData.get("monto"));
  const moneda = String(formData.get("moneda") ?? "USD") as "MXN" | "USD";
  const tipoCambio = numeroOpcional(formData.get("tipoCambio"));
  const cuenta = String(formData.get("cuenta") ?? "CUENTA") as "EFECTIVO" | "CUENTA";
  const origen = String(formData.get("origen") ?? "REINVERSION") as
    | "INYECCION_CAPITAL"
    | "REINVERSION";
  const socioIdRaw = String(formData.get("socioId") ?? "");
  const dividido = origen === "INYECCION_CAPITAL" && socioIdRaw === "";
  const socioId = origen === "INYECCION_CAPITAL" && socioIdRaw !== "" ? socioIdRaw : null;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !monto) {
    throw new Error("Faltan datos del abono");
  }

  await prisma.pago.create({
    data: {
      fecha: new Date(fecha),
      pedidoId,
      concepto: "Abono a proveedor",
      moneda,
      monto,
      tipoCambio,
      cuenta,
      origen,
      socioId,
      dividido,
      notas,
    },
  });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
  revalidatePath("/finanzas");
}

export async function actualizarLineaPedido(
  pedidoId: string,
  entradaLineaId: string,
  formData: FormData,
) {
  const fecha = String(formData.get("fecha") ?? "");
  const cajasRecibidas = Number(formData.get("cajasRecibidas"));
  const piezasPorCaja = Number(formData.get("piezasPorCaja"));
  const costoPorCaja = Number(formData.get("costoPorCaja"));

  if (!fecha || !cajasRecibidas || !piezasPorCaja || !costoPorCaja) {
    throw new Error("Faltan datos para editar el producto del pedido");
  }

  await prisma.entradaLinea.update({
    where: { id: entradaLineaId },
    data: { fecha: new Date(fecha), cajasRecibidas, piezasPorCaja, costoPorCaja },
  });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
  revalidatePath("/stock");
  revalidatePath("/");
}

export async function marcarLineaRecibida(pedidoId: string, entradaLineaId: string) {
  await prisma.entradaLinea.update({
    where: { id: entradaLineaId },
    data: { recibida: true },
  });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
  revalidatePath("/stock");
  revalidatePath("/");
}

export async function desmarcarLineaRecibida(pedidoId: string, entradaLineaId: string) {
  await prisma.entradaLinea.update({
    where: { id: entradaLineaId },
    data: { recibida: false },
  });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
  revalidatePath("/stock");
  revalidatePath("/");
}

export async function eliminarLineaPedido(pedidoId: string, entradaLineaId: string) {
  const linea = await prisma.entradaLinea.findUniqueOrThrow({
    where: { id: entradaLineaId },
  });
  if (linea.recibida) {
    throw new Error("No se puede quitar un producto que ya se marcó como recibido");
  }

  await prisma.entradaLinea.delete({ where: { id: entradaLineaId } });

  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath("/pedidos");
}
