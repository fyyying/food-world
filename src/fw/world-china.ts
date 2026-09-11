/** China: the layout of the first world. Terrain, villages, farms, life. Objects come from graph.ts. */
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { OBJECTS, type EnrichedRecipe } from "./graph";
import { PROPS, mat, mountain, house, tree, terrace, bridge, woodenBridge, boat, signpost, chicken, butterfly, temple, pagoda, gate, lanternString, dragon, person, fence, pond, cow, goat, path, add, birds, crane, coop, panda, fish, C, type P, foodDetail } from "./props";
import { buildWorld, addWater, type Diorama, type LayoutCtx } from "./worldkit";
import { CAMEL_SPEED, CAMEL_CYCLE } from "./camel-gait";
import { addRiverJunction } from "./river-junction";
import { JN_PROPS, jnDetail } from "./props-jiangnan";
import { NORTH_PROPS, northDetail } from "./props-north";
import { XJ_PROPS, poplar, xjDetail, camelWalker } from "./props-xinjiang";

void CSS2DObject; void signpost;

export function buildChina(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "china", W: 112, cx: -6, D: 84, ground: "#8cb86b", plinth: "#6e4a2c", recipes, objects: OBJECTS, props: { ...PROPS, ...JN_PROPS, ...NORTH_PROPS, ...XJ_PROPS },
    small: /^(cow|pig|chicken|pepperTree|jars)$/, fallbackPlace: "wok",
    layout: layoutChina,
  });
}

function layoutChina({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(-18, 6, 18, 15, "#82b263", 0.2);
  tint(20, 8, 16, 12, "#9cc484", -0.3);
  tint(28, -31.5, 10, 7, "#c2bd7a");
  tint(-27, 16, 6, 5, "#7aab5c");
  // the wheat belt: dry gold along the north, in overlapping pools so it fades into the green
  for (const [x, z, rx, rz] of [[10, -30, 12, 13], [26, -30, 14, 13], [42, -28, 10, 12]] as [number, number, number, number][]) tint(x, z, rx, rz, "#d1bd74");
  // the oasis strip: sand beyond the western mountains, green only where the water reaches
  for (const [x, z, rx, rz] of [[-54, -30, 9, 9], [-54, -10, 9, 9], [-54, 4, 9, 9], [-55, 18, 7, 9], [-55, 35, 7, 7]] as [number, number, number, number][]) tint(x, z, rx, rz, "#dccb9a");
  tint(-54, -2, 7, 5, "#8fb86a");
  tint(24, -30, 24, 11, "#cbb578");
  tint(-54, -17, 8, 22, "#dac18e");
  tint(-57, -7, 3.4, 5.4, "#82a664");
  tint(27, 15, 20, 15, "#9ab995");

  // ---------- river & paths ----------
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-62, TOP + 0.03, 2.6), new THREE.Vector3(-58, TOP + 0.03, 2.6), new THREE.Vector3(-54, TOP + 0.03, 3), new THREE.Vector3(-38, TOP + 0.03, 4), new THREE.Vector3(-28, TOP + 0.03, 8), new THREE.Vector3(-14, TOP + 0.03, 9),
    new THREE.Vector3(-2, TOP + 0.03, 6), new THREE.Vector3(10, TOP + 0.03, 8), new THREE.Vector3(20, TOP + 0.03, 3), new THREE.Vector3(36, TOP + 0.03, 6), new THREE.Vector3(44, TOP + 0.03, 4.4), new THREE.Vector3(47, TOP + 0.03, 4.8), new THREE.Vector3(50, TOP + 0.03, 4.8),
  ]);
  // Canal branches organise the water town around its food gardens and quays.
  const canal = new THREE.CatmullRomCurve3([
    new THREE.Vector3(30, TOP + 0.035, 4.8), new THREE.Vector3(28, TOP + 0.035, 12),
    new THREE.Vector3(27, TOP + 0.035, 20), new THREE.Vector3(27.5, TOP + 0.035, 26),
    new THREE.Vector3(26, TOP + 0.035, 33), new THREE.Vector3(26, TOP + 0.035, 42),
  ]);
  addRiverJunction({ group, tickers, place, tint, TOP }, curve, canal);
  place(woodenBridge(3.8), 27.4, 16, -0.12);
  group.add(path([[19.5, 19], [21, 16], [23, 14.7], [25.8, 14.5], [25.8, 16], [25.4, 20], [25.5, 26], [24, 33], [24, 42]], 0.8, "#c9c2aa"));
  // Restaurant steps open onto the village lane and the canal towpath.
  group.add(path([[24, 14.1], [24, 14.7]], 1.0, "#c9c2aa"));
  // Irrigation runs beside the oasis road, with green planted banks.
  const irrigation = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-54.5, TOP + 0.035, -34), new THREE.Vector3(-54.7, TOP + 0.035, -19),
    new THREE.Vector3(-54.5, TOP + 0.035, -7), new THREE.Vector3(-54.5, TOP + 0.035, -4.1),
  ]);
  addWater({ group, tickers, place, tint, TOP }, irrigation, 0.65);
  for (const z of [-28, -14]) place(woodenBridge(2), -54.6, z, 0);
  // reeds and stones along the bank
  for (let i = 0; i < 40; i++) { const u = i / 40; const p = curve.getPointAt(u), tg = curve.getTangentAt(u); const side = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(2.3 * (i % 2 ? 1 : -1)); const x = p.x + side.x, z = p.z + side.z; if (x < -42 || x > 46) continue; if (i % 3 === 0) add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(0.25 + (i % 4) * 0.08, 0), mat(C.stone)), x, 0.1, z); else for (let k = 0; k < 3; k++) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.8, 4), mat("#6fae4f")), x + (k - 1) * 0.15, 0.4, z + (k % 2) * 0.15); }
  // village street + lanes
  group.add(path([[-22, -6], [-14, -6.5], [-6, -5.5], [2, -5], [10, -6], [16, -7.8], [19.3, -5.6], [20.1, -2.4]], 2.6));   // the street: one ribbon from the west end, behind the wine house, down onto the bridge ramp
  group.add(path([[10, -6], [14, -10], [20, -15], [26, -19.5], [28, -23]], 1.8));                    // the gate road up to the north town
  group.add(path([[4, -26.5], [14, -26], [24, -26.5], [32, -26.5], [41, -26.5], [47, -27]], 1.8, "#c9bfa0"));   // the north town street

  // ---------- mountains: a western wall and a northern backdrop ----------
  const peaks: [number, number, number, number, boolean][] = [
    [-35, -28, 5.5, 12, false], [-33, -9, 4.5, 9, true], [-37.5, 17, 3.6, 10, false], [-35, 32.5, 3.2, 6, true],
    [-27, -42.5, 4, 9, true], [-16, -42.5, 3.4, 7, false], [-6, -43.5, 4, 9, true], [4, -43.5, 3.2, 6, false], [14, -43.5, 3.8, 8, true], [24, -42.5, 3, 6, false],
    [32, -43.5, 3.4, 7, false], [40, -42.5, 3.6, 7, true], [49, -40.5, 3.2, 6, false], [48.5, -18, 2.8, 5, true],
  ];
  peaks.forEach(([x, z, r, h, dark], i) => { const m = place(mountain(r * (0.9 + (i % 3) * 0.1), h * (0.85 + ((i * 7) % 5) * 0.08), dark), x, z, i * 1.7); m.scale.x *= 1 + (i % 2) * 0.25; });
  // the Tianshan behind the oasis strip: higher, and white above the tree line
  for (const [x, z, r, h] of [[-58, -43.5, 5, 13], [-49, -44, 4.6, 12], [-42, -43.5, 4.2, 11], [-35, -41, 4, 10]] as [number, number, number, number][]) {
    place(mountain(r, h, false), x, z, x);
    add(group, new THREE.Mesh(new THREE.ConeGeometry(r * 0.34, h * 0.32, 10), mat("#f4f1ea")), x, h * 0.86, z);
  }
  // the oasis road south from the mountains, with a line of poplars at the western edge
  group.add(path([[-53, -36], [-53.5, -24], [-53, -4], [-53.2, 0.2]], 1.6, "#d3bd8a"));
  group.add(path([[-53.3, 6.8], [-53.5, 9], [-52, 14]], 1.6, "#d3bd8a"));   // starts on dry bank, clear of the river's edge
  for (let i = 0; i < 6; i++) place(poplar(0.9 + (i % 3) * 0.15), -59.6 + (i % 2) * 0.4, -25 + i * 4.4, i);
  for (let i = 0; i < 4; i++) place(poplar(0.8), -46.6, -26 + i * 6, i);
  // pagoda on a hill in the north-west, temple with plaza north-centre, gate at the head of the street
  const hill = add(group, new THREE.Mesh(new THREE.CylinderGeometry(4.5, 6, 2.2, 12), mat("#7aab5c")), -24, 1.1, -25);
  void hill;
  place(pagoda(5), -24, -25).position.y = 2.2;
  for (let i = 0; i < 6; i++) place(tree("pine", 1.0), -24 + Math.cos(i * 1.05) * 6.5, -25 + Math.sin(i * 1.05) * 5, i);
  add(group, new THREE.Mesh(new THREE.CircleGeometry(6, 20), mat("#c9c0a8")), 28, TOP + 0.02, -31.5).rotation.x = -Math.PI / 2;
  place(temple(), 28, -35);
  place(gate(), 28, -25.5);
  for (const x of [22.5, 33.5]) place(tree("blossom", 1.2), x, -33, x);
  for (const x of [23, 33]) place(tree("ginkgo", 1.1), x, -24.5, x);
  for (const [x, z] of [[-14, -34], [-8, -36.5], [-2, -33.5], [-19, -37]] as [number, number][]) place(tree("pine", 1.1 + (x % 2 ? 0.2 : 0)), x, z, x);   // Sichuan's wooded north
  // birds over the mountains, cranes in the paddies, and a dragon dance in the square
  place(birds(7, 14, 15), -22, -14);
  place(birds(5, 9, 11), 26, 6);
  place(crane(), 22, 17, 0.6); place(crane(), 27.5, 12.5, -1.2).scale.setScalar(0.9);
  place(dragon({ radius: 2.6, height: 2.3, speed: 0.4, segments: 14, poles: true }), 28, -19.5);

  // ---------- villages ----------
  const houses: [("sichuan" | "jiangnan" | "northern"), number, number, number, number, number, number, number][] = [
    // style, x, z, rot, w, d, h, storeys
    ["sichuan", -20, -18, 0.25, 3.2, 2.6, 1.9, 2], ["sichuan", -24, -11, -0.2, 2.8, 2.4, 1.7, 1], ["sichuan", -12, -10.5, 0.15, 3.6, 2.6, 1.9, 1],
    ["sichuan", -17, -14.5, 0.5, 2.4, 2.0, 1.6, 1], ["sichuan", -11, 3.8, -0.3, 2.6, 2.2, 1.6, 1],
    ["jiangnan", 15, 11, -0.4, 3.2, 2.6, 2.1, 2], ["jiangnan", 19.5, 12.5, 0.2, 2.8, 2.4, 1.9, 1],
    ["jiangnan", 30, -3.5, 0.5, 3.0, 2.4, 2.0, 1], ["jiangnan", 22.5, -8, -0.2, 3.2, 2.6, 2.0, 2], ["jiangnan", 33.5, 1.4, 0.9, 2.6, 2.2, 1.8, 1],
    ["northern", 38.5, -25, 0.05, 3.8, 2.8, 1.7, 1], ["northern", 43.5, -22, -0.1, 2.8, 2.4, 1.6, 1], ["northern", 34.5, -21, 0.2, 3.0, 2.4, 1.6, 1],
  ];
  for (const [style, x, z, rot, w, d, h, st] of houses) place(house(style, w, d, h, st), x, z, rot);
  // courtyard wall for the northern compound
  for (const [x, z, rot, len] of [[39, -18, 0, 12], [33, -22, Math.PI / 2, 8], [45, -22, Math.PI / 2, 8]] as [number, number, number, number][]) { add(group, new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 0.3), mat(C.brick)), x, 0.45, z).rotation.y = rot; }
  // Sichuan's quiet food details: nothing to click, everything tells the story
  for (const [kind, x, z, rot] of [["chilliFrame", -11.6, 1, 0.3], ["jars", -17.5, -19.6, 0.2], ["garlicBasket", -13.9, -8.4, 0], ["vegBasket", -10.2, -8.6, 0.4], ["sausageRack", -10, -19.2, 0.1], ["chilliMat", -22.8, 5.2, 0], ["pepperMat", -17.2, 3.6, 0], ["teaMat", -24, -7.4, 0], ["choppingTable", -10.6, -1.2, 0.2], ["marketBaskets", -6.5, 11.8, 0], ["jars", -26.8, -7.6, -0.3], ["cornStrings", -20.2, 13.2, 0.4], ["cabbageRack", -9.6, 18.4, 0.1], ["sausageRack", -18.6, -3.4, 0.5], ["garlicBasket", -21.6, -1.6, 0]] as [Parameters<typeof foodDetail>[0], number, number, number][]) place(foodDetail(kind), x, z, rot);
  // An open harvest lane connects the pepper tree to the kitchen and the main street.
  group.add(path([[-19, 2.8], [-16.8, 2.8], [-13.5, 1.3], [-12, -5.5]], 0.95, "#d8bf92"));
  place(foodDetail("jars"), -18.2, -8.3);
  tint(39, -16, 6, 2.6, "#d3bf89");
  place(northDetail("stoneMill"), 37.5, -16);
  place(northDetail("flourSacks"), 39, -16.3);
  place(northDetail("wheatSheaves"), 36.4, -16.2);
  place(northDetail("noodleRack"), 41.5, -16.5);
  // lantern strings across the street
  for (const x of [-18, -8, 4]) place(lanternString(6, 4), x, -6).position.y = 3.2;
  for (const x of [-18, -8, 4]) for (const s of [-1, 1]) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.3, 6), mat(C.woodRed)), x + s * 3, 1.65, -6);
  // water town: bridges, boats, willows, steps to the water
  // bridges sit on the river and span it perpendicular to the flow
  const bridgeAt = (b: THREE.Object3D, targetX: number) => {
    let best = 0, bestD = Infinity;
    for (let i = 0; i <= 200; i++) { const d = Math.abs(curve.getPointAt(i / 200).x - targetX); if (d < bestD) { bestD = d; best = i / 200; } }
    const p = curve.getPointAt(best), tg = curve.getTangentAt(best);
    place(b, p.x, p.z, -Math.atan2(tg.z, tg.x) + Math.PI / 2);
  };
  const stoneBridge = bridge(6.4);
  bridgeAt(stoneBridge, 20);
  bridgeAt(woodenBridge(5.6), -14);
  // Keep both road ribbons on dry land; only the bridge spans the water.
  const westBridge = woodenBridge(6.4);
  bridgeAt(westBridge, -30.5);
  const westAxis = new THREE.Vector3(Math.cos(westBridge.rotation.y), 0, -Math.sin(westBridge.rotation.y));
  const westNorth = westBridge.position.clone().addScaledVector(westAxis, 3.2);
  const westSouth = westBridge.position.clone().addScaledVector(westAxis, -3.2);
  group.add(path([[-22, -6], [-26, -1], [westNorth.x, westNorth.z]], 1.2));
  const westRoad = path([[westSouth.x, westSouth.z], [-35, 10], [-42, 8.5], [-49, 8.5], [-52.8, 8.2]], 1.6, "#d3bd8a");
  westRoad.position.y = 0.004;
  group.add(westRoad);
  const xjBridge = woodenBridge(5.6); bridgeAt(xjBridge, -53.2);   // the oasis road crosses here
  // the crossing: from bank to bank along the bridge's own axis
  const bx = stoneBridge.position.x, bz = stoneBridge.position.z, bAngle = stoneBridge.rotation.y;
  const across = new THREE.Vector3(Math.cos(bAngle), 0, -Math.sin(bAngle)).normalize();   // the bridge's length axis in world space
  const northEnd = new THREE.Vector3(bx, 0, bz).addScaledVector(across, across.z < 0 ? 5.2 : -5.2);
  const southEnd = new THREE.Vector3(bx, 0, bz).addScaledVector(across, across.z < 0 ? -5.2 : 5.2);
  const theBoat = boat(); place(theBoat, 12, 7, 0.4);
  const boat2 = boat(); place(boat2, -30, 8, 0.2);
  for (const [x, z] of [[13, 10.5], [17, 9.3], [21, 10.5], [25, 9.3], [40, 8.2], [43, 6.8]] as [number, number][]) place(tree("willow", 1.0), x, z, x);
  for (const [x, z] of [[25, -9], [33.5, -6.5], [35.5, -9.5], [36.5, -5.5]] as [number, number][]) place(tree("blossom", 0.9), x, z, x);
  for (let i = 0; i < 6; i++) place(tree("bamboo", 0.85), -31.5 + i * 1.4, 4.8 + (i % 2) * 0.7, i);
  // panda grove: a bamboo thicket on the south bank below the farms, where the camera can actually see it
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, d = 2.4 + (i % 3) * 1.0; place(tree("bamboo", 1.1 + (i % 2) * 0.35), -13 + Math.cos(a) * d, 28.5 + Math.sin(a) * d * 0.75, i); }
  place(panda(), -13.4, 22, 0.5); place(panda(), -11.4, 23.6, -1.1).scale.setScalar(0.8);
  place(panda(), -15.2, 23.8, 2.2).scale.setScalar(0.7);
  for (let i = 0; i < 4; i++) place(tree("pine", 1.1), -30 + i * 1.5, -23 - (i % 2) * 1.5, i);
  for (let i = 0; i < 5; i++) place(tree("persimmon", 1.0), 5 + i * 2.6, 17 + (i % 2) * 2, i);
  place(tree("round", 1.0), 30.5, 15.5, 1); place(tree("round", 0.9), 37, 14.5, 2);
  for (let i = 0; i < 3; i++) place(tree("ginkgo", 0.9), 14 + i * 3, 28 + (i % 2) * 0.6, i);
  // the north's quiet details: coal for the winter, pickle crocks, persimmons drying, a corn crib, the stone mill, flour sacks
  for (const [kind, x, z, rot] of [["cabbageStack", 35.5, -18.5, -0.4], ["garlicBraids", 13.8, -33.5, 0.2], ["chilliStrings", 6.5, -33.5, 0], ["chilliStrings", 41, -33.5, 0.3], ["noodleRack", 46.5, -26.5, 0.1], ["wheatSheaves", 5.5, -28.5, 0.3], ["wheatSheaves", 18.5, -28, -0.2], ["coalStack", 33, -19.5, 0.2], ["pickleCrocks", 42.5, -18.5, 0.1], ["persimmonString", 37, -18.5, 0], ["cornCrib", 15.5, -25, 0.3], ["stoneMill", 30.5, -39.5, 0], ["flourSacks", 33, -39.5, 0.4], ["pickleCrocks", 20.5, -39.6, -0.3], ["coalStack", 3, -40.5, 0.5]] as [Parameters<typeof northDetail>[0], number, number, number][]) place(northDetail(kind), x, z, rot);
  for (let i = 0; i < 5; i++) place(tree("round", 0.8 + (i % 2) * 0.2), 8 + i * 8, -41.8 + (i % 2) * 0.8, i);
  // Jiangnan's quiet details: lotus roots and pods, crab pots, wine jars, tea drying, fish on the rack, spring bamboo shoots
  for (const [kind, x, z, rot] of [["lotusBasket", 32, 27, 0.3], ["crabPots", 38, 13, 0.2], ["wineJars", 12.4, -1, 0.1], ["teaBaskets", 15.5, 28, 0], ["fishRack", 9.5, 4.2, 0.3], ["bambooShoots", 22.5, 26.5, 0.2], ["wineJars", 28.5, -0.6, -0.4], ["lotusBasket", 24.6, 26.6, 0.5]] as [Parameters<typeof jnDetail>[0], number, number, number][]) place(jnDetail(kind), x, z, rot);

  // ---------- farms ----------
  place(terrace(4, 4.2, true), -30, 23.5, 0.3);
  place(terrace(3, 3.0, false), -21.5, 24, -0.4);
  // pasture with fence and animals
  for (const [x, z, rot, len] of [[-26, 12, 0, 9], [-26, 20, 0, 9], [-30.5, 16, Math.PI / 2, 8], [-21.5, 16, Math.PI / 2, 8]] as [number, number, number, number][]) place(fence(len), x, z, rot);
  place(cow(false), -28.3, 18.3, 2.4);   // the pasture sits a step east of the mountain's foot so the cows never amble into it   // second cow keeps to the back of the pasture, clear of the clickable one
  place(goat(), -24.5, 13.5, 1.2); place(goat(), -24, 18.5, -0.6);
  for (const [x, z, rot, len] of [[-18.5, 15, 0, 5], [-18.5, 19, 0, 5], [-21, 17, Math.PI / 2, 4], [-16, 17, Math.PI / 2, 4]] as [number, number, number, number][]) place(fence(len), x, z, rot);
  place(PROPS.pig(), -17, 18.5, 2.0).scale.setScalar(0.8);
  // chicken coop
  place(coop(), -12, 14, 0.3);
  for (let i = 0; i < 4; i++) place(chicken(i % 2 ? "#c9822b" : C.white), -11 + Math.cos(i * 1.6) * 1.6, 16 + Math.sin(i * 1.6) * 1.4, i);
  place(pond(), -1, 15);
  // paddies with a water buffalo
  place(cow(true), 30.5, 18.5, -0.7);
  // ambient farmers carrying produce to market
  const walkers = [person("#3f6b8f", { pole: true }), person("#c0392b", { hat: true }), person("#e0a52c"), person("#2f5d3f", { pole: true })];
  walkers.forEach((w) => group.add(w));
  // the loop follows the street: east along its north edge, back along the south edge
  const walkPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-18.5, 0, -5.5), new THREE.Vector3(-12, 0, -5.6), new THREE.Vector3(-4, 0, -5.6), new THREE.Vector3(4, 0, -5.4), new THREE.Vector3(12, 0, -6.4), new THREE.Vector3(16, 0, -8.6), new THREE.Vector3(10, 0, -7.4), new THREE.Vector3(2, 0, -6.6), new THREE.Vector3(-6, 0, -7.4), new THREE.Vector3(-17, 0, -7.6), new THREE.Vector3(-18.8, 0, -6.6)], true);
  tickers.push((t) => walkers.forEach((w, i) => { const u = ((t * 0.012 + i * 0.25) % 1); const p = walkPath.getPointAt(u), n = walkPath.getPointAt((u + 0.005) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));

  // ---------- northern life: neighbours along the lane between the workshops ----------
  const nWalkers = [person("#4a5a7a"), person("#8a3a3a", { hat: true }), person("#e0a52c", { pole: true }), person("#3f6b8f"), person("#c9a86a")];
  nWalkers.forEach((w) => group.add(w));
  const nPath = new THREE.CatmullRomCurve3([new THREE.Vector3(5, 0, -27.6), new THREE.Vector3(14, 0, -27.2), new THREE.Vector3(24, 0, -27.6), new THREE.Vector3(32, 0, -27.6), new THREE.Vector3(41, 0, -27.6), new THREE.Vector3(46.5, 0, -26.6), new THREE.Vector3(41, 0, -25.5), new THREE.Vector3(32, 0, -25.4), new THREE.Vector3(24, 0, -25.3), new THREE.Vector3(14, 0, -25.1), new THREE.Vector3(4.5, 0, -25.6)], true);   // the town street, there and back
  tickers.push((t) => nWalkers.forEach((w, i) => { const u = (t * 0.01 + i * 0.2) % 1; const p = nPath.getPointAt(u), n = nPath.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));
  // ---------- oasis life: people up and down the road and over the wooden bridge; melons, raisins, nan, spices, carpets, chillies ----------
  for (const [kind, x, z, rot] of [["melonPile", -49, -3.6, 0.2], ["raisinRack", -59.6, -10.6, 0], ["nanStack", -46.6, -29, 0.3], ["spiceSacks", -49.2, 10.6, 0.1], ["carpetLine", -58.6, 13.2, 0.05], ["chilliStrings", -47.2, -11.2, 0.2], ["melonPile", -55.4, 14.6, -0.3]] as [Parameters<typeof xjDetail>[0], number, number, number][]) place(xjDetail(kind), x, z, rot);
  const xjWalkers = [person("#c0392b", { hat: true }), person("#2f5f9a"), person("#e0a52c", { pole: true }), person("#3f9aa3"), person("#e9d7b8", { hat: true })];
  xjWalkers.forEach((w) => group.add(w));
  const xb = xjBridge.position;
  const xjPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-53.7, 0, -30), new THREE.Vector3(-53.8, 0, -22), new THREE.Vector3(-53.6, 0, -8), new THREE.Vector3(-53.5, 0, -2), new THREE.Vector3(xb.x - 0.2, 0, xb.z), new THREE.Vector3(-53.6, 0, 7), new THREE.Vector3(-52.8, 0, 12), new THREE.Vector3(-51.6, 0, 14.6), new THREE.Vector3(-52.6, 0, 11), new THREE.Vector3(-53, 0, 7), new THREE.Vector3(xb.x + 0.2, 0, xb.z), new THREE.Vector3(-53, 0, -2), new THREE.Vector3(-53.1, 0, -8), new THREE.Vector3(-53.2, 0, -22), new THREE.Vector3(-53.1, 0, -29)], true);
  tickers.push((t) => xjWalkers.forEach((w, i) => { const u = (t * 0.008 + i * 0.2) % 1; const p = xjPath.getPointAt(u), n = xjPath.getPointAt((u + 0.004) % 1); const d = Math.hypot(p.x - xb.x, p.z - xb.z); const y = d < 2.9 ? 0.61 : d < 3.6 ? 0.61 * (1 - (d - 2.9) / 0.7) : 0; w.position.set(p.x, y, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));

  // two camels pace an oval through the sand in the south-west corner
  const camels = [camelWalker(), camelWalker()]; camels.forEach((c) => group.add(c));
  const camelPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-61.3, 0, 11), new THREE.Vector3(-61.4, 0, 26), new THREE.Vector3(-60, 0, 35), new THREE.Vector3(-54.5, 0, 39.5), new THREE.Vector3(-48, 0, 38.5), new THREE.Vector3(-46.5, 0, 35.5), new THREE.Vector3(-53.5, 0, 34.5), new THREE.Vector3(-56.5, 0, 29), new THREE.Vector3(-59.8, 0, 12.5)], true);   // the sandy south-west corner, clear of the peaks, the fold and the orchard
  const camelLapDuration = camelPath.getLength() / CAMEL_SPEED;
  tickers.push((t) => camels.forEach((c, i) => { const u = (t / camelLapDuration + i * 0.5) % 1; const p = camelPath.getPointAt(u), n = camelPath.getPointAt((u + 0.003) % 1); c.position.set(p.x, 0, p.z); c.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; (c.userData as { walk?: (t: number) => void }).walk?.(t + i * CAMEL_CYCLE * 0.3); }));

  // ---------- Jiangnan life: canal-side strollers over the bridge, a fisherman, washing, kids, laundry ----------
  const jnWalkers = [person("#6a7fb0"), person("#e9d7b8", { hat: true }), person("#c0392b", { pole: true }), person("#2f5d3f"), person("#3f6b8f")];
  jnWalkers.forEach((w) => group.add(w));
  const bridgeCenter = new THREE.Vector3(bx, 0, bz);
  const jnPath = new THREE.CatmullRomCurve3([
    // north bank: behind the red-braising kitchen and around the eastern houses, never through a wall
    new THREE.Vector3(20.6, 0, -0.6), new THREE.Vector3(21.8, 0, -7.6), new THREE.Vector3(32, 0, -8.6), new THREE.Vector3(36.6, 0, -6.2), new THREE.Vector3(38.6, 0, -2),
    new THREE.Vector3(36.2, 0, -0.5), new THREE.Vector3(33.5, 0, -0.3), new THREE.Vector3(24, 0, -0.5), northEnd.clone(),
    // over the bridge and along the south-bank lane
    new THREE.Vector3(bx, 0, bz), southEnd.clone(), new THREE.Vector3(18.6, 0, 8.6), new THREE.Vector3(17.9, 0, 12.9), new THREE.Vector3(13, 0, 14.2), new THREE.Vector3(17.5, 0, 15.3), new THREE.Vector3(23.6, 0, 14.6),
    // Return along the lane west of the terrace instead of cutting through the restaurant.
    new THREE.Vector3(21, 0, 15), new THREE.Vector3(20.2, 0, 13.8), new THREE.Vector3(20, 0, 10.8),
    southEnd.clone().add(new THREE.Vector3(0.3, 0, 0.6)), new THREE.Vector3(bx + 0.3, 0, bz),
  ], true);
  tickers.push((t) => jnWalkers.forEach((w, i) => {
    const u = (t * 0.009 + i * 0.2) % 1;
    const p = jnPath.getPointAt(u), n = jnPath.getPointAt((u + 0.004) % 1);
    const d = Math.hypot(p.x - bridgeCenter.x, p.z - bridgeCenter.z);
    // deck is flat across the span, then the stepped ramps bring you down to the bank
    const y = d < 3.6 ? 1.15 : d < 5.4 ? 1.15 * (1 - (d - 3.6) / 1.8) : 0;
    w.position.set(p.x, y, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z);
    (w.userData as { walk?: (t: number) => void }).walk?.(t + i);
  }));
  // A short fishing jetty connects the north bank to the fisher's position over the water.
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.16, 3.1), mat(C.wood)), 27.5, 0.2, 3);
  for (const x of [27, 28]) for (const z of [1.7, 4.3]) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.5, 6), mat(C.woodDark)), x, 0.03, z);
  const fisher = place(person("#4a3a32", { hat: true }), 27.5, 4.2, 0.2);
  fisher.position.y = 0.28;
  const rod = add(fisher, new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 2.0, 4), mat("#5a3a22")), 0.2, 1.0, 0.5); rod.rotation.x = 1.1;
  const rodTip = rod.localToWorld(new THREE.Vector3(0, 1, 0));
  const fishingLine = new THREE.BufferGeometry().setFromPoints([rodTip, new THREE.Vector3(rodTip.x, 0.05, rodTip.z)]);
  group.add(new THREE.Line(fishingLine, new THREE.LineBasicMaterial({ color: "#e8e8e8" })));
  // woman washing at the river steps
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.9), mat(C.stone)), 16.5, 0.12, 8.6);
  const washer = person("#d97a8a"); (washer.userData as { sit?: () => void }).sit?.(); place(washer, 16.5, 8.2, Math.PI).position.y = 0.05;
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.25, 9), mat("#c9b16a")), 17.2, 0.37, 8.4);
  // kids under the willows and grandparents on a bench
  for (const [x, z, c] of [[12.5, 12.8, "#e0a52c"], [13.4, 13.4, "#3f6b8f"]] as [number, number, string][]) place(person(c), x, z, x).scale.setScalar(0.62);
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.45), mat(C.wood)), 22.8, 0.45, 17.6);
  for (const x of [22.2, 23.4]) add(group, new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.4, 0.36), mat(C.woodDark)), x, 0.2, 17.6);
  for (const x of [22.4, 23.2]) {
    const gp = person(x < 22.8 ? "#7a4a3a" : "#5a5a66");
    (gp.userData as { sit?: () => void }).sit?.();
    const figureScale = (gp.userData as { hipY: number }).hipY / 0.44;
    // The pelvis underside is at 0.36 * scale; knees must extend past the front edge.
    place(gp, x, 17.73, 0.05).position.y = 0.5 - 0.36 * figureScale;
  }
  // laundry line between the water-town houses
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 5.2, 4), mat(C.woodDark)); line.rotation.z = Math.PI / 2; line.position.set(17.5, 2.3, 13.6); group.add(line);
  const cloths = ["#c0392b", "#3f6b8f", "#f4f1ea", "#e0a52c", "#6a7fb0"].map((c, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.9, 1, 3), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 1 })); m.geometry.translate(0, -0.45, 0); m.position.set(15.4 + i * 1.05, 2.3, 13.6); m.castShadow = true; group.add(m); return m; });
  tickers.push((t) => cloths.forEach((m, i) => { m.rotation.x = Math.sin(t * 2.2 + i * 1.3) * 0.25 + 0.15; }));
  // a couple in the northern courtyard
  place(person("#e9d7b8", { hat: true }), 37.5, -21.5, 0.6); place(person("#7a4a3a"), 41.5, -20.5, -1.8);

  // ---------- koi in the river: each fish steers smoothly toward a drifting point ahead of it, bending as it swims ----------
  type Koi = { g: THREE.Group; u: number; side: number; targetSide: number; speed: number; heading: number; ph: number; leapT: number; nextLeap: number };
  const kois: Koi[] = [];
  const palette: [string, string][] = [["#e8823f", "#f6f1e6"], ["#f1b24a", "#f6f1e6"], ["#d94f3a", "#f6f1e6"], ["#f6f1e6", "#e8823f"], ["#8a949c", "#c9d0d4"], ["#e8823f", "#2a2a2e"], ["#f1b24a", "#e8823f"], ["#d94f3a", "#f1b24a"], ["#f6f1e6", "#d94f3a"]];
  palette.forEach(([c1, c2], i) => {
    const f = fish(c1, c2, 0.36 + (i % 3) * 0.06);   // small: a koi the size of a person's hand
    group.add(f);
    kois.push({ g: f, u: (i / palette.length + Math.random() * 0.06) % 1, side: (Math.random() - 0.5) * 1.4, targetSide: (Math.random() - 0.5) * 1.4, speed: 0.003 + Math.random() * 0.003, heading: 0, ph: Math.random() * 6, leapT: -1, nextLeap: 20 + Math.random() * 40 });
  });
  const splashes: { m: THREE.Mesh; life: number }[] = [];
  const splashMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7, depthWrite: false });
  tickers.push((t, dt) => {
    for (const k of kois) {
      // drift: pick a new lane now and then and ease toward it, so the path meanders instead of running on rails
      if (Math.random() < dt * 0.15) k.targetSide = (Math.random() - 0.5) * 1.6;
      k.side += (k.targetSide - k.side) * Math.min(1, dt * 0.6);
      const glide = k.leapT >= 0 ? 1.6 : 1 + Math.sin(t * 0.5 + k.ph) * 0.2;      // a slow cruise with gentle speed changes
      k.u = (k.u + dt * k.speed * glide) % 1;
      const p = curve.getPointAt(k.u), tg = curve.getTangentAt(k.u);
      const sideV = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(k.side);
      const ahead = curve.getPointAt((k.u + 0.01) % 1).add(new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(k.targetSide));
      const want = Math.atan2(ahead.x - (p.x + sideV.x), ahead.z - (p.z + sideV.z));
      let d = want - k.heading; d = Math.atan2(Math.sin(d), Math.cos(d));
      k.heading += d * Math.min(1, dt * 1.6);                                          // smooth, unhurried turning
      // a leap every so often: up, over, and back in with a splash
      k.nextLeap -= dt;
      if (k.nextLeap <= 0 && k.leapT < 0) { k.leapT = 0; k.nextLeap = 30 + Math.random() * 50; }
      let y = 0.0 + Math.sin(t * 1.3 + k.ph) * 0.012, pitch = 0, roll = 0;   // just under the surface (the ground is solid below)
      if (k.leapT >= 0) {
        k.leapT += dt;
        const a = k.leapT / 1.1;
        if (a >= 1) { k.leapT = -1; const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 20), splashMat.clone()); ring.rotation.x = -Math.PI / 2; ring.position.set(p.x + sideV.x, 0.05, p.z + sideV.z); group.add(ring); splashes.push({ m: ring, life: 0 }); }
        else { y = Math.sin(a * Math.PI) * 0.5; pitch = (a < 0.5 ? -0.9 : 0.9) * Math.sin(a * Math.PI); roll = Math.sin(a * Math.PI * 2) * 0.6; if (a < 0.05 && k.leapT < dt * 1.5) { const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 20), splashMat.clone()); ring.rotation.x = -Math.PI / 2; ring.position.set(p.x + sideV.x, 0.05, p.z + sideV.z); group.add(ring); splashes.push({ m: ring, life: 0 }); } }
      }
      k.g.position.set(p.x + sideV.x, TOP + y, p.z + sideV.z);
      k.g.rotation.set(0, k.heading - Math.PI / 2, 0);
      k.g.rotateZ(pitch); k.g.rotateX(roll);
      (k.g.userData as { swim?: (t: number, k: number) => void }).swim?.(t + k.ph, glide);
    }
    for (let i = splashes.length - 1; i >= 0; i--) { const sp = splashes[i]; sp.life += dt; const s2 = 1 + sp.life * 6; sp.m.scale.set(s2, s2, 1); (sp.m.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - sp.life / 0.9); if (sp.life > 0.9) { group.remove(sp.m); splashes.splice(i, 1); } }
  });

  // butterflies and boats
  const flies = [[-7, 15], [25, 15], [-19, 1], [3, -21]].map(([x, z], i) => { const b = butterfly(["#f2b64d", "#f4a6b8", "#ffffff", "#f2b64d"][i]); group.add(b); tickers.push(b.userData.tick!); return { b, x, z, ph: i * 2 }; });
  tickers.push((t) => flies.forEach(({ b, x, z, ph }) => { b.position.set(x + Math.sin(t * 0.6 + ph) * 2.4, TOP + 1.8 + Math.sin(t * 1.7 + ph) * 0.4, z + Math.cos(t * 0.45 + ph) * 2); b.rotation.y = t * 0.6 + ph; }));
  const uAtX = (x: number) => { let best = 0, bestD = Infinity; for (let i = 0; i <= 400; i++) { const d = Math.abs(curve.getPointAt(i / 400).x - x); if (d < bestD) { bestD = d; best = i / 400; } } return best; };
  tickers.push((t) => {
    const drift = (b: THREE.Object3D, u0: number, span: number, ph: number) => { const u = u0 + span * (0.5 + 0.5 * Math.sin(t * 0.05 + ph)); const p = curve.getPointAt(u), n = curve.getPointAt(Math.min(1, u + 0.01)); b.position.set(p.x, TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) + Math.PI / 2; };
    drift(theBoat, uAtX(-10), uAtX(8) - uAtX(-10), 0); drift(boat2, uAtX(-34), uAtX(-18) - uAtX(-34), 2);   // between the bridges, clear of the river market
  });
}
