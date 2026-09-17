# Thailand area research (Stage A, Researcher)

Food World, Southeast Asia world, area id `bangkok` (today "Bangkok"), with the neighbouring area id `andaman` ("Andaman coast"). Delivered 2026-09-17 by the Researcher for the lead, who fixes the object list and reviews the [image brief](thailand-image-brief.md). The lead's decisions belong in [thailand-world.md](thailand-world.md). No pictures existed when this was written.

Rules followed here: every historical claim carries a source URL in section 4. Records are separated from legends, and legends are written as "legend puts". No date is invented. Anything I could not confirm is written "unverified" and repeated in section 5. Where a fact rests only on a secondary source I say so in the line itself.

One thing is stated before anything else, because it decides half the brief. **Thai food in this period has to be honest about what was on the street and what was not.** The picture an image tool will hand back for "Thailand" is a night market of pad thai, a plate of green curry and a woman in a conical hat on a longtail boat. In the reign of Chulalongkorn none of those four things existed in that form. Pad thai was invented and distributed by a government campaign in the 1940s; green curry is first documented in 1926; the longtail boat was built by putting a car engine on a rowing boat in the 1930s; and street food as a trade belongs to the Chinese quarters of the early twentieth century and to the boom of the 1970s. What did exist, everywhere, was **water**: Bangkok was a city of canals, a third of its people lived on the water, the market was held from boats, and the noodle seller paddled to you. That is the area, and it is a better one.

---

## 1. Area brief

### 1.1 What this area is, and what it should be called

Today Thailand is two card-only areas inside one world it shares with Vietnam: `bangkok`, centred [0, -8], "the wat, the floating market, curry paste and tuk-tuks"; and `andaman`, centred [18, 10], "karsts, longtails, coconuts and the beach". Between them they hold thirteen objects, no rooms and no scene folder.

My recommendation, argued in [thailand-world.md](thailand-world.md), is that the two **merge into one area** whose id stays `bangkok` and whose display name becomes **Thailand**, with six clusters, exactly as Spain kept `spain` and grew the Albufera, Madrid, Andalusia, La Mancha, the ría and the Basque coast inside one area, and as Britain kept `london` and grew an island around it.

The id has to stay `bangkok` for reasons that are in the code, not in taste. `graph.ts` routes every recipe whose cuisine is `Thai` to `area: "bangkok"`, the green-curry enrichment row carries `area: "bangkok"` and `place: "curryPaste"`, and `world-intros.ts` names `bangkok` in two of the Southeast Asia world's three beats. A display name is not an id.

Six regions carry the food. This is a food diorama, not a scale map: the country is compressed, the Gulf and the Andaman sides of the peninsula are within sight of one another, and Chiang Mai stands a short walk from the Khorat plateau.

| Region | What it brings to the food |
| --- | --- |
| The khlongs of Bangkok and Thonburi | The floating market, the noodle boat, the alms round and the wat, the Portuguese quarter at Kudi Chin and its baked cake |
| The old city: Rattanakosin and Sampheng | The noble household kitchen where the first Siamese cookbook was written, the granite mortar and the curry paste, the Teochew shophouse and the wok, the spice stall |
| The central plain: Nonthaburi, Ratchaburi, Phetchaburi, Samut Sakhon | Rice, the buffalo, the field lunch, river fish, the durian and mangosteen orchards, palm sugar, sea salt |
| Isan, the north-east | Sticky rice, pla ra, the charcoal grill, the green papaya pounded in a clay mortar, larb |
| Lanna, the north | Khao soi carried in by Yunnanese Muslim caravans, sai ua, nam prik ong and num, the khantoke tray, fermented tea |
| The southern peninsula and the Andaman | Turmeric and the southern curries, budu and the Malay-Muslim kitchen of Pattani, the Peranakan tin town at Phuket, the sea people, the karsts |

### 1.2 Landscape, climate, waterways, settlement

**The khlongs of Bangkok.** A delta city built on soft clay a metre or two above a tidal river, laid out on water rather than on land. Through most of the nineteenth century Bangkok was called the Venice of the East; by one estimate a third of the city's residents in the mid nineteenth century lived in stilted or floating houses along the canals or the river. The Chao Phraya is brown, wide and tidal; the khlongs run off it in a grid dug for transport, drainage and rice. Weather is hot and wet, with a monsoon from May to October that raises the water and floods the fields on purpose.

**The old city.** Rattanakosin island, ringed by its own moat-canals, holds the palace, the great wats and the walled compounds of the nobility: brick and stucco whitewashed, tiered tiled roofs, and inside the walls a garden and a kitchen pavilion. Immediately south-east of it Sampheng, the Chinese quarter, is a single lane of shophouses until Yaowarat Road is cut through it between 1892 and 1900.

**The central plain.** The flattest large landscape in Southeast Asia: wet rice from horizon to horizon, broken by raised village mounds under coconut and mango, by orchard strips along the rivers at Nonthaburi, and by the hedged sugar-palm country of Phetchaburi. On the coast at Samut Sakhon, Samut Songkhram and Ban Laem the land goes flat and salt, cut into evaporation pans. Water is everywhere and is the road.

**Isan.** The Khorat plateau: sandy, higher, drier, poorer, tipped east toward the Mekong. Rain falls in a shorter season and drought is normal, so the rice is glutinous and grown once, the protein is fermented, and the village is a compact cluster of raised houses inside a bamboo fence with a pond and a wat.

**Lanna.** Mountain valleys at 300 metres and above, separated by forested ridges; a cooler, drier winter, teak on the hills, wet rice in the basins and tea gardens under the forest canopy. Chiang Mai sits inside a square brick wall and moat, with a river on its east side and caravan roads running north to Yunnan and west to Burma.

**The southern peninsula and the Andaman.** A granite spine under rainforest with tin in the streams below it, two coasts, and on the west side the drowned limestone of the Andaman: towers, arches and caves rising sheer out of green water, with mangrove behind and pale sand in the bays. Rain almost all year. Settlement is a shophouse town at the tin, a Malay village at the mangrove edge, and a boat.

### 1.3 Architecture, per cluster

| Region | Walls | Roof | Trim and street furniture | Community space |
| --- | --- | --- | --- | --- |
| The khlongs | Teak and hardwood panel walls on posts two metres above the water; woven bamboo for the poorer house; raft houses floating on bundled bamboo | Steep gables of clay tile or thatched palm, the gable peak carried up in a carved `ngao` finial | Ladders to the water, a landing stage, jars for rainwater, banana and betel at the foot of the posts, boats tied under the floor | The landing stage, the canal itself, the temple's water gate |
| The old city and Sampheng | Whitewashed brick and stucco inside the palace walls; two-storey brick-and-timber shophouses in Sampheng with an open shopfront and a shuttered upper floor | Tiered tiled roofs in orange and green with `chofa` finials and `naga` eave ends on the wats; low pantile on the shophouses | Carved gable boards, mother-of-pearl doors, gilded stucco; in Sampheng, a five-foot way, red paper lanterns, altars and gold shops | The wat courtyard, the shophouse lane, the temple fair |
| The central plain | Raised teak or bamboo houses on posts round an open platform; a rice barn on its own posts beside the house | Steep thatch or tile with deep eaves and a wide open verandah under them | Water jars, a rice mortar, fish traps, buffalo pens, a spirit house on a post | The house platform, the field bund, the village wat |
| Isan | Low raised houses of hardwood and split bamboo, smaller and plainer than the central plain's, inside a fenced compound | Shallower gabled thatch; a separate kitchen hut with a smoke-blackened roof | Sticky-rice steamers and baskets, pla ra jars under the house, a mortar, looms under the floor | The `tai thun` shaded space under the house; the village pond |
| Lanna | Teak houses on heavy posts; the `kalae` house crossing its barge-boards above the gable; brick-and-stucco wats with low sweeping roofs | Deep, low, multi-tiered roofs of wooden shingle or tile, far lower-pitched than the central style | Carved `kalae` crosses, a `ham yon` lintel over the door, water jars in a shaded rack at the gate, lacquer trays | The wat, the morning market, the khantoke floor |
| The south and the Andaman | Sino-Portuguese shophouses in stucco with shuttered arched windows, pastel render and moulded pilasters; Malay village houses on posts with plank walls | Low pantile over the shophouse arcade; steep hipped tile or thatch on the village house | The five-foot way arcade, tiled stair risers, carved timber vents; on the coast, drying racks, fish traps and boat sheds | The arcade, the mosque courtyard, the beach in front of the boats |

### 1.4 Food culture, ingredients, everyday activities — honestly

**What most people actually ate.** Rice and fish, and not much else. Monsignor Pallegoix, who first reached Siam in 1830 and stayed twenty-four years, and Anna Leonowens, writing in 1870 that fish was "so abundant and cheap that it forms a common seasoning to the labourer's bowl of rice", describe the same table: a bowl of rice, a dish of fish — dried, fermented or grilled — a `nam phrik` pounded from chilli, garlic, shallot and shrimp paste, and a plate of raw or blanched vegetables to dip in it. Meat was occasional. Curry existed and mattered, but a curry was a small, intensely seasoned dish eaten *with* rice, not a bowl of sauce. Sugar was palm sugar and it was a seasoning, not a course. A room that shows plenty here must earn it: a palace, a fair, a trade that is itself the plenty.

**What changed inside this band, and why the rooms exist.** Four things arrive almost together and they are why this particular set of rooms is possible at all.

- *Rice becomes an export crop.* The Bowring Treaty of 1855 abolished the royal trade monopolies and permitted free export of rice. Exports grew from roughly 10,000 tons a year in the 1860s to about 500,000 in the 1890s and 845,084 tons by 1904, and the Chao Phraya delta was cleared and diked to grow them. Everything about the central plain in this area — the paddy, the buffalo, the barge, the mill — is that.
- *The Chinese quarter becomes the kitchen of the city.* The Chinese population of Siam rose from about 230,000 in 1825 to about 792,000 in 1910, Teochew the largest group, and by the beginning of the twentieth century Chinese people may have made up more than half the population of Bangkok. The wok, the noodle, the roast meats, the soy and the bean curd come with them. The earliest written mention of `kuaitiao` — the rice-noodle dish — is in the *Bangkok Times* in 1898.
- *The canal becomes a market and then a road.* Khlong Damnoen Saduak was dug by hand between 1866 and 1868 to link the Tha Chin and Mae Klong rivers, and a boat-based trading community grew along its 32 kilometres. In Bangkok the reverse began: Yaowarat Road was cut through Sampheng between 1892 and 1900, and the food of the city started its slow move from the water to the street.
- *Siamese cooking is written down for the first time.* Than Phu Ying Plian Phasakorawong published *Mae Khrua Hua Pa* (แม่ครัวหัวป่าก์), serialised from 1888 and issued as a book in 1908. It is the first Siamese cookbook, it was modelled on Isabella Beeton, and it is the single best in-band document this area has: a dated list of what a noble household actually cooked.

**The staples, by region.** Long-grain rice in the centre and south, glutinous rice in Isan and the north; freshwater fish everywhere, salted, dried, fermented into `pla ra` and `kapi`; sea fish, squid and prawn on both coasts; the aromatics that are native here — galangal, lemongrass, kaffir lime, coriander root, turmeric, krachai, holy and sweet basil; chillies, which came with Portuguese traders in the sixteenth century and were absorbed completely; coconut for cream, oil and sugar; palm sugar from the toddy palm; sea salt from the pans; tamarind, lime and green mango for sourness; pork and duck in the Chinese kitchens, beef almost nowhere, chicken from the yard; bamboo shoot, morning glory, pea aubergine, banana blossom; and, in the south, more turmeric, more chilli and more coconut than anywhere else in the country.

**Everyday activities to paint.** Pounding curry paste in a granite mortar until the smell changes; frying coconut cream until the oil splits out of it; ladling noodles from a boat into a small bowl held over the gunwale; steaming sticky rice in a bamboo cone over a clay pot and tipping it out onto a mat; pounding green papaya, chilli and lime in a clay mortar with a wooden pestle; turning chicken flattened on a split bamboo over charcoal; drawing foi thong in golden threads out of a brass pan of syrup; laying a fish in a banana leaf on the coals at the field edge; drying squid on a line above the sand; rolling roti on an oiled steel plate and throwing it thin; carrying a bamboo cylinder of palm sap down from the top of a toddy palm; raking salt into cones in a drained pan; kneeling at the roadside to put rice into a monk's bowl at dawn.

### 1.5 Clothing and period

**Proposed period band: about 1880 to 1910**, the later reign of King Chulalongkorn, Rama V (r. 1868–1910). One recorded band, everyday working clothes, no costume, no pageantry, nothing modern.

Reasons. Every room in the list is anchored inside the band by a record rather than by a mood: *Mae Khrua Hua Pa* is serialised from 1888 and published in 1908; the first written `tom yum` recipe dates from 1888 and is for snakehead fish; the first written mention of `kuaitiao` is in the *Bangkok Times* in 1898; Yaowarat Road is built 1892–1900; Lanna is absorbed into Siam as Monthon Phayap in December 1899 and the arrangement is formalised in 1900, ending it as a distinct polity; Phuket's tin boom and its Sino-Portuguese shophouse town are of the late nineteenth and early twentieth centuries; rice exports pass 845,000 tons in 1904; the Damnoen Saduak boat community has been trading on its canal since the 1870s. The band also matches the documentary record for clothing: Chulalongkorn's reign is the first Siamese reign that is photographed rather than painted, so a brief written from it can be checked.

Three conflicts are stated up front and handled in section 3.3.

1. **Much of what a viewer thinks of as Thai street food is younger than the band.** Pad thai was invented and distributed by the Phibunsongkhram government in the 1940s under a campaign that gave vendors free noodle carts. Green curry is first documented in 1926, in a book by an author writing as L Phaehtraarat; Thai food historians note that the first cookbooks of the 1890s list other curries and not this one. Som tam is older than that in Lao and Isan communities — a papaya salad is already known among Lao royalty living in Bangkok in the 1869 travelogue *Nirat Wang Bang Yi Khan* — but its ubiquity in Bangkok is post-war. Boat noodles in their modern dark spiced form are mid-twentieth century, although noodles ladled from boats on the canals are exactly in band. Each of these takes the **Spain gilda answer**: paint the in-period thing, and give the later date on the card and in the repertoire line. Nothing out of band is painted.
2. **Two of the area's five existing landmarks are out of the band.** The longtail boat was created by mounting an engine on a rowing boat and extending the shaft, by Sanong Thitibura in Sing Buri in the 1930s. The tuk-tuk came to Bangkok from Japan in the 1960s. Both objects can be recast onto things that are in band and better: the sea people's boats of the Andaman, and the pulled rickshaw, which spread to Siam from the 1880s. The lead's and the owner's decision is in section 5.
3. **Commercial bottled fish sauce is not in the band either.** `nam pla` as a manufactured product dates to the early twentieth century: Teochew immigrants copied Vietnamese `nước mắm` and marketed it under the name `nam pla` in 1922. Before that, central Siamese cooks used imported Vietnamese sauce and northeastern cooks used the liquid drawn off their own `pla ra`. This is a gift, not a problem: it makes the fermenting jar, not the bottle, the object.

**Eight everyday clothing profiles, as data.** Colours use the palette names in section 1.3 of the [image brief](thailand-image-brief.md).

| # | Profile | Garments | Who wears it | Where |
| --- | --- | --- | --- | --- |
| 1 | Bangkok market woman | A `pha nung` or `chong kraben` — a long cloth wrapped, drawn between the legs and tucked at the back — in a checked or plain indigo cotton, with a `pha sabai` or a plain blouse over the chest, hair cut short in the `dok krathum` crop of the period, bare feet, a `ngob` palm-leaf sun hat on the boat | Boat vendors, market sellers, fruit sellers | The khlongs, the floating market |
| 2 | Siamese working man | `Chong kraben` in plain cotton knotted at the waist, bare chest or a collarless cotton jacket, a `pha khao ma` checked cloth over one shoulder or round the head, bare feet | Paddler, porter, fisherman, field hand, rickshaw puller | Everywhere outdoors |
| 3 | Household woman of a noble compound | A finer `chong kraben` in figured silk with a `pha sabai` over one shoulder, gold at the wrist, hair cropped and oiled, a betel set beside her | The women of the palace and noble kitchens, where the recorded recipes were written | The old city |
| 4 | Teochew shophouse man | Loose dark cotton trousers and a frogged jacket or a plain singlet, a cloth apron, wooden clogs; older men still with the queue before the Republic, younger ones cropped | Cook, noodle man, roast-meat seller, porter, coolie | Sampheng and Yaowarat |
| 5 | Isan farming household | Indigo-dyed hand-woven cotton: a wrapped `sinh` tube skirt for the woman with a woven hem band, a `sarong` or short `chong kraben` for the man, a `pha khao ma`, a checked scarf over the head against the sun, bare feet | Grower, grill cook, weaver, fisher of the ponds | Isan |
| 6 | Lanna woman and muleteer | The Lanna woman in a `sinh` with a horizontal striped body and a separate woven hem, a long-sleeved blouse and a shawl, hair in a bun with fresh flowers; the Chin Haw muleteer in dark Yunnanese jacket and trousers with a white skull cap | Market women, khao soi cooks, Yunnanese Muslim caravan men | Chiang Mai and the northern roads |
| 7 | Malay-Muslim southern household | A `kain` sarong in `pelangi` or batik pattern, a long-sleeved baju for the woman with a `selendang` scarf over the hair, a `songkok` cap and sarong over trousers for the man | Roti and budu cooks, fishers, rice growers | Pattani, Yala, Narathiwat, the mangrove coast |
| 8 | Phuket Baba household | The Nyonya woman in a `baju panjang` or fitted embroidered blouse over a batik sarong, with brooch chains and a coiled bun; the Baba man in a Chinese jacket and European trousers, a watch chain, leather shoes | Tin-town merchant families, the cooks of the shophouse kitchens | Phuket Old Town |

Children appear in every outdoor room, naked or in a wrapped cloth in the hot clusters, carrying, fetching and paddling. Monks appear in ochre robes, barefoot, with an alms bowl, and only at dawn.

**Three things to avoid, all of which an image tool will supply unasked.** The gold-spired dancer's `chada` headdress and the sequinned classical costume, which is theatre and reads as fancy dress in a food room; the conical Vietnamese `nón lá`, which belongs to the Hanoi and Mekong areas of this same world and not to Siam — the Siamese sun hat is the flatter, wider, woven `ngob`; and the "hill tribe" silver-and-embroidery costume of the Akha, Hmong and Karen, which is real but is not Lanna town dress and would be the wrong people in the wrong room.

**Reference collections (named, without inventory numbers — see section 5).** I could not obtain inventory numbers in the time available and will not invent them. Each of these is a real, named, relevant holding that the picture reviewer should check a profile against before generation:

- **The National Museum, Bangkok** and the **Bangkokian Museum** — Rattanakosin household objects, dress and kitchen equipment of the period. Profiles 1, 2, 3.
- **The Jim Thompson House and the Queen Sirikit Museum of Textiles, Bangkok** — Thai woven textiles, `chong kraben` and `sinh` construction. Profiles 1, 3, 5, 6.
- **The Chiang Mai National Museum** and **Wat Ket Karam Museum** — Lanna dress, lacquer, khantoke trays and caravan trade material. Profile 6.
- **The Thai Human Imagery Museum's photographic sources and the National Archives of Thailand** — Chulalongkorn-era photography, which is what makes this band checkable at all. All profiles.
- **Thalang National Museum and the Thai Hua Museum, Phuket** — Baba-Peranakan dress, shophouse interiors and tin-mining material. Profile 8.
- **The Baan Kudichin Museum, Thonburi** — the Siamese-Portuguese community's household objects and the `khanom farang` trade. Profiles 1 and 2.

### 1.6 What a concept image should show

There is no concept image. This is the composition I propose for one: a single wooden-table diorama seen from a high three-quarter angle, in the hot, humid, high-contrast light of the tropics an hour after sunrise, with six named clusters, one river running the length of the table into a gulf, a canal grid at its centre, a western sea with limestone towers in it, and no interface elements anywhere in the art.

Read the table from the centre outward.

1. **The khlongs** (centre, the arrival view). A wide brown river with a grid of narrower canals running off it; teak houses on posts over the water with ladders down to boats; a floating raft house; a basin where thirty small boats lie gunwale to gunwale as a market; one long paddled noodle boat at a landing stage; and behind them a wat with tiered orange-and-green roofs, gilded `chofa` finials and a white `chedi`. Nothing on this cluster stands on dry ground that could stand on water instead.
2. **The old city and Sampheng** (just east of 1). A whitewashed walled compound with a tiled kitchen pavilion and a garden inside it; outside the wall, one straight new street of two-storey shophouses with an arcade, red lanterns, an open-fronted noodle shop and a charcoal brazier on the step; a spice stall of baskets under an awning.
3. **The central plain** (north and west of 1). Flat wet rice to the horizon in bunded squares, a buffalo to its knees in one of them, a rice barn on posts, a raised village mound under coconut and mango; along the river an orchard of durian and mangosteen in dark rows; inland a stand of tall toddy palms with bamboo cylinders tied under their flower stalks; and on the coast a plate of white evaporation pans with cones of salt and a wooden rake.
4. **Isan** (far north-east, higher and drier). Sandy ground, a fenced compound of small raised houses, a fish pond, a bamboo steamer over a clay pot, jars of `pla ra` under a house, a charcoal grill with flattened chickens on split bamboo, and a mortar on the ground.
5. **Lanna** (far north, in mountains). A green basin between forested ridges, a square brick moat and wall, teak houses with crossed `kalae` barge-boards, a low wide-roofed wat, a tea garden under the forest edge, and a line of loaded mules coming down a road out of the hills.
6. **The southern peninsula and the Andaman** (south-west, across water). Limestone towers rising sheer from green sea with jungle on their tops; a beach of pale sand with wooden boats drawn up and squid drying on lines; a pastel arcaded shophouse street behind it, small, with a tin sluice and a spoil heap on the hill above; and at the other end of the cluster a mosque and a Malay village on posts at a mangrove edge.

**Transitions.** Between 1 and 2 the water gives way to one new street and the houses change from teak posts to brick and stucco. Between 1 and 3 the canals get straighter, the houses thin out and rice takes over. Between 3 and 4 the ground rises and dries, the green goes yellower and the houses get smaller. Between 4 and 5 the plateau breaks into forested ridges and the roofs go low and wide. Between 5 and 6 the country falls away south through forest to a two-coasted isthmus. Between 6 and 1 the sea runs east into the gulf and the river's mouth.

**Water.** One continuous sea round the south and west, square where it meets the table edge. One large river runs from the north down through cluster 3 and cluster 1 and reaches the sea in a wide brown mouth; a grid of canals runs off it through cluster 1 and out into the paddy of cluster 3. Nothing stands in open water except the boats, the raft house, the houses that are built on posts to stand in it, and the sea people's boats, which live there. The Albufera lesson applies: every field and quay stand goes **beside** the water, not on it.

**Landmarks.** The wat behind cluster 1, smaller than the food in front of it; the monks' alms line at the edge of cluster 1; the limestone towers behind cluster 6; the sea people's boats in the water of cluster 6; a rickshaw on the new street of cluster 2; and a mule caravan on the road into cluster 5. Each stays behind the food and smaller than its cluster's table.

---

## 2. Object list (proposed)

Twelve objects open rooms, ten ingredient stops have no room, six landmarks have a card and a 3D reaction. Seven existing ids are kept and reused; two of those are recast into the period; four hit-only children of the floating market are kept as they are.

Ids were checked against every id in `src/fw/*.ts`:

```
cd /Users/yingyingfu/Projects/fyying/food-tour && grep -rhoE "id: ['\"][a-zA-Z0-9_-]+['\"]" src/fw/*.ts | sed -E "s/id: ['\"]//; s/['\"]//" | sort -u
```

None of the nineteen new ids below collides with any of them. Prop names were checked against the keys of `SEASIA_PROPS` in `props-seasia.ts`; none collides either.

### 2.1 Objects that open rooms (12)

| id | name | zh (local name) | kind | cluster | prop | scene | purpose | tagline draft |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `floatingMarket` (existing) | The floating market | ตลาดน้ำ | place | The khlongs | `floatingMarket` (existing) | `th_khlong` | TH01. Reused: the area's hero room. A market held from boats, because the street was water | Thirty boats tied gunwale to gunwale, and the market is open |
| `kuaitiaoRuea` | The noodle boat | ก๋วยเตี๋ยวเรือ | dish | The khlongs | `noodleBoat` | `th_noodleboat` | TH02. One pot, one paddle, small bowls handed up over the gunwale | The bowl is small so that nothing spills in the wake |
| `wangKitchenTh` | The household kitchen | ครัวในวัง | place | The old city | `wangKitchen` | `th_wang` | TH03. The noble compound's kitchen, where the first Siamese cookbook was written down | The first Siamese cookbook was written in a room like this |
| `curryPaste` (existing) | The curry mortar | ครกหิน | technique | The old city | `curryKitchen` (existing) | `th_curry` | TH04. Reused. A granite mortar, a quarter of an hour of pounding, and coconut cream fried until the oil splits | Pound it until the smell changes; that is the only timer |
| `sweetsTh` | The sweets kitchen | ขนมไทย | place | The khlongs | `khanomKitchen` | `th_sweets` | TH05. Egg, sugar and coconut over charcoal, and a Portuguese inheritance three hundred years old | Golden threads drawn out of a brass pan, since Ayutthaya |
| `shophouseTh` | The shophouse kitchen | ร้านตึกแถว | place | Sampheng | `shophouseTh` | `th_shophouse` | TH06. Sampheng's Teochew kitchen: the wok, the noodle, the roast duck, the charcoal | Half of Bangkok was Chinese, and this is where it cooked |
| `naKhaoTh` | The rice-field lunch | ข้าวกลางนา | place | The central plain | `fieldLunch` | `th_paddy` | TH07. The meal carried out to the harvest and eaten on the bund | Fish on the coals, chilli in the mortar, rice in a basket |
| `isanGrillTh` | The Isan grill | ปิ้งย่างอีสาน | place | Isan | `isanGrill` | `th_isan` | TH08. Charcoal, a clay mortar and a basket of sticky rice, on the dry plateau | Grilled, pounded, fermented: three answers to a dry year |
| `khaoSoiTh` | The Lanna kitchen | ข้าวซอย | dish | Lanna | `lannaKitchen` | `th_lanna` | TH09. Khao soi from the caravan road, sai ua on the grill, and a khantoke tray | A Yunnanese noodle that came down the mule road and stayed |
| `talayTh` | The Andaman fishing kitchen | ครัวชาวเล | place | The Andaman | `andamanKitchen` | `th_andaman` | TH10. Turmeric, fresh fish and a fire on the sand under the limestone | Turmeric on the fish before it goes on the fire |
| `muslimKitchenTh` | The Malay-Muslim kitchen | ครัวมลายู | place | The south | `muslimKitchen` | `th_muslim` | TH11. Roti on the steel plate, budu in the jar, and the curries of the deep south | Roti thrown thin, and a sauce made from anchovies and time |
| `babaTh` | The tin town kitchen | ครัวบาบ๋า | place | The Andaman | `babaKitchen` | `th_baba` | TH12. A Phuket Baba household in a Sino-Portuguese shophouse, on tin money | Hokkien food, Siamese aromatics, and a tin-bought table |

**Why these twelve.** The obvious Thai room set is a night market, a green curry, a pad thai cart, a beach barbecue and a temple. Four of those five are out of the period band and the fifth is a landmark, not a kitchen. What is left when the band is honoured turns out to be richer: a market held from boats, a noodle boat, the mortar, a written-down household kitchen, the Teochew shophouse that fed half the capital, a field lunch, a grill on a dry plateau, a caravan noodle, a fire on the sand, a roti plate, a Baba kitchen and an egg-sweet pan with a Portuguese great-grandmother. Six of the twelve are water kitchens or coast kitchens, which is what makes this area unlike the eleven already built.

**Two rooms that are one room each and should be two if the lead wants thirteen or fourteen.** Isan and Lanna carry one room apiece. If the budget allows, the first additions are a **Lanna market and fermented-food room** (nam prik ong and num, `naem`, `thua nao` soybean discs dried in the sun) and an **Isan household weaving-and-steaming room**. I have not written them into the list; the budget in the image brief is for twelve.

### 2.2 Ingredient stops, no room (8 new, plus 2 existing reused)

| id | name | zh (local name) | kind | cluster | prop | purpose | tagline draft |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `chilliesSea` (existing) | Chilli, galangal & lemongrass | พริก ข่า ตะไคร้ | flavour | The old city | `spiceStall` (existing) | Reused, re-sited to the Sampheng spice stall beside the mortar. Chillies came with Portuguese traders; the galangal, lemongrass, kaffir lime and coriander root were already here | An import from across the world, and four things that were always here |
| `coconutSea` (existing) | Coconut | มะพร้าว | ingredient | The Andaman | `coconutSea` (existing) | Reused, re-sited into the southern cluster where the groves are thickest. The first pressing is cream and is fried until the oil splits; the second is the sauce | The milk is not the water; it is the flesh, squeezed twice |
| `naPaddyTh` | The paddy and the buffalo | นาข้าว | ingredient | The central plain | `paddyTh` | Wet rice in bunded squares, the buffalo that ploughs it, and the export trade that cleared the delta to grow it | Ten thousand tons a year became eight hundred thousand |
| `plaTh` | The river fish and the traps | ปลาน้ำจืด | ingredient | The central plain | `fishTraps` | Snakehead, catfish and gourami out of the canals and the flooded fields; the fish that the first written `tom yum` recipe of 1888 was made from | So cheap it seasons the labourer's bowl of rice |
| `tanTh` | The sugar palms | ตาลโตนด | ingredient | The central plain | `sugarPalms` | The toddy palm of Phetchaburi, climbed to cut the flower stalk, the sap caught in a bamboo cylinder and boiled down in a flat pan | A man goes forty metres up a tree for a spoon of sugar |
| `kluaTh` | The salt pans | นาเกลือ | ingredient | The central plain | `saltPans` | Sea water let into tiled pans and left to the dry season; the salt that every fermented thing in this area depends on | Nothing here ferments without it |
| `plaRaTh` | The pla ra jars | ปลาร้า | flavour | Isan | `plaRaYard` | Freshwater fish salted with rice bran and left six months or more; Isan's protein, its seasoning, and the liquid that stood in for fish sauce before there was a bottle | Six months in a jar, and the whole plateau tastes of it |
| `miangTh` | The tea gardens | เมี่ยง | ingredient | Lanna | `miangGrove` | Assam tea grown under the forest canopy, steamed and fermented in bamboo baskets, and chewed rather than drunk; a Lanna household and ceremonial food | Tea that is eaten, not drunk |
| `suanTh` | The river orchards | สวนผลไม้ | ingredient | The central plain | `riverOrchard` | The Nonthaburi riverside orchards: durian, mangosteen, mango and rambutan on ridged beds between water channels | The best soil in Siam, and it is made of river |
| `khamminTh` | Turmeric and the southern beds | ขมิ้น | flavour | The south | `turmericBeds` | Turmeric, which stains every southern curry yellow-orange, with black pepper, `krachai` and the chilli heat the south is known for | The south is yellow because of one root |

### 2.3 Landmarks with a card and a 3D reaction (6)

| id | name | zh (local name) | kind | cluster | prop | purpose | tagline draft |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `wat` (existing) | The wat | วัด | landmark | The khlongs | `wat` (existing) | Kept unchanged and in period. Tiered roofs, `chofa` finials, `naga` eaves and a `chedi`; the temple fair is where much of the city's cooked food was sold | Tiered roofs, a golden chedi, and a fair that sells food |
| `almsRound` (existing) | The alms round | บิณฑบาต | landmark | The khlongs | `almsRound` (existing) | Kept unchanged and in period. Monks walking barefoot at first light; the household kneels and puts rice in the bowl | The first cooking of the day is for somebody else |
| `karsts` (existing) | The limestone karsts | เกาะหินปูน | landmark | The Andaman | `karst` (new prop for this object, replacing `none`) | Kept in period; given a real prop so it has a 3D reaction and counts in the object audit. Drowned limestone with caves and overhangs, and the fishing ground under it | Reefs lifted out of the sea, then dissolved by rain |
| `longtail` (existing) | The sea people's boats | เรือชาวเล | landmark | The Andaman | `mokenBoat` (new prop, replacing `none`) | **Recast into the band.** The longtail is a 1930s invention and cannot be dressed into 1900. The Moken, Moklen and Urak Lawoi lived on hand-built `kabang` boats along this coast, each hollowed from a single log | A house, a boat and a livelihood, hollowed from one log |
| `tukTuk` (existing) | The rickshaw | รถลาก | landmark | The old city | `rickshaw` (new prop, replacing `none`) | **Recast into the band.** The tuk-tuk arrived from Japan in the 1960s; the pulled rickshaw spread through Asia and reached Siam from the 1880s, and was how the new streets were used | The first vehicle Bangkok had that was not a boat |
| `chinHawTh` | The Chin Haw caravan | จีนฮ่อ | landmark | Lanna | `muleCaravan` | New. Yunnanese Muslim traders whose mule caravans worked the roads between Yunnan, Burma, Laos and Chiang Mai in the late nineteenth century, and who brought khao soi with them | Mules from Yunnan, and a noodle that got off here |

**Nothing is proposed for retirement.** All five existing landmark or place ids survive; two are recast rather than retired, because both have an in-band subject sitting in exactly the same place. That is a better outcome than Britain's, where the London Eye had no recast at all.

### 2.4 How the existing ids are reused

| id | Now | Change needed |
| --- | --- | --- |
| `floatingMarket` | `place`, `place: true`, `open: "reveal"`, four hit-only children, no room | Keeps the id, the name, the `place` flag and the four children. **Gains `scene: "th_khlong"` and a rewritten blurb.** The interaction between `open: "reveal"` and `scene` on one object has no precedent in the code and is a Stage B question for the lead; see section 5 |
| `curryPaste` | `technique`, `place: true`, `placeName: "Curry kitchen"`, the target of the green-curry enrichment row | Keeps the id, the `place` flag, the `placeName` and the recipe target. **The name changes from "Curry paste & the wok" to "The curry mortar" and the blurb is rewritten.** The wok belongs to the Chinese shophouse and is going there; the mortar is what this object is. A name change without an id change, which the playbook flags as the dangerous case: every agent must be told |
| `chilliesSea` | `flavour`, prop `spiceStall`, `area: "bangkok"` | No change except its position and a longer blurb. Its existing text is already about the Portuguese chilli and the native aromatics and is the closest of the existing cards to the right subject |
| `coconutSea` | `ingredient`, prop `coconutSea`, `area: "andaman"` | **Its `area` changes to `bangkok`** when the two areas merge. Otherwise position and blurb length only; its existing text about the first and second pressings is correct and good |
| `wat`, `almsRound` | Landmark cards in period, with props | No change but position, blurb length and a `NEXT` to a real room now that rooms exist |
| `karsts`, `longtail`, `tukTuk` | Landmark cards, `hitOnly: true` with `prop: "none"` — no mesh, no `poke`, no 3D reaction, and they do not count as non-food clickables in the object audit | All three get a real prop. `karsts` keeps its subject; `longtail` and `tukTuk` are recast onto in-band subjects as in section 2.3. `longtail` and `tukTuk` keep their ids and change name, `zh`, blurb and prop |
| `stall-fruit`, `stall-noodles`, `stall-herbs-th`, `stall-coconut` | Hit-only children of `floatingMarket` | Kept as they are, as the market's own stalls. `stall-noodles` and `stall-fruit` are `kind: "dish"` and therefore need a repertoire; both have one. **`stall-noodles`'s blurb is rewritten so that it does not duplicate the `kuaitiaoRuea` room**, and gains a `NEXT` to it. Its existing text, which describes the modern dark boat-noodle broth and pad thai, is the single most out-of-band paragraph in the area |
| `tukTuk()` the prop function | Three coloured tuk-tuks circle the Bangkok road loop in `layoutSeasia` as decor | Not an object, but the same period problem. When `tukTuk` the object is recast, the three circling vehicles become rickshaws or ox carts. A Builder task, named here so it is not missed |

### 2.5 Ambient speech lines, per room object

Four to six lines each. Thai first, then English on the same line, in the format the playbook asks for. Northern, Isan and southern lines are written in the regional language where that is what would be spoken.

`floatingMarket` (Thai)
- `"เรือมาแล้ว! · The boat's here!"`
- `"มะม่วงหวานมาก ชิมก่อนได้ · The mangoes are very sweet, taste one first."`
- `"ส่งชามมาสิ · Pass your bowl over."`
- `"อย่าโยกเรือ! · Don't rock the boat!"`
- `"ขายหมดก่อนสาย · Sold out before mid-morning."`
- `"เอามะพร้าวอ่อนไหม · Do you want a young coconut?"`

`kuaitiaoRuea` (Thai)
- `"ชามเล็ก ๆ กินสองชามก็ได้ · Small bowls; you can have two."`
- `"เผ็ดไหม? ใส่พริกเอง · Spicy? Put your own chilli in."`
- `"ระวัง ร้อน · Careful, it's hot."`
- `"ไม่ต้องลงเรือ ยื่นมือมา · Don't get in the boat, just reach out."`
- `"น้ำซุปเคี่ยวตั้งแต่ตีสี่ · The broth has been on since four in the morning."`

`wangKitchenTh` (Thai)
- `"ตำให้ละเอียดกว่านี้ · Pound it finer than that."`
- `"แกะให้บางที่สุด · Carve it as thin as it will go."`
- `"จดไว้ด้วย เดี๋ยวลืม · Write it down, or we will forget it."`
- `"ชิมก่อน แล้วค่อยเติมน้ำปลา · Taste it first, then add the fish sauce."`
- `"ของหวานต้องทำตอนเช้า · The sweets have to be made in the morning."`

`curryPaste` (Thai)
- `"ตำจนหอม ไม่ใช่จนละเอียด · Pound it until it smells right, not until it's smooth."`
- `"รอให้น้ำมันแตกก่อน · Wait for the oil to split first."`
- `"กะปิอีกนิด · A little more shrimp paste."`
- `"ครกหินเท่านั้น ครกดินไม่ไหว · A stone mortar only; a clay one won't do."`
- `"แขนล้าแล้ว เปลี่ยนมือ · My arm's gone; swap with me."`

`sweetsTh` (Thai)
- `"มือต้องนิ่ง ไม่งั้นเส้นขาด · Keep your hand steady or the thread breaks."`
- `"ไข่แดงอย่างเดียว · Egg yolks only."`
- `"น้ำเชื่อมเดือดพอดีแล้ว · The syrup is at exactly the right boil."`
- `"ขนมนี้มาจากฝรั่ง แต่ทำกันมาสามร้อยปี · This one came from foreigners, but we have made it for three hundred years."`
- `"ใส่ใบเตยด้วย · Put the pandan in as well."`

`shophouseTh` (Teochew and Thai)
- `"火大一点! · Turn the fire up!"`
- `"เส้นใหญ่หรือเส้นเล็ก · Wide noodles or thin?"`
- `"两碗! · Two bowls!"`
- `"เป็ดเพิ่งลงจากเตา · The duck has just come off the fire."`
- `"เอาน้ำส้มพริกดองไหม · Do you want the chilli vinegar?"`

`naKhaoTh` (Central Thai)
- `"พักก่อน กินข้าวเสียที · Stop a minute and eat something."`
- `"ปลาสุกแล้ว แกะใบตองออก · The fish is done; open the leaf."`
- `"ตำน้ำพริกให้หน่อย · Pound the nam phrik, would you."`
- `"ควายลงน้ำอีกแล้ว · The buffalo's got into the water again."`
- `"อีกสองแปลงก็เสร็จ · Two more squares and we're finished."`

`isanGrillTh` (Isan)
- `"กินข้าวแล้วบ่ · Have you eaten yet?"`
- `"ตำบักหุ่งให้แซ่บ ๆ · Pound the papaya really hot."`
- `"ไก่ใกล้สุกแล้ว · The chicken is nearly done."`
- `"เอาปลาแดกใส่บ่ · Shall I put pla ra in it?"`
- `"ข้าวเหนียวยังฮ้อนอยู่ · The sticky rice is still hot."`

`khaoSoiTh` (Northern Thai)
- `"กิ๋นข้าวก่อนเน้อ · Eat first, will you."`
- `"เส้นทอดใส่ข้างบน · The fried noodles go on top."`
- `"เอาผักดองกับหอมแดงมาปะ · Bring the pickled greens and the shallots."`
- `"ไส้อั่วปิ้งไว้แล้ว · The sai ua is already on the grill."`
- `"ม้าต่างลงมาแล้วกา · Have the pack mules come down yet?"`

`talayTh` (Southern Thai)
- `"ปลาเพิ่งขึ้นจากเรือ · The fish has just come off the boat."`
- `"ทาขมิ้นก่อนย่าง · Rub the turmeric on before it goes on."`
- `"หมึกแห้งพอแล้ว เก็บได้ · The squid is dry enough; bring it in."`
- `"น้ำลงแล้ว รีบหน่อย · The tide's gone out; be quick."`
- `"เผ็ดใต้ เผ็ดจริง · Southern hot is properly hot."`

`muslimKitchenTh` (Patani Malay and Thai)
- `"Roti panah! · Hot roti!"`
- `"Budu sikit je · Just a little budu."`
- `"นวดให้นุ่มกว่านี้ · Knead it softer than that."`
- `"ข้าวหมกยังไม่ได้ที่ · The khao mok isn't ready yet."`
- `"Makan dulu · Eat first."`

`babaTh` (Hokkien and Thai)
- `"火候要够 · The heat has to be right."`
- `"หมูฮ้องเคี่ยวตั้งแต่เช้า · The moo hong has been simmering since morning."`
- `"เอาจานลายครามมา · Bring the blue-and-white plates."`
- `"เหมืองปิดแล้วหรือยัง · Has the mine knocked off yet?"`
- `"กินก่อนเย็น · Eat before it goes cold."`

---

## 3. Room list

Twelve rooms. Coordinates are for the Room maker to measure on the delivered paintings; nothing here fixes a pixel. Sizes are exactly 1672 x 941 wide and 941 x 1672 portrait.

**Sprites.** Six, and every one of them is a thing that is meant to move and therefore must arrive as its own keyed sprite on white, never as a crop out of a finished painting: `th_motion_lantern.png`, `th_motion_garlic_string.png`, `th_motion_squid_line.png`, `th_motion_sai_ua.png`, `th_motion_egret.png`, `th_motion_pla_tapian.png`. Three rooms — `th_noodleboat`, `th_sweets` and `th_muslim` — take no sprite at all and take their motion from fire, steam, a traced liquid and light through an opening, which the Spain pass proved is the safer choice whenever a hanging object would be crossed by a person or cut by the frame. All three still carry an empty hook, as Britain's sprite-less rooms do, so a later pass can hang something there without a regeneration.

### 3.1 The twelve rooms

| Room id | Folder | Opens from | Regional setting | Main food and accurate ingredient list | Three discovery subjects | Signature motion | Supporting cues | Sprites |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `th_khlong` | `th_khlong` | `floatingMarket` | A canal basin at first light, thirty small wooden boats tied gunwale to gunwale under teak houses on posts, a wat roof behind | Boats loaded with mangosteen, rambutan, green and ripe mango, bananas on the stem, durian, morning glory, banana blossom, pea aubergine, galangal and lemongrass in bundles; a young coconut opened with a cleaver and the water running out of it; marigold garlands and lotus buds for the temple; one small charcoal brazier in a boat with a pan on it. No plastic bags, no ice boxes, no motor | The opened young coconut with the water running; the boat of mangosteen and rambutan; the cleaver and the cut husks | A cleaver taking the top off a young coconut and the water pouring out of the cut into a cup | Steam from the brazier pan; the water surface between the boats moving as one boat is poled past; an egret crossing open sky over the wat | `th_motion_egret.png`, `th_motion_pla_tapian.png` |
| `th_noodleboat` | `th_noodleboat` | `kuaitiaoRuea` | A single long paddled boat drawn up against a wooden landing stage in a narrow canal, houses on posts on both sides, hot late morning | A charcoal pot amidships with a stock of pork bones, star anise, cinnamon and pepper; a tray of flat and thin rice noodles; a basket of morning glory and bean sprouts; pork or beef, liver and meatballs; small chinaware bowls, a wire strainer basket and a long ladle; a rack of condiments — dried chilli, sugar, vinegar with chilli, fish sauce; a pile of already-used bowls stacked on the stage. No modern plastic bowls, no gas | The bowl being handed up over the gunwale; the strainer basket lifting noodles out of the pot; the stack of empty bowls | The ladle lifting from the pot and pouring broth into a bowl: clear lip at the ladle, a visible fall, a clear landing on the noodles | Steam off the pot and the filled bowl; charcoal glow under the pot; the canal water moving away from the hull | none |
| `th_wang` | `th_wang` | `wangKitchenTh` | An open-sided kitchen pavilion inside a whitewashed noble compound, teak floor, tiled roof, a garden and a wall beyond, mid-morning | A brass tray of `nam phrik` with its accompaniments — blanched vegetables, fried fish, an omelette cut in strips; a bowl of massaman with cardamom, cinnamon, cloves and peanuts; carved fruit and vegetables, a pomelo cut into flowers and a chilli cut into a flower; `khao chae`, rice in jasmine-scented iced water with its side dishes; a stone mortar, a brass pan, a betel set; a bound manuscript and an inkpot on a low table | The carved fruit and the small knife; the tray of nam phrik and its vegetables; the manuscript and inkpot on the table | The small carving knife turning a chilli into a flower in two hands: a tight, well-lit working area with both hands and the whole chilli visible | Steam off the massaman pot; light falling through the open side of the pavilion onto the teak floor; leaves moving in the garden beyond | `th_motion_pla_tapian.png` |
| `th_curry` | `th_curry` | `curryPaste` | A household kitchen under a house on posts: a hard earth floor, a clay charcoal stove, a bamboo rack of vessels, daylight through the open side | A heavy granite mortar and pestle with a paste half made in it — dried and fresh chillies, galangal, lemongrass, kaffir lime zest, coriander root, garlic, shallot, white pepper, `kapi`; a coconut grater stool with half a coconut on it and a bowl of grated flesh; a cloth over a bowl with the first pressing of cream in it; a wide pan on the stove with the cream frying and the oil beginning to separate at the edge; pea aubergines, whole green chillies, holy basil, palm sugar in a lump and a bottle of sauce | The mortar with the half-made paste; the pan with the coconut cream splitting; the coconut grater with the grated flesh | The pestle coming down into the mortar with the paste moving under it, one hand on the rim: the whole mortar and both hands visible | Steam and small breaking bubbles at the surface of the frying cream; charcoal glow in the stove mouth; the garlic string moving where it hangs | `th_motion_garlic_string.png` |
| `th_sweets` | `th_sweets` | `sweetsTh` | A small brick-and-timber kitchen in the Portuguese quarter at Kudi Chin, a church tower visible through the door, afternoon | A wide brass pan of clear sugar syrup at a low boil with a cone drawing golden `foi thong` threads over it and a coil of finished threads on a tray; `thong yip` pinched into six-pointed cups and `thong yot` dropped in beads; `khanom mo kaeng` baked in a tray; `khanom farang kudi chin` — small round wheat, duck-egg and sugar cakes topped with raisin and candied winter melon — cooling on a rack; a bowl of duck-egg yolks; grated coconut, pandan leaves and palm sugar; a charcoal fire with embers on the lid of the baking tray | The brass pan with the threads being drawn; the tray of small round cakes; the bowl of duck-egg yolks | The cone drawn back and forth over the syrup with unbroken golden threads falling from it onto the surface: clear lip at the cone, a visible fall, a clear landing on the syrup | Steam off the syrup pan; embers glowing on the baking tray lid; light through the open door | none |
| `th_shophouse` | `th_shophouse` | `shophouseTh` | An open-fronted Teochew shophouse on the new Yaowarat street, evening, the arcade and the street lamps outside, a shuttered upper floor above | A wok over a roaring charcoal ring with noodles going into it; roast duck and crisp pork belly hanging on hooks over a chopping block with a cleaver; a pot of rice congee with the surface breaking; a steamer stack with the lid lifted; bean curd, preserved vegetable, salted egg and soy in jars; a bamboo strainer, a long chopstick, a cleaver and a tin tray of condiments; low stools and a marble-topped table with men eating. No electric light, no stainless steel, no printed signage in any language | The wok with the noodles in it; the roast duck on its hook over the block; the open steamer with its lid beside it | The wok tossed so the noodles lift clear of the pan in one mass and fall back, with the flame rising round the rim | Steam off the congee and the open steamer; charcoal glow under the wok ring; the red lantern swinging under the arcade | `th_motion_lantern.png` |
| `th_paddy` | `th_paddy` | `naKhaoTh` | The bund between two flooded rice squares at harvest, mid-morning, a rice barn on posts behind, a buffalo standing in water at a distance | A small fire of rice straw at the bund with a fish wrapped in banana leaf on it, the leaf charred and opened; a clay mortar on the ground with green chilli, garlic, shallot and lime being pounded into `nam phrik`; a lidded basket of steamed rice and a second, conical bamboo steamer; a bundle of morning glory and cucumber; a water gourd; a sickle and a bundle of cut stalks; banana-leaf packets tied with split bamboo | The fish in its opened banana leaf on the fire; the mortar with the nam phrik; the open rice basket | A banana-leaf parcel opened on the fire with steam coming off the fish and the leaf peeling back, both hands visible and correct | Steam off the opened fish and the rice basket; the straw fire's small flame and smoke drifting low and to one side; an egret crossing open sky over the paddy | `th_motion_egret.png` |
| `th_isan` | `th_isan` | `isanGrillTh` | The shaded ground under a raised Isan house on the dry plateau, late afternoon, a fence, a pond and a bamboo grove beyond | A long charcoal trough grill with chickens flattened between split-bamboo clamps turning over it, and skewers of pork; a tall clay mortar on the ground with green papaya shredded into it, long beans, tomato, dried shrimp, chilli, garlic, lime and palm sugar, a wooden pestle in one hand and a spoon in the other; woven baskets of sticky rice with the lids off; a board of `larb` chopped with toasted rice powder, mint and shallot; a row of `pla ra` jars against the house posts; banana-leaf cups and no plates | The grill with the chickens in their bamboo clamps; the clay mortar with the papaya in it; the open sticky-rice baskets | The wooden pestle striking down into the clay mortar while the spoon turns the papaya under it: both hands, the whole mortar and the papaya visible | Charcoal glow and small flame under the grill; steam off the just-opened sticky-rice baskets; the chilli string moving where it hangs | `th_motion_garlic_string.png` |
| `th_lanna` | `th_lanna` | `khaoSoiTh` | A Lanna kitchen with a low wide tiled roof and a teak wall, cool northern morning, a brick wat and a forested ridge through the opening | A pot of khao soi curry broth — turmeric, dried chilli, ginger, coriander root, coconut milk — with soft egg noodles in a bowl and a nest of the same noodles fried crisp on top; pickled mustard greens, sliced shallot, lime and a spoon of chilli paste in oil beside it; coils of `sai ua` on a low charcoal grill; bowls of `nam prik ong` and `nam prik num` with blanched vegetables, pork crackling and steamed sticky rice; a lacquered `khantoke` tray set on the floor with small bowls on it; `thua nao` soybean discs drying on a rack | The bowl with the crisp noodle nest on it; the sai ua coil on the grill; the khantoke tray on the floor | The coil of sai ua turned once on the grill with the fat catching and the sausage settling back, in a clear area with the whole coil visible | Steam off the khao soi pot and the bowl; charcoal glow under the grill; cool daylight falling through the open side onto the floor | `th_motion_sai_ua.png` |
| `th_andaman` | `th_andaman` | `talayTh` | A fire on pale sand in front of wooden boats drawn up, limestone towers behind across green water, hot midday with high haze | Whole fish rubbed with turmeric and salt on a grill of green sticks over driftwood coals; squid split and drying on a line; a pot of `kaeng som` — sour orange curry of turmeric, chilli and tamarind, with fish and green papaya in it; a plate of `sataw` stink beans with prawns; a stone mortar with turmeric, chilli, garlic and shrimp paste; a coconut opened on the sand; banana-leaf plates and a basket of rice | The fish on the stick grill with the turmeric crust; the line of drying squid; the pot of orange kaeng som | A whole turmeric-rubbed fish turned once on the green-stick grill, the skin lifting off the sticks, in clear light with the whole fish visible | Steam off the kaeng som pot; the driftwood fire's flame and low smoke to one side; the sea surface moving well away from every person and boat | `th_motion_squid_line.png`, `th_motion_egret.png` |
| `th_muslim` | `th_muslim` | `muslimKitchenTh` | A Malay-Muslim village kitchen at the mangrove edge in the deep south, a plank house on posts, a mosque roof beyond, early evening | A round steel plate over charcoal with `roti` being thrown thin and one already puffing on the plate; a pot of `khao mok` — rice cooked with chicken, turmeric, cardamom and cinnamon — with the lid lifted and resting beside it; a jar of `budu` anchovy sauce with a ladle in it; `nasi kerabu` blue rice with shredded herbs and coconut; a bowl of massaman with whole spices; green chillies, shallots, ginger, garlic, turmeric and dried fish on a board; enamel plates and a folded prayer mat on the step | The roti puffing on the steel plate; the open pot of khao mok; the budu jar with its ladle | A disc of roti dough thrown out thin from two hands and settling toward the plate, with the whole disc and both hands visible and correct | Steam off the open khao mok pot; charcoal glow under the steel plate; light from the open side and the sky over the mangrove | none |
| `th_baba` | `th_baba` | `babaTh` | The back kitchen and dining room of a Sino-Portuguese shophouse in Phuket town, a tiled floor and an airwell above, the arcade and a tin sluice on the hill through the front | A clay pot of `moo hong` — pork belly braised black with garlic, pepper and soy — with the lid off; a bowl of `mee Hokkien` — thick yellow noodles in gravy with prawn and pork; `o-tao` oyster and taro fried on a flat iron plate; a plate of `nam prik kung siap` with smoked prawn; blue-and-white Nyonya porcelain and a tiered tiffin carrier; a marble-topped table, bentwood chairs, a carved wooden screen, ancestral offerings in a niche | The open clay pot of black braised pork; the tiffin carrier open on the table; the flat iron plate with the oyster fry | A tiffin carrier tier lifted clear of the stack with steam coming off the food in it, the whole tier and both hands visible | Steam off the open clay pot and the tiffin tier; the airwell's shaft of daylight down onto the tiled floor; the red lantern swinging in the airwell | `th_motion_lantern.png` |

**Note on `th_paddy`'s second cue.** A chilli-string sprite was cut from the list to hold the set at six; `th_paddy` takes its second and third cues from the straw fire and the egret instead, and its only sprite is `th_motion_egret.png`. The garlic-and-shallot string covers the hanging motion in `th_curry` and `th_isan`.

**Sprite use, room by room:** `th_khlong` egret and pla tapian; `th_noodleboat` none; `th_wang` pla tapian; `th_curry` garlic string; `th_sweets` none; `th_shophouse` lantern; `th_paddy` egret; `th_isan` garlic string; `th_lanna` sai ua; `th_andaman` squid line and egret; `th_muslim` none; `th_baba` lantern. Every one of the six sprites is used at least once, which is the rule Spain broke when `es-pepper-ristra` was delivered and never hung.

### 3.2 One-sentence discovery per subject

Sources are given in section 4; only specialist facts carry one.

**th_khlong.** The opened coconut: the water inside a young coconut is not the milk — the milk is the mature flesh grated and squeezed, the first pressing thick enough to fry. The boat of fruit: the Nonthaburi riverside orchards have grown durian for centuries and the Chinese immigrants of the early nineteenth century turned it into a commercial crop. The cleaver and the husks: through most of the nineteenth century Bangkok was called the Venice of the East, and by one estimate a third of its people lived on stilts or on rafts on the water.

**th_noodleboat.** The bowl handed up: the earliest written mention of `kuaitiao`, the rice-noodle dish, is in the *Bangkok Times* in 1898; noodles are Chinese and arrived with the migration that made Chinese people perhaps more than half of Bangkok's population by 1900. The strainer basket: the bowls were kept small so a customer could finish before the boat had to move, which is the whole reason the dish is served that way. The stack of bowls: the dark spiced broth that "boat noodles" means today is mid-twentieth century; in this canal the broth is pork bone, soy and pepper.

**th_wang.** The carving knife: fruit and vegetable carving, `kae sa lak`, is court work and was one of the household skills a noblewoman was expected to have. The nam phrik tray: a `nam phrik` with blanched vegetables, fried fish and an omelette is the everyday Siamese meal at every level of society, and the palace version differs in refinement, not in kind. The manuscript: Than Phu Ying Plian Phasakorawong serialised *Mae Khrua Hua Pa* from 1888 and published it as a book in 1908; it is the first Siamese cookbook and it was modelled on Isabella Beeton's *Book of Household Management*.

**th_curry.** The mortar: a granite mortar, not a clay one, and about a quarter of an hour of pounding; the cook stops when the smell changes, not when the paste looks smooth. The splitting cream: coconut cream is fried until its oil separates before the paste goes in, which is the step that makes a curry taste right and which no blender can do for you. The grater: massaman is the oldest named curry in the Siamese written record, praised in the poem *Kap He Chom Khrueang Khao Wan*, written by the future Rama II in 1800 — green curry, by contrast, is not documented until 1926.

**th_sweets.** The brass pan: `foi thong`, golden threads, is the Portuguese `fios de ovos`, and the Siamese egg-and-sugar sweets are credited to Maria Guyomar de Pinha, who ran King Narai's palace kitchens at Ayutthaya for more than twenty-five years in the seventeenth century. The small cakes: `khanom farang kudi chin` is a wheat, duck-egg and sugar cake topped with raisin and candied winter melon, baked in the Portuguese-descended quarter at Kudi Chin, where the community has lived since King Taksin granted it land after the fall of Ayutthaya in 1767. The yolks: these sweets use yolks only, and the whites went to the builders — reported widely, unverified; see section 5.

**th_shophouse.** The wok: the Chinese population of Siam rose from about 230,000 in 1825 to about 792,000 in 1910, Teochew the largest group, and the wok, the noodle and the roast meats came with them. The duck on its hook: Yaowarat Road was cut through the old Sampheng lane between 1892 and 1900 by decree of King Chulalongkorn, and the business of the quarter moved out of the lane and onto the new street. The steamer: what a visitor now calls Thai street food began in these Chinese quarters in the early twentieth century and only became general in the 1970s — reported, not a document; see section 5.

**th_paddy.** The fish in its leaf: fish was so cheap that Anna Leonowens, writing in 1870, said it "forms a common seasoning to the labourer's bowl of rice". The mortar: `nam phrik` — chilli, garlic, shallot, shrimp paste and lime pounded together and eaten with raw or blanched vegetables — is described in English accounts of the mid nineteenth century as the Siamese condiment. The rice basket: the Bowring Treaty of 1855 allowed rice to be exported freely, and exports rose from about 10,000 tons a year in the 1860s to 845,084 tons in 1904, which is what cleared and diked this plain.

**th_isan.** The bamboo clamps: the whole flattened bird held between split bamboo is what lets a charcoal trough cook thirty at once and turn them with one hand. The clay mortar: a papaya salad is already recorded among Lao people in Bangkok in Khun Phum's travelogue *Nirat Wang Bang Yi Khan* of 1869, but `som tam` became a Bangkok street dish only after the post-war migration from Isan. The pla ra jars: `pla ra` is freshwater fish layered with salt and rice bran and left for six months or more, and before bottled fish sauce existed the liquid drawn off it was what the northeast seasoned with.

**th_lanna.** The crisp noodle nest: khao soi came into Chiang Mai with the Chin Haw, Yunnanese Muslim traders whose mule caravans worked the roads between Yunnan, Burma and Lanna at the end of the nineteenth century, and it picked up the coconut milk on the way through Burma. The sai ua coil: the northern sausage is pork worked with a curry paste of lemongrass, kaffir lime leaf, galangal and turmeric, which is why it is the one Thai sausage that tastes of herbs rather than of garlic. The khantoke tray: Lanna was a separate kingdom under Siamese suzerainty until it was made Monthon Phayap in December 1899 and its own institutions abolished, and its food, language and script are still not the central plain's.

**th_andaman.** The turmeric crust: the south uses more turmeric than anywhere else in the country, which is why its curries are yellow-orange rather than red or green. The drying squid: the same wind that dries the squid is why the Moken, Moklen and Urak Lawoi moved between islands by season, in boats hollowed from a single log. The kaeng som pot: the southern sour curry takes its sourness from tamarind and its heat from a paste with no coconut milk in it at all, which is why it looks thin and is not.

**th_muslim.** The roti: the Malay-Muslim provinces of Pattani, Yala and Narathiwat keep a halal kitchen with roti, `nasi kerabu` and `khao mok` in it, and the language of the household is Patani Malay, not Thai. The khao mok pot: rice cooked with the meat and whole spices is the same idea as a biryani and arrived by the same Indian Ocean routes. The budu jar: `budu` is anchovies and salt fermented for months and is the deep south's own fish sauce, made and used where `nam pla` is not.

**th_baba.** The black pork: `moo hong` is pork belly braised with garlic, white pepper and dark soy until it goes black, and it is Hokkien cooking done with Siamese aromatics. The tiffin carrier: Phuket's tin boom of the late nineteenth century brought Hokkien and Straits Chinese families and built the Sino-Portuguese shophouse town, over two hundred of which still stand. The oyster fry: `o-tao`, oyster and taro on a flat iron plate, is a Phuket dish and exists nowhere else in Thailand under that name.

### 3.3 The corrections a Thai image prompt needs

There is no example prompt for this area. These are the corrections that the [art direction](art-direction.md) and the period band force on the default image-tool idea of Thailand, and they are written into the [image brief](thailand-image-brief.md).

1. **Period.** One recorded band, about 1880 to 1910, everyday working clothes, and no mixing of eras. No electric light, no plastic, no stainless steel, no printed packaging, no motorcycle, no motor boat, no gas ring, no modern crockery, no laminated menu, no photograph on a wall.
2. **Sizes.** Exactly 1672 x 941 and 941 x 1672. Anything else is rejected.
3. **No pad thai anywhere.** It was invented and distributed by a government campaign in the 1940s. The in-band fried noodle is the Chinese `kuai tiao phat` in the shophouse wok, and the word pad thai appears only in the shophouse's repertoire line with its date attached.
4. **No green curry in a painting.** It is first documented in 1926. The curry room paints massaman, which is in the written record from 1800, and the paste in the mortar, which is timeless. Green curry keeps its place in the `curryPaste` repertoire — it is the one Thai recipe the export holds — with the 1926 date in its line.
5. **No longtail boat.** The engine-on-a-shaft boat is a 1930s invention. The Andaman boats are wooden hulls with a sail or oars, and the sea people's `kabang`.
6. **No tuk-tuk.** It arrived from Japan in the 1960s. The vehicle on the new street is a pulled rickshaw.
7. **No bottled fish sauce.** Commercial `nam pla` was marketed from 1922. In this band the seasoning comes out of a jar of `pla ra`, a jar of `budu`, an earthenware pot of imported Vietnamese sauce, or a lump of `kapi` wrapped in leaf.
8. **No conical Vietnamese hat.** The `nón lá` belongs to Hanoi and the Mekong, which are areas of this same world. The Siamese sun hat is the wider, flatter, woven `ngob`.
9. **No classical dance costume, no gold-spired headdress, no temple-mural gods on any wall in a kitchen.** These are the first things an image tool reaches for and all three are theatre in a food room.
10. **No hill-tribe costume in the Lanna room.** Akha, Hmong and Karen dress is real and is not Chiang Mai town dress.
11. **No cut flowers arranged in a vase, no orchid garnish, no carved-vegetable swan on a buffet.** Carving belongs in the palace kitchen and is done there, in hand, on real fruit.
12. **Nothing hot is sealed.** Every pot, steamer and tiffin tier that should steam is shown open or with its lid lifted and resting beside it.
13. **Boats sit in water and people do not.** Nobody stands in the canal, the sea or a flooded field except the buffalo, which is in one deliberately.
14. **Regional balance.** Central Thailand carries six rooms, the south three, Lanna one, Isan one, and the Chinese-Thai strand one, with the Muslim-Thai strand carried by `th_muslim` and the Peranakan strand by `th_baba`. Isan and Lanna are the thinnest and the lead should know it; section 2.1 names the two rooms that would fix it.
15. **The dishes that are younger than the band and are still named** — pad thai, green curry, som tam's Bangkok career, the modern boat-noodle broth — appear **only in repertoire lines and story text, with their dates**, never in a painting. That is the Spain gilda answer and it is applied four times here rather than once.

---

## 4. Story facts and sources

Three to five dated facts per room object, written as records, with local names and two `NEXT` links each. Legends are labelled.

### 4.1 `floatingMarket` (ตลาดน้ำ, Thai)

- A record of the city's shape: through most of the nineteenth century Bangkok was known as the Venice of the East, built on a canal network of hundreds of kilometres, and by one estimate a third of the city's residents in the mid nineteenth century lived in stilted or floating houses on the water. The market was held from boats because the street was water.
- A record of 1866–1868: Khlong Damnoen Saduak was dug by hand, on the order of King Mongkut, to link the Tha Chin and the Mae Klong rivers — about 32 to 35 kilometres — and a boat-based trading community grew along it. The market there was a local affair, known as Lat Phli, for a century before the Tourism Authority of Thailand began promoting it internationally in 1971.
- A record of the fruit: the Nonthaburi orchards on the Chao Phraya have grown durian for centuries; John Crawfurd's account records a flood in 1831 that destroyed most of the province's fruit trees, and Chinese immigrants growing durian commercially in the early nineteenth century rebuilt the trade.
- `NEXT`: `kuaitiaoRuea`, `suanTh`.

### 4.2 `kuaitiaoRuea` (ก๋วยเตี๋ยวเรือ, Thai)

- A record of 1898: the earliest written mention of `kuaitiao` is in the *Bangkok Times*. Chinese noodle dishes may have reached Siam in the Ayutthaya period, but 1898 is the first date with a document behind it.
- A record of the migration behind it: the Chinese population of Siam rose from about 230,000 in 1825 to about 792,000 in 1910, and at the beginning of the twentieth century Chinese people may have made up more than half the population of Bangkok. `Kuaitiao` is `kway teow`, southern Chinese, adapted.
- Reported, not a document: the bowls were kept small so that a customer at the bank could finish before the boat moved on and so that nothing spilled in the wake. Universally repeated in Thai food writing; I found no primary source.
- A later record, and not this room's: the dark, spiced, blood-thickened broth that "boat noodles" means today is mid twentieth century, and the government campaign that made noodles a national food ran under Plaek Phibunsongkhram from 1942.
- `NEXT`: `floatingMarket`, `shophouseTh`.

### 4.3 `wangKitchenTh` (ครัวในวัง, Thai)

- A record of 1888 to 1908: Than Phu Ying Plian Phasakorawong published *Mae Khrua Hua Pa* (แม่ครัวหัวป่าก์), serialised in journal form from 1888 and issued as a book in 1908. It is the first Siamese cookbook, it was inspired by Isabella Beeton's *Book of Household Management*, and it carries the first recorded recipes for a number of dishes, massaman among them.
- A record of 1888: the first written `tom yum` recipe dates from that year and is for snakehead fish, `tom yum pla chon` — a river fish, not a prawn, and a reminder that the prawn version is the later one.
- A record of 1800: the poem *Kap He Chom Khrueang Khao Wan*, written by Prince Itsarasunthon, later Rama II, opens by praising massaman for its cumin and strong spices. It is the earliest good contemporary source on court cooking and it names dishes still made.
- A note on what the room is not: a noble household kitchen of this period is a working kitchen with a charcoal stove and a stone mortar in it, not a banquet. The refinement is in the knife work and in the number of small dishes, not in the equipment.
- `NEXT`: `curryPaste`, `sweetsTh`.

### 4.4 `curryPaste` (ครกหิน, Thai)

- A record of 1800: massaman appears in the first stanza of *Kap He Chom Khrueang Khao Wan*; by the turn of the nineteenth century it was well known in the royal household. The name points at Muslim traders and the whole-spice character — cardamom, cinnamon, cloves — that separates it from the native pastes.
- A record of the chilli's arrival: chillies reached Siam with Portuguese traders in the sixteenth century. Everything else in the mortar — galangal, lemongrass, kaffir lime, coriander root, `krachai` — is native to the region.
- A record of 1926: the first documentation of green curry, `kaeng khiao wan`, is in a book by an author writing as L Phaehtraarat. Thai food historians note that the cookbooks of the early 1890s list other curries and not this one, so it most likely emerged between them. `Wan`, sweet, refers to the colour, not the taste.
- A note on method, not a date: coconut cream is fried until the oil splits before the paste is added, and the paste is pounded in a granite mortar for about a quarter of an hour. Both are in every serious account of the dish and neither needs a date.
- `NEXT`: `chilliesSea`, `coconutSea`.

### 4.5 `sweetsTh` (ขนมไทย, Thai)

- A record of the seventeenth century: Maria Guyomar de Pinha (1664–1728), known in Thai as Thao Thong Kip Ma, of mixed Japanese, Portuguese and Bengali descent, oversaw King Narai's palace kitchens at Ayutthaya for more than twenty-five years and is credited with introducing the Portuguese egg-and-sugar sweets that became Siamese: `foi thong` from `fios de ovos`, `thong yip` from `trouxas das caldas`, `thong yot` from `ovos moles de Aveiro`, and `luk chup` from marzipan.
- A record of 1767 onward: after the fall of Ayutthaya the Portuguese community was granted land at Kudi Chin on the Thonburi bank by King Taksin, alongside Chinese, Vietnamese and Thai Muslim neighbours; the Santa Cruz church there dates in its first form from about 1770. Nearly two thousand Thai-Portuguese descendants still live in the quarter.
- A record of the cake: `khanom farang kudi chin` is a small baked cake of wheat flour, duck egg and sugar, topped with raisin and candied winter melon, a Portuguese recipe kept in the quarter's households.
- Reported, not verified: that the egg whites left over from the yolk sweets went into lime mortar for building. Widely repeated; see section 5.
- `NEXT`: `floatingMarket`, `wangKitchenTh`.

### 4.6 `shophouseTh` (ร้านตึกแถว, Thai and Teochew)

- A record of 1892 to 1900: Yaowarat Road was built by decree of King Chulalongkorn through what had been rice fields and canals beside Sampheng, about 1.5 kilometres long and 20 metres wide, and the business of the Chinese quarter moved out of the narrow Sampheng lane onto it. The name means "young king" and honours the crown prince.
- A record of the population: Chinese numbers in Siam rose from about 230,000 in 1825 to about 792,000 in 1910; between 1882 and 1917 between 13,000 and 34,000 arrived each year from southern China. Teochew was the largest group and its speech became the quarter's common language, with Hokkien, Hainanese, Cantonese and Hakka beside it.
- A record of 1898: the first written mention of `kuaitiao` is in the *Bangkok Times* of that year. The noodle, the wok, the roast meats, the soy and the bean curd all come through this quarter.
- Reported, not a document: that Thai street food as a trade begins in these Chinese quarters in the early twentieth century and becomes general only with the urban boom of the 1970s. Widely stated in food writing; see section 5.
- `NEXT`: `kuaitiaoRuea`, `tukTuk`.

### 4.7 `naKhaoTh` (ข้าวกลางนา, Central Thai)

- A record of 1855 and after: the Bowring Treaty abolished the royal trade monopolies, fixed import duties at three per cent and permitted rice to be exported freely. Exports grew from roughly 10,000 tons a year in the 1860s to about 500,000 in the 1890s and 845,084 tons by 1904, and the Chao Phraya delta was cleared, diked and settled to grow them.
- A record of 1870: Anna Leonowens wrote that fish was "so abundant and cheap that it forms a common seasoning to the labourer's bowl of rice". Monsignor Pallegoix, in Siam from 1830 for twenty-four years, describes the same table: rice, fish, a pounded chilli relish and vegetables.
- A record of the relish: mid nineteenth-century English accounts describe `nam phrik` as the ubiquitous Siamese sauce, made with chilli and shrimp, used as a condiment and a dip. It is still the meal that everything else in this area is built around.
- `NEXT`: `naPaddyTh`, `plaTh`.

### 4.8 `isanGrillTh` (ปิ้งย่างอีสาน, Isan)

- A record of 1869: Khun Phum's travelogue *Nirat Wang Bang Yi Khan* shows a green papaya salad already known among Lao people living in Bangkok. The Thai historian Sujit Wongthes has proposed that the dish formed in the late eighteenth or early nineteenth century among Chinese-Lao settler communities in central Thailand, where Chinese immigrants grew the papaya and Lao settlers applied an older salad-pounding tradition to it. That is an argued origin, not a document.
- A record of fermentation: `pla ra` is freshwater fish — gourami, snakehead, catfish — layered with salt and rice bran or roasted rice powder and sealed for at least six months. It is a staple in Isan households, not a special ingredient, and it is inseparable from sticky rice.
- A record of what fish sauce was before the bottle: commercial `nam pla` dates only to the early twentieth century; Teochew immigrants copied Vietnamese `nước mắm` and marketed their own under the name `nam pla` in 1922. Before that, northeastern cooks used the liquid drawn off their own `pla ra` and central cooks used imported Vietnamese sauce.
- A later record, and not this room's: `som tam` became a Bangkok dish after the Second World War, with the migration of Isan people to the capital for work, and was everywhere on the city's carts by the 1960s and 1970s. The Bangkok version adds palm sugar and roasted peanuts to soften it.
- `NEXT`: `plaRaTh`, `naPaddyTh`.

### 4.9 `khaoSoiTh` (ข้าวซอย, Northern Thai)

- A record of the trade: toward the end of the nineteenth century Yunnanese Muslim traders, the Chin Haw, worked mule caravans through the country where Thailand, Burma and Laos meet, and many settled around Chiang Mai and Chiang Rai. Khao soi arrived with them, through Burma, and picked up coconut milk and heavier spicing on the way; the Burmese `ohn no khauk swè`, coconut-milk noodles, is its nearest relative.
- A record of the name: descendants of the traders describe the original noodles being made by rolling a dough into sheets and slicing them, which is what `khao soi` means — `khao`, rice or grain; `soi`, to slice.
- A record of December 1899: Monthon Phayap was established and Lanna's own institutions abolished, with the arrangement formalised in 1900. Until then Chiang Mai had been a tributary kingdom with its own ruler, language and script, which is why its food, its houses and its trays are not the central plain's.
- A note on the northern table: Lanna cooking uses little sugar and little coconut milk outside khao soi, leans on wild and gathered vegetables, and serves small dishes on a lacquered `khantoke` tray set on the floor.
- `NEXT`: `chinHawTh`, `miangTh`.

### 4.10 `talayTh` (ครัวชาวเล, Southern Thai)

- A record of the geology: the Andaman coast is drowned limestone — ancient reef lifted and then dissolved by rain into towers, arches and caves — the same formation as Ha Long Bay, with the fishing grounds at its feet.
- A record of the people: three related sea-nomad groups live along this coast, the Moken of the Mergui archipelago, the Moklen of Phang Nga and the Urak Lawoi from Phuket south to Satun. They have been in the Andaman since at least the eighteenth century and traditionally lived most of the year on hand-built `kabang` boats, each hollowed from a single old-growth log and taking about four months to build.
- A record of the flavour: southern Thai cooking is defined by turmeric, which is in nearly every southern curry and stains it yellow-orange, and by heat; `kaeng som`, the sour curry, takes its sourness from tamarind and carries no coconut milk.
- `NEXT`: `karsts`, `longtail`.

### 4.11 `muslimKitchenTh` (ครัวมลายู, Patani Malay and Thai)

- A record of the sauce: `budu` is anchovies fermented with salt for months, made and eaten among the Malays of Yala, Narathiwat and Pattani and in the neighbouring Malaysian states. It is the deep south's own fish sauce and it is not `nam pla`.
- A record of the curry: `kaeng tai pla`, made from fermented fish innards with turmeric and dried fish, is mentioned in Thai records from the reign of Rama II, more than two hundred years ago, and its ingredients came across the Indian Ocean from South India.
- A record of the kitchen: a halal cooking tradition runs continuously in the Malay-speaking provinces of the deep south — no pork, ritual slaughter, and `roti`, `nasi kerabu`, `khao mok` and biryani-type rice dishes at its centre.
- `NEXT`: `khamminTh`, `curryPaste`.

### 4.12 `babaTh` (ครัวบาบ๋า, Hokkien and Thai)

- A record of the boom: Phuket's tin-mining heyday in the nineteenth century brought Hokkien Chinese and Peranakan families from across the Malay peninsula to work the mines, the rubber and the trade, and built Old Phuket Town. More than two hundred Sino-Portuguese shophouses and mansions from the late nineteenth and early twentieth centuries still stand on seven conservation streets.
- A record of the community: intermarriage between Hokkien settlers and local families produced the Phuket Baba, or Baba-Yaya, culture — its own dress, jewellery, festivals, houses and food, part Chinese, part Thai, part European.
- A note on the architecture: "Sino-Portuguese" is the local name for a Chinese-Baroque shophouse type with a European plan, an arcaded five-foot way, shuttered arched windows and Chinese decorative work; the shop is on the ground floor and the family lives above.
- `NEXT`: `karsts`, `shophouseTh`.

### 4.13 Ingredient stops and landmarks, in brief

- **`naPaddyTh`**: rice exports rose from roughly 10,000 tons a year in the 1860s to 845,084 tons in 1904 after the Bowring Treaty of 1855, and the delta was cleared and diked to grow them. The buffalo has ploughed the wet fields of this region for thousands of years.
- **`plaTh`**: freshwater fish — snakehead, catfish, gourami — out of canals and flooded fields; the first written `tom yum` recipe, of 1888, is for snakehead. Leonowens, 1870, on fish as a seasoning for rice.
- **`tanTh`**: Phetchaburi's toddy palms have produced palm sugar since long before the band, and palm sugar was second only to rice as a commercial activity there. A worker climbs 30 to 40 metres, cuts the flower stalk and hangs a bamboo cylinder under it; the sap is filtered and simmered in a hot flat pan. A palm begins producing at about fifteen years and can yield for two centuries. Phetchaburi's nickname, the City of Three Flavours, is palm sugar, sea salt and lime.
- **`kluaTh`**: about 98 per cent of Thailand's sea salt comes from Phetchaburi, Samut Sakhon and Samut Songkhram. Sea water is let into flat pans and left to evaporate in the dry season from January to April. Phetchaburi's sea salt has a documented history reaching back into the reign of Rama IV; Samut Sakhon's great conversion of paddy into salt fields came later, in 1938, which is outside this band and is a card fact, not a painted one.
- **`plaRaTh`**: fermented at least six months with salt and rice bran; a staple, not a seasoning of last resort; the liquid off it was the northeast's fish sauce before there was a bottle. Excavated earthenware from Isan with fermented-fish residue has been dated to several thousand years ago; Simon de La Loubère's *Du Royaume de Siam*, written after his 1687–88 embassy, describes the practice.
- **`miangTh`**: `miang` is Assam-variety tea grown in the northern mountains, steamed and fermented in bamboo baskets for weeks or months, and chewed rather than drunk. It has been part of Lanna household and ceremonial life for centuries and is served at celebrations and funerals.
- **`suanTh`**: the Nonthaburi riverside orchards, on ridged beds between water channels, have grown durian for centuries and were the centre of its cultivation; mangosteen, rambutan and mango grow beside it. The 1831 flood destroyed most of the province's fruit trees and the orchards were rebuilt commercially by Chinese growers.
- **`khamminTh`**: turmeric is the defining southern seasoning and appears in nearly every southern curry; the south also uses more chilli and more coconut than the rest of the country.
- **`wat`**: the `chedi` enshrines relics; the `chofa` finials on the gable peaks are bird guardians read as the garuda; the `naga` serpent runs down the eave edges as `hang hong`. Temple fairs, `ngan wat`, are held on temple ground at festivals and are where much of the city's cooked food was sold; the Golden Mount fair at Wat Saket is the oldest in Bangkok.
- **`almsRound`**: `tak bat`, the dawn alms round, is how Buddhist monks have been fed for about 2,500 years; the monks walk barefoot in line, lay people kneel and put rice, fruit and packets of curry in the bowl, and the monks eat before noon and not after.
- **`karsts`**: lifted reef dissolved into towers, arches and caves; jungle on the tops, fishing villages at their feet.
- **`longtail`** (recast): the long-tail boat was created in the 1930s by Sanong Thitibura in Sing Buri, who mounted an engine on a rowing boat and extended the shaft. It is out of the band. What is in the band is the sea people's `kabang` and the sailing and rowed wooden boats of the coast.
- **`tukTuk`** (recast): the tuk-tuk came to Bangkok from Japan in the 1960s. The pulled rickshaw, invented in Japan in the 1860s, spread through Asia and reached Siam from the 1880s to the turn of the century, and is what was on the new streets in this band.
- **`chinHawTh`**: Yunnanese Muslim caravan traders working the Golden Triangle roads at the end of the nineteenth century, who settled around Chiang Mai and Chiang Rai and brought khao soi.

### 4.14 Sources, grouped by object

**The area, the period and the clothing**

- https://en.wikipedia.org/wiki/Traditional_Thai_clothing
- https://en.wikipedia.org/wiki/Raj_pattern
- https://en.wikipedia.org/wiki/Traditional_Thai_house
- https://thailandfoundation.or.th/ruean-thai-understanding-traditional-thai-houses/
- https://en.wikipedia.org/wiki/Kalae_house
- https://thailandfoundation.or.th/understanding-thai-buddhist-architecture/
- https://factsanddetails.com/southeast-asia/Thailand/sub5_8c/entry-3231.html

**`floatingMarket`, the khlongs and the city on water**

- https://en.wikipedia.org/wiki/Khlong_Damnoen_Saduak
- https://www.sciencedirect.com/science/article/pii/S2452315117300371
- https://siamrat.blog/2021/01/31/the-history-of-bangkoks-canals-how-venice-of-the-east-turned-into-worlds-worst-traffic/
- https://factsanddetails.com/southeast-asia/Thailand/sub5_8j/entry-3515.html

**`kuaitiaoRuea` and `shophouseTh`, noodles, the Chinese quarter and Yaowarat**

- https://en.wikipedia.org/wiki/Boat_noodles
- https://en.wikipedia.org/wiki/Kuai_tiao
- https://en.wikipedia.org/wiki/Yaowarat_Road
- https://www.tour-bangkok-legacies.com/yaowarat-heritage-centre.html
- https://en.wikipedia.org/wiki/Thai_Chinese
- https://minorityrights.org/communities/chinese-6/
- https://www.scmp.com/lifestyle/chinese-culture/article/3306391/history-bangkoks-chinatown-teochew-enclave-red-light-district-and-business-hub

**`wangKitchenTh`, the first cookbook and the written record**

- https://en.wikipedia.org/wiki/Mae_Khrua_Hua_Pa
- https://en.wikipedia.org/wiki/Plian_Phasakorawong
- https://thailandfoundation.or.th/women-in-thai-cuisine-part-2-the-era-of-change/
- https://thaifoodmaster.com/what-is-thai-cuisine
- https://en.wikipedia.org/wiki/Kap_He_Chom_Khrueang_Khao_Wan
- https://en.wikipedia.org/wiki/Tom_yum
- https://www.thaienquirer.com/25780/tom-yum-goong-thainess-and-the-culinary-history-of-a-national-staple/

**`curryPaste`, massaman, green curry and the chilli**

- https://www.whetstonemagazine.com/journal/chasing-massaman
- https://guide.michelin.com/th/en/article/features/iconic-dishes-what-is-massaman-curry-thailand
- https://en.wikipedia.org/wiki/Green_curry
- https://thailandfoundation.or.th/kaeng-khiao-wan-thailands-iconic-green-curry/
- https://www.nationalgeographic.com/travel/article/thai-green-curry-revealing-spicy-secrets-culinary-classic

**`sweetsTh`, the Portuguese inheritance and Kudi Chin**

- https://en.wikipedia.org/wiki/Maria_Guyomar_de_Pinha
- https://www.atlasobscura.com/articles/the-queen-of-thai-desserts
- https://en.wikipedia.org/wiki/Thong_yip
- https://en.wikipedia.org/wiki/Thong_yot
- https://en.wikipedia.org/wiki/Kudi_Chin
- https://en.wikipedia.org/wiki/Khanom_farang_kudi_chin
- https://www.worldhistory.org/article/1627/bangkoks-portuguese-past/

**`naKhaoTh`, `naPaddyTh`, `plaTh`, rice and the everyday table**

- https://en.wikipedia.org/wiki/Bowring_Treaty
- https://thesiamsociety.org/wp-content/uploads/1971/03/JSS_059_2f_Owen_RiceIndustryOfMainlandSoutheastAsia.pdf
- https://blogs.lse.ac.uk/seac/2023/11/02/the-bowring-treaty-of-1855-and-the-transformation-of-siamese-thai-foreign-policies-towards-britain/
- https://brill.com/view/journals/mnya/23/2/article-p205_205.xml?language=en
- https://en.wikipedia.org/wiki/Nam_phrik

**`isanGrillTh` and `plaRaTh`, Isan**

- https://en.wikipedia.org/wiki/Green_papaya_salad
- https://en.wikipedia.org/wiki/Pla_ra
- https://thailandfoundation.or.th/pla-ra-thai-fermented-fish/
- https://en.wikipedia.org/wiki/Nam_pla
- https://www.nationalgeographic.com/travel/article/northeast-thailand-food-isaan-dishes

**`khaoSoiTh`, `chinHawTh` and `miangTh`, Lanna**

- https://en.wikipedia.org/wiki/Khao_soi
- https://lastappetite.com/khao-soi/
- https://en.wikipedia.org/wiki/Kingdom_of_Chiang_Mai
- https://en.wikipedia.org/wiki/Nakhon_Chiang_Mai_(1775%E2%80%931899)
- https://en.wikipedia.org/wiki/Monthon
- https://www.sciencedirect.com/science/article/pii/S235261811730080X
- https://www.fondazioneslowfood.com/en/ark-of-taste-slow-food/miang/

**`talayTh`, `muslimKitchenTh`, `khamminTh`, `karsts`, `longtail`, the south**

- https://en.wikipedia.org/wiki/Kaeng_tai_pla
- https://en.wikipedia.org/wiki/Budu_(sauce)
- https://www.hrw.org/report/2015/06/25/stateless-sea/moken-burma-and-thailand
- https://www.survivalinternational.org/galleries/moken-sea-gypsies
- https://en.wikipedia.org/wiki/Long-tail_boat

**`babaTh`, Phuket**

- https://en.wikipedia.org/wiki/Phuket_Old_Town
- https://www.phuket101.net/peranakan-culture-in-phuket-town/
- https://www.tandfonline.com/doi/full/10.1080/23311983.2025.2582886

**`tanTh` and `kluaTh`, sugar and salt**

- https://www.nationthailand.com/life/art-culture/40063209
- https://publications.asia.si.edu/publications/seaceramics/essays/the-palm-sugar-pots-of-phetchaburi.pdf
- https://so08.tci-thaijo.org/index.php/artssu/article/view/109
- https://www.mdpi.com/2071-1050/15/15/11947
- https://www.bangkokpost.com/life/travel/2754581/salt-sea-and-spoonbills

**`suanTh`, the orchards**

- https://www.yearofthedurian.com/2016/05/history-durian-thailand.html
- http://nonthaburi.go.th/en/?page_id=216

**`wat` and `almsRound`**

- https://thairanked.com/en/blogs/ultimate-guide-to-thai-temple-fairs-ngan-wat/
- https://touristbangkok.com/thailand-travel-blog/golden-mountain-temple-fair/

**`tukTuk` (recast) and pad thai**

- https://en.wikipedia.org/wiki/Pulled_rickshaw
- https://www.atlasobscura.com/articles/who-invented-pad-thai
- https://www.smithsonianmag.com/travel/the-surprising-history-of-pad-thai-180984625/

---

## 5. Open questions for the lead

1. **One area or two.** My recommendation is one: merge `andaman` into `bangkok`, rename the display to Thailand, six clusters. The full argument, the code that depends on each id and the cost of the alternative are in [thailand-world.md](thailand-world.md). This is the first decision and the object list's positions depend on it; its ids, kinds, clusters and purposes do not.
2. **The period band.** About 1880 to 1910, the later reign of Chulalongkorn. This is an owner decision, not a lead decision, because it removes pad thai, green curry, the longtail boat and the tuk-tuk from every painting. If the owner prefers a contemporary Thailand, the brief is rewritten before any picture is generated and most of section 4 becomes background rather than subject.
3. **The two recasts.** `longtail` onto the sea people's boats and `tukTuk` onto the rickshaw. Both keep their ids and gain a real prop and a 3D reaction, which they do not have today. The owner should be told, because "tuk-tuks" is in the area's current blurb and is one of the four things it advertises.
4. **`floatingMarket` with both `open: "reveal"` and `scene`.** No object in the code has both. Either the engine already handles it, or the market's room needs a second object, or the reveal behaviour is dropped. I could not resolve this from the data files alone and it is a Stage B question.
5. **`stall-noodles`'s blurb** describes the modern dark boat-noodle broth and names pad thai as the national dish. It is the most out-of-band paragraph in the area and it sits on a child card that the visitor reaches from the hero room. It needs rewriting whichever way question 1 goes.
6. **Isan and Lanna have one room each.** Section 2.1 names the two rooms that would bring the set to fourteen and the clusters to 3/3/1/2/2/3. The budget in the image brief is for twelve; adding two rooms adds six images.
7. **The temple-fair kitchen.** The owner's brief offered "a palace or temple-fair kitchen" and I chose the palace, because the written record is there. The temple fair is the alternative and it is a good one: it is where much of the city's cooked food was sold, and it would be the area's only night scene. The lead may swap TH03 for it.
8. **Thai script in `zh` fields and in the repertoire.** Every Thai name in the object list and in `thailand-repertoire.ts` is written in Thai script. I am confident in the common dish names and the place names; I am less confident in the Isan, Northern Thai and Patani Malay speech lines in section 2.5, which use central Thai orthography for regional speech because that is how it is ordinarily written. A Thai reader should check section 2.5 before those lines ship.
9. **Clothing inventory numbers.** As with Britain, the research has named collections and no inventory numbers. Before generation the picture reviewer should pull one catalogued garment or photograph per profile from the collections in section 1.5. Profiles 1, 5, 6 and 7 matter most, because they are the ones an image tool will get wrong.
10. **Unverified, and kept out of cards until checked.** (a) That noodle-boat bowls were small so nothing spilled in the wake — universally repeated, no primary source. (b) That the egg whites left over from the yolk sweets went into building mortar. (c) That Thai street food as a trade begins in the Chinese quarters in the early twentieth century and generalises in the 1970s — plausible and widely written, no scholarly source read. (d) The estimate that a third of mid nineteenth-century Bangkok lived on the water: it is given as an estimate in the source and should be written as one. (e) The 1869 *Nirat Wang Bang Yi Khan* reference for the papaya salad and Sujit Wongthes's proposed origin: I read both at second hand and neither should go in as a flat statement. (f) The figure of "13,000 to 34,000" Chinese arrivals a year between 1882 and 1917: reported in one secondary source, worth a second before it is printed.
11. **The three circling tuk-tuks in `layoutSeasia`** are decor, not objects, and they carry the same period problem as the `tukTuk` object. Whoever recasts the object should be told to recast the decor in the same pass.
12. **`scripts/audit/objects.mjs` ignores `southeast-asia`.** Line 6 filters to `['china','middle-east','mediterranean']`, so this area cannot have baseline numbers in the ordinary way. It is a one-line change in a file nobody in Stage A owns; teach it the world before Stage B.
