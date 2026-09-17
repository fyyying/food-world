/** What each Thai kitchen cooks: the hero first, then the dishes the place is known for. Owned by the Researcher. */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };

export const THAILAND_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  // TH01 The floating market, a khlong basin at first light. Thirty boats tied gunwale to gunwale; the street is water.
  floatingMarket: [
    { name: "Young coconut", zh: "น้ำมะพร้าวอ่อน", line: "The top struck off with a cleaver and the water drunk from the shell, then the soft flesh scraped out." },
    { name: "Mango with sticky rice", zh: "ข้าวเหนียวมะม่วง", line: "Ripe mango beside glutinous rice steeped in sweetened coconut cream, sold from a boat through the March and April season." },
    { name: "Grilled banana", zh: "กล้วยปิ้ง", line: "Short sweet bananas flattened and grilled over charcoal in the boat, brushed with salted coconut cream while still hot." },
    { name: "Mangosteen and rambutan", zh: "มังคุดและเงาะ", line: "Opened by thumb over the gunwale; the rains bring them in by the boatload and the price falls." },
    { name: "Steamed banana-leaf parcels", zh: "ข้าวต้มมัด", line: "Rice, coconut and palm sugar steamed inside a folded leaf and tied with split bamboo, eaten on the water." },
    { name: "Morning glory and pea aubergine", zh: "ผักบุ้งและมะเขือพวง", line: "Cut at dawn upriver, tied in bundles and sold by the armful before the sun is properly up." },
    { name: "Salted duck eggs", zh: "ไข่เค็ม", line: "Duck eggs packed in salted mud for a month, boiled and split, the yolk gone orange and firm." },
  ],

  // TH02 The noodle boat, moored at a landing stage. One pot, one paddle, small bowls handed up over the gunwale.
  kuaitiaoRuea: [
    { name: "Rice noodles in pork broth", zh: "ก๋วยเตี๋ยวน้ำ", line: "Flat or thin rice noodles under a ladle of pork-bone broth, in a bowl small enough to finish standing." },
    { name: "Dry noodles", zh: "ก๋วยเตี๋ยวแห้ง", line: "The same noodles served without broth, tossed with soy, sugar and pork fat, the soup handed over separately." },
    { name: "Pork meatballs", zh: "ลูกชิ้นหมู", line: "Pork pounded to a paste and rolled small, bouncing when it is right, dropped into the pot to order." },
    { name: "Blanched greens", zh: "ผักลวก", line: "Morning glory and bean sprouts dipped in the same broth for a moment; the only vegetable this boat carries." },
    { name: "The four seasonings", zh: "เครื่องปรุง", line: "Dried chilli, sugar, chilli vinegar and fish sauce on a rack: the eater, not the cook, finishes the bowl." },
  ],

  // TH03 The household kitchen of a noble compound, where the first Siamese cookbook was written down.
  wangKitchenTh: [
    { name: "Nam phrik and its accompaniments", zh: "น้ำพริกเครื่องเคียง", line: "Chilli, garlic, shallot and shrimp paste pounded together, with blanched vegetables, fried fish and shredded omelette round it." },
    { name: "Massaman", zh: "แกงมัสมั่น", line: "Cardamom, cinnamon and cloves with peanuts and beef or chicken; praised in a royal poem of 1800 for its spices." },
    { name: "Khao chae", zh: "ข้าวแช่", line: "Rice in jasmine-scented iced water with stuffed shallots and shrimp-paste balls, a hot-season dish of this household." },
    { name: "Carved fruit and vegetables", zh: "ผักผลไม้แกะสลัก", line: "Pomelo cut into flowers, chilli opened into petals; knife work a woman of this compound was expected to learn." },
    { name: "Tom yum with snakehead", zh: "ต้มยำปลาช่อน", line: "River fish with lemongrass, galangal and lime; the first written tom yum recipe, from 1888, is this one." },
    { name: "Kaeng thepho", zh: "แกงเทโพ", line: "Catfish belly simmered with morning glory in a coconut curry, named in the same 1800 poem as the massaman." },
    { name: "Mi krop", zh: "หมี่กรอบ", line: "Rice vermicelli fried crisp and tossed in a sour-sweet tamarind and orange syrup, the household's showpiece dish." },
    { name: "Luk chup", zh: "ลูกชุบ", line: "Mung bean paste modelled into miniature fruits and glazed; a Portuguese marzipan idea worked in beans instead of almonds." },
  ],

  // TH04 The curry mortar, under a house on posts. Granite, a quarter of an hour, and cream fried until the oil splits.
  curryPaste: [
    { name: "The curry paste", zh: "เครื่องแกง", line: "Chillies, galangal, lemongrass, kaffir lime zest, coriander root, garlic and shrimp paste, pounded in granite until the smell changes." },
    { name: "Massaman", zh: "แกงมัสมั่น", line: "Whole spices from the Muslim trade with cardamom and cinnamon; the oldest curry named in the Siamese written record." },
    { name: "Red curry", zh: "แกงเผ็ด", line: "Dried red chillies soaked and pounded, fried in split coconut cream, then thin milk, meat and pea aubergine." },
    { name: "Green curry", zh: "แกงเขียวหวาน", line: "Fresh green chillies instead of dried; not documented before 1926, so younger than this mortar by a generation.", recipe: "43fe3973-050b-4d25-85dd-e560d0f5ec5d" },
    { name: "Panang", zh: "แกงพะแนง", line: "A thicker, drier curry with peanuts worked into the paste and only a little liquid, eaten with rice." },
    { name: "Kaeng som", zh: "แกงส้ม", line: "The sour curry with no coconut in it at all: chilli, turmeric and tamarind, sharp enough to wake a table." },
    { name: "Kaeng liang", zh: "แกงเลียง", line: "An old peppery vegetable soup with no chilli in it, seasoned with shrimp paste and white pepper instead." },
  ],

  // TH05 The sweets kitchen at Kudi Chin, the Portuguese quarter on the Thonburi bank. Egg, sugar and coconut over charcoal.
  sweetsTh: [
    { name: "Foi thong", zh: "ฝอยทอง", line: "Egg yolk drawn in threads through a cone into boiling syrup; the Portuguese fios de ovos, made here since Ayutthaya." },
    { name: "Thong yip", zh: "ทองหยิบ", line: "Yolk cooked in syrup and pinched into a six-pointed flower cup, from the Portuguese trouxas das caldas." },
    { name: "Thong yot", zh: "ทองหยอด", line: "Yolk dropped in beads into the same syrup until it sets round and golden, from ovos moles de Aveiro." },
    { name: "Khanom farang kudi chin", zh: "ขนมฝรั่งกุฎีจีน", line: "Wheat flour, duck egg and sugar baked with embers on the lid, topped with raisin and candied winter melon." },
    { name: "Khanom mo kaeng", zh: "ขนมหม้อแกง", line: "A baked custard of duck egg, coconut milk and palm sugar over mung bean, browned under fried shallot." },
    { name: "Luk chup", zh: "ลูกชุบ", line: "Mung bean and coconut paste modelled as tiny fruits, painted and glazed in agar, sold off a tray." },
    { name: "Khanom chan", zh: "ขนมชั้น", line: "Nine steamed layers of rice flour, coconut milk and palm sugar, peeled apart one layer at a time." },
  ],

  // TH06 The Teochew shophouse on the new Yaowarat street. The wok, the noodle, the roast meats, the charcoal.
  shophouseTh: [
    { name: "Fried rice noodles", zh: "ก๋วยเตี๋ยวผัด", line: "Flat noodles tossed in a charcoal-fired wok with soy, egg and greens; the ancestor of the pad thai of the 1940s." },
    { name: "Roast duck", zh: "เป็ดย่าง", line: "Hung on a hook over the block, chopped through the bone to order and laid over rice with its juices." },
    { name: "Crisp pork belly", zh: "หมูกรอบ", line: "Skin dried, salted and blistered over charcoal, then chopped into squares that crack under the cleaver." },
    { name: "Rice congee", zh: "โจ๊ก", line: "Rice boiled until the grains dissolve, with pork, ginger and a raw egg broken in at the counter." },
    { name: "Bamee egg noodles", zh: "บะหมี่", line: "Wheat-and-egg noodles, the Chinese noodle this quarter kept for itself, served dry with roast pork and broth beside." },
    { name: "Salted radish omelette", zh: "ไชโป๊วผัดไข่", line: "Preserved radish from the jar fried hard into egg, a Teochew breakfast eaten with congee at the marble table." },
    { name: "Steamed buns", zh: "ซาลาเปา", line: "Pork or sweetened bean inside a white yeasted bun, steamed in a stack with the lid lifted in front." },
  ],

  // TH07 The rice-field lunch, on the bund at harvest. The meal is carried out and cooked where the work is.
  naKhaoTh: [
    { name: "Fish grilled in banana leaf", zh: "ปลาเผาใบตอง", line: "A whole fish wrapped in leaf and laid on the straw fire, the leaf charring while the flesh steams inside." },
    { name: "Nam phrik kapi", zh: "น้ำพริกกะปิ", line: "Shrimp paste, chilli, garlic and lime pounded on the bund, with whatever grows along it to dip in." },
    { name: "Rice from the basket", zh: "ข้าวสวย", line: "Cooked at the house before dawn and carried out in a lidded basket, still warm at mid-morning." },
    { name: "Tom yum with river fish", zh: "ต้มยำปลา", line: "Lemongrass, galangal and lime leaf in water with the fish that came out of this same flooded field." },
    { name: "Blanched vegetables", zh: "ผักลวก", line: "Morning glory, cucumber and young banana flower, dropped into the pot for a moment and eaten with the relish." },
    { name: "Steamed rice parcels", zh: "ข้าวต้มมัด", line: "Glutinous rice, coconut and banana bound in a leaf and steamed, the parcel that travels out to the field." },
  ],

  // TH08 The Isan grill, under a raised house on the dry plateau. Grilled, pounded, fermented: three answers to a dry year.
  isanGrillTh: [
    { name: "Som tam", zh: "ส้มตำ", line: "Green papaya shredded and bruised in a clay mortar with chilli, lime, garlic, long bean and fermented fish." },
    { name: "Gai yang", zh: "ไก่ย่าง", line: "A whole bird flattened between split bamboo and turned slowly over charcoal until the skin is lacquered and dry." },
    { name: "Sticky rice", zh: "ข้าวเหนียว", line: "Soaked overnight, steamed in a bamboo cone and eaten with the fingers, rolled into a ball to lift the rest." },
    { name: "Larb", zh: "ลาบ", line: "Meat chopped fine with toasted rice powder, mint, shallot and chilli, dressed with lime and eaten warm." },
    { name: "Pla ra", zh: "ปลาร้า", line: "Freshwater fish under salt and rice bran for six months; the seasoning, the protein and the argument at every table." },
    { name: "Tom saep", zh: "ต้มแซบ", line: "A clear sour-hot soup of bones and offal with lemongrass, galangal and a great deal of lime and chilli." },
    { name: "Nam tok", zh: "น้ำตก", line: "Grilled pork sliced across the grain and dressed like larb, named for the juice that falls on the coals." },
  ],

  // TH09 The Lanna kitchen in Chiang Mai. Little sugar, little coconut, and a noodle that came down the caravan road.
  khaoSoiTh: [
    { name: "Khao soi", zh: "ข้าวซอย", line: "Soft egg noodles in a turmeric-and-coconut curry broth under a nest of the same noodles fried crisp." },
    { name: "Sai ua", zh: "ไส้อั่ว", line: "Pork worked with lemongrass, kaffir lime leaf, galangal and turmeric, coiled into a skin and grilled over charcoal." },
    { name: "Nam prik num", zh: "น้ำพริกหนุ่ม", line: "Green chillies, shallot and garlic roasted in the embers, skinned and pounded, eaten with pork crackling and rice." },
    { name: "Nam prik ong", zh: "น้ำพริกอ่อง", line: "Minced pork and tomato cooked down with dried chilli into a thick red relish, the north's everyday dish." },
    { name: "Kaeng hang le", zh: "แกงฮังเล", line: "Pork belly stewed slowly with ginger, tamarind and a Burmese spice mix, a dish that came down the caravan roads." },
    { name: "Khanom chin nam ngiao", zh: "ขนมจีนน้ำเงี้ยว", line: "Fermented rice noodles in a tomato and pork-blood broth with dried kapok flowers, from the Shan side of the border." },
  ],

  // TH10 The Andaman fishing kitchen, a fire on the sand under the limestone. Turmeric goes on before the fire does.
  talayTh: [
    { name: "Fish grilled with turmeric", zh: "ปลาย่างขมิ้น", line: "Rubbed with pounded turmeric and salt and laid on green sticks over driftwood coals until the skin lifts away." },
    { name: "Kaeng som", zh: "แกงส้ม", line: "Tamarind, turmeric and chilli with fish and green papaya, thin-looking, no coconut in it, and properly hot." },
    { name: "Sataw with prawns", zh: "ผัดสะตอกุ้ง", line: "Bitter green stink beans split from their pods and fried hard with prawns, shrimp paste and fresh chilli." },
    { name: "Dried squid", zh: "ปลาหมึกแห้ง", line: "Split, salted and hung on a line in the sea wind, then grilled and beaten soft against the board." },
    { name: "Khua kling", zh: "คั่วกลิ้ง", line: "Minced meat fried dry with a turmeric-heavy paste until no liquid is left, only the spice and the heat." },
    { name: "Nam phrik kung siap", zh: "น้ำพริกกุ้งเสียบ", line: "Smoked prawn pounded with chilli and shallot, eaten with raw vegetables and a basket of rice on the sand." },
  ],

  // TH11 The Malay-Muslim kitchen of the deep south, at the mangrove edge. No pork, and a sauce made of anchovies and time.
  muslimKitchenTh: [
    { name: "Roti", zh: "โรตี", line: "Dough rested in oil, thrown out thin between two hands and cooked on a steel plate until it puffs." },
    { name: "Khao mok", zh: "ข้าวหมก", line: "Rice cooked with chicken, turmeric, cardamom and cinnamon in one pot, the Indian Ocean's biryani arrived by sea." },
    { name: "Budu", zh: "บูดู", line: "Anchovies and salt sealed for months; the deep south's own fish sauce, thinned with lime and chilli for the table." },
    { name: "Nasi kerabu", zh: "ข้าวยำ", line: "Rice tinted blue with butterfly-pea flowers, tossed with shredded herbs, toasted coconut and a spoon of budu." },
    { name: "Massaman", zh: "แกงมัสมั่น", line: "The curry the Muslim trade routes left behind, with whole spices, potato and peanut, cooked here without any pork." },
    { name: "Kaeng tai pla", zh: "แกงไตปลา", line: "Fermented fish innards with turmeric and dried fish; named in Thai records from the reign of Rama II." },
  ],

  // TH12 The Baba household kitchen in a Phuket shophouse. Hokkien food, Siamese aromatics, and a table bought with tin.
  babaTh: [
    { name: "Moo hong", zh: "หมูฮ้อง", line: "Pork belly braised with garlic, white pepper and dark soy until the fat goes soft and the meat black." },
    { name: "Mee Hokkien", zh: "หมี่ฮกเกี้ยน", line: "Thick yellow wheat noodles in a brown gravy with prawn, pork and squid, the tin town's own bowl." },
    { name: "O-tao", zh: "โอต้าว", line: "Oyster and grated taro fried together on a flat iron plate with egg, a Phuket dish and nowhere else." },
    { name: "Loba", zh: "โลบะ", line: "Pork offal simmered in five-spice and soy, sliced onto a plate with fried tofu and a dark dipping sauce." },
    { name: "Nam phrik kung siap", zh: "น้ำพริกกุ้งเสียบ", line: "Smoked prawn pounded with chilli and shallot, eaten with young mango and raw vegetables at the family table." },
    { name: "Khanom chin Phuket", zh: "ขนมจีนภูเก็ต", line: "Fermented rice noodles under a coconut-and-fish curry, laid out with roti and a tray of raw herbs for breakfast." },
  ],

  // The floating market's own stalls, kept as hit-only children of the market: a fruit boat and a noodle boat.
  "stall-fruit": [
    { name: "Mango with sticky rice", zh: "ข้าวเหนียวมะม่วง", line: "Ripe nam dok mai mango beside glutinous rice steeped in sweetened coconut cream, sold from the boats each April." },
    { name: "Durian", zh: "ทุเรียน", line: "Grown in the river orchards upstream since long before this market; a good one costs a week's rice." },
    { name: "Mangosteen", zh: "มังคุด", line: "Twisted open by thumb into five white segments; it comes in with the rains and the whole canal smells of it." },
    { name: "Rambutan and longan", zh: "เงาะและลำไย", line: "Sold on the branch by the armful in the wet season, cut off with a knife over the gunwale." },
  ],

  "stall-noodles": [
    { name: "Boat noodles", zh: "ก๋วยเตี๋ยวเรือ", line: "Rice noodles and pork in a small bowl ladled over the gunwale; the dark spiced broth came later." },
  ],
};
