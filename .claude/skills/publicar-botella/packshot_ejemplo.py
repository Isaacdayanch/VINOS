import importlib.util as u, sys
s = u.spec_from_file_location('g', '.claude/skills/publicar-botella/generar_fotos.py'); g = u.module_from_spec(s); s.loader.exec_module(g)
from PIL import Image
g.MODEL = "gemini-3-pro-image"
view, n, src = sys.argv[1], sys.argv[2], sys.argv[3]
ref = Image.open(src); ref.thumbnail((1600, 1600))
common = ("Packshot de producto para catálogo: fondo completamente blanco y uniforme, sin mesa, sin silla, sin pared, sin reflejos de "
          "ambiente; sombra suave y pequeña bajo la base; botella perfectamente recta y centrada, encuadre completo de la botella de la "
          "cápsula a la base; formato vertical 4:5; iluminación de estudio neutra y pareja (sin brillos fuertes sobre la etiqueta). "
          "Mantén la botella IDÉNTICA a la foto: misma forma bordelesa, cápsula negra mate, etiqueta, colores y TODOS los textos "
          "exactamente como están (no cambies, inventes, completes ni traduzcas ninguna letra, número, sello ni símbolo; conserva el "
          "código de barras y el código QR tal cual). Sin texto ni logos añadidos.")
prompts = {
 "front": "A partir de la foto adjunta, extrae SOLO la botella de vino Jerusalem Winery Merlot (cápsula negra mate, etiqueta plateada con tres estrellas rojas, un león dibujado en sepia, 'Judean Vineyards', JERUSALEM WINERY, ISRAEL, MERLOT y la palabra en hebreo, y una franja azul con JERUSALEM HILLS en letras plateadas entre dos líneas naranjas) y preséntala de frente. " + common,
 "back": "A partir de la foto adjunta (la parte trasera de la botella de vino Jerusalem Winery Merlot 2023), muestra la botella COMPLETA vista por detrás, de la cápsula negra a la base, con esta misma contraetiqueta blanca centrada, plana y legible, reproducida tal cual: el encabezado JERUSALEM WINERY ISRAEL, MERLOT, ALC. 13% VOL · 750ML · 2023, DRY RED WINE · JUDEAN HEIGHTS · PRODUCT OF ISRAEL, el párrafo, los datos del importador, KOSHER FOR PASSOVER · MEVUSHAL, el GOVERNMENT WARNING, los cuatro sellos redondos, el código QR y el código de barras, exactamente como en la foto. " + common,
}
out = f"/tmp/claude-0/-home-user-VINOS/a021ad77-3ae0-535b-b87b-fc1f798e6c94/scratchpad/jhm-{view}-{n}.png"
g.fit(g.generate(prompts[view], ref)).save(out)
print("listo", out)
