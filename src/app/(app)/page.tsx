import { prisma } from "@/lib/prisma";
import {
  calcularResumenInventario,
  calcularMovimientosStock,
  calcularMovimientosFinanzas,
  formatoMXN,
} from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ETIQUETA_TIPO_STOCK: Record<string, string> = {
  entrada: "Entrada",
  salida: "Salida",
  ajuste: "Ajuste",
};

export default async function DashboardPage() {
  const [resumen, productos, cobros, ordenes, movimientosStock, movimientosFinanzas] =
    await Promise.all([
      calcularResumenInventario(),
      prisma.producto.findMany(),
      prisma.cobro.findMany(),
      prisma.orden.findMany({
        include: { lineas: true, cliente: true },
        orderBy: { fecha: "desc" },
      }),
      calcularMovimientosStock(5),
      calcularMovimientosFinanzas(5),
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
        <StatCard icon="💰" label="Valor del inventario" value={formatoMXN(valorInventario)} tono="text-wine" />
        <StatCard icon="🍷" label="Botellas en stock" value={totalBotellas.toString()} tono="text-foreground" />
        <StatCard icon="📈" label="Ganancia total" value={formatoMXN(gananciaTotal)} tono="text-ok" />
        <StatCard
          icon="💵"
          label="Cobrado"
          value={formatoMXN(totalCobrado)}
          sub={`Pendiente: ${formatoMXN(totalPendiente)}`}
          tono="text-wine"
        />
      </div>

      {alertas.length > 0 && (
        <div className="rounded-xl border border-warn/40 bg-warn-bg p-4">
          <h2 className="font-semibold text-warn mb-2">⚠ Vinos con poco stock</h2>
          <ul className="text-sm flex flex-col gap-1">
            {alertas.map((a) => (
              <li key={a.nombre} className="flex justify-between text-warn">
                <span>{a.nombre}</span>
                <span className="opacity-80">{a.stock} botellas (mínimo {a.minimo})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">🍷 Inventario por vino</h2>
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

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="font-semibold mb-3">🧾 Últimas órdenes</h2>
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
          {ordenes.length === 0 && <p className="text-center text-muted text-sm py-2">Sin órdenes todavía.</p>}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-3">🕒 Últimos movimientos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1">
            <p className="text-sm font-medium mb-2">📦 Stock</p>
            {movimientosStock.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm gap-2">
                <span className="truncate">
                  {ETIQUETA_TIPO_STOCK[m.tipo]} · {m.producto}
                </span>
                <span className={`whitespace-nowrap ${m.signo > 0 ? "text-ok" : "text-warn"}`}>
                  {m.signo > 0 ? "+" : "-"}
                  {m.botellas}
                </span>
              </div>
            ))}
            {movimientosStock.length === 0 && (
              <p className="text-center text-muted text-sm py-2">Sin movimientos todavía.</p>
            )}
            <Link href="/stock/movimientos" className="text-xs text-wine underline mt-2 self-start">
              Ver más movimientos de stock →
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1">
            <p className="text-sm font-medium mb-2">💵 Dinero</p>
            {movimientosFinanzas.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm gap-2">
                <span className="truncate">{m.concepto}</span>
                <span className={`whitespace-nowrap ${m.tipo === "entrada" ? "text-ok" : "text-warn"}`}>
                  {m.tipo === "entrada" ? "+" : "-"}
                  {formatoMXN(m.monto)}
                </span>
              </div>
            ))}
            {movimientosFinanzas.length === 0 && (
              <p className="text-center text-muted text-sm py-2">Sin movimientos todavía.</p>
            )}
            <Link href="/finanzas/movimientos" className="text-xs text-wine underline mt-2 self-start">
              Ver más movimientos de dinero →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tono,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  tono: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-base leading-none">{icon}</span>
        <p className="text-xs text-muted">{label}</p>
      </div>
      <p className={`text-xl font-bold ${tono}`}>{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}
