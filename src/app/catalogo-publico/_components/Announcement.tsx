import { anuncioVigente, leerConfiguracion } from "@/lib/tienda";
import styles from "../catalog.module.css";

/** Thin notice above the header, set from the CRM (Tienda en línea). Hides itself after its last day. */
export async function Announcement() {
  const anuncio = anuncioVigente(await leerConfiguracion());
  if (!anuncio) return null;
  return <aside className={styles.announce} aria-label="Aviso">
    <p>{anuncio.titulo && <strong>{anuncio.titulo}</strong>}<span>{anuncio.texto}</span></p>
  </aside>;
}
