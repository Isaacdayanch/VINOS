"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { CategoriaPrecio } from "@prisma/client";

export async function crearCliente(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const categoriaPrecio = String(formData.get("categoriaPrecio") ?? "LISTA") as CategoriaPrecio;
  const notas = String(formData.get("notas") ?? "").trim() || null;

  if (!nombre) {
    throw new Error("El nombre es obligatorio");
  }

  await prisma.cliente.create({
    data: { nombre, telefono, email, categoriaPrecio, notas },
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function crearClienteRapido(nombre: string) {
  const nombreLimpio = nombre.trim();
  if (!nombreLimpio) {
    throw new Error("El nombre es obligatorio");
  }

  const cliente = await prisma.cliente.create({
    data: { nombre: nombreLimpio, categoriaPrecio: "LISTA" },
  });

  revalidatePath("/clientes");
  return { id: cliente.id, nombre: cliente.nombre };
}
