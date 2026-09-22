"""Import the delivered Vietnam pictures without cropping or upscaling them.

Rooms become public/scenes/vn_<room>/wide.jpg and portrait.jpg at their native 1672 x 941 and 941 x 1672.
Card illustrations and motion sprites are keyed from their white backgrounds into transparent, trimmed,
edge-bled WebP files: cards in public/scenes/vietnam-food/<object>.webp, sprites in public/scenes/props/vn-<name>.webp.
Sizes are written into src/fw/scenes-props.json and a manifest with source hashes into public/scenes/vietnam-assets.json.

Run: uv run --with pillow --with numpy --with scipy scripts/scenes/import-vietnam.py "$HOME/Downloads/additional game asset/vietnam"

The script only adds its own `vn_` room keys and `vn-` prop keys to scenes-props.json: it reads the file, adds,
and writes it back, so another area's importer may run before or after it. It is idempotent — running it twice
produces byte-identical output — so if scenes-props.json changed on disk between the read and the write, just
run it again.

Seven delivered files were rejected at picture acceptance (see docs/vietnam-world.md, "Stage B"). They are
imported anyway so the pipeline is complete, and the regenerated versions overwrite them at the same paths:
public/scenes/vietnam-food/bread-pate.webp and all six public/scenes/props/vn-*.webp.

Finally, run `uv run --with pillow scripts/scenes/room-previews.py`. It writes the tiny preview-wide.jpg and
preview-portrait.jpg beside each room picture this script wrote; a painted room shows its preview, blurred, while
its painting loads, and without it the room opens on the plain dark stage. It reads the paintings and never
rewrites them.
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[2]
WIDE, PORTRAIT = (1672, 941), (941, 1672)
MAX_SPRITE = 960

# room scene id -> delivered file stem. The Stage A docs name no scene ids, so each is `vn_` plus the
# room's short name from the delivered file names (docs/vietnam-image-brief.md Part B).
rooms = {
    "vn_pho": "vn01_pho", "vn_bun_cha": "vn02_bun_cha", "vn_banh_cuon": "vn03_banh_cuon",
    "vn_com_vong": "vn04_com_vong", "vn_bun_bo_hue": "vn05_bun_bo_hue", "vn_hue_cakes": "vn06_hue_cakes",
    "vn_cao_lau": "vn07_cao_lau", "vn_mi_quang": "vn08_mi_quang", "vn_bread_pate": "vn09_bread_pate",
    "vn_hu_tieu": "vn10_hu_tieu", "vn_banh_xeo": "vn11_banh_xeo", "vn_mekong_home": "vn12_mekong_home",
}
# card art name -> delivered file. A later VIETNAM_CARD_ART maps object ids to these names.
cards = {
    "pho": "vn_card_pho.png", "bun-cha": "vn_card_bun_cha.png", "banh-cuon": "vn_card_banh_cuon.png",
    "com-vong": "vn_card_com_vong.png", "bun-bo-hue": "vn_card_bun_bo_hue.png", "hue-cakes": "vn_card_hue_cakes.png",
    "cao-lau": "vn_card_cao_lau.png", "mi-quang": "vn_card_mi_quang.png", "bread-pate": "vn_card_bread_pate.png",
    "hu-tieu": "vn_card_hu_tieu.png", "banh-xeo": "vn_card_banh_xeo.png", "mekong-home": "vn_card_mekong_home.png",
}
sprites = {
    "vn-rice-sieve": "vn_motion_rice_sieve.png", "vn-herb-bundle": "vn_motion_herb_bundle.png",
    "vn-banana-leaf": "vn_motion_banana_leaf.png", "vn-lotus-leaf": "vn_motion_lotus_leaf.png",
    "vn-bamboo-fan": "vn_motion_bamboo_fan.png", "vn-kingfisher": "vn_motion_kingfisher.png",
}
sizes_path = root / "src/fw/scenes-props.json"
sizes = json.loads(sizes_path.read_text())
manifest = []


def record(filename, destination, size):
    original = source / filename
    manifest.append({"source": filename, "source_sha256": hashlib.sha256(original.read_bytes()).hexdigest(),
                     "path": str(destination.relative_to(root / "public")), "size": list(size)})


def key_white(a, lo=18, hi=110):
    """Same keying as scripts/scenes/cut-props.py: white connected to the border becomes transparent, paint stays."""
    rgb = a[..., :3]
    dist = 255 - rgb.min(axis=2)
    alpha = np.clip((dist - lo) / (hi - lo), 0, 1)
    bg = dist < 40
    lab, _ = ndimage.label(bg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))); border.discard(0)
    outside = np.isin(lab, list(border))
    pure = dist < 12
    plab, pn = ndimage.label(pure)
    big_sizes = ndimage.sum(pure, plab, index=np.arange(1, pn + 1))
    big = np.isin(plab, np.arange(1, pn + 1)[big_sizes > 250])
    outside |= ndimage.binary_dilation(big, iterations=1) & (dist < 60)
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
    if al.all() or not al.any():
        return a
    _, idx = ndimage.distance_transform_edt(~al, return_indices=True)
    out = a.copy(); out[..., :3] = a[..., :3][idx[0], idx[1]]
    return out


def trim(a, thr=8):
    m = a[..., 3] > thr
    ys, xs = np.where(m)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def cut(filename, destination):
    with Image.open(source / filename) as image:
        a = np.asarray(image.convert("RGBA")).astype(np.float32)
    a = trim(bleed(key_white(a)))
    sprite = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")
    if max(sprite.size) > MAX_SPRITE:
        s = MAX_SPRITE / max(sprite.size)
        sprite = sprite.resize((round(sprite.width * s), round(sprite.height * s)), Image.LANCZOS)
    if min(sprite.size) < 400:
        print(f"note: {filename} short side {min(sprite.size)} px after the long-side cap; a wide or tall sprite cannot meet 400 on its short side; it is used only as a small layer")
    destination.parent.mkdir(parents=True, exist_ok=True)
    sprite.save(destination, quality=86, method=6)
    record(filename, destination, sprite.size)
    return sprite.size


for room, stem in rooms.items():
    for orientation, expected in (("wide", WIDE), ("portrait", PORTRAIT)):
        filename = f"{stem}_{orientation}.png"
        destination = root / "public/scenes" / room / f"{orientation}.jpg"
        with Image.open(source / filename) as image:
            assert image.size == expected, (filename, image.size, expected)
            destination.parent.mkdir(parents=True, exist_ok=True)
            image.convert("RGB").save(destination, quality=88, optimize=True, progressive=True)
        record(filename, destination, expected)
    sizes["rooms"][room] = {"wide": list(WIDE), "portrait": list(PORTRAIT)}
for name, filename in cards.items():
    cut(filename, root / "public/scenes/vietnam-food" / f"{name}.webp")
for name, filename in sprites.items():
    sizes["props"][name] = list(cut(filename, root / "public/scenes/props" / f"{name}.webp"))
concept = root / "public/scenes/vn_concept.jpg"
with Image.open(source / "vn00_concept.png") as image:
    image.convert("RGB").save(concept, quality=85, optimize=True)
record("vn00_concept.png", concept, image.size)
sizes_path.write_text(json.dumps(sizes, ensure_ascii=False, indent=1) + "\n")
(root / "public/scenes/vietnam-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
assert len(manifest) == 43, len(manifest)
print(f"Imported {len(rooms)} room pairs, {len(cards)} cards, {len(sprites)} sprites and the concept; source files preserved.")
