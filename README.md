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
- `src/fw/scene.ts` — Living Scenes: 3D world → walk up to a place → paper fade → a living painted room
  (layered images with parallax, a particle canvas for steam and air, lantern flicker, a slow camera push) → back to
  exactly where you were. `src/fw/scenes-china.ts` lists the rooms (hotpot house, noodle shop, tea house, village
  market, home kitchen, the old tower) and which object opens each (`scene:` on the object); `scene-painted.ts`
  lays a room out on the stage: a full painting (`public/scenes/<room>/wide.jpg`, with `portrait.jpg` for phones)
  or a cut sheet, plus sprites from the shared prop library `public/scenes/props/` (WebP with alpha, cut from
  white-background paintings by `scripts/scenes/cut-props.py`, which also keeps sprites that arrive already cut out).
  All six China rooms, the hotpot house included, are full paintings; a room's `pot` puts a boiling broth (swelling
  domes, ripples) on a painted pot. Older sheet-based rooms are cut by `scripts/scenes/cut-hotpot-layers.py` and
  `scripts/scenes/cut-sheets.py` (all run with `uv run --with pillow --with numpy --with scipy`).
  `__fw.sceneShot(name)` screenshots an open scene.

## Jiangnan

The water-town corner of China got the Sichuan treatment on 2026-09-09: nine clickable places with their own
reactions (`src/fw/props-jiangnan.ts`: bao shop, crab pen, lotus pond, wine cellar, tea hill, canal market,
riverside restaurant, home kitchen, and the stone bridge as a click-only landmark), quiet food details
(`jnDetail`), long cards in `graph.ts`, painted props for the cards, and nine painted rooms cut from
`~/Downloads/additional game asset/jiangnan/` (`public/scenes/<room>/wide.jpg` + `portrait.jpg`) laid out in
`scenes-china.ts`; `scene-painted.ts` gained `petals` (osmanthus, lotus, willow, tea flowers drifting down).
`window.__fwInstant = true` makes scene fades skip their timers so a hidden browser pane can still step through them.

## Northern China and Xinjiang

The China table grew to 112×72 on 2026-09-09 to hold a wheat belt along the north and an oasis strip in the far
west beyond the mountains. `src/fw/props-north.ts` builds the dumpling house, noodle workshop, mantou kitchen,
vinegar workshop, roast-duck shop, skewer courtyard, bing stall, wheat harvest, hutong lane and northern market
(plus `northDetail` for coal stacks, pickle crocks, persimmon strings, corn cribs and the stone mill); northern houses
from `house("northern")` are grey brick with a stone course, red door and window frames, a low straight-eaved grey roof
with a ridge and always a chimney, so they read differently from Jiangnan's whitewash and lifted black tile;
`src/fw/props-xinjiang.ts` builds the kebab grill, nan bakery, polo kitchen, laghman shop, oasis bazaar, grape
courtyard, oasis field with its sluice, chaikhana and caravan stop, plus `oasisHouse` and `poplar`. The Tianshan
peaks carry snow cones, a line of poplars marks the west edge, and the objects live in `graph.ts` under the
`northern` and new `xinjiang` areas. Xinjiang has twelve painted rooms (2026-09-10 batch, cut by `cut-props.py` with its
Xinjiang name map): kebab grill, nan bakery, polo kitchen, laghman shop, oasis bazaar, grape courtyard, melon oasis,
chaikhana, home kitchen (`xjhome`), caravan stop, the Tianshan (a hit box on the snow peaks, `tianshan`) and the evening
feast (`feast`, a dastikhan under the vines), plus 46 keyed props (kebab-plate, polo, laghman-bowl, samsa, tonur, karez,
dastikhan…) that serve as card badges. The China table is 100 × 72 with its centre at x −6 (`cx` in the world spec),
so the west holds Xinjiang without an empty east end; the river runs flush to both edges. Northern China's painted rooms are still to come; until then those cards open directly.

## The worlds

China (Sichuan, Jiangnan, the north, the everyday table), Italy (Rome, Venice, Sicily), Korea (Seoul, Jeonju,
Busan, Jeju), Mexico (Mexico City, Oaxaca, Jalisco, Yucatán), the Middle East (Istanbul, the Levant, Arabia,
Persia), the Mediterranean (Greece, Spain, Morocco, Dalmatia), India (Punjab & Delhi, Rajasthan, Mumbai, Kerala),
Southeast Asia (Bangkok, the Andaman coast, Hanoi, the Mekong delta), North America (New York & New England, the
Midwest, Texas & the South, California), Japan (Tokyo, Kyoto, Fuji & the lake, Hokkaido) and Central Europe
(London, Budapest & the puszta, the Alps, Georgia).

## Food histories

`src/fw/stories.ts` holds guided journeys across the atlas: a story is a list of chapters, each with an era, a
short text and a stop, either a region on the atlas or an object inside a world. The engine in `main.ts` glides
the camera from stop to stop, grows a route of little chillies across the atlas while the story's emoji hops to the new stop, walks into a world when a chapter asks for
it and pokes the object it arrives at. Seven stories so far: 🌶️ The Journey of Chilli (Mexico → Spain → India →
the Chinese coast → the Sichuan chilli field), 🍅 The Tomato Comes to Italy, 🥔 The Potato Feeds Europe, 🍵 Tea Goes
Around the World (ending in the Chengdu teahouse), ☕ Coffee Wakes the World (ending at the Italian espresso bar),
🌽 Corn Crosses the World (ending in the Oaxaca milpa) and 🧂 The Spice Routes (ending in Istanbul's bazaar). Start
one from the 📜 Stories button on the atlas or from the "Where it came from" button on the card of any object a
story passes through; Finish brings you back to the atlas, and the last chapter offers ↺ From the start.

## Recipes and nutrition

`scripts/recipes/sichuan.mjs` holds the Sichuan canon (13 dishes) as data and writes it to the Notion Recipes
database over the REST API: identity, cultural context, a home version, grouped ingredients, steps, notes (time,
servings, substitutions, spice, storage) and an estimated-nutrition table, plus one row per ingredient in Recipe
Ingredients. Nutrition is a per-100 g table times the grams in the recipe, divided by servings, with an `eat` share
for things that stay in the pan (whole dried chillies, strained peppercorns, oil left in the bowl); it fills the
`… (est.)` number columns and the `Nutrition labels` multi-select (High protein ≥ 20 g, High fibre ≥ 6 g, Lower
saturated fat ≤ 4 g per serving). `--dry` prints the numbers without writing; pages listed with an `id` are rewritten
in place, the rest are created once and should then be given their id. The recipe page shows the notes and the
nutrition table; the section parser in `server/index.mjs` treats lists under a Notes heading as notes.

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
