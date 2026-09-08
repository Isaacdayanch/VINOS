import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const NOMBRE_BUCKET = "fotos-productos";

function clienteAdmin() {
  const url = process.env.SUPABASE_URL;
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !llave) {
    throw new Error(
      "Faltan las variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY para subir fotos.",
    );
  }
  return createClient(url, llave);
}

/**
 * Sube una foto al storage de Supabase (bucket público "fotos-productos")
 * y regresa su URL pública. Necesario porque Vercel no permite guardar
 * archivos directo en el servidor.
 */
export async function subirFotoProducto(archivo: File): Promise<string> {
  const supabase = clienteAdmin();
  const extension = archivo.name.split(".").pop() || "jpg";
  const nombreArchivo = `${randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(NOMBRE_BUCKET)
    .upload(nombreArchivo, archivo, {
      contentType: archivo.type || undefined,
      upsert: false,
    });

  if (error) {
    throw new Error(`No se pudo subir la foto: ${error.message}`);
  }

  const { data } = supabase.storage.from(NOMBRE_BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}
