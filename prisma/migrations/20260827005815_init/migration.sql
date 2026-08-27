-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "piezasPorCaja" INTEGER NOT NULL,
    "anio" INTEGER,
    "proveedor" TEXT,
    "categoria" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fotoUrl" TEXT,
    "stockMinimo" INTEGER,
    "precioLista" REAL,
    "precioDescuentoChico" REAL,
    "precioDescuentoGrande" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "categoriaPrecio" TEXT NOT NULL DEFAULT 'LISTA',
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PrecioClienteProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PrecioClienteProducto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrecioClienteProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "proveedor" TEXT,
    "tipoCambio" REAL,
    "logisticaUSD" REAL,
    "logisticaMXN" REAL,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EntradaLinea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "cajasRecibidas" REAL NOT NULL,
    "piezasPorCaja" INTEGER NOT NULL,
    "costoPorCaja" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EntradaLinea_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EntradaLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Orden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "clienteId" TEXT NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'Cotización',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Orden_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrdenLinea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ordenId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidadBotellas" INTEGER NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "costoUnitario" REAL NOT NULL,
    CONSTRAINT "OrdenLinea_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Salida" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL,
    "productoId" TEXT NOT NULL,
    "botellas" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "ordenId" TEXT,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Salida_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cobro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ordenId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "monto" REAL NOT NULL,
    "metodoPago" TEXT,
    "notas" TEXT,
    CONSTRAINT "Cobro_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL,
    "pedidoId" TEXT,
    "concepto" TEXT NOT NULL,
    "moneda" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "tipoCambio" REAL,
    "metodoPago" TEXT,
    "socioId" TEXT,
    "dividido" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pago_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pago_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "PrecioClienteProducto_clienteId_productoId_key" ON "PrecioClienteProducto"("clienteId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_folio_key" ON "Pedido"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "Orden_folio_key" ON "Orden"("folio");
