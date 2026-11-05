import { prisma } from "@/lib/prisma";
import { CLAVES, anuncioVigente, hoyMexico, leerConfiguracion, pedidosAbiertos } from "@/lib/tienda";
import { whatsappConfigurado } from "@/lib/whatsapp";
import { correoConfigurado } from "@/lib/correo";
import { SubmitButton } from "@/components/SubmitButton";
import { urlCatalogoPublico } from "@/lib/catalogoPublico";
import Link from "next/link";
import { guardarAnuncio, guardarDestinatariosCorreo, guardarDestinatariosWhatsApp, guardarPedidosAbiertos, guardarZona } from "./actions";

export const dynamic = "force-dynamic";

const input = "rounded-md border border-border bg-surface px-3 py-2 text-sm w-full";
const boton = "rounded-md bg-wine text-white px-4 py-2 text-sm font-medium";

export default async function TiendaPage() {
  const [config, zonas] = await Promise.all([leerConfiguracion(), prisma.zonaEntrega.findMany({ orderBy: [{ orden: "asc" }, { nombre: "asc" }] })]);
  const anuncio = anuncioVigente(config);
  const hasta = config[CLAVES.anuncioHasta] ?? "";
  const vencido = Boolean(hasta) && hasta < hoyMexico();

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <Link href="/pedidos-web" className="text-sm text-wine underline">← Pedidos en línea</Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Tienda en línea</h1>
        <p className="text-muted text-sm">Lo que ve el cliente en <a href={urlCatalogoPublico("/catalogo-publico/catalogo")} className="underline" target="_blank" rel="noopener noreferrer">lacava18.com</a>: envíos, zonas, el anuncio de arriba y a quién avisar.</p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Pedidos en línea</h2>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${pedidosAbiertos(config) ? "bg-ok/10 text-ok" : "bg-warn-bg text-warn"}`}>{pedidosAbiertos(config) ? "Abiertos" : "Cerrados"}</span>
        </div>
        <form action={guardarPedidosAbiertos} className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="abiertos" defaultChecked={pedidosAbiertos(config)} className="h-4 w-4" /> Aceptar pedidos desde la página</label>
          <SubmitButton className={boton} pendingText="Guardando…">Guardar</SubmitButton>
        </form>
        <p className="text-xs text-muted">Si lo apagas, el carrito sigue visible pero el botón de “Hacer mi pedido” dice que por el momento no hay pedidos (por ejemplo en vacaciones).</p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Anuncio arriba de la página</h2>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${anuncio ? "bg-ok/10 text-ok" : "bg-border text-muted"}`}>{anuncio ? "Visible" : vencido && config[CLAVES.anuncioActivo] === "1" ? "Ya venció" : "Oculto"}</span>
        </div>
        <p className="text-sm text-muted">Una franja elegante arriba del logo, por ejemplo para avisar fechas de entrega en Cuernavaca y Acapulco. Se quita solo cuando pasa la fecha “hasta”.</p>
        <form action={guardarAnuncio} className="flex flex-col gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="activo" defaultChecked={config[CLAVES.anuncioActivo] === "1"} className="h-4 w-4" /> Mostrar el anuncio</label>
          <label className="flex flex-col gap-1"><span className="text-muted">Título corto (opcional)</span><input name="titulo" defaultValue={config[CLAVES.anuncioTitulo] ?? ""} placeholder="Entregas de temporada" maxLength={60} className={input} /></label>
          <label className="flex flex-col gap-1"><span className="text-muted">Texto</span><textarea name="texto" defaultValue={config[CLAVES.anuncioTexto] ?? ""} rows={3} maxLength={300} placeholder="Tendremos entregas en Cuernavaca y Acapulco el 25 de diciembre, el 30 de diciembre y el 5 de enero. Haz tu pedido con dos días de anticipación." className={input} /></label>
          <label className="flex flex-col gap-1 max-w-xs"><span className="text-muted">Mostrar hasta (último día, incluido)</span><input type="date" name="hasta" defaultValue={hasta} className={input} /></label>
          <div><SubmitButton className={boton} pendingText="Guardando…">Guardar anuncio</SubmitButton></div>
        </form>
        {anuncio && (
          <div className="rounded-md overflow-hidden border border-border">
            <p className="text-[10px] text-muted px-3 pt-2">Así se ve:</p>
            <div className="bg-[#651b32] text-[#f6ebe0] text-center text-xs px-4 py-2.5 leading-relaxed">
              {anuncio.titulo && <span className="uppercase tracking-wider text-[#e8c98a] mr-3">{anuncio.titulo}</span>}
              {anuncio.texto}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Zonas de entrega y envío</h2>
          <p className="text-sm text-muted">Se decide por el código postal del cliente. Prende Cuernavaca y Acapulco solo en las fechas que vayas a entregar.</p>
        </div>
        <div className="divide-y divide-border">
          {zonas.map((z) => (
            <form key={z.id} action={guardarZona.bind(null, z.id)} className="py-4 first:pt-0 last:pb-0 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 font-medium"><input type="checkbox" name="activa" defaultChecked={z.activa} className="h-4 w-4" /> {z.nombre}</label>
                  {z.temporal && <span className="rounded-full bg-warn-bg text-warn px-2 py-0.5 text-[10px] font-semibold">Solo temporada</span>}
                  <span className="text-xs text-muted">CP que empiezan con {z.codigosPostales.split(",").join(", ")}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <label className="flex flex-col gap-1"><span className="text-muted text-xs">Envío (MXN)</span><input type="number" name="costoEnvio" min={0} step={1} defaultValue={z.costoEnvio} className={input} /></label>
                  <label className="flex flex-col gap-1"><span className="text-muted text-xs">Gratis desde (botellas)</span><input type="number" name="botellasEnvioGratis" min={0} step={1} defaultValue={z.botellasEnvioGratis ?? ""} placeholder="nunca" className={input} /></label>
                </div>
                <label className="flex flex-col gap-1 max-w-md"><span className="text-muted text-xs">Nota interna</span><input name="nota" defaultValue={z.nota ?? ""} className={input} /></label>
              </div>
              <SubmitButton className="rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium whitespace-nowrap" pendingText="Guardando…">Guardar</SubmitButton>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Correo “Vendiste” con el PDF</h2>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${correoConfigurado() ? "bg-ok/10 text-ok" : "bg-warn-bg text-warn"}`}>{correoConfigurado() ? "Conectado" : "Sin conectar"}</span>
        </div>
        <p className="text-sm text-muted">Cada pedido nuevo llega por correo con el PDF del pedido adjunto. Un correo por renglón.</p>
        <form action={guardarDestinatariosCorreo} className="flex flex-col gap-3 text-sm">
          <textarea name="correos" rows={2} defaultValue={(config[CLAVES.correoDestinatarios] ?? "").split(",").filter(Boolean).join("\n")} placeholder={"isaac@ejemplo.com\nlogistica@ejemplo.com"} className={`${input} font-mono`} />
          <div><SubmitButton className={boton} pendingText="Guardando…">Guardar correos</SubmitButton></div>
        </form>
        {!correoConfigurado() && <p className="text-xs text-muted">Falta conectar Resend en Vercel (RESEND_API_KEY). Los pedidos se guardan igual.</p>}
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Aviso por WhatsApp</h2>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${whatsappConfigurado() ? "bg-ok/10 text-ok" : "bg-warn-bg text-warn"}`}>{whatsappConfigurado() ? "Conectado" : "Sin conectar"}</span>
        </div>
        <p className="text-sm text-muted">Cada pedido nuevo se avisa a estos teléfonos (el equipo de logística). Uno por renglón, a 10 dígitos. Si tú ya no quieres recibirlos, borra tu número de aquí.</p>
        <form action={guardarDestinatariosWhatsApp} className="flex flex-col gap-3 text-sm">
          <textarea name="telefonos" rows={3} defaultValue={(config[CLAVES.whatsappDestinatarios] ?? "").split(",").filter(Boolean).join("\n")} placeholder={"5512345678\n5598765432"} className={`${input} font-mono`} />
          <div><SubmitButton className={boton} pendingText="Guardando…">Guardar teléfonos</SubmitButton></div>
        </form>
        {!whatsappConfigurado() && <p className="text-xs text-muted">Falta conectar Twilio en Vercel (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN y TWILIO_WHATSAPP_FROM). Mientras, cada pedido trae el botón “Compartir al grupo de logística”.</p>}
      </section>
    </div>
  );
}
