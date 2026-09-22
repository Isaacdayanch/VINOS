"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function numeroOpcional(valor: FormDataEntryValue | null) {
  if (!valor || valor === "") return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

export async function actualizarPreciosProducto(productoId: string, formData: FormData) {
  const precioLista = numeroOpcional(formData.get("precioLista"));
  const precioDistribuidor = numeroOpcional(formData.get("precioDistribuidor"));

  await prisma.producto.update({
    where: { id: productoId },
    data: { precioLista, precioDistribuidor },
  });

  revalidatePath("/precios");
  revalidatePath("/productos");
  revalidatePath("/ordenes");
}
