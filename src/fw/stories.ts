// Food-history stories: guided journeys across the atlas and into the worlds. The first one follows the chilli
// from the Americas to Sichuan; the pattern (chapters with an era, a text and a stop on the atlas or at an object
// in a world) is meant to carry many more.

import { type WorldId } from "./graph";

export type StoryStop = { region: WorldId; dist?: number } | { world: WorldId; object: string };

export type Chapter = {
  era: string;
  title: string;
  zh?: string;
  text: string;
  stop: StoryStop;
};

export type Story = {
  id: string;
  emoji: string;
  title: string;
  zh: string;
  tagline: string;
  chapters: Chapter[];
};

export const STORIES: Story[] = [
  {
    id: "chilli",
    emoji: "🌶️",
    title: "The Journey of Chilli",
    zh: "辣椒之路",
    tagline: "A wild berry from Mexico that became the taste of Sichuan, in six stops.",
    chapters: [
      {
        era: "6000 BC · Mexico", title: "A wild berry in the Tehuacán valley", zh: "辣椒的故乡", stop: { region: "mexico" },
        text: "Chillies are American. Wild Capsicum grew from Bolivia to the Amazon, and people in Mexico were gathering and then planting it by 6000 BC, one of the oldest crops in the Americas beside squash and maize. The Aztecs called it chīlli, the word every language borrowed. They ate it with everything, paid tribute in it, and punished children with its smoke.",
      },
      {
        era: "1493 · Spain", title: "Columbus mistakes it for pepper", zh: "哥伦布的误会", stop: { region: "mediterranean" },
        text: "Columbus was looking for the pepper of the Indies. He found this in the Caribbean instead and brought it to Spain in 1493, calling it pimiento, pepper, a mistake the world never corrected. Within fifty years it grew in Spanish and Portuguese gardens and monasteries, cheap enough for the poor, who had never been able to afford real pepper.",
      },
      {
        era: "1510s · India", title: "The Portuguese carry it east", zh: "葡萄牙人的航线", stop: { region: "india" },
        text: "Portuguese ships took it down the African coast and to Goa after 1510. India had eaten black pepper and long pepper for two thousand years; the new plant grew anywhere and dried for the road, and within a century it was in curries from Kerala to Bengal. From Goa and Malacca it moved along every trade route in Asia.",
      },
      {
        era: "1591 · The Chinese coast", title: "Foreign pepper, grown for its looks", zh: "番椒入华", stop: { region: "china" },
        text: "The first Chinese record is from 1591: Gao Lian's guide to elegant living lists 番椒, foreign pepper, as an ornamental pot plant with pretty red fruit. It came in through the ports of Zhejiang and Guangdong on the same ships that brought maize, sweet potato and peanuts, and for a hundred years nobody in the cities thought of eating it.",
      },
      {
        era: "1720s · Guizhou, then up the Yangtze", title: "Salt for the poor", zh: "以椒代盐", stop: { world: "china", object: "chilli" },
        text: "The first Chinese to eat it were the poor of the mountainous southwest. A Guizhou gazetteer of 1721 records people using 海椒, sea pepper, in place of salt, which was taxed and scarce in the hills. From Guizhou it followed the salt roads and the boats into Hunan and up the Yangtze, and by the 1790s it was growing in Sichuan gardens.",
      },
      {
        era: "1800s to today · Sichuan", title: "Where it met Sichuan pepper", zh: "麻辣的诞生", stop: { world: "china", object: "chilli" },
        text: "Sichuan had loved pungent food for two thousand years, seasoning with Sichuan pepper, ginger and mustard. The new heat slotted in beside the old tingle, and by the 1850s 麻辣 was the region's signature. People here still call it 海椒, sea pepper, remembering how it arrived. China now grows more chillies than any country on earth, and the wild berry from Mexico stands in this field.",
      },
    ],
  },
  {
    id: "tomato",
    emoji: "🍅",
    title: "The Tomato Comes to Italy",
    zh: "番茄之路",
    tagline: "An Aztec garden fruit that Italy feared for two centuries, then could not cook without.",
    chapters: [
      {
        era: "700 AD · Mexico", title: "Tomatl in the Aztec market", zh: "阿兹特克的番茄", stop: { region: "mexico" },
        text: "The wild tomato is a pea-sized berry of the Andes, but it was in Mexico that people bred it big and red. The Aztecs called it tomatl and sold it in the market at Tenochtitlan in every size and colour, chopped with chillies into the first salsas. Spanish soldiers tasted it there in 1519.",
      },
      {
        era: "1540s · Spain", title: "A golden apple for the garden", zh: "金苹果", stop: { region: "mediterranean" },
        text: "Seeds crossed to Seville with the conquistadors. In 1544 the Italian doctor Mattioli described the new plant and its fruit as pomi d'oro, golden apples, since the first ones were yellow. It was a nightshade, a cousin of deadly belladonna, so the rich grew it for its looks and the doctors warned against eating it.",
      },
      {
        era: "1692 · Naples", title: "The first tomato sauce", zh: "第一份番茄酱", stop: { region: "italy", dist: 40 },
        text: "For 150 years the tomato was an ornament. Then the poor of the south, who could not afford to be squeamish, cooked it. In 1692 Antonio Latini, a steward in Naples, printed the first recipe for tomato sauce, salsa di pomodoro alla spagnola, in the Spanish manner: tomatoes roasted, peeled and chopped with onion, chilli and thyme.",
      },
      {
        era: "1889 · Naples", title: "Pizza in the colours of the flag", zh: "玛格丽特披萨", stop: { region: "italy", dist: 40 },
        text: "By the 1800s Naples put tomato on its bread, its pasta and its dried spaghetti. In 1889, the story goes, the pizzaiolo Raffaele Esposito baked a pizza for Queen Margherita in red, white and green: tomato, mozzarella and basil. Around the same time the first canneries around Naples began sending peeled tomatoes to the Italians emigrating to America.",
      },
      {
        era: "Today · Sicily", title: "Red gold on the roofs", zh: "西西里的红色黄金", stop: { world: "italy", object: "tomato" },
        text: "In Sicily the summer harvest is still spread on boards on the roofs to dry into strattu, a paste as dark as a brick, and every family bottles its own passata in August. Italy turns three quarters of its tomatoes into sauce, the world plants two hundred million tonnes a year, and the Aztec garden fruit stands here in the field.",
      },
    ],
  },
  {
    id: "potato",
    emoji: "🥔",
    title: "The Potato Feeds Europe",
    zh: "土豆之路",
    tagline: "A tuber from the high Andes that Europe distrusted, then depended on.",
    chapters: [
      {
        era: "8000 years ago · The Andes", title: "Bred on the roof of the world", zh: "安第斯山的根", stop: { region: "mexico" },
        text: "The potato was domesticated around Lake Titicaca, four thousand metres up, where nothing else would grow. Andean farmers bred thousands of kinds, freeze-dried them into chuño on the frosty nights, and fed the Inca empire and its armies on them. The Spanish met it in Peru in the 1530s and thought it a kind of truffle.",
      },
      {
        era: "1570 · Spain", title: "Ship's stores in Seville", zh: "登陆西班牙", stop: { region: "mediterranean" },
        text: "Sailors carried potatoes as stores on the long voyage home, and a hospital in Seville was buying them by 1573. Spain ate them without fuss; the rest of Europe did not. The plant was another nightshade, its lumps looked leprous, and the Bible did not mention it. For two hundred years it was pig food and a botanist's curiosity.",
      },
      {
        era: "1756 to 1785 · Prussia and France", title: "Kings talk Europe into it", zh: "国王的劝说", stop: { region: "central-europe" },
        text: "Frederick the Great ordered Prussian peasants to plant potatoes in 1756 and sent soldiers to make sure they did. In France the pharmacist Parmentier, who had lived on them as a prisoner of war, persuaded Louis XVI to wear the flower and posted guards around his potato field by day so that people would steal from it by night. War and famine did the rest: a field of potatoes fed four times as many people as a field of wheat.",
      },
      {
        era: "1845 · Ireland", title: "One crop, one blight", zh: "爱尔兰大饥荒", stop: { region: "central-europe" },
        text: "By 1840 three million Irish people lived almost entirely on potatoes, one variety, the Lumper, on tiny plots. In 1845 a mould from the Americas turned the crop to black slime in the ground, and did so again for four years. A million people died and more than a million left for America. No crop has ever shown so plainly how much depends on the food of the poor.",
      },
      {
        era: "Today · China", title: "The world's biggest potato field", zh: "洋芋在中国", stop: { region: "china" },
        text: "The potato reached China in the 1600s and climbed into the hills of Yunnan, Guizhou and Sichuan, where it is 洋芋, foreign taro, sliced into hot and sour stir-fries. China now grows more potatoes than any other country, and India comes second. The tuber from the roof of the world feeds a billion people who never saw the Andes.",
      },
    ],
  },
  {
    id: "tea",
    emoji: "🍵",
    title: "Tea Goes Around the World",
    zh: "茶之路",
    tagline: "From a Yunnan forest to every kettle on earth, and back to a Chengdu teahouse.",
    chapters: [
      {
        era: "760 · Tang China", title: "The Classic of Tea", zh: "陆羽《茶经》", stop: { region: "china" },
        text: "The tea plant is a tree of the Yunnan forests, and the Chinese have brewed its leaves for at least two thousand years, first as a bitter medicine. Around 760 the scholar Lu Yu wrote 茶经, the Classic of Tea, the first book on how to grow, prepare and drink it, and tea became an art. Tang China drank it pressed into cakes; Song China whisked it into a froth.",
      },
      {
        era: "1191 · Japan", title: "A monk brings seeds home", zh: "荣西与茶", stop: { region: "japan" },
        text: "The Zen monk Eisai came back from China in 1191 with tea seeds and a book praising tea for a long life. Japanese monks planted it around Kyoto and kept the Song habit of whisking powdered tea, which China itself forgot. Over three centuries this became the tea ceremony, and matcha, a green froth in a bowl, is still Song dynasty tea.",
      },
      {
        era: "1600s · Persia and Turkey", title: "The caravan roads", zh: "驼队与茶炊", stop: { region: "middle-east" },
        text: "Tea went west by land long before the sea: on the Tea Horse Road to Tibet, where it is churned with butter, and along the Silk Road to Persia and Russia, which gave it the samovar. Persians drink it black, in glasses, with a sugar lump held in the teeth. Turkey came to tea only in the 1900s and now drinks more of it per head than anyone.",
      },
      {
        era: "1657 · London", title: "From the coffeehouse to the afternoon", zh: "英国下午茶", stop: { region: "central-europe" },
        text: "Dutch ships landed the first tea in Europe in 1610, and Garraway's coffeehouse in London was selling it by 1657. A Portuguese queen, Catherine of Braganza, made it fashionable at court in 1662, and Britain never stopped: by 1840 a duchess had invented afternoon tea, and the East India Company was paying for its tea with opium grown in India.",
      },
      {
        era: "1830s · Assam", title: "The British plant their own", zh: "印度红茶", stop: { region: "india" },
        text: "In 1823 a Scottish trader found wild tea trees in Assam, and by the 1840s British planters had cleared jungle for tea gardens there and in Darjeeling, breaking China's monopoly. Indians took the leftover leaf and made it their own: boiled with milk, sugar, ginger and cardamom, chai is now sold at every station and street corner.",
      },
      {
        era: "1850s · Morocco", title: "Green tea meets mint", zh: "薄荷茶", stop: { region: "mediterranean" },
        text: "Chinese green tea reached Morocco in bulk in the 1850s, when the Crimean War closed British merchants' Baltic markets and their ships turned to Tangier and Essaouira instead. Moroccans brewed it strong, sweet and full of fresh mint, and poured it from a height for the foam. Three glasses is the rule of hospitality.",
      },
      {
        era: "Today · Chengdu", title: "Back to the teahouse", zh: "回到茶馆", stop: { world: "china", object: "teahouse" },
        text: "Tea is the most drunk thing on earth after water. In Chengdu it is still jasmine in a lidded gaiwan, refilled all afternoon from a copper kettle in a bamboo chair under the trees, with mahjong tiles clacking and an ear-cleaner ringing his tuning fork. This is where the leaf started, and where it never went out of fashion.",
      },
    ],
  },
  {
    id: "coffee",
    emoji: "☕",
    title: "Coffee Wakes the World",
    zh: "咖啡之路",
    tagline: "Sufi monks, Ottoman coffeehouses, Venetian cafés and the Italian bar.",
    chapters: [
      {
        era: "1400s · Yemen", title: "The monks of Mocha stay awake", zh: "也门的苏菲僧侣", stop: { region: "middle-east" },
        text: "Coffee is a tree of the Ethiopian highlands, where the story says a goatherd named Kaldi saw his goats dancing after eating the berries. It was across the Red Sea, in Yemen, that people first roasted and brewed the beans, in the 1400s: Sufi monks drank it to stay awake through the night's prayers, and the port of Mocha gave it a name.",
      },
      {
        era: "1554 · Istanbul", title: "The schools of the wise", zh: "伊斯坦布尔的咖啡馆", stop: { region: "middle-east" },
        text: "Coffee reached Mecca, Cairo and then the Ottoman capital, where two Syrians opened the first coffeehouses in 1554. Men sat for hours over tiny cups with chess, poetry and gossip, and the coffeehouses were called schools of the wise. Sultans banned them, more than once, for the talk; they always reopened. Turkish coffee is still boiled with its grounds in a long-handled cezve.",
      },
      {
        era: "1615 · Venice", title: "The Devil's drink is baptised", zh: "威尼斯的咖啡", stop: { region: "italy" },
        text: "Venetian merchants brought the first sacks to Europe in 1615. Priests asked the Pope to ban the Muslim drink; Clement VIII tasted it and is said to have baptised it instead. Venice opened its first café in 1645, and Caffè Florian on St Mark's Square has served it since 1720. Vienna's coffeehouses followed the sacks of beans the Ottomans left behind after the siege of 1683.",
      },
      {
        era: "1652 · London", title: "Penny universities", zh: "一便士大学", stop: { region: "central-europe" },
        text: "London's first coffeehouse opened in 1652, and within fifty years there were hundreds. A penny bought a cup and a seat among merchants, writers and scientists, so they were called penny universities. Lloyd's insurance market and the stock exchange both began as coffeehouses. Then Britain switched to tea, and left coffee to the rest of Europe.",
      },
      {
        era: "1696 to 1727 · Java and Brazil", title: "Smuggled seedlings", zh: "爪哇与巴西", stop: { region: "southeast-asia" },
        text: "The Arabs guarded their trees, but the Dutch got seedlings to Java in 1696 and a plant to Amsterdam, which gave one to Louis XIV. A French officer nursed a cutting across the Atlantic to Martinique in 1723, sharing his water ration with it. From there it spread to the whole Caribbean and, in 1727, to Brazil, which has grown more coffee than any country since the 1840s.",
      },
      {
        era: "1901 to today · Italy", title: "The espresso bar", zh: "意式浓缩", stop: { world: "italy", object: "gelateria" },
        text: "Italy invented the machine. Luigi Bezzera's 1901 patent forced steam through the grounds in seconds, and in 1948 Achille Gaggia's lever pushed hot water through at high pressure, which gave the cup its crema. Espresso is drunk standing at the bar, in one gulp, several times a day, and a cappuccino only before eleven. The Sufi monks' nightcap is now the world's morning.",
      },
    ],
  },
  {
    id: "corn",
    emoji: "🌽",
    title: "Corn Crosses the World",
    zh: "玉米之路",
    tagline: "Mexico's grass became the staple of Africa and the hills of China, and came home to the milpa.",
    chapters: [
      {
        era: "9000 years ago · Mexico", title: "A grass called teosinte", zh: "玉米的祖先", stop: { region: "mexico" },
        text: "Maize does not exist in the wild. Farmers in the Balsas valley of Mexico bred it, over thousands of years, from teosinte, a grass with a dozen hard kernels. They also discovered nixtamal: soaking the grain in lime water, which frees its niacin and makes the dough for tortillas. Every Mesoamerican civilisation was built on it; the Maya said people were made of corn.",
      },
      {
        era: "1493 · Spain", title: "Columbus brings it home", zh: "哥伦布带回玉米", stop: { region: "mediterranean" },
        text: "Columbus saw fields of it in Cuba in 1492 and carried seed to Spain the next year. It grew fast, on poor ground, in hot summers, and needed no plough. Within a generation it was in Andalusian gardens and on Portuguese ships heading down the coast of Africa, where it would matter more than anywhere.",
      },
      {
        era: "1500s · Africa", title: "The Portuguese coast", zh: "非洲的主食", stop: { region: "mediterranean", dist: 60 },
        text: "Portuguese traders planted maize at their forts in West Africa to feed ships and, grimly, the slave trade. African farmers took it inland: it outyielded sorghum and millet and stored well. Today it is the continent's first staple, as ugali, fufu, sadza, kenkey and pap, and Africa eats more of it per head than Mexico.",
      },
      {
        era: "1500s · India", title: "Around the Cape to Goa", zh: "印度的玉米", stop: { region: "india" },
        text: "The same ships brought it to Goa and the Malabar coast after 1510, with chillies, cashews and pineapples. It never displaced rice and wheat in the lowlands, but Himalayan and tribal farmers took it up the hills, and Indian markets still roast the cobs over charcoal and rub them with lime and chilli salt.",
      },
      {
        era: "1531 · China", title: "Jade rice in the hills", zh: "玉米入华", stop: { region: "china" },
        text: "The first Chinese record is from Guangxi in 1531. 玉米, jade rice, climbed slopes too steep and dry for paddies, and with the sweet potato it fed the great population boom of the Qing dynasty: from 150 million people in 1700 to 400 million by 1850. China is now the second-largest grower on earth, and grinds it into 窝头 and porridge in the north.",
      },
      {
        era: "Today · The milpa", title: "Home to Oaxaca", zh: "回到玉米田", stop: { world: "mexico", object: "corn" },
        text: "Nobody outside Mexico kept the lime water, and Italian and Southern American peasants who lived on unlimed corn got pellagra for two hundred years. In Oaxaca the milpa still grows corn, beans and squash together, in sixty colours, and the tortilla is still pressed by hand from nixtamal each morning. This is where the grass was made into food.",
      },
    ],
  },
  {
    id: "spices",
    emoji: "🧂",
    title: "The Spice Routes",
    zh: "香料之路",
    tagline: "Pepper, cloves and nutmeg: the trade that mapped the world.",
    chapters: [
      {
        era: "1st century · Kerala", title: "Black gold on the Malabar coast", zh: "马拉巴尔的黑金", stop: { region: "india" },
        text: "Black pepper is a vine of the wet hills of Kerala, and it was the first spice the world fought over. Roman ships learned the monsoon winds in the first century and sailed straight to Muziris to fill their holds; Pliny complained that India drained fifty million sesterces a year from Rome. Peppercorns were found in the nose of Ramesses II, a thousand years earlier.",
      },
      {
        era: "700 to 1400 · Arabia", title: "The middlemen of the incense road", zh: "阿拉伯的中间商", stop: { region: "middle-east" },
        text: "For most of history no European knew where spices grew. Arab and Persian merchants carried them by dhow and camel through Yemen, Cairo, Damascus and Baghdad, and told tales of cinnamon guarded by giant birds to keep the price up. Cloves and nutmeg came from islands so far east that even the Arabs bought them from Malay traders.",
      },
      {
        era: "1200s · Venice", title: "The Venetian monopoly", zh: "威尼斯的垄断", stop: { region: "italy" },
        text: "Venice bought the whole trade at Alexandria and sold it to Europe at prices that built the palaces on the Grand Canal. A pound of pepper cost a week's wages; peppercorns paid rents and ransoms; a sack of nutmeg could buy a house. Every court in Europe wanted a way around Venice and the Ottomans, and that wanting launched the age of exploration.",
      },
      {
        era: "1498 · Around the Cape", title: "Vasco da Gama reaches Calicut", zh: "达伽马的航线", stop: { region: "mediterranean" },
        text: "Columbus sailed west for the Indies and found chillies instead. Vasco da Gama sailed around Africa and reached Calicut on the pepper coast in 1498, greeted with the question of what he had come for: Christians and spices. Lisbon undercut Venice within a decade, and Portuguese forts from Mozambique to Malacca held the sea lanes for a century.",
      },
      {
        era: "1600s · The Spice Islands", title: "Nutmeg and the Dutch", zh: "香料群岛", stop: { region: "southeast-asia" },
        text: "Nutmeg grew on ten tiny Banda islands and cloves on five in the Moluccas, and the Dutch East India Company, founded in 1602, wanted all of them. In 1621 it killed or enslaved most of the Bandanese to take the nutmeg groves, and in 1667 it traded the English the island of Manhattan for Run, the last nutmeg island it lacked. Cloves went on to flavour Zanzibar, Indonesia's kretek cigarettes and every Christmas ham.",
      },
      {
        era: "Today · The bazaar", title: "The Spice Bazaar of Istanbul", zh: "伊斯坦布尔香料市场", stop: { world: "middle-east", object: "spicesMe" },
        text: "The Egyptian Bazaar in Istanbul, built in 1664 on the customs from Cairo's spice trade, still sells pepper, cumin, sumac, saffron and cinnamon in pyramids by the kilo. Spices are cheap now: pepper costs less than the paper it is wrapped in. But the routes they opened became the world's shipping lanes, and half the cities on this atlas grew up along them.",
      },
    ],
  },
];
