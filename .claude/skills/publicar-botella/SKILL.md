---
name: publicar-botella
description: Úsalo cuando Isaac mande la foto o el nombre de un vino o de un destilado (whisky, arak, tequila…) para darlo de alta en su CRM de vinos y publicarlo en la página (Cava de vinos o Cava de destilados) con ficha, notas de cata, maridaje y fotos. También cuando mande las fotos de Gemini de una botella, o pida publicar el catálogo.
---

# Publicar una botella (vino o destilado): de la foto al CRM y a la página

Isaac manda **una foto** (y a veces solo el nombre). Todo lo demás lo hace
Claude con este skill. Su parte es solo: **foto, precio y un "va"**. Nunca
terminar en "vista previa" ni dejarle pasos a medias (dar de alta, publicar):
así se atoró el Macallan 15 el 27-oct. No decir "listo" hasta ver la botella
en la página real (paso 7). Hablarle en español mexicano, simple, sin jerga. Él no
programa: no pedirle nada técnico que se pueda resolver aquí.

**Una botella está lista solo cuando existe en el CRM y sale en la página
real.** Lección del 27-oct: el Macallan 18 sí apareció porque ya existía como
producto en el CRM y el catálogo se publicó después; el Macallan 15 solo tenía
ficha y fotos en el código, y una ficha sin producto no sale en ningún lado
(la página lista lo que está en `CatalogoPublicado`; la ficha solo la viste).

## Flujo desde el celular (lo normal)

1. Isaac abre una **sesión nueva** en el entorno **VINOS** desde claude.ai/code
   en el celular (flechita junto al título → entorno). Nueva, porque las
   sesiones ya abiertas no toman secretos de red nuevos.
2. Manda la foto de la botella y escribe algo como "Publica esta botella,
   precio $X" (o sin precio).
3. El skill detecta si es vino o destilado (etiqueta: uva/añada → vino;
   whisky, arak, tequila, años de añejamiento → destilado), arma la ficha y
   las fotos, le enseña capturas en celular y computadora y pregunta el precio
   si no lo dio.
4. Con un solo "va" se publica todo: código a las dos ramas, alta en el CRM,
   publicar catálogo y verificar en la página real. Se le manda el link directo.

## Lo que Isaac ya decidió (no volver a preguntar)

- **Publicar el catálogo = todo lo activo del CRM**, siempre (26-oct-2026).
- **Sin precio está bien**: si no lo da, se da de alta sin precio
  ("Precio por confirmar" en la página). Preguntarlo una vez, no insistir.
- **CRM: leer, sí; crear o publicar, solo con su "va".** Un "súbelo", "hazlo",
  "va" o "ponle" cuenta como va para esa botella.
- Al terminar: empujar el mismo commit a `catalog-redesign` (página pública)
  y `claude/wine-crm-setup-13v2ux` (CRM), ambos fast-forward (CLAUDE.md).
- Fotos de botella sobre crema: las hace el servidor solo; no usar CSS.

## Pasos

### 0. Revisar entorno y accesos al empezar (1 minuto, antes de trabajar)

**a) ¿Estamos en el entorno VINOS?** Isaac tiene dos entornos de nube en la
misma cuenta: **VINOS** (`env_01KseztzZ8dm6rMpBeacVHUt`, con los secretos y
dominios de este proyecto) y **Daymart** (`env_01Vo6F7TVLa8r2UtegSFbFSr`, su
otro negocio, sin nada de vinos). Si la sesión abrió en Daymart, Supabase y
`vinos-catalogo.vercel.app` responden "CONNECT ... 403" y no hay nada que hacer
desde ahí. Revisar con la herramienta `get_session` (sin `session_id`; el
`environment_id` debe ser el de VINOS) o con:
```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://lwekyvwfrmgzmavwveji.supabase.co/rest/v1/
# 000 + "CONNECT tunnel failed, response 403" = entorno equivocado (Daymart)
# 401 = entorno VINOS pero sin la llave (ver b)
# 200 = todo bien
```
Si no es VINOS: **parar** y decirle a Isaac, en una línea, que abra una sesión
nueva escogiendo el entorno VINOS (flechita junto al título → entorno) y
repita su mensaje. No intentar el resto del trabajo desde Daymart.

**b) ¿Sirve la llave de Supabase?** Antes de cualquier trabajo:
```bash
python3 -I .claude/skills/publicar-botella/crm.py buscar macallan     # CRM: debe listar MAC-12DC, MAC-15DC, MAC-18DC
curl -sS -o /dev/null -w "%{http_code}\n" https://vinos-catalogo.vercel.app/catalogo-publico/destilados   # 200
curl -sS "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1" | head -c 80                 # Gemini
```
Un **401 "No API key found"** significa que al entorno VINOS le falta el
secreto de red de Supabase (o la llave ya se borró/rotó en Supabase). Las
sesiones **ya abiertas no toman secretos nuevos**: después de agregarlo hay
que abrir una sesión nueva. En ese caso parar, decirle a Isaac cómo arreglarlo
(ver "Accesos") y no insistir; se puede avanzar ficha y fotos mientras, pero
dejar claro que la botella **no está lista** hasta darla de alta y publicar.
Si lo que falla es Gemini o la página, avisar al inicio y seguir con lo que no
dependa de eso.

### 1. Identificar la botella
- Leer en la foto: nombre, añada o edad, edición (p. ej. "2025 Release"),
  % de alcohol, ml, colección. Si hay variantes que se confunden (Macallan 18
  Sherry Oak vs Double Cask), preguntar cuál es **antes** de investigar.
- `python3 -I .claude/skills/publicar-botella/crm.py buscar <nombre>`: ¿ya existe en el CRM? Si existe,
  no duplicar: usar ese producto (y su ID).

### 2. Datos (cero inventos)
- Fuente 1: la **etiqueta de la foto** de Isaac; manda sobre la web si no
  coinciden. Fuente 2: la **página oficial** del productor; si no abre
  desde aquí (pasa seguido), tiendas serias que copian sus notas (The Whisky
  Exchange, etc.). Anotar las URLs en el comentario del archivo `_lib/<slug>.ts`
  y dárselas a Isaac al final con links.
- **Destilados**: notas de cata **nariz / boca / final** (las oficiales, con
  "Notas de la destilería" o de quién son); **cómo servirlo**; **maridaje de
  bocados y momentos**, no de platos fuertes (jerez → chocolate, higos,
  naranja; turbado → ahumados, quesos azules; bourbon → caramelo, nuez pecana;
  18+ años → solo, sin hielo, con puro). Maridaje y servicio se marcan como
  **sugerencia editorial**.
- **Vinos**: seguir `CATALOG-WINES.md` (protocolo) y `CATALOG-DESIGN.md`.
  Datos verificables de la etiqueta y contraetiqueta: uva, crianza, región,
  alcohol, servicio, kosher/mevushal **solo si se lee**. Maridaje con un
  plato principal, marcado como sugerencia editorial.

### 3. Ficha (código)
- `src/app/catalogo-publico/_lib/<slug>.ts` con un `EditorialWine`. Copiar
  el formato de un ejemplo:
  - destilado: `_lib/macallan-18-double-cask.ts` (`kind: "DESTILADO"`, sin
    `year`, con `tasting` y `serve`);
  - vino: `_lib/titora-reserve-2023.ts` (`year` = añada; debe coincidir con
    el `anio` del producto en el CRM o la ficha no se conecta).
- Página de vista previa: `seleccion/<slug>/page.tsx` (copiar la del Macallan).
- Conectar la ficha al producto: agregar su **ID del CRM** al mapa `profiles`
  de `_lib/wine-profiles.ts` (vinos y destilados). Los destilados también se
  pueden conectar por nombre en `_lib/spirit-profiles.ts` (así están los
  Macallan); por ID es lo más seguro cuando ya se conoce.
- `npx tsc --noEmit -p .` debe pasar.

### 4. Fotos
Todas en `public/catalogo/<slug>-<vista>.webp`, 960×1200.

| Vista | Qué es | De dónde |
|---|---|---|
| `front` | botella sobre blanco | recorte de la foto de Isaac |
| `box` | estuche (destilados) | recorte de la foto de Isaac |
| `back` | contraetiqueta | foto de SU botella (la de México trae etiqueta en español); nunca IA |
| `glass`, `pairing` | destilados: vaso y maridaje | IA (Gemini) |
| `service`, `glass`, `pairing`, `table` | vinos: servicio, copa, maridaje, mesa | IA (Gemini) |

- Orden en `photos`: destilados `front, box, back, glass, pairing`; vinos
  `front, back, service, glass, pairing, table` (la galería de vino abre con
  `table` sola; la de destilado abre sola con `pairing`, luego `glass` y al
  final las de botella/estuche — Isaac quiere que la primera foto sea la
  ambientada). `front` va primero en la lista porque es la foto de la tarjeta.
- **Recortar la botella**:
  `python3 -I .claude/skills/publicar-botella/recortar_botella.py foto salida.webp [desde_x] [espejo_px]`
  `desde_x` = columna desde la que solo hay botella (deja fuera el estuche);
  `espejo_px` si el estuche se ve a través del vidrio en la orilla izquierda.
  Si la foto trae marco gris o un numerito de tienda, recortarlo/borrarlo antes.
- **Recortar el estuche**:
  `python3 -I .claude/skills/publicar-botella/recortar_estuche.py foto salida.webp xl xr espejo_desde desde_botella`
  Medir las columnas dibujando una cuadrícula sobre la foto y viéndola con Read.
  Ejemplos con sus números reales en `CATALOG-SPIRITS.md`.
- **Revisar cada imagen con Read y con zoom en las orillas** (que no se cuele
  estuche, marcos ni rayitas). Isaac nota todo.
  Para el zoom usar `resize(..., Image.LANCZOS)`: con NEAREST aparecen
  costuras que no existen.
- **Estuche tapado por la botella**: no reflejar zonas con texto (salen letras
  al revés). Reconstruir la franja con el mismo patrón del estuche desplazado
  una repetición (medir el periodo comparando columnas) y la orilla de la
  etiqueta copiándola de más arriba. Ejemplo: Macallan 15 en `CATALOG-SPIRITS.md`.
- **Fotos de IA, descartar** si: etiqueta de otra edición o diseño viejo,
  dos botellas, color del líquido distinto, botella chueca o letras raras. Si
  la ficha dice "sin hielo", la foto va sin hielo. Conviene sacar 2–3
  opciones en paralelo y escoger.
- **Fotos con IA automáticas (camino principal desde el 26-oct-2026)**: la
  llave de Google está como secreto de red e Isaac activó la facturación.
  `GEMINI_IMAGE_MODEL=gemini-3-pro-image MARIDAJE="…" COLOR="…" python3 -I .claude/skills/publicar-botella/generar_fotos.py <slug> public/catalogo/<slug>-front.webp "<descripción de la botella>" glass pairing`
  (`TIPO=VINO` y vistas `service glass pairing table` para vino). Variar las
  escenas entre botellas (ver `prompts-gemini.md`). Con la botella nítida la
  letra chica de la etiqueta sale deformada: pedir la botella un poco
  desenfocada en segundo plano y revisar con zoom; regenerar la vista que
  salga mal. Error 429 ("limit: 0") = se acabó el saldo o la facturación:
  avisarle a Isaac.
- **Plan B (sin API)**: mandarle a Isaac la foto frontal como JPG
  (SendUserFile) y las instrucciones listas para pegar en gemini.google.com,
  armadas con `prompts-gemini.md`. Él regresa las fotos; revisarlas y
  pasarlas a 960×1200 con `fit()` de `generar_fotos.py`:
  `python3 -c "import importlib.util as u; s=u.spec_from_file_location('g','.claude/skills/publicar-botella/generar_fotos.py'); g=u.module_from_spec(s); s.loader.exec_module(g); from PIL import Image; g.fit(Image.open('ENTRADA')).save('public/catalogo/<slug>-<vista>.webp','WEBP',quality=88)"`

### 5. Revisar y enseñar
- `npm run dev` y capturas con Playwright de la vista previa, **en celular y
  en computadora**, recorriendo la galería. (Playwright: instalar
  `playwright@1.56.1` en el scratchpad; el Chromium de `/opt/pw-browsers` es
  el 1194.) Mandárselas a Isaac.

### 6. Alta en el CRM y publicar (con su "va")
- Producto (JSON para `crm.py crear`):
  `{"nombre", "sku", "piezasPorCaja", "tipo": "VINO"|"DESTILADO", "categoria"
  (Tinto, Blanco, Reserva… / Whisky, Arak…), "anio" (vinos), "region",
  "alcohol", "varietal", "fotoUrl": "/catalogo/<slug>-front.webp",
  "precioLista" (si lo dio)}`. SKU con el estilo de los existentes
  (`MAC-12DC`, `DAD-CS`). Piezas por caja: 6 para destilados y vinos de
  reserva salvo que diga otra cosa.
- `python3 -I .claude/skills/publicar-botella/crm.py crear producto.json` → anotar el ID → conectarlo en
  `wine-profiles.ts` (paso 3).
- `python3 -I .claude/skills/publicar-botella/crm.py publicar --ver` (decirle qué cambia) → `.claude/skills/publicar-botella/crm.py publicar`.
- Commit y push a la rama de trabajo y a las dos ramas publicadas (si alguna
  avanzó, `git merge` de ella primero, `tsc`, y luego push).
- Actualizar `CATALOG-SPIRITS.md` (destilados) o `CATALOG-WINES.md` (vinos).
- Pedir **un solo "va"** que cubra todo: subir la página, alta/cambios en
  el CRM y publicar. En el mismo mensaje de las capturas, preguntar el precio.

### 7. Verificar en la página real (antes de decir "listo")
Si hubo cambios de código, esperar el despliegue de Vercel (1–3 min); si solo
fue alta + publicar, la página lee los datos en vivo (si no sale, esperar 1–2
min por caché y reintentar). Revisar con `curl`:
- el nombre aparece en `https://vinos-catalogo.vercel.app/catalogo-publico/destilados`
  (o `/catalogo` para vinos);
- `/catalogo-publico/<id>` responde 200 y trae las fotos de la ficha
  (`grep -o "/catalogo/<slug>-[a-z]*.webp"`).
Solo entonces decirle que quedó, con el link directo.

### Si "no aparece"
Revisarlo uno mismo con `crm.py` antes de pedirle algo a Isaac, en orden:
¿existe el producto? ¿`tipo` correcto (si quedó VINO sale en vinos)?
¿`activo`? ¿la última publicación lo incluye (se publicó **después** del
alta)? ¿la ficha está conectada (ID en `wine-profiles.ts` o regla de nombre en
`spirit-profiles.ts`)? ¿ya terminó el despliegue?

## Accesos (lo que puede fallar y cómo se ve)

- **Supabase (CRM)**: `crm.py` necesita el secreto de red del entorno para
  `lwekyvwfrmgzmavwveji.supabase.co`, encabezado `apikey`, sin prefijo, valor
  la llave `sb_secret_…` "claude". Si dice "Sin conexión a Supabase" con
  "CONNECT ... 403", la sesión está en el entorno equivocado (Daymart): sesión
  nueva en VINOS. Si conecta pero responde 401 "No API key", al entorno VINOS
  le falta el secreto (o la llave se borró en Supabase). Cómo lo arregla
  Isaac, clic por clic: (1) en supabase.com, proyecto de vinos → Project
  Settings → API Keys → crear una **Secret key** llamada "claude" y copiarla;
  (2) en claude.ai/code (en iPhone, por Safari) → flechita junto al título →
  Editar entorno de nube **VINOS** → Secretos de red → dominio
  `lwekyvwfrmgzmavwveji.supabase.co`, encabezado `apikey`, sin prefijo, pegar
  la llave; (3) abrir una **sesión nueva** en VINOS. Nunca pedirle que pegue la
  llave en el chat (si la pega, usarla solo en el comando con
  `SUPABASE_SECRET_KEY=…`, nunca guardarla en archivos, y pedirle que la rote).
- **Google (fotos automáticas)**: secreto de red para
  `generativelanguage.googleapis.com`, encabezado `x-goog-api-key`, sin
  prefijo. Funciona desde el 26-oct-2026 (con facturación activa). Errores:
  "unregistered callers" = no llegó ninguna llave (el secreto no está o el
  chat no lo tomó: probar en un chat nuevo); "API key not valid" = llave mal
  copiada; 429 "limit: 0" = sin saldo o sin facturación. Si falla, no
  insistir: plan B con gemini.google.com.
- **Sin acceso desde aquí**: vercel.app (la página publicada), Postgres
  directo, y casi todas las páginas de productores (usar WebSearch).

## Pendientes conocidos (27-oct-2026)
- **Secreto de Supabase: ya funciona** (27-oct, cuarta sesión: paso 0 da 200
  y `crm.py` crea y publica). Si algún día vuelve a dar 401 "No API key
  found" con `X-Proxy-Error: upstream auth failed`, es que el secreto de red
  quedó con el encabezado equivocado: debe decir exactamente `apikey` (no
  Authorization), sin prefijo, host `lwekyvwfrmgzmavwveji.supabase.co`, en el
  entorno **VINOS**; luego sesión nueva. Diagnóstico rápido: mandar
  `apikey: dummy` cambia el error a "Invalid API key" → el proxy no inyecta.
- Los cinco Macallan (12, 15, 18, 25 y 30) y el Glenmorangie Lasanta 12 ya
  están en el CRM, publicados y conectados por ID en `wine-profiles.ts` (IDs
  en `CATALOG-SPIRITS.md`).
- Macallan 12, 15, 18, 25 y 30 y Lasanta 12: falta la foto de la etiqueta
  trasera y el precio (Isaac: "luego lo ponemos"). Del Lasanta conviene una
  foto más grande (la que mandó era de 480 px).
- Fotos chicas (menos de ~900 px): escalar con LANCZOS a ~1200 px antes de
  recortar; queda un poco suave pero sirve. Avisarle a Isaac y pedir una
  más grande sin detener la publicación.
- Playwright en este entorno (27-oct): el Chromium preinstalado es el 1243 y
  `playwright@1.56.1` busca el 1194; lanzar con
  `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`.
