import { prisma } from "@/lib/prisma";

/** Lo que falta de resolver de una línea: ni pagado, ni devuelto todavía. */
function pendienteLinea(l: { cantidadBotellas: number; botellasPagadas: number; botellasDevueltas: number; precioUnitario: number }) {
  return (l.cantidadBotellas - l.botellasPagadas - l.botellasDevueltas) * l.precioUnitario;
}

export async function calcularResumenDistribuidores() {
  const distribuidores = await prisma.distribuidor.findMany({
    include: { notasConsignacion: { include: { lineas: true, cobros: true } }, cliente: true },
    orderBy: { nombre: "asc" },
  });

  return distribuidores.map((d) => {
    let total = 0;
    let cobrado = 0;
    let pendiente = 0;
    for (const n of d.notasConsignacion) {
      total += n.lineas.reduce((acc, l) => acc + l.cantidadBotellas * l.precioUnitario, 0);
      cobrado += n.cobros.reduce((acc, c) => acc + c.monto, 0);
      pendiente += n.lineas.reduce((acc, l) => acc + pendienteLinea(l), 0);
    }
    return { ...d, total, cobrado, pendiente };
  });
}

export type EventoProximo = {
  id: string;
  nombre: string;
  fechaEvento: Date;
  listoEvento: boolean;
  diasFaltantes: number;
};

/** Eventos (tipo EVENTO) con fecha en los próximos 7 días (sin contar los ya pasados), para el aviso de arriba. */
export async function calcularEventosProximos(): Promise<EventoProximo[]> {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + 7);

  const eventos = await prisma.distribuidor.findMany({
    where: { tipo: "EVENTO", fechaEvento: { gte: hoy, lte: limite } },
    orderBy: { fechaEvento: "asc" },
  });

  return eventos.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    fechaEvento: e.fechaEvento!,
    listoEvento: e.listoEvento,
    diasFaltantes: Math.round((e.fechaEvento!.getTime() - hoy.getTime()) / 86400000),
  }));
}
