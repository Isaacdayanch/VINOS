"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicWine } from "../_lib/catalog";
import { BUDGETS, FACETS, filterCollection, type FacetKey } from "../_lib/collection-filters";
import styles from "../catalog.module.css";
import { OrderNotice } from "./OrderNotice";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
function CloseIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" /></svg>; }

export function Collection({ wines, date }: { wines: PublicWine[]; date: string | null }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [budget, setBudget] = useState(0);
  const [sort, setSort] = useState("name");
  const [facets, setFacets] = useState<Partial<Record<FacetKey, string>>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const categories = [...new Set(wines.flatMap(wine => wine.categoria ? [wine.categoria] : []))].sort();
  const years = [...new Set(wines.flatMap(wine => wine.anio ? [wine.anio] : []))].sort((a, b) => b - a);
  const filtered = useMemo(() => filterCollection(wines, { query, category, year, budget, facets, sort }), [wines, query, category, year, budget, facets, sort]);
  const activeCount = Number(Boolean(category)) + Number(Boolean(year)) + Number(Boolean(budget)) + Object.values(facets).filter(Boolean).length;
  const active = Boolean(query || activeCount);
  const facetOptions = FACETS.map(([key, label]) => ({ key, label, options: [...new Set(wines.flatMap(wine => wine[key] != null && wine[key] !== "" ? [String(wine[key])] : []))].sort((a, b) => a.localeCompare(b, "es", { numeric: true })) }));

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [filtersOpen]);
  function reset() { setQuery(""); setCategory(""); setYear(""); setBudget(0); setFacets({}); }
  function openFilters() { drawer.current?.showModal(); setFiltersOpen(true); }
  function clearFacet(key: FacetKey) { setFacets(current => ({ ...current, [key]: "" })); }
  const chips = [
    ...(query ? [{ label: `Búsqueda: ${query}`, clear: () => setQuery("") }] : []),
    ...(category ? [{ label: category, clear: () => setCategory("") }] : []),
    ...(year ? [{ label: `Añada ${year}`, clear: () => setYear("") }] : []),
    ...(budget ? [{ label: BUDGETS[budget].label, clear: () => setBudget(0) }] : []),
    ...FACETS.flatMap(([key, label]) => facets[key] ? [{ label: `${label}: ${facets[key]}${key === "alcohol" ? "%" : ""}`, clear: () => clearFacet(key) }] : []),
  ];

  return <section id="seleccion" className={styles.collection} aria-labelledby="selection-heading">
    <div className={styles.shopIntro}>
      <div><p className={styles.eyebrow}>LA SELECCIÓN · CATÁLOGO CON PRECIOS</p><h1 id="selection-heading">Tu próxima<br /><em>gran botella.</em></h1></div>
      <div className={styles.shopIntroAside}><p>Para compartir, para descubrir,<br />para abrir algo especial.</p><OrderNotice /></div>
    </div>

    <div className={styles.shopDiscovery}>
      {categories.length > 0 && <div className={styles.categoryRail} role="group" aria-label="Filtrar por tipo de vino">
        <button type="button" aria-pressed={!category} onClick={() => setCategory("")}>Todos los vinos</button>
        {categories.map(type => <button type="button" key={type} aria-pressed={category === type} onClick={() => setCategory(type)}>{type}</button>)}
      </div>}
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" /><path d="m15.5 15.5 4.5 4.5" stroke="currentColor" strokeWidth="1.4" /></svg>
          <span className={styles.srOnly}>Buscar por vino, uva, región, añada o maridaje</span>
          <input ref={searchInput} type="search" placeholder="Busca un vino, uva o región…" value={query} onChange={event => setQuery(event.target.value)} />
        </label>
        <button className={styles.filterButton} type="button" aria-haspopup="dialog" onClick={openFilters}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 17h16M9 4v6m6 4v6" stroke="currentColor" strokeWidth="1.4" /></svg>
          Filtrar{activeCount > 0 && <span className={styles.filterCount}>{activeCount}</span>}
        </button>
        <label className={styles.sort}><span>Ordenar</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="name">Nombre A–Z</option><option value="low">Menor precio</option><option value="high">Mayor precio</option></select></label>
      </div>
    </div>

    {active && <div className={styles.activeFilters} aria-label="Filtros activos">
      {chips.map(chip => <button type="button" key={chip.label} onClick={chip.clear} aria-label={`Quitar ${chip.label}`}>{chip.label}<CloseIcon /></button>)}
      <button type="button" className={styles.clearAll} onClick={reset}>Borrar todo</button>
    </div>}
    <div className={styles.resultSummary}><p role="status" aria-live="polite">{filtered.length} vino{filtered.length === 1 ? "" : "s"}{active ? " en tu selección" : " por descubrir"}</p><span>Precios en MXN</span></div>
    <div className={styles.productGrid}>
      {filtered.map((wine, index) => <WineCard wine={wine} key={wine.id ?? `${wine.nombre}-${index}`} />)}
    </div>
    {!filtered.length && <div className={styles.empty}><h2>{wines.length ? "Tu vino está por descubrir." : "Estamos preparando la selección."}</h2><p>{wines.length ? "Prueba otra búsqueda o retira algún filtro." : "Muy pronto, nuevas botellas por descubrir."}</p>{active && <button type="button" className={styles.darkPill} onClick={() => { reset(); searchInput.current?.focus(); }}>Ver todos los vinos</button>}</div>}
    <div className={styles.publication}><p>{date ? `Selección publicada el ${date}.` : "Nuestra selección de vinos."}</p><button type="button" onClick={() => window.print()}>Imprimir selección</button></div>

    <dialog ref={drawer} className={`${styles.filterDialog} ${styles.shopFilterDialog}`} aria-labelledby="filters-heading" onClose={() => setFiltersOpen(false)} onClick={event => { if (event.target === event.currentTarget) drawer.current?.close(); }}>
      <div className={styles.filterPanelHeading}><p className={styles.eyebrow}>A TU GUSTO</p><button type="button" className={styles.close} aria-label="Cerrar filtros" onClick={() => drawer.current?.close()}><CloseIcon /></button><h2 id="filters-heading">Encuentra<br />tu vino.</h2></div>
      <div className={styles.filterPanelBody}><div className={styles.filters}>
        {categories.length > 0 && <label htmlFor="filter-type">Tipo<select id="filter-type" value={category} onChange={event => setCategory(event.target.value)}><option value="">Todos los tipos</option>{categories.map(type => <option key={type}>{type}</option>)}</select></label>}
        {years.length > 0 && <label htmlFor="filter-year">Añada<select id="filter-year" value={year} onChange={event => setYear(event.target.value)}><option value="">Todas las añadas</option>{years.map(value => <option key={value}>{value}</option>)}</select></label>}
        <label htmlFor="filter-price">Presupuesto<select id="filter-price" value={budget} onChange={event => setBudget(Number(event.target.value))}>{BUDGETS.map((range, index) => <option key={range.label} value={index}>{range.label}</option>)}</select></label>
        {facetOptions.filter(facet => facet.options.length > 0).map(({ key, label, options }) => <label key={key} htmlFor={`filter-${key}`}>{label}<select id={`filter-${key}`} value={facets[key] ?? ""} onChange={event => setFacets(current => ({ ...current, [key]: event.target.value }))}><option value="">Todos</option>{options.map(value => <option key={value} value={value}>{value}{key === "alcohol" ? "%" : ""}</option>)}</select></label>)}
      </div></div>
      <div className={styles.filterPanelFooter}><button type="button" className={styles.darkPill} onClick={() => drawer.current?.close()}>Ver {filtered.length} vino{filtered.length === 1 ? "" : "s"}</button>{active && <button type="button" className={styles.reset} onClick={reset}>Borrar todo</button>}</div>
    </dialog>
  </section>;
}

function WineCard({ wine }: { wine: PublicWine }) {
  const content = <>
    <div className={styles.productImage}>{wine.fotoUrl ? <Image src={wine.fotoUrl} alt={`${wine.nombre}${wine.anio ? `, ${wine.anio}` : ""}`} fill sizes="(max-width: 700px) 45vw, 29vw" className={styles.bottleImage} /> : <span className={styles.noImage}>Fotografía próximamente</span>}</div>
    <div className={styles.cardDetails}><p className={styles.eyebrow}>{[wine.categoria, wine.anio].filter(Boolean).join(" · ")}</p><h2>{wine.nombre}</h2>{wine.region && <p className={styles.cardRegion}>{wine.region}</p>}<p className={styles.cardPrice}>{wine.precioLista !== null ? money.format(wine.precioLista) : "Precio por confirmar"}</p></div>
  </>;
  return <article className={styles.card}>{wine.id ? <Link href={`/catalogo-publico/${wine.id}`} prefetch={false}>{content}</Link> : <div>{content}</div>}</article>;
}
