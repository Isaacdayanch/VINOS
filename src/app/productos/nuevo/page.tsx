import { crearProducto } from "@/app/productos/actions";
import { ProductoForm } from "@/components/ProductoForm";
import Link from "next/link";

export default async function NuevoProductoPage({
  searchParams,
}: PageProps<"/productos/nuevo">) {
  const params = await searchParams;
  const volver = typeof params.volver === "string" ? params.volver : undefined;
  const proveedor = typeof params.proveedor === "string" ? params.proveedor : undefined;
  const ocultarPrecios = volver?.startsWith("/pedidos/") ?? false;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={volver || "/productos"} className="text-sm text-wine underline">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo producto</h1>
        {ocultarPrecios && (
          <p className="text-muted text-sm">
            Aquí solo se captura la ficha del producto. El precio de venta se pone después, en
            Productos o al hacer la orden.
          </p>
        )}
      </div>
      <ProductoForm
        action={crearProducto}
        botonTexto="Crear producto"
        volver={volver}
        defaultValues={proveedor ? { proveedor } : undefined}
        ocultarPrecios={ocultarPrecios}
      />
    </div>
  );
}
