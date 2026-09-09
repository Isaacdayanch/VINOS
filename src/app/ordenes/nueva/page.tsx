import { prisma } from "@/lib/prisma";
import { OrdenForm } from "@/components/OrdenForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

const precioPorCategoria = {
  LISTA: "precioLista",
  DESCUENTO_CHICO: "precioDescuentoChico",
  DESCUENTO_GRANDE: "precioDescuentoGrande",
} as const;

const nombreCategoria = {
  LISTA: "Lista",
  DESCUENTO_CHICO: "Descuento chico",
  DESCUENTO_GRANDE: "Descuento grande",
} as const;

export default async function NuevaOrdenPage() {
  const [clientes, productos, preciosGuardados] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { nombre: "asc" } }),
    prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.precioClienteProducto.findMany(),
  ]);

  const preciosPorClienteProducto: Record<string, Record<string, number>> = {};
  const categoriaPorCliente: Record<string, string> = {};
  for (const c of clientes) {
    preciosPorClienteProducto[c.id] = {};
    categoriaPorCliente[c.id] = nombreCategoria[c.categoriaPrecio] ?? "Lista";
    for (const p of productos) {
      const campo = precioPorCategoria[c.categoriaPrecio] ?? "precioLista";
      preciosPorClienteProducto[c.id][p.id] = p[campo] ?? p.precioLista ?? 0;
    }
  }

  const esUltimoPrecio: Record<string, Record<string, boolean>> = {};
  for (const pg of preciosGuardados) {
    if (!preciosPorClienteProducto[pg.clienteId]) preciosPorClienteProducto[pg.clienteId] = {};
    preciosPorClienteProducto[pg.clienteId][pg.productoId] = pg.precio;
    if (!esUltimoPrecio[pg.clienteId]) esUltimoPrecio[pg.clienteId] = {};
    esUltimoPrecio[pg.clienteId][pg.productoId] = true;
  }

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
