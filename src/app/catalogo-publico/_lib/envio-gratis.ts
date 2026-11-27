/** Shipping rule shown on the public pages (built by getStorefront from the CRM settings). */
export type ReglaEnvio = { costo: number; gratisDesde: number | null; gratisDesdeMonto: number | null; zonas: string[] };

const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

/** "Envío gratis desde $2,500" (or by bottles), for the order prompts; null when there is no free shipping. */
export function textoEnvioGratis(regla: ReglaEnvio): string | null {
  if (regla.gratisDesdeMonto) return `Envío gratis desde ${pesos.format(regla.gratisDesdeMonto)}`;
  if (regla.gratisDesde) return `Envío gratis desde ${regla.gratisDesde} botella${regla.gratisDesde === 1 ? "" : "s"}`;
  return null;
}
