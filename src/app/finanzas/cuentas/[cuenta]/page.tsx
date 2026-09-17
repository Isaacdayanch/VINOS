import { calcularMovimientosCuenta, formatoMXN } from "@/lib/costeo";
import { CUENTAS } from "@/lib/cuentas";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DetalleCuentaPage({
  params,
}: PageProps<"/finanzas/cuentas/[cuenta]">) {
  const { cuenta: slug } = await params;
  const info = CUENTAS[slug as keyof typeof CUENTAS];
  if (!info) notFound();

  const { saldo, movimientos } = await calcularMovimientosCuenta(info.valor);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/finanzas/cuentas" className="text-sm text-wine underline">
            ← Volver a Cuentas
          </Link>
          <h1 className="text-2xl font-bold text-wine mt-2">
            {info.icono} {info.nombre}
          </h1>
        </div>
        <Link
          href={`/finanzas/cuentas/${slug}/imprimir`}
          className="text-sm text-wine underline whitespace-nowrap"
        >
          Ver estado de cuenta
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-4 flex items-center justify-between">
        <span className="font-medium">Saldo actual</span>
        <span className="font-bold text-wine text-xl">{formatoMXN(saldo)}</span>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {movimientos.map((m) => (
          <div key={m.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{m.concepto}</p>
              <p className="text-xs text-muted">
                {new Date(m.fecha).toLocaleDateString("es-MX")}
                {m.detalle ? ` · ${m.detalle}` : ""}
                {m.href && (
                  <>
                    {" · "}
                    <Link href={m.href} className="text-wine underline">
                      Ver / editar
                    </Link>
                  </>
                )}
              </p>
            </div>
            <span
              className={`font-semibold whitespace-nowrap ${
                m.tipo === "entrada" ? "text-ok" : "text-warn"
              }`}
            >
              {m.tipo === "entrada" ? "+" : "−"}
              {formatoMXN(m.monto)}
            </span>
          </div>
        ))}
        {movimientos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no hay movimientos en esta cuenta.
          </p>
        )}
      </div>
    </div>
  );
}
