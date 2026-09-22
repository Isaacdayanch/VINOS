import { crearNotaConsignacion } from "@/app/(app)/distribuidores/actions";
import { NotaConsignacionForm } from "@/components/NotaConsignacionForm";
import { calcularResumenInventario } from "@/lib/costeo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NuevaNotaConsignacionPage({
  params,
}: PageProps<"/distribuidores/[id]/nueva-nota">) {
  const { id } = await params;

  const [distribuidor, productos, resumen] = await Promise.all([
    prisma.distribuidor.findUnique({ where: { id } }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    calcularResumenInventario(),
  ]);
  if (!distribuidor) notFound();

  const stockPorProducto: Record<string, number> = {};
  for (const p of productos) {
    stockPorProducto[p.id] = resumen.get(p.id)?.stockActual ?? 0;
  }

  const crear = crearNotaConsignacion.bind(null, distribuidor.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={`/distribuidores/${distribuidor.id}`} className="text-sm text-wine underline">
          ← Volver a {distribuidor.nombre}
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nueva nota de consignación</h1>
        <p className="text-muted text-sm">
          El precio se sugiere según el "Precio distribuidor" de cada vino (Panel de Precios);
          puedes cambiarlo si quieres. Las botellas salen de tu stock al crear la nota.
        </p>
      </div>

      {productos.length === 0 ? (
        <p className="text-sm text-warn">
          Primero necesitas un producto.{" "}
          <Link href="/productos/nuevo" className="underline">
            Crea uno
          </Link>
          .
        </p>
      ) : (
        <NotaConsignacionForm productos={productos} stockPorProducto={stockPorProducto} action={crear} />
      )}
    </div>
  );
}
