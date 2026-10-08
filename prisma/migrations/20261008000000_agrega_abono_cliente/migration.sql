-- CreateTable
CREATE TABLE "AbonoCliente" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "cuenta" "Cuenta" NOT NULL DEFAULT 'EFECTIVO',
    "comisionPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metodoPago" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbonoCliente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AbonoCliente" ADD CONSTRAINT "AbonoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
