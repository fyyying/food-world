"""Import the delivered Italy pictures without cropping or upscaling them.

Rooms become public/scenes/<room>/wide.jpg and portrait.jpg at their native size: 1672 x 941 and
941 x 1672. A picture short of its target by at most 2 px in either dimension is padded to the
exact target by replicating its last row or column; a larger shortfall raises. Nothing is cropped
or resampled; a regenerated file at the exact size simply overwrites the padded one and the
numbers stay the same.

Card illustrations and motion sprites are keyed from their white backgrounds into transparent,
trimmed, edge-bled WebP files: cards in public/scenes/italy-food/<name>.webp, sprites in
public/scenes/props/it-<name>.webp. Sizes are written into src/fw/scenes-props.json and a manifest
with source hashes into public/scenes/italy-assets.json.

Three other area importers may be writing their own keys into scenes-props.json at the same time,
so this script never rewrites the file from a stale read: it re-reads it immediately before the
write, merges only the `it_` rooms and `it-` props it owns, and retries when another process got
in first. Running it twice in a row produces byte-identical output.

Run: uv run --with pillow --with numpy --with scipy scripts/scenes/import-italy.py "$HOME/Downloads/additional game asset/italy"
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

# Room scene ids from docs/italy-world.md, "Shared contract: rooms".
rooms = {
    "it_trattoria": "it01_trattoria", "it_market": "it02_market", "it_pasta": "it03_pasta",
    "it_forno": "it04_forno", "it_casale": "it05_casale", "it_pescaria": "it06_pescaria",
    "it_bacaro": "it07_bacaro", "it_laguna": "it08_laguna", "it_veneto": "it09_veneto",
    "it_friggitoria": "it10_friggitoria", "it_ballaro": "it11_ballaro",
    "it_pasticceria": "it12_pasticceria", "it_tonnara": "it13_tonnara",
}
# card art name -> delivered file. Stage C maps object ids onto these names in ITALY_CARD_ART.
cards = {
    "trattoria": "it_card_trattoria.png", "market": "it_card_market.png", "pasta": "it_card_pasta.png",
    "forno": "it_card_forno.png", "casale": "it_card_casale.png", "pescaria": "it_card_pescaria.png",
    "bacaro": "it_card_bacaro.png", "laguna": "it_card_laguna.png", "veneto": "it_card_veneto.png",
    "friggitoria": "it_card_friggitoria.png", "ballaro": "it_card_ballaro.png",
    "pasticceria": "it_card_pasticceria.png", "tonnara": "it_card_tonnara.png",
}
sprites = {
    "it-awning": "it_motion_awning.png", "it-salumi": "it_motion_salumi.png",
    "it-pasta-cane": "it_motion_pasta_cane.png", "it-garlic-braid": "it_motion_garlic_braid.png",
    "it-gull": "it_motion_gull.png", "it-lamp": "it_motion_lamp.png",
}
sizes_path = root / "src/fw/scenes-props.json"
manifest = []
room_sizes, prop_sizes = {}, {}


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


def merge_sizes():
    """Re-read scenes-props.json, add only this world's keys, and write. Other importers may hold it."""
    for _ in range(8):
        before = sizes_path.read_bytes()
        data = json.loads(before)
        data.setdefault("rooms", {}).update(room_sizes)
        data.setdefault("props", {}).update(prop_sizes)
        text = json.dumps(data, ensure_ascii=False, indent=1) + "\n"
        if sizes_path.read_bytes() != before:
            continue  # somebody else wrote between the read and the write; take their version and merge again
        if text.encode() == before:
            return "unchanged"
        sizes_path.write_text(text)
        return "written"
    raise SystemExit("scenes-props.json kept changing under this importer; run it again")


for room, stem in rooms.items():
    for orientation, expected in (("wide", WIDE), ("portrait", PORTRAIT)):
        filename = f"{stem}_{orientation}.png"
        destination = root / "public/scenes" / room / f"{orientation}.jpg"
        with Image.open(source / filename) as image:
            size = image.size
            assert (size[0] < size[1]) == (expected[0] < expected[1]), (filename, size, expected)
            assert abs(size[0] - expected[0]) <= 2 and abs(size[1] - expected[1]) <= 2, (filename, size, expected)
            rgb = image.convert("RGB")
            pad_w = max(expected[0] - size[0], 0)
            pad_h = max(expected[1] - size[1], 0)
            if pad_w or pad_h:
                arr = np.pad(np.asarray(rgb), ((0, pad_h), (0, pad_w), (0, 0)), mode="edge")
                rgb = Image.fromarray(arr)
                print(f"note: {filename} was delivered at {size[0]} x {size[1]}, {max(pad_w, pad_h)} px short of {expected[0]} x {expected[1]}; padded to size by replicating the last row/column")
                size = expected
            elif size != expected:
                print(f"note: {filename} was delivered at {size[0]} x {size[1]}, not {expected[0]} x {expected[1]}; imported at its native size and rejected on size in docs/italy-world.md")
            destination.parent.mkdir(parents=True, exist_ok=True)
            rgb.save(destination, quality=88, optimize=True, progressive=True)
        record(filename, destination, size)
        room_sizes.setdefault(room, {})[orientation] = list(size)
for name, filename in cards.items():
    cut(filename, root / "public/scenes/italy-food" / f"{name}.webp")
for name, filename in sprites.items():
    prop_sizes[name] = list(cut(filename, root / "public/scenes/props" / f"{name}.webp"))
concept = root / "public/scenes/it_concept.jpg"
with Image.open(source / "it00_concept.png") as image:
    image.convert("RGB").save(concept, quality=85, optimize=True)
    record("it00_concept.png", concept, image.size)
state = merge_sizes()
(root / "public/scenes/italy-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
assert len(manifest) == 46, len(manifest)
print(f"Imported {len(rooms)} room pairs, {len(cards)} cards, {len(sprites)} sprites and the concept; "
      f"scenes-props.json {state}; source files preserved.")
