/**
 * What each Vietnamese kitchen cooks: hero first, then the dishes the place is known for.
 * Research and source URLs: docs/vietnam-research.md §4. No recipe id is forced across the 1900–1931 period boundary.
 */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string };

export const VIETNAM_REPERTOIRE: Record<string, RepertoireEntry[]> = {
  // HN1. Sources: vietnam-research.md §4.1, V4 and V9.
  hanoiKitchen: [
    { name: "Beef phở", zh: "Phở bò", line: "Flat rice noodles receive clear beef stock scented with star anise, cinnamon and clove, then scallion and sliced beef." },
    { name: "Chicken phở", zh: "Phở gà", line: "Chicken stock, flat noodles and shredded meat make the lighter bowl, finished with scallion, herbs and a squeeze of lime." },
    { name: "Stir-fried phở noodles", zh: "Phở xào", line: "Fresh flat noodles meet greens and beef in a hot pan, their edges catching while the centres remain soft." },
    { name: "Rolled phở", zh: "Phở cuốn", line: "Uncut rice sheets wrap beef and herbs into cool rolls, served with a sharp fish-sauce dipping bowl." },
  ],

  // HN1. Source: vietnam-research.md §4.1, V4.
  bunChaVn: [
    { name: "Hanoi grilled pork with vermicelli", zh: "Bún chả Hà Nội", line: "Charcoal-grilled pork patties and belly sit in seasoned fish-sauce broth beside cool vermicelli and a large herb basket." },
    { name: "Crab spring rolls", zh: "Nem cua bể", line: "Square parcels of crab, pork and glass noodles fry crisp, then share the herbs and dipping broth." },
    { name: "Grilled pork skewers", zh: "Thịt lợn nướng", line: "Thin pork slices caramelise over charcoal and arrive with rice noodles, lettuce, mint and pickled green papaya." },
    { name: "Fresh herb vermicelli", zh: "Bún rau sống", line: "Cool rice vermicelli carries mint, coriander and crisp leaves between richer bites of pork and fried roll." },
  ],

  // HN2. Technique source: vietnam-research.md §4.1, V21; regional rice context V10.
  banhCuonVn: [
    { name: "Steamed rice rolls", zh: "Bánh cuốn", line: "A thin rice sheet lifts from stretched cloth, wraps minced pork and mushroom, then takes shallots and herbs." },
    { name: "Plain steamed rice sheets", zh: "Bánh cuốn chay", line: "Unfilled translucent sheets fold loosely on the plate with fried shallot, herbs and a light dipping sauce." },
    { name: "Pork sausage with rice rolls", zh: "Bánh cuốn chả lụa", line: "Slices of smooth pork sausage sit beside warm rolls, cucumber, herbs and a bowl of seasoned fish sauce." },
    { name: "Steamed rice cakes", zh: "Bánh hấp", line: "Small rice-batter cakes steam in shallow cups and leave the same cloth-covered stove in neat batches." },
  ],

  // HN2. Context source: vietnam-research.md §4.1, V22; no origin date asserted.
  comVongVn: [
    { name: "Young green rice", zh: "Cốm", line: "Young sticky rice is roasted, pounded and winnowed into soft green flakes, then folded inside lotus leaf." },
    { name: "Green-rice cakes", zh: "Bánh cốm", line: "Green rice encloses a smooth mung-bean filling, pressed into small squares for gifts and shared tea." },
    { name: "Sweet green-rice soup", zh: "Chè cốm", line: "Green rice flakes thicken a lightly sweet soup, sometimes with lotus seed, served warm in small bowls." },
    { name: "Green rice with banana", zh: "Cốm với chuối", line: "Fresh green flakes cling to slices of ripe banana, a quiet snack needing no fire or elaborate plate." },
  ],

  // CT1. Source: vietnam-research.md §4.2, V5.
  hueKitchenVn: [
    { name: "Huế beef noodle soup", zh: "Bún bò Huế", line: "Beef and pork-bone broth carries lemongrass, shrimp paste, vermicelli, sliced meat, herbs and a bright chilli oil." },
    { name: "Rice with baby clams", zh: "Cơm hến", line: "Cool rice receives tiny clams, herbs, banana flower, peanuts and crisp pork skin with hot clam broth alongside." },
    { name: "Huế lemongrass skewers", zh: "Nem lụi", line: "Seasoned pork grips lemongrass stalks over charcoal, then wraps with herbs and rice paper before dipping." },
    { name: "Huế sweet soup", zh: "Chè Huế", line: "Beans, lotus seeds or fruit simmer separately and arrive in small bowls as the kitchen's gentle finish." },
  ],

  // CT1. Source: vietnam-research.md §4.2, V4.
  banhHueVn: [
    { name: "Steamed water-fern cakes", zh: "Bánh bèo", line: "Small rice cakes steam in shallow dishes, then take dried shrimp, scallion oil and crisp crumbs." },
    { name: "Flat shrimp rice cake", zh: "Bánh nậm", line: "A thin rice-flour paste with shrimp and pork steams flat inside a folded banana leaf." },
    { name: "Clear tapioca dumplings", zh: "Bánh bột lọc", line: "Translucent tapioca skins hold shrimp and pork, their chewy folds dressed with scallion oil and fish sauce." },
    { name: "Crisp-and-sticky dumplings", zh: "Bánh ram ít", line: "A soft glutinous dumpling sits on a crisp fried rice base, joining two textures in one bite." },
  ],

  // CT2. Sources: vietnam-research.md §4.3, V4 and V15.
  caoLauVn: [
    { name: "Hội An cao lầu", zh: "Cao lầu Hội An", line: "Thick chewy noodles carry sliced pork, herbs, bean sprouts, cracklings and only enough sauce to dress them." },
    { name: "Hội An chicken rice", zh: "Cơm gà Hội An", line: "Turmeric rice supports shredded chicken, onion, pickled vegetables and sharp local herbs in a composed plate." },
    { name: "Fried wontons", zh: "Hoành thánh chiên", line: "Open crisp wonton sheets carry pork, shrimp and a light tomato relish at the shophouse counter." },
    { name: "Braised pork noodles", zh: "Mì thịt xá xíu", line: "Slices of red-edged pork meet chewy noodles, greens and a shallow savoury dressing rather than deep broth." },
  ],

  // CT2. Source: vietnam-research.md §4.3, V5.
  miQuangVn: [
    { name: "Quảng-style noodles", zh: "Mì Quảng", line: "Broad rice noodles take one shallow ladle of turmeric broth, pork or shrimp, herbs, peanuts and sesame cracker." },
    { name: "Chicken mì Quảng", zh: "Mì Quảng gà", line: "Chicken pieces and their reduced broth sit over broad noodles with banana flower, herbs and roasted peanuts." },
    { name: "Snakehead-fish mì Quảng", zh: "Mì Quảng cá lóc", line: "Firm river fish replaces meat above the same broad noodles, herbs, small broth measure and crisp cracker." },
    { name: "Shrimp-and-pork mì Quảng", zh: "Mì Quảng tôm thịt", line: "Shrimp and pork share the bowl with quail egg, greens, peanuts and a broken sesame rice cracker." },
  ],

  // SG1. Source: vietnam-research.md §4.4, V6. Period treatment deliberately excludes the later loaded sandwich.
  banhMi: [
    { name: "Bread with pâté", zh: "Bánh mì pa-tê", line: "A crisp wheat loaf is split warm and spread with savoury liver pâté at the period street counter." },
    { name: "Plain fresh bread", zh: "Bánh mì nóng", line: "Small loaves leave the charcoal-heated oven with thin crusts, sold whole while their centres remain soft." },
    { name: "Bread with condensed milk", zh: "Bánh mì sữa", line: "Warm bread takes a modest ribbon of sweetened milk, an inexpensive counter snack with tea or coffee." },
    { name: "Bread with eggs", zh: "Bánh mì trứng", line: "A fried egg and pepper accompany torn warm bread on a plate, without becoming the later loaded sandwich." },
  ],

  // SG1. Source: vietnam-research.md §4.4, V6; no precise origin date asserted.
  huTieuVn: [
    { name: "Nam Vang hủ tiếu", zh: "Hủ tiếu Nam Vang", line: "Clear pork stock, rice noodles, minced pork, shrimp and greens arrive with herbs and lime beside them." },
    { name: "Dry hủ tiếu", zh: "Hủ tiếu khô", line: "Drained noodles take dark seasoning, pork, shrimp and scallion while a small bowl of clear broth waits alongside." },
    { name: "Seafood hủ tiếu", zh: "Hủ tiếu hải sản", line: "Shrimp, squid and fish cake top springy noodles in a clear stock sharpened with chives and pepper." },
    { name: "Pork-bone hủ tiếu", zh: "Hủ tiếu xương", line: "A meaty pork bone anchors the bowl, surrounded by noodles, greens and the stock it flavoured." },
  ],

  // MK1. Source: vietnam-research.md §4.5, V4.
  banhXeoVn: [
    { name: "Mekong sizzling crêpe", zh: "Bánh xèo miền Tây", line: "Rice-flour and coconut batter swirls around shrimp, pork and bean sprouts, crisping yellow with turmeric." },
    { name: "Fresh herb wraps", zh: "Rau sống cuốn bánh xèo", line: "Pieces of crisp crêpe wrap in lettuce with mint and coriander before entering a fish-sauce dip." },
    { name: "Coconut rice cakes", zh: "Bánh khọt", line: "Small round rice cakes crisp in their moulds with coconut batter, shrimp, scallion oil and herbs." },
    { name: "Grilled banana-leaf parcels", zh: "Bánh lá nướng", line: "Rice batter and savoury filling steam inside banana leaf before the packet chars lightly over coals." },
  ],

  // MK1. Sources: vietnam-research.md §4.5, V11 and V17.
  mekongKitchenVn: [
    { name: "Caramelised fish in a clay pot", zh: "Cá kho tộ", line: "River fish simmers with fish sauce, palm sugar and pepper until the clay pot holds a dark glaze." },
    { name: "Sour fish soup", zh: "Canh chua cá", line: "Fish, tamarind, pineapple, tomato and river vegetables make a bright soup shared over steamed rice." },
    { name: "Braised pork and eggs", zh: "Thịt kho trứng", line: "Pork belly and whole eggs cook slowly in coconut water and fish sauce until deeply burnished." },
    { name: "Steamed rice", zh: "Cơm trắng", line: "A clay pot of plain rice anchors the table and receives broth, glaze and shared bites from every dish." },
    { name: "Fresh river-fish salad", zh: "Gỏi cá", line: "Thin fish, herbs, sour fruit and roasted rice powder make a sharp plate for wrapping and sharing." },
  ],
};
