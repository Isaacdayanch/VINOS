import { crearDistribuidor } from "@/app/(app)/distribuidores/actions";
import Link from "next/link";

export default async function NuevoDistribuidorPage({
  searchParams,
}: PageProps<"/distribuidores/nuevo">) {
  const params = await searchParams;
  const volver = typeof params.volver === "string" ? params.volver : undefined;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={volver || "/distribuidores"} className="text-sm text-wine underline">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo distribuidor</h1>
        <p className="text-muted text-sm">
          Un revendedor al que le das mercancía en consignación (no es un cliente directo).
        </p>
      </div>

      <form action={crearDistribuidor} className="flex flex-col gap-4">
        {volver && <input type="hidden" name="volver" value={volver} />}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nombre</span>
          <input
            name="nombre"
            required
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Teléfono (opcional)</span>
          <input
            name="telefono"
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Notas (opcional)</span>
          <input name="notas" className="rounded-md border border-border bg-surface px-3 py-2" />
        </label>
        <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
          Crear distribuidor
        </button>
      </form>
    </div>
  );
}
