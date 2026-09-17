# Vietnam world: Stage 0 and Stage A handoff

Scope id: `vietnam`
World id: `southeast-asia`
Area ids: `hanoi`, `mekong`
Stage: **A complete; Stage B blocked on owner decisions and pictures**

## Stage 0 baseline — 17 September 2026

| Check | Result |
| --- | --- |
| Worktree | Clean before Stage A |
| `npm run typecheck` | Pass |
| `npm test` | Pass: 17 harnesses |
| `node scripts/audit/objects.mjs` | Pass against `docs/quality-baseline.md` |
| Audited China counts | Sichuan 5 rooms / 9 cards; Everyday 1 / 1; Jiangnan 9 / 6; Northern 12 / 5; Xinjiang 12 / 4 |
| Audited Turkey counts | Istanbul 7 / 5; Anatolia 4 / 3; Aegean 3 / 2; Black Sea 1 / 3 |
| Audited other counts | Levant 0 / 7; Arabia 0 / 3; Persia 0 / 2; Spain 12 / 14; Greece 0 / 4; Dalmatia 0 / 2; Morocco 0 / 3 |
| Southeast Asia audit caveat | The current audit script does not enumerate Southeast Asia; the graph baseline is two Vietnamese rooms/places, four Vietnamese ingredient/flavour stops and three landmarks. [G](../src/fw/graph.ts) |
| Breeze masks | Not run: no mask changed before or during Stage A |
| Live look, recipes off | Two-minute pass across China overview, Sichuan and Jiangnan, the Turkish town, the ocakbaşı room wide and the simit room at `390 × 844`; no visible floating actors, cross-wall motion or flicker was found |

The baseline is descriptive, not permission to change implementation files. Stage A writes only the four playbook files.

## Scope recommendation

Build **one Vietnam package across both existing area ids**, not a Hanoi mini-area followed by a duplicate Mekong project. Six clusters create a legible north-to-south route while retaining the graph's `hanoi` and `mekong` routing. UNESCO's records support the Red River, Huế and Hội An as materially different settings, while official food sources support distinct Hanoi, central, Saigon and Mekong repertoires. [R §2–4](vietnam-research.md)

Do not recreate Thailand. Vietnam gets no floating-market room, noodle boat, curry mortar, Thai-style orchard, temple compound or Andaman fishing kitchen. Shared rice, herbs, fish sauce and canals remain supporting materials, not repeated compositions. [R §9](vietnam-research.md) [Thailand brief](thailand-image-brief.md)

## Stage A decisions

| Decision | Stage A recommendation | Why / authority | Owner action before pictures |
| --- | --- | --- | --- |
| Package | One `vietnam` package spanning `hanoi` and `mekong` | Existing ids plus six distinct regional settings. [R §1–3](vietnam-research.md) | Approve or split the package |
| Cluster count | Six clusters, two rooms each | Keeps the 12-room China/Spain/Thailand density and gives each room one food verb | Approve |
| Visual period | 1900–1931 | Early phở, late Nguyễn Huế, dated Hanoi vendor imagery and pre-modern áo dài silhouette align. [R §8](vietnam-research.md) | Approve, or request a later band and new research |
| Food chronology | Use strong regional associations without inventing origin dates | Several official food pages establish place and ingredients but not a historical first date. [R §4, §8](vietnam-research.md) | Accept the temporal-composite rule or reduce the room list |
| `banhMi` | Keep the id; depict bread and pâté, not the later fully loaded sandwich | The modern sandwich conflicts with the proposed visual band. [R §4.4](vietnam-research.md) | Approve this treatment or move the period later |
| `motorbikes` | Preserve the id for compatibility; recast future display as “Street carriers” with shoulder poles, carts and bicycles | The 1931 vendor record supports carrying poles; mass motorbike imagery is outside the band. [R §6, §8](vietnam-research.md) | Approve the display-name/prop migration |
| Thailand boundary | Boats connect; no Vietnamese floating-market room | Thailand already owns that signature composition. [R §9](vietnam-research.md) | Approve |
| Recipe links | Zero at Stage A | The library has only modern `Banh Mi` and `Vietnamese Chicken Salad`; neither exactly matches a proposed period room | Approve no forced links |
| Image set | 43 files | 1 concept + 24 room images + 6 sprites + 12 room cards | Approve before generation |

## Cluster plan

| Code | Area | Character | Rooms | Research |
| --- | --- | --- | --- | --- |
| HN1 | `hanoi` | Hanoi guild street: narrow fronts, shoulder poles, charcoal and breakfast steam | `hanoiKitchen`, `bunChaVn` | [R §3 HN1; §4.1](vietnam-research.md) |
| HN2 | `hanoi` | Red River craft courtyard: cloth steamers, bamboo screens and green-rice trays | `banhCuonVn`, `comVongVn` | [R §3 HN2; §4.1](vietnam-research.md) |
| CT1 | `hanoi` | Huế garden edge: clay tile, shaded veranda, river air and precise small dishes | `hueKitchenVn`, `banhHueVn` | [R §3 CT1; §4.2](vietnam-research.md) |
| CT2 | `hanoi` | Hội An/Quảng Nam shophouses: street counter in front, river service behind | `caoLauVn`, `miQuangVn` | [R §3 CT2; §4.3](vietnam-research.md) |
| SG1 | `mekong` | Saigon/Chợ Lớn street: deep shophouses, bread, noodles and ceramic bowls | `banhMi`, `huTieuVn` | [R §3 SG1; §4.4](vietnam-research.md) |
| MK1 | `mekong` | Mekong homestead: wet edge, stilted shelter, family hearth and fish-sauce route | `banhXeoVn`, `mekongKitchenVn` | [R §3 MK1; §4.5](vietnam-research.md) |

Proposed grown-table cluster centres are HN1 `[-30,-18]`, HN2 `[-13,-17]`, CT1 `[5,-12]`, CT2 `[26,-3]`, SG1 `[16,15]`, MK1 `[-21,18]`. They are layout proposals only. Stage B must draw and test the full table before any graph positions change.

## Object list

The list has **12 room objects, 8 ingredient/flavour stops and 6 landmarks**. Every id is unique in the proposed list; existing ids are marked **keep**. Positions are provisional grown-table coordinates, not Stage A code changes.

### Rooms: twelve

| Id | Kind | Area | Position proposal | Prop proposal | Purpose | Reaction / signature | Cluster | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `hanoiKitchen` **keep** | `technique` | `hanoi` | `[-32,-20]` | `phoGanhVn` | Early phở street kitchen and northern breakfast | Skim stock, lift noodles, pour broth cleanly into a resting bowl | HN1 | [R §4.1](vietnam-research.md) |
| `bunChaVn` | `dish` | `hanoi` | `[-26,-15]` | `bunChaGrillVn` | Hanoi grilled-pork and vermicelli courtyard | Lift pork from charcoal; fat flashes once; set beside herbs | HN1 | [R §4.1](vietnam-research.md) |
| `banhCuonVn` | `dish` | `hanoi` | `[-16,-20]` | `banhCuonSteamerVn` | Rice-sheet steaming craft | Peel a translucent sheet from cloth with a bamboo wand | HN2 | [R §4.1](vietnam-research.md) |
| `comVongVn` | `technique` | `hanoi` | `[-10,-14]` | `comCourtyardVn` | Young green-rice handling and village courtyard | Wooden pestle falls once; grains jump inside the mortar | HN2 | [R §4.1](vietnam-research.md) |
| `hueKitchenVn` | `dish` | `hanoi` | `[2,-14]` | `bunBoHueVn` | Huế lemongrass noodle kitchen | Strain red-gold broth and lay herbs beside the bowl | CT1 | [R §4.2](vietnam-research.md) |
| `banhHueVn` | `dish` | `hanoi` | `[9,-9]` | `hueCakeVn` | Small steamed rice cakes and dumplings | Lift one filled tray from the steamer; steam clears faces | CT1 | [R §4.2](vietnam-research.md) |
| `caoLauVn` | `dish` | `hanoi` | `[23,-6]` | `caoLauShopVn` | Hội An noodle shophouse | Toss thick noodles once; settle pork, herbs and cracklings | CT2 | [R §4.3](vietnam-research.md) |
| `miQuangVn` | `dish` | `hanoi` | `[30,0]` | `miQuangShopVn` | Quảng Nam noodle counter | Add one shallow ladle of broth, leaving toppings visible | CT2 | [R §4.3](vietnam-research.md) |
| `banhMi` **keep** | `technique` | `mekong` | `[12,12]` | `breadPateCartVn` | Period-safe bread and pâté counter | Split a warm loaf; spread pâté; do not build a modern sandwich | SG1 | [R §4.4; §8](vietnam-research.md) |
| `huTieuVn` | `dish` | `mekong` | `[20,18]` | `huTieuShopVn` | Saigon/Chợ Lớn noodle shophouse | Dip wire basket, drain once, turn noodles into the bowl | SG1 | [R §4.4](vietnam-research.md) |
| `banhXeoVn` | `dish` | `mekong` | `[-16,15]` | `banhXeoHearthVn` | Mekong sizzling rice crêpe kitchen | Swirl batter around the pan; edge crisps and lifts | MK1 | [R §4.5](vietnam-research.md) |
| `mekongKitchenVn` | `technique` | `mekong` | `[-26,21]` | `mekongHomeVn` | Delta family meal of clay-pot fish, sour soup and rice | Brush reduced glaze over fish; pot bubbles once at the rim | MK1 | [R §4.5](vietnam-research.md) |

### Ingredient and flavour stops: eight

| Id | Kind | Area | Position proposal | Prop proposal | Purpose | Reaction | Cluster | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `riceSea` **keep** | `ingredient` | `mekong` | `[-31,12]` | `riceFormsVn` | Connect grain to noodles, wrappers and cakes | Winnow grain; reveal four rice forms; restore | MK1 | [R §5](vietnam-research.md) |
| `chickenSea` **keep** | `ingredient` | `mekong` | `[-29,25]` | `chickenYardVn` | Retain the existing household ingredient without a new room | Hen scratches; one chick follows; restore | MK1 | [R §5](vietnam-research.md) |
| `herbsSea` **keep** | `ingredient` | `hanoi` | `[-22,-22]` | `herbTraysVn` | Name the fresh leaves used at Hanoi and central tables | Vendor pinches mint, coriander and basil into separate bundles | HN1 | [R §5](vietnam-research.md) |
| `fishSauce` **keep** | `flavour` | `mekong` | `[-30,17]` | `phuQuocBarrelsVn` | Phú Quốc PDO route and table seasoning | Tap barrel, catch amber drops, close tap exactly | MK1 | [R §4.5; §5](vietnam-research.md) |
| `starAniseVn` | `flavour` | `hanoi` | `[-35,-14]` | `phoSpiceTrayVn` | Keep phở spices attached to stock, not a generic spice bazaar | Toast star anise and cinnamon; smoke curls; restore | HN1 | [R §5](vietnam-research.md) |
| `lemongrassVn` | `flavour` | `hanoi` | `[12,-14]` | `lemongrassBasketVn` | Anchor Huế broth with lemongrass and shrimp paste | Bruise stalks; release one scent curl; restore bundle | CT1 | [R §5](vietnam-research.md) |
| `riverFishVn` | `ingredient` | `mekong` | `[-19,25]` | `riverFishBasketVn` | Connect delta rice systems to freshwater cooking | Fisher lifts basket; fish turns; basket returns to support | MK1 | [R §5](vietnam-research.md) |
| `lotusTeaVn` | `ingredient` | `hanoi` | `[-7,-21]` | `lotusTeaTrayVn` | Quiet northern landscape and refreshment cue, not a defining national claim | Open lotus leaf, reveal tea cup, close leaf | HN2 | [R §5](vietnam-research.md) |

### Landmarks: six

| Id | Kind | Area | Position proposal | Prop proposal | Purpose | Reaction | Cluster | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `hoanKiem` **keep** | `landmark` | `hanoi` | `[-37,-23]` | `hoanKiemVn` | Orient Hanoi with water and trees | Turtle ripple crosses once; walkers look, then resume | HN1 | [R §2.1; §3 HN1](vietnam-research.md) |
| `motorbikes` **keep id** | `landmark` | `hanoi` | `[-25,-24]` | `streetCarriersVn` | Replace anachronistic mass motorbikes with working street movement | Carrier shifts shoulder pole; bicycle bell turns one head | HN1 | [R §6; §8](vietnam-research.md) |
| `stilts` **keep** | `landmark` | `mekong` | `[-34,23]` | `stiltHomesVn` | Establish delta domestic life without a market spectacle | Family passes bowl upstairs; dog watches from dry step | MK1 | [R §2.3; §6](vietnam-research.md) |
| `hueCitadelVn` | `landmark` | `hanoi` | `[5,-22]` | `hueGateVn` | Give Huế its walled river-city silhouette | Gate flag stirs; boatman points once; both settle | CT1 | [R §2.2; §3 CT1](vietnam-research.md) |
| `hoiAnQuayVn` | `landmark` | `hanoi` | `[34,-6]` | `hoiAnQuayVn` | Show shophouse-to-river loading pattern, not a floating market | Porter rolls jar from threshold to quay; boat remains tied | CT2 | [R §2.2; §3 CT2](vietnam-research.md) |
| `waterPuppetsVn` | `landmark` | `hanoi` | `[-5,-10]` | `waterPuppetsVn` | One restrained northern cultural stop | Puppet rises, turns once and submerges; child reacts | HN2 | [R §6](vietnam-research.md) |

## Count and coverage check

| Measure | Count | Result |
| --- | ---: | --- |
| Room objects | 12 | Inside required 10–15 |
| Ingredient stops | 5 | Inside required 5–10 |
| Flavour stops | 3 | Gives 8 ingredient/flavour stops total |
| Landmarks | 6 | Inside required 3–6 |
| `dish` objects | 8 | All have repertoire keys |
| `technique` objects | 4 | All are rooms and have repertoire keys |
| Total objects | 26 | Unique proposal ids |
| Repertoire keys | 12 | Every room and every place-or-dish object covered |
| Recipe ids | 0 | No forced period-mismatched link |
| Images requested | 43 | 1 concept, 24 room files, 6 sprites, 12 cards |

## What happens next

Stage B **waits for the owner to decide the scope, period, temporal-composite rule, `banhMi` treatment, `motorbikes` recast, Thailand boundary and 43-image budget**. After approval, the owner gives the image tool everything from “Task and reference authority” through Part D of [`vietnam-image-brief.md`](vietnam-image-brief.md) and drops the finished files in:

`~/Downloads/additional game asset/vietnam/`

Nothing in Stage B starts from guessed pictures. No graph, world, scene, style, prop, test, mask or asset file changes in Stage A.
