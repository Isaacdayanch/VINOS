"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard", disponible: true },
  { href: "/stock", label: "Stock", disponible: true },
  { href: "/productos", label: "Productos", disponible: true },
  { href: "/ordenes", label: "Órdenes", disponible: false },
  { href: "/recibos", label: "Recibos", disponible: false },
  { href: "/clientes", label: "Clientes", disponible: false },
  { href: "/finanzas", label: "Finanzas", disponible: false },
];

export function NavBar() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-wine text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          🍷 Vinos CRM
        </Link>
        <button
          aria-label="Abrir menú"
          onClick={() => setAbierto((v) => !v)}
          className="p-2 -mr-2 text-2xl leading-none cursor-pointer"
        >
          ☰
        </button>
      </div>
      {abierto && (
        <nav className="border-t border-white/20 bg-wine-dark">
          <ul className="max-w-5xl mx-auto flex flex-col">
            {links.map((link) => {
              const activo = pathname === link.href;
              if (!link.disponible) {
                return (
                  <li key={link.href} className="px-4 py-3 text-white/40 flex justify-between">
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
                    className={`block px-4 py-3 ${
                      activo ? "bg-wine font-semibold" : "hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
