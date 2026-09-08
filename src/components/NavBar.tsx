"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type SVGProps } from "react";

function Icono(props: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      {...rest}
    >
      {children}
    </svg>
  );
}

const iconos: Record<string, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  "/": (p) => (
    <Icono {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </Icono>
  ),
  "/finanzas": (p) => (
    <Icono {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.3 9.2c0-1.1 1-1.9 2.7-1.9s2.7.9 2.7 2c0 2.7-5.4 1.4-5.4 4.1 0 1.1 1.1 2 2.7 2s2.8-.8 2.8-1.9" />
    </Icono>
  ),
  "/stock": (p) => (
    <Icono {...p}>
      <path d="M3 8l9-5 9 5-9 5-9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </Icono>
  ),
  "/pedidos": (p) => (
    <Icono {...p}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </Icono>
  ),
  "/ordenes": (p) => (
    <Icono {...p}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Icono>
  ),
  "/clientes": (p) => (
    <Icono {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
    </Icono>
  ),
  "/recibos": (p) => (
    <Icono {...p}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </Icono>
  ),
};

const links = [
  { href: "/", label: "Inicio", disponible: true },
  { href: "/finanzas", label: "Finanzas", disponible: true },
  { href: "/stock", label: "Stock", disponible: true },
  { href: "/pedidos", label: "Pedidos a proveedores", disponible: true },
  { href: "/ordenes", label: "Órdenes de clientes", disponible: true },
  { href: "/clientes", label: "Clientes", disponible: true },
  { href: "/recibos", label: "Recibos", disponible: true },
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
            <nav className="absolute right-0 top-full mt-2 z-20 w-60 rounded-lg bg-surface text-foreground shadow-xl border border-border overflow-hidden">
              <ul className="flex flex-col py-1">
                {links.map((link) => {
                  const activo = pathname === link.href;
                  const Icon = iconos[link.href];
                  if (!link.disponible) {
                    return (
                      <li
                        key={link.href}
                        className="px-4 py-2.5 text-muted flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2.5">
                          {Icon && <Icon />}
                          {link.label}
                        </span>
                        <span className="text-xs italic">Próximamente</span>
                      </li>
                    );
                  }
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setAbierto(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm ${
                          activo
                            ? "bg-wine-light font-semibold text-wine"
                            : "hover:bg-wine-light/50"
                        }`}
                      >
                        {Icon && <Icon />}
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
