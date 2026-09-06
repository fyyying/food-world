/**
 * Food World knowledge graph.
 * Regions, world objects (ingredients, flavours, techniques, landmarks) and how recipes attach to them.
 * Recipes come from Notion; this file adds the culinary layer the world is built from.
 */
import type { Recipe } from "../data";

export type Kind = "ingredient" | "flavour" | "technique" | "landmark" | "place" | "dish";
export type WorldId = "china" | "italy" | "korea" | "mexico" | "middle-east" | "mediterranean" | "india";
export type Area = "sichuan" | "jiangnan" | "northern" | "everyday" | "rome" | "venice" | "sicily" | "seoul" | "jeonju" | "busan" | "jeju" | "cdmx" | "oaxaca" | "jalisco" | "yucatan" | "istanbul" | "levant" | "arabia" | "persia" | "greece" | "spain" | "morocco" | "dalmatia" | "punjab" | "rajasthan" | "mumbai" | "kerala";

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
  seoul: { world: "korea", name: "Seoul", zh: "서울", blurb: "palace, market alleys, barbecue smoke and kimchi jars", center: [-10, -10] },
  jeonju: { world: "korea", name: "Jeonju", zh: "전주", blurb: "hanok village, rice paddies and the home of bibimbap", center: [-16, 12] },
  busan: { world: "korea", name: "Busan", zh: "부산", blurb: "the port: fish market, beach and boats", center: [10, 6] },
  jeju: { world: "korea", name: "Jeju", zh: "제주", blurb: "volcanic island: tangerines, black pigs and diving women", center: [28, 16] },
  cdmx: { world: "mexico", name: "Mexico City", zh: "CDMX", blurb: "the zócalo, the mercado, taquerías and the canals of Xochimilco", center: [-4, -9] },
  oaxaca: { world: "mexico", name: "Oaxaca", zh: "Oaxaca", blurb: "corn, chillies, mole and the comal", center: [-18, 15] },
  jalisco: { world: "mexico", name: "Jalisco & Michoacán", zh: "El Bajío", blurb: "agave, avocados, ranchos and carnitas", center: [-28, -10] },
  yucatan: { world: "mexico", name: "Yucatán", zh: "Yucatán", blurb: "Maya pyramids, cenotes, cacao and the pib", center: [24, -6] },
  istanbul: { world: "middle-east", name: "Istanbul", zh: "İstanbul", blurb: "the Bosphorus, the bazaar, kebabs and tea", center: [6, -14] },
  levant: { world: "middle-east", name: "The Levant", zh: "بلاد الشام", blurb: "Beirut and Damascus: mezze, bread, herbs and olives", center: [-20, 0] },
  arabia: { world: "middle-east", name: "Arabia", zh: "الجزيرة العربية", blurb: "dunes, dates, coffee and the caravan", center: [-14, 20] },
  persia: { world: "middle-east", name: "Persia", zh: "ایران", blurb: "Isfahan: saffron, pomegranates and rice", center: [24, 8] },
  greece: { world: "mediterranean", name: "Greece", zh: "Ελλάδα", blurb: "islands: tavernas, feta, olives and the Acropolis", center: [25, 4] },
  spain: { world: "mediterranean", name: "Spain", zh: "España", blurb: "the port, the tapas bar, oranges and the Alhambra", center: [-27, -2] },
  morocco: { world: "mediterranean", name: "Morocco", zh: "المغرب", blurb: "the souk, the square, tagines and mint tea", center: [-8, 20] },
  dalmatia: { world: "mediterranean", name: "Dalmatia", zh: "Dalmacija", blurb: "a walled harbour, the konoba, cabbage and lentils", center: [6, -21] },
  punjab: { world: "india", name: "Punjab & Delhi", zh: "पंजाब", blurb: "the tandoor, the dhaba, wheat, dairy and the Golden Temple", center: [-6, -14] },
  rajasthan: { world: "india", name: "Rajasthan", zh: "राजस्थान", blurb: "a hill fort, chillies drying, dal and camels", center: [-24, 5] },
  mumbai: { world: "india", name: "Mumbai", zh: "मुंबई", blurb: "the market, the beach, chaat and dabbawalas", center: [-2, 12] },
  kerala: { world: "india", name: "Kerala", zh: "കേരളം", blurb: "backwaters, spices, coconut, rice and fishing nets", center: [24, 10] },
};
export const WORLDS: Record<WorldId, { name: string; zh: string; regionId: string }> = {
  china: { name: "China", zh: "中国", regionId: "china" },
  italy: { name: "Italy", zh: "Italia", regionId: "italy" },
  korea: { name: "Korea", zh: "한국", regionId: "korea" },
  mexico: { name: "Mexico", zh: "México", regionId: "mexico" },
  "middle-east": { name: "Middle East", zh: "الشرق الأوسط", regionId: "middle-east" },
  mediterranean: { name: "Mediterranean", zh: "Mare Nostrum", regionId: "mediterranean" },
  india: { name: "India", zh: "भारत", regionId: "india" },
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
  // ---- Korea ----
  { test: /bulgogi/i, data: { zh: "불고기", world: "korea", area: "seoul", spice: 0, flavours: ["sweet-savoury", "garlicky", "smoky", "sesame"], core: ["beef", "soy sauce", "pear", "garlic", "scallion", "sesame oil", "lettuce"], techniques: ["grill"], place: "grill" } },
  { test: /bibimbap/i, data: { zh: "비빔밥", world: "korea", area: "jeonju", spice: 1, flavours: ["gochujang", "sesame", "fresh", "savoury"], core: ["rice", "beef", "egg", "namul", "gochujang", "sesame oil", "spinach", "carrot"], techniques: ["dolsot"], place: "dolsot" } },
  // ---- Mexico ----
  { test: /mexican rice/i, data: { zh: "Arroz rojo", world: "mexico", area: "cdmx", spice: 0, flavours: ["tomato", "savoury", "comforting"], core: ["rice", "tomato", "onion", "garlic", "stock"], techniques: ["cazuela"], place: "fonda" } },
  { test: /pico de gallo|fresh salsa/i, data: { zh: "Pico de gallo", world: "mexico", area: "cdmx", spice: 1, flavours: ["fresh", "tangy", "spicy"], core: ["tomato", "onion", "cilantro", "lime", "jalapeño"], techniques: ["molcajete", "raw"], place: "molcajete" } },
  { test: /al pastor/i, data: { zh: "Tacos al pastor", world: "mexico", area: "cdmx", spice: 1, flavours: ["smoky", "sweet", "spicy"], core: ["pork", "achiote", "dried chillies", "pineapple", "corn tortillas", "onion", "cilantro"], techniques: ["trompo"], place: "trompo" } },
  { test: /carnitas/i, data: { zh: "Carnitas", world: "mexico", area: "jalisco", spice: 0, flavours: ["rich", "crisp", "citrus"], core: ["pork", "orange", "garlic", "cumin", "lard", "corn tortillas"], techniques: ["carnitas"], place: "carnitas" } },
  { test: /guacamole/i, data: { zh: "Guacamole", world: "mexico", area: "cdmx", spice: 1, flavours: ["creamy", "fresh", "tangy"], core: ["avocado", "tomato", "cilantro", "lime", "onion"], techniques: ["molcajete"], place: "molcajete" } },
  { test: /chili con carne/i, data: { zh: "Chili con carne", world: "mexico", area: "jalisco", spice: 2, flavours: ["smoky", "hearty", "spicy"], core: ["beef", "beans", "dried chillies", "cumin", "tomato", "onion"], techniques: ["cazuela"], place: "beefMx" } },
  // ---- Middle East ----
  { test: /^hummus/i, data: { zh: "حمص", world: "middle-east", area: "levant", spice: 0, flavours: ["creamy", "nutty", "lemony"], core: ["chickpeas", "tahini", "lemon", "garlic", "olive oil"], techniques: ["mezze"], place: "mezze" } },
  { test: /shawarma/i, data: { zh: "شاورما", world: "middle-east", area: "levant", spice: 1, flavours: ["spiced", "smoky", "tangy"], core: ["chicken", "yogurt", "garlic", "cumin", "coriander", "paprika", "pita"], techniques: ["spit"], place: "spit" } },
  { test: /tabouli|tabbouleh/i, data: { zh: "تبولة", world: "middle-east", area: "levant", spice: 0, flavours: ["herby", "lemony", "fresh"], core: ["parsley", "mint", "bulgur", "tomato", "lemon", "olive oil"], techniques: ["mezze"], place: "mezze" } },
  { test: /chicken kebab/i, data: { zh: "Tavuk şiş", world: "middle-east", area: "istanbul", spice: 1, flavours: ["charred", "yogurt-marinated", "spiced"], core: ["chicken", "yogurt", "garlic", "paprika", "cumin", "lemon"], techniques: ["mangal"], place: "mangal" } },
  { test: /shakshuka/i, data: { zh: "شكشوكة", world: "middle-east", area: "levant", spice: 1, flavours: ["tomato", "spicy", "eggy"], core: ["eggs", "tomato", "peppers", "onion", "cumin", "paprika", "feta"], techniques: ["taboon", "pan"], place: "taboon" } },
  // ---- Mediterranean ----
  { test: /tagine/i, data: { zh: "طاجين", world: "mediterranean", area: "morocco", spice: 1, flavours: ["sweet-spiced", "warm", "slow"], core: ["chickpeas", "vegetables", "ras el hanout", "preserved lemon", "apricots", "couscous"], techniques: ["tagine"], place: "tagine" } },
  { test: /baked salmon/i, data: { zh: "Salmón al horno", world: "mediterranean", area: "spain", spice: 0, flavours: ["briny", "tomato", "herby"], core: ["salmon", "tomato", "olives", "capers", "olive oil", "garlic"], techniques: ["oven"], place: "fishMed" } },
  { test: /greek salad/i, data: { zh: "Χωριάτικη", world: "mediterranean", area: "greece", spice: 0, flavours: ["fresh", "salty", "tangy"], core: ["tomato", "cucumber", "feta", "olives", "red onion", "oregano", "olive oil"], techniques: ["raw"], place: "taverna" } },
  { test: /spanish simmered/i, data: { zh: "Pescado con garbanzos", world: "mediterranean", area: "spain", spice: 0, flavours: ["saffron", "garlicky", "brothy"], core: ["white fish", "chickpeas", "tomato", "garlic", "paprika", "saffron"], techniques: ["plancha", "pot"], place: "plancha" } },
  { test: /kupus/i, data: { zh: "Kupus salata", world: "mediterranean", area: "dalmatia", spice: 0, flavours: ["crunchy", "sour", "peppery"], core: ["cabbage", "vinegar", "oil", "black pepper", "salt"], techniques: ["raw"], place: "konoba" } },
  { test: /everyday salad/i, data: { zh: "Σαλάτα", world: "mediterranean", area: "greece", spice: 0, flavours: ["fresh", "simple"], core: ["lettuce", "tomato", "cucumber", "olive oil", "lemon"], techniques: ["raw"], place: "taverna" } },
  { test: /lentil salad/i, data: { zh: "Salata od leće", world: "mediterranean", area: "dalmatia", spice: 0, flavours: ["earthy", "tangy", "herby"], core: ["lentils", "feta", "tomato", "herbs", "olive oil", "lemon"], techniques: ["raw"], place: "konoba" } },
  { test: /prawns & feta|prawn.*omelette/i, data: { zh: "Ομελέτα", world: "mediterranean", area: "greece", spice: 0, flavours: ["savoury", "briny"], core: ["prawns", "eggs", "feta", "herbs"], techniques: ["pan"], place: "taverna" } },
  { test: /halloumi/i, data: { zh: "Μακαρόνια με χαλούμι", world: "mediterranean", area: "greece", spice: 0, flavours: ["salty", "cheesy"], core: ["pasta", "halloumi", "tomato", "olive oil", "herbs"], techniques: ["pot"], place: "taverna" } },
  { test: /tzatziki/i, data: { zh: "Τζατζίκι", world: "mediterranean", area: "greece", spice: 0, flavours: ["cool", "garlicky", "tangy"], core: ["yogurt", "cucumber", "garlic", "dill", "olive oil"], techniques: ["raw"], place: "taverna" } },
  // ---- India ----
  { test: /red lentil curry/i, data: { zh: "मसूर दाल", world: "india", area: "rajasthan", spice: 1, flavours: ["earthy", "warm-spiced", "comforting"], core: ["red lentils", "onion", "garlic", "ginger", "tomato", "turmeric", "cumin"], techniques: ["dal"], place: "thali" } },
  { test: /tandoori chicken/i, data: { zh: "तंदूरी चिकन", world: "india", area: "punjab", spice: 2, flavours: ["smoky", "charred", "tangy"], core: ["chicken", "yogurt", "garam masala", "chilli", "ginger", "garlic", "lemon"], techniques: ["tandoor"], place: "tandoor" } },
  { test: /butter chicken/i, data: { zh: "मुर्ग मखनी", world: "india", area: "punjab", spice: 1, flavours: ["rich", "buttery", "tomato"], core: ["chicken", "butter", "cream", "tomato", "garam masala", "fenugreek", "ginger", "garlic"], techniques: ["karahi", "tandoor"], place: "dhaba" } },
  { test: /tikka masala/i, data: { zh: "चिकन टिक्का मसाला", world: "india", area: "punjab", spice: 2, flavours: ["creamy", "spiced", "tomato"], core: ["chicken", "yogurt", "tomato", "cream", "garam masala", "cumin", "coriander"], techniques: ["karahi"], place: "dhaba" } },
  { test: /mushroom curry/i, data: { zh: "മഷ്റൂം കറി", world: "india", area: "kerala", spice: 1, flavours: ["coconut", "nutty", "aromatic"], core: ["mushrooms", "coconut", "cashews", "onion", "curry leaves", "turmeric", "chilli"], techniques: ["coconut"], place: "southKitchen" } },
  { test: /lentil chicken curry/i, data: { zh: "दाल चिकन", world: "india", area: "punjab", spice: 1, flavours: ["hearty", "warm-spiced"], core: ["chicken", "lentils", "onion", "tomato", "ginger", "garlic", "cumin"], techniques: ["karahi"], place: "dhaba" } },
];

const ME_CUISINES = new Set(["Middle Eastern", "Lebanese", "Turkish"]);
const MED_CUISINES = new Set(["Mediterranean", "Greek", "Spanish", "North African"]);
export function enrich(r: Recipe): EnrichedRecipe {
  const hit = ENRICH.find((e) => e.test.test(r.title))?.data ?? {};
  const spicy = r.tags.some((t) => /spicy/.test(t));
  return {
    ...r,
    zh: hit.zh,
    world: hit.world ?? (r.cuisine === "Italian" ? "italy" : r.cuisine === "Korean" ? "korea" : r.cuisine === "Mexican" ? "mexico" : ME_CUISINES.has(r.cuisine ?? "") ? "middle-east" : MED_CUISINES.has(r.cuisine ?? "") ? "mediterranean" : r.cuisine === "Indian" ? "india" : "china"),
    area: hit.area ?? (r.cuisine === "Italian" ? "rome" : r.cuisine === "Korean" ? "seoul" : r.cuisine === "Mexican" ? "cdmx" : r.cuisine === "Turkish" ? "istanbul" : ME_CUISINES.has(r.cuisine ?? "") ? "levant" : r.cuisine === "Spanish" ? "spain" : r.cuisine === "North African" ? "morocco" : MED_CUISINES.has(r.cuisine ?? "") ? "greece" : r.cuisine === "Indian" ? "punjab" : "everyday"),
    spice: hit.spice ?? (spicy ? 2 : 0),
    flavours: hit.flavours ?? [],
    core: hit.core ?? [...r.protein, ...r.mainIngredient.map((m) => m.toLowerCase())],
    techniques: hit.techniques ?? (r.method === "Pan" ? ["wok"] : r.method === "Pot" ? ["braise"] : []),
    place: hit.place ?? (r.cuisine === "Italian" ? "trattoria" : r.cuisine === "Korean" ? "grill" : r.cuisine === "Mexican" ? "fonda" : ME_CUISINES.has(r.cuisine ?? "") ? "mezze" : MED_CUISINES.has(r.cuisine ?? "") ? "taverna" : r.cuisine === "Indian" ? "dhaba" : "wok"),
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
export function isKoreaRecipe(r: Recipe): boolean {
  return r.cuisine === "Korean" || /korean|bulgogi|bibimbap|kimchi|tteok|japchae|galbi/i.test(r.title);
}
export function isMexicoRecipe(r: Recipe): boolean {
  return r.cuisine === "Mexican" || /mexican|taco|salsa|guacamole|carnitas|burrito|enchilada|quesadilla|chili con carne/i.test(r.title);
}
export function isMideastRecipe(r: Recipe): boolean {
  return ME_CUISINES.has(r.cuisine ?? "") || /shawarma|falafel|hummus|kebab|kofta|tabouli|tabbouleh|shakshuka|pita|baklava/i.test(r.title);
}
export function isMedRecipe(r: Recipe): boolean {
  return (MED_CUISINES.has(r.cuisine ?? "") || /greek|tzatziki|halloumi|tagine|paella|kupus|moussaka|souvlaki/i.test(r.title)) && !/shakshuka/i.test(r.title);
}
export function isIndiaRecipe(r: Recipe): boolean {
  return r.cuisine === "Indian" || /tandoori|tikka|masala|dal\b|dahl|paneer|biryani|korma|naan/i.test(r.title);
}
export const worldRecipes = (world: WorldId, all: Recipe[]) => all.filter(world === "china" ? isChinaRecipe : world === "italy" ? isItalyRecipe : world === "korea" ? isKoreaRecipe : world === "mexico" ? isMexicoRecipe : world === "middle-east" ? isMideastRecipe : world === "mediterranean" ? isMedRecipe : isIndiaRecipe);

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
    tagline: "Durum wheat, water, and a nonna's rolling pin.", blurb: "Dried pasta was made in Sicily under the Arabs by the 1100s, long before Marco Polo, and Naples industrialised it in the 1800s. Fresh egg pasta is the north's tradition: sheets rolled thin for lasagne and tagliatelle. Pasta is always cooked al dente and finished in its sauce, never drowned in it. Bread and pizza dough rise slowly in the same workshop, sometimes for a day, which is where their flavour and blistered crust come from.",
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
  { id: "mushrooms", world: "italy", kind: "ingredient", name: "Mushrooms", zh: "Funghi", emoji: "🍄", area: "rome", pos: [-25, 0.5], prop: "porciniWood", rot: 0.3,
    tagline: "Porcini from the chestnut woods.", blurb: "Autumn in the Apennines means porcini, foraged under chestnut and oak and sold fresh at market or dried for the year. Dried porcini give a cream sauce its depth; fresh ones are sliced thin over pasta.",
    partners: ["cream", "garlic", "parmesan", "parsley"], match: (r) => has(r.core, /mushroom|porcini/) || has(r.mainIngredient, /Mushroom/) },
  { id: "lemon", world: "italy", kind: "ingredient", name: "Lemons & citrus", zh: "Limoni", emoji: "🍋", area: "sicily", pos: [23, 18], prop: "citrusGrove", rot: -0.2,
    tagline: "Sicily's gold.", blurb: "The Arabs planted citrus in Sicily in the 900s and built the irrigation that still waters the groves around Palermo and Catania. Lemons go over fish and into granita; blood oranges, the island's own, into winter salads. No recipe in the cookbook uses them yet.",
    partners: ["fish", "olive oil", "sugar", "almonds"], match: (r) => has(r.core, /lemon|orange|citrus/) },
  { id: "seafood", world: "italy", kind: "ingredient", name: "Fish & seafood", zh: "Pesce", emoji: "🦐", area: "venice", pos: [22, -4], prop: "fishMarket", rot: 0.3, place: true,
    tagline: "The lagoon's catch, sold at dawn by the Rialto.", blurb: "Venice's fish market has stood by the Rialto bridge for a thousand years. Sardines marinated in onion and vinegar, cuttlefish cooked in their own ink over polenta, clams tossed with spaghetti. Sicily's tuna and swordfish come from the other end of the country.",
    partners: ["garlic", "white wine", "parsley", "lemon"], match: (r) => has(r.protein, /fish|prawn|shrimp|seafood|clam/) },
  { id: "riceIt", world: "italy", kind: "ingredient", name: "Rice", zh: "Riso", emoji: "🍚", area: "venice", pos: [2, -24], prop: "riceFieldItaly", rot: 0.1,
    tagline: "Risotto country.", blurb: "The Po valley has grown short-grain rice since the 1400s, in flooded fields around Vercelli and Pavia. Arborio and carnaroli release their starch slowly, which is what makes a risotto creamy without cream: stock added a ladle at a time, stirred, finished with butter and parmesan.",
    partners: ["stock", "butter", "parmesan", "saffron"], match: (r) => has(r.core, /risotto|\brice\b/) },
  // --- techniques ---
  { id: "oven", world: "italy", kind: "technique", name: "Wood-fired oven", zh: "Forno a legna", emoji: "🔥", area: "rome", pos: [-6, -4], prop: "pizzeria", rot: 0.15, place: true, placeName: "Pizzeria",
    tagline: "Ninety seconds at 450 degrees.", blurb: "Naples' bakers were selling flatbreads with tomato by the 1700s; the Margherita, with its tomato, mozzarella and basil, is dated to 1889. A domed brick oven burning oak or beech bakes a pizza in under two minutes. The same ovens bake lasagne, meatballs and stuffed peppers on a gentler heat.",
    partners: ["pizza dough", "tomato", "mozzarella"], match: (r) => has(r.techniques, /oven/) },
  { id: "ragu", world: "italy", kind: "technique", name: "Slow ragù", zh: "Ragù", emoji: "🍲", area: "rome", pos: [-14, -6], prop: "trattoria", rot: 0.1, place: true, placeName: "Trattoria",
    tagline: "Soffritto, mince, wine, and four hours.", blurb: "A ragù starts with soffritto, onion, carrot and celery softened in oil, then mince browned slowly, wine cooked off, tomato and stock added and the pot left to barely bubble for hours. Bologna's chamber of commerce registered the official recipe in 1982. Trattorie are the family-run restaurants that serve it.",
    partners: ["beef", "pork", "tomato", "pasta"], match: (r) => has(r.techniques, /ragu|pasta/) },
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


// ---------- the Korea world ----------

const GJ: [number, number] = [-17, -9];
export const KOREA_OBJECTS: WorldObject[] = [
  // --- ingredients ---
  { id: "kimchi", world: "korea", kind: "ingredient", name: "Kimchi", zh: "김치", emoji: "🥬", area: "seoul", pos: [-29, -6], prop: "jangdokdae", rot: 0.2,
    tagline: "Cabbage, salt, chilli and time, buried in a clay jar.", blurb: "Koreans were salting vegetables for winter in the Three Kingdoms period (57 BC–668 AD), and the Goryeo poet Yi Gyu-bo (1168–1241) wrote of radish kept in brine. Chilli only reached Korea around 1600, first recorded in 1614, and red kimchi became the norm in the 1700s; the whole-cabbage kimchi eaten today took shape in the 1800s. Every November families still gather for kimjang, the making of a winter's worth, which UNESCO listed as heritage in 2013. The onggi jars breathe a little, and buried to the neck they hold the cabbage at 0–4 °C all winter.",
    flavour: ["sour", "spicy", "salty", "umami"], partners: ["gochugaru", "garlic", "rice", "pork"], match: (r) => has(r.core, /kimchi/) },
  { id: "hanwoo", world: "korea", kind: "ingredient", name: "Beef (hanwoo)", zh: "한우", emoji: "🐂", area: "jeonju", pos: [-31, 15], prop: "hanwoo", rot: 0.5,
    tagline: "The native brown cattle Koreans marinate thin and grill fast.", blurb: "Hanwoo are Korea's own breed, brown and stocky, kept for ploughing for two thousand years, which is why Joseon kings (1392–1910) banned their slaughter again and again and beef stayed a feast food. Grilled marinated beef goes back to maekjeok, the skewered meat of the Goguryeo kingdom (37 BC–668 AD); the Joseon court called its thin marinated slices neobiani. The name bulgogi, fire meat, spread from Pyongyang in the 1920s and 1930s. The marinade is soy, sugar, garlic, sesame oil and grated pear, whose enzymes soften the meat.",
    partners: ["soy sauce", "pear", "garlic", "sesame oil", "lettuce"], match: (r) => has(r.protein, /beef/) },
  { id: "riceKr", world: "korea", kind: "ingredient", name: "Rice", zh: "쌀", emoji: "🍚", area: "jeonju", pos: [-6, 13], prop: "ricePaddyKorea", rot: 0,
    tagline: "Bap: the word for rice is the word for a meal.", blurb: "Rice has been grown on the peninsula since about 1500 BC, and the sticky short-grain kind became the centre of every table: 'have you eaten rice?' is still a greeting. A meal is bap with soup and banchan, the small shared side dishes. Bibimbap, rice mixed with vegetables and gochujang, was first written down as goldongban in the Siuijeonseo cookbook of the late 1800s; Jeonju's version is the famous one.",
    partners: ["namul", "gochujang", "egg", "sesame oil"], match: (r) => has(r.core, /\brice\b/) },
  { id: "namul", world: "korea", kind: "ingredient", name: "Vegetables & namul", zh: "나물", emoji: "🥗", area: "jeonju", pos: [-23, 8], prop: "namulPlot", rot: -0.1,
    tagline: "Blanched, squeezed and seasoned, one vegetable at a time.", blurb: "Namul are seasoned vegetables: spinach, bean sprouts, fernbrake, radish and bellflower root, each blanched and dressed with sesame oil, garlic and salt or soy. Mountain foraging for them is older than farming here, and on the first full moon of the lunar year (Jeongwol Daeboreum) Koreans eat nine kinds of dried namul for luck. Napa cabbage arrived from China in the Joseon period (1392–1910) and by the late 1800s had become the kimchi cabbage.",
    partners: ["sesame oil", "garlic", "soy sauce", "rice"], match: (r) => has(r.core, /namul|spinach|carrot|sprout|zucchini|vegetable/) },
  { id: "seafoodKr", world: "korea", kind: "ingredient", name: "Fish & seafood", zh: "해산물", emoji: "🦑", area: "busan", pos: [10, 7], prop: "jagalchi", rot: -0.3, place: true, placeName: "Jagalchi fish market",
    tagline: "Busan's market, run by the ajumma of Jagalchi.", blurb: "Jagalchi, named after the gravel (jagal) of its shore, grew into Korea's biggest fish market after the Korean War (1950–53) filled Busan with refugees who sold their catch on the beach. The women who run it, the Jagalchi ajumma, sell live octopus, flounder and mackerel, and upstairs you eat what you point at. Korea's coasts give it dried anchovy for stock, salted shrimp and fish sauce for kimchi, and the seaweed for gim and miyeok soup.",
    partners: ["gochugaru", "garlic", "scallion", "rice"], match: (r) => has(r.protein, /fish|prawn|shrimp|seafood|squid|octopus/) },
  { id: "tangerine", world: "korea", kind: "ingredient", name: "Jeju tangerines", zh: "제주 감귤", emoji: "🍊", area: "jeju", pos: [24, 13], prop: "tangerineGrove", rot: 0.15,
    tagline: "Once tribute for kings, now the island's winter harvest.", blurb: "Jeju sent citrus to the Joseon court as tribute from the 1400s, guarded so closely that islanders were punished if a tree died. The sweet, seedless tangerine grown today was planted in 1911 by a French missionary, Father Taquet, who traded Jeju cherry seedlings for fourteen trees from Japan. The groves are walled with black basalt, like every field on the island, and picked from November.",
    partners: ["honey", "tea"], match: (r) => has(r.core, /tangerine|mandarin|citrus|orange/) },
  { id: "blackPig", world: "korea", kind: "ingredient", name: "Pork (Jeju black pig)", zh: "흑돼지", emoji: "🐖", area: "jeju", pos: [24, 18.5], prop: "blackPigs", rot: 0.2,
    tagline: "The island's small black pigs, grilled thick over charcoal.", blurb: "Jeju's black pigs are a native breed raised on the island for at least a thousand years, historically in stone pens beneath the outhouse. Their pork is grilled in thick slabs, skin on, and eaten dipped in salted anchovy sauce (meljeot). On the mainland, pork belly (samgyeopsal) became the everyday barbecue meat in the 1970s and 1980s, when beef was too dear for most families.",
    partners: ["kimchi", "garlic", "lettuce", "ssamjang"], match: (r) => has(r.protein, /pork/) },
  // --- flavours ---
  { id: "gochugaru", world: "korea", kind: "flavour", name: "Gochugaru & gochujang", zh: "고춧가루·고추장", emoji: "🌶️", area: "jeonju", pos: [-32, 6], prop: "chilliMats", rot: 0.1,
    tagline: "Sun-dried chilli flakes, and the fermented red paste made from them.", blurb: "Chilli came to Korea from the Americas by way of Japan around 1600, first recorded in the Jibong yuseol of 1614, and within a century it had coloured kimchi red. Gochugaru is the flakes of sun-dried chillies, milder and fruitier than most. Gochujang, a paste of chilli, fermented soybean and glutinous rice, appears in a 1715 farming manual and matures for months in the jars on the jangdokdae; Sunchang, in the south-west, is its home town.",
    flavour: ["hot", "sweet", "fermented"], partners: ["kimchi", "rice", "garlic", "sesame"], match: (r) => has(r.core, /gochu|chilli|chili|pepper flakes/) },
  { id: "aromaticsKr", world: "korea", kind: "flavour", name: "Garlic, scallion & sesame", zh: "마늘·파·참깨", emoji: "🧄", area: "seoul", pos: [GJ[0] + 1.5, GJ[1] + 2.2], prop: "none", hitOnly: true, parent: "gwangjang",
    tagline: "The seasoning under almost every Korean dish.", blurb: "In the founding myth, a bear became the first Korean's mother by eating only garlic and mugwort for a hundred days, and Koreans still eat more garlic per head than anyone. Toasted sesame oil has been pressed since the Three Kingdoms period (57 BC–668 AD) and finishes namul, bibimbap and marinades. Fermented soybean, doenjang and soy sauce, is older still: the Samguk sagi (1145) lists jang among the gifts at a royal wedding in 683 AD.",
    flavour: ["pungent", "nutty", "savoury"], partners: ["soy sauce", "sesame oil", "gochugaru", "beef"], match: (r) => has(r.core, /garlic|scallion|sesame|ginger|onion|soy/) },
  // --- techniques ---
  { id: "grill", world: "korea", kind: "technique", name: "Tabletop barbecue", zh: "고기구이", emoji: "🔥", area: "seoul", pos: [0, -7], prop: "bbqHouse", rot: 0, place: true, placeName: "Barbecue house",
    tagline: "Charcoal in the table, tongs in hand, lettuce for wrapping.", blurb: "Gogi-gui, meat grilled at the table over charcoal, descends from the marinated skewers of Goguryeo (37 BC–668 AD) and the court's neobiani. The restaurants with a grill sunk into every table spread across Seoul in the 1960s and 1970s. Thin bulgogi cooks in a minute; each piece is wrapped in lettuce or perilla with rice, garlic and ssamjang, a spoon of doenjang and gochujang, and eaten in one bite.",
    partners: ["beef", "pork", "kimchi", "lettuce", "garlic"], match: (r) => has(r.techniques, /grill/) },
  { id: "dolsot", world: "korea", kind: "technique", name: "Stone-bowl cooking", zh: "돌솥", emoji: "🥘", area: "jeonju", pos: [-14, 10], prop: "dolsotHouse", rot: 0.1, place: true, placeName: "Jeonju hanok restaurant",
    tagline: "A heavy stone bowl that keeps sizzling at the table.", blurb: "A dolsot is a bowl carved from stone, heated until the rice pressed against it turns into a golden crust called nurungji. Bibimbap served this way, dolsot bibimbap, became famous from Jeonju restaurants in the 1960s. The toppings are laid out by colour, five kinds for the five elements, and a raw yolk goes on top; you stir it all with a spoon of gochujang and eat it hot.",
    partners: ["rice", "namul", "gochujang", "egg", "beef"], match: (r) => has(r.techniques, /dolsot/) },
  // --- places ---
  { id: "gwangjang", world: "korea", kind: "place", name: "Gwangjang Market", zh: "광장시장", emoji: "🏮", area: "seoul", pos: GJ, prop: "gwangjang", rot: 0, place: true, open: "reveal",
    tagline: "Seoul's oldest market, open since 1905.", blurb: "Korea's first permanent market, founded in 1905 by Korean merchants as an answer to Japanese-run shops. Under its roof the food alley sells mung-bean pancakes fried in pork fat, mayak gimbap, spicy rice cakes, kimchi by the tub and the garlic and sesame that season everything.", match: () => false },
  { id: "stall-kimchi", world: "korea", kind: "ingredient", name: "Kimchi", zh: "김치", emoji: "🥬", area: "seoul", pos: [GJ[0] - 5, GJ[1] - 2.2], prop: "none", hitOnly: true, parent: "gwangjang", alias: "kimchi", tagline: "", blurb: "", match: () => false },
  { id: "stall-veg", world: "korea", kind: "ingredient", name: "Vegetables & namul", zh: "나물", emoji: "🥗", area: "seoul", pos: [GJ[0] - 3.5, GJ[1] + 2.2], prop: "none", hitOnly: true, parent: "gwangjang", alias: "namul", tagline: "", blurb: "", match: () => false },
  { id: "stall-gimbap", world: "korea", kind: "dish", name: "Gimbap & bindaetteok", zh: "김밥·빈대떡", emoji: "🍙", area: "seoul", pos: [GJ[0] + 2, GJ[1] - 2.2], prop: "none", hitOnly: true, parent: "gwangjang",
    tagline: "The market's own dishes.", blurb: "Bindaetteok are mung beans ground on a stone mill and fried into thick pancakes with kimchi and pork; Gwangjang's stalls have made them since the 1900s. Mayak gimbap, 'narcotic' gimbap, are the market's finger-sized seaweed rice rolls, so called because nobody stops at one. Tteokbokki in a red gochujang sauce was invented by Ma Bok-rim in Seoul's Sindang-dong in 1953.", match: () => false },
  { id: "pojangmacha", world: "korea", kind: "dish", name: "Pojangmacha", zh: "포장마차", emoji: "🍢", area: "seoul", pos: [6, -3.5], prop: "pojangmacha", rot: -0.3, placeName: "Street tent",
    tagline: "An orange tent, a few stools, skewers and soju.", blurb: "Pojangmacha means covered wagon: the street tents that appeared after the Korean War (1950–53), where people eat fish-cake skewers in hot broth, tteokbokki and grilled meat late into the night with soju. Soju, distilled since the Mongol era of the 1200s, is still Korea's drink.", match: () => false },
  { id: "haenyeo", world: "korea", kind: "landmark", name: "Haenyeo", zh: "해녀", emoji: "🤿", area: "jeju", pos: [27, 23.5], prop: "haenyeo", rot: 0,
    tagline: "Jeju's diving women, who harvest the sea without air tanks.", blurb: "The haenyeo dive to ten metres on one breath for abalone, sea urchin and octopus, whistling as they surface. Records of women divers on Jeju go back to the 1600s, when the men were away fishing or conscripted; most are now over sixty. UNESCO listed them as heritage in 2016. What they catch is eaten raw with gochujang or stewed into abalone porridge.", match: () => false },
];


// ---------- the Mexico world ----------

const MK: [number, number] = [-14, -13];
export const MEXICO_OBJECTS: WorldObject[] = [
  // --- ingredients ---
  { id: "corn", world: "mexico", kind: "ingredient", name: "Corn (maize)", zh: "Maíz", emoji: "🌽", area: "oaxaca", pos: [-27, 13], prop: "milpa", rot: 0.1,
    tagline: "The plant Mexico bred from a grass, nine thousand years ago.", blurb: "Maize was domesticated from teosinte, a wild grass, in the Balsas valley of southern Mexico around 7000 BC. The milpa plants it with beans, which climb the stalks and fix nitrogen, and squash, which shades the soil; the three together fed the Olmec, the Maya and the Aztecs. Soaking the kernels in lime water, nixtamalisation, dates to about 1500 BC and unlocks the niacin that makes corn a complete food. Tortillas, tamales, pozole and atole all start there.",
    partners: ["beans", "chillies", "lime", "pork"], match: (r) => has(r.core, /corn|tortilla|masa|bean|taco/) },
  { id: "tomatoMx", world: "mexico", kind: "ingredient", name: "Tomatoes & tomatillos", zh: "Jitomate y tomate verde", emoji: "🍅", area: "oaxaca", pos: [-17, 20], prop: "tomatoPatch", rot: 0.05,
    tagline: "Both are Mexican; the world's tomato came from here.", blurb: "The tomato was domesticated in Mexico from a wild Andean ancestor; the Aztecs called it xitomatl and were selling it in Tenochtitlan's markets when Cortés arrived in 1519. The tomatillo, tomatl, is a different plant in a papery husk, tart and green, and it makes salsa verde. Red salsas and pico de gallo are tomato, onion, chilli, cilantro and lime; the Spanish carried the tomato to Europe, where Italy took two centuries to trust it.",
    partners: ["chillies", "onion", "cilantro", "lime"], match: (r) => has(r.core, /tomato|tomatillo/) },
  { id: "avocado", world: "mexico", kind: "ingredient", name: "Avocados", zh: "Aguacate", emoji: "🥑", area: "jalisco", pos: [-31, 4], prop: "avocadoOrchard", rot: 0.1,
    tagline: "Ahuacatl, from Michoacán's volcanic hills.", blurb: "Avocados have been eaten in Mexico for at least ten thousand years and cultivated since about 5000 BC; the Aztec word ahuacatl became aguacate, and guacamole is ahuacamolli, avocado sauce. Michoacán's volcanic soil now grows most of the world's supply, and the Hass variety, every one descended from a single tree planted in California in 1926, is the one you buy. Mashed in the molcajete with lime, onion, cilantro and chilli, it is eaten the day it is made.",
    partners: ["lime", "cilantro", "onion", "tomatoes"], match: (r) => has(r.core, /avocado/) },
  { id: "limes", world: "mexico", kind: "flavour", name: "Lime, onion & cilantro", zh: "Limón, cebolla y cilantro", emoji: "🍋", area: "cdmx", pos: [MK[0] - 3, MK[1] + 2.4], prop: "none", hitOnly: true, parent: "mercado",
    tagline: "The squeeze and the sprinkle that finish every taco.", blurb: "Limes, onions and cilantro all came with the Spanish after 1521, and Mexico made them its own: the small, sharp Key lime is limón here, squeezed over everything. Onion and cilantro, chopped fine, go on tacos, into salsas and over soups. Cumin and oregano came the same way, from Spain's Moorish kitchens, and season chili con carne and carnitas.",
    flavour: ["sour", "sharp", "herby"], partners: ["tomatoes", "avocado", "chillies", "pork"], match: (r) => has(r.core, /lime|onion|cilantro|garlic|cumin/) },
  { id: "cacao", world: "mexico", kind: "ingredient", name: "Cacao & chocolate", zh: "Cacao", emoji: "🍫", area: "yucatan", pos: [26, -4], prop: "cacaoGrove", rot: -0.2,
    tagline: "The bean that was money, drunk bitter and frothed.", blurb: "Cacao was drunk by the Olmec by 1500 BC and the Maya by 500 BC: ground, mixed with water, chilli and cornmeal and poured from a height to raise a froth. The Aztecs used the beans as currency, a turkey costing about a hundred, and Moctezuma drank it from gold cups. Sugar and milk were added in Europe after 1528. In Oaxaca the beans are still ground with cinnamon and almonds for hot chocolate whipped with a molinillo, and a little goes into a mole.",
    partners: ["chillies", "cinnamon", "corn"], match: (r) => has(r.core, /cacao|chocolate/) },
  { id: "beefMx", world: "mexico", kind: "ingredient", name: "Beef & beans (the rancho)", zh: "Res y frijoles", emoji: "🐂", area: "jalisco", pos: [-29, -21], prop: "rancho", rot: 0.1, place: true, placeName: "Rancho",
    tagline: "Cattle came in 1521, and the vaqueros with them.", blurb: "There were no cattle in the Americas until the Spanish landed them in 1521; within a century Mexico's ranchos ran huge herds and the charros, its horsemen, invented the cowboy. Beans had been here for seven thousand years. Chili con carne, beef stewed with dried chillies and cumin, is border food: it was sold by the chili queens of San Antonio in the 1880s and is Texas's state dish, but its chillies, cumin and beans are Mexico's. Carne asada, thin beef grilled over mesquite, is the north's own.",
    partners: ["dried chillies", "cumin", "beans", "tomatoes", "tortillas"], match: (r) => has(r.protein, /beef/) },
  // --- flavours ---
  { id: "chilliesMx", world: "mexico", kind: "flavour", name: "Chillies", zh: "Chiles", emoji: "🌶️", area: "oaxaca", pos: [-9, 12], prop: "chilliRacks", rot: 0.1,
    tagline: "Fresh, dried or smoked: sixty kinds, and every one has a job.", blurb: "Chillies were domesticated in Mexico around 6000 BC and every chilli in the world descends from these. Fresh, they are jalapeño, serrano and the Yucatán's habanero; dried, they change name: a ripe jalapeño smoked becomes chipotle, a poblano dried becomes an ancho, and guajillo, pasilla and mulato are the base of a mole. Dried chillies are toasted on the comal, soaked and ground; that paste marinates al pastor and deepens chili con carne. Heat is only part of it; most bring smoke, raisin and earth.",
    flavour: ["hot", "smoky", "fruity"], partners: ["tomatoes", "corn", "pork", "cacao"], match: (r) => has(r.core, /chilli|chili|jalapeño|habanero|chipotle/) },
  // --- techniques ---
  { id: "comal", world: "mexico", kind: "technique", name: "Nixtamal & the comal", zh: "Nixtamal y comal", emoji: "🫓", area: "oaxaca", pos: [-17, 13], prop: "tortilleria", rot: 0.1, placeName: "Tortillería",
    tagline: "Corn soaked in lime, ground on stone, patted onto a clay griddle.", blurb: "Nixtamalisation, cooking corn in water with lime or wood ash, was practised by 1500 BC; it loosens the hull, adds calcium and frees the niacin. The wet kernels are ground on a metate, a sloping stone, into masa, and the masa is patted into tortillas and cooked on a comal, the flat clay griddle the Aztecs already used. A tortilla puffs when it is right. Chillies and tomatoes are toasted on the same comal for salsas, which is where their smokiness comes from.",
    partners: ["corn", "chillies", "tomatoes"], match: (r) => has(r.techniques, /comal|nixtamal/) },
  { id: "molcajete", world: "mexico", kind: "technique", name: "The molcajete", zh: "Molcajete", emoji: "🪨", area: "cdmx", pos: [5, -5], prop: "molcajeteStand", rot: -0.3, place: true, placeName: "Salsa stand",
    tagline: "A basalt mortar that bruises rather than chops.", blurb: "The molcajete, a three-legged mortar of volcanic rock with its pestle the tejolote, has been in Mexican kitchens for about six thousand years; the Aztec word is molcaxitl, sauce bowl. Grinding garlic, chilli and salt to a paste, then crushing tomato and avocado into it, releases oils a knife never does, which is why guacamole and pico de gallo taste better made this way. A new molcajete is seasoned by grinding rice in it until the grit stops coming off.",
    partners: ["avocado", "tomatoes", "lime", "chillies"], match: (r) => has(r.techniques, /molcajete/) },
  { id: "trompo", world: "mexico", kind: "technique", name: "Al pastor on the trompo", zh: "Al pastor", emoji: "🌮", area: "cdmx", pos: [-10, -3], prop: "taqueria", rot: 0.2, place: true, placeName: "Taquería",
    tagline: "Lebanese shawarma, turned Mexican with chillies and pineapple.", blurb: "Lebanese immigrants brought the vertical spit to Puebla in the 1920s and 1930s and sold lamb shawarma in pita as tacos árabes. Mexico City's taqueros swapped the lamb for pork, the pita for corn tortillas and the spices for a marinade of dried guajillo chillies, achiote and vinegar, and by the 1960s al pastor, shepherd-style, was the city's taco. The taquero slices the trompo straight onto the tortilla and flicks a piece of the pineapple on top from the spit's crown.",
    partners: ["pork", "chillies", "pineapple", "corn", "lime"], match: (r) => has(r.techniques, /trompo/) },
  { id: "carnitas", world: "mexico", kind: "technique", name: "Copper-pot carnitas", zh: "Carnitas", emoji: "🐖", area: "jalisco", pos: [-26, -6], prop: "carnitasStand", rot: 0.05, place: true, placeName: "Carnitas stand",
    tagline: "Pork cooked slowly in its own fat until it falls apart.", blurb: "Pigs came with the Spanish in the 1520s, and Michoacán, especially the town of Quiroga, made carnitas its trade: pork simmered for hours in a copper cazo of lard, sometimes with orange, milk or cola, until it is soft inside and crisp at the edges. Every part goes in, and you order surtidas, mixed, or ask for maciza, the lean. It is chopped on a block, folded into a tortilla with salsa verde and onion, and eaten on Sunday mornings.",
    partners: ["orange", "garlic", "cumin", "corn", "salsa verde"], match: (r) => has(r.techniques, /carnitas/) },
  { id: "fonda", world: "mexico", kind: "technique", name: "Clay cazuelas (the fonda)", zh: "Fonda", emoji: "🍛", area: "cdmx", pos: [-2, -4], prop: "fonda", rot: -0.1, place: true, placeName: "Fonda",
    tagline: "Home cooking in clay pots, at a fixed price, at lunchtime.", blurb: "A fonda is the neighbourhood lunch place, a family kitchen with a few tables and a comida corrida: soup, rice, a stew, tortillas and an agua fresca for one price. The cooking is in cazuelas, glazed clay pots that hold heat gently; arroz rojo, rice fried in oil then simmered in blended tomato and onion, is the second course in nearly every one. Frijoles de la olla bubble all day in a clay olla beside it.",
    partners: ["rice", "tomatoes", "beans", "chillies"], match: (r) => has(r.techniques, /cazuela|pot/) },
  // --- places ---
  { id: "mercado", world: "mexico", kind: "place", name: "The mercado", zh: "Mercado", emoji: "🧺", area: "cdmx", pos: MK, prop: "mercado", rot: 0, place: true, open: "reveal",
    tagline: "Chillies, tortillas, avocados and limes under papel picado.", blurb: "Tenochtitlan's market at Tlatelolco astonished the Spanish in 1519 with sixty thousand people a day; Mexico City's mercados still work the same way, stall by stall: dried chillies by the sack, fresh tortillas by the kilo, avocados, limes, herbs and sweets.", match: () => false },
  { id: "stall-chillies", world: "mexico", kind: "flavour", name: "Chillies", zh: "Chiles", emoji: "🌶️", area: "cdmx", pos: [MK[0] - 5, MK[1] - 2.4], prop: "none", hitOnly: true, parent: "mercado", alias: "chilliesMx", tagline: "", blurb: "", match: () => false },
  { id: "stall-tortillas", world: "mexico", kind: "ingredient", name: "Corn & tortillas", zh: "Maíz", emoji: "🌽", area: "cdmx", pos: [MK[0], MK[1] - 2.4], prop: "none", hitOnly: true, parent: "mercado", alias: "corn", tagline: "", blurb: "", match: () => false },
  { id: "stall-avocados", world: "mexico", kind: "ingredient", name: "Avocados & tomatoes", zh: "Aguacate", emoji: "🥑", area: "cdmx", pos: [MK[0] + 5, MK[1] - 2.4], prop: "none", hitOnly: true, parent: "mercado", alias: "avocado", tagline: "", blurb: "", match: () => false },
  { id: "stall-sweets", world: "mexico", kind: "dish", name: "Dulces", zh: "Dulces", emoji: "🍬", area: "cdmx", pos: [MK[0] + 3, MK[1] + 2.4], prop: "none", hitOnly: true, parent: "mercado",
    tagline: "Sweets from the convents and the sugar cane.", blurb: "Sugar cane arrived with the Spanish and the convent kitchens of Puebla turned it into camotes, alegrías of amaranth and honey (an Aztec sweet the friars adopted), tamarind candies rolled in chilli, piloncillo cones of raw sugar, and cajeta, goat's milk boiled to caramel in Celaya since the 1800s.", match: () => false },
  { id: "churros", world: "mexico", kind: "dish", name: "Churros & chocolate", zh: "Churros", emoji: "🥖", area: "cdmx", pos: [3, -7.5], prop: "churrosCart", rot: -0.4, placeName: "Churros cart",
    tagline: "Fried dough, sugar, and a cup of thick chocolate.", blurb: "Churros came from Spain, where shepherds fried them over open fires; Mexico City's El Moro has been frying them since 1935, open all night. The dough is piped through a star nozzle into hot oil, rolled in sugar and cinnamon, and dunked in chocolate thickened with cornstarch, an old marriage between Spanish flour and Mexican cacao.", match: () => false },
  { id: "mariachi", world: "mexico", kind: "landmark", name: "Mariachi", zh: "Mariachi", emoji: "🎺", area: "cdmx", pos: [7, -11], prop: "mariachi", rot: -0.5,
    tagline: "Trumpet, guitar and guitarrón, in charro suits.", blurb: "Mariachi began as string bands in the ranchos of Jalisco in the 1800s; the trumpet joined in the 1930s when radio wanted more noise, and the charro suit came with the cinema. Since 1925 the bands have waited for hire in Mexico City's Plaza Garibaldi, and no serenade, wedding or birthday is complete without one. UNESCO listed mariachi in 2011.", match: () => false },
  { id: "xochimilco", world: "mexico", kind: "landmark", name: "Xochimilco", zh: "Xochimilco", emoji: "🛶", area: "cdmx", pos: [14, 5], prop: "xochimilco", rot: 0,
    tagline: "The last canals of the Aztec lake, and the gardens that fed the city.", blurb: "Tenochtitlan was built on a lake, and the Aztecs fed it from chinampas: rafts of mud and reeds anchored by willows that became floating fields, yielding up to seven harvests a year. Xochimilco's canals are what is left, still farmed for flowers and vegetables, and the painted trajineras have carried picnics and mariachis along them since the 1900s. UNESCO listed the canals in 1987.", match: () => false },
  { id: "tequila", world: "mexico", kind: "dish", name: "Tequila & mezcal", zh: "Tequila y mezcal", emoji: "🥃", area: "jalisco", pos: [-31, -14], prop: "agaveField", rot: 0, placeName: "Distillery",
    tagline: "Agave, roasted, crushed and distilled.", blurb: "The Aztecs fermented agave sap into pulque, a milky beer; the Spanish brought distilling, and by the 1600s mezcal was being made near the town of Tequila. A blue agave takes seven years to grow; the jimador cuts away the leaves with a coa to reach the piña, which is roasted (in a pit, for mezcal, which is where the smoke comes from), crushed, fermented and distilled twice. Tequila has had a protected name since 1974, and Oaxaca makes most of the mezcal.", match: () => false },
  { id: "mole", world: "mexico", kind: "dish", name: "Mole", zh: "Mole", emoji: "🍲", area: "oaxaca", pos: [-25, 21], prop: "moleKitchen", rot: 0.1, placeName: "Cocina de humo",
    tagline: "Thirty ingredients, ground by hand, simmered for a day.", blurb: "Mole, from the Nahuatl molli, sauce, is Oaxaca's pride and it claims seven of them. Mole negro takes chilhuacle and mulato chillies toasted almost black, tomatoes, onion, garlic, nuts, seeds, spices, charred tortilla and a little chocolate, all ground on the metate and simmered for hours. Legend puts mole poblano's invention in a Puebla convent in the 1680s; it is served at weddings and on the Day of the Dead, over turkey or chicken.", match: () => false },
  { id: "pib", world: "mexico", kind: "dish", name: "Cochinita pibil", zh: "Cochinita pibil", emoji: "🍖", area: "yucatan", pos: [24, 3], prop: "pibOven", rot: 0.3, placeName: "The pib",
    tagline: "Pork in achiote and sour orange, buried with hot stones.", blurb: "A pib is the Maya pit oven: a hole dug in the ground, lined with stones heated on a fire, the food wrapped in banana leaves, then earth shovelled over it for the night. Cochinita pibil marinates a whole young pig in achiote (the red seed of the annatto tree) and Seville orange, and comes out shredded, eaten in tortillas with pickled red onion and habanero. Before pigs arrived in the 1500s the Maya cooked deer and turkey the same way.", match: () => false },
  { id: "cenote", world: "mexico", kind: "landmark", name: "Cenote", zh: "Cenote", emoji: "💧", area: "yucatan", pos: [18, -9], prop: "cenote", rot: 0,
    tagline: "A sinkhole to the underworld, and the only fresh water for miles.", blurb: "Yucatán is a limestone slab with no rivers; its water is underground, reached through the cenotes, ts'onot, where the roof of a cave has fallen in. The Maya built Chichén Itzá beside one and threw gold, jade and people into it as offerings to Chaac, the rain god. Today they are for swimming, cold and clear, with tree roots hanging to the water.", match: () => false },
];


// ---------- the Middle East world ----------

const BZ: [number, number] = [12, -12];
export const MIDEAST_OBJECTS: WorldObject[] = [
  // --- ingredients ---
  { id: "chickpeas", world: "middle-east", kind: "ingredient", name: "Chickpeas & tahini", zh: "حمص وطحينة", emoji: "🫘", area: "levant", pos: [-24, 9], prop: "chickpeaField", rot: 0.1,
    tagline: "The oldest crops of the Fertile Crescent, ground into hummus.", blurb: "Chickpeas were domesticated in south-east Turkey around 7500 BC, among the first crops anyone farmed, and sesame followed from the Indus by 2000 BC. Hummus bi tahina, chickpeas mashed with sesame paste, lemon and garlic, is first written down in Cairo cookbooks of the 1200s. Every city on the coast claims it; Beirut serves it warm with olive oil and pine nuts, and falafel, the same chickpeas ground raw and fried, is the street's breakfast.",
    partners: ["lemon", "garlic", "olive oil", "pita"], match: (r) => has(r.core, /chickpea|tahini|hummus/) },
  { id: "lambYogurt", world: "middle-east", kind: "ingredient", name: "Lamb, chicken & yogurt", zh: "لحم ولبن", emoji: "🐑", area: "levant", pos: [-29, 3], prop: "flock", rot: 0,
    tagline: "The flock gives the meat and the yogurt that tenderises it.", blurb: "Sheep and goats were domesticated in the Zagros and Taurus mountains around 8000 BC, and yogurt, milk soured by warm-climate bacteria, followed soon after; the word is Turkish. Meat for the spit or skewer is steeped overnight in yogurt, garlic and spices, whose acid softens it and whose sugars char. Strained overnight in cloth the yogurt becomes labneh; salted and dried it becomes the balls kept in oil all year.",
    partners: ["garlic", "cumin", "sumac", "pita", "lemon"], match: (r) => has(r.protein, /chicken|lamb|yogurt|beef/) },
  { id: "herbs", world: "middle-east", kind: "ingredient", name: "Parsley, mint & bulgur", zh: "بقدونس ونعناع", emoji: "🌿", area: "levant", pos: [-15, 8], prop: "herbGarden", rot: -0.1,
    tagline: "A salad that is mostly herb, from the hills above Beirut.", blurb: "Tabbouleh comes from the mountains of Lebanon and Syria, where families ate wild herbs with a little cracked wheat; the salad is nearly all chopped flat-leaf parsley and mint, with bulgur, tomato, lemon and oil, scooped up in lettuce or cabbage leaves. Bulgur is wheat parboiled, dried and cracked, a way of keeping the harvest that Anatolians have used for four thousand years. Mint dries for tea; parsley goes into nearly everything.",
    partners: ["lemon", "olive oil", "tomato", "onion"], match: (r) => has(r.core, /parsley|mint|bulgur|herb/) },
  { id: "oliveLemon", world: "middle-east", kind: "ingredient", name: "Olives & lemons", zh: "زيتون وليمون", emoji: "🫒", area: "levant", pos: [-29, -12], prop: "oliveLemonGrove", rot: 0.1,
    tagline: "Trees older than the villages beneath them.", blurb: "Olives were first pressed for oil in the Levant around 4000 BC, and some trees near Bethlehem are believed to be over a thousand years old. Lemons came later, from India through Persia, and were being grown in the Mediterranean by the 900s. Between them they finish almost every mezze: oil poured over hummus and labneh, lemon squeezed on tabbouleh and fattoush, both on grilled fish. Za'atar, dried thyme with sesame and sumac, is eaten with oil and bread for breakfast.",
    partners: ["garlic", "za'atar", "chickpeas", "herbs"], match: (r) => has(r.core, /olive|lemon/) },
  { id: "dates", world: "middle-east", kind: "ingredient", name: "Dates", zh: "تمر", emoji: "🌴", area: "arabia", pos: [-10, 20], prop: "oasis", rot: 0,
    tagline: "The tree of life, grown in the desert's oases for six thousand years.", blurb: "Date palms were cultivated in Mesopotamia and eastern Arabia by 4000 BC; they need their feet in water and their heads in fire, as the saying goes, which is what an oasis provides. A tree gives a hundred kilos a year for a century. Dates broke the fast at sundown in Ramadan and still do, eaten with Arabic coffee; stuffed with almonds, pressed into blocks for the caravan, or cooked down to dibs, the syrup used before sugar.",
    partners: ["coffee", "almonds", "cardamom"], match: (r) => has(r.core, /date/) },
  { id: "spicesMe", world: "middle-east", kind: "flavour", name: "Spices of the bazaar", zh: "Baharat", emoji: "🧂", area: "istanbul", pos: [BZ[0] - 5.5, BZ[1] - 2.6], prop: "none", hitOnly: true, parent: "bazaar",
    tagline: "Cumin, sumac, cinnamon and the pepper that paid for empires.", blurb: "Istanbul's Spice Bazaar was built in 1660 with the customs from Egypt, the last stop of the spice road before Europe. Cumin and coriander are the Levant's own, used since the Bronze Age; sumac, a sour red berry, sharpens salads and kebabs; cinnamon and allspice go into stews; baharat and seven-spice blend them all. Paprika and chilli came from the Americas after 1500 and Aleppo made its pepper flakes famous.",
    flavour: ["warm", "earthy", "sour"], partners: ["lamb", "chicken", "yogurt", "rice"], match: (r) => has(r.core, /cumin|coriander|paprika|sumac|cinnamon|allspice|spice/) },
  { id: "saffron", world: "middle-east", kind: "flavour", name: "Saffron & pomegranate", zh: "زعفران و انار", emoji: "🌸", area: "persia", pos: [17, 17], prop: "saffronField", rot: 0.05,
    tagline: "Persia's red gold, picked from a purple crocus at dawn.", blurb: "Saffron is the three red stigmas of a crocus, picked by hand: it takes about 150,000 flowers for a kilo, which is why it costs what it does. Persians were growing it by 500 BC and Khorasan still supplies most of the world. A pinch, ground and bloomed in hot water, colours a rice gold. Pomegranates are Persian too, in the Zoroastrian rites and on every table: fresh, as juice, or boiled to the dark molasses that sours fesenjan.",
    flavour: ["floral", "bitter-sweet", "sour"], partners: ["rice", "pomegranate", "walnuts", "rosewater"], match: (r) => has(r.core, /saffron|pomegranate/) },
  { id: "pomegranate", world: "middle-east", kind: "ingredient", name: "Pomegranates", zh: "انار", emoji: "🍎", area: "persia", pos: [30, 14], prop: "pomegranateOrchard", rot: -0.2, alias: "saffron", tagline: "", blurb: "", match: () => false },
  // --- techniques ---
  { id: "mangal", world: "middle-east", kind: "technique", name: "Skewers on the mangal", zh: "Ocakbaşı", emoji: "🍢", area: "istanbul", pos: [0, -6], prop: "kebabHouse", rot: 0.1, place: true, placeName: "Ocakbaşı",
    tagline: "Charcoal, a fan, and meat that never touches a pan.", blurb: "Kebab is Persian and Arabic for roasted meat, and skewers over coals were being cooked in Anatolia in the Bronze Age; the Ottoman army carried the mangal, a low charcoal trough, on campaign. At an ocakbaşı you sit at the counter round the fire while the usta fans the coals and turns the şiş: cubes of chicken or lamb in yogurt and pepper paste, or minced Adana on wide blades, with grilled peppers, onion in sumac, lavash and a glass of ayran.",
    partners: ["chicken", "yogurt", "paprika", "sumac", "pita"], match: (r) => has(r.techniques, /mangal|grill/) },
  { id: "spit", world: "middle-east", kind: "technique", name: "The turning spit", zh: "شاورما", emoji: "🌯", area: "levant", pos: [-14, -1], prop: "shawarmaStand", rot: 0.2, place: true, placeName: "Shawarma stand",
    tagline: "Meat stacked on a spit and shaved as it roasts, an Ottoman idea.", blurb: "The vertical spit was invented in Bursa in the 1860s as döner, turning meat, and travelled: to the Levant as shawarma (from Turkish çevirme, turning), to Greece as gyros, and by way of Lebanese migrants to Mexico as tacos al pastor. Chicken or lamb is marinated in yogurt, garlic, cumin and vinegar, stacked, and carved into a pita with toum, the whipped garlic sauce, pickles and fries. Falafel fries beside it.",
    partners: ["chicken", "garlic", "yogurt", "pita", "pickles"], match: (r) => has(r.techniques, /spit/) },
  { id: "taboon", world: "middle-east", kind: "technique", name: "The taboon oven", zh: "طابون", emoji: "🫓", area: "levant", pos: [-20, -7], prop: "bakery", rot: 0.15, place: true, placeName: "Bakery",
    tagline: "Bread slapped onto the wall of a clay oven, puffing in a minute.", blurb: "Wheat was first farmed in the Levant about 9500 BC and the taboon, a clay oven fired with dung and olive wood, has been baking flatbreads since at least 2000 BC. Pita puffs into a pocket from the steam of its own water; saj is thrown thin over a domed iron; manakish is pita spread with za'atar and oil. Breakfast comes from the same counter: shakshuka, eggs poached in a pan of tomato and pepper, brought east by Tunisian Jews in the 1950s.",
    partners: ["olive oil", "za'atar", "eggs", "tomato"], match: (r) => has(r.techniques, /taboon/) },
  { id: "mezze", world: "middle-east", kind: "technique", name: "Mezze", zh: "مزة", emoji: "🥙", area: "levant", pos: [-22, 2], prop: "mezzeHouse", rot: 0.05, place: true, placeName: "Mezze house",
    tagline: "Twenty small plates, shared slowly, with arak.", blurb: "Mezze, from the Persian maza, taste, is the Levant's way of eating: the table fills with hummus, baba ghanoush, tabbouleh, fattoush, labneh, olives, pickles, kibbeh and stuffed vine leaves before anything grilled arrives, scooped up with bread torn by hand. It grew in the cafés of Beirut and Aleppo in the 1800s around arak, the anise spirit that turns milky with water. Nothing is finished; the point is the conversation.",
    partners: ["chickpeas", "herbs", "olive oil", "pita", "lemon"], match: (r) => has(r.techniques, /mezze/) },
  // --- places ---
  { id: "bazaar", world: "middle-east", kind: "place", name: "The Grand Bazaar", zh: "Kapalıçarşı", emoji: "🏮", area: "istanbul", pos: BZ, prop: "bazaar", rot: 0, place: true, open: "reveal",
    tagline: "Sixty streets under one roof, trading since 1461.", blurb: "Mehmed the Conqueror built the first two halls in 1461, eight years after taking the city; the vaults now cover sixty-one streets and four thousand shops. Spices, lamps, carpets, tea sets, olives, nuts, dried apricots and baklava, and the tea that arrives on a swinging tray the moment you sit down.", match: () => false },
  { id: "stall-lamps", world: "middle-east", kind: "landmark", name: "Lamps & tea sets", zh: "Kandiller", emoji: "🪔", area: "istanbul", pos: [BZ[0] - 0.5, BZ[1] - 2.6], prop: "none", hitOnly: true, parent: "bazaar", alias: "tea", tagline: "", blurb: "", match: () => false },
  { id: "sweets", world: "middle-east", kind: "dish", name: "Baklava & lokum", zh: "Baklava", emoji: "🍯", area: "istanbul", pos: [BZ[0] + 4.5, BZ[1] - 2.6], prop: "none", hitOnly: true, parent: "bazaar",
    tagline: "Forty layers of pastry, pistachio and syrup.", blurb: "Baklava was perfected in the kitchens of Topkapı Palace, where in the 1600s the sultan sent trays of it to the Janissaries every Ramadan. Gaziantep's pistachios make the best; the pastry is rolled so thin you can read through it. Lokum, Turkish delight, was made by the confectioner Hacı Bekir in 1777 with starch and sugar, scented with rose or mastic.", match: () => false },
  { id: "stall-nuts", world: "middle-east", kind: "ingredient", name: "Nuts & dried fruit", zh: "Kuruyemiş", emoji: "🥜", area: "istanbul", pos: [BZ[0] - 4, BZ[1] + 2.6], prop: "none", hitOnly: true, parent: "bazaar", alias: "dates", tagline: "", blurb: "", match: () => false },
  { id: "tea", world: "middle-east", kind: "dish", name: "Tea & coffee", zh: "Çay", emoji: "🫖", area: "istanbul", pos: [BZ[0] + 1, BZ[1] + 2.6], prop: "none", hitOnly: true, parent: "bazaar",
    tagline: "Coffee came first, but Turkey drinks more tea than anyone.", blurb: "Coffee reached Istanbul from Yemen in the 1550s and the world's first coffeehouses opened here; it is boiled with sugar in a cezve and read in the grounds. Tea took over after 1920, when coffee became an import the new republic could not afford and the Black Sea coast was planted with tea gardens: brewed strong in a two-storey pot, served in tulip glasses, never with milk, and refilled until you turn the glass on its side.", match: () => false },
  { id: "stall-olives", world: "middle-east", kind: "ingredient", name: "Olives & oil", zh: "Zeytin", emoji: "🫒", area: "istanbul", pos: [BZ[0] + 6, BZ[1] + 2.6], prop: "none", hitOnly: true, parent: "bazaar", alias: "oliveLemon", tagline: "", blurb: "", match: () => false },
  { id: "teaGarden", world: "middle-east", kind: "landmark", name: "Tea garden", zh: "Çay bahçesi", emoji: "☕", area: "istanbul", pos: [26, -19], prop: "teaGarden", rot: -0.3,
    tagline: "Samovar, backgammon, a nargile and a view of the water.", blurb: "The çay bahçesi is where Istanbul sits: tea from a samovar, backgammon played fast and loud, a water pipe of apple tobacco, gulls over the Bosphorus. The whirling dervishes belong to the Mevlevi order founded after Rumi's death in 1273; their turning is a prayer, and Istanbul's lodge at Galata has held the ceremony since 1491.", match: () => false },
  { id: "simit", world: "middle-east", kind: "dish", name: "Simit", zh: "Simit", emoji: "🥨", area: "istanbul", pos: [6, -2], prop: "simitCart", rot: 0.4, placeName: "Simit cart",
    tagline: "A sesame ring, dipped in grape molasses, sold from a tray on the head.", blurb: "Simit has been sold on Istanbul's streets since at least 1525, when palace records fix its price and weight. The rings are dipped in pekmez, grape molasses, rolled in sesame and baked hard and shiny; the sellers carry them stacked on a tray balanced on the head and cry the price all day. It is eaten with white cheese and tea, and the ferries are full of people feeding pieces to the gulls.", match: () => false },
  { id: "sweetShop", world: "middle-east", kind: "dish", name: "Sweet shop", zh: "Tatlıcı", emoji: "🍬", area: "istanbul", pos: [-18, -13], prop: "sweetShop", rot: 0.3, placeName: "Tatlıcı", alias: "sweets", tagline: "", blurb: "", match: () => false },
  { id: "camels", world: "middle-east", kind: "landmark", name: "The caravan", zh: "القافلة", emoji: "🐪", area: "arabia", pos: [-24, 22], prop: "caravan", rot: 0.2,
    tagline: "The ships of the desert that carried spice, coffee and dates.", blurb: "Camels were domesticated in Arabia around 1000 BC and made the incense road possible: frankincense and myrrh north from Yemen, and later coffee, which Yemeni Sufis were drinking by the 1400s. A camel goes a week without water and its milk fed the Bedouin; its meat is still eaten at weddings. Petra, cut into the rock by the Nabataeans around 100 BC, grew rich taxing the caravans that passed.", match: () => false },
  { id: "coffee", world: "middle-east", kind: "dish", name: "Arabic coffee & the tent", zh: "قهوة عربية", emoji: "🏕️", area: "arabia", pos: [-18, 16], prop: "bedouinTent", rot: 0.15, placeName: "Bedouin tent",
    tagline: "Three cups, cardamom, and hospitality as law.", blurb: "Bedouin coffee is roasted lightly, ground with cardamom and boiled in the long-beaked dallah, then poured in small sips from the right hand: it is rude to refuse the first cup and rude to accept a fourth. Guests are owed three days' food and shelter under the goat-hair tent whoever they are. Dates come with it, and on feast days a lamb roasted whole over rice, eaten from one great dish by hand.", match: () => false },
  { id: "pilaf", world: "middle-east", kind: "dish", name: "Persian rice", zh: "چلو", emoji: "🍚", area: "persia", pos: [24, 20], prop: "pilafKitchen", rot: -0.1, placeName: "Persian kitchen",
    tagline: "Rice steamed until a golden crust forms, and fought over.", blurb: "Persians have cooked rice this way since at least the 1500s, when Safavid court cookbooks describe it: soaked, parboiled, then steamed under a cloth until the bottom crisps into tahdig, the crust everyone wants. Saffron water goes over the top, and it comes with kebab koobideh, minced lamb on wide skewers, a grilled tomato and a raw egg yolk. Sour cherries, barberries or fava beans and dill turn it into a polo.", match: () => false },
  { id: "isfahan", world: "middle-east", kind: "landmark", name: "Isfahan", zh: "اصفهان", emoji: "🕌", area: "persia", pos: [24, 3], prop: "none", hitOnly: true, parent: "pilaf",
    tagline: "Half the world, the Persians said.", blurb: "Shah Abbas made Isfahan his capital in 1598 and built the great square, the turquoise-tiled mosques and the Si-o-se-pol, the bridge of thirty-three arches, over the Zayandeh river between 1599 and 1602. Persia gave the region its cooking words, pilaf, kebab and mezze among them, and its sweet-and-sour pairings of fruit with meat.", match: () => false },
];


// ---------- the Mediterranean world ----------

const SK: [number, number] = [-16, 20];
export const MED_OBJECTS: WorldObject[] = [
  // --- ingredients ---
  { id: "saladVeg", world: "mediterranean", kind: "ingredient", name: "Tomatoes, cucumbers & peppers", zh: "Ντομάτα, αγγούρι, πιπεριά", emoji: "🥗", area: "greece", pos: [26, 17.5], prop: "saladGarden", rot: -0.1,
    tagline: "The summer garden that becomes a horiatiki.", blurb: "Cucumbers came from India by way of Persia and were eaten in Greece by 500 BC; tomatoes and peppers only arrived from the Americas in the 1500s and were treated with suspicion for two centuries. The village salad, horiatiki, was fixed in the 1960s: tomato, cucumber, green pepper, red onion and olives under a slab of feta, oregano and oil, never lettuce. Everyday salads across the sea are the same garden with lemon and whatever herb is nearest.",
    partners: ["feta", "olive oil", "oregano", "lemon"], match: (r) => has(r.core, /tomato|cucumber|pepper|lettuce/) },
  { id: "feta", world: "mediterranean", kind: "ingredient", name: "Feta, yogurt & goats", zh: "Φέτα και γιαούρτι", emoji: "🐐", area: "greece", pos: [32, -6], prop: "goatDairy", rot: 0.3,
    tagline: "Sheep and goats on the rocks, cheese in brine, yogurt strained thick.", blurb: "Feta is sheep's milk (with up to 30 % goat) cured in brine, and the Odyssey has the Cyclops making cheese much like it in the 700s BC; the name, slice, is Venetian, from the 1600s, and it has been a protected Greek name since 2002. Greek yogurt is strained through cloth until it is thick enough to hold a spoon; tzatziki mixes it with grated cucumber, garlic, dill and oil. Halloumi is the Cypriot cousin, a cheese that squeaks and grills without melting.",
    partners: ["cucumber", "garlic", "dill", "olive oil", "honey"], match: (r) => has(r.protein, /cheese|yogurt/) || has(r.core, /feta|halloumi|yogurt/) },
  { id: "olivesGr", world: "mediterranean", kind: "ingredient", name: "Olives & oil", zh: "Ελιές", emoji: "🫒", area: "greece", pos: [25, 12], prop: "oliveGroveGr", rot: 0.1,
    tagline: "Athena's gift to Athens, and the fat of the whole sea.", blurb: "The olive was domesticated in the eastern Mediterranean around 4000 BC, and the Greeks say Athena won the city by planting one on the Acropolis. Kalamata olives are cured in brine and vinegar; Cretan oil, pressed the day the fruit is picked, is the greenest. Greeks use more oil per head than anyone, about twenty litres a year: on salad, over beans, in every stew, and on bread with a pinch of salt.",
    partners: ["lemon", "oregano", "garlic", "feta"], match: (r) => has(r.core, /olive|caper/) },
  { id: "fishMed", world: "mediterranean", kind: "ingredient", name: "Fish & prawns", zh: "Pescado y gambas", emoji: "🐟", area: "spain", pos: [-17, 1], prop: "fishingPort", rot: -Math.PI / 2, place: true, placeName: "The port",
    tagline: "Landed at dawn, on the grill or in the pan by noon.", blurb: "The Phoenicians were salting Atlantic tuna at Cádiz by 800 BC and Rome's favourite sauce, garum, came from the same coast. Spain still eats more fish than any country in Europe: hake and monkfish simmered with chickpeas, sardines grilled on skewers on the beach, prawns flashed on the plancha with garlic, and salt-baked bream. Salmon is the northern guest, roasted with tomato, olives and capers.",
    partners: ["garlic", "olive oil", "lemon", "chickpeas", "tomato"], match: (r) => has(r.protein, /fish|prawn|shrimp|salmon/) },
  { id: "oranges", world: "mediterranean", kind: "ingredient", name: "Oranges & almonds", zh: "Naranjas y almendras", emoji: "🍊", area: "spain", pos: [-31, 9], prop: "orangeGrove", rot: 0.05,
    tagline: "Seville's bitter oranges and the almond blossom of February.", blurb: "The Moors planted bitter oranges along Seville's streets in the 900s for their scent, and the English turned the fruit into marmalade; the sweet orange came later, from China by way of Portugal in the 1500s. Almonds arrived earlier still, from the Levant, and blossom pink across Andalusia in February. Together they make turrón, marzipan and the almond sauces of the south, and orange goes into salads with fennel and olives.",
    partners: ["honey", "cinnamon", "olive oil"], match: (r) => has(r.core, /orange|almond/) },
  { id: "cabbage", world: "mediterranean", kind: "ingredient", name: "Cabbage & paprika", zh: "Kupus i paprika", emoji: "🥬", area: "dalmatia", pos: [16, -23], prop: "cabbageField", rot: 0.1,
    tagline: "Shredded fine, salted, and dressed with vinegar and pepper.", blurb: "Cabbage has fed the Balkans through every winter since the Romans planted it; the Croatian kupus salata is cabbage sliced hair-thin, salted and squeezed, then dressed with oil, vinegar and black pepper, and it comes with every grill. Whole heads sour in barrels for sarma in autumn. Paprika, dried and ground from the peppers the Ottomans brought in the 1500s, is the other winter colour, sweet or hot, on everything.",
    partners: ["vinegar", "black pepper", "lentils", "olive oil"], match: (r) => has(r.core, /cabbage|paprika/) },
  { id: "pulses", world: "mediterranean", kind: "ingredient", name: "Chickpeas & lentils", zh: "حمص وعدس", emoji: "🫘", area: "morocco", pos: [SK[0] - 0.5, SK[1] - 2.6], prop: "none", hitOnly: true, parent: "souk",
    tagline: "The sacks at the front of every souk.", blurb: "Lentils were among the first crops of the Fertile Crescent, farmed by 8000 BC, and chickpeas followed; both crossed the sea with the Phoenicians and Greeks. Morocco's tagines and harira soup rest on them, Spain simmers chickpeas with fish and spinach, Greece bakes them slow in clay on Sifnos, and the Balkans dress lentils with vinegar and onion. Cheap, keeping, and the protein of Lent and Ramadan alike.",
    partners: ["cumin", "olive oil", "lemon", "tomato"], match: (r) => has(r.core, /chickpea|lentil|bean/) || has(r.protein, /beans|lentils/) },
  // --- flavours ---
  { id: "spicesMed", world: "mediterranean", kind: "flavour", name: "Ras el hanout, saffron & preserved lemon", zh: "رأس الحانوت", emoji: "🧂", area: "morocco", pos: [SK[0] - 5.5, SK[1] - 2.6], prop: "none", hitOnly: true, parent: "souk",
    tagline: "The head of the shop: the merchant's best blend.", blurb: "Ras el hanout means head of the shop, the mix each spice seller is proudest of: cumin, coriander, cinnamon, ginger, turmeric, black pepper, sometimes rose petals and two dozen more. Saffron grows around Taliouine in the Atlas. Lemons are salted whole in jars for a month until the rind turns soft and sweet, and go chopped into tagines with olives. Harissa, chilli pounded with garlic and caraway, is Tunisia's gift to the whole coast.",
    flavour: ["warm", "sweet", "sour"], partners: ["chickpeas", "lamb", "couscous", "olives"], match: (r) => has(r.core, /ras el hanout|saffron|preserved lemon|cumin|paprika|harissa/) },
  // --- techniques ---
  { id: "tagine", world: "mediterranean", kind: "technique", name: "The tagine", zh: "الطاجين", emoji: "🍲", area: "morocco", pos: [7, 21], prop: "riadKitchen", rot: -0.15, place: true, placeName: "Riad kitchen",
    tagline: "A cone of clay that returns every drop of steam to the pot.", blurb: "The tagine is both the pot and what cooks in it: a shallow clay dish under a conical lid, set over charcoal, where steam rises, cools on the cone and drips back, so vegetables, chickpeas or lamb stew slowly in almost no water. Berbers were cooking this way before the Arabs arrived in the 600s. Sweet meets savoury in it: apricots or prunes with meat, honey and cinnamon, preserved lemon and olives. Couscous, steamed three times over the broth, is Friday's dish.",
    partners: ["chickpeas", "preserved lemon", "ras el hanout", "apricots", "couscous"], match: (r) => has(r.techniques, /tagine/) },
  { id: "taverna", world: "mediterranean", kind: "technique", name: "The taverna table", zh: "Ταβέρνα", emoji: "🍽️", area: "greece", pos: [27, -2.5], prop: "taverna", rot: 0.1, place: true, placeName: "Taverna",
    tagline: "Blue chairs, a vine overhead, plates that arrive as they are ready.", blurb: "A taverna is the family place with paper on the table and a vine over the yard, where the meal is a run of shared plates: a horiatiki and tzatziki first, then whatever came off the grill or out of the oven, with bread to wipe the oil. Souvlaki has been grilled on skewers since Homer; ouzo, the anise spirit, came from Lesbos in the 1800s. Greeks still cook pasta with halloumi or feta and call it their own, as they have since Byzantine times.",
    partners: ["feta", "olives", "tomato", "olive oil", "lemon"], match: (r) => has(r.techniques, /raw|pan|pot/) && r.area === "greece" },
  { id: "plancha", world: "mediterranean", kind: "technique", name: "Plancha & paella", zh: "Plancha y paella", emoji: "🥘", area: "spain", pos: [-25, 4], prop: "tapasBar", rot: 0.2, place: true, placeName: "Tapas bar",
    tagline: "A hot iron plate, a wide pan, and a plate on top of the glass.", blurb: "Tapa means lid: the slice of ham a Andalusian barman laid on a glass of sherry to keep the flies off, sometime in the 1800s, which became the small plate that comes with every drink. The plancha is a slab of hot iron for prawns, fish and chorizo in seconds; the paella is the wide, shallow pan of Valencia, where rice was planted by the Moors in the 700s and cooked outdoors over orange-wood fires with saffron. Chickpeas simmered with fish and paprika are the everyday version of the same kitchen.",
    partners: ["prawns", "chickpeas", "saffron", "paprika", "garlic"], match: (r) => has(r.techniques, /plancha/) },
  { id: "konoba", world: "mediterranean", kind: "technique", name: "The konoba", zh: "Konoba", emoji: "🔥", area: "dalmatia", pos: [-10, -21], prop: "konoba", rot: 0.1, place: true, placeName: "Konoba",
    tagline: "A stone cellar, a bell of iron over embers, salads to cut the fat.", blurb: "A konoba was the cellar where Dalmatian families kept wine and salted fish; now it is the tavern. Under the peka, an iron bell buried in embers for two hours, octopus or lamb bakes with potatoes and rosemary. Ćevapi, the small skinless sausages the Ottomans left behind, come off the grill with onion and flatbread, and there is always a cabbage salad, a lentil salad and a glass of rakija. Everything is finished with the island's oil.",
    partners: ["cabbage", "lentils", "olive oil", "rosemary", "garlic"], match: (r) => has(r.techniques, /raw|pot/) && r.area === "dalmatia" },
  // --- places ---
  { id: "souk", world: "mediterranean", kind: "place", name: "The souk", zh: "السوق", emoji: "🧺", area: "morocco", pos: SK, prop: "souk", rot: 0, place: true, open: "reveal",
    tagline: "Lanes under reed shade: spice cones, pulses, mint, olives, slippers and lamps.", blurb: "Marrakech's souks have run behind the great square since the city was founded in 1070, each trade in its own lane: the spice sellers with their cones of colour, sacks of chickpeas and lentils, mint by the armful for tea, olives in a dozen cures, then leather, carpets and lanterns deeper in.", match: () => false },
  { id: "mintTea", world: "mediterranean", kind: "dish", name: "Mint tea", zh: "أتاي", emoji: "🫖", area: "morocco", pos: [SK[0] + 4.5, SK[1] - 2.6], prop: "none", hitOnly: true, parent: "souk",
    tagline: "Gunpowder tea, a fistful of mint, a brick of sugar, poured from a height.", blurb: "Tea reached Morocco late, in the 1850s, when British merchants cut off from the Baltic by the Crimean War unloaded green gunpowder tea in Tangier. Moroccans added fresh spearmint and a great deal of sugar and made it the national drink: brewed in a silver pot, poured from high to raise a foam, three glasses, each a little sweeter. It is offered before any bargaining begins.", match: () => false },
  { id: "stall-olives-mo", world: "mediterranean", kind: "ingredient", name: "Olives", zh: "زيتون", emoji: "🫒", area: "morocco", pos: [SK[0] - 4, SK[1] + 2.6], prop: "none", hitOnly: true, parent: "souk", alias: "olivesGr", tagline: "", blurb: "", match: () => false },
  { id: "stall-slippers", world: "mediterranean", kind: "landmark", name: "Slippers & lamps", zh: "بلغة", emoji: "🪔", area: "morocco", pos: [SK[0] + 1, SK[1] + 2.6], prop: "none", hitOnly: true, parent: "souk", alias: "mintTea", tagline: "", blurb: "", match: () => false },
  { id: "jemaa", world: "mediterranean", kind: "landmark", name: "Jemaa el-Fna", zh: "جامع الفنا", emoji: "🐍", area: "morocco", pos: [-2, 18], prop: "jemaaSquare", rot: 0.1,
    tagline: "Storytellers, snake charmers, orange juice and, at dusk, a hundred kitchens.", blurb: "The square has been Marrakech's stage since the 1000s: storytellers, snake charmers, water sellers in red with brass cups, and orange juice from carts. At sunset the food stalls roll in, grilling merguez and sardines, ladling harira and snails in broth, under smoke and gas lamps. UNESCO listed the square's living culture in 2001, the first place of its kind.", match: () => false },
  { id: "flamenco", world: "mediterranean", kind: "landmark", name: "Flamenco", zh: "Flamenco", emoji: "💃", area: "spain", pos: [-30, -24], prop: "flamenco", rot: 0.2,
    tagline: "Guitar, palms and a stamping heel, from the Gitano quarters of Andalusia.", blurb: "Flamenco grew among the Gitanos of Seville, Jerez and Cádiz in the 1700s and 1800s, in the tablaos and the patios: a singer, a guitar, hands clapping the rhythm and a dancer whose heels are the drum. Sherry, aged in Jerez since the 1400s, and a plate of jamón are what come with it. UNESCO listed it in 2010.", match: () => false },
];


// ---------- the India world ----------

const CM: [number, number] = [-4, 10];
export const INDIA_OBJECTS: WorldObject[] = [
  // --- ingredients ---
  { id: "wheatNaan", world: "india", kind: "ingredient", name: "Wheat, roti & naan", zh: "गेहूँ और रोटी", emoji: "🫓", area: "punjab", pos: [-31, -9], prop: "wheatMustard", rot: 0.1,
    tagline: "The bread basket of the north, and the bread that mops up everything.", blurb: "Wheat has been grown on the Indus plain since about 7000 BC, and Punjab, the land of five rivers, still grows most of India's. Every meal in the north ends with bread: roti or chapati patted from whole wheat and puffed on a tawa, paratha stuffed with potato and fried in ghee for breakfast, and naan, leavened and slapped onto the tandoor wall, a Persian idea that reached Delhi's courts by the 1300s. The yellow mustard flowering among the wheat is winter's saag.",
    partners: ["ghee", "butter", "dal", "tandoori chicken"], match: (r) => has(r.core, /naan|roti|wheat|flour/) },
  { id: "dairyIn", world: "india", kind: "ingredient", name: "Butter, ghee, paneer & yogurt", zh: "दूध, घी और पनीर", emoji: "🥛", area: "punjab", pos: [22, -14], prop: "dairyIn", rot: 0.2,
    tagline: "The cow is sacred; its milk is in everything.", blurb: "India milks more animals than any country on earth, most of it from water buffalo, whose richer milk makes the best ghee: butter simmered until the water is gone and the solids brown, which keeps for months without a fridge and has been the cooking fat of the Vedas since 1500 BC. Yogurt, dahi, is set fresh every day and marinates tandoori meat; paneer, milk curdled with lemon and pressed, is the north's vegetarian protein. Butter chicken is named for the makhani sauce of butter and cream that Moti Mahal in Delhi invented in the 1950s.",
    partners: ["chicken", "tomato", "garam masala", "fenugreek"], match: (r) => has(r.core, /butter|cream|yogurt|paneer|ghee/) || has(r.protein, /yogurt/) },
  { id: "chickenIn", world: "india", kind: "ingredient", name: "Chicken", zh: "मुर्ग", emoji: "🐓", area: "punjab", pos: [16, -20], prop: "chickenIn",
    tagline: "Domesticated here, four thousand years ago.", blurb: "The chicken was tamed from the red junglefowl of the Indian forests around 2000 BC, and Harappan cities kept them. Marinated overnight in yogurt, lemon and spice, then roasted in a tandoor, it became tandoori chicken at Moti Mahal in Peshawar in the 1920s, brought to Delhi by Kundan Lal Gujral in 1947 after Partition; its leftovers, simmered in butter and tomato, became butter chicken. Tikka masala, chunks of the same chicken in a spiced cream sauce, is the British-Indian version, from Glasgow or Birmingham in the 1970s, depending who you ask.",
    partners: ["yogurt", "garam masala", "ginger", "garlic", "lemon"], match: (r) => has(r.protein, /chicken/) },
  { id: "lentils", world: "india", kind: "ingredient", name: "Dal: lentils & pulses", zh: "दाल", emoji: "🫘", area: "rajasthan", pos: [-22, 12], prop: "lentilField", rot: 0,
    tagline: "A dozen kinds, and one on every table every day.", blurb: "Lentils, chickpeas and mung beans came into India from the Fertile Crescent and were being farmed in the Indus valley by 2500 BC. Dal is both the pulse and the dish: split red masoor cooks in twenty minutes; yellow toor, chana and black urad take longer. It is finished with a tadka, spices sizzled in ghee and poured over, cumin and dried chilli and garlic. In Rajasthan's desert, where vegetables are scarce, dal-baati-churma, dal with baked wheat balls, is the feast.",
    partners: ["cumin", "turmeric", "garlic", "ghee", "rice"], match: (r) => has(r.core, /lentil|dal|chickpea/) || has(r.protein, /lentils/) },
  { id: "spicesIn", world: "india", kind: "flavour", name: "Spices", zh: "मसाला", emoji: "🌶️", area: "kerala", pos: [16, 17], prop: "spiceGarden", rot: 0.05,
    tagline: "Pepper, cardamom, turmeric and cinnamon, from the coast the world sailed for.", blurb: "Black pepper grew wild on the Malabar coast and Romans paid for it in gold by the first century AD; Vasco da Gama landed at Calicut in 1498 for it. Cardamom and turmeric are Indian too; cumin, coriander and cinnamon came early. Garam masala, the warm blend, is toasted and ground fresh: cumin, coriander, cardamom, cinnamon, clove and black pepper. Chilli arrived with the Portuguese after 1500 and within a century India grew more than anywhere.",
    flavour: ["warm", "pungent", "earthy"], partners: ["ginger", "garlic", "yogurt", "coconut"], match: (r) => has(r.core, /garam masala|cumin|turmeric|coriander|cardamom|chilli|fenugreek|curry leaves/) },
  { id: "coconut", world: "india", kind: "ingredient", name: "Coconut & cashews", zh: "തേങ്ങ", emoji: "🥥", area: "kerala", pos: [30, 9], prop: "coconutGrove", rot: 0.1,
    tagline: "Kerala means the land of coconuts.", blurb: "The state takes its name from kera, the coconut palm, and its cooking is built on it: fresh coconut ground with green chilli and curry leaves for chutney, coconut milk to finish a curry, coconut oil to fry in. Cashews came from Brazil with the Portuguese in the 1500s and Kerala now grows and shells much of the world's; ground, they thicken kormas and mushroom curries. Tapping the palm's flower gives toddy, drunk in the palm-leaf shacks along the backwaters.",
    partners: ["curry leaves", "mustard seed", "green chilli", "turmeric"], match: (r) => has(r.core, /coconut|cashew|nut/) || has(r.protein, /nuts/) },
  { id: "aromaticsIn", world: "india", kind: "flavour", name: "Onion, garlic, ginger & tomato", zh: "प्याज़, लहसुन, अदरक", emoji: "🧅", area: "mumbai", pos: [CM[0], CM[1] - 2.4], prop: "none", hitOnly: true, parent: "market",
    tagline: "The masala base that starts nearly every curry.", blurb: "Most curries begin the same way: onion fried slowly in ghee or oil until golden, then ginger-garlic paste, then tomato cooked down until the fat separates, then the spices. Ginger and garlic are native to South Asia; onions came in early; tomatoes arrived with the Portuguese after 1500 and took over the north's gravies only in the 1900s. Fresh coriander leaf goes on at the end.",
    flavour: ["pungent", "sweet", "sharp"], partners: ["cumin", "garam masala", "chicken", "lentils"], match: (r) => has(r.core, /onion|garlic|ginger|tomato/) },
  { id: "vegIn", world: "india", kind: "ingredient", name: "Vegetables & mushrooms", zh: "सब्ज़ी", emoji: "🍆", area: "mumbai", pos: [CM[0] - 5, CM[1] - 2.4], prop: "none", hitOnly: true, parent: "market",
    tagline: "A country where a third of people never eat meat.", blurb: "India cooks more vegetables than anyone: sabzi of aubergine, okra, cauliflower and potato dry-fried with spice, spinach blended into saag, peas in everything. Mushrooms are newer to the plate, farmed since the 1980s, and take a curry well: fried with onion and coconut in the south, with cashew cream in the north.", partners: ["turmeric", "cumin", "coconut", "cream"], match: (r) => has(r.core, /mushroom|spinach|potato|cauliflower|pea|aubergine/) },
  { id: "mango", world: "india", kind: "dish", name: "Mangoes & mithai", zh: "आम और मिठाई", emoji: "🥭", area: "mumbai", pos: [CM[0] - 3, CM[1] + 2.4], prop: "none", hitOnly: true, parent: "market",
    tagline: "The king of fruit, and sweets made of milk and sugar.", blurb: "Mangoes have grown in India for four thousand years and the Alphonso of the Konkan coast, named after a Portuguese viceroy of the 1500s, is the one people queue for in May. Mithai are the sweets: jalebi, batter piped into spirals and fried then soaked in syrup; barfi, milk cooked down with sugar; gulab jamun; and kulfi, the frozen milk of the Mughal courts of the 1500s.", match: () => false },
  { id: "chilliesIn", world: "india", kind: "flavour", name: "Chillies", zh: "मिर्च", emoji: "🌶️", area: "rajasthan", pos: [-21, 5], prop: "chilliYard", rot: 0.1, alias: "spicesIn", tagline: "", blurb: "", match: () => false },
  // --- techniques ---
  { id: "tandoor", world: "india", kind: "technique", name: "The tandoor", zh: "तंदूर", emoji: "🔥", area: "punjab", pos: [-12, -13], prop: "tandoorHouse", rot: 0.1, place: true, placeName: "Tandoor",
    tagline: "A clay oven at 480 degrees, bread on its walls and meat on skewers inside.", blurb: "Clay ovens have been dug into Indus valley floors since 2600 BC; the tandoor is the tall one, fired with charcoal, that Punjabis share in village yards. Naan is slapped wet onto its inner wall and peeled off blistered in a minute; chicken marinated in yogurt, chilli and garam masala roasts on long skewers over the coals, dripping into the fire, which is where the smoke in tandoori comes from. Delhi's Moti Mahal put the tandoor into a restaurant in 1947 and made it the north's kitchen.",
    partners: ["chicken", "yogurt", "naan", "garam masala"], match: (r) => has(r.techniques, /tandoor/) },
  { id: "dhaba", world: "india", kind: "technique", name: "The dhaba's karahi", zh: "ढाबा", emoji: "🍛", area: "punjab", pos: [6, -12], prop: "dhaba", rot: -0.1, place: true, placeName: "Dhaba",
    tagline: "Truck-stop cooking: a wide iron pan, a fierce flame, butter and cream.", blurb: "Dhabas are the roadside kitchens of the Grand Trunk Road, run for lorry drivers since the 1940s: charpoy string beds to sit on, a karahi, the wide two-handled iron pan, over a roaring burner, and food that is rich, spiced and fast. Butter chicken, chicken in tomato, butter and cream; tikka masala; dal makhani simmered overnight. Punjabi cooking is the one the world calls Indian, and it travelled from these roads to Britain's curry houses in the 1960s.",
    partners: ["chicken", "butter", "tomato", "cream", "garam masala"], match: (r) => has(r.techniques, /karahi/) },
  { id: "thali", world: "india", kind: "technique", name: "Dal & the thali", zh: "थाली", emoji: "🍽️", area: "rajasthan", pos: [-13, 3], prop: "thaliHouse", rot: 0.1, place: true, placeName: "Thali house",
    tagline: "A steel platter of little bowls: a whole balanced meal at once.", blurb: "A thali is the round platter with everything on it: dal, a vegetable, rice, roti, yogurt, pickle, a sweet, refilled until you cover the bowl with your hand. It follows Ayurveda's six tastes and the idea that a meal should hold all of them. Rajasthan's is the grandest, all vegetarian in the Jain and Marwari houses, with dal-baati and gatte, chickpea-flour dumplings, and ghee poured from a height by a server who does not take no for an answer.",
    partners: ["lentils", "roti", "yogurt", "ghee", "pickle"], match: (r) => has(r.techniques, /dal/) },
  { id: "southKitchen", world: "india", kind: "technique", name: "Coconut curry & the tawa", zh: "കറി", emoji: "🥥", area: "kerala", pos: [16, 2], prop: "keralaKitchen", rot: 0.1, place: true, placeName: "Kerala kitchen",
    tagline: "Curry leaves and mustard seed popped in coconut oil, and dosas the size of a plate.", blurb: "Southern cooking starts with a tadka of mustard seed, curry leaves and dried chilli crackling in coconut oil, and finishes with coconut, ground fresh or as milk. Rice, not wheat, is the grain: dosas of fermented rice-and-lentil batter spread paper-thin on a tawa, idlis steamed, appams lacy. A sadya, the feast, comes on a banana leaf with a dozen curries and is eaten by hand. Mushrooms, jackfruit and fish all take this treatment.",
    partners: ["coconut", "curry leaves", "mushrooms", "rice", "turmeric"], match: (r) => has(r.techniques, /coconut/) },
  // --- places ---
  { id: "market", world: "india", kind: "place", name: "Crawford Market", zh: "क्रॉफर्ड मार्केट", emoji: "🧺", area: "mumbai", pos: CM, prop: "bazaarIn", rot: 0, place: true, open: "reveal",
    tagline: "Mumbai's market since 1869: vegetables, spices, mangoes and a chai wallah.", blurb: "Built in 1869 with a clock tower and friezes by Rudyard Kipling's father, the market feeds south Mumbai: vegetables and mushrooms, the onion-garlic-ginger-tomato base, spice mounds, Alphonso mangoes in May and mithai, with cutting chai poured from a height at the corner.", match: () => false },
  { id: "stall-spices-in", world: "india", kind: "flavour", name: "Spices", zh: "मसाला", emoji: "🌶️", area: "mumbai", pos: [CM[0] + 5, CM[1] - 2.4], prop: "none", hitOnly: true, parent: "market", alias: "spicesIn", tagline: "", blurb: "", match: () => false },
  { id: "streetFood", world: "india", kind: "dish", name: "Chaat & chai at Chowpatty", zh: "चाट", emoji: "🍢", area: "mumbai", pos: [-8, 18.5], prop: "chowpatty", rot: 0.1, placeName: "Chowpatty beach",
    tagline: "Pav bhaji, bhel puri, cutting chai and kulfi on the sand.", blurb: "Chowpatty's stalls fed the mill workers of the 1850s and still feed the city at dusk: pav bhaji, mashed spiced vegetables with a buttered bun, invented for the textile workers' quick lunches in the 1850s; bhel puri, puffed rice with tamarind and chutneys; vada pav, the potato fritter in a bun, from 1966. Chai comes as cutting, a half glass; kulfi comes on a stick.", match: () => false },
  { id: "dabbawala", world: "india", kind: "landmark", name: "Dabbawalas", zh: "डब्बावाला", emoji: "🚲", area: "mumbai", pos: [8, 13], prop: "dabbawalas", rot: 0,
    tagline: "Five thousand men delivering two hundred thousand home-cooked lunches a day, since 1890.", blurb: "Every morning the dabbawalas collect tiffins, stacked steel lunch boxes, from homes across Mumbai, sort them by a code of colours and letters, carry them by train and bicycle to offices, and bring the empties back by evening. Started in 1890 for a Parsi banker who wanted his own food at work. Harvard studied their error rate: about one in six million.", match: () => false },
  { id: "backwaters", world: "india", kind: "landmark", name: "The backwaters", zh: "കായൽ", emoji: "🛶", area: "kerala", pos: [22, 10], prop: "none", hitOnly: true,
    tagline: "A thousand kilometres of lagoons and canals, travelled by houseboat.", blurb: "The kettuvallam were rice barges, planks sewn together with coir rope and thatched with palm, that carried the harvest through Kerala's lagoons; since the 1990s they have carried visitors, with a cook aboard frying karimeen, the pearl-spot fish, in banana leaf. The paddies alongside sit below sea level behind dykes, and Chinese fishing nets, brought by traders from Kublai Khan's court around 1400, still dip at Kochi.", match: () => false },
  { id: "nets", world: "india", kind: "landmark", name: "Chinese fishing nets", zh: "ചീനവല", emoji: "🎣", area: "kerala", pos: [13, 20.5], prop: "fishingNets", rot: Math.PI,
    tagline: "Cantilevered nets from Kublai Khan's traders, still working at Kochi.", blurb: "The cheena vala came to Kochi with Chinese traders around 1400, and the same design stands on the shore today: a net on a teak frame, lowered into the tide by four men on stones and counterweights, lifted every few minutes with whatever swam in. What they catch is sold on the spot and fried at the stalls behind: seer fish, prawns, and karimeen for the houseboats.", match: () => false },
  { id: "elephant", world: "india", kind: "landmark", name: "Temple elephant", zh: "ആന", emoji: "🐘", area: "kerala", pos: [24, 18], prop: "elephant", rot: -0.3,
    tagline: "Caparisoned in gold for the festival, fed rice and jaggery.", blurb: "Kerala's temples keep elephants for their festivals; at Thrissur Pooram, held since the 1790s, thirty stand in a line in golden nettipattam headdresses under silk parasols. A temple elephant eats about 200 kilos a day, palm fronds mostly, with rice and jaggery balls at feast time. The mahout's family often keeps the same animal for a lifetime.", match: () => false },
];

export const ALL_OBJECTS = [...OBJECTS, ...ITALY_OBJECTS, ...KOREA_OBJECTS, ...MEXICO_OBJECTS, ...MIDEAST_OBJECTS, ...MED_OBJECTS, ...INDIA_OBJECTS];
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
  { id: "mexico", name: "Mexico", cuisines: ["Mexican"], pos: [-40, 10], size: 6, color: "#e0a06a", emoji: ["🌽", "🌵", "🥑", "🌮"], built: true, seed: 12 },
  { id: "italy", name: "Italy", cuisines: ["Italian"], pos: [-8, -4], size: 6.5, color: "#a8c07a", emoji: ["🍝", "🍅", "🫒", "🧀"], built: true, seed: 13 },
  { id: "central-europe", name: "Central Europe", cuisines: ["British", "Hungarian", "Georgian", "German", "Swiss", "French", "Swedish"], pos: [-12, -26], size: 7, color: "#93b48a", emoji: ["🥧", "🍲", "🥔", "🧈"], built: false, seed: 14 },
  { id: "mediterranean", name: "Mediterranean", cuisines: ["Mediterranean", "Greek", "Spanish", "North African"], pos: [-20, 14], size: 6, color: "#b9cf94", emoji: ["🫒", "🍋", "🐟", "🧆"], built: true, seed: 15 },
  { id: "middle-east", name: "Middle East", cuisines: ["Middle Eastern", "Lebanese", "Turkish"], pos: [10, 8], size: 6, color: "#e2cf9b", emoji: ["🧆", "🍢", "🫓", "🌿"], built: true, seed: 16 },
  { id: "india", name: "India", cuisines: ["Indian"], pos: [22, 20], size: 6, color: "#e0b25e", emoji: ["🍛", "🫚", "🌶️", "🫓"], built: true, seed: 17 },
  { id: "china", name: "China", cuisines: ["Chinese"], pos: [26, -8], size: 10, color: "#c9a26a", emoji: ["🌶️", "🥟", "🍜", "🏮"], built: true, seed: 18 },
  { id: "southeast-asia", name: "Southeast Asia", cuisines: ["Thai", "Vietnamese"], pos: [38, 16], size: 6, color: "#9cc27f", emoji: ["🥥", "🌿", "🍜", "🦐"], built: false, seed: 19 },
  { id: "korea", name: "Korea", cuisines: ["Korean"], pos: [44, -16], size: 6, color: "#d7a7a0", emoji: ["🥬", "🍚", "🔥", "🥢"], built: true, seed: 20 },
  { id: "japan", name: "Japan", cuisines: ["Japanese"], pos: [52, -4], size: 4.5, color: "#e8b8c4", emoji: ["🍣", "🍙", "🍵", "🐟"], built: false, seed: 21 },
];

export const SPICE = ["mild", "a little heat", "spicy", "very spicy"];
