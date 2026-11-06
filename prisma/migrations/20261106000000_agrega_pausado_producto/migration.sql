-- Campo para pausar un producto a mano (ej. Isaac le queda 1 pieza que no
-- quiere vender), independiente de que el stock diga que hay existencia.
ALTER TABLE "Producto" ADD COLUMN IF NOT EXISTS "pausado" BOOLEAN NOT NULL DEFAULT false;
