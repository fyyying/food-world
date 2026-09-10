"""Prepare Yingying's painted room files: composed paintings (wide + portrait) become JPEGs per room, and every
prop on a white background becomes a transparent, trimmed, edge-bled sprite in public/scenes/props/.
Run: uv run --with pillow --with numpy --with scipy scripts/scenes/cut-props.py "<folder>" public/scenes src/fw/scenes-props.json
"""
import sys, os, json, re
import numpy as np
from PIL import Image
from scipy import ndimage

src, out, manifest_path = sys.argv[1], sys.argv[2], sys.argv[3]
ROOMS = {"home kitchen": "home_kitchen", "market detail": "market", "poet tower": "historical_tower", "tea house": "teahouse", "noodle shop": "noodle_shop", "hotpot": "hotpot",
         "bao": "bao_shop", "bridge": "stone_bridge", "crab": "crab_pond", "jiangnan home": "jiangnan_home", "lotus garden": "lotus_garden", "rice wine": "rice_wine", "river market": "river_market", "riverside restaurant": "riverside_restaurant", "tea hill": "tea_hill"}
# Xinjiang batch (2026-09-10, ~/Downloads/additional game asset/xinjiang): the paintings are named by subject, not by room
if "xinjiang" in src.lower():
    ROOMS = {"kebab": "evening_feast", "xijiang": "kebab_grill", r"codex image sep 10, 2026, 02_14_30 pm": "kebab_grill", "naan": "naan_bakery", "naan2": "naan_bakery", "rice": "polo_kitchen", "noodles": "laghman_shop",
             "oasis market": "oasis_bazaar", "family": "grape_courtyard", "fruits": "oasis_field", "tea": "chaikhana", "cooking": "xj_home", "river": "tianshan", "food": "caravan_stop"}
# nicer library names for a few delivered files
RENAME = {"driver-shrimp": "river-shrimp", "gui-hua": "osmanthus", "tea-2": "tea-cup", "crab-prop": "hairy-crab", "lotus-fruit": "lotus-pod", "cooked-rice": "rice-bowl", "rice": "rice-sheaf", "biard": "swallow", "cat-2": "cat-sleeping", "curtain": "bamboo-blind", "curtain-2": "noren", "eat-noodle": "noodle-eater", "jasmin-flower": "jasmine", "noodle-spoon": "noodle-strainer", "cooking-noodle": "noodle-pot", "hotpot-smoke": "smoke-1",
          # Xinjiang: avoid clashes with the Sichuan/Jiangnan library and name things by what they are
          "noodle-bowl": "laghman-bowl", "rice-bowl": "rice-bowl-xj", "stool": "stool-xj", "tree": "poplar-tree", "oven": "tonur", "street-friuit-stand": "fruit-stand", "chilli": "chilli-xj",
          "bbq": "kebab-grill", "empty-bbq": "kebab-grill-empty", "people-bbq": "kebab-griller", "skewer": "kebab-plate", "raw-skewer": "kebab-raw", "lamb-rice": "polo", "lamb-rice-cooking": "polo-kazan", "cooking-rice": "kazan",
          "baked-bao": "samsa", "roof-stand": "awning", "dry-wall": "mud-wall", "water-stream": "karez", "grape-tree": "grape-arbour", "table-of-food": "dastikhan", "fresh-noodles": "laghman-pull", "dough-roller": "rolling-pin"}
MAX_SPRITE = 960   # px on the long side; plenty for a 1600-wide stage

def key_white(a, lo=18, hi=110):
    rgb = a[..., :3]
    # most props sit on white; a glowing lantern comes on black — key whichever colour the border has
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    dark = np.median(border) < 60
    dist = rgb.max(axis=2) if dark else 255 - rgb.min(axis=2)
    if dark: lo, hi = 70, 190   # on black only the lit body counts; the dim painted glow would smudge the room
    alpha = np.clip((dist - lo) / (hi - lo), 0, 1)
    # the backdrop is the white connected to the border, plus any sizeable patch of pure white (holes in a fence,
    # the gap under a sign); small off-white paint inside an object (tofu, garlic, a highlight) stays
    bg = (dist < 40)
    lab, n = ndimage.label(bg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))); border.discard(0)
    outside = np.isin(lab, list(border))
    pure = dist < 12
    plab, pn = ndimage.label(pure)
    sizes = ndimage.sum(pure, plab, index=np.arange(1, pn + 1))
    big = np.isin(plab, np.arange(1, pn + 1)[sizes > 250])
    outside |= ndimage.binary_dilation(big, iterations=1) & (dist < 60)
    if not dark:   # inside an object, off-white paint stays opaque; on black there is no such rule: the ramp alone decides
        alpha = np.where(outside | ndimage.binary_dilation(outside, iterations=2) & (dist < 110), alpha, np.maximum(alpha, (~outside).astype(np.float32)))
    alpha = ndimage.minimum_filter(alpha, size=2)
    alpha = ndimage.uniform_filter(alpha, size=2)
    res = a.copy()
    m = (alpha > 0.02) & (alpha < 0.999)
    al = alpha[m][:, None]
    res[..., :3][m] = np.clip((rgb[m] - (1 - al) * 255) / np.maximum(al, 0.05), 0, 255)
    res[..., 3] = alpha * 255
    return res

def bleed(a):
    al = a[..., 3] > 8
    if al.all() or not al.any(): return a
    _, idx = ndimage.distance_transform_edt(~al, return_indices=True)
    out_ = a.copy(); out_[..., :3] = a[..., :3][idx[0], idx[1]]
    return out_

def trim(a, thr=8):
    m = a[..., 3] > thr
    ys, xs = np.where(m)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {"rooms": {}, "props": {}}   # the library grows batch by batch
for f in sorted(os.listdir(src)):
    if not f.lower().endswith(".png"): continue
    name = f[:-4]
    im = Image.open(os.path.join(src, f)).convert("RGBA")
    room = next((v for k, v in ROOMS.items() if re.match(rf"^{k}( h\w+)?$", name.lower())), None)   # "x", "x horizontal", "x honrizontal"
    if room:
        kind = "wide" if im.width > im.height else "portrait"   # (file names vary: "horizontal", "honrizontal"…)
        od = os.path.join(out, room); os.makedirs(od, exist_ok=True)
        rgb = im.convert("RGB")
        rgb.save(os.path.join(od, f"{kind}.jpg"), quality=88, optimize=True, progressive=True)
        manifest["rooms"].setdefault(room, {})[kind] = [rgb.width, rgb.height]
        print(room, kind, rgb.size)
        continue
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    slug = RENAME.get(slug, slug)
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3]
    delivered_alpha = np.median(np.concatenate([al[0], al[-1], al[:, 0], al[:, -1]])) < 8   # already cut out: keep its own alpha
    a = trim(bleed(a if delivered_alpha else key_white(a)))
    sp = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")
    if max(sp.size) > MAX_SPRITE:
        s = MAX_SPRITE / max(sp.size); sp = sp.resize((round(sp.width * s), round(sp.height * s)), Image.LANCZOS)
    od = os.path.join(out, "props"); os.makedirs(od, exist_ok=True)
    sp.save(os.path.join(od, f"{slug}.webp"), quality=86, method=6)   # lossy WebP keeps alpha at a tenth of the PNG size
    manifest["props"][slug] = [sp.width, sp.height]
    print("prop", slug, sp.size)
json.dump(manifest, open(manifest_path, "w"), indent=1)
