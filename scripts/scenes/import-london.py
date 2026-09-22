"""Import the delivered Britain pictures without cropping or upscaling them.

Rooms become public/scenes/<room>/wide.jpg and portrait.jpg at their native 1672 x 941 and 941 x 1672.
Card illustrations and motion sprites are keyed from their white backgrounds into transparent, trimmed,
edge-bled WebP files: cards in public/scenes/london-food/<name>.webp, sprites in public/scenes/props/uk-<name>.webp.
Sizes are written into src/fw/scenes-props.json and a manifest with source hashes into public/scenes/london-assets.json.

Run: uv run --with pillow --with numpy --with scipy scripts/scenes/import-london.py "$HOME/Downloads/additional game asset/london"

The script is idempotent: running it twice produces the same files and the same JSON. It only ever adds or replaces
its own keys in scenes-props.json, and it re-reads that file immediately before writing so that a key another agent
appended while this script was running is kept. If the re-read finds the file changed it says so and keeps both sets;
nothing is lost and the run can simply be repeated.

Rejected pictures are imported too, so the pipeline is complete. When a regenerated file is dropped into the source
folder under the same name, re-running this script overwrites the room JPG, the card or the sprite in place and
updates its source hash in public/scenes/london-assets.json.

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

source = Path(sys.argv[1] if len(sys.argv) > 1 else Path.home() / "Downloads/additional game asset/london")
root = Path(__file__).resolve().parents[2]
WIDE, PORTRAIT = (1672, 941), (941, 1672)
MAX_SPRITE = 960

# room scene id -> delivered file stem, from "Shared contract: rooms" in docs/london-world.md
rooms = {
    "uk_pub": "ld01_pub", "uk_tearoom": "ld02_tearoom", "uk_market": "ld03_market", "uk_piemash": "ld04_piemash",
    "uk_chippy": "ld05_chippy", "uk_breakfast": "ld06_breakfast", "uk_lascar": "ld07_lascar",
    "uk_hopkitchen": "ld08_hopkitchen", "uk_dairy": "ld09_dairy", "uk_pasty": "ld10_pasty",
    "uk_cockles": "ld11_cockles", "uk_smokehouse": "ld12_smokehouse", "uk_distillery": "ld13_distillery",
}
# card art name -> delivered file; scenes-london.ts will map object ids to these names, one per room
cards = {
    "pub": "ld_card_pub.png", "tearoom": "ld_card_tearoom.png", "market": "ld_card_market.png",
    "piemash": "ld_card_piemash.png", "chippy": "ld_card_chippy.png", "breakfast": "ld_card_breakfast.png",
    "lascar": "ld_card_lascar.png", "hopkitchen": "ld_card_hopkitchen.png", "dairy": "ld_card_dairy.png",
    "pasty": "ld_card_pasty.png", "cockles": "ld_card_cockles.png", "smokehouse": "ld_card_smokehouse.png",
    "distillery": "ld_card_distillery.png",
}
sprites = {
    "uk-pub-sign": "ld_motion_pub_sign.png", "uk-hop-bine": "ld_motion_hop_bine.png",
    "uk-game-brace": "ld_motion_game_brace.png", "uk-gull": "ld_motion_gull.png",
    "uk-smoke-speet": "ld_motion_smoke_speet.png", "uk-hanging-lamp": "ld_motion_hanging_lamp.png",
}
sizes_path = root / "src/fw/scenes-props.json"
before = sizes_path.read_text()
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
    cut(filename, root / "public/scenes/london-food" / f"{name}.webp")
for name, filename in sprites.items():
    prop_sizes[name] = list(cut(filename, root / "public/scenes/props" / f"{name}.webp"))
concept = root / "public/scenes/uk_concept.jpg"
with Image.open(source / "ld00_concept.png") as image:
    image.convert("RGB").save(concept, quality=85, optimize=True)
    record("ld00_concept.png", concept, image.size)

# Re-read scenes-props.json immediately before writing, so a key another agent added while this ran is kept.
after = sizes_path.read_text()
if after != before:
    print("note: src/fw/scenes-props.json changed on disk during this run; merging the london keys into the newer file")
sizes = json.loads(after)
sizes["rooms"].update(room_sizes)
sizes["props"].update(prop_sizes)
sizes_path.write_text(json.dumps(sizes, ensure_ascii=False, indent=1) + "\n")
(root / "public/scenes/london-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
assert len(manifest) == 46, len(manifest)
print(f"Imported {len(rooms)} room pairs, {len(cards)} cards, {len(sprites)} sprites and the concept; source files preserved.")
