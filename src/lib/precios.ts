import type { Cliente, PrecioClienteProducto, PrecioDistribuidorProducto, Producto } from "@prisma/client";

const CAMPO_POR_CATEGORIA = {
  LISTA: "precioLista",
  DESCUENTO_CHICO: "precioDescuentoChico",
  DESCUENTO_GRANDE: "precioDescuentoGrande",
} as const;

const NOMBRE_CATEGORIA = {
  LISTA: "Lista",
  DESCUENTO_CHICO: "Descuento chico",
  DESCUENTO_GRANDE: "Descuento grande",
} as const;

export function construirDatosPrecios(
  clientes: Cliente[],
  productos: Producto[],
  preciosGuardados: PrecioClienteProducto[],
) {
  const preciosPorClienteProducto: Record<string, Record<string, number>> = {};
  const categoriaPorCliente: Record<string, string> = {};

  for (const c of clientes) {
    preciosPorClienteProducto[c.id] = {};
    categoriaPorCliente[c.id] = NOMBRE_CATEGORIA[c.categoriaPrecio] ?? "Lista";
    for (const p of productos) {
      const campo = CAMPO_POR_CATEGORIA[c.categoriaPrecio] ?? "precioLista";
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

  return { preciosPorClienteProducto, categoriaPorCliente, esUltimoPrecio };
}

/**
 * Lo mismo que arriba pero para un distribuidor: el precio por default es el
 * "Precio distribuidor" del producto (Panel de Precios), y si ya se le dio
 * un precio distinto a este distribuidor antes en ese vino, se sugiere ese.
 */
export function construirDatosPreciosDistribuidor(
  productos: Producto[],
  preciosGuardados: PrecioDistribuidorProducto[],
) {
  const preciosPorProducto: Record<string, number> = {};
  for (const p of productos) {
    preciosPorProducto[p.id] = p.precioDistribuidor ?? p.precioLista ?? 0;
  }

  const esUltimoPrecio: Record<string, boolean> = {};
  for (const pg of preciosGuardados) {
    preciosPorProducto[pg.productoId] = pg.precio;
    esUltimoPrecio[pg.productoId] = true;
  }

  return { preciosPorProducto, esUltimoPrecio };
}
