"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function numeroOpcional(valor: FormDataEntryValue | null) {
  if (!valor || valor === "") return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

function enteroOpcional(valor: FormDataEntryValue | null) {
  const n = numeroOpcional(valor);
  return n === null ? null : Math.round(n);
}

async function guardarFoto(foto: FormDataEntryValue | null): Promise<string | null> {
  if (!(foto instanceof File) || foto.size === 0) return null;
  const extension = foto.name.split(".").pop() || "jpg";
  const nombreArchivo = `${randomUUID()}.${extension}`;
  const carpeta = path.join(process.cwd(), "public", "uploads");
  await mkdir(carpeta, { recursive: true });
  const bytes = Buffer.from(await foto.arrayBuffer());
  await writeFile(path.join(carpeta, nombreArchivo), bytes);
  return `/uploads/${nombreArchivo}`;
}

function datosDesdeFormulario(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim(),
    piezasPorCaja: Number(formData.get("piezasPorCaja")),
    anio: enteroOpcional(formData.get("anio")),
    proveedor: String(formData.get("proveedor") ?? "").trim() || null,
    categoria: String(formData.get("categoria") ?? "").trim() || null,
    activo: formData.get("activo") === "on",
    stockMinimo: enteroOpcional(formData.get("stockMinimo")),
    precioLista: numeroOpcional(formData.get("precioLista")),
    precioDescuentoChico: numeroOpcional(formData.get("precioDescuentoChico")),
    precioDescuentoGrande: numeroOpcional(formData.get("precioDescuentoGrande")),
  };
}

export async function crearProducto(formData: FormData) {
  const datos = datosDesdeFormulario(formData);
  if (!datos.nombre || !datos.sku || !datos.piezasPorCaja) {
    throw new Error("Nombre, SKU y piezas por caja son obligatorios");
  }
  const fotoUrl = await guardarFoto(formData.get("foto"));

  await prisma.producto.create({
    data: { ...datos, fotoUrl },
  });

  revalidatePath("/productos");
  revalidatePath("/stock");
  redirect("/productos");
}

export async function actualizarProducto(productoId: string, formData: FormData) {
  const datos = datosDesdeFormulario(formData);
  if (!datos.nombre || !datos.sku || !datos.piezasPorCaja) {
    throw new Error("Nombre, SKU y piezas por caja son obligatorios");
  }
  const fotoUrl = await guardarFoto(formData.get("foto"));

  await prisma.producto.update({
    where: { id: productoId },
    data: { ...datos, ...(fotoUrl ? { fotoUrl } : {}) },
  });

  revalidatePath("/productos");
  revalidatePath("/stock");
  redirect("/productos");
}
