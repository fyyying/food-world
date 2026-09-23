/** Vietnam objects: data only. Owned by the Researcher. Ids, props, areas, positions and scenes follow the
 *  fixed Stage B blueprint in docs/vietnam-world.md, which supersedes the Stage A positions. Twenty-eight
 *  objects: twelve rooms, nine ingredient and flavour stops, seven landmarks, across `hanoi` and `mekong`.
 *
 *  Blurbs follow the China standard: dated records rather than invented birthdays, local names in Vietnamese
 *  with diacritics, legends labelled as legends. The visual band is 1900–1931 (docs/vietnam-research.md §8),
 *  and the temporal-composite rule the owner accepted applies: where an official source establishes a regional
 *  association but no origin date, the card says so instead of inventing one. Research authority for every
 *  record, date and name: docs/vietnam-research.md and docs/vietnam-world.md. */
import type { EnrichedRecipe, Kind, WorldObject } from "./graph";
import { VIETNAM_STORY_DEPTH } from "./vietnam-stories";

export { VIETNAM_STORY_DEPTH } from "./vietnam-stories";
export { VIETNAM_SOURCES, VIETNAM_DISCOVERIES } from "./vietnam-stories";

const has = (list: string[], re: RegExp) => list.some((x) => re.test(x));
const vietnamese = (r: EnrichedRecipe) => r.area === "hanoi" || r.area === "mekong";

/** Two links per card, always to another Vietnam object. */
export const VIETNAM_NEXT: Record<string, string[]> = {
  hanoiKitchen: ["starAniseVn", "herbsSea"],
  bunChaVn: ["herbsSea", "hanoiKitchen"],
  banhCuonVn: ["riceSea", "comVongVn"],
  comVongVn: ["lotusTeaVn", "riceSea"],
  hueKitchenVn: ["lemongrassVn", "hueCitadelVn"],
  banhHueVn: ["hueKitchenVn", "hueCitadelVn"],
  caoLauVn: ["hoiAnQuayVn", "miQuangVn"],
  miQuangVn: ["caoLauVn", "herbsSea"],
  banhMi: ["caPheVn", "benThanhVn"],
  huTieuVn: ["benThanhVn", "banhMi"],
  banhXeoVn: ["riceSea", "fishSauce"],
  mekongKitchenVn: ["riverFishVn", "fishSauce"],

  riceSea: ["banhCuonVn", "mekongKitchenVn"],
  chickenSea: ["hanoiKitchen", "mekongKitchenVn"],
  herbsSea: ["bunChaVn", "miQuangVn"],
  fishSauce: ["mekongKitchenVn", "bunChaVn"],
  starAniseVn: ["hanoiKitchen", "banhMi"],
  lemongrassVn: ["hueKitchenVn", "banhHueVn"],
  riverFishVn: ["mekongKitchenVn", "stilts"],
  lotusTeaVn: ["comVongVn", "waterPuppetsVn"],
  caPheVn: ["banhMi", "benThanhVn"],

  hoanKiem: ["hanoiKitchen", "motorbikes"],
  motorbikes: ["hanoiKitchen", "hoanKiem"],
  stilts: ["mekongKitchenVn", "riverFishVn"],
  hueCitadelVn: ["hueKitchenVn", "banhHueVn"],
  hoiAnQuayVn: ["caoLauVn", "miQuangVn"],
  waterPuppetsVn: ["lotusTeaVn", "comVongVn"],
  benThanhVn: ["huTieuVn", "banhMi"],
};

/** object id -> file stem in public/scenes/vietnam-food/, as written by scripts/scenes/import-vietnam.py */
export const VIETNAM_CARD_ART: Record<string, string> = {
  hanoiKitchen: "pho",
  bunChaVn: "bun-cha",
  banhCuonVn: "banh-cuon",
  comVongVn: "com-vong",
  hueKitchenVn: "bun-bo-hue",
  banhHueVn: "hue-cakes",
  caoLauVn: "cao-lau",
  miQuangVn: "mi-quang",
  banhMi: "bread-pate",
  huTieuVn: "hu-tieu",
  banhXeoVn: "banh-xeo",
  mekongKitchenVn: "mekong-home",
};

type Area = "hanoi" | "mekong";

type Room = {
  id: string;
  kind: Kind;
  area: Area;
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
    id: "hanoiKitchen", kind: "technique", area: "hanoi", name: "The phở kitchen", placeName: "Phở street kitchen", zh: "Gánh phở", emoji: "🍜",
    pos: [-0.5, -8], rot: 0.15, prop: "phoGanhVn", scene: "vn_pho",
    tagline: "A pole, a charcoal fire, a pot kept just under the boil.",
    blurb: "Phở is a northern rice-noodle soup, and Hanoi is where the record picks it up. A food-history profile published by the University of Michigan places its emergence in northern Vietnam in the late nineteenth or early twentieth century and keeps it inside its colonial context, without settling on an inventor; competing derivations from the French pot-au-feu and from the Cantonese word for rice noodle are both repeated and neither is established. This kitchen therefore serves an early, plain bowl, in a street set between 1900 and 1931, and asserts no first date.\n\nThe whole method is patience and skimming. Beef bones are blanched, rinsed and put back to simmer for hours at a temperature that never breaks into a boil, while onion and ginger are charred black over the coals and dropped in, and star anise, cinnamon and clove are toasted dry, tied in cloth and steeped rather than ground. The grey foam is lifted off the surface again and again, because a cloudy broth is a failed one. The noodles — bánh phở, cut flat and wide from a steamed rice sheet — are dipped for seconds, turned into the bowl, covered with raw beef sliced thin enough to cook in the stock, and finished with scallion.\n\nIt is breakfast. The pot is lit before dawn, the stools are a foot high, the bowl is held close, and the seller has usually made one thing for a very long time. Herbs, lime and chilli sit on the table so the eater finishes the seasoning; the cook's job ended when the broth went in clear.\n\nThe pole is what made it a trade. A photograph of Hanoi street vendors from 1931 records women carrying an entire business on one shoulder pole with a basket at each end, and the gánh phở worked the same way — pot, brazier, bowls, noodles and stools, set down on a corner and picked up again. Further south the same soup grows sweeter and arrives with a plate of bean sprouts and basil; in Hanoi it stays clear, and the argument about that has never stopped.",
    partners: ["star anise", "rice noodles", "beef", "herbs", "lime"],
    match: (r) => r.place === "hanoiKitchen",
  },
  {
    id: "bunChaVn", kind: "dish", area: "hanoi", name: "The charcoal courtyard", placeName: "Bún chả courtyard", zh: "Bún chả", emoji: "🔥",
    pos: [-8.9, -18], rot: -0.25, prop: "bunChaGrillVn", scene: "vn_bun_cha",
    tagline: "Pork off the coals, straight into a bowl of broth.",
    blurb: "Bún chả belongs to Hanoi's Old Quarter, which Vietnam's tourism board describes as the historic heart of the city's ancient guild streets, where trades are grouped street by street and the food is sold from the front of the house. The same source identifies the dish as an Old Quarter speciality. No official source consulted gives a year for the first bún chả, so this card gives none: the address is documented, the birthday is unverified.\n\nIt arrives as separate things rather than as a plate. Pork comes two ways — chả viên, patties of minced shoulder, and chả miếng, slices of belly — both marinated with fish sauce, sugar, shallot and pepper and grilled over an open brazier until the fat has coloured and caught. They go hot into a bowl of nước chấm, fish sauce let down with water, vinegar and sugar, with slivers of green papaya and carrot floating in it. Cool bún, rice vermicelli, comes undressed on its own plate, and a basket of mint, coriander, perilla and lettuce comes on a third.\n\nThe eater assembles every mouthful: noodles into the broth, a piece of pork, a pinch of herbs, and on again. It is a lunch and not a dinner, it is eaten on stools at the level of the grill, and the smoke rolling into the street is the shop's only advertisement.\n\nThe crab spring roll beside it, nem cua bể, is Hanoi's own addition to the tray — a square parcel of crab, pork and glass noodles fried crisp and cut into fingers, dipped in the same bowl. Further south the family resemblance survives in bún thịt nướng, where the grilled pork and the noodles are served together dry with the dressing poured over, and the Hanoi version's separate bowl of hot broth disappears.",
    partners: ["pork", "herbs", "fish sauce", "rice vermicelli", "green papaya"],
    match: (r) => r.place === "bunChaVn",
  },
  {
    id: "banhCuonVn", kind: "dish", area: "hanoi", name: "The cloth steamer", placeName: "Rice-sheet steamer", zh: "Bánh cuốn", emoji: "🌯",
    pos: [15, -15.6], rot: 0.35, prop: "banhCuonSteamerVn", scene: "vn_banh_cuon",
    tagline: "A sheet thin enough to read a hand through, lifted off cloth.",
    blurb: "Bánh cuốn is a northern breakfast, and Vietnam's tourism board describes it exactly as it is made here: fermented rice batter ladled onto a cloth stretched over a pot of boiling water, covered for a few seconds, then lifted away as a single translucent sheet. No official source consulted dates the practice, and this card invents nothing; what the record carries is the technique, the filling and the region. The Red River lowland around this courtyard is one of Viet Nam's two major rice zones, where the FAO records manual transplanting as the widespread practice.\n\nThe batter is the slow part and the steam is the fast one. Rice is soaked overnight, ground wet with water, and left to sour slightly, which is what makes the finished sheet elastic rather than brittle. A ladleful goes onto the stretched cloth, a lid goes over it, and in the time it takes to pick up the next ladle the sheet has set. It is lifted with a flat bamboo wand, laid on an oiled board, filled with minced pork, wood-ear mushroom and fried shallot, rolled, and cut. The loop never stops while the pot is hot.\n\nWhat goes on top is dry and crisp against the soft roll: hành phi, shallot fried in advance and kept away from the steam, with herbs, slices of the smooth pork sausage chả lụa, and a bowl of diluted fish sauce to dip into. It is eaten early, standing or on a stool, and a plate is finished in a few minutes.\n\nThe same grain runs through this whole cluster in different states. Pulled into strands it is the vermicelli at the grill up the street; cut flat from a sheet like this one it is the phở noodle; roasted young and pounded flat it is the green cốm in the next courtyard. Further south the sheets are steamed thicker and rolled around a coarser filling, and in Hanoi the boast is thinness.",
    partners: ["rice", "pork", "wood-ear mushroom", "fried shallot", "fish sauce"],
    match: (r) => r.place === "banhCuonVn",
  },
  {
    id: "comVongVn", kind: "technique", area: "hanoi", name: "The green-rice courtyard", placeName: "Green-rice courtyard", zh: "Cốm Vòng", emoji: "🌾",
    pos: [8.2, -16.8], rot: -0.15, prop: "comCourtyardVn", scene: "vn_com_vong",
    tagline: "Young grain, roasted and struck flat, carried in a lotus leaf.",
    blurb: "Cốm is a few weeks of autumn rather than a dish. Vietnam's tourism board describes sticky rice cut while the grain is still young and milky, roasted, pounded in a wooden mortar and winnowed until what remains is a flat pale-green flake, then wrapped in lotus leaf. The attribution of the finest cốm to Vòng village on the edge of Hanoi is widely reported and is recorded here as reported; the official source establishes the practice and the season, not a village's monopoly, and gives no first date.\n\nEvery step is deliberate and none of it is milling. Young grain is too soft to grind, so it is dried gently over a low fire in a shallow pan, then struck: a wooden pestle falls into a heavy mortar while a second worker turns the grain between blows, and the flakes are sieved and pounded again until they are thin enough to be translucent at the edge. Too much heat hardens the grain and it will not flatten; too little and the husk will not let go in the winnowing tray. The colour is the grain's own.\n\nAlmost nothing is then done to it. The flakes are pinched up from the leaf as they are, eaten with slices of ripe banana, pressed with sweet mung bean into the small squares called bánh cốm, or stirred into the light sweet soup chè cốm. None of that needs a fire, which makes this the quietest food work in the whole area: one pestle, one sieve, one leaf.\n\nThe lotus leaf is not decoration. It holds moisture in, keeps the flakes from packing down, and leaves a faint scent on them, which is why cốm is sold by the bundle rather than by the bag and why bánh cốm travels as a gift. When the season ends the mortar goes back under the eaves and the courtyard returns to ordinary rice.",
    partners: ["young sticky rice", "lotus leaf", "mung bean", "banana"],
    match: (r) => r.place === "comVongVn",
  },
  {
    id: "hueKitchenVn", kind: "dish", area: "hanoi", name: "The lemongrass broth", placeName: "Huế noodle kitchen", zh: "Bún bò Huế", emoji: "🌶️",
    pos: [15.7, -1.6], rot: 0.2, prop: "bunBoHueVn", scene: "vn_bun_bo_hue",
    tagline: "Red-gold broth, round noodles, and the seasoning left to you.",
    blurb: "Huế was made the capital of a unified Viet Nam by the Nguyễn dynasty in 1802 and remained the political, cultural and religious centre until 1945; in 1993 UNESCO inscribed the Complex of Huế Monuments, the first Vietnamese property on the World Heritage List, with the Perfume River running through its Capital, Imperial, Forbidden Purple and Inner Cities. This kitchen stands on a veranda at the garden edge of that city. Official tourism sources associate bún bò Huế with Huế and give no origin date, and none is asserted here.\n\nThe pot is the identity. Beef shank and pork bones are simmered together; lemongrass goes in bruised and whole rather than pounded to a paste, and mắm ruốc, the local shrimp paste, is loosened in a little hot stock and strained back in so that it seasons the broth without silting it. The noodle is bún, round and thicker than the flat northern one. Into the bowl go sliced shank, a piece of pork knuckle, congealed blood cake in the local version, and a spoon of chilli oil floated on at the end, which is where the red-gold colour comes from.\n\nWhat reaches the table is unfinished on purpose. Lime, sliced chilli, raw onion, shredded banana flower and a plate of herbs sit beside the bowl, and no two bowls leave this bench seasoned the same way. It is eaten at any hour, and in Huế it is a breakfast as readily as a supper.\n\nThe city's other habit is in the room next door: many small, exactly made things instead of one large one. It is worth naming the caution as well. Huế's reputation as an imperial capital has encouraged the habit of calling every local dish court food; the documented court cuisine is a separate and far more elaborate tradition, and a market bowl like this one is no evidence of it.",
    partners: ["lemongrass", "shrimp paste", "beef", "rice vermicelli", "herbs"],
    match: (r) => r.place === "hueKitchenVn",
  },
  {
    id: "banhHueVn", kind: "dish", area: "hanoi", name: "The rice-cake bench", placeName: "Huế steamer bench", zh: "Bánh Huế", emoji: "🥮",
    pos: [8.4, 0.8], rot: -0.3, prop: "hueCakeVn", scene: "vn_hue_cakes",
    tagline: "Eight small things instead of one big one.",
    blurb: "What has a record here is the group, not any single cake. Vietnam's tourism board identifies bánh bèo as a Huế snack, and around it sit the other forms this bench makes: bánh nậm steamed flat inside a folded banana leaf, bánh bột lọc of clear tapioca wrapped around a shrimp and a strip of pork, bánh ram ít setting a soft glutinous dumpling on a fried crisp base. No official source consulted gives any of them an origin date, and this card gives none. The setting is the garden edge of the city UNESCO inscribed in 1993.\n\nIt is one technique repeated in dozens. A shallow mould or a folded leaf, a measured spoonful of rice or tapioca batter, a few minutes over steam, and the tray comes out. Bánh bèo set in their own little dishes dimple in the centre as they cook, and the hollow is what holds the topping: dried shrimp pounded to a floss, crisp pork crackling, and a spoon of scallion oil. They are eaten with a flat bamboo splint rather than a spoon.\n\nNothing is portioned large, because the point of the tray is variety. A person works through eight or ten small different things, with a dish of diluted fish sauce in the middle of the table, and the bill is counted in empty dishes stacked at the edge.\n\nBanana leaf does two jobs at once. Passed over heat until it goes limp it stops splitting when folded, and it then serves as the cooking vessel and the plate together: the parcel steams, travels and is untied in front of the eater. That is why this bench needs almost no pans — only moulds, leaves, a steamer and a jug of oil — and why the same craft turns up at every market in central Vietnam with the fillings changed.",
    partners: ["rice flour", "tapioca", "dried shrimp", "banana leaf", "scallion oil"],
    match: (r) => r.place === "banhHueVn",
  },
  {
    id: "caoLauVn", kind: "dish", area: "hanoi", name: "The Hội An noodle shop", placeName: "Hội An shophouse", zh: "Cao lầu", emoji: "🍲",
    pos: [22.2, 0.9], rot: 0.1, prop: "caoLauShopVn", scene: "vn_cao_lau",
    tagline: "Dressed, not drowned: a warm bowl with almost no broth.",
    blurb: "In 1999 UNESCO inscribed Hội An Ancient Town as an exceptionally well-preserved South-East Asian trading port of the fifteenth to the nineteenth century, recording 1,107 timber-frame buildings with brick or wooden walls, a street grid laid parallel and perpendicular to the river, an open market and a ferry quay. This shop is one of those buildings: a counter at the street end, a service door to the water at the other, and the length of the house between them. Official sources associate cao lầu with Hội An and give it no date.\n\nThe bowl holds almost no liquid. Vietnam's tourism board describes thick, chewy noodles with sliced pork, fresh herbs, bean sprouts and crisp squares of fried dough, with only a small amount of savoury sauce at the bottom — nearer a warm salad than a soup, which is the quickest way to tell it from every other noodle in this package. The noodle itself is unusually firm and comes out faintly grey-gold rather than white.\n\nIt is a midday bowl, eaten at a low table with the fan going, and it is tossed once by the eater so the sauce reaches the top. The cracklings go on last and are the only crunch in it, so they are added at the counter and not in the kitchen.\n\nThe origin is contested, and saying so is the honest answer. Hội An's own heritage authority publishes a discussion warning that the familiar Chinese-origin and name-based explanations of cao lầu are debated rather than settled, and the local accounts tying the noodle's texture to water from one particular well and ash from one particular island are repeated everywhere without being established. Legend offers several first cooks; the documents offer a port, a street plan and a dish that belongs to them.",
    partners: ["pork", "herbs", "bean sprouts", "rice noodles"],
    match: (r) => r.place === "caoLauVn",
  },
  {
    id: "miQuangVn", kind: "dish", area: "hanoi", name: "The shallow-broth counter", placeName: "Quảng Nam noodle counter", zh: "Mì Quảng", emoji: "🥣",
    pos: [29.1, 5.3], rot: -0.2, prop: "miQuangShopVn", scene: "vn_mi_quang",
    tagline: "One ladle only, so the toppings stay above the line.",
    blurb: "Mì Quảng belongs to Quảng Nam, the province Hội An stands in. Official tourism sources describe broad rice noodles dressed with a small quantity of rich turmeric-coloured broth and topped variously with pork, chicken, shrimp or river fish, and they establish no origin year; this card gives the place and not a date, which is the rule the whole area is written to.\n\nThe measure of broth is the entire technique. One shallow ladle goes in — enough to wet the noodles and pool at the bottom — and everything else is layered dry on top, where it can still be seen: herbs, shredded banana flower, roasted peanuts, a quail egg in some houses, and a sesame rice cracker broken over the bowl by the eater rather than by the cook. Fill it like a soup and it stops being this dish.\n\nThe bowl proves it. A mì Quảng bowl is wide and shallow, wider than it is deep, because a deep one would submerge the toppings; the noodles are cut broad and flat from a rice sheet and are often tinted gold with turmeric. Bánh tráng mè, the sesame cracker, is toasted until it blisters and snapped in, so the last mouthfuls are crunchier than the first.\n\nIt is an everyday bowl rather than a speciality, made at home as readily as at a counter, and the topping is whatever the market had: the same kitchen will sell a pork-and-shrimp version, a chicken version and a snakehead-fish version on the same morning. Up the road in Hội An the neighbouring dish goes the other way and has almost no broth at all, so the two counters, a few minutes apart, are separated by a single ladle.",
    partners: ["rice noodles", "turmeric", "peanuts", "banana flower", "shrimp"],
    match: (r) => r.place === "miQuangVn",
  },
  {
    id: "banhMi", kind: "technique", area: "mekong", name: "The bread and pâté counter", placeName: "Bread and pâté counter", zh: "Bánh mì pa-tê", emoji: "🥖",
    pos: [16.1, 17.6], rot: 0.25, prop: "breadPateCartVn", scene: "vn_bread_pate",
    tagline: "A warm loaf split open, and a crock of pâté beside it.",
    blurb: "This counter is deliberately held early. Vietnam's tourism board identifies bánh mì with Saigon, but the loaded sandwich everyone now pictures — pâté, cold cuts, mayonnaise, pickled carrot and daikon, cucumber, coriander and chilli in one loaf — is later than the 1900–1931 band this area is built to; accounts commonly place its assembly in Saigon in the 1950s, and that dating is reported here rather than documented. What the period supports is bread and pâté sold side by side on a street counter, which is what this stall is.\n\nThe bread is the part that genuinely belongs to this moment. Wheat flour, a charcoal-heated oven and small loaves with a thin brittle crust and a light open crumb: a street bakery's size, sold whole and warm within the hour, cheap enough to be breakfast rather than an import. The lighter Vietnamese loaf and the rice-flour blends that later made it distinctive belong to a chronology this card does not try to fix. The name itself means nothing more than bread.\n\nThe pâté is a crock and a knife. A coarse liver paste is kept under its own fat and spread on the cut crumb of a split loaf; an egg may sit beside it in its shell, and that is the whole transaction. Bread with a ribbon of sweetened milk is the other thing sold here, and it is eaten standing up with a glass of tea or a cup from the filter across the street.\n\nThe absence is deliberate too. At Stage B the bowl of shredded pickled carrot and daikon was taken off this counter, because that bowl points straight at the later sandwich and would have broken the band the whole area is built on. The loaded version is a real and important dish; it simply belongs to a Saigon a generation after this street.",
    partners: ["wheat flour", "pâté", "eggs", "condensed milk"],
    match: (r) => r.place === "banhMi",
  },
  {
    id: "huTieuVn", kind: "dish", area: "mekong", name: "The Chợ Lớn noodle shop", placeName: "Chợ Lớn shophouse", zh: "Hủ tiếu", emoji: "🍤",
    pos: [22.6, 15.8], rot: -0.15, prop: "huTieuShopVn", scene: "vn_hu_tieu",
    tagline: "A wire basket, one shake, and a clear stock poured over.",
    blurb: "Hủ tiếu is a Saigon staple with no date attached to it. Vietnam's tourism board names it among the city's defining street foods beside bánh mì and describes rice noodles in a clear stock with pork and shrimp, but it establishes no origin year and neither does this card. The dish travelled with Teochew and other Chinese communities through Chợ Lớn and Phnom Penh, which is why the best-known version on a Saigon counter carries the name Nam Vang, the Vietnamese name for Phnom Penh. The route is well attested; the first bowl is unverified.\n\nThe stock is the opposite of the pot at Huế. Pork bones are simmered and skimmed to a pale, clear liquid, seasoned lightly, sometimes with dried shrimp, squid and a little rock sugar, and never thickened or coloured. The noodles are blanched in a long-handled wire basket dipped into boiling water for a few seconds and drained with one sharp shake; a moment too long and the strand goes slack under the broth. Over them go minced pork, sliced pork, shrimp, chives, pepper and fried shallot.\n\nThe same bowl comes two ways, and the counter shows both. Hủ tiếu nước arrives as soup. Hủ tiếu khô arrives drained, tossed in a dark seasoning at the bottom of the bowl, with its broth following in a small cup to be drunk alongside. Regulars order by the noodle as much as by the topping.\n\nThat is the third choice on this counter: fine dried rice strands that stay firm, softer fresh ones, or chewy tapioca-blended ones that squeak against the spoon. A deep shophouse holds the pot at the front where the street can see the steam and the tables run back into the shade behind, which is the same street-to-back plan the shophouses at Hội An use, five hundred kilometres north.",
    partners: ["pork", "shrimp", "rice noodles", "chives", "fried shallot"],
    match: (r) => r.place === "huTieuVn",
  },
  {
    id: "banhXeoVn", kind: "dish", area: "mekong", name: "The sizzling pan", placeName: "Bánh xèo pan", zh: "Bánh xèo", emoji: "🥘",
    pos: [-1.4, 13.65], rot: 0.3, prop: "banhXeoHearthVn", scene: "vn_banh_xeo",
    tagline: "Named after the noise the batter makes.",
    blurb: "Vietnam's tourism board describes bánh xèo as a Mekong Delta creation and explains the name directly: xèo is the sound the batter makes when it hits hot fat. That is as close to a documented origin as this dish has, and no official source consulted gives it a first date, so none is written here. The delta around this hearth is where its three components meet without anyone buying anything.\n\nThe batter carries all three. Rice flour gives the structure, coconut milk gives the richness and the browning, and turmeric gives the yellow that is routinely mistaken for egg. It is poured into a wide shallow pan already holding pork and shrimp, swirled once around the rim so it climbs the side in a thin skirt, then covered over a handful of bean sprouts until the edge lifts away from the metal and crackles. The pan is tilted, the crêpe is folded once, and it slides out whole.\n\nIt is eaten with the hands. A piece is torn off, laid on a lettuce or mustard leaf with mint and perilla from the herb plate, rolled, and dipped in fish sauce let down with garlic, chilli, lime and sugar. Nobody uses a fork, and a plate of leaves as big as the plate of crêpe is not a garnish but half the dish.\n\nThe same batter has a small relation in the next mould along. Bánh khọt goes into a dimpled pan, one round cake to each hollow, with a shrimp pressed into the top and scallion oil brushed over, and it is wrapped and dipped exactly the same way. Further north the crêpe is made smaller and thicker and the coconut milk often disappears, which is a fair guide to how far south you are: the bigger and the crisper the skirt, the closer the delta.",
    partners: ["rice flour", "coconut milk", "turmeric", "shrimp", "bean sprouts"],
    match: (r) => r.place === "banhXeoVn",
  },
  {
    id: "mekongKitchenVn", kind: "technique", area: "mekong", name: "The delta family hearth", placeName: "Delta family hearth", zh: "Bếp miền Tây", emoji: "🐟",
    pos: [-8.2, 4.1], rot: -0.1, prop: "mekongHomeVn", scene: "vn_mekong_home",
    tagline: "A clay pot, a sour soup, and rice everything is measured against.",
    blurb: "This is a meal rather than a dish, and the record behind it is agricultural. The FAO describes long-standing rice-based farming systems in the Mekong Delta with aquatic production integrated into them — fish or prawn in the same water as the rice, in rotation with the flood. A household here has grain, fish and river vegetables within reach of one door, and the family table is built from exactly those three. No dish on it is given a first date.\n\nThe clay pot is the anchor. Cá kho tộ is river fish cut into steaks and simmered in nước mắm with caramelised sugar and coarse black pepper until the liquid reduces to a dark glaze that is brushed back over the fish; earthenware is used because it holds heat evenly and lets the last of the sauce tighten without catching. Beside it goes canh chua, a sour soup that takes its sourness from tamarind, with pineapple, tomato, okra and the crisp stems of an aquatic plant, and a pot of plain white rice.\n\nEverything arrives at once and nothing is a course. Bowls of rice are filled individually and the shared dishes stay in the middle; a mouthful of glazed fish is followed by a spoon of sour soup, and the salt of one against the sharpness of the other is the whole design of the meal. A small bowl of fish sauce with sliced chilli sits within reach of every hand.\n\nThat seasoning has a registered name. In 2012 the European Union registered Phú Quốc as a protected designation of origin for fish sauce, and the published specification defines the area as the island of Phú Quốc and specified surrounding waters — the barrel house a short walk along this channel. Thịt kho trứng, pork belly and whole eggs braised slowly in coconut water, is the other pot this hearth is known for, and it is the dish that gets made in quantity when the family is larger than usual.",
    partners: ["river fish", "tamarind", "fish sauce", "rice", "pork"],
    match: (r) => r.place === "mekongKitchenVn",
  },
];

export const VIETNAM_OBJECTS: WorldObject[] = rooms.map((room) => ({
  id: room.id,
  world: "southeast-asia" as const,
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
  tagline: room.tagline,
  blurb: room.blurb + "\n\n" + VIETNAM_STORY_DEPTH[room.id],
  partners: room.partners,
  match: room.match,
}));

// --- ingredient and flavour stops: a card and a 3D reaction, no room ---
VIETNAM_OBJECTS.push(
  {
    id: "riceSea", world: "southeast-asia", kind: "ingredient", name: "Rice in four forms", zh: "Gạo", emoji: "🍚",
    area: "mekong", pos: [8, 8.6], rot: 0.05, elevation: 0, prop: "riceFormsVn",
    tagline: "One grain, and then a noodle, a sheet, a cake and a flake.",
    blurb: "Viet Nam has two great rice zones and this world visits both. The FAO records manual transplanting as the widespread practice in the northern and central lowlands, against direct seeding in the Mekong Delta. That is why the Red River squares in the north of this table look worked by hand and the delta ones here look flooded and open.\n\nAt the table the grain rarely stays a grain. Soaked, ground wet and steamed on cloth it becomes the translucent sheet of bánh cuốn; cut from that sheet it is the flat bánh phở; extruded and dried it is the round bún; dried thin and hard it is the bánh tráng wrapper. Cut young, roasted and pounded, it is the green cốm of a northern autumn.\n\nThe FAO also records delta rice systems worked for a very long time, with aquatic production integrated into them rather than added on. Fish in the paddy, grain from the paddy and a wrapper made from the grain are not three trades here; they are one flooded square read at different moments of the year.",
    partners: ["rice noodles", "rice paper", "fish", "water"],
    match: (r) => vietnamese(r) && has(r.core, /rice|noodle|vermicelli/),
  },
  {
    id: "chickenSea", world: "southeast-asia", kind: "ingredient", name: "The chicken yard", zh: "Gà nhà", emoji: "🐔",
    area: "mekong", pos: [-7.7, 12.85], rot: 0.2, elevation: 0, prop: "chickenYardVn",
    tagline: "A few birds under the house, kept for eggs and for guests.",
    blurb: "Every delta household here keeps a handful of birds scratching in the shade under the floor, and they are an ingredient rather than a crop. A yard chicken is small, lean and slow-grown, which explains the way it is cooked: a whole bird is poached rather than roasted, because poaching makes the tough meat tender and leaves a broth behind.\n\nThat gives two dishes from one pot. The bird comes out, cools until the flesh firms, and is torn along the grain for gỏi gà, tossed with shredded cabbage or banana flower, mint and coriander, roasted peanuts and a dressing of fish sauce, lime and sugar. The broth goes back on the fire under a bowl of noodles.\n\nVietnam's tourism board lists chicken across the regional repertoires here: poached and shredded for salad, simmered with turmeric over broad noodles in Quảng Nam, set on turmeric rice in Hội An. The yard bird is also why no household needs a cold store — it is killed on the morning it is wanted.",
    partners: ["lime", "fish sauce", "herbs", "banana flower"],
    match: (r) => vietnamese(r) && has(r.core, /chicken/),
  },
  {
    id: "herbsSea", world: "southeast-asia", kind: "ingredient", name: "The herb trays", zh: "Rau thơm", emoji: "🌿",
    area: "hanoi", pos: [2.8, -15.7], rot: 0.1, elevation: 0, prop: "herbTraysVn",
    tagline: "Sold loose, by the bundle, and eaten raw by the handful.",
    blurb: "A Vietnamese table is not seasoned to a finish in the kitchen. Official descriptions of the dishes in this area name mint, coriander, basil and shredded banana flower beside the bowl rather than in it — in bún chả, in phở, in mì Quảng — and that plate of rau thơm is what the eater finishes the food with.\n\nThe leaves are kept separate and kept whole. Mint, coriander, sawtooth coriander, perilla and Vietnamese basil with its purple stem are tied into their own bundles, stood in shallow water and pinched off into the quantity asked for. Nothing is chopped, because a cut leaf loses its smell before it reaches the table.\n\nThese are Vietnamese herbs on a Vietnamese plate and not a borrowed composition: the pounded paste of lemongrass, galangal and lime leaf belongs to the Thai kitchens on the far side of this table. Here the aromatics stay raw, loose and last.",
    partners: ["mint", "coriander", "perilla", "banana flower"],
    match: (r) => vietnamese(r) && has(r.core, /herb|mint|coriander|cilantro|basil/),
  },
  {
    id: "fishSauce", world: "southeast-asia", kind: "flavour", name: "The Phú Quốc barrels", zh: "Nước mắm Phú Quốc", emoji: "🫙",
    area: "mekong", pos: [-8.4, 9.6], rot: 0.1, elevation: 0, prop: "phuQuocBarrelsVn",
    flavour: ["salty", "umami", "deep"],
    tagline: "Anchovy and salt in a wooden vat, drawn off a year later.",
    blurb: "Nước mắm is anchovy layered with salt in a large wooden vat and left until the fish have dissolved into a clear amber liquid, and the first draw from the tap is kept separate. It is the salt of this whole area: it seasons the pot, it sits in a small bowl on the table, and let down with water, lime, sugar, garlic and chilli it becomes nước chấm.\n\nThe island version has a registered name rather than a reputation. In 2012 the European Union registered Phú Quốc as a protected designation of origin for fish sauce, and the published specification defines the area as the island of Phú Quốc and specified surrounding waters — a legal boundary drawn around a fishery.\n\nThat is why the large barrels stand at exactly one stop in this world and every other kitchen shows only a table bowl. The tap is the barrel house's whole skill: it is opened for a measured run and closed exactly, because the liquid is drawn in grades and mixing them wastes the first one.",
    partners: ["lime", "chilli", "garlic", "sugar"],
    match: (r) => vietnamese(r) && has(r.core, /fish sauce/),
  },
  {
    id: "starAniseVn", world: "southeast-asia", kind: "flavour", name: "The phở spice tray", zh: "Hồi, quế và đinh hương", emoji: "⭐",
    area: "hanoi", pos: [-4.4, -16], rot: -0.2, elevation: 0, prop: "phoSpiceTrayVn",
    flavour: ["warm", "sweet", "aromatic"],
    tagline: "Four spices, toasted dry, tied in cloth and taken out again.",
    blurb: "Vietnam's tourism board names star anise, clove and cinnamon among the aromatics of a phở broth, with charred onion and ginger alongside them. This tray sits across the street from the kitchen that uses them for that reason: they belong to one pot, not to a general spice trade, and nothing here is ground.\n\nThe method is dry heat and then restraint. The whole spices are toasted in a dry pan until the smoke turns sweet, tied into a cloth bag, and steeped in the simmering stock for part of its cooking — then lifted out, because a broth left on star anise past that point turns medicinal. Cassia bark stands in for cinnamon in most of Viet Nam.\n\nStar anise grows in the northern uplands not far from this street, which is one reason the northern bowl smells of it and the southern one is lighter on spice. The same spices turn up in the pork braise and in the clay-pot fish further south, always whole, briefly, and then removed.",
    partners: ["beef bones", "charred onion", "ginger", "cassia"],
    match: (r) => vietnamese(r) && has(r.core, /star anise|cinnamon|clove|cassia/),
  },
  {
    id: "lemongrassVn", world: "southeast-asia", kind: "flavour", name: "The lemongrass baskets", zh: "Sả và mắm ruốc", emoji: "🍋",
    area: "hanoi", pos: [17.6, 5.8], rot: 0.15, elevation: 0, prop: "lemongrassBasketVn",
    flavour: ["citrus", "funky", "sharp"],
    tagline: "Bruised whole, not pounded, and a jar of shrimp paste beside it.",
    blurb: "Official tourism sources anchor bún bò Huế in two things, and both are in these baskets at the garden gate: sả, lemongrass, and mắm ruốc, the fermented shrimp paste of the central coast. They are what separates the Huế pot from every northern broth in this area.\n\nThe handling is deliberately plain. A stalk is trimmed, the outer leaves stripped, the white base flattened with the back of a knife so the oils release, and it goes into the stock whole to be fished out later. The shrimp paste is never added straight to a pot: a spoonful is loosened in a ladle of hot stock, left to settle and strained back in, so the funk arrives without the silt.\n\nLemongrass is a grass and grows in clumps at the edge of a garden rather than in a field, which is why this stop is a gate and not a plot. Cut stalks keep for a week in a basket and travel well, and a cook buys them by the handful for a single pot.",
    partners: ["beef", "chilli oil", "shrimp paste", "lime"],
    match: (r) => vietnamese(r) && has(r.core, /lemongrass|shrimp paste/),
  },
  {
    id: "riverFishVn", world: "southeast-asia", kind: "ingredient", name: "The river-fish basket", zh: "Cá sông", emoji: "🎣",
    area: "mekong", pos: [6.6, 21.7], rot: -0.25, elevation: 0, prop: "riverFishBasketVn",
    tagline: "Freshwater fish out of the same water the rice grows in.",
    blurb: "The FAO's material on the Mekong Delta records rice-based farming systems with aquatic production integrated into them, including rice-and-prawn culture in the same fields. That is the plain explanation of this basket: the fish in it did not come from the sea or from a market, it came out of the channel behind the house.\n\nWhat that gives a kitchen is a firm freshwater fish rather than a delicate one — snakehead, catfish, carp and the smaller fish kept whole. Firm flesh is why the delta's signature is a clay pot: steaks hold their shape through a long reduction in fish sauce and caramel, and the same fish goes into a sour tamarind soup without falling apart.\n\nThe gear matches the water. A lift net on a bamboo frame, a woven basket trap set in a channel mouth, a line from the step of a stilt house: the flood does the moving and the fisher waits for it. When the water drops the same square is drained and planted.",
    partners: ["tamarind", "fish sauce", "rice", "okra"],
    match: (r) => vietnamese(r) && has(r.core, /fish|catfish|prawn|shrimp/),
  },
  {
    id: "lotusTeaVn", world: "southeast-asia", kind: "ingredient", name: "The lotus tea tray", zh: "Trà sen", emoji: "🍵",
    area: "hanoi", pos: [3.6, -18.9], rot: 0.3, elevation: 0, prop: "lotusTeaTrayVn",
    tagline: "A leaf, a seed, a cup, and a quiet lane in the afternoon.",
    blurb: "Lotus is a northern landscape before it is a food. It fills the shallow water of the Red River lowland, and its parts are used where they are useful: the broad leaf as a wrapper, the seed in sweet soups, the stem shredded into a salad. Vietnam's tourism board records the leaf as the wrapping for cốm, which is the strongest food claim this stop makes.\n\nThe scenting of tea with lotus is the practice this lane is named for, and it is reported here rather than documented. The method usually described is to layer green tea with the pale inner stamens of the flower, or to pack tea inside a living bloom overnight, and to repeat it several times.\n\nThis world's own research note is explicit that lotus and tea are a landscape and refreshment cue here and should not be turned into a claim about the national table, so the tray stays a tray: a small pot, two cups the size of a thumb, and a seat in the shade between the steaming courtyard and the puppet tank.",
    partners: ["green tea", "lotus seed", "green rice", "lotus leaf"],
    match: (r) => vietnamese(r) && has(r.core, /lotus|tea/),
  },
  {
    id: "caPheVn", world: "southeast-asia", kind: "flavour", name: "The coffee filter", zh: "Cà phê phin", emoji: "☕",
    area: "mekong", pos: [27.6, 11.2], rot: -0.2, elevation: 0, prop: "caPheStallVn",
    flavour: ["bitter", "roasted", "sweet"],
    tagline: "A small metal drip pot standing on a glass, taking its time.",
    blurb: "Coffee arrived in Viet Nam in 1857, brought by French missionaries, but it did not become a crop for another thirty years: the first plantations were set up in 1888 in Ninh Bình and Quảng Bình in Tonkin. In the 1920s the colonial administration opened new growing zones in the Central Highlands, mainly in Đắk Lắk, and production reached roughly 1,500 tonnes a year by 1930.\n\nThe brewing is a small metal chamber set on the rim of a glass. Ground coffee goes in, a perforated press is screwed down, hot water is poured over, and it drips through slowly enough that watching is part of the order. The name phin is generally explained as a borrowing of the French filtre, which is reported rather than documented, as is the claim that robusta was introduced from Indonesia in 1908.\n\nFresh milk was scarce and expensive, so a spoonful of sweetened condensed milk went into the bottom of the glass and the coffee dripped onto it. Over ice that becomes the drink the country is now known for.",
    partners: ["condensed milk", "ice", "bread", "sugar"],
    match: (r) => vietnamese(r) && has(r.core, /coffee/),
  },
);

// --- landmarks: a card and a 3D reaction, no recipes ---
VIETNAM_OBJECTS.push(
  {
    id: "hoanKiem", world: "southeast-asia", kind: "landmark", name: "Hoàn Kiếm lake", zh: "Hồ Hoàn Kiếm", emoji: "🐢",
    area: "hanoi", pos: [-2.2, -20.1], rot: 0, elevation: 0, prop: "hoanKiemVn",
    tagline: "The Lake of the Returned Sword, with its tower and its red bridge.",
    blurb: "Hanoi sits in the lower Red River valley, and UNESCO describes the citadel of Thăng Long at its centre as built on land reclaimed from the delta. This lake is one of the pieces of that water the city kept, and two structures on it are dated: the Thê Húc bridge, built in 1865 by the scholar Nguyễn Văn Siêu, and the Tháp Rùa, the Turtle Tower on the islet, built in 1886.\n\nLegend gives the lake its name. The story is that the emperor Lê Lợi, after driving out the Ming in 1428, was on the water when a golden turtle rose and took back the magic sword he had been lent, so the lake became Hoàn Kiếm, the returning of the sword. That is a legend and is labelled as one.\n\nFor the food street a few minutes away the lake is where the shade and the flat ground are. The shore is a morning place — walking, exercise, tea — and the kitchens around it open before the light.",
    match: () => false,
  },
  {
    id: "motorbikes", world: "southeast-asia", kind: "landmark", name: "Street carriers", zh: "Gánh hàng rong", emoji: "🧺",
    area: "hanoi", pos: [-8, -9.7], rot: 0.2, elevation: 0, prop: "streetCarriersVn",
    tagline: "A whole trade on one pole, a handcart, and a bicycle bell.",
    blurb: "A photograph of Hanoi street vendors from 1931 records what moved food through this city: a shoulder pole across the back of the neck with a flat basket hanging at each end. A Library of Congress view of the entrance to Hanoi's native business section records the street those poles worked — narrow frontages, goods to the edge of the paving, no room for anything wide.\n\nThe pole is a tool and not a picturesque detail. A springy bamboo shaft flexes in step so the load rises and falls against the walker instead of hammering the shoulder, the baskets are matched so nothing has to be held, and a trade is set down, sold from and picked up again in seconds. Two handcarts and two bicycles run beside the carriers here.\n\nThis stop keeps its old id and has a new subject. The mass of motorbikes Hanoi is known for now belongs to a much later Vietnam and sat outside the 1900–1931 band, so the object was recast at Stage A as street carriers on the evidence of the 1931 photograph.",
    match: () => false,
  },
  {
    id: "stilts", world: "southeast-asia", kind: "landmark", name: "Stilt houses", zh: "Nhà sàn", emoji: "🏚️",
    area: "mekong", pos: [-1.4, 3.3], rot: -0.15, elevation: 0, prop: "stiltHomesVn",
    tagline: "A timber floor above damp ground, and a ladder to the water.",
    blurb: "The Mekong rises and falls with the monsoon, so the delta builds up off the ground. Vietnam's tourism board records stilt houses, sampans and household work along the small channels around Cái Bè and Châu Đốc as everyday life rather than spectacle: a timber floor on posts, an open-sided cooking shelter, steps down to a tied boat.\n\nWhat that means for the cooking is that the kitchen is half outdoors. The hearth stands where the smoke can leave, the water is a few steps away, herbs and banana grow at the edge of the dry ground, and the fish is landed below the floor it is cooked on.\n\nBoats here are transport and not shops. The floating market, with its vendors selling from the gunwale, is Thailand's composition in this world and deliberately not repeated on the Vietnamese side of the table; a sampan at the foot of these steps is tied up, carrying a family and their baskets to the bank and back.",
    match: () => false,
  },
  {
    id: "hueCitadelVn", world: "southeast-asia", kind: "landmark", name: "The Huế gate", zh: "Kinh thành Huế", emoji: "🏯",
    area: "hanoi", pos: [22.9, -11.9], rot: 0.1, elevation: 0, prop: "hueGateVn",
    tagline: "A walled river city, and a gate the kitchens walk out of.",
    blurb: "The Nguyễn dynasty made Huế the capital of a unified Viet Nam in 1802, and it remained the political, cultural and religious centre until 1945. In 1993 UNESCO inscribed the Complex of Huế Monuments, the first Vietnamese property on the World Heritage List, describing the Perfume River winding through the Capital, Imperial, Forbidden Purple and Inner Cities.\n\nWhat the visitor sees from this bank is the grammar rather than the palaces: brick and earth ramparts, a tiled gate with a flag over it, a moat, and a boat working the river below. The city was laid out to be read this way, from the water, and the gardens outside the walls are where the food in this cluster is cooked.\n\nThe connection to the kitchens is a habit rather than a menu. Huế's cooking is known for many small, exactly made dishes and careful seasoning, which is reasonable to attribute to a long-standing capital. It is not evidence that a market bowl of noodles was a court dish.",
    match: () => false,
  },
  {
    id: "hoiAnQuayVn", world: "southeast-asia", kind: "landmark", name: "The Hội An quay", zh: "Bến Hội An", emoji: "⛵",
    area: "hanoi", pos: [30.8, -2.9], rot: -0.1, elevation: 0, prop: "hoiAnQuayVn",
    tagline: "Street at the front, river at the back, and a jar rolled between.",
    blurb: "In 1999 UNESCO inscribed Hội An Ancient Town as an exceptionally well-preserved South-East Asian trading port of the fifteenth to the nineteenth century, recording 1,107 timber-frame buildings with brick or wooden walls, a street grid running parallel and perpendicular to the river, and — named in the inscription — an open market and a ferry quay.\n\nThat street plan is a loading diagram. A shophouse has its counter at the street end and a service door at the river end, so goods come off a boat, cross the threshold, pass down the length of the house and appear at the front for sale. A jar is rolled rather than carried.\n\nThe boat stays tied. Vietnam's side of this world deliberately holds back the floating market, which belongs to Thailand here, so the water at Hội An is a delivery route and not a shop: a hull made fast against the stone, a plank down, a porter on the plank.",
    match: () => false,
  },
  {
    id: "waterPuppetsVn", world: "southeast-asia", kind: "landmark", name: "The water-puppet tank", zh: "Múa rối nước", emoji: "🎭",
    area: "hanoi", pos: [6.5, -8.4], rot: 0.25, elevation: 0, prop: "waterPuppetsVn",
    tagline: "Puppets worked from behind a screen, waist-deep in a pond.",
    blurb: "Múa rối nước is northern, and UNESCO's documentation on puppetry in Viet Nam treats it as emblematic of the country's performing traditions. The stage is a pond or a flooded tank: the puppeteers stand behind a bamboo screen in the water and work carved wooden figures on long submerged rods, so the figures appear to move on the surface by themselves.\n\nIts origins are placed in the villages of the Red River delta, and no first date is given by the source consulted here. The repertoire is village life and legend: planting and harvest, a buffalo, a fishing scene, a dragon, the legend of the returned sword on the lake a few streets away.\n\nIt is here as one small stop and not an attraction. This world's own research note is explicit that water puppetry must not become the area's food story or a theme-park stage, so it stands at the edge of its own shallow tank: a screen, a few figures, a child at the rim.",
    match: () => false,
  },
  {
    id: "benThanhVn", world: "southeast-asia", kind: "landmark", name: "Bến Thành market", zh: "Chợ Bến Thành", emoji: "🕰️",
    area: "mekong", pos: [7.6, 16.1], rot: 0.15, elevation: 0, prop: "benThanhVn",
    tagline: "Opened in March 1914, with a clock over the south gate.",
    blurb: "Bến Thành is the one building in this area with a firm opening date. The old market on the Chợ Vải canal burned down in 1870 and was replaced in mid-1872 by a structure of wood, roof tiles and a granite floor, built by the contractor Albert Mayer.\n\nFour decades later the market was moved and rebuilt on the drained Bồ Rệt marsh, the Marais Boresse, in the middle of the town: construction began in 1912 under the contractor Brossard et Maupin and finished in 1914, on a site of some 13,056 square metres, and the opening was held from 28 to 30 March 1914 with lion dances, circus turns and fireworks. The clock tower over the southern gate has kept its three faces since.\n\nFor the street outside, the market is the supply. A hall of this size fixes where the porters walk, where the carts wait and where a bread counter or a noodle shophouse is worth opening, which is why the Saigon cluster is arranged around it. It is inside the 1900–1931 band by fourteen years.",
    match: () => false,
  },
);
