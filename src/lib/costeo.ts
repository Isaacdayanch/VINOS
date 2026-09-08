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

export type ResumenSocio = {
  socioId: string;
  nombre: string;
  aportado: number; // capital que puso de su bolsillo (pagos "Inyección de capital" a su nombre)
  consumoPersonal: number; // costo de botellas que se llevó él solo (Salida "Consumo personal")
  neto: number; // aportado - consumoPersonal
};

export type SaldoEntreSocios = {
  deudorId: string;
  deudorNombre: string;
  acreedorId: string;
  acreedorNombre: string;
  monto: number;
} | null;

export type ResumenFinanzas = {
  inversionTotal: number;
  totalInyeccionCapital: number;
  totalReinversion: number;
  pagadoDesdeCaja: number;
  pagadoDesdeCuenta: number;
  valorInventario: number;
  botellasStock: number;
  ventasTotales: number;
  totalCobrado: number;
  totalPendiente: number;
  gananciaTotal: number;
  saldoCaja: number;
  saldoCuenta: number;
  socios: ResumenSocio[];
  saldoEntreSocios: SaldoEntreSocios;
  maaserDebido: number;
  maaserDado: number;
  saldoMaaser: number; // positivo = a favor, negativo = debe
};

const PORCENTAJE_MAASER = 0.1;

function montoEnMXN(moneda: "MXN" | "USD", monto: number, tipoCambio: number | null) {
  return moneda === "USD" ? monto * (tipoCambio ?? 0) : monto;
}

/**
 * Junta todos los números de Finanzas: inversión, stock, cobros, ganancia,
 * saldo de Caja/Cuenta, y el saldo entre socios (quién le debe a quién).
 */
export async function calcularFinanzas(): Promise<ResumenFinanzas> {
  const [resumenInventario, socios, pagos, cobros, ordenes, salidasPersonales] =
    await Promise.all([
      calcularResumenInventario(),
      prisma.socio.findMany(),
      prisma.pago.findMany(),
      prisma.cobro.findMany(),
      prisma.orden.findMany({ include: { lineas: true } }),
      prisma.salida.findMany({ where: { motivo: "Consumo personal" } }),
    ]);

  let valorInventario = 0;
  let botellasStock = 0;
  for (const r of resumenInventario.values()) {
    valorInventario += r.valorInventario;
    botellasStock += r.stockActual;
  }

  let ventasTotales = 0;
  let costoVentas = 0;
  for (const o of ordenes) {
    for (const l of o.lineas) {
      ventasTotales += l.cantidadBotellas * l.precioUnitario;
      costoVentas += l.cantidadBotellas * l.costoUnitario;
    }
  }
  const gananciaTotal = ventasTotales - costoVentas;

  const totalCobrado = cobros.reduce((acc, c) => acc + c.monto, 0);
  const totalPendiente = ventasTotales - totalCobrado;

  let inversionTotal = 0;
  let totalInyeccionCapital = 0;
  let totalReinversion = 0;
  let pagadoDesdeCaja = 0;
  let pagadoDesdeCuenta = 0;
  let saldoCaja = 0;
  let saldoCuenta = 0;
  let maaserDado = 0;
  const aportadoPorSocio = new Map<string, number>();

  for (const p of pagos) {
    const monto = montoEnMXN(p.moneda, p.monto, p.tipoCambio);

    // El maaser (diezmo) sí mueve el efectivo real de Caja/Cuenta, pero no
    // cuenta como inversión del negocio ni como aportación de un socio.
    if (p.origen === "REINVERSION") {
      if (p.cuenta === "EFECTIVO") saldoCaja -= monto;
      else saldoCuenta -= monto;
    }

    if (p.esMaaser) {
      maaserDado += monto;
      continue;
    }

    inversionTotal += monto;

    if (p.origen === "INYECCION_CAPITAL") {
      totalInyeccionCapital += monto;
      if (p.socioId) {
        aportadoPorSocio.set(p.socioId, (aportadoPorSocio.get(p.socioId) ?? 0) + monto);
      }
    }
    if (p.origen === "REINVERSION") {
      totalReinversion += monto;
    }

    if (p.cuenta === "EFECTIVO") pagadoDesdeCaja += monto;
    else pagadoDesdeCuenta += monto;
  }

  for (const c of cobros) {
    const montoNeto = c.monto * (1 - c.comisionPct / 100);
    if (c.cuenta === "EFECTIVO") saldoCaja += montoNeto;
    else saldoCuenta += montoNeto;
  }

  const consumoPorSocio = new Map<string, number>();
  for (const s of salidasPersonales) {
    if (s.socioId && !s.dividido) {
      const costo = (s.costoUnitario ?? 0) * s.botellas;
      consumoPorSocio.set(s.socioId, (consumoPorSocio.get(s.socioId) ?? 0) + costo);
    }
  }

  const resumenSocios: ResumenSocio[] = socios.map((s) => {
    const aportado = aportadoPorSocio.get(s.id) ?? 0;
    const consumoPersonal = consumoPorSocio.get(s.id) ?? 0;
    return { socioId: s.id, nombre: s.nombre, aportado, consumoPersonal, neto: aportado - consumoPersonal };
  });

  let saldoEntreSocios: SaldoEntreSocios = null;
  if (resumenSocios.length === 2) {
    const [a, b] = resumenSocios;
    const diferencia = a.neto - b.neto;
    const monto = Math.abs(diferencia) / 2;
    if (monto >= 1) {
      saldoEntreSocios =
        diferencia > 0
          ? { deudorId: b.socioId, deudorNombre: b.nombre, acreedorId: a.socioId, acreedorNombre: a.nombre, monto }
          : { deudorId: a.socioId, deudorNombre: a.nombre, acreedorId: b.socioId, acreedorNombre: b.nombre, monto };
    }
  }

  const maaserDebido = gananciaTotal * PORCENTAJE_MAASER;
  const saldoMaaser = maaserDado - maaserDebido;

  return {
    inversionTotal,
    totalInyeccionCapital,
    totalReinversion,
    pagadoDesdeCaja,
    pagadoDesdeCuenta,
    valorInventario,
    botellasStock,
    ventasTotales,
    totalCobrado,
    totalPendiente,
    gananciaTotal,
    saldoCaja,
    saldoCuenta,
    socios: resumenSocios,
    saldoEntreSocios,
    maaserDebido,
    maaserDado,
    saldoMaaser,
  };
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
