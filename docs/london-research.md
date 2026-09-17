# Britain area research (Stage A, Researcher)

Food World, Central Europe world, area id `london`. Delivered 2026-09-17 by the Researcher for the lead, who fixes the object list and reviews the [image brief](london-image-brief.md). The lead's decisions belong in [london-world.md](london-world.md). No pictures existed when this was written.

Rules followed here: every historical claim carries a source URL in section 4. Records are separated from legends, and legends are written as "legend puts". No date is invented. Anything I could not confirm is written "unverified" and repeated in section 5. Where a fact rests only on a secondary source I say so in the line itself.

One thing is stated before anything else, because the owner asked for it and because it decides half the brief. **British food of this period has to be honest.** The picture an image tool will hand back for "British food" is a country-house sideboard, a scrubbed farmhouse table and a plate of roast beef. That is not what most people ate. In 1901 Seebohm Rowntree found 27.84 per cent of the population of York below his poverty line, and the diet behind that number is bread, dripping, tea, potatoes, a little bacon and one piece of meat a week. The rooms below are built on what is documented — the fried fish shop, the pie and mash shop, the coffee stall, the hop-pickers' fire, the smoke pit, the cockle sands — and the roast appears once, on a Sunday, in a public house, because that is where it actually was.

---

## 1. Area brief

### 1.1 What this area is, and what it should be called

The area id is `london` and the `AREAS` entry reads "London", blurb "Big Ben on the Thames, Tower Bridge, the pub carvery, the patisserie, the woods". My recommendation, argued in [london-world.md](london-world.md), is that the id stays `london` and the **name becomes Britain**: London stays the densest cluster and the arrival view, and the country and the coast grow around it, exactly as Spain kept the Plaza Mayor and grew the Albufera, La Mancha, the ría, Andalusia and the Basque coast around it.

The id has to stay `london` for two reasons that are in the code, not in taste. `graph.ts` routes every recipe whose cuisine is `British` to `area: "london"`, and the Beef Wellington row carries `place: "roastPub"`. Renaming the id would break both, and the `Area` union is referenced across the world files. A display name is not an id.

Nine places carry rooms. This is a food diorama, not a scale map: the island is compressed, the Bristol Channel puts Somerset and the Gower shore within sight of one another, and Northern Ireland has no cluster of its own but is present through the eel that reaches the London pie shop (section 4.4).

| Region | What it brings to the food |
| --- | --- |
| Westminster and the Thames | The public house and the Sunday joint, the tea shop that let a woman eat alone, the oldest market in London, Big Ben and Tower Bridge |
| The East End and the docks | The fried fish that arrived with Ashkenazi Jewish immigrants, the pie and mash shop with its eel liquor, the coffee stall, the Bengali seamen's kitchens of Shadwell and Limehouse, Billingsgate |
| Kent and the Weald | Hops, oasts, the working holiday that took a quarter of a million Londoners into the gardens each September, the cookhouse fire |
| The Yorkshire Dales and the West Riding | Swaledale sheep and dry stone walls, farmhouse Wensleydale and the first creamery, forced rhubarb grown by candlelight, the mill-town fried fish shop |
| Cornwall | The pasty, the crimp, the engine house and the emigration that carried both round the world |
| Somerset and Devon | Cider, the pound and the horse mill, the bittersweet apple, cider paid as part of a labourer's wage |
| The Gower and Swansea | The cockle women of Penclawdd, their donkeys, laverbread and the Swansea market stalls |
| The east coast herring ports | The autumn herring fleet, the Scottish gutting crews who followed it from Shetland to Yarmouth, the record year of 1913 |
| Scotland: Angus, Speyside, the firths | The smoke pit of Auchmithie and Arbroath, Findon haddock, the malt distillery and its pagoda vent, oats, the Forth Bridge |

### 1.2 Landscape, climate, waterways, settlement

**Westminster and the Thames.** A tidal river in a shallow clay basin, embanked in stone between 1864 and 1874, bridged at Westminster and, from 1894, at the Pool. The city is nucleated and continuous: brick terraces of London stock, stucco along the great streets, Portland stone on the public buildings, a dark slate or pantile roof and a forest of chimney pots. Weather is grey, wet and smoky; a coal fire in every room is what makes the light in every interior.

**The East End and the docks.** Flat ground east of the City, cut by the enclosed docks and the Lea. Streets of two-storey brick, courts and alleys behind them, warehouses to the waterline, masts and steam funnels above the roofs. The estuary widens into marsh and mudflat; the river is brown, not blue, and it carries traffic at every hour.

**Kent and the Weald.** Low greensand ridges and a clay weald, orchards and hop gardens on the better ground, hedged fields, oast houses with white cowls that turn to the wind. Warm and dry by British standards. Settlement is dispersed farms with a village and a church on the ridge.

**The Yorkshire Dales.** Limestone valleys with flat green pasture on the bottom, drystone walls climbing the fell to the moor edge, field barns standing alone in the meadows, gritstone villages. Cold, wet, late springs. South-east of them the West Riding turns to coal, mill chimneys, canal and the nine square miles of forcing sheds between Wakefield, Morley and Rothwell.

**Cornwall.** A granite spine to a rough coast, cliff, tin ground, small harbours in coves. Engine houses stand on the skyline, each with its chimney and its bob wall, roofless by 1900 in many cases. Mild, wet, salt wind. Settlement is small towns and scattered miners' cottages with a patch of ground.

**Somerset and Devon.** Red soil, deep lanes, hedgebank orchards of standard trees with cattle beneath them, a cider house or a pound on every farm. Wet winters, soft summers. Villages are stone and cob under thatch or pantile.

**The Gower and Swansea Bay.** A limestone peninsula with a north shore of cockle sand — the Loughor estuary — that goes out for a mile at low water. Behind it the copper smoke of Swansea. The sands are worked by women on foot and by donkey, not by boat.

**The herring coast.** Sand and shingle from the Firth of Forth to Yarmouth, harbours cut into it, a beach of drift-net boats in autumn. The fleet follows the shoal south from May to December, and the trade follows the fleet.

**Scotland: Angus, Speyside and the firths.** Red sandstone cliffs at Auchmithie and Arbroath with a shelf of fisher cottages above the water; inland, the Spey valley with barley on the haughs, peat on the hill, burn water running clean and cold past the distilleries; the Firth of Forth crossed since 1890 by a steel cantilever.

### 1.3 Architecture, per cluster

| Region | Walls | Roof | Trim and street furniture | Community space |
| --- | --- | --- | --- | --- |
| Westminster and the river | London stock brick, stucco on the great streets, Portland and Bath stone on public buildings | Welsh slate at a shallow pitch; leaded flats; clay chimney pots in ranks | Cast-iron lamp standards, area railings, painted shopfronts with a fascia and a hanging bracket, glazed tile stall risers | The public house on the corner, the market under its iron roof, the church steps |
| The East End and the docks | Two-storey yellow stock brick, soot-blackened; warehouses of brick with iron shutters and wall cranes | Slate; warehouse roofs of slate and glass | Cobbled setts, bollards, a horse trough, gas standards, painted tiled shopfronts with a mosaic threshold | The street itself; the stall, the coffee stall, the boarding-house front room |
| Kent and the Weald | Red brick with tile-hung upper storeys, weatherboarding painted white or black, ragstone on older walls | Kentish peg tile with half-hipped ends; oast roundels in brick with a conical tiled roof and a white timber cowl | Weatherboarded barns, hop poles and strings, corrugated iron hopper huts, a brick fire-place in the open | The hop garden and the cookhouse fire; the village green and the inn |
| The Dales and the West Riding | Coursed limestone and gritstone, laid dry in the walls and lime-mortared in the buildings | Stone flag slates, heavy and graded, on a steep pitch | Stone gate stoops, water troughs, mullioned windows, a stone porch; in the West Riding, forcing sheds of brick with low doors | The field barn and the fold; the chapel; the mill-town street corner |
| Cornwall | Granite rubble and killas, some lime-washed; engine houses of dressed granite quoins with a brick chimney | Scantle slate, small and steeply laid, wet-looking | Slate hanging on windward walls, a granite trough, a bal-maiden's shelter, a bake-oven built into the wall | The bakehouse, the chapel, the quay |
| Somerset and Devon | Cob on a stone plinth, lime-washed cream or ochre; stone barns | Thatch or double Roman pantile, deep eaves | Red sandstone, a pound house with a stone circular trough, a beam press, a cider cellar door | The pound house at the making, the orchard at wassail, the inn |
| The Gower and Swansea | Limestone rubble, lime-washed; the market a cast-iron and glass hall | Welsh slate | Gate piers, a whitewashed wall against the sea wind, hurdles and riddles, panniers and sacks | The sands at low water; the market stall row |
| The herring ports and Scottish coast | Red sandstone or harled rubble; net lofts and curing yards of timber and stone | Pantile in the east, slate in the west | Farlanes (gutting troughs) on the quay, barrel stacks, capstans, drying rails for nets | The quay at the landing; the curing yard |
| Speyside | Harled and lime-washed rubble with dressed margins; the kiln a square block | Slate, with the Doig ventilator: a pyramidal kiln roof rising to a small louvred pagoda | Warehouse slit vents, an iron water wheel, a peat stack, a wooden wash-back | The still house, the malting floor, the dram at the end of the shift |

**Palette proposal (12 named colours).** Hex values are a design proposal, not a sourced claim.

| Name | Hex | Role | Where |
| --- | --- | --- | --- |
| `londonStock` | `#B9A183` | wall | London stock brick, warehouse walls, terrace fronts |
| `portlandStone` | `#E4DCCA` | wall | Portland and Bath stone, Westminster, market halls, lime wash on a dairy |
| `millstoneGrit` | `#6E675C` | wall | Pennine gritstone, dales drystone walls, mill-town street |
| `moorGranite` | `#9B9691` | wall | Cornish and Aberdeenshire granite, harbour walls, engine-house quoins |
| `slateNorth` | `#49515A` | roof | Welsh and Cornish slate, Scottish roofs, wet cobbles |
| `kentPeg` | `#A85B34` | roof | Kentish peg tile, oast roundel brick, chimney pots, pantiles on the east coast |
| `pubGreen` | `#1E3A28` | trim | Public-house joinery, shopfront paint, cart bodies, hop bine in shade |
| `oxbloodTile` | `#7B2E2B` | trim | Glazed brick and tiled dado in the pub, the pie shop and the fried fish shop |
| `postRed` | `#B22C24` | trim | Pillar box, omnibus, mail cart, a hop-picker's neckerchief |
| `oakSmoke` | `#4A3526` | trim | Oak beams, bar counters, casks, the smoke pit, the beam press |
| `hopGreen` | `#7E8A4E` | ground | Hop bine, leek, wet pasture, orchard grass |
| `northSea` | `#3E5A63` | water | The Channel, the North Sea and the firth. The Thames and the Loughor estuary use the same colour pulled toward brown, about `#6A6046` |

### 1.4 Food culture, ingredients, everyday activities — honestly

**What most people actually ate.** Seebohm Rowntree surveyed every working-class household in York in 1899 and published *Poverty, A Study of Town Life* in 1901; his investigators covered 11,560 families, 46,754 people, and he found 27.84 per cent living below a line he built from the minimum cost of fuel, rent, clothing and food. Charles Booth's London survey, published between 1889 and 1903, reached a comparable figure for the capital. The diet behind those numbers was bread with dripping or margarine, tea with sugar and little milk, potatoes, a little bacon, and meat once a week. The man of the house got the meat first because he did the paid work. Fresh milk, fresh fruit and green vegetables were occasional. This is the baseline. A room that shows plenty must earn it — a Sunday, a fair, a feast, a trade that is itself the plenty, like the market or the smoke pit.

**What changed in this band, and why it matters to the rooms.** Three things arrived almost together and they are the reason these particular rooms exist at all.

- *Cheap fish, cheap fat, cheap potatoes.* Steam trawling and the railway put fish in inland towns; imported cottonseed and beef dripping made frying cheap. Fried fish, sold cold by Jewish street sellers in London from the 1830s, met the chipped potato somewhere around 1860 and the fried fish shop was the result. There were something like 25,000 of them in Britain by 1910.
- *Cheap imported meat and wheat.* The `Strathleven` landed the first cargo of frozen Australian beef and mutton in London on 2 February 1880, and the `Dunedin` brought New Zealand sheep in 1882. With American wheat and roller-milled white flour, the price of a roast and a loaf fell within reach of more households, which is what turned the Sunday joint from an aspiration into a ritual.
- *Places to eat that were not a pub.* The Aerated Bread Company let its London Bridge manageress serve tea in 1864, J. Lyons opened at 213 Piccadilly in September 1894, and Catherine Cranston opened the Willow Tea Rooms in Sauchiehall Street in October 1903. These were among the few public rooms where a respectable woman could eat alone.

**The staples, by region.** Wheat bread everywhere, oatmeal in Scotland and the north, potatoes everywhere and as a meal in Ireland and the mill towns; bacon and pork fat as the everyday meat, mutton and beef on a Sunday; herring salted, smoked and fresh, and haddock smoked; cheese as a working man's dinner — Cheddar, Cheshire, Wensleydale, Caerphilly; butter, dripping and lard; tea, beer and cider; onions, cabbage, swede, carrot, leek; rhubarb, apples, plums and soft fruit in season; pepper, mustard, malt vinegar, salt, and — in the East End — the whole spice box carried ashore by seamen from Sylhet and Chittagong.

**Everyday activities to paint.** Shaking a wire basket of chips clear of the fat; ladling green liquor over a pie; cutting cooked eel into rings; pulling a hop bine down off its string and stripping the cones into a bin; turning malt on the floor with a wooden shiel; tying haddock in pairs over a speet and dropping them into a whisky-barrel pit; crimping a pasty along its edge with the thumb; riddling cockles on the open sand and loading panniers; gutting herring into a farlane at one fish every few seconds; drawing a pint from a beer engine; carrying a joint to the baker's oven on a Sunday morning; pulling forced rhubarb by candlelight; pressing curd in a cheese press and catching the whey.

### 1.5 Clothing and period

**Proposed period band: about 1880 to 1914.** One recorded band, everyday working clothes, no costume, no pageantry, nothing modern.

Reasons. Every room in the list is anchored inside the band by a record rather than by a mood: the fried fish trade multiplies through it and stands near 25,000 shops by 1910; M. Manze's opens at 87 Tower Bridge Road in 1902; Lyons opens in 1894 and the Willow Tea Rooms in 1903; Charles Doig sketches the first pagoda ventilator at Dailuaine on 3 May 1889; Edward Chapman opens the Hawes creamery in 1897; Yorkshire rhubarb forcing begins in 1877 and the Great Northern runs a nightly rhubarb express to London through the season; the hop acreage peaks at 71,789 acres in 1878 and up to a quarter of a million Londoners a year are going to Kent by the early twentieth century; the herring year of 1913 is the record; the Forth Bridge opens on 4 March 1890 and Tower Bridge in 1894. UNESCO's own dating of the Cornwall and West Devon mining landscape — "principally from 1700 to 1914" — closes the band at the same place the rest of the evidence does.

The band also matches the documentary record for clothing. This is the first period of British working life that is photographed rather than painted: Frank Meadow Sutcliffe at Whitby, the Johnston studio at Wick, the hop-garden and market photographs in the London Museum collections. A brief written from photographs is a brief that can be checked.

Two conflicts are stated up front and handled in section 3.3.

1. **The curry house is not in the band.** Sake Dean Mahomed's Hindoostane Coffee House opened at 34 George Street in 1810 and failed by 1812; Salut e Hind is reported as opening in Holborn in 1911; the East End's Bengali cafés and lodging houses belong to the 1920s and 1930s, and Veeraswamy opened in Piccadilly in 1926. What existed in Shadwell and Limehouse between 1880 and 1914 was lascar seamen — overwhelmingly Sylheti and Chittagonian — cooking for each other in boarding houses and ships' galleys. That is what the room paints. The named restaurants go in the card as later reported dates.
2. **Three of the five existing London landmarks are out of the band.** The London Eye is from 2000, the Routemaster from 1956, the K6 kiosk from 1935. The pillar box (1852) and the red omnibus livery (the London General Omnibus Company, 1907) are in the band and the objects can be recast onto them. The lead's and the owner's decision is in section 5.

**Eight everyday clothing profiles, as data.** Colours use the palette names above.

| # | Profile | Garments | Colour | Who wears it | Where |
| --- | --- | --- | --- | --- | --- |
| 1 | London street worker | Collarless flannel shirt with no tie, waistcoat, moleskin or corduroy trousers held with a belt or braces, a knotted neckerchief, a cloth cap, hobnailed boots | shirt `portlandStone`, waistcoat `oakSmoke`, neckerchief `postRed` | Porter, coster, carman, cabman, dock labourer, hop-picker's husband | London, the docks, Kent |
| 2 | Counter worker | White shirt with the sleeves rolled and held by armbands, dark waistcoat, a long white apron tied at the waist, a watch chain; a barmaid in a high-necked dark dress with white collar, cuffs and apron | apron `portlandStone`, waistcoat `slateNorth` | Publican, barman, frier, pieman, baker, cheesemonger | Everywhere there is a counter |
| 3 | Waitress and shop girl | Ankle-length plain black or dark dress, a white bibbed pinafore apron, white cuffs, a white cap or cap band, hair pinned up, black buttoned boots | dress `slateNorth`, apron `portlandStone` | Tea-room waitress, market cashier, dairy shop assistant | London, Glasgow, the market |
| 4 | Lascar and ship's cook | Cotton lungi or loose trousers with a European jacket from the ship's slop chest, a knitted cap or a folded cloth cap, a shawl or blanket against the cold, bare feet indoors | jacket `slateNorth`, lungi `kentPeg` check | Sylheti and Chittagonian seamen, ships' cooks, boarding-house keepers | Shadwell, Limehouse, the docks |
| 5 | Fisherman and quay hand | Hand-knitted navy wool gansey with a patterned yoke worked in the family's own design, canvas or serge trousers, an oilskin smock and sou'wester in weather, sea boots or clogs | gansey `northSea` darkened, oilskin `hopGreen` toward ochre | Drift-net crews, quay hands, cockle men, Cornish boatmen | The herring coast, Cornwall, the Gower |
| 6 | Herring lassie and gutting crew | Long dark skirt, a heavy oilskin apron and sleeves over it, a headscarf tied back, fingers bound in strips of cotton cloth against the gutting knife, clogs | apron `hopGreen` toward ochre, scarf `postRed` | The three-woman gutting and packing crews who followed the fleet | Shetland to Yarmouth |
| 7 | Dales and moor farm worker | Tweed or fustian jacket, waistcoat, corduroy trousers tied below the knee with cord, a collarless shirt, a soft felt hat or cloth cap, hobnails; the dairywoman in a print blouse, dark skirt and a coarse sacking apron | tweed `millstoneGrit`, skirt `slateNorth` | Shepherd, dairymaid, cheesemaker, rhubarb grower | The Dales, the West Riding |
| 8 | Cornish and Welsh working woman | Print blouse, wool skirt kilted up over a petticoat, a hessian or sacking apron, a shawl crossed over the chest; in Cornwall the stiffened `gook` bonnet with its long neck curtain, on the Gower a shawl and a flat straw hat, often barefoot on the sands | blouse `portlandStone`, apron `kentPeg`, shawl `oxbloodTile` | Bal maidens, bakehouse women, cockle women, market sellers | Cornwall, the Gower, Swansea |

Children appear in every outdoor room in pinafores and caps, carrying and fetching; the hop gardens were mostly women and children and should read that way.

**Reference collections (named, without inventory numbers — see section 5).** I could not obtain inventory numbers from the British collections in the time available, and I am not going to invent them. Each of these is a real, named, relevant holding that the Room maker and the picture reviewer should check a profile against before generation:

- **The Museum of English Rural Life (MERL), University of Reading** — smocks, farm workers' dress, hop-picking and harvest photography. Profile 7.
- **The London Museum (formerly the Museum of London)** — the Booth-era street and market photography, hop-picking collections, costers' clothing. Profiles 1, 2, 3.
- **The Scottish Fisheries Museum, Anstruther** — herring-industry collections including gutting gear and knitted ganseys. Profiles 5 and 6.
- **St Fagans National Museum of History, Cardiff** — Welsh rural and coastal dress; the cockle women of Penclawdd. Profile 8.
- **The Royal Cornwall Museum, Truro, and the Cornish Mining World Heritage collections** — the bal maiden's `gook` bonnet and mining-community clothing. Profile 8.
- **The Whitby Museum's Frank Meadow Sutcliffe collection** — the best photographic record of British fishing-community working dress inside the band. Profile 5.

Two things to avoid, both of which an image tool will supply unasked: the Pearly King costume, which is a specific London charitable tradition and reads as fancy dress in a food room; and tartan on anybody in the Scottish cluster who is not at a wedding. A Speyside maltman and an Arbroath fishwife wore neither.

### 1.6 What a concept image should show

There is no concept image. This is the composition I propose for one: a single wooden-table diorama seen from a high three-quarter angle, in the flat silver light of a wet island, with six named clusters, one continuous sea wrapping the whole land because Britain is an island, one river reaching that sea, open country between the clusters, and no interface elements anywhere in the art.

Read the table clockwise from the lower right.

1. **Westminster and the River** (centre-east, London). The densest cluster and the visual centre of the table: a tidal river with a stone embankment, a Gothic clock tower behind and smaller than the food, a corner public house of brick with a hanging painted sign and a lamp over the door, a tea shop with a plate-glass front, and a market under a low iron-and-glass roof with produce spilling to the pavement. Paving is wet `slateNorth`, brick is `londonStock`.
2. **The Docks and the East End** (east, downstream). Warehouses to the waterline, a forest of masts and two steam funnels, a bascule bridge with two Gothic towers where the river narrows, a tiled fried fish shop and a tiled pie shop on a narrow street, a coffee stall under a naphtha flare, and a boarding house with a cooking fire in the back room. Brown water, brick, soot, and one gull.
3. **The Weald** (south-east, Kent). Hop gardens in strung rows with the bines climbing to head height and above, three oast roundels with white cowls turned to the wind, an orchard beyond, a line of corrugated hopper huts and an open cookhouse fire with a pot on a chain.
4. **The Dales and the Mill Towns** (north-centre, Yorkshire). Green valley bottom, drystone walls climbing the fell, field barns, a flock of horned sheep, a low stone dairy with a press in the doorway, and to the south-east a run of low brick forcing sheds with their doors shut and a single candle inside, and one mill-town street with a fried fish shop on the corner.
5. **The West Country and the Bristol Channel** (south-west). On the near shore, a granite bakehouse with an oven mouth open to the street, an orchard of standard trees with a round stone pound and a horse walking the stone, and on the skyline one roofless engine house with its chimney. Across a narrow channel, a mile of pale cockle sand at low water with women and donkeys working it and a stall on the shore.
6. **The Firths and the Herring Coast** (north). A red sandstone cliff shelf with a curing yard and a barrel pit sending up smoke; a quay with drift-net boats, barrel stacks and a gutting crew at a farlane; inland a distillery with a water wheel, a peat stack and one pagoda vent; and behind it all a steel cantilever bridge crossing a firth, small and far back.

**Transitions.** Between 1 and 2, terraces turn to warehouses and the river widens and browns. Between 2 and 3, the estuary marsh gives way to hedged orchard and then to hop strings. Between 3 and 4, the weald rises into open sheep country and the walls change from hedge to stone. Between 4 and 5, stone gives way to cob and lime wash and the grass gets wetter and greener. Between 5 and 6, the coast runs north, slate turns to red sandstone and pantile, and the boats get bigger. Between 6 and 1, moor and barley run south into pasture and then into brick.

**Water.** One continuous sea surrounds the land and is square at the table edge, which is this world's convention. The existing Channel water on the Central Europe table becomes the strait between Britain and the continent. One river rises in the western hills, runs east through cluster 1, widens past cluster 2 and reaches the sea with an estuary blend; the tide runs in it. A second, much smaller estuary at cluster 5 is the cockle ground and goes out to sand at low water.

**Landmarks.** A Gothic clock tower behind cluster 1, a bascule bridge at cluster 2, a roofless engine house on the skyline of cluster 5, and a steel cantilever bridge behind cluster 6. Each stays behind the food and smaller than its cluster's table. Nothing stands in water except the bridges, which are built to.

---

## 2. Object list (proposed)

Thirteen objects open rooms, ten ingredient stops have no room, six landmarks have a card and a 3D reaction. Five existing ids are kept and reused; one existing id is proposed for retirement.

Ids were checked against every id in `src/fw/*.ts`:

```
cd /Users/yingyingfu/Projects/fyying/food-tour && grep -rhoE "id: ['\"][a-zA-Z0-9_-]+['\"]" src/fw/*.ts | sed -E "s/id: ['\"]//; s/['\"]//" | sort -u
```

379 ids exist. None of the twenty-three new ids below collides with any of them. Prop names were checked against the keys of `CEUROPE_PROPS` in `props-ceurope.ts`; none collides either.

### 2.1 Objects that open rooms (13)

| id | name | zh (local name) | kind | cluster | prop | scene | purpose | tagline draft |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `roastPub` (existing) | The public house | The Sunday joint | technique | Westminster and the River | `pub` (existing) | `uk_pub` | UK01. Reused: the area's hero room. The one roast of the week, carved at the counter, with a beer engine and a coal fire | One roast a week, and this is where it was carved |
| `teaRoomUk` | The tea room | Afternoon tea | place | Westminster and the River | `teaRoom` | `uk_tearoom` | UK02. The room that let a woman eat in public on her own | A pot, a plate of bread and butter, and a table of her own |
| `boroughUk` | The market | Borough Market | place | Westminster and the River | `boroughMarket` | `uk_market` | UK03. London's oldest food market, under iron, at first light | Under the arches since the parish bought the ground in 1756 |
| `pieMashUk` | The pie and mash shop | Pie, mash and liquor | dish | The Docks and the East End | `pieShop` | `uk_piemash` | UK04. A tiled shop with marble tables, eels in a tray and green parsley liquor | Green liquor over a pie, and the eels it was made from |
| `chippyUk` | The fried fish shop | The chippy | dish | The Dales and the Mill Towns | `chipShop` | `uk_chippy` | UK05. The first cheap hot meal the working week could buy | Fried fish from one trade, chipped potatoes from another |
| `breakfastUk` | The porters' breakfast | The coffee stall | dish | The Docks and the East End | `coffeeStall` | `uk_breakfast` | UK06. A stall under a naphtha flare at four in the morning, feeding the fish market | Bacon, bread and a tin mug, before the market opens |
| `lascarUk` | The seamen's kitchen | লস্কর রান্নাঘর | place | The Docks and the East End | `lascarKitchen` | `uk_lascar` | UK07. Sylheti and Chittagonian seamen cooking for each other in a Shadwell back room | The spice box came ashore before the restaurant did |
| `hopKitchenUk` | The hop-pickers' cookhouse | Hopping | place | The Weald | `hopCookhouse` | `uk_hopkitchen` | UK08. A quarter of a million Londoners' working holiday, and the fire they cooked it on | A pot on a chain, a hop bine overhead, and Bermondsey in a field |
| `dairyUk` | The dale dairy | Wensleydale | dish | The Dales and the Mill Towns | `daleDairy` | `uk_dairy` | UK09. Farmhouse cheese in a stone dairy, and the press that squeezes the whey out | Curd, cloth, press and patience |
| `pastyUk` | The Cornish bakehouse | Pasti | dish | The West Country and the Bristol Channel | `pastyBakehouse` | `uk_pasty` | UK10. A granite bakehouse, a crimped edge and a dinner a man could carry underground | A whole dinner folded into a crust with a handle |
| `cocklesUk` | The cockle sands | Cocos a bara lawr | place | The West Country and the Bristol Channel | `cockleStall` | `uk_cockles` | UK11. The Penclawdd women, their donkeys, the riddle and the boiling pot | Eight miles to market, on foot, with the tide |
| `smokehouseUk` | The smokehouse | Arbroath smokies | dish | The Firths and the Herring Coast | `smokehouse` | `uk_smokehouse` | UK12. A half-barrel sunk in the ground, a hardwood fire and haddock over a stick | Tied in pairs, hung on a speet, and smoked hot in the ground |
| `distilleryUk` | The distillery | Uisge beatha | place | The Firths and the Herring Coast | `distillery` | `uk_distillery` | UK13. Barley, peat, burn water, copper and the vent that shows where the malt is drying | Barley, water, peat and time, under a pagoda roof |

**Why these thirteen and not the obvious ones.** The obvious British room set is pub, chippy, roast, bakery, tea room, breakfast, market, curry house, harbour, pasty, cheese — which is precisely the example prompt's list in [examples/uk-scene-generation-prompt.txt](examples/uk-scene-generation-prompt.txt), and eight of those eleven are here. The three I have dropped are the **family Sunday dining room** (the roast is stronger in the pub, where the working-class roast actually was, and a domestic dining room duplicates its food), the **allotment** (it is an ingredient stop, not a kitchen, and the leek bed does the same work with a stronger story) and the **historic inn hearth** (a second pub interior). In their place the set gains the **pie and mash shop**, the **coffee stall**, the **hop-pickers' cookhouse**, the **forced-rhubarb country**, the **cockle sands** and the **smoke pit** — six rooms that are documented, regionally specific, visually unlike each other and unlike anything in the eleven areas already built.

### 2.2 Ingredient stops, no room (8 new, plus 2 existing reused)

| id | name | zh (local name) | kind | cluster | prop | purpose | tagline draft |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `pastryCe` (existing) | The pastry board | Butter, flour and suet | ingredient | Westminster and the River | `bakeryCe` (existing) | Reused, re-sited beside the pub and the market. Puff, shortcrust, hot-water crust and suet: the four British doughs that make the Wellington, the raised pie, the pasty and the pudding | Butter folded in, and it rises into a hundred leaves |
| `oystersUk` | The oyster smacks | Natives | ingredient | The Docks and the East End | `oysterSmack` | Whitstable and Colchester natives landed at Billingsgate; the poor man's food that priced itself out of his reach inside one lifetime | Eaten by the barrel, until there were none left to eat |
| `hopsUk` | The hop garden and the oast | Fuggle and Golding | flavour | The Weald | `hopGarden` | Bitterness and keeping power for the beer in the pub; the acreage peak of 1878 and the cowl that turns to the wind | The bitter end of every pint in the world |
| `mushroomsCe` (existing) | The woods | Field and wood | ingredient | The Weald | `mushroomWood` (existing) | Reused, re-sited into the Wealden woods behind the hop gardens. Field mushrooms for the breakfast plate, ceps and chanterelles in autumn, and the duxelles under the Wellington's pastry | Field mushrooms at dawn, ceps after the first rain |
| `sheepUk` | The dale flock | Swaledale | ingredient | The Dales and the Mill Towns | `daleFlock` | Horned hill sheep that know their own ground without a fence; mutton for the Sunday joint and coarse wool for the carpet, not the coat | A breed that keeps to its own fell without a fence |
| `rhubarbUk` | The forcing shed | Yorkshire forced rhubarb | ingredient | The Dales and the Mill Towns | `forcingShed` | Nine square miles of West Riding sheds growing rhubarb in the dark, pulled by candlelight and put on a night train to London | Grown in the dark, pulled by candle, on the train by midnight |
| `orchardUk` | The orchard and the cider pound | Kingston Black | ingredient | The West Country and the Bristol Channel | `ciderOrchard` | Standard trees with cattle beneath, bittersweet apples nobody would eat, a horse walking a stone round a trough, and cider paid as wages | Apples too bitter to eat, and a drink that was half the wage |
| `leeksUk` | The leek bed | Cennin | ingredient | The West Country and the Bristol Channel | `leekBed` | The national emblem of Wales growing in a cottage bed, and the one-pot stew it goes into | A badge on St David's Day and the base of the pot all winter |
| `oatsUk` | The oat field and the meal mill | Coirce | ingredient | The Firths and the Herring Coast | `oatMill` | The grain that grows where wheat will not, the water-driven meal mill, and the girdle it is cooked on | Fitter for horses in England, said the dictionary; Scotland ate it |
| `herringUk` | The herring quay | The silver darlings | ingredient | The Firths and the Herring Coast | `herringQuay` | The autumn fleet, the cran basket, the farlane and the three-woman gutting crew who followed the shoal from Shetland to Yarmouth | One fish gutted every ten seconds, from Lerwick to Lowestoft |

### 2.3 Landmarks with a card and a 3D reaction (6)

| id | name | zh (local name) | kind | cluster | prop | purpose | tagline draft |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `bigBen` (existing) | Big Ben & Westminster | The Palace of Westminster | landmark | Westminster and the River | `bigBen` (existing) | Kept unchanged in period: the tower first chimed in 1859. Reaction: the minute hand steps and the dials warm at dusk | A bell that has kept the city's time since 1859 |
| `towerBridge` (existing) | Tower Bridge | The bascule bridge | landmark | The Docks and the East End | `towerBridge` (existing) | Kept unchanged in period: opened 1894. Reaction: the bascules lift and a steam coaster passes under | Two leaves that lift for the ships, since 1894 |
| `redBus` (existing) | The omnibus and the hansom cab | The General | landmark | Westminster and the River | `omnibus` (new prop, replacing `none`) | Recast into the band: the London General Omnibus Company painted its fleet red in 1907; before it the horse bus and the hansom. Reaction: the pair steps off and the cab's driver touches his hat | Red since 1907, and a horse in front of it until then |
| `phoneBox` (existing) | The pillar box and the lamp | The Penfold | landmark | Westminster and the River | `pillarBox` (new prop, replacing `phoneBox`) | Recast into the band: pillar boxes have collected letters since 1852 and the hexagonal Penfold was the standard design from 1866. Reaction: the door swings open for the collection and the lamplighter's pole lights the mantle | Letters collected from the same red box since 1852 |
| `forthBridge` | The Forth Bridge | Drochaid an Fhoirthe | landmark | The Firths and the Herring Coast | `forthBridge` | New, and the replacement for the London Eye: three steel cantilevers opened 4 March 1890, the world's first major steel structure. Reaction: a train crosses and the painters' cradle swings | Three steel cantilevers, and the longest span in the world for 27 years |
| `engineHouseUk` | The engine house | Wheal | landmark | The West Country and the Bristol Channel | `engineHouse` | New: the roofless granite engine house and its chimney, the shape Cornwall exported to every mining country on earth. Reaction: the beam rocks in the bob wall and steam puffs from the stack | A roofless granite box on the cliff, copied on four continents |

**Proposed for retirement: `londonEye`.** The wheel was built for the millennium in 2000. There is no in-band recast for it, it is the one object in the area that cannot be dressed into the period, and it is the weakest of the five existing landmarks as a food object. `forthBridge` replaces it one for one and moves a landmark out of the London cluster, which is where the crowding will be. The lead and the owner decide; see section 5.

### 2.4 How the existing ids are reused

| id | Now | Change needed |
| --- | --- | --- |
| `roastPub` | Technique object, "The pub carvery", `place: true`, `placeName: "Pub carvery"`, the target of the Beef Wellington recipe | Keeps the id, the `place` flag and the recipe target. **The name changes to "The public house" and the blurb is rewritten.** The word *carvery* is the problem: a self-service carvery counter is a post-war British restaurant format and the name puts a 1960s hotel in an 1890s room. The blurb also currently ends "it is not in any book before 1939, and may be as American as it is British" about the Wellington, which is a fair statement and should stay, moved into the repertoire line and the story depth. This is a name change without an id change, which the playbook flags as the more dangerous case: every agent must be told |
| `pastryCe` | Ingredient stop, "Butter puff pastry", prop `bakeryCe`, a French patisserie with croissants | Keeps the id and the prop. **Name and blurb change** to "The pastry board": puff pastry stays (it is what the Wellington needs and it was in British kitchens), and it gains hot-water crust for the raised pie, shortcrust for the pasty and suet for the pudding, which is what a British pastry board actually held. The `bakeryCe` prop's croissants should become a raised pie, a pasty and a suet basin; that is the Stand maker's work, not a new prop |
| `mushroomsCe` | Ingredient stop, "Mushrooms", "The woods", prop `mushroomWood` | No change to the object except its position, which moves into the Wealden woods, and a `NEXT` to `roastPub` and `breakfastUk`. Its blurb is already about duxelles and British foraging and is the closest of the five to the right subject; it still needs lengthening to the file's new band |
| `bigBen`, `towerBridge` | Landmark cards, in period | No change but position and the blurb length. Both blurbs already mention food — the river terrace tea, Borough Market five minutes upstream — and both should gain a `NEXT` to a real room now that the rooms exist |
| `redBus`, `phoneBox` | Landmark cards outside the band | Recast as above, in section 2.3. `redBus` is currently `hitOnly` with `prop: "none"`, which means it has no 3D reaction at all and does not count toward the area's non-food clickables; giving it a real prop fixes both |
| `londonEye` | Landmark card, 2000 | Proposed for retirement, replaced by `forthBridge` |

### 2.5 Ambient speech lines, per room object

Four to eight lines each. Where the local language is not English it is given first, then English on the same line, in the format the playbook asks for. The London lines are written as they were actually called, not as stage cockney.

`roastPub` (English)
- `"Two of bitter, and is that beef ready?"`
- `"Mind the tray, it's hot all round."`
- `"Cut me the outside slice, love, I like it brown."`
- `"Batter pudding first in this house, gravy on it."`
- `"She's taken hers down the baker's, it'll be back at one."`
- `"Shut that door, you're letting the fire out."`

`teaRoomUk` (English)
- `"A pot for one and bread and butter, please."`
- `"That table by the window's free, miss."`
- `"Hot water when you're ready — it's stewing."`
- `"Two scones, and mind you warm the pot first."`
- `"She comes in on her own every Thursday, and quite right too."`

`boroughUk` (English)
- `"Fine cheese, cut you a wedge, taste it first!"`
- `"Barrow coming through — mind your backs!"`
- `"Sixpence the lot and I'll not do better."`
- `"Fresh in off the night train, that is."`
- `"Weigh it honest, George, she's watching you."`

`pieMashUk` (English)
- `"Two and two, and plenty of liquor."`
- `"Eels are good today — jellied or stewed?"`
- `"Mash goes round the edge, not on top."`
- `"Vinegar's on the table, help yourself."`
- `"Marble stays cold, that's the whole idea."`

`chippyUk` (English, West Riding)
- `"Fish and a penn'orth, salt and vinegar?"`
- `"Give us two minutes, there's a fresh lot going in."`
- `"Scraps in t'bag an' all, go on."`
- `"Newspaper's warm enough to hold, mind."`
- `"Dripping, not oil — that's why it tastes of summat."`

`breakfastUk` (English)
- `"Mug o' tea, two slices, and be quick."`
- `"Market's open in ten minutes, gentlemen."`
- `"Bacon's on, bread's in the fat."`
- `"Stand under the flare, you'll get warm."`
- `"I've been here since three and I'll be gone by nine."`

`lascarUk` (Bengali and English)
- `"ভাত হয়ে গেছে। The rice is done."`
- `"আর একটু মশলা দাও। A little more spice."`
- `"Ship sails Thursday — eat while you can."`
- `"বাড়ির মতো লাগে। It tastes like home."`
- `"Sit, sit. There is enough for another man."`
- `"Who is cooking tomorrow? Not me again."`

`hopKitchenUk` (English, London and Kent)
- `"Bin's near full — call the measurer!"`
- `"Stew's on, and it'll be on till dark."`
- `"Hands like tar by Friday, every year."`
- `"Six weeks of this and we go home brown."`
- `"Keep the little ones off the fire, Ada."`

`dairyUk` (English, Dales)
- `"Curd's ready — it breaks clean."`
- `"Turn her down another half, she's still running."`
- `"Cloth on before the press, not after."`
- `"Whey for the pigs, and a bowl for us."`
- `"Six weeks in t'loft and she'll be right."`

`pastyUk` (Cornish and English)
- `"Crimp un proper or he'll leak."`
- `"Meat this end, apple t'other — that's his dinner and his pudding."`
- `"Oven's hot enough to take the hair off your arm."`
- `"Put his letters on the corner so he knows which is his."`
- `"Yeghes da! Good health!"`

`cocklesUk` (Welsh and English)
- `"Mae'r llanw'n troi. The tide's turning."`
- `"Rhidyll gynta', wedyn sach. Riddle first, then the sack."`
- `"Eight mile to the market, and eight mile back."`
- `"Bara lawr a chocos. Laverbread and cockles."`
- `"Load her even or the donkey'll go lame."`

`smokehouseUk` (Scots and English)
- `"Tie them in pairs, tails thegither."`
- `"Fire's ower fierce — damp it doun."`
- `"Hessian on, and we'll gie them the hour."`
- `"Hot smoke, no cold — that's the difference."`
- `"Eat it wi' your fingers while it's warm."`

`distilleryUk` (Gaelic, Scots and English)
- `"Turn the piece — it's heating in the corner."`
- `"Slàinte mhath! Good health!"`
- `"Peat's in; she'll take the reek noo."`
- `"Watch the middle cut, that's all that matters."`
- `"The angels get their share whatever we do."`

---

## 3. Room list

Thirteen rooms. Coordinates are for the Room maker to measure on the delivered paintings; nothing here fixes a pixel. Sizes are exactly 1672 x 941 wide and 941 x 1672 portrait.

**Sprites.** Six, and every one of them is a thing that is meant to move and therefore must arrive as its own keyed sprite on white, never as a crop out of a finished painting: `ld_motion_pub_sign.png`, `ld_motion_hop_bine.png`, `ld_motion_game_brace.png`, `ld_motion_gull.png`, `ld_motion_smoke_speet.png`, `ld_motion_hanging_lamp.png`. Four rooms take no sprite at all and take their motion from fire, steam, a traced liquid, light through a door or birds in real sky, which the Spain pass proved is the safer choice whenever a hanging object is crossed by a person or cut by the frame.

### 3.1 The thirteen rooms

| Room id | Folder | Opens from | Regional setting | Main food and accurate ingredient list | Three discovery subjects | Signature motion | Supporting cues | Sprites |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `uk_pub` | `uk_pub` | `roastPub` | A corner public house in Westminster: mahogany counter, an etched glass screen, a tiled dado, a coal fire, a hanging bracket over the door outside | A sirloin of beef on the bone, rested and being carved across the grain; batter puddings baked in the dripping in a flat tin, not in cups; roast potatoes cooked in the same dripping; gravy from the pan; boiled cabbage and carrot; horseradish; a plate of bread and cheese with pickled onions for the men not eating the roast; beer drawn from a hand pump into a straight glass. No chips, no printed menu, no modern pint pot | The carved face of the sirloin; the tray of batter puddings; the beer engine handle and the filling glass | The carving knife drawing one slice off the joint, the slice tipping onto the plate | Coal-fire glow at the hearth; steam off the joint and the gravy boat; the pub sign swinging on its bracket through the open door | `ld_motion_pub_sign.png`, `ld_motion_hop_bine.png` |
| `uk_tearoom` | `uk_tearoom` | `teaRoomUk` | A town tea shop, plate glass to the street, bentwood chairs, marble-topped tables, a hanging lamp, rain outside | A china pot with a knitted cosy beside it, a strainer, a hot-water jug, a milk jug and a sugar basin with tongs; thin bread and butter in triangles; plain scones with butter and jam; a Madeira or seed cake cut in slices; a Bath bun. Loose leaf only, no bag, no teapot on a stand of any modern kind | The pot pouring through the strainer; the plate of bread and butter; the cut cake on its stand | Tea falling from the spout through the strainer into the cup, a short fall with a clear lip and a clear landing | Steam off the cups and the hot-water jug; the hanging lamp swaying very slightly; rain running on the plate glass | `ld_motion_hanging_lamp.png` |
| `uk_market` | `uk_market` | `boroughUk` | A market under a low iron-and-glass roof beside a railway viaduct, first light, barrows and porters | Truckles of Cheddar and Cheshire with one cut open showing the cloth-bound rind and the crumb; a side of bacon on a hook; a brace of game hanging; potatoes, swedes, carrots and cabbages in wooden crates; apples in a chip basket; a pyramid of butter on a marble slab with a pair of wooden pats; brown eggs in straw; a cash box and a brass balance with weights | The open truckle of cheese and the cheese wire; the butter on the slab with the pats; the crate of apples | The cheese wire drawing down through the truckle and the wedge falling away | Light shafts through the glass roof with dust in them; steam off a porter's breath and a tea can; the brace of game swinging on its hook | `ld_motion_game_brace.png` |
| `uk_piemash` | `uk_piemash` | `pieMashUk` | A narrow shop off a dock street: white and green wall tiles, mirrors, marble-topped tables with wooden benches, sawdust on the floor | A minced beef pie with a shortcrust base and a puff lid, on a white plate; mashed potato spread in a swipe round one side, not scooped; a ladle of green parsley liquor over both; a tray of stewed eels in their own stock; a bowl of jellied eels set cold with the rings visible in the jelly; a chilli vinegar bottle and a pepper pot. No peas, no gravy, no chips | The pie with its lid broken open; the ladle of green liquor; the jellied eels in the tray | The ladle tipping and the green liquor running over the pie and the mash | Steam off the pie and the eel tray; the shop's gas mantle warming; the street door swinging | none |
| `uk_chippy` | `uk_chippy` | `chippyUk` | A mill-town fried fish shop: a coal-fired range with a brass-hooded frying range, white tiles, a marble counter, a queue to the door on a wet evening | Fillets of haddock and cod in a plain flour-and-water batter, fried in beef dripping, draining on a wire rack over the pan; chipped potatoes cut by hand on a bench chipper and going into a second pan; a salt drum and a malt vinegar bottle with a shaker top; newspaper and greaseproof for wrapping; a bowl of scraps. No mushy peas in a tub of any modern kind, no cardboard box, no fluorescent light | The draining rack of fried fish; the chipper and the raw chips; the paper being folded round a portion | The wire basket of chips lifting clear of the fat and shaking, fat streaming off it back into the pan | Steam and small breaking bubbles at the surface of both pans; firelight from the range door; rain on the shop window and the queue outside | none |
| `uk_breakfast` | `uk_breakfast` | `breakfastUk` | A coffee stall on wheels under a naphtha flare on the cobbles outside the fish market, four in the morning, dark and cold, the market's lit doorway behind | A flat iron griddle with rashers of back bacon curling, a black pudding cut in discs, fried bread going into the fat and a row of eggs; thick slices of bread and butter on a board; a boiler with a brass tap; tin mugs of tea, dark and strong, and a bowl of sugar; a stack of plates; a jar of pickled onions. Not a plated "full English" on a modern café table: this is food handed over a board and eaten standing | The bacon curling on the griddle; the boiler's brass tap filling a mug; the board of bread and butter | A mug filling from the boiler tap, a clear stream from the tap to a clear landing in the mug | Steam off the mugs and the griddle; the naphtha flare's light moving; one gull crossing the dark sky over the market roof | `ld_motion_gull.png` |
| `uk_lascar` | `uk_lascar` | `lascarUk` | The back kitchen of a seamen's boarding house in Shadwell: a range, a scrubbed table, a bench, a low fire, ship's gear in the corner, six men from the same ship | A heavy iron pan of rice; a pot of fish curry with whole green chillies and coriander in it; a stone slab and roller with turmeric, cumin, coriander seed, mustard seed, dried chilli, ginger and garlic; a tin trunk of spices bought ashore; flatbreads on a griddle; a chipped enamel dish of pickle; fish bought that morning at the market a street away. Not a restaurant, not brass and velvet, not a printed menu | The stone slab with the ground spice; the pot of curry; the pan of rice with the lid lifted | The pan tilting and the ground spice going into the hot fat, with the cook's hand following it | Steam off the rice pot and the curry; the fire in the range; the hanging brass lamp swaying on its chain | `ld_motion_hanging_lamp.png` |
| `uk_hopkitchen` | `uk_hopkitchen` | `hopKitchenUk` | An open cookhouse at the edge of a Kentish hop garden in September: a line of corrugated hopper huts, a fire of faggots between two iron uprights, hop strings and bines above and behind, a bin half full of green cones | A big iron pot hanging on a chain over the fire with a stew of neck of mutton, potato, onion, carrot and pearl barley; a kettle beside it; a loaf and a knife on an upturned crate; a basin of picked cones; bacon on a toasting fork; a stone jar of beer; enamel plates. Nothing bought ready-made: this is a town family cooking outdoors for six weeks | The pot over the fire; the bin of green hop cones; the loaf and the knife on the crate | The pot swinging on its chain over the flames while a ladle lifts and pours back | Flame and smoke at the fire, kept low and moving; steam off the pot and the kettle; the hop bine overhead moving in the wind | `ld_motion_hop_bine.png` |
| `uk_dairy` | `uk_dairy` | `dairyUk` | A stone dairy at the end of a Dales farmhouse, a flagged floor, a slate shelf, a door open onto a walled meadow with horned sheep and a field barn beyond | A wooden or tinned tub of milk; curd cut into cubes and draining on a rack; a cloth-lined hoop of curd going into an iron screw press; whey running from the press into a pail; a finished cloth-bound truckle on the slate shelf and one cut open showing a white, close, crumbly paste; a thermometer, a curd knife and a scoop. It is **cold work**: no fire, no steam, nothing boiling in this room | The cut truckle showing the crumb; the curd draining on the rack; the press and the pail | The screw of the press turning down and whey running into the pail in a thin stream | Daylight through the open door falling across the flags; the whey running into the pail; motes in the door light. **No steam anywhere in this room** | none |
| `uk_pasty` | `uk_pasty` | `pastyUk` | A granite bakehouse in a Cornish mining village, an oven mouth open to the room, a scrubbed board, the door open onto a street going down to the sea, an engine house on the skyline | Pasties on a peel and on the board: shortcrust rolled to a circle, filled with skirt of beef cut in pieces, potato and swede sliced not diced, onion, salt and a great deal of pepper, folded and crimped along the **side**, with a pastry initial on one corner. One broken open showing the filling. A bowl of swede, a bowl of potato, a heap of trimmings; a sack of flour; a long-handled peel; baked pasties cooling on a cloth | The crimped edge of one pasty; the broken pasty showing the filling; the open oven mouth with the peel going in | The thumb crimping along the edge of a raw pasty, a small tight working area | The oven mouth's glow and heat shimmer; steam from the broken pasty; light and street noise through the open door | none |
| `uk_cockles` | `uk_cockles` | `cocklesUk` | The cockle sands of a shallow estuary at low water and a stall on the shore behind: a mile of pale wet sand, a channel, women working bent over with scrapes and riddles, donkeys standing with panniers | A riddle of live cockles being shaken clear of sand; sacks and panniers; a fire on the shore under a copper of boiling water; boiled cockles in a wooden tub and measured out by the pint into paper; a black dish of laverbread; a plate of laverbread and cockles fried with bacon and oatmeal; a jug of vinegar; a pepper pot | The riddle of cockles being shaken; the pint measure and the paper; the dish of laverbread | The riddle shaking and the sand falling through it in a fine fall | Steam off the copper on the shore; one gull crossing open sky; shallow water moving in the channel, well away from any person | `ld_motion_gull.png` |
| `uk_smokehouse` | `uk_smokehouse` | `smokehouseUk` | A curing yard on a red sandstone shelf above a small Scottish harbour: a half whisky barrel sunk in the ground with a hardwood fire in it, a frame of wooden speets over it, wet hessian sacks to hand, boats and barrel stacks below | Haddock split, cleaned, dry-salted for a couple of hours and then tied in pairs by the tail; pairs hung over wooden speets across the pit; finished smokies with copper-coloured skin, creamy flesh, opened by hand; a barrel of salt; a tub of brine; a bench of split fish; a rope and a knife. Beside it, for contrast, a pair of cold-smoked kippers on a rail and a pale split haddock in the Findon way | A tied pair of haddock over the speet; an opened smokie showing the flesh; the fire in the sunken barrel | A speet of paired fish being lowered over the pit, with the smoke gusting up as it goes | Smoke rising from the pit and from under the hessian; sea light off the water below; one gull crossing the open sky | `ld_motion_smoke_speet.png`, `ld_motion_gull.png` |
| `uk_distillery` | `uk_distillery` | `distilleryUk` | A Speyside distillery in a hollow by a burn: a malting floor with a wooden shiel, a kiln with a peat fire under it, two copper pot stills with swan necks, a spirit safe, a water wheel and a peat stack outside, a pagoda vent on the kiln roof | Barley steeped and spread on the floor, green with rootlets, being turned by a wooden shiel; peat cut and stacked; the kiln fire; the wash in a wooden washback with a foaming head; two copper pot stills, wash and spirit; the spirit safe with a clear spirit running through glass; a cask being filled through a bung; a dram in a plain glass | The barley on the malting floor and the shiel; the peat fire under the kiln; the spirit safe with spirit running | The spirit running through the glass of the safe, a clear thread with a clear start and a clear landing | Heat shimmer and smoke over the kiln and the pagoda vent; the water wheel turning outside the door; motes in the light from the high window | none |

### 3.2 One-sentence discovery per subject

Sources are given in section 4; only specialist facts carry one.

**uk_pub.** The carved face: the joint is cut across the grain and the outside slice, brown and salt, was the one people asked for. The batter puddings: the first recipe called this a dripping pudding, printed in *The Whole Duty of a Woman* in 1737, and Hannah Glasse gave it the name Yorkshire pudding in *The Art of Cookery Made Plain and Easy* in 1747. The beer engine: the roast was a Sunday thing because it was the one day the fire and the money were both there, and many households had no oven at all and paid the baker to roast it.

**uk_tearoom.** The pot: the Aerated Bread Company's London Bridge manageress began serving tea to customers in 1864, and J. Lyons opened at 213 Piccadilly in September 1894. The bread and butter: these rooms sold no alcohol and were staffed by women, which is what made them respectable for a woman on her own. The cake: Catherine Cranston opened the Willow Tea Rooms in Sauchiehall Street, Glasgow, in October 1903, designed inside and out by Charles Rennie Mackintosh.

**uk_market.** The cheese: a cloth-bound truckle is bandaged in muslin and larded so it can breathe and travel, which is why it keeps its shape and its rind. The butter: it is worked into shape with a pair of ribbed wooden pats and sold by weight off a marble slab, because marble stays cold. The apples: the market has traded here since the parish of St Saviour's was given the right by the Borough Market Act of 1756, and the buildings are largely of 1851.

**uk_piemash.** The pie: the trade's shops began in London in the eighteenth century and the oldest one still open, M. Manze, has been at 87 Tower Bridge Road since 1902. The liquor: it is parsley sauce made with the stock the eels were cooked in, which is where the name comes from and why it is green. The eels: they came up the Thames and, when the Thames ran out, down from the Dutch eel barges at Billingsgate and from Lough Neagh in Ireland, which still sends most of its eels to the London jellied-eel trade.

**uk_chippy.** The fried fish: it came from Ashkenazi Jewish cooking in the East End, where fish was fried in batter to be eaten cold on the Sabbath, and the earliest London shop is attributed to Joseph Malin around 1860. The chips: the northern claim is John Lees, who sold fish and chips from a wooden hut in Mossley market around 1863; the two claims are both traditional and neither has a document behind it. The paper: by 1910 there were about 25,000 fried fish shops in Britain, and the trade fried in beef dripping, which is what gave a northern chip its taste.

**uk_breakfast.** The bacon: Henry Mayhew counted some two hundred coffee stalls in London in *London Labour and the London Poor* in 1851, and they fed the people who worked through the night. The boiler: the stall's light was a naphtha flare, which is also why every photograph of one is a blur. The bread: what became "the full English" was codified for households by Isabella Beeton's *Book of Household Management* in 1861, but at a stall it was bacon, bread, an egg if you could pay for one, and tea.

**uk_lascar.** The spice slab: spices were ground fresh on a stone every day, because nothing else was available and because ground spice does not keep. The curry pot: lascars from Sylhet and Chittagong crewed British steamers in large numbers and settled around Shadwell and Limehouse; their boarding houses and galleys are where Indian food was cooked in London long before there was a restaurant to sell it in. The rice: Sake Dean Mahomed opened the Hindoostane Coffee House at 34 George Street in 1810 and was bankrupt by 1812; Salut e Hind is reported to have opened in Holborn in 1911 and Veeraswamy in Piccadilly in 1926.

**uk_hopkitchen.** The pot: up to a quarter of a million Londoners a year went to the Kent hop gardens in the season, mostly women and children, and it was the only holiday most of them had. The hop bin: the hop acreage of England peaked at 71,789 acres in 1878, about 40,000 of them in Kent, which is why the county has so many oasts. The loaf: pickers were paid by the bushel and lived in corrugated huts, and the same families came back to the same farm for generations.

**uk_dairy.** The cut truckle: Wensleydale was made on the dale's farms for centuries before Edward Chapman opened a creamery in Hawes in 1897 and started buying the farms' milk instead. The curd: the cheese is pressed only lightly and eaten young, which is why it crumbles instead of slicing. The press: the whey is not waste — it went to the pigs, and the farm drank and ate what it could of it first.

**uk_pasty.** The crimp: the crimp is a seam and a handle, and it runs along the side of a Cornish pasty, not over the top. The filling: the recognised filling is beef, potato, swede and onion, seasoned, put in raw so it cooks in its own steam. The oven: the earliest known Cornish pasty recipe is in a 1746 letter held at the Cornwall Record Office, and the name was given Protected Geographical Indication status in 2011.

**uk_cockles.** The riddle: the women of Penclawdd worked the sands on foot and carried the cockles out by donkey, about eight miles each way to Swansea market. The pint: a 1916 report for the South Wales Sea Fisheries Association estimated almost 320 tonnes of cockles a month from the Penclawdd sands, with about fifty women at work on a typical day and about 150 kg on each donkey. The laverbread: laver is a seaweed, boiled for hours to a dark purée, and it is eaten with cockles, bacon and oatmeal, which is the reason the two are always together.

**uk_smokehouse.** The tied pair: the fish are tied in pairs by the tail so they hang over a wooden speet, and the pair is still how they are sold. The opened smokie: this is a hot smoke, short and fierce, so the fish is cooked as well as smoked; a kipper is cold-smoked and still raw. The pit: the smokie is said to come from Auchmithie and to have moved four miles down the coast to Arbroath, and it was given Protected Geographical Indication status in 2004, with a five-mile radius from Arbroath Town House.

**uk_distillery.** The malting floor: the barley is steeped, spread and turned by hand so it germinates evenly and does not overheat. The kiln: Charles Doig drew the first pagoda ventilator for Dailuaine on 3 May 1889, and it is a kiln vent, not an ornament — every one you see is drawing air through drying malt. The spirit safe: distilling was licensed and brought out of the hills by the Excise Act of 1823, and the still-house glass is locked because the excise, not the distiller, owned the key.

### 3.3 The corrections the lead must make to the example prompt

These are corrections to [examples/uk-scene-generation-prompt.txt](examples/uk-scene-generation-prompt.txt), the original UK brief that the whole method was written from. It is an example, not a source, and on the two biggest questions it now contradicts the [art direction](art-direction.md) outright.

**The two contradictions.**

1. **Period.** The example says the world "should feel lived-in, contemporary enough to be recognizable" and lists, under Avoid, "making every scene look Victorian". The art direction now requires the opposite: one recorded period band for the whole area, traditional everyday working clothes, and no mixing of an imagined era with modern clothes. The brief must name the band and forbid contemporary dress, chalkboards, printed menus, laminated signs, electric light, stainless steel and plastic. This is the single largest change and it changes every room.
2. **Sizes.** The example gives no pixel sizes and asks for "the largest native output size". The art direction fixes 1672 x 941 and 941 x 1672 exactly, and anything else is rejected.

**The food and place corrections, room by room.**

3. **The pub.** Remove the chalkboard menu, the crisps and the patterned carpet. Add a beer engine with a hand pump, an etched glass screen, a tiled dado and a coal fire. The roast is carved at the counter, not plated at a table.
4. **The roast.** Remove stuffing and peas from the plate; add horseradish and cabbage. The batter puddings are baked flat in a dripping tin and cut, not risen in individual cups, which is a twentieth-century form.
5. **The fried fish shop.** Remove the takeaway boxes, the bright practical lighting and the tub of mushy peas. Fry in beef dripping, drain on a wire rack, wrap in newspaper over greaseproof, cut the chips on a bench chipper. Say that the batter is flour and water, not beer batter, which is later.
6. **The pie shop.** The example folds pies into a "bakery / pie shop" with scones and fruit pies. Separate them. The pie and mash shop is its own trade with its own architecture — tile, marble, mirrors, sawdust — and its own three items: pie, mash, liquor, with eels stewed and jellied beside them. No gravy, no chips, no peas.
7. **The tea room.** Remove the tiered cake stand, which belongs to the hotel afternoon tea, and the modern teapot. A pot, a strainer, a hot-water jug, bread and butter, scones, a cut cake.
8. **The breakfast café.** Replace the café with a coffee stall. The example's "full English breakfast café" is a mid-twentieth-century form; in this band the same food is sold off a barrow to market workers. Remove baked beans, which are an imported tinned product that only becomes ordinary later; remove hash browns and the fried tomato if the tool offers them.
9. **The market.** Remove the modern street-food stalls the example implies and the chalkboards. A wholesale and retail market of crates, barrows, scales, hanging game and cheese truckles, under iron and glass, at dawn.
10. **The curry house.** Replace it entirely, as argued in section 1.5. A boarding-house back kitchen in Shadwell with six seamen, a stone spice slab, an iron pan and a fire; not a restaurant with flock wallpaper. The dish is a fish curry and rice, because that is what came off the ships and out of the market at the end of the street.
11. **The coastal harbour.** Split it in two. The example's generic "coastal seafood harbour" becomes the Gower cockle sands, which is work on foot at low water, and the Scottish curing yard, which is a fire in a hole in the ground. Neither is a harbour full of lobster pots.
12. **The pasty.** Correct the crimp: along the side, not over the top. Correct the filling: swede and potato sliced, beef skirt in pieces, raw into the pastry. Remove carrot, which is the commonest error in reference images and is specifically excluded by the protected name.
13. **The cheesemaker.** Make it cold. The example's "cheesemaker / farm shop" will be delivered with a steaming vat unless the brief forbids it; this room's liquid is whey running out of a press, and it has no hot process at all.
14. **Regional balance.** The example asks for Scotland, Wales, Northern Ireland and England. This list gives Scotland two rooms and two stops, Wales one room and one stop, England the rest, and Northern Ireland no room — but the Lough Neagh eel is a real, documented supplier of the London jellied-eel trade and carries Ulster into the pie shop's card and story depth. State that openly rather than leaving the gap unexplained.
15. **Haggis, shortbread and Welsh cakes** appear in the example's regional list and in none of my rooms. They belong in the repertoire lists of the distillery, the tea room and the cockle stall, which is exactly what a repertoire is for.
16. **"Do not make all UK food brown and heavy"** is good advice and is answered by the food itself, not by inventing colour: green liquor, green hop cones, purple-red forced rhubarb, the copper of a smoked haddock, cockles and laver, apples, a white crumbling cheese, the yellow of butter and batter.

---

## 4. Story facts and sources

Three to five dated facts per room object, written as records, with local names and two `NEXT` links each. Legends are labelled.

### 4.1 `roastPub` (The public house, English)

- A record from 1737: a recipe for "a dripping pudding" appears in *The Whole Duty of a Woman*, and Hannah Glasse prints it under the name "Yorkshire pudding" in *The Art of Cookery Made Plain and Easy* in 1747. It is batter cooked under the meat in the dripping tin, and it was eaten first, with gravy, to take the edge off appetites before the meat.
- A record of 2 February 1880: the `Strathleven` landed about 40 tons of frozen Australian beef and mutton in London, the first successful cargo of its kind; New Zealand followed with the `Dunedin` in 1882. Meat that had cost 1½ to 2 pence a pound in Australia sold at Smithfield for 4½ to 6 pence. Cheap imported meat is a large part of why a weekly roast came within reach of a working household at all.
- A record of the law behind the room: the Beerhouse Act of 1830 let any ratepayer brew and sell beer on a cheap annual licence, which created the beerhouse beside the older licensed public house; the gin palace of the 1830s, with its gaslight and gilding, is the ancestor of the etched glass and polished mahogany in this room.
- Reported, not verified: that households without an oven took the Sunday joint to the baker's, who roasted it for a penny or two while his own ovens were idle on a Sunday. The practice is widely described and fits the trade, but I found it only in secondary sources; see section 5.
- The Beef Wellington, which is the recipe this object already carries, has no printed record before the twentieth century and the existing card is right to say so. It belongs in the repertoire as what this counter would carve for a dinner, with its own doubt attached, not as the room's hero.
- `NEXT`: `boroughUk`, `hopsUk`

### 4.2 `teaRoomUk` (The tea room, English)

- A record from 1864: the Aerated Bread Company, founded to sell bread raised with carbon dioxide instead of yeast, allowed the manageress of its London Bridge shop to serve tea and food to customers, and the ABC tea shop chain grew from it.
- A record of September 1894: J. Lyons and Company opened its first tea shop at 213 Piccadilly. Lyons sold no alcohol, served consistent food at consistent prices, employed women as waitresses and set aside areas for women. The "Nippy" uniform and name are from 1925 and must not appear in a picture of this band.
- A record of October 1903: Catherine Cranston opened the Willow Tea Rooms at 217 Sauchiehall Street, Glasgow. Charles Rennie Mackintosh designed the building, the interiors, the furniture, the light fittings and the cutlery; it is the only one of her tea rooms he designed entire.
- What the record means for the room: these were among the very few public rooms in which a respectable woman could eat alone without ruining her reputation, and that is the story of the room, not the cake.
- Legend puts the invention of afternoon tea with Anna, seventh Duchess of Bedford, in the 1840s. It is repeated everywhere and I found no contemporary document; write it as a legend or leave it out.
- `NEXT`: `boroughUk`, `roastPub`

### 4.3 `boroughUk` (The market, English)

- A record from 1756: the Borough Market Act abolished the ancient market that had blocked the road at the foot of London Bridge and gave the parish of St Saviour's Southwark the right to hold a market on a new site. Local residents raised £6,000 to buy the ground known as The Triangle, and the Act set up the charitable trust that still runs the market.
- A record from 1851: the buildings on the site today are largely of 1851, to a design by Henry Rose, with further work by Edward Habershon in 1863–4 and a railway viaduct driven through the market itself in 1860.
- A record from 1875: Billingsgate, the fish market a short walk downstream, was rebuilt as an arcaded hall by the City architect Sir Horace Jones; Smithfield, the meat market, had been rebuilt by the same architect in 1868. London's food arrived by river and rail into buildings of iron and glass in one generation.
- What this means for the room: this is a wholesale market working at dawn with barrows and porters, with retail happening round the edges, not a modern weekend food market.
- `NEXT`: `roastPub`, `oystersUk`

### 4.4 `pieMashUk` (Pie, mash and liquor, English)

- A record from 1902: Michele Manze, born in Ravello, took over a shop at 87 Tower Bridge Road — then Bermondsey New Road, because the bridge was new — that had been opened as an eel and pie house by Robert Cooke in 1891. M. Manze is generally called London's oldest surviving pie and mash shop, and by 1930 the family ran fourteen shops.
- A record of the trade: the earliest eel, pie and mash houses opened in London in the eighteenth century, and when the pie shops spread in the nineteenth, jellied and stewed eels were the only other things on the menu.
- A record from 1472: Dutch eel barges were granted the right to sell live eels at Billingsgate, and they kept doing it for centuries; when the Thames eel gave out under pollution the London trade ran on imported eel instead.
- A living continuation: the Lough Neagh eel fishery in County Antrim, given Protected Geographical Indication status in 2011, sends most of its eels to Billingsgate for the jellied-eel trade. Ulster is on this plate.
- The liquor is parsley sauce made with eel stock. That is why it is green and why the name has nothing to do with drink.
- `NEXT`: `oystersUk`, `breakfastUk`

### 4.5 `chippyUk` (The chippy, English)

- Two traditional claims, neither documented: Joseph Malin is said to have opened a fried fish and chip shop in Cleveland Way, Bow, in the East End of London around 1860 — some sources say 1865 — and John Lees is said to have sold fish and chips from a wooden hut in Mossley market, near Oldham, around 1863, later moving to a shop whose window read "This is the first fish and chip shop in the world". Write both as claims.
- A record of the fish's origin: fried fish in batter, eaten cold, came into London with Ashkenazi Jewish immigrants; it was sold by Jewish street sellers long before the chip joined it, and the chipped potato came from the other direction, out of the industrial north.
- A measured figure: there were about 25,000 fried fish shops in Britain by 1910, from almost none fifty years earlier. Steam trawling, ice and the railway put sea fish in inland towns, and cheap dripping made frying possible.
- What that means for the room: this was the first hot cooked meal a working family could buy that was not charity and not a pub, and it is the reason the trade was left off rationing in both wars.
- `NEXT`: `herringUk`, `pieMashUk`

### 4.6 `breakfastUk` (The coffee stall, English)

- A record from 1851: Henry Mayhew's *London Labour and the London Poor* describes the coffee stalls of London, reckoning there were at least two hundred of them, and notes that among all the street drinkables the coffee stall alone sold something like a meal rather than a luxury.
- A record from 1861: Isabella Beeton's *Book of Household Management* sets out the breakfast dishes — broiled rashers, fried ham and eggs, kidneys, fish — that became the template for what is now called the full English. What a stall sold was the cheap end of the same list.
- A record of the customers: Billingsgate opened before dawn and Smithfield earlier still, and the trade that fed the porters, carmen and market men worked to their hours, not to a shop's.
- A measured figure for the diet behind it: Seebohm Rowntree's *Poverty, A Study of Town Life* (1901), based on visits to every working-class household in York in 1899 — 11,560 families, 46,754 people — found 27.84 per cent below his primary-and-secondary poverty line. Bread, dripping and tea were the base of that diet; a hot bacon breakfast at a stall was not the everyday.
- `NEXT`: `oystersUk`, `chippyUk`

### 4.7 `lascarUk` (লস্কর রান্নাঘর, Bengali and English)

- A record from 1810: Sake Dean Mahomed, born in Patna, opened the Hindoostane Coffee House at 34 George Street, London — the first Indian restaurant in the country — serving Indian food and offering hookahs to returned East India Company men. He was bankrupt by 1812.
- A record of the community: lascars, sailors recruited in South Asia for British ships, were a permanent presence in the London docks; the largest group came from Sylhet and Chittagong. In the 1920s and 1930s the settled Bengali community in the East End began opening lodging houses that fed and sheltered newly arrived seamen, and the cafés run by former lascars and ships' cooks grew out of them.
- Reported dates, later than this band: Salut e Hind is reported as the first Indian restaurant to open in Holborn in 1911, followed by the Kohinoor and a curry café in Commercial Street in the 1920s; Edward Palmer opened Veeraswamy in Piccadilly in 1926, the oldest Indian restaurant in Britain still trading.
- What the record means for the room: between 1880 and 1914 there was no East End curry house. There were seamen cooking for each other. The card can carry every date above; the painting must show the kitchen, not the restaurant.
- `NEXT`: `boroughUk`, `pieMashUk`

### 4.8 `hopKitchenUk` (Hopping, English)

- A measured record from 1878: the English hop acreage reached its all-time peak of 71,789 acres, about 40,000 of them in Kent, spread across some three hundred parishes. One estimate puts nearly 7,000 oast houses in Kent at that date — roughly three oasts to every public house.
- A record of the migration: from the late nineteenth century until the 1960s, tens of thousands of Londoners went to Kent for the hop harvest each September; figures of up to 200,000 and an estimate of 250,000 by the early twentieth century are both published. About a third of the seasonal workforce came from the East End, and it was mostly women and children.
- A record of the conditions: pickers lived in hopper huts, in many places single rooms of corrugated iron with a straw-filled mattress, and cooked on open fires outside; the same families returned to the same farm year after year. The medical journals of the period carried repeated appeals for dispensaries and first aid for hop-pickers, which is a measure of how bad it could be.
- The two varieties that matter are Fuggle, raised in the 1860s, and Golding, older; together they define English bitter beer.
- `NEXT`: `hopsUk`, `roastPub`

### 4.9 `dairyUk` (Wensleydale, English)

- A record from 1897: Edward Chapman set up a commercial creamery at Hawes in Wensleydale, buying milk from the dale's farms; premises became available when a woollen mill beside Gayle Beck failed. Before that the cheese was made on the farms by the farmers' wives.
- A record of the earlier tradition: Cistercian monks who settled in Wensleydale in the twelfth century are credited with bringing the cheesemaking technique that the dale's farms carried on. Treat the monastic origin as the established account rather than a dated event.
- A record of the landscape: the Swaledale, the horned hill breed of the northern dales and the Pennines, is one of the hardiest sheep in Britain; its wool is too coarse and too dark for cloth and goes into carpet, rug and insulation, which is why the breed's value has always been in the lamb and the mutton.
- What that means for the room: this is a cold room. Pressing, draining and waiting, with the whey going to the pigs. Nothing in it boils.
- `NEXT`: `sheepUk`, `boroughUk`

### 4.10 `pastyUk` (Pasti, Cornish and English)

- A record from 1746: the earliest known Cornish pasty recipe is in a letter of that year held by the Cornwall Record Office, and it describes something quite unlike the modern pasty.
- A record from 2011: the name "Cornish pasty" was given Protected Geographical Indication status, which fixes the shape — a D shape crimped on one side — and the filling: beef, potato, swede and onion, seasoned, raw when the pasty is made.
- A record of the landscape it fed: the Cornwall and West Devon Mining Landscape was inscribed on the World Heritage List in 2006, and UNESCO dates its significant period principally from 1700 to 1914. The copper market crashed in 1866; mining continued at a much reduced scale in tin, and Cornish miners emigrated in numbers, carrying the engine house and the pasty to South Africa, Australia and the Americas.
- Traditionally told, not documented: that the thick crimp was a handle to be held and thrown away by miners whose hands carried arsenic, and that initials were marked on one corner so a man knew his own. Both are widely repeated in Cornwall and neither has a contemporary source I could find; write them as tradition.
- `NEXT`: `engineHouseUk`, `orchardUk`

### 4.11 `cocklesUk` (Cocos a bara lawr, Welsh and English)

- A measured record from 1916: a report for the South Wales Sea Fisheries Association estimated that almost 320 tonnes of cockles were taken from the Penclawdd sands each month, with about fifty women at work on a typical day, each donkey carrying about 150 kg in sacks.
- A record of the work: the women walked to Swansea market, about eight miles each way, with the cockles loaded on donkeys. For generations they walked barefoot to the edge of the town and put their shoes on there; by the late nineteenth century they could afford to wear shoes the whole way. Horses and carts replaced the donkeys on the shore in the 1960s.
- A record of the economics: the money from cockling gave these women an unusual independence for the time. Many kept households where the husband was injured or out of work, and many were widows.
- Laverbread, `bara lawr`, is laver seaweed boiled for hours to a dark purée, and it is eaten with cockles, bacon and oatmeal. It is still made at Crofty on the Gower, although the seaweed no longer comes from the local shore.
- `NEXT`: `leeksUk`, `boroughUk`

### 4.12 `smokehouseUk` (Arbroath smokies, Scots and English)

- A record from 2004: the Arbroath smokie was given Protected Geographical Indication status. Only fish prepared within five miles of Arbroath Town House may take the name, a radius running from West Mains in the north to East Haven in the south.
- A record from 1842: the earliest record of smoked haddock being sent from Auchmithie to Dundee. Auchmithie, four miles up the coast, is the fishertoun the smokie is said to come from, and its families are said to have carried the trade into Arbroath.
- A record of the difference that matters: an Arbroath smokie is hot-smoked over a fierce short fire, so the fish is cooked; a kipper is cold-smoked and needs cooking afterwards. Both are in this yard and they are not the same thing.
- An older neighbour: Findon, south of Aberdeen, was smoking haddock — Finnan haddie — for generations before Auchmithie's smokies.
- `NEXT`: `herringUk`, `oatsUk`

### 4.13 `distilleryUk` (Uisge beatha, Gaelic, Scots and English)

- A record from 1823: the Excise Act licensed whisky distilling for a £10 fee, and the trade came out of the hills; before it most production was small and illicit.
- A record of 3 May 1889: Charles Doig sketched a steeply pitched ventilating kiln roof during a site meeting at Dailuaine distillery on Speyside. The "Doig ventilator" is the pagoda, and it is a working vent that draws air through drying malt. Doig went on to design or rebuild dozens of distilleries and the shape became the signature of the industry.
- A record of the process: barley is steeped, spread on a stone floor and turned by hand until it germinates, then dried over a kiln — with peat in the fire where a peated malt is wanted — before mashing, fermenting in wooden washbacks and distilling twice in copper pot stills. Only the middle cut of the second distillation is kept.
- Unverified in this pass and kept out of cards until checked: the date of Aeneas Coffey's continuous-still patent, usually given as 1830 or 1831, and the Royal Commission on Whiskey and Other Potable Spirits of 1908–09, which settled what may legally be called whisky. Both are standard accounts; I could not reach a primary source in this pass.
- `NEXT`: `oatsUk`, `smokehouseUk`

### 4.14 Ingredient stops and landmarks, in brief

- **`pastryCe`**: puff pastry is a butter block enclosed in dough and rolled and folded until the layers run into the hundreds; the water in the butter turns to steam in the oven and lifts every leaf. Beside it on a British board sat hot-water crust, raised round a wooden dolly for a pork or game pie and strong enough to stand without a tin, shortcrust for the pasty and the fruit pie, and suet crust for the boiled and steamed puddings that are the most distinctively British dough of all.
- **`oystersUk`**: London ate oysters by the barrel. In 1864 something over 700 million were eaten in London alone and the fisheries employed around 120,000 people across Britain; by the 1850s Whitstable alone was sending 80 million a year to Billingsgate. Overfishing, pollution and then a typhoid scare in the winter of 1902–3 broke the trade, and inside one lifetime the cheapest food in the city became the dearest.
- **`hopsUk`**: the hop is a climbing bine trained up strings, picked in September and dried in an oast — a brick roundel with a fire below, a slatted drying floor above and a white cowl on top that turns with the wind to draw the smoke. Hops bitter the beer and keep it, which is what made porter and pale ale travel.
- **`mushroomsCe`**: the existing card is about duxelles, the mushroom, shallot and herb mince credited to La Varenne in 1651 and used under the pastry of a Wellington. In Britain the field mushroom was picked at dawn off pasture for the breakfast plate, and ceps and chanterelles came out of the woods after the first autumn rain.
- **`sheepUk`**: the Swaledale is horned in both sexes, white round the nose and eyes, and hefted — a flock learns its own stretch of unfenced fell and passes that knowledge to its lambs, which is why a hill farm sells its sheep with the land.
- **`rhubarbUk`**: forcing began in Yorkshire in 1877. Roots are grown outdoors for two years, lifted after a frost and moved into a dark heated shed, where they grow on their own stored sugar; the sheds are worked by candlelight because any stronger light would green and toughen the stems. The Great Northern ran a nightly rhubarb express from Ardsley to London through the season. Yorkshire Forced Rhubarb was given Protected Designation of Origin status in 2010.
- **`orchardUk`**: cider apples are classed bittersweet, bittersharp, sweet and sharp; Kingston Black from near Taunton and Yarlington Mill, found growing out of a wall at a Somerset mill, both date from the late nineteenth century, and Dabinett was found in a hedge at Middle Lambrook in the early 1900s. Cider was part of a farm labourer's wages in the eighteenth and nineteenth centuries — three pints a day is a commonly cited allowance — and the practice was banned by the Truck Amendment Act of 1887 but went on at harvest anyway.
- **`leeksUk`**: the leek has been a Welsh emblem for at least seven hundred years, and it is the base of cawl, the one-pot stew of lamb and root vegetables that is Wales's national dish and goes back in one form or another to the fourteenth century.
- **`oatsUk`**: Samuel Johnson's dictionary of 1755 defined oats as "a grain, which in England is generally given to horses, but in Scotland supports the people", which was meant as an insult and was taken as a boast. Oats ripen in a short wet summer where wheat will not. They are eaten as porridge, as brose — meal and boiling water or stock, left to stand — and as oatcakes baked on a girdle, a flat iron plate.
- **`herringUk`**: the drift-net fleet followed the shoal from Shetland in May to Yarmouth and Lowestoft in the autumn, and the Scottish gutting crews followed the fleet. A crew was three women, two gutting and one packing; they gutted a fish every ten seconds and could pack thirty barrels of about seven hundred fish in a ten-hour day, fingers bound in cotton strips against the knife. 1913 was the record year: published figures give upwards of 380,000 tons landed at Yarmouth and Lowestoft between September and December, and about 10,000 seasonal workers came into Yarmouth alone, 6,000 of them Scotswomen.
- **`bigBen`**: the Palace of Westminster burned in 1834 and was rebuilt by Barry and Pugin; the tower's great bell first sounded in 1859. Keep the existing card's food content — the river terrace and the pubs of Westminster — and add a `NEXT` to `roastPub`.
- **`towerBridge`**: opened 1894, steam-driven bascules, steel dressed in Cornish granite and Portland stone. The existing card already points at Borough Market five minutes upstream; give it a `NEXT` to `boroughUk` and `pieMashUk`.
- **`redBus`**: the London General Omnibus Company painted its fleet red in 1907 to stand out from its competitors, which is the fact the existing card already carries and the one that puts this object inside the band. Before that the horse omnibus and the hansom cab, whose drivers sat behind and above the passengers.
- **`phoneBox`**: pillar boxes have collected letters since 1852, and the hexagonal Penfold was the standard design between 1866 and 1879. The existing card already says so; the K6 kiosk of 1935 comes out.
- **`forthBridge`**: designed by Benjamin Baker under Sir John Fowler, built by William Arrol of Glasgow from 1883 with a workforce peaking at 4,600, opened 4 March 1890. Three balanced steel cantilevers, the longest bridge span in the world for twenty-seven years, the world's first major steel structure, and a World Heritage Site since 5 July 2015. It completed the east coast railway from London to Aberdeen — which is the line the smokies, the herring and the Scotch went south on.
- **`engineHouseUk`**: the high-pressure beam pumping engine developed by Richard Trevithick and Arthur Woolf let mines go deeper than water had allowed. Something like 3,000 engine houses were built in Cornwall and west Devon, and the type was copied wherever Cornish miners went.

### 4.15 Sources, grouped by object

**roastPub (the roast, the pudding, the pub, imported meat)**
- https://en.wikipedia.org/wiki/Yorkshire_pudding
- https://www.inverse.com/article/42912-hannah-glasse-yorkshire-puddings
- https://www.4pennyhotel.co.uk/history-of-the-sunday-roast/
- https://en.wikipedia.org/wiki/Beerhouse_Act_1830
- https://www.victorianlondon.org/entertainment/ginpalaces.htm
- https://yalebooks.yale.edu/2021/07/19/the-gin-palace/
- https://australianfoodtimeline.com.au/frozen-meat-exports/
- https://hec.lrfoundation.org.uk/archive-library/ships/strathleven-1875
- https://heritage.lrfoundation.org.uk/blogs/dunedin-one-of-the-first-refrigerated-ships

**teaRoomUk**
- https://en.wikipedia.org/wiki/Aerated_Bread_Company
- http://letslookagain.com/2015/06/a-history-of-the-abc-tea-shops/
- https://en.wikipedia.org/wiki/J._Lyons_and_Co.
- https://www.english-heritage.org.uk/visit/blue-plaques/joseph-lyons/
- https://en.wikipedia.org/wiki/Willow_Tearooms
- https://victorianweb.org/victorian/art/architecture/mackintosh/2.html

**boroughUk (Borough, Billingsgate, Smithfield)**
- https://en.wikipedia.org/wiki/Borough_Market
- https://www.londonmuseum.org.uk/collections/london-stories/borough-market-londons-oldest-food-trading-hub/
- https://www.historytoday.com/archive/underneath-arches-celebrating-borough-market
- https://en.wikipedia.org/wiki/Old_Billingsgate
- https://en.wikipedia.org/wiki/Horace_Jones_(architect)
- https://victorianweb.org/art///////architecture/////jones/1.html

**pieMashUk (pie and mash, eels, Lough Neagh)**
- https://en.wikipedia.org/wiki/M.Manze
- https://exploring-london.com/2024/08/19/wheres-londons-oldest-surviving-pie-and-mash-shop/
- https://www.manze.co.uk/facts-fame/
- https://www.londonmuseum.org.uk/collections/london-stories/jellied-eels/
- https://en.wikipedia.org/wiki/Jellied_eels
- https://londonist.com/london/food/london-food-history-eel-pie-and-mash-shops
- https://assets.publishing.service.gov.uk/media/5fd364a48fa8f54d5c52de29/pfn-lough-neagh-eel-pgi.pdf
- https://committees.parliament.uk/writtenevidence/23301/pdf/

**chippyUk**
- https://en.wikipedia.org/wiki/Fish-and-chip_shop
- https://www.historic-uk.com/CultureUK/Fish-Chips/
- https://londonist.com/2016/02/london-s-first-fish-and-chips
- https://www.jeecs.org.uk/readers-help/122-fish-and-chips
- https://www.tamesidecorrespondent.co.uk/2023/05/01/mossleys-claim-to-oldest-chippy-backed-up-by-new-research/
- https://www.globalgrooves.org/learn/the-oldest-chip-shop-in-the-world/

**breakfastUk (coffee stalls, Beeton, Rowntree)**
- https://www.victorianlondon.org/food/coffeestalls.htm
- https://www.victorianlondon.org/publications/mayhew1-9b.htm
- https://www.gutenberg.org/files/55998/55998-h/55998-h.htm
- https://en.wikipedia.org/wiki/Poverty,_A_Study_of_Town_Life
- https://www.rowntreesociety.org.uk/explore-rowntree-history/rowntree-a-z/poverty-in-york/
- https://d1lexza0zk46za.cloudfront.net/coursepacks/history/worlds5/docs/rowntree.pdf
- https://www.ourhistory.org.uk/the-history-of-the-full-english-breakfast-a-cultural-institution/

**lascarUk**
- https://en.wikipedia.org/wiki/Hindoostane_Coffee_House
- https://southasianbritain.org/events/hindoostane-coffee-house-opens/
- https://southasianbritain.org/people/sake-dean-mahomed/
- https://beyondbanglatown.org.uk/globe/cookbooks-cafes-curry-restaurants/
- https://www.goodbeerhunting.com/blog/2023/3/5/national-service-the-bangladeshi-legacy-of-the-british-curry-house
- https://en.wikipedia.org/wiki/Veeraswamy
- https://londonist.com/2016/06/the-story-of-london-s-first-indian-restaurant

**hopKitchenUk and hopsUk**
- https://www.londonmuseum.org.uk/collections/london-stories/hop-picking-londoners-working-holiday/
- https://www.kentarchives.org.uk/hops-in-kent/
- https://en.wikipedia.org/wiki/Hopper_hut
- https://www.kentarchaeology.org.uk/journal/95/oasts-kent-and-east-sussex-part-ii
- https://the-past.com/feature/hopping-through-the-history-of-oast-houses-from-19th-century-brewing-sites-to-luxurious-living-spaces/
- https://www.goodbeerhunting.com/blog/2021/3/9/respect-your-elders-how-fuggle-and-golding-hops-changed-modern-beer-forever
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5525839/

**dairyUk and sheepUk**
- https://www.yorkshiredales.org.uk/early-factory-production-of-cheese-in-hawes/
- https://en.wikipedia.org/wiki/Wensleydale_Creamery
- https://www.wensleydale.co.uk/our-story-i22
- https://en.wikipedia.org/wiki/Swaledale_sheep
- https://swaledale-sheep.com/breed-history/

**pastyUk and engineHouseUk**
- https://www.historic-uk.com/CultureUK/The-Cornish-Pasty/
- https://www.cornwall.co.uk/history/the-cornish-pasty/
- https://oakden.co.uk/cornish-pasty-1746-recipe/
- https://whc.unesco.org/en/list/1215/
- https://www.visitcornwall.com/things-to-do/history-and-heritage/mining-in-cornwall
- https://wildernessengland.com/blog/mining-cornwall/

**cocklesUk and leeksUk**
- https://historypoints.org/index.php?page=penclawdd-cockle-fishery-gower
- https://historypoints.org/index.php?page=cockle-stalls-swansea-market
- http://www.swanseaindoormarket.co.uk/history/the-cockle-industry/
- https://www.grahamwatkins.info/post/2015/07/23/the-cockle-women-of-penclawdd
- https://www.historic-uk.com/HistoryUK/HistoryofWales/The-Leek-National-emblem-of-the-Welsh/
- https://www.wales.com/visit/food-and-drink/essential-welsh-eats
- https://en.wikipedia.org/wiki/Welsh_cuisine

**smokehouseUk and herringUk**
- https://en.wikipedia.org/wiki/Arbroath_smokie
- https://assets.publishing.service.gov.uk/media/5fd34cebe90e076631fb2213/pfn-arbroath-smokies.pdf
- https://en.wikipedia.org/wiki/Finnan_haddie
- https://www.thecourier.co.uk/fp/opinion/2450008/finnan-haddies-and-fishing-villages/
- https://www.scotfishmuseum.org/the-herring-boom.php
- https://foodmuseum.org.uk/east-anglia-and-its-fishing-traditions-the-boom-days-and-the-herring-lassies/
- https://www.herripedia.com/herring-lasses/
- https://wovencommunities.org/collection/the-herring-industry/

**distilleryUk and oatsUk**
- https://en.wikipedia.org/wiki/Charles_C._Doig
- https://www.edinburghwhiskyacademy.com/blogs/feature/charles-doig-doyen-of-distillery-designers
- https://whiskipedia.com/fundamentals/charles-doig-pegoda/
- https://www.thesinglecask.co.uk/blogs/distilleries/dailuaine
- https://www.sciencehistory.org/stories/magazine/fitter-for-a-stable-than-a-table/
- https://en.wikipedia.org/wiki/Brose
- https://www.scotlandshop.com/tartanblog/scottish-oatcake

**rhubarbUk**
- https://en.wikipedia.org/wiki/Rhubarb_Triangle
- https://en.wikipedia.org/wiki/Yorkshire_Forced_Rhubarb
- https://plewsgardendesign.co.uk/forced-rhubarb-growing-by-candlelight/
- https://www.annabelsdeliciouslybritish.co.uk/yorkshire-forced-rhubarb/

**orchardUk**
- https://en.wikipedia.org/wiki/Kingston_Black
- https://en.wikipedia.org/wiki/Yarlington_Mill
- https://cider-review.com/2020/09/19/the-dabinettiad/
- https://museumcrush.org/heres-to-thee-wassailing-cider-and-communal-drinking-in-devon/
- http://researchingfoodhistory.blogspot.com/2019/12/cider-making-in-devonshire-1850.html

**oystersUk**
- https://victorianweb.org/history/london/oysters.html
- https://thedailyeconomy.org/article/victorian-londons-oyster-crisis/
- https://h2g2.com/edited_entry/A283105
- https://simplyoysters.com/oyster-history

**forthBridge, redBus, phoneBox**
- https://unesco.org.uk/our-network/world-heritage-sites/the-forth-bridge
- https://www.historicenvironment.scot/advice-and-support/listing-scheduling-and-designations/world-heritage-sites/forth-bridge/
- https://blog.historicenvironment.scot/2017/03/forth-bridge/
- (The 1907 red-livery and 1852 pillar-box facts are the ones already written into the existing `redBus` and `phoneBox` cards in `graph.ts`; they should be re-sourced by the Researcher in Stage C before the rewritten cards ship.)

**Clothing and period**
- https://vintagedancer.com/1900s/1910s-mens-working-class-clothing/
- https://www.grandboudoir.art/victorian-working-class-clothing/
- https://www.herripedia.com/herring-lasses/
- https://www.scotfishmuseum.org/the-herring-boom.php
- https://www.londonmuseum.org.uk/collections/london-stories/hop-picking-londoners-working-holiday/

---

## 5. Open questions for the lead

**The area's name and extent.**

1. **London or Britain.** My recommendation is Britain, argued in [london-world.md](london-world.md) and in section 1.1 above. The id stays `london` because the recipe routing and the `Area` union depend on it; only the display name and blurb change. If the lead keeps "London", the object list has to be cut by about two thirds, because there is no honest way to put a Speyside distillery, a Gower cockle stall and a Cornish bakehouse inside a London area, and what is left — pub, chippy, pie shop, tea room, market, coffee stall, seamen's kitchen — is seven rooms and two ingredient stops, which is below the China standard for an area.
2. **The table.** Britain wants a bigger frame than the Central Europe table has, and my proposal — grow the table west and make Britain an island with the existing Channel water as its strait — moves the Thames and two Alpine peaks. That is a blueprint decision and it belongs to the lead at Stage B. Nothing in this document depends on which way it goes except the provisional positions.
3. **Northern Ireland has no cluster.** Six clusters is the maximum the brief allows and Ulster loses. The Lough Neagh eel carries it into the pie shop's card honestly, but the lead should decide whether that is enough or whether one cluster should be re-cut.

**Period conflicts.**

4. **The example prompt is contemporary and the art direction is not.** [examples/uk-scene-generation-prompt.txt](examples/uk-scene-generation-prompt.txt) asks for a world "contemporary enough to be recognizable" and lists "making every scene look Victorian" under Avoid. The current art direction requires one recorded band and traditional everyday working clothes. These cannot both be followed. I have written the brief to the art direction, band 1880–1914. The owner may prefer the contemporary reading, in which case the whole brief is rewritten and most of section 4's records become background rather than subject. **This is the first decision and everything else waits on it.**
5. **Three landmarks are outside the band.** The London Eye (2000), the Routemaster (1956) and the K6 kiosk (1935). My recommendation: retire `londonEye`, recast `redBus` onto the 1907 red omnibus and the hansom, recast `phoneBox` onto the 1852 pillar box. The alternative is to keep all three and accept that the area's 3D landmarks are a century later than its rooms, which the art direction's "do not mix one era with another in one picture" argues against for a table that is itself one picture.
6. **The curry house is not in the band.** Section 1.5 and section 3.3 correction 10. My recommendation is to paint the lascar boarding-house kitchen and put the 1810, 1911 and 1926 dates in the card as records. The lead must write this into the brief explicitly, because an image tool asked for "British Indian food" will otherwise deliver a 1970s restaurant.
7. **"The pub carvery" is a post-war name on a Victorian object.** `roastPub` should be renamed "The public house". This is a name change without an id change, which the playbook calls the more dangerous case. The lead tells every agent.

**Facts I could not verify.**

8. The Sunday joint taken to the baker's oven for a penny. Widely described, and it fits the baking trade's Sunday idleness, but I found it only in secondary sources. Check a primary source — a bakers' trade journal or a social survey — before it goes in a card. Until then: unverified.
9. The 1946-equivalent problem in reverse: **Joseph Malin c.1860 and John Lees c.1863.** Both are trade tradition, both are contested, and sources differ on Malin between 1860 and 1865. Write both as claims with "is said to", never as dates.
10. **The Coffey still patent (1830 or 1831) and the Royal Commission on Whiskey and Other Potable Spirits (1908–09).** Standard accounts, not reached in a primary source in this pass. Keep out of cards until checked.
11. **The duchess of Bedford and afternoon tea, 1840s.** No contemporary document found. Legend, or leave it out.
12. **The Cornish pasty's crimp-as-handle and the pastry initials.** Cornish tradition, repeated by the county's own tourism and heritage bodies, without a contemporary source. Write as tradition.
13. **The 1913 herring figures.** Published figures differ substantially: one source gives upwards of 380,000 tons at Yarmouth and Lowestoft from September to December, another about 800,000 cran at Yarmouth alone. Use one figure with its source named, or use the range, not a precise combination.
14. **The hop-picker numbers.** Published figures run from "tens of thousands" to 200,000 to an estimate of 250,000 by the early twentieth century. Use the range.
15. **Clothing inventory numbers.** Unlike the Spain research, I have named collections but no inventory numbers. Before generation, the picture reviewer should pull one catalogued garment or photograph per profile from MERL, the London Museum, the Scottish Fisheries Museum, St Fagans, the Royal Cornwall Museum and the Sutcliffe collection, and write the reference into the brief. Profiles 4, 6 and 8 matter most, because they are the three an image tool is least likely to get right unaided.

**Id and registration notes.**

16. Twenty-three new ids, none colliding with the 379 already in `src/fw/*.ts`. Ids that would have been natural and are already taken elsewhere: `pub`, `market` (India), `cheese` (Italy), `sheep` (China), `oats`, `herring` — all carry the `Uk` suffix here instead.
17. `redBus` is currently `hitOnly: true` with `prop: "none"`. It therefore has no 3D reaction and does not count as one of the area's non-food clickables in `scripts/audit/objects.mjs`. Giving it a real `omnibus` prop fixes both at once.
18. `scripts/audit/objects.mjs` filters to `china`, `middle-east` and `mediterranean` and does not report the Central Europe world at all. It has to learn `central-europe` before Stage 0's baseline numbers can be recorded for this area in the ordinary way. That is a one-line change in a file nobody in Stage A owns; it belongs to the lead or an auditor.

**One room question.**

19. Thirteen rooms is inside the playbook's ten to fifteen but above Spain's twelve, and the image budget is 46 against Spain's 42. If the lead wants it smaller, the weakest pair is `uk_tearoom` and `uk_breakfast`: both are small-food interiors, both are in London, and the tea room's story — a public room a woman could sit in alone — could survive as story depth on `boroughUk`. Cutting them saves four room images and two cards and brings the budget to 40. I do not recommend it: the tea room is the only room in the set whose subject is women's lives rather than men's work, and the coffee stall is the only one that shows what the poorest end of this food culture actually looked like.
