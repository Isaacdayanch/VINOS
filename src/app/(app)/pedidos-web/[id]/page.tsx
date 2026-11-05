import { prisma } from "@/lib/prisma";
import { calcularResumenInventario, formatoMXN } from "@/lib/costeo";
import { telefonoLimpio } from "@/lib/tienda";
import { textoAvisoPedido, whatsappConfigurado } from "@/lib/whatsapp";
import { SubmitButton } from "@/components/SubmitButton";
import { BotonEliminarConfirmado } from "@/components/BotonEliminarConfirmado";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelarPedidoWeb, confirmarPedidoWeb, marcarEntregadoPedidoWeb, reabrirPedidoWeb, reenviarAvisoPedidoWeb } from "../actions";

export const dynamic = "force-dynamic";

export default async function PedidoWebPage({ params }: PageProps<"/pedidos-web/[id]">) {
  const { id } = await params;
  const [pedido, ubicaciones, resumen] = await Promise.all([
    prisma.pedidoWeb.findUnique({ where: { id }, include: { lineas: { include: { producto: true } }, zona: true, cliente: true, orden: true } }),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularResumenInventario(),
  ]);
  if (!pedido) notFound();

  const telefono = telefonoLimpio(pedido.telefono);
  const clientes = await prisma.cliente.findMany({ where: { telefono: { not: null } }, select: { id: true, nombre: true, telefono: true, codigo: true } });
  const clienteMismoTelefono = clientes.find((c) => telefonoLimpio(c.telefono ?? "") === telefono);
  const direccion = [pedido.calle, pedido.colonia, `CP ${pedido.codigoPostal}`, pedido.ciudad].filter(Boolean).join(", ");
  const sinStock = pedido.lineas.filter((l) => (resumen.get(l.productoId)?.stockActual ?? 0) < l.cantidadBotellas);
  const textoGrupo = textoAvisoPedido(pedido, null);
  const waCliente = `https://wa.me/52${telefono}?text=${encodeURIComponent(`Hola ${pedido.nombre.split(" ")[0]}, soy de Cava 18. Recibimos tu pedido ${pedido.folio} (${pedido.botellas} botella${pedido.botellas === 1 ? "" : "s"}, total ${formatoMXN(pedido.total)}). ¿Te lo entregamos `)}`;
  const waGrupo = `https://wa.me/?text=${encodeURIComponent(textoGrupo)}`;
  const abierto = pedido.estatus === "Nuevo";

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link href="/pedidos-web" className="text-sm text-wine underline">← Volver a Pedidos en línea</Link>
        <div className="flex items-start justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-wine">{pedido.folio}</h1>
            <p className="text-muted text-sm">
              {new Date(pedido.fecha).toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "full", timeStyle: "short" })}
            </p>
          </div>
          <span className="rounded-full bg-wine-light text-wine px-3 py-1 text-xs font-semibold whitespace-nowrap">{pedido.estatus}</span>
        </div>
      </div>

      {pedido.orden && (
        <Link href={`/ordenes/${pedido.orden.id}`} className="rounded-lg border border-ok/40 bg-ok/10 text-ok text-sm px-4 py-3 flex items-center justify-between gap-3">
          <span>✅ Ya es la orden <strong>{pedido.orden.folio}</strong>{pedido.cliente ? ` de ${pedido.cliente.nombre}` : ""}.</span>
          <span className="underline whitespace-nowrap">Ver orden →</span>
        </Link>
      )}

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <h2 className="font-semibold">Cliente</h2>
        <p className="text-lg font-medium">{pedido.nombre}</p>
        <p className="text-sm">
          📱 <a href={`tel:+52${telefono}`} className="underline">{pedido.telefono}</a>
          {pedido.email && <> · ✉️ <a href={`mailto:${pedido.email}`} className="underline">{pedido.email}</a></>}
        </p>
        <p className="text-sm">📍 {direccion}{pedido.zona ? <span className="text-muted"> · {pedido.zona.nombre}</span> : null}</p>
        {pedido.referencias && <p className="text-sm text-muted">Referencias: {pedido.referencias}</p>}
        {pedido.notas && <p className="text-sm rounded-md bg-warn-bg text-warn px-3 py-2">💬 {pedido.notas}</p>}
        <div className="flex flex-wrap gap-2 pt-1">
          <a href={waCliente} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ok text-white text-xs font-medium px-3 py-2 whitespace-nowrap">WhatsApp al cliente →</a>
          <a href={waGrupo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-surface text-xs font-medium px-3 py-2 whitespace-nowrap">Compartir al grupo de logística →</a>
        </div>
        {clienteMismoTelefono && (
          <p className="text-xs text-muted">Ya existe en Clientes como <Link href={`/clientes/${clienteMismoTelefono.id}`} className="underline">{clienteMismoTelefono.nombre}</Link> ({clienteMismoTelefono.codigo ?? "sin código"}).</p>
        )}
      </section>

      <section className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
        {pedido.lineas.map((l) => {
          const stock = resumen.get(l.productoId)?.stockActual ?? 0;
          return (
            <div key={l.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{l.cantidadBotellas} × {l.producto.nombre}</p>
                <p className="text-xs text-muted">
                  {formatoMXN(l.precioUnitario)} c/u · <span className={stock < l.cantidadBotellas ? "text-warn font-medium" : ""}>stock {stock}</span>
                </p>
              </div>
              <span className="font-semibold whitespace-nowrap">{formatoMXN(l.cantidadBotellas * l.precioUnitario)}</span>
            </div>
          );
        })}
        <div className="p-4 text-sm flex flex-col gap-1">
          <p className="flex justify-between"><span className="text-muted">{pedido.botellas} botella{pedido.botellas === 1 ? "" : "s"}</span><span>{formatoMXN(pedido.subtotal)}</span></p>
          <p className="flex justify-between"><span className="text-muted">Envío</span><span>{pedido.envio ? formatoMXN(pedido.envio) : "Gratis"}</span></p>
          <p className="flex justify-between text-base font-semibold text-wine"><span>Total</span><span>{formatoMXN(pedido.total)}</span></p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-2 text-sm">
        <h2 className="font-semibold">Aviso por WhatsApp al grupo</h2>
        {pedido.avisoWhatsApp ? (
          <p className="text-ok">✅ Enviado el {new Date(pedido.avisoWhatsApp).toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "medium", timeStyle: "short" })}</p>
        ) : (
          <p className="text-warn">⚠️ {pedido.avisoError ?? "Todavía no se ha enviado."}</p>
        )}
        {whatsappConfigurado() && (
          <form action={reenviarAvisoPedidoWeb.bind(null, pedido.id)}>
            <SubmitButton className="rounded-full border border-border bg-surface text-xs font-medium px-3 py-2" pendingText="Enviando…">Volver a enviar el aviso</SubmitButton>
          </form>
        )}
        <p className="text-xs text-muted">Mientras WhatsApp no esté conectado, usa el botón “Compartir al grupo de logística” de arriba: abre WhatsApp con el mensaje ya escrito.</p>
      </section>

      {abierto && !pedido.orden && (
        <section className="rounded-lg border border-wine/30 bg-wine-light/30 p-4 flex flex-col gap-3">
          <h2 className="font-semibold text-wine">Aceptar pedido → crear orden</h2>
          <p className="text-sm text-muted">
            Se crea una orden normal con estas botellas al precio de la página y se descuenta el stock.
            {sinStock.length > 0 && <> <span className="text-warn font-medium">Ojo:</span> no hay stock suficiente de {sinStock.map((l) => l.producto.nombre).join(", ")}; esas líneas quedarán como pendientes de surtir.</>}
          </p>
          {ubicaciones.length === 0 ? (
            <p className="text-sm text-warn">Primero necesitas una ubicación de bodega. <Link href="/stock/ubicaciones" className="underline">Créala aquí</Link>.</p>
          ) : (
            <form action={confirmarPedidoWeb.bind(null, pedido.id)} className="flex flex-col gap-3">
              <label className="text-sm flex flex-col gap-1">
                <span className="text-muted">Sale de la bodega</span>
                <select name="ubicacionId" required className="rounded-md border border-border bg-surface px-3 py-2">
                  {ubicaciones.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                </select>
              </label>
              <label className="text-sm flex flex-col gap-1">
                <span className="text-muted">Cliente en el CRM</span>
                <select name="clienteId" defaultValue={clienteMismoTelefono?.id ?? ""} className="rounded-md border border-border bg-surface px-3 py-2">
                  <option value="">{clienteMismoTelefono ? `Usar ${clienteMismoTelefono.nombre} (mismo teléfono)` : `Crear nuevo: ${pedido.nombre}`}</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}{c.codigo ? ` (${c.codigo})` : ""}</option>)}
                </select>
              </label>
              <SubmitButton className="rounded-md bg-wine text-white px-4 py-2.5 text-sm font-medium" pendingText="Creando orden…">Aceptar y crear orden</SubmitButton>
            </form>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        {pedido.estatus === "Confirmado" && (
          <form action={marcarEntregadoPedidoWeb.bind(null, pedido.id)}>
            <SubmitButton className="rounded-md bg-ok text-white px-4 py-2 text-sm font-medium">Marcar como entregado</SubmitButton>
          </form>
        )}
        {abierto && (
          <BotonEliminarConfirmado action={cancelarPedidoWeb.bind(null, pedido.id)} mensaje={`¿Cancelar el pedido ${pedido.folio}? El cliente no recibe ningún aviso automático.`}>
            Cancelar pedido
          </BotonEliminarConfirmado>
        )}
        {pedido.estatus === "Cancelado" && (
          <form action={reabrirPedidoWeb.bind(null, pedido.id)}>
            <SubmitButton className="text-xs text-wine underline">Reabrir pedido</SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
