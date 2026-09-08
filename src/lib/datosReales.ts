import type { PrismaClient } from "@prisma/client";

type ProductoSeed = {
  key: string;
  nombre: string;
  sku: string;
  piezasPorCaja: number;
  proveedor: string;
  categoria: string;
  precioLista: number;
  precioDescuentoGrande: number;
};

const productos: ProductoSeed[] = [
  { key: "DAD-CS", nombre: "DADAH CABERNET SAUVIGNON", sku: "DAD-CS", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 1100, precioDescuentoGrande: 800 },
  { key: "DAD-MB", nombre: "DADAH MALBEC BARBERRA", sku: "DAD-MB", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 1100, precioDescuentoGrande: 800 },
  { key: "DAD-CSSR18", nombre: "DADAH CS SPECIAL RESERVE 2018", sku: "DAD-CSSR18", piezasPorCaja: 6, proveedor: "Rashbi Wines Corp", categoria: "Tinto Reserva", precioLista: 4050, precioDescuentoGrande: 2950 },
  { key: "DAD-PVR", nombre: "DADAH PETIT VERDOT RESERVE", sku: "DAD-PVR", piezasPorCaja: 6, proveedor: "Rashbi Wines Corp", categoria: "Tinto Reserva", precioLista: 2650, precioDescuentoGrande: 1950 },
  { key: "DAD-CSR", nombre: "DADAH CABERNET SAUVIGNON RESERVE", sku: "DAD-CSR", piezasPorCaja: 6, proveedor: "Rashbi Wines Corp", categoria: "Tinto Reserva", precioLista: 2650, precioDescuentoGrande: 1950 },
  { key: "TAN-ENO", nombre: "TANYA ENOSH", sku: "TAN-ENO", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 1900, precioDescuentoGrande: 1400 },
  { key: "TAN-CR", nombre: "TANYA CAB RESERVE", sku: "TAN-CR", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto Reserva", precioLista: 1200, precioDescuentoGrande: 900 },
  { key: "TAN-PVSF", nombre: "TANYA PETIT VERDOT SF", sku: "TAN-PVSF", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 900, precioDescuentoGrande: 650 },
  { key: "TAN-LH", nombre: "TANYA LATE HARVEST", sku: "TAN-LH", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Postre", precioLista: 850, precioDescuentoGrande: 650 },
  { key: "CHW-ROM", nombre: "CHALEY WINERY ROMI", sku: "CHW-ROM", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 1300, precioDescuentoGrande: 950 },
  { key: "CHW-LC", nombre: "CHALEY WINERY LIOR CABERNET", sku: "CHW-LC", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 1300, precioDescuentoGrande: 950 },
  { key: "CHW-ZCS", nombre: "CHALEY WINERY ZAHAV CABERNET SAUVIGNON", sku: "CHW-ZCS", piezasPorCaja: 12, proveedor: "Rashbi Wines Corp", categoria: "Tinto", precioLista: 900, precioDescuentoGrande: 650 },
];

// Costo por botella real (mercancía + logística prorrateada del pedido P001).
// Se recalcula en vivo con lib/costeo.ts; aquí solo se usa como "foto" histórica
// para las líneas de las órdenes ya vendidas.
const costoPorBotella: Record<string, number> = {
  "DAD-CS": 528.1689498,
  "DAD-MB": 528.1689498,
  "DAD-CSSR18": 2018.835616,
  "DAD-PVR": 1302.16895,
  "DAD-CSR": 1302.16895,
  "TAN-ENO": 949.5689498,
  "TAN-CR": 588.3689498,
  "TAN-PVSF": 442.1689498,
  "TAN-LH": 416.3689498,
  "CHW-ROM": 631.3689498,
  "CHW-LC": 631.3689498,
  "CHW-ZCS": 442.1689498,
};

/**
 * Carga los datos reales del negocio (importados del Google Sheets original
 * de Isaac) en una base de datos vacía. Empieza borrando lo que haya, así
 * que solo debe correrse una vez, contra una base recién creada.
 */
export async function sembrarDatosReales(prisma: PrismaClient) {
  await prisma.cobro.deleteMany();
  await prisma.ordenLinea.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.salida.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.entradaLinea.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.precioClienteProducto.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.socio.deleteMany();
  await prisma.producto.deleteMany();

  const productoIdPorKey = new Map<string, string>();
  for (const p of productos) {
    const creado = await prisma.producto.create({
      data: {
        nombre: p.nombre,
        sku: p.sku,
        piezasPorCaja: p.piezasPorCaja,
        proveedor: p.proveedor,
        categoria: p.categoria,
        precioLista: p.precioLista,
        precioDescuentoGrande: p.precioDescuentoGrande,
      },
    });
    productoIdPorKey.set(p.key, creado.id);
  }

  await prisma.socio.create({ data: { nombre: "Isaac" } });
  await prisma.socio.create({ data: { nombre: "Beto" } });

  const clientesSeed = [
    "Cliente Especial - Abraham Dayan",
    "Cliente Especial - Idan J. Anidjar",
    "Cliente Especial - Daniel Tuachi",
    "Cliente Especial - Eli Michan",
    "Cliente Especial - Yosef Senado",
  ];
  const clienteIdPorNombre = new Map<string, string>();
  for (const nombre of clientesSeed) {
    const creado = await prisma.cliente.create({
      data: { nombre, categoriaPrecio: "DESCUENTO_GRANDE" },
    });
    clienteIdPorNombre.set(nombre, creado.id);
  }

  const pedidoP001 = await prisma.pedido.create({
    data: {
      folio: "P001",
      fecha: new Date("2026-06-16"),
      proveedor: "Rashbi Wines Corp",
      tipoCambio: 17.2,
      logisticaUSD: 465, // flete
      logisticaMXN: 35000, // maniobras / aduana
    },
  });

  const entradasP001: { key: string; cajas: number; costoPorCaja: number }[] = [
    { key: "DAD-CS", cajas: 13, costoPorCaja: 300 },
    { key: "DAD-MB", cajas: 6, costoPorCaja: 300 },
    { key: "DAD-CSSR18", cajas: 11, costoPorCaja: 670 },
    { key: "DAD-PVR", cajas: 3, costoPorCaja: 420 },
    { key: "DAD-CSR", cajas: 7, costoPorCaja: 420 },
    { key: "TAN-ENO", cajas: 1, costoPorCaja: 594 },
    { key: "TAN-CR", cajas: 1, costoPorCaja: 342 },
    { key: "TAN-PVSF", cajas: 1, costoPorCaja: 240 },
    { key: "TAN-LH", cajas: 1, costoPorCaja: 222 },
    { key: "CHW-ROM", cajas: 1, costoPorCaja: 372 },
    { key: "CHW-LC", cajas: 1, costoPorCaja: 372 },
    { key: "CHW-ZCS", cajas: 1, costoPorCaja: 240 },
  ];

  for (const e of entradasP001) {
    const producto = productos.find((p) => p.key === e.key)!;
    await prisma.entradaLinea.create({
      data: {
        pedidoId: pedidoP001.id,
        productoId: productoIdPorKey.get(e.key)!,
        fecha: new Date("2026-07-03"),
        cajasRecibidas: e.cajas,
        piezasPorCaja: producto.piezasPorCaja,
        costoPorCaja: e.costoPorCaja,
        recibida: true,
      },
    });
  }

  await prisma.pago.create({
    data: {
      fecha: new Date("2026-07-03"),
      pedidoId: pedidoP001.id,
      concepto: "Mercancía",
      moneda: "USD",
      monto: 19528,
      tipoCambio: 17.2,
      metodoPago: "Transferencia",
      dividido: true,
    },
  });

  type LineaOrden = { key: string; botellas: number; precio: number };
  type OrdenSeed = {
    folio: string;
    cliente: string;
    fecha: string;
    estatus: string;
    lineas: LineaOrden[];
  };

  const ordenes: OrdenSeed[] = [
    {
      folio: "ORD-001",
      cliente: "Cliente Especial - Abraham Dayan",
      fecha: "2026-07-14",
      estatus: "Surtida - pendiente de pago",
      lineas: [
        { key: "DAD-CS", botellas: 1, precio: 750 },
        { key: "DAD-MB", botellas: 1, precio: 750 },
        { key: "DAD-CSSR18", botellas: 1, precio: 2850 },
        { key: "DAD-PVR", botellas: 1, precio: 1850 },
        { key: "DAD-CSR", botellas: 1, precio: 1850 },
        { key: "TAN-ENO", botellas: 1, precio: 1350 },
        { key: "TAN-CR", botellas: 1, precio: 850 },
        { key: "TAN-PVSF", botellas: 1, precio: 650 },
        { key: "CHW-ROM", botellas: 1, precio: 900 },
        { key: "CHW-LC", botellas: 1, precio: 900 },
      ],
    },
    {
      folio: "ORD-002",
      cliente: "Cliente Especial - Idan J. Anidjar",
      fecha: "2026-07-14",
      estatus: "Surtida y pagada",
      lineas: [
        { key: "DAD-CS", botellas: 1, precio: 750 },
        { key: "DAD-PVR", botellas: 1, precio: 1850 },
        { key: "DAD-CSR", botellas: 1, precio: 1850 },
        { key: "TAN-CR", botellas: 1, precio: 850 },
        { key: "CHW-ROM", botellas: 1, precio: 900 },
      ],
    },
    {
      folio: "ORD-003",
      cliente: "Cliente Especial - Daniel Tuachi",
      fecha: "2026-07-14",
      estatus: "Surtida - pendiente de pago",
      lineas: [
        { key: "DAD-CS", botellas: 1, precio: 800 },
        { key: "DAD-MB", botellas: 1, precio: 800 },
        { key: "DAD-CSSR18", botellas: 1, precio: 2950 },
        { key: "DAD-PVR", botellas: 1, precio: 1950 },
        { key: "DAD-CSR", botellas: 1, precio: 1950 },
        { key: "TAN-ENO", botellas: 1, precio: 1400 },
        { key: "TAN-CR", botellas: 1, precio: 900 },
        { key: "TAN-PVSF", botellas: 1, precio: 650 },
        { key: "CHW-ROM", botellas: 1, precio: 950 },
        { key: "CHW-LC", botellas: 1, precio: 950 },
        { key: "CHW-ZCS", botellas: 1, precio: 650 },
      ],
    },
    {
      folio: "ORD-005",
      cliente: "Cliente Especial - Eli Michan",
      fecha: "2026-07-24",
      estatus: "Surtida - pendiente de pago",
      lineas: [
        { key: "TAN-LH", botellas: 1, precio: 600 },
        { key: "CHW-ZCS", botellas: 1, precio: 650 },
        { key: "DAD-CS", botellas: 2, precio: 750 },
        { key: "DAD-MB", botellas: 2, precio: 750 },
        { key: "TAN-CR", botellas: 1, precio: 900 },
        { key: "TAN-PVSF", botellas: 1, precio: 800 },
        { key: "CHW-LC", botellas: 1, precio: 900 },
        { key: "TAN-ENO", botellas: 1, precio: 1300 },
        { key: "DAD-CSR", botellas: 1, precio: 1850 },
      ],
    },
    {
      folio: "ORD-006",
      cliente: "Cliente Especial - Yosef Senado",
      fecha: "2026-08-18",
      estatus: "Surtida - pendiente de pago",
      lineas: [
        { key: "DAD-CSSR18", botellas: 1, precio: 3200 },
        { key: "DAD-CSR", botellas: 1, precio: 2300 },
        { key: "DAD-PVR", botellas: 1, precio: 2300 },
        { key: "TAN-ENO", botellas: 1, precio: 1500 },
        { key: "TAN-CR", botellas: 1, precio: 1000 },
        { key: "DAD-MB", botellas: 1, precio: 900 },
      ],
    },
  ];

  for (const o of ordenes) {
    const orden = await prisma.orden.create({
      data: {
        folio: o.folio,
        fecha: new Date(o.fecha),
        clienteId: clienteIdPorNombre.get(o.cliente)!,
        estatus: o.estatus,
      },
    });
    for (const l of o.lineas) {
      const productoId = productoIdPorKey.get(l.key)!;
      await prisma.ordenLinea.create({
        data: {
          ordenId: orden.id,
          productoId,
          cantidadBotellas: l.botellas,
          precioUnitario: l.precio,
          costoUnitario: costoPorBotella[l.key],
        },
      });
      await prisma.salida.create({
        data: {
          fecha: new Date(o.fecha),
          productoId,
          botellas: l.botellas,
          motivo: "Venta",
          ordenId: orden.id,
        },
      });
    }
    if (o.estatus === "Surtida y pagada") {
      const total = o.lineas.reduce((acc, l) => acc + l.botellas * l.precio, 0);
      await prisma.cobro.create({
        data: {
          ordenId: orden.id,
          fecha: new Date(o.fecha),
          monto: total,
          metodoPago: "Transferencia",
        },
      });
    }
  }

  const salidasManuales: {
    key: string;
    botellas: number;
    fecha: string;
    motivo: string;
    notas: string;
  }[] = [
    { key: "DAD-CS", botellas: 1, fecha: "2026-07-06", motivo: "Muestra/Degustación", notas: "Probamos Beto y yo" },
    { key: "DAD-CSSR18", botellas: 1, fecha: "2026-07-06", motivo: "Muestra/Degustación", notas: "Probamos Beto y yo" },
    { key: "TAN-ENO", botellas: 1, fecha: "2026-07-06", motivo: "Muestra/Degustación", notas: "Probamos Beto y yo" },
    { key: "DAD-MB", botellas: 1, fecha: "2026-07-06", motivo: "Consumo interno", notas: "Isaac Dayan" },
    { key: "TAN-LH", botellas: 1, fecha: "2026-07-06", motivo: "Consumo interno", notas: "Beto Saad" },
    { key: "DAD-PVR", botellas: 1, fecha: "2026-07-15", motivo: "Consumo interno", notas: "OWNERS (Isaac & Beto)" },
    { key: "CHW-LC", botellas: 1, fecha: "2026-07-15", motivo: "Consumo interno", notas: "OWNERS (Isaac & Beto)" },
    // Nota: en el Sheet original, 4 botellas de la carpeta "ISAAC D." del 16/jul
    // (DAD-CS "Paim Kurson", DAD-CSR, TAN-LH, TAN-CR) tenían precio puesto pero
    // nunca se marcó su "Tipo de venta", así que el Sheet nunca las restó del
    // stock. Se dejan fuera aquí para que el inventario cuadre con lo que Isaac
    // ve hoy; hay que confirmar con él si esas botellas de verdad ya salieron.
    { key: "DAD-CSSR18", botellas: 1, fecha: "2026-08-17", motivo: "Consumo interno", notas: "OWNERS (Isaac & Beto)" },
    { key: "DAD-CSSR18", botellas: 1, fecha: "2026-08-24", motivo: "Venta directa (sin orden formal)", notas: "Isaac Dayan Chacalo" },
  ];

  for (const s of salidasManuales) {
    await prisma.salida.create({
      data: {
        fecha: new Date(s.fecha),
        productoId: productoIdPorKey.get(s.key)!,
        botellas: s.botellas,
        motivo: s.motivo,
        notas: s.notas,
      },
    });
  }
}
