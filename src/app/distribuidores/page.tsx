import { calcularResumenDistribuidores } from "@/lib/consignacion";
import { formatoMXN } from "@/lib/costeo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DistribuidoresPage() {
  const distribuidores = await calcularResumenDistribuidores();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-wine">Distribuidores</h1>
          <p className="text-muted text-sm">Revendedores con mercancía en consignación</p>
        </div>
        <Link
          href="/distribuidores/nuevo"
          className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium whitespace-nowrap"
        >
          + Nuevo
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {distribuidores.map((d) => (
          <Link
            key={d.id}
            href={`/distribuidores/${d.id}`}
            className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{d.nombre}</p>
              <p className="text-xs text-muted">{d.telefono || "Sin teléfono"}</p>
            </div>
            {d.pendiente > 0.5 ? (
              <span className="font-semibold text-warn whitespace-nowrap">
                {formatoMXN(d.pendiente)} pendiente
              </span>
            ) : (
              <span className="text-xs text-ok font-medium whitespace-nowrap">Al corriente</span>
            )}
          </Link>
        ))}
        {distribuidores.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes distribuidores.{" "}
            <Link href="/distribuidores/nuevo" className="text-wine underline">
              Da de alta el primero
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
