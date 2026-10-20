-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('VINO', 'DESTILADO');

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN "tipo" "TipoProducto" NOT NULL DEFAULT 'VINO';
