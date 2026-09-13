# How to create a new Food World area

This is the author's method, documented on 2026-09-13. Use it for a new country, region, or neighbourhood. ChatGPT researches the area and generates its visual assets. Codex uses those assets to build the explorable world and its living rooms.

The sequence is **Research and concept image → room paintings and useful props → 3D community → gentle animation and food discoveries**.

The visitor experience follows **Place → food → story**. The place draws the visitor in, a visible food detail invites interaction, and a short story rewards curiosity. Keep deeper reading optional.

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

Ask ChatGPT to generate an overall concept image that Codex can use as a spatial blueprint. Show how the community fits together: Building clusters, streets, squares, food places, farms or gardens, water, bridges, and landmarks. Make the connections readable enough to guide construction.

Attach the chosen style references. They define the illustration's colour, texture, lighting, proportions, and level of detail. Adapt the subjects to the new area; give its people distinct faces, clothing, and activities.

**Handoff:** The concept image, the research brief and sources, and an annotated list of the places visible in the concept. Identify any connections that the image leaves unclear before building them.

## 2. Research and generate food-room paintings and props in ChatGPT

Plan the rooms as a set before generating them. Give each room a clear food purpose and connect it to a place in the concept image. Include the breadth of local food culture, from everyday meals and ingredient production to regional traditions and special occasions.

Use the [original UK scene-generation prompt](examples/uk-scene-generation-prompt.txt) as an example of the structure. It includes cultural scope, visual language, room briefs, a reduced prop list, and regional balance. Replace its UK-specific subjects for each new area. It is an example brief, not a researched source for historical claims.

Attach reference images to the generation request. Add this instruction to the area-specific prompt:

> Use the attached images as the style reference for colour, brushwork, texture, lighting, proportions, and detail. Keep that style consistent across the concept, rooms, and props. Create people, architecture, food, and objects appropriate to the new area. Each full room must feel complete on its own. Separate props are only for animation, interaction, or scene layering.

For each room, record its purpose, foods and ingredients, people and activities, atmosphere, possible discoveries, and useful motion. Generate one room at a time and inspect it against the references before continuing.

### Image-production rules

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

- Keep geography, buildings, routes, and everyday activity close to reality, within the miniature world's scale
- Cluster houses and food places into a busy community with shared streets, courtyards, squares, and gathering places
- Vary building footprints, heights, roofs, materials, entrances, and orientation while keeping the area's architectural identity
- Combine food venues, ingredient sources, homes, and local famous places so that they form a connected neighbourhood
- Connect doors and gathering places to usable roads, paths, stairs, and bridges
- Give food venues the dishes and ingredients that belong there

People must vary in age, height, build, clothing, and activity. Use locally grounded ancient, historical, and traditional clothing styles, as specified in the area brief. If the world combines periods, record that choice; do not describe it as an exact reconstruction of one era.

Give people varied and natural movement: Different routes and speeds, pauses to browse or talk, gradual turns, carrying food, preparing ingredients, sitting, serving, and other local activities. Walking steps must match travel; feet must meet the ground and carried objects must stay in the hands. Avoid synchronized crowds and repeated identical motion.

### Strict visual and spatial rules

| Prohibited defect | Required result |
| --- | --- |
| Flickering, flashing, or competing surfaces | Stable rendering while still, moving, zooming, and changing views |
| Broken roads or disconnected paths | Continuous visible routes, including diagonal joins, stairs, and bridge approaches |
| Cut-off rivers | A continuous watercourse with a plausible source and destination or a clean continuation beyond the scene |
| Unnatural river merges | Connected banks and water surfaces, plausible flow, and a smooth meeting with other water or the sea |
| People crossing walls, water, or each other | Clear routes with appropriate crossings and enough space for bodies and carried objects |
| Floating buildings, people, or props | Visible contact with the ground or the surface that supports them |

Use the supplied concept as the composition guide, but resolve roads, banks, supports, and movement as a coherent 3D space. Do not reproduce a drawing artifact as a broken connection in the world.

**Handoff:** An explorable area with connected routes, varied buildings and people, natural movement, and working links from places to their intended rooms. Keep it available for review before publication; the proposed owner-preview controls are tracked in the [product roadmap](product-roadmap.md).

## 4. Make the paintings live and add small food discoveries

Add gentle motion where it fits the painting: Rising smoke or steam, swaying leaves, moving water and small waves, light rain, soft oven glow, or a small food-preparation action. Motion should make the scene feel alive while leaving its food and atmosphere easy to see.

Keep effects attached to their source. Steam comes from the pictured hot food, leaves move around their stems, and waves stay inside the water. Tune their positions separately for wide and portrait paintings. Vary timing so the whole room does not pulse together.

The UK example mentions fire flicker. Implement this as gentle flame movement or a soft glow, subject to the strict rule against visible flashing or rendering flicker. Complete paintings must not receive duplicate people, furniture, or food overlays.

Focus room interactions on a few small food or ingredient details that are actually visible in the image. Choose details that can reveal a surprising, well-supported story.

Use this interaction sequence:

1. The visitor notices and selects a pictured food, ingredient, or tool
2. The scene gives a small local reaction, such as steam, a pour, or a gentle highlight
3. A concise discovery explains one interesting fact tied to that exact detail
4. A story card with depth, a related place, or a suitable recipe lets the visitor continue

Identify what is visible before writing the discovery. If a painted dish is ambiguous, choose a clearer ingredient or tool rather than inventing a precise dish identity. Keep sources with the story, and make the tap target work in both compositions.

### Give story cards depth

The initial discovery is short. The story card provides substantive content about food history, ingredients, and related dishes. Write connected explanations that help the visitor understand how the food developed and why it matters.

A story card should connect:

- The food's historical setting and how its preparation or role changed over time
- Its key ingredients, where they come from, and why they matter to the dish
- The dishes and techniques associated with it, including meaningful regional or household differences
- The people, work, trade, migration, or everyday customs that shaped it, where relevant
- How it is prepared, served, or enjoyed today
- Related discoveries, places, or recipes that the visitor can explore next

Use concrete details and sources. Explain the connection between facts instead of presenting a list of trivia. Distinguish documented history from origin legends or disputed claims, and avoid unsupported dates or invention claims. Scale the card to its subject; a narrow ingredient detail still deserves a specific, developed explanation.

As more worlds become available, connect relevant stories across them through ingredients, dishes, techniques, or documented historical routes. Make the relationship clear and let visitors follow it into another world. This direction is tracked as topic 11 in the [product roadmap](product-roadmap.md).

**Handoff:** Living rooms with restrained motion, accurate interaction positions, short discoveries, substantive sourced story cards, and a return path to the visitor's previous place.

## Review the area in use

Inspect the complete area in a running browser, both on desktop and at phone sizes. Check the overview and close views while panning, zooming, and letting movement run. Still images alone cannot establish that roads, water, or animation behave correctly.

- Compare the overall composition, room paintings, and props with the concept and style references
- Follow the roads, bridges, river, banks, and river mouths through the full scene
- Watch people through walking, pausing, turning, and interacting, including crowded places
- Confirm that no rendering flicker, broken connections, collisions, or floating objects appear
- Open every room and try each food discovery in its wide and portrait composition
- Check that effects stay on their pictured source and do not hide important details
- Verify that zooming and returning from a room preserve the visitor's place
- Check discoveries against the pictured details, and read full story cards for historical depth, ingredient and dish connections, and source support

Record what was checked and what remains unresolved. Treat mobile viewport checks and physical-phone checks as separate evidence. Save the final assets, prompts, inventory, and review notes with the area's documentation so the method can be repeated and the area can be revised.

## Reusable Codex handoff

> Create the new Food World area described in the attached brief. Use the concept image as the blueprint for the 3D community and use the room paintings for the scenes opened from its places. Follow `docs/new-area-methodology.md`. Preserve the supplied reference style. Build a believable, busy community with varied houses, food places, ingredients, local landmarks, and distinct people in the area's ancient and traditional styles. Give people natural, varied movement. Strictly prohibit flickering, broken roads, cut-off rivers, and unnatural river merges. Add gentle motion to the paintings and a few interactions tied to visible food or ingredient details with surprising, sourced discoveries. Give the full story cards depth through food history, ingredients, and related dishes, with meaningful connections to other worlds where available. Verify the world and all rooms in the running application at desktop and phone sizes, and record the results.

Attach the area brief, concept image, style references, room paintings, useful props, inventory, and story sources to that handoff.
