-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "EntradaLinea" ADD COLUMN "ubicacionId" TEXT;

-- AlterTable
ALTER TABLE "Salida" ADD COLUMN "ubicacionId" TEXT;

-- AlterTable
ALTER TABLE "AjusteStock" ADD COLUMN "ubicacionId" TEXT;

-- AlterTable
ALTER TABLE "Orden" ADD COLUMN "ubicacionId" TEXT;

-- AlterTable
ALTER TABLE "NotaConsignacion" ADD COLUMN "ubicacionId" TEXT;

-- AddForeignKey
ALTER TABLE "EntradaLinea" ADD CONSTRAINT "EntradaLinea_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salida" ADD CONSTRAINT "Salida_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjusteStock" ADD CONSTRAINT "AjusteStock_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaConsignacion" ADD CONSTRAINT "NotaConsignacion_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "Ubicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Dos ubicaciones iniciales, para que los formularios no se queden vacíos
-- apenas se despliegue. Edita el nombre y la dirección reales desde
-- Stock -> "Editar ubicaciones" en el CRM (no hace falta volver a tocar SQL).
INSERT INTO "Ubicacion" ("id", "nombre") VALUES
  (gen_random_uuid()::text, 'Ubicación 1'),
  (gen_random_uuid()::text, 'Ubicación 2');
