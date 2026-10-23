import { prisma } from "@/lib/prisma";
import { UbicacionesManager } from "@/components/UbicacionesManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UbicacionesPage() {
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

      <UbicacionesManager ubicaciones={ubicaciones} />

      {ubicaciones.length > 0 && (
        <Link href="/stock/repartir" className="text-sm text-wine underline">
          Repartir tu stock entre bodegas →
        </Link>
      )}
    </div>
  );
}
