import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js no estaba empacando el motor nativo de Prisma
  // (libquery_engine-rhel-openssl-3.0.x.so.node) en las funciones que corren
  // en Vercel, porque el generator "prisma-client" (no "prisma-client-js")
  // no tiene el mismo soporte automático de rastreo de archivos. Se incluye
  // a mano para todas las rutas.
  outputFileTracingIncludes: {
    "/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
