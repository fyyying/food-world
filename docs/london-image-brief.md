# Britain: the image brief

This is the Stage A deliverable for the `london` area of the Central Europe world, grown from London to Britain. It supersedes [examples/uk-scene-generation-prompt.txt](examples/uk-scene-generation-prompt.txt), which stays as an example only and which contradicts the current [art direction](art-direction.md) on period and on sizes. It was written from the art direction, the [Britain research](london-research.md) and the lead's decisions in [london-world.md](london-world.md).

## How to use this brief

1. Drop every delivered file into `~/Downloads/additional game asset/london/` with the exact file names below. The import script reads that folder.
2. Attach the reference set to every generation request. The files are in the repository: `public/scenes/hotpot/wide.jpg` (light, density, food), `public/scenes/tr_simit/wide.jpg` (clothing and street life), `public/scenes/tr_simit/portrait.jpg` (portrait composition), `public/scenes/props/red-lantern.webp` and `public/scenes/props/chilli-hanging.webp` (sprites). Spain's delivered rooms in `public/scenes/es_*/` are also in the repository and are the closest match for interior light and food scale.
3. Generate in two sessions. Session 1 is the concept image only. Look at it against section 1.6 of the research and the acceptance check; regenerate until it passes. Session 2 attaches the approved concept as well and generates the rooms, the sprites and the cards in the order in Part F.
4. Copy everything below the divider into the image tool. The playbook names Gemini through the `ce-gemini-imagegen` skill or GPT-Image-2.5 in ChatGPT with the reference images attached; both accept reference images.
5. Deliver a text inventory with the files: file name, actual pixel size, and the motion and discovery notes asked for in Part G.

Budget: **46 images.** One concept, thirteen wide rooms, thirteen portrait rooms, six motion sprites, thirteen card illustrations. Spain was 42.

| Part | Files | Count |
| --- | --- | --- |
| A | `ld00_concept.png` | 1 |
| B | `ld01_pub_wide.png` to `ld13_distillery_portrait.png` | 26 |
| C | `ld_motion_*.png` | 6 |
| D | `ld_card_*.png` | 13 |

### The six rules that came out of China and Spain

These are written into every room prompt below and they are the six things that were most expensive to fix afterwards. They are repeated here so the reviewer can check them in one place.

- **(a) Anything meant to move hangs from an empty hook.** Any hanging object that the application will swing — a pub sign, a hop bine, a brace of game, a lamp on a chain, a pair of fish on a stick, bunting, a bell — is delivered as its **own keyed sprite on pure white** and the room painting shows only its **hook, bracket, chain end, nail or rail, with nothing hanging from it**. Cutting a moving object out of a finished painting is forbidden: Spain's pepper strings were colour-keyed off warm walls, took the wall with them, and swung with a visible cut edge and a repaired hole behind them. Where a painting also carries a *still* hanging object that is never going to move, that is fine and welcome; it must simply be somewhere other than the empty hook.
- **(b) Open surfaces and visible streams.** Every hot vessel that should steam is pictured with an **open surface**: a lidless pot, a cup with no saucer over it, a pan with the lid lifted and resting beside it, an open oven mouth. Nothing hot is shown sealed or under glass. Every poured liquid shows **a clear lip, a clear landing surface, and a visible unbroken stream between them**: the spout or rim it leaves, the free thread in the air, and the exact surface it lands on. The application traces its glint from the lip to the landing, and Spain's cider glint ran on the glass of the bottle above the lip because the painting did not make the lip clear.
- **(c) Portrait compositions keep everything that matters inside the middle 80 per cent of the width.** A phone shows only about **x .094 to .906** of the frame after the fit. Every discovery subject, every signature action, every empty hook and every face that carries the room must sit inside that band in the portrait file. Outside it, put wall, sky, floor, steam and background only.
- **(d) Plain walls behind hanging things.** The wall, sky or stonework directly behind every empty hook and behind every still hanging object is **plain, evenly lit and clearly different in tone from what will hang there** — no pattern, no tile grid, no other object, no face, no strong sunlight and no deep shadow across it. Warm ochre walls behind warm objects are specifically to be avoided. No colour key will be needed now and none should ever be needed again.
- **(e) No text, nothing modern, hands and food correct.** No lettering of any kind anywhere: no shop fascias with words, no chalkboards, no newspapers with readable print, no labels, no price tickets, no signwriting, no captions, no watermarks. Every person is in the 1880–1914 working clothes of Part "period and people". No plastic, no stainless steel, no electric light, no printed packaging, no modern glassware, no wristwatches, no trainers, no zips. Faces and hands are anatomically correct with the right number of fingers; food is the right way up, the right scale against the hands that hold it, and the right dish for its room.
- **(f) Two natural motion cues besides the signature.** Each painting carries **one clean sky, one clean lamp or fire, or one open door or window with light coming through it** — an area with nothing crossing it — so the application has at least two natural cues besides the room's signature action. A sky with a bird in it already painted is not a substitute; leave the sky empty.

---

## Task and reference authority

Create a production-quality illustrated asset set for the Britain area of Food World, an explorable world where food reveals how people live. This Britain is one imagined island that compresses nine regions into six neighbourhoods. Every picture shows one clear regional setting. Do not stack every landmark, region or dish into one view.

Use the attached reference paintings as the authority for brushwork, texture, light, character rendering and level of detail. The style is painterly illustrated realism between a photograph and a cartoon: visible brushwork on brick, plaster, cloth, timber and stone; one light-source logic per picture; real body, hand, furniture and building proportions with faces that may be softened and eyes slightly enlarged as in the references; rich, saturated but natural colour; depth in three planes with food in the foreground, people and work in the middle and the place behind; complete scenes where every seat, table, shelf and hook holds what rests on it — except the one empty hook each room is asked for in rule (a).

Rejected in every picture: photorealism or photo compositing; a rendered 3D look with plastic highlights; flat vector shapes, thick outlines, cel shading, chibi proportions or mascot faces; blurred or smeared regions; any text, readable menus, signs with words, chalkboards, captions, filenames, watermarks, borders or checkerboards; contact sheets, collages, split panels or before-and-after frames; interface elements of any kind, meaning no arrows, rings, diamonds, markers or labels. The application adds its own markers afterwards over the actual subjects.

The Turkey reference paintings show the clothing standard. The hotpot reference shows light, density and food; ignore its present-day clothes.

This is Britain in the rain. The light is grey, low and silver outdoors, and every interior is lit by coal fire, gas mantle or oil lamp, which is warm and yellow against that grey. That contrast is the area's whole look and it should be in every picture. It is not a sunny country and it should not be painted as one.

## The period and the people

Every person in every picture wears the everyday working clothes of Britain between about **1880 and 1914**. This is one recorded period band for the whole area. Working clothes, not costume: no Pearly King suits, no tartan on anybody who is not at a wedding, no Beefeaters, no top hats on working men, no crinolines, and nothing modern at all.

Dress people from these eight profiles. Colours name the palette in the next section.

| Profile | Garments | Who wears it | Where |
| --- | --- | --- | --- |
| London street worker | Collarless flannel shirt with no tie, waistcoat, moleskin or corduroy trousers with braces, a knotted neckerchief, a cloth cap, hobnailed boots | Porter, coster, carman, cabman, dock labourer, hop-picker's husband | London, the docks, Kent |
| Counter worker | White shirt with sleeves rolled and held by armbands, dark waistcoat, a long white apron tied at the waist, a watch chain; a barmaid in a high-necked dark dress with white collar, cuffs and apron | Publican, barman, frier, pieman, baker, cheesemonger | Everywhere there is a counter |
| Waitress and shop girl | Ankle-length plain black or dark dress, a white bibbed pinafore apron, white cuffs, a white cap or cap band, hair pinned up, black buttoned boots | Tea-room waitress, market cashier, dairy assistant | London, Glasgow, the market |
| Lascar and ship's cook | Cotton lungi or loose trousers with a European jacket from the ship's slop chest, a knitted cap or folded cloth cap, a shawl or blanket against the cold | Sylheti and Chittagonian seamen, ships' cooks, boarding-house keepers | Shadwell, Limehouse, the docks |
| Fisherman and quay hand | Hand-knitted navy wool gansey with a patterned yoke, canvas or serge trousers, an oilskin smock and sou'wester in weather, sea boots or clogs | Drift-net crews, quay hands, cockle men, Cornish boatmen | The herring coast, Cornwall, the Gower |
| Herring lassie and gutting crew | Long dark skirt, a heavy oilskin apron and sleeves over it, a headscarf tied back, fingers bound in strips of cotton cloth against the knife, clogs | The three-woman gutting and packing crews | The east coast |
| Dales and moor farm worker | Tweed or fustian jacket, waistcoat, corduroy trousers tied below the knee with cord, collarless shirt, soft felt hat or cloth cap, hobnails; the dairywoman in a print blouse, dark skirt and coarse sacking apron | Shepherd, dairymaid, cheesemaker | The Dales, the West Riding |
| Cornish and Welsh working woman | Print blouse, wool skirt kilted up over a petticoat, hessian or sacking apron, a shawl crossed over the chest; in Cornwall the stiffened bonnet with a long neck curtain; on the sands often barefoot | Bakehouse women, cockle women, market sellers | Cornwall, the Gower, Swansea |

Women appear in every room as cooks, sellers, buyers and diners. Children appear in the outdoor rooms in pinafores and caps, carrying and fetching; the hop garden was mostly women and children and should read that way. Vary age, height, build, skin, hair, face, occupation and gesture in every picture. Children take small steps; elders lean a little. People cook, carry, choose, serve, pour, share and talk. Nobody poses for the viewer. Show four to eight readable people in a room, with smaller background figures only where they help.

## Palette

| Name | Hex | Use |
| --- | --- | --- |
| londonStock | #B9A183 | London stock brick, warehouse walls, terrace fronts |
| portlandStone | #E4DCCA | Portland and Bath stone, market halls, lime wash on a dairy, aprons and shirts |
| millstoneGrit | #6E675C | Pennine gritstone, dales drystone walls, mill-town street |
| moorGranite | #9B9691 | Cornish and Aberdeenshire granite, harbour walls, engine-house quoins |
| slateNorth | #49515A | Welsh and Cornish slate, Scottish roofs, wet cobbles, dark dresses |
| kentPeg | #A85B34 | Kentish peg tile, oast roundel brick, chimney pots, east-coast pantile |
| pubGreen | #1E3A28 | Public-house joinery, shopfront paint, cart bodies, hop bine in shade |
| oxbloodTile | #7B2E2B | Glazed brick and tiled dado in the pub, the pie shop and the fried fish shop |
| postRed | #B22C24 | Pillar box, omnibus, mail cart, a hop-picker's neckerchief |
| oakSmoke | #4A3526 | Oak beams, bar counters, casks, the smoke pit, the beam press |
| hopGreen | #7E8A4E | Hop bine, leek, wet pasture, orchard grass, oilskin |
| northSea | #3E5A63 | The Channel, the North Sea, the firth. The Thames and the estuary are the same colour pulled toward brown, about #6A6046 |

## Part A: the concept image

File: `ld00_concept.png`. One image, wide, at the largest native size available. No exact size is required for this picture; it is a spatial blueprint, not a room.

Paint the whole imagined Britain as one wooden-table diorama seen from a high three-quarter angle in flat silver overcast light with one break of low sun in the west. It is an **island**: one continuous sea surrounds it and is square where it meets the table edge. Six named neighbourhoods, one river reaching the sea through a widening estuary, open country between the neighbourhoods, landmarks kept behind the food places and smaller than their neighbourhood. Read the table clockwise from the centre-east.

1. **Westminster and the River** (centre-east). The densest neighbourhood and the visual centre of the whole table. A tidal river with a stone embankment; a Gothic clock tower behind and smaller than the food; a corner public house of brick with a lamp over the door and an **empty iron sign bracket** projecting from the wall; a tea shop with a plate-glass front; a market under a low iron-and-glass roof beside a railway viaduct, with produce spilling onto the pavement; cast-iron lamp standards and a pillar box.
2. **The Docks and the East End** (east, downstream). Warehouses standing straight out of brown water, a forest of masts with two steam funnels among them, a bascule bridge with two Gothic towers where the river narrows, a narrow street with a tiled fried fish shop and a tiled pie shop, a coffee stall on wheels under a flare, and a boarding house with a cooking fire in its back room.
3. **The Weald** (south-east). Hop gardens in strung rows with bines climbing above head height, three brick oast roundels with white timber cowls turned to the wind, an orchard beyond, a line of corrugated hopper huts and an open cookhouse fire with a pot hanging on a chain. Woodland behind.
4. **The Dales and the Mill Towns** (north-centre). A green valley bottom with drystone walls climbing the fell to the moor edge, field barns standing alone in the meadows, a flock of horned sheep, a low stone dairy with a press in its doorway; and to the south-east a run of low brick forcing sheds with their doors shut, and one mill-town street with a chimney behind it and a fried fish shop on the corner.
5. **The West Country and the Bristol Channel** (south-west). On the near shore a granite bakehouse with an oven mouth open to the street and a roofless engine house with its chimney on the skyline behind; an orchard of standard trees with cattle beneath and a round stone cider pound with a horse walking the stone. Across a narrow channel, a mile of pale cockle sand exposed at low water, women and donkeys working it, and a stall with a fire on the shore.
6. **The Firths and the Herring Coast** (north). A red sandstone cliff shelf with a curing yard and smoke rising from a barrel sunk in the ground; a quay below with drift-net boats, barrel stacks and a gutting crew at a long wooden trough; inland a distillery in a hollow by a burn with a water wheel, a peat stack and one small pagoda vent on its kiln roof; and far behind, small, a steel cantilever railway bridge crossing a firth.

Transitions: between 1 and 2 terraces become warehouses and the river widens and browns; between 2 and 3 estuary marsh gives way to hedged orchard and then to hop strings; between 3 and 4 the weald rises into open sheep country and hedges become stone walls; between 4 and 5 stone gives way to cob and lime wash and the grass gets greener and wetter; between 5 and 6 the coast runs north and slate becomes red sandstone and pantile; between 6 and 1 moor and barley run south into pasture and then into brick.

Water: one continuous sea round the whole island, square at the table edge. One river rises in the western hills, runs east through 1, widens past 2 and reaches the sea in a brown estuary. A second, much smaller estuary at 5 is the cockle ground and is sand, not water, at low tide. Nothing stands in water except the two bridges, which are built to.

No interface elements, no labels, no text. Deliver a short text note naming where each of the six neighbourhoods and the four landmarks sit in the picture.

## Part B: the thirteen room pairs

### Rules for every room pair

1. Two independently composed paintings per room. Wide is exactly **1672 x 941** pixels. Portrait is exactly **941 x 1672** pixels. Do not crop, stretch or upscale one to make the other. Report the delivered pixel size of every file in the inventory. A file at any other size is rejected.
2. One complete environment per image: no collages, contact sheets, split views, miniatures or panels.
3. The same place, food, palette and main characters in both orientations. Wide reveals the work surface and the place. Portrait stacks food, worker and place vertically and is recomposed, not squeezed.
4. A human-height or slightly elevated three-quarter view. The main food occupies a substantial, readable part of the foreground in both orientations, with texture that reads at phone scale: the crust on a pie, the fat marbling in a rasher, the crumb of a cheese, the copper skin of a smoked fish, the grain of a chipped potato.
5. The three discovery subjects are visible, distinct and unobstructed in **both** orientations, with breathing room around them, never hidden behind hands, table edges, steam or decoration. **In the portrait file all three sit inside the middle 80 per cent of the width** (rule c).
6. Four to eight readable people from the profiles above, varied in every way listed, doing the work of the room.
7. The painting is complete without sprites: its furniture, utensils, food, people, buildings and plants are all in it. Every seat and work surface supports what rests on it. Every hand holds something plausibly.
8. **Each room carries one empty hook, bracket, chain end, nail or rail** where the brief names one, with a plain, evenly lit wall or sky behind it that is clearly different in tone from the object that will hang there (rules a and d). Nothing hangs from it. Do not put a face, a pattern, a tile grid, a shelf, a window or a shaft of sunlight behind it.
9. **Every hot vessel is open**: no lid, or the lid lifted and resting beside the pot. **Every pour shows lip, stream and landing** (rule b).
10. Each painting carries one clean open sky, one clean lamp or fire, or one open door or window with light through it, with nothing crossing it (rule f).
11. Cold food and cold rooms show **no steam at all**. The dairy in particular has no hot process in it and must show none.
12. No text, labels, markers, arrows, rings, borders, watermarks, captions, chalkboards, price tickets, readable newsprint or invented lettering anywhere in the art (rule e).

Vessels, tools and stock belong to the period: earthenware, enamelled iron, tinned iron, copper, brass, wood, cast iron, glass, cloth, paper, newspaper, straw and sacking. No plastic, no stainless steel, no electric light, no printed packaging, no cardboard boxes.

### UK01 The public house

Files: `ld01_pub_wide.png`, `ld01_pub_portrait.png`
Room id `uk_pub`, folder `public/scenes/uk_pub/`, opens from the object `roastPub`.

- Place: a corner public house in Westminster on a wet Sunday at one o'clock. A mahogany counter with a brass rail, a row of hand-pump beer engine handles in china and brass, an etched and cut glass screen at the end of the bar, a glazed dark-red tiled dado below the counter front, a coal fire burning in a black iron grate with a brass fender, gas mantles on brackets, plain scrubbed tables and settles. Through the open street door, wet setts, a lamp standard and grey rain.
- Food: a **sirloin of beef on the bone** resting on a wooden board at the end of the counter, part carved, the cut face showing pink in the middle and a dark salt crust at the edge, slices laid over and a long carving knife and fork in the carver's hands. Beside it: a flat black iron tin of **batter puddings baked flat in the dripping and cut into squares**, not risen in individual cups; roast potatoes in the same dripping; a copper pan of gravy; boiled cabbage and carrot in a white dish; a pot of horseradish; a plate of bread, a wedge of Cheddar and pickled onions for the men not eating the roast. Straight glasses of flat, cellar-cool bitter. No chips. No printed menu, no chalkboard.
- Wide: the counter's length with the joint at one end, the fire and two tables, the street door open at the far end. Portrait: the carved joint and the tray of puddings in the foreground, the carver above them, the beer engine and the fire behind, the door and the rain at the top — all inside the middle 80 per cent of the width.
- Discovery subjects: the carved face of the sirloin; the tin of batter puddings; the beer engine handle with a glass filling under it.
- Signature motion area: the carving knife mid-stroke with one slice separating from the joint and tipping toward the plate, in a clear area with the board and the joint completely visible and no hand crossing the blade. The beer under the pump shows a clear lip at the swan neck, a visible stream and a clear landing in the glass.
- Empty hooks, two: **an iron sign bracket projecting from the plain brick wall outside the door, with nothing hanging from it**, plain grey sky behind it; and **a plain iron hook or nail in the beam over the bar**, with plain lime-washed plaster behind it. Do not paint a sign board and do not paint a hop bine.
- Open area for cue (f): the coal fire in the grate, unobstructed.
- Sprites: `ld_motion_pub_sign.png`, `ld_motion_hop_bine.png`.

### UK02 The tea room

Files: `ld02_tearoom_wide.png`, `ld02_tearoom_portrait.png`
Room id `uk_tearoom`, folder `public/scenes/uk_tearoom/`, opens from the object `teaRoomUk`.

- Place: a town tea shop in the afternoon, rain running down a large plate-glass window onto a wet street with an omnibus passing. Bentwood chairs, small marble-topped tables, a tiled floor, a plain panelled counter with a cake stand of plain glass, a mirror, warm lamp light against the grey outside. Two women at one table, one alone at another with a book, a waitress in a black dress and white pinafore apron.
- Food: a **china teapot with a knitted cosy beside it, the lid on but the spout clear**, a tea strainer resting over a cup, a hot-water jug with an open top, a milk jug and a sugar basin with tongs; a plate of **thin white bread and butter cut in triangles**; plain split scones with butter and a dish of jam; a Madeira or seed cake on a stand with two slices cut; a Bath bun. Loose leaf only. No teabag, no tiered stand, no modern china.
- Wide: the window, two tables and the counter, with the pouring table nearest. Portrait: the pot, strainer and cup in the foreground, the waitress and the table above, the rain-streaked window at the top, everything inside the middle 80 per cent of the width.
- Discovery subjects: the pot pouring through the strainer into the cup; the plate of bread and butter; the cut cake on its stand.
- Signature motion area: the **pour** — the pot tilted, a clear lip at the spout, a visible thread of tea, and a clear landing in the cup through the strainer. Nothing crosses the thread. The cup is on the table, not in a hand.
- Empty hook: **a plain brass chain hanging from the ceiling with an empty ring at the end of it**, over a clear part of the room, with plain painted plaster behind and above it.
- Open area for cue (f): the rain-streaked plate glass, unobstructed by a head or a plant.
- Steam: the cups, the pot's spout and the open hot-water jug are hot and open. Nothing is under a dome.
- Sprite: `ld_motion_hanging_lamp.png`.

### UK03 The market

Files: `ld03_market_wide.png`, `ld03_market_portrait.png`
Room id `uk_market`, folder `public/scenes/uk_market/`, opens from the object `boroughUk`.

- Place: a London food market at first light under a low iron-and-glass roof beside a brick railway viaduct. Timber stalls with canvas valances, wooden crates, hand barrows, a brass balance with weights, a marble slab, sawdust and cabbage leaves underfoot, one porter with a load on his head, two shoppers with baskets, the cold breath of an early morning. Shafts of grey light down through the glass.
- Food: a **cloth-bound Cheddar truckle with one cut open**, showing the muslin bandage, the dry rind and a close pale crumb, with a cheese wire lying across it; a second, darker Cheshire beside it; a side of bacon on a hook; a pyramid of **butter on the marble slab with a pair of ribbed wooden pats**; brown eggs in straw; wooden crates of potatoes, swedes, carrots and cabbages; apples in a chip basket; a tray of muffins under a cloth. No printed labels, no price tickets, no chalkboards.
- Wide: the aisle with two stalls and the porter, the viaduct arch behind. Portrait: the cut truckle and the butter slab in the foreground, the stallholder above, the iron roof and its light at the top, all inside the middle 80 per cent of the width.
- Discovery subjects: the open truckle with the wire across it; the butter on the slab with the wooden pats; the crate of apples.
- Signature motion area: the **cheese wire drawn down through the truckle with a wedge falling away from the face**, in a clear area with the whole cut visible.
- Empty hook: **a plain iron S-hook on a wooden rail at the front of the stall, with nothing on it**, plain grey canvas or plain plastered brick behind it. Do not paint a brace of game there; if game is wanted elsewhere in the picture it must be a **second** hook well away from this one.
- Open area for cue (f): the shafts of light down through the glass roof, unobstructed.
- Steam: a tin tea can and a porter's breath. Cold food shows none.
- Sprite: `ld_motion_game_brace.png`.

### UK04 The pie and mash shop

Files: `ld04_piemash_wide.png`, `ld04_piemash_portrait.png`
Room id `uk_piemash`, folder `public/scenes/uk_piemash/`, opens from the object `pieMashUk`.

- Place: a narrow shop off a dock street. White and dark-green glazed wall tiles to head height, long mirrors between them, marble-topped tables with plain wooden benches fixed to the floor, sawdust on the boards, a gas mantle, a counter with a tray of pies and a copper of liquor. Working men and women eating with a fork and a spoon, one boy on an errand. Wet street outside the door.
- Food: on a white plate, a **minced beef pie with a shortcrust base and a puff lid**, one lid broken open showing dark filling; a **swipe of mashed potato** spread round one side of the plate, not scooped into a ball; a ladle of bright **green parsley liquor** running over both. On the counter, a zinc tray of **stewed eels cut in rings in their own stock** and a tray of **jellied eels set cold with the rings held in clear jelly**. A chilli vinegar bottle and a pepper pot on the marble. No gravy, no peas, no chips.
- Wide: the counter, the tray of eels and two tables of eaters, the shop door at the end. Portrait: the plate with the pie, mash and liquor in the foreground, the ladle above it, the counter and the tiled wall behind, inside the middle 80 per cent of the width.
- Discovery subjects: the broken-open pie; the ladle of green liquor over the plate; the tray of jellied eels.
- Signature motion area: the **ladle tipped over the plate with a visible fall of green liquor from its lip to the pie and the mash**. Clear lip, clear stream, clear landing, nothing crossing it.
- Empty hook: **a plain brass hook on the panelled counter front near the till**, with plain painted timber behind it.
- Open area for cue (f): the gas mantle on its bracket, unobstructed.
- Steam: the pie, the mash and the tray of stewed eels are hot and open. The jellied eels are cold and show nothing.
- Sprite: none.

### UK05 The fried fish shop

Files: `ld05_chippy_wide.png`, `ld05_chippy_portrait.png`
Room id `uk_chippy`, folder `public/scenes/uk_chippy/`, opens from the object `chippyUk`.

- Place: a fried fish shop on a mill-town corner on a wet evening. A coal-fired frying range with a brass and cast-iron hood and two open pans, white glazed tiles, a marble counter, a bench chipper screwed to a side table, a bare gas jet, a queue of mill workers and children to the door with rain behind them, steam on the window.
- Food: **fillets of haddock and cod in a plain flour-and-water batter frying in beef dripping**, three already draining on a wire rack over the pan with the fat running off them; **hand-cut chipped potatoes** going into the second pan and a heap of raw chips on the bench beside the chipper; a salt drum and a malt vinegar bottle with a shaker top; a sheet of greaseproof and a sheet of newspaper on the counter with a portion being folded into them; a bowl of loose batter scraps. No mushy peas in any modern tub, no cardboard, no fluorescent light.
- Wide: the range with both pans, the counter and the queue, the door and the rain. Portrait: the draining rack and the chips in the foreground, the frier above them, the range hood and the window at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the wire rack of fried fish with the fat running; the chipper and the raw chips; the paper being folded round a portion.
- Signature motion area: a **wire basket of chips lifted clear of the fat and being shaken**, with the fat streaming off the basket back into the pan in visible threads. Clear lip at the basket, clear landing at the fat surface, nothing crossing between.
- Empty hook: **a plain iron hook on the tiled wall beside the range**, with a plain untiled painted panel behind it rather than the tile grid.
- Open area for cue (f): the open fire door of the range with the coals visible.
- Steam: both pans are open, both surfaces show small breaking bubbles, and the draining fish steams.
- Sprite: none.

### UK06 The porters' breakfast

Files: `ld06_breakfast_wide.png`, `ld06_breakfast_portrait.png`
Room id `uk_breakfast`, folder `public/scenes/uk_breakfast/`, opens from the object `breakfastUk`.

- Place: a coffee stall on wheels on wet cobbles outside a fish market at four in the morning. Dark, cold, and lit almost entirely by a naphtha flare on a pole over the stall, which throws hard yellow light on faces and leaves the street black. The market's lit doorway behind with porters carrying boxes on their heads, a horse and van at the kerb, a brick and iron market front above. This is the only night picture in the set and it should look it.
- Food: a flat iron griddle on the stall with **back bacon rashers curling**, discs of black pudding, slices of bread going into the fat and two eggs; a board of thick bread and butter; a **tall tin boiler with a brass tap** and a mug held under it; tin mugs in a row, a bowl of sugar; a jar of pickled onions; saveloys in a dish. No plates on a café table: the food is handed over the board and eaten standing.
- Wide: the stall's length, the flare, three or four men standing and eating, the market front behind. Portrait: the griddle and the bacon in the foreground, the stallholder and the boiler above, the flare and the dark market roof at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the bacon curling on the griddle; the boiler's brass tap with the mug under it; the board of bread and butter.
- Signature motion area: the **mug filling from the boiler tap**, with a clear tap lip, a visible falling stream and a clear landing surface in the mug, the mug standing on the board and not held in a hand.
- Empty hook: **a plain iron hook under the stall's canopy edge**, nothing on it, plain dark canvas behind it.
- Open area for cue (f): a clean patch of black night sky above the market roof, with nothing in it, for the gull.
- Steam: the mugs, the boiler and the griddle all steam, and in the cold air the men's breath does too.
- Sprite: `ld_motion_gull.png`.

### UK07 The seamen's kitchen

Files: `ld07_lascar_wide.png`, `ld07_lascar_portrait.png`
Room id `uk_lascar`, folder `public/scenes/uk_lascar/`, opens from the object `lascarUk`.

- Place: the back kitchen of a seamen's boarding house in Shadwell. A black iron range with a low fire, a scrubbed deal table, a bench, a shelf of tin and enamel, a sea chest and a coil of rope in the corner, a small sash window onto a brick yard and a grey sky, plain lime-washed plaster walls going yellow with smoke. Six men from the same ship: four seated or standing, one cooking, one at the door. They are Bengali — Sylheti and Chittagonian — in lungis and ship's jackets, not in costume and not in turbans.
- Food: a **heavy iron pan of rice with the lid lifted and resting beside it**; an open pot of fish curry with whole green chillies and coriander leaves on it; a **flat stone slab and roller with ground turmeric, cumin and chilli in a heap on it**; a tin trunk open with small cloth bags of whole spices; flatbreads cooking dry on a griddle and a stack of finished ones under a cloth; a chipped enamel dish of pickle; a whole fish from the market on a board.
- Wide: the range, the table and the men, with the cook nearest and the window at the far end. Portrait: the stone slab and the curry pot in the foreground, the cook above them, the range and the hanging chain at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the stone slab with the ground spice on it; the open pot of curry; the pan of rice with its lid off.
- Signature motion area: the **pan tilted and ground spice sliding off the slab into the hot fat**, with the cook's hand following it — a clear, tight working area with the slab, the falling spice and the pan surface all visible.
- Empty hook: **a plain iron chain hanging from a beam over the range end, with an empty S-hook at its end**, plain lime-washed plaster behind it.
- Open area for cue (f): the fire in the open range door.
- Steam: the rice pot, the curry pot and the griddle are all open and all steam.
- Sprite: `ld_motion_hanging_lamp.png`.

### UK08 The hop-pickers' cookhouse

Files: `ld08_hopkitchen_wide.png`, `ld08_hopkitchen_portrait.png`
Room id `uk_hopkitchen`, folder `public/scenes/uk_hopkitchen/`, opens from the object `hopKitchenUk`.

- Place: the edge of a Kentish hop garden in September, late afternoon, soft grey light with one break of sun. A row of corrugated-iron hopper huts with sacking at the doors; an open fire of faggots between two iron uprights with a bar across them; a canvas hop bin on a wooden frame half full of green cones; strung hop rows running away behind with **bines still growing on their strings**; an oast roundel with a white cowl in the middle distance; a wood at the back. Two women picking, a child with an enamel plate, a grandmother at the fire, a man carrying a poke sack.
- Food: a **big iron pot hanging on a chain over the fire with the lid off**, holding neck of mutton, potato, onion, carrot and pearl barley, the surface moving; a sooty kettle beside it on the bar; a loaf and a clasp knife on an upturned crate; a rasher of bacon on a toasting fork over the flame; a stone jar of beer; enamel plates and mugs; a basin of picked green cones.
- Wide: the fire and the pot nearest, the bin and the pickers, the hop rows and the oast behind. Portrait: the pot over the fire in the foreground, the grandmother above it, the hop rows and the sky at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the open pot over the fire; the canvas bin of green hop cones; the loaf and the knife on the crate.
- Signature motion area: the **pot on its chain swinging over the flames while a ladle lifts and pours back into it** — clear lip on the ladle, a visible fall, and a clear landing on the surface of the stew.
- Empty hook: **a plain empty wire or twine line strung between two poles beside the huts, with nothing hanging from it**, plain sky behind it. The still growing bines on their strings are elsewhere in the picture and are fine.
- Open area for cue (f): the fire, and a clean patch of grey sky over the hop rows.
- Steam: the pot and the kettle steam; the fire smokes low and to one side.
- Sprite: `ld_motion_hop_bine.png`.

### UK09 The dale dairy

Files: `ld09_dairy_wide.png`, `ld09_dairy_portrait.png`
Room id `uk_dairy`, folder `public/scenes/uk_dairy/`, opens from the object `dairyUk`.

- Place: a stone dairy at the gable end of a Yorkshire Dales farmhouse. Flagged floor, lime-washed rubble walls, a slate shelf along one wall, a small deep window, and a plank door standing open onto a walled meadow with a drystone wall climbing the fell, a field barn and horned Swaledale sheep. Cool, quiet, and much darker than the other rooms except where the door light falls. Two women working, a girl carrying a pail.
- Food: a wooden tub of milk; **curd cut into cubes draining on a slatted wooden rack**; a cloth-lined hoop of curd going under an **iron screw press**; **whey running from the press spout into a pail** in a thin steady thread; a finished cloth-bound truckle on the slate shelf and one cut open showing a white, close, crumbly paste; a curd knife, a wooden scoop and a long thermometer.
- Wide: the bench with the rack and the press, the slate shelf and the open door with the meadow beyond. Portrait: the cut truckle and the draining curd in the foreground, the press above, the open door and the fell at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the cut truckle showing the crumb; the curd draining on the rack; the press with the pail under it.
- Signature motion area: the **screw of the press turning down while whey runs from the spout into the pail** — a clear spout lip, a visible unbroken thread, and a clear landing on the surface of the whey in the pail. Paint it as a liquid running, not as drips scattered down the wall.
- **This room is cold. No fire, no steam, no boiling, nothing hot anywhere in it.** There is no kettle, no range and no hot vat. Spain's cheese farm was delivered with a copper caldero that had no fire under it, the application steamed it anyway, and the owner read the room's own text and asked why. The liquid here runs; it does not rise.
- Empty hook: **a plain wooden peg in the wall beside the door, with nothing on it**, plain lime wash behind it. Cloths hanging elsewhere in the room are fine and should be still.
- Open area for cue (f): the open door with daylight falling across the flags, nothing crossing it.
- Sprite: none.

### UK10 The Cornish bakehouse

Files: `ld10_pasty_wide.png`, `ld10_pasty_portrait.png`
Room id `uk_pasty`, folder `public/scenes/uk_pasty/`, opens from the object `pastyUk`.

- Place: a granite bakehouse in a Cornish mining village, morning. A **bread oven mouth open in the thickness of the wall** with its iron door swung back and the brick throat glowing; a scrubbed elm board; a flour bin; a long wooden peel; granite walls, a slate floor, a small window; the plank door open onto a steep street running down to grey water, with a roofless engine house and its chimney on the skyline. Two women working the board, an old man at the oven, two children waiting.
- Food: raw **pasties on the board**, each a circle of shortcrust folded over and **crimped along the side, never over the top**, filled with beef skirt in pieces, potato and swede **sliced, not diced**, onion, salt and a great deal of pepper, put in raw. **No carrot.** One pasty broken open showing the layers of filling and the juice. A pastry initial pressed on one corner of two of them, as a shape with no letter readable. Bowls of sliced swede and potato, a heap of trimmings, baked pasties cooling on a cloth, a saffron bun and a flat scored heavy cake on a second tray.
- Wide: the board, the oven mouth and the open street door in one line. Portrait: the crimped pasty and the broken one in the foreground, the hands above them, the glowing oven mouth and the wall at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the crimped edge of one raw pasty; the broken pasty showing the filling; the open oven mouth with the peel entering it.
- Signature motion area: a **thumb and forefinger crimping along the edge of one raw pasty**, close, tight, with the whole edge and both hands visible and correct — five fingers, right scale against the pastry.
- Empty hook: **a plain iron hook on the granite beside the oven, with nothing on it**, a plain lime-washed panel behind it rather than bare rubble.
- Open area for cue (f): the open oven mouth, and the open street door with grey daylight.
- Steam: the broken pasty steams; the oven mouth carries heat shimmer.
- Sprite: none.

### UK11 The cockle sands

Files: `ld11_cockles_wide.png`, `ld11_cockles_portrait.png`
Room id `uk_cockles`, folder `public/scenes/uk_cockles/`, opens from the object `cocklesUk`.

- Place: the cockle sands of a shallow Welsh estuary at low water on a bright cold morning. A mile of pale wet sand running out to a distant channel, a wide flat sky, a low green shore behind with a lime-washed cottage. Women working bent over the sand with short scrapes and wire riddles, sacks and open panniers, two patient donkeys standing with their loads. On the shore behind, a fire under an iron copper of boiling water and a plank stall.
- Food: a **wire riddle of live cockles being shaken clear of wet sand**, held over a sack; a tub of boiled cockles beside the copper; a tin pint measure and a cone of paper being filled; a black earthenware dish of **laverbread**, dark green-brown; a plate of laverbread rolled in oatmeal and fried with bacon and cockles; a jug of vinegar and a pepper pot; a griddle of Welsh cakes on the stall.
- Wide: two women and a donkey on the sand in the middle distance, the riddle and the sacks in the foreground, the stall and the fire on the shore at one side. Portrait: the riddle of cockles in the foreground, the woman above it, the donkey, the sand and the sky at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the riddle of cockles being shaken; the pint measure and the paper cone; the dish of laverbread.
- Signature motion area: the **riddle shaken with wet sand falling through it in a fine continuous fall** onto the sand below — a clear rim, a visible fall, a clear landing.
- Empty hook: **a plain empty wooden peg or iron hook on the upright of the plank stall**, plain sky or plain lime-washed board behind it.
- Open area for cue (f): a wide clean band of open sky over the sands with nothing in it, for the gull.
- Steam: the copper on the shore is open and steams. Nothing on the sand does.
- Water: the channel is far out and no person, donkey or object stands in it.
- Sprite: `ld_motion_gull.png`.

### UK12 The smokehouse

Files: `ld12_smokehouse_wide.png`, `ld12_smokehouse_portrait.png`
Room id `uk_smokehouse`, folder `public/scenes/uk_smokehouse/`, opens from the object `smokehouseUk`.

- Place: a curing yard on a red sandstone shelf above a small Scottish harbour, afternoon, grey sea light. A **half whisky barrel sunk into the ground with a hardwood fire burning in the bottom of it**; a simple wooden frame of uprights and a cross-bar over it; wet hessian sacks folded on a bench ready to cover the pit; a bench of split fish; a barrel of coarse salt and a tub of brine; barrel stacks and two drift-net boats on the water below; a low stone net loft. Three women and a man working, in aprons, skirts and ganseys.
- Food: **haddock split, cleaned and tied in pairs by the tail**, hanging over a wooden speet — a stick — that is being lowered across the pit; finished smokies with copper-brown skin and one opened by hand showing creamy flesh coming off the bone in flakes; on a rail to one side, a pair of cold-smoked kippers and a pale split Findon haddock, for contrast; a knife and a ball of twine on the bench.
- Wide: the pit with the speet going over it, the bench of split fish, the harbour below. Portrait: the tied pair and the opened smokie in the foreground, the worker above, the pit smoke and the sky at the top, inside the middle 80 per cent of the width.
- Discovery subjects: a tied pair of haddock over the speet; the opened smokie showing the flesh; the fire in the sunken barrel.
- Signature motion area: the **speet of paired fish being lowered across the pit**, with the fish clear of everything and the fire visible below them. Clean, well-lit local area.
- Empty hook: **a plain empty wooden cross-bar between two uprights at one side of the yard, with nothing hanging from it**, plain grey sky behind it. The pair of fish going onto the pit and the kippers on the rail are the still, painted ones and belong somewhere else in the frame.
- Open area for cue (f): a clean band of grey sky over the sea, nothing in it, for the gull; and the open fire in the pit.
- Steam and smoke: the pit is open and smoking. The opened smokie steams because it has just come off.
- Sprites: `ld_motion_smoke_speet.png`, `ld_motion_gull.png`.

### UK13 The distillery

Files: `ld13_distillery_wide.png`, `ld13_distillery_portrait.png`
Room id `uk_distillery`, folder `public/scenes/uk_distillery/`, opens from the object `distilleryUk`.

- Place: a Speyside distillery still house and malting floor in one view, cool, dim, with one high window throwing a shaft of light with motes turning in it. A stone-flagged **malting floor with green barley spread on it and a wooden shiel** leaning in it; beyond, a low arch to the kiln with a **peat fire glowing under it**; two **copper pot stills with swan necks and lyne arms**, dull-polished and dented; a wooden washback with a foaming head; a **brass and glass spirit safe with clear spirit running through it**; an oak cask on a stillage with a bung open; outside a small window, a wooden water wheel and a stack of cut peat. Three men in shirtsleeves, waistcoats and caps; one turning barley, one at the safe, one at the cask.
- Food and drink: the barley on the floor, green with rootlets; the peat; the foaming wash; the **clear spirit running in a thread inside the glass of the safe**; a plain glass with a dram in it and a plate of girdle oatcakes and a wedge of cheese on a barrel head.
- Wide: the malting floor in the foreground, the stills in the middle, the kiln arch and the window behind. Portrait: the barley and the shiel in the foreground, the man turning it above, the still's swan neck and the high window at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the barley and the shiel on the floor; the peat fire under the kiln; the spirit safe with spirit running.
- Signature motion area: the **spirit running inside the glass of the safe** — a clear lip where it leaves the pipe, a visible thread, and a clear landing surface in the glass bowl below it. Nothing crosses the thread and there is nothing glinting above the lip or below the surface.
- Empty hook: **a plain iron hook on the whitewashed wall beside the spirit safe**, with nothing on it.
- Open area for cue (f): the shaft of light from the high window with motes in it, and the peat fire in the kiln arch.
- Steam: the washback's foaming head, the kiln's heat shimmer and the still's warm air. The spirit itself is cool and clear.
- Sprite: none.

## Part C: motion sprites, exactly six

Generate them after the rooms so colour and rendering match. Each is **one object on pure white**, large on the canvas, fully visible, clean edges, no ground plane, no cast shadow beyond the object, short side at least 400 pixels after trimming. The cutter limits the long side to 960 pixels, so a very long thin subject — the hop bine, the speet of fish — should be composed closer to square and not stretched out along the canvas, or its short side will fall below 400 after the limit is applied. Do not upscale an undersized subject; regenerate it.

Every one of these is a thing that will swing, and that is why it is here and not in the painting. **Do not paint any of them into the rooms.**

| File | Subject | Attachment | Rooms |
| --- | --- | --- | --- |
| `ld_motion_pub_sign.png` | One hanging public-house sign: a rectangular painted board in a plain iron frame, hanging from a short iron eye at the top. The board carries a **painted device only — a bunch of grapes, a horseshoe, a crown, a fox — and no lettering of any kind**, which is exactly how these signs were painted for people who could not read | Hangs from a painted empty iron bracket on a wall | UK01 |
| `ld_motion_hop_bine.png` | One cut hop bine about a metre long: a woody stem with lobed green leaves and fifteen to twenty pale green papery cones, with a straight cut attachment at the top | Hangs from a painted empty hook, nail or line | UK01, UK08 |
| `ld_motion_game_brace.png` | A brace of birds — one cock pheasant and one hen, or two partridges — hung by the feet on a short twisted cord with a loop at the top, heads down, plumage fully visible | Hangs from a painted empty S-hook on a stall rail | UK03 |
| `ld_motion_gull.png` | One herring gull in a natural gliding pose, wings and tail fully visible, slight three-quarter side view, grey mantle and white body | Crosses painted open sky | UK06, UK11, UK12 |
| `ld_motion_smoke_speet.png` | Two split haddock tied together by the tails with twine and hung over a short length of wooden stick, skins copper-brown from the smoke, the stick horizontal and its ends clear | Hangs over a painted empty cross-bar | UK12 |
| `ld_motion_hanging_lamp.png` | One brass or copper oil lamp with a glass chimney and a shade, **unlit**, hanging from a short length of chain with a ring at the top | Hangs from a painted empty chain end or ring | UK02, UK07 |

Do not generate steam, smoke, ripples, bubbles, flour or spice clouds, liquid streams, glows, sparkles, markers, chairs, tables, cups, bowls, plates, buildings, people or alternate poses. The application draws every effect in code.

## Part D: card illustrations, exactly thirteen

One per room. Each shows one food close enough to read its texture, on pure white, no board, plate, knife or hand unless named, no background, short side at least 400 pixels after trimming.

| File | Subject |
| --- | --- |
| `ld_card_pub.png` | Three slices carved from a sirloin, pink in the middle with a dark edge, overlapping, beside one square of flat-baked batter pudding |
| `ld_card_tearoom.png` | One china cup and saucer of tea with a scone split and buttered beside it |
| `ld_card_market.png` | One wedge cut from a cloth-bound Cheddar truckle, showing the muslin bandage, the dry rind and the close crumb |
| `ld_card_piemash.png` | One white plate with a beef pie, a swipe of mash and green liquor running over both |
| `ld_card_chippy.png` | One piece of battered fried fish with a heap of thick hand-cut chips, on a fold of plain paper |
| `ld_card_breakfast.png` | Two curled rashers of back bacon and one disc of black pudding beside a tin mug of dark tea |
| `ld_card_lascar.png` | One enamel bowl of fish curry with whole green chillies on it, beside a small heap of ground spice |
| `ld_card_hopkitchen.png` | One enamel plate of mutton and barley stew, beside a small bunch of green hop cones |
| `ld_card_dairy.png` | One cut wedge of white crumbling Wensleydale showing the cloth-bound rind and the open crumb |
| `ld_card_pasty.png` | One whole pasty crimped along the side, with a second broken open beside it showing beef, potato and swede |
| `ld_card_cockles.png` | One paper cone of boiled cockles beside a spoonful of dark laverbread rolled in oatmeal |
| `ld_card_smokehouse.png` | One pair of Arbroath smokies tied by the tails, copper-skinned, with one opened to show the flakes |
| `ld_card_distillery.png` | One plain glass of whisky beside a small heap of green malted barley with rootlets showing |

## Part E: acceptance check

Accept a picture only when every line is true. Reject and regenerate; do not repair a wrong picture with an overlay or a crop.

- Style matches the reference set: painted, not photographic, not cartoon
- Every person wears the 1880 to 1914 working clothes of the profiles above, and people vary in age, height, build, skin, hair, face, occupation and gesture
- Food is accurate to its room brief, realistic, and large enough to read on a phone
- The scene is complete and physically possible: supports, hands with the right number of fingers, utensils, and every pouring vessel has its lip toward the receiver with the liquid falling under gravity
- **The empty hook is empty**, and the wall or sky behind it is plain, evenly lit and different in tone from the sprite that will hang there
- **Every hot vessel is open** and every pour shows a clear lip, a visible stream and a clear landing surface
- **The dairy has no steam, no fire and no hot process anywhere in it**
- The three discovery subjects are visible and unobstructed in both orientations, and in the portrait file all three are inside the middle 80 per cent of the width
- Each painting has one clean sky, lamp, fire or open door with nothing crossing it
- No text, lettering, chalkboard, price ticket, readable newsprint, border, marker, collage, blur, plastic, stainless steel, cardboard or electric light
- The file is exactly 1672 x 941 or 941 x 1672 for rooms, and carries the exact name from this brief

## Part F: generation order and completion

Session 1: `ld00_concept.png`. Stop and review it.

Session 2, with the approved concept attached as well: UK01 wide, UK01 portrait, then each room in numerical order through UK13, then the six sprites, then the thirteen cards. After each pair, check food accuracy, style consistency, hands and utensils, supported furniture, readable subjects, the empty hook, the open vessels and the portrait framing before moving on. If a limit interrupts the set, list the completed and remaining file names exactly and resume from that list.

Completion: 1 + 26 + 6 + 13 = **46 files** exist in `~/Downloads/additional game asset/london/`, each inspected, plus the inventory and the notes below.

## Part G: text notes to deliver with the files

For the concept: where each neighbourhood and landmark sits.

For each room pair:

- The signature action and the working area that supports it, described for the wide and the portrait file separately
- **Where the empty hook is in each file**, and what is behind it
- **Every hot vessel in the picture and whether its surface is open**, listed for each file, and every pour with its lip and its landing surface named
- The three discovery subjects and where they appear in each file, with a note confirming that in the portrait file all three sit inside the middle 80 per cent of the width
- Which sprite or sprites the room uses, and where each attachment point is in each file
- The actual pixel size of both files

The pictures are static. Do not call them animated because motion is depicted in them. The application adds steam, smoke, light, fire, birds, rain, liquid glints and the swing of the sprites in code, and adds the small diamond markers over the discovery subjects. Do not invent a discovery for a food that failed to appear clearly; report it instead so the pair can be regenerated.
