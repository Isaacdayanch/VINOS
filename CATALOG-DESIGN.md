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
- Recorrido editorial horizontal con scroll-snap nativo y fotografías originales
  aportadas por Isaac. Captions únicamente basados en etiquetas legibles.
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
