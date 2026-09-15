# How to create a new Food World area

This is the author's method, documented on 2026-09-13. Use it for a new country, region, or neighbourhood. ChatGPT researches the area and generates its visual assets. Codex uses those assets to build the explorable world and its living rooms.

The main design principle is **Make each area feel like a place people live in, with food as the way to explore it.** Apply the design lessons below throughout the four stages, from the first composition to the final live review.

The sequence is **Research and concept image → room paintings and useful props → 3D community → gentle animation and food discoveries**.

The visitor experience follows **Place → food → story**. The place draws the visitor in, a visible food detail invites interaction, and a short story rewards curiosity. Keep deeper reading optional.

## Companion documents

This document sets the quality standard. Three companions make the standard buildable by an agent team:

- [Art direction](art-direction.md): the picture standard. Painterly illustrated realism between a photograph and a cartoon, people in the area's traditional everyday clothing, realistic food, and the acceptance check for every delivered image
- [Building a world](building-a-world.md): the engineering handbook. Files, registration, the stand standard measured on the hotpot house, the room configuration, the helper catalogue, tests and publishing
- [Agent team playbook](agent-team-playbook.md): how several agents divide the work, the stage order, and the definition of done

## 1. Research the area and generate a concept image in ChatGPT

Research what makes the area distinctive before drawing it. Cover its landscape, architecture, food culture, ingredients, everyday activities, regional differences, and locally famous places. Keep sources for the claims that will become visitor-facing stories.

Create a brief that identifies:

- The area and the food traditions it represents
- The landscape, climate, waterways, and settlement pattern
- A varied combination of food places, ingredient sources, homes, and local landmarks
- The architectural forms, materials, colours, and community spaces
- The historical and traditional clothing references for the people
- The period or mix of periods being represented
- The supplied style-reference images

Design the whole composition before adding detail. Ask ChatGPT to generate an overall concept image that Codex can use as a spatial blueprint. Cluster related places into recognisable neighbourhoods, establish clear country boundaries, and leave space for future areas. Use winding streets, irregular groupings, layered heights, and framed views. Show how buildings, squares, food places, farms or gardens, water, bridges, and landmarks connect.

Attach the chosen references. Use them to guide spatial composition as well as colour, texture, lighting, proportions, and detail. Adapt the subjects to the new area; give its people distinct faces, clothing, and activities.

**Handoff:** The concept image, the research brief and sources, and an annotated list of the places visible in the concept. Identify any connections that the image leaves unclear before building them.

## 2. Research and generate food-room paintings and props in ChatGPT

Plan the rooms as a set before generating them. Give each room a clear food purpose and connect it to a place in the concept image. Include the breadth of local food culture, from everyday meals and ingredient production to regional traditions and special occasions.

Use the [original UK scene-generation prompt](examples/uk-scene-generation-prompt.txt) as an example of the structure. It includes cultural scope, visual language, room briefs, a reduced prop list, and regional balance. Replace its UK-specific subjects for each new area. It is an example brief, not a researched source for historical claims.

Attach reference images to the generation request. Add this instruction to the area-specific prompt:

> Use the attached images to guide spatial composition as well as colour, brushwork, texture, lighting, proportions, and detail. Keep that style consistent across the concept, rooms, and props. Create people, architecture, food, and objects appropriate to the new area. Each full room must feel complete on its own. Separate props are only for animation, interaction, or scene layering.

For each room, record its purpose, foods and ingredients, people and activities, atmosphere, possible discoveries, and useful motion. Generate one room at a time and inspect it against the references before continuing.

### Image-production rules

Every picture must pass the [art direction](art-direction.md) acceptance check before it enters the repository.

- Generate every room or environment as its own image, never as a contact sheet or collage
- Use the largest native output size available
- Generate wide and portrait compositions independently; do not crop or upscale one to make the other
- Keep each composition complete, with its key food details visible and readable
- Keep captions, filenames, borders, and checkerboards out of the images
- Generate separate props only where they support animation, interaction, or layering
- Use a pure plain-white background for props, with one object or one tightly related small group per image
- Make a prop large enough that its short side is at least 400 pixels after extraction
- Regenerate an undersized or clipped asset instead of enlarging it afterwards

The painting should already contain its static furniture, people, dishes, and decoration. A separate prop must have a defined role so that integration does not duplicate something already painted into the room.

**Handoff:** Save the original images, generation prompts, style references, and an asset inventory. For each room, identify its wide and portrait files, related props, and proposed discoveries. Inspect the saved files, dimensions, framing, and prop backgrounds before calling the set complete.

## 3. Build the 3D world in Codex from the concept blueprint

Give Codex the concept image, research brief, room paintings, props, and asset inventory. Use the concept to guide the world layout and the room paintings for the scenes that open when a visitor enters a place.

### Build a believable community

Balance busy places with landscape. Concentrate bustle around markets, workshops, and shared courtyards, then let the settlement open into countryside. Establish a regionally believable mix of coast, farmland, woodland, dry ground, and mountains. Make the relationships visible: A Black Sea tea terrace should visibly relate to the sea.

- Keep geography, buildings, routes, and everyday activity close to reality, within the miniature world's scale
- Cluster houses and food places into a busy community with shared streets, courtyards, squares, and gathering places
- Vary building footprints, heights, roofs, materials, entrances, and orientation while keeping the area's architectural identity
- Combine food venues, ingredient sources, homes, and local famous places so that they form a connected neighbourhood
- Connect doors and gathering places to usable roads, paths, stairs, and bridges
- Give food venues the dishes and ingredients that belong there

Show everyday culture alongside landmarks: What locals grow, prepare, eat, sell, and share. Create life through purposeful activity and relationships between places, such as produce moving from a garden to a market or cooks serving neighbours in a courtyard.

People must vary in age, height, build, appearance, occupation, clothing, and behaviour. Use locally grounded ancient, historical, and traditional clothing styles appropriate to the period specified in the area brief. If the world combines periods, record that choice; do not describe it as an exact reconstruction of one era.

Give people varied and natural movement: Different routes and speeds, pauses to browse or talk, gradual turns, carrying food, preparing ingredients, sitting, serving, and other local activities. Walking steps must match travel, and stopped people must stop stepping. Feet must meet the ground and carried objects must stay in the hands. Avoid synchronized crowds and repeated identical motion.

### Make the world react first

Give each object an action suited to what it is. Fruit trees shake and drop fruit, dough is kneaded, skewers turn, and people gesture or speak. Keep boards, pots, and furniture grounded while the relevant food or body part moves. Let the action reward a click before showing information.

Give every interactive place one **signature verb** that explains what happens there: pour, pull, puff, knead, roll, turn, stir, harvest, serve, carve, hammer, or flow. Reuse a small vocabulary of motion patterns, but tune the subject, amplitude, timing, and supporting details to the place. Do not fall back to generic food hopping, dish sliding, or whole-building bouncing when a preparation or craft action can tell the story.

Use a short three-beat reaction when a stand has people around it:

1. The food, ingredient, tool, water, or material reacts first
2. The worker completes or follows the action
3. At most one nearby person acknowledges it

Speech can follow the physical response, but it must not be the first or strongest feedback. Scale the reaction for the actual world-camera distance so that it is visibly readable without zooming. Repeated clicks must remain bounded: food returns to its support, falling items land or reset, and no clones, particles, or transforms accumulate indefinitely. Passive architecture stays still; animate a grounded detail such as shutters, light, water, birds, a balloon, or foliage instead.

### 3D stand-reaction standard

The 3D world and the room painting are separate animation systems. A stand click can move modeled food, tools, and people. A finished room painting can move only supported image layers and natural effects. Do not copy a 3D action into a painting with drawn lines or substitute shapes.

Make the food, ingredient, tool, or material the largest and clearest part of the click reaction. A chef pointing is supporting motion only. It is too small to serve as the main response at the world-camera distance.

| Stand family | Required first reaction | Useful supporting reaction | Do not use as the main reaction |
| --- | --- | --- | --- |
| Grill, skewer, or roast stand | Food turns, lifts, settles, or visibly changes over the heat | Flame flicker, embers, cook movement | Cook pointing while the food stays still |
| Oven or bread stand | Bread puffs, slides forward, rises, or lands on its support | Oven glow, steam, baker movement | Smoke alone |
| Dough or noodle stand | Dough stretches, folds, rolls, or returns to the board | Flour puff, tool movement, worker follow-through | Floating flour with no dough response |
| Tea, coffee, syrup, oil, or sauce stand | The modeled vessel tilts and the liquid action follows its real spout or lip | Cup response, steam, server follow-through | A free-floating line or stream |
| Market or produce stand | A pictured or modeled food item lifts, drops, rolls, or settles within its display | Vendor gesture, hanging produce sway | Moving the canopy, counter, wall, or vendor's whole body |
| Field, orchard, or ingredient source | The crop, fruit, water wheel, basket, or harvested material responds | Leaves, light, birds, worker follow-through | Generic building bounce or unrelated particles |

For each stand, record the reacting subject, support surface, motion direction, return state, camera-arrival time, and possible occluders. Group stands only when the same physical action is correct for all of them. Change the subject, amplitude, and timing so grouped reactions do not feel copied.

The first food or material movement must remain visible when the camera finishes its approach. Hold the result long enough for the visitor to recognise it, then return every object to its exact support. Test at the normal world zoom. If the action is clear only in a close test view, it fails.

Time the reaction against navigation, not only against a close-up test harness. If the camera takes 1.6 seconds to approach a stand, the signature food or tool response must still be clearly visible when that approach finishes and remain readable for a short beat afterwards. Test the actual arrival camera from the directions in which the stand can be selected. Roofs, awnings, walls, neighbouring buildings, and people must not block the reacting subject. Aim the approach at the working surface rather than the building's bounding-box centre when those differ.

Include occasional surprises and keep chatter restrained and non-overlapping. Use a mix of living illustrations, simple animated objects, and cards so that different discoveries offer variety.

### The China standard in numbers

The hotpot house (`hotpot()` in `src/fw/props.ts`) is the measured reference for a main stand. The table in [Building a world, section 5](building-a-world.md#5-stands-the-china-standard) lists its components: a building with a sign, a visible work surface, at least three modelled foods, one always-on food loop, six to nine people with idle motion, a walker on a wall-free path, lanterns under a beam, a steam point, a click chain that moves the food first and speaks last, ambient speech in two languages, and a reaction that returns to rest in about two seconds. A stand that has fewer of these components is below the China standard.

### Mark clickable items with a diamond

Use a small diamond signal to identify clickable items, following the existing Turkey design. Turkey's explorable buildings use a steady ivory-and-brass diamond above the destination; decorative houses have no marker. See the [Turkey world reference](turkey-world.md#historical-stories-and-quiet-discovery).

- Apply the same diamond convention to clickable places, objects, and food discoveries in new areas
- Position the marker precisely on or above its subject, and make sure it opens that subject's relevant content
- Keep the marker small and steady, without flashing or flickering
- Make it visible on desktop and phones without covering the pictured food or important scene details
- Leave non-interactive decoration unmarked, and ensure every marked item responds to selection

### Strict visual and spatial rules

| Prohibited defect | Required result |
| --- | --- |
| Flickering, flashing, or competing surfaces | Stable rendering while still, moving, zooming, and changing views |
| Broken roads or disconnected paths | Continuous visible routes, including diagonal joins, stairs, and bridge approaches |
| Cut-off rivers | A continuous watercourse with a plausible source and destination or a clean continuation beyond the scene |
| Unnatural river merges | Connected banks and water surfaces, plausible flow, and a smooth meeting with other water or the sea |
| Abrupt or artificial terrain endings | Natural transitions and credible edges to the landscape |
| People crossing walls, water, or each other | Clear routes with appropriate crossings and enough space for bodies and carried objects |
| Floating buildings, people, or props | Visible contact with the ground or the surface that supports them |
| Unsupported seating | Seated people visibly supported by their chair, bench, or other seat |

Use the supplied concept as the composition guide, but resolve roads, banks, supports, and movement as a coherent 3D space. Do not reproduce a drawing artifact as a broken connection in the world.

**Handoff:** An explorable area with connected routes, varied buildings and people, natural movement, and working links from places to their intended rooms. Keep it available for review before publication; the proposed owner-preview controls are tracked in the [product roadmap](product-roadmap.md).

## 4. Make the paintings live and add small food discoveries

Make each living illustration visibly alive from the moment it opens, without requiring a click. Add gentle motion where it fits the painting: Rising smoke or steam, drifting leaves, birds crossing, swaying lanterns, light rain, soft oven glow, or a small food-preparation action backed by a real movable layer. Water may move only through a separately verified reflection, mask, or traced painted stream. Movement must be noticeable, crisp, and attached to something plausible in the picture, while leaving its food and atmosphere easy to see.

Give each room one **signature food, craft, or landscape motion** that distinguishes it from the other rooms. Prefer an action named by the room itself only when the supplied art includes a separate movable layer or a clean source detail that can actually support it: Noodles stretch and slap, bread puffs, a steamer lid breathes, skewers turn, tea or wine pours, syrup or oil flows, grain is winnowed, or a boat leaves a wake. Otherwise choose a strong painting-native cue such as a sun ray, birds, rain, mist, flame, steam, or a hanging ingredient moving in the wind. Water is not a safe generic cue: use it only when an existing reflection or stream can be traced without crossing another subject. Never draw an approximate food, utensil, hand, wake, shadow, or liquid shape over a finished painting just to satisfy the signature-action requirement.

Use Sichuan hotpot as the upper bound for animation density. At rest, show no more than four readable continuous loops: one dominant signature action and up to three subordinate environmental, heat, light, or atmospheric cues. Most rooms should use fewer. A click may add one short accent or temporarily make the signature action stronger. Stagger the loops so that they do not peak together, and quiet background motion briefly when a click reaction needs visual priority.

### Live-image motion standard

The default room needs two or three clearly readable ambient cues. One barely visible effect is not enough. Use four only when the composition has enough space and the result stays no more complex than Sichuan hotpot.

Build the live image from these roles:

- One dominant cue that identifies the room, such as a lantern sway, bubbling pot, moving mist, oven glow, falling leaves, or a source-supported food process
- One local supporting cue attached to pictured food or craft, such as steam from a pot, rice, tea, bao, or a griddle
- One optional environmental cue, such as a coherent sun ray, distant birds, outdoor snow, or restrained foliage motion

Every cue must be clearly visible at normal display size within a short watch. Subtle variation is good after the cue is readable. Do not make low opacity or tiny displacement the only evidence that an effect exists.

Choose only motion that the painting can physically support:

| Pictured source | Acceptable motion | Required boundary |
| --- | --- | --- |
| Hot food, tea, rice, or steamer | Steam rises from each visibly active source | Steam begins at the food or vessel opening, not a nearby hand, board, face, or table |
| Lantern, chilli, garlic, grapes, tassel, bell, or hanging leaves | A tight source-derived layer pivots from its real tie point | The isolated layer contains no wall, shelf, canopy, face, hair, or body pixels |
| Existing flame or lamp | Small flame variation or coherent local light flicker | The light belongs to the pictured lamp or fire and does not make a wall pulse as one object |
| Open sky | Occasional near or distant bird movement | Keep one consistent scale and depth; a far bird stays far away |
| Outdoor opening | Snow, leaves, mist, smoke, or sunlight suited to the pictured weather | The effect stays outside and does not cross the room interior |
| Water or a painted liquid stream | Source-derived glint or masked reflection only | The mask follows existing water pixels and excludes faces, boats, banks, posts, flowers, and land |

Sunlight must read as one coherent ray through the scene. Do not brighten only one food item when the light direction implies that the surrounding air and nearby surfaces share the same beam.

Keep effects attached to their source. Steam comes from the pictured hot food, leaves move around their stems, and waves stay inside the water. Tune their positions separately for wide and portrait paintings. Vary timing so the whole room does not pulse together.

Treat the finished painting as the source of truth. A live-image effect may use one of three methods:

1. Animate a supplied transparent layer, as with the Sichuan lanterns
2. Add a natural emitted effect whose source and boundary are visible, such as steam, rain, water glints, mist, light, birds, sparks, or a narrow oil stream from a pictured spout
3. Reuse a very tight crop of the painting only for a clearly isolated hanging detail such as chilli, garlic, herbs, a grape cluster, cloth, or a lantern; anchor it at the pictured tie point and move it by only a few visible pixels

Do not use a broad rectangular crop, move a crop that includes a face or body, or invent a replacement silhouette with canvas lines and ellipses. If a clean layer cannot be obtained, keep the food still and animate a natural part of the environment instead. A world stand's signature verb and a finished room painting are different systems: the 3D stand can move its modeled food and tools, but the painting cannot depict a new physical action without suitable source art.

A rectangular coordinate box is a clip, not proof that an effect belongs inside it. Never scatter generic wave strokes across a water box: boats, faces, posts, banks, and distant land can all occupy the same rectangle. Water in a finished painting may move only through isolated authored reflections or a source-derived mask that excludes every other subject. If those marks cannot be isolated, leave the water still and animate steam, light, weather, birds, or foliage instead.

Treat painted liquid streams even more strictly. The stream's bounding box is not its path. A real painted syrup, tea, or oil stream may receive a short travelling highlight inside its exact silhouette, but the code must not redraw the stream from the box's top to bottom. Configure wide and portrait independently; when one composition has no stream, it gets no liquid effect.

Correct a physically wrong source painting before animation. For a pour, first check the vessel's 3D orientation: The receiving-side rim must be the low edge, and the liquid must leave that edge with a natural gravity curve. Moving the overlay attachment point cannot repair a jar, kettle, or spoon that faces the wrong way. Save and review the corrected wide or portrait asset independently; do not change the other orientation unless it has the same defect.

Before coding, make a wide-and-portrait motion matrix for every room. For each planned effect, record the pictured source, its exact boundary, its anchor, and forbidden overlap zones such as faces, hands, flowers, signs, roofs, and unrelated objects of a similar colour. A colour-based mask is only a starting point: inspect the isolated foreground and reconstructed background themselves. Reject a mask if it contains any part of a person or another object, even when a pixel-difference test passes.

Use gentle flame movement and small variations in lamplight for natural light flicker. Rendering surfaces must remain stable, without flashing or competing geometry. Avoid blurry image patches, excessive swaying, and whole-scene motion that causes dizziness. Complete paintings must not receive duplicate people, furniture, or food overlays.

Choose environmental motion because it belongs to the place, not because an effect is available. Canal ripples, irrigation flow, or a ferry wake are valid only when their exact painted surface is isolated and free of people, boats, banks, posts, and reflections that must remain still. Otherwise use a safer place-specific cue such as snow at a winter table, chaff at harvest, vine leaves under a trellis, changing light, or birds in genuine open sky. Birds should be occasional, crisp, and large enough to read; do not add them to every outdoor room.

Support the existing reduced-motion preference. Remove or simplify non-essential travel, swaying, falling, and parallax motion while keeping the scene understandable through stable light, opacity, or a restrained local state change. Do not create a separate motion setting for one area.

Focus room interactions on a few small food or ingredient details that are actually visible in the image. Choose details that can reveal a surprising, well-supported story.

Use this interaction sequence:

1. The visitor notices the diamond marker and selects its pictured food, ingredient, or tool
2. The scene gives a small local reaction, such as steam, a pour, or a gentle highlight
3. A concise discovery explains one interesting fact tied to that exact detail
4. A story card with depth, a related place, or a suitable recipe lets the visitor continue

Identify what is visible before writing the discovery. If a painted dish is ambiguous, choose a clearer ingredient or tool rather than inventing a precise dish identity. Keep sources with the story, and make the tap target work in both compositions.

### Give story cards depth

The initial discovery is short. The story card provides substantive content about food history, ingredients, and related dishes. Write connected explanations that help the visitor understand how the food developed and why it matters.

A story card should connect:

- When a tradition emerged or became established, what evidence supports that timing, and how its preparation or role changed over time
- Its key ingredients, where they come from, and why they matter to the dish
- Why local geography matters to the ingredients, preparation, or food customs
- The dishes and techniques associated with it, including meaningful regional or household differences
- How the food spread, and the people, work, trade, migration, or everyday customs that shaped it, where relevant
- How it is prepared, served, or enjoyed today
- Related discoveries, places, or recipes that the visitor can explore next

Use concrete details and sources. Explain the connection between facts instead of presenting a list of trivia. Distinguish documented history from origin legends or disputed claims, and avoid unsupported dates or invention claims. Scale the card to its subject; a narrow ingredient detail still deserves a specific, developed explanation.

As more worlds become available, connect relevant stories across them through ingredients, dishes, techniques, or documented historical routes. Make the relationship clear and let visitors follow it into another world. This direction is tracked as topic 11 in the [product roadmap](product-roadmap.md).

**Handoff:** Living rooms with restrained motion, accurate interaction positions, short discoveries, substantive sourced story cards, and a return path to the visitor's previous place.

## Compose for phones as carefully as for desktop

Review portrait framing, hotspot placement, visible animation, diamond readability, and zoom limits separately from desktop. Do this while designing and integrating each room, so the phone experience informs the composition. Keep important subjects and their markers readable within the portrait view.

Keep navigation behaviour consistent across regions and the interface quiet. Verify room entry, discoveries, zoom, and return navigation at phone sizes. A zoom gesture must keep the visitor in the current place.

## Review the area in use

Compare the design with the strongest existing areas early, while the composition and first interactions are still easy to revise. Inspect the area in a running browser throughout the build and again when complete, both on desktop and at phone sizes. Check overview and close views from several camera angles while panning, zooming, and letting movement run.

Judge the experience by watching and exploring it. Watch rooms without clicking, try different object types, and follow routes. An animation that passes a technical check still needs to feel natural and noticeable. Still images alone cannot establish that roads, water, or animation behave correctly.

Do not approve ambience from a total changed-pixel count. That measurement can be satisfied by a different effect while the intended rain, stream, or moving detail is absent or misplaced. Give each important effect a semantic check of its own: the correct orientation survives the motion budget, the source and forbidden zones are respected, invented full-path geometry is absent, and the effect reaches a readable size or displacement. Then watch that exact effect over the real painting at desktop, large-screen desktop, and phone sizes.

### Prevent the failures found during the China, Xinjiang, and Turkey polish passes

| Failure cause | Typical symptom | Prevention rule |
| --- | --- | --- |
| The implementation starts from an effect name instead of the painting | Fake wakes, streams, shadows, food, or utensil lines appear over the artwork | Start from a visible source and reject the effect when no clean source or boundary exists |
| A rectangle is treated as the moving subject | A face, wall, shelf, canopy, or background moves with chilli, garlic, or grapes | Inspect the extracted foreground and reconstructed background, not only the final frame |
| Wide coordinates are reused for portrait | Steam, snow, rain, or liquid appears on the wrong object or inside the room | Specify and verify separate source, anchor, and forbidden zones for each orientation |
| Technical pixel change is treated as visual approval | The test passes but the intended animation is invisible | Give every required cue a named semantic check and watch it at actual display size |
| The weakest available motion becomes the stand reaction | A chef points, smoke appears, or light changes while the food stays still | Make the modeled food, ingredient, tool, or material react first and most visibly |
| Particle count replaces composition | A room has many effects but no clear focal action | Keep one dominant cue, add only one or two supporting cues, and stagger their timing |
| A source-art defect is patched with an overlay | A liquid stream attaches correctly but the vessel still pours uphill | Correct the asset's object orientation and physical geometry before adding motion |
| A distant cue changes scale during its path | A far bird appears to fly into the foreground | Keep depth, size, speed, and path consistent for the full cycle |

Create one animation matrix before implementation. Use one row per stand or room orientation and include:

- Stand or room ID and wide or portrait orientation
- Pictured or modeled source and its support surface
- Dominant reaction and supporting cues
- Exact origin, anchor, direction, and allowed boundary
- Forbidden overlap zones
- Expected visibility at normal zoom and camera arrival
- Stable return state and repeated-click limit
- Reduced-motion result
- Browser review status at phone, desktop, and large-screen desktop sizes

- Compare the overall composition, room paintings, and props with the concept and style references
- Check neighbourhoods, country boundaries, room for expansion, and the transition from busy settlement to landscape
- Follow the roads, bridges, river, banks, and river mouths through the full scene
- Watch people through walking, pausing, turning, and interacting, including crowded places
- Confirm that no rendering flicker, broken connections, collisions, floating objects, or unsupported seating appear
- Check that clickable items have clear diamond markers, decorative items remain unmarked, and every marked target responds on desktop and phones
- Try different object types and check that their actions fit the object, keep supports grounded, and avoid overlapping chatter
- Confirm that each interactive stand has a readable signature verb and that its food or material responds before speech or crowd movement
- Confirm that the signature reaction remains visible at camera arrival and is not hidden by a roof, awning, wall, neighbour, or the stand's own facade
- Repeat clicks and confirm that clones, particles, falling items, and transforms stay bounded and return to a stable state
- Open every room and try each food discovery in its wide and portrait composition
- Watch each room before clicking and confirm that motion is visible, crisp, plausible, and comfortable
- Confirm that each room has one recognisable signature motion, no more than four readable continuous loops, one clear visual hierarchy, and no generic effect added only to make the frame busier
- Check that effects stay on their pictured source and do not hide important details or move the entire scene
- Confirm that every moving object already exists in the supplied art, every source crop is tight and top-anchored, its isolated mask contains only the intended object, and no invented canvas geometry imitates food, hands, utensils, shadows, wakes, or pouring liquid
- Inspect wide and portrait animations independently at their actual display size, then repeat the wide check on a large screen where thick lines, seams, and misplaced layers are easier to see
- Check the area's reduced-motion state and confirm that non-essential movement is removed or simplified without hiding interaction feedback
- Check portrait framing, hotspots, markers, animation, and zoom limits separately, and verify that zooming and returning from a room preserve the visitor's place
- Check discoveries against the pictured details, and read full story cards for historical depth, ingredient and dish connections, and source support

Record what was checked and what remains unresolved. Treat mobile viewport checks and physical-phone checks as separate evidence. Save the final assets, prompts, inventory, and review notes with the area's documentation so the method can be repeated and the area can be revised.

## Reusable Codex handoff

> Create the new Food World area described in the attached brief. Follow `docs/new-area-methodology.md`. Make it feel like a place people live in, with food as the way to explore it. Use the concept image as the spatial blueprint and the room paintings for the scenes opened from its places. Let references guide composition as well as style. Plan recognisable neighbourhoods, clear country boundaries, future expansion, winding streets, irregular clusters, layered heights, and framed views before adding detail. Balance busy markets and courtyards with believable countryside. Include everyday food culture alongside landmarks, varied houses, and distinct people in historically appropriate clothing with purposeful, natural movement.
>
> Make the world react first through actions suited to each object, occasional surprises, and restrained, non-overlapping chatter. Give each interactive place one signature verb. On click, let the food, tool, material, or water respond first, the worker follow, and at most one nearby person acknowledge it; speech comes after the physical response. A chef pointing or smoke alone is not a sufficient primary reaction. Keep reactions visible through the full camera approach, bounded under repeated clicks, grounded on their supports, and unobscured at arrival. Use small, precisely placed diamond markers matching Turkey, each opening relevant content. Combine illustrated rooms, simple animated objects, and cards. Make rooms visibly alive as soon as they open, normally with two or three readable cues and never more than four continuous loops. Keep one cue dominant and the rest subordinate. In finished paintings, animate only supplied transparent layers, tightly cropped isolated hanging details, or natural emitted effects attached to a visible source; never draw approximate food, hands, utensils, wakes, shadows, or liquid over the image. Inventory the source and forbidden overlap zones separately for wide and portrait, and inspect every isolated mask so a person or unrelated object can never move with it. Correct physically wrong source art before adding an overlay. If the painting cannot support a food action, use a strong place-specific environmental cue instead. Keep wide and portrait coordinates separate and respect the existing reduced-motion preference. Avoid blurry patches, generic hopping or dish sliding, excessive swaying, and whole-scene motion. Strictly prohibit flickering surfaces, broken roads, cut-off rivers, unnatural river merges, floating objects, unsupported seating, and people crossing walls. Walking steps must match travel and stop when people stop.
>
> Follow place → food → story. Start with short discoveries, then offer sourced stories with historical and cultural depth, ingredients, dishes, geography, how traditions spread, and how people practise them today. Distinguish documented history from legends. Connect relevant foods across available worlds and offer suitable practical recipes. Compose and check phone framing, hotspots, markers, animation, and zoom limits separately. Keep navigation consistent and the interface quiet. Compare against the strongest existing areas early, watch rooms before clicking, try different object types, and inspect routes from several angles in the running application. Record both technical checks and what the experience looks and feels like in use.

Attach the area brief, concept image, style references, room paintings, useful props, inventory, and story sources to that handoff.
