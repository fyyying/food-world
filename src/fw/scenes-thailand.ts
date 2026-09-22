/** The 12 Thailand paintings as paintedScene configs. Wide and portrait anchors were measured separately on each
 *  delivered file: `public/scenes/th_<id>/wide.jpg` is 1672 x 941 and maps to stage units as `x = fx * 1600`,
 *  `y = fy * 900`; `portrait.jpg` is 941 x 1672 and goes through `pAt(folder, fx, fy)`. No wide fraction was ever
 *  copied into a portrait. The per-room record, with every boundary and every reason, is docs/thailand-rooms.md.
 *
 *  The three discovery subjects and their texts come from `THAILAND_DISCOVERIES` in thailand-stories.ts word for
 *  word; this file supplies only the effect and the two anchors. Every portrait anchor sits inside the middle 80
 *  per cent of the painting's width (x .094 to .906), which is the slice a 390-wide viewport actually shows.
 */
import { paintedScene, pAt, type PaintedCfg } from './scene-painted';
import type { SceneDef, SceneHotspot } from './scene';
import type { RoomEffect } from './scene-props';
import { THAILAND_AMBIENCE, THAILAND_HUNG } from './thailand-ambience';
import { THAILAND_DISCOVERIES } from './thailand-stories';

type Point = [number, number];
/** One touch: the effect, then the wide and portrait anchors as fractions of each painting. */
type Touch = [effect: RoomEffect, wide: Point, phone: Point, food?: string];
/** x, y as fractions of that orientation's painting, then width, rate and alpha in stage units. */
type Steam = [fx: number, fy: number, w: number, rate: number, a?: number];
/** x, y as fractions of that orientation's painting, then the ellipse radii in stage units. */
type Fire = [fx: number, fy: number, rx: number, ry: number];
/** Steam, open flame and a rolling-boil ellipse, each measured per orientation. */
type Heat = { steam?: { wide?: Steam[]; phone?: Steam[] }; fire?: { wide?: Fire[]; phone?: Fire[] }; pot?: { wide?: Fire; phone?: Fire } };
type Room = { title: string; zh: string; caption: string; touches: Touch[]; heat: Heat };

// The discovery card art lives in public/scenes/thailand-food; scene.ts takes the folder when the key carries one.
const card = (stem: string) => `thailand-food/${stem}`;

// Hot and cold follow the image brief's per-room list and the paintings themselves. Half this area is deliberately
// dry: fruit and vegetables in a boat, raw aromatics beside a mortar, iced khao chae, a jar of pla ra, a jar of
// budu, drying squid, finished sweets and egg yolks, Nyonya porcelain and young mango. Nothing in that list emits.
const rooms: Record<string, Room> = {
  th_khlong: {
    title: 'The floating market', zh: 'ตลาดน้ำ',
    caption: 'A canal basin at first light, thirty boats tied gunwale to gunwale, and a cleaver taking the top off a young coconut.',
    heat: {
      // Only the charcoal brazier: the pan of grilling bananas amidships in wide, the grill of them at the left of
      // the portrait. The fruit, the vegetables, the banana-leaf parcels and the salted eggs are all cold.
      steam: { wide: [[.615, .636, 280, 10, .24]], phone: [[.115, .452, 190, 9, .24]] },
      // No fire ellipse. The brazier's coals are a thin sliver under the pan in wide and are hidden behind the
      // pot's rim in portrait, and the room's four loops are its glint, its steam and its two hung sprites.
    },
    touches: [
      ['detail', [.472, .495], [.440, .515], card('khlong')],
      ['detail', [.200, .630], [.500, .820]],
      ['detail', [.420, .745], [.220, .645]],
    ],
  },
  th_noodleboat: {
    title: 'The noodle boat', zh: 'ก๋วยเตี๋ยวเรือ',
    caption: 'One pot, one paddle and small bowls handed up over the gunwale to a teak landing stage.',
    heat: {
      // The charcoal pot amidships and the bowl the broth is falling into. The trays of raw rice noodles, the
      // morning glory, the bean sprouts, the sliced pork and the four open seasonings stay dry.
      steam: { wide: [[.560, .655, 300, 10, .24], [.553, .578, 130, 8, .24]],
        phone: [[.200, .585, 200, 9, .24], [.545, .552, 110, 7, .24]] },
      fire: { wide: [[.555, .845, 70, 14]], phone: [[.130, .755, 55, 14]] },   // the open charcoal fire under the pot
      pot: { wide: [.560, .662, 128, 26], phone: [.200, .592, 150, 30] },   // the broth surface visibly moving
    },
    touches: [
      ['tea', [.555, .600], [.520, .565], card('noodleboat')],
      ['detail', [.440, .495], [.140, .470]],
      ['detail', [.035, .555], [.900, .400]],
    ],
  },
  th_wang: {
    title: 'The household kitchen', zh: 'ครัวในวัง',
    caption: 'A noble compound’s open pavilion, a massaman pot on the charcoal, and a chilli opened into a flower.',
    heat: {
      // The open clay pot of massaman, which the painting already draws a wisp over. The khao chae is iced, the
      // carved pomelo and chilli are raw, and the betel set and the manuscript are cold.
      steam: { wide: [[.295, .385, 200, 9, .24]], phone: [[.780, .425, 180, 9, .24]] },
      // The stove's open mouth glows under the pot in the wide composition. The portrait's only charcoal is the
      // girl's stove at x .06, left of the band a phone shows, so the portrait declares an empty fire list.
      fire: { wide: [[.300, .535, 45, 12]], phone: [] },
    },
    touches: [
      ['detail', [.685, .565], [.310, .615], card('wang')],
      ['detail', [.510, .385], [.660, .690]],
      ['detail', [.410, .655], [.740, .585]],
    ],
  },
  th_curry: {
    title: 'The curry mortar', zh: 'ครกหิน',
    caption: 'Granite, a quarter of an hour of pounding, and coconut cream fried in an open pan until the oil splits.',
    heat: {
      // The pan of frying coconut cream: small breaking bubbles and light steam at its surface, so it takes both a
      // plume and a boil ellipse. The mortar, the raw aromatics, the grated flesh and the first pressing are cold.
      steam: { wide: [[.410, .415, 200, 8, .24]], phone: [[.400, .468, 150, 8, .24]] },
      fire: { wide: [[.410, .490, 50, 12]], phone: [[.385, .545, 40, 10]] },   // the open mouth of the clay stove
      pot: { wide: [.410, .425, 100, 18], phone: [.400, .472, 72, 13] },
    },
    touches: [
      ['detail', [.755, .520], [.620, .705], card('curry')],
      ['sizzle', [.410, .420], [.400, .470]],
      ['detail', [.185, .525], [.250, .490]],
    ],
  },
  th_sweets: {
    title: 'The sweets kitchen', zh: 'ขนมไทย',
    caption: 'Egg, sugar and coconut over charcoal at Kudi Chin, and golden threads drawn down onto a pan of syrup.',
    heat: {
      // The wide brass pan of syrup at a low boil. The finished foi thong, the thong yip, the thong yot, the small
      // cakes cooling on their rack and the bowl of separated yolks are all cool and show nothing.
      steam: { wide: [[.360, .612, 240, 8, .24]], phone: [[.240, .600, 220, 8, .24]] },
      // Charcoal glows under the pan in the wide painting; the portrait frames the pan from above its stand and
      // shows no fire at all, so it declares an empty list and spends the freed slot on the river sky.
      fire: { wide: [[.355, .755, 62, 14]], phone: [] },
      pot: { wide: [.330, .620, 150, 26], phone: [.230, .608, 170, 28] },
    },
    touches: [
      ['tea', [.250, .500], [.390, .570], card('sweets')],
      ['detail', [.750, .700], [.780, .485]],
      ['detail', [.165, .855], [.775, .745]],
    ],
  },
  th_shophouse: {
    title: 'The shophouse kitchen', zh: 'ร้านตึกแถว',
    caption: 'Sampheng’s Teochew kitchen on the newly cut Yaowarat street: the wok, the noodle, the roast meats, the charcoal.',
    heat: {
      // The wok, the open pot of congee and the lifted bamboo steamer. The glazed jars of bean curd, preserved
      // radish, salted egg and soy and the tin tray of condiments stay dry, and so do the hanging meats.
      steam: { wide: [[.245, .485, 180, 9, .24], [.685, .800, 190, 9, .24], [.850, .790, 150, 8, .24]],
        phone: [[.600, .600, 170, 9, .24], [.160, .672, 180, 9, .24], [.170, .800, 150, 8, .24]] },
      fire: { wide: [[.275, .655, 95, 20]], phone: [[.620, .715, 75, 16]] },   // the roaring charcoal ring under the wok
      pot: { wide: [.685, .808, 105, 20], phone: [.160, .680, 150, 26] },   // the congee surface breaking
    },
    touches: [
      ['sizzle', [.245, .500], [.600, .620], card('shophouse')],
      ['detail', [.335, .110], [.700, .260]],
      ['tea', [.855, .790], [.200, .820]],
    ],
  },
  th_paddy: {
    title: 'The rice-field lunch', zh: 'ข้าวกลางนา',
    caption: 'The meal carried out to the harvest: a straw fire on the bund, a fish in banana leaf, and a mortar of nam phrik.',
    heat: {
      // The opened fish on its leaf and the just-opened basket of steamed rice. The morning glory, the cucumber,
      // the cut banana flower, the water gourd and the tied parcels are cold.
      steam: { wide: [[.400, .625, 220, 9, .24], [.620, .615, 140, 8, .24]],
        phone: [[.450, .665, 170, 8, .24], [.550, .545, 90, 7, .24]] },
      fire: { wide: [[.450, .695, 55, 12]], phone: [[.490, .748, 45, 12]] },   // the small fire of rice straw
    },
    touches: [
      ['tea', [.395, .635], [.450, .675], card('paddy')],
      ['detail', [.515, .635], [.720, .545]],
      ['detail', [.620, .625], [.550, .555]],
    ],
  },
  th_isan: {
    title: 'The Isan grill', zh: 'ปิ้งย่างอีสาน',
    caption: 'Charcoal, a clay mortar and baskets of sticky rice in the shade under a raised house on the dry plateau.',
    heat: {
      // The two just-opened baskets of sticky rice. The pla ra jars against the house posts are cold and show
      // nothing at all, which is the room’s own rule; the larb, the long beans and the lime halves are cold too.
      steam: { wide: [[.135, .625, 160, 8, .24], [.275, .635, 140, 8, .24]],
        phone: [[.710, .695, 95, 7, .24], [.105, .690, 90, 7, .24]] },
      fire: { wide: [[.620, .775, 90, 14]], phone: [[.600, .412, 65, 12]] },   // the charcoal trough under the clamps
    },
    touches: [
      ['sizzle', [.600, .745], [.600, .365], card('isan')],
      ['detail', [.380, .600], [.400, .665]],
      ['tea', [.135, .655], [.710, .705]],
    ],
  },
  th_lanna: {
    title: 'The Lanna kitchen', zh: 'ข้าวซอย',
    caption: 'Khao soi from the caravan road, a coil of sai ua on the grill, and a lacquered khantoke tray on the floor.',
    heat: {
      // The open pot of khao soi broth, the bowl being filled and the finished bowl in the foreground. The pickled
      // mustard greens, the drying thua nao discs and the khantoke’s cold dishes show nothing.
      steam: { wide: [[.130, .595, 200, 9, .24], [.200, .425, 100, 7, .24], [.255, .815, 130, 7, .24]],
        phone: [[.150, .620, 190, 9, .24], [.310, .545, 90, 7, .24], [.330, .775, 130, 7, .24]] },
      fire: { wide: [[.440, .468, 52, 10]], phone: [[.800, .548, 60, 12]] },   // the low charcoal grill under the coil
      pot: { wide: [.130, .604, 130, 24], phone: [.150, .628, 160, 26] },
    },
    touches: [
      ['tea', [.255, .830], [.330, .790], card('lanna')],
      ['sizzle', [.440, .425], [.800, .495]],
      ['detail', [.660, .590], [.550, .645]],
    ],
  },
  th_andaman: {
    title: 'The Andaman fishing kitchen', zh: 'ครัวชาวเล',
    caption: 'Turmeric, fresh fish and a driftwood fire on pale sand, under limestone towers out of green water.',
    heat: {
      // The open pot of kaeng som and the turmeric-rubbed fish on the green-stick grill. The split squid drying on
      // the line is cold and shows nothing, and so do the sataw, the stone mortar and the opened coconut.
      steam: { wide: [[.510, .615, 170, 9, .24], [.270, .700, 140, 7, .24]],
        phone: [[.820, .680, 160, 9, .24], [.280, .685, 150, 7, .24]] },
      fire: { wide: [[.300, .790, 90, 16]], phone: [[.280, .795, 55, 12]] },   // the open driftwood fire
    },
    touches: [
      ['sizzle', [.270, .715], [.280, .700], card('andaman')],
      ['detail', [.380, .265], [.200, .290]],
      ['tea', [.510, .640], [.830, .700]],
    ],
  },
  th_muslim: {
    title: 'The Malay-Muslim kitchen', zh: 'ครัวมลายู',
    caption: 'Roti on the steel plate, khao mok open on the charcoal, and a jar of budu at a mangrove edge in the deep south.',
    heat: {
      // The open pot of khao mok and the roti puffing on the plate. The budu jar, the nasi kerabu, the massaman
      // bowl and the raw aromatics on the board are cold; the budu is never boiled.
      steam: { wide: [[.175, .572, 230, 10, .24], [.520, .585, 190, 8, .24]],
        phone: [[.130, .485, 150, 9, .24], [.680, .612, 120, 7, .24]] },
      fire: { wide: [[.490, .662, 45, 10]], phone: [[.650, .675, 55, 9]] },   // the charcoal under the steel plate
    },
    touches: [
      ['sizzle', [.520, .590], [.680, .615], card('muslim')],
      ['tea', [.175, .590], [.130, .500]],
      ['detail', [.090, .760], [.140, .645]],
    ],
  },
  th_baba: {
    title: 'The tin town kitchen', zh: 'ครัวบาบ๋า',
    caption: 'A Phuket Baba household in a Sino-Portuguese shophouse: black braised pork, a tiffin tier, an oyster fry on iron.',
    heat: {
      // The open clay pot of moo hong, the lifted tiffin tier, the bowl of mee Hokkien and the flat iron plate of
      // o-tao. The blue-and-white Nyonya porcelain and the young mango beside it are cold.
      steam: { wide: [[.435, .760, 200, 9, .24], [.120, .720, 170, 9, .24], [.385, .285, 90, 7, .24], [.665, .752, 120, 7, .24]],
        phone: [[.300, .700, 200, 9, .24], [.780, .845, 150, 8, .24], [.310, .490, 90, 7, .24], [.720, .752, 120, 7, .24]] },
      fire: { wide: [[.145, .848, 55, 12]], phone: [[.370, .788, 45, 10]] },   // the charcoal under the flat iron plate
    },
    touches: [
      ['tea', [.435, .800], [.300, .735], card('baba')],
      ['detail', [.385, .430], [.310, .520]],
      ['sizzle', [.120, .755], [.780, .855]],
    ],
  },
};

const icons: Record<RoomEffect, string> = { detail: '⌕', tea: '♨', sizzle: '♨', flour: '⋯', leaves: '❧', water: '≈', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
function makeRoom(id: string, room: Room): SceneDef {
  const discoveries = THAILAND_DISCOVERIES[id] ?? [];
  const hotspots: SceneHotspot[] = room.touches.map(([effect, wide, phone, food], i) => {
    const [label, text] = discoveries[i] ?? ['', ''];
    return { id: `${id}-${i}`, label, text, x: wide[0] * 1600, y: wide[1] * 900, portrait: pAt(id, ...phone),
      interaction: { effect, icon: icons[effect], wide, phone, extent: effect === 'tea' ? [.045, .10] : [.10, .22], folder: id, food } };
  });
  const cfg: PaintedCfg = { id, folder: id, title: room.title, zh: room.zh, caption: room.caption,
    painting: true, hotspots, motes: 6, ambience: THAILAND_AMBIENCE[id],
    light: { x: 780, y: 270, color: 'rgba(255,214,152,0.16)' }, portrait: {} };
  const hung = THAILAND_HUNG[id];
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
export const THAILAND_SCENES: Record<string, () => SceneDef> = Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, () => makeRoom(id, room)]));
