// Configuración central del dominio del catálogo público.
//
// El catálogo (diseño, fotos, fichas) vive en su propio dominio dedicado,
// desplegado desde la rama `catalog-redesign` — separado de este CRM.
// Esta es la única variable que hay que tocar si ese dominio cambia.
//
// Mientras no esté puesta en Vercel, el sistema se comporta como antes
// (links relativos, sin redirigir) para no romper nada.
//
// Se lee en cada llamada (no al cargar el módulo) para que el middleware
// pueda reaccionar a la variable sin importar cuándo se definió.
function base(): string | null {
  const valor = process.env.URL_CATALOGO_PUBLICO?.replace(/\/+$/, "");
  return valor || null;
}

/** Construye el link al catálogo público para usar en el CRM (ej. "Ver catálogo público"). */
export function urlCatalogoPublico(ruta: string = "/catalogo-publico"): string {
  const b = base();
  if (!b) return ruta;
  return `${b}${ruta}`;
}

/** Host del dominio del catálogo (ej. "vinos-catalogo.vercel.app"), para el middleware. */
export function hostCatalogoPublico(): string | null {
  const b = base();
  if (!b) return null;
  try {
    return new URL(b).host;
  } catch {
    return null;
  }
}
