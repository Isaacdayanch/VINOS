-- Pedidos en línea (carrito de lacava18.com).
-- Se puede correr varias veces sin que truene (IF NOT EXISTS / ON CONFLICT).

-- Zonas de entrega: a qué códigos postales se entrega y cuánto cuesta el envío.
CREATE TABLE IF NOT EXISTS "ZonaEntrega" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigosPostales" TEXT NOT NULL, -- inicios de CP separados por coma, ej. "01,02,03"
    "costoEnvio" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "botellasEnvioGratis" INTEGER, -- a partir de cuántas botellas el envío sale gratis (NULL = nunca)
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "temporal" BOOLEAN NOT NULL DEFAULT false, -- true = solo se prende en fechas festivas
    "nota" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZonaEntrega_pkey" PRIMARY KEY ("id")
);

-- Pedido tal como lo levantó el cliente en la página. Al aceptarse se convierte en una Orden normal.
CREATE TABLE IF NOT EXISTS "PedidoWeb" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL, -- ej. W-0001
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estatus" TEXT NOT NULL DEFAULT 'Nuevo', -- Nuevo / Confirmado / Entregado / Cancelado
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "calle" TEXT NOT NULL, -- calle y número
    "colonia" TEXT,
    "codigoPostal" TEXT NOT NULL,
    "ciudad" TEXT, -- alcaldía / municipio
    "referencias" TEXT, -- entre qué calles, color de la casa, etc.
    "notas" TEXT, -- comentarios del cliente
    "zonaId" TEXT,
    "botellas" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "envio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "avisoWhatsApp" TIMESTAMP(3), -- cuándo se mandó el aviso al grupo
    "avisoError" TEXT, -- si el aviso falló, por qué
    "clienteId" TEXT, -- cliente del CRM al que se ligó (al aceptar)
    "ordenId" TEXT, -- orden del CRM que se creó (al aceptar)
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PedidoWeb_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PedidoWeb_folio_key" ON "PedidoWeb"("folio");
CREATE UNIQUE INDEX IF NOT EXISTS "PedidoWeb_ordenId_key" ON "PedidoWeb"("ordenId");

-- Cada botella del pedido (se guarda el nombre y precio de ese momento).
CREATE TABLE IF NOT EXISTS "PedidoWebLinea" (
    "id" TEXT NOT NULL,
    "pedidoWebId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "cantidadBotellas" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PedidoWebLinea_pkey" PRIMARY KEY ("id")
);

-- Ajustes de la tienda en línea (llave → valor), ej. id del grupo de WhatsApp, tienda abierta/cerrada.
CREATE TABLE IF NOT EXISTS "ConfiguracionTienda" (
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfiguracionTienda_pkey" PRIMARY KEY ("clave")
);

-- Relaciones
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PedidoWeb_zonaId_fkey') THEN
    ALTER TABLE "PedidoWeb" ADD CONSTRAINT "PedidoWeb_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "ZonaEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PedidoWeb_clienteId_fkey') THEN
    ALTER TABLE "PedidoWeb" ADD CONSTRAINT "PedidoWeb_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PedidoWeb_ordenId_fkey') THEN
    ALTER TABLE "PedidoWeb" ADD CONSTRAINT "PedidoWeb_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PedidoWebLinea_pedidoWebId_fkey') THEN
    ALTER TABLE "PedidoWebLinea" ADD CONSTRAINT "PedidoWebLinea_pedidoWebId_fkey" FOREIGN KEY ("pedidoWebId") REFERENCES "PedidoWeb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PedidoWebLinea_productoId_fkey') THEN
    ALTER TABLE "PedidoWebLinea" ADD CONSTRAINT "PedidoWebLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Zonas iniciales acordadas con Isaac (5-nov-2026): 3 botellas o más = envío gratis; menos, $60.
-- CDMX = CP 01xxx a 16xxx (incluye Polanco). Edo. de México zona metropolitana = CP 50xxx a 57xxx
-- (incluye Tecamachalco, Bosques e Interlomas). Cuernavaca y Acapulco solo en fechas festivas (apagadas).
INSERT INTO "ZonaEntrega" ("id", "nombre", "codigosPostales", "costoEnvio", "botellasEnvioGratis", "activa", "temporal", "nota", "orden") VALUES
  ('czona_cdmx', 'Ciudad de México', '01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16', 60, 3, true, false, 'Incluye Polanco y todas las alcaldías', 1),
  ('czona_edomex', 'Zona metropolitana (Estado de México)', '50,51,52,53,54,55,56,57', 60, 3, true, false, 'Incluye Tecamachalco, Bosques e Interlomas', 2),
  ('czona_cuernavaca', 'Cuernavaca, Morelos', '62', 60, 3, false, true, 'Solo en fechas festivas', 3),
  ('czona_acapulco', 'Acapulco, Guerrero', '39', 60, 3, false, true, 'Solo en fechas festivas', 4)
ON CONFLICT ("id") DO NOTHING;
