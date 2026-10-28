"""CRM de vinos (Supabase, API REST por HTTPS): buscar, dar de alta y publicar el catálogo.

Uso:
  python3 -I crm.py buscar <texto>             # productos cuyo nombre o SKU contiene <texto>
  python3 -I crm.py crear <producto.json>      # alta de un producto (falla si ya existe)
  python3 -I crm.py publicar [--ver]           # publica lo activo + lo ya publicado sin stock; --ver solo muestra qué cambia

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

BASE = os.environ.get("CRM_REST_URL", "https://lwekyvwfrmgzmavwveji.supabase.co/rest/v1")
PUBLIC_FIELDS = ("id", "nombre", "fotoUrl", "tipo", "categoria", "anio", "precioLista")
REQUIRED = ("nombre", "sku", "piezasPorCaja")


def call(method: str, path: str, body=None):
    headers = {"Content-Type": "application/json", "Prefer": "return=representation"}
    key = os.environ.get("SUPABASE_SECRET_KEY")
    if key:
        headers["apikey"] = key
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
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
    todos = call("GET", "/Producto?select=" + ",".join(PUBLIC_FIELDS) + ",activo&order=nombre.asc")
    ultimo = call("GET", "/CatalogoPublicado?select=productos&order=fechaPublicado.desc&limit=1")
    antes = {p.get("id"): p for p in (ultimo[0]["productos"] if ultimo else [])}
    # Regla de Isaac (28-oct-2026): los activos siempre entran; los que se quedaron sin stock
    # (inactivos) NO se caen de la página si ya estaban publicados: siguen hasta abajo con
    # "Muy pronto en tu mesa". Un producto inactivo que nunca se publicó no entra.
    activos = [{k: p[k] for k in PUBLIC_FIELDS} for p in todos if p["activo"] or p["id"] in antes]
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


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in ("buscar", "crear", "publicar"):
        sys.exit(__doc__)
    if sys.argv[1] == "buscar":
        buscar(sys.argv[2])
    elif sys.argv[1] == "crear":
        crear(sys.argv[2])
    else:
        publicar("--ver" in sys.argv)
