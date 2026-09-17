# Britain world (area id `london`)

The `london` area of the Central Europe world grows from one London street into Britain. This document follows the [team playbook](agent-team-playbook.md): it records the session baseline, the Stage A research hand-off and the shared contracts, and later the build, the animation inventory and the checks. The pictures do not exist; the [image brief](london-image-brief.md) is the Stage A deliverable and the build waits for the files.

The Researcher's delivery is [london-research.md](london-research.md): area brief, palette, clothing profiles, proposed objects, room list, sixteen corrections to the original UK example prompt, dated story facts with sources, and open questions. The repertoire is `src/fw/london-repertoire.ts`.

## Stage 0: session baseline, 2026-09-17

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes, before and after `london-repertoire.ts` was added |
| `npm test` | 17 harnesses pass: `camel-gait`, `object-ids`, `prop-reactions`, `prop-supports`, `recipe-addon`, `repertoire`, `room-controls`, `room-loops`, `scene-ambience`, `spain-reactions`, `spain-world`, `turkey-reactions`, `turkey-world`, `village-speech`, `world-availability`, `world-intros`, `xinjiang-reactions` |
| `node scripts/audit/objects.mjs` | Runs and matches the [quality baseline](quality-baseline.md) for China, the Middle East and the Mediterranean. **It does not report this area at all**: line 6 filters to `['china','middle-east','mediterranean']`, so `central-europe` is invisible to it. The baseline for `london` below was read out of `graph.ts` and `world-ceurope.ts` by hand |
| Breeze masks | Not re-run, and nothing to run them on: the Central Europe world has no painted scenes, so it has no masks |
| Live world | **Not looked at.** Stage 0's live pass belongs to the lead, and this session is the Stage A researcher. Everything below the audit line is read from the code and is marked as such |

Two things that are not defects but that the lead should know before Stage B:

- `scripts/audit/objects.mjs` has to learn `central-europe` before this area can have baseline numbers in the ordinary way. It is a one-line change in a file nobody in Stage A owns.
- `PUBLISHED_WORLDS` in `world-availability.ts` holds `china`, `middle-east` and `mediterranean`. Central Europe is not published, so the public page shows it asleep, and Budapest, the Alps and Georgia sit beside `london` at the same pre-China-standard level that Greece, Morocco and Dalmatia did beside Spain.

## What the `london` area is today

The Central Europe table is 76 x 56 world units (`world-ceurope.ts`), x from -38 to 38 and z from -28 to 28, with the Channel in the north-west, the Black Sea in the east and the Danube down the middle. `AREAS.london` is `{ world: "central-europe", name: "London", center: [-20, -15], blurb: "Big Ben on the Thames, Tower Bridge, the pub carvery, the patisserie, the woods" }`.

The area has **eight objects, no rooms and no scene folder**.

| Object | Kind | Prop | Position | Reaction today |
| --- | --- | --- | --- | --- |
| `roastPub` The pub carvery, "The Sunday roast" | technique, `place: true`, `placeName: "Pub carvery"` | `pub` | [-16, -4] | Knife lifts, the Wellington rises, the slice turns, four seated drinkers lean; steam point over the counter |
| `pastryCe` Butter puff pastry, "Pâte feuilletée" | ingredient | `bakeryCe` | [-13, -25.5] | Rolling pin passes, the laminated block squashes, the baker bends |
| `mushroomsCe` Mushrooms, "The woods" | ingredient | `mushroomWood` | [-27, -26] | Nine mushrooms swell in sequence, the forager bends over the basket |
| `bigBen` Big Ben & Westminster | landmark | `bigBen` | [-27.5, -16] | The clock hands accelerate, "Bong!" |
| `towerBridge` Tower Bridge | landmark | `towerBridge` | [-19, -22] | Both bascules lift and fall |
| `londonEye` The London Eye | landmark | `londonEye` | [-13, -15] | The wheel spins up, the pods stay level |
| `redBus` The red bus & the black cab | landmark, `hitOnly: true` | `none` | [-12, -9] | **None.** With `prop: "none"` there is no mesh and no `poke`, so this object has a card and a hit target and nothing else |
| `phoneBox` The phone box & the pillar box | landmark | `phoneBox` | [-24, -11.5] | The kiosk rocks, "Ring ring!" |

Counts: **0 rooms, 7 card-only clickables with a prop, 1 hit-only.** By kind: 2 ingredient, 1 technique, 5 landmark. There is no `dish`, no `place` and no `flavour` object in the area, and no object of any kind opens a painted room.

What the world file builds around them (`layoutCeurope`):

- **Ground**: one paving tint at (-20, -15), 12 x 12, `#b8b4ad`.
- **Roads**: one rectangular loop, four straight segments through [-30,-22], [-10,-22], [-10,-9], [-30,-9], width 2.2, colour `#6e6e72`. It is the only road in the area and it is a closed rectangle, not a street plan.
- **Water**: the Channel polygon along the north-west edge (x about -38 to -33, z -28 to 0) and the Thames, a Catmull-Rom curve entering at [-18, -28], running south and then west to [-35.5, -6], drawn 3.4 wide on a 5.0 rim, with `estuaryWater` at its mouth. One Westminster Bridge deck sits on the curve at t = 0.53.
- **Walkers and traffic**: seven `local()` residents on the road loop with `walk()`, four more standing in pairs at [-24,-19.5] and [-22,-12], and four vehicles — two `redBus()` and two `blackCab()` — circling the same loop. One flock of five pigeons at [-20, -15]. Four round trees at the corners. The pub prop carries its own carver and four seated drinkers; the bakery its baker; the woods its forager.

So the area has **three walker-and-traffic loops in one rectangle, one road, one river, no cluster structure, no decorative houses of its own, and no non-food clickable with a 3D reaction beyond the four landmark props.** Against the China standard it is short of everything: four or more clusters, ten or more stands, five or more ingredient stops, three or more walker loops, rooms.

Two recipe rows point at this area: every recipe whose cuisine is `British` is routed to `area: "london"` in `graph.ts`, and the Beef Wellington row carries `place: "roastPub"`. **Both depend on the id `london` and the id `roastPub`, and neither may change.**

## Stage A: the recommendation — London, or Britain

**Recommendation: Britain.** Keep the area id `london`, change the display name in `AREAS` to "Britain", keep London as the densest cluster and the arrival view, and grow the country and the coast round it — exactly the shape Spain took when the Plaza Mayor kept its place and the Albufera, La Mancha, the ría, Andalusia and the Basque coast grew around it.

Four reasons, in the order they decided it.

1. **London alone cannot reach the China standard honestly.** The definition of done asks for four or more clusters, ten or more interactive stands, five or more ingredient stops and at least three clickables that are not food stands. An honest London holds seven rooms — the public house, the tea room, the market, the pie and mash shop, the coffee stall, the seamen's kitchen, and a fried fish shop — and two ingredient stops, the pastry board and the oyster beds. Everything beyond that would have to be invented, and the moment a "London hop garden" or a "London cheese dairy" is invented the area stops being true, which is the one thing this project has never traded away.
2. **British food is regional, and the regions are where the stories are.** Almost every documented fact in [london-research.md](london-research.md) is attached to a place outside London: the hop acreage peak of 1878 in Kent, the creamery at Hawes in 1897, the forcing sheds between Wakefield and Rothwell from 1877, the 1746 pasty recipe in the Cornwall Record Office, the Penclawdd sands, the Auchmithie smoke pit, Doig's pagoda at Dailuaine in 1889, the herring year of 1913. A London-only area throws all of it away and keeps the tourist half.
3. **Spain is the precedent and it worked.** The owner's own comparison is the right one. Spain's six clusters gave the area six unlike-each-other looks — a lagoon, an arcaded square, a whitewashed patio, a dry plain, a wet ría, a coast — and that variety is most of why the area reads. Britain has the same range available and, being an island, a cleaner boundary than Spain had.
4. **Nothing in the code has to break.** The area id, the `Area` union, the British recipe routing and the `roastPub` recipe target all stay exactly as they are. Only the `AREAS.london` `name` and `blurb` change, which is a display string. This is the `plancha` case from Spain — a name change without an id change — and the playbook's rule applies: every agent must be told, in this document, that the id is `london` and the area is called Britain.

**If the lead keeps "London" instead**, the object list below is cut to the seven rooms and two stops named in reason 1, five landmarks become three, the image budget falls to about 25, and the area ships below the China standard on cluster count and stand count. That is a real option and it is cheaper, but it should be chosen knowingly.

### Blueprint frame (provisional, Stage B fixes it)

The current 76 x 56 table cannot hold Britain: the `london` corner runs x -30 to -10 and z -28 to -9, about 20 x 19, and the Alps sit immediately south of it. The Researcher's proposal, for the lead to accept, redraw or reject at Stage B:

- **Grow the table west only.** `W: 120, D: 56, cx: -22`, so x runs from -82 to 38 and z stays -28 to 28. Every existing Alpine, Hungarian and Georgian coordinate keeps its value, and the `|z| >= 28` edge test in `shore()` is untouched, which the Spain growth also needed and which growing `D` would break for the Black Sea polygon's z = 28 vertices.
- **Make Britain an island.** The existing Channel water becomes the strait between Britain and the continent, extended north and south so it runs the full depth of the table, and one continuous sea wraps the island on the other three sides, square at the table edge. Britain then owns roughly **x -80 to -34, z -28 to 24**.
- **Two known costs, both the lead's to price.** The existing Thames curve enters the table at [-18, -28], east of the proposed strait, and has to be re-laid on the British side. The two western Alpine peaks at [-34.5, 12] and [-33, 4] sit in the proposed strait and have to move east.
- The arrival view becomes the London cluster: `AREAS.london.center` about **[-48, 2]**.

Every position in the object list below is written in that proposed frame and is **provisional**. If the lead chooses another frame the ids, kinds, clusters and purposes are unaffected; only the coordinates move.

### Recommendations on the open questions

Section 5 of [london-research.md](london-research.md) raises nineteen questions. These are the Researcher's recommendations; the lead confirms or overrides each one and this table becomes the decisions record.

| Question | Recommendation |
| --- | --- |
| London or Britain | **Britain**, id unchanged. Argued above |
| The table frame | Grow west to `W: 120, cx: -22` and make Britain an island in the north-west, with the existing Channel as its strait. A Stage B decision; nothing in Stage A depends on it |
| Rooms: thirteen or cut to eleven | **Thirteen.** The playbook allows ten to fifteen, Spain shipped twelve, and thirteen across six clusters gives 3 / 3 / 1 / 2 / 2 / 2, which is flatter than Spain's 4-in-one-square. Budget rises to 46 images |
| **The example prompt is contemporary and the art direction is not** | **Follow the art direction.** One band, about **1880 to 1914**, everyday working clothes. [examples/uk-scene-generation-prompt.txt](examples/uk-scene-generation-prompt.txt) asks for a contemporary world and lists "making every scene look Victorian" under Avoid; the art direction requires one recorded period and forbids mixing eras. They cannot both be followed and **this is the owner's decision, not the lead's**, because it rewrites every room |
| Clothing period | About 1880 to 1914. Every room is anchored inside it by a dated record, and it is the first period of British working life that is photographed rather than painted, so a brief written from it can be checked |
| The curry house is only recorded from 1911 at the earliest, and in the East End from the 1920s | Paint the in-period thing: a **Sylheti and Chittagonian seamen's boarding-house kitchen in Shadwell**, with a stone spice slab and an iron pan. The card carries the Hindoostane Coffee House of 1810, Salut e Hind reported at 1911 and Veeraswamy at 1926 as reported dates. This is Spain's gilda problem and it takes Spain's answer |
| The London Eye (2000), the Routemaster (1956) and the K6 kiosk (1935) are outside the band | **Retire `londonEye`**; recast `redBus` onto the 1907 red omnibus and the hansom cab, and `phoneBox` onto the 1852 pillar box. Both recasts are already the fact their existing cards lead with. `forthBridge` replaces the Eye one for one and moves a landmark out of the crowded London cluster |
| "The pub carvery" | **Rename to "The public house"**, id `roastPub` unchanged, `place: true` unchanged, the Beef Wellington recipe target unchanged. A self-service carvery counter is a post-war British restaurant format and the word puts a 1960s hotel in an 1890s room. This is a name change without an id change: **every agent is told here** |
| `redBus` has `prop: "none"` and `hitOnly: true` | Give it a real `omnibus` prop. It then has a 3D reaction and counts as a non-food clickable in the object audit, neither of which is true today |
| Northern Ireland has no cluster | Accept it and say so. The Lough Neagh eel fishery, PGI since 2011, sends most of its eels to Billingsgate for the jellied-eel trade; Ulster reaches the table through the pie and mash shop's card and story depth rather than through a sixth-and-a-half cluster |
| Card blurb length | The whole file is below band and has to come up. See "Shared contract: the card blurb band" below |
| Unverified facts (the baker's oven, Malin and Lees, the Coffey still and the 1908–09 Royal Commission, the duchess of Bedford, the pasty crimp-as-handle, the 1913 herring tonnage, the hop-picker numbers) | Stay out of cards until verified in Stage C, or are written as "is said to", "reported" or as a range, exactly as section 5 of the research says. Nothing above goes in as a flat date |
| Clothing inventory numbers | **Open.** Unlike Spain, the research has named collections but no inventory numbers. Before generation the picture reviewer pulls one catalogued garment or photograph per profile from MERL, the London Museum, the Scottish Fisheries Museum, St Fagans, the Royal Cornwall Museum and the Sutcliffe collection. Profiles 4, 6 and 8 matter most |
| `scripts/audit/objects.mjs` ignores `central-europe` | Teach it the world before Stage B, so the area has baseline numbers in the ordinary way |

## Shared contract: the object list

Positions are in the proposed frame above (x from -80 to -34, z from -28 to 24) and are the **Stage A proposal**; the Stage B blueprint fixes them. Every object has `world: "central-europe"`, `area: "london"`. Ids were checked against all 379 ids in `src/fw/*.ts`; none of the twenty-three new ones collides, and `scripts/tests/object-ids.mjs` guards this once they are registered. Prop names were checked against `CEUROPE_PROPS`; none collides.

### Objects that open rooms (13)

| id | name | zh | kind | pos | prop | scene | purpose | reaction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `roastPub` | The public house | The Sunday joint | technique | [-46, 4] | `pub` | `uk_pub` | Existing id, new name: the one roast of the week, carved at the counter | The knife draws and a slice falls off the joint onto the plate; the batter tin slides forward; a drinker at the settle looks up |
| `teaRoomUk` | The tea room | Afternoon tea | place | [-51, 0] | `teaRoom` | `uk_tearoom` | The public room a woman could sit in alone | The pot tilts and a thread of tea falls into the cup; the waitress turns; the cup steams harder |
| `boroughUk` | The market | Borough Market | place | [-44, -1] | `boroughMarket` | `uk_market` | London's oldest food market, at first light, under iron | The cheese wire draws down and a wedge falls away; the porter's barrow rolls a half turn; the brass balance settles |
| `pieMashUk` | The pie and mash shop | Pie, mash and liquor | dish | [-39, 2] | `pieShop` | `uk_piemash` | Tile, marble and mirrors; three things and the eels they were built on | The ladle tips and green liquor runs over the pie; the pie lid breaks; the pieman wipes the marble |
| `chippyUk` | The fried fish shop | The chippy | dish | [-54, -10] | `chipShop` | `uk_chippy` | The first hot cooked meal a working week could buy | The wire basket lifts out of the fat and shakes, fat streaming off it; the frier's arm follows; a child in the queue leans in |
| `breakfastUk` | The porters' breakfast | The coffee stall | dish | [-36, 6] | `coffeeStall` | `uk_breakfast` | A stall under a naphtha flare at four in the morning | A rasher curls on the griddle and a mug fills from the boiler tap; the stallholder turns the bacon; a porter takes the mug |
| `lascarUk` | The seamen's kitchen | লস্কর রান্নাঘর | place | [-40, 7] | `lascarKitchen` | `uk_lascar` | Sylheti and Chittagonian seamen cooking for each other in a Shadwell back room | Ground spice slides off the slab into the pan and the pan tilts; the cook's hand follows; a man on the bench looks over |
| `hopKitchenUk` | The hop-pickers' cookhouse | Hopping | place | [-43, 15] | `hopCookhouse` | `uk_hopkitchen` | A quarter of a million Londoners' working holiday, and the fire they cooked on | The pot swings on its chain and the ladle lifts and pours back; the fire flares; a child at the bin turns round |
| `dairyUk` | The dale dairy | Wensleydale | dish | [-58, -14] | `daleDairy` | `uk_dairy` | Farmhouse cheese in a cold stone dairy | The press screw turns down and whey runs into the pail; the truckle settles in the hoop; the dairymaid straightens |
| `pastyUk` | The Cornish bakehouse | Pasti | dish | [-73, 8] | `pastyBakehouse` | `uk_pasty` | A dinner with a handle, and a granite oven | The peel slides a tray of pasties into the oven mouth and the glow brightens; a thumb crimps one on the board; a child steps back |
| `cocklesUk` | The cockle sands | Cocos a bara lawr | place | [-69, 13] | `cockleStall` | `uk_cockles` | The Penclawdd women, the riddle, the donkey and the boiling copper | The riddle shakes and sand falls through it; the basket lifts out of the copper; the donkey's head turns |
| `smokehouseUk` | The smokehouse | Arbroath smokies | dish | [-62, -23] | `smokehouse` | `uk_smokehouse` | A fire in a hole in the ground and haddock tied in pairs | A speet of paired fish is lowered over the pit and the smoke gusts up; the hessian is thrown over; the curer steps back |
| `distilleryUk` | The distillery | Uisge beatha | place | [-67, -25] | `distillery` | `uk_distillery` | Barley, peat, burn water, copper, and the vent that shows where the malt is drying | The shiel turns the barley on the floor and spirit runs in the safe; the pagoda vent turns; the maltman leans on the shiel |

### Ingredient stops, card only (10, two existing)

| id | name | zh | kind | pos | prop | purpose |
| --- | --- | --- | --- | --- | --- | --- |
| `pastryCe` | The pastry board | Butter, flour and suet | ingredient | [-50, 5] | `bakeryCe` | Existing. Re-sited beside the pub and the market; puff, shortcrust, hot-water crust and suet |
| `oystersUk` | The oyster smacks | Natives | ingredient | [-36, 1] | `oysterSmack` | Whitstable and Colchester natives at Billingsgate; the poor man's food that priced itself out of his reach |
| `hopsUk` | The hop garden and the oast | Fuggle and Golding | flavour | [-40, 18] | `hopGarden` | Bitterness and keeping power; the 1878 acreage peak and the cowl that turns to the wind |
| `mushroomsCe` | The woods | Field and wood | ingredient | [-46, 19] | `mushroomWood` | Existing. Re-sited into the Wealden woods; field mushrooms, ceps, and the duxelles under the Wellington |
| `sheepUk` | The dale flock | Swaledale | ingredient | [-60, -11] | `daleFlock` | Horned hill sheep hefted to their own fell; mutton for the joint, coarse wool for the carpet |
| `rhubarbUk` | The forcing shed | Yorkshire forced rhubarb | ingredient | [-53, -14] | `forcingShed` | Nine square miles of sheds growing rhubarb in the dark, pulled by candlelight, on a night train to London |
| `orchardUk` | The orchard and the cider pound | Kingston Black | ingredient | [-75, 12] | `ciderOrchard` | Bittersweet apples nobody would eat, a horse walking a stone, and cider paid as wages |
| `leeksUk` | The leek bed | Cennin | ingredient | [-67, 16] | `leekBed` | The emblem of Wales in a cottage bed, and the one-pot stew it goes into |
| `oatsUk` | The oat field and the meal mill | Coirce | ingredient | [-70, -21] | `oatMill` | The grain that grows where wheat will not, the water-driven meal mill, and the girdle |
| `herringUk` | The herring quay | The silver darlings | ingredient | [-58, -25] | `herringQuay` | The autumn fleet, the cran basket, the farlane and the three-woman gutting crew |

### Landmarks with a card and a 3D reaction (6, four existing)

| id | name | zh | kind | pos | prop | reaction |
| --- | --- | --- | --- | --- | --- | --- |
| `bigBen` | Big Ben & Westminster | The Palace of Westminster | landmark | [-52, 4] | `bigBen` | Existing, in period (1859). The minute hand steps and the dials warm at dusk |
| `towerBridge` | Tower Bridge | The bascule bridge | landmark | [-37, 4] | `towerBridge` | Existing, in period (1894). The bascules lift and a steam coaster passes under |
| `redBus` | The omnibus and the hansom cab | The General | landmark | [-47, 1] | `omnibus` (new; replaces `none`) | Recast to 1907. The pair steps off, the omnibus rolls, the cabman touches his hat |
| `phoneBox` | The pillar box and the lamp | The Penfold | landmark | [-49, -2] | `pillarBox` (new; replaces `phoneBox`) | Recast to 1852. The collection door swings open and the lamplighter's pole lights the mantle |
| `forthBridge` | The Forth Bridge | Drochaid an Fhoirthe | landmark | [-61, -19] | `forthBridge` | New, replacing `londonEye`. A train crosses and the painters' cradle swings |
| `engineHouseUk` | The engine house | Wheal | landmark | [-77, 6] | `engineHouse` | New. The beam rocks in the bob wall and steam puffs from the stack |

**Retired: `londonEye`** (the wheel is from 2000 and has no in-band recast).

Counts against the definition of done: **13 room stands, 10 ingredient stops, 6 landmarks, 29 objects; 16 card-only clickables that are not food stands**, against the required three. Spain shipped 12 / 10 / 4 and 14. The area today has 0 / 2 / 5 and 7.

## Shared contract: clusters and water

Six clusters. One line of character each.

| Cluster | Centre | Character in one line | Holds |
| --- | --- | --- | --- |
| Westminster and the River | [-48, 2] | Wet stone, brick and gaslight: the arrival view, the densest cluster, and the only place on the island where a landmark is bigger than a house | `roastPub`, `teaRoomUk`, `boroughUk`, `pastryCe`, `bigBen`, `redBus`, `phoneBox` |
| The Docks and the East End | [-38, 4] | Brown water, warehouses and night work, where the cheapest food in Britain and the food of three continents met on one street | `pieMashUk`, `breakfastUk`, `lascarUk`, `oystersUk`, `towerBridge` |
| The Weald | [-42, 16] | Green strings twelve feet high and a town's worth of Londoners living in a field for six weeks every September | `hopKitchenUk`, `hopsUk`, `mushroomsCe` |
| The Dales and the Mill Towns | [-56, -12] | Cold stone, walls that climb out of sight, and a valley that sends milk, mutton and rhubarb down to the smoke | `chippyUk`, `dairyUk`, `sheepUk`, `rhubarbUk` |
| The West Country and the Bristol Channel | [-72, 10] | Granite and cob on one shore, a mile of cockle sand on the other, and two ways of carrying your dinner to work | `pastyUk`, `cocklesUk`, `orchardUk`, `leeksUk`, `engineHouseUk` |
| The Firths and the Herring Coast | [-64, -24] | Smoke, salt and barley: the coldest, cleanest light on the table and the only cluster where every trade is a preserving trade | `smokehouseUk`, `distilleryUk`, `oatsUk`, `herringUk`, `forthBridge` |

**Water (proposal).** Britain is an island. One continuous `seaWater()` polygon wraps x -80 to -34 and z -28 to 24 on all four sides, square where it meets the table edge, and the existing Channel polygon becomes the strait on its eastern side, extended north and south to run the table's full depth. One river rises in the western hills around [-76, -6], runs east through the Westminster cluster, widens past the Docks and reaches the strait at about [-34, 4] with an `estuaryWater` blend; the London bridges sit on it. A second, much smaller estuary at about [-69, 14] is the cockle ground and reads as wet sand, not open water, at low tide. Nothing stands in water except the two bridges, which are built to. The Albufera lesson applies: field and quay stands go **beside** the water, never on it, and `scripts/tests/london-world.mjs` should test every vertex of every stand against the sea, the river and the estuary from the first commit, not after the review.

## Shared contract: rooms

Thirteen rooms. The room list, the three discovery subjects, the signature motion, the supporting cues and the sprites per room are in section 3 of [london-research.md](london-research.md) and, in final form, in the [image brief](london-image-brief.md).

| Room id | Folder | Opens from | Signature motion | Sprites |
| --- | --- | --- | --- | --- |
| `uk_pub` | `public/scenes/uk_pub/` | `roastPub` | One slice separating from the sirloin | `ld_motion_pub_sign`, `ld_motion_hop_bine` |
| `uk_tearoom` | `public/scenes/uk_tearoom/` | `teaRoomUk` | Tea falling through the strainer into the cup | `ld_motion_hanging_lamp` |
| `uk_market` | `public/scenes/uk_market/` | `boroughUk` | The cheese wire drawing down through the truckle | `ld_motion_game_brace` |
| `uk_piemash` | `public/scenes/uk_piemash/` | `pieMashUk` | Green liquor running off the ladle over the pie | none |
| `uk_chippy` | `public/scenes/uk_chippy/` | `chippyUk` | The chip basket lifted clear of the fat and shaken | none |
| `uk_breakfast` | `public/scenes/uk_breakfast/` | `breakfastUk` | A mug filling from the boiler tap | `ld_motion_gull` |
| `uk_lascar` | `public/scenes/uk_lascar/` | `lascarUk` | Ground spice sliding off the slab into the hot fat | `ld_motion_hanging_lamp` |
| `uk_hopkitchen` | `public/scenes/uk_hopkitchen/` | `hopKitchenUk` | The pot swinging on its chain, the ladle pouring back | `ld_motion_hop_bine` |
| `uk_dairy` | `public/scenes/uk_dairy/` | `dairyUk` | Whey running from the press spout into the pail | none |
| `uk_pasty` | `public/scenes/uk_pasty/` | `pastyUk` | A thumb crimping along the edge of a raw pasty | none |
| `uk_cockles` | `public/scenes/uk_cockles/` | `cocklesUk` | The riddle shaken, sand falling through it | `ld_motion_gull` |
| `uk_smokehouse` | `public/scenes/uk_smokehouse/` | `smokehouseUk` | A speet of paired fish lowered over the smoke pit | `ld_motion_smoke_speet`, `ld_motion_gull` |
| `uk_distillery` | `public/scenes/uk_distillery/` | `distilleryUk` | Spirit running through the glass of the safe | none |

**Three rules carried into every room prompt, from the Spain and China passes.** They are in full in the image brief's opening section and repeated per room:

- Every hanging object meant to move is a **separate keyed sprite**, and the painting shows only its **empty hook, bracket, chain end, nail or rail**, against a plain wall or sky that is a different tone from the sprite. No cut-outs from finished paintings, ever, and no warm ochre wall where a key would be wanted.
- Every hot vessel is pictured **open**; every pour shows a **clear lip, a visible stream and a clear landing surface**.
- Portrait compositions keep every subject that matters inside the **middle 80 per cent of the width** (x .094 to .906), because a phone crops the rest.

And one that belongs to this area in particular: **`uk_dairy` is a cold room.** No fire, no steam, no boiling, nothing hot in it at all. Its liquid is whey running out of a press, and it gets the `drip` glint variant, not a steam source. Spain's cheese farm steamed over a cold caldero and the owner read the room's own text and asked why.

**Sprites: six.** `ld_motion_pub_sign`, `ld_motion_hop_bine`, `ld_motion_game_brace`, `ld_motion_gull`, `ld_motion_smoke_speet`, `ld_motion_hanging_lamp`. Card illustrations: one per room, thirteen.

## Shared contract: the repertoire

`src/fw/london-repertoire.ts` holds `LONDON_REPERTOIRE`, keyed by all thirteen room objects, hero first. No landmark and no ingredient stop carries one, which is the handbook's rule: a hop garden and a pillar box have no kitchen. Entry counts: `roastPub` 8, `teaRoomUk` 7, `boroughUk` 7, `pieMashUk` 5, and 6 each for the other nine. Eighty-one entries, every line inside the 12-to-25-word band, every `zh` a real vernacular or trade name rather than a translation of the English, and **no `recipe` ids at all**, because no British recipes exist yet in `public/static/recipes.json` beyond the Wellington's own row. Wiring the table into `src/fw/repertoire.ts` is a Stage D registration, not a Stage A change; `npm run typecheck` passes with the file present and unimported.

## Shared contract: the card blurb band

**This area's existing blurbs are far below the standard, and the band has to be raised before a single new card is written.** Measured on 2026-09-17:

| File | Blurb lengths | Shape |
| --- | --- | --- |
| Central Europe objects in `graph.ts` (28 objects, 8 of them `london`) | 273 to 502 characters | One paragraph each |
| `spain-objects.ts` room objects (12) | 1,344 to 1,815 characters | Three or more paragraphs |
| `spain-objects.ts` card-only objects (14) | 766 to 978 characters | Three paragraphs |

The definition of done asks for a three-to-five-paragraph blurb with dated eras and local-script names, and the band rule says a card sits beside the cards around it. Both point the same way here: **the band for this area is Spain's**, and it is set now, at Stage A, not discovered at the walkthrough.

- **Room objects: three to five paragraphs, about 1,300 to 1,800 characters.**
- **Card-only objects — every ingredient stop and every landmark: three paragraphs, about 750 to 1,000 characters — identity, the record with its dates and sources, and a route out to a related place.** The Turkish market's sumac card shipped at two sentences among three-paragraph neighbours and the owner found it by opening it.
- **The five retained objects are rewritten to the same band.** `roastPub` (494 characters), `pastryCe` (402), `mushroomsCe` (371), `bigBen` (393), `towerBridge` (416), `redBus` (292) and `phoneBox` (273) are all a third to a quarter of the length their new neighbours will run to. Leaving them is exactly the defect the rule was written for, and it would be twice as visible here because they sit in the arrival cluster.
- A thin card goes back at the Stage A check, not at the walkthrough.

Three to five dated facts per room object with sources, and two `NEXT` links each, are in section 4 of [london-research.md](london-research.md), grouped by object, with the sources listed by object in section 4.15. Six facts are flagged unverified and are kept out of cards until checked.

## Speech lines and palette

Section 2.5 of the research holds five to six ambient lines per room object, in English, West Riding, Scots, Welsh, Cornish, Gaelic and Bengali with English on the same line. Section 1.3 holds the twelve-colour palette (`londonStock`, `portlandStone`, `millstoneGrit`, `moorGranite`, `slateNorth`, `kentPeg`, `pubGreen`, `oxbloodTile`, `postRed`, `oakSmoke`, `hopGreen`, `northSea`) and the eight clothing profiles. The Builder turns both into data in `london-architecture.ts` and `london-people.ts`.

## Stage A check

- **Every object has a unique id, a `kind`, an `area`, a position proposal, a prop, a purpose and a named reaction**: yes, 29 objects, five of them existing, one existing object proposed for retirement. Twenty-three new ids checked against all 379 ids in `src/fw/*.ts`; no collision. Prop names checked against `CEUROPE_PROPS`; no collision.
- **Every historical claim has a source**: section 4 of the research, grouped by object, with URLs in section 4.15. Six facts are flagged unverified and are kept out of cards until checked; three more are to be written as ranges rather than single figures.
- **Every kitchen room and every place-or-dish object has a repertoire**: thirteen keys, hero first, four to eight entries each, every line 12 to 25 words, no `recipe` ids. Verified by building the module and counting: 81 entries, 0 problems. `npm run typecheck` passes. `scripts/tests/repertoire.mjs` will cover it once the ids are registered and the table is merged in `repertoire.ts`, which is Stage D.
- **The card blurb band is written down before any card is written**, and the five retained blurbs are booked for rewriting to it.
- **Image brief written with exact file names and the drop folder**: [london-image-brief.md](london-image-brief.md), 46 files into `~/Downloads/additional game asset/london/`.
- **Not done in this pass, and not this role's**: no second-agent review of the brief against the art direction (Spain's had one, and it found twelve things on the first pass); no live look at the world; no picture acceptance, because there are no pictures.

## What happens next

**Stage B waits for the pictures.** Forty-six files into `~/Downloads/additional game asset/london/` with the exact names in the [image brief](london-image-brief.md). Nothing in Stage B starts on guessed pictures, and the owner has said development pauses until Monday while she generates them.

Before the files arrive, three things are open and none of them belongs to the Researcher:

- **The owner's decision on the period.** The original UK example prompt is contemporary and the current art direction is not. This brief is written to the art direction, band 1880 to 1914. If the owner prefers the contemporary reading, the brief is rewritten before any picture is generated, and most of the research's records become background rather than subject. This is the first decision and everything else waits on it.
- **The owner's decision on the three out-of-period landmarks**, and in particular on retiring the London Eye.
- **The Central Europe table's blueprint.** Britain does not fit the 76 x 56 table as it stands, and the frame proposed above grows the table west, makes Britain an island, re-lays the Thames and moves two Alpine peaks. **That is the Lead's Stage B decision, not the Researcher's.** The object list's ids, kinds, clusters, purposes and reactions are unaffected by whichever way it goes; only the provisional positions move. The lead should also settle at Stage B whether the grown area keeps one area id with six clusters, as Spain did, or splits into sub-areas as Turkey did — the recipe routing needs `london` to exist either way.

Two smaller items for whoever opens Stage B: teach `scripts/audit/objects.mjs` the `central-europe` world so this area can have baseline numbers, and decide with the owner whether publishing Britain means publishing the whole Central Europe world — Budapest, the Alps and Georgia are at the card-only level and would go live beside it, as Greece, Morocco and Dalmatia did beside Spain.
