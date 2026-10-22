"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, sincronizarActivoPorStockVarios } from "@/lib/costeo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function crearDistribuidor(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;
  const tipo = String(formData.get("tipo") ?? "DISTRIBUIDOR") as "DISTRIBUIDOR" | "EVENTO";
  const clienteId = String(formData.get("clienteId") ?? "").trim() || null;
  const fechaEventoStr = String(formData.get("fechaEvento") ?? "").trim();
  const fechaEvento = tipo === "EVENTO" && fechaEventoStr ? new Date(fechaEventoStr) : null;
  const volver = String(formData.get("volver") ?? "").trim();

  if (!nombre) {
    throw new Error("Falta el nombre");
  }

  const distribuidor = await prisma.distribuidor.create({
    data: { nombre, telefono, notas, tipo, clienteId, fechaEvento },
  });

  revalidatePath("/distribuidores");
  if (clienteId) revalidatePath(`/clientes/${clienteId}`);

  if (volver.startsWith("/")) {
    redirect(`${volver}?nuevoDistribuidor=${distribuidor.id}`);
  }
  redirect(`/distribuidores/${distribuidor.id}`);
}

export async function marcarListoEvento(distribuidorId: string, listo: boolean) {
  await prisma.distribuidor.update({ where: { id: distribuidorId }, data: { listoEvento: listo } });
  revalidatePath("/distribuidores");
  revalidatePath(`/distribuidores/${distribuidorId}`);
}

export async function crearDistribuidorRapido(nombre: string) {
  const distribuidor = await prisma.distribuidor.create({
    data: { nombre: nombre.trim() },
  });
  revalidatePath("/distribuidores");
  return distribuidor;
}

export async function eliminarDistribuidor(distribuidorId: string) {
  const notasCount = await prisma.notaConsignacion.count({ where: { distribuidorId } });
  if (notasCount > 0) {
    throw new Error(
      "Este distribuidor todavía tiene notas de consignación. Bórralas primero y luego el distribuidor.",
    );
  }

  await prisma.distribuidor.delete({ where: { id: distribuidorId } });

  revalidatePath("/distribuidores");
  redirect("/distribuidores");
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
  const ubicacionId = String(formData.get("ubicacionId") ?? "").trim();
  const lineasJson = String(formData.get("lineas") ?? "[]");

  if (!fecha || !ubicacionId) {
    throw new Error("Falta la fecha o la bodega de la nota");
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
    data: { folio, fecha: new Date(fecha), distribuidorId, ubicacionId },
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
        ubicacionId,
      },
    });
  }

  await sincronizarActivoPorStockVarios(lineas.map((l) => l.productoId));

  revalidatePath(`/distribuidores/${distribuidorId}`);
  revalidatePath("/distribuidores");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect(`/notas-consignacion/${nota.id}`);
}

// Solo se puede borrar si nunca se le registró ningún pago, para no afectar
// cobros reales ya contados en Finanzas. Al borrarla, se le regresan las
// botellas al stock (se borran las Salida que había creado): la mercancía
// nunca salió de verdad.
export async function eliminarNotaConsignacion(notaConsignacionId: string) {
  const nota = await prisma.notaConsignacion.findUnique({
    where: { id: notaConsignacionId },
    include: { cobros: true, lineas: true },
  });
  if (!nota) return;

  const tieneActividad =
    nota.cobros.length > 0 || nota.lineas.some((l) => l.botellasPagadas > 0 || l.botellasDevueltas > 0);
  if (tieneActividad) {
    throw new Error("Esta nota ya tiene pagos o devoluciones registradas, no se puede eliminar.");
  }

  const productoIds = nota.lineas.map((l) => l.productoId);

  await prisma.salida.deleteMany({ where: { notaConsignacionId } });
  await prisma.notaConsignacionLinea.deleteMany({ where: { notaConsignacionId } });
  await prisma.notaConsignacion.delete({ where: { id: notaConsignacionId } });

  await sincronizarActivoPorStockVarios(productoIds);

  revalidatePath(`/distribuidores/${nota.distribuidorId}`);
  revalidatePath("/distribuidores");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect(`/distribuidores/${nota.distribuidorId}`);
}

type LiquidacionLineaForm = { lineaId: string; pagadas: number; devueltas: number };

// Un distribuidor/evento, cuando se cierra cuenta, o paga lo que vendió o
// regresa lo que no vendió (o las dos cosas). Esto hace las dos a la vez,
// línea por línea: lo pagado se vuelve venta de verdad (se suma a la
// ganancia), lo devuelto regresa solo al stock sin contar como venta.
export async function registrarLiquidacionConsignacion(notaConsignacionId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const cuenta = String(formData.get("cuenta") ?? "EFECTIVO") as "EFECTIVO" | "CUENTA";
  const comisionPct = cuenta === "CUENTA" ? Number(formData.get("comisionPct") ?? 0) : 0;
  const metodoPago = String(formData.get("metodoPago") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;
  const lineasJson = String(formData.get("lineas") ?? "[]");

  if (!fecha) {
    throw new Error("Falta la fecha");
  }

  const movimientos: LiquidacionLineaForm[] = JSON.parse(lineasJson).filter(
    (l: LiquidacionLineaForm) => l.lineaId && (l.pagadas > 0 || l.devueltas > 0),
  );

  if (movimientos.length === 0) {
    throw new Error("Pon al menos una botella pagada o devuelta");
  }

  const nota = await prisma.notaConsignacion.findUniqueOrThrow({
    where: { id: notaConsignacionId },
    include: { lineas: true },
  });

  let montoTotal = 0;
  const productoIds: string[] = [];

  for (const m of movimientos) {
    const linea = nota.lineas.find((l) => l.id === m.lineaId);
    if (!linea) continue;

    const disponible = linea.cantidadBotellas - linea.botellasPagadas - linea.botellasDevueltas;
    const pagadas = Math.max(0, Math.min(Math.trunc(m.pagadas), disponible));
    const devueltas = Math.max(0, Math.min(Math.trunc(m.devueltas), disponible - pagadas));
    if (pagadas === 0 && devueltas === 0) continue;

    await prisma.notaConsignacionLinea.update({
      where: { id: linea.id },
      data: { botellasPagadas: { increment: pagadas }, botellasDevueltas: { increment: devueltas } },
    });

    montoTotal += pagadas * linea.precioUnitario;
    productoIds.push(linea.productoId);

    if (devueltas > 0) {
      await prisma.ajusteStock.create({
        data: {
          productoId: linea.productoId,
          botellas: devueltas,
          costoUnitario: linea.costoUnitario,
          motivo: `Devolución de consignación — ${nota.folio}`,
          ubicacionId: nota.ubicacionId,
        },
      });
    }
  }

  if (montoTotal > 0) {
    await prisma.cobroConsignacion.create({
      data: { notaConsignacionId, fecha: new Date(fecha), monto: montoTotal, cuenta, comisionPct, metodoPago, notas },
    });
  }

  await sincronizarActivoPorStockVarios(productoIds);

  revalidatePath(`/notas-consignacion/${notaConsignacionId}`);
  revalidatePath(`/distribuidores/${nota.distribuidorId}`);
  revalidatePath("/distribuidores");
  revalidatePath("/stock");
  revalidatePath("/finanzas");
  revalidatePath("/");
}
