/** What each Turkish kitchen cooks: the hero first, then the dishes the place is known for. Owned by the Researcher. */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };
export const TURKEY_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  // One cart, one dish.
  simit: [
    { name: 'Simit', zh: 'Simit', line: 'A ring of dough dipped in grape molasses, rolled in sesame and baked; the cart sells nothing else.' },
  ],
  // A tea garden brews one drink and keeps a short list of things to eat beside it.
  teaGarden: [
    { name: 'Turkish tea', zh: 'Çay', line: 'Black tea from the Black Sea hills, brewed strong in the stacked pot and poured into tulip glasses.' },
    { name: 'Toasted cheese sandwich', zh: 'Tost', line: 'Cheese pressed between two slices of bread on a hot plate, the tea garden’s one cooked order.' },
    { name: 'Simit', zh: 'Simit', line: 'The sesame ring arrives on a plate beside the glass when the tea is meant to last.' },
    { name: 'Cheese bun', zh: 'Poğaça', line: 'A soft savoury bun with cheese or potato inside, bought from the counter to hold until dinner.' },
    { name: 'Ayran', zh: 'Ayran', line: 'Yogurt whisked with water and salt, served cold when the shade gets hot and tea will not do.' },
  ],
  // A kahvehane is named for coffee and pours far more tea than coffee.
  turkishCoffee: [
    { name: 'Turkish coffee', zh: 'Türk kahvesi', line: 'Finely ground coffee heated slowly in a cezve and poured unfiltered, grounds and foam, into a small cup.' },
    { name: 'Turkish delight', zh: 'Lokum', line: 'A cube of rose or pistachio lokum comes on the saucer to sweeten the first bitter sip.' },
    { name: 'Turkish tea', zh: 'Çay', line: 'More glasses of tea leave this counter than cups of coffee; a kahvehane runs on both.' },
    { name: 'Salep', zh: 'Sahlep', line: 'Hot milk thickened with orchid-tuber flour and dusted with cinnamon, the winter drink for a table without coffee.' },
    { name: 'Linden tea', zh: 'Ihlamur', line: 'Linden flowers steeped in hot water, ordered for a sore throat or an evening without caffeine.' },
  ],
  // A neighbourhood market cooks nothing itself; these are the dishes its stalls are bought for.
  bazaarTr: [
    { name: 'Stuffed peppers', zh: 'Biber dolması', line: 'The market’s fat green peppers go home to be hollowed, filled with rice and herbs, and simmered.' },
    { name: 'Shepherd’s salad', zh: 'Çoban salatası', line: 'Tomato, cucumber, onion and pepper chopped small with oil and sumac, built entirely from one morning’s stall.' },
    { name: 'Pickles', zh: 'Turşu', line: 'Cucumbers, peppers and cabbage packed into brine jars at the pickle stall and sold by the scoop.' },
    { name: 'Menemen', zh: 'Menemen', line: 'Tomatoes and green peppers softened in a pan and set with eggs, the quickest use of a full basket.' },
    { name: 'Green beans in olive oil', zh: 'Zeytinyağlı taze fasulye', line: 'Flat green beans stewed with tomato and olive oil, served cool the day after the market run.' },
  ],
  // The quay grill is one dish; the boats and the bread queue are the rest of it.
  balikEkmek: [
    { name: 'Fish sandwich', zh: 'Balık ekmek', line: 'Mackerel grilled at the rail, laid in half a loaf with onion and rocket, lemon squeezed over.' },
  ],
  // An ocakbaşı is a charcoal hearth and a skewer.
  mangal: [
    { name: 'Skewered kebab', zh: 'Şiş kebabı', line: 'Cubes of meat or yogurt-marinated chicken threaded on flat skewers and turned over the charcoal until charred.', recipe: '7d25dc26-1308-4d6b-89ae-80cc99380c09' },
  ],
  // A baklavacı bakes a counter of syruped pastries, not only the famous one.
  sweetShop: [
    { name: 'Baklava', zh: 'Baklava', line: 'Forty sheets of pastry brushed with butter around ground pistachios, baked, then soaked in syrup while hot.' },
    { name: 'Cream-filled baklava', zh: 'Şöbiyet', line: 'A baklava triangle with clotted cream folded in beside the nuts; it must be eaten the same day.' },
    { name: 'Twisted pistachio rolls', zh: 'Sarığı burma', line: 'Pastry wrapped around pistachios and coiled like a turban, cut into rounds and syruped after baking.' },
    { name: 'Layered cream pastry', zh: 'Katmer', line: 'Paper-thin dough spread with cream and pistachio, folded into a square and griddled; Gaziantep eats it for breakfast.' },
    { name: 'Shredded wheat pastry', zh: 'Tel kadayıf', line: 'Shredded pastry threads packed over nuts, baked golden and drowned in syrup, sold from the same tray counter.' },
  ],
  // A pide fırını is a bakery: the boats, the thin round, and the bread of one month.
  pideTr: [
    { name: 'Minced meat pide', zh: 'Kıymalı pide', line: 'An open boat of dough with a pinched rim, spread with spiced minced meat and baked on stone.' },
    { name: 'Cheese pide', zh: 'Kaşarlı pide', line: 'The same boat filled with yellow kaşar, which melts flat and browns along the pinched rim.' },
    { name: 'Lahmacun', zh: 'Lahmacun', line: 'A thin round topped with minced meat, onion and parsley, baked in a minute and rolled around lemon.' },
    { name: 'Ramadan bread', zh: 'Ramazan pidesi', line: 'A soft lattice-topped round baked at this oven only through Ramadan, carried home warm for the evening meal.' },
  ],
  // A village courtyard rolls one dough and turns it into the week’s breads.
  yufkaTr: [
    { name: 'Village flatbread', zh: 'Yufka', line: 'Dough rolled paper-thin with a long oklava and dried on the sac, stacked to keep for weeks.' },
    { name: 'Griddled filled flatbread', zh: 'Gözleme', line: 'A sheet of yufka folded around cheese and greens, then griddled until it blisters and browns.' },
    { name: 'Layered cheese börek', zh: 'Su böreği', line: 'Sheets boiled briefly, layered with cheese and parsley and baked; the courtyard’s whole morning goes into it.' },
    { name: 'Griddle bread', zh: 'Bazlama', line: 'A thick round of leavened flatbread cooked on the same griddle, torn open while it still steams.' },
    { name: 'Rolled börek', zh: 'Kol böreği', line: 'Yufka rolled around a filling into a long coil and baked, then cut into slices for the tea tray.' },
  ],
  // A dolma kitchen fills whatever the season leaves on the table.
  dolmaTr: [
    { name: 'Stuffed vine leaves', zh: 'Yaprak sarma', line: 'Vine leaves rolled around rice, pine nuts and currants, cooked in olive oil and served cool.' },
    { name: 'Stuffed peppers', zh: 'Biber dolması', line: 'Peppers hollowed and packed with rice, onion and herbs, sometimes minced meat, then simmered upright in the pot.' },
    { name: 'Stuffed aubergines', zh: 'Patlıcan dolması', line: 'Aubergines emptied with a corer and filled, a summer dish cooked and eaten at room temperature.' },
    { name: 'Stuffed courgettes', zh: 'Kabak dolması', line: 'Pale courgettes cored and stuffed, cooked in their own juice and served with garlic yogurt.' },
    { name: 'Cabbage rolls', zh: 'Lahana sarması', line: 'Blanched cabbage leaves rolled tight around rice and meat, packed close in the pot so they hold.' },
  ],
  // A breakfast house serves a table rather than a plate.
  kahvalti: [
    { name: 'Turkish breakfast spread', zh: 'Serpme kahvaltı', line: 'The scattered breakfast: cheeses, olives, tomato, cucumber, jam, honey and bread arriving as small plates at once.' },
    { name: 'Menemen', zh: 'Menemen', line: 'Tomato and green pepper cooked down in a pan, eggs stirred in loose, brought to the table bubbling.' },
    { name: 'Eggs with sucuk', zh: 'Sucuklu yumurta', line: 'Slices of garlicky cured sausage fried until their fat runs, eggs broken over them in the same pan.' },
    { name: 'Clotted cream and honey', zh: 'Bal kaymak', line: 'Thick buffalo cream under runny honey, scooped onto bread; the sweet end of a savoury table.' },
    { name: 'Poached eggs in yogurt', zh: 'Çılbır', line: 'Poached eggs on garlic yogurt with pepper butter poured over, an old dish still served at breakfast.' },
    { name: 'Simit', zh: 'Simit', line: 'The sesame ring turns up on the breakfast table too, torn and used to pick up cheese.' },
  ],
  // A meze table is a list by definition; the Aegean version leans on olive oil and yogurt.
  mezeTr: [
    { name: 'Herbed strained yogurt', zh: 'Haydari', line: 'Strained yogurt beaten with garlic, dill and mint, thick enough to hold the spoon upright.' },
    { name: 'Fried aubergine in tomato', zh: 'Şakşuka', line: 'Fried aubergine and pepper under a garlicky tomato sauce, served cool with bread to push it.' },
    { name: 'Broad bean purée', zh: 'Fava', line: 'Dried broad beans cooked to a purée, set in a dish and cut into slabs with dill and lemon.' },
    { name: 'Samphire in olive oil', zh: 'Deniz börülcesi', line: 'Sea beans blanched and dressed with olive oil, lemon and garlic, an Aegean plate eaten near the coast.' },
    { name: 'Artichokes in olive oil', zh: 'Zeytinyağlı enginar', line: 'Artichoke bottoms stewed with carrot, potato and peas in olive oil, served cold with dill.' },
    { name: 'Spicy pepper relish', zh: 'Acılı ezme', line: 'Tomato, pepper and walnut chopped fine and made hot with pepper paste, spread thin on the plate.' },
  ],
  // The grove’s own preparations: what happens to the fruit and the oil before they leave.
  oliveTr: [
    { name: 'Cured table olives', zh: 'Sofralık zeytin', line: 'Table olives cracked or scored and cured in brine for months until the bitterness leaves them.' },
    { name: 'Green beans in olive oil', zh: 'Zeytinyağlı taze fasulye', line: 'Green beans stewed slowly with tomato and onion in the grove’s own oil, then left to cool.' },
    { name: 'Cracked olive salad', zh: 'Kırma zeytin salatası', line: 'Cracked green olives tossed with walnut, pomegranate molasses and parsley, a breakfast plate on this coast.' },
    { name: 'Artichokes in olive oil', zh: 'Zeytinyağlı enginar', line: 'Artichokes cooked gently in new oil with lemon, the dish the Aegean makes when the oil is fresh.' },
  ],
  // The terrace household: one crop to sell, and the Black Sea dishes it eats.
  teaHillTr: [
    { name: 'Black tea', zh: 'Çay', line: 'Leaves from these rows withered, rolled and dried into black tea, then brewed double-potted in every house.' },
    { name: 'Cheese and cornmeal', zh: 'Muhlama', line: 'Cornmeal cooked in butter with fresh mountain cheese until it pulls in threads from the pan.' },
    { name: 'Cornbread', zh: 'Mısır ekmeği', line: 'Dense cornbread baked without a raising agent, the daily bread of a coast too wet for wheat.' },
    { name: 'Kale soup', zh: 'Karalahana çorbası', line: 'Black cabbage simmered with beans and cornmeal into a thick soup that carries the wet winter.' },
    { name: 'Black Sea custard pastry', zh: 'Laz böreği', line: 'Thin pastry layered around custard and baked, then dusted with sugar; the coast’s own sweet börek.' },
  ],
  // An everyday table: soup first, a pot in the middle, yogurt and bread beside it.
  supperTr: [
    { name: 'Red lentil soup', zh: 'Mercimek çorbası', line: 'Red lentils cooked soft with onion and carrot, blended smooth and served with lemon and bread first.' },
    { name: 'Turkish dumplings', zh: 'Mantı', line: 'Tiny squares of dough pinched around minced meat, boiled and covered with garlic yogurt and pepper butter.' },
    { name: 'Bulgur pilaf', zh: 'Bulgur pilavı', line: 'Cracked wheat cooked with tomato and pepper until each grain separates; it sits beside almost everything.' },
    { name: 'Stewed white beans', zh: 'Kuru fasulye', line: 'White beans stewed with tomato and a little meat, ladled over rice; the plain weekday standard.' },
    { name: 'Split stuffed aubergine', zh: 'Karnıyarık', line: 'Aubergines fried, split and filled with minced meat, onion and tomato, then baked until they collapse.' },
    { name: 'Cucumber yogurt', zh: 'Cacık', line: 'Yogurt thinned with water, with cucumber, garlic and dried mint, a cold bowl against the hot dishes.' },
  ],
  // The workshop that makes the vessel also names a dish cooked in it.
  potteryTr: [
    { name: 'Pot kebab', zh: 'Testi kebabı', line: 'Meat and vegetables sealed inside one of these clay jars and cooked until the pot is broken open.' },
  ],
  // The coppersmith’s bench supplies the one vessel a Turkish kitchen cannot replace.
  copperTr: [
    { name: 'Turkish coffee', zh: 'Türk kahvesi', line: 'The cezve hammered on this bench heats the coffee; tinned copper spreads the flame evenly and slowly.' },
  ],
  // A bath cooks nothing; the counter at its door has always sold one cold drink.
  hammamTr: [
    { name: 'Fruit sherbet', zh: 'Şerbet', line: 'Fruit and flowers steeped in sugar water and served cold at the door, the drink after the heat.' },
  ],
  // The bazaar’s sweet counter sells by weight from the same glass case.
  sweets: [
    { name: 'Baklava', zh: 'Baklava', line: 'Trays of pistachio baklava cut into diamonds, weighed out by the kilo for guests at home.' },
    { name: 'Turkish delight', zh: 'Lokum', line: 'Starch and sugar set firm with rosewater or pistachio, dusted and cut into cubes at the counter.' },
    { name: 'Halva', zh: 'Helva', line: 'Sesame paste pressed into a block, or semolina toasted in butter; both are sold in slabs by weight.' },
    { name: 'Shredded wheat pastry', zh: 'Tel kadayıf', line: 'Pastry threads baked over walnuts and syruped, sold beside the baklava from the same case.' },
  ],
  // The tray that crosses the bazaar carries one thing.
  tea: [
    { name: 'Turkish tea', zh: 'Çay', line: 'Glasses carried out on a swinging tray to whoever is behind a counter; the bazaar runs on it.' },
  ],
  // The spit is the dish.
  donerTr: [
    { name: 'Döner', zh: 'Döner kebap', line: 'Seasoned meat stacked on a vertical spit, its browned outside shaved off thin into bread.' },
  ],
  // The sac is the dish.
  gozlemeTr: [
    { name: 'Gözleme', zh: 'Gözleme', line: 'Thin dough folded around cheese, spinach or potato and cooked on a domed iron sac until spotted brown.' },
  ],
};

/** Each painted room is the same kitchen as the stand that opens it, so it declares the same repertoire. */
const ROOM_OF_STAND: Record<string, string> = {
  tr_simit: 'simit', tr_tea: 'teaGarden', tr_coffee: 'turkishCoffee', tr_market: 'bazaarTr',
  tr_fish: 'balikEkmek', tr_kebab: 'mangal', tr_baklava: 'sweetShop', tr_pide: 'pideTr',
  tr_yufka: 'yufkaTr', tr_dolma: 'dolmaTr', tr_breakfast: 'kahvalti', tr_meze: 'mezeTr',
  tr_olive: 'oliveTr', tr_tea_hill: 'teaHillTr', tr_supper: 'supperTr',
};
for (const [room, stand] of Object.entries(ROOM_OF_STAND)) TURKEY_REPERTOIRE[room] = TURKEY_REPERTOIRE[stand];
