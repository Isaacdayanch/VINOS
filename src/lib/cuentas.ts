export const CUENTAS = {
  efectivo: { valor: "EFECTIVO" as const, nombre: "Efectivo", icono: "💵" },
  transferencia: { valor: "CUENTA" as const, nombre: "Transferencia", icono: "🏦" },
};

export type CuentaSlug = keyof typeof CUENTAS;
