/**
 * Food World knowledge graph.
 * Regions, world objects (ingredients, flavours, techniques, landmarks) and how recipes attach to them.
 * Recipes come from Notion; this file adds the culinary layer the world is built from.
 */
import type { Recipe } from "../data";

export type Kind = "ingredient" | "flavour" | "technique" | "landmark" | "place" | "dish";
export type WorldId = "china" | "italy";
export type Area = "sichuan" | "jiangnan" | "northern" | "everyday" | "rome" | "venice" | "sicily";

export type EnrichedRecipe = Recipe & {
  zh?: string;
  world: WorldId;
  area: Area;
  spice: 0 | 1 | 2 | 3;
  flavours: string[];
  core: string[];
  techniques: string[];
  /** id of the world object the dish physically lives at */
  place: string;
  weeknight: boolean;
};

export type WorldObject = {
  id: string;
  world: WorldId;
  kind: Kind;
  name: string;
  zh?: string;
  emoji: string;
  tagline: string;
  blurb: string;
  flavour?: string[];
  partners?: string[];
  area: Area;
  pos: [number, number];
  rot?: number;
  prop: string;
  /** what the building is called in the world, when the card is about what's inside it */
  placeName?: string;
  /** dishes may sit at this object */
  place?: boolean;
  /** "reveal": clicking zooms in and shows what's inside (stalls, plates) instead of opening a card */
  open?: "card" | "reveal";
  /** a clickable spot inside a place with no prop of its own */
  hitOnly?: boolean;
  parent?: string;
  /** clicking this spot opens another object's card (the produce stall opens Vegetables) */
  alias?: string;
  match: (r: EnrichedRecipe) => boolean;
};

/** Where the market's stalls stand, in world coordinates (mirrors market() in props.ts). */
const MARKET: [number, number] = [4, -1.2];
function stallPos(i: number): [number, number] {
  const a = -Math.PI * 0.75 + (i * (Math.PI * 1.5)) / 5;
  return [MARKET[0] + Math.cos(a) * 5.6, MARKET[1] + Math.sin(a) * 2.9];
}

export type AreaInfo = { name: string; zh: string; blurb: string; center: [number, number]; world: WorldId };
export const AREAS: Record<Area, AreaInfo> = {
  sichuan: { world: "china", name: "Sichuan", zh: "四川", blurb: "chilli, numbing pepper and the fiercest woks", center: [-14, 4] },
  jiangnan: { world: "china", name: "Jiangnan", zh: "江南", blurb: "water towns: gentle, sweet, slow-braised", center: [18, 6] },
  northern: { world: "china", name: "Northern China", zh: "北方", blurb: "wheat country: dumplings, rolls and griddles", center: [4, -15] },
  everyday: { world: "china", name: "Everyday table", zh: "家常菜", blurb: "home cooking that belongs to no province", center: [2, 4] },
  rome: { world: "italy", name: "Rome", zh: "Roma", blurb: "trattorie, pasta, the piazza and the pizza oven", center: [-12, 0] },
  venice: { world: "italy", name: "Venice", zh: "Venezia", blurb: "canals, gondolas, seafood and risotto", center: [16, -8] },
  sicily: { world: "italy", name: "Sicily", zh: "Sicilia", blurb: "Etna, lemons, tomatoes and street food", center: [12, 14] },
};
export const WORLDS: Record<WorldId, { name: string; zh: string; regionId: string }> = {
  china: { name: "China", zh: "中国", regionId: "china" },
  italy: { name: "Italy", zh: "Italia", regionId: "italy" },
};
export const areasOf = (world: WorldId) => (Object.keys(AREAS) as Area[]).filter((a) => AREAS[a].world === world);

// ---------- recipe enrichment (title → culinary facts) ----------

type Enrichment = Partial<Pick<EnrichedRecipe, "zh" | "world" | "area" | "spice" | "flavours" | "core" | "techniques" | "place">>;

const ENRICH: { test: RegExp; data: Enrichment }[] = [
  { test: /^mapo tofu/i, data: { zh: "麻婆豆腐", area: "sichuan", spice: 3, flavours: ["mala", "savoury", "fermented", "aromatic"], core: ["tofu", "minced pork", "doubanjiang", "Sichuan pepper", "garlic"], techniques: ["wok", "braise"], place: "wok" } },
  { test: /dan dan/i, data: { zh: "担担面", area: "sichuan", spice: 2, flavours: ["nutty", "mala", "savoury"], core: ["wheat noodles", "minced pork", "chilli oil", "Sichuan pepper", "preserved vegetable"], techniques: ["boil", "wok"], place: "noodle" } },
  { test: /cucumber/i, data: { zh: "拍黄瓜", area: "sichuan", spice: 1, flavours: ["garlicky", "tangy", "fresh"], core: ["cucumber", "garlic", "black vinegar", "chilli oil", "sesame"], techniques: ["cold"], place: "prep" } },
  { test: /hong shao|pork belly/i, data: { zh: "红烧肉", area: "jiangnan", spice: 0, flavours: ["sweet-savoury", "caramel", "soy"], core: ["pork belly", "soy sauce", "rock sugar", "ginger", "Shaoxing wine"], techniques: ["red-braise"], place: "claypot" } },
  { test: /onion beef roll/i, data: { zh: "葱香牛肉卷", area: "northern", spice: 0, flavours: ["savoury", "oniony", "crisp"], core: ["beef", "onion", "scallion", "wheat pancake", "soy sauce"], techniques: ["pan-fry", "wok"], place: "griddle" } },
  { test: /dumpling/i, data: { zh: "鸡肉香菜煎饺", area: "northern", spice: 0, flavours: ["juicy", "herby", "crisp-bottomed"], core: ["chicken", "cilantro", "dumpling wrappers", "egg", "ginger"], techniques: ["pan-fry", "wheat dough"], place: "dumpling" } },
  { test: /shiitake|minced pork rice/i, data: { zh: "香菇土豆肉沫拌饭", area: "everyday", spice: 0, flavours: ["umami", "comforting", "savoury"], core: ["shiitake", "potato", "minced pork", "rice", "soy sauce"], techniques: ["wok", "braise"], place: "wok" } },
  { test: /bolognese mapo/i, data: { zh: "麻婆肉酱意面", area: "sichuan", spice: 2, flavours: ["mala", "fusion", "savoury"], core: ["tofu", "beef", "doubanjiang", "pasta"], techniques: ["wok", "braise"], place: "wok" } },
  // ---- Italy ----
  { test: /^bolognese$/i, data: { zh: "Ragù alla bolognese", world: "italy", area: "rome", spice: 0, flavours: ["rich", "savoury", "slow-cooked"], core: ["beef", "pork", "tomato", "soffritto", "parmesan", "pasta"], techniques: ["ragu"], place: "trattoria" } },
  { test: /lasagna/i, data: { zh: "Lasagne", world: "italy", area: "rome", spice: 0, flavours: ["rich", "cheesy", "baked"], core: ["pasta sheets", "ragù", "béchamel", "parmesan", "mozzarella"], techniques: ["ragu", "oven"], place: "trattoria" } },
  { test: /meatballs/i, data: { zh: "Polpette", world: "italy", area: "rome", spice: 0, flavours: ["savoury", "herby"], core: ["beef", "breadcrumbs", "parmesan", "garlic", "parsley"], techniques: ["oven"], place: "trattoria" } },
  { test: /homemade pizza/i, data: { zh: "Pizza", world: "italy", area: "rome", spice: 0, flavours: ["smoky", "cheesy", "tomato"], core: ["pizza dough", "tomato", "mozzarella", "basil", "olive oil"], techniques: ["oven", "dough"], place: "pizzeria" } },
  { test: /creamy mushroom pasta/i, data: { zh: "Pasta ai funghi", world: "italy", area: "rome", spice: 0, flavours: ["creamy", "earthy"], core: ["pasta", "mushrooms", "cream", "parmesan", "garlic"], techniques: ["pasta"], place: "trattoria" } },
  { test: /chicken pesto pasta/i, data: { zh: "Pasta al pesto", world: "italy", area: "rome", spice: 0, flavours: ["herby", "creamy", "garlicky"], core: ["pasta", "chicken", "basil pesto", "parmesan", "cream"], techniques: ["pasta"], place: "trattoria" } },
  { test: /chicken parmesan pasta/i, data: { zh: "Pasta alla parmigiana", world: "italy", area: "rome", spice: 0, flavours: ["tomato", "cheesy"], core: ["pasta", "chicken", "tomato", "mozzarella", "parmesan"], techniques: ["pasta", "oven"], place: "trattoria" } },
  { test: /chicken parmesan stuffed peppers/i, data: { zh: "Peperoni ripieni", world: "italy", area: "sicily", spice: 0, flavours: ["tomato", "cheesy", "baked"], core: ["bell peppers", "chicken", "tomato", "mozzarella", "parmesan"], techniques: ["oven"], place: "sicilyMarket" } },
  { test: /caprese/i, data: { zh: "Insalata caprese", world: "italy", area: "rome", spice: 0, flavours: ["fresh", "milky", "tomato"], core: ["tomato", "mozzarella", "basil", "olive oil"], techniques: ["raw"], place: "romeMarket" } },
  { test: /italian chopped salad/i, data: { zh: "Insalata", world: "italy", area: "rome", spice: 0, flavours: ["fresh", "tangy", "salty"], core: ["lettuce", "chickpeas", "salami", "provolone", "tomato", "vinaigrette"], techniques: ["raw"], place: "romeMarket" } },
  { test: /tomato soup/i, data: { zh: "Zuppa di pomodoro", world: "italy", area: "sicily", spice: 0, flavours: ["tomato", "sweet", "comforting"], core: ["tomato", "onion", "garlic", "olive oil", "basil"], techniques: ["pot"], place: "sicilyMarket" } },
];

export function enrich(r: Recipe): EnrichedRecipe {
  const hit = ENRICH.find((e) => e.test.test(r.title))?.data ?? {};
  const spicy = r.tags.some((t) => /spicy/.test(t));
  return {
    ...r,
    zh: hit.zh,
    world: hit.world ?? (r.cuisine === "Italian" ? "italy" : "china"),
    area: hit.area ?? (r.cuisine === "Italian" ? "rome" : "everyday"),
    spice: hit.spice ?? (spicy ? 2 : 0),
    flavours: hit.flavours ?? [],
    core: hit.core ?? [...r.protein, ...r.mainIngredient.map((m) => m.toLowerCase())],
    techniques: hit.techniques ?? (r.method === "Pan" ? ["wok"] : r.method === "Pot" ? ["braise"] : []),
    place: hit.place ?? (r.cuisine === "Italian" ? "trattoria" : "wok"),
    weeknight: (r.totalMin !== null && r.totalMin <= 40) || r.tags.includes("busy_day") || r.tags.includes("quick"),
  };
}

/** Which recipes belong in which world. */
export function isChinaRecipe(r: Recipe): boolean {
  return r.cuisine === "Chinese" || /mapo|sichuan|szechuan|hong shao/i.test(r.title);
}
export function isItalyRecipe(r: Recipe): boolean {
  return r.cuisine === "Italian" || /italian|caprese|bolognese|lasagn|pizza|pesto|risotto/i.test(r.title);
}
export const worldRecipes = (world: WorldId, all: Recipe[]) => all.filter(world === "china" ? isChinaRecipe : isItalyRecipe);

const has = (list: string[], re: RegExp) => list.some((x) => re.test(x));

// ---------- the China world ----------

export const OBJECTS: WorldObject[] = [
  // --- Sichuan valley: ingredients ---
  { id: "cow", world: "china", kind: "ingredient", name: "Beef", zh: "牛肉", emoji: "🐄", area: "sichuan", pos: [-27, 15.5], prop: "cow", rot: 0.6,
    tagline: "Sliced thin and cooked fast.", blurb: "For most of Chinese history cattle were working animals, and killing them for meat was often forbidden, so beef stayed rarer than pork. Sichuan is the exception: the salt wells of Zigong worked thousands of buffalo, and worn-out animals fed the salt workers, which is where dishes like shui zhu beef and dry-fried beef come from. Beef here is sliced thin and cooked fast, poached in chilli broth or stir-fried with cumin and dried chillies.",
    partners: ["chilli", "Sichuan pepper", "celery", "garlic", "cumin"], match: (r) => has(r.protein, /beef/) },
  { id: "pig", world: "china", kind: "ingredient", name: "Pork", zh: "猪肉", emoji: "🐖", area: "sichuan", pos: [-18.5, 17], prop: "pig", rot: -1.2,
    tagline: "The most common meat in Chinese home cooking.", blurb: "Pigs were domesticated in China some 8,000 years ago, and the character for home, 家, is a roof with a pig under it. Pork has been the default meat ever since. Sichuan's twice-cooked pork started as an offering: a piece of pork boiled for the ancestors, then sliced and stir-fried with doubanjiang so nothing went to waste. Today pork is minced for sauces and fillings, sliced for stir-fries, or belly braised in soy and sugar.",
    partners: ["doubanjiang", "soy sauce", "ginger", "garlic", "tofu"], match: (r) => has(r.protein, /pork/) },
  { id: "chicken", world: "china", kind: "ingredient", name: "Chicken", zh: "鸡肉", emoji: "🐓", area: "sichuan", pos: [-11, 16], prop: "chicken",
    tagline: "Poached, fried, or minced for dumplings.", blurb: "Chickens have scratched around Chinese courtyards for thousands of years, kept for eggs and eaten on festival days. Sichuan's most famous chicken dish, gong bao chicken, is named after Ding Baozhen, a Qing dynasty (1644–1912) governor whose cook fried diced chicken with peanuts and dried chillies. Here chicken is poached and served cold with a chilli dressing, dry-fried with chillies, or minced with herbs for dumplings.",
    partners: ["cilantro", "ginger", "chilli", "scallion"], match: (r) => has(r.protein, /chicken/) },
  { id: "tofu", world: "china", kind: "ingredient", name: "Soybean & tofu", zh: "豆腐坊", emoji: "🫘", area: "sichuan", pos: [-25, -5], prop: "tofuWorkshop", rot: 0.4, place: true,
    tagline: "Soy milk set and pressed into blocks.", blurb: "By tradition tofu was discovered by Prince Liu An in the second century BC; the first reliable records are from the Song dynasty (960–1279) a thousand years later. Mapo tofu was created in Chengdu in the 1860s at a small restaurant run by a pockmarked woman, Chen Mapo, who fed soft tofu, beef and doubanjiang to porters passing through. Soft tofu still goes into mapo tofu; firmer blocks are braised or stir-fried, and the beans are fermented into doubanjiang and black beans.",
    partners: ["doubanjiang", "chilli oil", "Sichuan pepper", "minced pork"], match: (r) => has(r.protein, /tofu/) || has(r.core, /tofu|soy/) },
  { id: "veg", world: "china", kind: "ingredient", name: "Vegetables", zh: "蔬菜", emoji: "🥬", area: "sichuan", pos: [-7, 15], prop: "vegPlot",
    tagline: "Cucumber, celery, greens: whatever is in season.", blurb: "The Sichuan basin has been irrigated since the Dujiangyan waterworks were built in 256 BC, which is why it earned the name 天府之国, the land of abundance. Vegetables grow year-round, and every household keeps a pickling jar of paocai going for the surplus. Cucumber, celery and greens are smashed with garlic, quick-fried with chilli, or pickled.",
    partners: ["garlic", "black vinegar", "chilli oil", "sesame"], match: (r) => has(r.core, /cucumber|celery|greens|cabbage|potato|carrot/) || has(r.mainIngredient, /Vegetables/) },
  { id: "mushroom", world: "china", kind: "ingredient", name: "Shiitake", zh: "香菇", emoji: "🍄", area: "everyday", pos: [9, 13], prop: "mushroomLogs", rot: 0.5,
    tagline: "Grown on oak logs in the shade.", blurb: "Shiitake have been farmed in China for over 800 years, since Song dynasty (960–1279) growers in the Zhejiang hills learned to notch oak logs so the fungus would fruit. Dried shiitake became a trade good because they keep for years and their flavour deepens as they dry. Fresh or dried, they give minced-pork sauces and braises their savoury depth.",
    partners: ["minced pork", "soy sauce", "potato", "rice"], match: (r) => has(r.core, /shiitake|mushroom/) || has(r.mainIngredient, /Mushroom/) },
  { id: "rice", world: "china", kind: "ingredient", name: "Rice", zh: "米", emoji: "🍚", area: "jiangnan", pos: [25, 15], prop: "ricePaddy",
    tagline: "Steamed, and eaten with everything.", blurb: "Rice was domesticated along the Yangtze about 9,000 years ago, and the river's lower reaches are still called 鱼米之乡, the land of fish and rice. Jiangnan's paddies flood every spring and carry two harvests a year. Steamed rice is the base under braises, sauces and topped bowls.",
    partners: ["soy sauce", "minced pork", "shiitake", "braised pork"], match: (r) => has(r.core, /\brice\b/) },
  { id: "wheat", world: "china", kind: "ingredient", name: "Noodles, wrappers & buns", zh: "面食", emoji: "🥟", area: "northern", pos: [-9, -19], prop: "wheatField",
    tagline: "Everything the north makes from wheat flour.", blurb: "Wheat arrived from western Asia around 4,500 years ago; northerners had eaten millet before that. Once stone mills spread in the Han dynasty (206 BC–220 AD), flour became hand-pulled and knife-cut noodles, steamed buns, thin griddle pancakes and the wrappers folded around dumpling fillings, and the north has eaten wheat the way the south eats rice ever since. By tradition dumplings go back to Zhang Zhongjing, a Han dynasty physician, who folded medicine into dough to warm his patients' ears in winter.",
    partners: ["scallion", "pork", "chicken", "sesame"], match: (r) => has(r.core, /noodle|dumpling|pancake|wrapper|dough|bun|pasta/) || has(r.mainIngredient, /Dough|Pasta|Bread/) },

  // --- flavours ---
  { id: "chilli", world: "china", kind: "flavour", name: "Chilli", zh: "辣椒", emoji: "🌶️", area: "sichuan", pos: [-26, 1.5], prop: "chilliField", rot: 0.15,
    tagline: "Fresh, dried, pickled, ground, or steeped into red oil.", blurb: "Chillies only reached China in the late 1500s, carried from the Americas by traders, and took another two centuries to become everyday food in Sichuan. The basin is humid and overcast most of the year, and people here believe that chilli heat drives out the damp. Sichuan cooks already loved pungent food, seasoning with Sichuan pepper and ginger, so the new plant slotted straight in. Today dried chillies are toasted in oil for fragrance, chilli oil dresses noodles and cold dishes, and pickled chillies go into fish-fragrant sauces, almost always alongside Sichuan pepper.",
    flavour: ["hot", "fruity", "smoky"], partners: ["Sichuan pepper", "garlic", "doubanjiang", "sesame"], match: (r) => r.spice >= 1 },
  { id: "pepper", world: "china", kind: "flavour", name: "Sichuan pepper", zh: "花椒", emoji: "🌳", area: "sichuan", pos: [-19, 1], prop: "pepperTree",
    tagline: "The tingle behind Sichuan food.", blurb: "Sichuan pepper is native to China and one of its oldest spices, used since at least the Zhou dynasty (1046–256 BC), long before chillies arrived. Han emperors (206 BC–220 AD) had their empresses' rooms plastered with pepper paste for warmth and fragrance, the 椒房, or pepper chambers. It is the dried husk of the prickly-ash berry: citrusy and numbing rather than hot. With chilli it makes málà, the numbing-hot combination Sichuan is known for.",
    flavour: ["citrusy", "fragrant", "numbing"], partners: ["chilli", "garlic", "ginger", "sesame oil"], match: (r) => has(r.flavours, /mala/) || has(r.core, /sichuan pepper/i) },
  { id: "jars", world: "china", kind: "flavour", name: "Doubanjiang", zh: "豆瓣酱", emoji: "🏺", area: "sichuan", pos: [-20, -8], prop: "jars", rot: -0.3,
    tagline: "Fermented broad-bean and chilli paste.", blurb: "Doubanjiang comes from Pixian outside Chengdu, where by tradition a Fujian migrant named Chen salvaged his mouldy broad beans with chillies in the late 1600s. The beans and chillies ferment in open clay jars for a year or more, stirred by hand and uncovered on sunny days, until they turn deep red. It is the base of mapo tofu and twice-cooked pork. The smaller jars hold pickled mustard greens and fermented black beans.",
    flavour: ["salty", "deep", "umami"], partners: ["pork", "tofu", "chilli", "garlic"], match: (r) => has(r.core, /doubanjiang|preserved|pickled|black bean/) },
  { id: "aromatics", world: "china", kind: "place", name: "Village market", zh: "菜市场", emoji: "🧺", area: "everyday", pos: MARKET, prop: "market", rot: 0, place: true, open: "reveal",
    tagline: "Everything the village cooks with, on seven stalls.", blurb: "Produce, a butcher, steamers, fish on ice, spices, tofu, and the garlic, ginger and scallion that start most dishes.",
    match: () => false },
  // stalls inside the market
  { id: "garlic", world: "china", kind: "ingredient", name: "Garlic, ginger & scallion", zh: "蒜姜葱", emoji: "🧄", area: "everyday", pos: [MARKET[0] - 7.6, MARKET[1]], prop: "none", hitOnly: true, parent: "aromatics",
    tagline: "The three that start almost every dish.", blurb: "Ginger is native to southern China and Confucius is said never to have eaten a meal without it. Garlic came along the Silk Road in the Han dynasty (206 BC–220 AD); scallions were already here. Smashed garlic, sliced ginger and scallion hit the hot oil first, and the whole kitchen knows what is coming.",
    flavour: ["pungent", "warm", "fresh"], partners: ["soy sauce", "chilli", "vinegar", "sesame oil"], match: (r) => has(r.core, /garlic|ginger|scallion|onion|cilantro/) },
  { id: "spices", world: "china", kind: "flavour", name: "Spices", zh: "香料", emoji: "🫚", area: "everyday", pos: stallPos(4), prop: "none", hitOnly: true, parent: "aromatics",
    tagline: "Star anise, cassia, fennel, cumin and white pepper.", blurb: "Whole spices go into braising liquids and hotpot broths and come out again; ground five-spice seasons roasts. Cumin came west along the Silk Road and is the signature of Xinjiang and Sichuan grilled meats.",
    flavour: ["warm", "sweet-woody", "aromatic"], partners: ["soy sauce", "rock sugar", "chilli", "beef"], match: (r) => has(r.core, /cumin|star anise|five.spice|cinnamon|cassia|fennel|white pepper|sichuan pepper/i) && !has(r.core, /sichuan pepper/i) },
  { id: "fish", world: "china", kind: "ingredient", name: "Fish & seafood", zh: "鱼虾", emoji: "🐟", area: "jiangnan", pos: stallPos(3), prop: "none", hitOnly: true, parent: "aromatics",
    tagline: "River fish, sold live or on ice.", blurb: "Jiangnan is the land of fish and rice: carp, bream and crucian carp from the canals, steamed whole with ginger and scallion or braised in soy. Sichuan boils fish in chilli oil and pickled-mustard broth.",
    partners: ["ginger", "scallion", "soy sauce", "pickled mustard greens"], match: (r) => has(r.protein, /fish|prawn|shrimp|seafood/) },
  { id: "stall-produce", world: "china", kind: "ingredient", name: "Vegetables", zh: "蔬菜", emoji: "🥬", area: "everyday", pos: stallPos(0), prop: "none", hitOnly: true, parent: "aromatics", alias: "veg", tagline: "", blurb: "", match: () => false },
  { id: "stall-butcher", world: "china", kind: "ingredient", name: "Pork & duck", zh: "猪肉", emoji: "🐖", area: "everyday", pos: stallPos(1), prop: "none", hitOnly: true, parent: "aromatics", alias: "pig", tagline: "", blurb: "", match: () => false },
  { id: "stall-steamers", world: "china", kind: "ingredient", name: "Noodles, wrappers & buns", zh: "面食", emoji: "🌾", area: "northern", pos: stallPos(2), prop: "none", hitOnly: true, parent: "aromatics", alias: "wheat", tagline: "", blurb: "", match: () => false },
  { id: "stall-tofu", world: "china", kind: "ingredient", name: "Tofu", zh: "豆腐", emoji: "🫘", area: "everyday", pos: stallPos(5), prop: "none", hitOnly: true, parent: "aromatics", alias: "tofu", tagline: "", blurb: "", match: () => false },

  // --- techniques ---
  { id: "wok", world: "china", kind: "technique", name: "Stir-frying", zh: "炒", emoji: "🔥", area: "sichuan", pos: [-14, -4], prop: "wokKitchen", rot: 0.5, place: true,
    tagline: "High heat, a few minutes.", blurb: "Stir-frying spread in the Song and Ming dynasties (960–1644) as iron woks became cheap and firewood became scarce around the cities: a hot pan cooks a dish in minutes on very little fuel. Aromatics go in first, then meat, then sauce. When the heat drops the same wok braises mapo tofu.",
    partners: ["garlic", "chilli", "doubanjiang"], match: (r) => has(r.techniques, /wok/) },
  { id: "claypot", world: "china", kind: "technique", name: "Red-braising", zh: "红烧", emoji: "🫕", area: "jiangnan", pos: [24, -3], prop: "clayPotKitchen", rot: -0.6, place: true,
    tagline: "Soy sauce, sugar and time.", blurb: "Soy sauce has been brewed in China since the Han dynasty (206 BC–220 AD), and slow braising in it is how Jiangnan cooks handled pork belly for centuries. Meat simmers in soy sauce, rock sugar and rice wine until it turns glossy and the sauce clings; the red colour gives the technique its name.",
    partners: ["pork belly", "soy sauce", "rock sugar", "ginger"], match: (r) => has(r.techniques, /red-braise|braise/) },
  { id: "griddle", world: "china", kind: "technique", name: "Pan-frying", zh: "煎", emoji: "🥘", area: "northern", pos: [15, -12], prop: "griddleStall", rot: 0.3, place: true,
    tagline: "Crisp underneath, soft on top.", blurb: "Pan-fried dumplings are yesterday's boiled dumplings given a second life on a flat iron griddle, crisp underneath and soft on top. Northern street stalls have sold rolls and pancakes this way since at least the Qing dynasty (1644–1912).",
    partners: ["scallion", "wheat dough", "sesame"], match: (r) => has(r.techniques, /pan-fry/) },
  { id: "prep", world: "china", kind: "technique", name: "Cold dressing", zh: "凉拌", emoji: "🔪", area: "sichuan", pos: [-7.5, 4], prop: "prepTable", rot: -0.4, place: true,
    tagline: "Dishes that are dressed, not cooked.", blurb: "Liángbàn, dressing raw or blanched ingredients with garlic, vinegar, soy sauce, sesame and chilli oil. Cold dishes open a Sichuan meal and cover the table while the wok is still heating. Cucumbers are smashed with the flat of the cleaver rather than sliced, so the dressing soaks into the cracks.",
    partners: ["garlic", "black vinegar", "chilli oil"], match: (r) => has(r.techniques, /cold/) },

  // --- dish landmarks ---
  { id: "noodle", world: "china", kind: "ingredient", name: "Noodles", placeName: "Noodle shop", zh: "面", emoji: "🍜", area: "sichuan", pos: [-9, -10], prop: "noodleStall", rot: 0.9, place: true,
    tagline: "Dressed with chilli oil, sesame and pork.", blurb: "Dan dan noodles take their name from the shoulder pole, 担, that Chengdu hawkers carried through the streets in the 1840s with a stove on one end and bowls on the other. Sichuan noodles are sauced rather than souped: the sauce sits at the bottom of the bowl and you mix it in yourself.",
    match: (r) => has(r.core, /noodle/) },
  { id: "dumpling", world: "china", kind: "dish", name: "Dumplings", placeName: "Dumpling stall", zh: "饺子", emoji: "🥟", area: "northern", pos: [9, -12], prop: "dumplingStall", rot: -0.2, place: true,
    tagline: "Pleated by hand, dozens at a time.", blurb: "Dumplings are a family production line: one person rolls, one fills, one pleats. In the north they are the New Year's Eve meal, shaped like the silver ingots of old money. Boiled for dinner, pan-fried the next morning.",
    match: (r) => has(r.core, /dumpling|wrapper/) },
  { id: "hotpot", world: "china", kind: "dish", name: "Hotpot", placeName: "Hotpot house", zh: "火锅", emoji: "🫕", area: "sichuan", pos: [-2, -11.5], prop: "hotpot", rot: 0.6, place: true,
    tagline: "A shared pot: fiery in Sichuan, clear and mutton-based in the north.", blurb: "Sichuan hotpot began with Chongqing dock workers in the late Qing dynasty (1800s), who boiled cheap offal in a fiercely spiced broth of chilli, Sichuan pepper and beef tallow to get through damp winters on the river. The north has its own, older version: Beijing-style instant-boiled mutton, thin slices swished for seconds in a plain broth kept boiling by a charcoal chimney in the middle of a copper pot, then dipped in sesame paste. Same idea, opposite temperament: the south flavours the broth, the north flavours the dip. Everyone cooks their own ingredients at the table.",
    match: (r) => has(r.core, /hotpot|hot pot/) },
  { id: "teahouse", world: "china", kind: "ingredient", name: "Tea", placeName: "Tea house", zh: "茶", emoji: "🍵", area: "sichuan", pos: [-25.5, -11.5], prop: "teahouse", rot: -0.15, place: true,
    tagline: "Tea between meals.", blurb: "Chengdu has had teahouses since the Tang dynasty (618–907) and still has more of them than any other Chinese city. Bamboo chairs, a copper kettle on the brazier, and lid-cups of jasmine or green tea refilled all afternoon.",
    match: (r) => has(r.core, /\btea\b|jasmine|oolong/) },
];

// ---------- the Italy world ----------

const RMKT: [number, number] = [-14, 4];
export const ITALY_OBJECTS: WorldObject[] = [
  // --- ingredients ---
  { id: "tomato", world: "italy", kind: "ingredient", name: "Tomatoes", zh: "Pomodori", emoji: "🍅", area: "sicily", pos: [-10, 14.5], prop: "tomatoField", rot: 0.2,
    tagline: "The fruit Italy waited two hundred years to trust.", blurb: "Tomatoes came from the Americas in the 1500s and were grown as ornamentals for two centuries; Italians only started cooking them around 1700, first in Naples. Sicily and Campania grow the sweet plum tomatoes for sauce, sun-dried on rooftops or bottled as passata every August. Raw with mozzarella, simmered into sugo, or roasted into soup.",
    partners: ["basil", "olive oil", "garlic", "mozzarella"], match: (r) => has(r.core, /tomato/) },
  { id: "pasta", world: "italy", kind: "ingredient", name: "Pasta", zh: "Pasta", emoji: "🍝", area: "rome", pos: [-22, -6], prop: "pastaWorkshop", rot: 0.4, place: true,
    tagline: "Durum wheat, water, and a nonna's rolling pin.", blurb: "Dried pasta was made in Sicily under the Arabs by the 1100s, long before Marco Polo, and Naples industrialised it in the 1800s. Fresh egg pasta is the north's tradition: sheets rolled thin for lasagne and tagliatelle. Pasta is always cooked al dente and finished in its sauce, never drowned in it.",
    partners: ["parmesan", "tomato", "olive oil", "ragù"], match: (r) => has(r.core, /pasta|lasagn/) },
  { id: "olive", world: "italy", kind: "ingredient", name: "Olive oil", zh: "Olio d'oliva", emoji: "🫒", area: "rome", pos: [-2.5, 13], prop: "oliveGrove", rot: 0.1,
    tagline: "The fat Italy cooks with.", blurb: "Olives have been pressed in Italy since the Greeks planted them in the south around 700 BC. Trees live for centuries; some in Puglia and Sicily are over a thousand years old. Extra-virgin oil is used raw over salads and bread and as the base of almost every sauce, where garlic goes in first.",
    flavour: ["grassy", "peppery", "fruity"], partners: ["garlic", "tomato", "basil", "bread"], match: (r) => has(r.core, /olive oil|vinaigrette/) },
  { id: "cheese", world: "italy", kind: "ingredient", name: "Cheese", zh: "Formaggio", emoji: "🧀", area: "rome", pos: [-33, -7], prop: "dairy", rot: -0.3,
    tagline: "Parmesan for the pan, mozzarella for the oven.", blurb: "Parmigiano-Reggiano has been made the same way around Parma since the 1200s: wheels aged at least a year, grated over pasta or stirred into ragù. Mozzarella is the opposite, made and eaten within a day, from buffalo milk in Campania or cow's milk elsewhere. Pecorino, salty sheep's cheese, is Rome's own.",
    partners: ["pasta", "tomato", "basil", "cream"], match: (r) => has(r.core, /parmesan|mozzarella|provolone|cheese|pecorino/) || has(r.protein, /cheese/) },
  { id: "basil", world: "italy", kind: "flavour", name: "Basil & herbs", zh: "Basilico", emoji: "🌿", area: "rome", pos: [-13, 9.5], prop: "herbGarden", rot: 0.2,
    tagline: "Torn, never chopped, added last.", blurb: "Basil arrived from India by way of the ancient trade routes and became Liguria's signature, pounded with pine nuts and pecorino into pesto. Oregano and rosemary grow wild across the south. Italian cooking uses one or two herbs at a time, added at the end so they stay bright.",
    flavour: ["sweet", "peppery", "fresh"], partners: ["tomato", "olive oil", "garlic", "pine nuts"], match: (r) => has(r.core, /basil|pesto|parsley|herb|oregano/) },
  { id: "italyBeef", world: "italy", kind: "ingredient", name: "Beef & pork", zh: "Carne", emoji: "🐄", area: "rome", pos: [-20, 12], prop: "cow", rot: 0.5,
    tagline: "Minced and simmered for hours.", blurb: "Emilia's ragù is the reason: beef and pork minced together and simmered with soffritto, wine and milk for half a day. The same mince makes polpette. Pork also goes into prosciutto, cured for two years in Parma's dry hill air, and the guanciale that Rome's carbonara depends on.",
    partners: ["tomato", "soffritto", "red wine", "parmesan"], match: (r) => has(r.protein, /beef|pork/) || has(r.core, /salami|beef|pork/) },
  { id: "italyChicken", world: "italy", kind: "ingredient", name: "Chicken", zh: "Pollo", emoji: "🐓", area: "rome", pos: [-18, 14], prop: "chicken",
    tagline: "Roasted with lemon and rosemary, or breaded and baked.", blurb: "Italian chicken is simple: pollo arrosto with rosemary and garlic, or chicken alla parmigiana, the breaded-and-baked dish that Italian emigrants made famous in America. Most of the family's pasta-and-chicken dinners come from that second tradition.",
    partners: ["lemon", "rosemary", "tomato", "mozzarella"], match: (r) => has(r.protein, /chicken/) },
  { id: "mushrooms", world: "italy", kind: "ingredient", name: "Mushrooms", zh: "Funghi", emoji: "🍄", area: "rome", pos: [-28, 2], prop: "porciniWood", rot: 0.3,
    tagline: "Porcini from the chestnut woods.", blurb: "Autumn in the Apennines means porcini, foraged under chestnut and oak and sold fresh at market or dried for the year. Dried porcini give a cream sauce its depth; fresh ones are sliced thin over pasta.",
    partners: ["cream", "garlic", "parmesan", "parsley"], match: (r) => has(r.core, /mushroom|porcini/) || has(r.mainIngredient, /Mushroom/) },
  { id: "lemon", world: "italy", kind: "ingredient", name: "Lemons & citrus", zh: "Limoni", emoji: "🍋", area: "sicily", pos: [23, 18], prop: "citrusGrove", rot: -0.2,
    tagline: "Sicily's gold.", blurb: "The Arabs planted citrus in Sicily in the 900s and built the irrigation that still waters the groves around Palermo and Catania. Lemons go over fish and into granita; blood oranges, the island's own, into winter salads. No recipe in the cookbook uses them yet.",
    partners: ["fish", "olive oil", "sugar", "almonds"], match: (r) => has(r.core, /lemon|orange|citrus/) },
  { id: "seafood", world: "italy", kind: "ingredient", name: "Fish & seafood", zh: "Pesce", emoji: "🦐", area: "venice", pos: [22, -4], prop: "fishMarket", rot: 0.3, place: true,
    tagline: "The lagoon's catch, sold at dawn by the Rialto.", blurb: "Venice's fish market has stood by the Rialto bridge for a thousand years. Sardines marinated in onion and vinegar, cuttlefish cooked in their own ink over polenta, clams tossed with spaghetti. Sicily's tuna and swordfish come from the other end of the country.",
    partners: ["garlic", "white wine", "parsley", "lemon"], match: (r) => has(r.protein, /fish|prawn|shrimp|seafood|clam/) },
  { id: "rice", world: "italy", kind: "ingredient", name: "Rice", zh: "Riso", emoji: "🍚", area: "venice", pos: [2, -24], prop: "riceFieldItaly", rot: 0.1,
    tagline: "Risotto country.", blurb: "The Po valley has grown short-grain rice since the 1400s, in flooded fields around Vercelli and Pavia. Arborio and carnaroli release their starch slowly, which is what makes a risotto creamy without cream: stock added a ladle at a time, stirred, finished with butter and parmesan.",
    partners: ["stock", "butter", "parmesan", "saffron"], match: (r) => has(r.core, /risotto|\brice\b/) },
  // --- techniques ---
  { id: "oven", world: "italy", kind: "technique", name: "Wood-fired oven", zh: "Forno a legna", emoji: "🔥", area: "rome", pos: [-6, -4], prop: "pizzeria", rot: 0.15, place: true, placeName: "Pizzeria",
    tagline: "Ninety seconds at 450 degrees.", blurb: "Naples' bakers were selling flatbreads with tomato by the 1700s; the Margherita, with its tomato, mozzarella and basil, is dated to 1889. A domed brick oven burning oak or beech bakes a pizza in under two minutes. The same ovens bake lasagne, meatballs and stuffed peppers on a gentler heat.",
    partners: ["pizza dough", "tomato", "mozzarella"], match: (r) => has(r.techniques, /oven/) },
  { id: "ragu", world: "italy", kind: "technique", name: "Slow ragù", zh: "Ragù", emoji: "🍲", area: "rome", pos: [-14, -6], prop: "trattoria", rot: 0.1, place: true, placeName: "Trattoria",
    tagline: "Soffritto, mince, wine, and four hours.", blurb: "A ragù starts with soffritto, onion, carrot and celery softened in oil, then mince browned slowly, wine cooked off, tomato and stock added and the pot left to barely bubble for hours. Bologna's chamber of commerce registered the official recipe in 1982. Trattorie are the family-run restaurants that serve it.",
    partners: ["beef", "pork", "tomato", "pasta"], match: (r) => has(r.techniques, /ragu|pasta/) },
  { id: "dough", world: "italy", kind: "technique", name: "Dough", zh: "Impasto", emoji: "🫓", area: "rome", pos: [-22, -6], prop: "none", hitOnly: true, parent: "pasta",
    tagline: "Flour, water, salt, time.", blurb: "Pizza dough and bread rise slowly, sometimes for a day, which is what gives them their flavour and their blistered crust. Fresh pasta dough is stiffer, just flour and egg, rested and rolled thin.",
    partners: ["flour", "olive oil", "yeast"], match: (r) => has(r.techniques, /dough/) },
  // --- places ---
  { id: "romeMarket", world: "italy", kind: "place", name: "Campo de' Fiori market", zh: "Mercato", emoji: "🧺", area: "rome", pos: RMKT, prop: "italyMarket", rot: 0, place: true, open: "reveal",
    tagline: "Rome's morning market since 1869.", blurb: "Tomatoes, artichokes, cheese, cured meats and flowers on the piazza where the market has run every morning since 1869.", match: () => false },
  { id: "stall-tomato", world: "italy", kind: "ingredient", name: "Tomatoes", zh: "Pomodori", emoji: "🍅", area: "rome", pos: [RMKT[0] - 4.2, RMKT[1] - 2.2], prop: "none", hitOnly: true, parent: "romeMarket", alias: "tomato", tagline: "", blurb: "", match: () => false },
  { id: "stall-cheese", world: "italy", kind: "ingredient", name: "Cheese", zh: "Formaggio", emoji: "🧀", area: "rome", pos: [RMKT[0], RMKT[1] - 2.8], prop: "none", hitOnly: true, parent: "romeMarket", alias: "cheese", tagline: "", blurb: "", match: () => false },
  { id: "stall-salumi", world: "italy", kind: "ingredient", name: "Salumi", zh: "Salumi", emoji: "🥓", area: "rome", pos: [RMKT[0] + 4.2, RMKT[1] - 2.2], prop: "none", hitOnly: true, parent: "romeMarket", alias: "italyBeef", tagline: "", blurb: "", match: () => false },
  { id: "stall-herbs", world: "italy", kind: "flavour", name: "Basil & herbs", zh: "Erbe", emoji: "🌿", area: "rome", pos: [RMKT[0] + 4.2, RMKT[1] + 2.2], prop: "none", hitOnly: true, parent: "romeMarket", alias: "basil", tagline: "", blurb: "", match: () => false },
  { id: "stall-oil", world: "italy", kind: "ingredient", name: "Olive oil", zh: "Olio", emoji: "🫒", area: "rome", pos: [RMKT[0] - 4.2, RMKT[1] + 2.2], prop: "none", hitOnly: true, parent: "romeMarket", alias: "olive", tagline: "", blurb: "", match: () => false },
  { id: "trattoria", world: "italy", kind: "landmark", name: "Pasta dishes", zh: "Primi", emoji: "🍝", area: "rome", pos: [-14, -6], prop: "none", hitOnly: true, parent: "ragu", alias: "ragu", tagline: "", blurb: "", match: () => false },
  { id: "pizzeria", world: "italy", kind: "landmark", name: "Pizza", zh: "Pizza", emoji: "🍕", area: "rome", pos: [-6, -4], prop: "none", hitOnly: true, parent: "oven", alias: "oven", tagline: "", blurb: "", match: () => false },
  { id: "gelateria", world: "italy", kind: "dish", name: "Gelato & coffee", zh: "Gelato", emoji: "🍨", area: "rome", pos: [-4, 2], prop: "gelateria", rot: -0.5, placeName: "Gelateria",
    tagline: "The piazza's other business.", blurb: "Gelato is churned slower and served warmer than ice cream, so it tastes more of what's in it: pistachio, hazelnut, lemon. The espresso bar next door has served Romans standing at the counter since the 1930s.", match: () => false },
  { id: "bacaro", world: "italy", kind: "dish", name: "Cicchetti", zh: "Cicchetti", emoji: "🍷", area: "venice", pos: [21, -10.5], prop: "bacaro", rot: 0.2, placeName: "Bàcaro",
    tagline: "Venice's small plates with a small glass of wine.", blurb: "A bàcaro is a standing wine bar where Venetians eat cicchetti through the day: creamed cod on polenta, fried sardines, a meatball on a toothpick, with an ombra, a small glass of local wine.", match: () => false },
  { id: "sicilyMarket", world: "italy", kind: "place", name: "Ballarò street market", zh: "Mercato di Ballarò", emoji: "🍋", area: "sicily", pos: [13, 12], prop: "sicilyMarket", rot: 0, place: true, open: "reveal",
    tagline: "Palermo's loudest market, a thousand years old.", blurb: "Arancini, panelle, swordfish, capers, tomatoes and the vendors' singing calls, in a market the Arabs founded.", match: () => false },
  { id: "stall-lemon", world: "italy", kind: "ingredient", name: "Lemons & citrus", zh: "Limoni", emoji: "🍋", area: "sicily", pos: [9, 10], prop: "none", hitOnly: true, parent: "sicilyMarket", alias: "lemon", tagline: "", blurb: "", match: () => false },
  { id: "stall-tomato2", world: "italy", kind: "ingredient", name: "Tomatoes", zh: "Pomodori", emoji: "🍅", area: "sicily", pos: [17, 10], prop: "none", hitOnly: true, parent: "sicilyMarket", alias: "tomato", tagline: "", blurb: "", match: () => false },
  { id: "stall-arancini", world: "italy", kind: "dish", name: "Street food", zh: "Cibo di strada", emoji: "🍙", area: "sicily", pos: [13, 8.5], prop: "none", hitOnly: true, parent: "sicilyMarket",
    tagline: "Arancini, panelle and cannoli.", blurb: "Arancini are saffron rice balls stuffed with ragù and fried; the Arabs brought the rice and the saffron. Panelle are chickpea fritters in a bun. Cannoli, ricotta piped into a fried shell, were once a Carnival sweet from the convents near Palermo.", match: () => false },
  { id: "pastry", world: "italy", kind: "dish", name: "Cannoli & pastries", zh: "Pasticceria", emoji: "🥐", area: "sicily", pos: [18, 6], prop: "pasticceria", rot: -0.4, placeName: "Pasticceria",
    tagline: "Ricotta, pistachio and almond.", blurb: "Sicilian pastry grew out of the convents: cannoli, cassata layered with marzipan, and almond paste fruits. Bronte's pistachios, grown on Etna's lava soil, are the island's most expensive crop.", match: () => false },
];

export const ALL_OBJECTS = [...OBJECTS, ...ITALY_OBJECTS];
export const objectsOf = (world: WorldId) => ALL_OBJECTS.filter((o) => o.world === world);
export const objectById = (id: string) => ALL_OBJECTS.find((o) => o.id === id)!;

// ---------- Level 1: the world map ----------

export type MapRegion = {
  id: string;
  name: string;
  cuisines: string[];
  pos: [number, number];
  size: number;
  color: string;
  emoji: string[];
  built: boolean;
  seed: number;
};

export const MAP_REGIONS: MapRegion[] = [
  { id: "north-america", name: "North America", cuisines: ["American"], pos: [-50, -14], size: 9, color: "#d8c27b", emoji: ["🍔", "🥞", "🔥", "🌽"], built: false, seed: 11 },
  { id: "mexico", name: "Mexico", cuisines: ["Mexican"], pos: [-40, 10], size: 6, color: "#e0a06a", emoji: ["🌽", "🌵", "🥑", "🌮"], built: false, seed: 12 },
  { id: "italy", name: "Italy", cuisines: ["Italian"], pos: [-8, -4], size: 6.5, color: "#a8c07a", emoji: ["🍝", "🍅", "🫒", "🧀"], built: true, seed: 13 },
  { id: "central-europe", name: "Central Europe", cuisines: ["British", "Hungarian", "Georgian", "German", "Swiss", "French", "Swedish"], pos: [-12, -26], size: 7, color: "#93b48a", emoji: ["🥧", "🍲", "🥔", "🧈"], built: false, seed: 14 },
  { id: "mediterranean", name: "Mediterranean", cuisines: ["Mediterranean", "Greek", "Spanish", "North African"], pos: [-20, 14], size: 6, color: "#b9cf94", emoji: ["🫒", "🍋", "🐟", "🧆"], built: false, seed: 15 },
  { id: "middle-east", name: "Middle East", cuisines: ["Middle Eastern", "Lebanese", "Turkish"], pos: [10, 8], size: 6, color: "#e2cf9b", emoji: ["🧆", "🍢", "🫓", "🌿"], built: false, seed: 16 },
  { id: "india", name: "India", cuisines: ["Indian"], pos: [22, 20], size: 6, color: "#e0b25e", emoji: ["🍛", "🫚", "🌶️", "🫓"], built: false, seed: 17 },
  { id: "china", name: "China", cuisines: ["Chinese"], pos: [26, -8], size: 10, color: "#c9a26a", emoji: ["🌶️", "🥟", "🍜", "🏮"], built: true, seed: 18 },
  { id: "southeast-asia", name: "Southeast Asia", cuisines: ["Thai", "Vietnamese"], pos: [38, 16], size: 6, color: "#9cc27f", emoji: ["🥥", "🌿", "🍜", "🦐"], built: false, seed: 19 },
  { id: "korea", name: "Korea", cuisines: ["Korean"], pos: [44, -16], size: 4, color: "#d7a7a0", emoji: ["🥬", "🍚", "🔥", "🥢"], built: false, seed: 20 },
  { id: "japan", name: "Japan", cuisines: ["Japanese"], pos: [52, -4], size: 4.5, color: "#e8b8c4", emoji: ["🍣", "🍙", "🍵", "🐟"], built: false, seed: 21 },
];

export const SPICE = ["mild", "a little heat", "spicy", "very spicy"];
