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
    // Si la bodega sube, esas botellas se cubren primero con stock "sin
    // bodega asignada" (de antes de que existieran las bodegas) en vez de
    // sumar inventario nuevo de la nada -- si no, el Consolidado se duplica.
    await drenarSinAsignar(productoId, diferencia, costoUnitario, motivo ?? "Ajuste de inventario", stockUbicaciones);
    await sincronizarActivoPorStock(productoId);
  }

  revalidatePath("/stock");
  revalidatePath("/finanzas");
  revalidatePath("/");
  redirect(`/stock?ubicacion=${ubicacionId}`);
}

// Si el stock de una bodega sube, primero se cubre con botellas "sin bodega
// asignada" (las de antes de que existieran las bodegas) en vez de sumar
// inventario nuevo de la nada -- así el Consolidado no se duplica.
async function drenarSinAsignar(
  productoId: string,
  cuantoSubio: number,
  costoUnitario: number,
  motivo: string,
  stockUbicaciones: Map<string, Map<string | null, number>>,
) {
  if (cuantoSubio <= 0) return;
  const sinAsignar = Math.max(0, stockEnUbicacion(stockUbicaciones, productoId, null));
  const aDrenar = Math.min(cuantoSubio, sinAsignar);
  if (aDrenar <= 0) return;
  await prisma.ajusteStock.create({
    data: {
      productoId,
      botellas: -aDrenar,
      costoUnitario,
      motivo: `${motivo} (de stock sin bodega asignada)`,
      ubicacionId: null,
    },
  });
}

// Herramienta de un solo uso: manda todo el stock actual de cada producto a
// UNA bodega (de donde después, a mano, se van transfiriendo botellas a la
// otra con ajustarStock). Por cada producto crea un par de ajustes que se
// cancelan entre sí en el Consolidado -- uno le quita exactamente lo mismo
// al stock "sin bodega asignada" que lo que le da a la bodega elegida --
// así nunca se duplica nada. Si un producto ya tiene algo puesto en esa
// bodega, no le hace nada (para poder correrla más de una vez sin riesgo).
export async function asignarTodoStockAUbicacion(ubicacionId: string) {
  if (!ubicacionId) {
    throw new Error("Falta decir a cuál bodega");
  }

  const [productos, resumen, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({ select: { id: true } }),
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
  ]);

  const productoIdsAfectados: string[] = [];

  for (const p of productos) {
    const r = resumen.get(p.id);
    const consolidado = r?.stockActual ?? 0;
    if (consolidado <= 0) continue;

    const yaTieneAqui = stockEnUbicacion(stockUbicaciones, p.id, ubicacionId);
    if (yaTieneAqui !== 0) continue; // ya se repartió este producto, no lo tocamos de nuevo

    const costoUnitario = r?.costoPromedioPorBotella ?? 0;

    await prisma.ajusteStock.create({
      data: {
        productoId: p.id,
        botellas: consolidado,
        costoUnitario,
        motivo: "Asignación inicial de todo el stock a una bodega",
        ubicacionId,
      },
    });
    await prisma.ajusteStock.create({
      data: {
        productoId: p.id,
        botellas: -consolidado,
        costoUnitario,
        motivo: "Asignación inicial de todo el stock a una bodega (de stock sin bodega asignada)",
        ubicacionId: null,
      },
    });
    productoIdsAfectados.push(p.id);
  }

  await sincronizarActivoPorStockVarios(productoIdsAfectados);

  revalidatePath("/stock");
  revalidatePath("/stock/ubicaciones");
  revalidatePath("/finanzas");
  revalidatePath("/");
  redirect("/stock");
}

// Mueve botellas de una bodega a otra: le resta a la bodega de origen
// exactamente lo mismo que le suma a la de destino, así que el Consolidado
// nunca cambia (no toca el stock "sin bodega asignada" para nada). Valida
// TODO antes de mover una sola botella -- si algo no alcanza, no se
// transfiere nada, para no dejar la transferencia a medias.
export async function transferirLoteUbicaciones(formData: FormData) {
  const origenId = String(formData.get("origenId") ?? "").trim();
  const destinoId = String(formData.get("destinoId") ?? "").trim();

  if (!origenId || !destinoId) {
    throw new Error("Falta elegir de dónde sale y a dónde llega el stock");
  }
  if (origenId === destinoId) {
    throw new Error("El origen y el destino no pueden ser la misma bodega");
  }

  let lineasCrudas: { productoId: string; cantidad: number }[];
  try {
    lineasCrudas = JSON.parse(String(formData.get("lineas") ?? "[]"));
  } catch {
    throw new Error("No se pudieron leer las líneas a transferir");
  }
  const lineas = lineasCrudas.filter(
    (l) => l.productoId && Number.isFinite(l.cantidad) && l.cantidad > 0,
  );
  if (lineas.length === 0) {
    throw new Error("No hay ninguna línea válida que transferir");
  }

  const [resumen, stockUbicaciones, ubicaciones] = await Promise.all([
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
    prisma.ubicacion.findMany({ where: { id: { in: [origenId, destinoId] } } }),
  ]);

  const origen = ubicaciones.find((u) => u.id === origenId);
  const destino = ubicaciones.find((u) => u.id === destinoId);
  if (!origen || !destino) {
    throw new Error("No encontré esas bodegas");
  }

  // Si dos líneas son el mismo producto, se suman antes de comparar contra
  // lo disponible -- si no, cada línea por separado podría "pasar" aunque
  // juntas excedan lo que de verdad hay en el origen.
  const totalesPorProducto = new Map<string, number>();
  for (const l of lineas) {
    totalesPorProducto.set(l.productoId, (totalesPorProducto.get(l.productoId) ?? 0) + l.cantidad);
  }
  const faltantes: string[] = [];
  for (const [productoId, total] of totalesPorProducto) {
    const disponible = stockEnUbicacion(stockUbicaciones, productoId, origenId);
    if (total > disponible) faltantes.push(productoId);
  }
  if (faltantes.length > 0) {
    throw new Error(
      `No hay suficiente stock en ${origen.nombre} para ${faltantes.length} de los vinos que pediste transferir. No se movió nada todavía.`,
    );
  }

  const motivo = `Transferencia de bodega — ${origen.nombre} a ${destino.nombre}`;
  await prisma.$transaction(
    lineas.flatMap((l) => {
      const costoUnitario = resumen.get(l.productoId)?.costoPromedioPorBotella ?? 0;
      return [
        prisma.ajusteStock.create({
          data: { productoId: l.productoId, botellas: -l.cantidad, costoUnitario, motivo, ubicacionId: origenId },
        }),
        prisma.ajusteStock.create({
          data: { productoId: l.productoId, botellas: l.cantidad, costoUnitario, motivo, ubicacionId: destinoId },
        }),
      ];
    }),
  );

  revalidatePath("/stock");
  revalidatePath("/stock/ubicaciones");
  revalidatePath("/stock/movimientos");
  revalidatePath("/");
  redirect("/stock/ubicaciones?transferido=1");
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
