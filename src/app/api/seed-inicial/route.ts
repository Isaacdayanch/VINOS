import { prisma } from "@/lib/prisma";
import { sembrarDatosReales } from "@/lib/datosReales";
import { NextResponse } from "next/server";

// Ruta temporal para cargar los datos reales UNA sola vez en la base de datos
// de producción (desde este entorno de desarrollo no hay forma de conectarse
// directo a Supabase). Isaac la visita una vez después del primer despliegue
// y luego se elimina este archivo. Solo siembra si la base está vacía, para
// no arriesgar borrar datos reales ya capturados por accidente.
export async function GET() {
  const yaHayDatos = (await prisma.producto.count()) > 0;
  if (yaHayDatos) {
    return NextResponse.json(
      { error: "Ya hay productos en la base de datos, no se vuelve a sembrar." },
      { status: 409 },
    );
  }

  await sembrarDatosReales(prisma);
  return NextResponse.json({ ok: true, mensaje: "Datos reales cargados." });
}
