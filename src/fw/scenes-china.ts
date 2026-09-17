// The Living Scenes of the China world: which object opens which room, and how each painted room is laid out.
// Coordinates are stage units (1600×900); `at(folder, fx, fy)` is a point inside the centred cover painting.

import { type SceneDef } from "./scene";
import { paintedScene, at, pAt } from "./scene-painted";
import { XINJIANG_AMBIENCE } from "./scene-ambience";

// Painting coordinates → stage: the wide painting (1672×941) is stretched to 1616×910 at (−8,−5).
const hotpot = (): SceneDef => {
  const f = "hotpot";
  return paintedScene({
    id: "hotpot", folder: f, title: "Hotpot house", zh: "火锅", caption: "A divided pot rolling on the burner, thin beef in and out in seconds, and a table that never empties.",
    painting: true, night: true,
    hotspots: [
      { id: "pot", label: "Wake the broth", activeLabel: "Let it simmer", x: 600, y: 620, portrait: pAt(f, 0.30, 0.65), text: "The pot bubbles harder. Broth, dipping sauce and ingredients come together at the table." },
      { id: "chilli", label: "Discover málà", x: 870, y: 635, portrait: pAt(f, 0.57, 0.69), text: "麻 is Sichuan pepper’s tingle; 辣 is chilli’s heat. Together: 麻辣, málà." },
      { id: "diner", label: "Share the table", x: 1115, y: 390, portrait: pAt(f, 0.73, 0.54), text: "One pot, a table of ingredients, and everyone cooking together. Add a little, share a little, keep talking." },
    ],
    hang: [
      { name: "red-lantern", prop: true, x: 700, y: -8, w: 108, sway: 3, halo: 1.4 },
      { name: "lantern-2", prop: true, x: 1040, y: -10, w: 96, sway: 3.2, halo: 1.3 },
    ],
    front: [
      { name: "sauces", prop: true, x: -60, w: 380 },
      { name: "scallions", prop: true, x: 1300, w: 330 },
    ],
    pot: { x: 782, y: 580, rx: 135, ry: 29 },
    steam: [{ x: 782, y: 556, w: 200, rate: 18, a: 0.32 }],
    lamps: [
      { x: 84, y: 101, r: 70 }, { x: 219, y: 116, r: 60 }, { x: 403, y: 101, r: 60 }, { x: 495, y: 145, r: 55 }, { x: 1273, y: 77, r: 75 }, { x: 1442, y: 43, r: 80 },
      { x: 1485, y: 759, r: 70 }, { x: 374, y: 338, r: 30 }, { x: 640, y: 387, r: 25 }, { x: 466, y: 406, r: 25 }, { x: 1432, y: 387, r: 30 }, { x: 1258, y: 464, r: 25 }, { x: 1311, y: 478, r: 25 },
    ],
    leaves: 2, motes: 70,
    portrait: {
      pot: { ...pAt(f, 0.474, 0.635), rx: 91, ry: 24 },
      steam: [{ ...pAt(f, 0.474, 0.615), w: 130, rate: 15, a: 0.3 }],
      lamps: [
        { ...pAt(f, 0.17, 0.04), r: 60 }, { ...pAt(f, 0.23, 0.16), r: 45 }, { ...pAt(f, 0.3, 0.2), r: 40 }, { ...pAt(f, 0.7, 0.15), r: 50 }, { ...pAt(f, 0.82, 0.19), r: 45 },
        { ...pAt(f, 0.04, 0.46), r: 22 }, { ...pAt(f, 0.32, 0.44), r: 20 }, { ...pAt(f, 0.76, 0.47), r: 22 }, { ...pAt(f, 0.95, 0.47), r: 22 }, { ...pAt(f, 0.92, 0.8), r: 55 },
      ],
    },
    light: { x: 782, y: 300, color: "rgba(255,190,110,0.34)" },
  });
};

const noodleShop = (): SceneDef => {
  const f = "noodle_shop";
  return paintedScene({
    id: "noodle_shop", folder: f, title: "Noodle shop", zh: "面馆", caption: "Hand-pulled noodles slapped on the board, broth that has been going since dawn, and a bowl in under a minute.",
    painting: true,
    hang: [
      { name: "lantern", prop: true, x: 1225, y: -10, w: 118, sway: 3, halo: 1.3 },
      { name: "garlic-closeup", prop: true, x: 1400, y: -8, w: 96, sway: 3.5 },
    ],
    front: [
      { name: "doubanjiang-jar", prop: true, x: -40, w: 300 },
      { name: "bowls", prop: true, x: 1250, w: 370 },
    ],
    walkers: [{ name: "bird", w: 72, y: 168, from: 1090, to: 1350, dur: 7, every: 40, fly: true }],   // the patch of sky above the street's roofs
    steam: [{ x: 167, y: 520, w: 120, rate: 16, a: 0.4 }, { x: 300, y: 760, w: 80, rate: 6, a: 0.3 }, { x: 760, y: 790, w: 60, rate: 5, a: 0.28 }],
    lamps: [{ x: 490, y: 80, r: 100 }, { x: 1580, y: 120, r: 90 }, { x: 720, y: 290, r: 40 }, { x: 1090, y: 280, r: 40 }, { x: 1230, y: 330, r: 35 }, { x: 1420, y: 330, r: 35 }],
    motes: 50,
    portrait: {
      steam: [{ ...pAt(f, 0.31, 0.42), w: 70, rate: 12, a: 0.36 }, { ...pAt(f, 0.5, 0.6), w: 40, rate: 5, a: 0.26 }, { ...pAt(f, 0.45, 0.85), w: 50, rate: 5, a: 0.28 }],
      lamps: [{ ...pAt(f, 0.35, 0.09), r: 70 }, { ...pAt(f, 0.34, 0.2), r: 30 }, { ...pAt(f, 0.58, 0.29), r: 18 }, { ...pAt(f, 0.88, 0.31), r: 20 }],
      walkers: [{ name: "bird", w: 40, y: 190, from: pAt(f, 0.6, 0).x, to: pAt(f, 0.95, 0).x, dur: 7, every: 40, fly: true }],
    },
    light: { x: 500, y: 260, color: "rgba(255,200,130,0.3)" },
  });
};

const teahouse = (): SceneDef => {
  const f = "teahouse";
  return paintedScene({
    id: "teahouse", folder: f, title: "Tea house", zh: "茶馆", caption: "Bamboo chairs, lid-cups of jasmine refilled all afternoon, and the kettle on the brazier never quite off the boil.",
    painting: true,
    hang: [
      { name: "lantern", prop: true, x: 1170, y: -10, w: 124, sway: 3, halo: 1.3 },
    ],
    front: [
      { name: "tea-chair", prop: true, x: -50, w: 290 },
    ],
    walkers: [{ name: "bird", w: 66, y: 282, from: 640, to: 1060, dur: 9, every: 36, fly: true }],   // over the hills, below the tips of the painted tassels, so it stays outside
    steam: [{ x: 100, y: 420, w: 30, rate: 4, a: 0.22 }, { x: 1330, y: 720, w: 40, rate: 4, a: 0.26 }],
    lamps: [{ x: 590, y: 130, r: 90 }, { x: 1500, y: 120, r: 100 }, { x: 200, y: 140, r: 50 }, { x: 455, y: 230, r: 45 }, { x: 1320, y: 330, r: 50 }],
    leaves: 3, motes: 50,
    portrait: {
      steam: [{ ...pAt(f, 0.05, 0.43), w: 20, rate: 3, a: 0.2 }, { ...pAt(f, 0.86, 0.8), w: 30, rate: 4, a: 0.24 }],
      lamps: [{ ...pAt(f, 0.09, 0.11), r: 60 }, { ...pAt(f, 0.97, 0.12), r: 60 }, { ...pAt(f, 0.24, 0.24), r: 30 }, { ...pAt(f, 0.86, 0.3), r: 25 }, { ...pAt(f, 0.76, 0.33), r: 20 }],
      walkers: [{ name: "bird", w: 44, y: 250, from: pAt(f, 0.42, 0).x, to: pAt(f, 0.8, 0).x, dur: 8, every: 36, fly: true }],
    },
    light: { x: 800, y: 200, color: "rgba(255,225,170,0.22)" },
  });
};

const market = (): SceneDef => {
  const f = "market";
  return paintedScene({
    id: "market", folder: f, title: "Village market", zh: "菜市场", caption: "Chillies by the sack, garlic in braids, greens still wet from the field, and everyone shouting prices.",
    painting: true,
    hang: [
      { name: "lantern", prop: true, x: 540, y: -10, w: 110, sway: 3, halo: 1.2 },
      { name: "red-lantern", prop: true, x: 1150, y: -8, w: 118, sway: 3.5, halo: 1.4 },
    ],
    front: [
      { name: "chilli-basket", prop: true, x: -70, w: 420 },
      { name: "stand-sign", prop: true, x: 1300, w: 320 },
    ],
    steam: [{ x: 1550, y: 450, w: 60, rate: 6, a: 0.3 }],
    ambience: [
      // Leaves first: they took the slot the distant haze had when the chilli crop came out on 2026-09-17, and they
      // put the motion back that the swaying crop used to carry. Both boxes sit inside the painted canopy over the
      // lane and stop above the shoppers' heads.
      { kind: 'leaves', wide: [.38,.02,.62,.28], phone: [.42,.12,.64,.30], count: 8, size: 1.5 },
      { kind: 'sunray', wide: [.43,0,.78,.72], phone: [.32,0,.72,.72], angles: [-.42,.36] },
      { kind: 'mist', wide: [.53,.05,.82,.32], phone: [.40,.10,.78,.28] },
    ],
    lamps: [{ x: 1359, y: 67, r: 80 }, { x: 1273, y: 143, r: 60 }, { x: 713, y: 206, r: 45 }, { x: 1411, y: 230, r: 60 }],
    leaves: 3.5, motes: 40,
    portrait: {
      steam: [{ ...pAt(f, 0.44, 0.38), w: 30, rate: 5, a: 0.28 }],
      lamps: [{ ...pAt(f, 0.27, 0.22), r: 60 }, { ...pAt(f, 0.32, 0.06), r: 30 }, { ...pAt(f, 0.96, 0.2), r: 40 }, { ...pAt(f, 0.83, 0.42), r: 25 }],
    },
    light: { x: 800, y: 250, color: "rgba(255,230,190,0.2)" },
  });
};

const homeKitchen = (): SceneDef => {
  const f = "home_kitchen";
  return paintedScene({
    id: "home_kitchen", folder: f, title: "Home kitchen", zh: "家常厨房", caption: "A wok over a wood fire, chillies and garlic on the wall, and dinner for the family in twenty minutes.",
    painting: true,
    hang: [
      { name: "garlic-hanging", prop: true, x: 985, y: -8, w: 92, sway: 3.5 },
      { name: "lantern", prop: true, x: 1120, y: -10, w: 130, sway: 3, halo: 1.3 },
      { name: "chilli-hanging", prop: true, x: 1528, y: -8, w: 92, sway: 3 },
    ],
    front: [
      { name: "veggie-basket-2", prop: true, x: -80, w: 380 },
    ],
    steam: [{ x: 191, y: 440, w: 110, rate: 16, a: 0.4 }],
    ambience: [
      // The garlic braid went the way of the chilli curtain on 2026-09-17: its crop was the same colour cut-out,
      // and the braid hangs in the same crowded corner. The pictured paper lantern takes the slot.
      { kind: 'light', wide: [.228,0,.298,.088], phone: [.338,.034,.462,.103] },   // the lit paper lantern over the counter, measured on its glass in each composition
      { kind: 'mist', wide: [.58,.16,.76,.33], phone: [.68,.14,.86,.31] },
    ],
    lamps: [{ x: 450, y: 40, r: 90 }],
    motes: 50,
    portrait: {
      steam: [{ ...pAt(f, 0.27, 0.48), w: 80, rate: 16, a: 0.4 }],
      lamps: [{ ...pAt(f, 0.4, 0.09), r: 70 }],
    },
    light: { x: 300, y: 380, color: "rgba(255,180,100,0.3)" },
  });
};

const tower = (): SceneDef => {
  const f = "historical_tower";
  return paintedScene({
    id: "tower", folder: f, title: "The old tower", zh: "锦官城楼", caption: "Chengdu at dusk from the tower: lanterns coming on street by street, boats sliding home under the bridge.",
    painting: true,
    hang: [
      { name: "red-lantern", prop: true, x: 40, y: -8, w: 130, sway: 3, halo: 1.4 },
      { name: "bell", prop: true, x: 985, y: -6, w: 100, sway: 2.5 },
      { name: "maple-leaves", prop: true, x: 1230, y: -30, w: 440, sway: 1.5 },
    ],
    front: [
      { name: "fence", prop: true, x: -90, w: 500 },
      { name: "light-standing", prop: true, x: 1330, w: 270, halo: 0.9 },
    ],
    lamps: [{ x: 235, y: 150, r: 90 }],
    leaves: 2.5, motes: 30,
    // Both crops came out on 2026-09-17. The tassel crop took the whole paper lantern and left a seam beside it;
    // the bell crop smeared the eave carving and the sunset cloud behind it. Neither subject can be painted out
    // either: the lantern sits against posts and ginkgo, the bell against a carved eave. Both hang still now, and
    // the room lights the lantern it already shows and moves the haze the river valley already carries.
    ambience: [
      { kind: 'light', wide: [.103,.055,.163,.235], phone: [.185,.175,.258,.285] },   // the lit red lantern on the balcony post, measured on its paper in each composition
      { kind: 'leaves', wide: [.265,.135,.445,.335], phone: [.14,.22,.34,.44], count: 8, size: 1.5 },   // the leafy branch over the balustrade, and the creeper beside the lanterns in the portrait
      { kind: 'mist', wide: [.42,.30,.94,.42], phone: [.45,.32,.92,.44], alpha: .55 },   // the haze the painting already lays between the mountains and the lit town, at the strength the baseline asks for where the painting is already hazy
    ],
    portrait: {
      lamps: [{ ...pAt(f, 0.07, 0.2), r: 70 }, { ...pAt(f, 0.22, 0.25), r: 50 }, { ...pAt(f, 0.35, 0.4), r: 22 }],
    },
    light: { x: 800, y: 300, color: "rgba(255,190,120,0.24)" },
  });
};

// ---------- Jiangnan: the water towns (stage x ≈ −8 + fx·1616, y ≈ −5 + fy·910 from the wide painting) ----------
const wx = (fx: number) => Math.round(-8 + fx * 1616), wy = (fy: number) => Math.round(-5 + fy * 910);

const baoShop = (): SceneDef => { const f = "bao_shop"; return paintedScene({
  id: "bao_shop", folder: f, title: "Bao shop", zh: "包子铺", caption: "Steamers breathing on the corner since before dawn; the skins rolled, the pleats pinched, the soup inside.",
  painting: true,
  hang: [{ name: "lantern-2", prop: true, x: 1180, y: -10, w: 84, sway: 3, halo: 1.2 }],
  steam: [
    { x: wx(.40), y: wy(.30), w: 120, rate: 8, a: .27 },
    { x: wx(.72), y: wy(.68), w: 130, rate: 8, a: .27 },
    { x: wx(.87), y: wy(.76), w: 120, rate: 8, a: .26 },
  ],
  ambience: [{ kind: 'birds', wide: [.54,.06,.82,.25], phone: [.08,.10,.52,.31], period: 13 }],
  lamps: [{ x: wx(0.47), y: wy(0.06), r: 55 }],
  motes: 40,
  portrait: { steam: [
    { ...pAt(f,.83,.53), w: 90, rate: 8, a: .27 },
    { ...pAt(f,.84,.64), w: 110, rate: 8, a: .27 },
    { ...pAt(f,.92,.87), w: 100, rate: 8, a: .26 },
  ], lamps: [] },
  light: { x: wx(0.5), y: 260, color: "rgba(255,225,180,0.26)" },
}); };

const stoneBridge = (): SceneDef => { const f = "stone_bridge"; return paintedScene({
  id: "stone_bridge", folder: f, title: "The stone bridge", zh: "石拱桥", caption: "Willows over the canal, boats under the arch, the whole water town visible at once.",
  painting: true,
  steam: [{ x: wx(.33), y: wy(.84), w: 90, rate: 12, a: .28 }],
  // Wide only since 2026-09-17: the willow crop works in the wide painting, where the branch hangs inside more of
  // the same willow, but the portrait box straddles a roof ridge and a white gable and the repair duplicates them.
  ambience: [
    { kind: 'breeze', wide: [.39,0,.435,.18], source: 'leaves', period: 8.2, sway: [.025,.030] },
    { kind: 'leaves', phone: [.26,.06,.60,.28], leaf: 'olive', color: '#8fae52', count: 6, size: 1.3 },   // portrait only, in place of the crop: willow leaves falling inside the painted willow
  ],
  walkers: [{ name: "swallow", w: 54, y: 150, from: 560, to: 1150, dur: 9, every: 30, fly: true }],
  petals: { color: "rgba(180,215,120,0.9)", rate: 0.5, size: 5 },
  motes: 25,
  portrait: {
    steam: [{ ...pAt(f, .54, .80), w: 80, rate: 12, a: .28 }],
    walkers: [{ name: "swallow", w: 38, y: 200, from: pAt(f, 0.35, 0).x, to: pAt(f, 0.9, 0).x, dur: 8, every: 30, fly: true }],
    lamps: [],
  },
  light: { x: wx(0.55), y: 200, color: "rgba(255,240,210,0.18)" },
}); };

const crabPond = (): SceneDef => { const f = "crab_pond"; return paintedScene({
  id: "crab_pond", folder: f, title: "Crab feast under the osmanthus", zh: "蟹宴", caption: "Ninth month for the females, tenth for the males; warm wine, black vinegar and ginger, and all afternoon.",
  painting: true,
  steam: [{ x: wx(0.5), y: wy(0.6), w: 170, rate: 14, a: 0.36 }, { x: wx(0.34), y: wy(0.75), w: 60, rate: 4, a: 0.25 }],
  lamps: [{ x: wx(0.53), y: wy(0.05), r: 40 }],
  petals: { color: "rgba(244,197,66,0.95)", rate: 2.2, size: 4 },
  motes: 50,
  portrait: { steam: [{ ...pAt(f, 0.5, 0.63), w: 120, rate: 12, a: 0.36 }], lamps: [{ ...pAt(f, 0.85, 0.1), r: 45 }] },
  ambience: [{ kind: 'mist', wide: [.25,.30,.72,.42], phone: [.10,.28,.90,.40] }],   // the morning haze already lying on the lake
  light: { x: wx(0.5), y: 300, color: "rgba(255,215,150,0.26)" },
}); };

const jiangnanHome = (): SceneDef => { const f = "jiangnan_home"; return paintedScene({
  id: "jiangnan_home", folder: f, title: "Jiangnan home kitchen", zh: "江南人家", caption: "A fish in the steamer, pork in the pot, greens on the board, and everyone in the kitchen at once.",
  painting: true,
  hang: [{ name: "bamboo-blind", prop: true, x: 560, y: -14, w: 300, sway: 1 }],
  steam: [
    { x: wx(.47), y: wy(.74), w: 140, rate: 8, a: .26 },
    { x: wx(.64), y: wy(.61), w: 110, rate: 7, a: .25 },
    { x: wx(.84), y: wy(.63), w: 90, rate: 6, a: .24 },
  ],
  motes: 45,
  portrait: { steam: [
    { ...pAt(f,.67,.54), w: 120, rate: 8, a: .26 },
    { ...pAt(f,.27,.65), w: 110, rate: 7, a: .25 },
    { ...pAt(f,.10,.57), w: 80, rate: 6, a: .24 },
  ], lamps: [] },
  ambience: [{ kind: 'leaves', leaf: 'olive', color: '#7a9a55', wide: [.30,.02,.62,.22], phone: [.55,.02,.95,.22] }],   // willow leaves past the window
  light: { x: wx(0.5), y: 300, color: "rgba(255,225,180,0.24)" },
}); };

const lotusGarden = (): SceneDef => { const f = "lotus_garden"; return paintedScene({
  id: "lotus_garden", folder: f, title: "Lotus garden", zh: "荷塘", caption: "Roots in the mud, seeds in the pod, tea in the pavilion, and the pond breathing mist in the morning.",
  painting: true,
  mist: { x: wx(0.35), y: wy(0.5), w: 900, h: 110 },
  lamps: [{ x: wx(0.65), y: wy(0.24), r: 50 }],
  petals: { color: "rgba(244,166,184,0.9)", rate: 1.2, size: 6 },
  walkers: [{ name: "swallow", w: 50, y: 120, from: 300, to: 780, dur: 9, every: 34, fly: true }],
  motes: 35,
  portrait: { lamps: [{ ...pAt(f, 0.92, 0.17), r: 40 }], walkers: [{ name: "swallow", w: 36, y: 140, from: pAt(f, 0.2, 0).x, to: pAt(f, 0.75, 0).x, dur: 8, every: 34, fly: true }] },
  ambience: [{ kind: 'mist', wide: [.10,.36,.66,.50], phone: [.05,.38,.95,.50], alpha: .55 }, { kind: 'leaves', leaf: 'olive', color: '#7a9a55', wide: [0,0,.30,.25], phone: [0,0,.35,.20], count: 7, size: 1.3 }],   // the pond's own dawn mist; willow leaves at the top left
  light: { x: wx(0.5), y: 250, color: "rgba(255,240,215,0.2)" },
}); };

const riceWine = (): SceneDef => { const f = "rice_wine"; return paintedScene({
  id: "rice_wine", folder: f, title: "Rice wine cellar", zh: "酒坊", caption: "Steamed rice cooling in the baskets, urns under red cloth, and the master pouring the amber out.",
  painting: true,
  hang: [{ name: "lantern", prop: true, x: 1110, y: -10, w: 100, sway: 3, halo: 1.2 }],
  steam: [
    { x: wx(.13), y: wy(.38), w: 150, rate: 10, a: .27 },
    { x: wx(.18), y: wy(.66), w: 130, rate: 7, a: .25 },
  ],
  ambience: [{ kind: 'birds', wide: [.48,.05,.76,.22], phone: [.53,.10,.83,.28], period: 13 }],
  lamps: [{ x: wx(0.28), y: wy(0.06), r: 60 }],
  motes: 45,
  portrait: { steam: [
    { ...pAt(f,.10,.62), w: 120, rate: 10, a: .27 },
    { ...pAt(f,.24,.80), w: 110, rate: 7, a: .25 },
  ], lamps: [] },
  light: { x: wx(0.45), y: 300, color: "rgba(255,215,160,0.26)" },
}); };

const riverMarket = (): SceneDef => { const f = "river_market"; return paintedScene({
  id: "river_market", folder: f, title: "Canal market", zh: "水乡集市", caption: "Fish still flapping, shrimp still jumping, greens and lotus root off the boat and onto the steps.",
  painting: true,
  mist: { x: wx(0.55), y: wy(0.42), w: 700, h: 80 },
  walkers: [{ name: "swallow", w: 46, y: 110, from: 800, to: 1180, dur: 8, every: 32, fly: true }],
  petals: { color: "rgba(190,220,130,0.8)", rate: 0.4, size: 5 },
  motes: 35,
  portrait: { walkers: [{ name: "swallow", w: 34, y: 120, from: pAt(f, 0.3, 0).x, to: pAt(f, 0.85, 0).x, dur: 8, every: 32, fly: true }], lamps: [] },
  ambience: [{ kind: 'leaves', leaf: 'olive', color: '#7a9a55', wide: [.72,0,.98,.30], phone: [.55,0,.98,.20], count: 8, size: 1.4 }, { kind: 'birds', wide: [.50,0,.72,.10], phone: [.35,0,.75,.10], period: 8, scale: 1.4 }],
  light: { x: wx(0.4), y: 220, color: "rgba(255,240,210,0.2)" },
}); };

const riversideRestaurant = (): SceneDef => { const f = "riverside_restaurant"; return paintedScene({
  id: "riverside_restaurant", folder: f, title: "Riverside restaurant", zh: "河边饭馆", caption: "Vinegar fish, Dongpo pork, a soup and the greens, on a terrace over the boats.",
  painting: true,
  hang: [{ name: "lantern", prop: true, x: 1240, y: -10, w: 96, sway: 3, halo: 1.2 }],
  steam: [{ x: wx(0.62), y: wy(0.7), w: 130, rate: 12, a: 0.36 }, { x: wx(0.42), y: wy(0.78), w: 90, rate: 6, a: 0.28 }, { x: wx(0.32), y: wy(0.62), w: 60, rate: 4, a: 0.24 }],
  mist: { x: wx(0.55), y: wy(0.47), w: 650, h: 70 },
  lamps: [{ x: wx(0.1), y: wy(0.03), r: 60 }],
  motes: 40,
  portrait: { steam: [{ ...pAt(f, 0.42, 0.66), w: 110, rate: 12, a: 0.36 }, { ...pAt(f, 0.6, 0.75), w: 70, rate: 6, a: 0.28 }], lamps: [{ ...pAt(f, 0.28, 0.06), r: 50 }] },
  ambience: [{ kind: 'light', color: '#f3b25a', wide: [.04,0,.13,.10], phone: [.03,0,.15,.12] }, { kind: 'leaves', leaf: 'olive', color: '#7a9a55', wide: [.55,0,.98,.25], phone: [.45,0,.98,.18] }],   // the pictured lantern and the willow
  light: { x: wx(0.45), y: 300, color: "rgba(255,225,180,0.24)" },
}); };

const teaHill = (): SceneDef => { const f = "tea_hill"; return paintedScene({
  id: "tea_hill", folder: f, title: "Tea hill", zh: "茶山", caption: "Dragon Well before Qingming: a bud and a leaf, fired by hand the same afternoon, poured in a glass.",
  painting: true,
  mist: { x: wx(0.3), y: wy(0.3), w: 900, h: 110 },
  steam: [{ x: wx(0.42), y: wy(0.84), w: 90, rate: 7, a: 0.30 }, { x: wx(0.5), y: wy(0.8), w: 70, rate: 5, a: 0.28 }],   // two fresh glasses of Longjing
  petals: { color: "rgba(255,250,235,0.95)", rate: 0.9, size: 5 },
  motes: 30,
  portrait: { steam: [{ ...pAt(f, 0.35, 0.82), w: 70, rate: 6, a: 0.30 }, { ...pAt(f, 0.5, 0.78), w: 60, rate: 5, a: 0.28 }], lamps: [] },
  ambience: [{ kind: 'mist', wide: [.30,.10,.80,.35], phone: [.20,.10,.75,.30], alpha: .55 }, { kind: 'leaves', leaf: 'blossom', wide: [0,0,.30,.30], phone: [0,0,.32,.20] }],   // the valley mist in the painting; petals from the blossoming tree at the top left
  light: { x: wx(0.5), y: 220, color: "rgba(255,245,220,0.18)" },
}); };

// ---------- Xinjiang: the oasis road (paintings 1672×941 wide, 941×1672 portrait; fractions read off the grid sheets) ----------
const kebabGrill = (): SceneDef => { const f = "kebab_grill"; return paintedScene({
  id: "kebab_grill", folder: f, title: "The skewer stall", zh: "Kawap", caption: "Lamb and tail fat on iron skewers over charcoal, cumin and chilli thrown on as they turn, the smoke drifting into the vines at dusk.",
  painting: true,
  ambience: XINJIANG_AMBIENCE.kebab_grill,
  steam: [
    { x: wx(0.52), y: wy(0.70), w: 260, rate: 10, a: 0.28 },
    { x: wx(0.51), y: wy(0.53), w: 180, rate: 7, a: 0.20 },
  ],
  fire: [{ x: wx(0.52), y: wy(0.74), rx: 110, ry: 20 }],
  lamps: [{ x: wx(0.4), y: wy(0.3), r: 34 }],
  motes: 30,
  portrait: { steam: [
    { ...pAt(f, 0.30, 0.62), w: 180, rate: 10, a: 0.28 },
    { ...pAt(f, 0.52, 0.43), w: 120, rate: 6, a: 0.18 },
  ], fire: [{ ...pAt(f, 0.28, 0.63), rx: 80, ry: 16 }], lamps: [{ ...pAt(f, 0.45, 0.19), r: 30 }] },
  light: { x: wx(0.62), y: 420, color: "rgba(255,170,90,0.28)" },
}); };

const naanBakery = (): SceneDef => { const f = "naan_bakery"; return paintedScene({
  id: "naan_bakery", folder: f, title: "The nan bakery", zh: "Nan", caption: "Rounds stamped in the centre and slapped onto the wall of the tonur; a minute later they come out crisp on the paddle.",
  painting: true,
  ambience: XINJIANG_AMBIENCE.naan_bakery,
  steam: [{ x: wx(0.50), y: wy(0.62), w: 120, rate: 7, a: 0.24 }],
  motes: 40,
  portrait: { fire: [{ ...pAt(f, 0.14, 0.35), rx: 40, ry: 30 }], steam: [{ ...pAt(f, 0.14, 0.35), w: 110, rate: 6, a: 0.24 }] },
  light: { x: wx(0.6), y: 300, color: "rgba(255,200,130,0.26)" },
}); };

const poloKitchen = (): SceneDef => { const f = "polo_kitchen"; return paintedScene({
  id: "polo_kitchen", folder: f, title: "The polo kitchen", zh: "Polo", caption: "One kazan for the whole street: lamb, onion and a great deal of carrot under the rice, the fire kept low until the rice has taken the fat.",
  painting: true,
  steam: [
    { x: wx(0.40), y: wy(0.60), w: 500, rate: 14, a: 0.28 },
    { x: wx(0.59), y: wy(0.49), w: 40, rate: 4, a: 0.22 },
    { x: wx(0.70), y: wy(0.59), w: 40, rate: 4, a: 0.22 },
    { x: wx(0.87), y: wy(0.59), w: 40, rate: 4, a: 0.22 },
  ],
  fire: [{ x: wx(0.39), y: wy(0.85), rx: 80, ry: 22 }],
  motes: 40,
  portrait: { steam: [
    { ...pAt(f, 0.35, 0.53), w: 440, rate: 14, a: 0.28 },
    { ...pAt(f, 0.53, 0.405), w: 36, rate: 4, a: 0.22 },
    { ...pAt(f, 0.65, 0.435), w: 36, rate: 4, a: 0.22 },
    { ...pAt(f, 0.86, 0.444), w: 36, rate: 4, a: 0.22 },
  ], fire: [{ ...pAt(f, 0.34, 0.66), rx: 70, ry: 20 }] },
  light: { x: wx(0.3), y: 380, color: "rgba(255,190,110,0.26)" },
}); };

const laghmanShop = (): SceneDef => { const f = "laghman_shop"; return paintedScene({
  id: "laghman_shop", folder: f, title: "The laghman shop", zh: "Leghmen", caption: "One rope of dough swung into one long noodle, boiled, and buried under lamb, tomato, pepper and onion from the wok.",
  painting: true,
  steam: [{ x: wx(0.08), y: wy(0.46), w: 150, rate: 12, a: 0.3 }, { x: wx(0.82), y: wy(0.55), w: 150, rate: 12, a: 0.3 }],
  motes: 40,
  portrait: { fire: [], steam: [{ ...pAt(f, 0.13, 0.61), w: 160, rate: 14, a: 0.34 }, { ...pAt(f, 0.82, 0.55), w: 110, rate: 8, a: 0.28 }] },
  fire: [{ x: wx(0.05), y: wy(0.54), rx: 40, ry: 25 }],   // the pictured stove flame (wide only)
  ambience: [{ kind: 'leaves', leaf: 'olive', color: '#6f8f4e', wide: [.60,0,.98,.14], phone: [.55,0,.95,.10] }],
  light: { x: wx(0.5), y: 300, color: "rgba(255,225,180,0.22)" },
}); };

const oasisBazaar = (): SceneDef => { const f = "oasis_bazaar"; return paintedScene({
  id: "oasis_bazaar", folder: f, title: "The oasis bazaar", zh: "Bazar", caption: "Melons in pyramids, grapes in a dozen colours, sacks of raisins and apricots, nan by the stack, and a whole lamb hanging in the shade.",
  painting: true,
  walkers: [{ name: "swallow", w: 40, y: wy(0.12), from: wx(0.45), to: wx(0.78), dur: 9, every: 26, fly: true }],
  motes: 50,
  portrait: { steam: [], walkers: [{ name: "swallow", w: 34, y: pAt(f, 0, 0.1).y, from: pAt(f, 0.5, 0).x, to: pAt(f, 0.95, 0).x, dur: 8, every: 26, fly: true }] },
  steam: [{ x: wx(0.08), y: wy(0.52), w: 50, rate: 4, a: .22 }],   // the tea glasses by the samovar (wide only)
  ambience: [{ kind: 'leaves', leaf: 'olive', color: '#6f8f4e', wide: [.45,0,.65,.18], phone: [.60,0,.90,.10], count: 8, size: 1.6 }],
  light: { x: wx(0.55), y: 240, color: "rgba(255,235,200,0.2)" },
}); };

const grapeCourtyard = (): SceneDef => { const f = "grape_courtyard"; return paintedScene({
  id: "grape_courtyard", folder: f, title: "The grape courtyard", zh: "Üzüm", caption: "A yard roofed with vines, tea and nan on the low table, grapes within reach of the children, and the afternoon going nowhere.",
  painting: true,
  ambience: XINJIANG_AMBIENCE.grape_courtyard,
  steam: [{ x: wx(0.367), y: wy(0.588), w: 30, rate: 4, a: 0.22 }],
  petals: { color: "rgba(176,205,110,0.9)", rate: 0.6, size: 6 },
  motes: 40,
  portrait: { steam: [{ ...pAt(f, 0.285, 0.512), w: 46, rate: 7, a: 0.28 }] },
  light: { x: wx(0.5), y: 260, color: "rgba(255,240,200,0.2)" },
}); };

const oasisField = (): SceneDef => { const f = "oasis_field"; return paintedScene({
  id: "oasis_field", folder: f, title: "The melon oasis", zh: "Bostan", caption: "Hami melons and grapes picked by the channel, poplars along the water, and the mountains that sent it.",
  painting: true,
  ambience: [...XINJIANG_AMBIENCE.oasis_field, { kind: 'leaves', leaf: 'olive', color: '#7f9a4a', wide: [.0,.0,.22,.30], phone: [.0,.0,.30,.22], count: 7, size: 1.3 }],   // the poplar and vine at the top left
  light: { x: wx(0.5), y: 200, color: "rgba(255,245,215,0.18)" },
}); };

const chaikhanaScene = (): SceneDef => { const f = "chaikhana"; return paintedScene({
  id: "chaikhana", folder: f, title: "The chaikhana", zh: "Chayxana", caption: "Black tea from a copper pot into bowls, nan and dried fruit on the cloth, and the old men settling in for the afternoon.",
  painting: true,
  ambience: XINJIANG_AMBIENCE.chaikhana,
  steam: [
    { x: wx(0.212), y: wy(0.568), w: 38, rate: 4, a: 0.22 },
    { x: wx(0.244), y: wy(0.654), w: 38, rate: 4, a: 0.22 },
    { x: wx(0.518), y: wy(0.589), w: 36, rate: 4, a: 0.22 },
    { x: wx(0.595), y: wy(0.586), w: 40, rate: 4, a: 0.22 },
    { x: wx(0.706), y: wy(0.600), w: 38, rate: 4, a: 0.22 },
  ],
  motes: 40,
  portrait: { steam: [
    { ...pAt(f, 0.188, 0.49), w: 34, rate: 4, a: 0.22 },
    { ...pAt(f, 0.352, 0.537), w: 34, rate: 4, a: 0.22 },
    { ...pAt(f, 0.432, 0.626), w: 34, rate: 4, a: 0.22 },
    { ...pAt(f, 0.704, 0.532), w: 34, rate: 4, a: 0.22 },
    { ...pAt(f, 0.794, 0.555), w: 34, rate: 4, a: 0.22 },
  ] },
  light: { x: wx(0.5), y: 280, color: "rgba(255,230,190,0.22)" },
}); };

const xjHome = (): SceneDef => { const f = "xj_home"; return paintedScene({
  id: "xj_home", folder: f, title: "The oasis home kitchen", zh: "Ashxana", caption: "Dough rolled on the board, the kazan going on the hearth, onions and tomatoes waiting, and the tonur lit by the door.",
  painting: true,
  ambience: XINJIANG_AMBIENCE.xj_home,
  steam: [
    { x: wx(0.70), y: wy(0.54), w: 180, rate: 10, a: 0.28 },
    { x: wx(0.82), y: wy(0.81), w: 38, rate: 5, a: 0.23 },
    { x: wx(0.89), y: wy(0.82), w: 38, rate: 5, a: 0.23 },
  ],
  fire: [{ x: wx(0.70), y: wy(0.63), rx: 34, ry: 26 }],
  motes: 40,
  portrait: { steam: [
    { ...pAt(f, 0.84, 0.50), w: 150, rate: 10, a: 0.28 },
    { ...pAt(f, 0.70, 0.79), w: 34, rate: 5, a: 0.23 },
    { ...pAt(f, 0.79, 0.81), w: 34, rate: 5, a: 0.23 },
  ], fire: [{ ...pAt(f, 0.84, 0.67), rx: 30, ry: 24 }] },
  light: { x: wx(0.6), y: 300, color: "rgba(255,215,160,0.24)" },
}); };

const caravanStopScene = (): SceneDef => { const f = "caravan_stop"; return paintedScene({
  id: "caravan_stop", folder: f, title: "The caravan stop", zh: "Karwan", caption: "Travellers at a low table below the mountains at sunset, tea poured, the camels unloaded: where food changed hands for two thousand years.",
  painting: true,
  steam: [
    { x: wx(0.65), y: wy(0.63), w: 64, rate: 6, a: 0.24 },
    { x: wx(0.20), y: wy(0.61), w: 36, rate: 6, a: 0.24 },
  ],
  motes: 30,
  portrait: { fire: [{ ...pAt(f, .87, .42), rx: 26, ry: 18 }], steam: [
    { ...pAt(f, 0.83, 0.39), w: 58, rate: 6, a: 0.24 },
    { ...pAt(f, 0.738, 0.525), w: 34, rate: 6, a: 0.24 },
  ] },
  fire: [{ x: wx(0.63), y: wy(0.68), rx: 40, ry: 25 }],   // the campfire under the kettle
  light: { x: wx(0.75), y: 200, color: "rgba(255,190,120,0.24)" },
}); };

const tianshan = (): SceneDef => { const f = "tianshan"; return paintedScene({
  id: "tianshan", folder: f, title: "Mountains and snowmelt", zh: "Tengritagh", caption: "Snow on the Tianshan all summer, and the cold channel it becomes running past the wheat and the melon patch.",
  painting: true,
  mist: { x: wx(0.7), y: wy(0.8), w: 420, h: 90 },
  walkers: [{ name: "swallow", w: 44, y: wy(0.2), from: wx(0.3), to: wx(0.92), dur: 11, every: 22, fly: true }],
  motes: 20,
  portrait: { walkers: [{ name: "swallow", w: 34, y: pAt(f, 0, 0.14).y, from: pAt(f, 0.35, 0).x, to: pAt(f, 0.98, 0).x, dur: 9, every: 22, fly: true }] },
  ambience: [{ kind: 'birds', wide: [.30,.02,.92,.16], phone: [.35,.03,.98,.14], period: 8, scale: 1.5 }, { kind: 'leaves', leaf: 'olive', color: '#6f8f4e', wide: [0,0,.30,.20], phone: [0,0,.25,.15], count: 7, size: 1.3 }],   // birds over the range and the vine over the stall
  light: { x: wx(0.5), y: 180, color: "rgba(255,250,235,0.16)" },
}); };

const eveningFeast = (): SceneDef => { const f = "evening_feast"; return paintedScene({
  id: "evening_feast", folder: f, title: "The evening feast", zh: "Dastixan", caption: "The cloth laid under the vines at sunset: nan first, then polo, skewers, melon and tea, and nobody eats until everyone sits.",
  painting: true,
  ambience: XINJIANG_AMBIENCE.evening_feast,
  lamps: [{ x: wx(0.06), y: wy(0.14), r: 46 }, { x: wx(0.87), y: wy(0.13), r: 40 }],
  steam: [{ x: wx(0.45), y: wy(0.57), w: 160, rate: 8, a: 0.24 }],
  motes: 40,
  portrait: { lamps: [{ ...pAt(f, 0.07, 0.2), r: 40 }], steam: [{ ...pAt(f, 0.41, 0.57), w: 120, rate: 6, a: 0.24 }] },
  light: { x: wx(0.5), y: 300, color: "rgba(255,190,120,0.26)" },
}); };

// ---------- Northern China (paintings 1672×941 wide, 941×1672 portrait) ----------
const skewerCourtyard = (): SceneDef => { const f = "skewer_courtyard"; return paintedScene({
  id: "skewer_courtyard", folder: f, title: "The skewer courtyard", zh: "烤串", caption: "A trough of charcoal wheeled out at dusk, lamb turning over it with cumin and chilli, flatbread and beer on the table.",
  painting: true,
  steam: [{ x: wx(0.25), y: wy(0.5), w: 220, rate: 20, a: 0.32 }],
  fire: [{ x: wx(0.27), y: wy(0.62), rx: 90, ry: 16 }],
  ambience: [{ kind: 'light', wide: [.58,.10,.95,.38], phone: [.53,.20,.88,.40], color: '#f2a34b' }],
  lamps: [{ x: wx(0.34), y: wy(0.2), r: 22 }, { x: wx(0.7), y: wy(0.22), r: 22 }],
  motes: 30,
  portrait: { steam: [{ ...pAt(f, 0.3, 0.5), w: 170, rate: 16, a: 0.32 }], fire: [{ ...pAt(f, 0.3, 0.58), rx: 70, ry: 14 }], lamps: [] },
  light: { x: wx(0.3), y: 380, color: "rgba(255,170,90,0.26)" },
}); };

const mantouKitchen = (): SceneDef => { const f = "mantou_kitchen"; return paintedScene({
  id: "mantou_kitchen", folder: f, title: "The steamed-bread workshop", zh: "馒头坊", caption: "Dough kneaded until it squeaks, shaped into mantou and huajuan, and the stacked steamers breathing all morning.",
  painting: true,
  steam: [{ x: wx(.55), y: wy(.34), w: 240, rate: 10, a: .32 }, { x: wx(.78), y: wy(.51), w: 160, rate: 8, a: .28 }, { x: wx(.91), y: wy(.69), w: 120, rate: 6, a: .24 }],
  motes: 40,
  portrait: { steam: [{ ...pAt(f,.36,.22), w: 180, rate: 10, a: .32 }, { ...pAt(f,.43,.34), w: 140, rate: 8, a: .28 }, { ...pAt(f,.25,.60), w: 160, rate: 8, a: .26 }] },
  ambience: [{ kind: 'leaves', leaf: 'yellow', color: '#cc7f2f', wide: [.60,.02,.86,.20], phone: [.60,.02,.96,.16] }],   // ginkgo past the doorway
  light: { x: wx(0.55), y: 260, color: "rgba(255,240,215,0.24)" },
}); };

const dumplingHouse = (): SceneDef => { const f = "dumpling_house"; return paintedScene({
  id: "dumpling_house", folder: f, title: "The dumpling house", zh: "饺子馆", caption: "Wrappers rolled with a short pin, pleats pinched by the whole family, and the big pot rolling for the next batch.",
  painting: true,
  steam: [{ x: wx(0.55), y: wy(0.4), w: 220, rate: 20, a: 0.36 }, { x: wx(0.85), y: wy(0.46), w: 140, rate: 10, a: 0.28 }, { x: wx(0.3), y: wy(0.62), w: 70, rate: 4, a: 0.2 }],
  motes: 40,
  portrait: { fire: [], steam: [{ ...pAt(f, 0.35, 0.3), w: 180, rate: 16, a: 0.36 }, { ...pAt(f, 0.7, 0.35), w: 120, rate: 9, a: 0.28 }] },
  fire: [{ x: wx(0.60), y: wy(0.70), rx: 34, ry: 20 }],   // the pictured stove flame (wide only)
  ambience: [{ kind: 'snow', wide: [.40,0,.78,.15], phone: [.62,.05,.98,.28] }],   // snow in the window
  light: { x: wx(0.5), y: 280, color: "rgba(255,235,205,0.24)" },
}); };

const winterTable = (): SceneDef => { const f = "winter_table"; return paintedScene({
  id: "winter_table", folder: f, title: "The winter table", zh: "冬日家宴", caption: "Snow in the courtyard, the steamers on, cabbage, pork and dumplings on the table and three generations around it.",
  painting: true,
  steam: [{ x: wx(0.2), y: wy(0.36), w: 200, rate: 16, a: 0.36 }, { x: wx(0.65), y: wy(0.5), w: 120, rate: 8, a: 0.26 }, { x: wx(0.42), y: wy(0.56), w: 70, rate: 4, a: 0.2 }],
  motes: 40,
  portrait: { fire: [{ ...pAt(f, .05, .30), rx: 28, ry: 22 }], steam: [{ ...pAt(f, 0.25, 0.45), w: 160, rate: 14, a: 0.36 }, { ...pAt(f, 0.5, 0.5), w: 100, rate: 6, a: 0.24 }] },
  fire: [{ x: wx(0.03), y: wy(0.33), rx: 40, ry: 30 }],   // the hearth at the left edge
  light: { x: wx(0.5), y: 280, color: "rgba(255,235,205,0.26)" },
}); };

const courtyardKitchen = (): SceneDef => { const f = "courtyard_kitchen"; return paintedScene({
  id: "courtyard_kitchen", folder: f, title: "The courtyard kitchen", zh: "院子里的厨房", caption: "A wok on the brick stove, the steamer beside it, noodles pulled on the board, cabbage and garlic in from the yard.",
  painting: true,
  steam: [{ x: wx(.10), y: wy(.48), w: 150, rate: 12, a: .34 }, { x: wx(.24), y: wy(.34), w: 120, rate: 10, a: .30 }],
  motes: 40,
  portrait: { fire: [{ ...pAt(f, .08, .48), rx: 30, ry: 22 }], steam: [{ ...pAt(f,.19,.37), w: 120, rate: 12, a: .34 }, { ...pAt(f,.12,.55), w: 100, rate: 10, a: .30 }] },
  fire: [{ x: wx(0.13), y: wy(0.80), rx: 50, ry: 35 }],   // the brick stove's open fire
  light: { x: wx(0.3), y: 300, color: "rgba(255,225,190,0.24)" },
}); };

const hutongLaneScene = (): SceneDef => { const f = "hutong"; return paintedScene({
  id: "hutong", folder: f, title: "The hutong", zh: "胡同", caption: "Grey walls, a red door, laundry across the lane, a bao stall steaming on the corner and the ginkgo leaves coming down.",
  painting: true,
  steam: [{ x: wx(0.15), y: wy(0.45), w: 90, rate: 6, a: 0.26 }],
  // Wide only since 2026-09-17: the wide crop is one string on flat vertical planks and reads. The portrait box
  // takes the corn cobs with the chillies and its repair chops the door frame and speckles the cook's hair, so the
  // portrait strings hang still and the backlit lane carries that orientation instead.
  ambience: [
    { kind: 'breeze', wide: [.065,0,.12,.31], source: 'chilli', period: 7.6, sway: [.040,.045] },
    { kind: 'sunray', phone: [.38,.12,.98,.60], angles: [-.45,-.45], sway: [.10,.10] },   // the sun down the lane, the direction the portrait already paints
  ],
  petals: { color: "rgba(232,184,72,0.95)", rate: 1.6, size: 6 },
  motes: 30,
  portrait: { steam: [{ ...pAt(f, 0.2, 0.42), w: 70, rate: 5, a: 0.24 }] },
  light: { x: wx(0.55), y: 240, color: "rgba(255,235,200,0.2)" },
}); };

const bingStall = (): SceneDef => { const f = "bing_stall"; return paintedScene({
  id: "bing_stall", folder: f, title: "The bing stall", zh: "饼摊", caption: "Scallion pancakes and shaobing on the iron griddle by the city gate, turned with a spatula, stacked in the basket.",
  painting: true,
  steam: [{ x: wx(.55), y: wy(.43), w: 150, rate: 14, a: .32 }],
  ambience: [
    // The chilli crop came out on 2026-09-17: it hangs against a shop front of shelves, baskets and a window, and
    // the repair left a pale block there. The strings hang still; the fire under the griddle takes the slot.
    { kind: 'light', wide: [.405,.495,.495,.595], phone: [.555,.462,.675,.552], color: '#f3a34b' },   // the flames under the iron griddle
    { kind: 'leaves', wide: [.55,0,.98,.25], phone: [.45,0,.98,.23], leaf: 'yellow', color: '#d7a632', count: 8, size: 1.5 },   // fuller since 2026-09-17, to carry the room after its chilli crop came out
  ],
  motes: 40,
  portrait: { steam: [{ ...pAt(f,.57,.38), w: 140, rate: 12, a: .32 }] },
  light: { x: wx(0.4), y: 300, color: "rgba(255,225,185,0.24)" },
}); };

const northMarket = (): SceneDef => { const f = "north_market"; return paintedScene({
  id: "north_market", folder: f, title: "The northern market", zh: "北方集市", caption: "Winter cabbages and radishes by the cartload, flour and grain in sacks, pork on the block, pickles from the crock.",
  painting: true,
  steam: [{ x: wx(.07), y: wy(.30), w: 100, rate: 9, a: .30 }],
  walkers: [{ name: "swallow", w: 40, y: wy(0.12), from: wx(0.4), to: wx(0.72), dur: 9, every: 28, fly: true }],
  motes: 50,
  portrait: {
    steam: [{ ...pAt(f,.34,.23), w: 95, rate: 9, a: .32 }],
    walkers: [{ name: "swallow", w: 34, y: pAt(f, 0, 0.1).y, from: pAt(f, 0.45, 0).x, to: pAt(f, 0.9, 0).x, dur: 8, every: 28, fly: true }],
  },
  ambience: [{ kind: 'snow', wide: [.35,0,.85,.25], phone: [.30,0,.90,.22] }],   // snow over the gate and roofs
  light: { x: wx(0.5), y: 240, color: "rgba(255,240,215,0.2)" },
}); };

const noodleWorkshop = (): SceneDef => { const f = "noodle_workshop"; return paintedScene({
  id: "noodle_workshop", folder: f, title: "The noodle workshop", zh: "面坊", caption: "Dough stretched into ropes, shaved off the block into the pot, rolled and cut wide: the north's wheat in every shape.",
  painting: true,
  steam: [{ x: wx(.36), y: wy(.43), w: 280, rate: 14, a: .28 }],
  // The garlic crop came out on 2026-09-17. Its key took the noodle maker's dark hair as well as the braid, and the
  // repair carved a grey patch out of her head. The braids hang still; the floured work board takes the slot.
  ambience: [{ kind: 'dust', wide: [.16,.585,.42,.675], phone: [.44,.455,.76,.545] }],   // flour on the board the dough is worked on
  motes: 40,
  portrait: { steam: [{ ...pAt(f,.18,.55), w: 250, rate: 14, a: .28 }] },
  light: { x: wx(0.4), y: 280, color: "rgba(255,240,215,0.22)" },
}); };

const roastDuck = (): SceneDef => { const f = "roast_duck"; return paintedScene({
  id: "roast_duck", folder: f, title: "The roast duck shop", zh: "烤鸭店", caption: "Ducks hanging lacquered over the fruit-wood fire, carved at the table into a hundred slices with pancakes, scallion and sauce.",
  painting: true,
  steam: [
    { x: wx(.12), y: wy(.68), w: 100, rate: 8, a: .26 },
    { x: wx(.31), y: wy(.79), w: 120, rate: 8, a: .28 },
    { x: wx(.65), y: wy(.69), w: 100, rate: 8, a: .26 },
  ],
  motes: 40,
  portrait: { steam: [
    { ...pAt(f,.10,.56), w: 80, rate: 8, a: .26 },
    { ...pAt(f,.15,.66), w: 100, rate: 8, a: .28 },
    { ...pAt(f,.12,.84), w: 110, rate: 8, a: .26 },
  ] },
  ambience: [{ kind: 'leaves', leaf: 'yellow', color: '#cc7f2f', wide: [.52,.02,.94,.22], phone: [.05,0,.45,.12] }],   // ginkgo outside
  light: { x: wx(0.4), y: 300, color: "rgba(255,190,120,0.28)" },
}); };

const vinegarWorkshop = (): SceneDef => { const f = "vinegar_workshop"; return paintedScene({
  id: "vinegar_workshop", folder: f, title: "The vinegar workshop", zh: "醋坊", caption: "Sorghum mash in open vats, turned by hand and left to sour, then aged in jars in the sun until it turns black and thick.",
  painting: true,
  steam: [{ x: wx(0.55), y: wy(0.5), w: 160, rate: 10, a: 0.26 }, { x: wx(0.25), y: wy(0.56), w: 100, rate: 6, a: 0.22 }],
  motes: 40,
  portrait: { steam: [{ ...pAt(f, 0.4, 0.45), w: 120, rate: 8, a: 0.26 }, { ...pAt(f, 0.7, 0.5), w: 80, rate: 5, a: 0.22 }] },
  ambience: [{ kind: 'leaves', leaf: 'yellow', color: '#cc7f2f', wide: [.72,0,.98,.18], phone: [.55,0,.90,.12] }],
  light: { x: wx(0.5), y: 280, color: "rgba(255,230,195,0.22)" },
}); };

const wheatHarvest = (): SceneDef => { const f = "wheat_harvest"; return paintedScene({
  id: "wheat_harvest", folder: f, title: "The wheat harvest", zh: "麦收", caption: "Sheaves bound in the field, grain winnowed on the threshing floor, the year's flour for noodles, dumplings and bread.",
  painting: true,
  petals: { color: "rgba(232,204,124,0.9)", rate: 1.2, size: 4 },
  walkers: [{ name: "swallow", w: 42, y: wy(0.16), from: wx(0.4), to: wx(0.92), dur: 10, every: 24, fly: true }],
  motes: 30,
  portrait: { steam: [{ ...pAt(f, .70, .72), w: 95, rate: 9, a: .30 }], walkers: [{ name: "swallow", w: 34, y: pAt(f, 0, 0.12).y, from: pAt(f, 0.4, 0).x, to: pAt(f, 0.98, 0).x, dur: 9, every: 24, fly: true }] },
  steam: [{ x: wx(0.50), y: wy(0.60), w: 110, rate: 9, a: .30 }],   // the steamer on the table
  ambience: [{ kind: 'dust', wide: [.12,.55,.30,.65], phone: [.40,.60,.70,.72] }],   // flour at the kneading board
  light: { x: wx(0.5), y: 220, color: "rgba(255,240,200,0.2)" },
}); };

/** scene id (WorldObject.scene) → builder */
export const SCENES: Record<string, () => SceneDef> = {
  hotpot,
  noodle_shop: noodleShop,
  teahouse,
  market,
  home_kitchen: homeKitchen,
  tower,
  bao_shop: baoShop, stone_bridge: stoneBridge, crab_pond: crabPond, jiangnan_home: jiangnanHome, lotus_garden: lotusGarden, rice_wine: riceWine, river_market: riverMarket, riverside_restaurant: riversideRestaurant, tea_hill: teaHill,
  skewer_courtyard: skewerCourtyard, mantou_kitchen: mantouKitchen, dumpling_house: dumplingHouse, winter_table: winterTable, courtyard_kitchen: courtyardKitchen, hutong: hutongLaneScene, bing_stall: bingStall, north_market: northMarket, noodle_workshop: noodleWorkshop, roast_duck: roastDuck, vinegar_workshop: vinegarWorkshop, wheat_harvest: wheatHarvest,
  kebab_grill: kebabGrill, naan_bakery: naanBakery, polo_kitchen: poloKitchen, laghman_shop: laghmanShop, oasis_bazaar: oasisBazaar, grape_courtyard: grapeCourtyard, oasis_field: oasisField, chaikhana: chaikhanaScene, xj_home: xjHome, caravan_stop: caravanStopScene, tianshan, evening_feast: eveningFeast,
};
