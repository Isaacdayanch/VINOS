import base64, io, json, sys, urllib.request
from PIL import Image
MODEL = "gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); im = im.resize((im.width*3, im.height*3), Image.LANCZOS)
buf = io.BytesIO(); im.save(buf, "JPEG", quality=95)
prompt = ("Esta es la contraetiqueta de una botella de vino. Devuelve EXACTAMENTE la misma imagen (misma tipografía, mismo diseño, mismos "
          "sellos, mismo encuadre, mismo tamaño) con SOLO estas correcciones de texto en el párrafo pequeño de abajo: "
          "(1) donde dice 'UNDER THE MEHADRIN ACCORDING TO BEIT YOSEPH' debe decir 'KOSHER LE MEHADRIN ACCORDING TO BEIT YOSEPH'; "
          "(2) donde dice 'FROM ORLA AND SHMITT' debe decir 'FREE FROM ORLA AND SHVI'IT'; "
          "(3) la línea completa debe quedar: 'KOSHER LE MEHADRIN ACCORDING TO BEIT YOSEPH. FOR YEAR ROUND USE INCLUDING PASSOVER. "
          "FREE FROM ORLA AND SHVI'IT. TRUMOT AND MAASEROT HAVE BEEN GIVEN. UNDER THE STRICT SUPERVISION OF RABBI M. UNGAR, MONSEY, NY.' "
          "No cambies ninguna otra letra, número, sello ni el código de barras. No agregues nada.")
body = {"contents": [{"parts": [{"text": prompt}, {"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(buf.getvalue()).decode()}}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=240) as res: data = json.load(res)
for p in data["candidates"][0]["content"].get("parts", []):
    inline = p.get("inlineData") or p.get("inline_data")
    if inline: Image.open(io.BytesIO(base64.b64decode(inline["data"]))).convert("RGB").save(out); print("listo", out); break
else: raise SystemExit("sin imagen " + json.dumps(data)[:300])
