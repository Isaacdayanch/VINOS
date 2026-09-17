import { calcularMovimientosCuenta, formatoMXN } from "@/lib/costeo";
import { CUENTAS } from "@/lib/cuentas";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/finanzas/cuentas/[cuenta]/imprimir">) {
  const { cuenta: slug } = await params;
  const info = CUENTAS[slug as keyof typeof CUENTAS];
  return { title: `Vinos - ${info?.nombre ?? "Cuenta"}` };
}

export default async function ImprimirCuentaPage({
  params,
}: PageProps<"/finanzas/cuentas/[cuenta]/imprimir">) {
  const { cuenta: slug } = await params;
  const info = CUENTAS[slug as keyof typeof CUENTAS];
  if (!info) notFound();

  const { saldo, movimientos } = await calcularMovimientosCuenta(info.valor);
  const hoy = new Date().toLocaleDateString("es-MX");

  return (
    <div className="flex flex-col gap-6 bg-background print:bg-background">
      <div className="flex items-center justify-between print:hidden">
        <Link href={`/finanzas/cuentas/${slug}`} className="text-sm text-wine underline">
          ← Volver a la cuenta
        </Link>
        <BotonImprimir />
      </div>

      <div className="max-w-xl mx-auto w-full bg-background print:p-4 p-4 text-[12px] leading-snug">
        <div className="text-center print-no-break pb-0.5 mb-2">
          <h1 className="text-lg font-bold text-wine">Vinos</h1>
          <p className="text-[11px] text-muted">
            Estado de cuenta — {info.icono} {info.nombre}
          </p>
          <p className="text-[10px] text-muted">Al {hoy}</p>
        </div>

        <div className="print-no-break flex justify-between border-y border-border py-1.5 mb-2">
          <span className="font-medium">Saldo actual</span>
          <span className="font-bold text-wine">{formatoMXN(saldo)}</span>
        </div>

        <table className="w-full border-separate border-spacing-0">
          <colgroup>
            <col className="w-16" />
            <col />
            <col className="w-20" />
          </colgroup>
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="pb-1 pr-2 font-medium">Fecha</th>
              <th className="pb-1 px-2 font-medium">Concepto</th>
              <th className="pb-1 pl-2 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id} className="print-item border-b border-border/50 break-inside-avoid">
                <td className="py-1 pr-2 whitespace-nowrap">
                  {new Date(m.fecha).toLocaleDateString("es-MX")}
                </td>
                <td className="py-1 px-2">
                  {m.concepto}
                  {m.detalle ? ` · ${m.detalle}` : ""}
                </td>
                <td
                  className={`py-1 pl-2 text-right tabular-nums font-medium whitespace-nowrap ${
                    m.tipo === "entrada" ? "text-ok" : "text-warn"
                  }`}
                >
                  {m.tipo === "entrada" ? "+" : "−"}
                  {formatoMXN(m.monto)}
                </td>
              </tr>
            ))}
            {movimientos.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-muted">
                  Sin movimientos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
