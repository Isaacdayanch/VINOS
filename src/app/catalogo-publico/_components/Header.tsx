"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "../catalog.module.css";

export function Header({ overHero = false }: { overHero?: boolean }) {
  const menu = useRef<HTMLDialogElement>(null);
  return <header className={`${styles.header} ${overHero ? styles.headerHero : ""}`}>
    <Link href="/catalogo-publico" aria-label="Vinos, inicio" className={styles.headerBrand}>
      {overHero ? "SELECCIÓN DE VINOS" : "VINOS"}
    </Link>
    <div className={styles.headerActions}>
      <Link href="/catalogo-publico/catalogo">Catálogo </Link>
      <button type="button" className={styles.menuButton} aria-label="Abrir navegación" onClick={() => menu.current?.showModal()}>
        <span /><span />
      </button>
    </div>
    <dialog ref={menu} className={styles.menu} onClick={(e) => { if (e.target === e.currentTarget) menu.current?.close(); }}>
      <button type="button" className={styles.close} onClick={() => menu.current?.close()} aria-label="Cerrar navegación">×</button>
      <p className={styles.eyebrow}>DESCUBRE NUESTRA SELECCIÓN</p>
      <nav aria-label="Navegación pública">
        <Link href="/catalogo-publico" onClick={() => menu.current?.close()}>Inicio </Link>
        <Link href="/catalogo-publico/catalogo" onClick={() => menu.current?.close()}>Catálogo </Link>
        <Link href="/catalogo-publico/nosotros" onClick={() => menu.current?.close()}>Acerca de nosotros </Link>
      </nav>
    </dialog>
  </header>;
}
