"""Dibuja un EAN-13 real (barras + dígitos) y lo pega, vertical, sobre la zona de código de barras de una etiqueta."""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
L={"0":"0001101","1":"0011001","2":"0010011","3":"0111101","4":"0100011","5":"0110001","6":"0101111","7":"0111011","8":"0110111","9":"0001011"}
G={k:v[::-1].translate(str.maketrans("01","10")) for k,v in L.items()}  # G = reverse of R; R = complement of L
R={k:v.translate(str.maketrans("01","10")) for k,v in L.items()}
G={k:R[k][::-1] for k in L}
PAR={"0":"LLLLLL","1":"LLGLGG","2":"LLGGLG","3":"LLGGGL","4":"LGLLGG","5":"LGGLLG","6":"LGGGLL","7":"LGLGLG","8":"LGLGGL","9":"LGGLGL"}
def bits(code):
    assert len(code)==13
    first,left,right=code[0],code[1:7],code[7:]
    s="101"+"".join((L if p=="L" else G)[d] for d,p in zip(left,PAR[first]))+"01010"+"".join(R[d] for d in right)+"101"
    return s
def render(code,module=3,height=120,font=None):
    b=bits(code); w=len(b)*module+2*module*9
    im=Image.new("L",(w,height+36),255); d=ImageDraw.Draw(im)
    x=module*9
    for i,c in enumerate(b):
        tall = i<3 or 45<=i<50 or i>=len(b)-3
        if c=="1": d.rectangle((x,0,x+module-1,height+(10 if tall else 0)),fill=0)
        x+=module
    f=font or ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",int(module*7))
    d.text((2,height+2),code[0],font=f,fill=0)
    d.text((module*9+module*3+4,height+12),code[1:7],font=f,fill=0)
    d.text((module*9+module*50+4,height+12),code[7:],font=f,fill=0)
    return im
def find_barcode(lab):
    a=np.asarray(lab.convert("L")).astype(int)
    H,W=a.shape
    # vertical barcode: horizontal bars => strong vertical variation; look in right 30% of label
    x_from=int(W*0.68)
    var=np.abs(np.diff(a[:, x_from:],axis=0)).mean(axis=1)
    rows=np.where(var>18)[0]
    y0,y1=rows.min(),rows.max()
    colvar=np.abs(np.diff(a[y0:y1, x_from:],axis=0)).mean(axis=0)
    cols=np.where(colvar>18)[0]+x_from
    return cols.min(),y0,cols.max(),y1
if __name__=="__main__":
    src,out,code=sys.argv[1],sys.argv[2],sys.argv[3]
    lab=Image.open(src).convert("RGB")
    x0,y0,x1,y1=find_barcode(lab); print("barcode zone",x0,y0,x1,y1)
    bc=render(code).rotate(-90,expand=True)  # digits on the left, reading downward
    # clear zone (white) a bit wider to cover old digits, then paste
    pad=14
    d=ImageDraw.Draw(lab); d.rectangle((x0-pad-20,y0-6,x1+4,y1+6),fill=(246,246,243))
    th=y1-y0+1; tw=int(bc.width*th/bc.height)
    bc=bc.resize((tw,th),Image.LANCZOS)
    lab.paste(bc.convert("RGB"),(x1+4-tw,y0))
    lab.save(out)
