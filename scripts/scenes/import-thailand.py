"""Import the delivered Thailand pictures without cropping or upscaling them.

Rooms become public/scenes/<room>/wide.jpg and portrait.jpg at their native 1672 x 941 and 941 x 1672.
Card illustrations and motion sprites are keyed from their white backgrounds into transparent, trimmed,
edge-bled WebP files: cards in public/scenes/thailand-food/<object>.webp, sprites in public/scenes/props/th-<name>.webp.
Sizes are written into src/fw/scenes-props.json and a manifest with source hashes into public/scenes/thailand-assets.json.

Run: uv run --with pillow --with numpy --with scipy scripts/scenes/import-thailand.py "$HOME/Downloads/additional game asset/thailand"

The script is idempotent: running it twice produces byte-identical output. It only ever adds or replaces its own
twelve `rooms` keys and six `props` keys in scenes-props.json; it re-reads that file immediately before writing so
another agent appending its own area's keys in the same minute is not overwritten. If a room picture is
regenerated after picture acceptance, drop the new file into the same folder under the same name and re-run:
the room JPG and its manifest hash are replaced and nothing else moves.
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

source = Path(sys.argv[1] if len(sys.argv) > 1 else Path.home() / "Downloads/additional game asset/thailand")
root = Path(__file__).resolve().parents[2]
WIDE, PORTRAIT = (1672, 941), (941, 1672)
MAX_SPRITE = 960

# room scene id -> delivered file stem; the ids are the "Shared contract: rooms" table of docs/thailand-world.md
rooms = {
    "th_khlong": "th01_khlong", "th_noodleboat": "th02_noodleboat", "th_wang": "th03_wang", "th_curry": "th04_curry",
    "th_sweets": "th05_sweets", "th_shophouse": "th06_shophouse", "th_paddy": "th07_paddy", "th_isan": "th08_isan",
    "th_lanna": "th09_lanna", "th_andaman": "th10_andaman", "th_muslim": "th11_muslim", "th_baba": "th12_baba",
}
# card art name -> delivered file; one card per room, keyed by the room's short name (THAILAND_CARD_ART will map object ids to these)
cards = {
    "khlong": "th_card_khlong.png", "noodleboat": "th_card_noodleboat.png", "wang": "th_card_wang.png",
    "curry": "th_card_curry.png", "sweets": "th_card_sweets.png", "shophouse": "th_card_shophouse.png",
    "paddy": "th_card_paddy.png", "isan": "th_card_isan.png", "lanna": "th_card_lanna.png",
    "andaman": "th_card_andaman.png", "muslim": "th_card_muslim.png", "baba": "th_card_baba.png",
}
sprites = {
    "th-lantern": "th_motion_lantern.png", "th-garlic-string": "th_motion_garlic_string.png",
    "th-squid-line": "th_motion_squid_line.png", "th-sai-ua": "th_motion_sai_ua.png",
    "th-egret": "th_motion_egret.png", "th-pla-tapian": "th_motion_pla_tapian.png",
}
sizes_path = root / "src/fw/scenes-props.json"
manifest = []
notes = []


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
        notes.append(f"{filename}: short side {min(sprite.size)} px after the 960 long-side cap; a tall or wide subject cannot meet 400 on its short side, so it is used only as a small layer")
    destination.parent.mkdir(parents=True, exist_ok=True)
    sprite.save(destination, quality=86, method=6)
    record(filename, destination, sprite.size)
    return sprite.size


room_sizes, prop_sizes = {}, {}
for room, stem in rooms.items():
    for orientation, expected in (("wide", WIDE), ("portrait", PORTRAIT)):
        filename = f"{stem}_{orientation}.png"
        destination = root / "public/scenes" / room / f"{orientation}.jpg"
        with Image.open(source / filename) as image:
            assert image.size == expected, (filename, image.size, expected)
            destination.parent.mkdir(parents=True, exist_ok=True)
            image.convert("RGB").save(destination, quality=88, optimize=True, progressive=True)
        record(filename, destination, expected)
    room_sizes[room] = {"wide": list(WIDE), "portrait": list(PORTRAIT)}
for name, filename in cards.items():
    cut(filename, root / "public/scenes/thailand-food" / f"{name}.webp")
for name, filename in sprites.items():
    prop_sizes[name] = list(cut(filename, root / "public/scenes/props" / f"{name}.webp"))
concept = root / "public/scenes/th_concept.jpg"
with Image.open(source / "th00_concept.png") as image:
    concept_size = image.size
    image.convert("RGB").save(concept, quality=85, optimize=True)
record("th00_concept.png", concept, concept_size)

# Re-read scenes-props.json here, not at the top, so a key another area's importer added while this one was
# cutting sprites survives. Only this area's keys are touched.
sizes = json.loads(sizes_path.read_text())
sizes["rooms"].update(room_sizes)
sizes["props"].update(prop_sizes)
sizes_path.write_text(json.dumps(sizes, ensure_ascii=False, indent=1) + "\n")
(root / "public/scenes/thailand-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
assert len(manifest) == 43, len(manifest)
for note in notes:
    print(f"note: {note}")
print(f"Imported {len(rooms)} room pairs, {len(cards)} cards, {len(sprites)} sprites and the concept; source files preserved.")
