# Quality baseline

The numbers below were measured on 2026-09-15 after the room-loop, mask and Black Sea passes. A coordinating agent reads them at session start, re-measures with the named commands, and updates this file when a number changes on purpose. A number that drops without an entry here is a regression.

| Measure | Value | Command |
| --- | --- | --- |
| Type check | Passes | `npm run typecheck` |
| Test harnesses | 14 pass | `npm test` |
| Painted rooms | 54, all with three or four always-on loops in wide and portrait | `node scripts/tests/room-loops.mjs` |
| Steam sources | Every configured source draws, cap four per room | `scene-painted.ts`, `steamLimit` |
| Visible idle motion | Rooms with hot food or mist change 3 percent or more of the frame in two seconds; outdoor rooms at least 2.5 percent or a medium crisp cue. Weakest after the 2026-09-15 pass: olive grove, oasis field, oasis bazaar | `scripts/audit/room-motion.py` after capturing pairs |
| Object ids | Unique across all worlds | `node scripts/tests/object-ids.mjs` |
| Breeze masks | 28 crops, each inspected on 2026-09-15; none moves a face, wall, lantern, shelf or pole | `uv run --with pillow --with numpy --with scipy scripts/audit/breeze-masks.py <out dir>` |
| Card-only clickables per area | Sichuan 9, Jiangnan 6, Northern 5, Xinjiang 4, Everyday 1, Istanbul 5, Anatolia 3, Aegean 2, Black Sea 3, Levant 7, Arabia 3, Persia 2 | `node scripts/audit/objects.mjs` |
| Rooms per area | Sichuan 5, Jiangnan 9, Northern 12, Xinjiang 12, Everyday 1, Istanbul 7, Anatolia 4, Aegean 3, Black Sea 1 | `node scripts/audit/objects.mjs` |
| Published worlds | china, middle-east | `world-availability.ts` |
| Live site | https://fyyying.github.io/food-world/ deploys on every push to `main` | `gh run watch --exit-status` |

Known gaps, accepted for now:

- Levant, Arabia and Persia have card-only objects and no rooms. They predate the China standard
- The Everyday area of China has one room and one card-only object
- Hotpot's people wear present-day clothes; the art direction exempts it as the light and density reference
- Portrait composites from `__fw.sceneShot` squash the frame in a hidden pane; judge portrait rooms in the live pane at 390 x 844

How to update: change a value, add one line under a dated heading below that says what changed and why, and commit the file with the change that caused it.

## Changes

- 2026-09-15: Idle motion measured in every room after the owner could not see the tea hill's loops. Mist opacity, bird size and period, leaf count and size and beam drift became tunable; sixteen weak rooms got steam from pictured vessels, readable mist, larger birds, more leaves, sparks at the fish grill, petals at the Chinese tea hill. The Turkish bazaar object id became `bazaarTr`; it had collided with China's oasis bazaar and Turkish card links pointed at Xinjiang. `object-ids.mjs` now guards this.
- 2026-09-15: The two Anatolian wheat plots rose from .019 to .030 above the paving at .018 and the eastern one moved off the lane edge; their soil had z-fought with the paving.
- 2026-09-15: The Anatolian kitchen garden shrank from 7 to 4 units wide; it had overlapped the coppersmith's and potter's floor slabs at the same height and z-fought. `scripts/audit/flicker.mjs` now reports zero exact overlaps at both shops.
- 2026-09-15: The house south of the Istanbul coffeehouse was removed because it hid the coffeehouse from the default view; the Anatolian front house dropped to two storeys; courtyard houses no longer receive a street planter.
- 2026-09-15: Baseline created. 20 rooms raised from one or two loops to three or four; 9 masks tightened; Black Sea gained hazelnut grove, anchovy landing and kale beds; the Turkish bazaar lost its own floor plane and the stone squares rose to 0.027 to stop z-fighting.
