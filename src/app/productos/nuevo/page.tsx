import { crearProducto } from "@/app/productos/actions";
import { ProductoForm } from "@/components/ProductoForm";
import Link from "next/link";

export default function NuevoProductoPage() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/productos" className="text-sm text-wine underline">
          ← Volver a Productos
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo producto</h1>
      </div>
      <ProductoForm action={crearProducto} botonTexto="Crear producto" />
    </div>
  );
}
