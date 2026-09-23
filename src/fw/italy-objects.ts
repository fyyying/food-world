/** Italy objects (areas `rome`, `venice`, `sicily`): data only. Owned by the Researcher.
 *
 *  Positions and rotations are the fixed Stage B blueprint in docs/italy-world.md; ids, kinds, props,
 *  scenes, names and purposes are the object list in the same document. Forty-six objects: thirteen that
 *  open a painted room, fifteen card-only ingredient and flavour stops, six landmarks and two other
 *  card-only objects with a card and a 3D reaction, and the ten hit-only children of the two markets and
 *  of `ragu` and `oven`, which keep the parents and kinds `graph.ts` had for them; `stall-tomato` alone
 *  lost its alias on 2026-09-23, so the Roman stall opens its own card and not Sicily's tomato beds.
 *
 *  Every `rot` lies within [-0.75, 0.75]: a stand's front faces the camera side (+z), and the road comes
 *  to the door rather than the stand turning to the road (docs/building-a-world.md, the stand section).
 *  Stage C turned twenty-three objects, eleven stands among them, to about π towards a road on their north
 *  side; Stage D (2026-09-22) set those to 0, which is what `props-italy.ts`'s old `facing` wrapper showed
 *  the camera anyway, and kept the fourteen that were already inside the band. The objects that own world
 *  offsets — the two markets with their stalls, the forno's oven house, the casale's byre and the tonnara's
 *  sheds — all stand at 0, so those offsets stay where the blueprint puts them. `rialtoIt` takes rot 0,
 *  square to the Grand Canal, and the water-subject stands (`seafood`, `lagunaIt`, `valliIt`, `tonnaraIt`)
 *  face their water inside the same band.
 *
 *  Blurbs follow the band in docs/italy-world.md, "Shared contract: the card blurb band": room objects
 *  three to five paragraphs of about 2,500 to 3,200 characters including their story depth, card-only
 *  objects three paragraphs of about 750 to 1,000. All eighteen retained blurbs are rewritten. Of the ten
 *  hit-only children, the two that open a card of their own (`stall-tomato`, `stall-arancini`) carry one in
 *  band; the eight that keep an alias carry no blurb, because the alias's card is what opens (lead decision
 *  on the second reviewer's item 51, 2026-09-23).
 *
 *  The period band is about 1880 to 1914. Carbonara (first printed 1952), tiramisù (on a menu in 1972),
 *  insalata caprese (the nineteen-twenties), the Aperol spritz (Aperol 1919, the word attested 1972), the
 *  Vespa (1946) and the modern cicchetti counter (after 2010) are younger than it and appear only as
 *  dated later developments, where docs/italy-world.md says so. `bacaro` is "The osteria", the one grade
 *  of Venetian wine house the dictionaries support, and not a cicchetti bar. Owner ruling, 2026-09-22:
 *  the pasticceria card does not name martorana. */
import type { EnrichedRecipe, Kind, WorldObject } from "./graph";
import { ITALY_STORY_DEPTH } from "./italy-stories";

export { ITALY_STORY_DEPTH, ITALY_DISCOVERIES, ITALY_SOURCES, ITALY_BACKGROUND_SOURCES } from "./italy-stories";

const has = (list: string[], re: RegExp) => list.some((x) => re.test(x));
const italian = (r: EnrichedRecipe) => r.world === "italy";

/** Two links per card, always to another Italy object. The thirteen room links are the `NEXT` lines in
 *  section 4 of docs/italy-research.md; the rest point at the object a visitor would want next. */
export const ITALY_NEXT: Record<string, string[]> = {
  ragu: ["quintoQuarto", "cheese"],
  romeMarket: ["carciofoIt", "ragu"],
  pasta: ["granoIt", "oven"],
  oven: ["pasta", "italyBeef"],
  cheese: ["pecoraIt", "vinoIt"],
  seafood: ["valliIt", "bacaro"],
  bacaro: ["seafood", "casaVeneta"],
  lagunaIt: ["valliIt", "seafood"],
  casaVeneta: ["riceIt", "bacaro"],
  friggitoria: ["sicilyMarket", "granoIt"],
  sicilyMarket: ["friggitoria", "tomato"],
  pastry: ["mandorleIt", "etnaIt"],
  tonnaraIt: ["etnaIt", "capperiIt"],

  carciofoIt: ["romeMarket", "basil"],
  pecoraIt: ["cheese", "olive"],
  olive: ["cheese", "carciofoIt"],
  vinoIt: ["ragu", "cheese"],
  italyBeef: ["quintoQuarto", "ragu"],
  italyChicken: ["cheese", "italyBeef"],
  mushrooms: ["pasta", "olive"],
  basil: ["romeMarket", "carciofoIt"],
  valliIt: ["lagunaIt", "seafood"],
  riceIt: ["casaVeneta", "valliIt"],
  granoIt: ["pasta", "friggitoria"],
  tomato: ["sicilyMarket", "granoIt"],
  lemon: ["pastry", "tonnaraIt"],
  mandorleIt: ["pastry", "lemon"],
  capperiIt: ["tonnaraIt", "sicilyMarket"],

  colosseoIt: ["panteonIt", "romeMarket"],
  panteonIt: ["colosseoIt", "gelateria"],
  quintoQuarto: ["ragu", "italyBeef"],
  gelateria: ["romeMarket", "pastry"],
  rialtoIt: ["seafood", "campanileIt"],
  campanileIt: ["rialtoIt", "bacaro"],
  etnaIt: ["pastry", "tonnaraIt"],
  carrettoIt: ["sicilyMarket", "vinoIt"],

  "stall-tomato": ["romeMarket", "tomato"],
  "stall-cheese": ["romeMarket", "cheese"],
  "stall-salumi": ["romeMarket", "italyBeef"],
  "stall-herbs": ["romeMarket", "basil"],
  "stall-oil": ["romeMarket", "olive"],
  trattoria: ["ragu", "quintoQuarto"],
  pizzeria: ["oven", "pasta"],
  "stall-lemon": ["sicilyMarket", "lemon"],
  "stall-tomato2": ["sicilyMarket", "tomato"],
  "stall-arancini": ["friggitoria", "sicilyMarket"],
};

/** object id -> file stem in public/scenes/italy-food/, as written by scripts/scenes/import-italy.py.
 *  Thirteen cards, one per room; the stems are the rooms' short names, not the object ids. A market child
 *  that opens its own card and has no rendered badge of its own falls back to its market's picture;
 *  `stall-arancini` keeps its rendered badge of three rice balls, which is its own food. */
export const ITALY_CARD_ART: Record<string, string> = {
  "stall-tomato": "market",
  ragu: "trattoria",
  romeMarket: "market",
  pasta: "pasta",
  oven: "forno",
  cheese: "casale",
  seafood: "pescaria",
  bacaro: "bacaro",
  lagunaIt: "laguna",
  casaVeneta: "veneto",
  friggitoria: "friggitoria",
  sicilyMarket: "ballaro",
  pastry: "pasticceria",
  tonnaraIt: "tonnara",
};

type Area = WorldObject["area"];

type Room = {
  id: string;
  kind: Kind;
  area: Area;
  name: string;
  zh: string;
  emoji: string;
  pos: [number, number];
  rot: number;
  prop: string;
  scene: string;
  placeName?: string;
  open?: "card" | "reveal";
  /** Room approach override (graph.ts `approach`), set only where something that cannot move fills the default one. */
  approach?: WorldObject["approach"];
  tagline: string;
  blurb: string;
  partners?: string[];
  match: (r: EnrichedRecipe) => boolean;
};

/** The thirteen objects that open a painted room. Each card ends with its story depth. */
const rooms: Room[] = [
  {
    id: "ragu", kind: "technique", area: "rome", name: "The trattoria", zh: "Trattoria", emoji: "🍲",
    pos: [-32.55, -17.2], rot: 0, prop: "trattoria", scene: "it_trattoria", placeName: "Trattoria",
    // Re-cluster pass, 2026-09-23: from the far end of the orbit (azimuth -0.75) the room flight ended inside the chestnut crowns of the porcini wood; the approach
    // always comes in from the south, where the lane in front is open.
    approach: { yaw: 0 },
    tagline: "The slaughterhouse is outside the door, and this is what it sends in.",
    blurb: "A family dining room in Testaccio, under the wall of the municipal slaughterhouse, with a marble counter, a coal range, a lime-washed wall and six tables. Rome became the capital of the new kingdom on 3 February 1871 and immediately became a building site; the quarter outside this door is part of that, thrown up in phases from 1883 around the cattle market and the yards that opened at Testaccio around 1890.\n\nWhat the yards send in is the quinto quarto, the fifth quarter: what is left when the four saleable quarters have gone to paying customers. Oxtail, tripe, sweetbreads, tail, head and trotters, cooked long and seasoned hard — coda alla vaccinara in tomato and celery, trippa alla romana with wild mint and grated pecorino. The pasta beside them needs nothing from the yards at all: cacio e pepe is pecorino and black pepper worked into the pasta water, and its ancestor alla gricia adds only cured pig cheek.\n\nThe wine comes in a ringed glass carafe, a foglietta, and is poured into a thick tumbler; there is no flask in a raffia basket and no checked cloth, because both are mid-twentieth-century restaurant decoration. Carbonara is not here either: it is unrecorded before a Chicago guide of 1952 and an Italian magazine recipe of 1954, and it is absent from the Roman cookbooks of 1930 and the standard Italian one of 1950.",
    partners: ["oxtail", "pecorino", "guanciale", "black pepper", "celery"],
    match: (r) => r.place === "trattoria" || has(r.techniques, /ragu/),
  },
  {
    id: "romeMarket", kind: "place", area: "rome", name: "Campo de' Fiori market", zh: "Campo de' Fiori", emoji: "🧺",
    pos: [0.8, -4.55], rot: 0, prop: "italyMarket", scene: "it_market", open: "reveal",
    // Re-cluster pass, 2026-09-23: the Trevi stands 3.25 in front of the stalls, so the room approach flies in high
    // and looks down over the fountain's attic onto the Campo instead of flying low into the basin.
    approach: { dist: 12, pitch: 0.75 },
    tagline: "A vegetable market under a statue put up in 1889.",
    blurb: "Trestles, canvas shades and crates on the paving of a piazza that has held Rome's food market since 1869, when it moved here from Piazza Navona. Rome's cooking starts with vegetables rather than with meat, and this is where the day begins: artichokes in pyramids, chicory and puntarelle, broad beans, wild mint, ricotta drained in rush baskets, and a brass balance swinging on its hook.\n\nThe artichoke is the piece of business. The Roman head is the cimarolo, flat, spineless, at least ten centimetres across, and it is trimmed here on the stall: a knife turns the head against the thumb until only the pale heart and a hand's length of stalk are left, and the leaves fall into a basin of lemon water. Two kitchens fight over it — the Christian one braises it upside down with mentuccia and garlic, the Jewish one opens it out and fries it twice until every leaf snaps.\n\nAt the centre of the square stands Ettore Ferrari's bronze of Giordano Bruno, hooded, holding a book, unveiled on 9 June 1889 on the spot where Bruno was burned in 1600. It is the youngest thing in the piazza and the one that dates any picture of it. Insalata caprese, which a visitor may look for on these trestles, is a Capri dish of the nineteen-twenties and is forty years away.",
    partners: ["artichoke", "ricotta", "puntarelle", "broad beans", "wild mint"],
    match: (r) => r.place === "romeMarket",
  },
  {
    id: "pasta", kind: "place", area: "rome", name: "The pasta kitchen", zh: "Il tirasfoglia", emoji: "🍝",
    pos: [-9.0, -1.9], rot: 0, prop: "pastaWorkshop", scene: "it_pasta", placeName: "Pastificio",
    tagline: "One board, one long pin, and a sheet you can read light through.",
    blurb: "A ground-floor workroom off the piazza: a floured board the size of a door, a rolling pin a metre long, a wire-strung frame leaning against the wall and a shaft of daylight full of flour. Two trades stand in this one room and they use different wheat. The board is soft wheat and egg, worked, rested and rolled out until light shows through the sheet; the sacks against the wall are durum semolina, which is the dried trade's raw material and not this kitchen's.\n\nThe sheet is folded over on itself in a loose roll, cut across with a long knife, and the ribbons lifted on the back of the hand and shaken loose into nests. Through the nineteenth century a Roman said maccheroni and meant exactly that, a ribbon off a sheet; the word only narrowed to the tube later. The strung frame does the other Roman shape: a sheet laid over the wires and pressed through with the pin, so the strings come out square-cut rather than round.\n\nThe dried maccheroni in the sack came up by rail from Naples, off a coast whose towns were laid out around the drying of it. Whether much of it reached a Roman shop in these decades is not established and is not claimed here. The difference the room cares about is simpler: the sack will keep for a year, and the ribbons on the board are cooked the day they are cut.",
    partners: ["soft wheat", "egg", "semolina", "pecorino", "black pepper"],
    match: (r) => italian(r) && has(r.core, /pasta|lasagn/),
  },
  {
    id: "oven", kind: "technique", area: "rome", name: "The forno", zh: "Forno a legna", emoji: "🔥",
    pos: [10.0, -3.0], rot: 0, prop: "pizzeria", scene: "it_forno", placeName: "Forno",
    tagline: "Bread once a week, and a long white sheet to test the heat.",
    blurb: "A domed brick oven in a vaulted room off the street, its mouth open and glowing, a wooden peel three metres long, a marble counter and a rack of cooling loaves. This is the quarter's oven rather than one household's: it bakes the neighbourhood's bread, it bakes for the trattoria kitchens that have no oven of their own, and on the right night it takes a whole pig.\n\nThe long white sheet coming out on the peel is pizza bianca — dough stretched flat, dimpled with the fingers, oiled and salted and baked fast on the oven's floor. It began as the baker's way of reading the heat before the bread went in, and it is sold by the length, cut with shears, folded once and eaten in the hand. Pizza rossa is the same sheet with tomato on it. Neither has cheese and neither is round.\n\nThe round pizza with tomato, mozzarella and basil is Naples', and Naples is not on this table. Its most famous story does not hold either: the 1889 letter that is the only evidence a Margherita was made for the queen has been compared with the royal household's own signatures, seals and stationery and matches none of them. Once a year the oven cools slowly overnight around a porchetta — a boned pig, salted, filled with rosemary and pepper and roasted on falling heat until morning.",
    partners: ["soft wheat flour", "olive oil", "salt", "tomato", "rosemary"],
    match: (r) => r.place === "pizzeria" || has(r.techniques, /oven|dough/),
  },
  {
    id: "cheese", kind: "place", area: "rome", name: "The casale", zh: "Il casale", emoji: "🧀",
    pos: [-25.75, -17.2], rot: 0, prop: "dairy", scene: "it_casale", placeName: "Casale",
    tagline: "A cold room: curd, whey, salt and months.",
    blurb: "A whitewashed farmstead on the Agro Romano with the fold on one side, the press in the middle and the oil jar in the corner: one yard that makes cheese, presses olives and keeps the wine for the house. Nothing in this room is hot. There is no range, no fire and no steam anywhere in it — the work is a knife, a cloth, a wooden press, salt and time, and the only liquid moving is whey.\n\nEwe's milk is set with rennet and the curd cut fine with a wire harp, because the finer it is cut the more whey runs out and the longer the cheese will keep. The curd is gathered into a cloth, pressed, and dry-salted by hand over months until a wheel will hold for a year without cold. The whey is not thrown away: put back on the fire in the next room until it flowers, it becomes ricotta, which is why a dairy sells two things and wastes neither.\n\nThe cheese this yard is the archetype of had already gone abroad by the time this door was painted, and the story below says where. The oil in the jar comes from the Sabina hills to the north-east and goes on food raw, never into the pan; the flock outside is what the Campagna was grazed for; and the cart in the corner of the yard goes down to Rome tonight, after dark, with the wine.",
    partners: ["sheep's milk", "rennet", "salt", "ricotta", "olive oil"],
    match: (r) => italian(r) && (has(r.core, /pecorino|cheese|ricotta|parmesan|mozzarella|provolone/) || has(r.protein, /cheese/)),
  },
  {
    id: "seafood", kind: "place", area: "venice", name: "The Rialto fish market", zh: "La Pescaria", emoji: "🐟",
    pos: [25.8, -17.4], rot: 0, prop: "fishMarket", scene: "it_pescaria", placeName: "Pescaria",
    tagline: "Wet marble under a plain iron roof, at first light.",
    blurb: "Marble slabs running wet under a plain iron canopy on cast-iron columns, the water a step away and the light grey and flat. This is the fish market at the Rialto at the hour it works, which is the hour before the city is up. That canopy is all there is over the fish: the neo-Gothic stone loggia a visitor pictures over this market is, in these years, an unbuilt drawing.\n\nOn the slabs: sardines tipped out of a basket and spread along the stone with the flat of a hand, live green crabs moving in a box, cuttlefish with the ink sac still in them, eel, grey mullet, bass, and the spider crab that will be picked and dressed in its own shell. Almost nothing here is hot and almost nothing has tomato in it. What Venice does to fish is vinegar, onion, raisins and pine nuts — saòr — or ink over white polenta, or salt and wind.\n\nThe market has stood on these stones for eight centuries, and the trades are still written into the street names around it — greens in one calle, citrus in the next, then meat, cheese, fish, and along the water wine, iron and coal. The boats land at the steps behind the slabs while it is still dark: the lagoon's own catch from Burano and Murano, the sea's from Chioggia and Pellestrina.",
    partners: ["sardines", "cuttlefish", "onion", "vinegar", "white polenta"],
    match: (r) => italian(r) && has(r.protein, /fish|prawn|shrimp|seafood|clam/),
  },
  {
    id: "bacaro", kind: "dish", area: "venice", name: "The osteria", zh: "Ostaria", emoji: "🍷",
    pos: [32.95, -17.2], rot: 0, prop: "bacaro", scene: "it_bacaro", placeName: "Osteria",
    tagline: "Six dishes, a cask with a brass tap, and a glass filled half way.",
    blurb: "A low room off a calle with a counter, a cask on a stand with a brass tap in it, an oil lamp on a chain and six dishes and no more: whipped salt cod on grilled polenta, sardines under vinegared onions, boiled egg, beans, salt meat, and something fried. This is an osteria — in the period's own grading of Venetian wine houses, the one where a customer both drank and ate.\n\nThe grading matters, because the shop next door is not the same shop. A caneva or a magazen sells wine retail and a man may drink there but not eat; a malvasia sells the sweet Greek-island wines; a bastion lends against pawned goods and pays part of the loan in wine. This room is the grade where a plate is allowed, which is why there is a hearth at the back of it and why the dishes on the counter are cold ones that will keep all day.\n\nThe measure is the room's whole rhythm. A small glass filled half way is drawn from the tap, drunk standing at the counter, paid for with ten centesimi, and the drinker goes back to work; nobody orders a second thing. What the modern city calls a bàcaro, with twenty small plates on toothpicks along the counter, is neither this shop nor this century, and there is no spritz here either: Aperol was created in 1919 and the word is not in print before 1972.",
    partners: ["stockfish", "white polenta", "sardines", "onion", "wine"],
    match: (r) => italian(r) && has(r.core, /wine|anchov|cod/),
  },
  {
    id: "lagunaIt", kind: "place", area: "venice", name: "The lagoon kitchen", zh: "Cusina de laguna", emoji: "🦀",
    pos: [21.1, -28.3], rot: -0.07, prop: "buranoKitchen", scene: "it_laguna", placeName: "Casa da pescador",
    tagline: "A fisherman's house on Burano, and three foods that exist nowhere else.",
    blurb: "A fisherman's house on Burano with its door open onto the canal, a floating cage at the step, a pan of oil on the fire and white polenta keeping warm. The family lives off three things the lagoon makes and nowhere else does: the crab that moults, the goby that nobody else wants, and the first artichoke shoot off Sant'Erasmo.\n\nThe crab is the moeca, and it is only a moeca for a day. The rest of the year it is an ordinary green crab worth almost nothing, so this is not fishing so much as watching: the catch is gone through by hand, the few that will shed this week are kept in the cage at the step and the rest go back over the side. On the morning they shed, they come out of the water into a bowl of beaten egg, then into flour, then into the pan, and they are eaten whole.\n\nThe rest of the table is whatever the water and the islands have given this week. A goby out of the mud, boiled down and sieved into a risotto the house rates far above the fish itself; a bowl of small purple artichokes off the market boat, in season for a fortnight and then gone for a year; white polenta, not yellow, which is what the lagoon eats with fish; and one pan of oil, which is the only hot thing in the room. Behind the door there are nets on a rack, oars against the wall, and a floor a step above the tide.",
    partners: ["soft-shell crab", "goby", "castraura", "white polenta", "egg"],
    match: (r) => italian(r) && has(r.core, /crab|fish|rice|risotto/),
  },
  {
    id: "casaVeneta", kind: "place", area: "venice", name: "The farm kitchen", zh: "Cusina de campagna", emoji: "🌽",
    pos: [23.8, 3.8], rot: 0, prop: "venetoFarm", scene: "it_veneto", placeName: "Cusina",
    tagline: "Maize in the copper, and the illness that came with it.",
    blurb: "A dark farm kitchen on the terraferma behind the lagoon: a hooded hearth, a copper on a chain over the fire, a long stick turning in it, a board with a cutting thread laid across it and a split red chicory on the table. This is the room that makes Venice honest. The lagoon eats fish and the city eats what the Rialto sells; the plain behind them eats maize.\n\nThe polenta is turned by hand for the best part of an hour until it comes away from the copper in one mass, then poured out onto the board and cut with a wire or a thread, never with a knife. Cold, it is sliced and grilled. With it, on a good day, liver with onions, or beans, or a few small fish; on most days nothing else at all. The maize is eaten because it is what is left when the wheat has gone to market, and the arithmetic behind it is further down this card.\n\nThat diet had a consequence, and it is in this house. Pellagra shows first in spring as a rough red scaling on hands and neck — el mal de la rosa — then in the gut and in the mind; families hid it, because a household known to have it could not marry off a daughter. Nobody here knows what causes it; the doctors are still arguing. What the family can see is that the neighbours who went to Brazil stopped getting it.",
    partners: ["maize", "beans", "liver", "onion", "red chicory"],
    match: (r) => italian(r) && has(r.core, /polenta|maize|corn|bean/),
  },
  {
    id: "friggitoria", kind: "place", area: "sicily", name: "The friggitoria", zh: "Friggitoria", emoji: "🍟",
    pos: [-7.0, 20.15], rot: 0, prop: "friggitoria", scene: "it_friggitoria", placeName: "Friggitoria",
    tagline: "One pan of lard, and everything Palermo eats standing up.",
    blurb: "A hole in a wall in the Albergheria with a pan of lard over coals, a copper of boiled spleen beside it, a marble slab, a stack of sesame rolls and no chairs anywhere. Nearly everything this shop sells comes out of that pan, wrapped in paper and eaten in the street, and the whole trade is built on the fact that there is nowhere to sit.\n\nThe chickpea paste is cooked thick, spread thin on the marble to set, cut into squares with a knife and only then slid into the lard, which lifts and closes over them: panelle, packed hot into a split roll with a squeeze of lemon. Beside them, potato croquettes and, out of the copper, spleen and lung simmered soft and then browned in the same fat and packed into a sesame-topped vastedda — with caciocavallo or ricotta on it that roll is maritatu, married, and without cheese schettu, single. The man who sells it is the meusaro.\n\nNobody eating here is well fed and nobody is sitting down. The customers are porters, carters, market boys and the men off the Ballarò stalls a lane away. The other trade working this pavement is the acquaiolo, the water seller, with a board painted like a cart, a terracotta quartara on his shoulder and a dozen glasses on a tray, who for one grano pours a glass of water with a thread of aniseed in it.",
    partners: ["chickpea flour", "lard", "spleen", "sesame roll", "lemon"],
    match: (r) => italian(r) && has(r.core, /chickpea|potato|lemon/),
  },
  {
    id: "sicilyMarket", kind: "place", area: "sicily", name: "Ballarò", zh: "Ballarò", emoji: "🐟",
    pos: [-15.2, 19.9], rot: 0, prop: "sicilyMarket", scene: "it_ballaro", open: "reveal",
    // Re-cluster pass, 2026-09-23: from the far end of the orbit (azimuth -0.75) the room flight ended inside the Albergheria house in the front row; the approach
    // always comes in from the south, where the lane in front is open.
    approach: { yaw: 0 },
    tagline: "The market is the kitchen, and the selling is sung.",
    blurb: "Patched canvas awnings on cane frames over a whole lane, hard sun coming through the gaps, wet cobbles, and a swordfish laid out on a slab with its cut face to the street. Ballarò runs the length of the Albergheria, and it is a kitchen as much as a market: raw produce on one board and something fried on the next.\n\nA pail of water is thrown across the fish and runs off the slab edge all morning, so the flesh stays bright and the dust stays off. The fish came off a small open boat in the Strait, taken with a harpoon from the bow while a lookout on the cliff above called it. Around it: sardines for beccafico, a bundle of wild fennel gathered off the hillsides, aubergine, caper buds in salt, and a board of estratto, tomato dried dark on boards in the sun for days.\n\nOver all of it carries the abbanniata, the vendors' sung sales cry, pitched to reach four stalls away and answered by the next man down the lane; a seller who cannot do it does not sell. How old any of this is, nobody can honestly say, and the story below says why not — including the market's own name, which has four competing derivations and no winner among them.",
    partners: ["swordfish", "wild fennel", "sardines", "aubergine", "tomato"],
    match: (r) => r.place === "sicilyMarket",
  },
  {
    id: "pastry", kind: "dish", area: "sicily", name: "The pasticceria", zh: "Pasticceria", emoji: "🍰",
    pos: [-24.3, 20.15], rot: 0, prop: "pasticceria", scene: "it_pasticceria", placeName: "Pasticceria",
    // Re-cluster pass, 2026-09-23: from the far end of the orbit (azimuth 0.75) the room flight ended inside the Albergheria house in the front row; the approach
    // always comes in from the south, where the lane in front is open.
    approach: { yaw: 0 },
    tagline: "Ricotta, almond and ice, sold against a calendar of feast days.",
    blurb: "A narrow shop with a marble counter, a brass lamp on a chain, a cloth piping bag, a tub of ice with a canister and a crank in it, and trays of shells waiting to be filled. There is no cold case and no electric light: cold in this shop means a tub packed with straw and snow, and the shop's year is a calendar of feast days rather than a week.\n\nSheep's ricotta is worked smooth with sugar and piped into a fried shell from the bag, and the ends are dipped in chopped pistachio — and it is done to order, because a filled shell goes soft by evening. Beside it a layered cake of sponge, sweetened ricotta and almond paste, cut to show its layers, which came out of convent kitchens and belongs to Carnival and Easter. The canister in the tub is turned and scraped by hand for the ices.\n\nThe ice in that tub is the most travelled thing in the room, and the record below says where it was cut and by whom. What the shop sells against is a calendar rather than a week: the layered cake at Carnival and at Easter, sugared almonds for a christening, a tray of small sweets for the second of November, ices from the first hot weather to the last, and a fried shell filled at the moment somebody asks for it. Nothing here is kept cold overnight and nothing is made in advance except the shells.",
    partners: ["sheep's ricotta", "almond", "pistachio", "sugar", "snow"],
    match: (r) => italian(r) && has(r.core, /ricotta|almond|sugar|pistachio/),
  },
  {
    id: "tonnaraIt", kind: "place", area: "sicily", name: "The tonnara kitchen", zh: "Tunnara", emoji: "🐠",
    pos: [29.9, 28.9], rot: 0, prop: "tonnara", scene: "it_tonnara", placeName: "Tonnara",
    tagline: "One fish, boiled, tinned and covered in oil, and nothing thrown away.",
    blurb: "A long lime-washed works building open to the sea through tall arches: three coppers on the boil, a hooked pole lowering a loin into the nearest one, a bench of women packing tins, and a jug of oil going into a tin over a lip in one unbroken thread. This is not a kitchen in a house. It is a factory that eats one animal, and in this band it is the most modern thing on the table.\n\nThe bluefin are taken in the trap in early summer and the works runs on what they bring. The loins are boiled first, then packed, covered with olive oil and closed, and that order of work is what turned a few weeks of slaughter into something that could sit in a shop a thousand miles away a year later. What is not tinned is salted, and what is neither is pressed: the roe sac is salted, weighted and dried until it is hard enough to shave.\n\nThe islands changed hands inside living memory, and this building is what the new owner put up when they did; the dates and the price are further down this card. What it means on the floor is that the men at the coppers are wage workers in a factory rather than fishermen with a share, and that the season now ends in a warehouse. Nothing of the tuna is thrown away, which is the trade's own sentence about itself.",
    partners: ["tuna", "olive oil", "salt", "bottarga", "onion"],
    match: (r) => italian(r) && has(r.core, /tuna|fish|olive oil/),
  },
];

export const ITALY_OBJECTS: WorldObject[] = rooms.map((room) => ({
  id: room.id,
  world: "italy" as const,
  area: room.area,
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
  open: room.open,
  tagline: room.tagline,
  blurb: room.blurb + "\n\n" + ITALY_STORY_DEPTH[room.id],
  partners: room.partners,
  match: room.match,
  ...(room.approach ? { approach: room.approach } : {}),
}));

// --- ingredient and flavour stops: a card, a 3D reaction, no room ---
ITALY_OBJECTS.push(
  {
    id: "carciofoIt", world: "italy", kind: "ingredient", area: "rome", name: "The artichoke beds", zh: "Carciofaia", emoji: "🌿",
    pos: [-22.7, -9.5], rot: 0, elevation: 0, prop: "carciofaia",
    tagline: "One vegetable, and two Roman kitchens that will not agree about it.",
    blurb: "Between the road and the river the ground is cut into long beds of artichokes, grey-green and knee high, each plant throwing up one central head and a ring of smaller ones behind it. The central head is the cimarolo, or mammola: flat-topped, spineless, at least ten centimetres across, and cut first so that the others grow.\n\nCultivation in central Italy is attested from the fifteenth century, arriving from Naples by way of Tuscany. The Etruscan claim, drawn from a tomb painting, is a legend. The IGP that now carries the Roman name dates only from 2002, and the cultivars it covers, Castellammare and Campagnano, are the beds you are standing in.\n\nRome cooks it two ways and both are in the piazza a mile from here. Alla romana, it is trimmed round, stuffed with wild mint and garlic and braised upside down in oil and water. Alla giudia, traced by tradition to the ghetto instituted in 1555, it is opened out like a flower and fried twice in deep oil until every leaf snaps.",
    partners: ["wild mint", "garlic", "olive oil", "lemon"],
    match: (r) => has(r.core, /artichoke/),
  },
  {
    id: "pecoraIt", world: "italy", kind: "ingredient", area: "rome", name: "The flock", zh: "Il gregge", emoji: "🐑",
    pos: [-28.8, -9.5], rot: 0, elevation: 0, prop: "sheepFold",
    tagline: "The animal the Campagna was grazed for.",
    blurb: "Dry grass, thistle and a low dry-stone fold: the Agro Romano was a nearly treeless expanse of grazing and grain worked by shepherds and day labourers, and the flock is what it was kept for. Milk in the morning, cheese in the dairy, lambs in spring, wool once a year, and mutton at the end of an animal's working life.\n\nThe cheese the flock is famous for had already moved. Pecorino Romano's archetype is placed on this high plain, but by the end of the 1800s Sardinia had displaced the Rome area as the main production centre, with the technique carried there for the Sardinian breed's milk. No export date, tonnage or American port is given here, because none could be verified inside this band.\n\nThe long walk between summer and winter pasture, the transhumance along the drove roads from Abruzzo, is asserted in every account of this landscape and could not be traced to a museum or an archive, so it is written here as a well-known tradition rather than as a record.",
    partners: ["pecorino", "ricotta", "wild mint", "salt"],
    match: (r) => has(r.protein, /lamb|mutton/) || has(r.core, /pecorino/),
  },
  {
    id: "olive", world: "italy", kind: "ingredient", area: "rome", name: "The olive mill", zh: "Il frantoio", emoji: "🫒",
    pos: [-42.4, -9.5], rot: 0, elevation: 0, prop: "oliveGrove",
    tagline: "An upright stone wheel, and oil that goes on food raw.",
    blurb: "Olives from the Sabina hills come down in November in baskets and go under an upright stone wheel turning in a stone trough, driven by a mule walking a circle. The paste is spread on round mats, stacked, and pressed; what runs out is separated in stone vats and stored in glazed jars in the coolest room of the farm.\n\nSabina oil received DOP recognition by EC Regulation 1263/96 on 1 July 1996 — cited as the first Italian olive-oil denomination, covering thirty-two comuni in the province of Rieti and fifteen in the province of Rome. That mark is modern; the cultivation is not. The Sabina groves are named by Strabo, by Cato and by Horace, which is a literary record rather than an agricultural one and is worth exactly that much.\n\nIn a Roman kitchen this oil is mostly used raw: over bread, over boiled greens, over beans, over a plate of fish. A farm that makes cheese also presses oil, and the two share a yard.",
    flavour: ["grassy", "peppery", "fruity"],
    partners: ["bread", "greens", "beans", "artichoke"],
    match: (r) => has(r.core, /olive oil|vinaigrette/),
  },
  {
    id: "vinoIt", world: "italy", kind: "ingredient", area: "rome", name: "The wine cart", zh: "Il carrettiere a vino", emoji: "🍇",
    pos: [-26.05, -2.3], rot: 0, elevation: 0, prop: "wineCart",
    tagline: "Into Rome by night, in convoys of three, until October 1917.",
    blurb: "A two-wheeled cart with a curved hooded awning over it, a mule in the shafts: this is how the white wine of the Castelli Romani reached the city's taverns. The load is about five hundred litres, carried as ten barrels of fifty or eight of about sixty, and it goes down after the March and April racking.\n\nThe carts travelled at night, in convoys of three or four for protection against bandits on the road, reaching the customs barriers at dawn and returning empty in the evening with the carter asleep under the hood. The trade ended on a date: from October 1917 a new cooperative of innkeepers moved the wine by lorry instead, so a cart is correct for every year of this band and a motor vehicle is not.\n\nWhat the cart delivers is measured in glass at the other end. Rome's wine measures were regulated by Sixtus V in 1588 against short pouring, and the foglietta in that series is a half litre, with a notch in the glass to mark the correct level. It is what the cart came for.",
    partners: ["trattoria", "bread", "pecorino", "olive oil"],
    match: (r) => has(r.core, /wine/),
  },
  {
    id: "italyBeef", world: "italy", kind: "ingredient", area: "rome", name: "The pig and the ox", zh: "Il porco e il bue", emoji: "🐄",
    pos: [-39.2, -2.3], rot: 0, elevation: 0, prop: "cow",
    tagline: "Four quarters go to the buyers, and the fifth stays in the quarter.",
    blurb: "An ox in a walled yard and pigs under a lean-to: the two animals a Roman kitchen of this period actually cooks, and mostly not as steaks. Through the nineteenth century Italian meat consumption averaged roughly a kilo a head a month: meat is a seasoning or a feast, not a daily plate.\n\nThe pig's contribution is fat and cure. The jowl becomes guanciale, salted, peppered and hung until it slices translucent, and it is the fat that starts alla gricia and amatriciana; the back fat becomes lard, the cooking medium of the whole south. The ox's contribution is the fifth quarter: what is left when the four saleable quarters have gone — tail, tripe, sweetbreads, trotters, head — and what the trattoria cooks.\n\nThe slaughterhouse those quarters come off opened at Testaccio around 1890, on a site chosen for the road, the river port and the railway. That the vaccinari, the hide-strippers, were paid in offal rather than in cash is well-attested tradition rather than a wage record.",
    partners: ["guanciale", "lard", "oxtail", "tripe", "black pepper"],
    match: (r) => has(r.protein, /beef|pork/) || has(r.core, /salami|beef|pork|guanciale/),
  },
  {
    id: "italyChicken", world: "italy", kind: "ingredient", area: "rome", name: "The yard", zh: "Il pollaio", emoji: "🐓",
    pos: [-32.55, -2.3], rot: 0, elevation: 0, prop: "chicken",
    tagline: "Kept for eggs, killed for a feast: that is most of what chicken meant.",
    blurb: "A wired corner of the farmyard with a low hut, a scatter of hens and one bad-tempered cockerel. A hen in this period is a machine for turning kitchen scraps and yard grubs into eggs, and it is eaten when it stops being one, or when there is something to celebrate.\n\nThe eggs are the everyday product and they are counted. They go into fresh pasta on the board a few miles away, into a frittata with wild greens or onions, into the sweet things a household makes at Easter. An old bird goes into the pot for broth, and the broth carries the week's pasta.\n\nNo dated Roman record for the farmyard bird was sought or found in this research, and none is invented here: the card rests on the regional food-culture sources for what peasant households ate in these decades — bread and something with it, pulses, greens, cheese, and meat occasionally. What the yard reliably gives is eggs, feathers for a mattress, and manure for the artichoke beds.",
    partners: ["egg", "broth", "lemon", "rosemary"],
    match: (r) => has(r.protein, /chicken/),
  },
  {
    id: "mushrooms", world: "italy", kind: "ingredient", area: "rome", name: "The chestnut wood", zh: "Il castagneto", emoji: "🍄",
    pos: [-35.6, -9.5], rot: 0, elevation: 0, prop: "porciniWood",
    tagline: "Porcini under the chestnuts, threaded on strings for the year.",
    blurb: "Sweet chestnuts on the higher ground west of the farms, and porcini coming up under them after the autumn rain. The wood is worked for two crops. The chestnut is the older and the more important of them: through the nineteenth century the poorest households of the Italian hills lived on bread, polenta, pulses, potatoes and chestnuts, and a chestnut wood was a granary that needed no ploughing.\n\nThe mushrooms are the year's small luxury. Picked in the morning, the sound ones are sliced and threaded on string to dry over the hearth, and a handful of them soaked in warm water will carry a pot of pasta in February when there is nothing green anywhere. Fresh, they are sliced thin over the sheet pasta rolled in the town, or grilled whole over coals like a cut of meat.\n\nNo dated record for either crop in this exact band was found, so no date is given: what the card rests on is the regional food-culture reading of what these hills produced and what households actually ate.",
    partners: ["pasta", "garlic", "olive oil", "parsley"],
    match: (r) => has(r.core, /mushroom|porcini/) || has(r.mainIngredient, /Mushroom/),
  },
  {
    id: "basil", world: "italy", kind: "flavour", area: "rome", name: "The herb bed", zh: "L'orto degli odori", emoji: "🌱",
    pos: [10.0, 2.9], rot: 0, elevation: 0, prop: "herbGarden",
    tagline: "Wild mint, rosemary, and the bitter greens Rome actually eats.",
    blurb: "A walled bed behind the market with basil in pots, rosemary hardened into a low bush, bay, sage, and trays of cut greens waiting to go onto the trestles. Roman seasoning is short: one or two herbs at a time, put in late, and no more.\n\nThe most Roman thing in the bed is the smallest. Mentuccia, a wild mint with a leaf the size of a fingernail, is what goes inside a braised artichoke, and nothing else does the same job. Beside it grow the bitter things the city actually eats: chicory, and puntarelle, the hollow shoots of a chicory, split into curls in cold water and dressed with anchovy, garlic and vinegar.\n\nNone of these has an in-band printed recipe behind it. Puntarelle, trippa alla romana and carciofi alla romana are all documented in twentieth-century Roman cookbooks, with Ada Boni's of 1929 and 1930 the usual anchor, and no nineteenth-century printed source could be found for any of them.",
    flavour: ["bitter", "fresh", "peppery"],
    partners: ["artichoke", "anchovy", "garlic", "olive oil"],
    match: (r) => has(r.core, /basil|pesto|parsley|herb|oregano/),
  },
  {
    id: "valliIt", world: "italy", kind: "ingredient", area: "venice", name: "The fish valli", zh: "Le valli da pesca", emoji: "🎣",
    pos: [27.3, -9.4], rot: 0, elevation: 0, prop: "valliPesca",
    tagline: "Shallow water walled into basins, and the fish walk in by themselves.",
    blurb: "The far end of the lagoon is walled into shallow basins with reed fences, a low brick keeper's house standing on the bank and a line of poles running off into the haze. This is fish farming of a kind that needs no feeding: the fences, grisiole, are vertical reed screens that hold fish in while letting the tide through, and the lavorieri are funnel traps set where the fish run.\n\nThe practice is documented a very long way back. Evidence for the valli goes to 997; the reed fences appear in concessions of 1131, 1174 and 1196; and a decree of 1314 banned taking young mullet and gobies until late June, which is a conservation rule seven centuries old. What comes out is eel, grey mullet, bass, gilthead and goby, taken at the seasonal runs rather than hunted.\n\nBefore the First World War the lagoon and the valli together produced roughly as much fish as the open sea did, which is why the Rialto slabs a few miles away carry two different catches side by side.",
    partners: ["eel", "grey mullet", "bass", "white polenta"],
    match: (r) => italian(r) && has(r.protein, /fish|eel/),
  },
  {
    id: "riceIt", world: "italy", kind: "ingredient", area: "venice", name: "The rice fields", zh: "Le risare", emoji: "🌾",
    pos: [31.0, 3.8], rot: 0, elevation: 0, prop: "riceFieldItaly",
    tagline: "Flooded fields, the women who weeded them, and a law of 1907.",
    blurb: "Flat water to the horizon, divided by low banks, mirroring the sky: rice reached the lowlands of provincial Verona early in the sixteenth century, and marshland was converted under the Venetian Senate's own commission for uncultivated land, established in 1545.\n\nThe weeding was done by women standing in water to the knee, the mondine, and it is the part of this field with a legal record. The law of 16 June 1907 barred children under thirteen and pregnant women from the paddies, limited work to nine hours for children of thirteen to fifteen and for females up to twenty-one, and required free quinine and free medical assistance for every rice worker.\n\nNo single variety belongs on this card. The government's own statistical monograph of 1889 lists Nostrale, Novarese, Bertone, Mellone, Mutico, Giapponese, Peruviano and Chinese types growing side by side, and Vialone Nano, the rice a modern Veneto risotto is made with, was first cultivated in 1937 and reached Verona in 1945.",
    partners: ["butter", "broth", "peas", "goby"],
    match: (r) => has(r.core, /risotto|\brice\b/),
  },
  {
    id: "granoIt", world: "italy", kind: "ingredient", area: "sicily", name: "The wheat and the latifondo", zh: "Il feudo", emoji: "🌾",
    pos: [8.4, 26.3], rot: 0, elevation: 0, prop: "wheatLatifondo",
    tagline: "A great estate, a middleman, and an island that started exporting people.",
    blurb: "Durum wheat in unfenced blocks running to the horizon: the latifondo persisted in Sicily from late antiquity until the agrarian reform of the 1950s. The gabellotto leased the estate and sublet it in strips to peasants, and in practice he was the real power on the ground.\n\nThe grain economy turned over inside this band. Sicily held Mediterranean primacy in durum until unification and then went from net exporter to net importer under American and Russian competition, while the island's population rose from 2,392,000 in 1861 to 3,530,000 in 1901. More people, less trade, and no land: that arithmetic is why more than thirteen million Italians left the country between 1876 and 1915.\n\nUnder the wheat lay the other export. Franchetti and Sonnino appended a chapter on child labour in the sulphur mines to their inquiry of 1876: boys were employed from the age of seven and most commonly between eight and eleven, carrying sulphur on their backs for up to ten hours a day.",
    partners: ["semolina", "bread", "olive oil", "chickpea flour"],
    match: (r) => has(r.core, /flour|semolina|wheat|bread/),
  },
  {
    id: "tomato", world: "italy", kind: "ingredient", area: "sicily", name: "The tomato beds", zh: "I pomodori", emoji: "🍅",
    pos: [-13.6, 26.4], rot: 0, elevation: 0, prop: "tomatoField",
    tagline: "Dried dark on boards in the sun, years before a cannery took it.",
    blurb: "Low beds of plum tomatoes at the west end of the lane, staked and watered, with wooden boards set out beside them in the sun. Tomato in 1890 is a young ingredient in Italian cooking and a northern industry, and half of Rome's classic dishes and all of Venice's have none in them at all.\n\nWhat the island did with a glut, before there was anywhere to sell it, was concentrate it. The fruit is cooked down, sieved, salted and spread thin on boards to dry in the sun for days until it darkens to a paste stiff enough to cut — estratto, a spoonful of which will carry a pot of sauce in January. It is the same instinct as the salt pan and the caper jar: the sun is the preserving machine.\n\nThe industry that eventually took over is dateable. Francesco Cirio opened a canning factory in Turin in 1856 — his first product was peas, not tomatoes — and opened his first tomato cannery at Naples in 1875; by his death in 1900 there were more than a hundred preserving companies in Italy.",
    partners: ["olive oil", "garlic", "basil", "aubergine"],
    match: (r) => has(r.core, /tomato/),
  },
  {
    id: "lemon", world: "italy", kind: "ingredient", area: "sicily", name: "The lemon grove", zh: "Il giardino di limoni", emoji: "🍋",
    pos: [8.4, 20.0], rot: -0.09, elevation: 0, prop: "citrusGrove",
    tagline: "The most profitable hectare in Europe, and the trouble that came with it.",
    blurb: "A walled garden of lemon trees with a stone water tank in the corner and channels cut between the rows. The Conca d'Oro behind Palermo was reckoned the richest agricultural land in Europe by the hectare.\n\nThe trade was built on scurvy. Between 1795 and 1814 the British Admiralty issued 1.6 million gallons of lemon juice to its fleet. In the 1850s roughly eighty square kilometres of Sicily were under lemons, producing about 750,000 cases a year, and thirty years later those figures had more than tripled.\n\nThat much money in a landscape with weak law had a consequence that is now measured rather than asserted. A study of 2017, across 143 Sicilian municipalities in a parliamentary inquiry of 1881 to 1886, finds that citrus production raised the probability of a strong mafia presence by roughly twenty percentage points. The blood orange is only just appearing: the Tarocco is believed to have arisen from a bud mutation found at Francofonte at the end of this century.",
    partners: ["fish", "almond", "sugar", "snow"],
    match: (r) => has(r.core, /lemon|orange|citrus/),
  },
  {
    id: "mandorleIt", world: "italy", kind: "ingredient", area: "sicily", name: "The almond grove", zh: "Il mandorleto", emoji: "🌰",
    pos: [15.9, 19.7], rot: 0, elevation: 0, prop: "almondGrove",
    tagline: "A variety selected in this very century, and the milk pressed out of it.",
    blurb: "Almond trees on dry terraces above the coast, bare-branched and flowering in February before anything else does, then netted and beaten in August so the nuts fall onto cloths. The hulls are dried, cracked with a stone or a wooden mallet in the yard, and the kernels sorted by hand into grades.\n\nThe island's best-known almond has a name and a date inside this band. The Pizzuta of Avola was selected in the nineteenth century by the Avola botanist Giuseppe Bianca — a documented, dateable piece of work rather than a tradition — and the name “mandorla di Avola” covers three cultivars: Pizzuta, Fascionello and Corrente, also called Romana. Pizzuta is the flat, pointed one the confectioners want.\n\nWhat the pastry shops down the coast do with it is grind it with sugar into a paste stiff enough to model, or pound it and press it through cloth into almond milk, which is drunk cold in summer and keeps far better than dairy in a place with no ice worth speaking of.",
    partners: ["sugar", "ricotta", "pistachio", "lemon"],
    match: (r) => has(r.core, /almond|marzipan/),
  },
  {
    id: "capperiIt", world: "italy", kind: "flavour", area: "sicily", name: "The caper terraces", zh: "I capperi", emoji: "🧂",
    pos: [16.3, 27.4], rot: 0, elevation: 0, prop: "caperTerrace",
    tagline: "A flower bud picked before it opens, and an island's whole seasoning.",
    blurb: "Dry-stone terraces on volcanic ground with caper bushes growing out of the walls themselves, low and grey-green, and women working along them in the early morning with cloth bags at the waist.\n\nThe crop is a flower bud picked before it opens, and it has to be picked every few days through the summer or it flowers and is worthless. It is never eaten fresh: the buds are layered with coarse sea salt in a crock, turned, drained of their own brine and re-salted, and after a few weeks they carry the sharp, mustardy taste that is the whole seasoning of this coast.\n\nThe marks that now name them are recent. Pantelleria's capers were recognised as IGP in June 1996, among the first Italian products to receive it, and Salina's were a Slow Food presidium before entering DOP as the caper of the Aeolian islands. Only the marks are modern: the terraces, the salt crock and the picking round are what this island has always done with a plant that will grow in a wall.",
    flavour: ["salty", "sharp", "mustardy"],
    partners: ["swordfish", "tomato", "olive oil", "wild fennel"],
    match: (r) => has(r.core, /caper/),
  },
);

// --- landmarks and the two other card-only objects: a card and a 3D reaction, no recipes ---
ITALY_OBJECTS.push(
  {
    id: "colosseoIt", world: "italy", kind: "landmark", area: "rome", name: "The Colosseum", zh: "Il Colosseo", emoji: "🏛️",
    pos: [0.8, -11.0], rot: 0, elevation: 0, prop: "colosseum",
    // Twice its old size (2026-09-23): the card glide stands off 32 rather than 28 so the whole ring stays in frame.
    approach: { dist: 32 },
    tagline: "A ruin with swifts in it, at the end of a street of vegetable stalls.",
    blurb: "The amphitheatre stands at the far end of the quarter as it stood in 1900: two-thirds of the outer ring gone, the travertine warm and pitted, the arcades open to the sky and full of swifts at dusk.\n\nMuch of what surrounds it in this band is new rather than old. Rome became the capital on 3 February 1871 and immediately built: new avenues, new quarters at Prati and the Esquiline, a slaughterhouse and worker housing at Testaccio from 1883, and from 1888 the demolition of the ghetto. The ancient city stood still while the new one was thrown up around it, which is the real look of Rome in these decades.\n\nFor a food world it is a landmark in the plainest sense: it is what a visitor steers by. The stalls are set out within sight of it, the bakers' carts pass it before dawn, and the swifts that leave its arcades in a spiral at dusk are the same birds that scream over the piazza while the market packs up.",
    match: () => false,
  },
  {
    id: "panteonIt", world: "italy", kind: "landmark", area: "rome", name: "The Pantheon", zh: "Il Pantheon", emoji: "🏛️",
    pos: [-9.0, -13.4], rot: 0, elevation: 0, prop: "pantheon",
    tagline: "A temple with a hole in its roof, four streets from the market.",
    blurb: "A portico of grey granite columns, a bronze door, and behind it a dome with a round opening at the top that has never been glazed. The building has stood since antiquity and has been in continuous use, which is why it is intact where the amphitheatre is not; in this band it sits at the centre of a dense quarter of ochre houses, with a fountain and an obelisk in the small square in front of it.\n\nWhat it does all day is move light. The sun comes through the oculus as a hard disc and swings across the coffered ceiling, the wall and then the floor, and when it rains the rain comes in too and runs away through the drains cut in the pavement. Pigeons lift off the portico when the door is opened.\n\nIt belongs on a food map because of where it stands. The market on Campo de' Fiori is a few minutes' walk away, the pasta board and the forno are in the streets between, and this is the square people cross carrying a flat pizza folded in paper.",
    match: () => false,
  },
  {
    id: "quintoQuarto", world: "italy", kind: "technique", area: "rome", name: "The slaughterhouse", zh: "Il Mattatoio", emoji: "🔪",
    pos: [-39.25, -17.2], rot: 0, elevation: 0, prop: "mattatoio",
    tagline: "Four quarters are sold; the fifth is the quarter's own dinner.",
    blurb: "A long yellow-brick building with iron trusses, a covered hook line running the length of it. The municipal architect Gioacchino Ersoch's slaughterhouse and cattle market at Testaccio replaced the old one near Piazza del Popolo; sources give it as built between 1888 and 1891 and inaugurated in 1890, so it is written here as opened around 1890. The site was chosen for the Via Ostiense, the river port at Ripa and the railway, and the master plan of 1873 had already put industry and worker housing here.\n\nThe trade that grew around it is the reason this quarter cooks the way it does. The carcass was divided into four quarters for paying customers, and what remained — offal, innards, trotters, tail and head — was the quinto quarto, the fifth quarter.\n\nThe detail everyone repeats, that the vaccinari, the hide-strippers, were paid in offal rather than in cash, is well-attested tradition rather than a wage record, and it is written as tradition here.",
    match: () => false,
  },
  {
    id: "gelateria", world: "italy", kind: "dish", area: "rome", name: "The caffè", zh: "Il caffè", emoji: "☕",
    pos: [10.0, -15.0], rot: 0, elevation: 0, prop: "gelateria", placeName: "Caffè",
    tagline: "The one place in this world where the machine can be dated.",
    blurb: "A marble counter, a brass rail, a zinc-lined pail packed with ice and salt with a canister turning in it, and a tall machine at the end of the counter breathing steam. Men drink standing up, hat on, and leave.\n\nThe ices are made the old way and the ice itself is carted in. The canister is turned in the salted ice and the paddle scrapes the frozen skin off the inside wall until the whole mass is smooth.\n\nThe machine is the one object in this world with a patent number. Angelo Moriondo was granted a patent on 16 May 1884 for steam machinery to make coffee “in an economic and instantaneous” way, shown at the Turin expo of that year, but his were bulk devices found mostly around Turin and no example survives. Luigi Bezzera applied for the patent that added the portafilter and heat radiators on 19 December 1901, and Desiderio Pavoni bought it and founded La Pavoni in 1905. Single-cup bar espresso belongs to the last decade of this band and not before it.",
    match: () => false,
  },
  {
    id: "rialtoIt", world: "italy", kind: "landmark", area: "venice", name: "The Rialto bridge", zh: "Il Ponte di Rialto", emoji: "🌉",
    pos: [39.4, -22.8], rot: 0, elevation: 0, prop: "rialtoBridge",
    // The canal runs east–west under it, so from the south the card saw only its steps; from the south-east it shows
    // the arch over the water, the shops and the portico (2026-09-23), with open lagoon behind the camera.
    approach: { yaw: 0.75 },
    tagline: "One stone arch, two rows of shops, and the market at both ends.",
    blurb: "A single stone arch across the Grand Canal with two rows of small shops built along its deck and a stepped way between them, opening at the crown to a view up and down the water. It is the one object on this table that stands in water, because it must; everything else keeps to the bank.\n\nIt is there because the market is there. Venice's market was moved to the Rialto in 1097 and the district has been the city's commercial centre ever since, which is why the crossing was built where a crossing was most expensive to build.\n\nIn this band it has less company than a modern visitor would expect. The Accademia crossing was Alfred Neville's iron bridge from 20 November 1854 until 1933, and the Scalzi was another iron span until 1934, so the stone arch is the only one of its kind on the canal. Under it the traffic is oars: gondolas with a prow comb of four or five teeth, flat-bottomed sandoli, and the market barges coming down from the lagoon.",
    match: () => false,
  },
  {
    id: "campanileIt", world: "italy", kind: "landmark", area: "venice", name: "St Mark's campanile", zh: "Il Campanìo", emoji: "🔔",
    pos: [30.0, -27.6], rot: 0, elevation: 0, prop: "campanile",
    // 10.6 to the angel (2026-09-23): at 28 the spire leaves the top of the frame, at 36 the whole tower is in it.
    approach: { dist: 36 },
    tagline: "It fell at 9.53 in the morning on 14 July 1902.",
    blurb: "A square brick shaft with a belfry, a spire and a weathervane, standing free of the basilica at the edge of the great square, with the city's roofs and the lagoon laid out from the top of it. For most of this band the tower is a working bell tower whose bells mark the working day for a quarter that has no clocks in its kitchens.\n\nThen, on 14 July 1902, at 9.53 in the morning, it collapsed. It came down almost vertically, taking Sansovino's Loggetta at its foot and a corner of the library with it and killing nobody but the custodian's cat. The rebuilt tower — the same design, on the same footprint, in the old phrase “dov'era, com'era” — was inaugurated on 25 April 1912, St Mark's day. For nearly ten years of this period the square had a gap in it.\n\nThat gap is why this landmark belongs on a food map. The osteria and the fish market a few hundred metres away carried on either way, which is the other half of the story.",
    match: () => false,
  },
  {
    id: "etnaIt", world: "italy", kind: "landmark", area: "sicily", name: "Etna", zh: "A Muntagna", emoji: "🌋",
    pos: [23.5, 21.8], rot: 0, elevation: 0, prop: "etna",
    // The plume's crown leaves the top of the 28-unit frame; at 34 the cone and the plume are both in it.
    approach: { dist: 34 },
    tagline: "The island calls it the mountain, and it sold snow until this band ended.",
    blurb: "A broad dark cone with a plume leaning off the summit, snow on it through the winter, and black lava walls and black sand at its foot. Everything on its lower flanks grows unreasonably well on the broken lava, which is why a volcano is on a food map at all.\n\nIts oldest trade is cold. The neviere, snow pits three to six metres deep, were concentrated on these slopes and in the Madonie; snow was packed into them in layers with straw and brought down by mule at the end of spring. The trade died out in the early 1900s with industrial ice, so it is alive at the start of this band and finished by the end of it.\n\nThe other crop is the pistachio. Groves stand on the western and south-western flanks at roughly four hundred to nine hundred metres, grafted onto wild terebinth that will root in arid rock. The DOP that now names them was published only in October 2001, with its consortium established in 2004: the mark is modern, and the groves are not.",
    match: () => false,
  },
  {
    id: "carrettoIt", world: "italy", kind: "landmark", area: "sicily", name: "The painted cart", zh: "U carrettu", emoji: "🛒",
    pos: [-24.98, 27.15], rot: 0, elevation: 0, prop: "carretto",
    tagline: "A working vehicle with a load in it, not an ornament.",
    blurb: "Two tall wheels, a high box body, a carved and painted frame, and a mule leaning into the shafts with a plumed headstall. The Sicilian cart spread through the island in the early nineteenth century, when poor roads had until then limited transport to pack animals, and it is the vehicle that moved goods between the coast and the interior.\n\nThe painting has a documented date and a practical reason. Per the folklorist Giuseppe Pitrè, whose museum opened in Palermo in 1909, the painted decoration began to spread after 1830. It started as protection for the timber, gained saints and apotropaic symbols on the panels, and became a way of advertising the load and the owner: a cart is a shop sign that moves.\n\nWhat it is not is an ornament with flowers in it. The same economy on the mainland moved wine into Rome by night on a two-wheeled hooded cart, which is the object standing in the Roman cluster on the other side of the table.",
    match: () => false,
  },
);

// --- the markets' stall children and the two alias children: hit-only ---
// Lead decision on the second reviewer's item 51, 2026-09-23: a child with its own written card opens it,
// and a child whose card would only repeat its alias keeps the alias and carries no blurb. Two open their
// own card: `stall-tomato`, the Roman stall of passata and fresh crates, which until then opened Sicily's
// tomato beds, and `stall-arancini`, the fry barrow, which never had an alias. The other eight keep their
// alias — the cheese stall the casale, the salumi pole the pig and the ox, the herb stall the herb bed, the
// oil jars the olive mill, `trattoria` the trattoria, `pizzeria` the forno, the Sicilian lemons the lemon
// grove and the Sicilian tomatoes the tomato beds — because each card they had written said again what the
// alias's card says. The stalls face their market rather than the road.
ITALY_OBJECTS.push(
  {
    id: "stall-tomato", world: "italy", kind: "ingredient", area: "rome", name: "Tomatoes", zh: "Pomodori", emoji: "🍅",
    pos: [-1.7, -1.0], rot: 0, prop: "none", hitOnly: true, parent: "romeMarket",
    tagline: "The newest thing on the stall, and the one Rome uses least.",
    blurb: "A crate of plum tomatoes at the back of the horseshoe, and in winter a row of dark bottles of passata put up in August instead. On a Roman stall in these decades the tomato is the newest ingredient present and the one the city's own cooking leans on least.\n\nWhere it has arrived, it arrived as an industry rather than as a garden crop. Francesco Cirio opened a canning factory in Turin in 1856 — peas first, not tomatoes — and his first tomato cannery at Naples in 1875, and by his death in 1900 there were more than a hundred preserving companies in Italy.\n\nSo the stall sells it two ways. Fresh through the hot months, by the crate, for a sauce cooked in twenty minutes with garlic and oil; and preserved for the rest of the year, as bottled passata or as a dark paste sold by the spoon off a board. The beds it comes from are a morning's cart ride outside the walls, on the same river flats as the artichokes.",
    match: () => false,
  },
  {
    id: "stall-cheese", world: "italy", kind: "ingredient", area: "rome", name: "Cheese", zh: "Formaggio", emoji: "🧀",
    pos: [0.8, -0.2], rot: 0, prop: "none", hitOnly: true, parent: "romeMarket", alias: "cheese",
    tagline: "Ricotta in the morning, pecorino for the rest of the year.",
    blurb: "",
    match: () => false,
  },
  {
    id: "stall-salumi", world: "italy", kind: "ingredient", area: "rome", name: "Salumi", zh: "Salumi", emoji: "🥓",
    pos: [3.3, -1.0], rot: 0, prop: "none", hitOnly: true, parent: "romeMarket", alias: "italyBeef",
    tagline: "Cured pig cheek, lard, and the cheapest meat in the city.",
    blurb: "",
    match: () => false,
  },
  {
    id: "stall-herbs", world: "italy", kind: "flavour", area: "rome", name: "Basil & herbs", zh: "Erbe", emoji: "🌿",
    pos: [4.5, -3.6], rot: 0, prop: "none", hitOnly: true, parent: "romeMarket", alias: "basil",
    tagline: "Wild mint by the bunch, and chicory cut this morning.",
    blurb: "",
    match: () => false,
  },
  {
    id: "stall-oil", world: "italy", kind: "ingredient", area: "rome", name: "Olive oil", zh: "Olio", emoji: "🫒",
    pos: [-3.4, -3.9], rot: 0, prop: "none", hitOnly: true, parent: "romeMarket", alias: "olive",
    tagline: "Sold out of the jar, by the measure, into your own bottle.",
    blurb: "",
    match: () => false,
  },
  {
    id: "trattoria", world: "italy", kind: "landmark", area: "rome", name: "Pasta dishes", zh: "Primi", emoji: "🍝",
    pos: [-32.55, -17.2], rot: 0, prop: "none", hitOnly: true, parent: "ragu", alias: "ragu",
    tagline: "The first course, and the one the room is judged on.",
    blurb: "",
    match: () => false,
  },
  {
    id: "pizzeria", world: "italy", kind: "landmark", area: "rome", name: "Pizza", zh: "Pizza", emoji: "🍕",
    pos: [10.0, -3.0], rot: 0, prop: "none", hitOnly: true, parent: "oven", alias: "oven",
    tagline: "Sold by the length off the counter, cut with shears.",
    blurb: "",
    match: () => false,
  },
  {
    id: "stall-lemon", world: "italy", kind: "ingredient", area: "sicily", name: "Lemons & citrus", zh: "Limoni", emoji: "🍋",
    pos: [-18.8, 18.65], rot: 0, prop: "none", hitOnly: true, parent: "sicilyMarket", alias: "lemon",
    tagline: "The cheapest thing in the lane, and the island's richest export.",
    blurb: "",
    match: () => false,
  },
  {
    id: "stall-tomato2", world: "italy", kind: "ingredient", area: "sicily", name: "Tomatoes", zh: "Pomodori", emoji: "🍅",
    pos: [-11.6, 18.65], rot: 0, prop: "none", hitOnly: true, parent: "sicilyMarket", alias: "tomato",
    tagline: "Fresh for a few weeks, and dark paste on a board for the rest.",
    blurb: "",
    match: () => false,
  },
  {
    id: "stall-arancini", world: "italy", kind: "dish", area: "sicily", name: "Street food", zh: "Cibo di strada", emoji: "🍙",
    pos: [-15.2, 17.3], rot: 0, prop: "none", hitOnly: true, parent: "sicilyMarket",
    tagline: "A barrow with a pan on it, three things fried and nowhere to sit.",
    blurb: "A barrow pushed into the lane behind the market with a pan of lard on a charcoal box, a tray of rice balls waiting, a stack of paper and a lemon cut in half. Three things come off it: a fried rice ball, chickpea squares in a roll, and potato croquettes.\n\nThe rice ball is the one with a written record, and it is a surprising one. A Sicilian dictionary of the 1850s defines arancinu as a sweet dish of rice shaped like an orange; the savoury sense is attested in Antonino Traina's dictionary of 1868, and the Arab origin usually given for it is not documented — the reference article hedges it and records a competing view placing the dish in eighteenth-century southern Italy.\n\nWhat is certain is the economics. Everything is fried in lard because lard is cheaper than oil, everything is wrapped in paper because there are no plates, and everything is eaten standing because there is nowhere to sit. The barrow moves with the market, and when the awnings come down it goes too.",
    match: () => false,
  },
);

/** The two markets' own anchors, kept beside the stall positions so a reader can see they sit around
 *  them: the Roman stalls stand in a horseshoe behind the market, the Sicilian ones in a line behind it. */
export const ITALY_MARKET_ANCHORS: Record<string, [number, number]> = {
  romeMarket: [0.8, -4.55],
  sicilyMarket: [-14.1, 19.9],
};
