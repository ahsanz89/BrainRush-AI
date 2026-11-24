"""Marketing-style Play Store screenshots: 3D-tilted phone, glow, headline, pop-out cards.
Input: store/screenshots/*.png (raw renders).  Output: store/screenshots-marketing/*.png (1080x1920).
Run: python3 tools/make_store_art.py"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1080, 1920
BG = (15, 11, 36)
BOLD = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'; MED = '/usr/share/fonts/opentype/inter/Inter-Medium.otf'
def font(p, s): return ImageFont.truetype(p, s)

def coeffs(dst, src):
    A = []; B = []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()

def rounded(im, r):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], r, fill=255)
    out = im.convert('RGBA'); out.putalpha(m); return out

def phone(shot, width):
    """Screenshot inside a dark rounded bezel with a camera pill."""
    sw = width; sh = int(shot.height * sw / shot.width)
    scr = rounded(shot.resize((sw, sh), Image.LANCZOS), int(sw * 0.085))
    b = int(sw * 0.028); full = Image.new('RGBA', (sw + 2 * b, sh + 2 * b), (0, 0, 0, 0)); d = ImageDraw.Draw(full)
    d.rounded_rectangle([0, 0, full.width - 1, full.height - 1], int(sw * 0.11), fill=(28, 24, 58, 255), outline=(120, 108, 190, 255), width=3)
    full.alpha_composite(scr, (b, b))
    d.rounded_rectangle([full.width / 2 - sw * 0.07, b + sw * 0.022, full.width / 2 + sw * 0.07, b + sw * 0.022 + sw * 0.035], sw * 0.02, fill=(10, 8, 24, 255))
    return full

def tilt(im, yaw=0.07, rot=-7):
    """Fake 3D: perspective squeeze on one side, then rotate."""
    w, h = im.size; m = 140; canvas = (w + 2 * m, h + 2 * m); d = int(h * yaw)
    dst = [(m, m + d), (m + w, m), (m + w, m + h), (m, m + h - d)]
    src = [(0, 0), (w, 0), (w, h), (0, h)]
    out = im.transform(canvas, Image.PERSPECTIVE, coeffs(dst, src), Image.BICUBIC)
    return out.rotate(rot, resample=Image.BICUBIC, expand=True)

def shadow(im, off=(40, 60), blur=45, alpha=170):
    a = im.split()[-1].point(lambda v: int(v * alpha / 255)); sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); sh.putalpha(a)
    sh = sh.filter(ImageFilter.GaussianBlur(blur)); out = Image.new('RGBA', (im.width + 120, im.height + 120), (0, 0, 0, 0)); out.alpha_composite(sh, (60 + off[0], 60 + off[1])); out.alpha_composite(im, (60, 60)); return out

def backdrop(accent):
    g = np.zeros((H, W, 3), float); top = np.array([min(255, int(c * .38 + 15)) for c in accent]); bot = np.array(BG)
    t = np.linspace(0, 1, H)[:, None, None] ** 0.8; g[:] = top * (1 - t) + bot * t
    im = Image.fromarray(g.astype('uint8')).convert('RGBA'); ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.ellipse([-260, 1100, 520, 1880], fill=accent + (55,)); d.ellipse([650, 780, 1330, 1460], fill=(46, 230, 166, 38)); d.ellipse([700, -250, 1300, 350], fill=(255, 255, 255, 14))
    im.alpha_composite(ov.filter(ImageFilter.GaussianBlur(60)))
    dots = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(dots)
    for x in range(40, W, 54):
        for y in range(40, 520, 54): dd.ellipse([x, y, x + 3, y + 3], fill=(255, 255, 255, 22))
    im.alpha_composite(dots); return im

def headline(im, lines, sub, accent):
    d = ImageDraw.Draw(im); size = 108
    widest = lambda f: max(sum(d.textlength(t, font=f) for t, _ in segs) for segs in lines)
    while widest(font(BOLD, size)) > W - 150 and size > 60: size -= 4
    f = font(BOLD, size); y = 100
    for segs in lines:
        x = 70
        for text, hot in segs:
            d.text((x, y), text, font=f, fill=(accent_light(accent) if hot else (244, 242, 255)) + (255,)); x += d.textlength(text, font=f)
        y += int(size * 1.17)
    d.text((74, y + 12), sub, font=font(MED, 44), fill=(190, 184, 228, 255))

def accent_light(a): return tuple(min(255, int(c * .55 + 115)) for c in a)

def popout(shot, box, scale, rot, r=44):
    c = shot.crop(box); c = c.resize((int(c.width * scale), int(c.height * scale)), Image.LANCZOS); c = rounded(c, r)
    ring = Image.new('RGBA', c.size, (0, 0, 0, 0)); ImageDraw.Draw(ring).rounded_rectangle([0, 0, c.width - 1, c.height - 1], r, outline=(255, 255, 255, 90), width=3); c.alpha_composite(ring)
    c = shadow(c, off=(20, 38), blur=28, alpha=190); return c.rotate(rot, resample=Image.BICUBIC, expand=True)

def paste_c(im, layer, cx, cy): im.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)))

# (file, headline lines, subline, accent rgb, popout crop box in 1080x2160 shot, popout scale, rot, popout centre)
S = [
 ('02-home', [[('Train your ', 0), ('brain', 1)], [('every day', 0)]], 'Daily challenge, streaks and XP', (139, 109, 255), (40, 170, 1040, 800), 0.55, 4, (320, 1600)),
 ('05-gameplay', [[('Puzzles that ', 0), ('click', 1)]], 'Ten categories, from logic to memory', (52, 195, 255), (40, 230, 1040, 600), 0.56, -4, (770, 1560)),
 ('06-feedback', [[('Learn from', 0)], [('every ', 0), ('answer', 1)]], 'Clear explanations, friendly feedback', (46, 230, 166), (40, 1500, 1040, 2150), 0.52, 3, (320, 1600)),
 ('10-memory', [[('Test your ', 0), ('memory', 1)]], 'Watch the tiles, then repeat the order', (255, 122, 182), (60, 300, 1020, 1260), 0.40, -3, (790, 1560)),
 ('07-results', [[('Celebrate', 0)], [('every ', 0), ('win', 1)]], 'XP, levels and achievements', (255, 176, 32), (40, 30, 1040, 700), 0.48, 4, (310, 1600)),
 ('08-progress', [[('Watch your', 0)], [('progress ', 0), ('grow', 1)]], 'Weekly XP and accuracy by category', (139, 109, 255), (40, 720, 1040, 1320), 0.55, -3, (780, 1580)),
 ('03-train', [[('Ten ways to', 0)], [('exercise ', 0), ('your mind', 1)]], 'Logic, math, words, attention and more', (255, 138, 91), (40, 700, 1040, 1250), 0.55, 4, (320, 1600)),
 ('09-achievements', [[('Unlock ', 0), ('15', 1)], [('achievements', 1)]], 'Streaks, perfect rounds and more', (94, 225, 225), (40, 400, 1040, 760), 0.55, -4, (780, 1580)),
]
for i, (name, lines, sub, acc, box, sc, rot, pc) in enumerate(S, 1):
    shot = Image.open(f'store/screenshots/{name}.png').convert('RGB')
    im = backdrop(acc); headline(im, lines, sub, acc)
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(glow).ellipse([150, 650, 930, 1750], fill=acc + (95,)); im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(90)))
    ph = shadow(tilt(phone(shot, 640), yaw=0.04, rot=-5 if i % 2 else 5)); paste_c(im, ph, W / 2 + (45 if i % 2 else -45), 1190)
    paste_c(im, popout(shot, box, sc, rot), *pc)
    im.convert('RGB').save(f'store/screenshots-marketing/{i:02d}-{name[3:]}.png'); print(i, name)
