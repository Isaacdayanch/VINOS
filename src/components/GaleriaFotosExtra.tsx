"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { agregarImagenExtra, eliminarImagenExtra } from "@/app/(app)/productos/actions";

type Imagen = { id: string; url: string };

export function GaleriaFotosExtra({
  productoId,
  imagenes,
  max,
}: {
  productoId: string;
  imagenes: Imagen[];
  max: number;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subir(archivo: File | undefined) {
    if (!archivo) return;
    setError(null);
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.set("imagen", archivo);
      await agregarImagenExtra(productoId, formData);
      router.refresh();
    } catch {
      setError("No se pudo subir la foto. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  }

  async function eliminar(imagenId: string) {
    setEliminando(imagenId);
    try {
      await eliminarImagenExtra(imagenId, productoId);
      router.refresh();
    } finally {
      setEliminando(null);
    }
  }

  const faltan = max - imagenes.length;

  return (
    <div className="rounded-lg border border-border p-4 flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium">
          Fotos extra ({imagenes.length}/{max})
        </p>
        <p className="text-xs text-muted">Se ven en la galería de la página pública de este vino.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {imagenes.map((img) => (
          <div key={img.id} className="relative w-20 aspect-[2/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={() => eliminar(img.id)}
              disabled={eliminando === img.id}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-wine text-white text-xs leading-none flex items-center justify-center shadow hover:bg-wine-dark active:scale-90 disabled:opacity-60 transition-all"
            >
              {eliminando === img.id ? "…" : "×"}
            </button>
          </div>
        ))}

        {faltan > 0 && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => !subiendo && inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastrando(false);
              subir(e.dataTransfer.files?.[0]);
            }}
            className={`cursor-pointer w-20 aspect-[2/3] rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
              arrastrando
                ? "border-wine bg-wine-light/50"
                : "border-border bg-surface hover:border-wine/50"
            }`}
          >
            {subiendo ? (
              <span className="w-4 h-4 rounded-full border-2 border-wine border-t-transparent animate-spin" />
            ) : (
              <span className="text-2xl text-muted leading-none">+</span>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          subir(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {faltan <= 0 && <p className="text-xs text-muted">Ya tienes el máximo de fotos extra.</p>}
      {error && <p className="text-xs text-warn">{error}</p>}
    </div>
  );
}
