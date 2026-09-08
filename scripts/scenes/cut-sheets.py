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

def peel(a, n=14):
    """a cut piece may carry a sliver of the sheet's cell frame on its border: peel pale border lines off,
    looking past nearly empty outer lines to the first line that carries paint"""
    for _ in range(n):
        rgb, al = a[..., :3], a[..., 3] > 40
        pale = al & (rgb.min(axis=2) > 150) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 60)
        cut = False
        for side in range(4):
            lines = [(al, pale), (al[::-1], pale[::-1]), (al.T, pale.T), (al.T[::-1], pale.T[::-1])][side]
            k = 0
            while k < min(6, lines[0].shape[0]) and lines[0][k].sum() < 12: k += 1
            if k >= min(6, lines[0].shape[0]): continue
            need = 0.85 if side == 1 else 0.55   # a piece's bottom is often a pale stone floor: only peel it when it is all frame
            if lines[1][k].sum() > need * lines[0][k].sum():
                a = [a[k + 1:], a[:a.shape[0] - k - 1], a[:, k + 1:], a[:, :a.shape[1] - k - 1]][side]; cut = True; break
        if not cut: break
    return a

def bleed(a):
    """transparent pixels keep the paint colour of their nearest opaque neighbour, so scaling never blends towards white"""
    al = a[..., 3] > 8
    if al.all() or not al.any(): return a
    _, idx = ndimage.distance_transform_edt(~al, return_indices=True)
    out = a.copy()
    out[..., :3] = a[..., :3][idx[0], idx[1]]
    return out

def feather_cuts(a, w=12):
    """a piece cut off by the sheet's cell boundary has a straight opaque border: dissolve that edge instead of
    showing a slab, so the piece can move in front of the scene without looking cropped"""
    a = a.copy()
    al = a[..., 3] > 40
    H, W = al.shape
    w = min(w, H // 3, W // 3)
    if w < 2: return a
    ramp = (np.arange(w) + 1) / (w + 1)
    if al[0].mean() > 0.55: a[:w, :, 3] *= ramp[:, None]
    if al[-1].mean() > 0.55: a[H - w:, :, 3] *= ramp[::-1][:, None]
    if al[:, 0].mean() > 0.55: a[:, :w, 3] *= ramp[None, :]
    if al[:, -1].mean() > 0.55: a[:, W - w:, 3] *= ramp[::-1][None, :]
    return a

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
        out.append((y0 // 40, x0, feather_cuts(trim(peel(trim(piece))))))
    out.sort(key=lambda t: (t[0], t[1]))
    return [p for _, _, p in out]

manifest = {}
for scene in SCENES:
    d = os.path.join(src, scene); od = os.path.join(out, scene); os.makedirs(od, exist_ok=True)
    load = lambda n: np.asarray(Image.open(os.path.join(d, n)).convert("RGBA")).astype(np.float32)
    entry = {}
    def save(a, name):
        Image.fromarray(np.clip(bleed(a), 0, 255).astype(np.uint8), "RGBA").save(os.path.join(od, name + ".png"), optimize=True)
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
    def cut_dividers(a, reach=26):
        """some crops include the sheet's white cell divider with a sliver of the neighbouring cell beyond it:
        crop to the inside of any full-length bright line near an edge"""
        bright = a[..., :3].mean(axis=2) > 205
        cols, rows = bright.mean(axis=0), bright.mean(axis=1)
        W, H = a.shape[1], a.shape[0]
        lc = [x for x in range(min(reach, W)) if cols[x] > 0.85]; rc = [x for x in range(max(0, W - reach), W) if cols[x] > 0.85]
        tr = [y for y in range(min(reach, H)) if rows[y] > 0.85]; br = [y for y in range(max(0, H - reach), H) if rows[y] > 0.85]
        x0 = max(lc) + 2 if lc else 0; x1 = min(rc) - 1 if rc else W
        y0 = max(tr) + 2 if tr else 0; y1 = min(br) - 1 if br else H
        return a[y0:y1, x0:x1]
    back = cut_dividers(trim_frame(crop_caption(load("02_midground.png"))))[1:-1, 1:-1]; back[..., 3] = 255; save(back, "back")
    cover = cut_dividers(trim_frame(crop_caption(load("01_background.png"))))[2:-2, 2:-2]; cover[..., 3] = 255; save(cover, "cover")
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
