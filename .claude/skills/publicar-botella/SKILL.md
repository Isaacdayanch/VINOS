---
name: publicar-botella
description: Úsalo cuando Isaac mande la foto o el nombre de un vino o de un destilado (whisky, arak, tequila…) para darlo de alta en su CRM de vinos y publicarlo en la página (Cava de vinos o Cava de destilados) con ficha, notas de cata, maridaje y fotos. También cuando mande las fotos de Gemini de una botella, o pida publicar el catálogo.
---

# Publicar una botella (vino o destilado): de la foto al CRM y a la página

Isaac manda **una foto** (y a veces solo el nombre). Todo lo demás lo hace
Claude con este skill. Hablarle en español mexicano, simple, sin jerga. Él no
programa: no pedirle nada técnico que se pueda resolver aquí.

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
  `table` sola).
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
- Decirle a Isaac dónde verlo (`vinos-catalogo.vercel.app/catalogo-publico/<id>`)
  y pedirle que lo revise él: desde aquí no se puede abrir vercel.app.

## Accesos (lo que puede fallar y cómo se ve)

- **Supabase (CRM)**: `crm.py` necesita el secreto de red del entorno para
  `lwekyvwfrmgzmavwveji.supabase.co`, encabezado `apikey`, sin prefijo, valor
  la llave `sb_secret_…` "claude". Si dice "Sin conexión a Supabase", falta el
  secreto (o el host). Si conecta pero responde 401 "No API key", el secreto
  no está mandando la llave: pasarla solo en el comando con
  `SUPABASE_SECRET_KEY=…` si Isaac la dio en el chat, nunca guardarla en
  archivos. Guiarlo para arreglarlo en claude.ai/code → flechita junto al
  título → Editar entorno de nube → Secretos de red (en iPhone, por Safari).
- **Google (fotos automáticas)**: secreto de red para
  `generativelanguage.googleapis.com`, encabezado `x-goog-api-key`, sin
  prefijo. Funciona desde el 26-oct-2026 (con facturación activa). Errores:
  "unregistered callers" = no llegó ninguna llave (el secreto no está o el
  chat no lo tomó: probar en un chat nuevo); "API key not valid" = llave mal
  copiada; 429 "limit: 0" = sin saldo o sin facturación. Si falla, no
  insistir: plan B con gemini.google.com.
- **Sin acceso desde aquí**: vercel.app (la página publicada), Postgres
  directo, y casi todas las páginas de productores (usar WebSearch).

## Pendientes conocidos (26-oct-2026)
- La llave secreta de Supabase quedó escrita en el chat del 26-oct: Isaac debe crear otra,
  ponerla en el secreto y borrar esa.
- Macallan 12, 15 y 18: falta la foto de la etiqueta trasera y el precio.
- Macallan 15: falta darlo de alta en el CRM y publicar (ver `CATALOG-SPIRITS.md`).
