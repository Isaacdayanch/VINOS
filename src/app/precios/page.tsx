import { TablaPrecios } from "@/components/TablaPrecios";
import { calcularResumenInventario } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PreciosPage() {
  const [productos, resumen] = await Promise.all([
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    calcularResumenInventario(),
  ]);

  const filas = productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    fotoUrl: p.fotoUrl,
    sku: p.sku,
    piezasPorCaja: p.piezasPorCaja,
    costoActual: resumen.get(p.id)?.costoPromedioPorBotella ?? 0,
    precioLista: p.precioLista,
    precioDistribuidor: p.precioDistribuidor,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-wine">Precios</h1>
        <p className="text-muted text-sm">
          Precio de venta a clientes y precio para distribuidores de cada vino. El margen se
          calcula solo, comparado contra el costo actual.
        </p>
      </div>

      <TablaPrecios productos={filas} />
    </div>
  );
}
