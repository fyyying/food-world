# Thailand: the image brief

This is the Stage A deliverable for the `bangkok` area of the Southeast Asia world, grown from two card-only areas — Bangkok and the Andaman coast — into one Thailand. It was written from the [art direction](art-direction.md), the [Thailand research](thailand-research.md) and the lead's decisions in [thailand-world.md](thailand-world.md). It follows the structure of the [Britain brief](london-image-brief.md), which is the current standard.

## How to use this brief

1. Drop every delivered file into `~/Downloads/additional game asset/thailand/` with the exact file names below. The import script reads that folder.
2. Attach the reference set to every generation request. The files are in the repository: `public/scenes/hotpot/wide.jpg` (light, density, food), `public/scenes/tr_simit/wide.jpg` (clothing and street life), `public/scenes/tr_simit/portrait.jpg` (portrait composition), `public/scenes/props/red-lantern.webp` and `public/scenes/props/chilli-hanging.webp` (sprites). Spain's delivered rooms in `public/scenes/es_*/` are also in the repository and are the closest match for interior light and food scale. The hotpot painting is the closest match for a hot, crowded, charcoal-lit Asian kitchen; ignore its present-day clothes.
3. Generate in two sessions. Session 1 is the concept image only. Look at it against section 1.6 of the research and the acceptance check; regenerate until it passes. Session 2 attaches the approved concept as well and generates the rooms, the sprites and the cards in the order in Part F.
4. Copy everything below the divider into the image tool. The playbook names Gemini through the `ce-gemini-imagegen` skill or GPT-Image-2.5 in ChatGPT with the reference images attached; both accept reference images.
5. Deliver a text inventory with the files: file name, actual pixel size, and the motion and discovery notes asked for in Part G.

Budget: **43 images.** One concept, twelve wide rooms, twelve portrait rooms, six motion sprites, twelve card illustrations. Britain was 46; Spain was 42.

| Part | Files | Count |
| --- | --- | --- |
| A | `th00_concept.png` | 1 |
| B | `th01_khlong_wide.png` to `th12_baba_portrait.png` | 24 |
| C | `th_motion_*.png` | 6 |
| D | `th_card_*.png` | 12 |

### The six rules that came out of China and Spain

These are written into every room prompt below and they are the six things that were most expensive to fix afterwards. They are repeated here so the reviewer can check them in one place.

- **(a) Anything meant to move hangs from an empty hook.** Any hanging object that the application will swing — a lantern, a string of garlic or shallots, a line of drying squid, a coil of sausage, a woven fish mobile, a bunch of herbs — is delivered as its **own keyed sprite on pure white** and the room painting shows only its **hook, bracket, nail, rail, line or beam, with nothing hanging from it**. Cutting a moving object out of a finished painting is forbidden: Spain's pepper strings were colour-keyed off warm walls, took the wall with them, and swung with a visible cut edge and a repaired hole behind them. Where a painting also carries a *still* hanging object that is never going to move, that is fine and welcome; it must simply be somewhere other than the empty hook.
- **(b) Open surfaces and visible streams.** Every hot vessel that should steam is pictured with an **open surface**: a lidless pot, a wok, a bowl with nothing over it, a steamer with the lid lifted and resting beside it, a tiffin tier out of its stack, an open stove mouth. Nothing hot is shown sealed or under glass. Every poured liquid shows **a clear lip, a clear landing surface, and a visible unbroken stream between them**: the spout, rim or ladle it leaves, the free thread in the air, and the exact surface it lands on. The application traces its glint from the lip to the landing, and Spain's cider glint ran on the glass of the bottle above the lip because the painting did not make the lip clear.
- **(c) Portrait compositions keep everything that matters inside the middle 80 per cent of the width.** A phone shows only about **x .094 to .906** of the frame after the fit. Every discovery subject, every signature action, every empty hook and every face that carries the room must sit inside that band in the portrait file. Outside it, put wall, sky, water, floor, steam and background only.
- **(d) Plain walls behind hanging things.** The wall, sky, water or plank directly behind every empty hook and behind every still hanging object is **plain, evenly lit and clearly different in tone from what will hang there** — no pattern, no tile grid, no carved screen, no other object, no face, no strong sunlight and no deep shadow across it. Warm ochre, teak brown and gold behind warm objects are specifically to be avoided, and so is a red-lacquer or gilded surface behind a red lantern. No colour key will be needed now and none should ever be needed again.
- **(e) No text, nothing modern, hands and food correct.** No lettering of any kind anywhere: no shop signs with words in any script, no Chinese characters on a board, no price tickets, no labels on jars, no printed paper, no captions, no watermarks. Every person is in the working clothes of the "period and people" section below, Siam between about 1880 and 1910. No plastic, no stainless steel, no electric light, no gas ring, no motor of any kind, no printed packaging, no modern crockery, no wristwatches, no rubber sandals, no zips. Faces and hands are anatomically correct with the right number of fingers; food is the right way up, the right scale against the hands that hold it, and the right dish for its room.
- **(f) Two natural motion cues besides the signature.** Each painting carries **one clean open sky, one clean fire, stove mouth or lamp, or one open door, airwell or open side with light coming through it** — an area with nothing crossing it — so the application has at least two natural cues besides the room's signature action. A sky with a bird already painted in it is not a substitute; leave the sky empty.

---

## Task and reference authority

Create a production-quality illustrated asset set for the Thailand area of Food World, an explorable world where food reveals how people live. This Thailand is one imagined country that compresses six regions into six neighbourhoods. Every picture shows one clear regional setting. Do not stack every landmark, region or dish into one view.

Use the attached reference paintings as the authority for brushwork, texture, light, character rendering and level of detail. The style is painterly illustrated realism between a photograph and a cartoon: visible brushwork on teak, thatch, stucco, water, cloth and clay; one light-source logic per picture; real body, hand, furniture and building proportions with faces that may be softened and eyes slightly enlarged as in the references; rich, saturated but natural colour; depth in three planes with food in the foreground, people and work in the middle and the place behind; complete scenes where every seat, boat, shelf, table and hook holds what rests on it — except the one empty hook each room is asked for in rule (a).

Rejected in every picture: photorealism or photo compositing; a rendered 3D look with plastic highlights; flat vector shapes, thick outlines, cel shading, chibi proportions or mascot faces; blurred or smeared regions; any text, readable signs, characters, captions, filenames, watermarks, borders or checkerboards; contact sheets, collages, split panels or before-and-after frames; interface elements of any kind, meaning no arrows, rings, diamonds, markers or labels. The application adds its own markers afterwards over the actual subjects.

The Turkey reference paintings show the clothing standard. The hotpot reference shows light, density and food; ignore its present-day clothes.

**This is Siam on the water, and it is hot.** The light is strong, high and humid, with hard sun and deep warm shade, haze on every distance and green reflected up from water into every face. Six of the twelve rooms have open water, wet ground or a boat in them. That contrast — glare outside, warm charcoal-lit shade under a roof — is the area's whole look and it should be in every picture. Two rooms are interiors lit by charcoal and oil lamp against a lit street or airwell; the rest are open-sided and lit by the sky.

## The period and the people

Every person in every picture wears the everyday working clothes of Siam between about **1880 and 1910**, the later reign of King Chulalongkorn. This is one recorded period band for the whole area. Working clothes, not costume: no classical dance costume, no gold-spired `chada` headdress, no sequins, no monk except at the alms round, no tourist, and nothing modern at all.

Dress people from these eight profiles. Colours name the palette in the next section.

| Profile | Garments | Who wears it | Where |
| --- | --- | --- | --- |
| Bangkok market woman | A long cotton cloth worn as `pha nung` or wrapped, drawn between the legs and tucked behind as `chong kraben`, in plain or checked indigo; a `pha sabai` cloth or plain blouse across the chest; hair cropped short in the period crop; bare feet; on a boat, a wide flat woven `ngob` sun hat | Boat vendors, fruit sellers, market women | The khlongs, the floating market |
| Siamese working man | `Chong kraben` in plain cotton knotted at the waist, bare chest or a plain collarless cotton jacket, a checked `pha khao ma` cloth over one shoulder or round the head, bare feet | Paddler, porter, fisherman, field hand, rickshaw puller | Everywhere outdoors |
| Household woman of a compound | A finer `chong kraben` in figured silk with a `pha sabai` over one shoulder, gold at the wrist, hair cropped and oiled, a betel set beside her | The women of the palace and noble kitchens | The old city |
| Teochew shophouse man | Loose dark cotton trousers and a frogged jacket or a plain singlet, a cloth apron, wooden clogs; older men still with a queue, younger men cropped | Cook, noodle man, roast-meat seller, porter | Sampheng and Yaowarat |
| Isan farming household | Indigo hand-woven cotton: a wrapped `sinh` tube skirt with a woven hem band for the woman, a sarong or short `chong kraben` for the man, a `pha khao ma`, a checked cloth over the head against the sun, bare feet | Grower, grill cook, weaver | Isan |
| Lanna woman and Chin Haw muleteer | The Lanna woman in a horizontally striped `sinh` with a separate woven hem, a long-sleeved blouse, a shawl, hair in a bun with fresh flowers; the muleteer in a dark Yunnanese jacket and trousers with a white skull cap | Market women, khao soi cooks, Yunnanese Muslim caravan men | Chiang Mai and the northern roads |
| Malay-Muslim southern household | A `kain` sarong in batik or `pelangi` pattern, a long-sleeved baju and a `selendang` scarf over the hair for the woman, a `songkok` cap with sarong over trousers for the man | Roti and budu cooks, fishers | Pattani, Yala, Narathiwat |
| Phuket Baba household | The Nyonya woman in a fitted embroidered blouse or `baju panjang` over a batik sarong with brooch chains and a coiled bun; the Baba man in a Chinese jacket, European trousers, a watch chain and leather shoes | Tin-town merchant families | Phuket Old Town |

Women appear in every room as cooks, sellers, buyers and diners; several rooms are entirely women's work. Children appear in the outdoor rooms, carrying, fetching and paddling. Vary age, height, build, skin, hair, face, occupation and gesture in every picture. Children take small steps; elders lean a little. People cook, carry, choose, serve, pour, share and talk. Nobody poses for the viewer. Show four to eight readable people in a room, with smaller background figures only where they help.

**Three things to avoid that an image tool will supply unasked.** The conical Vietnamese `nón lá` — it belongs to the Hanoi and Mekong areas of this same world, and the Siamese hat is the wider, flatter, woven `ngob`. The classical dancer's costume and any temple-mural gods painted on a kitchen wall. The silver-and-embroidery hill-tribe costume of the Akha, Hmong and Karen, which is real and is not Chiang Mai town dress.

## Palette

| Name | Hex | Use |
| --- | --- | --- |
| khlongBrown | #6E5C3C | The canal and the river: brown, opaque, warm, never blue |
| andamanGreen | #2F7D72 | The Andaman sea between the karsts, and the shallow water in a rice field |
| teakDark | #5A3B22 | Teak posts, house walls, boat hulls, landing stages, barge boards |
| bambooPale | #C9B489 | Split bamboo, woven baskets, matting, thatch, the `ngob` hat |
| paddyGreen | #8FA84A | Standing rice, banana leaf, morning glory, betel and garden green |
| limestoneGrey | #A79E90 | The karsts, the granite mortar, the salt-pan bunds, the wat's plaster |
| watOrange | #C8622C | Temple roof tile, the monk's robe, terracotta, palm sugar |
| chediGold | #C79B3B | Gold leaf on the chedi and the chofa, brass pans, foi thong, turmeric |
| lacquerRed | #9C2B23 | Shophouse lacquer, paper lanterns, a shrine niche, dried chilli |
| pelangiBlue | #2E4E7E | Indigo working cloth, Malay batik, Nyonya porcelain, butterfly-pea rice |
| charcoalSmoke | #3A3733 | Charcoal, smoke-blackened kitchen roofs, iron pans, the grill |
| stuccoPastel | #E7D9C4 | Whitewashed compound walls, Sino-Portuguese render, salt, coconut flesh |

---

## Part A: the concept image

File: `th00_concept.png`. One image, wide, at the largest native size available. No exact size is required for this picture; it is a spatial blueprint, not a room.

Paint the whole imagined Thailand as one wooden-table diorama seen from a high three-quarter angle in strong high tropical light an hour after sunrise, with haze on every distance. One large river runs from the top of the table down through the centre and out into a gulf; a grid of narrower canals runs off it at the centre; a sea lies to the south and west with limestone towers standing in it. Six named neighbourhoods, open country between them, landmarks kept behind the food places and smaller than their neighbourhood. Read the table from the centre outward.

1. **The khlongs** (centre, the arrival view). A wide brown river with a grid of narrower canals off it; teak houses on posts standing in the water with ladders down to boats tied under the floor; one floating house on bundled bamboo; a basin where about thirty small wooden boats lie gunwale to gunwale as a market; one long paddled boat with a charcoal pot amidships at a landing stage; behind them a wat with tiered orange-and-green tiled roofs, gilded `chofa` finials, `naga` serpents running down the eave edges, and a white and gold `chedi`. Water is `khlongBrown`, opaque and warm.
2. **The old city and Sampheng** (just east of 1). A whitewashed walled compound with a tiled open-sided kitchen pavilion and a garden inside it; outside the wall, one straight newly cut street of two-storey brick-and-timber shophouses with an arcade at ground level, red paper lanterns under it, an open-fronted kitchen with a charcoal brazier on the step, and a man pulling a two-wheeled rickshaw; a spice stall of shallow baskets under a cloth awning.
3. **The central plain** (north and west of 1). Flat wet rice to the horizon in bunded squares with a water buffalo standing to its knees in one; a rice barn on posts; a raised village mound under coconut and mango; along the river an orchard of durian and mangosteen on ridged beds between water channels; inland a stand of very tall toddy palms with bamboo cylinders tied under their cut flower stalks and a ladder up one of them; on the coast a plate of white evaporation pans with raked cones of salt.
4. **Isan** (far north-east, higher and drier, yellower). Sandy ground, a fenced compound of small raised houses with shaded open space beneath them, a fish pond, a charcoal trough grill with flattened chickens in split-bamboo clamps over it, a row of earthenware jars under a house, and a tall clay mortar standing on the ground.
5. **Lanna** (far north, in mountains). A green basin between forested ridges; a square brick wall and moat; teak houses with crossed `kalae` barge boards above the gables and much lower, wider, deeper roofs than the central style; a low wide-roofed brick wat; a tea garden under the forest edge; and a line of loaded mules with their drivers coming down a road out of the hills.
6. **The southern peninsula and the Andaman** (south-west, across water). Limestone towers rising sheer out of green sea with jungle on their tops and undercut bases; a beach of pale sand with wooden boats drawn up and split squid drying on a line; behind it a small pastel arcaded shophouse street with a tin sluice and a spoil heap on the hill above; and at the far end of the cluster a mosque and a Malay village on posts at a mangrove edge.

Transitions: between 1 and 2 the water gives way to one new street and the houses change from teak posts to brick and stucco; between 1 and 3 the canals straighten, the houses thin out and rice takes over; between 3 and 4 the ground rises and dries, the green goes yellower and the houses get smaller; between 4 and 5 the plateau breaks into forested ridges and the roofs go low and wide; between 5 and 6 the country falls away south through forest to a two-coasted isthmus; between 6 and 1 the sea runs east into the gulf and the river's mouth.

Water: one continuous sea round the south and west, square where it meets the table edge. One large river from the north down through 3 and 1 to a wide brown mouth, with a grid of canals off it. Nothing stands in open water except the boats, the raft house, the houses built on posts to stand in it, and the buffalo, which is in the flooded field on purpose.

No interface elements, no labels, no text. Deliver a short text note naming where each of the six neighbourhoods and the five landmarks sit in the picture.

## Part B: the twelve room pairs

### Rules for every room pair

1. Two independently composed paintings per room. Wide is exactly **1672 x 941** pixels. Portrait is exactly **941 x 1672** pixels. Do not crop, stretch or upscale one to make the other. Report the delivered pixel size of every file in the inventory. A file at any other size is rejected.
2. One complete environment per image: no collages, contact sheets, split views, miniatures or panels.
3. The same place, food, palette and main characters in both orientations. Wide reveals the work surface and the place. Portrait stacks food, worker and place vertically and is recomposed, not squeezed.
4. A human-height or slightly elevated three-quarter view. The main food occupies a substantial, readable part of the foreground in both orientations, with texture that reads at phone scale: the wet shred of green papaya, the lacquer on grilled chicken skin, the split oil on a curry, the grain of steamed sticky rice, the copper of a smoked prawn, the threads of `foi thong`.
5. The three discovery subjects are visible, distinct and unobstructed in **both** orientations, with breathing room around them, never hidden behind hands, gunwales, steam or decoration. **In the portrait file all three sit inside the middle 80 per cent of the width** (rule c).
6. Four to eight readable people from the profiles above, varied in every way listed, doing the work of the room.
7. The painting is complete without sprites: its furniture, boats, utensils, food, people, buildings and plants are all in it. Every seat and work surface supports what rests on it. Every hand holds something plausibly.
8. **Each room carries one empty hook, nail, rail, line, beam or bracket** where the brief names one, with a plain, evenly lit wall, sky, water or plank behind it that is clearly different in tone from the object that will hang there (rules a and d). Nothing hangs from it. Do not put a face, a pattern, a carved screen, a shelf, a window or a shaft of sunlight behind it.
9. **Every hot vessel is open**: no lid, or the lid lifted and resting beside the pot. **Every pour shows lip, stream and landing** (rule b).
10. Each painting carries one clean open sky, one clean fire, stove mouth or lamp, or one open door, airwell or open side with light through it, with nothing crossing it (rule f).
11. Cold food and cold rooms show **no steam at all**. Fruit, raw vegetables, drying squid and a jar of fermented fish are cold and show none.
12. No text, labels, markers, arrows, rings, borders, watermarks, captions, signs or invented lettering anywhere in the art, in any script (rule e).

Vessels, tools and stock belong to the period: earthenware, glazed clay, granite, brass, copper, tinned iron, cast iron, teak and hardwood, bamboo, rattan, banana leaf, palm leaf, cloth, string, coconut shell, glazed porcelain in the Chinese and Baba rooms, enamelled iron at the very end of the band. No plastic, no stainless steel, no aluminium, no electric light, no gas, no printed packaging, no cardboard.

### TH01 The floating market

Files: `th01_khlong_wide.png`, `th01_khlong_portrait.png`
Room id `th_khlong`, folder `public/scenes/th_khlong/`, opens from the object `floatingMarket`.

- Place: a canal basin at first light, about thirty small wooden boats tied and poled gunwale to gunwale so that they read as a market floor made of boats. Teak houses on posts along both banks with ladders down to the water, one floating house on bundled bamboo, a wat's tiered orange-and-green roof and white chedi behind. Flat early light, mist lifting off brown water, green reflected up into the faces under the hat brims.
- Food: boats loaded to the gunwale with **mangosteen, rambutan, ripe and green mango, bananas on the stem, durian**; bundles of **morning glory, banana blossom, pea aubergine, galangal and lemongrass**; a **young coconut with its top struck off by a cleaver and the water running out of the cut into a cup**; a small charcoal brazier in one boat with a pan on it and short bananas grilling; banana-leaf parcels tied with split bamboo; salted duck eggs in a basket of dark mud. No plastic bag, no ice box, no motor of any kind.
- Wide: the basin's width with three loaded boats nearest, the coconut being opened in the middle boat, houses on posts and the wat behind. Portrait: the opened coconut and the fruit boat in the foreground, the seller above them, the houses and the wat roof at the top, all inside the middle 80 per cent of the width.
- Discovery subjects: the opened young coconut with the water running; the boat of mangosteen and rambutan; the cleaver and the cut husks.
- Signature motion area: the **cleaver taking the top off a young coconut and the water pouring from the cut into a cup** standing on the thwart — clear lip at the cut, a visible falling stream, a clear landing in the cup, nothing crossing it, the cup not held in a hand.
- Empty hook: **a plain bamboo cross-pole lashed across one boat's canopy frame, with nothing hanging from it**, plain open sky behind it. Fruit hanging elsewhere in the picture is fine and should be still.
- Open area for cue (f): a clean band of pale morning sky over the wat roof with nothing in it, for the egret.
- Steam: the brazier pan steams. All the fruit and vegetables are cold and show nothing.
- Water: everybody is in a boat or on a bank. Nobody stands in the canal.
- Sprites: `th_motion_egret.png`, `th_motion_pla_tapian.png`.

### TH02 The noodle boat

Files: `th02_noodleboat_wide.png`, `th02_noodleboat_portrait.png`
Room id `th_noodleboat`, folder `public/scenes/th_noodleboat/`, opens from the object `kuaitiaoRuea`.

- Place: one long low paddled wooden boat drawn up against a teak landing stage in a narrow canal, hot late morning, houses on posts close on both sides, green light bouncing off brown water onto the underside of the awnings. Three or four customers sit and squat on the stage with bowls; the cook stands amidships.
- Food: a **charcoal pot amidships with the broth surface visibly moving** — pork bones, star anise, cinnamon, pepper, soy; trays of **flat and thin rice noodles**; a basket of **morning glory and bean sprouts**; sliced pork, liver and pork meatballs on a board; a **wire strainer basket and a long ladle**; small chinaware bowls, a stack of used ones on the stage; a rack of four seasonings in open bowls — dried chilli, sugar, chilli vinegar, fish sauce in an earthenware pot. No plastic bowl, no gas, no printed sign.
- Wide: the boat's length with the pot nearest, the cook above it, the landing stage and the eaters at one end, the canal and the houses behind. Portrait: the bowl being handed up and the pot in the foreground, the cook above them, the awnings and the canal at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the bowl being handed up over the gunwale; the strainer basket lifting noodles clear of the pot; the stack of used bowls on the stage.
- Signature motion area: the **ladle lifted out of the pot and tipped so broth falls into a bowl** — a clear lip at the ladle, a visible unbroken fall, a clear landing on the noodles in the bowl, the bowl resting on a board and not held in a hand, and nothing crossing the stream.
- Empty hook: **a plain iron hook on the awning's timber ridge pole over the middle of the boat**, nothing on it, plain pale canvas behind it.
- Open area for cue (f): the open charcoal fire under the pot, unobstructed.
- Steam: the pot and the filled bowl steam. The raw noodles and the greens do not.
- Water: the cook is in the boat; the eaters are on the stage. Nobody is in the water.
- Sprite: none.

### TH03 The household kitchen

Files: `th03_wang_wide.png`, `th03_wang_portrait.png`
Room id `th_wang`, folder `public/scenes/th_wang/`, opens from the object `wangKitchenTh`.

- Place: an open-sided kitchen pavilion inside a whitewashed noble compound, mid-morning. A teak floor raised a step above the ground, a tiled roof on carved posts, a plain whitewashed wall and a garden of frangipani and banana beyond. Cool shade under the roof, hard sun outside. Four women working at floor level and on low tables, one older woman directing, a girl fanning a charcoal stove.
- Food: a **brass tray of `nam phrik`** — a small bowl of pounded chilli, garlic, shallot and shrimp paste — surrounded by blanched morning glory, cucumber, long bean, fried fish and shredded omelette; an **open clay pot of massaman** with cardamom pods, cinnamon bark, cloves and peanuts visible on the surface; a bowl of **`khao chae`**, rice in clear scented water with small stuffed shallots and shrimp-paste balls on a separate dish; a board with a **pomelo half carved into petals and a chilli opened into a flower**, with a small curved knife in two hands; a granite mortar; a brass pan; a betel set; a **bound palm-leaf or paper manuscript and an inkpot on a low table**.
- Wide: the low working tables in a line with the carving nearest, the massaman pot and the tray beyond, the open side and the garden at the far end. Portrait: the carved pomelo and the chilli flower in the foreground, the hands and the face above them, the pavilion roof beams and the garden light at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the carved fruit and the small knife; the tray of nam phrik with its vegetables; the manuscript and inkpot on the table.
- Signature motion area: the **small curved knife turning a chilli into a flower**, close and tight, with the whole chilli and both hands visible and correct — five fingers, right scale against the chilli, the blade in contact with the flesh.
- Empty hook: **a plain iron nail in one of the carved roof posts at head height**, nothing on it, plain whitewashed plaster behind it.
- Open area for cue (f): the open side of the pavilion with daylight falling in a clean band across the teak floor, nothing crossing it.
- Steam: the massaman pot is open and steams. The `khao chae` is iced and shows nothing; the carved fruit shows nothing.
- Sprite: `th_motion_pla_tapian.png`.

### TH04 The curry mortar

Files: `th04_curry_wide.png`, `th04_curry_portrait.png`
Room id `th_curry`, folder `public/scenes/th_curry/`, opens from the object `curryPaste`.

- Place: a household kitchen in the shaded space under a raised teak house, hard earth floor, mid-afternoon. A clay charcoal stove on the ground, a bamboo rack of earthenware and a hanging shelf, house posts and the underside of the floor above, and beyond the open side a yard with banana and a water jar. Two women and a girl; a man passing with a basket.
- Food: a **heavy grey granite mortar and pestle with a paste half made in it** — dried red and fresh green chillies, sliced galangal, lemongrass, kaffir lime zest, coriander root, garlic, shallot, white peppercorns and a lump of dark `kapi` shrimp paste, some still whole beside the mortar; a **coconut grater stool with half a coconut on it** and a bowl of grated white flesh; a cloth over a bowl with thick first-pressing cream in it; a **wide iron pan on the stove with coconut cream frying and the oil visibly separating in a clear ring at the edge**; pea aubergines, whole green chillies, holy basil, a lump of palm sugar, an earthenware pot of sauce.
- Wide: the mortar nearest and low, the pan on the stove beside it, the grater stool and the rack, the open side and the yard at the far end. Portrait: the mortar with the paste in it in the foreground, the pounding hands and the face above, the pan and the house floor above that, inside the middle 80 per cent of the width.
- Discovery subjects: the mortar with the half-made paste; the pan with the coconut cream splitting; the coconut grater with the grated flesh.
- Signature motion area: the **pestle coming down into the mortar with the paste moving under it**, one hand on the rim and one on the pestle, the whole mortar and both hands visible and correct.
- Empty hook: **a plain bamboo rail slung under the floor joists above the stove, with nothing hanging from it**, the plain dark underside of the floor behind it. A single still bunch of dried herbs elsewhere in the picture is fine.
- Open area for cue (f): the open mouth of the clay stove with the charcoal glowing in it.
- Steam: the frying cream shows small breaking bubbles and light steam at its surface; the pan is open. The mortar and the raw aromatics are cold and show nothing.
- Sprite: `th_motion_garlic_string.png`.

### TH05 The sweets kitchen

Files: `th05_sweets_wide.png`, `th05_sweets_portrait.png`
Room id `th_sweets`, folder `public/scenes/th_sweets/`, opens from the object `sweetsTh`.

- Place: a small brick-and-timber kitchen in the Portuguese quarter at Kudi Chin on the Thonburi bank, afternoon. Whitewashed walls going warm with charcoal smoke, a tiled floor, a low charcoal range, an open door onto a lane with a plain church tower and a glimpse of the river beyond. Three women working and a child watching.
- Food: a **wide shallow brass pan of clear sugar syrup at a low boil** with a small perforated cone held above it **drawing unbroken golden threads of `foi thong` down onto the surface**, and a coiled skein of finished threads on a tray; **`thong yip` pinched into six-pointed cups** and **`thong yot` dropped in golden beads**, both on separate trays; a tray of **`khanom mo kaeng`** baked custard with embers on its lid; **small round `khanom farang kudi chin` cakes cooling on a wire rack**, topped with raisin and candied winter melon; a bowl of separated duck-egg yolks; grated coconut, pandan leaves and a block of palm sugar.
- Wide: the brass pan and the drawing hand nearest, the trays of finished sweets beyond, the range and the open door at the far end. Portrait: the pan with the falling threads in the foreground, the hand and face above, the rack of small cakes and the door light at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the brass pan with the threads being drawn; the rack of small round cakes; the bowl of duck-egg yolks.
- Signature motion area: the **cone drawn back and forth over the syrup with unbroken golden threads falling from it onto the syrup surface** — a clear lip at the cone, a visible fall, a clear landing on the syrup, nothing crossing the threads.
- Empty hook: **a plain wooden peg in the whitewashed wall beside the range**, nothing on it, plain lime wash behind it.
- Open area for cue (f): the open door with daylight and the lane beyond, nothing crossing it; and the embers on the baking tray lid.
- Steam: the syrup pan steams and the baking tray carries heat shimmer. The finished sweets and the yolks are cool and show nothing.
- Sprite: none.

### TH06 The shophouse kitchen

Files: `th06_shophouse_wide.png`, `th06_shophouse_portrait.png`
Room id `th_shophouse`, folder `public/scenes/th_shophouse/`, opens from the object `shophouseTh`.

- Place: an open-fronted Teochew kitchen on the newly cut Yaowarat street, evening. Brick-and-timber shophouse with an arcaded five-foot way outside and a shuttered upper floor above; a carved timber screen, a small red shrine niche with an offering, marble-topped tables and low stools; oil lamps and the charcoal fire are the only light, warm against the blue street outside. Six people: a wok cook, a chopper at the block, two men eating, a boy carrying bowls, a woman at the counter. This and TH12 are the only night pictures in the set.
- Food: a **wok over a roaring charcoal ring with flat rice noodles, egg and greens in it**; **a roast duck and a length of crisp pork belly hanging on hooks over a thick wooden chopping block** with a heavy cleaver and a pile of chopped pieces; an **open pot of rice congee with the surface breaking**; a **bamboo steamer stack with the top lid lifted and resting beside it**, white buns inside; glazed jars of bean curd, preserved radish, salted egg and soy; a bamboo strainer, long chopsticks and a tin tray of condiments. No electric light, no stainless steel, no lettering on anything.
- Wide: the wok and the fire nearest, the block and the hanging meats in the middle, the tables and the arcade beyond. Portrait: the wok with the noodles lifting in the foreground, the cook above it, the hanging duck and the arcade at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the wok with the noodles in it; the roast duck on its hook over the block; the open steamer with its lid beside it.
- Signature motion area: the **wok tossed so the noodles lift clear of the pan in one mass and hang in the air**, with the flame rising round the rim under them — a clear, well-lit local area with the whole wok and the cook's two hands visible.
- Empty hook: **a plain brass hook screwed into the timber beam under the arcade outside the shopfront**, nothing on it, plain dark evening sky or plain rendered wall behind it. The duck and the pork hanging inside are the still ones and belong at the block, well away from this hook.
- Open area for cue (f): the open charcoal ring under the wok, unobstructed.
- Steam: the congee pot, the open steamer and the wok all steam. The jars and the cold condiments do not.
- Sprite: `th_motion_lantern.png`.

### TH07 The rice-field lunch

Files: `th07_paddy_wide.png`, `th07_paddy_portrait.png`
Room id `th_paddy`, folder `public/scenes/th_paddy/`, opens from the object `naKhaoTh`.

- Place: the earth bund between two flooded rice squares at harvest, mid-morning, hard high light and a hazy horizon. A rice barn on posts and a raised village mound under coconut behind; a water buffalo standing to its knees in the far square; cut stalks in bundles. Five people sitting and squatting on the bund: two women, two men, a child.
- Food: a **small fire of rice straw on the bund with a whole fish wrapped in banana leaf lying on it, the leaf charred and peeled open** so the white flesh shows; a **clay mortar set on the ground with green chilli, garlic, shallot and lime being pounded into `nam phrik`**; a **lidded woven basket of steamed rice with the lid off** and a second conical bamboo steamer; a bundle of morning glory, cucumber and a cut banana flower; a water gourd; a sickle; banana-leaf parcels tied with split bamboo.
- Wide: the bund running across the frame with the fire and the fish nearest, the mortar beside it, the eaters along it, the flooded squares, the buffalo and the barn behind. Portrait: the opened fish on its leaf in the foreground, the mortar and the hands above it, the flooded field, the buffalo and the sky at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the fish in its opened banana leaf on the fire; the mortar with the nam phrik; the open basket of rice.
- Signature motion area: the **banana-leaf parcel opened on the fire, the leaf peeling back and steam lifting off the fish**, both hands visible and correct, the whole fish and the whole leaf in a clear area.
- Empty hook: **a plain bamboo pole driven into the bund with a short cross-piece lashed to it, nothing hanging from it**, plain pale sky behind it.
- Open area for cue (f): a wide clean band of hazy sky over the paddy with nothing in it, for the egret; and the small straw fire.
- Steam: the opened fish and the open rice basket steam; the straw fire smokes low and to one side. The raw vegetables show nothing.
- Water: everybody is on the bund. Only the buffalo is in the water, and it is in it on purpose.
- Sprite: `th_motion_egret.png`.

### TH08 The Isan grill

Files: `th08_isan_wide.png`, `th08_isan_portrait.png`
Room id `th_isan`, folder `public/scenes/th_isan/`, opens from the object `isanGrillTh`.

- Place: the shaded open space under a raised Isan house on the dry plateau, late afternoon, the light coming in low and sideways under the floor. Sandy ground, a bamboo fence, a pond and a bamboo grove beyond, a loom pushed to one side. Smaller, plainer houses than the central plain's. A grandmother, two women, a man turning the grill, two children.
- Food: a **long charcoal trough grill with three whole chickens flattened between split-bamboo clamps turning over it**, skins lacquered dark, and skewers of pork beside them; a **tall clay mortar standing on the ground with shredded green papaya in it**, long beans, tomato, dried shrimp, chilli, garlic, lime halves and a lump of palm sugar to hand, a long wooden pestle in one hand and a spoon in the other; **woven baskets of sticky rice with their lids off**; a board of **`larb`** chopped fine with toasted rice powder, mint and shallot; a **row of glazed earthenware `pla ra` jars against the house posts**; banana-leaf cups and no plates at all.
- Wide: the grill running across the frame with the clamps nearest, the mortar on the ground beside it, the jars against the posts, the fence and the pond beyond. Portrait: the clay mortar and the papaya in the foreground, the pestle and both hands above, the grill and the underside of the house at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the grill with the chickens in their bamboo clamps; the clay mortar with the papaya in it; the open sticky-rice baskets.
- Signature motion area: the **wooden pestle striking down into the clay mortar while a spoon turns the papaya under it** — both hands, the whole mortar and the shredded papaya visible, in a clear well-lit area.
- Empty hook: **a plain bamboo rail lashed between two house posts, with nothing hanging from it**, the plain sandy ground and fence behind it, evenly lit.
- Open area for cue (f): the charcoal trough with the coals glowing along its length.
- Steam: the just-opened sticky-rice baskets steam; the grill carries heat shimmer and thin smoke. The `pla ra` jars are cold and show nothing at all.
- Sprite: `th_motion_garlic_string.png`.

### TH09 The Lanna kitchen

Files: `th09_lanna_wide.png`, `th09_lanna_portrait.png`
Room id `th_lanna`, folder `public/scenes/th_lanna/`, opens from the object `khaoSoiTh`.

- Place: a Lanna kitchen in Chiang Mai on a cool bright morning. Teak plank walls, a very low, wide, deep-eaved roof of wooden shingles, a raised floor, and through the open side a brick wat with a sweeping low roof and a forested ridge behind it. Cooler, greyer, bluer light than any other room in the set. A woman at the pot, an older woman at the grill, a Chin Haw muleteer in a dark jacket and white cap standing at the opening, two people seated on the floor.
- Food: an **open pot of khao soi curry broth** — turmeric, dried chilli, ginger, coriander root, coconut milk, the oil split orange on its surface — with a **bowl of soft egg noodles under a nest of the same noodles fried crisp**; beside it pickled mustard greens, sliced shallot, lime wedges and a spoon of chilli paste in oil; a **coil of `sai ua` on a low charcoal grill**; bowls of **`nam prik ong`**, red with pork and tomato, and **`nam prik num`**, green and roasted, with blanched vegetables, pork crackling and a basket of sticky rice; a **lacquered black-and-red `khantoke` tray set on the floor** with small bowls on it; flat brown `thua nao` soybean discs drying on a rack.
- Wide: the bowl and the pot nearest, the grill and the coil in the middle, the khantoke tray on the floor, the open side and the wat beyond. Portrait: the bowl with its crisp noodle nest in the foreground, the coil on the grill above it, the roof beams and the wat roof at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the bowl with the crisp noodle nest on it; the sai ua coil on the grill; the khantoke tray on the floor.
- Signature motion area: the **coil of sai ua turned once on the grill, the fat catching and the coil settling back**, in a clear area with the whole coil and the tongs or the hand visible.
- Empty hook: **a plain iron hook in the teak plank wall beside the grill**, nothing on it, a plain evenly lit pale plank behind it rather than the run of the boards' shadow.
- Open area for cue (f): the open side of the kitchen with cool daylight falling in a clean band onto the floor, nothing crossing it.
- Steam: the khao soi pot and the filled bowl steam; the grill carries heat shimmer. The pickles, the drying discs and the khantoke's cold dishes show nothing.
- Sprite: `th_motion_sai_ua.png`.

### TH10 The Andaman fishing kitchen

Files: `th10_andaman_wide.png`, `th10_andaman_portrait.png`
Room id `th_andaman`, folder `public/scenes/th_andaman/`, opens from the object `talayTh`.

- Place: a driftwood fire on pale sand in front of three wooden boats drawn up, hot midday with high white haze. Limestone towers rise sheer out of green water behind, undercut at the waterline, jungle on their tops. Mangrove at one side, a palm-thatch shelter at the other. Four people: two women at the fire, a man mending a net, a child with a basket. The boats are plain wooden hulls with oars and a furled sail — **no engine, no propeller shaft, no long tail**.
- Food: **two whole fish rubbed with pounded turmeric and salt lying on a grill of green sticks over driftwood coals**, the skin blistering yellow-orange; **split squid drying on a line** strung between two poles; an **open pot of `kaeng som`**, thin, orange, no coconut in it, with fish and green papaya visible; a plate of **`sataw` stink beans fried with prawns**; a stone mortar with turmeric, chilli, garlic and shrimp paste in it; a coconut opened on the sand; banana-leaf plates and a covered basket of rice.
- Wide: the fire and the stick grill nearest, the drying line and the pot beyond, the boats and the karsts across the water behind. Portrait: the turmeric-rubbed fish on the grill in the foreground, the cook above, the boats, the karsts and the sky at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the fish on the stick grill with its turmeric crust; the line of drying squid; the open pot of orange kaeng som.
- Signature motion area: a **whole turmeric-rubbed fish turned once on the green-stick grill, the skin lifting away from the sticks**, in clear light with the whole fish and the hand or tongs visible.
- Empty hook: **a second plain line strung between two poles beside the first, with nothing hanging from it at all**, plain pale sky behind it. The squid on the first line is the still, painted one and belongs well away from this one.
- Open area for cue (f): a wide clean band of hazy sky over the karsts with nothing in it, for the egret; and the open driftwood fire.
- Steam: the kaeng som pot is open and steams; the fire smokes low and to one side. The drying squid is cold and shows nothing.
- Water: the boats are drawn up on the sand. Nobody stands in the sea.
- Sprites: `th_motion_squid_line.png`, `th_motion_egret.png`.

### TH11 The Malay-Muslim kitchen

Files: `th11_muslim_wide.png`, `th11_muslim_portrait.png`
Room id `th_muslim`, folder `public/scenes/th_muslim/`, opens from the object `muslimKitchenTh`.

- Place: the open cooking side of a Malay village house on posts at a mangrove edge in the deep south, early evening, warm low light. Plank walls, a steep tiled roof, a plank step down to swept earth, a mosque roof with a tiered pyramidal profile beyond the trees, mangrove and still water behind it. Five people: a man at the plate, a woman at the pot, an older woman with a tray, two children on the step.
- Food: a **round steel plate over charcoal with one `roti` puffing on it** and a second disc being thrown out thin between two hands above it; an **open pot of `khao mok` with its lid lifted and resting against it**, rice yellow with turmeric, chicken pieces, cardamom pods and cinnamon bark showing; an **earthenware jar of `budu` with a wooden ladle in it**; a dish of **`nasi kerabu`**, blue-tinted rice with shredded herbs and toasted coconut; a bowl of massaman with whole spices, potato and peanuts; green chillies, shallots, ginger, garlic, turmeric root and dried fish on a board; enamel plates and a folded prayer mat on the step. **No pork anywhere in this room.**
- Wide: the steel plate and the thrown roti nearest, the open khao mok pot and the budu jar beyond, the step, the mangrove and the mosque roof behind. Portrait: the roti puffing on the plate in the foreground, the thrown disc and the hands above it, the pot and the mosque roof at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the roti puffing on the steel plate; the open pot of khao mok; the budu jar with its ladle.
- Signature motion area: a **disc of roti dough thrown out thin between two hands and settling toward the plate**, with the whole disc, both hands and the plate visible and correct — five fingers, right scale against the dough.
- Empty hook: **a plain wooden peg in the plank wall beside the step**, nothing on it, plain evenly lit planking behind it.
- Open area for cue (f): the charcoal under the steel plate; and a clean band of evening sky over the mangrove.
- Steam: the open khao mok pot steams and the roti on the plate carries heat shimmer. The budu, the nasi kerabu and the raw aromatics are cold and show nothing.
- Sprite: none.

### TH12 The tin town kitchen

Files: `th12_baba_wide.png`, `th12_baba_portrait.png`
Room id `th_baba`, folder `public/scenes/th_baba/`, opens from the object `babaTh`.

- Place: the back kitchen and dining room of a Sino-Portuguese shophouse in Phuket town, evening. A patterned tiled floor, an **airwell open to the sky in the middle of the house** dropping one shaft of last daylight onto the tiles, plastered walls in a pale pastel, a carved timber screen, an ancestral niche with an offering, shuttered arched windows; through the front, the arcade and, on the hill beyond, a wooden tin sluice and a spoil heap. Five people: a woman at the clay pot, a man at the iron plate, an older woman at the table, two children.
- Food: an **open clay pot of `moo hong`** — pork belly braised black with garlic, white pepper and dark soy, the fat gone translucent; a bowl of **`mee Hokkien`**, thick yellow noodles in brown gravy with prawn, pork and squid; **`o-tao`, oyster and grated taro frying on a flat iron plate with egg**; a plate of `nam phrik kung siap` with a smoked prawn on it and young mango beside; **a tiered tiffin carrier open on the marble-topped table with one tier lifted clear**; blue-and-white Nyonya porcelain, bentwood chairs, a brass spittoon.
- Wide: the clay pot and the iron plate nearest, the table with the open tiffin in the middle, the airwell above and the arcade at the far end. Portrait: the open clay pot of black pork in the foreground, the lifted tiffin tier above it, the airwell's light and the roof edge at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the open clay pot of black braised pork; the tiffin carrier open on the table with one tier lifted; the flat iron plate with the oyster fry.
- Signature motion area: a **tiffin tier lifted clear of the stack with steam coming off the food in it**, the whole tier, the stack below it and both hands visible and correct.
- Empty hook: **a plain iron hook in the underside of the airwell's timber beam**, nothing on it, plain pale plaster behind it — not the carved screen, not the tiled dado, not the ancestral niche.
- Open area for cue (f): the airwell open to the sky with its clean shaft of light falling onto the tiled floor, nothing crossing it.
- Steam: the open clay pot, the lifted tiffin tier, the noodle bowl and the iron plate all steam. The porcelain and the young mango do not.
- Sprite: `th_motion_lantern.png`.

## Part C: motion sprites, exactly six

Generate them after the rooms so colour and rendering match. Each is **one object on pure white**, large on the canvas, fully visible, clean edges, no ground plane, no cast shadow beyond the object, short side at least 400 pixels after trimming. The cutter limits the long side to 960 pixels, so a very long thin subject — the squid line, the garlic string — should be composed closer to square and not stretched out along the canvas, or its short side will fall below 400 after the limit is applied. Do not upscale an undersized subject; regenerate it.

Every one of these is a thing that will swing, and that is why it is here and not in the painting. **Do not paint any of them into the rooms.**

| File | Subject | Attachment | Rooms |
| --- | --- | --- | --- |
| `th_motion_lantern.png` | One round red-and-gold Chinese paper lantern with a bamboo frame, a short tassel under it and a wire loop at the top, **unlit** | Hangs from a painted empty brass hook or beam | TH06, TH12 |
| `th_motion_garlic_string.png` | One plaited string of Thai garlic heads and small red shallots about half a metre long, papery skins and dry stalks fully visible, with a loop of twine at the top | Hangs from a painted empty bamboo rail or nail | TH04, TH08 |
| `th_motion_squid_line.png` | Three split squid pegged by their fins along a short length of twine, flattened, translucent amber-white, the twine horizontal with both ends clear | Hangs over a painted empty line between two poles | TH10 |
| `th_motion_sai_ua.png` | One coil of northern Thai herb sausage, grilled, the skin blistered and orange-brown with flecks of lemongrass and kaffir lime leaf showing, hung from a short iron S-hook through the coil | Hangs from a painted empty iron hook | TH09 |
| `th_motion_egret.png` | One little egret in a natural gliding pose, wings and neck fully visible, slight three-quarter side view, white body with black legs trailing | Crosses painted open sky | TH01, TH07, TH10 |
| `th_motion_pla_tapian.png` | One `pla tapian` mobile: a fish woven from split palm leaf, about a hand's length, hung from a short thread with smaller woven fish below it, pale straw and green | Hangs from a painted empty bamboo pole or nail | TH01, TH03 |

Do not generate steam, smoke, ripples, bubbles, flour or spice clouds, liquid streams, glows, sparkles, markers, boats, chairs, tables, cups, bowls, plates, buildings, people or alternate poses. The application draws every effect in code.

## Part D: card illustrations, exactly twelve

One per room. Each shows one food close enough to read its texture, on pure white, no board, plate, knife or hand unless named, no background, short side at least 400 pixels after trimming.

| File | Subject |
| --- | --- |
| `th_card_khlong.png` | One young coconut with its top struck off in a clean facet, the water showing inside and a spoon of soft white flesh beside it |
| `th_card_noodleboat.png` | One small chinaware bowl of rice noodles in dark broth with sliced pork and a leaf of morning glory on top |
| `th_card_wang.png` | One small bowl of nam phrik with a blanched long bean, a piece of fried fish and a strip of omelette laid beside it |
| `th_card_curry.png` | One granite mortar seen from above with a half-pounded green-and-red curry paste in it and the pestle laid across the rim |
| `th_card_sweets.png` | One coiled skein of golden foi thong threads beside a single pinched thong yip flower cup |
| `th_card_shophouse.png` | One chopped section of roast duck with the lacquered skin showing, laid over a mound of white rice |
| `th_card_paddy.png` | One whole grilled fish in a charred banana leaf peeled open, beside a small ball of steamed rice |
| `th_card_isan.png` | One clay mortar of som tam, wet shredded green papaya with chilli, long bean and tomato, beside a woven ball of sticky rice |
| `th_card_lanna.png` | One bowl of khao soi with the orange oil split on the broth and a nest of crisp fried noodles on top |
| `th_card_andaman.png` | One whole turmeric-yellow grilled fish on green sticks, the skin blistered, beside a split dried squid |
| `th_card_muslim.png` | One puffed roti folded once, beside a small heap of turmeric-yellow khao mok rice with a cardamom pod in it |
| `th_card_baba.png` | Three pieces of black braised moo hong pork belly, the fat translucent, in a shallow blue-and-white bowl |

## Part E: acceptance check

Accept a picture only when every line is true. Reject and regenerate; do not repair a wrong picture with an overlay or a crop.

- Style matches the reference set: painted, not photographic, not cartoon
- Every person wears the 1880 to 1910 Siamese working clothes of the profiles above, and people vary in age, height, build, skin, hair, face, occupation and gesture
- **No pad thai, no green curry, no long-tail boat with an engine or a propeller shaft, no tuk-tuk, no bottled fish sauce, no conical Vietnamese hat, no dance costume, no hill-tribe costume**
- Food is accurate to its room brief, realistic, and large enough to read on a phone
- The scene is complete and physically possible: supports, boats afloat, hands with the right number of fingers, utensils, and every pouring vessel has its lip toward the receiver with the liquid falling under gravity
- **The empty hook is empty**, and the wall, sky, water or plank behind it is plain, evenly lit and different in tone from the sprite that will hang there
- **Every hot vessel is open** and every pour shows a clear lip, a visible stream and a clear landing surface
- **Nothing cold steams**: not fruit, not raw vegetables, not drying squid, not a jar of fermented fish, not iced khao chae, not porcelain
- **Nobody stands in open water.** Only the buffalo in TH07 is in water, on purpose
- The three discovery subjects are visible and unobstructed in both orientations, and in the portrait file all three are inside the middle 80 per cent of the width
- Each painting has one clean sky, fire, stove mouth, lamp, open side or airwell with nothing crossing it
- No text or lettering in any script, no signs, no labels on jars, no border, marker, collage, blur, plastic, stainless steel, aluminium, cardboard, motor or electric light
- The file is exactly 1672 x 941 or 941 x 1672 for rooms, and carries the exact name from this brief

## Part F: generation order and completion

Session 1: `th00_concept.png`. Stop and review it.

Session 2, with the approved concept attached as well: TH01 wide, TH01 portrait, then each room in numerical order through TH12, then the six sprites, then the twelve cards. After each pair, check food accuracy, style consistency, hands and utensils, supported furniture and boats, readable subjects, the empty hook, the open vessels and the portrait framing before moving on. If a limit interrupts the set, list the completed and remaining file names exactly and resume from that list.

Completion: 1 + 24 + 6 + 12 = **43 files** exist in `~/Downloads/additional game asset/thailand/`, each inspected, plus the inventory and the notes below.

## Part G: text notes to deliver with the files

For the concept: where each neighbourhood and landmark sits.

For each room pair:

- The signature action and the working area that supports it, described for the wide and the portrait file separately
- **Where the empty hook is in each file**, and what is behind it
- **Every hot vessel in the picture and whether its surface is open**, listed for each file, and every pour with its lip and its landing surface named
- **Every cold thing that a reviewer might mistake for hot** — the fermented-fish jars, the drying squid, the khao chae, the fruit — named per file so the application does not steam it
- The three discovery subjects and where they appear in each file, with a note confirming that in the portrait file all three sit inside the middle 80 per cent of the width
- Which sprite or sprites the room uses, and where each attachment point is in each file
- The actual pixel size of both files

The pictures are static. Do not call them animated because motion is depicted in them. The application adds steam, smoke, light, fire, birds, rain, liquid glints and the swing of the sprites in code, and adds the small diamond markers over the discovery subjects. Do not invent a discovery for a food that failed to appear clearly; report it instead so the pair can be regenerated.
