/** Spain objects: data only. Owned by the Researcher. Ids, props and scenes follow docs/spain-world.md.
 *  Blurbs follow the China standard: three to five paragraphs, dated records rather than invented
 *  birthdays, local names in their own language, legends labelled as legends. */
import type { EnrichedRecipe, Kind, WorldObject } from "./graph";
import { SPAIN_STORY_DEPTH } from "./spain-stories";

const has = (list: string[], re: RegExp) => list.some((x) => re.test(x));
const spanish = (r: EnrichedRecipe) => r.area === "spain";

/** Two links per card, always to another Spain object. */
export const SPAIN_NEXT: Record<string, string[]> = {
  paellaEs: ["albuferaRice", "huertaEs"],
  plancha: ["jamonEs", "bodegaJerez"],
  jamonEs: ["dehesaEs", "plancha"],
  tortillaEs: ["churrosEs", "plancha"],
  churrosEs: ["tortillaEs", "plancha"],
  pintxosEs: ["fishMed", "sidreriaEs"],
  gazpachoEs: ["oliveEs", "bodegaJerez"],
  pulpoEs: ["pementoHerbon", "pimentonVera"],
  paTomaquet: ["huertaEs", "oliveEs"],
  manchegoEs: ["ovejaManchega", "azafranEs"],
  sidreriaEs: ["pulpoEs", "pintxosEs"],
  bodegaJerez: ["flamenco", "plancha"],
  fishMed: ["pintxosEs", "pulpoEs"],
  oranges: ["gazpachoEs", "paellaEs"],
  oliveEs: ["gazpachoEs", "paTomaquet"],
  albuferaRice: ["paellaEs", "huertaEs"],
  huertaEs: ["paellaEs", "gazpachoEs"],
  azafranEs: ["paellaEs", "manchegoEs"],
  dehesaEs: ["jamonEs", "manchegoEs"],
  ovejaManchega: ["manchegoEs", "dehesaEs"],
  pimentonVera: ["pulpoEs", "plancha"],
  pementoHerbon: ["pulpoEs", "pintxosEs"],
  alhambraEs: ["gazpachoEs", "oranges"],
  flamenco: ["bodegaJerez", "jamonEs"],
  molinosMancha: ["manchegoEs", "azafranEs"],
  gaudiEs: ["paTomaquet", "plancha"],
};

/** object id -> file stem in public/scenes/spain-food/ */
export const SPAIN_CARD_ART: Record<string, string> = {
  paellaEs: "paella",
  plancha: "tapas",
  jamonEs: "jamon",
  tortillaEs: "tortilla",
  churrosEs: "churros",
  pintxosEs: "pintxos",
  gazpachoEs: "gazpacho",
  pulpoEs: "pulpo",
  paTomaquet: "pa-tomaquet",
  manchegoEs: "manchego",
  sidreriaEs: "sidreria",
  bodegaJerez: "bodega",
};

type Room = {
  id: string;
  kind: Kind;
  name: string;
  placeName: string;
  zh: string;
  emoji: string;
  pos: [number, number];
  rot: number;
  prop: string;
  scene: string;
  tagline: string;
  blurb: string;
  partners?: string[];
  match: (r: EnrichedRecipe) => boolean;
};

/** The twelve objects that open a painted room. Each card ends with its story depth. */
const rooms: Room[] = [
  {
    id: "paellaEs", kind: "dish", name: "The rice fire", placeName: "The rice fire", zh: "Arròs a la valenciana", emoji: "🥘",
    pos: [-23, 20], rot: 0.2, prop: "paellaFire", scene: "es_paella",
    tagline: "A wide pan, a wood fire, and rice spread one grain deep.",
    blurb: "Arròs a la valenciana is cooked in the open air beside the water that grows it, on the edge of the Albufera, the shallow lagoon south of València. The oldest firm dates here are recent ones, because this is a country dish that was eaten long before anybody wrote it down: an Order of 27 June 2001 gave the rice a protected name, and a Decree of 29 October 2021 declared the dish itself an intangible Bien de Interés Cultural under the title \"el arte de unir y compartir\".\n\nThe pan is wide and shallow so the rice can lie one grain deep and lose its water evenly. The fire is sarments, vine prunings, which burn hot and die quickly. Into the oil go chicken and rabbit, then flat green beans of the ferraura and rotget kinds and the big white garrofó, then grated tomato and sweet pimentó, then water, safrà and salt. The rice goes in last, short and round, one of Bomba, Sénia, Bahía or Albufera, and from that moment nobody stirs it. When the water is gone the grains at the bottom catch on the metal and become the socarrat, the toasted crust that the pan is scraped for.\n\nIt is a midday dish and a Sunday dish. The pan comes off the fire, rests under a cloth, and is eaten straight out of it with wooden spoons, each person working their own wedge from the rim inwards. In València the argument about what belongs in it is a local sport, and the versions of the same pan run through arròs a banda, arròs negre with squid ink, and fideuà, where short noodles take the place of the rice.\n\nLegend puts the name in the phrase \"para ella\", for her, but there is no document behind it. The dictionary is plainer: the Real Academia Española takes paella from the Valencian paella, from the Old French paele, a frying pan, and that from the Latin patella. The dish is named after the vessel, as most dishes are.",
    partners: ["rice", "saffron", "flat beans", "rabbit", "olive oil"],
    match: (r) => r.place === "paellaEs" || (spanish(r) && has(r.core, /\brice\b|paella/)),
  },
  {
    id: "plancha", kind: "technique", name: "The tapas bar", placeName: "Tapas bar", zh: "La barra de tapas", emoji: "🍤",
    pos: [-40, -2], rot: -0.1, prop: "tapasBar", scene: "es_tapas",
    tagline: "A drink never arrives alone on this counter.",
    blurb: "The bar stands under the arcade of a square that Juan Gómez de Mora rebuilt for Felipe III between 1617 and 1619. The word for what it serves is much younger than the square: the food sense of tapa is first recorded in the Real Academia Española's dictionary of 1939, as rounds of sausage or thin slices of ham laid over glasses of wine in grocers' shops and taverns, and it was still marked as an Andalusianism in 1956.\n\nWhat is on the zinc is small and salty and meant to be eaten standing up. Patatas bravas, potato cut in cubes and fried, under one sauce built on pimentón and oil. Croquetas, whose filling is a thick béchamel, which is why they run when they are cut. A dish of aceitunas, salt-packed anchoas out of a tin, bread, and behind the counter a vermut tap, a bottle of wine and the small beer called a caña.\n\nTapeo is a way of walking rather than a meal. One drink and one bite at each counter, then out into the street for the next one, so that an evening is a route through five or six bars and nobody sits down until the end of it. Bones and paper go on the floor or on the plate, depending on the house, and the barman keeps the bill in his head.\n\nLegend puts the first tapa on a glass of sherry as a lid against the flies in an Andalusian tavern in the 1800s, and another version puts it with Alfonso X on his doctors' advice. Neither has a contemporary document behind it. What is documented is the word, the square, and the iron market halls of 1876 to 1889 that fed counters like this one.",
    partners: ["prawns", "paprika", "olives", "chickpeas", "garlic"],
    match: (r) => has(r.techniques, /plancha/) || r.place === "plancha",
  },
  {
    id: "jamonEs", kind: "dish", name: "The ham counter", placeName: "The ham counter", zh: "Jamón ibérico", emoji: "🍖",
    pos: [-51.5, -5.5], rot: 0.3, prop: "jamonStall", scene: "es_jamon",
    tagline: "A long thin knife, and slices you can see the light through.",
    blurb: "This is one specialist stall inside a cast-iron and glass market hall of the generation that opened between 1876 and 1889. Everything about the trade it carries on was written into law much later: Real Decreto 4/2014, of 10 January 2014, fixes four seal colours for Iberian ham by breed and by feed, black for bellota 100% ibérico, red for bellota ibérico, green for cebo de campo ibérico and white for cebo ibérico.\n\nA leg is salted, washed, dried and then left hanging in a cool store for months and often years before anybody cuts it. At the counter it is clamped into a jamonero and opened with a long flexible cuchillo jamonero and a short puntilla for working round the bone. The slices are taken against the grain and lifted away almost transparent, and when the cutter stops the cut face is covered again with its own tocino so it does not dry.\n\nPeople buy it by weight, cut to order, and eat it at room temperature with bread and nothing else, or standing at a bar beside a glass of fino. A plate of it is the first thing put on a table when visitors arrive, and the last thing that gets cleared.\n\nThe seals point back at a landscape rather than a factory. The black and the red ones mean the pig spent the montanera, from October to February, loose under the holm oaks of the dehesa, eating acorns and grass and walking between trees for them.",
    partners: ["bread", "sherry", "olives", "acorns"],
    match: (r) => r.place === "jamonEs" || (spanish(r) && has(r.core, /\bham\b|jam(ó|o)n|cured pork/)),
  },
  {
    id: "tortillaEs", kind: "dish", name: "The family kitchen", placeName: "The family kitchen", zh: "Tortilla de patatas", emoji: "🍳",
    pos: [-46, -1], rot: 0.05, prop: "tortillaKitchen", scene: "es_tortilla",
    tagline: "Two or three eggs, and the cooks knew how to stretch them.",
    blurb: "The earliest known written mention of this dish is a complaint about poverty. A memorial de ratonera dated 14 May 1817, dropped anonymously into a box while the Cortes of the Kingdom of Navarre were sitting, describes farming families making a tortilla from two or three eggs that will feed five or six, because it can be made large and thick with potatoes and bread scraps. It is a record of something already ordinary, not of an invention.\n\nThe method is short and easily ruined. Potatoes are cut thin and softened slowly in plenty of olive oil, poached rather than fried, so they stay soft and never colour. They are drained and folded into beaten eggs with salt, with or without onion softened alongside. The mixture goes back into a small pan, sets at the edges, and is turned by putting a plate over the pan, flipping the whole thing and sliding it back in to finish, still loose in the middle if the house likes it that way.\n\nIt is eaten hot, warm or cold, which is why it is everywhere: in wedges on a bar as a pincho de tortilla, between bread as a bocadillo, taken on a train, or made in the evening because there is nothing else in the house.\n\nThe onion question is the one part of it that has been measured. A survey by Spain's Centro de Investigaciones Sociológicas reported in 2024 found 71.2 per cent preferred it with onion against 22 per cent without. The argument carries on regardless, which is most of its purpose.",
    partners: ["potato", "eggs", "olive oil", "onion"],
    match: (r) => r.place === "tortillaEs" || (spanish(r) && has(r.core, /potato|egg/)),
  },
  {
    id: "churrosEs", kind: "dish", name: "The churrería", placeName: "Churrería", zh: "Churrería", emoji: "🍩",
    pos: [-33, 0], rot: 0, prop: "churreria", scene: "es_churros",
    tagline: "Ridged dough, hot oil, and chocolate thick enough to hold a spoon.",
    blurb: "A churrería is a shop with one job. Madrid's oldest working one, the Chocolatería de San Ginés, opened in 1894 in a passageway off Calle Arenal, in a building put up four years earlier as an inn, and it has fried by the same method since. The trade is older than that shop, but 1894 is where the paper trail in this city starts.\n\nThe dough is flour, water and salt, scalded so it holds together, and it is pushed through a star-shaped nozzle straight into hot clean oil. The ridges come from the nozzle and from nothing else. They fry fast, drain on a tray, and are handed over in paper with sugar or without. The thicker, softer porra beside them is a different dough carrying a raising agent, which is why it is spongier and takes more chocolate. The chocolate itself is chocolate a la taza, thickened until a churro will stand in the cup.\n\nThe hours are the strange part. A churrería belongs to very early morning, when people come out of the market or off a night shift, and to very late night, when they come out of everywhere else. A docena wrapped to take home is a Sunday habit in a lot of families.\n\nThe same fried dough answers to other names further south: calentitos in Seville and Huelva, tejeringos in Cádiz and Málaga, jeringos in Córdoba and tallos in Jaén. Legend puts its invention with shepherds who named it after the ridged horns of the churra sheep, and another legend brings it from China with Portuguese sailors. Neither has any documentary support.",
    partners: ["flour", "olive oil", "chocolate", "sugar"],
    match: (r) => r.place === "churrosEs" || (spanish(r) && has(r.core, /churro|chocolate/)),
  },
  {
    id: "pintxosEs", kind: "technique", name: "The counter of small bites", placeName: "Pintxo bar", zh: "Pintxoak", emoji: "🍢",
    pos: [-33, -18.5], rot: 0.05, prop: "pintxoBar", scene: "es_pintxos",
    tagline: "Anchovy, olive and a green pepper, on one stick.",
    blurb: "This is a bar on the Cantabrian coast, where the counter is the menu. Its most important ingredient arrived as an industry: from about 1880 Italian salatori came to Santoña, Bermeo, Getaria, Castro Urdiales, Colindres and Laredo to buy and salt the Cantabrian anchovy for the markets of Naples, Livorno and Genoa, and Giovanni Vella Scaliota, who reached Santoña in 1880, is credited with the fillet in oil in 1883.\n\nOn the wood are a jar of pickled guindillas, the slim green peppers the Basques call piparra, a dish of green olives, salt-packed anchoas, bread with something on it, and a wedge of tortilla under a cloth. One skewer puts three of those together: olive, anchovy, pickled pepper, dressed with a thread of oil. That skewer is the gilda, reported from about 1946 at Casa Vallés in San Sebastián and named after the film released that year.\n\nEating here is called txikiteo and it moves. One bite and one small glass, a zurito or a txikito, then the next bar; the sticks are left on the counter and counted at the end to work out the bill. Nobody orders a course and nobody stays long.\n\nThe habit has a formal cousin. The txokoak, the gastronomic societies, grew out of workers meeting in cider cellars when the taverns closed; the oldest still working in San Sebastián, the Unión Artesana, was founded in 1870. Txoko is Basque for corner.",
    partners: ["anchovy", "olives", "guindilla", "olive oil"],
    match: (r) => r.place === "pintxosEs" || (spanish(r) && has(r.core, /anchov|pintxo/)),
  },
  {
    id: "gazpachoEs", kind: "dish", name: "The courtyard kitchen", placeName: "The courtyard kitchen", zh: "Gazpacho andaluz", emoji: "🥣",
    pos: [-41.5, 10], rot: -0.15, prop: "patioKitchen", scene: "es_gazpacho",
    tagline: "Bread, oil, garlic and vinegar, cold, in a hot patio.",
    blurb: "Gazpacho is older than its colour. The version Andalusian farm labourers carried into the fields was bread, garlic, olive oil, vinegar, water and salt, pounded by hand, and it was a whole meal rather than a first course. Tomato and green pepper had come from the Americas but only entered the bowl in the nineteenth century, which is also when the dish moved from the field to the town table.\n\nThe red version is ripe tomatoes, green pepper, cucumber, garlic and farmhouse bread soaked in water, worked with extra virgin olive oil, vinagre de Jerez, salt and cold water until it is smooth. The old tools are still the ones that explain it: a wooden dornillo to work the bread and a mortar for the garlic. Nothing in this kitchen is heated, so nothing here steams.\n\nIt is drunk from a glass as often as it is eaten from a bowl, straight from the well or the cold store, in the shaded patio at the hottest part of the day. The diced tomato, cucumber, pepper, onion, bread and hard-boiled egg come in separate little dishes so each person builds their own.\n\nThe same idea has neighbours. Salmorejo from Córdoba is thicker, with more bread and no cucumber or pepper, and ajoblanco is the white one, almonds and garlic and oil with grapes on top. The courtyards themselves were inscribed by UNESCO in 2012, as a festival and a shared practice of looking after them.",
    partners: ["tomato", "cucumber", "garlic", "sherry vinegar", "bread"],
    match: (r) => r.place === "gazpachoEs" || (spanish(r) && has(r.core, /gazpacho|cucumber/)),
  },
  {
    id: "pulpoEs", kind: "dish", name: "The fair cauldron", placeName: "Pulpería", zh: "Polbo á feira", emoji: "🐙",
    pos: [-51, -16.5], rot: 0, prop: "pulperia", scene: "es_pulpo",
    tagline: "Scissors, a wooden plate, paprika, oil and coarse salt.",
    blurb: "The most famous octopus dish in Spain is cooked a long way from the sea. Dried and salted octopus travelled inland from Mugardos, Bueu, Muros and the shores of the Arousa estuary to the cattle fairs of Lugo, Ourense, Monterroso and O Carballiño, and the dish grew up at those fairs. The name says so: á feira means at the fair, and it is not a cooking method.\n\nA fresh octopus is beaten to tenderise it, then dipped three times into boiling unsalted water so the skin tightens and the arms curl, a move the pulpeiras call asustar, to frighten it. It cooks slowly in a copper cauldron, comes out on a hook, and is cut with scissors, never a knife, straight onto a round wooden plate over cachelos, boiled potatoes. Then pemento, either doce or picante, a heavy pour of olive oil and coarse salt. Nothing else: no lemon, no parsley, no garlic.\n\nIt is eaten standing or on a bench, with a cocktail stick instead of a fork and a white bowl of local wine, and it belongs to festas and fairs more than to restaurants. The wooden plate is part of it, because it takes the oil without pooling.\n\nThe paprika came by mule. Maragato carriers from La Maragatería in León brought pimentón up from Extremadura and oil along the Vía de la Plata to those same fairs, and they are credited with the dressing that turned rehydrated octopus into this plate.",
    partners: ["octopus", "paprika", "olive oil", "potato"],
    match: (r) => r.place === "pulpoEs" || (spanish(r) && has(r.core, /octopus|pulpo/)),
  },
  {
    id: "paTomaquet", kind: "dish", name: "The bread terrace", placeName: "The bread terrace", zh: "Pa amb tomàquet", emoji: "🍞",
    pos: [-26, -14], rot: -0.12, prop: "panTerrace", scene: "es_pa_tomaquet",
    tagline: "Rub the tomato in, then the oil, then the salt.",
    blurb: "Catalonia's everyday bread is usually explained as a way of rescuing a loaf. Farmhouses baked large rounds of pa de pagès that went dry before they were finished, and in the season when tomatoes were everywhere a halved tomato rubbed over the cut surface put the bread back into use. The written trail is thinner than the habit: the gastronome Néstor Luján placed the first reference in 1884, in a letter from Paris by Pompeu Gener describing bread with oil dressed with tomato.\n\nThe order matters more than the ingredients. Take yesterday's pa de pagès, toasted or not. Halve a ripe tomato and rub the cut side into the crumb so the pulp and the seeds go in and the skin stays in your hand. Then oli d'oliva, then sal, in that order. Tomato diced and heaped on top is a different thing and Catalans will tell you so.\n\nIt is breakfast, it is what comes while you wait, and it is the base of half the plates on a Catalan table: pernil salat, anxoves, botifarra, truita, or nothing at all. A basket of bread, a bowl of tomatoes, a cruet and salt go on the table and everyone makes their own.\n\nOne rival account is repeated often and is not established: that the habit came with Murcian and Andalusian workers who built the Barcelona metro in the early twentieth century and grew tomatoes on the sites. It is offered here as a competing story, not as history.",
    partners: ["bread", "tomato", "olive oil", "ham"],
    match: (r) => r.place === "paTomaquet" || (spanish(r) && has(r.core, /bread/)),
  },
  {
    id: "manchegoEs", kind: "dish", name: "The cheese farm", placeName: "The cheese farm", zh: "Queso manchego", emoji: "🧀",
    pos: [-69, 5], rot: -0.05, prop: "quesoFarm", scene: "es_manchego",
    tagline: "A zig-zag on the side, a flower on both faces.",
    blurb: "On the dry plateau of La Mancha the only animal that pays is a sheep, and the only cheese that may carry this name is made from her milk. The Denominación de Origen allows whole milk of the Manchega breed, salt, lactic ferments and rennet, and nothing else, which is why the flock in the doorway and the wheel on the table are the same subject.\n\nThe milk is set with cuajo, the curd is cut fine and lifted into a mould wrapped in a pleita, the plaited esparto band, and pressed between boards. The band prints a zig-zag round the side of the wheel and the board prints the flor, a flower or wheat ear, on both flat faces. The rule requires both marks. The wheel is then salted, turned every week in a cool store, and sold semicurado at a few months, curado at six or more, añejo after a year, the paste turning from ivory to deep gold and the small uneven eyes closing up.\n\nIt is cut in wedges with the rind left on, eaten off a board with bread and often with membrillo, quince paste, and it appears on every bar plate in the country beside the ham. A year-old wedge with a glass of red is a whole course in La Mancha.\n\nThe breed behind it is counted in the national catalogue: 556,363 breeding ewes in some 910 flocks, milk at 7 to 8 per cent fat, and no horns on either sex. La Mancha holds about 15.8 per cent of Spain's sheep and makes about 21 per cent of its sheep milk.",
    partners: ["sheep milk", "bread", "quince", "wine"],
    match: (r) => r.place === "manchegoEs" || (spanish(r) && has(r.core, /manchego|cheese/)),
  },
  {
    id: "sidreriaEs", kind: "place", name: "The cider house", placeName: "Sidrería", zh: "Sidrería asturiana", emoji: "🍎",
    pos: [-40, -20], rot: -0.2, prop: "sidreria", scene: "es_sidreria",
    tagline: "Raise the bottle, break the cider, drink the culín.",
    blurb: "A sidrería is the room at the front of a llagar, the Asturian cider works, and in December 2024 UNESCO inscribed the whole culture around it on the Representative List of the Intangible Cultural Heritage of Humanity: the orchards, the pressing, the pouring and the drinking together, not the drink on its own.\n\nThe cider is sidra natural. Asturian apples are pressed in autumn, the juice ferments in chestnut or oak without added gas or sugar, and what comes out is cloudy, sharp and flat. That is why it has to be poured from a height. The escanciador raises the bottle above the head and lets a thin stream fall the length of an arm into the far side of a wide, thin glass held low, so the cider breaks against the glass and takes air for a few seconds.\n\nOnly a culín is poured, a finger of it, and it is drunk straight down before the air goes out of it. The last mouthful is thrown on the floor to rinse the glass, which is then passed to the next person, and the floor is built to be washed at the end of the night. An espicha is the same thing at scale: long tables, cheese, bread, chorizo cooked in cider and bottles opened all evening.\n\nAsturias makes about 80 per cent of Spain's cider, more than 40 million bottles a year, from close to 500 apple varieties, 76 of them recognised under the protected name Sidra de Asturias. Most of the presses stand in the six councils of the Comarca de la Sidra.",
    partners: ["apples", "cheese", "bread", "chorizo"],
    match: (r) => r.place === "sidreriaEs" || (spanish(r) && has(r.core, /cider|apple/)),
  },
  {
    id: "bodegaJerez", kind: "place", name: "The sherry bodega", placeName: "Bodega", zh: "Bodega de Jerez", emoji: "🍷",
    pos: [-46, 16], rot: 0.25, prop: "jerezBodega", scene: "es_bodega",
    tagline: "Butts in three tiers, and a film of yeast on the wine.",
    blurb: "Jerez holds the oldest working piece of Spanish food law. The Wine Statute of 26 May 1933 gave legal status to the Denominación de Origen Jerez-Xérès-Sherry, and an Order of 15 September 1933 constituted its Consejo Regulador, the first in Spain; it first sat on 3 August 1934 and published its regulations on 19 January 1935.\n\nThe building is made for the wine rather than for people. A bodega is a tall lime-washed nave with high shuttered windows that catch the damp poniente wind off the Atlantic, and a floor of albero sand that is watered to hold the humidity. The butts are stacked in three tiers and filled to 500 litres, thirty arrobas, which leaves an empty surface for the velo de flor, the living film of yeast that grows on the wine and keeps the air off it. A venencia, a small cup on a long flexible handle, goes down through the flor without breaking it, and the wine is poured from a height into a copita in a thin dark thread.\n\nThe ageing runs by soleras and criaderas. The wine for bottling comes from the lowest row, the solera, each row is refilled from the row above, and nothing is ever emptied, so a glass drawn today carries a little of every year the stack has held.\n\nUnder the flor the wine stays pale and sharp and is called fino, or manzanilla when it is raised at Sanlúcar. Where the film dies the wine meets the air and darkens into amontillado and oloroso. Pedro Ximénez is the sweet one, dried in the sun before pressing. All of them were poured under the slice of ham that gave the tapa its name.",
    partners: ["sherry", "jamón", "olives", "almonds"],
    match: (r) => r.place === "bodegaJerez" || (spanish(r) && has(r.core, /sherry|wine/)),
  },
];

export const SPAIN_OBJECTS: WorldObject[] = rooms.map((room) => ({
  id: room.id,
  world: "mediterranean" as const,
  area: "spain" as const,
  kind: room.kind,
  name: room.name,
  placeName: room.placeName,
  zh: room.zh,
  emoji: room.emoji,
  pos: room.pos,
  rot: room.rot,
  elevation: 0,
  prop: room.prop,
  scene: room.scene,
  place: true,
  tagline: room.tagline,
  blurb: room.blurb + "\n\n" + SPAIN_STORY_DEPTH[room.id],
  partners: room.partners,
  match: room.match,
}));

// --- ingredient stops and flavours: a card, a 3D reaction, no room ---
SPAIN_OBJECTS.push(
  {
    id: "fishMed", world: "mediterranean", kind: "ingredient", name: "Fish & prawns", placeName: "The port", zh: "Pescado y gambas", emoji: "🐟",
    area: "spain", pos: [-20, -2], rot: -Math.PI / 2, elevation: 0, prop: "fishingPort", place: true,
    tagline: "Landed at dawn, on the grill or in the pan by noon.",
    blurb: "The Phoenicians were salting Atlantic tuna at Cádiz by about 800 BC, and garum, the fermented fish sauce Rome ate on everything, was made on the same coast. Salting is still what this port does with what it cannot sell fresh, and two of the rooms in this area depend on it.\n\nSpain eats more fish than any other country in Europe. Merluza and rape simmer with chickpeas and paprika; sardinas go on skewers over a driftwood fire on the sand; gambas hit the hot iron of the plancha with garlic and nothing else; a whole bream is baked in a case of salt and broken out at the table. Salmon is the northern guest, roasted with tomato, olives and capers.\n\nTwo things leave this quay and travel. Cantabrian anchovy is salt-packed in tins and barrels for the pintxo counters of the north coast, and octopus was dried and carried inland to the Galician fairs long before ice existed, which is where the cauldron at the fair comes from.",
    partners: ["garlic", "olive oil", "lemon", "chickpeas", "tomato"],
    match: (r) => has(r.protein, /fish|prawn|shrimp|salmon/),
  },
  {
    id: "oranges", world: "mediterranean", kind: "ingredient", name: "Oranges & almonds", zh: "Naranjas y almendras", emoji: "🍊",
    area: "spain", pos: [-32.5, 12], rot: 0.3, elevation: 0, prop: "orangeGrove",
    tagline: "Seville's bitter oranges and the almond blossom of February.",
    blurb: "Bitter oranges were planted along Seville's streets in the 900s for their scent and their shade, and they are still the city's street tree; the English turned that fruit into marmalade. The sweet orange came later, from China by way of Portugal in the 1500s, and it is the one the Valencian coast now grows in sheets behind the huerta.\n\nAlmonds arrived earlier still, from the eastern Mediterranean, and they flower pink and white across the dry south in February, weeks before anything else. Ground almonds carry turrón, marzipan and the white soup called ajoblanco; bitter orange goes into the water used for pastry, and sweet orange into winter salads with fennel, olives and oil.\n\nA tree of either kind is also furniture. An orange tree in the corner of a whitewashed patio is what makes the shade the cold soup is eaten in, and the fallen fruit is swept up rather than used.",
    partners: ["honey", "cinnamon", "olive oil"],
    match: (r) => has(r.core, /orange|almond/),
  },
  {
    id: "oliveEs", world: "mediterranean", kind: "ingredient", name: "The grove and the oil mill", zh: "Olivar y almazara", emoji: "🫒",
    area: "spain", pos: [-61.5, 6], rot: 0.1, elevation: 0, prop: "oliveMillEs",
    tagline: "Sixty-six million trees in one province.",
    blurb: "Spain is the largest olive oil producer in the world, and one province does most of the work. Jaén carries more than 550,000 hectares of grove and about 66 million trees, almost all of them the Picual variety, and produces roughly half of the country's oil. From a hill there the grove does not end; it goes over the next ridge and the one after.\n\nThe fruit is knocked or shaken down onto nets between November and January and taken to the almazara, the mill, the same day if the oil is to be good. It is washed, crushed stone and all, worked to a paste, and the oil separated out without heat. What comes off first is aceite de oliva virgen extra, green, bitter and peppery in the throat.\n\nNothing in this area happens without it. It softens the potatoes for the tortilla, fries the churros, dresses the octopus, goes into the cold soup and onto the rubbed bread, and is poured raw over everything else. A Spanish kitchen measures it by the glugg, not the spoon.",
    partners: ["bread", "garlic", "tomato", "salt"],
    match: (r) => spanish(r) && has(r.core, /olive/),
  },
  {
    id: "albuferaRice", world: "mediterranean", kind: "ingredient", name: "The Albufera paddies", zh: "Els arrossars de l'Albufera", emoji: "🌾",
    area: "spain", pos: [-22, 12], rot: 0, elevation: 0, prop: "albuferaPaddy",
    tagline: "Short round grain, grown in a lagoon.",
    blurb: "The Albufera is a shallow freshwater lagoon behind a sandbar south of València, separated from the sea by a strip of umbrella pines. The natural park around it covers about 21,000 hectares, and roughly 17,500 of those are rice fields: flat bunded squares that are flooded, drained and flooded again through the year.\n\nAn Order of 27 June 2001 ratified the regulation of the Denominación de Origen Protegida Arroz de Valencia, whose council had been set up in 1998. It protects four varieties, Bahía, Sénia, Bomba and Albufera, all of them short and round, because a short round grain takes up flavour and stays separate instead of turning creamy.\n\nWho gets the water and when is settled by an institution older than the paperwork. The Tribunal de les Aigües de València, inscribed by UNESCO in 2009, still sits on Thursdays at the cathedral door, in Valencian, with no written record and no lawyers, and its rulings are obeyed.",
    partners: ["rice", "water", "eels", "saffron"],
    match: (r) => spanish(r) && has(r.core, /\brice\b/),
  },
  {
    id: "huertaEs", world: "mediterranean", kind: "ingredient", name: "The huerta beds", zh: "L'horta", emoji: "🍅",
    area: "spain", pos: [-32.2, 22], rot: 0.1, elevation: 0, prop: "huertaBeds",
    tagline: "Flat beans, big white beans, and the tomato that changed everything.",
    blurb: "L'horta is the irrigated market garden that wraps the Valencian coast, cut into small plots by channels and worked in beds rather than fields. It is the oldest continuously farmed ground in this area, and the barraca, the whitewashed house with a steep thatched roof and a cross on the gable, is what its farmers built to live in.\n\nFour of its crops go straight into the pan on the next fire. Ferraura and rotget are the flat green beans; garrofó is the big flat white bean that goes in before the rice; the tomato is grated rather than chopped; and the sweet pepper is dried and ground into pimentó. Onions, artichokes, chard and the long green peppers for frying fill the rest of the beds.\n\nThe tomato is the newcomer that rearranged everything. It reached Spain from the Americas in the 1500s and was treated with suspicion for a long time, and only in the nineteenth century did it turn the cold Andalusian soup red and settle into the rice, the bread and the salad.",
    partners: ["tomato", "flat beans", "peppers", "garlic"],
    match: (r) => spanish(r) && has(r.core, /tomato|pepper|bean/),
  },
  {
    id: "azafranEs", world: "mediterranean", kind: "flavour", name: "The saffron plot", zh: "Azafrán de La Mancha", emoji: "🌸",
    area: "spain", pos: [-71, -7], rot: 0.1, elevation: 0, prop: "azafranField",
    tagline: "Purple at dawn, crimson threads by noon.",
    blurb: "For two or three weeks in late October a dry brown plot in La Mancha turns purple overnight. Crocus sativus flowers before its leaves, opens at dawn and closes the same day, so the whole crop is picked by hand in the cold early hours and carried indoors in baskets.\n\nThen comes the monda. Sitting at a long table, the pickers open each flower and pinch out the three crimson stigmas where the style turns white, dropping them onto cloth. The threads are toasted over gentle heat until they lose most of their weight, which fixes the colour and the smell. It takes a very large number of flowers to fill a small jar, which is the whole explanation of the price.\n\nThe Denominación de Origen Protegida Azafrán de La Mancha was recognised in 1995, with its Consejo Regulador at Camuñas in Toledo. A pinch of the toasted threads, crushed and steeped, is what turns the rice in the Valencian pan yellow and gives it its smell.",
    flavour: ["floral", "honeyed", "bitter"],
    partners: ["rice", "fish", "chicken", "olive oil"],
    match: (r) => spanish(r) && has(r.core, /saffron/),
  },
  {
    id: "dehesaEs", world: "mediterranean", kind: "ingredient", name: "The holm-oak dehesa", zh: "La dehesa", emoji: "🐖",
    area: "spain", pos: [-78, 16], rot: 0, elevation: 0, prop: "dehesaOaks",
    tagline: "Ten kilos of acorns a day, under an old oak.",
    blurb: "The dehesa is not a wood and not a field. It is open grazing under widely spaced holm oaks and cork oaks, thinned and kept that way by people for centuries, and it is the largest agro silvo pastoral system in Europe. Published Spanish figures for how much ground it covers differ widely with the definition used, but it runs across the south and the west of the country and on into Portugal.\n\nIts calendar has one season that matters here. The montanera runs from October to February, when the acorns drop and the Iberian pigs are turned out to find them. A pig on montanera can eat 7 to 10 kilos of acorns and 2 to 6 kilos of grass a day, and it walks a long way between trees to do it, which is what works the fat into the muscle.\n\nThe same ground carries merino sheep and retinta cattle alongside the pigs, and the cork is stripped from the alcornoques every nine years or so. One landscape, three or four products, and a ham that can only be explained by standing in it.",
    partners: ["acorns", "ham", "oak", "grass"],
    match: (r) => spanish(r) && has(r.core, /ham|pork/),
  },
  {
    id: "ovejaManchega", world: "mediterranean", kind: "ingredient", name: "The Manchega flock", zh: "Oveja manchega", emoji: "🐑",
    area: "spain", pos: [-70.5, 10.5], rot: 0.35, elevation: 0, prop: "manchegaFlock",
    tagline: "One breed, one milk, one cheese.",
    blurb: "The Manchega is a hardy white or black sheep bred for the dry plateau, and it is listed in Spain's official catalogue of native breeds. Both sexes are hornless, which is the quickest way to recognise the flock in a painting, and the census stands at 556,363 breeding ewes in some 910 flocks.\n\nWhat makes her worth keeping is the milk, not the meat. It runs 7 to 8 per cent fat and 5.7 to 6.3 per cent protein, roughly twice as rich as cow's milk, which is why a wheel of cheese comes out of comparatively little of it. La Mancha holds about 15.8 per cent of Spain's sheep and produces about 21 per cent of its sheep milk.\n\nThe rule that protects the cheese is a rule about her. Queso Manchego may be made only from whole Manchega milk, so the flock walking past the door and the wheel drying on the rack are the same animal at two stages.",
    partners: ["cheese", "milk", "esparto", "rennet"],
    match: (r) => spanish(r) && has(r.core, /sheep|manchego|cheese/),
  },
  {
    id: "pimentonVera", world: "mediterranean", kind: "flavour", name: "The pepper drying house", zh: "Pimentón de la Vera", emoji: "🌶️",
    area: "spain", pos: [-72, 20], rot: -0.15, elevation: 0, prop: "veraDryhouse",
    tagline: "Smoke for ten days, then the stone mill.",
    blurb: "Peppers came from the Americas and were grown in the monastery gardens of Extremadura, and in the Vera valley they are still dried the slow way. The peppers are spread on a slatted floor above a low oak fire, and the smoke and heat come up through them for ten to fifteen days while they are turned by hand.\n\nThe smoke is the point. It dries the flesh without cooking it and leaves a taste that no oven can copy, and only after that are the peppers ground between stones into a fine, deep red powder. Pimentón de la Vera comes in three strengths, dulce, agridulce and picante, from different pepper varieties rather than from different treatment.\n\nIt goes into chorizo, over potatoes, into the sauce on a plate of bravas, and onto the octopus at the Galician fair, which it reached by mule along the old road north. Paprika is the colour of this part of the world as much as its taste.",
    flavour: ["smoky", "sweet", "warm"],
    partners: ["octopus", "potato", "chorizo", "olive oil"],
    match: (r) => spanish(r) && has(r.core, /paprika|pimentón/),
  },
  {
    id: "pementoHerbon", world: "mediterranean", kind: "ingredient", name: "The Herbón peppers", zh: "Pemento de Herbón", emoji: "🫑",
    area: "spain", pos: [-58, -13], rot: 0.25, elevation: 0, prop: "herbonPeppers",
    tagline: "Some are hot, some are not, and nobody can tell.",
    blurb: "Around Herbón and Padrón in the Galician river country, a small green pepper is picked young, while it is still only a few centimetres long. It has a protected designation of its own, and the growers there work to it: picked by hand, early, and sold the same week.\n\nThey are cooked whole in hot olive oil until the skin blisters and goes slack, drained, and thrown with coarse salt. That is the entire recipe. They are eaten with the fingers by the stalk, and the plate goes round the table until it is empty.\n\nThe joke that comes with them is true. Most are mild and an occasional one is sharply hot, and nothing about the look of a pepper says which it will be, so a plate is eaten with a certain amount of attention and a glass of something cold within reach.",
    flavour: ["green", "mild", "occasionally hot"],
    partners: ["olive oil", "coarse salt", "bread"],
    match: (r) => spanish(r) && has(r.core, /pepper/),
  },
);

// --- landmarks: a card and a 3D reaction, no recipes ---
SPAIN_OBJECTS.push(
  {
    id: "alhambraEs", world: "mediterranean", kind: "landmark", name: "The Alhambra", zh: "La Alhambra", emoji: "🕌",
    area: "spain", pos: [-56, 22], rot: 0, elevation: 1.2, prop: "alhambra",
    tagline: "Red walls, a long still pool, and water that never stops.",
    blurb: "On a ridge above Granada stand a fortress, a set of palaces and a summer garden built by the Nasrid rulers of the city, in red-earth walls that gave the place its name, al-Hamra, the red one. In 1984 the Alhambra, the Generalife and the Albayzín quarter below were inscribed together on the UNESCO World Heritage List.\n\nWhat it is really built around is water. It is carried up from the river along a channel and then never allowed to rest: it runs down the middle of a staircase handrail, jets across a garden, and lies flat and still the length of a courtyard pool that holds the whole façade upside down. In a place with hot dry summers, moving water is the luxury on display.\n\nThe kitchen below the hill inherited the same period's habits: the courtyard with a well at its centre, the shaded gallery, the tiled bench, and the cold food eaten in the middle of the day.",
    match: () => false,
  },
  {
    id: "flamenco", world: "mediterranean", kind: "landmark", name: "Flamenco", zh: "Flamenco", emoji: "💃",
    area: "spain", pos: [-42, 20], rot: 0.4, elevation: 0, prop: "flamenco",
    tagline: "Guitar, palms and a stamping heel, from the Gitano quarters of Andalusia.",
    blurb: "Flamenco took shape among the Gitanos of Seville, Jerez and Cádiz in the 1700s and 1800s, in courtyards and back rooms before it ever reached a stage. It is three things at once: the cante, the singing, which came first; the toque, the guitar; and the baile, the dance, with the hands and the heels keeping the rhythm.\n\nIt is built on compás, a cycle of beats with the accents in unusual places, and on palos, the forms: soleá slow and heavy, bulería fast and joking, seguiriya for grief, alegrías from Cádiz for the opposite. A singer starts, the guitar answers, and the clapping around the edge is not decoration but the timekeeping.\n\nIn 2010 UNESCO inscribed flamenco on the Representative List, naming Jerez, Cádiz and Seville among the towns associated with its formation. That is the same corner of Andalusia as the sherry and the ham, which is why those three things arrive together on the same evening.",
    match: () => false,
  },
  {
    id: "molinosMancha", world: "mediterranean", kind: "landmark", name: "The windmill ridge", zh: "Molinos de viento", emoji: "🌬️",
    area: "spain", pos: [-76, -8], rot: 0, elevation: 0.8, prop: "manchaWindmill",
    tagline: "Ten left of thirty-four, and three that still grind.",
    blurb: "A La Mancha windmill is a whitewashed stone cylinder with a conical roof that turns as a whole, so the miller can bring the sails round to face the wind. Inside, a vertical shaft, a wooden gear and two stones grind the plateau's wheat, and the flour comes down a chute into a sack on the floor below.\n\nCampo de Criptana counted up to thirty-four of them between the sixteenth and seventeenth centuries. Ten survive, and three of those, called Burleta, Infanto and Sardinero, keep their sixteenth-century structure and machinery. They were declared Bien de Interés Cultural in 1978. At Consuegra the ridge called Cerro Calderico carried thirteen mills and twelve have been recovered.\n\nA ridge is where they stand because a ridge is where the wind is. From the foot of one you can see the dry plain that feeds the flock, the saffron plots and the cheese farm, which is most of this corner of the area in one view.",
    match: () => false,
  },
  {
    id: "gaudiEs", world: "mediterranean", kind: "landmark", name: "The mosaic balustrade", zh: "Trencadís", emoji: "🎨",
    area: "spain", pos: [-27.5, -9], rot: 0.8, elevation: 0, prop: "gaudiBench",
    tagline: "Broken tile, laid back together in a curve.",
    blurb: "Trencadís means broken, and it is a way of tiling a shape that flat tiles will not fit. Ceramic is smashed, sorted by colour, and pressed into mortar over a curved surface, so a bench, a chimney or a roof can bend in two directions and still be covered. Much of the material was factory waste and broken crockery, which is part of why it was affordable at the scale it was used.\n\nThe curve is the reason for the technique and not the other way round. A balustrade that undulates seats people facing each other in some stretches and away from each other in others, and the sun moves across the broken glaze all day without ever lighting it evenly.\n\nUNESCO inscribed Park Güell, Palau Güell and Casa Milà in 1984 as the Works of Antoni Gaudí, and added Casa Vicens, Casa Batlló, the Nativity façade and crypt of the Sagrada Família and the crypt at the Colònia Güell in 2005. The terrace below this balustrade is where the bread and the tomato are eaten.",
    match: () => false,
  },
);
