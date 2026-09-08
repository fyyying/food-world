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
      { name: "front-3", x: 1230, y: -8, w: 210, sway: 2 },
      { name: "front-4", x: 1400, y: -8, w: 230, sway: 3.5, halo: 0.9 },
    ],
    front: [
      { name: "front-0", x: -40, w: 560 },
      { name: "prop-1", x: 1120, w: 96 },
      { name: "prop-0", x: 1180, w: 190 },
      { name: "prop-2", x: 1330, w: 300 },
    ],
    steam: [{ x: pots[0].x, y: pots[0].y, w: 70, rate: 12 }, { x: pots[1].x, y: pots[1].y, w: 60, rate: 10 }, { x: pots[2].x, y: pots[2].y, w: 40, rate: 5, a: 0.22 }, { x: 1480, y: 760, w: 70, rate: 8 }],
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
      { name: "prop-0", x: 1120, w: 500 },
    ],
    steam: [{ x: pot.x, y: pot.y, w: 34, rate: 5, a: 0.22 }, { x: 1300, y: 780, w: 50, rate: 5, a: 0.22 }],
    lamps: [{ ...at(f, 0.86, 0.3), r: 60 }],
    mist: { x: 300, y: 430, w: 1000, h: 40 },
    leaves: 2.4, motes: 60,
    light: { x: 800, y: 300, color: "rgba(255,220,160,0.26)" },
  });
};

const market = (): SceneDef => {
  const f = "market";
  return paintedScene({
    id: "market", folder: f, title: "Village market", zh: "菜市场", caption: "Chillies by the sack, garlic in braids, greens still wet from the field, and everyone shouting prices.",
    front: [
      { name: "prop-0", x: -30, w: 660 },
      { name: "front-0", x: 960, w: 680 },
    ],
    lamps: [{ ...at(f, 0.12, 0.1), r: 60 }, { ...at(f, 0.5, 0.06), r: 50 }],
    leaves: 1.8, motes: 40,
    light: { x: 800, y: 200, color: "rgba(255,230,190,0.22)" },
  });
};

const homeKitchen = (): SceneDef => {
  const f = "home_kitchen";
  const wok = at(f, 0.47, 0.55), stove = at(f, 0.45, 0.68);
  return paintedScene({
    id: "home_kitchen", folder: f, title: "Home kitchen", zh: "家常厨房", caption: "A wok over a wood fire, chillies and garlic on the wall, and dinner for the family in twenty minutes.",
    hang: [
      { name: "front-4", x: 170, y: -6, w: 100, sway: 3 },
      { name: "front-3", x: 300, y: -6, w: 120, sway: 2.5 },
      { name: "front-1", x: 1250, y: -8, w: 80, sway: 4 },
      { name: "front-2", x: 1370, y: -6, w: 78, sway: 3.5 },
    ],
    front: [
      { name: "front-0", x: -40, w: 660 },
      { name: "prop-0", x: 1010, w: 640 },
    ],
    steam: [{ x: wok.x, y: wok.y, w: 90, rate: 16, a: 0.4 }],
    fire: [{ x: stove.x, y: stove.y, rx: 120, ry: 70 }],
    motes: 50,
    light: { x: wok.x, y: 420, color: "rgba(255,180,100,0.36)" },
  });
};

const tower = (): SceneDef => {
  const f = "historical_tower";
  return paintedScene({
    id: "tower", folder: f, title: "The old tower", zh: "锦官城楼", caption: "Chengdu at dusk from the tower: lanterns coming on street by street, sky lanterns drifting over the river.",
    night: true,
    hang: [
      { name: "front-1", x: 120, y: -8, w: 84, sway: 4, halo: 1.4 },
      { name: "front-2", x: 1330, y: -8, w: 160, sway: 3.5, halo: 1.1 },
      { name: "front-0", x: 1060, y: -12, w: 560 },
    ],
    front: [
      { name: "front-3", x: -40, w: 720 },
      { name: "front-3", x: 920, w: 720, mirror: true },
      { name: "prop-0", x: 1000, w: 600 },
    ],
    lamps: [{ ...at(f, 0.55, 0.28), r: 110 }, { ...at(f, 0.12, 0.1), r: 60 }],
    mist: { x: 250, y: 560, w: 1100, h: 50 },
    sky: true, motes: 20,
    light: { x: 800, y: 320, color: "rgba(255,190,120,0.26)" },
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
