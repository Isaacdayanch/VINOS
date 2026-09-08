"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario } from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function numeroOpcional(valor: FormDataEntryValue | null) {
  if (!valor || valor === "") return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

export async function crearPago(formData: FormData) {
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
  const socioIdRaw = String(formData.get("socioId") ?? "");
  const dividido = origen === "INYECCION_CAPITAL" && socioIdRaw === "";
  const socioId = origen === "INYECCION_CAPITAL" && socioIdRaw !== "" ? socioIdRaw : null;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !concepto || !monto) {
    throw new Error("Faltan datos del pago");
  }

  await prisma.pago.create({
    data: {
      fecha: new Date(fecha),
      pedidoId,
      concepto,
      moneda,
      monto,
      tipoCambio,
      cuenta,
      origen,
      metodoPago,
      socioId,
      dividido,
      notas,
    },
  });

  revalidatePath("/finanzas");
  redirect("/finanzas");
}

export async function crearConsumoPersonal(formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const productoId = String(formData.get("productoId") ?? "");
  const botellas = Number(formData.get("botellas"));
  const quien = String(formData.get("quien") ?? ""); // socioId, o "COMPARTIDO"
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !productoId || !botellas) {
    throw new Error("Faltan datos del consumo");
  }

  const resumen = await calcularResumenInventario();
  const costoUnitario = resumen.get(productoId)?.costoPromedioPorBotella ?? 0;

  const dividido = quien === "COMPARTIDO";
  const socioId = dividido ? null : quien || null;

  await prisma.salida.create({
    data: {
      fecha: new Date(fecha),
      productoId,
      botellas,
      motivo: "Consumo personal",
      costoUnitario,
      socioId,
      dividido,
      notas,
    },
  });

  revalidatePath("/finanzas");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect("/finanzas");
}
