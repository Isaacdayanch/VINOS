-- CreateEnum
CREATE TYPE "TipoDistribuidor" AS ENUM ('DISTRIBUIDOR', 'EVENTO');

-- AlterTable
ALTER TABLE "Distribuidor" ADD COLUMN "tipo" "TipoDistribuidor" NOT NULL DEFAULT 'DISTRIBUIDOR';
ALTER TABLE "Distribuidor" ADD COLUMN "clienteId" TEXT;
ALTER TABLE "Distribuidor" ADD COLUMN "fechaEvento" TIMESTAMP(3);
ALTER TABLE "Distribuidor" ADD COLUMN "listoEvento" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NotaConsignacionLinea" ADD COLUMN "botellasPagadas" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NotaConsignacionLinea" ADD COLUMN "botellasDevueltas" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Distribuidor" ADD CONSTRAINT "Distribuidor_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
