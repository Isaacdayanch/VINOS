---
name: ficha-destilado
description: Úsalo cuando Isaac mande una botella de whisky u otro destilado (nombre, foto o link del CRM) para agregarla a la "Cava de destilados" del catálogo público con ficha, notas de cata, maridaje y fotos.
---

# Ficha de destilado para la Cava de destilados

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
- Si **no hay ID del CRM** todavía: página de vista previa en
  `seleccion/<slug>/page.tsx` (copiar la del Macallan).
- Si **ya hay ID**: agregarlo a `profiles` en `_lib/wine-profiles.ts`; así la
  ficha sale en `/catalogo-publico/<id>` con su precio publicado. El producto
  debe estar como `tipo = DESTILADO` y publicado en el catálogo (eso lo hace
  Isaac desde el CRM; no escribir a la base de datos).

## 3. Fotos (5 o 6, en `public/catalogo/<slug>-<vista>.webp`, 960×1200)

Isaac pidió menos que en vinos pero más que una sola. En destilados la galería
respeta el orden del arreglo `photos` y acepta cualquier cantidad. Orden:
`front`, `box` (estuche), `back` (etiqueta trasera), `glass` o `service`,
`pairing` y, opcional, `table`. Los nombres `front/box/back` se muestran como
botella sobre blanco; los demás como foto de ambiente.

1. **front**: recortar la botella de la foto de Isaac con
   `python3 -I .claude/skills/ficha-destilado/recortar_botella.py foto salida.webp [desde_x]`
   (fondo blanco; `desde_x` para dejar fuera el estuche). Revisar con Read
   que no se cuele nada en los bordes.
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
