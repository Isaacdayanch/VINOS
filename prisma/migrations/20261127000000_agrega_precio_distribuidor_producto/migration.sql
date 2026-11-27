-- Recuerda el último precio que le diste a cada distribuidor por vino,
-- igual que ya se hace con los clientes (PrecioClienteProducto).
CREATE TABLE IF NOT EXISTS "PrecioDistribuidorProducto" (
    "id" TEXT NOT NULL,
    "distribuidorId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrecioDistribuidorProducto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PrecioDistribuidorProducto_distribuidorId_productoId_key"
    ON "PrecioDistribuidorProducto"("distribuidorId", "productoId");

ALTER TABLE "PrecioDistribuidorProducto"
    ADD CONSTRAINT "PrecioDistribuidorProducto_distribuidorId_fkey"
    FOREIGN KEY ("distribuidorId") REFERENCES "Distribuidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PrecioDistribuidorProducto"
    ADD CONSTRAINT "PrecioDistribuidorProducto_productoId_fkey"
    FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- "Rashbi Wine Corp" y "Rashbi Wines Corp" son el mismo proveedor (confirmado
-- por Isaac, 27-nov-2026): se dejan todos con el mismo nombre para que no
-- cuenten como dos proveedores distintos.
UPDATE "Pedido" SET "proveedor" = 'Rashbi Wines Corp' WHERE "proveedor" = 'Rashbi Wine Corp';
