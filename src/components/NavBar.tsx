"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard", disponible: true },
  { href: "/stock", label: "Stock", disponible: true },
  { href: "/pedidos", label: "Pedidos", disponible: true },
  { href: "/productos", label: "Productos", disponible: true },
  { href: "/ordenes", label: "Órdenes", disponible: true },
  { href: "/recibos", label: "Recibos", disponible: true },
  { href: "/clientes", label: "Clientes", disponible: true },
  { href: "/finanzas", label: "Finanzas", disponible: true },
];

export function NavBar() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-wine text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
          <span>Vinos</span>
          <span className="text-[10px] font-bold tracking-wider bg-wine-light/25 text-white rounded-full px-2 py-0.5">
            CRM
          </span>
        </Link>
        <button
          aria-label="Abrir menú"
          onClick={() => setAbierto((v) => !v)}
          className="p-2 -mr-2 text-2xl leading-none cursor-pointer"
        >
          ☰
        </button>

        {abierto && (
          <>
            <button
              aria-label="Cerrar menú"
              onClick={() => setAbierto(false)}
              className="fixed inset-0 z-10 cursor-default bg-black/20"
            />
            <nav className="absolute right-0 top-full mt-2 z-20 w-56 rounded-lg bg-surface text-foreground shadow-xl border border-border overflow-hidden">
              <ul className="flex flex-col py-1">
                {links.map((link) => {
                  const activo = pathname === link.href;
                  if (!link.disponible) {
                    return (
                      <li
                        key={link.href}
                        className="px-4 py-2.5 text-muted flex justify-between text-sm"
                      >
                        <span>{link.label}</span>
                        <span className="text-xs italic">Próximamente</span>
                      </li>
                    );
                  }
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setAbierto(false)}
                        className={`block px-4 py-2.5 text-sm ${
                          activo
                            ? "bg-wine-light font-semibold text-wine"
                            : "hover:bg-wine-light/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
