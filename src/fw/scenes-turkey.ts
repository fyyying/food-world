/** The 15 supplied Turkey paintings. Wide and phone anchors follow their separate compositions. */
import { paintedScene, pAt, type PaintedCfg } from './scene-painted';
import type { SceneDef, SceneHotspot } from './scene';
import type { RoomEffect } from './scene-props';

type Point = [number, number];
type Touch = [label: string, text: string, effect: RoomEffect, wide: Point, phone: Point, food?: string];
type PairedPoint = [wide: Point, phone: Point];
type Ambience = {
  steam?: { at: PairedPoint; width?: number; rate?: number; alpha?: number }[];
  fire?: { at: PairedPoint; radius?: [number, number] }[];
  leaves?: number;
  petals?: { color: string; rate: number; size?: number };
};
type Room = { title: string; zh: string; caption: string; touches: Touch[]; ambience: Ambience; night?: boolean };
const rooms: Record<string, Room> = {
  tr_simit: {
    title: 'Simit by the ferry', zh: 'Simitçi', caption: 'Sesame rings, a glass of tea, and the next ferry across the Bosphorus.',
    ambience: { steam: [{ at: [[.23,.58],[.12,.51]], width: 82, rate: 9, alpha: .28 }] },
    touches: [
      ['Break a sesame ring', 'A simit gets its glossy crust from a molasses dip before it is rolled in sesame. Pick up a ring for the ferry, or sit down with cheese and tea.', 'detail', [.28,.70], [.34,.54], 'simit'],
      ['Tea before the crossing', 'Steam curls from the tea glass. There is time for a sip before the ferry leaves.', 'tea', [.23,.58], [.12,.51]],
      ['Follow the ferry wake', 'A small ripple spreads across the water beyond the quay.', 'water', [0.84,0.372], [0.58,0.341]],
    ],
  },
  tr_tea: {
    title: 'Tea under the plane tree', zh: 'Çay bahçesi', caption: 'A tray of tulip glasses, backgammon on the table, and the water just beyond the shade.',
    ambience: { steam: [{ at: [[.325,.686],[.54,.858]], width: 84, rate: 9, alpha: .28 }], leaves: 3.8 },
    touches: [
      ['Pour another çay', 'The tea sends up a fresh curl of steam. Strong tea from the upper pot is diluted with hot water to taste.', 'tea', [.325,.686], [.54,.858]],
      ['A tray for company', 'The waiter carries several tulip glasses together. Offering tea welcomes a guest; another round gives the conversation more time.', 'detail', [.60,.44], [.40,.345]],
      ['An afternoon game', 'Tavla is backgammon: two players, dice and a board. In a tea garden the game shares the table with tea and conversation.', 'detail', [.24,.76], [.51,.71]],
    ],
  },
  tr_coffee: {
    title: 'The neighbourhood coffeehouse', zh: 'Kahvehane', caption: 'Coffee warms in a cezve while friends linger over their small cups.', night: true,
    ambience: { steam: [{ at: [[.13,.60],[.19,.61]], width: 76, rate: 8, alpha: .30 }] },
    touches: [
      ['Warm the cezve', 'A little steam rises as finely ground coffee warms slowly in the cezve.', 'tea', [.13,.60], [.19,.61]],
      ['Let the grounds settle', 'Turkish coffee is served unfiltered in a small cup. Let the fine grounds settle before sipping; water is commonly served alongside.', 'detail', [.26,.85], [.29,.76], 'coffee'],
      ['A cup with company', 'Coffee is part of a visit: a welcome, a pause, and time to talk. Preparation and hospitality belong to the same tradition.', 'detail', [0.76,0.63], [0.72,0.49]],
    ],
  },
  tr_market: {
    title: 'The neighbourhood market', zh: 'Semt pazarı', caption: 'Tomatoes, peppers, olives and herbs go home in baskets for the evening meal.',
    ambience: { leaves: 2.8 },
    touches: [
      ['What is good today?', 'A neighbourhood market follows the season. Look for tomatoes, peppers, aubergines and herbs, then follow them into the dolma kitchen.', 'detail', [0.31,0.49], [0.25,0.53], 'dolma'],
      ['Choose the olives', 'Green and dark olives bring different flavours to breakfast and small plates. Oil from the grove travels into vegetable dishes as well.', 'detail', [0.25,0.735], [0.39,0.61], 'olive-oil'],
      ['Move the leaves', 'A breeze stirs the leaves above the stalls.', 'leaves', [0.225,0.055], [0.55,0.065]],
    ],
  },
  tr_fish: {
    title: 'Fish at the Bosphorus quay', zh: 'Balık ekmek', caption: 'A hot grill, lemon and a fish sandwich beside the ferry landing.',
    ambience: { steam: [{ at: [[.87,.73],[.76,.74]], width: 68, rate: 7, alpha: .24 }] },
    touches: [
      ['Choose a fish', 'Fish are laid out at the counter. The next stop is the grill, then bread, greens and a squeeze of lemon.', 'detail', [0.25,0.63], [0.28,0.574]],
      ['Build a balık ekmek', 'Grilled fish goes into bread with onion and greens. The sandwich belongs to Istanbul’s waterfront rhythm: order, eat and watch the boats.', 'detail', [0.84,0.592], [0.73,0.79], 'balik-ekmek'],
      ['Watch the water', 'Ripples travel out from the quay into the boat channel.', 'water', [.67,.355], [.72,.28]],
    ],
  },
  tr_kebab: {
    title: 'At the charcoal counter', zh: 'Ocakbaşı', caption: 'The cook turns the skewers; bread, grilled peppers and onion reach the table.',
    ambience: {
      steam: [{ at: [[.40,.66],[.47,.55]], width: 150, rate: 15, alpha: .36 }],
      fire: [{ at: [[.30,.78],[.35,.63]], radius: [64, 34] }],
    },
    touches: [
      ['Turn the şiş', 'The coals crackle beneath the skewers. Turning them lets each side meet the heat.', 'sizzle', [.40,.66], [.47,.55]],
      ['Bread catches the juices', 'Tear warm bread to accompany the grill. It picks up the meat juices and makes a good wrap for onion, herbs and a piece of grilled pepper.', 'detail', [.86,.73], [.20,.744]],
      ['Onion, sumac and herbs', 'Thin onion and fresh herbs bring crunch and freshness beside the charcoal grill. Tart sumac is a familiar seasoning for an onion salad.', 'detail', [.56,.827], [.40,.815]],
    ],
  },
  tr_baklava: {
    title: 'The baklava workshop', zh: 'Baklavacı', caption: 'Thin pastry, butter and pistachios, with trays cut before they enter the oven.',
    ambience: { petals: { color: '#e8d7ad', rate: .22, size: 3.5 } },
    touches: [
      ['Dust the pastry board', 'A small puff of flour lifts from the work surface as the dough is rolled thin.', 'flour', [0.35,0.68], [0.48,0.59]],
      ['Look between the layers', 'Baklava layers thin pastry with butter and nuts, then receives syrup after baking. Gaziantep is especially associated with pistachio baklava.', 'detail', [0.72,0.79], [0.44,0.68], 'baklava'],
      ['Meet the pistachio', 'Pistachios bring colour, texture and a rich nut flavour. The chopped nuts are spread between the pastry layers.', 'detail', [0.1,0.7], [0.1,0.7], 'pistachios'],
    ],
  },
  tr_pide: {
    title: 'The pide oven', zh: 'Pide fırını', caption: 'Long loaves and thin rounds wait beside the hot stone oven.',
    ambience: {
      steam: [{ at: [[.91,.34],[.40,.33]], width: 132, rate: 12, alpha: .30 }],
      fire: [{ at: [[.91,.34],[.40,.33]], radius: [68, 36] }],
    },
    touches: [
      ['Shape the dough', 'Flour lifts from the board. The edges are pinched around the filling before the pide goes into the oven.', 'flour', [.24,.59], [.31,.59]],
      ['The boat-shaped pide', 'Pide can hold cheese, meat or other fillings. Its raised rim keeps the filling inside while the base bakes on the hot oven floor.', 'detail', [.73,.80], [.72,.81], 'pide'],
      ['A thin round of lahmacun', 'Lahmacun is a thin flatbread topped with minced meat, vegetables and herbs. Add parsley and lemon, then fold or roll it to eat.', 'detail', [.23,.82], [.28,.78], 'lahmacun'],
    ],
  },
  tr_yufka: {
    title: 'Bread in the village courtyard', zh: 'Yufka ve gözleme', caption: 'Dough is rolled at a shared table while flatbreads cook nearby.',
    ambience: {
      steam: [{ at: [[.87,.42],[.87,.25]], width: 128, rate: 11, alpha: .28 }],
      fire: [{ at: [[.87,.42],[.87,.25]], radius: [62, 34] }],
    },
    touches: [
      ['Flour the rolling board', 'A light cloud rises from the board. A little flour helps the thin dough release without tearing.', 'flour', [.27,.654], [.36,.653]],
      ['Bread from the oven', 'The baked rounds are stacked on a cloth. Bread takes several forms in Turkish kitchens: thin yufka, filled gözleme and oven-baked loaves each need different handling and heat.', 'detail', [.87,.76], [.20,.79]],
      ['Flour for the next batch', 'A bowl of flour stays within reach of the rolling boards. Shared preparation lets one person roll while another tends the oven and someone else gathers the baked bread.', 'flour', [.48,.84], [.53,.744]],
    ],
  },
  tr_dolma: {
    title: 'The family dolma kitchen', zh: 'Dolma ve sarma', caption: 'Peppers to fill, leaves to roll, and several hands around one table.',
    ambience: { steam: [{ at: [[.69,.45],[.68,.44]], width: 108, rate: 10, alpha: .30 }] },
    touches: [
      ['Let the pot simmer', 'Steam rises gently from the pot as the filled vegetables cook together.', 'tea', [.69,.45], [.68,.44]],
      ['Fill or wrap?', 'Dolma describes something filled, such as a pepper. Sarma describes something wrapped, such as a vine leaf rolled around its filling.', 'detail', [0.25,0.715], [0.75,0.585], 'sarma'],
      ['A kitchen for many hands', 'Rice, herbs and seasoning are prepared before the filling begins. Recipes vary: some include meat, while olive-oil versions are often served cool.', 'detail', [0.44,0.607], [0.42,0.52], 'dolma'],
    ],
  },
  tr_breakfast: {
    title: 'A long breakfast', zh: 'Kahvaltı', caption: 'Bread, cheese, olives, eggs and tea spread across the table, with time to share.',
    ambience: {
      steam: [{ at: [[.78,.72],[.808,.532]], width: 78, rate: 8, alpha: .27 }],
      petals: { color: '#b9a56b', rate: .12, size: 5 },
    },
    touches: [
      ['Refill the breakfast tea', 'Another curl of steam rises from the tea glass. Breakfast can last as long as the conversation.', 'tea', [0.78,0.72], [0.808,0.532]],
      ['Small plates to share', 'Kahvaltı brings sweet and savoury tastes together: cheese, olives, tomatoes, cucumber, bread, honey and more. What is served varies by household and region.', 'detail', [.51,.76], [.47,.70], 'breakfast'],
      ['Bread for the last bite', 'Simit, fresh bread or pastry can accompany the spread. Tear a piece to pick up cheese or the last of the eggs.', 'detail', [0.19,0.592], [0.21,0.78], 'simit'],
    ],
  },
  tr_meze: {
    title: 'Small plates by the water', zh: 'Meze sofrası', caption: 'Cool yogurt, vegetables and herbs arrive before the next warm dish.', night: true,
    ambience: { petals: { color: '#83965f', rate: .16, size: 6 } },
    touches: [
      ['Make room for another plate', 'Meze invites a little of several dishes. Yogurt with herbs, aubergine, olives and vegetable preparations bring different tastes to a shared table.', 'detail', [.48,.77], [.51,.73], 'meze'],
      ['Olive oil meets vegetables', 'Olive oil carries flavour through many vegetable dishes. A plate can be served cool as part of the same meal as a hot grill.', 'detail', [0.7,0.723], [0.75,0.672], 'meze-bowls'],
      ['Cool yogurt and herbs', 'Yogurt brings a cool, tangy contrast to warm dishes. Herbs and olive oil turn a simple bowl into another small plate to share.', 'detail', [.636,.813], [.46,.678], 'yogurt'],
    ],
  },
  tr_olive: {
    title: 'The Aegean olive grove', zh: 'Zeytinlik', caption: 'Silver-green leaves, baskets at the trees, and oil on the kitchen table.',
    ambience: { petals: { color: '#7f8d59', rate: .24, size: 7 } },
    touches: [
      ['Stir the olive leaves', 'The leaves shift in the breeze above the harvest baskets.', 'leaves', [0.075,0.13], [0.56,0.07]],
      ['From olive to oil', 'Harvested olives are crushed and their oil is separated. That oil becomes part of everyday cooking, from breakfast bread to vegetables and fish.', 'detail', [0.9,0.57], [0.91,0.545], 'olive-oil'],
      ['Fruit for the table', 'An olive straight from the tree is very bitter. Table olives are cured before they arrive at breakfast.', 'detail', [0.13,0.79], [0.29,0.603], 'olive-branch'],
    ],
  },
  tr_tea_hill: {
    title: 'The Black Sea tea hills', zh: 'Karadeniz çaylıkları', caption: 'Green rows climb the wet hills, and baskets follow the pickers along the terraces.',
    ambience: { petals: { color: '#78965b', rate: .18, size: 5 } },
    touches: [
      ['Brush the tea leaves', 'Young leaves stir above the rows. The path stays between the bushes.', 'leaves', [0.32,0.75], [0.32,0.716]],
      ['From green leaf to black tea', 'The leaf is withered, rolled, oxidised and dried to make black tea. The green plant and the dark drink belong to the same journey.', 'detail', [0.525,0.735], [0.83,0.78], 'tea-leaves'],
      ['The Black Sea below', 'The sea lies below the steep green slopes. The humid eastern Black Sea climate supports the tea gardens around Rize; the harvest then travels to kitchens across Türkiye.', 'water', [.889,.312], [.881,.236]],
    ],
  },
  tr_supper: {
    title: 'An Anatolian evening table', zh: 'Akşam sofrası', caption: 'Hot pots, bulgur, vegetables and bread gather everyone for the evening meal.',
    ambience: { steam: [{ at: [[.571,.531],[.658,.510]], width: 106, rate: 10, alpha: .30 }] },
    touches: [
      ['Tea at the evening table', 'A small glass of tea stays close to hand. Let the steam rise while everyone passes the dishes around the table.', 'tea', [.571,.531], [.658,.510]],
      ['A dish of bulgur', 'Bulgur is wheat that has been cooked, dried and cracked. It can become pilaf, soup or a salad such as kısır.', 'detail', [0.484,0.681], [0.563,0.556], 'bulgur'],
      ['Yogurt at the table', 'A bowl of yogurt offers a cool, tangy contrast to the warm pilaf and grilled food. Yogurt also becomes drinks, soups and sauces in Turkish home cooking.', 'detail', [.358,.788], [.796,.642], 'yogurt'],
      ['A familiar bowl of soup', 'Mercimek çorbası is lentil soup, often served with bread and lemon. It can begin a larger meal or be a simple meal in itself.', 'detail', [0.292,0.882], [0.381,0.72], 'lentil-soup'],
    ],
  },
};

const icons: Record<RoomEffect, string> = { detail: '⌕', tea: '♨', sizzle: '♨', flour: '⋯', leaves: '❧', water: '≈', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
function makeRoom(id: string, room: Room): SceneDef {
  const hotspots: SceneHotspot[] = room.touches.map(([label, text, effect, wide, phone, food], i) => ({
    id: `${id}-${i}`, label, text, x: wide[0] * 1600, y: wide[1] * 900, portrait: pAt(id, ...phone),
    interaction: { effect, icon: icons[effect], wide, phone, extent: effect === 'tea' ? [.045,.10] : [.10,.22], folder: id, food },
  }));
  const cfg: PaintedCfg = { id, folder: id, title: room.title, zh: room.zh, caption: room.caption,
    painting: true, night: room.night, hotspots, motes: 18, leaves: room.ambience.leaves, petals: room.ambience.petals,
    light: { x: 750, y: 280, color: 'rgba(255,210,150,0.16)' }, portrait: {} };
  if (room.ambience.steam) {
    cfg.steam = room.ambience.steam.map(({ at: [wide], width = 92, rate = 9, alpha = .28 }) =>
      ({ x: wide[0] * 1600, y: wide[1] * 900, w: width, rate, a: alpha }));
    cfg.portrait!.steam = room.ambience.steam.map(({ at: [, phone], width = 92, rate = 9, alpha = .28 }) =>
      ({ ...pAt(id, ...phone), w: width * .58, rate: rate * .85, a: alpha }));
  }
  if (room.ambience.fire) {
    cfg.fire = room.ambience.fire.map(({ at: [wide], radius = [55, 30] }) =>
      ({ x: wide[0] * 1600, y: wide[1] * 900, rx: radius[0], ry: radius[1] }));
    cfg.portrait!.fire = room.ambience.fire.map(({ at: [, phone], radius = [55, 30] }) =>
      ({ ...pAt(id, ...phone), rx: radius[0] * .55, ry: radius[1] * .55 }));
  }
  return paintedScene(cfg);
}
export const TURKEY_SCENES: Record<string, () => SceneDef> = Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, () => makeRoom(id, room)]));
