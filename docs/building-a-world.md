# Building a Food World area: the engineering handbook

This handbook tells an agent how the code produces a Food World area. Read it with the [new-area methodology](new-area-methodology.md), which sets the quality standard, and the [art direction](art-direction.md), which sets the picture standard. The [team playbook](agent-team-playbook.md) tells several agents how to share the work.

The China world is the reference. When this handbook and the China code disagree, the China code wins. Report the difference.

## 1. Vocabulary

| Term | Meaning | Where it lives |
| --- | --- | --- |
| World | One wooden table on the atlas, for example `china` or `middle-east` | `WorldId` in `src/fw/graph.ts`, one `world-<id>.ts` |
| Area | A region inside a world, for example `sichuan` or `istanbul`. The location picker lists areas | `Area` and `AREAS` in `graph.ts` |
| Object | A clickable thing with a card: a place, an ingredient, a landmark | `WorldObject` entries in `graph.ts` or `<id>-objects.ts` |
| Stand | The 3D miniature that an object shows. A stand is a function that returns a group with `tick` and `poke` | `props*.ts` |
| Detail | A small 3D miniature with no card: hanging chillies, a cabbage stack | `northDetail`, `xjDetail`, `jnDetail`, `foodDetail` |
| Room | A living painting that opens when the visitor clicks an object with `scene:` | `scenes-<id>.ts`, `public/scenes/<room>/` |
| Touch | A diamond marker inside a room. It gives a small effect and a short discovery | `hotspots` of a room |
| Card | The text panel for an object: tagline, blurb, flavours, partners | `ui.ts` renders it from the object |
| Recipe add-on | The optional layer of matched dishes on cards and in rooms. Off by default, switched on under **Recipes** in the settings panel | `isRecipeLayerEnabled` in `src/data.ts`; gated in `ui.ts`, `scene.ts` and `main.ts` |
| Story depth | Optional long reading with dates and sources under a card | `<id>-stories.ts` |
| Discovery cue | The small ivory-and-brass diamond over every clickable object in the 3D world | `discoveryCues: true` in `buildWorld` |

## 2. Scale and numbers

Use these numbers. They come from the China code.

| Item | Value |
| --- | --- |
| World unit | About one metre. A person is 1.18 units tall. Hats end below 1.3 |
| House footprint | `house(style, w = 3, d = 2.4, h = 1.8)` |
| China table | `W: 112, D: 84`, centre offset `cx: -6` |
| Middle East table | `W: 124, D: 132`, centre offset `cz: 10` |
| Road width | 1.6 for lanes, 1.8 for town streets, 2.6 for the main street |
| River width | 3.4 default in `addWater`; irrigation 0.65 |
| Path colour | `#cdbb94` default, `#c9bfa0` for a northern street, `#c9c2aa` for a towpath |
| Walker speed | About 0.01 of a loop per second on a town street, 0.008 on a long road |
| Camera arrival | 1.6 seconds from click to close view. The first food movement must still be visible then |
| Seat height | Stool top 0.42. A seated `person()` goes at `seatTop - 0.44` because the hips are at 0.44 |
| Hand position | `arms.hand` is `-0.37 * figureScale` below the arm pivot. Put held tools there |
| Speech | One bubble at a time in the whole world. Background lines wait 18 to 28 seconds |
| Phone viewport | 390 x 844. Desktop check 1280 x 720 and one large screen |
| Zoom-out limit | 90 on phones for every world; 215 on desktop for the Middle East |
| Room stage | 1600 x 900 stage units. A wide painting is 1672 x 941 and fills the stage at (-8, -5) as 1616 x 910 |

## 3. Files for one area

Use the modular layout. Turkey (`turkey-*.ts` inside `world-mideast.ts`) is the model. China is one large file because it came first; do not copy that shape.

Reasons for the modular layout:

- Several agents can work at the same time. Each agent owns files, not line ranges
- Each file has one subject. A reviewer can read the people file without the landscape file
- Tests can bundle one module. `scripts/tests/turkey-reactions.mjs` loads `props-turkey.ts` alone
- A world file stays short. `world-mideast.ts` is about 200 lines and calls the modules

Create these files for an area with id `<id>` (for example `spain`):

| File | Contents | Size guide |
| --- | --- | --- |
| `src/fw/world-<world>.ts` | `buildWorld` spec and a `layout` that calls the modules. When the area joins an existing world, edit that world's file | Under 250 lines |
| `src/fw/<id>-landscape.ts` | Ground tints, water curves, coast, mountains, terraces | Data first, geometry second |
| `src/fw/<id>-architecture.ts` | The palette constant, house builders, roofs, walls, arches | Pure builders, no positions |
| `src/fw/<id>-town.ts` | Clusters, streets, squares, decorative buildings, landmarks. Positions live here | One exported `townStreets(ctx)` |
| `src/fw/<id>-people.ts` | `<id>Resident(seed)` and `<id>Walk(person, from, to, range, seed)`. Clothing styles as data | Follow `turkey-people.ts` |
| `src/fw/<id>-countryside.ts` | Fields, orchards, animals, threshing floors | One exported `<id>Countryside(ctx)` |
| `src/fw/props-<id>.ts` | One stand function per object, `<ID>_PROPS`, `<ID>_ICONS`, `<ID>_LINES` | The largest file |
| `src/fw/<id>-objects.ts` | `WorldObject` entries, `<ID>_CARD_ART`, `<ID>_NEXT` | Data only |
| `src/fw/<id>-stories.ts` | `<ID>_STORY_DEPTH` and `<ID>_SOURCES` | Text and links |
| `src/fw/<id>-repertoire.ts` | `<ID>_REPERTOIRE`: what every room and place cooks, the hero dish first | Data only |
| `src/fw/scenes-<id>.ts` | Rooms as `paintedScene` configs, exported as `<ID>_SCENES` | One entry per room |
| `src/fw/<id>-ambience.ts` | `<ID>_AMBIENCE`: always-on painting motion per room | Rectangles per orientation |
| `scripts/tests/<id>-reactions.mjs` | Stand reaction order, bounded repeats, clean-up | Copy `xinjiang-reactions.mjs` |
| `scripts/tests/<id>-world.mjs` | Routes, supports, zoom limits, coplanar faces | Copy `turkey-world.mjs` |
| `scripts/scenes/import-<id>.py` | Copies the delivered paintings into place and registers their sizes | Copy `import-turkey.py` |
| `docs/<id>-world.md` | What was built, the animation inventory, what was checked | Follow `turkey-world.md` |

Assets:

| Path | Contents |
| --- | --- |
| `public/scenes/<room>/wide.jpg` | The wide painting, JPEG quality 88 |
| `public/scenes/<room>/portrait.jpg` | The independently composed portrait painting |
| `public/scenes/<id>-food/<name>.webp` | Card illustrations on transparent background |
| `public/scenes/props/<name>.webp` | Shared sprites that hang or stand in a room. Long side 960 px maximum |
| `src/fw/scenes-props.json` | Registered sizes of every room painting (`rooms`) and sprite (`props`). The cutter writes it |

## 4. Registration checklist

Do these steps in order. Steps 1 to 7 apply to a new area inside an existing world. Steps 8 to 15 apply only to a new world. Step 16 applies to both. Card-only objects inside an existing world, like Turkey's Black Sea stops, need only steps 3, 5 and 16 plus a `<ID>_SOURCES` entry.

1. Add the area ids to the `Area` union in `graph.ts`
2. Add one `AREAS` entry per area: `name`, `zh` (the local-language name), `blurb`, `center`, `world`. The location picker reads it. The country navigation groups areas of one country under one button, as `ui.ts` does for Turkey
3. Export the objects from `<id>-objects.ts` and spread them into the world's object list in `graph.ts`. Object ids are unique across all worlds. Add a world suffix when a name repeats, for example `oliveTr`
4. Give each object the fields in section 6. Set `scene:` on objects that open a room
5. Spread `<ID>_PROPS` into the world's `props` in `buildWorld`. Every `prop:` name must exist there
6. Spread `<ID>_SCENES` into `SCENES` in `main.ts`
7. Hook card art: `cardArt()` in `ui.ts` maps object ids to files. Extend the branch for your world, as `TURKEY_CARD_ART` does
8. New world only: add the id to `WorldId`, `WORLDS`, `MAP_REGIONS` (with `built: true`, `cuisines`, `pos`, `size`, `color`, `emoji`)
9. New world only, and only when the recipe add-on is being extended to the world: add `is<World>Recipe` and extend `worldRecipes` and `enrich` in `graph.ts`; add `ENRICH` rows so each recipe has `area`, `core`, `techniques`, `place`. This is a separate, later task and never blocks the area (see section 6.2)
10. New world only: add the `build<World>` branch to `getWorld` in `main.ts`
11. New world only: add `<ID>_ICONS` and `<ID>_PROPS` to the lookup in `snapshot.ts`, and `ICON_KEYS` entries in `ui.ts` for objects whose card badge is a rendered prop
12. New world only: add an atlas preview branch in `map.ts`
13. New world only: add a `WORLD_INTROS` entry in `world-intros.ts`. Summary 60 to 180 characters, three to six beats, each body 420 characters maximum. The test `world-intros.mjs` enforces this
14. New world only, with step 9: add the recipe filter to `scripts/export-static.mjs`
15. New world only: add the id to `PUBLISHED_WORLDS` in `world-availability.ts` when the world is finished. Without this the public page shows it asleep. Update `world-availability.mjs`
16. Add one line to `README.md` and write `docs/<id>-world.md`

## 5. Stands: the China standard

The hotpot house in `props.ts` (`hotpot()`) is the standard for a main food stand. It contains:

| Component | In hotpot | Rule for a new main stand |
| --- | --- | --- |
| Building | A `house("sichuan", 3.5, 2.8, 1.8)` with a red sign board | One building or shelter from the area's architecture file |
| Work surface | A round table with a copper pot, a divider, a burner | The food surface is visible from above and from the front |
| Food, modelled | Chilli cones and greens in the broth, four platters of raw ingredients, a three-tier trolley with nine dishes, three beer bottles | At least three named foods, each a recognisable shape and colour |
| Always-on motion | Eight broth bits circle and bob every frame | One food or material loop that never stops |
| People | Four seated diners, one couple at a second table, one waiter, two people waiting | Six to nine people with different shirt colours and jobs |
| Idle body motion | Diners sway, lean and turn slowly; the queue looks around | Every person moves a little. Nobody is a statue |
| Walking | The waiter sweeps an arc in front of the tables and never through the house | A walker uses `walk(t)` and follows a path that avoids walls |
| Light | Two lanterns under the front beam; an awning on the back edge only | Lanterns hang from a beam, under a roof edge, never in the air |
| Steam | `userData.steam` at the pot | One steam or smoke point per hot source |
| Click chain | `poke()`: the broth boils over first, the diners lean back and raise both arms, one speaks | Food or material first, worker second, one bystander third, speech last |
| Ambient speech | Six lines in Chinese and English through `ambientChat` | Four to eight lines in the local language and English |
| Decay | `reaction(0.5)`: the reaction fades in about two seconds | Every reaction returns to the exact rest pose |

A small ingredient stand (the chilli field, the jujube tree, the pepper tree) is simpler: one crop that responds, one or two workers, a card, no room.

### 5.1 Stand skeleton

```ts
export function paellaKitchen(): P {
  const g = group();
  add(g, spanishHouse("white", 3.4, 2.6, 1.9), 0, 0, -1.6);        // building at the back
  const pan = add(g, cyl(0.7, 0.65, 0.08, "#8a8f94", 20), 0, 0.82, 1.2); // work surface, visible
  const rice: THREE.Mesh[] = [];                                     // modelled food, found again by hopFood
  const cook = person("#e9d7b8", { apron: true }); add(g, cook, 0.9, 0, 1.4); cook.rotation.y = -1.2;
  const diners = [/* seated persons at seatTop - 0.44 */];
  g.userData.steam = new THREE.Vector3(0, 1.0, 1.2);
  const re = reaction(0.6);
  const chat = ambientChat(g, ES_LINES);
  g.userData.ownReaction = true;                                     // the stand animates itself; no generic bounce
  g.userData.poke = () => { re.poke(); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    // 1. food first: rice simmers always, jumps on k
    hopFood(g, k, t, dt);
    // 2. worker second: the cook's arm follows with a delay tied to k
    // 3. one bystander third; 4. speech last, when k has passed its peak
    if (k > 0.55 && k < 0.6) bubble(pick(diners), pick(ES_LINES), 1.4, 1800);
    chat(dt);
    tickChildren(g)(t, dt);
  };
  return g;
}
```

Rules that the tests enforce:

- `poke()` alone produces no bubble. Speech appears in a later `tick` (`turkey-reactions.mjs`, `xinjiang-reactions.mjs`)
- Repeated clicks do not add geometry without limit. Falling fruit is removed after it lands (`xinjiang-reactions.mjs`)
- A seated person's lowest point rests on the seat, within 0.002 (`prop-supports.mjs`)
- A lantern's cord starts at a beam, not in the air (`prop-supports.mjs`)
- Walkers never intersect walls or terraces (`prop-supports.mjs`, `turkey-world.mjs`)
- Many stands never speak over each other (`village-speech.mjs`)

Rules that only a browser check can prove:

- The click reaction is readable at the normal world zoom after the 1.6-second approach
- A chef's arm swing is not the main reaction, and no person shakes
- Nothing floats, nothing walks through a wall, every click does something

### 5.2 Motion helpers

| Need | Helper | File | Notes |
| --- | --- | --- | --- |
| A click that fades | `reaction(rate)` | `props.ts` | `poke()` sets `k = 1`; `step(dt)` returns `k`. Multiply amplitudes by `k`, never speeds |
| Food that jumps and turns on a tap | `hopFood(g, k, t, dt)` | `props.ts` | Finds small meshes with a colour in `FOOD_COLORS`, skips meshes inside people. Add new food colours to the set |
| Occasional talk | `ambientChat(g, lines)` | `props.ts` | Call the returned function every tick. Uses the shared speech cooldown |
| One line now | `bubble(obj, text, y, ms)` | `props.ts` | Taps replace background speech |
| Swaying strings | `hang(x, y)` pattern | `props-north.ts` `northDetail` | A pivot group at the tie point; rotate `z` by `sin(t * 1.3 + i) * 0.06` |
| Falling fruit with gravity | `jujubeTree()` | `props-north.ts` | Copies dates from the crown, `v += dt * 9`, settles at `y = 0.06`, removed after four seconds |
| Nested props that tick | `tickChildren(g)` | `props.ts` | Call at the end of the stand's tick so lanterns and chimneys animate |
| A person | `person(shirt, { hat, pole, apron })` | `props.ts` | `userData.upper`, `legs`, `arms`, `sit()`, `walk(t)`, `figureScale` |
| Clothing on a person | `wear(p, mesh, x, y, z)` | `props.ts` | Attaches to the upper body so it leans with it |
| A regional resident | `turkeyResident(seed, working)` | `turkey-people.ts` | Recolours skin, hair, trousers; adds coats, sashes, scarves. Copy this for a new area |
| A walk with real steps and a pause | `turkeyWalk(p, from, to, range, seed)` | `turkey-people.ts` | Steps match distance. The person stops stepping when standing |
| A loop walk on a curve | `nPath` pattern | `world-china.ts` | `CatmullRomCurve3` closed; `u = (t * speed + i * 0.2) % 1`; `rotation.y` from the tangent |
| A camel | `camelWalker()` and `camel-gait.ts` | `props-xinjiang.ts` | Legs rotate about `z`, never `x`. The gait test checks planted feet |
| Steam or smoke | `userData.steam`, `userData.smoke` | any stand | A `Vector3` in the stand's local space. The engine draws the puffs |
| A Turkey-style stand in one call | `life(g, people, phrase, work?, onPoke?)` | `props-turkey.ts` (module-private; copy it into `props-<id>.ts`) | Sets `ownReaction`, decays the reaction over 3.5 s, moves every mesh tagged `userData.foodReaction` (`simit`, `knead`, `roll`, `grill`, `puff`, `sheet`, `serve`, `contents`, `cup`, `flip`, `carve`) first, then the worker's arm, then speech through `deferredBubble`, then `ambientChat` |
| Fruit that falls into baskets | `harvest(g, trees, baskets)` | `props-turkey.ts` (module-private) | Trees carry `userData.crown` and `userData.fruits`; the nearest three shake and drop copies that land, bounce and clean up after 3.6 s; repeats stay under 24 |
| A timed beat inside a reaction | `beat(k, start, end)` | `props-turkey.ts` | A sine pulse that runs between two points of the decaying reaction `k` |

### 5.3 Building and landscape helpers

| Need | Helper | File |
| --- | --- | --- |
| Primitives | `box`, `cyl`, `cone`, `ball`, `mat`, `smooth`, `stem`, `add`, `group`, `rnd`, `pick`, `C` colours | `props.ts` |
| Chinese house, three styles | `house("sichuan" \| "jiangnan" \| "northern", w, d, h, storeys)` | `props.ts` |
| Ottoman house, five styles | `ottomanHouse(color, storeys, style)` | `turkey-architecture.ts` |
| Roofs | `chineseRoof`, `pavilionRoof`, `hipRoof`, `dome` | `props.ts`, `turkey-architecture.ts` |
| Walls, arches, tile | `brickWall`, `gate`, `masonry`, `arch`, `tilePanel`, `kilim` | `props-north.ts`, `turkey-architecture.ts` |
| Awning, lantern, sign | `awning`, `lantern`, `lanternString`, `signBoard(g, w, h, x, y, z, text)` | `props.ts`, `props-north.ts` |
| Landmarks | `temple`, `pagoda`, `gate`, `dragon`, `bathhouse`, `iznikFountain`, `turkeyMosque`, `turkeyBazaar` | `props.ts`, `turkey-*.ts` |
| Trees | `tree("round" \| "pine" \| "willow" \| "bamboo" \| "blossom" \| "ginkgo" \| "persimmon", scale)`, `poplar`, `osmanthusTree` | `props.ts`, `props-xinjiang.ts`, `props-jiangnan.ts` |
| Terrain | `mountain(r, h, dark)`, `terrace(levels, r, tea)`, `pond()`, `ricePaddy`, `wheatField`, `chilliField` | `props.ts` |
| Raised ground with stairs | `terrace(ctx, x, z, rx, rz, height, color)`, `terraceStairs` | `turkey-landscape.ts` |
| Roads | `path(points, width, color)` | `props.ts` |
| Water | `addWater(ctx, curve, width)`, `seaWater()`, `freshWater()`, `estuaryWater(x, z, r)`, `addFish`, `addRiverJunction` | `worldkit.ts`, `river-junction.ts` |
| Bridges and boats | `bridge(len)`, `woodenBridge(len)`, `boat()` | `props.ts` |
| Animals | `cow`, `pig`, `chicken`, `coop`, `goat`, `fish`, `birds`, `butterfly`, `crane`, `panda`, `fatTailSheep`, `turkishCat` | `props.ts`, `props-xinjiang.ts`, `props-turkey.ts` |
| Ground colour | `ctx.tint(x, z, rx, rz, color, rot)` | `LayoutCtx` |
| Placing | `ctx.place(obj, x, z, rot, scale)` | `LayoutCtx` |

Prop gotcha: `add(parent, child, x, y, z)` sets the child's position. Pass offsets as arguments. Do not set `position` before `add`.

Water rules: seas use `seaWater()`, rivers and ponds use `freshWater()`, a river that meets the sea uses `estuaryWater`. A river that reaches the table edge ends with two points at the same edge coordinate so the cap is square. Nothing walks or stands in water.

Road rules: one continuous ribbon per route. Two ribbons at the same height flicker where they overlap; lift the second by `0.004`. Every door and gathering place meets a road.

Flicker rules: two horizontal surfaces closer than about 0.01 in height z-fight at world zoom, and the flicker shows most while the camera moves. One ground per spot: a stand placed on town paving has no floor plane of its own. Squares and courtyards sit 0.008 or more above the paving they cover; lanes carry `polygonOffset` so they win over squares. `node scripts/audit/flicker.mjs <world-module> <build-fn> <x> <z> <radius>` lists every upward face near a point by height and reports exact coplanar overlaps; run it on any spot the owner reports as flickering, and on every new cluster before review.

## 6. Objects and cards

Each `WorldObject` has these fields:

| Field | Value |
| --- | --- |
| `id` | Unique across all worlds |
| `world`, `area`, `kind` | `kind` is `place`, `ingredient`, `flavour`, `technique`, `landmark` or `dish` |
| `name`, `placeName`, `zh`, `emoji` | `zh` holds the local-language name for any world |
| `pos`, `rot`, `elevation` | World coordinates. `elevation` lifts the stand onto a terrace |
| `prop` | A key in the world's `props`. `"none"` with `hitOnly: true` and `hit: [w, h, d, cy]` for an invisible click box |
| `place: true` | Dishes may sit here |
| `scene` | The room id this object opens |
| `tagline` | One sentence, under 80 characters |
| `blurb` | Three to five paragraphs separated by `\n\n`. See the standard below |
| `match(r)` | Which recipes live here, when the recipe add-on is on. Use `has(r.core, /regex/)` or `r.place === id`. Never evaluated while the add-on is off |

The China blurb standard (see `hotpot`, `dumpling`, `teahouse` in `graph.ts`):

- Paragraph 1: When and where the food or place began, with a dated era in brackets, for example "late Qing dynasty (1800s)"
- Paragraph 2: The ingredients and the method, with the local names in the local script
- Paragraph 3: How people eat it today and what it means socially
- Paragraph 4 or 5, optional: A regional variant or a comparison with another area
- Dates describe records, not invented birthdays. Say "first written down in" or "a record from" when that is the evidence
- Distinguish a legend from a document. Write "legend puts" for a legend

Story depth (`<ID>_STORY_DEPTH`) adds three paragraphs of dated history with sources for objects that open rooms. `<ID>_NEXT` links each card to two related objects.

Card art: `<ID>_CARD_ART` maps an object id to a WebP in `public/scenes/<id>-food/`. Objects without art show a rendered snapshot of the prop.

### 6.1 A place is not one dish: the repertoire

A kitchen cooks a list. A noodle shop is not one bowl, a tapas counter is not one plate, and a card that names a
single dish tells the visitor less than the place does. So every room and every place-or-dish object declares its
repertoire as **world content**: the hero dish first, then the dishes that kitchen actually cooks. It is there
with the recipe add-on off, because that is the picture the area is built and reviewed against.

One table per world, owned by that world's Researcher, keyed by the object id (or the room id) it belongs to:

```ts
// src/fw/<id>-repertoire.ts
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };

export const SPAIN_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  plancha: [
    { name: "Patatas bravas", zh: "Patatas bravas", line: "Fried potato under a paprika and oil sauce, the plate that arrives first on this counter and is eaten standing." },
    // … the rest of what this counter cooks
  ],
};
```

| Field | Value |
| --- | --- |
| `name` | The dish in English, as the card heads the entry |
| `zh` | The local name, in the local script or spelling. Drawn in the card's `.zh` style beside the name |
| `line` | One line, **12 to 25 words**, saying what it is and why it belongs to this place. Not a recipe step |
| `recipe` | Optional. An exact id from `public/static/recipes.json`. It is what the add-on links to |
| `art` | Optional. A file stem under `public/scenes/<world>-dishes/`, drawn as a small square thumbnail before the name |

**Repertoire pictures: none yet.** The owner set this aside on 2026-09-17 as a to-do for later, not for this
pass. Later, one image brief per world for small square dish illustrations, hero dishes first, delivered like
the card art and imported by the area's import script; until then the list is text, and `art` stays unset.

Rules:

- The **hero dish is the first entry**. The card draws a red rule beside it
- A single-dish place gets a list of one. One cart, one dish is a real answer; leaving the place silent is not
- Every key must be a real object id or a real room id, and a key belongs to one world's table only
- Every **kitchen** room is covered: a room whose object is a `place` or a `dish`. A landmark room — a stone
  bridge, a hutong lane, the Tianshan snowmelt — has no kitchen and carries no list, and a "What this kitchen
  cooks" heading over a mountain would be wrong
- The `recipe` id is exact. A guess that resolves to nothing fails `scripts/tests/repertoire.mjs`

Where it renders: `src/fw/repertoire.ts` merges the three tables behind `repertoireOf(objectId)` and draws the
card section in `ui.ts` `showObject`, after the story text and before "Often paired with". The heading is **What
this kitchen cooks** for a place, a room or a landmark, and **How it is served** for an object whose `kind` is
`dish` and which opens no room — a dish that opens a painted room, like the hotpot house, is a kitchen and takes
the kitchen heading. An object with no repertoire gets no section and no leftover heading.

A room has no story panel of its own: its "The story" button opens the place's card, so the room's repertoire is
that card's list and the room bar below the title stays the stands and one button.

With the add-on on, an entry whose `recipe` id is a recipe that really loaded grows a small **Recipe ↗** link
that opens the existing preview through the card's `[data-recipe]` handling. Nothing else changes, and a place
with a repertoire never shows the add-on's fuzzy "Related recipes" rows — it has said what it cooks. Those rows
now belong to the objects without a repertoire: the ingredients.

### 6.2 Recipes are an add-on, not part of an area

Recipes are a layer over a finished world, not a property of it. The switch lives in the settings panel as
**Recipes**, with the line "Show the family recipes that match each place" under it. It is **off by default**,
remembered in `localStorage` under `food-tour:recipes`, and off whenever storage is unavailable.

The owner asked for this on 2026-09-17: "remove the recipe layer, make it something like an add-on which people
can turn on and off. It's too much to also perfect them while I'm creating the world, and the dishes are random
currently and distracting on the cards."

What that means for an area:

- **Build and review every area with the add-on off.** That is the picture the owner opens and the definition of
  done in the playbook applies to it. A card ends at "Often paired with"; a room's actions hold only "The story"
- **Matching recipes to an area is a separate, later task** and is never part of an area's definition of done. A
  card whose dishes are wrong or random is a recipe task, not an area defect
- Leave `match(r)` on every object. The predicates stay in the data files and are simply not evaluated while the
  add-on is off. Do not delete one and do not add one to finish an area

Where it is gated:

| Surface | Gate |
| --- | --- |
| The fetch | `main.ts` calls `fetchRecipes()` only when the add-on is on — at boot when it was already on, otherwise at the moment it is switched on. Nothing is requested while it is off |
| Card "Related recipes" | `ui.ts` `showObject` drops the recipes it is handed, so the heading and `.dishes` rows are absent, not empty |
| Card repertoire links | `repertoire.ts` `repertoireRecipe` returns nothing while the add-on is off, so the list is there and the **Recipe ↗** links are not |
| Room "FROM THIS KITCHEN" | `scene.ts` `sceneDishRowHtml` returns the empty string, so `.scene-actions` holds only the story button |
| The recipe preview and page | Unreachable: nothing renders a `[data-recipe]` button. Switching off closes an open one |
| The atlas | `map.ts` takes no recipe counts at all; an island's clouds and signpost follow `region.built` |
| Live switching | `onRecipeLayerChange` in `data.ts`. `main.ts` refetches, redraws the open card and calls `livingScene.setDishes`, so the open card or room changes without a reload |

The 3D world, its stands, rooms, discovery cues and stories are identical with the add-on on and off. Only the
dish rows differ, and the repertoire list (section 6.1) is world content that stays either way.
`scripts/tests/recipe-addon.mjs` and `scripts/tests/repertoire.mjs` hold that line.

## 7. Rooms

A room is a `paintedScene(cfg)` call. The engine draws the painting, parallax, a warm light, steam, fire, lamps, motes, leaves, petals, mist, sky lanterns and hotspots. The room supplies coordinates.

```ts
const paellaCourtyard = (): SceneDef => paintedScene({
  id: "es_paella", folder: "es_paella", title: "Paella courtyard", zh: "Arrocería", caption: "One sentence about the room.",
  painting: true,
  steam: [{ x: 760, y: 560, w: 180, rate: 10, a: 0.28 }],            // wide coordinates, stage units
  fire: [{ x: 700, y: 640, rx: 60, ry: 30 }],
  portrait: {                                                          // the portrait is a different painting
    steam: [{ ...pAt("es_paella", 0.47, 0.62), w: 120, rate: 9, a: 0.28 }],
    fire: [{ ...pAt("es_paella", 0.45, 0.70), rx: 40, ry: 20 }],
  },
  hotspots: [/* section 7.2 */],
  ambience: ES_AMBIENCE.es_paella,
  light: { x: 750, y: 280, color: "rgba(255,210,150,0.16)" },
});
```

Rules the engine applies to every `painting: true` room except hotpot:

- `hang`, `front` and `walkers` are cleared. Sprites would duplicate the painting. Only one sky flyer survives in rooms listed in `flyersAllowed`
- Every configured steam source draws, up to four per room. Give every pictured hot dish, pot, kettle and tea glass a source in both orientations. The engine caps rate and opacity
- Ambience patches are limited so that steam, fire, a flyer and patches together stay at or under four loops. Hotpot is the ceiling
- The `PAINTED_SIGNATURES` entry for the room id defines its one signature motion. Add one per room
- `npm test` fails when a room has fewer than three always-on loops in either orientation (`room-loops.mjs`). Count: signature + steam + fire + flyer + patches
- The painting loads before any layer draws: the room fetches only the orientation on screen, shows `preview-<orientation>.jpg` blurred while it waits, and keeps every effect, sprite, glint, hotspot and panel hidden until the picture has loaded. Paintings are prefetched — every room of a world in idle time, and the room being walked up to at once — so run `uv run --with pillow scripts/scenes/room-previews.py` after any importer that adds or replaces a room picture

Fire ellipses show in both orientations unless the portrait declares its own `fire` list. Write `portrait: { fire: [] }` when the flame is visible only in the wide painting. Steam behaves the same way: `portrait: { steam: [] }` hides a wide-only source on phones.

### 7.1 Coordinates

- Wide: stage units. `x = fx * 1600`, `y = fy * 900` from fractions of the wide painting
- Portrait: use `pAt(folder, fx, fy)` with fractions of the portrait painting. It reads the portrait size from `scenes-props.json`, so the room must be registered there first
- Measure every coordinate on the actual painting. Do not copy wide fractions to portrait

### 7.2 Touches

A touch is a `SceneHotspot` with an `interaction`:

```ts
{ id: "es_paella-0", label: "Lift the rice", text: "One or two sentences of discovery.",
  x: 0.42 * 1600, y: 0.66 * 900, portrait: pAt("es_paella", 0.47, 0.62),
  interaction: { effect: "tea", icon: "♨", wide: [0.42, 0.66], phone: [0.47, 0.62], extent: [0.10, 0.22], folder: "es_paella", food: "paella" } }
```

Effects and their meaning:

| Effect | Local response | Icon |
| --- | --- | --- |
| `detail` | A highlight and the discovery text only | ⌕ |
| `tea` | Steam from the pictured vessel | ♨ |
| `sizzle` | Sparks and heat over a pictured pan or grill | ♨ |
| `flour` | A puff of flour over a board | ⋯ |
| `leaves` | A few leaves move near pictured foliage | ❧ |
| `water` | One ripple on pictured open water, only when no boat, person or post shares the box | ≈ |
| `light` | A pictured lamp brightens | ☼ |
| `chime` | A pictured bell rings | ♪ |
| `purr`, `woof` | A pictured cat or dog answers | ♡ |

Every response is silent. The world has no sound; the removal on 2026-09-17 took out the `room-sound` module, its harness, the bundled recording and the Sound switch.

Give each room two or three touches. Each touch names something visible in both paintings. The `text` states one fact. `scene-discoveries.ts` keeps the sources for specialist facts; add yours there.

### 7.3 Ambience

`AmbientPatch` entries are always-on movement aligned to the painting:

```ts
{ kind: "leaves", wide: [.70, .02, .94, .30], phone: [.63, .035, .92, .20], leaf: "yellow", color: "#c99235" }
{ kind: "breeze", wide: [.32, .02, .36, .13], phone: [.75, .03, .82, .14], period: 5.8, sway: [.14, .15], source: "grape" }
{ kind: "birds", wide: [.58, .025, .95, .18], phone: [.56, .025, .98, .15], period: 11.5 }
```

Kinds and what each may sit on:

| Kind | Draws | Only on |
| --- | --- | --- |
| `leaves` | Four falling leaves. Default: painted hotpot leaf cutouts. `leaf: 'yellow'` small autumn leaves, `leaf: 'olive'` narrow evergreen leaves; `color` tints them | Pictured foliage or an opening under trees |
| `birds` | Two small distant silhouettes crossing; `period` seconds per crossing | Real open sky |
| `mist` | Four soft fog banks drifting | Water or a valley that already shows haze |
| `light` | A slow warm radial shimmer; `color` | A pictured lamp, oven mouth or fire glow |
| `sunray` | One broad soft beam; `angles` per orientation | A room where the painting shows a light direction |
| `dust` | A soft flour puff | A pictured floured board or bowl |
| `snow` | Sixteen slow flakes | An outdoor opening in a winter painting |
| `rain` | Beads running down | Pictured wet glass |
| `embers` | Five rising sparks | A pictured flame |
| `stream-glint`, `waterfall-glint` | A travelling highlight along `paths` traced inside the box, per orientation | A painted liquid stream, traced exactly. An untraced box draws nothing |
| `breeze` | Cuts an isolated hanging detail out of the painting by colour (`isBreezePixel`, `source`) and sways it from its top edge; `sway` per orientation, `period` | **Last resort.** One hanging bunch, alone in the box, on a plain low-detail background the row-fill repair can rebuild — see the rule below |

Nothing else is allowed on a finished painting. If a room needs a moving object the painting does not contain, request a sprite. Inspect every breeze mask with `scripts/audit/breeze-masks.py` and look at the isolated foreground on grey; a face, wall, lantern, shelf or pole in it fails the room.

**When a `breeze` is allowed at all (2026-09-17).** The owner rejected these twice: in Spain on 2026-09-16 ("it's just not natural") and in China on 2026-09-17 ("the wrongly cropped chillies are also here in the Sichuan home kitchen"). A `breeze` repairs the hole it cuts by averaging wall pixels along each row and then down the column. That only works where the background is plain and low-detail. It fails, visibly and at rest, on painted foliage, on a busy shop front, on a person, and wherever the box edge crosses a different material — you get a flat rectangle sitting on the picture. Before enabling one, render it the way the room will draw it: repaired background, then the isolated foreground rotated about the top centre of the box, at rest and at both ends of the sway, with fifty pixels of context around the box. If any panel shows a patch, a seam or a colour block, the crop fails. Then choose, in this order:

1. **Hang a sprite instead**, if one exists in `public/scenes/props`, and paint the painted subject out of the picture first with `scripts/scenes/paint-out-strings.py`, so the sprite has clean wall behind it as the hotpot lanterns do. A sprite over a painted twin is not enough; the owner saw the twin through the gaps.
2. **Leave the subject still** and give the room's loop to a lamp, a fire, a canopy, a beam, birds or a stream glint the painting already shows. A still string is better than a wrong one.

Spain now uses no breeze at all. In China every crop was rendered this way on 2026-09-17 and only two survived, **wide only**: `hutong` (one chilli string on flat vertical planks) and `stone_bridge` (willow leaves moving inside more willow), because their background is plain or is the same material as the subject. Eight crops came out: the `home_kitchen` and `market` chilli signatures, the `teahouse` tassel, the `tower` tassel (it took the whole paper lantern and left a seam beside it) and the `tower` bell (it smeared the carved eave), the `bing_stall` chilli (a pale block on a shop front of shelves and baskets), the `noodle_workshop` garlic (its key took the noodle maker's dark hair and the repair carved a grey patch out of her head), and the portrait halves of the two survivors — `hutong` portrait chops the door frame and speckles a cook's hair, `stone_bridge` portrait duplicates a roof ridge and a white gable. A crop that works in one orientation is not evidence for the other: render both.

`room-loops.mjs` now asserts that list, so putting a China crop back means doing the render check first. `scripts/audit/breeze-masks.py` also reads the inline `ambience` in `scenes-*.ts` as of the same day; before that it only read `scene-ambience.ts` and the `*-ambience.ts` files, which is how six China crops shipped without ever being inspected by the tool the definition of done names. The grape key matches purple hues only; a green bunch needs a different subject. A tight box needs a larger `sway` so the tip still travels 14 px; `scene-ambience.mjs` checks this.

Test each room with `scene-ambience.mjs` style checks: steam visible at time zero, portrait steam at its own coordinates, no steam at wide coordinates after rotation.

Measure whether the loops can be seen. Capture two composites two seconds apart for every room (`__fw.open(id)`, `step(60)`, `__fw.sceneShot('rm-<id>-a')`, `step(120)`, `__fw.sceneShot('rm-<id>-b')`, `__fw.closeScene()`), then run `uv run --with pillow --with numpy scripts/audit/room-motion.py .data/shots`. It prints the share of the frame that changed. Rooms with hot food or mist reach 3 percent or more. Outdoor rooms that live on crisp small motion score lower; they need at least one medium cue that reads on a phone: birds at `scale` 1.4 or more with `period` 8, six or more leaves at `size` 1.2 or more, or a breeze bunch that swings. A room under 2.5 percent with no such cue fails. The Turkish tea hill measured 0.3 percent before this rule and 3 percent after steam from its samovar, a readable mist and larger, more frequent birds.

Tunable strengths: `alpha` on `mist` (default .40; use .55 where the painting behind is already hazy), `scale` and `period` on `birds`, `count` and `size` on `leaves`, `sway` on `sunray` (the drift of the beam; .04 reads, .012 does not), `sway` on `breeze`.

### 7.4 Asset import

1. Receive the paintings. Check each file's size. Wide 1672 x 941, portrait 941 x 1672. Other sizes need a new `paintingFrame` in `scene-ambience.ts`; report this rather than upscaling
2. Copy `scripts/scenes/import-turkey.py` to `import-<id>.py`. Map delivered file names to room ids. Map card illustrations to object ids
3. Run it with `uv run --with pillow scripts/scenes/import-<id>.py "<delivered folder>"`. It writes the JPEGs, the WebPs and the sizes in `scenes-props.json`
4. Sprites on white or black backgrounds go through `scripts/scenes/cut-props.py`, which trims, keys and edge-bleeds them into `public/scenes/props/`
5. Open `scripts/tests/room-audit.html` in the dev server and look at every room in both orientations

## 8. People and movement rules

- Every area has its own resident builder with varied heights, builds, skin, hair, clothing and carried things. Eight profiles is the Turkey count
- Steps match distance. A standing person does not step. `turkeyWalk` does this; the China loop walkers use `walk(t)` continuously, which is acceptable only on a continuous loop
- Lanes are straight segments or smooth curves that never cross a wall, a stand footprint or water. Keep 1.6 units between parallel lanes
- The torso bob lives on `upper.position.y`, so a walker on a bridge deck stays on the deck
- Animals stay in pens or on their own path. Nothing enters water except boats and fish
- Every seat has a person or a reason to be empty. Every person has a job or a destination
- Bubbles speak the local language plus English on one line: `"¡Salud! Cheers!"`

## 9. Tests and verification

Run before every commit:

```bash
npm run typecheck
```

```bash
npm test
```

`npm test` runs every `scripts/tests/*.mjs` harness. Each bundles the real modules with rolldown and asserts geometry and timing. The set takes about twenty seconds.

| Harness | Checks |
| --- | --- |
| `room-loops.mjs` | Every painted room has three or four always-on loops in wide and portrait |
| `object-ids.mjs` | Object ids are unique across every world; every alias and parent resolves |
| `prop-supports.mjs` | Lantern cords start at a beam; bench guests rest on the seat; village walkers cross no wall |
| `prop-reactions.mjs` | Room touch effects are local, bounded and use no inserted images |
| `village-speech.mjs` | One bubble at a time; two to seven background lines in two minutes; taps replace bubbles |
| `scene-ambience.mjs` | Steam is visible on entry; portrait steam has its own coordinates |
| `room-controls.mjs` | Touch reactions return true; specific plumes keep their size and place |
| `turkey-reactions.mjs`, `xinjiang-reactions.mjs` | Food moves before speech; repeats stay bounded; falling items clean up; `ownReaction` set |
| `turkey-world.mjs` | Zoom limits; stairs are continuous flights; no coplanar overlapping faces; a 240-second route and support simulation |
| `camel-gait.mjs` | A foot is always planted; joint reach; loop continuity |
| `world-availability.mjs`, `world-intros.mjs` | The public page shows only finished worlds; every world has a complete intro |
| `recipe-addon.mjs` | The recipe add-on is off by default; a card with it off carries no `.dishes` and no "Related recipes" heading even when the object matches recipes; both come back with it on; a room's dish row is nothing at all with it off |

Add `<id>-reactions.mjs` and `<id>-world.mjs` for a new area. Copy the nearest harness and change the ids.

Audit scripts in `scripts/audit/` are not tests but review tools: `objects.mjs` lists rooms and card-only clickable objects per area, `breeze-masks.py` renders every cropped mask for inspection, `flicker.mjs` lists ground planes by height around a point, `room-motion.py` ranks rooms by how much of the frame moves in two seconds. The [quality baseline](quality-baseline.md) records the numbers these tools reported at the last review; a session that changes a number must explain why.

Browser verification uses the dev server from `.claude/launch.json` (`food-tour-web`, port 5180) and the debug hooks on `window.__fw`:

| Hook | Use |
| --- | --- |
| `__fw.enter("middle-east")` | Enter a world from the atlas |
| `__fw.look(x, z, dist)` | Move the camera |
| `__fw.step(n)` | Render `n` frames while the pane is hidden |
| `__fw.open(id)` | Click an object |
| `__fw.shot(name)` | Save the canvas to `.data/shots/<name>.jpg` through the dev API |
| `__fw.sceneShot(name)` | Save the open room's composite |
| `__fw.closeScene()` | Close the room before opening the next |
| `__fw.audit(seconds)` | Report anything that walks into water, walls or each other |
| `__fw.figures()` | Show the person rig in six poses |
| `window.__fwInstant = true` | Skip scene fade timers in a hidden pane |

Check at 1280 x 720, at 390 x 844 and on one large screen. Watch each room for twenty seconds before clicking. Click every stand from the direction a visitor would use. Screenshots prove composition. Only watching proves motion.

HTML harnesses in `scripts/tests/` open in the dev server: `room-audit.html` (every room, both orientations), `ambient-motion.html` (canvas pixels composited over the real JPEG), `china-prop-audit.html` (support audit), `camel-walk.html`, `building-cutaways.html`, `turkey.html`.

## 10. Publish

```bash
npm run build:pages
```

Commit with the project's author identity, push `main`, and watch the Pages run:

```bash
gh run watch --exit-status
```

`.github/workflows/pages.yml` builds on every push to `main` and deploys to https://fyyying.github.io/food-world/. Verify the live site on a phone-sized viewport after the run succeeds.
