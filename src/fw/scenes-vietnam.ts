/** The 12 Vietnam paintings as paintedScene configs. Wide and portrait anchors were measured separately on each file. */
import { paintedScene, pAt, type HungSprite, type PaintedCfg } from './scene-painted';
import type { SceneDef, SceneHotspot } from './scene';
import type { RoomEffect } from './scene-props';
import { VIETNAM_AMBIENCE } from './vietnam-ambience';
import { VIETNAM_DISCOVERIES } from './vietnam-stories';

type Point = [number, number];
/** The discovery index in VIETNAM_DISCOVERIES, then that subject's anchor in each painting. */
type Touch = [index: number, effect: RoomEffect, wide: Point, phone: Point, food?: string];
/** x, y as fractions of that orientation's painting, then width, rate and alpha in stage units. */
type Steam = [fx: number, fy: number, w: number, rate: number, a?: number];
/** x, y as fractions of that orientation's painting, then the ellipse radii in stage units. */
type Fire = [fx: number, fy: number, rx: number, ry: number];
/** One vessel on a rolling boil per orientation: domes swell out of the painted surface and burst, as in the hotpot room. */
type Heat = { steam?: { wide?: Steam[]; phone?: Steam[] }; fire?: { wide?: Fire[]; phone?: Fire[] }; pot?: { wide?: Fire; phone?: Fire } };
/**
 * Library sprites hung over the painting, per orientation. Every Vietnam painting was composed with an empty peg,
 * rail, nail or beam for exactly one of the six delivered sprites, so nothing is hung beside a painted twin.
 * `fx`, `fy` and `fw` are fractions of that orientation's painting, measured on its own pixels; the sprite pivots
 * at its top, where its cord loop sits on the painted support.
 */
type Hung = { wide?: HungSprite[]; phone?: HungSprite[] };
type Room = { title: string; zh: string; caption: string; touches: Touch[]; heat: Heat; hung?: Hung };

// The discovery card art lives in public/scenes/vietnam-food; scene.ts takes a folder when the food key carries one.
const card = (stem: string) => `vietnam-food/${stem}`;

// Every fraction below was read off the delivered file at that orientation, never converted from the other one.
// The engine keeps one fire ellipse per orientation, so each room lists only the flame the visitor looks at.
// Hot in these rooms: broth and stock pots, the charcoal grill, the cloth and bamboo steamers, the stove and oven
// mouths, the clay fish pot and the banh xeo pan. Cold, and dry in every orientation: herb plates, raw vermicelli
// and rice noodles, green rice flakes, lotus wrapping, pickles, the loaf on the board and the pate in its crock.
// vn_com_vong is the one room with no steam at all: its only heat is the fire under the roasting pan, and what it
// pictures beside that is young grain being pounded, winnowed and wrapped, all of it cold.
const rooms: Record<string, Room> = {
  vn_pho: {
    title: 'The gánh phở', zh: 'Phở gánh', caption: 'A whole breakfast kitchen carried on one shoulder pole: stock over charcoal, flat noodles, one bowl at a time.',
    heat: {
      // the open stock pot over its charcoal, and the bowl the broth has just gone into. The flat noodles waiting
      // in their basket, the raw beef on its plate, the herbs, the limes and the spice tray are all cold.
      steam: { wide: [[.275, .515, 300, 10, .28], [.505, .645, 130, 9, .26]], phone: [[.29, .578, 190, 10, .28], [.515, .638, 110, 9, .26]] },
      fire: { wide: [[.272, .762, 78, 24]], phone: [[.26, .722, 34, 12]] },
      // the wide painting looks down the outside of the pot and shows no liquid; the portrait opens the mouth and
      // shows the stock with the bones in it, so only the portrait carries the boil
      pot: { phone: [.29, .585, 170, 20] },
    },
    // Portrait only. This painting's empty peg is on the plaster at fx .037 to .099, fy .088 to .135, and that is
    // exactly where the room UI puts its title: `#scene.has-room-touches .scene-title` sits at top 68px with a
    // 400px max width, which covers painting x .027 to .336 and y .099 to .250 at 1280 x 720. A bundle hung on
    // that peg was measured on the live page and is completely behind the heading, so the wide painting leaves
    // its peg empty and gives the loop to the drip off the noodle strainer instead (vietnam-ambience.ts). The
    // portrait peg sits below the portrait heading and carries the sprite. See docs/vietnam-rooms.md.
    hung: {
      phone: [{ name: 'vn-herb-bundle', fx: .1475, fy: .172, fw: .105, sway: 3.2, tone: .86 }],
    },
    touches: [
      [0, 'detail', [.68, .78], [.69, .683]],
      [1, 'detail', [.74, .67], [.76, .575], card('pho')],
      [2, 'detail', [.27, .375], [.72, .305]],
    ],
  },
  vn_bun_cha: {
    title: 'The charcoal grill', zh: 'Bún chả', caption: 'Pork over an open brazier in the Old Quarter, and a bowl of fish-sauce broth waiting for it.',
    heat: {
      // the smoke off the grate, and the dish of pork just lifted off it. The cool vermicelli, the lettuce and
      // herbs and the dipping bowl of fish sauce, water, vinegar and green papaya stay dry.
      steam: { wide: [[.27, .695, 270, 10, .24], [.435, .625, 110, 8, .22]], phone: [[.56, .60, 200, 10, .24], [.83, .615, 110, 8, .22]] },
      fire: { wide: [[.245, .815, 230, 26]], phone: [[.56, .725, 60, 16]] },
    },
    hung: {
      wide: [{ name: 'vn-herb-bundle', fx: .811, fy: .186, fw: .058, sway: 3.4, tone: .88 }],
      phone: [{ name: 'vn-herb-bundle', fx: .715, fy: .172, fw: .105, sway: 3.4, tone: .88 }],
    },
    touches: [
      [0, 'sizzle', [.25, .77], [.52, .685]],
      [1, 'detail', [.535, .715], [.59, .81]],
      [2, 'detail', [.735, .90], [.865, .82], card('bun-cha')],
    ],
  },
  vn_banh_cuon: {
    title: 'The cloth steamer', zh: 'Bánh cuốn', caption: 'Batter poured onto a cloth over boiling water, covered for seconds, then lifted off as a sheet.',
    heat: {
      // the cloth over the boiling drum, and the finished rolls on their tray. The batter in its bowl, the cooked
      // filling on the board and the fried shallot are cold.
      steam: { wide: [[.27, .592, 300, 10, .28], [.535, .818, 110, 7, .22]], phone: [[.35, .607, 200, 10, .28], [.85, .735, 90, 7, .22]] },
      fire: { wide: [[.245, .872, 60, 18]], phone: [[.395, .772, 36, 12]] },
    },
    hung: {
      wide: [{ name: 'vn-rice-sieve', fx: .867, fy: .132, fw: .050, sway: 2.8, tone: .84 }],
      phone: [{ name: 'vn-rice-sieve', fx: .8075, fy: .170, fw: .095, sway: 2.8, tone: .84 }],
    },
    touches: [
      [0, 'tea', [.27, .655], [.35, .625], card('banh-cuon')],
      [1, 'detail', [.66, .695], [.79, .685]],
      [2, 'detail', [.76, .862], [.47, .885]],
    ],
  },
  vn_com_vong: {
    title: 'The green-rice courtyard', zh: 'Cốm Vòng', caption: 'Young rice roasted, pounded in a wooden mortar, winnowed and wrapped in lotus leaf.',
    heat: {
      // No steam anywhere in this room, in either orientation, and that is the whole point of it: the grain is
      // roasted dry in a flat pan, then pounded, winnowed and wrapped cold. The only heat pictured is the fire
      // under the roasting pan, and it gets an ellipse and nothing else.
      fire: { wide: [[.15, .835, 90, 24]], phone: [[.185, .572, 55, 22]] },
    },
    hung: {
      // two sprites in this room: the empty wall peg takes the sieve, and the open water takes one lotus leaf.
      // The lotus leaves the painting already carries (in the child's hands and in the basket at the lower right,
      // in both orientations) are left alone; the sprite hangs only where the picture shows clear water.
      // The wide peg at fx .050 to .098, fy .104 to .169 sits under the room heading, as vn_pho's does, so the
      // sieve hangs in the portrait only and the wide loop goes to sparks off the roasting fire.
      wide: [{ name: 'vn-lotus-leaf', fx: .677, fy: .412, fw: .046, sway: 2.0, tone: .92 }],
      phone: [{ name: 'vn-rice-sieve', fx: .8075, fy: .094, fw: .095, sway: 2.6, tone: .86 },
        { name: 'vn-lotus-leaf', fx: .345, fy: .238, fw: .088, sway: 2.0, tone: .92 }],
    },
    touches: [
      [0, 'detail', [.80, .735], [.43, .79], card('com-vong')],
      [1, 'detail', [.665, .822], [.79, .87]],
      [2, 'sizzle', [.155, .745], [.16, .50]],
    ],
  },
  vn_bun_bo_hue: {
    title: 'The Huế broth bench', zh: 'Bún bò Huế', caption: 'Red-gold lemongrass broth poured through a strainer into the bowl, with the herbs kept beside it.',
    heat: {
      // the open pot with the lemongrass in it, and the bowl the strained broth is filling. The herb plate, the
      // round vermicelli, the raw beef and the lime and chilli dishes stay dry.
      steam: { wide: [[.16, .555, 300, 10, .28], [.405, .618, 120, 9, .26]], phone: [[.17, .605, 200, 10, .28], [.55, .612, 110, 9, .26]] },
      fire: { wide: [[.255, .875, 70, 20]], phone: [[.13, .745, 55, 20]] },
      pot: { wide: [.16, .570, 250, 28], phone: [.17, .625, 170, 24] },
    },
    // Portrait only, for the same reason as vn_pho: the wide rail runs from fx .023 to .220 at fy .119 to .188,
    // under the room heading, and a bundle hung there was invisible on the live page. The wide loop goes to the
    // haze over the Perfume River instead. The portrait rail is on the right and clears the heading.
    hung: {
      phone: [{ name: 'vn-herb-bundle', fx: .805, fy: .190, fw: .100, sway: 3.0, tone: .86 }],
    },
    touches: [
      [0, 'detail', [.12, .84], [.42, .795]],
      [1, 'detail', [.055, .455], [.56, .855]],
      [2, 'detail', [.72, .78], [.80, .81], card('bun-bo-hue')],
    ],
  },
  vn_hue_cakes: {
    title: 'The little cakes of Huế', zh: 'Bánh Huế', caption: 'A tray of bánh bèo lifted clear of the steamer, with bánh nậm folded in leaf and bánh bột lọc gone clear.',
    heat: {
      // the tray lifted out of the steamer and the open steamer under it. The folded leaf cakes waiting on the
      // bench, the scallion oil and the dipping sauce are not on the heat.
      steam: { wide: [[.175, .315, 260, 10, .28], [.175, .485, 190, 9, .26]], phone: [[.57, .365, 220, 10, .28], [.54, .455, 170, 9, .26]] },
      fire: { wide: [[.115, .90, 70, 18]], phone: [[.51, .645, 55, 16]] },
    },
    hung: {
      wide: [{ name: 'vn-banana-leaf', fx: .4825, fy: .128, fw: .075, sway: 2.4, tone: .88 }],
      phone: [{ name: 'vn-banana-leaf', fx: .245, fy: .100, fw: .130, sway: 2.4, tone: .88 }],
    },
    touches: [
      [0, 'tea', [.38, .805], [.21, .665], card('hue-cakes')],
      [1, 'detail', [.62, .78], [.76, .745]],
      [2, 'detail', [.665, .625], [.25, .845]],
    ],
  },
  vn_cao_lau: {
    title: 'The Hội An shophouse', zh: 'Cao lầu', caption: 'Thick grey-gold noodles turned once over the bowl, with the street at the front and the river at the back.',
    heat: {
      // the pot on the stove at the left and the bowl being built. The cracklings, the pork already sliced, the
      // herbs and the bean sprouts are cold.
      steam: { wide: [[.075, .385, 95, 7, .24], [.34, .585, 120, 8, .24]], phone: [[.16, .33, 90, 7, .24], [.47, .605, 150, 8, .24]] },
      // the wide painting opens the stove mouth at the left edge; the delivered portrait screens it behind the
      // work counter, so the portrait declares an empty list rather than glowing where no flame is pictured
      fire: { wide: [[.028, .515, 34, 26]], phone: [] },
    },
    hung: {
      // wide only. The portrait's fan nail sits at fx .919 to .962, outside the x .094 to .906 slice a 390-wide
      // phone shows of this painting, so a sprite on it would draw nothing at all; see docs/vietnam-rooms.md.
      wide: [{ name: 'vn-bamboo-fan', fx: .4185, fy: .120, fw: .075, sway: 2.6, tone: .86 }],
    },
    touches: [
      [0, 'detail', [.34, .70], [.47, .69], card('cao-lau')],
      [1, 'detail', [.115, .90], [.19, .82]],
      [2, 'detail', [.70, .33], [.58, .26]],
    ],
  },
  vn_mi_quang: {
    title: 'The Quảng Nam counter', zh: 'Mì Quảng', caption: 'One measured ladle of turmeric broth into a shallow bowl, so the toppings stay above the liquid.',
    heat: {
      // the broth pot and the bowl it is going into. The broad noodles, the sesame cracker, the peanuts and the
      // shredded banana flower stay dry.
      steam: { wide: [[.13, .49, 260, 10, .26], [.405, .655, 180, 10, .26]], phone: [[.12, .555, 200, 10, .26], [.51, .645, 150, 10, .26]] },
      // the embers under the copper pot are pictured in the wide painting only
      fire: { wide: [[.145, .688, 80, 18]], phone: [] },
    },
    hung: {
      wide: [{ name: 'vn-bamboo-fan', fx: .877, fy: .112, fw: .070, sway: 2.6, tone: .86 }],
      phone: [{ name: 'vn-bamboo-fan', fx: .813, fy: .165, fw: .090, sway: 2.6, tone: .86 }],
    },
    touches: [
      [0, 'detail', [.135, .845], [.20, .79], card('mi-quang')],
      [1, 'detail', [.775, .84], [.88, .645]],
      [2, 'detail', [.59, .70], [.60, .885]],
    ],
  },
  vn_bread_pate: {
    title: 'The bread and pâté counter', zh: 'Bánh mì pa tê', caption: 'Small thin-crusted loaves out of a charcoal oven, split on the board and spread with coarse pâté.',
    heat: {
      // the oven mouth with the loaves still in it. The loaf on the board, the pate in its crock, the basket of
      // cooled bread, the eggs and the herbs are all cold; this is the one counter in the set that sells nothing hot.
      steam: { wide: [[.10, .40, 160, 8, .24]], phone: [[.12, .415, 140, 8, .24]] },
      fire: { wide: [[.10, .495, 88, 22]], phone: [[.115, .505, 55, 18]] },
    },
    hung: {
      // wide only. The portrait's nail sits at fx .909 to .961, outside the slice a 390-wide phone shows.
      wide: [{ name: 'vn-bamboo-fan', fx: .907, fy: .120, fw: .062, sway: 2.4, tone: .86 }],
    },
    touches: [
      [0, 'sizzle', [.10, .35], [.13, .40]],
      [1, 'detail', [.345, .77], [.85, .625], card('bread-pate')],
      [2, 'detail', [.12, .75], [.17, .69]],
    ],
  },
  vn_hu_tieu: {
    title: 'The Chợ Lớn noodle shop', zh: 'Hủ tiếu', caption: 'A wire basket out of the stock, one sharp shake, and the noodles turned into a waiting bowl.',
    heat: {
      // the open stock pot and the bowl being filled. The dry noodles in their baskets, the chives, the shrimp
      // and the sliced pork on the counter stay dry.
      steam: { wide: [[.24, .70, 300, 10, .28], [.37, .625, 120, 9, .26]], phone: [[.15, .585, 190, 10, .28], [.46, .585, 110, 9, .26]] },
      // no flame is pictured in either orientation: the pot stands on a closed stove
      fire: { wide: [], phone: [] },
      pot: { wide: [.24, .755, 270, 40], phone: [.15, .60, 150, 26] },
    },
    hung: {
      wide: [{ name: 'vn-bamboo-fan', fx: .923, fy: .105, fw: .062, sway: 2.4, tone: .86 }],
      phone: [{ name: 'vn-bamboo-fan', fx: .154, fy: .152, fw: .120, sway: 2.4, tone: .86 }],
    },
    touches: [
      [0, 'detail', [.055, .555], [.115, .365]],
      [1, 'tea', [.24, .82], [.17, .62]],
      [2, 'detail', [.61, .81], [.45, .83], card('hu-tieu')],
    ],
  },
  vn_banh_xeo: {
    title: 'The sizzling pan', zh: 'Bánh xèo', caption: 'Rice flour, coconut milk and turmeric swirled round a hot pan until the edge browns and lifts.',
    heat: {
      // the pan over its hearth, the platter of finished crepes beside it, and the dimpled banh khot mould over
      // its own second hearth at the right. The batter in its bowl, the herbs, the bean sprouts and the dipping
      // bowl are cold.
      steam: { wide: [[.32, .485, 210, 9, .26], [.66, .715, 140, 7, .22], [.90, .730, 120, 8, .24]],
        phone: [[.47, .545, 200, 9, .26], [.22, .825, 140, 7, .22], [.79, .755, 110, 8, .24]] },
      fire: { wide: [[.31, .665, 130, 32]], phone: [[.51, .685, 70, 20]] },
    },
    hung: {
      // The round woven trays already painted hanging at the upper left of the portrait are left alone; the
      // banana leaf hangs on the empty roof beam the picture keeps clear for it.
      wide: [{ name: 'vn-banana-leaf', fx: .684, fy: .118, fw: .072, sway: 3.0, tone: .88 }],
      phone: [{ name: 'vn-banana-leaf', fx: .235, fy: .112, fw: .130, sway: 3.0, tone: .88 }],
    },
    touches: [
      [0, 'detail', [.09, .695], [.86, .69]],
      [1, 'detail', [.27, .82], [.22, .71], card('banh-xeo')],
      [2, 'sizzle', [.90, .81], [.79, .78]],
    ],
  },
  vn_mekong_home: {
    title: 'The delta family table', zh: 'Cơm nhà miền Tây', caption: 'River fish darkening in an open clay pot, a sour soup beside it and plain rice at the centre.',
    heat: {
      // the open clay pot with the glaze reducing in it, the bowl of sour canh chua, the small braised pot beside
      // it and the shared rice: everything on this table came off a fire a moment ago and the painting draws the
      // soup and the rice steaming. The herbs, the limes and the star fruit beside them are cold, and the bowls
      // the man and the boy are holding stay dry, as the paella cook's bowl does.
      steam: { wide: [[.655, .605, 240, 9, .26], [.145, .730, 130, 8, .24], [.320, .825, 100, 7, .22], [.120, .605, 80, 6, .22]],
        phone: [[.64, .555, 200, 9, .26], [.190, .715, 130, 8, .24], [.440, .855, 100, 7, .22], [.140, .900, 80, 6, .22]] },
      fire: { wide: [[.635, .885, 100, 24]], phone: [[.585, .735, 75, 22]] },
      pot: { wide: [.625, .685, 180, 42], phone: [.645, .60, 150, 30] },
    },
    hung: {
      // One sprite per orientation, because two would put this room at five always-on loops beside its signature,
      // its steam and its fire. The wide painting keeps a clear sky path over the water and takes the kingfisher,
      // which hangs nowhere else in the set; the portrait's own sky path runs off the phone's right edge, so the
      // portrait takes the banana leaf on the roof beam instead. See docs/vietnam-rooms.md.
      wide: [{ name: 'vn-kingfisher', fx: .494, fy: .060, fw: .058, sway: 2.2, tone: .92 }],
      phone: [{ name: 'vn-banana-leaf', fx: .285, fy: .112, fw: .130, sway: 2.8, tone: .88 }],
    },
    touches: [
      [0, 'tea', [.62, .70], [.63, .59], card('mekong-home')],
      [1, 'detail', [.14, .79], [.20, .74]],
      [2, 'detail', [.12, .63], [.155, .875]],
    ],
  },
};

const icons: Record<RoomEffect, string> = { detail: '⌕', tea: '♨', sizzle: '♨', flour: '⋯', leaves: '❧', water: '≈', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
function makeRoom(id: string, room: Room): SceneDef {
  const discoveries = VIETNAM_DISCOVERIES[id];
  const hotspots: SceneHotspot[] = room.touches.map(([index, effect, wide, phone, food], i) => ({
    id: `${id}-${i}`, label: discoveries[index].label, text: discoveries[index].text,
    x: wide[0] * 1600, y: wide[1] * 900, portrait: pAt(id, ...phone),
    interaction: { effect, icon: icons[effect], wide, phone, extent: effect === 'tea' ? [.045, .10] : [.10, .22], folder: id, food },
  }));
  const cfg: PaintedCfg = { id, folder: id, title: room.title, zh: room.zh, caption: room.caption,
    painting: true, hotspots, motes: 6, ambience: VIETNAM_AMBIENCE[id],
    light: { x: 750, y: 280, color: 'rgba(255,210,150,0.16)' }, portrait: {} };
  if (room.hung?.wide) cfg.hung = room.hung.wide;
  if (room.hung?.phone) cfg.portrait!.hung = room.hung.phone;
  const { steam, fire, pot } = room.heat;
  if (steam?.wide) cfg.steam = steam.wide.map(([fx, fy, w, rate, a = .28]) => ({ x: fx * 1600, y: fy * 900, w, rate, a }));
  if (steam?.phone) cfg.portrait!.steam = steam.phone.map(([fx, fy, w, rate, a = .28]) => ({ ...pAt(id, fx, fy), w, rate, a }));
  if (fire?.wide?.length) cfg.fire = fire.wide.map(([fx, fy, rx, ry]) => ({ x: fx * 1600, y: fy * 900, rx, ry }));
  // A portrait list of its own, empty or not, keeps a wide flame off the phone painting and vice versa.
  if (fire?.phone) cfg.portrait!.fire = fire.phone.map(([fx, fy, rx, ry]) => ({ ...pAt(id, fx, fy), rx, ry }));
  if (pot?.wide) { const [fx, fy, rx, ry] = pot.wide; cfg.pot = { x: fx * 1600, y: fy * 900, rx, ry }; }
  if (pot?.phone) { const [fx, fy, rx, ry] = pot.phone; cfg.portrait!.pot = { ...pAt(id, fx, fy), rx, ry }; }
  return paintedScene(cfg);
}
export const VIETNAM_SCENES: Record<string, () => SceneDef> = Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, () => makeRoom(id, room)]));
