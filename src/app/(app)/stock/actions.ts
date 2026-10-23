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

// Pone el stock de un producto en varias bodegas a los valores pedidos de
// un jalón, sin inflar el Consolidado: lo que se va agregando a cada
// bodega se cubre primero con el stock "sin bodega asignada" que le quede
// a ese producto (se va gastando conforme se reparte entre las bodegas de
// esta misma pasada), antes de contarlo como inventario nuevo.
async function repartirProducto(
  productoId: string,
  objetivos: { ubicacionId: string; cantidad: number }[],
  costoUnitario: number,
  motivo: string,
  stockUbicaciones: Map<string, Map<string | null, number>>,
) {
  let huboCambio = false;
  let sinAsignarDisponible = Math.max(0, stockEnUbicacion(stockUbicaciones, productoId, null));

  for (const { ubicacionId, cantidad } of objetivos) {
    if (Number.isNaN(cantidad) || cantidad < 0) continue;
    const actual = stockEnUbicacion(stockUbicaciones, productoId, ubicacionId);
    const diferencia = cantidad - actual;
    if (diferencia === 0) continue;

    await prisma.ajusteStock.create({
      data: { productoId, botellas: diferencia, costoUnitario, motivo, ubicacionId },
    });
    huboCambio = true;

    if (diferencia > 0 && sinAsignarDisponible > 0) {
      const aDrenar = Math.min(diferencia, sinAsignarDisponible);
      await prisma.ajusteStock.create({
        data: {
          productoId,
          botellas: -aDrenar,
          costoUnitario,
          motivo: `${motivo} (de stock sin bodega asignada)`,
          ubicacionId: null,
        },
      });
      sinAsignarDisponible -= aDrenar;
    }
  }

  return huboCambio;
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
    const objetivos = ubicaciones
      .map((u) => {
        const campo = formData.get(`cantidad_${p.id}_${u.id}`);
        if (campo === null || campo === "") return null;
        return { ubicacionId: u.id, cantidad: Number(campo) };
      })
      .filter((o): o is { ubicacionId: string; cantidad: number } => o !== null);
    if (objetivos.length === 0) continue;

    const cambio = await repartirProducto(
      p.id,
      objetivos,
      costoUnitario,
      "Reparto de stock por bodega",
      stockUbicaciones,
    );
    if (cambio) productoIdsAfectados.add(p.id);
  }

  await sincronizarActivoPorStockVarios([...productoIdsAfectados]);

  revalidatePath("/stock");
  revalidatePath("/stock/ubicaciones");
  revalidatePath("/finanzas");
  revalidatePath("/");
  redirect("/stock");
}

// Para cuando solo tienes el conteo de UNA bodega a la mano: pones nomás esa
// y lo demás (Consolidado menos lo que pusiste) se carga solo a la otra
// bodega. Solo funciona si hay exactamente 2 ubicaciones.
export async function repartirRapidoUbicaciones(formData: FormData) {
  const ubicacionManualId = String(formData.get("ubicacionManualId") ?? "").trim();

  const [productos, ubicaciones, resumen, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({ select: { id: true } }),
    prisma.ubicacion.findMany({ select: { id: true } }),
    calcularResumenInventario(),
    calcularStockPorUbicacion(),
  ]);

  if (ubicaciones.length !== 2) {
    throw new Error("Esta pantalla solo funciona con exactamente 2 ubicaciones.");
  }
  const ubicacionRestoId = ubicaciones.find((u) => u.id !== ubicacionManualId)?.id;
  if (!ubicacionManualId || !ubicacionRestoId) {
    throw new Error("Falta decir de cuál bodega vas a dar los números.");
  }

  const productoIdsAfectados = new Set<string>();

  for (const p of productos) {
    const campo = formData.get(`cantidad_${p.id}`);
    if (campo === null || campo === "") continue;
    const cantidadManual = Number(campo);
    if (Number.isNaN(cantidadManual) || cantidadManual < 0) continue;

    const costoUnitario = resumen.get(p.id)?.costoPromedioPorBotella ?? 0;
    const consolidado = resumen.get(p.id)?.stockActual ?? 0;
    const cantidadResto = Math.max(0, consolidado - cantidadManual);

    const cambio = await repartirProducto(
      p.id,
      [
        { ubicacionId: ubicacionManualId, cantidad: cantidadManual },
        { ubicacionId: ubicacionRestoId, cantidad: cantidadResto },
      ],
      costoUnitario,
      "Reparto de stock por bodega",
      stockUbicaciones,
    );
    if (cambio) productoIdsAfectados.add(p.id);
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
