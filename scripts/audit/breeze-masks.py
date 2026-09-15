"""Render every breeze mask (the only crops taken from finished paintings) as crop | isolated foreground | repaired background,
for wide and portrait, so a reviewer can see whether a face, wall or shelf moves with the hanging detail.
Run: uv run --with pillow --with numpy --with scipy scripts/audit/breeze-masks.py <out dir>"""
import sys, re, os
import numpy as np
from PIL import Image
from scipy import ndimage
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
src = open('src/fw/scene-ambience.ts').read()
patches = []
cur = None
for line in src.splitlines():
    m = re.match(r"\s*(\w+): \{kind:'breeze'", line) or re.match(r"\s*(\w+): \[", line)
    if m and 'breeze' not in line: cur = m.group(1); continue
    if "kind:'breeze'" in line:
        room = m.group(1) if m else cur
        rects = {o: [float(v) for v in re.search(o + r":\[([^\]]+)\]", line).group(1).split(',')] for o in ('wide', 'phone') if re.search(o + r":\[", line)}
        subj = re.search(r"source:'([^']+)'", line); patches.append((room, subj.group(1) if subj else 'chilli', rects))
def key(subject, r, g, b):
    if subject == 'chilli': return (r > 55) & (r - g > 24) & (r > g * 1.38) & (r > b * 1.16)
    mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); ch = mx - mn
    if subject == 'grape':
        with np.errstate(divide='ignore', invalid='ignore'):
            hue = np.where(ch == 0, 0, np.where(mx == r, 60 * (((g - b) / np.where(ch == 0, 1, ch)) % 6), np.where(mx == g, 60 * ((b - r) / np.where(ch == 0, 1, ch) + 2), 60 * ((r - g) / np.where(ch == 0, 1, ch) + 4))))
            return (mx > 35) & (mx < 215) & (ch / np.where(mx == 0, 1, mx) > .165) & ((hue < 25) | (hue > 310))
    if subject == 'garlic': return (r > 145) & (g > 120) & (b > 82) & (r - g < 58) & (g - b < 58)
    if subject == 'bell': return (mx < 155) & (r > g * .9) & (g > b * .85)
    if subject == 'leaves': return (g > 55) & (g - r > 10) & (g > b * 1.08)
    return (r > 55) & (r - g > 24) & (r > g * 1.38) & (r > b * 1.16)   # red-tassel falls back to chilli in the engine
for room, subject, rects in patches:
    folder = 'historical_tower' if room == 'tower' else room
    for o, rect in rects.items():
        f = f'public/scenes/{folder}/{"wide" if o == "wide" else "portrait"}.jpg'
        im = np.asarray(Image.open(f).convert('RGB')).astype(np.float32); H, W = im.shape[:2]
        x0, y0, x1, y1 = int(rect[0] * W), int(rect[1] * H), int(rect[2] * W), int(rect[3] * H)
        crop = im[y0:y1, x0:x1]; r, g, b = crop[..., 0], crop[..., 1], crop[..., 2]
        mask = key(subject, r, g, b)
        for _ in range(3 if subject == 'grape' else 2 if subject == 'leaves' else 1): mask = ndimage.binary_dilation(mask, structure=np.ones((3, 3)))
        if subject in ('grape', 'bell', 'leaves'):
            lab, n = ndimage.label(mask, structure=[[0,1,0],[1,1,1],[0,1,0]])
            if n: sizes = ndimage.sum(mask, lab, range(1, n + 1)); mask = lab == (1 + int(np.argmax(sizes)))
        grey = np.full_like(crop, 128); fg = np.where(mask[..., None], crop, grey)
        bg = crop.copy()
        for y in range(mask.shape[0]):
            row = mask[y]; x = 0
            while x < len(row):
                if not row[x]: x += 1; continue
                s = x
                while x < len(row) and row[x]: x += 1
                e = x - 1; l = max(0, s - 1); rr = min(len(row) - 1, e + 1)
                for px in range(s, e + 1):
                    mix = (px - s + 1) / (e - s + 2); bg[y, px] = crop[y, l] * (1 - mix) + crop[y, rr] * mix
        scale = max(1, int(360 / max(1, crop.shape[0])))
        sheet = np.concatenate([crop, np.full((crop.shape[0], 6, 3), 255), fg, np.full((crop.shape[0], 6, 3), 255), bg], axis=1)
        img = Image.fromarray(sheet.astype(np.uint8)); img = img.resize((img.width * scale, img.height * scale), Image.NEAREST)
        img.save(f'{out}/{room}-{o}-{subject}.png')
        cov = mask.mean()
        print(f'{room:18s} {o:5s} {subject:10s} box={x1-x0}x{y1-y0}px coverage={cov:.2f}')
