/** Story depth, room discoveries and sources for the Britain area (`london`). Owned by the Researcher.
 *
 *  Every date describes a record, not an invented birthday. Legends are written as legends, and anything
 *  that rests on repetition rather than on a document is written "reported", "is said to" or "unverified",
 *  exactly as section 5 of docs/london-research.md requires. The eight facts flagged there stay out of the
 *  cards as flat dates: the baker's Sunday oven, Joseph Malin and John Lees, the Coffey still and the Royal
 *  Commission of 1908-09, the duchess of Bedford, the pasty crimp-as-handle and the pastry initials, the
 *  1913 herring tonnage and the hop-picker numbers. The last two are written as ranges with their sources
 *  named; the Coffey still and the Royal Commission are simply not written at all.
 *
 *  The period band is about 1880 to 1914. Four things Britain is popularly known for are younger than the
 *  band and appear only as dated later developments: the East End curry house (Holborn 1911 at the
 *  earliest, the East End cafés from the 1920s), the Routemaster (1956), the K6 kiosk (1935) and the
 *  London Eye (2000, retired from this area altogether).
 *
 *  Discovery subjects. Every subject below was checked against the Stage B picture acceptance rows in
 *  docs/london-world.md so that it is visible in **both** orientations. Two consequences are recorded
 *  there rather than hidden here: `uk_chippy`'s third subject is the frying pans rather than the paper
 *  being folded, because the regenerated portrait names the rack, the chipper and the basket and not the
 *  paper; and the third subjects of `uk_breakfast` and `uk_distillery` rest on the wide row alone, because
 *  their portrait rows name only the pour and, in the distillery, the peat fire. Both are flagged in the
 *  Stage C report for the Room maker to confirm while measuring. */

/** Three paragraphs of dated history for every object that opens a painted room. Appended to its blurb. */
export const LONDON_STORY_DEPTH: Record<string, string> = {
  roastPub: `The pudding under the meat is the oldest thing in this room with a date on it. A recipe for "a dripping pudding" appears in The Whole Duty of a Woman in 1737, batter poured into the tin under a joint turning on a spit so that it catches the fat as it falls; Hannah Glasse printed it under the name Yorkshire pudding in The Art of Cookery Made Plain and Easy in 1747. It was eaten first, on its own with gravy, to take the edge off appetites before the meat was carved, which is why the tin on this counter is flat and cut in squares rather than raised in cups.

The meat came within reach of a working household much later, and by sea. On 2 February 1880 the Strathleven landed about forty tons of frozen Australian beef and mutton in London, the first successful cargo of its kind, and the Dunedin brought New Zealand's in 1882. Meat that had cost a penny and a half to twopence a pound in Australia sold at Smithfield for fourpence-halfpenny to sixpence. A weekly roast in a house with no land and no oven is that trade seen from the plate.

The room itself is a piece of licensing law. The Beerhouse Act of 1830 let any ratepayer brew and sell beer on a cheap annual licence, which put a beerhouse on half the corners in London beside the older fully licensed public house; the gin palaces of the 1830s, with their gaslight, gilding and engraved glass, are the ancestors of the etched screen and the polished mahogany here. One practice usually described alongside all this is reported rather than recorded: that a household without an oven carried its joint to the baker, who roasted it for a penny or two while his own ovens stood idle on a Sunday. It is widely repeated and it fits the trade, but this pass found it only in secondary sources.`,

  teaRoomUk: `This room exists because a bread company let a manageress sell tea. The Aerated Bread Company was founded to sell bread raised with carbon dioxide instead of yeast, and in 1864 the manageress of its London Bridge shop began serving tea and food to customers; the ABC tea shop chain grew out of that one arrangement. Thirty years later the idea had a competitor with a plan behind it. J. Lyons and Company opened its first tea shop at 213 Piccadilly in September 1894, sold no alcohol, priced its food the same in every branch and staffed its rooms with women. The "Nippy" uniform and the name belong to 1925 and are not in this band.

Scotland took the same idea further than London did. Catherine Cranston opened the Willow Tea Rooms at 217 Sauchiehall Street, Glasgow, in October 1903, and Charles Rennie Mackintosh designed the building, the interiors, the furniture, the light fittings and the cutlery; it is the only one of her tea rooms he designed entire. A tea room in this period could be a commission as serious as a church.

What the record adds up to is not a menu. These were among the very few public rooms in Britain in which a respectable woman could sit down and eat alone without damage to her name, and that, rather than the cake, is what the room is for. One thing everybody repeats about it is not in the record at all: the invention of afternoon tea is put by legend with Anna, seventh Duchess of Bedford, in the 1840s, and no contemporary document for it was found in this pass. It is a legend and it is written here as one.`,

  boroughUk: `The market's right to stand here is an Act of Parliament. The Borough Market Act of 1756 abolished the ancient market that had been choking the road at the foot of London Bridge and granted the parish of St Saviour's Southwark the right to hold a market on a new site; local residents raised six thousand pounds to buy the ground known as The Triangle, and the Act set up the charitable trust that runs the market to this day. It is the oldest food market in London by that document rather than by tradition.

The iron over the porters' heads is a century younger. The buildings largely date from 1851, to a design by Henry Rose, with further work by Edward Habershon in 1863 and 1864, and in 1860 a railway viaduct was driven straight through the market, which is why trains pass over the stalls. The rest of London's food was rehoused in the same generation: Smithfield, the meat market, was rebuilt by the City architect Sir Horace Jones in 1868, and Billingsgate, the fish market a short walk downstream, by the same architect in 1875.

What that leaves on the floor at four in the morning is a wholesale trade, not a weekend one. Goods come in by river and by the night train, are moved by barrow and by porter, are weighed on a brass balance and are sold in quantity to shops and stalls, with retail happening round the edges for whoever is awake. The cheese is cloth-bound so it can travel and keep its shape, the butter is worked on marble because marble stays cold, and both are sold by weight rather than by the piece.`,

  pieMashUk: `The trade has one address with a continuous record. Robert Cooke opened an eel and pie house at 87 Tower Bridge Road - then Bermondsey New Road, because the bridge was new - in 1891, and Michele Manze, born in Ravello, took it over in 1902. M. Manze is generally called London's oldest surviving pie and mash shop, and by 1930 the family ran fourteen of them. The earliest eel, pie and mash houses had opened in London in the eighteenth century, and when the pie shops spread in the nineteenth, stewed and jellied eels were the only other things on the board.

The eel is older in London than the shop by a long way. In 1472 Dutch eel barges were granted the right to sell live eels at Billingsgate, and they went on doing it for centuries, moored in the river with the fish alive in the wells of the hulls. When the Thames eel gave out under pollution the London trade ran on imported eel instead, and it still does: the Lough Neagh fishery in County Antrim, given Protected Geographical Indication status in 2011, sends most of its eels to Billingsgate for the jellied-eel trade. Ulster is on this plate whether or not it is on this table.

The green is the part of the plate people get wrong. Liquor is parsley sauce made with the stock the eels were cooked in; the name has nothing to do with drink, and the colour has nothing to do with peas. Everything else in the shop follows from the same economy: tile and marble because they wash, mirrors because the room is narrow and dark, sawdust because the floor is wet, and three items because three is what a docker could afford at noon.`,

  chippyUk: `The shop has two founding claims and no document behind either. Joseph Malin is said to have opened a fried fish and chip shop in Cleveland Way, Bow, in the East End of London around 1860, and some sources say 1865; John Lees is said to have sold fish and chips from a wooden hut in Mossley market near Oldham around 1863, later moving to a shop whose window read that it was the first fish and chip shop in the world. Both are trade tradition, both are contested, and both are written here as claims rather than as dates.

The two halves of the plate came from opposite ends of the country and from different communities. Fried fish in batter, eaten cold, came into London with Ashkenazi Jewish immigrants and was sold by Jewish street sellers long before a chip joined it; the chipped potato came down from the industrial north. What put them in the same paper was infrastructure: steam trawling and ice landed sea fish in quantity, the railway carried it inland overnight, and cheap beef dripping made frying it possible at a price a mill hand could pay.

The scale of what followed is measurable even where its origin is not. There were about twenty-five thousand fried fish shops in Britain by 1910, from almost none fifty years earlier. This was the first hot cooked meal a working family could buy that was neither charity nor a public house, which is why the trade was left off rationing in both world wars, and why the queue on a wet evening reaches the door.`,

  breakfastUk: `The stall was counted before it was photographed. Henry Mayhew's London Labour and the London Poor, published in 1851, describes the coffee stalls of London and reckons there were at least two hundred of them, and Mayhew notes that among all the street drinkables the coffee stall alone sold something like a meal rather than a luxury. The customers set the hours: Billingsgate opened before dawn and Smithfield earlier still, and the trade that fed the porters, carmen and market men worked to their clock and not to a shop's.

What was on the griddle was the cheap end of a list that had just been written down for households. Isabella Beeton's Book of Household Management of 1861 sets out the breakfast dishes - broiled rashers, fried ham and eggs, kidneys, fish - that became the template for what is now called the full English. A stall sold bacon, bread and butter, an egg if the customer could pay for one, and tea, dark and strong, out of a boiler with a brass tap.

How ordinary that was is a question the period answered with a survey. Seebohm Rowntree's Poverty, A Study of Town Life, published in 1901 and based on visits to every working-class household in York in 1899 - 11,560 families and 46,754 people - found 27.84 per cent of them below his primary-and-secondary poverty line. Bread, dripping and tea were the base of that diet. A hot bacon breakfast at a stall under a naphtha flare was a working man's good morning, not his every morning.`,

  lascarUk: `Indian food was cooked and sold in London long before there was a restaurant, and the first attempt has a name and an address. Sake Dean Mahomed, born in Patna, opened the Hindoostane Coffee House at 34 George Street in 1810, the first Indian restaurant in the country, serving Indian food and offering hookahs to East India Company men who had come home. He was bankrupt by 1812. Nothing replaced it for a century.

What did not stop was the traffic in people. Lascars - sailors recruited across South Asia for British ships - were a permanent presence in the London docks through the whole of the nineteenth century, and the largest groups came from Sylhet and Chittagong. They cooked for each other in boarding-house kitchens and ships' galleys around Shadwell and Limehouse, because there was nowhere to buy the food and because a man between ships had to eat. In the 1920s and 1930s the settled Bengali community in the East End began opening lodging houses that fed and sheltered newly arrived seamen, and the cafés run by former lascars and ships' cooks grew out of them.

The restaurant dates belong on this card and not in this room. Salut e Hind is reported as the first Indian restaurant to open in Holborn, in 1911, followed by the Kohinoor and a curry café in Commercial Street in the 1920s; Edward Palmer opened Veeraswamy in Piccadilly in 1926, and it is the oldest Indian restaurant in Britain still trading. Between 1880 and 1914 there was no East End curry house. There were six men from one ship, a stone slab, an iron pan and a fire.`,

  hopKitchenUk: `The garden this cookhouse stands in was at its largest just before the band opens. The English hop acreage reached its all-time peak of 71,789 acres in 1878, about forty thousand of them in Kent and spread across some three hundred parishes, and one estimate puts nearly seven thousand oast houses in the county at that date - roughly three oasts to every public house. Two varieties carry it: Fuggle, raised in the 1860s, and Golding, older, and between them they are what English bitter tastes of.

Picking that acreage needed a city. From the late nineteenth century until the 1960s Londoners went down to Kent for the hop harvest every September, and the published estimates of how many run from tens of thousands to two hundred thousand, with one estimate of a quarter of a million by the early twentieth century; the range is the honest figure and a single number is not. About a third of the seasonal workforce came from the East End, and it was mostly women and children.

The conditions are recorded by the people who tried to fix them. Pickers lived in hopper huts, in many places single rooms of corrugated iron with a straw-filled mattress, and cooked on open fires outside, and the medical journals of the period carried repeated appeals for dispensaries and first aid in the hop districts, which is a measure of how bad a bad year could be. The same families went back to the same farm for generations and called it their holiday, and both of those things are true at once.`,

  dairyUk: `The dale made this cheese on its farms for centuries before anyone made it in a building. The technique is credited to Cistercian monks who settled in Wensleydale in the twelfth century and is best treated as an established account rather than as a dated event; what the farms did with it afterwards is not in doubt, because the cheese was made by the farmers' wives in rooms exactly like this one, in the weeks when the milk was more than the household could drink.

The date that changed it is 1897, when Edward Chapman set up a commercial creamery at Hawes and began buying the dale's milk instead of leaving each farm to turn its own. The premises became available because a woollen mill beside Gayle Beck had failed, which is the whole of the nineteenth-century Dales in one sentence: cloth went out of the valley and dairying came in.

The sheep on the fell beyond the door are part of the same arithmetic. The Swaledale, the horned hill breed of the northern dales and the Pennines, is one of the hardiest sheep in Britain, and its wool is too coarse and too dark for cloth - it goes into carpet, rug and insulation - so the breed's value has always been in the lamb and the mutton. And the room itself is cold work from end to end: cutting, draining, pressing, waiting, and the whey to the pigs. Nothing in it boils, and nothing in it is meant to.`,

  pastyUk: `The pasty's earliest known recipe is a letter. It is dated 1746 and is held by the Cornwall Record Office, and it describes something quite unlike the modern pasty, which is the usual shape of an old recipe for a thing people still eat. The name was fixed much later and from the other direction: "Cornish pasty" was given Protected Geographical Indication status in 2011, and the protection describes a D shape crimped along one side and a filling of beef, potato, swede and onion, seasoned, put in raw so that it cooks in its own steam.

What it fed is a landscape with a date of its own. The Cornwall and West Devon Mining Landscape was inscribed on the World Heritage List in 2006, and UNESCO dates its significant period principally from 1700 to 1914. The copper market crashed in 1866; tin mining continued at a much reduced scale, and Cornish miners emigrated in very large numbers, carrying the engine house and the pasty to South Africa, Australia and the Americas, which is why both are found on four continents.

Two things everybody in Cornwall will tell you about this bakehouse are tradition rather than record. The thick crimp is said to have been a handle, held by a miner whose hands carried arsenic and thrown away at the end; and initials are said to have been marked on one corner so that a man knew his own and could leave half for later. Both are repeated by the county's own heritage and tourism bodies and neither has a contemporary source that this pass could find. They are written as tradition and they stay that way.`,

  cocklesUk: `The scale of the work on these sands was measured once, in the middle of a war. A report for the South Wales Sea Fisheries Association in 1916 estimated that almost 320 tonnes of cockles were taken from the Penclawdd sands each month, with about fifty women at work on a typical day and about 150 kilogrammes loaded on each donkey. The riddle, the scrape, the sack and the donkey are the whole of the equipment, and the tide is the whole of the timetable.

Then the cockles had to be sold, which meant walking. The women went to Swansea market, about eight miles each way, with the sacks on the donkeys, and for generations they walked barefoot to the edge of the town and put their shoes on there; by the late nineteenth century they could afford to wear them the whole way, which is a wage rise recorded in footwear. Horses and carts replaced the donkeys on the shore only in the 1960s.

The money mattered more than the distance. Cockling gave these women an unusual independence for the period: many kept households where the husband was injured or out of work, and many were widows, and the cash came to them directly and weekly. Beside the cockles on the stall is the other harvest of the same shore, bara lawr - laver seaweed boiled for hours to a dark purée and eaten with cockles, bacon and oatmeal. It is still made at Crofty on the Gower, although the seaweed no longer comes from the local shore.`,

  smokehouseUk: `The smokie's name is now law, and its boundary is drawn on the ground. Protected Geographical Indication status was granted in 2004, and only fish prepared within five miles of Arbroath Town House may take the name - a radius that runs from West Mains in the north to East Haven in the south. A protected name is a modern instrument, but what it protects here is a fire in a hole and a wooden stick.

The earlier record points four miles up the coast. In 1842 smoked haddock was being sent from Auchmithie to Dundee, and that is the earliest record of the trade; Auchmithie is the fishertoun the smokie is said to come from, and its families are said to have carried the method into Arbroath. The "said to" is the right form: the move is the settled local account rather than a documented event with a date.

What is on the two rails in this yard is the difference the trade turns on. An Arbroath smokie is hot-smoked over a fierce short fire, so the fish is cooked as well as cured and is eaten warm with the fingers; a kipper is cold-smoked, comes off the rail raw, and needs a pan afterwards. Beside both of them sits the older neighbour: Findon, south of Aberdeen, was smoking haddock - Finnan haddie - for generations before Auchmithie's smokies, pale, split and cold. Three cures, one shed, and only one of them is cooked.`,

  distilleryUk: `The trade came out of the hills by Act of Parliament. The Excise Act of 1823 licensed whisky distilling for a fee of ten pounds and set a duty a legal distiller could live with; before it, most production in the Highlands was small, portable and illicit, and after it the glens filled with licensed stills that are still working. Everything in this hollow - the burn, the barley, the peat stack and the bonded store - is downstream of that one change in the law.

The shape on the roof has a day attached to it. On 3 May 1889 Charles Doig sketched a steeply pitched ventilating kiln roof during a site meeting at Dailuaine distillery on Speyside. The "Doig ventilator" is what everybody now calls the pagoda, and it is not an ornament: it draws air up through the drying malt on the floor below. Doig went on to design or rebuild dozens of distilleries, and the outline became the signature of an entire industry within a generation.

The process under it has not changed much since. Barley is steeped, spread on a stone floor and turned by hand with a wooden shiel until it germinates evenly and does not overheat, then dried over a kiln - with peat in the fire where a peated malt is wanted - before mashing, fermenting in wooden washbacks and distilling twice in copper pot stills. Only the middle cut of the second distillation is kept, and the still-house glass is locked because for most of this period the excise, and not the distiller, held the key.`,
};

/** Three touches per room, keyed by the thirteen `uk_*` scene ids. Label, then the discovery text.
 *  Every subject is visible in both the wide and the portrait painting; see the header note. */
export const LONDON_DISCOVERIES: Record<string, [string, string][]> = {
  uk_pub: [
    ["Look at the cut face", "The joint is carved across the grain, and the outside slice, brown and salt from the dripping, was the one people asked for. A sirloin is roasted on the bone because the bone conducts the heat inward and holds the meat's shape while it rests."],
    ["Lift the pudding tin", "A recipe for a dripping pudding is printed in The Whole Duty of a Woman in 1737, and Hannah Glasse gave it the name Yorkshire pudding in The Art of Cookery Made Plain and Easy in 1747. It is baked flat under the meat and cut, and it is eaten first, with gravy."],
    ["Pull the beer engine", "The roast is a Sunday thing because Sunday was the one day the fire and the money were both there. The Beerhouse Act of 1830 put a beerhouse on half the corners in London, and the gin palaces of the same decade are where this etched glass and polished mahogany come from."],
  ],
  uk_tearoom: [
    ["Tilt the pot", "The Aerated Bread Company's London Bridge manageress began serving tea to customers in 1864, and J. Lyons opened its first tea shop at 213 Piccadilly in September 1894. The leaf is loose, so the strainer is not a nicety; it is the only thing between the pot and the cup."],
    ["Take a slice of bread and butter", "These rooms sold no alcohol and were staffed by women. That is what made them respectable for a woman on her own, and they were among the very few public rooms in Britain where she could sit down and eat without damage to her name."],
    ["Cut the cake", "Catherine Cranston opened the Willow Tea Rooms at 217 Sauchiehall Street, Glasgow, in October 1903. Charles Rennie Mackintosh designed the building, the interiors, the furniture, the light fittings and the cutlery; it is the only one of her tea rooms he designed entire."],
  ],
  uk_market: [
    ["Draw the cheese wire", "A cloth-bound truckle is bandaged in muslin and larded so that it can breathe and travel without losing its shape, which is why it keeps a rind rather than a skin. The wire cuts rather than slices, because a blade would drag the crumb."],
    ["Work the butter pats", "Butter is shaped between a pair of ribbed wooden pats and sold by weight off a marble slab, because marble stays cold when everything else in the hall is warming up. The ribs are there to stop the butter sticking to the wood."],
    ["Look in the apple basket", "The market has traded on this ground since the Borough Market Act of 1756 gave the parish of St Saviour's Southwark the right to hold it, and the buildings are largely of 1851. A railway viaduct was driven through the market in 1860, which is why trains pass over the stalls."],
  ],
  uk_piemash: [
    ["Break open the pie", "The earliest eel, pie and mash houses opened in London in the eighteenth century. The oldest one still trading, M. Manze, has been at 87 Tower Bridge Road since 1902, in a shop Robert Cooke had opened as an eel and pie house in 1891."],
    ["Tip the ladle", "Liquor is parsley sauce made with the stock the eels were cooked in. That is where the name comes from and why it is green; it has nothing to do with drink and nothing to do with peas."],
    ["Look in the eel tray", "Eels came up the Thames until pollution finished them, and then down from the Dutch eel barges that had been licensed to sell live eels at Billingsgate since 1472. Today most of the jellied-eel trade's fish comes from Lough Neagh in County Antrim."],
  ],
  uk_chippy: [
    ["Look at the draining rack", "Fried fish in batter came into London with Ashkenazi Jewish immigrants, who fried it to be eaten cold; the chipped potato came down from the industrial north. The earliest London shop is attributed to Joseph Malin around 1860, and the claim has no document behind it."],
    ["Work the bench chipper", "The northern claim belongs to John Lees, who is said to have sold fish and chips from a wooden hut in Mossley market around 1863. Both claims are trade tradition and neither is recorded, so this shop has two birthplaces and no birthday."],
    ["Watch the pans", "There were about twenty-five thousand fried fish shops in Britain by 1910, from almost none fifty years before. The frying is done in beef dripping, which is what a northern chip tastes of, and the wire basket is shaken clear so the fat runs back into the pan."],
  ],
  uk_breakfast: [
    ["Turn the bacon", "Henry Mayhew counted at least two hundred coffee stalls in London in London Labour and the London Poor in 1851, and noted that the coffee stall alone among the street trades sold something like a meal rather than a luxury. They fed the people who worked through the night."],
    ["Fill the mug", "The boiler has a brass tap and the tea is dark, strong and sweet. The stall's light is a naphtha flare, which is why it throws that hard moving light on faces - and why almost every photograph anybody took of one is a blur."],
    ["Take the bread and butter", "What became the full English was codified for households by Isabella Beeton's Book of Household Management in 1861. At a stall it was bacon, bread and butter, an egg if you could pay for one, and tea, handed over a board and eaten standing up."],
  ],
  uk_lascar: [
    ["Scrape the spice slab", "Spices are ground fresh on the stone every day, because ground spice does not keep and because nothing else was for sale. The roller is worked with the whole body, not the wrist, and the slab is the most valuable thing in the room."],
    ["Look in the curry pot", "Lascars - sailors recruited across South Asia for British ships - were a permanent presence in the docks, and the largest groups came from Sylhet and Chittagong. They cooked for each other around Shadwell and Limehouse because there was nowhere to buy the food."],
    ["Lift the rice lid", "Sake Dean Mahomed opened the Hindoostane Coffee House at 34 George Street in 1810 and was bankrupt by 1812. Salut e Hind is reported to have opened in Holborn in 1911 and Veeraswamy in Piccadilly in 1926. In this decade there is no curry house, only this kitchen."],
  ],
  uk_hopkitchen: [
    ["Swing the pot", "Londoners came down to Kent for the September picking from the late nineteenth century until the 1960s. Published estimates of how many run from tens of thousands to two hundred thousand, with one estimate of a quarter of a million by the early twentieth century."],
    ["Look in the hop bin", "The English hop acreage peaked at 71,789 acres in 1878, about forty thousand of them in Kent across some three hundred parishes, which is why the county has so many oasts. Pickers were paid by the bushel, and the measurer's word settled the day's wage."],
    ["Cut the loaf", "Pickers lived in hopper huts, in many places a single room of corrugated iron with a straw-filled mattress, and cooked outside on a fire like this one. The same families went back to the same farm for generations and called it their holiday."],
  ],
  uk_dairy: [
    ["Look at the cut truckle", "Wensleydale was made on the dale's farms for centuries before Edward Chapman opened a creamery at Hawes in 1897 and began buying the farms' milk instead. The technique is credited to Cistercian monks who settled in the dale in the twelfth century."],
    ["Turn the curd on the rack", "The cheese is pressed only lightly and eaten young, which is why it crumbles rather than slices and why the paste is white and open rather than close and yellow. Everything in this room is done cold; nothing in it boils."],
    ["Watch the press", "The whey running into the pail is not waste. It went to the pigs, and the household drank and ate what it could of it first. The screw is turned down by half a turn at a time, because forcing it would drive the fat out with the whey."],
  ],
  uk_pasty: [
    ["Follow the crimp", "The crimp is a seam and it runs along the side of a Cornish pasty, never over the top. It is said in Cornwall to have been a handle for a miner whose hands carried arsenic, and initials are said to have been marked on one corner; both are tradition, without a contemporary source."],
    ["Break one open", "The recognised filling is beef, potato, swede and onion, seasoned, and it goes in raw so that it cooks in its own steam inside the pastry. Swede and potato are sliced rather than diced, and there is no carrot in it at all."],
    ["Look into the oven mouth", "The earliest known Cornish pasty recipe is in a letter of 1746 held by the Cornwall Record Office, and it describes something quite unlike this one. The name was given Protected Geographical Indication status in 2011, which fixed both the shape and the filling."],
  ],
  uk_cockles: [
    ["Shake the riddle", "The women of Penclawdd worked the sands on foot and carried the cockles off by donkey, then walked about eight miles each way to Swansea market. For generations they walked barefoot to the edge of the town and put their shoes on there."],
    ["Fill the pint measure", "A report for the South Wales Sea Fisheries Association in 1916 estimated almost 320 tonnes of cockles a month from these sands, with about fifty women at work on a typical day and about 150 kilogrammes on each donkey."],
    ["Taste the laverbread", "Laver is a seaweed, boiled for hours to a dark purée, and it is eaten with cockles, bacon and oatmeal, which is why the two are always on the same stall. It is still made at Crofty on the Gower, although the seaweed no longer comes from this shore."],
  ],
  uk_smokehouse: [
    ["Lower the tied pair", "The fish are tied in pairs by the tail so that they hang over a wooden speet across the pit, and the pair is still how they are sold. The salting is short - a couple of hours dry - because the fire is going to do the rest of the work."],
    ["Open a smokie", "This is a hot smoke, short and fierce, so the fish is cooked as well as cured and is eaten warm with the fingers. A kipper on the other rail is cold-smoked and comes off it raw; the two look alike and are not the same thing."],
    ["Look into the pit", "The pit is a half whisky barrel sunk in the ground with a hardwood fire in it, and wet hessian thrown over the top holds the smoke down. The smokie is said to have come from Auchmithie, four miles up the coast, and was given Protected Geographical Indication status in 2004."],
  ],
  uk_distillery: [
    ["Turn the barley", "The barley is steeped, spread on the stone floor and turned by hand with a wooden shiel so that it germinates evenly and does not overheat in the heap. The green malt is walked over for days, and the turning is what a maltman's back is for."],
    ["Look under the kiln", "Charles Doig sketched the first pagoda ventilator at Dailuaine on Speyside on 3 May 1889. It is a kiln vent rather than an ornament: every one of them is drawing air up through drying malt, and peat in the fire below is what puts the smoke into the grain."],
    ["Watch the spirit safe", "Distilling was licensed and brought out of the hills by the Excise Act of 1823, which set the fee at ten pounds. Only the middle cut of the second distillation is kept, and the glass is locked because for most of this period the excise, not the distiller, held the key."],
  ],
};

// --- sources, one named record per object -------------------------------------------------------
// Grouped as in section 4.15 of docs/london-research.md. The `redBus` and `phoneBox` sources were
// re-checked in this pass, as that section asked: the 1907 LGOC red livery, the 1834 hansom patent, the
// 1852 Channel Islands pillar boxes and the 1866-79 Penfold dates all now carry their own entries.

const yorkshirePudding = { title: "Wikipedia · Yorkshire pudding", url: "https://en.wikipedia.org/wiki/Yorkshire_pudding" };
const glasse = { title: "Inverse · Hannah Glasse and the Yorkshire pudding", url: "https://www.inverse.com/article/42912-hannah-glasse-yorkshire-puddings" };
const sundayRoast = { title: "The Four Penny Hotel · A history of the Sunday roast", url: "https://www.4pennyhotel.co.uk/history-of-the-sunday-roast/" };
const beerhouseAct = { title: "Wikipedia · The Beerhouse Act 1830", url: "https://en.wikipedia.org/wiki/Beerhouse_Act_1830" };
const ginPalaces = { title: "Victorian London · Gin palaces", url: "https://www.victorianlondon.org/entertainment/ginpalaces.htm" };
const ginPalaceYale = { title: "Yale University Press · The gin palace", url: "https://yalebooks.yale.edu/2021/07/19/the-gin-palace/" };
const frozenMeat = { title: "Australian Food Timeline · Frozen meat exports", url: "https://australianfoodtimeline.com.au/frozen-meat-exports/" };
const strathleven = { title: "Lloyd's Register Foundation · The Strathleven, 1875", url: "https://hec.lrfoundation.org.uk/archive-library/ships/strathleven-1875" };
const dunedin = { title: "Lloyd's Register Foundation · The Dunedin, an early refrigerated ship", url: "https://heritage.lrfoundation.org.uk/blogs/dunedin-one-of-the-first-refrigerated-ships" };

const abc = { title: "Wikipedia · The Aerated Bread Company", url: "https://en.wikipedia.org/wiki/Aerated_Bread_Company" };
const abcShops = { title: "Let's Look Again · A history of the ABC tea shops", url: "http://letslookagain.com/2015/06/a-history-of-the-abc-tea-shops/" };
const lyons = { title: "Wikipedia · J. Lyons and Co.", url: "https://en.wikipedia.org/wiki/J._Lyons_and_Co." };
const lyonsPlaque = { title: "English Heritage · Joseph Lyons blue plaque", url: "https://www.english-heritage.org.uk/visit/blue-plaques/joseph-lyons/" };
const willow = { title: "Wikipedia · The Willow Tearooms", url: "https://en.wikipedia.org/wiki/Willow_Tearooms" };
const mackintosh = { title: "The Victorian Web · Mackintosh and the Cranston tea rooms", url: "https://victorianweb.org/victorian/art/architecture/mackintosh/2.html" };

const borough = { title: "Wikipedia · Borough Market", url: "https://en.wikipedia.org/wiki/Borough_Market" };
const boroughMuseum = { title: "London Museum · Borough Market, London's oldest food trading hub", url: "https://www.londonmuseum.org.uk/collections/london-stories/borough-market-londons-oldest-food-trading-hub/" };
const boroughHistory = { title: "History Today · Underneath the arches, Borough Market", url: "https://www.historytoday.com/archive/underneath-arches-celebrating-borough-market" };
const billingsgate = { title: "Wikipedia · Old Billingsgate Market", url: "https://en.wikipedia.org/wiki/Old_Billingsgate" };
const horaceJones = { title: "Wikipedia · Sir Horace Jones, City architect", url: "https://en.wikipedia.org/wiki/Horace_Jones_(architect)" };

const manze = { title: "Wikipedia · M. Manze", url: "https://en.wikipedia.org/wiki/M.Manze" };
const oldestPieShop = { title: "Exploring London · London's oldest surviving pie and mash shop", url: "https://exploring-london.com/2024/08/19/wheres-londons-oldest-surviving-pie-and-mash-shop/" };
const manzeFacts = { title: "M. Manze · Facts and fame", url: "https://www.manze.co.uk/facts-fame/" };
const jelliedEelsMuseum = { title: "London Museum · Jellied eels", url: "https://www.londonmuseum.org.uk/collections/london-stories/jellied-eels/" };
const jelliedEels = { title: "Wikipedia · Jellied eels", url: "https://en.wikipedia.org/wiki/Jellied_eels" };
const eelPieShops = { title: "Londonist · Eel, pie and mash shops", url: "https://londonist.com/london/food/london-food-history-eel-pie-and-mash-shops" };
const loughNeagh = { title: "UK Government · Lough Neagh eel, PGI specification", url: "https://assets.publishing.service.gov.uk/media/5fd364a48fa8f54d5c52de29/pfn-lough-neagh-eel-pgi.pdf" };

const chipShop = { title: "Wikipedia · The fish and chip shop", url: "https://en.wikipedia.org/wiki/Fish-and-chip_shop" };
const historicUkChips = { title: "Historic UK · Fish and chips", url: "https://www.historic-uk.com/CultureUK/Fish-Chips/" };
const londonistChips = { title: "Londonist · London's first fish and chips", url: "https://londonist.com/2016/02/london-s-first-fish-and-chips" };
const jewishEastEnd = { title: "Jewish East End of London · Fish and chips", url: "https://www.jeecs.org.uk/readers-help/122-fish-and-chips" };
const mossley = { title: "Tameside Correspondent · Mossley's claim to the oldest chippy", url: "https://www.tamesidecorrespondent.co.uk/2023/05/01/mossleys-claim-to-oldest-chippy-backed-up-by-new-research/" };

const coffeeStalls = { title: "Victorian London · Coffee stalls", url: "https://www.victorianlondon.org/food/coffeestalls.htm" };
const mayhew = { title: "Mayhew · London Labour and the London Poor, the coffee stalls", url: "https://www.victorianlondon.org/publications/mayhew1-9b.htm" };
const beeton = { title: "Project Gutenberg · Beeton's Book of Household Management", url: "https://www.gutenberg.org/files/55998/55998-h/55998-h.htm" };
const rowntree = { title: "Wikipedia · Poverty, A Study of Town Life", url: "https://en.wikipedia.org/wiki/Poverty,_A_Study_of_Town_Life" };
const rowntreeSociety = { title: "Rowntree Society · Poverty in York", url: "https://www.rowntreesociety.org.uk/explore-rowntree-history/rowntree-a-z/poverty-in-york/" };
const fullEnglish = { title: "Our History · The history of the full English breakfast", url: "https://www.ourhistory.org.uk/the-history-of-the-full-english-breakfast-a-cultural-institution/" };

const hindoostane = { title: "Wikipedia · The Hindoostane Coffee House", url: "https://en.wikipedia.org/wiki/Hindoostane_Coffee_House" };
const southAsianBritain = { title: "South Asian Britain · The Hindoostane Coffee House opens", url: "https://southasianbritain.org/events/hindoostane-coffee-house-opens/" };
const deanMahomed = { title: "South Asian Britain · Sake Dean Mahomed", url: "https://southasianbritain.org/people/sake-dean-mahomed/" };
const banglatown = { title: "Beyond Banglatown · Cookbooks, cafés and curry restaurants", url: "https://beyondbanglatown.org.uk/globe/cookbooks-cafes-curry-restaurants/" };
const lascarLegacy = { title: "Good Beer Hunting · The Bangladeshi legacy of the British curry house", url: "https://www.goodbeerhunting.com/blog/2023/3/5/national-service-the-bangladeshi-legacy-of-the-british-curry-house" };
const veeraswamy = { title: "Wikipedia · Veeraswamy", url: "https://en.wikipedia.org/wiki/Veeraswamy" };

const hopPicking = { title: "London Museum · Hop picking, Londoners' working holiday", url: "https://www.londonmuseum.org.uk/collections/london-stories/hop-picking-londoners-working-holiday/" };
const kentHops = { title: "Kent Archives · Hops in Kent", url: "https://www.kentarchives.org.uk/hops-in-kent/" };
const hopperHut = { title: "Wikipedia · The hopper hut", url: "https://en.wikipedia.org/wiki/Hopper_hut" };
const oastsKent = { title: "Kent Archaeological Society · Oasts of Kent and East Sussex", url: "https://www.kentarchaeology.org.uk/journal/95/oasts-kent-and-east-sussex-part-ii" };
const oastHistory = { title: "The Past · Hopping through the history of oast houses", url: "https://the-past.com/feature/hopping-through-the-history-of-oast-houses-from-19th-century-brewing-sites-to-luxurious-living-spaces/" };
const fuggleGolding = { title: "Good Beer Hunting · How Fuggle and Golding changed beer", url: "https://www.goodbeerhunting.com/blog/2021/3/9/respect-your-elders-how-fuggle-and-golding-hops-changed-modern-beer-forever" };
const hopMedical = { title: "PMC · Medical care in the hop districts", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5525839/" };

const hawes = { title: "Yorkshire Dales · Early factory production of cheese in Hawes", url: "https://www.yorkshiredales.org.uk/early-factory-production-of-cheese-in-hawes/" };
const wensleydaleCreamery = { title: "Wikipedia · Wensleydale Creamery", url: "https://en.wikipedia.org/wiki/Wensleydale_Creamery" };
const wensleydaleStory = { title: "Wensleydale Creamery · Our story", url: "https://www.wensleydale.co.uk/our-story-i22" };
const swaledale = { title: "Wikipedia · The Swaledale sheep", url: "https://en.wikipedia.org/wiki/Swaledale_sheep" };
const swaledaleBreed = { title: "Swaledale Sheep Breeders · Breed history", url: "https://swaledale-sheep.com/breed-history/" };

const pastyHistoric = { title: "Historic UK · The Cornish pasty", url: "https://www.historic-uk.com/CultureUK/The-Cornish-Pasty/" };
const pastyCornwall = { title: "Cornwall.co.uk · The Cornish pasty", url: "https://www.cornwall.co.uk/history/the-cornish-pasty/" };
const pasty1746 = { title: "Oakden · The 1746 Cornish pasty recipe", url: "https://oakden.co.uk/cornish-pasty-1746-recipe/" };
const miningWhs = { title: "UNESCO · Cornwall and West Devon Mining Landscape", url: "https://whc.unesco.org/en/list/1215/" };
const cornishMining = { title: "Visit Cornwall · Mining in Cornwall", url: "https://www.visitcornwall.com/things-to-do/history-and-heritage/mining-in-cornwall" };
const miningBlog = { title: "Wilderness England · Mining in Cornwall", url: "https://wildernessengland.com/blog/mining-cornwall/" };

const penclawdd = { title: "History Points · The Penclawdd cockle fishery, Gower", url: "https://historypoints.org/index.php?page=penclawdd-cockle-fishery-gower" };
const cockleStalls = { title: "History Points · The cockle stalls, Swansea market", url: "https://historypoints.org/index.php?page=cockle-stalls-swansea-market" };
const cockleIndustry = { title: "Swansea Market · The cockle industry", url: "http://www.swanseaindoormarket.co.uk/history/the-cockle-industry/" };
const cockleWomen = { title: "Graham Watkins · The cockle women of Penclawdd", url: "https://www.grahamwatkins.info/post/2015/07/23/the-cockle-women-of-penclawdd" };
const welshLeek = { title: "Historic UK · The leek, national emblem of the Welsh", url: "https://www.historic-uk.com/HistoryUK/HistoryofWales/The-Leek-National-emblem-of-the-Welsh/" };
const welshEats = { title: "Wales.com · Essential Welsh eats", url: "https://www.wales.com/visit/food-and-drink/essential-welsh-eats" };
const welshCuisine = { title: "Wikipedia · Welsh cuisine", url: "https://en.wikipedia.org/wiki/Welsh_cuisine" };

const smokie = { title: "Wikipedia · The Arbroath smokie", url: "https://en.wikipedia.org/wiki/Arbroath_smokie" };
const smokiePgi = { title: "UK Government · Arbroath smokies, PGI specification", url: "https://assets.publishing.service.gov.uk/media/5fd34cebe90e076631fb2213/pfn-arbroath-smokies.pdf" };
const finnan = { title: "Wikipedia · Finnan haddie", url: "https://en.wikipedia.org/wiki/Finnan_haddie" };
const finnanCourier = { title: "The Courier · Finnan haddies and fishing villages", url: "https://www.thecourier.co.uk/fp/opinion/2450008/finnan-haddies-and-fishing-villages/" };
const herringBoom = { title: "Scottish Fisheries Museum · The herring boom", url: "https://www.scotfishmuseum.org/the-herring-boom.php" };
const herringLassies = { title: "Food Museum · East Anglia and the herring lassies", url: "https://foodmuseum.org.uk/east-anglia-and-its-fishing-traditions-the-boom-days-and-the-herring-lassies/" };
const herripedia = { title: "Herripedia · The herring lasses", url: "https://www.herripedia.com/herring-lasses/" };
const herringIndustry = { title: "Woven Communities · The herring industry", url: "https://wovencommunities.org/collection/the-herring-industry/" };

const doig = { title: "Wikipedia · Charles C. Doig", url: "https://en.wikipedia.org/wiki/Charles_C._Doig" };
const doigAcademy = { title: "Edinburgh Whisky Academy · Charles Doig, distillery designer", url: "https://www.edinburghwhiskyacademy.com/blogs/feature/charles-doig-doyen-of-distillery-designers" };
const doigPagoda = { title: "Whiskipedia · The Doig pagoda", url: "https://whiskipedia.com/fundamentals/charles-doig-pegoda/" };
const dailuaine = { title: "The Single Cask · Dailuaine", url: "https://www.thesinglecask.co.uk/blogs/distilleries/dailuaine" };
const johnsonOats = { title: "Science History Institute · Fitter for a stable than a table", url: "https://www.sciencehistory.org/stories/magazine/fitter-for-a-stable-than-a-table/" };
const brose = { title: "Wikipedia · Brose", url: "https://en.wikipedia.org/wiki/Brose" };
const oatcake = { title: "ScotlandShop · The Scottish oatcake", url: "https://www.scotlandshop.com/tartanblog/scottish-oatcake" };

const rhubarbTriangle = { title: "Wikipedia · The Rhubarb Triangle", url: "https://en.wikipedia.org/wiki/Rhubarb_Triangle" };
const forcedRhubarb = { title: "Wikipedia · Yorkshire Forced Rhubarb", url: "https://en.wikipedia.org/wiki/Yorkshire_Forced_Rhubarb" };
const rhubarbCandle = { title: "Plews Garden Design · Forced rhubarb grown by candlelight", url: "https://plewsgardendesign.co.uk/forced-rhubarb-growing-by-candlelight/" };

const kingstonBlack = { title: "Wikipedia · Kingston Black", url: "https://en.wikipedia.org/wiki/Kingston_Black" };
const yarlington = { title: "Wikipedia · Yarlington Mill", url: "https://en.wikipedia.org/wiki/Yarlington_Mill" };
const dabinett = { title: "Cider Review · The Dabinettiad", url: "https://cider-review.com/2020/09/19/the-dabinettiad/" };
const ciderWages = { title: "Museum Crush · Cider and communal drinking in Devon", url: "https://museumcrush.org/heres-to-thee-wassailing-cider-and-communal-drinking-in-devon/" };
const ciderMaking = { title: "Researching Food History · Cider making in Devonshire, 1850", url: "http://researchingfoodhistory.blogspot.com/2019/12/cider-making-in-devonshire-1850.html" };

const oysters = { title: "The Victorian Web · Oysters in Victorian London", url: "https://victorianweb.org/history/london/oysters.html" };
const oysterCrisis = { title: "The Daily Economy · Victorian London's oyster crisis", url: "https://thedailyeconomy.org/article/victorian-londons-oyster-crisis/" };
const oysterHistory = { title: "Simply Oysters · Oyster history", url: "https://simplyoysters.com/oyster-history" };

const forthUnesco = { title: "UNESCO UK · The Forth Bridge", url: "https://unesco.org.uk/our-network/world-heritage-sites/the-forth-bridge" };
const forthHes = { title: "Historic Environment Scotland · The Forth Bridge", url: "https://www.historicenvironment.scot/advice-and-support/listing-scheduling-and-designations/world-heritage-sites/forth-bridge/" };
const forthBlog = { title: "Historic Environment Scotland · Building the Forth Bridge", url: "https://blog.historicenvironment.scot/2017/03/forth-bridge/" };

// Re-sourced in this Stage C pass, as section 4.15 of the research asked.
const lgoc = { title: "Wikipedia · The London General Omnibus Company", url: "https://en.wikipedia.org/wiki/London_General_Omnibus_Company" };
const busesRed = { title: "London Transport Museum · Why are London buses red?", url: "https://www.ltmuseum.co.uk/collections/stories/transport/why-are-london-buses-red" };
const motorBus = { title: "London Transport Museum · The motor bus revolution, 1900-1914", url: "https://www.ltmuseum.co.uk/collections/stories/transport/motor-bus-revolution-1900-1914" };
const hansom = { title: "Wikipedia · The hansom cab", url: "https://en.wikipedia.org/wiki/Hansom_cab" };
const hansomJoseph = { title: "Historic UK · Joseph Hansom and the hansom cab", url: "https://www.historic-uk.com/HistoryUK/HistoryofBritain/Joseph-Hansom-the-Hansom-Cab/" };
const postBox = { title: "Wikipedia · The post box", url: "https://en.wikipedia.org/wiki/Post_box" };
const penfold = { title: "Letter Box Study Group · P is for Penfold", url: "https://lbsg.org/testimonial/p-penfold/" };
const johnPenfold = { title: "Wikipedia · John Wornham Penfold", url: "https://en.wikipedia.org/wiki/John_Penfold" };

const westminster = { title: "Wikipedia · The Palace of Westminster", url: "https://en.wikipedia.org/wiki/Palace_of_Westminster" };
const bigBenTower = { title: "Wikipedia · The Elizabeth Tower and Big Ben", url: "https://en.wikipedia.org/wiki/Big_Ben" };
const towerBridgeSrc = { title: "Wikipedia · Tower Bridge", url: "https://en.wikipedia.org/wiki/Tower_Bridge" };

const puffPastry = { title: "Wikipedia · Puff pastry", url: "https://en.wikipedia.org/wiki/Puff_pastry" };
const hotWaterCrust = { title: "Wikipedia · Hot water crust pastry", url: "https://en.wikipedia.org/wiki/Hot_water_crust_pastry" };
const duxelles = { title: "Wikipedia · Duxelles", url: "https://en.wikipedia.org/wiki/Duxelles" };
const beefWellington = { title: "Wikipedia · Beef Wellington", url: "https://en.wikipedia.org/wiki/Beef_Wellington" };

/** One or more sources for every object that makes a historical or specialist claim. All twenty-nine
 *  Britain objects carry an entry; no object in this area is left without one. */
export const LONDON_SOURCES: Record<string, { title: string; url: string }[]> = {
  // the thirteen rooms
  roastPub: [yorkshirePudding, glasse, sundayRoast, beerhouseAct, ginPalaces, ginPalaceYale, frozenMeat, strathleven, dunedin],
  teaRoomUk: [abc, abcShops, lyons, lyonsPlaque, willow, mackintosh],
  boroughUk: [borough, boroughMuseum, boroughHistory, billingsgate, horaceJones],
  pieMashUk: [manze, oldestPieShop, manzeFacts, jelliedEelsMuseum, jelliedEels, eelPieShops, loughNeagh],
  chippyUk: [chipShop, historicUkChips, londonistChips, jewishEastEnd, mossley],
  breakfastUk: [coffeeStalls, mayhew, beeton, rowntree, rowntreeSociety, fullEnglish],
  lascarUk: [hindoostane, southAsianBritain, deanMahomed, banglatown, lascarLegacy, veeraswamy],
  hopKitchenUk: [hopPicking, kentHops, hopperHut, oastHistory, fuggleGolding, hopMedical],
  dairyUk: [hawes, wensleydaleCreamery, wensleydaleStory, swaledale],
  pastyUk: [pastyHistoric, pastyCornwall, pasty1746, miningWhs, cornishMining],
  cocklesUk: [penclawdd, cockleStalls, cockleIndustry, cockleWomen, welshCuisine],
  smokehouseUk: [smokie, smokiePgi, finnan, finnanCourier],
  distilleryUk: [doig, doigAcademy, doigPagoda, dailuaine],

  // the ten ingredient and flavour stops
  pastryCe: [puffPastry, hotWaterCrust, duxelles],
  oystersUk: [oysters, oysterCrisis, oysterHistory],
  hopsUk: [kentHops, oastsKent, oastHistory, fuggleGolding],
  mushroomsCe: [duxelles, beefWellington],
  sheepUk: [swaledale, swaledaleBreed],
  rhubarbUk: [rhubarbTriangle, forcedRhubarb, rhubarbCandle],
  orchardUk: [kingstonBlack, yarlington, dabinett, ciderWages, ciderMaking],
  leeksUk: [welshLeek, welshEats, welshCuisine],
  oatsUk: [johnsonOats, brose, oatcake],
  herringUk: [herringBoom, herringLassies, herripedia, herringIndustry],

  // the six landmarks
  bigBen: [westminster, bigBenTower],
  towerBridge: [towerBridgeSrc, billingsgate],
  redBus: [lgoc, busesRed, motorBus, hansom, hansomJoseph],
  phoneBox: [postBox, penfold, johnPenfold],
  forthBridge: [forthUnesco, forthHes, forthBlog],
  engineHouseUk: [miningWhs, cornishMining, miningBlog],
};

/** Clothing, architecture and period reading behind the area, kept here so the Builder can find it. */
export const LONDON_BACKGROUND_SOURCES: { title: string; url: string }[] = [
  { title: "Vintage Dancer · 1910s working-class men's clothing", url: "https://vintagedancer.com/1900s/1910s-mens-working-class-clothing/" },
  { title: "Grand Boudoir · Victorian working-class clothing", url: "https://www.grandboudoir.art/victorian-working-class-clothing/" },
  herripedia,
  herringBoom,
  hopPicking,
];
