import { actualizarProducto } from "@/app/productos/actions";
import { ProductoForm } from "@/components/ProductoForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: PageProps<"/productos/[id]/editar">) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) notFound();

  const guardar = actualizarProducto.bind(null, producto.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/productos" className="text-sm text-wine underline">
          ← Volver a Productos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Editar {producto.nombre}</h1>
      </div>
      <ProductoForm action={guardar} defaultValues={producto} botonTexto="Guardar cambios" />
    </div>
  );
}
