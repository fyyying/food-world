"""Write the tiny previews the rooms open on, beside every room painting.

A painted room shows nothing until its own picture has arrived (src/fw/scene.ts): no steam, no glint, no hung
sprite, no hotspot. What it shows meanwhile is the preview this script writes — preview-wide.jpg beside wide.jpg
and preview-portrait.jpg beside portrait.jpg, 96 px on the long side at quality 60, a few kilobytes each, scaled
up under a blur. A room with no preview falls back to the plain dark stage, which is correct but duller, so run
this after any importer that adds or replaces a room picture.

It never touches the paintings themselves: it only reads them. Their quality and resolution are the owner's and
are not this script's to trade.

Run: uv run --with pillow scripts/scenes/room-previews.py
Options: --force rewrites every preview; by default a preview newer than its painting is left alone.
"""
import sys
from pathlib import Path

from PIL import Image

LONG_SIDE = 96
QUALITY = 60

root = Path(__file__).resolve().parents[2]
scenes = root / "public/scenes"
force = "--force" in sys.argv[1:]

written = kept = 0
for painting in sorted(scenes.glob("*/*.jpg")):
    if painting.stem not in ("wide", "portrait"):
        continue
    preview = painting.with_name(f"preview-{painting.stem}.jpg")
    if preview.exists() and not force and preview.stat().st_mtime >= painting.stat().st_mtime:
        kept += 1
        continue
    with Image.open(painting) as image:
        scale = LONG_SIDE / max(image.size)
        size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
        image.convert("RGB").resize(size, Image.LANCZOS).save(preview, quality=QUALITY, optimize=True)
    written += 1
    print(f"{preview.relative_to(root)}  {size[0]}x{size[1]}  {preview.stat().st_size / 1024:.1f} kB")

print(f"{written} previews written, {kept} already current")
