# Turkey world

The Middle East world opens in Istanbul. Turkey occupies a connected northern cluster, with Aegean kitchens to the west, Anatolian ovens and family tables to the east, and Black Sea tea terraces in the northeast. The Levant, Arabia and Persia sit 22 world units farther south, beyond a transition of coves, gardens, cultivated foothills and grouped peaks. A single Turkey navigation button frames its connected neighbourhoods. The wooden board has a continuous coastal water surface; the inland river begins at a rocky spring pool and meets the eastern coast. This is a food diorama, not a geographic scale map.

## Ottoman town redesign

The September 13 redesign follows the brief in **Designing Turkey’s Food World**. Warm limestone paving connects a mosque courtyard, an open arched bazaar, timber house blocks and the bathhouse square. Houses have projecting bays, wooden brackets, shutters, tiled eaves and flower boxes. A raised residential terrace gives the inland streets a second level. The palette uses cream plaster, dark timber, terracotta, muted textile red, copper and İznik blue.

The hammam has five lead-coloured domes, roof lights, a stone entrance and a towel rack. The square fountain has four flowing basins and tile panels. Six slender minarets evoke Sultan Ahmed’s skyline. The mosque, a timber house, waterfront and Cappadocia now open cultural cards; these are imagined representations, not exact reconstructions. Döner and gözleme add two ordinary 3D food stops. The döner keeps turning after a tap, while only food rises above the fixed griddle.

The 15 living rooms and their destination links remain available. The bazaar’s market painting represents the produce market adjoining the covered shopping arcade. The country navigation still reads **Turkey · Türkiye**. The arrival camera frames the town; the country selector frames the wider Turkish landscape.

Static architectural detail is merged by material within each component to limit draw calls. People, water streams and food retain separate animation transforms. This does not introduce a new rendering engine or a new room format.

The subsequent density pass follows the supplied hillside bazaar reference. Homes now gather into staggered blocks around the mosque, market, coffeehouse hill and hammam. Narrow bay houses, dark timber houses, corner balconies, low stone homes and L-shaped courtyard cottages vary the footprint and roofline. The coffeehouse neighbourhood rises on a solid terrace with stairs. Food buildings also vary between pitched roofs, hipped roofs and planted pergolas. Bending lanes and smaller irregular paving replace the strongest grid lines. Extra stalls, supported mosaic lamps, flowering corners, café nooks and grouped neighbours add activity around the buildings. Walkers have different phases and speeds, while speech continues to share the existing quiet cooldown.

## Places and paintings

The street crowd includes eight resident profiles with different heights, builds, paces and step lengths. Children take quicker, shorter steps; elders move more slowly with a slight forward lean. Some residents carry a basket, jug or cloth bundle in one hand. Waistcoats, open coats, entari-inspired layers, shawls, loose trousers, sashes, wraps, scarves and caps vary the silhouette. These are stylized Ottoman and Anatolian influences across different periods, not a reconstruction of one ancient era. Garment references include the [Met's eighteenth-century entari](https://www.metmuseum.org/art/collection/search/451160) and [LACMA's nineteenth-century üçetek entari](https://collections.lacma.org/object/254874).

Turkish street walkers take steps in proportion to distance travelled. Each route includes a real pause and a gradual turn. Market shoppers use the same movement observer, so they stop stepping while browsing. The supporting shoe stays on the walking surface; carried goods remain attached to a hand. Market vendors and square neighbours share the traditional clothing palette.

| Area | Rooms |
|---|---|
| Istanbul | Simit cart, waterfront tea garden, coffeehouse, market, fish quay, charcoal kitchen, breakfast house |
| Aegean | Olive grove, dolma kitchen, meze table |
| Anatolia | Baklava workshop, pide oven, village bread courtyard, family supper |
| Black Sea | Tea terraces |

Each of the 15 rooms uses its own wide and portrait composition. Its three or four touch points produce local effects or open short discoveries. Optional story cards connect related destinations. The charcoal kitchen links to the existing Chicken Kebab recipe; rooms without a matching cookbook recipe do not present an unrelated dish as their own.

Six additional destinations stay in 3D and open cards: the pottery workshop, coppersmith, lane fountain, neighbourhood cat, hammam and citrus orchard. The story cards have three paragraphs of cultural context, with primary-source links for historical claims.

The redesigned town adds six further card destinations: the mosque skyline, Ottoman house, waterfront, Cappadocia, döner stand and gözleme griddle. Sources for the new architectural and landscape cards include [UNESCO’s Historic Areas of Istanbul](https://whc.unesco.org/en/list/356/), [City of Safranbolu](https://whc.unesco.org/en/list/614/) and [Göreme and Cappadocia](https://whc.unesco.org/en/list/357/).

World activity includes ferries, a two-car tram on a closed curved track, shoppers, cooks, supported diners, tea pickers, cats, gulls and slow balloons over fairy chimneys. Background speech uses the existing shared cooldown and single-speaker rule.

## Supplied assets

The source folder is `Downloads/additional game asset/turkey`. Its current contents provide 57 distinct images: 15 wide/portrait room pairs and 27 food/effect illustrations. All were imported and the originals preserved. Room JPEGs keep their native 1672 x 941 and 941 x 1672 dimensions; food WebPs keep 1254 x 1254 dimensions. Complete paintings are not overlaid with duplicate people or furniture. White-background food illustrations appear in detail cards.

`public/scenes/turkey-assets.json` records the exact source filename, SHA-256, output path and dimensions. `scripts/scenes/import-turkey.py` reproduces the conversion with Python and Pillow. Source filenames were matched by inspecting the images: for example, `coffee kettle.png` depicts a caydanlik, `baklava.png` depicts savoury pastry, and the extensionless `tea` and `mezze` files are portrait rooms. Some imported food/effect illustrations remain available for future room details.

## Checks

For the September 13 town redesign, TypeScript, the Pages build, Turkey's 240-second motion and route simulation, prop supports and village speech checks passed. Browser checks covered the arrival and country views, fountain and hammam cards, bazaar entry and its market discovery, and the hammam's link to the living tea garden. At 390 x 844, the hammam card scrolled, the tea interaction responded, and the country overview fit both coasts. The density pass adds checks for different house forms and stationary neighbours' clearance from buildings, and rechecks the market, arrival view and residential terraces visually. This was an inline review and viewport emulation, not an independent review or physical-phone test. The broader room and image checks below record the earlier asset integration.

- `node scripts/tests/turkey-world.mjs`: all 15 room registrations, all 57 assets, all destination links, 56 road segments and road-edge water clearance, 55 walkers, 26 supported diners, grounded market vendors, tram clearance against scenery and pedestrians, food settling, visible balloon travel and ferry bounds across 240 simulated seconds, including tap reactions.
- The crowd regression reproduces the former marching-in-place bug. It also checks that Turkish walkers both travel and pause, all three market shoppers stop stepping while browsing, and animated shoe geometry keeps ground contact throughout the simulation. Tram clearance includes a wider envelope for the new clothing and carried objects.
- The crowd pass was inspected in the running browser at arrival and closer street views, with no new console errors. Its wider walking envelope caught a neighbour too close to the Anatolian lane; that neighbour now stands farther back from passing residents.
- Existing room-controls, room-sound, village-speech and prop-supports scripts pass.
- TypeScript and the Pages build pass. Existing Vite configuration and large-bundle warnings remain.
- In-app browser: all 46 touch controls exercised at 1440 x 900 and 390 x 844. Phone discovery panels remained within the viewport. All 30 compositions were inspected separately. The corrected soup, bulgur and yogurt anchors were also checked in the running room at both aspect ratios. Unsupported mantı, ayran and börek identifications were replaced with details visible in their paintings.
- Main application: place entry, story, linked destination, Chicken Kebab preview and full recipe, and return from the room were exercised. No browser errors were found in the final checks.
- Every imported image decodes at the expected native dimensions; all 57 source hashes still match the import manifest.

The route tests use actual generated mesh bounds at body height. They complement visual inspection; they are not a general-purpose physics simulation or a guarantee against every possible rendering artifact. Desktop and phone viewport checks do not replace testing on physical mobile devices.

## Cultural references

- [UNESCO: Turkish coffee culture and tradition](https://ich.unesco.org/en/RL/turkish-coffee-culture-and-tradition-00645)
- [UNESCO: Culture of cay](https://ich.unesco.org/en/RL/culture-of-ay-tea-a-symbol-of-identity-hospitality-and-social-interaction-01685)
- [GoTurkiye: Turkish breakfast](https://gastronomy.goturkiye.com/turkish-breakfast)
- [GoTurkiye gastronomy guide](https://cdn.goturkiye.com/musavirlik/be/gastronomi260722.pdf)

The room text describes common practices and allows for regional and household variation. Earlier non-Turkish text was outside this content review.

## Landscape reference and limits

The wet, wooded Black Sea tea slopes contrast with dry inland grain country and cultivated Aegean/Mediterranean foothills. These are deliberately compressed regions, not measured land-cover ratios or a scale geographic map. The sea area was reduced after the first expansion; the southern Turkey edge now has an orchard, vegetable beds, craft rooms, a hammam and village terraces instead of a repeated mountain wall.

- [Turkish State Meteorological Service: Climate of Turkey](https://www.mgm.gov.tr/FILES/genel/makale/31_climateofturkey.pdf)
- [UNESCO: shared flatbread-making heritage](https://ich.unesco.org/en/RL/flatbread-making-and-sharing-culture-lavash-katyrma-jupka-yufka-01181)
- [UNESCO: traditional olive cultivation](https://ich.unesco.org/en/USL/traditional-knowledge-methods-and-practices-concerning-olive-cultivation-01983)
- [Rize Governorate: tea history](https://rize.gov.tr/rize-cayi)
- [Avanos Governorate: pottery workshops](https://www.avanos.gov.tr/canak-comlek-atolyeleri)
- [GoTürkiye: hammam culture](https://goturkiye.com/wellness/turkish-hamam)

Istanbul’s tram loop is an illustrative route for this food world, not a reconstruction of a real transport line.

Final continuity check also validates the rendered road endpoints (including diagonals), not only route data. The river uses an eastward estuary blend, matching the sea material exactly at and beyond the coast.

## Historical stories and quiet discovery

The next September 13 pass adds dated historical context to all 15 living-room stories and six landmark cards. Dates distinguish a surviving record, an institution’s founding and a modern heritage inscription from an invention date. Examples include the 1593 Üsküdar simit record, Peçevî’s account of coffeehouses in 1554, the bazaar’s 1461 beginnings, the 1473 palace baklava record, the 1844 cookbook and Rize’s 1924 law and 1947 factory. Archaeological grain evidence is explicitly distinct from the origin of a modern recipe. Each story includes sources in its expandable reading section.

Ambient effects now follow separately inspected wide and portrait paintings. Water glints remain within visible water, leaves drift near foliage and open windows, flour stays around work boards, coffeehouse rain stays on window panes, and soft mist moves over distant tea hills. These use bounded canvas particles and clips, with the original paintings unchanged. The portrait effects follow the same image expansion used for portrait tablets. Generic screen-wide falling leaves and flakes were removed from Turkey; existing steam, fire and tap reactions remain.

Continuous stair meshes replace overlapping boxes, including the tea-hill flight. The market has one arch per entrance bay and no duplicate structural shell. A geometric regression checks actual exposed triangles for overlapping coplanar faces. The citrus orchard now has twelve orange and lemon trees with fruit on the canopy surface, plus separate harvest baskets. Its neighbouring wheat patch was removed; the two smaller inland plots now have grain heads and leaves. The döner stand replaces a decorative house facing the bath square, with an open foreground. Nuts and dried fruit have their own market card. Small steady ivory-and-brass diamond cues identify explorable buildings; decorative houses have no cue.

For this pass, the Turkey geometry and 240-second motion simulation, prop supports, room controls, room sound, village speech, TypeScript and the Pages build passed. Animation tests cover both paintings and portrait-tablet expansion, clipping, finite coordinates and movement over time. The in-app browser was used to inspect the orchard, döner sightline, stairs and arches, and to check room effects and story navigation. The final pass used targeted manual review because the working tree already contained unrelated changes; file-level automatic simplification was skipped to avoid rewriting that work. Existing large-bundle and Vite configuration warnings remain.

## Automatic room movement and phone zoom

The follow-up animation pass adds continuous movement to all fifteen Turkish rooms. Lamps shimmer locally, window rain descends, leaves fall, flour drifts and broader banks of mist cross the distant tea hills. Water stays still wherever boats, people, posts or land prevent a clean isolated reflection. The phone-only painted syrup and olive-oil streams receive short internal highlights instead of replacement liquid lines. People and architecture remain fixed. The shared painting engine now opens with established steam and animates lamp and fire intensity automatically, including in the Chinese rooms. Effects follow the SVG's actual aspect-preserving crop, including wider tablets.

Phone Middle East views use China's maximum camera distance of 90. Desktop stops at the composed full-region overview of 215 instead of allowing the diorama to shrink into a small postcard. The same bounds apply to manual zoom, country-selector flights and viewport rotation.

`node scripts/tests/scene-ambience.mjs` checks immediate steam without a click, fresh steam coordinates after rotation, and automatic lamps and fire. `scripts/tests/ambient-motion.html` checks the real browser canvas above the painting and compares its pixels composited over the actual JPEG, rather than counting draw calls alone. All fifteen rooms passed at 1280 x 720 and 390 x 844 without room interactions. The shared room controls, Turkey world simulation and TypeScript checks also pass. These are emulated viewport checks, not physical-phone measurements. This fix received targeted manual and Astra read-only review; automatic simplification was skipped because several fix-owned files already contained user work.

## Natural motion and more countryside

The next refinement removes broad shifted JPEG foliage patches: moving a large second copy over the painting created blurry double edges. Falling leaves use painted cutouts, olive leaves use a narrow silver-green silhouette, and occasional small birds cross suitable sky openings. A later quality pass removes abstract canvas food actions from all fifteen Turkish paintings. Finished paintings now use only natural emitted effects or a tightly cropped, top-anchored source detail. The pictured hanging chilli braids in the market, kebab, pide, dolma, meze and supper rooms move a few pixels with the wind in both compositions. In the market, the mask is restricted to the isolated left-edge braid so the vendor's red cap and head remain still. Generic sea strokes were removed because rectangular water regions also contained faces, boats, posts and land. Only the portrait composition gives the two real olive-oil streams short internal highlights; the wide painting has no visible oil outlet. No clicks are needed for these effects.

Turkey's 3D props now respond according to their work. Olive and citrus trees shake and release fruit; tea bushes sway and shed three young leaves. One simit rises and tips, a tea glass lifts after the kettle pours, one coffee cup lifts after its pour, one fish flips, and two charcoal skewers lift and turn. Three baklava pieces rise in sequence, a pide loaf hops above its fixed paddle, a yufka sheet lifts and turns, and three dolma rolls hop while the pot and board stay fixed. Breakfast, meze and supper lift one modeled food portion while their shared dishes remain grounded. Three market vegetables hop above a stationary basket before the vendor responds. Reactions remain visible through the 1.6-second camera approach, speech follows the physical beat, and repeated taps do not accumulate geometry.

Fifteen decorative houses were removed from Turkey's outer neighbourhoods. Their space now includes low olive terraces, kitchen-garden beds, dry orchards, limestone outcrops, vines and a threshing floor. Broadleaf woodland joins the Black Sea conifers, while taller, uneven Cappadocian formations give the balloon valley a clearer silhouette. The busy bazaar, waterfront centre, room destinations, connected roads and coastline remain.

Regression checks cover fixed dolma cookware, falling harvest fruit, repeated taps, tea foliage, China diamond click bounds, room-effect size and travel, and the 240-second Turkey route/support simulation. The real browser checks include idle paintings in desktop and phone layouts, all 15 rooms at 390 x 844, the orchard diamond's click/harvest response, China's pepper-tree marker, and the overall Turkey landscape. Pixel differences alone are not treated as proof that an effect looks natural.

### Current room-animation inventory

| Room | Living painting | 3D stand response |
| --- | --- | --- |
| Simit ferry | Gulls, leaves and samovar steam; the crowded water stays still | One simit rises, moves toward the visitor and tips before the seller follows |
| Tea garden | Birds, dappled light, leaves and tray steam; boats and water stay still | Kettle tips, a connected tea stream fills one glass, and the glass lifts |
| Coffeehouse | Rain on the measured glass: thin streaks of varying length, speed and opacity, and a few beads that run down the pane leaving a trail and swallowing the drop below (rebuilt 2026-09-17); warm light and cezve steam continue | Cezve tips, a connected coffee stream reaches one grounded cup, and its coffee surface rises visibly |
| Market | One isolated chilli braid sways; leaves and a broad sun ray move | Three vegetables hop above a grounded basket, then one vendor responds |
| Fish quay | Grill steam, flame and a compact light pulse; the crowded quay water stays still | One fish flips above the grill and the cook follows |
| Charcoal counter | One chilli braid sways, flour or spice dust lifts, grill heat breathes | Grounded skewers turn and the cook follows |
| Baklava workshop | Doorway sun ray, pastry sheen, flour and distant birds; phone adds one short highlight inside the real syrup drip | Three adjacent pieces lift in sequence while syrup and pistachio reach the fixed tray |
| Pide oven | One chilli braid sways, flour lifts, oven flame and restrained heat smoke breathe | One loaf puffs and hops above a grounded paddle |
| Yufka courtyard | Local flour, leaves, oven flame and restrained smoke | One broad sheet rises, turns and settles before the rolling pin follows |
| Dolma kitchen | One chilli braid sways, leaves move and pot steam rises | Three rolls hop and turn; pot and board stay fixed |
| Breakfast house | Sun ray, leaves and tea steam; no replacement honey ribbon | A connected pour reaches one dish while a modeled food portion lifts; the table stays fixed |
| Meze table | One chilli braid sways, leaves and local lamps shimmer; the small boat-filled water strip stays still | A connected pour reaches one plate while a modeled portion lifts; other dishes remain fixed |
| Olive grove | Olive leaves and birds; phone adds short highlights inside two real oil streams | Branches shake and actual olives fall into baskets |
| Tea hills | One broad slow mist bank; the distant sea stays still | Tea rows sway and three young leaves fall toward a basket |
| Family supper | One chilli braid sways, leaves move and warm-dish steam rises | One central food portion rises while the sauce turns; the shared table remains fixed |

## Animation failure analysis and prevention

The failed first pass treated movement as the goal instead of treating the painting and the visible work surface as constraints. Generic canvas shapes invented wakes, shadows, food, and pours that did not exist in the art. Water code scattered eighteen curves inside a rectangle without knowing that faces, boats, posts and banks shared that box. Liquid code interpreted another rectangle as a stream and drew a new line from its top to bottom. Broad colour-selected crops captured unrelated red details, including a market vendor's cap, so a person's head moved with the chillies. The 3D reactions also used tiny displacements that were technically non-zero but unreadable at the arrival camera; the cook's arm then became the strongest response.

The prevention rule is semantic as well as technical. Every wide and portrait effect now needs an authored source and forbidden-overlap review, and every crop mask must be inspected in isolation rather than approved because pixels changed. A rectangular water or liquid box is never enough evidence: water needs isolated authored reflections, and a real painted stream may receive only a short highlight inside its silhouette. Each 3D stand needs a named food, tool, material, or water subject; that subject must move first by a minimum readable amount at the 1.6-second arrival, while its support remains fixed. The regression suite checks each important effect rather than accepting any changed pixels or any changed transform, but browser review at phone and large-screen sizes remains required because automated checks cannot prove natural motion.

## Owner walkthrough, 2026-09-17: sumac explained, and rain that reads as rain

Two of the four items from the morning walkthrough of the live site are Turkey's. The two Spanish ones are in
[the Spain rooms document](spain-rooms.md).

### "Sumac has too few explanations"

**Which two things this is.** The walkthrough note named the Turkish market, and the market's own sumac subject is
the card-only object `spicesMe` ("Sumac and pepper flakes", parented to `bazaarTr`), whose blurb lives in
`turkey-objects.ts`. There is also no sumac *touch* in `tr_market`: its three touches are the season's vegetables,
the olives and the leaves above the stalls, and the only sumac touch in `scenes-turkey.ts` is in the charcoal
counter, `tr_kebab`, whose painting shows a bowl of thin-sliced onion under red powder. Both were rewritten — the
market card because that is what she opened, the kebab touch and its story because that is where the text lived.

**The touch.** It was: *"Thin onion and fresh herbs bring crunch and freshness beside the charcoal grill. Tart sumac
is a familiar seasoning for an onion salad."* Two sentences that name the dish and say nothing about the thing. It
is now:

> Sumac is the dried, ground fruit of *Rhus coriaria*, a shrub of dry Anatolian hills. It is sour, not hot, and goes
> on onion beside the grill, in çoban salad and over lahmacun.

173 characters, inside the room's own band (Turkey's 46 touch texts run from 43 to 175 characters, median 125).

**The story.** A touch is the short discovery; the depth belongs in the story card, which is where the sourced fact
went. `TURKEY_STORY_DEPTH.mangal`'s third paragraph was one sentence about sumac inside a paragraph about the
hearth. It is now two paragraphs of 449 and 446 characters — the file's own paragraphs run 300 to 435 — which makes
`mangal` the one four-paragraph story in the set. They give the botanical identity and family, where the plant grows,
why it tastes sour, the three places on a Turkish table it is used, and the fact that Turkish research on it began
with tanning and dyeing rather than with food.

**The market's own card, `spicesMe`.** It was one sentence about sumac and one about pul biber, 152 characters, in a
file whose other card-only blurbs run 399 to 1,046 characters and whose market and ingredient stalls sit at 646 to
782 in three paragraphs. It is now **781 characters in three paragraphs**, at the top of that stall band and in the
same voice: what sumac is and how it differs from the pul biber beside it, how the stall sells them both, what the
Turkish Food Codex allows to carry the name, that the crop is still gathered from the wild, what sumac does at the
table, and a route on to the charcoal counter. `TURKEY_SOURCES.spicesMe` was added with the same two references as
the kebab room. Checked in the browser at 1280 x 720 and 390 x 844: all three paragraphs and both sources render,
and the card scrolls on the phone the way the other long cards do.

**Sources.** Two were added to `TURKEY_SOURCES.mangal` beside the 1844 cookbook pair and to a new
`TURKEY_SOURCES.spicesMe`, recorded the same way as every other Turkey source:

- [Ministry of Agriculture and Forestry · *Sumak fizibilite raporu ve yatırımcı rehberi*](https://www.tarimorman.gov.tr/BUGEM/Belgeler/YATIRIMCI%20REHBER%C4%B0/SUMAK%20FIZIBILITE%20RAPORU.pdf) — the General Directorate of Plant Production's own guide. Fetched and read on 2026-09-17: it gives the 1–3 m shrub, the family Anacardiaceae and genus *Rhus*, Türkiye as a gene centre for *R. coriaria*, a range from 500 to 2,000 m in almost every region and densest in the west and south, rocky sunlit ground and no growth in shade, and malic acid as the source of the sourness. Every sourced claim in the new paragraphs comes from this document
- [Kew · Plants of the World Online: *Rhus coriaria* L.](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:70477-1) — the accepted name and the native range, Macaronesia and the Mediterranean east to Afghanistan

The facts are split between the two texts rather than repeated: the room's story takes the habitat, the range and the
malic acid, and the market's card takes the Food Codex definition (the ripe fruit dried whole, or ground with at most
six per cent table salt by weight) and the wild harvest, which went from three tonnes reaching trade in 2012 to about
eighteen in 2019. Both come from the same ministry guide, pages 15, 16, 22 and 23.

Checked in the running room at 1280 x 720 and 390 x 844: the discovery panel fits at both sizes and the four
sources are listed under "Sources and further reading" on the story card.

### The rain on the coffeehouse windows

> "The strokes representing rain on the windows are too fake, make them better."

The old `rain` in `scene-ambience.ts` drew six identical two-pixel strokes, all the same length, all at the same
opacity, each falling at almost the same speed and each ending in a hard round cap — six little dashes sliding down
a pane in step. It is replaced by two things that actually happen on a wet window:

- **Rain falling past the glass.** Six to twelve streaks, the count scaled from the pane's own area. Each has its own
  position, length, speed and opacity from a stable per-index scatter, so no two match; each is drawn with a
  gradient along its own axis that fades to nothing at both ends, so nothing begins or ends in a tick; and each
  leans with a shared wind slant that grows with the pane's width. About one in five falls much faster and three to
  four times longer than the rest and swells in and out over its own six-to-twelve-second cycle, so a quick streak
  reads as an occasional gust rather than as one permanently odd drop.
- **Water on the glass itself.** Two to five beads, again scaled from the pane's width. Each gathers on the pane for
  the first third of its cycle, then runs, its fall going as `phase^1.8` so it is slow off the mark and quickest at
  the sill, stretching as it goes. Behind it a wet trail is drawn from where it started to where it is, through a
  gradient that fades out upwards. Lower on the same track a second bead waits; when the runner reaches it the
  waiting bead is gone and the runner is a third larger — the merge that a real pane does constantly.

**The panes were measured on the pixels**, because the clip rectangle is what keeps all of this off the joinery.

| | Box | How it was bounded |
| --- | --- | --- |
| `tr_coffee` wide, signature | [.795, .045, .925, .325] | Centre pane. Left jamb ends x .776; the mullion between the sashes runs x .930–.956; the head rail ends y .028; the near drinker's cap starts y .345 |
| `tr_coffee` portrait, signature | [.802, .158, .843, .294] | Lower-left sash. Glass x .718–.846, transom ends y .152, cap starts y .298, and the potted plant inside the room crosses only left of x .800 (no green pixel between x .800 and .846 from y .155 to .300) |
| `tr_coffee` portrait, ambience | [.721, .050, .843, .134] | Upper-left sash. Glass x .719–.845, transom begins y .140. Was [.715, .05, .846, .132]; the right edge was one pixel from the mullion and is now three |

**The portrait signature was drawing nothing at all.** Its old box, [.903, .164, .991, .306], sat on the lower-right
sash, and that sash is off the screen on a phone: `paintingFrame` fits the portrait painting at 512.2 stage units
while a 390-wide viewport shows 415.9 of them, so the visible slice of this painting is x .094 to .906. Measured
live on 2026-09-17 by reading the room's own effect canvas at 390 x 844: **zero lit pixels right of x .88**. The
room's signature loop has been invisible in portrait since it was written. It now sits on the lower-left sash, which
is inside the slice, and still satisfies the harness rule that the phone box start at or below y .15 and reach y .29.

**Every other room that uses the `rain` kind.** Grepping `PAINTED_SIGNATURES`, `TURKEY_AMBIENCE`, `SPAIN_AMBIENCE`
and `XINJIANG_AMBIENCE` for `kind: 'rain'` returns **two patches, both in `tr_coffee`** — the signature and the
phone-only ambience patch listed above. No China, Xinjiang or Spain room uses it, so no other room could be affected
by the change, and there was none to re-check.

**Checked.** At 1280 x 720 through the world route, eight frames: the streaks are thin, soft-ended and of visibly
different lengths and slants, the beads run down with a fading trail, and between two frames an upper bead reaches
the one below it and the merged bead is larger. Nothing crosses the jamb, the mullion or the head rail. At
390 x 844 the upper-left and lower-left panes both carry rain and the room reads as raining. `scene-ambience.mjs`
still passes, including its budget of fewer than 150 canvas operations per signature draw (the wide rain uses about
103) and its rule that every stroke respects the click-subordinated alpha.

### Not verified

- A physical phone or tablet; both sizes were emulated viewports
- Reduced motion was not re-run. `makeFx` returns before `ambientPainter` under `prefers-reduced-motion: reduce`, so
  the new rain stops with everything else, but that was reasoned from the code, not seen
- The other thirteen Turkish rooms were not re-opened; nothing in them changed

## Owner request, 2026-09-23: re-cluster Turkey

After her first live look at Britain and Italy the owner asked that Turkey also be re-clustered to the China standard: dense clusters, clearly separated by open countryside, one character each, farm decor only in farm clusters, with the cluster-compactness and cluster-separation harness checks added to `scripts/tests/turkey-world.mjs` (see the playbook definition of done, rule added 2026-09-23, and `docs/london-world.md` "Re-cluster pass, 2026-09-23" for the method). **Order: after Thailand and Vietnam are finished and published.** Nothing else in this area changes until then.
