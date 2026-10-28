import base64, io, json, sys, urllib.request
from PIL import Image
MODEL="gemini-3-pro-image"
src, out = sys.argv[1], sys.argv[2]
im=Image.open(src).convert("RGB"); buf=io.BytesIO(); im.save(buf,"JPEG",quality=95)
prompt=("Esta es la fotografía de la contraetiqueta REAL de una botella de vino, tomada en ángulo. Devuélvela como un ESCANEO PLANO de la misma etiqueta: "
 "mismo diseño y distribución (GODIN grande a la izquierda arriba; a la derecha DOC DOURO en naranja, RED WINE RESERVA 2022 y el casco dorado; línea naranja; "
 "párrafos; GOVERNMENT WARNING abajo a la izquierda; 750 ml. 13,5% Alc. by vol. y CA CRV a la derecha; sello redondo DOP DOURO GARANTIA WVH 83391 abajo izquierda; "
 "texto vertical a la derecha; OU-P; Kosher for Passover; Non Mevushal; código de barras vertical), mismo papel blanco, vista totalmente frontal, "
 "texto nítido. El texto debe ser EXACTAMENTE este, letra por letra:\n"
 "GODIN / DOC DOURO / RED WINE RESERVA 2022 / Reccua Winery Godin Red Blend Douro valley portugal /\n"
 "Reccua Winery is a renowned name in the Portuguese wine industry. Located in the heart of one of the oldest wine regions in the world - the Douro Valley - "
 "the winery boasts state-of-the-art production facilities alongside ancient winemaking traditions passed down through generations within the family. "
 "Set against the valley's natural beauty backdrop, the vineyards are meticulously managed under regional traditions to cultivate the finest grapes and "
 "ensure the highest quality in every bottle. /\n"
 "The Godin Red Reserva blends indigenous grape verities, 35% Touriga Nacional, 35% Tinta Roriz, 30% Touriga Franca. This wine was aged for 12 months in "
 "500-liter Portuguese oak barrels, resulting in a well-balanced, elegant profile. /\n"
 "PRODUCED AND BOTTLED BY: PORTO RECCUA VINHOS S.A. RUA DA LOUSADA - GODIM 5050-262 PESO DA RÉGUA, PORTUGAL. IMPORTED FOR: KIDDUSH.CO.IL / "
 "IMPORTED BY: Allied Imports USA, Ltd. Brooklyn, N.Y. 11205 718-472-1155 www.Alliedimporters.com /\n"
 "GOVERNMENT WARNING: (1) ACCORDING TO THE SURGEON GENERAL, WOMEN SHOULD NOT DRINK ALCOHOLIC BEVERAGES DURING PREGNANCY BECAUSE OF THE RISK OF BIRTH DEFECTS. "
 "(2) CONSUMPTION OF ALCOHOLIC BEVERAGES IMPAIRS YOUR ABILITY TO DRIVE A CAR OR OPERATE MACHINERY, AND MAY CAUSE HEALTH PROBLEMS. /\n"
 "750 ml. 13,5% Alc. by vol. / CA CRV / DRY RED WINE PRODUCT OF PORTUGAL CONTAINS SULFITES (vertical) / Kosher for Passover / Non Mevushal /\n"
 "Instituto dos Vinhos do Douro e do Porto, I.P. / DL n.º 94/2012 / > 0.50l e ≤ 1.00l / Certificado e controlado pelo IVDP, I.P. / código de barras 5601176003462\n"
 "No agregues ni quites nada. Formato vertical, solo la etiqueta.")
body={"contents":[{"parts":[{"text":prompt},{"inline_data":{"mime_type":"image/jpeg","data":base64.b64encode(buf.getvalue()).decode()}}]}],"generationConfig":{"responseModalities":["IMAGE"]}}
req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
with urllib.request.urlopen(req,timeout=240) as r: data=json.load(r)
for p in data["candidates"][0]["content"].get("parts",[]):
    inl=p.get("inlineData") or p.get("inline_data")
    if inl: Image.open(io.BytesIO(base64.b64decode(inl["data"]))).convert("RGB").save(out); print("listo",out); break
else: raise SystemExit("sin imagen")
