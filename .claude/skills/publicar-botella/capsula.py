import base64, io, json, sys, urllib.request
from PIL import Image
MODEL="gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im=Image.open(src).convert("RGB"); buf=io.BytesIO(); im.save(buf,"JPEG",quality=95)
prompt=("Esta es una fotografía de producto de una botella de vino sobre fondo blanco. Devuelve EXACTAMENTE la misma imagen con UN solo cambio: "
        "la cápsula del cuello (que ahora es ROJA) debe ser NEGRA mate, con las palabras 'DOURO DOURO DOURO' en letras doradas pequeñas "
        "alrededor del cuello, igual que la cápsula real. No cambies nada más: misma botella, misma etiqueta con todos sus textos "
        "idénticos letra por letra, mismo fondo blanco, misma sombra, mismo encuadre y tamaño.")
body={"contents":[{"parts":[{"text":prompt},{"inline_data":{"mime_type":"image/jpeg","data":base64.b64encode(buf.getvalue()).decode()}}]}],"generationConfig":{"responseModalities":["IMAGE"]}}
req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
with urllib.request.urlopen(req,timeout=240) as r: data=json.load(r)
for p in data["candidates"][0]["content"].get("parts",[]):
    inl=p.get("inlineData") or p.get("inline_data")
    if inl: Image.open(io.BytesIO(base64.b64decode(inl["data"]))).convert("RGB").save(out); print("listo",out); break
else: raise SystemExit("sin imagen")
