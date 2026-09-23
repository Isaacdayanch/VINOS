import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_ACCESO, tokenEsperado } from "@/lib/auth";

// Dominio del catálogo público (ej. "catalogo-dadah.vercel.app"), configurado
// en Vercel como variable de entorno una vez que Isaac agregue ese dominio
// al proyecto. Mientras no esté puesta, este middleware no hace nada.
const DOMINIO_CATALOGO_PUBLICO = process.env.DOMINIO_CATALOGO_PUBLICO;

// Clave compartida para entrar al sistema (todo excepto el catálogo público).
// Mientras no esté puesta en Vercel, el sistema queda abierto (como antes).
const APP_PASSWORD = process.env.APP_PASSWORD;

function esRutaPublica(pathname: string) {
  return (
    pathname === "/catalogo-publico" ||
    pathname.startsWith("/catalogo-publico/") ||
    pathname === "/login"
  );
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  if (DOMINIO_CATALOGO_PUBLICO && host === DOMINIO_CATALOGO_PUBLICO) {
    // En el dominio del catálogo, cualquier ruta que no sea el catálogo se
    // manda ahí — en este dominio no existe forma de llegar al resto del
    // sistema, ni siquiera quitando parte del link.
    if (pathname !== "/catalogo-publico" && !pathname.startsWith("/catalogo-publico/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/catalogo-publico";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  if (esRutaPublica(pathname)) {
    return NextResponse.next();
  }

  if (!APP_PASSWORD) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_ACCESO)?.value;
  const esperado = await tokenEsperado(APP_PASSWORD);
  if (cookie === esperado) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("volver", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
