"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../catalog.module.css";

export function Header({ overHero = false }: { overHero?: boolean }) {
  const menu = useRef<HTMLDialogElement>(null);
  return <header className={`${styles.header} ${overHero ? styles.headerHero : ""}`}>
    <Link href="/catalogo-publico" aria-label="Cava 18, inicio" className={styles.headerBrand}>
      {/* Over the home photograph the wordmark turns cream; the gold 18 stays gold. */}
      <Image src={overHero ? "/marca/cava18-claro.png" : "/marca/cava18.png"} alt="Cava 18" width={1140} height={291} priority sizes="200px" />
    </Link>
    <div className={styles.headerActions}>
      <Link href="/catalogo-publico/catalogo">Vinos </Link>
      <Link href="/catalogo-publico/destilados">Destilados </Link>
      <button type="button" className={styles.menuButton} aria-label="Abrir navegación" onClick={() => menu.current?.showModal()}>
        <span /><span />
      </button>
    </div>
    <dialog ref={menu} className={styles.menu} onClick={(e) => { if (e.target === e.currentTarget) menu.current?.close(); }}>
      <button type="button" className={styles.close} onClick={() => menu.current?.close()} aria-label="Cerrar navegación">×</button>
      <p className={styles.eyebrow}>DESCUBRE NUESTRA SELECCIÓN</p>
      <nav aria-label="Navegación pública">
        <Link href="/catalogo-publico" onClick={() => menu.current?.close()}>Inicio </Link>
        <Link href="/catalogo-publico/catalogo" onClick={() => menu.current?.close()}>Vinos </Link>
        <Link href="/catalogo-publico/destilados" onClick={() => menu.current?.close()}>Destilados </Link>
        <Link href="/catalogo-publico/nosotros" onClick={() => menu.current?.close()}>Acerca de nosotros </Link>
      </nav>
    </dialog>
  </header>;
}
