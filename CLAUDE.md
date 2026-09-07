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
  con CLI distinto). Cliente generado en `src/generated/prisma` (gitignored,
  se regenera con `npx prisma generate` o al migrar/sembrar).
- **Base de datos**: PostgreSQL en **Supabase** (proyecto "Isaacdayanch's
  Project", organización "Vinos-CRM" — separado de su otro negocio Daymart,
  que vive en su propia organización de Supabase). Se usa el *connection
  pooler* de Supabase: `DATABASE_URL` (puerto 6543, modo transacción, la usa
  la app) y `DIRECT_URL` (puerto 5432, modo sesión, la usa Prisma solo para
  migraciones) — ambas en `.env` (gitignored) y replicadas como variables de
  entorno en Vercel para producción.
  - Ojo: desde este entorno de desarrollo (sandbox de Claude) **no hay salida
    de red directa a Postgres** (solo HTTPS vía proxy), así que las
    migraciones y el seed no se pueden correr desde aquí contra Supabase.
    Por eso el build de Vercel corre `prisma migrate deploy` automáticamente
    (ver `package.json` → `build`), y los datos reales se cargaron una sola
    vez visitando `/api/seed-inicial?secreto=...` ya en producción (ruta
    protegida con la variable `SEED_SECRET`, pensada para BORRARSE del código
    después de usarla una vez — nunca debe volver a correr con datos reales
    ya cargados, porque empieza borrando todo).
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
4. Visite `/api/seed-inicial?secreto=<SEED_SECRET>` una vez para cargar los
   datos reales (después hay que borrar esa ruta del código).

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
