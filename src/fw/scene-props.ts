import type { SceneHotspot } from './scene';
import { playRoomSound } from './room-sound';

export type RoomEffect = 'detail' | 'water' | 'leaves' | 'flour' | 'tea' | 'sizzle' | 'light' | 'chime' | 'purr' | 'woof';
type Point = [number, number];
export type RoomInteraction = {
  effect: RoomEffect;
  icon: string;
  wide: Point;
  phone: Point;
  /** Diameter as a fraction of the painting width, independently composed. */
  extent: [number, number];
  folder: string;
  /** Optional supplied food illustration shown in the discovery card. */
  food?: string;
  wideOnly?: boolean;
};
type Entry = { wideOnly?: boolean; label: string; text: string; effect: RoomEffect; wide: Point; phone: Point; extent?: [number, number] };
const item = (label: string, text: string, effect: RoomEffect, wide: Point, phone: Point, extent?: [number, number]): Entry => ({ label, text, effect, wide, phone, extent });
// These refer to features in the complete paintings, never inserted prop sprites.
// Each portrait was inspected separately: it is a different painting, not a crop.
const rooms: Record<string, Entry[]> = {
  noodle_shop: [
    { ...item('Greet the dog', 'The little dog answers with a soft woof.', 'woof', [.786,.61], [.5,.5], [.045,.08]), wideOnly: true },
    item("One dough, many strands", "Stretching and folding a noodle loop doubles the strands each time: two become four, then eight. The dough needs enough stretch to keep them from snapping.", 'detail', [.20,.41], [.30,.36]),
    item("The sauce starts in the bowl", "For many Sichuan noodle dishes, seasonings go into the serving bowl first. Tossing the hot noodles brings chilli oil, soy sauce and aromatics into every mouthful.", 'detail', [.46,.86], [.32,.86]),
  ],
  teahouse: [
    item('Stroke the sleeping cat', 'The cat gives a soft purr without leaving its sunny spot.', 'purr', [.26,.875], [.27,.735], [.09,.18]),
    item("Small cups, fresh pours", "Small cups let a pot of tea be shared in many little pours. The same leaves can give a different-tasting infusion each time.", 'tea', [.52,.89], [.57,.85], [.045,.12]),
    item("A lid that does two jobs", "A gaiwan is a lidded bowl, not a teapot. Tilt its lid to hold back the leaves while sipping or pouring; lift it to enjoy the aroma.", 'detail', [.82,.86], [.78,.88]),
  ],
  market: [
    item("Where a chilli keeps its heat", "Most of a chilli’s heat comes from the pale tissue holding the seeds. The seeds can pick up that heat, but they do not make the capsaicin themselves.", 'detail', [.28,.74], [.26,.74]),
    item("Shade buys freshness", "Shade slows the warming and wilting of leafy vegetables. A leafy canopy is useful market equipment as well as a pleasant place to shop.", 'leaves', [.44,.06], [.83,.12], [.14,.32]),
  ],
  home_kitchen: [
    item("The knife is a scoop, too", "The broad blade of a Chinese kitchen cleaver can slice vegetables and scoop them into a bowl. A thin slicing cleaver is not the same tool as a heavy bone chopper.", 'detail', [.56,.86], [.49,.79]),
    item("Why the wok cooks in batches", "A crowded wok cools down and traps moisture. Smaller batches give vegetables more contact with hot metal, so they fry instead of sitting in their own steam.", 'sizzle', [.20,.49], [.22,.49], [.10,.20]),
    item('Stroke the sleeping cat', 'A contented purr from the cat resting by the wall.', 'purr', [.67,.74], [.83,.68], [.09,.14]),
  ],
  tower: [
    item("A bell carries without a wire", "Striking a bell makes its metal vibrate. A large bell generally rings lower than a small one: the shape and thickness matter too.", 'chime', [.505,.175], [.42,.20], [.06,.16]),
    item("A river was a delivery route", "Before refrigerated trucks, waterways helped connect farms, markets and kitchens. A waterside town could move baskets and jars by boat instead of carrying every load overland.", 'detail', [.69,.57], [.69,.54]),
  ],
  bao_shop: [
    item("Just enough flour", "A light dusting stops dough sticking to the board. Too much loose flour on the rim can make a filled bun harder to seal.", 'flour', [.26,.70], [.32,.66]),
    item("The soup was solid first", "In xiaolongbao, a common trick is to put jellied stock inside the wrapper. It melts during steaming, making soup inside a sealed dumpling.", 'detail', [.78,.82], [.81,.62]),
  ],
  stone_bridge: [
    item("A ripple moves energy", "The ring travels outward, but the water does not all race away with it. The surface mostly rises and falls as the disturbance passes.", 'water', [.67,.69], [.63,.62], [.14,.30]),
    item("Small dishes, one shared meal", "A shared table lets crisp vegetables, rich meat and light soup balance one another. Each person can build different mouthfuls around their own bowl of rice.", 'detail', [.46,.91], [.52,.87]),
  ],
  crab_pond: [
    item("Why “hairy” crab?", "Chinese mitten crabs have furry-looking patches on their claws, like little mittens. The name comes from those claws, not a hairy shell.", 'detail', [.54,.66], [.56,.68]),
    item("Autumn changes the canopy", "As many deciduous leaves lose their green chlorophyll, yellow pigments already in the leaf become easier to see. Some trees also make red pigments in autumn.", 'leaves', [.30,.09], [.70,.06], [.12,.30]),
  ],
  jiangnan_home: [
    item("A kitchen that stacks", "Stacked steamers let one pot of boiling water cook several layers of food. Leave gaps between the buns so steam can circulate as they expand.", 'tea', [.45,.77], [.65,.57], [.13,.25]),
    item("Braising has two jobs", "A slow braise tenderises tougher cuts while its liquid gathers flavour. Reducing that liquid at the end turns it into a sauce that clings to the food.", 'detail', [.76,.85], [.49,.72]),
  ],
  lotus_garden: [
    item("The lotus keeps its leaves dry", "Tiny structures and a waxy surface make lotus leaves strongly water-repellent. Droplets bead up and roll away, often carrying dirt with them.", 'water', [.66,.65], [.67,.50], [.12,.25]),
    item("A “root” that is really a stem", "Lotus root is a rhizome: a thick stem growing through the mud. Its cut slices reveal air spaces that help the submerged plant exchange gases.", 'detail', [.48,.86], [.81,.74]),
  ],
  rice_wine: [
    item("Rice needs a starter", "Rice stores its energy as starch, which yeast cannot simply drink. A fermentation starter supplies enzymes to turn starch into sugars; yeast then makes alcohol.", 'detail', [.29,.74], [.44,.78]),
    item("Wine adds more than sweetness", "Shaoxing wine brings a fermented aroma to marinades and sauces. It is used in small amounts as a seasoning as well as being served as a drink.", 'detail', [.74,.51], [.66,.47]),
  ],
  river_market: [
    item("A floating shopfront", "A boat can carry a stall’s produce right to the quay. In a canal market, the waterway serves as a delivery lane beside the shopping lane.", 'water', [.88,.75], [.88,.46], [.08,.12]),
    item("The pond is a vegetable patch", "Lotus root grows in mud and water chestnuts are underground corms of a wetland plant. Neither has to come from a dry vegetable bed.", 'detail', [.51,.78], [.61,.77]),
  ],
  riverside_restaurant: [
    item("Ripples meet without stopping", "When ripples cross, their heights briefly add together or cancel out. Then the waves continue on: the patterns are moving energy across the surface.", 'water', [.85,.57], [.68,.405], [.10,.15]),
    item("Pass the dish, keep your bowl", "In a shared Chinese meal, the serving dishes sit in the middle while each diner keeps a rice bowl. Serving chopsticks or spoons help everyone share the same plates.", 'detail', [.53,.77], [.53,.67]),
  ],
  tea_hill: [
    item("Same plant, different tea", "Green and black tea both come from Camellia sinensis. Processing after picking, especially how much the leaves oxidise, helps create their very different flavours.", 'tea', [.46,.78], [.44,.83], [.04,.10]),
    item("The youngest leaves matter", "Many fine green teas use tender buds and young leaves. For Longjing, heating the leaves in a pan also helps give them their characteristic flat shape.", 'detail', [.20,.79], [.77,.75]),
  ],
  skewer_courtyard: [
    item("The crackle comes from fat", "Dripping fat can flare when it meets hot coals. Turning the skewers spreads the heat; moving them away from a flare helps prevent a scorched surface.", 'sizzle', [.32,.66], [.36,.58], [.22,.50]),
    item("Cumin is a fruit in disguise", "The spice we call cumin seed is botanically a small dried fruit. Crushing it releases more of its fragrant oils just before it meets the hot meat.", 'detail', [.77,.79], [.73,.77]),
  ],
  mantou_kitchen: [
    item("The pause makes the puff", "Yeast releases gas into mantou dough while it rests. The stretchy dough traps those bubbles, giving the steamed bun its light interior.", 'flour', [.22,.70], [.48,.48]),
    item("A bun without a filling", "Mantou are usually unfilled steamed wheat buns; baozi have a filling. Steaming keeps the surface soft instead of making an oven-browned crust.", 'detail', [.57,.67], [.31,.73]),
  ],
  dumpling_house: [
    item("Thin edge, stronger middle", "A wrapper can be rolled thinner around its edge than at the centre. The middle supports the filling, while the thin rim avoids a bulky seam when folded.", 'flour', [.28,.66], [.49,.64]),
    item("A pleat is a seal", "Dumpling pleats gather a wide wrapper around its filling. Keeping filling off the rim matters more than making a perfect pattern: a clean seam is easier to seal.", 'detail', [.40,.86], [.58,.79]),
  ],
  winter_table: [
    item("Soup keeps cooking after the heat", "A deep pot holds warmth longer than a shallow plate. That is why a soup can stay hot at the table while small dishes cool quickly.", 'tea', [.59,.66], [.50,.59], [.12,.25]),
    item("Cabbage earns its winter place", "Whole cabbages and sturdy roots keep longer than tender summer greens under suitable cool storage. Preserving vegetables stretches that winter pantry even further.", 'detail', [.65,.82], [.54,.69]),
  ],
  courtyard_kitchen: [
    item("Dough needs time off", "If a wrapper springs back as you roll it, the dough may need a rest. Resting lets the gluten relax, making it easier to roll thin.", 'flour', [.50,.64], [.53,.53]),
    item("Keep the filling from flooding", "Chopped vegetables can release water into a dumpling filling. For cabbage fillings, salting and squeezing the cabbage first can help keep the wrappers from turning soggy.", 'detail', [.51,.83], [.57,.73]),
  ],
  hutong: [
    item('Stroke the cat', 'A contented purr from the cat beside the lane.', 'purr', [.89,.835], [.53,.685], [.08,.16]),
    item("A leaf makes its own food", "Leaves use sunlight to turn water and carbon dioxide into sugars. Before many trees shed autumn leaves, they recover some of the nutrients stored inside them.", 'leaves', [.72,.07], [.80,.06], [.13,.30]),
    item("A meal made by many hands", "Dumplings divide naturally into small jobs: mixing filling, rolling wrappers and folding. A group can make a big batch while everyone sits around the same table.", 'detail', [.24,.59], [.30,.55]),
  ],
  bing_stall: [
    item("Brown patches mean flavour", "A hot griddle dries and browns the dough where it touches. That browning creates toasted flavours that a pale steamed bun does not have.", 'sizzle', [.43,.51], [.58,.42], [.18,.34]),
    item("The trick between the layers", "In many flaky bing, oil separates thin sheets of dough. Rolling and coiling those sheets makes layers that can pull apart after cooking.", 'detail', [.69,.67], [.29,.74]),
  ],
  north_market: [
    item("Flour keeps strands separate", "Freshly cut noodles expose damp surfaces that like to stick together. A light dusting of flour helps keep the strands separate before they reach the pot.", 'flour', [.28,.67], [.29,.47]),
    item("Dried mushrooms wake up again", "Drying removes much of a mushroom’s water and makes it easy to store. Soaking dried shiitake brings back a supple texture and produces an aromatic soaking liquid.", 'detail', [.66,.80], [.69,.72]),
  ],
  noodle_workshop: [
    item("Stretchy dough has a network", "When wheat flour meets water, its proteins can form gluten. Kneading develops that stretchy network, which helps a noodle pull into a strand instead of breaking.", 'flour', [.46,.63], [.58,.57]),
    item("Fold once, double the strands", "In a folded hand-pulling method, each fold doubles the strands. Six doublings turn one strand into 64, before the noodles even reach the pot.", 'detail', [.26,.38], [.43,.37]),
  ],
  roast_duck: [
    item("Dry skin turns crisp", "Roast duck skin is dried before roasting so it can brown and crisp more readily. A wet surface spends much of its early cooking time losing water.", 'detail', [.38,.65], [.56,.57]),
    item("A bite with contrast", "A duck pancake combines crisp skin, soft wrapper, crunchy vegetables and sweet-savoury sauce. The accompaniments change the texture of each bite, not just its size.", 'detail', [.63,.84], [.59,.78]),
  ],
  vinegar_workshop: [
    item("Vinegar takes two fermentations", "Yeast first turns sugars into alcohol. Then acetic acid bacteria use oxygen to turn that alcohol into the acid that gives vinegar its sharp taste.", 'detail', [.28,.76], [.18,.71]),
    item("Dark does not just mean sour", "Grain vinegars can bring malty, toasted and aged aromas as well as acidity. A small dipping bowl lets you add that sharpness a mouthful at a time.", 'detail', [.80,.57], [.67,.59]),
  ],
  wheat_harvest: [
    item("A grain has three main parts", "A wheat grain contains bran, germ and a starchy endosperm. White flour is mostly milled endosperm; whole-wheat flour includes all three parts.", 'flour', [.86,.86], [.72,.65]),
    item("Wheat becomes a whole menu", "The same grain can become pulled noodles, steamed mantou or griddled bing. Changing the dough, shaping and cooking method changes the texture of the meal.", 'detail', [.66,.65], [.33,.51]),
  ],
  kebab_grill: [
    item("Small pieces cook quickly", "Cutting meat into small, similar-sized pieces helps a skewer cook evenly. The thin skewer also makes it easy to turn every piece together over the coals.", 'sizzle', [.57,.70], [.42,.58], [.25,.48]),
    item("Bread catches the good bits", "Bread served with kebabs can catch meat juices and loose seasoning. Onion brings a crisp, sharp bite alongside the rich grilled meat.", 'detail', [.34,.87], [.75,.75]),
  ],
  naan_bakery: [
    item("Why dough fights the rolling pin", "Freshly worked wheat dough can spring back because of its gluten network. A covered rest makes shaping easier and keeps the surface from drying out.", 'flour', [.23,.69], [.53,.52]),
    item("The stamp controls the puff", "Pricking the centre of a round nan helps keep it flatter while the thicker rim rises. The pattern is useful baking work as well as decoration.", 'detail', [.69,.82], [.66,.83]),
  ],
  polo_kitchen: [
    item("One pot flavours the rice", "In polo, rice cooks with the flavours of the meat, onions and carrots. As it absorbs liquid, it takes those flavours into the grains.", 'sizzle', [.42,.84], [.46,.67], [.20,.44]),
    item("Carrots can be yellow", "Carrots are not always orange: yellow varieties are also used in Xinjiang polo. Cooking the carrots brings sweetness to a dish built around rice and meat.", 'detail', [.23,.86], [.42,.78]),
  ],
  laghman_shop: [
    item("Long noodles need relaxed dough", "Laghman dough is often rested and oiled before pulling. Rest makes it easier to stretch; oil helps keep the long strands from sticking together.", 'flour', [.40,.65], [.50,.54]),
    item("The topping is part of the dish", "Laghman pairs pulled noodles with a meat-and-vegetable sauce, often called say. The sauce coats the noodles rather than turning every bowl into noodle soup.", 'detail', [.55,.79], [.61,.69]),
  ],
  oasis_bazaar: [
    item("Melons come in many colours", "Melon flesh can be white, green or orange depending on the variety. Colour alone does not tell you whether a melon will taste sweet.", 'detail', [.40,.71], [.82,.65]),
    item("A raisin is a smaller grape", "Drying grapes removes water, leaving their sugars in a much smaller package. That is why a handful of raisins tastes so intensely sweet.", 'detail', [.26,.85], [.37,.72]),
  ],
  grape_courtyard: [
    item("A vine makes summer shade", "A grape canopy shades the courtyard during the growing season. When a deciduous vine drops its leaves, more winter sunlight can reach the space below.", 'leaves', [.65,.08], [.60,.09], [.16,.35]),
    item("A table of different textures", "Fresh grapes are juicy, raisins are chewy and nuts are crisp. Serving them with bread and tea makes a varied spread from foods that need little last-minute cooking.", 'detail', [.60,.72], [.53,.60]),
  ],
  oasis_field: [
    item("Water travels underground, too", "Turpan’s karez system carries groundwater through underground channels to fields and settlements. Keeping much of the route below ground limits evaporation in the dry climate.", 'water', [.77,.74], [.84,.46], [.08,.10]),
    item("Drying saves a grape harvest", "Fresh grapes are seasonal and easily damaged. Drying some of the crop into raisins makes it easier to store and carry beyond harvest time.", 'detail', [.27,.78], [.43,.78]),
  ],
  chaikhana: [
    item("Tea changes with each pour", "A short infusion and a long infusion do not taste the same. More time lets water draw more substances from the leaves, including bitter and astringent ones.", 'tea', [.64,.66], [.64,.56], [.04,.10]),
    item("Nan is more than a side", "A round nan can be broken and shared at the table. Its firm crust and soft centre work with tea, fruit or the juices of a cooked dish.", 'detail', [.51,.77], [.50,.68]),
  ],
  xj_home: [
    item("One dough, different thicknesses", "A thick piece of dough takes longer to cook through than a thin wrapper. Even shaping helps a batch finish cooking at the same time.", 'flour', [.28,.65], [.43,.48]),
    item("Cut for the cooking time", "Carrots take longer to soften than leafy greens. Cutting firm vegetables smaller, or adding them earlier, helps everything reach the table ready together.", 'detail', [.49,.81], [.45,.65]),
  ],
  caravan_stop: [
    item("A pause while tea steeps", "Tea flavour needs time to move from the leaves into the water. Hotter water generally extracts it faster; longer is not always better for a delicate tea.", 'tea', [.15,.54], [.28,.53], [.045,.12]),
    item("A travelling pantry", "Dried fruit and nuts pack a lot into a small space and keep better than juicy cut fruit. Alongside bread, they make practical food for a journey.", 'detail', [.29,.82], [.46,.73]),
  ],
  tianshan: [
    item("Mountains feed an oasis", "Snow and glacier melt from the Tianshan help supply rivers and irrigation downstream. A green oasis can depend on water that began far above the fields.", 'water', [.72,.85], [.73,.87], [.12,.27]),
    item("A field needs more than sunshine", "A dry climate can offer plenty of sun but little rain. Irrigation is what lets orchards and vegetable fields grow beyond the river’s immediate banks.", 'detail', [.20,.83], [.25,.77]),
  ],
  evening_feast: [
    item("Warm light changes the table", "A warm lantern makes reds and golds stand out differently from cool daylight. The food has not changed, but its colours can look richer under the light.", 'light', [.14,.15], [.11,.22], [.07,.18]),
    item("The feast has a rhythm", "Bread, grilled meat, vegetables and fruit offer different temperatures and textures. Sharing several dishes lets each guest make their own sequence of bites.", 'detail', [.62,.78], [.58,.74]),
  ],
};
const icons: Record<RoomEffect, string> = { detail: '⌕', water: '≈', leaves: '❧', flour: '⋯', tea: '♨', sizzle: '♨', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
export function roomProps(id: string, portraitPoint: (x: number, y: number) => { x: number; y: number }): SceneHotspot[] {
  return (rooms[id] ?? []).map((entry, i) => ({
    id: `room-${i}`, label: entry.label, text: entry.text,
    x: entry.wide[0] * 1600, y: entry.wide[1] * 900, portrait: portraitPoint(...entry.phone),
    interaction: { ...entry, icon: icons[entry.effect], extent: entry.extent ?? [.12,.28], folder: id === 'tower' ? 'historical_tower' : id },
  }));
}

/** Local, finite effects. No whole-object translation, artwork replacement or floating props. */
export function animateRoomTouch(host: HTMLElement, interaction: RoomInteraction, trigger?: HTMLElement): () => void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes: HTMLElement[] = [], animations: Animation[] = [];
  const effect = interaction.effect;
  if (effect !== 'detail') trigger?.classList.add('room-responding');
  const spread = Math.max(85, Math.min(180, host.clientWidth || 120));
  // One disturbance in the water; a few leaves, not a shower of confetti.
  const count = reduced ? 1 : effect === 'water' ? 3 : effect === 'leaves' ? 4 : effect === 'flour' ? 24 : effect === 'sizzle' ? 40 : effect === 'tea' ? 25 : effect === 'chime' || effect === 'purr' || effect === 'woof' ? 5 : 1;
  for (let i = 0; i < count; i++) {
    const node = document.createElement('i');
    node.className = `room-response-particle ${reduced ? 'still' : effect}`;
    host.append(node); nodes.push(node);
    let frames: Keyframe[];
    let duration = 1600, delay = 0;
    let easing = 'ease-out';
    if (effect === 'water') {
      frames = [
        { opacity: 0, transform: 'translate(-50%,-50%) scale(.08)' },
        { opacity: .72 - i * .1, offset: .14, transform: 'translate(-50%,-50%) scale(.24)' },
        { opacity: .36, offset: .48, transform: 'translate(calc(-50% + 1px),-50%) scale(.62)' },
        { opacity: .12, offset: .78, transform: 'translate(calc(-50% + 3px),-50%) scale(.94)' },
        { opacity: 0, transform: 'translate(calc(-50% + 4px),-50%) scale(1.1)' },
      ];
      duration = 2600 + i * 160; delay = i * 420; easing = 'linear';
    } else if (effect === 'leaves') {
      const autumn = interaction.folder === 'hutong' || interaction.folder === 'crab_pond';
      const colours = autumn ? ['#b77a37', '#ba9145', '#99683d', '#a85d36'] : ['#718143', '#87964e', '#607640', '#9b9c55'];
      const size = 8 + i % 3 * 2;
      node.style.left = `${35 + i * 9}%`; node.style.top = `${43 + i % 2 * 7}%`;
      node.style.width = `${size}px`; node.style.height = `${size * 1.55}px`; node.style.backgroundColor = colours[i];
      const wind = (i % 2 ? 1 : -1) * spread * .13;
      const fall = spread * (.55 + i * .07), turn = i * 31 - 35;
      frames = [
        { opacity: 0, transform: `translate(0,0) rotate(${turn}deg) scaleX(.8)` },
        { opacity: .85, offset: .1, transform: `translate(${wind * .3}px,${fall * .03}px) rotate(${turn + 12}deg) scaleX(1)` },
        { opacity: .85, offset: .3, transform: `translate(${wind}px,${fall * .18}px) rotate(${turn + 40}deg) scaleX(.45)` },
        { opacity: .8, offset: .52, transform: `translate(${wind * .25}px,${fall * .4}px) rotate(${turn - 20}deg) scaleX(.9)` },
        { opacity: .65, offset: .73, transform: `translate(${-wind * .5}px,${fall * .68}px) rotate(${turn - 45}deg) scaleX(.35)` },
        { opacity: 0, transform: `translate(${wind * .4}px,${fall}px) rotate(${turn + 5}deg) scaleX(.7)` },
      ];
      duration = 3400 + i * 370; delay = i * 290; easing = 'ease-in-out';
    } else if (effect === 'flour') {
      const cloud = i < 8;
      node.className += cloud ? ' flour-cloud' : ' flour-grain';
      const lane = cloud ? i / 7 : (i - 8) / 15;
      const dx = (lane - .5) * spread;
      const rise = spread * (.3 + .25 * Math.sin(lane * Math.PI));
      if (cloud) {
        const size = Math.max(24, spread * .26);
        node.style.width = `${size}px`; node.style.height = `${size * .7}px`;
      }
      frames = [
        { opacity: 0, transform: 'translate(-50%,-50%) scale(.25)' },
        { opacity: cloud ? .8 : .95, offset: .12, transform: `translate(calc(-50% + ${dx * .3}px),calc(-50% - ${rise * .35}px)) scale(.8)` },
        { opacity: cloud ? .55 : .8, offset: .45, transform: `translate(calc(-50% + ${dx * .8}px),calc(-50% - ${rise}px)) scale(${cloud ? 1.8 : 1})` },
        { opacity: 0, transform: `translate(calc(-50% + ${dx}px),calc(-50% - ${cloud ? rise * .6 : 2}px)) scale(${cloud ? 2.6 : .7})` },
      ];
      duration = cloud ? 2200 : 1650; delay = (i % 8) * 22;
    } else if (effect === 'sizzle' || effect === 'tea') {
      const smoke = effect === 'sizzle' && i % 5 === 0;
      if (smoke) node.className += ' grill-smoke';
      node.style.left = `${15 + ((i * 17) % 70)}%`;
      const dx = (i % 5 - 2) * 9;
      const rise = effect === 'tea' || smoke ? 95 : 42;
      frames = [
        { opacity: 0, transform: 'translate(-50%,-50%) scale(.35)' },
        { opacity: smoke ? .55 : .85, offset: .15 },
        { opacity: smoke ? .3 : .5, offset: .5 },
        { opacity: 0, transform: `translate(calc(-50% + ${dx}px),calc(-50% - ${rise}px)) scale(${effect === 'tea' || smoke ? 2.5 : 1.2})` },
      ];
      duration = effect === 'tea' || smoke ? 2800 : 1400; delay = i * (effect === 'tea' ? 55 : 28);
    } else if (effect === 'chime' || effect === 'purr' || effect === 'woof') {
      frames = [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.5)' }, { opacity: .85, offset: .2 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1.25)' }];
      duration = 2200; delay = i * 220;
    } else {
      frames = [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: .8, offset: .65 }, { opacity: 0 }];
      duration = 2400;
    }
    animations.push(node.animate(reduced ? [{opacity: 0}, {opacity: .5}, {opacity: 0}] : frames, {duration: reduced ? 350 : duration, delay: reduced ? 0 : delay, fill:'both', easing}));
  }
  const stopSound = effect === 'detail' || effect === 'light' ? () => {} : playRoomSound(effect);
  let done = false;
  const clearVisuals = () => { if (done) return; done = true; animations.forEach(a => a.cancel()); nodes.forEach(n => n.remove()); trigger?.classList.remove('room-responding'); };
  // Reduced motion shortens the visual only, not the audible response.
  Promise.all(animations.map(a => a.finished)).then(clearVisuals, () => {});
  return () => { clearVisuals(); stopSound(); };
}
