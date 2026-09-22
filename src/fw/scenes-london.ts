/** The 13 Britain paintings as paintedScene configs. Wide and portrait anchors were measured separately on each
 *  delivered file: `public/scenes/uk_<id>/wide.jpg` is 1672 x 941 and maps to stage units as `x = fx * 1600`,
 *  `y = fy * 900`; `portrait.jpg` is 941 x 1672 and goes through `pAt(folder, fx, fy)`. No wide fraction was ever
 *  copied into a portrait. The per-room record, with every boundary and every reason, is docs/london-rooms.md.
 *
 *  The three discovery subjects and their texts come from `LONDON_DISCOVERIES` in london-stories.ts word for word;
 *  this file supplies only the effect and the two anchors. Every portrait anchor sits inside the middle 80 per cent
 *  of the painting's width (x .094 to .906), which is the slice a 390-wide viewport actually shows.
 */
import { paintedScene, pAt, type PaintedCfg } from './scene-painted';
import type { SceneDef, SceneHotspot } from './scene';
import type { RoomEffect } from './scene-props';
import { LONDON_AMBIENCE, LONDON_HUNG } from './london-ambience';
import { LONDON_DISCOVERIES } from './london-stories';

type Point = [number, number];
/** One touch: the effect, then the wide and portrait anchors as fractions of each painting. */
type Touch = [effect: RoomEffect, wide: Point, phone: Point, food?: string];
/** x, y as fractions of that orientation's painting, then width, rate and alpha in stage units. */
type Steam = [fx: number, fy: number, w: number, rate: number, a?: number];
/** x, y as fractions of that orientation's painting, then the ellipse radii in stage units. */
type Fire = [fx: number, fy: number, rx: number, ry: number];
/** Steam, open flame and a rolling-boil or frying ellipse, each measured per orientation. */
type Heat = { steam?: { wide?: Steam[]; phone?: Steam[] }; fire?: { wide?: Fire[]; phone?: Fire[] }; pot?: { wide?: Fire; phone?: Fire } };
type Room = { title: string; zh: string; caption: string; touches: Touch[]; heat: Heat };

// The discovery card art lives in public/scenes/london-food; scene.ts takes the folder when the key carries one.
const card = (stem: string) => `london-food/${stem}`;

// Hot and cold follow the image brief's per-room list and the paintings themselves. This area is colder than most:
// `uk_dairy` has no heat at all and is the one room in Food World built on that rule; the market's cheese, butter,
// apples and vegetables are cold under an iron roof at four in the morning; the jellied eel tray in the pie shop is
// cold while the stewed tray beside it steams; the cockles on the sand and the riddle's wet sand are cold, and only
// the boiling copper on the shore and the bakestone are not. Nothing held in a hand emits anywhere in the area.
const rooms: Record<string, Room> = {
  uk_pub: {
    title: 'The public house', zh: 'The Sunday joint',
    caption: 'A wet London evening, a sirloin part-carved on the counter, and the one roast of the week going out in slices.',
    heat: {
      // The joint, which the painting already draws a wisp over, and the open copper of gravy at the counter's end.
      // The batter pudding, the cut slices, the cheese, the bread and the pickled onions are cold.
      steam: { wide: [[.240, .592, 240, 10, .24], [.105, .748, 200, 9, .24]],
        phone: [[.520, .505, 170, 9, .24], [.220, .640, 150, 8, .24]] },
      // No fire ellipse in either orientation. The coal grate is the room's `light` signature, and a flame ellipse
      // over the same grate would be a fifth loop beside the steam and the two hung sprites.
    },
    touches: [
      ['tea', [.215, .610], [.415, .545], card('pub')],
      ['detail', [.200, .880], [.260, .765]],
      ['detail', [.455, .300], [.705, .330]],
    ],
  },
  uk_tearoom: {
    title: 'The tea room', zh: 'Afternoon tea',
    caption: 'A pot tilted over a strainer, a cup on a marble table, and one of the few rooms in Britain a woman could sit in alone.',
    heat: {
      // The cup the tea is falling into and every other cup standing on a table: the one at the right-hand marble
      // table and, in wide, the cup at the reading customer's elbow on the left; in portrait, the cups on the far
      // table behind the hat. The pot is in the waitress's hand and stays dry, as every held vessel in this area
      // does, and so do the bread and butter, the scones, the jam, the cream and the cut fruit cake.
      steam: { wide: [[.295, .648, 250, 10, .24], [.833, .545, 170, 9, .22], [.045, .500, 130, 8, .22]],
        phone: [[.385, .655, 200, 10, .24], [.765, .660, 160, 9, .22], [.640, .555, 120, 8, .22]] },
    },
    touches: [
      ['tea', [.250, .580], [.245, .600], card('tearoom')],
      ['detail', [.225, .760], [.300, .815]],
      ['detail', [.680, .665], [.645, .645]],
    ],
  },
  uk_market: {
    title: 'The market', zh: 'Borough Market',
    caption: 'Four in the morning under iron and glass: a cheese wire drawing down a truckle, butter on marble, and a train over the stalls.',
    heat: {
      // Nothing in this room is hot. Cloth-bound truckles, worked butter, apples, cabbages, carrots, potatoes,
      // turnips and eggs are a cold wholesale trade, and the image brief names the produce as carrying no steam.
    },
    touches: [
      ['detail', [.215, .545], [.505, .555], card('market')],
      ['detail', [.075, .690], [.720, .805]],
      ['detail', [.375, .855], [.135, .835]],
    ],
  },
  uk_piemash: {
    title: 'The pie and mash shop', zh: 'Pie, mash and liquor',
    caption: 'Tile, marble and mirrors, three things on the board, and a ladle of green liquor going over the pie.',
    heat: {
      // The copper of liquor, the plated pie and mash, the tray of pies and the stewed eel tray. **The jellied eel
      // tray beside it is cold and carries nothing**, which is the whole difference between the two trays.
      steam: { wide: [[.330, .505, 180, 10, .24], [.235, .610, 110, 8, .24], [.415, .435, 150, 8, .24], [.885, .635, 90, 7, .22]],
        phone: [[.545, .450, 170, 9, .24], [.380, .650, 130, 8, .24], [.680, .375, 120, 7, .22]] },
      pot: { wide: [.330, .515, 130, 20], phone: [.115, .560, 100, 18] },
    },
    touches: [
      ['detail', [.245, .630], [.330, .690], card('piemash')],
      ['tea', [.330, .510], [.470, .620]],
      ['detail', [.450, .615], [.800, .520]],
    ],
  },
  uk_chippy: {
    title: 'The fried fish shop', zh: 'The chippy',
    caption: 'Two open pans of dripping, a basket lifted and shaken, and the first hot cooked meal a working week could buy.',
    heat: {
      // Both frying pans and the draining rack of fried fish. The raw chips on the bench, the crate of potatoes,
      // the salt and the vinegar are cold; the acceptance row for the portrait says so in as many words.
      steam: { wide: [[.155, .612, 190, 9, .24], [.375, .672, 170, 9, .24], [.230, .775, 150, 8, .24]],
        phone: [[.320, .560, 160, 9, .24], [.660, .590, 180, 9, .24], [.330, .700, 160, 8, .24]] },
      fire: { wide: [[.045, .360, 62, 30]], phone: [[.790, .268, 55, 30]] },   // the open firebox of the range
      pot: { wide: [.375, .680, 150, 22], phone: [.660, .600, 150, 24] },   // dripping on the boil under the basket
    },
    touches: [
      ['tea', [.195, .775], [.300, .715], card('chippy')],
      ['detail', [.925, .540], [.855, .445]],
      ['sizzle', [.375, .665], [.660, .585]],
    ],
  },
  uk_breakfast: {
    title: "The porters' breakfast", zh: 'The coffee stall',
    caption: 'A stall under a naphtha flare at four in the morning, bacon on the griddle and a mug filling from the boiler tap.',
    heat: {
      // The griddle of bacon, black pudding and eggs, and the copper boiler. The mugs the porters hold are dry,
      // and so are the bread, the butter and the board of sandwiches.
      steam: { wide: [[.235, .665, 200, 9, .24], [.330, .330, 130, 7, .22]],
        phone: [[.500, .680, 220, 9, .24], [.845, .330, 120, 7, .22]] },
      // No fire ellipse. The coals under the portrait griddle are pictured, but the room's four loops — the tap's
      // pour, two plumes, the naphtha flare and the gull — are already full, and the flare is the larger cue.
    },
    touches: [
      ['sizzle', [.235, .665], [.480, .680], card('breakfast')],
      ['tea', [.385, .600], [.830, .460]],
      ['detail', [.300, .800], [.215, .870]],
    ],
  },
  uk_lascar: {
    title: "The seamen's kitchen", zh: 'লস্কর রান্নাঘর',
    caption: 'A Shadwell back room, a stone slab of ground spice going into an iron pan, and six men from one ship cooking for each other.',
    heat: {
      // The open curry pot, the rice pan with its lid lifted beside it, and the iron griddle of roti. The whole
      // spices in their bags, the dried fish, the green chillies, the coriander and the water jar are cold.
      steam: { wide: [[.350, .545, 190, 9, .24], [.185, .545, 170, 8, .24], [.130, .760, 150, 8, .24]],
        phone: [[.545, .575, 200, 9, .24], [.860, .630, 150, 8, .24]] },
      fire: { wide: [[.375, .700, 95, 18]], phone: [[.560, .715, 130, 22]] },   // the open range under the copper pot
      pot: { wide: [.350, .560, 150, 22], phone: [.560, .590, 150, 24] },
    },
    touches: [
      ['detail', [.575, .665], [.300, .815], card('lascar')],
      ['tea', [.350, .570], [.545, .590]],
      ['tea', [.185, .560], [.860, .640]],
    ],
  },
  uk_hopkitchen: {
    title: "The hop-pickers' cookhouse", zh: 'Hopping',
    caption: 'September in the Weald: a pot on its chain over an open fire, and a quarter of a million Londoners living in a field.',
    heat: {
      // The cauldron of mutton and barley, and the kettle on the stones beside it. The bin of green cones, the cut
      // loaf, the clasp knife and the enamel plates are cold, and the children's bowls are held.
      steam: { wide: [[.330, .618, 220, 10, .24], [.175, .740, 120, 7, .22]],
        phone: [[.500, .592, 220, 10, .24]] },
      fire: { wide: [[.340, .900, 110, 22]], phone: [[.530, .745, 120, 22]] },   // the open wood fire under the chain
      pot: { wide: [.330, .630, 140, 24], phone: [.500, .605, 165, 26] },
    },
    touches: [
      ['tea', [.330, .600], [.500, .580], card('hopkitchen')],
      ['detail', [.745, .545], [.845, .700]],
      ['detail', [.665, .790], [.155, .790]],
    ],
  },
  uk_dairy: {
    title: 'The dale dairy', zh: 'Wensleydale',
    caption: 'A cold stone dairy above the beck: curd draining on slats, a truckle under the press, and whey running into the pail.',
    heat: {
      // **Nothing. This room has no steam, no fire, no boiling and no hot vessel of any kind**, which is the rule
      // docs/london-world.md sets for it and which the delivered paintings honour: no range, no kettle, no fire.
      // Its liquid is whey, and it runs and drips instead of steaming.
    },
    touches: [
      ['detail', [.400, .720], [.215, .775], card('dairy')],
      ['detail', [.135, .490], [.790, .700]],
      ['detail', [.545, .400], [.575, .420]],
    ],
  },
  uk_pasty: {
    title: 'The Cornish bakehouse', zh: 'Pasti',
    caption: 'A granite oven above the cove, pasties crimped along the side, and a dinner with a handle going in on the peel.',
    heat: {
      // The baked pasties resting on the cloth and the tray going into the oven mouth. The raw pasties, the sliced
      // swede and potato, the beef and the onion on the board are cold; they go in raw and cook in their own steam.
      steam: { wide: [[.760, .615, 230, 10, .24], [.905, .355, 150, 8, .22]],
        phone: [[.500, .690, 190, 9, .24], [.885, .315, 110, 8, .22]] },
      fire: { wide: [[.915, .320, 70, 80]], phone: [[.880, .285, 44, 44]] },   // the open oven mouth
    },
    touches: [
      ['detail', [.330, .635], [.455, .635], card('pasty')],
      ['detail', [.755, .720], [.500, .760]],
      ['sizzle', [.915, .330], [.880, .290]],
    ],
  },
  uk_cockles: {
    title: 'The cockle sands', zh: 'Cocos a bara lawr',
    caption: 'Low tide on the Loughor: fifty women, a riddle, a donkey and a copper boiling at the top of the sand.',
    heat: {
      // The copper boiling on the shore and the bakestone of Welsh cakes over its coals. **The cockles on the
      // stall, the riddle's wet sand and the sacks are cold**, and the laverbread in its dish is cool.
      steam: { wide: [[.045, .390, 230, 10, .24], [.500, .780, 190, 9, .22]],
        phone: [[.125, .335, 160, 9, .24], [.560, .905, 150, 8, .22]] },
      fire: { wide: [[.035, .560, 85, 24]], phone: [[.115, .400, 55, 20]] },   // the driftwood fire under the copper
      pot: { wide: [.045, .400, 115, 20], phone: [.125, .345, 70, 14] },
    },
    touches: [
      ['detail', [.790, .500], [.600, .560], card('cockles')],
      ['detail', [.200, .430], [.355, .845]],
      ['detail', [.115, .680], [.845, .880]],
    ],
  },
  uk_smokehouse: {
    title: 'The smokehouse', zh: 'Arbroath smokies',
    caption: 'A half whisky barrel sunk in the ground, a hardwood fire in it, and haddock tied in pairs over the smoke.',
    heat: {
      // The pit, whose smoke rises through the tied pairs, and the hot-smoked fish on the table, which come off the
      // speet warm. The kippers and the Findon on the other rail are cold-smoked and cold; so are the salt barrel,
      // the brine tub and the split fish being tied.
      steam: { wide: [[.440, .700, 200, 10, .26], [.115, .625, 150, 7, .22]],
        phone: [[.550, .640, 220, 10, .26], [.330, .830, 180, 8, .24]] },
      // No fire ellipse: the pit's own fire is the room's `embers` signature, and the room already hangs two
      // sprites, so an ellipse over the same coals would be a fifth loop.
    },
    touches: [
      ['detail', [.430, .560], [.555, .560], card('smokehouse')],
      ['detail', [.145, .520], [.330, .845]],
      ['sizzle', [.445, .800], [.585, .680]],
    ],
  },
  uk_distillery: {
    title: 'The distillery', zh: 'Uisge beatha',
    caption: 'Green malt turned on a stone floor, peat under the kiln, two dull copper stills, and the middle cut running in the safe.',
    heat: {
      // The open washback with its foaming head, which the painting draws a wisp over, and the mouth of the kiln
      // arch. The portrait frames the malting floor, the still and the safe and opens no washback, so its one
      // plume is the heat coming off the peat kiln; the green malt on the floor and the barley in the sack are
      // cold, and so are the oatcakes and the dram on the barrel head.
      steam: { wide: [[.430, .490, 220, 9, .24], [.040, .400, 130, 8, .22]],
        phone: [[.115, .285, 170, 9, .22]] },
      fire: { wide: [[.035, .460, 70, 55]], phone: [[.105, .400, 62, 105]] },   // the peat fire under the kiln arch
    },
    touches: [
      ['detail', [.215, .700], [.400, .780], card('distillery')],
      ['sizzle', [.040, .450], [.105, .400]],
      ['detail', [.760, .330], [.845, .520]],
    ],
  },
};

const icons: Record<RoomEffect, string> = { detail: '⌕', tea: '♨', sizzle: '♨', flour: '⋯', leaves: '❧', water: '≈', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
function makeRoom(id: string, room: Room): SceneDef {
  const discoveries = LONDON_DISCOVERIES[id] ?? [];
  const hotspots: SceneHotspot[] = room.touches.map(([effect, wide, phone, food], i) => {
    const [label, text] = discoveries[i] ?? ['', ''];
    return { id: `${id}-${i}`, label, text, x: wide[0] * 1600, y: wide[1] * 900, portrait: pAt(id, ...phone),
      interaction: { effect, icon: icons[effect], wide, phone, extent: effect === 'tea' ? [.045, .10] : [.10, .22], folder: id, food } };
  });
  const cfg: PaintedCfg = { id, folder: id, title: room.title, zh: room.zh, caption: room.caption,
    painting: true, hotspots, motes: 6, ambience: LONDON_AMBIENCE[id],
    light: { x: 780, y: 270, color: 'rgba(255,214,152,0.16)' }, portrait: {} };
  const hung = LONDON_HUNG[id];
  if (hung?.wide) cfg.hung = hung.wide;
  if (hung?.phone) cfg.portrait!.hung = hung.phone;
  const { steam, fire, pot } = room.heat;
  if (steam?.wide) cfg.steam = steam.wide.map(([fx, fy, w, rate, a = .24]) => ({ x: fx * 1600, y: fy * 900, w, rate, a }));
  if (steam?.phone) cfg.portrait!.steam = steam.phone.map(([fx, fy, w, rate, a = .24]) => ({ ...pAt(id, fx, fy), w, rate, a }));
  if (fire?.wide?.length) cfg.fire = fire.wide.map(([fx, fy, rx, ry]) => ({ x: fx * 1600, y: fy * 900, rx, ry }));
  // A portrait list of its own, empty or not, keeps a wide flame off the phone painting and vice versa.
  if (fire?.phone) cfg.portrait!.fire = fire.phone.map(([fx, fy, rx, ry]) => ({ ...pAt(id, fx, fy), rx, ry }));
  if (pot?.wide) { const [fx, fy, rx, ry] = pot.wide; cfg.pot = { x: fx * 1600, y: fy * 900, rx, ry }; }
  if (pot?.phone) { const [fx, fy, rx, ry] = pot.phone; cfg.portrait!.pot = { ...pAt(id, fx, fy), rx, ry }; }
  return paintedScene(cfg);
}
export const LONDON_SCENES: Record<string, () => SceneDef> = Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, () => makeRoom(id, room)]));
