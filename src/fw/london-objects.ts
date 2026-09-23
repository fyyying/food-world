/** Britain objects (area id `london`, display name Britain): data only. Owned by the Researcher.
 *
 *  Positions are the shared-ground pass of 2026-09-23 (docs/london-world.md, "Shared-ground pass"), which
 *  replaced the Stage B blueprint coordinates: every stand has its own ground (a unit of clear footprint
 *  from every other stand), nothing stands over water but Tower Bridge and the oyster smacks, and every
 *  clickable is first on all ten of its arrival rays. Ids, kinds, props, scenes, names and purposes are the
 *  object list in the same document. Twenty-nine objects: thirteen that open a painted room, ten card-only
 *  ingredient and flavour stops, and six landmarks with a card and a 3D reaction. `londonEye` is retired
 *  and is not here; `redBus` and `phoneBox` keep their ids and are recast onto the 1907 omnibus with the
 *  hansom cab and onto the 1852 pillar box with the lamp; `roastPub` keeps its id, its `place` flag and the
 *  Beef Wellington recipe target, and is renamed "The public house", because a self-service carvery
 *  counter is a post-war restaurant format.
 *
 *  Rotation. `prop.rotation.y = obj.rot` (worldkit.ts), so `rot` 0 turns a stand's front to +z. The world is
 *  only ever seen from the +z side (main.ts sets the camera there and clamps its swing to plus or minus 0.75
 *  radians), so every stand's front faces the camera: `rot` is 0 for all of them except the oyster smacks,
 *  which lie at -0.1 along their mooring. A stand never turns toward a road; the roads in
 *  `london-landscape.ts` are laid to come to each front door, within 2.0 of it.
 *
 *  Blurbs follow the band written into docs/london-world.md, "Shared contract: the card blurb band":
 *  room objects three to four paragraphs of about 1,300 to 1,800 characters before their story depth is
 *  appended, card-only objects three paragraphs of about 750 to 1,000. The seven retained cards -
 *  `roastPub`, `pastryCe`, `mushroomsCe`, `bigBen`, `towerBridge`, `redBus`, `phoneBox` - were all a
 *  third to a quarter of that band and are rewritten here from nothing.
 *
 *  The period band is about 1880 to 1914. Dates describe records, not invented birthdays; legends are
 *  labelled; anything resting on repetition rather than on a document is written "reported", "is said to"
 *  or "traditionally". The curry house (Holborn 1911 at the earliest, the East End cafés from the 1920s),
 *  the Routemaster (1956), the K6 kiosk (1935) and the London Eye (2000) are outside the band and appear
 *  only as dated later developments, where docs/london-world.md says they should. */
import type { EnrichedRecipe, Kind, WorldObject } from "./graph";
import { LONDON_STORY_DEPTH } from "./london-stories";

const has = (list: string[], re: RegExp) => list.some((x) => re.test(x));
const brit = (r: EnrichedRecipe) => r.area === "london";

export { LONDON_STORY_DEPTH, LONDON_DISCOVERIES, LONDON_SOURCES, LONDON_BACKGROUND_SOURCES } from "./london-stories";

/** Two links per card, always to another Britain object. The room links are from research section 4. */
export const LONDON_NEXT: Record<string, string[]> = {
  roastPub: ["boroughUk", "hopsUk"],
  teaRoomUk: ["boroughUk", "roastPub"],
  boroughUk: ["roastPub", "oystersUk"],
  pieMashUk: ["oystersUk", "breakfastUk"],
  chippyUk: ["herringUk", "pieMashUk"],
  breakfastUk: ["oystersUk", "chippyUk"],
  lascarUk: ["boroughUk", "pieMashUk"],
  hopKitchenUk: ["hopsUk", "roastPub"],
  dairyUk: ["sheepUk", "boroughUk"],
  pastyUk: ["engineHouseUk", "orchardUk"],
  cocklesUk: ["leeksUk", "boroughUk"],
  smokehouseUk: ["herringUk", "oatsUk"],
  distilleryUk: ["oatsUk", "smokehouseUk"],

  pastryCe: ["roastPub", "boroughUk"],
  oystersUk: ["pieMashUk", "boroughUk"],
  hopsUk: ["hopKitchenUk", "roastPub"],
  mushroomsCe: ["roastPub", "pastryCe"],
  sheepUk: ["dairyUk", "oatsUk"],
  rhubarbUk: ["chippyUk", "boroughUk"],
  orchardUk: ["pastyUk", "engineHouseUk"],
  leeksUk: ["cocklesUk", "dairyUk"],
  oatsUk: ["distilleryUk", "smokehouseUk"],
  herringUk: ["smokehouseUk", "chippyUk"],

  bigBen: ["roastPub", "teaRoomUk"],
  towerBridge: ["boroughUk", "pieMashUk"],
  redBus: ["roastPub", "phoneBox"],
  phoneBox: ["teaRoomUk", "redBus"],
  forthBridge: ["smokehouseUk", "herringUk"],
  engineHouseUk: ["pastyUk", "orchardUk"],
};

/** object id -> file stem in public/scenes/london-food/, as written by scripts/scenes/import-london.py.
 *  Thirteen cards, one per room; the stems are the rooms' short names, not the object ids. */
export const LONDON_CARD_ART: Record<string, string> = {
  roastPub: "pub",
  teaRoomUk: "tearoom",
  boroughUk: "market",
  pieMashUk: "piemash",
  chippyUk: "chippy",
  breakfastUk: "breakfast",
  lascarUk: "lascar",
  hopKitchenUk: "hopkitchen",
  dairyUk: "dairy",
  pastyUk: "pasty",
  cocklesUk: "cockles",
  smokehouseUk: "smokehouse",
  distilleryUk: "distillery",
};

type Room = {
  id: string;
  kind: Kind;
  name: string;
  zh: string;
  emoji: string;
  pos: [number, number];
  rot: number;
  elevation?: number;
  prop: string;
  scene: string;
  placeName: string;
  tagline: string;
  blurb: string;
  partners?: string[];
  /** Room approach override (graph.ts `approach`), set only where a neighbour that cannot move fills the default one. */
  approach?: WorldObject["approach"];
  match: (r: EnrichedRecipe) => boolean;
};

/** The thirteen objects that open a painted room. Each card ends with its story depth. */
const rooms: Room[] = [
  {
    id: "roastPub", kind: "technique", name: "The public house", zh: "The Sunday joint", emoji: "🥩",
    pos: [-60.3, 4.97], rot: 0, prop: "pub", scene: "uk_pub", placeName: "Public house",
    tagline: "One joint a week, carved at the counter; everything else is bread and cheese.",
    blurb: "A corner house on Borough High Street with the river behind it: a mahogany counter, an etched glass screen that stops the street looking in, a tiled dado that can be washed down, a coal fire, and a hand pump drawing bitter into a straight glass. The trade word for it is the public house, and the room has to be called that here, because the carvery - a counter you serve yourself from - is a British restaurant format of the 1960s and would put a hotel dining room into an 1890s bar.\n\nThe roast is one joint, once a week. A sirloin on the bone goes in on Sunday morning, is rested, and is carved across the grain at the counter into whatever number of plates the money will run to, with the outside slice - brown, salt and crusted from the dripping - asked for by name. Under it, in the same tin and the same fat, a flat batter pudding is baked and cut in squares; beside it roast potatoes from the same dripping, boiled cabbage and carrot, horseradish, and gravy made in the pan.\n\nMost people in the room are not eating it. The everyday bar meal is bread, a wedge of cheese and a hard pickled onion, and beside it the cold things that keep: a raised pork pie in a hot-water crust strong enough to stand without a tin, boiled salt beef and carrots, a steamed suet pudding of beef and kidney. All of them are here because a public house had a cellar and a fire and, very often, no oven worth the name.\n\nBeef Wellington belongs on this card with its doubt attached. It is a fillet seared, spread with mushroom duxelles and baked in pastry, and no printed book names it before the twentieth century, so it is what this counter would carve for a dinner rather than what it carves on a Sunday.",
    partners: ["beef", "beef dripping", "horseradish", "bitter", "suet"],
    match: (r) => has(r.techniques, /roast|pastry/),
  },
  {
    id: "teaRoomUk", kind: "place", name: "The tea room", zh: "Afternoon tea", emoji: "🫖",
    pos: [-55.83, -7.0], rot: 0, prop: "teaRoom", scene: "uk_tearoom", placeName: "Tea room",
    tagline: "A public room a woman could sit down in alone, and be served by another woman.",
    blurb: "Plate glass to the street, bentwood chairs, marble-topped tables, a hanging brass lamp, and rain running down the window. A tea room of this period is a piece of social engineering that happens to sell cake. It sold no alcohol, which kept it outside the licensing laws and outside the reputation of the bar; it was staffed by women; and it was, for a great many women in a British town, the only public room they could enter, sit down in and eat in alone without anybody drawing a conclusion.\n\nOn the table: a china pot under a knitted cosy, a strainer, a hot-water jug to let the pot down, a milk jug and a sugar basin with tongs. The leaf is loose - Indian and Ceylon rather than the China tea of two generations earlier - and the strainer is not a nicety but the only thing between the pot and the cup. To eat, thin bread and butter cut in triangles, plain scones with butter and jam, a Madeira or seed cake cut in slices off the stand, and a Bath bun. Nothing is tiered, and nothing arrives on three plates at once.\n\nThe chains that made this ordinary are dated. The Aerated Bread Company let the manageress of its London Bridge shop serve tea to customers in 1864; J. Lyons and Company opened at 213 Piccadilly in September 1894 with one price list for every branch; Catherine Cranston opened the Willow Tea Rooms in Sauchiehall Street, Glasgow, in October 1903, designed entire by Charles Rennie Mackintosh. Within forty years a tea room could be a chain, an architecture and a career.\n\nThe Lyons waitress in her black dress and white cap has a name and a date, and both are out of this band: the Nippy uniform is from 1925. Here she is simply the waitress, and the room is quiet enough to hear the rain.",
    partners: ["tea", "butter", "flour", "jam", "sugar"],
    match: (r) => brit(r) && has(r.core, /tea|scone|cake|butter/),
  },
  {
    id: "boroughUk", kind: "place", name: "The market", zh: "Borough Market", emoji: "🧀",
    pos: [-53.85, 3.95], rot: 0, prop: "boroughMarket", scene: "uk_market", placeName: "Borough Market",
    // The default camera ends inside the hop cookhouse's roof, 9 south: look down over it at 0.6.
    approach: { dist: 11, pitch: 0.6, yaw: 0 },
    tagline: "Four in the morning under iron and glass, and a railway going over the stalls.",
    blurb: "A low roof of iron and glass beside a railway viaduct, shafts of first light coming through it with the dust turning in them, and the floor already full. This is a wholesale market working at dawn: goods in by river and by the night train, moved by barrow and by porter, weighed on a brass balance with iron weights, and sold in quantity to the shops and stalls that will sell them on. Retail happens round the edges, for whoever else is awake.\n\nWhat is on the boards is the whole of the British larder in October. Truckles of Cheddar and Cheshire with one cut open to show the cloth-bound rind and the white crumb; a side of bacon and a brace of game hanging on their hooks; potatoes, swedes, carrots and cabbages in wooden crates; apples in a chip basket; a pyramid of butter on a marble slab with a pair of ribbed wooden pats beside it; brown eggs in straw. The cheese is bandaged in muslin and larded so that it can breathe and travel, and the butter is on marble because marble stays cold.\n\nThe market's right to stand here is a document rather than a tradition. The Borough Market Act of 1756 moved the old market off the road at the foot of London Bridge and gave the parish of St Saviour's Southwark the right to hold one on new ground; the buildings are largely of 1851, and in 1860 a railway viaduct was driven straight through them. Its neighbours were rebuilt in the same generation: Smithfield in 1868, Billingsgate in 1875, both by the City architect Sir Horace Jones.\n\nAlmost every other room in this area buys here or sells here. The pie shop's eels come up from Billingsgate, the pub's cheese and the tea room's butter come off these slabs, and the dale's cheese and the dark rhubarb come down on the night train to be on this floor before it is light.",
    partners: ["cheese", "butter", "bacon", "apples", "eggs"],
    match: (r) => brit(r) && has(r.core, /cheese|butter|apple|egg|bacon/),
  },
  {
    id: "pieMashUk", kind: "dish", name: "The pie and mash shop", zh: "Pie, mash and liquor", emoji: "🥧",
    pos: [-38, -5.45], rot: 0, prop: "pieShop", scene: "uk_piemash", placeName: "Pie and mash shop",
    tagline: "Three things on a white plate, and the eel trade they were built on.",
    blurb: "A narrow shop off a dock street, fitted the way a trade fits a room it means to wash down every night: white and green glazed tiles to shoulder height, mirrors to push the dark back, marble-topped tables with wooden benches bolted to the floor, and sawdust down for the wet. The whole menu is three items and the eels they came from, and it has been that way since the eel, pie and mash houses first opened in London in the eighteenth century.\n\nThe plate is a minced beef pie with a shortcrust base and a puff lid, broken open on the beef; mashed potato spread in a swipe round one side of the plate rather than scooped into it, because a swipe holds the sauce; and a ladle of liquor over both. Liquor is parsley sauce made with the stock the eels were cooked in, which is where the name comes from and why it is green. Chilli vinegar and a pepper pot stand on the table and nothing else is offered: no peas, no gravy, no chips.\n\nBeside the pies are the two trays the shop was built around. Eels stewed in their own stock, hot, and eels set cold in that stock until it jellies, with the rings of fish visible through it. Eels came up the Thames until pollution finished them, and then down from the Dutch barges that had been licensed to sell live eels at Billingsgate since 1472. The Lough Neagh fishery in County Antrim, given a protected name in 2011, still sends most of its eels to London for this counter.\n\nThe oldest shop with a continuous record is a few streets away. Robert Cooke opened an eel and pie house at 87 Tower Bridge Road - then Bermondsey New Road, because the bridge was new - in 1891, and Michele Manze, born in Ravello, took it over in 1902.",
    partners: ["beef", "eel", "parsley", "potato", "suet"],
    match: (r) => brit(r) && has(r.core, /pie|eel|potato|beef/),
  },
  {
    id: "chippyUk", kind: "dish", name: "The fried fish shop", zh: "The chippy", emoji: "🍟",
    pos: [-52.53, -17.37], rot: 0, prop: "chipShop", scene: "uk_chippy", placeName: "Fried fish shop",
    tagline: "The first hot cooked meal a working week could buy that was not charity.",
    blurb: "A mill-town shop on a wet evening with a queue to the door: a coal-fired range under a brass-hooded frying range, white tiles, a marble counter, and two pans going at once. Haddock and cod fillets in a plain flour-and-water batter go into the first and come out onto a wire rack to drain; chipped potatoes, cut by hand on a bench chipper, go into the second, and the wire basket is lifted clear and shaken so the fat streams back into the pan.\n\nThe frying is done in beef dripping, and that is what a northern chip tastes of. Salt from a drum, malt vinegar from a bottle with a shaker top, a bowl of scraps for the children, and the portion wrapped in greaseproof inside newspaper, hot enough to hold and to carry home in. The batter is flour and water; beer batter is a later idea, and there is no cardboard, no fluorescent tube and no tub of anything on this counter.\n\nThe two halves of the plate arrived from opposite ends of the country. Fried fish in batter came into London with Ashkenazi Jewish immigrants, who fried it to be eaten cold, and was sold by Jewish street sellers long before a chip joined it; the chipped potato came down out of the industrial north. What married them was steam trawling, ice and the railway, which put sea fish in an inland town overnight, and cheap dripping, which made frying it affordable.\n\nThe result is measurable even where its origin is not: about twenty-five thousand fried fish shops in Britain by 1910, from almost none fifty years earlier. This was the first hot cooked meal a working family could buy that was neither charity nor a public house, and that is why the trade was left off rationing in both world wars.",
    partners: ["haddock", "potato", "beef dripping", "malt vinegar", "flour"],
    match: (r) => brit(r) && has(r.core, /fish|haddock|cod|potato/),
  },
  {
    id: "breakfastUk", kind: "dish", name: "The porters' breakfast", zh: "The coffee stall", emoji: "🥓",
    pos: [-45.46, 20.84], rot: 0, prop: "coffeeStall", scene: "uk_breakfast", placeName: "Coffee stall",
    tagline: "Four in the morning, under a naphtha flare, on the cobbles outside the market.",
    blurb: "A stall on wheels standing on wet cobbles outside the fish market in the dark, with a naphtha flare over it throwing a hard white light that moves. The market's lit doorway is behind it and the customers are the men who have been working since three: porters, carmen, market men, and anybody else whose day started before the city's did. There is no table and no chair. Food is handed over a board and eaten standing up.\n\nOn the flat iron griddle, rashers of back bacon curling at the edges, a black pudding cut in discs, slices of bread going down into the fat, and a row of eggs. On the board beside it, thick bread and butter. At the end of the counter, a boiler with a brass tap filling tin mugs with tea, dark and strong, and a bowl of sugar to take from. A jar of pickled onions and a stack of plates finish the stock.\n\nThe trade was counted before it was photographed. Henry Mayhew's London Labour and the London Poor of 1851 reckons at least two hundred coffee stalls in London and notes that, alone among the street trades, the coffee stall sold something like a meal rather than a luxury. What became the full English was written down for households in Isabella Beeton's Book of Household Management in 1861; a stall sold the cheap end of the same list.\n\nHow ordinary that was is worth stating plainly. Seebohm Rowntree's survey of every working-class household in York in 1899 found 27.84 per cent of them below his poverty line, on a diet whose base was bread, dripping and tea. A hot bacon breakfast under this flare was a good morning, not an ordinary one.",
    partners: ["bacon", "black pudding", "bread", "tea", "eggs"],
    match: (r) => brit(r) && has(r.core, /bacon|egg|bread|tea/),
  },
  {
    id: "lascarUk", kind: "place", name: "The seamen's kitchen", zh: "লস্কর রান্নাঘর", emoji: "🍛",
    pos: [-39.5, 21.03], rot: 0, prop: "lascarKitchen", scene: "uk_lascar", placeName: "Seamen's kitchen",
    tagline: "Six men off one ship, a stone slab and an iron pan, in a back room in Shadwell.",
    blurb: "The back kitchen of a seamen's boarding house in Shadwell: a range, a scrubbed table, a bench along the wall, a low fire, ship's gear in the corner, and six men from the same crew. These are lascars - sailors recruited across South Asia for British ships - and the largest groups in the London docks came from Sylhet and Chittagong. Between voyages they cooked for each other, because there was nowhere to buy their own food and because a man between ships still has to eat.\n\nThe equipment is the point of the room. A stone slab and roller, on which turmeric, cumin, coriander seed, mustard seed, dried chilli, ginger and garlic are ground fresh every day; a tin trunk of spices bought ashore and guarded; a heavy iron pan; a pot of fish curry with whole green chillies and coriander in it; a pan of rice with the lid lifted off and resting beside it; flatbreads on a griddle; a chipped enamel dish of pickle. The fish was bought that morning at the market a street away, because the market is what a dock street has.\n\nThere is no restaurant in this decade to compare it with. Sake Dean Mahomed, born in Patna, had opened the Hindoostane Coffee House at 34 George Street in 1810 and was bankrupt by 1812, and nothing replaced it for a century. Salut e Hind is reported as the first Indian restaurant in Holborn, in 1911; the Kohinoor and a curry café in Commercial Street follow in the 1920s; Edward Palmer opened Veeraswamy in Piccadilly in 1926.\n\nSo the room to paint is this one and not that one. Between 1880 and 1914 Indian food in London was cooked in boarding-house kitchens and ships' galleys by the men who ate it, and the East End cafés grew out of the lodging houses that fed newly arrived seamen from the 1920s on. No flock wallpaper, no printed menu, no brass.",
    partners: ["fish", "turmeric", "rice", "chilli", "ginger"],
    match: (r) => brit(r) && has(r.core, /rice|fish|turmeric|chilli/),
  },
  {
    id: "hopKitchenUk", kind: "place", name: "The hop-pickers' cookhouse", zh: "Hopping", emoji: "🍲",
    pos: [-54.2, 12.9], rot: 0, prop: "hopCookhouse", scene: "uk_hopkitchen", placeName: "Hop-pickers' cookhouse",
    // The default camera ends among the hop garden's poles, 8.7 south: stop at 7.5, looking down at 0.4.
    approach: { dist: 7.5, pitch: 0.4, yaw: 0 },
    tagline: "A town family cooking outdoors for six weeks, and calling it the holiday.",
    blurb: "September in a Kentish hop garden, at the end of a line of corrugated hopper huts: a fire of faggots burning between two iron uprights, a big iron pot hanging from a chain over it, hop strings twelve feet high behind, and a canvas bin half full of green cones. This is an open cookhouse, and it exists because a quarter of London came down to Kent for the picking and had to be fed somewhere.\n\nIn the pot, neck of mutton with potato, onion, carrot and pearl barley, put on in the morning and still going at dark, with a ladle lifting and pouring back to stop it catching. A kettle stands beside it, a loaf and a clasp knife on an upturned crate, bacon on a toasting fork, a stone jar of beer, enamel plates. Nothing is bought ready-made and nothing is thrown away. The fire does the cooking, the drying and the warming, and a child is kept off it by being given something to hold.\n\nThe garden around it was at its largest just before this band. The English hop acreage peaked at 71,789 acres in 1878, about forty thousand of them in Kent across some three hundred parishes, and one estimate puts nearly seven thousand oasts in the county at that date. Published estimates of how many Londoners came down each September run from tens of thousands to two hundred thousand, with one estimate of a quarter of a million by the early twentieth century; the range is the honest figure.\n\nAbout a third of that workforce came from the East End and it was mostly women and children. They lived in single rooms of corrugated iron with a straw-filled mattress, were paid by the bushel, came back to the same farm for generations, and called it their holiday - which was true, and was also the only one most of them had.",
    partners: ["mutton", "pearl barley", "potato", "hops", "bacon"],
    match: (r) => brit(r) && has(r.core, /mutton|lamb|barley|potato/),
  },
  {
    id: "dairyUk", kind: "dish", name: "The dale dairy", zh: "Wensleydale", emoji: "🧈",
    pos: [-46.13, -21.2], rot: 0, prop: "daleDairy", scene: "uk_dairy", placeName: "Dale dairy",
    tagline: "A cold stone room, a screw press, and whey running into a pail.",
    blurb: "A stone dairy at the cold end of a Dales farmhouse: a flagged floor, a slate shelf, a door standing open onto a walled meadow with horned sheep in it and a field barn beyond. Everything in the room is chosen to stay cold and to be scrubbed. This is farmhouse cheesemaking in the weeks when the milk is more than the household can drink, and it is work of the hands and the weather rather than of the fire.\n\nThe sequence is on the bench. A tub of milk; curd cut into cubes with a curd knife and left to drain on a slatted rack; a cloth-lined hoop of curd going into an iron screw press, the screw taken down half a turn at a time so that the fat is not driven out with the liquid; whey running from the press spout into a pail in one thin thread. On the slate shelf a finished truckle bound in cloth, and one cut open showing a white, close, crumbling paste. A thermometer and a scoop, and nothing else.\n\nWensleydale is pressed only lightly and eaten young, which is why it crumbles rather than slices and why it is white rather than yellow. The technique is credited to Cistercian monks who settled in the dale in the twelfth century and was carried on by the farms; the date that changed the trade is 1897, when Edward Chapman set up a commercial creamery at Hawes and began buying the dale's milk instead.\n\nNothing in this room is hot. There is no fire, no range, no kettle and nothing boiling: cutting, draining, pressing and waiting, and the whey to the pigs when the pail is full. A dairy that steams is a dairy somebody has misunderstood.",
    partners: ["milk", "rennet", "salt", "mutton", "oatcake"],
    match: (r) => brit(r) && has(r.core, /cheese|milk|cream/),
  },
  {
    id: "pastyUk", kind: "dish", name: "The Cornish bakehouse", zh: "Pasti", emoji: "🥟",
    pos: [-67.25, 8.05], rot: 0, prop: "pastyBakehouse", scene: "uk_pasty", placeName: "Cornish bakehouse",
    // The default camera ends on the cockle shelter's roof, 6.9 south: come in from the south-east instead.
    approach: { dist: 10, yaw: 0.6 },
    tagline: "A dinner with a handle, baked in a granite wall above a mining village.",
    blurb: "A granite bakehouse in a mining village, the oven mouth open to the room and throwing its heat across a scrubbed board, the door open onto a street running down to the sea, and an engine house on the skyline. On the board, shortcrust rolled to a circle, filled, folded and crimped; on the long-handled peel, a tray going into the oven; on a cloth by the window, baked pasties cooling.\n\nThe filling goes in raw and cooks in its own steam inside the pastry, which is the whole trick of the thing: skirt of beef cut in pieces, potato and swede sliced rather than diced, onion, salt and a great deal of pepper. No carrot. The crimp runs along the side, never over the top, and it is a seam before it is anything else. A pastry initial is pressed into one corner so that a man can tell his own from the four others in the same oven.\n\nThe record is thinner than the tradition and it is worth keeping them apart. The earliest known Cornish pasty recipe is in a letter of 1746 held by the Cornwall Record Office, and it describes something quite unlike this one; the name was given a protected status in 2011, which fixed both the D shape and the filling. Traditionally told, and without a contemporary source: that the thick crimp was a handle for a miner whose hands carried arsenic, and was thrown away.\n\nThe landscape it fed has its own dates. The Cornwall and West Devon Mining Landscape was inscribed on the World Heritage List in 2006 for a period running principally from 1700 to 1914. The copper market crashed in 1866, tin carried on at a much reduced scale, and Cornish miners emigrated in very large numbers, taking the engine house and the pasty to South Africa, Australia and the Americas.",
    partners: ["beef skirt", "swede", "potato", "onion", "pepper"],
    match: (r) => brit(r) && has(r.core, /pastry|beef|swede|potato/),
  },
  {
    id: "cocklesUk", kind: "place", name: "The cockle sands", zh: "Cocos a bara lawr", emoji: "🐚",
    pos: [-68.31, 14.98], rot: 0, prop: "cockleStall", scene: "uk_cockles", placeName: "Cockle stall",
    tagline: "A mile of wet sand at low water, fifty women, and a donkey apiece.",
    blurb: "Low water on a shallow estuary: a mile of pale ribbed sand with a channel running through it, women working bent over with scrapes and riddles, and donkeys standing patiently with panniers on their backs. On the shore behind them a stall, and beside it a fire under a copper of boiling water. The tide is the timetable and there is no arguing with it, which is why nobody on this sand is standing still.\n\nThe work is four movements. The cockles are scraped out of the sand, riddled so that the sand falls through and the shells stay, carried up in sacks on the donkeys, and boiled in the copper on the shore. Then they are tipped into a wooden tub and measured out by the pint into a twist of paper, with vinegar and pepper to hand. Beside them on the stall sits the other harvest of the same shore: bara lawr, laverbread, laver seaweed boiled for hours to a dark purée, and a plate of it fried with cockles, bacon and oatmeal.\n\nThe scale was measured once. A report for the South Wales Sea Fisheries Association in 1916 estimated almost 320 tonnes of cockles a month from the Penclawdd sands, with about fifty women at work on a typical day and about 150 kilogrammes loaded on each donkey. Then they walked to Swansea market, about eight miles each way; for generations they walked barefoot to the edge of the town and put their shoes on there, and by the late nineteenth century they could afford to wear them the whole way.\n\nThe money came to the women and weekly, which in this period was unusual enough to be the story. Many of them kept households where the husband was injured or out of work, and many were widows. Horses and carts replaced the donkeys on the shore only in the 1960s.",
    partners: ["cockles", "laver", "bacon", "oatmeal", "vinegar"],
    match: (r) => brit(r) && has(r.core, /cockle|seaweed|bacon|oat/),
  },
  {
    id: "smokehouseUk", kind: "dish", name: "The smokehouse", zh: "Arbroath smokies", emoji: "🐟",
    pos: [-71.7, -11.36], rot: 0, prop: "smokehouse", scene: "uk_smokehouse", placeName: "Curing yard",
    // The default camera ends 1.5 in front of the engine house, 11.4 south, whose roof and stack fill the frame: stop at 6.5.
    approach: { dist: 6.5, yaw: 0 },
    tagline: "A fire in a hole in the ground, and haddock tied together by the tail.",
    blurb: "A curing yard on a red sandstone shelf above a small harbour, with boats and barrel stacks below it. The equipment is a half whisky barrel sunk into the ground with a hardwood fire burning in it, a frame of wooden speets laid across the top, and wet hessian sacks to hand. That is all. Everything that makes the fish is the fire, the stick, the sack and the man deciding when.\n\nHaddock are split, cleaned and dry-salted for a couple of hours, then tied in pairs by the tail and hung over the speets, and the pair is lowered over the pit together so the smoke gusts up round it. The hessian goes over the frame to hold the heat and the smoke down. What comes off an hour later has a copper-coloured skin and creamy flesh, is opened by hand rather than cut, and is eaten warm with the fingers.\n\nThe distinction this yard turns on is on the rail beside it. An Arbroath smokie is hot-smoked over a fierce short fire, so the fish is cooked; a kipper is cold-smoked, comes off the rail raw and needs a pan afterwards; and a Findon haddock, from south of Aberdeen, is pale, split and cold-smoked, and was being made for generations before the smokie. Three cures in one yard, and only one of them is ready to eat.\n\nThe dates run the other way from the fame. Smoked haddock was being sent from Auchmithie to Dundee in 1842, and Auchmithie, four miles up the coast, is the fishertoun the smokie is said to come from and whose families are said to have carried the trade into Arbroath. The protected name came in 2004, and it draws a five-mile circle round Arbroath Town House.",
    partners: ["haddock", "salt", "hardwood smoke", "oatcake", "butter"],
    match: (r) => brit(r) && has(r.core, /haddock|fish|smoke/),
  },
  {
    id: "distilleryUk", kind: "place", name: "The distillery", zh: "Uisge beatha", emoji: "🥃",
    pos: [-68.95, -20.5], rot: 0, prop: "distillery", scene: "uk_distillery", placeName: "Distillery",
    tagline: "Barley, peat, burn water and copper, under a vent that shows the malt is drying.",
    blurb: "A Speyside distillery in a hollow by a burn, with a peat stack and a water wheel outside the door and a pagoda vent on the kiln roof. Inside, a malting floor where barley lies green with rootlets and is turned by hand with a wooden shiel; a kiln with a peat fire under it; two dull copper pot stills with swan necks; a wooden washback with a foaming head on the wash; a spirit safe with clear spirit running through its glass; and a cask being filled through an open bung.\n\nThe order of the work is the whole recipe. Barley is steeped, spread and turned until it germinates evenly and does not overheat in the heap, then dried over the kiln - with peat in the fire where a peated malt is wanted, which is where the smoke in the glass comes from and not from the cask. Then mashing, then fermenting in wood, then distilling twice in copper. Only the middle cut of the second distillation is kept; the head and the tail go back.\n\nTwo dates put this hollow where it is. The Excise Act of 1823 licensed distilling for a fee of ten pounds and brought the trade out of the hills, where most production had been small and illicit. And on 3 May 1889 Charles Doig sketched a steeply pitched ventilating kiln roof at Dailuaine: the Doig ventilator, which everyone calls the pagoda, is a working vent drawing air up through the drying malt, and within a generation it was the silhouette of an entire industry.\n\nOn the barrel head at the end of the room, oatcakes and a dram in a plain glass. The glass in the spirit safe is locked, because for most of this period the excise held the key and not the distiller.",
    partners: ["barley", "peat", "oatcake", "burn water", "oak"],
    match: (r) => brit(r) && has(r.core, /whisky|barley|oat/),
  },
];

export const LONDON_OBJECTS: WorldObject[] = rooms.map((room) => ({
  id: room.id,
  world: "central-europe" as const,
  area: "london" as const,
  kind: room.kind,
  name: room.name,
  placeName: room.placeName,
  zh: room.zh,
  emoji: room.emoji,
  pos: room.pos,
  rot: room.rot,
  elevation: room.elevation ?? 0,
  prop: room.prop,
  scene: room.scene,
  place: true,
  tagline: room.tagline,
  blurb: room.blurb + "\n\n" + LONDON_STORY_DEPTH[room.id],
  partners: room.partners,
  ...(room.approach ? { approach: room.approach } : {}),
  match: room.match,
}));

// --- ingredient and flavour stops: a card, a 3D reaction, no room ---
LONDON_OBJECTS.push(
  {
    id: "pastryCe", world: "central-europe", kind: "ingredient", name: "The pastry board", zh: "Butter, flour and suet", emoji: "🥐",
    area: "london", pos: [-50.11, -5.35], rot: 0, elevation: 0, prop: "bakeryCe",
    tagline: "Four doughs, and each one holds a different dinner together.",
    blurb: "A board on the north bank, between the tea room and the pillar box, floured, with four doughs on it that between them account for most of what Britain baked. They are not variations on one idea: each was worked out for a different job.\n\nPuff pastry, pâte feuilletée, is a block of butter enclosed in dough and rolled and folded until the layers run into the hundreds; in the oven the water in the butter turns to steam and lifts every leaf. Hot-water crust is flour scalded with lard and water and raised by hand round a wooden dolly: it sets hard, stands without a tin, and carries a pork pie to market. Shortcrust, rubbed cold, wraps a pasty and lines a fruit pie.\n\nThe fourth is the most distinctively British and the least exported. Suet crust is flour, water and shredded beef suet, and it is not baked at all: it is lined into a basin, filled with beef and kidney or with jam, tied in a cloth and boiled for hours. It made a hot dinner possible over one fire, in a house with no oven.",
    partners: ["butter", "lard", "suet", "flour", "beef"],
    match: (r) => has(r.core, /pastry|flour|butter|suet|lard/),
  },
  {
    id: "oystersUk", world: "central-europe", kind: "ingredient", name: "The oyster smacks", zh: "Natives", emoji: "🦪",
    area: "london", pos: [-34.2, 13.2], rot: -0.1, elevation: 0, prop: "oysterSmack",
    // The Alps' nearest snow peak, [-28, 22], stands between the default card camera and the smacks: look down
    // steeper and from the west, so it falls behind the card (it was also lowered a third in world-ceurope.ts).
    approach: { pitch: 0.95, yaw: -0.6 },
    tagline: "The cheapest food in the city, until it priced itself out of reach.",
    blurb: "Two smacks moored in the dock below Tower Bridge, back from dredging Whitstable and Colchester natives off the estuary beds and bringing them up to Billingsgate. An oyster in this period is not a luxury. It is the cheapest protein a Londoner could buy, opened on a barrow, eaten standing, and shovelled into the pie and the pudding to make a little beef go further.\n\nThe numbers are of an industry rather than a delicacy. Something over 700 million oysters were eaten in London alone in 1864, and the fisheries employed around 120,000 people across Britain; by the 1850s Whitstable alone was sending 80 million a year to Billingsgate.\n\nThen it ended inside one lifetime. Overfishing thinned the beds, sewage ruined the grounds nearest the city, and a typhoid outbreak traced to oysters in the winter of 1902 and 1903 broke the public's nerve. The food that had been the mark of having no money became the mark of having some, and the eels in the shop across the river are what stayed cheap.",
    partners: ["eel", "beef", "vinegar", "bread"],
    match: (r) => brit(r) && has(r.core, /oyster|shellfish/),
  },
  {
    id: "hopsUk", world: "central-europe", kind: "flavour", name: "The hop garden and the oast", zh: "Fuggle and Golding", emoji: "🌿",
    area: "london", pos: [-54.5, 21.6], rot: 0, elevation: 0, prop: "hopGarden",
    tagline: "Bitterness, and the reason a barrel of beer could cross an ocean.",
    blurb: "Twelve feet of string, a bine climbing it clockwise, and a green cone at the top of every one. The hop is trained up wires, picked in September and dried at once, because a wet cone spoils in a day. Two varieties carry English beer: Fuggle, raised in the 1860s, and Golding, older.\n\nThe building at the end of the garden is the machine. An oast is a brick roundel with a fire below, a slatted drying floor above it strewn with cones, and a white cowl on the roof that turns with the wind so it always draws away from it. The hops go in green, come out dry and papery, and are pressed into a long sack called a pocket.\n\nThe hop does two things at once, and the second built an empire's beer trade. It makes the beer bitter, which balances the malt, and it is an antiseptic, which makes the beer keep, so porter and pale ale could travel. The acreage behind that peaked at 71,789 acres in 1878, about forty thousand of them in Kent, with one estimate of seven thousand oasts in the county.",
    flavour: ["bitter", "resinous", "green"],
    partners: ["barley", "beer", "yeast", "water"],
    match: (r) => has(r.core, /hop|beer|ale/),
  },
  {
    id: "mushroomsCe", world: "central-europe", kind: "ingredient", name: "The woods", zh: "Field and wood", emoji: "🍄",
    area: "london", pos: [-62.43, 22.2], rot: 0, elevation: 0, prop: "mushroomWood",
    tagline: "Field mushrooms at dawn, ceps after the first autumn rain.",
    blurb: "Oak and hornbeam on the southern edge of the Weald, and a pasture beyond it. Two quite different harvests come out of one walk. The field mushroom grows on grazed grass and is picked at dawn, before the sun and anybody else's dog; it goes straight onto a breakfast plate with bacon and does not keep past the day. In the wood, after the first autumn rain, come ceps and chanterelles, for a week, and then they stop.\n\nWhat a kitchen does with more than it can eat is chop it. Duxelles is mushrooms, shallots and herbs minced fine and cooked down until the pan is dry, credited to La Varenne, cook to the Marquis d'Uxelles, in 1651. It earns its place under pastry because it is dry: over a seared fillet it flavours the beef and keeps the crust from going sodden.\n\nThat is the route from this wood to the pub counter four miles away. The Wellington the pub's card carries its doubt about is a fillet, a layer of this and a case of puff pastry - and the middle term is the only one that grows here.",
    partners: ["beef fillet", "shallot", "butter", "puff pastry"],
    match: (r) => has(r.core, /mushroom|shallot/),
  },
  {
    id: "sheepUk", world: "central-europe", kind: "ingredient", name: "The dale flock", zh: "Swaledale", emoji: "🐑",
    area: "london", pos: [-45.21, -13.95], rot: 0, elevation: 0, prop: "daleFlock",
    tagline: "A flock that knows its own fell, and passes the knowledge to its lambs.",
    blurb: "Horned in both sexes, white round the nose and eyes, black-faced and small: the Swaledale is the hill breed of the northern dales and the Pennines, and one of the hardiest sheep in Britain. It lives out on unfenced fell in weather that would kill a lowland sheep, lambs there, and comes down only when the snow makes it.\n\nThe word that matters is hefted. A hefted flock has learned its own stretch of open hill - where the shelter is, where the grazing comes early, where the boundary runs although there is no wall - and teaches it to its lambs, so the knowledge is held in the animals and not in the fences. It takes generations to build and one bad winter to lose, which is why a hill farm here is sold with its sheep on it.\n\nWhat the breed is worth is in the meat. The fleece is too coarse and too dark for cloth and goes into carpet, rug and insulation, so the return has always been the lamb and the mutton: the mutton in the hop-pickers' pot, and the joint on the pub counter.",
    partners: ["mutton", "pearl barley", "milk", "wool"],
    match: (r) => brit(r) && has(r.core, /lamb|mutton|wool/),
  },
  {
    id: "rhubarbUk", world: "central-europe", kind: "ingredient", name: "The forcing shed", zh: "Yorkshire forced rhubarb", emoji: "🕯️",
    area: "london", pos: [-59.82, -17.24], rot: 0, elevation: 0, prop: "forcingShed",
    tagline: "Grown in the dark, pulled by candlelight, and on the night train to London.",
    blurb: "A long low shed with no windows, warm inside, where lifted crowns send up their stalks in complete darkness; outside, in the open field, next year's crowns build up their sugar. Forcing began in Yorkshire in 1877 and turned a field crop into a winter luxury. The roots grow outdoors for two years, are lifted after a frost, and are moved into the heated shed, where they grow on nothing but what they stored.\n\nWith no light to make more, the plant sends up stems long, smooth and deep pink-red, sharper and cleaner than anything grown outside. The sheds are worked by candlelight, because stronger light would green the stems and toughen them.\n\nWhat it was grown for was the city. The Great Northern ran a nightly rhubarb express from Ardsley through the season, so that what was pulled in the dark in the West Riding was on a London barrow the next morning. The Rhubarb Triangle once ran to nine square miles of these sheds; Yorkshire Forced Rhubarb was given a protected designation of origin in 2010.",
    partners: ["sugar", "butter", "flour", "cream"],
    match: (r) => brit(r) && has(r.core, /rhubarb|sugar/),
  },
  {
    id: "orchardUk", world: "central-europe", kind: "ingredient", name: "The orchard and the cider pound", zh: "Kingston Black", emoji: "🍏",
    area: "london", pos: [-75.5, 8.2], rot: 0, elevation: 0, prop: "ciderOrchard",
    tagline: "Apples nobody would eat, a horse walking a stone, and cider paid as wages.",
    blurb: "Standard trees in grass on a slope above the channel, apple baskets under them, and a stone pound at the end of the row where a horse walks a circle dragging a runner stone over the fruit. The apples are not eating apples: small, hard and either bitter or sour, their tannin and acid are exactly what a drink needs and a plate does not.\n\nThe classes are four and a cider maker blends them. Bittersweet and bittersharp carry the tannin; sweet and sharp carry the sugar and the acid. Kingston Black, from near Taunton, is prized because it is one of the few that can be made on its own; Yarlington Mill was found growing out of a wall at a Somerset mill, and Dabinett in a hedge at Middle Lambrook in the early 1900s.\n\nCider was also money. In the eighteenth and nineteenth centuries part of a farm labourer's wage in the West Country was paid in it, with three pints a day a commonly cited allowance; the practice was banned by the Truck Amendment Act of 1887 and went on at harvest anyway.",
    partners: ["apples", "pork", "cheese", "bread"],
    match: (r) => brit(r) && has(r.core, /apple|cider/),
  },
  {
    id: "leeksUk", world: "central-europe", kind: "ingredient", name: "The leek bed", zh: "Cennin", emoji: "🥬",
    area: "london", pos: [-75.5, 21.9], rot: 0, elevation: 0, prop: "leekBed",
    tagline: "The emblem of a country, grown in a cottage bed and boiled in one pot.",
    blurb: "A cottage garden on the south side of the channel, with leeks earthed up in a bed in front of the house and a basket of them already pulled at the end of the rows. The leek stands frost and comes out of the ground all winter, the one green thing a small household can count on between the end of one year's vegetables and the start of the next.\n\nIt is also the emblem of Wales, and has been for at least seven hundred years, worn on Saint David's Day long before the daffodil was offered as a tidier alternative. Shakespeare has Fluellen explain the custom in Henry V, which puts the tradition in the record by 1599 at the latest.\n\nWhat it goes into is cawl, the one-pot stew of lamb or bacon with leek, potato, swede and carrot that is Wales's national dish and exists in one form or another back to the fourteenth century. It is cooked over a single fire, often for two days, and the broth is eaten first and the meat and vegetables after, with hard cheese and cockles from the sand across the water.",
    partners: ["lamb", "bacon", "potato", "swede", "cheese"],
    match: (r) => brit(r) && has(r.core, /leek|lamb|potato/),
  },
  {
    id: "oatsUk", world: "central-europe", kind: "ingredient", name: "The oat field and the meal mill", zh: "Coirce", emoji: "🌾",
    area: "london", pos: [-76.3, -20.66], rot: 0, elevation: 0, prop: "oatMill",
    tagline: "The grain that ripens where wheat will not, and the iron plate it is baked on.",
    blurb: "A field of oats on the coastal strip and, behind it on the burn, a meal mill with a water wheel turning a pair of stones. Oats ripen in a short, wet, cool summer where wheat will not set, which is why they feed the north and west of this island.\n\nThe most famous thing ever written about them is an insult that was taken as a boast. Samuel Johnson's dictionary of 1755 defined oats as a grain which in England is generally given to horses, but in Scotland supports the people; the Scottish reply, that England has better horses and Scotland better men, is now part of the definition.\n\nThe meal comes off the stones in three grades and is eaten three ways: as porridge, stirred with a spurtle and salted rather than sugared; as brose, meal and boiling water or stock left to stand a few minutes, which is what a man makes when there is no time for porridge; and as oatcakes, rolled thin and baked on a girdle, a flat iron plate over the fire. The three grades stand in bowls beside the mill, and a bannock is on the girdle.",
    partners: ["milk", "salt", "cheese", "haddock", "whisky"],
    match: (r) => brit(r) && has(r.core, /oat|porridge|barley/),
  },
  {
    id: "herringUk", world: "central-europe", kind: "ingredient", name: "The herring quay", zh: "The silver darlings", emoji: "🐟",
    area: "london", pos: [-39.19, -21.9], rot: 0, elevation: 0, prop: "herringQuay",
    tagline: "A crew of three women, a fish every ten seconds, and fingers bound in cotton.",
    blurb: "A quay with a drifter drawn up on the hard beside it, her sail up to dry, and a farlane - a long wooden trough - of herring on the stones behind. The fleet followed the shoal down the coast with the year, from Shetland in May to Yarmouth and Lowestoft in the autumn, and the gutting crews followed by train, lodging where they could.\n\nThe crew is three women and the division is fixed: two gut and one packs. They gutted a fish every ten seconds with a short knife and could pack thirty barrels of some seven hundred fish each in a ten-hour day, salted in layers with the backs up. Their fingers were bound in cotton strips against the knife and the salt.\n\n1913 was the record year, and its figures belong with their sources rather than added together: one account gives upwards of 380,000 tons landed at Yarmouth and Lowestoft between September and December, another about 800,000 cran at Yarmouth alone. Both agree on the labour: some ten thousand seasonal workers into Yarmouth that season, six thousand of them Scotswomen.",
    partners: ["salt", "oatmeal", "potato", "smoke"],
    match: (r) => brit(r) && has(r.core, /herring|fish|salt/),
  },
);

// --- landmarks: a card and a 3D reaction, no recipes ---
LONDON_OBJECTS.push(
  {
    id: "bigBen", world: "central-europe", kind: "landmark", name: "Big Ben & Westminster", zh: "The Palace of Westminster", emoji: "🕰️",
    area: "london", pos: [-63.87, -8.89], rot: 0, elevation: 0, prop: "bigBen",
    tagline: "A clock tower over the river, and a street that kept Parliament's hours.",
    blurb: "The old Palace of Westminster burned in October 1834 and was rebuilt in Gothic by Charles Barry and Augustus Pugin over the following thirty years. The clock tower's great bell first sounded in 1859, and the name Big Ben belongs to the bell, not the tower or the clock. The dials are lit at dusk; the Ayrton Light above the belfry burns while Parliament sits after dark, which tells the street below to expect a late trade.\n\nWhat that means for the food here is the hours. A Parliament that sits through the night keeps the public houses, coffee stalls and chop houses of Westminster and Whitehall open too, and members, clerks, messengers and reporters eat at odd times in rooms lit for them. The river terrace is where the Victorians made afternoon tea an institution of the place as well as of the drawing room.\n\nThe tower heads this street at its west end: east along the river come the tea room, the pastry board and the pillar box at the bridge road, and across the bridge, in Southwark, the public house and the market.",
    match: () => false,
  },
  {
    id: "towerBridge", world: "central-europe", kind: "landmark", name: "Tower Bridge", zh: "The bascule bridge", emoji: "🌉",
    area: "london", pos: [-37.7, 3.4], rot: 0, elevation: 0, prop: "towerBridge",
    tagline: "Steam engines lifting a road, so that the ships can reach the Pool.",
    blurb: "Tower Bridge opened in 1894, the last bridge downstream and the only one that gets out of the way. Two counterweighted bascules are lifted by steam engines driving hydraulic accumulators, and in its early years they went up something like a thousand times a year for the masts and funnels bound for the Pool of London. Its steel frame is dressed in Cornish granite and Portland stone to agree with the Tower beside it.\n\nWhat came under it is the reason this area has three kitchens round its docks. Tea, sugar, spices, grain and timber came into the Pool, and so did the crews: the lascars whose kitchen stands on the wharf south of the dock came off ships that passed under it. The food trades grew up around the men who unloaded them.\n\nThe bridge is also the address of the best-documented shop in the area. M. Manze has been at 87 Tower Bridge Road since 1902, in premises opened as an eel and pie house in 1891, when the road was still Bermondsey New Road, because this bridge did not exist.",
    match: () => false,
  },
  {
    id: "redBus", world: "central-europe", kind: "landmark", name: "The omnibus and the hansom cab", zh: "The General", emoji: "🚌",
    area: "london", pos: [-45.29, 11.2], rot: 0, elevation: 0, prop: "omnibus",
    tagline: "The year London's buses turned red, and the cab that could take a corner.",
    blurb: "A horse omnibus and a motor omnibus side by side in the General's red, and a hansom cab at the kerb. The date on the card is 1907, when the London General Omnibus Company painted its fleet red to stand out from its competitors and numbered its routes. A rival, the Vanguard, had run predominantly red vehicles since 1905; the General absorbed it in 1908, kept the colour and the numbering, and as it bought out the rest most of London's buses turned red within a year or two.\n\nThe hansom is how the century before solved the same problem. Joseph Hansom registered the hansom cab on 23 December 1834 as a Patent Safety Cab: two large wheels, a low body slung between them, one horse, and the driver perched behind and above so he could see over the roof. John Chapman redesigned it in 1836, and that version went everywhere.\n\nAt the foot of Westminster Bridge the two omnibuses still share the kerb, but not for long: the General ran its last horse omnibus in October 1911. The Routemaster, the one most people picture, is from 1956.",
    match: () => false,
  },
  {
    id: "phoneBox", world: "central-europe", kind: "landmark", name: "The pillar box and the lamp", zh: "The Penfold", emoji: "📮",
    area: "london", pos: [-44, -4.3], rot: 0, elevation: 0, prop: "pillarBox",
    tagline: "A hexagonal box with an acanthus bud on top, and a lamplighter's pole.",
    blurb: "A cast-iron pillar box on the corner, and beside it a gas standard a lamplighter reaches with a pole twice a night. Both belong to a city that ran on paper and gas, and the post is quick enough that a letter written at breakfast is answered by tea.\n\nThe box has a designer and a date. The hexagonal Penfold, named for the architect John Wornham Penfold, was the standard pillar box between 1866 and 1879: a fluted body, a cap ringed with balls, and an acanthus bud on top, cast by Cochrane, Grove and Company in three sizes. The first pillar boxes in the British Isles went up in the Channel Islands in 1852 and the first on the mainland at Botchergate, Carlisle, in 1853.\n\nThe colour is younger than the box. Early Victorian boxes were green; the first painted red were in London in July 1874, and repainting the rest took nearly ten years. The red kiosk that stands beside a box like this in every photograph of London is Giles Gilbert Scott's K6 of 1935, and it is not on this street.",
    match: () => false,
  },
  {
    id: "forthBridge", world: "central-europe", kind: "landmark", name: "The Forth Bridge", zh: "Drochaid an Fhoirthe", emoji: "🌉",
    area: "london", pos: [-59.4, -24.54], rot: 0, elevation: 0, prop: "forthBridge",
    tagline: "Steel cantilevers over a firth, and the railway that took the fish south.",
    blurb: "Balanced steel cantilevers standing over a firth, three in the whole crossing, painted continuously by men in cradles. It was designed by Benjamin Baker under Sir John Fowler, built by William Arrol of Glasgow from 1883 with a workforce peaking at about 4,600, and opened on 4 March 1890. It held the longest span in the world for twenty-seven years and is the first major structure built of steel rather than iron.\n\nWhat it did was close a gap. Before it, the east coast railway from London to Aberdeen stopped at the water. After it a train ran the whole way, and the timetable that mattered here was the overnight one: smoked haddock, herring in barrels, salmon in ice and whisky in cask went south and were in the London markets by morning.\n\nThe bridge belongs in a food world for the same reason the night rhubarb train does: it is why a fish cured over a barrel fire on this shore could be eaten six hundred kilometres away while it was still worth eating. It became a World Heritage Site on 5 July 2015.",
    match: () => false,
  },
  {
    id: "engineHouseUk", world: "central-europe", kind: "landmark", name: "The engine house", zh: "Wheal", emoji: "⛏️",
    area: "london", pos: [-73.3, 0], rot: 0, elevation: 0, prop: "engineHouse",
    tagline: "A beam rocking in a granite wall, and the mine it keeps dry.",
    blurb: "A granite box on the high ground above the village, a chimney at one corner, and a massive bob wall carrying the pivot of a cast-iron beam that rocks in and out of the gable. On one side of the pivot the cylinder, on the other the pump rods going down the shaft. The house is built round the engine, which is why they all look alike and why the ruins stand when the roofs are gone.\n\nThe engine is what made deep mining possible. High-pressure beam engines developed by Richard Trevithick and improved by Arthur Woolf lifted water out of workings far below where earlier pumps gave up, and where the water went the tin and copper were followed down. Something like three thousand engine houses were built in Cornwall and west Devon.\n\nIt is on a food map because of what it ate: a mine of this period employed hundreds, most working a shift underground with a dinner carried in, and the bakehouse in the village below exists to feed them. The copper crash of 1866 is why so many stood empty while the pasties were still baked.",
    match: () => false,
  },
);
