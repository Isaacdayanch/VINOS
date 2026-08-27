"use client";

export function BotonImprimir() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-wine text-white px-4 py-2 text-sm font-medium"
    >
      Guardar como PDF
    </button>
  );
}
