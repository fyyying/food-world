/** The 13 Italy paintings as paintedScene configs. Wide and portrait anchors were measured separately on each
 *  delivered file: `public/scenes/it_<id>/wide.jpg` is 1672 x 941 and maps to stage units as `x = fx * 1600`,
 *  `y = fy * 900`; `portrait.jpg` is 941 x 1672 and goes through `pAt(folder, fx, fy)`. No wide fraction was ever
 *  copied into a portrait. The per-room record, with every boundary and every reason, is docs/italy-rooms.md.
 *
 *  The three discovery subjects and their texts come from `ITALY_DISCOVERIES` in italy-stories.ts word for word;
 *  this file supplies only the effect and the two anchors. Every portrait anchor sits inside the middle 80 per cent
 *  of the painting's width (x .094 to .906), which is the slice a 390-wide viewport actually shows.
 *
 *  Hot and cold follow the "Shared contract: rooms" section of docs/italy-world.md and the paintings themselves.
 *  Six of the thirteen rooms are cold and carry no steam source and no fire ellipse at all: `it_casale` (the whey
 *  drips, nothing in the room is heated), `it_market`, `it_pescaria`, `it_bacaro`, `it_ballaro` and
 *  `it_pasticceria`. `it_tonnara` steams from three open coppers and still takes no fire, because its fires are
 *  behind the masonry and no flame is pictured.
 */
import { paintedScene, pAt, type PaintedCfg } from './scene-painted';
import type { SceneDef, SceneHotspot } from './scene';
import type { RoomEffect } from './scene-props';
import { ITALY_AMBIENCE, ITALY_HUNG } from './italy-ambience';
import { ITALY_DISCOVERIES } from './italy-stories';

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

// The discovery card art lives in public/scenes/italy-food; scene.ts takes the folder when the key carries one.
const card = (stem: string) => `italy-food/${stem}`;

const rooms: Record<string, Room> = {
  it_trattoria: {
    title: 'The trattoria', zh: 'Trattoria',
    caption: 'A family dining room under the slaughterhouse wall, where the fifth quarter is cooked and the wine comes by the foglietta.',
    heat: {
      // The open oxtail pot, the two pasta bowls and the grilled chops. The cut pecorino, the bread, the broad
      // beans and the wine are cold, and the tumblers the diners hold stay dry.
      steam: { wide: [[.675, .600, 240, 10, .24], [.500, .700, 180, 8, .24], [.420, .665, 150, 7, .24], [.670, .745, 140, 7, .24]],
        phone: [[.620, .565, 200, 10, .24], [.330, .680, 170, 8, .24], [.220, .610, 140, 7, .24]] },
      // The open firebox of the cast-iron range behind the oste: (.318 to .345, .425 to .485) in wide, and the same
      // range seen from the left at (.130 to .165, .300 to .350) in portrait.
      fire: { wide: [[.331, .462, 34, 16]], phone: [[.147, .322, 24, 14]] },
    },
    touches: [
      ['tea', [.675, .605], [.620, .575], card('trattoria')],
      ['tea', [.500, .720], [.330, .700]],
      ['detail', [.795, .745], [.790, .700]],
    ],
  },
  it_market: {
    title: 'Campo de’ Fiori', zh: 'Campo de’ Fiori',
    caption: 'The market that moved into this piazza in 1869, under a statue raised in 1889, and an artichoke turned against the knife.',
    heat: {
      // Nothing. Winter produce, a drained basket of ricotta, a brass balance and a piazza: the room is cold from
      // one edge to the other and the only wisps in it are painted light.
    },
    touches: [
      ['detail', [.405, .480], [.310, .510], card('market')],
      ['detail', [.600, .745], [.450, .765]],
      ['detail', [.545, .615], [.430, .565]],
    ],
  },
  it_pasta: {
    title: 'The pasta kitchen', zh: 'Il tirasfoglia',
    caption: 'One board, one pin a metre long, and a sheet rolled until the light comes through it.',
    heat: {
      // The open copper on the range at the back, the room's only hot vessel. The sheet, the ribbons, the nests,
      // the dried maccheroni, the eggs and the flour are all cold.
      steam: { wide: [[.255, .190, 150, 8, .24]], phone: [[.215, .265, 140, 8, .24]] },
      fire: { wide: [[.262, .315, 34, 14]], phone: [[.225, .425, 26, 14]] },
    },
    touches: [
      ['flour', [.395, .655], [.365, .585], card('pasta')],
      ['detail', [.665, .265], [.645, .400]],
      ['detail', [.295, .855], [.320, .765]],
    ],
  },
  it_forno: {
    title: 'The forno', zh: 'Forno a legna',
    caption: 'The wood oven that bakes the quarter’s bread, and the long oiled sheet the baker tests its heat with.',
    heat: {
      // The pizza coming out on the peel, the tomato one cooling on the counter and the cut loaf. The cherry tart,
      // the flour and the herbs are cold.
      steam: { wide: [[.600, .440, 220, 9, .24], [.360, .685, 200, 8, .24], [.770, .730, 150, 7, .24]],
        phone: [[.600, .420, 180, 9, .24], [.350, .575, 170, 8, .24], [.620, .775, 130, 7, .24]] },
      fire: { wide: [[.667, .325, 62, 26]], phone: [[.805, .295, 34, 20]] },   // the open mouth of the wood oven
    },
    touches: [
      ['tea', [.600, .470], [.580, .440], card('forno')],
      ['sizzle', [.667, .310], [.805, .290]],
      ['detail', [.770, .755], [.600, .800]],
    ],
  },
  it_casale: {
    title: 'The casale', zh: 'Il casale',
    caption: 'A farmstead in the Agro Romano: the fold, the press and the oil jar in one cold yard.',
    heat: {
      // **Nothing at all.** This room has no fire, no range, no boiling and no steam anywhere, and its own touches
      // and story describe cutting, draining, pressing and salting. Its liquid is whey, and the whey drips.
    },
    touches: [
      ['detail', [.245, .565], [.150, .480], card('casale')],
      ['detail', [.500, .660], [.585, .575]],
      ['detail', [.830, .770], [.740, .830]],
    ],
  },
  it_pescaria: {
    title: 'The Pescaria', zh: 'La Pescaria',
    caption: 'The Rialto fish market at first light, under the plain iron canopy of 1884 and not the loggia that replaced it.',
    heat: {
      // Nothing. Raw fish on wet marble, live crabs, cuttlefish with the ink sac still in them: no hot process is
      // pictured and none is described, so the room stays dry.
    },
    touches: [
      ['detail', [.360, .600], [.420, .600], card('pescaria')],
      ['detail', [.755, .835], [.700, .845]],
      ['detail', [.300, .860], [.150, .780]],
    ],
  },
  it_bacaro: {
    title: 'The osteria', zh: 'Ostaria',
    caption: 'The one grade of Venetian wine house where people both drank and ate, and a glass filled half way from the cask.',
    heat: {
      // Nothing. Whipped stockfish on grilled polenta, sardines under vinegared onions, octopus, a bone and a glass
      // of wine. The polenta was grilled in another room and nothing here is over heat.
    },
    touches: [
      ['detail', [.095, .775], [.135, .715], card('bacaro')],
      ['detail', [.275, .785], [.285, .705]],
      ['detail', [.185, .585], [.205, .565]],
    ],
  },
  it_laguna: {
    title: 'The lagoon kitchen', zh: 'Cusina de laguna',
    caption: 'A fisherman’s house on Burano: the goby, the soft crab and the first artichoke off Sant’Erasmo.',
    heat: {
      // The open copper of rice, the pan of fish on the hearth and the polenta. The crab in its beaten egg, the
      // halved artichokes, the small fish on the board and the biscuits are all cold.
      steam: { wide: [[.910, .475, 180, 9, .24], [.880, .620, 160, 8, .24], [.510, .745, 150, 7, .24]],
        phone: [[.830, .405, 150, 9, .24], [.820, .505, 140, 8, .24], [.520, .625, 130, 7, .24]] },
      fire: { wide: [[.885, .795, 55, 20]], phone: [[.858, .600, 30, 16]] },   // the open hearth at the right
    },
    touches: [
      ['detail', [.125, .635], [.165, .435], card('laguna')],
      ['detail', [.645, .500], [.605, .430]],
      ['detail', [.345, .575], [.265, .500]],
    ],
  },
  it_veneto: {
    title: 'The farm kitchen', zh: 'Cusina de campagna',
    caption: 'The terraferma behind the lagoon: maize turning in the copper, and the poverty that came with it.',
    heat: {
      // The polenta copper over the fire, the hanging copper of beans and the dish of stewed meat. The polenta
      // slabs on the board, the split chicory, the bread and the wine are cold.
      steam: { wide: [[.800, .615, 260, 10, .24], [.885, .415, 140, 7, .24], [.615, .780, 160, 8, .24]],
        phone: [[.730, .490, 230, 10, .24], [.790, .290, 130, 7, .24], [.550, .800, 160, 8, .24]] },
      fire: { wide: [[.885, .800, 70, 26]], phone: [[.820, .610, 38, 20]] },   // the open hearth under the copper
      pot: { wide: [.800, .625, 110, 22], phone: [.730, .505, 80, 16] },   // the polenta folding over on itself
    },
    touches: [
      ['tea', [.800, .625], [.730, .510], card('veneto')],
      ['detail', [.345, .705], [.360, .680]],
      ['detail', [.445, .500], [.280, .430]],
    ],
  },
  it_friggitoria: {
    title: 'The friggitoria', zh: 'Friggitoria',
    caption: 'One pan of lard in the Albergheria, and everything Palermo eats standing up.',
    heat: {
      // The pan of lard the chickpea squares go into, the copper of spleen and the second pan at the right. The
      // panelle slabs, the arancine, the sfincione, the packed rolls and the lemons are cold.
      steam: { wide: [[.740, .615, 230, 10, .24], [.160, .555, 240, 9, .24], [.910, .500, 140, 7, .24]],
        phone: [[.760, .515, 200, 10, .24], [.120, .475, 220, 9, .24]] },
      fire: { wide: [[.735, .765, 60, 18]], phone: [[.765, .605, 34, 16]] },   // the charcoal under the pan
      pot: { wide: [.740, .655, 130, 22], phone: [.760, .545, 90, 16] },   // the lard lifting and closing
    },
    touches: [
      ['sizzle', [.735, .645], [.770, .545], card('friggitoria')],
      ['detail', [.160, .575], [.175, .500]],
      ['detail', [.855, .850], [.470, .850]],
    ],
  },
  it_ballaro: {
    title: 'Ballarò', zh: 'Ballarò',
    caption: 'The market as a kitchen, with the vendors’ sung cry over it and water thrown across the swordfish all morning.',
    heat: {
      // Nothing. A wet slab, a cut swordfish steak, sardines, snails, wild fennel, lemons and a board of dried
      // tomato paste. Ballarò cooks nothing; it keeps things cold and wet.
    },
    touches: [
      ['detail', [.470, .520], [.380, .475], card('ballaro')],
      ['detail', [.190, .620], [.165, .685]],
      ['detail', [.340, .835], [.235, .860]],
    ],
  },
  it_pasticceria: {
    title: 'The pasticceria', zh: 'Pasticceria',
    caption: 'Ricotta, almond and ice, and a calendar of feast days to sell them on.',
    heat: {
      // **No steam anywhere**, which the picture was accepted on. Ricotta, candied fruit, a cut cassata, fried
      // shells, a tub of ice and a jug of milk: everything in the room is cold or frozen.
    },
    touches: [
      ['detail', [.435, .245], [.325, .445], card('pasticceria')],
      ['detail', [.645, .705], [.755, .775]],
      ['detail', [.215, .400], [.155, .335]],
    ],
  },
  it_tonnara: {
    title: 'The tonnara kitchen', zh: 'Tunnara',
    caption: 'Favignana: one fish, boiled, tinned and covered in oil, and nothing of it thrown away.',
    heat: {
      // Three open coppers at a rolling boil. The pressed roe, the cooled loins on their racks and the filled tins
      // are cold, and the oil going into the tins is cold too.
      steam: { wide: [[.270, .545, 250, 10, .24], [.440, .545, 230, 9, .24], [.655, .545, 220, 9, .24]],
        phone: [[.100, .505, 180, 9, .24], [.300, .490, 200, 10, .24], [.550, .490, 190, 9, .24]] },
      // No flame is pictured: the coppers are set in masonry and fired from behind it, so both orientations
      // declare an empty fire list and the freed loop goes to the coast's own light.
      fire: { wide: [], phone: [] },
      pot: { wide: [.440, .565, 110, 20], phone: [.300, .505, 90, 16] },
    },
    touches: [
      ['tea', [.265, .500], [.330, .420], card('tonnara')],
      ['detail', [.868, .590], [.862, .650]],
      ['detail', [.680, .800], [.600, .870]],
    ],
  },
};

const icons: Record<RoomEffect, string> = { detail: '⌕', tea: '♨', sizzle: '♨', flour: '⋯', leaves: '❧', water: '≈', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
function makeRoom(id: string, room: Room): SceneDef {
  const discoveries = ITALY_DISCOVERIES[id] ?? [];
  const hotspots: SceneHotspot[] = room.touches.map(([effect, wide, phone, food], i) => {
    const [label, text] = discoveries[i] ?? ['', ''];
    return { id: `${id}-${i}`, label, text, x: wide[0] * 1600, y: wide[1] * 900, portrait: pAt(id, ...phone),
      interaction: { effect, icon: icons[effect], wide, phone, extent: effect === 'tea' ? [.045, .10] : [.10, .22], folder: id, food } };
  });
  const cfg: PaintedCfg = { id, folder: id, title: room.title, zh: room.zh, caption: room.caption,
    painting: true, hotspots, motes: 6, ambience: ITALY_AMBIENCE[id],
    light: { x: 780, y: 270, color: 'rgba(255,214,152,0.16)' }, portrait: {} };
  const hung = ITALY_HUNG[id];
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
export const ITALY_SCENES: Record<string, () => SceneDef> = Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, () => makeRoom(id, room)]));
