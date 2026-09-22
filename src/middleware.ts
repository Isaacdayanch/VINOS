import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dominio del catálogo público (ej. "catalogo-dadah.vercel.app"), configurado
// en Vercel como variable de entorno una vez que Isaac agregue ese dominio
// al proyecto. Mientras no esté puesta, este middleware no hace nada.
const DOMINIO_CATALOGO_PUBLICO = process.env.DOMINIO_CATALOGO_PUBLICO;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (DOMINIO_CATALOGO_PUBLICO && host === DOMINIO_CATALOGO_PUBLICO) {
    const url = request.nextUrl.clone();
    // Deja pasar el catálogo público y las fichas de cada vino (/catalogo-publico/[id]);
    // cualquier otra ruta (o la raíz "/") se manda al catálogo, para no exponer el resto del sistema.
    if (url.pathname !== "/catalogo-publico" && !url.pathname.startsWith("/catalogo-publico/")) {
      url.pathname = "/catalogo-publico";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
