"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Vuelve a cargar los datos de la página actual sin recargar todo el navegador. */
export function RefreshButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => router.refresh())}
      className={`${className} transition-opacity ${pending ? "opacity-60 cursor-wait" : ""}`}
    >
      {pending ? "Actualizando…" : "↻ Actualizar"}
    </button>
  );
}
