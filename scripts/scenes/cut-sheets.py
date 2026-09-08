"""Cut the painted scene sheets (food_world_scene_assets: per scene 01 background, 02 midground, 03 characters,
04 hanging props, 05 foreground — small crops with printed captions and a painted checkerboard "transparency")
into real transparent layers and sprites, and write src/fw/scenes.json with their sizes.
Run: uv run --with pillow --with numpy --with scipy scripts/scenes/cut-sheets.py <assets dir> public/scenes src/fw/scenes.json
"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage

src, out, manifest_path = sys.argv[1], sys.argv[2], sys.argv[3]
SCENES = ["noodle_shop", "teahouse", "market", "home_kitchen", "historical_tower"]

def neutral_light(rgb, lo=170, spread=22):
    return (rgb.min(axis=2) > lo) & ((rgb.max(axis=2) - rgb.min(axis=2)) < spread)

def crop_caption(a):
    """drop leading/trailing rows that are printed captions (paper with dark text, no colour) and paper frames"""
    rgb = a[..., :3]
    paper = neutral_light(rgb, 200, 20)
    sat = (rgb.max(axis=2) - rgb.min(axis=2)) > 34
    def is_caption(row):
        return paper[row].mean() > 0.45 and sat[row].mean() < 0.03
    y0 = 0
    while y0 < a.shape[0] - 10 and is_caption(y0): y0 += 1
    y1 = a.shape[0]
    while y1 > y0 + 10 and is_caption(y1 - 1): y1 -= 1
    cols = paper.mean(axis=0)
    x0 = 0
    while x0 < a.shape[1] - 10 and cols[x0] > 0.85: x0 += 1
    x1 = a.shape[1]
    while x1 > x0 + 10 and cols[x1 - 1] > 0.85: x1 -= 1
    return a[y0:y1, x0:x1]

def key_backdrop(a):
    """the painted checkerboard/white backdrop: neutral light pixels connected to the border become transparent"""
    rgb = a[..., :3]
    bg = neutral_light(rgb, 168, 26)
    lab, n = ndimage.label(bg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    border.discard(0)
    mask = np.isin(lab, list(border))
    # thin dark checker lines survive inside the backdrop: also drop light-ish pixels adjacent to the backdrop
    near = ndimage.binary_dilation(mask, iterations=2) & neutral_light(rgb, 140, 40)
    mask |= near
    alpha = (~mask).astype(np.float32)
    alpha = ndimage.minimum_filter(alpha, size=2)
    alpha = ndimage.uniform_filter(alpha, size=2)
    res = a.copy(); res[..., 3] = alpha * 255
    return res

def trim(a, thr=8):
    m = a[..., 3] > thr
    ys, xs = np.where(m)
    if len(ys) == 0: return a
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def pieces_of(a, min_area=320, min_h=16, dil=2):
    """connected painted pieces of a keyed sheet, minus caption text (small dark scraps), ordered top-left to bottom-right"""
    m = a[..., 3] > 30
    lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=dil))
    out = []
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if len(ys) < min_area or ys.max() - ys.min() < min_h: continue
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        piece = a[y0:y1, x0:x1].copy(); piece[..., 3] *= (lab[y0:y1, x0:x1] == i)
        out.append((y0 // 40, x0, trim(piece)))
    out.sort(key=lambda t: (t[0], t[1]))
    return [p for _, _, p in out]

manifest = {}
for scene in SCENES:
    d = os.path.join(src, scene); od = os.path.join(out, scene); os.makedirs(od, exist_ok=True)
    load = lambda n: np.asarray(Image.open(os.path.join(d, n)).convert("RGBA")).astype(np.float32)
    entry = {}
    def save(a, name):
        Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA").save(os.path.join(od, name + ".png"), optimize=True)
        entry[name] = [int(a.shape[1]), int(a.shape[0])]
    def trim_frame(a, n=40):
        """paintings from the sheet keep slivers of the pale frame and its border line: peel paper lines off every edge"""
        for _ in range(n):
            paper = neutral_light(a[..., :3], 196, 26)
            cut = False
            if paper[0].mean() > 0.3: a = a[1:]; cut = True
            if paper[-1].mean() > 0.3: a = a[:-1]; cut = True
            if paper[:, 0].mean() > 0.3: a = a[:, 1:]; cut = True
            if paper[:, -1].mean() > 0.3: a = a[:, :-1]; cut = True
            if not cut: break
        return a
    back = trim_frame(crop_caption(load("02_midground.png")))[1:-1, 1:-1]; back[..., 3] = 255; save(back, "back")
    cover = trim_frame(crop_caption(load("01_background.png")))[2:-2, 2:-2]; cover[..., 3] = 255; save(cover, "cover")   # and the last bright sliver of frame
    for i, p in enumerate(pieces_of(key_backdrop(load("04_props_decor.png")))): save(p, f"prop-{i}")
    for i, p in enumerate(pieces_of(key_backdrop(load("05_foreground.png")))): save(p, f"front-{i}")
    manifest[scene] = entry
    print(scene, {k: v for k, v in entry.items()})
    # a contact sheet of the pieces, for review
    pieces = [(k, Image.open(os.path.join(od, k + ".png"))) for k in entry if k.startswith(("prop", "front"))]
    if pieces:
        W = sum(p.width + 12 for _, p in pieces); H = max(p.height for _, p in pieces) + 20
        sheet = Image.new("RGBA", (W, H), (60, 120, 60, 255)); x = 6
        for k, p in pieces: sheet.paste(p, (x, 10), p); x += p.width + 12
        sheet.save(os.path.join(".data", f"contact-{scene}.png"))
json.dump(manifest, open(manifest_path, "w"), indent=1)
