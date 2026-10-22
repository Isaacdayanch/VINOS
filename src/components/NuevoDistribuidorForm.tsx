"use client";

import { useState } from "react";
import { crearDistribuidor } from "@/app/(app)/distribuidores/actions";
import { ClientePicker } from "@/components/ClientePicker";
import { DateField } from "@/components/DateField";

type ClienteOpcion = { id: string; nombre: string; codigo?: string | null };

export function NuevoDistribuidorForm({
  clientes,
  volver,
  clienteIdInicial,
}: {
  clientes: ClienteOpcion[];
  volver?: string;
  clienteIdInicial?: string;
}) {
  const [tipo, setTipo] = useState<"DISTRIBUIDOR" | "EVENTO">(clienteIdInicial ? "EVENTO" : "DISTRIBUIDOR");
  const [clienteId, setClienteId] = useState(clienteIdInicial ?? "");

  return (
    <form action={crearDistribuidor} className="flex flex-col gap-4">
      {volver && <input type="hidden" name="volver" value={volver} />}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">¿Qué es?</span>
        <select
          name="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "DISTRIBUIDOR" | "EVENTO")}
          className="rounded-md border border-border bg-surface px-3 py-2"
        >
          <option value="DISTRIBUIDOR">Distribuidor</option>
          <option value="EVENTO">Evento</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Nombre</span>
        <input
          name="nombre"
          required
          placeholder={tipo === "EVENTO" ? "Ej. Boda de Daniel Tochi" : "Nombre del distribuidor"}
          className="rounded-md border border-border bg-surface px-3 py-2"
        />
      </label>

      {tipo === "EVENTO" && <DateField name="fechaEvento" label="Fecha del evento" />}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Teléfono (opcional)</span>
        <input name="telefono" className="rounded-md border border-border bg-surface px-3 py-2" />
      </label>

      {clientes.length > 0 && (
        <ClientePicker
          name="clienteId"
          label="Vincular con un cliente (opcional)"
          clientes={clientes}
          value={clienteId}
          onChange={setClienteId}
        />
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Notas (opcional)</span>
        <input name="notas" className="rounded-md border border-border bg-surface px-3 py-2" />
      </label>

      <button type="submit" className="rounded-md bg-wine text-white px-4 py-2 font-medium">
        {tipo === "EVENTO" ? "Crear evento" : "Crear distribuidor"}
      </button>
    </form>
  );
}
