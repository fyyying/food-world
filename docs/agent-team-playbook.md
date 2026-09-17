# Agent team playbook: building an area without the owner

This playbook tells a small team of agents how to build a Food World area from a kick-off message to a published result at the China standard. It divides the work, names the owner of each file, fixes the order, and states when the work is done.

Read first, in this order:

1. [New-area methodology](new-area-methodology.md): the quality standard
2. [Art direction](art-direction.md): the picture standard
3. [Building a world](building-a-world.md): the code
4. [Turkey world](turkey-world.md): a finished example with its animation inventory

Section 6 names the model for each step.

## 1. The kick-off message

The owner starts the work with one message. It names the area and attaches or points to the delivered pictures. Example:

> Build out Spain in the Mediterranean world to the China standard. Paintings and props are in `~/Downloads/additional game asset/spain`. Follow the docs.

When a picture set is missing, the team writes the image brief (section 4, stage A) and stops. Image generation happens outside the repository. The team resumes when the files arrive.

The area may join an existing world, as Turkey joined the Middle East world, or start a new world. The lead decides from `graph.ts`: when the area id already exists in the `Area` union, it joins its world.

## 2. Roles and file ownership

Seven roles. One agent can hold two roles when the area is small. Two agents never edit the same file in the same stage. The lead coordinates; every other role is an agent the lead briefs and reads. Section 6 names the model for each.

| Role | Owns | Produces |
| --- | --- | --- |
| Lead | `world-<world>.ts`, `graph.ts` registrations, `main.ts`, `ui.ts` hooks, `README.md`, `docs/<id>-world.md` | The plan, the layout blueprint, the registration, the final review and the publish |
| Researcher | `<id>-objects.ts`, `<id>-stories.ts`, `<id>-repertoire.ts`, `scene-discoveries.ts` entries, `world-intros.ts` entry | The area brief, object list with blurbs, the repertoire of every place, story depth with sources, discovery texts, ambient speech lines |
| Builder | `<id>-landscape.ts`, `<id>-architecture.ts`, `<id>-town.ts`, `<id>-people.ts`, `<id>-countryside.ts` | Terrain, water, roads, houses, residents, walkers, countryside |
| Stand maker | `props-<id>.ts`, `scripts/tests/<id>-reactions.mjs` | One stand per object with the China click chain, ambient chat, details |
| Room maker | `scenes-<id>.ts`, `<id>-ambience.ts`, `scene-props.ts` entries, `scripts/scenes/import-<id>.py`, `public/scenes/**` | Imported paintings, room configs, touches, ambience, card art |
| Fix agent | Whichever file the fix lives in, named in its brief | One repair from the review or the owner walkthrough, with its verification |
| Auditor | Nothing. It runs commands and reports | Test and audit runs, motion captures, contact sheets, baseline numbers |

The lead also runs the reviewer pass in stage E. A different agent from the author reviews each file. Repairs go to a fix agent with a brief, never to the lead's own hands.

## 3. Shared contracts

Agree these before parallel work starts. The lead writes them into `docs/<id>-world.md` under "Blueprint" and every agent reads that section.

| Contract | Content | Written by |
| --- | --- | --- |
| Object list | `id`, `name`, `kind`, `area`, `pos`, `prop`, `scene`, one-line purpose | Researcher proposes, lead fixes positions |
| Repertoire | Per room and per place-or-dish object: the hero dish first, then what that kitchen cooks, each with its local name and one line | Researcher |
| Recipe matching | Not a contract for the area. Recipes are an optional add-on, built and agreed separately after the area ships | Nobody, during the area |
| Layout blueprint | Table size, area centres, clusters, road list with endpoints, water curves, landmark positions, walker loops | Lead |
| Palette | Named colours for walls, roofs, trim, paving, ground tints, water | Builder |
| Resident styles | Six to eight clothing profiles as data | Builder |
| Room list | Room id, folder, object that opens it, three discovery subjects, signature motion, wide and portrait dimensions | Room maker |
| Speech lines | Four to eight lines per stand in the local language plus English | Researcher |
| Animation matrix | One row per stand and per room orientation, as the methodology requires | Stand maker and room maker |

Ids are the contract. Once the object list is fixed, nobody renames an id without telling the lead.

## 4. Stages

Each stage ends with a check. The next stage starts only when the check passes.

### Stage 0: Session start (Lead)

The lead runs this before any other work, in every new session, including a session that only coordinates.

1. Read the four documents listed at the top of this playbook
2. Run `npm run typecheck` and `npm test`. Every harness passes before work starts; a failure is the first task
3. Run `node scripts/audit/objects.mjs` and compare with the [quality baseline](quality-baseline.md). Every area keeps at least its recorded number of card-only clickables
4. Run `uv run --with pillow --with numpy --with scipy scripts/audit/breeze-masks.py <out dir>` when any mask changed since the baseline, and look at the grey panels
5. Open the dev server and look at the live world for two minutes: the China clusters, the Turkish town, one room in each orientation. Anything that floats, flickers or crosses a wall goes on the task list before the kick-off work
6. Post the baseline result as the first status. The lead is accountable for every number in the baseline until the session ends and updates the baseline file when the numbers change

Look at the world with the **Recipes** add-on off, which is its default. That is the picture every area is built and reviewed against.

Check: Type check and all harnesses pass, the baseline numbers hold, and the lead has seen the live world.

### Stage A: Research and brief (Researcher, Lead)

1. Research the area: landscape, architecture, food culture, ingredients, everyday activities, clothing, period. Keep the sources
2. Write the area brief and the object list. Ten to fifteen objects with rooms, five to ten ingredient stops, three to six landmarks
3. With the object list, deliver the **repertoire**: for every room and every place-or-dish object, what that kitchen cooks — the hero dish first, then the dishes the place is really known for, each with its local name and one line of 12 to 25 words. It goes into `src/fw/<id>-repertoire.ts` as `<ID>_REPERTOIRE`, keyed by object id. A place is not one dish, and a single-dish place gets a list of one; a landmark with no kitchen gets none (handbook section 6.1)
4. Write the image brief from `docs/examples/spain-scene-generation-prompt.md` and the art direction. When pictures do not exist yet, hand the owner the final brief with the exact file names and the folder to drop them in, then stop and wait. Do not start Stage B on guessed pictures

Check: The object list has unique ids, every object has a `kind`, an `area` and a purpose, and every historical claim has a source. **Every kitchen room and every place-or-dish object has a repertoire** — a landmark room with no kitchen is the only exception — hero first, each line 12 to 25 words, each key a real object id, each `recipe` id exact (`node scripts/tests/repertoire.mjs`). A place left with no list goes back at this check, not at the walkthrough. A card-only object's blurb is accepted at the same length as its neighbours': it sits in the file's own length band, which is three paragraphs — identity, record, and a route out — with sources. The Turkish market's sumac card shipped at two sentences in a file whose other stall cards run to three paragraphs, and the owner found it by opening it. A thin card goes back at this check, not at the walkthrough.

### Stage B: Blueprint and assets (Lead, Room maker)

1. Lead draws the layout blueprint on paper coordinates: clusters, roads, water, landmarks. Clusters are dense and separated; roads connect every door
2. Room maker inspects each delivered picture against the art-direction acceptance check. Rejected pictures go back for regeneration with a one-line reason
3. Room maker writes `import-<id>.py`, runs it, and runs the cutter for sprites. Sizes appear in `scenes-props.json`
4. Room maker opens `scripts/tests/room-audit.html` and confirms every room shows in both orientations

Check: `scenes-props.json` has every room with `wide` and `portrait`; every picture passed acceptance; the blueprint lists every object position.

### Stage C: Parallel build (Builder, Stand maker, Room maker, Researcher)

Work proceeds in four file sets at once.

Builder:

1. Landscape and water first, roads second, architecture third, town clusters fourth, residents and walkers fifth, countryside last
2. After each step run `npm run typecheck` and `npm test`, then look at the world in the browser at 1280 x 720 and 390 x 844

Stand maker:

1. Build the main stands first, then ingredient stops, then details
2. Follow the stand standard in the handbook: modelled food, always-on loop, six to nine people, click chain food first and speech last, ambient chat, `ownReaction`
3. Write `<id>-reactions.mjs` as the stands grow. Every stand appears in it
4. Look at each stand's silhouette from the arrival camera before handing it over. A stand that builds its own decor — a field house, a shelter, a shade — owns that decor's read from above exactly as the town's decor does, and the stand's own buildings count as blockers in the visibility check. The Albufera rice fire built itself a barraca behind the pan; from above it read as a white block with a folded roof and a red bar, and the owner asked for it to be removed

Room maker:

1. For each room: measure wide coordinates and portrait coordinates on the actual files
2. Write the `paintedScene` config, two or three touches, the `PAINTED_SIGNATURES` entry and the ambience patches
3. Inspect every `breeze` mask alone before enabling it
4. Watch each room for twenty seconds in both orientations before moving on

Researcher:

1. Write blurbs to the China blurb standard, story depth with dated records, `NEXT` links, discovery texts, speech lines, the world intro
2. Deliver them into the owned files so the lead can register them

Check: `npm run typecheck` and `npm test` pass on every agent's branch; each agent posts screenshots of their work at both sizes.

### Stage D: Integration (Lead)

1. Register everything with the handbook's checklist
2. Merge the branches. Resolve only registration conflicts; ask the owner to fix anything inside their files
3. Run `npm run typecheck`, `npm test`, `npm run build:pages`
4. Enter the world in the browser, walk every road, click every stand, open every room, at both sizes

Check: The world enters, every object opens a card or a room, no console errors, every road connects, nothing floats.

### Stage E: Review against the China standard (Lead as reviewer, one other agent)

Two agents review. Neither reviews their own files. They use the definition of done in section 5 and record each line as pass or fail in `docs/<id>-world.md`.

Failures return to the owning role. The stage repeats until every line passes.

### Stage E2: Owner walkthrough (Reviewer, then Lead)

Required before Stage F. Stage E checks the area through harnesses, audits and the definition of done. This stage checks it the way the owner does, by looking at it. Spain passed Stage E at two in the morning with chilli strings cut out of the paintings, a glint across a pourer's face, a straight cut across a sunbeam, a pour that crawled, dry cups and bowls, twenty-four houses hemming in the stands, arcades that read from above as a bridge half in the water, people sliding without moving their legs, a mule circling tail-first, static fountains and smoke born inside the roofs. Ten minutes of the owner looking found all of it. The harnesses are not the review; they are what keeps a fixed defect fixed.

1. A reviewer who did not build the area opens **every room for ten seconds in both orientations**, 390 x 844 and 1280 x 720, watching before clicking. Ten seconds is long enough to see a pour crawl, a glint miss its stream, a string swing with its cut edge, a cup that should steam and does not
2. The reviewer flies the whole table at the **overview zoom**, then visits **every cluster at approach zoom**, and looks at each decor type from above for what it reads as. One shot is taken at the world's **maximum zoom-out**, not at a comfortable overview distance: the fog is derived from that limit, and a table that reads at 130 can still render flat in the paper colour at 215. At the limit the table must read, with only a light haze at the far corner
3. The reviewer runs the visibility check **on the live page, after a fresh load**: ten rays per clickable object along the arrival direction, and the first thing each ray meets must be that object. The offline harness builds the world without the browser around it, so the live page is the authority and the harness is what keeps a fixed defect fixed
4. The walkthrough is done with the **Recipes add-on off**, which is how it ships. A card ends at its last chip and a room's actions hold only "The story"; a wrong or random dish belongs to the recipe task, not to this list
5. The reviewer opens **every card**, not only every room. A card-only object whose blurb is visibly shorter than its neighbours' is a walkthrough defect and goes on the list; the owner opens cards, and a two-sentence blurb among three-paragraph ones is what she reads
6. At **390 x 844 the reviewer checks that every cue actually draws**. A phone shows only the middle band of a wide painting after the fit, so a patch measured outside that band draws nothing at all. A cue that draws zero lit pixels at phone width fails, however well it reads on the desktop. Read the room's own effect canvas rather than trusting the configuration
7. The reviewer writes down **everything that looks odd**, in plain words, in one list in `docs/<id>-world.md`, without first deciding whether it is a defect. "The thing by the river looks like a bridge half in the water" is a valid entry
8. The **lead does the same walkthrough on a fresh page load**. Restart the dev server through the preview tool; a running page can hold a stale world after HMR and show a defect that is already fixed, or hide one that is not. Never start a second copy on the port
9. Every open item becomes a fix brief for an agent on Opus. Any change to a room's cues re-runs the motion capture (a Sonnet task) before the item is closed
10. The walkthrough repeats after the repairs, on a fresh page load, until the list has no open item
11. **After every publish the walkthrough repeats on the live site itself**, not only on the dev server. The published site is what the owner opens, and the second day's walkthrough of Spain and Turkey — nine items, none of them caught by the dev-server passes — was made on it. Each repeat's list goes into `docs/<id>-world.md` under its own dated heading, as Spain's "Third pass" and "Fourth pass" sections do, so the passes stay separately readable instead of being folded into the first list

Check: the walkthrough list is written down, every item is closed, and the motion capture has been re-run since the last room change. Nothing is handed over to Stage F while the list has an open item. After publication the same check applies to each repeat's dated list.

### Stage F: Publish (Lead)

0. When the area's world is not yet in `PUBLISHED_WORLDS`, publishing the area publishes the whole world, including its unfinished areas. Ask the owner before this stage whether to publish the world as it is, as the Middle East went live with Turkey finished and three areas not, or to dim the unfinished areas first. Do not decide this alone
1. Add the world to `PUBLISHED_WORLDS` when it is a new world, or when the owner has answered yes above
2. Write `docs/<id>-world.md`: what was built, the animation inventory table, what was checked, what remains
3. Commit, push `main`, watch the Pages run, verify the live site on a phone viewport
4. Report to the owner with one contact sheet holding three shots: the whole area, one stand mid-reaction, one room

## 5. Definition of done: the China standard

The area is done when every line is true on the live site.

World:

- Four or more clusters with clear separation, connected by continuous roads. Every door meets a road
- Water is continuous, square at the table edge, and correct in colour. Nothing stands in water
- At least ten interactive stands and five ingredient stops, each with a diamond cue. At least three clickable objects per area are not food stands: an ingredient source, an animal, a tree or a landmark with a card and a 3D reaction (`node scripts/audit/objects.mjs`)
- At least three walker loops or lanes with residents in the area's traditional clothing, steps matched to distance
- Small details in every cluster: hanging produce that sways, stacks, racks, crocks, animals in pens
- Decorative houses are capped: 12 to 16 in the area, 1 to 3 per style. Nothing solid stands on a road centreline. Every stand keeps a clear corridor from the nearest road with 2.5 units clear in front of it, and no house stands on the arrival camera's line to a stand (`<id>-world.mjs`)
- Every clickable object is fully visible from the arrival camera. Ten rays per object are cast along the arrival direction — nine at the object's camera-facing front face at three heights, one at the diamond cue over its anchor — and the first thing each ray meets must be that object. Decorative houses, trees and farmhouses count as blockers, and so does another stand: a stand that hides a neighbouring stand fails exactly as a house does, and a wedge rule cannot express that case, because neighbours inside a cluster sit five to eight units apart and every pair would fall inside every other pair's wedge. The check runs on the live page after a fresh load, and that run is the authority; the harness in `<id>-world.mjs` builds a slightly different world and is what keeps a fixed defect fixed
- Every decor type was looked at from the overview camera and reads as what it is. A free-standing arcade, a granary on stilts or a slab on piers that reads as a bridge half in the water fails, however correct it is close up. This covers the decor a stand builds for itself as well as the town's: a field house, a shelter or a shade that belongs to a stand is read from above under the same rule, and it counts in the visibility check above like any other building
- The table reads at the world's own zoom-out limit. The scene fog is derived from that limit and the table's half-diagonal (`worldFogRange` in `world-camera.ts`), never hand-set per world, and a screenshot at the maximum zoom-out shows the table with only a light haze at the far corner. The Mediterranean rendered entirely white at its 215 limit because its fog was a hand-written 90/200 pair while the limit came from elsewhere
- Every figure that translates swings its legs in step with its speed; a figure that should stand still does not translate; a figure carried by a moving vehicle is seated. Animals face their travel, and their hooves plant and push backward under the body (the gait and gait-direction checks in `<id>-world.mjs`)
- Every water feature ticks. Chimney smoke uses the tinted, denser variant, its anchor computed from each style's ridge height plus the cap, and it is visible in a screenshot at the default overview zoom, not only close up
- Every motion was watched for ten seconds and reads as physically plausible: a pour falls, a flag flaps, a string barely moves
- No flicker while still, moving or zooming. No floating object, no unsupported seat, no wall crossing

Stands:

- Each main stand meets the hotpot table in the handbook: modelled food, always-on loop, six to nine people, lanterns under a beam, steam at the hot source
- Each click moves food or material first, the worker second, one bystander third, speech last. The reaction is readable at world zoom after the 1.6-second approach
- Repeated clicks stay bounded and return to rest. No person shakes
- Every stand offers ambient speech in the local language plus English. Bubbles never overlap
- `<id>-reactions.mjs` covers every stand and passes

Rooms:

- Every room has two paintings at the required sizes that pass the art-direction check
- Every room is alive on entry with three or four always-on loops in both orientations, and every pictured hot food steams. `room-loops.mjs` passes
- Every hot cup, bowl, plate, pan, pot and oven mouth has its own measured steam source, not only the big vessels. Frying oil and boiling pots also get a pot ellipse. Cold food and a cup held in a hand stay dry, and each orientation is measured separately
- A steam source needs a pictured hot vessel **and** a hot process in the room's own text. Where the painting shows a liquid but no heat — whey, brine, oil — the liquid drips or runs instead, with the `drip` glint variant, and the room's motion floor is re-measured after the swap. The cheese farm steamed over a cold copper caldero while its own touches and story described pressing and draining, and the owner read the text and asked why it was steaming
- A traced liquid path starts exactly at the pictured lip or spout and ends exactly at the pictured liquid surface. Both endpoints are measured on the pixels of each orientation and checked live by reading the room's own effect canvas. Nothing glints on the vessel's glass above the lip, and nothing glints below the surface the liquid lands on
- Hanging motion is a sprite over a clean painting. No colour-keyed crop is cut out of a finished painting in a new area; where the painting already carries the object, it is painted out offline and the sprite hangs from the painted hook
- Every delivered motion sprite is used, or the room doc says why it is not
- Every traced path and every box was measured on a gridded crop of that orientation's painting and verified on an overlay contact sheet before hand-over. Every patch box edge that falls inside the painting was looked at at 100 percent zoom
- Every phone patch box and every phone sprite lies inside the band a phone actually shows. A 390-wide viewport fits a wide painting to about x .094 to .906 of its width, so a box outside that band draws nothing; measure the band for the room's own painting and check the lit pixels live. The coffee-house's rain signature sat on a sash outside it and had never been visible in portrait
- The motion capture was re-run after the last change to any room's cues, and the quality baseline carries the new numbers
- The loops can be seen: `scripts/audit/room-motion.py` shows 3 percent or more of the frame changing in two seconds, or the room carries a medium crisp cue (birds at scale 1.4, six or more leaves, a swinging bunch) and scores at least 2.5 percent
- Every room has two or three touches that name something visible in both orientations, each with a fact and, where the fact is specialist, a source
- Every effect stays on its source and fits the painting completely. Every breeze mask was inspected with `scripts/audit/breeze-masks.py` and moves only the hanging detail. No invented food, hand, wake or stream. Missing moving objects were requested as sprites, not drawn
- Reduced motion keeps the room understandable

Cards and stories:

- Every object has a tagline and a three-to-five-paragraph blurb with dated eras and local-script names
- **Every kitchen room and every place-or-dish object shows its repertoire on its card**, hero dish first, under "What this kitchen cooks" ("How it is served" for a single dish). A place is not one dish; a single-dish place carries a list of one, and no place is left silent. A room's list is the card its "The story" button opens. A landmark room with no kitchen — a bridge, a mountain — carries none
- A card-only object's blurb sits in its file's own length band, beside the blurbs of the objects around it: three paragraphs of identity, record and a route out, with sources. A card that is a fraction of its neighbours' length fails, because the owner opens cards
- Every room object has story depth with sources and two `NEXT` links
- The world intro passes `world-intros.mjs`
- Legends are labelled as legends
- **Recipes are not on this list.** They are an optional add-on, off by default, and the area is built, reviewed and signed off with it off. Matching an area's objects to recipes is a separate task raised after the area ships; a card whose dishes look random is a recipe task, never an area defect, and it never holds up a publish

Verification record:

- `npm run typecheck`, `npm test`, `npm run build:pages` pass
- Screenshots at 1280 x 720 and 390 x 844 for the world, each stand and each room are attached to `docs/<id>-world.md` or listed by name in `.data/shots`
- The animation inventory table lists every room and stand with its living-painting cue and its 3D reaction
- The Pages run succeeded and the live URL was checked

## 6. Which model does which step

The tier follows who does the work, not how hard the step looks. Three tiers, and one session at the top that does no work.

| Tier | Who | Model | What it does |
| --- | --- | --- | --- |
| Lead session | The one session the owner talks to | The top model available. Claude Fable 5.1 (`claude-fable-5-1`); GPT-6 Astra (`gpt-6-astra`) in Codex | Planning, quality control and coordination only |
| Agents | Builder, Stand maker, Room maker, Researcher, and every fix agent | Claude Opus 5 (`claude-opus-5`); GPT-5.6 Sol (`gpt-5.6-sol`) in Codex | All building, all stand work, all room work, all repairs, all document drafting |
| Mechanical | Auditor and bookkeeper | Claude Sonnet 5 (`claude-sonnet-5`); GPT-5.6 Terra (`gpt-5.6-terra`) | Running the audits and the tests, motion captures, baseline bookkeeping, contact sheets |

The lead session runs the most expensive model in the team, so it does none of the work an agent can do. It writes the plan and the blueprint, splits the work into briefs, reads what comes back, decides pass or fail, and hands out the next task. It does not edit a world file, a stand, a room config, a mask or a painting, and it does not draft a document; it reviews the draft an agent wrote. When the lead finds a defect, however small it looks, it writes a fix brief and gives it to an agent on Opus.

The lead's own tool use is limited to greps, one contact-sheet image at a time, and test runs. Proof of visual work comes back as a single contact sheet — the room grid, the cluster grid, the overlay sheet — not as a stream of separate screenshots. An agent that has twelve shots to show composes them into one sheet before reporting.

Mechanical work never goes to a higher tier because the higher tier is already awake. Running `npm test`, capturing a motion pair, re-running `room-motion.py`, updating the baseline numbers, cutting a contact sheet: all of it is a Sonnet task with a named command and an expected output.

**Usage.** The lead checks usage at every hand-off: before it opens a stage, before it spawns an agent, and when an agent reports back. It posts the figure with the status. The owner states a weekly-usage line at kick-off. The lead stops at that line — it finishes the task in hand, writes the state and the remaining task list into `docs/<id>-world.md`, tells the owner what is left, and starts nothing new. It never moves work to a cheaper tier to stretch the line, and never moves work to a more expensive tier to save a round trip.

**Every agent gets a self-contained brief.** Long context from other roles causes drift, so an agent is given its brief, this playbook, the handbook, the art direction and the blueprint section of `docs/<id>-world.md`, and nothing else. The brief states:

- The files this agent owns and may edit, and the files it must not touch
- The task, with the ids, coordinates, sizes and names it needs, so it never has to guess a contract
- The verification steps, by command: what to run, what to measure, what to look at and at which sizes
- The report format: what was changed per file, what was measured with the numbers, one contact sheet, and an explicit list of what was *not* verified
- For a mechanical task, the **exact command sequence and the files it is expected to produce**. A Sonnet brief leaves nothing to the agent's judgement: the commands in order, the arguments, and the output files by name

A report without the "not verified" list is incomplete and goes back.

**An agent drives its own work to the end of its turn.** It runs its captures and measurements synchronously — it starts the batch, waits inside its own turn, and reports the numbers — and it never ends its turn to wait for a capture, a render or a build to finish. Nothing resumes an agent but the lead, so an agent that stops to wait has handed its bookkeeping back to the most expensive session in the team; a Sonnet auditor did this twice in one pass. A report that says it is waiting is incomplete and goes back, exactly like a report without its "not verified" list.

Model names change. Before a kick-off, check each provider's current list and take the newest model in the same tier. Model ids in this section were checked against the providers' model pages on 2026-09-15. GPT-6 Astra was released on 2026-09-04 and is rolling out; when an organisation does not have it yet, GPT-5.6 Sol takes the lead session's rows.

Which tier each step belongs to, and why:

| Step | Role | Tier | Reason |
| --- | --- | --- | --- |
| The plan, the blueprint, the briefs, the hand-offs | Lead | Lead session | Spatial reasoning over the whole table and the only view of every file set at once; road joins and river edges were the most-corrected defects in China |
| Review against the definition of done, and the owner walkthrough | Lead, and one agent who did not build the area | Lead session for the lead's pass, Agents for the second reviewer | The review must be at least as strong as the author, and never the same agent that wrote the file |
| Area research, brief, object list, image brief | Researcher | Agents, with web search | Long sourced writing; must separate records from legends |
| Image generation | Outside the repository | Gemini through the `ce-gemini-imagegen` skill, or GPT-Image-2.5 Sunburst (`gpt-image-2.5-sunburst`) in ChatGPT with the reference images attached | The methodology and the Spain prompt were written for ChatGPT image generation; both tools accept reference images |
| Picture acceptance against the art direction | Room maker, then lead | Agents, with image input | Judging style, clothing period, food accuracy and vessel orientation from the image itself |
| Landscape, water, roads, town clusters, architecture, residents, countryside | Builder | Agents | Flicker, broken ribbons and wall crossings come from geometry mistakes that need careful spatial checking; the lead reviews the result, it does not build it |
| Stands with the China click chain, details that sway, ingredient stops | Stand maker | Agents | The stand is where China was corrected most: people in walls, shaking chefs, floating boards, seats |
| Room configs: coordinates, touches, steam, fire, sprites hung over cleaned paintings | Room maker | Agents, with image input | Measuring points on the actual paintings and writing data |
| Ambience patches and signature motion | Room maker, approved by lead | Agents, with image input | A patch that moves a face or a wall passed pixel tests before; only careful visual inspection catches it |
| Blurbs, story depth, discoveries, speech lines, world intro, the repertoire of every place | Researcher | Agents, with web search | Sourced, dated prose to the China blurb standard; the repertoire is what the place really cooks, not a guess |
| Recipe matching for a shipped area (the `match` predicates and the `ENRICH` rows behind the Recipes add-on) | Researcher | Agents | A separate task after the area ships, never part of its definition of done. The add-on is off while the area is built and reviewed |
| Repairs from the review and the owner walkthrough | Fix agent | Agents | A one-line fix is still a code change in someone's file, and the lead does not make it |
| Import scripts, cutter runs, paint-out runs, registration checklist, `docs/<id>-world.md` draft | Any role | Agents for the draft, Mechanical for the script runs | Drafting is writing; running a script with named arguments is not |
| `npm test`, `npm run typecheck`, motion captures, screenshots at both sizes, contact sheets, baseline bookkeeping, status posts | Auditor | Mechanical | Execution and reporting against a named expected output |
| Integration and merge | Lead | Lead session | Conflicts across `graph.ts`, `main.ts`, `ui.ts` and the world file |
| Publish and live check | Lead, with an auditor | Mechanical for the build, push, run watch and URL check; Lead session for the decision to publish | Building and watching a run is mechanical; deciding that an unfinished world may go live is not |

Rules:

- The reviewer is never on a weaker model than the author
- When a step fails review twice, the lead rewrites the brief before it raises a tier, because a second failure is usually a brief that left something out
- The lead does not do an agent's work because the work is small, urgent or late at night. Spain was declared done at two in the morning by a lead that had stopped handing out and started fixing
- Mixing providers inside one team is fine. Keep one provider per role for one area so the style of the code stays consistent within a file set
- Give each agent its brief and the four documents named above, and nothing else

## 7. Communication rules

- Post a one-paragraph status at the end of each stage: what is done, what failed, what is next
- Report a blocker the moment it appears: a missing picture, a wrong size, a conflicting id, a helper that does not exist
- Never invent a source, a date or a food identity. Write "unverified" and ask the researcher
- When the owner points at something, confirm which object it is before removing anything. Take a screenshot from the owner's own view, or read the position out of the built world, and say which object you believe is meant. The lead removed Spain's hórreo because the owner had said "the yellow bridge-looking thing which is half in the water"; the owner meant a free-standing plaza arcade thirty units away. A guess costs an object and a card chain. And when the owner names a place and a subject, the fix covers **every object that subject appears in at that place**, and the report says which: "the Turkish market: sumac" was read as the kebab room's sumac touch, but she meant the market's own sumac card, and the market had no sumac touch at all. Both were rewritten, and both were named back to her
- Never widen the scope. A missing helper is built in the owning file, not in `props.ts`, unless two areas need it
- When the docs and the China code disagree, follow the China code and report the difference in the status
