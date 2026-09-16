# Spain: the image brief

This is the Stage A deliverable for the Spain area of the Mediterranean world. It replaces the earlier draft in [examples/spain-scene-generation-prompt.md](examples/spain-scene-generation-prompt.md), which stays as an example only. It was written from the [art direction](art-direction.md), the [Spain research](spain-research.md) and the lead's decisions in [spain-world.md](spain-world.md).

## How to use this brief

1. Drop every delivered file into `~/Downloads/additional game asset/spain/` with the exact file names below. The import script reads that folder.
2. Attach the reference set to every generation request. The files are in the repository: `public/scenes/hotpot/wide.jpg` (light, density, food), `public/scenes/tr_simit/wide.jpg` (clothing and street life), `public/scenes/tr_simit/portrait.jpg` (portrait composition), `public/scenes/props/red-lantern.webp` and `public/scenes/props/chilli-hanging.webp` (sprites).
3. Generate in two sessions. Session 1 is the concept image only. Look at it against section 1.6 of the research and the acceptance check; regenerate until it passes. Session 2 attaches the approved concept as well and generates the rooms, the sprites and the cards in the order in Part F.
4. Copy everything below the divider into the image tool. The playbook names Gemini through the `ce-gemini-imagegen` skill or GPT-Image-2.5 in ChatGPT with the reference images attached; both accept reference images.
5. Deliver a text inventory with the files: file name, actual pixel size, and the motion and discovery notes asked for in Part G.

Budget: 42 images. One concept, twelve wide rooms, twelve portrait rooms, five motion sprites, twelve card illustrations.

| Part | Files | Count |
| --- | --- | --- |
| A | `es00_concept.png` | 1 |
| B | `es01_paella_wide.png` to `es12_bodega_portrait.png` | 24 |
| C | `es_motion_*.png` | 5 |
| D | `es_card_*.png` | 12 |

---

## Task and reference authority

Create a production-quality illustrated asset set for the Spain area of Food World, an explorable world where food reveals how people live. Spain is one imagined table that compresses nine regions into six neighbourhoods. Every picture shows one clear regional setting. Do not stack every landmark, region or dish into one view.

Use the attached reference paintings as the authority for brushwork, texture, light, character rendering and level of detail. The style is painterly illustrated realism between a photograph and a cartoon: visible brushwork on walls, cloth, wood and stone; one light-source logic per picture; real body, hand, furniture and building proportions with faces that may be softened and eyes slightly enlarged as in the references; rich, saturated but natural colour; depth in three planes with food in the foreground, people and work in the middle and the place behind; complete scenes where every seat, table, shelf and hook holds what rests on it.

Rejected in every picture: photorealism or photo compositing; a rendered 3D look with plastic highlights; flat vector shapes, thick outlines, cel shading, chibi proportions or mascot faces; blurred or smeared regions; any text, readable menus, signs with words, captions, filenames, watermarks, borders or checkerboards; contact sheets, collages, split panels or before-and-after frames; interface elements of any kind, meaning no arrows, rings, diamonds, markers or labels. The application adds its own markers afterwards over the actual subjects.

The Turkey reference paintings show the clothing standard. The hotpot reference shows light, density and food; ignore its present-day clothes.

## The period and the people

Every person in every picture wears the everyday working clothes of Spain between about 1880 and 1910. This is one recorded period band for the whole area. Working clothes, not festival costume, not the bullfighter's suit, not a bolero-school stage dress, and nothing modern: no printed T-shirts, jeans, trainers, wristwatches, plastic, zips or modern eyewear.

Dress people from these eight profiles. Colours name the palette in the next section.

| Profile | Garments | Who wears it | Where |
| --- | --- | --- | --- |
| Huertano | Loose white linen shirt, waistcoat, knee breeches, wide red sash, esparto sandals, straw hat, neck cloth | Men working the rice fields and the huerta, the paella cook | Valencia |
| Andalusian field hand | Short jacket, waistcoat, long trousers, sash, low-crowned felt hat, boots | Men in the olive grove and the bodega | Andalusia |
| Patio woman | Cotton blouse, dark bodice, long skirt, full apron, headscarf, a shawl for the street | Women cooking and drawing water in a shared patio | Andalusia, La Mancha |
| Shepherd | Shirt, leather chest apron with tool pockets, cloth jacket, black cloth breeches, sash, leather leg chaps | Men with the flock and the pigs | La Mancha, Extremadura |
| Castilian counter worker | White shirt with rolled sleeves, dark waistcoat, long white apron tied at the waist, cloth cap | Barman, churrero, ham carver, market porter | Madrid, central Castile |
| Galician rain worker | Rush cape and hooded rush over-cape, leggings, leather boots on wooden soles; a linen shirt and wool skirt or breeches under it | People on the quay, at the fair, driving cattle in rain | Galicia |
| Basque farm and bar worker | Dark blue or black smock, collarless shirt, wool trousers, wide sash, black beret, rope-soled shoes or clogs | Men at the counter and on the farmstead | Basque Country |
| Catalan bread worker | Long shirt, striped or plain wide breeches, sash, rope-soled shoes with tape ties, a soft red cap on older men only | Baker, terrace waiter, market carrier | Catalonia |

Women appear in every room as cooks, sellers, buyers and diners in long skirts, aprons, blouses, bodices, headscarves and shawls of the same period. Vary age, height, build, skin, hair, face, occupation and gesture in every picture. Children take small steps; elders lean a little. People cook, carry, choose, serve, pour, share and talk. Nobody poses for the viewer. Show four to eight readable people in a room, with smaller background figures only where they help.

## Palette

| Name | Hex | Use |
| --- | --- | --- |
| calBlanca | #F3EDE2 | Lime-washed walls of Andalusia, La Mancha and the Valencian barraca; aprons and shirts |
| piedraDorada | #D8C49A | Castilian ashlar, Plaza Mayor stonework, Jerez render in sun |
| granitoGalego | #8E9299 | Galician granite, Basque stone bases |
| tejaArabe | #B4572F | Curved terracotta roofs in the south and east |
| pizarraNorte | #4A4F55 | Galician and Asturian slate, Madrid roof hips |
| almagre | #A4432B | Red-ochre woodwork of the Basque farmstead, sashes, the Nasrid wall red |
| maderaCastano | #5A3B27 | Chestnut beams, bar counters, cart timber, sherry butts |
| azulTalavera | #2E5C8A | Glazed tile dados, shutters, boat hulls, Basque smocks |
| albero | #E0B45F | Andalusian yellow sand paving, bodega floors, plaza grit |
| tierraManchega | #C2A473 | Dry cereal plain, dehesa floor, rice-field bunds in autumn |
| verdeOliva | #6E7A4E | Olive and holm-oak canopies, shutter green, Basque hill shadow |
| aguaCosta | #2E7A96 | The Mediterranean and the Albufera. The northern water is the same colour pulled toward verdeOliva, about #3F6B6B |

## Part A: the concept image

File: `es00_concept.png`. One image, wide, at the largest native size available. No exact size is required for this picture; it is a spatial blueprint, not a room.

Paint the whole imagined Spain as one wooden-table diorama seen from a high three-quarter angle, sunlit from the south-west. Six named neighbourhoods, one continuous coast, one river, open countryside between the neighbourhoods, landmarks kept behind the food places and smaller than their neighbourhood. Read the table anticlockwise from the lower right.

1. La Albufera y el Puerto (lower right, Valencia). A shallow lagoon of flooded rice paddies in low bunded squares, a pine sandbar between it and the open sea, a small fishing quay with lateen-rigged boats and drying nets, one reed-thatched field hut with a very steep gable, an orange grove in rows, and an open-air rice kitchen under a reed shade with a wide shallow pan over a wood fire. The river reaches the sea here.
2. La Plaza Mayor (lower centre, Madrid and Castile). The densest neighbourhood and the visual centre of the whole table. A rectangular arcaded square of red brick over granite piers, a cast-iron and glass market hall of the 1876 to 1889 generation on one corner, a narrow lane off the square with a churrería, a tapas counter opening under the arcade, and a family kitchen above a café counter.
3. El Patio y la Bodega (lower left, Andalusia). Whitewashed lanes climbing a low hill, geraniums on the walls, one open courtyard with a well and an orange tree, a tall lime-washed bodega with high shuttered windows and stacked butts inside, a flamenco patio, and above and behind it the red walls and cypresses of a Nasrid palace, small and far back. Olive terraces and a stone oil mill on the slope below.
4. El Secano Manchego (upper left, La Mancha and the dehesa). Dry ground, a ridge with three windmills, a low whitewashed cheese farm with a flock of hornless sheep, purple saffron plots in flower, and further west an open holm-oak dehesa with pigs under the trees and strings of red peppers drying on a rack by a smoke house.
5. La Ría (upper centre, Galicia and Asturias). Green and grey. A drowned valley of dark water with granite quays, raised stone granaries on staddle stones along the slope, an inland fair ground under a granite arcade with copper cauldrons and octopus on wooden plates, and eastward an apple orchard with a long low cider press house.
6. El Cantábrico i la Terrassa (upper right, Basque Country and Catalonia). One coast strip that turns the north-east corner and warms as it runs south. The Basque end is a stone harbour under a green hill with a broad-gabled timber-and-stone farmhouse and a dark-wood bar counter; the Catalan end is rendered masonry with iron balconies, a terrace under plane trees, a bakery, one curved mosaic balustrade and a small Gaudí-inspired roofline behind the food.

Transitions: between 1 and 2 the irrigation canal narrows into a dry cart road and reed shade gives way to brick; between 2 and 3 the road drops through olive terraces and walls turn from brick to lime wash; between 3 and 4 the terraces thin into holm-oak dehesa and then bare plain; between 4 and 5 the plain rises into pine and then wet green hills and granite; between 5 and 6 the coast swings east, slate becomes tile and the water warms; between 6 and 1 plane trees become palms and the last terrace becomes the sea wall of the port.

Water: the sea lies along the east side and wraps the north edge as one continuous surface; the Galician ría is an inlet of it. One river leaves the mountains between 4 and 5, runs south-east past the edge of 2 and reaches the sea at the port in 1. The rice paddies draw from it through sluices. Nothing stands in water.

No interface elements, no labels, no text. Deliver a short text note naming where each of the six neighbourhoods and the five landmarks sit in the picture.

## Part B: the twelve room pairs

### Rules for every room pair

1. Two independently composed paintings per room. Wide is exactly 1672 x 941 pixels. Portrait is exactly 941 x 1672 pixels. Do not crop, stretch or upscale one to make the other. Report the delivered pixel size of every file in the inventory. A file at any other size is rejected.
2. One complete environment per image: no collages, contact sheets, split views, miniatures or panels.
3. The same place, food, palette and main characters in both orientations. Wide reveals the work surface and the place. Portrait stacks food, cook and place vertically and is recomposed, not squeezed.
4. A human-height or slightly elevated three-quarter view. The main food occupies a substantial, readable part of the foreground in both orientations, with texture that reads at phone scale: the char on bread, the sheen on oil, the marbling in ham, the grain of rice.
5. The three discovery subjects are visible, distinct and unobstructed in both orientations, with breathing room around them, never hidden behind hands, table edges, steam or decoration.
6. Four to eight readable people from the profiles above, varied in every way listed, doing the work of the room.
7. The painting is complete without sprites: its furniture, utensils, food, people, buildings and plants are all in it. Every seat and work surface supports what rests on it. Every hand holds something plausibly. Every vessel that pours has its low edge toward the receiving vessel and its liquid leaves that edge and falls with gravity.
8. Each room has one small crisp working area for its signature motion, with clean edges, and one isolated hanging detail (a pepper string, a garlic braid, a ham leg, a cloth, a lamp, a branch) with only wall or sky behind it, so the application can move it without moving anything else.
9. Each room also leaves an attachment point for its assigned sprite where one is listed: a plain canopy edge for the awning fringe, a branch end near the frame edge for a twig, open sky with nothing in it for a gull.
10. Every hot food may show steam. Cold food never shows steam. Sunlight reads as one coherent direction through the whole scene.
11. Landmarks stay behind the food and smaller than the table. Leave one open area of sky or water where a bird or a mist bank can move without crossing a person.
12. No text, labels, markers, arrows, rings, borders, watermarks, captions or invented lettering anywhere in the art.

Vessels, tools and stock in the paintings belong to the period: earthenware, copper, tinned iron, wood, esparto, glass, cloth and paper. No plastic, no stainless steel, no electric light.

### ES01 The rice fire

Files: `es01_paella_wide.png`, `es01_paella_portrait.png`
Room id `es_paella`, folder `public/scenes/es_paella/`, opens from the object `paellaEs`.

- Place: an open-air Valencian rice kitchen under a reed shade beside the Albufera, warm sand paving, an orange tree, shared lunch tables, a wood fire of vine prunings under the pan, a view over bunded paddies toward the pine sandbar and the sea.
- Food: one wide, shallow pan, the paella, the largest food object in the whole set at a believable cooking scale, holding arròs a la valenciana: short round rice of a protected Valencian variety (Bomba, Sénia, Bahía or Albufera) spread in a layer one grain deep at the edges, never mounded; pieces of chicken and rabbit; flat green beans of the ferraura and rotget types; large white garrofó beans; grated tomato and sweet paprika in the sofrito; saffron threads; olive oil, water and salt. Optionally a few snails and a rosemary sprig. No lemon wedges on this pan. No seafood in this pan. A second, smaller pan of seafood rice may sit at the neighbouring station with mussels and prawns, clearly a different dish.
- Wide: the two cooking stations and the communal tables, the paddies behind. Portrait: the hero pan with its handles and food surface visible, the cook, shaded diners, then the lagoon and sky.
- Discovery subjects: rice grains in a small wooden scoop; the toasted edge of the hero pan where the rice meets the metal; a bowl of flat beans and garrofó.
- Signature motion area: the rice surface at the centre of the pan, simmering with small breaking bubbles. Steam above the pan. Open sky over the paddies for the gull sprite. No cook stirring the finished rice. Isolated hanging detail: a bunch of rosemary or a garlic braid tied to the reed shade with only sky behind it.
- Sprite: `es_motion_gull.png`.

### ES02 The tapas bar

Files: `es02_tapas_wide.png`, `es02_tapas_portrait.png`
Room id `es_tapas`, folder `public/scenes/es_tapas/`, opens from the object `plancha`.

- Place: a wood-and-tile neighbourhood bar opening under the arcade of a Plaza Mayor of red brick over granite piers. The square shows through the doorway; the counter and its conversations are the subject. Glazed tile dado, a zinc or wooden counter, a vermouth barrel with a tap, wine in bottles, small beer glasses. No sangría.
- Food: two clear foreground plates: patatas bravas, fried potato cubes with one reddish paprika-and-oil sauce, no mayonnaise stripe; and croquetas with one cut open to show a soft béchamel filling. Small dishes of green olives and salt anchovies, bread, a glass of vermouth, a carafe of water. Small plates, not a buffet.
- Wide: counter, doorway and two shared tables. Portrait: a server, the two hero plates and the arcaded doorway in one column.
- Discovery subjects: the bravas and their sauce; the opened croqueta showing its filling; the olive dish.
- Signature motion area: the server poised over the bravas with a small spouted jug, low edge toward the plate, a short drizzle leaving it. A plain canopy edge over the doorway for the fringe sprite. A hanging ham leg or garlic braid against the back wall as the isolated hanging detail.
- Sprite: `es_motion_awning_fringe.png`.

### ES03 The ham counter

Files: `es03_jamon_wide.png`, `es03_jamon_portrait.png`
Room id `es_jamon`, folder `public/scenes/es_jamon/`, opens from the object `jamonEs`.

- Place: one specialist stall inside a cast-iron and glass market hall of the 1876 to 1889 generation: slender iron columns, a glazed roof, warm amber light, glazed tile on the stall front, a brass scale, paper and string. Not a modern hall.
- Food: one acorn-fed ibérico leg held in a wooden clamp stand with the exposed cut face toward the viewer: a stepped face with yellowed fat at the edge and visible muscle grain, the trimmed fat laid back over part of it. A long flexible carving knife and a short pointed knife. A plate of thin, loosely folded slices you can almost see through. A few curing legs hanging overhead against the wall with nothing else behind them.
- Wide: the market aisle and neighbouring shoppers with baskets. Portrait: the hanging legs down to the carver's hands and the serving plate, knife and ham unobstructed.
- Discovery subjects: the cut face; the plate of slices; the curing legs overhead.
- Signature motion area: the knife mid-stroke separating one thin slice, confined to the working area. Stand, table and hanging stock still. Dust in a shaft of light from the glass roof.
- Sprite: none.

### ES04 The family kitchen

Files: `es04_tortilla_wide.png`, `es04_tortilla_portrait.png`
Room id `es_tortilla`, folder `public/scenes/es_tortilla/`, opens from the object `tortillaEs`.

- Place: a modest family kitchen serving neighbours through a café counter in central Castile. Warm plaster, everyday tiles, an iron range with a wood fire, a window onto brick balconies, a cook sharing the work with a family member.
- Food: a thick golden potato-and-egg tortilla with one wedge removed, its potato layers soft and pale, on an earthenware plate. On the board: peeled potatoes, a bowl of eggs, a small bowl of sliced onion, a jug of olive oil. A second tortilla setting in a pan on the range. The potatoes were softened in oil, not fried crisp. No chorizo, cheese or pepper in the tortilla. The tortilla is an omelette, not a flatbread.
- Wide: kitchen to counter to window. Portrait: the tortilla and wedge in the foreground, the cook and the range above, the window at the top.
- Discovery subjects: the cut wedge; the potatoes on the board; the bowl of eggs.
- Signature motion area: the surface of the setting egg in the pan on the range, with a little steam. A string of dried red peppers hanging by the window with only wall behind it.
- Sprite: `es_motion_pepper_ristra.png`. The painted string stays in the painting; the sprite is layered over a second, empty hook, so leave one plain hook or nail on the wall.

### ES05 The churrería

Files: `es05_churros_wide.png`, `es05_churros_portrait.png`
Room id `es_churros`, folder `public/scenes/es_churros/`, opens from the object `churrosEs`.

- Place: a compact churrería in a narrow lane off the square, early morning light, a tiled counter, a deep iron frying pan over a fire, a draining tray with a wire rack, a few locals having breakfast standing and seated.
- Food: fresh churros, thin and ridged because the dough is pushed through a star nozzle, curled into loops; porras beside them, thicker and softer; a tall narrow cup of thick dark drinking chocolate that a churro could stand in, not a wide mug of cocoa; a second cup and a plate. One person holds a churro just above a cup with one small chocolate drip.
- Wide: fryer, draining tray and café table linked. Portrait: the cup and dipped churro in the foreground, the maker and fryer above, the lane opening at the top.
- Discovery subjects: the ridged surface of one churro; the chocolate cup; the frying and draining station.
- Signature motion area: the slow chocolate drip between churro and cup. Small bubbles inside the fryer and steam from the chocolate pot. Oil stays in the pan; the cup stays on its saucer. Isolated hanging detail: a cloth on a hook by the fryer with only tiled wall behind it.
- Sprite: none.

### ES06 The counter of small bites

Files: `es06_pintxos_wide.png`, `es06_pintxos_portrait.png`
Room id `es_pintxos`, folder `public/scenes/es_pintxos/`, opens from the object `pintxosEs`.

- Place: a Basque bar with a long dark-wood counter, a stone doorway, a restrained red-and-cream awning outside, and a green hillside with a broad-gabled farmhouse beyond. Give it a different identity from the Madrid bar: stone, dark timber, cooler coastal light, a beret or two.
- Food: an in-period counter, not a modern display. A stoneware jar of pickled green guindilla peppers, a dish of green olives, a small tin or barrel of salt-packed anchovies, the period product, a wedge of tortilla under a glass dome, a few slices of bread with toppings that differ from one another. One complete skewer built from the three: a green olive, a folded salt-packed anchovy rinsed and dressed with oil, and a pickled green pepper on a stick, in a clear spot. The pepper is green and mild, not a red chilli. No two bites are the same.
- Wide: the counter's length and the exchange between server and customers. Portrait: the nearest display, the server and the tall doorway in depth.
- Discovery subjects: the complete skewer; the anchovy on a neighbouring bite; the jar of pickled peppers.
- Signature motion area: the cook finishing one bite with a thin olive-oil drizzle from a small cruet, low edge toward the bite. A plain awning edge over the doorway for the fringe sprite. A garlic braid or a lamp against the stone wall as the isolated hanging detail. No trays sliding along the bar.
- Sprite: `es_motion_awning_fringe.png`.

### ES07 The courtyard kitchen

Files: `es07_gazpacho_wide.png`, `es07_gazpacho_portrait.png`
Room id `es_gazpacho`, folder `public/scenes/es_gazpacho/`, opens from the object `gazpachoEs`.

- Place: an Andalusian whitewashed courtyard kitchen shaded by an orange tree, blue-and-white tile, a wrought-iron balcony, potted geraniums on the wall, a small well or water basin, a view into a lived-in lane.
- Food: a glazed earthenware jug pouring smooth red gazpacho into a wide bowl, the low edge of the jug toward the bowl. Around it: ripe tomatoes, green peppers, a cucumber, garlic, a piece of soaked country bread, a bottle of olive oil, a bottle of sherry vinegar, salt. Separate small dishes of diced tomato, cucumber, pepper, onion, bread and hard-boiled egg for garnish. A wooden dornillo (a hand-carved wooden bowl) and a mortar as the work tools. It is a cold soup: no steam anywhere in this room, no hot stew. No salmorejo: the bowl holds a thin pourable gazpacho, not a thick Córdoba cream.
- Wide: preparation, shade and a small shared table. Portrait: jug, bowl, cook and orange branches above; the three food subjects together.
- Discovery subjects: a tomato; the bowl of gazpacho; the olive-oil bottle.
- Signature motion area: the short cold pour from jug to bowl. A branch end of the orange tree reaching in from the frame edge for the twig sprite. Still water in the basin with nothing crossing it.
- Sprite: `es_motion_orange_twig.png`.

### ES08 The fair cauldron

Files: `es08_pulpo_wide.png`, `es08_pulpo_portrait.png`
Room id `es_pulpo`, folder `public/scenes/es_pulpo/`, opens from the object `pulpoEs`.

- Place: an inland Galician fair ground under a granite arcade, carts and cattle at the edge, a green slope and grey sky beyond, a stone granary on staddle stones in the middle distance. Not a harbour. Soft northern light. Some people in rush rain capes.
- Food: cooked octopus cut with scissors into round-edged pieces onto a round wooden plate, dressed with paprika, olive oil and coarse salt, boiled potatoes underneath. A copper cauldron of boiling water with a whole octopus, scissors in the cook's hand, a tin of paprika, an oil bottle, coarse salt in a dish. No lemon, parsley or garlic on the plate.
- Wide: the serving table under the arcade with the fair behind it. Portrait: the wooden plate and cook in the foreground, the cauldron, then a narrow opening of sky above.
- Discovery subjects: one cut piece of octopus; the paprika tin; the round wooden plate.
- Signature motion area: a light paprika sprinkle from a raised hand over the plate. Steam confined to the cauldron. Open sky for the gull sprite. Isolated hanging detail: an oil lamp hanging under the granite arcade with only stone behind it.
- Sprite: `es_motion_gull.png`.

### ES09 The bread terrace

Files: `es09_pa_tomaquet_wide.png`, `es09_pa_tomaquet_portrait.png`
Room id `es_pa_tomaquet`, folder `public/scenes/es_pa_tomaquet/`, opens from the object `paTomaquet`.

- Place: a Barcelona bakery terrace under plane trees, warm rendered masonry, an iron balcony, a curved mosaic balustrade of broken tile at the terrace edge, and a small glimpse of a Gaudí-inspired roofline of the Casa Vicens and Park Güell kind (1883 to 1900) behind. No Sagrada Família towers. The food table is larger and clearer than the landmark.
- Food: a round pa de pagès country loaf, a day old, and thick slices, a ripe tomato halved and being rubbed onto the cut surface of one slice by a working hand, then a cruet of olive oil and a dish of salt in that order. Finished slices show the pink pulp in the crumb with the skin left in the hand. Never diced tomato heaped on bread.
- Wide: preparation table, baker and terrace. Portrait: bread and hands beneath the balcony and the curved mosaic edge.
- Discovery subjects: the tomato-rubbed bread surface; the halved tomato in the hand; the olive-oil cruet.
- Signature motion area: the rubbing movement of the hand on the bread. An orange-tree branch end from a large terrace pot reaching in from the frame edge for the twig sprite; the plane trees stay in the background.
- Sprite: `es_motion_orange_twig.png`.

### ES10 The cheese farm

Files: `es10_manchego_wide.png`, `es10_manchego_portrait.png`
Room id `es_manchego`, folder `public/scenes/es_manchego/`, opens from the object `manchegoEs`.

- Place: a La Mancha cheesemaker's kitchen in a low whitewashed farmhouse opening onto dry fields, a flock of sheep and two distant windmills on a ridge. Timber, warm earth, stone, quieter than the market rooms.
- Food: a whole wheel and a cut wedge of Manchego. The side wall of the wheel shows a zig-zag print from a plaited esparto band; both flat faces show a flower or wheat-ear print from the pressing board; the two patterns are different and the zig-zag never wraps onto the faces. The paste is ivory to pale yellow with small uneven eyes. On the work area: a plaited esparto band, a wooden press, a milk vessel, curd draining on a slatted table, whey collecting in a bucket. The sheep are Manchega: large, hornless in both sexes, with a convex profile; no horned rams.
- Wide: workbench to doorway to farm. Portrait: wedge, wheel and maker beneath a doorway framing the fields, sheep and one or two windmills.
- Discovery subjects: the rind, side and face; the milk vessel; a sheep in the doorway view.
- Signature motion area: a whey drip from the draining table into the bucket. Windmill sails still in the painting; the application turns one. A string of dried peppers by the door with wall behind it.
- Sprite: `es_motion_pepper_ristra.png`. The painted string stays in the painting; the sprite is layered over a second, empty hook, so leave one plain hook or nail on the wall.

### ES11 The cider house

Files: `es11_sidreria_wide.png`, `es11_sidreria_portrait.png`
Room id `es_sidreria`, folder `public/scenes/es_sidreria/`, opens from the object `sidreriaEs`.

- Place: an Asturian cider house: a long low stone press house with heavy timber beams, a beam press and barrels behind, a plank table, a stone floor, a door or window open onto an apple orchard with a stone granary on staddle stones. Daylight, green and wet outside.
- Food: natural cider poured in the escanciado: a standing pourer holds the green bottle raised high above the head, the wide thin glass held low at hip height and tilted, and a wide stream falls the full distance, breaking into froth as it hits the inside wall of the glass. Only a finger of cider in the glass. Crates of small apples, a board with cheese and bread, a few glasses on the table. Cider splashes on the stone floor at the pourer's feet.
- Wide: the pourer at full height with the table and press behind. Portrait: the pourer's raised arm and the falling stream in one vertical, the glass low, the orchard through the door.
- Discovery subjects: the raised bottle and the falling stream; the wide glass; a crate of apples.
- Signature motion area: the falling stream, wide and breaking, with a clear background behind its full length. An apple-tree branch end reaching in at the window for the twig sprite.
- Sprite: `es_motion_apple_twig.png`.

### ES12 The sherry bodega

Files: `es12_bodega_wide.png`, `es12_bodega_portrait.png`
Room id `es_bodega`, folder `public/scenes/es_bodega/`, opens from the object `bodegaJerez`.

- Place: a tall lime-washed Jerez bodega nave with a high timber roof, sand floor freshly watered, high shuttered windows letting in one shaft of light with dust turning in it, butts stacked three tiers high in long rows. Dim and cool, unlike every other room.
- Food and drink: one opened butt showing a pale film of yeast on the wine's surface; a cellarman drawing wine with a long-handled venencia held high and pouring a thin thread into a small copita held low; a plate of jamón slices and green olives on a butt head; chalk marks on the butts only as abstract marks, no readable letters.
- Wide: the row of butts receding, the shaft of light, the cellarman and two visitors. Portrait: the raised venencia and the falling thread in one vertical, the copita low, the stacked tiers behind.
- Discovery subjects: the film of yeast in the open butt; the venencia and its thread of wine; the three-tier stack.
- Signature motion area: the thin thread from venencia to copita, narrow and slow, distinct from the cider's wide breaking stream. The shaft of light. Isolated hanging detail: a cellar lamp hanging from the roof timbers against the lime wash.
- Sprite: none.

## Part C: motion sprites, exactly five

Generate them after the rooms so colour and rendering match. Each is one object on pure white, large on the canvas, fully visible, clean edges, no ground plane, no cast shadow beyond the object, short side at least 400 pixels after trimming. Do not upscale an undersized subject; regenerate it.

| File | Subject | Attachment | Rooms |
| --- | --- | --- | --- |
| `es_motion_orange_twig.png` | One short curved twig with five to seven orange leaves and one small orange, attachment end clearly visible | Extends a painted branch at the frame edge | ES07, ES09 |
| `es_motion_awning_fringe.png` | One short red-and-cream fabric valance with three shallow scallops and a straight attachment edge; no frame, no poles | Hangs under a painted plain canopy edge | ES02, ES06 |
| `es_motion_gull.png` | One gull in a natural gliding pose, wings and tail fully visible, slight three-quarter side view | Crosses painted open sky | ES01, ES08 |
| `es_motion_pepper_ristra.png` | One string of dried red peppers, twelve to twenty pods on a cord, straight attachment at the top | Hangs from a painted hook or beam | ES04, ES10 |
| `es_motion_apple_twig.png` | One short twig with five to seven leaves and two small apples, attachment end visible | Extends a painted branch at the window edge | ES11 |

Do not generate steam, ripples, bubbles, flour or spice clouds, liquid streams, glows, sparkles, markers, chairs, tables, cups, bowls, buildings, people or alternate poses. The application draws effects in code.

## Part D: card illustrations, exactly twelve

One per room. Each shows one food close enough to read its texture, on pure white, no board, plate, knife or hand unless named, no background, short side at least 400 pixels after trimming.

| File | Subject |
| --- | --- |
| `es_card_paella.png` | One wooden scoop of cooked Valencian rice with a piece of rabbit, a flat green bean and two garrofó beans on it |
| `es_card_tapas.png` | One small plate of patatas bravas with the red sauce over them |
| `es_card_jamon.png` | Three thin, loosely folded slices of ibérico ham showing cut texture and fat marbling, no platter |
| `es_card_tortilla.png` | One wedge of potato tortilla showing its soft layered cut face |
| `es_card_churros.png` | Two ridged churros crossed over one tall narrow cup of thick chocolate |
| `es_card_pintxos.png` | One complete skewer with green olive, folded anchovy and pickled green pepper, each recognisable |
| `es_card_gazpacho.png` | One earthenware bowl of red gazpacho with a few diced garnishes on its surface |
| `es_card_pulpo.png` | One round wooden plate of octopus pieces with paprika, oil and coarse salt |
| `es_card_pa_tomaquet.png` | One slice of country bread rubbed with tomato, glistening with oil, a halved tomato beside it |
| `es_card_manchego.png` | One Manchego wedge with the zig-zag side rind and the flower face rind visible, and its cut interior |
| `es_card_sidreria.png` | One wide thin cider glass with a finger of cloudy cider and a green bottle beside it |
| `es_card_bodega.png` | One copita of pale sherry with a venencia laid beside it |

## Part E: acceptance check

Accept a picture only when every line is true. Reject and regenerate; do not repair a wrong picture with an overlay or a crop.

- Style matches the reference set: painted, not photographic, not cartoon
- Every person wears the 1880 to 1910 working clothes of the profiles above, and people vary in age, height, build, skin, hair, face, occupation and gesture
- Food is accurate to its room brief, realistic, and large enough to read on a phone
- The scene is complete and physically possible: supports, hands, utensils, and every pouring vessel has its low edge toward the receiver with the liquid falling under gravity
- The three discovery subjects are visible and unobstructed in both orientations
- The signature motion has a clean local area, and the isolated hanging detail has only wall or sky behind it
- No text, borders, markers, collage, blur, plastic, stainless steel or electric light
- The file is exactly 1672 x 941 or 941 x 1672 for rooms, and carries the exact name from this brief

## Part F: generation order and completion

Session 1: `es00_concept.png`. Stop and review it.

Session 2, with the approved concept attached as well: ES01 wide, ES01 portrait, then each room in numerical order through ES12, then the five sprites, then the twelve cards. After each pair, check food accuracy, style consistency, hands and utensils, supported furniture, readable subjects and portrait framing before moving on. If a limit interrupts the set, list the completed and remaining file names exactly and resume from that list.

Completion: 1 + 24 + 5 + 12 = 42 files exist in `~/Downloads/additional game asset/spain/`, each inspected, plus the inventory and the notes below.

## Part G: text notes to deliver with the files

For the concept: where each neighbourhood and landmark sits.

For each room pair:

- The signature action and the working area that supports it, described for the wide and the portrait file separately
- The isolated hanging detail and where it is in each file
- The three discovery subjects and where they appear in each file
- Which sprite the room uses, if any, and where its attachment point is in each file
- The actual pixel size of both files

The pictures are static. Do not call them animated because motion is depicted in them. The application adds steam, light, birds, leaves, breeze on the hanging detail and the sprites in code, and adds the small diamond markers over the discovery subjects. Do not invent a discovery for a food that failed to appear clearly; report it instead so the pair can be regenerated.
