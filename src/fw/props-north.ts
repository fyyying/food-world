// Northern China: the wheat belt. Grey brick, paper windows, flour dust, vinegar jars, coal stoves and big tables.
// Every prop answers a click inside the world (dough rolls, lids lift, ducks swing, skewers turn) before a card opens.
import * as THREE from "three";
import { C, add, box, cyl, cone, ball, group, reaction, pick, tickChildren, mat, house, person, lantern, chineseRoof, bubble, rnd, type P } from "./props";

type Fig = P & { userData: { upper?: THREE.Group; arms?: { left: THREE.Group; right: THREE.Group }; sit?: () => void } };
const upper = (p: THREE.Object3D) => (p.userData as { upper?: THREE.Group }).upper;
const arms = (p: THREE.Object3D) => (p.userData as { arms?: { left: THREE.Group; right: THREE.Group } }).arms;
const GREY = "#8d8a84", BRICK = "#9a8f84", PAPER = "#f1e6cf", DOUGH = "#f0e2c4", FLOUR = "#f7f1e3";

/** a grey-brick courtyard wall with a tiled coping */
function brickWall(g: THREE.Object3D, x: number, z: number, len: number, rot: number, h = 1.6) {
  const w = add(g, box(len, h, 0.28, GREY), x, h / 2, z); w.rotation.y = rot;
  const cap = add(g, box(len + 0.1, 0.1, 0.42, C.tile), x, h + 0.05, z); cap.rotation.y = rot;
}
/** a wooden gate with a small tiled roof: the door of a courtyard house */
function gate(g: THREE.Object3D, x: number, z: number, rot: number) {
  const gg = new THREE.Group(); gg.position.set(x, 0, z); gg.rotation.y = rot; g.add(gg);
  for (const dx of [-0.75, 0.75]) add(gg, box(0.3, 2.1, 0.4, GREY), dx, 1.05, 0);
  add(gg, box(1.9, 0.22, 0.5, C.woodDark), 0, 2.2, 0);
  add(gg, chineseRoof(2.4, 1.1, 0.4, C.tile, 0.15), 0, 2.55, 0);
  for (const dx of [-0.3, 0.3]) add(gg, box(0.55, 1.9, 0.08, "#7a3b2a"), dx, 0.95, 0.12);
  for (const dx of [-0.3, 0.3]) add(gg, ball(0.05, C.gold, 6), dx, 1.1, 0.18);
  add(gg, box(0.4, 0.12, 0.6, C.stone), 0, 0.06, 0.35);
  return gg;
}
/** a stack of dumplings in rows on a floured tray */
function dumplingTray(g: THREE.Object3D, x: number, y: number, z: number, n = 12) {
  add(g, box(1.1, 0.05, 0.7, "#c9b58a"), x, y, z);
  for (let i = 0; i < n; i++) { const d = add(g, ball(0.07, FLOUR, 6), x - 0.42 + (i % 4) * 0.28, y + 0.08, z - 0.22 + Math.floor(i / 4) * 0.22); d.scale.set(1.3, 0.75, 0.8); d.rotation.y = 0.3; }
}

/** 饺子馆: rolling, filling, pleating and boiling under one roof; a tray of pleated dumplings and a pot that boils over when you click. */
export function dumplingHouse(): P {
  const g = group();
  add(g, house("northern", 4.6, 3.0, 1.9), 0, 0, -1.0);
  add(g, box(3.6, 0.85, 1.1, C.wood), -0.2, 0.42, 1.3);                      // the long work table
  add(g, box(3.4, 0.03, 0.9, FLOUR), -0.2, 0.86, 1.3);                        // flour dust
  dumplingTray(g, -1.2, 0.87, 1.35); dumplingTray(g, 0.1, 0.87, 1.4, 8);
  for (let i = 0; i < 5; i++) add(g, cyl(0.12, 0.12, 0.01, DOUGH, 10), 1.0 + (i % 3) * 0.26, 0.88, 1.15 + Math.floor(i / 3) * 0.28);   // wrappers
  add(g, ball(0.18, "#c98a6a", 8), 1.4, 0.98, 1.55).scale.y = 0.6;              // the filling bowl
  add(g, cyl(0.03, 0.03, 0.55, C.wood, 5), 0.7, 0.9, 1.05).rotation.z = Math.PI / 2;   // rolling pin
  // the pot on a coal stove at the side
  add(g, box(1.0, 0.8, 1.0, BRICK), 2.3, 0.4, 0.2); add(g, cone(0.12, 0.16, "#ff7a3c", 6), 2.3, 0.35, 0.75);
  const pot = add(g, cyl(0.42, 0.36, 0.42, C.iron, 12), 2.3, 1.0, 0.2);
  const lid = add(g, cyl(0.44, 0.44, 0.06, C.woodDark, 12), 2.3, 1.24, 0.2);
  const rollers = [add(g, person("#f4f1ea", { apron: true }), -1.2, 0, 0.3), add(g, person("#6a7fb0", { apron: true }), 0.2, 0, 0.3)] as Fig[];
  const cook = add(g, person("#e9d7b8", { apron: true }), 2.3, 0, 1.2) as Fig; cook.rotation.y = Math.PI;
  // diners at a sturdy table outside with vinegar bowls and garlic
  add(g, box(1.4, 0.08, 0.9, C.wood), -1.6, 0.72, 3.0); for (const [dx, dz] of [[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]]) add(g, box(0.08, 0.7, 0.08, C.woodDark), -1.6 + dx, 0.35, 3.0 + dz);
  add(g, cyl(0.16, 0.13, 0.05, "#f7f2e6", 9), -1.9, 0.79, 3.0); add(g, cyl(0.1, 0.08, 0.05, "#3b2a1e", 8), -1.3, 0.79, 2.85); add(g, ball(0.06, "#f4ecdc", 6), -1.35, 0.8, 3.2);
  const diners = [-2.4, -0.8].map((x, i) => { const p = person(i ? "#c0392b" : "#2f5d3f"); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.32, 3.0); q.rotation.y = i ? -Math.PI / 2 : Math.PI / 2; return q as Fig; });
  add(g, box(0.6, 0.8, 0.05, "#f3e6c8"), 2.5, 1.9, 0.45);                      // 饺 sign
  add(g, lantern(0.8), -2.2, 1.95, 0.6); add(g, lantern(0.8), 2.2, 1.95, 0.6);
  g.userData.steam = new THREE.Vector3(2.3, 1.45, 0.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "饺子下锅喽! Dumplings in the pot!", 2.8, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    lid.position.y = 1.24 + k * Math.abs(Math.sin(t * 12)) * 0.16; lid.rotation.z = k * Math.sin(t * 9) * 0.15; pot.rotation.y = t * 0.2;
    rollers.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.x = 0.3 + Math.sin(t * (2 + k * 5) + i) * 0.08; u.rotation.z = k * Math.sin(t * 7 + i) * 0.1; } const a = arms(p); if (a) a.right.rotation.x = -0.9 + Math.sin(t * (2.5 + k * 6) + i) * 0.35; });
    const uc = upper(cook); if (uc) uc.rotation.x = 0.15 + k * 0.25;
    diners.forEach((p, i) => { const u = upper(p); if (u) u.rotation.x = 0.1 + k * Math.sin(Math.min(1, k * 2) * Math.PI) * 0.3 * (i ? 1 : -1); });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 面坊: a noodle workshop, dough stretched into ropes and a cook shaving knife-cut noodles straight into the pot. */
export function noodleWorkshop(): P {
  const g = group();
  add(g, house("northern", 4.2, 3.0, 1.9), 0, 0, -1.0);
  add(g, box(3.2, 0.85, 1.0, C.wood), -0.4, 0.42, 1.2); add(g, box(3.0, 0.03, 0.8, FLOUR), -0.4, 0.86, 1.2);
  add(g, box(0.9, 0.16, 0.5, DOUGH), -1.4, 0.95, 1.2);                          // resting dough
  // the puller: a rope of dough between his hands that stretches and swings
  const puller = add(g, person("#3f4a5a", { apron: true }), -0.3, 0, 0.25) as Fig;
  const rope = new THREE.Group(); rope.position.set(-0.3, 1.25, 0.65); g.add(rope);
  const strands = Array.from({ length: 5 }, (_, i) => add(rope, cyl(0.012, 0.012, 1.0, DOUGH, 4), (i - 2) * 0.04, 0, (i % 2) * 0.03)); strands.forEach((s) => { s.rotation.z = Math.PI / 2; });
  // the shaver over the pot, a slab of dough on his shoulder
  add(g, box(1.0, 0.8, 1.0, BRICK), 1.9, 0.4, 0.3); add(g, cone(0.12, 0.16, "#ff7a3c", 6), 1.9, 0.35, 0.85);
  add(g, cyl(0.42, 0.36, 0.42, C.iron, 12), 1.9, 1.0, 0.3); add(g, cyl(0.38, 0.38, 0.03, "#e9dcb8", 12), 1.9, 1.2, 0.3);
  const shaver = add(g, person("#7a4a3a", { apron: true }), 1.9, 0, 1.3) as Fig; shaver.rotation.y = Math.PI;
  const slab = add(upper(shaver)!, box(0.5, 0.18, 0.2, DOUGH), -0.25, 0.35, 0);
  const flakes = Array.from({ length: 6 }, () => { const f = add(g, box(0.16, 0.02, 0.05, DOUGH), 1.9, 1.3, 0.5); f.visible = false; return { m: f, t: -1 }; });
  // diners with big bowls, a vinegar jar and garlic on the table
  add(g, box(1.4, 0.08, 0.9, C.wood), -1.4, 0.72, 3.0); for (const [dx, dz] of [[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]]) add(g, box(0.08, 0.7, 0.08, C.woodDark), -1.4 + dx, 0.35, 3.0 + dz);
  for (const x of [-1.8, -1.0]) { add(g, cyl(0.2, 0.15, 0.14, "#f7f2e6", 10), x, 0.83, 3.0); add(g, cyl(0.16, 0.16, 0.02, "#d9a441", 10), x, 0.9, 3.0); }
  add(g, cyl(0.1, 0.09, 0.2, "#3b2a1e", 8), -1.4, 0.86, 2.65);
  const diners = [-2.2, -0.6].map((x, i) => { const p = person(i ? "#e0a52c" : "#6a7fb0"); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.32, 3.0); q.rotation.y = i ? -Math.PI / 2 : Math.PI / 2; return q as Fig; });
  add(g, box(0.6, 0.8, 0.05, "#f3e6c8"), 2.3, 1.9, 0.45);                      // 面 sign
  g.userData.steam = new THREE.Vector3(1.9, 1.45, 0.3);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(g, "刀削面, 一根一根飞进锅! Knife-cut, straight into the pot", 2.8, 1700); flakes.forEach((f, i) => { f.t = i * 0.12; }); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const stretch = 1 + k * (0.6 + Math.abs(Math.sin(t * 3)) * 0.8);
    rope.scale.x = stretch; rope.rotation.z = Math.sin(t * (1.5 + k * 4)) * 0.15 * (1 + k);
    strands.forEach((s, i) => { s.position.y = Math.sin(t * 6 + i) * 0.03 * (1 + k * 3); });
    const up = upper(puller); if (up) up.rotation.z = Math.sin(t * (1.5 + k * 4)) * 0.12 * (1 + k);
    const a = arms(puller); if (a) { a.left.rotation.x = -1.2; a.right.rotation.x = -1.2; a.left.rotation.z = 0.4 + k * 0.5; a.right.rotation.z = -0.4 - k * 0.5; }
    const us = upper(shaver); if (us) us.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 10)) * 0.2; slab.rotation.z = k * Math.sin(t * 10) * 0.2;
    flakes.forEach((f) => { if (f.t < 0) { f.m.visible = false; return; } f.t += dt; f.m.visible = true; const a2 = f.t / 0.7; f.m.position.set(1.9 - 0.3 * a2, 1.35 + Math.sin(a2 * Math.PI) * 0.3, 0.9 - 0.6 * a2); f.m.rotation.z = a2 * 6; if (a2 >= 1) f.t = -1; });
    diners.forEach((p, i) => { const u = upper(p); if (u) u.rotation.x = 0.15 + Math.sin(t * 1.3 + i) * 0.05; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 馒头坊: a steamed-bread workshop, sacks of flour, a kneader and tall towers of steamers breathing. */
export function mantouKitchen(): P {
  const g = group();
  add(g, house("northern", 4.0, 2.8, 1.8), 0, 0, -0.9);
  add(g, box(3.0, 0.85, 1.0, C.wood), -0.5, 0.42, 1.1); add(g, box(2.8, 0.03, 0.8, FLOUR), -0.5, 0.86, 1.1);
  const dough = add(g, ball(0.28, DOUGH, 10), -1.3, 1.05, 1.1); dough.scale.y = 0.7;
  for (let i = 0; i < 8; i++) add(g, ball(0.1, FLOUR, 7), -0.6 + (i % 4) * 0.24, 0.97, 0.9 + Math.floor(i / 4) * 0.3).scale.y = 0.85;   // shaped buns proving
  for (let i = 0; i < 3; i++) { const r = add(g, cyl(0.1, 0.1, 0.12, FLOUR, 8), 0.7 + i * 0.25, 0.94, 1.3); r.rotation.x = 0.2; add(r, new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 4, 10), mat("#e9dcb8")), 0, 0.02, 0).rotation.x = Math.PI / 2; }   // flower rolls
  // two towers of steamers on the stove, lids that lift
  add(g, box(1.6, 0.8, 1.0, BRICK), 1.9, 0.4, 0.2); add(g, cone(0.12, 0.16, "#ff7a3c", 6), 1.9, 0.35, 0.75);
  const lids = [1.5, 2.3].map((x, i) => { const n = 5 - i; for (let k = 0; k < n; k++) { add(g, cyl(0.34, 0.34, 0.16, "#c9a86a", 12), x, 0.9 + k * 0.17, 0.2); add(g, new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 4, 14), mat("#a5813f")), x, 0.98 + k * 0.17, 0.2).rotation.x = Math.PI / 2; } const lid = new THREE.Group(); lid.position.set(x, 0.9 + n * 0.17 + 0.02, 0.2); g.add(lid); add(lid, cyl(0.36, 0.36, 0.06, "#b8944f", 12), 0, 0, 0); add(lid, ball(0.05, "#8a6a3a", 6), 0, 0.06, 0); return { lid, base: 0.9 + n * 0.17 + 0.02 }; });
  for (let i = 0; i < 3; i++) { const s = add(g, cyl(0.28, 0.32, 0.6, "#e6dcc4", 9), -2.3 + (i % 2) * 0.55, 0.3 + Math.floor(i / 2) * 0.55, 1.6 + (i % 2) * 0.1); s.rotation.z = (i % 2) * 0.1; }   // flour sacks
  const kneader = add(g, person("#f4f1ea", { apron: true }), -1.3, 0, 0.2) as Fig;
  const shaper = add(g, person("#e9d7b8", { apron: true }), 0.2, 0, 0.2) as Fig;
  const buyer = add(g, person("#c0392b"), 2.2, 0, 2.0) as Fig; buyer.rotation.y = -0.7;
  add(g, box(0.6, 0.8, 0.05, "#f3e6c8"), 2.2, 1.85, 0.5);
  g.userData.steam = new THREE.Vector3(1.9, 2.0, 0.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "热馒头! Hot mantou, just off the steam", 2.7, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    lids.forEach(({ lid, base }, i) => { lid.position.y = base + k * (0.2 + Math.abs(Math.sin(t * 9 + i)) * 0.14); lid.rotation.z = k * Math.sin(t * 7 + i) * 0.2; });
    dough.scale.set(1 + Math.sin(t * (2 + k * 6)) * 0.08 * (1 + k), 0.7 - Math.sin(t * (2 + k * 6)) * 0.06 * (1 + k), 1 + Math.cos(t * (2 + k * 6)) * 0.08 * (1 + k));
    const uk = upper(kneader); if (uk) { uk.rotation.x = 0.35 + Math.sin(t * (2 + k * 6)) * 0.12 * (1 + k); }
    const us = upper(shaper); if (us) us.rotation.x = 0.25 + Math.sin(t * 1.5 + 1) * 0.05;
    const ub = upper(buyer); if (ub) ub.rotation.z = k * Math.sin(t * 5) * 0.15;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 醋坊: a Shanxi vinegar workshop, rows of dark jars under cloth, fermentation vats, a master tasting from a ladle. */
export function vinegarWorkshop(): P {
  const g = group();
  add(g, box(6.0, 0.25, 4.4, C.stone), 0, 0.12, 0);
  for (const [x, z] of [[-2.7, -1.9], [2.7, -1.9], [-2.7, 1.9], [2.7, 1.9]] as [number, number][]) add(g, cyl(0.1, 0.11, 2.4, C.woodDark, 6), x, 1.35, z);
  add(g, chineseRoof(6.8, 5.2, 0.6, "#5c5f66", 0), 0, 2.6, 0); add(g, box(2.0, 0.16, 0.22, "#3f4148"), 0, 3.2, 0);   // low straight northern roof with a ridge
  add(g, box(5.8, 2.0, 0.12, GREY), 0, 1.25, -2.1);
  const jars: THREE.Mesh[] = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) {
    const rad = 0.3 + (i % 2) * 0.04, x = -2.2 + i * 1.05 + r * 0.2, z = -1.4 + r * 0.75;
    const j = add(g, ball(rad, "#2f2420", 10), x, 0.25 + rad * 0.9, z); j.scale.y = 1.2; jars.push(j);
    add(g, cyl(rad * 0.55, rad * 0.6, 0.07, "#e9dcb8", 10), x, 0.25 + rad * 2.0, z);    // cloth over the mouth
    add(g, new THREE.Mesh(new THREE.TorusGeometry(rad * 0.58, 0.02, 4, 12), mat("#8a6a3a")), x, 0.25 + rad * 1.95, z).rotation.x = Math.PI / 2;
  }
  add(g, cyl(0.7, 0.62, 0.9, "#6b4a2e", 12), 2.2, 0.7, 1.2); add(g, cyl(0.62, 0.62, 0.04, "#7a5a2e", 12), 2.2, 1.14, 1.2);   // the mash vat
  const rake = add(g, cyl(0.02, 0.02, 1.4, C.wood, 4), 2.6, 1.3, 1.2); rake.rotation.z = 0.7;
  for (let i = 0; i < 2; i++) add(g, cyl(0.26, 0.3, 0.5, "#d9c28a", 9), -2.6 + i * 0.5, 0.5, 1.7 + i * 0.2);   // sacks of sorghum and bran
  const master = add(g, person("#3f4a5a", { apron: true }), 0.4, 0.25, 1.5) as Fig; master.rotation.y = 0.5;
  const ladle = add(arms(master)!.right, cyl(0.02, 0.02, 0.45, C.wood, 4), 0.02, -0.28, 0.05); ladle.rotation.x = 1.2; add(ladle, cyl(0.06, 0.05, 0.06, "#3b2a1e", 8), 0, -0.22, 0);
  const helper = add(g, person("#7a4a3a", { apron: true }), -1.4, 0.25, 1.6) as Fig; helper.rotation.y = -0.4;
  add(g, cyl(0.16, 0.13, 0.32, "#3b2a1e", 10), 1.2, 0.41, 2.0); add(g, cyl(0.07, 0.06, 0.06, "#3b2a1e", 8), 1.5, 0.28, 2.0);   // a bottle and a tasting cup
  add(g, box(0.55, 0.75, 0.05, "#f3e6c8"), -2.9, 1.8, 2.1);                     // 醋 sign
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(master, "山西老陈醋, 酸得香! Shanxi aged vinegar", 1.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const um = upper(master); if (um) { um.rotation.x = 0.25 * (1 - k) + Math.sin(t * 1.2) * 0.04; um.rotation.z = k * Math.sin(Math.min(1, k * 2) * Math.PI) * 0.3; }
    const uh = upper(helper); if (uh) uh.rotation.x = 0.3 + Math.sin(t * (1.6 + k * 5)) * 0.1 * (1 + k);
    rake.rotation.y = Math.sin(t * (1 + k * 5)) * 0.5 * (0.3 + k);
    jars.forEach((j, i) => { j.scale.y = 1.2 + k * Math.sin(t * 10 + i) * 0.03; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 烤鸭店: ducks hanging in the window, a brick oven glowing, the carver at his board. Click: the ducks swing and the oven flares. */
export function roastDuckShop(): P {
  const g = group();
  add(g, house("northern", 4.4, 3.0, 2.0), 0, 0, -1.0);
  add(g, box(1.6, 1.7, 1.4, BRICK), 1.6, 0.85, 0.4); add(g, cyl(0.5, 0.5, 0.08, C.iron, 12), 1.6, 1.74, 0.4);   // the brick oven
  const mouth = add(g, box(0.7, 0.6, 0.06, "#1a120e"), 1.6, 0.7, 1.12);
  const glow = add(g, box(0.6, 0.5, 0.02, "#ff7a3c"), 1.6, 0.68, 1.14);
  add(g, box(2.4, 0.06, 0.06, C.woodDark), -0.8, 2.0, 1.2);                     // the hanging rail
  const ducks = Array.from({ length: 4 }, (_, i) => { const d = new THREE.Group(); d.position.set(-1.7 + i * 0.6, 2.0, 1.2); g.add(d); add(d, cyl(0.01, 0.01, 0.3, C.iron, 3), 0, -0.15, 0); const body = add(d, ball(0.17, "#a04a1e", 9), 0, -0.55, 0); body.scale.set(0.8, 1.35, 0.7); add(d, ball(0.08, "#a04a1e", 7), 0, -0.3, 0.02); add(d, cone(0.03, 0.1, "#d9a441", 4), 0.02, -0.28, 0.1).rotation.x = Math.PI / 2; return d; });
  add(g, box(2.2, 0.85, 1.0, C.wood), -0.8, 0.42, 1.3);                          // the carving counter
  add(g, cyl(0.32, 0.32, 0.08, "#c99a63", 14), -1.2, 0.9, 1.3);                  // board
  add(g, ball(0.16, "#a04a1e", 9), -1.2, 1.02, 1.3).scale.set(0.9, 0.6, 1.3);    // the duck being carved
  for (let i = 0; i < 6; i++) add(g, box(0.16, 0.02, 0.09, "#c9713a"), -0.5 + (i % 3) * 0.2, 0.9, 1.1 + Math.floor(i / 3) * 0.25);   // slices
  add(g, cyl(0.16, 0.16, 0.02, DOUGH, 12), 0.1, 0.9, 1.5); add(g, cyl(0.16, 0.16, 0.02, DOUGH, 12), 0.1, 0.93, 1.5);   // pancakes
  add(g, ball(0.08, "#3b2a1e", 6), 0.35, 0.94, 1.15).scale.y = 0.5; for (let i = 0; i < 4; i++) add(g, cyl(0.015, 0.015, 0.25, "#6fae4f", 4), 0.4 + i * 0.05, 0.95, 1.5).rotation.z = 0.3;   // sauce, scallions
  const carver = add(g, person("#f4f1ea", { apron: true, hat: false }), -1.2, 0, 0.35) as Fig;
  const knife = add(arms(carver)!.right, box(0.03, 0.02, 0.28, C.steel), 0.02, -0.32, 0.12);
  const diners = [-2.6, 2.9].map((x, i) => { const p = person(i ? "#6a7fb0" : "#d97a8a"); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x + (i ? 0.9 : -0.9), 0.32, 2.6); q.rotation.y = i ? -Math.PI / 2 : Math.PI / 2; return q as Fig; });
  for (const x of [-2.6, 2.9]) {   // two small tables on legs, a stool under each diner
    add(g, box(1.2, 0.08, 0.8, C.wood), x, 0.72, 2.6); for (const [dx, dz] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) add(g, box(0.07, 0.7, 0.07, C.woodDark), x + dx, 0.35, 2.6 + dz);
    add(g, box(0.5, 0.06, 0.4, C.woodDark), x + (x < 0 ? -0.9 : 0.9), 0.3, 2.6); for (const [dx, dz] of [[-0.18, -0.14], [0.18, -0.14], [-0.18, 0.14], [0.18, 0.14]]) add(g, box(0.05, 0.3, 0.05, C.woodDark), x + (x < 0 ? -0.9 : 0.9) + dx, 0.15, 2.6 + dz);
  }
  add(g, box(0.7, 0.8, 0.05, "#f3e6c8"), 2.3, 1.95, 0.55);                      // 烤鸭 sign
  add(g, lantern(0.8), -2.2, 2.05, 0.7);
  g.userData.smoke = new THREE.Vector3(1.6, 2.0, 0.4);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "枣木烤鸭, 皮脆肉嫩! Crisp skin, jujube wood", 2.9, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    ducks.forEach((d, i) => { d.rotation.z = Math.sin(t * 1.1 + i) * 0.04 + k * Math.sin(t * 5 + i) * 0.3; d.rotation.y = k * Math.sin(t * 3 + i) * 0.6; });
    glow.scale.setScalar((0.9 + Math.sin(t * 9) * 0.1) * (1 + k * 0.4)); mouth.visible = true;
    knife.rotation.x = k * Math.sin(t * 12) * 0.5 + 0.2; const uc = upper(carver); if (uc) uc.rotation.x = 0.3 + k * Math.abs(Math.sin(t * 12)) * 0.1;
    diners.forEach((p, i) => { const u = upper(p); if (u) u.rotation.x = 0.1 + k * 0.2 * Math.sin(Math.min(1, k * 2) * Math.PI); void i; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 烤串院: a long charcoal grill in a courtyard, skewers turning, benches, flatbreads and beer. Click: skewers flip, embers flare, smoke thickens. */
export function skewerCourtyard(): P {
  const g = group();
  add(g, box(6.0, 0.15, 4.6, "#b3a48c"), 0, 0.07, 0);
  brickWall(g, 0, -2.3, 6.0, 0, 1.5); brickWall(g, -3.0, -0.6, 3.4, Math.PI / 2, 1.5);
  add(g, box(3.0, 0.7, 0.5, C.iron), 0, 0.6, -1.4); add(g, box(2.9, 0.08, 0.4, "#ff6a2a"), 0, 0.98, -1.4);   // the grill and its embers
  const embers = add(g, box(2.7, 0.04, 0.3, "#ffb060"), 0, 1.0, -1.4);
  const skewers = Array.from({ length: 8 }, (_, i) => { const s = new THREE.Group(); s.position.set(-1.3 + i * 0.37, 1.1, -1.4); g.add(s); add(s, cyl(0.01, 0.01, 0.7, C.steel, 3), 0, 0, 0).rotation.x = Math.PI / 2; for (let k = 0; k < 4; k++) add(s, box(0.08, 0.07, 0.09, k % 2 ? "#8a3a26" : "#c0603f"), 0, 0, -0.25 + k * 0.15); return s; });
  const griller = add(g, person("#3f4a5a", { apron: true }), 0.2, 0, -2.0) as Fig;
  const fan = add(arms(griller)!.right, box(0.22, 0.02, 0.18, C.straw), 0.05, -0.34, 0.08);
  add(g, box(0.5, 0.5, 0.5, C.woodDark), 2.0, 0.4, -1.4); for (let i = 0; i < 6; i++) add(g, ball(0.06, "#2a2a2e", 5), 1.9 + (i % 3) * 0.1, 0.7, -1.5 + Math.floor(i / 3) * 0.12);   // the coal bin
  add(g, cyl(0.2, 0.18, 0.12, "#c9a86a", 10), -2.0, 0.66, -1.3); add(g, cyl(0.12, 0.1, 0.1, "#8a5a3c", 8), -2.4, 0.65, -1.2);   // cumin and chilli in bowls
  // benches and low tables, flatbreads and beer
  const guests: Fig[] = [];
  for (const [x, z] of [[-1.6, 0.8], [1.4, 1.0]] as [number, number][]) {
    add(g, box(1.3, 0.08, 0.8, C.wood), x, 0.6, z); for (const [dx, dz] of [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]]) add(g, box(0.07, 0.6, 0.07, C.woodDark), x + dx, 0.3, z + dz);
    for (let i = 0; i < 2; i++) add(g, cyl(0.13, 0.13, 0.02, DOUGH, 10), x - 0.3 + i * 0.5, 0.66, z - 0.15);
    for (let i = 0; i < 3; i++) add(g, cyl(0.04, 0.035, 0.18, "#5a7a3a", 8), x - 0.3 + i * 0.3, 0.73, z + 0.2);
    for (let i = 0; i < 2; i++) { const p = person(pick(["#c0392b", "#e0a52c", "#6a7fb0", "#2f5d3f"])); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.28, z + (i ? 0.95 : -0.95)); q.rotation.y = i ? Math.PI : 0; add(g, box(1.2, 0.06, 0.3, C.wood), x, 0.4, z + (i ? 0.95 : -0.95)); guests.push(q as Fig); }
  }
  add(g, cyl(0.05, 0.06, 2.4, C.woodDark, 6), 2.7, 1.2, 1.9); add(g, lantern(0.8), 2.7, 2.2, 1.9);
  g.userData.smoke = new THREE.Vector3(0, 1.3, -1.4);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(griller, "羊肉串, 多放孜然! Lamb skewers, extra cumin", 1.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    skewers.forEach((s, i) => { s.rotation.z = Math.floor(t * 0.5 + i * 0.3) * Math.PI + k * (Math.sin(t * 8 + i) * 0.6); s.position.y = 1.1 + k * Math.abs(Math.sin(t * 10 + i)) * 0.08; });
    embers.material = embers.material; (embers.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(k > 0.05 ? "#ff8a40" : "#552200");
    fan.rotation.x = Math.sin(t * (2 + k * 12)) * 0.5; const ug = upper(griller); if (ug) ug.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 10)) * 0.1;
    guests.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.06; u.rotation.x = 0.05 - k * 0.2; } const a = arms(p); if (a) a.right.rotation.x = -0.8 - k * Math.sin(Math.min(1, k * 2) * Math.PI) * 1.2; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 饼摊: a flatbread stall, dough balls, a rolling pin, a griddle of sesame bing and a filled roujiamo being split. */
export function bingStall(): P {
  const g = group();
  add(g, box(2.8, 0.85, 1.2, C.wood), 0, 0.42, 0);
  add(g, box(2.6, 0.03, 0.9, FLOUR), 0, 0.86, 0.05);
  for (let i = 0; i < 5; i++) add(g, ball(0.09, DOUGH, 7), -1.1 + i * 0.2, 0.96, 0.35).scale.y = 0.85;   // dough balls
  add(g, cyl(0.03, 0.03, 0.5, C.wood, 5), -0.6, 0.9, -0.15).rotation.z = Math.PI / 2;
  add(g, cyl(0.62, 0.62, 0.1, C.iron, 16), 0.7, 0.92, -0.1); add(g, cone(0.14, 0.18, "#ff7a3c", 6), 0.7, 0.45, 0.5);
  const breads = Array.from({ length: 4 }, (_, i) => { const b = add(g, cyl(0.16, 0.16, 0.05, i % 2 ? "#d9a05a" : "#e8b874", 12), 0.7 + Math.cos(i * 1.6) * 0.34, 1.0, -0.1 + Math.sin(i * 1.6) * 0.34); for (let k = 0; k < 6; k++) add(b, ball(0.012, FLOUR, 4), (rnd() - 0.5) * 0.2, 0.03, (rnd() - 0.5) * 0.2); return b; });
  const stack = Array.from({ length: 5 }, (_, i) => add(g, cyl(0.15, 0.15, 0.05, "#d9a05a", 12), -1.0, 0.9 + i * 0.05, -0.2));   // baked breads stacked
  add(g, ball(0.14, "#5a3a2a", 8), 1.4, 0.98, 0.35).scale.y = 0.6;                 // the pot of braised pork for roujiamo
  add(g, cyl(0.02, 0.02, 0.3, "#8a949c", 4), -0.2, 0.9, -0.3).rotation.z = Math.PI / 2;   // cleaver
  for (const x of [-1.25, 1.25]) add(g, cyl(0.05, 0.05, 2.2, C.woodDark, 5), x, 1.1, -0.5);
  add(g, box(3.0, 0.06, 1.7, "#c9a86a"), 0, 2.15, -0.1).rotation.x = 0.12;         // cloth awning
  const baker = add(g, person("#6a7fb0", { apron: true }), 0, 0, -1.0) as Fig;
  const buyers = [person("#c0392b"), person("#e9d7b8", { hat: true })].map((p, i) => { const q = add(g, p, -0.6 + i * 1.3, 0, 1.3); q.rotation.y = Math.PI; return q as Fig; });
  add(g, box(0.5, 0.7, 0.05, "#f3e6c8"), -1.45, 1.7, -0.3);                       // 饼 sign
  g.userData.steam = new THREE.Vector3(0.7, 1.2, -0.1);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(baker, "肉夹馍, 现烤现夹! Roujiamo, baked and filled to order", 1.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    breads.forEach((b, i) => { b.position.y = 1.0 + k * Math.max(0, Math.sin(t * 9 + i * 1.3)) * 0.2; b.rotation.y = k * Math.sin(t * 5 + i) * 0.6; b.rotation.x = k * Math.sin(t * 9 + i * 1.3) * 0.4; });
    stack.forEach((s, i) => { s.position.y = 0.9 + i * 0.05 + k * Math.abs(Math.sin(t * 10 + i)) * 0.02; });
    const ub = upper(baker); if (ub) ub.rotation.x = 0.25 + Math.sin(t * (2 + k * 8)) * 0.08 * (1 + k);
    buyers.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 1.1 + i) * 0.05 + k * Math.sin(t * 6 + i) * 0.12; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 麦田: the harvest. A wide field of wheat, three reapers with sickles, sheaves stooked, an ox cart being loaded; the wheat ripples when you click. */
export function harvestField(): P {
  const g = group();
  add(g, box(11, 0.18, 5.4, "#c9b16a"), 0, 0.09, 0);
  const stalks: THREE.Group[] = [];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 22; j++) {
    if (j > 15 && i > 3) continue;   // the corner already cut
    const x = -5.0 + j * 0.47, z = -2.4 + i * 0.68;
    const st = new THREE.Group(); st.position.set(x, 0.18, z); g.add(st); stalks.push(st);
    add(st, cyl(0.03, 0.03, 0.7 + rnd() * 0.2, "#e2c46a", 4), 0, 0.32, 0).rotation.z = (rnd() - 0.5) * 0.15;
    add(st, box(0.09, 0.22, 0.09, "#d9a441"), 0, 0.77, 0);
  }
  for (const [x, z] of [[3.4, 1.4], [4.4, 1.0], [4.0, 2.2]] as [number, number][]) { add(g, cone(0.45, 0.9, C.straw, 8), x, 0.63, z); add(g, new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 4, 10), mat("#a5813f")), x, 0.6, z).rotation.x = Math.PI / 2; }   // stooked sheaves
  const reapers = [add(g, person("#7a4a3a", { hat: true }), 2.6, 0.18, 0.2), add(g, person("#3f6b8f", { hat: true }), 3.2, 0.18, -1.4), add(g, person("#e9d7b8", { hat: true }), 1.6, 0.18, 2.0)] as Fig[];
  reapers.forEach((r, i) => { r.rotation.y = -1.2 + i * 0.4; add(arms(r)!.right, cyl(0.012, 0.012, 0.4, C.steel, 3), 0.02, -0.35, 0.15).rotation.z = 0.9; });
  // the ox cart at the field edge
  const cart = new THREE.Group(); cart.position.set(6.4, 0, 0.6); g.add(cart);
  add(cart, box(1.8, 0.3, 1.0, C.woodDark), 0, 0.7, 0); for (const x of [-0.6, 0.6]) for (const z of [-0.58, 0.58]) add(cart, cyl(0.35, 0.35, 0.08, C.woodDark, 10), x, 0.35, z).rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) add(cart, cone(0.35, 0.7, C.straw, 8), -0.5 + i * 0.35, 1.15, (i % 2) * 0.3 - 0.15);
  const ox = new THREE.Group(); ox.position.set(1.7, 0, 0); cart.add(ox);
  add(ox, ball(0.42, "#6f4a35", 9), 0, 0.7, 0).scale.set(1.5, 0.9, 1); add(ox, ball(0.24, "#6f4a35", 8), 0.7, 0.85, 0); for (const z of [-0.14, 0.14]) add(ox, cone(0.04, 0.2, "#e9dcb8", 5), 0.75, 1.1, z).rotation.z = -0.5;
  for (const [x, z] of [[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.2], [0.35, 0.2]]) add(ox, cyl(0.06, 0.06, 0.55, "#5a3a28", 5), x, 0.28, z);
  const driver = add(cart, person("#c0392b", { hat: true }), -0.9, 0.85, 0) as Fig; driver.scale.setScalar(0.85);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(g, "麦浪! The wheat is in", 1.8, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    stalks.forEach((st) => { st.rotation.z = Math.sin(t * 1.3 + st.position.x * 1.1 + st.position.z * 0.5) * 0.06 + k * Math.sin((1 - k) * 12 - st.position.x * 1.2) * 0.45; });
    reapers.forEach((r, i) => { const u = upper(r); if (u) { u.rotation.x = 0.4 + Math.sin(t * (1.2 + k * 4) + i) * 0.12 * (1 + k); } const a = arms(r); if (a) a.right.rotation.x = -0.6 + Math.sin(t * (1.2 + k * 4) + i) * 0.5; });
    ox.position.y = Math.abs(Math.sin(t * 1.6)) * 0.02; const ud = upper(driver); if (ud) ud.rotation.z = Math.sin(t * 1.6) * 0.05;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 胡同: a lane between grey courtyard walls, two gates, a bicycle, laundry, a grandmother shelling beans on a stool, neighbours talking. */
export function hutongLane(): P {
  const g = group();
  add(g, box(8.0, 0.1, 2.0, "#a8a39a"), 0, 0.05, 0);                              // the flagstone lane
  brickWall(g, 0, -1.3, 8.0, 0, 1.9); brickWall(g, 0, 1.3, 8.0, 0, 1.9);
  gate(g, -2.2, -1.3, 0); gate(g, 2.4, 1.3, Math.PI);
  for (const x of [-3.6, 3.6]) add(g, chineseRoof(1.6, 1.0, 0.3, C.tile, 0.1), x, 2.1, -1.4);   // roofs peeking over the walls
  add(g, chineseRoof(2.4, 1.2, 0.4, C.tile, 0.1), -0.2, 2.15, 1.4);
  add(g, tree("pagoda-tree"), 3.0, 0, -1.9);
  // a bicycle leaning on the wall
  const bike = new THREE.Group(); bike.position.set(0.6, 0, -1.0); bike.rotation.y = 0.1; g.add(bike);
  for (const x of [-0.45, 0.45]) add(bike, new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 5, 16), mat("#2a2a2e")), x, 0.3, 0);
  add(bike, box(0.8, 0.03, 0.03, "#2a2a2e"), 0, 0.45, 0).rotation.z = 0.15; add(bike, box(0.03, 0.4, 0.03, "#2a2a2e"), 0.1, 0.5, 0); add(bike, box(0.03, 0.03, 0.4, "#2a2a2e"), -0.4, 0.75, 0);
  // laundry across the lane
  const line = add(g, cyl(0.01, 0.01, 2.6, C.woodDark, 3), 1.5, 2.1, 0); line.rotation.x = Math.PI / 2;
  const cloths = ["#3f6b8f", "#f4f1ea", "#c0392b", "#e0a52c"].map((c, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.7, 1, 3), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 1 })); m.geometry.translate(0, -0.35, 0); m.position.set(1.5, 2.1, -1.0 + i * 0.6); m.rotation.y = Math.PI / 2; m.castShadow = true; g.add(m); return m; });
  // the grandmother on a stool with a basin of beans; two neighbours talking at the gate
  add(g, cyl(0.16, 0.14, 0.32, C.wood, 8), -1.2, 0.16, 0.7);
  const granny = person("#5a5a66"); (granny.userData as { sit?: () => void }).sit?.(); add(g, granny, -1.2, 0.05, 0.7).rotation.y = -0.4;
  add(g, cyl(0.28, 0.22, 0.14, "#e9e2d2", 10), -0.7, 0.07, 0.75); for (let i = 0; i < 8; i++) add(g, ball(0.03, "#8fc26a", 4), -0.7 + (rnd() - 0.5) * 0.3, 0.15, 0.75 + (rnd() - 0.5) * 0.3);
  const talkers = [add(g, person("#7a4a3a"), 2.4, 0, 0.5), add(g, person("#e9d7b8"), 3.0, 0, 0.2)] as Fig[]; talkers[0].rotation.y = 0.9; talkers[1].rotation.y = -2.2;
  const kid = add(g, person("#e0a52c"), -3.2, 0, 0.3) as Fig; kid.scale.setScalar(0.6);
  for (let i = 0; i < 3; i++) add(g, cyl(0.2, 0.17, 0.2, C.straw, 9), 3.3 + (i % 2) * 0.35, 0.1, -0.9 + Math.floor(i / 2) * 0.35);   // baskets by the door
  add(g, cyl(0.16, 0.16, 0.3, "#5c3a28", 9), -3.4, 0.15, -0.9);                       // a pickle crock
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(talkers[0], "吃了吗? Have you eaten?", 1.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    cloths.forEach((m, i) => { m.rotation.x = Math.sin(t * 2.2 + i * 1.3) * 0.25 * (1 + k) + 0.1; });
    talkers.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 1.2 + i * 2) * 0.06 + k * Math.sin(t * 6 + i) * 0.15; u.rotation.x = k * 0.15; } });
    const ug = upper(granny); if (ug) ug.rotation.x = 0.2 + Math.sin(t * 1.4) * 0.05;
    kid.position.x = -3.2 + Math.sin(t * 0.6) * 0.6; kid.rotation.y = Math.cos(t * 0.6) > 0 ? Math.PI / 2 : -Math.PI / 2; kid.position.y = k * Math.abs(Math.sin(t * 10)) * 0.1;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** a scholar tree (国槐), the tree of every Beijing lane: a tall trunk and a broad, loose crown */
function tree(_kind: "pagoda-tree"): P {
  const g = group();
  add(g, cyl(0.1, 0.14, 2.4, "#6b5a4a", 7), 0, 1.2, 0);
  for (let i = 0; i < 5; i++) { const a = i * 1.26; add(g, ball(0.55 + (i % 2) * 0.15, i % 2 ? "#6f9b57" : "#7fb069", 7), Math.cos(a) * 0.5, 2.6 + (i % 3) * 0.25, Math.sin(a) * 0.5); }
  return g;
}

/** 北方集市: carts and baskets in a stone street: cabbages stacked, radishes, potatoes, garlic braids, flour sacks, a pickle seller with crocks. */
export function northMarket(): P {
  const g = group();
  add(g, box(6.4, 0.1, 4.0, "#a8a39a"), 0, 0.05, 0);
  brickWall(g, 0, -1.9, 6.4, 0, 1.6);
  // a cabbage cart
  const cart = new THREE.Group(); cart.position.set(-1.8, 0, -0.6); g.add(cart);
  add(cart, box(1.6, 0.2, 1.0, C.woodDark), 0, 0.6, 0); for (const z of [-0.55, 0.55]) add(cart, cyl(0.32, 0.32, 0.07, C.woodDark, 10), 0.3, 0.32, z).rotation.x = Math.PI / 2; add(cart, box(1.0, 0.05, 0.05, C.woodDark), -1.2, 0.55, 0.3); add(cart, box(1.0, 0.05, 0.05, C.woodDark), -1.2, 0.55, -0.3);
  for (let i = 0; i < 9; i++) add(cart, ball(0.17, i % 2 ? "#c9d9a0" : "#a9c87a", 7), -0.5 + (i % 3) * 0.5, 0.85 + Math.floor(i / 3) * 0.05 + (i > 5 ? 0.25 : 0), -0.3 + Math.floor(i / 3) * 0.3).scale.set(1, 0.9, 1.2);
  // stall of radishes, potatoes and garlic braids
  add(g, box(2.2, 0.8, 1.0, C.wood), 0.8, 0.4, -0.9); for (const x of [-0.95, 0.95]) add(g, cyl(0.04, 0.04, 2.0, C.woodDark, 5), 0.8 + x, 1.0, -1.35); add(g, box(2.5, 0.06, 1.5, "#8a5a3c"), 0.8, 2.0, -1.0).rotation.x = 0.12;
  for (let i = 0; i < 6; i++) add(g, cyl(0.07, 0.05, 0.3, "#f4f1ea", 7), 0.0 + i * 0.16, 0.9, -0.7).rotation.z = 0.4;   // white radishes
  for (let i = 0; i < 8; i++) add(g, ball(0.08, "#c9a86a", 6), 1.0 + (i % 4) * 0.18, 0.88, -1.1 + Math.floor(i / 4) * 0.2).scale.y = 0.8;   // potatoes
  for (let i = 0; i < 2; i++) { add(g, cyl(0.02, 0.02, 0.9, C.woodDark, 3), 1.4 + i * 0.3, 1.5, -1.3); for (let k = 0; k < 6; k++) add(g, ball(0.06, "#f4ecdc", 6), 1.4 + i * 0.3, 1.9 - k * 0.14, -1.3 + (k % 2) * 0.05).scale.y = 0.85; }   // garlic braids
  // pickle crocks and flour sacks
  for (let i = 0; i < 3; i++) { add(g, cyl(0.24, 0.22, 0.5, "#5c3a28", 10), 2.4 + (i % 2) * 0.55, 0.25, 0.4 + Math.floor(i / 2) * 0.5); add(g, cyl(0.16, 0.18, 0.04, "#3c2a22", 10), 2.4 + (i % 2) * 0.55, 0.52, 0.4 + Math.floor(i / 2) * 0.5); }
  for (let i = 0; i < 3; i++) add(g, cyl(0.27, 0.3, 0.55, "#e6dcc4", 9), -2.7 + (i % 2) * 0.5, 0.28 + Math.floor(i / 2) * 0.5, 1.0 + (i % 2) * 0.2);
  const seller = add(g, person("#6a7fb0", { apron: true }), 0.8, 0, -1.6) as Fig;
  const carter = add(g, person("#7a4a3a", { hat: true }), -3.2, 0, -0.6) as Fig; carter.rotation.y = Math.PI / 2;
  const shoppers = [person("#c0392b"), person("#e9d7b8"), person("#2f5d3f")].map((p, i) => { const q = add(g, p, -0.6 + i * 1.1, 0, 0.9 + (i % 2) * 0.5); q.rotation.y = Math.PI + (i - 1) * 0.3; q.scale.setScalar(i === 2 ? 0.65 : 0.95); return q as Fig; });
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(seller, "大白菜, 冬储的! Winter cabbage, stock up!", 1.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const us = upper(seller); if (us) { us.rotation.z = Math.sin(t * 1.1) * 0.05 + k * Math.sin(t * 6) * 0.2; } const a = arms(seller); if (a) a.right.rotation.x = -0.4 - k * 1.6;
    shoppers.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 0.9 + i * 1.7) * 0.05 + k * Math.sin(t * 5 + i) * 0.1; });
    cart.rotation.z = k * Math.sin(t * 8) * 0.02; const uc = upper(carter); if (uc) uc.rotation.x = 0.2 + k * 0.2;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** quiet northern details: a coal stack, a pickle crock row, a persimmon string, a corn crib, a stone mill */
export function northDetail(kind: "coalStack" | "pickleCrocks" | "persimmonString" | "cornCrib" | "stoneMill" | "flourSacks" | "cabbageStack" | "garlicBraids" | "chilliStrings" | "noodleRack" | "wheatSheaves"): P {
  const g = group();
  switch (kind) {
    case "cabbageStack": {   // winter cabbages stacked against a wall
      for (let r = 0; r < 3; r++) for (let i = 0; i < 5 - r; i++) { const c = add(g, cyl(0.11, 0.15, 0.5, i % 2 ? "#b9d28a" : "#a9c87a", 7), -0.6 + i * 0.3 + r * 0.15, 0.14 + r * 0.24, (r % 2) * 0.1); c.rotation.z = Math.PI / 2; add(g, ball(0.12, "#e6ecc8", 6), -0.6 + i * 0.3 + r * 0.15 + 0.26, 0.14 + r * 0.24, (r % 2) * 0.1).scale.set(0.5, 1, 1); }
      break; }
    case "garlicBraids": { add(g, box(0.07, 1.9, 0.07, C.woodDark), 0, 0.95, 0); add(g, box(1.0, 0.05, 0.05, C.woodDark), 0, 1.85, 0); for (let i = 0; i < 3; i++) for (let k = 0; k < 7; k++) add(g, ball(0.07, k % 2 ? "#f3ece0" : "#e9dfd0", 6), -0.35 + i * 0.35, 1.75 - k * 0.14, (k % 2) * 0.05); break; }
    case "chilliStrings": { add(g, box(0.07, 1.9, 0.07, C.woodDark), 0, 0.95, 0); add(g, box(1.1, 0.05, 0.05, C.woodDark), 0, 1.85, 0); for (let i = 0; i < 4; i++) for (let k = 0; k < 8; k++) add(g, cone(0.035, 0.16, k % 3 ? C.red : "#8e2a22", 4), -0.42 + i * 0.28 + (k % 2) * 0.04, 1.75 - k * 0.15, (k % 2) * 0.05).rotation.z = Math.PI + (k % 2 ? 0.3 : -0.3); break; }
    case "noodleRack": {   // fresh noodles hung to dry on a bamboo frame
      for (const x of [-0.8, 0.8]) add(g, box(0.06, 1.8, 0.06, C.woodDark), x, 0.9, 0); add(g, cyl(0.03, 0.03, 1.7, "#c9a86a", 6), 0, 1.75, 0).rotation.z = Math.PI / 2;
      for (let i = 0; i < 14; i++) add(g, box(0.06, 1.2 + (i % 3) * 0.1, 0.012, "#f1e6c8"), -0.65 + i * 0.1, 1.12, (i % 2) * 0.02); break; }
    case "wheatSheaves": for (let i = 0; i < 5; i++) { const sh = add(g, cyl(0.16, 0.06, 0.9, C.gold, 7), (i - 2) * 0.32, 0.45, (i % 2) * 0.25); sh.rotation.z = (i - 2) * 0.12; add(g, cyl(0.2, 0.16, 0.1, "#d9b85a", 7), (i - 2) * 0.32 - (i - 2) * 0.05, 0.9, (i % 2) * 0.25); } break;
    case "coalStack": for (let i = 0; i < 10; i++) add(g, cyl(0.12, 0.12, 0.2, "#2a2a2e", 8), (i % 4) * 0.27 - 0.4, 0.1 + Math.floor(i / 4) * 0.21, (Math.floor(i / 4) % 2) * 0.1); break;
    case "pickleCrocks": for (let i = 0; i < 4; i++) { add(g, cyl(0.22, 0.2, 0.5, i % 2 ? "#5c3a28" : "#3c2a22", 10), (i - 1.5) * 0.5, 0.25, (i % 2) * 0.2); add(g, cyl(0.15, 0.17, 0.04, "#8a6a3a", 10), (i - 1.5) * 0.5, 0.52, (i % 2) * 0.2); } break;
    case "persimmonString": { add(g, box(0.07, 2.0, 0.07, C.woodDark), 0, 1.0, 0); add(g, box(1.2, 0.05, 0.05, C.woodDark), 0, 1.95, 0); for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) add(g, ball(0.06, "#e8823f", 6), -0.45 + i * 0.3, 1.85 - k * 0.14, (k % 2) * 0.04).scale.y = 0.8; break; }
    case "cornCrib": { for (const x of [-0.6, 0.6]) add(g, box(0.06, 1.2, 0.06, C.woodDark), x, 0.6, 0); add(g, box(1.3, 0.8, 0.5, "#c9a86a"), 0, 0.8, 0); for (let i = 0; i < 12; i++) add(g, cyl(0.05, 0.05, 0.22, C.gold, 6), -0.5 + (i % 6) * 0.2, 0.55 + Math.floor(i / 6) * 0.5, 0.28).rotation.x = Math.PI / 2; break; }
    case "stoneMill": { add(g, cyl(0.5, 0.5, 0.25, C.stone, 14), 0, 0.12, 0); add(g, cyl(0.42, 0.42, 0.2, C.stoneDark, 14), 0, 0.35, 0); add(g, cyl(0.02, 0.02, 0.8, C.woodDark, 4), 0.35, 0.5, 0).rotation.z = Math.PI / 2; add(g, cyl(0.45, 0.45, 0.03, FLOUR, 14), 0, 0.26, 0); break; }
    case "flourSacks": for (let i = 0; i < 3; i++) add(g, cyl(0.26, 0.3, 0.55, "#e6dcc4", 9), (i % 2) * 0.5, 0.28 + Math.floor(i / 2) * 0.5, (i % 2) * 0.15); break;
  }
  return g;
}

/** 大白菜: the winter cabbage store, a pyramid of cabbages under a quilt by the wall, a child counting them */
export function cabbagePile(): P {
  const g = group();
  add(g, northDetail("cabbageStack"), -0.3, 0, 0); add(g, northDetail("cabbageStack"), 0.9, 0, 0.5).rotation.y = 0.3;
  add(g, box(0.9, 0.5, 0.9, "#c9c2a8"), -1.4, 0.25, 0.3); for (let i = 0; i < 3; i++) add(g, cyl(0.11, 0.15, 0.5, "#b9d28a", 7), -1.5 + i * 0.16, 0.6, 0.2 + (i % 2) * 0.18).rotation.z = Math.PI / 2;   // a crate more
  const child = add(g, person("#e0a52c"), 0.4, 0, 1.4) as Fig; child.scale.setScalar(0.7); child.rotation.y = Math.PI;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(child, "冬储大白菜 A hundred cabbages for the winter!", 1.3, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); const u = upper(child); if (u) { u.rotation.z = Math.sin(t * 1.5) * 0.06 + k * Math.sin(t * 8) * 0.25; } const a = arms(child); if (a) a.right.rotation.x = -0.4 - k * 1.6; tickChildren(g)(t, dt); };
  return g;
}

/** 羊: a sheep pen at the edge of the wheat, fat woolly sheep and a boy with a switch */
export function sheepPen(): P {
  const g = group();
  const w = 3.6, d = 2.6;
  for (const [x, z, len, rot] of [[0, -d / 2, w, 0], [0, d / 2, w, 0], [-w / 2, 0, d, Math.PI / 2], [w / 2, 0, d, Math.PI / 2]] as [number, number, number, number][]) { const r = add(g, box(len, 0.06, 0.06, C.woodDark), x, 0.55, z); r.rotation.y = rot; const r2 = add(g, box(len, 0.06, 0.06, C.woodDark), x, 0.3, z); r2.rotation.y = rot; for (let i = 0; i <= 3; i++) add(g, box(0.07, 0.7, 0.07, C.woodDark), x + (rot ? 0 : -len / 2 + (i / 3) * len), 0.35, z + (rot ? -len / 2 + (i / 3) * len : 0)); }
  const sheep = [[-1.0, -0.4, 0.4], [0.3, 0.5, -0.8], [1.0, -0.6, 2.2], [-0.2, -0.9, 1.0]].map(([x, z, rot]) => { const sh = new THREE.Group(); sh.position.set(x, 0, z); sh.rotation.y = rot; g.add(sh); add(sh, ball(0.36, "#efe9dc", 9), 0, 0.5, 0).scale.set(1.3, 1, 1); add(sh, ball(0.16, "#3a3a3a", 7), 0.5, 0.62, 0); for (const dz of [-0.14, 0.14]) add(sh, ball(0.06, "#3a3a3a", 5), 0.55, 0.74, dz).scale.set(0.6, 1, 1.4); for (const [dx, dz] of [[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]]) add(sh, cyl(0.04, 0.04, 0.3, "#3a3a3a", 5), dx, 0.15, dz); return sh; });
  const boy = add(g, person("#4a5a7a", { hat: true }), 2.2, 0, 0.6) as Fig; boy.rotation.y = -Math.PI / 2;
  add(g, cyl(0.02, 0.02, 1.0, "#c9a86a", 4), 2.35, 0.8, 0.4).rotation.z = 0.5;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(boy, "咩~ Baa! Mutton for the winter pot", 1.7, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); sheep.forEach((sh, i) => { sh.position.y = k * Math.abs(Math.sin(t * 6 + i)) * 0.25; sh.children[1].rotation.z = Math.sin(t * 1.2 + i) * 0.15 - 0.2; }); tickChildren(g)(t, dt); };
  return g;
}

/** 小米高粱: a patch of millet and a row of sorghum, the north's older grains, heads heavy and nodding */
export function milletPatch(): P {
  const g = group();
  add(g, box(3.6, 0.08, 2.4, "#b9a67a"), 0, 0.04, 0);
  const heads: THREE.Object3D[] = [];
  for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { const x = -1.5 + i * 0.37, z = -0.9 + r * 0.45; add(g, cyl(0.015, 0.02, 0.9, "#a9b86a", 4), x, 0.5, z); const h = add(g, cyl(0.05, 0.03, 0.32, "#d9b85a", 6), x + 0.06, 1.05, z); h.rotation.z = -0.5; heads.push(h); }
  for (let i = 0; i < 6; i++) { const x = -1.4 + i * 0.56; add(g, cyl(0.025, 0.03, 1.8, "#8fa85a", 5), x, 0.9, 0.95); const h = add(g, ball(0.12, "#8e2a22", 7), x, 1.85, 0.95); h.scale.y = 1.5; heads.push(h); }   // sorghum
  add(g, cyl(0.28, 0.3, 0.5, "#e6dcc4", 9), 2.1, 0.25, -0.6); add(g, cyl(0.24, 0.24, 0.04, "#e8c95a", 12), 2.1, 0.52, -0.6);   // a sack of hulled millet
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(g, "小米粥 Millet porridge, the north's breakfast", 2.2, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); heads.forEach((h, i) => { h.rotation.x = Math.sin(t * 1.4 + i * 0.7) * 0.08 * (1 + k * 3); }); };
  return g;
}

/** 枣树: a jujube tree heavy with red dates, a mat of them drying underneath */
export function jujubeTree(): P {
  const g = group();
  add(g, cyl(0.12, 0.16, 1.6, "#5a4a3a", 7), 0, 0.8, 0);
  const crown = add(g, ball(1.05, "#6f9b57", 9), 0, 2.1, 0); crown.scale.y = 0.85;
  const dates: THREE.Object3D[] = [];
  for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, r = 0.7 + (i % 3) * 0.15; dates.push(add(g, ball(0.06, i % 4 ? "#a82a1e" : "#c9432e", 5), Math.cos(a) * r, 1.9 + Math.sin(i * 1.7) * 0.5, Math.sin(a) * r * 0.9)); }
  add(g, cyl(0.8, 0.8, 0.04, "#d9c28a", 14), 1.7, 0.02, 0.6); for (let i = 0; i < 24; i++) { const a = rnd() * Math.PI * 2, r = rnd() * 0.65; add(g, ball(0.05, i % 3 ? "#a82a1e" : "#7e1e14", 5), 1.7 + Math.cos(a) * r, 0.07, 0.6 + Math.sin(a) * r).scale.y = 0.8; }
  const falling: { m: THREE.Object3D; t: number }[] = [];
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); for (let i = 0; i < 6; i++) { const m = add(g, ball(0.06, "#c9432e", 5), (rnd() - 0.5) * 1.4, 1.9, (rnd() - 0.5) * 1.2); falling.push({ m, t: 0 }); } bubble(g, "红枣 Red dates: sweet, and in every winter soup", 3.2, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); crown.rotation.z = Math.sin(t * 0.9) * 0.02 + k * Math.sin(t * 9) * 0.05; dates.forEach((d, i) => { d.position.y += Math.sin(t * 2 + i) * 0.0008; }); for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.t += dt; f.m.position.y = Math.max(0.06, 1.9 - f.t * f.t * 4); if (f.t > 3) { g.remove(f.m); falling.splice(i, 1); } } };
  return g;
}

/** 大葱: a bed of big northern scallions, a bundle pulled and tied, the man eating one raw with a bing */
export function scallionBed(): P {
  const g = group();
  add(g, box(3.0, 0.1, 2.0, "#7a5a3a"), 0, 0.05, 0);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) { const x = -1.3 + i * 0.37, z = -0.6 + r * 0.6; add(g, cyl(0.035, 0.045, 0.5, "#f1ecdc", 6), x, 0.35, z); for (let k = 0; k < 3; k++) { const l = add(g, cyl(0.02, 0.03, 0.6, "#5f9a3c", 5), x, 0.85, z); l.rotation.set((k - 1) * 0.25, k * 2.1, 0); } }
  for (let i = 0; i < 5; i++) add(g, cyl(0.03, 0.04, 1.2, i % 2 ? "#f1ecdc" : "#6fae4f", 5), 1.9, 0.22, -0.5 + i * 0.12).rotation.z = Math.PI / 2 - 0.15;   // a bundle on the ground
  const man = add(g, person("#3f6b8f"), 2.0, 0, 0.9) as Fig; man.rotation.y = Math.PI * 0.8;
  add(g, cyl(0.02, 0.025, 0.5, "#6fae4f", 5), 2.1, 1.1, 1.1).rotation.x = -0.6;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(man, "大葱蘸酱 A raw scallion, bean paste, a bing. Lunch.", 1.7, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); const a = arms(man); if (a) a.right.rotation.x = -1.6 + k * Math.sin(t * 6) * 0.4; const u = upper(man); if (u) u.rotation.z = Math.sin(t * 0.8) * 0.04; tickChildren(g)(t, dt); };
  return g;
}

export const NORTH_PROPS: Record<string, () => P> = { dumplingHouse, noodleWorkshop, mantouKitchen, vinegarWorkshop, roastDuckShop, skewerCourtyard, bingStall, harvestField, hutongLane, northMarket, cabbagePile, sheepPen, milletPatch, jujubeTree, scallionBed };
