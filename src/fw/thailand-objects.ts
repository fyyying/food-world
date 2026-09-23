/** Thailand objects (area id `bangkok`, display name Thailand): data only. Owned by the Researcher.
 *
 *  Positions and rotations are the fixed Stage B blueprint in docs/thailand-world.md; ids, kinds, props,
 *  scenes and purposes are the object list in the same document. Thirty-two objects: twelve that open a
 *  painted room, ten card-only ingredient and flavour stops, six landmarks with a card and a 3D reaction,
 *  and the four hit-only stall children of the floating market, which stay as `graph.ts` has them today.
 *
 *  Blurbs follow the band written into docs/thailand-world.md, "Shared contract: the card blurb band":
 *  room objects three to five paragraphs of about 2,500 to 3,200 characters including their story depth,
 *  card-only objects three paragraphs of about 750 to 1,000. Dates describe records, not invented
 *  birthdays; legends are labelled; anything resting on repetition rather than on a document is written
 *  "reported" or "unverified" (docs/thailand-research.md section 5).
 *
 *  The period band is about 1880 to 1910, the later reign of Chulalongkorn. Pad thai (1940s), green curry
 *  (documented 1926), the longtail boat (1930s) and the tuk-tuk (1960s) are outside it and appear only as
 *  dated later developments, never as the present. `floatingMarket` carries no `open: "reveal"`, per the
 *  owner ruling of 2026-09-21. `curryPaste` keeps its id, its `place` flag and its `placeName`; only its
 *  display name changes, from "Curry paste & the wok" to "The curry mortar". */
import type { EnrichedRecipe, Kind, WorldObject } from "./graph";
import { THAILAND_STORY_DEPTH } from "./thailand-stories";

const has = (list: string[], re: RegExp) => list.some((x) => re.test(x));
const thai = (r: EnrichedRecipe) => r.area === "bangkok";

/** Two links per card, always to another Thailand object. Room links are from research section 4. */
export const THAILAND_NEXT: Record<string, string[]> = {
  floatingMarket: ["kuaitiaoRuea", "suanTh"],
  kuaitiaoRuea: ["floatingMarket", "shophouseTh"],
  wangKitchenTh: ["curryPaste", "sweetsTh"],
  curryPaste: ["chilliesSea", "coconutSea"],
  sweetsTh: ["floatingMarket", "wangKitchenTh"],
  shophouseTh: ["kuaitiaoRuea", "tukTuk"],
  naKhaoTh: ["naPaddyTh", "plaTh"],
  isanGrillTh: ["plaRaTh", "naPaddyTh"],
  khaoSoiTh: ["chinHawTh", "miangTh"],
  talayTh: ["karsts", "longtail"],
  muslimKitchenTh: ["khamminTh", "curryPaste"],
  babaTh: ["karsts", "shophouseTh"],

  chilliesSea: ["curryPaste", "shophouseTh"],
  coconutSea: ["curryPaste", "sweetsTh"],
  naPaddyTh: ["naKhaoTh", "kluaTh"],
  plaTh: ["naKhaoTh", "plaRaTh"],
  suanTh: ["floatingMarket", "sweetsTh"],
  tanTh: ["sweetsTh", "kluaTh"],
  kluaTh: ["plaRaTh", "talayTh"],
  plaRaTh: ["isanGrillTh", "plaTh"],
  miangTh: ["khaoSoiTh", "chinHawTh"],
  khamminTh: ["talayTh", "muslimKitchenTh"],

  wat: ["almsRound", "floatingMarket"],
  almsRound: ["wat", "naKhaoTh"],
  karsts: ["talayTh", "longtail"],
  longtail: ["talayTh", "karsts"],
  tukTuk: ["shophouseTh", "curryPaste"],
  chinHawTh: ["khaoSoiTh", "miangTh"],

  "stall-fruit": ["floatingMarket", "suanTh"],
  "stall-noodles": ["kuaitiaoRuea", "floatingMarket"],
  "stall-herbs-th": ["chilliesSea", "curryPaste"],
  "stall-coconut": ["coconutSea", "sweetsTh"],
};

/** object id -> file stem in public/scenes/thailand-food/, as written by scripts/scenes/import-thailand.py.
 *  Twelve cards, one per room; the stems are the rooms' short names, not the object ids. */
export const THAILAND_CARD_ART: Record<string, string> = {
  floatingMarket: "khlong",
  kuaitiaoRuea: "noodleboat",
  wangKitchenTh: "wang",
  curryPaste: "curry",
  sweetsTh: "sweets",
  shophouseTh: "shophouse",
  naKhaoTh: "paddy",
  isanGrillTh: "isan",
  khaoSoiTh: "lanna",
  talayTh: "andaman",
  muslimKitchenTh: "muslim",
  babaTh: "baba",
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
  placeName?: string;
  tagline: string;
  blurb: string;
  partners?: string[];
  match: (r: EnrichedRecipe) => boolean;
};

/** The twelve objects that open a painted room. Each card ends with its story depth. */
const rooms: Room[] = [
  {
    id: "floatingMarket", kind: "place", name: "The floating market", zh: "ตลาดน้ำ", emoji: "🛶",
    pos: [-40.5, 4.5], rot: 1.2, prop: "floatingMarket", scene: "th_khlong",
    tagline: "Thirty boats tied gunwale to gunwale, and the market is open.",
    blurb: "Bangkok in the later reign of King Chulalongkorn (1868–1910) had almost no streets. It was a delta town on soft clay above a tidal river, laid out on that river and on hundreds of kilometres of canal, and the market was held from boats because the street was water. At first light thirty small hulls come in under the teak houses on posts, tie up gunwale to gunwale in the basin, and for two hours the basin is the shop.\n\nWhat is in them is whatever the country is cutting that week. Mangosteen and rambutan by the boatload in the rains; nam dok mai mango in March and April; bananas on the stem; durian from the orchards upriver; morning glory cut at dawn; pea aubergine and banana blossom; galangal and lemongrass in bundles; marigolds and lotus buds for the wat. One boat carries a charcoal brazier with a pan on it, and that is all the cooked food there is.\n\nHow it works is the part a photograph does not show. Nothing is weighed and nothing is bagged. Fruit is opened by thumb over the gunwale, a young coconut has its top struck off with a cleaver and is drunk out of the shell, and money crosses between two moving hulls. There is no ice, so what is unsold by mid-morning is poled home.\n\nThe city has since turned the other way round. Yaowarat Road was cut through the Chinese quarter between 1892 and 1900, the canals were filled in one by one, and the markets came ashore. This basin is the arrival view for the same reason it was once the centre of the city: everything else is reached from it by water.",
    partners: ["young coconut", "mango", "morning glory", "lotus", "durian"],
    match: (r) => r.place === "floatingMarket",
  },
  {
    id: "kuaitiaoRuea", kind: "dish", name: "The noodle boat", zh: "ก๋วยเตี๋ยวเรือ", emoji: "🍜",
    pos: [-40.2, 18.5], rot: 1.35, prop: "noodleBoat", scene: "th_noodleboat",
    tagline: "One pot, one paddle, and the bowl handed up over the gunwale.",
    blurb: "One long paddled hull lies against a landing stage in a narrow canal, a charcoal pot amidships and a board across the gunwale for a counter. The cook stands to paddle, kneels to serve, and moves on. This is how a hot dish reached a house with no street in front of it. The earliest written mention of kuaitiao, the rice-noodle dish, is in the Bangkok Times in 1898.\n\nIn the pot is a stock of pork bones with star anise, cinnamon and pepper, held just under a boil since before dawn. Beside it a tray of flat sen yai and thin sen lek rice noodles, a basket of morning glory and bean sprouts, pork with liver and meatballs, a wire strainer on a long handle, and a rack of four things to adjust it with: dried chilli, sugar, chilli vinegar, and an earthenware pot of fish sauce, because the bottled kind does not exist yet.\n\nThe bowls are small chinaware and they are handed up over the gunwale, one at a time, to somebody on the stage or the bank. Two or three is a meal, and the empties stack where they were emptied. Nobody gets into the boat. The reason usually given for the size of the bowl, that a customer could finish before the boat moved on, is repeated everywhere in Thai food writing with no primary source behind it, so it belongs with the story and not with the record.\n\nTwo familiar things belong to a later century and are named rather than painted. The dark, blood-thickened broth that the phrase boat noodles now means is mid twentieth century, and pad thai was invented and distributed by government campaign in the 1940s, when vendors were given free noodle carts. In this canal the broth is pale, the fire is charcoal, and the boat is the shop.",
    partners: ["rice noodles", "pork", "morning glory", "bean sprouts", "pepper"],
    match: (r) => thai(r) && has(r.core, /noodle/),
  },
  {
    id: "wangKitchenTh", kind: "place", name: "The household kitchen", zh: "ครัวในวัง", emoji: "🍲",
    pos: [-18, 8.5], rot: 0.35, prop: "wangKitchen", scene: "th_wang",
    tagline: "The first Siamese cookbook was written in a room like this one.",
    blurb: "An open-sided kitchen pavilion stands on a teak floor inside a whitewashed noble compound in the old city, a tiled roof over it and a walled garden beyond. This is where Siamese cooking was first written down. Than Phu Ying Plian Phasakorawong's Mae Khrua Hua Pa (แม่ครัวหัวป่าก์) was serialised in journal form from 1888 and issued as a book in 1908, and it is the first Siamese cookbook.\n\nWhat is on the trays is the everyday Siamese meal made carefully rather than a different meal altogether. A brass tray of nam phrik with its accompaniments, blanched vegetables, fried fish and an omelette cut in strips. A bowl of massaman with cardamom, cinnamon, cloves and peanuts. Khao chae, rice in jasmine-scented iced water with its small dry side dishes, eaten cold in the hottest weeks of the year. A stone mortar, a brass pan and a betel set stand where they are used, not where they look well.\n\nThe refinement is in the knife work. Kae sa lak, fruit and vegetable carving, was one of the skills a woman of this household was expected to have: a pomelo cut into flowers, a chilli opened into a flower with two strokes of a small blade. It is done in the hand, on real fruit that is then eaten, which is why there is no carved swan on a buffet anywhere in this area.\n\nTwo more dates sit on this floor. The poem Kap He Chom Khrueang Khao Wan, written in 1800 by the future Rama II, praises massaman for its cumin and its strong spices, which makes it the oldest named curry in the Siamese record. And the first written tom yum recipe, of 1888, is for snakehead: tom yum pla chon, a river fish out of the canals and the flooded fields, not a prawn.",
    partners: ["chilli", "shrimp paste", "pomelo", "cardamom", "jasmine"],
    match: (r) => thai(r) && has(r.core, /curry|rice/),
  },
  {
    id: "curryPaste", kind: "technique", name: "The curry mortar", zh: "ครกหิน", emoji: "🥣",
    pos: [-30.6, -11], rot: 0.15, prop: "curryKitchen", scene: "th_curry", placeName: "Curry kitchen",
    tagline: "Pound it until the smell changes; that is the only timer.",
    blurb: "A household kitchen under a house on posts: hard earth floor, a clay charcoal stove, a bamboo rack of vessels, daylight through the open side. In the middle a heavy granite mortar, khrok hin, with a paste half made in it. Granite, not clay; about a quarter of an hour of pounding; and the cook stops when the smell changes, not when the paste looks smooth.\n\nInto the mortar go dried and fresh chillies, galangal, lemongrass, kaffir lime zest, coriander root, garlic, shallot, white pepper and a lump of kapi shrimp paste. Only the chilli is an import: it reached Siam with Portuguese traders in the sixteenth century and was absorbed completely. The salt comes out of the kapi, out of a pot of imported Vietnamese sauce, or out of a fermenting jar, because commercial bottled nam pla was not marketed until 1922.\n\nThen the coconut. Half a nut is grated on a stool, the flesh squeezed once for thick cream and again for thin milk, and the cream fried in a wide pan until its oil separates at the edge. The paste is fried in that oil until it smells right; then the thin milk, pea aubergines, whole green chillies, a lump of palm sugar, and holy basil at the end. The order is the recipe.\n\nWhat comes out of this mortar has dates of its own. Massaman is in the written record from 1800. Green curry, kaeng khiao wan, is not documented until 1926, and wan, sweet, describes its colour rather than its taste; it is named on this card with its date attached and is in no painting in this area.",
    partners: ["coconut", "chilli", "galangal", "lemongrass", "shrimp paste"],
    match: (r) => has(r.techniques, /curryPaste/),
  },
  {
    id: "sweetsTh", kind: "place", name: "The sweets kitchen", zh: "ขนมไทย", emoji: "🍮",
    pos: [-34.2, 16.4], rot: -0.4, prop: "khanomKitchen", scene: "th_sweets",
    tagline: "Golden threads drawn out of a brass pan, since Ayutthaya.",
    blurb: "A small brick-and-timber kitchen in the Portuguese quarter at Kudi Chin on the Thonburi bank, the tower of the Santa Cruz church through the open door and the river beyond it. Charcoal, a wide brass pan and a great many duck eggs. The community has held this land since King Taksin granted it in 1767, and the church dates in its first form from about 1770.\n\nThe pan holds clear sugar syrup at a low boil, and a cone with a pierced tip is drawn back and forth above it so that unbroken threads of egg yolk fall onto the surface and set: foi thong, golden threads. Beside it thong yip pinched into six-pointed cups, thong yot dropped in beads, a tray of khanom mo kaeng baked under embers on its lid, and a rack of khanom farang kudi chin, small cakes of wheat flour, duck egg and sugar topped with raisin and candied winter melon.\n\nAll of that is Portuguese arithmetic done with Siamese ingredients. Foi thong is fios de ovos, thong yip is trouxas das caldas, thong yot is ovos moles de Aveiro, and luk chup is marzipan made of mung bean instead of almond, while pandan, grated coconut and palm sugar do the work lemon and butter do in Portugal.\n\nThese are yolk sweets, and the whites are a question. It is widely repeated that the leftover egg whites went into the lime mortar of the period's buildings; I could find no source naming a building or a date, so it is written here as unverified. What is certain is that nothing in this kitchen is baked in an oven. The heat comes from below in charcoal and from above in embers on a lid.",
    partners: ["duck egg", "palm sugar", "coconut", "pandan", "wheat flour"],
    match: (r) => thai(r) && has(r.core, /sugar|coconut|egg/),
  },
  {
    id: "shophouseTh", kind: "place", name: "The shophouse kitchen", zh: "ร้านตึกแถว", emoji: "🥢",
    pos: [-21.7, -6.1], rot: 0.5, prop: "shophouseTh", scene: "th_shophouse",
    tagline: "Perhaps half of Bangkok was Chinese, and this is where it cooked.",
    blurb: "An open-fronted Teochew kitchen on the new street in the evening, an arcade in front and a shuttered upper floor above. Sampheng was one narrow lane until Yaowarat Road was cut through beside it between 1892 and 1900, about 1.5 kilometres long and 20 metres wide, and the quarter's business moved out of the lane and onto the road.\n\nA wok sits over a roaring charcoal ring with noodles going into it. Roast duck and crisp pork belly hang on hooks over a chopping block; a pot of rice congee breaks at the surface; a steamer stack stands with its lid lifted beside it. In jars along the wall: bean curd, preserved vegetable, salted egg, soy. Men eat at a marble-topped table on low stools, and the light is oil and charcoal.\n\nThis is the kitchen of a migration. The Chinese population of Siam rose from about 230,000 in 1825 to about 792,000 in 1910, Teochew the largest group, and by the start of the twentieth century Chinese people may have made up more than half of Bangkok. The wok, the noodle, the roast meats, the soy and the bean curd came with them, and so did the first written mention of kuaitiao, in the Bangkok Times of 1898.\n\nWhat a visitor comes looking for is younger than the street. Pad thai was invented and distributed by a government campaign in the 1940s; the noodle in this pan is kuai tiao phat, the same wok and the same tossing motion, and pad thai is its descendant. Thai street food as a trade is reported to begin in quarters like this one in the early twentieth century and to become general only in the 1970s, an account repeated in food writing rather than a document.",
    partners: ["rice noodles", "pork", "duck", "soy", "bean curd"],
    match: (r) => thai(r) && has(r.core, /noodle|pork|soy/),
  },
  {
    id: "naKhaoTh", kind: "place", name: "The rice-field lunch", zh: "ข้าวกลางนา", emoji: "🌾",
    pos: [-71.5, -15.4], rot: -0.25, prop: "fieldLunch", scene: "th_paddy",
    tagline: "Fish on the coals, chilli in the mortar, rice in a basket.",
    blurb: "The bund between two flooded rice squares at harvest, mid-morning, a rice barn on posts behind and a buffalo standing in water a long way off. Nobody walks back to the village to eat. A small fire of rice straw is lit on the bund and lunch is cooked on it, which is why this room has a kitchen and no walls.\n\nOn the fire a fish wrapped in banana leaf, the leaf charred and peeling back off it. On the ground a clay mortar with green chilli, garlic, shallot, lime and a little kapi being pounded into nam phrik. Beside them a lidded basket of steamed rice and a conical bamboo steamer, a bundle of morning glory and cucumber to dip, a water gourd, a sickle, cut stalks, and banana-leaf packets tied with split bamboo.\n\nThat is the whole Siamese meal of the period and not a field version of something grander. Anna Leonowens wrote in 1870 that fish was so abundant and cheap that it formed a common seasoning to the labourer's bowl of rice, and Monsignor Pallegoix, who reached Siam in 1830 and stayed twenty-four years, describes the same table: rice, a dish of fish dried or fermented or grilled, a pounded chilli relish, and raw or blanched vegetables. Meat was occasional.\n\nThe reason the plain looks like this is a treaty. The Bowring Treaty of 1855 abolished the royal trade monopolies and allowed rice to be exported freely; exports rose from roughly 10,000 tons a year in the 1860s to about 500,000 in the 1890s and 845,084 tons by 1904, and the delta was cleared, diked and settled to grow them. Every square, every canal and every buffalo in this cluster is that trade seen from the bund.",
    partners: ["rice", "freshwater fish", "chilli", "banana leaf", "cucumber"],
    match: (r) => thai(r) && has(r.core, /\brice\b|fish/),
  },
  {
    id: "isanGrillTh", kind: "place", name: "The Isan grill", zh: "ปิ้งย่างอีสาน", emoji: "🍗",
    pos: [-17.6, -21], rot: 0.2, elevation: 0.6, prop: "isanGrill", scene: "th_isan",
    tagline: "Grilled, pounded, fermented: three answers to a dry year.",
    blurb: "The shaded ground under a raised house on the Khorat plateau in the late afternoon, a bamboo fence, a pond and a grove beyond it. Isan is higher, sandier and drier than the central plain, the rainy season is shorter and drought is normal, so the rice is glutinous and grown once, the protein is fermented, and the cooking is done on charcoal.\n\nA long charcoal trough carries chickens flattened between split-bamboo clamps, turned together with one hand, and skewers of pork. On the ground a tall clay mortar with green papaya shredded into it, long beans, tomato, dried shrimp, chilli, garlic, lime and palm sugar, a wooden pestle in one hand and a spoon in the other. Baskets of sticky rice stand open, and larb is chopped on a board with toasted rice powder, mint and shallot.\n\nNothing here is on a plate. Sticky rice is taken in the fingers, rolled into a ball and used to pick up everything else; what needs a container gets a banana-leaf cup. Against the house posts stand the pla ra jars: freshwater fish layered with salt and rice bran and sealed for six months, which is this plateau's protein and its seasoning at once.\n\nThe pounded papaya has a later national career, and those dates belong on the card rather than in the picture. A green papaya salad is cited as already known among Lao people living in Bangkok in a travelogue of 1869, read here at second hand. Som tam became a Bangkok street dish only after the Second World War, with the migration of Isan people to the capital for work.",
    partners: ["sticky rice", "green papaya", "pla ra", "chilli", "chicken"],
    match: (r) => thai(r) && has(r.core, /papaya|sticky rice|chicken/),
  },
  {
    id: "khaoSoiTh", kind: "dish", name: "The Lanna kitchen", zh: "ข้าวซอย", emoji: "🍲",
    pos: [-57, -24], rot: 0.45, prop: "lannaKitchen", scene: "th_lanna",
    tagline: "A Yunnanese noodle that came down the mule road and stayed.",
    blurb: "A Lanna kitchen under a low, wide, multi-tiered roof, teak walls, a cool northern morning, a brick wat and a forested ridge through the opening. Chiang Mai was a tributary kingdom with its own ruler, language and script until Monthon Phayap was established in December 1899, and the food in this room still belongs to that kingdom rather than to the capital.\n\nThe bowl is khao soi: a broth of turmeric, dried chilli, ginger, coriander root and coconut milk with soft egg noodles in it and a nest of the same noodles fried crisp laid on top, with pickled mustard greens, sliced shallot, lime and a spoon of chilli paste in oil beside it. It came in on the mule road with the Chin Haw, Yunnanese Muslim traders, by way of Burma. Khao is grain and soi is to slice, which is how the noodles were once made.\n\nRound it is the rest of a northern table. Coils of sai ua turn on a low charcoal grill, pork worked with lemongrass, kaffir lime leaf, galangal and turmeric. Bowls of nam prik ong and nam prik num go with blanched vegetables, pork crackling and steamed glutinous rice, and the small bowls are set on a lacquered khantoke tray on the floor rather than on a table.\n\nWhat is absent is as northern as what is there. Lanna cooking uses little sugar and little coconut milk outside this one dish, leans on wild and gathered vegetables, and gets its salty depth from thua nao, soybeans fermented and pressed into discs to dry in the sun, because this valley is a very long way from the nearest shrimp paste.",
    partners: ["egg noodles", "turmeric", "coconut milk", "pickled greens", "pork"],
    match: (r) => thai(r) && has(r.core, /noodle|coconut milk/),
  },
  {
    id: "talayTh", kind: "place", name: "The Andaman fishing kitchen", zh: "ครัวชาวเล", emoji: "🐟",
    pos: [-70, 10], rot: -0.8, prop: "andamanKitchen", scene: "th_andaman",
    tagline: "Turmeric on the fish before it goes on the fire.",
    blurb: "A fire of driftwood on pale sand in front of wooden boats drawn up, with limestone towers standing out of green water behind and a high haze over them at midday. This is a fishing kitchen and a beach at the same time: the grill is green sticks laid over coals, and what goes on it came out of a hull an hour ago.\n\nWhole fish are rubbed with turmeric and salt and turned once on the sticks, so the skin lifts away from them clean. In a pot beside the fire, kaeng som, the southern sour curry: turmeric, chilli and tamarind, with fish and green papaya in it and no coconut milk at all. A plate of sataw stink beans with prawns, a stone mortar of turmeric, chilli, garlic and kapi, a coconut opened on the sand, banana-leaf plates and a basket of rice.\n\nTurmeric is what makes this coast taste unlike the rest of the country. The south puts it into nearly every curry, which is why they are yellow-orange rather than red or green, and it uses more chilli and more coconut than anywhere else. Above the fire a line of split squid dries in the wind, which is the other half of the kitchen: what cannot be eaten today is dried today.\n\nThe people who read this water best lived on it. The Moken of the Mergui archipelago, the Moklen of Phang Nga and the Urak Lawoi from Phuket south to Satun have been in the Andaman since at least the eighteenth century and spent most of the year aboard kabang boats hollowed from a single log. The engine-driven longtail the coast is famous for now was built in the 1930s and is not on this sand.",
    partners: ["turmeric", "sea fish", "tamarind", "squid", "coconut"],
    match: (r) => thai(r) && has(r.core, /fish|prawn|squid|turmeric/),
  },
  {
    id: "muslimKitchenTh", kind: "place", name: "The Malay-Muslim kitchen", zh: "ครัวมลายู", emoji: "🫓",
    pos: [-64, 18.5], rot: 0.9, prop: "muslimKitchen", scene: "th_muslim",
    tagline: "Roti thrown thin, and a sauce made from anchovies and time.",
    blurb: "A plank house on posts at the mangrove edge in the deep south, early evening, with the tiered pyramidal roof of a mosque beyond it. These are the Malay-speaking provinces of Pattani, Yala and Narathiwat. The language of the household is Patani Malay rather than Thai, and the kitchen is halal: no pork, and ritual slaughter.\n\nA round steel plate sits over charcoal and a disc of roti dough is thrown out thin between two hands and settles onto it while one already on the plate puffs up. Beside it a pot of khao mok with the lid lifted and resting against it, rice cooked together with chicken, turmeric, cardamom and cinnamon; nasi kerabu, blue rice with shredded herbs and coconut; a bowl of massaman with whole spices; enamel plates, and a folded prayer mat on the step.\n\nThe jar with a ladle in it is budu, anchovies fermented with salt for months, and it is the reason this kitchen does not taste like the central plain's. Budu is the deep south's own fish sauce, made and used where nam pla is not, and it goes onto cold rice and raw herbs rather than into a pot. Green chillies, shallots, ginger, garlic, turmeric and dried fish wait on a board.\n\nMost of this arrived by sea rather than overland. Kaeng tai pla, made from fermented fish innards with turmeric and dried fish, is mentioned in Thai records from the reign of Rama II, more than two hundred years ago, and its ingredients came across the Indian Ocean from South India; the same route brought the biryani idea that khao mok is a version of. The border that now runs south of here was drawn long after any of the recipes.",
    partners: ["wheat flour", "turmeric", "anchovy", "coconut", "chicken"],
    match: (r) => thai(r) && has(r.core, /rice|chicken|turmeric/),
  },
  {
    id: "babaTh", kind: "place", name: "The tin town kitchen", zh: "ครัวบาบ๋า", emoji: "🥘",
    pos: [-70, 16], rot: 0.65, prop: "babaKitchen", scene: "th_baba",
    tagline: "Hokkien food, Siamese aromatics, and a tin-bought table.",
    blurb: "The back kitchen and dining room of a Sino-Portuguese shophouse in Phuket town: a tiled floor, an airwell open to the sky above it, the arcaded five-foot way at the front, and a tin sluice and spoil heap on the hill beyond. Tin paid for this house. Phuket's mining heyday in the nineteenth century brought Hokkien Chinese and Peranakan families from across the Malay peninsula to work the mines, the rubber and the trade, and built the town round them.\n\nOn the table a clay pot of moo hong with its lid off, pork belly braised with garlic, white pepper and dark soy until it goes black; a bowl of mee Hokkien, thick yellow noodles in gravy with prawn and pork; and o-tao, oyster and taro fried on a flat iron plate, which is a Phuket dish and exists nowhere else in Thailand under that name. A plate of nam prik kung siap carries smoked prawn from the bay.\n\nThe room itself is the family's ledger. A marble-topped table, bentwood chairs, a carved wooden screen, ancestral offerings in a niche, blue-and-white Nyonya porcelain on the shelf and a tiered tiffin carrier on the table, which goes down the arcade to the mine office at midday and comes back in the afternoon. Neither the porcelain nor the young mango sliced beside it is hot.\n\nThe people are a community with a name. Intermarriage between Hokkien settlers and local families produced the Phuket Baba, or Baba-Yaya, culture, with its own dress, jewellery, festivals, houses and food, part Chinese, part Thai and part European. More than two hundred of these shophouses and mansions, of the late nineteenth and early twentieth centuries, still stand on seven conservation streets.",
    partners: ["pork", "soy", "oyster", "taro", "prawn"],
    match: (r) => thai(r) && has(r.core, /pork|noodle|soy/),
  },
];

export const THAILAND_OBJECTS: WorldObject[] = rooms.map((room) => ({
  id: room.id,
  world: "southeast-asia" as const,
  area: "bangkok" as const,
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
  blurb: room.blurb + "\n\n" + THAILAND_STORY_DEPTH[room.id],
  partners: room.partners,
  match: room.match,
}));

// --- ingredient stops and flavours: a card, a 3D reaction, no room ---
THAILAND_OBJECTS.push(
  {
    id: "chilliesSea", world: "southeast-asia", kind: "flavour", name: "Chilli, galangal & lemongrass", zh: "พริก ข่า ตะไคร้", emoji: "🌶️",
    area: "bangkok", pos: [-27.3, 6.8], rot: 0.45, elevation: 0, prop: "spiceStall",
    tagline: "An import from across the world, and four things that were always here.",
    blurb: "A stall of baskets under an awning at the corner of the Sampheng lane, four doors from the mortar it supplies. Only one thing on it came from outside the region. Chillies reached Siam with Portuguese traders in the sixteenth century and were absorbed so completely that the small hot prik khi nu is now the first thing anyone names about Thai food.\n\nThe rest was here before the ships. Kha, galangal, a sharper and more resinous cousin of ginger; takhrai, lemongrass, bruised before it is cut; the zest and the leaf of the makrut lime; rak phak chi, coriander root rather than leaf, which is a Thai seasoning and not a garnish; and beside them krachai, turmeric and two basils. Pounded with garlic, shallot, pepper and a lump of kapi, they are a curry paste.\n\nThe basket also explains what is missing. There is no bottle on the stall: commercial nam pla was not marketed until 1922, so the salt in a dish came from shrimp paste, from a pot of imported sauce, or from a jar at home.",
    flavour: ["hot", "citrus", "fragrant"],
    partners: ["coconut", "shrimp paste", "garlic", "lime"],
    match: (r) => has(r.core, /chilli|chili|galangal|lemongrass|curry paste|lime leaf/),
  },
  {
    id: "coconutSea", world: "southeast-asia", kind: "ingredient", name: "Coconut", zh: "มะพร้าว", emoji: "🥥",
    area: "bangkok", pos: [-66.2, 11.4], rot: 0.2, elevation: 0, prop: "coconutSea",
    tagline: "The milk is not the water; it is the flesh, squeezed twice.",
    blurb: "Coconut palms stand in groves the length of this peninsula and along every canal in the area, and almost nothing in a Thai kitchen is untouched by them. The commonest misunderstanding is the first to clear up: the milk is not the water inside the nut. It is the mature white flesh, grated on a toothed stool and squeezed through a cloth.\n\nIt is squeezed twice, and the two pressings do different work. The first, hua kathi, is thick cream, and it is fried in a pan until its oil separates out of it before any paste is added; that step is what makes a curry taste right. The second, thin and paler, becomes the sauce the meat and vegetables cook in. Neither is interchangeable, and a cook with only one of them has half a curry.\n\nThe rest of the tree is used too. A young nut has its top struck off with a cleaver and the water drunk from the shell, then the soft flesh scraped out with a piece of husk. The old nut gives oil and flesh for sweets, the leaf roofs a house, and the husk scours a floor.",
    partners: ["curry paste", "palm sugar", "rice", "turmeric"],
    match: (r) => has(r.core, /coconut/),
  },
  {
    id: "naPaddyTh", world: "southeast-asia", kind: "ingredient", name: "The paddy and the buffalo", zh: "นาข้าว", emoji: "🐃",
    area: "bangkok", pos: [-61, -7], rot: 0.1, elevation: 0, prop: "paddyTh",
    tagline: "Ten thousand tons a year became eight hundred thousand.",
    blurb: "The central plain is the flattest large landscape in Southeast Asia and it is farmed in bunded squares that are flooded on purpose. The monsoon runs from May to October, the water is let in and held, the seedlings transplanted by hand into mud, and a buffalo drags the plough through it because it can work ground no wheel will cross.\n\nWhat turned this into an industry was a treaty. The Bowring Treaty of 1855 abolished the royal trade monopolies and permitted rice to be exported freely. Exports grew from roughly 10,000 tons a year in the 1860s to 845,084 tons by 1904, and the delta was cleared, diked, canalised and settled to grow them. The canals in this area are that trade's plumbing.\n\nThe grain is not the same everywhere on the table. The plain and the south grow long-grain rice, boiled and eaten from a bowl; Isan and the north grow glutinous rice, steamed in a bamboo cone and eaten with the fingers. The difference decides how every other dish in its region is served.",
    partners: ["rice", "water", "buffalo", "fish"],
    match: (r) => thai(r) && has(r.core, /\brice\b/),
  },
  {
    id: "plaTh", world: "southeast-asia", kind: "ingredient", name: "The river fish and the traps", zh: "ปลาน้ำจืด", emoji: "🎣",
    area: "bangkok", pos: [-53, -6], rot: -0.3, elevation: 0, prop: "fishTraps",
    tagline: "So cheap it seasons the labourer's bowl of rice.",
    blurb: "The canals, ponds and flooded fields of this plain are a fishery, and they are worked with bamboo. Woven traps are set in the gaps of a bund, a lift net dropped from a frame, and when the water falls at the end of the wet season the fish come down the channels into whatever is waiting. Snakehead, pla chon; catfish, pla duk; gourami, pla salit.\n\nThat abundance is the base of the period's table. Anna Leonowens wrote in 1870 that fish was so abundant and cheap that it formed a common seasoning to the labourer's bowl of rice, and the same fish is in the written record of the kitchen: the first tom yum recipe, of 1888, is tom yum pla chon, made with snakehead. The prawn version that now carries the dish's name abroad came later.\n\nWhat is not eaten fresh is preserved three ways, all of them in this area: grilled and dried in the sun, salted, or layered with salt and rice bran into a jar as pla ra for six months, which is how a household keeps protein through a year without ice.",
    partners: ["rice", "chilli", "lime", "salt"],
    match: (r) => thai(r) && has(r.core, /fish/),
  },
  {
    id: "suanTh", world: "southeast-asia", kind: "ingredient", name: "The river orchards", zh: "สวนผลไม้", emoji: "🥭",
    area: "bangkok", pos: [-54, -15], rot: 0.25, elevation: 0, prop: "riverOrchard",
    tagline: "Durian and mangosteen on ridged beds between water channels.",
    blurb: "Along the river above the city the ground is cut into long raised beds with a water channel between every pair of them, so that the roots stay above the flood and the water is always within reach. That arrangement, and the silt the river leaves, is why the orchards of Nonthaburi are the ones the fruit boats come from.\n\nDurian has grown here for centuries and is the crop the province is known for, with mangosteen, rambutan and mango beside it. The trade has been rebuilt once: John Crawfurd's account records a flood in 1831 that destroyed most of the province's fruit trees, and commercial planting by Chinese immigrant growers put the orchards back.\n\nThe fruit reaches the eater by water and on its own timetable. A durian is taken when it falls by itself, mangosteen and rambutan come in by the boatload with the rains and the price falls with them, and the nam dok mai mango has a few weeks in March and April, eaten with glutinous rice and sweetened coconut cream, and then is gone.",
    partners: ["glutinous rice", "coconut cream", "palm sugar"],
    match: (r) => thai(r) && has(r.core, /mango|fruit|durian/),
  },
  {
    id: "tanTh", world: "southeast-asia", kind: "ingredient", name: "The sugar palms", zh: "ตาลโตนด", emoji: "🌴",
    area: "bangkok", pos: [-63.6, -13.6], rot: 0, elevation: 0, prop: "sugarPalms",
    tagline: "Up thirty metres of trunk for a cylinder of sap.",
    blurb: "Phetchaburi's toddy palms stand in lines along the field edges, and the sugar in this area comes out of the top of them. A worker climbs the trunk on a notched bamboo ladder, thirty metres or more, cuts the flower stalk and ties a bamboo cylinder under it to catch what runs. The cylinders come down twice a day.\n\nThe sap is filtered and simmered in a wide flat pan over a wood fire until it thickens, then poured out to set into the soft brown cakes a Thai kitchen measures sugar in. It tastes of the tree rather than of sweetness alone, which is why it seasons savoury dishes too. A palm begins to produce at about fifteen years old and can yield for two centuries.\n\nThe trade was large enough to name a town. Palm sugar was second only to rice as a commercial activity in Phetchaburi, whose own nickname is the City of Three Flavours: palm sugar, sea salt and lime. All three are in this area within a short walk of each other, and the sweets kitchen and the curry mortar both depend on the first.",
    partners: ["coconut", "duck egg", "rice", "salt"],
    match: (r) => thai(r) && has(r.core, /sugar/),
  },
  {
    id: "kluaTh", world: "southeast-asia", kind: "ingredient", name: "The salt pans", zh: "นาเกลือ", emoji: "🧂",
    area: "bangkok", pos: [-53.6, 14.2], rot: 0.15, elevation: 0, prop: "saltPans",
    tagline: "Nothing here ferments without it.",
    blurb: "Where the plain meets the Gulf the land goes flat and brackish and is cut into shallow rectangular pans with hard levelled floors. Sea water is let in on a high tide, moved from pan to pan as it concentrates, and left to the sun through the dry season from January to April; the crust is then raked into white cones and carried off on a shoulder pole.\n\nThe industry sits on a very short stretch of coast. About 98 per cent of Thailand's sea salt comes from Phetchaburi, Samut Sakhon and Samut Songkhram, and Phetchaburi's pans have a documented history reaching into the reign of Rama IV, which ended in 1868. Samut Sakhon's conversion of paddy into salt fields came later, in 1938, outside this area's period.\n\nEverything preserved in this area waits on these pans. The pla ra jars on the Isan plateau, the budu jar in the deep south, the kapi in the curry kitchen, the dried river fish and the split squid above the Andaman sand are all the same transaction: salt out of the sea, and time.",
    partners: ["fish", "shrimp paste", "rice", "lime"],
    match: (r) => thai(r) && has(r.core, /salt/),
  },
  {
    id: "plaRaTh", world: "southeast-asia", kind: "flavour", name: "The pla ra jars", zh: "ปลาร้า", emoji: "🏺",
    area: "bangkok", pos: [-24.6, -21], rot: -0.2, elevation: 0.6, prop: "plaRaYard",
    tagline: "Six months in a jar, and the whole plateau tastes of it.",
    blurb: "A yard of earthenware jars in the shade under a raised Isan house. Freshwater fish — gourami, snakehead, catfish, whatever the pond and the flooded field give up — are layered with salt and rice bran, pressed down, sealed, and left for at least six months. What comes out is pla ra: soft, brown, strong, and the most important thing in this region's cooking.\n\nIt is a staple rather than a seasoning of last resort: it supplies protein where meat is occasional, and it seasons the papaya in the mortar and the larb on the board. The practice is old and documented. Simon de La Loubère's Du Royaume de Siam, written after his embassy of 1687 and 1688, describes it, and excavated Isan earthenware carrying fermented-fish residue has been dated to several thousand years ago.\n\nIt is also the reason there is no bottle anywhere in this area. Commercial nam pla was marketed only from 1922; before that the northeast seasoned with the liquid drawn off the bottom of these jars.",
    flavour: ["salty", "funky", "deep"],
    partners: ["sticky rice", "green papaya", "chilli", "salt"],
    match: (r) => thai(r) && has(r.core, /fish sauce|fermented/),
  },
  {
    id: "miangTh", world: "southeast-asia", kind: "ingredient", name: "The tea gardens", zh: "เมี่ยง", emoji: "🍃",
    area: "bangkok", pos: [-62, -22], rot: 0.3, elevation: 0, prop: "miangGrove",
    tagline: "Tea that is eaten, not drunk.",
    blurb: "On the shaded slopes above the Lanna valleys, Assam-variety tea grows under the forest canopy rather than in clipped rows in the open, in gardens that look more like woodland than like a plantation. The leaf is picked, steamed, packed tightly into bamboo baskets, and left to ferment for weeks or months.\n\nWhat it becomes is not a drink. Miang is a wad of fermented leaf kept in the cheek and chewed, sometimes with salt, ginger, roasted coconut or a little sugar folded into it, and it has been part of northern household and ceremonial life for centuries. It is offered to guests, exchanged at weddings and set out at funerals, of a piece with the fermented soybean discs and the pickled greens on the khantoke tray.\n\nIt also travelled. Fermented tea is a highland food across the country where Thailand, Burma, Laos and Yunnan meet, and it moved on the same mule roads as the noodle that became khao soi. A basket of it was cargo that did not spoil, which on a long road is the whole argument.",
    partners: ["salt", "ginger", "coconut", "palm sugar"],
    match: (r) => thai(r) && has(r.core, /\btea\b/),
  },
  {
    id: "khamminTh", world: "southeast-asia", kind: "flavour", name: "Turmeric and the southern beds", zh: "ขมิ้น", emoji: "🟡",
    area: "bangkok", pos: [-63.5, 14.5], rot: -0.35, elevation: 0, prop: "turmericBeds",
    tagline: "The south is yellow because of one root.",
    blurb: "Behind the Gulf shore the ground is dug into low beds of turmeric, black pepper on poles at the end of them and krachai, fingerroot, in the rows between. The rhizomes are lifted when the leaves go yellow, and they stain everything: the hands that dig them, the mortar, and every curry they go into.\n\nThat is the difference between southern Thai cooking and the rest of the country's, stated in one ingredient. Turmeric is in nearly every southern curry, which is why they are yellow-orange rather than red or green, and it is used fresh and grated rather than dried and powdered. The south also uses more chilli and more coconut than anywhere else, so the food is hotter and richer at once.\n\nIt does two things beyond colour. On fish it goes on with salt before the fire, and it firms and seasons the skin as much as it tints it. In kaeng som, the sour curry, it works with tamarind and chilli in a paste that carries no coconut milk at all, which is why that curry looks thin and is not.",
    flavour: ["earthy", "bitter", "warm"],
    partners: ["sea fish", "tamarind", "chilli", "coconut"],
    match: (r) => thai(r) && has(r.core, /turmeric|pepper/),
  },
);

// --- landmarks: a card and a 3D reaction, no recipes ---
THAILAND_OBJECTS.push(
  {
    id: "wat", world: "southeast-asia", kind: "landmark", name: "The wat", zh: "วัด", emoji: "🛕",
    area: "bangkok", pos: [-40.3, -12.5], rot: 0.3, elevation: 0, prop: "wat",
    tagline: "Tiered roofs, a golden chedi, and a fair that sells food.",
    blurb: "At the head of the old city street stands the temple: tiered tiled roofs in orange and green, gilded chofa finials on the gable peaks, naga serpents running down the eave edges as hang hong, and behind them a whitewashed chedi with gold leaf on its upper courses. The chofa is read as a bird guardian, the garuda, and the chedi enshrines relics; every part of the roof line means something before it decorates anything.\n\nThe temple is also a market. Ngan wat, the temple fair, is held on temple ground at festivals, and much of the city's cooked food was bought there rather than in a shop; the Golden Mount fair at Wat Saket is the oldest in Bangkok. A wat in this period has the open ground, the shade, the water and the crowd, which is everything a food seller needs.\n\nIt is also where the garlands and lotus buds in the market boats are going: bought on the water in the morning and carried up these steps before the heat, which is how a flower boat and a temple are one trade.",
    match: () => false,
  },
  {
    id: "almsRound", world: "southeast-asia", kind: "landmark", name: "The alms round", zh: "บิณฑบาต", emoji: "🧡",
    area: "bangkok", pos: [-31.3, -2.2], rot: 1.1, elevation: 0, prop: "almsRound",
    tagline: "The first cooking of the day is for somebody else.",
    blurb: "At first light a line of monks walks along the quay, barefoot, in ochre robes, each with a lidded bowl held in front of him. This is tak bat, the alms round, and it is how Buddhist monks have been fed for about two and a half thousand years: they do not ask, they do not thank, and they do not choose.\n\nThe household's part is the part that involves a kitchen. Somebody kneels at the edge of the road, takes off their sandals, and puts hot rice, fruit or a banana-leaf packet of curry into the bowl as it passes; the monks bless, walk on, and share what they gathered back at the wat. They eat before noon and nothing after it, so the round has to be early and the rice has to be cooked before dawn.\n\nThat is why every kitchen in this area starts earlier than its own breakfast. The first pot on a charcoal stove is not for the family, and in a city where the road is water the round is partly made by boat, with a bowl handed down from a landing stage.",
    match: () => false,
  },
  {
    id: "karsts", world: "southeast-asia", kind: "landmark", name: "The limestone karsts", zh: "เกาะหินปูน", emoji: "🏝️",
    area: "bangkok", pos: [-73, 4], rot: 0, elevation: 0, prop: "karst",
    tagline: "Reefs lifted out of the sea, then dissolved by rain.",
    blurb: "The towers standing out of the green water on the Andaman side are ancient coral reef: limestone laid down under a sea, lifted out of it, then eaten away by rainwater into pillars, arches and caves, with jungle holding on to the flat tops. It is the same formation as Ha Long Bay at the other end of this world's table.\n\nWhat matters is what the shape does. The towers break the swell, so the water between them is calm enough for a small wooden hull to work all year; the undercut bases hold fish and the overhangs hold swifts, and the beaches are landings no road reaches. A fishing village at the foot of a karst is there because of the rock, not in spite of it.\n\nIt is also why this cluster has three unlike kitchens on one coast. Sheltered water and no roads let the sea people, a Malay village at the mangrove edge and a Chinese tin town each keep their own language and cooking within sight of one another, which is what the fire on the sand, the roti plate and the Baba table are.",
    match: () => false,
  },
  {
    id: "longtail", world: "southeast-asia", kind: "landmark", name: "The sea people's boats", zh: "เรือชาวเล", emoji: "⛵",
    area: "bangkok", pos: [-76, 12], rot: 0.5, elevation: 0, prop: "mokenBoat",
    tagline: "A house, a boat and a livelihood, hollowed from one log.",
    blurb: "Two boats lie on a mooring off the sand, and they are houses as much as boats. Three related peoples have worked this coast: the Moken of the Mergui archipelago, the Moklen of Phang Nga and the Urak Lawoi from Phuket south to Satun, in the Andaman since at least the eighteenth century and traditionally aboard a hand-built kabang, hollowed from a single old-growth log and about four months in the making.\n\nThe boat is fitted for living rather than for speed: a shallow hull, a palm-thatch roof over the middle, a hearth, and room for a family and its gear. The monsoon decides the year: when the wind turns the boats move to the sheltered side of an island, and when it turns back they move again.\n\nThis object used to be the longtail boat, a later thing named here rather than shown: it was built in the 1930s by Sanong Thitibura at Sing Buri, who mounted an engine on a rowing boat and lengthened the propeller shaft. In this period the hulls on this coast carry a sail, or oars.",
    match: () => false,
  },
  {
    id: "tukTuk", world: "southeast-asia", kind: "landmark", name: "The rickshaw", zh: "รถลาก", emoji: "🛞",
    area: "bangkok", pos: [-20, 16.7], rot: 0.8, elevation: 0, prop: "rickshaw",
    tagline: "A pulled rickshaw, on streets that used to be canals.",
    blurb: "At the east end of the Sampheng lane a few two-wheeled carriages stand with their shafts down and their hoods folded back. The pulled rickshaw was invented in Japan in the 1860s, spread through Asia and reached Siam from the 1880s; a puller leans into the shafts, takes the weight on his arms and runs, and the passenger sits behind under a hood raised against sun or rain.\n\nIt appears here because the streets do. Bangkok had no use for a wheel while its roads were water, and the rickshaw arrives with the new brick streets and with Yaowarat Road, cut through the quarter between 1892 and 1900. It carries the same traffic a boat used to: people, baskets, charcoal, a tray of cooked food.\n\nThe tuk-tuk that gave this object its id is three generations later: it came to Bangkok from Japan in the 1960s, took its name from the sound of a two-stroke engine, and is in no painting here. What is painted is a hood, two wheels, two shafts and a man who knows where the noodle boat ties up.",
    match: () => false,
  },
  {
    id: "chinHawTh", world: "southeast-asia", kind: "landmark", name: "The Chin Haw caravan", zh: "จีนฮ่อ", emoji: "🐴",
    area: "bangkok", pos: [-57.5, -20], rot: -0.5, elevation: 0, prop: "muleCaravan",
    tagline: "Mules from Yunnan, and a noodle that got off here.",
    blurb: "Where the road out of the hills enters the Lanna valley a line of loaded mules comes down, panniers swinging, men in dark Yunnanese jackets and white caps at their heads. These are the Chin Haw, Yunnanese Muslim traders whose caravans worked the roads between Yunnan, Burma, Laos and Chiang Mai at the end of the nineteenth century, and many of whom settled around Chiang Mai and Chiang Rai.\n\nA caravan carried what would survive a road with no wheels on it: tea, salt, cotton, metalwork, hides and opium, loaded so the two sides of a mule balance. It was also how information and recipes moved, because a route that takes a fortnight is one people live on rather than merely use.\n\nWhat this one left behind is in the bowl in the next kitchen. Khao soi came into Chiang Mai with these traders by way of Burma, picking up coconut milk on the road. The sliced-sheet noodle in its name is the older, Yunnanese way of making it; the crisp nest on top is what Chiang Mai did with it afterwards.",
    match: () => false,
  },
);

// --- the floating market's four stalls: hit-only children, exactly as graph.ts has them today ---
// `stall-herbs-th` and `stall-coconut` carry an `alias`, so clicking them opens the aliased object's card
// and their own blurb is not the text a visitor reads. Both are written to the band anyway, so that the
// cards are in band if the lead ever drops the aliases and makes them ordinary siblings (Stage B ruling,
// 2026-09-21). `stall-herbs-th` aliases `herbsSea`, which belongs to the Hanoi area; the lead may prefer
// to re-point it at `chilliesSea`, and that is a `graph.ts` decision, not this file's.
const FM: [number, number] = [-40.5, 4.5];
THAILAND_OBJECTS.push(
  {
    id: "stall-fruit", world: "southeast-asia", kind: "dish", name: "Mangoes, rambutan & durian", zh: "ผลไม้", emoji: "🥭",
    area: "bangkok", pos: [-43.5, 1.6], prop: "none", hitOnly: true, parent: "floatingMarket",
    tagline: "Mangosteen by the boatload, and the durian of Nonthaburi.",
    blurb: "One hull in the basin carries nothing but fruit, in shallow baskets and on banana leaf so nothing bruises against the planking. Mangosteen and rambutan come in by the boatload with the rains and the price falls with them; bananas arrive still on the stem; nam dok mai mango has its few weeks in March and April; and the durian is the one the boat is really known for.\n\nThe orchards behind it are upriver at Nonthaburi, on raised beds with a water channel between each pair, and they have grown durian for centuries. The trade was rebuilt once: John Crawfurd's account records a flood in 1831 that destroyed most of the province's fruit trees, and Chinese immigrant growers put the orchards back commercially.\n\nThe fruit is sold the way water allows: opened by thumb over the gunwale and tasted before it is bought, nothing weighed, and a durian taken only when it has fallen by itself. What is ripe and unsold by mid-morning goes to the seller's own family, which is why this boat leaves early.",
    match: () => false,
  },
  {
    id: "stall-noodles", world: "southeast-asia", kind: "dish", name: "Boat noodles", zh: "ก๋วยเตี๋ยวเรือ", emoji: "🍜",
    area: "bangkok", pos: [-45.5, 4.2], prop: "none", hitOnly: true, parent: "floatingMarket",
    tagline: "A pot amidships, and a bowl passed over the gunwale.",
    blurb: "The one boat in the basin that sells something cooked: a charcoal pot amidships, a board across the gunwale, a wire strainer and a long ladle. The earliest written mention of kuaitiao is in the Bangkok Times in 1898, and the word is southern Chinese, kway teow, taken into Thai by the migration that brought the noodle.\n\nIn this period the broth in the pot is pork bone, soy and pepper with star anise and cinnamon, and the bowls are small chinaware handed up one at a time to somebody on the bank. The reason always given for their size, that a customer could finish before the boat moved on, is repeated everywhere in Thai food writing with no primary source behind it, so it is the story rather than the record.\n\nTwo things this dish is now famous for are younger than the canal: the dark, blood-thickened broth that boat noodles means today is mid twentieth century, and pad thai was distributed by a government campaign in the 1940s. The whole boat, opened up, is the noodle boat room next door.",
    match: () => false,
  },
  {
    id: "stall-herbs-th", world: "southeast-asia", kind: "ingredient", name: "Herbs & chillies", zh: "สมุนไพร", emoji: "🌿",
    area: "bangkok", pos: [-44.8, 7.4], prop: "none", hitOnly: true, parent: "floatingMarket", alias: "herbsSea",
    tagline: "Galangal, lemongrass, kaffir lime and coriander root.",
    blurb: "A boat of green things, cut upriver before dawn and tied in bundles rather than weighed: galangal and lemongrass, makrut lime leaf and fruit, coriander pulled with its root on, two basils, morning glory, pea aubergine and banana blossom. Sold by the armful, and by mid-morning the hull is empty and wet.\n\nOnly one thing on board came from outside the region. Chillies reached Siam with Portuguese traders in the sixteenth century; everything else is native, and galangal, lemongrass, kaffir lime and coriander root together are what make a Thai paste taste Thai. Coriander root is a seasoning here, not a trimming, which is why it is never cut off.\n\nWhere this basket goes is the rest of the area. The same four aromatics turn up at the spice stall on the Sampheng lane, in the granite mortar four doors along from it, in the pot on the noodle boat and in a southern paste with three times the turmeric in it. Nothing in this basket is cooked here; it is all going somewhere else.",
    match: () => false,
  },
  {
    id: "stall-coconut", world: "southeast-asia", kind: "ingredient", name: "Coconuts", zh: "มะพร้าว", emoji: "🥥",
    area: "bangkok", pos: [-41.8, 7.6], prop: "none", hitOnly: true, parent: "floatingMarket", alias: "coconutSea",
    tagline: "Young for the water, old for the cream.",
    blurb: "Two kinds of nut travel in the same boat and they are not the same product. The young ones, green and heavy, have their tops struck off with a cleaver on the spot: the water is drunk from the shell and the soft flesh scraped out with a piece of husk. The old ones, brown and dry, are sold whole to be grated at home, and they are the ones a kitchen needs.\n\nThe milk is the flesh, not the water. Grated on a toothed stool and squeezed through a cloth, the first pressing is thick cream, hua kathi, fried in a pan until its oil separates before any paste goes in. The second pressing, thin and pale, becomes the sauce. A cook with only one of them has half a curry, which is why the boat sells the nut and not a jug.\n\nThe rest of the tree accounts for most of what a household owns: oil and flesh for sweets, leaf for a roof and for wrapping, husk for scouring, shell for a scoop, and, from a taller palm on the plain, the sugar the sweets kitchen and the curry mortar both work with.",
    match: () => false,
  },
);

/** The market's own anchor, kept beside the stall positions so a reader can see they sit around it. */
export const THAILAND_MARKET_ANCHOR = FM;
