import { PrismaClient } from "../src/generated/prisma/client";
import { sembrarDatosReales } from "../src/lib/datosReales";

const prisma = new PrismaClient();

sembrarDatosReales(prisma)
  .then(() => console.log("Listo. Datos reales importados."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
