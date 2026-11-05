import { prisma } from "@/lib/prisma";
import { generarPdfPedido } from "@/lib/pedido-pdf";

export const dynamic = "force-dynamic";

/** Descarga el PDF del pedido en línea (el mismo que va en el correo "Vendiste"). */
export async function GET(_request: Request, { params }: RouteContext<"/pedidos-web/[id]/pdf">) {
  const { id } = await params;
  const pedido = await prisma.pedidoWeb.findUnique({ where: { id }, include: { lineas: true, zona: true } });
  if (!pedido) return new Response("No existe", { status: 404 });
  const pdf = await generarPdfPedido(pedido);
  return new Response(Buffer.from(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="Pedido-${pedido.folio}.pdf"` },
  });
}
