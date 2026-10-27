# Instrucciones para Gemini (gemini.google.com)

Isaac las pega en gemini.google.com junto con la foto frontal ya recortada
(`public/catalogo/<slug>-front.webp` convertida a JPG y mandada con
SendUserFile). **Un chat de Gemini nuevo por foto.** Él descarga y regresa las
imágenes; luego se revisan y se pasan a 960×1200 WebP con `fit()` de
`generar_fotos.py`.

Rellenar los `{…}`. Cambiar la escena entre botellas para que no se repitan
(el Macallan 12 usó tarde de ventana + tabla de madera; el 18, chimenea de
noche + puro). Ajustar el color del líquido al real.

## Bloque fijo (va al final de TODAS)

```
Muy importante: la botella debe verse IDÉNTICA a la de la foto: misma forma, {cápsula}, etiqueta {descripción breve de la etiqueta, p. ej. "blanca con THE MACALLAN en rojo y el número 18"}, mismo color del líquido. No cambies ni inventes letras de la etiqueta. Botella recta, sin deformar.

Paleta de colores: crema, carbón y toques borgoña. Formato vertical 4:5. Sin personas, sin manos, sin texto ni logos añadidos.
```

## Destilados (2 fotos: `glass` y `pairing`)

**Vaso**
```
Usa la botella de la foto adjunta ({nombre exacto}) y crea una fotografía editorial realista para el catálogo de una cava de vinos y destilados.

Escena: {ambiente}. {Vaso: corto con un hielo grande / tipo Glencairn solo, sin hielo} con {destilado} color {color}, sobre {superficie}. Junto al vaso, la botella de la foto. {Luz}, poca profundidad de campo.

{bloque fijo}
```

**Maridaje**
```
Usa la botella de la foto adjunta ({nombre exacto}) y crea una fotografía editorial realista para el catálogo de una cava de vinos y destilados.

Escena: {momento, p. ej. sobremesa de noche}. Sobre {superficie}: {los bocados del maridaje de la ficha}. Un vaso con {destilado} {servicio} color {color} y, detrás, la botella de la foto. {Luz}, poca profundidad de campo.

{bloque fijo}
```

## Vinos (4 fotos: `service`, `glass`, `pairing`, `table`)

Mismo orden que las fichas de vino (la galería abre con `table`).

**Servicio**
```
Usa la botella de la foto adjunta ({nombre y añada}) y crea una fotografía editorial realista para el catálogo de una cava de vinos.

Escena: el vino sirviéndose desde la botella de la foto hacia una copa de cristal fino, sobre {superficie}. Vino {color: rojo profundo / dorado pálido…}. {Luz}, poca profundidad de campo.

{bloque fijo}
```

**Copa**
```
… Escena: primer plano de una copa de vino {tipo} con vino {color}, a la luz de {ventana / velas}, con la botella de la foto desenfocada al fondo. …
```

**Maridaje**
```
… Escena: {el plato de la ficha, p. ej. cordero a la parrilla con romero y verduras asadas} servido en {vajilla}, junto a una copa de vino {color} y la botella de la foto. …
```

**Mesa**
```
… Escena: una mesa para compartir {al anochecer / al aire libre}, mantel crema, velas, dos copas con vino {color} y la botella de la foto como protagonista. …
```

## Si algo sale mal (decírselo a Isaac)

- Etiqueta rara: *"La etiqueta salió distinta. Déjala exactamente igual a la de la foto que te pasé."*
- Horizontal: *"Hazla vertical, formato 4:5."*
- No convence: *"Dame otra versión."*

Al recibirlas: revisar con Read que la botella sea la correcta (forma,
cápsula, número/añada, color). Las letras pequeñas de la etiqueta suelen salir
inventadas: avisarle a Isaac y que él decida. Nunca sacar datos de una imagen
generada.
