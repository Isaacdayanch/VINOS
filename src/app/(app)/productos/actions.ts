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
    precioDistribuidor: numeroOpcional(formData.get("precioDistribuidor")),
    descripcion: String(formData.get("descripcion") ?? "").trim() || null,
    maridaje: String(formData.get("maridaje") ?? "").trim() || null,
    notas: String(formData.get("notas") ?? "").trim() || null,
    varietal: String(formData.get("varietal") ?? "").trim() || null,
    region: String(formData.get("region") ?? "").trim() || null,
    cuerpo: String(formData.get("cuerpo") ?? "").trim() || null,
    alcohol: numeroOpcional(formData.get("alcohol")),
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

const MAX_IMAGENES_EXTRA = 7;

export async function agregarImagenExtra(productoId: string, formData: FormData) {
  const archivo = formData.get("imagen");
  if (!(archivo instanceof File) || archivo.size === 0) {
    throw new Error("Elige una foto");
  }
  const actuales = await prisma.productoImagenExtra.count({ where: { productoId } });
  if (actuales >= MAX_IMAGENES_EXTRA) {
    throw new Error(`Ya tienes el máximo de ${MAX_IMAGENES_EXTRA} fotos extra`);
  }
  const url = await subirFotoProducto(archivo);
  await prisma.productoImagenExtra.create({
    data: { productoId, url, orden: actuales },
  });

  revalidatePath(`/productos/${productoId}/editar`);
  revalidatePath(`/catalogo-publico/${productoId}`);
}

export async function eliminarImagenExtra(imagenId: string, productoId: string) {
  await prisma.productoImagenExtra.delete({ where: { id: imagenId } });
  revalidatePath(`/productos/${productoId}/editar`);
  revalidatePath(`/catalogo-publico/${productoId}`);
}

export async function publicarCatalogo() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, fotoUrl: true, categoria: true, anio: true, precioLista: true },
  });

  await prisma.catalogoPublicado.create({
    data: { productos },
  });

  revalidatePath("/productos/publicar-catalogo");
  revalidatePath("/catalogo-publico");
}
