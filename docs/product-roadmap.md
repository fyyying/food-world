# Food World product roadmap

Saved from the product discussion on 2026-09-12. This is the working list to return to across tasks. The user directions below define the intended outcomes; suggestions and open decisions still need refinement before implementation.

| Topic | Status |
| --- | --- |
| 1. Quieter opening and shared navigation | First pass implemented in `36f6cea` |
| 2. Chinese language experience | Discussed; not implemented by this task |
| 3. Children's version | Discussed; reading age open |
| 4. Appropriate dishes and recipes in each room | Initial placement audit completed; changes pending |
| 5. My World and cooking history | Discussed; behavior to refine |
| 6. Modern World | Added to the list; design pending |
| 7. Mobile zoom returns to the landing page | Reported; needs reproduction |

## 1. Quieter opening and shared navigation

**User direction:** Reduce the amount of text, especially on phones. Remove dish totals and automatic instructions for scrolling and similar controls. Provide a small control/settings entry at the top throughout the game.

**Implemented:** Commit `36f6cea` — `feature: Simplify Food World navigation and add sound settings`.

- Welcome screen has the title, a short invitation, and Enter.
- Dish counts and automatic instruction banners were removed.
- Regional button rows became a compact location picker with a back button.
- Settings remains available on the welcome screen, map, rooms, and recipes.
- Settings includes sound and optional help. Sound stops when muted and the preference is saved on the device.
- Language and children's controls will be added when their features work.

**Verification at implementation:** Phone and desktop browser checks, settings dismissal without leaving the current room or recipe, saved sound preference, typecheck, production build, sound regression tests, and room tests passed. These are recorded results from that change, not a guarantee about later edits.

## 2. Chinese language experience

**User direction:** Keep English with local dish names as the starting experience. Add Chinese explanations, retaining local-language names where useful. China needs natural Chinese writing; a literal translation of English explanations of familiar Chinese terms would sound odd.

**Suggested approach:**

- Treat the local name and the explanation language separately.
- In Chinese mode, avoid duplicate names, unnecessary English, or automatic pinyin for familiar Chinese dishes.
- Preserve meaningful regional expressions and relevant Uyghur names, with Chinese explanations where needed.
- Rewrite China's explanations for Chinese readers. Translate and adapt other regions with the same care.
- Apply the selected language consistently to navigation, discoveries, stories, and recipes.

**Open:** Initial Chinese script choice and the first region/content set to complete.

## 3. Children's version

**User direction:** Show the same world, with much simpler explanations of food and history when the user selects the children's version.

**Suggested approach:**

- Keep the illustrations, places, dishes, and interactions.
- Present one concrete idea at a time with familiar words and sensory details.
- Keep language and reading level independent, so either English or Chinese can use children's mode.
- Preserve factual meaning, recipe quantities, and essential cooking steps when simplifying the writing.

**Open:** Reading age and whether children explore independently or with an adult. Ages 7–10, ages 4–6 with an adult, and ages 11–13 were offered as possibilities; no answer was received.

## 4. Appropriate dishes and recipes in each room

**User direction:** A room should offer food appropriate to that place. Markets can offer selected street food; hotpot rooms mainly hotpot; home kitchens home-style dishes; noodle shops noodles; bao shops bao; teahouses tea and snacks. Avoid repeating unrelated dishes across rooms. Address places without recipes.

**Findings from the initial code/data inspection:**

- Rooms without matching recipes could fall back to a regional selection. This produced unrelated menus; the concurrent Turkey work was already changing this behavior for Turkey.
- Broad cooking-method matches also put dishes in unsuitable venues.
- Some places had stories but no matching recipe. Some exported recipe listings lacked a recipe body.
- Personal adaptations, including Bolognese Mapo Tofu Pasta, need a clear presentation as personal variations.

**Suggested approach:** Give each dish an intentional home. Keep "served here" separate from ingredient and technique connections. Add suitable missing recipes deliberately. Recheck current data and placement rules before implementing, since regional work continues independently.

**Open:** Final room menus, coverage priorities, and content review. The initial placement audit did not validate every recipe or historical claim.

## 5. My World and cooking history

**User direction:** Provide access to all recipes through a personal layer that distinguishes what has been cooked from what is new, supporting both trying a new dish and cooking an old one again.

**Suggested approach:**

- Offer All recipes, Want to cook, and Cooked, with search and regional filters.
- Use a small cooked marker and a Cook again action.
- Record cooking through an explicit "I cooked this" action, with undo; opening a recipe alone should not mark it cooked.
- Prefer "Not cooked yet" when that is the intended meaning of "new".
- Keep every recipe reachable, including personal recipes without a suitable regional room.
- Preserve history when changing language or reading mode.
- Device-local progress is a possible first version, with its storage boundary clearly stated.

**Open:** Whether history belongs to each visitor or reflects the author's cookbook; whether "cooked" means real-world cooking or an in-game action; storage/sync expectations; the exact meaning of "new". The behaviors above are proposals, not settled requirements.

## 6. Modern World

**User direction:** Add a contemporary world for food enjoyed across countries and modern combinations of ingredients from different places, such as avocado toast.

**Suggested approach:**

- Possible places: a neighbourhood café, brunch spot, food truck, and modern home kitchen.
- Possible additional dishes: grain bowls, wraps, smoothies, and personal fusion cooking.
- Connect dishes to ingredients and their origins where useful.
- Support the same recipes, languages, children's mode, and My World history.

**Open:** Name, visual setting, initial dishes, and the boundary between Modern World and personal variations in regional worlds.

## 7. Mobile zoom returns to the landing page

**User report:** On mobile, zooming to inspect the pictures jumps out to the landing page.

**Expected behavior:** Zooming should preserve the current picture, place, and view without returning to the landing page.

**Status:** Reported; not yet reproduced or fixed. Identify the affected phone/browser, zoom gesture, and view during reproduction before determining the cause.

## How to continue

The first UI pass is complete. No implementation order has been agreed for topics 2–7.

A suggested next step was a small Sichuan example combining appropriate room menus with English/Chinese and standard/children's explanations, before expanding across regions. This remains a proposal. Update this file as decisions are made and work is completed.
