import base64, io, json, sys, urllib.request
from PIL import Image
MODEL="gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im=Image.open(src).convert("RGB"); buf=io.BytesIO(); im.save(buf,"JPEG",quality=95)
prompt=("Esta es una contraetiqueta de vino, escaneo plano. Devuelve EXACTAMENTE la misma imagen con UN solo cambio: el dibujo dorado de la esquina "
        "superior derecha (ahora un casco griego con cresta) debe ser el casco VIKINGO de la marca Godin: casco redondeado con una banda central "
        "vertical de remaches, protector nasal, y una cara estilizada con ojos y barba de líneas, todo en líneas doradas finas, igual al logo del "
        "frente de la botella. No cambies nada más: mismo texto letra por letra, mismos sellos, mismo código de barras, mismo encuadre y tamaño.")
body={"contents":[{"parts":[{"text":prompt},{"inline_data":{"mime_type":"image/jpeg","data":base64.b64encode(buf.getvalue()).decode()}}]}],"generationConfig":{"responseModalities":["IMAGE"]}}
req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
with urllib.request.urlopen(req,timeout=240) as r: data=json.load(r)
for p in data["candidates"][0]["content"].get("parts",[]):
    inl=p.get("inlineData") or p.get("inline_data")
    if inl: Image.open(io.BytesIO(base64.b64decode(inl["data"]))).convert("RGB").save(out); print("listo",out); break
else: raise SystemExit("sin imagen")
