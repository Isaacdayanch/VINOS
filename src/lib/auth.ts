export const COOKIE_ACCESO = "vinos_acceso";

export async function tokenEsperado(password: string): Promise<string> {
  const data = new TextEncoder().encode(`vinos-crm:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
