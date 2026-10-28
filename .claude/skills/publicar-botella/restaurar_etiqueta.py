"""Restaura con Gemini la foto plana de una contraetiqueta (escaneo limpio, texto idéntico).
Uso: python3 -I restaurar_etiqueta.py etiqueta_recortada.png salida.png   (correr 3 veces y revisar letra por letra)
"""
import base64, io, json, sys, urllib.request
from PIL import Image
MODEL = "gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); im.thumbnail((1600, 1600))
buf = io.BytesIO(); im.save(buf, "JPEG", quality=95)
prompt = ("Esta es la fotografía de la contraetiqueta de papel de una botella de vino, tomada con poca luz. Devuelve la MISMA etiqueta como "
          "un escaneo plano de estudio: papel blanco limpio y uniforme, sin sombras, sin manchas, sin tinte de color, texto negro nítido y "
          "sello dorado nítido, bordes rectos, vista totalmente frontal (sin perspectiva), encuadre solo de la etiqueta. "
          "REGLA ABSOLUTA: reproduce todo el texto, los números, los sellos circulares, el logo 'Vegan Friendly' y el código de barras "
          "EXACTAMENTE como están, letra por letra; no corrijas, no traduzcas, no reordenes, no agregues ni quites nada.")
body = {"contents": [{"parts": [{"text": prompt}, {"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(buf.getvalue()).decode()}}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=240) as res: data = json.load(res)
for p in data["candidates"][0]["content"]["parts"]:
    inline = p.get("inlineData") or p.get("inline_data")
    if inline: Image.open(io.BytesIO(base64.b64decode(inline["data"]))).convert("RGB").save(out); print("listo", out); break
else: raise SystemExit("sin imagen")
