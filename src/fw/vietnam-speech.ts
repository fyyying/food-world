/** Ambient and tap speech for every Vietnamese stand, keyed by object id. Owned by the Researcher.
 *
 *  The Stand maker imports `VN_LINES` from this file into `props-vietnam.ts` and passes it to each stand's
 *  reaction loop, exactly as `props-spain.ts` uses its own `ES_LINES`; the module contract in
 *  docs/vietnam-world.md lists `VN_LINES` among `props-vietnam.ts`'s exports, so that file should
 *  re-export it rather than declare a second copy.
 *
 *  Shape and rules follow the village-speech harness (scripts/tests/village-speech.mjs) and props.ts
 *  `ambientChat`/`bubble`: one short line per bubble, Vietnamese with full diacritics first, then the
 *  English on the same line, no line longer than about 60 characters of Vietnamese so the bubble stays on
 *  one or two rows at 390 px. Four to seven lines per stand, so a stand does not repeat itself inside a
 *  visit. Nothing here makes a historical claim; the dated records live in the cards.
 *
 *  Room lines are working lines from the food action in docs/vietnam-world.md's reaction column.
 *  Ingredient, flavour and landmark lines are short working or bystander lines. */
export const VN_LINES: Record<string, string[]> = {
  // --- HN1 Hanoi guild street ---
  hanoiKitchen: [
    "Vớt bọt cho nước trong. Skim the foam so the broth stays clear.",
    "Đừng để sôi bùng. Don't let it come to a rolling boil.",
    "Hồi ra khỏi nồi rồi. The star anise is out of the pot now.",
    "Bánh phở chỉ trần một lát. The noodles only go in for a moment.",
    "Nướng hành cho cháy vỏ. Char the onion until the skin blackens.",
    "Thịt mỏng, nước sôi làm chín. Slice the beef thin, the stock cooks it.",
    "Ghế thấp, ngồi tạm nhé. Low stools, sit where you can.",
  ],
  bunChaVn: [
    "Than hồng rồi, nướng được. The charcoal is ready, start grilling.",
    "Mỡ chảy là được đấy. When the fat runs, that's it.",
    "Thả thịt vào nước mắm ngay. Drop the pork straight into the broth.",
    "Bún để riêng, đừng trộn. Keep the noodles separate, don't mix them.",
    "Rau sống thêm bao nhiêu cũng được. Take as many herbs as you like.",
    "Nem cua bể vừa ra chảo. The crab rolls have just come out.",
  ],
  banhCuonVn: [
    "Tráng mỏng thôi. Spread it thin.",
    "Đậy vung, đếm đến năm. Lid on, count to five.",
    "Lấy que tre mà bóc. Lift it off with the bamboo wand.",
    "Bột phải chua một chút. The batter has to sour a little.",
    "Hành phi để xa hơi nước. Keep the fried shallot away from the steam.",
    "Cuốn nhanh không thì nguội. Roll it quickly or it goes cold.",
  ],
  comVongVn: [
    "Giã đều tay, đừng mạnh quá. Strike evenly, not too hard.",
    "Lúa còn non mới làm được cốm. Only young grain makes cốm.",
    "Rang lửa nhỏ thôi. Roast it over a low fire.",
    "Sàng lại một lượt nữa. Sieve it once more.",
    "Gói vào lá sen cho thơm. Wrap it in lotus leaf for the scent.",
    "Hết mùa thu là hết cốm. When autumn ends, the cốm ends.",
  ],
  herbsSea: [
    "Rau thơm đây! Fresh herbs here!",
    "Bó riêng từng loại. Each kind in its own bundle.",
    "Đừng cắt, để nguyên lá. Don't cut them, keep the leaves whole.",
    "Húng, mùi, tía tô, đủ cả. Basil, coriander, perilla, all here.",
    "Cắm vào nước cho tươi. Stand them in water to keep them fresh.",
  ],
  starAniseVn: [
    "Rang khô cho thơm đã. Toast them dry first.",
    "Hồi, quế, đinh hương, thảo quả. Star anise, cassia, clove, black cardamom.",
    "Buộc vào túi vải. Tie them into the cloth bag.",
    "Lấy ra sớm, kẻo đắng. Take it out early or the broth turns bitter.",
    "Quế trên rừng mới về. The cassia has just come down from the hills.",
  ],
  hoanKiem: [
    "Sáng nào cũng ra hồ. Everyone comes down to the lake in the morning.",
    "Kìa, cụ rùa nổi! Look, the turtle has come up!",
    "Cầu Thê Húc đỏ quá. The Thê Húc bridge is very red.",
    "Ngồi bóng cây cho mát. Sit under the trees where it's cool.",
    "Truyền thuyết kể vậy thôi. That's only what the legend says.",
  ],
  motorbikes: [
    "Tránh gánh, tránh gánh! Mind the pole, mind the pole!",
    "Đổi vai một cái. Let me shift it to the other shoulder.",
    "Hai đầu phải cân nhau. Both ends have to balance.",
    "Xe đạp xin đường! Bicycle coming through!",
    "Đẩy xe qua bên này. Push the cart over this side.",
    "Tre dẻo mới đỡ vai. Springy bamboo is easier on the shoulder.",
  ],

  // --- HN2 Red River craft courtyard ---
  lotusTeaVn: [
    "Trà sen, uống nóng nhé. Lotus tea, drink it hot.",
    "Chén nhỏ thôi, uống chậm. Small cups, drink slowly.",
    "Hạt sen để nấu chè. The seeds are for the sweet soup.",
    "Lá sen dùng để gói cốm. The leaves are for wrapping green rice.",
    "Ngồi nghỉ một lát đã. Sit and rest a while.",
  ],
  waterPuppetsVn: [
    "Người điều khiển đứng sau bình phong. The puppeteers stand behind the screen.",
    "Con rối nổi lên kìa! The puppet is coming up!",
    "Cây gậy ở dưới nước. The rod is under the water.",
    "Tích trò kể chuyện làng. The scenes tell village stories.",
    "Đứng lùi lại, ướt đấy. Stand back, you'll get wet.",
  ],

  // --- CT1 Huế garden edge ---
  hueKitchenVn: [
    "Sả đập dập, để nguyên cây. Bruise the lemongrass, leave it whole.",
    "Mắm ruốc phải lọc lại. The shrimp paste has to be strained back in.",
    "Bún Huế to hơn bún Hà Nội. Huế noodles are thicker than Hanoi's.",
    "Ớt màu cho lên trên. The chilli oil goes on top.",
    "Chanh với rau để bên cạnh. Lime and herbs beside the bowl.",
    "Tự nêm cho vừa miệng. Season it to your own taste.",
  ],
  banhHueVn: [
    "Bánh bèo lõm giữa mới đúng. A bánh bèo has to dimple in the middle.",
    "Hấp mấy phút là được. A few minutes of steam and it's done.",
    "Hơ lá chuối cho mềm đã. Pass the banana leaf over the heat first.",
    "Dùng que tre, không cần thìa. Use the bamboo splint, no spoon needed.",
    "Bột lọc trong là chín rồi. When the tapioca goes clear it's cooked.",
    "Tính tiền theo đĩa không. We count the empty dishes.",
  ],
  lemongrassVn: [
    "Sả tươi đây, mua bó nhé. Fresh lemongrass, buy it by the bundle.",
    "Bóc bỏ lá ngoài đi. Strip the outer leaves off.",
    "Đập dập phần gốc trắng. Flatten the white base.",
    "Mắm ruốc Huế, thơm lắm. Huế shrimp paste, very strong.",
    "Sả mọc bụi ở bờ vườn. Lemongrass grows in clumps at the garden edge.",
  ],
  hueCitadelVn: [
    "Cờ trên cửa thành bay kìa. The flag over the gate is stirring.",
    "Nhìn từ mặt sông mới rõ. You see it best from the river.",
    "Kinh thành bên kia hào. The citadel is across the moat.",
    "Thuyền đi chậm lại chút. Let the boat slow down a moment.",
    "Bếp thì ở ngoài thành. The kitchens are outside the walls.",
  ],

  // --- CT2 Hội An shophouses ---
  caoLauVn: [
    "Trộn một lần cho đều. Toss it once so the sauce reaches the top.",
    "Ít nước thôi, không phải canh. Only a little liquid, this isn't a soup.",
    "Mì dai, không mềm như phở. The noodle is chewy, not soft like phở.",
    "Bánh giòn rắc sau cùng. The crisp squares go on last.",
    "Cửa sau ra bến sông. The back door opens onto the quay.",
    "Chuyện gốc tích thì còn tranh. The origin story is still argued over.",
  ],
  miQuangVn: [
    "Một vá nước thôi, đủ rồi. One ladle of broth, that's enough.",
    "Tô phải rộng và cạn. The bowl has to be wide and shallow.",
    "Nhân phải nổi trên nước. The toppings must sit above the liquid.",
    "Bóp bánh tráng mè vào. Break the sesame cracker in.",
    "Bắp chuối xắt nhỏ đây. Shredded banana flower here.",
    "Hôm nay có tôm với thịt. Today it's shrimp and pork.",
  ],
  hoiAnQuayVn: [
    "Lăn chum ra bến. Roll the jar down to the quay.",
    "Buộc thuyền chặt vào. Tie the boat up tight.",
    "Hàng vào cửa trước, bán ngoài phố. Goods in at the back, sold at the front.",
    "Đường lát đá trơn lắm. The paving is worn smooth.",
    "Đi cầu ván cẩn thận. Mind the plank.",
  ],

  // --- SG1 Saigon and Chợ Lớn ---
  banhMi: [
    "Bánh mì nóng đây! Hot bread here!",
    "Xẻ đôi, phết pa-tê. Split it, spread the pâté.",
    "Vỏ mỏng, ruột xốp. Thin crust, light crumb.",
    "Bánh chỉ có bánh với pa-tê. Just the bread and the pâté.",
    "Lò than còn nóng. The charcoal oven is still hot.",
    "Ăn ngay đi, nguội mất giòn. Eat it now, it loses its crust.",
  ],
  huTieuVn: [
    "Trần nhanh rồi xốc một cái. Blanch it fast, then one shake.",
    "Nước lèo phải trong. The stock has to stay clear.",
    "Khô hay nước? Dry or soup?",
    "Nước lèo để riêng chén nhỏ. The broth comes in its own small cup.",
    "Hẹ với tỏi phi rắc lên. Chives and fried shallot over the top.",
    "Hủ tiếu dai hay mềm? Chewy noodles or soft ones?",
  ],
  caPheVn: [
    "Cà phê phin, chờ một chút. Filter coffee, wait a moment.",
    "Nhỏ từng giọt mới ngon. It only tastes right drip by drip.",
    "Sữa đặc dưới đáy ly. The condensed milk is in the bottom of the glass.",
    "Ép chặt rồi đổ nước nóng. Press it down, then the hot water.",
    "Cà phê trên Đắk Lắk gửi về. The coffee comes down from Đắk Lắk.",
    "Ngồi ghế thấp cho mát. Take a low stool in the shade.",
  ],
  benThanhVn: [
    "Xem đồng hồ chợ mấy giờ rồi. Check the market clock for the time.",
    "Chợ mở từ sáng sớm. The market opens at first light.",
    "Rau ở dãy này, cá dãy kia. Vegetables this row, fish the next.",
    "Gánh hàng vào lối bên. Take the load in by the side aisle.",
    "Hẹn nhau ở cửa Nam. We'll meet at the south gate.",
  ],

  // --- MK1 Mekong homestead ---
  banhXeoVn: [
    "Nghe xèo một tiếng là được. When it says xèo, it's right.",
    "Tráng một vòng quanh chảo. Swirl it once around the pan.",
    "Bột có nước cốt dừa mới giòn. Coconut milk in the batter makes it crisp.",
    "Màu vàng là nghệ, không phải trứng. The yellow is turmeric, not egg.",
    "Cuốn với rau rồi chấm. Wrap it in the leaves and dip it.",
    "Bánh khọt đổ khuôn bên này. The bánh khọt go in this mould.",
  ],
  mekongKitchenVn: [
    "Quét nước màu lên cá. Brush the glaze over the fish.",
    "Kho trong tộ mới ngon. It has to be a clay pot.",
    "Canh chua nấu với me. The sour soup takes tamarind.",
    "Cơm nóng, dọn ra đi. The rice is hot, bring it out.",
    "Chan nước cá vào cơm. Spoon the fish sauce over the rice.",
    "Cả nhà ăn cùng một lượt. The family all eats at once.",
  ],
  riceSea: [
    "Sàng cho sạch trấu. Winnow the husk out.",
    "Gạo này làm bún được. This rice will make vermicelli.",
    "Gạo, bún, bánh, phở, một thứ cả. Grain, noodle, sheet, phở, all one thing.",
    "Miền Tây thì sạ, miền Bắc thì cấy. Down here we broadcast, in the north they transplant.",
    "Phơi thêm một nắng nữa. Give it one more day in the sun.",
  ],
  chickenSea: [
    "Gà nhà, nuôi dưới sàn. Yard chicken, raised under the floor.",
    "Luộc cả con rồi xé phay. Poach it whole, then tear it for salad.",
    "Nước luộc để nấu canh. Keep the poaching water for soup.",
    "Đàn gà vào bóng mát. Chickens, into the shade.",
    "Trứng sáng nay có mấy quả. A few eggs this morning.",
  ],
  fishSauce: [
    "Mở vòi từ từ. Open the tap slowly.",
    "Nước đầu để riêng ra. Keep the first draw separate.",
    "Cá cơm với muối, thế thôi. Anchovy and salt, that's all.",
    "Thùng này ủ gần một năm. This vat has been a year.",
    "Đóng vòi cho kín. Close the tap properly.",
    "Nước mắm Phú Quốc có tên riêng. Phú Quốc sauce has a name of its own.",
  ],
  riverFishVn: [
    "Nhấc lưới lên coi. Lift the net and see.",
    "Cá lóc chắc thịt, kho được. Snakehead is firm, good for the pot.",
    "Cá nhỏ thì làm mắm. The small ones go for fermenting.",
    "Nước lên thì cá vào. When the water rises the fish come in.",
    "Đặt lú ở miệng kênh. Set the trap at the channel mouth.",
  ],
  stilts: [
    "Nhà sàn cao khỏi ngập. The floor is up above the flood.",
    "Nước lên tới bậc thứ ba. The water is at the third step.",
    "Bếp ở ngoài cho thoáng khói. The hearth is outside so the smoke can go.",
    "Buộc xuồng vào cột. Tie the sampan to the post.",
    "Đưa tô lên trên nhà. Pass the bowl up into the house.",
  ],
};
