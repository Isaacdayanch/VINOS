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
    precioDescuentoChico: p.precioDescuentoChico,
    precioDescuentoGrande: p.precioDescuentoGrande,
    precioDistribuidor: p.precioDistribuidor,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-wine">Precios</h1>
        <p className="text-muted text-sm">
          Los 4 precios de cada vino, para qué se usa cada uno, y el margen calculado solo
          contra el costo actual.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-wine-light/30 p-4 text-sm flex flex-col gap-1.5">
        <p>
          <span className="font-semibold text-wine">Precio de lista</span> — el que se usa en el
          catálogo público (vinos-catalogo.vercel.app) y se sugiere en una orden nueva a clientes
          de categoría &quot;Lista&quot;.
        </p>
        <p>
          <span className="font-semibold text-wine">Descuento chico / Descuento grande</span> —
          se sugieren en una orden nueva según la categoría del cliente. No salen en el catálogo
          público.
        </p>
        <p>
          <span className="font-semibold text-wine">Precio distribuidor</span> — el que se usa al
          armar una nota de consignación para un distribuidor.
        </p>
        <p className="text-muted text-xs mt-1">
          ⚠️ Cambiar un precio aquí no actualiza el catálogo público solo — eso solo pasa cuando
          le picas &quot;Publicar catálogo&quot; en Productos.
        </p>
      </div>

      <TablaPrecios productos={filas} />
    </div>
  );
}
