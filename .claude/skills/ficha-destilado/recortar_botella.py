"""Recorta una botella de una foto con fondo blanco y la pone en lienzo 960x1200.

Uso: python3 -I recortar_botella.py foto.webp salida.webp [desde_x]

La botella debe ser el objeto más a la derecha. `desde_x` es la columna a
partir de la cual solo hay botella (útil si el estuche queda detrás, a la
izquierda). Como las botellas son simétricas, el borde izquierdo se calcula
reflejando el derecho sobre el eje del cuello, así el estuche no se cuela.
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(int)
H, W, _ = a.shape
nonwhite = a.min(axis=2) < 235

rows = {}
for y in range(H):
    xs = np.where(nonwhite[y, start:])[0]
    if len(xs):
        rows[y] = start + xs.max()
ys = sorted(rows)
top, bot = ys[0], ys[-1]
for y in range(top, bot):  # vidrio transparente: hereda el renglón anterior
    if y not in rows:
        rows[y] = rows[y - 1]

axes = []
for y in range(top + 5, top + int((bot - top) * .15)):
    xs = np.where(nonwhite[y, start:])[0] + start
    if len(xs):
        axes.append((xs.min() + xs.max()) / 2)
axis = float(np.median(axes))

mask = np.zeros((H, W), np.uint8)
for y, r in rows.items():
    l = int(round(2 * axis - r)) + 4
    mask[y, max(l, 0):r + 1] = 255
m = Image.fromarray(mask).filter(ImageFilter.GaussianBlur(1.2))
right = max(rows.values()) + 4
left = int(2 * axis - right)
box = (max(left, 0), top - 2, right, bot + 2)
bottle, bm = im.crop(box), m.crop(box)

CW, CH = 960, 1200
s = CH * .88 / bottle.height
bottle = bottle.resize((int(bottle.width * s), int(bottle.height * s)), Image.LANCZOS)
bm = bm.resize(bottle.size, Image.LANCZOS)
canvas = Image.new("RGB", (CW, CH), (255, 255, 255))
x0, y0 = (CW - bottle.width) // 2, int(CH * .05)
shadow = Image.new("L", (CW, CH), 0)
bw = bottle.width
ImageDraw.Draw(shadow).ellipse((x0 + bw * .05, y0 + bottle.height - 14, x0 + bw * .95, y0 + bottle.height + 14), fill=90)
canvas.paste(Image.new("RGB", (CW, CH), (60, 50, 40)), (0, 0), shadow.filter(ImageFilter.GaussianBlur(14)))
canvas.paste(bottle, (x0, y0), bm)
canvas.save(out, "WEBP", quality=90)
print(f"listo: {out} (eje {axis:.0f}, filas {top}-{bot})")
