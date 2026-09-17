# Thailand world (area id `bangkok`)

The `bangkok` area of the Southeast Asia world grows from two card-only areas — Bangkok and the Andaman coast — into one Thailand. This document follows the [team playbook](agent-team-playbook.md): it records the session baseline, the Stage A research hand-off and the shared contracts, and later the build, the animation inventory and the checks. The pictures do not exist; the [image brief](thailand-image-brief.md) is the Stage A deliverable and the build waits for the files.

The Researcher's delivery is [thailand-research.md](thailand-research.md): area brief, palette basis, clothing profiles, proposed objects, room list, the corrections a Thai image prompt needs, dated story facts with sources, and open questions. The repertoire is `src/fw/thailand-repertoire.ts`.

## Stage 0: session baseline, 2026-09-17

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes, before and after `thailand-repertoire.ts` was added |
| `npm test` | 17 harnesses pass: `camel-gait`, `object-ids`, `prop-reactions`, `prop-supports`, `recipe-addon`, `repertoire`, `room-controls`, `room-loops`, `scene-ambience`, `spain-reactions`, `spain-world`, `turkey-reactions`, `turkey-world`, `village-speech`, `world-availability`, `world-intros`, `xinjiang-reactions` |
| `node scripts/audit/objects.mjs` | Runs and matches the [quality baseline](quality-baseline.md) for China, the Middle East and the Mediterranean. **It does not report this area at all**: line 6 filters to `['china','middle-east','mediterranean']`, so `southeast-asia` is invisible to it. The baseline below was read out of `graph.ts` and `world-seasia.ts` by hand, the same way Britain's was |
| Breeze masks | Not re-run, and nothing to run them on: the Southeast Asia world has no painted scenes, so it has no masks |
| Live world | **Not looked at.** Stage 0's live pass belongs to the lead, and this session is the Stage A researcher. Everything below the audit line is read from the code and is marked as such |

Two things that are not defects but that the lead should know before Stage B:

- `scripts/audit/objects.mjs` has to learn `southeast-asia` before this area can have baseline numbers in the ordinary way. It is a one-line change in a file nobody in Stage A owns, and it is the same one-line change Britain asked for with `central-europe`.
- `PUBLISHED_WORLDS` in `world-availability.ts` holds `china`, `middle-east` and `mediterranean`. Southeast Asia is not published, so the public page shows it asleep, and Hanoi and the Mekong delta sit beside Thailand at the same pre-China-standard level that Greece, Morocco and Dalmatia did beside Spain.

## What the `bangkok` and `andaman` areas are today

The Southeast Asia table is 76 x 56 world units (`world-seasia.ts`), x from -38 to 38 and z from -28 to 28, with the sea to the east and south, the Chao Phraya running north to south at about x -4, a khlong basin at (-4, 2) and a Mekong channel across the west.

- `AREAS.bangkok` is `{ world: "southeast-asia", name: "Bangkok", zh: "กรุงเทพฯ", blurb: "the wat, the floating market, curry paste and tuk-tuks", center: [0, -8] }`
- `AREAS.andaman` is `{ world: "southeast-asia", name: "Andaman coast", zh: "อันดามัน", blurb: "karsts, longtails, coconuts and the beach", center: [18, 10] }`

Between them the two areas have **thirteen objects, no rooms and no scene folder.**

| Object | Area | Kind | Prop | Position | Blurb | Reaction today |
| --- | --- | --- | --- | --- | --- | --- |
| `floatingMarket` The floating market | bangkok | place, `place: true`, `open: "reveal"` | `floatingMarket` | [-4, 2] | 352 chars, 1 para | Reveals four child stalls |
| `curryPaste` Curry paste & the wok | bangkok | technique, `place: true` | `curryKitchen` | [7, -4] | 555, 1 para | Prop reaction |
| `chilliesSea` Chilli, galangal & lemongrass | bangkok | flavour | `spiceStall` | [-12, -8] | 450, 1 para | Prop reaction |
| `wat` The wat | bangkok | landmark | `wat` | [6, -14] | 413, 1 para | Prop reaction |
| `almsRound` The alms round | bangkok | landmark | `almsRound` | [-9, -14] | 323, 1 para | Prop reaction |
| `tukTuk` Tuk-tuks | bangkok | landmark, `hitOnly` | **`none`** | [12, -8] | 204, 1 para | **None.** No mesh, no `poke` |
| `coconutSea` Coconut | andaman | ingredient | `coconutSea` | [14, 8] | 473, 1 para | Prop reaction |
| `karsts` Limestone karsts | andaman | landmark, `hitOnly` | **`none`** | [28, -7] | 342, 1 para | **None** |
| `longtail` Longtail boats | andaman | landmark, `hitOnly` | **`none`** | [24, 12] | 336, 1 para | **None** |
| `stall-fruit` Mangoes, rambutan & durian | bangkok | dish, `hitOnly`, child | `none` | market | 411, 1 para | None |
| `stall-noodles` Boat noodles | bangkok | dish, `hitOnly`, child | `none` | market | 408, 1 para | None |
| `stall-herbs-th` Herbs & chillies | bangkok | ingredient, `hitOnly`, child, alias | `none` | market | empty | None |
| `stall-coconut` Coconuts | bangkok | ingredient, `hitOnly`, child, alias | `none` | market | empty | None |

Counts: **0 rooms, 6 card-only clickables with a prop, 7 hit-only or child.** By kind: 3 ingredient, 2 flavour, 1 technique, 1 place, 2 dish, 4 landmark. **Three of the four landmarks have `prop: "none"`**, so they have a card and a hit box and nothing else, exactly the defect Britain found on `redBus`. Blurbs run **204 to 555 characters, one paragraph each**, and two of the thirteen are empty.

What the world file builds around them (`layoutSeasia`):

- **Ground**: Bangkok's paving tint at (2, -10), 14 x 12; a beach tint at (16, 12), 7 x 5.
- **Roads**: one closed seven-point loop through [0,-19.5], [11,-16], [10.5,0], [1.5,-8] at width 2.0. It is the only road on the Thai side and it is a closed loop, not a street plan.
- **Water**: one sea polygon east and south; the Chao Phraya as a nine-point Catmull-Rom curve at about x -4 from z -28 to z 22.5, drawn 4.5 wide on a 6.4 rim; a circular khlong basin of radius 6.8 at (-4, 2) where the floating market moors; a Mekong channel across the west.
- **Life**: three coloured `tukTuk()` vehicles circling the Bangkok loop, three `longtail()` boats on a lane through the karsts, six karsts, three beach parasols with loungers, four `tubeHouse()` on the Thai side, date palms recoloured green as stand-ins for coconut palms, banana trees, two mountains, and three walker loops shared with the rest of the world.

So Thailand has **one road loop, one river, one basin, one beach, no cluster structure, no decorative houses of a Thai type, no rooms, and no non-food clickable with a 3D reaction beyond three props.** Against the China standard it is short of everything: four or more clusters, ten or more stands, five or more ingredient stops, three or more walker loops, rooms.

**What depends on the two ids.** `graph.ts` routes every recipe whose cuisine is `Thai` to `area: "bangkok"`; the green-curry enrichment row carries `area: "bangkok"` and `place: "curryPaste"`; `world-intros.ts` names `bangkok` in beats 1 and 3 of the Southeast Asia intro and `andaman` in beats 2 and 3; both ids are in the `Area` union in `graph.ts`. **`bangkok` and `curryPaste` may not change.** `andaman` appears nowhere else — not in `map.ts`, not in the scene files, not in the props file, not in any harness.

## Stage A: the recommendation — one Thailand, or two areas

**Recommendation: merge them into one area.** Keep the area id `bangkok`, change the display name in `AREAS` to **Thailand**, keep the khlongs of Bangkok as the densest cluster and the arrival view, and grow the country and both coasts round it in six clusters — exactly the shape Spain took when the Plaza Mayor kept its place and the Albufera, La Mancha, the ría, Andalusia and the Basque coast grew around it, and the shape Britain took a day ago. `andaman` is retired as an area id and its three objects — `coconutSea`, `karsts`, `longtail` — move into Thailand's southern cluster with their positions re-laid.

Four reasons, in the order they decided it.

1. **The alternative the owner named would ship a stub beside a finished area.** "Two areas with one built to standard" means Thailand at the China standard and the Andaman coast left at three objects, two of which have no 3D reaction at all and one of which — the longtail boat — is out of the period band. That is the Turkish market's sumac card at the scale of a whole area: a thing the owner opens and finds a fraction of the length of its neighbours. If the south is worth keeping, it is worth building; if it is not, it should not be a separate island on the atlas.
2. **Two areas both built to standard is more work than the table can hold.** The definition of done asks a built region for four or more clusters, ten or more stands and five or more ingredient stops. Doing that twice on a table that also carries Hanoi and the Mekong delta means roughly fifty objects and twenty-four rooms in 76 x 56 units. Turkey's four-area split works because Turkey is the whole world's subject; Thailand shares its world with Vietnam.
3. **The regions are clusters, not countries.** Thai food is strongly regional — central, Isan, Lanna, southern, with the Chinese-Thai and Muslim-Thai strands cutting across all four — and every one of those regions is inside one country with one arrival view and one continuous walk. Spain's six clusters gave the area six unlike-each-other looks, and that variety is most of why it reads. Thailand has the same range: a canal basin, a new brick street, a flooded plain, a dry plateau, a mountain valley and a limestone coast.
4. **Almost nothing in the code has to break.** The area id, the `Area` union entry for `bangkok`, the Thai recipe routing and the `curryPaste` recipe target all stay exactly as they are. What changes is the `AREAS.bangkok` `name` and `blurb`, which are display strings; the `area` field on three objects; the removal of `andaman` from the `Area` union and from `AREAS`; and two `areas` arrays in `world-intros.ts`, where `["hanoi","andaman"]` becomes `["hanoi","bangkok"]` and `andaman` drops out of the third beat's list. `andaman` is referenced in no other file.

**If the lead keeps two areas instead**, the object list below splits at the cluster line: clusters 1 to 5 stay `bangkok` and cluster 6 becomes `andaman`, which then holds three rooms, two stops and two landmarks. Every id, kind, purpose, reaction and repertoire entry is unaffected; only the `area` field and the positions move. That is a real option and it costs nothing in Stage A — but it should be chosen knowingly, because it means the world intro keeps describing the Andaman coast as a peer of Bangkok when it is one cluster of it.

### Blueprint frame (provisional, Stage B fixes it)

The current 76 x 56 table cannot hold a Spain-scale Thailand: the Thai side runs about x -14 to 22 and z -28 to 20, and Hanoi sits inside that at x 13 to 22, z -25 to -4. The Researcher's proposal, for the lead to accept, redraw or reject at Stage B:

- **Grow the table west.** `W: 116, D: 56, cx: -20`, so x runs from -78 to 38 and z stays -28 to 28. Every existing Hanoi, Mekong and sea coordinate keeps its value, and the `|z| >= 28` edge test in `shore()` is untouched, which growing `D` would break.
- **Thailand then owns roughly x -78 to -12, z -28 to 24**, with the Gulf and the Andaman sea wrapping its south and west, square at the table edge, and the Chao Phraya re-laid on the Thai side with a khlong grid off it.
- **Three known costs, all the lead's to price.** (a) `shore()`'s edge test is `Math.abs(x) >= 38`, a hand-written constant that must become the table's own half-width or the sea stops reading as square at the new western edge. (b) The Mekong delta curve begins at x = -38, which becomes interior; it must be extended west or, better, moved — the Mekong delta is south-east of Bangkok in reality and sits west of it today. (c) The six karsts, the three longtail boats and the beach parasols in `layoutSeasia` are all in the eastern sea and have to move to the new Andaman coast with the cluster.
- The arrival view becomes the khlongs cluster: `AREAS.bangkok.center` about **[-44, 0]**.

Every position in the object list below is written in that proposed frame and is **provisional**. If the lead chooses another frame the ids, kinds, clusters, purposes and reactions are unaffected; only the coordinates move.

### Recommendations on the open questions

Section 5 of [thailand-research.md](thailand-research.md) raises twelve questions. These are the Researcher's recommendations; the lead confirms or overrides each one and this table becomes the decisions record.

| Question | Recommendation |
| --- | --- |
| One area or two | **One.** Merge, id `bangkok` unchanged, display name "Thailand", `andaman` retired. Argued above |
| The table frame | Grow west to `W: 116, cx: -20`. A Stage B decision; nothing in Stage A depends on it |
| Rooms: twelve, or thirteen and fourteen | **Twelve.** The playbook allows ten to fifteen, Spain shipped twelve, Britain thirteen. Twelve across six clusters gives 3 / 3 / 1 / 1 / 1 / 3 and a budget of 43 images. A second Lanna room and a second Isan room would flatten it to 3 / 3 / 1 / 2 / 2 / 3 at 49 images, and section 2.1 of the research names both |
| **The period band** | **About 1880 to 1910**, the later reign of Chulalongkorn, everyday working clothes. **This is the owner's decision, not the lead's**, because it removes pad thai, green curry, the longtail boat and the tuk-tuk from every painting, and three of those four are things the area currently advertises. Every room is anchored inside the band by a dated record, and it is the first Siamese reign that is photographed rather than painted, so a brief written from it can be checked |
| Dishes younger than the band: pad thai (1940s), green curry (documented 1926), the modern boat-noodle broth, som tam's Bangkok career | **Paint the in-period thing and put the date on the card**, which is Spain's gilda answer, applied four times instead of once. Nothing out of band appears in a painting. Pad thai is named in the shophouse's repertoire line as the descendant of the wok-fried noodle; green curry keeps its place in the `curryPaste` repertoire with "not documented before 1926" in its line, and carries the one real Thai recipe id in the export |
| The longtail boat (1930s) and the tuk-tuk (1960s) are outside the band | **Recast both, retire neither.** `longtail` becomes the sea people's boats — the Moken, Moklen and Urak Lawoi `kabang` hollowed from a single log — and `tukTuk` becomes the pulled rickshaw, which reached Siam from the 1880s. Both gain a real prop and a 3D reaction, which neither has today. `karsts` keeps its subject and gains the existing `karst()` prop for the same reason |
| "Curry paste & the wok" | **Rename to "The curry mortar"**, id `curryPaste` unchanged, `place: true` unchanged, `placeName` unchanged, the green-curry recipe target unchanged. The wok belongs to the Chinese shophouse and is going there. A name change without an id change: **every agent is told here** |
| The three circling `tukTuk()` vehicles in `layoutSeasia` | Decor, not objects, and out of band for the same reason. They become rickshaws or ox carts in the same pass as the object recast. A Builder task, named so it is not missed |
| `floatingMarket` would carry both `open: "reveal"` and `scene` | **Open.** No object in the code has both. Either the engine already handles it, the market's room needs a second object, or the reveal is dropped and the four stalls become ordinary siblings. A Stage B question the Researcher could not answer from the data files |
| `stall-noodles`'s existing blurb | Rewrite. It describes the modern dark boat-noodle broth and names pad thai as the national dish, which makes it the most out-of-band paragraph in the area, and it sits on a child card reached from the hero room. It also needs a `NEXT` to `kuaitiaoRuea` so the two do not duplicate |
| Card blurb length | The whole area is far below band and has to come up. See "Shared contract: the card blurb band" below |
| Thai script in the speech lines | Section 2.5 of the research writes the Isan, Northern Thai and Patani Malay lines in central Thai orthography, which is how they are ordinarily written but is not how they are spoken. **A Thai reader should check section 2.5 before those lines ship.** The dish names and place names in the repertoire I am confident in |
| Unverified facts (the small bowls and the wake, the egg whites in building mortar, street food's Chinese-quarter origin, the "one third on the water" estimate, the 1869 papaya-salad reference, the Chinese arrival numbers) | Stay out of cards until verified in Stage C, or are written as "reported", "estimated" or as a range, exactly as section 5 of the research says. Nothing above goes in as a flat statement |
| Clothing inventory numbers | **Open.** As with Britain, the research has named collections and no inventory numbers. Before generation the picture reviewer pulls one catalogued garment or photograph per profile from the National Museum Bangkok, the Queen Sirikit Museum of Textiles, the Chiang Mai National Museum, the National Archives of Thailand, the Thai Hua Museum in Phuket and the Baan Kudichin Museum. Profiles 1, 5, 6 and 7 matter most |
| `scripts/audit/objects.mjs` ignores `southeast-asia` | Teach it the world before Stage B, so the area has baseline numbers in the ordinary way |

## Shared contract: the object list

Positions are in the proposed frame above (x from -78 to -12, z from -28 to 24) and are the **Stage A proposal**; the Stage B blueprint fixes them. Every object has `world: "southeast-asia"`, `area: "bangkok"`. Ids were checked against every id in `src/fw/*.ts`; none of the nineteen new ones collides, and `scripts/tests/object-ids.mjs` guards this once they are registered. Prop names were checked against `SEASIA_PROPS`; none collides.

### Objects that open rooms (12)

| id | name | zh | kind | pos | prop | scene | purpose | reaction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `floatingMarket` | The floating market | ตลาดน้ำ | place | [-44, 2] | `floatingMarket` | `th_khlong` | Existing id and name, new room: a market held from boats, because the street was water. The hero | A cleaver takes the top off a young coconut and the water runs into a cup; the paddler steadies the boat; a buyer in the next boat leans across |
| `kuaitiaoRuea` | The noodle boat | ก๋วยเตี๋ยวเรือ | dish | [-40, -2] | `noodleBoat` | `th_noodleboat` | One pot, one paddle, small bowls handed up over the gunwale | The ladle lifts out of the pot and pours broth into a bowl; the cook turns; an eater on the stage reaches down |
| `wangKitchenTh` | The household kitchen | ครัวในวัง | place | [-36, -6] | `wangKitchen` | `th_wang` | The noble compound's kitchen, where the first Siamese cookbook was written down | The knife turns a chilli into a flower and it opens; the carver's hands follow; the older woman at the tray looks over |
| `curryPaste` | The curry mortar | ครกหิน | technique | [-33, -1] | `curryKitchen` | `th_curry` | Existing id, new name: granite, a quarter of an hour, and cream fried until the oil splits | The pestle comes down and the paste moves under it; the coconut cream ring widens in the pan; the girl at the stove fans harder |
| `sweetsTh` | The sweets kitchen | ขนมไทย | place | [-48, 4] | `khanomKitchen` | `th_sweets` | Egg, sugar and coconut over charcoal at Kudi Chin, and a Portuguese inheritance | The cone draws golden threads down onto the syrup; the maker's arm sweeps back; the child at the rack leans in |
| `shophouseTh` | The shophouse kitchen | ร้านตึกแถว | place | [-29, -4] | `shophouseTh` | `th_shophouse` | Sampheng's Teochew kitchen: the wok, the noodle, the roast meats, the charcoal | The wok tosses and the noodles lift clear in one mass; the flame rises round the rim; the chopper at the block looks up |
| `naKhaoTh` | The rice-field lunch | ข้าวกลางนา | place | [-54, -12] | `fieldLunch` | `th_paddy` | The meal carried out to the harvest and cooked on the bund | The banana leaf peels back off the fish on the fire; the cook's hands follow; the buffalo raises its head in the far square |
| `isanGrillTh` | The Isan grill | ปิ้งย่างอีสาน | place | [-26, -21] | `isanGrill` | `th_isan` | Charcoal, a clay mortar and a basket of sticky rice on the dry plateau | The pestle strikes down into the clay mortar and the papaya turns under it; the chickens in their clamps roll over; a child looks up from the basket |
| `khaoSoiTh` | The Lanna kitchen | ข้าวซอย | dish | [-50, -25] | `lannaKitchen` | `th_lanna` | Khao soi from the caravan road, sai ua on the grill, and a khantoke tray | The coil of sai ua turns on the grill and the fat catches; the crisp noodle nest settles on the bowl; the muleteer in the doorway steps in |
| `talayTh` | The Andaman fishing kitchen | ครัวชาวเล | place | [-66, 12] | `andamanKitchen` | `th_andaman` | Turmeric, fresh fish and a fire on the sand under the limestone | The fish turns on the green-stick grill and the skin lifts; the cook's tongs follow; the man at the net looks round |
| `muslimKitchenTh` | The Malay-Muslim kitchen | ครัวมลายู | place | [-56, 18] | `muslimKitchen` | `th_muslim` | Roti on the steel plate, budu in the jar, and the curries of the deep south | The roti disc is thrown out thin and settles onto the plate; the maker's hands follow; a child on the step reaches up |
| `babaTh` | The tin town kitchen | ครัวบาบ๋า | place | [-64, 17] | `babaKitchen` | `th_baba` | A Phuket Baba household in a Sino-Portuguese shophouse, on tin money | The tiffin tier lifts clear of the stack with steam off it; the clay pot's lid is set down; the woman at the table turns |

### Ingredient stops, card only (10, two existing)

| id | name | zh | kind | pos | prop | purpose |
| --- | --- | --- | --- | --- | --- | --- |
| `chilliesSea` | Chilli, galangal & lemongrass | พริก ข่า ตะไคร้ | flavour | [-31, 2] | `spiceStall` | Existing. Re-sited to the Sampheng spice stall beside the mortar; the Portuguese chilli and four aromatics that were always here |
| `coconutSea` | Coconut | มะพร้าว | ingredient | [-60, 11] | `coconutSea` | Existing. `area` changes from `andaman` to `bangkok`; re-sited into the southern groves. First pressing is cream and is fried until the oil splits |
| `naPaddyTh` | The paddy and the buffalo | นาข้าว | ingredient | [-58, -9] | `paddyTh` | Wet rice in bunded squares, the buffalo that ploughs it, and the export trade that cleared the delta to grow it |
| `plaTh` | The river fish and the traps | ปลาน้ำจืด | ingredient | [-50, -7] | `fishTraps` | Snakehead, catfish and gourami out of the canals and the flooded fields; the fish of the first written tom yum recipe, 1888 |
| `suanTh` | The river orchards | สวนผลไม้ | ingredient | [-50, -16] | `riverOrchard` | The Nonthaburi riverside orchards on ridged beds: durian, mangosteen, mango and rambutan |
| `tanTh` | The sugar palms | ตาลโตนด | ingredient | [-58, -16] | `sugarPalms` | Phetchaburi's toddy palms, the climb, the bamboo cylinder under the cut flower stalk and the flat boiling pan |
| `kluaTh` | The salt pans | นาเกลือ | ingredient | [-46, 12] | `saltPans` | Sea water let into tiled pans in the dry season; the salt every fermented thing in this area depends on |
| `plaRaTh` | The pla ra jars | ปลาร้า | flavour | [-22, -18] | `plaRaYard` | Freshwater fish under salt and rice bran for six months; Isan's protein, its seasoning, and its fish sauce before there was a bottle |
| `miangTh` | The tea gardens | เมี่ยง | ingredient | [-55, -22] | `miangGrove` | Assam tea under the forest canopy, steamed and fermented in bamboo baskets, and chewed rather than drunk |
| `khamminTh` | Turmeric and the southern beds | ขมิ้น | flavour | [-54, 15] | `turmericBeds` | Turmeric, which stains every southern curry, with black pepper, krachai and the heat the south is known for |

### Landmarks with a card and a 3D reaction (6, five existing)

| id | name | zh | kind | pos | prop | reaction |
| --- | --- | --- | --- | --- | --- | --- |
| `wat` | The wat | วัด | landmark | [-42, -8] | `wat` | Existing, in period. The chedi's gold catches, a `chofa` finial turns toward the sun and a bell swings |
| `almsRound` | The alms round | บิณฑบาต | landmark | [-48, -6] | `almsRound` | Existing, in period. The line of monks steps forward and a hand lowers rice into the nearest bowl |
| `karsts` | The limestone karsts | เกาะหินปูน | landmark | [-72, 9] | `karst` (new for this object; replaces `none`) | Existing subject, first reaction. Swifts leave the overhang and the water flashes at the undercut base |
| `longtail` | The sea people's boats | เรือชาวเล | landmark | [-70, 15] | `mokenBoat` (new; replaces `none`) | **Recast to the Moken and Urak Lawoi `kabang`.** The boat rocks on its mooring, the palm-thatch roof lifts and a child on the bow turns |
| `tukTuk` | The rickshaw | รถลาก | landmark | [-27, -1] | `rickshaw` (new; replaces `none`) | **Recast to the pulled rickshaw, in Siam from the 1880s.** The puller leans into the shafts and the hood rocks back |
| `chinHawTh` | The Chin Haw caravan | จีนฮ่อ | landmark | [-45, -26] | `muleCaravan` | New. The lead mule steps off, the pack panniers swing and the muleteer shifts the halter |

**Nothing is retired.** All seven existing ids in the two areas survive, plus the four hit-only children of the market.

Counts against the definition of done: **12 room stands, 10 ingredient stops, 6 landmarks, 28 objects; 16 card-only clickables that are not food stands**, against the required three, plus the four hit-only market children. By kind: **9 place, 2 dish, 1 technique, 7 ingredient, 3 flavour, 6 landmark.** Spain shipped 12 / 10 / 4 and 14; Britain proposed 13 / 10 / 6 and 16. The two areas today are 0 / 3 / 4 and 6, and three of those four landmarks have no prop.

## Shared contract: clusters and water

Six clusters. One line of character each.

| Cluster | Centre | Character in one line | Holds |
| --- | --- | --- | --- |
| The khlongs | [-44, 0] | Brown water used as a street: the arrival view, the densest cluster, and the only one where almost nothing stands on dry ground | `floatingMarket`, `kuaitiaoRuea`, `sweetsTh`, `wat`, `almsRound` |
| The old city and Sampheng | [-33, -3] | One whitewashed compound wall and one newly cut brick street beside it, where the palace's written recipes and the Teochew wok are four minutes apart | `wangKitchenTh`, `curryPaste`, `shophouseTh`, `chilliesSea`, `tukTuk` |
| The central plain | [-54, -12] | Flat wet rice to the horizon, and every sweet, salt and sour thing the rest of the table seasons with growing in one place | `naKhaoTh`, `naPaddyTh`, `plaTh`, `suanTh`, `tanTh`, `kluaTh` |
| Isan | [-26, -21] | Dry, sandy and higher, where a short rainy season is answered with glutinous rice, charcoal and a jar left shut for six months | `isanGrillTh`, `plaRaTh` |
| Lanna | [-50, -25] | Cool mountain valleys with low wide roofs and a caravan road out of Yunnan, a separate kingdom until 1899 and it still tastes like one | `khaoSoiTh`, `miangTh`, `chinHawTh` |
| The southern peninsula and the Andaman | [-62, 14] | Limestone out of green water, turmeric in everything, and three kitchens on one coast that do not share a language | `talayTh`, `muslimKitchenTh`, `babaTh`, `coconutSea`, `khamminTh`, `karsts`, `longtail` |

**Water (proposal).** One continuous `seaWater()` wraps Thailand's south and west, square where it meets the table edge, with the Andaman on the west side of the peninsula and the Gulf on the east. One river runs from the northern hills at about [-52, -27] south through the central plain and the khlongs and reaches the Gulf at about [-40, 20] with an `estuaryWater` blend, and a **grid of three or four straight khlongs** runs off it through cluster 1 and out into the paddy of cluster 3 — the canals are what makes this area look like nowhere else on the atlas and they should be cut early, not added at the end. The existing khlong basin becomes the floating market's mooring at about [-44, 2]. Nothing stands in open water except the boats, the raft houses, the houses that are built on posts to stand in it, and the one buffalo. The Albufera lesson applies twice over here, because six of the twelve rooms are on or beside water: every stand goes **beside** the water, and `scripts/tests/thailand-world.mjs` should test every vertex of every stand against the sea, the river, the khlongs and the estuary from the first commit, not after the review.

## Shared contract: rooms

Twelve rooms. The room list, the three discovery subjects, the signature motion, the supporting cues and the sprites per room are in section 3 of [thailand-research.md](thailand-research.md) and, in final form, in the [image brief](thailand-image-brief.md).

| Room id | Folder | Opens from | Signature motion | Sprites |
| --- | --- | --- | --- | --- |
| `th_khlong` | `public/scenes/th_khlong/` | `floatingMarket` | A cleaver taking the top off a young coconut, the water pouring into a cup | `th_motion_egret`, `th_motion_pla_tapian` |
| `th_noodleboat` | `public/scenes/th_noodleboat/` | `kuaitiaoRuea` | The ladle tipping broth from the pot into a bowl | none |
| `th_wang` | `public/scenes/th_wang/` | `wangKitchenTh` | A small knife turning a chilli into a flower | `th_motion_pla_tapian` |
| `th_curry` | `public/scenes/th_curry/` | `curryPaste` | The pestle coming down into the granite mortar | `th_motion_garlic_string` |
| `th_sweets` | `public/scenes/th_sweets/` | `sweetsTh` | Golden foi thong threads falling from the cone onto the syrup | none |
| `th_shophouse` | `public/scenes/th_shophouse/` | `shophouseTh` | The wok tossed and the noodles lifting clear in one mass | `th_motion_lantern` |
| `th_paddy` | `public/scenes/th_paddy/` | `naKhaoTh` | The banana leaf peeling back off the fish on the fire | `th_motion_egret` |
| `th_isan` | `public/scenes/th_isan/` | `isanGrillTh` | The wooden pestle striking into the clay mortar of papaya | `th_motion_garlic_string` |
| `th_lanna` | `public/scenes/th_lanna/` | `khaoSoiTh` | The coil of sai ua turned once on the grill | `th_motion_sai_ua` |
| `th_andaman` | `public/scenes/th_andaman/` | `talayTh` | A turmeric-rubbed fish turned on the green-stick grill | `th_motion_squid_line`, `th_motion_egret` |
| `th_muslim` | `public/scenes/th_muslim/` | `muslimKitchenTh` | A roti disc thrown out thin and settling onto the plate | none |
| `th_baba` | `public/scenes/th_baba/` | `babaTh` | A tiffin tier lifted clear of the stack, steaming | `th_motion_lantern` |

**Three rules carried into every room prompt, from the Spain and China passes.** They are in full in the image brief's opening section and repeated per room:

- Every hanging object meant to move is a **separate keyed sprite**, and the painting shows only its **empty hook, rail, line, nail, beam or bracket**, against a plain wall, sky, water or plank that is a different tone from the sprite. No cut-outs from finished paintings, ever, and no warm teak, gold or lacquer wall where a key would be wanted.
- Every hot vessel is pictured **open**; every pour shows a **clear lip, a visible stream and a clear landing surface**.
- Portrait compositions keep every subject that matters inside the **middle 80 per cent of the width** (x .094 to .906), because a phone crops the rest.

And two that belong to this area in particular:

- **Half this area is cold and must not be steamed.** Fruit on a boat, raw vegetables, drying squid, a jar of `pla ra`, a jar of `budu`, iced `khao chae`, Nyonya porcelain: none of these has a hot process behind it, and the image brief asks the generator to list them per file so the Room maker has the dry list before it measures anything. Spain's cheese farm steamed over a cold caldero and the owner read the room's own text and asked why.
- **Nobody stands in open water.** Six rooms have water in them. The only figure in water anywhere in this area is the buffalo in `th_paddy`, and it is there on purpose.

**Sprites: six.** `th_motion_lantern`, `th_motion_garlic_string`, `th_motion_squid_line`, `th_motion_sai_ua`, `th_motion_egret`, `th_motion_pla_tapian`. Card illustrations: one per room, twelve. **Total image count: 43** — one concept, twenty-four room paintings, six sprites, twelve cards.

## Shared contract: the repertoire

`src/fw/thailand-repertoire.ts` holds `THAILAND_REPERTOIRE`, keyed by all twelve room objects plus the two `kind: "dish"` children of the floating market, hero first. No landmark and no ingredient stop carries one, which is the handbook's rule: a salt pan and a rickshaw have no kitchen. Entry counts: `wangKitchenTh` 8; `floatingMarket`, `curryPaste`, `sweetsTh`, `shophouseTh`, `isanGrillTh` 7 each; `naKhaoTh`, `khaoSoiTh`, `talayTh`, `muslimKitchenTh`, `babaTh` 6 each; `kuaitiaoRuea` 5; `stall-fruit` 4; and `stall-noodles` **exactly 1**, because one boat selling one dish is a list of one and silence is not. **Eighty-three entries**, every line inside the 12-to-25-word band, every `zh` a real Thai, Northern Thai, Malay or Hokkien name in its own script rather than a translation of the English.

**One `recipe` id, and it is exact.** `public/static/recipes.json` holds eighty-nine recipes and exactly one whose cuisine is `Thai`: "Thai Green Curry Chicken", `43fe3973-050b-4d25-85dd-e560d0f5ec5d`. It is attached to the green-curry entry of `curryPaste`, which is the object the existing enrichment row already points at with `place: "curryPaste"`. Nothing else in the table names a recipe, because nothing else in the export is a Thai dish.

Verified by building the module and counting: 14 keys, 83 entries, 1 recipe link that resolves, 0 lines outside the band. `npm run typecheck` passes with the file present and unimported. Wiring the table into `src/fw/repertoire.ts` — adding it to `REPERTOIRE_TABLES` and extending `scripts/tests/repertoire.mjs`'s `tables` array and room-id set — is a Stage D registration, not a Stage A change.

## Shared contract: the card blurb band

**This area's existing blurbs are far below the standard, and the band has to be raised before a single new card is written.** Measured on 2026-09-17 by building `graph.ts` and counting characters:

| File | Blurb lengths | Shape |
| --- | --- | --- |
| Southeast Asia objects in `graph.ts` (all 24) | 204 to 555 characters, and 2 empty | One paragraph each |
| The thirteen `bangkok` and `andaman` objects | 204 to 555 characters, and 2 empty | One paragraph each |
| `spain-objects.ts` room objects (12) | 2,545 to 3,218 characters | Three to five paragraphs |
| `spain-objects.ts` card-only objects (14) | 762 to 974 characters | Three paragraphs |

The definition of done asks for a three-to-five-paragraph blurb with dated eras and local-script names, and the band rule says a card sits beside the cards around it. Both point the same way: **the band for this area is Spain's**, and it is set now, at Stage A, not discovered at the walkthrough.

- **Room objects: three to five paragraphs, about 2,500 to 3,200 characters.**
- **Card-only objects — every ingredient stop and every landmark: three paragraphs, about 750 to 1,000 characters — identity, the record with its dates and sources, and a route out to a related place.**
- **The seven retained objects are rewritten to the same band.** `curryPaste` (555 characters), `coconutSea` (473), `chilliesSea` (450), `wat` (413), `floatingMarket` (352), `almsRound` (323), `karsts` (342), `longtail` (336) and `tukTuk` (204) are all a fifth to a tenth of the length their new neighbours will run to. Leaving them is exactly the defect the rule was written for, and it would be worst on `floatingMarket`, which is the hero and the arrival view.
- **The four hit-only children are rewritten too**, including the two that are empty strings. `stall-noodles` and `stall-fruit` carry a repertoire now and are reachable from the hero room; `stall-herbs-th` and `stall-coconut` are aliases with empty blurbs and should either gain one or be told, in the file, why they do not need one.
- A thin card goes back at the Stage A check, not at the walkthrough.

Three to five dated facts per room object with sources, and two `NEXT` links each, are in section 4 of [thailand-research.md](thailand-research.md), grouped by object, with the sources listed by object in section 4.14. Six facts are flagged unverified and are kept out of cards until checked.

## Speech lines and palette

Section 2.5 of the research holds five to six ambient lines per room object, in Thai, Isan, Northern Thai, Teochew, Patani Malay and Hokkien with English on the same line. Section 1.3 of the image brief holds the twelve-colour palette (`khlongBrown`, `andamanGreen`, `teakDark`, `bambooPale`, `paddyGreen`, `limestoneGrey`, `watOrange`, `chediGold`, `lacquerRed`, `pelangiBlue`, `charcoalSmoke`, `stuccoPastel`) and section 1.5 of the research the eight clothing profiles. The Builder turns both into data in `thailand-architecture.ts` and `thailand-people.ts`.

## Stage A check

- **Every object has a unique id, a `kind`, an `area`, a position proposal, a prop, a purpose and a named reaction**: yes, 28 objects, seven of them existing, none retired, three recast. Nineteen new ids checked against every id in `src/fw/*.ts`; no collision. Prop names checked against `SEASIA_PROPS`; no collision.
- **Every historical claim has a source**: section 4 of the research, grouped by object, with URLs in section 4.14. Six facts are flagged unverified and are kept out of cards until checked.
- **Every kitchen room and every place-or-dish object has a repertoire**: fourteen keys, hero first, one to eight entries each, every line 12 to 25 words, one exact `recipe` id. Verified by building the module and counting: 83 entries, 0 problems. `npm run typecheck` passes and `npm test` is 17/17.
- **The card blurb band is written down before any card is written**, and the nine retained blurbs and the four child blurbs are booked for rewriting to it.
- **The period problem is named and answered four times**, not once: pad thai, green curry, the boat-noodle broth and som tam's Bangkok career all take Spain's gilda answer, and the longtail boat and the tuk-tuk are recast rather than painted out of period.
- **Image brief written with exact file names and the drop folder**: [thailand-image-brief.md](thailand-image-brief.md), 43 files into `~/Downloads/additional game asset/thailand/`.
- **Not done in this pass, and not this role's**: no second-agent review of the brief against the art direction (Spain's had one and it found twelve things on the first pass); no live look at the world; no picture acceptance, because there are no pictures; no check of the regional-language speech lines by a Thai reader.

## What happens next

**Stage B waits for the pictures.** Forty-three files into `~/Downloads/additional game asset/thailand/` with the exact names in the [image brief](thailand-image-brief.md). Nothing in Stage B starts on guessed pictures, and the owner has said development pauses until Monday while she generates them.

Before the files arrive, three things are open and none of them belongs to the Researcher:

- **The owner's decision on the period.** The band of about 1880 to 1910 removes pad thai, green curry, the longtail boat and the tuk-tuk from every painting, and three of those four are in the area's current blurb. The area is far better for it — a city whose streets are water is a stronger place than a night market — but it is her call, and everything else waits on it. If she prefers a contemporary Thailand, the brief is rewritten before any picture is generated and most of the research's records become background rather than subject.
- **The owner's decision on the two recasts**, the sea people's boats for the longtail and the rickshaw for the tuk-tuk. Both keep their ids and gain a 3D reaction they do not have today.
- **The Southeast Asia table's blueprint.** Thailand at Spain's scale does not fit the 76 x 56 table as it stands, and the frame proposed above grows the table west to `W: 116, cx: -20`, wraps a sea round Thailand's south and west, cuts a khlong grid off the river, and moves the karsts, the boats and the beach from the eastern sea to the new coast. It also has to settle whether the Mekong delta is extended west or moved. **That is the Lead's Stage B decision, not the Researcher's.** The object list's ids, kinds, clusters, purposes, reactions and repertoire are unaffected by whichever way it goes; only the provisional positions move. The lead should settle at the same time whether the grown area keeps one area id with six clusters, as recommended above and as Spain did, or splits into two as it is today — the recipe routing needs `bangkok` to exist either way, and `andaman` is referenced only in `graph.ts` and `world-intros.ts`.

Three smaller items for whoever opens Stage B: teach `scripts/audit/objects.mjs` the `southeast-asia` world so this area can have baseline numbers; resolve whether one object may carry both `open: "reveal"` and `scene`, which the floating market needs; and decide with the owner whether publishing Thailand means publishing the whole Southeast Asia world — Hanoi and the Mekong delta are at the card-only level and would go live beside it, as Greece, Morocco and Dalmatia did beside Spain.
