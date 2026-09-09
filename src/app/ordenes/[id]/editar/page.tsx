import { actualizarOrden } from "@/app/ordenes/actions";
import { OrdenForm } from "@/components/OrdenForm";
import { construirDatosPrecios } from "@/lib/precios";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarOrdenPage({
  params,
}: PageProps<"/ordenes/[id]/editar">) {
  const { id } = await params;

  const [orden, clientes, productos, preciosGuardados] = await Promise.all([
    prisma.orden.findUnique({ where: { id }, include: { lineas: true } }),
    prisma.cliente.findMany({ orderBy: { nombre: "asc" } }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.precioClienteProducto.findMany(),
  ]);
  if (!orden) notFound();

  const { preciosPorClienteProducto, categoriaPorCliente, esUltimoPrecio } = construirDatosPrecios(
    clientes,
    productos,
    preciosGuardados,
  );

  const guardar = actualizarOrden.bind(null, orden.id);

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={`/ordenes/${orden.id}`} className="text-sm text-wine underline">
          ← Volver a la orden
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Editar {orden.folio}</h1>
        <p className="text-muted text-sm">
          Puedes cambiar el cliente, los vinos, cantidades y precios.
        </p>
      </div>

      <OrdenForm
        clientes={clientes}
        productos={productos}
        preciosPorClienteProducto={preciosPorClienteProducto}
        categoriaPorCliente={categoriaPorCliente}
        esUltimoPrecio={esUltimoPrecio}
        clienteIdInicial={orden.clienteId}
        fechaInicial={orden.fecha.toISOString().slice(0, 10)}
        lineasIniciales={orden.lineas.map((l) => ({
          productoId: l.productoId,
          cantidadBotellas: l.cantidadBotellas,
          precioUnitario: l.precioUnitario,
        }))}
        action={guardar}
        botonTexto="Guardar cambios"
      />
    </div>
  );
}
