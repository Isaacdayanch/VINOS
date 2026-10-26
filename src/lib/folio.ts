// Letras y números sin 0/O, 1/I/L (se confunden fácil al leerlos o escribirlos a mano).
const ALFABETO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function codigoAlAzar(longitud: number): string {
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    codigo += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return codigo;
}

/**
 * Folio con un prefijo fijo y un código al azar (NO secuencial) -- así un
 * cliente o proveedor no puede saber cuántos pedidos/órdenes llevas con solo
 * ver el número. `existeFolio` checa si ese folio ya está usado; si choca
 * (rarísimo, pero por si acaso) se intenta de nuevo con otro código.
 */
export async function generarFolioAlAzar(
  prefijo: string,
  existeFolio: (folio: string) => Promise<boolean>,
): Promise<string> {
  for (let intento = 0; intento < 5; intento++) {
    const folio = `${prefijo}-${codigoAlAzar(5)}`;
    if (!(await existeFolio(folio))) return folio;
  }
  throw new Error("No se pudo generar un folio único, intenta de nuevo");
}
