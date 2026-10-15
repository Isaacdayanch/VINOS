"use client";

import { useState } from "react";
import { actualizarUbicacion, crearUbicacion } from "@/app/(app)/stock/actions";

type Ubicacion = { id: string; nombre: string; direccion: string | null };

function FilaUbicacion({ ubicacion }: { ubicacion: Ubicacion }) {
  const [editando, setEditando] = useState(false);
  const [estado, setEstado] = useState<"listo" | "guardando" | "guardado">("listo");
  const accion = actualizarUbicacion.bind(null, ubicacion.id);

  async function guardar(formData: FormData) {
    setEstado("guardando");
    await accion(formData);
    setEstado("guardado");
    setEditando(false);
    setTimeout(() => setEstado("listo"), 2000);
  }

  if (editando) {
    return (
      <form action={guardar} className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nombre</span>
          <input
            name="nombre"
            defaultValue={ubicacion.nombre}
            required
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Dirección (opcional)</span>
          <input
            name="direccion"
            defaultValue={ubicacion.direccion ?? ""}
            placeholder="Calle, número, colonia..."
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={estado === "guardando"}
            className="rounded-md bg-wine text-white px-3 py-1.5 text-sm font-medium"
          >
            {estado === "guardando" ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={() => setEditando(false)} className="text-sm text-muted underline">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium">{ubicacion.nombre}</p>
        <p className="text-xs text-muted truncate">{ubicacion.direccion || "Sin dirección capturada"}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {estado === "guardado" && <span className="text-xs font-medium text-ok">✓ Guardado</span>}
        <button type="button" onClick={() => setEditando(true)} className="text-xs text-wine underline whitespace-nowrap">
          Editar
        </button>
      </div>
    </div>
  );
}

export function UbicacionesManager({ ubicaciones }: { ubicaciones: Ubicacion[] }) {
  const [agregando, setAgregando] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {ubicaciones.map((u) => (
        <FilaUbicacion key={u.id} ubicacion={u} />
      ))}

      {agregando ? (
        <form
          action={async (formData) => {
            await crearUbicacion(formData);
            setAgregando(false);
          }}
          className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Nombre</span>
            <input
              name="nombre"
              autoFocus
              placeholder="Ej. Bodega Ferrocarril"
              required
              className="rounded-md border border-border bg-surface px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Dirección (opcional)</span>
            <input
              name="direccion"
              placeholder="Calle, número, colonia..."
              className="rounded-md border border-border bg-surface px-3 py-2"
            />
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-wine text-white px-3 py-1.5 text-sm font-medium">
              Agregar ubicación
            </button>
            <button type="button" onClick={() => setAgregando(false)} className="text-sm text-muted underline">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAgregando(true)}
          className="text-sm text-wine underline text-left"
        >
          + Agregar otra ubicación
        </button>
      )}
    </div>
  );
}
