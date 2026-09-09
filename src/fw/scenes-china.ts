// The Living Scenes of the China world: which object opens which room, and how each painted room is laid out.
// Coordinates are stage units (1600×900); `at(folder, fx, fy)` is a point inside the centred cover painting.

import { type SceneDef } from "./scene";
import { paintedScene, at, pAt } from "./scene-painted";

// Painting coordinates → stage: the wide painting (1672×941) is stretched to 1616×910 at (−8,−5).
const hotpot = (): SceneDef => {
  const f = "hotpot";
  return paintedScene({
    id: "hotpot", folder: f, title: "Hotpot house", zh: "火锅", caption: "A divided pot rolling on the burner, thin beef in and out in seconds, and a table that never empties.",
    painting: true, night: true,
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
    fire: [{ x: 287, y: 655, rx: 110, ry: 70 }],
    lamps: [{ x: 450, y: 40, r: 90 }],
    motes: 50,
    portrait: {
      steam: [{ ...pAt(f, 0.27, 0.48), w: 80, rate: 16, a: 0.4 }],
      fire: [{ ...pAt(f, 0.3, 0.58), rx: 70, ry: 50 }],
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
    portrait: {
      lamps: [{ ...pAt(f, 0.07, 0.2), r: 70 }, { ...pAt(f, 0.22, 0.25), r: 50 }, { ...pAt(f, 0.35, 0.4), r: 22 }],
    },
    light: { x: 800, y: 300, color: "rgba(255,190,120,0.24)" },
  });
};

/** scene id (WorldObject.scene) → builder */
export const SCENES: Record<string, () => SceneDef> = {
  hotpot,
  noodle_shop: noodleShop,
  teahouse,
  market,
  home_kitchen: homeKitchen,
  tower,
};
