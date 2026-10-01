import Link from "next/link";
import styles from "./catalog.module.css";
export default function WineNotFound() {
  return <main id="contenido" className={styles.empty}><h1>Esta botella no está en la selección.</h1><Link className={styles.darkPill} href="/catalogo-publico#seleccion">Explorar vinos →</Link></main>;
}
