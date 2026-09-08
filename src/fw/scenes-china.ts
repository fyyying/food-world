// The Living Scenes of the China world: which object opens which room, and how each painted room is laid out.
// Coordinates are stage units (1600×900); `at(folder, fx, fy)` is a point inside the centred cover painting.

import { type SceneDef } from "./scene";
import { hotpotPaintedScene } from "./scene-hotpot-painted";
import { paintedScene, at } from "./scene-painted";

const noodleShop = (): SceneDef => {
  const f = "noodle_shop";
  const pots = [at(f, 0.36, 0.7), at(f, 0.58, 0.64), at(f, 0.47, 0.5)];
  return paintedScene({
    id: "noodle_shop", folder: f, title: "Noodle shop", zh: "面馆", caption: "Hand-pulled noodles slapped on the board, broth that has been going since dawn, and a bowl in under a minute.",
    hang: [
      { name: "front-1", x: 110, y: -10, w: 112, sway: 4.5, halo: 1.4 },
      { name: "front-2", x: 300, y: -6, w: 62, sway: 3.5, halo: 1.6 },
      { name: "front-4", x: 1400, y: -8, w: 230, sway: 3.5, halo: 0.9 },
    ],
    front: [
      { name: "front-0", x: -40, w: 560 },
      { name: "prop-2", x: 1300, w: 320 },
    ],
    steam: [{ x: pots[0].x, y: pots[0].y, w: 70, rate: 12 }, { x: pots[1].x, y: pots[1].y, w: 60, rate: 10 }, { x: pots[2].x, y: pots[2].y, w: 40, rate: 5, a: 0.22 }, { x: 1460, y: 760, w: 70, rate: 8 }],
    lamps: [{ ...at(f, 0.1, 0.12), r: 70 }, { ...at(f, 0.45, 0.06), r: 70 }, { ...at(f, 0.88, 0.2), r: 60 }],
    motes: 50,
    light: { x: 800, y: 260, color: "rgba(255,190,110,0.34)" },
  });
};

const teahouse = (): SceneDef => {
  const f = "teahouse";
  const pot = at(f, 0.47, 0.6);
  return paintedScene({
    id: "teahouse", folder: f, title: "Tea house", zh: "茶馆", caption: "Bamboo chairs, lid-cups of jasmine refilled all afternoon, and the kettle on the brazier never quite off the boil.",
    front: [
      { name: "front-0", x: -50, w: 640 },
    ],
    steam: [{ x: pot.x, y: pot.y, w: 34, rate: 5, a: 0.22 }],
    lamps: [{ ...at(f, 0.86, 0.3), r: 60 }],
    mist: { x: 600, y: 470, w: 440, h: 26 },
    leaves: 2.4, motes: 60,
    light: { x: 800, y: 300, color: "rgba(255,220,160,0.26)" },
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
    walkers: [{ name: "market-woman-with-basket", w: 190, y: 884, from: 1760, to: -360, dur: 40, every: 28 }],
    steam: [{ x: 1550, y: 450, w: 60, rate: 6, a: 0.3 }],
    lamps: [{ x: 1359, y: 67, r: 80 }, { x: 1273, y: 143, r: 60 }, { x: 713, y: 206, r: 45 }, { x: 1411, y: 230, r: 60 }],
    leaves: 3.5, motes: 40,
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
    light: { x: 800, y: 300, color: "rgba(255,190,120,0.24)" },
  });
};

/** scene id (WorldObject.scene) → builder */
export const SCENES: Record<string, () => SceneDef> = {
  hotpot: hotpotPaintedScene,
  noodle_shop: noodleShop,
  teahouse,
  market,
  home_kitchen: homeKitchen,
  tower,
};
