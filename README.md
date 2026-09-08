# Food World

An explorable miniature world of every recipe in the Notion **Recipes** database. Level 1 is a paper atlas of
cuisine regions; each region is a handcrafted diorama on a wooden plinth, and the world itself is the interface:
a cow is where the beef dishes live, the smokehouse is where the ribs are, the ramen shop is where the ramen is.
Every object has a card with grounded, dated food history; every card ends in dishes; every dish opens the full
recipe from Notion.

Live at https://fyyying.github.io/food-world/.

## Run

```bash
npm install
cp .env.example .env   # fill in NOTION_TOKEN and NOTION_RECIPE_DATA_SOURCE_ID
npm run dev            # API on :5181, web on :5180
```

Production: `npm run build && npm start` serves `dist/` and the API from one Node process on `API_PORT`.
GitHub Pages: `npm run export` writes the recipe data and photos to `public/static`, then `npm run build:pages`
builds a static bundle; `.github/workflows/pages.yml` publishes it on every push.

## How it fits together

- `server/index.mjs` — Express API. Reads active recipes from Notion (cached 10 min in `.data/recipes.json`),
  fetches a recipe page's ingredients and steps on demand, and caches photos on disk (`/api/image/:id`) so the
  browser never hot-links recipe sites. In development `POST /api/debug/shot` saves a canvas frame to `.data/shots/`.
- `src/data.ts` — the recipe types and fetchers (live API or the exported static files).
- `src/fw/graph.ts` — the knowledge graph: worlds, areas, world objects with their blurbs and `match()` rules,
  the per-recipe enrichment (local name, spice, flavours, core ingredients, technique, home object) and the atlas.
  New recipes appear automatically at their world's fallback place; give them an enrichment row to place them properly.
- `src/fw/worldkit.ts` — the engine: the slab, water materials (sea, fresh water, estuaries), interactive objects,
  dish plates, steam and smoke, hover and click reactions.
- `src/fw/world-*.ts` — one layout per world; `src/fw/props*.ts` — the procedural clay-and-wood miniatures for each.
- `src/fw/map.ts` — the atlas; `src/fw/ui.ts` — the cards; `src/fw/audit.ts` — a dev-only movement audit
  (`__fw.audit()` in the console) that reports anything walking into water, walls or each other.
- `src/fw/scene.ts` — Living Scenes: 3D world → walk up to a place → paper fade → a living illustrated interior
  (layered SVG with parallax, a particle canvas, lantern flicker, a slow camera push) → back to exactly where you
  were. `src/fw/scene-hotpot.ts` is the first one (the Sichuan hotpot house, `scene: "hotpot"` on its object);
  the room is painted art in `public/scenes/hotpot/` (cut from the painted sheets by `scripts/scenes/cut-hotpot-layers.py`,
  run with `uv run --with pillow --with numpy --with scipy`), while `scene-hotpot.ts` + `scene-figures.ts` keep the earlier
  hand-drawn SVG version. `__fw.sceneShot(name)` screenshots an open scene.

## The worlds

China (Sichuan, Jiangnan, the north, the everyday table), Italy (Rome, Venice, Sicily), Korea (Seoul, Jeonju,
Busan, Jeju), Mexico (Mexico City, Oaxaca, Jalisco, Yucatán), the Middle East (Istanbul, the Levant, Arabia,
Persia), the Mediterranean (Greece, Spain, Morocco, Dalmatia), India (Punjab & Delhi, Rajasthan, Mumbai, Kerala),
Southeast Asia (Bangkok, the Andaman coast, Hanoi, the Mekong delta), North America (New York & New England, the
Midwest, Texas & the South, California), Japan (Tokyo, Kyoto, Fuji & the lake, Hokkaido) and Central Europe
(London, Budapest & the puszta, the Alps, Georgia).

## Controls

| Action | How |
| --- | --- |
| Enter a world | click its model on the atlas |
| Look around | drag pans, wheel zooms, right-drag peeks |
| Open something | click any object, stall, animal or building |
| Leave | `Esc` closes a card, then leaves the world |

## House rules for a world

Seas are deep blue, rivers, ponds and fountains light turquoise, and a river meeting the sea fades into it.
Bubbles speak the world's own language plus English. Nothing floats, nothing walks through a wall or a river,
and every click does something.
