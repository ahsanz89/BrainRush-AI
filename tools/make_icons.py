"""Generates app icons and Play Store graphics from code (no third-party assets). Run: python3 tools/make_icons.py"""
from PIL import Image, ImageDraw, ImageFont
BG=(15,11,36,255); VIOLET=(139,109,255,255); MINT=(46,230,166,255); WHITE=(255,255,255,255)
SS=4
def mark(size, scale, ring, bolt, bg=None):
    S=size*SS; im=Image.new('RGBA',(S,S),bg or (0,0,0,0)); d=ImageDraw.Draw(im)
    def P(x,y): return (S/2+(x-512)*scale*S/1024, S/2+(y-512)*scale*S/1024)
    r=330*scale*S/1024; w=int(56*scale*S/1024); cx,cy=P(512,512)
    d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=ring,width=w)
    d.polygon([P(*p) for p in [(572,230),(372,548),(494,548),(446,794),(664,462),(536,462)]],fill=bolt)
    import math
    for (x,y) in [(512+420*math.cos(math.radians(a)),512+420*math.sin(math.radians(a))) for a in (-35,25,150)]:
        px,py=P(x,y); rr=18*scale*S/1024; d.ellipse([px-rr,py-rr,px+rr,py+rr],fill=ring)
    return im.resize((size,size),Image.LANCZOS)
mark(1024,1.0,VIOLET,MINT,BG).convert('RGB').save('assets/icon.png')
Image.new('RGBA',(1024,1024),BG).save('assets/android-icon-background.png')
mark(1024,0.62,VIOLET,MINT).save('assets/android-icon-foreground.png')
mark(1024,0.62,WHITE,WHITE).save('assets/android-icon-monochrome.png')
mark(1024,0.9,VIOLET,MINT).save('assets/splash-icon.png')
mark(48,1.0,VIOLET,MINT,BG).save('assets/favicon.png')
mark(512,1.0,VIOLET,MINT,BG).save('store/graphics/play-icon-512.png')

# Feature graphic 1024x500
W,H=1024,500; im=Image.new('RGBA',(W*2,H*2),BG); d=ImageDraw.Draw(im)
ov=Image.new('RGBA',im.size,(0,0,0,0)); od=ImageDraw.Draw(ov)
for (x,y,r,c) in [(930,60,200,(139,109,255,45)),(990,440,150,(46,230,166,38)),(40,470,110,(139,109,255,30))]:
    od.ellipse([(x-r)*2,(y-r)*2,(x+r)*2,(y+r)*2],fill=c)
im.alpha_composite(ov); d=ImageDraw.Draw(im)
m=mark(320*2,1.0,VIOLET,MINT,None); im.alpha_composite(m,(60*2,90*2))
f1=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf',92*2); f2=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Medium.otf',32*2)
d.text((420*2,150*2),'BrainRush AI',font=f1,fill=(244,242,255,255))
d.text((424*2,275*2),'Train your brain.',font=f2,fill=(179,173,219,255))
d.text((424*2,320*2),'Challenge yourself. Grow every day.',font=f2,fill=(179,173,219,255))
im.resize((W,H),Image.LANCZOS).convert('RGB').save('store/graphics/feature-graphic-1024x500.png')
print('ok')
