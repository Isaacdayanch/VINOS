"""Recorta el estuche (a la izquierda) de una foto botella + estuche y lo pone en 960x1200.

Uso: python3 -I recortar_estuche.py foto salida.webp xl xr espejo_desde [desde_botella]

`xl`/`xr`: columnas de las orillas izquierda/derecha del estuche (medirlas con
una cuadrícula). `espejo_desde`: columna a partir de la cual la botella tapa
el estuche; de ahí a `xr` se reconstruye en espejo con el lado izquierdo
(estuche y etiqueta son simétricos). Debe quedar a la derecha del texto de la
etiqueta para no reflejar letras. Con `desde_botella` (columna desde la que
solo hay botella) se calcula renglón por renglón dónde empieza la botella y
solo se reconstruye ahí, con una transición suave. Revisar con zoom.
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
xl, xr, mirror_from = int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(int).copy()
nw = a.min(axis=2) < 235
rows = np.where(nw[:, xl:mirror_from].sum(axis=1) > (mirror_from - xl) * .6)[0]
top, bot = rows[0], rows[-1]
src_a = a.copy()
if len(sys.argv) > 6:
    start = int(sys.argv[6])
    edge = {y: start + np.where(nw[y, start:])[0].max() for y in range(nw.shape[0]) if nw[y, start:].any()}
    ys = sorted(edge)
    axis = float(np.median([(start + np.where(nw[y, start:])[0].min() + edge[y]) / 2 for y in ys[5:int(len(ys) * .15)]]))
    first = {y: max(mirror_from, int(2 * axis - edge[y]) - 14) for y in edge}
else:
    first = {}
FADE = 6
for y in range(top, bot + 1):
    x0 = first.get(y, mirror_from) if first else mirror_from
    if first and y not in first:
        continue
    for x in range(x0, xr + 1):
        w = min(1.0, (x - x0 + 1) / FADE)
        a[y, x] = (1 - w) * src_a[y, x] + w * src_a[y, xl + xr - x]
box = Image.fromarray(a.astype(np.uint8)).crop((xl - 1, top - 1, xr + 1, bot + 2))

CW, CH = 960, 1200
s = CH * .88 / box.height
box = box.resize((int(box.width * s), int(box.height * s)), Image.LANCZOS)
canvas = Image.new("RGB", (CW, CH), (255, 255, 255))
x0, y0 = (CW - box.width) // 2, int(CH * .05)
shadow = Image.new("L", (CW, CH), 0)
ImageDraw.Draw(shadow).ellipse((x0 - 10, y0 + box.height - 12, x0 + box.width + 10, y0 + box.height + 16), fill=80)
canvas.paste(Image.new("RGB", (CW, CH), (60, 50, 40)), (0, 0), shadow.filter(ImageFilter.GaussianBlur(14)))
canvas.paste(box, (x0, y0))
canvas.save(out, "WEBP", quality=90)
print(f"listo: {out} (filas {top}-{bot})")
