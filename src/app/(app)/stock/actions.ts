"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, calcularStockPorUbicacion, stockEnUbicacion, sincronizarActivoPorStock } from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function ajustarStock(productoId: string, formData: FormData) {
  const cantidadReal = Number(formData.get("cantidadReal"));
  const motivo = String(formData.get("motivo") ?? "").trim() || null;
  const socioIdRaw = String(formData.get("socioId") ?? "").trim();
  const socioId = socioIdRaw !== "" ? socioIdRaw : null;
  const ubicacionId = String(formData.get("ubicacionId") ?? "").trim();

  if (!ubicacionId) {
    throw new Error("Falta decir de qué bodega es este conteo");
  }
  if (Number.isNaN(cantidadReal) || cantidadReal < 0) {
    throw new Error("Pon cuántas botellas tienes en realidad");
  }

  const [resumen, stockUbicaciones] = await Promise.all([
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
  ]);
  const r = resumen.get(productoId);
  const stockSistema = stockEnUbicacion(stockUbicaciones, productoId, ubicacionId);
  const costoUnitario = r?.costoPromedioPorBotella ?? 0;
  const diferencia = cantidadReal - stockSistema;

  if (diferencia !== 0) {
    await prisma.ajusteStock.create({
      data: {
        productoId,
        botellas: diferencia,
        costoUnitario,
        motivo,
        ubicacionId,
        // Solo tiene sentido cargárselo a un socio si de verdad faltaron botellas.
        socioId: diferencia < 0 ? socioId : null,
      },
    });
    await sincronizarActivoPorStock(productoId);
  }

  revalidatePath("/stock");
  revalidatePath("/finanzas");
  revalidatePath("/");
  redirect(`/stock?ubicacion=${ubicacionId}`);
}

export async function crearUbicacion(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim() || null;

  if (!nombre) {
    throw new Error("Falta el nombre de la ubicación");
  }

  await prisma.ubicacion.create({ data: { nombre, direccion } });

  revalidatePath("/stock");
  revalidatePath("/stock/ubicaciones");
}

export async function actualizarUbicacion(ubicacionId: string, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim() || null;

  if (!nombre) {
    throw new Error("Falta el nombre de la ubicación");
  }

  await prisma.ubicacion.update({ where: { id: ubicacionId }, data: { nombre, direccion } });

  revalidatePath("/stock");
  revalidatePath("/stock/ubicaciones");
}
