# Spain world

Spain joins the Mediterranean world as the western area of the table. This document follows the [team playbook](agent-team-playbook.md): it records the session baseline, the Stage A research hand-off, the shared contracts, and later the build, the animation inventory and the checks. The pictures did not exist at kick-off; the [image brief](spain-image-brief.md) is the Stage A deliverable and the build waits for the files.

## Stage 0: session baseline, 2026-09-15

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | 14 harnesses pass |
| `node scripts/audit/objects.mjs` | Matches the [quality baseline](quality-baseline.md): Sichuan 9, Jiangnan 6, Northern 5, Xinjiang 4, Everyday 1, Istanbul 5, Anatolia 3, Aegean 2, Black Sea 3, Levant 7, Arabia 3, Persia 2 card-only clickables; rooms unchanged |
| Breeze masks | Not re-run; no mask changed since the baseline (working tree clean at `674823f`) |
| Live world | Looked at China (Sichuan and Jiangnan clusters, the river, the roads), the Turkish town (bazaar, hammam, mosque skyline, tram), the current Spain cluster, and the hotpot room at 1280 x 720 and 390 x 844. Nothing floated, flickered or crossed a wall at overview zoom |

Observations that are not defects but worth knowing:

- The dev-server render loop pauses while the Browser pane is hidden; `__fw.step(n)` renders frames explicitly and is needed before a room opens through `__fw.open`.
- The world selector label lags one world behind when a world is entered through `__fw.enter`. A visitor entering from the atlas does not see this.
- The portrait room capture in a hidden pane shows the paper fade half-way, as the quality baseline already notes. Judge portrait rooms in the live pane.

## What Spain is today

The Mediterranean table is 76 x 56 world units with the sea in the middle. Spain occupies the north-west corner, roughly x from -38 to -17 and z from -28 to 12. It has four card-only objects and no rooms:

| Object | Kind | Stand | Position |
| --- | --- | --- | --- |
| `fishMed` Fish & prawns, "The port" | ingredient | `fishingPort` | [-17, 1] |
| `oranges` Oranges & almonds | ingredient | `orangeGrove` | [-31, 9] |
| `plancha` Plancha & paella, "Tapas bar" | technique | `tapasBar` | [-25, 4] |
| `flamenco` Flamenco | landmark | `flamenco` | [-30, -24] |

The Alhambra at [-30, -14] is decoration without a card. Five pueblo houses, a plaza fountain, three cypresses and two umbrella pines fill the rest. One walker loop runs round the plaza. The Mediterranean world is not in `PUBLISHED_WORLDS`, so the public page shows it asleep; Greece, Morocco and Dalmatia are card-only areas at the same pre-China-standard level.

Two recipe rows already point at Spain: baked salmon opens at `fishMed` and Spanish simmered fish at `plancha`. Those two ids stay.

## Blueprint frame (provisional, Stage B fixes it)

The China standard needs four or more clusters, ten or more stands, five or more ingredient stops and at least three non-food clickables. The current 21 x 40 corner cannot hold that. The lead's proposal for Stage B:

- Grow the table westward: `W: 120, D: 60, cx: -22`, so x runs from -82 to 38 and every existing Greek, Moroccan and Dalmatian coordinate keeps its value. Spain then owns x from -80 to -18 and z from -28 to 28, about the footprint Turkey has on the Middle East table.
- The sea keeps its eastern shore at about x -18 and gains a northern strip along the table edge, wrapping the north-east corner, so the Cantabrian rooms, the Galician ría, the Catalan terrace and the Valencian port all face real water. Details are in the cluster contract below.
- One river rises in the western hills, runs east below the Plaza Mayor and reaches the sea at the port with an estuary blend. The Albufera paddies draw from it.
- Six clusters with provisional centres in the expanded frame: La Albufera y el Puerto (east coast), La Plaza Mayor (centre, the arrival view), El Patio y la Bodega (south-centre, the Alhambra behind on a rise), El Secano Manchego (west), La Ría (north-west, on the northern water), El Cantábrico i la Terrassa (north-east corner). Object positions below use these centres and are provisional until the lead draws the blueprint on paper coordinates.

Whether Spain stays one area id (`spain`, as the recipe mapping expects) or becomes one country button with sub-areas, as Turkey did, is decided in Stage B. Every object below carries `area: "spain"` until then.

## Stage A: research hand-off

The Researcher's delivery is [spain-research.md](spain-research.md): area brief, palette, clothing profiles with museum inventory numbers, proposed objects, room list, 46 food-accuracy corrections to the example prompt, dated story facts with sources, and open questions. This section records what the lead fixed from it. The [image brief](spain-image-brief.md) is the Stage A deliverable; Stage B waits for the files.

### Decisions on the researcher's open questions

| Question | Decision |
| --- | --- |
| Rooms: twelve or cut to ten | Twelve. The playbook allows ten to fifteen and Istanbul carries seven of Turkey's fifteen, so four rooms round the Plaza Mayor is in proportion. Budget rises to 42 images |
| Clothing period | One band, about 1880 to 1910, working clothes. The Museo del Traje's popular-dress collection is almost entirely from this band, and six rooms are anchored inside it by record |
| The gilda is only recorded from about 1946 | Paint the counter in period: the olive, the anchovy and the pickled guindilla in their own jars and dishes, one skewer built from them. The card carries the 1946 name as a reported date |
| Anchovy: salt-packed or fillet in oil | Salt-packed, from a tin or small barrel; the fillet in oil is itself dated 1883 |
| Market hall generation | Barcelona's 1876 to 1889 cast-iron halls or Madrid's La Cebada. Not Valencia's 1928 hall |
| Sangría at the tapas bar | Removed. Vermouth on tap, wine, a small beer |
| Pulpo room: harbour or fair | Inland fair under a granite arcade. The dish is a fair dish and the port already exists as `fishMed` |
| Two pours (cider and sherry) | Both kept. The cider is a wide breaking stream into a tilted glass at the pourer's feet in daylight; the sherry is a slow narrow thread in a dim shaft of light. The animation matrix compares them side by side in Stage C |
| Six or seven clusters | Six. The Basque and Catalan compression is made legible by wrapping one continuous coast from the north edge round the north-east corner: stone and slate in the north, render and tile as it turns south |
| `plancha` keeps its id but changes meaning | Yes. Every agent is told here: `plancha` is "The tapas bar" and opens `es_tapas`; its paella content moves to `paellaEs`; its blurb is rewritten so the tapa-as-lid story is labelled a legend. The Spanish simmered fish recipe keeps `place: "plancha"` |
| Unverified facts (RAE 1939 entry, gilda 1946, paella from patella, dehesa hectares, hórreo dates, vermouth) | Stay out of cards until verified in Stage C, or are written as "reported" with the range, as section 5 of the research says |

### Shared contract: the object list

Positions are in the expanded table frame proposed above (x from -80 to -18, z from -28 to 28) and were provisional until the Stage B blueprint. **They are the Stage A proposal and are now out of date**: the blueprint moved several, the Stage E repairs moved nine off the water, and the 2026-09-17 pass moved nine more so that no stand hides another. `spain-objects.ts` is the record; the current positions are in the cluster table below. Every object has `world: "mediterranean"`, `area: "spain"`. Ids were checked against every world; none collides (`node scripts/tests/object-ids.mjs` guards this once they are registered).

Objects that open rooms (12):

| id | name | zh | kind | pos | prop | scene | purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `paellaEs` | The rice fire | Arròs a la valenciana | dish | [-28, 8] | `paellaFire` | `es_paella` | Hero food: a wide pan over vine wood beside the paddies |
| `plancha` | The tapas bar | La barra de tapas | technique | [-40, -2] | `tapasBar` | `es_tapas` | Existing id, new meaning: the bar under the Plaza Mayor arcade |
| `jamonEs` | The ham counter | Jamón ibérico | dish | [-48, -6] | `jamonStall` | `es_jamon` | One stall in the cast-iron market hall |
| `tortillaEs` | The family kitchen | Tortilla de patatas | dish | [-46, 2] | `tortillaKitchen` | `es_tortilla` | Eggs, potatoes, oil and the onion argument |
| `churrosEs` | The churrería | Churrería | dish | [-38, -8] | `churreria` | `es_churros` | Morning fried dough and thick chocolate off the square |
| `pintxosEs` | The counter of small bites | Pintxoak | technique | [-30, -22] | `pintxoBar` | `es_pintxos` | A northern bar on the Cantabrian coast |
| `gazpachoEs` | The courtyard kitchen | Gazpacho andaluz | dish | [-50, 10] | `patioKitchen` | `es_gazpacho` | Cold bread-and-oil soup in a whitewashed patio |
| `pulpoEs` | The fair cauldron | Polbo á feira | dish | [-52, -18] | `pulperia` | `es_pulpo` | Octopus cut with scissors at an inland Galician fair |
| `paTomaquet` | The bread terrace | Pa amb tomàquet | dish | [-22, -14] | `panTerrace` | `es_pa_tomaquet` | Country bread rubbed with tomato on a Barcelona terrace |
| `manchegoEs` | The cheese farm | Queso manchego | dish | [-68, 4] | `quesoFarm` | `es_manchego` | Sheep's milk curd pressed in an esparto band |
| `sidreriaEs` | The cider house | Sidrería asturiana | place | [-40, -22] | `sidreria` | `es_sidreria` | Asturian natural cider and the long pour |
| `bodegaJerez` | The sherry bodega | Bodega de Jerez | place | [-46, 16] | `jerezBodega` | `es_bodega` | Spain's first Denominación de Origen and the glass the tapa sat on |

Ingredient stops, card only (10, two existing):

| id | name | zh | kind | pos | prop | purpose |
| --- | --- | --- | --- | --- | --- | --- |
| `fishMed` | Fish & prawns | Pescado y gambas | ingredient | [-20, 2] | `fishingPort` | Existing. The port; source of the anchovy and the octopus |
| `oranges` | Oranges & almonds | Naranjas y almendras | ingredient | [-34, 6] | `orangeGrove` | Existing. Moves beside the huerta |
| `oliveEs` | The grove and the oil mill | Olivar y almazara | ingredient | [-60, 8] | `oliveMillEs` | Jaén's groves and a stone mill |
| `albuferaRice` | The Albufera paddies | Els arrossars de l'Albufera | ingredient | [-24, 14] | `albuferaPaddy` | Flooded bunded squares drawing from the river |
| `huertaEs` | The huerta beds | L'horta | ingredient | [-32, 16] | `huertaBeds` | Tomatoes, peppers, flat beans and garrofó |
| `azafranEs` | The saffron plot | Azafrán de La Mancha | flavour | [-66, -6] | `azafranField` | October flowers and the stripping table |
| `dehesaEs` | The holm-oak dehesa | La dehesa | ingredient | [-78, 16] | `dehesaOaks` | Pigs loose under oaks |
| `ovejaManchega` | The Manchega flock | Oveja manchega | ingredient | [-72, 10] | `manchegaFlock` | The one breed whose milk may become Manchego |
| `pimentonVera` | The pepper drying house | Pimentón de la Vera | flavour | [-72, 20] | `veraDryhouse` | Peppers dried over oak smoke |
| `pementoHerbon` | The Herbón peppers | Pemento de Herbón | ingredient | [-58, -12] | `herbonPeppers` | Small green peppers, some hot |

Landmarks with a card and a 3D reaction (5, one existing):

| id | name | zh | kind | pos | prop | reaction |
| --- | --- | --- | --- | --- | --- | --- |
| `alhambraEs` | The Alhambra | La Alhambra | landmark | [-56, 22] | `alhambra` | The existing decoration becomes clickable: the pool ripples, the cypresses move |
| `flamenco` | Flamenco | Flamenco | landmark | [-42, 20] | `flamenco` | Existing; moves beside the bodega |
| `molinosMancha` | The windmill ridge | Molinos de viento | landmark | [-76, -10] | `manchaWindmill` | One sail set turns |
| `gaudiEs` | The mosaic balustrade | Trencadís | landmark | [-20, -20] | `gaudiBench` | Light travels across the broken tile |

Counts against the definition of done: 12 room stands, 10 ingredient stops, 4 landmarks; 14 card-only clickables that are not food stands. (The fifth landmark, the hórreo, was removed on the owner's word on 2026-09-16; see the feedback section at the end.)

### Shared contract: clusters and water

| Cluster | Centre | Holds |
| --- | --- | --- |
| La Albufera y el Puerto | [-28, 10] | `paellaEs`, `fishMed`, `albuferaRice`, `huertaEs`, `oranges`; a barraca, an orange grove, the river mouth |
| La Plaza Mayor | [-44, -4] | `plancha`, `jamonEs`, `tortillaEs`, `churrosEs`; the arcaded square and the market hall; the densest cluster and the arrival view |
| El Patio y la Bodega | [-50, 14] | `gazpachoEs`, `bodegaJerez`, `flamenco`, `oliveEs`, `alhambraEs` behind on a rise |
| El Secano Manchego | [-72, 6] | `manchegoEs`, `ovejaManchega`, `azafranEs`, `molinosMancha`, `dehesaEs`, `pimentonVera` |
| La Ría | [-50, -20] | `pulpoEs`, `pementoHerbon`, `sidreriaEs` at its eastern end with an orchard |
| El Cantábrico i la Terrassa | [-26, -20] | `pintxosEs` on the north coast, `paTomaquet` and `gaudiEs` where the coast turns south |

Water: the existing sea keeps its eastern shore at about x -18 from z -10 south. North of that a strip of the same sea runs west along the north edge (z from -28 to about -23) as far as x -56, widening into the Galician ría between x -56 and -46 down to z -16. One river rises at about [-80, -18], runs east below the Plaza Mayor and reaches the sea at the port with an estuary blend. The Albufera paddies draw from it through sluices.

### Shared contract: rooms

The room list, three discovery subjects, signature motion, supporting cues and sprites per room are in section 3 of the research and, in final form, in the image brief. Sprites: `es_motion_orange_twig`, `es_motion_awning_fringe`, `es_motion_gull`, `es_motion_pepper_ristra`, `es_motion_apple_twig`. Card illustrations: one per room object, twelve.

### Speech lines and palette

Section 2.5 of the research holds four to seven lines per room object in Valencian, Spanish, Basque, Galician, Catalan and Asturian with English on one line. Section 1.3 holds the twelve-colour palette (`calBlanca`, `piedraDorada`, `granitoGalego`, `tejaArabe`, `pizarraNorte`, `almagre`, `maderaCastano`, `azulTalavera`, `albero`, `tierraManchega`, `verdeOliva`, `aguaCosta`) and the eight resident profiles. The Builder turns both into data in `spain-architecture.ts` and `spain-people.ts`.

### Stage A check

- Every object has a unique id, a `kind`, an `area` and a purpose: yes, 27 objects, four of them existing.
- Every historical claim has a source: section 4.13 of the research, grouped by object. Six facts are marked unverified and are kept out of cards until checked.
- Image brief written with exact file names and the drop folder: `docs/spain-image-brief.md`.
- Reviewed by a second agent against the art direction, the 46 research corrections, the lead's decisions and internal consistency. First pass failed on twelve findings, all applied; second pass passed with three minor wording and naming items, also applied.

## Stage B: pictures and blueprint, 2026-09-15

### Picture acceptance

All 42 files arrived at the exact sizes in `~/Downloads/additional game asset/spain/` with an inventory. Every picture was inspected against the art-direction check at reduced size, with full-resolution crops where a detail was in doubt.

| File | Verdict | Reason |
| --- | --- | --- |
| `es00_concept.png` | Accepted | Six neighbourhoods, one coast wrapping the north-east corner, one river, landmarks small and behind |
| 21 room paintings | Accepted | Food accurate to the brief (snails and rosemary on the Valencian rice, béchamel croqueta, salt-packed anchovies in a tin, two Manchego rind patterns, flor in the open butt), pours leave the low edge, discovery subjects clear in both orientations, working clothes of the period |
| `es03_jamon_portrait.png` | Rejected | The carver, the boy and two background men wear red Turkish fezzes; Madrid profile 5 is a cloth cap. Regenerate with the same composition and the caps changed |
| `es05_churros_portrait.png` | Rejected | The boy at lower left wears a red fez. Regenerate with a cloth cap or bare head |
| `es07_gazpacho_portrait.png` | Rejected | The pouring man wears a red fez; Andalusian profile 2 is a low-crowned felt hat or bare head. Regenerate |
| 5 sprites | Accepted | One object on white, clean edges, short side over 400 px after trimming |
| 12 cards | Accepted | One food on white, textures readable |

Two notes that change the room configs rather than the pictures: gulls are already painted in the sky of both paella paintings and a fringed valance is already painted in both bar rooms, so the gull and fringe sprites are held back where they would duplicate a painted subject; the `birds` and `breeze` ambience kinds do that work instead. The cider stream was painted thin rather than wide; it still reads differently from the sherry thread in its dim nave.

The three portraits were regenerated the same day with the same compositions and dark cloth caps or a beret in place of the fezzes; all three were inspected and accepted, re-imported (new hashes in `spain-assets.json`), and the Room maker re-measures those three portrait coordinate sets on the new files.

### Import

`scripts/scenes/import-spain.py` copies the rooms to `public/scenes/es_*/wide.jpg` and `portrait.jpg`, keys the cards to transparent WebP in `public/scenes/spain-food/`, keys the sprites to `public/scenes/props/es-*.webp`, saves the concept as `public/scenes/es_concept.jpg`, registers sizes in `scenes-props.json` and writes `public/scenes/spain-assets.json` with source hashes.

### Blueprint (fixed)

Table and frame:

- `world-med.ts` grows to `W: 120, D: 56, cx: -22`. The table runs x from -82 to 38 and z from -28 to 28. Every Greek, Moroccan and Dalmatian coordinate keeps its value. The `shore()` edge test becomes x at or beyond -82 or 38, z at or beyond 28 in either direction, so caps at the table edge stay square.
- Spain owns x from -80 to -18. Its arrival view is the Plaza Mayor: `AREAS.spain.center` becomes [-46, -2].

Water, one continuous `seaWater()` shape. Points clockwise from the north-west corner, then the existing shore, then the new Spanish shore back to the start:

```
[-82,-28] [-18,-28]                                  north edge over Spain only; Dalmatia starts at x -16
[-18,-14] [-17,-11]                                  east shore of the strait, joining the old sea corner
[-8,-14] [4,-15] [16,-14] [28,-15] [38,-14] [38,28] [16,28] [14,22] [12,14] [2,12] [-8,11]   unchanged
[-14,12] [-18,10] [-19,6] [-18,0] [-19,-6] [-21,-12] [-22,-18] [-23,-22]                     the Valencian bay and the Catalan coast
[-30,-22] [-40,-23] [-48,-22] [-50,-19] [-53,-15] [-57,-13] [-60,-16] [-62,-21] [-70,-22] [-82,-22]   the Cantabrian strip and the Galician ría
```

The strait between Catalonia (x -22) and Dalmatia (x -18) is four units wide and opens at the north edge with a square cap. The rim (`#eee3bf`) is an inset of the same polygon by 1.2, computed per vertex, not from a single centre as now. Nothing stands in water.

River, `freshWater()` width 2.4, ending in an `estuaryWater` blend at the bay:

```
[-80,-14] [-72,-9] [-64,-4] [-56,2] [-48,4] [-40,5] [-32,4] [-26,5] [-21,5] [-19,5]
```

The Albufera paddies at [-24, 14] draw from it through an irrigation channel (width 0.65) from [-24, 6] to [-24, 12].

Clusters and their ground tints:

| Cluster | Centre | Tint | Holds |
| --- | --- | --- | --- |
| La Plaza Mayor | [-44, -4] | `#d9c9a8` paving inside the square, 14 x 10 | `plancha` [-40, -2] on the south side, `jamonEs` [-51.5, -5.5] in the iron hall on the north-west corner, `tortillaEs` [-46, -1] on the south lane, `churrosEs` [-33, 0] in a passage off the main street where it leaves the square; an equestrian statue at [-43.5, -8.8]. The four free-standing granite arcades that ringed the square were removed on 2026-09-16 and the square keeps its light on iron lamp posts. It has no decorative house since 2026-09-17: four stands and the statue leave no ground behind them |
| La Albufera y el Puerto | [-28, 8] | `#c9c08a` dry gold around the huerta; paddies as flooded squares | `paellaEs` [-28, 13] under a reed shade, `fishMed` [-20, -2] on the bay, `albuferaRice` [-24, 14], `huertaEs` [-30, 16], `oranges` [-34, 11]; a pine sandbar along the bay shore at x -19 from z 10 to 12. The decorative barraca that stood at [-22.2, 9.0] was removed on 2026-09-16 and the rice fire's own on 2026-09-17; the Albufera has no barraca now. One Valencian house, at [-21, 25.5] |
| El Patio y la Bodega | [-50, 14] | `#e5dcc6` lime-washed lanes on a low hill, widened east to x -39 in 2026-09-17 | `gazpachoEs` [-41.5, 10] at the hill's east foot, `bodegaJerez` [-46, 16], `flamenco` [-42, 20], `oliveEs` [-61.5, 6] on olive terraces to the west, `alhambraEs` [-56, 22] on a terrace 1.2 high with stairs at its north side. One Andalusian house, single-storey, at [-65.6, 21] on the Alhambra road |
| El Secano Manchego | [-72, 4] | `#c2a473` dry plain, widened east and north in 2026-09-17 | `manchegoEs` [-69, 5], `ovejaManchega` [-70.5, 10.5], `azafranEs` [-71, -7] between the threshing floor and the ridge, `molinosMancha` [-76, -8] on a ridge 0.8 high, `dehesaEs` [-78, 16], `pimentonVera` [-72, 20]. One Manchegan house at [-75, 5] |
| La Ría | [-50, -18] | `#9fb08a` wet green with granite outcrops | `pulpoEs` [-51, -16.5] under a granite arcade facing the ría, `pementoHerbon` [-58, -13], `sidreriaEs` [-40, -20] with its apple orchard on the coast slope north-west of it since 2026-09-17. One Galician house at [-63.3, -14.6] |
| El Cantábrico i la Terrassa | [-28, -20] | `#a9b58a` green turning to `#d9cfae` at the corner, the corner tint widened north in 2026-09-17 | `pintxosEs` [-33, -18.5] on a stone quay on the Cantabrian strip; the baserri behind it was removed on 2026-09-17; `paTomaquet` [-26, -14] on a terrace facing the strait, `gaudiEs` [-27.5, -9] on the terrace's landward side. One Catalan house at [-26.5, -23] |

Roads, one continuous ribbon each, every door on a road:

| Road | Width | Points |
| --- | --- | --- |
| Main street | 2.6 | [-44,-4] [-36,-3] [-28,-2] [-22,-1] [-20,-2] |
| South lane | 1.8 | [-44,0] [-42,3] bridge [-42,6] [-46,8] [-50,10] [-48,16] [-42,20] [-52,22] [-56,20] stairs |
| Olive spur | 1.6 | [-50,10] [-56,10] [-60,8] |
| West road | 1.8 | [-48,-4] [-56,-2] [-62,-5] [-66,-6] [-70,0] [-68,4] [-72,10] [-78,16] [-72,20] |
| Windmill spur | 1.6 | [-70,0] [-76,-8] |
| North road | 1.8 | [-44,-8] [-46,-14] [-50,-18] [-48,-24] |
| Pepper spur | 1.6 | [-52,-18] [-58,-12] |
| Coast lane | 1.8 | [-50,-18] [-44,-21] [-40,-22] [-34,-22] [-28,-21] [-24,-18] [-22,-14] [-20,-8] [-20,-2] |
| Valencia lane | 1.6 | [-28,-2] [-28,3] bridge [-28,8] [-24,12] [-24,14] [-30,16] [-34,12] [-34,10] [-34,4] [-36,-3] |

Bridges: `woodenBridge` at [-42, 4.5] and at [-28, 4.5], decks on the road height, ends on the banks. The west road stays north of the river; if a point comes within 2 units of the water, move the road, not the river.

Walker loops, residents from the eight profiles, steps matched to distance (`spainWalk`), speed 0.01 in the square and 0.008 elsewhere:

1. Plaza loop round the statue inside the arcade square, six residents, one with a basket
2. Andalusian lane: south lane between [-42,3] and [-42,20], five residents, one carrying a water jug
3. Coast lane from the fair [-50,-18] to the terrace [-24,-18], five residents, two in rush capes at the Galician end
4. Valencia lane, four residents, one leading a mule with panniers

Countryside between clusters: olive terraces on the slope from [-62, 4] to [-52, 12]; holm oaks scattered over the dehesa from [-82, 12] to [-74, 22] with pigs in a stone-walled pen; saffron rows purple at [-66, -6]; a threshing floor at [-70, -3]; umbrella pines at the bay; cypresses at the Alhambra; plane trees at the terrace; chestnuts and oaks on the green north slopes; apple orchard by the cider house. Every crop and tree that carries an object responds to a click (the Stand maker's file); decorative trees are the Builder's.

### Module contracts for Stage C

Every agent owns whole files. Stubs exist so the type check passes while files are empty.

| File | Owner | Exports (keep these names and signatures) |
| --- | --- | --- |
| `spain-architecture.ts` | Builder, first | `SP` palette constant with the twelve names from the research; `spainHouse(style, w, d, h, { storeys })` for styles `andalus`, `castile`, `mancha`, `catalan`, `basque`, `galician`, `valencian`; `arcade(bays, w)`; `ironMarketHall()`; `horreo()`; `manchaWindmillBody()`; `bodegaNave()`; `baserri()` |
| `spain-people.ts` | Builder, second | `spainResident(seed, working?)` and `spainWalk(person, from, to, range, seed)` following `turkey-people.ts`; profiles as data |
| `spain-landscape.ts`, `spain-town.ts`, `spain-countryside.ts` | Builder | `spainLandscape(ctx)`, `spainTown(ctx)`, `spainCountryside(ctx)` |
| `world-med.ts` | Builder in Stage C | Table growth, the new shore, `{ ...MED_PROPS, ...SPAIN_PROPS }`, the Spain layout calls; the existing Spain block is replaced |
| `props-spain.ts` | Stand maker | `SPAIN_PROPS` keyed by every `prop` name in the object list, `SPAIN_ICONS`, `ES_LINES` keyed by object id |
| `scripts/tests/spain-reactions.mjs`, `scripts/tests/spain-world.mjs` | Stand maker, Builder | Copies of the Xinjiang and Turkey harnesses with Spain ids |
| `spain-objects.ts`, `spain-stories.ts` | Researcher | `SPAIN_OBJECTS`, `SPAIN_CARD_ART`, `SPAIN_NEXT`, `SPAIN_STORY_DEPTH`, `SPAIN_SOURCES` |
| `world-intros.ts` | Researcher | The Mediterranean intro gains Spain beats; `world-intros.mjs` must still pass |
| `scenes-spain.ts`, `spain-ambience.ts`, `scene-ambience.ts` (`PAINTED_SIGNATURES` entries only) | Room maker | `SPAIN_SCENES`, `SPAIN_AMBIENCE`; hotspot labels and texts live in `scenes-spain.ts` |
| `graph.ts`, `main.ts`, `ui.ts`, `README.md`, this file | Lead, Stage D | Registration only |

The Stand maker may import from `spain-architecture.ts` and `spain-people.ts` once they exist; until then a stand uses `person()` and `wear()` from `props.ts` and a local shelter. Nobody edits another owner's file; a missing helper is built in the owning file.

## Stage C: the build, 2026-09-15 to 16

Four agents built in parallel on the file sets in the module contracts. The first three Fable-tier agents were cut off by a session limit after writing partial files; Opus-tier agents continued from those files.

| Role | Files | Delivered |
| --- | --- | --- |
| Researcher | `spain-objects.ts`, `spain-stories.ts`, the Mediterranean entry of `world-intros.ts` | 27 objects to the China blurb standard, story depth for the 12 room objects, sources for all 27, two `NEXT` links each, card art for the 12 rooms, a four-beat intro. Three of the six flagged facts were confirmed against primary sources (the RAE 1939 entry, paella from patella, the hórreo decree of 1973 and the Carnota date); the gilda year is written as reported, the dehesa hectares and a vermouth date are left out of cards |
| Builder | `spain-architecture.ts`, `spain-people.ts`, `spain-landscape.ts`, `spain-town.ts`, `spain-countryside.ts`, `world-med.ts`, `scripts/tests/spain-world.mjs` | The grown table, one continuous sea with a per-vertex inset rim, the river and estuary, the acequia, terraces with stairs, eleven roads, three bridges, the arcaded Plaza Mayor, twenty decorative houses in seven styles, the barraca and baserri, four walker loops with twenty residents from eight profiles and a pack mule, the dehesa, orchard and saffron rows |
| Stand maker | `props-spain.ts`, `scripts/tests/spain-reactions.mjs`, `docs/spain-stands.md` | 27 stands: 12 main stands to the hotpot table, 10 ingredient stops, 5 landmarks; every pour a modelled column from the real spout to the real vessel; speech lines from the research; a harness that measures the named subject at the 1.6-second arrival against an unpoked twin |
| Room maker | `scenes-spain.ts`, `spain-ambience.ts`, the `es_` signatures in `scene-ambience.ts`, `docs/spain-rooms.md` | 12 rooms with 36 touches carrying the research discovery sentences, steam at every pictured hot vessel, nine breeze masks inspected on the grey panel, two traced stream glints (the cider pour and the whey drip), motion measured in both orientations |

Builder deviations from the blueprint, accepted by the lead:

- The sea polygon moved north and east where the blueprint's shore had put `pulpoEs`, `horreoEs`, `pintxosEs` and `gaudiEs` in the water. The strait narrows to about 2.4 at the Gaudí headland and is 4 elsewhere, opening square at the north edge.
- Eleven roads and three bridges, not nine and two: the Valencia lane crosses the river twice, the west road now leaves the south lane south of the river instead of crossing without a bridge, and the Alhambra approach is its own ribbon because a ribbon cannot double back over itself.
- The apple orchard sits on the slope behind the cider house; the blueprint's rectangle was in the water.
- Three Moroccan items (a riad, the Atlas, a date palm) moved east out of the Valencian huerta; one more riad is moved in the Stage E fix pass.
- Lead-side changes for the grown table: `worldZoomLimit` gives the Mediterranean the 215 desktop overview the Middle East has; the room approach loosens the pitch clamp (1.45 while approaching, 1.12 restored on close) so the low approach the engine asks for is not cancelled; `objects.mjs` audits the Mediterranean; room card art resolves per folder when the food key carries one.

## Stage D and E: integration, review and repairs, 2026-09-16

The lead registered the modules, retired the four old Spain objects, widened the desktop zoom limit and loosened the approach pitch clamp. An independent Opus reviewer then walked the world and every room at both sizes and wrote [spain-review.md](spain-review.md): about two hundred named screenshots in `.data/shots`, every definition-of-done line marked, ten of twenty-five failed on the first pass. Two repair agents, each on its own file set, then fixed every failure that had an owner:

| Failure | Repair |
| --- | --- |
| A harness still expected the old zoom limit, so its road, water and motion checks never ran | Expectation set to 215; the harness now runs in full |
| The engine's overview clamp cancelled the low approach pitch, so facades hid the food at arrival | `main.ts` loosens the clamp to 1.45 during the approach and restores 1.12 when the room closes |
| Nine stands had geometry over the strait, the ría or the river | Every stand moved dry; `spain-world.mjs` now tests every vertex of every stand against the sea, river and acequia polygons, with the port's moored boats as the one exemption |
| Nine stands were hidden from one or both ends of the azimuth range | Stands rotated or rearranged; the churrería moved to its own lane off the square; `spain-reactions.mjs` now casts the real approach ray from three azimuths and asserts a clear line to the reacting subject |
| A Moroccan riad stood on Spanish ground and the Moroccan loop crossed the huerta | Riad moved east of x -18, loop turned north at x -16.5 |
| The cider and sherry pours rendered as rods, the cider near horizontal | Both are now falling columns from the real spout to the real vessel held directly beneath; the cider breaks into rings at the glass and the floor; held-tool reach asserted |
| Four rooms were under the visible-motion floor through the world route; three more were found under it on re-measurement | Cues the paintings support were strengthened; every room now measures 3.2 percent or more wide and 3.55 or more portrait |
| Four portrait breeze masks caught a shelf, a rail, a dado or a ham | Boxes tightened and re-inspected on the grey panel; `breeze-masks.py` now reads the Spain ambience file too |
| Reduced motion was unverified | Six rooms checked in both orientations with the preference emulated: all travel cues stop, light holds, rooms stay readable |

Left open, for the owner:

- The ham counter has no clear approach from any of the three azimuths because the tapas bar and the family kitchen stand between it and the camera inside the 14 x 10 square. Four main stands each needing a nine-unit corridor do not fit in one square. Options: move the ham counter to the market hall's open north side outside the square, or accept the arrival view from the hall's aisle.
- Two engine notes outside Spain's files: the 3D world has no reduced-motion switch (rooms do), and the shared `rnd()` sequence lets a stand's trees and crates shift slightly with build order.
- A portrait room should be looked at once in a displayed pane at 390 x 844 before publishing; every portrait measurement so far comes from hidden-pane composites, which squash the frame as the quality baseline records.

### Animation inventory

Rooms (living-painting cue, then the 3D stand response; the full matrices with sources, boundaries and forbidden zones are in [spain-rooms.md](spain-rooms.md) and [spain-stands.md](spain-stands.md)):

| Room | Living painting | 3D stand response |
| --- | --- | --- |
| The rice fire | Gulls over the paddies beside the painted ones, steam at both pans, the fire | The rice surface lifts and the fire flares before the cook follows |
| The tapas bar | The arcade lamp and two more pictured lamps shimmer, the beam drifts | The jug tilts and a sauce ribbon reaches the bravas plate |
| The ham counter | The beam through the glass roof, lantern shimmer | A slice separates and lands on the plate |
| The family kitchen | The pepper string by the window sways, steam at the pan and the copper pot, the firebox | The tortilla flips onto its plate |
| The churrería | The hearth under the fryer, fryer sizzle, chocolate steam | A churro rises from the oil on tongs |
| The counter of small bites | The sunray through the stone doorway, sky birds | A cruet tilts and one bite lifts |
| The courtyard kitchen | The pepper string sways, the orange canopy and bougainvillea move, a beam in portrait; no steam anywhere | The jug tilts and the bowl fills |
| The fair cauldron | Gulls in the one clean sky opening, cauldron steam from two points, leaves in the fairground trees | Scissors cut, a piece drops onto the plate, paprika falls |
| The bread terrace | Plane-tree leaves, the orange branch | The tomato half rubs across the slice |
| The cheese farm | The pepper string by the door sways, a whey glint traced inside the painted drip | The press lowers and whey drips |
| The cider house | The pepper string on the door post sways, a glint traced inside the painted cider stream | The bottle rises to full arm height and a breaking column falls into the tilted glass |
| The sherry bodega | The shaft from the high shutter, cellar lamp | The venencia rises and a thin thread falls into the copita |

Card-only stands: the port's boats rock and a crate lifts; the orange grove drops fruit into crates; the olive mill's stone turns; the paddies ripple and a sheaf lifts; huerta tomatoes hop and a worker picks; saffron flowers open and a worker strips; the oaks shake and acorns fall for the pigs; the flock shifts and one sheep bleats; pepper strings sway and smoke rises from the dry house; Herbón peppers hop in the pan; the Alhambra pool ripples and its cypresses sway; the flamenco dancer turns; one windmill's sails turn and keep turning; light travels across the trencadís bench. (The three fountains and the smoking chimneys were added on 2026-09-16 and are decor, not clickables; see the feedback section.)

### Verification record

- `npm run typecheck`, `npm test` (16 harnesses, including `spain-world.mjs` and `spain-reactions.mjs`) and `npm run build:pages` pass on 2026-09-16.
- Screenshots at 1280 x 720 and 390 x 844 for the six clusters, all 27 stands at arrival and at rest, and all 12 rooms in both orientations are in `.data/shots`, listed by name in [spain-review.md](spain-review.md); the room motion pairs are the `rm-es_*` files.
- Object audit: Spain has 12 rooms and 14 card-only clickables (10 ingredient stops, 4 landmarks) after the 2026-09-16 feedback pass; it had 15 before.
- Room motion through the world route, medians of six uneven two-second captures: wide 3.2 to 6.0 percent, portrait 3.55 to 7.45 percent; the full per-room table is in [spain-rooms.md](spain-rooms.md).
- Breeze masks: eleven Spain crops inspected on the grey panel after the repair pass.
- The Pages run and the live URL are not yet checked: the Mediterranean is still outside `PUBLISHED_WORLDS`, pending the owner's decision below.

## Owner feedback, 2026-09-16

The owner looked at the live Spain table and gave five notes. All five were fixed in one pass by the Builder,
who also owns `spain-world.mjs`. The Room maker's files (`scenes-spain.ts`, `spain-ambience.ts`,
`scene-ambience.ts`) were not touched.

> "The world is a bit too crowded, too many houses, especially wherever is explorable they are covered by other
> houses, can't walk into the lane."

### 1. Ten of the twenty-four decorative houses removed, one moved, three lowered

The decorative houses in `spain-town.ts` went from twenty-four to fourteen, one or two per style per cluster.
The counts are now bounded at both ends in `spain-world.mjs`, so nobody quietly refills a cluster.

| Cluster | Kept | Removed | Why |
| --- | --- | --- | --- |
| La Plaza Mayor | `castile` [-52.8, -10.6] and [-43.1, -13.3], both dropped from three storeys to two | `castile` [-32.6, -6.0] | The three-storey brick house stood east of the square, on the diagonal from the low south-east arrival to both the tapas bar and the churrería. It was the one the owner described as standing in front of the stands |
| La Albufera y el Puerto | `valencian` [-24.9, -6.7], [-24.4, 20.4], and [-25.2, 0.4] **moved** to [-24.6, 2.4] | — | The port house's eave hung over the main street; it moved two units north and the street is clear |
| El Patio y la Bodega | `andalus` [-55.8, 12.7], [-55.5, 16.7], [-43.4, 24.6] | `andalus` [-39.4, 12.4], [-49.0, 25.5], [-36.4, 18.4] | Six whitewashed houses filled the open ground between the square and the patio, which is where the visitor walks up the south lane. Two on the lane and one on the Alhambra approach keep the character |
| El Secano Manchego | `mancha` [-75.0, -1.6], [-66.5, 11.5], [-66.8, 18.0] | `mancha` [-60.4, 2.9], [-72.8, 14.6], [-79.0, 21.4] | [-60.4, 2.9] and [-72.8, 14.6] had their eaves over the west road, and [-72.8, 14.6] was 2.8 from the Manchega flock. Three houses still read as a dry-plain hamlet |
| La Ría | `galician` [-63.3, -14.6] | `galician` [-47.6, -12.2] | It stood on the north road and 2.95 from the fair cauldron. Every alternative position inside the ría clashed with a stand footprint or another road, so it went; the granite outcrops, the pulpería's arcade and the remaining house carry Galicia |
| El Cantábrico i la Terrassa | `catalan` [-26.5, -23.0], and [-28.6, -8.4] **lowered** to one storey | `catalan` [-23.5, -9.5] | [-23.5, -9.5] stood across fifteen metres of the coast lane. [-28.6, -8.4] sits on the diagonal to the churrería, so it came down from two storeys to one and the fryer stays in view |

Four more things moved off a lane, all found by the new check rather than by eye: the equestrian statue kept its
place but the **north road** now leaves the square at [-45.2, -8.2] instead of [-44, -8] and passes the plinth
instead of running into it; the three **grain sheaves** moved from across the windmill spur to the north-west
edge of the threshing floor; one **mancha rock** moved from the spur to [-74.5, -1.5]; the **granite outcrop**
at [-45.4, -13.8] and the **apple orchard** moved east off the north road.

Two new checks in `scripts/tests/spain-world.mjs` hold this, extending the existing solids list rather than
weakening it. An arcade and a bridge are walked through and are exempt; a house, a farm building, the statue, a
fountain or a tree is not.

- *Nothing stands on a road*: every road centreline is sampled every 0.25 units against every solid decor
  footprint. It was failing on six houses, two sheaves, a rock, an outcrop and an apple tree when written.
- *Every stand keeps its approach*: the corridor from each stand to the nearest point on the road network is
  sampled the same way, and nothing solid may come within 2.5 of the stand itself.

### 2. Thirteen figures that travelled without stepping

`window.__fw.audit` reports movers in water and in walls, not gaits, so the check was written fresh: every
figure on the table that carries a leg rig is watched for 240 simulated seconds, and if its world position
travels, its thighs must swing. Thirteen figures failed.

| Figure | What was wrong | Fix |
| --- | --- | --- |
| The paced walkers at the tapas bar, ham counter, family kitchen, fair cauldron, bread terrace, cheese farm, cider house, sherry bodega, windmill ridge and mosaic bench (ten in all) | They were built from `resident("carrier")` / `resident("server")`, the *working* band, which drops the movement observer because the stand poses those figures itself. `pacer()` then slid them along a straight segment with their legs locked | Each is now `resident(role, false)`, so `spain-people.ts` measures the distance covered and matches the steps to it. The `pacer()` header says why |
| The three sailors on the Mediterranean sailboats | They stood bolt upright in the hull while the boat sailed a lap of the sea every three minutes. The most visible case on the table | Each now sits on a thwart with a tiller under his hand, and carries `userData.seated` so the check allows a carried figure to travel without stepping |
| The olive mill's mule | It walked its circle with four rigid boxes for legs | Its legs hinge at the shoulder and step once every 0.55 of the circle, so the pace follows the speed of the stone |

The neighbours who stand and talk in `world-med.ts` were checked and are correct: they are placed once and never
translate, and their observer holds their legs still. The check also fails the opposite fault, a figure that
steps on the spot without going anywhere; nothing does.

### 3. The three fountains run

`fountain()` in `spain-town.ts` was a static stone basin. It now carries eight water meshes on a tick that
`place()` registers like any other ticking decor:

- a **jet** standing on the lip of the upper bowl, breathing with the pressure at about 2.3 radians a second
- four **droplets** thrown off the jet on their own clocks, arcing out and falling back into the basin, fading as they fall
- two thin **sheets** falling from the bowl rim into the basin on opposite sides, so the fall reads from any angle
- a **ripple ring** that widens and fades on the basin surface where the sheets strike, and the pool surface itself breathing

Fourteen meshes per fountain including the merged stone, three fountains: `patio-fountain`, `valencia-fountain`,
`ria-fountain`.

### 4. Chimney smoke on nine of the fourteen houses

`spainHouse` built a chimney for `castile` and `galician` only, and published nothing for the world to hang
smoke on. It now builds one for `andalus`, `mancha` and `basque` as well — brick in Castile, granite in Galicia,
lime wash over the southern hearths — and publishes `userData.smoke` at the chimney top, the way `props.ts` does
for the Chinese houses.

The world assembler already scanned direct children of the layout group for `userData.smoke`, and
`spainTown` places its houses there, so the anchors were collected without rewiring. What was added is a tint:
`worldkit.ts` now reads an optional `userData.smokeTint` beside the anchor and gives that source's four sprites
a grey colour, a narrower column and a lower peak opacity, so a chimney reads as a thin grey wisp and not as the
white steam of a cooking stand. Sources without a tint are unchanged, so China, Turkey and every other world
look exactly as before.

Nine of the fourteen houses smoke: two Castilian, one Galician, three Andalusian, three Manchegan.
`spain-world.mjs` asserts the anchor sits at the chimney top, the tint is the grey one, the style is one that
has a chimney, and the world produced at least four puff sprites for every smoking house.

### 5. The hórreo is gone (but it was not what the owner had pointed at)

The `horreoEs` landmark at [-48, -24], a tan granary on grey stilts standing over the ría, was removed
completely: the object and its `SPAIN_NEXT` entry in `spain-objects.ts`, its sources entry in
`spain-stories.ts`, the `horreo` stand, its `ES_LINES` and the registry entry in `props-spain.ts`, and the
`horreo-cob` expectations and the 27-object lists in `spain-reactions.mjs`. No other card linked to it, so no
chain dangles; `pulpoEs` keeps `pementoHerbon` and `pimentonVera`, `sidreriaEs` keeps `pulpoEs` and `pintxosEs`,
and the hórreo decree and Carnota sources stay on the `pulpoEs` card where they were already cited.

Two things were kept on purpose: `horreo()` in `spain-architecture.ts`, because the cider house still stands a
granary beside its room, and the fourth point of the north road was dropped with it — [-48, -24] carried the
hórreo's door and now leads nowhere, so the road ends at the fair where the coast lane and the pepper spur
take over.

Spain's card-only count drops from 15 to 14 and its landmarks from 5 to 4, which is still above the
definition-of-done floor of three non-food clickables per area. The [quality baseline](quality-baseline.md)
records the change.

The owner's phrase was "the yellow bridge-looking thing which is half in the water", and the hórreo was the
wrong guess: a close-up showed a free-standing plaza arcade at the river's edge, not the granary. The hórreo
stays removed, because the owner did not object when told; the arcade went too, in the second pass below.

### Second pass, same day: four more items

The owner looked again after the first pass and sent four more notes.

**6. The barraca goes.** The thatched Valencian field house that stood in the rice fields at [-22.2, 9.0] was
removed from `spain-town.ts`. The `barraca()` builder stays, because the rice fire stand builds one of its own
behind the pan, so the Albufera keeps a field house where it belongs. `spain-world.mjs` dropped `barraca` from
its solids list and its list of names that must exist, and now asserts it is gone.

**7. The "yellow bridge-looking thing" was a plaza arcade, not the hórreo.** The close-up showed a long tan
cornice slab on a row of grey granite piers standing at the water's edge beside a red-brick Castilian house with
iron balconies. That is `arcade()` as placed by `spain-town.ts`, seen from above: the piers read as bridge
piles and the cornice as a deck. All four free-standing segments were the same construct, attached to no
building, and all four are removed:

| Segment | Position | Size | Why it went |
| --- | --- | --- | --- |
| West | [-53.4, -4], turned a quarter | 4 bays over 9 | The one in the close-up: it runs along the river bank with the Castilian house beside it and reads as a bridge half in the water |
| North | [-46.2, -10.2] | 4 bays over 9 | The same slab-on-piers from the arrival camera, standing free between the market hall and the ría |
| South | [-38.0, 2.2] | 3 bays over 6 | Crosses the river bank by the Valencia fountain; the same read |
| East | [-34.6, -1.4], turned a quarter | 2 bays over 5 | The shortest, and the most bridge-like of the four because it is barely longer than a bridge deck |

The arcade motif is kept where it belongs to a building: the pulpería's granite arcade in `props-spain.ts`, the
tapas bar's own timber shelter, and the painted rooms. The six square lamps used to hang from the arcade beams;
they now stand on cast-iron lamp posts (a granite kerb, a tapered column, the lantern and a cap) at [-50.6, -7.4],
[-50.6, -1.2], [-47.4, -9.4], [-41.6, -9.4], [-41.0, 1.7] and [-36.4, 1.7], so nothing is left hanging in the air.
The four walker loops are untouched: none of them ran through an arcade bay, and the plaza loop's two walking
lines at z -7 and z -1 are now clear of everything but the statue and the lamp posts. `spain-world.mjs` no longer
exempts `plaza-arcade` from "nothing stands on a road" (only a bridge deck is walked over), asserts every square
lamp reaches the ground and carries its lantern above head height, and asserts that the arcade, the barraca and
the hórreo are all absent.

**8. The chimney smoke could not be seen.** The first pass gave chimneys a thin, dark, low-opacity wisp. At the
overview zoom that is invisible, and so, it turns out, is the white four-puff column China's houses use, which
was the model: a screenshot of a Chinese house at the same zoom shows no smoke either. Matching China exactly
could not meet "plainly visible", so a tinted source now gets a denser column than an untinted one: the same
sprite size and the same soft-dot texture, but eight puffs instead of four, a peak alpha of .85 instead of .5,
a rise of 3.1 instead of 2.4, and a wood-smoke grey-white (`#b5aea3`). Untinted sources — every steam and smoke
point in China, Turkey and every other world — are byte-for-byte unchanged. The anchor was also raised: it is
now computed from each style's own ridge height plus .40 for the cap and .22 above that, because the Galician
slate gable rises `d * .42` and the old fixed .9 stack put the smoke inside the roof.

**9. "The cow is walking backward pulling the grind".** The olive mill's mule had two faults at once. Its
position ran round the circle the opposite way to the beam, and its body faced against its travel, so it circled
the stone tail first; and nothing joined it to the beam. It is now harnessed to the far arm of the beam, opposite
the runner stone as a tahona harnesses one, with the beam lengthened from 2.0 to 3.4 so the arm reaches it, and
a lead of .45 radians so the head is ahead of the attachment and the yoke pole trails back to it. The pole and a
shoulder collar were added so the pull reads. The stride is no longer a sine: the hoof is planted for the first
.62 of the cycle and travels backward under the body at the speed of the ground, then swings forward, lifted
clear, in the rest. A symmetrical swing is what made it read as sliding rather than stepping.

`spain-world.mjs` now checks both on a fine time step, because the 0.2-second frames of the walker loop sample
barely five points per stride: the mule's head axis must score above .9 against its direction of travel, and its
hoof must spend clearly more of the cycle going backward than forward. Reverting either half of the fix fails
the check — the old facing scores -1.00, and the old sine gives 445 backward frames against 454 forward.

### Verification of this pass

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | 16 harnesses pass, including the extended `spain-world.mjs` and the 26-object `spain-reactions.mjs` |
| `npm run build:pages` | Passes |
| `node scripts/audit/objects.mjs` | `spain: rooms=12 card-only-with-prop=14`; every other area unchanged against the baseline |
| Live look, dev server at :5180 | Shots in `.data/shots`: `fb-smoke3.jpg` (the Plaza Mayor at 1280 x 720 from the default angle: the arcades gone, lamp posts on the ground, open lanes to the tapas bar, the churrería and the market hall, and two grey smoke columns over the Castilian roofs), `fb-smoke4-andalus.jpg` (the same over the Andalusian and Manchegan houses), `fb-fountain2.jpg` (the Valencia fountain with jet, droplets, both sheets and the ripple ring), `fb-ria.jpg` (the ría bank where the hórreo stood), `fb-sailor.jpg` (the sailor seated at his tiller), `fb-mule-1.jpg` and `fb-mule-2.jpg` (the mill mule at two points of its circle, head leading, yoke pole trailing to the beam). `fb-arcades-before.jpg` and `fb-arcade-north.jpg` keep the before state that the arcade removal was judged from |

Two repairs the sight-line harness demanded once the build order changed, both inside stands rather than decor:
the first diner at the courtyard kitchen moved from [-0.8, 1.3] to the end of the table, and the Herbón cook
moved from [0.2, 0.1] to the far side of his fire. Both had been sitting on the line from an arrival azimuth to
the reacting food and only passed before because the shared `rnd()` sequence happened to place them a few
centimetres clear.

Not verified in this pass: the portrait rooms at 390 x 844 in a displayed pane, and the Pages run, both of which
were already open in the Stage E record; nothing in this pass touched a room or the publish path.

One known limit of the smoke: it is plainly readable over the Castilian and Galician roofs, where the column
stands against the sky, the water or dark slate, and softer over the single-storey Manchegan houses, where a
pale grey column sits against pale orange tile at a similar brightness. Raising it further would start to look
like a fire rather than a kitchen hearth.

## Third pass, 2026-09-17: nothing in front of a stand

> "The houses are still too crowded, there should be no house in front of a clickable object; at the moment the
> ham counter, tapas bar, churrería, pintxo bar and the bread terrace are completely behind houses."

The 2026-09-16 pass thinned the houses from twenty-four to fourteen and added a check that no house stands on
the arrival camera's **line** to a stand. A line is a ray, and a house a hand's width off it passes. This pass
replaces it with a rule about ground rather than about a ray.

### The rule, and where the wedge comes from

The camera is not a guess. `main.ts` enters the Mediterranean at the area target plus `(2, 48, 60)`, and every
later move keeps that offset direction: `glideTo` copies the current offset before it flies, a pan carries the
camera and the target together, and a zoom only changes the offset's length. So the camera always looks from
azimuth `atan2(2, 60) = 0.033 rad` — from the south, two degrees east of due south — at 38.7 degrees above the
ground. `__fw.cam()` at the settled arrival view returns exactly `[-2, 48, 62, -4, 0, 2]`, and at the 215
overview `[-40.4, 134.8, 165.8, -46, 0.5, -2]`: the same direction, a longer offset.

The visitor may swing it, but not freely. `configureControls('world')` clamps `minAzimuthAngle` to -0.75 and
`maxAzimuthAngle` to +0.75 radians, so the camera can stand anywhere in an 86-degree fan south of a stand, and
the pitch is clamped to 1.12 radians from vertical at the overview and 1.45 while approaching a room. The wedge
is that whole fan plus seven degrees either side for the width of the obstacle itself:

> **No decorative object stands in a 100-degree wedge centred on the direction from a stand to the default
> camera, out to 9 units, and nothing over 1.2 units tall stands in that wedge within 5 units.** Anything with a
> body counts as a blocker at any height: a house, the Basque farmhouse, an arcade, a walled pen, the equestrian
> statue, and any decoration over 2 units tall, which is the Builder's definition of a big tree. A slender post
> under .6 of a unit across in both directions is exempt — a lamp post, a sluice post or a bunch of reeds hides
> nothing at this camera pitch, and the square keeps its light.

The rule is applied to all 26 clickable objects, the twelve room stands and the fourteen card-only ones alike.

### What that costs, and why the house cap fell

Twenty-six wedges of 100 degrees and 9 units cover about 1,800 square units before the obstacle's own width is
added; Spain is 62 by 52. Almost none of the ground that is outside all twenty-six wedges, dry, off the roads
and clear of the stands' pads is anywhere near a cluster centre, and none of it at all is in or beside the Plaza
Mayor, where four stands and the statue stand within fourteen units of each other. The cap could not be met, so
it was lowered, as the brief allowed. **Fourteen houses become five: nine removed, three moved, two unchanged** —
one Valencian, one Andalusian, one Manchegan, one Galician, one Catalan, and none in Castile.

| Style | Was | Now | What happened |
| --- | --- | --- | --- |
| `castile` | [-52.8, -10.6], [-43.1, -13.3] | — | Both removed. The first stood 4.3 in front of the fair cauldron and 5.2 in front of the Herbón peppers; the second 5.4 in front of the cider house. Every candidate position in and around the square is inside the churrería's, the fair cauldron's or the cider house's wedge, and the ground west of the square is the river. **The Plaza Mayor keeps no decorative house**: its built fabric is now the market hall, the taberna, Casa Lola, the churrería, the statue, the three fountains and the lamp posts |
| `valencian` | [-24.6, 2.4], [-24.9, -6.7], [-24.4, 20.4] | [-21.0, 25.5] | The port house stood 3.6 in front of the port; the coast house 7.3 in front of the bread terrace and 8.8 in front of the mosaic bench; both removed. The third moved from in front of the rice fire, the paddies and the huerta beds to the bay's southern shore, the one piece of Valencian ground outside every wedge |
| `andalus` | [-55.8, 12.7], [-55.5, 16.7], [-43.4, 24.6] | [-65.6, 21.0] | The two on the patio hill stood 4.5 and 6.0 in front of the oil mill and the courtyard kitchen; the third stood 3.1 in front of the flamenco stage and 7.1 in front of the bodega. Two removed; one moved to the last clear ground on the Alhambra road, west of the terrace's slope (any further east and it stands on the raised terrace) |
| `mancha` | [-75.0, -1.6], [-66.5, 11.5], [-66.8, 18.0] | [-75.0, 3.0] | [-75.0, -1.6] stood 4.7 in front of the windmill ridge and moved four and a half units south; the other two stood in front of the cheese farm, the oil mill and the Manchega flock and were removed. A second Manchegan house was tried beside the dehesa at [-79, 9] and dropped: the only wedge-free ground there is already taken by the pig pen and the holm oaks, and a house there stands inside both |
| `galician` | [-63.3, -14.6] | [-63.3, -14.6] | Unchanged: it is behind nothing |
| `catalan` | [-26.5, -23.0], [-28.6, -8.4] | [-26.5, -23.0] | [-28.6, -8.4] stood 5.0 in front of the churrería, 6.3 in front of the bread terrace and 7.9 in front of the mosaic bench; nowhere on the Catalan coast is outside all three wedges, so it was removed. The quay house is unchanged |

Nothing was moved onto a road, into water, within 2.5 of a stand, onto a terrace slope or inside another
building; each move is to ground that is behind its own cluster's stands or at the cluster's edge.

### The Basque farmhouse, the big trees and the rest of the decor

- **`baserri` at [-28.2, -11.0]: removed.** At 5.15 by 4.65 it was the widest decoration on the table and it
  stood in front of four clickable objects at once — the bread terrace 2.8 away, the mosaic bench 4.2, the
  churrería 5.4 and the pintxo bar 5.6. The quay, the churrería's lane and the trencadís terrace leave no plot on
  that coast that is behind all four. `baserri()` stays in `spain-architecture.ts`; nothing places one.
- **Plane trees** (4): all four came down from 2.1–2.3 units to under 2, so they are no longer big trees in front
  of the market hall, the family kitchen and the churrería. The one at [-31.0, -7.8] was 4.9 from the churrería,
  inside the 5-unit rule at any height, and moved to [-27.6, -7.2], onto the ground the Catalan house left.
- **Alhambra cypresses** (4 → 2): [-55.0, 14.8] and [-50.6, 16.2] removed (6.5 and 5.8 in front of the courtyard
  kitchen); [-59.4, 14.6] moved to [-64, 18.5], past the end of the oil mill's wedge and off the terrace slope;
  [-62.8, 17.4] unchanged.
- **Southern cypresses** (3 → 1): [-21.4, 18.2] moved to [-21.4, 11], north of the paddies; [-31.4, 21.4] and
  [-37.4, 23.4] removed (in front of the huerta beds and the flamenco stage).
- **Dehesa oaks** (5 → 3): [-76.0, 25.6], [-73.6, 25.0] and [-69.4, 25.4] all stood south of the dehesa and the
  pepper drying house, the nearest 2.9 away. One moved to [-80.2, 7.0], the only spot in the dehesa that clears
  both stands' pads; two removed.
- **Northern chestnuts** (4 → 2): [-57.4, -7.0] moved to [-66, -8], past the end of the Herbón peppers' wedge;
  [-60.4, -6.4] and [-39.0, -14.4] removed.
- **Coast chestnut** [-27.6, -11.4] removed (3.2 in front of the bread terrace); **bay pine** [-20.4, 6.4] and
  **sandbar pine** [-19.2, 8.4] removed (7.3 and 9.0 in front of the port); **scattered olive** [-64.6, 12.4]
  moved to [-65, 15].
- **Apple orchard** (6 trees): the pomarada climbed the slope *south* of the cider house, which is the slope
  between the cider house and the camera; all six stood in front of it, the nearest 3.4 away. It moved from
  x -44.0/-42.6/-41.2, z -15.4/-13.9 to x -47.4/-46.0/-44.6, z -24.6/-23.2, the coast slope north-west of the
  house, where it is behind the house from every azimuth the camera reaches.
- **Patio fountain** [-52.4, 14.4] → [-56, 12]: at 1.9 units tall it fell under the 5-unit rule, 3.6 in front of
  the courtyard kitchen.
- **Equestrian statue** [-44, -9.2] → [-43.5, -8.8]: its plinth reached 9.0 units into the fair cauldron's wedge.
  Half a unit east and south clears it, and the plaza walking lines at z -7 and z -1 are still clear.
- **Two Moroccan riads** at [-21, 25] and [-27, 26], in `world-med.ts`: both still stood on Spanish ground, and
  the two-storey one was 8.6 in front of the huerta beds. They moved to [-17.6, 26.4] and [-11.5, 26.6].
  Nothing Moroccan is now west of x -18.

### The rice fire's barraca

> "Remove this strange red bar house in front of the rice fire: the white building with a book-like roof and a
> red bar in the middle, just south of the river, in front of the bridge."

That is the Albufera field house the `paellaFire` stand built for itself at its local [-1.7, -3.7], about
[-30.4, 9.7] on the table: a white block under a very steep thatched gable — the book-like roof — with a dark
ridge bar and a cross. The town's own barraca went on 2026-09-16; this one is now gone too. The reed shade, the
fire, the pan, the long table and every reaction are untouched, and the rice fire stands in the open with the
river and two bridges behind it. `barraca()` was removed from `spain-architecture.ts` with it, because nothing
places one any more — **a change to the module contract in Stage B, recorded here**. `spain-reactions.mjs` never
named a barraca part and did not change.

### The harness check

`scripts/tests/spain-world.mjs` gained *nothing decorative stands between a stand and the camera*, after the
road and approach checks and before the bridges. It reads the built world, so a house moved back in front of a
stand fails it. It samples each decor bounding box on a three-by-three grid and takes the nearest sampled point
that falls inside the wedge. Written against the world as it stood that morning it failed on **66 items across
20 of the 26 stands**; it passes now. The house count is bounded at 5 to 8 with one or two per style, the five
styles that must still have a house are named, and Castile is asserted to have none, so a Castilian house
coming back is a failure that says to check the wedge first.

### Verification of this pass

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | 16 harnesses pass, including the extended `spain-world.mjs` |
| `node scripts/audit/objects.mjs` | `spain: rooms=12 card-only-with-prop=14`, unchanged |
| Ray test in the live world | 10 rays per stand (nine on the front face at three heights, one at the diamond cue) cast from the arrival direction at the built world: **no decorative object blocks any of the 26 stands**. Before the pass, decor blocked twelve of them |
| Contact sheet | `stands-clear.png` in this session's scratchpad: the five named stands, the rice fire and two overviews |

Still hidden, and not the Builder's to fix — the occluder is another **stand**, whose position lives in
`spain-objects.ts` and whose geometry lives in `props-spain.ts`:

| Stand | Covered by | Rays blocked |
| --- | --- | --- |
| `gazpachoEs` the courtyard kitchen | `alhambraEs` and `bodegaJerez` | 10 of 10 |
| `jamonEs` the ham counter | `tortillaEs`, the family kitchen | 6 of 10 |
| `pintxosEs` the pintxo bar | `churrosEs`, the churrería | 6 of 10 |
| `azafranEs` the saffron plot | `manchegoEs`, the cheese farm | 6 of 10 |
| `ovejaManchega` the flock | `dehesaEs` | 3 of 10 |
| `sidreriaEs`, `oliveEs`, `gaudiEs`, `manchegoEs`, `bodegaJerez` | a neighbouring stand | 1 to 2 of 10 |

The ham counter case has been open since Stage E. Three of the owner's five named stands — the tapas bar, the
churrería and the bread terrace — are now completely clear; the ham counter and the pintxo bar are clear of
every house and tree but still stand behind a neighbouring stand.

Not verified in this pass: the rooms (nothing in it touched a room file), the portrait rooms in a displayed
pane, and the Pages run. One thing found and not fixed: at the Mediterranean's own desktop zoom limit of 215 the
table renders white, because the scene fog is near 90 and far 200 and everything at maximum zoom-out is past the
far plane; only the sea reads, since its shader ignores fog. A Spain-wide overview has to be taken at about 130.

## Fourth pass, 2026-09-17: no stand in front of another stand, and a readable overview

Two follow-ups to the third pass, on the same day.

### 1. The rule reaches the stands themselves

The owner's rule is that **every clickable object is visible from the camera**, so a stand that hides another
stand fails exactly as a house does. After the third pass cleared every house and tree, ten of the twenty-six
were still behind a neighbouring stand.

A wedge cannot express this one. The stands as built are 4 x 4 to 12 x 14 units and neighbours inside a cluster
stand five to eight units apart, so every pair would sit inside every other pair's wedge and no arrangement
could pass. What the visitor sees is settled by occlusion, so occlusion is what is measured: **ten rays per
stand along the arrival direction — nine at its camera-facing front face at three heights, one at the diamond
cue over its anchor — and the first stand each ray meets must be that stand.** It is the same test the Builder
runs in the browser against the live page, moved into `spain-world.mjs` so it keeps.

Written against the world as the third pass left it, the check failed on ten stands:

| Covered | By | Rays |
| --- | --- | --- |
| `gazpachoEs` the courtyard kitchen | `alhambraEs` 4, `bodegaJerez` 4 | 8 of 10 |
| `jamonEs` the ham counter | `tortillaEs` | 6 |
| `pintxosEs` the pintxo bar | `churrosEs` | 6 |
| `azafranEs` the saffron plot | `manchegoEs` | 6 |
| `ovejaManchega` the flock | `dehesaEs` | 3 |
| `manchegoEs` the cheese farm | `oliveEs` | 2 |
| `oliveEs` the oil mill | `alhambraEs` | 2 |
| `sidreriaEs` the cider house | `churrosEs` | 1 |
| `gaudiEs` the mosaic balustrade | `paTomaquet` | 1 |

### 2. The moves

Eight object positions in `spain-objects.ts`. Every one keeps its cluster, its ground colour, a road at its
door within 2.6 units, 2.5 clear in front, dry ground under every vertex, and at least five and a half units
from every neighbouring stand. Nothing else in the object list changed: no id, no `NEXT` link, no blurb, no
room, and `SPAIN_NEXT` still reads the same, because every moved stand keeps the same neighbours.

| Object | Was | Now | Why that spot |
| --- | --- | --- | --- |
| `jamonEs` | [-48, -6] | **[-51.5, -5.5]** | Three and a half units west into the square's north-west corner, out of the family kitchen's screen column. Still the market hall on the square, and still on the square's own paving, which counts as its road |
| `churrosEs` | [-34, -13] | **[-33, 0]** | Stage E moved the churrería out of the square to a lane off the north-east corner, and put its six-unit body five units in front of the pintxo bar. Nothing nearer would do: the ray to a stand climbs at 38.7 degrees, so to clear a four-unit counter the churrería's whole body has to be south of z -9.6, and the only ground there outside every other stand's line is the south side of the main street where it leaves the square. That is also where a churrería belongs — Madrid's oldest works out of a passageway off Calle Arenal — and `churro-lane` is now that passage |
| `gazpachoEs` | [-50, 10] | **[-41.5, 10]** | Eight and a half units east, off the column the Alhambra terrace and the bodega share. It keeps the lime-washed hill: the patio paving runs to x -41 and the ground tint was widened east to meet it |
| `oliveEs` | [-61.5, 8] | **[-61.5, 6]** | Two units north, out from under the Alhambra terrace's column |
| `manchegoEs` | [-68, 4] | **[-69, 5]** | One unit west and one south, so it clears the saffron plot's new place |
| `azafranEs` | [-66, -3.5] | **[-71, -7]** | The saffron plot and the cheese farm are each about ten units wide on a plain eighteen wide, so one has to sit clear of the other's column. Every position that solved it east of x -66 put the plot's own geometry into the river, which bulges west at the bend by [-57, -6]; the pair only came apart with the plot five units west and three and a half north, on the open ground between the threshing floor and the windmill ridge |
| `ovejaManchega` | [-72, 10] | **[-70.5, 10.5]** | A unit and a half east and half a unit south, out of the dehesa's column |
| `paTomaquet` | [-26.5, -16] | **[-26, -14]** | Two units south, so the mosaic balustrade is no longer under its roof |
| `gaudiEs` | [-25.5, -17.5] | **[-27.5, -9]** | The balustrade's box is 9.8 by 10 and the bread terrace's 8.2 by 8.5, in a corner fifteen units wide: they overlapped, and the balustrade's own diamond cue was coming up under the terrace's roof from a third of a unit away. There is no room for both on the quay, so the balustrade moved inland to the landward side of the terrace, where the coast turns south — still the Catalan corner, with the tint widened north to carry it, and `terrace-spur` re-laid from the coast lane to its door |

Three pieces of the Builder's own work moved with them, and four more followed:

- **`churro-lane`** is re-laid from `[-37, -9] [-35.8, -10.8] [-34.6, -12.6]` to
  `[-35.6, -2.2] [-34.4, -0.8] [-33.4, 0.2]`, a short passage from the main street to the churrería's door.
- **`terrace-spur`** is re-laid from `[-24, -18] [-21.4, -19.8]` to `[-22.3, -11] [-24, -10.6] [-25.6, -10.2]`,
  leaving the coast lane at the strait and running west along the terrace's landward side to the balustrade.
- **The Valencia fountain** moved from [-31.6, 1.4] to [-26, 2.2]: it stood inside the churrería's new pad. It
  is still on the main street between the square and the port.
- **The Andalusian house** at [-65.6, 21] came down from two storeys to one. At 5.3 units its roof caught one
  ray to the Manchega flock eleven units behind it — past the wedge's nine-unit reach, which is why only the ray
  test found it. The **Manchegan house** moved from [-75, 3] to [-75, 5], out of the saffron plot's new wedge.
- **The four plane trees** are re-placed at [-33, -11], [-50.4, 2.4], [-32.5, -5.8] and [-35, -7.4]: two were
  inside the churrería's new footprint and one inside the balustrade's pad.
- **Two grain sheaves** moved to [-72.8, -1.8] and [-73.4, -0.5], a **Mancha rock** to [-64, -1] and a **river
  stone** to [-65.4, -10.8], each out of a moved stand's footprint.
- **Three ground tints widened** so the stands that moved furthest keep their cluster's colour under them: the
  lime-washed patio tint from `(-50, 14, 10 x 7)` to `(-47, 13, 16 x 9)`, the Manchegan dry plain from
  `(-72, 4, 13 x 15)` to `(-70, 2, 19 x 19)`, and the Catalan corner from `(-23, -17, 5 x 6)` to
  `(-24, -14, 7 x 12)`.

### 3. The fog at the zoom limit

The third pass found that at the Mediterranean's own desktop zoom-out limit of 215 the whole table rendered
blank in the paper colour, with only the sea left, because the sea's shader ignores fog. The cause: `main.ts`
set the world fog to a hand-written pair per world — `500/600` for the Middle East and `90/200` for everything
else — while `worldZoomLimit` gives both the Middle East *and* the Mediterranean a 215 limit on desktop. At 215
the Mediterranean's entire table was past the far plane.

`world-camera.ts` now derives it. `worldFogRange(world, width, height, halfDiagonal)` takes the world's own
zoom limit and half the table's diagonal, which together are the farthest thing the camera can see from the
limit, and multiplies by 1.6, which leaves that far corner in a light haze rather than flat in the paper
colour; the near plane keeps the original 90/200 ratio and the colour stays the paper. A world whose limit is
inside the old far plane returns 90 and 200 exactly, so **China at its 90 limit, every other world and every
phone view are unchanged, byte for byte**. `main.ts` reads the half-diagonal from `diorama.bounds`.

| World | Limit | Half-diagonal | Fog before | Fog after | Haze at the limit / at the far corner |
| --- | --- | --- | --- | --- | --- |
| Mediterranean | 215 | 66.2 | 90 / 200 | **203 / 450** | 5% / 32% |
| Middle East | 215 | 90.6 | 500 / 600 | **220 / 489** | 0% / 32% |
| China | 90 | 70.0 | 90 / 200 | 90 / 200 | unchanged |

The Middle East was never blank — its hand-set 500/600 meant no fog anywhere on its table — so this replaces a
hand-set pair with a derived one and gives its far corner the same light haze the Mediterranean now has. Both
were checked on screen at 215.

`spain-world.mjs` holds the numbers: the table centre at the zoom limit must be under 10 percent hazed and the
far corner under 40, China must still get exactly 90 and 200, and so must a phone.

### Verification of this pass

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | 16 harnesses pass |
| `node scripts/audit/objects.mjs` | `spain: rooms=12 card-only-with-prop=14`, unchanged |
| Ray test in the live world | **All 26 Spain stands are 10 of 10 clear**, of decor and of other stands alike, on a fresh page load |
| Screens | The five stands the owner named, the rice fire, all 26 at distance 130, and the Mediterranean and the Middle East at their 215 limit, on the contact sheet |

The offline harness and the live page do not build quite the same world — the harness builds with no recipes,
so a few cue and label meshes differ — and three stands passed the harness at 9 of 10 in the browser before
the last nudges. **The live page is the authority**; the harness is what keeps a fixed defect fixed.

Not verified in this pass: the rooms, the portrait rooms in a displayed pane, and the Pages run; nothing in it
touched a room or the publish path. The recipe mapping was checked and is unaffected: the two recipes that
point into Spain use `place: "fishMed"` and `place: "plancha"`, and neither stand moved.

## Retrospective, 2026-09-16

Spain was declared done at two in the morning: Stage E passed, sixteen harnesses green, the definition of done
recorded line by line. The owner then walked through it for ten minutes and found twelve things. All twelve are
fixed above. What follows is each one in a line, with its cause and the document that now carries the rule, so the
next area does not repeat them.

| # | What the owner saw | Cause | Rule now lives in |
| --- | --- | --- | --- |
| 1 | The chilli strings swung with a visible cut edge and a repaired hole behind them — "it's just not natural" | The strings were colour-keyed out of the finished paintings as `breeze` crops; on Spain's warm walls the key took the wall. The delivered `es-pepper-ristra` sprite sat unused | [Methodology: hanging motion is a sprite over a clean painting](new-area-methodology.md#hanging-motion-is-a-sprite-over-a-clean-painting) |
| 2 | In the cider room a yellow glint ran across the pourer's face, fifty pixels from the painted stream | The portrait path was never measured on the portrait file's pixels | [Methodology: live-image motion standard](new-area-methodology.md#live-image-motion-standard), measure on a gridded crop and prove it with an overlay contact sheet |
| 3 | The tapas sunbeam ended in a straight horizontal cut across the diners' table | The patch was clipped hard to its box; interior box edges now fade in the engine | [Methodology: live-image motion standard](new-area-methodology.md#live-image-motion-standard), look at every interior box edge at 100 percent zoom |
| 4 | The cider pour crawled down the thread | The dash speed did not scale with box height; fixed in the engine | [Playbook: owner walkthrough](agent-team-playbook.md#stage-e2-owner-walkthrough-reviewer-then-lead), watch every motion for ten seconds and judge it as physically plausible |
| 5 | Cups, bowls, plates and the fryer did not steam or bubble — "there should be smoke coming from tea cups etc" | "Every pictured hot vessel steams" was read as the big vessels only, and the `pot` boil config existed unused | [Methodology: every hot vessel steams](new-area-methodology.md#live-image-motion-standard) and the [definition of done](agent-team-playbook.md#5-definition-of-done-the-china-standard) |
| 6 | The world was too crowded to walk: 24 decorative houses, a three-storey house on the arrival line to two stands, blocked lanes | Decoration was added per cluster with no cap and no check against roads or approaches | [Methodology: build a believable community](new-area-methodology.md#build-a-believable-community); four harness checks in the [quality baseline](quality-baseline.md#what-the-harnesses-enforce) |
| 7 | The free-standing arcades and the hórreo read from above as tan slabs on stilts — "a bridge half in the water" | Decor was judged at close range only, never from the overview camera | [Methodology: build a believable community](new-area-methodology.md#build-a-believable-community), read every decor type from the overview |
| 8 | People slid without moving their legs; the mill mule circled tail-first with pendulum legs | A resident variant dropped the movement observer, sailors stood on sailing boats, and the mule's bearing and facing were inverted | [Definition of done](agent-team-playbook.md#5-definition-of-done-the-china-standard); the gait and gait-direction checks in the [quality baseline](quality-baseline.md#what-the-harnesses-enforce) |
| 9 | The fountains were static and the chimney smoke could not be seen at all | The fountains never ticked; smoke was born inside the roof geometry and the untinted four-puff column is invisible at overview zoom | [Definition of done](agent-team-playbook.md#5-definition-of-done-the-china-standard), every water feature ticks and smoke is checked in a screenshot at the default overview zoom |
| 10 | Stage E had passed with all of the above present | The review verified through harnesses and audits and looked at too little on screen | [Playbook: Stage E2, the owner walkthrough](agent-team-playbook.md#stage-e2-owner-walkthrough-reviewer-then-lead), required before Stage F |
| 11 | The room motion table in [Spain rooms](spain-rooms.md) was stale and stayed stale | The cues changed after the capture and nobody re-ran it | [Playbook: Stage E2](agent-team-playbook.md#stage-e2-owner-walkthrough-reviewer-then-lead) — any change to a room's cues re-runs the motion capture, as a Sonnet task, before hand-over |
| 12 | The lead had done the fixing itself, and removed the wrong object when the owner pointed | No tiering rule kept the lead out of the files, and no rule made it confirm the object first | [Playbook: which model does which step](agent-team-playbook.md#6-which-model-does-which-step) and [communication rules](agent-team-playbook.md#7-communication-rules) |

The pattern under all twelve: every one was visible in ten minutes of looking, and none was visible to a harness
that did not yet exist. Harnesses keep a fixed defect fixed; they do not find the next one. Looking does.

## What happens next

Stage F waits on two owner decisions: whether the whole Mediterranean world goes live with Greece, Morocco and Dalmatia still at the card-only level, or those areas are dimmed first; and what to do about the stands that stand in front of other stands. The 2026-09-17 pass cleared every house and tree from in front of every clickable object, which leaves that second question as the only thing still hiding a stand: the family kitchen covers the ham counter, the churrería covers the pintxo bar, and the Alhambra and the bodega together cover the courtyard kitchen. Those are positions in `spain-objects.ts` and geometry in `props-spain.ts`, so the fix is the Researcher's and the Stand maker's, not the Builder's, and it is a question of how far the blueprint's cluster centres can move. A second independent review pass after that, then publish.
