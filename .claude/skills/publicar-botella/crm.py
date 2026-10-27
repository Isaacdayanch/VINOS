"""CRM de vinos (Supabase, API REST por HTTPS): buscar, dar de alta y publicar el catálogo.

Uso:
  python3 -I crm.py buscar <texto>             # productos cuyo nombre o SKU contiene <texto>
  python3 -I crm.py crear <producto.json>      # alta de un producto (falla si ya existe)
  python3 -I crm.py publicar [--ver]           # publica TODO lo activo; --ver solo muestra qué cambia
  python3 -I crm.py foto <archivo> [nombre]    # sube una foto al storage (bucket fotos-productos) y da su URL pública
  python3 -I crm.py actualizar <id> <json>     # cambia campos de un producto (descripcion, notas, maridaje, fotoUrl...)
  python3 -I crm.py imagen-extra <id> <url> [orden]   # agrega una foto extra a la ficha pública del producto

Camino "solo CRM" (sin código, acordado con Isaac el 27-oct-2026): la ficha pública
`/catalogo-publico/<id>` se arma sola con fotoUrl + imágenes extra + descripcion /
notas / maridaje del producto. Así una botella nueva se publica sin tocar la página:
  1. `foto` por cada imagen (frente, estuche, etiqueta, copa, maridaje) → URLs
  2. `crear` el producto con fotoUrl = URL del frente y los textos
  3. `imagen-extra` con las demás URLs (orden 0, 1, 2...)
  4. Isaac da clic en "Publicar catálogo" en el CRM (o `publicar` con su "va").

La llave: si el entorno tiene el secreto de red de Supabase (encabezado `apikey`),
el proxy la agrega solo. Si no, se lee de la variable SUPABASE_SECRET_KEY, que se
pasa solo en el comando (`SUPABASE_SECRET_KEY=... python3 -I crm.py ...`);
nunca guardarla en un archivo ni en el repo.

Reglas (CLAUDE.md): leer, sí; crear o publicar, solo con "va" de Isaac.
Publicar = lo mismo que el botón "Publicar catálogo" del CRM (`publicarCatalogo()`):
una fila nueva en CatalogoPublicado con todos los productos activos.
"""
import datetime
import json
import os
import secrets
import sys
import time
import urllib.parse
import urllib.request

HOST = os.environ.get("CRM_HOST", "https://lwekyvwfrmgzmavwveji.supabase.co")
BASE = os.environ.get("CRM_REST_URL", HOST + "/rest/v1")
BUCKET = "fotos-productos"  # el mismo que usa el CRM (src/lib/supabaseStorage.ts)
PUBLIC_FIELDS = ("id", "nombre", "fotoUrl", "tipo", "categoria", "anio", "precioLista")
REQUIRED = ("nombre", "sku", "piezasPorCaja")
MIME = {".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}


def call(method: str, path: str, body=None, raw_body: bytes | None = None, content_type="application/json"):
    headers = {"Content-Type": content_type, "Prefer": "return=representation"}
    key = os.environ.get("SUPABASE_SECRET_KEY")
    if key:
        headers["apikey"] = key
    data = raw_body if raw_body is not None else (json.dumps(body).encode() if body is not None else None)
    url = path if path.startswith("https://") else BASE + path
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            raw = res.read()
    except urllib.error.HTTPError as err:
        sys.exit(f"Supabase respondió {err.code}: {err.read().decode()[:300]}")
    except urllib.error.URLError as err:
        sys.exit(f"Sin conexión a Supabase ({err.reason}). Falta el secreto de red o el dominio "
                 "lwekyvwfrmgzmavwveji.supabase.co en el entorno; ver SKILL.md, sección Accesos.")
    return json.loads(raw) if raw else None


def new_id() -> str:
    """Prisma usa cuid(); la base no tiene default, así que se genera aquí (empieza con 'c')."""
    return "c" + format(int(time.time()), "x") + secrets.token_hex(8)


def buscar(texto: str):
    q = urllib.parse.quote(f"*{texto}*")
    rows = call("GET", f"/Producto?select=id,nombre,sku,tipo,categoria,anio,activo,precioLista,fotoUrl&or=(nombre.ilike.{q},sku.ilike.{q})&order=nombre")
    for p in rows:
        print(json.dumps(p, ensure_ascii=False))
    if not rows:
        print("(ninguno)")


def crear(path: str):
    producto = json.load(open(path))
    missing = [k for k in REQUIRED if not producto.get(k)]
    if missing:
        sys.exit(f"Faltan campos: {missing}")
    sku = urllib.parse.quote(producto["sku"])
    if call("GET", f"/Producto?select=id&sku=eq.{sku}"):
        sys.exit(f"Ya existe un producto con SKU {producto['sku']}")
    producto = {"id": new_id(), "activo": True, **producto}
    creado = call("POST", "/Producto", producto)[0]
    print(json.dumps(creado, ensure_ascii=False))


def publicar(solo_ver: bool):
    activos = call("GET", "/Producto?select=" + ",".join(PUBLIC_FIELDS) + "&activo=eq.true&order=nombre.asc")
    ultimo = call("GET", "/CatalogoPublicado?select=productos&order=fechaPublicado.desc&limit=1")
    antes = {p.get("id"): p for p in (ultimo[0]["productos"] if ultimo else [])}
    ids = {p["id"] for p in activos}
    cambios = []
    for p in activos:
        o = antes.get(p["id"])
        if not o:
            cambios.append(f"ENTRA: {p['nombre']} (precio {p['precioLista']})")
        else:
            diff = {k: (o.get(k), p[k]) for k in PUBLIC_FIELDS[1:] if o.get(k) != p[k]}
            if diff:
                cambios.append(f"CAMBIA: {p['nombre']} {diff}")
    cambios += [f"SALE: {o.get('nombre')}" for i, o in antes.items() if i not in ids]
    print(f"Activos: {len(activos)} · publicados antes: {len(antes)}")
    print("\n".join(cambios) or "Sin cambios contra la última publicación.")
    if solo_ver:
        return
    fecha = datetime.datetime.now(datetime.UTC).replace(tzinfo=None).isoformat(timespec="milliseconds")
    call("POST", "/CatalogoPublicado", {"id": new_id(), "fechaPublicado": fecha, "productos": activos})
    print(f"Publicado: {len(activos)} productos.")


def foto(path: str, nombre: str | None = None):
    """Sube una imagen al bucket público y regresa la URL que va en fotoUrl / imagen extra."""
    ext = os.path.splitext(path)[1].lower()
    if ext not in MIME:
        sys.exit(f"Formato no soportado ({ext}); usar .webp, .jpg o .png")
    nombre = nombre or f"{os.path.splitext(os.path.basename(path))[0]}-{secrets.token_hex(4)}{ext}"
    with open(path, "rb") as f:
        contenido = f.read()
    call("POST", f"{HOST}/storage/v1/object/{BUCKET}/{urllib.parse.quote(nombre)}",
         raw_body=contenido, content_type=MIME[ext])
    url = f"{HOST}/storage/v1/object/public/{BUCKET}/{urllib.parse.quote(nombre)}"
    print(url)
    return url


def actualizar(producto_id: str, path_or_json: str):
    cambios = json.load(open(path_or_json)) if os.path.exists(path_or_json) else json.loads(path_or_json)
    cambios.pop("id", None)
    rows = call("PATCH", f"/Producto?id=eq.{urllib.parse.quote(producto_id)}", cambios)
    if not rows:
        sys.exit(f"No existe el producto {producto_id}")
    print(json.dumps(rows[0], ensure_ascii=False))


def imagen_extra(producto_id: str, url: str, orden: int | None = None):
    pid = urllib.parse.quote(producto_id)
    if not call("GET", f"/Producto?select=id&id=eq.{pid}"):
        sys.exit(f"No existe el producto {producto_id}")
    actuales = call("GET", f"/ProductoImagenExtra?select=id,orden&productoId=eq.{pid}&order=orden.asc")
    if len(actuales) >= 7:
        sys.exit("Ese producto ya tiene el máximo de 7 fotos extra")
    fecha = datetime.datetime.now(datetime.UTC).replace(tzinfo=None).isoformat(timespec="milliseconds")
    fila = {"id": new_id(), "productoId": producto_id, "url": url,
            "orden": len(actuales) if orden is None else orden, "createdAt": fecha}
    print(json.dumps(call("POST", "/ProductoImagenExtra", fila)[0], ensure_ascii=False))


if __name__ == "__main__":
    comandos = ("buscar", "crear", "publicar", "foto", "actualizar", "imagen-extra")
    if len(sys.argv) < 2 or sys.argv[1] not in comandos:
        sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "buscar":
        buscar(args[0])
    elif cmd == "crear":
        crear(args[0])
    elif cmd == "publicar":
        publicar("--ver" in args)
    elif cmd == "foto":
        foto(args[0], args[1] if len(args) > 1 else None)
    elif cmd == "actualizar":
        actualizar(args[0], args[1])
    else:
        imagen_extra(args[0], args[1], int(args[2]) if len(args) > 2 else None)
