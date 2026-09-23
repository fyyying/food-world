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

## Stage B: pictures and blueprint, 2026-09-21

### Picture acceptance

All 46 files arrived in `~/Downloads/additional game asset/london/` with two inventories (`ld_inventory.txt`, `ld00_concept_inventory.txt`). The inventories are the generator's claims; every file was opened and judged against [art direction](art-direction.md) section 8 and Part E of the [image brief](london-image-brief.md). Sizes were measured from the PNG headers, not read out of the inventory: **all 13 wide files are exactly 1672 x 941, all 13 portraits exactly 941 x 1672**, the concept is 1671 x 941 (no size is required for the concept), and every sprite and card is opaque RGB with a white ground whose short side stays above 400 px after the importer's trim and 960 px long-side cap (smallest: `uk-hanging-lamp` 535 x 960, `chippy` card 960 x 459).

**43 accepted, 3 rejected.** After the regeneration of 2026-09-21 all three rejects pass, so the set stands at **46 accepted, 0 outstanding**; the three rows below carry their own pass reasons.

| File | Verdict | Reason / regeneration instruction |
| --- | --- | --- |
| `ld00_concept.png` | Accepted | One island in one sea, square at the table edge; six neighbourhoods in the brief's order; one river widening to a brown estuary; the four landmarks small and behind their food; nothing standing in water but the two bridges |
| `ld01_pub_wide.png` | Accepted | Sirloin part-carved with the cut face pink and crusted, knife mid-stroke in a clear area, flat batter pudding cut in squares, open gravy copper, both empty hooks present (iron sign bracket on plain brick outside, plain nail on the beam over the bar), coal fire clear |
| `ld01_pub_portrait.png` | Accepted | Recomposed, not cropped; joint, pudding tin and beer engine all inside the middle 80 per cent; beam hook and street bracket both empty |
| `ld02_tearoom_wide.png` | Accepted | Pot tilted with a clear spout lip, an unbroken thread through the strainer and the cup standing on the table; empty brass ceiling chain and ring over plain plaster; bread and butter and the cut cake clear |
| `ld02_tearoom_portrait.png` | Accepted | Same pour recomposed, all three subjects inside the band, chain ring still empty |
| `ld03_market_wide.png` | Accepted | Wire drawn down the truckle with the wedge falling, butter and ribbed pats on the marble, apples in the chip basket; empty S-hook on the stall rail against plain canvas, the bacon side on a separate hook well away; cold food carries no steam |
| `ld03_market_portrait.png` | Accepted | Truckle, butter and apples inside the band; empty hook on the post at the right, hung meat on a different hook |
| `ld04_piemash_wide.png` | Accepted | Ladle tipped with a clear lip, a green fall and a clear landing on pie and mash; broken-open pie; green and white glazed dado; empty brass hook on the plain counter panel |
| `ld04_piemash_portrait.png` | **Pass (regenerated 2026-09-21)** | It is the same shop as its wide again: green-and-white glazed tile on the back wall, and the window gives a wet dock street with masts, a crane, a gas lamp and rain — no clock tower and no Westminster building anywhere. The ladle is tipped with a clear lip, a green fall and a clear landing on the pie and mash, the pie is broken open on the beef, and both eel trays are there, the stewed tray steaming and the jellied tray cold and not. No text, nothing modern, nothing hot painted over cold food. The empty brass hook has moved to the right-hand counter panel at about x .90, just inside the middle 80 per cent, and this room has no sprite, so the hook is decorative either way |
| `ld05_chippy_wide.png` | Accepted | Both pans open and bubbling, basket lifted with fat in visible threads back to the fat surface, draining rack, bench chipper and raw chips, paper being folded; mill chimneys and rain outside; empty iron hook on a plain painted panel beside the range |
| `ld05_chippy_portrait.png` | **Pass (regenerated 2026-09-21)** | The window is now a wet northern mill-town street: terraced brick, two mill chimneys with smoke off one, gas lamps, umbrellas and rain on the glass, no clock tower and no London landmark. The basket is lifted clear with fat in threads back to the fat surface, the draining rack of fish and chips fills the foreground, the lad works the bench chipper over raw chips and a crate of potatoes at the right, and the empty iron hook is still on a plain cream panel at about x .84. Fried food steams, the raw chips do not; no text and nothing modern. The lit hanging lamp at upper left is painted, not the `uk-hanging-lamp` sprite, which belongs to the tea room and the lascar kitchen, not here |
| `ld06_breakfast_wide.png` | Accepted | The only night picture and it reads as one: naphtha light on faces, black street; open griddle, open-topped boiler, bacon curling, bread and butter board; empty hook under the canopy edge against plain dark canvas; clean black sky over the market roof for the gull |
| `ld06_breakfast_portrait.png` | Accepted, with a note | Tap lip, falling stream and landing in the mug are all clear, but the mug is **held in a hand** where the brief asked for it standing on the board. The pour is physically right and the glint still has its lip and its landing, so this is not worth a regeneration; the room maker anchors the glint on the mug rim as painted |
| `ld07_lascar_wide.png` | Accepted | Spice sliding off the tilted slab into the open pan with the cook's hand following; rice pan with its lid lifted and resting beside it; open curry pot; Sylheti dress from the brief's profile, no turbans, no costume; empty chain and S-hook over the range end against plain lime wash |
| `ld07_lascar_portrait.png` | Accepted | Slab, curry pot and rice pan inside the band; chain hook still empty; fire and window both open cues. The window light is a warm sunset rather than the area's grey — taste, not a defect |
| `ld08_hopkitchen_wide.png` | Accepted | Pot open on its chain over the fire with the ladle lifting and pouring back, kettle, loaf and clasp knife on the crate, canvas bin of green cones, strung bines, oast and cowl behind; the empty wire line between two poles has nothing on it, plain grey sky behind |
| `ld08_hopkitchen_portrait.png` | Accepted | Same pour recomposed, all three subjects inside the band, empty line across the top against plain sky |
| `ld09_dairy_wide.png` | Accepted | **Cold room honoured: no fire, no range, no kettle, no steam anywhere.** Whey runs from the press spout into the pail as one unbroken thread; curd drains on the slatted rack; the cut truckle shows a white close crumb; empty wooden peg beside the door on plain lime wash |
| `ld09_dairy_portrait.png` | Accepted | Cold, again with nothing hot in it; press, pail, rack and cut truckle all inside the band; peg empty |
| `ld10_pasty_wide.png` | Accepted | Pasties crimped along the side and not over the top, swede and potato sliced and not diced, no carrot, one broken open, oven mouth open with the peel entering; empty iron hook beside the oven on a plain pale panel |
| `ld10_pasty_portrait.png` | Accepted | Crimping thumb and forefinger close and correct, broken pasty showing the layers, glowing oven mouth; hook still empty |
| `ld11_cockles_wide.png` | Accepted | Riddle shaken with a continuous fall of wet sand and a clear landing; pint measure filling a paper cone; laverbread dark in its dish; copper open and steaming on the shore while nothing on the sand steams; nobody and no donkey stands in the channel; empty peg on the stall upright |
| `ld11_cockles_portrait.png` | Accepted, with a note | All three subjects inside the band and the fall is clean, but the empty peg sits on the right-hand upright at about x .93, outside the middle 80 per cent, so a phone crops it. No sprite hangs there — this room's sprite is the gull, which crosses the clean sky band — so the hook is decorative and the crop costs nothing |
| `ld12_smokehouse_wide.png` | Accepted | Speet of tied pairs going over the open pit with the fire below, opened smokie showing the flakes, kippers and a Findon on a separate rail, salt barrel and brine tub; the upper cross-bar of the right-hand frame is bare against plain grey sky; clean sky band for the gull |
| `ld12_smokehouse_portrait.png` | Accepted, with a note | Tied pair, opened smokie and pit fire all inside the band. The pair is lowered on a twine loop rather than over a wooden stick; the `uk-smoke-speet` sprite carries its own stick, so the painted version reads as a second, still pair and does not clash |
| `ld13_distillery_wide.png` | Accepted | Green barley and the shiel on the malting floor, peat fire under the kiln arch, two dull copper stills, open washback with a foaming head, spirit safe, cask with the bung open, oatcakes and a dram on the barrel head; empty iron hook on the whitewash beside the safe |
| `ld13_distillery_portrait.png` | Accepted, with a note | The spirit's lip, thread and landing bowl inside the safe are the clearest pour in the set. The empty wall hook sits at about x .94, outside the middle 80 per cent; no sprite hangs in this room, so it is decorative and the crop costs nothing. The peat fire runs to the left frame edge but still reads from x .094 inward |
| `ld_motion_pub_sign.png` | Accepted | Painted fox device, **no lettering**, iron frame, iron eye at the top, on white |
| `ld_motion_hop_bine.png` | Accepted | Cut stem at the top, about twenty pale cones, composed near square so the long-side cap leaves 923 x 960 |
| `ld_motion_game_brace.png` | Accepted | Cock and hen pheasant hung by the feet, heads down, twisted cord with a loop at the top |
| `ld_motion_gull.png` | Accepted | One herring gull gliding, three-quarter, wings and tail whole, grey mantle |
| `ld_motion_smoke_speet.png` | Accepted | Two split haddock tied by the tails over a short stick with both ends clear, copper-brown skins |
| `ld_motion_hanging_lamp.png` | Accepted | Brass lamp, glass chimney, shade, **unlit**, chain and ring at the top |
| 12 card illustrations | Accepted | One food each, on white, at the texture the brief asked for: the carved sirloin and a square of flat batter pudding, the cup and split scone, the cloth-bound Cheddar wedge, the plate of pie, mash and liquor, the battered fish on paper, the bacon and black pudding with a tin mug, the fish curry and ground spice, the mutton and barley with green cones, the side-crimped and broken pasties, the paper cone of cockles with oatmeal laverbread, the tied smokies with one opened, the dram with sprouted barley |
| `ld_card_dairy.png` | **Pass (regenerated 2026-09-21)** | One cut wedge on pure white with nothing else in the frame: the paste is a pale ivory white with an open crumbling texture that flakes and breaks away along the cut edge, and the rind is cloth-bound, the weave readable on the side and the top. It no longer reads as a second Cheddar — sampled over the cut face it is R236 G215 B176 against `ld_card_market`'s R236 G195 B125, so the blue channel is 50 points higher and the yellow is gone. Delivered 1536 x 1024 on opaque white; it cuts to 960 x 791, short side well over 400 |

Two observations that belong to the set rather than to any one file, and that the lead should rule on rather than the room maker:

- **Style.** The rooms are digital painting with a slick, evenly-lit finish rather than the visible brushwork of the hotpot and Turkey references; the cards are near-photographic product shots. The card style is exactly what Spain shipped and was accepted (`public/scenes/spain-food/*.webp` was compared side by side), so it is treated as the house style for cards here too. If the lead wants the rooms rougher, that is a whole-set regeneration, not a per-file reject.
- **Weather.** The brief asked for Britain in the rain. The dairy's meadow, the cockle sands, the distillery window and the lascar kitchen's window are painted in sun or a warm sunset. Nothing about them fails an acceptance line; it is noted so the lead can decide whether the area's look is consistent enough.

### Import

`scripts/scenes/import-london.py` copies the thirteen room pairs to `public/scenes/<room scene id>/wide.jpg` and `portrait.jpg` at their native 1672 x 941 and 941 x 1672 with no crop and no upscale, keys the thirteen cards off their white grounds into trimmed, edge-bled, transparent WebP in `public/scenes/london-food/<name>.webp`, keys the six sprites the same way into `public/scenes/props/uk-<name>.webp` with the long side capped at 960 px, saves the concept as `public/scenes/uk_concept.jpg`, registers the sizes in `src/fw/scenes-props.json` and writes `public/scenes/london-assets.json`: 46 manifest rows, each with the source file name, its SHA-256, the written path and the written size. The keying is the same `key_white` used by `scripts/scenes/cut-props.py` and by the Spain importer, so the Britain sprites cut exactly as Spain's did. There is no paint-out step: every moving object was delivered as its own sprite and every room was painted with its hook empty, so nothing has to be taken out of a finished painting.

Command, the same style as the Spain one:

```
uv run --with pillow --with numpy --with scipy scripts/scenes/import-london.py "$HOME/Downloads/additional game asset/london"
```

It was run twice. The second run produced byte-identical room JPGs, card and sprite WebPs, `scenes-props.json` and `london-assets.json`, so it is safe to re-run after a regeneration. It adds only its own keys: it re-reads `scenes-props.json` immediately before writing and merges the `uk_*` and `uk-*` keys into whatever is on disk at that moment, so a key another agent appends while it runs is kept.

Keys added to `src/fw/scenes-props.json` — thirteen rooms, each `{"wide": [1672, 941], "portrait": [941, 1672]}`:

`uk_pub`, `uk_tearoom`, `uk_market`, `uk_piemash`, `uk_chippy`, `uk_breakfast`, `uk_lascar`, `uk_hopkitchen`, `uk_dairy`, `uk_pasty`, `uk_cockles`, `uk_smokehouse`, `uk_distillery`

and six props, with their cut sizes:

| Prop key | Size after trim and cap | From |
| --- | --- | --- |
| `uk-pub-sign` | 960 x 869 | `ld_motion_pub_sign.png` |
| `uk-hop-bine` | 923 x 960 | `ld_motion_hop_bine.png` |
| `uk-game-brace` | 712 x 960 | `ld_motion_game_brace.png` |
| `uk-gull` | 960 x 863 | `ld_motion_gull.png` |
| `uk-smoke-speet` | 960 x 856 | `ld_motion_smoke_speet.png` |
| `uk-hanging-lamp` | 535 x 960 | `ld_motion_hanging_lamp.png` |

The thirteen card files land at `public/scenes/london-food/{pub, tearoom, market, piemash, chippy, breakfast, lascar, hopkitchen, dairy, pasty, cockles, smokehouse, distillery}.webp`. They carry no entry in `scenes-props.json`, exactly as Spain's cards do not; the scene config addresses them by folder and stem.

**The three rejected files were imported too**, so the pipeline is complete and every room already has both orientations on disk. When they are regenerated under the same names, re-running the importer overwrites `public/scenes/uk_piemash/portrait.jpg`, `public/scenes/uk_chippy/portrait.jpg` and `public/scenes/london-food/dairy.webp` and updates their three rows in `public/scenes/london-assets.json` with the new hashes. **Any portrait coordinates measured on `uk_piemash` or `uk_chippy` before the regeneration have to be measured again afterwards**, as Spain's three regenerated portraits did.

### Room audit

`scripts/tests/room-audit.html` does not discover rooms from `scenes-props.json` or from the folders on disk. It builds its list from three static imports and one spread:

```js
import {SCENES as CHINA_SCENES} from '/src/fw/scenes-china.ts';
import {TURKEY_SCENES} from '/src/fw/scenes-turkey.ts';
import {SPAIN_SCENES} from '/src/fw/scenes-spain.ts';
const SCENES={...CHINA_SCENES,...TURKEY_SCENES,...SPAIN_SCENES};
```

so **the thirteen Britain rooms cannot appear in it at Stage B, and nothing the Room maker owns can make them appear.** Two things are missing, both of them Stage C work:

1. `src/fw/scenes-london.ts` must exist and export a `LONDON_SCENES` record keyed by the thirteen room scene ids, each a `() => SceneDef` built with `paintedScene`, as `src/fw/scenes-spain.ts` does for `SPAIN_SCENES`.
2. `scripts/tests/room-audit.html` needs `import {LONDON_SCENES} from '/src/fw/scenes-london.ts';` added to its three imports and `...LONDON_SCENES` added to the `SCENES` spread — and the same two lines in `scripts/tests/rooms.html`, which `room-audit.html` loads in each iframe and which builds its room picker the same way.

Neither file was written or edited here: `scenes-london.ts` is Stage C and the two test pages are not the Room maker's to touch. What was verified instead is everything the audit page would read once it can see the rooms: all 26 JPGs exist under the thirteen `public/scenes/uk_*` folders, open, and carry the dimensions recorded in `scenes-props.json`. The proof is one contact sheet of the 26 imported files, thirteen rows of wide then portrait, composed from the written JPGs rather than from the delivered PNGs.

**Owner rulings, 2026-09-21.** The three rejects stand: `ld04_piemash_portrait.png`, `ld05_chippy_portrait.png` and `ld_card_dairy.png` are regenerated as instructed. The sunny light in the dairy, cockles, distillery and lascar windows is accepted rather than reworked toward the brief's rain.

### Blueprint (fixed): Britain on the Central Europe table

Britain (area id `london`, display name **Britain**) is an island in the west of a grown Central Europe table. The Alps, Hungary and Georgia keep the table they have. Every number below is held as data in `scratchpad/london-blueprint.py` and passes the paper check there — bands, water clearances, 2.5 between clickables, rooms on roads, nothing solid on a road centreline, blockers off every corridor, cluster separation — and the plan it draws is the contact sheet for this section.

Table and frame:

- `world-ceurope.ts` grows to `W: 120, D: 56, cx: -22`, identical to the Mediterranean. The table runs x from **-82 to 38** and z from **-28 to 28**. The `shore()` edge test becomes x at or beyond **-82 or 38**, z at or beyond **28** in either direction, so caps at the table edge stay square; the hand-written `Math.abs(x) >= 38` goes, and `coast()` takes the same two tests.
- **Britain owns x -80 to -34, z -28 to 24.** Every Alpine, Hungarian and Georgian coordinate keeps its value except the two western Alpine peaks: `snowy(3.6, 6.5, false, -34.5, 12)` becomes **[-22.5, 16.5]** and `place(mountain(3.0, 5.5, true), -33, 4)` becomes **[-27.8, 2.6]**. Both are inside the lead's band x -33 to -7, both are clear of every Alpine pine, peak and clickable by their own radius plus one unit, and the second has its base 0.6 clear of the strait. The meadow tint itself is full — the nearest free point inside it is within 4.6 of an Alpine pine — so the lower peak sits on the foothills just south of the tint rather than in it.
- Britain's arrival view is the Westminster street: **`AREAS.london.center` becomes [-48, 2]**, `name` **"Britain"**, `zh` **"Great Britain"**. The id `london` and the id `roastPub` do not change, and neither does the British recipe routing.
- `worldZoomLimit` and `worldFogRange` in `world-camera.ts` gain **`central-europe` beside `mediterranean`**, so the 120-wide table gets the 215 desktop overview and the computed fog pair instead of the flat 90/200. Builder, Stage C; it is two words in one expression.

Water. One continuous `seaWater()` shape wraps the island on all four sides. Its **outer ring** is the table's west, north and south edges and the continent's west coast, square at every edge:

```
[-82,-28] [-31.4,-28] [-31.4,28] [-82,28]
```

and the **island's coast is that shape's hole**, so the sea is one polygon, one rim and one shader. The ring, traced so the land stays inside it — the north coast with the Firth of Forth cut into it, then the strait's west shore with the river-mouth notch, then the south coast, then the west coast with the Bristol Channel cut into it:

```
[-79.4,-24] [-77,-25.4] [-73,-26] [-69,-25.6] [-65,-26.4] [-62,-26] [-58.6,-26.2]      the north coast
[-58.4,-20.6] [-56.8,-20.8] [-56.6,-26]                                                 the Firth of Forth, cut south to z -20.6
[-53,-26.2] [-49,-25.6] [-45,-26.2] [-41,-25.8] [-37.4,-26] [-35.8,-24]                 the north coast again, to the north-east cape
[-35.6,-20] [-35.8,-14] [-35.6,-8] [-35.6,-2] [-36.2,2.6] [-36,5.6] [-35.8,10]          the strait's west shore, notched for the river mouth
[-36,16] [-36.6,20] [-38,21.6]
[-42,22] [-46,22] [-50,21.6] [-54,22] [-58,21.8] [-62,22] [-66,21.8] [-69,22]           the south coast
[-72.6,22] [-76,21.4] [-79,20.2] [-79.6,18.8]
[-76,17.8] [-71.8,16.6] [-71.4,14] [-73.5,12.6] [-77,11.8] [-79.6,10.8]                 the Bristol Channel, its head at x -71.4
[-79.7,6] [-79.5,0] [-79.7,-6] [-79.4,-12] [-79.6,-18]                                  the west coast, back to the start
```

The rim (`#e6dfc4`) is an inset of both rings by 1.2, computed per vertex, not from a single centre as the Channel is now. **The strait** is the water between the island's east shore (x about -35.7) and the continent's west coast (x **-31.4**): four and a half units wide, running the table's full depth with a square cap at each edge. It is the existing Channel polygon, extended and squared. The Builder keeps the strait at least 4.0 wide after the `shore()` jitter, so both of its shores take at most 0.2 of jitter instead of the usual 0.35.

Britain's own water:

| Feature | Width | Points |
| --- | --- | --- |
| The river, `freshWater()` to x -42, then widening, with an `estuaryWater` blend from x -38 to the mouth | 2.6 to x -42, 4.0 to x -38, 5.2 at the mouth, each on a rim 1.6 wider | [-75,-6] [-70,-4.5] [-64,-2.5] [-58,-1] [-54,0] [-50,1.5] [-46,2.5] [-42,3.2] [-38,3.8] [-35.8,4.2] |
| The Bristol Channel, part of the sea ring above; its head east of x -75.5 is **wet sand, not open water** — the sand tint under a low-alpha `estuaryWater`, ribbed and draining, with the cockle beds on it | the ring | head at [-71.4, 14] |
| The Firth of Forth, part of the sea ring above | the ring | head at [-58.4, -20.6] to [-56.8, -20.8] |

The river rises in the western hills at [-75, -6] — two units east of the Researcher's [-76, -6], so the west road can pass between its source and the west coast without a bridge — runs east past the Dales, through the Westminster cluster, widens past the Docks and reaches the strait at [-35.8, 4.2]. **The old Thames curve and its Westminster Bridge on the continent side are removed**, together with the `decks` entries at [-19,-22] and [-19.5,-9]; the Chain Bridge's [6.5,-4,6.5] stays and the two Britain decks are added.

Clusters and their ground tints. Every one of the twenty-nine objects appears exactly once. **These were the Stage B positions; the shared-ground pass of 2026-09-23 moved every object and re-laid the roads, and its section at the end of this document is the positional record now.**

| Cluster | Centre | Tint | Holds |
| --- | --- | --- | --- |
| Westminster and the River | [-51, -4.5] | `#b8b4ad` wet paving along the street, 18 x 8 | The street runs east–west with the river behind it, four doors on its river side and three on its landward side: `bigBen` [-56, -3.4] on the river bank at the west end, `phoneBox` [-52.8, -3.4] (the Penfold pillar box and the lamp), `roastPub` [-49.6, -3.4], `redBus` [-46.8, -3.4] (the omnibus and the hansom stand) on the south side; `teaRoomUk` [-54.4, -7.1], `pastryCe` [-51.2, -7.1], `boroughUk` [-47.6, -7.1] on the north side. One decorative house: **`uk-westminster-terrace` [-53, -9.6]**, a brick terrace behind the tea room |
| The Docks and the East End | [-39, 7] | `#a89c86` brown dock mud and stone, 14 x 10, no paving | `pieMashUk` [-42.8, 9.65], `breakfastUk` [-40.1, 9.65] under its naphtha flare, `lascarUk` [-37.4, 10.3] in a back room off the last wharf, all three on the dock road with the estuary in front of them; `towerBridge` [-39.4, 3.9] standing in the estuary, and `oystersUk` [-36, 4.3] as two smacks moored at the mouth — **the only two Britain objects in water**. One decorative house: **`uk-dock-warehouse` [-41, 12.4]**, a four-floor brick warehouse behind the shops |
| The Weald | [-45, 18] | `#7fae5a` hop green in strings, running to `#5f7a46` under the wood, 16 x 12 | `hopKitchenUk` [-43.65, 13.35] at the bin end, `hopsUk` [-41.5, 17.5] in the garden with **its own oast at [-40.2, 19.2]**, `mushroomsCe` [-46.8, 20.2] in the wood at the south coast. One decorative house: **`uk-kentish-cottage` [-48.2, 16.2]**, tile-hung, one storey and a half |
| The Dales and the Mill Towns | [-59, -14] | `#9fb08a` wet green cut by `#8a8a80` drystone walls, 16 x 14 | `chippyUk` [-58, -10.1] on the mill-town street at the dale's mouth, `dairyUk` [-56.9, -13.1] in its cold stone dairy, `sheepUk` [-61.5, -12.5] hefted on the fell above the road, `rhubarbUk` [-55, -16] with **its own forcing shed at [-53.8, -17.4]**. One decorative house: **`uk-dale-farmhouse` [-60.8, -16]** |
| The West Country and the Bristol Channel | [-72, 10] | `#8fa06a` moor green over `#9a8f80` granite, `#d9cfae` wet sand at the channel head, 18 x 20 | `engineHouseUk` [-76, 2.7] on the cliff road with **its own engine house at [-74.6, 2.4]**, `pastyUk` [-74.1, 7.1] at the bakehouse, `orchardUk` [-77.5, 9.5] in the cider orchard above the channel's north shore, `cocklesUk` [-69.4, 14.5] on the sand at the channel head, `leeksUk` [-71, 20.2] in a cottage bed on the south side. **No decorative house**: five objects and three of their own buildings already fill the cluster, and Spain's Plaza Mayor set the precedent |
| The Firths and the Herring Coast | [-64, -25] | `#93a884` cold green with `#8a8a80` rock, 16 x 8, raised 0.4 | `smokehouseUk` [-62.1, -23.7] with **its own smokehouse at [-61, -24.3]**, `distilleryUk` [-66.1, -20.9] under its pagoda vent, `oatsUk` [-69.5, -19] at the meal mill, `forthBridge` [-55.1, -22.5] on the firth's east shore, `herringUk` [-52.5, -23.6] on the quay east of the firth. One decorative house: **`uk-fife-cottage` [-64, -19]** |

**`forthBridge` stands on land.** The rule is that nothing stands in water but the two London bridges and the oyster smacks, so the Forth Bridge is set on the east shore of the firth at [-55.1, -22.5], 1.6 clear of the water, with its first cantilever on the shore and its span reaching north-west over the inlet. No pier is set in the water. The paper check treats it as an ordinary land object.

Roads, one continuous ribbon each, every door on a road and nothing solid on a centreline. The network is one walkable piece: CE-R1 meets CE-R2 at [-44.5,-4.9] and CE-R5 at [-59,-5.1]; CE-R2 meets CE-R3 and CE-R4 at [-44.2,7.9]; CE-R5 meets CE-R7 at [-60,-8.5] and CE-R6 and CE-R6b at [-59,-19.2].

| Road | Width | Points |
| --- | --- | --- |
| CE-R1 Whitehall and the Strand | 2.4 | [-59,-5.1] [-55,-5.25] [-51,-5.25] [-47,-5.25] [-44.5,-4.9] [-42,-4.3] |
| CE-R2 the bridge road | 1.8 | [-44.5,-4.9] [-44.3,-1.2] [-44,2.85] bridge [-44.1,5.6] [-44.2,7.9] |
| CE-R3 the dock road | 2.2 | [-44.2,7.9] [-41,7.9] [-39,8.1] [-37.6,8.5] |
| CE-R4 the hop road | 1.8 | [-44.2,7.9] [-45.2,11] [-45.6,14.6] [-45.2,18.6] [-44.6,20.2] |
| CE-R5 the dale road | 1.8 | [-59,-5.1] [-60,-8.5] [-59.5,-12.2] [-57.5,-15.8] [-59,-19.2] |
| CE-R6 the firth road | 1.8 | [-59,-19.2] [-61,-21.5] [-64.5,-22.5] [-68,-22.8] [-71,-21.5] |
| CE-R6b the herring spur | 1.4 | [-59,-19.2] [-56.6,-19.4] [-54.8,-20.6] |
| CE-R7 the west road | 1.8 | [-60,-8.5] [-65,-8] [-70,-8.6] [-74,-9] [-78,-9] [-78.2,-4] [-77.9,1] [-76.8,6] [-74.5,10] [-71,10.8] [-67.8,12.6] [-67.4,16] [-70,17.8] [-73.5,19.2] |

CE-R7 passes north of the river's source and east of the Bristol Channel's head, so **no road but CE-R2 crosses water anywhere**. If a road point ever comes inside a bank, move the road, not the water.

**Bridges.** `woodenBridge` as **Westminster Bridge at [-44, 2.85]**, where CE-R2 crosses the river: span 6.0, deck at the road height (`BRIDGE_DECK_Y` 0.9), ends on the banks, square to the water, and a `deckY` entry so walkers and the omnibus ride up onto it. **`towerBridge` at [-39.4, 3.9]** is the second bridge, built to stand in the estuary; it carries no road and no walker loop — it is the landmark, and its bascules lift.

Walker loops, residents in the area's clothing from the eight profiles, steps matched to distance (`londonWalk`), speed 0.009 on the Westminster street and 0.007 elsewhere:

1. **The street**, CE-R1 from the palace to the bridge road and back, six residents, one with a basket and one sweeping the crossing; **the in-period traffic runs here** — one 1907 motor omnibus and two hansom cabs, no red bus and no black cab anywhere on the table
2. **The docks**, CE-R3 and the last stretch of CE-R2 as a circuit, five residents, one with a shoulder-borne tray, one porter with a barrow
3. **The dale road**, CE-R5 between [-60,-8.5] and [-57.5,-15.8], four residents, one leading a pony with panniers
4. **The west road**, CE-R7 between [-76.8,6] and [-70,17.8], five residents, two carrying cockle baskets at the channel end

**Decor.** Five decorative houses in the whole of `london`, no more, each at a fixed coordinate and each a 1.5-radius blocker in the paper check: `uk-westminster-terrace` [-53, -9.6], `uk-dock-warehouse` [-41, 12.4], `uk-kentish-cottage` [-48.2, 16.2], `uk-dale-farmhouse` [-60.8, -16], `uk-fife-cottage` [-64, -19]. Four buildings belong to stands and are **not** extra houses, but they are blockers under exactly the same rule: the forcing shed [-53.8, -17.4], the oast [-40.2, 19.2], the engine house [-74.6, 2.4] and the smokehouse [-61, -24.3]. Every one of the nine is at least 2.5 from every clickable it does not own, clear of every road centreline by half that road's width plus 1.5, and out of the water. The old London rectangle — the closed road loop through [-30,-22] [-10,-22] [-10,-9] [-30,-9], the two `redBus()` and two `blackCab()` on it, the seven loop walkers, the two standing pairs, the four round trees and the pigeon flock at [-20,-15] — goes with the old paving tint.

**Countryside between the clusters.** Hop strings twelve feet high from [-44,15] to [-39,20] with the bines on wire; oak and hornbeam wood along the south coast from [-50,19] to [-44,22]; hedged and ditched fields between the Weald and the river; drystone walls climbing the fell from [-63,-10] to [-55,-18] with the flock's own pen at the top; moor and bracken over the north-west from [-72,-16] to [-66,-22]; barley on the coastal strip behind the distillery; peat stacks cut in lines at [-68,-24]; granite hedgebanks and gorse over the West Country from [-78,0] to [-73,12]; apple orchard rows at [-77,9]; the channel's wet sand ribbed and draining, with a donkey and a cart on it at low tide; gulls over both coasts, rooks inland. Every crop or tree that carries an object responds to a click (the Stand maker's file); the rest is the Builder's.

#### What this blueprint overrides in the Stage A object list

Every id, kind, prop, purpose, cluster and reaction in the object list above is unchanged. The Stage A positions were written as provisional in a frame the lead had not yet fixed, and all twenty-nine move; the table of clusters here is the only positional record. Three changes go further than a coordinate and are the lead's to confirm at Stage D: the river rises at [-75, -6] rather than [-76, -6]; `forthBridge` stands on the firth's shore rather than in it; and the cockle ground is the head of the Bristol Channel — a true sea inlet at z 11 to 19, reaching x -71.4 — rather than a free-standing estuary at [-69, 14], because an estuary has to open to a sea.

### Module contracts for Stage C

Every agent owns whole files. Stubs exist so the type check passes while files are empty. Nobody edits another owner's file; a missing helper is built in the owning file. The Stand maker may import from `london-architecture.ts` and `london-people.ts` once they exist; until then a stand uses `person()` and `wear()` from `props.ts` and a local shelter.

| File | Owner | Exports (keep these names and signatures) |
| --- | --- | --- |
| `london-architecture.ts` | Builder, first | `LD` palette constant with the twelve names from section 1.3 of the research (`londonStock`, `portlandStone`, `millstoneGrit`, `moorGranite`, `slateNorth`, `kentPeg`, `pubGreen`, `oxbloodTile`, `postRed`, `oakSmoke`, `hopGreen`, `northSea`); `britishHouse(style, w, d, h, { storeys, bay })` for styles `londonTerrace`, `dockWarehouse`, `kentishCottage`, `daleFarm`, `fifeCottage`, `cornishCob`, `welshLongHouse`; `oastCowl()`; `forcingShed()`; `engineHouseBob()`; `smokePitFrame()`; `maltingPagoda()`; `ironMarketRoof()` |
| `london-people.ts` | Builder, second | `britishResident(seed, working?)` and `londonWalk(person, from, to, range, seed)` following `thailand-people.ts`; the eight clothing profiles from section 1.3 of the research as data; `pitPony()` and `followPony()` |
| `london-landscape.ts`, `london-town.ts`, `london-countryside.ts` | Builder | `londonLandscape(ctx)`, `londonTown(ctx)`, `londonCountryside(ctx)`. The landscape owns the sea shape **with the island as its hole**, both rims, the strait, the river with its three widths and the estuary blend, the Bristol Channel's wet sand and the Firth of Forth, and exports `LD_LANES`, `LD_BRIDGES`, `BRIDGE_SPAN` (6.0), `BRIDGE_DECK_Y` (0.9) in the shape `spain-town.ts` and `thailand-landscape.ts` use |
| `props-london.ts` | Stand maker | `LONDON_PROPS` keyed by every `prop` name in the object list — including the new `omnibus`, `pillarBox`, `forthBridge`, `engineHouse`, `oysterSmack`, `hopGarden`, `daleFlock`, `forcingShed`, `ciderOrchard`, `leekBed`, `oatMill`, `herringQuay` — plus `LONDON_ICONS` and `LD_LINES` keyed by object id; `hansomCab()`, `motorOmnibus()`, `costerBarrow()`, `cockleDonkey()` |
| `london-objects.ts`, `london-stories.ts` | Researcher | `LONDON_OBJECTS`, `LONDON_CARD_ART`, `LONDON_NEXT`, `LONDON_STORY_DEPTH`, `LONDON_SOURCES`, written to the card blurb band set above (room objects 1,300–1,800 characters, card-only 750–1,000), **including rewritten blurbs for the five retained objects** |
| `scenes-london.ts`, `london-ambience.ts` | Room maker | `LONDON_SCENES` keyed by the thirteen `uk_*` scene ids, each a `() => SceneDef` built with `paintedScene`; `LONDON_AMBIENCE`; hotspot labels and texts live in `scenes-london.ts`; `scene-ambience.ts` gains `PAINTED_SIGNATURES` entries only. `uk_dairy` is a cold room: the `drip` glint variant, no steam source anywhere in it |
| `scripts/tests/london-world.mjs`, `scripts/tests/london-reactions.mjs` | Builder, Stand maker | Copies of the Thailand harnesses with Britain ids. `london-world.mjs` tests **every vertex of every stand against the sea ring, the island ring, the strait, the river at all three widths, the estuary, the Bristol Channel and the Firth of Forth from the first commit**, plus the 2.5 corridors, rooms-on-roads, the nine blockers, gait and gait direction. `london-reactions.mjs` carries all twenty-nine ids |
| **shared** `world-ceurope.ts` | Builder, Stage C | Table growth to `W: 120, D: 56, cx: -22`; the new `shore()` and `coast()` edge tests; the two Alpine peaks moved to [-22.5, 16.5] and [-27.8, 2.6]; the old Thames curve, its Westminster Bridge, the London rectangle, its four vehicles, its walkers, its trees, its pigeons and its paving tint removed; the `decks` table reduced to the Chain Bridge plus the two Britain decks; `{ ...CEUROPE_PROPS, ...LONDON_PROPS }`; the Britain layout calls. **One owner for this file**; no other Britain agent opens it |
| **shared** `world-camera.ts` | Builder, Stage C | `central-europe` added beside `mediterranean` in `worldZoomLimit`, and so through it in `worldFogRange`. Two words, one owner |
| **shared** `graph.ts` | Lead, Stage D | `AREAS.london` becomes `{ world: "central-europe", name: "Britain", zh: "Great Britain", blurb: …, center: [-48, 2] }`; the twenty-three new objects registered with the positions in the cluster table; `mushroomsCe` and `pastryCe` re-sited; `redBus` loses `hitOnly` and `prop: "none"` for `omnibus`; `phoneBox` takes `pillarBox`; `roastPub` renamed "The public house" with `place: true` and the id unchanged; **`londonEye` removed from `CEUROPE_OBJECTS`**; `scripts/audit/objects.mjs` line 6 learns `central-europe` |
| **shared** `world-intros.ts` | Researcher | The Central Europe intro gains Britain beats; `world-intros.mjs` must still pass |
| **shared** `scripts/tests/room-audit.html`, `scripts/tests/rooms.html` | Lead, Stage D | Two edits each: `import {LONDON_SCENES} from '/src/fw/scenes-london.ts';` and `...LONDON_SCENES` in the `SCENES` merge |
| `repertoire.ts`, `main.ts`, `ui.ts`, `README.md`, this file | Lead, Stage D | Registration only; `LONDON_REPERTOIRE` is merged in `repertoire.ts` so `scripts/tests/repertoire.mjs` covers its thirteen keys |



## Stage D: integration, 2026-09-22

### What was registered

- **`graph.ts`**: `LONDON_OBJECTS` is imported and spread at the head of `CEUROPE_OBJECTS`. The seven old London objects on the continent are gone from that list (`roastPub`, `pastryCe`, `mushroomsCe`, `bigBen`, `towerBridge`, `redBus`, `phoneBox`), all redefined in `london-objects.ts` under the same ids, and `londonEye` is retired with no replacement. `AREAS.london` is `{ world: "central-europe", name: "Britain", zh: "Great Britain", center: [-48, 2] }`. The Beef Wellington recipe route to `roastPub` is unchanged. `object-ids.mjs`: 430 objects, every id unique, every alias and parent resolves.
- **`main.ts`**: `LONDON_SCENES` is in the `SCENES` merge. Entering `central-europe` sets `currentArea` to `london` and arrives on Westminster at [-48, 0, 2], the same way Southeast Asia's branch does.
- **`ui.ts`**: card art from `scenes/london-food/` on a `central-europe` + `london` branch (thirteen room cards), `LONDON_NEXT` for "Continue exploring" and `LONDON_SOURCES` for "Sources and further reading" on the same branch. `ICON_KEYS` loses the stale continental icons for the ids Britain redefined (`mushroomsCe`, `pastryCe`, `roastPub`, `bigBen`, `towerBridge`, `londonEye`, `redBus`), so a card-only object's badge is a snapshot of its new British prop.
- **`snapshot.ts`**: `LONDON_ICONS` and `LONDON_PROPS` come before the `CEUROPE_*` tables, so a shared key (`pub`, `bigBen`, `towerBridge`, `bakeryCe`, `mushroomWood`) draws the British model.
- **`repertoire.ts`**: `LONDON_REPERTOIRE` is merged, and `scripts/tests/repertoire.mjs` now covers its thirteen keys against `LONDON_SCENES`.
- **`README.md`**: Central Europe's areas read "Britain, Budapest & the puszta, the Alps, Georgia".
- The two test pages (`rooms.html`, `room-audit.html`), `room-loops.mjs` and `scripts/audit/objects.mjs` already carried Britain from Stage C.

### The rotation rule, applied

The world is only ever seen from +z: `main.ts` puts the camera there and clamps its orbit to plus or minus 0.75 radians. Stage B had turned each object toward its nearest road, which left 25 of 29 stands with their backs to the visitor. The rule from now on: **a stand's front faces the camera side within its swing; roads come to the door, the stand does not turn to the road.** Every `rot` in `london-objects.ts` now lies in [-0.75, 0.75]. No position moved.

Inside that window each rotation was chosen against three measurements, not only the road:

1. **The sight lines in `london-reactions.mjs`.** Stand rotation and camera azimuth add, and an open bay shows its gable past about a radian. So a stand leaning 0.6 one way fails from the camera's far swing. The pub, the chip shop, the seamen's kitchen, the hop cookhouse, the dairy, the bakehouse, the oyster smacks and the herring quay were each held to the range where all three azimuths see their reacting subject.
2. **Water.** Turning a stand to +z moves its front toward the south coast, the river or the channel, so within the sight-line range the rotation with the least overhang was taken.
3. **The door.** The door is the centre of the stand's solid front (figures excluded). It must be within 2.0 of a road edge.

The five water-subject objects lean toward their water only where that keeps them dry enough. `forthBridge` -0.3 keeps its span reaching north-west over the firth (695 vertices over water, down from 3,414). `herringUk` -0.2 leans west toward the firth (98, down from 1,651). `towerBridge` is 0 and stands in the estuary. `oystersUk` -0.1 moors in the estuary. `cocklesUk` is 0 rather than turned west, because any westward lean put the stall over the open channel (1,771 to 4,972 vertices).

| Object | Stage C `rot` | Stage D `rot` | Door to road |
| --- | --- | --- | --- |
| roastPub | 3.14 | -0.25 | 1.87, road behind |
| teaRoomUk | 0 | 0 | on the road |
| boroughUk | 0 | 0 | on the road |
| pieMashUk | 3.14 | -0.55 | on the hop road |
| chippyUk | -1.71 | -0.5 | 0.36 |
| breakfastUk | 3.04 | 0 | 1.85, road behind |
| lascarUk | -3.03 | -0.25 | **4.44, road behind** |
| hopKitchenUk | -1.68 | -0.55 | 0.14 |
| dairyUk | -2.08 | -0.35 | 1.16 |
| pastyUk | -1.05 | 0.1 | 0.29 |
| cocklesUk | -1.72 | 0 | on the road |
| smokehouseUk | -0.28 | 0.15 | on the road |
| distilleryUk | 3.06 | 0 | **2.77, road behind** |
| pastryCe | 0 | 0 | on the road |
| oystersUk | 2.96 | -0.1 | 1.60 |
| hopsUk | -1.47 | -0.45 | 0.99 |
| mushroomsCe | 1.93 | 0.45 | 1.62, road beside, sea in front |
| sheepUk | 1.42 | 0.3 | 0.01 |
| rhubarbUk | -1.49 | -0.75 | 0.61 |
| orchardUk | 2.09 | 0.75 | 1.06, road beside, channel in front |
| leeksUk | -2.76 | -0.75 | 1.94, road beside, sea in front |
| oatsUk | -2.73 | -0.6 | 1.56, on the new road |
| herringUk | 2.99 | -0.2 | 0.62 |
| bigBen | -3.1 | -0.15 | **2.11, road behind** |
| towerBridge | 2.99 | 0 | on the dock road |
| redBus | 3.0 | 0.3 | 0.70, bridge road |
| phoneBox | 3.14 | -0.3 | 1.69, road behind |
| forthBridge | -1.61 | -0.3 | on the herring spur |
| engineHouseUk | -1.35 | 0.3 | 0.80 |

**Roads.** One road change was needed and possible. **LD-R6** used to stop behind the oat mill. It now runs on round the west side of the oat field, through [-74, -20.2] and [-74.2, -14.4], and north to meet the west road at its corner [-74, -9], so the mill (turned -0.6 toward it) has a road 1.6 from its door. A first route along the field's front at z -14 cost the flock's pen, two open-fell walls and a gas lamp, so the road keeps west of x -73. The moor's three gorse bushes did not survive either route: at x -73 to -72 they would now stand in the mill's arrival rays. Every road stays continuous and every end meets something (`london-world.mjs`).

**What the rule could not fix without moving positions.** Six stands still have their road behind them, and three of those are more than 2.0 from any road. These are the shared-ground pass's first items:

- **The Westminster river row**: `roastPub`, `bigBen`, `phoneBox`, and `redBus` next to it. The blueprint put four doors "on the river side" of Whitehall, 3.7 units from the landward row, with the river in front. Facing +z, their fronts look at the river and their house masses sit back across Whitehall's northern half and into the pastry board, tea room and market fronts (see the footprint table). There is no room for a road between them and the river bank. They need to move south across the river onto their own embankment, or north to a row behind the landward one.
- **The dock row**: `breakfastUk` and `lascarUk`, with `pieMashUk` saved only by the hop road beside it. They stand south of the dock road with the estuary behind it, so facing +z puts their backs on the dock road and their roofs between the camera and Tower Bridge. The live check saw this: the bascules lift behind two dock roofs. The warehouse and the hop cookhouse fill the ground south of them.
- **`distilleryUk`**: the Fife cottage [-64, -19] stands in front of its door, and the oat field is on its west side.

`london-world.mjs` now asserts the band (every `rot` within 0.75) and the front door (within 2.0 of a road edge). `bigBen` 2.11, `lascarUk` 4.44 and `distilleryUk` 2.77 are listed as ceilings. `london-reactions.mjs` asserts that no stand turns more than a radian from +z, where it used to print a NOTE and fall back to measuring such stands from their own front.

### The ceilings, re-measured

Turning 25 stands moved their fronts and backs, so the three ceiling tables in `london-world.mjs` were taken again from the rotated stands. `LONDON_DUMP=1 node scripts/tests/london-world.mjs` reprints them. Compared with the Stage C tables:

- **Over water, 12 ids** (Stage C: 12, 12,618 vertices; now 11,639). Worse: `orchardUk` 535 to 3,548, `mushroomsCe` 707 to 2,537, `leeksUk` 48 to 1,363, `roastPub` 126 to 1,188, `cocklesUk` 1,354 to 1,401, `engineHouseUk` 6 to 41. These are the south-coast and channel stands whose fronts now hang over the sea, and the pub, whose pavement walker now paces the river bank. Better: `lascarUk` 3,581 to 564, `forthBridge` 3,414 to 695, `herringUk` 1,651 to 98, `bigBen` 1,018 to 90, `smokehouseUk` 154 to 90. `hopsUk` is unchanged at 24.
- **Stand on stand, 31 pairs** (Stage C: 30 pairs covering 98 rays; now 92 rays). New or worse: `oystersUk<lascarUk` 7, `engineHouseUk<pastyUk` 6, `pastryCe<roastPub` 6, `towerBridge<lascarUk` 5, `cocklesUk<leeksUk` 4, `dairyUk<chippyUk` 4, `boroughUk<redBus` 3, `chippyUk<bigBen` 3, `towerBridge<pieMashUk` 3, `redBus<towerBridge` 3. Gone or better: `phoneBox<bigBen` (was 7), `forthBridge<dairyUk` 8 to 1, `smokehouseUk<distilleryUk`, `pastyUk<orchardUk`, `redBus<roastPub` and fifteen more. `teaRoomUk<bigBen` 9 is unchanged and is the worst pair: Big Ben still hides the tea room from the arrival camera.
- **Footprints, 61 pairs** (Stage C: 61, 44 of them overlapping; now 61, 48 overlapping, 115 units of overlap against 95). The largest: `dairyUk/rhubarbUk` 5.39, `chippyUk/dairyUk` 4.99, `chippyUk/sheepUk` 4.99, `herringUk/forthBridge` 4.87, `roastPub/redBus` 4.38, `pieMashUk/hopKitchenUk` 4.22, `pieMashUk/breakfastUk` 4.2, `oystersUk/towerBridge` 4.05, `pastyUk/orchardUk` 3.92, `bigBen/phoneBox` 3.76.

For the shared-ground pass, all three lists come down to one diagnosis: the Westminster river row, the dock row and the Dales cluster (`chippyUk`, `dairyUk`, `sheepUk`, `rhubarbUk` inside 6 units of each other) need new positions, not new angles.

### Live check, 2026-09-22 to 23

The check ran on the running `food-tour-web` preview in a tab of its own, after a fresh page load. The server had been restarted by another agent three minutes earlier, after the last source change here, so it was not restarted a second time. The pane was hidden throughout, so the page was driven with the `__fw` hooks (`enter`, `step`, `look`, `open`, `shot`, `sceneShot`), with `window.__fwInstant` set.

- **Arrival.** Entering `central-europe` lands on target [-48, 0, 2] with the camera at [-46, 48, 62] (the target plus (2, 48, 60)). The crumbs read "Central Europe · Britain · Budapest & the puszta · The Alps · Georgia".
- **Fog.** On a fresh load the fog is the computed pair straight after entry: 203/450 at 1280 x 720, which is `worldFogRange('central-europe', 1280, 720, 66.2)`, and 90/200 on a fresh load at 390 x 844, whose limit is 90. No `main.ts` fix was needed: `enterRegion` calls `configureControls('world')`, which sets the fog, in the same step that places the camera. The 90/200 the Builder saw after `__fw.enter` was the hidden pane at work. The arrival hand-off runs on a timer and a flight that only advance when frames are stepped. Likewise, an emulated resize in a hidden tab does not fire `resize`: after switching the tab to 390 x 844 the fog stayed 203/450 until a `resize` event was sent by hand, and then it became 90/200.
- **All 29 objects.** Opened at 1280 x 720. The thirteen room objects open their painted room (#scene in, 3 to 7 layers). The sixteen card-only objects open their card, each with its British name, 2 to 5 "Continue exploring" links and a sources block. `chippyUk` needed a longer wait than the others the first time, because its flight from the docks is the longest; on a second open it went straight into its room. The Recipes add-on was in its default state.
- **All 13 rooms at 390 x 844.** Every one opens, with the stage filling 390 x 844 and 3 to 7 layers.
- **Console.** No `error` events, no unhandled rejections and no `console.error` in any of the runs.
- **Roads.** The roads were not walked by camera; `london-world.mjs` covers continuity, dry surfaces and ends. Two live views were checked by eye: the arrival (Westminster, the bridge road, the Strand to the river stairs) and the new LD-R6 round the oat field to the west road. The ribbon draws continuous from the firth road to the west-road corner.
- **Seen and not fixed** (positions are fixed at Stage D): Tower Bridge's lifting bascules sit behind the pie shop's and the porters' stall's roofs from the approach camera. In the Dales, the fried fish shop, the flock, the dale farmhouse and the dairy crowd one another.

Contact sheet: `scratchpad/london-stage-d.png` from this session (the arrival, the dale flock mid-reaction with the fried fish shop facing the camera, the public house room, and the 215 zoom limit), composed from `.data/shots/ld-d-*.jpg`.

## Shared-ground pass, 2026-09-23

The Stage D ceilings, all closed. The owner's bar is Spain after its walkthroughs: every clickable fully visible from the arrival camera with nothing in front of it, no stand sharing ground with another, no stand over water, and roads that come to every front door. Stage D had turned 25 stands to face the camera without moving them, which put the Westminster river row and the dock row with their backs to their roads and left the Dales crowding one another. This pass moved the stands instead of turning them.

### What the live page measured, before and after

The ten-ray check, the footprint check, the over-water count and the front-door check were run on the `food-tour-web` preview in a tab of its own, after a fresh page load (the server was restarted through the preview tool for the final run), with `window.__fwInstant` and the `__fw` hooks. The rays are the owner's rule: nine at each clickable's camera-facing front face at three heights, one at the diamond cue over its anchor, along the arrival direction (2, 48, 60); the first thing each ray meets must be that object, and every house, tree, wall and lamp counts as a blocker.

| Check | Before (Stage D, live) | After (live, fresh load) |
| --- | --- | --- |
| Clickables clear on all ten rays | 12 of 29 | **29 of 29** |
| Stand-on-stand pairs / rays | 31 pairs / 97 rays (plus one ray to the estuary gulls) | **0 / 0** |
| Footprint pairs under 1.0 clear | 61 (48 overlapping) | **0**; the closest pair is 1.05 apart, and 25 samples through the reactions never went under 1.04 |
| Stands with vertices over water | 12 | **1**: the Forth Bridge, 230 vertices, down from 695 (its own firth plate and span, by design) |
| Front doors more than 2.0 from a road | 3 (6 with the road behind) | **0**; the farthest is 1.56 (the oyster smacks), and no road is behind any stand |
| Decorative houses built | 5, all at fallback spots away from their clusters | **5**, each in its own cluster |

`london-world.mjs` passes with the new ceilings: `HIDDEN`, `CROWDED` and `DOOR_BEHIND` are empty, so any entry is a failure, and `OVER_WATER` holds only `forthBridge: 230`. `london-reactions.mjs` passes with every rotation at 0 (the oyster smacks at -0.1).

### The method

A layout search placed the 29 stands against the exact footprints, the water and a box-by-box version of the ray test (per-cluster target zones, simulated annealing, several seeds). It was used to find where clusters could go, not to decide them; the final positions were set by hand and checked with the exact ray test on the live page after each batch. Three facts drove the layout:

- **The arrival rays climb at 0.8 per unit.** A stand of height H hides anything whose front stands less than (H - 0.8) / 0.8 behind it. Big Ben (7.2) needs 8 units of clear ground behind it, Tower Bridge's walkway (4.6) and towers (6.8) need 5 to 8, and a 4.2-tall shop needs 4.3. So stands in one column stand about 11 apart, and neighbouring columns alternate.
- **Tower Bridge's front is its coaster.** The coaster sits 3.9 in front of the bridge, so the bridge's rays start on the dock quay: nothing tall may stand south of the bridge within about 5. That is why the dock row could not stay between the estuary and the Weald.
- **The island was too small for 29 separated stands**, so the south coast moved out from z 22 to z 26 (the table edge is 28, the same two-unit margin as the north coast), the Bristol Channel's south shore moved south by about a unit so the orchard and the bakehouse fit above it, the north-west coast moved out 0.4, and a dock basin was cut under Tower Bridge so the coaster and the oyster smacks float instead of lying on the quay. The sea follows the island as before: one polygon, one rim.

### The moves

Every rotation is now 0 (the oyster smacks -0.1): fronts face the camera and the roads come to the doors.

| Object | Stage D `pos`, `rot` | Now | Why |
| --- | --- | --- | --- |
| `bigBen` | [-56, -3.4], -0.15 | **[-63.87, -8.89]** | The palace heads the north-bank row at its west end, with Whitehall and the Embankment in front of it; the ground behind it, which it hides for 8 units, holds only walls, bracken and the flock's pen |
| `phoneBox` | [-52.8, -3.4], -0.3 | **[-44, -4.3]** | The pillar box stands at the corner of Whitehall and the bridge road, where its lamp and box hide nothing |
| `pastryCe` | [-51.2, -7.1], 0 | **[-50.11, -5.35]** | North-bank row, between the dale road and the pillar box |
| `teaRoomUk` | [-54.4, -7.1], 0 | **[-55.83, -7.0]** | North-bank row, east of the palace; its terrace comes onto the street, so the omnibus and the cabs run west of it |
| `roastPub` | [-49.6, -3.4], -0.25 | **[-60.3, 4.97]** | Across the river on Borough High Street (the south bank, Southwark), facing the camera with the street in front of it; it had stood on the river bank with Whitehall behind it |
| `boroughUk` | [-47.6, -7.1], 0 | **[-53.85, 3.95]** | Borough Market goes where it belongs, on the south bank beside the public house |
| `redBus` | [-46.8, -3.4], 0.3 | **[-45.29, 11.2]** | The omnibus and the hansom stand at the south foot of the bridge road, on the dock road |
| `pieMashUk` | [-42.8, 9.65], -0.55 | **[-38, -5.45]** | The East End is north of the river: the pie shop faces the Strand, far enough behind Tower Bridge for its walkway to pass under the rays |
| `breakfastUk` | [-40.1, 9.65], 0 | **[-45.46, 20.84]** | The porters' coffee stall on the south-coast quay road, out of Tower Bridge's line |
| `lascarUk` | [-37.4, 10.3], -0.25 | **[-39.5, 21.03]** | The seamen's kitchen on the last wharf of the south-east coast, facing the quay road; its roof clears the oyster smacks' rays |
| `towerBridge` | [-39.4, 3.9], 0 | **[-37.7, 3.4]** | 1.7 east and 0.5 north, so its approach girder clears Westminster Bridge and nothing but the flat quay and the low omnibus stands in front of it: **the bascules lift in full view** |
| `oystersUk` | [-36, 4.3], -0.1 | **[-34.2, 13.2]**, -0.1 | Moored in the new dock basin and the strait, both smacks afloat |
| `hopKitchenUk` | [-43.65, 13.35], -0.55 | **[-54.2, 12.9]** | The Weald moves west to the ground south of Southwark: the cookhouse on the hop road |
| `hopsUk` | [-41.5, 17.5], -0.45 | **[-54.5, 21.6]** | The hop garden and its oast on the south coast road, in front of the cookhouse and low enough not to hide it |
| `mushroomsCe` | [-46.8, 20.2], 0.45 | **[-62.43, 22.2]** | The wood on the widened south coast, all on dry land |
| `chippyUk` | [-58, -10.1], -0.5 | **[-52.53, -17.37]** | The Dales spread across the north: the fried fish shop at the head of the dale road, clear of the Forth Bridge's rays by 0.25 |
| `dairyUk` | [-56.9, -13.1], -0.35 | **[-46.13, -21.2]** | On the north-east coast road, 1.1 clear of the flock |
| `sheepUk` | [-61.5, -12.5], 0.3 | **[-45.21, -13.95]** | The flock on the open fell between the dairy and the pie shop, low enough to hide nothing |
| `rhubarbUk` | [-55, -16], -0.75 | **[-59.82, -17.24]** | The forcing shed on its own lane west of the fish shop; the four Dales stands are now 7 to 15 apart instead of overlapping by up to 5.4 |
| `herringUk` | [-52.5, -23.6], -0.2 | **[-39.19, -21.9]** | The herring quay on the north-east coast |
| `forthBridge` | [-55.1, -22.5], -0.3 | **[-59.4, -24.54]**, 0 | Squared to the table across the firth, its west cantilever on the shore; the firth was narrowed to 1.2 under it so the bridge's anchor stands on land and its east tower on the far shore |
| `distilleryUk` | [-66.1, -20.9], 0 | **[-68.95, -20.5]** | North coast, between the oat mill and the bridge; the Fife cottage no longer stands in front of its door |
| `oatsUk` | [-69.5, -19], -0.6 | **[-76.3, -20.66]** | The north-west corner, facing the firth road |
| `smokehouseUk` | [-62.1, -23.7], 0.15 | **[-71.7, -11.36]** | Inland on the west road where it rounds the tarn, off the crowded north coast |
| `engineHouseUk` | [-76, 2.7], 0.3 | **[-73.3, 0]** | South of the tarn, clear of the river, facing the West Country lane |
| `orchardUk` | [-77.5, 9.5], 0.75 | **[-75.5, 8.2]** | Above the channel's moved shore, all on land (it had 3,548 vertices over the channel) |
| `pastyUk` | [-74.1, 7.1], 0.1 | **[-67.25, 8.05]** | East of the orchard, out of the engine house's rays |
| `cocklesUk` | [-69.4, 14.5], 0 | **[-68.31, 14.98]** | On the dry sand at the channel head, 2 south of the bakehouse so it hides nothing |
| `leeksUk` | [-71, 20.2], -0.75 | **[-75.5, 21.9]** | The cottage bed on the widened south-west peninsula, all on land |

### Roads

The road table in `london-landscape.ts` is re-laid: 23 routes, one piece, every end on another route, on a shore or at a door. **LD-R1** (Whitehall and the Embankment, 2.4) runs along the river's north bank from the west road to the river stairs past the palace, the tea room, the pastry board, the pillar box and the pie shop; **LD-R2** crosses Westminster Bridge, now at x -44.6; **LD-R3** is the quay under Tower Bridge; **LD-SB** is Borough High Street and the West Country lane round the engine house to the west road; **LD-R4**, **LD-R3b**, **LD-OL**, **LD-CL** and **LD-SC** are the hop road, the dock road, the orchard lane, the cockle lane and the south coast road; **LD-R5**, **LD-R5c** and **LD-R5b** are the dale road between the tea room and the pastry board, the moor road to the dairy and the herring quay, and the fish-shop and forcing-shed lane; **LD-R6** is the firth road and **LD-R7** the west road round the tarn. Nine short spurs (`LD-S-*`) come to the doorsteps of the stands whose front stands deep in front of their anchor, so the harness's anchor rule (2.6) holds as well as the front-door rule (2.0). The omnibus and the two cabs run on the stretch of Whitehall in front of the palace, where no stand's front reaches onto the road; the street's walkers keep to the stretch east of it. The four peopled loops are re-cut on the new roads: 20 residents, the pit pony on the dale road (`LD-R5-1`).

### Houses and decor

All five houses are built, each in its own cluster, each off the roads and first on none of any stand's ten rays:

| House | Stage D | Now |
| --- | --- | --- |
| `uk-westminster-terrace` | [-50.5, -11.5] | **[-66.3, 1.5]**, Lambeth, on the south bank opposite the palace |
| `uk-dock-warehouse` | [-48, 8] | **[-47.9, 5.0]**, Bankside, on the river at the south foot of Westminster Bridge |
| `uk-kentish-cottage` | [-51, 15] | **[-60.3, 15.2]**, among the Weald's hop rows and its orchard |
| `uk-dale-farmhouse` | [-64, -12] | **[-36.1, -13.2]**, on the north-east fell by the flock and the herring coast |
| `uk-fife-cottage` | [-71.5, -24.5] | **[-71.5, -24.5]**, behind the distillery on the north coast (unchanged) |

The countryside's regions in `london-countryside.ts` are re-drawn onto the ground the stands left: hop rows and a Kentish orchard patch between the public house and the cookhouse, oak and hornbeam on the south-west coast, hedged fields on the south bank, drystone walls, bracken, ewes and the flock's pen in the ground behind the palace (which the palace hides, so nothing tall stands there), peat and barley on the north coast, granite hedgebanks and gorse in the West Country. `tryPlace` now also refuses anything that would stand inside a house. The gas lamps are laid along every road at least 4.5 apart. The gull flocks fly higher (12 to 13), so a passing gull no longer counts as a blocker on a ray.

### The owner's view

Looked at on the live page: the overview at 95, each of the six clusters at approach zoom (30), and the 215 zoom-out limit at 1280 x 720, where the whole table reads with only a light haze at the far corner. Tower Bridge's bascules and coaster are in open view from the approach camera, with the pie shop visible above the walkway; the coaster and the smacks float in the dock basin. The Dales read as four separate places. Contact sheet: `scratchpad/london-shared-ground.png` from this session, composed from `.data/shots/ld-sg-*.jpg`.

### What remains

- **The Forth Bridge's 230 vertices over water** are its own firth plate and its span over the Firth of Forth. They are the only over-water ceiling.
- **The Firth of Forth is 1.2 to 1.4 wide** where it was 1.6 to 2.0, so the bridge's anchor stands on land at the harness's ±1.4 proxy while the firth's head is still water at [-57.6, -21.4].
- **`world-ceurope.ts` still lists the old Britain decks** at [-44, 2.85] and [-39.4, 3.9]. Only the Budapest walkers read that table, so nothing in Britain rides on it; the Britain walkers use `LD_CROSSINGS`, which moved with the bridge. It is not this pass's file.
- **The hop row nearest the Kentish cottage** stands close in front of its wall (the house rule keeps it 0.2 clear of the box); from the Weald's approach it reads as a trellis by the door. Worth a look on the next walkthrough.
- **Not verified:** the rooms (nothing here touched a room or a scene), the phone-width world at 390 x 844, and the Pages run.

## Stage E review, 2026-09-23

Second reviewer, who built none of the Britain files. Every line of the playbook's section 5 is recorded below as **pass**, **fail** or **not verified**, with the evidence. Nothing was changed in any code, scene, ambience or object file; this section and the walkthrough list below are the only edits.

**How it was run.** `npm run typecheck`, `npm test` and `node scripts/audit/objects.mjs` on the working tree at HEAD `e9181f5` with other agents' uncommitted Italy, Thailand and Vietnam edits; no Britain file changed between that run and this commit (the Italy commits since touch only Italy entries in `scene-ambience.ts` and a backward-compatible option in `props.ts` `birds()`). The dev server `food-tour-web` was restarted through the preview tool, and the page was loaded fresh with the Recipes add-on off (`food-tour:recipes` unset), booted from an image URL with the app's own markup injected and `WebSocket` stubbed before `main.ts` ran, so no HMR reload could replace the world mid-check. The pane refused a new tab (tab cap), so the work was done in the `seed` tab that `preview_start` handed back. The server stopped once part way through (a usage cut-off); it was started again through the preview tool and the page loaded fresh a second and a third time for the movers, the close-ups and the continent. The pane was hidden throughout, so the world and the rooms were advanced with `__fw.step` at 1/60 s and read through `__fw.shot`, `__fw.sceneShot`, the rooms' own effect canvases and a composite of painting, effect canvas and visible hung sprites built from the live DOM. Shots are `.data/shots/ld-e-*.jpg`; the contact sheet is `london-review.png` in the reviewer's scratchpad.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | **22 of 25**. `london-world.mjs` (21.1 s) and `london-reactions.mjs` pass, and so do the other 18. `italy-reactions.mjs` (`campanile: a mesh of the stand hides it-campanile-bell`), `thailand-world.mjs` (`naKhaoTh: no road at its door (2.9 away)`) and `vietnam-world.mjs` (`VN-R7: crosses west of Vietnam's band`) fail in files other agents are editing |
| `node scripts/audit/objects.mjs` | london: rooms=13, card-only-with-prop=16, hit/child=0; the sixteen are the ten ingredient stops and six landmarks of the object list |
| Live ten-ray check, fresh load, 1280 x 720, every mesh west of x -30 a blocker (houses, trees, walls, lamps, stands, walkers, neighbours, the pony and the three street vehicles) | **27 of 29 at 10 of 10 on the first frame; 29 of 29 against every static blocker.** `bigBen` lost 1 to 4 rays to the Whitehall traffic on every one of six sampled frames (4, 2, 1, 1, 3, 1); `teaRoomUk` lost one ray to a street walker on the first frame only. No house, tree, wall, lamp, stand or stand building covers any ray |
| Fog and zoom limit | Desktop limit 215 reached (camera [-16.4, 134.8, 167.8]); fog 203 / 450; at 390 x 844 fog 90 / 200. The table reads at 215 with only a light haze at the far corner (sheet, top left) |
| Room cues at 390 x 844, every pixel that changed alpha by more than 16 on the room's own effect canvas over 600 stepped frames (10 s), read inside each configured box | Every configured signature, patch and steam source draws. Smallest: `uk_breakfast` signature 56 px, `uk_distillery` signature 168, `uk_dairy` drip 204, `uk_pub` signature 280 and globe 380, `uk_pasty` and `uk_distillery` plumes about 2,500. Every portrait fire ellipse is present with a moving opacity (`uk_chippy` .88/.75, the others .77/.59 between samples); `uk_distillery`'s and `uk_cockles`' portrait ellipses sit at x -51 to 65 and -39 to 64, mostly off the left edge. Every visible portrait sprite lies inside x 0 to 390 |
| Room cues at 1280 x 720, same method | All draw. Signatures: `uk_pub` 4,456, `uk_tearoom` 2,612, `uk_market` 81,260, `uk_piemash` 2,196, `uk_chippy` 6,600, `uk_breakfast` **64**, `uk_lascar` 2,940, `uk_hopkitchen` 1,004, `uk_dairy` 316, `uk_pasty` 12,272, `uk_cockles` 1,868, `uk_smokehouse` 1,944, `uk_distillery` **56** |
| Motion re-measured (cells that looked doubtful in `docs/london-rooms.md`), six phased pairs at offsets 60 to 260, `room-motion.py` | **`uk_market` wide: 3.0, 1.0, 2.6, 3.4, 5.1, 1.1, median 2.8 percent** against its 3 percent floor (the rooms doc has 3.22). `uk_dairy` wide 5.1, 1.7, 2.1, 4.6, 5.7, 4.2, median 4.4, clears. `uk_hopkitchen` wide 3.2 to 4.0, median 3.6, clears. `uk_cockles` wide 3.2 to 4.6, median 3.8, clears |
| `__fw.audit(10)` and `__fw.audit(30)` | Listed in the walkthrough, items 17 to 21 |
| Cards | All 29 opened live: 16 card-only cards directly, 13 room cards through "The story" |

### The definition of done, line by line

World

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| W1 | Four or more clusters, continuous roads, every door on a road | Pass | Six clusters; 23 routes in one piece; `london-world.mjs` asserts every road end and every front door within 2.0 (`DOOR_BEHIND` empty) |
| W2 | Water continuous, square at the edge, correct colour; nothing stands in water | **Fail** | One sea polygon, square at the table edge, correct colours. But four thin white poles stand up out of the strait east of Tower Bridge (walkthrough 9), and `__fw.audit(30)` records a pie-shop figure over the water at [-35.6, -2] (21). The Forth Bridge's own firth plate is over water by design |
| W3 | Every river runs source to mouth | Pass | `london-world.mjs`: the island river rises at the western tarn and overlaps the strait at its mouth |
| W4 | Ten stands, five ingredient stops with diamond cues, three non-food clickables per area | Pass | 13 rooms, 10 stops, 6 landmarks, each with its cue; `objects.mjs` 13 / 16 |
| W5 | Three walker loops, residents in traditional clothing, steps matched | Pass | Four lanes, 20 residents, the pit pony; the eight clothing profiles of research section 1.3; `london-world.mjs` gait checks and "distinct silhouettes" pass |
| W6 | Small details in every cluster | Pass | Flock and pen, barrels, rope coils, hop strings, the smokehouse's hung pairs, peat stacks, barley, the cider pound, the cockle donkey, seen at approach 30 |
| W7 | House cap 12 to 16, 1 to 3 per style; nothing solid on a road; 2.5 corridors; no house on the camera line | Pass (lead ruling, 2026-09-23) | Five houses, one per style, by the blueprint's own choice; the line asked for 12 to 16. Roads, corridors and the camera line pass (`london-world.mjs`; live rays). *Ruled 2026-09-23:* the line now reads at most five per area id, each where it hides no stand (the standing rule since Spain's third pass); five houses, none first on any stand's rays, passes |
| W8 | Every clickable fully visible from the arrival camera, live | Pass | 29 of 29 clear of every static blocker on the live page after a fresh load. The moving traffic in front of the palace is walkthrough 22 |
| W9 | Every decor type reads as what it is from the overview | **Fail** | Walkthrough 1 to 13 |
| W10 | The table reads at the zoom-out limit, fog derived | Pass | 215, fog 203 / 450, sheet top left |
| W11 | Translating figures step; carried figures seated; animals face their travel | Pass | Gait and gait-direction checks in `london-world.mjs`. Live, both hansoms travel along their own +x (forward dot 0.94 to 1.00 over eight samples); the omnibus turns through its end loop with body and path agreeing. The pony's speed is walkthrough 20 |
| W12 | Every water feature ticks; smoke tinted, anchored, visible at the overview | Pass | Sea, river and tarn shaders tick; four of five houses publish tinted smoke (the dock warehouse has no kitchen fire), and wisps show at the 110 overview |
| W13 | Every motion watched ten seconds and plausible | Not verified | The pane was hidden; the world was stepped and sampled, not watched in real time. What sampling found is in the walkthrough |
| W14 | No flicker, nothing floating, no unsupported seat, no wall crossing | **Fail** | `__fw.audit(30)`: vehicles through vehicles, walkers through walkers and through Westminster Bridge's parapets, the pony through the tea room, a stall figure inside its own crate (17 to 21). The Forth train's carriages stand past the end of the deck (3). Flicker not looked for |

Stands

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| S1 | Each main stand meets the hotpot table | Not verified | Not counted stand by stand (people, lanterns under a beam, steam at the hot source) |
| S2 | Fronts face +z, door within 2.0 of a road | Pass | Every `rot` is 0 (oyster smacks -0.1); `london-world.mjs` asserts the band and every front door |
| S3 | Food first, worker, bystander, speech; readable after the 1.6 s approach | **Fail** | The harness order passes. On the live room approach at 1.6 s the market's camera ends inside the hop cookhouse roof and the bakehouse's inside the cockle stall's roof, so neither reaction can be seen; the pub, the hop cookhouse, the smokehouse and the cockle stall are half covered (walkthrough 23 to 30) |
| S4 | Repeated clicks bounded, return to rest | Pass | `london-reactions.mjs` |
| S5 | Ambient speech in the local language plus English; bubbles never overlap | Pass | `london-reactions.mjs` checks the two-language lines per stand. Bubble overlap was not measured live |
| S6 | `london-reactions.mjs` covers every stand and passes | Pass | 29 ids, passes |

Rooms

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| R1 | Two paintings each, art direction | Pass | Stage B acceptance; 26 files at 1672 x 941 and 941 x 1672 |
| R2 | Alive on entry, three or four loops, hot food steams, `room-loops.mjs` | Pass | `room-loops.mjs` passes, every room at four in both orientations |
| R3 | Every hot vessel has its own steam source; cold stays dry | **Fail** | `uk_pub`, both: the roast potatoes, the Yorkshire puddings in their tin, the cabbage and the carrots on the carving counter are dry beside a steaming joint, and the config calls them cold (walkthrough 33) |
| R4 | Steam needs a hot vessel and a hot process in the text; drip otherwise | Pass | `uk_dairy` has no steam, fire or boil and drips in both orientations |
| R5 | Traced liquid paths lip to surface, checked live | Pass | Lit pixels sit on the configured paths in both orientations; endpoints taken from `docs/london-rooms.md`, not re-measured on the pixels. How little two of them draw is walkthrough 38 and 39 |
| R6 | Hanging motion is a sprite over a clean painting | Pass | No breeze crop in the area |
| R7 | Every delivered sprite used or explained | Pass | Six of six used |
| R8 | Every path and box on a gridded crop and an overlay contact sheet | Pass | The rooms record names the gridded crops and the pour overlay sheet `uk-pours.jpg` |
| R9 | Every phone box and sprite inside the band, lit live | Pass | Table above: every portrait cue lit, every visible portrait sprite inside the viewport |
| R10 | Motion capture re-run after the last cue change; the baseline carries the numbers | **Fail** | `docs/quality-baseline.md` carries no Britain motion numbers (no `uk_` entry); the rooms doc's "Left for the lead" item 1 is still open |
| R11 | 3 percent in two seconds, or 2.5 with a crisp cue | **Fail** | `uk_market` wide re-measured at a 2.8 percent median with no crisp cue (sunray, lamps, haze) |
| R12 | Two or three touches naming something visible, with facts and sources | Pass | Three per room from `LONDON_DISCOVERIES` |
| R13 | Every effect stays on its source; nothing invented | **Fail** | Steam plumes and sunrays lie across faces in seven rooms (walkthrough 32, 34, 35, 37 to 42) |
| R14 | Reduced motion keeps the room understandable | Not verified | Not tested here or in the rooms record |

Cards and stories

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| C1 | Tagline and three-to-five-paragraph blurb, dated eras, local names | Pass (lead ruling, 2026-09-23) | Every object has a tagline and a name line. The 16 card-only blurbs are three paragraphs; the 13 room cards are seven paragraphs, 2,897 to 3,431 characters (walkthrough 51). *Ruled 2026-09-23:* the line now counts the blurb proper, three to five paragraphs, with the story depth appended below it. Britain's room blurbs proper are four paragraphs of 1,544 to 1,773 characters, inside the 1,300 to 1,800 band set at Stage A, and the story depth adds three |
| C2 | Every kitchen room and place-or-dish shows its repertoire | Pass | Opened live through "The story": all 13 room cards carry "What this kitchen cooks", hero first (six to eight entries) |
| C3 | Card-only blurbs in their band | Pass | 16 card-only blurbs 970 to 1,000 characters in three paragraphs; none visibly shorter than its neighbours (card text 1,192 to 1,305 characters as rendered) |
| C4 | Room objects have story depth, sources and two `NEXT` | Pass | `LONDON_STORY_DEPTH`, `LONDON_SOURCES`; every card rendered two "Continue exploring" links and a sources block |
| C5 | World intro passes `world-intros.mjs` | Pass | In `npm test` |
| C6 | Legends labelled | Pass | The Duchess of Bedford's afternoon tea is written as a legend in `london-stories.ts` |
| C7 | Recipes off | Pass | Walkthrough made with the add-on off; no "Related recipes" row on any card, and every room's actions hold only "The story" |

Verification record

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| V1 | typecheck, test, `build:pages` | **Fail** | Typecheck passes; `npm test` 22 of 25 on this working tree (Italy, Thailand, Vietnam); `build:pages` was not run in this review |
| V2 | Screenshots of the world, each stand and each room at both sizes | **Fail** | `.data/shots/ld-e-r-*` has every room at both sizes and `ld-e-ap-*` every object at 1280 x 720; no stand has a shot at 390 x 844, and the phone-width world shot is this review's `ld-e-phone-world.jpg` |
| V3 | Animation inventory table | **Fail** | `docs/london-world.md` promises one in its first paragraph and does not carry it |
| V4 | Pages run and live URL | **Fail** | Britain is not published; this is Stage F |

**Count: 28 pass, 14 fail, 3 not verified, of 45 lines.** Failed: W2, W7, W9, W14, S3, R3, R10, R11, R13, C1, V1, V2, V3, V4. Not verified: W13, S1, R14. *After the lead's rulings of 2026-09-23 on W7 and C1: 30 pass, 12 fail, 3 not verified.*

## Owner walkthrough (second reviewer), 2026-09-23

Everything that looked odd, in plain words, not yet sorted into defect or not. Sizes: overview is the 110 distance at 1280 x 720; approach is 30 at 1280 x 720, close is 12 to 16; card approach is the 28-unit glide after a click; room approach is the 1.6 s low camera before a room opens. Pictures for the items marked (sheet) are on `london-review.png`.

World, from above

1. `bigBen`, overview and approach 30: the clock tower is a short square box with a pointed cap on the palace roof, barely taller than the stalls beside it; it reads as a town-hall clock, not the tallest thing in London. The row of white spikes along the palace ridge reads as teeth (sheet)
2. The stands, overview and approach 30: the tea room, the pastry board, the pie and mash shop, the fried fish shop, the dale dairy, the seamen's kitchen and the public house are one open booth with a black slate roof and a sign; from above the pub, the tea room and the dairy can only be told apart by the lettering (sheet)
3. `forthBridge`, close 16 and approach 30: two tall red lattice pylons over a flat grey deck; it reads as a gantry crane or a drilling rig, not three diamond cantilevers. The train's carriages stand past the deck's west end in the air, at rest and after its run (it runs x -57 to -68 and stops) (sheet)
4. The Firth of Forth under the bridge, close 16: a straight-sided dark blue slot with a grey slab across it, reads as a dry dock (sheet)
5. `rhubarbUk`, approach 30: rows of red stalks with bright yellow tops stand in the open in front of the shed and read as lit red candles; the card says forced rhubarb grows in complete darkness inside the shed (sheet)
6. `sheepUk` pen at [-45.2, -13.95], approach 30: three small pointed tan cones beside the pen read as traffic cones or tents (sheet)
7. `oatsUk`, approach 30: the meal mill's water wheel turns beside a hut on dry grass; there is no burn or lade, a water mill with no water
8. `moor-bracken` (32) and `west-gorse`, approach 30: small green star shapes on the ground by the smokehouse and the Forth read as little palm trees or starfish
9. East of `towerBridge`, close 16 and approach 30: four thin white poles stand up out of the strait's water; sticks in the water (sheet)
10. The Bristol Channel's head by `cocklesUk`, approach 30: the wet-sand blend reads as a pale fog smear lying on the sea; no ribs or runnels show from above
11. `uk-kentish-cottage` at [-60.3, 15.2], close 14: the hop row's poles and wires stand right in front of the door and read as a trellis across it (the shared-ground pass flagged it) (sheet)
12. `herringUk`, approach 30: a bare mast with a tilted brown sail stands at the corner of the quay with no hull visible from the approach
13. `redBus`, close 14: the omnibus's and the hansom's wheels read as white spoke stars with no rim; the rim is edge-on across the spokes (in `props-london.ts` the rim torus is turned a quarter from its spokes). The Whitehall hansoms show the same (sheet)
14. The continent between the strait and the Danube, overview and zoom limit: a wide empty lawn from x -31 to about 0 with a few trees, where the old London street stood; Britain looks crowded beside it. Budapest, the Alps and Georgia otherwise look as before (`ld-e-o-*.jpg`), and the two moved peaks stand clear at [-22.5, 16.5] and [-27.8, 2.6]
15. `oystersUk` and `towerBridge`, card approach 28: the moved peak at [-27.8, 2.6] fills half the frame across the strait
16. `bigBen`, click: the only part that moves is the minute hand; at the 28 card approach nothing reads as a reaction

Movers

17. `street-vehicle` on Whitehall, `__fw.audit(30)`: the omnibus and a hansom pass through each other at [-60.8, -4.3] (31 samples) and the two hansoms at [-64.8, -5.4] (12)
18. `britain-walker` on Westminster Bridge: walkers pass through the bridge's parapet walls at [-44.5, 6.3] (42 and 15 samples) and [-45, -1.2] (17, 14)
19. `britain-walker` on Whitehall: walkers pass through each other at [-51.7, -2.5] (45 samples) and [-53.7, -3] (18), and through the tea room's own figures at [-55.7, -3.5]
20. `britain-pony` on the dale lane: it walks through the back of the tea room at [-54.3, -10.5] and through a walker at [-48.2, -10.7]; over two half-seconds it moved 0.16 and then 1.03, a sixfold jump in speed
21. `cocklesUk`: its own figure stands inside the stall's crate at [-69.9, 15.3] (5 samples); a west-road walker walks through the bakehouse's crate at [-64.9, 10.6]; a `pieMashUk` figure is over the water at [-35.6, -2]
22. `bigBen`, live ray check: the Whitehall traffic crosses 1 to 4 of its ten rays on every one of six sampled frames, because the loop runs along the palace's front; `teaRoomUk` lost one ray to a street walker once

Stand approaches

23. `roastPub`, room approach at 1.6 s: hop poles, a green leafy frame and a bush stand in front of the counter; the sign reads "FR…OUSE" (sheet)
24. `boroughUk`, room approach: the camera ends inside the hop cookhouse's roof; the frame is tan roof planks and the market is never seen (sheet)
25. `pastyUk`, room approach: the camera ends in the cockle stall's roof; the bakehouse shows only above it (sheet)
26. `hopKitchenUk`, room approach: the camera stands among the hop poles and leaves; the pot and the fire are half hidden
27. `smokehouseUk`, room approach: a dark mass covers the left third of the frame (sheet)
28. `cocklesUk`, room approach: a big round tree stands in the middle of the frame, the stall behind it to the left
29. `teaRoomUk`, room approach: the Whitehall omnibus crosses the left quarter of the frame
30. `chippyUk`, room approach: a gas lamp stands across the right end of the counter, framed by two dark roof corners

Rooms

31. `uk_pub` portrait, 390: the grate signature is a sliver at the painting's left edge and lights 280 pixels; the fire the room is lit by barely shows on a phone
32. `uk_pub`, both: steam from the joint rises across the carver's chest and face; in portrait up to his beard
33. `uk_pub`, both: the roast potatoes, the Yorkshire puddings in their tin, the cabbage and the carrots on the carving counter are dry beside the steaming joint
34. `uk_tearoom` wide, 1280: steam from the right-hand table's cup rises across the face of the woman in the hat at the window table; portrait: over the woman in the hat at the right
35. `uk_market` portrait, 390: the sunray beam crosses the cheesemonger's head and face
36. `uk_market` wide, 1280: re-measured at a 2.8 percent median of six phased pairs (3.0, 1.0, 2.6, 3.4, 5.1, 1.1), under its 3 percent floor; on two phases the room changed about 1 percent in two seconds (sheet)
37. `uk_piemash` wide, 1280: steam lies over the pieman's face behind the counter and the eating diner's face at the right; portrait: over the pieman at the back
38. `uk_breakfast`, both: the boiler tap's pour, the room's signature, lights 64 pixels at 1280 and 56 at 390 over ten seconds, so it cannot be seen; the griddle steam rises across the stallholder's face in wide, and the boiler steam over his head in portrait (sheet)
39. `uk_distillery`, both: the spirit-safe glint, the signature, lights 56 pixels wide and 168 portrait; in portrait the window's shaft crosses the older stillman's face
40. `uk_dairy` wide, 1280: the doorway sunray crosses the girl with the pail; portrait: over the woman at the left
41. `uk_pasty` portrait, 390: the oven-tray steam rises over the old baker's face at the top right; wide: the gulls fly inside the heading's rectangle at the top left
42. `uk_smokehouse` wide, 1280: the table's steam rises across the woman gutting at the left
43. Portrait, 390, heading y 62 to 143 or 165: the tea-room lamp (y 34 to 126), the pub bine (27 to 83), the hop cookhouse bine (49 to 117), the market brace (73 to 129), the seamen's kitchen lamp (87 to 161) and the smokehouse speet (54 to 99) all hang behind the room title
44. `uk_distillery` and `uk_cockles` portrait, 390: the fire ellipses sit mostly off the left edge of the phone (x -51 to 65, -39 to 64)
45. Painted empty fittings show in the frame by contract: the pie shop's brass hook, the chip shop's iron hook, the coffee stall's canopy hook, the dairy's peg, the bakehouse's hook, the cockle stall's peg, the distillery's wall hook, the market's wide S-hook and the pub's portrait bracket
46. Every room was stepped through ten seconds and read in stills and on its effect canvas; no pour was seen to crawl and no glint was seen above a lip, but no room was watched in real time (see "not verified")

Cards

47. `redBus`: the card begins "A motor omnibus at the kerb, two hansom cabs behind it", and the clickable model is a red horse-drawn omnibus; the motor vehicle is the one running on Whitehall
48. `pastryCe`: the card places the board "beside the market and two doors from the public house"; in the world it stands on the north bank between the tea room and the pillar box, and the market and the pub are across the river in Southwark
49. `rhubarbUk`: the card's "rows of rhubarb crowns growing in complete darkness" against a model growing in the open (item 5)
50. `oatsUk`: the card's "a meal mill with a water wheel turning a pair of stones" on the burn, against a wheel on dry grass (item 7)
51. The 13 room cards run to seven paragraphs, 2,897 to 3,431 characters, about twice the 1,300 to 1,800 band this area set at Stage A; the 16 card-only cards are three paragraphs, 970 to 1,000 characters, and none is visibly shorter than its neighbours

### Not verified in this review

- Real-time watching of any room or of the world in a displayed pane (the pane was hidden; everything was stepped and read from stills, canvases and pixel masks). Pours, glints, sways and cups that should steam were judged from stills and moving-pixel masks only.
- Reduced motion; flicker while moving or zooming; speech-bubble overlap live; the hotpot-table count per stand (S1); the traced-path endpoints on the pixels.
- Each stand's reaction at full size: the 29 approach shots (`ld-e-ap-*.jpg`) were read for what the camera ends on and what covers it, and five landmarks' clicks were checked only as counts of moving parts (`bigBen`, `phoneBox`, `redBus`, `orchardUk`, `engineHouseUk`); the order food, worker, bystander, speech was taken from `london-reactions.mjs`.
- Motion was re-measured for four wide cells only (`uk_market`, `uk_dairy`, `uk_hopkitchen`, `uk_cockles`); the other 22 cells are the rooms doc's figures.
- `npm run build:pages`, and the published site (Britain is not published).
- The Italy, Thailand and Vietnam failures in `npm test`, which belong to other agents' uncommitted files.

### Fixes, cards, 2026-09-23

Researcher's items and the lead's two rulings. Text fields only in `london-objects.ts` (no `pos`, `rot`, prop or scene touched), one speech line in `london-speech.ts`, one code comment in `london-repertoire.ts`, lines W7 and C1 of `docs/agent-team-playbook.md`, and the W7 and C1 rows here and in `docs/italy-world.md`. Positions were read from `london-objects.ts` and the "Shared-ground pass" table.

- 48 (`pastryCe`): the board now stands "on the north bank, between the tea room and the pillar box" ([-50.11, -5.35], between `teaRoomUk` at x -55.83 and `phoneBox` at x -44). The market and the public house are across the river and are no longer named as its neighbours.
- 49 (`rhubarbUk`): the dark is inside the shed and the crowns are outside it. The card now says the shed is "warm inside, where lifted crowns send up their stalks in complete darkness; outside, in the open field, next year's crowns build up their sugar". The candlelight, the two years outdoors, the frost and the lift into the shed stay as they were. Card text only; the model is the Stand maker's.
- 50 (`oatsUk`): the water mill on the burn stays, because the Builder is cutting the burn past the wheel. Checked against `oatMill()`: the oat field, the mill with its wheel and lade, the pair of stones (runner and bed) with the hopper, spout and bin, the three bowls of the three grades and the girdle on its fire are all on the stand. Two lines were changed. The mill is now "behind" the field, not "below" it, because the field lies in front of the mill toward the camera. The last sentence, "All three are in the rooms round this coast", was not true: porridge is on no room's list, and the only brose, Atholl brose, is a drink. It now reads "The three grades stand in bowls beside the mill, and a bannock is on the girdle", which is the stand's own reaction.
- 47 (`redBus`): the blurb now opens "A horse omnibus and a motor omnibus side by side in the General's red, and a hansom cab at the kerb". The old opening had one motor omnibus and two hansoms. The stand has one hansom. Its closing line placed both vehicles "outside the public house", which is fifteen units away across the river. It now puts them at the foot of Westminster Bridge and adds that the General ran its last horse omnibus in October 1911. **For the Stand maker:** on the live page the stand's `motor-body` is still dark green (`#2e4432`, from `motorOmnibus()`) beside the red horse omnibus (`#7a2a24`). The card says both are in the 1907 red, so the motor body has to be red when item 47 lands.
- The other 25 cards, read against their stands (`props-london.ts`) and, for rooms, the card pictures (`public/scenes/london-food/*.webp`):
  - `roastPub`: "A corner house in Westminster" is now "on Borough High Street". The river is still behind it (z 4.97 against the river at about z -1.6). The repertoire's code comment is changed to match.
  - `bigBen`: the tagline "the street of public houses behind it" is now "a street that kept Parliament's hours". Behind the palace are the fell and the flock's pen. The last paragraph walked east "past the pillar box, the lamp and the omnibus stand" to a public house "four doors along" with the market "opposite". It now names the tea room, the pastry board and the pillar box along the river, and puts the public house and the market across the bridge in Southwark. A factual line is also corrected. "The four dials are lit while the House sits" is now: the dials are lit at dusk, and the Ayrton Light above the belfry burns while Parliament sits after dark. The bystander line "Dials are lit - they're sitting late again" is now "Light's up over the dials - they're sitting late again".
  - `towerBridge`: "three kitchens on one dock street" is now "three kitchens round its docks". The lascars' kitchen was "in the next street" and is now "on the wharf south of the dock". The pie shop is north of the river, and the coffee stall and the seamen's kitchen are on the south-coast quay road.
  - `oystersUk`: the smacks are "moored in the dock below Tower Bridge", not "at the mouth of the river". The eels are in the shop "across the river", not "up the road".
  - `herringUk`: "the drift-net fleet against it" is now "a drifter moored against it". The stand shows one vessel's mast.
  - `orchardUk`: the stand has no sheep under the trees, so "sheep under them" is now "apple baskets under them". Those are the baskets the apples drop into on a click.
  - `leeksUk`: the stand has no "row of them pulled and laid on the path" and no bed against a wall. It now says a bed in front of the house, and a basket of leeks already pulled at the end of the rows.
  - `forthBridge`: the tagline and first line said "Three … cantilevers", and the stand builds two. They now say "Steel cantilevers" and "three in the whole crossing". The fact stays and the model is not contradicted. Walkthrough 3, the model itself, is not a card item.
  - `engineHouseUk`: "on a cliff" is now "on the high ground above the village". The stand is inland, south of the tarn.
  - No change: `teaRoomUk`, `boroughUk`, `pieMashUk`, `chippyUk`, `breakfastUk`, `lascarUk`, `hopKitchenUk`, `dairyUk`, `pastyUk`, `cocklesUk`, `smokehouseUk`, `distilleryUk`, `hopsUk`, `mushroomsCe`, `sheepUk`, `phoneBox`. The green Penfold on the stand agrees with the card's "early Victorian boxes were green". The dale flock's wall is the intake wall below an unfenced fell.
  - Card pictures against the cards: 11 of 13 agree. **For the picture owner:** `market.webp` and `dairy.webp` both show a herringbone basket-weave rind. That is the esparto mark of a Manchego, not the muslin of a cloth-bound truckle, while both cards and the market's hero ("Cheddar from the truckle", "cloth-bound") say cloth-bound. The text is right, and the pictures are not this file's to change.
- Lengths after the pass: the 16 card-only blurbs are three paragraphs of 983 to 1,032 characters. `rhubarbUk` is 1,003, `redBus` 1,032 and `bigBen` 1,026, after trimming to stay beside their neighbours. The 13 room blurbs proper are four paragraphs of 1,544 to 1,773 characters, inside Stage A's 1,300 to 1,800 band, plus three paragraphs of story depth.
- Lead ruling 1, W7: the playbook line now reads at most five decorative houses per area id, each where it hides no stand. It carries a dated note: the 12 to 16 was retired by Spain's third pass of 2026-09-17. W7 is marked as passing here, and in Italy's table under the new wording (4, 4 and 5 across its three area ids).
- Lead ruling 2, C1: the playbook line now reads three to five paragraphs for the blurb proper, with the story depth appended below it and not counted. It carries a dated note: Spain, Thailand, Vietnam and Britain ship four plus three, and Italy three plus three, measured on the files. C1 is marked as passing here and in Italy's table. This also answers walkthrough 51. The Stage E count line has a note: 30 pass, 12 fail, 3 not verified after the two rulings.
- Harness: `npm run typecheck` is clean. `npm test` passes all **25 harnesses** ("25 harnesses passed"), including `london-world.mjs` (48.5 s), `london-reactions.mjs`, `repertoire.mjs`, `object-ids.mjs`, `village-speech.mjs` and `world-intros.mjs`.
- Live, on `food-tour-web` in this agent's own tab (`tab-6`). The page was booted with `WebSocket` stubbed before `main.ts` ran, so the other agents' edits could not reload it. Central Europe was entered with `__fw.enter`. The twelve changed card-only cards were opened with `__fw.open`, with the 800 ms card timer run at once because the pane is hidden, and each rendered the new text. `roastPub` was opened through its room approach and "The story", and shows "A corner house on Borough High Street". The `oatsUk` bannock line and the `bigBen` speech line were read from the modules the dev server serves.
- Not verified: the rhubarb, omnibus and oat-mill stands after the Stand maker's and the Builder's changes (none had landed in `props-london.ts` for those three when this was written; that file's diff so far touches other stands); the card layout at 390 x 844; the room cards other than the pub, which were not opened live after this pass (their text is unchanged); the Ayrton Light sentence against a primary source (it has no date and no new source entry); `npm run build:pages`.
- Picture note, 2026-09-23: `market.webp` and `dairy.webp` both show a herringbone rind where the cards say cloth-bound; the pictures are accepted as delivered and the cards keep their text; if the owner regenerates either card, ask for a cloth-bound rind.
