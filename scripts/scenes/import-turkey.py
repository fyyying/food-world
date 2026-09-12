"""Import the supplied Turkey paintings without cropping or upscaling them."""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[2]
rooms = {
    "tr_simit": ("bread horizontal.png", "bread.png"),
    "tr_yufka": ("bread making horizontal.png", "bread making.png"),
    "tr_baklava": ("dough horizontal.png", "dough.png"),
    "tr_fish": ("fish horizontal.png", "fish.png"),
    "tr_breakfast": ("home horizontal.png", "home.png"),
    "tr_kebab": ("kebab horizontal.png", "kebab.png"),
    "tr_supper": ("meat platter horizontal.png", "meat platter.png"),
    "tr_meze": ("mezze horizontal.png", "mezze"),
    "tr_olive": ("olive horizontal.png", "olive.png"),
    "tr_pide": ("pita horizontal.png", "pita.png"),
    "tr_dolma": ("stuffed pepper horizontal.png", "stuffed pepper.png"),
    "tr_tea_hill": ("tea hill horizontal.png", "tea.png"),
    "tr_tea": ("tea horizontal.png", "tea"),
    "tr_coffee": ("turkish coffee horizontal.png", "turkish coffee.png"),
    "tr_market": ("turkish market horizontal.png", "turkish market.png"),
}
foods = {
    "meze-bowls": "apero.png", "baklava": "baklava with pistachio.png",
    "borek": "baklava.png", "bulgur": "bulgar.png", "kofte": "cevap.png",
    "pide": "cheese bread.png", "caydanlik": "coffee kettle.png",
    "breakfast": "cold mezze.png", "tea": "cup of te.png", "manti": "dumplings.png",
    "sis": "kebab skewer.png", "lentil-soup": "lentil.png", "meze": "mezze.png",
    "olive-branch": "olive branch.png", "olive-oil": "olive oil.png",
    "pistachios": "pistachio.png", "lahmacun": "pizza.png", "balik-ekmek": "sandwich.png",
    "simit": "simit.png", "skewers": "skewer.png", "smoke": "smoke.png",
    "yogurt": "sour cream.png", "stew": "stew.png", "dolma": "stuffed veggies.png",
    "sarma": "stuffed.png", "tea-leaves": "tea leaves.png", "coffee": "turkish coffee2.png",
}
sizes_path = root / "src/fw/scenes-props.json"
sizes = json.loads(sizes_path.read_text())
manifest = []


def convert(filename, destination, expected):
    original = source / filename
    with Image.open(original) as image:
        assert image.size == expected, (filename, image.size, expected)
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.convert("RGB").save(destination, quality=88, **({"optimize": True} if destination.suffix == ".jpg" else {}))
    manifest.append({"source": filename, "source_sha256": hashlib.sha256(original.read_bytes()).hexdigest(),
                     "path": str(destination.relative_to(root / "public")), "size": list(expected)})


for room, pair in rooms.items():
    for orientation, filename, dimensions in zip(("wide", "portrait"), pair, ((1672, 941), (941, 1672))):
        convert(filename, root / "public/scenes" / room / f"{orientation}.jpg", dimensions)
    sizes["rooms"][room] = {"wide": [1672, 941], "portrait": [941, 1672]}
for name, filename in foods.items():
    convert(filename, root / "public/scenes/turkey-food" / f"{name}.webp", (1254, 1254))
sizes_path.write_text(json.dumps(sizes, ensure_ascii=False, indent=1) + "\n")
(root / "public/scenes/turkey-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
assert len(manifest) == 57
print(f"Imported {len(rooms)} room pairs and {len(foods)} food/effect images; source files preserved.")
