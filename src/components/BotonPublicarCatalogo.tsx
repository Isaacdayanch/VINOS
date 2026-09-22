"use client";

import { useState } from "react";
import { publicarCatalogo } from "@/app/(app)/productos/actions";

export function BotonPublicarCatalogo() {
  const [estado, setEstado] = useState<"listo" | "guardando" | "guardado" | "error">("listo");

  async function publicar() {
    setEstado("guardando");
    try {
      await publicarCatalogo();
      setEstado("guardado");
      setTimeout(() => setEstado("listo"), 2500);
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={publicar}
        disabled={estado === "guardando"}
        className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium hover:bg-wine-dark active:scale-[0.97] disabled:opacity-60 disabled:cursor-default transition-colors"
      >
        {estado === "guardando"
          ? "Publicando..."
          : estado === "guardado"
            ? "✓ Publicado"
            : "Publicar catálogo ahora"}
      </button>
      {estado === "error" && (
        <p className="text-xs text-warn">No se pudo publicar. Intenta de nuevo.</p>
      )}
    </div>
  );
}
