import { eliminarConsumoPersonal } from "@/app/finanzas/actions";
import { formatoMXN } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ConsumoPersonalListaPage() {
  const salidas = await prisma.salida.findMany({
    where: { motivo: "Consumo personal" },
    include: { producto: true, socio: true },
    orderBy: { fecha: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/finanzas" className="text-sm text-wine underline">
            ← Volver a Finanzas
          </Link>
          <h1 className="text-2xl font-bold text-wine mt-2">Consumo personal</h1>
          <p className="text-muted text-sm">Todas las botellas que se llevaron Isaac y Beto.</p>
        </div>
        <Link
          href="/finanzas/nuevo-consumo"
          className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium whitespace-nowrap"
        >
          + Consumo personal
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {salidas.map((s) => {
          const costo = (s.costoUnitario ?? 0) * s.botellas;
          return (
            <div key={s.id} className="p-4 flex items-center gap-3">
              <div className="w-9 aspect-[2/3] rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0 p-1">
                {s.producto.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.producto.fotoUrl}
                    alt={s.producto.nombre}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-lg">🍷</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.producto.nombre}</p>
                <p className="text-xs text-muted">
                  {new Date(s.fecha).toLocaleDateString("es-MX")} · {s.botellas} botella
                  {s.botellas === 1 ? "" : "s"} · {s.dividido ? "Isaac y Beto" : s.socio?.nombre ?? "?"}
                </p>
                <p className="text-xs text-muted">
                  {formatoMXN(costo)}
                  {s.montoRepuesto ? (
                    <>
                      {" "}
                      · repuso {formatoMXN(s.montoRepuesto)} (
                      {s.cuentaRepuesto === "CUENTA" ? "Cuenta" : "Efectivo"})
                    </>
                  ) : null}
                </p>
                {s.notas && <p className="text-xs text-muted italic">{s.notas}</p>}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Link
                  href={`/finanzas/consumo-personal/${s.id}/editar`}
                  className="text-xs text-wine underline"
                >
                  Editar
                </Link>
                <form action={eliminarConsumoPersonal}>
                  <input type="hidden" name="salidaId" value={s.id} />
                  <button type="submit" className="text-xs text-muted underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {salidas.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no hay consumos personales registrados.
          </p>
        )}
      </div>
    </div>
  );
}
