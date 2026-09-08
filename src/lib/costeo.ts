import { prisma } from "@/lib/prisma";

/**
 * Reparte la logística de un pedido (flete+seguro en USD, aduana+maniobras en MXN)
 * entre todas las botellas del pedido, y calcula el costo por botella de cada
 * línea de entrada. Replica la lógica del Sheet original de Isaac.
 */
export async function calcularCostosPedido(pedidoId: string) {
  const pedido = await prisma.pedido.findUniqueOrThrow({
    where: { id: pedidoId },
    include: { entradas: { where: { recibida: true } } },
  });

  const tipoCambio = pedido.tipoCambio ?? 0;
  const logisticaTotalMXN =
    (pedido.logisticaUSD ?? 0) * tipoCambio + (pedido.logisticaMXN ?? 0);

  const lineas = pedido.entradas.map((e) => {
    const botellas = e.cajasRecibidas * e.piezasPorCaja;
    const costoMercanciaMXN = e.cajasRecibidas * e.costoPorCaja * tipoCambio;
    return { entrada: e, botellas, costoMercanciaMXN };
  });

  const totalBotellas = lineas.reduce((acc, l) => acc + l.botellas, 0);
  const logisticaPorBotella =
    totalBotellas > 0 ? logisticaTotalMXN / totalBotellas : 0;

  return lineas.map((l) => {
    const costoTotalMXN =
      l.costoMercanciaMXN + logisticaPorBotella * l.botellas;
    const costoPorBotella = l.botellas > 0 ? costoTotalMXN / l.botellas : 0;
    return {
      entradaId: l.entrada.id,
      productoId: l.entrada.productoId,
      botellas: l.botellas,
      costoTotalMXN,
      costoPorBotella,
    };
  });
}

export type ResumenProducto = {
  productoId: string;
  botellasRecibidas: number;
  botellasSalidas: number;
  stockActual: number;
  costoPromedioPorBotella: number;
  valorInventario: number;
};

/**
 * Calcula, para cada producto, cuántas botellas tiene disponibles ahora mismo
 * y su costo promedio ponderado (entradas de todos los pedidos, menos salidas).
 */
export async function calcularResumenInventario(): Promise<
  Map<string, ResumenProducto>
> {
  const pedidos = await prisma.pedido.findMany({
    where: { entradas: { some: { recibida: true } } },
  });

  const acumPorProducto = new Map<
    string,
    { botellas: number; costoTotalMXN: number }
  >();

  for (const pedido of pedidos) {
    const lineas = await calcularCostosPedido(pedido.id);
    for (const l of lineas) {
      const acc = acumPorProducto.get(l.productoId) ?? {
        botellas: 0,
        costoTotalMXN: 0,
      };
      acc.botellas += l.botellas;
      acc.costoTotalMXN += l.costoTotalMXN;
      acumPorProducto.set(l.productoId, acc);
    }
  }

  const salidas = await prisma.salida.groupBy({
    by: ["productoId"],
    _sum: { botellas: true },
  });
  const salidasPorProducto = new Map(
    salidas.map((s) => [s.productoId, s._sum.botellas ?? 0]),
  );

  const resumen = new Map<string, ResumenProducto>();
  for (const [productoId, acc] of acumPorProducto) {
    const botellasSalidas = salidasPorProducto.get(productoId) ?? 0;
    const costoPromedioPorBotella =
      acc.botellas > 0 ? acc.costoTotalMXN / acc.botellas : 0;
    const stockActual = acc.botellas - botellasSalidas;
    resumen.set(productoId, {
      productoId,
      botellasRecibidas: acc.botellas,
      botellasSalidas,
      stockActual,
      costoPromedioPorBotella,
      valorInventario: stockActual * costoPromedioPorBotella,
    });
  }

  return resumen;
}

export function formatearCajasYBotellas(botellas: number, piezasPorCaja: number) {
  if (piezasPorCaja <= 0) return `${botellas} botellas`;
  const cajas = Math.floor(botellas / piezasPorCaja);
  const resto = botellas % piezasPorCaja;
  return `${cajas} caja${cajas === 1 ? "" : "s"} y ${resto} botella${resto === 1 ? "" : "s"}`;
}

export function formatoMXN(valor: number) {
  return valor.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}
