"use server";

import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, sincronizarActivoPorStockVarios } from "@/lib/costeo";
import { asegurarCodigoCliente } from "@/lib/clienteCodigo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Folio = código del cliente + su número de orden con nosotros (ej. "DAN-03"
// para la 3a orden de Daniel), para que se lea de un vistazo quién es y qué
// tan seguido compra -- en vez de un código al azar que no dice nada.
async function siguienteFolioParaCliente(clienteId: string, codigoCliente: string): Promise<string> {
  const ordenesPrevias = await prisma.orden.count({ where: { clienteId } });
  for (let intento = 0; intento < 5; intento++) {
    const folio = `${codigoCliente}-${String(ordenesPrevias + 1 + intento).padStart(2, "0")}`;
    const existe = await prisma.orden.findUnique({ where: { folio }, select: { id: true } });
    if (!existe) return folio;
  }
  throw new Error("No se pudo generar un folio único para esta orden, intenta de nuevo");
}

/** Número de un campo de monto; vacío o inválido = 0. */
function leerMonto(valor: FormDataEntryValue | null): number {
  const n = Number(String(valor ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Envío de una orden: lo cobrado al cliente y lo que costó (vacío = sin capturar). */
export async function guardarEnvioOrden(ordenId: string, formData: FormData) {
  const costoTexto = String(formData.get("envioCosto") ?? "").trim();
  await prisma.orden.update({
    where: { id: ordenId },
    data: { envioCobrado: leerMonto(formData.get("envioCobrado")), envioCosto: costoTexto === "" ? null : leerMonto(costoTexto) },
  });
  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/ordenes/envios");
  revalidatePath("/finanzas");
  revalidatePath("/");
}

/** Reparte en partes iguales lo que costaron los envíos de un día entre las órdenes de ese día. */
export async function repartirCostoEnviosDia(formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const total = leerMonto(formData.get("total"));
  const ordenIds = formData.getAll("ordenId").map(String).filter(Boolean);
  if (!fecha || ordenIds.length === 0) throw new Error("Elige al menos una orden");
  const porOrden = Math.round((total / ordenIds.length) * 100) / 100;
  await prisma.$transaction(ordenIds.map((id) => prisma.orden.update({ where: { id }, data: { envioCosto: porOrden } })));
  revalidatePath("/ordenes/envios");
  revalidatePath("/ordenes");
  revalidatePath("/finanzas");
  for (const id of ordenIds) revalidatePath(`/ordenes/${id}`);
  redirect(`/ordenes/envios?fecha=${fecha}`);
}

type LineaForm = {
  productoId: string;
  cantidadBotellas: number;
  precioUnitario: number;
  esRegalo?: boolean;
  entregado?: boolean;
  fechaEstimada?: string | null;
};

export async function crearOrden(formData: FormData) {
  const clienteId = String(formData.get("clienteId") ?? "");
  const fecha = String(formData.get("fecha") ?? "");
  const ubicacionId = String(formData.get("ubicacionId") ?? "").trim();
  const lineasJson = String(formData.get("lineas") ?? "[]");
  const envioCobrado = leerMonto(formData.get("envioCobrado"));

  if (!clienteId || !fecha || !ubicacionId) {
    throw new Error("Faltan datos de la orden");
  }

  const lineas: LineaForm[] = JSON.parse(lineasJson).filter(
    (l: LineaForm) => l.productoId && l.cantidadBotellas > 0,
  );

  if (lineas.length === 0) {
    throw new Error("Agrega al menos un vino a la orden");
  }

  const resumen = await calcularResumenInventario();
  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) throw new Error("Cliente no encontrado");
  const codigoCliente = await asegurarCodigoCliente(cliente);
  const folio = await siguienteFolioParaCliente(clienteId, codigoCliente);

  const orden = await prisma.orden.create({
    data: {
      folio,
      fecha: new Date(fecha),
      clienteId,
      ubicacionId,
      envioCobrado,
      estatus: "Surtida - pendiente de pago",
    },
  });

  for (const l of lineas) {
    const costoUnitario = resumen.get(l.productoId)?.costoPromedioPorBotella ?? 0;
    const entregado = l.entregado ?? true;

    await prisma.ordenLinea.create({
      data: {
        ordenId: orden.id,
        productoId: l.productoId,
        cantidadBotellas: l.cantidadBotellas,
        precioUnitario: l.precioUnitario,
        costoUnitario,
        esRegalo: l.esRegalo ?? false,
        entregado,
        fechaEstimada: !entregado && l.fechaEstimada ? new Date(l.fechaEstimada) : null,
      },
    });

    // Si todavía no se tiene la botella (entregado=false), no se descuenta
    // stock hasta que de verdad se le entregue al cliente.
    if (entregado) {
      await prisma.salida.create({
        data: {
          fecha: new Date(fecha),
          productoId: l.productoId,
          botellas: l.cantidadBotellas,
          motivo: "Venta",
          ordenId: orden.id,
          ubicacionId,
        },
      });
    }

    // Un regalo a $0 no debe quedar guardado como "el precio que le toca a este
    // cliente" — si no, su próxima orden se le sugeriría gratis.
    if (!l.esRegalo) {
      await prisma.precioClienteProducto.upsert({
        where: { clienteId_productoId: { clienteId, productoId: l.productoId } },
        create: { clienteId, productoId: l.productoId, precio: l.precioUnitario },
        update: { precio: l.precioUnitario },
      });
    }
  }

  await sincronizarActivoPorStockVarios(lineas.map((l) => l.productoId));

  revalidatePath("/ordenes");
  revalidatePath("/stock");
  revalidatePath("/");
  redirect(`/ordenes/${orden.id}`);
}

export async function actualizarOrden(ordenId: string, formData: FormData) {
  const actual = await prisma.orden.findUnique({ where: { id: ordenId }, select: { estatus: true } });
  if (actual?.estatus === "Cancelada") {
    throw new Error("Esta orden está cancelada; reactívala antes de editarla");
  }
  const clienteId = String(formData.get("clienteId") ?? "");
  const fecha = String(formData.get("fecha") ?? "");
  const ubicacionId = String(formData.get("ubicacionId") ?? "").trim();
  const lineasJson = String(formData.get("lineas") ?? "[]");
  const envioCobrado = leerMonto(formData.get("envioCobrado"));

  if (!clienteId || !fecha || !ubicacionId) {
    throw new Error("Faltan datos de la orden");
  }

  const lineas: LineaForm[] = JSON.parse(lineasJson).filter(
    (l: LineaForm) => l.productoId && l.cantidadBotellas > 0,
  );

  if (lineas.length === 0) {
    throw new Error("Agrega al menos un vino a la orden");
  }

  const resumen = await calcularResumenInventario();

  const lineasAnteriores = await prisma.ordenLinea.findMany({
    where: { ordenId },
    select: { productoId: true },
  });

  await prisma.salida.deleteMany({ where: { ordenId } });
  await prisma.ordenLinea.deleteMany({ where: { ordenId } });

  await prisma.orden.update({
    where: { id: ordenId },
    data: { clienteId, fecha: new Date(fecha), ubicacionId, envioCobrado },
  });

  for (const l of lineas) {
    const costoUnitario = resumen.get(l.productoId)?.costoPromedioPorBotella ?? 0;
    const entregado = l.entregado ?? true;

    await prisma.ordenLinea.create({
      data: {
        ordenId,
        productoId: l.productoId,
        cantidadBotellas: l.cantidadBotellas,
        precioUnitario: l.precioUnitario,
        costoUnitario,
        esRegalo: l.esRegalo ?? false,
        entregado,
        fechaEstimada: !entregado && l.fechaEstimada ? new Date(l.fechaEstimada) : null,
      },
    });

    if (entregado) {
      await prisma.salida.create({
        data: {
          fecha: new Date(fecha),
          productoId: l.productoId,
          botellas: l.cantidadBotellas,
          motivo: "Venta",
          ordenId,
          ubicacionId,
        },
      });
    }

    if (!l.esRegalo) {
      await prisma.precioClienteProducto.upsert({
        where: { clienteId_productoId: { clienteId, productoId: l.productoId } },
        create: { clienteId, productoId: l.productoId, precio: l.precioUnitario },
        update: { precio: l.precioUnitario },
      });
    }
  }

  await sincronizarActivoPorStockVarios([
    ...lineasAnteriores.map((l) => l.productoId),
    ...lineas.map((l) => l.productoId),
  ]);

  revalidatePath("/ordenes");
  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/stock");
  revalidatePath("/");
  redirect(`/ordenes/${ordenId}`);
}

export async function marcarLineaEntregada(ordenLineaId: string, ordenId: string) {
  const [linea, orden] = await Promise.all([
    prisma.ordenLinea.findUnique({ where: { id: ordenLineaId } }),
    prisma.orden.findUnique({ where: { id: ordenId }, select: { ubicacionId: true, estatus: true } }),
  ]);
  if (!linea || linea.entregado || orden?.estatus === "Cancelada") return;

  const resumen = await calcularResumenInventario();
  const costoUnitario = resumen.get(linea.productoId)?.costoPromedioPorBotella ?? 0;

  await prisma.$transaction([
    prisma.salida.create({
      data: {
        fecha: new Date(),
        productoId: linea.productoId,
        botellas: linea.cantidadBotellas,
        motivo: "Venta",
        costoUnitario,
        ordenId,
        ubicacionId: orden?.ubicacionId,
        notas: "Entrega de línea marcada como pendiente al vender",
      },
    }),
    prisma.ordenLinea.update({
      where: { id: ordenLineaId },
      data: { entregado: true, fechaEstimada: null },
    }),
  ]);

  await sincronizarActivoPorStockVarios([linea.productoId]);

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/clientes");
  revalidatePath("/stock");
  revalidatePath("/");
}

export async function crearCobro(ordenId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const monto = Number(formData.get("monto"));
  const cuenta = String(formData.get("cuenta") ?? "EFECTIVO") as "EFECTIVO" | "CUENTA";
  const comisionPct = cuenta === "CUENTA" ? Number(formData.get("comisionPct") ?? 0) : 0;
  const metodoPago = String(formData.get("metodoPago") ?? "").trim() || null;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!fecha || !monto) {
    throw new Error("Faltan datos del cobro");
  }

  const orden = await prisma.orden.findUnique({ where: { id: ordenId }, select: { estatus: true } });
  if (orden?.estatus === "Cancelada") {
    throw new Error("Esta orden está cancelada; no se le pueden registrar cobros");
  }

  await prisma.cobro.create({
    data: { ordenId, fecha: new Date(fecha), monto, cuenta, comisionPct, metodoPago, notas },
  });

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/finanzas");
  revalidatePath("/");
}

// Cancela una orden que nunca se hizo de verdad (error de captura, etc.) sin
// tocar sus botellas ni sus movimientos de Salida -- si el inventario ya se
// corrigió aparte, cancelar la orden no debe volver a mover el stock. Deja de
// contar como venta, ganancia o pendiente de cobro en Finanzas y en el estado
// de cuenta del cliente.
export async function cancelarOrden(ordenId: string) {
  const orden = await prisma.orden.update({
    where: { id: ordenId },
    data: { estatus: "Cancelada" },
    select: { clienteId: true },
  });

  revalidatePath("/ordenes");
  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/finanzas");
  revalidatePath(`/clientes/${orden.clienteId}`);
  revalidatePath("/");
}

// Deshace una cancelación hecha por error: regresa la orden a contar como
// venta normal. No mueve inventario (cancelarOrden tampoco lo movió).
export async function reactivarOrden(ordenId: string) {
  const orden = await prisma.orden.update({
    where: { id: ordenId },
    data: { estatus: "Surtida - pendiente de pago" },
    select: { clienteId: true },
  });

  revalidatePath("/ordenes");
  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/finanzas");
  revalidatePath(`/clientes/${orden.clienteId}`);
  revalidatePath("/");
}
