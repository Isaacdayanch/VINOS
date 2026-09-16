"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario } from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function crearDistribuidor(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;
  const volver = String(formData.get("volver") ?? "").trim();

  if (!nombre) {
    throw new Error("Falta el nombre del distribuidor");
  }

  const distribuidor = await prisma.distribuidor.create({
    data: { nombre, telefono, notas },
  });

  revalidatePath("/distribuidores");

  if (volver.startsWith("/")) {
    redirect(`${volver}?nuevoDistribuidor=${distribuidor.id}`);
  }
  redirect(`/distribuidores/${distribuidor.id}`);
}

export async function crearDistribuidorRapido(nombre: string) {
  const distribuidor = await prisma.distribuidor.create({
    data: { nombre: nombre.trim() },
  });
  revalidatePath("/distribuidores");
  return distribuidor;
}

async function siguienteFolioConsignacion() {
  const notas = await prisma.notaConsignacion.findMany({ select: { folio: true } });
  let maxNumero = 0;
  for (const n of notas) {
    const match = n.folio.match(/NC-(\d+)/);
    if (match) maxNumero = Math.max(maxNumero, parseInt(match[1], 10));
  }
  return `NC-${String(maxNumero + 1).padStart(3, "0")}`;
}

type LineaForm = { productoId: string; cantidadBotellas: number; precioUnitario: number };

export async function crearNotaConsignacion(distribuidorId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const lineasJson = String(formData.get("lineas") ?? "[]");

  if (!fecha) {
    throw new Error("Falta la fecha de la nota");
  }

  const lineas: LineaForm[] = JSON.parse(lineasJson).filter(
    (l: LineaForm) => l.productoId && l.cantidadBotellas > 0,
  );

  if (lineas.length === 0) {
    throw new Error("Agrega al menos un vino a la nota");
  }

  const resumen = await calcularResumenInventario();
  const folio = await siguienteFolioConsignacion();

  const nota = await prisma.notaConsignacion.create({
    data: { folio, fecha: new Date(fecha), distribuidorId },
  });

  for (const l of lineas) {
    const costoUnitario = resumen.get(l.productoId)?.costoPromedioPorBotella ?? 0;

    await prisma.notaConsignacionLinea.create({
      data: {
        notaConsignacionId: nota.id,
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
        motivo: "Consignación",
        notaConsignacionId: nota.id,
      },
    });
  }

  revalidatePath(`/distribuidores/${distribuidorId}`);
  revalidatePath("/distribuidores");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect(`/notas-consignacion/${nota.id}`);
}

export async function crearCobroConsignacion(notaConsignacionId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const monto = Number(formData.get("monto"));
  const cuenta = String(formData.get("cuenta") ?? "EFECTIVO") as "EFECTIVO" | "CUENTA";
  const comisionPct = cuenta === "CUENTA" ? Number(formData.get("comisionPct") ?? 0) : 0;
  const metodoPago = String(formData.get("metodoPago") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !monto) {
    throw new Error("Faltan datos del pago");
  }

  await prisma.cobroConsignacion.create({
    data: {
      notaConsignacionId,
      fecha: new Date(fecha),
      monto,
      cuenta,
      comisionPct,
      metodoPago,
      notas,
    },
  });

  revalidatePath(`/notas-consignacion/${notaConsignacionId}`);
  revalidatePath("/distribuidores");
}
