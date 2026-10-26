import { consolidarTodoEnUbicacion } from "@/app/(app)/stock/actions";
import { BotonEliminarConfirmado } from "@/components/BotonEliminarConfirmado";
import { prisma } from "@/lib/prisma";
import { UbicacionesManager } from "@/components/UbicacionesManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UbicacionesPage({
  searchParams,
}: PageProps<"/stock/ubicaciones">) {
  const sp = await searchParams;
  const transferido = sp.transferido === "1";
  const consolidado = sp.consolidado === "1";
  const ubicaciones = await prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock" className="text-sm text-wine underline">
          ← Volver a Stock
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Ubicaciones</h1>
        <p className="text-muted text-sm">
          Las bodegas donde guardas tu inventario. Al registrar una entrada, una salida, una
          orden o un ajuste, eliges a cuál pertenece.
        </p>
      </div>

      {transferido && (
        <div className="rounded-lg border border-ok/40 bg-surface p-4 text-sm text-ok font-medium">
          ✓ Listo, ya quedó transferido el stock.
        </div>
      )}

      {consolidado && (
        <div className="rounded-lg border border-ok/40 bg-surface p-4 text-sm text-ok font-medium">
          ✓ Listo, ya quedó todo tu stock junto en esa bodega.
        </div>
      )}

      <UbicacionesManager ubicaciones={ubicaciones} />

      {ubicaciones.length >= 2 && (
        <div className="rounded-lg border border-wine/40 bg-wine-light/30 p-4 flex flex-col gap-2">
          <p className="font-medium text-wine">Transferencia pendiente a Quijote 9</p>
          <p className="text-xs text-muted">
            Herramienta de un solo uso para pasar lo que ya mandaste a Quijote 9, descontándolo
            de 689. Cuando quede confirmada se quita de aquí.
          </p>
          <Link
            href="/stock/transferir"
            className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium self-start"
          >
            Ir a transferir
          </Link>
        </div>
      )}

      {ubicaciones.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
          <div>
            <p className="font-medium">Juntar todo tu stock actual en una bodega</p>
            <p className="text-xs text-muted mt-1">
              Para empezar: junta todo lo que tienes repartido (sin bodega asignada, o en
              cualquier otra bodega, aunque ahí se vea en negativo por ventas viejas) en la
              bodega que elijas, y deja las demás en cero. El total (Consolidado) nunca cambia,
              solo dice en dónde está. De ahí, para pasar botellas a otra bodega, usa
              &quot;Ajustar&quot; en cada vino, o la herramienta de transferencia.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ubicaciones.map((u) => (
              <BotonEliminarConfirmado
                key={u.id}
                action={consolidarTodoEnUbicacion.bind(null, u.id)}
                mensaje={`¿Juntar todo tu stock actual en "${u.nombre}" y dejar las demás bodegas en cero? Esto no cambia el Consolidado, solo dice en dónde está.`}
                className="rounded-md bg-wine text-white px-3 py-2 text-sm font-medium"
              >
                Todo a {u.nombre}
              </BotonEliminarConfirmado>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
