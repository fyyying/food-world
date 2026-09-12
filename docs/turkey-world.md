# Turkey world

The Middle East world opens in Istanbul. Turkey occupies a connected northern cluster, with Aegean kitchens to the west, Anatolian ovens and family tables to the east, and Black Sea tea terraces in the northeast. The Levant, Arabia and Persia sit 22 world units farther south, beyond a transition of coves, gardens, cultivated foothills and grouped peaks. A single Turkey navigation button frames its connected neighbourhoods. The wooden board has a continuous coastal water surface; the inland river begins at a rocky spring pool and meets the eastern coast. This is a food diorama, not a geographic scale map.

## Places and paintings

| Area | Rooms |
|---|---|
| Istanbul | Simit cart, waterfront tea garden, coffeehouse, market, fish quay, charcoal kitchen, breakfast house |
| Aegean | Olive grove, dolma kitchen, meze table |
| Anatolia | Baklava workshop, pide oven, village bread courtyard, family supper |
| Black Sea | Tea terraces |

Each of the 15 rooms uses its own wide and portrait composition. Its three or four touch points produce local effects or open short discoveries. Optional story cards connect related destinations. The charcoal kitchen links to the existing Chicken Kebab recipe; rooms without a matching cookbook recipe do not present an unrelated dish as their own.

Six additional destinations stay in 3D and open cards: the pottery workshop, coppersmith, lane fountain, neighbourhood cat, hammam and citrus orchard. The story cards have three paragraphs of cultural context, with primary-source links for historical claims.

World activity includes ferries, a two-car tram on a closed curved track, shoppers, cooks, supported diners, tea pickers, cats, gulls and slow balloons over fairy chimneys. Background speech uses the existing shared cooldown and single-speaker rule.

## Supplied assets

The source folder is `Downloads/additional game asset/turkey`. Its current contents provide 57 distinct images: 15 wide/portrait room pairs and 27 food/effect illustrations. All were imported and the originals preserved. Room JPEGs keep their native 1672 x 941 and 941 x 1672 dimensions; food WebPs keep 1254 x 1254 dimensions. Complete paintings are not overlaid with duplicate people or furniture. White-background food illustrations appear in detail cards.

`public/scenes/turkey-assets.json` records the exact source filename, SHA-256, output path and dimensions. `scripts/scenes/import-turkey.py` reproduces the conversion with Python and Pillow. Source filenames were matched by inspecting the images: for example, `coffee kettle.png` depicts a caydanlik, `baklava.png` depicts savoury pastry, and the extensionless `tea` and `mezze` files are portrait rooms. Some imported food/effect illustrations remain available for future room details.

## Checks

- `node scripts/tests/turkey-world.mjs`: all 15 room registrations, all 57 assets, all destination links, 28 full road routes and road-edge water clearance, 38 walkers, 22 supported diners, grounded market vendors, tram clearance against scenery and pedestrians, food settling, visible balloon travel and ferry bounds across 240 simulated seconds, including tap reactions.
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
