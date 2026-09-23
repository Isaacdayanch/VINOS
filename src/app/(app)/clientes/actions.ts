"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { CategoriaPrecio } from "@prisma/client";
import { siguienteCodigoCliente } from "@/lib/clienteCodigo";

export async function crearCliente(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const categoriaPrecio = String(formData.get("categoriaPrecio") ?? "LISTA") as CategoriaPrecio;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!nombre) {
    throw new Error("El nombre es obligatorio");
  }

  const codigo = await siguienteCodigoCliente();
  await prisma.cliente.create({
    data: { nombre, telefono, email, categoriaPrecio, notas, codigo },
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function crearClienteRapido(nombre: string) {
  const nombreLimpio = nombre.trim();
  if (!nombreLimpio) {
    throw new Error("El nombre es obligatorio");
  }

  const codigo = await siguienteCodigoCliente();
  const cliente = await prisma.cliente.create({
    data: { nombre: nombreLimpio, categoriaPrecio: "LISTA", codigo },
  });

  revalidatePath("/clientes");
  return { id: cliente.id, nombre: cliente.nombre };
}

export async function actualizarPrecioCliente(
  clienteId: string,
  productoId: string,
  formData: FormData,
) {
  const valor = formData.get("precio");
  const precio = valor === null || valor === "" ? null : Number(valor);

  if (precio === null || Number.isNaN(precio) || precio <= 0) {
    // Sin precio válido = quitar el precio especial, vuelve a usar el de lista.
    await prisma.precioClienteProducto.deleteMany({ where: { clienteId, productoId } });
  } else {
    await prisma.precioClienteProducto.upsert({
      where: { clienteId_productoId: { clienteId, productoId } },
      create: { clienteId, productoId, precio },
      update: { precio },
    });
  }

  revalidatePath(`/clientes/${clienteId}`);
  revalidatePath("/ordenes/nueva");
}
