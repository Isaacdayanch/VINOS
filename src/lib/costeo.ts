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
  const factorDescuento = 1 - (pedido.descuentoPct ?? 0) / 100;

  const lineas = pedido.entradas.map((e) => {
    const botellas = e.cajasRecibidas * e.piezasPorCaja;
    // El descuento del proveedor es sobre el costo de la mercancía; el
    // envío/aduana no se descuenta.
    const costoMercanciaMXN = e.cajasRecibidas * e.costoPorCaja * tipoCambio * factorDescuento;
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
  consumoPersonal: number; // costo de botellas que se llevó él solo, menos lo que ya repuso a Caja/Cuenta
  neto: number; // aportado - consumoPersonal
  botellasPersonal: number; // botellas que se llevó él solo (consumo personal), sin contar lo repuesto
  costoPersonalBruto: number; // costo total de esas botellas, sin restar lo repuesto
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
  consumoCompartido: { botellas: number; costo: number }; // botellas que Isaac y Beto se repartieron
};

const PORCENTAJE_MAASER = 0.1;

export function montoEnMXN(moneda: "MXN" | "USD", monto: number, tipoCambio: number | null) {
  return moneda === "USD" ? monto * (tipoCambio ?? 0) : monto;
}

/**
 * Junta todos los números de Finanzas: inversión, stock, cobros, ganancia,
 * saldo de Caja/Cuenta, y el saldo entre socios (quién le debe a quién).
 */
export async function calcularFinanzas(): Promise<ResumenFinanzas> {
  const [resumenInventario, socios, pagos, cobros, cobrosConsignacion, ordenes, salidasPersonales] =
    await Promise.all([
      calcularResumenInventario(),
      prisma.socio.findMany(),
      prisma.pago.findMany(),
      prisma.cobro.findMany(),
      prisma.cobroConsignacion.findMany(),
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

  // Lo que pagan los distribuidores también es efectivo/transferencia real,
  // aunque esa venta todavía no cuente como ganancia reconocida (eso se
  // queda en el circuito separado de Distribuidores).
  for (const c of cobrosConsignacion) {
    const montoNeto = c.monto * (1 - c.comisionPct / 100);
    if (c.cuenta === "EFECTIVO") saldoCaja += montoNeto;
    else saldoCuenta += montoNeto;
  }

  const consumoPorSocio = new Map<string, number>();
  const botellasPorSocio = new Map<string, number>();
  const costoBrutoPorSocio = new Map<string, number>();
  let compartidoBotellas = 0;
  let compartidoCosto = 0;
  for (const s of salidasPersonales) {
    // Si ya repuso el dinero a Caja/Cuenta, ese efectivo entra directo (abajo) y
    // aquí se descuenta para no generarle deuda contra el otro socio.
    if (s.montoRepuesto) {
      if (s.cuentaRepuesto === "CUENTA") saldoCuenta += s.montoRepuesto;
      else saldoCaja += s.montoRepuesto;
    }
    const costoBruto = (s.costoUnitario ?? 0) * s.botellas;
    if (s.dividido) {
      compartidoBotellas += s.botellas;
      compartidoCosto += costoBruto;
    } else if (s.socioId) {
      const costoNeto = costoBruto - (s.montoRepuesto ?? 0);
      consumoPorSocio.set(s.socioId, (consumoPorSocio.get(s.socioId) ?? 0) + costoNeto);
      botellasPorSocio.set(s.socioId, (botellasPorSocio.get(s.socioId) ?? 0) + s.botellas);
      costoBrutoPorSocio.set(s.socioId, (costoBrutoPorSocio.get(s.socioId) ?? 0) + costoBruto);
    }
  }

  const resumenSocios: ResumenSocio[] = socios.map((s) => {
    const aportado = aportadoPorSocio.get(s.id) ?? 0;
    const consumoPersonal = consumoPorSocio.get(s.id) ?? 0;
    return {
      socioId: s.id,
      nombre: s.nombre,
      aportado,
      consumoPersonal,
      neto: aportado - consumoPersonal,
      botellasPersonal: botellasPorSocio.get(s.id) ?? 0,
      costoPersonalBruto: costoBrutoPorSocio.get(s.id) ?? 0,
    };
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
    consumoCompartido: { botellas: compartidoBotellas, costo: compartidoCosto },
    maaserDebido,
    maaserDado,
    saldoMaaser,
  };
}

export type MovimientoCuenta = {
  id: string;
  fecha: Date;
  tipo: "entrada" | "salida";
  monto: number; // siempre positivo; el signo lo da "tipo"
  concepto: string;
  detalle: string | null;
  href: string | null;
};

/**
 * Historial de movimientos de una cuenta (Efectivo o Transferencia): junta
 * cobros de órdenes, pagos de distribuidores, pagos/gastos (reinversión) y
 * reposiciones de consumo personal — los mismos que usa calcularFinanzas
 * para sacar el saldo, para que cuadren siempre entre sí.
 */
export async function calcularMovimientosCuenta(
  cuenta: "EFECTIVO" | "CUENTA",
): Promise<{ saldo: number; movimientos: MovimientoCuenta[] }> {
  const [cobros, cobrosConsignacion, pagos, salidasRepuesto] = await Promise.all([
    prisma.cobro.findMany({
      where: { cuenta },
      include: { orden: { include: { cliente: true } } },
    }),
    prisma.cobroConsignacion.findMany({
      where: { cuenta },
      include: { notaConsignacion: { include: { distribuidor: true } } },
    }),
    prisma.pago.findMany({
      where: { cuenta, origen: "REINVERSION" },
      include: { pedido: true },
    }),
    prisma.salida.findMany({
      where: { motivo: "Consumo personal", cuentaRepuesto: cuenta, montoRepuesto: { not: null } },
    }),
  ]);

  const movimientos: MovimientoCuenta[] = [];

  for (const c of cobros) {
    movimientos.push({
      id: `cobro-${c.id}`,
      fecha: c.fecha,
      tipo: "entrada",
      monto: c.monto * (1 - c.comisionPct / 100),
      concepto: `Cobro — ${c.orden.cliente.nombre.replace("Cliente Especial - ", "")}`,
      detalle: c.orden.folio,
      href: `/ordenes/${c.orden.id}`,
    });
  }

  for (const c of cobrosConsignacion) {
    movimientos.push({
      id: `cobroconsig-${c.id}`,
      fecha: c.fecha,
      tipo: "entrada",
      monto: c.monto * (1 - c.comisionPct / 100),
      concepto: `Pago de ${c.notaConsignacion.distribuidor.nombre}`,
      detalle: c.notaConsignacion.folio,
      href: `/notas-consignacion/${c.notaConsignacion.id}`,
    });
  }

  for (const p of pagos) {
    movimientos.push({
      id: `pago-${p.id}`,
      fecha: p.fecha,
      tipo: "salida",
      monto: montoEnMXN(p.moneda, p.monto, p.tipoCambio),
      concepto: p.concepto,
      detalle: p.pedido?.folio ?? "Gasto interno",
      href: p.pedido ? `/pedidos/${p.pedido.id}` : `/finanzas/pagos/${p.id}/editar`,
    });
  }

  for (const s of salidasRepuesto) {
    movimientos.push({
      id: `repuesto-${s.id}`,
      fecha: s.fecha,
      tipo: "entrada",
      monto: s.montoRepuesto ?? 0,
      concepto: "Reposición de consumo personal",
      detalle: null,
      href: `/finanzas/consumo-personal/${s.id}/editar`,
    });
  }

  movimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  const saldo = movimientos.reduce(
    (acc, m) => acc + (m.tipo === "entrada" ? m.monto : -m.monto),
    0,
  );

  return { saldo, movimientos };
}

export type MovimientoEstadoCuenta = {
  id: string;
  fecha: Date;
  concepto: string;
  cargo: number; // > 0 si es una orden (aumenta lo que debe)
  abono: number; // > 0 si es un pago (disminuye lo que debe)
  saldo: number; // acumulado hasta este movimiento
  ordenId: string;
};

/**
 * Estado de cuenta de un cliente: junta todas sus órdenes (cargo) y los
 * cobros de cada una (abono) en orden cronológico, con saldo acumulado.
 * Se calcula siempre en vivo a partir de Orden/Cobro — si Isaac edita una
 * orden ya pagada, el estado de cuenta refleja el cambio automáticamente,
 * no hay nada que "actualizar" a mano.
 */
export async function calcularEstadoCuentaCliente(clienteId: string) {
  const ordenes = await prisma.orden.findMany({
    where: { clienteId },
    include: { lineas: true, cobros: true },
    orderBy: { fecha: "asc" },
  });

  const crudos: Omit<MovimientoEstadoCuenta, "saldo">[] = [];

  for (const o of ordenes) {
    const total = o.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
    crudos.push({
      id: `orden-${o.id}`,
      fecha: o.fecha,
      concepto: `Orden ${o.folio}`,
      cargo: total,
      abono: 0,
      ordenId: o.id,
    });
    for (const c of o.cobros) {
      const cuentaTexto = c.cuenta === "EFECTIVO" ? "Efectivo" : "Transferencia";
      crudos.push({
        id: `cobro-${c.id}`,
        fecha: c.fecha,
        concepto: `Pago — ${cuentaTexto}${c.metodoPago ? ` (${c.metodoPago})` : ""}`,
        cargo: 0,
        abono: c.monto,
        ordenId: o.id,
      });
    }
  }

  crudos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  let saldo = 0;
  const movimientos: MovimientoEstadoCuenta[] = crudos.map((m) => {
    saldo += m.cargo - m.abono;
    return { ...m, saldo };
  });

  const totalFacturado = movimientos.reduce((acc, m) => acc + m.cargo, 0);
  const totalCobrado = movimientos.reduce((acc, m) => acc + m.abono, 0);

  return {
    movimientos,
    totalFacturado,
    totalCobrado,
    totalPendiente: totalFacturado - totalCobrado,
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
