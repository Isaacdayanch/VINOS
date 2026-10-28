import base64, io, json, sys, urllib.request
from PIL import Image
MODEL="gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im=Image.open(src).convert("RGB"); im=im.resize((im.width*2,im.height*2),Image.LANCZOS); buf=io.BytesIO(); im.save(buf,"JPEG",quality=95)
prompt=("Esta es la contraetiqueta de una botella de vino (vista en la botella). Devuélvela como un ESCANEO PLANO: mismo diseño y distribución, misma tipografía "
 "(GVA'OT grande, GOFNA Reserve en cursiva, PINOT NOIR 2020 en rojo, líneas horizontales, texto hebreo a la izquierda abajo, sellos kosher, KP, código de barras "
 "a la izquierda, GOVERNMENT WARNING a la derecha), papel crema con textura, vista totalmente frontal, encuadre solo de la etiqueta, texto nítido. "
 "El texto debe ser EXACTAMENTE este, letra por letra:\n"
 "GVA'OT / GOFNA Reserve / PINOT NOIR 2020 / DRY RED WINE | SHOMRON REGION /\n"
 "Varieties: 100% Pinot Noir | Vineyards: Givat Harel, 720 meters above sea level | Barrel Aging: 12 months in French oak barrels from the Burgundy region | "
 "Characteristics: Fruity, elegant, and balanced. / Dr. Shivi Drori – Winemaker /\n"
 "PRODUCED AND BOTTLED BY: GVAOT WINERY LTD. ISRAEL, WWW.GVAOT-WINERY.COM, IMPORTED BY ALLIED IMPORTERS USA LTD. BROOKLYN NY 11205, 718-472-1155, "
 "WWW.ALLIEDIMPORTERS.COM / ALC. 12% BY VOLUME 750 ML, PRODUCT OF ISRAEL /\n"
 "(texto hebreo pequeño a la izquierda, como en la foto) / Kosher for Passover / Not Mevushal / sellos kosher redondos / KP / CONTAINS SULFITES / "
 "código de barras 7290018414323 /\n"
 "GOVERNMENT WARNING: (1) ACCORDING TO THE SURGEON GENERAL, WOMEN SHOULD NOT DRINK ALCOHOLIC BEVERAGES DURING PREGNANCY BECAUSE OF THE RISK OF BIRTH DEFECTS. "
 "(2) CONSUMPTION OF ALCOHOLIC BEVERAGES IMPAIRS YOUR ABILITY TO DRIVE A CAR OR OPERATE MACHINERY, AND MAY CAUSE HEALTH PROBLEMS.\n"
 "No agregues ni quites nada. Formato vertical.")
body={"contents":[{"parts":[{"text":prompt},{"inline_data":{"mime_type":"image/jpeg","data":base64.b64encode(buf.getvalue()).decode()}}]}],"generationConfig":{"responseModalities":["IMAGE"]}}
req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
with urllib.request.urlopen(req,timeout=240) as r: data=json.load(r)
for p in data["candidates"][0]["content"].get("parts",[]):
    inl=p.get("inlineData") or p.get("inline_data")
    if inl: Image.open(io.BytesIO(base64.b64decode(inl["data"]))).convert("RGB").save(out); print("listo",out); break
else: raise SystemExit("sin imagen")
