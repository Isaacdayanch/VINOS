import { prisma } from "@/lib/prisma";
import { calcularEstadoCuentaCliente, formatoMXN } from "@/lib/costeo";
import { asegurarCodigoCliente } from "@/lib/clienteCodigo";
import { BotonImprimir } from "@/components/BotonImprimir";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EstadoCuentaClientePage({
  params,
}: PageProps<"/clientes/[id]/estado-cuenta">) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) notFound();

  const [codigo, { movimientos, totalFacturado, totalCobrado, totalPendiente }] =
    await Promise.all([asegurarCodigoCliente(cliente), calcularEstadoCuentaCliente(id)]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between print:hidden mb-6">
        <Link href={`/clientes/${cliente.id}`} className="text-sm text-wine underline">
          ← Volver al cliente
        </Link>
        <BotonImprimir />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-wine">Estado de cuenta</h1>
        <p className="text-muted text-sm">
          {cliente.nombre.replace("Cliente Especial - ", "")} · {codigo}
          {cliente.telefono ? ` · ${cliente.telefono}` : ""}
        </p>
        <p className="text-muted text-xs mt-1">
          Generado el {new Date().toLocaleDateString("es-MX")}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden mb-6">
        {movimientos.map((m) => (
          <div key={m.id} className="p-3 flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="truncate">{m.concepto}</p>
              <p className="text-xs text-muted">{new Date(m.fecha).toLocaleDateString("es-MX")}</p>
            </div>
            <div className="text-right whitespace-nowrap">
              {m.cargo > 0 && <p className="font-medium">{formatoMXN(m.cargo)}</p>}
              {m.abono > 0 && <p className="text-ok">-{formatoMXN(m.abono)}</p>}
              <p className="text-xs text-muted">Saldo {formatoMXN(m.saldo)}</p>
            </div>
          </div>
        ))}
        {movimientos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">Sin movimientos todavía.</p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-wine-light p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span>Total facturado</span>
          <span>{formatoMXN(totalFacturado)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Total cobrado</span>
          <span>{formatoMXN(totalCobrado)}</span>
        </div>
        <div
          className={`flex items-center justify-between font-bold text-lg mt-1 ${
            totalPendiente < -0.5 ? "text-ok" : "text-wine"
          }`}
        >
          <span>
            {totalPendiente > 0.5
              ? "Saldo pendiente"
              : totalPendiente < -0.5
                ? "Saldo a favor del cliente"
                : "Saldo"}
          </span>
          <span>{formatoMXN(Math.abs(totalPendiente))}</span>
        </div>
      </div>
    </div>
  );
}
