# Little Kitchens — a recipe food tour

A 3D map of every recipe in the Notion **Recipes** database. Each cuisine region is a small
floating island; each recipe is a plate with its photo. You wander the islands, open a plate,
and drop it onto a day of the week — the week is the meal planner's current plan, so a pick here
is a pick there.

Inspired by *Seven Little Worlds*: seven islands around a lagoon, orbit with the mouse, dive
into one to explore it.

## Run

```bash
npm install
cp .env.example .env   # fill in NOTION_TOKEN and NOTION_RECIPE_DATA_SOURCE_ID
npm run dev            # API on :5181, web on :5180
```

Production: `npm run build && npm start` serves `dist/` and the API from one Node process on `API_PORT`.

## How it fits together

- `server/index.mjs` — Express API. Reads active recipes from Notion (cached 10 min in `.data/recipes.json`),
  fetches a recipe page's ingredients/steps on demand, caches photos on disk (`/api/image/:id`) so the
  browser never hot-links recipe sites, and proxies the meal planner (`GET /api/plan`, `POST /api/plan/assign`,
  `POST /api/plan/remove`). If `PLANNER_URL` is unreachable the tray falls back to a local week saved in the browser.
- `src/fw/` — **Food World**: the explorable miniature worlds (`world.html`). `graph.ts` holds the knowledge graph
  (worlds, areas, objects with history, recipe placements), `worldkit.ts` the engine (slab, interactive objects,
  dish plates, steam, hover), `world-china.ts` / `world-italy.ts` the layouts, `props.ts` / `props-italy.ts` the
  procedural props, `map.ts` the atlas, `ui.ts` the cards. Two worlds so far: China (Sichuan, Jiangnan, the north)
  and Italy (Rome, Venice, Sicily). Published to GitHub Pages by `.github/workflows/pages.yml` after `npm run export`.
- `src/regions.ts` — the seven islands and which cuisines land on each. Unknown cuisines go to Northern Europe;
  recipes with no cuisine go to The Pantry. Edit this file to redraw the map.
- `src/world/` — three.js scene: procedural low-poly islands (`island.ts`), recipe plates (`plates.ts`),
  camera flights (`camera.ts`), sea/sky/clouds (`scene.ts`).
- `src/ui/` — top bar with search and filter chips, the recipe inspector, the week tray, popover and toasts.
- `src/main.ts` — wiring: picking, hover, drag-to-tray, filters, plan sync.

## Controls

| Action | How |
| --- | --- |
| Orbit / zoom | drag · scroll or pinch |
| Visit an island | click it, its label, or press `1`–`7` |
| Open a recipe | click a plate |
| Put it on a day | click a day in the inspector, or drag the plate onto the week tray |
| Replace vs add | when a day already has a dish you're asked to replace it or add a second dish |
| Search | `/` then type; `Enter` jumps to the first match |
| Back to the map | `Esc`, `Home`, the breadcrumb, or double-click the sea |

Filters dim the plates that don't match and sink them into the grass; island labels show `n of m`.
Plates with a small coral dot are already on this week's plan.

## Data notes

- Photos come from the Notion `Image URL` property. No URL → a painted plate with the dish's initial.
- Plan writes use the planner's own endpoints (`/meals/:id/swap`, `/plans/:id/slots`), so its rules apply:
  adding to a skip day turns it into a cooking day; the only dish on a day can't be removed (skip the day
  in the planner instead).

---

# Food World (experiment) — `/world.html`

A second experience in the same project, built from the *Food World* vision: an explorable miniature world where
the world is the interface. Level 1 is a paper atlas of cuisine regions; only **China** is built so far, the rest
sleep under clouds with the count of dishes waiting there. Inside China is one diorama with four areas
(Sichuan, Jiangnan, Northern China, the everyday table) on a wooden plinth.

- **Objects are culinary information.** Cow → beef dishes. Sichuan pepper tree → málà dishes (tap it: it shakes
  and drops peppercorns). Fermentation jars → doubanjiang. Wok kitchen → stir-fry and braise. Noodle shop,
  dumpling stall, family table are dish landmarks. The hotpot house has no recipe yet and says so.
- **Dishes appear only when you open a place.** Opening the noodle shop makes its plates rise beside it; opening a
  dish preview floats that one plate. Every card ends in dishes, and every dish preview offers *Cook this* (full recipe
  page, ingredients grouped as they are in Notion) or *Explore ingredients* (everything the dish is made from glows).
- **The village is procedural but hand-laid**: temple with incense smoke, pagoda on a hill, paifang gate, curved
  tiled roofs with two-storey variants, lantern strings over the street, a market with striped awnings (produce,
  butcher, steamers, fish, spices, tofu), a dragon dance, pastures with wandering cows, goats, pigs, a chicken coop,
  duck pond, tea terraces, rice paddies with cranes and a buffalo, orchards, birds over the mountains, boats and
  villagers carrying baskets along the street.
- **The knowledge graph lives in `src/fw/graph.ts`**: areas, world objects with their blurbs and `match()` rules,
  the title → 中文 name / spice / flavour / core-ingredient enrichment, and the atlas regions. New Chinese recipes in
  Notion appear automatically at the family table; give them an enrichment row to place them properly.
- Props (`src/fw/props.ts`) are procedural clay-and-wood miniatures; the diorama layout is `src/fw/diorama.ts`.
- Controls: drag pans, wheel zooms, right-drag peeks around. `Esc` closes a card, then leaves the world.

Not in this version: nutrition, substitutions, journeys, AI, other regions.
