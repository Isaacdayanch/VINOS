import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function estatusPedido(entradas: { recibida: boolean }[]) {
  if (entradas.length === 0) return { texto: "Sin productos", color: "text-muted" };
  const recibidas = entradas.filter((e) => e.recibida).length;
  if (recibidas === 0) return { texto: "Pendiente", color: "text-warn" };
  if (recibidas === entradas.length) return { texto: "Recibido completo", color: "text-wine" };
  return { texto: `Recibido parcial (${recibidas}/${entradas.length})`, color: "text-warn" };
}

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { fecha: "desc" },
    include: { entradas: { select: { recibida: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wine">Pedidos a proveedores</h1>
          <p className="text-muted text-sm">
            Aparta productos con tu proveedor y márcalos como recibidos cuando lleguen.
          </p>
        </div>
        <Link
          href="/pedidos/nuevo"
          className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
        >
          + Nuevo pedido
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {pedidos.map((p) => {
          const estatus = estatusPedido(p.entradas);
          return (
            <Link
              key={p.id}
              href={`/pedidos/${p.id}`}
              className="p-4 flex items-center justify-between gap-3 hover:bg-wine-light/40"
            >
              <div className="min-w-0">
                <p className="font-medium">
                  {p.folio} {p.proveedor ? `· ${p.proveedor}` : ""}
                </p>
                <p className="text-xs text-muted">
                  {new Date(p.fecha).toLocaleDateString("es-MX")} · {p.entradas.length} producto
                  {p.entradas.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${estatus.color}`}>
                {estatus.texto}
              </span>
            </Link>
          );
        })}
        {pedidos.length === 0 && (
          <p className="p-6 text-center text-muted text-sm">
            Todavía no tienes ningún pedido.{" "}
            <Link href="/pedidos/nuevo" className="text-wine underline">
              Crea el primero
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
