# Italy world (areas `rome`, `venice`, `sicily`)

The Italy world holds three card-only areas — Rome, Venice and Sicily — on one 76 x 56 table. This document follows the [team playbook](agent-team-playbook.md): it records the session baseline, the Stage A research hand-off and the shared contracts, and later the build, the animation inventory and the checks. The pictures do not exist; the [image brief](italy-image-brief.md) is the Stage A deliverable and the build waits for the files.

The Researcher's delivery is [italy-research.md](italy-research.md): area brief, palette basis, clothing profiles, proposed objects, room list, the corrections an Italian image prompt needs, dated story facts with sources, and open questions. The repertoire is `src/fw/italy-repertoire.ts`.

**The area ids do not change.** `rome`, `venice` and `sicily` stay exactly as they are, as the kick-off required.

## Stage 0: session baseline, 2026-09-17

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes on the current checkout |
| `npm test` | 17 harnesses pass: `camel-gait`, `object-ids`, `prop-reactions`, `prop-supports`, `recipe-addon`, `repertoire`, `room-controls`, `room-loops`, `scene-ambience`, `spain-reactions`, `spain-world`, `turkey-reactions`, `turkey-world`, `village-speech`, `world-availability`, `world-intros`, `xinjiang-reactions` |
| `node scripts/audit/objects.mjs` | Runs and matches the [quality baseline](quality-baseline.md) for China, the Middle East and the Mediterranean. **It does not report this world at all**: line 6 filters to `['china','middle-east','mediterranean']`, so `italy` is invisible to it. The baseline below was read out of `graph.ts` and `world-italy.ts` by hand, the same way Britain's and Thailand's were |
| Breeze masks | Not re-run: Stage A changes no masks, and the Italy world has no painted scenes yet |
| Live world, recipes disabled | Completed a two-minute pass through the China overview, Sichuan, Jiangnan and the Turkish town, then watched the Ocakbaşı room at the default wide viewport and at 390 x 844 portrait. The room opened without a visible flicker; the skewer reaction remained grounded and readable in portrait; no floating objects, people crossing walls or broken water were seen in the sampled views |

Two things that are not defects but that the lead should know before Stage B:

- `scripts/audit/objects.mjs` has to learn `italy` before this world can have baseline numbers in the ordinary way. It is the same one-line change Britain asked for with `central-europe` and Thailand with `southeast-asia`; three worlds now want it, so it should become a list of every world rather than a third hard-coded id.
- `PUBLISHED_WORLDS` in `world-availability.ts` holds `china`, `middle-east` and `mediterranean`. Italy is not published, so the public page shows it asleep. Unlike Britain and Thailand, **Italy has no unfinished neighbour**: the world is Italy and nothing else, so publishing it publishes only what this build makes. That is a real advantage of this world over the last two and the lead should weigh it at Stage F.

## What the three areas are today

The Italy table is 76 x 56 world units (`world-italy.ts`), x from -38 to 38 and z from -28 to 28, with Rome's piazza in the west, a Venetian lagoon of four quays in the north-east, and a Sicilian sea along the south.

- `AREAS.rome` is `{ world: "italy", name: "Rome", zh: "Roma", blurb: "trattorie, pasta, the piazza and the pizza oven", center: [-12, 0] }`
- `AREAS.venice` is `{ world: "italy", name: "Venice", zh: "Venezia", blurb: "canals, gondolas, seafood and risotto", center: [16, -8] }`
- `AREAS.sicily` is `{ world: "italy", name: "Sicily", zh: "Sicilia", blurb: "Etna, lemons, tomatoes and street food", center: [12, 14] }`

Between them the three areas hold **28 objects, no rooms and no scene folder.**

| Object | Area | Kind | Prop | Position | Blurb | Reaction today |
| --- | --- | --- | --- | --- | --- | --- |
| `pasta` Pasta | rome | ingredient, `place: true` | `pastaWorkshop` | [-22, -6] | 434 chars, 1 para | Prop reaction |
| `olive` Olive oil | rome | ingredient | `oliveGrove` | [-2.5, 13] | 292 | Prop reaction |
| `cheese` Cheese | rome | ingredient | `dairy` | [-34.5, -7] | 304 | Prop reaction |
| `basil` Basil & herbs | rome | flavour | `herbGarden` | [-13, 9.5] | 275 | Prop reaction |
| `italyBeef` Beef & pork | rome | ingredient | `cow` | [-20, 12] | 277 | Prop reaction |
| `italyChicken` Chicken | rome | ingredient | `chicken` | [-18, 14] | 248 | Prop reaction |
| `mushrooms` Mushrooms | rome | ingredient | `porciniWood` | [-25, 0.5] | 200 | Prop reaction |
| `oven` Wood-fired oven | rome | technique, `place: true` | `pizzeria` | [-6, -4] | 291 | Prop reaction |
| `ragu` Slow ragù | rome | technique, `place: true` | `trattoria` | [-14, -6] | 309 | Prop reaction |
| `romeMarket` Campo de' Fiori market | rome | place, `place: true`, `open: "reveal"` | `italyMarket` | [-14, 4] | **118** | Reveals five child stalls |
| `gelateria` Gelato & coffee | rome | dish | `gelateria` | [-4, 2] | 207 | Prop reaction |
| `seafood` Fish & seafood | venice | ingredient, `place: true` | `fishMarket` | [22, -4] | 260 | Prop reaction |
| `riceIt` Rice | venice | ingredient | `riceFieldItaly` | [2, -24] | 280 | Prop reaction |
| `bacaro` Cicchetti | venice | dish | `bacaro` | [21, -10.5] | 189 | Prop reaction |
| `tomato` Tomatoes | sicily | ingredient | `tomatoField` | [-10, 14.5] | 339 | Prop reaction |
| `lemon` Lemons & citrus | sicily | ingredient | `citrusGrove` | [23, 18] | 260 | Prop reaction |
| `sicilyMarket` Ballarò street market | sicily | place, `place: true`, `open: "reveal"` | `sicilyMarket` | [13, 12] | **109** | Reveals three child stalls |
| `pastry` Cannoli & pastries | sicily | dish | `pasticceria` | [18, 6] | 192 | Prop reaction |
| `stall-tomato`, `stall-cheese`, `stall-salumi`, `stall-herbs`, `stall-oil` | rome | hit-only children and aliases of `romeMarket` | `none` | around [-14, 4] | **empty** | None |
| `trattoria`, `pizzeria` | rome | landmark, hit-only aliases of `ragu` and `oven` | `none` | on their parents | **empty** | None |
| `stall-lemon`, `stall-tomato2` | sicily | hit-only aliases of `sicilyMarket` | `none` | [9, 10], [17, 10] | **empty** | None |
| `stall-arancini` Street food | sicily | dish, hit-only child | `none` | [13, 8.5] | 246 | None |

Counts: **0 rooms, 18 card-only clickables with a prop, 10 hit-only or child.** Per area: rome 0 / 11 / 7, venice 0 / 3 / 0, sicily 0 / 4 / 3. By kind: 16 ingredient, 2 flavour, 2 technique, 2 place, 2 landmark, 4 dish. **Neither `landmark` object is a landmark**: `trattoria` and `pizzeria` are invisible alias children of `ragu` and `oven`, so Italy has no landmark object of any kind, while the world file builds a Colosseum, a Pantheon, a Trevi fountain, a campanile, Etna, an obelisk, a triumphal arch, a basilica and a baroque church as **decor nobody can click**. Blurbs run **109 to 434 characters, one paragraph each**, and nine of the twenty-eight are empty.

What the world file builds around them (`layoutItaly`):

- **Ground**: two tints, a Roman ochre-green at (-14, -2) 22 x 16 and a Sicilian gold at (2, 14) 20 x 11.
- **Roads**: three `path()` ribbons — a long east-west street through [-30,-10] to [8,-6], a short spur north from [-10, 8] to [-2, 22], and a third from [-2,-4] to [6, 9]. They are not a connected network and they serve neither Venice nor most of Sicily.
- **Water**: one `seaWater()` material under two hand-drawn shore polygons — a lagoon filling the north-east corner and a sea along the whole southern edge — plus a nine-wide channel ribbon down the east side, a straight filler strip at x 35.75, four raised island quays at (12,-18), (24,-20), (20,-8) and (31,-10), four `venetianBridge` decks and six mooring poles. `shore()` carries a **hand-written edge test, `Math.abs(x) >= 38 || Math.abs(z) >= 28`**, so the table cannot be resized without editing it.
- **Life**: ten walkers and two Vespas on a Roman street loop, six more on a second loop past the Pantheon and the arch, three gondolas on a canal loop through the islands, four fishing boats and one sailing boat, two shoals of fish, six gulls, three butterflies, four standing groups, eleven decorative houses in three styles, and pines, cypresses and broken columns.
- **The Vespas are out of period on any reading**: the Vespa is a 1946 design and two of them circle the Roman piazza today.

So Italy has **three disconnected road ribbons, one lagoon, no cluster structure, no rooms, no clickable landmark, and eleven decorative houses.** Against the China standard the world is short of everything: four or more clusters, ten or more stands, five or more ingredient stops, three or more walker loops, rooms.

**What depends on the ids.** `graph.ts` routes every recipe whose cuisine is `Italian` to `world: "italy", area: "rome"`, and eleven enrichment rows name a place: `trattoria` (six rows), `pizzeria` (one), `romeMarket` (two) and `sicilyMarket` (two). `world-intros.ts` names `rome` in all three Italy beats, `venice` in two and `sicily` in two. `map.ts` draws the Italy island from `colosseum`, `baroqueChurch`, `campanile`, `umbrellaPine`, `cypress` and `italianHouse`. **`rome`, `venice`, `sicily`, `ragu`, `oven`, `trattoria`, `pizzeria`, `romeMarket` and `sicilyMarket` may not change.** The kick-off fixes the three area ids in any case.

## Stage A: the recommendation — how Italy is built to the China standard

The kick-off named three paths: **(a)** one area first at the Spain scale, the other two card-only, as Turkey was built first in the Middle East; **(b)** the whole world as one build of three areas at four or five rooms each, with the clusters being the areas; **(c)** something the research argues for better.

**Recommendation: (c), which is (b) corrected on one point.** Build the whole world in one pass, keep all three area ids, and give each area **two clusters — one town and one country or coast — for six clusters in all**, with **thirteen rooms split five in Rome, four in Venice and four in Sicily**. One image set of **46 files**, which is Britain's number exactly.

Option (b) as the kick-off states it — three clusters, one per area — is the only part that has to change, because the definition of done asks for "four or more clusters with clear separation" and three is three. Splitting each area into a town and its country gives six, and it gives each area two unlike-each-other looks instead of one, which is most of why Spain reads.

Six reasons, in the order they decided it.

1. **The image budget is paid per room, not per area.** A room costs three files: a wide painting, a portrait painting and a card. Thirteen rooms cost 46 images whether they sit in one area or three. Option (a) spends the same 46 images on Rome alone and leaves two thirds of the table hollow; option (c) spends them on three kitchens that do not cook the same food. There is no saving to be had by building less of Italy — only a narrower Italy for the same price.
2. **All three areas are on one table, in one view.** This is the difference between Italy and every precedent offered. Turkey was built first inside the Middle East, and Spain beside Greece, Morocco and Dalmatia, but those neighbours are other countries at the far end of a 120-unit table. Rome, Venice and Sicily are 76 units apart at most and the overview camera sees all three at once. A finished Rome beside a card-only Venice is the Turkish market's sumac card at the scale of a third of a table, and it is unavoidable rather than distant.
3. **Italian food is regional in exactly the way the repertoire rule expects, and a Rome-only Italy throws that away.** A Roman trattoria cooks offal and pecorino and no tomato at all in half its dishes; a Venetian bàcaro cooks stockfish, sardines under vinegared onions and polenta; a Palermo friggitoria cooks spleen, chickpea flour and rice in lard. Those are three kitchens with almost no ingredient in common, and they are the single best argument this world has. Built as one area, Italy's repertoire would be one kitchen's, and the card would say the same thing thirteen times.
4. **The world intro already promises three areas.** `world-intros.ts` names `rome` in all three Italy beats, `venice` in two and `sicily` in two, and its first beat is called "Local before national": "Italy's cooking changes across short distances." A build that finishes Rome and leaves the other two at 109-character blurbs makes the intro a claim the world does not keep.
5. **Nothing in the code has to break, and nothing even has to move between areas.** The three area ids stay. Every existing object keeps the area it is already in: the eleven Roman objects stay `rome`, the three Venetian stay `venice`, the four Sicilian stay `sicily`. The Italian recipe routing and all eleven enrichment rows are untouched. Britain had to rename an area and Thailand had to retire one; Italy has to do neither.
6. **Publishing Italy publishes only Italy.** Britain drags Budapest, the Alps and Georgia onto the live site with it; Thailand drags Hanoi and the Mekong. The Italy world contains Italy and nothing else, so Stage F has no "do we publish an unfinished neighbour" question at all — provided all three areas are built, which is what this recommendation does.

**The cost, stated plainly.** Thirteen rooms is Britain's room count, but this is three architectures, three sets of water and three dialect registers instead of one country's. The Builder has to lay a lagoon of islands and bridges, a peninsula coast and an island across a strait, and the three cannot share one road network. That is a bigger build than Spain's for the same number of pictures, and the lead should price it before opening Stage B rather than discover it in Stage C.

**If the lead prefers (a) anyway**, the object list below splits cleanly: clusters 1 and 2 are Rome and become the first build at five rooms, and clusters 3 to 6 wait. Every id, kind, purpose, reaction, cluster and repertoire entry is unaffected; only the order of work changes, and the image brief is generated in two sessions instead of one. It should be chosen knowingly, because it costs the same per room and ships an Italy whose Venice and Sicily are two lines of text.

### Blueprint frame (provisional, Stage B fixes it)

The current 76 x 56 table cannot hold thirty-six objects in six clusters: Spain put twenty-six objects into about 58 x 42 units of land, and Italy needs half again as many. The Researcher's proposal, for the lead to accept, redraw or reject at Stage B:

- **Grow the table to `W: 100, D: 64`**, cx and cz unchanged, so x runs from -50 to 50 and z from -32 to 32. Every existing coordinate keeps its value.
- **`shore()` in `world-italy.ts` carries the old edges as literals** — `Math.abs(x) >= 38 || Math.abs(z) >= 28` — and both must become the table's own half-width and half-depth or the sea stops reading as square at the new edge. This is the same hand-written-constant trap Thailand found in `world-seasia.ts`, in a second world.
- **Three landmasses, not one.** The mainland runs down the middle and the north-east; the lagoon is a group of islands inside a shallow water off its north-east shoulder; Sicily is a separate island across a strait in the south-west. Nothing stands in open water except the bridges, the mooring poles, the boats and the lagoon houses that are built on piles to stand in it.
- **Roads cannot all connect, and should not pretend to.** One road network serves the mainland clusters, one serves Sicily, and Venice's network is fondamente and bridges. The strait is crossed by a boat lane. This is the first world where "connected by continuous roads" has to be read per landmass, and the lead should record that reading rather than let a harness fail it silently.
- The arrival view stays Rome: `AREAS.rome.center` about **[-22, -8]**, with `venice` about **[22, -20]** and `sicily` about **[4, 22]**.

Every position in the object list below is written in that proposed frame and is **provisional**. If the lead chooses another frame the ids, kinds, clusters, purposes, reactions and repertoire are unaffected; only the coordinates move.

### Recommendations on the open questions

Section 5 of [italy-research.md](italy-research.md) raises fifteen questions. These are the Researcher's recommendations; the lead confirms or overrides each one and this table becomes the decisions record.

| Question | Recommendation |
| --- | --- |
| One area first, three areas, or something else | **(c): all three areas, six clusters, thirteen rooms at 5 / 4 / 4.** Area ids unchanged. Argued above |
| The table frame | Grow to `W: 100, D: 64` and fix `shore()`'s two literals. A Stage B decision; nothing in Stage A depends on it |
| Rooms: thirteen | **Thirteen.** The playbook allows ten to fifteen, Spain shipped twelve and Britain thirteen. Thirteen across six clusters gives 3 / 2 / 2 / 2 / 3 / 1, which is flatter than Spain's 4-in-one-square. Budget 46 images |
| **The period band** | **About 1880 to 1914**, the decades after unification. **This is the owner's decision, not the lead's**, because it removes carbonara, tiramisù, the Aperol spritz, the modern cicchetti counter and the Vespa from every painting, and it makes Italy poorer, browner and more regional than the picture an image tool will hand back. Every room is anchored inside the band by a dated record; the reasons are in section 1.5 of the research |
| Dishes younger than the band: carbonara, tiramisù, insalata caprese, fettuccine Alfredo, the many-plate cicchetti counter, the granita-and-brioche breakfast, the Aperol spritz, the Bellini and carpaccio | **Paint the in-period thing and put the date on the card**, which is Spain's gilda answer, applied six times. Nothing out of band appears in a painting. Carbonara keeps its place in the trattoria's repertoire with "unrecorded before 1952" in its line; caprese keeps its place at the market with "a Capri dish of the nineteen-twenties" and carries a real recipe id; the bàcaro is painted as the wine shop it was, with the counter of many plates named on the card as later |
| **The pizza problem** | The pizza oven in the kick-off's list is a **Roman forno**, and its in-band products are bread, pizza bianca and pizza rossa. The round pizza with tomato and mozzarella is Naples', and Naples is not an area of this world: it goes into the forno's repertoire and onto its card, carrying the real recipe id, with the 1889 Margherita letter written as the forgery historians now read it as. Painting a Neapolitan pizzeria in Rome would be the one invented thing in the set |
| **The bàcaro problem** | **Rename the object to "The osteria", id `bacaro` unchanged, and paint the documented wine house.** This is the sharpest period finding in the whole delivery. Around 1900 `bacaro` is not in Boerio's Venetian dictionary of 1867 or in Panzini's of 1905; the later Panzini gloss calls it "a recent word of the Venetian dialect" for cheap Puglian wine and the shop that retailed it. `cicheto` is not in Boerio at all, and in 1905 `cicchetto` is a Lombard word for a shot of grappa, not a plate of food. The counter lined with twenty small plates is documented as a phenomenon of the last twenty years. What **is** documented for the band is the graded wine outlet — osteria, caneva, malvasia, magazen, bastion, samarco — the rule that in a caneva or magazen you drank but did not eat, and the half-glass of about 125 ml drunk standing at the counter for ten centesimi, described by Hans Barth in 1910 and Elio Zorzi in 1928. So the room is an osteria with six dishes and a half-filled glass, and the words `bàcaro`, `ombra` and `cicheto` go on the card with what the dictionaries do and do not show |
| **The Pescaria problem** | **Paint the iron canopy, not the loggia.** From 1884 until the 1900s the Rialto fish market was a plain open iron canopy by the municipal engineer Annibale Forcellini. The neo-Gothic stone loggia an image tool will produce by default was conceived by Cesare Laurenti with Domenico Rupolo from 1896, approved by the council on 3 December 1900 and opened in 1907 or 1908 — inside the band, but only for its last six years. The canopy covers twenty-four of the band's thirty-four years and is the honest picture; the loggia goes on the card |
| `trattoria` and `pizzeria` are `kind: "landmark"` with `prop: "none"` | Leave both exactly as they are. They are recipe targets and alias children, not landmarks, and the six real landmarks below are new objects. The `kind` is cosmetic on an alias and changing it risks a routing surprise for no gain |
| `seafood`, `pasta` and `cheese` are `kind: "ingredient"` but will open rooms | Change all three to `kind: "place"`. It is not an id change and it does not touch `match()`; it makes the card heading read "What this kitchen cooks" over a kitchen rather than over an ingredient. `oven` and `ragu` stay `technique`, as `roastPub` did in Britain |
| Can one object carry both `open: "reveal"` and `scene`? | **Yes, and it is already in the code.** China's `aromatics` (the village market, `everyday`) carries `place: true, open: "reveal", scene: "market"` and has six stall children. Both Italian markets can therefore reveal their stalls **and** open a painted room, and Thailand's open question of the same name is answered by the same line |
| The Vespas on the Roman loop | Decor, and forty years out of band. They become the two-wheeled hooded wine carts of the Castelli carrettieri, which is documented for exactly this period and ended in October 1917. A Builder task, named so it is not missed |
| Italy has no clickable landmark, while the world file builds nine as decor | Register six of them as objects with cards and 3D reactions: the Colosseum, the Pantheon, the Rialto bridge, St Mark's campanile, Etna and the painted Sicilian cart. Four reuse builders that already exist in `props-italy.ts` |
| Card blurb length | The whole world is far below band and has to come up. See "Shared contract: the card blurb band" below |
| Clothing | **Open, and worse than Britain's or Thailand's.** For all three regions the research found the collections but **no sourced description of what working men and women actually wore**. Before generation the picture reviewer pulls one catalogued garment or photograph per profile from the named holdings — for Rome the Roesler Franz watercolours at the Museo di Roma in Trastevere and the Archivio Storico Capitolino's 1870–1950 photographic fund; for Sicily the Museo Pitrè costume rooms and the Palermo photographers Incorpora and Leone; for Venice the collections named in section 1.5. **No profile below is a verified garment list** |
| Unverified facts (the vaccinari paid in offal, the Arab origin of panelle and arancini, the Jewish origin of pani ca meusa, the harem origin of cannoli, the market foundation dates, the coppola's English descent, the ciociara costume, Pecorino Romano's American export figures, whether Gragnano pasta reached Rome) | Stay out of cards until verified in Stage C, or are written as "by tradition", "reported" or "legend puts", exactly as section 5 of the research says. Nothing above goes in as a flat statement |
| `scripts/audit/objects.mjs` ignores `italy` | Teach it every world rather than a third id, so this world and the last two have baseline numbers in the ordinary way |

## Shared contract: the object list

Positions are in the proposed frame above (x from -50 to 50, z from -32 to 32) and are the **Stage A proposal**; the Stage B blueprint fixes them. Ids were checked against all 353 object ids in `src/fw/*.ts`; none of the eighteen new ones collides, and `scripts/tests/object-ids.mjs` guards this once they are registered. Prop names were checked against `ITALY_PROPS`; none collides, and four reuse builders that `props-italy.ts` already exports as decor.

### Objects that open rooms (13, eight existing ids reused)

| id | name | zh | kind | area | pos | prop | scene | purpose | reaction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ragu` | The trattoria | Trattoria | technique | rome | [-28, 1] | `trattoria` | `it_trattoria` | Existing id, new name: a family dining room under the slaughterhouse wall, where the fifth quarter is cooked. **The world's hero** | The oxtail pot is lifted off the fire and a ladle turns it over; the oste wipes the marble; a man at the next table looks up |
| `romeMarket` | Campo de' Fiori market | Campo de' Fiori | place | rome | [-22, -8] | `italyMarket` | `it_market` | Existing id and name, new room: the market that moved here in 1869, under the statue raised in 1889 | A woman's knife strips an artichoke to the pale heart and the leaves fall into the basket; the stallholder turns; the scale swings |
| `pasta` | The pasta kitchen | Il tirasfoglia | place | rome | [-26, -11] | `pastaWorkshop` | `it_pasta` | Existing id, new name and kind: one board, one long pin, and the dried maccheroni that arrives by rail | The sheet is folded and the knife cuts it into ribbons which are lifted and shaken loose; the woman's arms follow; flour lifts off the board |
| `oven` | The forno | Forno a legna | technique | rome | [-18, -10] | `pizzeria` | `it_forno` | Existing id, new name: the wood oven that bakes the quarter's bread and the flat dough it is tested with | The peel slides a long white pizza out of the mouth onto the counter and the fire brightens; the baker steps back; a child at the counter reaches |
| `cheese` | The casale | Il casale | place | rome | [-36, 9] | `dairy` | `it_casale` | Existing id, new name and kind: a farmstead in the Agro Romano with the fold, the press and the oil jar in one yard | The curd is cut and the whey runs off the table into the pail; the dairywoman leans on the press; a ewe at the gate lifts its head |
| `seafood` | The Rialto fish market | La Pescaria | place | venice | [26, -18] | `fishMarket` | `it_pescaria` | Existing id, new name and kind: the fish market at the Rialto at first light, under the plain iron canopy of 1884 and not the stone loggia that replaced it in 1907 | A basket of sardines is tipped out along the marble and they slide and settle; the fishwife spreads them; a buyer leans over the slab |
| `bacaro` | The osteria | Ostaria | dish | venice | [23, -15] | `bacaro` | `it_bacaro` | Existing id, new name: the one grade of Venetian wine house where people both drank and ate. **Not a modern cicchetti bar** — see the decisions table | Wine is drawn from the cask into a small glass; the host sets it down on the counter; a man at the door turns round |
| `lagunaIt` | The lagoon kitchen | Cusina de laguna | place | venice | [17, -25] | `buranoKitchen` | `it_laguna` | New. A fisherman's house on Burano: the goby, the soft crab, and the first artichoke off Sant'Erasmo | Soft crabs go from the floating cage into the egg and then into the pan; the woman's hands follow; the man at the door shifts the oar |
| `casaVeneta` | The farm kitchen | Cusina de campagna | place | venice | [7, -20] | `venetoFarm` | `it_veneto` | New. The terraferma behind the lagoon: maize in the copper, and the poverty that came with it | The polenta stick turns in the copper and the mass folds over on itself; the woman leans into it; a child at the board waits with the wire |
| `friggitoria` | The friggitoria | Friggitoria | place | sicily | [-10, 20] | `friggitoria` | `it_friggitoria` | New. One pan of lard in the Albergheria, and everything Palermo eats standing up | A slab of chickpea paste is cut into squares and slid into the lard, which lifts; the fryer's arm follows; a boy at the kerb holds out a roll |
| `sicilyMarket` | Ballarò | Ballarò | place | sicily | [-6, 22] | `sicilyMarket` | `it_ballaro` | Existing id, new short name, new room: the market as a kitchen, with the vendors' sung cry over it | A swordfish steak is laid on the block and the cleaver comes down; the fishmonger straightens; a woman with a basket steps in |
| `pastry` | The pasticceria | Pasticceria | dish | sicily | [-3, 19] | `pasticceria` | `it_pasticceria` | Existing id, new name: ricotta, almond and ice, and a calendar of feast days to sell them on | Ricotta is piped into a fried shell and the ends are dipped in pistachio; the pastrycook turns the tray; the girl at the counter leans in |
| `tonnaraIt` | The tonnara kitchen | Tunnara | place | sicily | [12, 27] | `tonnara` | `it_tonnara` | New. Favignana: one fish, boiled, tinned and covered in oil, and nothing of it thrown away | A tuna loin is lowered into the boiling copper and the surface heaves; the boiler man steps back; a woman at the tinning bench looks up |

### Ingredient stops, card only (15: the ten the kick-off names, plus five existing objects retained)

The playbook asks for five to ten ingredient stops for an area. This is three areas, and fifteen across them is five each, which is the per-area figure Spain shipped. If the lead wants the list shorter, the five retained ones are the ones to cut, and each cut costs a card that already exists.

| id | name | zh | kind | area | pos | prop | purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `carciofoIt` | The artichoke beds | Carciofaia | ingredient | rome | [-25, 5] | `carciofaia` | New. The flat spineless cimarolo of the Agro Romano, the one vegetable two Roman kitchens fight over |
| `pecoraIt` | The flock | Il gregge | ingredient | rome | [-40, 10] | `sheepFold` | New. The sheep the Campagna was grazed for, and the cheese that left for Sardinia while the name stayed in Rome |
| `olive` | The olive mill | Il frantoio | ingredient | rome | [-38, 5] | `oliveGrove` | Existing. Re-sited into the casale's cluster; the Sabina hills, the stone wheel, and oil used raw |
| `vinoIt` | The wine cart | Il carrettiere a vino | ingredient | rome | [-32, 12] | `wineCart` | New. Castelli white racked in March and carted into Rome by night in convoys of three, until the lorries took it in 1917 |
| `italyBeef` | The pig and the ox | Il porco e il bue | ingredient | rome | [-33, 5] | `cow` | Existing. Re-sited and recast: the guanciale, the lard and the animal the fifth quarter comes off |
| `italyChicken` | The yard | Il pollaio | ingredient | rome | [-35, 12] | `chicken` | Existing. Re-sited: the hen kept for eggs and killed for a feast, which is most of what chicken meant here |
| `mushrooms` | The chestnut wood | Il castagneto | ingredient | rome | [-43, 1] | `porciniWood` | Existing. Re-sited to the cluster's edge; porcini under the chestnuts, dried on strings for the year |
| `basil` | The herb bed | L'orto degli odori | flavour | rome | [-26, -5] | `herbGarden` | Existing. Re-sited beside the market; basil, wild mint, rosemary and the bitter greens Rome actually eats |
| `valliIt` | The fish valli | Le valli da pesca | ingredient | venice | [20, -21] | `valliPesca` | New. The lagoon walled into shallow enclosures, and the eel, bass and goby taken out of them |
| `riceIt` | The rice fields | Le risare | ingredient | venice | [4, -25] | `riceFieldItaly` | Existing. Re-sited into the terraferma cluster; flooded fields, the women who weeded them, and the rice that makes a risotto flow |
| `granoIt` | The wheat and the latifondo | Il feudo | ingredient | sicily | [8, 21] | `wheatLatifondo` | New. Durum on a great estate held by a middleman, and the island that stopped exporting grain and started exporting people |
| `tomato` | The tomato beds | I pomodori | ingredient | sicily | [-12, 25] | `tomatoField` | Existing. Re-sited into the Palermo cluster; the plum tomato, the paste dried on boards, and the cannery the trade grew into |
| `lemon` | The lemon grove | Il giardino di limoni | ingredient | sicily | [16, 21] | `citrusGrove` | Existing. Re-sited into the coast cluster; the Conca d'Oro, the scurvy trade, and the most profitable hectare in Europe |
| `mandorleIt` | The almond grove | Il mandorleto | ingredient | sicily | [22, 20] | `almondGrove` | New. Avola's Pizzuta almond, selected in this very century, and the milk pressed out of it |
| `capperiIt` | The caper terraces | I capperi | flavour | sicily | [26, 25] | `caperTerrace` | New. Pantelleria and Salina: a bud picked before it flowers and packed in salt, the island's whole seasoning |

### Landmarks and other card-only objects with a 3D reaction (8)

| id | name | zh | kind | area | pos | prop | reaction |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `colosseoIt` | The Colosseum | Il Colosseo | landmark | rome | [-14, -13] | `colosseum` (existing builder, new prop key) | New. Swifts leave the upper arcades in a spiral and the travertine warms as the light moves |
| `panteonIt` | The Pantheon | Il Pantheon | landmark | rome | [-15, -6] | `pantheon` (existing builder, new prop key) | New. The shaft of light through the oculus swings across the floor and pigeons lift off the portico |
| `quintoQuarto` | The slaughterhouse | Il Mattatoio | technique | rome | [-31, -1] | `mattatoio` | New. The hook line swings along its rail and a quarter moves down it; the vaccinaro shoulders it off |
| `gelateria` | The caffè | Il caffè | dish | rome | [-19, -5] | `gelateria` | Existing, new name. The ice pail is turned and the paddle scrapes; steam lifts off the machine; a man at the counter drinks standing |
| `rialtoIt` | The Rialto bridge | Il Ponte di Rialto | landmark | venice | [27, -15] | `rialtoBridge` | New. A boat passes under the single arch and the shop shutters along the deck swing open |
| `campanileIt` | St Mark's campanile | Il Campanìo | landmark | venice | [30, -21] | `campanile` (existing builder, new prop key) | New. The bells swing and the whole tower leans a fraction, which is what it did before it fell on 14 July 1902 |
| `etnaIt` | Etna | A Muntagna | landmark | sicily | [24, 17] | `etna` (existing builder, new prop key) | New. A plume tilts off the summit and the snow line shows where the snow pits were cut |
| `carrettoIt` | The painted cart | U carrettu | landmark | sicily | [-2, 24] | `carretto` | New. The mule leans into the shafts, the cart rolls a length and the painted panels catch the light |

**Nothing is retired.** All twenty-eight existing objects survive, eight of them promoted to rooms, seven re-sited and recast, and the ten hit-only children kept as they are.

Counts against the definition of done: **13 room stands, 15 ingredient stops, 6 landmarks, 2 other card-only objects, 36 objects, plus 10 hit-only children = 46 registered; 23 card-only clickables that are not food stands**, against the required three. Per area: rome 5 rooms / 8 stops / 2 landmarks / 2 other, venice 4 / 2 / 2 / 0, sicily 4 / 5 / 2 / 0. Spain shipped 12 / 10 / 4 and 14; Britain proposed 13 / 10 / 6 and 16; Thailand 12 / 10 / 6 and 16. The three areas today are 0 / 16 / 0 and 18.

## Shared contract: clusters and water

Six clusters, two per area: one town and one country or coast. One line of character each.

| Cluster | Area | Centre | Character in one line | Holds |
| --- | --- | --- | --- | --- |
| Rome: the piazza | rome | [-22, -8] | Ochre render, travertine and basalt setts: the arrival view, the densest cluster, and the only place on the table where a ruin stands behind a vegetable stall | `romeMarket` + its five stalls, `oven`, `pasta`, `gelateria`, `basil`, `panteonIt`, `colosseoIt`, `pizzeria` |
| Testaccio and the Agro Romano | rome | [-30, 4] | The river quarter running out into sheep country, where the city's cheapest meat and its best cheese come off the same animal | `ragu` + `trattoria`, `cheese`, `quintoQuarto`, `italyBeef`, `italyChicken`, `pecoraIt`, `olive`, `vinoIt`, `carciofoIt`, `mushrooms` |
| Venice: the Rialto | venice | [26, -18] | Istrian stone over brick, water instead of a street, and a market that has stood on the same stones since before any of the buildings round it | `seafood`, `bacaro`, `rialtoIt`, `campanileIt` |
| The lagoon and the terraferma | venice | [12, -22] | Two poverties facing each other across shallow water: the island that lives off a crab three weeks a year, and the farm that lives off maize all twelve months | `lagunaIt`, `casaVeneta`, `valliIt`, `riceIt` |
| Palermo: the Albergheria | sicily | [-6, 22] | Tufa, awnings and a sung sales cry, where the poorest food on the table is cooked in the street and eaten standing | `sicilyMarket` + its three stalls, `friggitoria`, `pastry`, `tomato`, `carrettoIt` |
| The tonnara coast and Etna | sicily | [18, 24] | Salt, tuna and citrus on one shore and a volcano behind it: the cluster where every trade is an export trade and nobody eating in it is rich | `tonnaraIt`, `lemon`, `mandorleIt`, `capperiIt`, `granoIt`, `etnaIt` |

**Water (proposal).** Italy is a peninsula with an island. One continuous `seaWater()` wraps the mainland's south and east and the island's whole coast, square where it meets the table edge. A **shallow lagoon** sits inside a barrier on the mainland's north-east shoulder, with four or five island quays in it, the fondamente along their edges, stone bridges between them and the `valli` walled off at its far end — that lagoon is what makes this world look like nowhere else on the atlas and it should be cut early, not added at the end. One river (the Tiber) rises in the central hills, runs south-west through the Testaccio cluster and reaches the sea below Rome, with the wine road along it. A **strait** separates Sicily from the mainland toe; a boat lane crosses it and there is no bridge, because there was none.

Nothing stands in open water except the bridges, the mooring poles, the boats and the lagoon houses that are built on piles to stand in it. The Albufera lesson applies to six of the thirteen rooms: every stand goes **beside** the water, never on it, and `scripts/tests/italy-world.mjs` should test every vertex of every stand against the sea, the lagoon, the river and the strait from the first commit, not after the review. The fish market and the tonnara are the two that will want to creep onto the water and must not.

## Shared contract: rooms

Thirteen rooms. The room list, the three discovery subjects, the signature motion, the supporting cues and the sprites per room are in section 3 of [italy-research.md](italy-research.md) and, in final form, in the [image brief](italy-image-brief.md).

| Room id | Folder | Opens from | Signature motion | Sprites |
| --- | --- | --- | --- | --- |
| `it_trattoria` | `public/scenes/it_trattoria/` | `ragu` | Wine poured from a glass foglietta into a tumbler | `it_motion_salumi` |
| `it_market` | `public/scenes/it_market/` | `romeMarket` | An artichoke turned against the knife, the leaves falling away | `it_motion_awning` |
| `it_pasta` | `public/scenes/it_pasta/` | `pasta` | The folded sheet cut into ribbons and lifted loose | `it_motion_pasta_cane` |
| `it_forno` | `public/scenes/it_forno/` | `oven` | A long white pizza drawn out of the oven mouth on the peel | none |
| `it_casale` | `public/scenes/it_casale/` | `cheese` | Whey running off the draining table into the pail | `it_motion_garlic_braid` |
| `it_pescaria` | `public/scenes/it_pescaria/` | `seafood` | A basket of sardines tipped out along the wet marble | `it_motion_gull` |
| `it_bacaro` | `public/scenes/it_bacaro/` | `bacaro` | Wine drawn from the cask tap into a small glass, filled half way | `it_motion_lamp` |
| `it_laguna` | `public/scenes/it_laguna/` | `lagunaIt` | A soft crab lifted dripping out of the beaten egg | `it_motion_gull` |
| `it_veneto` | `public/scenes/it_veneto/` | `casaVeneta` | The polenta stick turning in the copper over the fire | `it_motion_garlic_braid` |
| `it_friggitoria` | `public/scenes/it_friggitoria/` | `friggitoria` | Chickpea squares sliding into the lard, which lifts and closes | `it_motion_awning` |
| `it_ballaro` | `public/scenes/it_ballaro/` | `sicilyMarket` | Water thrown across the swordfish on the slab | `it_motion_awning` |
| `it_pasticceria` | `public/scenes/it_pasticceria/` | `pastry` | Ricotta piped into a cannolo shell from the bag | `it_motion_lamp` |
| `it_tonnara` | `public/scenes/it_tonnara/` | `tonnaraIt` | A tuna loin lowered into the boiling copper | `it_motion_gull` |

**Three rules carried into every room prompt, from the China and Spain passes.** They are in full in the image brief's opening section and repeated per room:

- Every hanging object meant to move is a **separate keyed sprite**, and the painting shows only its **empty hook, rail, nail, beam, bracket or line**, against a plain wall, sky or plank that is a different tone from the sprite. No cut-outs from finished paintings, ever, and **no warm ochre wall where a key would be wanted** — which is a named hazard in this world, because ochre render is Rome's own colour and salami, garlic and awnings are all warm.
- Every hot vessel is pictured **open**; every pour shows a **clear lip, a visible stream and a clear landing surface**.
- Portrait compositions keep every subject that matters inside the **middle 80 per cent of the width** (x .094 to .906), because a phone crops the rest.

And three that belong to this world in particular:

- **The casale is a cold room.** No fire, no steam, no boiling, nothing hot in it at all. Its liquid is whey running off a draining table and out of a press, and it gets the `drip` glint variant, not a steam source. Spain's cheese farm steamed over a cold caldero and the owner read the room's own text and asked why; this is the same room in another country and it must not repeat it.
- **Half of Venice is cold too.** Raw fish on marble, sardines under vinegared onions, whipped salt cod, a glass of wine, the artichokes: none of these has a hot process behind it. The image brief asks the generator to list every vessel and say whether it is hot, so the Room maker has the dry list before it measures anything.
- **Three rooms are lit by fire in a dark interior and three are lit by hard coastal sun.** The trattoria, the forno and the Veneto kitchen are warm and dim; the Pescaria, the tonnara and Ballarò are bright and hard-shadowed. That contrast is the world's whole look and it should be in every picture, the way Britain's grey-and-lamplight is in Britain's.

**Sprites: six.** `it_motion_awning`, `it_motion_salumi`, `it_motion_pasta_cane`, `it_motion_gull`, `it_motion_lamp`, `it_motion_garlic_braid`. Every one is used at least once; the forno is the only room with none. Card illustrations: one per room, thirteen. **Total image count: 46** — one concept, twenty-six room paintings, six sprites, thirteen cards.

## Shared contract: the repertoire

`src/fw/italy-repertoire.ts` holds `ITALY_REPERTOIRE`, keyed by all thirteen room objects plus the two card-only place-or-dish objects that have a kitchen: `gelateria`, the caffè, and `stall-arancini`, the fry barrow inside Ballarò. No landmark and no ingredient stop carries one, which is the handbook's rule: a caper terrace and a campanile have no kitchen. `quintoQuarto` carries none either, because a slaughterhouse is a trade and not a kitchen, and its dishes are the trattoria's.

Entry counts: `ragu`, `pasta`, `bacaro` and `pastry` 8 each; `romeMarket`, `oven`, `cheese`, `seafood`, `casaVeneta`, `friggitoria`, `sicilyMarket` and `tonnaraIt` 7 each; `lagunaIt` 6; `gelateria` 5; `stall-arancini` 3, because one barrow selling three fried things is a short list written down rather than silence. **One hundred and two entries**, every line inside the 12-to-25-word band, every `zh` a real Italian, Roman, Venetian or Sicilian name in its own spelling rather than a translation of the English.

**Six `recipe` ids, and each is exact.** `public/static/recipes.json` holds eighty-nine recipes, eleven of them Italian. Six of those eleven are dishes an entry really names and they are attached: Homemade Meatballs to the trattoria's *polpette al sugo*; Caprese Salad to the market's *insalata caprese*; Bolognese, Lasagna and Creamy Mushroom Pasta to the pasta kitchen's *tagliatelle al ragù*, *lasagne* and *pasta ai funghi*; and Homemade Pizza to the forno's *pizza napoletana*. The other five Italian recipes — Chicken Parmesan Stuffed Peppers, One-Pan Chicken Parmesan Pasta, Creamy Chicken Pesto Pasta, Tomato Soup and Bolognese Mapo Tofu Pasta — name no dish in this world and are deliberately left unlinked, because the rule is an exact id where the recipe **is** that dish, not a resemblance. Their enrichment rows in `graph.ts` are untouched and the add-on still routes them.

Verified from the module and the recipe export: 15 keys, 102 entries, 6 recipe links that all resolve, and 0 lines outside the 12-to-25-word band. `npm run typecheck` passes with the file present and unimported, and `npm test` is 17/17. Wiring the table into `src/fw/repertoire.ts` — adding it to `REPERTOIRE_TABLES` and extending `scripts/tests/repertoire.mjs`'s `tables` array and room-id set — is a Stage D registration, not a Stage A change.

## Shared contract: the card blurb band

**This world's existing blurbs are far below the standard, and the band has to be raised before a single new card is written.** Measured on 2026-09-17 by building `graph.ts` and counting characters:

| File | Blurb lengths | Shape |
| --- | --- | --- |
| The 28 Italy objects in `graph.ts` | 109 to 434 characters, and 9 empty | One paragraph each |
| `spain-objects.ts` room objects (12) | 2,545 to 3,218 characters | Three to five paragraphs |
| `spain-objects.ts` card-only objects (14) | 762 to 974 characters | Three paragraphs |

The definition of done asks for a three-to-five-paragraph blurb with dated eras and local-script names, and the band rule says a card sits beside the cards around it. Both point the same way: **the band for this world is Spain's**, and it is set now, at Stage A, not discovered at the walkthrough.

- **Room objects: three to five paragraphs, about 2,500 to 3,200 characters.**
- **Card-only objects — every ingredient stop, every landmark, `quintoQuarto` and `gelateria`: three paragraphs, about 750 to 1,000 characters — identity, the record with its dates and sources, and a route out to a related place.**
- **All eighteen retained blurbs are rewritten to the same band.** `romeMarket` at 109 characters and `sicilyMarket` at 118 are the two worst, and they are the hero of a cluster each: the market card the owner opens first in Rome is one sentence long. `bacaro` (189), `pastry` (192), `mushrooms` (200), `gelateria` (207) and `italyChicken` (248) are all a tenth of the length their new neighbours will run to.
- **The nine empty blurbs are written or explained.** Seven stall children and two alias children carry empty strings today. `stall-arancini` already has 246 characters and a repertoire; the rest either gain a blurb or are told, in the file, why an alias needs none. Turkey's sumac card is the precedent and the owner found it by opening it.
- A thin card goes back at the Stage A check, not at the walkthrough.

Three to five dated facts per room object with sources, and two `NEXT` links each, are in section 4 of [italy-research.md](italy-research.md), grouped by object, with the sources listed by object in section 4.15. Eleven facts are flagged unverified and are kept out of cards until checked.

## Speech lines and palette

Section 2.5 of the research holds five ambient lines per room object, in Romanesco, Venetian and Sicilian with English on the same line, and says plainly that a native reader must check them. The **Palette** section of the [image brief](italy-image-brief.md) holds the twelve colours (`romanOchre`, `travertine`, `sanpietrino`, `terracotta`, `pineGreen`, `campagnaStraw`, `venetianRed`, `istrianStone`, `lagoonGreen`, `adriaticBlue`, `palermoTufa`, `etnaBasalt`) and section 1.5 of the research the eight clothing profiles. The Builder turns both into data in `italy-architecture.ts` and `italy-people.ts`.

## Stage A check

- **Every object has a unique id, a `kind`, an `area`, a position proposal, a prop, a purpose and a named reaction**: yes, 36 objects plus 10 hit-only children, 28 of them existing, none retired, seven recast. Eighteen new ids checked against all 353 ids in `src/fw/*.ts`; no collision. Prop names checked against `ITALY_PROPS`; no collision, and four reuse builders `props-italy.ts` already exports.
- **Every historical claim has a source**: section 4 of the research, grouped by object, with URLs in section 4.15. Eleven facts are flagged unverified and are kept out of cards until checked; five more are to be written as "by tradition" or "legend puts" rather than as records.
- **Every kitchen room and every place-or-dish object has a repertoire**: fifteen keys, hero first, three to eight entries each, every line 12 to 25 words, six exact `recipe` ids. Verified from the module and recipe export: 102 entries, 0 problems. `npm run typecheck` passes and `npm test` is 17/17.
- **The card blurb band is written down before any card is written**, and the eighteen retained blurbs and the nine empty ones are booked for rewriting to it.
- **The period problem is named and answered six times**, not once: carbonara, tiramisù, caprese, fettuccine Alfredo, the many-plate cicchetti counter and the granita-and-brioche breakfast all take Spain's gilda answer, and the Vespas on the piazza are recast as wine carts rather than painted out of period.
- **One open engine question from a previous area is answered here**: China's `aromatics` already carries `open: "reveal"` and `scene` together, so a market may reveal its stalls and open a room, in Italy and in Thailand both.
- **Image brief written with exact file names and the drop folder**: [italy-image-brief.md](italy-image-brief.md), 46 files into `~/Downloads/additional game asset/italy/`.
- **Not done in this pass, and not this role's**: no second-agent review of the brief against the art direction (Spain's had one and it found twelve things on the first pass); no picture acceptance, because there are no pictures; no check of the Romanesco, Venetian and Sicilian speech lines by a native reader; and **no verified clothing description for any of the three regions**, which is the largest gap in this delivery and is written up as such.

## What happens next

**Stage B waits for the pictures.** Forty-six files into `~/Downloads/additional game asset/italy/` with the exact names in the [image brief](italy-image-brief.md). Nothing in Stage B starts on guessed pictures, and nothing in Stage B was started in this pass.

Before the files arrive, three things are open and none of them belongs to the Researcher:

- **The owner's decision on the period.** The band of about 1880 to 1914 makes Italy poorer, browner and more regional than the Italy an image tool will offer: no carbonara, no tiramisù, no spritz, no Vespa, no counter of twenty cicchetti, no red-check tablecloth, and a great deal of bread, beans, offal and polenta. It is the truer and the better world — a city whose streets are canals, a market under a statue raised in 1889, a snow trade dying on Etna's flank — but it is her call, and everything else waits on it. If she prefers a contemporary Italy, the brief is rewritten before any picture is generated and most of the research's records become background rather than subject.
- **The owner's decision on the build shape**: all three areas at once, as recommended, or Rome first. The object list serves either; only the order of work and the number of generation sessions change.
- **The Italy table's blueprint.** Italy at this scale does not fit the 76 x 56 table as it stands, and the frame proposed above grows it to `W: 100, D: 64`, fixes the two hand-written literals in `shore()`, cuts a lagoon of island quays off the north-east shoulder, puts Sicily across a strait and accepts that the three landmasses cannot share one road network. **That is the Lead's Stage B decision, not the Researcher's.** The object list's ids, kinds, areas, clusters, purposes, reactions and repertoire are unaffected by whichever way it goes; only the provisional positions move.

**Whether the Italy table needs a blueprint change at all is the Lead's Stage B decision.** The Researcher's reading is that it does, and the reasons are density, the lagoon and the strait rather than taste; but a lead who decides to keep 76 x 56 and build a tighter Italy changes nothing above except the numbers in two columns.

Three smaller items for whoever opens Stage B: teach `scripts/audit/objects.mjs` every world rather than a third hard-coded id, so Italy, Britain and Thailand all get baseline numbers; take the two Vespas off the Roman loop in the same pass as the object recast; and decide whether the nine decorative monuments the world file already builds are removed where an object now carries them, or kept and the object placed elsewhere — four of them become clickable landmarks in this list and the same mesh must not stand twice.

## Stage B: pictures and blueprint, 2026-09-21

### Picture acceptance

All 46 files arrived in `~/Downloads/additional game asset/italy/` with `italy_concept_layout_note.md`, which is the generator's own claim about the concept and was not treated as evidence. Every picture was inspected against [art direction](art-direction.md) section 8 and Part E of the [image brief](italy-image-brief.md), at reduced size for the whole frame and at full resolution where a detail decided a verdict. Sizes were read out of the PNG headers rather than from the note.

**All 46 files are accepted; none is outstanding.** The reject is a portrait whose first discovery subject fell outside the phone band. The first regeneration brought the subject inside the band and cut the artichokes as asked, but lifted the crab cage out of the water onto dry paving and emptied it of visible crabs. The second put the cage back half in the green canal at the step, with the boy's hand on it and the green crabs plainly visible through the mesh, and is right in every other respect — but it slid the cage left again, to x ≈ .049 to .200, so the phone band cuts it once more, which is the original fault in the same subject at the third time of asking. Three portraits delivered one pixel short (941 x 1671) are accepted: the importer pads a shortfall of at most 2 px to the exact target by replicating the last row or column, so all three now land at 941 x 1672. Nothing was rejected on taste.

| File | Verdict | Reason |
| --- | --- | --- |
| `it00_concept.png` | Accepted | Six neighbourhoods in their briefed positions, one continuous sea square at the table edge, lagoon behind a barrier, a river below Rome, a strait with a sailing boat and no bridge, landmarks small and behind their neighbourhood |
| `it01_trattoria_wide.png` | Accepted | Open oxtail pot, cheese-and-pepper pasta, cut pecorino with its knife; wine from the ringed glass carafe with lip, thread and a tumbler standing on the marble; empty iron hook on plain lime wash, not ochre; no red-check cloth, no flask, no carbonara |
| `it01_trattoria_portrait.png` | Accepted | Same three subjects inside the middle 80 per cent, hook at x ≈ .41, pour intact |
| `it02_market_wide.png` | Accepted | Artichoke pyramid with one turned against the knife, ricotta in its drained basket, brass balance; empty S-hook on the stall rail against plain canvas; nothing hot, seasonal winter produce, statue behind and smaller |
| `it02_market_portrait.png` | Accepted | Three subjects inside the band, hook at x ≈ .33, clean sky over the house fronts |
| `it03_pasta_wide.png` | Accepted | Folded sheet under the knife, lifted nest of ribbons, guitar frame with its wires; bare cane between two brackets with nothing over it; open copper the only hot vessel; no crank machine |
| `it03_pasta_portrait.png` | Accepted | Three subjects inside the band, bare cane at x ≈ .43 to .78, shaft of light kept clean |
| `it04_forno_wide.png` | Accepted | Long white pizza on the peel, open glowing oven mouth, cut loaf showing its crumb; empty iron hook on plain grey-white plaster beside the oven; no round mozzarella pizza |
| `it04_forno_portrait.png` | Accepted | Three subjects inside the band, hook at x ≈ .63, oven mouth unobstructed |
| `it05_casale_wide.png` | Accepted | **Cold, as required**: no fire, no range, no steam anywhere. Whey runs off the draining-table lip in one unbroken thread and lands on the whey in the pail; cut curd in the copper; cut wheel on the shelf; empty wooden peg on plain lime wash |
| `it05_casale_portrait.png` | Accepted | Cold, same three subjects inside the band. **Stage C note**: the empty peg sits at x ≈ .90, on the edge of the phone band, so `it-garlic-braid` hung there is half-cropped at 390 wide; hang it in the wide only, or ask for the peg nearer the centre when this pair is next regenerated |
| `it06_pescaria_wide.png` | Accepted | Plain iron canopy on cast-iron columns, not the neo-Gothic loggia; sardines sliding along wet marble, live green crabs, cuttlefish with the ink sac; empty hook on a column against plain grey; no steam, nobody in the water. Caveat for the researcher: the big crab on the near slab reads closer to a king crab than to a granseola |
| `it06_pescaria_portrait.png` | Pass (padded 1 px by the importer) | Delivered 941 x 1671, one pixel short of 941 x 1672; the importer pads the shortfall to size by replicating the last row, so the file on disk is now 941 x 1672. Sardines-on-marble foreground and the empty hook on the iron column are unaffected |
| `it07_bacaro_wide.png` | Accepted | An osteria, not a cicchetti bar: six dishes and no more, wine drawn from the cask's brass tap into a small glass standing on the counter, half full; empty brass chain with a ring over a clear part of the counter; no toothpick row, no display case, no spritz, no labels |
| `it07_bacaro_portrait.png` | Accepted | Salt cod on polenta, sardines under onions, cask and tap all inside the band; chain and ring at x ≈ .51 |
| `it08_laguna_wide.png` | Accepted | Soft crab lifted out of the beaten egg with the egg running back into the bowl, floating cage at the step, frying pan and rice the only hot vessels; empty iron hook on plain render; nobody in the canal |
| `it08_laguna_portrait.png` | **Accepted by owner ruling (third version, 2026-09-22)** | Round one: discovery subject one, the floating cage of soft crabs, sat at x ≈ .00 to .17 and was cut by the phone band; the purple artichokes were whole rather than cut in half. The regeneration delivered 941 x 1672 exactly and fixes both faults — the cage now sits at x ≈ .14 to .24, well inside the band, and two purple artichokes in the bowl are cut in half with their pale cut faces toward the viewer — and the empty iron hook is unmoved and still empty on the plain grey render (x ≈ .64), the crab still lifts dripping out of the beaten egg, the door still opens onto the canal, and there is no text, no modern object and no steam over the cold food. But it introduces a new fault in the same subject it was sent back to fix: the cage is no longer **the floating cage of soft crabs at the step** the brief names. It stands dry on the paving two courses above the waterline with no hand on it, its contents read as straw and indistinct gold shapes rather than small green crabs, and its right side is covered by the girl's skirt and arm — so subject one is neither the briefed subject nor unobstructed, and the portrait no longer agrees with its accepted wide, where the cage is half in the water with the boy's hand on it. *Regenerate `it08_laguna_portrait.png` at 941 x 1672: keep the cage between x .094 and .906 but put it back half out of the green canal water at the step with the boy's hand holding it at the edge and four or five small green soft crabs plainly visible through the mesh, the whole cage clear of the girl's skirt; keep the halved purple artichokes, the crab lifted dripping out of the beaten egg, the empty iron hook on the plain painted wall and the open door onto the canal.* **Round three, 2026-09-22:** the third version is 941 x 1672 exactly and does everything that line asked for except the one measurement it was sent back for in the first place. The cage is a floating wooden cage again, half out of the green canal water at the step with the waterline across its lower third, the boy's right hand on its top rail at the near edge, and small green soft crabs plainly visible through the mesh — three read clearly and a fourth sits behind a corner post — with the whole cage well clear of the girl's skirt; the purple artichokes are still halved with their pale faces to the viewer, the crab still lifts dripping out of the beaten egg with one unbroken thread landing in the bowl, the iron hook is still empty on the plain grey render (now x ≈ .60, not .64, so Stage C must re-measure it), the door still opens onto the canal, there is no text and no modern object, steam sits only over the frying pan and the rice copper and never over the cold artichokes, egg, polenta, biscuits or small fish, and the portrait now agrees with its accepted wide. But the cage slid back to the left: it spans x ≈ .049 to .200, so its left post, left panel and leftmost crab fall outside the middle 80 per cent and the phone band cuts about 30 per cent of its width — the round-one fault returning in the same subject at the third time of asking. *Regenerate `it08_laguna_portrait.png` at 941 x 1672: change nothing in the frame but the cage's position — slide the whole cage right until its left edge sits at x .12 or more and its right edge stays under x .906, keeping it half out of the green canal water at the step, the boy's hand on its edge, the four or five small green crabs plainly visible through the mesh and the cage clear of the girl's skirt.* the cage spans x .049 to .200, so the Room maker places its discovery marker on the cage's right portion, inside the phone band, where the crabs are visible; the empty hook reads at x .60 and is re-measured at Stage C. |
| `it09_veneto_wide.png` | Accepted | Polenta turning in the copper over the fire, board with the cutting thread across it, split red chicory; second bare chain with an empty S-hook beside the pot's chain; the salami hangs still on a separate beam; a poor table, not a feast |
| `it09_veneto_portrait.png` | Accepted | Three subjects inside the band, bare chain at x ≈ .48, fire under the copper clean |
| `it10_friggitoria_wide.png` | Accepted | Chickpea squares sliding off the knife into the lard which lifts and closes, copper of spleen with its tongs, split sesame roll being packed; empty iron hook on the bare stone jamb; no modern fryer, no printed wrapper |
| `it10_friggitoria_portrait.png` | Accepted | Three subjects inside the band, hook at x ≈ .73, hard white sky over the lane kept clean |
| `it11_ballaro_wide.png` | Accepted | Water thrown across the swordfish and running off the slab edge onto wet cobbles, wild fennel bundle, board of dark pressed tomato paste; empty hook on the cane frame against plain sky; nothing hot anywhere. Caveat: the cut steak rests on the fish rather than opening a gap in it, so the pale wheel reads as a steak on a whole fish |
| `it11_ballaro_portrait.png` | Pass (padded 1 px by the importer) | Delivered 941 x 1671, one pixel short of 941 x 1672; the importer pads the shortfall to size by replicating the last row, so the file on disk is now 941 x 1672. Swordfish and cut face in the foreground and the empty hook on the awning's cane frame are unaffected |
| `it12_pasticceria_wide.png` | Accepted | Ricotta piped from the cloth bag into the pastry tube, cut cassata showing its layers, ice tub with its brass canister and crank; empty brass chain and ring from the ceiling; **no steam anywhere**, no refrigerated case, no electric light |
| `it12_pasticceria_portrait.png` | Accepted | Three subjects inside the band, chain and ring at x ≈ .50, lamp and doorway glare both clean |
| `it13_tonnara_wide.png` | Accepted | Loin lowered on the hooked pole into a boiling open copper, oil poured from the copper jug into an open tin with lip, thread and landing, pressed roe with its cut slice; empty iron hook on the whitewashed pier; nobody in the sea |
| `it13_tonnara_portrait.png` | Pass (padded 1 px by the importer) | Delivered 941 x 1671, one pixel short of 941 x 1672; the importer pads the shortfall to size by replicating the last row, so the file on disk is now 941 x 1672. Loin entering the copper in the foreground and the empty hook in the arch are unaffected |
| `it_motion_awning.png` | Accepted | Straight attachment edge, three scallops, faded red stripe, one frayed corner, no poles or rope; 960 x 460 after the cut |
| `it_motion_salumi.png` | Accepted | Twine loop at the top, cut end showing the grain, clean edge; 218 x 960 after the long-side cap, which no narrow hanging object can pass on its short side — the same note Spain's `es-pepper-ristra` carries |
| `it_motion_pasta_cane.png` | Accepted | Horizontal cane with both ends clear, about twenty nests and ribbons, composed close to square; 960 x 686 |
| `it_motion_garlic_braid.png` | Accepted | Loop at the top, garlic and small onions plaited round their own stems; 475 x 960 |
| `it_motion_gull.png` | Accepted | Yellow-legged gull gliding, wings and tail fully visible, yellow bill and legs, pale grey mantle; 960 x 777 |
| `it_motion_lamp.png` | Accepted | Brass lamp, clear chimney, shallow shade, **unlit**, short chain with a ring at the top; 548 x 960 |
| `it_card_trattoria.png` | Accepted | One piece of stewed oxtail with the bone at the cut and two celery sticks; sauce texture reads at card size |
| `it_card_market.png` | Accepted | Three round flat-topped artichokes with long stalks, one showing the pale trimmed heart |
| `it_card_pasta.png` | Accepted | One floury nest of cut egg ribbons with a few falling away |
| `it_card_forno.png` | Accepted | One long blistered white pizza, dimpled, oiled and salted, folded once |
| `it_card_casale.png` | Accepted | Cut wedge of pale sheep's cheese with its close crumb and dry rind, beside fresh ricotta from a rush basket |
| `it_card_pescaria.png` | Accepted | Five whole sardines laid overlapping, silver and blue-backed, wet |
| `it_card_bacaro.png` | Accepted | Whipped salt cod on a grilled polenta finger with a small thick glass of red wine |
| `it_card_laguna.png` | Accepted | Two whole fried soft-shell crabs, legs and claws fully visible |
| `it_card_veneto.png` | Accepted | Polenta slab with the cutting thread still across it, beside liver and onions |
| `it_card_friggitoria.png` | Accepted | Split sesame roll packed with fried chickpea squares, two loose squares showing their blistered surface |
| `it_card_ballaro.png` | Accepted | Swordfish steak with the pale wheel and the dark line, beside a sprig of wild fennel |
| `it_card_pasticceria.png` | Accepted | Filled pastry tube, ricotta at both ends, chopped pistachio pressed in. Caveat: the fruit beside it is a real fig, not one of the painted marzipan fruits the brief asked for, so the card text should not name martorana |
| `it_card_tonnara.png` | Accepted | Cooked pale pink tuna loin flaking along its grain, beside three slices of dark amber pressed roe |

Three findings that belong to the lead rather than to any one file:

- **Faces run slightly sweeter than the reference set.** Several young women and children are painted with large, glossy eyes and very smooth skin, further from the Turkey rooms than the rest of the picture is. It is consistent across all thirteen rooms, so it is the set's house style rather than a defect in one file, and it is recorded here for the lead to rule on rather than rejected twenty-six times.
- **Cards and sprites are rendered rather than brushed**, in exactly the register of Spain's shipped `spain-food` cards and `es-gull`, which were checked against these before any verdict was written. They match the canon, so they pass.
- **No text, no marker, no collage, no modern object** was found in any of the 46 files: no Vespa, no motor boat, no three-wheeler, no stainless steel, no electric light, no printed packaging, no chalkboard, no wine label, no red-check tablecloth, no carbonara, no tiramisù, no spritz and no cicchetti counter.

### Import

`scripts/scenes/import-italy.py` copies the thirteen room pairs to `public/scenes/it_*/wide.jpg` and `portrait.jpg` at their native size, keys the thirteen cards from white into trimmed, edge-bled WebP in `public/scenes/italy-food/<name>.webp`, keys the six sprites into `public/scenes/props/it-<name>.webp`, saves the concept as `public/scenes/it_concept.jpg`, merges the sizes into `src/fw/scenes-props.json` and writes `public/scenes/italy-assets.json` with a SHA-256 of every source file.

```
uv run --with pillow --with numpy --with scipy scripts/scenes/import-italy.py "$HOME/Downloads/additional game asset/italy"
```

It runs clean twice: the second run leaves every output byte-identical and prints `scenes-props.json unchanged`. Three other area importers may be writing this file at the same time, so it never rewrites from a stale read — it re-reads `scenes-props.json` immediately before writing, merges only its own `it_` and `it-` keys, and retries when another process wrote in between. It adds no key it does not own and removed nothing: the diff is 596 insertions and 0 deletions.

Keys added to `src/fw/scenes-props.json` — thirteen rooms, all `1672 x 941` wide and `941 x 1672` portrait:

`it_trattoria`, `it_market`, `it_pasta`, `it_forno`, `it_casale`, `it_pescaria`, `it_bacaro`, `it_laguna`, `it_veneto`, `it_friggitoria`, `it_ballaro`, `it_pasticceria`, `it_tonnara`. Three portraits (`it_pescaria`, `it_ballaro`, `it_tonnara`) were delivered at 941 x 1671, one pixel short; the importer pads a shortfall of at most 2 px to the exact target by replicating the last row or column, so all three record `941 x 1672` like every other room.

and six props: `it-awning` 960 x 460, `it-salumi` 218 x 960, `it-pasta-cane` 960 x 686, `it-garlic-braid` 475 x 960, `it-gull` 960 x 777, `it-lamp` 548 x 960.

**The one rejected picture was imported too, so the pipeline is complete and Stage C can start measuring the twenty-five files that are final.** `public/scenes/it_laguna/portrait.jpg` will be overwritten when its regeneration arrives, and its row in `italy-assets.json` and `scenes-props.json` changes with it, so no coordinate should be measured on it yet — the only file whose composition changes, so its wide stays valid and its portrait must be re-measured from scratch.

The three portraits delivered one pixel short (`it_pescaria`, `it_ballaro`, `it_tonnara`) needed no regeneration: the importer padded each to 941 x 1672 by replicating its last row, and their rows in `scenes-props.json` already read the padded size. Re-running the importer after the `it08_laguna_portrait.png` regeneration lands is enough; nothing else has to be touched.

### Room audit

`scripts/tests/room-audit.html` does not discover rooms from `public/scenes/` or from `scenes-props.json`. It builds its list from three module imports —

```js
import {SCENES as CHINA_SCENES} from '/src/fw/scenes-china.ts';
import {TURKEY_SCENES} from '/src/fw/scenes-turkey.ts';
import {SPAIN_SCENES} from '/src/fw/scenes-spain.ts';
const SCENES={...CHINA_SCENES,...TURKEY_SCENES,...SPAIN_SCENES};
```

— and `scripts/tests/rooms.html`, which its iframes load, builds the same object the same way. **So no Italy room can appear on that page at Stage B, and none of the thirteen does.** Two things are needed, both of them Stage C work that this pass deliberately did not do:

1. `src/fw/scenes-italy.ts`, exporting `ITALY_SCENES` as a `Record<string, () => SceneDef>` with all thirteen keys `it_trattoria`, `it_market`, `it_pasta`, `it_forno`, `it_casale`, `it_pescaria`, `it_bacaro`, `it_laguna`, `it_veneto`, `it_friggitoria`, `it_ballaro`, `it_pasticceria`, `it_tonnara`, in the shape `src/fw/scenes-spain.ts` uses.
2. One import line and one spread in each of `scripts/tests/room-audit.html` and `scripts/tests/rooms.html`: `import {ITALY_SCENES} from '/src/fw/scenes-italy.ts';` added to the three existing imports, and `...ITALY_SCENES` added to the `SCENES` literal. Both files are tests and were not touched.

What was confirmed instead, without that config: all twenty-six imported JPGs decode, sit at the folder and file names the room contract fixes, and carry the sizes recorded in `scenes-props.json`. The proof is one contact sheet of the thirteen rows, wide beside portrait, at `italy-rooms-sheet.png` in the Room maker's scratchpad.

**Owner rulings, 2026-09-22.** Only `it08_laguna_portrait.png` is regenerated, and it is **still outstanding**: the second-round picture arrived on 2026-09-21 and was rejected for lifting the crab cage out of the canal, and the third-round picture arrived on 2026-09-22 at 941 x 1672, was imported over `public/scenes/it_laguna/portrait.jpg` and is rejected again because the cage, though back in the water with the boy's hand on it and the crabs visible, sits at x ≈ .049 to .200 and is cut by the phone band. Stage B pictures are therefore not yet closed and no coordinate should be measured on that portrait; the one line left to fix is the cage's horizontal position, nothing else in the frame. The three short portraits (`it06_pescaria_portrait.png`, `it11_ballaro_portrait.png`, `it13_tonnara_portrait.png`) are padded by the importer rather than regenerated. The sweeter faces across all thirteen rooms are accepted as within the house style. The pasticceria card text must not name martorana, because the fruit beside the pastry tube is a real fig, not one of the painted marzipan fruits the brief asked for. 2026-09-22: the owner accepted the third laguna portrait as delivered and closed regeneration for the area. Stage B pictures are closed for all four areas.

### Blueprint (fixed)

Italy is three landmasses in one sea on a grown `world-italy.ts` table: the **mainland**, which carries Rome and the Veneto's terraferma; the **Venetian lagoon** of island quays cut off its north-east shoulder; and **Sicily** across a strait in the south. Every number below is held as data in `scratchpad/italy-blueprint.py` and passes the paper check there — landmass membership, water clearances, 2.5 between clickables, rooms on roads, nothing solid on a road centreline, blockers off every corridor, blocker separation, houses per area, cluster separation and the strait's width — and the plan it draws, `italy-blueprint.png`, is the contact sheet for this section.

Table and frame:

- `world-italy.ts` grows to **`W: 100, D: 64`**, `cx: 0, cz: 0` unchanged. The table runs x from **-50 to 50** and z from **-32 to 32**.
- **`shore()` loses both hand-written literals.** Its edge test becomes the table's own half-width and half-depth — x at or beyond **-50 or 50**, z at or beyond **32** in either direction — read from the same `W`/`D` the world is built with, so the sea stays square at the edge and the table can be resized again without editing the test. This is the Thailand trap in a second world and it is fixed here, not worked around.
- Arrival views: **`AREAS.rome.center` becomes [-19, -6]**, on the Campo de' Fiori cluster; **`AREAS.venice.center` becomes [27, -20]**, on the Rialto quay; **`AREAS.sicily.center` becomes [-8, 22]**, on the Ballarò cluster. The three area ids, names and `zh` are unchanged.
- `worldZoomLimit` and `worldFogRange` in `world-camera.ts` gain **`italy` beside `mediterranean`** (and beside `middle-east` and `southeast-asia`, which are already there), so the 100-wide table gets the 215 desktop overview and the computed fog pair instead of the flat 90/200. Builder, Stage C; it is one word in one expression.

**Water: one continuous `seaWater()` polygon, square at all four table edges.** Its outer ring is the table itself —

```
[-50,-32] [50,-32] [50,32] [-50,32]
```

— and the three landmasses and the lagoon's five islands are **holes** in that shape, so the sea is one polygon, one rim and one shader, exactly as Britain's island is a hole in the Channel. The rim (`#efe0bb`) is an inset of every ring by 1.2, computed per vertex, not from a single centre as the two hand-drawn Italian shores are now.

The **mainland's coast**, clockwise from the north-west — the Tyrrhenian north shore, then the lagoon's landward shore running east, the Adriatic side, the toe, and the long south coast back to the west cape:

```
[-46,-27] [-38,-27.6] [-30,-27.2] [-22,-27.6] [-14,-27.2] [-6,-27.6] [0,-27.2] [4,-26.4]        the north coast
[6,-24] [8,-20] [9,-16] [11,-12.5] [14,-9.5] [18,-8] [23,-7.2] [28,-7.6] [32,-8.4]              the lagoon's landward shore
[35,-6] [36,-2] [35,2] [33,5]                                                                    the east coast
[31,8] [29.6,10.8] [27.4,12.4]                                                                   the toe, reaching the strait
[23.6,12] [20,11.2] [16,10.4] [12,9.6] [8,9.2] [4,9.6] [0,9] [-4,9.6] [-8,9.2]                   the south coast
[-12,10] [-16,10.4] [-20,10.2] [-24,10.6] [-28,10.6] [-33,10.8] [-38,10.4] [-42,10] [-45,9.4]    on past the Tiber mouth
[-46,6] [-45.6,2] [-46,-4] [-45.6,-10] [-46,-16] [-45.6,-22]                                     the west coast
```

**Sicily's coast**, clockwise from the west cape, with the north-east cape at [29, 18.6] facing the toe:

```
[-21,20] [-18,17.6] [-14,16.4] [-10,16] [-6,16.4] [-2,15.8] [2,16.2] [6,15.6]                    the north coast
[10,16] [14,15.4] [18,15.8] [22,16.2] [26,17.2] [29,18.6] [31,21] [32,24]
[31,27] [29,29.4] [25,30.2] [20,30.6] [15,30.2] [10,30.6] [5,30.2] [0,30.6]                      the south coast
[-5,30.2] [-10,30.4] [-14,29.8] [-18,28.6] [-20,26] [-21.4,23]
```

**The strait** is the water between the mainland's toe and Sicily's north-east cape: **4.46 units at its narrowest**, measured in the paper check, running from the open sea in the east to the south coast in the west. **There is no bridge**, because there was none; a boat lane crosses it.

**The lagoon** is the shallow water inside the mainland's north-east shoulder, x about 7 to 41 and z -32 to -8, tinted `#69b3b0` over the sea's own blue and held inside a **lido barrier**, a bar of land at x 38 to 41, z -29 to -13, with the open porto south of it. Five islands stand in it, each a quay with a fondamenta round it and its own square-edged rim; they are the lagoon landmass, and they are its own islands, so they are not "something standing in water":

| Island | Rectangle | Holds |
| --- | --- | --- |
| The Rialto quay | x 21 to 35, z -26.5 to -19.5 | `seafood`, `bacaro`, two decorative houses |
| The San Marco quay | x 23 to 35, z -16.5 to -10 | `campanileIt`, one decorative house |
| Burano | x 10.5 to 19, z -28.6 to -23 | `lagunaIt`, one decorative house |
| The valli bank | x 11 to 20.5, z -17.5 to -10.5 | `valliIt` and its walled enclosures |
| The lido barrier | x 38 to 41, z -29 to -13 | Nothing. It is the barrier the lagoon is shallow behind |

The **Grand Canal** is the 3-unit channel between the Rialto quay and the San Marco quay, z -19.5 to -16.5, and `rialtoIt` spans it.

**The Tiber**, `freshWater()` width 2.4 on a rim 1.6 wider, with an `estuaryWater` blend from z 8 to the mouth. It rises in the central hills east of Rome, runs south-west past the piazza, through the Testaccio quarter and reaches the south coast below Rome:

```
[-2,-22] [-8,-21] [-14,-19.5] [-20,-18] [-25,-16] [-28,-13] [-30,-9.5] [-31,-6] [-31.5,-2] [-32,2] [-32.5,6] [-33,10.6]
```

Nothing stands in water on this table except **`rialtoIt`**, the moored boats and gondolas, and the quay edges built to — the Pescaria's marble slab and the tonnara's pier reach the water, their stands do not. The Albufera lesson is tested from the first commit, not at the review: every vertex of every stand goes against the sea ring, all three landmass rings, the lagoon, the Grand Canal, the strait and the Tiber in `scripts/tests/italy-world.mjs`. The fish market and the tonnara are the two that will want to creep onto the water and must not.

Clusters and their ground tints. Positions are final; every one of the forty-six registered ids appears exactly once.

| Cluster | Centre | Tint | Holds |
| --- | --- | --- | --- |
| Rome: the piazza | [-17, -6.5] | `#d9cbb0` travertine and basalt setts, 20 x 10 | The street runs east–west with the market square on its south side: `romeMarket` [-20.5, -5.55] and `pasta` [-14, -5.55] on the south side, `oven` [-14.6, -9.25] with **its own oven house at [-16.6, -10.6]** and `gelateria` [-24, -9.25] on the north side. The market's five stalls stand in a horseshoe behind it, clear of the road: `stall-oil` [-24.7, -4.9], `stall-tomato` [-23, -2], `stall-cheese` [-20.5, -1.2], `stall-salumi` [-18, -2], `stall-herbs` [-16.8, -4.6]; `basil` [-25.8, -0.8] beside them. `panteonIt` [-10, -9.7] and `colosseoIt` [-5.5, -10.6] stand behind the street at the east end, small and behind their neighbourhood. `pizzeria` is `oven`'s alias and sits on its point. Two decorative houses: **`it-piazza-palazzo` [-19.8, -11.8]** and **`it-piazza-casa` [-11, -3]** |
| Testaccio and the Agro Romano | [-38, -1] | `#c6b489` dry campagna running to `#b9ad98` river quay along the Tiber, 22 x 20 | The road loops round the quarter and out into sheep country: `ragu` [-35, -2.5] under the slaughterhouse wall with `trattoria` on its point, `quintoQuarto` [-37.6, -2.4], `carciofoIt` [-33.6, -8.2] on the beds between the road and the river, `vinoIt` [-38.5, -6.2], `olive` [-41.5, -6.6], `pecoraIt` [-44.2, -6], `mushrooms` [-43.5, -9.2] in the chestnut wood, `italyChicken` [-43.4, 1], `cheese` [-40.6, 5.8] with **its own byre at [-39.5, 2.6]**, `italyBeef` [-36.6, 5.9]. One decorative house, **`it-trastevere-casa` [-27.5, -3]**, on the town side of the river; **no house inside the loop** — ten objects and the byre already fill it, and Spain's Plaza Mayor set the precedent |
| Venice: the Rialto | [27, -19] | `#ded3b6` Istrian stone over brick, the quays themselves | `seafood` [24.5, -22.55] under the plain iron canopy of 1884 and `bacaro` [30, -22.65] on the Rialto quay's fondamenta; `rialtoIt` [27, -18] spanning the Grand Canal; `campanileIt` [29, -12.3] on the San Marco quay. Three decorative houses: **`it-rialto-casa` [22.8, -24.8]**, **`it-rialto-magazzino` [32.2, -24.6]**, **`it-sanmarco-casa` [25.5, -13]** |
| The lagoon and the terraferma | [4, -18] | `#a9b878` maize green on the mainland, `#c8bd93` sand and salt marsh on Burano and the valli bank, 16 x 14 | `casaVeneta` [5.15, -16] and `riceIt` [1.5, -20.5] on the terraferma, both on the via consolare; `lagunaIt` [13.8, -25.65] on Burano and `valliIt` [15.8, -14.55] on the valli bank, each on its own island with its own path. One decorative house: **`it-burano-casa` [16.5, -26.6]**. **This cluster straddles two landmasses** — its centre is on the mainland, its two lagoon objects are reached by boat, and that is the reading this world records rather than a failure |
| Palermo: the Albergheria | [-8, 22] | `#cdbb92` tufa under awnings, 18 x 10 | The lane runs east–west with the market on its north side: `sicilyMarket` [-8, 21.15] with `stall-lemon` [-11.6, 19.9], `stall-tomato2` [-4.4, 19.9] and `stall-arancini` [-8, 18.55] behind it; `friggitoria` [-12.5, 24.85] and `pastry` [-4, 24.85] on the south side; `tomato` [-15.5, 19] on the beds at the west end and `carrettoIt` [-1.5, 20] at the east. Two decorative houses: **`it-albergheria-casa` [-9.5, 26.2]** and **`it-albergheria-torre` [-16.2, 25.8]** |
| The tonnara coast and Etna | [16, 23] | `#b6ac7e` dry gold running to `#6b6258` basalt under Etna, 24 x 14 | `lemon` [8.2, 19.6] in the Conca d'Oro, `granoIt` [4.2, 25.6] on the latifondo, `mandorleIt` [18.5, 19.8], `etnaIt` [23, 19.2] behind the coast, `capperiIt` [26.5, 26.5] on the terraces, and `tonnaraIt` [13.85, 27] on the spur down to the shore with **its own sheds at [15.6, 28.6]**. Three decorative houses: **`it-coast-casa` [17.5, 25.6]**, **`it-etna-casa` [26, 20.5]**, **`it-latifondo-masseria` [1.2, 25.4]** |

Roads. **One network per landmass**, which is this world's reading of "connected by continuous roads" and is recorded here rather than left for a harness to fail silently: the mainland's three ribbons meet at [-27.5, -7.4] (IT-R1 with IT-R2) and [-4, -7.4] (IT-R1 with IT-R3); Sicily's three meet at [0, 22.6] and [12, 22.2]; the lagoon's four are each one island's fondamenta, joined across the Grand Canal by the Rialto and otherwise by boat. Every door is on a road, and nothing solid sits within half a road's width plus 0.4 of a centreline.

| Road | Width | Points |
| --- | --- | --- |
| IT-R1 the piazza street | 2.4 | [-27.5,-7.4] [-24,-7.4] [-20.5,-7.4] [-16,-7.4] [-12,-7.4] [-8,-7.4] [-4,-7.4] |
| IT-R2 the Testaccio and Agro road | 2.0 | [-27.5,-7.4] [-29.2,-6.8] [-31,-6] bridge [-32.6,-5.2] [-34,-4.6] [-36,-4.2] [-38,-4.1] [-41,-4] [-44,-3.4] [-45.2,-0.8] [-44.8,2.2] [-43.6,5] [-41.5,7.6] [-38.5,8.2] [-35.6,7.6] |
| IT-R3 the via consolare | 2.2 | [-4,-7.4] [0,-8.4] [3,-10.2] [5.6,-12] [7,-13.5] [7,-17] [7,-20] [5.2,-22.4] [2.6,-23.8] |
| IT-R4 the Albergheria lane | 2.0 | [-17,23] [-12,23] [-8,23] [-4,23] [0,22.6] |
| IT-R5 the tonnara coast road | 1.8 | [0,22.6] [4,22.2] [8,21.8] [12,22.2] [16,22.6] [20,22.4] [24,22.8] |
| IT-R5b the tonnara spur | 1.6 | [12,22.2] [12,25] [12,28] |
| IT-R6 the Rialto fondamenta | 1.8 | [22,-20.6] [26,-20.7] [30,-20.8] [33,-20.9] |
| IT-R7 the riva and the Rialto bridge | 1.8 | [27,-20.7] [27,-19.5] bridge [27,-16.5] [27.6,-14.8] [29.5,-13.9] [32,-13.6] |
| IT-R8 the Burano fondamenta | 1.6 | [11,-24] [14,-23.8] [17,-24] |
| IT-R9 the valli bank path | 1.4 | [12.5,-12.6] [16,-12.7] [19,-12.6] |

**IT-R2 is the only road on the table that crosses fresh water**, and it crosses the Tiber once. Everywhere else the roads keep at least half their own width plus half the river's from the centreline; if a road point ever comes inside a bank, move the road, not the water.

**Bridges, two.** A stone road bridge, **`ponteIt` at [-31, -6]**, where IT-R2 crosses the Tiber: span 5.0, deck at the road height (`BRIDGE_DECK_Y` 0.9), ends on the banks, square to the water, with a `deckY` entry so walkers and the wine carts ride up onto it. **`rialtoIt` at [27, -18]** is the second: the single-arch Rialto, a clickable landmark that carries IT-R7 over the Grand Canal and is the one object on this table that stands in water. The four `venetianBridge` decks the world file places today all go with the old lagoon.

**Boat lanes, five.** The islands are linked to each other and to the mainland by water, not by a causeway, because the doc names none:

| Lane | Points | Carries |
| --- | --- | --- |
| L1 the Grand Canal | [19,-18.2] [24,-18] [27,-18] [31,-17.6] [36,-17.2] | Three gondolas under the Rialto |
| L2 the lagoon lane | [8.8,-21.6] [12,-21.2] [16,-21] [19.5,-19.8] [19.8,-20.6] | The terraferma landing to Burano to the Rialto quay: two sandoli and a market barge |
| L3 the valli lane | [21.7,-19.2] [21.8,-16] [21.6,-13.5] | One flat-bottomed boat to the valli quay |
| L4 the porto lane | [36,-17.2] [37.5,-15] [39.5,-11.5] [42,-9.5] [45,-8] | Two bragozzi out through the porto to the open sea |
| L5 the strait lane | [31.5,11.5] [31.8,14] [31.4,16.5] [30.6,18.6] | The one sailing boat that crosses the strait, mole to mole; no bridge |

Walker loops, residents from the eight profiles, steps matched to distance (`italyWalk`), speed 0.009 on the piazza street and 0.007 elsewhere:

1. **The piazza**, IT-R1 between [-24, -7.4] and [-8, -7.4], six residents, one with a basket and one with a tray of cooked greens; **the in-period traffic runs here** — two hooded two-wheeled wine carts of the Castelli carrettieri, and **no Vespa anywhere on the table**
2. **The Agro road**, IT-R2 between [-34, -4.6] and [-41.5, 7.6], four residents, one leading a mule with panniers and one shepherd behind the flock
3. **The Rialto**, IT-R6 and IT-R7 over the bridge as a circuit, five residents, two porters with baskets on their heads, plus the three gondolas on L1
4. **The Albergheria**, IT-R4 between [-17, 23] and [0, 22.6], five residents, one carrying a split roll and one crying the market
5. **The coast road**, IT-R5 between [0, 22.6] and [24, 22.8], four residents, one leading the painted cart's mule

**Decor.** **Thirteen decorative houses in the whole world** — four in `rome`, four in `venice`, five in `sicily`, none over the five-per-area line — each at a fixed coordinate and each a 1.5-radius blocker in the paper check: `it-piazza-palazzo` [-19.8, -11.8], `it-piazza-casa` [-11, -3], `it-trastevere-casa` [-27.5, -3], `it-campagna-casale` [-40, -11], `it-rialto-casa` [22.8, -24.8], `it-rialto-magazzino` [32.2, -24.6], `it-sanmarco-casa` [25.5, -13], `it-burano-casa` [16.5, -26.6], `it-albergheria-casa` [-9.5, 26.2], `it-albergheria-torre` [-16.2, 25.8], `it-coast-casa` [17.5, 25.6], `it-etna-casa` [26, 20.5], `it-latifondo-masseria` [1.2, 25.4]. Three buildings belong to stands and are **not** extra houses, but they are blockers under exactly the same rule: the forno's oven house [-16.6, -10.6], the casale's byre [-39.5, 2.6] and the tonnara's sheds [15.6, 28.6]. Every one of the sixteen is at least 2.5 from every clickable it does not own, at least 3.0 from the next blocker so no two buildings interpenetrate, clear of every road centreline by half that road's width plus 1.5, clear of the Tiber, and at least 1.5 inside its own shore. The eleven houses the world file builds today, the four free-standing `venetianBridge` decks, the six mooring poles, the two Vespas, the three disconnected `path()` ribbons, the nine-wide channel, the straight filler strip at x 35.75 and both hand-drawn shore polygons all go with the old table.

**Countryside between the clusters.** Umbrella pines along the piazza street and broken travertine columns behind it; cypresses on the ridge above Testaccio; dry campagna grass, thistle and stone sheepfolds over the Agro with the flock's own walled pen; a chestnut wood in the west with the porcini drying on strings; vines on the Castelli slope above the wine road; poplars and reed beds along the Tiber with the river's own mud banks below Rome; mulberry rows and maize stubble over the terraferma, the rice fields flooded and mirroring; salt marsh barene, fish weirs and bricole in the shallow lagoon, gulls over all of it; prickly pear, agave and dry-stone terraces over Sicily; the latifondo's wheat in great unfenced blocks; the Conca d'Oro's citrus in walled gardens with their water tanks; basalt walls, black sand and the snow pits cut into the flank under Etna; almond and caper terraces stepping down to the tonnara coast; swifts over Rome, gulls over the lagoon and the tonnara. Every crop or tree that carries an object responds to a click (the Stand maker's file); the rest is the Builder's.

#### What this blueprint overrides in the Stage A object list

Every id, kind, area, prop, purpose, cluster, room, repertoire entry and reaction in the object list above is **unchanged**, and nothing is retired. The Stage A positions were written as provisional in a frame the lead had not yet fixed, and **all forty-six move**; the cluster table here is the only positional record. Seven things go further than a coordinate and are the lead's, recorded so Stage C does not have to ask:

- **The sea is the table with the land as holes.** The Researcher's proposal wrapped the sea round a peninsula that still touched the north and west edges. Squaring the sea at all four edges, Britain's way, is what makes one polygon, one rim and one shader possible, and it is why the mainland's north coast stands off the edge at z about -27.
- **The lagoon is reached by boat, not by a causeway.** The doc names stone bridges between islands; only one of them is a named object, so the Rialto is built and the other three islands are served by L2 and L3. The old world's four unnamed `venetianBridge` decks are not replaced.
- **`valliIt` stands on a bank of its own** rather than in the walled water it works, because a stand goes beside the water and never on it. Its enclosures, weirs and casone are decor in the water; the clickable is on land.
- **`tonnaraIt` stands 3.4 inside Sicily's south shore**, on the spur IT-R5b, with its pier reaching the water. It is one of the two the doc warned would creep onto the sea.
- **`etnaIt` is behind the coast at [23, 19.2], not on the shoulder of the table.** The volcano is a landmark object now, so the decorative `etna()` the world file places is removed; the same mesh must not stand twice. The same ruling covers `colosseum()`, `pantheon()` and `campanile()`, whose decor placements go and whose builders are now reached through `colosseoIt`, `panteonIt` and `campanileIt`. `obelisk()`, `fountain()`, `triumphalArch()`, `basilica()`, `treviFountain()` and `baroqueChurch()` stay as decor and are re-sited into this frame by the Builder.
- **Testaccio and the Agro Romano carries no decorative house inside its road loop**, and Rome therefore has four houses rather than five. Ten objects and the casale's byre leave no ground behind them; Spain's Plaza Mayor is the precedent.
- **The strait is 4.46 wide at its narrowest**, between the mainland's toe at [27.4, 12.4] and Sicily's cape at [26, 17.2]. The Researcher's frame put Sicily "across a strait" without a number; this is the number, and the Builder keeps it at or above 4.0 after the `shore()` jitter, so both of its shores take at most 0.2 of jitter instead of the usual 0.35.

### Module contracts for Stage C

Every agent owns whole files. Stubs exist so the type check passes while files are empty. Nobody edits another owner's file; a missing helper is built in the owning file. The Stand maker may import from `italy-architecture.ts` and `italy-people.ts` once they exist; until then a stand uses `person()` and `wear()` from `props.ts` and a local shelter.

| File | Owner | Exports (keep these names and signatures) |
| --- | --- | --- |
| `italy-architecture.ts` | Builder, first | `ITP` palette constant with the twelve names from the image brief (`romanOchre`, `travertine`, `sanpietrino`, `terracotta`, `pineGreen`, `campagnaStraw`, `venetianRed`, `istrianStone`, `lagoonGreen`, `adriaticBlue`, `palermoTufa`, `etnaBasalt`) — **not** `IT`, which `props-italy.ts` already exports; `italyBuilding(style, w, d, h, { storeys })` for styles `romanPalazzo`, `trastevere`, `casale`, `venetianQuay`, `buranoCottage`, `terraferma`, `palermoTufa`, `sicilianCoast`; `fornoOvenHouse()`; `casaleByre()`; `tonnaraShed()`; `ironCanopy()` (the Pescaria's plain 1884 canopy, never the stone loggia); `stoneBridge(span)` for `ponteIt` and the Rialto; `valliCasone()`; `latifondoMasseria()`; `snowPit()`. `italianHouse()` stays in `props-italy.ts`, because `map.ts` imports it |
| `italy-people.ts` | Builder, second | `italianResident(seed, working?)` and `italyWalk(person, from, to, range, seed)` following `spain-people.ts`; the eight clothing profiles from section 1.5 of the research as data, **each one pinned to a catalogued garment or photograph before a resident is dressed** — this is the largest open gap in Stage A and it is closed here or the profiles are marked unverified in the file; `wineCart()` and `followCart()` for the Castelli carrettieri, which replace both Vespas; `lagoonRower()` |
| `italy-landscape.ts`, `italy-town.ts`, `italy-countryside.ts` | Builder | `italyLandscape(ctx)`, `italyTown(ctx)`, `italyCountryside(ctx)`. The landscape owns the sea shape **with the three landmasses and the five lagoon islands as its holes**, every rim, the lagoon's shallow tint and its lido, the Grand Canal, the strait, and the Tiber with its estuary blend, and exports `IT_LANES`, `IT_BRIDGES`, `BRIDGE_SPAN` (5.0) and `BRIDGE_DECK_Y` (0.9) in the shape `spain-town.ts` and `thailand-landscape.ts` use |
| `props-italy.ts` (exists) | Stand maker | `ITALY_PROPS` gains a key for every new `prop` name in the object list — `carciofaia`, `sheepFold`, `wineCart`, `mattatoio`, `buranoKitchen`, `venetoFarm`, `valliPesca`, `rialtoBridge`, `friggitoria`, `tonnara`, `wheatLatifondo`, `almondGrove`, `caperTerrace`, `carretto` — plus the four new prop keys over existing builders (`colosseum`, `pantheon`, `campanile`, `etna`); `ITALY_ICONS` gains the eighteen new ids; `pizzeria()`, `trattoria()`, `fishMarket()`, `bacaro()`, `sicilyMarket()`, `pasticceria()`, `italyMarket()`, `dairy()` and `pastaWorkshop()` are rebuilt to the stand standard with the China click chain. **`vespa()` is deleted** once nothing imports it. Speech lines do **not** live here |
| `italy-speech.ts` | Researcher | `IT_LINES` keyed by object id: five ambient lines per room object in Romanesco, Venetian and Sicilian with English on the same line, from section 2.5 of the research, **checked by a native reader before they ship**; `village-speech.mjs` must still pass |
| `italy-objects.ts`, `italy-stories.ts` | Researcher | `ITALY_OBJECTS`, `ITALY_CARD_ART`, `ITALY_NEXT`, `ITALY_STORY_DEPTH`, `ITALY_SOURCES`, written to the card blurb band set above (room objects 2,500–3,200 characters, card-only 750–1,000), **including rewritten blurbs for all eighteen retained objects and a written or explained blurb for each of the nine empty ones**. The eleven unverified facts stay out or are written as "by tradition"; the pasticceria card does not name martorana |
| `scenes-italy.ts`, `italy-ambience.ts` | Room maker | `ITALY_SCENES` keyed by the thirteen `it_*` scene ids, each a `() => SceneDef` built with `paintedScene`; `ITALY_AMBIENCE`; hotspot labels and texts live in `scenes-italy.ts`; `scene-ambience.ts` gains `PAINTED_SIGNATURES` entries only. **`it_casale` is a cold room**: the `drip` glint variant, no steam source anywhere in it, and half of Venice is cold with it. All twenty-six paintings are final — the owner closed the laguna portrait on 2026-09-22 — so every coordinate is measured on the files on disk, `it_laguna`'s portrait included |
| `scripts/tests/italy-world.mjs`, `scripts/tests/italy-reactions.mjs` | Builder, Stand maker | Copies of the Spain and Thailand harnesses with Italy ids. `italy-world.mjs` tests **every vertex of every stand against the sea ring, all three landmass rings, the five island rings, the lagoon, the Grand Canal, the strait and the Tiber from the first commit**, plus the 2.5 corridors, rooms-on-roads, the sixteen blockers, gait and gait direction. `italy-reactions.mjs` carries all thirty-six clickable ids |
| **shared** `world-italy.ts` | Builder, Stage C | Growth to `W: 100, D: 64`; `shore()` rewritten to the table's own half-width and half-depth, with both literals gone; both hand-drawn shore polygons, the lagoon rim, the nine-wide channel, the x 35.75 filler strip, the four island boxes, the four `venetianBridge` decks, the six mooring poles, the two Vespas, the three `path()` ribbons, the eleven houses, the two walker loops and the decor placements of `colosseum`, `pantheon`, `campanile` and `etna` removed; `{ ...ITALY_PROPS }` kept and the Italy layout calls added. **One owner for this file**; no other Italy agent opens it |
| **shared** `world-camera.ts` | Builder, Stage C | `italy` added beside `mediterranean` in `worldZoomLimit`, and so through it in `worldFogRange`. One word, one owner |
| **shared** `graph.ts` | Lead, Stage D | `AREAS.rome.center` [-19, -6], `AREAS.venice.center` [27, -20], `AREAS.sicily.center` [-8, 22], ids, names and `zh` unchanged; the eighteen new objects registered and all twenty-eight existing ones re-sited to the cluster table; `seafood`, `pasta` and `cheese` become `kind: "place"`; `ragu`, `oven`, `romeMarket`, `sicilyMarket`, `bacaro`, `gelateria` and `pastry` take their new names; `trattoria` and `pizzeria` stay exactly as they are; `scripts/audit/objects.mjs` line 6 learns every world rather than a fourth hard-coded id |
| **shared** `world-intros.ts` | Researcher | The three Italy beats gain the new places in all three areas; `world-intros.mjs` must still pass |
| **shared** `scripts/tests/room-audit.html`, `scripts/tests/rooms.html` | Lead, Stage D | Two edits each: `import {ITALY_SCENES} from '/src/fw/scenes-italy.ts';` beside the three existing imports, and `...ITALY_SCENES` in the `SCENES` merge |
| `repertoire.ts`, `main.ts`, `ui.ts`, `README.md`, this file | Lead, Stage D | Registration only; `ITALY_REPERTOIRE` is merged in `repertoire.ts` so `scripts/tests/repertoire.mjs` covers its fifteen keys |

## Stage D: integration, 2026-09-22

### What was registered

| File | Change |
| --- | --- |
| `graph.ts` | The hand-written Italy list (twenty-eight objects at the old positions, many of them now in the sea) is gone; `ITALY_OBJECTS` is the forty-six objects of `italy-objects.ts`, imported as `ITALY_WORLD_OBJECTS`. `AREAS.rome.center` [-19, -6], `AREAS.venice.center` [27, -20], `AREAS.sicily.center` [-8, 22]; ids, names and `zh` unchanged. `object-ids.mjs`: 409 objects, every id unique, every alias and parent resolves |
| `main.ts` | `ITALY_SCENES` in the `SCENES` merge; entering `italy` sets `currentArea` to `rome` and arrives on the Campo de' Fiori market at `AREAS.rome.center`. The normal entry path already gives the computed fog: 198 / 439 at 1280 x 720, measured live after entry, not 90 / 200, so nothing in `configureControls` needed fixing |
| `ui.ts` | Card art from `scenes/italy-food/` for the thirteen rooms (`ITALY_CARD_ART`), `ITALY_NEXT` and `ITALY_SOURCES` on the `italy` branch, and the six room ids that had no icon key (`romeMarket`, `lagunaIt`, `casaVeneta`, `friggitoria`, `sicilyMarket`, `tonnaraIt`) added to `ICON_KEYS` |
| `snapshot.ts` | Nothing to add: `ITALY_ICONS` and `ITALY_PROPS` were already in both lookup chains |
| `repertoire.ts`, `repertoire.mjs` | `ITALY_REPERTOIRE` merged; the harness builds `scenes-italy.ts` and checks the table: 142 places, 750 dishes, 88 kitchen rooms covered |
| `README.md` | Areas line: Italy (Rome and the Agro Romano, Venice and its lagoon, Sicily from Palermo to Etna) |
| `scripts/audit/objects.mjs` | `italy` added to the audited worlds |

### Fronts face the camera

The rule is now in `docs/building-a-world.md` (section 5) and the playbook's definition of done: a stand's `rot` stays within ±0.75, its front faces +z, and the road comes to the door. `props-italy.ts`'s `facing` wrapper, which turned every body back to the south whatever its `rot`, is removed; `ITALY_PROPS` is the builders as they are, honouring `rot` like every other area.

- **Set to 0, twenty-three objects outside the band:** `ragu` (-2.94), `romeMarket` (3.14), `pasta` (3.14), `cheese` (-0.89), `casaVeneta` (1.57), `friggitoria` (3.14), `pastry` (3.14), `tonnaraIt` (-1.57), `italyChicken` (-1.44), `basil` (3.14), `riceIt` (2.65), `granoIt` (-3.04), `capperiIt` (-2.55), `quintoQuarto` (-3.09), `campanileIt` (2.84), and the eight children `stall-tomato`, `stall-cheese`, `stall-salumi`, `stall-herbs`, `stall-oil`, `trattoria`, `stall-lemon`, `stall-tomato2`. Because the wrapper showed the camera exactly this, the world looks as Stage C left it.
- **Set to 0, twelve inside the band:** `carciofoIt` (0.46), `pecoraIt`, `olive`, `italyBeef`, `mushrooms` (about 0.2), `carrettoIt` (0.1), `etnaIt` (-0.1), `mandorleIt`, `vinoIt`, `bacaro`, `valliIt`, `seafood` (0.02 to 0.05). Once the wrapper was gone each of these made a measurement worse: the artichoke beds went from 1,885 to 2,501 vertices over the Tiber, the flock and the chestnut wood started to hang over the west coast, and eight footprint pairs grew.
- **Kept:** `lagunaIt` -0.07 (it lowers its overhang from 233 to 220 vertices) and `lemon` -0.09. The objects that own world offsets (both markets, the forno, the casale and the tonnara) all stand at 0, so their stalls and outbuildings stay where the blueprint puts them. The water-subject stands (`seafood`, `lagunaIt`, `valliIt`, `tonnaraIt`) have their water on +z, so they face it inside the band.

**Road points added** (`italy-landscape.ts`, all inside a landmass's own network, every end meeting a road or a door, `italy-world.mjs` passing):

| Road | Width | Points | Brings a road to |
| --- | --- | --- | --- |
| IT-R1b the piazza lane | 1.6 | [-8,-7.4] [-9.6,-4.4] [-11.2,-2.2] [-15.2,-2.2] [-15.6,0.4] [-22,0.4] [-23,2.4] [-25.6,2.4] | `pasta`, `romeMarket`, `basil`, `stall-tomato`, `stall-cheese`, `stall-salumi` |
| IT-R3b the rice spur | 1.2 | [3,-10.2] [0.8,-13] [0.8,-17.6] | `riceIt` |
| IT-R4b the Albergheria spur | 1.4 | [-8,23] [-8.1,27.8] | joins IT-R4c to the lane |
| IT-R4c the south lane | 1.4 | [-13.6,27.8] [-8.1,27.8] [-3,27.8] | `friggitoria`, `pastry` |
| IT-R5 last point | 1.8 | [26.2,25.2] → [26.2,26.6] | `capperiIt` |

`italy-world.mjs` now asserts the band and each stand's front door (the centre of its footprint's +z face, turned by `rot`) within 2.0 of a road's edge; the road count is fourteen. `STANDS_FINAL` is set, and the three stand checks assert against dated ceilings of 2026-09-22 (`OVER_WATER`, `HIDDEN`, `CROWDED`), each a Stage C measurement unchanged or lower. The anchor door ceiling `OFF_ROAD` shrank from six to two (`mushrooms` 4.59, `stall-arancini` 3.45).

### Harness, audit and build

`npm run typecheck` passes. `npm test`: 24 of 25 harnesses pass, `italy-world.mjs` and `italy-reactions.mjs` among them; the one failure is `london-reactions.mjs` (`pub: pub-tin hides pub-slice from the arrival camera at azimuth 0.75`), in the Britain Stage D agent's files, which are uncommitted and being edited at the same time. The tree as committed here (HEAD plus only these Italy changes, checked out on its own) passes all 25 harnesses and the type check. `npm run build:pages` builds. `node scripts/audit/objects.mjs`:

```
rome: rooms=5 card-only-with-prop=12 hit/child=7
venice: rooms=4 card-only-with-prop=4 hit/child=0
sicily: rooms=4 card-only-with-prop=7 hit/child=3
```

### Live check (dev server restarted for a fresh load, own tab)

- **Entry.** `italy` arrives with the camera target on [-19, 0, -6], the Campo de' Fiori market; fog 198 / 439 after entry at 1280 x 720; the zoom limit is 215 and the table reads at it with no haze.
- **Roads.** Ten views along every road on the mainland, the four lagoon islands and Sicily: every ribbon continuous, the new lanes read as paths in front of the stands, nothing standing on a road.
- **Objects.** All forty-six opened through `__fw.open`. The thirty-three that are not rooms each open their own card with art and sources, apart from the aliases that are meant to open something else: `stall-cheese` opens the casale room, `trattoria` the trattoria, `pizzeria` the forno, and the other stall children their ingredient's card. No exception, no console error.
- **Rooms.** All thirteen open at 1280 x 720 and at 390 x 844, with no console error. At phone width the `sceneShot` composite in a hidden pane lays the effect layers out wider than the painting. That is a flaw in the capture tool, not the room: a real screenshot of `it_pasta` at 390 x 844 shows the painting, the touches and the controls correctly placed.
- **Seen from above:** the four lagoon islands carry their stands and boats but no house (below).
- Contact sheet (arrival, one stand mid-reaction per area, one room per area, the zoom limit): `italy-stage-d.png` in the Stage D agent's scratchpad; the raw shots are `.data/shots/it-d-*.jpg`.

### For the shared-ground pass

- **Over the water (nine, vertices):** `carciofoIt` 1,885 (over the Tiber), `ragu` 1,723, `lagunaIt` 220, `campanileIt` 145, `italyBeef` 126, `tomato` 121, `seafood` 102, `etnaIt` 9, `valliIt` 2.
- **Stand in front of stand (eighteen, rays of ten):** `oven<pasta` 9, `carciofoIt<ragu` 8, `vinoIt<ragu` 6, `italyChicken<cheese` 6, `vinoIt<quintoQuarto` 4, `sicilyMarket<friggitoria` 3, `sicilyMarket<pastry` 3, `olive<quintoQuarto` 3, `riceIt<casaVeneta` 3, `gelateria<romeMarket` 3, `bacaro<rialtoIt` 2, `tomato<friggitoria` 2, `lemon<tonnaraIt` 2, `quintoQuarto<ragu` 2, `carciofoIt<italy-bridge` 2 (the beds grown over the bridge ramp), `seafood<rialtoIt` 1, `etnaIt<capperiIt` 1, `carrettoIt<pastry` 1.
- **Footprints sharing ground (thirty-six; overlap, or clearance under 1):** `olive/mushrooms` 3.50, `ragu/quintoQuarto` 3.03, `cheese/italyChicken` 2.68, `pecoraIt/olive` 2.61, `olive/vinoIt` 2.53, `pecoraIt/mushrooms` 2.53, `cheese/italyBeef` 2.37, `romeMarket/basil` 2.27, `carciofoIt/vinoIt` 1.88, `mandorleIt/etnaIt` 1.85, `olive/quintoQuarto` 1.43, `seafood/rialtoIt` 1.31, `bacaro/rialtoIt` 0.87, `pasta/panteonIt` 0.80, `sicilyMarket/pastry` 0.79, `pasta/oven` 0.74, `friggitoria/sicilyMarket` 0.69, `vinoIt/mushrooms` 0.63, `romeMarket/pasta` 0.61, `vinoIt/quintoQuarto` 0.60, `romeMarket/gelateria` 0.56, `sicilyMarket/carrettoIt` 0.42, `rialtoIt/campanileIt` 0.40, `seafood/bacaro` 0.39, `oven/panteonIt` 0.32, `ragu/vinoIt` 0.29, `romeMarket/oven` 0.01, `capperiIt/etnaIt` 0.00; with clear ground under 1: `colosseoIt/panteonIt` 0.21, `sicilyMarket/tomato` 0.19, `pecoraIt/vinoIt` 0.40, `carciofoIt/quintoQuarto` 0.39, `italyChicken/quintoQuarto` 0.40, `casaVeneta/riceIt` 0.51, `ragu/carciofoIt` 0.70, `ragu/olive` 0.95. The Agro Romano's ten objects inside one road loop carry most of them.
- **Six off-road doors:** `ragu` 3.02 and `quintoQuarto` 2.23, whose fronts face a strip 1.8 wide between them and the casale's byre, with the Tiber east and the hen yard west, so no connected lane fits without moving an object; `granoIt` 5.80 and `campanileIt` 3.05, whose fronts face the shore; `tonnaraIt` 2.02, whose front is its pier on the sea; `stall-arancini` 3.45 (anchor), wedged behind the Ballarò market against Sicily's north shore. Close by: `stall-lemon` and `stall-tomato2` at 2.10 from IT-R4 (anchor), and `mushrooms`, whose front meets IT-R2 at 1.65 while its anchor is 4.59 away.
- **The lead's item: Venice's lagoon islands stand bare.** None of their four houses is built (`it-rialto-casa`, `it-rialto-magazzino`, `it-sanmarco-casa`, `it-burano-casa` are all `built: false` inside the stands' pads). They must come back by spreading the stands across the quays, and the island edges must read as quays (a stone fondamenta edge and mooring) rather than sand.

## Shared-ground pass, 2026-09-23

The Stage D list above, closed. The method was Spain's third, fourth and fifth passes: measure on the live page after a fresh load, move object anchors (a stand moves whole, with its stall children and its own building), then move, resize or re-site the decor round them, and re-run `italy-world.mjs` after every batch.

### What the live page measured

| Check (live page, fresh load, 1280 x 720) | Before (Stage D) | After |
| --- | --- | --- |
| Clickables 10 of 10 clear from the arrival camera | 21 of 36 | **36 of 36** |
| Stand-behind-stand rays | 18 findings over 15 stands | **0** |
| Stands with a vertex over water | 10 (live; 9 offline) | **0** |
| Footprint pairs under 1.0 of clear ground | 36 | **0** (closest pair 1.06) |
| Doors off the road (anchor over 2.6, front over 2.0) | 7 (5 fronts, 2 anchors) | **0** |
| Decorative houses standing | 6 of 13 | **13 of 13** |

`italy-world.mjs` holds all five ceilings (`OFF_ROAD`, `FRONT_OFF_ROAD`, `OVER_WATER`, `HIDDEN`, `CROWDED`) empty: any finding now fails. Its house count is thirteen (Rome four, Venice four, Sicily five) and its road count sixteen.

The one thing the live probe must skip is a bird: the lagoon gulls crossed one ray to the lagoon kitchen for a single frame on the first run. The three flocks are now named `italy-birds`, and the probe ignores them as it ignores walkers, because a passing wing hides nothing.

### Why the clusters had to be re-laid, not nudged

The rule underneath every move: a ray from a stand's front climbs 0.8 per unit towards the camera, so a stand of height *h* in front of another hides it unless the gap from the back stand's front to the front stand's back is at least 1.25 x (*h* - 0.8). A road between two rows is about two units, enough for a front row of stands up to 2.5 tall. So every cluster is now laid in rows along roads, with the tall stands (the trattoria, the pasta kitchen, the forno, the caffè at 6; the campanile at 7.2; the tonnara at 4.6) either at the back of their cluster or with nothing behind them in their own columns. The Agro Romano's ten objects could not fit on the west bank inside one loop at any spacing, so the cluster grew north onto the empty ground between the Tiber and the north coast, which is still west of the river and still the Agro.

### Rome: the piazza

| Object | Was | Now | Why |
| --- | --- | --- | --- |
| `gelateria` | [-24, -9.25] | [-23.4, -10.6] | North row of the street, with the forno and the pasta kitchen: the three six-unit buildings all stand behind the street, none in front of another |
| `oven` (+ `pizzeria`) | [-14.6, -9.25] | [-16, -10.8] | North row. The oven house keeps its offset, now [-18, -12.15] |
| `pasta` | [-14, -5.55] | [-8.9, -10.8] | From the south side (where it hid the forno on 9 of 10 rays) to the north row's east end |
| `romeMarket` (+ five stalls) | [-20.5, -5.55] | [-16.2, -5] | South side, far enough from the north row that its 2.6 canopy clears the forno's rays; the stalls move by the same offset and stay within 2.6 of the street |
| `basil` | [-25.8, -0.8] | [-24.9, -3.8] | South side west end, door on IT-R1b; out of the market's footprint |
| `panteonIt` | [-10, -9.7] | [-8.55, -2.6] | South side, in front of the pasta kitchen's column but 3.3 clear of its rays; off the pasta kitchen's and the forno's footprints |
| `colosseoIt` | [-5.5, -10.6] | [-3.06, -4] | South side east end; the via consolare runs behind it |

Houses: `it-piazza-palazzo` to [-5.3, -16.2], behind the street between the Tiber and the pasta kitchen; `it-piazza-casa` to [4.2, -3.8], east of the Colosseum; **`it-trastevere-casa` built** at [-13.6, 7.9] and **`it-campagna-casale` built** at [-25.4, 5.2], on the city's southern edge, each far enough south (5.9 and 4.8) that its roof clears every ray behind it. The obelisk, fountain and café tables stand between them in front of the Pantheon, the basilica south of the Colosseum, the triumphal arch and the Castelli vines on the slope east of the city, the Trevi fountain behind the street, and the sheepfold beside the casale.

Roads: IT-R1b re-laid along the south side's fronts from the via consolare to the herb bed; IT-R3 re-laid so the rice fields and the farm kitchen each have their own front; IT-R3b re-laid in front of the farm kitchen.

### Testaccio and the Agro Romano

The lower Tiber moved east by up to 3.8 (from [-30, -9.5] down, its mouth now [-29.2, 12]), which gives the west bank the width of two stands a row; the bridge is now at [-30.6, -5.9], square on the river.

| Object | Was | Now | Row, and why |
| --- | --- | --- | --- |
| `mushrooms` | [-43.5, -9.2] | [-42, -24] | North row, the chestnut wood in the north-west |
| `pecoraIt` | [-44.2, -6] | [-35, -24.2] | North row |
| `ragu` (+ `trattoria`) | [-35, -2.5] | [-27.85, -24.1] | North row: six tall, so it stands at the back with nothing behind it. It had hidden the artichoke beds on 8 rays and the wine cart on 6 |
| `quintoQuarto` | [-37.6, -2.4] | [-20.2, -24] | North row east end, on the river's north bank, next door to the trattoria: Testaccio |
| `olive` | [-41.5, -6.6] | [-42.9, -15.7] | Second row |
| `carciofoIt` | [-33.6, -8.2] | [-34.9, -15.9] | Second row, by the river; no longer over the Tiber or the bridge ramp |
| `italyBeef` | [-36.6, 5.9] | [-42.8, -8.2] | Third row, north of IT-R2 |
| `italyChicken` | [-43.4, 1] | [-35.6, -8.3] | Third row |
| `cheese` | [-40.6, 5.8] | [-39, 2.6] | Inside IT-R2's southern loop, 3.45 behind the third row's fronts; the byre stands east of it at [-33.3, 1.6] |
| `vinoIt` | [-38.5, -6.2] | [-12.5, -25.3] | On the wine road along the Tiber's north bank, under where the Castelli vines were |

Roads: **IT-R2n** (new, 1.8) runs in front of the north row and on along the north bank to the via consolare, so the mainland is one loop; **IT-R2m** (new, 1.6) in front of the second row, joining IT-R2n along the river. IT-R2's bridge end and loop were re-laid to the new bridge and to the casale's door.

### Venice

The four stands sit on quays with clear rays and **all four Venetian houses are built**. The quays were re-shaped (rectangles and inset rule both in `italy-landscape.ts`) and paved with Istrian stone right out to their edge, above the sand rim, with a 0.14-high darker kerb along the water: from above they read as fondamenta, not sand pads. No mooring posts were added, because no boat is tied up.

| Island | Was | Now |
| --- | --- | --- |
| Rialto quay | x 21 to 35, z -26.5 to -19.5 | x 20.1 to 41.3, z -31 to -19.6 |
| San Marco quay | x 23 to 35, z -16.5 to -10 | x 22.4 to 41.3, z -16.8 to -9.4 |
| Burano | x 10.5 to 19, z -28.6 to -23 | x 7.4 to 18.8, z -31.5 to -23.8 |
| Valli bank | x 12.6 to 20.5, z -17.5 to -11.2 | x 12 to 19.6, z -21.4 to -12.2 |
| Lido | x 38 to 41 | x 44.6 to 46.8 (the porto stays open between it and San Marco) |

| Object | Was | Now | Why |
| --- | --- | --- | --- |
| `seafood` | [24.5, -22.55] | [23.9, -26.2] | West of the bridge and set back behind the fondamenta, so the campanile's 7.2 tower in front of it clears its rays |
| `bacaro` | [30, -22.65] | [37.85, -23.9] | East of the bridge |
| `rialtoIt` | [27, -18] | [32.35, -18.1] | Between the two, with nothing in front of it on the San Marco side |
| `campanileIt` | [29, -12.3] | [24.8, -12.7] | San Marco quay's west end, its front on the riva (IT-R7); no longer over the water |
| `lagunaIt` | [13.8, -25.65] | [11.2, -27.83] | Burano, off the water |
| `valliIt` | [15.8, -14.55] | [15.2, -16.4] | The valli bank, off the water |

Houses: `it-rialto-casa` [31.1, -27.6] behind the bridge, `it-rialto-magazzino` [37.85, -28.75] behind the osteria, `it-sanmarco-casa` [38.1, -14.7] on San Marco in front of the osteria's column (5.9 clear of its rays), `it-burano-casa` [16.74, -28.2] beside the lagoon kitchen. Boat lanes L1 to L4 and the lagoon's shallow sheet follow the new quays.

The terraferma: `casaVeneta` [5.15, -16] to [0.5, -20.6] (the via consolare had run through it) and `riceIt` [1.5, -20.5] to [2, -14.2]: the low rice fields now stand in front of the farm kitchen instead of behind it.

### Sicily

The island grew west to x -30.8, east to x 42.6 and a little north between x -22 and -2; the strait is 4.38 at its narrowest, inside the 4.0 to 5.2 the harness holds. The north row holds the deep and tall stands facing the Albergheria lane and the coast road; the south row holds the low ones facing a south road; the tonnara stands alone at the east end with nothing behind it.

| Object | Was | Now | Why |
| --- | --- | --- | --- |
| `pastry` | [-4, 24.85] | [-24.3, 20.15] | North row. The fry shop and the pasticceria had stood in front of Ballarò and hidden it |
| `sicilyMarket` (+ three stalls) | [-8, 21.15] | [-14.1, 19.9] | North row; the street-food stall has its own back lane, **IT-R4d** |
| `friggitoria` | [-12.5, 24.85] | [-5.6, 20.15] | North row |
| `lemon` | [8.2, 19.6] | [10.02, 20.02] | North row |
| `mandorleIt` | [18.5, 19.8] | [17.4, 19.95] | North row, off Etna's footprint |
| `etnaIt` | [23, 19.2] | [24.85, 22.1] | East, where the island is deep enough; off the water. Its flank terrace, basalt tint, snow pit and lava walls follow it |
| `tonnaraIt` | [13.85, 27] | [33.2, 25.6] | The east end, with nothing behind it; its landing meets the quay road on IT-R5. The sheds stand at the cape, [39.2, 25.7], turned end-on |
| `carrettoIt` | [-1.5, 20] | [-24.98, 27.15] | South row |
| `tomato` | [-15.5, 19] | [-16.9, 26.4] | South row, off the water |
| `granoIt` | [4.2, 25.6] | [-10.16, 26.25] | South row, its front on the south road |
| `capperiIt` | [26.5, 26.5] | [0.55, 27.4] | South row, off Etna's footprint |

Houses: **`it-albergheria-casa` [0.04, 19.9] and `it-albergheria-torre` [4.34, 19.9] built**, in the north row between the friggitoria and the lemon grove; `it-coast-casa` [12.4, 26.6], `it-etna-casa` [18.2, 26.6] and `it-latifondo-masseria` [4.4, 26.8] in the south row, each low enough to clear the rays behind it. Roads: IT-R4 and IT-R5 re-laid, IT-R4b and IT-R4c re-laid as the spur and the south road, IT-R5b removed.

### The owner's view

Looked at on the live page at the overview, each cluster at approach zoom, the lagoon close up and the 215 zoom limit (contact sheet `italy-shared-ground.png` in the pass's scratchpad). What read wrong and was changed: a snow pit had landed south of Etna, in the open, where it read as a round hut, and was moved onto the flank behind the volcano; the masseria and the coast house were overlapping and were separated. What reads and was left: the sheepfold beside the campagna casale on the city's southern edge (the Agro begins at the walls), the lagoon's shallow sheet drawing a straight edge across the porto, and the tonnara's sheds read as a boathouse at the cape.

### Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | 25 harnesses pass, `italy-world.mjs` and `italy-reactions.mjs` with every ceiling empty |
| `npm run build:pages` | Builds |
| `node scripts/audit/objects.mjs` | Unchanged: rome 5 rooms, 12 card-only, 7 hit/child; venice 4, 4, 0; sicily 4, 7, 3 |
| Live probe, dev server restarted, own tab | 36 of 36 clear, 0 over water, 0 pairs under 1.0, 13 houses |
| `__fw.audit(60)` | Nothing new walks into water or a wall except as noted below |

Left, and why: the movement audit counts the walker crossing the Rialto as in the water at the bridge's crown, because its deck heuristic does not recognise the arched deck; the walker is at deck height. The wine cart's box touches the Tiber bridge's east ramp for a few samples where the piazza street meets the bridge, as it did before the pass. The osteria's own figures touch its own counter, inside `props-italy.ts`.

Not verified in this pass: the rooms (nothing in it touched a room), phone-width views of the world, and the published site.

## Stage E review, 2026-09-23

Second reviewer, who built none of the Italy files. Every line of the playbook's section 5 is recorded below as **pass**, **fail** or **not verified**, with the evidence. Nothing was changed in any code, scene, ambience or object file; this section and the walkthrough list below are the only edits.

**How it was run.** `npm run typecheck`, `npm test` and `node scripts/audit/objects.mjs` on the working tree as it stood (HEAD `144dabf` plus other agents' uncommitted Thailand and Vietnam edits). The dev server `food-tour-web` was restarted through the preview tool, and the page was loaded fresh in the reviewer's own tab with the Recipes add-on off (`food-tour:recipes` unset). Other agents' edits made Vite full-reload the page three times in the first half hour, so the page was then loaded from an image URL with the app's own markup injected and `WebSocket` stubbed before `main.ts` ran: the same modules from the same server, a fresh boot, and no HMR client able to reload it. The pane was hidden for most of the session, so the world and the rooms were advanced with `__fw.step` at 1/60 s and read through `__fw.shot`, `__fw.sceneShot`, the rooms' own effect canvases and, at 390 wide, a composite of painting, effect canvas, fire ellipses and visible hung sprites built from the live DOM. Shots are in `.data/shots/it-e-*.jpg`; the contact sheet is `italy-review.png` in the reviewer's scratchpad.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | **23 of 25**. `italy-world.mjs` (8.3 s) and `italy-reactions.mjs` pass, and so do the other 21. `thailand-world.mjs` (`TH-R3: the road surface reaches water at -16.1, 22.8`) and `vietnam-world.mjs` (three road ends that meet nothing) fail in files other agents are editing and have not committed |
| `node scripts/audit/objects.mjs` | rome 5 rooms, 12 card-only, 7 hit/child; venice 4, 4, 0; sicily 4, 7, 3. Unchanged from the shared-ground pass |
| Live ten-ray check, fresh load, 1280 x 720, every mesh in the world a blocker (walkers, boats and birds included) | **35 of 36 at 10 of 10.** `gelateria` 9 of 10: the moving wine cart crossed one ray in that frame. No house, tree, stand or stand building covers any ray |
| Fog and zoom limit | Desktop limit 215 reached; fog 198 / 439; the table reads at 215 with no haze on the far corner (sheet, top left) |
| Room cues at 390 x 844, maximum lit pixels on each room's own effect canvas over 600 stepped frames (10 s) | Every configured signature, patch and steam source draws: smallest are the thin pours and drips (`it_tonnara` glint 202, `it_casale` drip 254, `it_bacaro` glint 387) and the Pescaria's portrait birds (448). Every portrait fire ellipse is present and lit (opacity .50 to .69). Every visible portrait sprite lies inside x 17 to 339 of 390. The measured band is x .094 to .906 of the portrait painting in all thirteen rooms |
| Room cues at 1280 x 720, same method | All draw; the figures match `docs/italy-rooms.md` within sampling (for example `it_trattoria` glint 11,256 against 11,256, sunray 347,259 against 341,503) |
| Motion re-measured (cells that looked doubtful), four phased pairs, `room-motion.py` | **`it_casale` wide: 1.2, 1.2, 3.7, 3.8, median 2.45 percent** against its 3 percent floor (the rooms doc has 3.08, with 0.92 at its weakest phase). `it_bacaro` wide: 3.3, 3.9, 5.9, 6.9, median 4.9, clears |
| Fountains, sampled over 15 frames in the live world | `piazza-fountain` and `trevi-fountain` never change. Calling each one's own `userData.tick` by hand does move its jets, so the builders work and the world does not tick them |
| `__fw.audit(30)` | Listed in the walkthrough, item 30 |

### The definition of done, line by line

World

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| W1 | Four or more clusters, continuous roads, every door on a road | Pass | Six clusters; `italy-world.mjs` holds the per-landmass network reading (mainland, Sicily and each lagoon island), zero doors off the road |
| W2 | Water continuous, square at the edge, correct colour; nothing stands in water | **Fail** | Square and continuous, and nothing stands in it (live, 0 over water). The lagoon's shallow sheet ends in a hard diagonal across the porto that reads from above as a glass wedge standing in the sea (walkthrough 1). *Second walkthrough, 2026-09-23: still fail.* The sheet is feathered but still reads as a pale straight-edged band, and it tints the San Marco quay (second walkthrough, open 1 and new 52). *Fixes, round two, 2026-09-23: pass.* Lead ruling: the sheet is gone and the sea is one material; the harness now requires `lagoon-shallows` to be absent. The quay stone shows plain at approach 24 and the lagoon reads from its islands and boats at approach 40 (round two, 1 and 52) |
| W3 | Every river runs source to mouth | Pass | `italy-world.mjs`: the Tiber rises inside its spring pool and overlaps the sea at the mouth |
| W4 | Ten stands, five ingredient stops with diamond cues, three non-food clickables per area | Pass | 13 rooms, 15 stops, 8 landmarks; every one of the 36 has its cue ring; per area rome 4, venice 3 (`rialtoIt`, `campanileIt`, `valliIt`), sicily 3 or more |
| W5 | Three walker loops, residents in traditional clothing, steps matched | **Fail** | Five loops, 24 walkers, gait checks pass. But every clothing profile in `italy-people.ts` is `verified: false` and the harness asserts it: the traditional clothing is still unsourced |
| W6 | Small details in every cluster | Pass | Hung swaying groups in the stand builders (salumi rail, market bunches, nets, the slaughterhouse quarters), sheep fold, pig and ox pen, hen yard, stacks and crocks seen at approach zoom |
| W7 | House cap, nothing solid on a road, 2.5 corridors, no house on the camera line | Pass | 13 houses (4, 4, 5), one to three per style; `italy-world.mjs` passes every road, corridor and wedge check. *Lead ruling, 2026-09-23:* the line now reads at most five per area id, each where it hides no stand; 4, 4 and 5 across `rome`, `venice` and `sicily`, none on a stand's rays, passes under it as written |
| W8 | Every clickable fully visible from the arrival camera, live | Pass | 36 of 36 clear of every static blocker on the live page; the one short ray is the moving cart |
| W9 | Every decor type reads as what it is from the overview | **Fail** | Walkthrough 1, 2, 4 to 8, 10 to 12, 20 to 22. *Second walkthrough, 2026-09-23: still fail* on the lagoon sheet, the edge-on triumphal arch, the two awning houses and the grano wheat (open 1, new 52 to 55); the other decor items of the first list now read. *Fixes, round two, 2026-09-23: pass.* The sheet is gone, the arch faces +z with its opening in view at approach 20 and 42, the awnings hang on wall brackets with nothing on the ground, and the standing wheat is one low textured crop, out of the friggitoria's approach and only a low edge in the corner of Ballarò's at 1280 x 720 (round two, 53 to 55) |
| W10 | The table reads at the zoom-out limit, fog derived | Pass | 215, fog 198 / 439, sheet top left |
| W11 | Translating figures step; carried figures seated; animals face travel | **Fail** | Gait and mule checks pass in the harness and live (both mules and every hull travel along their own axis; the cart holds 2.06 to 2.10 behind its mule). But the rowers stand upright in the moving gondolas and sandoli (walkthrough 17), which is the letter this line was written against. *Second walkthrough, 2026-09-23: pass.* Every rower seen sits at the stern with the oar sweeping; `__fw.audit(60)` clean |
| W12 | Every water feature ticks; smoke tinted, anchored and visible at the overview | **Fail** | Sea, Tiber and spring shaders tick; smoke reads at the 110 overview. The piazza fountain and the Trevi fountain never move (walkthrough 14). *Second walkthrough, 2026-09-23: pass.* Both fountains tick live (16 of 22 and 23 to 24 of 54 meshes change per tick); smoke visible at the 110 overview |
| W13 | Every motion watched ten seconds and plausible | Not verified | The pane was hidden; the world was stepped and sampled, not watched in real time. What sampling found is in the walkthrough |
| W14 | No flicker, nothing floating, no unsupported seat, no wall crossing | **Fail** | `__fw.audit(30)`: boats through boats, walkers through walkers, the mule and the cart through walkers and the market (walkthrough 3, 30). Flicker not looked for. *Second walkthrough, 2026-09-23: pass on crossings.* `__fw.audit(60)` after a fresh load: 51 movers, no violations. Flicker still not looked for |

Stands

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| S1 | Each main stand meets the hotpot table | Not verified | Not counted stand by stand (people, lanterns under a beam, steam at the hot source) |
| S2 | Fronts face +z, door within 2.0 of a road | Pass | `italy-world.mjs` asserts rot within ±0.75 and every front door |
| S3 | Food first, worker, bystander, speech; readable after the 1.6 s approach | **Fail** | The harness order passes. On the live room approach at 1.6 s the pasta kitchen's camera ends inside the Pantheon and the forno's under the Campo pergola, so neither reaction can be seen (walkthrough 26, 27). *Second walkthrough, 2026-09-23: pass.* The pasta kitchen, forno and trattoria room approaches end on a clear counter with the reaction in view at 1280 x 720 and 390 x 844 |
| S4 | Repeated clicks bounded, return to rest | Pass | `italy-reactions.mjs` |
| S5 | Ambient speech in the local language plus English; bubbles never overlap | Pass | `italy-reactions.mjs` checks four to eight two-language lines per stand. Bubble overlap was not measured live (bubbles did not register in the hidden pane), and the native-reader check of the lines is still open from Stage A |
| S6 | `italy-reactions.mjs` covers every stand and passes | Pass | 36 stands, passes |

Rooms

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| R1 | Two paintings each, art direction | Pass | Stage B acceptance, all 26 on disk at 1672 x 941 and 941 x 1672 |
| R2 | Alive on entry, three or four loops, hot food steams, `room-loops.mjs` | Pass | `room-loops.mjs` passes, every room at four in both orientations |
| R3 | Every hot vessel has its own steam source; cold stays dry | **Fail** | `it_laguna` wide: the bowl of rice and peas at the front right is dry while the rice copper steams, and the rooms record does not list it as cold (walkthrough 42). *Second walkthrough, 2026-09-23: pass.* The front bowl steams in both orientations (lit in its box on the live effect canvas) |
| R4 | Steam needs a hot vessel and a hot process in the text; drip otherwise | Pass | Six cold rooms carry no steam or fire; `it_casale` drips |
| R5 | Traced liquid paths lip to surface, checked live | Pass | Lit pixels confine to the configured boxes in both orientations (for example `it_trattoria` 11,256 wide, 4,494 portrait); endpoints taken from the rooms record, not re-measured on the pixels |
| R6 | Hanging motion is a sprite over a clean painting | Pass | No breeze crop; six delivered sprites |
| R7 | Every delivered sprite used or explained | Pass | All six used |
| R8 | Every path and box measured on a gridded crop and checked on an overlay contact sheet | Pass (2026-09-23) | `docs/italy-rooms.md` now names the sheet under "Overlay sheet": `.data/shots/italy-rooms-overlay.png`, both orientations of all thirteen rooms with the phone heading and every measured box and hook drawn over the painting |
| R9 | Every phone box and sprite inside the band, lit live | Pass | Table above: every portrait cue lit, every visible sprite inside the band |
| R10 | Motion capture re-run after the last cue change; the baseline carries the numbers | Pass (2026-09-23) | `docs/quality-baseline.md` "Visible idle motion" row and its 2026-09-23 "Changes" entry now carry all thirteen rooms' wide and portrait medians; none is under its floor, the two lowest are `it_ballaro` wide (3.45) and `it_pasticceria` portrait (3.60) |
| R11 | 3 percent in two seconds, or 2.5 with a crisp cue | **Fail** | `it_casale` wide re-measured at a 2.45 percent median. *Second walkthrough, 2026-09-23: pass.* `it_casale` wide re-measured on six pairs across the cycle: median 3.7 percent |
| R12 | Two or three touches naming something visible, with facts and sources | Pass | Three per room, 39, from `ITALY_DISCOVERIES` |
| R13 | Every effect stays on its source; nothing invented | **Fail** | The Pescaria's haze band lies across two faces in both orientations; Ballarò's portrait leaves drift over the cathedral dome; the casale's portrait leaves over the door; the trattoria's portrait salami hangs across the oste's face (walkthrough 32 to 34, 37, 38). *Second walkthrough, 2026-09-23: pass.* The Pescaria haze, the Ballarò leaves and the casale leaves sit on their sources and the trattoria portrait hangs nothing; the new overlaps of leaves and a gull with room buttons are walkthrough items 58 to 60 |
| R14 | Reduced motion keeps the room understandable | Not verified | Not tested here or in the rooms record |

Cards and stories

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| C1 | Tagline and three-to-five-paragraph blurb, dated eras, local names | Pass | Every object has a tagline and a local name. Room blurbs run 2,782 to 3,192 characters in six paragraphs, one over the line's five; Spain's shipped rooms run seven, so the band is being read in characters. *Lead ruling, 2026-09-23:* the line now counts the blurb proper, three to five paragraphs, with the story depth appended below it; Italy's rooms are three paragraphs of blurb and three of story depth, so they pass as written |
| C2 | Every kitchen room and place-or-dish shows its repertoire | Pass | Opened live: 13 rooms' cards, `gelateria` and `stall-arancini` ("How it is served") |
| C3 | Card-only blurbs in their band | Pass | All 23 card-only objects 905 to 984 characters in three paragraphs, and the ten children 864 to 999; none visibly shorter than its neighbours |
| C4 | Room objects have story depth, sources and two `NEXT` | Pass | `ITALY_STORY_DEPTH`, `ITALY_SOURCES`, two `ITALY_NEXT` each |
| C5 | World intro passes `world-intros.mjs` | Pass | In `npm test` |
| C6 | Legends labelled | Pass | The Etruscan artichoke, the panelle, cassata and cannolo origins are all written as legend |
| C7 | Recipes off | Pass | Walkthrough made with the add-on off; no "Related recipes" row on any card opened |

Verification record

| # | Line | Verdict | Evidence |
| --- | --- | --- | --- |
| V1 | typecheck, test, `build:pages` | **Fail** | Typecheck passes; `npm test` is 23 of 25 on this working tree (Thailand and Vietnam); `build:pages` was not run in this review |
| V2 | Screenshots of the world, each stand and each room at both sizes | Pass (2026-09-23) | All 36 stands now have their own arrival-camera shot at both sizes, `.data/shots/italy-stands-wide.png` (1920x1080, 1280x720 aspect) and `italy-stands-phone.png` (1170x2532, 390x844 aspect), rendered through `italy-prop-audit.html` on the dev server; see this file's "Verification record" below |
| V3 | Animation inventory table | Pass (2026-09-23) | This file's "Animation inventory" below carries one row per stand (36) with its always-on loop, its click reaction and, for the thirteen that open one, its room's signature |
| V4 | Pages run and live URL | **Fail** | Italy is not published; this is Stage F |

**Count: 26 pass, 16 fail, 3 not verified, of 45 lines.** Failed: W2, W5, W9, W11, W12, W14, S3, R3, R8, R10, R11, R13, V1, V2, V3, V4. Not verified: W13, S1, R14.

## Owner walkthrough (second reviewer), 2026-09-23

Everything that looked odd, in plain words, not yet sorted into defect or not. Sizes: overview is the 110 distance at 1280 x 720; approach is 20 to 42 at 1280 x 720; card approach is the 28-unit glide after a click; room approach is the 1.6 s low camera before a room opens. Pictures for the items marked (sheet) are on `italy-review.png`.

World, from above

1. `lagoon-shallows`, overview and approach: the pale shallow-water sheet ends in a hard straight diagonal across the porto between San Marco and the lido, and reads as a tilted glass pane or glass wedge standing in the sea (sheet)
2. `italy-bridge`, the Tiber bridge at [-30.6, -5.9], approach 42: a long white staircase with dark grey slabs at both ends, wider than the river it crosses (sheet)
3. `wine-cart`, approach 42: seen stopped against the Tiber bridge's east ramp where the piazza street meets it; the movement audit also puts it through the Campo market's corner at [-17, -7.8] and through walkers (sheet)
4. `etnaIt`, overview and card approach: a small white cone with an orange top and a grey ball of smoke on a low green mound, lower than the Apennine cones across the strait, with three people standing on it; it reads as a bonfire or a pot on a fire, not a volcano (sheet)
5. `lava-wall`, three rows south of Etna, approach 42: black blocks lying in the grass, read as black bars or logs
6. The tonnara's `stand-building` sheds at [39.2, 25.7], overview and approach: two red roofs almost on the ground at the east cape, a roof with no house under it; the flat orange-roofed box beside the coppers reads as a crate (sheet)
7. `italy-boat-ferry` on L5, overview and card approach: its square white sail reads as a billboard standing on the water beside the tonnara shore (sheet)
8. `rialtoIt`, approach 40 and card approach: a white box with steps and two grey roofs sitting across the canal; no arch reads from above, and the gondolas pass through it (the audit counts them inside it on 56 and 39 samples) (sheet)
9. `campanileIt`, approach 40: no taller than the red houses beside it; it does not read as the tallest thing in Venice
10. `sheep-fold` beside `it-campagna-casale` at [-25.4, 5.2], approach 42: a ring of standing stones with sheep inside, reads as a stone circle (sheet)
11. `campagna-thistle`, 36 of them, approach 42: purple-topped dots over every lawn and road verge in the Agro, read as purple pebbles
12. The five Campo stall children drawn by `romeMarket`, approach 42 and the market's room approach: five bare coloured tables standing in the grass behind the canopy, most with nothing on them, read as empty picnic tables
13. `trevi-fountain`, approach 42: squeezed into the one-house gap between the forno and the pasta kitchen, it reads as a white wall and a pool at the end of an alley
14. `piazza-fountain` and `trevi-fountain`: they never move. Both are placed through the `scaled` holder in `italy-town.ts`, and their own jets animate only when their tick is called by hand
15. `italyBeef`, approach 42: the ox is nearly as big as the pigs' shelter and far bigger than the people beside it
16. The valli bank (`valliIt`), approach 40: loose stakes and poles lie and stand about on the island, and a pole rises out of a Burano boat; sticks
17. The rowers in the gondolas (L1) and sandoli (L2), approach 40: they stand upright in moving boats
18. `colosseoIt`, approach 42: a heap of black shapes lies on the arena floor at its south-east side
19. The San Marco quay, approach 40: a large empty pale square with small grey scraps scattered on it in front of the campanile
20. `riceIt`, approach 40: a dry walled garden with green spikes and round straw hats; no flooded water shows
21. `maize-field`, two strips by the farm kitchen, approach 40: brown stripes that read as wooden decking
22. `granoIt`, approach 40: a wooden frame with a lantern hanging from its crossbar reads as a gallows
23. `mandorleIt`, approach 20: a thin yellow pole stands upright among the almond trees
24. `italy-birds`, approach 20: close up the birds are black V shapes the size of a house hanging at roof height over the lemon grove
25. `quintoQuarto`, card approach: the roofs of the caffè, forno and pasta row fill the lower half of the frame in front of the slaughterhouse
26. `pasta`, room approach at 1.6 s: the camera ends inside the Pantheon's dome; the frame is grey and the kitchen is never seen (sheet)
27. `oven`, room approach: the camera ends under the Campo market's pergola; its beams cross the top of the frame and market people stand in front of the forno's counter (sheet)
28. `ragu`, room approach: a cypress covers the right end of the counter
29. `lagunaIt`, room approach: a rower and his oar in a passing boat cross in front of the counter
30. `__fw.audit(30)`: two sandoli on L2 pass through each other at [12.9, -22.4] (48 samples); a gondola passes through the market barge at [24.9, -18.4]; walkers pass through each other on the Albergheria lane at [-16.3, 23.2] (18) and on the piazza street; the wine cart's mule walks through piazza walkers; the osteria's own figure is inside its counter
31. `gelateria`, live ray check after the fresh load: 9 of 10, the passing wine cart on one ray

Rooms

32. `it_pescaria` wide, 1280: the lagoon haze band lies across the fishmonger's head and the man behind him, and their faces look washed pale (sheet)
33. `it_pescaria` portrait, 390: the same band crosses the fishmonger's cap
34. `it_trattoria` portrait, 390: the hung salami hangs across the oste's face (sheet)
35. `it_friggitoria`, both, 1280 and 390: the striped awning scrap hangs in mid-air under the canvas over the lane, like a flag in the sky
36. `it_ballaro` wide, 1280: a striped cloth on a chain dangles in the sky in front of the cathedral (sheet)
37. `it_ballaro` portrait, 390: the palm leaves drift across the cathedral dome and the sky, away from the palm
38. `it_casale` portrait, 390: the olive leaves float over the wooden door and the wall instead of the tree; in the wide some cross the door jamb (sheet)
39. `it_market` portrait, 390: the awning scrap hangs behind the heading and over the story button (sprite x 75 to 162, y 82 to 125; heading y 64 to 94, button y 110 to 143)
40. `it_bacaro` and `it_pasticceria` portrait, 390: the lamp's chain crosses the heading line (lamp y 67 to 139)
41. A painted iron hook hangs empty at the top of the frame in `it_forno` (both), `it_trattoria` wide, `it_market` wide, `it_pescaria` (both), `it_laguna` (both), `it_casale` portrait, `it_ballaro` portrait and `it_tonnara` (both)
42. `it_laguna` wide, 1280: the bowl of rice and peas at the front right is dry while the rice copper steams
43. `it_market`, both: courgette flowers and summer squash sit in the crate beside the winter artichokes
44. `it_veneto`, both: two small children sit at glasses of red wine
45. `it_pasta` wide, 1280: the ribbons hanging from the cane sprite come down almost into the ribbons the woman is lifting, so they read as one long strand from the rail to her hands
46. `it_casale` wide, 1280: re-measured at a 2.45 percent median, under its 3 percent floor; on two of four phases the room changed 1.2 percent in two seconds
47. Every room was stepped through ten seconds and read in stills; no pour was seen to crawl and no glint was seen above a lip, but no room was watched in real time (see "not verified")

Cards

48. `stall-arancini`: the card says three things come off the barrow, all fried, and its "How it is served" list includes sfincione, a baked bread
49. `pastry`: its "What this kitchen cooks" list names "Frutta martorana", which the owner ruled off the pasticceria card on 2026-09-22
50. `stall-tomato`, a stall in Rome's Campo de' Fiori, opens the card of Sicily's tomato beds (`tomato`, tagged SICILY)
51. The ten stall and alias children carry blurbs of 864 to 999 characters that are never shown: each opens its parent's or alias's card or room instead

### Not verified in this review

- Real-time watching of any room or of the world in a displayed pane (the pane was hidden; everything was stepped and read from stills and canvases). Pours, glints, string swings and cups that should steam were judged from stills only.
- Reduced motion; flicker while moving or zooming; speech-bubble overlap live; the hotpot-table count per stand (S1); the traced-path endpoints on the pixels.
- Each stand's reaction at full size: the 36 click shots (`.data/shots/it-e-r2-*.jpg`) were read at thumbnail size for occlusion only.
- `npm run build:pages`, and the published site (Italy is not published).
- The Thailand and Vietnam failures in `npm test`, which belong to other agents' uncommitted files.

### Fixes, cards, 2026-09-23

- 48 (`stall-arancini`): the "How it is served" list is now the three fried things the blurb names — arancine, pani e panelle, cazzilli; sfincione is off the barrow. The same contradiction on the sister card is fixed too: `friggitoria`'s blurb said "Everything this shop sells is fried" over a list with sfincione, stigghiola and quarume, and now says nearly everything comes out of that pan.
- 49 (`pastry`): the "Frutta martorana" entry is removed; the list is seven entries, cannoli first. Blurb, story depth, discoveries and repertoire name no martorana (the blurb's unnamed "tray of small sweets for the second of November" stays). One customer speech line in `italy-speech.ts` still orders "frutta martorana"; it is a room line, not card text, and that file's own note keeps it out of the ruling.
- 50 (`stall-tomato`): the alias to Sicily's `tomato` is removed; the Roman stall opens its own card (Rome, Cirio sources, the passata and fresh-crate blurb) with the Campo market's picture as its art.
- 51: two children open their own card and keep their blurb — `stall-tomato` (above) and `stall-arancini` (never aliased; keeps its rendered three-rice-ball badge). Eight keep their alias and lose the dead blurb, because each blurb said again what the alias's card says: `stall-cheese` → the casale, `stall-salumi` → the pig and the ox, `stall-herbs` → the herb bed, `stall-oil` → the olive mill, `trattoria` → the trattoria, `pizzeria` → the forno, `stall-lemon` → the lemon grove, `stall-tomato2` → the tomato beds. Their taglines and source lists are left in place, unused.
- Card pictures against dish lists: all thirteen card pictures read against their lists. One line was contradicted and is fixed: `casaVeneta`'s liver with onions said "cut very fine" beside a picture of liver in thick pieces, and now says "cut small and cooked fast". Three cards show a dish that is not their list's hero (laguna's picture is moeche, second; friggitoria's is pani e panelle, second; Ballarò's is the swordfish, fourth). Nothing contradicts them, so no order was changed.
- Harness: `npm run typecheck` clean; `npm test` 23 of 25, `object-ids.mjs` "430 objects, every id unique, every alias and parent resolves", `repertoire.mjs` "142 places declare 749 dishes (26 with a recipe); 88 kitchen rooms all covered"; the two failures are `thailand-world.mjs` and `vietnam-world.mjs`, in other agents' uncommitted files. The thirteen changed and aliased cards were rendered through `ui.ts` `showObject` in Node, resolving the alias the way `main.ts` `openObject` does, and each showed the intended card, art and sources. The dev-server check in the Browser pane was not run: the pane was at its tab cap and no tab of this agent's own could be opened.

### Fixes, stands, 2026-09-23

Stand maker's items, `src/fw/props-italy.ts` and `scripts/tests/italy-reactions.mjs` only. Contact sheet `italy-fix-stands.png` in the fix agent's scratchpad; shots `.data/shots/it-sf-*.jpg`.

- 4 (`etnaIt`): rebuilt as a concave basalt cone, summit 8.2 (crater rim) with a thin smoke plume bent east to 9.3, snow and ash over the upper third, a black lava tongue down the south-east flank, and at its foot the snow trade (a round stone neviera, straw-wrapped snow blocks, a mule under snow panniers, a cutter, a muleteer and a boy) and a two-course lava-stone wall. Nobody stands on the cone; the reaction is still the plume (swells, darkens, leans east, crater flares). Height against the ridge: 2.0x the two Apennine cones across the strait (4.0, 3.4), 1.5x the tallest cone (5.4), 1.27x the highest hilltop with its terrace (6.45). Two limits held it there: the base must keep a unit clear of `mandorleIt` and `tonnaraIt` (it is 6.65 across, x 21.50 to 28.15, and 7.0 deep, dry on the north coast by 0.4 to 0.6), so it is steeper than broad; and a plume centre above about 9.6 leaves the 34-degree frame of the card approach (28 units at the arrival pitch), so a summit of 10.8, twice the tallest cone, would put the reaction off screen. The Builder's `lava-wall` at [25.2, 18.4] and the black-sand discs now lie under the cone.
- 6 (`tonnaraIt`): the flat orange-roofed box beside the coppers is replaced by a long low salting shed (rubble stone, lime-washed, 1.9 x 3.0, pantile roof with its ridge running back, gable end-on to the camera with its door to the landing and the road) east of the coppers, with four hooped barrels along its west wall, nets on a drying rail with cork floats on its east wall and a net heap by the door. The two-roofed `stand-building` at [39.2, 25.7] is `tonnaraShed()` in `italy-architecture.ts`, the Builder's file, and is not touched here.
- 8 (`rialtoIt`): rebuilt as one segmental stone arch from quay to quay (15 separate voussoirs, springing 0.9 above the table at 1.85 either side of the lane, intrados radius 1.92), stepped spandrels and deck to a crown of 2.85, balustrades on both outer walkways, two rows of three shops each side of the crown with lead roofs stepping down, and the portico with its pediment at the top. **Clear height for the Builder: soffit 2.30 over lane L1 at z -18.1, at least 2.25 within 0.4 of it, 2.13 at 0.8, 0.90 at the springing (z -19.95 and -16.25).** The bridge's own gondola is removed (the lane's gondolas pass under it). Live audit: no gondola inside the bridge. For the Builder: `italyBridgeLift` still lifts the IT-R7-1 walker to a flat 0.9 across the span, which now puts him in the open arch; `rialtoDeckY(dz)` is exported from `props-italy.ts` with the real step profile.
- 9 (`campanileIt`): a slender brick shaft (1.12 square) with pilaster strips, open Istrian-stone belfry, brick attic with roundels, green copper spire and gilded angel, 7.84 to the angel's head: the tallest thing on the table after Etna (next: the palazzo 7.12, the Albergheria tower 7.09; the San Marco houses 5.39). The tower stands back on the quay; the Pescaria's rays pass over its shoulder. The big bell now swings across the south opening. The pigeons on the quay (grey scraps from above, item 19) are removed.
- 12 (`romeMarket`): the five stalls stood empty because each produce mesh was added with `add(s, o, 0, 0, 0)`, which reset it to the stall's floor under the trestle. Each stall now has its produce on the cloth (oil flasks and an olive crock; two crates of tomatoes; pecorino wheels, a cut wedge and a ricotta basket; sausages and a ham; three baskets of herbs), a cloth that hangs down the customers' side, and a seller inside the horseshoe facing out. The stalls stand on the Campo's own paving (9.3 x 4.83, from the piazza paving's edge to 0.25 short of IT-R1b, a unit clear of `basil` and the moved Pantheon). To keep the room at nine people the shopper, the nonna and the child went.
- 15 (`italyBeef`): the ox is scaled 0.68 long, 0.56 high, 0.6 wide: withers at 0.86, a figure's shoulder.
- 18 (`colosseoIt`): the heap was the resting swift flock, nine black birds bunched at 1.75 in front of the south wall, which projects onto the arena floor from above. At rest the swifts are now in the arcades and not drawn; the click still sends them out in the spiral.
- 30 (`bacaro`): the audit's walker was the osteria's pacer, whose path at z 0.2 ran through the big cask on its stand; it now paces behind the cask at z -1.3. The second drinker stood inside the counter's footprint and is moved to the counter's east end; the man at the door steps past the east wall. Also fixed from the same live audit: the tonnara's walker ran through the pole man, who is moved off his line.
- S1, counted on the built stands (people / lamps hung on the front beam / beams / steam and smoke points): `trattoria` 7 / 2 / 1 / 1 steam, 1 smoke; `italyMarket` 9 / 2 / 1 / cold; `pastaWorkshop` 7 / 2 / 1 / cold; `pizzeria` 7 / 2 / 1 / 1, 1; `dairy` 6 / 2 / 1 / cold, no fire; `fishMarket` 7 / 2 / 1 / cold; `bacaro` 7 / 2 / 1 / cold; `buranoKitchen` 6 / 2 / 1 / 1, 1; `venetoFarm` 6 / 2 / 1 / 1, 1; `friggitoria` 6 / 2 / 1 / 1, 1; `sicilyMarket` 7 / 2 / 1 / cold; `pasticceria` 6 / 2 / 1 / cold; `tonnara` 7 / 2 / 1 / 1, 1. Every room has one walker whose legs step. Every room is inside six to nine and has its two lamps on its beam. One shortfall against "one steam point per hot source": the tonnara's three coppers share one steam point over the middle copper, because a prop carries one `userData.steam`.
- Harness: `italy-reactions.mjs` now measures each object against the arrival it really gets in `main.ts`: room objects the 1.6 s room flight, card-only objects the 28-unit card glide at the arrival pitch with the 5-unit bias. The room flight was what had held Etna to a 2.7 mound. All 36 pass: "36 Italy stands for 46 objects ... 34 lamps on real beams ... an exact return to rest". `italy-world.mjs` passes (ten rays, over-water, shared footprints). `npm run typecheck` clean; `npm test` 23 of 25, the two failures `thailand-world.mjs` and `vietnam-world.mjs` in other agents' files. Live, fresh load in the fix agent's own tab at 1280 x 720: 36 of 36 clickables clear of every static blocker; `romeMarket` and `italyChicken` each lose one ray to the moving wine cart or mule. `__fw.audit(30)` names no stand of this file except the tonnara walker fixed above.
- Not verified: the Etna, tonnara and colosseum fixes after the final reload (the last reload checked Venice and the Sicily overview only); phone width; watching any stand in real time (stepped frames); reduced motion; the Rialto from the far west end of the orbit; whether the Builder's IT-R7 walker lift is changed.

### Fixes, world, 2026-09-23

Builder's items, `italy-landscape.ts`, `italy-town.ts`, `italy-countryside.ts`, `italy-people.ts`, `italy-architecture.ts`, positions in `italy-objects.ts`, and the shared `birds()` in `props.ts`. Contact sheet `italy-fix-world.png` in the fix agent's scratchpad; shots `.data/shots/itfx-f-*.jpg`.

- 1 (`lagoon-shallows`): fixed by feathering. The sheet keeps its ring and its island holes, but its alpha falls to nothing over the last 4 units before each edge that crosses open water (the porto from [35, -6] to the lido, the gap north of the lido, the channel west of Burano), in the material's own fragment shader. No straight edge is left across water; the sea shader is untouched.
- 2 (`italy-bridge`): rebuilt in `stoneBridge()`: one segmental arch clearing 3.0 over the 2.4 river, abutments to 5.0 of stone in all, knee-high parapets with a coping, warm peperino instead of travertine, no sett stripes, and graded road-coloured ramps of 1.2 each end to the deck at 0.9 (the harness holds `BRIDGE_DECK_Y` at 0.9). The deck is its own thin slab, which the movement audit reads as a deck.
- 3, 30, 31 (movers): fixed. The carter, mule and wine cart and the Agro mule now walk closed loops (`italyTeam`): out on one side of the road, a U-turn, back on the other, each at a fixed distance behind the other, the cart trailing its mule at a fixed straight-line distance with its shafts toward it, stopping at each end. The cart runs on the via consolare (IT-R3, x 7, z -14 to -18.4), where no clickable's arrival ray crosses; the Agro mule's loop is IT-R2 x -38.9 to -42.4, west of the chicken yard's rays. Walker pairs keep two strips 0.65 apart on the south half of the street; the piazza and IT-R7 walkers stop short of their shared corners; the Rialto fondamenta walkers keep 0.35 south; IT-R7's walkers left the bridge (see the Rialto note below). Boats: two per multi-boat lane, half a cycle apart, meeting only at the lane's midpoint and keeping right there; the gondolas (L1) run the Grand Canal under the new Rialto and on up the channel inside the lido, the bragozzi (L4) sail out of the porto into the open Adriatic; hulls now travel bow first. Live `__fw.audit(60)`, fresh load: **no violations** (44 movers); offline, six further runs of 60 s: none. Live ten-ray check sampled at 12 moments 5 s apart with every mesh a blocker: 36 of 36 at 10 of 10 every time (offline, 60 moments: one ray lost once to a passing gull over the Pescaria).
- 5 (`lava-wall`): rebuilt as knee-high dry-stone walls of rough, turned stones in four lava greys with a ragged top course and capstones. The three spots on the north flank are dropped, because the Stand maker's new Etna stands there; the two field walls south of the cone stay.
- 7 (`italy-boat-ferry`): the square sail is replaced by a small lateen (a triangle under a slanted yard on a short raked mast), weathered cream, sheeted out 0.6 off the centreline and swinging gently.
- 10 (`sheep-fold`): a rectangular dry-stone pen 3.6 by 2.6 with a closed hurdle gate and straw along the back wall, the five sheep inside, at [-20.6, 7.3].
- 11 (`campagna-thistle`): removed, all 36.
- 13, 14 (fountains): both run. The Builder's own `piazzaFountain()` (basin, tazza on a baluster, a breathing jet, four falling sheets, six droplets, rings widening where the sheets land) and `treviFountainIt()` (a palazzo front with pilasters, windows, attic, the arch with Oceanus, a rock reef across the width, three cascades of stacked sheets whose lengths breathe, a wide basin with ripples) each publish their own tick, which `place()` registers; the `scaled` holder now passes its child's tick on as well. The Trevi stands at [5.6, -4.6] on open ground east of the piazza, facing the camera across the café tables; the piazza fountain at [-19.9, 4.0]. Live: 16 of 22 and 23 of 54 meshes change between two ticks.
- 16 (valli stakes): not fixed here. The probe of every mesh within 4 of the valli bank found only `valliIt`'s own group, `props-italy.ts`; the "pole out of a Burano boat" was the standing rower's raised oar, which item 17 fixes.
- 17 (rowers): seated on a thwart at the stern facing the bow, `userData.seated`, the oar on the right-hand side at the forcola, sweeping fore and aft, dipping on the drive and lifting on the recovery while he leans into it. Live: 4 rowers, 4 of 4 oars moving.
- 19 (San Marco quay): the Piazzetta's two columns (the lion, St Theodore) toward the water, a well-head, two benches and a knot of two neighbours on the riva. The grey scraps were the campanile's pigeons, which the Stand maker removed.
- 20 (`rice-field`): two flooded paddies either side of the rice stand's west edge: standing water in bunds, rows of young rice in it. The rice stand's own dry garden is `props-italy.ts`.
- 21 (`maize-field`): two strips of maize stalks with leaves, tassels and cobs on the terraferma south of the via consolare (the farm kitchen's ground is all road, pad and the Tiber's spring). The latifondo wheat keeps its mats, with soft low drill lines in place of the dark bars.
- 22 (grano frame): not fixed here. The probe of every mesh within 2.5 of the frame found only `granoIt`'s own group; the frame and its lantern are in `props-italy.ts`.
- 23 (yellow pole): not fixed here. It is `mandorleIt`'s beating pole (`#c9a840`, 2.4 tall, [16.6, 20.3]), in `props-italy.ts`.
- 24 (`italy-birds`): `birds()` takes an optional `{ size, tone }`; without it every world's flock is built exactly as before. Italy's three flocks are 0.45 of the wing size, with a small body, grey-brown and gull-grey, and fly a unit higher. The wing beat was already there.
- 25 (`quintoQuarto` card approach): improved, not cleared. The slaughterhouse is fully in view; at the arrival pitch the backs of the caffè and the piazza house fill the lowest quarter of the frame (they filled half). The Mattatoio cannot move north (its door is on IT-R2n) and the north row cannot move south (their doors are on the piazza street).
- 26 (`pasta`): the Pantheon moved from [-8.55, -2.6] to [-8.55, 1.9], with IT-R1b swinging south round it (2.0 wide) so its portico keeps a road at its door; the pasta kitchen moved 0.5 east. The approach ends at [-8.1, 2.8, -1.2] with the kitchen clear (live shot).
- 27 (`oven`): the forno and the caffè swapped places: the forno (with its `pizzeria` alias and the oven house) is at [-22.4, -10.8], its approach ending over the low herb beds; the caffè at [-15.5, -11.2], set back 0.4 so the market's shade keeps under its rays. Approach clear (live shot).
- 28 (`ragu`): every piece of Builder's scenery taller than 0.9 is now refused inside each room's approach corridor (`inRoomApproach()` in `tryPlace`), which removed the poplars in front of the trattoria. Approach clear (live shot).
- 29 (`lagunaIt`): the rowers now sit, so a passing sandolo stays below the counter; its rower can still show at the bottom edge of the frame. The lane cannot leave the channel in front of the kitchen.
- Also moved for the above: `it-piazza-casa` to [-11.2, -16.2] (the Trevi took its ground), `it-trastevere-casa` to [-15.2, 8.0] (off the new IT-R1b), the obelisk, café tables and triumphal arch to [2.6, 2.6], [3.3, -0.6] and [9.8, -3.4], one Apennine ridge east of the Trevi's front, and the neighbours are kept out of the room approaches.
- The Rialto (coordinator's note after `fd95d9a`): gondolas pass under it: 1,500 samples of the two gondolas between x 29.4 and 35.3, highest point 1.68 against a soffit of 2.13 to 2.30 over the lane. The barge (L3) runs x 21 at the canal's west mouth and does not pass under it. IT-R7's walkers were taken off the bridge rather than lifted with `rialtoDeckY`: `italy-world.mjs` holds every walker at or below `BRIDGE_DECK_Y` + 0.01, and the crown is 2.85.
- Harness and build: `npm run typecheck` clean; `italy-world.mjs` passes ("16 continuous roads in 5 networks ... 8 boats, 24 walkers, 240 seconds of motion"); `npm test` 23 of 25, the two failures `thailand-world.mjs` and `vietnam-world.mjs` in other agents' uncommitted files; `npm run build:pages` succeeds.
- Not verified: phone width; real-time watching in a displayed pane (the world was stepped and read from stills); the other worlds' flocks by eye (the default path is unchanged in code); reduced motion; the dev server was not restarted by this agent (it had been restarted 47 minutes earlier by another; every check ran on a fresh boot in this agent's own tab).

### Fixes, leftovers, 2026-09-23

Fix agent's items, `src/fw/props-italy.ts` and one line of `scripts/tests/italy-reactions.mjs`; `italy-objects.ts` was not changed. Contact sheet `italy-fix-leftovers.png` in the fix agent's scratchpad; shots `.data/shots/it-lo-*.jpg`.

- 16 (`valliIt`): the loose sticks are gone. The twelve weir stakes and their four rails became four woven cane screens (grisiole), knee-high, 1.3 long, bound along the top, either side of the tank; the two three-pole bricole standing on the island are removed; the four poles lying across the casone's roof are replaced by a bound reed crown at the ridge; the five leaning stakes by the crates became a low trestle with a fyke net drying over it and three cork floats. The pole out of a Burano boat was the lane rower's oar (item 17, the Builder's). Live at approach 24 and 40: no free stick on the island.
- 22 (`granoIt`): the two posts, the crossbar, its lantern and the hanging tally board are removed. In their place, on the ground by the water jar: three tied sacks with the tally stick laid across them, and the reapers' bread in a covered basket. The stand now carries no lamp (the harness count of lamps on beams goes from 34 to 33).
- 23 (`mandorleIt`): the free-standing 2.6 cane (`#c9a840`) is now in the picker's raised right hand, 2.1 long, grey-brown like the bark, reaching up and to his left into the nearest crown; it moves with his arm on the click. Aimed straight ahead it still drew as an upright line from the south camera, so it leans across the crown. Live at approach 20: it reads as a cane in the tree, not a pole.
- Pantheon pigeons (`panteonIt`): hidden at rest, as the Colosseum's swifts are (the campanile's were removed outright in `fd95d9a`): no grey scraps on the steps. On the click they fly. Each is now a pigeon (body, darker head, tail, wings hinged at the shoulder beating in a V) instead of the swifts' flat plates, which in flight bunched in front of the columns as grey paper. They climb 3.0 over the pediment and circle 0.4 to 2.0 wide, each heading along its circle. The reaction subject is unchanged (`it-pantheon-pigeons`). Live on the card approach 1 s after the click: eight separate birds over the portico.
- 25 (`quintoQuarto` card approach): improved again, not cleared. The building cannot move: its back wall is on the sea rim (the probe finds `sea-rim` at world z -26.5 to -27 behind the hall) and its hook line on IT-R2n. The card glide aims at the centre of the stand's click footprint, so the stand now declares the hall as that footprint (`userData.hitBox`, local z -3.0 to -0.4). The anchor moves from z -24.74 to -25.70 and the whole frame moves north with it. Raycast over the frame from the real arrival (48 columns per row; share of each row covered by a building other than the slaughterhouse), before → after: row 98 % 96 → 94, 94 % 94 → 83, 90 % 94 → 35, 86 % 79 → 29, 82 % 35 → 29, 78 % 33 → 13. The solid band of roofs is now the bottom 7 % of the frame, not the bottom 16 %. What is left is the chimney house's roof, bottom centre-right, and the palazzo at the right edge; both are Builder's houses. The hook line is still clickable through the new box: 14 of 14 of its parts from the arrival camera, 13 of 14 from approach 36. `italy-reactions.mjs` now reads a declared `hitBox` for the arrival centre, as `worldkit.ts` places the anchor (one line), and still passes.
- 29 (`lagunaIt`): nothing to change in this file set. The kitchen has no boat of its own (the only oar in `buranoKitchen` is stood on its blade beside the man at the door). The figure in the approach is `italy-rower` in the L2 `italy-boat-sandolo`, found by raycast at [12.5, 0.6, -23.0], 4.8 in front of the approach eye. On the final fresh load the boat was nearer, and the seated rower rose to counter height at the right end of the frame; how much shows depends on where the sandolo is in its cycle. For the Builder or the lead: the lane in front of the kitchen, or a `hitBox` on `buranoKitchen` that moves its approach eye about 2.5 north. The second changes the room's framing and was not tried.
- Harness: `npm run typecheck` clean; `italy-reactions.mjs` "PASS: 36 Italy stands for 46 objects ... 33 lamps on real beams ... an exact return to rest"; `italy-world.mjs` "PASS: 16 continuous roads in 5 networks ... 8 boats, 24 walkers, 240 seconds of motion"; `npm test` 25 of 25 harnesses passed (Thailand and Vietnam pass on the other agents' current files).
- Live: the dev server `food-tour-web` was not restarted; every check ran on a fresh load in this agent's own tab at 1280 x 720, stepped with `__fw.step` in the hidden pane.
- Not verified: phone width; watching any of the four stands in real time (stepped stills only); reduced motion; the Pantheon pigeons from the far ends of the orbit; clicking the mattatoio's hook line with a real pointer (checked by raycast only); the 36-clickable live ray check and `__fw.audit` after this change (the offline `italy-world.mjs` rays pass); the grano stand's standing wheat and stubble, which from approach 22 read as thin stalks and are not part of item 22.

## Stage E close-out, 2026-09-23

Mechanical bookkeeping closing the Stage E review's four remaining fails that are paperwork rather than defects
(R8, R10, V2, V3): an overlay sheet named where the rooms record already describes it, the motion baseline carried
into `docs/quality-baseline.md`, per-stand screenshots at both sizes, and the animation inventory table this file's
first paragraph had promised and never delivered. Nothing in `src/fw`, `scenes-italy.ts` or `italy-ambience.ts`
changed in this pass.

### Verification record

- **R8, the overlay sheet.** `docs/italy-rooms.md` now names it under its own "Overlay sheet" heading:
  `.data/shots/italy-rooms-overlay.png`, both orientations of all thirteen rooms with the phone heading and every
  measured box and hook outlined over the painting.
- **V2, per-stand screenshots at both sizes.** `scripts/tests/italy-prop-audit.html` was opened on the dev server
  (`food-tour-web`, in this agent's own tab) at `?view=arrival&cell=320x180&cols=6` and `?view=arrival&cell=195x422&cols=6`
  — cell aspects of exactly 1280x720 and 390x844 — which renders all 36 stands alone at the 1.6 s room-flight or
  card-glide arrival camera `main.ts` really gives them and posts the finished canvas to the local receiver on 5399.
  Two contact sheets came back, six stands to a row: `italy-stands-wide.png` (1920 x 1080, exactly 1280x720 scaled
  6x) and `italy-stands-phone.png` (1170 x 2532, exactly 390x844 scaled 6x), both copied into `.data/shots/`. They
  join the room screenshots already in `.data/shots` and listed in `docs/italy-rooms.md`.
- **V1 and V4** stay open: `npm run build:pages` and the live URL are Stage F, not touched here.

### Animation inventory

One row per stand: its always-on loop (running every frame, unrelated to the click), its click reaction (the
`life()`/`onPoke` sequence the click plays through, first beat first), and, for the thirteen that open a room, that
room's dominant painted cue from `docs/italy-rooms.md`. Read off `src/fw/props-italy.ts`'s doc comments, its
`// the ... always-on ...` code comments and each `life(g, id, people, (t, k) => {...})` body (grep `ownReaction`
for the shared idle-figure sway every stand gets besides what is listed here).

| Stand | Always-on loop | Click reaction | Room signature |
| --- | --- | --- | --- |
| `trattoria` | The coal range's firebox flickers; the salumi on the rail sway | The copper of oxtail lifts off the range onto the marble, the ladle turns it over; the oste's arm follows and a diner at the next table looks up | `it_trattoria`: the wine poured from the foglietta, traced lip to surface |
| `italyMarket` | The hanging scale under the shade beam swings | The knife strips the artichoke to the pale heart and the leaves fall into the basket; the stallholder turns | `it_market`: winter sun across the Campo |
| `pastaWorkshop` | The dried maccheroni on the canes behind sways | The folded sheet is cut into ribbons, lifted and shaken loose over the board | `it_pasta`: the window's shaft, falling down to the right |
| `pizzeria` | The oven mouth's glow flickers | The peel with the long white pizza is drawn out onto the marble; the baker's arm follows and the child at the counter reaches | `it_forno`: the oven mouth's light |
| `dairy` | The whey keeps dripping off the draining table's lip into the pail, three slow drops | The curd is cut, the whey runs and the presser leans into the press | `it_casale`: whey dripping into the pail |
| `fishMarket` | Gulls glide over the slabs, well above the sight line and never in front of the fish | A basket of sardines is tipped out along the wet marble, slides and settles; the fishwife spreads them and a buyer leans in | `it_pescaria`: first light down the canopy |
| `bacaro` | The pitcher on the counter sways; the Venetian lamps swing | The tap opens, wine falls into the glass and the ombra is tilted and served along the marble; the host's hand follows and the man at the door turns round | `it_bacaro`: the ombra drawn from the cask |
| `buranoKitchen` | Nets and floats hung from the beam sway at the ends of the bay | A soft crab goes from the cage into the beaten egg and falls back off it; the woman's hands follow and the man at the door shifts the oar | `it_laguna`: egg falling back off the crab |
| `venetoFarm` | The open hearth flickers, the chain and copper sway, the hanging maize cobs sway | The stick turns fast in the paiolo and the polenta mass folds over on itself; the woman leans in, the child lifts the wire, the man at the door looks in | `it_veneto`: the hearth's glow |
| `friggitoria` | The tufa wall's awning fringe and the string of chillies sway at the ends | A slab of chickpea paste is cut into squares and slid into the lard, which lifts and closes; the fryer's arm follows and a boy at the kerb holds out a roll | `it_friggitoria`: hard sun down the lane |
| `sicilyMarket` | The hanging scale and the string of dried tomatoes sway at the ends of the shade beam | A swordfish steak is laid on the block and the cleaver comes down; the fishmonger straightens and a woman with a basket steps in | `it_ballaro`: the morning water over the slab |
| `pasticceria` | The string of paper feast-day flags under the beam sways | Ricotta is piped into a fried shell and the ends dipped in pistachio; the pastrycook turns the tray and the girl at the counter leans in | `it_pasticceria`: the doorway's daylight |
| `tonnara` | The hooks on the rail under the eaves sway, over the bench, never over the coppers | A tuna loin is lowered into the boiling copper on the hooked pole and the surface heaves; a woman at the tinning bench looks up | `it_tonnara`: the oil into the tin |
| `carciofaia` | The artichoke plants sway | A head is cut off its stalk, lifts clear and drops into the basket at the cutter's feet | — (card only) |
| `sheepFold` | The sheep's heads bob, the dog's tail wags | The ewe at the gate lifts her head, steps forward and settles; the flock shifts behind her | — (card only) |
| `oliveGrove` | The stone wheel turns in its trough all day; the olive trees' crowns sway | The boy's basket of olives tips into the trough, the wheel quickens and the miller leans on the beam | — (card only) |
| `wineCart` | The roadside foglietta sways; the stacked barrels rock gently on the bed | A barrel rolls down the plank off the tail and settles at the carter's feet | — (card only) |
| `cow` | The ox's tail swishes; the pigs' heads sway | The ox lifts his head off the trough and shifts his weight; the pigs shove in at the tub | — (card only) |
| `chicken` | The hens bob their heads and hop lightly at the grain; the cockerel's head bobs | The named hen flaps up onto the hut roof and settles back; the rest flap in at the scattered grain | — (card only) |
| `porciniWood` | The strings of drying porcini sway; the chestnut crowns rustle | A mushroom is lifted out of the leaf litter and carried up to the drying string | — (card only) |
| `herbGarden` | The herb clumps sway | A bunch of basil is pinched off and lifted into the bowl | — (card only) |
| `valliPesca` | The eels turn over gently inside the net | The fyke net lifts out of the shallow water towards the bank and the eels turn over harder inside it | — (card only) |
| `riceFieldItaly` | The flooded rice seedlings ripple | The heron lifts off; a bundle of seedlings is lifted out of the water and settles on the bank | — (card only) |
| `wheatLatifondo` | The standing wheat ears and the stooks sway | The band closes on the sheaf, which is bound, lifted and stood into the stook; the reapers straighten behind it | — (card only) |
| `tomatoField` | The tomato plants sway | The crate tips, the fruit rolls out across the drying board and the spatula turns it | — (card only) |
| `citrusGrove` | The lemon and orange trees' crowns sway (the shared `harvest()` idle) | The trees shake, the fruit falls into the pickers' baskets, then is gathered up | — (card only) |
| `almondGrove` | The almond trees' crowns sway; the picker's beating cane sways gently in hand | The cane knocks the husks down onto the cloths and the pickers gather them into the baskets | — (card only) |
| `caperTerrace` | The caper bushes on the terraces sway | The picker's hand goes through the bush, the buds drop into the salt tub and the scoop turns them over | — (card only) |
| `colosseum` | None beyond the residents' own idle sway; the swifts rest hidden inside the arcades | The swifts spiral out of the upper arcades over the front of the ring and go back in; the guide points up, the visitor and the boy look up | — (card only) |
| `pantheon` | The oculus's glow flickers; the disc of sun drifts slowly across the floor inside the open door; the pigeons rest hidden under the portico's cornice | The pigeons come off the portico, circle wide over the pediment and go back under the cornice; the sun swings further and the reader looks up | — (card only) |
| `mattatoio` | The quarters hanging on the rail sway | The marked quarter runs down the rail on its trolley and swings to a stop; the vaccinaro takes the weight on his shoulder, the butcher turns to watch | — (card only) |
| `gelateria` | The sorbettiera's canister turns steadily in its tub of ice and salt | The paddle comes up out of the canister with the ice on it and turns faster; the turner's arm follows | — (card only) |
| `rialtoBridge` | None of its own (the gondola lane's own boats pass under the arch, on the Builder's tick) | The shopkeeper's shutter at the top of the south steps swings open and the goods come out onto the sill; the shopkeeper steps to the door, the porter on the steps turns round | — (card only) |
| `campanile` | None beyond the residents' own idle sway | The big bell swings first, the two smaller bells follow, the whole tower leans a fraction and settles; the priest and the woman on the quay look up | — (card only) |
| `etna` | None (nobody stands on the cone; the plume is otherwise still) | The plume swells, darkens and leans away east, the crater glows, and the cutters at the foot straighten to look up | — (card only) |
| `carretto` | The mule's head sways gently | The mule leans into the shafts, the cart rolls a length forward and back and the painted panels catch the light; the carter's arm follows the bridle, the boy by the wall looks round | — (card only) |

Card-only stands with no room: the fifteen ingredient stops and the eight landmarks above account for all 23; every
row's click reaction is what the object's card approach plays, not a room flight.

## Second walkthrough, 2026-09-23

Stage E2 point 10: the owner's walkthrough repeated after the four fix passes above, by a reviewer who built and fixed none of Italy. Nothing in code, scenes, ambience or objects was changed; this section and the dated notes on the Stage E table are the only edits.

**How it was run.** The dev server `food-tour-web` was restarted through the preview tool, and the page was loaded in the reviewer's own tab with the Recipes add-on off (`food-tour:recipes` unset; no card or room showed a recipe row). The app was booted from an image URL with the app's markup injected and `WebSocket` stubbed, so other agents' edits could not HMR-reload it: the same modules from the same server, a fresh boot. The pane was hidden throughout, so the world and the rooms were advanced with `__fw.step` at 1/60 s and read through `__fw.shot`, `__fw.sceneShot`, each room's own effect canvas and, at 390 x 844, a composite built from the live DOM (painting, effect canvas and hung sprites at their on-screen rectangles, with the heading and buttons outlined), because `sceneShot` draws a portrait room at the wrong aspect at that width. Every room was reached through the real route (click, 1.6 s approach, fade, room), in both orientations, on two fresh boots (1280 x 720, then 390 x 844 at device pixel ratio 2). No Italy file changed between the start and the end of the pass (HEAD moved from `2e2e984` to `094ddde` with Britain and Southeast Asia commits only). Shots are `.data/shots/it-r2-*.jpg`; the contact sheet is `italy-review-2.png` in the reviewer's scratchpad.

| Check | Result |
| --- | --- |
| `npm run typecheck`, `italy-world.mjs`, `italy-reactions.mjs` | Pass ("16 continuous roads in 5 networks ... 8 boats, 24 walkers"; "36 Italy stands for 46 objects ... 33 lamps on real beams ... exact return to rest"). The full `npm test` was not run: other agents were running it at the same time |
| Zoom limit | 215 reached, fog 198 / 439; the whole table reads at the limit with no haze on the far corner (sheet, first cell) |
| `__fw.audit(60)`, fresh load | 51 movers, **no violations** |
| Live ten-ray check, 1280 x 720, every visible mesh in the world a blocker (walkers, boats, carts and birds included) | **36 of 36 at 10 of 10 at each of 12 moments 5 s apart.** As in the harness, a ray passes when nothing stands between the camera and its aim point |
| Fountains, 15 ticks | `piazza-fountain` 16 of 22 meshes change every tick; `trevi-fountain` 23 to 24 of 54 |
| Gondolas under the Rialto, 120 s at 30 samples a second | 3,025 samples of a gondola inside the bridge's box, highest hull point 1.68; no bridge part above 0.5 meets a hull part |
| Rooms at 1280 x 720, 10 s each, maximum lit pixels on the room's own effect canvas inside each configured box | Every signature, patch and steam source in all thirteen rooms draws. Smallest: `it_tonnara` glint 233, `it_bacaro` glint 272, `it_ballaro` glint 571, `it_laguna` drip 654, `it_casale` drip 687. Every wide fire ellipse is shown (opacity .53 to .84) |
| Rooms at 390 x 844, same method (canvas at 780 x 1688) | Every cue draws in all thirteen. Smallest: `it_tonnara` glint 466, `it_bacaro` glint 747, `it_casale` drip 1,288, `it_pasticceria` doorway light 2,954 (its box sits at x -2 to 22 of 390 and is lit inside the screen). Every portrait fire ellipse is shown (.66 to .83). Every visible portrait sprite lies inside x 17 to 327 |
| Cards, opened live at 1280 | 31 clicked: the 23 card-only objects, `stall-tomato`, `stall-arancini` and the six aliased stalls (`stall-cheese` among them, which opens the casale room instead of a card), so 30 cards read. Each is a tagline over three paragraphs of 192 to 556 characters; none is visibly shorter than its neighbours; no "Related recipes" row. The thirteen room cards were read from `italy-objects.ts` (three paragraphs, 1,145 to 1,344 characters each), not opened live in this pass |

### The first pass's 51 items

Closed, one line each, with what was seen:

- 2 `italy-bridge`: one stone arch over the Tiber with parapets and road-coloured ramps; reads as a bridge at overview and approach 42
- 3 `wine-cart`: runs its closed loop on the via consolare behind its mule; `__fw.audit(60)` names nothing
- 4 `etnaIt`: a dark snow-capped cone with a plume, the tallest thing on the table; nobody on it; reads as a volcano at overview and approach 42
- 5 `lava-wall`: rough grey dry-stone walls south of the cone; read as walls, not bars
- 6 `tonnaraIt`: the flat box is now a lime-washed salting shed with barrels and nets; the two-roofed shed at the east cape shows its white walls at overview and approach 42 and reads as a long shed
- 7 `italy-boat-ferry`: a small lateen sail; reads as a boat at overview and approach 42
- 8 `rialtoIt`: the arch reads from the south-west at approach 22; gondolas pass under it (see the check table)
- 9 `campanileIt`: brick shaft, belfry and green spire, clearly taller than the San Marco houses at approach 22 and 40
- 10 `sheep-fold`: a rectangular dry-stone pen with its gate and sheep
- 11 `campagna-thistle`: none left on the Agro
- 12 `romeMarket` stalls: produce, cloths and sellers on all five, at approach 42 and at the market's room approach
- 13 `trevi-fountain`: a palazzo front, reef and basin on open ground east of the piazza; reads as the Trevi
- 14 `piazza-fountain`, `trevi-fountain`: both tick (check table)
- 15 `italyBeef`: the ox is a figure's shoulder high
- 16 `valliIt`: woven screens, a trestle and a reed crown; no free stick at approach 40
- 17 rowers: seated at the stern in every gondola and sandolo seen, oars sweeping
- 18 `colosseoIt`: arena floor clear at approach 42 and 20
- 19 San Marco quay: two columns, a well-head, benches and neighbours; no scraps
- 20 `riceIt`: two flooded paddies with rows beside the stand
- 21 `maize-field`: standing maize with tassels; no decking look
- 22 `granoIt`: no frame and no lantern; sacks, tally stick and basket on the ground
- 23 `mandorleIt`: the cane is in the picker's raised hand, in the crown, at approach 20
- 24 `italy-birds`: small grey gulls at approach 20 over the lemon grove (but see 62)
- 25 `quintoQuarto` card approach: the slaughterhouse and its hook line are fully in view; roofs fill only the bottom strip of the frame (sheet, item 62's cell)
- 26 `pasta` room approach: the kitchen fills the frame, no Pantheon
- 27 `oven` room approach: the forno counter is clear; no pergola
- 28 `ragu` room approach: no cypress; the counter is clear
- 30 `__fw.audit(60)`: no violations among 51 movers
- 31 `gelateria`: 10 of 10 at all 12 moments
- 32 `it_pescaria` wide: the haze sits in the gap between the old man and the girl; no face is washed
- 33 `it_pescaria` 390: the haze is above the heads; the fishmonger's cap is clear
- 34 `it_trattoria` 390: nothing hangs from the hook; the oste's face is clear
- 35 `it_friggitoria`: no awning scrap in either orientation
- 36 `it_ballaro` wide: no cloth on a chain; the palm's leaves move in its crown
- 37 `it_ballaro` 390: the leaves are in the palm, the flock over the dome (but see 59)
- 38 `it_casale`: leaves in the olive inside the door opening in both orientations; birds in the sky in it
- 39 `it_market` 390: no awning scrap (but see 58)
- 40 `it_bacaro`, `it_pasticceria` 390: no lamp; only the painted chain
- 42 `it_laguna`: the front bowl steams in both orientations (30,560 lit pixels wide, 73,140 at 390 on a 780-wide canvas)
- 45 `it_pasta` wide: the hung nests end well above the woman's ribbons; they read as two things. At 390 too
- 46 `it_casale` wide: re-measured on six pairs across the cycle, 0.9, 1.2, 3.4, 4.0, 4.2 and 4.2 percent, **median 3.7** against the 3 percent floor (pairs in the reviewer's scratchpad, `r2/motion`)
- 48 `stall-arancini`: "How it is served" lists arancine, pani e panelle and cazzilli, the three fried things the blurb names
- 49 `pastry`: seven entries, cannoli first, no martorana (read in `italy-repertoire.ts`; the room card was not opened live)
- 50 `stall-tomato`: opens its own Roman card (Cirio, passata and crates)
- 51 children: `stall-tomato` and `stall-arancini` show their own blurbs; the five other aliased stalls opened here show their alias's card; `stall-cheese` opened the casale room live, and `trattoria` and `pizzeria` alias a room in `italy-objects.ts`

Still open (numbered in this list, with the first pass's item number):

1. `lagoon-shallows`, item 1, approach 40 and 24, overview 110 and the osteria's room approach: the hard diagonal in the porto is softened, but the pale sheet still reads as a straight-edged light-blue band running from the lido to San Marco, like a searchlight beam or a glass pane lying on the sea; at the osteria's room approach it stands to the right of the counter as a glass panel (sheet). See also 52
2. `lagunaIt`, item 29, room approach at 1280 x 720: confirmed. On this pass the seated rower of the L2 `italy-boat-sandolo` showed head and shoulders at the bottom-left corner of the frame, in front of the quay and below the counter; the counter itself was clear. At 390 x 844 no boat was in frame. How much shows depends on where the sandolo is in its cycle; clearing it needs the Builder to move L2's lane out of the kitchen's approach, or a lead ruling on the `hitBox` alternative the leftovers pass named
3. Item 41, eight rooms, both sizes: the empty painted hooks at the top of the frame are still there (for example `it_tonnara`, `it_ballaro`, `it_market`, `it_pescaria`, and now also `it_trattoria` 390, `it_friggitoria`, `it_bacaro` and `it_pasticceria` 390). The room fix accepted them as painted; that is the Room maker's view, and the item stays open until the lead rules on it
4. Item 43, `it_market`, both sizes: courgette flowers and summer squash still sit beside the winter artichokes. Accepted as painting content by the room fix; open for a lead ruling
5. Item 44, `it_veneto`, both sizes: the two children still sit at glasses of red wine. Accepted as painting content by the room fix; open for a lead ruling
6. Item 47, every room: still read from stepped stills and effect-canvas maxima, not watched in real time in a displayed pane. No pour was seen to crawl and no glint was seen above a lip in 10 s filmstrips (1, 5 and 10 s) at both sizes, but this pass cannot close the item

### New in this pass

52. `lagoon-shallows` over the San Marco quay, approach 40 and 24 and the Rialto approach 22: the sheet (y 0.07) lies over the east end of the quay stone (y 0.03). The paving under the two columns, the well-head and the bench is tinted pale cyan up to a straight diagonal edge; a raycast at the quay's east end meets `lagoon-shallows` before `quay-stone` (sheet)
53. `triumphal-arch` at [9.8, -3.4], approach 20 and 42: turned 90 degrees (rotation 1.57), so from the camera it is edge-on and reads as a tall beige slab or pillar beside the Trevi, half behind a tree; no opening shows (sheet)
54. `it-coast-casa` [12.4, 26.6] and `it-etna-casa` [18.2, 26.6], approach 42: each striped awning stands on two thin dark poles running to the ground in front of the house, and from above the two houses read as boxes standing on stilts (sheet)
55. `granoIt` standing wheat, the Ballarò and friggitoria room approaches at 1280 x 720: tall thin yellow stalks stand between the camera and both counters and cover the bottom corner of each frame, over the woman with the basket at Ballarò; they read as a row of sticks or spikes (raycast: `granoIt`) (sheet)
56. `bacaro` room approach at 1280 x 720: a gondola on L1 passes in front of the osteria; its white prow iron stands up at the bottom centre like a signpost or ladder, and the rower sits at the right edge. The counter is clear (sheet)
57. `it_bacaro` wide, 1280 x 720, at 10 s: the sunray lies across the young drinker's face and cap at the counter and his face reads washed pale, as item 32 recorded at the Pescaria. At 1 and 5 s it is beside him (sheet)
58. `it_market` 390 x 844: with the Recipes add-on off the room lists five stand buttons in two rows (y 131 to 201), and the olive-leaf patch ([5, 140, 100, 196] on screen) drifts behind the Tomatoes and Basil & herbs buttons. The leaves are large pale blades against the painted tree (sheet)
59. `it_ballaro` 390 x 844: the palm-leaf patch ([319, 29, 385, 157]) runs into the third stand button, Street food (x 260 to 367, y 131 to 163); the leaves are larger than the painted palm's leaflets and read as pale green blades stuck in the crown (sheet)
60. `it_laguna` 390 x 844: the room's name wraps to two lines, which pushes "The story" down to y 132 to 169, and the hung gull (x 17 to 72, y 146 to 191) now flies behind the button (sheet)
61. `it_trattoria` and `it_forno`, both sizes: with the Recipes add-on off the room still shows "The stands" with one button each, "Pasta dishes" (`trattoria`) and "Pizza" (`pizzeria`), and each opens the room's own card, the same card as "The story". Point 4 of Stage E2 expects only "The story" in a room without stalls (sheet)
62. `italy-birds`, the Rome flock, `quintoQuarto` card approach at 1280 x 720: three birds pass low between the camera and the Tiber and draw as thin black darts, which read as sticks in the air rather than birds (sheet)

### Stage E lines

Marked in the table above with a dated note: **W11, W12, W14, S3, R3, R11, R13 now pass.** W2 and W9 still fail on items 1, 52, 53, 54 and 55. The Stage E lines not named here keep their verdicts.

### Not verified in this pass

- Real-time watching of any room or of the world (item 6 of the open list).
- The 23 card-only stands' click reactions at full size: the cards were opened and read, but after the first glide the hidden pane stopped updating the WebGL canvas (other agents' tabs and test runs were loading the machine), so their approach-end shots are stale and were discarded. Only `quintoQuarto`'s card approach was re-shot in a fresh tab. The thirteen room stands' reactions were seen at their room approaches in both orientations.
- The thirteen room cards were read from source, not opened live.
- Reduced motion, flicker while moving or zooming, speech-bubble overlap, the full `npm test` and `npm run build:pages`.

### Fixes, round two, 2026-09-23

The residual list above, fixed by an agent that did not build Italy. The lead ruled first: items 41, 43 and 44 are the paintings as accepted, and item 47 is a process caveat, not a defect. One line per item:

- 1 and 52 (`lagoon-shallows`): removed, as the lead ruled. The sea is one material on this table; the lagoon reads from its five islands, the lido, the valli and the boats. `italy-world.mjs` lists `lagoon-shallows` among the retired names and no longer requires it; `LAGOON_Y` is gone. The San Marco quay stone is plain at approach 24 and the Rialto approach 22 (sheet)
- 29 (`lagunaIt` approach): L2 left the channel between Burano and the valli bank for the open water south of the valli bank, [13.6, -11.3] to [24.2, -8.6], behind every lagoon room's camera. Over 240 s sampled each second, no corner of any boat's meshes projects into the lagoon kitchen's approach frame at 1280 x 720 or 390 x 844, nor into the Pescaria's, the osteria's or the farm kitchen's; with occlusion, no boat is visible in any of the thirteen room approaches at either size. That water is too short for two hulls 4.3 long to pass in (`__fw.audit(60)` found them touching at pass .55 and .8), so L2 carries one sandolo: the table has seven boats, not eight. The two-boat lanes (L1, L4) keep their boats half a cycle apart
- 41 (empty painted hooks): closed. Lead ruling: the paintings as accepted
- 43 (summer squash beside the artichokes): closed. Lead ruling: the painting as accepted
- 44 (children at glasses of wine): closed. Lead ruling: the painting as accepted
- 47 (rooms not watched in real time): a process caveat, not a defect; the round-two rooms were checked on stepped composites and live pane screenshots (below)
- 53 (`triumphal-arch`): turned to face +z (rot 0) and placed after the Trevi at [11.0, -3.4], because facing front it is 3.4 wide and at [9.8, -3.4] it took the Trevi's ground. The opening reads beside the Trevi at approach 20 and 42 (sheet)
- 54 (`it-coast-casa`, `it-etna-casa`): the two ground posts under the striped awning are gone from the `sicilianCoast` and `palermoTufa` builder; two iron brackets run from the wall at 1.1 to the awning's outer edge. Nothing stands on the ground in front of either door (sheet, approach 20)
- 55 (`granoIt` wheat): the 48 stalks with a cone on each are one crop block, 3.1 x 0.42 x 2.1, sides painted with stalks under a band of heads and the top with heads that ripple as its texture slides. It stands west of the mule (which had been inside the block's first cut), so it is out of the friggitoria's approach at both sizes and out of Ballarò's at 390 x 844; at 1280 x 720 a low golden edge shows in the bottom-right corner of Ballarò's frame, below the woman with the basket (sheet)
- 56 (gondola ferro, osteria approach): the ferro is 0.66 high rather than 1.25, with its four teeth and a duller iron grey, and the stern iron 0.40 rather than 0.70. L1 now turns back at x 35, under the Rialto and short of the osteria's frame, instead of running on up the channel past it; no gondola enters the osteria's approach at either size in 240 s
- 57 (`it_bacaro` wide sunray): the beam falls through the canal door, down the door leaf and onto the right end of the counter, box [.63, 0, .91, 1.0], angle .30, drift .09 (was [.52, 0, .98, .74], .42, .11). Simulated over 400 s at 0.2 s, the band's light on each of the six faces is zero; on the live effect canvas over 25 s (more than one 22.4 s drift) no pixel of any face box is lit while 41 percent of the door is. A first cut stopped at y .74 measured 2.7 percent, under the floor, which is why the box runs to the bottom of the painting
- 58 (`it_market` 390): the portrait leaves moved from the canopy behind the Tomatoes and Basil & herbs buttons to the young tree right of the stall pole, [.60, .195, .685, .262] (x 242 to 283, y 165 to 221 on screen), five at 1.2. The portrait flock, whose rows crossed the Salumi button, now crosses in front of the dome's drum right of the buttons, [.78, .13, .905, .20]
- 59 (`it_ballaro` 390): the portrait leaves moved from the big palm's crown (behind Street food and the settings button) to the smaller palm below it, [.815, .195, .895, .245], six at 1.3; the portrait flock was cut to [.49, .008, .672, .066], between Back and the world-story button, which it had crossed
- 60 (`it_laguna` 390): the gull glides lower in the door, (.115, .232) at width .100 (on screen x 8 to 58, y 192 to 234), below "The story" (y 132 to 165)
- 61 (`it_trattoria`, `it_forno`): the room's stand list is built in `src/fw/main.ts` (`enterLivingScene`), not in `ui.ts`, so the filter went there: a child whose alias resolves to the room's own object, or to the object whose room this is, is left out. Live at 390 x 844 the trattoria, forno and every other single room show only "The story"; Campo de' Fiori keeps its five stands and Ballarò its three. The full `npm test` passes
- 62 (`italy-birds`): every flock is a pale stone grey now, Rome's `#B8B0A4` and the gulls `#D2D0CA` (were `#6E6760` and `#8C8A86`). At the Mattatoio's card approach, at the moment four Rome birds are in frame, they draw as light flecks over the Tiber, not dark sticks (sheet)

Found by the same rule while checking 58 to 60 (every portrait patch and hung sprite tested against the live rectangles of Back, the world-story and settings buttons, the room's name and every button, at 390 x 844 in all thirteen rooms): the Pescaria's portrait flock ran 6 px into the room's name and now starts at y .118; the casale's portrait flock touched the bottom of the two round buttons and now starts at y .072. One overlap is left: `it_pasticceria`'s portrait lamp halo, [.085, .105, .135, .165], is a painted lamp at the left edge of the frame (x -2 to 22 on screen) and its box covers the left 6 px of the room's name and of "The story". It was not moved; the lamp cannot be.

**How it was checked.** `food-tour-web` was already running for other agents and was not restarted (a restart would have cut their pages); the page was loaded fresh in this agent's own tab from an image URL with `WebSocket` stubbed, eight times over the pass, so each check ran on the code as it then stood. The app's own canvas stopped updating after the first frame in that tab (every `__fw.shot` came back byte-identical), so world shots were drawn with a second `WebGLRenderer` on the same scene and the same three.js module, at the approach poses `main.ts` computes (checked against a live `__fw.open` flight to 0.01). Portrait rooms were read from live pane screenshots with the tab in front and from composites of painting, effect canvas and hung sprites with the UI outlined. Boats were tested by projecting every corner of every hull mesh's box into each approach frame, and again with occlusion.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | **25 of 25** (`italy-world.mjs`: "16 continuous roads in 5 networks ... 7 boats, 24 walkers"; `italy-reactions.mjs`, `room-loops.mjs` pass) |
| `npm run build:pages` | Builds |
| `__fw.audit(60)`, fresh load, final lanes | 50 movers, **no violations** |
| Live ten-ray check, 1280 x 720, every visible mesh a blocker | **36 of 36 at 10 of 10 at each of 12 moments 5 s apart** |
| Motion, six pairs 2 s apart at frames 60 to 1180, `room-motion.py` | `it_bacaro` wide **3.50** (1.9 to 5.5); portrait `it_market` **4.65** (2.7 to 7.7), `it_ballaro` **5.20** (0.5 to 7.5), `it_laguna` **13.80** (12.9 to 15.0), `it_casale` **4.00** (0.8 to 5.4), `it_pescaria` **3.75** (0.4 to 4.5). The composite method was checked on an untouched cell first: `it_bacaro` portrait measured 4.35 against the recorded 4.30. Pairs in `.data/it-fix2-motion/` |

Shots are `.data/shots/it-f2-*.jpg`; the contact sheet is `italy-fix-round2.png` in the fix agent's scratchpad.

**Not verified in this round.** Real-time watching in a displayed pane beyond single screenshots; reduced motion; flicker while moving or zooming; speech-bubble overlap; the 23 card-only stands' click reactions; the dev server restart the brief asked for (not done, because other agents were using it). The steam and fire of `it_laguna` may be under-counted in its motion pairs, which read the effect canvas and `<image>` layers only.


## Owner walkthrough on the live site, 2026-09-23

The owner looked at the published Italy (commit `0ea5654`) on her phone:

1. Italy reads a little better than Britain, but it is still not clustered enough
2. The Colosseum is a bit too small
3. The historical buildings should be bigger
4. The tiger and the fighter in the Colosseum are gone; they should be added back

The cause of item 1 is the shared-ground pass above. It was briefed to prefer spreading a cluster over shrinking a stand, so it laid every cluster out in rows along roads, strung the Agro Romano along the Tiber's north bank from x -44 to x -9, and ran the Sicilian stands in two rows the length of the island. Rays cleared, but from the overview the table read as one even carpet of stands with no open ground between places. Measured on the object list as it stood (a cluster's centre is the mean of its stands' anchors): the Agro's farthest stand was 22.5 from its centre, the tonnara coast's 23.0, Venice's 14.8.

### Re-cluster and landmark pass, 2026-09-23

The China standard, and Spain as the owner's reference, is dense clusters clearly separated by open countryside, each with one character. The table was re-laid as **six clusters, each on its own ground under one tint, with at least eight units of open country between any two clusters' ground**. The lagoon's four quays are one cluster, the terraferma farm and rice fields the second Venetian one. A cluster's ground is the convex hull of its stands' footprints; its radius is the farthest stand anchor from the mean of its anchors.

| Cluster | Centre | Radius (before → after) | Tint | Holds, back row first |
| --- | --- | --- | --- | --- |
| Rome: the piazza | [1.9, -6.6] | 11.3 → **12.9** | `#d9cbb0` setts, one pool 32 x 31 | Back: `panteonIt` [-9.0, -13.4], `colosseoIt` [0.8, -11.0], `gelateria` [10.0, -15.0]. Middle: `pasta` [-9.0, -1.9], `romeMarket` [0.8, -4.55] with its five stalls round the Campo, `oven` [10.0, -3.0] with its oven house [10.3, -8.4] in the caffè's shadow. Front: the Trevi [0.8, 6.1], `basil` [10.0, 2.9]. The fountain of the Piazza della Rotonda [-9.0, -6.3] before the Pantheon; the palazzo, two houses, the basilica, the obelisk, the triumphal arch and the umbrella pines in a built strip behind the monuments |
| The Agro Romano | [-32.5, -9.7] | 22.5 → **10.1** | `#c6b489` campagna, 32 x 27 | All on the Tiber's west bank, three rows facing three lanes off one spine along the river. Back: `quintoQuarto` [-39.25, -17.2], `ragu` [-32.55, -17.2], `cheese` [-25.75, -17.2] with its byre [-21.2, -19.8]. Middle: `olive` [-42.4, -9.5], `mushrooms` [-35.6, -9.5], `pecoraIt` [-28.8, -9.5], `carciofoIt` [-22.7, -9.5]. Front: `italyBeef` [-39.2, -2.3], `italyChicken` [-32.55, -2.3], `vinoIt` [-26.05, -2.3]. The campagna casale [-35.8, -23.4] behind the back row, olives, pines and the walled fold on the slope to the sea |
| Venice: the quays | [29.4, -20.4] | 14.8 → **11.4** | `#ded3b6` Istrian stone | Back: Burano with `lagunaIt` [21.1, -28.3] and its cottage; the San Marco quay with `campanileIt` [30.0, -27.6], the tallest thing in Venice, and two houses. The Grand Canal, four wide, under `rialtoIt` [39.4, -22.8]. Middle: the Rialto quay with `seafood` [25.8, -17.4], `bacaro` [32.95, -17.2] and a house at its west end. Front: the valli bank with `valliIt` [27.3, -9.4] |
| The terraferma | [27.4, 3.8] | 3.3 → **3.6** | `#a9b878` maize green | `casaVeneta` [23.8, 3.8], `riceIt` [31.0, 3.8], maize, paddies and mulberries round them, on the mainland's east lobe across the lagoon from the quays |
| Palermo: the Albergheria | [-17.0, 22.8] | 11.9 → **10.3** | `#cdbb92` tufa | Back: `pastry` [-24.3, 20.15], `sicilyMarket` [-15.2, 19.9] with its three stalls and its back lane, `friggitoria` [-7.0, 20.15]. Front: `carrettoIt` [-24.98, 27.15], the Albergheria house [-19.9, 26.2] in the one gap between two stalls' sight lines, `tomato` [-13.6, 26.4] |
| The tonnara coast and Etna | [17.1, 24.0] | 23.0 → **13.7** | `#b6ac7e` dry gold, `#6b6258` basalt under Etna | Back: `lemon` [8.4, 20.0], `mandorleIt` [15.9, 19.7], `etnaIt` [23.5, 21.8]. Front: `granoIt` [8.4, 26.3], `capperiIt` [16.3, 27.4], `tonnaraIt` [29.9, 28.9] with its sheds [35.4, 26.6] at the cape; the tonnara's tower, two coast houses and the lava walls behind and in front of Etna. The masseria's tower [3.2, 21.4] at its west edge |

Open country between them: the Tiber and its poplars and reeds between the Agro and the piazza (8.2 between the two grounds); the lagoon between the piazza and the quays (8.2); the Apennine spur, vines and olives between the piazza and the terraferma (8.1); the lagoon's south shore between the quays and the farm (8.4); the latifondo's wheat, the prickly pear, the citrus garden and a baroque church between Palermo and the tonnara coast (9.7); and the sea and the strait between the mainland and Sicily.

**Why Rome and the tonnara coast are 13, not 9.** A stand *h* tall hides everything within 1.25 x (*h* - 0.8) of its back from the arrival camera, in its own column. Rome has five six-unit buildings — the Colosseum at 6.9, the Pantheon at 5.0, the pasta kitchen, the forno and the caffè at 6.0 — so each needs a column of its own or six and a half units of shadow in front of the one behind it, and those shadows cannot hold a stand. Rome is therefore three columns (Pantheon and pasta kitchen; Colosseum, market and Trevi; caffè, forno and herb beds) with the gaps holding the fountain, the oven house and the road, 24 by 25. The tonnara is 4.6 high and faces its own sea, so it cannot stand in front of any back-row stand and Etna cannot stand in front of it; it takes a fourth column east of Etna's sight line. Both are as tight as the sight-line rule allows; the others are at or near 10.

#### The moves

| Object | Was | Now | Why |
| --- | --- | --- | --- |
| `colosseoIt` | [-3.06, -4] | [0.8, -11.0] | Twice its size; the back of the piazza, where nothing stands behind it, with the market 2.25 in front |
| `panteonIt` | [-8.55, 1.9] | [-9.0, -13.4] | Larger; the back of the west column, with the Rotonda fountain before it |
| `gelateria` | [-15.5, -11.2] | [10.0, -15.0] | Back of the east column: at six units it must have nothing behind it |
| `pasta` | [-8.4, -10.8] | [-9.0, -1.9] | 6.4 in front of the Pantheon's steps, clear of its shadow |
| `romeMarket` + 5 stalls | [-16.2, -5] | [0.8, -4.55] | The Campo in the middle, with a lane on each side for its outer stalls |
| `oven` (+ `pizzeria`) | [-22.4, -10.8] | [10.0, -3.0] | 6.4 in front of the caffè; its oven house moved into the caffè's shadow |
| `basil` | [-24.9, -3.8] | [10.0, 2.9] | In front of the forno, low enough to hide nothing |
| The Agro's ten | strung from [-42.9, -24.2] to [-12.5, -25.3] and [-39, 2.6] | the three rows above | One place on the west bank: three lanes off a spine along the river, low stands in front of tall ones |
| `lagunaIt`, `campanileIt`, `rialtoIt`, `seafood`, `bacaro`, `valliIt` | a 27-wide spread of four quays | the three rows above | The campanile to the back row, where nothing stands behind its 10.6-unit tower; the quays re-cut to hold the rows with water between |
| `casaVeneta`, `riceIt` | [0.5, -20.6], [2, -14.2] | [23.8, 3.8], [31.0, 3.8] | Their old ground was eight units from the piazza's; the east lobe is open and faces the lagoon |
| `pastry`, `sicilyMarket` + 3 stalls, `friggitoria`, `carrettoIt`, `tomato` | spread with the latifondo and capers | the two rows above | `granoIt` and `capperiIt` left the Albergheria for the tonnara coast, where the blueprint had them |
| `lemon`, `mandorleIt`, `etnaIt`, `granoIt`, `capperiIt`, `tonnaraIt` | from [-10.16, 26.25] to [33.2, 25.6] | the two rows above | One place: the gardens and terraces in front of the volcano, the tonnara on its own shore east of Etna's sight line |

What moved with them: the mainland's lagoon shore now runs from [12.5, -23.4] to [23, -4.2] and its east lobe bulges to [36.6, 1]; the Tiber runs north to south between the Agro and the piazza, from a spring under the north coast at [-16.3, -24] to a mouth at [-16.2, 12], crossed once by the stone bridge at [-16.2, -6.6]; the Apennine rise is now a spur between the piazza and the terraferma; the quays are re-cut (the Rialto quay 17.6 to 43.6 by -20.8 to -13.85, San Marco 25.0 to 46.6 by -31.7 to -24.8, Burano 13.3 to 24.4, the valli bank 23.8 to 32.0 by -13.35 to -5.8, the lido 47.9 to 49.9); Sicily's south coast reaches half a unit further south at the tonnara. Twenty roads replace sixteen: the piazza street, its front road, the caffè spur, the herb-bed lane, the market's two side lanes, the Agro's spine and three row lanes, the via consolare, the Albergheria lane with Ballarò's back lane, one south road for both Sicilian front rows, the coast road and its link, the fondamenta, the Rialto and San Marco riva, Burano's and the valli's. Every door meets one. The boat lanes, the walker loops, the Castelli wine cart (now on a straight stretch of the via consolare), the mule (on the Agro's spine), the neighbours, the houses and the decor were re-sited to the new ground. `AREAS.rome.center` is [1, -5], `venice` [30, -20], `sicily` [-16, 22], and `main.ts` arrives in Italy at [1, 0, -5].

The thirteen houses all still stand, each where it hides no clickable, and **each keeps a unit of ground from any water** (the Britain rule, applied here and now in `italy-world.mjs`; the lagoon's quays are ground). Four houses and the tonnara sheds were moved or the quays widened to meet it. The baroque church went from the Albergheria's east end to the open latifondo, where the friggitoria's room flight no longer ends inside its dome.

#### Landmarks at landmark scale

| Landmark | Before (footprint, height) | After | How |
| --- | --- | --- | --- |
| Colosseum | 4.5 x 5.3, 1.9 (a half-size ruin 4.2 across) | **10.7 x 9.9, 6.9** | Rebuilt: a whole ellipse 10 by 8.2, three storeys of arcades with engaged half-columns and entablatures and the attic with its windows, 6.7 high, the tallest thing in Rome. On the south, the side the camera sees, the outer ring steps down storey by storey to one, as the real one does, with the inner ring's arcades behind the break; through it the stepped cavea and the arena. Card glide at 32 |
| Pantheon | 4.1 x 5.4, 3.4 | **5.9 x 7.7, 5.0** | The temple at 0.66 of the old decor (was 0.45), set back so its step stays at the road |
| Trevi | 6.4 x 4.2, 2.8 | **7.7 x 5.1, 3.4** | At 1.2 of the Builder's build, at the front of the Campo, its facade 3.25 in front of the stalls so every ray from them clears it |
| Campanile | 4.1 x 3.0, 7.8 | **4.7 x 3.7, 10.6** | Tower and loggetta at 1.35; card glide at 36 |
| Rialto | 3.4 x 7.5, 4.8 | **4.5 x 10.1, 6.5** | The stone at 1.35 in a holder, the people at their own size on its steps (`RIALTO_SCALE`); the Grand Canal four wide under a 3.1 soffit. Its card comes in from the south-east (`yaw` 0.75), because from the south a bridge across an east–west canal shows only its steps |
| Etna | 6.6 x 7.0, 9.2 | unchanged | As it is; card glide at 34 so the plume stays in frame |

`italy-reactions.mjs` now checks every corner of each landmark's box inside the 34-degree card frame from the three azimuths, with its `approach` applied, and holds each at landmark scale. Its room and card frame checks honour every `approach` override.

#### The Colosseum's tiger and fighter

The old Italy world (before `0e09b3b`) had two gladiators circling and lunging and a tiger pacing the far side of the arena, always on. The rebuilt reaction brings them back on the click, in the current style: a tiger with its stripes, pale belly, hinged legs and tail pads out of the east gate, and a gladiator — the same resident figure as everyone else, with a crested helmet, a round red shield and a short sword — steps out of the west gate; they circle, the tiger springs, the shield comes up, and both go back through their gates. His legs step with the distance he covers. The swifts still spiral out of the upper arcades and the guide points. At rest the arena is empty. The reaction's named subject is now `it-tiger`; `italy-reactions.mjs` asserts both figures hidden at rest and out at the 1.6-second arrival, and the swifts still flying.

**Owner ruling, 2026-09-23:** a landmark may keep its iconic reaction even when its figures are outside the area's period band, because it is the memory of the place the visitor expects; the card text stays in period. The Colosseum's card still describes the ruin with swifts of about 1900. The band grep in `italy-reactions.mjs` exempts the `colosseum` builder by name; a gladiator or a tiger anywhere else in `props-italy.ts` still fails. The ruling is also in `docs/building-a-world.md`, section 6.3.

#### Room and card flights after the move

Checked on the live page at both ends of the orbit (azimuth -0.75 and 0.75) as well as the middle: three room flights ended inside a neighbour from one end — the trattoria in the porcini wood's crowns, the pasticceria and Ballarò in the Albergheria house — and now carry `approach: { yaw: 0 }`, so they always come in from the south where their lanes are open. The market's room flight comes in high (`dist` 12, `pitch` 0.75) over the Trevi. The Builder's room-approach rule (`inRoomApproach`) skips an object that declares its own approach pitch, and `tryPlace` takes one flag so the Trevi alone is placed on the ray check rather than the wedge.

#### The harness

`italy-world.mjs` gained three checks, with the table above as data: every object belongs to exactly one cluster (a hit-only child to its parent's) and no anchor stands further from its cluster's centre than that cluster's radius (Rome 13.2, the Agro 10.5, Venice 11.8, the terraferma 4.0, Palermo 10.7, the tonnara coast 14.0: the measurement plus about 0.3); any two clusters' hulls keep 8 units of open ground; no object or footprint of one cluster stands inside another's hull. A fourth: no house or stand building stands in water or within 1.0 of it. A negative run with Rome's radius set to 9 fails naming the Pantheon, the caffè, the pasta kitchen and the herb beds.

#### Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `italy-world.mjs` | "PASS: six clusters (radius rome 12.9, agro 10.1, venice 11.4, terraferma 3.6, palermo 10.3, tonnara 13.7; the closest two hulls 8.1 apart), 20 continuous roads in 5 networks, one sea with 7 holes, the strait at 4.46 and no bridge, 46 objects on dry ground with 36 props measured, 13 houses, 1 built crossing, 7 boats, 23 walkers, 240 seconds of motion." Every stand ceiling still empty: no stand over water, no stand behind a stand, no footprint pair under 1.0, no door off a road |
| `italy-reactions.mjs` | Passes, with the landmark frame and scale checks and the Colosseum's arena check |
| Live ten-ray check, fresh load, 1280 x 720, every visible mesh a blocker | **36 of 36 at 10 of 10** |
| Live room-flight check, 13 rooms at azimuths -0.75, 0, 0.75 | No flight ends in or behind anything but its own stand |
| `__fw.audit(40)`, fresh load | 44 movers, no violations |

The page was loaded fresh in this agent's own tab from a copy of `index.html` with `WebSocket` stubbed (so other agents' edits could not reload it), with the dev server left running. Contact sheet: `italy-recluster.png` in this pass's scratchpad (overview at 1280 x 720 and 390 x 844, the zoom limit, the six clusters at approach zoom, the five landmark cards, the Colosseum mid-reaction); shots are `.data/shots/it-rc-*.jpg`.

**Not verified in this pass:** the rooms themselves (no room file changed); the phone views beyond the overview, the zoom limit and the Colosseum's card; watching the arena reaction in real time rather than stepped; reduced motion; flicker while moving or zooming; the published site (nothing was pushed).
