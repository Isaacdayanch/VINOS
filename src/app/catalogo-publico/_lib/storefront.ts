import "server-only";
import { cache } from "react";
import { leerConfiguracion, pedidosAbiertos, zonasEntrega } from "@/lib/tienda";
import type { ReglaEnvio } from "../_components/CartDrawer";

/** Shipping rule and open/closed state shown on every public page (one read per request). */
export const getStorefront = cache(async (): Promise<{ regla: ReglaEnvio; abierto: boolean }> => {
  const [zonas, config] = await Promise.all([zonasEntrega(), leerConfiguracion()]);
  const activas = zonas.filter(zona => zona.activa);
  const costo = Math.max(0, ...activas.map(zona => zona.costoEnvio));
  const gratis = activas.map(zona => zona.botellasEnvioGratis).filter((n): n is number => n !== null);
  return {
    regla: { costo: Number.isFinite(costo) ? costo : 0, gratisDesde: gratis.length ? Math.max(...gratis) : null, zonas: activas.map(zona => zona.nombre) },
    abierto: pedidosAbiertos(config),
  };
});
