# Registro de vinos y protocolo editorial

Este archivo es el seguimiento compartido entre Isaac, Codex y Claude Code.
Proceso completo de la foto al CRM y a la página (también destilados): `.claude/skills/publicar-botella/SKILL.md`.
No considerar un vino terminado hasta abrir su URL en Preview, comprobar sus imágenes y entregar el enlace a Isaac.

## Encargo estándar por vino

Isaac envía una sola vez: nombre/añada o enlace del producto del CRM, foto frontal, contraetiqueta legible y, si existe, estuche. No volver a pedir material que ya está en el repositorio. Preguntar únicamente por un dato o imagen realmente ausente.

Cada encargo incluye:
1. Vincular el ID exacto del producto publicado y distinguir añadas. Precios y disponibilidad vienen del catálogo existente; no inventarlos ni escribir al CRM.
2. Extraer datos verificables de las etiquetas; separar sugerencias de maridaje de afirmaciones del productor. No inventar certificaciones ni crianza.
3. Seis imágenes: frontal y reverso sobre blanco, servicio, copa, maridaje y escena editorial. Diferenciar escenas entre vinos; botella recta, etiqueta alineada, color del vino y luz coherentes. Conservar originales para consultar letras/sellos.
4. Una ficha completa, enlazada desde inicio y catálogo al mismo producto cuando tenga ID confirmado. Galería navegable, datos, descripción, maridaje, bodega/origen y aviso de pedidos próximamente.
5. Revisar etiqueta, silueta, luz, seis imágenes, navegación, precio publicado y posición. Desplegar solo la rama pública `catalog-redesign`; verificar la página real antes de comunicar terminado.
6. Actualizar esta tabla con estado concreto, falta pendiente y enlace. Un archivo local o una imagen generada NO equivalen a una ficha publicada.

## Estado y ubicación

| Vino | Estado editorial | Pendiente conocido | Ruta pública |
|---|---|---|---|
| Dādāh Special Reserve 2017 | Ficha y seis imágenes existentes; frontal con luz suavizada publicado en `ed5779a` | Revisión visual continua de Isaac | `/catalogo-publico/seleccion/reserve-2017` |
| Dādāh Cabernet Sauvignon Reserve 2019 | Ficha y seis imágenes existentes | Revisión visual continua de Isaac | `/catalogo-publico/seleccion/dadah-cabernet-reserve-2019` |
| Château Grand Rivallon 2012 | Seis imágenes y ficha completas; integración en este cambio | Verificar deployment y abrir enlace antes de marcar terminado | `/catalogo-publico/cmtugbmde0002ih049z900g5i` |
| Dādāh Special Reserve 2018 | Producto publicado; no incluido todavía en selección editorial | Fotos propias de esta añada y ficha editorial | ID `cmtssyq3t0002l404jdevszsb` |
| Dādāh Petit Verdot Syrah Reserve 2019 | Botella en inicio | Completar ficha editorial y seis imágenes; confirmar añada en CRM | ID `cmtssyq420003l4047ct1g5wa` |
| Dādāh Cabernet Sauvignon 2023 | Botella en inicio | Completar ficha editorial y seis imágenes | ID `cmtssyq350000l404mdg2nzou` |
| Dādāh Malbec Barbera 2023 | Botella en inicio | Completar ficha editorial y seis imágenes | ID `cmtssyq3k0001l404n0341dmg` |
| Titora Réserve Spéciale 2021 | Botella y datos de etiqueta en inicio | Vincular ID exacto y completar galería/ficha | `#descubre-titora-special-2021` |
| Givat Titora Grande Réserve 2021 | Botella y datos de etiqueta en inicio | Vincular ID exacto y completar galería/ficha | `#descubre-titora-grand-2021` |
| Tanya Enosh 2018, Petit Verdot 2021 y cosecha tardía 2024 | Botellas en inicio | Vincular IDs exactos y completar fichas/galerías | Ver `_lib/showcase.ts` |
| Dalton Matatia 2018 | Ficha completa y siete imágenes (frente, contraetiqueta, servicio, copa, maridaje, mesa y estuche), preparadas el 27-oct-2026 con la API de Gemini (`gemini-3-pro-image`): frente y estuche extraídos de la foto de Isaac (botella + estuche); contraetiqueta (28-oct, tercera versión) = render de ChatGPT de Isaac con Gemini corrigiendo solo 14.5 %, 'KOSHER LE MEHADRIN' y 'MONSEY, NY' (`corregir_texto_etiqueta.py`) y el código de barras real 0033115003246 dibujado (`ean13.py`); maridaje de res sin lácteos y mesa sin queso ni carne (regla kosher). Originales guardados como `dalton-matatia-2018-front-original.jpeg` y `-label-original.jpeg` | Uvas de la mezcla (no vienen en la etiqueta; Isaac puede capturarlas en `varietal`) | `/catalogo-publico/c6ae15c92857c780dc7be2157` (en el CRM desde el 28-oct, SKU DAL-MAT18, venta 3,000 / distribuidor 2,800, publicado; conectado por ID en `wine-profiles.ts`). Vista previa: `/catalogo-publico/seleccion/dalton-matatia-2018` |
| Dalton Asufa Levantina 2021 | Ficha completa y seis imágenes (28-oct-2026): frente y contraetiqueta = renders de ChatGPT de Isaac (originales `*-chatgpt-original.jpeg`); en la contraetiqueta Gemini corrigió el texto kosher que ChatGPT cambió (`labelfix.py`, 'KOSHER LE MEHADRIN'), y el código de barras se dibujó con el EAN-13 real 7290016607543 (`ean13.py`); queda un detalle de pixel en el apóstrofo de SHVI'IT, invisible al tamaño de la galería. Escenas: azotea en Jaffa, higos sobre mosaico, kofta de cordero con berenjena/tahini/granada (sin lácteos) y mezze bajo la parra (sin queso ni carne). Uvas agregadas a `GRAPES`: Petite Sirah, Grenache, Carignan | Precio de venta y distribuidor (Isaac los da después) | `/catalogo-publico/c6ae16b6db4b3aa725552c266` (en el CRM desde el 28-oct, SKU DAL-LEV21, sin precio, publicado; conectado por ID en `wine-profiles.ts`). Vista previa: `/catalogo-publico/seleccion/dalton-levantina-2021` |
| Dalton Family Collection Cabernet Sauvignon 2023 | Ficha completa y seis imágenes (28-oct-2026): frente y contraetiqueta = renders de ChatGPT de Isaac; Gemini corrigió 'NOT MEVUSIAL' → 'NON-MEVUSHAL' y el texto kosher (`corregir_texto_etiqueta.py`). **Código de barras sin verificar** (no hay foto real de la contraetiqueta; el del render es 7290016810062, plausible pero no confirmado). Escenas de bosque de la Alta Galilea: mirador, chimenea, brisket (sin lácteos) y cena de otoño (sin queso ni carne) | Foto real de la contraetiqueta para verificar código de barras y letra chica; precio de venta; dar de alta en el CRM (VINO, Tinto, 2023, varietal Cabernet Sauvignon) y publicar | Vista previa: `/catalogo-publico/seleccion/dalton-fc-cabernet-2023` |

## Organización técnica

- Repositorio: `Isaacdayanch/VINOS`, rama `catalog-redesign`; proyecto Vercel existente `daymart/vinos`; Preview pública `https://vinos-catalogo.vercel.app/`.
- Código público: `src/app/catalogo-publico/`. Datos editoriales: `_lib/`. Galería común: `_components/EditorialWinePage.tsx` y `Gallery.tsx`. Imágenes: `public/catalogo/`.
- Dirección visual y decisiones: `CATALOG-DESIGN.md`. Este registro es interno y no aparece en la tienda.
- Inicio: las cinco botellas Dādāh editoriales existentes ordenadas por precio publicado descendente; Grand Rivallon inmediatamente después; luego el resto. 2018 no reutiliza imágenes del 2017.
- Activar/publicar un producto en el CRM y crear su galería editorial son procesos distintos: actualmente NO existe generación automática de seis imágenes al activar un vino. No prometer esa automatización.
