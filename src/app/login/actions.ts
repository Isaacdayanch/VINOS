"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ACCESO, tokenEsperado } from "@/lib/auth";

export async function iniciarSesion(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const volverRaw = String(formData.get("volver") ?? "/");
  const volver = volverRaw.startsWith("/") ? volverRaw : "/";
  const esperado = process.env.APP_PASSWORD;

  if (!esperado || password !== esperado) {
    redirect(`/login?error=1&volver=${encodeURIComponent(volver)}`);
  }

  const token = await tokenEsperado(esperado);
  const store = await cookies();
  store.set(COOKIE_ACCESO, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  redirect(volver);
}
