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
