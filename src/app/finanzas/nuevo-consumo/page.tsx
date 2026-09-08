import { crearConsumoPersonal } from "@/app/finanzas/actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevoConsumoPersonalPage() {
  const [productos, socios] = await Promise.all([
    prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.socio.findMany(),
  ]);
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/finanzas" className="text-sm text-wine underline">
          ← Volver a Finanzas
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Registrar consumo personal</h1>
        <p className="text-muted text-sm">
          Cuando alguien se lleva una botella para consumo propio (no es venta). Sale del
          stock y se anota el costo a nombre de quién se la llevó.
        </p>
      </div>

      <form action={crearConsumoPersonal} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Producto</span>
          <select
            name="productoId"
            className="rounded-md border border-border bg-surface px-3 py-2"
            required
          >
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Fecha</span>
          <input
            name="fecha"
            type="date"
            defaultValue={hoy}
            className="rounded-md border border-border bg-surface px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Botellas</span>
          <input
            name="botellas"
            type="number"
            step="1"
            min="1"
            className="rounded-md border border-border bg-surface px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">¿Quién se la llevó?</span>
          <select
            name="quien"
            className="rounded-md border border-border bg-surface px-3 py-2"
            required
          >
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
            <option value="COMPARTIDO">Isaac y Beto (se la repartieron)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Notas (opcional)</span>
          <input name="notas" className="rounded-md border border-border bg-surface px-3 py-2" />
        </label>

        <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
          Registrar
        </button>
      </form>
    </div>
  );
}
