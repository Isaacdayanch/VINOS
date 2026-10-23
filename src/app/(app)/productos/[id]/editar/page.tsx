import { actualizarProducto } from "@/app/(app)/productos/actions";
import { ProductoForm } from "@/components/ProductoForm";
import { GaleriaFotosExtra } from "@/components/GaleriaFotosExtra";
import { prisma } from "@/lib/prisma";
import { urlCatalogoPublico } from "@/lib/catalogoPublico";
import { calcularMovimientosStockProducto } from "@/lib/costeo";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const MAX_IMAGENES_EXTRA = 7;

const ETIQUETA_TIPO: Record<string, string> = { entrada: "Entrada", salida: "Salida", ajuste: "Ajuste" };

export default async function EditarProductoPage({
  params,
}: PageProps<"/productos/[id]/editar">) {
  const { id } = await params;
  const [producto, movimientos] = await Promise.all([
    prisma.producto.findUnique({
      where: { id },
      include: { imagenesExtra: { orderBy: { orden: "asc" } } },
    }),
    calcularMovimientosStockProducto(id),
  ]);
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
          href={urlCatalogoPublico(`/catalogo-publico/${producto.id}`)}
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

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Historial de stock</h2>
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {movimientos.map((m) => {
            const fila = (
              <div className="p-3 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate">
                    {ETIQUETA_TIPO[m.tipo]} · {m.detalle}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(m.fecha).toLocaleDateString("es-MX")}
                    {m.ubicacion ? ` · ${m.ubicacion}` : ""}
                  </p>
                </div>
                <span className={`font-semibold whitespace-nowrap ${m.signo > 0 ? "text-ok" : "text-warn"}`}>
                  {m.signo > 0 ? "+" : "-"}
                  {m.botellas}
                </span>
              </div>
            );
            return m.href ? (
              <Link key={m.id} href={m.href} className="block hover:bg-wine-light/40">
                {fila}
              </Link>
            ) : (
              <div key={m.id}>{fila}</div>
            );
          })}
          {movimientos.length === 0 && (
            <p className="p-6 text-center text-muted text-sm">Todavía no hay movimientos de este vino.</p>
          )}
        </div>
      </div>
    </div>
  );
}
