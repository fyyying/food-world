/** What each British kitchen cooks: the hero first, then the dishes the place is known for. Owned by the Researcher. */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };

export const LONDON_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  // UK01 The public house, Borough High Street. One roast a week, and everything else the counter sold beside it.
  roastPub: [
    { name: "Roast beef and Yorkshire pudding", zh: "The Sunday joint", line: "A sirloin roasted on the bone, carved across the grain, with batter baked flat in the dripping beneath it." },
    { name: "Steak and kidney pudding", zh: "Suet crust", line: "Beef and kidney sealed inside a suet crust and steamed for hours until the gravy turns dark and sticky." },
    { name: "Bread, cheese and pickled onions", zh: "The bar lunch", line: "The cheapest thing on this counter: a wedge of Cheddar, a hunk of bread and a hard pickled onion." },
    { name: "Boiled beef and carrots", zh: "Salt beef", line: "Brisket salted for a week, boiled slowly with carrots and onions, and eaten with the broth it made." },
    { name: "Pork pie", zh: "Raised crust", line: "Chopped pork in a hot-water crust raised by hand, jellied from the bones, eaten cold with mustard." },
    { name: "Toad in the hole", zh: "Batter and sausage", line: "Sausages baked into the same batter as the pudding, a way of making a little meat feed a table." },
    { name: "Beef Wellington", zh: "Fillet in pastry", line: "Fillet seared, spread with mushroom duxelles and baked in pastry; no book names it before the twentieth century." },
    { name: "Bitter", zh: "Drawn by hand", line: "Kentish hops and pale malt, drawn up by hand pump into a straight glass, cellar-cool and flat." },
  ],

  // UK02 The tea room. A public room a woman could sit in alone, and the plain food that went with it.
  teaRoomUk: [
    { name: "A pot of tea", zh: "Loose leaf, warmed pot", line: "Indian and Ceylon leaf brewed in a china pot, poured through a strainer, with milk and sugar to hand." },
    { name: "Bread and butter", zh: "Thin cut", line: "White bread cut thin, buttered and quartered, the plainest thing here and the test of the kitchen." },
    { name: "Scones with butter and jam", zh: "Plain scones", line: "Warm plain scones split and buttered, with jam beside them, baked in small batches through the afternoon." },
    { name: "Madeira cake", zh: "Seed and Madeira", line: "A close, buttery cake flavoured with lemon peel, cut in slices and sold by the plate." },
    { name: "Bath bun", zh: "Sugared bun", line: "A rich yeasted bun with candied peel and crushed sugar on top, older than this room by a century." },
    { name: "Shortbread", zh: "Scots shortbread", line: "Butter, sugar and flour pressed into a round, notched at the edge and baked pale, from the Glasgow rooms." },
    { name: "Victoria sandwich", zh: "Sponge and jam", line: "Two rounds of sponge with jam between them, named for the Queen who took hers with afternoon tea." },
  ],

  // UK03 The market at dawn. What the stalls sell, and what the porters eat standing between barrows.
  boroughUk: [
    { name: "Cheddar from the truckle", zh: "Cloth-bound", line: "A cloth-bound wheel cut with a wire; the working man's dinner, sold by weight off the same board for centuries." },
    { name: "Boiled bacon and pease pudding", zh: "Off the stall", line: "Cured bacon boiled with a cloth of split peas and eaten hot off the stall by the porters." },
    { name: "Oysters and stout", zh: "Natives by the barrel", line: "Opened on the barrel head and swallowed with a glass of stout, still the cheapest thing on the row." },
    { name: "A brace of game", zh: "Hung game", line: "Pheasant, partridge and hare hung by the feet until the flesh gives, then sold to whoever can cook them." },
    { name: "Muffins and crumpets", zh: "The muffin man", line: "Yeasted rounds cooked on a griddle, carried through the streets under a cloth on a wooden tray." },
    { name: "Baked potato from the can", zh: "The potato can", line: "A charcoal can on wheels sold hot baked potatoes with salt and butter to anyone standing in the cold." },
    { name: "Farm butter off the slab", zh: "Worked with pats", line: "Farm butter salted, worked into shape with ribbed wooden pats and cut to weight off a cold marble slab." },
  ],

  // UK04 The pie and mash shop. Three things and the eels they were built on; the menu has never been longer.
  pieMashUk: [
    { name: "Pie, mash and liquor", zh: "Two and two", line: "A minced beef pie, a swipe of mashed potato and a ladle of green parsley sauce made with eel stock." },
    { name: "Stewed eels", zh: "Hot, in their stock", line: "Eel cut into rings and simmered in its own stock, served hot with the liquor poured over it." },
    { name: "Jellied eels", zh: "Set cold", line: "The same eel left to set in its own cooling stock until the jelly holds the rings in place." },
    { name: "Eel pie", zh: "The older pie", line: "The shop's original: eel, not beef, baked under a crust, which is where the trade's name came from." },
    { name: "Chilli vinegar", zh: "On the table", line: "Vinegar steeped with dried chillies, kept in a bottle on the marble and shaken over everything on the plate." },
  ],

  // UK05 The fried fish shop in a mill town. Two trades that met around 1860 and never separated again.
  chippyUk: [
    { name: "Fried fish and chips", zh: "Fish and a penn'orth", line: "Haddock in flour-and-water batter fried in beef dripping, with hand-cut chips, salt, vinegar and newspaper." },
    { name: "Scraps", zh: "Bits", line: "The loose batter skimmed off the fat, given away or sold for a farthing in a bag of its own." },
    { name: "Fish cake", zh: "Two slices of fish", line: "Two thin slices of fish with potato between them, battered and fried as one, for people counting pennies." },
    { name: "Mushy peas", zh: "Marrowfat", line: "Dried marrowfat peas soaked overnight with soda and boiled to a green mash, ladled beside the fish." },
    { name: "Pie and peas", zh: "Pie and peas", line: "A meat pie under a ladle of the same peas, the other thing a northern fried fish shop sold." },
    { name: "Cold fried fish", zh: "Sabbath fish", line: "Fish fried in batter and eaten cold the next day, the Jewish East End dish that started the whole trade." },
  ],

  // UK06 The coffee stall outside the fish market at four in the morning. Food handed over a board.
  breakfastUk: [
    { name: "Bacon, bread and tea", zh: "Off the board", line: "Back rashers curled on the griddle, thick bread and butter, and a tin mug of tea dark as a bootlace." },
    { name: "Black pudding", zh: "Blood and oats", line: "Pig's blood, fat and oatmeal in a skin, cut into discs and fried until the outside crisps." },
    { name: "Fried bread", zh: "In the bacon fat", line: "Bread laid in the fat the bacon left and turned once, which is where the fat and the bread both went." },
    { name: "A fried egg", zh: "If you could pay", line: "An egg broken into the same fat, ordered by the men who had had a good week." },
    { name: "Saveloy and pease pudding", zh: "Saveloy", line: "A smoked red sausage boiled and handed over with a spoon of split-pea pudding, eaten standing in the cold." },
    { name: "Coffee", zh: "The stall's own", line: "Chicory as much as coffee, boiled in a tin urn, sweet and hot, and the reason the stall exists." },
  ],

  // UK07 The seamen's kitchen in a Shadwell boarding house. Sylheti and Chittagonian cooks, forty years before the restaurants.
  lascarUk: [
    { name: "Fish curry and rice", zh: "মাছের ঝোল ভাত", line: "Market fish simmered with ground turmeric, chilli and mustard, eaten with plain boiled rice by men off one ship." },
    { name: "Lentils", zh: "ডাল", line: "Split lentils boiled soft and finished with onion and whole spices fried in fat, the cheapest pot on the fire." },
    { name: "Spiced potato", zh: "আলুর তরকারি", line: "Potatoes cooked down with onion, turmeric and green chilli, the dish that stretches when another man arrives." },
    { name: "Flatbread", zh: "রুটি", line: "Flour and water rolled thin and cooked dry on a griddle, turned by hand, made fresh at every meal." },
    { name: "Dried fish curry", zh: "শুঁটকি", line: "Dried fish from the same market, soaked and cooked hard with chilli, and it announces itself down the street." },
    { name: "Ship's curry", zh: "The galley pot", line: "The same cooking done at sea for a crew of forty, which is how these spices crossed to London at all." },
  ],

  // UK08 The hop-pickers' cookhouse in Kent, September. A town family cooking outdoors for six weeks.
  hopKitchenUk: [
    { name: "Mutton stew over the fire", zh: "The hop-pickers' pot", line: "Neck of mutton, potato, onion and barley in an iron pot on a chain, cooked all day beside the bin." },
    { name: "Bacon on a toasting fork", zh: "Over the flame", line: "A rasher held over the faggot fire on a fork until it curls, eaten on bread with the fat run in." },
    { name: "Bread and cheese", zh: "Cut at the bin", line: "A loaf cut on an upturned crate with a clasp knife, eaten where the picking stops for ten minutes." },
    { name: "Smoked kettle tea", zh: "Boiled on the fire", line: "Tea boiled in a kettle on the same fire and drunk out of enamel, always tasting faintly of wood smoke." },
    { name: "Apple pudding", zh: "Windfalls", line: "Windfall apples from the orchard at the end of the row, boiled in a cloth with suet and eaten hot." },
    { name: "Beer from the stone jar", zh: "The farm's own", line: "Beer brewed from the hops in this garden, fetched from the farm and passed round when the measurer has gone." },
  ],

  // UK09 The dale dairy. A cold room: curd, cloth, press and patience, and what the farm does with the whey.
  dairyUk: [
    { name: "Wensleydale", zh: "Farmhouse Wensleydale", line: "Cow's milk set, cut, drained, lightly pressed and eaten young, so it crumbles instead of slicing." },
    { name: "Wensleydale with fruit cake", zh: "The dale's pairing", line: "A crumbling white wedge beside dark fruit cake, or laid on hot apple pie until it slumps." },
    { name: "Fresh curd", zh: "Before the press", line: "Curd taken from the vat before it goes under the screw, salted and eaten the same day with bread." },
    { name: "Whey", zh: "For the pigs and the house", line: "What runs off the press: the pigs get most of it and the house drinks the first pail warm." },
    { name: "Cloth-bound Cheddar", zh: "The travelling cheese", line: "Bandaged in muslin and larded so it can breathe and travel, which is how the south's cheese reached London." },
    { name: "Toasted cheese", zh: "Rarebit", line: "Cheese melted with mustard and ale and poured over toast, which is what a cheese room does with its ends." },
  ],

  // UK10 The Cornish bakehouse. A dinner with a handle, and what else the oven was lit for.
  pastyUk: [
    { name: "The pasty", zh: "Pasti", line: "Beef skirt, potato, swede and onion, put in raw, folded in shortcrust and crimped along the side." },
    { name: "Sweet-ended pasty", zh: "Two dinners in one", line: "Meat at one end and apple or jam at the other, divided inside, so a man carried his pudding too." },
    { name: "Hevva cake", zh: "Heavy cake", line: "A flat currant cake scored in a net pattern, baked when the huer called the pilchard shoals ashore." },
    { name: "Saffron bun", zh: "Tea treat bun", line: "Yeasted dough coloured and scented with saffron and studded with currants, baked for chapel outings and fairs." },
    { name: "Star-gazy pie", zh: "Pilchards looking up", line: "Whole pilchards baked under a crust with their heads through it, so the oil runs back into the fish." },
    { name: "Cornish split", zh: "Thunder and lightning", line: "A soft white roll split and spread with clotted cream and black treacle, which is what the name means." },
  ],

  // UK11 The cockle sands and the stall on the shore. Women's work at low water, sold eight miles away.
  cocklesUk: [
    { name: "Cockles by the pint", zh: "Cocos", line: "Boiled, riddled clear of sand and measured into a paper cone, eaten with vinegar and pepper on the shore." },
    { name: "Cockles, laverbread and bacon", zh: "Bara lawr a chocos", line: "Laver boiled dark, rolled in oatmeal, fried in bacon fat with cockles, and eaten for breakfast in Swansea." },
    { name: "Laverbread", zh: "Bara lawr", line: "Laver seaweed boiled for hours to a dark purée, sold by the ladle out of a black dish." },
    { name: "Welsh cakes", zh: "Picau ar y maen", line: "Spiced currant rounds cooked on a flat iron bakestone and dusted with sugar, eaten warm from the stone." },
    { name: "Cawl", zh: "Cawl", line: "Lamb or bacon boiled with leek, swede and potato in one pot and eaten in two courses." },
    { name: "Bara brith", zh: "Bara brith", line: "Dried fruit soaked overnight in tea and baked into a dark loaf, cut thin and buttered." },
  ],

  // UK12 The curing yard above the harbour. A fire in a hole in the ground, and the smoked fish of three coasts.
  smokehouseUk: [
    { name: "Arbroath smokie", zh: "Smokie", line: "Haddock salted, tied in pairs and hot-smoked over a hardwood fire in a sunken barrel until copper-skinned." },
    { name: "Finnan haddock", zh: "Finnan haddie", line: "Split haddock cold-smoked pale and yellow at Findon, poached in milk, and older than the smokie beside it." },
    { name: "Cullen skink", zh: "Skink", line: "Smoked haddock, potato and onion simmered in milk into a thick soup, from the Moray Firth coast." },
    { name: "Kippers", zh: "Split and cold-smoked", line: "Herring split down the back, brined and cold-smoked, so unlike the smokie it still needs cooking." },
    { name: "Smoked salmon", zh: "The London cure", line: "Salmon cured in salt and cold-smoked over oak, a trade the East End built around Scottish fish." },
    { name: "Bloater", zh: "Yarmouth bloater", line: "Herring smoked whole and ungutted, so it keeps its own oil and its own taste of the gut." },
  ],

  // UK13 The Speyside distillery. Barley, peat, burn water and copper, and what the men ate on the shift.
  distilleryUk: [
    { name: "Single malt whisky", zh: "Uisge beatha", line: "Malted barley dried over peat, mashed with burn water, distilled twice in copper and left in oak for years." },
    { name: "New make spirit", zh: "Clearic", line: "The spirit straight off the still, clear and fierce, tasted by the men who made it and nobody else." },
    { name: "Oatcakes and cheese", zh: "Girdle oatcakes", line: "Oatmeal and hot fat pressed thin and baked on a girdle, what the maltmen ate through a night shift." },
    { name: "Haggis with neeps and tatties", zh: "Haggis", line: "Sheep's pluck minced with oatmeal, suet and pepper, boiled in a paunch and eaten with turnip and potato." },
    { name: "Atholl brose", zh: "Atholl brose", line: "Oatmeal steeped in water and strained, mixed with honey, cream and whisky, and drunk rather than eaten." },
    { name: "Shortbread", zh: "Shortbread", line: "Butter, sugar and flour, baked pale in a notched round, and the thing every distillery office kept in a tin." },
  ],
};
