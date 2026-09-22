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

## Stage B: pictures and blueprint, 2026-09-21

### Picture acceptance

All 43 files arrived in `~/Downloads/additional game asset/vietnam/` with an inventory (`vietnam_asset_inventory.md`). Every delivered dimension was measured on the files, not taken from the inventory: the twelve wides are exactly `1672 × 941`, the twelve portraits exactly `941 × 1672`, and the eighteen sprites and cards are `1254 × 1254` with pixel-exact white at all four corners. Every picture was inspected once at full frame against `docs/art-direction.md` section 8, with measured crops at 100 per cent where a detail was in doubt (the children's faces, the phở pour, the hủ tiếu drain, the Mekong glaze drip, the Saigon garnish bowl).

The Stage A docs name no room scene ids, so each room is **`vn_` plus the room's short name from the delivered file names**: `vn_pho`, `vn_bun_cha`, `vn_banh_cuon`, `vn_com_vong`, `vn_bun_bo_hue`, `vn_hue_cakes`, `vn_cao_lau`, `vn_mi_quang`, `vn_bread_pate`, `vn_hu_tieu`, `vn_banh_xeo`, `vn_mekong_home`.

**Three judgements were calibrated against the shipped canon rather than decided from the text alone**, because the art direction and the shipped assets do not agree everywhere:

- *Children's faces.* The children in VN02–VN06, VN11 and VN12 have large round eyes, big catchlights and rosy cheeks. Measured against `public/scenes/tr_simit/wide.jpg`, whose boy in the fez carries the same degree of enlargement, they sit inside the reference set's own band. **Not a defect.** The art direction's "eyes slightly enlarged, as in the reference set" is the governing line.
- *Card style.* The twelve cards are photographic rather than painterly. `public/scenes/spain-food/jamon.webp` is painted; `public/scenes/turkey-food/baklava.webp` is photographic, down to the soft drop shadow. The shipped set already holds both registers, so the cards **pass** on the Turkey precedent. The lead should note the standing contradiction between art direction section 8 ("painted, not photographic") and the shipped Turkey card art, and rule on it once for every future area.
- *Sprite style.* No sprite in the shipped set is photographic: `props/es-gull.webp`, `props/es-pepper-ristra.webp` and the two named in art direction section 1 are all visibly brushed. All six Vietnam sprites are photographic, and each one is meant to hang over a painterly painting. **Rejected**, with no counter-precedent to fall back on.

**One set-level defect decides most of the rejections.** The same woman — same face, same dark-red patterned wrap tunic, same cream apron, same head-wrap — is the foreground signature cook in eleven of the twelve rooms, across Hanoi, Huế, Hội An, Saigon and the Mekong and across a thirty-year band. Art direction section 3 requires people to "vary age, height, build, skin, hair, face, occupation and gesture". The Spain set, which is the owner's bar, puts a different protagonist in each of its twelve rooms: a man at the paella fire, a young barmaid, a bearded carver, a woman at the tortilla range, a male churrero, an older woman pouring gazpacho, a grey-bearded pulpeiro, a cider pourer. Contact sheets of both sets side by side are what settled it. VN01 keeps her; the other eleven pairs are rejected on this line alone and each carries its own replacement cook so the eleven differ from one another as well.

| File | Verdict | Reason / regeneration instruction |
| --- | --- | --- |
| `vn00_concept.png` | Pass | Six separated clusters north to south, roads to every room, boats tied not floating shops, no Thai motifs, no text |
| `vn01_pho_wide.png` | Pass | Ladle lip, unbroken stream and landing bowl all visible; open stock pot over charcoal; spice tray, flat noodles and shoulder pole clear; empty peg on plain plaster at upper left |
| `vn01_pho_portrait.png` | Pass | Recomposed, not cropped; the three discoveries and the peg sit inside the middle 80 per cent |
| `vn02_bun_cha_wide.png` | Reject | Regenerate with the same composition, food, light and empty rail, but the grill cook is a broad-shouldered man of about fifty-five in an indigo tunic with rolled sleeves and a bare head, not the young woman in the dark-red wrap and head-wrap used in the other rooms |
| `vn02_bun_cha_portrait.png` | Reject | Same replacement cook as the VN02 wide, recomposed vertically with the grill, vermicelli and dipping broth inside the middle 80 per cent |
| `vn03_banh_cuon_wide.png` | Reject | Regenerate with the cook at the cloth steamer a woman of about sixty, grey hair under a black head-cloth, in a plain brown tunic; keep the sheet lift, the filling board, the shallot tray and the empty peg |
| `vn03_banh_cuon_portrait.png` | Reject | Same replacement cook as the VN03 wide; also move the boy's face at the left edge inside the middle 80 per cent |
| `vn04_com_vong_wide.png` | Reject | Regenerate with the woman at the roasting pan a girl of about eighteen in a pale brown tunic with her hair tied back and no head-wrap; keep the pestle, mortar, contained grain jump, winnowing tray, lotus wrapping, empty peg and water patch |
| `vn04_com_vong_portrait.png` | Reject | Same replacement as the VN04 wide, and give the pestle to the same worker who holds it in the wide: in the delivered pair the man pounds in the wide and the woman pounds in the portrait |
| `vn05_bun_bo_hue_wide.png` | Reject | Regenerate with the cook a heavier woman of about forty-five, hair in a low bun and no head-wrap, in a plum tunic; keep the ladle, strainer, complete broth path, lemongrass basket, shrimp-paste jar, herb plate and empty rail |
| `vn05_bun_bo_hue_portrait.png` | Reject | Same replacement cook as the VN05 wide; keep the whole empty rail inside the middle 80 per cent instead of running it off the right edge |
| `vn06_hue_cakes_wide.png` | Reject | Regenerate with the worker at the steamer a slight woman of about thirty in a cream tunic and green sash, hair in a plain bun; keep the four cake forms, the scallion oil, the folded leaves and the empty beam |
| `vn06_hue_cakes_portrait.png` | Reject | Same replacement worker as the VN06 wide, tray lift clear of the open steamer, steam not crossing a face |
| `vn07_cao_lau_wide.png` | Reject | Regenerate with the cook a man of about fifty-five with a grey moustache in a dark brown tunic; keep the noodle lift, cracklings, front-to-river axis and the empty nail |
| `vn07_cao_lau_portrait.png` | Reject | Same replacement cook as the VN07 wide, and open a clean stove mouth or a lit lamp in the portrait: the delivered portrait screens the fire behind the left counter and leaves the room one natural cue short |
| `vn08_mi_quang_wide.png` | Reject | Regenerate with the cook a small stooped woman of about sixty-five in a faded indigo tunic and brown headcloth; keep the measured turmeric pour, the shallow bowl with toppings above the liquid, the broad noodles, sesame cracker, banana flower and empty nail |
| `vn08_mi_quang_portrait.png` | Reject | Same replacement cook as the VN08 wide, and make the serving bowl visibly shallow, wider than it is deep, unlike a soup bowl |
| `vn09_bread_pate_wide.png` | Reject | Regenerate with the vendor a man of about thirty-five in a cream shirt with rolled sleeves and a canvas apron; keep the oven, loaf basket, pâté crock and empty nail, and remove the bowl of shredded pickled carrot and daikon from the counter, which points at the later loaded sandwich |
| `vn09_bread_pate_portrait.png` | Reject | Same replacement vendor as the VN09 wide, loaf resting on the board, both hands and the knife fully visible, bread and pâté only |
| `vn10_hu_tieu_wide.png` | Reject | Regenerate with the cook a man of about forty-five in a plain dark blue tunic; keep the wire basket, the visible drain path into the resting bowl, the open stock pot, the noodle baskets and the empty nail |
| `vn10_hu_tieu_portrait.png` | Reject | Same replacement cook as the VN10 wide; keep the nail inside the middle 80 per cent as delivered |
| `vn11_banh_xeo_wide.png` | Reject | Regenerate with the cook a sturdy woman of about fifty-five in a faded green-brown tunic with a checked khăn rằn over one shoulder; keep the tilted pan, the circular batter path, the lifting crisp edge, the bánh khọt mould and the empty beam |
| `vn11_banh_xeo_portrait.png` | Reject | Same replacement cook as the VN11 wide, no vendor boat, canal beyond fixed posts |
| `vn12_mekong_home_wide.png` | Reject | Regenerate with the cook a grandmother of about seventy, grey hair in a low bun, in a loose brown tunic; keep the open clay pot, the exact brush landing on the fish, the sour soup, the shared rice, the empty beam and the open sky path |
| `vn12_mekong_home_portrait.png` | Reject | Same replacement cook as the VN12 wide, glaze drip landing inside the pot, sky path clear for the kingfisher |
| `vn_motion_rice_sieve.png` | Pass (regenerated 2026-09-21) | Repainted: brushed weave and painted rim ties, no photographic depth of field or specular sheen, no shadow; cord loop kept; keys to 874 × 960 |
| `vn_motion_herb_bundle.png` | Pass (regenerated 2026-09-21) | Repainted with brushed leaf strokes and visible veining; mint, coriander and purple-stemmed Vietnamese basil all readable, tied with cord; keys to 934 × 960 |
| `vn_motion_banana_leaf.png` | Pass (regenerated 2026-09-21) | Repainted, and the folded strip now lies on a diagonal: it trims to 719 × 960, so the short side clears the 400-pixel floor in art direction section 7 with room to spare |
| `vn_motion_lotus_leaf.png` | Pass (regenerated 2026-09-21) | Repainted with visible brushwork in the blade; one leaf on a complete curved stem, three-quarter view; keys to 670 × 960 |
| `vn_motion_bamboo_fan.png` | Pass (regenerated 2026-09-21) | Repainted; the cream paper is toned far enough off pure white that it keys with no hole — zero near-white pixels survive inside the keyed body — and the cord loop is kept; keys to 960 × 757 |
| `vn_motion_kingfisher.png` | Pass (regenerated 2026-09-21) | Repainted with brushed feathers and painted edges, no photographic depth of field; it will sit on the VN12 sky as paint, not as a pasted photo; keys to 960 × 858 |
| `vn_card_pho.png` | Pass | Clear beef stock, flat noodles, sliced beef, scallion and one star anise; white background, no text |
| `vn_card_bun_cha.png` | Pass | Grilled patties and belly in fish-sauce broth beside a vermicelli coil and herbs |
| `vn_card_banh_cuon.png` | Pass | Three filled translucent rolls, fried shallot, one sausage slice |
| `vn_card_com_vong.png` | Pass | Opened lotus leaf, soft green flakes, bamboo spoon; the flakes read slightly plump for pounded young rice but the identity is right |
| `vn_card_bun_bo_hue.png` | Pass | Red-gold broth, round vermicelli, beef shank, pork knuckle and congealed blood cake, lemongrass and herbs |
| `vn_card_hue_cakes.png` | Pass | Bánh bèo dish, opened banana-leaf bánh nậm and translucent bánh bột lọc, grouped and readable |
| `vn_card_cao_lau.png` | Pass | Thick noodles, sliced pork, herbs and crisp squares in a shallow bowl |
| `vn_card_mi_quang.png` | Pass | Broad noodles, shrimp, pork, peanuts, banana flower and a broken sesame cracker in a shallow bowl |
| `vn_card_bread_pate.png` | Pass (regenerated 2026-09-21) | One small loaf split into two halves lying open-faced, coarse pâté spread on the cut crumb of each, one plain egg in its shell beside them on white; no assembled sandwich and no fried egg, so the period decision holds. Photographic register, accepted on the Turkey card precedent |
| `vn_card_hu_tieu.png` | Pass | Clear stock, fine rice noodles, shrimp, sliced pork, chives and fried shallot |
| `vn_card_banh_xeo.png` | Pass | Folded crisp yellow crêpe showing shrimp and bean sprouts, herbs and a dipping bowl |
| `vn_card_mekong_home.png` | Pass | Open clay pot of dark-glazed fish, a sour soup with star fruit and tomato, and white rice |

**Totals after the 2026-09-21 regeneration: 43 files, 21 passed, 22 rejected** — one concept, the VN01 pair, all twelve cards and all six sprites pass; the twenty-two remaining rejections are the VN02–VN12 room paintings, which the owner ruling below accepts as delivered rather than regenerates. At first delivery the count was 14 passed and 29 rejected; the six sprites and the bread-and-pâté card were regenerated and all seven now pass, so **no file is outstanding**.

Notes that belong to the room configs rather than to the pictures, recorded here so the Stage C room maker does not re-discover them:

- Lotus leaves are already painted in VN04 (in the child's hands and in the basket at the lower right, in both orientations). Hang the `vn-lotus-leaf` sprite only over the open water patch, as Spain held back the gull and the fringe where the painting already carried the subject.
- Round woven bamboo trays are already painted hanging at the upper left of `vn11_banh_xeo_portrait.png`. The `vn-rice-sieve` sprite belongs to VN03 and VN04 only, so there is no duplication, but do not add it to VN11.
- VN07 and VN08 carry small red hanging lanterns in the Hội An street behind. Whether household lanterns belong in a 1900–1931 Hội An street is **unverified**; the research sections cited in the image brief do not settle it. It is a question for the researcher, not a picture defect I can prove.
- VN10's Chợ Lớn gate carries carved ornament that reads as pattern, not as characters, at full resolution. No readable text was found anywhere in the 43 files.
- Every pour, strain, drain and brush path was measured at 100 per cent: VN01's ladle, VN05's strainer, VN08's ladle, VN10's wire basket and VN12's glaze brush all start at a pictured lip and end on a pictured surface in both orientations. No stream misses its vessel.

### Import

`scripts/scenes/import-vietnam.py` copies the twelve room pairs to `public/scenes/vn_<room>/wide.jpg` and `portrait.jpg` at their native sizes, keys the twelve cards from their white backgrounds into trimmed, edge-bled, transparent WebP in `public/scenes/vietnam-food/<name>.webp`, keys the six sprites into `public/scenes/props/vn-<name>.webp`, saves the concept as `public/scenes/vn_concept.jpg`, adds its own keys to `src/fw/scenes-props.json` and writes `public/scenes/vietnam-assets.json` with a SHA-256 of every source file. It reads, modifies and writes `scenes-props.json`, so it adds only `vn_` and `vn-` keys and leaves every other area's keys untouched; it is idempotent, so if that file changes on disk between the read and the write, running it again is safe.

```
uv run --with pillow --with numpy --with scipy scripts/scenes/import-vietnam.py "$HOME/Downloads/additional game asset/vietnam"
```

It was run twice. The second run produced byte-identical output for `scenes-props.json`, `vietnam-assets.json` and the sampled JPG, WebP card and WebP sprite. The one note it printed on that first delivery was that `vn_motion_banana_leaf.png` trimmed to a 214-pixel short side after the 960-pixel long-side cap, which is the acceptance line quoted in that sprite's rejection row; the regenerated leaf trims to 719 px and the note is gone.

Keys added to `src/fw/scenes-props.json` (24 room entries in `rooms`, 6 in `props`; 0 lines removed):

| `rooms` | `props` (trimmed WebP size) |
| --- | --- |
| `vn_pho`, `vn_bun_cha`, `vn_banh_cuon`, `vn_com_vong`, `vn_bun_bo_hue`, `vn_hue_cakes`, `vn_cao_lau`, `vn_mi_quang`, `vn_bread_pate`, `vn_hu_tieu`, `vn_banh_xeo`, `vn_mekong_home`, each `wide` `[1672, 941]` and `portrait` `[941, 1672]` | `vn-rice-sieve` `[874, 960]`, `vn-herb-bundle` `[934, 960]`, `vn-banana-leaf` `[719, 960]`, `vn-lotus-leaf` `[670, 960]`, `vn-bamboo-fan` `[960, 757]`, `vn-kingfisher` `[960, 858]` — the regenerated sprites' sizes; the first delivery's were `[862, 960]`, `[930, 960]`, `[214, 960]`, `[609, 960]`, `[960, 690]` and `[960, 795]` |

Card art names in `public/scenes/vietnam-food/`: `pho`, `bun-cha`, `banh-cuon`, `com-vong`, `bun-bo-hue`, `hue-cakes`, `cao-lau`, `mi-quang`, `bread-pate`, `hu-tieu`, `banh-xeo`, `mekong-home`. A later `VIETNAM_CARD_ART` maps object ids to these names, as `SPAIN_CARD_ART` does.

**The rejected pictures were imported too**, so the pipeline is complete and a regeneration only means dropping the new files in the same folder and re-running the importer. These paths are overwritten when the regenerated files arrive: `public/scenes/vn_bun_cha/`, `vn_banh_cuon/`, `vn_com_vong/`, `vn_bun_bo_hue/`, `vn_hue_cakes/`, `vn_cao_lau/`, `vn_mi_quang/`, `vn_bread_pate/`, `vn_hu_tieu/`, `vn_banh_xeo/`, `vn_mekong_home/` (both orientations each), `public/scenes/vietnam-food/bread-pate.webp`, and all six `public/scenes/props/vn-*.webp`. `vn_pho/`, `vn_concept.jpg` and the other eleven cards stay as imported. Every hash in `vietnam-assets.json` is rewritten on each run, so the manifest is the record of which source produced which file.

All 43 imported files were loaded from the running dev server and measured in the browser: none failed, every wide served at `1672 × 941`, every portrait at `941 × 1672`, and the six sprites served at exactly the sizes registered in `scenes-props.json`.

### Room audit

**No Vietnam room shows in `scripts/tests/room-audit.html` yet, and none can until Stage C writes the scene config.** The page discovers rooms from three static module imports, not from the file system and not from `scenes-props.json`: it builds `SCENES` from `SCENES` in `/src/fw/scenes-china.ts`, `TURKEY_SCENES` in `/src/fw/scenes-turkey.ts` and `SPAIN_SCENES` in `/src/fw/scenes-spain.ts`, then renders each id in two iframes pointed at `rooms.html?audit&room=<id>`, which merges the same three modules again. Checked live on the dev server at `localhost:5180`: the page reports 66 rooms over 33 pages, and the set of discovered ids contains no `vn_` entry.

What Stage C must write for the twelve rooms to appear, in this order:

1. `src/fw/scenes-vietnam.ts`, exporting `VIETNAM_SCENES` with one `paintedScene` entry per room, each `folder` being the room scene id above. Not written here: `scenes-*.ts` is outside the Stage B hand-over, and the coordinates have to be measured on each orientation first.
2. `scripts/tests/room-audit.html`: add `import {VIETNAM_SCENES} from '/src/fw/scenes-vietnam.ts';` beside the other three imports, and add `...VIETNAM_SCENES` to the `const SCENES={...}` literal on the next line.
3. `scripts/tests/rooms.html`: the same two edits, because room-audit's iframes render through that page.

Everything the scene config needs is already on disk and serving: `paintedScene` resolves its painting as `scenes/<folder>/wide.jpg` and `portrait.jpg`, and `pAt()` reads `PROPS.rooms[<folder>].portrait` out of `scenes-props.json`. Both are in place for all twelve `vn_` folders, so the config is the only missing piece.

**Owner rulings, 2026-09-21.** The twelve room paintings (VN01–VN12, both orientations, the 22 room rows in the acceptance table) are accepted as delivered despite the repeated cook across eleven of the twelve rooms; the repetition is recorded as an accepted shortfall against art direction section 3 rather than fixed, and the 22 room rows stay in the table above for the record but are not regenerated. Regeneration is limited to the six sprites and one card: `vn_motion_rice_sieve.png`, `vn_motion_herb_bundle.png`, `vn_motion_banana_leaf.png`, `vn_motion_lotus_leaf.png`, `vn_motion_bamboo_fan.png`, `vn_motion_kingfisher.png` and `vn_card_bread_pate.png` — seven files.

**Regeneration closed, 2026-09-21.** All seven regenerated files arrived, were checked against the rejection reasons above and passed, and were re-imported. **Zero files outstanding.** The importer was run twice and the second run was byte-identical; it changed only the six `public/scenes/props/vn-*.webp` sprites, `public/scenes/vietnam-food/bread-pate.webp`, `public/scenes/vietnam-assets.json` and the six `vn-` sizes in `src/fw/scenes-props.json`, and no other file in `public/scenes`. It printed no short-side note, because every sprite now clears 400 px. The registered sizes moved from `vn-rice-sieve` `[862, 960]`, `vn-herb-bundle` `[930, 960]`, `vn-banana-leaf` `[214, 960]`, `vn-lotus-leaf` `[609, 960]`, `vn-bamboo-fan` `[960, 690]`, `vn-kingfisher` `[960, 795]` to `[874, 960]`, `[934, 960]`, `[719, 960]`, `[670, 960]`, `[960, 757]` and `[960, 858]`. The six keyed sprites were composited over dark grey on one contact sheet: no white fringe and no bitten edge on any of them, the fan's ribs and gaps key correctly and its cream paper survives whole, and the largest surviving near-white patch anywhere in a keyed body is 19 pixels, inside a painted leaf highlight.

### Blueprint (fixed): Vietnam on the Southeast Asia table

**The table frame, the band rule and the sea polygon are shared with Thailand and are written once, in [thailand-world.md](thailand-world.md) under "Blueprint (fixed): the Southeast Asia table". Read that section first.** In short: `world-seasia.ts` grows to `W: 120, D: 56, cx: -22`, so x runs -82 to 38 and z stays -28 to 28; **Vietnam owns x -12 to 38** and nothing of it crosses west of -12; one continuous `seaWater()` polygon wraps the west, south and east edges, and Vietnam's coast is the east one, as in reality. Every number below is held as data in `scratchpad/seasia-blueprint.py` and passes the paper check there together with Thailand's.

Vietnam's own water:

| Feature | Width | Points |
| --- | --- | --- |
| The Red River, `estuaryWater` blend from x 21 to the mouth | 3.6 on a 5.2 rim | [-9,-28] [-8,-26] [-5,-25] [1,-24.5] [8,-24] [13,-24.4] [18,-25] [21,-25.6] [24.3,-26.2] |
| The Perfume River at Huế, `estuaryWater` from x 29 | 2.8 on a 4.2 rim | [12.5,-11.5] [14.5,-10.2] [17,-9] [21,-7] [25,-6] [29,-6] [33,-7] |
| Mekong channel A | 2.6 | [-12,14.5] [-7,16.5] [-2,19.5] [2,22] [4,24] |
| Mekong channel B | 2.6 | [-7.7,19.2] [-4.5,21] [-2.5,23.4] |
| Mekong channel C, the cross cut | 2.0 | [-7,16.5] [-7.8,20] [-8.2,23.4] |
| Hoàn Kiếm lake | circle r 1.8 | centre [1, -19.8] |

The Red River comes off the north edge at x -9 and crosses the whole north of the band **north of HN1 and HN2**, between the guild street and the table's north edge, reaching the eastern sea at [24.3, -26.2] with an estuary blend — **north of Huế, so Hội An's sea stays its own**; the east coast carries a bight for it, `[34,-16] [32,-21] [29,-23.5] [24,-25.5] [24.5,-28]` (the shared polygon in [thailand-world.md](thailand-world.md)). HN1 and HN2 sit on its south bank and look at it; only the north bank path crosses it. The Perfume River rises in the hills east of HN2, passes Huế at CT1 and reaches the eastern sea at [33, -7]. The three Mekong channels are re-laid in MK1 from the west band edge to the southern sea and **replace today's delta curve entirely**; the old curve starting at x -38 is deleted, not extended. Nothing stands in Vietnamese water: there is no Vietnamese on-water stand, and no floating market — that composition belongs to Thailand.

Clusters and their ground tints. Positions are final; every one of the **twenty-eight** objects appears exactly once — the Stage A list of 26 plus the two the lead added to SG1 at Stage B. The route reads north to south.

| Cluster | Centre | Tint | Holds |
| --- | --- | --- | --- |
| HN1 Hanoi guild street | [-4, -18] | `#c9c0a8` swept earth and brick, 16 x 12 | `hanoiKitchen` [-6, -20.3] on the street's south side, `bunChaVn` [-0.8, -14.6] in the courtyard off its east end, `herbsSea` [-10.6, -17.6] at the west gate, `starAniseVn` [-5.4, -16.7] opposite the phở kitchen, `hoanKiem` [-2.6, -21.2] on the lake's west shore, `motorbikes` [2.4, -16.6] as the street carriers' stand. One decorative house: **`vn-tube-terrace` [-9.6, -22.2]**, a terrace of narrow fronts north of the street, counted as one |
| HN2 Red River craft courtyard | [8, -16] | `#b9c48a` river silt green, 14 x 10 | `banhCuonVn` [6, -18.5] under the cloth steamers, `comVongVn` [9.2, -14.9] in the green-rice courtyard, `lotusTeaVn` [5.3, -11.6] on the lotus lane, `waterPuppetsVn` [10.4, -18.3] standing at the edge of its own shallow tank (decor water, circle r 1.0 at [11, -20.8]; the puppeteer is behind the screen on the bank, not in it). One decorative house: **`vn-courtyard-house` [13.2, -19.4]**, bamboo-screened, at the cluster's south-east edge |
| CT1 Huế garden edge | [16.5, -6.5] | `#a9b58a` garden green under `#c4bba6` clay tile | `hueKitchenVn` [14.8, -4.6] on the veranda, `banhHueVn` [19, -4] at the steamer bench, `lemongrassVn` [12, -4.4] in the baskets at the garden gate, `hueCitadelVn` [19, -12] on the river bank with its gate flag. One decorative house: **`vn-hue-garden-house` [16, -1.4]**, clay-tiled, behind the gardens |
| CT2 Hội An shophouses | [28, -1] | `#c4bba6` paving turning to `#eadfbd` at the quay | `caoLauVn` [26.2, -2] behind the street counter, `miQuangVn` [28.6, 1.8] at the noodle counter, `hoiAnQuayVn` [32, -2] on the quay at the eastern sea with the boat tied alongside, never on the water. One decorative house: **`vn-hoian-front` [25, 1]**, a shophouse front inland of the quay |
| SG1 Saigon and Chợ Lớn | [18, 14] | `#c9c0a8` street paving, 16 x 12 | `banhMi` [16.9, 13.5] at the bread and pâté counter, `huTieuVn` [18.7, 15.4] in the deep shophouse, `caPheVn` [22, 10.2] at the coffee stall where the coast road enters the street, `benThanhVn` [14, 17.5] on the market's own corner. One decorative house: **`vn-cholon-row` [18.4, 20.2]**, a shophouse row on the street's seaward side |
| MK1 Mekong homestead | [-5, 13] | `#7fb86a` wet delta green with `#8fb86a` flooded squares | `mekongKitchenVn` [-7.5, 12.5] at the family hearth, `banhXeoVn` [0.3, 13.8] at the pan, `riceSea` [-7, 9], `chickenSea` [-10.8, 11.4] in the yard, `fishSauce` [-3.6, 9.4] at the barrels, `riverFishVn` [-11, 18.6] on the channel bank beyond the bridge, `stilts` [-4.5, 13.2] on the wet edge. One decorative house: **`vn-stilt-house` [-0.8, 9.6]**, stilted, on dry ground above the channel |

**Added to the object list at Stage B by the lead**, to bring SG1 up from two objects. Both are card-only, both are inside the 1900–1931 band, and both are the Researcher's to write at Stage C. They take the list from 26 to **28**: 12 rooms, 9 ingredient and flavour stops, 7 landmarks.

| Id | Kind | Area | Position | Prop | Purpose | Cluster | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `caPheVn` | `flavour` | `mekong` | [22, 10.2] | `caPheStallVn` | The coffee filter: French-era filter coffee in Saigon, the drip pot on the glass, in period | SG1 | **Added at Stage B by the lead** |
| `benThanhVn` | `landmark` | `mekong` | [14, 17.5] | `benThanhVn` | Bến Thành market, opened 1914 and so inside the band: the clock front and the produce aisles that gave the street its trade | SG1 | **Added at Stage B by the lead** |

Roads, one continuous ribbon each, every door on a road and nothing solid on a centreline:

| Road | Width | Points |
| --- | --- | --- |
| VN-R1 the guild street | 2.4 | [-10.8,-19.6] [-7.4,-18.2] [-4,-18.8] [-0.6,-17.2] [1.8,-14.2] |
| VN-R1b the lakeside path | 1.4 | [-0.6,-17.2] [-1.8,-19.8] [-0.6,-22.2] [2.2,-22.4] [3.4,-20] |
| VN-R2 the Red River road | 2.0 | [1.8,-14.2] [5,-16.4] [8.2,-17.2] [11.4,-16] [12.8,-13] |
| VN-R2b the lotus lane | 1.6 | [5,-16.4] [5.6,-13.4] [8,-11.8] |
| VN-R2c the north bank path | 1.4 | [2.2,-22.4] bridge [2,-24.4] [2.2,-27] |
| VN-R3 the Huế river road | 2.0 | [12.8,-13] [12.6,-8.8] [14.6,-6.4] [17.6,-5.6] [19.8,-6.4] [19.6,-10.4] |
| VN-R4 the Hội An quay road | 2.2 | [19.6,-10.4] [22.4,-8.4] bridge [24.6,-6.2] [26.6,-4.4] [28.6,-2] [30.6,1.6] |
| VN-R4b the quay spur | 1.6 | [28.6,-2] [30.2,-3.4] [31,-0.4] |
| VN-R5 the Saigon street | 2.4 | [17.6,10.8] [14.2,13.2] [16.2,16.6] [20.4,17.6] [22.2,14.2] [20,12] [17.6,10.8] |
| VN-R6 the coast road | 2.0 | [30.6,1.6] [30,5.6] [27.4,10] [23.4,12.6] [20,12] |
| VN-R7 the delta lane | 1.8 | [-11.4,8.8] [-8.4,10.4] [-5.6,11] [-2.6,12.2] [-0.6,16] |
| VN-R7b the fish-basket path | 1.4 | [-8.4,10.4] [-9.6,14.2] bridge [-9.8,17.8] |
| VN-R8 the delta–Saigon road | 1.8 | [-0.6,16] [3.6,17.6] [8,16.8] [12.4,15.2] [14.2,13.2] |

The network is one walkable piece, north to south: VN-R1 hands to VN-R2 at [1.8,-14.2], VN-R2 to VN-R3 at [12.8,-13], VN-R3 to VN-R4 at [19.6,-10.4], VN-R4 to VN-R6 at [30.6,1.6], VN-R6 to VN-R5 at [20,12], VN-R5 to VN-R8 at [14.2,13.2] and VN-R8 to VN-R7 at [-0.6,16]. VN-R1b, VN-R2b, VN-R2c, VN-R4b and VN-R7b are spurs off those. Vietnam's network does not touch Thailand's: the two are separate walks, as the band rule requires.

**Bridges.** `woodenBridge` at [2,-24.4] where the north bank path crosses the Red River, at [24.6,-6.2] where the Hội An quay road crosses the Perfume River, and at [-9.7,15.5] where the fish-basket path crosses Mekong channel A. Decks at the road height, ends on the banks, span square to the water.

Walker loops, residents in the area's clothing, steps matched to distance (`vietnamWalk`), speed 0.008 in the guild street and 0.006 elsewhere:

1. **The guild street**, VN-R1 end to end, six residents, three carrying a shoulder pole with a basket at each end, one wheeling a bicycle
2. **The Red River road**, VN-R2 between [1.8,-14.2] and [11.4,-16] with the lotus lane spur, five residents, one with a tray of green rice
3. **The Hội An quay**, VN-R4 and VN-R4b between [22.4,-8.4] and [31,-0.4], five residents, two porters rolling a jar from threshold to quay
4. **The delta lane**, VN-R7 between [-11.4,8.8] and [-0.6,16], four residents, one carrying a fish basket over the bridge

**Decor.** The cap is **five per area id**, so the package's six are legal: four in `hanoi` — `vn-tube-terrace` [-9.6, -22.2], `vn-courtyard-house` [13.2, -19.4], `vn-hue-garden-house` [16, -1.4], `vn-hoian-front` [25, 1] — and two in `mekong` — `vn-cholon-row` [18.4, 20.2], `vn-stilt-house` [-0.8, 9.6]. Each is a 1.5-radius blocker in the paper check: at least 2.5 from every clickable, clear of every road corridor by half that road's width plus 1.5, and out of the water. A shelter a stand builds for itself is that stand's own and is not one of the six, but it counts as a blocker in the arrival-camera visibility check exactly as these do. The six existing `motorbike()` vehicles become **street carriers with shoulder poles, two handcarts and two bicycles** on VN-R1 and VN-R2; today's circular Hanoi ring road at [14.5,-22] with its `RingGeometry` is deleted outright and replaced by VN-R1.

**Countryside between the clusters.** Red River paddy and dyke banks from [-11,-26] to [14,-22]; mulberry and bamboo stands on the north bank; pine and areca on the Huế garden slopes from [10,-4] to [18,2]; coconut and water-coconut along the Hội An river bank; tamarind and flame trees on the Saigon street; flooded delta squares, banana and water-hyacinth mats from [-11,7] to [2,22], with kingfishers on the channel stakes; no palm-fringed beach and no parasols anywhere. Every crop or tree that carries an object responds to a click (the Stand maker's file); the rest is the Builder's.

#### Amendments, 2026-09-21 (lead)

The lead accepted the blueprint above with three amendments. The tables in this section are the fixed record and already carry them; this note says what moved and why.

1. **SG1 gains two objects**, `caPheVn` and `benThanhVn`, listed in their own table above and marked as added at Stage B. SG1 goes from 2 objects to 4 and the package from 26 to **28**: 12 rooms, 9 ingredient and flavour stops, 7 landmarks. SG1's centre moves [18.3, 14.5] → **[18, 14]** to sit among the four. The Stage A object list further up this document is left as the Stage A record and is not rewritten; this section supersedes it on positions and counts.
2. **The Red River is shortened.** It keeps its source at the north edge at x -9 and now reaches the sea at **[24.3, -26.2]**, north of Huế, instead of running the whole north edge to [31, -27]. Hội An's sea is therefore its own. The shared east coast gains a bight to take it, `[34,-16] [32,-21] [29,-23.5] [24,-25.5] [24.5,-28]`, and the Hạ Long karst decor moves to x 28 to 36, z -27 to -23. The estuary blend now starts at x 21. **No HN2 road crossing had to move**: the only road that crosses the river is `VN-R2c` at [2, -24.4], west of everything that changed, and its bridge is unchanged. No Vietnamese object moved for this.
3. **Decorative houses are fixed coordinates, not counts.** The cap is recorded as **five per area id**, so `hanoi`'s 4 and `mekong`'s 2 stand as they were. Each of the six now has a coordinate in the cluster table and is a **1.5-radius blocker in the paper check**: at least 2.5 from every clickable, clear of every road centreline by half that road's width plus 1.5, and out of the water. HN1's two tube-house terraces became one terrace (`vn-tube-terrace`) so the house count per cluster matches the coordinates, and HN2 keeps its screened courtyard house as a fixed building at [13.2, -19.4] rather than an unplaced one.

All six checks pass on the amended numbers, first run, with no further nudges to any clickable.

### Module contracts for Stage C

Every agent owns whole files. Stubs exist so the type check passes while files are empty. Vietnam's set; Thailand's is in [thailand-world.md](thailand-world.md), and the shared files below have **one** owner across both areas, not one per area.

| File | Owner | Exports (keep these names and signatures) |
| --- | --- | --- |
| `vietnam-architecture.ts` | Builder, first | `VN` palette constant with the twelve names from the research; `vietnamHouse(style, w, d, h, { storeys, posts })` for styles `tube`, `courtyard`, `hue`, `hoiAn`, `cholon`, `stilt`; `hueGate()`; `communalRoof()`; `puppetTank()`; `fishSauceBarrelRack()`; `steamerCloth()` |
| `vietnam-people.ts` | Builder, second | `vietnamResident(seed, working?)` and `vietnamWalk(person, from, to, range, seed)` following `spain-people.ts`; the clothing profiles as data; `shoulderPoleCarrier()` and `followCarrier()` |
| `vietnam-landscape.ts`, `vietnam-town.ts`, `vietnam-countryside.ts` | Builder | `vietnamLandscape(ctx)`, `vietnamTown(ctx)`, `vietnamCountryside(ctx)`. The landscape owns the Red River, the Perfume River, the three Mekong channels, both estuary blends and Hoàn Kiếm lake, and exports `VN_LANES`, `VN_BRIDGES` in the shape `spain-town.ts` uses. **It does not own the sea polygon**: that is one shape for the whole table and belongs to `thailand-landscape.ts` |
| `props-vietnam.ts` | Stand maker | `VIETNAM_PROPS` keyed by every `prop` name in the object list, `VIETNAM_ICONS`, `VN_LINES` keyed by object id; `streetCarriersVn()`, `handcart()`, `bicycle()`, `sampanTied()` |
| `vietnam-objects.ts`, `vietnam-stories.ts` | Researcher | `VIETNAM_OBJECTS`, `VIETNAM_CARD_ART`, `VIETNAM_NEXT`, `VIETNAM_STORY_DEPTH`, `VIETNAM_SOURCES` |
| `scenes-vietnam.ts`, `vietnam-ambience.ts` | Room maker | `VIETNAM_SCENES`, `VIETNAM_AMBIENCE`; hotspot labels and texts live in `scenes-vietnam.ts`; `scene-ambience.ts` gains `PAINTED_SIGNATURES` entries only |
| `scripts/tests/vietnam-world.mjs`, `scripts/tests/vietnam-reactions.mjs` | Builder, Stand maker | Copies of the Spain harnesses with Vietnamese ids. `vietnam-world.mjs` tests every vertex of every stand against the sea polygon, both rivers, all three channels and the lake from the first commit, plus corridors, gait and gait direction |
| **shared** `world-seasia.ts` | Builder, Stage C — **Thailand's Builder owns it** | Table growth, the new `shore()` edge test, `{ ...SEASIA_PROPS, ...THAILAND_PROPS, ...VIETNAM_PROPS }` and both areas' layout calls. Vietnam's Builder hands over a single `vietnamLayout(ctx)` call and does not edit this file |
| **shared** `world-camera.ts` | Builder, Stage C — Thailand's Builder | `southeast-asia` beside `mediterranean` in `worldZoomLimit`, which carries `worldFogRange` with it |
| **shared** `graph.ts` | Lead, Stage D | Display names and centres below; `motorbikes` keeps its id and gains a prop; `hoanKiem`, `stilts`, `riceSea`, `chickenSea`, `herbsSea`, `fishSauce`, `hanoiKitchen` and `banhMi` keep their ids and move to the positions above; the **sixteen** new objects registered, including `caPheVn` and `benThanhVn` added at Stage B |
| **shared** `world-intros.ts` | Researcher | The Southeast Asia intro's Vietnamese beats re-pointed at the new clusters; `["hanoi","andaman"]` becomes `["hanoi","bangkok"]`. `world-intros.mjs` must still pass |
| **shared** `scripts/tests/room-audit.html`, `scripts/tests/rooms.html` | Lead, Stage D | Two edits each: `import {VIETNAM_SCENES} from '/src/fw/scenes-vietnam.ts';` and `...VIETNAM_SCENES` in the `SCENES` merge, beside Thailand's |
| `main.ts`, `ui.ts`, `README.md`, this file | Lead, Stage D | Registration only |

**Display names and centres, proposed for the lead to confirm.** Both ids are kept; only the display strings and centres change, and `hanoi` now covers the north *and* the centre, which its present name does not say.

| Id | Proposed `name` | `zh` | Proposed `blurb` | Proposed `center` |
| --- | --- | --- | --- | --- |
| `hanoi` | Vietnam: the north and the centre | Bắc và Trung Bộ | the guild street, the Red River, Huế's garden and the Hội An quay | **[-4, -18]** — HN1's centre, the arrival view |
| `mekong` | Saigon and the Mekong delta | Sài Gòn · Đồng bằng sông Cửu Long | bread and noodles in Chợ Lớn, the delta hearth, fish sauce and stilt houses | **[-5, 13]** — MK1's centre |

The Stand maker may import from `vietnam-architecture.ts` and `vietnam-people.ts` once they exist; until then a stand uses `person()` and `wear()` from `props.ts` and a local shelter. Nobody edits another owner's file; a missing helper is built in the owning file.

## State at the end of 2026-09-21

Stage C started the same day the blueprint was fixed, and the weekly usage limit stopped it mid-run. Committed: the Researcher files (objects, story depth, discoveries, speech lines). Partial and uncommitted in the working tree: the Stand maker file `props-*.ts`. Not started: the Room maker files, the Builder modules and the shared `world-seasia.ts` growth. The Thailand Builder carries an owner rule received the same day: the dark-to-light blue water transition of this table is kept, same materials and estuary blends at every mouth. Stage D notes: re-point the `stall-herbs-th` alias to `chilliesSea`; the Southeast Asia intro is at its four-beat cap. Work resumes after the reset in the order Stand makers, Builders, Room makers, then Stage D.

## Stage D: integration, 2026-09-22

The Vietnam package is registered. Both ids are kept; the display names and the centres are the ones this
document proposed, and `hanoi` now covers the north *and* the centre.

### What was registered

| File | What changed |
| --- | --- |
| `graph.ts` | `VIETNAM_OBJECTS` imported and spread into `SEASIA_OBJECTS` beside `THAILAND_OBJECTS`, the way `SPAIN_OBJECTS` is spread into `MED_OBJECTS`. Every Stage A object the old list held is redefined in the two new files under the same id — `riceSea`, `chickenSea`, `herbsSea`, `fishSauce`, `hanoiKitchen`, `banhMi`, `hoanKiem`, `motorbikes` and `stilts` among them — so the hand-written list is gone. `AREAS.hanoi` is `name: "Vietnam: the north and the centre"`, `zh: "Bắc và Trung Bộ"`, `blurb: "the guild street, the Red River, Huế's garden and the Hội An quay"`, `center: [-4, -18]`; `AREAS.mekong` is `name: "Saigon and the Mekong delta"`, `zh: "Sài Gòn · Đồng bằng sông Cửu Long"`, `blurb: "bread and noodles in Chợ Lớn, the delta hearth, fish sauce and stilt houses"`, `center: [-5, 13]`. The `andaman` area is gone from the `Area` union, from `AREAS` and from every reference in `src` and `scripts` |
| `main.ts` | `VIETNAM_SCENES` and `THAILAND_SCENES` in the `SCENES` merge, and a `southeast-asia` arrival target at `AREAS.bangkok.center` — the old hard-coded `(-4, 0, 2)` lands in the two-unit strip between the two areas on the grown table |
| `ui.ts` | Card art keyed by world **and area**, because both areas share the world id `southeast-asia`: `bangkok` reads `scenes/thailand-food/` and everything else reads `scenes/vietnam-food/`. `VIETNAM_NEXT` and `VIETNAM_SOURCES` wired into "Continue exploring" and "Sources and further reading" on the same branches. The Stage A `ICON_KEYS` entries for ids Stage C re-propped (`riceSea`, `chickenSea`, `herbsSea`, `fishSauce`, `hoanKiem`, `motorbikes`, `stilts` and the rest) were removed, so each renders its own new prop instead of a Stage A icon drawn for a different object |
| `snapshot.ts` | `VIETNAM_ICONS`/`VIETNAM_PROPS` and `THAILAND_ICONS`/`THAILAND_PROPS` in both lookup chains, before the Stage A `SEASIA_*` sets |
| `repertoire.ts` | `VIETNAM_REPERTOIRE` and `THAILAND_REPERTOIRE` in `REPERTOIRE_TABLES` |
| `README.md` | the world's areas line |

`world-intros.ts` needed no edit: the Southeast Asia intro already names `["hanoi","bangkok"]` and no beat
mentions `andaman`. Story depth is already appended to each blurb in `vietnam-objects.ts`; discoveries,
ambience and the two room test pages were already wired by the Room maker.

### Harnesses

`scripts/tests/room-loops.mjs` now bundles `scenes-vietnam.ts` and `scenes-thailand.ts` beside China, Turkey
and Spain: **90 rooms audited**, the twelve Vietnamese rooms among them, each at three or four always-on loops
in wide and portrait with its hung sprites counted. `scripts/tests/repertoire.mjs` was extended from three
tables to five.

`scripts/tests/vietnam-world.mjs` is unchanged. Its road-connectivity, road-surface-overlap and paving checks
were copied into `scripts/tests/thailand-world.mjs`; what had to change to fit the Thai coast, and the one
bridge-ramp fix the copied `coplanarOverlaps` check found, are written up in
[thailand-world.md](thailand-world.md) under the same heading.

### Results

`npm run typecheck` clean. `npm test`: 21 harnesses passed. `object-ids.mjs`: 391 objects, every id unique,
every alias and parent resolves. `npm run build:pages` clean. `scripts/audit/objects.mjs`:

```
bangkok: rooms=12 card-only-with-prop=16 hit/child=4
hanoi:   rooms=8  card-only-with-prop=9  hit/child=0
mekong:  rooms=4  card-only-with-prop=7  hit/child=0
```

Twenty-eight Vietnamese objects across the two areas, sixty on the table.

### The live check

On a restarted dev server and a fresh load, through `window.__fw`.

- **Arrival** at target `(-44, 0, 0)`, the Bangkok khlongs, with sixty objects placed
- **Roads**: all thirteen Vietnamese routes walked end to end, and all nine Thai
- **Objects**: all sixty open. Every Vietnamese card object opens its own card — `riceSea` "Rice in four
  forms", `chickenSea` "The chicken yard", `herbsSea` "The herb trays", `fishSauce` "The Phú Quốc barrels",
  `starAniseVn`, `lemongrassVn`, `riverFishVn`, `lotusTeaVn`, `caPheVn`, `hoanKiem`, `motorbikes`, `stilts`,
  `hueCitadelVn`, `hoiAnQuayVn`, `waterPuppetsVn`, `benThanhVn` — with three or more paragraphs, a rendered
  badge, "Continue exploring" and "Sources and further reading". The twelve room objects each open their room,
  and "The story" inside opens a card with painted art and seven paragraphs. **No object failed to open**
- **Rooms**: all twelve Vietnamese rooms (and all twelve Thai) open and show their painting at 1280 x 720 and
  again at 390 x 844, three hotspots and six layers each, the portrait painting loading at phone size. **No
  room failed to show**
- **Console**: one line in the whole pass, `THREE.WebGLProgram: Shader Error 0 - VALIDATE_STATUS false` with
  an empty info log, which a fresh load into **China** reproduces exactly. Not this world's, and nothing renders
  wrong. Nothing else

Contact sheet at
`/private/tmp/claude-501/-Users-yingyingfu-Projects-fyying-food-tour/0dc0bae3-03ac-485b-a807-0a6ab67f1645/scratchpad/seasia-stage-d.png`.

### Left for the shared-ground pass

**Twenty Vietnamese stand-on-stand ray failures** (`A / B` reads "B covers A on n of 10 rays from the camera"),
from `KNOWN_STAND_COVER` in `scripts/tests/vietnam-world.mjs`:

`waterPuppetsVn / comVongVn` 9 · `riceSea / stilts` 7 · `fishSauce / stilts` 6 · `caoLauVn / miQuangVn` 4 ·
`hoanKiem / bunChaVn` 4 · `riceSea / mekongKitchenVn` 3 · `caPheVn / huTieuVn` 3 · `stilts / banhXeoVn` 3 ·
`hueCitadelVn / hueKitchenVn` 3 · `hueCitadelVn / banhHueVn` 3 · `hoiAnQuayVn / miQuangVn` 3 ·
`banhCuonVn / comVongVn` 2 · `banhMi / benThanhVn` 2 · `fishSauce / banhXeoVn` 2 ·
`hanoiKitchen / starAniseVn` 1 · `comVongVn / hueKitchenVn` 1 · `chickenSea / mekongKitchenVn` 1 ·
`lemongrassVn / hueKitchenVn` 1 · `motorbikes / bunChaVn` 1 · `hoanKiem / hanoiKitchen` 1

**Nine Vietnamese stands reaching into the water**, from `KNOWN_OVER_WATER` in the same file, in units:
`hanoiKitchen` 1.85 · `banhCuonVn` 1.74 · `hoiAnQuayVn` 1.45 · `caoLauVn` 1.39 · `mekongKitchenVn` 1.29 ·
`banhHueVn` 1.17 · `hueCitadelVn` 1.10 · `hueKitchenVn` 1.03 · `hoanKiem` 0.95. `hoiAnQuayVn` is the one that is
right as it stands: a quay is built at the water's edge, and the blueprint puts it there.

Both are ceilings, not licences: a listed pair may not get worse and an unlisted one may not appear. The stand
anchors are fixed in `vietnam-objects.ts` and the geometry in `props-vietnam.ts`, so closing them is an object-
list change or a stand resize, not a registration. The Thai half of both lists is in
[thailand-world.md](thailand-world.md) under the same heading.
