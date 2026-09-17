/** What each Italian kitchen cooks: the hero first, then the dishes the place is known for. Owned by the Researcher. */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };

export const ITALY_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  // IT01 The trattoria at Testaccio, under the slaughterhouse wall. The fifth quarter, and the white dishes that came before tomato.
  ragu: [
    { name: "Oxtail stew", zh: "Coda alla vaccinara", line: "Oxtail from the Testaccio yards stewed for hours with celery, tomato and a little chocolate, the hide-strippers' own dish." },
    { name: "Cheese and pepper pasta", zh: "Cacio e pepe", line: "Pecorino and black pepper worked into the starchy pasta water until the sauce turns creamy without any cream." },
    { name: "Guanciale and pecorino pasta", zh: "Pasta alla gricia", line: "Cured pig cheek rendered in its own fat with pecorino and pepper, the white dish the red one grew out of." },
    { name: "Bucatini with tomato and guanciale", zh: "Bucatini all'amatriciana", line: "The gricia with tomato added, brought to Rome by cooks from Amatrice, a town that stayed in Abruzzo until 1927." },
    { name: "Tripe, Roman style", zh: "Trippa alla romana", line: "Tripe simmered in tomato with wild mint and a heavy fall of grated pecorino, eaten in Rome on Saturdays." },
    { name: "Veal with sage and ham", zh: "Saltimbocca alla romana", line: "Veal, prosciutto and a sage leaf pinned together and fried in butter; Artusi ate it in a trattoria off Campo Marzio." },
    { name: "Meatballs in sauce", zh: "Polpette al sugo", line: "Beef and pork minced with bread soaked in milk, rolled, browned and then finished in the pot of sauce.", recipe: "dcaf5663-73ad-44c2-90fa-f4b4e66f7ccb" },
    { name: "Carbonara", zh: "Carbonara", line: "Roman now, but unrecorded before a Chicago guide of 1952 and La Cucina Italiana in 1954: younger than this room." },
  ],

  // IT02 The market on Campo de' Fiori, where it moved in 1869. Vegetables first; Rome's cooking starts here.
  romeMarket: [
    { name: "Braised artichokes", zh: "Carciofi alla romana", line: "The flat cimarolo head trimmed round, stuffed with wild mint and garlic and braised upside down in oil and water." },
    { name: "Twice-fried artichokes", zh: "Carciofi alla giudia", line: "The same head opened out like a flower and fried twice in deep oil until every leaf snaps: the Ghetto's dish." },
    { name: "Chicory shoots with anchovy", zh: "Puntarelle alla romana", line: "Catalogna shoots split into curls in cold water and dressed with pounded anchovy, garlic and vinegar, a winter salad." },
    { name: "Fried courgette flowers", zh: "Fiori di zucca fritti", line: "Courgette flowers filled with mozzarella and a salted anchovy, dipped in thin batter and fried, sold here by the bunch." },
    { name: "Romanesco broccoli", zh: "Broccolo romanesco", line: "The pale green spiralled head grown out in the Agro Romano, boiled first and then fried again with garlic and chilli." },
    { name: "Sheep's milk ricotta", zh: "Ricotta romana", line: "Whey heated a second time until it flowers, carried in from the Campagna dairies in a drained rush basket." },
    { name: "Tomato and mozzarella salad", zh: "Insalata caprese", line: "Tomato, mozzarella and basil laid out raw; a Capri dish of the nineteen-twenties, later than this piazza's stalls.", recipe: "cd1604b8-c6c0-4dcd-9617-2864f9254a6a" },
  ],

  // IT03 The pasta kitchen behind the piazza: a board, a long pin, and the dried maccheroni that comes up by rail.
  pasta: [
    { name: "Fettuccine", zh: "Fettuccine", line: "A sheet of soft-wheat dough rolled thin with a long pin, folded over and cut into ribbons, cooked the same day." },
    { name: "Guitar-cut strings", zh: "Tonnarelli", line: "Square strings cut by pressing the sheet through strung wires, thicker than fettuccine and the Roman shape for cheese." },
    { name: "Tagliatelle with meat sauce", zh: "Tagliatelle al ragù", line: "Emilian, and in Artusi's book of 1891: minced beef and pork cooked down slowly with soffritto, wine and milk.", recipe: "21f95c6d-26b4-80c6-be51-f243d32c5dd0" },
    { name: "Baked pasta sheets", zh: "Lasagne", line: "Sheets of the same dough layered with meat sauce and béchamel and baked until the top corners go dark.", recipe: "10295c6d-26b4-808b-b97d-cd41d79c4390" },
    { name: "Pasta with porcini", zh: "Pasta ai funghi", line: "Porcini gathered under the chestnuts and sliced into butter and cream, the autumn sauce this board is rolled for.", recipe: "d939789d-5a4a-4951-bff3-cec4eaa334f5" },
    { name: "Semolina gnocchi", zh: "Gnocchi alla romana", line: "Semolina cooked thick in milk, spread out to set, cut into discs with a glass and baked under butter and cheese." },
    { name: "Spaghetti with tomato", zh: "Spaghetti al pomodoro", line: "Cavalcanti put vermicelli with tomato into his Neapolitan book in 1837; the sauce was a young idea even then." },
    { name: "Dried maccheroni", zh: "Maccheroni di Gragnano", line: "Durum pasta from the Campanian towns whose main streets were laid out wide to catch the sea wind for drying." },
  ],

  // IT04 The forno: one wood oven, bread for the week, and the flat dough it is tested with.
  oven: [
    { name: "White pizza", zh: "Pizza bianca romana", line: "A long sheet of dough pulled thin, oiled and salted and baked straight on the oven floor, eaten hot in the hand." },
    { name: "Roman household loaf", zh: "Pane casareccio", line: "A big round soft-wheat loaf with a thick dark crust, baked once a week and cut from all week after." },
    { name: "Red pizza", zh: "Pizza rossa", line: "The same sheet under crushed tomato and oil, cut with shears and sold by weight over the counter." },
    { name: "Neapolitan pizza", zh: "Pizza napoletana", line: "Naples' round pizza of tomato, mozzarella and basil; the 1889 queen's letter is one historians read as a forgery.", recipe: "b7db0c08-7be9-4d6f-a21e-419e6bc5fef2" },
    { name: "Cream bun", zh: "Maritozzo", line: "A soft sweet bun split along its back and filled with whipped cream, eaten standing at the counter for breakfast." },
    { name: "Ricotta tart", zh: "Crostata di ricotta", line: "A lattice tart of sheep's ricotta with sour cherries or candied peel, baked in the oven as it cools." },
    { name: "Roast suckling pig", zh: "Porchetta di Ariccia", line: "A whole pig boned, rolled round rosemary, garlic and pepper and roasted all night in a bread oven in the hills." },
  ],

  // IT05 The casale in the Agro Romano: the fold, the press and the vat, and what the farm eats.
  cheese: [
    { name: "Roman pecorino", zh: "Pecorino romano", line: "Sheep's milk pressed and dry-salted by hand over months; by 1900 most of it was already being made in Sardinia." },
    { name: "Sheep's milk ricotta", zh: "Ricotta romana", line: "The whey put back on the fire until it flowers, lifted off with a scoop and eaten the same day with bread." },
    { name: "Young farm cheese", zh: "Caciotta romana", line: "A small soft wheel eaten within weeks, the cheese the farm keeps back rather than sending into the city." },
    { name: "Sabina olive oil", zh: "Olio della Sabina", line: "Olives from the hills above the Tiber crushed under a stone wheel; the oil goes raw over nearly everything here." },
    { name: "Castelli white wine", zh: "Vino dei Castelli", line: "White wine from the volcanic hills, racked in March and carted into Rome by night in fifty-litre barrels." },
    { name: "Roast milk-fed lamb", zh: "Abbacchio al forno", line: "A lamb from the fold roasted with potatoes, rosemary and garlic, which is what Easter means on this farm." },
    { name: "Broad beans and pecorino", zh: "Fave e pecorino", line: "Raw broad beans podded at the table beside a lump of young sheep's cheese, on the first of May." },
  ],

  // IT06 The Pescaria at the Rialto, first light. Everything in it came out of the lagoon or off the Adriatic boats.
  seafood: [
    { name: "Sweet-and-sour sardines", zh: "Sarde in saor", line: "Fried sardines layered with onions cooked soft in vinegar, with raisins and pine nuts; Boerio's dictionary has the word in 1867." },
    { name: "Soft-shell crabs", zh: "Moeche", line: "Green crabs taken in the few days they have shed their shells, floured whole and fried, eaten shell and all." },
    { name: "Cuttlefish in ink", zh: "Seppie in nero", line: "Cuttlefish cooked in their own ink until the sauce goes black, spooned over a slab of white polenta." },
    { name: "Wholemeal strings with onion", zh: "Bigoli in salsa", line: "Thick strings pressed through a bronze bigolaro, dressed with onions melted into salted sardines, for fast days." },
    { name: "Spider crab", zh: "Granseola", line: "The lagoon's spider crab boiled, picked clean and put back into its own shell with oil and lemon." },
    { name: "Grey shrimps with polenta", zh: "Schie con polenta", line: "Tiny grey lagoon shrimps boiled and piled on soft white polenta, the smallest thing this market sells." },
    { name: "Stewed eel", zh: "Bisato in tecia", line: "Eel from the lagoon valli or from Comacchio cut into lengths and stewed slowly with tomato and bay." },
  ],

  // IT07 The osteria: a graded wine house with a counter. A half glass standing up, and what is salty enough to go with it.
  bacaro: [
    { name: "Whipped salt cod", zh: "Bacalà mantecà", line: "Stockfish soaked for days and then beaten with oil until it whitens into a cream, spread on grilled polenta." },
    { name: "A half glass at the counter", zh: "Ombra", line: "Half a quarter-litre drawn from the cask and drunk standing for ten centesimi, as writers of 1910 and 1928 record." },
    { name: "Sweet-and-sour sardines", zh: "Sarde in saor", line: "The market's sardines kept under their vinegared onions in a dish on the counter, better on the second day." },
    { name: "Boiled baby octopus", zh: "Folpeti", line: "Small octopus boiled whole and dressed with oil, parsley and lemon, taken off the plate with the fingers." },
    { name: "Calf's knuckle salad", zh: "Nervetti", line: "Boiled knuckle cut into strips with onion, oil and vinegar: cheap, cold, and exactly what the wine wants." },
    { name: "Pork sausage with horseradish", zh: "Musetto e cren", line: "A boiled sausage made from the snout and rind, cut in thick slices with grated horseradish beside it." },
    { name: "Egg and anchovy", zh: "Ovo e acciuga", line: "Half a hard-boiled egg with a salted anchovy laid across it, the plainest thing on the counter." },
    { name: "Wine with soda and lemon", zh: "Scorzeta", line: "Half an ombra of white wine with carbonated water and a twist of lemon peel, an early spritz." },
  ],

  // IT08 The fisherman's kitchen on Burano. The lagoon is not the sea and does not cook like it.
  lagunaIt: [
    { name: "Goby risotto", zh: "Risoto de gò", line: "Lagoon goby simmered to a broth, pressed through a cloth and cooked into rice until it runs on the plate." },
    { name: "Soft-shell crabs", zh: "Moeche", line: "Held in floating cages by the moecanti until they moult, then dipped in egg and fried the same morning." },
    { name: "First-cut artichokes", zh: "Castraure", line: "The first purple head cut from each plant on Sant'Erasmo so the others grow, eaten raw in slices with oil." },
    { name: "Eel baked on bay", zh: "Bisato sull'ara", line: "Eel coiled on a bed of bay leaves and baked in the cooling glass furnaces of Murano, a Christmas dish." },
    { name: "White polenta", zh: "Polenta bianca", line: "White maize ground on the islands, stirred long and poured onto a board: the plate every fish here sits on." },
    { name: "Ring biscuits", zh: "Bussolà buranelo", line: "Butter, egg yolk and sugar baked hard into a ring, made to keep for days in a boat." },
  ],

  // IT09 The farm kitchen on the terraferma: a copper over the fire and maize in everything.
  casaVeneta: [
    { name: "Polenta", zh: "Polenta", line: "Maize stirred for an hour in a copper paiolo over the fire and turned out onto a board: the daily bread." },
    { name: "Rice and peas", zh: "Risi e bisi", line: "Rice and the first peas cooked loose enough to eat with a spoon; by tradition the doge's dish on Saint Mark's day." },
    { name: "Bean and pasta soup", zh: "Pasta e fasoi", line: "Borlotti beans cooked down thick with a pork bone and a handful of broken pasta thrown in at the end." },
    { name: "Liver with onions", zh: "Figà a la venessiana", line: "Calf's liver cut very fine into onions melted slowly in oil; Leonardi printed almost this recipe in 1807." },
    { name: "Stockfish, Vicenza style", zh: "Bacalà alla vicentina", line: "Stockfish stewed for hours in milk, onion and oil until it falls apart, and eaten with white polenta." },
    { name: "Forced red chicory", zh: "Radicio de Treviso", line: "Long red chicory blanched in spring water through the winter, then split and grilled over the embers." },
    { name: "Pressed salami", zh: "Sopressa", line: "A soft fat salami pressed flat and cured through the winter, cut thick onto the polenta board." },
  ],

  // IT10 The friggitoria in the Albergheria. One pan of lard, and everything Palermo eats standing up.
  friggitoria: [
    { name: "Spleen roll", zh: "Pani ca meusa", line: "Calf's spleen and lung boiled, sliced and finished in lard, packed into a soft roll with lemon or with cheese." },
    { name: "Chickpea fritters", zh: "Panelle", line: "Chickpea flour cooked to a paste, spread thin on a marble slab, cut in squares and fried, then folded into bread." },
    { name: "Potato croquettes", zh: "Cazzilli", line: "Mashed potato worked with parsley and mint, rolled into fingers and fried in the same pan as the panelle." },
    { name: "Palermo's flat bread", zh: "Sfincione", line: "A thick spongy square under onions, anchovy, tomato and breadcrumb, cut from a tray carried on a barrow." },
    { name: "Grilled offal skewers", zh: "Stigghiola", line: "Lamb or kid gut wound round a spring onion and grilled over charcoal at the kerb, salted and cut up with shears." },
    { name: "Fried rice balls", zh: "Arancine", line: "Saffron rice moulded round meat sauce and peas, breaded and fried; a Sicilian dictionary of 1851 records the word." },
    { name: "Boiled tripe", zh: "Quarume", line: "Calf's tripe and innards boiled long with celery and onion and sold hot in a bowl from the same stall." },
  ],

  // IT11 Ballarò, under the awnings. The market is the kitchen: half of Palermo's dishes are cooked in it.
  sicilyMarket: [
    { name: "Pasta with sardines", zh: "Pasta chî sardi", line: "Fresh sardines, wild fennel off the hillsides, pine nuts, currants and saffron: the whole market on one plate." },
    { name: "Sweet-and-sour aubergine", zh: "Caponata", line: "Aubergine fried and stewed with celery, olives, capers and vinegar sweetened with sugar, eaten cold the next day." },
    { name: "Stuffed sardines", zh: "Sarde a beccafico", line: "Sardines boned, rolled round breadcrumbs, currants and pine nuts and baked in a row with bay leaves between them." },
    { name: "Swordfish with olives and capers", zh: "Pisci spata a ghiotta", line: "Swordfish cooked with tomato, olives, capers and celery, from the boats that harpoon it in the straits." },
    { name: "Snails with garlic", zh: "Babbaluci", line: "Small snails gathered after rain, cooked with oil and garlic and sucked out of the shell at the July feast." },
    { name: "Artichokes in the coals", zh: "Carciofi arrustuti", line: "Whole artichokes stood upright in the embers until the outer leaves char, then opened by hand and salted." },
    { name: "Fried cheese with vinegar", zh: "Cacio all'argentiera", line: "Sheep's cheese fried with oregano and vinegar, named in local tradition for a silversmith who made it smell like meat." },
  ],

  // IT12 The pasticceria: ricotta, almond and ice, and a calendar of feast days to sell them on.
  pastry: [
    { name: "Cannoli", zh: "Cannoli", line: "Fried tubes of dough filled with sweetened sheep's ricotta to order, because a filled shell goes soft by evening." },
    { name: "Cassata", zh: "Cassata siciliana", line: "Ricotta and sponge under green marzipan and candied fruit, a Carnival and Easter cake out of the convent kitchens." },
    { name: "Granita", zh: "Granita", line: "Ice flavoured with lemon, coffee, almond or mulberry, made from snow carried down off Etna the winter before." },
    { name: "Marzipan fruit", zh: "Frutta martorana", line: "Almond paste modelled and painted as fruit for the second of November, named after a convent in Palermo." },
    { name: "Watermelon pudding", zh: "Gelu di muluni", line: "Watermelon juice set with starch, scented with jasmine and scattered with chocolate and pistachio, a July sweet." },
    { name: "Almond milk", zh: "Latti di mènnula", line: "Avola Pizzuta almonds pounded with water and sugar and strained through a cloth, drunk cold all summer." },
    { name: "Almond blancmange", zh: "Biancomangiare", line: "Almond milk thickened with starch and turned out of a mould, the oldest sweet in the whole shop." },
    { name: "St Joseph's fritters", zh: "Sfinci di San Giuseppe", line: "Fried choux piled with ricotta, candied peel and pistachio and sold only around the nineteenth of March." },
  ],

  // IT13 The tonnara kitchen on the Egadi. One fish, and nothing of it thrown away.
  tonnaraIt: [
    { name: "Tuna in olive oil", zh: "Tunnina sutt'oghiu", line: "Tuna boiled, packed into tins and covered with olive oil at Favignana, which is how the Florio house sold it." },
    { name: "Pressed tuna roe", zh: "Bottarga di tonno", line: "The roe sac salted, pressed and dried to a hard amber block, then shaved over pasta or sliced with oil." },
    { name: "Cured tuna sausage", zh: "Ficazza", line: "The trimmings salted and cured in a casing like a salami, the part of the catch the crew keeps." },
    { name: "Tuna with celery and capers", zh: "Tunnu a stimpirata", line: "Tuna steaks cooked with celery, olives, capers and vinegar, sweet and sour like most fish on this coast." },
    { name: "Pasta with bottarga", zh: "Pasta câ bottarga", line: "Dried roe grated over oiled spaghetti with toasted breadcrumb and no cheese at all: the plainest way to eat it." },
    { name: "Fish couscous", zh: "Cùscusu di pisci", line: "Semolina rolled by hand and steamed over fish broth at Trapani, carried across from North Africa and kept." },
    { name: "Salted tuna milt", zh: "Lattume", line: "The milt of the male fish salted and dried, sliced thin with oil and lemon; nothing here is thrown away." },
  ],

  // IT14 The caffè and gelateria on the piazza, card only. Ice is the old trade; the machine on the counter is new.
  gelateria: [
    { name: "Gelato", zh: "Gelato", line: "Churned slower and served warmer than ice cream, so it tastes of what is in it rather than of cold." },
    { name: "Coffee granita", zh: "Granita di caffè", line: "Coffee frozen and scraped to a crystal, served in a glass under a spoonful of unsweetened whipped cream." },
    { name: "Espresso", zh: "Caffè espresso", line: "Moriondo patented a steam coffee machine in Turin in 1884; Bezzera's cup-by-cup machine followed in 1901." },
    { name: "Lemon sorbet", zh: "Sorbetto al limone", line: "Lemon juice and sugar frozen and worked by hand in a pail packed with ice and salt, the oldest thing here." },
    { name: "Marsala custard", zh: "Zabaione", line: "Egg yolk, sugar and Marsala whisked over heat until it stands up, and poured warm into a glass." },
  ],

  // IT15 The fry stall inside Ballarò, a child of the market. One barrow, three things, all of them fried.
  "stall-arancini": [
    { name: "Fried rice balls", zh: "Arancine", line: "Rice coloured with saffron, filled with meat sauce and peas, closed into a ball and fried; sold hot off the barrow." },
    { name: "Chickpea and potato fritters", zh: "Panelle e cazzilli", line: "Chickpea squares and potato fingers fried together and folded into a soft roll with salt and a squeeze of lemon." },
    { name: "Palermo's flat bread", zh: "Sfincione", line: "Thick oiled dough under onion, anchovy and breadcrumb, cut from the tray and carried away wrapped in paper." },
  ],
};
