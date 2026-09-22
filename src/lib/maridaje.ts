// Sugerencias de maridaje basadas en guías clásicas de sommelier
// (qué tipo de comida combina con cada uva / cuerpo de vino). Isaac siempre
// puede editar o reemplazar el texto sugerido a mano.

type ReglaVarietal = { patrones: string[]; texto: string };

const REGLAS_POR_VARIETAL: ReglaVarietal[] = [
  {
    patrones: ["cabernet sauvignon", "cabernet"],
    texto:
      "Carnes rojas a la parrilla, cortes con grasa (rib eye, costilla), quesos añejos y guisos con especias fuertes.",
  },
  {
    patrones: ["malbec"],
    texto: "Carnes rojas asadas, barbacoa, carnes ahumadas y quesos semicurados.",
  },
  {
    patrones: ["merlot"],
    texto: "Carnes rojas suaves, pasta con salsas de tomate, quesos suaves y aves en salsas ligeras.",
  },
  {
    patrones: ["syrah", "shiraz"],
    texto: "Carnes de caza, cordero, platillos con especias (pimienta, comino) y quesos fuertes.",
  },
  {
    patrones: ["petit verdot"],
    texto: "Carnes rojas intensas, guisos especiados y quesos curados.",
  },
  {
    patrones: ["pinot noir"],
    texto: "Aves como pato o pollo, salmón, platillos con hongos y quesos suaves.",
  },
  {
    patrones: ["tempranillo"],
    texto: "Carnes rojas, jamón serrano, quesos manchegos y platillos con especias suaves.",
  },
  {
    patrones: ["chardonnay"],
    texto: "Pescados blancos, mariscos, pollo en salsas cremosas y quesos suaves.",
  },
  {
    patrones: ["sauvignon blanc"],
    texto: "Mariscos, ceviches, ensaladas, quesos de cabra y comida con cítricos.",
  },
  {
    patrones: ["riesling"],
    texto: "Comida picante o asiática, mariscos y quesos suaves.",
  },
  {
    patrones: ["rosé", "rose", "rosado"],
    texto: "Ensaladas, mariscos ligeros, comida mediterránea y aperitivos.",
  },
  {
    patrones: ["blanco"],
    texto: "Pescados, mariscos, ensaladas y quesos suaves.",
  },
];

const REGLAS_POR_CUERPO: Record<string, string> = {
  Ligero: "Pescados, mariscos, ensaladas y quesos suaves — comida ligera en general.",
  Medio: "Aves, pastas, carnes blancas y quesos semicurados.",
  Lleno: "Carnes rojas, guisos especiados, quesos curados y comida con sabores fuertes.",
};

export function sugerirMaridaje(varietal?: string, cuerpo?: string): string {
  const v = (varietal ?? "").toLowerCase().trim();
  if (v) {
    const regla = REGLAS_POR_VARIETAL.find((r) => r.patrones.some((p) => v.includes(p)));
    if (regla) return regla.texto;
  }
  if (cuerpo && REGLAS_POR_CUERPO[cuerpo]) return REGLAS_POR_CUERPO[cuerpo];
  return "Pon la uva o el cuerpo del vino para obtener una sugerencia, o descríbelo tú mismo aquí.";
}
