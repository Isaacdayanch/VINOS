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
