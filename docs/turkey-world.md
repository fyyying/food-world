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
