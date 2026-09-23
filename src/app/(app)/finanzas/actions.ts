"use server";

import { prisma } from "@/lib/prisma";
import {
  calcularResumenInventario,
  sincronizarActivoPorStock,
  sincronizarActivoPorStockVarios,
} from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function numeroOpcional(valor: FormDataEntryValue | null) {
  if (!valor || valor === "") return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

function datosPago(formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const pedidoId = String(formData.get("pedidoId") ?? "") || null;
  const concepto = String(formData.get("concepto") ?? "").trim();
  const moneda = String(formData.get("moneda") ?? "MXN") as "MXN" | "USD";
  const monto = Number(formData.get("monto"));
  const tipoCambio = numeroOpcional(formData.get("tipoCambio"));
  const cuenta = String(formData.get("cuenta") ?? "EFECTIVO") as "EFECTIVO" | "CUENTA";
  const origen = String(formData.get("origen") ?? "REINVERSION") as
    | "INYECCION_CAPITAL"
    | "REINVERSION";
  const metodoPago = String(formData.get("metodoPago") ?? "").trim() || null;
  const esMaaser = formData.get("esMaaser") === "on";
  const socioIdRaw = String(formData.get("socioId") ?? "");
  const dividido = origen === "INYECCION_CAPITAL" && socioIdRaw === "";
  const socioId = origen === "INYECCION_CAPITAL" && socioIdRaw !== "" ? socioIdRaw : null;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !concepto || !monto) {
    throw new Error("Faltan datos del pago");
  }

  return {
    fecha,
    pedidoId,
    concepto,
    moneda,
    monto,
    tipoCambio,
    cuenta,
    origen,
    esMaaser,
    metodoPago,
    socioId,
    dividido,
    notas,
  };
}

export async function crearPago(formData: FormData) {
  const datos = datosPago(formData);

  await prisma.pago.create({
    data: { ...datos, fecha: new Date(datos.fecha) },
  });

  revalidatePath("/finanzas");
  redirect("/finanzas");
}

export async function actualizarPago(pagoId: string, formData: FormData) {
  const datos = datosPago(formData);
  const volver = String(formData.get("volver") ?? "").trim();

  await prisma.pago.update({
    where: { id: pagoId },
    data: { ...datos, fecha: new Date(datos.fecha) },
  });

  revalidatePath("/finanzas");
  if (datos.pedidoId) revalidatePath(`/pedidos/${datos.pedidoId}`);
  if (volver.startsWith("/")) {
    revalidatePath(volver);
    redirect(volver);
  }
  redirect("/finanzas");
}

function datosConsumoPersonal(formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const productoId = String(formData.get("productoId") ?? "");
  const botellas = Number(formData.get("botellas"));
  const quien = String(formData.get("quien") ?? ""); // socioId, o "COMPARTIDO"
  const notas = String(formData.get("notas") ?? "").trim() || null;
  const montoRepuesto = numeroOpcional(formData.get("montoRepuesto"));
  const cuentaRepuesto = montoRepuesto
    ? (String(formData.get("cuentaRepuesto") ?? "EFECTIVO") as "EFECTIVO" | "CUENTA")
    : null;

  if (!fecha || !productoId || !botellas) {
    throw new Error("Faltan datos del consumo");
  }

  const dividido = quien === "COMPARTIDO";
  const socioId = dividido ? null : quien || null;

  return { fecha, productoId, botellas, socioId, dividido, montoRepuesto, cuentaRepuesto, notas };
}

export async function crearConsumoPersonal(formData: FormData) {
  const datos = datosConsumoPersonal(formData);

  const resumen = await calcularResumenInventario();
  const costoUnitario = resumen.get(datos.productoId)?.costoPromedioPorBotella ?? 0;

  await prisma.salida.create({
    data: {
      fecha: new Date(datos.fecha),
      productoId: datos.productoId,
      botellas: datos.botellas,
      motivo: "Consumo personal",
      costoUnitario,
      socioId: datos.socioId,
      dividido: datos.dividido,
      montoRepuesto: datos.montoRepuesto,
      cuentaRepuesto: datos.cuentaRepuesto,
      notas: datos.notas,
    },
  });

  await sincronizarActivoPorStock(datos.productoId);

  revalidatePath("/finanzas");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect("/finanzas");
}

export async function actualizarConsumoPersonal(salidaId: string, formData: FormData) {
  const datos = datosConsumoPersonal(formData);

  const anterior = await prisma.salida.findUniqueOrThrow({ where: { id: salidaId } });
  const resumen = await calcularResumenInventario();
  const costoUnitario = resumen.get(datos.productoId)?.costoPromedioPorBotella ?? 0;

  await prisma.salida.update({
    where: { id: salidaId },
    data: {
      fecha: new Date(datos.fecha),
      productoId: datos.productoId,
      botellas: datos.botellas,
      costoUnitario,
      socioId: datos.socioId,
      dividido: datos.dividido,
      montoRepuesto: datos.montoRepuesto,
      cuentaRepuesto: datos.cuentaRepuesto,
      notas: datos.notas,
    },
  });

  await sincronizarActivoPorStockVarios([anterior.productoId, datos.productoId]);

  revalidatePath("/finanzas");
  revalidatePath("/finanzas/consumo-personal");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect("/finanzas/consumo-personal");
}

export async function eliminarConsumoPersonal(formData: FormData) {
  const salidaId = String(formData.get("salidaId") ?? "");
  if (!salidaId) throw new Error("Falta el consumo a eliminar");

  const eliminado = await prisma.salida.delete({ where: { id: salidaId } });
  await sincronizarActivoPorStock(eliminado.productoId);

  revalidatePath("/finanzas");
  revalidatePath("/finanzas/consumo-personal");
  revalidatePath("/stock");
  revalidatePath("/");
}
