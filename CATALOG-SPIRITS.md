# Registro de destilados (Cava de destilados)

Proceso paso a paso: `.claude/skills/ficha-destilado/SKILL.md`.

| Destilado | Estado | Pendiente | Ruta |
|---|---|---|---|
| The Macallan 12 Años Double Cask | Ficha completa; 4 fotos: frente y estuche (de la foto de Isaac), vaso y maridaje (Gemini, hechas por Isaac) | Etiqueta trasera (foto de su botella); precio (sin precio por ahora) | `/catalogo-publico/c6adedb93be91f6dedc8a9b51` (en el CRM desde el 26-oct, SKU MAC-12DC, publicado) |
| The Macallan 18 Años Double Cask (2025 Release) | Ficha completa; 4 fotos: frente y estuche recortados de la foto de Isaac (`recortar_botella.py … 620 22` y `recortar_estuche.py … 287 610 543 620` sobre la foto sin marco, recorte 50,0,1100,1100) | Precio. Vaso (sin hielo) y maridaje generados con la API de Gemini el 26-oct (`gemini-3-pro-image`); en el maridaje se pidió la botella un poco desenfocada porque nítida salía con letra chica deformada | `/catalogo-publico/c6adf8abf229f4f0769251295` (en el CRM desde el 26-oct, SKU MAC-18DC, publicado) |
| The Macallan 15 Años Double Cask | Ficha completa; 4 fotos: frente y estuche de la foto de producto que mandó Isaac (`recortar_botella.py … 550`; estuche: la orilla tapada por la botella se reconstruyó con el mismo patrón desplazado una repetición, 45 px a la izq. y 4 px abajo, y luego `recortar_estuche.py … 335 541 542`), vaso y maridaje con la API de Gemini | Precio; dar de alta en el CRM como DESTILADO y publicar (27-oct: no aparecía en Destilados; la última publicación del 26-oct no lo incluye. Esta sesión no tenía el secreto `apikey` de Supabase para revisarlo) | Vista previa: `/catalogo-publico/seleccion/macallan-15-double-cask` |
