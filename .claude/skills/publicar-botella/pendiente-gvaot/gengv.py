import importlib.util as u, sys
s = u.spec_from_file_location('g', '.claude/skills/publicar-botella/generar_fotos.py'); g = u.module_from_spec(s); s.loader.exec_module(g)
from PIL import Image
g.MODEL = "gemini-3-pro-image"
view, n = sys.argv[1], sys.argv[2]
ref = Image.open("public/catalogo/gvaot-pinot-noir-2020-front.webp")
desc = ("Gva'ot Gofna Reserve Pinot Noir 2020, vino tinto de Israel: botella borgoña de hombros caídos, cápsula gris oscuro con GVA'OT en dorado, "
        "medallón negro en relieve en el cuello de la etiqueta, etiqueta crema con GVA'OT en letras negras grandes, GOFNA y texto hebreo, 'Reserve' "
        "en cursiva dorada, PINOT NOIR 2020 en rojo; vino tinto color rubí claro y translúcido")
scenes = {
 "service": "Terraza de madera en lo alto de las colinas de Samaria, viñedos en terrazas y niebla matinal, luz suave y fresca de la mañana. El vino tinto rubí claro sirviéndose desde la botella de referencia hacia una copa Borgoña grande y redonda, sobre una mesa de madera clara. Poca profundidad de campo.",
 "glass": "Primer plano de una copa Borgoña ancha con vino tinto rubí claro y translúcido, a contraluz de una ventana con cortina de lino, sobre una mesa de mármol blanco con unas cerezas y una ramita de tomillo; la botella de referencia desenfocada al fondo. Luz suave, poca profundidad de campo.",
 "pairing": "Mesa de lino blanco, luz natural suave. Un plato de cerámica clara con pechuga de pato rostizada en rebanadas, piel dorada, con salsa de cerezas y betabel asado con hierbas; sin crema, sin mantequilla, sin queso. Una copa Borgoña con vino tinto rubí claro y la botella de referencia detrás, un poco desenfocada. Poca profundidad de campo.",
 "table": "Picnic elegante en un viñedo de las colinas de Samaria al atardecer: manta de lino, canasta de mimbre, pan de masa madre, higos y uvas, almendras, un tazón de aceitunas, dos copas Borgoña con vino tinto rubí claro y la botella de referencia como protagonista. Sin queso, sin carne a la vista. Luz dorada, poca profundidad de campo.",
}
prompt = f"{g.BASE}\nBotella: {desc}.\nEscena: {scenes[view]}"
out = f"/tmp/claude-0/-home-user-VINOS/a021ad77-3ae0-535b-b87b-fc1f798e6c94/scratchpad/gv-{view}-{n}.png"
g.fit(g.generate(prompt, ref)).save(out)
print("listo", out)
