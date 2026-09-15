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

Five roles. One agent can hold two roles when the area is small. Two agents never edit the same file in the same stage.

| Role | Owns | Produces |
| --- | --- | --- |
| Lead | `world-<world>.ts`, `graph.ts` registrations, `main.ts`, `ui.ts` hooks, `README.md`, `docs/<id>-world.md` | The plan, the layout blueprint, the registration, the final review and the publish |
| Researcher | `<id>-objects.ts`, `<id>-stories.ts`, `scene-discoveries.ts` entries, `world-intros.ts` entry | The area brief, object list with blurbs, story depth with sources, discovery texts, ambient speech lines |
| Builder | `<id>-landscape.ts`, `<id>-architecture.ts`, `<id>-town.ts`, `<id>-people.ts`, `<id>-countryside.ts` | Terrain, water, roads, houses, residents, walkers, countryside |
| Stand maker | `props-<id>.ts`, `scripts/tests/<id>-reactions.mjs` | One stand per object with the China click chain, ambient chat, details |
| Room maker | `scenes-<id>.ts`, `<id>-ambience.ts`, `scene-props.ts` entries, `scripts/scenes/import-<id>.py`, `public/scenes/**` | Imported paintings, room configs, touches, ambience, card art |

The lead also runs the reviewer pass in stage E. A different agent from the author reviews each file.

## 3. Shared contracts

Agree these before parallel work starts. The lead writes them into `docs/<id>-world.md` under "Blueprint" and every agent reads that section.

| Contract | Content | Written by |
| --- | --- | --- |
| Object list | `id`, `name`, `kind`, `area`, `pos`, `prop`, `scene`, one-line purpose | Researcher proposes, lead fixes positions |
| Layout blueprint | Table size, area centres, clusters, road list with endpoints, water curves, landmark positions, walker loops | Lead |
| Palette | Named colours for walls, roofs, trim, paving, ground tints, water | Builder |
| Resident styles | Six to eight clothing profiles as data | Builder |
| Room list | Room id, folder, object that opens it, three discovery subjects, signature motion, wide and portrait dimensions | Room maker |
| Speech lines | Four to eight lines per stand in the local language plus English | Researcher |
| Animation matrix | One row per stand and per room orientation, as the methodology requires | Stand maker and room maker |

Ids are the contract. Once the object list is fixed, nobody renames an id without telling the lead.

## 4. Stages

Each stage ends with a check. The next stage starts only when the check passes.

### Stage A: Research and brief (Researcher, Lead)

1. Research the area: landscape, architecture, food culture, ingredients, everyday activities, clothing, period. Keep the sources
2. Write the area brief and the object list. Ten to fifteen objects with rooms, five to ten ingredient stops, three to six landmarks
3. Write the image brief from `docs/examples/spain-scene-generation-prompt.md` and the art direction. Stop here when pictures do not exist yet

Check: The object list has unique ids, every object has a `kind`, an `area` and a purpose, and every historical claim has a source.

### Stage B: Blueprint and assets (Lead, Room maker)

1. Lead draws the layout blueprint on paper coordinates: clusters, roads, water, landmarks. Clusters are dense and separated; roads connect every door
2. Room maker inspects each delivered picture against the art-direction acceptance check. Rejected pictures go back for regeneration with a one-line reason
3. Room maker writes `import-<id>.py`, runs it, and runs the cutter for sprites. Sizes appear in `scenes-props.json`
4. Room maker opens `scripts/tests/room-audit.html` and confirms every room shows in both orientations

Check: `scenes-props.json` has every room with `wide` and `portrait`; every picture passed acceptance; the blueprint lists every object position.

### Stage C: Parallel build (Builder, Stand maker, Room maker, Researcher)

Work proceeds in four files sets at once.

Builder:

1. Landscape and water first, roads second, architecture third, town clusters fourth, residents and walkers fifth, countryside last
2. After each step run `npm run typecheck` and `npm test`, then look at the world in the browser at 1280 x 720 and 390 x 844

Stand maker:

1. Build the main stands first, then ingredient stops, then details
2. Follow the stand standard in the handbook: modelled food, always-on loop, six to nine people, click chain food first and speech last, ambient chat, `ownReaction`
3. Write `<id>-reactions.mjs` as the stands grow. Every stand appears in it

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

### Stage F: Publish (Lead)

1. Add the world to `PUBLISHED_WORLDS` when it is a new world
2. Write `docs/<id>-world.md`: what was built, the animation inventory table, what was checked, what remains
3. Commit, push `main`, watch the Pages run, verify the live site on a phone viewport
4. Report to the owner with three screenshots: the whole area, one stand mid-reaction, one room

## 5. Definition of done: the China standard

The area is done when every line is true on the live site.

World:

- Four or more clusters with clear separation, connected by continuous roads. Every door meets a road
- Water is continuous, square at the table edge, and correct in colour. Nothing stands in water
- At least ten interactive stands and five ingredient stops, each with a diamond cue
- At least three walker loops or lanes with residents in the area's traditional clothing, steps matched to distance
- Small details in every cluster: hanging produce that sways, stacks, racks, crocks, animals in pens
- No flicker while still, moving or zooming. No floating object, no unsupported seat, no wall crossing

Stands:

- Each main stand meets the hotpot table in the handbook: modelled food, always-on loop, six to nine people, lanterns under a beam, steam at the hot source
- Each click moves food or material first, the worker second, one bystander third, speech last. The reaction is readable at world zoom after the 1.6-second approach
- Repeated clicks stay bounded and return to rest. No person shakes
- Every stand offers ambient speech in the local language plus English. Bubbles never overlap
- `<id>-reactions.mjs` covers every stand and passes

Rooms:

- Every room has two paintings at the required sizes that pass the art-direction check
- Every room is alive on entry: one signature motion plus one or two supporting cues, never more than four loops
- Every room has two or three touches that name something visible in both orientations, each with a fact and, where the fact is specialist, a source
- Every effect stays on its source. No mask moves a face, wall or shelf. No invented food, hand, wake or stream
- Reduced motion keeps the room understandable

Cards and stories:

- Every object has a tagline and a three-to-five-paragraph blurb with dated eras and local-script names
- Every room object has story depth with sources and two `NEXT` links
- The world intro passes `world-intros.mjs`
- Legends are labelled as legends

Verification record:

- `npm run typecheck`, `npm test`, `npm run build:pages` pass
- Screenshots at 1280 x 720 and 390 x 844 for the world, each stand and each room are attached to `docs/<id>-world.md` or listed by name in `.data/shots`
- The animation inventory table lists every room and stand with its living-painting cue and its 3D reaction
- The Pages run succeeded and the live URL was checked

## 6. Which model does which step

Match the model to the kind of judgement the step needs. Visual and spatial judgement and cross-file integration go to the strongest model. Sourced prose and configuration go to the next tier. Mechanical steps go to the fastest tier.

| Step | Role | Model | Reason |
| --- | --- | --- | --- |
| Area research, brief, object list, image brief | Researcher | Claude Opus 5 (`claude-opus-5`) with web search | Long sourced writing; must separate records from legends |
| Image generation | Outside the repository | ChatGPT image generation, or Gemini through the `ce-gemini-imagegen` skill | The methodology and the Spain prompt were written for ChatGPT; both accept reference images |
| Picture acceptance against the art direction | Room maker, then lead | Claude Fable 5.1 (`claude-fable-5-1`) | Judging style, clothing period, food accuracy and vessel orientation from the image itself |
| Layout blueprint: clusters, roads, water, landmarks | Lead | Claude Fable 5.1 | Spatial reasoning over the whole table; road joins and river edges were the most-corrected defects in China |
| Landscape, water, roads, town clusters | Builder | Claude Fable 5.1 | Flicker, broken ribbons and wall crossings come from geometry mistakes that need careful spatial checking |
| Architecture builders, resident clothing profiles, countryside | Builder | Claude Opus 5 | Pattern work from `turkey-architecture.ts` and `turkey-people.ts` with a fixed palette |
| Stands with the China click chain | Stand maker | Claude Fable 5.1 | The stand is where China was corrected most: people in walls, shaking chefs, floating boards, seats. Supports, timing and reaction order need the strongest model |
| Details that sway and small ingredient stops | Stand maker | Claude Opus 5 | Copies of `northDetail`, `jujubeTree` and `chilliField` with new shapes |
| Room configs: coordinates, touches, steam, fire | Room maker | Claude Opus 5 with vision | Measuring points on the actual paintings and writing data |
| Ambience masks and signature motion | Room maker, approved by lead | Claude Fable 5.1 | A mask that moves a face or wall passed pixel tests before; only careful visual inspection catches it |
| Blurbs, story depth, discoveries, speech lines, world intro | Researcher | Claude Opus 5 with web search | Sourced, dated prose to the China blurb standard |
| Import scripts, cutter runs, registration checklist, `docs/<id>-world.md` draft | Any role | Claude Sonnet 5 (`claude-sonnet-5`) | Mechanical, well-specified steps with a checklist |
| Running `npm test`, `npm run typecheck`, screenshots at both sizes, status posts | Any role | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) or Sonnet 5 | Execution and reporting, no judgement |
| Integration and merge | Lead | Claude Fable 5.1 | Conflicts across `graph.ts`, `main.ts`, `ui.ts` and the world file |
| Review against the definition of done | Lead and one other agent | Claude Fable 5.1 | The review must be stronger than the author. Never the same agent that wrote the file |
| Publish and live check | Lead | Claude Sonnet 5 | Build, push, watch the run, verify the URL on a phone viewport |

Rules:

- The reviewer model is never weaker than the author model
- When a step fails review twice, escalate it one tier: Sonnet 5 to Opus 5, Opus 5 to Fable 5.1
- Fable 5.1 owns every step whose failure the visitor would see as a defect in space or motion: floating, flicker, walls, wrong reactions, moving faces
- Give each agent this playbook, the handbook, the art direction and the blueprint section of `docs/<id>-world.md` at start, and nothing else. Long context from other roles causes drift

## 7. Communication rules

- Post a one-paragraph status at the end of each stage: what is done, what failed, what is next
- Report a blocker the moment it appears: a missing picture, a wrong size, a conflicting id, a helper that does not exist
- Never invent a source, a date or a food identity. Write "unverified" and ask the researcher
- Never widen the scope. A missing helper is built in the owning file, not in `props.ts`, unless two areas need it
- When the docs and the China code disagree, follow the China code and report the difference in the status
