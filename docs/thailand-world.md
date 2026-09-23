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

## Stage B: pictures and blueprint, 2026-09-21

### Picture acceptance

All 43 files arrived in `~/Downloads/additional game asset/thailand/` with the exact names from the [image brief](thailand-image-brief.md), plus `th_inventory.txt` and `th00_concept_inventory.txt`. Every picture was read once at reduced size against the [art direction](art-direction.md) section 8 and the brief's Part E, with full-resolution crops of eight details that could not be judged at frame scale (the concept's hats, `th03` wide's nail, `th05`'s wall in both orientations, `th07`'s hats in both orientations, `th08` wide's rail). Delivered sizes were measured from the PNG headers, not taken from the inventory: **24 room files exactly 1672 x 941 and 941 x 1672 as required, concept 1672 x 941, all 6 sprites and all 12 cards 1254 x 1254 square on opaque white.**

**42 accepted, 1 rejected.** After the regeneration of 2026-09-21 the one reject passes, so the set stands at **43 accepted, 0 outstanding**; its row below carries the pass reason.

| File | Verdict | Reason |
| --- | --- | --- |
| `th00_concept.png` | Accepted | Six neighbourhoods in the brief's positions, one river with a canal grid, sea round the south and west, landmarks small and behind. The hats in the orchard and the paddy are the wide flat `ngob`, not the Vietnamese `nón lá`; the old-city street carries the pulled rickshaw and no tuk-tuk |
| `th01_khlong_wide.png` | Accepted | Cleaver, opened coconut and a falling stream with a clear lip and landing; empty bamboo cross-pole on the canopy frame against plain sky; fruit and vegetables cold; nobody in the canal |
| `th01_khlong_portrait.png` | Accepted | Recomposed, not cropped; coconut, cleaver-and-husks and the mangosteen boat all readable; pole empty over plain sky |
| `th02_noodleboat_wide.png` | Accepted | Ladle lip, unbroken fall and a bowl resting on a board; open charcoal fire; empty iron hook on the ridge pole against plain canvas; raw noodles and greens dry |
| `th02_noodleboat_portrait.png` | Accepted | Same pour recomposed; strainer, handed bowl and the stack of used bowls all inside the band |
| `th03_wang_wide.png` | Accepted | Massaman open and steaming, `khao chae` iced and dry, carved pomelo and chilli flower with two correct hands, manuscript and inkpot present; empty iron nail on the carved post |
| `th03_wang_portrait.png` | Accepted | Empty nail against plain white plaster; three subjects readable |
| `th04_curry_wide.png` | Accepted | Granite mortar with a half-made paste, cream splitting in an open pan, grater stool with grated flesh; empty bamboo rail under the floor joists against the plain dark underside |
| `th04_curry_portrait.png` | Accepted | Same three subjects stacked, rail still empty, aromatics and mortar dry |
| `th05_sweets_wide.png` | Accepted | **Cone broad end up, perforated tip down**, unbroken threads falling onto an open syrup pan; `thong yip`, `thong yot`, the cake rack and the yolk bowl all present and cool; empty wooden peg on plain lime wash; open door to the lane and the church tower |
| `th05_sweets_portrait.png` | **Pass (regenerated 2026-09-21)** | The pipes and the round fitting are gone: the plaster at upper left is plain lime wash carrying only a wooden shelf on brackets with baskets on it, checked at full resolution. The composition and the action are the same — cone broad end up with the perforated tip down, unbroken threads falling onto the open syrup pan and landing on a nest of threads; `thong yip`, `thong yot`, the cake rack and the yolk bowl are all present and cool, and the door still gives the lane, the church tower and the river. Nothing modern anywhere: the cart is an ox-cart on wooden wheels and the boat carries a sail and no engine. The empty hook on plain plaster at about x .52 is decorative, this room having no sprite, and there is no text in any script |
| `th06_shophouse_wide.png` | Accepted | Wok toss with the noodles clear of the pan, flame round the rim, congee open, steamer lid lifted and resting beside the stack, duck and pork on hooks at the block; empty brass hook under the arcade beam against plain evening sky; the street vehicle is the pulled rickshaw; no lettering anywhere |
| `th06_shophouse_portrait.png` | Accepted | Same three subjects; the empty brass hook sits at about x .90, just inside the middle 80 per cent |
| `th07_paddy_wide.png` | Accepted | Banana leaf peeled back off the fish on the straw fire, mortar of `nam phrik`, open rice basket; empty bamboo pole and cross-piece against plain sky; only the buffalo is in water. The hats are the broad flat `ngob` |
| `th07_paddy_portrait.png` | Accepted | Same three subjects inside the band. The empty pole sits at about x .93, outside the band, which costs nothing because this room's sprite is the egret and it crosses sky, not the pole |
| `th08_isan_wide.png` | Accepted | Three flattened chickens in split-bamboo clamps over the trough, clay mortar of papaya with pestle and spoon, open sticky-rice baskets, `pla ra` jars against the posts and dry. The empty bamboo rail here is the garden fence rail against paddy rather than a rail between the house posts; it is empty and evenly lit, so the garlic string can hang, but the portrait's rail is the better model |
| `th08_isan_portrait.png` | Accepted | Clean empty bamboo rail across the top with nothing on it; three subjects inside the band |
| `th09_lanna_wide.png` | Accepted | Open khao soi pot with the oil split orange, crisp noodle nest on the bowl, `sai ua` coil on the grill, lacquered `khantoke` on the floor, `thua nao` discs drying and dry; empty iron hook on a pale teak plank; cooler, bluer light than any other room |
| `th09_lanna_portrait.png` | Accepted | Ladle pour with lip, stream and landing in the bowl; empty hook at about x .90, inside the band |
| `th10_andaman_wide.png` | Accepted | Turmeric fish on the green-stick grill, open `kaeng som`, drying squid dry; the second line between the poles is completely empty against plain sky; boats are plain hulls with furled sails, no engine and no long tail; nobody in the sea |
| `th10_andaman_portrait.png` | Accepted | Same three subjects; the painted squid line runs out to the left edge, so a marker belongs on the squid at about x .2 rather than on the end of the line |
| `th11_muslim_wide.png` | **Accepted (regenerated 2026-09-21)** | The headscarf is now the `selendang` the brief asked for: all three women wear it draped loosely over the hair, with the front hair and the neck visible, checked at full resolution. Everything else is unchanged and still passes — roti thrown thin and translucent between two correct hands over the open plate with a second one puffing on the steel plate, `khao mok` pot open with the lid resting against it, `budu` jar with its ladle and no steam, `nasi kerabu` and the massaman bowl cold; empty iron peg on plain planking at about x .96, the same place as before; mosque roof tiered and pyramidal; no pork, no text, nothing modern |
| `th11_muslim_portrait.png` | **Accepted (regenerated 2026-09-21)** | Same `selendang` on all three women, hair and neck visible; same three subjects as before, peg empty on plain planking at about x .17. The steam by the `budu` jar comes off the open `khao mok` pot behind it, as it did in the accepted version; the folded prayer mat at bottom right carries geometric ornament and no script |
| `th12_baba_wide.png` | Accepted | Open clay pot of `moo hong`, tiffin tier lifted clear of the stack with both hands, `o-tao` on the flat iron plate; porcelain and young mango cold; empty iron hook under the airwell beam against plain pale plaster; tin sluice and spoil heap on the hill |
| `th12_baba_portrait.png` | Accepted | Airwell shaft clean, hook empty on the beam at mid-width, three subjects stacked and readable |
| 6 sprites | Accepted | One object each on opaque white, clean edges, no ground plane; the lantern is unlit and carries its wire loop, the `sai ua` its S-hook, the squid line both twine ends, the `pla tapian` its thread |
| 12 cards | Accepted | One food each on opaque white, textures readable at phone scale; food identity matches the brief's line for every card |

Four notes that belong to the Room maker's own Stage C work rather than to regeneration:

- **`th-garlic-string` measures 342 x 960 px after trimming and the 960 long-side cap**, below the 400 px short side the art direction asks for. The delivered subject is about 2.8:1 and the brief warned that a long thin sprite would land here. It is sharp enough to hang small on a rail and is kept; if it is ever wanted large, it is regenerated composed closer to square, not upscaled. Every other sprite clears 400: lantern 645, squid line 879, `sai ua` 712, egret 927, `pla tapian` 817.
- **The lantern sprite carries a gold `壽` longevity roundel** on each side. It is authentic ornament on a period Chinese lantern rather than invented signage, so it is accepted here, but rule (e) says no characters in any script and the lead should confirm it rather than discover it at the walkthrough.
- **`th03_wang_wide`'s empty nail sits high on a carved teak post with garden foliage beside it**, not on the plain whitewashed plaster the brief also asked for; the brief asked for both and they conflict. Nothing has to be keyed, because the `th-pla-tapian` sprite arrives already cut, and pale straw over dark teak separates well enough. The portrait's nail is on plain plaster and is the cleaner of the two.
- **`th03_wang_portrait`'s inkpot sits at about x .93**, just outside the middle 80 per cent; the manuscript beside it is inside, so the third discovery marker goes on the manuscript.

One question for the lead rather than for the image tool: the women in `th11` wear a wrapped scarf that covers hair and neck completely, where the brief asked for a `selendang` laid over the hair. It is the right region and the right religion and it is not out of period enough to burn a regeneration on, but it is a clothing decision and it is hers, not the Room maker's.

### Import

`scripts/scenes/import-thailand.py` copies the twelve room pairs to `public/scenes/th_*/wide.jpg` and `portrait.jpg` at their native sizes with no crop and no upscale, keys the twelve cards from their white backgrounds into trimmed, edge-bled, transparent WebP in `public/scenes/thailand-food/`, keys the six sprites into `public/scenes/props/th-*.webp` under the 960 px long-side cap, saves the concept as `public/scenes/th_concept.jpg`, registers sizes in `src/fw/scenes-props.json` and writes `public/scenes/thailand-assets.json` with a SHA-256 of every source file.

```
uv run --with pillow --with numpy --with scipy scripts/scenes/import-thailand.py "$HOME/Downloads/additional game asset/thailand"
```

It ran clean twice: the 45 written files and `scenes-props.json` hash identically after the second run. It re-reads `scenes-props.json` immediately before writing rather than at start-up, so an importer for another area running in the same minute is not overwritten — the Vietnam Room maker's twelve `vn_*` room keys and six `vn-*` prop keys were added while this one was cutting sprites and survived intact.

Keys added to `src/fw/scenes-props.json`, and nothing else in that file touched:

- `rooms`: `th_khlong`, `th_noodleboat`, `th_wang`, `th_curry`, `th_sweets`, `th_shophouse`, `th_paddy`, `th_isan`, `th_lanna`, `th_andaman`, `th_muslim`, `th_baba`, each `{"wide": [1672, 941], "portrait": [941, 1672]}`
- `props`: `th-lantern` [645, 960], `th-garlic-string` [342, 960], `th-squid-line` [960, 879], `th-sai-ua` [712, 960], `th-egret` [960, 927], `th-pla-tapian` [817, 960]

Card art lands at `public/scenes/thailand-food/{khlong, noodleboat, wang, curry, sweets, shophouse, paddy, isan, lanna, andaman, muslim, baba}.webp`. The manifest holds all 43 entries.

**The rejected picture was imported too, so the pipeline is complete and Stage C can measure on real files.** `public/scenes/th_sweets/portrait.jpg` is the file that will be overwritten after regeneration; it is the only one. Drop the new `th05_sweets_portrait.png` into the same folder under the same name and re-run the command above — the JPG and its manifest hash are replaced, every other output is byte-identical, and the Room maker re-measures only that one portrait coordinate set.

### Room audit

`scripts/tests/room-audit.html` discovers rooms by merging three module exports — `SCENES` from `scenes-china.ts`, `TURKEY_SCENES` and `SPAIN_SCENES` — and renders each id twice through `rooms.html?audit&room=<id>`, once in a 16:9 frame and once in a 35 per cent wide 9:17 frame, so the painted scene picks its own orientation from the frame's aspect. `rooms.html` builds its picker from the same three imports.

**No Thailand room shows in that page yet, and no picture is at fault.** The page has no fourth import to make, because the module it would import does not exist. What Stage C has to write, precisely:

1. `src/fw/scenes-thailand.ts`, exporting `THAILAND_SCENES` as a `Record<string, () => SceneDef>` on the model of `scenes-spain.ts`, with one entry per room id: `th_khlong`, `th_noodleboat`, `th_wang`, `th_curry`, `th_sweets`, `th_shophouse`, `th_paddy`, `th_isan`, `th_lanna`, `th_andaman`, `th_muslim`, `th_baba`, each built through `paintedScene` with `folder` set to the same id.
2. One line added to `scripts/tests/room-audit.html` — `import {THAILAND_SCENES} from '/src/fw/scenes-thailand.ts';` — and `...THAILAND_SCENES` added to the `SCENES` merge on the next line; the same two edits in `scripts/tests/rooms.html`.

Both files are tests and neither is this role's to edit, so neither was touched. What was verified instead: all 24 imported JPGs decode at the right orientation and size and are shown side by side as one contact sheet, and `scenes-props.json` carries a `wide` and a `portrait` size for every one of the twelve rooms, which is the Stage B check the playbook asks for.

**Owner rulings, 2026-09-21.** `th05_sweets_portrait.png` is regenerated to remove the piped plumbing. The lantern sprite's gold `壽` roundel is accepted as period ornament on a Chinese lantern, not lettering. `th-garlic-string`'s 342 px short side is accepted: the long side is full at 960 px and it hangs fine small on a rail. The `th11` headscarf question was left to the owner as an optional regeneration, not required; the owner took it, and the optional pair came back on 2026-09-21 with the loose `selendang` over the hair and the neck and some hair visible, as in the deep south around 1900. Both new files pass at 1672 x 941 and 941 x 1672 with nothing else changed and no new fault, so they replace the accepted pair and the rows above carry the pass reasons. The floating market keeps its room and drops `open: "reveal"`; its four stall children stay ordinary clickable siblings rather than a reveal, because `src/fw/main.ts`'s `openObject` checks `obj.scene` before `p.obj.open === "reveal"` (lines 666–667) and returns on the scene branch first, so the reveal would never run.

### Blueprint (fixed): the Southeast Asia table

This table carries two areas built to the China standard at once: Thailand (`bangkok`, twelve rooms) and the Vietnam package (`hanoi` and `mekong`, twelve rooms). The table frame, the sea and the band rule below are shared and are stated once, here; [vietnam-world.md](vietnam-world.md) points back to this section rather than repeating them. Every number in both blueprints is held as data in `scratchpad/seasia-blueprint.py` and passes the paper check there: bands, water clearances, 2.5 between clickables, rooms on roads, nothing on a road centreline, cluster separation.

Table and frame:

- `world-seasia.ts` grows to `W: 120, D: 56, cx: -22`, identical to the Mediterranean. The table runs x from **-82 to 38** and z from **-28 to 28**. The `shore()` edge test becomes x at or beyond -82 or 38, z at or beyond 28 in either direction, so caps at the table edge stay square; the hand-written `Math.abs(x) >= 38` goes.
- **Thailand owns x -82 to -14. Vietnam owns x -12 to 38.** Nothing of one area crosses into the other's band. The two-unit strip at x -14 to -12 carries ground only — no object, no road, no cluster, no decor. The sea's south margin crosses it, because the sea belongs to the table and not to either area.
- Thailand's arrival view is the khlongs: `AREAS.bangkok.center` becomes **[-44, 0]**. The display name of `bangkok` becomes **Thailand**; `andaman` is retired.
- `worldZoomLimit` and `worldFogRange` in `world-camera.ts` gain `southeast-asia` beside `mediterranean`, so the 120-wide table gets the 215 desktop overview and the computed fog pair instead of the flat 90/200. Builder, Stage C.

Water, one continuous `seaWater()` shape wrapping three edges — the Andaman on the west, the Gulf of Thailand becoming the South China Sea on the south, Vietnam's coast on the east. The north edge is land: Lanna's mountains, the Isan plateau and the Red River hills. Points from the west edge, along the coast, then back round the table edges:

```
[-82,-6] [-78,-4] [-76,2] [-75,8] [-74,14] [-73,19]                     the Andaman coast, Thailand's west
[-70,22] [-64,23] [-58,22.5] [-52,22] [-46,21] [-40,21.5]               the Gulf of Thailand
[-34,22] [-28,22.5] [-22,23] [-16,23] [-14,23] [-12,23]                 the Gulf across the no-man's strip
[-6,23.5] [0,24] [6,23.5] [12,23] [18,22] [24,21]                       the delta and Saigon coast
[28,18] [30,12] [33,6] [34,0] [34,-4] [33,-10] [34,-16]                 Vietnam's east coast
[32,-21] [29,-23.5] [24,-25.5] [24.5,-28]                                the Red River bight, to the north edge
[38,-28] [38,28] [-82,28]                                               table edges, square caps
```

The rim (`#eadfbd`) is an inset of the same polygon by 1.2, computed per vertex, not from a single centre as now. Hạ Long-style karsts stand as decor in the north-east sea between x 28 and 36, z -27 to -23; they carry no card. Thailand's `karsts` object moves to the Andaman shore at the west. Nothing stands in water except the objects named on-water below.

Thailand's own water:

| Feature | Width | Points |
| --- | --- | --- |
| The Chao Phraya, `estuaryWater` blend from z 18 to the mouth | 4.5 on a 6.4 rim | [-52,-27] [-51,-21] [-50,-15] [-49,-9] [-47,-3] [-45,2] [-44,7] [-43,13] [-42,18] [-41,21.5] |
| Khlong 1, straight off the west bank into the paddy | 1.6 | [-46.4,-1.5] [-58,-1.5] |
| Khlong 2 | 1.6 | [-45,2] [-57,2] |
| Khlong 3 | 1.6 | [-44.4,5] [-56,5] |
| Khlong 4, the cross canal that closes the grid | 1.6 | [-56,-1.5] [-56,5] |
| The mooring basin, the river widening where the floating market lies | circle r 3.8 | centre [-43, 4.5] |

The river rises in the Lanna hills at the north edge, runs south through the central plain and the khlongs and reaches the Gulf at [-41, 21.5] with an estuary blend. The khlong grid is cut **early**, with the landscape, not added at the end: the canals are what makes this area look like nowhere else on the atlas. The existing circular basin shrinks from r 6.8 to r 3.8 and moves to [-43, 4.5], where it becomes the floating market's mooring instead of a pond the stands sit in.

Clusters and their ground tints. Positions are final; every one of the thirty-two objects appears exactly once.

| Cluster | Centre | Tint | Holds |
| --- | --- | --- | --- |
| The khlongs | [-44, 1] | `#b9a98a` wet brown mud on the banks, 16 x 16, no paving | `floatingMarket` [-40.5, 4.5] moored against the quay, on the water; its four stalls as ordinary clickable siblings on the basin — `stall-fruit` [-43.5, 1.6], `stall-noodles` [-45.5, 4.2], `stall-herbs-th` [-44.8, 7.4], `stall-coconut` [-41.8, 7.6]; `kuaitiaoRuea` [-41.6, 10.5] moored at the east bank with its stage on the quay; `sweetsTh` [-49.5, 7.6] on dry ground west of khlong 3; `wat` [-36.5, -3.4] at the head of the old city street; `almsRound` [-41, -8] on the quay. One decorative house: **`th-khlong-house` [-37, 8.5]**, a stilt house on the east bank above the quay |
| The old city and Sampheng | [-31, -4] | `#c4bba6` new brick paving inside the street, 14 x 10 | `wangKitchenTh` [-34.5, -7] behind the compound wall, `curryPaste` [-30, -2] on Sampheng lane, `chilliesSea` [-29.6, -5.4] at the lane's corner, `shophouseTh` [-27, -5] on the street, `tukTuk` [-26.5, -1.5] as the rickshaw stand at the lane's east end. One decorative house: **`th-shophouse-row` [-31.8, -11.4]**, a terrace of three fronts south of the street, counted as one |
| The central plain | [-57, -10] | `#8fb86a` flooded green in bunded squares, running to `#c9c08a` dry gold at the south-west | `naKhaoTh` [-57, -11] on the bund, `naPaddyTh` [-61, -7], `plaTh` [-53, -6] beside khlong 1, `suanTh` [-54, -15] on ridged orchard beds, `tanTh` [-63.6, -13.6] in the toddy palms, `kluaTh` [-53.6, 14.2] on the salt pans at the plain's coastal end — the cluster runs from the hills to the Gulf and the pans are its seaward corner. **No decorative house**: the field shelter behind `naKhaoTh` is that stand's own and is read from above under the same rule |
| Isan | [-24, -21] | `#c2a473` dry sandy plateau, 14 x 10, raised 0.6 | `isanGrillTh` [-25, -21] on the track's south side, `plaRaTh` [-21.5, -18.5] in the jar yard. One decorative house: **`th-isan-house` [-22.5, -23]**, on posts |
| Lanna | [-58, -23] | `#9fb08a` cool valley green with `#8a7f6a` earth terraces | `khaoSoiTh` [-57, -24], `miangTh` [-62, -22] under the forest canopy, `chinHawTh` [-57.5, -20] where the caravan road enters. One decorative house: **`th-lanna-house` [-60.2, -19.8]**, low and wide-roofed |
| The southern peninsula and the Andaman | [-68, 14] | `#7fb86a` wet green, `#eadfbd` sand along the west shore | `talayTh` [-70, 10] on the sand under the limestone, `babaTh` [-70, 16], `muslimKitchenTh` [-64, 18.5] on the Gulf side, `coconutSea` [-66.2, 11.4] in the groves, `khamminTh` [-63.5, 14.5] on the turmeric beds, `karsts` [-73, 4] standing on the shore at the Andaman, `longtail` [-76, 12] as two `kabang` on their mooring in the sea — the only Thai object in open water besides the market and the noodle boat. One decorative house: **`th-kampong-house` [-61, 16.2]**, on the Gulf side |

Roads, one continuous ribbon each, every door on a road and nothing solid on a centreline:

| Road | Width | Points |
| --- | --- | --- |
| TH-R1 the khlong quay | 2.2 | [-38.2,-9.4] [-38.6,-4.6] [-39.6,0.2] [-38.8,4.5] [-40.4,9.6] [-40,13.6] [-39.2,17.4] [-38.4,20.6] |
| TH-R2 the west bank lane | 1.8 | [-51,-6.8] [-50.2,-1.5] bridge [-50,2] bridge [-49.8,5] bridge [-51.4,7.6] [-50.6,11] [-52,16.6] [-53.4,19.6] |
| TH-R3 the old city street | 2.4 | [-38.6,-4.6] [-36.2,-8.2] [-33.6,-9] [-30.8,-7.6] [-28.4,-6.8] [-26,-6.8] [-24.2,-4.6] |
| TH-R3b Sampheng lane | 1.8 | [-30.8,-7.6] [-31.8,-3.8] [-31.4,-0.4] [-27.8,0.8] |
| TH-R4 the plain road | 1.8 | [-39.6,0.2] [-42.5,-2.4] [-45,-5.4] bridge [-48,-6.2] [-51,-6.8] [-53,-7.6] [-56.4,-9.4] [-60.4,-8.8] [-62.4,-12.4] [-60.8,-15.4] [-57.6,-16.6] [-54,-16.6] [-52.5,-18.5] |
| TH-R5 the Lanna road | 1.6 | [-52.5,-18.5] [-55.4,-19.8] [-57.2,-22.2] [-59.4,-24.6] [-63.2,-23.4] [-64,-20.6] |
| TH-R6 the Isan track | 1.6 | [-24.2,-4.6] [-27.4,-8.6] [-26.6,-13.4] [-27,-19] [-24,-19.2] [-20.8,-20.2] |
| TH-R7 the peninsula road | 1.8 | [-52,16.6] [-57.2,17] [-62.8,20.2] [-65.4,20.4] [-67.8,18.4] [-68.4,12.6] [-68.2,8.6] [-71,6.4] [-73,5.8] |
| TH-R7b the turmeric path | 1.4 | [-68.4,12.6] [-65.8,13.4] [-62.2,12.6] |

The network is one walkable piece. TH-R1 meets TH-R3 at the wat corner [-38.6,-4.6] and TH-R4 at [-39.6,0.2]; TH-R3 meets TH-R3b at [-30.8,-7.6] and TH-R6 at [-24.2,-4.6]; TH-R4 meets TH-R2 at [-51,-6.8] and TH-R5 at [-52.5,-18.5]; TH-R2 meets TH-R7 at [-52,16.6], and TH-R7b hangs off TH-R7 at [-68.4,12.6]. No road point comes inside a river or khlong bank; if one ever does, move the road, not the water.

**Bridges.** `woodenBridge` at [-50.2,-1.5], [-50,2] and [-49.8,5] where the west bank lane crosses the three khlongs, and at [-48,-6.2] where the plain road crosses the Chao Phraya. Decks at the road height, ends on the banks, span square to the water.

Walker loops, residents in the area's clothing, steps matched to distance (`thailandWalk`), speed 0.008 on the quay and 0.006 elsewhere:

1. **The quay**, TH-R1 from the wat corner to the estuary and back, six residents, two carrying a shoulder pole with baskets, one monk walking north at dawn
2. **Sampheng**, TH-R3 and TH-R3b as a circuit through the old city, five residents, one pulling the rickshaw, one pushing a barrow of charcoal
3. **The plain**, TH-R4 between [-53,-7.6] and [-60.8,-15.4], four residents and one buffalo led on a halter, the buffalo's hooves planting and pushing back
4. **The peninsula**, TH-R7 between [-65.4,20.4] and [-71,6.4], five residents, two carrying fish trays

**Decor.** Five decorative houses in the whole of `bangkok`, no more, each at a fixed coordinate and each a 1.5-radius blocker in the paper check: `th-khlong-house` [-37, 8.5], `th-shophouse-row` [-31.8, -11.4], `th-isan-house` [-22.5, -23], `th-lanna-house` [-60.2, -19.8], `th-kampong-house` [-61, 16.2]. Every one is at least 2.5 from every clickable, clear of every road corridor by half the road's width plus 1.5, and out of the water. The field shelter behind `naKhaoTh` and any shade a stand builds for itself are that stand's own, not extra houses, but they count as blockers in the arrival-camera visibility check exactly as these five do. The three decor `tukTuk()` vehicles become **rickshaws and one ox cart** on TH-R3 and TH-R3b; the three `longtail()` boats become **kabang**; the beach parasols, the loungers and the beach tint are removed.

**Countryside between the clusters.** Bunded paddy squares, flooded and mirror-bright, from [-64,-4] to [-50,-18], with white egrets standing in them; toddy palms in a line along the plain road from [-63,-12] to [-66,-16]; river orchards on ridged beds at [-54,-15]; teak and bamboo on the Lanna slopes from [-66,-26] to [-54,-20]; dry dipterocarp and sandy scrub over Isan from [-30,-24] to [-19,-15]; coconut groves from [-70,8] to [-62,16]; mangrove along the Andaman shore from [-75,6] to [-73,18]; rubber and turmeric beds behind the Gulf shore. Every crop or tree that carries an object responds to a click (the Stand maker's file); the rest is the Builder's.

#### Amendments, 2026-09-21 (lead)

The lead accepted the blueprint above with three amendments. The tables in this section are the fixed record and already carry them; this note says what moved and why.

1. **SG1 gains two objects.** Vietnam's Saigon cluster was two objects. It gains `caPheVn` (flavour, "The coffee filter") and `benThanhVn` (landmark, "Bến Thành market", opened 1914), both card-only and both in the 1900–1931 band, for the Researcher to write at Stage C. Vietnam goes to **28 objects**. Thailand is unaffected.
2. **The Red River no longer runs the whole north edge.** It keeps its source in the north-west of the Vietnamese band and now enters the sea at **[24.3, -26.2]**, north of Huế, so Hội An's sea stays its own. Vietnam's east coast gains a bight for it — the sea polygon above ends `[34,-16] [32,-21] [29,-23.5] [24,-25.5] [24.5,-28]` instead of `[32,-22] [30,-28]` — and the Hạ Long karst decor moves with it, to x 28 to 36, z -27 to -23. No Thai coordinate changed. No road crossing had to move: only `VN-R2c` crosses the river, at [2, -24.4], which is west of the change.
3. **Decorative houses are fixed coordinates, not counts.** The cap stands at **five per area id**, so Thailand's 5, `hanoi`'s 4 and `mekong`'s 2 are unchanged in number. Each house now has a coordinate in the cluster table and is a **1.5-radius blocker in the paper check**: at least 2.5 from every clickable, clear of every road centreline by half that road's width plus 1.5, and out of the water like any other solid thing. Thailand's two khlong raft houses became one stilt house on the bank (`th-khlong-house`), because a raft house is a building standing in water and the rule says nothing stands in water; the central plain's farmhouse was reclassified as `naKhaoTh`'s own shelter so the count stays at five, and the southern kampong house became a real decorative house at [-61, 16.2].

All six checks pass on the amended numbers, first run, with no further nudges to any clickable.

#### Shared-ground pass, 2026-09-22

The cluster table above is the Stage B record. Twelve Thai anchors, two houses and five roads moved in the
shared-ground pass; where this table and the one above disagree, this one and `thailand-objects.ts` are current.
The khlongs, the old city and Isan were re-laid; the plain, Lanna and the peninsula keep their Stage B anchors
except the field lunch. The full account, with the counts and what is left, is under
[Shared-ground pass, 2026-09-22: the account](#shared-ground-pass-2026-09-22-the-account) at the end of this document.

| Object | Was | Now | Why that spot |
| --- | --- | --- | --- |
| `wat` | [-36.5, -3.4] | **[-40.3, -12.5]** | The wat's 7.8-unit chedi and roofs covered the household kitchen on six rays and the alms round on four, and its box overlapped both by five units. It moved north-west to the head of the quay, behind every other old-city stand, where nothing stands between it and the camera and it hides nothing: its own camera column is the open quay |
| `almsRound` | [-41, -8] | **[-31.3, -2.2]** | The monks walked out of the wat's footprint. They now stand on the old-city street's paving south of the wat, in the open square, low (1.4 tall) so they hide nothing, and clear of every roof |
| `curryPaste` | [-30, -2] | **[-30.6, -11]** | The mortar's 5.9-unit roof covered the chilli stall on nine rays and the shophouse on three, live. It moved to the north row of the old city beside the wat, on Sampheng lane's start, so its column runs over the low alms round and the open street |
| `shophouseTh` | [-27, -5] | **[-21.7, -6.1]** | Five units east to the street's east end, out of the mortar's and the rickshaw's columns; it still fronts `TH-R3` |
| `wangKitchenTh` | [-34.5, -7] | **[-18, 8.5]** | The household kitchen was behind the wat (6 rays) and the mortar (3) with its box inside both. No position north of the street clears the wat's height, so it moved to the south side of the old city on the re-laid Sampheng lane, with open ground in front of it to the Gulf |
| `chilliesSea` | [-29.6, -5.4] | **[-27.3, 6.8]** | The chilli, galangal and lemongrass stall sat under the mortar's roof (overlap 4.9, nine rays live). It now stands on Sampheng lane between the alms round and the Gulf, 2.3 wide and 2.4 tall, still four doors from the mortar it supplies |
| `tukTuk` | [-26.5, -1.5] | **[-20, 16.7]** | The rickshaw covered the shophouse and the chilli stall on a ray each, live, and overlapped both. It stands at the lane's south end on the Gulf road, where `TH-R3b` now ends at it |
| `sweetsTh` | [-49.5, 7.6] | **[-34.2, 16.4]** | The sweets kitchen was 8.4 wide on a khlong grid whose canals are 3 apart: 1,179 vertices over water, and the salt pans in front of it covered three rays live. No dry plot on the grid holds it, so it crossed to the east bank below the quay, on dry ground beside the noodle boat's landing, and is off the over-water list |
| `kuaitiaoRuea` | [-41.6, 10.5] | **[-40.2, 18.5]** | The noodle boat hid three rays of the floating market and overlapped it. It moored eight units down the same east bank, still on the Chao Phraya and still at the quay |
| `isanGrillTh` | [-25, -21] | **[-17.6, -21]** | The jar yard in front of it covered two rays and the two overlapped by 3.6. The grill moved east along the Isan track to the plateau's east shoulder, the jar yard west, side by side instead of one before the other |
| `plaRaTh` | [-21.5, -18.5] | **[-24.6, -21]** | See the grill. West of it on the plateau, clear of the Isan house's pad and of the hill at [-31, -27.2] |
| `naKhaoTh` | [-57, -11] | **[-71.5, -15.4]** | The rice-field lunch overlapped the paddy, the orchard and the sugar palms by 3.7 each. It moved to the western paddies at the plain road's bend, which was carried out to it, and its four overlaps and its covered ray are closed |

Roads, each re-laid to keep a door within 2.6 of every moved stand (the `thailand-world.mjs` rule) and every end
on another road, a door or the shore:

- `TH-R3b`, Sampheng lane, was `[-30.8,-7.6] [-31.8,-3.8] [-31.4,-0.4] [-27.8,0.8]` and is now
  `[-30.8,-7.6] [-25.4,4.4] [-21.3,8] [-20.2,13.3]`: from the mortar's corner south past the alms round and the
  chilli stall to the household kitchen and the rickshaw
- `TH-R1`, the quay: five points moved by half a unit or less to keep the wat's and the noodle boat's doors
- `TH-R3`, the old-city street, and `TH-R6`, the Isan track: points moved by under 0.7 for the wat and the grill
- `TH-R4`, the plain road: its bend at [-62.4, -12.4] went to [-68.4, -14.4], to the field lunch's door
- Decorative houses: `th-khlong-house` [-33.4, 8.8] to [-27, 18.5] (it stood on the alms round's camera line) and
  `th-shophouse-row` [-32.6, -12.8] to [-32.5, -21.5] (it stood on the mortar's new pad), both at the only ground a
  half-unit search of the band found outside every pad, corridor, hill and wedge. A landing stage was added as a
  candidate at [-55, 6.8] and [-46, 17.8] and a sala at [-40, -21] and [-58.5, 5.8], because the moved stands took
  the ground of every candidate the Builder had listed

### Module contracts for Stage C

Every agent owns whole files. Stubs exist so the type check passes while files are empty. Thailand's set; Vietnam's is in [vietnam-world.md](vietnam-world.md) and the shared files are marked.

| File | Owner | Exports (keep these names and signatures) |
| --- | --- | --- |
| `thailand-architecture.ts` | Builder, first | `TH` palette constant with the twelve names from the research; `thaiHouse(style, w, d, h, { storeys, posts })` for styles `central`, `raft`, `shophouse`, `isan`, `lanna`, `kampong`, `sinoPortuguese`; `watChedi()`; `salaPavilion()`; `riceBarn()`; `sugarPalmRig()`; `saltPanShed()` |
| `thailand-people.ts` | Builder, second | `thaiResident(seed, working?)` and `thailandWalk(person, from, to, range, seed)` following `spain-people.ts`; the seven clothing profiles as data; `thaiBuffalo()` and `followBuffalo()` |
| `thailand-landscape.ts`, `thailand-town.ts`, `thailand-countryside.ts` | Builder | `thailandLandscape(ctx)`, `thailandTown(ctx)`, `thailandCountryside(ctx)`. The landscape owns the sea polygon, the rim, the Chao Phraya, the estuary blend, the khlong grid and the mooring basin, and exports `TH_LANES`, `TH_BRIDGES`, `BRIDGE_SPAN`, `BRIDGE_DECK_Y` in the shape `spain-town.ts` uses |
| `props-thailand.ts` | Stand maker | `THAILAND_PROPS` keyed by every `prop` name in the object list, `THAILAND_ICONS`, `TH_LINES` keyed by object id; `rickshaw()`, `kabang()`, `noodleBoat()`, `oxCart()` |
| `thailand-objects.ts`, `thailand-stories.ts` | Researcher | `THAILAND_OBJECTS`, `THAILAND_CARD_ART`, `THAILAND_NEXT`, `THAILAND_STORY_DEPTH`, `THAILAND_SOURCES` |
| `scenes-thailand.ts`, `thailand-ambience.ts` | Room maker | `THAILAND_SCENES`, `THAILAND_AMBIENCE`; hotspot labels and texts live in `scenes-thailand.ts`; `scene-ambience.ts` gains `PAINTED_SIGNATURES` entries only |
| `scripts/tests/thailand-world.mjs`, `scripts/tests/thailand-reactions.mjs` | Builder, Stand maker | Copies of the Spain harnesses with Thai ids. `thailand-world.mjs` tests **every vertex of every stand against the sea polygon, the river, all four khlongs, the basin and the estuary from the first commit**, plus corridors, gait and gait direction |
| **shared** `world-seasia.ts` | Builder, Stage C | Table growth to `W: 120, D: 56, cx: -22`, the new `shore()` edge test, `{ ...SEASIA_PROPS, ...THAILAND_PROPS, ...VIETNAM_PROPS }`, and the two areas' layout calls. **One owner for this file across both areas**; Thailand and Vietnam do not both edit it |
| **shared** `world-camera.ts` | Builder, Stage C | `southeast-asia` added beside `mediterranean` in `worldZoomLimit` and, through it, `worldFogRange`. Two words, one owner |
| **shared** `graph.ts` | Lead, Stage D | `AREAS.bangkok` renamed to Thailand with `center: [-44, 0]`; `andaman` removed from `AREAS` and from the `Area` union; `coconutSea`, `karsts` and `longtail` move to `area: "bangkok"`; `floatingMarket` drops `open: "reveal"`; the four stalls lose `hitOnly` and `parent` and become ordinary siblings; the nineteen new objects registered. `bangkok` and `curryPaste` do not change |
| **shared** `world-intros.ts` | Researcher | The Southeast Asia intro gains Thai beats; `["hanoi","andaman"]` becomes `["hanoi","bangkok"]` and `andaman` drops out of the third beat. `world-intros.mjs` must still pass |
| **shared** `scripts/tests/room-audit.html`, `scripts/tests/rooms.html` | Lead, Stage D | Two edits each: `import {THAILAND_SCENES} from '/src/fw/scenes-thailand.ts';` and `...THAILAND_SCENES` in the `SCENES` merge, beside Vietnam's |
| `main.ts`, `ui.ts`, `README.md`, this file | Lead, Stage D | Registration only |

The Stand maker may import from `thailand-architecture.ts` and `thailand-people.ts` once they exist; until then a stand uses `person()` and `wear()` from `props.ts` and a local shelter. Nobody edits another owner's file; a missing helper is built in the owning file. Proposed `AREAS` row for the lead to confirm: `bangkok: { world: "southeast-asia", name: "Thailand", zh: "ประเทศไทย", blurb: "the khlongs, the curry mortar, the plain, Lanna and the Andaman", center: [-44, 0] }`.

## State at the end of 2026-09-21

Stage C started the same day the blueprint was fixed, and the weekly usage limit stopped it mid-run. Committed: the Researcher files (objects, story depth, discoveries, speech lines). Partial and uncommitted in the working tree: the Stand maker file `props-*.ts`. Not started: the Room maker files, the Builder modules and the shared `world-seasia.ts` growth. The Thailand Builder carries an owner rule received the same day: the dark-to-light blue water transition of this table is kept, same materials and estuary blends at every mouth. Stage D notes: re-point the `stall-herbs-th` alias to `chilliesSea`; the Southeast Asia intro is at its four-beat cap. Work resumes after the reset in the order Stand makers, Builders, Room makers, then Stage D.

## Stage D: integration, 2026-09-22

Thailand is registered. `bangkok` displays as **Thailand** and the area is the whole country: the Andaman area
is gone from the code, not only from the display.

### What was registered

| File | What changed |
| --- | --- |
| `graph.ts` | `THAILAND_OBJECTS` and `VIETNAM_OBJECTS` imported and spread into `SEASIA_OBJECTS`, beside the way `SPAIN_OBJECTS` is spread into `MED_OBJECTS`. The twenty-two Stage A objects this list held are all redefined in the two new files under the same ids, so the old list is gone entirely and the `FM` anchor with it. `andaman` removed from the `Area` union and from `AREAS`; no reference to it survives anywhere in `src` or `scripts` (the room id `th_andaman` and the card stem `andaman` are not the area and stay). `AREAS.bangkok` is now `name: "Thailand"`, `zh: "ประเทศไทย"`, `blurb: "the khlongs, the curry mortar, the plain, Lanna and the Andaman"`, `center: [-44, 0]`, exactly the row this document proposed |
| `graph.ts`, the alias ruling | `stall-herbs-th` now aliases `chilliesSea`, not `herbsSea`. It is applied in `graph.ts` rather than in `thailand-objects.ts`, because the file's own note says the alias is a `graph.ts` decision: the spread is mapped and only that one object is rewritten. The herb boat therefore opens the Sampheng spice stall's card, four doors from the mortar it supplies, instead of a Hanoi herb garden across the table |
| `main.ts` | `THAILAND_SCENES` and `VIETNAM_SCENES` in the `SCENES` merge. The arrival target gained a `southeast-asia` branch: every world but the Middle East arrived at the hard-coded `(-4, 0, 2)`, which on the grown table is the no-man's strip between the two areas. It is now `AREAS.bangkok.center`, `(-44, 0, 0)`, and `currentArea` is set to `bangkok` on entry as it is set to `istanbul` for the Middle East, so the breadcrumb says Thailand on arrival |
| `ui.ts` | Card art keyed by world **and area**, because Thailand and Vietnam share the world id `southeast-asia`: `area === "bangkok"` reads `scenes/thailand-food/`, the rest reads `scenes/vietnam-food/`. `THAILAND_NEXT` and `THAILAND_SOURCES` wired into "Continue exploring" and "Sources and further reading" on the same two branches. The Stage A ids `riceSea`, `chickenSea`, `herbsSea`, `coconutSea`, `spicesSea`, `chilliesSea`, `fishSauce`, `wat`, `almsRound`, `hoanKiem`, `motorbikes`, `stilts`, `karsts`, `longtail` and `tukTuk` were dropped from `ICON_KEYS`: their `props-seasia.ts` icons were drawn for objects Stage C replaced, so a rickshaw would have worn a tuk-tuk's badge. They now render their own prop, which is what Spain's fourteen card-only objects do |
| `snapshot.ts` | `THAILAND_ICONS`/`THAILAND_PROPS` and `VIETNAM_ICONS`/`VIETNAM_PROPS` added to both lookup chains, **before** the Stage A `SEASIA_*` sets so an id both hold resolves to the area's own art |
| `repertoire.ts` | `THAILAND_REPERTOIRE` and `VIETNAM_REPERTOIRE` in `REPERTOIRE_TABLES` |
| `README.md` | the world's areas line |

Story depth needed no wiring: `thailand-objects.ts` already appends `THAILAND_STORY_DEPTH` to each room blurb.
Discoveries and ambience needed none either: `scenes-thailand.ts` already reads `THAILAND_DISCOVERIES`,
`THAILAND_AMBIENCE` and `THAILAND_HUNG`, the twelve `PAINTED_SIGNATURES` entries are in `scene-ambience.ts`, and
`room-audit.html` and `rooms.html` already merge `THAILAND_SCENES`.

### Harnesses

`scripts/tests/room-loops.mjs` bundled China, Turkey and Spain only. It now bundles `scenes-thailand.ts` and
`scenes-vietnam.ts` as well: **90 rooms audited**, the twenty-four new ones among them, every one at three or
four always-on loops in both orientations with its hung sprites counted. `scripts/tests/repertoire.mjs` was
extended the same way, from three tables to five, and now checks 114 places and 567 dishes.

`scripts/tests/thailand-world.mjs` gained the three checks `vietnam-world.mjs` carries:

- **Every road end meets something.** Vietnam's terminations are a street network's; Thailand is a coast with
  country roads, so two of them are written differently and nothing is added. A route may end **at a stand it
  serves**, at the same 2.6 from its surface that this area's own "a road at its door" rule uses, and it may end
  **on the shore**, within 2.6 of the water, which is what the table edge is for Vietnam. All eight ends the
  rule lets through are listed in the harness with their measured distance: `TH-R1` start at `almsRound` 3.13 of
  3.70 and `TH-R1` end on the estuary shore at 1.08; `TH-R2` end on the salt-flat shore at 2.44; `TH-R3b` at
  `tukTuk` 2.64; `TH-R5` at `miangTh` 2.44; `TH-R6` at `plaRaTh` 1.84; `TH-R7` at `karsts` 1.80; `TH-R7b` at
  `khamminTh` 2.30. No Thai road ends in open country
- **The two road surfaces overlap at a junction.** Copied straight, then made symmetric, because Thailand has a
  hairpin Vietnam has not: the old-city street `TH-R3`, 2.4 wide, arrives at `[-24.2, -4.6]` and the Isan road
  `TH-R6`, 1.6 wide, leaves the same point back along almost the same line. The wide street covers the narrow
  one completely there, so no vertex of the wide one can ever be within the narrow one's 0.8, and the one-way
  test read a full overlap as a gap. With the symmetric test every Thai junction passes and **no road fix was
  needed**: `drawnPoints`, the carry Vietnam added, was written, tested and then dropped, because there was no
  wedge of grass to close
- **The paving is squares.** Both Thai slabs, `old-city-paving` at `[-31, -4]` 15 x 11 and `khlong-quay-paving`
  at `[-44.4, 1]` 7.5 x 13, are axis-aligned, drawn at the size the town file gives, and each of their four
  sides lies under a road or against a building. The check filters to `x <= -14` because Vietnam's four slabs
  are on the same table

The copied `coplanarOverlaps` check was added to the Thai bridge decks at the same time and found one real
defect, the only change made to `thailand-town.ts`: the ramp and the deck are the same width, so their long
side faces lie in one plane, and a ramp that tucked 25 mm under the deck end left a z-fighting sliver of about
13 cm² on each of the four crossings. The ramp is set out 0.03 further, from 0.2 to 0.23, so it meets the deck
end instead of overlapping it. Its width is untouched: the stone tessellation reads mesh sizes, and narrowing
it moved the world's seeded random stream enough to change a walker's gait fifty units away.

One harness rule was rewritten rather than fixed. Registration puts the real Thai stands into `buildSeasia`,
and the 240-second stride rule then flagged `kabang-child` for covering 1.4 with its legs locked. The child is
standing on a rocking moored dug-out: it is a passenger, carried as a diner is carried by a stool, and it has
nowhere to walk to. Figures on the harness's own `MOORED` hulls now count as seated for that rule.

### Results

`npm run typecheck` clean. `npm test`: 21 harnesses passed. `node scripts/tests/object-ids.mjs`: 391 objects,
every id unique, every alias and parent resolves. `npm run build:pages` clean. `node scripts/audit/objects.mjs`:

```
bangkok: rooms=12 card-only-with-prop=16 hit/child=4
hanoi:   rooms=8  card-only-with-prop=9  hit/child=0
mekong:  rooms=4  card-only-with-prop=7  hit/child=0
```

Thirty-two Thai objects and twenty-eight Vietnamese, sixty in all, which is what `diorama.placed` holds on the
live page.

### The live check

On a restarted dev server and a fresh load, 1280 x 720, through `window.__fw`.

- **Arrival.** The camera arrives at target `(-44, 0, 0)` from `(-42, 48, 60)`: the khlongs, as the blueprint
  asks. Sixty objects placed
- **Roads.** All twenty-two routes walked end to end, nine Thai and thirteen Vietnamese, 126 points
- **Objects.** All sixty open. The thirty-six card objects each open their own card — checked by title against
  the object's name, with a settle long enough for the 800 ms card timer — with three or more blurb paragraphs,
  a rendered badge, a "Continue exploring" row and a "Sources and further reading" block. Both aliased stalls
  resolve: `stall-herbs-th` opens "Chilli, galangal & lemongrass" and `stall-coconut` opens "Coconut". The
  twenty-four room objects each open their room, and "The story" inside it opens a card with **painted** art
  and seven paragraphs. **No object failed to open**
- **Rooms.** All twenty-four open and show their painting, at 1280 x 720 and again at 390 x 844, each with
  three hotspots and six layers; at phone size every one loads `preview-portrait.jpg`, so the portrait
  composition is the one that draws. **No room failed to show**
- **Console.** One error in the whole pass: `THREE.WebGLProgram: Shader Error 0 - VALIDATE_STATUS false`,
  `MeshStandardMaterial`, with an empty program info log. It is not this table's: a fresh load that enters
  **China** instead produces exactly the same single line. It is the hidden Browser pane's software GL
  validating a program, and everything renders and screenshots normally. Nothing else, in any world view, any
  card or any room, at either size

Contact sheet, seven tiles — the arrival view, one stand mid-reaction per area and one room per area — at
`/private/tmp/claude-501/-Users-yingyingfu-Projects-fyying-food-tour/0dc0bae3-03ac-485b-a807-0a6ab67f1645/scratchpad/seasia-stage-d.png`.

### Left for the shared-ground pass

Registration closes nothing that belongs to the ground between the stands. The two Builders' harnesses hold
these as dated ceilings — a listed pair may not get worse and an unlisted pair may not appear — and closing
them is a re-blueprint or a stand resize, not a registration.

**Twenty-three Thai stand-on-stand ray failures** (`A < B` reads "B covers A on n of 10 rays from the camera"),
from `HIDDEN` in `scripts/tests/thailand-world.mjs`:

`chilliesSea < curryPaste` 7 · `wangKitchenTh < wat` 6 · `sweetsTh < kluaTh` 6 · `talayTh < babaTh` 6 ·
`coconutSea < muslimKitchenTh` 6 · `karsts < babaTh` 6 · `khaoSoiTh < suanTh` 5 · `khamminTh < muslimKitchenTh` 5 ·
`almsRound < wat` 4 · `floatingMarket < kuaitiaoRuea` 3 · `wangKitchenTh < curryPaste` 3 · `khaoSoiTh < tanTh` 3 ·
`talayTh < muslimKitchenTh` 3 · `coconutSea < babaTh` 3 · `suanTh < naPaddyTh` 3 · `longtail < babaTh` 3 ·
`chinHawTh < tanTh` 3 · `shophouseTh < curryPaste` 2 · `shophouseTh < tukTuk` 2 · `isanGrillTh < plaRaTh` 2 ·
`chilliesSea < tukTuk` 2 · `chinHawTh < suanTh` 2 · `naKhaoTh < naPaddyTh` 1

**Four Thai stands hanging over water**, from `OVER_WATER` in the same file, counted in vertices: `suanTh` 3300,
`sweetsTh` 1179, `khaoSoiTh` 6, `chinHawTh` 6. The two large ones are the river orchards and the sweets kitchen
on the khlong grid, where the anchor is fixed in `thailand-objects.ts` and the water line in this document.

The Vietnamese half of both lists is in [vietnam-world.md](vietnam-world.md) under the same heading.

## Shared-ground pass, 2026-09-22: the account

The fix pass Stage D left open: every clickable fully visible from the arrival camera, no stand sharing ground with
another, no stand over water, measured on the live page after a fresh load (the dev server restarted through the
preview tool, one tab of its own, `window.__fw`) and held by the two harnesses. The method is Spain's third to fifth
passes. The moves, road re-lays and house moves are listed under the two cluster tables, in this document for
Thailand and in [vietnam-world.md](vietnam-world.md) for Vietnam.

### How the positions were found

Hand-nudging does not converge on a table of sixty stands four to twelve units across. The built world was dumped
once, every stand's meshes as boxes relative to its anchor, and a search moved the anchors against the same three
measures the harnesses take — the ten rays along `(2, 48, 60)`, the footprint clearance, and every vertex against
the water — plus a door within 2.0 of a road, each stand held inside its own cluster's ground, and the Builders'
houses, hills and karsts as fixed blockers. Every candidate layout was then built for real and measured with the
exact ray test before anything was written; the numbers below are that exact test and the live page, never the
search's own estimate.

### Counts, before and after

| Measure | Before (Stage D) | After | Where it was measured |
| --- | --- | --- | --- |
| Ray failures, live, all sixty clickables | **45**: 23 Thai stand-on-stand, 21 Vietnamese, 1 decor (an areca on the Huế kitchen) | **18**: 12 Thai, 6 Vietnamese, **0 decor** | Live page, fresh load, ten rays per object |
| Stands over water | Thailand 4 (`suanTh` 3,300 vertices, `sweetsTh` 1,179, `khaoSoiTh` 6, `chinHawTh` 6); Vietnam 9 (1.85 deepest) | Thailand **3** (`suanTh` 3,293, `khaoSoiTh` 6, `chinHawTh` 6); Vietnam **1** (`hoiAnQuayVn` 1.40, the quay, by design) | `thailand-world.mjs`, `vietnam-world.mjs` |
| Stand pairs with under 1.0 of clear ground | Thailand 53 (48 overlapping, worst 6.43); Vietnam 39 (31 overlapping, worst 4.44) | Thailand **32** (25 overlapping, worst 6.43, every overlap in the plain, Lanna or the peninsula); Vietnam **20** (**none overlapping**; the tightest pair touches at 0.00) | the two harnesses |
| Decorative objects in front of a stand | 1 | **0** | both, and live |

The khlongs, the old city and Sampheng, and Isan — every Thai cluster the pass re-laid — have **no ray failure, no
overlap and nothing over water**. All six Vietnamese clusters have no overlap and nothing over water but the quay.

### What is left, and why it is a ceiling

Recorded in the harnesses as dated ceilings (a listed pair may not get worse; an unlisted one fails):

**The peninsula and the Andaman, eight ray pairs.** `talayTh < babaTh` 6, `coconutSea < muslimKitchenTh` 6,
`karsts < babaTh` 6, `khamminTh < muslimKitchenTh` 5, `talayTh < muslimKitchenTh` 3, `coconutSea < babaTh` 3,
`longtail < babaTh` 3, and fourteen crowded pairs up to 6.43 (`talayTh/karsts`). The cluster holds seven clickables,
four of them 8.3 to 10.5 units across, on dry ground roughly twenty units square between the Andaman, the Gulf, the
khlong grid and the plain, with the Builder's karst decor fixed on its west shore. Twenty searches held every stand
inside the peninsula; the best left the Andaman kitchen and the tin-town kitchen overlapping by 0.9 to 2.5 with two
to five rays still covered, and every one that cleared the rays did it by pushing the tin-town kitchen into the
plain, a kitchen onto the karsts, or a door more than six units from any road. **By how much:** the peninsula is
about one stand too full, roughly eight to ten units of width short. Closing it is a resize of the tin-town and
Andaman kitchens (`props-thailand.ts`, not this pass's file) or a re-blueprint that gives the peninsula more coast.

**The plain and Lanna, four ray pairs and three stands over water.** `khaoSoiTh < suanTh` 3, `khaoSoiTh < tanTh` 3,
`suanTh < naPaddyTh` 3, `chinHawTh < tanTh` 3, `chinHawTh < suanTh` 2; `suanTh` 3,293 vertices, `khaoSoiTh` and
`chinHawTh` 6 each over the Chao Phraya; overlaps up to 4.64 (`miangTh/chinHawTh`). The river orchard is 9.6 wide and
belongs on the river bank; the Lanna valley's north edge is the Builder's hill decor, which a stand may not stand
on. The searches either left three to five rays, or put the orchard eight or more units from any road, or put a
Lanna stand on a hill. The field lunch alone moved, west to the plain road's bend: it closed four overlaps of 1.3 to 3.7 and a ray, and
leaves one of 0.53 with the sugar palms. Closing the rest needs the hills moved (`thailand-landscape.ts`, outside this pass's road-table remit) or the
orchard resized.

**Vietnam, six pairs on the live page.** `hoiAnQuayVn < miQuangVn` 4 (the quay lies on the water at the foot of
the Hội An street and the counter stands at its head; the quay cannot move inland), `starAniseVn < hanoiKitchen` 3
(the tray and the herb trays straddle the phở kitchen's 6.7-unit width, and one of the two is always in its
column), `riceSea < benThanhVn` 1, `waterPuppetsVn < banhHueVn` 1, `miQuangVn < caPheVn` 1 and
`hoanKiem < hanoiKitchen` 1. The last two graze by one ray on the live page and none offline; they are listed so the
harness holds what the live page shows. Moves tried for the two single rays opened new ones next door and were
reverted.

### Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm test` | 25 harnesses pass, including `thailand-world.mjs` and `vietnam-world.mjs` at the new ceilings |
| `npm run build:pages` | Passes (the usual chunk-size warning) |
| Live ten-ray check | Dev server restarted, fresh tab, 60 objects placed, arrival camera settled at `(2, 48, 60)` from `(-44, 0, 0)`: 18 pairs, 0 decor |
| Owner's view | Overview at 150, the 215 limit, and all twelve clusters at approach zoom, on the contact sheet `scratchpad/seasia-shared-ground.png` of the session that did this pass. At the limit the table reads with a light haze at the far corner. From above: the old city now reads as a street with the wat at its head and the kitchens along Sampheng lane to the Gulf; the khlong grid west of the river is open water and salt pans with the market on the basin; the Vietnamese clusters read as rows along their streets with ground between the stands. The peninsula still reads as the Andaman and tin-town kitchens fused, which is the ceiling above |

Not verified in this pass: the rooms and cards (nothing in them changed; every object id, room and card is as Stage
D left it), the phone viewport, the walkthrough on the published site, and the reactions at world zoom of the moved
stands beyond `thailand-reactions.mjs` and `vietnam-reactions.mjs`, which pass. `docs/thailand-rooms.md` and the
Stage A object list further up are left as their own dated records.
