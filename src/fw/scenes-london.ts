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
      // Four hot things on the counter, each rising from its own vessel and clear of every face (2026-09-23): the
      // joint, from its bone end, which is the only part of it not under the carver's face or the barmaid's; the
      // open copper of gravy; the roast potatoes with the tin of Yorkshire puddings in front of them, one source
      // because the engine keeps four; and the cabbage and carrots in their bowls. The cut slices, the cheese, the
      // bread and the pickled onions are cold. A plume here rises about .26 of the frame, so the joint's is small
      // and faint: from the middle of the joint it reached the carver's face in both paintings.
      steam: { wide: [[.345, .585, 60, 7, .18], [.130, .745, 150, 8, .22], [.270, .820, 240, 9, .22], [.460, .735, 160, 8, .22]],
        phone: [[.715, .550, 20, 5, .07], [.200, .645, 60, 7, .20], [.380, .720, 90, 8, .22], [.790, .680, 40, 7, .20]] },
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
      //
      // Since 2026-09-23 only the cup being filled steams among the cups, in both paintings, and in wide the silver
      // hot-water jug beside it steams from its spout. Every other cup stands directly under a face — the right-hand
      // table's under the woman in the hat, the reader's under her own face, the portrait's front cup under the
      // girl's profile and its far cups under the woman in the hat — and an engine plume rises about a quarter of
      // the frame, so from any of them it crossed that face. The face rule wins; those cups stay still, and
      // docs/london-rooms.md lists them.
      steam: { wide: [[.295, .690, 200, 10, .24], [.372, .628, 40, 8, .18]],
        phone: [[.372, .665, 20, 5, .12]] },
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
      // Re-boxed on 2026-09-23 so no plume reaches a face: the copper's and the pies' are small and faint and rise
      // beside the pieman, not under him; the eating diner's plate in the wide painting stays still, because it
      // sits directly under his face. In portrait the stewed tray steams from its front, below the pieman and the
      // woman, and the tray of pies stays still: it stands under the pieman and the man in the cap behind the
      // counter, and there is no column between them wide enough for a plume.
      steam: { wide: [[.345, .520, 80, 8, .16], [.235, .625, 180, 10, .24], [.470, .430, 50, 8, .22]],
        phone: [[.470, .520, 20, 5, .10], [.400, .665, 60, 8, .22], [.120, .560, 30, 6, .18]] },
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
      // The portrait plumes were narrowed on 2026-09-23: at 160 and 180 wide they spread across the girl's chin.
      steam: { wide: [[.155, .612, 190, 9, .24], [.375, .672, 170, 9, .24], [.230, .775, 150, 8, .24]],
        phone: [[.360, .580, 30, 6, .16], [.660, .610, 30, 6, .16], [.330, .720, 90, 8, .22]] },
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
      // Since 2026-09-23 the griddle steams from its front edge, the bacon and eggs, so the plume tops out at his
      // apron and not at his face, and the boiler from its own lid; in portrait the griddle steams from the bacon
      // under the stallholder's apron, right of the porters. The portrait boiler stands at x .92 and more, outside
      // the band a phone shows, so its plume (which rose over the stallholder's head) is gone.
      steam: { wide: [[.215, .740, 170, 10, .24], [.345, .305, 80, 7, .20]],
        phone: [[.660, .690, 90, 10, .24]] },
      // No fire ellipse. The room's four loops — the tap's pour, two plumes, the light and the gull — are already
      // full. The light is the naphtha flare in wide and, in portrait, the coals under the griddle (the flare is
      // behind the back button and the room's name at 390 wide).
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
      // Since 2026-09-23 each plume rises from the surface of its pan, not from the air above it, and narrow
      // enough to stop below the cook's beard, the old man's and the man on the left; the curry's rises from the
      // right half of the pot, beside the spice fall rather than through it.
      steam: { wide: [[.425, .600, 60, 8, .22], [.190, .600, 100, 8, .22], [.130, .760, 150, 8, .24]],
        phone: [[.450, .600, 30, 6, .16], [.850, .665, 20, 5, .07]] },
      fire: { wide: [[.375, .700, 95, 18]], phone: [[.560, .715, 130, 22]] },   // the open range under the copper pot
      pot: { wide: [.400, .615, 130, 20], phone: [.560, .600, 150, 24] },
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
      // The cauldron's plume rises from its right half since 2026-09-23: from the middle it crossed the cook's
      // chin in wide, and at 220 wide in portrait it spread to the children's faces either side.
      steam: { wide: [[.385, .640, 120, 10, .24], [.175, .740, 120, 9, .24]],
        phone: [[.500, .600, 100, 10, .24]] },
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
      // Portrait re-boxed on 2026-09-23: the broken pasty's plume is narrow enough to stop under the woman's face
      // and between the children; the tray in the oven mouth steams in wide only, because in portrait the tray is
      // past x .906, outside the phone band, and its plume rose across the old baker's face. The portrait flame
      // keeps to the oven mouth right of his face (x .866 to .906; it had spread to x .79).
      steam: { wide: [[.760, .615, 230, 10, .24], [.905, .355, 150, 8, .22]],
        phone: [[.500, .700, 120, 10, .24]] },
      fire: { wide: [[.915, .320, 70, 80]], phone: [[.886, .290, 10, 34]] },   // the open oven mouth
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
      // The portrait copper hangs on its tripod at (.13, .20) with the fire under it at (.125, .232), inside the
      // phone band; until 2026-09-23 its plume, flame and boil sat .13 lower, on the donkey, with the flame mostly
      // off the left edge. The portrait copper sits just under the room's heading, so a plume from it rose behind
      // the back button, the name and the story button; the portrait painting draws the copper's own steam there,
      // and the engine adds none. The portrait has no bakestone: its second plume rose from a crate and was removed.
      // `phone: []` and not a missing key: without a portrait list of its own the engine draws the wide plumes on
      // the phone painting, and the bakestone's wide plume then rose over the riddle and the woman's apron.
      steam: { wide: [[.045, .390, 230, 10, .24], [.500, .780, 190, 9, .22]], phone: [] },
      fire: { wide: [[.035, .560, 85, 24]], phone: [[.130, .232, 16, 10]] },   // the driftwood fire under the copper
      pot: { wide: [.045, .400, 115, 20], phone: [.126, .198, 22, 4] },
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
      // The table's plume rises from the right-hand pile since 2026-09-23, below the gutting woman's face and
      // right of it; the portrait pit's is narrower and stops below the girls either side.
      steam: { wide: [[.440, .700, 200, 10, .26], [.220, .665, 80, 8, .22]],
        phone: [[.620, .665, 60, 9, .22], [.330, .830, 120, 8, .24]] },
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
      // The portrait fire is the kiln's upper flames at (.117, .322), inside the phone band and above the peat
      // man's cap (2026-09-23); the old ellipse (.105, .400) rx 62 ry 105 sat mostly off the left edge and across
      // his face. The portrait kiln's plume is gone: the kiln is at the painting's top-left, under the room's
      // heading, and its plume rose behind the back button, the name and the story button.
      steam: { wide: [[.430, .490, 220, 9, .24], [.040, .400, 130, 8, .22]], phone: [] },   // [] keeps the wide plumes off the phone
      fire: { wide: [[.035, .460, 70, 55]], phone: [[.117, .322, 11, 18]] },   // the peat fire under the kiln arch
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
