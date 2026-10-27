# Vinos CRM — memoria del proyecto

## Quién es el usuario y cómo trabajar con él

Isaac (isaacdayanch@gmail.com) es el dueño del negocio. **No sabe programar.**
Reglas de trabajo:

- Hablarle siempre en español mexicano, simple y directo. Nada de jerga técnica
  sin explicarla.
- Antes de construir algo nuevo o hacer un cambio grande: proponer el plan y
  esperar su "va" antes de tocar código.
- Mostrar cambios (idealmente con capturas de pantalla) y pedir su aprobación.
- Ir paso a paso, no aventar todo el sistema de una vez.
- Si hay una mejor forma de hacer algo, decírselo como recomendación (no
  imponerla).
- Si él necesita instalar o configurar algo (crear una cuenta, hacer clic en
  algo), guiarlo clic por clic, sin asumir que sabe dónde está cada botón.

Este proyecto es un negocio de vinos, **completamente separado** de cualquier
otro proyecto de Isaac (aunque comparta cuenta de Claude). No mezclar contexto.

## El negocio

Isaac importa y distribuye vinos. Es un negocio simple, sin venta en línea:
solo necesita controlar **inventario de botellas** y registrar **pedidos /
salidas** de forma ordenada (antes lo hacía en un Google Sheets que se le hizo
inmanejable).

Los vinos vienen en cajas de 6 o 12 botellas (varía por producto). El costo
por botella incluye el costo de la mercancía más una parte proporcional de
los gastos de importación (flete en dólares, aduana/maniobras en pesos) de
cada pedido.

Tiene un socio, **Beto**, con quien reparte inversión y ganancias.

## Plan completo acordado (7 módulos)

Menú de tres rayitas (☰) arriba, con estas secciones:

1. **Dashboard** (pantalla de inicio) — valor de inventario, ganancia total,
   cobrado/pendiente, alertas de stock bajo. ✅ Construido.
2. **Órdenes** — crear una orden de venta: cliente, vinos, cantidades, precio
   autocompletado según la categoría del cliente (o el último precio que se
   le dio a ese cliente en ese vino específico — se recuerda automático en
   `PrecioClienteProducto`). Al confirmar, descuenta stock solo (crea la
   `Salida` de cada línea). ✅ Construido (falta probar en producción, ver
   Estado actual).
3. **Recibos** — de una orden ya hecha, generar su recibo en PDF para el
   cliente. ✅ Construido (página imprimible `/ordenes/[id]/recibo`, más
   una lista en `/recibos` para llegar directo a cualquier orden).
4. **Stock** — inventario actual por vino (botellas/cajas), costo promedio,
   alerta de "reponer". Acción "Registrar entrada". ✅ Construido.
5. **Entradas** — cuando llega un pedido del proveedor: cajas, costo por
   caja, y los gastos generales del pedido (flete USD + aduana/maniobras MXN)
   se prorratean solos entre las botellas del pedido. ✅ Construido (dentro
   de Stock: "Registrar entrada" y "Nuevo pedido").
6. **Productos (catálogo)** — nombre, SKU, foto de la botella, piezas por
   caja, año (opcional, NO se pidió cosecha detallada), proveedor, categoría,
   3 niveles de precio (lista / descuento chico / descuento grande), stock
   mínimo. Incluye exportar **catálogo en PDF con fotos** (imprimible desde
   el navegador). ✅ Construido.
7. **Clientes** — nombre, teléfono, categoría de precio default, notas.
   ✅ Construido (catálogo simple: alta y lista).
8. **Finanzas** — pagos/aportaciones de los pedidos (con tipo de cambio por
   pago, ya que el flete es en USD y la aduana en MXN), quién de los socios
   puso el dinero (Isaac / Beto / dividido 50-50), cobros por orden, ganancia.
   ⏳ Pendiente.

### Decisiones de diseño ya acordadas con Isaac

- **Precios simples**: nada de fórmulas de margen% automáticas como en el
  Sheet viejo. Cada producto tiene hasta 3 precios fijos (lista, descuento
  chico, descuento grande) que se capturan una vez. Al vender, se autocompleta
  según la categoría del cliente, pero siempre es editable en esa venta.
- **Recordar precio por cliente**: al crear una orden, si ese cliente ya
  compró ese producto antes, sugerir el mismo precio que se le dio la última
  vez (tabla `PrecioClienteProducto`, pendiente de usar en la UI de Órdenes).
- **Costeo de importación simplificado**: por pedido se capturan solo 2
  cubetas de gasto: `logisticaUSD` (flete + seguro, en dólares, con
  `tipoCambio` del pedido) y `logisticaMXN` (aduana + maniobras + otros, ya
  en pesos). Se reparten entre todas las botellas del pedido. Ver
  `src/lib/costeo.ts`.
- **Finanzas / pagos**: cada pago que se registre debe tener moneda,
  `tipoCambio` (si es USD) y qué socio lo puso (o si se dividió 50/50). Isaac
  pidió esto explícitamente para saber cuánto ha invertido cada quien.
- **"Recibo"** = recibo de venta en PDF para el cliente (no recibo de
  mercancía entrante). Isaac lo confirmó explícitamente.
- **Vinos vs. destilados**: cada producto tiene `tipo` (`VINO` default /
  `DESTILADO`), y `categoria` es la subcategoría libre (Tinto, Reserva… o
  Arak, Whisky, Tequila…). El catálogo público los separa en dos páginas:
  `/catalogo-publico/catalogo` (vinos) y `/catalogo-publico/destilados`,
  que comparten el componente `Collection` (con textos y filtros por
  `kind`). El `tipo` se lee en vivo del producto (no de la foto congelada
  de `CatalogoPublicado`), así que mover un producto a Destilado cambia de
  página sin volver a publicar.
- **Fotos de botella sobre crema (regla fija)**: Cava de vinos, Destilados y
  la foto de botella de cada ficha usan fondo crema `#f6f2eb`. Las fotos
  vienen con fondo blanco; el servidor les repinta el blanco en crema
  (`/catalogo-publico/foto-crema`, ver `_lib/cream-photo.ts`). **NO** usar
  `mix-blend-mode` ni filtros CSS para esto: en iPhone (Safari) no funciona y
  se ven cuadros blancos — Isaac lo reportó como lo menos profesional posible.
  Siempre revisar los cambios de diseño también en tamaño celular.
- **Fichas de destilados (Cava de destilados)**: proceso en el skill
  `.claude/skills/publicar-botella/` (vinos y destilados: de la foto al CRM y a la página) y registro en `CATALOG-SPIRITS.md`. Isaac
  manda una botella a la vez; la ficha lleva nariz/boca/final (notas oficiales),
  cómo servirlo, maridaje de bocados/sobremesa y destilería, con 4–5 fotos:
  frente y estuche (fotos reales), etiqueta trasera (foto de SU botella) y
  vaso + maridaje (IA). Las fotos de IA se generan con la API de Gemini
  (secreto de red + facturación activa desde el 26-oct; modelo
  `gemini-3-pro-image`); si falla, Isaac las hace en gemini.google.com con
  las instrucciones de `prompts-gemini.md` del skill. **Cuando Isaac mande la
  foto de cualquier vino o destilado, usar el skill `publicar-botella`.** Primer destilado: Macallan 12 Double
  Cask (vista previa en `/catalogo-publico/seleccion/macallan-12-double-cask`;
  se conecta solo por nombre en `_lib/spirit-profiles.ts` cuando el producto existe en el CRM como DESTILADO).
- **Botones de arriba en Cava de vinos / destilados**: destilados por tipo
  (Arak, Whisky, Tequila, Mezcal — siempre visibles, "Próximamente" si no hay)
  y vinos por uva. La uva sale del campo `varietal` del CRM o del nombre
  (`GRAPES` en `_lib/collection-filters.ts`); solo se muestran uvas con
  botellas. Si Isaac captura una uva que no está en `GRAPES` (p. ej.
  Cabernet Franc, Chardonnay), agregarla ahí. Isaac quedó en capturar la uva
  de los vinos que no la dicen en el nombre (Romi, Grand Rivallon, Jerusalem
  Hills Gold/Silver Blend, Titora Grand/Red Seal, Noah 1-3).
- **Maridajes aptos para kosher sin que se note (27-oct-2026)**: el mercado
  principal de Isaac es kosher. En textos y fotos de maridaje: sin cerdo ni
  mariscos; carnes solo de res, cordero, pollo o pato; nunca carne y lácteos
  en la misma foto ni en la misma frase (quesos en una foto, carne en otra);
  nunca sellos kosher en la comida ni mencionar kosher en el maridaje.
  Detalle en el skill `publicar-botella`.
- **Pedidos en línea**: el botón "Haz tu pedido aquí · Próximamente" se
  queda tal cual para el público. Isaac quiere armar carrito + pedidos,
  pero NO le convenció la primera propuesta de logística (pedido web →
  WhatsApp prellenado → correo → convertir a Orden). Hay que re-proponerla
  con él antes de construir nada.

## Datos reales importados

Se importaron datos reales de su Google Sheets (`Inventario y Finanzas -
VINO.xlsx`) al sembrar la base de datos (`prisma/seed.ts`):

- 12 productos (DADAH, TANYA, CHALEY WINERY).
- Pedido `P001` con sus 12 líneas de entrada (proveedor Rashbi Wines Corp).
- 5 órdenes reales: ORD-001, ORD-002, ORD-003, ORD-005, ORD-006 (con sus
  clientes, líneas, precios).
- Salidas manuales (degustaciones, consumo interno, ventas directas sin
  orden formal).
- 1 pago real registrado en Finanzas (mercancía de P001, USD 19,528).
- Socios: Isaac y Beto.

Los números de stock y valor de inventario calculados por el sistema
(`calcularResumenInventario` en `src/lib/costeo.ts`) **cuadran exactamente**
con lo que mostraba el Sheet original ($334,386.81 MXN de valor total).

**Pendiente de confirmar con Isaac**: en el Sheet original, 4 botellas de la
carpeta "ISAAC D." (16 de julio: DAD-CS "Paim Kurson", DAD-CSR, TAN-LH,
TAN-CR) tenían precio puesto pero el Sheet nunca las restó del inventario
(les faltó marcar "Tipo de venta"). Se dejaron fuera del inventario aquí
también, para que el stock cuadre con lo que Isaac ve hoy — pero hay que
preguntarle si esas botellas de verdad ya salieron, para registrarlas bien.

## Stack técnico

- **Next.js 16** (App Router, Turbopack, Server Actions para todas las
  mutaciones — no hay API routes separadas). Ojo: Next 16 tiene cambios
  importantes vs versiones viejas (params/searchParams async, etc.) — ver
  `node_modules/next/dist/docs/` antes de asumir comportamiento de versiones
  anteriores.
- **Prisma 6.19.3** (fijado a esta versión estable; NO usar `prisma@latest`
  a ciegas, la versión más nueva en npm es un release candidate de Prisma 8
  con CLI distinto). Generator `prisma-client-js` (la forma clásica, NO la
  nueva `prisma-client` basada en ESM) — el cliente se genera en la
  ubicación default `node_modules/@prisma/client` / `node_modules/.prisma`,
  se importa como `@prisma/client` normal, y se regenera solo con
  `npx prisma generate` o al hacer `npm install` (postinstall).
  **Importante — bug ya resuelto**: se probó primero con el generator nuevo
  `prisma-client` (salida a `src/generated/prisma`) y aunque el motor de
  Linux (`rhel-openssl-3.0.x`, el que usa Vercel) sí se generaba, Next.js
  nunca lo empacaba en las funciones serverless desplegadas (error
  "Prisma Client could not locate the Query Engine"), ni agregando
  `outputFileTracingIncludes` a mano. Cambiar al generator clásico
  `prisma-client-js` lo resolvió de raíz, porque Next.js tiene soporte
  automático de rastreo de archivos específicamente para esa ubicación
  default — no usar el generator `prisma-client` en este proyecto.
- **Base de datos**: PostgreSQL en **Supabase**, conectado mediante la
  **integración nativa de Vercel** (proyecto de Vercel "vinos" → pestaña
  Storage → Connect Database → Supabase → "Create new project", eligiendo la
  organización "Vinos-CRM" — separada de Daymart). Vercel provisionó el
  proyecto de Supabase y agregó solo las variables de entorno en el proyecto
  de Vercel; el código lee esos nombres tal cual, **sin renombrar nada a
  mano** (justo el problema que causó tantos líos la vez anterior, cuando se
  copiaba/pegaba el connection string manualmente):
  - `POSTGRES_PRISMA_URL` → pooler en modo transacción, la usa la app
    (`datasource db { url }` en `prisma/schema.prisma`).
  - `POSTGRES_URL_NON_POOLING` → conexión directa, la usa Prisma solo para
    migraciones (`directUrl`).
  - (Vercel también agrega `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
    `SUPABASE_SERVICE_ROLE_KEY`, etc. — no se usan todavía, son para si algún
    día se necesita Supabase Storage o su cliente JS directo).
  - Ojo: desde este entorno de desarrollo (sandbox de Claude) **no hay salida
    de red directa a Postgres** (solo HTTPS vía proxy), así que las
    migraciones y el seed no se pueden correr desde aquí — el `.env` local
    solo tiene valores de relleno para que `prisma generate` no truene, no
    sirven para conectar a nada real.
  - El build de Vercel **NO** corre `prisma migrate deploy` (se probó y el
    contenedor de build no lograba conectarse a Postgres por el puerto de
    sesión); las tablas se crean a mano una vez, pegando el SQL de
    `crear_tablas.sql` en el SQL Editor de Supabase.
  - Los datos reales se cargaron una sola vez visitando `/api/seed-inicial` en
    producción (sin contraseña — solo corría si la tabla Producto estaba
    vacía). Ya se usó y Isaac confirmó que los datos están bien, así que esa
    ruta **ya se borró del código**.
- **Tailwind CSS v4** con paleta de vino (bordó `--wine` / crema
  `--background`), tema claro/oscuro automático vía `prefers-color-scheme`.
- **Fotos de producto**: por ahora se guardan en `public/uploads/` (solo
  sirve en local/dev; para producción hay que usar un storage real —
  Supabase Storage o Vercel Blob — antes de desplegar, si no las fotos se
  perderán en cada redeploy).
- **Catálogo PDF**: no se usa librería de generación de PDF; es una página
  imprimible (`/productos/catalogo`) con estilos `@media print` — el usuario
  usa "Guardar como PDF" del navegador (funciona igual en celular).

### Comandos útiles

```bash
npm run dev              # servidor de desarrollo
npm run build            # build de producción
npx prisma migrate dev   # aplicar cambios al esquema (prisma/schema.prisma)
npx prisma db seed       # volver a cargar los datos reales de ejemplo (BORRA todo y siembra de nuevo)
```

## Estado actual (última sesión)

Construido y probado en navegador (contra base de datos local SQLite, antes
de migrar a Postgres): Dashboard, Stock, Productos. Números de inventario
verificados contra el Excel original.

Después se migró la base de datos a **PostgreSQL en Supabase** (ver sección
de Stack técnico) para poder desplegar en Vercel. Se construyeron además
**Clientes** y **Órdenes** (crear venta con precio inteligente por cliente),
pero esto ya no se pudo probar en el navegador desde este entorno de
desarrollo, porque no hay salida de red directa a Postgres desde aquí (solo
desde Vercel/Supabase sí hay). El build y el chequeo de tipos de TypeScript
sí pasan.

### Ramas y sitios publicados (OJO antes de hacer cambios)

Hay **dos proyectos de Vercel** que despliegan del mismo repo, cada uno desde
una rama distinta:

- **Página pública**: `vinos-catalogo.vercel.app` se publica desde la rama
  `catalog-redesign`.
- **Sistema interno (CRM)**: se publica desde `claude/wine-crm-setup-13v2ux`
  (que además es la rama por defecto del repo).

Ambas ramas se habían separado (la pública con galerías/fotos editoriales,
la del CRM con abonos, ubicaciones, etc.). El 20-oct-2026 se **unieron** en
un solo historial (commit `41b1a1a`) y se empujó el mismo commit a las dos
ramas. **Regla**: cualquier cambio futuro debe terminar empujado a AMBAS
ramas (con permiso de Isaac), para que no se vuelvan a separar. Trabajar en
una rama `claude/...` y, al final, hacer push de ese mismo commit a
`catalog-redesign` y a `claude/wine-crm-setup-13v2ux` (ambos fast-forward).

**Acceso de Claude a los datos (desde el 26-oct-2026)**: Isaac creó una llave
secreta de Supabase (`sb_secret_…`, nombre "claude") y la guardó como secreto
de red del entorno VINOS para `lwekyvwfrmgzmavwveji.supabase.co`, encabezado
`apikey`. Con eso Claude usa la API REST de Supabase por HTTPS
(`https://lwekyvwfrmgzmavwveji.supabase.co/rest/v1/<Tabla>`, p. ej.
`/Producto`, `/CatalogoPublicado`); Postgres directo sigue bloqueado.
**Regla acordada: leer, sí; escribir o borrar datos reales, solo con "va"
de Isaac.** Publicar el catálogo = insertar una fila en `CatalogoPublicado`
con los productos activos (`id,nombre,fotoUrl,tipo,categoria,anio,precioLista`,
orden por nombre), igual que `publicarCatalogo()`; antes comparar contra la
última publicación y avisar qué cambia. **Isaac pidió (26-oct): al publicar,
siempre incluir TODO lo activo en el CRM** (no filtrar productos). Los `id` se generan a mano (no hay
default en la base): texto que empiece con `c`.

Las dos apps comparten la misma base de datos de Supabase (proyecto
`lwekyvwfrmgzmavwveji`). Los cambios de esquema se corren a mano en el SQL
Editor: `https://supabase.com/dashboard/project/lwekyvwfrmgzmavwveji/sql/new`
(Isaac ya sabe usarlo; mandarle el SQL listo para pegar, idealmente con
`IF NOT EXISTS` para que no truene si lo corre dos veces).

### Vercel — estado del despliegue

Isaac tiene varios proyectos duplicados en Vercel de intentos anteriores
(`vinos-crm`, `vinos-1wiz`, `vinos`, además de `daymart-crm` que es de su
otro negocio y NO se debe tocar). Quedó pendiente que él:
1. Borre los proyectos de vinos duplicados y deje solo uno limpio.
2. Vuelva a importar el repo una sola vez con las variables de entorno
   (`DATABASE_URL`, `DIRECT_URL`, `SEED_SECRET` — ver Stack técnico) puestas
   desde el inicio.
3. Corra el SQL de `crear_tablas.sql` (ya se lo pasamos) en el SQL Editor de
   Supabase para crear las tablas — el build de Vercel YA NO corre
   `prisma migrate deploy` (se quitó del script `build` en package.json
   porque el contenedor de build de Vercel no lograba conectarse a Postgres
   por el puerto de sesión 5432; en cambio el runtime normal de la app sí
   conecta bien por el puerto 6543/pooler transacción).
4. ~~Visite `/api/seed-inicial?secreto=<SEED_SECRET>` una vez para cargar los
   datos reales~~ — ya hecho, y la ruta ya se borró del código.

**Bug ya resuelto**: el primer intento de despliegue en Vercel daba error 500
("Prisma Client could not locate the Query Engine for runtime
rhel-openssl-3.0.x") — faltaba declarar `binaryTargets = ["native",
"rhel-openssl-3.0.x"]` en el generator de `prisma/schema.prisma` (ya
corregido y en el repo). Este bug no debería repetirse.

Isaac decidió pausar el tema de Vercel por lo confuso que se puso (múltiples
proyectos duplicados) y pidió seguir construyendo el sistema primero.
Retomar el despliegue cuando él lo pida — debería ser rápido ya que el bug
real de Prisma está resuelto y solo falta la limpieza de proyectos.

**Siguiente paso de producto**: Recibos (PDF de una orden) y
Finanzas/Socios — con "va" de Isaac antes de empezar cada uno.
