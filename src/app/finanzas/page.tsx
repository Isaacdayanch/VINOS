import { calcularFinanzas, formatoMXN } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  const [finanzas, pagos] = await Promise.all([
    calcularFinanzas(),
    prisma.pago.findMany({
      include: { pedido: true, socio: true },
      orderBy: { fecha: "desc" },
      take: 15,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-wine">Finanzas</h1>
          <p className="text-muted text-sm">Dinero del negocio y entre socios</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/finanzas/nuevo-pago"
            className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium whitespace-nowrap"
          >
            + Pago / gasto
          </Link>
          <Link href="/finanzas/nuevo-consumo" className="text-xs text-wine underline whitespace-nowrap">
            + Consumo personal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Inversión total" value={formatoMXN(finanzas.inversionTotal)} />
        <StatCard label="Valor en stock" value={formatoMXN(finanzas.valorInventario)} />
        <StatCard label="Por cobrar" value={formatoMXN(finanzas.totalPendiente)} />
        <StatCard label="Cobrado" value={formatoMXN(finanzas.totalCobrado)} />
        <StatCard label="Ganancia" value={formatoMXN(finanzas.gananciaTotal)} />
        <StatCard label="Botellas en stock" value={finanzas.botellasStock.toString()} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="💵 Caja (efectivo)" value={formatoMXN(finanzas.saldoCaja)} />
        <StatCard label="🏦 Cuenta" value={formatoMXN(finanzas.saldoCuenta)} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <h2 className="font-semibold">Saldo entre socios</h2>
        {finanzas.saldoEntreSocios ? (
          <p className="text-sm">
            <span className="font-semibold text-wine">{finanzas.saldoEntreSocios.deudorNombre}</span>{" "}
            le debe a{" "}
            <span className="font-semibold text-wine">{finanzas.saldoEntreSocios.acreedorNombre}</span>:{" "}
            <span className="font-bold">{formatoMXN(finanzas.saldoEntreSocios.monto)}</span>
          </p>
        ) : (
          <p className="text-sm text-muted">Están a mano.</p>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {finanzas.socios.map((s) => (
            <div key={s.socioId} className="rounded-md border border-border p-3">
              <p className="font-medium">{s.nombre}</p>
              <p className="text-xs text-muted mt-1">Aportado: {formatoMXN(s.aportado)}</p>
              <p className="text-xs text-muted">Consumo personal: {formatoMXN(s.consumoPersonal)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        <div className="p-4">
          <h2 className="font-semibold">Pagos y gastos recientes</h2>
        </div>
        {pagos.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium truncate">
                {p.concepto} {p.pedido ? `· ${p.pedido.folio}` : "· Gasto interno"}
              </p>
              <p className="text-xs text-muted">
                {new Date(p.fecha).toLocaleDateString("es-MX")} ·{" "}
                {p.origen === "INYECCION_CAPITAL" ? "Inyección de capital" : "Reinversión"} ·{" "}
                {p.cuenta === "EFECTIVO" ? "Caja" : "Cuenta"}
                {p.socio ? ` · ${p.socio.nombre}` : p.dividido ? " · Isaac y Beto" : ""}
              </p>
            </div>
            <span className="font-semibold whitespace-nowrap">
              {p.moneda === "USD" ? `$${p.monto} USD` : formatoMXN(p.monto)}
            </span>
          </div>
        ))}
        {pagos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">Todavía no hay pagos registrados.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-bold text-wine mt-1">{value}</p>
    </div>
  );
}
