# Registro de vinos y protocolo editorial

Este archivo es el seguimiento compartido entre Isaac, Codex y Claude Code.
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

## Organización técnica

- Repositorio: `Isaacdayanch/VINOS`, rama `catalog-redesign`; proyecto Vercel existente `daymart/vinos`; Preview pública `https://vinos-catalogo.vercel.app/`.
- Código público: `src/app/catalogo-publico/`. Datos editoriales: `_lib/`. Galería común: `_components/EditorialWinePage.tsx` y `Gallery.tsx`. Imágenes: `public/catalogo/`.
- Dirección visual y decisiones: `CATALOG-DESIGN.md`. Este registro es interno y no aparece en la tienda.
- Inicio: las cinco botellas Dādāh editoriales existentes ordenadas por precio publicado descendente; Grand Rivallon inmediatamente después; luego el resto. 2018 no reutiliza imágenes del 2017.
- Activar/publicar un producto en el CRM y crear su galería editorial son procesos distintos: actualmente NO existe generación automática de seis imágenes al activar un vino. No prometer esa automatización.
