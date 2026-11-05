"use server";

import { prisma } from "@/lib/prisma";
import { CLAVES, guardarConfiguracion, telefonoLimpio } from "@/lib/tienda";
import { revalidatePath } from "next/cache";

function refrescar() {
  revalidatePath("/tienda");
  revalidatePath("/catalogo-publico");
  revalidatePath("/catalogo-publico/catalogo");
  revalidatePath("/catalogo-publico/destilados");
  revalidatePath("/catalogo-publico/pedido");
}

export async function guardarAnuncio(formData: FormData) {
  await guardarConfiguracion({
    [CLAVES.anuncioActivo]: formData.get("activo") ? "1" : "0",
    [CLAVES.anuncioTitulo]: String(formData.get("titulo") ?? "").trim().slice(0, 60),
    [CLAVES.anuncioTexto]: String(formData.get("texto") ?? "").trim().slice(0, 300),
    [CLAVES.anuncioHasta]: String(formData.get("hasta") ?? "").trim().slice(0, 10),
  });
  refrescar();
}

export async function guardarPedidosAbiertos(formData: FormData) {
  await guardarConfiguracion({ [CLAVES.pedidosAbiertos]: formData.get("abiertos") ? "1" : "0" });
  refrescar();
}

export async function guardarDestinatariosWhatsApp(formData: FormData) {
  const telefonos = String(formData.get("telefonos") ?? "").split(/[\s,;\n]+/).map(telefonoLimpio).filter((t) => t.length === 10);
  await guardarConfiguracion({ [CLAVES.whatsappDestinatarios]: [...new Set(telefonos)].join(",") });
  refrescar();
}

export async function guardarDestinatariosCorreo(formData: FormData) {
  const correos = String(formData.get("correos") ?? "").split(/[\s,;\n]+/).map((c) => c.trim().toLowerCase()).filter((c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c));
  await guardarConfiguracion({ [CLAVES.correoDestinatarios]: [...new Set(correos)].join(",") });
  refrescar();
}

export async function guardarZona(zonaId: string, formData: FormData) {
  const costo = Number(formData.get("costoEnvio"));
  const gratis = String(formData.get("botellasEnvioGratis") ?? "").trim();
  await prisma.zonaEntrega.update({
    where: { id: zonaId },
    data: {
      activa: Boolean(formData.get("activa")),
      costoEnvio: Number.isFinite(costo) && costo >= 0 ? costo : 0,
      botellasEnvioGratis: gratis && Number(gratis) > 0 ? Math.floor(Number(gratis)) : null,
      nota: String(formData.get("nota") ?? "").trim().slice(0, 200) || null,
    },
  });
  refrescar();
}
