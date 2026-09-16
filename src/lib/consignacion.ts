import { prisma } from "@/lib/prisma";

export async function calcularResumenDistribuidores() {
  const distribuidores = await prisma.distribuidor.findMany({
    include: { notasConsignacion: { include: { lineas: true, cobros: true } } },
    orderBy: { nombre: "asc" },
  });

  return distribuidores.map((d) => {
    let total = 0;
    let cobrado = 0;
    for (const n of d.notasConsignacion) {
      total += n.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
      cobrado += n.cobros.reduce((acc, c) => acc + c.monto, 0);
    }
    return { ...d, total, cobrado, pendiente: total - cobrado };
  });
}
