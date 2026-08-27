import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [resumen, productos, cobros, ordenes] = await Promise.all([
    calcularResumenInventario(),
    prisma.producto.findMany(),
    prisma.cobro.findMany(),
    prisma.orden.findMany({
      include: { lineas: true, cliente: true },
      orderBy: { fecha: "desc" },
    }),
  ]);

  let valorInventario = 0;
  let totalBotellas = 0;
  const alertas: { nombre: string; stock: number; minimo: number }[] = [];

  for (const p of productos) {
    const r = resumen.get(p.id);
    if (!r) continue;
    valorInventario += r.valorInventario;
    totalBotellas += r.stockActual;
    const minimo = p.stockMinimo ?? 8;
    if (r.stockActual <= minimo) {
      alertas.push({ nombre: p.nombre, stock: r.stockActual, minimo });
    }
  }

  let ventasTotales = 0;
  let costoTotal = 0;
  for (const o of ordenes) {
    for (const l of o.lineas) {
      ventasTotales += l.cantidadBotellas * l.precioUnitario;
      costoTotal += l.cantidadBotellas * l.costoUnitario;
    }
  }
  const gananciaTotal = ventasTotales - costoTotal;

  const totalCobrado = cobros.reduce((acc, c) => acc + c.monto, 0);
  const totalPendiente = ventasTotales - totalCobrado;

  const topProductos = [...productos]
    .map((p) => ({ p, r: resumen.get(p.id) }))
    .filter((x) => x.r)
    .sort((a, b) => (b.r!.stockActual) - (a.r!.stockActual))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-wine">Dashboard</h1>
        <p className="text-muted text-sm">Resumen general de tu negocio de vinos</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Valor del inventario" value={formatoMXN(valorInventario)} />
        <StatCard label="Botellas en stock" value={totalBotellas.toString()} />
        <StatCard label="Ganancia total" value={formatoMXN(gananciaTotal)} />
        <StatCard label="Cobrado" value={formatoMXN(totalCobrado)} sub={`Pendiente: ${formatoMXN(totalPendiente)}`} />
      </div>

      {alertas.length > 0 && (
        <div className="rounded-lg border border-warn bg-warn-bg p-4">
          <h2 className="font-semibold text-warn mb-2">⚠ Vinos con poco stock</h2>
          <ul className="text-sm flex flex-col gap-1">
            {alertas.map((a) => (
              <li key={a.nombre} className="flex justify-between">
                <span>{a.nombre}</span>
                <span className="text-muted">{a.stock} botellas (mínimo {a.minimo})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Inventario por vino</h2>
          <Link href="/stock" className="text-sm text-wine underline">
            Ver todo
          </Link>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {topProductos.map(({ p, r }) => (
            <li key={p.id} className="flex justify-between">
              <span>{p.nombre}</span>
              <span className="text-muted">{r!.stockActual} botellas</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <h2 className="font-semibold mb-3">Últimas órdenes</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {ordenes.slice(0, 5).map((o) => {
            const total = o.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
            return (
              <li key={o.id} className="flex justify-between">
                <span>
                  {o.folio} · {o.cliente.nombre.replace("Cliente Especial - ", "")}
                </span>
                <span className="text-muted">{formatoMXN(total)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-bold text-wine mt-1">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}
