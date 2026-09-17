/** The 12 Spain paintings as paintedScene configs. Wide and portrait anchors were measured separately on each file. */
import { paintedScene, pAt, type HungSprite, type PaintedCfg } from './scene-painted';
import type { SceneDef, SceneHotspot } from './scene';
import type { RoomEffect } from './scene-props';
import { SPAIN_AMBIENCE } from './spain-ambience';

type Point = [number, number];
type Touch = [label: string, text: string, effect: RoomEffect, wide: Point, phone: Point, food?: string];
/** x, y as fractions of that orientation's painting, then width, rate and alpha in stage units. */
type Steam = [fx: number, fy: number, w: number, rate: number, a?: number];
/** x, y as fractions of that orientation's painting, then the ellipse radii in stage units. */
type Fire = [fx: number, fy: number, rx: number, ry: number];
/** One vessel on a rolling boil per orientation: domes swell out of the painted surface and burst, as in the hotpot room. */
type Heat = { steam?: { wide?: Steam[]; phone?: Steam[] }; fire?: { wide?: Fire[]; phone?: Fire[] }; pot?: { wide?: Fire; phone?: Fire } };
/**
 * Sprites hung over the painting, per orientation. Spain uses one: the delivered `es-pepper-ristra`, laid over a
 * painted pepper string so the string can swing without being cut out of the picture. `fx`, `fy` and `fw` are
 * fractions of that orientation's painting, measured on its own pixels; the sprite pivots at its top, where its
 * twine loop sits on the painted hook.
 */
type Hung = { wide?: HungSprite[]; phone?: HungSprite[] };
type Room = { title: string; zh: string; caption: string; touches: Touch[]; heat: Heat; hung?: Hung };

// The discovery card art lives in public/scenes/spain-food; scene.ts takes a folder when the food key carries one.
const card = (stem: string) => `spain-food/${stem}`;

// Every fraction below was read off the delivered file at that orientation, never converted from the other one.
// The engine keeps one fire ellipse per orientation, so each room lists only the flame the visitor looks at.
const rooms: Record<string, Room> = {
  es_paella: {
    title: 'The rice fire', zh: 'Arròs a la valenciana', caption: 'A wide pan over vine prunings beside the paddies, rice one grain deep at the edges.',
    heat: {
      // the hero pan and the seafood pan at the left station; the portrait composition shows only the hero pan
      steam: { wide: [[.46, .635, 360, 10, .28], [.11, .425, 130, 9, .26]], phone: [[.40, .655, 175, 10, .28]] },
      fire: { wide: [[.47, .82, 225, 52]], phone: [[.46, .805, 110, 30]] },
    },
    touches: [
      ['Rice in the scoop', 'The grain is short and round, one of Bomba, Sénia, Bahía or Albufera, because the Denominación de Origen Arroz de Valencia protects only those (BOE, Order of 27 June 2001).', 'detail', [.13, .885], [.50, .885], card('paella')],
      ['The toasted edge', 'The crust the Valencians call socarrat forms where the rice touches the hot pan after the liquid is gone.', 'tea', [.29, .70], [.22, .735]],
      ['The bean bowl', 'The flat green beans are local varieties called ferraura and rotget, and the big white bean is garrofó, which goes in before the rice.', 'detail', [.165, .755], [.13, .83]],
    ],
  },
  es_tapas: {
    title: 'The tapas bar', zh: 'La barra de tapas', caption: 'Small plates under the Plaza Mayor arcade: bravas, croquetas, olives and a glass of vermouth.',
    heat: {
      // the cazuela of bravas straight from the fryer with the hot sauce going over it, and the plate of
      // croquetas cut open on its molten bechamel. The olives, the boquerones in oil, the vermouth, the
      // water carafe and the bread basket are cold and stay dry.
      steam: { wide: [[.355, .672, 200, 9, .24], [.685, .778, 150, 8, .24]], phone: [[.34, .620, 190, 9, .24], [.66, .745, 170, 8, .24]] },
    },
    touches: [
      ['The bravas', 'The sauce is built on paprika and oil, and the potato is fried, not boiled.', 'detail', [.39, .755], [.28, .67], card('tapas')],
      ['The croqueta', 'The filling is a thick béchamel, which is why it runs when it is cut.', 'detail', [.67, .83], [.62, .82]],
      ['The olive dish', 'The practice of putting something to eat on top of a glass is old, but the earliest dictionary record of the food sense of the word tapa is the Real Academia’s 1939 edition, where it is marked as an Andalusianism.', 'detail', [.25, .86], [.14, .815]],
    ],
  },
  es_jamon: {
    title: 'The ham counter', zh: 'Jamón ibérico', caption: 'One stall in the iron market hall, a leg in its clamp and slices thin enough to see through.',
    heat: {},
    touches: [
      ['The cut face', 'The slice is taken against the grain so it is thin enough to fold over itself.', 'detail', [.68, .58], [.52, .60], card('jamon')],
      ['The slices', 'The Spanish quality standard of 2014 (Real Decreto 4/2014) uses four seal colours, and only the black and red ones mean the pig finished on acorns.', 'detail', [.57, .80], [.38, .845]],
      ['The hanging legs', 'A ham is dried and aged for months to years before the first cut is made.', 'detail', [.77, .14], [.22, .13]],
    ],
  },
  es_tortilla: {
    title: 'The family kitchen', zh: 'Tortilla de patatas', caption: 'Eggs, potatoes and oil, a second tortilla setting on the range, and the onion argument.',
    // The painted string is out of both paintings (scripts/scenes/paint-out-strings.py); only its iron hook and its
    // twine tie are left, and the sprite hangs from them. Its rope loop sits on the wide painting's hook at y .030
    // to .045, and under the portrait's twine at y 0 to .022; its peppers fill the space the painted ones had.
    hung: {
      wide: [{ name: 'es-pepper-ristra', fx: .8554, fy: .0305, fw: .0382, sway: 2.6, tone: .75 }],
      phone: [{ name: 'es-pepper-ristra', fx: .5576, fy: .0207, fw: .1168, sway: 2.6, tone: .75 }],
    },
    heat: {
      // the pan of setting egg and the copper pot standing on the range beside it, both on the fire; the cups
      // being filled from the copper coffee pot on the back counter; and the finished tortilla on its dish in
      // the foreground, cut open a moment ago. The eggs, the raw potatoes, the sliced onion and the oil cruet
      // stay dry, and so does the cup held in the grandmother's hand.
      steam: { wide: [[.093, .450, 150, 10, .28], [.208, .452, 55, 7, .24], [.884, .437, 70, 7, .24], [.43, .690, 150, 7, .24]],
        phone: [[.63, .508, 110, 10, .28], [.38, .764, 170, 7, .24]] },
      fire: { wide: [[.091, .648, 62, 40]], phone: [[.52, .645, 22, 12]] },   // the open firebox
    },
    touches: [
      ['The wedge', 'The potato is softened slowly in oil rather than crisped, which is why the layers stay soft.', 'detail', [.455, .785], [.47, .84], card('tortilla')],
      ['The potatoes', 'The earliest known written mention is a Navarrese memorial of 14 May 1817 that describes stretching two or three eggs for five or six people with potatoes and bread scraps.', 'detail', [.63, .75], [.20, .69]],
      ['The eggs', 'A Spanish national survey reported in 2024 found 71.2 per cent of people preferred the version with onion.', 'detail', [.655, .865], [.66, .71]],
    ],
  },
  es_churros: {
    title: 'The churrería', zh: 'Churrería', caption: 'Morning in a lane off the square: ridged dough from the fryer and a cup of thick chocolate.',
    heat: {
      // the fryer and the copper chocolate pot, then the cup of chocolate standing on the customers' table and
      // the plate of churros just off the fryer beside it. The cup held up in a hand is left dry, the way the
      // paella cook's bowl is.
      steam: { wide: [[.86, .66, 150, 10, .26], [.665, .40, 60, 7, .24], [.252, .686, 45, 6, .24], [.177, .755, 80, 7, .24]],
        phone: [[.44, .465, 110, 10, .26], [.12, .415, 50, 7, .24], [.682, .800, 55, 6, .24], [.30, .762, 190, 8, .24]] },
      fire: { wide: [[.885, .905, 70, 20]], phone: [[.475, .595, 30, 10]] },   // the hearth under the fryer
      pot: { wide: [.897, .733, 163, 67], phone: [.50, .472, 80, 38] },   // the oil in the fryer, bubbling around the spiral of dough
    },
    touches: [
      ['The ridges', 'They come from the star-shaped nozzle the dough is pushed through, not from any shaping by hand.', 'detail', [.50, .76], [.28, .81], card('churros')],
      ['The chocolate cup', 'Chocolate a la taza is thickened so the churro can stand in it.', 'tea', [.25, .745], [.66, .835]],
      ['The fryer', 'The thick soft one is a porra, a different dough that carries a raising agent.', 'sizzle', [.86, .70], [.44, .49]],
    ],
  },
  es_pintxos: {
    title: 'The counter of small bites', zh: 'Pintxoak', caption: 'A long dark counter on the Cantabrian coast, one skewer of olive, anchovy and pickled pepper.',
    heat: {},
    touches: [
      ['The skewer', 'A green olive, a salt-cured anchovy and a pickled guindilla, dressed with oil.', 'detail', [.355, .63], [.43, .79], card('pintxos')],
      ['The anchovy', 'Italian salters working at Santoña and the nearby ports from about 1880 turned the Cantabrian anchovy into a cured product, and the fillet in oil is credited to Giovanni Vella Scaliota in 1883.', 'detail', [.24, .645], [.70, .885]],
      ['The pepper jar', 'The piparra is pickled green, mild, and is what keeps the bite sharp rather than hot.', 'detail', [.08, .635], [.15, .71]],
    ],
  },
  es_gazpacho: {
    title: 'The courtyard kitchen', zh: 'Gazpacho andaluz', caption: 'A cold red soup poured from an earthenware jug under an orange tree, garnishes in their own dishes.',
    heat: {},
    touches: [
      ['The tomato', 'Gazpacho existed long before the tomato as bread, garlic, oil, vinegar, water and salt, and only turned red in the nineteenth century.', 'detail', [.33, .73], [.09, .79]],
      ['The bowl', 'It is served cold, and the diced garnishes and hard-boiled egg go in separate dishes so each person builds their own.', 'detail', [.495, .75], [.47, .69], card('gazpacho')],
      ['The oil vessel', 'The vinegar is sherry vinegar, from the same Andalusian wine country as the bodega room.', 'detail', [.625, .66], [.785, .68]],
    ],
  },
  es_pulpo: {
    title: 'The fair cauldron', zh: 'Polbo á feira', caption: 'Octopus from a copper cauldron, cut with scissors onto a wooden plate under a granite arcade.',
    heat: {
      // the one copper cauldron, taken at two points across its boiling surface so the plume covers the rim it
      // fills, and the wooden plate the cook is cutting onto, as hot as the cauldron the pieces came out of
      steam: { wide: [[.885, .585, 255, 10, .28], [.945, .570, 115, 9, .26], [.645, .720, 170, 8, .24]], phone: [[.18, .555, 175, 10, .28], [.51, .682, 190, 8, .24]] },
      fire: { wide: [], phone: [[.14, .725, 30, 8]] },   // the wide painting hides the fire behind the table; the portrait shows it under the cauldron
    },
    touches: [
      ['The cut piece', 'The octopus is cut with scissors, which is why the pieces are round-edged and even.', 'detail', [.66, .60], [.57, .62], card('pulpo')],
      ['The paprika tin', 'The paprika travelled into inland Galicia along the same routes as the dried octopus, carried by maragato muleteers from León who brought it from Extremadura.', 'detail', [.51, .84], [.87, .83]],
      ['The wooden plate', 'The dish takes its name from the feira, the fair where it was sold, not from any method of cooking.', 'detail', [.645, .81], [.48, .74]],
    ],
  },
  es_pa_tomaquet: {
    title: 'The bread terrace', zh: 'Pa amb tomàquet', caption: 'Country bread rubbed with a halved tomato on a Barcelona terrace, then oil, then salt.',
    heat: {
      // the loaves coming off the peel at the bakery oven behind the terrace: the wide painting shows the lit
      // oven mouth and the baker's peel, the portrait shows him lifting the tray and already paints a wisp
      // above it. The rubbed slices, the tomatoes, the oil and the salt in the foreground are cold.
      steam: { wide: [[.033, .334, 70, 6, .24]], phone: [[.050, .296, 55, 6, .24]] },
    },
    touches: [
      ['The bread surface', 'The pulp and seeds go into the crumb and the skin stays in the hand.', 'detail', [.36, .81], [.60, .87], card('pa-tomaquet')],
      ['The halved tomato', 'The gastronome Néstor Luján placed the first written reference in 1884, in a letter by Pompeu Gener describing bread with oil dressed with tomato.', 'detail', [.345, .675], [.45, .62]],
      ['The cruet', 'The order is tomato, then oil, then salt, and reversing it makes the bread refuse the tomato.', 'detail', [.52, .67], [.155, .77]],
    ],
  },
  es_manchego: {
    title: 'The cheese farm', zh: 'Queso manchego', caption: 'Sheep’s milk curd pressed in an esparto band, the flock and two windmills beyond the door.',
    // The painted string is out of both paintings; the wide iron bracket at y .097 to .120 and the portrait's chain
    // hook at y .022 to .044 stay, and each sprite's rope loop sits on its own. The second, empty wall hook in the
    // wide painting is untouched, which is what makes the swing read as wind rather than as a shifting picture.
    hung: {
      wide: [{ name: 'es-pepper-ristra', fx: .7565, fy: .0960, fw: .0474, sway: 4.4, tone: .75 }],
      phone: [{ name: 'es-pepper-ristra', fx: .7670, fy: .0235, fw: .0831, sway: 2.6, tone: .78 }],
    },
    // No steam in either orientation. The copper caldero in the wide painting carried a plume until 2026-09-17,
    // when the owner said the farm has hot steam although nothing in it is read as a hot process. That is right:
    // the painting shows no fire under the caldero, no boil on its surface and no wisp of its own, and the room's
    // three touches and its story are about curd, the esparto band and the press, not about heating. Manchego milk
    // is warmed to about 30 degrees, which is blood heat and steams no more than a bucket of milk does. The whey
    // the painting really does show falling from the draining table into the tub took the freed slot, as a `drip`
    // in spain-ambience.ts. The portrait shows the press and the moulds and had no steam to lose.
    heat: {},
    touches: [
      ['The rind', 'The zig-zag on the side is the print of the plaited esparto band called a pleita, and the flower on each flat face is the print of the pressing board; the Denominación de Origen requires both.', 'detail', [.655, .73], [.75, .71], card('manchego')],
      ['The milk vessel', 'The milk may come only from Manchega sheep, whose milk runs 7 to 8 per cent fat.', 'detail', [.08, .78], [.12, .76]],
      ['The sheep', 'The Manchega breed is hornless in both sexes and there are about 556,000 breeding ewes in some 910 flocks.', 'detail', [.68, .46], [.30, .25]],
    ],
  },
  es_sidreria: {
    title: 'The cider house', zh: 'Sidrería asturiana', caption: 'A bottle raised high, a glass held low, and a finger of cider breaking against the glass.',
    heat: {},
    touches: [
      ['The stream', 'The cider is poured from a height so that it breaks against the glass and carries air, which is what the escanciado is for.', 'detail', [.485, .04], [.525, .085]],
      ['The glass', 'Only a culín, a small measure, is poured at a time, and it is drunk at once before the air leaves it.', 'detail', [.525, .588], [.615, .555], card('sidreria')],
      ['The apple crate', 'Asturias holds close to 500 apple varieties, 76 of them recognised under the protected name Sidra de Asturias, and UNESCO inscribed the cider culture in 2024.', 'detail', [.755, .69], [.88, .78]],
    ],
  },
  es_bodega: {
    title: 'The sherry bodega', zh: 'Bodega de Jerez', caption: 'Butts three tiers high, one shaft of light, and a thin thread of wine from the venencia.',
    heat: {},
    touches: [
      ['The flor', 'A living film of yeast grows on the wine’s surface and shields it from the air, which is why the butt is filled to only about 500 litres.', 'detail', [.20, .63], [.09, .52]],
      ['The venencia', 'The wine is drawn and poured in a thin thread from a height so it opens.', 'detail', [.49, .26], [.648, .17], card('bodega')],
      ['The stack', 'Wine is drawn from the lowest row, the solera, and each row is topped up from the row above, so no bottle is ever one year’s wine.', 'detail', [.85, .35], [.35, .25]],
    ],
  },
};

const icons: Record<RoomEffect, string> = { detail: '⌕', tea: '♨', sizzle: '♨', flour: '⋯', leaves: '❧', water: '≈', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
function makeRoom(id: string, room: Room): SceneDef {
  const hotspots: SceneHotspot[] = room.touches.map(([label, text, effect, wide, phone, food], i) => ({
    id: `${id}-${i}`, label, text, x: wide[0] * 1600, y: wide[1] * 900, portrait: pAt(id, ...phone),
    interaction: { effect, icon: icons[effect], wide, phone, extent: effect === 'tea' ? [.045, .10] : [.10, .22], folder: id, food },
  }));
  const cfg: PaintedCfg = { id, folder: id, title: room.title, zh: room.zh, caption: room.caption,
    painting: true, hotspots, motes: 6, ambience: SPAIN_AMBIENCE[id],
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
export const SPAIN_SCENES: Record<string, () => SceneDef> = Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, () => makeRoom(id, room)]));
