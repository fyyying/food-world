"""Paint the hanging pepper strings out of the Spain room paintings, once, offline.

Runs AFTER scripts/scenes/import-spain.py, on the JPGs that script writes.

Why: five room orientations hang the `es-pepper-ristra` sprite over the painted string, the way the China hotpot
room hangs its lanterns over bare wall. The hotpot painting has nothing under its sprite, and that is the standard:
with a painted string still underneath, the string shows in the notches between the sprite's peppers and at the ends
of the swing, which the owner saw at once ("there is in the background the same chilli string, the China room
doesn't have it"). So the string comes out of the picture itself and the sprite becomes the only one in the room.

What it does, per room and orientation in PLACEMENTS below:

1. Keys the painted string with the same rule the engine uses for a `ristra` (`isBreezePixel` in scene-ambience.ts:
   r > 60, r - g > 45, r > 1.75 g, r > 1.6 b), inside a hand-measured box, then keeps only the connected components
   that a hand-measured seed point falls in. Seeds rather than the engine's "quarter of the largest" rule because a
   red headscarf or a curing ham in the same box can be a quarter the size of the string.
2. Protects every other red thing in the box: anything the same key takes that is not part of the seeded string is
   dilated and subtracted from the mask, so a neighbouring scarf, ham or wooden door frame is never touched.
3. Subtracts the `keep` boxes, which hold the painted hook, nail, chain or twine bow the sprite hangs from. Those
   stay in the picture: the sprite's rope has to end on them.
4. Dilates to take the string's painted outline, and again along `shadow` to take its cast shadow on the wall.
5. Fills with cv2.inpaint (Telea), which on these plain plaster and stone walls reproduces the wall's own colour and
   lighting gradient. Navier-Stokes was tried and left streaks.

The original is copied to .data/originals/<room>/<orientation>.jpg with a sidecar JSON holding its SHA-256 before
anything is written, and the script refuses to run twice over the same file: a sidecar whose painted hash matches
the file on disk means the work is already done. `.data` is not in git, so the chain of custody for these five
derived JPGs is: the delivered PNGs in the picture folder (hashes in public/scenes/spain-assets.json) →
import-spain.py → this script. To start again from the delivered pictures, run `--restore` (or re-run
import-spain.py) and then this script.

Run: uv run --with pillow --with numpy --with scipy --with opencv-python-headless scripts/scenes/paint-out-strings.py
     uv run ... scripts/scenes/paint-out-strings.py --restore     # put the originals back and forget the sidecars
"""
import hashlib
import json
import shutil
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

root = Path(__file__).resolve().parents[2]
ORIGINALS = root / ".data/originals"
QUALITY = dict(quality=88, optimize=True, progressive=True)   # the settings import-spain.py saves rooms with

# Every box, seed and keep rectangle is a fraction of that orientation's own painting, measured on its pixels.
# box: where to look. seeds: points inside the painted string. extra: rectangles to add for the twine, tie or stems
# the colour key cannot see. keep: the hook, nail, chain or bow that must survive, plus anything nearby to protect.
# close: radius of the closing that turns the keyed peppers into one solid silhouette.
# grow: dilation in pixels for the painted outline. shadow: how far to smear the mask along the painted cast shadow.
# grain: optional, a clean featureless rectangle of the same wall whose brush texture is tiled back over the smooth
# fill. None of the five needs it: every source rectangle near these strings carries a stone line or a lintel edge,
# and tiling that repeats it as a visible pattern, which is worse than the smooth fill it was meant to improve.
PLACEMENTS = {
    ("es_tortilla", "wide"): dict(
        box=(.840, .040, .915, .330), seeds=[(.873, .18)], keep=[(.860, .016, .886, .0445)],
        extra=[(.852, .044, .896, .095)], close=11, grow=9, shadow=(14, 5), radius=12),
    ("es_tortilla", "portrait"): dict(
        box=(.545, .040, .700, .275), seeds=[(.615, .15)], keep=[(.596, 0, .640, .022), (.40, .235, .598, .32)],
        extra=[(.592, .022, .644, .062)], close=13, grow=9, shadow=(10, 4), radius=12),
    ("es_manchego", "wide"): dict(
        box=(.745, .118, .835, .410), seeds=[(.780, .25)], keep=[(.766, .088, .800, .1205), (.806, .112, .834, .198)],
        extra=[(.768, .120, .794, .134)], close=11, grow=9, shadow=(18, 7), radius=14),
    ("es_manchego", "portrait"): dict(
        box=(.745, .045, .880, .215), seeds=[(.805, .10), (.80, .15)],
        keep=[(.790, .015, .825, .044), (.70, .204, .86, .26)],
        extra=[(.791, .043, .822, .060)], close=11, grow=8, shadow=(14, 5), radius=12),
    # es_jamon portrait is deliberately absent. Its string hangs in front of a curing ham, an iron column and the
    # bright glazed roof, three different things at once; every inpaint smears them together (the attempt is in the
    # 2026-09-16 sprite section of docs/spain-rooms.md), so that room keeps its painted string, still, and no sprite.
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def ristra(a: np.ndarray) -> np.ndarray:
    """isBreezePixel('ristra') from src/fw/scene-ambience.ts, pixel for pixel."""
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    return (r > 60) & (r - g > 45) & (r > g * 1.75) & (r > b * 1.6)


def shift(mask: np.ndarray, dx: int, dy: int) -> np.ndarray:
    """Translate a mask without wrapping around the edges of the picture."""
    out = np.zeros_like(mask)
    height, width = mask.shape
    ys, xs = slice(max(0, dy), height + min(0, dy)), slice(max(0, dx), width + min(0, dx))
    out[ys, xs] = mask[slice(max(0, -dy), height + min(0, -dy)), slice(max(0, -dx), width + min(0, -dx))]
    return out


def rect(shape, box):
    height, width = shape
    out = np.zeros(shape, bool)
    out[int(box[1] * height):int(box[3] * height), int(box[0] * width):int(box[2] * width)] = True
    return out


def string_mask(a: np.ndarray, cfg) -> np.ndarray:
    height, width = a.shape[:2]
    keyed = ristra(a)
    inside = keyed & rect((height, width), cfg["box"])
    labels, _ = ndimage.label(inside, np.ones((3, 3)))
    hit = [(seed, int(labels[int(seed[1] * height), int(seed[0] * width)])) for seed in cfg["seeds"]]
    chosen = {label for _, label in hit if label}
    assert chosen, f"no string under the seeds {cfg['seeds']}"
    missed = [seed for seed, label in hit if not label]
    if missed:
        print(f"   note: a seed fell in a gap between peppers rather than on one: {missed}")
    string = np.isin(labels, list(chosen))
    # A large closing turns the keyed peppers into the string's solid silhouette, so the dark shadowed peppers the
    # colour key misses and the wall between the peppers go with it. Both are being replaced by wall, so nothing is
    # lost, and leaving them behind is what a smaller closing did: dark red blotches marooned in a clean patch.
    disk = np.hypot(*np.ogrid[-cfg.get("close", 11):cfg.get("close", 11) + 1,
                              -cfg.get("close", 11):cfg.get("close", 11) + 1]) <= cfg.get("close", 11)
    string = ndimage.binary_fill_holes(ndimage.binary_closing(string, disk))
    grown = ndimage.binary_dilation(string, ndimage.generate_binary_structure(2, 2), iterations=cfg["grow"])
    dx, dy = cfg.get("shadow", (0, 0))
    steps = max(abs(dx), abs(dy))
    outline = grown.copy()
    for step in range(1, steps + 1):   # smear the outline along the shadow, one measured pixel at a time, no wrap
        grown |= shift(outline, round(dx * step / steps), round(dy * step / steps))
    # Never take a neighbouring red thing: a headscarf, a curing ham, a warm wooden door frame. Only sizeable ones,
    # though — a stray pepper tip a few pixels away from the string is part of the string and has to go with it, and
    # protecting those is what left red specks marooned in the first clean patch.
    others, count = ndimage.label(keyed & ~string, np.ones((3, 3)))
    sizes = ndimage.sum_labels(np.ones_like(others), others, range(1, count + 1))
    sizeable = np.isin(others, [i + 1 for i, area in enumerate(sizes) if area >= cfg.get("protect", 300)])
    grown &= ~ndimage.binary_dilation(sizeable, np.ones((5, 5)), iterations=2)
    for extra in cfg.get("extra", []):   # the twine, tie or stems between the hook and the peppers: not red, not keyed
        grown |= rect((height, width), extra)
    for keep in cfg.get("keep", []):     # the hook the sprite hangs from, and anything else that must survive
        grown &= ~rect((height, width), keep)
    return grown


def regrain(filled: np.ndarray, source: np.ndarray, mask: np.ndarray, box) -> np.ndarray:
    """Give the inpainted patch the wall's own grain back.

    Telea reproduces the wall's colour and its lighting gradient but returns a flat slab, which reads as a wiped
    patch next to painted plaster. So the high-frequency part of a clean piece of the same wall (`grain`, a hand-
    measured rectangle) is tiled over the patch and added on top of the smooth fill, fading out at the mask edge.
    """
    height, width = mask.shape
    y0, y1 = int(box[1] * height), int(box[3] * height)
    x0, x1 = int(box[0] * width), int(box[2] * width)
    tile = source[y0:y1, x0:x1].astype(np.float32)
    tile -= cv2.GaussianBlur(tile, (0, 0), 6)   # keep the brush texture, drop the tile's own colour and lighting
    repeats = (height // tile.shape[0] + 2, width // tile.shape[1] + 2)
    grain = np.tile(np.concatenate([np.concatenate([tile, tile[::-1]], 0)] * repeats[0], 0)[:height * 2],
                    (1, repeats[1], 1))[:height, :width]   # mirrored tiling, so no seam repeats across the patch
    fade = ndimage.gaussian_filter(mask.astype(np.float32), 3)
    fade = np.clip((fade - .25) / .5, 0, 1)[..., None]
    return np.clip(filled.astype(np.float32) + grain * fade, 0, 255).astype(np.uint8)


def paint(room: str, orientation: str, cfg) -> None:
    painting = root / "public/scenes" / room / f"{orientation}.jpg"
    original = ORIGINALS / room / f"{orientation}.jpg"
    sidecar = original.with_suffix(".json")
    current = sha(painting)
    if sidecar.exists():
        record = json.loads(sidecar.read_text())
        if current == record["painted_sha256"]:
            print(f"-- {room} {orientation}: already painted out, nothing to do")
            return
        if current != record["source_sha256"]:
            raise SystemExit(f"{painting} is neither the recorded original nor the recorded result; "
                             f"restore it with --restore or delete {sidecar} deliberately")
        print(f"-- {room} {orientation}: the original is back in place, painting it out again")
    elif original.exists():
        # --restore leaves the original in place and drops the sidecar; painting again from it is safe, and an
        # original is never overwritten, so a file that differs from it means somebody changed the picture by hand
        if sha(original) != current:
            raise SystemExit(f"{painting} differs from the original kept at {original} and has no sidecar; "
                             f"run --restore, or move the original aside deliberately")
    else:
        original.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(painting, original)
    source_hash = sha(original)

    with Image.open(original) as image:
        a = np.asarray(image.convert("RGB"))
    mask = string_mask(a, cfg)
    filled = cv2.inpaint(cv2.cvtColor(a, cv2.COLOR_RGB2BGR), mask.astype(np.uint8) * 255, cfg["radius"], cv2.INPAINT_TELEA)
    filled = cv2.cvtColor(filled, cv2.COLOR_BGR2RGB)
    if cfg.get("grain"):
        filled = regrain(filled, a, mask, cfg["grain"])
    Image.fromarray(filled).save(painting, **QUALITY)
    ys, xs = np.nonzero(mask)
    sidecar.write_text(json.dumps({
        "room": room, "orientation": orientation,
        "source_sha256": source_hash, "painted_sha256": sha(painting),
        "mask_box": [round(float(xs.min()) / a.shape[1], 4), round(float(ys.min()) / a.shape[0], 4),
                     round(float(xs.max() + 1) / a.shape[1], 4), round(float(ys.max() + 1) / a.shape[0], 4)],
        "mask_pixels": int(mask.sum()), "method": f"cv2.inpaint Telea radius {cfg['radius']}",
        "config": {k: v for k, v in cfg.items()},
    }, indent=1) + "\n")
    print(f"-- {room} {orientation}: {int(mask.sum())} px painted out, "
          f"box x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()}, Telea radius {cfg['radius']}")


def restore() -> None:
    for (room, orientation) in PLACEMENTS:
        original = ORIGINALS / room / f"{orientation}.jpg"
        sidecar = original.with_suffix(".json")
        if not original.exists():
            print(f"-- {room} {orientation}: no original kept, nothing to restore")
            continue
        shutil.copy2(original, root / "public/scenes" / room / f"{orientation}.jpg")
        sidecar.unlink(missing_ok=True)
        print(f"-- {room} {orientation}: original restored")


if __name__ == "__main__":
    if "--restore" in sys.argv:
        restore()
    else:
        for (room, orientation), cfg in PLACEMENTS.items():
            paint(room, orientation, cfg)
