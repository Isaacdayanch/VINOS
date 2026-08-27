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
  fotoUrl?: string | null;
};

export function ProductoForm({
  action,
  defaultValues,
  botonTexto,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ProductoDefaults;
  botonTexto: string;
}) {
  const d = defaultValues ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      {d.fotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={d.fotoUrl}
          alt="Foto actual"
          className="w-24 h-24 object-cover rounded-md border border-border"
        />
      )}
      <Campo label="Foto de la botella" name="foto" type="file" accept="image/*" />

      <Campo label="Nombre del vino" name="nombre" defaultValue={d.nombre} required />
      <Campo label="SKU" name="sku" defaultValue={d.sku} required />

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

      <div className="rounded-lg border border-border p-4 flex flex-col gap-4">
        <p className="text-sm font-medium">Precios (opcional, se puede ajustar en cada venta)</p>
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
      </div>

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        {botonTexto}
      </button>
    </form>
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
