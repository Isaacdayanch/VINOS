"use client";

import { useRef, useState } from "react";
import { sugerirMaridaje } from "@/lib/maridaje";

type ProductoDefaults = {
  nombre?: string;
  sku?: string;
  piezasPorCaja?: number;
  anio?: number | null;
  proveedor?: string | null;
  categoria?: string | null;
  activo?: boolean;
  stockMinimo?: number | null;
  precioLista?: number | null;
  precioDescuentoChico?: number | null;
  precioDescuentoGrande?: number | null;
  precioDistribuidor?: number | null;
  fotoUrl?: string | null;
  descripcion?: string | null;
  maridaje?: string | null;
  notas?: string | null;
  varietal?: string | null;
  region?: string | null;
  cuerpo?: string | null;
  alcohol?: number | null;
};

export function ProductoForm({
  action,
  defaultValues,
  botonTexto,
  volver,
  ocultarPrecios,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ProductoDefaults;
  botonTexto: string;
  volver?: string;
  ocultarPrecios?: boolean;
}) {
  const d = defaultValues ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      {volver && <input type="hidden" name="volver" value={volver} />}
      <FotoDropzone fotoActual={d.fotoUrl} />

      <Campo label="Nombre del vino" name="nombre" defaultValue={d.nombre} required />
      <Campo
        label="SKU (opcional — se genera solo si lo dejas vacío)"
        name="sku"
        defaultValue={d.sku}
        placeholder="Se asigna automático"
      />

      <div className="grid grid-cols-2 gap-4">
        <Campo
          label="Piezas por caja"
          name="piezasPorCaja"
          type="number"
          defaultValue={d.piezasPorCaja?.toString()}
          required
        />
        <Campo
          label="Año (opcional)"
          name="anio"
          type="number"
          defaultValue={d.anio?.toString()}
        />
      </div>

      <Campo label="Proveedor / Bodega" name="proveedor" defaultValue={d.proveedor ?? undefined} />
      <Campo label="Categoría" name="categoria" defaultValue={d.categoria ?? undefined} placeholder="Ej. Tinto, Reserva, Postre" />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="activo" defaultChecked={d.activo ?? true} />
        <span>Producto activo</span>
      </label>

      <Campo
        label="Stock mínimo antes de avisar (botellas)"
        name="stockMinimo"
        type="number"
        defaultValue={d.stockMinimo?.toString()}
        placeholder="Ej. 8"
      />

      <FichaCliente d={d} />

      {!ocultarPrecios && (
        <div className="rounded-lg border border-border p-4 flex flex-col gap-4">
          <p className="text-sm font-medium">Precios de venta (opcional, se puede ajustar en cada venta)</p>
          <Campo
            label="Precio de lista"
            name="precioLista"
            type="number"
            step="0.01"
            defaultValue={d.precioLista?.toString()}
          />
          <Campo
            label="Precio con descuento chico"
            name="precioDescuentoChico"
            type="number"
            step="0.01"
            defaultValue={d.precioDescuentoChico?.toString()}
          />
          <Campo
            label="Precio con descuento grande"
            name="precioDescuentoGrande"
            type="number"
            step="0.01"
            defaultValue={d.precioDescuentoGrande?.toString()}
          />
          <Campo
            label="Precio distribuidor"
            name="precioDistribuidor"
            type="number"
            step="0.01"
            defaultValue={d.precioDistribuidor?.toString()}
          />
        </div>
      )}

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        {botonTexto}
      </button>
    </form>
  );
}

function FichaCliente({ d }: { d: ProductoDefaults }) {
  const varietalRef = useRef<HTMLInputElement>(null);
  const cuerpoRef = useRef<HTMLSelectElement>(null);
  const maridajeRef = useRef<HTMLTextAreaElement>(null);

  function sugerir() {
    const sugerencia = sugerirMaridaje(varietalRef.current?.value, cuerpoRef.current?.value);
    if (maridajeRef.current) maridajeRef.current.value = sugerencia;
  }

  return (
    <div className="rounded-lg border border-border p-4 flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium">Ficha para el cliente (opcional)</p>
        <p className="text-xs text-muted">
          Esto se muestra en la página pública de cada vino. Si lo dejas vacío, nada más no
          aparece esa sección.
        </p>
      </div>

      <TextArea label="Descripción" name="descripcion" defaultValue={d.descripcion ?? undefined} />

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Uva / Varietal</span>
          <input
            ref={varietalRef}
            name="varietal"
            defaultValue={d.varietal ?? undefined}
            placeholder="Ej. Cabernet Sauvignon"
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Cuerpo</span>
          <select
            ref={cuerpoRef}
            name="cuerpo"
            defaultValue={d.cuerpo ?? ""}
            className="rounded-md border border-border bg-surface px-3 py-2"
          >
            <option value="">Sin especificar</option>
            <option value="Ligero">Ligero</option>
            <option value="Medio">Medio</option>
            <option value="Lleno">Lleno</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Región" name="region" defaultValue={d.region ?? undefined} />
        <Campo
          label="% Alcohol"
          name="alcohol"
          type="number"
          step="0.1"
          defaultValue={d.alcohol?.toString()}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">Con qué comer (maridaje)</span>
          <button
            type="button"
            onClick={sugerir}
            className="text-xs text-wine underline whitespace-nowrap"
          >
            Sugerir según la uva/cuerpo
          </button>
        </div>
        <textarea
          ref={maridajeRef}
          name="maridaje"
          defaultValue={d.maridaje ?? undefined}
          rows={3}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      <TextArea label="Notas de cata" name="notas" defaultValue={d.notas ?? undefined} />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="rounded-md border border-border bg-surface px-3 py-2"
      />
    </label>
  );
}

function FotoDropzone({ fotoActual }: { fotoActual?: string | null }) {
  const [preview, setPreview] = useState<string | null>(fotoActual ?? null);
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function usarArchivo(archivo: File | undefined) {
    if (!archivo) return;
    if (inputRef.current) {
      const lista = new DataTransfer();
      lista.items.add(archivo);
      inputRef.current.files = lista.files;
    }
    const url = URL.createObjectURL(archivo);
    setPreview(url);
  }

  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium">Foto de la botella</span>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
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
          usarArchivo(e.dataTransfer.files?.[0]);
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed ${
          arrastrando ? "border-wine bg-wine-light/50" : "border-border bg-surface"
        } flex flex-col items-center justify-center gap-2 py-8 px-4 text-center transition-colors`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto de la botella"
            className="w-24 aspect-[2/3] object-contain rounded-md border border-border bg-surface p-1"
          />
        ) : (
          <span className="text-3xl text-muted">+</span>
        )}
        <p className="text-muted text-xs">
          {preview ? "Cambiar foto — arrastra otra o haz clic" : "Arrastra una foto aquí o haz clic para elegir"}
        </p>
      </div>
      <input
        ref={inputRef}
        name="foto"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => usarArchivo(e.target.files?.[0])}
      />
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  step?: string;
  accept?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        className="rounded-md border border-border bg-surface px-3 py-2"
        {...rest}
      />
    </label>
  );
}
