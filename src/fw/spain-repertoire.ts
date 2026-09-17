/** What each Spanish kitchen cooks: the hero first, then the dishes the place is known for. Owned by the Researcher. */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };

export const SPAIN_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  // ES01 The rice fire, on the edge of the Albufera. One fire, many rices; the pan is the constant.
  paellaEs: [
    { name: "Valencian paella", zh: "Arròs a la valenciana", line: "Chicken, rabbit, flat beans and garrofó under rice one grain deep; this fire exists to cook it." },
    { name: "Eel and potato stew", zh: "All i pebre", line: "The Albufera's own dish: eel from the lagoon with potato, garlic and paprika, cooked in a shallow earthenware pan." },
    { name: "Baked rice", zh: "Arròs al forn", line: "Rice baked in an earthenware dish with chickpeas, potato slices and a whole head of garlic, from the day's leftover broth." },
    { name: "Rice with beans and turnips", zh: "Arròs amb fesols i naps", line: "The winter rice of the same kitchens, simmered with white beans, turnips, blood sausage and pork, and eaten from a bowl." },
    { name: "Rice cooked apart", zh: "Arròs a banda", line: "Rice cooked in fish stock and served on its own, with the fish it was made from brought out after." },
    { name: "Seafood paella", zh: "Paella de marisc", line: "The second pan at this fire: prawns, mussels and squid instead of the meat, cooked the same way, without stirring." },
    { name: "Black rice", zh: "Arròs negre", line: "Squid ink turns the whole pan black; it is served with allioli and belongs to the same coast and the same pan." },
  ],

  // ES02 The tapas bar under the Plaza Mayor arcade. A Madrid counter: a drink never arrives alone.
  plancha: [
    { name: "Patatas bravas", zh: "Patatas bravas", line: "Fried potato under a paprika and oil sauce, the plate that arrives first on this counter and is eaten standing." },
    { name: "Ham croquettes", zh: "Croquetas de jamón", line: "A thick béchamel with chopped ham, breaded and fried, which is why it runs the moment it is cut." },
    { name: "Griddled prawns", zh: "Gambas a la plancha", line: "Whole prawns straight onto the hot iron with salt and oil; the counter's griddle is what this object is named for." },
    { name: "Marinated anchovies", zh: "Boquerones en vinagre", line: "Fresh anchovy filleted and cured in vinegar, garlic and parsley, served cold in oil beside the vermouth." },
    { name: "Calamari roll", zh: "Bocadillo de calamares", line: "Rings of squid fried and packed into a bread roll, the sandwich Madrid eats on the Plaza Mayor." },
    { name: "Tripe, Madrid style", zh: "Callos a la madrileña", line: "Tripe simmered with chorizo, morcilla and paprika until the sauce turns sticky, the winter dish of this city's taverns." },
    { name: "Broken eggs", zh: "Huevos rotos", line: "Fried eggs broken over fried potatoes, sometimes with ham on top, eaten with a fork straight from the dish." },
  ],

  // ES03 The ham counter in the iron market hall. One animal, cut into the pieces the 2014 standard names.
  jamonEs: [
    { name: "Acorn-fed Iberian ham", zh: "Jamón ibérico de bellota", line: "The leg in the clamp: a pig fattened on acorns, salted and dried for years, cut against the grain." },
    { name: "Iberian shoulder", zh: "Paleta ibérica", line: "The front leg, smaller and cured for less time, cut from the same animal on the same stand." },
    { name: "Cured loin", zh: "Caña de lomo ibérico", line: "The whole loin rubbed with paprika and garlic and dried in a casing; the 2014 standard names it beside the hams." },
    { name: "Iberian salchichón", zh: "Salchichón ibérico", line: "Coarse pork and whole peppercorns cured in a casing, sliced thin onto the same board as the ham." },
    { name: "Iberian chorizo", zh: "Chorizo ibérico", line: "The same meat with pimentón worked through it, which is what makes it red rather than hot." },
  ],

  // ES04 The family kitchen. The tortilla is the hero, but this range cooks the whole week.
  tortillaEs: [
    { name: "Potato omelette", zh: "Tortilla de patatas", line: "Potato softened slowly in oil and set with two or three eggs, the dish that stretched a household's supper." },
    { name: "Madrid boiled dinner", zh: "Cocido madrileño", line: "Chickpeas, beef, ham bone and vegetables in one pot, served as broth first, then the chickpeas, then the meat." },
    { name: "Lentil stew", zh: "Lentejas", line: "Lentils with chorizo, onion and a bay leaf, the weekday pot that needs no watching and feeds everyone." },
    { name: "Croquettes from the cocido", zh: "Croquetas de cocido", line: "Yesterday's boiled meat chopped into béchamel, breaded and fried, which is where the leftovers of the pot go." },
    { name: "Meatballs in sauce", zh: "Albóndigas en salsa", line: "Pork and beef rolled small, fried and then finished in a sauce of onion, white wine and saffron." },
    { name: "Garlic chicken", zh: "Pollo al ajillo", line: "Chicken jointed small and fried hard with many cloves of garlic and a splash of white wine." },
    { name: "Garlic soup", zh: "Sopa de ajo", line: "Stale bread, garlic, paprika and water with an egg broken into it, the Castilian answer to an empty larder." },
    { name: "Torrijas", zh: "Torrijas", line: "Bread soaked in milk, fried and dressed with honey or sugar, made in this kitchen in Holy Week." },
  ],

  // ES05 The churrería off the square. Fried dough and thick chocolate; these shops were once called buñolerías.
  churrosEs: [
    { name: "Churros", zh: "Churros", line: "Ridged dough pushed through a star nozzle into hot oil, cut with scissors and sold by the dozen." },
    { name: "Porras", zh: "Porras", line: "The thick soft one, a different dough carrying a raising agent, fried in a ring and cut into lengths." },
    { name: "Drinking chocolate", zh: "Chocolate a la taza", line: "Chocolate thickened until a churro can stand up in it, which is the other half of what this shop sells." },
    { name: "Wind fritters", zh: "Buñuelos de viento", line: "Hollow fried puffs from the same oil, sold by these shops when they were still called buñolerías and at All Saints." },
  ],

  // ES06 The pintxo counter on the Cantabrian coast. Everything is built to be eaten standing, in two bites.
  pintxosEs: [
    { name: "Gilda", zh: "Gilda", line: "Green olive, salt-cured anchovy and a pickled guindilla on one stick, the skewer this counter is known by." },
    { name: "Mushroom skewer", zh: "Txanpiñoiak", line: "Mushroom caps griddled with garlic and parsley, stacked with a prawn on a stick and eaten in two bites." },
    { name: "Salt cod omelette", zh: "Bakailao tortilla", line: "Salt cod softened and folded into egg with onion and green pepper, then cut into squares for the counter." },
    { name: "Cod in pil-pil", zh: "Bakailaoa pil-pilean", line: "Salt cod cooked gently in oil and garlic until its own gelatine turns the oil into a sauce." },
    { name: "Txistorra", zh: "Txistorra", line: "A thin fast-cured sausage red with paprika, griddled and handed over in a piece of bread, hot." },
    { name: "Spider crab, San Sebastián style", zh: "Txangurroa donostiar erara", line: "Spider crab picked out, cooked with onion, tomato and brandy, and then baked back in its own shell." },
  ],

  // ES07 The courtyard kitchen in an Andalusian patio. Cold soups first, then what the same women fry and stew.
  gazpachoEs: [
    { name: "Gazpacho", zh: "Gazpacho andaluz", line: "Bread, oil, garlic, vinegar and tomato, pounded together and drunk cold in the shade of the patio." },
    { name: "Salmorejo", zh: "Salmorejo cordobés", line: "The thicker Cordoban one, bread and tomato only, finished with chopped egg and ham and eaten with a spoon." },
    { name: "Ajoblanco", zh: "Ajoblanco", line: "The older white soup from Málaga: almonds, garlic, bread and oil, served cold with grapes or melon." },
    { name: "Fried fish", zh: "Pescaíto frito", line: "Small fish turned in flour and dropped into very hot oil, eaten with the fingers as soon as it drains." },
    { name: "Spinach with chickpeas", zh: "Espinacas con garbanzos", line: "Spinach and chickpeas with cumin, paprika and fried bread, the Sevillian Lenten dish that is eaten all year." },
    { name: "Aubergine with cane syrup", zh: "Berenjenas con miel de caña", line: "Aubergine sliced, floured, fried and drizzled with dark cane syrup, a Cordoban plate that kept its Moorish sweetness." },
    { name: "Oxtail", zh: "Rabo de toro", line: "Oxtail braised for hours in red wine with carrot and onion until it comes away from the bone." },
  ],

  // ES08 The fair cauldron, inland Galicia. A pulpeira's pitch at a fair, a long way from the sea.
  pulpoEs: [
    { name: "Fair-style octopus", zh: "Polbo á feira", line: "Octopus boiled in a copper pot, cut with scissors onto wood and dressed with oil, coarse salt and paprika." },
    { name: "Cachelos", zh: "Cachelos", line: "Potatoes boiled in the same water as the octopus and laid under it, which is how the plate is built." },
    { name: "Padrón peppers", zh: "Pementos de Padrón", line: "Small green peppers from Herbón fried whole in oil and salted; some bite and most do not." },
    { name: "Galician pie", zh: "Empanada galega", line: "A flat pie of bread dough filled with tuna, cockles or pork and onion, cut into squares at the fair." },
    { name: "Zorza", zh: "Zorza", line: "Pork diced and left in paprika, garlic and wine, then fried; the same stall fries it beside the cauldron." },
    { name: "Galician broth", zh: "Caldo galego", line: "Potatoes, beans and turnip greens with a little pork fat, the bowl that starts a cold fair day." },
    { name: "Boiled pig's ear", zh: "Orella á feira", line: "Pig's ear boiled soft, cut up and dressed like the octopus with oil, salt and paprika." },
  ],

  // ES09 The bread terrace, Barcelona. The bread is the base and the rest of Catalonia goes on top of it.
  paTomaquet: [
    { name: "Bread with tomato", zh: "Pa amb tomàquet", line: "Country bread rubbed with a cut tomato, then oil, then salt, in that order and no other." },
    { name: "Escalivada", zh: "Escalivada", line: "Peppers, aubergine and onion roasted in the embers, peeled by hand and dressed with oil, laid over the bread." },
    { name: "Esqueixada", zh: "Esqueixada", line: "Salt cod torn raw into strips with tomato, onion and olives and dressed with oil, a summer plate." },
    { name: "Sausage with beans", zh: "Botifarra amb seques", line: "A fat white sausage grilled over coals, with dried white beans fried afterwards in the same fat." },
    { name: "Coca de recapte", zh: "Coca de recapte", line: "A long flat baked base with escalivada and sausage or anchovy on top, cut into pieces for the table." },
    { name: "Calçots with romesco", zh: "Calçots amb salvitxada", line: "Long spring onions charred black over vine clippings, pulled from their skins and dipped, from January to March." },
    { name: "Fuet", zh: "Fuet", line: "A thin dry-cured pork sausage from inland Catalonia, sliced onto the bread once the tomato and oil are on." },
  ],

  // ES10 The cheese farm on the Manchegan dry plain. The wheel is the hero; the rest is what the farm eats.
  manchegoEs: [
    { name: "Manchego cheese", zh: "Queso manchego", line: "Whole Manchega sheep's milk pressed in an esparto band and aged until the paste firms and the rind zig-zags." },
    { name: "Requesón", zh: "Requesón", line: "Made from the whey running off the draining table, eaten fresh the same day with honey or with salt." },
    { name: "Cheese in oil", zh: "Queso en aceite", line: "Cured wheels kept under olive oil through the winter, a farm's way of holding cheese before there was cold." },
    { name: "Migas", zh: "Migas manchegas", line: "Stale bread wetted, crumbled and fried in oil with garlic, peppers and pork, the shepherd's breakfast on the plain." },
    { name: "Gachas", zh: "Gachas manchegas", line: "A thick porridge of grass-pea flour fried with paprika and pork, eaten straight from the pan with bread." },
    { name: "Pisto", zh: "Pisto manchego", line: "Peppers, courgette, onion and tomato cooked down slowly in oil and finished with a fried egg in season." },
    { name: "Atascaburras", zh: "Atascaburras", line: "Salt cod, potato and garlic pounded to a paste with oil and topped with walnuts and egg, a winter dish." },
    { name: "Duelos y quebrantos", zh: "Duelos y quebrantos", line: "Eggs scrambled with chorizo and bacon, the Saturday dish of La Mancha that Cervantes names on his first page." },
  ],

  // ES11 The cider house, Asturias. The cider is the hero and the kitchen cooks what goes with it.
  sidreriaEs: [
    { name: "Natural cider", zh: "Sidra natural", line: "Poured from overhead so it breaks against the glass, a culín at a time; everything else here goes with it." },
    { name: "Bean and sausage stew", zh: "Fabada asturiana", line: "Large white beans cooked slowly with chorizo, morcilla and cured pork shoulder until the broth turns thick." },
    { name: "Chorizo in cider", zh: "Chorizu a la sidra", line: "Whole chorizos simmered in the house cider until the sauce sweetens, brought to the table in the dish." },
    { name: "Maize flatbreads", zh: "Tortos de maíz", line: "Rounds of maize dough fried in oil and topped with a fried egg and picadillo, eaten with the hands." },
    { name: "Cabrales cheese", zh: "Quesu Cabrales", line: "Blue cheese ripened in limestone caves in the Picos de Europa, strong enough to hold its own against cider." },
    { name: "Hake in cider", zh: "Merluza a la sidra", line: "Hake baked with clams, potato and cider, the coast's dish cooked with the drink this house presses." },
    { name: "Rice pudding", zh: "Arroz con lleche", line: "Rice cooked long in milk with lemon peel and cinnamon, and the top burnt hard with an iron." },
  ],

  // ES12 The sherry bodega, Jerez. Six wines out of the solera, and the two tapas the town eats with them.
  bodegaJerez: [
    { name: "Fino", zh: "Fino", line: "Dry pale wine aged under a living film of flor in these butts, drawn with the venencia and drunk cold." },
    { name: "Manzanilla", zh: "Manzanilla", line: "The same wine raised in Sanlúcar by the sea, where the damp keeps the flor thicker and the taste saltier." },
    { name: "Amontillado", zh: "Amontillado", line: "A fino that lost its flor and went on ageing in contact with air, which turns it amber and nutty." },
    { name: "Oloroso", zh: "Oloroso", line: "Fortified high enough that no flor ever grows, then aged in the open air until it is dark and dry." },
    { name: "Palo cortado", zh: "Palo cortado", line: "A butt that started under flor and finished without it, marked apart by the cellar master with a chalk line." },
    { name: "Pedro Ximénez", zh: "Pedro Ximénez", line: "Grapes dried on mats in the sun before pressing, which is why this one pours black and sweet." },
    { name: "Kidneys in sherry", zh: "Riñones al jerez", line: "Lambs' kidneys fried with garlic and finished with a glass of the bodega's own wine, a Jerez tapa." },
    { name: "Shrimp fritters", zh: "Tortillitas de camarones", line: "Chickpea flour batter with tiny whole shrimps, spread thin in hot oil until it fries to lace, from Cádiz." },
  ],
};
