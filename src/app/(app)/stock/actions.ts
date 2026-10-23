"use server";

import { prisma } from "@/lib/prisma";
import {
  calcularResumenInventario,
  calcularStockPorUbicacion,
  stockEnUbicacion,
  sincronizarActivoPorStock,
  sincronizarActivoPorStockVarios,
} from "@/lib/costeo";
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

// Pantalla sencilla para repartir de un jalón cuánto stock de cada producto
// hay en cada bodega (en vez de ir producto por producto en "Ajustar").
// Compara lo que escribe Isaac contra lo que el sistema ya tenía registrado
// en esa bodega y crea un ajuste solo con la diferencia.
export async function repartirStockUbicaciones(formData: FormData) {
  const [productos, ubicaciones, resumen, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({ select: { id: true } }),
    prisma.ubicacion.findMany({ select: { id: true } }),
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
  ]);

  const productoIdsAfectados = new Set<string>();

  for (const p of productos) {
    const costoUnitario = resumen.get(p.id)?.costoPromedioPorBotella ?? 0;
    for (const u of ubicaciones) {
      const campo = formData.get(`cantidad_${p.id}_${u.id}`);
      if (campo === null || campo === "") continue;
      const cantidadNueva = Number(campo);
      if (Number.isNaN(cantidadNueva) || cantidadNueva < 0) continue;

      const actual = stockEnUbicacion(stockUbicaciones, p.id, u.id);
      const diferencia = cantidadNueva - actual;
      if (diferencia === 0) continue;

      await prisma.ajusteStock.create({
        data: {
          productoId: p.id,
          botellas: diferencia,
          costoUnitario,
          motivo: "Reparto de stock por bodega",
          ubicacionId: u.id,
        },
      });
      productoIdsAfectados.add(p.id);
    }
  }

  await sincronizarActivoPorStockVarios([...productoIdsAfectados]);

  revalidatePath("/stock");
  revalidatePath("/stock/ubicaciones");
  revalidatePath("/finanzas");
  revalidatePath("/");
  redirect("/stock");
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
