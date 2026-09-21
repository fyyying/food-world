/** Ambient and tap speech for every Thai stand, keyed by object id. Owned by the Researcher.
 *
 *  Where this belongs. The module contract in docs/thailand-world.md lists `TH_LINES` among
 *  `props-thailand.ts`'s exports, and that file is the Stand maker's. The Researcher may not edit it, so
 *  the lines are delivered here and `props-thailand.ts` should import or re-export `TH_LINES` from this
 *  file rather than declare a second copy of it, exactly as `props-spain.ts` reads its own `ES_LINES`.
 *
 *  Shape and rules. One bubble per line: the local language first, then the English, separated by " · ",
 *  which is the form `props.ts` already uses for a two-script bubble and the form research section 2.5
 *  wrote these in. Four to six lines per stand, so a stand does not repeat itself inside one visit, and
 *  nothing long enough to wrap more than twice at 390 px. The lines go to `ambientChat` and to the
 *  deferred tap bubble, whose quiet intervals, single speaker, tap priority and clean-up are what
 *  scripts/tests/village-speech.mjs asserts; nothing in the text itself is tested, so the discipline here
 *  is editorial: no line states a date, a price or a historical claim. Every record lives on the card.
 *
 *  Orthography. The twelve room objects' lines are verbatim from docs/thailand-research.md section 2.5.
 *  The Isan (`isanGrillTh`), Northern Thai (`khaoSoiTh`) and Patani Malay (`muslimKitchenTh`) lines are
 *  written in central Thai orthography, which is how those languages are ordinarily written down but is
 *  not how they are spoken; the Teochew and Hokkien lines in `shophouseTh`, `babaTh` and `chinHawTh` are
 *  in Chinese characters. A Thai reader should check this file before it ships. The dish names and place
 *  names I am confident in; the regional spellings I am not. */
export const TH_LINES: Record<string, string[]> = {
  // --- the twelve room objects: verbatim from research section 2.5 ---
  floatingMarket: [
    "เรือมาแล้ว! · The boat's here!",
    "มะม่วงหวานมาก ชิมก่อนได้ · The mangoes are very sweet, taste one first.",
    "ส่งชามมาสิ · Pass your bowl over.",
    "อย่าโยกเรือ! · Don't rock the boat!",
    "ขายหมดก่อนสาย · Sold out before mid-morning.",
    "เอามะพร้าวอ่อนไหม · Do you want a young coconut?",
  ],
  kuaitiaoRuea: [
    "ชามเล็ก ๆ กินสองชามก็ได้ · Small bowls; you can have two.",
    "เผ็ดไหม? ใส่พริกเอง · Spicy? Put your own chilli in.",
    "ระวัง ร้อน · Careful, it's hot.",
    "ไม่ต้องลงเรือ ยื่นมือมา · Don't get in the boat, just reach out.",
    "น้ำซุปเคี่ยวตั้งแต่ตีสี่ · The broth has been on since four in the morning.",
  ],
  wangKitchenTh: [
    "ตำให้ละเอียดกว่านี้ · Pound it finer than that.",
    "แกะให้บางที่สุด · Carve it as thin as it will go.",
    "จดไว้ด้วย เดี๋ยวลืม · Write it down, or we will forget it.",
    "ชิมก่อน แล้วค่อยเติมน้ำปลา · Taste it first, then add the fish sauce.",
    "ของหวานต้องทำตอนเช้า · The sweets have to be made in the morning.",
  ],
  curryPaste: [
    "ตำจนหอม ไม่ใช่จนละเอียด · Pound it until it smells right, not until it's smooth.",
    "รอให้น้ำมันแตกก่อน · Wait for the oil to split first.",
    "กะปิอีกนิด · A little more shrimp paste.",
    "ครกหินเท่านั้น ครกดินไม่ไหว · A stone mortar only; a clay one won't do.",
    "แขนล้าแล้ว เปลี่ยนมือ · My arm's gone; swap with me.",
  ],
  sweetsTh: [
    "มือต้องนิ่ง ไม่งั้นเส้นขาด · Keep your hand steady or the thread breaks.",
    "ไข่แดงอย่างเดียว · Egg yolks only.",
    "น้ำเชื่อมเดือดพอดีแล้ว · The syrup is at exactly the right boil.",
    "ขนมนี้มาจากฝรั่ง แต่ทำกันมาสามร้อยปี · This one came from foreigners, but we have made it for three hundred years.",
    "ใส่ใบเตยด้วย · Put the pandan in as well.",
  ],
  shophouseTh: [
    "火大一点! · Turn the fire up!",
    "เส้นใหญ่หรือเส้นเล็ก · Wide noodles or thin?",
    "两碗! · Two bowls!",
    "เป็ดเพิ่งลงจากเตา · The duck has just come off the fire.",
    "เอาน้ำส้มพริกดองไหม · Do you want the chilli vinegar?",
  ],
  naKhaoTh: [
    "พักก่อน กินข้าวเสียที · Stop a minute and eat something.",
    "ปลาสุกแล้ว แกะใบตองออก · The fish is done; open the leaf.",
    "ตำน้ำพริกให้หน่อย · Pound the nam phrik, would you.",
    "ควายลงน้ำอีกแล้ว · The buffalo's got into the water again.",
    "อีกสองแปลงก็เสร็จ · Two more squares and we're finished.",
  ],
  isanGrillTh: [
    "กินข้าวแล้วบ่ · Have you eaten yet?",
    "ตำบักหุ่งให้แซ่บ ๆ · Pound the papaya really hot.",
    "ไก่ใกล้สุกแล้ว · The chicken is nearly done.",
    "เอาปลาแดกใส่บ่ · Shall I put pla ra in it?",
    "ข้าวเหนียวยังฮ้อนอยู่ · The sticky rice is still hot.",
  ],
  khaoSoiTh: [
    "กิ๋นข้าวก่อนเน้อ · Eat first, will you.",
    "เส้นทอดใส่ข้างบน · The fried noodles go on top.",
    "เอาผักดองกับหอมแดงมาปะ · Bring the pickled greens and the shallots.",
    "ไส้อั่วปิ้งไว้แล้ว · The sai ua is already on the grill.",
    "ม้าต่างลงมาแล้วกา · Have the pack mules come down yet?",
  ],
  talayTh: [
    "ปลาเพิ่งขึ้นจากเรือ · The fish has just come off the boat.",
    "ทาขมิ้นก่อนย่าง · Rub the turmeric on before it goes on.",
    "หมึกแห้งพอแล้ว เก็บได้ · The squid is dry enough; bring it in.",
    "น้ำลงแล้ว รีบหน่อย · The tide's gone out; be quick.",
    "เผ็ดใต้ เผ็ดจริง · Southern hot is properly hot.",
  ],
  muslimKitchenTh: [
    "Roti panah! · Hot roti!",
    "Budu sikit je · Just a little budu.",
    "นวดให้นุ่มกว่านี้ · Knead it softer than that.",
    "ข้าวหมกยังไม่ได้ที่ · The khao mok isn't ready yet.",
    "Makan dulu · Eat first.",
  ],
  babaTh: [
    "火候要够 · The heat has to be right.",
    "หมูฮ้องเคี่ยวตั้งแต่เช้า · The moo hong has been simmering since morning.",
    "เอาจานลายครามมา · Bring the blue-and-white plates.",
    "เหมืองปิดแล้วหรือยัง · Has the mine knocked off yet?",
    "กินก่อนเย็น · Eat before it goes cold.",
  ],

  // --- the ten card-only ingredient and flavour stops: working lines, no claims ---
  chilliesSea: [
    "พริกนี่มาทางเรือ ของอื่นมีอยู่แล้ว · The chilli came by ship; the rest was already here.",
    "ข่าแก่ กลิ่นแรงกว่า · Older galangal has a stronger smell.",
    "ตะไคร้ต้องทุบก่อนหั่น · Bruise the lemongrass before you cut it.",
    "รากผักชีอย่าตัดทิ้ง · Don't cut the coriander roots off.",
  ],
  coconutSea: [
    "ขูดให้ถึงเปลือก · Grate it right down to the shell.",
    "คั้นครั้งแรกเป็นหัวกะทิ · The first pressing is the cream.",
    "ลูกอ่อนเอาน้ำ ลูกแก่เอาเนื้อ · Young for the water, old for the flesh.",
    "ลูกนี้แก่พอแล้ว · This one is old enough.",
  ],
  naPaddyTh: [
    "ค่อย ๆ เดินควาย · Walk the buffalo slowly.",
    "น้ำเข้านาแล้ว · The water is in the field.",
    "ปีนี้ข้าวดี · The rice is good this year.",
    "เกี่ยวให้ถึงคันนา · Cut it right up to the bund.",
  ],
  plaTh: [
    "ยกไซขึ้นดูหน่อย · Lift the trap and have a look.",
    "ปลาช่อนตัวใหญ่ · A big snakehead.",
    "ปลาเล็กเอาไปลงไห · The small ones go into the jar.",
    "น้ำลดปลาเข้าไซ · When the water drops the fish go into the traps.",
  ],
  suanTh: [
    "ทุเรียนหล่นเองจึงกินได้ · A durian is ready when it falls by itself.",
    "มังคุดเปลือกยังนิ่ม · The mangosteen skin is still soft.",
    "ยกร่องให้น้ำเดิน · Raise the bed so the water runs.",
    "มะม่วงน้ำดอกไม้ออกเดือนนี้ · The nam dok mai mangoes come this month.",
  ],
  tanTh: [
    "ปีนตาลต้องใจเย็น · Climbing a palm takes patience.",
    "กระบอกเต็มแล้ว เอาลงมา · The cylinder is full; bring it down.",
    "เคี่ยวในกระทะแบน · Boil it down in the flat pan.",
    "ต้นนี้แก่กว่าฉันหลายเท่า · This tree is a great deal older than I am.",
  ],
  kluaTh: [
    "เปิดน้ำเข้านาเกลือ · Let the water into the pan.",
    "กวาดขึ้นกองก่อนฝนมา · Rake it into a heap before the rain.",
    "แดดดีอย่างนี้ เกลือขึ้นเร็ว · With sun like this the salt comes up fast.",
    "เกลือนี้ไปหมักปลา · This salt goes to ferment the fish.",
  ],
  plaRaTh: [
    "ปิดไหให้แน่น · Seal the jar tight.",
    "หกเดือนค่อยเปิด · Six months before you open it.",
    "รำข้าวกับเกลือ เท่านี้ · Rice bran and salt, that is all.",
    "น้ำปลาร้าอยู่ก้นไห · The liquid is at the bottom of the jar.",
  ],
  miangTh: [
    "ใบอ่อนเท่านั้น · Young leaves only.",
    "นึ่งก่อน แล้วอัดใส่กระบุง · Steam it first, then pack it in the basket.",
    "เมี่ยงเอาไว้อม ไม่ได้ชง · Miang is for chewing, not for brewing.",
    "ชาต้นนี้อยู่ใต้ร่มไม้ · This tea grows under the shade trees.",
  ],
  khamminTh: [
    "ขมิ้นติดมือ ล้างไม่ออก · Turmeric stains your hands; it won't wash off.",
    "ขุดตอนใบเหลือง · Dig it when the leaves go yellow.",
    "แกงใต้ต้องขมิ้นสด · A southern curry wants fresh turmeric.",
    "กระชายปลูกข้าง ๆ · The krachai grows alongside.",
  ],

  // --- the six landmarks: short bystander lines ---
  wat: [
    "ถอดรองเท้าก่อนขึ้น · Take your sandals off before you go up.",
    "ระวังธรณีประตู · Mind the threshold.",
    "ปิดทองที่ยอดเจดีย์ · Gold leaf on the top of the chedi.",
    "ระฆังตีตอนเย็น · The bell is struck in the evening.",
  ],
  almsRound: [
    "ใส่บาตรก่อนสาย · Give alms before the morning is gone.",
    "ถอดรองเท้า แล้วนั่งลง · Sandals off, then kneel.",
    "ข้าวร้อน ๆ ใส่ก่อน · The hot rice goes in first.",
    "พระท่านไม่พูดตอนรับบาตร · The monks do not speak while they receive.",
  ],
  karsts: [
    "หินลูกนี้เคยเป็นปะการัง · This rock was once a reef.",
    "นกแอ่นอยู่ใต้ชะวาก · The swifts live under the overhang.",
    "ใต้เขาน้ำลึก ปลาเยอะ · The water is deep at its foot, and full of fish.",
    "หลบลมเข้ามาด้านนี้ · Come round this side, out of the wind.",
  ],
  longtail: [
    "ขุดจากไม้ต้นเดียว · Hollowed out of a single log.",
    "สี่เดือนกว่าจะเสร็จ · Four months before it is finished.",
    "ลมเปลี่ยน ย้ายเกาะ · The wind's changed; we move island.",
    "หลังคาใบจากกันฝนได้ · The palm-thatch roof keeps the rain off.",
  ],
  tukTuk: [
    "ไปไหนครับ · Where to?",
    "ขึ้นเลย ผมลากเอง · Get in, I'll pull.",
    "ถนนใหม่ลากง่ายกว่าคลอง · The new street is easier than the canal.",
    "ฝนมาก็กางประทุน · If it rains I put the hood up.",
  ],
  chinHawTh: [
    "马队下来了 · The mule train is down.",
    "อย่าให้ของหนักข้างเดียว · Don't let one side carry all the weight.",
    "ข้าวซอยมาทางนี้ · Khao soi came in this way.",
    "ทางยูนนานไกลนัก · The Yunnan road is a long one.",
  ],
};
