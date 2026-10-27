---
name: publicar-botella
description: Úsalo cuando Isaac mande la foto (o el nombre) de un vino o un destilado para que quede publicado en su página: Cava de vinos o Cava de destilados. Cubre todo, de la foto a la botella visible en vinos-catalogo.vercel.app: ficha, fotos, alta en el CRM, publicar catálogo y verificar.
---

# Publicar una botella (vino o destilado), de la foto a la página

Isaac solo hace tres cosas: **manda la foto, dice el precio y da un "va"**.
Todo lo demás lo hace Claude, incluido dar de alta el producto en el CRM y
publicar el catálogo. Nunca terminar en "vista previa" ni dejarle pasos a
medias (así se atoró el Macallan 15). No decir "listo" hasta ver la botella
en la página real.

Hablarle en español mexicano, simple. Una botella a la vez.

## 0. Antes de empezar: revisar el entorno (1 minuto)

```bash
B=https://lwekyvwfrmgzmavwveji.supabase.co/rest/v1
curl -sS "$B/Producto?select=id&limit=1"                         # debe dar [{"id":...}]
curl -sS -o /dev/null -w "%{http_code}\n" https://vinos-catalogo.vercel.app/catalogo-publico/destilados   # 200
curl -sS "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1" | head -c 80                 # sin error
```

- `No API key found` en Supabase → falta el **secreto de red** del entorno:
  host `lwekyvwfrmgzmavwveji.supabase.co`, encabezado `apikey`, valor = la
  llave secreta `sb_secret_…` "claude" (Supabase → Project Settings → API
  Keys). Guiar a Isaac clic por clic (menú del entorno en el título de la
  sesión → Edit → Network secrets); **nunca pedir la llave en el chat**. Solo
  la toma una sesión nueva.
- `CONNECT tunnel failed 403` → falta el dominio en Edit → Network access →
  Allowed domains (`lwekyvwfrmgzmavwveji.supabase.co`, `vinos-catalogo.vercel.app`).
- Gemini: secreto `x-goog-api-key` para `generativelanguage.googleapis.com`,
  con facturación activa (si da 429 "limit: 0", se acabó el saldo).

Si algo falla, avisar al inicio (no a la mitad) y seguir con lo que no dependa de eso.

## 1. Identificar la botella

- ¿**Vino** o **destilado**? Destilado → Cava de destilados
  (`/catalogo-publico/destilados`); vino → Cava de vinos (`/catalogo-publico/catalogo`).
- Buscar si ya existe en el CRM (leer siempre se puede):
  `curl -sS "$B/Producto?select=id,nombre,sku,tipo,categoria,activo,fotoUrl,precioLista,anio&nombre=ilike.*macallan*"`
  Distinguir añadas y ediciones hermanas (12 vs 15 vs 18, Sherry Oak vs Double Cask).

## 2. Datos (cero inventos)

- De la **foto**: edad/añada, % alcohol, ml, "natural colour", colección, kosher.
  Si la etiqueta y la web no coinciden, manda la etiqueta.
- De la **web**: página oficial primero; si no abre, tiendas serias (The Whisky
  Exchange, Royal Mile Whiskies…). Anotar URLs en el comentario del archivo.
- Notas de cata oficiales, traducidas, diciendo de dónde son. Maridaje y
  "cómo servirlo" = sugerencia editorial, y así se dice.

## 3. Ficha (código)

- **Destilado**: seguir `.claude/skills/ficha-destilado/SKILL.md` (archivo
  `_lib/<slug>.ts`, regla por nombre en `_lib/spirit-profiles.ts`, vista
  previa en `seleccion/<slug>/page.tsx`). Se conecta solo por nombre.
- **Vino**: seguir `CATALOG-WINES.md` (6 imágenes) y un ejemplo como
  `_lib/titora-reserve-2023.ts`. Los vinos se conectan **por ID** en
  `_lib/wine-profiles.ts` → hace falta el `id` del CRM (si no existe, se crea
  en el paso 6 y luego se agrega al mapa; o crearlo antes con el "va").
- Registrar en `CATALOG-SPIRITS.md` o `CATALOG-WINES.md`.

## 4. Fotos (`public/catalogo/<slug>-<vista>.webp`, 960×1200)

- **front** y **box**: recortar de la foto de Isaac con
  `ficha-destilado/recortar_botella.py` y `recortar_estuche.py`. Si la botella
  tapa parte del estuche, no reflejar texto: reconstruir la franja con el
  mismo patrón desplazado una repetición (medir el periodo; ver Macallan 15
  en `CATALOG-SPIRITS.md`). Revisar con zoom (LANCZOS, no NEAREST: NEAREST
  inventa costuras).
- **Ambiente con IA** (vaso, maridaje; en vinos también servicio, copa,
  escena): `GEMINI_IMAGE_MODEL=gemini-3-pro-image` con `generar_fotos.py`
  (se pueden cambiar escenas importando el módulo desde un script en el
  scratchpad). Hacer 2–3 opciones en paralelo y escoger.
  - Pedir la **botella en segundo plano, fuera de foco (85 mm f/1.4)**: si sale
    nítida, la letra chica sale deformada ("DOUSLE CASK", "WHRKY").
  - Descartar: etiqueta de otra edición/diseño viejo, dos botellas, color del
    líquido distinto, botella chueca, texto inventado.
  - Si la ficha dice "sin hielo", la foto va sin hielo.
- Nunca generar etiquetas con IA ni sacar datos de una imagen generada.

## 5. Enseñarle y pedir lo que falta (un solo mensaje)

- `npx tsc --noEmit` (en sesión nueva: `npm ci`, `npx prisma generate` con
  `POSTGRES_PRISMA_URL`/`POSTGRES_URL_NON_POOLING` de relleno, `npx next typegen`).
- `next dev` + Playwright: capturas de las 4–6 fotos de la galería en
  escritorio (1440×900) y celular (390×844); mandarlas con SendUserFile.
- En el mismo mensaje preguntar **precio de lista** (y si sabe: piezas por
  caja, proveedor) y pedir **un solo "va"** que cubre: subir la página, dar de
  alta / actualizar en el CRM y publicar el catálogo.

## 6. Con el "va": publicar todo

1. **Código**: commit en la rama de trabajo y push del mismo commit a
   `catalog-redesign` y `claude/wine-crm-setup-13v2ux` (fast-forward; si no
   lo es, fusionar primero).
2. **CRM** (escribir solo con el "va"):
   - No existe → `POST $B/Producto` con encabezados
     `Content-Type: application/json` y `Prefer: return=representation`:
     `{"id":"c<25 caracteres al azar>","nombre":…,"sku":…,"piezasPorCaja":6|12,
     "tipo":"DESTILADO"|"VINO","categoria":"Whisky"|"Tinto"…,"activo":true,
     "precioLista":…,"anio":null|año,"createdAt":"<ahora ISO>"}`.
     SKU como los existentes (p. ej. `MAC-15DC`); revisar que no exista.
     `fotoUrl` vacío: la tarjeta usa la foto de la ficha.
   - Existe → `PATCH $B/Producto?id=eq.<id>` solo lo que cambia (tipo,
     activo, precio). Decirle qué cambió.
3. **Publicar catálogo** (= `publicarCatalogo()`): leer TODOS los activos
   `GET $B/Producto?select=id,nombre,fotoUrl,tipo,categoria,anio,precioLista&activo=is.true&order=nombre.asc`
   y `POST $B/CatalogoPublicado` con
   `{"id":"c…","fechaPublicado":"<ahora ISO>","productos":[…]}`.
   Antes, comparar con la última publicación y decirle qué cambia (precios,
   altas, bajas). Isaac pidió incluir siempre todo lo activo.
4. **Verificar en la página real** (esperar el despliegue de Vercel, 1–3 min):
   - El nombre aparece en `/catalogo-publico/destilados` (o `/catalogo`):
     `curl -s https://vinos-catalogo.vercel.app/catalogo-publico/destilados | grep -o "<nombre>"`.
   - `/catalogo-publico/<id>` responde 200 y usa las fotos de la ficha
     (`grep -o "/catalogo/<slug>-[a-z]*.webp"`).
   - Solo entonces decirle "listo", con el link directo de la botella.

## Si "no aparece"

En orden: ¿existe en `Producto`? ¿`tipo` correcto (si quedó VINO sale en
vinos)? ¿`activo=true`? ¿la última `CatalogoPublicado` lo incluye (se publicó
después de darlo de alta)? ¿el nombre cumple la regla de `spirit-profiles.ts`
(destilados) o el ID está en `wine-profiles.ts` (vinos)? ¿ya terminó el
despliegue? Revisarlo uno mismo con la API antes de pedirle algo a Isaac.
