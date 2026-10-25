"""Genera las fotos de ambiente de un destilado con la API de imágenes de Google (Gemini).

Uso:
  python3 -I generar_fotos.py <slug> <foto_frontal.webp> "<descripción de la botella>" [vistas...]

Lee la llave de la variable de entorno GEMINI_API_KEY (nunca pegarla en el chat
ni en el código). Si Isaac la guardó como "secreto de red" para
generativelanguage.googleapis.com, la variable no existe y el proxy agrega la
llave solo; en ese caso se manda la petición sin ella. Guarda public/catalogo/<slug>-<vista>.webp a 960x1200.
Vistas: service, glass, pairing, table (por defecto, las cuatro).
El modelo se puede cambiar con GEMINI_IMAGE_MODEL.
"""
import base64
import io
import json
import os
import sys
import urllib.request

from PIL import Image

MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
BASE = ("Fotografía editorial realista y cinematográfica para el catálogo de una cava. "
        "Paleta crema, carbón y borgoña, luz cálida natural, poca profundidad de campo. "
        "Formato vertical 4:5. La botella debe verse idéntica a la foto de referencia: "
        "misma forma, cápsula, etiqueta, color del líquido y textos; recta y sin deformar. "
        "Sin manos con dedos raros, sin personas de frente, sin texto ni logos añadidos.")
SCENES = {
    "service": "Whisky sirviéndose desde la botella hacia un vaso de cata tipo Glencairn sobre una barra de madera oscura. La botella de referencia es la que sirve.",
    "glass": "Primer plano de un vaso corto de cristal con el whisky (color {color}) y un solo hielo grande, sobre mesa de piedra, luz de ventana lateral. La botella de referencia desenfocada al fondo.",
    "pairing": "Maridaje: {pairing}, en una tabla de madera junto a un vaso con el whisky y la botella de referencia.",
    "table": "Escena de sobremesa al anochecer: mesa con mantel crema, velas, dos vasos con whisky y la botella de referencia como protagonista.",
}


def generate(prompt: str, ref: Image.Image) -> Image.Image:
    buf = io.BytesIO()
    ref.convert("RGB").save(buf, "JPEG", quality=92)
    body = {"contents": [{"parts": [
        {"text": prompt},
        {"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(buf.getvalue()).decode()}},
    ]}], "generationConfig": {"responseModalities": ["IMAGE"]}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json",
                 **({"x-goog-api-key": os.environ["GEMINI_API_KEY"]} if os.environ.get("GEMINI_API_KEY") else {})},
    )
    with urllib.request.urlopen(req, timeout=180) as res:
        data = json.load(res)
    for part in data["candidates"][0]["content"]["parts"]:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline:
            return Image.open(io.BytesIO(base64.b64decode(inline["data"])))
    raise RuntimeError(f"La API no devolvió imagen: {json.dumps(data)[:500]}")


def fit(img: Image.Image) -> Image.Image:
    """Recorta al centro a 4:5 y escala a 960x1200."""
    w, h = img.size
    if w / h > .8:
        nw = int(h * .8); img = img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / .8); img = img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    return img.convert("RGB").resize((960, 1200), Image.LANCZOS)


if __name__ == "__main__":
    slug, front, desc = sys.argv[1], sys.argv[2], sys.argv[3]
    views = sys.argv[4:] or list(SCENES)
    color = os.environ.get("COLOR", "ámbar dorado")
    pairing = os.environ.get("MARIDAJE", "chocolate semiamargo con naranja, nueces tostadas y queso manchego añejo")
    ref = Image.open(front)
    for view in views:
        prompt = f"{BASE}\nBotella: {desc}.\nEscena: {SCENES[view].format(color=color, pairing=pairing)}"
        out = f"public/catalogo/{slug}-{view}.webp"
        fit(generate(prompt, ref)).save(out, "WEBP", quality=88)
        print("listo:", out)
