import { PrismaClient } from "@/generated/prisma/client";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// La URL "file:./dev.db" del .env está pensada para el CLI de Prisma (que la
// resuelve relativa a prisma/schema.prisma). En tiempo de ejecución Next.js
// resuelve rutas relativas a la raíz del proyecto, así que aquí se arma una
// ruta absoluta hacia el mismo archivo para que ambos apunten al mismo lugar.
const datasourceUrl = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
