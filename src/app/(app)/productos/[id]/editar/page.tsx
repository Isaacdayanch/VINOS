import { actualizarProducto } from "@/app/(app)/productos/actions";
import { ProductoForm } from "@/components/ProductoForm";
import { GaleriaFotosExtra } from "@/components/GaleriaFotosExtra";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const MAX_IMAGENES_EXTRA = 7;

export default async function EditarProductoPage({
  params,
}: PageProps<"/productos/[id]/editar">) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { imagenesExtra: { orderBy: { orden: "asc" } } },
  });
  if (!producto) notFound();

  const guardar = actualizarProducto.bind(null, producto.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/productos" className="text-sm text-wine underline">
          ← Volver a Productos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Editar {producto.nombre}</h1>
        <Link
          href={`/catalogo-publico/${producto.id}`}
          target="_blank"
          className="text-xs text-wine underline whitespace-nowrap"
        >
          Ver ficha pública →
        </Link>
      </div>
      <GaleriaFotosExtra
        productoId={producto.id}
        imagenes={producto.imagenesExtra}
        max={MAX_IMAGENES_EXTRA}
      />
      <ProductoForm action={guardar} defaultValues={producto} botonTexto="Guardar cambios" />
    </div>
  );
}
