import { prisma } from "@/lib/prisma";
import { calcularStockPorUbicacion } from "@/lib/costeo";
import { transferirLoteUbicaciones } from "@/app/(app)/stock/actions";
import { TransferirLoteForm } from "@/components/TransferirLoteForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Herramienta de un solo uso: lo que Isaac dictó que mandó a Quijote 9, para
// descontarlo de 689. Cuando ya quede confirmada la transferencia, esta
// página y su botón en /stock/ubicaciones se pueden borrar.
const LISTA_QUIJOTE_9: { texto: string; cantidad: number }[] = [
  { texto: "La Citadelle de Diamant Givat Titora Grand Reserve", cantidad: 23 },
  { texto: "La Citadelle de Diamant Givat Titora Special Reserve Red Seal", cantidad: 23 },
  { texto: "Givat Titora Cabernet Sauvignon Reserve", cantidad: 23 },
  { texto: "Late Harvest Tanya", cantidad: 12 },
  { texto: "Cab Reserve Eliyah Tanya", cantidad: 12 },
  { texto: "Petit Verdot Tanya", cantidad: 6 },
  { texto: "Grand Rivallon", cantidad: 72 },
  { texto: "Tanya Enosh", cantidad: 23 },
  { texto: "Dadah Cab Reserve", cantidad: 67 },
  { texto: "Dadah Malbec Barbera", cantidad: 18 },
  { texto: "Chaarley Zahav", cantidad: 3 },
  { texto: "Dadah Reserve Petit Verdot", cantidad: 3 },
  { texto: "Dadah Reserve Cab Sauv", cantidad: 6 },
  { texto: "Dadah 2017", cantidad: 12 },
  { texto: "Dadah 2018", cantidad: 18 },
];

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Puntaje simple: qué porcentaje de las palabras de lo que Isaac escribió
// aparecen en el nombre real del producto. Solo sirve para dejar
// preseleccionado un vino probable -- Isaac siempre puede cambiarlo en el
// selector, así que no hace falta que sea perfecto.
function puntajeCoincidencia(texto: string, nombre: string): number {
  const palabrasTexto = normalizar(texto).split(" ").filter(Boolean);
  const palabrasNombre = new Set(normalizar(nombre).split(" ").filter(Boolean));
  if (palabrasTexto.length === 0) return 0;
  const coincidencias = palabrasTexto.filter((p) => palabrasNombre.has(p)).length;
  return coincidencias / palabrasTexto.length;
}

export default async function TransferirStockPage() {
  const [productos, ubicaciones, stockUbicaciones] = await Promise.all([
    prisma.producto.findMany({
      select: { id: true, nombre: true, fotoUrl: true, piezasPorCaja: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.ubicacion.findMany({ orderBy: { createdAt: "asc" } }),
    calcularStockPorUbicacion(),
  ]);

  if (ubicaciones.length < 2) {
    return (
      <div className="flex flex-col gap-4 max-w-lg">
        <Link href="/stock/ubicaciones" className="text-sm text-wine underline">
          ← Volver a Ubicaciones
        </Link>
        <p className="text-warn text-sm">
          Necesitas al menos 2 bodegas creadas para poder transferir stock entre ellas.
        </p>
      </div>
    );
  }

  const origenInicial =
    ubicaciones.find((u) => normalizar(u.nombre).includes("689"))?.id ?? ubicaciones[0].id;
  const destinoInicial =
    ubicaciones.find((u) => normalizar(u.nombre).includes("quijote"))?.id ??
    ubicaciones.find((u) => u.id !== origenInicial)?.id ??
    ubicaciones[1].id;

  const stockPorProductoUbicacion: Record<string, Record<string, number>> = {};
  for (const p of productos) {
    const porUbicacion: Record<string, number> = {};
    for (const u of ubicaciones) {
      porUbicacion[u.id] = stockUbicaciones.get(p.id)?.get(u.id) ?? 0;
    }
    stockPorProductoUbicacion[p.id] = porUbicacion;
  }

  const filasIniciales = LISTA_QUIJOTE_9.map((item) => {
    let mejorId = "";
    let mejorPuntaje = 0;
    for (const p of productos) {
      const s = puntajeCoincidencia(item.texto, p.nombre);
      if (s > mejorPuntaje) {
        mejorPuntaje = s;
        mejorId = p.id;
      }
    }
    return {
      texto: item.texto,
      cantidad: item.cantidad,
      productoIdSugerido: mejorPuntaje >= 0.5 ? mejorId : "",
    };
  });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href="/stock/ubicaciones" className="text-sm text-wine underline">
          ← Volver a Ubicaciones
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Transferir stock entre bodegas</h1>
        <p className="text-muted text-sm">
          Revisa cada línea: fíjate en la foto y el nombre de cada vino para confirmar que es el
          correcto (si no, búscalo tú en el buscador), y en la cantidad. Esto solo mueve botellas
          de una bodega a otra — el total de tu inventario no cambia nada.
        </p>
      </div>

      <TransferirLoteForm
        productos={productos}
        ubicaciones={ubicaciones}
        origenInicial={origenInicial}
        destinoInicial={destinoInicial}
        stockPorProductoUbicacion={stockPorProductoUbicacion}
        filasIniciales={filasIniciales}
        action={transferirLoteUbicaciones}
      />
    </div>
  );
}
