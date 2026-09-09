"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { subirFotoProducto } from "@/lib/supabaseStorage";

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
  return subirFotoProducto(foto);
}

const MAPA_ACENTOS: Record<string, string> = {
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U", Ñ: "N",
};

function quitarAcentos(texto: string) {
  return texto
    .toUpperCase()
    .split("")
    .map((c) => MAPA_ACENTOS[c] ?? c)
    .join("");
}

async function generarSku(nombre: string): Promise<string> {
  const letras =
    quitarAcentos(nombre)
      .replace(/[^A-Z\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((palabra) => palabra[0])
      .join("")
      .slice(0, 4) || "VIN";

  for (let intento = 0; intento < 50; intento++) {
    const numero = String(Math.floor(Math.random() * 900) + 100);
    const candidato = `${letras}-${numero}`;
    const existe = await prisma.producto.findUnique({ where: { sku: candidato } });
    if (!existe) return candidato;
  }
  return `${letras}-${Date.now().toString().slice(-6)}`;
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
  if (!datos.nombre || !datos.piezasPorCaja) {
    throw new Error("Nombre y piezas por caja son obligatorios");
  }
  const sku = datos.sku || (await generarSku(datos.nombre));
  const fotoUrl = await guardarFoto(formData.get("foto"));
  const volver = String(formData.get("volver") ?? "").trim();

  const producto = await prisma.producto.create({
    data: { ...datos, sku, fotoUrl },
  });

  revalidatePath("/productos");
  revalidatePath("/stock");

  if (volver.startsWith("/")) {
    revalidatePath(volver);
    redirect(`${volver}?nuevoProducto=${producto.id}`);
  }
  redirect("/productos");
}

export async function actualizarProducto(productoId: string, formData: FormData) {
  const datos = datosDesdeFormulario(formData);
  if (!datos.nombre || !datos.piezasPorCaja) {
    throw new Error("Nombre y piezas por caja son obligatorios");
  }
  const sku = datos.sku || (await generarSku(datos.nombre));
  const fotoUrl = await guardarFoto(formData.get("foto"));

  await prisma.producto.update({
    where: { id: productoId },
    data: { ...datos, sku, ...(fotoUrl ? { fotoUrl } : {}) },
  });

  revalidatePath("/productos");
  revalidatePath("/stock");
  redirect("/productos");
}
