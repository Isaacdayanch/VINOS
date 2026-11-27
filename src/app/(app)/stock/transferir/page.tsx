import { prisma } from "@/lib/prisma";
import { calcularStockPorUbicacion } from "@/lib/costeo";
import { transferirLoteUbicaciones } from "@/app/(app)/stock/actions";
import { TransferirLoteForm } from "@/components/TransferirLoteForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransferirStockPage() {
  const [productos, ubicaciones, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({
      select: { id: true, nombre: true, fotoUrl: true, piezasPorCaja: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularStockPorUbicacion(),
  ]);

  if (ubicaciones.length < 2) {
    return (
      <div className="flex flex-col gap-4 max-w-lg">
        <Link href="/stock/ubicaciones" className="text-sm text-wine underline">
          ← Volver a Ubicaciones
        </Link>
        <p className="text-warn text-sm">
          Necesitas al menos 2 bodegas creadas para poder transferir stock entre ellas.
        </p>
      </div>
    );
  }

  const origenInicial = ubicaciones[0].id;
  const destinoInicial = ubicaciones[1].id;

  const stockPorProductoUbicacion: Record<string, Record<string, number>> = {};
  for (const p of productos) {
    const porUbicacion: Record<string, number> = {};
    for (const u of ubicaciones) {
      porUbicacion[u.id] = stockUbicaciones.get(p.id)?.get(u.id) ?? 0;
    }
    stockPorProductoUbicacion[p.id] = porUbicacion;
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock/ubicaciones" className="text-sm text-wine underline">
          ← Volver a Ubicaciones
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Transferir stock entre bodegas</h1>
        <p className="text-muted text-sm">
          Elige de dónde sale y a dónde llega, y agrega los vinos y cantidades. Esto solo mueve
          botellas de una bodega a otra — el total de tu inventario no cambia nada.
        </p>
      </div>

      <TransferirLoteForm
        productos={productos}
        ubicaciones={ubicaciones}
        origenInicial={origenInicial}
        destinoInicial={destinoInicial}
        stockPorProductoUbicacion={stockPorProductoUbicacion}
        filasIniciales={[{ texto: "", cantidad: 1, productoIdSugerido: "" }]}
        action={transferirLoteUbicaciones}
      />
    </div>
  );
}
