import { calcularMovimientosCuenta, formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CuentasPage() {
  const [efectivo, transferencia] = await Promise.all([
    calcularMovimientosCuenta("EFECTIVO"),
    calcularMovimientosCuenta("CUENTA"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/finanzas" className="text-sm text-wine underline">
          ← Volver a Finanzas
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Cuentas</h1>
        <p className="text-muted text-sm">El saldo y los movimientos de cada cuenta.</p>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        <Link
          href="/finanzas/cuentas/efectivo"
          className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
        >
          <div>
            <p className="font-medium">💵 Efectivo</p>
            <p className="text-xs text-muted">{efectivo.movimientos.length} movimientos</p>
          </div>
          <span className="font-bold text-wine text-lg whitespace-nowrap">
            {formatoMXN(efectivo.saldo)}
          </span>
        </Link>
        <Link
          href="/finanzas/cuentas/transferencia"
          className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
        >
          <div>
            <p className="font-medium">🏦 Transferencia</p>
            <p className="text-xs text-muted">{transferencia.movimientos.length} movimientos</p>
          </div>
          <span className="font-bold text-wine text-lg whitespace-nowrap">
            {formatoMXN(transferencia.saldo)}
          </span>
        </Link>
      </div>
    </div>
  );
}
