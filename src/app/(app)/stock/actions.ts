"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, sincronizarActivoPorStock } from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function ajustarStock(productoId: string, formData: FormData) {
  const cantidadReal = Number(formData.get("cantidadReal"));
  const motivo = String(formData.get("motivo") ?? "").trim() || null;

  if (Number.isNaN(cantidadReal) || cantidadReal < 0) {
    throw new Error("Pon cuántas botellas tienes en realidad");
  }

  const resumen = await calcularResumenInventario();
  const r = resumen.get(productoId);
  const stockSistema = r?.stockActual ?? 0;
  const costoUnitario = r?.costoPromedioPorBotella ?? 0;
  const diferencia = cantidadReal - stockSistema;

  if (diferencia !== 0) {
    await prisma.ajusteStock.create({
      data: { productoId, botellas: diferencia, costoUnitario, motivo },
    });
    await sincronizarActivoPorStock(productoId);
  }

  revalidatePath("/stock");
  revalidatePath("/");
  redirect("/stock");
}
