-- Envío en cada orden: lo que paga el cliente (entra al total y al recibo)
-- y lo que le cuesta a Isaac (gasto en Finanzas). Se puede correr dos veces.
ALTER TABLE "Orden" ADD COLUMN IF NOT EXISTS "envioCobrado" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Orden" ADD COLUMN IF NOT EXISTS "envioCosto" DOUBLE PRECISION;
