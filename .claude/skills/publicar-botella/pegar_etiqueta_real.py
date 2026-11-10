"""Pega la contraetiqueta REAL (foto de Isaac) sobre el packshot trasero de Gemini.
Uso: python3 -I pegar_etiqueta_real.py gemini_back.png foto_real.jpg lx0 ly0 lx1 ly1 salida.png
  lx0..ly1 = caja de la etiqueta en la foto real (medirla con zoom). La caja en el Gemini se detecta sola
  (columnas de la botella a 60 % de alto, filas claras en la columna central)."""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
gem, real, lx0, ly0, lx1, ly1, out = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7]), sys.argv[7]
base = Image.open(gem).convert('RGB'); A = np.array(base).astype(float); L = A.mean(axis=2); H, W = L.shape
row = L[int(H * 0.6)]; d = np.where(row < 100)[0]; bx0, bx1 = d.min(), d.max()
col = L[:, (bx0 + bx1) // 2]; rows = np.where(col > 170)[0]; rows = rows[(rows > H * 0.3) & (rows < H * 0.95)]
gy0, gy1 = rows.min(), rows.max(); mid = (gy0 + gy1) // 2
xs = np.where(L[mid, bx0:bx1 + 1] > 170)[0] + bx0; gx0, gx1 = xs.min(), xs.max()
print('gemini label', gx0, gy0, gx1, gy1)
lab = np.array(Image.open(real).convert('RGB').crop((lx0, ly0, lx1, ly1))).astype(float); h, w, _ = lab.shape
Lum = lab.mean(axis=2)
cp = np.percentile(Lum, 90, axis=0); cp = np.convolve(np.pad(cp, 20, mode='edge'), np.ones(41) / 41, mode='valid')
rp = np.percentile(Lum, 90, axis=1); rp = np.convolve(np.pad(rp, 30, mode='edge'), np.ones(61) / 61, mode='valid')
paper = np.outer(rp, cp) / rp.mean(); flat = lab * (paper.mean() / np.clip(paper, 60, None))[..., None]
mask = flat.mean(axis=2) > np.percentile(flat.mean(axis=2), 75)
pm = np.array([np.median(flat[..., c][mask]) for c in range(3)]); flat *= (np.array([212, 210, 206.]) / pm)
gl = A[gy0 + 20:gy0 + 100, gx0:gx1 + 1].mean(axis=2); prof = np.percentile(gl, 85, axis=0)
prof = np.convolve(np.pad(prof, 10, mode='edge'), np.ones(21) / 21, mode='valid'); prof /= prof.max()
tw = gx1 - gx0 + 1; th = round(tw * h / w); tx0 = gx0; ty0 = mid - th // 2
img = Image.fromarray(np.clip(flat, 0, 255).astype('uint8')).resize((tw, th), Image.LANCZOS)
img = Image.fromarray(np.clip(np.array(img).astype(float) * prof[None, :, None], 0, 255).astype('uint8'))
m = Image.new('L', (tw, th), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, tw - 1, th - 1), radius=5, fill=255); m = m.filter(ImageFilter.GaussianBlur(1.0))
res = base.copy()
glass = base.crop((gx0, max(0, gy0 - 40), gx1 + 1, gy0 - 2)).resize((tw + 4, max(th, gy1 - gy0) + 40), Image.LANCZOS).filter(ImageFilter.GaussianBlur(3))
res.paste(glass, (gx0 - 2, min(ty0, gy0)))
res.paste(img, (tx0, ty0), m); res.save(out); print('listo', out, 'colocada en', tx0, ty0, tw, th)
