// Xinjiang: the oasis strip beyond the western mountains. Ochre walls, carved wood, grape trellises, poplars, a tonur,
// a long grill and a cauldron of polo. Uyghur-influenced food culture in this first version, with room for more.
import * as THREE from "three";
import { C, add, box, cyl, cone, ball, group, reaction, pick, tickChildren, smooth, mat, person, bubble, rnd, type P } from "./props";

type Fig = P & { userData: { upper?: THREE.Group; arms?: { left: THREE.Group; right: THREE.Group }; sit?: () => void } };
const upper = (p: THREE.Object3D) => (p.userData as { upper?: THREE.Group }).upper;
const arms = (p: THREE.Object3D) => (p.userData as { arms?: { left: THREE.Group; right: THREE.Group } }).arms;
const OCHRE = "#d2a86a", SAND = "#e0c894", TERRA = "#b8674a", TURQ = "#3f9aa3", BLUE = "#2f5f9a", CREAM = "#f3e9d2", WOOD = "#5a3a22", BREAD = "#d9a05a";

/** an oasis house: thick ochre walls, a flat roof with a low parapet, a carved wooden door painted turquoise, a shaded porch on wooden posts */
export function oasisHouse(w = 3.6, d = 2.8, h = 2.2, porch = true): P {
  const g = group();
  add(g, box(w, h, d, OCHRE), 0, h / 2, 0);
  add(g, box(w + 0.2, 0.18, d + 0.2, TERRA), 0, h + 0.05, 0);
  add(g, box(0.7, 1.4, 0.08, TURQ), 0, 0.72, d / 2 + 0.04);
  for (const x of [-w * 0.3, w * 0.3]) { add(g, box(0.5, 0.5, 0.06, BLUE), x, h * 0.6, d / 2 + 0.04); add(g, box(0.56, 0.06, 0.1, WOOD), x, h * 0.6 + 0.3, d / 2 + 0.06); }
  if (porch) {
    for (const x of [-w / 2 + 0.3, w / 2 - 0.3]) add(g, cyl(0.08, 0.09, h - 0.2, WOOD, 6), x, (h - 0.2) / 2, d / 2 + 1.2);
    add(g, box(w + 0.2, 0.1, 1.6, WOOD), 0, h - 0.15, d / 2 + 0.7);
    for (let i = 0; i < 6; i++) add(g, box(w + 0.1, 0.03, 0.08, "#7a5a3a"), 0, h - 0.08, d / 2 + 0.05 + i * 0.28);
  }
  return g;
}

/** a poplar: a slim tall column of leaves on a pale trunk, the tree of every oasis road */
export function poplar(s = 1): P {
  const g = group();
  add(g, cyl(0.06 * s, 0.1 * s, 3.2 * s, "#cfc6b4", 6), 0, 1.6 * s, 0);
  for (let i = 0; i < 4; i++) add(g, cone(0.4 * s * (1 - i * 0.15), 1.3 * s, i % 2 ? "#7fa85a" : "#6f9b57", 7), 0, 1.4 * s + i * 0.75 * s, 0);
  return g;
}

/** a grape trellis: posts, a lattice, vine leaves and heavy clusters hanging under it */
function trellis(g: THREE.Object3D, x: number, z: number, w: number, d: number, h = 2.3) {
  const t = new THREE.Group(); t.position.set(x, 0, z); g.add(t);
  for (const dx of [-w / 2, w / 2]) for (const dz of [-d / 2, d / 2]) add(t, cyl(0.06, 0.07, h, WOOD, 6), dx, h / 2, dz);
  for (let i = 0; i <= 4; i++) add(t, box(0.05, 0.05, d + 0.2, WOOD), -w / 2 + (i / 4) * w, h, 0);
  for (let i = 0; i <= 3; i++) add(t, box(w + 0.2, 0.05, 0.05, WOOD), 0, h, -d / 2 + (i / 3) * d);
  for (let i = 0; i < Math.floor(w * d * 2); i++) add(t, new THREE.Mesh(new THREE.CircleGeometry(0.22 + rnd() * 0.1, 6), mat(rnd() < 0.5 ? "#6f9b57" : "#8fb86a", { side: THREE.DoubleSide })), (rnd() - 0.5) * w, h + 0.06 + rnd() * 0.1, (rnd() - 0.5) * d).rotation.x = -Math.PI / 2 + (rnd() - 0.5) * 0.5;
  const grapes: THREE.Group[] = [];
  for (let i = 0; i < Math.floor(w * d * 0.8); i++) { const c = new THREE.Group(); c.position.set((rnd() - 0.5) * w * 0.9, h - 0.05, (rnd() - 0.5) * d * 0.9); t.add(c); for (let k = 0; k < 7; k++) add(c, ball(0.05, k % 3 ? "#5a3a6a" : "#7a4a8a", 5), (rnd() - 0.5) * 0.12, -0.05 - k * 0.04, (rnd() - 0.5) * 0.12); grapes.push(c); }
  return grapes;
}

/** 烤肉摊: a long grill under a grape trellis, skewers turning in the smoke, a cook fanning the coals, people on benches. */
export function kebabGrill(): P {
  const g = group();
  add(g, box(6.0, 0.15, 4.4, SAND), 0, 0.07, 0);
  add(g, box(6.0, 1.6, 0.3, OCHRE), 0, 0.8, -2.2);
  trellis(g, 0.6, 0.4, 4.6, 3.0);
  add(g, box(3.4, 0.7, 0.5, "#4a4a50"), -0.6, 0.6, -1.5); add(g, box(3.2, 0.06, 0.4, "#ff6a2a"), -0.6, 0.98, -1.5);
  const embers = add(g, box(3.0, 0.04, 0.3, "#ffb060"), -0.6, 1.0, -1.5);
  const skewers = Array.from({ length: 10 }, (_, i) => { const s = new THREE.Group(); s.position.set(-2.0 + i * 0.32, 1.1, -1.5); g.add(s); add(s, cyl(0.012, 0.012, 0.8, "#6a5a4a", 3), 0, 0, 0).rotation.x = Math.PI / 2; for (let k = 0; k < 4; k++) add(s, box(0.09, 0.08, 0.1, k === 1 ? "#e8c9a0" : "#a54a30"), 0, 0, -0.28 + k * 0.16); return s; });
  const griller = add(g, person("#3f4a5a", { apron: true }), -0.6, 0, -1.95) as Fig;
  const fan = add(arms(griller)!.right, box(0.24, 0.02, 0.2, C.straw), 0.05, -0.34, 0.08);
  add(g, cyl(0.16, 0.14, 0.1, "#c9a86a", 9), 1.4, 0.65, -1.5); add(g, cyl(0.12, 0.1, 0.1, "#b8462a", 8), 1.75, 0.65, -1.45);   // cumin, chilli
  for (let i = 0; i < 3; i++) add(g, cyl(0.18, 0.18, 0.04, BREAD, 12), 2.2, 0.62 + i * 0.045, -1.4);   // nan stacked
  for (let i = 0; i < 4; i++) add(g, ball(0.08, "#e6d2f0", 6), 1.3 + i * 0.16, 0.66, -1.75).scale.y = 0.6;   // onion rings
  const guests: Fig[] = [];
  for (const [x, z] of [[-1.5, 0.9], [1.6, 0.9]] as [number, number][]) {
    add(g, box(1.4, 0.08, 0.7, WOOD), x, 0.5, z); for (const [dx, dz] of [[-0.6, -0.25], [0.6, -0.25], [-0.6, 0.25], [0.6, 0.25]]) add(g, box(0.07, 0.5, 0.07, WOOD), x + dx, 0.25, z + dz);
    add(g, box(1.2, 0.02, 0.5, "#b8462a"), x, 0.55, z); for (let i = 0; i < 3; i++) add(g, cyl(0.05, 0.04, 0.08, TURQ, 8), x - 0.3 + i * 0.3, 0.6, z);
    add(g, cyl(0.12, 0.09, 0.14, "#8a6a3a", 8), x + 0.45, 0.62, z - 0.15);
    for (let i = 0; i < 2; i++) { const p = person(pick(["#c0392b", "#2f5f9a", "#e0a52c", "#3f9aa3"])); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.26, z + (i ? 0.85 : -0.85)); q.rotation.y = i ? Math.PI : 0; add(g, box(1.2, 0.06, 0.3, WOOD), x, 0.38, z + (i ? 0.85 : -0.85)); guests.push(q as Fig); }
  }
  g.userData.smoke = new THREE.Vector3(-0.6, 1.3, -1.5);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(griller, "Kawap! 孜然羊肉串", 1.6, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    skewers.forEach((s, i) => { s.rotation.z = Math.floor(t * 0.4 + i * 0.25) * Math.PI + k * Math.sin(t * 8 + i) * 0.6; s.position.y = 1.1 + k * Math.abs(Math.sin(t * 10 + i)) * 0.08; });
    (embers.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(k > 0.05 ? "#ff8a40" : "#552200");
    fan.rotation.x = Math.sin(t * (2 + k * 12)) * 0.5; const ug = upper(griller); if (ug) ug.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 10)) * 0.1;
    guests.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.06; u.rotation.x = 0.05 - k * 0.2; } });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 馕坑: a tonur bakery, the clay oven glowing, a baker slapping dough onto its wall, breads stacked in the window. */
export function naanBakery(): P {
  const g = group();
  add(g, oasisHouse(3.8, 2.8, 2.2), 0, 0, -1.0);
  add(g, cyl(0.7, 0.85, 1.1, "#b8896a", 12), 1.9, 0.55, 0.9);                    // the tonur
  add(g, cyl(0.45, 0.5, 0.12, "#8a5a3a", 12), 1.9, 1.15, 0.9);
  const glow = add(g, cyl(0.38, 0.38, 0.04, "#ff8a40", 12), 1.9, 1.12, 0.9);
  add(g, box(2.4, 0.85, 1.0, WOOD), -0.6, 0.42, 1.2); add(g, box(2.2, 0.03, 0.8, "#f7f1e3"), -0.6, 0.86, 1.2);
  for (let i = 0; i < 4; i++) add(g, ball(0.11, "#f0e2c4", 7), -1.5 + i * 0.28, 0.96, 1.0).scale.y = 0.8;   // dough balls
  const round = add(g, cyl(0.24, 0.24, 0.02, "#f0e2c4", 14), -0.3, 0.88, 1.35);          // a shaped nan with its stamped centre
  add(round, cyl(0.1, 0.1, 0.005, "#e0c894", 12), 0, 0.012, 0);
  const breads = Array.from({ length: 7 }, (_, i) => add(g, cyl(0.26, 0.26, 0.05, i % 2 ? BREAD : "#c98a4a", 14), 0.7, 0.9 + i * 0.05, 1.5));   // the stack for sale
  for (let i = 0; i < 4; i++) { const b = add(g, cyl(0.24, 0.24, 0.05, BREAD, 14), -1.6 + i * 0.5, 1.9, -0.05); b.rotation.x = Math.PI / 2 + 0.2; }   // breads on the wall shelf
  const baker = add(g, person("#f4f1ea", { apron: true }), 1.2, 0, 0.1) as Fig; baker.rotation.y = 0.6;
  const paddle = add(arms(baker)!.right, cyl(0.02, 0.02, 0.7, WOOD, 4), 0.02, -0.4, 0.15); paddle.rotation.x = 1.0; add(paddle, cyl(0.2, 0.2, 0.02, "#f0e2c4", 12), 0, -0.35, 0);
  const shaper = add(g, person("#2f5f9a", { apron: true }), -0.9, 0, 0.3) as Fig;
  const buyers = [person("#c0392b"), person("#e0a52c")].map((p, i) => { const q = add(g, p, 0.2 + i * 1.0, 0, 2.3); q.rotation.y = Math.PI; if (i) q.scale.setScalar(0.65); return q as Fig; });
  add(g, box(0.5, 0.7, 0.05, CREAM), -1.7, 1.6, 0.5);
  g.userData.smoke = new THREE.Vector3(1.9, 1.4, 0.9);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(baker, "Nan! 热馕出坑", 1.6, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    glow.scale.setScalar((0.9 + Math.sin(t * 8) * 0.1) * (1 + k * 0.3));
    const ub = upper(baker); if (ub) { ub.rotation.x = 0.3 * k * Math.sin(Math.min(1, k * 2) * Math.PI) + 0.1; } paddle.rotation.x = 1.0 - k * 1.2 * Math.sin(Math.min(1, k * 2) * Math.PI);
    const us = upper(shaper); if (us) us.rotation.x = 0.3 + Math.sin(t * (2 + k * 6)) * 0.1 * (1 + k); round.rotation.y = t * 0.5 * (1 + k * 6);
    breads.forEach((b, i) => { b.position.y = 0.9 + i * 0.05 + k * Math.abs(Math.sin(t * 9 + i)) * 0.02; });
    buyers.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 1.1 + i) * 0.05 + k * Math.sin(t * 6 + i) * 0.12; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 抓饭锅: the polo cauldron on a brick stove, carrots and lamb going in, bowls ready, everyone waiting with a spoon. */
export function poloKitchen(): P {
  const g = group();
  add(g, box(5.0, 0.15, 4.0, SAND), 0, 0.07, 0);
  add(g, box(5.0, 1.8, 0.3, OCHRE), 0, 0.9, -2.0); add(g, box(0.5, 0.5, 0.06, BLUE), -1.4, 1.2, -1.82);
  for (const x of [-2.2, 2.2]) add(g, cyl(0.07, 0.08, 2.4, WOOD, 6), x, 1.2, 1.6); add(g, box(5.2, 0.08, 4.0, WOOD), 0, 2.45, 0); for (let i = 0; i < 8; i++) add(g, box(5.0, 0.03, 0.08, "#7a5a3a"), 0, 2.5, -1.8 + i * 0.5);
  add(g, box(1.6, 0.8, 1.6, "#a5713f"), -1.2, 0.4, -0.6); add(g, cone(0.14, 0.18, "#ff7a3c", 6), -1.2, 0.35, 0.22);
  const kazan = add(g, ball(0.7, "#3a3a3f", 12), -1.2, 1.05, -0.6); kazan.scale.y = 0.6;
  add(g, cyl(0.58, 0.58, 0.06, "#e6b455", 14), -1.2, 1.3, -0.6);                   // rice with carrot showing
  for (let i = 0; i < 8; i++) add(g, box(0.12, 0.04, 0.04, "#e8823f"), -1.2 + (rnd() - 0.5) * 0.8, 1.34, -0.6 + (rnd() - 0.5) * 0.8).rotation.y = rnd() * 3;
  for (let i = 0; i < 3; i++) add(g, ball(0.09, "#8a4a30", 6), -1.2 + (rnd() - 0.5) * 0.6, 1.36, -0.6 + (rnd() - 0.5) * 0.6);
  const cook = add(g, person("#3f4a5a", { apron: true }), -1.2, 0, 0.7) as Fig; cook.rotation.y = Math.PI;
  const paddle = add(arms(cook)!.right, cyl(0.025, 0.025, 0.8, WOOD, 4), 0.02, -0.4, -0.1); paddle.rotation.x = -1.1;
  add(g, box(1.4, 0.8, 0.7, WOOD), 1.2, 0.4, -1.3); for (let i = 0; i < 8; i++) add(g, cyl(0.12, 0.09, 0.08, i % 2 ? TURQ : CREAM, 9), 0.7 + (i % 4) * 0.32, 0.86, -1.5 + Math.floor(i / 4) * 0.32);   // bowls stacked
  for (let i = 0; i < 6; i++) add(g, cyl(0.05, 0.05, 0.28, "#e8823f", 5), 1.9 + (i % 3) * 0.12, 0.62, 0.4 + Math.floor(i / 3) * 0.14).rotation.z = 0.9;   // carrots
  for (let i = 0; i < 4; i++) add(g, ball(0.09, "#e6d2f0", 6), 1.9 + (i % 2) * 0.2, 0.62, 0.9 + Math.floor(i / 2) * 0.2);   // onions
  add(g, cyl(0.24, 0.28, 0.5, "#e6dcc4", 9), 1.4, 0.25, 0.6);                        // sack of rice
  const waiting = [person("#c0392b"), person("#2f5f9a"), person("#e0a52c")].map((p, i) => { const q = add(g, p, 0.4 + i * 0.8, 0, 1.4 + (i % 2) * 0.4); q.rotation.y = Math.PI + 0.4; q.scale.setScalar(i === 1 ? 0.65 : 0.95); return q as Fig; });
  g.userData.steam = new THREE.Vector3(-1.2, 1.5, -0.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Polo! 抓饭好了", 1.6, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    paddle.rotation.z = Math.sin(t * (1.2 + k * 6)) * 0.4 * (0.4 + k); const uc = upper(cook); if (uc) uc.rotation.z = Math.sin(t * (1.2 + k * 6)) * 0.08 * (1 + k);
    kazan.rotation.y = t * 0.1;
    waiting.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 1.1 + i) * 0.05 + k * Math.sin(t * 6 + i) * 0.15; p.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.06; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 拉条子: a laghman shop, the cook swinging a rope of dough into noodles, bowls with tomato, pepper and lamb on top. */
export function laghmanShop(): P {
  const g = group();
  add(g, oasisHouse(4.0, 2.8, 2.2), 0, 0, -1.0);
  add(g, box(3.0, 0.85, 1.0, WOOD), -0.4, 0.42, 1.2); add(g, box(2.8, 0.03, 0.8, "#f7f1e3"), -0.4, 0.86, 1.2);
  for (let i = 0; i < 4; i++) add(g, cyl(0.03, 0.03, 0.6, "#f0e2c4", 5), -1.6 + i * 0.12, 0.9, 1.0 + (i % 2) * 0.15).rotation.z = Math.PI / 2;   // oiled ropes resting
  const puller = add(g, person("#3f4a5a", { apron: true }), -0.3, 0, 0.3) as Fig;
  const rope = new THREE.Group(); rope.position.set(-0.3, 1.25, 0.7); g.add(rope);
  const strands = Array.from({ length: 6 }, (_, i) => add(rope, cyl(0.012, 0.012, 1.1, "#f0e2c4", 4), (i - 2.5) * 0.035, 0, (i % 2) * 0.03)); strands.forEach((s) => { s.rotation.z = Math.PI / 2; });
  add(g, box(1.0, 0.8, 1.0, "#a5713f"), 1.9, 0.4, 0.3); add(g, cone(0.12, 0.16, "#ff7a3c", 6), 1.9, 0.35, 0.85);
  add(g, cyl(0.42, 0.36, 0.42, C.iron, 12), 1.9, 1.0, 0.3); add(g, cyl(0.38, 0.38, 0.03, "#e9dcb8", 12), 1.9, 1.2, 0.3);
  add(g, ball(0.3, C.iron, 10), 1.2, 1.0, 0.9).scale.y = 0.5; for (let i = 0; i < 5; i++) add(g, ball(0.05, i % 2 ? "#d94f3a" : "#6f9b57", 5), 1.2 + (rnd() - 0.5) * 0.4, 1.1, 0.9 + (rnd() - 0.5) * 0.4);   // the sauce wok
  const diners: Fig[] = [];
  add(g, box(1.5, 0.08, 0.9, WOOD), -1.4, 0.72, 3.0); for (const [dx, dz] of [[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]]) add(g, box(0.08, 0.7, 0.08, WOOD), -1.4 + dx, 0.35, 3.0 + dz);
  for (const x of [-1.85, -0.95]) { add(g, cyl(0.2, 0.15, 0.12, TURQ, 10), x, 0.82, 3.0); add(g, cyl(0.17, 0.17, 0.02, "#e9dcb8", 10), x, 0.89, 3.0); for (let i = 0; i < 4; i++) add(g, ball(0.035, i % 2 ? "#d94f3a" : "#6f9b57", 4), x + (rnd() - 0.5) * 0.2, 0.92, 3.0 + (rnd() - 0.5) * 0.2); }
  [-2.3, -0.5].forEach((x, i) => { const p = person(i ? "#e0a52c" : "#2f5f9a"); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.32, 3.0); q.rotation.y = i ? -Math.PI / 2 : Math.PI / 2; diners.push(q as Fig); });
  g.userData.steam = new THREE.Vector3(1.9, 1.45, 0.3);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(puller, "Leghmen! 拉条子", 1.6, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    rope.scale.x = 1 + k * (0.6 + Math.abs(Math.sin(t * 3)) * 0.9); rope.rotation.z = Math.sin(t * (1.5 + k * 4)) * 0.18 * (1 + k);
    strands.forEach((s, i) => { s.position.y = Math.sin(t * 6 + i) * 0.03 * (1 + k * 3); });
    const up = upper(puller); if (up) up.rotation.z = Math.sin(t * (1.5 + k * 4)) * 0.12 * (1 + k);
    const a = arms(puller); if (a) { a.left.rotation.x = -1.2; a.right.rotation.x = -1.2; a.left.rotation.z = 0.4 + k * 0.5; a.right.rotation.z = -0.4 - k * 0.5; }
    diners.forEach((p, i) => { const u = upper(p); if (u) u.rotation.x = 0.15 + Math.sin(t * 1.3 + i) * 0.05; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 巴扎: fabric awnings, melons and grapes in heaps, dried apricots and raisins in sacks, spices in trays, nan on a rack. */
export function oasisBazaar(): P {
  const g = group();
  add(g, box(7.0, 0.12, 4.4, SAND), 0, 0.06, 0);
  const awning = (x: number, z: number, col: string) => { for (const dx of [-1.1, 1.1]) add(g, cyl(0.05, 0.05, 2.2, WOOD, 5), x + dx, 1.1, z - 0.5); add(g, box(2.6, 0.05, 1.8, col), x, 2.15, z - 0.2).rotation.x = 0.12; add(g, box(2.2, 0.8, 1.0, WOOD), x, 0.4, z); };
  awning(-2.2, -0.6, "#b8462a"); awning(0.4, -0.6, TURQ); awning(3.0, -0.6, "#e0a52c");
  for (let i = 0; i < 6; i++) add(g, ball(0.22, i % 2 ? "#a9c87a" : "#e6d27a", 8), -3.0 + (i % 3) * 0.5, 0.98 + Math.floor(i / 3) * 0.2, -0.75 + Math.floor(i / 3) * 0.2).scale.set(1.3, 0.9, 1);   // melons
  for (let i = 0; i < 4; i++) { const c = new THREE.Group(); c.position.set(-1.6 + (i % 2) * 0.3, 1.0, -0.7 + Math.floor(i / 2) * 0.3); g.add(c); for (let k = 0; k < 8; k++) add(c, ball(0.045, k % 3 ? "#5a3a6a" : "#8fb86a", 5), (rnd() - 0.5) * 0.15, (rnd() - 0.5) * 0.1, (rnd() - 0.5) * 0.15); }   // grapes
  for (let i = 0; i < 4; i++) { add(g, cyl(0.22, 0.26, 0.4, "#e6dcc4", 9), -0.5 + i * 0.5, 1.0, -0.7); add(g, cyl(0.2, 0.2, 0.04, ["#e8a53f", "#8a4a30", "#c9a86a", "#d9c28a"][i], 9), -0.5 + i * 0.5, 1.22, -0.7); }   // dried apricots, raisins, walnuts, almonds
  for (let i = 0; i < 4; i++) { add(g, cyl(0.16, 0.14, 0.08, WOOD, 9), 2.2 + (i % 2) * 0.45, 0.84, -0.9 + Math.floor(i / 2) * 0.45); add(g, cone(0.12, 0.14, ["#b8462a", "#c9a86a", "#e8b874", "#5a4a3a"][i], 9), 2.2 + (i % 2) * 0.45, 0.95, -0.9 + Math.floor(i / 2) * 0.45); }   // spice cones: chilli, cumin, turmeric, black tea
  add(g, box(0.06, 1.6, 0.06, WOOD), 3.9, 0.8, -0.3); for (let i = 0; i < 5; i++) { const b = add(g, cyl(0.22, 0.22, 0.04, BREAD, 14), 3.9, 0.5 + i * 0.22, -0.3); b.rotation.x = Math.PI / 2; b.rotation.y = 0.3; }   // nan on a pole
  add(g, box(0.9, 0.5, 0.02, "#2f5f9a"), 3.5, 1.5, -1.05); add(g, box(0.9, 0.5, 0.02, "#b8462a"), -3.3, 1.5, -1.05);   // hanging textiles
  const sellers = [person("#2f5f9a", { apron: true }), person("#c0392b", { apron: true }), person("#e9d7b8", { apron: true })].map((p, i) => add(g, p, -2.2 + i * 2.6, 0, -1.3)) as Fig[];
  const shoppers = [person("#e0a52c"), person("#3f9aa3"), person("#7a4a3a")].map((p, i) => { const q = add(g, p, -1.4 + i * 1.6, 0, 1.2 + (i % 2) * 0.5); q.rotation.y = Math.PI + (i - 1) * 0.3; q.scale.setScalar(i === 1 ? 0.65 : 0.95); return q as Fig; });
  for (let i = 0; i < 3; i++) add(g, cyl(0.24, 0.2, 0.3, C.straw, 9), -3.2 + i * 0.5, 0.15, 1.5);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(sellers[0], "Tatliq qoghun! 哈密瓜, 甜!", 1.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    sellers.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 1.1 + i) * 0.05 + k * Math.sin(t * 6 + i) * 0.2; const a = arms(p); if (a && i === 0) a.right.rotation.x = -0.4 - k * 1.6; });
    shoppers.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 0.9 + i * 1.7) * 0.05 + k * Math.sin(t * 5 + i) * 0.1; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 葡萄架下: a courtyard under vines, a low table with tea, nan and fruit, the family sitting in the shade. Click: the grapes swing and a bowl is raised. */
export function grapeCourtyard(): P {
  const g = group();
  add(g, box(6.0, 0.15, 4.6, SAND), 0, 0.07, 0);
  add(g, box(6.0, 1.7, 0.3, OCHRE), 0, 0.85, -2.3); add(g, box(0.3, 1.7, 4.6, OCHRE), -3.0, 0.85, 0);
  const grapes = trellis(g, 0.3, 0, 5.0, 3.6, 2.4);
  add(g, box(2.2, 0.06, 1.4, WOOD), 0, 0.42, 0.2); for (const [dx, dz] of [[-1.0, -0.6], [1.0, -0.6], [-1.0, 0.6], [1.0, 0.6]]) add(g, box(0.08, 0.4, 0.08, WOOD), dx, 0.2, 0.2 + dz);
  add(g, box(2.0, 0.02, 1.2, "#b8462a"), 0, 0.46, 0.2);
  add(g, cyl(0.14, 0.11, 0.24, TURQ, 10), -0.6, 0.58, 0.0); add(g, cyl(0.03, 0.03, 0.18, TURQ, 5), -0.42, 0.66, 0.0).rotation.z = -0.8;   // teapot
  for (let i = 0; i < 4; i++) add(g, cyl(0.06, 0.05, 0.06, CREAM, 8), -0.2 + (i % 2) * 0.35, 0.49, -0.2 + Math.floor(i / 2) * 0.5);
  add(g, cyl(0.24, 0.24, 0.04, BREAD, 14), 0.5, 0.48, 0.2); add(g, ball(0.14, "#a9c87a", 8), 0.2, 0.55, 0.55).scale.y = 0.7;
  for (let i = 0; i < 6; i++) add(g, ball(0.03, i % 2 ? "#e8a53f" : "#8a4a30", 4), 0.8 + (i % 3) * 0.08, 0.5, 0.55 + Math.floor(i / 3) * 0.08);   // dried apricots and raisins
  const family: Fig[] = [];
  for (const [x, z, col, s] of [[-1.5, 0.3, "#c0392b", 1], [1.5, 0.2, "#2f5f9a", 1], [0, 1.5, "#e0a52c", 0.65], [-0.7, 1.4, "#3f9aa3", 0.6]] as [number, number, string, number][]) { const p = person(col); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.05, z); q.scale.setScalar(s); q.rotation.y = Math.atan2(0 - x, 0.2 - z); add(g, box(0.5, 0.06, 0.5, i2c(col)), x, 0.03, z); family.push(q as Fig); }
  add(g, poplar(0.8), 2.8, 0, -1.6);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(g, "Qeni, chay iching! 请喝茶", 2.6, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    grapes.forEach((c, i) => { c.rotation.z = Math.sin(t * 1.1 + i) * 0.05 + k * Math.sin(t * 6 + i) * 0.25; c.rotation.x = Math.cos(t * 0.9 + i) * 0.04 + k * Math.cos(t * 5 + i) * 0.2; });
    family.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.06; u.rotation.x = 0.05 - k * 0.15; } const a = arms(p); if (a && i === 0) a.right.rotation.x = -0.8 - k * Math.sin(Math.min(1, k * 2) * Math.PI) * 1.2; });
    tickChildren(g)(t, dt);
  };
  return g;
}
const i2c = (c: string) => (c === "#c0392b" ? "#8a2a22" : c === "#2f5f9a" ? "#e0a52c" : "#b8462a");   // cushion colours

/** 绿洲: an irrigation channel with poplars, a melon field and an apricot orchard beside dry ground; farmers cutting melons. */
export function oasisField(): P {
  const g = group();
  add(g, box(8.0, 0.12, 5.0, "#c9b78a"), 0, 0.06, 0);
  add(g, box(3.6, 0.14, 3.6, "#8fb86a"), -1.6, 0.14, 0.4);                       // the watered field
  add(g, box(8.0, 0.1, 0.5, "#8fc4c9"), 0, 0.22, -1.8); for (const z of [-2.1, -1.5]) add(g, box(8.0, 0.14, 0.12, "#b39a6a"), 0, 0.24, z);   // the channel with its banks
  for (let i = 0; i < 6; i++) add(g, poplar(0.7 + (i % 2) * 0.2), -3.4 + i * 1.35, 0.1, -2.5);
  const melons = Array.from({ length: 8 }, (_, i) => { const m = add(g, ball(0.22, i % 2 ? "#a9c87a" : "#c9d99a", 8), -3.0 + (i % 4) * 0.9, 0.38, -0.8 + Math.floor(i / 4) * 1.3); m.scale.set(1.3, 0.9, 1); return m; });
  for (let i = 0; i < 14; i++) add(g, new THREE.Mesh(new THREE.CircleGeometry(0.16, 6), mat("#7fa85a", { side: THREE.DoubleSide })), -3.2 + (i % 7) * 0.55, 0.3, -1.1 + Math.floor(i / 7) * 1.3).rotation.x = -Math.PI / 2;   // vine leaves
  for (let i = 0; i < 3; i++) { add(g, cyl(0.07, 0.09, 1.2, "#7a5a3a", 6), 1.6 + i * 1.2, 0.6, 0.8); add(g, ball(0.6, "#6f9b57", 8), 1.6 + i * 1.2, 1.4, 0.8); for (let k = 0; k < 8; k++) add(g, ball(0.045, "#e8a53f", 5), 1.6 + i * 1.2 + (rnd() - 0.5) * 0.9, 1.4 + (rnd() - 0.5) * 0.8, 0.8 + (rnd() - 0.5) * 0.9); }   // apricot trees
  const farmers = [add(g, person("#2f5f9a", { hat: true }), -0.4, 0.2, 0.2), add(g, person("#e9d7b8", { hat: true }), -2.4, 0.2, 1.6)] as Fig[];
  add(g, cyl(0.3, 0.24, 0.3, C.straw, 9), 0.4, 0.15, 1.8); for (let i = 0; i < 3; i++) add(g, ball(0.16, "#a9c87a", 7), 0.4 + (rnd() - 0.5) * 0.3, 0.42 + (i % 2) * 0.1, 1.8 + (rnd() - 0.5) * 0.3).scale.set(1.3, 0.9, 1);
  add(g, box(1.0, 0.2, 0.1, "#b39a6a"), -3.4, 0.28, -1.8); const gateBoard = add(g, box(0.1, 0.5, 0.5, WOOD), -3.4, 0.4, -1.8);   // the sluice gate
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(g, "Su! 水来了, the channel is open", 2.0, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    gateBoard.position.y = 0.4 + k * 0.4;
    farmers.forEach((p, i) => { const u = upper(p); if (u) u.rotation.x = 0.4 + Math.sin(t * (1.2 + k * 4) + i) * 0.12 * (1 + k); });
    melons.forEach((m, i) => { m.position.y = 0.38 + k * Math.abs(Math.sin(t * 8 + i)) * 0.05; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 茶馆: a chaikhana, a raised carpeted platform under a wooden canopy, teapots and bowls, bread and dried fruit, people talking. */
export function chaikhana(): P {
  const g = group();
  add(g, oasisHouse(3.8, 2.6, 2.2, false), 0, 0, -1.4);
  add(g, box(4.2, 0.45, 2.6, WOOD), 0, 0.22, 1.0); add(g, box(4.0, 0.03, 2.4, "#b8462a"), 0, 0.46, 1.0); add(g, box(4.0, 0.02, 0.6, "#2f5f9a"), 0, 0.47, 1.0);
  for (const x of [-1.9, 1.9]) add(g, cyl(0.07, 0.08, 2.2, WOOD, 6), x, 1.1, 2.2); add(g, box(4.4, 0.08, 2.8, WOOD), 0, 2.25, 1.0); for (let i = 0; i < 5; i++) add(g, box(4.2, 0.03, 0.08, "#7a5a3a"), 0, 2.3, -0.2 + i * 0.6);
  add(g, box(1.2, 0.06, 0.8, WOOD), 0, 0.72, 1.0); for (const [dx, dz] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) add(g, box(0.06, 0.24, 0.06, WOOD), dx, 0.6, 1.0 + dz);
  add(g, cyl(0.13, 0.1, 0.22, TURQ, 10), -0.3, 0.86, 1.0); add(g, cyl(0.13, 0.1, 0.22, CREAM, 10), 0.3, 0.86, 0.85);
  for (let i = 0; i < 4; i++) add(g, cyl(0.06, 0.05, 0.05, i % 2 ? TURQ : CREAM, 8), -0.4 + i * 0.27, 0.78, 1.3);
  add(g, cyl(0.2, 0.2, 0.04, BREAD, 14), 0.4, 0.77, 0.7); for (let i = 0; i < 6; i++) add(g, ball(0.03, i % 2 ? "#e8a53f" : "#c9a86a", 4), -0.5 + (i % 3) * 0.08, 0.78, 0.7 + Math.floor(i / 3) * 0.08);
  const guests: Fig[] = [];
  for (const [x, z, col] of [[-1.3, 0.6, "#c0392b"], [1.3, 0.6, "#2f5f9a"], [-1.2, 1.6, "#e0a52c"], [1.2, 1.6, "#3f9aa3"]] as [number, number, string][]) { const p = person(col); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.5, z); q.rotation.y = Math.atan2(0 - x, 1.0 - z); guests.push(q as Fig); }
  add(g, cyl(0.2, 0.22, 0.5, "#b87333", 10), 2.4, 0.7, 0.2); add(g, cyl(0.06, 0.06, 0.4, "#b87333", 6), 2.4, 1.1, 0.2);   // the samovar
  g.userData.steam = new THREE.Vector3(2.4, 1.35, 0.2);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(g, "Chay! 一碗茶, 慢慢聊", 2.5, 1600); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    guests.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.06; u.rotation.y = Math.sin(t * 0.5 + i) * 0.15 + k * 0.3; u.rotation.x = 0.05 - k * 0.15; } const a = arms(p); if (a && i % 2 === 0) a.right.rotation.x = -0.8 - k * Math.sin(Math.min(1, k * 2) * Math.PI) * 1.0; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 驿站: a caravan rest stop on the road below the mountains: a fire, two camels kneeling, sacks and bales, tea being poured. */
export function caravanStop(): P {
  const g = group();
  add(g, box(7.0, 0.12, 4.6, SAND), 0, 0.06, 0);
  add(g, cyl(0.5, 0.55, 0.15, C.stoneDark, 10), -0.6, 0.12, 0.6); const fire = add(g, cone(0.22, 0.5, "#ff7a3c", 6), -0.6, 0.4, 0.6); add(g, cone(0.12, 0.3, "#ffd070", 6), -0.6, 0.45, 0.6);
  add(g, cyl(0.14, 0.11, 0.22, "#b87333", 10), -0.1, 0.3, 0.9);
  const camel = (x: number, z: number, rot: number) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = rot; g.add(c); add(c, ball(0.5, "#c9a068", 9), 0, 0.5, 0).scale.set(1.6, 0.8, 0.9); add(c, ball(0.3, "#c9a068", 8), 0, 0.95, -0.05).scale.y = 1.1; add(c, cyl(0.12, 0.16, 0.9, "#c9a068", 6), 0.85, 0.75, 0).rotation.z = -0.6; add(c, ball(0.16, "#c9a068", 7), 1.15, 1.2, 0).scale.set(1.3, 0.8, 0.8); for (const dz of [-0.3, 0.3]) add(c, box(0.7, 0.25, 0.2, "#7a4a3a"), -0.2, 0.75, dz); return c; };
  const camels = [camel(2.0, -0.8, -0.4), camel(2.6, 1.2, 0.5)];
  for (let i = 0; i < 5; i++) add(g, cyl(0.26, 0.3, 0.5, ["#e6dcc4", "#b8462a", "#2f5f9a", "#e6dcc4", "#c9a86a"][i], 9), -2.6 + (i % 3) * 0.6, 0.25 + Math.floor(i / 3) * 0.5, -1.2 + (i % 3) * 0.2);   // sacks and bales
  add(g, box(0.8, 0.4, 0.5, "#8a5a3a"), -2.8, 0.2, 0.6); add(g, box(0.8, 0.4, 0.5, "#8a5a3a"), -2.7, 0.62, 0.65);   // tea bricks
  const travellers: Fig[] = [];
  for (const [x, z, col] of [[-1.4, 1.4, "#c0392b"], [0.3, 1.5, "#2f5f9a"], [-1.5, -0.3, "#e9d7b8"]] as [number, number, string][]) { const p = person(col, { hat: col === "#e9d7b8" }); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.05, z); q.rotation.y = Math.atan2(-0.6 - x, 0.6 - z); travellers.push(q as Fig); }
  const trader = add(g, person("#3f9aa3"), 1.0, 0, -1.6) as Fig; trader.rotation.y = 2.6;
  for (let i = 0; i < 3; i++) add(g, cyl(0.2, 0.2, 0.04, BREAD, 12), -0.2 + i * 0.05, 0.14 + i * 0.045, 1.6);
  add(g, poplar(0.9), 3.2, 0, -1.9); add(g, poplar(0.7), -3.3, 0, 1.9);
  g.userData.smoke = new THREE.Vector3(-0.6, 0.9, 0.6);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(trader, "Silk road: tea one way, grapes the other 丝路", 1.6, 1800); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    fire.scale.setScalar((0.85 + Math.sin(t * 9) * 0.15) * (1 + k * 0.5));
    camels.forEach((c, i) => { c.children[3].rotation.z = -0.6 + Math.sin(t * 0.7 + i) * 0.05 + k * Math.sin(t * 3 + i) * 0.15; });
    travellers.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.06; u.rotation.x = 0.05 - k * 0.15; } });
    const ut = upper(trader); if (ut) { ut.rotation.z = k * Math.sin(t * 5) * 0.2; } const a = arms(trader); if (a) a.right.rotation.x = -0.5 - k * 1.4;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** a dune: a low smooth mound of sand */
export function dune(r = 3, h = 0.8): P {
  const g = group();
  const m = add(g, ball(r, SAND, 12), 0, -r + h, 0); m.scale.set(1.6, 1, 1); m.material = smooth(SAND);
  return g;
}

/** 家常厨房: a Uyghur home kitchen: a woman rolling dough on a board on the porch, a kazan on a clay hearth, onions, tomatoes and a teapot. */
export function xjHomeKitchen(): P {
  const g = group();
  add(g, oasisHouse(4.2, 3.0, 2.2, true), 0, 0, -1.2);
  add(g, box(2.0, 0.7, 1.0, WOOD), -1.0, 0.35, 1.2); add(g, box(1.9, 0.04, 0.9, CREAM), -1.0, 0.72, 1.2);   // the board table
  for (let i = 0; i < 3; i++) add(g, ball(0.11, "#f0e2c4", 7), -1.6 + i * 0.3, 0.82, 1.0).scale.y = 0.75;   // dough balls
  add(g, cyl(0.03, 0.03, 0.5, "#c9a86a", 6), -0.7, 0.76, 1.35).rotation.z = Math.PI / 2;                    // the rolling pin
  add(g, cyl(0.22, 0.22, 0.02, "#f0e2c4", 14), -0.4, 0.75, 1.1);                                              // a rolled round
  add(g, box(1.1, 0.9, 1.1, TERRA), 1.4, 0.45, 1.0); const kazan = add(g, ball(0.5, "#3a3a3f", 12), 1.4, 0.95, 1.0); kazan.scale.y = 0.55;
  const fire = add(g, cone(0.14, 0.3, "#ff7a3c", 6), 1.4, 0.2, 1.62);
  for (let i = 0; i < 4; i++) add(g, ball(0.09, i % 2 ? "#d94f3a" : "#e6d2f0", 6), 0.3 + (i % 2) * 0.22, 0.09, 1.9 + Math.floor(i / 2) * 0.22);   // tomatoes and onions in a heap
  add(g, cyl(0.12, 0.09, 0.2, TURQ, 10), -1.7, 0.82, 1.5); add(g, cyl(0.02, 0.02, 0.2, TURQ, 5), -1.55, 0.95, 1.5).rotation.z = -0.8;   // teapot
  const cook = add(g, person("#c0392b", { apron: true }), -1.0, 0, 2.0) as Fig; cook.rotation.y = Math.PI;
  const child = add(g, person("#e0a52c"), 0.4, 0, 2.3) as Fig; child.scale.setScalar(0.7); child.rotation.y = 2.6;
  g.userData.steam = new THREE.Vector3(1.4, 1.25, 1.0);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(cook, "Dough first, then everything else 先揉面", 1.9, 1700); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    fire.scale.setScalar(0.85 + Math.sin(t * 9) * 0.15 + k * 0.4);
    const a = arms(cook); if (a) { a.left.rotation.x = -1.0 + Math.sin(t * 2.2) * 0.25 * (1 + k); a.right.rotation.x = -1.0 - Math.sin(t * 2.2) * 0.25 * (1 + k); }
    const u = upper(cook); if (u) u.rotation.x = 0.25 + Math.sin(t * 2.2) * 0.05;
    const uc = upper(child); if (uc) uc.rotation.z = Math.sin(t * 1.5) * 0.08 + k * Math.sin(t * 6) * 0.2;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 晚宴: the evening feast, a dastikhan: a long low table on carpets under a vine trellis, nan, polo, skewers and fruit, the whole family, two lanterns. */
export function eveningFeast(): P {
  const g = group();
  add(g, box(7.0, 0.06, 4.6, "#b8462a"), 0, 0.03, 0); add(g, box(6.2, 0.02, 3.8, "#2f5f9a"), 0, 0.07, 0); add(g, box(5.4, 0.02, 3.0, CREAM), 0, 0.09, 0);   // the carpets
  trellis(g, 0, 0, 6.6, 4.4, 2.5);
  add(g, box(4.4, 0.4, 1.2, WOOD), 0, 0.3, 0); add(g, box(4.3, 0.03, 1.1, "#e9dcb8"), 0, 0.52, 0);   // the low table and its cloth
  for (let i = 0; i < 4; i++) add(g, cyl(0.2, 0.2, 0.04, BREAD, 14), -1.6 + i * 1.05, 0.56, -0.3);     // nan
  add(g, cyl(0.34, 0.28, 0.1, TURQ, 12), 0.2, 0.58, 0.25); for (let i = 0; i < 5; i++) add(g, ball(0.07, i % 2 ? "#e8a53f" : "#d9a05a", 5), 0.2 + (rnd() - 0.5) * 0.4, 0.66, 0.25 + (rnd() - 0.5) * 0.3);   // the polo dish
  for (let i = 0; i < 5; i++) { const sk = add(g, cyl(0.012, 0.012, 0.7, "#6a5a4a", 3), -1.4 + i * 0.12, 0.6, 0.3); sk.rotation.z = Math.PI / 2; sk.rotation.y = 0.3; for (let k = 0; k < 3; k++) add(g, box(0.08, 0.07, 0.09, "#8a4a30"), -1.6 + i * 0.12 + k * 0.18, 0.6, 0.3 - k * 0.06); }   // skewers
  for (let i = 0; i < 3; i++) add(g, ball(0.16, i % 2 ? "#a9c87a" : "#e6d27a", 8), 1.4 + i * 0.3, 0.62, -0.25).scale.set(1.3, 0.9, 1);   // melon
  const guests: Fig[] = [];
  for (const [x, z, col] of [[-1.6, -1.3, "#c0392b"], [-0.4, -1.3, "#2f5f9a"], [0.8, -1.3, "#e0a52c"], [-1.2, 1.3, "#3f9aa3"], [0.2, 1.3, "#8a4a8a"], [1.5, 1.3, "#e9d7b8"]] as [number, number, string][]) {
    const p = person(col); (p.userData as { sit?: () => void }).sit?.(); const q = add(g, p, x, 0.12, z); q.rotation.y = z < 0 ? 0 : Math.PI; guests.push(q as Fig);
  }
  guests[2].scale.setScalar(0.75); guests[4].scale.setScalar(0.75);   // two children
  const lamps = [-2.4, 2.4].map((x) => { const l = new THREE.Group(); l.position.set(x, 2.4, 0); g.add(l); add(l, cyl(0.02, 0.02, 0.3, WOOD, 4), 0, -0.15, 0); const b = add(l, ball(0.16, "#ffb35a", 8), 0, -0.42, 0); b.scale.y = 1.3; return l; });
  add(g, poplar(0.8), 3.9, 0, -2.2);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(guests[1], "Everyone sits before anyone eats 一起开饭", 1.7, 1800); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    guests.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.06; u.rotation.y = Math.sin(t * 0.5 + i) * 0.12 + k * 0.25; u.rotation.x = 0.05 - k * 0.18; } const a = arms(p); if (a && i % 2 === 0) a.right.rotation.x = -0.7 - k * Math.sin(Math.min(1, k * 2) * Math.PI) * 1.0; });
    lamps.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.1 + i) * 0.06 * (1 + k * 2); });
    tickChildren(g)(t, dt);
  };
  return g;
}

export const XJ_PROPS: Record<string, () => P> = { kebabGrill, naanBakery, poloKitchen, laghmanShop, oasisBazaar, grapeCourtyard, oasisField, chaikhana, caravanStop, xjHomeKitchen, eveningFeast };
