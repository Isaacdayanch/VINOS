"use client";

import { useMemo, useState } from "react";
import { ProductoPicker } from "@/components/ProductoPicker";
import { SubmitButton } from "@/components/SubmitButton";

type Producto = { id: string; nombre: string; fotoUrl: string | null; piezasPorCaja: number };
type Ubicacion = { id: string; nombre: string };
type FilaInicial = { texto: string; cantidad: number; productoIdSugerido: string };
type Fila = { key: string; texto: string; productoId: string; cantidad: number | "" };

export function TransferirLoteForm({
  productos,
  ubicaciones,
  origenInicial,
  destinoInicial,
  stockPorProductoUbicacion,
  filasIniciales,
  action,
}: {
  productos: Producto[];
  ubicaciones: Ubicacion[];
  origenInicial: string;
  destinoInicial: string;
  stockPorProductoUbicacion: Record<string, Record<string, number>>;
  filasIniciales: FilaInicial[];
  action: (formData: FormData) => void;
}) {
  const [origenId, setOrigenId] = useState(origenInicial);
  const [destinoId, setDestinoId] = useState(destinoInicial);
  const [filas, setFilas] = useState<Fila[]>(
    filasIniciales.map((f) => ({
      key: Math.random().toString(36).slice(2),
      texto: f.texto,
      productoId: f.productoIdSugerido,
      cantidad: f.cantidad,
    })),
  );

  function actualizarFila(i: number, cambios: Partial<Fila>) {
    setFilas((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...cambios } : f)));
  }

  function quitarFila(i: number) {
    setFilas((prev) => prev.filter((_, idx) => idx !== i));
  }

  function agregarFila() {
    setFilas((prev) => [
      ...prev,
      { key: Math.random().toString(36).slice(2), texto: "", productoId: "", cantidad: 1 },
    ]);
  }

  function disponibleEnOrigen(productoId: string) {
    if (!productoId) return 0;
    return stockPorProductoUbicacion[productoId]?.[origenId] ?? 0;
  }

  // Si dos líneas apuntan al mismo vino (por ejemplo, dos nombres distintos
  // que resultaron ser el mismo producto), hay que sumar lo que piden entre
  // las dos antes de comparar contra lo que hay disponible en el origen.
  const totalesPorProducto = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of filas) {
      if (!f.productoId || f.cantidad === "" || f.cantidad <= 0) continue;
      m.set(f.productoId, (m.get(f.productoId) ?? 0) + f.cantidad);
    }
    return m;
  }, [filas]);

  const problemas = useMemo(() => {
    const lista: string[] = [];
    if (origenId && destinoId && origenId === destinoId) {
      lista.push("El origen y el destino no pueden ser la misma bodega");
    }
    filas.forEach((f, i) => {
      if (!f.productoId) {
        lista.push(`Línea ${i + 1}: falta elegir el vino`);
      } else if (f.cantidad === "" || f.cantidad <= 0) {
        lista.push(`Línea ${i + 1}: falta la cantidad`);
      }
    });
    for (const [productoId, total] of totalesPorProducto) {
      const disponible = disponibleEnOrigen(productoId);
      if (total > disponible) {
        const nombre = productos.find((p) => p.id === productoId)?.nombre ?? "este vino";
        lista.push(`${nombre}: pediste mover ${total}, pero solo hay ${disponible} en el origen`);
      }
    }
    return lista;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filas, origenId, destinoId, totalesPorProducto]);

  const lineasParaEnviar = filas
    .filter((f) => f.productoId && f.cantidad !== "" && f.cantidad > 0)
    .map((f) => ({ productoId: f.productoId, cantidad: f.cantidad }));

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="origenId" value={origenId} />
      <input type="hidden" name="destinoId" value={destinoId} />
      <input type="hidden" name="lineas" value={JSON.stringify(lineasParaEnviar)} />

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">De dónde sale</span>
          <select
            value={origenId}
            onChange={(e) => setOrigenId(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2"
          >
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">A dónde llega</span>
          <select
            value={destinoId}
            onChange={(e) => setDestinoId(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2"
          >
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {filas.map((f, i) => {
          const disponible = disponibleEnOrigen(f.productoId);
          const cantidadNum = f.cantidad === "" ? 0 : f.cantidad;
          const totalProducto = f.productoId ? totalesPorProducto.get(f.productoId) ?? 0 : 0;
          const alcanza = Boolean(f.productoId) && cantidadNum > 0 && totalProducto <= disponible;
          return (
            <div
              key={f.key}
              className={`rounded-lg border p-3 flex flex-col gap-2 ${
                f.productoId && !alcanza ? "border-warn bg-warn-bg" : "border-border"
              }`}
            >
              {f.texto && <p className="text-xs text-muted">Dijiste: {f.texto}</p>}
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <ProductoPicker
                    name={`__producto_${i}`}
                    productos={productos}
                    seleccionInicial={f.productoId || undefined}
                    sinSeleccionInicial={!f.productoId}
                    onSeleccionar={(p) => actualizarFila(i, { productoId: p.id })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => quitarFila(i)}
                  className="text-muted hover:text-wine text-sm px-2 mt-6"
                  aria-label="Quitar línea"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 items-end">
                <label className="flex flex-col gap-1 text-xs">
                  <span className="text-muted">Cantidad a mover</span>
                  <input
                    type="number"
                    min={1}
                    value={f.cantidad}
                    onChange={(e) =>
                      actualizarFila(i, { cantidad: e.target.value === "" ? "" : Number(e.target.value) })
                    }
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  />
                </label>
                <p className={`text-xs ${f.productoId && !alcanza ? "text-warn font-medium" : "text-muted"}`}>
                  {f.productoId ? `Hay ${disponible} en el origen` : "Elige el vino"}
                </p>
              </div>
            </div>
          );
        })}
        <button type="button" onClick={agregarFila} className="text-sm text-wine underline text-left">
          + Agregar otra línea
        </button>
      </div>

      {problemas.length > 0 && (
        <div className="rounded-lg border border-warn bg-warn-bg p-3 text-sm text-warn">
          <p className="font-medium mb-1">Revisa esto antes de transferir:</p>
          <ul className="list-disc pl-4">
            {problemas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <SubmitButton
        className="rounded-md bg-wine text-white px-4 py-2 font-medium"
        pendingText="Transfiriendo..."
        disabled={problemas.length > 0}
      >
        Confirmar y transferir
      </SubmitButton>
    </form>
  );
}
