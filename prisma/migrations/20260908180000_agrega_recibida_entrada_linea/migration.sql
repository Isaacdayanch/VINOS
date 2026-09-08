-- AlterTable
ALTER TABLE "EntradaLinea" ADD COLUMN     "recibida" BOOLEAN NOT NULL DEFAULT false;

-- Las entradas que ya existían representan mercancía que Isaac ya tenía físicamente
-- (datos históricos), así que cuentan como recibidas desde el día uno.
UPDATE "EntradaLinea" SET "recibida" = true;
