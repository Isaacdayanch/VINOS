import { prisma } from "@/lib/prisma";
import { construirDatosPrecios } from "@/lib/precios";
import { OrdenForm } from "@/components/OrdenForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevaOrdenPage() {
  const [clientes, productos, preciosGuardados] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { nombre: "asc" } }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.precioClienteProducto.findMany(),
  ]);

  const { preciosPorClienteProducto, categoriaPorCliente, esUltimoPrecio } = construirDatosPrecios(
    clientes,
    productos,
    preciosGuardados,
  );

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/ordenes" className="text-sm text-wine underline">
          ← Volver a Órdenes
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nueva orden</h1>
        <p className="text-muted text-sm">
          El precio se sugiere solo según el cliente; puedes cambiarlo si quieres.
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
        <OrdenForm
          clientes={clientes}
          productos={productos}
          preciosPorClienteProducto={preciosPorClienteProducto}
          categoriaPorCliente={categoriaPorCliente}
          esUltimoPrecio={esUltimoPrecio}
        />
      )}
    </div>
  );
}
