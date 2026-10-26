import Link from "next/link";
import type { PedidoSinCosto } from "@/lib/costeo";

export function AvisoPedidosSinCosto({ pedidos }: { pedidos: PedidoSinCosto[] }) {
  if (pedidos.length === 0) return null;
  const plural = pedidos.length > 1;

  return (
    <div className="rounded-xl border border-warn/40 bg-warn-bg p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-warn">⚠ Ganancia y valor de inventario aproximados</h2>
      <p className="text-sm text-warn/90">
        Tienes {pedidos.length} pedido{plural ? "s" : ""} recibido{plural ? "s" : ""} sin tipo de
        cambio puesto — mientras no se lo pongas (o le registres un pago en dólares), esas
        botellas casi no tienen costo en el sistema, y eso puede inflar la Ganancia que ves aquí.
      </p>
      <ul className="text-sm flex flex-col gap-1">
        {pedidos.map((p) => (
          <li key={p.id}>
            <Link href={`/pedidos/${p.id}`} className="text-warn underline font-medium">
              {p.folio}
            </Link>{" "}
            <span className="text-warn/80">— {p.botellas} botellas sin costo final</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
