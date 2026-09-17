# Italy: the image brief

This is the Stage A deliverable for the Italy world — the three areas `rome`, `venice` and `sicily` on one table. It was written from the [art direction](art-direction.md), the [Italy research](italy-research.md) and the lead's decisions in [italy-world.md](italy-world.md).

## How to use this brief

1. Drop every delivered file into `~/Downloads/additional game asset/italy/` with the exact file names below. The import script reads that folder.
2. Attach the reference set to every generation request. The files are in the repository: `public/scenes/hotpot/wide.jpg` (light, density, food), `public/scenes/tr_simit/wide.jpg` (clothing and street life), `public/scenes/tr_simit/portrait.jpg` (portrait composition), `public/scenes/props/red-lantern.webp` and `public/scenes/props/chilli-hanging.webp` (sprites). Spain's delivered rooms in `public/scenes/es_*/` are also in the repository and are the closest match for Mediterranean light, interior warmth and food scale.
3. Generate in two sessions. Session 1 is the concept image only. Look at it against section 1.6 of the research and the acceptance check; regenerate until it passes. Session 2 attaches the approved concept as well and generates the rooms, the sprites and the cards in the order in Part F.
4. Copy everything below the divider into the image tool. The playbook names Gemini through the `ce-gemini-imagegen` skill or GPT-Image-2.5 in ChatGPT with the reference images attached; both accept reference images.
5. Deliver a text inventory with the files: file name, actual pixel size, and the motion and discovery notes asked for in Part G.

Budget: **46 images.** One concept, thirteen wide rooms, thirteen portrait rooms, six motion sprites, thirteen card illustrations. Britain was 46, Thailand 43, Spain 42.

| Part | Files | Count |
| --- | --- | --- |
| A | `it00_concept.png` | 1 |
| B | `it01_trattoria_wide.png` to `it13_tonnara_portrait.png` | 26 |
| C | `it_motion_*.png` | 6 |
| D | `it_card_*.png` | 13 |

### The six rules that came out of China and Spain

These are written into every room prompt below and they are the six things that were most expensive to fix afterwards. They are repeated here so the reviewer can check them in one place.

- **(a) Anything meant to move hangs from an empty hook.** Any hanging object that the application will swing — a salami, a braid of garlic, an awning valance, a lamp on a chain, a cane of drying pasta, a bunch of herbs — is delivered as its **own keyed sprite on pure white** and the room painting shows only its **hook, bracket, chain end, nail, rail or beam, with nothing hanging from it**. Cutting a moving object out of a finished painting is forbidden: Spain's pepper strings were colour-keyed off warm walls, took the wall with them, and swung with a visible cut edge and a repaired hole behind them. Where a painting also carries a *still* hanging object that is never going to move, that is fine and welcome; it must simply be somewhere other than the empty hook.
- **(b) Open surfaces and visible streams.** Every hot vessel that should steam is pictured with an **open surface**: a lidless pot, a cup with nothing over it, a pan with the lid lifted and resting beside it, an open oven mouth. Nothing hot is shown sealed or under glass. Every poured liquid shows **a clear lip, a clear landing surface, and a visible unbroken stream between them**: the spout or rim it leaves, the free thread in the air, and the exact surface it lands on. The application traces its glint from the lip to the landing, and Spain's cider glint ran on the glass of the bottle above the lip because the painting did not make the lip clear.
- **(c) Portrait compositions keep everything that matters inside the middle 80 per cent of the width.** A phone shows only about **x .094 to .906** of the frame after the fit. Every discovery subject, every signature action, every empty hook and every face that carries the room must sit inside that band in the portrait file. Outside it, put wall, sky, floor, steam and background only.
- **(d) Plain walls behind hanging things.** The wall, sky or stonework directly behind every empty hook and behind every still hanging object is **plain, evenly lit and clearly different in tone from what will hang there** — no pattern, no tile grid, no other object, no face, no strong sunlight and no deep shadow across it. **This is the hazard of this particular world: ochre render is Rome's own colour and salami, garlic braids and canvas awnings are all warm**, so put every empty hook against lime wash, grey stone, dark timber or plain sky and never against warm ochre plaster. No colour key will be needed now and none should ever be needed again.
- **(e) No text, nothing modern, hands and food correct.** No lettering of any kind anywhere: no shop fascias with words, no chalkboards, no menus, no wine labels, no price tickets, no signwriting, no captions, no watermarks. Every person is in the 1880–1914 working clothes of Part "the period and the people". No plastic, no stainless steel, no electric light, no printed packaging, no cardboard, no modern glassware, no wristwatches, no zips, no Vespa, no motor boat, no three-wheeler. Faces and hands are anatomically correct with the right number of fingers; food is the right way up, the right scale against the hands that hold it, and the right dish for its room.
- **(f) Two natural motion cues besides the signature.** Each painting carries **one clean sky, one clean lamp or fire, or one open door or window with light coming through it** — an area with nothing crossing it — so the application has at least two natural cues besides the room's signature action. A sky with a bird in it already painted is not a substitute; leave the sky empty.

---

## Task and reference authority

Create a production-quality illustrated asset set for the Italy world of Food World, an explorable world where food reveals how people live. This Italy compresses three regions into six neighbourhoods on one table: Rome and its Campagna, Venice and its lagoon, and Sicily. Every picture shows one clear regional setting. Do not stack every region, landmark or dish into one view, and do not put a Roman dish in a Venetian room.

Use the attached reference paintings as the authority for brushwork, texture, light, character rendering and level of detail. The style is painterly illustrated realism between a photograph and a cartoon: visible brushwork on plaster, stone, brick, cloth, timber and marble; one light-source logic per picture; real body, hand, furniture and building proportions with faces that may be softened and eyes slightly enlarged as in the references; rich, saturated but natural colour; depth in three planes with food in the foreground, people and work in the middle and the place behind; complete scenes where every seat, table, shelf and hook holds what rests on it — except the one empty hook each room is asked for in rule (a).

Rejected in every picture: photorealism or photo compositing; a rendered 3D look with plastic highlights; flat vector shapes, thick outlines, cel shading, chibi proportions or mascot faces; blurred or smeared regions; any text, readable menus, labelled bottles, signs with words, captions, filenames, watermarks, borders or checkerboards; contact sheets, collages, split panels or before-and-after frames; interface elements of any kind, meaning no arrows, rings, diamonds, markers or labels. The application adds its own markers afterwards over the actual subjects.

The Turkey reference paintings show the clothing standard. The hotpot reference shows light, density and food; ignore its present-day clothes.

**The light is the world's whole look and it splits three ways.** Rome is warm and dusty: ochre render, travertine, basalt setts wet from a hose, and interiors lit by a wood fire or an oil lamp against a bright doorway. Venice is cool, silver and damp: grey-green water throwing light up onto Istrian stone, low sun, and interiors lit by one small window and one lamp. Sicily is hard and high: white light, black shadows, dust, canvas awnings and the glare off a wet marble slab. Three rooms in this set are warm and dim — the trattoria, the forno, the Veneto kitchen — and three are bright and hard-shadowed — the Pescaria, Ballarò, the tonnara. Paint that difference; do not give the whole set one Tuscan-postcard golden hour.

**This is a poor country.** In these decades more than thirteen million people left Italy. Except in the pasticceria and on the market stalls, plenty must be earned by the room: a working farm, a trade, a feast day. Do not paint abundance everywhere.

## The period and the people

Every person in every picture wears the everyday working clothes of Italy between about **1880 and 1914** — the decades after unification, when Artusi's book of 1891 first gathered the regions into one kitchen. This is one recorded period band for the whole world. Working clothes, not costume: no opera or carnival dress, no gondolier's striped jersey and straw boater, no "ciociara" laced bodice and striped apron on every Roman woman, no Godfather suits and no *coppola* on everyone in Sicily, and nothing modern at all.

**A warning the generator must read.** The research could not verify, from any museum or archive description, what Roman, Venetian or Sicilian working men and women actually wore in this band. The profiles below are the researcher's best reading of generic late-nineteenth-century Italian working dress and are **not a verified garment list**. Keep them plain, keep them poor, keep them patched, and avoid every regional "costume" that a search would return.

| Profile | Garments | Who wears it | Where |
| --- | --- | --- | --- |
| Roman market woman | Long dark or faded printed skirt to the ankle, a plain bodice or blouse with the sleeves pushed up, a coarse apron over it, a folded cloth over the head or knotted at the nape, hair pinned, wooden clogs or worn leather shoes | Stallholder, herb seller, ricotta carrier, cook | The piazza, Campo de' Fiori |
| Roman working man | Collarless shirt with no tie, waistcoat, heavy trousers with a belt or sash, a neckerchief, a soft felt hat or a cloth cap, hobnailed boots, a leather apron for the carter and the vaccinaro | Carter, porter, vaccinaro, baker, oste | Testaccio, the piazza, the river |
| Counter worker | White shirt with the sleeves rolled, a dark waistcoat, a long apron tied at the waist, often a towel over the shoulder; the woman behind a counter in a dark dress with a white apron and cuffs | Oste, fornaio, pastaio, caffettiere, pasticcere | Every counter in the set |
| Campagna shepherd and dairy woman | The man in fustian or corduroy with leggings or gaiters bound below the knee, a sheepskin over the shoulders in cold, a soft hat and a crook; the woman in a dark skirt, a sacking apron and a headcloth, sleeves rolled to the elbow | Shepherd, dairywoman, olive picker, carrettiere a vino | The Agro Romano |
| Lagoon fisherman and boatman | Dark trousers rolled to the calf, a knitted or coarse woollen jersey, a jacket over it in cold, a soft cloth cap or a folded kerchief, bare feet or clogs in the boat, oilskin only in weather | Moecante, fishmonger, ferryman, valle keeper | Burano, the Rialto, the valli |
| Venetian working woman | Dark skirt, a fitted bodice or blouse, a fringed shawl crossed over the chest, a plain headscarf, a black shawl over the head for the older women, clogs on wet stone | Fishwife, lacemaker, polenta cook, farm woman | The Rialto, Burano, the terraferma |
| Palermo street vendor and carter | Loose shirt open at the neck, a waistcoat, a wide sash at the waist, trousers to the calf, a cloth cap, a long oiled apron for the fryer, bare feet or sandals, a knife at the belt for the meusaro | Meusaro, friggitore, fishmonger, carter, fisherman | The Albergheria, Ballarò, the tonnara |
| Sicilian countrywoman and market woman | A long dark skirt and a plain blouse with a coarse apron, a large folded cloth on the head against the sun, often carrying a basket or a jar on it, a shawl in winter, bare feet or rope soles | Market seller, almond and caper picker, wife of a tonnaroto | Ballarò, the groves, the coast |

Children appear in the outdoor rooms in short trousers, patched dresses and bare feet, carrying and fetching; in the friggitoria and at Ballarò they are customers as much as anyone. Monks and priests appear only in the background and only where a feast day makes them right. Vary age, height, build, skin, hair, face, occupation and gesture in every picture. Children take small steps; elders lean a little. People cook, carry, choose, serve, pour, share and talk. Nobody poses for the viewer. Show four to eight readable people in a room, with smaller background figures only where they help.

## Palette

| Name | Hex | Use |
| --- | --- | --- |
| romanOchre | #C98A3E | Roman render, piazza fronts, street walls, the forno's face |
| travertine | #E3D9C2 | Travertine, the Pantheon and the Colosseum, kerbs, church fronts, aprons |
| sanpietrino | #5A5A57 | Basalt setts, paving, wet stone, the market's cobbles |
| terracotta | #A9522F | Roof pantiles, pots, brick, the casale's tiles, the oven's throat |
| pineGreen | #38503A | Umbrella pine, cypress, shutters, the wine cart's body, olive shade |
| campagnaStraw | #BCA96A | Dry Agro Romano grass, straw, durum wheat, baskets, hay |
| venetianRed | #8E3B2F | Venetian house render, bàcaro benches, Burano doors, the carretto's ground |
| istrianStone | #D9D6CB | Istrian stone quoins and sills, the Rialto, the Pescaria columns, marble slabs |
| lagoonGreen | #4E6E6B | The lagoon, canal water, the valli, wet fondamente |
| adriaticBlue | #2F5A70 | The open Adriatic and the Tyrrhenian, the strait, deeper water |
| palermoTufa | #D7B98A | Palermo's soft yellow building stone, Albergheria walls, sfincione crust |
| etnaBasalt | #3A3733 | Lava stone, Etna's flanks, Bronte's soil, kerbstones, the tonnara's shadow |

## Part A: the concept image

File: `it00_concept.png`. One image, wide, at the largest native size available. No exact size is required for this picture; it is a spatial blueprint, not a room.

Paint the whole imagined Italy as one wooden-table diorama seen from a high three-quarter angle, in clear Mediterranean daylight with the sun from the south-west. It is **a peninsula with an island**: one continuous sea reaches the table edge on three sides and is square where it meets it. Six named neighbourhoods, one river reaching the sea below Rome, a shallow lagoon behind a barrier in the north-east, a strait in the south-west with no bridge over it, open country between the neighbourhoods, landmarks kept behind the food places and smaller than their neighbourhood.

1. **Rome: the piazza** (centre-west, the visual centre of the table). An irregular cobbled square of ochre and sienna houses with green shutters and pantile roofs; a market of canvas-shaded trestles filling it, produce spilling onto the stones; a standing bronze statue in the middle; a wood-fired bakery with its oven mouth open to the street; a small pasta workshop with canes of drying ribbons at the window; a caffè with two tables outside; behind and smaller, a domed classical temple and a great broken oval of travertine arches.
2. **Testaccio and the Agro Romano** (west of 1, running out of the city). A river with a stone embankment and a working quay; a long low slaughterhouse with an iron hook rail under its eaves and a trattoria on the corner opposite; then the walls end and dry straw-coloured country begins — a whitewashed farmstead with a stone olive mill and a press, a fold of sheep, a vine row, artichoke beds in ridges, a chestnut wood on the skyline, and a hooded two-wheeled wine cart on the road with a mule in the shafts.
3. **Venice: the Rialto** (north-east, standing in water). Four or five low island quays of pale stone and red render, packed with tall narrow houses; a single-arched stone bridge with shops along its deck; an open-sided market colonnade along the water with marble slabs under it; a bell tower behind, smaller than the market; mooring poles leaning in the water, flat black boats tied to them, and no road anywhere.
4. **The lagoon and the terraferma** (west and north of 3). Shallow green water with mud banks showing; a low island of small brightly rendered houses right at the water's edge with nets and floating crab cages; walled fish enclosures further out; and behind it, on land, a flat green plain with a farm of low buildings round a yard, flooded rice fields in bunded squares, a maize field and a water channel.
5. **Palermo: the Albergheria** (south-west, on the island). A dense quarter of soft yellow stone, flat and balconied, with narrow lanes; a market running the length of one lane under patched canvas awnings on cane frames, with crates, baskets and hanging scales; a fry stall with a pan over coals on the corner; a pastry shop with a marble counter; and a painted mule cart standing in the lane.
6. **The tonnara coast and Etna** (south-east, the same island). A rocky shore with a long low stone tuna works and a courtyard of drying racks, with big black nets spread and moored boats offshore; a terraced lemon grove behind it with a water tank; almond trees on drier ground; caper terraces on a broken slope; a great field of ripe durum on a low hill with one lone estate house on it; and far behind, smaller than everything, a snow-topped volcano with a thin plume.

Transitions: between 1 and 2 the houses thin out past a gate and the green goes to straw. Between 2 and 3 the coast runs north-east and the land flattens into marsh and then into water. Between 3 and 4 the stone quays give way to mud banks and then to a flat farmed plain. Between 4 and 5 the peninsula runs south down a spine of hills to a narrow strait. Between 5 and 6 the town stops at the last lane and the ground rises into terraces, groves and then bare wheat. Between 6 and 1 the sea runs north again up the western coast.

Water: one continuous sea round the peninsula and the island, square where it meets the table edge. One lagoon inside a barrier at 3 and 4, shallower and greener than the sea. One river rising in the central hills and reaching the sea below 2. One strait between the mainland toe and the island, with a boat on it and **no bridge**. Nothing stands in water except the bridges, the mooring poles, the boats and the lagoon houses built on piles to stand in it.

No interface elements, no labels, no text. Deliver a short text note naming where each of the six neighbourhoods and the six landmarks sit in the picture.

## Part B: the thirteen room pairs

### Rules for every room pair

1. Two independently composed paintings per room. Wide is exactly **1672 x 941** pixels. Portrait is exactly **941 x 1672** pixels. Do not crop, stretch or upscale one to make the other. Report the delivered pixel size of every file in the inventory. A file at any other size is rejected.
2. One complete environment per image: no collages, contact sheets, split views, miniatures or panels.
3. The same place, food, palette and main characters in both orientations. Wide reveals the work surface and the place. Portrait stacks food, worker and place vertically and is recomposed, not squeezed.
4. A human-height or slightly elevated three-quarter view. The main food occupies a substantial, readable part of the foreground in both orientations, with texture that reads at phone scale: the crumb of a loaf, the cut face of a cheese, the grain of an oxtail, the sheen on a fried square, the silver of a sardine, the bloom on a ripe fig.
5. The three discovery subjects are visible, distinct and unobstructed in **both** orientations, with breathing room around them, never hidden behind hands, table edges, steam or decoration. **In the portrait file all three sit inside the middle 80 per cent of the width** (rule c).
6. Four to eight readable people from the profiles above, varied in every way listed, doing the work of the room.
7. The painting is complete without sprites: its furniture, utensils, food, people, buildings and plants are all in it. Every seat and work surface supports what rests on it. Every hand holds something plausibly.
8. **Each room carries one empty hook, bracket, chain end, nail, rail or beam** where the brief names one, with a plain, evenly lit wall or sky behind it that is clearly different in tone from the object that will hang there (rules a and d). Nothing hangs from it. Do not put a face, a pattern, a shelf, a window, a shaft of sunlight or **warm ochre plaster** behind it.
9. **Every hot vessel is open**: no lid, or the lid lifted and resting beside the pot. **Every pour shows lip, stream and landing** (rule b).
10. Each painting carries one clean open sky, one clean lamp or fire, or one open door or window with light through it, with nothing crossing it (rule f).
11. Cold food and cold rooms show **no steam at all**. The casale in particular has no hot process in it and must show none, and half of Venice is cold.
12. No text, labels, markers, arrows, rings, borders, watermarks, captions, chalkboards, price tickets, wine labels or invented lettering anywhere in the art (rule e).

Vessels, tools and stock belong to the period: earthenware, copper, tinned iron, enamelled iron, brass, wood, cast iron, glass, marble, cloth, paper, straw, cane and sacking. No plastic, no stainless steel, no electric light, no printed packaging, no cardboard boxes, no aluminium.

### IT01 The trattoria

Files: `it01_trattoria_wide.png`, `it01_trattoria_portrait.png`
Room id `it_trattoria`, folder `public/scenes/it_trattoria/`, opens from the object `ragu`.

- Place: a family trattoria in Testaccio at one in the afternoon, a room of eight tables with plain marble tops on iron legs, bentwood and rush-seated chairs, a lime-washed wall going yellow with smoke, a dark timber dado, a plain wooden counter with a marble slab, a wood range at the back with a low fire and a black iron pot on it, terracotta floor tiles, a narrow street door standing open onto basalt setts with the slaughterhouse wall opposite.
- Food: on the range, an **open earthenware pot of oxtail** stewing dark with celery sticks standing up in it and a wooden spoon resting across; on a serving table, a deep dish of **tripe in tomato with a heavy fall of grated sheep's cheese and a sprig of wild mint**; a shallow bowl of **thick pasta strings turned in pecorino and pepper**, the cheese still visible and unmelted at the edge; a plate of small grilled lamb chops; a whole pecorino with a wedge cut out of it and a black-handled knife beside it; a basket of coarse bread; a plate of raw broad beans in the pod. Wine is in **plain glass carafes with a raised ring on the neck**, poured into thick tumblers. **No bottle with a label, no red-check cloth, no candle in a raffia flask.**
- Wide: the range with the oxtail pot at one end, two tables of eaters, the counter and the open door at the other. Portrait: the pasta bowl and the cheese in the foreground, the oste pouring above them, the pot and the fire behind, the doorway and the wall at the top — all inside the middle 80 per cent of the width.
- Discovery subjects: the open oxtail pot on the fire; the bowl of cheese-and-pepper pasta; the cut pecorino with its knife.
- Signature motion area: **wine poured from the ringed glass carafe into a thick tumbler standing on the marble** — the carafe tilted, a clear lip at its rim, a visible unbroken thread and a clear landing surface in the glass, with nothing crossing the thread and the tumbler on the table rather than in a hand.
- Empty hook: **a plain iron hook or nail in the dark timber beam over the counter**, with nothing on it, plain lime-washed plaster behind it — **not ochre**. Do not paint a hanging salami there; if cured meat is wanted it goes on a second hook well away, and stays still.
- Open area for cue (f): the low fire in the open range.
- Steam: the oxtail pot, the tripe dish and the pasta bowl are all open and all steam. The cheese, the bread, the raw beans and the wine are cold and show none.
- Sprite: `it_motion_salumi.png`.

### IT02 The market

Files: `it02_market_wide.png`, `it02_market_portrait.png`
Room id `it_market`, folder `public/scenes/it_market/`, opens from the object `romeMarket`.

- Place: Campo de' Fiori on a bright cold morning. An irregular cobbled square of basalt setts, ringed by ochre and sienna houses with green louvred shutters and pantile eaves; trestle stalls under plain off-white canvas on cane frames; wooden crates, wicker baskets and a brass hand balance with iron weights; cabbage leaves and artichoke trimmings underfoot; a standing bronze figure in a hooded cloak on a plinth in the middle of the square, behind the stalls and smaller than them; a fountain trough at one side. Grey-blue winter light with one warm shaft between the houses.
- Food: a stall of **artichokes — round, flat-topped, spineless heads with long stalks, piled in a pyramid, with one being turned against a small knife and its outer leaves falling into a basin of lemon water**; beside it **puntarelle** being split into curls and dropped into a bucket of cold water; a crate of the pale green spiralled **romanesco broccoli**; **courgette flowers** in a shallow tray; a marble slab with **sheep's ricotta in drained rush baskets** and a cut wheel of pecorino; strings of garlic and onions on a second stall; olives in earthenware crocks; a bucket of salted anchovies. Seasonal and plain: no pineapple, no banana, no out-of-season tomatoes piled high.
- Wide: the aisle with two stalls and the fountain, the statue and the house fronts behind. Portrait: the artichoke pyramid and the knife in the foreground, the stallholder above, the awning and the house fronts at the top, all inside the middle 80 per cent of the width.
- Discovery subjects: the pyramid of artichokes with the one being trimmed; the ricotta in its drained basket on the marble; the brass balance with its weights.
- Signature motion area: **an artichoke turned against the knife with a spiral of outer leaves falling away from it into the basin** — a clear, tight working area with the whole head, both hands and the falling leaves visible and no one crossing in front.
- Empty hook: **a plain iron S-hook on the wooden rail at the front of one stall, with nothing on it**, plain grey canvas behind it. The garlic and onion strings on the other stall are the still, painted ones and belong well away from it.
- Open area for cue (f): a clean band of pale sky above the house fronts with nothing in it.
- Steam: nothing here is hot. One tin can of coffee on a corner of a stall may steam; the breath of the sellers in the cold air may show. Every vegetable, every cheese and the water in the basins are cold and dry.
- Sprite: `it_motion_awning.png`.

### IT03 The pasta kitchen

Files: `it03_pasta_wide.png`, `it03_pasta_portrait.png`
Room id `it_pasta`, folder `public/scenes/it_pasta/`, opens from the object `pasta`.

- Place: a small ground-floor workshop off the piazza, one room with a barrel-vaulted plastered ceiling, a scrubbed elm board on trestles taking up half of it, a flour bin, a marble slab, a small window high in the wall throwing one hard shaft of light with flour turning in it, a copper of water on a small range at the back, and a plank door open to a narrow lane. Two women at the board, an older one watching, a boy carrying a tray.
- Food: a **great thin round sheet of soft-wheat dough** lying over the board, half of it folded over on itself in a loose roll; a **long thin wooden rolling pin** at least a metre long lying beside it; a knife cutting the roll across into ribbons; a nest of cut ribbons lifted and shaken loose, dusted white; a **guitar frame of strung wires** with a square-cut dough sheet on it at the end of the board; a heap of semolina and a heap of soft flour in two shallow tubs; eggs in a bowl with one broken into a well in a flour heap; and against the wall a crate of **long dried yellow maccheroni in paper bands**. **No pasta machine with a crank and rollers, no plastic, no printed packet.**
- Wide: the board's whole length with the sheet, the pin and the cutting, the range behind, the door at the end. Portrait: the cut ribbons being lifted in the foreground, the hands and the knife above them, the shaft of light and the vault at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the folded sheet under the knife; the nest of lifted ribbons; the guitar frame with its strung wires.
- Signature motion area: the **roll of dough cut across and one nest of ribbons lifted and shaken loose**, with flour lifting off it — a clear, tight area with the whole roll, the knife, both hands and the falling ribbons visible.
- Empty hook: **a plain bare wooden cane laid horizontally between two brackets on the plain plastered wall, with nothing over it**, lime-washed plaster behind it, not ochre. Do not hang pasta on it.
- Open area for cue (f): the shaft of light from the high window with flour turning in it.
- Steam: the open copper of water on the range steams. The dough, the flour, the eggs and the dried pasta are all cold and dry.
- Sprite: `it_motion_pasta_cane.png`.

### IT04 The forno

Files: `it04_forno_wide.png`, `it04_forno_portrait.png`
Room id `it_forno`, folder `public/scenes/it_forno/`, opens from the object `oven`.

- Place: a bakery on a lane off the piazza, before seven in the morning. A **brick dome oven built into the thickness of the wall with its mouth open and the floor of it glowing**, a low iron door swung back against the brick, a heap of split oak and a long iron rake beside it; a **wooden peel four or five feet long**; a marble counter worn hollow; wooden proving boards on racks; a plastered wall blackened above the oven mouth; a small barred window; the door open to a lane in blue shadow with one strip of early sun on the opposite wall. A baker at the peel, a woman at the counter, two customers, a child.
- Food: a **long flat white pizza — a sheet of dough pulled thin, dimpled, oiled and salted, blistered and blond, well over a metre long — coming out on the peel**; a second, red one under crushed tomato, already cut across with shears on the counter; **big round loaves with thick dark crusts** on the racks, one cut open to show an open crumb; a tray of soft split buns; a lattice tart of white ricotta with dark cherries. No round individual pizza with mozzarella discs and basil leaves in this room — that is Naples' pizza and it is named on the card, not painted here.
- Wide: the oven mouth with the peel entering it, the counter with the cut red pizza, the door and the lane. Portrait: the long white pizza on the peel in the foreground, the baker above it, the glowing oven mouth and the black wall at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the long white pizza on the peel; the open oven mouth with its glowing floor; the cut loaf showing its crumb.
- Signature motion area: the **peel drawn out of the oven mouth with the long white pizza riding on it and tipping forward onto the counter**, in a clear area with the whole peel, the whole sheet and the mouth all visible and no hand crossing them.
- Empty hook: **a plain iron hook on the plain plastered wall beside the oven, with nothing on it**, the plaster behind it grey-white and evenly lit, not ochre and not blackened.
- Open area for cue (f): the open oven mouth with its glowing floor, and the lane door with the strip of early sun.
- Steam: the pizza coming out, the cut loaf and the oven mouth all carry heat — steam off the bread and shimmer at the mouth. The uncooked dough on the boards and the tart are cool and show none.
- Sprite: none.

### IT05 The casale

Files: `it05_casale_wide.png`, `it05_casale_portrait.png`
Room id `it_casale`, folder `public/scenes/it_casale/`, opens from the object `cheese`.

- Place: the working room of a farmstead in the Agro Romano, morning. Thick lime-washed rubble walls, a beamed ceiling, a worn stone floor with a drain channel cut in it, a small deep window, and a plank door standing open onto a dusty yard with a fold of sheep, a stone olive mill with its upright wheel, a vine on a frame and straw-coloured country running flat to a low hill. Cool, quiet and much darker than the yard. Two women working, an old man in the doorway, a girl carrying a pail.
- Food: a wide copper vat of **set curd being cut into cubes with a long-bladed curd knife**; curd draining on a **slatted wooden table with whey running off its lip in a thin steady thread into a pail on the floor**; a cloth-lined wooden hoop under a **wooden screw press**; finished pale wheels on a slate shelf, one cut open to show a close white paste; a rush basket of soft fresh ricotta; a big earthenware jar of green olive oil with a wooden funnel in its neck; a demijohn of pale wine in a wicker case; a basket of raw broad beans in the pod.
- Wide: the vat and the draining table with the press behind them, the slate shelf, the open door with the sheep and the mill beyond. Portrait: the cut curd and the running whey in the foreground, the press above, the open door and the flat country at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the cut curd in the vat; the whey running off the draining table into the pail; the cut wheel on the slate shelf.
- Signature motion area: the **whey running off the lip of the draining table into the pail** — a clear lip, a visible unbroken thread and a clear landing on the surface of the whey already in the pail. Paint it as a liquid running, not as drips scattered down the table leg.
- **This room is cold. No fire, no steam, no boiling, nothing hot anywhere in it.** There is no copper over a flame, no kettle and no range. Spain's cheese farm was delivered with a copper cauldron that had no fire under it, the application steamed it anyway, and the owner read the room's own text and asked why. The liquid here runs; it does not rise.
- Empty hook: **a plain wooden peg driven into the lime-washed wall beside the door, with nothing on it**, plain lime wash behind it. Cloths and a cheese sling hanging elsewhere in the room are fine and should be still.
- Open area for cue (f): the open door with hard daylight falling across the stone floor, nothing crossing it.
- Sprite: `it_motion_garlic_braid.png`.

### IT06 The Rialto fish market

Files: `it06_pescaria_wide.png`, `it06_pescaria_portrait.png`
Room id `it_pescaria`, folder `public/scenes/it_pescaria/`, opens from the object `seafood`.

- Place: the open fish market on the Grand Canal at the Rialto, first light. **This is the market before the famous building.** From 1884 the Pescaria was a **plain open iron canopy on slender cast-iron columns**, built by the municipal engineer Annibale Forcellini — a flat or shallow-pitched roof of iron plate on riveted trusses, no walls, no arches and no carving. Do **not** paint the neo-Gothic stone loggia with its carved capitals: that was designed from 1896, approved in 1900 and opened only in 1907 or 1908, at the very end of this band, and it is named on the card instead. Under the canopy, long **wet marble slabs** on iron trestles; the canal immediately beyond, grey-green and moving, with **leaning striped mooring poles** and two flat black boats tied up and being unloaded; a stone quay edge with worn steps down into the water; tall red and cream house fronts across the canal in low silver light; wet stone underfoot with water running off it. Cold, damp, bright-grey light with no sun. Three fishwives, a porter with a basket on his shoulder, two buyers with bags, a boy sluicing the stone.
- Food: on the nearest slab, **a wide shallow basket of sardines being tipped out along the marble in a silver slide**; beside them, **small green crabs in a low wooden box, alive, with wet weed on them**; **cuttlefish, whole, with the ink sac showing dark through the flesh**; a **spider crab on its back with its legs folded**; grey shrimps in a heap the size of a fist; eels coiled in a shallow tub of water; a flat basket of tiny silver fish; a wooden tub of crushed lagoon ice. No tropical fish, no salmon fillet, no polystyrene, no plastic crate.
- Wide: the slabs running away under the iron canopy, the water and the boats on the open side, the house fronts across the canal. Portrait: the sardines sliding across the marble in the foreground, the fishwife above them, the iron columns and the far houses at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the sardines spilling along the marble; the box of live green crabs; the cuttlefish with its ink sac showing.
- Signature motion area: the **basket tipped and the sardines sliding out along the wet marble and settling**, in a clear area with the basket, the whole slide and the slab visible and no hand crossing it.
- Empty hook: **a plain iron hook on a plain cast-iron column of the canopy, with nothing on it**, plain grey stone or plain grey sky behind it. Do not hang a fish or a scale from it.
- Open area for cue (f): a clean band of pale grey sky over the canal with nothing in it, for the gull.
- Steam: **nothing here is hot.** No steam at all. Raw fish, ice, wet stone and cold water only. The men's breath may show in the cold air.
- Water: the canal is on the open side and **nobody stands in it**; the boats are moored to the poles and the porters are on the stone.
- Sprite: `it_motion_gull.png`.

### IT07 The osteria

Files: `it07_bacaro_wide.png`, `it07_bacaro_portrait.png`
Room id `it_bacaro`, folder `public/scenes/it_bacaro/`, opens from the object `bacaro`. **The id and the file names stay `bacaro`; only the display name is "The osteria", for the reason below.**

- Place: a small dark wine house on a narrow calle, late afternoon. **This is not a modern cicchetti bar and must not be painted as one.** Around 1900 the Venetian word `bacaro` meant cheap Puglian wine and the shop that sold it by the glass; `cicheto` meant a shot of grappa, not a plate; and the counter lined with twenty small dishes is a development of the last twenty years. What is documented is an **osteria**, the one grade of wine house where people both drank and ate. So: one low room, a **worn timber counter**, **two wooden casks on a stillage behind it with brass taps**, a stone floor, dark beams, a bare plastered wall, a narrow doorway open onto a calle with pale stone and one strip of sky above it, and a single oil lamp giving the only warm light in the room. Standing room at the counter and two plain tables with benches. Four or five men standing, one seated pair, the host behind the counter, a woman in a long black fringed shawl at the door.
- Food: **six dishes and no more**, in plain white china and earthenware on the counter and on one table: a bowl of **whipped white salt cod spread on cut fingers of grilled yellow polenta**; a dish of **fried sardines under a heap of pale cooked onions**, glistening; **small whole boiled octopus** dressed with oil and parsley; **strips of boiled calf's knuckle** with onion; **slices of a pale boiled pork sausage** with a mound of grated white horseradish; half a hard-boiled egg with a salted anchovy across it. Wine in **small plain thick glasses filled about half way**, red and white, standing on the counter and on the table. **No row of toothpicks, no long refrigerated glass display, no bright orange drink, no bottle with a label, no blackboard.**
- Wide: the counter's length with the dishes, the casks behind, the men standing, the calle door at the end. Portrait: the salt cod on its polenta in the foreground, the host drawing wine above it, the casks and the lamp at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the whipped salt cod on grilled polenta; the sardines under their onions; the cask with its brass tap and the glass under it.
- Signature motion area: **wine drawn from the cask's brass tap into a small thick glass standing on the counter** — a clear tap lip, a visible falling stream and a clear landing surface in the glass, nothing crossing the thread, the glass on the wood and not in a hand. The glass is filled about half way: the measure of the period is half a quarter-litre.
- Empty hook: **a plain brass chain hanging from a beam with an empty ring at the end of it**, over a clear part of the counter, with plain grey-white plaster behind and above it.
- Open area for cue (f): the oil lamp on its bracket, unobstructed; and the strip of pale sky in the calle doorway.
- Steam: **nothing here is hot** except the grilled polenta fingers, which are warm and may show a faint wisp. The salt cod, the sardines, the octopus, the knuckle, the sausage, the egg and the wine are all cold and dry.
- Sprite: `it_motion_lamp.png`.

### IT08 The lagoon kitchen

Files: `it08_laguna_wide.png`, `it08_laguna_portrait.png`
Room id `it_laguna`, folder `public/scenes/it_laguna/`, opens from the object `lagunaIt`.

- Place: the ground-floor room of a fisherman's house on Burano, spring morning. A small room with a **brightly rendered wall** — deep red or blue — a low beamed ceiling, a stone floor, a plain table, a small hearth with a black pan on a trivet over a low fire, a shelf of earthenware, oars and a folded net in the corner, and a plank door open straight onto a narrow canal with a flat-bottomed boat tied at the step and low green water beyond it. A woman at the pan, an older woman shelling, a man at the door with an oar, a child on the step.
- Food: a **floating wooden cage lifted half out of the water at the step with small soft green crabs in it**; a shallow bowl of **beaten egg with soft crabs in it, one being lifted out dripping**; the pan with a shallow depth of oil and two crabs already frying; a wide shallow bowl of **grey-white soupy rice** with a wooden spoon standing in it; a plate of **small purple artichokes, cut in half, raw**, with a lemon; a board of yellow polenta cut in slabs; a hard pale ring biscuit on the shelf; a shallow tub of small silver fish.
- Wide: the pan and the table with the canal door open beyond them, the boat and the cage at the step. Portrait: the soft crab being lifted dripping out of the egg in the foreground, the woman above, the open door and the water at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the floating cage of soft crabs at the step; the crab being lifted out of the beaten egg; the raw purple artichokes cut in half.
- Signature motion area: a **soft crab lifted out of the beaten egg with the egg running off it back into the bowl** — a clear lip on the crab, a visible falling thread and a clear landing on the surface of the egg in the bowl, all in one tight, well-lit area.
- Empty hook: **a plain iron nail or peg in the plain painted wall beside the hearth, with nothing on it**, the render behind it flat and evenly lit and clearly different in tone from a braid of garlic. The folded net in the corner is the still, painted one.
- Open area for cue (f): the open door onto the canal with flat green water in it, and the low fire under the pan.
- Steam: the frying pan and the rice bowl are open and steam. The crabs in the cage, the beaten egg, the raw artichokes, the cold polenta and the biscuit are all cold and show none.
- Water: the canal is beyond the step and **nobody stands in it**; the boat is tied and the cage is held at the edge by hand.
- Sprite: `it_motion_gull.png`.

### IT09 The farm kitchen

Files: `it09_veneto_wide.png`, `it09_veneto_portrait.png`
Room id `it_veneto`, folder `public/scenes/it_veneto/`, opens from the object `casaVeneta`.

- Place: the kitchen of a tenant farm on the flat terraferma behind the lagoon, winter evening. One large room dominated by an **open hearth raised off the floor with a wide hood over it and a chain and hook hanging down**; a **big copper pot hanging on the chain over the fire**, wide at the top and narrow at the bottom; a long plain table with benches; a bare brick floor; whitewash gone grey; a small window with a wooden shutter half closed on a flat foggy field; drying maize cobs on a rack. Dim, smoky, and lit almost entirely by the fire. A woman at the pot, an old man on the bench, two children, a young man coming in with wood.
- Food: the copper with **thick yellow maize porridge being turned with a long wooden stick**, the mass folding over on itself; a **scrubbed wooden board on the table with a length of cotton thread lying across it**, ready to cut the turned-out porridge; an earthenware pot of pale beans and broken pasta with a pork bone in it; a black pan of **sliced liver with onions**; a flat salami hanging still on a separate beam; a head of long red chicory split in two; a wedge of hard cheese; a jug of dark wine. **Very little on the table. This is not a feast.**
- Wide: the hearth with the copper and the woman turning it, the table and the bench, the shuttered window. Portrait: the copper and the turning stick in the foreground, the woman above it, the hood and the hanging chain at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the porridge turning in the copper; the board with the cutting thread across it; the split red chicory.
- Signature motion area: the **long stick turning the maize porridge in the copper with the mass folding over on itself**, close and tight, with the whole pot mouth, the stick and both hands visible and the fire below.
- Empty hook: **a second plain iron chain hanging from the hood's beam beside the pot's chain, with an empty S-hook at its end**, plain smoke-greyed plaster behind it. The pot is on the first chain; the second is bare.
- Open area for cue (f): the open fire under the copper.
- Steam: the copper and the bean pot are open and steam, and so does the liver pan. The salami, the chicory, the cheese and the wine are cold.
- Sprite: `it_motion_garlic_braid.png`.

### IT10 The friggitoria

Files: `it10_friggitoria_wide.png`, `it10_friggitoria_portrait.png`
Room id `it_friggitoria`, folder `public/scenes/it_friggitoria/`, opens from the object `friggitoria`.

- Place: a fry shop on a corner of a narrow lane in the Albergheria, Palermo, late morning. A soft yellow stone front with an open arched doorway and no glass; inside, a **wide shallow pan of lard over a charcoal brazier**, a marble slab, a wooden block, a copper pot of boiled offal with a ladle in it, a wire draining rack, baskets of split soft rolls, a stone floor black with use; outside, hard white sun on the lane, a patched canvas awning on cane poles, and two steps where people stand to eat. A fryer at the pan, a man cutting at the block, three customers standing, a child with a roll.
- Food: a **slab of set pale chickpea paste on the marble being cut into squares with a broad knife, with squares already sliding into the lard which lifts and closes over them**; fried squares draining on the rack, deep gold and blistered; **finger-shaped potato croquettes** in a second heap; in the copper, **sliced boiled spleen and lung being lifted out with tongs and shaken over the pan**; **soft round rolls topped with sesame**, split, one being packed; a thick spongy square of oiled dough under onion and breadcrumb on a tray; a lemon cut in half; a skewer of gut wound round a spring onion resting on a small grill. **No modern fryer, no stainless basket, no paper napkin dispenser, no printed wrapper: the paper is plain grey and the roll is held in the hand.**
- Wide: the pan and the marble slab with the block beside them, the arched doorway and the sunlit lane. Portrait: the chickpea squares going into the lard in the foreground, the fryer above, the awning and the hot sky at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the chickpea paste being cut into squares on the marble; the copper of spleen with the tongs in it; the split sesame roll being packed.
- Signature motion area: **squares of chickpea paste sliding off the knife into the lard, which lifts and closes over them**, in a clear area with the slab, the falling squares and the whole fat surface visible and no arm across it.
- Empty hook: **a plain iron hook on the bare stone jamb of the arched doorway, with nothing on it**, plain grey stone behind it, out of the direct sun.
- Open area for cue (f): a clean strip of hard white sky over the lane, with nothing in it; and the coals under the pan.
- Steam: the pan of lard, the copper of offal and the draining fried squares are all hot and open, and the fat surface shows small breaking bubbles. The rolls, the lemon and the raw paste are cold.
- Sprite: `it_motion_awning.png`.

### IT11 Ballarò

Files: `it11_ballaro_wide.png`, `it11_ballaro_portrait.png`
Room id `it_ballaro`, folder `public/scenes/it_ballaro/`, opens from the object `sicilyMarket`.

- Place: the market lane of the Albergheria at midday, full sun. A narrow lane of soft yellow stone houses with iron balconies, roofed over its whole length by **patched off-white and faded red canvas on cane frames**, so the light on the ground is striped and the colour under it is warm; wooden trestles and crates on both sides; a **wet marble slab** on iron legs; a hanging brass scale; a bucket and a wooden pail of water; cobbles running wet. A fishmonger at the slab, a woman shouting her stall with her hand cupped, two shoppers with baskets, a boy with a crate on his head, an old man sitting on a crate.
- Food: on the marble, a **great swordfish laid out whole with its bill, one steak already cut off it and the cut face showing the pale wheel of flesh**, a cleaver standing in the block and a pail of water beside it for throwing over the fish; a crate of **whole sardines packed in circles, silver**; a stall of **aubergines, long pale courgettes, flat beans, celery, wild fennel in a bundle and fat green olives in a crock**; a crate of lemons with the leaves still on; strings of dried tomatoes and a board of dark pressed tomato paste; a basket of small snails; a bunch of whole artichokes with stalks. No blood oranges piled high, no tourist ceramics, no plastic.
- Wide: the lane running away under the awnings with two stalls and the marble slab, the balconies above. Portrait: the swordfish and its cut face in the foreground, the fishmonger above, the striped awning and the balconies at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the cut face of the swordfish; the bundle of wild fennel on the vegetable stall; the board of dark pressed tomato paste.
- Signature motion area: **a pail of water thrown across the swordfish on the marble, running off the slab's edge in a sheet** — a clear lip at the slab edge, a visible fall and a clear landing on the wet cobbles below, all in one open area with nobody crossing it.
- Empty hook: **a plain iron hook hanging from the cane frame of the awning, with nothing on it**, plain canvas behind it. The strings of dried tomatoes are the still, painted ones and belong at the other end of the stall.
- Open area for cue (f): a clean patch of hard white sky where the awning ends, with nothing in it.
- Steam: **nothing here is hot.** Raw fish, raw vegetables, water and stone only. No steam anywhere in this room.
- Sprite: `it_motion_awning.png`.

### IT12 The pasticceria

Files: `it12_pasticceria_wide.png`, `it12_pasticceria_portrait.png`
Room id `it_pasticceria`, folder `public/scenes/it_pasticceria/`, opens from the object `pastry`.

- Place: a small pastry shop in Palermo, early afternoon, cool and dim behind its own doorway with the white glare of the lane outside it. A **marble counter**, a plain painted timber back-counter with open wooden shelves, a mirror, a lamp on a bracket, patterned floor tiles, and at the end of the counter a **wooden tub packed with straw and blocks of ice with brass canisters sunk into it**, one being turned by its crank handle. Two women at the counter, a pastrycook behind it, a child waiting, a man drinking from a glass.
- Food: on the marble, **a row of empty fried pastry tubes, blistered and dark gold**, with one being **filled from a cloth bag with white ricotta and the ends dipped in chopped green pistachio**; a cut wedge of a round cake — white ricotta and sponge under pale green almond paste and candied fruit, showing its layers; a tray of small painted **almond-paste fruits**; a shallow glass of **coarse crushed ice** with a spoon in it and a small plain roll beside it; a jug of white almond milk with a cloth strainer; a plate of dark jasmine-scented set watermelon pudding in cubes; a dish of little fried puffs heaped with ricotta. **No refrigerated glass display case, no pre-filled shells standing in a case, no electric light, no printed box.**
- Wide: the counter's length with the tubes, the cake and the ice tub, the shelves and the doorway glare behind. Portrait: the tube being filled in the foreground, the pastrycook's hands above it, the shelves and the lamp at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the pastry tube being filled with ricotta; the cut wedge of the layered cake; the ice tub with its brass canister and crank.
- Signature motion area: **ricotta piped from the cloth bag into the end of the pastry tube, the filling swelling at the mouth of the shell**, close and tight, with the whole tube, the bag's nozzle and both hands visible and correct.
- Empty hook: **a plain brass chain with an empty ring at its end hanging from the ceiling** over a clear part of the counter, with plain painted plaster behind and above it.
- Open area for cue (f): the oil lamp on its bracket, unobstructed; and the white glare of the doorway.
- Steam: **nothing here is hot.** The ricotta, the ice, the almond milk, the set pudding and the marzipan are all cold; the fried shells are cooled and dry. No steam anywhere in this room.
- Sprite: `it_motion_lamp.png`.

### IT13 The tonnara kitchen

Files: `it13_tonnara_wide.png`, `it13_tonnara_portrait.png`
Room id `it_tonnara`, folder `public/scenes/it_tonnara/`, opens from the object `tonnaraIt`.

- Place: the boiling and packing hall of a tuna works on a low rocky island, afternoon, hard sea light coming in through tall open arches on the seaward side. A long stone building with a high timber roof on iron trusses; **three great copper cauldrons set into a brick bench with fires under them**; a stone floor running with water; long wooden benches; stacks of shallow tin boxes; a barrel of coarse salt and a barrel of oil with a wooden funnel; through the arches, a courtyard with black nets spread on racks and two boats moored beyond. Hot, wet and loud. Two men at the cauldrons, three women at the packing bench, a boy carrying tins.
- Food: a **dark red tuna loin the length of a man's arm being lowered on a hooked pole into the boiling copper, with the surface heaving up round it**; cooked pale pink loins draining on a wooden rack; women **packing pieces into shallow tins and covering them with olive oil poured from a copper jug**; a **pressed dark amber slab of dried roe** on a board with a knife, one thin slice cut off it; a cured tuna sausage hanging still on a separate beam; a heap of coarse grey salt; a shallow tray of small dried fish.
- Wide: the three coppers along the bench with the loin going in, the packing bench beside them, the arches and the sea behind. Portrait: the loin entering the copper in the foreground, the boiler man above it, the roof trusses and the bright arch at the top, inside the middle 80 per cent of the width.
- Discovery subjects: the loin being lowered into the boiling copper; the tin being filled with oil; the pressed slab of dried roe with its cut slice.
- Signature motion area: the **loin lowered into the copper and the surface heaving up and breaking round it**, with the whole pot mouth, the loin and the pole visible, nothing crossing them.
- Second pour, which is the room's other measured cue: the **oil poured from the copper jug into the open tin** — a clear lip at the jug's spout, a visible unbroken thread, and a clear landing on the oil surface already in the tin.
- Empty hook: **a plain empty iron hook on the plain whitewashed pier between two arches, with nothing on it**, the whitewash behind it flat and evenly lit. The cured tuna sausage hanging elsewhere is the still, painted one.
- Open area for cue (f): a clean band of hard blue sky and sea through one open arch, with nothing in it, for the gull.
- Steam: all three coppers are open and boiling and steam heavily; the draining loins steam. The tins, the oil, the salt and the dried roe are cold.
- Water: the sea is beyond the courtyard and **nobody stands in it**; the boats are moored.
- Sprite: `it_motion_gull.png`.

## Part C: motion sprites, exactly six

Generate them after the rooms so colour and rendering match. Each is **one object on pure white**, large on the canvas, fully visible, clean edges, no ground plane, no cast shadow beyond the object, short side at least 400 pixels after trimming. The cutter limits the long side to 960 pixels, so a very long thin subject — the cane of pasta, the awning valance — should be composed closer to square and not stretched out along the canvas, or its short side will fall below 400 after the limit is applied. Do not upscale an undersized subject; regenerate it.

Every one of these is a thing that will swing, and that is why it is here and not in the painting. **Do not paint any of them into the rooms.**

| File | Subject | Attachment | Rooms |
| --- | --- | --- | --- |
| `it_motion_salumi.png` | One cured pork sausage about forty centimetres long — a coarse dark salami in a natural casing tied round with string at intervals, with a **short loop of twine at the top** and the cut end showing its marbled grain | Hangs from a painted empty hook or nail in a beam | IT01 |
| `it_motion_awning.png` | One short length of market awning: a plain off-white canvas valance with a faded red stripe along its lower edge, three shallow scallops, frayed at one corner, with a **straight attachment edge at the top and no poles, frame or rope** | Hangs from a painted empty rail, cane frame or stall bar | IT02, IT10, IT11 |
| `it_motion_pasta_cane.png` | One short wooden cane hung with about twenty nests and ribbons of fresh egg pasta draped over it, pale yellow and floury, the cane horizontal and both its ends clear, composed close to square | Hangs over a painted empty cane or bracket | IT03 |
| `it_motion_garlic_braid.png` | One braid of garlic and small onions about sixty centimetres long, the papery skins white and purple-brown, plaited round their own dried stems, with a **loop at the top**, composed close to square rather than as a long thin strip | Hangs from a painted empty peg or nail | IT05, IT09 |
| `it_motion_gull.png` | One yellow-legged gull in a natural gliding pose, wings and tail fully visible, slight three-quarter side view, pale grey mantle, white body, yellow bill and legs | Crosses painted open sky | IT06, IT08, IT13 |
| `it_motion_lamp.png` | One small brass oil lamp with a clear glass chimney and a shallow shade, **unlit**, hanging from a short length of brass chain with a ring at the top | Hangs from a painted empty chain end or ring | IT07, IT12 |

Do not generate steam, smoke, ripples, bubbles, flour clouds, liquid streams, glows, sparkles, markers, chairs, tables, cups, bowls, plates, buildings, people or alternate poses. The application draws every effect in code.

## Part D: card illustrations, exactly thirteen

One per room. Each shows one food close enough to read its texture, on pure white, no board, plate, knife or hand unless named, no background, short side at least 400 pixels after trimming.

| File | Subject |
| --- | --- |
| `it_card_trattoria.png` | One piece of stewed oxtail with the sauce clinging to it, the bone showing at the cut, beside two short sticks of celery from the pot |
| `it_card_market.png` | Three round flat-topped artichokes with long stalks and a few outer leaves stripped back, showing the pale trimmed heart of one |
| `it_card_pasta.png` | One loose nest of freshly cut egg pasta ribbons, floury, with a few ribbons falling away from it |
| `it_card_forno.png` | One long flat blistered white pizza, dimpled, oiled and salted, folded once across the middle |
| `it_card_casale.png` | One cut wedge of pale sheep's cheese showing its close crumb and dry rind, beside a small mound of fresh white ricotta |
| `it_card_pescaria.png` | Five whole fresh sardines laid overlapping, silver and blue-backed, wet |
| `it_card_bacaro.png` | One finger of grilled yellow polenta with a spoonful of whipped white salt cod on it, beside a small thick glass of red wine |
| `it_card_laguna.png` | Two fried soft-shell crabs, whole, golden and crisp, legs and claws fully visible |
| `it_card_veneto.png` | One thick slab of yellow polenta cut with a thread, beside a spoonful of liver and onions |
| `it_card_friggitoria.png` | One split sesame-topped roll packed with fried chickpea squares, with two loose squares beside it showing their blistered surface |
| `it_card_ballaro.png` | One swordfish steak showing the pale wheel of flesh and the dark line through it, beside a sprig of wild fennel |
| `it_card_pasticceria.png` | One filled pastry tube with white ricotta at both ends and chopped green pistachio pressed into it, beside one small painted marzipan fig |
| `it_card_tonnara.png` | One piece of cooked pale pink tuna loin flaking along its grain, beside three thin slices of dark amber pressed roe |

## Part E: acceptance check

Accept a picture only when every line is true. Reject and regenerate; do not repair a wrong picture with an overlay or a crop.

- Style matches the reference set: painted, not photographic, not cartoon
- Every person wears the 1880 to 1914 working clothes of the profiles above, and people vary in age, height, build, skin, hair, face, occupation and gesture. No carnival mask, no gondolier's stripes and boater, no laced "ciociara" bodice on every Roman woman, no dark-suit Sicily
- Food is accurate to its room brief, realistic, and large enough to read on a phone
- The scene is complete and physically possible: supports, hands with the right number of fingers, utensils, and every pouring vessel has its lip toward the receiver with the liquid falling under gravity
- **The empty hook is empty**, and the wall or sky behind it is plain, evenly lit, different in tone from the sprite that will hang there, and **not warm ochre plaster**
- **Every hot vessel is open** and every pour shows a clear lip, a visible stream and a clear landing surface
- **The casale, the Pescaria, Ballarò and the pasticceria have no steam, no fire and no hot process anywhere in them**, and the market has nothing hot but one coffee can
- The three discovery subjects are visible and unobstructed in both orientations, and in the portrait file all three are inside the middle 80 per cent of the width
- **The signature motion has a clean local area of its own**, with the whole action visible and nothing crossing it, or the room takes its motion from a separate sprite instead
- Each painting has one clean sky, lamp, fire or open door with nothing crossing it
- Rome is warm and dusty, Venice cool and silver, Sicily hard and white: the three are not one golden hour
- No text, lettering, wine label, price ticket, chalkboard, border, marker, collage, blur, plastic, stainless steel, cardboard, aluminium, electric light, Vespa, motor boat or three-wheeler
- **Venice only**: no carnival mask anywhere; no striped jersey or straw boater on a boatman; a gondola's prow comb has **four or five teeth, not six**; no Aperol spritz, no tiramisù, no Bellini and no carpaccio; the fish market is the plain iron canopy, not the neo-Gothic loggia; a powered boat is a squat **steam launch with a funnel**, never a varnished motorboat; street and quay lighting is **gas**, lit by hand with a long rod
- **Rome only**: no carbonara on any table; no Fettuccine Alfredo; no red-and-white checked cloth and no wicker-wrapped flask; the wine is in a plain ringed glass carafe
- **Sicily only**: no dark-suited Godfather imagery; no three-wheeled van; the painted cart is a **working** cart with a load and a mule in the shafts, never a flower-filled ornament; no refrigerated glass pastry case; no blood oranges piled high
- The file is exactly 1672 x 941 or 941 x 1672 for rooms, and carries the exact name from this brief

## Part F: generation order and completion

Session 1: `it00_concept.png`. Stop and review it.

Session 2, with the approved concept attached as well: IT01 wide, IT01 portrait, then each room in numerical order through IT13, then the six sprites, then the thirteen cards. After each pair, check food accuracy, style consistency, hands and utensils, supported furniture, readable subjects, the empty hook, the open vessels and the portrait framing before moving on. If a limit interrupts the set, list the completed and remaining file names exactly and resume from that list.

Completion: 1 + 26 + 6 + 13 = **46 files** exist in `~/Downloads/additional game asset/italy/`, each inspected, plus the inventory and the notes below.

## Part G: text notes to deliver with the files

For the concept: where each neighbourhood and landmark sits.

For each room pair:

- The signature action and the working area that supports it, described for the wide and the portrait file separately
- **Where the empty hook is in each file**, and what is behind it
- **Every vessel in the picture and whether it is hot or cold**, listed for each file, and every pour with its lip and its landing surface named. This world has four rooms with no hot vessel at all, so the cold list matters as much as the hot one
- The three discovery subjects and where they appear in each file, with a note confirming that in the portrait file all three sit inside the middle 80 per cent of the width
- Which sprite or sprites the room uses, and where each attachment point is in each file
- The actual pixel size of both files

The pictures are static. Do not call them animated because motion is depicted in them. The application adds steam, smoke, light, fire, birds, liquid glints and the swing of the sprites in code, and adds the small diamond markers over the discovery subjects. Do not invent a discovery for a food that failed to appear clearly; report it instead so the pair can be regenerated.
