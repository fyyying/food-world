import type { Area, WorldId } from "./graph";

export type WorldIntroBeat = {
  eyebrow: string;
  title: string;
  body: string;
  emoji: string;
  areas?: Area[];
  sources?: { label: string; url: string }[];
};

export type WorldIntro = {
  summary: string;
  accent: string;
  beats: WorldIntroBeat[];
};

/**
 * Short entry stories for the worlds that exist today. These are invitations,
 * not complete classifications of a country's or region's food culture.
 */
export const WORLD_INTROS: Record<WorldId, WorldIntro> = {
  china: {
    summary: "A journey from ancient grain cultures to today's breakfast stalls, tea tables and home kitchens—through four selected regional cuisines.",
    accent: "#a63d32",
    beats: [
      {
        eyebrow: "Before a single China",
        title: "Two ancient grain worlds",
        body: "Food history begins in different landscapes. Archaeology traces millet farming in northern China and rice farming around the Yangtze. At Lajia in the northwest, a sealed bowl preserved millet noodles made about 4,000 years ago—evidence that turning grain into long, boiled strands already had a deep history.",
        emoji: "🏺",
        areas: ["northern", "jiangnan"],
        sources: [
          { label: "Nature · ancient crops", url: "https://www.nature.com/articles/s41467-020-16557-2" },
          { label: "Nature · Lajia noodles", url: "https://www.nature.com/articles/437967a" },
        ],
      },
      {
        eyebrow: "Techniques accumulate",
        title: "The kitchen became a library",
        body: "Early texts already describe boiling, steaming, frying, roasting, marinating and seasoning with salty, sour and sweet ingredients. Later courts, religious practice, migration, markets and trade added new foods and meanings. Chinese food history is not one untouched tradition; it is a record of repeated exchange and reinvention.",
        emoji: "📜",
        areas: ["northern", "jiangnan"],
        sources: [
          { label: "Cambridge · ancient food", url: "https://www.cambridge.org/core/elements/abs/food-in-ancient-china/DF288A6D5682C96863A04D6563FD96F9" },
          { label: "Cambridge · food culture", url: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/introduction-expanding-the-history-of-chinese-food-culture/E42D8CD6BCF5C2A795B56D61109E0456" },
        ],
      },
      {
        eyebrow: "Tea heritage",
        title: "Tea is craft, place and welcome",
        body: "Tea connects farming, hand processing, water, vessels and social life. UNESCO records six broad categories—green, yellow, dark, white, oolong and black—alongside thousands of local products. Tea may be served at home, work, a teahouse, restaurant, temple or ceremony: an everyday drink and a way to receive people.",
        emoji: "🍵",
        areas: ["jiangnan"],
        sources: [
          { label: "UNESCO · tea traditions", url: "https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884" },
        ],
      },
      {
        eyebrow: "Sichuan · 四川",
        title: "Far more than heat",
        body: "Sichuan cooking builds layered flavour from chilli, Sichuan pepper, fermented broad-bean paste, pickles, aromatics and careful control of oil and fire. Mala—the meeting of chilli heat and pepper's numbing fragrance—is only one profile among sweet-sour, fish-fragrant, garlicky, smoky and gentle dishes. Chengdu's teahouses and hotpot rooms make food part of public life.",
        emoji: "🌶️",
        areas: ["sichuan"],
        sources: [
          { label: "UNESCO · Chengdu gastronomy", url: "https://www.unesco.org/en/creative-cities/chengdu" },
        ],
      },
      {
        eyebrow: "Jiangnan · 江南",
        title: "A landscape of fish and rice",
        body: "The lower Yangtze's waterways, wet-rice agriculture and prosperous towns shaped a cuisine attentive to season and texture. In this world, Jiangnan is told through freshwater foods, rice wine, Longjing tea, lotus, bamboo shoots and red-braising: flavours that can be delicate, savoury and gently sweet rather than simply 'mild'.",
        emoji: "🛶",
        areas: ["jiangnan"],
        sources: [
          { label: "Cambridge · Jiangnan agriculture", url: "https://www.cambridge.org/core/books/animals-through-chinese-history/where-did-the-animals-go/E281204414087F0A9ACCDDCEF5358C08" },
          { label: "Cambridge · tea and place", url: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/tea-and-place-the-evolving-discussion-about-terroir-in-song-china/0D9DCF43CF2D37CE5D885FC42A58BA59" },
        ],
      },
      {
        eyebrow: "Northern China · 北方",
        title: "Wheat joins an older millet story",
        body: "Northern food is often described through wheat: noodles, dumplings, mantou, pancakes and buns. But millet came first, and wheat travelled east from western Asia before becoming deeply local. Colder, drier landscapes encouraged sturdy grain foods, preserved vegetables, vinegar, garlic, mutton and warming braises—yet the north contains many cuisines of its own.",
        emoji: "🥟",
        areas: ["northern"],
        sources: [
          { label: "Heritage Science · grains and exchange", url: "https://www.nature.com/articles/s40494-022-00682-w" },
          { label: "British Museum · northern staples", url: "https://www.britishmuseum.org/collection/object/A_1927-1214-6" },
        ],
      },
      {
        eyebrow: "Xinjiang · Shinjang",
        title: "Oasis kitchens at a crossroads",
        body: "Xinjiang is home to many peoples and strong local identities. This chapter foregrounds Uyghur food culture: nan from the oven, lamb skewers, polo with rice and carrots, hand-pulled laghman, cumin, grapes and dried fruit. Its food reflects oasis agriculture, Muslim practice and centuries of movement between East and Central Asia; a shared feast also belongs to social and musical life.",
        emoji: "🍇",
        areas: ["xinjiang"],
        sources: [
          { label: "UNESCO · Uyghur cultural exchange", url: "https://ich.unesco.org/en/RL/uyghur-muqam-of-xinjiang-00109" },
          { label: "Cambridge · Xinjiang dishes", url: "https://www.cambridge.org/core/books/beyond-the-silk-roads/afghan-restaurants-in-interasian-worlds-prestige-information-pooling-and-crosscultural-exchange-in-longdistance-trade/48FFD454B45845B9DACC577ACB51C9A2" },
        ],
      },
      {
        eyebrow: "Food today",
        title: "The everyday table keeps changing",
        body: "Today's Chinese food lives in home kitchens, school and workplace canteens, breakfast stalls, banquet rooms, chains, independent restaurants and delivery apps. Regional dishes travel, cooks shorten old methods for weeknights, and families keep their own versions. The Everyday Table in this world is where history becomes personal rather than ending in a museum.",
        emoji: "🥢",
        areas: ["everyday"],
      },
    ],
  },
  italy: {
    summary: "Italian food begins with strong local identities: landscapes, seasons and neighbourhood habits matter as much as famous national dishes.",
    accent: "#7b943f",
    beats: [
      {
        eyebrow: "Local before national",
        title: "Every place has its table",
        body: "Italy's cooking changes across short distances. Local grains, cheeses, vegetables, seafood and ways of preserving food give each city and region a recognisable rhythm.",
        emoji: "🗺️",
        areas: ["rome", "venice", "sicily"],
      },
      {
        eyebrow: "Craft and ingredients",
        title: "Simple can still be exacting",
        body: "Pasta, bread, olive oil, tomatoes and cheese look simple on a list. The character comes from season, variety, technique and the care used to bring a few ingredients together.",
        emoji: "🍅",
        areas: ["rome", "sicily"],
      },
      {
        eyebrow: "Food today",
        title: "A living everyday culture",
        body: "The bar, market, trattoria and family kitchen keep regional habits alive while cooks respond to travel, modern workdays and tastes that continue to change.",
        emoji: "🍝",
        areas: ["rome", "venice"],
      },
    ],
  },
  korea: {
    summary: "Korean food brings preservation, shared side dishes, rice and the heat of the table together across cities, coasts and islands.",
    accent: "#b35d65",
    beats: [
      {
        eyebrow: "Preserving the seasons",
        title: "Fermentation keeps time",
        body: "Kimchi, pastes and sauces turn seasonal ingredients into flavours that can last. They are not one fixed taste: homes and regions build their own balances of salt, spice, freshness and depth.",
        emoji: "🥬",
        areas: ["seoul", "jeonju"],
      },
      {
        eyebrow: "Eating together",
        title: "The table is shared",
        body: "Rice, soup, grilled foods and banchan often arrive as a group rather than a strict sequence. Reaching, wrapping, mixing and sharing are part of how the meal works.",
        emoji: "🥢",
        areas: ["seoul", "jeonju"],
      },
      {
        eyebrow: "Land and sea",
        title: "Different places, different abundance",
        body: "Markets and barbecue alleys in Seoul, Jeonju's rice traditions, Busan's seafood and Jeju's volcanic island ingredients show only a few of Korea's many local food stories.",
        emoji: "🌊",
        areas: ["seoul", "jeonju", "busan", "jeju"],
      },
    ],
  },
  mexico: {
    summary: "Mexico's food cultures grow from Indigenous knowledge, regional ingredients and kitchens that keep transforming corn, chillies and more.",
    accent: "#c86d39",
    beats: [
      {
        eyebrow: "Deep foundations",
        title: "Corn changes form",
        body: "Corn is ground, shaped, steamed, griddled and wrapped in countless ways. Together with beans, squash, chillies and local herbs, it anchors many Indigenous food traditions.",
        emoji: "🌽",
        areas: ["oaxaca", "yucatan"],
      },
      {
        eyebrow: "Layered histories",
        title: "Ingredients travelled and changed",
        body: "Colonisation, migration and trade brought new animals, grains, fruits and cooking practices. Mexican cooks absorbed and transformed them into distinct regional cuisines.",
        emoji: "🫕",
        areas: ["jalisco", "cdmx"],
      },
      {
        eyebrow: "Street and home",
        title: "Food moves through the day",
        body: "Markets, fondas, taquerías, celebration dishes and home cooking each serve a different moment. Mexico City, Oaxaca, Jalisco and Yucatán are starting points, not the whole map.",
        emoji: "🌮",
        areas: ["cdmx", "oaxaca", "jalisco", "yucatan"],
      },
    ],
  },
  "middle-east": {
    summary: "This world follows food routes through Turkey, the Levant, Arabia and Persia, where bread, hospitality and trade connect distinct tables.",
    accent: "#b37b34",
    beats: [
      {
        eyebrow: "Crossroads",
        title: "Food travels along routes",
        body: "Ports, caravan paths and cities carried spices, grains, coffee, fruit and techniques between communities. Shared ingredients appear in different forms, with different names and meanings.",
        emoji: "🐪",
        areas: ["istanbul", "arabia", "persia"],
      },
      {
        eyebrow: "Hospitality",
        title: "Bread opens the table",
        body: "Flatbreads, mezze, grilled foods, rice and slow-cooked dishes often make a meal that is generous and communal. Coffee and tea extend the welcome beyond the food itself.",
        emoji: "🫓",
        areas: ["levant", "anatolia"],
      },
      {
        eyebrow: "Many cuisines",
        title: "Connections do not erase difference",
        body: "Istanbul's waterside life, Anatolian ovens, Levantine herb dishes, Arabian coffee and Persian rice traditions belong to distinct cultures. This map shows relationships without treating them as one cuisine.",
        emoji: "🧿",
        areas: ["istanbul", "anatolia", "levant", "persia"],
      },
    ],
  },
  mediterranean: {
    summary: "Coasts and trade connect olive oil, grain, vegetables and fish around one sea: Spain's six neighbourhoods, Greek tavernas, Moroccan souks and Dalmatian konobas.",
    accent: "#4f8b86",
    beats: [
      {
        eyebrow: "A connected sea",
        title: "Coasts exchange ingredients",
        body: "Sailors, merchants and migrants carried crops, spices and techniques between ports. The same ingredient can become something entirely different from one shore to the next: a pepper dried over oak smoke in Extremadura ends up on an octopus plate at an inland Galician fair.",
        emoji: "⛵",
        areas: ["spain", "morocco", "greece", "dalmatia"],
      },
      {
        eyebrow: "The western shore",
        title: "Spain is several places at once",
        body: "Spain fills the west of this table as six neighbourhoods: rice fields and a port on the Valencian lagoon, an arcaded square with its market hall, a whitewashed patio above the sherry bodegas, the dry Manchega plateau, a Galician ría, and a northern coast that turns towards Catalonia. Rice, ham, cheese, cider and rubbed bread each belong to one of them.",
        emoji: "🥘",
        areas: ["spain"],
        sources: [
          { label: "UNESCO · Asturian cider culture", url: "https://ich.unesco.org/en/RL/asturian-cider-culture-01959" },
          { label: "BOE · Arroz de Valencia, 2001", url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2001-13609" },
        ],
      },
      {
        eyebrow: "Climate and season",
        title: "The landscape enters the kitchen",
        body: "Olives, grapes, grain, citrus, pulses, vegetables and fish reflect varied coastal climates. Drying, salting, pickling and preserving make abundance last: anchovies in salt, ham hung for years, peppers on a string, cheese turned every week in a cool store.",
        emoji: "🫒",
        areas: ["greece", "spain"],
      },
      {
        eyebrow: "Many shores",
        title: "Shared threads, local tables",
        body: "A Basque pintxo counter, an Asturian cider house, Greek tavernas, Moroccan souks and Dalmatian konobas are a small sample of a sea ringed by many languages, faiths and food traditions. Neighbouring does not mean the same.",
        emoji: "🍋",
        areas: ["greece", "spain", "morocco", "dalmatia"],
      },
    ],
  },
  india: {
    summary: "India's food cultures are shaped by region, faith, climate, trade and household practice across an enormous and varied subcontinent.",
    accent: "#c4742c",
    beats: [
      {
        eyebrow: "Many everyday staples",
        title: "Grain sets the rhythm",
        body: "Rice, wheat, millets and pulses appear in different forms across India. Breads, porridges, steamed foods and dals reflect local crops as well as household and community traditions.",
        emoji: "🌾",
        areas: ["punjab", "rajasthan", "kerala"],
      },
      {
        eyebrow: "Building flavour",
        title: "Spice is a technique",
        body: "Spices may be toasted, ground, bloomed in fat or added at different moments. Their role is not simply heat; they create aroma, colour, bitterness, warmth and balance.",
        emoji: "🫚",
        areas: ["mumbai", "kerala"],
      },
      {
        eyebrow: "A small route",
        title: "Four places cannot define India",
        body: "Punjab and Delhi, Rajasthan, Mumbai and Kerala show different climates and ways of eating. They introduce the world here without standing in for India's full regional range.",
        emoji: "🛺",
        areas: ["punjab", "rajasthan", "mumbai", "kerala"],
      },
    ],
  },
  "southeast-asia": {
    summary: "This first route through Thailand and Vietnam follows rice, rivers, herbs and busy street kitchens across mainland Southeast Asia.",
    accent: "#4f9569",
    beats: [
      {
        eyebrow: "Water and rice",
        title: "Rivers feed the table",
        body: "Rice fields, deltas, canals and coasts shape everyday food. Rice becomes noodles, paper, porridge and the centre of a meal, while waterways bring fish and market produce. Vietnam works two rice zones: the Red River lowland in the north and the flooded squares of the Mekong delta. In Siam the canal was the street, and the market was held from boats.",
        emoji: "🌾",
        areas: ["mekong", "bangkok"],
      },
      {
        eyebrow: "Fresh balance",
        title: "Flavour is assembled at the table",
        body: "Herbs, lime, chillies, fermented sauces, coconut and crisp vegetables create contrast. Sour, salty, sweet, bitter and hot notes are adjusted for a dish and for the person eating it. A Vietnamese bowl arrives unfinished on purpose: the herb plate, the lime and the fish sauce stand beside it, from the Hanoi guild street to the Hội An quay.",
        emoji: "🌿",
        areas: ["hanoi", "bangkok"],
      },
      {
        eyebrow: "Six Thai regions",
        title: "A capital whose streets were canals",
        body: "In the later reign of Chulalongkorn (1868–1910) Bangkok was a delta town laid out on water, and its market was held from boats. Six regions carry the food from there: the khlongs, the old city with its Teochew quarter, the flooded central plain, the dry Isan plateau, the Lanna valleys and the two coasts of the southern peninsula.",
        emoji: "🛶",
        areas: ["bangkok"],
        sources: [
          { label: "Mae Khrua Hua Pa, the first Siamese cookbook", url: "https://en.wikipedia.org/wiki/Mae_Khrua_Hua_Pa" },
          { label: "Khlong Damnoen Saduak, dug 1866 to 1868", url: "https://en.wikipedia.org/wiki/Khlong_Damnoen_Saduak" },
        ],
      },
      {
        eyebrow: "A starting map",
        title: "Thailand and Vietnam are the first stops",
        body: "Thailand from the khlongs to the Andaman, and the Vietnamese north and centre — the Hanoi guild street, Huế and Hội An — with Saigon and the Mekong delta, reveal different street, home and waterside kitchens. The wider region holds many more cuisines still to explore.",
        emoji: "🗺️",
        areas: ["bangkok", "hanoi", "mekong"],
      },
    ],
  },
  "north-america": {
    summary: "This world begins with food in the United States: Indigenous foundations, migration and regional landscapes behind familiar everyday dishes.",
    accent: "#9b6b3c",
    beats: [
      {
        eyebrow: "Before the nation",
        title: "Indigenous foodways came first",
        body: "Corn, beans, squash, wild rice, seafood, game and many cultivated plants sustained diverse Indigenous nations. Their knowledge remains foundational, not a footnote to later American food.",
        emoji: "🌽",
        areas: ["midwest", "newyork"],
      },
      {
        eyebrow: "Migration and movement",
        title: "Every region carries many stories",
        body: "Forced displacement, enslavement, immigration and internal migration all shaped what people grow, sell and cook. Dishes often carry more than one community's labour and memory.",
        emoji: "🧳",
        areas: ["newyork", "california", "texas"],
      },
      {
        eyebrow: "Regional tables",
        title: "Diners, farms, smoke and markets",
        body: "The Northeast, Midwest, Texas and California offer four contrasting routes through a much larger continent. Each mixes local abundance with food that arrived from elsewhere.",
        emoji: "🔥",
        areas: ["newyork", "midwest", "texas", "california"],
      },
    ],
  },
  japan: {
    summary: "Japanese food balances season, place and craft, from rice and preserved staples to the specialised counters of modern cities.",
    accent: "#b85f70",
    beats: [
      {
        eyebrow: "Season and place",
        title: "The meal notices the moment",
        body: "Ingredients, colours and serving vessels often signal a season. Mountains, farms, inland waters and long coastlines give local food traditions their own ingredients and rhythms.",
        emoji: "🌸",
        areas: ["kyoto", "fuji", "hokkaido"],
      },
      {
        eyebrow: "Everyday foundations",
        title: "Rice meets fermentation",
        body: "Rice, miso, soy sauce, pickles and dashi support many meals, but they vary by maker and region. Careful preparation turns these foundations into many different tastes.",
        emoji: "🍚",
        areas: ["kyoto", "hokkaido"],
      },
      {
        eyebrow: "Food today",
        title: "Tradition and speed share a city",
        body: "A home meal, ramen shop, izakaya, convenience store and specialist counter answer different needs. Tokyo, Kyoto, Fuji and Hokkaido offer only a few ways into Japan's regional range.",
        emoji: "🍜",
        areas: ["tokyo", "kyoto", "fuji", "hokkaido"],
      },
    ],
  },
  "central-europe": {
    summary: "This personal European route crosses London, Budapest, the Alps and Georgia through baking, preserving and generous gathering tables.",
    accent: "#668061",
    beats: [
      {
        eyebrow: "Climate and keeping",
        title: "Food carries the seasons",
        body: "Baking, smoking, fermenting, pickling and slow cooking make harvests last through colder months. Grains, dairy, roots, orchard fruit and meat take different forms across the route.",
        emoji: "🍎",
        areas: ["london", "budapest", "alps"],
      },
      {
        eyebrow: "Gathering",
        title: "The table marks belonging",
        body: "Pubs, cafés, market halls, chalets and the Georgian supra turn food into social space. Hospitality may be formal or everyday, but the meal often carries local memory.",
        emoji: "🕯️",
        areas: ["london", "alps", "georgia"],
      },
      {
        eyebrow: "A personal route",
        title: "Not a strict geography lesson",
        body: "London, Budapest, the Alps and Georgia do not define one cuisine or one neat region. They are the places gathered in this world, each with its own history and voice.",
        emoji: "🧭",
        areas: ["london", "budapest", "alps", "georgia"],
      },
    ],
  },
};
