-- CreateEnum
CREATE TYPE "Cuenta" AS ENUM ('EFECTIVO', 'CUENTA');

-- CreateEnum
CREATE TYPE "OrigenPago" AS ENUM ('INYECCION_CAPITAL', 'REINVERSION');

-- AlterTable
ALTER TABLE "Salida" ADD COLUMN     "costoUnitario" DOUBLE PRECISION,
ADD COLUMN     "dividido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "socioId" TEXT;

-- AlterTable
ALTER TABLE "Cobro" ADD COLUMN     "comisionPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "cuenta" "Cuenta" NOT NULL DEFAULT 'EFECTIVO';

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "cuenta" "Cuenta" NOT NULL DEFAULT 'EFECTIVO',
ADD COLUMN     "origen" "OrigenPago" NOT NULL DEFAULT 'REINVERSION';

-- AddForeignKey
ALTER TABLE "Salida" ADD CONSTRAINT "Salida_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Los pagos que ya existían (el pago inicial de mercancía de P001) fueron
-- capital que puso Isaac de su bolsillo al arrancar el negocio, no dinero
-- reinvertido de ventas pasadas.
UPDATE "Pago" SET "origen" = 'INYECCION_CAPITAL', "cuenta" = 'CUENTA';
