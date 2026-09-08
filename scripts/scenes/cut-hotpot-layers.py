"""Turn the painted hotpot sheets (white-background PNG strips with printed captions) into transparent layers and sprites.
Run: uv run --with pillow --with numpy --with scipy scripts/scenes/cut-hotpot-layers.py <unzipped dir> public/scenes/hotpot
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

def load(name, box):
    im = Image.open(os.path.join(src, name)).convert("RGBA").crop(box)
    return np.asarray(im).astype(np.float32)

def key_white(a, lo=26, hi=120):
    """alpha from distance to white, eroded by a pixel so no pale fringe survives; un-premultiply the edge colour"""
    rgb = a[..., :3]
    dist = 255 - rgb.min(axis=2)
    alpha = np.clip((dist - lo) / (hi - lo), 0, 1)
    alpha = ndimage.minimum_filter(alpha, size=2)
    alpha = ndimage.uniform_filter(alpha, size=2)
    out_rgb = rgb.copy()
    m = (alpha > 0.02) & (alpha < 0.999)
    al = alpha[m][:, None]
    out_rgb[m] = np.clip((rgb[m] - (1 - al) * 255) / np.maximum(al, 0.05), 0, 255)
    res = np.concatenate([out_rgb, (alpha * 255)[..., None]], axis=2)
    return res

def bleed(a):
    """transparent pixels keep the paint colour of their nearest opaque neighbour, so scaling never blends towards white"""
    al = a[..., 3] > 8
    if al.all() or not al.any(): return a
    _, idx = ndimage.distance_transform_edt(~al, return_indices=True)
    out = a.copy()
    out[..., :3] = a[..., :3][idx[0], idx[1]]
    return out

def trim(a, thr=4):
    m = a[..., 3] > thr
    ys, xs = np.where(m)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def save(a, name):
    Image.fromarray(np.clip(bleed(a), 0, 255).astype(np.uint8), "RGBA").save(os.path.join(out, name), optimize=True)
    print(name, a.shape[1], "x", a.shape[0])

def sprites(a, min_area=400, pad=2, dil=6):
    """connected pieces of the keyed sheet, left to right"""
    m = a[..., 3] > 40
    m = ndimage.binary_dilation(m, iterations=dil)
    lab, n = ndimage.label(m)
    pieces = []
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if len(ys) < min_area: continue
        y0, y1, x0, x1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + 1 + pad), max(0, xs.min() - pad), min(a.shape[1], xs.max() + 1 + pad)
        piece = a[y0:y1, x0:x1].copy()
        keep = (lab[y0:y1, x0:x1] == i)
        piece[..., 3] *= keep
        pieces.append((x0, trim(piece)))
    pieces.sort(key=lambda p: p[0])
    return [p for _, p in pieces]

# 1 back wall: opaque painting, trim the white frame and the caption sliver
wall = load("01_back_wall.png", (0, 10, 1048, 432))
m = wall[..., :3].min(axis=2) < 235
ys, xs = np.where(m); wall = wall[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
wall[..., 3] = 255
save(wall, "wall.png")

# 2 table with diners, 3 fence: keyed
save(trim(key_white(load("02_table_with_diners.png", (0, 34, 1048, 358)))), "table.png")
fence = trim(key_white(load("03_foreground_frames.png", (0, 42, 1048, 218))))
fence[:36, :, 3] *= (np.arange(36) / 36)[:, None]   # the vines were cut by the sheet edge: dissolve the cut
save(fence, "fence.png")

# 4 hanging decor → sprites
def split(a, cuts, names):
    xs = [0] + cuts + [a.shape[1]]
    for i, n in enumerate(names): save(trim(a[:, xs[i]:xs[i + 1]]), f"{n}.png")
decor = trim(key_white(load("04_hanging_lanterns_decor.png", (0, 30, 488, 312))))
split(decor, [119, 171, 256, 344], ["lantern-a", "garlic", "chilli", "lantern-b", "banner"])
# 5 steam and leaves: leaves are the reddish pieces
atm = load("05_atmospheric_steam.png", (0, 24, 488, 268))
rgb = atm[..., :3]
red = (rgb[..., 0] > rgb[..., 1] + 40) & (rgb[..., 0] > rgb[..., 2] + 40)
leaves = atm.copy(); leaves[..., 3] = np.where(red, 255, 0)
leaves = key_white(atm) ; leaves[..., 3] *= ndimage.binary_dilation(red, iterations=2)
for i, p in enumerate(sprites(leaves, min_area=60, dil=2)): save(p, f"leaf-{i}.png")
# 6 tabletop props: one sprite sheet, keyed
save(trim(key_white(load("06_foreground_tabletop_props.png", (0, 0, 488, 182)))), "props-table.png")
# 7 side props → sprites
side = trim(key_white(load("07_foreground_side_props.png", (0, 22, 488, 206))))
split(side, [150, 292, 384], ["jar", "sign", "stool", "lantern-c"])
