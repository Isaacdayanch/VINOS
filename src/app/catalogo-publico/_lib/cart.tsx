"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** A bottle in the visitor's basket. Price is only for display: the server re-prices
 *  every line from the published catalog when the order is placed. */
export type CartItem = { id: string; nombre: string; precio: number | null; foto: string | null; detalle: string; cantidad: number };

type CartContext = {
  items: CartItem[];
  bottles: number;
  subtotal: number;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  setQuantity: (id: string, cantidad: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const KEY = "cava18-carrito";
export const MAX_POR_BOTELLA = 60;
const Context = createContext<CartContext | null>(null);

function read(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => item && typeof item.id === "string" && typeof item.nombre === "string" && Number.isInteger(item.cantidad) && item.cantidad > 0)
      .map(item => ({ ...item, foto: item.foto ?? null, detalle: item.detalle ?? "", precio: typeof item.precio === "number" ? item.precio : null }));
  } catch { return []; }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // The basket lives in this browser only; it is read after mount so the server HTML stays stable.
  useEffect(() => {
    const frame = requestAnimationFrame(() => { setItems(read()); setReady(true); });
    const sync = (event: StorageEvent) => { if (event.key === KEY) setItems(read()); };
    window.addEventListener("storage", sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("storage", sync); };
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }, []);

  const add = useCallback((item: Omit<CartItem, "cantidad">, cantidad = 1) => {
    const current = read();
    const existing = current.find(entry => entry.id === item.id);
    const next = existing
      ? current.map(entry => entry.id === item.id ? { ...entry, ...item, cantidad: Math.min(MAX_POR_BOTELLA, entry.cantidad + cantidad) } : entry)
      : [...current, { ...item, cantidad: Math.min(MAX_POR_BOTELLA, cantidad) }];
    persist(next);
    setOpen(true);
  }, [persist]);

  const setQuantity = useCallback((id: string, cantidad: number) => {
    const current = read();
    persist(cantidad <= 0 ? current.filter(entry => entry.id !== id) : current.map(entry => entry.id === id ? { ...entry, cantidad: Math.min(MAX_POR_BOTELLA, cantidad) } : entry));
  }, [persist]);

  const remove = useCallback((id: string) => persist(read().filter(entry => entry.id !== id)), [persist]);
  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<CartContext>(() => ({
    items, ready, open, setOpen, add, setQuantity, remove, clear,
    bottles: items.reduce((sum, item) => sum + item.cantidad, 0),
    subtotal: items.reduce((sum, item) => sum + (item.precio ?? 0) * item.cantidad, 0),
  }), [items, ready, open, add, setQuantity, remove, clear]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCart() {
  const context = useContext(Context);
  if (!context) throw new Error("useCart necesita CartProvider");
  return context;
}

export const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
