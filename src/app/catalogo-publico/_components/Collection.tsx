"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicWine } from "../_lib/catalog";
import styles from "../catalog.module.css";

const BUDGETS = [
  { label: "Todos los precios", min: 0, max: Infinity },
  { label: "Hasta $500", min: 0, max: 500 },
  { label: "$500–$1,000", min: 500, max: 1000 },
  { label: "$1,000–$2,000", min: 1000, max: 2000 },
  { label: "Más de $2,000", min: 2000, max: Infinity },
];
const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function Collection({ wines, date }: { wines: PublicWine[]; date: string | null }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [budget, setBudget] = useState(0);
  const [sort, setSort] = useState("name");
  const drawer = useRef<HTMLDialogElement>(null);
  const categories = [...new Set(wines.flatMap((w) => w.categoria ? [w.categoria] : []))].sort();
  const years = [...new Set(wines.flatMap((w) => w.anio ? [w.anio] : []))].sort((a, b) => b - a);
  const filtered = useMemo(() => wines.filter((w) => {
    const price = w.precioLista;
    const range = BUDGETS[budget];
    return normalize(`${w.nombre} ${w.categoria ?? ""} ${w.anio ?? ""}`).includes(normalize(query))
      && (!category || w.categoria === category)
      && (!year || w.anio === Number(year))
      && (!budget || (price !== null && price > (budget === 1 ? -1 : range.min) && price <= range.max));
  }).sort((a, b) => sort === "low" ? (a.precioLista ?? Infinity) - (b.precioLista ?? Infinity)
    : sort === "high" ? (b.precioLista ?? -Infinity) - (a.precioLista ?? -Infinity)
    : a.nombre.localeCompare(b.nombre, "es")), [wines, query, category, year, budget, sort]);
  const active = Boolean(query || category || year || budget);
  function reset() { setQuery(""); setCategory(""); setYear(""); setBudget(0); }
  function filters(suffix: string) {
    return <div className={styles.filters}>
      <label htmlFor={`tipo-${suffix}`}>Tipo<select id={`tipo-${suffix}`} value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todos los tipos</option>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label htmlFor={`anio-${suffix}`}>Añada<select id={`anio-${suffix}`} value={year} onChange={(e) => setYear(e.target.value)}><option value="">Todas las añadas</option>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
      <label htmlFor={`precio-${suffix}`}>Presupuesto<select id={`precio-${suffix}`} value={budget} onChange={(e) => setBudget(Number(e.target.value))}>{BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}</select></label>
    </div>;
  }
  return <>
    <section id="seleccion" className={styles.collection} aria-labelledby="selection-heading">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>TU PRÓXIMA BOTELLA</p><h1 id="selection-heading">Catálogo con precios.</h1></div><p aria-live="polite">{filtered.length} vino{filtered.length === 1 ? "" : "s"}</p></div>
      <div className={styles.toolbar}>
        <label className={styles.search}><span className={styles.srOnly}>Buscar vinos</span><input type="search" placeholder="Busca un vino, tipo o añada…" value={query} onChange={(e) => setQuery(e.target.value)} /><span aria-hidden="true">⌕</span></label>
        <button className={styles.filterButton} type="button" onClick={() => drawer.current?.showModal()}>Filtros {active ? "·" : "+"}</button>
        <label className={styles.sort}><span className={styles.srOnly}>Ordenar vinos</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="name">Nombre A–Z</option><option value="low">Precio: menor a mayor</option><option value="high">Precio: mayor a menor</option></select></label>
      </div>
      <div className={styles.desktopFilters}>{filters("desktop")}</div>
      {active && <button className={styles.reset} onClick={reset}>Limpiar filtros ×</button>}
      <div className={styles.productGrid}>
        {filtered.map((wine, i) => <WineCard wine={wine} key={wine.id ?? `${wine.nombre}-${i}`} />)}
      </div>
      {!filtered.length && <div className={styles.empty}><h3>{wines.length ? "Otra búsqueda, otra botella." : "Estamos preparando la selección."}</h3><p>{wines.length ? "Prueba con menos filtros para descubrir más vinos." : "Los vinos aparecerán aquí al publicar el catálogo."}</p>{active && <button className={styles.darkPill} onClick={reset}>Ver todos los vinos</button>}</div>}
      <div className={styles.publication}><p>{date ? `Precios publicados el ${date}, en MXN.` : "Precios en MXN."}</p><button type="button" onClick={() => window.print()}>Imprimir selección</button></div>
      <dialog ref={drawer} className={styles.filterDialog} onClick={(e) => { if (e.target === e.currentTarget) drawer.current?.close(); }}>
        <button className={styles.close} aria-label="Cerrar filtros" onClick={() => drawer.current?.close()}>×</button>
        <h2>Encuentra tu vino.</h2>{filters("mobile")}
        <button className={styles.darkPill} onClick={() => drawer.current?.close()}>Ver {filtered.length} vinos</button>
        {active && <button className={styles.reset} onClick={reset}>Limpiar filtros</button>}
      </dialog>
    </section>
  </>;
}

function WineCard({ wine }: { wine: PublicWine }) {
  const content = <>
    <div className={styles.productImage}>{wine.fotoUrl ? <Image src={wine.fotoUrl} alt={`${wine.nombre}${wine.anio ? `, ${wine.anio}` : ""}`} fill sizes="(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 23vw" className={styles.bottleImage} /> : <span className={styles.noImage}>Fotografía próximamente</span>}</div>
    <div className={styles.cardDetails}><p className={styles.eyebrow}>{[wine.categoria, wine.anio].filter(Boolean).join(" · ")}</p><h3>{wine.nombre}</h3><p className={styles.cardPrice}>{wine.precioLista !== null ? money.format(wine.precioLista) : "Precio por confirmar"}</p></div>
  </>;
  return <article className={styles.card}>{wine.id ? <Link href={`/catalogo-publico/${wine.id}`} prefetch={false}>{content}</Link> : <div>{content}</div>}</article>;
}
