// The Sichuan canon for the Notion Recipes database: identity, context, a home version, the practical recipe
// and an estimated nutrition table per serving, plus one row per ingredient in Recipe Ingredients.
//
//   node scripts/recipes/sichuan.mjs --dry      print every page and its nutrition, write nothing
//   node scripts/recipes/sichuan.mjs            create the new pages, rewrite the existing ones, rebuild ingredient rows
//
// Nutrition is a per-100 g table (USDA-style figures, rounded) times the grams in the recipe, divided by servings;
// `eat` is the share that actually ends up in the mouth (whole dried chillies, strained peppercorns, oil left in the bowl).

import { readFileSync } from "node:fs";

const DRY = process.argv.includes("--dry");
const env = Object.fromEntries(readFileSync(new URL("../../.env", import.meta.url), "utf8").split("\n").filter((l) => l.includes("=")).map((l) => l.split("=").map((s) => s.trim())));
const H = { Authorization: `Bearer ${env.NOTION_TOKEN}`, "Content-Type": "application/json", "Notion-Version": "2022-06-28" };
const RECIPES_DB = "03d739d55e034d268a34fc4795b8dd96";
const INGREDIENTS_DB = "8187fb2bbc864f5f8a8f69c7aeb9cb1a";
const RECIPES_DS = "3f0c1882-7d42-41a3-b5cb-47cd958217fb";

// ---------- nutrients per 100 g: kcal, protein, carbs, fat, saturated fat, fibre, sugar, sodium mg ----------
const N = {
  "pork belly": [518, 9.3, 0, 53, 19.3, 0, 0, 32],
  "pork mince": [263, 17, 0, 21, 7.7, 0, 0, 60],
  "pork loin": [143, 21, 0, 6, 2.1, 0, 0, 55],
  "chicken thigh": [121, 19.7, 0, 4.7, 1.3, 0, 0, 86],
  "chicken thigh skin-on": [211, 17, 0, 15, 4.3, 0, 0, 80],
  beef: [150, 21, 0, 7, 2.9, 0, 0, 55],
  "egg white": [52, 11, 0.7, 0.2, 0, 0, 0.7, 166],
  egg: [143, 12.6, 0.7, 9.5, 3.1, 0, 0.4, 142],
  "soft tofu": [55, 4.8, 1.9, 2.7, 0.4, 0.2, 0.5, 8],
  eggplant: [25, 1, 5.9, 0.2, 0, 3, 3.5, 2],
  "green beans": [31, 1.8, 7, 0.1, 0, 2.7, 3.3, 6],
  potato: [77, 2, 17, 0.1, 0, 2.2, 0.8, 6],
  cucumber: [15, 0.7, 3.6, 0.1, 0, 0.5, 1.7, 2],
  "wood ear dried": [284, 9.3, 73, 0.7, 0.1, 70, 0, 35],
  carrot: [41, 0.9, 9.6, 0.2, 0, 2.8, 4.7, 69],
  celery: [14, 0.7, 3, 0.2, 0, 1.6, 1.3, 80],
  "bean sprouts": [30, 3, 5.9, 0.2, 0, 1.8, 4.1, 6],
  "napa cabbage": [13, 1.2, 2.2, 0.2, 0, 1.2, 1.2, 9],
  "bok choy": [13, 1.5, 2.2, 0.2, 0, 1, 1.2, 65],
  scallion: [32, 1.8, 7.3, 0.2, 0, 2.6, 2.3, 16],
  "garlic sprouts": [40, 2, 8, 0.3, 0, 2.5, 2, 15],
  "green pepper": [20, 0.9, 4.6, 0.2, 0, 1.7, 2.4, 3],
  garlic: [149, 6.4, 33, 0.5, 0.1, 2.1, 1, 17],
  ginger: [80, 1.8, 18, 0.8, 0.2, 2, 1.7, 13],
  cilantro: [23, 2.1, 3.7, 0.5, 0, 2.8, 0.9, 46],
  "dried chilli": [324, 12, 70, 6, 1, 28, 41, 30],
  "chilli flakes": [324, 12, 70, 6, 1, 28, 41, 30],
  "sichuan pepper": [250, 7, 50, 8, 1, 30, 0, 20],
  "white pepper": [296, 10, 69, 2, 0.6, 26, 0, 5],
  peanuts: [567, 26, 16, 49, 6.8, 8.5, 4, 18],
  "sesame seeds": [573, 17, 26, 50, 7, 14, 0.3, 11],
  "sesame paste": [595, 17, 21, 53, 7.5, 5.5, 0.5, 12],
  oil: [884, 0, 0, 100, 7.4, 0, 0, 0],
  "chilli oil": [884, 0.5, 1, 98, 10, 0.5, 0, 5],
  "sesame oil": [884, 0, 0, 100, 14, 0, 0, 0],
  "light soy": [53, 8, 4.9, 0, 0, 0.8, 0.4, 5600],
  "dark soy": [60, 6, 8, 0, 0, 0.8, 4, 5000],
  doubanjiang: [100, 5, 12, 4, 0.5, 3, 3, 6500],
  "sweet bean sauce": [150, 4, 30, 1, 0.2, 2, 15, 3000],
  douchi: [200, 12, 20, 5, 1, 5, 2, 5000],
  "ya cai": [60, 3, 10, 0.5, 0, 4, 2, 4000],
  "pickled chilli": [30, 1, 6, 0.3, 0, 2, 2, 2500],
  "black vinegar": [20, 0.5, 4, 0, 0, 0, 1, 600],
  "rice vinegar": [18, 0, 0.7, 0, 0, 0, 0, 2],
  shaoxing: [100, 0.3, 4, 0, 0, 0, 1, 500],
  sugar: [387, 0, 100, 0, 0, 0, 100, 0],
  "brown sugar": [380, 0, 98, 0, 0, 0, 97, 28],
  cornstarch: [381, 0.3, 91, 0, 0, 0.9, 0, 9],
  salt: [0, 0, 0, 0, 0, 0, 0, 38758],
  stock: [6, 1, 0.5, 0.2, 0, 0, 0, 250],
  water: [0, 0, 0, 0, 0, 0, 0, 0],
  "dried noodles": [371, 12, 74, 1.5, 0.3, 3, 1, 20],
  flour: [364, 10, 76, 1, 0.2, 2.7, 0.3, 2],
  "soy beans dried": [446, 36, 30, 20, 2.9, 9, 7, 2],
};
const CAT = {
  "pork belly": "meat & fish", "pork mince": "meat & fish", "pork loin": "meat & fish", "chicken thigh": "meat & fish", "chicken thigh skin-on": "meat & fish", beef: "meat & fish",
  egg: "egg", "egg white": "egg", "soft tofu": "plant protein", "soy beans dried": "plant protein",
  eggplant: "vegetable", "green beans": "vegetable", potato: "vegetable", cucumber: "vegetable", carrot: "vegetable", celery: "vegetable", "bean sprouts": "vegetable", "napa cabbage": "vegetable", "bok choy": "vegetable", scallion: "vegetable", "garlic sprouts": "vegetable", "green pepper": "vegetable", garlic: "vegetable", ginger: "vegetable", cilantro: "vegetable", "wood ear dried": "pantry",
  "dried chilli": "spice", "chilli flakes": "spice", "sichuan pepper": "spice", "white pepper": "spice", salt: "spice",
  peanuts: "pantry", "sesame seeds": "pantry", "sesame paste": "pantry", oil: "pantry", "chilli oil": "pantry", "sesame oil": "pantry", "light soy": "pantry", "dark soy": "pantry", doubanjiang: "pantry", "sweet bean sauce": "pantry", douchi: "pantry", "ya cai": "pantry", "pickled chilli": "pantry", "black vinegar": "pantry", "rice vinegar": "pantry", shaoxing: "pantry", sugar: "pantry", "brown sugar": "pantry", cornstarch: "pantry", stock: "pantry", water: "other", "dried noodles": "pantry", flour: "bakery",
};

/** an ingredient line: [display name, quantity text, nutrient key, grams, eat share, essential] */
const I = (name, qty, key, g, eat = 1, essential = false) => ({ name, qty, key, g, eat, essential });
const E = (name, qty, key, g, eat = 1) => I(name, qty, key, g, eat, true);   // an essential, the ones that make the dish

// ---------- the recipes ----------
export const RECIPES = [
  {
    id: "cc9ed737-40c0-4fe8-bfb8-f144095ce03a",   // existing page: rewritten in place
    name: "Mapo Tofu (麻婆豆腐)", icon: "🌶️", source: "https://thewoksoflife.com/ma-po-tofu-real-deal/",
    course: "Main", effort: "medium", method: "Pan", prep: 15, cook: 15, servings: 2, carb: "low",
    mainIngredient: ["Pork", "Vegetarian"], protein: ["pork", "tofu"], plant: ["tofu", "garlic", "ginger", "chilli", "green onion", "soy sauce"], tags: ["quick", "high_protein", "comfort", "husband_friendly"],
    spice: "🌶️🌶️🌶️ Hot and numbing. The chilli oil and the ground Sichuan pepper on top are the dials: halve both for a gentle version, the doubanjiang alone is only medium.",
    identity: "Soft tofu braised in a red, glossy sauce of Pixian chilli bean paste, fermented black beans and minced pork, finished with a dusting of ground Sichuan pepper. It should be 麻 (numbing), 辣 (hot), 烫 (scalding), 香 (aromatic), 酥 (crisp pork), 嫩 (tender tofu) and 鲜 (savoury): the seven words Chengdu cooks use to judge it.",
    context: "Named for the pockmarked (麻) grandmother (婆) Chen who ran a small restaurant by the Wanfu bridge north of Chengdu in the 1860s, cooking tofu for the porters and oil carriers who passed with their loads. They brought the beef and the oil; she supplied the tofu and the fire. Chen Mapo Doufu still trades under her name. It is the dish that made doubanjiang famous, and the first thing most people cook when they fall for Sichuan food.",
    version: "Soft tofu, not silken: silken collapses when you stir. I blanch it in salted water first so it seasons from inside and holds its shape. Pork mince fried until it really crackles is what gives the sauce body, and I thicken in two or three small additions of slurry rather than one, so it clings without turning to glue. Ground Sichuan pepper goes on at the table, never in the pan, and the garlic chives go in at the very end. Everything else can be measured while the tofu blanches, so this is a 30-minute dinner with rice.",
    groups: [
      ["Tofu & pork", [E("Soft tofu", "500 g, 2 cm cubes", "soft tofu", 500), E("Pork mince (or beef, the Chengdu original)", "100 g", "pork mince", 100), I("Salt", "1 tsp, for the blanching water", "salt", 1, 0.3)]],
      ["The red base", [E("Pixian doubanjiang (chilli bean paste)", "1½ tbsp", "doubanjiang", 25), E("Fermented black beans (douchi), rinsed and lightly crushed", "1 tsp", "douchi", 5), I("Ground chilli or chilli flakes", "1 tsp", "chilli flakes", 3), I("Garlic, minced", "3 cloves", "garlic", 10), I("Ginger, minced", "1 tbsp", "ginger", 10), I("Neutral oil", "3 tbsp", "oil", 40)]],
      ["Liquid & seasoning", [I("Chicken or pork stock (or water)", "200 ml", "stock", 200), I("Shaoxing wine", "1 tbsp", "shaoxing", 15), I("Light soy sauce", "1 tsp", "light soy", 5), I("Sugar", "½ tsp", "sugar", 2), I("Cornstarch", "2 tsp, mixed with 2 tbsp water", "cornstarch", 6)]],
      ["To finish", [E("Sichuan pepper, freshly ground", "½–1 tsp", "sichuan pepper", 2), I("Chilli oil", "1 tbsp (optional)", "chilli oil", 14), I("Garlic chives or scallion greens", "3 stalks, 3 cm lengths", "scallion", 30)]],
    ],
    steps: [
      "Bring a pan of water to a simmer with the salt. Slide in the tofu cubes and keep them barely simmering for 3 minutes while you prepare everything else. Drain gently.",
      "Heat 1 tbsp of the oil in a wok over high heat and fry the pork mince, pressing and breaking it up, until the liquid has gone and the bits are brown and crisp, 4–5 minutes. Scoop out and set aside.",
      "Lower the heat to medium, add the rest of the oil, then the doubanjiang. Stir for a minute until the oil turns red and it smells toasty. Add the black beans, chilli, garlic and ginger and stir for 30 seconds.",
      "Pour in the stock, wine, soy sauce and sugar and bring to the boil. Add the tofu and the pork, push gently with the back of the spoon so nothing breaks, and simmer 3 minutes so the tofu takes on the sauce.",
      "Stir the slurry and add a third of it, shaking the wok rather than stirring. Wait 20 seconds, add more, and stop when the sauce coats the tofu and looks glossy.",
      "Add the chives and turn once. Tip into a warmed bowl, pour over the chilli oil and dust with the ground Sichuan pepper. Serve at once with plain rice.",
    ],
    subs: "Firm tofu works but braise a minute longer. No douchi: add ½ tsp more doubanjiang and a splash of dark soy. Beef mince instead of pork is the older Chengdu way. Vegetarian: leave out the meat and fry 60 g finely chopped shiitake until crisp instead.",
    storage: "Best the moment it is made. Keeps 2 days in the fridge; reheat gently in a pan with a spoon of water, it does not freeze.",
  },
  {
    id: "3d695c6d-26b4-8118-bee8-eaa7e34f8dca",
    name: "Kung Pao Chicken (宫保鸡丁)", icon: "🥜", source: "https://redhousespice.com/kung-pao-chicken/",
    course: "Main", effort: "medium", method: "Pan", prep: 20, cook: 10, servings: 2, carb: "medium",
    mainIngredient: ["Chicken"], protein: ["chicken", "nuts"], plant: ["garlic", "ginger", "scallion", "chilli", "vinegar", "soy sauce", "sugar", "nuts"], tags: ["quick", "high_protein", "husband_friendly", "busy_day"],
    spice: "🌶️🌶️ Medium. The dried chillies scent the oil and are pushed aside on the plate; the tingle comes from the whole Sichuan pepper. Use 5 chillies for a mild version.",
    identity: "Cubes of chicken thigh, velveted and flash-fried with dried chillies, whole Sichuan pepper, garlic, ginger and scallion whites, then glossed with a sauce that is sweet, sour and savoury in the same mouthful, and finished with crisp peanuts. Sichuan cooks file it under 荔枝味, lychee flavour: sweet and sour in balance, with the smoky note of chillies fried just to the edge of burning.",
    context: "Named after Ding Baozhen, governor of Sichuan in the 1870s, whose court title was Gongbao, palace guardian. The story says his kitchen made it for guests and the dish took his title. It was banned in name during the Cultural Revolution as feudal, and survived by being called fast-fried chicken cubes. Abroad it became the sticky, syrupy 'kung pao' of takeaways; at home in Chengdu it is drier, sharper and far more fragrant.",
    version: "Thigh, always: breast goes dry in the ten seconds the sauce needs. The sauce is mixed in a cup before the wok goes on so the last minute is only pouring. I fry the peanuts first in the same oil and take the chillies out the moment they darken, because burnt chilli is bitter. Scallion in chunky white pieces, not rings, is the tell of a proper version. If I have it I use Chinkiang vinegar; the sweetness should be obvious but the sourness must answer it.",
    groups: [
      ["Chicken & marinade", [E("Boneless chicken thigh, 2 cm cubes", "350 g", "chicken thigh", 350), I("Light soy sauce", "1 tsp", "light soy", 5), I("Shaoxing wine", "1 tsp", "shaoxing", 5), I("Cornstarch", "1 tsp", "cornstarch", 3), I("Water", "1 tbsp", "water", 15)]],
      ["Sauce, mixed in a cup", [E("Sugar", "1½ tbsp", "sugar", 18), E("Chinkiang black vinegar", "1½ tbsp", "black vinegar", 22), I("Light soy sauce", "1 tbsp", "light soy", 15), I("Dark soy sauce", "½ tsp", "dark soy", 2.5), I("Shaoxing wine", "1 tsp", "shaoxing", 5), I("Cornstarch", "1 tsp", "cornstarch", 3), I("Stock or water", "2 tbsp", "stock", 30)]],
      ["Wok", [E("Dried chillies, snipped in half, seeds shaken out", "10–12", "dried chilli", 10, 0.2), E("Whole Sichuan pepper", "1 tsp", "sichuan pepper", 2, 0.5), I("Garlic, sliced", "3 cloves", "garlic", 10), I("Ginger, sliced", "1 tbsp", "ginger", 10), E("Scallion whites, 2 cm chunks", "4 stalks", "scallion", 40), E("Raw skinless peanuts", "60 g", "peanuts", 60), I("Neutral oil", "2½ tbsp", "oil", 32)]],
    ],
    steps: [
      "Mix the chicken with its marinade and leave 15 minutes. Stir the sauce ingredients together in a cup until the sugar dissolves.",
      "Heat the oil in a wok over medium heat and fry the peanuts, stirring, until pale gold, about 2 minutes. Lift out with a slotted spoon.",
      "Turn the heat to high. Add the chillies and Sichuan pepper and fry 20–30 seconds until the chillies darken a shade and smell smoky. Do not let them blacken.",
      "Add the chicken in one layer, leave it 30 seconds to colour, then stir-fry until the pieces are white outside, about 2 minutes.",
      "Add the garlic, ginger and scallion whites and toss for a minute until the chicken is just cooked through.",
      "Give the sauce a stir, pour it around the edge of the wok and toss for 20–30 seconds until it thickens and coats everything. Add the peanuts, toss once, and serve immediately with rice.",
    ],
    subs: "Cashews for peanuts. Rice vinegar plus a teaspoon of dark soy stands in for Chinkiang. No whole Sichuan pepper: add ½ tsp ground at the end. Pork loin or firm tofu (fried first) instead of chicken.",
    storage: "Eat straight away; the peanuts soften and the chicken tightens on reheating. Leftovers keep a day in the fridge and are fine cold in a lunchbox.",
  },
  {
    id: "3d695c6d-26b4-8178-93d0-edd89d8e0624",
    name: "Twice-Cooked Pork (回锅肉)", icon: "🥓", source: "https://blog.themalamarket.com/chengdu-challenge-8-twice-cooked-pork-hui-guo-rou/",
    course: "Main", effort: "medium", method: "Pan", prep: 15, cook: 40, servings: 3, carb: "low",
    mainIngredient: ["Pork"], protein: ["pork"], plant: ["garlic", "ginger", "chilli", "soy sauce", "sugar"], tags: ["comfort", "husband_friendly", "batchable"],
    spice: "🌶️🌶️ Medium and deeply savoury rather than hot; the doubanjiang carries the heat. Leave out the dried chillies for a mild plate.",
    identity: "Pork belly simmered whole until just cooked, chilled, sliced paper-thin, then returned to the wok until the slices curl into 'lamp nests' and their fat runs clear, and tossed with chilli bean paste, sweet bean sauce, fermented black beans and green garlic. The name means 'back-in-the-pot meat'. In Sichuan it is called the first among home dishes, 川菜之首.",
    context: "It began as an offering: pork was boiled plain for the ancestors' altar, and the family got it back afterwards and had to make it delicious, so it went into the wok with the pastes from the crock. Every Sichuan household has a version and a strong opinion about the vegetable; green garlic (蒜苗) is Chengdu's, but leeks, green peppers, cabbage and even sweet flatbread turn up. It is the dish people from Sichuan say they miss first when they leave.",
    version: "I boil the belly the day before, or use the time the rice needs; cold pork slices thinner. The slices must have skin, fat and lean in every piece, so I buy a flat, well-layered piece and never a lean loin. The first fry is the whole point: medium heat, patience, let the fat render and the edges curl, then pour off all but a spoon of it before the pastes go in, or the dish is greasy. Leeks are what I can buy; when I find green garlic it is better.",
    groups: [
      ["Pork & poaching", [E("Pork belly, skin on, one flat piece", "350 g", "pork belly", 350, 0.85), I("Ginger, sliced", "3 slices", "ginger", 8, 0), I("Scallion", "1, knotted", "scallion", 10, 0), I("Shaoxing wine", "1 tbsp", "shaoxing", 15, 0.2), I("Whole Sichuan pepper", "½ tsp", "sichuan pepper", 1, 0)]],
      ["Sauces", [E("Pixian doubanjiang (chilli bean paste)", "1½ tbsp", "doubanjiang", 25), E("Sweet bean sauce (tianmianjiang)", "2 tsp", "sweet bean sauce", 12), I("Fermented black beans (douchi)", "1 tsp", "douchi", 5), I("Light soy sauce", "1 tsp", "light soy", 5), I("Sugar", "1 tsp", "sugar", 4)]],
      ["Vegetables & wok", [E("Green garlic (蒜苗) or thin leeks, cut on the diagonal", "150 g", "garlic sprouts", 150), I("Green pepper, in chunks (optional)", "1 small", "green pepper", 80), I("Dried chillies, halved", "3", "dried chilli", 3, 0.3), I("Neutral oil", "1 tbsp", "oil", 14)]],
    ],
    steps: [
      "Put the pork in a pot with cold water to cover, the ginger, scallion, wine and Sichuan pepper. Bring to the boil, skim, then simmer gently 20–25 minutes until a chopstick goes in with a little resistance and the juices run clear. Lift out and cool; chill at least an hour, or freeze 30 minutes.",
      "Slice the pork across the layers as thinly as you can, 2–3 mm, each slice with skin, fat and meat. Stir the sweet bean sauce, soy and sugar together.",
      "Heat the oil in a wok over medium heat and lay in the pork slices. Fry, turning now and then, 4–6 minutes, until the fat is translucent, the edges curl and the pan is shining with rendered fat. Spoon off all but about a tablespoon.",
      "Push the pork up the side. Add the doubanjiang and dried chillies to the fat and stir a minute until the oil is red and fragrant, then the black beans.",
      "Bring the pork back down, add the sweet bean mixture and toss to coat every slice. Add the green pepper and toss a minute.",
      "Add the green garlic or leeks and stir-fry just until they soften, about a minute; they should keep some bite. Serve with lots of rice.",
    ],
    subs: "Leeks, scallions or a wedge of cabbage instead of green garlic. Hoisin, thinned, for sweet bean sauce. Pork shoulder with a good fat cap if belly is not available, though it curls less.",
    storage: "The boiled belly keeps 3 days in the fridge or 2 months frozen, so boil two pieces. The finished dish reheats well in a hot pan and is better than most dishes on the second day.",
  },
  {
    id: "3d695c6d-26b4-8148-82fa-d10682e45427",
    name: "Fish-Fragrant Eggplant (鱼香茄子)", icon: "🍆", source: "https://thewoksoflife.com/fish-fragrant-eggplant-yuxiang-qiezi/",
    course: "Main", effort: "medium", method: "Pan", prep: 20, cook: 15, servings: 2, carb: "medium",
    mainIngredient: ["Vegetables", "Pork"], protein: ["pork"], plant: ["eggplant", "garlic", "ginger", "scallion", "chilli", "vinegar", "sugar", "soy sauce"], tags: ["comfort", "husband_friendly"],
    spice: "🌶️🌶️ Medium. Pickled chillies and doubanjiang give a rounded, sour heat rather than a sharp one; use one or the other for mild.",
    identity: "Long Chinese eggplants fried until creamy, then tossed in the yuxiang sauce: pickled chilli or chilli bean paste with plenty of garlic, ginger and scallion, balanced by sugar and black vinegar. There is no fish; 'fish-fragrant' means the seasonings Sichuan cooks once used for fish. The eggplant should collapse into the sauce like custard, not sit in it.",
    context: "Yuxiang is one of the 24 official flavour types of Sichuan cooking, and the one that best shows its balance: hot, sour, sweet, salty and aromatic all at once, with none allowed to win. It grew out of the pickled-chilli crocks kept in every Sichuan kitchen, where chillies were preserved with the fish that flavoured the brine. Eggplant is the vegetarian face of the flavour; shredded pork is the other.",
    version: "I salt the eggplant for 15 minutes and squeeze it, which halves the oil it drinks, then shallow-fry rather than deep-fry. A little pork mince fried crisp first makes it a proper main with rice; without it it is a fine side. The sauce is the sugar-vinegar pair in equal measure with the soy and a splash of stock, mixed before the wok is hot. Add the scallion at the end so the plate smells of it.",
    groups: [
      ["Eggplant", [E("Chinese or Japanese eggplants, batons 6 cm long", "500 g (about 2 long ones)", "eggplant", 500), I("Salt, for salting the eggplant", "1 tsp", "salt", 6, 0.3), I("Neutral oil, for shallow-frying", "4 tbsp", "oil", 54, 0.65)]],
      ["Aromatics & paste", [I("Pork mince (optional)", "80 g", "pork mince", 80), E("Pixian doubanjiang", "1 tbsp", "doubanjiang", 17), E("Pickled red chillies (泡椒), minced", "1 tbsp", "pickled chilli", 15), I("Garlic, minced", "4 cloves", "garlic", 12), I("Ginger, minced", "1 tbsp", "ginger", 12), I("Scallions, sliced", "3", "scallion", 30)]],
      ["Sauce, mixed in a cup", [E("Sugar", "1 tbsp", "sugar", 12), E("Chinkiang black vinegar", "1 tbsp", "black vinegar", 15), I("Light soy sauce", "1 tbsp", "light soy", 15), I("Shaoxing wine", "1 tbsp", "shaoxing", 15), I("Stock or water", "100 ml", "stock", 100), I("Cornstarch", "1 tsp", "cornstarch", 3)]],
    ],
    steps: [
      "Toss the eggplant batons with the salt and leave 15 minutes. Squeeze handfuls firmly and pat dry. Mix the sauce ingredients in a cup.",
      "Heat the oil in a wok over high heat and fry the eggplant in two batches, turning, until browned and soft, 4–5 minutes a batch. Drain on a rack or paper; pour the oil out of the wok, leaving 1 tbsp.",
      "If using pork, fry it in the wok over high heat until crisp. Lower the heat to medium, add the doubanjiang and pickled chillies and stir a minute until the oil is red.",
      "Add the garlic and ginger and stir 30 seconds. Return the eggplant, pour in the sauce and simmer 1–2 minutes, turning gently, until the sauce thickens and clings.",
      "Scatter in the scallions, toss once, and serve with rice.",
    ],
    subs: "Globe eggplant works if peeled in stripes and cut smaller. All doubanjiang and a squeeze more vinegar if you have no pickled chillies. Leave the pork out and add fried shiitake for a vegetarian main.",
    storage: "Keeps 2 days in the fridge and is good at room temperature the next day, the way Sichuan families eat it in summer. Does not freeze.",
  },
  {
    id: "3e98be51-a57e-4147-ac3d-2f3f3b047a90",   // existing page: rewritten in place
    name: "Dan Dan Noodles (担担面)", icon: "🍜", source: "https://www.chinasichuanfood.com/dan-dan-noodles/",
    course: "Main", effort: "medium", method: "Pot", prep: 15, cook: 20, servings: 2, carb: "high",
    mainIngredient: ["Pork", "Pasta"], protein: ["pork", "nuts"], plant: ["scallion", "garlic", "chilli", "sesame", "soy sauce", "vinegar"], tags: ["comfort", "husband_friendly", "quick"],
    spice: "🌶️🌶️ Medium-hot. The chilli oil is the whole heat; a tablespoon per bowl instead of one and a half makes it mild, and the Sichuan pepper can be halved.",
    identity: "Thin wheat noodles in a small bowl over a sauce of chilli oil, sesame paste, soy, black vinegar and ground Sichuan pepper, topped with pork mince fried crisp with ya cai, the Yibin preserved mustard green. You mix it at the table until every strand is red. In Chengdu it is nearly dry; the soupy, peanut-buttery version is a Hong Kong and American descendant.",
    context: "Named for the carrying pole (担, dan) of the hawkers who sold it through Chengdu and Zigong in the 1840s, a stove and a pot at one end and bowls and sauces at the other. Portions were tiny, a few mouthfuls, because it was a snack between meals, and good stalls still serve it in small bowls so you can order two. It is the street food that made Sichuan pepper and chilli oil a pair.",
    version: "The topping is the part worth care: pork mince fried past brown until it crackles, then the ya cai in the same fat. I mix the sauce in the bottom of each bowl, add a spoon or two of hot noodle water to loosen it, and drop the noodles straight from the pot, wet, so the sauce spreads. Fresh thin noodles if I can get them, otherwise dried wheat noodles cooked a minute short. Blanched greens in the same water, and crushed peanuts on top.",
    groups: [
      ["Pork topping", [E("Pork mince, with some fat", "150 g", "pork mince", 150), E("Ya cai (Sichuan preserved mustard greens)", "40 g", "ya cai", 40), I("Shaoxing wine", "1 tbsp", "shaoxing", 15), I("Light soy sauce", "2 tsp", "light soy", 10), I("Dark soy sauce", "½ tsp", "dark soy", 2.5), I("Neutral oil", "1 tbsp", "oil", 14)]],
      ["Bowl sauce (for 2 bowls)", [E("Chilli oil, with its sediment", "2–3 tbsp", "chilli oil", 28), E("Chinese sesame paste", "2 tbsp", "sesame paste", 32), I("Light soy sauce", "2 tbsp", "light soy", 30), I("Chinkiang black vinegar", "2 tsp", "black vinegar", 10), I("Sugar", "2 tsp", "sugar", 8), I("Garlic, minced", "2 cloves", "garlic", 6), E("Sichuan pepper, freshly ground", "½ tsp", "sichuan pepper", 1), I("Hot stock or noodle water", "about 60 ml per bowl", "stock", 120)]],
      ["Noodles & toppings", [E("Thin dried wheat noodles (or 280 g fresh)", "180 g", "dried noodles", 180), I("Bok choy or other greens", "100 g", "bok choy", 100), I("Roasted peanuts, crushed", "20 g", "peanuts", 20), I("Scallion greens, sliced", "2", "scallion", 20)]],
    ],
    steps: [
      "Heat the oil in a wok over high heat and fry the pork mince, breaking it up, until the water has gone and it crackles and browns, 5–6 minutes. Add the wine, both soy sauces and the ya cai and fry another 2 minutes until dry and fragrant. Set aside.",
      "Divide the chilli oil, sesame paste, soy, vinegar, sugar, garlic and Sichuan pepper between two bowls and stir each into a loose paste.",
      "Boil a big pot of water. Cook the noodles until just tender, adding the greens for the last minute. Ladle 60 ml of the noodle water into each bowl and stir the sauce loose.",
      "Lift the noodles straight into the bowls, lay the greens beside them and pile the pork on top. Finish with peanuts and scallion. Mix thoroughly at the table before the first bite.",
    ],
    subs: "Tahini plus a teaspoon of sesame oil for sesame paste. Chopped pickled mustard greens (zha cai) or Tianjin preserved vegetable for ya cai. Spaghettini stands in for the noodles in a pinch.",
    storage: "The topping keeps 4 days in the fridge and freezes; make double. Sauce bowls can be mixed hours ahead. Cook noodles only to order.",
  },
  {
    id: "3d695c6d-26b4-81e3-952e-ff38cf2681ef",
    name: "Water-Boiled Beef (水煮牛肉)", icon: "🥩", source: "https://redhousespice.com/sichuan-boiled-beef/",
    course: "Main", effort: "hard", method: "Pot", prep: 25, cook: 15, servings: 2, carb: "low",
    mainIngredient: ["Beef", "Vegetables"], protein: ["beef", "eggs"], plant: ["garlic", "ginger", "scallion", "chilli", "bean sprouts", "celery", "cabbage", "soy sauce"], tags: ["high_protein", "low_carb", "comfort"],
    spice: "🌶️🌶️🌶️ Hot and strongly numbing. The heat is in the finishing oil: use half the chilli flakes and Sichuan pepper on top for medium, and the broth alone is mild.",
    identity: "Thin slices of beef, velveted with starch and egg white, poached for a minute in a red broth of chilli bean paste, dried chillies and Sichuan pepper over a bed of bean sprouts, celery and cabbage, then buried under chilli flakes, ground Sichuan pepper and garlic and doused with smoking oil at the table. 'Water-boiled' is the joke; nothing about it is plain.",
    context: "It comes from Zigong, the salt city south of Chengdu, where the oxen that turned the brine wheels were slaughtered when they wore out, and the salt workers cooked the tough meat sliced thin in a fierce broth with the chillies and pepper that made it edible. The salt trade paid for Zigong's opera houses and guild halls, and this dish is what the workers ate. Restaurants refined it in the 1930s; the fish version, 水煮鱼, is a 1990s Chongqing offspring.",
    version: "Slicing the beef thin against the grain is the whole job, so I half-freeze it for 30 minutes first. The velveting marinade with egg white and starch is not optional: it is why the beef stays silky after a minute in boiling broth. I cook the vegetables in the wok with a little salt, put them in the serving bowl, then use the same wok for the broth. The final pour of hot oil over the spices is loud and dramatic; do it at the table, and do not skimp on the garlic.",
    groups: [
      ["Beef & marinade", [E("Beef sirloin or flank, sliced 3 mm against the grain", "350 g", "beef", 350), I("Egg white", "1", "egg white", 30), I("Light soy sauce", "1 tbsp", "light soy", 15), I("Shaoxing wine", "1 tbsp", "shaoxing", 15), I("Cornstarch", "1½ tbsp", "cornstarch", 12), I("White pepper", "¼ tsp", "white pepper", 0.5), I("Neutral oil", "1 tsp", "oil", 5)]],
      ["Vegetables", [I("Bean sprouts", "150 g", "bean sprouts", 150), I("Celery, in 5 cm sticks", "100 g", "celery", 100), I("Napa cabbage or lettuce, torn", "150 g", "napa cabbage", 150), I("Neutral oil, for the vegetables", "1 tbsp", "oil", 14), I("Salt", "¼ tsp", "salt", 1.5)]],
      ["Broth", [E("Pixian doubanjiang", "2 tbsp", "doubanjiang", 34, 0.7), E("Dried chillies, halved", "8", "dried chilli", 8, 0.3), E("Whole Sichuan pepper", "1 tsp", "sichuan pepper", 2, 0.5), I("Garlic, sliced", "4 cloves", "garlic", 12), I("Ginger, sliced", "1 tbsp", "ginger", 12), I("Scallions, in 3 cm lengths", "2", "scallion", 20), I("Stock", "500 ml", "stock", 500, 0.5), I("Light soy sauce", "1 tsp", "light soy", 5), I("Sugar", "1 tsp", "sugar", 4), I("Neutral oil", "2 tbsp", "oil", 27, 0.7)]],
      ["The pour", [E("Chilli flakes", "1 tbsp", "chilli flakes", 6), E("Sichuan pepper, ground", "1 tsp", "sichuan pepper", 2), I("Garlic, minced", "2 cloves", "garlic", 6), E("Neutral oil, heated until smoking", "4 tbsp", "oil", 54, 0.5), I("Cilantro or scallion greens", "a handful", "cilantro", 10)]],
    ],
    steps: [
      "Mix the beef with the egg white, soy, wine, cornstarch, white pepper and oil and leave 20 minutes.",
      "Stir-fry the vegetables in 1 tbsp oil with the salt for 2 minutes until barely tender. Spread them in a deep serving bowl.",
      "Heat 2 tbsp oil in the wok over medium heat, add the doubanjiang and fry a minute until the oil turns red. Add the dried chillies, whole Sichuan pepper, garlic, ginger and scallions and fry 30 seconds.",
      "Pour in the stock, soy and sugar and boil 3 minutes. Turn the heat down to a steady simmer.",
      "Drop in the beef slices one by one, spreading them out. Poach without stirring for 40 seconds, then nudge gently and cook 30 seconds more, until just opaque. Pour beef and broth over the vegetables.",
      "Pile the chilli flakes, ground Sichuan pepper and minced garlic in the centre. Heat the 4 tbsp oil until it just smokes and pour it over the pile so it sizzles. Top with cilantro and serve with rice, lifting the beef out of the oil.",
    ],
    subs: "Pork loin or firm white fish (poach 2 minutes) instead of beef, the fish version being a Chongqing classic in its own right. Lettuce, spinach or mushrooms for the vegetables. Gochugaru for chilli flakes if that is what the cupboard has.",
    storage: "Eat immediately. Leftovers keep a day and reheat gently without boiling; the beef will firm up.",
  },
  {
    id: "3d695c6d-26b4-81b4-9d38-fd4c287d8d36",
    name: "Dry-Fried Green Beans (干煸四季豆)", icon: "🥬", source: "https://redhousespice.com/dry-fried-green-beans/",
    course: "Side", effort: "easy", method: "Pan", prep: 10, cook: 15, servings: 2, carb: "low",
    mainIngredient: ["Vegetables", "Pork"], protein: ["pork"], plant: ["garlic", "ginger", "chilli", "soy sauce"], tags: ["quick", "low_carb", "busy_day", "husband_friendly"],
    spice: "🌶️ Mild to medium. The dried chillies perfume the oil and are not eaten; leave them out and it is not spicy at all.",
    identity: "Green beans fried in a little oil until they blister and wrinkle, then tossed with crisp pork mince, ya cai, dried chillies and Sichuan pepper until every bean is coated with savoury crumbs. Dry-frying (干煸) is the technique: cooking the water out of an ingredient so its flavour concentrates and it takes on seasoning like a sponge.",
    context: "Dry-frying is one of the methods Sichuan is proudest of; the same treatment makes 干煸牛肉丝, the chewy beef shreds, and dry-fried eel. Restaurants deep-fry the beans in a vat; home kitchens blister them in a wok with a few spoons of oil over patient heat, which takes longer and tastes the same. It is on every Chengdu table as the vegetable that even children finish.",
    version: "I blister the beans in the wok with 2 tablespoons of oil over medium-high heat, leaving them alone in a single layer for a minute at a time so they scorch in spots, which takes about 8 minutes and needs no deep-frying. Then the beans come out, the pork goes in until crisp, then the ya cai and aromatics, and the beans go back for a final toss. Ya cai is the ingredient worth hunting for; a jar lasts months in the fridge.",
    groups: [
      ["Beans", [E("Green beans, topped and tailed", "400 g", "green beans", 400), I("Neutral oil", "2 tbsp", "oil", 27)]],
      ["Topping", [E("Pork mince", "80 g", "pork mince", 80), E("Ya cai (Sichuan preserved mustard greens)", "30 g", "ya cai", 30), I("Dried chillies, halved", "6", "dried chilli", 6, 0.3), E("Whole Sichuan pepper", "1 tsp", "sichuan pepper", 2, 0.5), I("Garlic, minced", "3 cloves", "garlic", 9), I("Ginger, minced", "2 tsp", "ginger", 8)]],
      ["Seasoning", [I("Shaoxing wine", "1 tbsp", "shaoxing", 15), I("Light soy sauce", "1 tsp", "light soy", 5), I("Sugar", "½ tsp", "sugar", 2), I("Salt", "¼ tsp", "salt", 1.5), I("Sesame oil", "½ tsp", "sesame oil", 2)]],
    ],
    steps: [
      "Dry the beans well. Heat the oil in a wok over medium-high heat, add the beans in one layer and leave them a minute before turning. Keep frying and turning for 7–9 minutes until they are wrinkled, blistered and tender. Scoop out.",
      "In the oil left in the wok, fry the pork mince over high heat until crisp and brown, 3–4 minutes.",
      "Add the dried chillies, Sichuan pepper, garlic and ginger and fry 30 seconds, then the ya cai for another 30 seconds.",
      "Return the beans, splash in the wine and soy, add the sugar and salt and toss 1 minute until the beans are coated in the crumbs. Drizzle with sesame oil and serve.",
    ],
    subs: "Zha cai or any Chinese pickled mustard for ya cai. Leave out the pork and use 50 g finely chopped shiitake for a vegetarian version. Long beans or asparagus in season.",
    storage: "Good warm or at room temperature, so it suits a lunchbox. Keeps 2 days in the fridge.",
  },
  {
    id: "3d695c6d-26b4-81c4-b73c-d9b0ef53c0ce",
    name: "Mouthwatering Chicken (口水鸡)", icon: "🍗", source: "https://redhousespice.com/mouth-watering-chicken/",
    course: "Starter", effort: "medium", method: "Pot", prep: 20, cook: 25, servings: 2, carb: "low",
    mainIngredient: ["Chicken"], protein: ["chicken", "nuts"], plant: ["garlic", "ginger", "scallion", "chilli", "sesame", "vinegar", "soy sauce", "cilantro"], tags: ["high_protein", "low_carb", "batchable"],
    spice: "🌶️🌶️🌶️ Hot and numbing by design; 2 tablespoons of chilli oil instead of 3 and half the Sichuan pepper make it medium. The chicken itself is plain and can be served with less sauce for children.",
    identity: "Chicken poached gently and cooled in its own broth so it stays juicy, sliced, and drowned in a cold red sauce of chilli oil, soy, black vinegar, sugar, ground Sichuan pepper, garlic and sesame, with crushed peanuts and sesame seeds on top. It is a cold dish, eaten at room temperature, and the sauce is the reason for its name.",
    context: "The name comes from the writer Guo Moruo, who wrote in 1962 that thinking of the chicken of his Sichuan childhood made his mouth water; the dish took the line. It belongs to the family of 凉菜, the cold dishes that start every Sichuan meal and that street stalls sell by weight: bang bang chicken, sliced pork with garlic, husband-and-wife lung slices. The sauce is Sichuan's red-oil flavour, 红油味, at full strength.",
    version: "I poach bone-in thighs rather than a whole bird: 10 minutes at a bare simmer, then 15 minutes off the heat in the covered pot, then into iced water so the skin sets. The sauce is mixed cold in a bowl with a few spoons of the poaching broth to make it pourable, and it is better after 20 minutes. Homemade chilli oil with plenty of sediment is what makes it. Everything can be done in the morning for dinner.",
    groups: [
      ["Chicken & poaching", [E("Chicken thighs, bone in, skin on", "4 (about 550 g)", "chicken thigh skin-on", 380), I("Ginger, sliced", "4 slices", "ginger", 10, 0), I("Scallion", "1, knotted", "scallion", 10, 0), I("Shaoxing wine", "1 tbsp", "shaoxing", 15, 0.2)]],
      ["Sauce", [E("Chilli oil, with its sediment", "3 tbsp", "chilli oil", 42), I("Light soy sauce", "2 tbsp", "light soy", 30), I("Chinkiang black vinegar", "1 tbsp", "black vinegar", 15), I("Sugar", "2 tsp", "sugar", 8), E("Sichuan pepper, freshly ground", "1 tsp", "sichuan pepper", 2), I("Garlic, minced", "3 cloves", "garlic", 9), I("Ginger, minced", "1 tsp", "ginger", 5), I("Sesame oil", "1 tsp", "sesame oil", 5), I("Poaching broth", "3 tbsp", "stock", 45)]],
      ["Toppings", [I("Roasted peanuts, crushed", "25 g", "peanuts", 25), I("Toasted sesame seeds", "1 tsp", "sesame seeds", 3), I("Scallion greens, sliced", "2", "scallion", 20), I("Cilantro", "a handful", "cilantro", 10)]],
    ],
    steps: [
      "Put the chicken in a pot with water to cover by 3 cm, the ginger, scallion and wine. Bring to the boil, skim, and simmer very gently 10 minutes. Cover, turn off the heat and leave 15 minutes.",
      "Lift the chicken into a bowl of iced water for 10 minutes. Keep the broth. Pull the meat off the bones in thick slices and lay on a plate, skin up.",
      "Stir the sauce ingredients together with 3 tbsp of the warm broth until the sugar dissolves. Taste: it should be hot, sour, a little sweet, and make your lips tingle.",
      "Pour the sauce over the chicken, scatter with peanuts, sesame seeds, scallion and cilantro and let it sit 10 minutes before serving.",
    ],
    subs: "Chicken breast, poached 8 minutes and rested, if that is what you have; it is drier. Sesame paste, a teaspoon, turns it towards bang bang chicken. The poaching broth makes tomorrow's noodle soup.",
    storage: "The poached chicken keeps 3 days in the fridge; dress it the day you eat it. The sauce keeps a week and is good on cold noodles and cucumbers.",
  },
  {
    id: "3d695c6d-26b4-81db-a77d-dc1c9b4db7ec",
    name: "Chongqing Chilli Chicken (辣子鸡)", icon: "🔥", source: "https://thewoksoflife.com/chongqing-chicken/",
    course: "Main", effort: "hard", method: "Pan", prep: 25, cook: 20, servings: 2, carb: "low",
    mainIngredient: ["Chicken"], protein: ["chicken"], plant: ["garlic", "ginger", "scallion", "chilli", "sesame", "soy sauce"], tags: ["high_protein", "low_carb", "experimental"],
    spice: "🌶️🌶️🌶️ Looks ferocious, eats medium-hot: the chillies are not eaten, the heat is what the oil and the toasted peppercorns leave on the chicken. Fewer chillies means less aroma more than less heat.",
    identity: "Bite-size pieces of chicken, marinated, dusted with starch and fried twice until the outside shatters, then tossed through a wokful of dried chillies and Sichuan pepper with garlic and ginger. It arrives as a heap of red from which you hunt the chicken with chopsticks; the searching is part of the dish. It should be crisp, dry, numbing and fragrant, never saucy.",
    context: "A young dish: created around 1986 at a roadside restaurant on Gele mountain outside Chongqing, where lorry drivers stopped for free-range chicken fried with whatever was cheapest in the hills, which was chillies. It spread through the city's 江湖菜, the swaggering 'rivers and lakes' cooking of Chongqing, and then everywhere. Order it in Chongqing and the chillies will outweigh the chicken two to one.",
    version: "Thigh meat in 2 cm pieces, marinated an hour, tossed in cornstarch and fried in 3 cm of oil in a small pan, then fried again hotter for a minute so it stays crisp under the spices. I use a big handful of the milder, fragrant Sichuan 二荆条 chillies rather than the tiny fierce ones, snip them in half and shake out the seeds. The garlic goes in whole cloves, sliced, and I add a pinch of sugar and sesame seeds at the end. Rice and a plain vegetable alongside.",
    groups: [
      ["Chicken & marinade", [E("Boneless chicken thigh, 2 cm pieces", "500 g", "chicken thigh", 500), I("Light soy sauce", "1 tbsp", "light soy", 15), I("Shaoxing wine", "1 tbsp", "shaoxing", 15), I("Salt", "½ tsp", "salt", 3), I("White pepper", "¼ tsp", "white pepper", 0.5), I("Ginger, grated", "1 tbsp", "ginger", 10), I("Cornstarch, for coating", "2 tbsp", "cornstarch", 18), I("Neutral oil, for frying", "about 400 ml, mostly reusable", "oil", 45)]],
      ["Spices & wok", [E("Dried Sichuan chillies (二荆条 or similar), halved, deseeded", "60 g, a big double handful", "dried chilli", 60, 0.05), E("Whole Sichuan pepper", "1½ tbsp", "sichuan pepper", 10, 0.3), I("Garlic, sliced", "4 cloves", "garlic", 12), I("Ginger, sliced", "1 tbsp", "ginger", 10), I("Scallions, in 3 cm lengths", "2", "scallion", 20), I("Neutral oil, for the stir-fry", "2 tbsp", "oil", 27), I("Sugar", "1 tsp", "sugar", 4), I("Toasted sesame seeds", "1 tbsp", "sesame seeds", 9), I("Sesame oil", "½ tsp", "sesame oil", 2)]],
    ],
    steps: [
      "Mix the chicken with the soy, wine, salt, white pepper and grated ginger and leave an hour, or overnight. Toss with the cornstarch just before frying until each piece is thinly coated.",
      "Heat 3 cm of oil in a small deep pan to 170 °C. Fry the chicken in two batches for 3 minutes until pale gold; lift out. Raise the heat to 190 °C and fry all of it again for 1 minute until deep gold and crisp. Drain.",
      "Heat 2 tbsp oil in a wok over medium heat. Add the Sichuan pepper and stir 30 seconds until fragrant, then the garlic and ginger for 30 seconds, then all the dried chillies. Stir 1–2 minutes until the chillies are glossy and darkened a shade, not black.",
      "Add the chicken and scallions and toss hard for a minute so the chicken picks up the spices. Add the sugar, sesame seeds and sesame oil, toss once more, and serve in a heap.",
    ],
    subs: "Chicken wings, chopped through the joint, are the Chongqing restaurant choice. Bone-in thigh chunks need a minute longer in the first fry. Any dried red chilli works; guajillo and árbol mixed give the right balance of colour and heat.",
    storage: "Fried chicken goes soft in the fridge, so eat it the day it is made. The leftover chillies and oil can be strained and used again for the next batch.",
  },
  {
    id: "3d695c6d-26b4-81a4-8d25-cf7b3fb702e3",
    name: "Hot and Sour Shredded Potato (酸辣土豆丝)", icon: "🥔", source: "https://blog.themalamarket.com/sichuan-hot-and-sour-shredded-potato-suanla-tudou-si/",
    course: "Side", effort: "easy", method: "Pan", prep: 15, cook: 5, servings: 2, carb: "medium",
    mainIngredient: ["Potatoe", "Vegetarian"], protein: [], plant: ["potato", "garlic", "scallion", "chilli", "vinegar"], tags: ["quick", "very_quick", "vegetarian", "busy_day", "kid_friendly"],
    spice: "🌶️ Mild. The dried chillies flavour the oil and are pushed aside; add a fresh chilli for more.",
    identity: "Potato cut into matchsticks, rinsed of its starch, then flashed through a hot wok with dried chillies and Sichuan pepper and finished with a splash of vinegar so it stays crunchy, sharp and hot. It is the potato as a vegetable rather than a starch: crisp like a cucumber, eaten with rice.",
    context: "The potato reached the Sichuan hills in the 1700s and became 洋芋, foreign taro, the crop of the poor uplands. This dish is its everyday face, on every home table and in every canteen in China, the thing students ask for first when they are homesick. Its trick, keeping the potato crisp by washing out the starch and cooking it for two minutes, is the opposite of everything Europe does with potatoes.",
    version: "I cut the potato on a mandoline into 2 mm sticks and leave them in cold water with a spoon of vinegar while the wok heats; the water goes cloudy and the sticks stay white. The whole cook is under three minutes on the highest heat, and the vinegar goes in at the very end because its sharpness boils off. Half a green pepper in thin strips for colour. It is my emergency vegetable when the fridge is empty.",
    groups: [
      ["Potato", [E("Waxy potatoes, peeled and cut into 2 mm matchsticks", "450 g (2 large)", "potato", 450), I("Rice vinegar, for the soaking water", "1 tbsp", "rice vinegar", 15, 0)]],
      ["Wok", [I("Neutral oil", "2 tbsp", "oil", 27), I("Dried chillies, halved", "4", "dried chilli", 4, 0.3), E("Whole Sichuan pepper", "1 tsp", "sichuan pepper", 2, 0.2), I("Garlic, sliced", "2 cloves", "garlic", 6), I("Green pepper or a fresh green chilli, in thin strips", "½", "green pepper", 30), I("Scallion, sliced", "1", "scallion", 10)]],
      ["Seasoning", [E("Rice vinegar (or half black vinegar)", "2 tbsp", "rice vinegar", 30), I("Salt", "½ tsp", "salt", 3), I("Sugar", "¼ tsp", "sugar", 1), I("Sesame oil", "½ tsp", "sesame oil", 2)]],
    ],
    steps: [
      "Soak the potato sticks in cold water with 1 tbsp vinegar for 10 minutes, changing the water once. Drain and shake very dry.",
      "Heat the oil in a wok over low heat with the dried chillies and Sichuan pepper until the chillies darken slightly, about a minute. Lift out the peppercorns if you like; leave the chillies.",
      "Turn the heat to its highest. Add the garlic, then the potato and green pepper, and stir-fry constantly for 2 minutes until the sticks turn translucent at the edges but stay crisp.",
      "Add the salt, sugar and vinegar, toss 20 seconds, add the scallion and sesame oil, and serve at once.",
    ],
    subs: "Any potato works, but floury kinds need a longer soak. Black vinegar makes it darker and rounder; white makes it brighter. Carrot sticks or celtuce can join the potato.",
    storage: "Only good fresh; it softens within the hour.",
  },
  {
    id: "3d695c6d-26b4-81d0-8cb8-e0dafebedd74",
    name: "Garlic Pork Belly Slices (蒜泥白肉)", icon: "🧄", source: "https://blog.themalamarket.com/suanni-bairou-sichuan-garlic-pork/",
    course: "Starter", effort: "medium", method: "Pot", prep: 20, cook: 35, servings: 3, carb: "low",
    mainIngredient: ["Pork"], protein: ["pork"], plant: ["garlic", "ginger", "scallion", "chilli", "cucumber", "soy sauce", "sugar", "sesame"], tags: ["low_carb", "batchable"],
    spice: "🌶️🌶️ Medium: the chilli oil gives warmth, the garlic gives the bite. Use less oil and more of the sweet soy for a mild plate.",
    identity: "Pork belly poached gently with ginger and Sichuan pepper, chilled and sliced almost transparent, laid over cucumber and dressed with pounded garlic, chilli oil and 复制酱油, the spiced, sweetened soy sauce that Sichuan cooks simmer with sugar and aromatics. Cold, garlicky, sweet, hot and rich in the same bite; the fat should be translucent and the lean tender.",
    context: "The white-meat cold dish of Sichuan banquets and street counters, from the same family as mouthwatering chicken, and the ancestor of twice-cooked pork: boiled pork for the altar, sliced and dressed for the family. Chengdu restaurants make a show of the slicing, draping metre-long ribbons of pork over a rack, 李庄白肉 style, but at home thin is enough. The sweet soy is what separates it from a plain garlic dressing.",
    version: "I poach the belly the day before with the twice-cooked pork; the same boiled piece serves both, and cold pork slices thinner. For the sweet soy I simmer light soy with brown sugar, a star anise, a piece of cassia and some ginger for 15 minutes; a jar keeps for months and goes on dumplings too. Garlic is pounded with a pinch of salt to a paste, not chopped, and the cucumber is smashed rather than sliced so it catches the sauce.",
    groups: [
      ["Pork & poaching", [E("Pork belly, skin on, a leaner piece", "300 g", "pork belly", 300, 0.9), I("Ginger, sliced", "4 slices", "ginger", 10, 0), I("Scallion", "1, knotted", "scallion", 10, 0), I("Shaoxing wine", "1 tbsp", "shaoxing", 15, 0.2), I("Whole Sichuan pepper", "1 tsp", "sichuan pepper", 2, 0)]],
      ["Sweet aromatic soy (复制酱油), makes extra", [E("Light soy sauce", "4 tbsp", "light soy", 60, 0.75), E("Brown sugar", "1½ tbsp", "brown sugar", 18, 0.75), I("Star anise, cassia and a slice of ginger", "1 each", "ginger", 3, 0)]],
      ["Dressing", [E("Garlic, pounded to a paste with a pinch of salt", "6 cloves", "garlic", 18), E("Chilli oil, with its sediment", "3 tbsp", "chilli oil", 42), I("Chinkiang black vinegar", "1 tsp", "black vinegar", 5), I("Sesame oil", "1 tsp", "sesame oil", 5), I("Sugar", "½ tsp", "sugar", 2)]],
      ["To serve", [I("Cucumber, smashed and cut in chunks", "200 g", "cucumber", 200), I("Scallion greens, sliced", "1", "scallion", 10), I("Toasted sesame seeds", "1 tsp", "sesame seeds", 3)]],
    ],
    steps: [
      "Put the pork in a pot with cold water to cover, the ginger, scallion, wine and Sichuan pepper. Bring to the boil, skim, and simmer gently 30–35 minutes until a skewer slides in easily. Cool in the liquid, then chill.",
      "Simmer the soy, brown sugar and spices in a small pan for 15 minutes until slightly syrupy. Cool and strain.",
      "Stir the garlic paste with 3 tbsp of the sweet soy, the chilli oil, vinegar, sesame oil and sugar.",
      "Slice the cold pork as thinly as you can, each slice with skin, fat and lean. Spread the cucumber on a plate, lay the pork over it, spoon over the dressing and finish with scallion and sesame seeds. Let it sit 5 minutes.",
    ],
    subs: "Kecap manis, thinned with a little light soy, is a fair shortcut for the sweet soy. Poached chicken thigh instead of pork belly. Blanched bean sprouts or thin rice noodles under the pork instead of cucumber.",
    storage: "Boiled pork keeps 3 days in the fridge; slice and dress it cold. The sweet soy keeps 2 months in a jar in the fridge.",
  },
  {
    id: "3d695c6d-26b4-81b3-8ecb-fc178b041270",
    name: "Fish-Fragrant Shredded Pork (鱼香肉丝)", icon: "🐟", source: "https://redhousespice.com/sichuan-shredded-pork-garlic-sauce/",
    course: "Main", effort: "medium", method: "Pan", prep: 25, cook: 8, servings: 2, carb: "medium",
    mainIngredient: ["Pork", "Vegetables"], protein: ["pork"], plant: ["garlic", "ginger", "scallion", "chilli", "carrot", "celery", "mushrooms", "vinegar", "sugar", "soy sauce"], tags: ["quick", "high_protein", "husband_friendly", "busy_day"],
    spice: "🌶️🌶️ Medium. Pickled chillies give a fruity heat; halve the doubanjiang for mild. Children usually like the sweet-sour side of it.",
    identity: "Matchsticks of pork, velveted and stir-fried with strips of wood ear, carrot and celtuce, in the yuxiang sauce: pickled chilli or chilli bean paste, a lot of garlic, ginger and scallion, and sugar and vinegar in equal measure. Glossy, sweet, sour, hot and savoury, with crunchy vegetables against tender pork. No fish, as with the eggplant; the name is the flavour.",
    context: "Yuxiang shredded pork is the Sichuan dish most often cooked in Chinese homes outside Sichuan, and the one used to teach the province's idea of balance. It appeared in Chengdu restaurants in the 1930s, when the pickled-chilli seasoning that families had used for fish was tried on pork, and it fits any vegetable that can be cut into strips. In the north it turned into 'pork in garlic sauce' with more sugar and no pickled chilli.",
    version: "Cutting everything to the same 5 cm matchstick size is the work, and I do it while the wood ear soaks. Pork loin in strips, velveted with starch and a spoon of oil so it stays soft. The sauce is measured into a cup: sugar and vinegar equal, then soy, wine, stock, starch. The wok needs to be very hot and the whole cook is under five minutes, so I have rice ready before I start. When I cannot find celtuce I use celery or bamboo shoots.",
    groups: [
      ["Pork & marinade", [E("Pork loin or tenderloin, cut into 5 cm matchsticks", "300 g", "pork loin", 300), I("Light soy sauce", "1 tsp", "light soy", 5), I("Shaoxing wine", "1 tsp", "shaoxing", 5), I("Cornstarch", "1½ tsp", "cornstarch", 5), I("Water", "1 tbsp", "water", 15), I("Neutral oil", "1 tsp", "oil", 5)]],
      ["Vegetables", [E("Dried wood ear mushrooms, soaked and shredded", "8 g dried", "wood ear dried", 8), I("Carrot, matchsticks", "80 g", "carrot", 80), I("Celtuce, bamboo shoots or celery, matchsticks", "100 g", "celery", 100)]],
      ["Aromatics", [E("Pixian doubanjiang, or 2 tbsp minced pickled chillies", "1½ tbsp", "doubanjiang", 25), I("Garlic, minced", "4 cloves", "garlic", 12), I("Ginger, minced", "1 tbsp", "ginger", 12), I("Scallions, sliced", "3", "scallion", 30), I("Neutral oil", "2½ tbsp", "oil", 32)]],
      ["Sauce, mixed in a cup", [E("Sugar", "1½ tbsp", "sugar", 18), E("Chinkiang black vinegar", "1½ tbsp", "black vinegar", 22), I("Light soy sauce", "1 tbsp", "light soy", 15), I("Shaoxing wine", "1 tsp", "shaoxing", 5), I("Stock or water", "3 tbsp", "stock", 45), I("Cornstarch", "1 tsp", "cornstarch", 3)]],
    ],
    steps: [
      "Mix the pork with its marinade and leave 15 minutes. Soak the wood ear in hot water 20 minutes, rinse and cut into strips. Stir the sauce together in a cup.",
      "Heat the oil in a wok over the highest heat until it shimmers. Add the pork, spread it out, leave 20 seconds, then stir-fry 1–2 minutes until it turns white. Push to the side.",
      "Add the doubanjiang to the oil and stir 30 seconds until red, then the garlic and ginger for 20 seconds.",
      "Add the wood ear, carrot and celtuce and toss with the pork for 1 minute.",
      "Stir the sauce and pour it in. Toss 30 seconds until it thickens and glosses everything, add the scallions, toss once, and serve with rice.",
    ],
    subs: "Chicken thigh or firm tofu strips for the pork. Green pepper, bamboo shoots or courgette for the vegetables. Rice vinegar with a dash of dark soy for Chinkiang.",
    storage: "Best immediately; keeps a day in the fridge and reheats in a hot pan in a minute. Do not freeze; the wood ear turns rubbery.",
  },
  {
    id: "3d695c6d-26b4-8198-9e41-e3e8df8bb4fa",
    name: "Zhong Dumplings in Red Oil (钟水饺)", icon: "🥟", source: "https://redhousespice.com/sichuan-dumplings/",
    course: "Main", effort: "hard", method: "Pot", prep: 60, cook: 10, servings: 4, carb: "high",
    mainIngredient: ["Pork", "Dough"], protein: ["pork", "eggs"], plant: ["garlic", "ginger", "chilli", "flour", "soy sauce", "sugar", "sesame"], tags: ["comfort", "batchable", "kid_friendly"],
    spice: "🌶️🌶️ Medium; the dumplings themselves are mild and the chilli oil is spooned on per bowl, so children can have theirs with only the sweet soy.",
    identity: "Small pork dumplings in a thin wheat wrapper, boiled and served swimming in a sauce of 复制酱油, sweet aromatic soy, chilli oil and pounded garlic. The filling is pure pork seasoned with ginger water and Sichuan pepper water, no vegetables, because the sauce is the point. Ten to a bowl, eaten as a snack or a light meal, all over Chengdu.",
    context: "Named after Zhong Shaobai, who sold them from a stall in Chengdu's Lychee Lane from 1893 and whose shop still stands. They are the Sichuan answer to the northern boiled dumpling: the same wrapper and pork, but where a Beijing family dips in vinegar, Chengdu drowns the dumpling in sweet, hot, garlicky red oil. Along with dan dan noodles and sweet-water noodles they are the city's classic 小吃, small eats.",
    version: "I make the filling with ginger water and Sichuan pepper water beaten in a spoon at a time until the pork is sticky and light, which is the trick for a juicy filling without vegetables. Shop-bought thin wrappers on a weeknight, my own dough at the weekend. The sweet soy is the same jar I keep for garlic pork slices. I freeze the dumplings raw on a tray and boil them from frozen; forty dumplings is one afternoon and four dinners.",
    groups: [
      ["Wrappers", [E("Plain flour (or 40 shop-bought thin dumpling wrappers)", "300 g", "flour", 300), I("Water", "150 ml", "water", 150), I("Salt", "¼ tsp", "salt", 1.5)]],
      ["Filling", [E("Pork mince, about 20% fat", "300 g", "pork mince", 300), I("Ginger, grated and steeped in 3 tbsp water (ginger water)", "15 g", "ginger", 15), I("Whole Sichuan pepper, steeped in 3 tbsp hot water (pepper water)", "1 tsp", "sichuan pepper", 2, 0.3), I("Egg", "1", "egg", 50), I("Light soy sauce", "1 tbsp", "light soy", 15), I("Salt", "½ tsp", "salt", 3), I("White pepper", "¼ tsp", "white pepper", 0.5), I("Sesame oil", "1 tsp", "sesame oil", 5)]],
      ["Bowl sauce (for 4 bowls)", [E("Sweet aromatic soy (复制酱油): light soy simmered with brown sugar and spices", "6 tbsp", "light soy", 60), I("Brown sugar (in the sweet soy)", "2 tbsp", "brown sugar", 25), E("Chilli oil, with its sediment", "4 tbsp", "chilli oil", 56), E("Garlic, pounded with 1 tsp water", "4 cloves", "garlic", 12), I("Sesame oil", "1 tsp", "sesame oil", 5)]],
    ],
    steps: [
      "For the dough, mix the flour, salt and water into a rough ball, knead 5 minutes until smooth, cover and rest 30 minutes. For the sweet soy, simmer the light soy with the brown sugar, a star anise, a piece of cassia and a slice of ginger for 15 minutes; cool.",
      "Beat the pork with the soy, salt and white pepper. Add the ginger water and pepper water a tablespoon at a time, stirring in one direction, until the meat is sticky and has drunk it all. Beat in the egg and sesame oil. Chill 20 minutes.",
      "Roll the dough into a rope, cut 40 pieces of about 11 g, and roll each into a thin 8 cm circle, thicker in the middle. Put a scant tablespoon of filling on each, fold into a half-moon and press the edge firmly closed.",
      "Boil a big pot of water. Add the dumplings, stir once so they do not stick, and when the water returns to the boil add a cup of cold water. Repeat twice; they are done when they float plump, about 6 minutes.",
      "In each bowl mix 1½ tbsp sweet soy, 1 tbsp chilli oil, a quarter of the garlic and a few drops of sesame oil. Lift 10 dumplings into each bowl with a little of their water, toss, and eat at once.",
    ],
    subs: "Ready-made round wrappers save an hour. Kecap manis stands in for the sweet soy. The same filling makes wontons in the same sauce, 红油抄手, with square wrappers.",
    storage: "Freeze uncooked dumplings on a floured tray, then bag them; boil from frozen 2 minutes longer. The sweet soy keeps 2 months in the fridge. Cooked dumplings do not keep.",
  },
];

// ---------- nutrition ----------
const LABELS = { protein: 20, fibre: 6, satfat: 4 };
export function nutrition(r) {
  const tot = [0, 0, 0, 0, 0, 0, 0, 0];
  for (const [, items] of r.groups) for (const it of items) {
    const per = N[it.key]; if (!per) throw new Error(`no nutrients for ${it.key}`);
    per.forEach((v, i) => { tot[i] += (v * it.g * it.eat) / 100; });
  }
  const s = r.servings;
  const per = { kcal: tot[0] / s, protein: tot[1] / s, carbs: tot[2] / s, fat: tot[3] / s, satfat: tot[4] / s, fibre: tot[5] / s, sugar: tot[6] / s, sodium: tot[7] / s };
  const labels = [];
  if (per.protein >= LABELS.protein) labels.push("High protein");
  if (per.fibre >= LABELS.fibre) labels.push("High fibre");
  if (per.satfat <= LABELS.satfat) labels.push("Lower saturated fat");
  return { per, labels };
}
const r0 = (x) => Math.round(x), r1 = (x) => Math.round(x * 10) / 10;

// ---------- Notion blocks ----------
const rt = (text, ann = {}) => ({ type: "text", text: { content: text }, annotations: ann });
const para = (text) => ({ object: "block", type: "paragraph", paragraph: { rich_text: [rt(text)] } });
const h2 = (text) => ({ object: "block", type: "heading_2", heading_2: { rich_text: [rt(text)] } });
const bullet = (text, children) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [rt(text)], ...(children ? { children } : {}) } });
const boldBullet = (text, children) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [rt(text, { bold: true })], children } });
const numbered = (text) => ({ object: "block", type: "numbered_list_item", numbered_list_item: { rich_text: [rt(text)] } });
const quote = (text) => ({ object: "block", type: "quote", quote: { rich_text: [rt(text, { italic: true })] } });
const callout = (text, url) => ({ object: "block", type: "callout", callout: { icon: { type: "emoji", emoji: "ℹ️" }, color: "gray_background", rich_text: [rt(text), { type: "text", text: { content: url, link: { url } } }] } });
const table = (rows) => ({ object: "block", type: "table", table: { table_width: 2, has_column_header: true, has_row_header: false, children: rows.map(([a, b]) => ({ object: "block", type: "table_row", table_row: { cells: [[rt(a)], [rt(b)]] } })) } });

export function blocks(r) {
  const { per, labels } = nutrition(r);
  const total = r.prep + r.cook;
  return [
    callout("Source and reference: ", r.source),
    h2("What is this dish?"), para(r.identity),
    h2("Why is it here?"), para(r.context),
    h2("My version"), quote("This is how I cook it at home."), para(r.version),
    h2("Ingredients"),
    ...r.groups.map(([title, items]) => boldBullet(title, items.map((it) => bullet(`${it.qty} ${it.name}`)))),
    h2("Steps"),
    ...r.steps.map(numbered),
    h2("Notes: time, servings, substitutions, spice and storage"),
    bullet(`Cooking time: ${r.prep} min preparation + ${r.cook} min cooking, about ${total} min in all.`),
    bullet(`Servings: ${r.servings === 4 ? "4" : `${r.servings} as a main with rice, or ${r.servings * 2} as part of a shared table`}.`),
    bullet(`Substitutions: ${r.subs}`),
    bullet(`Spice level: ${r.spice}`),
    bullet(`Storage: ${r.storage}`),
    h2("Estimated nutrition per serving"),
    table([["Per serving (estimated)", `1 of ${r.servings}`], ["Energy", `${r0(per.kcal)} kcal`], ["Protein", `${r1(per.protein)} g`], ["Carbohydrate", `${r1(per.carbs)} g`], ["Fat", `${r1(per.fat)} g`], ["of which saturated", `${r1(per.satfat)} g`], ["Fibre", `${r1(per.fibre)} g`], ["Sugars", `${r1(per.sugar)} g`], ["Sodium", `${r0(per.sodium)} mg (about ${r1(per.sodium / 400)} g salt)`]]),
    para(labels.length ? `Labels: ${labels.join(", ")}. ` + "Estimated from the ingredient weights above; brands, oil quantities and portions change the numbers, and oil left in the pan or bowl is only partly counted." : "Estimated from the ingredient weights above; brands, oil quantities and portions change the numbers, and oil left in the pan or bowl is only partly counted."),
  ];
}

export function properties(r) {
  const { per, labels } = nutrition(r);
  const ms = (arr) => ({ multi_select: arr.map((name) => ({ name })) });
  const sel = (name) => ({ select: { name } });
  return {
    Name: { title: [rt(r.name)] },
    Cuisine: sel("Chinese"), Course: sel(r.course), "Meal Type": sel("dinner"), "Effort Level": sel(r.effort), "Cooking Method": sel(r.method),
    "Prep Time Min": { number: r.prep }, "Cook Time Min": { number: r.cook }, Portions: { number: r.servings },
    "Carb Level": sel(r.carb), "Protein Score": sel(per.protein >= 25 ? "high" : per.protein >= 12 ? "medium" : "low"),
    "Main Ingredient": ms(r.mainIngredient), "Protein Sources": ms(r.protein), "Plant Ingredients": ms(r.plant), Tags: ms(r.tags),
    Active: { checkbox: true }, URL: { url: r.source },
    "Kcal per serving (est.)": { number: r0(per.kcal) }, "Protein g (est.)": { number: r1(per.protein) }, "Carbs g (est.)": { number: r1(per.carbs) }, "Fat g (est.)": { number: r1(per.fat) },
    "Saturated fat g (est.)": { number: r1(per.satfat) }, "Fibre g (est.)": { number: r1(per.fibre) }, "Sugar g (est.)": { number: r1(per.sugar) }, "Sodium mg (est.)": { number: r0(per.sodium) },
    "Nutrition labels": ms(labels),
  };
}

// ---------- Notion API ----------
async function api(path, init = {}) {
  const res = await fetch(`https://api.notion.com${path}`, { ...init, headers: H });
  const j = await res.json();
  if (!res.ok) throw new Error(`${path}: ${res.status} ${j.message}`);
  return j;
}
async function children(id) {
  const out = []; let cursor;
  do { const p = await api(`/v1/blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`); out.push(...p.results); cursor = p.has_more ? p.next_cursor : undefined; } while (cursor);
  return out;
}
async function clearPage(id) { for (const b of await children(id)) await api(`/v1/blocks/${b.id}`, { method: "DELETE" }); }
async function appendBlocks(id, list) { for (let i = 0; i < list.length; i += 50) await api(`/v1/blocks/${id}/children`, { method: "PATCH", body: JSON.stringify({ children: list.slice(i, i + 50) }) }); }
async function oldIngredientRows(recipeId) {
  const out = []; let cursor;
  do { const p = await api(`/v1/databases/${INGREDIENTS_DB}/query`, { method: "POST", body: JSON.stringify({ filter: { property: "Recipe", relation: { contains: recipeId } }, page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }) }); out.push(...p.results); cursor = p.has_more ? p.next_cursor : undefined; } while (cursor);
  return out;
}
async function writeIngredients(recipeId, r) {
  for (const row of await oldIngredientRows(recipeId)) await api(`/v1/pages/${row.id}`, { method: "PATCH", body: JSON.stringify({ archived: true }) });
  for (const [, items] of r.groups) for (const it of items) {
    await api("/v1/pages", { method: "POST", body: JSON.stringify({ parent: { database_id: INGREDIENTS_DB }, properties: {
      "Ingredient Name": { title: [rt(it.name)] }, "Quantity Text": { rich_text: [rt(it.qty)] }, Category: { select: { name: CAT[it.key] ?? "other" } }, Essential: { checkbox: it.essential }, Recipe: { relation: [{ id: recipeId }] },
    } }) });
  }
}

async function main() {
  for (const r of RECIPES) {
    const { per, labels } = nutrition(r);
    console.log(`${r.name}: ${r0(per.kcal)} kcal · P ${r1(per.protein)} · C ${r1(per.carbs)} · F ${r1(per.fat)} (sat ${r1(per.satfat)}) · fibre ${r1(per.fibre)} · sugar ${r1(per.sugar)} · Na ${r0(per.sodium)} mg · ${labels.join(", ") || "no labels"}`);
    if (DRY) continue;
    let id = r.id;
    if (id) {
      await api(`/v1/pages/${id}`, { method: "PATCH", body: JSON.stringify({ icon: { type: "emoji", emoji: r.icon }, properties: properties(r) }) });
      await clearPage(id);
      await appendBlocks(id, blocks(r));
    } else {
      const page = await api("/v1/pages", { method: "POST", body: JSON.stringify({ parent: { database_id: RECIPES_DB }, icon: { type: "emoji", emoji: r.icon }, properties: properties(r), children: blocks(r).slice(0, 50) }) });
      id = page.id;
      const rest = blocks(r).slice(50); if (rest.length) await appendBlocks(id, rest);
      r.id = id;
    }
    await writeIngredients(id, r);
    console.log(`  → ${id}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
