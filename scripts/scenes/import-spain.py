"""Import the delivered Spain pictures without cropping or upscaling them.

Rooms become public/scenes/<room>/wide.jpg and portrait.jpg at their native 1672 x 941 and 941 x 1672.
Card illustrations and motion sprites are keyed from their white backgrounds into transparent, trimmed,
edge-bled WebP files: cards in public/scenes/spain-food/<object>.webp, sprites in public/scenes/props/es-<name>.webp.
Sizes are written into src/fw/scenes-props.json and a manifest with source hashes into public/scenes/spain-assets.json.

Run: uv run --with pillow --with numpy --with scipy scripts/scenes/import-spain.py "$HOME/Downloads/additional game asset/spain"

Then run scripts/scenes/paint-out-strings.py. It edits four of the room JPGs this script writes (es_tortilla and
es_manchego, wide and portrait), painting the hanging pepper string out of the picture so the `es-pepper-ristra`
sprite hung over it in scenes-spain.ts has clean wall behind it, as the China hotpot sprite does. Re-running this
importer overwrites those four with the delivered originals again, which is safe: paint-out-strings.py notices and
paints them out a second time.

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

rooms = {
    "es_paella": "es01_paella", "es_tapas": "es02_tapas", "es_jamon": "es03_jamon", "es_tortilla": "es04_tortilla",
    "es_churros": "es05_churros", "es_pintxos": "es06_pintxos", "es_gazpacho": "es07_gazpacho", "es_pulpo": "es08_pulpo",
    "es_pa_tomaquet": "es09_pa_tomaquet", "es_manchego": "es10_manchego", "es_sidreria": "es11_sidreria", "es_bodega": "es12_bodega",
}
# card file -> object id's art name (SPAIN_CARD_ART maps object ids to these names)
cards = {
    "paella": "es_card_paella.png", "tapas": "es_card_tapas.png", "jamon": "es_card_jamon.png", "tortilla": "es_card_tortilla.png",
    "churros": "es_card_churros.png", "pintxos": "es_card_pintxos.png", "gazpacho": "es_card_gazpacho.png", "pulpo": "es_card_pulpo.png",
    "pa-tomaquet": "es_card_pa_tomaquet.png", "manchego": "es_card_manchego.png", "sidreria": "es_card_sidreria.png", "bodega": "es_card_bodega.png",
}
sprites = {
    "es-orange-twig": "es_motion_orange_twig.png", "es-awning-fringe": "es_motion_awning_fringe.png", "es-gull": "es_motion_gull.png",
    "es-pepper-ristra": "es_motion_pepper_ristra.png", "es-apple-twig": "es_motion_apple_twig.png",
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
    cut(filename, root / "public/scenes/spain-food" / f"{name}.webp")
for name, filename in sprites.items():
    sizes["props"][name] = list(cut(filename, root / "public/scenes/props" / f"{name}.webp"))
concept = root / "public/scenes/es_concept.jpg"
with Image.open(source / "es00_concept.png") as image:
    image.convert("RGB").save(concept, quality=85, optimize=True)
record("es00_concept.png", concept, image.size)
sizes_path.write_text(json.dumps(sizes, ensure_ascii=False, indent=1) + "\n")
(root / "public/scenes/spain-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
assert len(manifest) == 42, len(manifest)
print(f"Imported {len(rooms)} room pairs, {len(cards)} cards, {len(sprites)} sprites and the concept; source files preserved.")
