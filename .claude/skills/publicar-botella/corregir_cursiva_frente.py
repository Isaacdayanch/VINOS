import base64, io, json, sys, urllib.request
from PIL import Image
MODEL = "gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
buf = io.BytesIO(); im.save(buf, "JPEG", quality=95)
prompt = ("Devuelve EXACTAMENTE la misma imagen (misma botella, misma etiqueta, mismo fondo blanco, mismo encuadre) con UNA sola corrección en la etiqueta: "
          "la línea en letra cursiva que está justo arriba de JERUSALEM WINERY debe decir, en la misma caligrafía elegante negra, 'Judean Vineyards' "
          "(J-u-d-e-a-n  V-i-n-e-y-a-r-d-s), con la J y la V mayúsculas. No cambies ninguna otra letra, dibujo ni color.")
body = {"contents": [{"parts": [{"text": prompt}, {"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(buf.getvalue()).decode()}}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=240) as res: data = json.load(res)
for p in data["candidates"][0]["content"].get("parts", []):
    inline = p.get("inlineData") or p.get("inline_data")
    if inline: Image.open(io.BytesIO(base64.b64decode(inline["data"]))).convert("RGB").save(out); print("listo", out); break
else: raise SystemExit("sin imagen " + json.dumps(data)[:300])
