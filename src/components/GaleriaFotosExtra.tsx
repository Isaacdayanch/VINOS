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
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<"listo" | "guardando" | "error">("listo");
  const [eliminando, setEliminando] = useState<string | null>(null);

  async function agregar(formData: FormData) {
    setEstado("guardando");
    try {
      await agregarImagenExtra(productoId, formData);
      formRef.current?.reset();
      setEstado("listo");
      router.refresh();
    } catch {
      setEstado("error");
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

  return (
    <div className="rounded-lg border border-border p-4 flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium">
          Fotos extra ({imagenes.length}/{max})
        </p>
        <p className="text-xs text-muted">Se ven en la galería de la página pública de este vino.</p>
      </div>

      {imagenes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imagenes.map((img) => (
            <div key={img.id} className="relative w-16 aspect-[2/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover rounded-md border border-border"
              />
              <button
                type="button"
                onClick={() => eliminar(img.id)}
                disabled={eliminando === img.id}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-wine text-white text-xs leading-none flex items-center justify-center hover:bg-wine-dark disabled:opacity-60"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {imagenes.length < max ? (
        <form ref={formRef} action={agregar} className="flex items-center gap-2 flex-wrap">
          <input name="imagen" type="file" accept="image/*" required className="text-xs" />
          <button
            type="submit"
            disabled={estado === "guardando"}
            className="rounded-md bg-wine text-white px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-wine-dark active:scale-[0.97] disabled:opacity-60 transition-colors"
          >
            {estado === "guardando" ? "Subiendo..." : "+ Agregar foto"}
          </button>
        </form>
      ) : (
        <p className="text-xs text-muted">Ya tienes el máximo de fotos extra.</p>
      )}

      {estado === "error" && (
        <p className="text-xs text-warn">No se pudo subir la foto. Intenta de nuevo.</p>
      )}
    </div>
  );
}
