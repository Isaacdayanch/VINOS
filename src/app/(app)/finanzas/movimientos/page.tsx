import { calcularMovimientosFinanzas, formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MovimientosFinanzasPage() {
  const movimientos = await calcularMovimientosFinanzas();

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/finanzas" className="text-sm text-wine underline">
          ← Volver a Finanzas
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Movimientos de dinero</h1>
        <p className="text-muted text-sm">Efectivo y Transferencia, todo junto.</p>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {movimientos.map((m) => {
          const fila = (
            <div className="p-4 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium truncate">{m.concepto}</p>
                <p className="text-xs text-muted">
                  {new Date(m.fecha).toLocaleDateString("es-MX")} ·{" "}
                  {m.cuenta === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                  {m.detalle ? ` · ${m.detalle}` : ""}
                </p>
              </div>
              <span
                className={`font-semibold whitespace-nowrap ${m.tipo === "entrada" ? "text-ok" : "text-warn"}`}
              >
                {m.tipo === "entrada" ? "+" : "-"}
                {formatoMXN(m.monto)}
              </span>
            </div>
          );
          return m.href ? (
            <Link key={m.id} href={m.href} className="block hover:bg-wine-light/40">
              {fila}
            </Link>
          ) : (
            <div key={m.id}>{fila}</div>
          );
        })}
        {movimientos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">Todavía no hay movimientos.</p>
        )}
      </div>
    </div>
  );
}
