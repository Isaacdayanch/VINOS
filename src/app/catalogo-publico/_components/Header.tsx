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
      <Link href="/catalogo-publico#seleccion">Explorar vinos <span aria-hidden="true">↗</span></Link>
      <button type="button" className={styles.menuButton} aria-label="Abrir navegación" onClick={() => menu.current?.showModal()}>
        <span /><span />
      </button>
    </div>
    <dialog ref={menu} className={styles.menu} onClick={(e) => { if (e.target === e.currentTarget) menu.current?.close(); }}>
      <button type="button" className={styles.close} onClick={() => menu.current?.close()} aria-label="Cerrar navegación">×</button>
      <p className={styles.eyebrow}>ELIGE TU PRÓXIMA BOTELLA</p>
      <nav aria-label="Navegación pública">
        <Link href="/catalogo-publico#seleccion" onClick={() => menu.current?.close()}>La selección <span>↗</span></Link>
        <Link href="/catalogo-publico#descubrir" onClick={() => menu.current?.close()}>Encuentra tu vino <span>↗</span></Link>
        <Link href="/catalogo-publico#historia" onClick={() => menu.current?.close()}>Una selección con carácter <span>↗</span></Link>
      </nav>
    </dialog>
  </header>;
}
