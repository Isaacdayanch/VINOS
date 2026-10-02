# Catálogo público — dirección y alcance

## Aprobado por Isaac, 30 de septiembre de 2026

Referencia principal: BRAND Napa Valley; experiencia editorial de gran escala,
fotografía cinematográfica, crema/borgoña/carbón, compra clara como objetivo.
Protagonista: Dādāh Special Reserve **2017**, etiqueta de colores (no 2018).
Frase exacta: «El vino que convierte al plato principal en acompañamiento.»
VINOS es un nombre provisional. No sustituye una marca definitiva.

## Límite de esta entrega

Solo `src/app/catalogo-publico/**`, assets en `public/catalogo/**` y este documento.
No cambios en CRM, estilos globales, middleware, dependencias, schema, migraciones,
inventario, precios administrativos ni credenciales. No ejecutar seed ni migraciones.
Rama `catalog-redesign`; revisión por Vercel Preview. No integrar a producción sin
aprobación expresa de Isaac. Antes de continuar, actualizar la rama con el trabajo
de Claude y revisar cambios concurrentes en las rutas públicas.

## Arquitectura

- Layout y tokens CSS locales: Cormorant Garamond / Manrope, crema `#f6f2eb`,
  carbón `#272521`, borgoña `#651b32`. CSS Modules evita contaminar el CRM.
- Header con dialog nativo: Escape, enfoque y retorno al control gestionados por navegador.
- Hero compuesto: fondo atmosférico ilustrativo + botella; assets WebP optimizados.
- Desplazamiento vertical nativo, parallax/leve inclinación limitada al hero visible.
  Sin scroll hijacking. Respeta cambios en `prefers-reduced-motion` en tiempo real.
- Recorrido editorial vertical con botellas individuales sobre blanco, scroll nativo
  y animación CSS ligada al scroll cuando el navegador la soporte. Sin dependencia
  de JS ni scroll interno. Fallback estático y reduced-motion. Atajo al catálogo.
- Catálogo con búsqueda, tipo, añada, presupuesto configurable en `Collection.tsx`,
  orden de precio/nombre y filtros mobile en dialog. No inferir país ni uva del nombre.
- Ficha con galería de fotos real, navegación táctil/teclado, contenido opcional,
  metadata OpenGraph y estados sin foto/no disponible/no publicado.
- La impresión conserva flujo de tarjetas inline-block para evitar cortes de página.

## Datos y regla de publicación

`_lib/catalog.ts` es exclusivo del servidor. Lee la última `CatalogoPublicado` y
valida su JSON, soportando publicaciones antiguas sin ID. Las fichas solo son
accesibles para IDs incluidos en la publicación; seleccionan exclusivamente campos
públicos de Producto. Descripciones y fotos de ficha siguen siendo actuales; precios
siempre los publicados, nunca precios privados o por cliente.
Un producto agotado sigue teniendo ficha con estado no disponible, evitando el 404
del catálogo congelado. No se modifica el campo `activo` ni su sincronización.
No se muestra una cantidad de stock sin una consulta pública específica.

## Fotografías

### Actualización 1 de octubre: selección vertical

Nueve packshots individuales preparados con la herramienta integrada de imágenes,
en `public/catalogo/*.webp`, 960×1200 (4:5), blanco y sombra suave. Prompt común:
extraer solo la botella indicada, eliminar mano/fondo/otras botellas, enderezar,
mantener identidad, etiqueta, añada, cera y cápsula, encuadre completo sobre blanco.
Los nueve sujetos y fuentes: Dādāh Reserve Cabernet/Petit Verdot Syrah 2019
(`IMG_0258(1)`); Cabernet/Malbec Barbera 2023 (`IMG_0257(1)`); Enosh 2018
(`1C73F035`); Tanya Petit Verdot 2021 (`31D6688D`); Tanya cosecha tardía 2024
(`IMG_0049`); Titora Special 2021 (`IMG_0071(1)`); Titora Grand 2021 (`IMG_0069`).
Las ediciones generativas pueden variar letras pequeñas y reflejos: requieren
comparación de etiqueta antes de producción. Nunca extraer datos del packshot generado.

`_lib/showcase.ts` contiene la selección editorial solicitada por Isaac y datos
legibles de sus etiquetas; no registra productos en el CRM ni presupone publicación,
stock o precio. El catálogo real y sus fichas mantienen la fuente de datos existente.
La selección editorial ahora tiene diez escenas; Grand Rivallon conserva su foto
original y su presencia depende del catálogo publicado, no de esta selección.

Titora: las fuentes son `IMG_0072` (Special) y `IMG_0070` (Grand), disponibles como
contraetiquetas WebP enlazadas desde «Conocer este vino». Special: 80% Cabernet,
10% Shiraz, 10% Petit Verdot, Galilea, 18 meses Allier. Grand: dos variedades,
Cabernet dominante, Alta Galilea, 24 meses en barricas francesas de primer/segundo
uso; segunda variedad y proporciones no legibles/no indicadas, no completar.
Ambas 2021, 750 ml, 14.3%, 18–22 °C y kosher para Pésaj según etiqueta.
No inferir mevushal ni nombres de certificadores a partir de sellos poco legibles.
Descripciones traducidas de etiquetas, sin maridajes inventados. Fotos de uso y
maridajes quedan para una etapa posterior. Ninguna escritura en CRM/Supabase.

Las cuatro fotos originales se conservan sin alterar las etiquetas. La imagen
recortada con IA del hero es una interpretación editorial y necesita validación
de detalles finos de etiqueta; las fotos originales del catálogo/ficha son fuente
de verdad. El fondo de terraza es una ambientación generada: no presentarlo como
fotografía real de Galilea, viñedo o bodega específica.
Hero panorámico en desktop con adaptación de composición móvil. Botella contain;
cards y galería 4:5. `next/image`, tamaños responsivos, prioridad solo sobre el pliegue.
Las fotos estáticas editoriales no publican por sí mismas productos o precios.

## Próximas etapas, fuera de esta entrega

- **Giro 360° real**: requiere serie de ángulos o modelo 3D aprobado. La inclinación
  de una foto no es un 360°. No inventar reverso, certificación ni etiqueta trasera.
- **IA de etiqueta y escenas**: planear un pipeline de trabajos asíncronos,
  extracción con procedencia/confianza y revisión humana; solicitar aprobación
  específica antes de intervenir la carga del CRM o añadir campos/tablas.
- **Compra**: no habilitar botones ficticios. Carrito/checkout aún no implementados.
  Requiere diseño aprobado, validación de precios en servidor, stock/reservas,
  transacciones/idempotencia, contacto/entrega/pago y aislamiento de datos de pruebas.
- **SEO Product**: añadir al existir ofertas comprables y disponibilidad verificable.
  No publicar ratings, kosher, mevushal o datos de terroir que no estén verificados.
- **Preview**: robots noindex con VERCEL_ENV=preview. No asumir que Preview separa
  Supabase; esta entrega no contiene escrituras. Verificar Vercel y variables existentes.

## Validación

Ejecutar ESLint del catálogo, typecheck y build del proyecto sin migraciones.
Revisar desktop y iPhone: hero/copy, imágenes, overflow, filtros, dialog Escape/enfoque,
galería, estados vacíos, links de publicaciones antiguas y modo reduced-motion.
Verificar que el diff final solo incluya el alcance autorizado. No usar datos ficticios
en el catálogo real ni publicar una ruta temporal de pruebas.

## Arquitectura pública: presentación y catálogo separados

- `/catalogo-publico`: hero y recorrido editorial vertical, sin consulta al catálogo ni cuadrícula comercial.
- `/catalogo-publico/catalogo`: catálogo con precios, búsqueda, filtros y fichas existentes. Conserva `getPublication` y los precios publicados; no añade escrituras, carrito ni checkout.
- `/catalogo-publico/nosotros`: presentación de la selección kosher de Israel y otros orígenes. No inventar trayectoria, razón social, equipo, domicilio, contacto, logística ni certificaciones. Completar esos detalles cuando Isaac los confirme.
- Menú y footer comparten las tres rutas. Todos los accesos comerciales del hero, recorrido y fichas llevan al catálogo independiente.
- La cuadrícula aparece directamente en el catálogo: el bloque anterior de descubrimiento no antecede la búsqueda. Inicio y nosotros pueden prerenderizarse; el catálogo permanece dinámico.
- No se modifica middleware, rutas administrativas, esquema, consultas existentes ni configuración de producción.

## Refinamiento de navegación

Rayitas del menú sin aro; conservar área táctil de 44 px. Enlaces y CTA sin flechas
unicode decorativas. Menú y enlaces editoriales usan pastillas discretas que cambian
a borgoña al tocar/hover, con foco visible y reduced-motion. «Siguiente botella»
reemplaza el icono para mantener una acción comprensible.

Galerías futuras: trabajar vino por vino a partir de frente y contraetiqueta originales.
Seis vistas propuestas: frente blanco, reverso blanco, sirviendo, copa con color,
maridaje recomendado y escena editorial. Validar datos antes de generar, distinguir
recomendación de maridaje de datos impresos y no representar ambientaciones como
bodegas reales. No reconstruir texto/sellos ilegibles. Integración exclusivamente
pública; no escribir imágenes ni datos en CRM sin autorización específica.

## Special Reserve 2017: primera galería de seis vistas

Ficha editorial `/catalogo-publico/seleccion/reserve-2017`, enlazada desde su escena
de inicio. Reutiliza Gallery con captions y fotos ambientales a sangre; las fichas
dinámicas y fotos del CRM conservan su comportamiento anterior. Fuente de datos
`_lib/reserve-2017.ts`: frente IMG_0415(1), contraetiqueta IMG_0414(1), historia
del estuche IMG_0409. No asociar automáticamente por nombres parecidos a un ID del CRM.

Frente blanco existente más cinco imágenes nuevas: reverso, sirviendo, copa,
maridaje y mesa. Herramienta integrada, referencias originales, estética piedra/lino
crema/luz mediterránea, botella 2017 y diseño original. WebP 960×1200, quality85;
cada imagen nueva pesa 52–154 KB. Contraetiqueta original enlazada para lectura.
Los sellos y letras pequeñas de la recreación pueden variar: no usarlos como fuente.
La copa representa un color aproximado, no una medición. Maridaje de res/hongos es
sugerencia editorial explícita, no información del productor. Escena exterior
generada, no fotografía de la bodega. No añadir stock, precio ni promesas de compra.
Datos kosher/no mevushal proceden de contraetiqueta 2017; no extrapolar a otros vinos.

## Cabernet Sauvignon Reserve 2019: segunda galería

Ruta `/catalogo-publico/seleccion/dadah-cabernet-reserve-2019`. Fuentes originales
IMG_0417 (frente, Single Vineyard Golan Heights) e IMG_0419 (reverso). 100% Cabernet,
20 meses roble francés,14%,750ml,no mevushal,kosher para Pésaj. Servicio60–70°F,
aproximadamente16–21°C: no heredar el rango60–65°F de2017. Historia de la misma
bodega tomada del estuche2017, señalada como tal; no es procedencia de las uvas.

Frente blanco existente más cinco imágenes: reverso,sirviendo,copa,parrilla,mesa.
WebP960×1200quality85,55–189KB por imagen nueva. Referencias originales y prompts
con identidad2019/etiquetaamarilla,ambiente piedra/lino/luz cálida,no overlays.
La variante de mesa en collage se descartó; otra se corrigió para que dijera
Golan Heights. Texto fino y sellos generados requieren revisión antes de producción.
Frente y contraetiqueta originales enlazados. Res/verduras es maridaje sugerido.

`EditorialWinePage` comparte presentación2017/2019; `EditorialWine` define datos,
`editorialMetadata` resuelve OG con dominio de Vercel cuando existe. No cambiar
fichas dinámicas del CRM, ni asignar a un ID por heurística de nombre. Ninguna
consulta o escritura adicional al backend, precio o disponibilidad inventados.

## Catálogo blanco y descubrimiento (octubre 2026)
- `/catalogo-publico/catalogo` uses a scoped `shopPage` canvas: pure white header, body, product images and filter sheet, matching the home bottle showcase. The dark shared footer remains. No beige hover surfaces are introduced.
- Editorial heading and short introduction lead into a horizontal category selector, search, filter control, sort and result count. Three columns on desktop, two on mobile; the entire product card remains a link to its published product ID.
- One native filter dialog adapts from a desktop side panel to a mobile bottom sheet. It has a scrollable field area and persistent apply button, keyboard Escape/focus restoration, page-scroll locking, and safe-area padding. Active filter chips can be removed individually.
- Available facets: type, vintage, budget, grape, region, body and alcohol. Empty metadata facets are not shown. Search also includes pairing, ignores accents, and supports multiple terms. Unknown prices always sort last; budget boundaries do not overlap.
- `getShopCollection` reads only descriptive public fields for IDs already in the approved publication. Prices, products and primary images still come from that publication. No price refresh semantics, CRM forms/actions, database schema, private prices or stock logic changed.
- Generic editorial images are not automatically matched to CRM products by name. This change preserves existing product photography; white is the UI canvas, not an alteration of uploaded photos.
- Validation: scoped ESLint, Next production compilation, TypeScript, whitespace checks, and focused checks for accents, multi-term search, budget endpoints, facet intersection and missing-price ordering. A real iPhone visual review remains part of Preview feedback.

## Coming-soon order pill
- The catalog introduction now includes a clickable burgundy pill: “Haz tu pedido aquí”, with “Próximamente” in a lighter, readable rose tone.
- It opens an accessible native dialog explaining that orders are not yet enabled; Escape, backdrop and the return button close it. No form, payment or order action exists.
- Short `.vercel.app` alias remains a configuration task: availability must be checked, it must target the approved catalog branch/deployment, and the catalog-only hostname routing must be configured. Existing CRM domain must remain unchanged. A manually assigned alias needs reassignment on subsequent deployments unless branch automation is configured.

## Dedicated catalog domain: image routing fix
- `vinos-catalogo.vercel.app` targets Preview branch `catalog-redesign`; its `DOMINIO_CATALOGO_PUBLICO` variable is branch-scoped. The CRM production domain is unchanged.
- On the dedicated hostname, `/catalogo/` static editorial assets must pass through before the catch-all homepage rewrite. Rewriting image requests to HTML broke the hero and Next image optimization.
- The exception is confined to that hostname and asset namespace. CRM routes, APIs and authentication retain their existing behavior.
- Regression check: `node --import tsx scripts/check-catalog-routing.ts` covers image URLs, public pages, catalog isolation and CRM authentication.

## Grand Rivallon and 2017 lighting — 2026-10-02
- Home reads the existing publication, sorts its five existing Dādāh entries by published price descending (unknown prices last), then displays Grand Rivallon if ID `cmtugbmde0002ih049z900g5i` and vintage 2012 are published. Remaining editorial entries retain their order. Dynamic rendering and Suspense keep ordering current without blocking the hero.
- Grand Rivallon uses its existing published product URL, publication gate, live price and availability. Shared EditorialWinePage accepts optional commerce data. No CRM, schema, admin or price writes.
- Facts transcribed from supplied front/back photographs: Saint-Émilion Grand Cru 2012, 85% Merlot / 10% Cabernet Sauvignon / 5% Cabernet Franc, 13%, 750 ml. Pairing is explicitly an editorial suggestion; no unverified aging or certification claim.
- Six generated gallery assets: `public/catalogo/grand-rivallon-2012-{front,back,pour,glass,pairing,table}.webp`. Original photographs remain linked as `grand-rivallon-2012-{front,label}-original.jpeg` for accurate label details.
- Image direction/prompts: preserve reference bottle proportions and label identity; front/back centered on pure white; pour with a rigid straight bottle in a French blue-hour salon, walnut and silver; glass against cool marble and blue-grey walls; braised lamb with rosemary, shallots and carrots without dairy; a French courtyard table for two with limestone and dark blue doors. These are created scenes, not estate photographs.
- 2017 edit prompt: preserve the transparent silhouette, label and vintage; remove blue fluorescent hotspots and hard reflected shapes, use restrained softbox edge reflections on deep black glass and a satin charcoal capsule. Saved as `public/catalogo/reserve-2017-softlight.webp`, shared by hero, home showcase and 2017 editorial profile; original asset retained.

### Publication checkpoint
- Remote commit `ed5779afe6558ae47227d2092472568f4895f531` publishes ONLY the 2017 soft-light asset and its three public references.
- Local commit `0b9a068` retains the complete Grand Rivallon/profile/ordering work. It is NOT deployed: uploading the supplied original back-label JPEG was rejected, and must not be retried without authorization.
- Before continuing, build on the current remote tree and upload only intended public files; local and remote git histories differ. Do not force-push. Local build was blocked by unavailable Google Fonts network access; TypeScript, scoped ESLint, ordering/publication assertions and routing regression passed. Verify Preview build and rendered assets before declaring completion.

## Protocolo compartido por vino
El registro y el encargo estándar están en [CATALOG-WINES.md](./CATALOG-WINES.md). La continuación solicitada por Isaac completa Grand Rivallon tras el checkpoint anterior; verificar deployment antes de comunicar terminado.
