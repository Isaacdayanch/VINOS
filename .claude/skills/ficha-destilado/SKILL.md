---
name: ficha-destilado
description: Detalle técnico de la ficha y las fotos de un destilado (archivos, recortes, fotos con IA). El proceso completo, de la foto a publicado, está en el skill publicar-botella; empezar por ese.
---

# Ficha de destilado para la Cava de destilados

> Proceso completo (alta en el CRM, publicar catálogo y verificar): `.claude/skills/publicar-botella/SKILL.md`.
> Este archivo solo detalla la ficha y las fotos.

Isaac manda **una botella a la vez**: nombre exacto + foto (frente/estuche) y,
si ya existe, el link del producto en el CRM. Hablarle en español mexicano,
simple. Mostrarle capturas y esperar su "va" antes de publicar.

## 1. Datos (cero inventos)

- Buscar en la web, primero la **página oficial** de la destilería; luego
  tiendas serias (The Whisky Exchange, etc.). Anotar las URLs en el comentario
  del archivo `_lib/<slug>.ts`.
- De la **foto de Isaac** sacar lo que diga la etiqueta: edad, % alcohol,
  contenido (ml), "natural colour", colección. Si la etiqueta y la web no
  coinciden (p. ej. 40% vs 43%), manda la etiqueta de su botella.
- Notas de cata **nariz / boca / final** = las oficiales, traducidas, con
  "Notas de la destilería." Si no hay oficiales, decir de quién son.
- Maridaje y "cómo servirlo" son **sugerencia editorial** y así se dice.
  En whisky se maridan bocados y momentos, no platos fuertes: chocolate,
  frutos secos, quesos maduros/azules, ahumados, postres, sobremesa, puro.
  Ajustar al estilo: jerez → chocolate, higos, naranja; turbado (Islay) →
  ahumados, quesos azules, salmón ahumado; bourbon → caramelo, BBQ, nuez
  pecana; tequila/mezcal/arak → lo propio de cada uno.

## 2. Archivos

- `src/app/catalogo-publico/_lib/<slug>.ts`: objeto `EditorialWine` con
  `kind: "DESTILADO"`, sin `year` (salvo destilados con añada), `tasting`,
  `serve`, `pairing`, `wineryStory` (la destilería) y `facts`:
  Destilería, Origen, Estilo, Edad, Barricas, Color, Colección, Alcohol,
  Contenido (y Kosher solo si lo dice la etiqueta). Ejemplo completo:
  `_lib/macallan-12-double-cask.ts`.
- Conectar la ficha al producto del CRM **por nombre** en
  `_lib/spirit-profiles.ts` (una regla `match` por botella, excluyendo
  ediciones hermanas, p. ej. Macallan 12 Sherry Oak). Así, en cuanto Isaac
  publica el producto como `DESTILADO`, su página `/catalogo-publico/<id>` usa
  la ficha con su precio, y la tarjeta de la Cava usa la foto frontal si el
  producto no tiene foto propia. No hace falta pedirle el ID (desde el sandbox
  no hay acceso a la base de datos ni a vercel.app).
- Además, página de vista previa en `seleccion/<slug>/page.tsx` (copiar la
  del Macallan) para enseñársela antes de que exista en el CRM.

## 3. Fotos (5 o 6, en `public/catalogo/<slug>-<vista>.webp`, 960×1200)

Isaac pidió menos que en vinos pero más que una sola. En destilados la galería
respeta el orden del arreglo `photos` y acepta cualquier cantidad. Orden:
`front`, `box` (estuche), `back` (etiqueta trasera), `glass` o `service`,
`pairing` y, opcional, `table`. Los nombres `front/box/back` se muestran como
botella sobre blanco; los demás como foto de ambiente.

1. **front**: recortar la botella de la foto de Isaac con
   `python3 -I .claude/skills/ficha-destilado/recortar_botella.py foto salida.webp [desde_x]`
   (fondo blanco; `desde_x` para dejar fuera el estuche; `espejo_px` si el
   estuche se ve a través del vidrio en la orilla izquierda). Revisar con Read
   que no se cuele nada en los bordes.
   Estuche: `recortar_estuche.py foto salida.webp xl xr espejo_desde desde_botella`
   (medir columnas con una cuadrícula; ver ejemplo del Macallan 18 en
   CATALOG-SPIRITS.md). Si la foto trae un marco gris, recortarlo antes.
2. **box / back**: de fotos **reales** (de Isaac, de preferencia de su
   botella, porque la importada a México trae contraetiqueta en español con
   importador y NOM). Si la foto trae marcas de tienda (números, sellos),
   borrarlas y revisar con zoom. Nunca generar etiquetas con IA.
3. **glass / service / pairing / table**: generar con IA:
   `MARIDAJE="..." COLOR="..." python3 -I .claude/skills/ficha-destilado/generar_fotos.py <slug> public/catalogo/<slug>-front.webp "<descripción de la botella>" glass pairing`
   Requiere la llave de Google en el entorno: como variable `GEMINI_API_KEY`
   o como "secreto de red" del dominio `generativelanguage.googleapis.com`
   (encabezado `x-goog-api-key`); nunca pedirla en el chat. Si falta, decirle
   y publicar con las fotos reales.
   **Desde el 26-oct-2026 ya funciona**: llave como secreto de red y Isaac
   activó facturación en Google. Usar `GEMINI_IMAGE_MODEL=gemini-3-pro-image`
   (el que salió mejor con el Macallan 18). Con la botella nítida, la letra
   chica de la etiqueta sale deformada: pedir la botella un poco desenfocada
   en segundo plano y revisar con zoom. Si un día vuelve el error 429
   ("limit: 0"), se acabó el saldo o la facturación: avisarle a Isaac.
   **Plan B** (sin API): Isaac genera las fotos gratis en
   gemini.google.com: mandarle la foto frontal en JPG y un prompt por vista
   (botella idéntica a la referencia, vertical 4:5, sin texto añadido, paleta
   crema/carbón/borgoña). Él regresa las imágenes; revisarlas, pasarlas a
   960×1200 WebP con `fit()` de `generar_fotos.py` y guardarlas con el nombre
   de la vista.
   Revisar **cada** imagen con Read: botella idéntica (forma, etiqueta, color
   del líquido), recta, sin texto raro. Si sale mal, regenerar esa vista.
   Nunca sacar datos de una imagen generada.

## 4. Revisar y publicar

- `npx tsc --noEmit` y capturas con Playwright (escritorio y celular) de la
  ficha; mandárselas a Isaac y esperar su "va".
- Commit en la rama de trabajo. Con permiso de Isaac, empujar el mismo commit
  a `catalog-redesign` (página pública) y `claude/wine-crm-setup-13v2ux`
  (CRM), ambos fast-forward (regla de CLAUDE.md).
- Actualizar la tabla de `CATALOG-SPIRITS.md`.
