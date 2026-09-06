/** Mediterranean props: Cycladic houses and blue domes, the Parthenon, a windmill, tavernas, a Spanish port and tapas bar, the Alhambra, flamenco, a Moroccan souk and square, tagines, a Dalmatian walled town and konoba. Text is Greek / Spanish / Arabic / Croatian + English. */
import * as THREE from "three";
import { mat, add, rnd, C, person, bubble, wear, tree, goat, mountain, type P } from "./props";
import { citrusTree, oliveTree, cypress } from "./props-italy";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const dome = (r: number, color: string, seg = 14) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate * 0.7); return k; } }; }
type Fig = P & { userData: { upper?: THREE.Group; walk?: (t: number) => void; sit?: () => void } };

export const MD = { white: "#f7f4ee", blue: "#2a5fb8", aegean: "#3f86c8", terracotta: "#c46a3a", stone: "#d9cbb0", stoneDark: "#a89b84", ochre: "#d9a86c", red: "#b8402e", wood: "#7a4a2a", green: "#3f7a3a", moroccoPink: "#d9a07a", moroccoRed: "#b85a3a", tile: "#2a8f8f" };

export function islander(shirt: string, opts: { hat?: boolean; scarf?: string; apron?: boolean; fez?: boolean; flat?: boolean } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.hat) wear(p, cyl(0.34, 0.36, 0.05, "#e9d7a8", 12), 0, 1.19, 0), wear(p, cyl(0.15, 0.17, 0.16, "#e9d7a8", 10), 0, 1.28, 0);
  if (opts.scarf) { wear(p, ball(0.19, opts.scarf, 8), 0, 1.25, -0.02).scale.set(1, 1.1, 1); wear(p, box(0.36, 0.28, 0.2, opts.scarf), 0, 1.0, -0.12); }
  if (opts.fez) { wear(p, cyl(0.12, 0.14, 0.18, "#8e2a22", 10), 0, 1.25, 0); }
  if (opts.flat) wear(p, cyl(0.2, 0.22, 0.06, "#2a2a2e", 10), 0, 1.21, 0);
  return p;
}

// ---------- Greece ----------

export function cycladicHouse(w = 2.6, d = 2.2, h = 2.0, opts: { dome?: boolean; storeys?: number } = {}): P {
  const g = group();
  const st = opts.storeys ?? 1, H = h * st;
  add(g, box(w, H, d, MD.white), 0, H / 2, 0);
  add(g, box(w + 0.1, 0.12, d + 0.1, MD.white), 0, H + 0.05, 0);
  if (opts.dome) add(g, dome(w * 0.3, MD.blue, 12), 0, H + 0.1, 0);
  add(g, box(0.7, 1.4, 0.06, MD.blue), -w / 4, 0.7, d / 2 + 0.02);
  for (let s = 0; s < st; s++) { add(g, box(0.6, 0.7, 0.06, MD.blue), w / 4, s * h + 1.3, d / 2 + 0.02); add(g, box(0.62, 0.04, 0.16, MD.white), w / 4, s * h + 0.93, d / 2 + 0.1); add(g, box(0.5, 0.12, 0.14, MD.terracotta), w / 4, s * h + 1.0, d / 2 + 0.12); add(g, ball(0.12, "#e0483a", 6), w / 4, s * h + 1.12, d / 2 + 0.12); }   // a pot of geraniums
  for (let k = 0; k < 4; k++) add(g, box(0.5, 0.14, 0.4, MD.white), w / 2 + 0.25, 0.07 + k * 0.14, d / 2 - 0.5 - k * 0.35);   // outside stair
  return g;
}

export function blueDomeChurch(): P {
  const g = group();
  add(g, box(3.2, 2.4, 3.2, MD.white), 0, 1.2, 0);
  add(g, cyl(1.3, 1.3, 0.5, MD.white, 14), 0, 2.65, 0);
  add(g, dome(1.4, MD.blue, 16), 0, 2.9, 0);
  add(g, box(0.06, 0.6, 0.06, MD.white), 0, 4.5, 0); add(g, box(0.3, 0.06, 0.06, MD.white), 0, 4.65, 0);
  add(g, box(1.4, 3.6, 0.6, MD.white), 2.2, 1.8, 0); for (let k = 0; k < 2; k++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.7, 10, 1, false, 0, Math.PI), mat(MD.aegean)), 2.2, 2.6 + k * 0.8, 0).rotation.set(Math.PI / 2, 0, Math.PI / 2);   // the bell tower with its arches
  add(g, ball(0.1, "#c9a86a", 6), 2.2, 2.55, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 12, 1, false, 0, Math.PI), mat("#4a3222")), 0, 0.9, 1.62).rotation.set(Math.PI / 2, 0, Math.PI / 2); add(g, box(1.0, 1.0, 0.1, "#4a3222"), 0, 0.5, 1.62);
  const bell = add(g, cone(0.12, 0.2, "#c9a86a", 8), 2.2, 3.35, 0);
  g.userData.tick = (t) => { bell.rotation.z = Math.sin(t * 3) * 0.15; };
  return g;
}

export function windmill(): P {
  const g = group();
  add(g, cyl(1.1, 1.3, 3.2, MD.white, 12), 0, 1.6, 0);
  add(g, cone(1.3, 0.9, C.straw, 12), 0, 3.65, 0);
  add(g, box(0.5, 0.9, 0.08, MD.blue), 0, 0.5, 1.28);
  const hub = new THREE.Group(); hub.position.set(0, 3.0, 1.35); g.add(hub);
  add(hub, cyl(0.08, 0.08, 0.6, MD.wood, 6), 0, 0, 0).rotation.x = Math.PI / 2;
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; add(hub, box(0.05, 2.2, 0.05, MD.wood), Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0.25).rotation.z = a + Math.PI / 2; const sail = add(hub, new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.7, 3), mat(MD.white, { side: THREE.DoubleSide })), Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0.3); sail.rotation.z = a + Math.PI / 2; sail.scale.z = 0.05; }
  g.userData.tick = (t, dt) => { hub.rotation.z -= dt * 0.6; void t; };
  return g;
}

/** The Parthenon on a rocky hill. */
export function parthenon(): P {
  const g = group();
  const rock = add(g, new THREE.Mesh(new THREE.CylinderGeometry(6.5, 8, 3.2, 10), mat("#b8a88a")), 0, 1.6, 0); rock.scale.z = 0.8;
  add(g, box(9, 0.5, 5.5, MD.stone), 0, 3.45, 0); add(g, box(8.4, 0.4, 5.0, MD.stone), 0, 3.9, 0);
  for (let i = 0; i < 8; i++) for (const sz of [-1, 1]) add(g, cyl(0.22, 0.26, 2.6, "#e6dcc8", 8), -3.5 + i, 5.4, sz * 2.0);
  for (let i = 1; i < 4; i++) for (const sx of [-1, 1]) add(g, cyl(0.22, 0.26, 2.6, "#e6dcc8", 8), sx * 3.5, 5.4, -2.0 + i);
  add(g, box(8.2, 0.5, 4.8, MD.stone), 0, 6.95, 0);
  for (const sz of [-1, 1]) { const ped = add(g, new THREE.Mesh(new THREE.ConeGeometry(4.6, 1.0, 3), mat(MD.stone)), 0, 7.7, sz * 2.3); ped.rotation.y = Math.PI / 6; ped.scale.z = 0.12; }
  add(g, box(7.8, 0.15, 4.4, "#d9cbb0"), 0, 7.9, 0).rotation.x = 0.0;
  for (let i = 0; i < 6; i++) add(g, cyl(0.2, 0.22, 1.2 + (i % 3) * 0.5, "#e6dcc8", 8), -6 + i * 1.5, 3.6 + (0.6 + (i % 3) * 0.25), -3.0 + (i % 2) * 0.5);   // broken columns
  for (let k = 0; k < 8; k++) add(g, box(1.2, 0.3, 0.5, "#c9bda3"), 4.5 + k * 0.32, 0.15 + k * 0.4, 3.6 - k * 0.35);   // steps up the rock
  add(g, tree("round", 0.7), -5.5, 0, 4.2); add(g, cypress(0.8), 6.2, 0, 4.0);
  return g;
}

/** A taverna: blue chairs, checked cloths, a charcoal grill, salads and ouzo, a bouzouki player under a vine. */
export function taverna(): P {
  const g = group();
  add(g, cycladicHouse(4.6, 3.0, 2.4, { storeys: 1 }), 0, 0, -1.4);
  add(g, box(2.4, 0.5, 0.06, MD.blue), 0, 2.2, 0.2); add(g, box(2.2, 0.3, 0.02, MD.white), 0, 2.2, 0.24);
  // pergola with a vine
  for (const x of [-2.2, 2.2]) for (const z of [0.4, 3.2]) add(g, cyl(0.05, 0.05, 2.4, MD.wood, 5), x, 1.2, z);
  for (let i = 0; i < 5; i++) add(g, box(4.6, 0.05, 0.05, MD.wood), 0, 2.4, 0.4 + i * 0.7);
  for (let i = 0; i < 14; i++) add(g, ball(0.22, "#6fa84a", 6), -2.2 + (i % 7) * 0.73, 2.5, 0.6 + Math.floor(i / 7) * 1.6).scale.set(1.3, 0.5, 1);
  const diners: Fig[] = [];
  const plates: THREE.Group[] = [];
  for (const [x, z] of [[-1.3, 1.6], [1.3, 1.6], [0, 3.0]]) {
    add(g, box(0.9, 0.05, 0.9, "#f4f1ea"), x, 0.78, z); add(g, box(0.9, 0.02, 0.9, "#2a5fb8"), x, 0.81, z); add(g, cyl(0.06, 0.08, 0.72, MD.wood, 6), x, 0.36, z);
    const pl = new THREE.Group(); pl.position.set(x, 0.83, z); g.add(pl); plates.push(pl);
    add(pl, cyl(0.2, 0.17, 0.04, "#f4f1ea", 10), 0, 0, 0); for (let k = 0; k < 5; k++) add(pl, ball(0.05, ["#c9302a", "#6fb06a", "#f4f1ea", "#2f3a2a", "#c9302a"][k], 5), Math.cos(k * 1.25) * 0.1, 0.06, Math.sin(k * 1.25) * 0.1);   // a horiatiki
    add(pl, box(0.12, 0.05, 0.08, "#f4f1ea"), 0, 0.1, 0);   // the feta slab on top
    add(pl, cyl(0.04, 0.03, 0.14, "#e8f1f4", 6), 0.28, 0.07, -0.2);   // ouzo
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.5; const ch = new THREE.Group(); ch.position.set(x + Math.cos(a) * 0.85, 0, z + Math.sin(a) * 0.85); ch.rotation.y = -a + Math.PI / 2; g.add(ch); add(ch, box(0.4, 0.04, 0.4, MD.blue), 0, 0.42, 0); add(ch, box(0.4, 0.5, 0.04, MD.blue), 0, 0.67, -0.18); for (const cx of [-0.17, 0.17]) for (const cz of [-0.17, 0.17]) add(ch, box(0.04, 0.42, 0.04, MD.blue), cx, 0.21, cz); const d = islander(pick(["#f4f1ea", "#3f6fb5", "#c0392b", "#e0a52c"]), { hat: i === 0 && x < 0 }); d.userData.sit?.(); add(g, d, x + Math.cos(a) * 0.85, 0.04, z + Math.sin(a) * 0.85).rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); diners.push(d); }
  }
  add(g, box(1.4, 0.8, 0.7, "#5a5a5a"), 3.2, 0.4, 0.4); add(g, box(1.3, 0.06, 0.6, "#2a2a2e"), 3.2, 0.83, 0.4); for (let i = 0; i < 4; i++) add(g, box(0.5, 0.06, 0.08, i % 2 ? "#c9573a" : "#a6603a"), 3.2, 0.9, 0.2 + i * 0.13);   // souvlaki on the grill
  const cook = islander("#f4f1ea", { apron: true }); add(g, cook, 3.2, 0, -0.5); cook.rotation.y = Math.PI;
  const player = islander("#2a2a2e", { flat: true }); player.userData.sit?.(); add(g, box(0.4, 0.42, 0.4, MD.blue), -3.0, 0.21, 2.4); add(g, player, -3.0, 0.04, 2.4); player.rotation.y = 1.0; add(player, ball(0.18, "#a37a4f", 8), 0.05, 0.75, 0.3).scale.set(0.7, 1, 0.4); add(player, box(0.04, 0.04, 0.6, "#4a3222"), 0.15, 0.95, 0.55);
  const cat = group(); add(cat, box(0.3, 0.14, 0.14, "#e0a52c"), 0, 0.1, 0); add(cat, box(0.14, 0.14, 0.14, "#e0a52c"), 0.2, 0.18, 0); for (const z of [-0.05, 0.05]) add(cat, cone(0.03, 0.06, "#e0a52c", 4), 0.2, 0.28, z); add(cat, cyl(0.02, 0.02, 0.3, "#e0a52c", 4), -0.2, 0.2, 0).rotation.z = 0.8; add(g, cat, 1.8, 0, 3.4); cat.rotation.y = 0.6;
  const notes: THREE.Mesh[] = []; for (let i = 0; i < 4; i++) { const n = ball(0.06, "#2a2a2e", 6); n.visible = false; g.add(n); notes.push(n); }
  g.userData.smoke = new THREE.Vector3(3.2, 1.2, 0.4);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(cook, "Καλή όρεξη! Enjoy!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    plates.forEach((p, i) => { p.position.y = 0.83 + k * Math.max(0, Math.sin(t * 10 + i * 1.3)) * 0.3; p.rotation.y += k * dt * 4; });
    diners.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = 0.15 + k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.z = Math.sin(t * 0.8 + i) * 0.06 + k * Math.sin(t * 7 + i) * 0.15; } });
    if (player.userData.upper) player.userData.upper.rotation.z = Math.sin(t * 2.4) * 0.05 + k * Math.sin(t * 10) * 0.15;
    if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25;
    cat.position.y = k * Math.abs(Math.sin(t * 9)) * 0.3;
    notes.forEach((n, i) => { const a = (t * 1.5 + i * 1.5) % 6; n.visible = k > 0.05; n.position.set(-3.0 + Math.sin(a) * 0.6, 1.5 + a * 0.35, 2.4 + Math.cos(a) * 0.4); n.scale.setScalar(Math.max(0.01, 1 - a / 6) * k * 2); });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** Goats on the rocks, a shepherd, feta in brine barrels and yogurt in clay pots. */
export function goatDairy(): P {
  const g = group();
  for (let i = 0; i < 5; i++) add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 + (i % 3) * 0.25, 0), mat("#b8b0a0")), -2.5 + i * 1.2, 0.2, -1.6 + (i % 2) * 0.6);
  const goats: P[] = [];
  for (let i = 0; i < 4; i++) { const gt = goat(); gt.position.set(-2.4 + i * 1.5, i % 2 ? 0.45 : 0, -1.2 + (i % 2) * 1.2); gt.rotation.y = i * 1.4; g.add(gt); goats.push(gt); }
  const shepherd = islander("#7a4a3a", { hat: true }); add(g, shepherd, 2.8, 0, -1.0); add(g, cyl(0.02, 0.02, 1.6, MD.wood, 4), 3.05, 0.8, -1.0);
  for (let i = 0; i < 2; i++) { add(g, cyl(0.32, 0.28, 0.5, MD.wood, 10), -1.6 + i * 0.9, 0.25, 1.6); add(g, cyl(0.28, 0.28, 0.06, "#e8f1f4", 10), -1.6 + i * 0.9, 0.52, 1.6); for (let k = 0; k < 3; k++) add(g, box(0.18, 0.12, 0.14, "#f7f4ee"), -1.6 + i * 0.9 + (k - 1) * 0.16, 0.6, 1.6 + (k % 2) * 0.1); }   // feta in brine
  for (let i = 0; i < 3; i++) { add(g, cyl(0.16, 0.12, 0.24, MD.terracotta, 8), 0.6 + i * 0.45, 0.12, 1.8); add(g, cyl(0.14, 0.14, 0.04, "#f7f4ee", 8), 0.6 + i * 0.45, 0.26, 1.8); }   // yogurt pots
  add(g, box(0.9, 0.04, 0.5, "#a37a4f"), 2.2, 0.55, 1.6); add(g, box(0.06, 0.55, 0.06, MD.wood), 2.2, 0.27, 1.6); add(g, ball(0.16, "#f7f4ee", 7), 2.2, 0.68, 1.6).scale.y = 1.3;   // straining bag
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(goats[1], "Μπεεε! Baa!", 1.1, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); goats.forEach((gt, i) => { gt.position.y = (i % 2 ? 0.45 : 0) + k * Math.abs(Math.sin(t * 11 + i)) * 0.35; gt.rotation.z = k * Math.sin(t * 14 + i) * 0.12; }); if (shepherd.userData.upper) shepherd.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** Tomatoes on stakes, cucumbers on a trellis, peppers, with a woman picking. */
export function saladGarden(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#7a5a3a"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) {
    const pl = new THREE.Group(); pl.position.set(-2.6 + j * 0.75, 0.2, -1.4 + i * 0.95); g.add(pl); plants.push(pl);
    if (i === 0) { add(pl, cyl(0.02, 0.02, 0.9, "#a37a4f", 4), 0, 0.45, 0); add(pl, ball(0.2, "#4f9a4a", 6), 0, 0.5, 0).scale.set(1, 1.3, 1); for (let k = 0; k < 3; k++) add(pl, ball(0.07, "#c9302a", 6), Math.cos(k * 2.1) * 0.14, 0.3 + k * 0.2, Math.sin(k * 2.1) * 0.14); }
    else if (i === 1) { add(pl, ball(0.2, "#6fa84a", 6), 0, 0.3, 0).scale.set(1.2, 0.8, 1.2); for (let k = 0; k < 2; k++) add(pl, cyl(0.05, 0.05, 0.3, "#3f7a3a", 6), (k - 0.5) * 0.2, 0.22, 0.1).rotation.z = 0.4; }
    else if (i === 2) { add(pl, ball(0.18, "#4f9a4a", 6), 0, 0.3, 0); for (let k = 0; k < 2; k++) add(pl, box(0.1, 0.16, 0.1, k ? "#f2c14e" : "#c9302a"), (k - 0.5) * 0.2, 0.3, 0.12); }
    else { add(pl, ball(0.16, "#8fc26a", 6), 0, 0.22, 0).scale.y = 0.7; add(pl, ball(0.06, "#9b59b6", 5), 0.1, 0.36, 0); }   // lettuce and a red onion
  }
  for (let i = 0; i < 3; i++) add(g, cyl(0.02, 0.02, 1.0, MD.wood, 4), -2.6 + i * 2.6, 0.7, -0.45); add(g, cyl(0.015, 0.015, 5.4, MD.wood, 3), 0, 1.15, -0.45).rotation.z = Math.PI / 2;
  const picker = islander("#e0a52c", { scarf: "#2a5fb8" }); add(g, picker, 3.4, 0, 0.5); picker.rotation.y = -1.4;
  const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 3.8, 0.15, 1.3); for (let k = 0; k < 6; k++) add(crate, ball(0.08, k % 2 ? "#c9302a" : "#6fa84a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(picker, "Ντομάτες! Tomatoes!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.6) * 1.2)) * 0.5; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); if (picker.userData.upper) picker.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

export function oliveGroveGr(): P {
  const g = group();
  const trees: P[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) trees.push(add(g, oliveTree(0.9 + rnd() * 0.25), -3.6 + j * 2.4, 0, -1.2 + i * 2.4));
  add(g, box(9.5, 0.3, 0.3, MD.stoneDark), 0, 0.15, 3.0);
  for (let i = 0; i < 2; i++) { add(g, box(2.2, 0.02, 1.4, "#3f4a3a"), -3.6 + i * 2.4, 0.03, 0.6); }   // nets under the trees
  add(g, cyl(0.6, 0.6, 0.3, "#8f857a", 12), 4.4, 0.15, 0.4); add(g, cyl(0.5, 0.5, 0.35, "#7a7268", 12), 4.4, 0.45, 0.4).rotation.z = Math.PI / 2;
  add(g, islander("#2f5d3f", { hat: true }), 4.2, 0, 1.6).rotation.y = -1.5; add(g, cyl(0.02, 0.02, 1.8, MD.wood, 4), 4.6, 0.9, 1.2).rotation.z = 0.5;
  for (let i = 0; i < 3; i++) add(g, cyl(0.12, 0.1, 0.36, "#c9b45a", 6), 4.9 + (i % 2) * 0.3, 0.18, 2.4 + Math.floor(i / 2) * 0.3);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "Ελιές! Olives!", 2.6, 1400); for (const tr of trees) { const fr = (tr.userData as { olives?: THREE.Mesh[] }).olives ?? []; for (let i = 0; i < 3; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.06, "#2f3a2a", 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) { c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; c.rotation.x = Math.cos(t * 21 + tr.position.z) * 0.05 * shake; } } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.06, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.061) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

// ---------- Spain ----------

export function puebloHouse(w = 3.0, d = 2.4, h = 2.3, opts: { storeys?: number } = {}): P {
  const g = group();
  const st = opts.storeys ?? 1, H = h * st;
  add(g, box(w, H, d, MD.white), 0, H / 2, 0);
  for (const sd of [-1, 1]) { const r = add(g, box(w + 0.5, 0.12, d / 2 + 0.4, MD.terracotta), 0, H + 0.35, sd * d / 4); r.rotation.x = -sd * 0.35; } add(g, box(w + 0.4, 0.05, 0.24, "#b35a30"), 0, H + 0.68, 0);
  add(g, box(0.8, 1.5, 0.06, MD.wood), -w / 4, 0.75, d / 2 + 0.02);
  for (let s = 0; s < st; s++) { add(g, box(0.7, 0.8, 0.06, "#6fb3c9"), w / 4, s * h + 1.35, d / 2 + 0.02); for (let k = 0; k < 4; k++) add(g, box(0.02, 0.8, 0.02, "#2a2a2e"), w / 4 - 0.3 + k * 0.2, s * h + 1.35, d / 2 + 0.06); add(g, box(0.8, 0.04, 0.2, "#2a2a2e"), w / 4, s * h + 0.95, d / 2 + 0.12); for (let k = 0; k < 3; k++) { add(g, cyl(0.07, 0.06, 0.12, MD.blue, 8), w / 4 - 0.25 + k * 0.25, s * h + 1.02, d / 2 + 0.14); add(g, ball(0.08, k % 2 ? "#e0483a" : "#e8558a", 6), w / 4 - 0.25 + k * 0.25, s * h + 1.14, d / 2 + 0.14); } }   // blue pots of geraniums
  return g;
}

/** The port: a stone quay, boats, nets, crates of fish and prawns, a fisherman mending. */
export function fishingPort(): P {
  const g = group();
  add(g, box(8, 0.5, 2.4, MD.stoneDark), 0, 0.25, 0);
  add(g, box(1.6, 0.5, 5, MD.stoneDark), 3.2, 0.25, -2.5);   // the mole
  add(g, cyl(0.35, 0.45, 2.4, MD.white, 10), 3.2, 1.7, -4.4); add(g, cyl(0.38, 0.38, 0.4, MD.red, 10), 3.2, 2.5, -4.4); add(g, cyl(0.38, 0.38, 0.4, MD.red, 10), 3.2, 1.7, -4.4);
  const boats: P[] = [];
  for (let i = 0; i < 2; i++) { const b = group(); add(b, box(2.2, 0.45, 0.9, i ? MD.blue : MD.white), 0, 0.22, 0); add(b, box(2.2, 0.08, 0.96, i ? MD.white : MD.blue), 0, 0.46, 0); add(b, cyl(0.03, 0.03, 1.8, "#c9a37a", 4), 0.2, 1.3, 0); add(b, box(0.2, 0.3, 0.02, MD.red), 0.32, 2.1, 0); b.position.set(-2.4 + i * 3.6, 0.05, -2.2); b.rotation.y = 0.2 - i * 0.4; g.add(b); boats.push(b); }
  for (let i = 0; i < 4; i++) add(g, cyl(0.03, 0.03, 0.9, MD.wood, 4), -3.6 + i * 1.6, 0.9, -1.0);
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2, 6, 3), new THREE.MeshStandardMaterial({ color: "#c9b45a", wireframe: true })), -2.8, 1.0, -1.0);   // nets drying
  for (let i = 0; i < 3; i++) { add(g, box(0.9, 0.3, 0.6, "#a37a4f"), -2.6 + i * 1.3, 0.65, 0.5); add(g, box(0.86, 0.06, 0.56, "#e8f1f4"), -2.6 + i * 1.3, 0.83, 0.5); for (let k = 0; k < 3; k++) { if (i === 1) { const s = add(g, ball(0.06, "#f08a6a", 6), -2.6 + i * 1.3 - 0.25 + k * 0.25, 0.9, 0.5); s.scale.set(1.6, 0.6, 0.8); } else { const f = add(g, ball(0.09, i ? "#7f93a6" : "#b3bfc9", 7), -2.6 + i * 1.3 - 0.25 + k * 0.25, 0.9, 0.5 + (k % 2) * 0.12); f.scale.set(1.8, 0.5, 1); } } }
  const fisher = islander("#3f6fb5", { hat: true }); fisher.userData.sit?.(); add(g, box(0.4, 0.4, 0.4, MD.wood), 2.2, 0.7, 0.6); add(g, fisher, 2.2, 0.52, 0.6); fisher.rotation.y = 0.6;
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6, 4, 2), new THREE.MeshStandardMaterial({ color: "#c9b45a", wireframe: true })), 2.5, 0.9, 1.1).rotation.x = -0.6;
  const gull = add(g, ball(0.1, "#f4f1ea", 7), 3.2, 2.85, -4.4); gull.scale.set(1.3, 0.7, 1);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(fisher, "¡Pescado fresco! Fresh fish!", 1.4, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); boats.forEach((b, i) => { b.position.y = 0.05 + Math.sin(t * 1.2 + i) * 0.04 + k * Math.abs(Math.sin(t * 7 + i)) * 0.3; b.rotation.z = Math.sin(t * 0.9 + i) * 0.04; }); if (fisher.userData.upper) fisher.userData.upper.rotation.x = 0.2 + Math.sin(t * (1.5 + k * 8)) * 0.08; gull.position.y = 2.85 + k * Math.abs(Math.sin(t * 6)) * 1.2; };
  return g;
}

/** A tapas bar: the plancha, a great paella pan, jamón hanging, sherry barrels, azulejo tiles, people at the bar. */
export function tapasBar(): P {
  const g = group();
  add(g, puebloHouse(4.6, 3.0, 2.4), 0, 0, -1.4);
  for (let i = 0; i < 6; i++) add(g, box(0.5, 0.5, 0.04, i % 2 ? MD.blue : "#f2c14e"), -1.5 + i * 0.6, 0.45, 0.12);   // tiles along the base
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(2.0, 0.3, 0.02, "#f2c14e"), 0, 2.15, 0.24);
  add(g, box(4.0, 0.9, 0.8, MD.wood), 0, 0.45, 1.2); add(g, box(4.1, 0.06, 0.9, "#c9a37a"), 0, 0.93, 1.2);
  const pan = new THREE.Group(); pan.position.set(-1.1, 0.96, 1.2); g.add(pan);
  add(pan, cyl(0.62, 0.55, 0.1, "#5a5a5a", 16), 0, 0, 0); add(pan, cyl(0.56, 0.56, 0.04, "#e0b34c", 16), 0, 0.06, 0);
  for (let k = 0; k < 6; k++) { add(pan, ball(0.07, "#f08a6a", 6), Math.cos(k * 1.05) * 0.35, 0.1, Math.sin(k * 1.05) * 0.35).scale.set(1.5, 0.6, 0.8); } for (let k = 0; k < 4; k++) add(pan, ball(0.06, "#3a3a3d", 6), Math.cos(k * 1.6 + 0.5) * 0.2, 0.1, Math.sin(k * 1.6 + 0.5) * 0.2).scale.y = 0.5; add(pan, cyl(0.03, 0.03, 0.4, "#5a5a5a", 5), 0.75, 0.02, 0).rotation.z = Math.PI / 2; add(pan, box(0.12, 0.02, 0.02, "#c9302a"), 0, 0.14, 0);
  add(g, box(1.2, 0.06, 0.6, "#2a2a2e"), 0.9, 0.98, 1.2); for (let k = 0; k < 3; k++) { add(g, ball(0.1, "#f4f1ea", 7), 0.6 + k * 0.3, 1.04, 1.1).scale.set(1.6, 0.5, 1); add(g, box(0.22, 0.05, 0.14, "#c9573a"), 0.6 + k * 0.3, 1.04, 1.4); }   // fish and chorizo on the plancha
  for (let k = 0; k < 3; k++) { add(g, cyl(0.1, 0.09, 0.03, "#f4f1ea", 8), 1.6 + (k % 2) * 0.25, 0.97, 1.0 + Math.floor(k / 2) * 0.25); add(g, ball(0.05, ["#6f9b57", "#c9302a", "#e0a52c"][k], 5), 1.6 + (k % 2) * 0.25, 1.02, 1.0 + Math.floor(k / 2) * 0.25); }   // tapas
  for (let i = 0; i < 3; i++) { const j = add(g, ball(0.16, "#8a3a2a", 8), -1.6 + i * 0.7, 1.75, -0.1); j.scale.set(1, 1.8, 0.6); add(g, cyl(0.02, 0.02, 0.3, "#c9cfd6", 4), -1.6 + i * 0.7, 2.1, -0.1); }   // jamones hanging
  for (let i = 0; i < 2; i++) add(g, cyl(0.28, 0.28, 0.6, MD.wood, 10), 2.9, 0.3 + i * 0.6, 0.6 + i * 0.05).rotation.z = Math.PI / 2;
  add(g, cyl(0.06, 0.05, 0.16, "#e0b34c", 6), 2.0, 1.02, 0.6); add(g, cyl(0.06, 0.05, 0.16, "#c9302a", 6), 2.2, 1.02, 0.7);
  const bartender = islander("#f4f1ea", { apron: true }); add(g, bartender, 0.2, 0, 0.3); bartender.rotation.y = 0.1;
  const drinkers: Fig[] = [];
  for (const x of [-1.2, 0.3, 1.6]) { add(g, cyl(0.18, 0.18, 0.6, MD.wood, 8), x, 0.3, 2.1); const p = islander(pick(["#c0392b", "#3f6fb5", "#2a2a2e", "#e0a52c"]), { flat: x > 1 }); p.userData.sit?.(); add(g, p, x, 0.22, 2.1).rotation.y = Math.PI; drinkers.push(p); }
  g.userData.steam = new THREE.Vector3(-1.1, 1.3, 1.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(bartender, "¡Buen provecho! Enjoy!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pan.rotation.y += k * dt * 3; pan.position.y = 0.96 + k * Math.abs(Math.sin(t * 8)) * 0.25; drinkers.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = -k * 0.4 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.z = Math.sin(t * 0.9 + i) * 0.05 + k * Math.sin(t * 7 + i) * 0.15; } }); if (bartender.userData.upper) bartender.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** The Alhambra: a red-walled palace with horseshoe arches over a long reflecting pool, cypresses. */
export function alhambra(): P {
  const g = group();
  add(g, box(12, 3.4, 5, "#b86a4a"), 0, 1.7, -2.5);
  add(g, box(3, 5.5, 3, "#b86a4a"), -4.5, 2.75, -3); add(g, box(3.2, 0.3, 3.2, "#8a4a3a"), -4.5, 5.6, -3);
  add(g, box(2.4, 4.6, 2.4, "#b86a4a"), 5, 2.3, -3.2); add(g, box(2.6, 0.3, 2.6, "#8a4a3a"), 5, 4.75, -3.2);
  for (let i = 0; i < 7; i++) { add(g, cyl(0.12, 0.14, 1.8, "#f3e9d2", 8), -3.6 + i * 1.2, 0.9, 0.2); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.3, 12, 1, false, 0, Math.PI), mat("#f3e9d2")), -3.0 + i * 1.2, 1.9, 0.2).rotation.set(Math.PI / 2, 0, Math.PI / 2); }
  add(g, box(9, 0.5, 0.4, "#f3e9d2"), 0, 2.45, 0.2); for (let i = 0; i < 12; i++) add(g, box(0.4, 0.4, 0.04, i % 2 ? MD.tile : "#e0b34c"), -3.5 + i * 0.64, 2.45, 0.42);
  add(g, box(2.4, 0.3, 7, MD.stone), 0, 0.15, 4); add(g, box(2.0, 0.1, 6.6, "#6fc0cf"), 0, 0.32, 4);
  for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) add(g, cypress(0.7 + (i % 2) * 0.2), sd * 1.9, 0, 1.2 + i * 1.8);
  for (const sd of [-1, 1]) { add(g, box(4, 0.2, 7, "#8fbf7a"), sd * 4.2, 0.1, 4); for (let k = 0; k < 6; k++) { add(g, cyl(0.02, 0.02, 0.3, "#3f7a3a", 4), sd * 4.2 + (k % 3 - 1) * 1.0, 0.35, 2 + Math.floor(k / 3) * 3); add(g, ball(0.1, k % 2 ? "#e8558a" : "#f2c14e", 6), sd * 4.2 + (k % 3 - 1) * 1.0, 0.5, 2 + Math.floor(k / 3) * 3); } }
  add(g, cyl(0.6, 0.7, 0.4, MD.stone, 12), 0, 0.5, 7.5); add(g, cyl(0.5, 0.5, 0.1, "#6fc0cf", 12), 0, 0.72, 7.5); add(g, cyl(0.1, 0.1, 0.8, MD.stone, 8), 0, 1.0, 7.5); add(g, cyl(0.3, 0.2, 0.1, MD.stone, 12), 0, 1.4, 7.5);
  add(g, islander("#f4f1ea", { hat: true }), -1.4, 0, 6.8).rotation.y = 1.0;
  return g;
}

/** A flamenco pair with a guitarist: she dances, he claps, when clicked. */
export function flamenco(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(2.6, 20), mat("#c9b98a")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  const dancer = islander("#c0392b"); const skirt = add(dancer, cone(0.5, 0.7, "#c0392b", 14), 0, 0.42, 0); skirt.rotation.x = Math.PI; for (let k = 0; k < 8; k++) add(skirt, ball(0.05, "#f4f1ea", 4), Math.cos(k * 0.785) * 0.42, 0.25, Math.sin(k * 0.785) * 0.42); wear(dancer, ball(0.08, "#c9302a", 6), 0.14, 1.32, 0.02);   // a rose in her hair
  add(g, dancer, 0, 0, 0.4);
  const clapper = islander("#2a2a2e", { flat: true }); add(g, clapper, 1.4, 0, -0.6); clapper.rotation.y = -0.6;
  const guitarist = islander("#f4f1ea", { flat: true }); guitarist.userData.sit?.(); add(g, box(0.4, 0.42, 0.4, MD.wood), -1.5, 0.21, -0.6); add(g, guitarist, -1.5, 0.04, -0.6); guitarist.rotation.y = 0.8; add(guitarist, ball(0.2, "#a37a4f", 8), 0.05, 0.75, 0.3).scale.set(0.8, 1, 0.45); add(guitarist, box(0.04, 0.04, 0.6, "#4a3222"), 0.15, 0.95, 0.55);
  const notes: THREE.Mesh[] = []; for (let i = 0; i < 4; i++) { const n = ball(0.06, "#2a2a2e", 6); n.visible = false; g.add(n); notes.push(n); }
  const re = reaction(0.35);
  g.userData.poke = () => { re.poke(); bubble(clapper, "¡Olé!", 1.6, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    dancer.rotation.y += dt * k * 4; skirt.scale.setScalar(1 + k * Math.abs(Math.sin(t * 6)) * 0.5); if (dancer.userData.upper) { dancer.userData.upper.rotation.z = k * Math.sin(t * 6) * 0.3; dancer.userData.upper.rotation.x = -k * 0.2; } dancer.position.y = k * Math.abs(Math.sin(t * 12)) * 0.12;
    if (clapper.userData.upper) clapper.userData.upper.rotation.z = k * Math.sin(t * 12) * 0.12;
    if (guitarist.userData.upper) guitarist.userData.upper.rotation.z = Math.sin(t * 2) * 0.04 + k * Math.sin(t * 10) * 0.12;
    notes.forEach((n, i) => { const a = (t * 1.5 + i * 1.5) % 6; n.visible = k > 0.05; n.position.set(-1.5 + Math.sin(a) * 0.6, 1.5 + a * 0.35, -0.6 + Math.cos(a) * 0.4); n.scale.setScalar(Math.max(0.01, 1 - a / 6) * k * 2); });
  };
  return g;
}

export function orangeGrove(): P {
  const g = group();
  const trees: P[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) trees.push(add(g, citrusTree("orange", 0.9 + rnd() * 0.2), -3.6 + j * 2.4, 0, -1.2 + i * 2.4));
  for (let i = 0; i < 6; i++) { add(g, cyl(0.03, 0.06, 0.9, "#8a6a3a", 5), -3.6 + i * 1.5, 0.45, 3.0); add(g, ball(0.28, "#7a5a3a", 6), -3.6 + i * 1.5, 1.0, 3.0).scale.set(1, 0.6, 1); for (let k = 0; k < 4; k++) add(g, ball(0.05, k % 2 ? "#e9d7a8" : "#f4f1ea", 4), -3.6 + i * 1.5 + Math.cos(k * 1.6) * 0.25, 1.1, 3.0 + Math.sin(k * 1.6) * 0.15); }   // almond trees in blossom
  add(g, islander("#3f6fb5", { hat: true }), 4.2, 0, 0.4); const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 4.8, 0.15, 1.0); for (let k = 0; k < 6; k++) add(crate, ball(0.09, "#f08a2a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "¡Naranjas! Oranges!", 2.4, 1300); for (const tr of trees) { const fr = (tr.userData as { fruits?: THREE.Mesh[] }).fruits ?? []; for (let i = 0; i < 2; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.09, "#f08a2a", 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) { c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; c.rotation.x = Math.cos(t * 21 + tr.position.z) * 0.05 * shake; } } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.09, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.091) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

// ---------- Morocco ----------

export function riad(w = 3.2, d = 2.8, h = 2.4, opts: { storeys?: number; tower?: boolean } = {}): P {
  const g = group();
  const st = opts.storeys ?? 1, H = h * st;
  add(g, box(w, H, d, MD.moroccoPink), 0, H / 2, 0);
  add(g, box(w + 0.1, 0.25, d + 0.1, MD.moroccoRed), 0, H + 0.1, 0);
  for (let k = 0; k < Math.round(w / 0.6); k++) add(g, box(0.3, 0.3, d + 0.12, MD.moroccoRed), -w / 2 + 0.3 + k * 0.6, H + 0.35, 0);   // crenellations
  add(g, box(0.9, 1.6, 0.06, "#2a6f6f"), -w / 4, 0.8, d / 2 + 0.02); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 12, 1, false, 0, Math.PI), mat("#2a6f6f")), -w / 4, 1.6, d / 2 + 0.02).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  for (let s = 0; s < st; s++) add(g, box(0.6, 0.7, 0.08, "#4a3222"), w / 4, s * h + 1.4, d / 2 + 0.04);
  if (opts.tower) { add(g, box(1.4, H + 2.4, 1.4, MD.moroccoPink), w / 2 - 0.7, (H + 2.4) / 2, -d / 2 + 0.7); add(g, box(1.5, 0.2, 1.5, MD.moroccoRed), w / 2 - 0.7, H + 2.5, -d / 2 + 0.7); }
  return g;
}

/** The Koutoubia: a square minaret with a stork's nest, and the palm-lined square below. */
export function koutoubia(): P {
  const g = group();
  add(g, box(3.2, 12, 3.2, "#c98a5a"), 0, 6, 0);
  for (let k = 0; k < 4; k++) add(g, box(0.5, 0.9, 0.06, "#4a3222"), -0.9 + k * 0.6, 3 + (k % 2) * 3, 1.63);
  add(g, box(3.4, 0.5, 3.4, "#b85a3a"), 0, 12.2, 0); for (let i = 0; i < 8; i++) add(g, box(0.3, 0.4, 0.3, "#b85a3a"), -1.5 + (i % 4) * 1.0, 12.6, i < 4 ? 1.55 : -1.55);
  add(g, box(1.6, 2.4, 1.6, "#c98a5a"), 0, 13.6, 0); add(g, dome(0.6, "#2a8f8f", 10), 0, 14.8, 0);
  for (let k = 0; k < 3; k++) add(g, ball(0.28 - k * 0.06, "#e0b34c", 8), 0, 15.5 + k * 0.5, 0);
  const nest = add(g, cyl(0.5, 0.35, 0.3, "#8a6a3a", 8), 1.9, 12.3, 1.2); void nest;
  const stork = group(); add(stork, ball(0.16, "#f4f1ea", 7), 0, 0.5, 0).scale.set(1.4, 0.8, 1); add(stork, cyl(0.03, 0.03, 0.5, "#f4f1ea", 5), 0.2, 0.75, 0).rotation.z = -0.5; add(stork, ball(0.08, "#f4f1ea", 6), 0.35, 1.0, 0); add(stork, cone(0.03, 0.3, "#c9302a", 4), 0.55, 0.98, 0).rotation.z = -1.5; for (const z of [-0.05, 0.05]) add(stork, cyl(0.015, 0.015, 0.5, "#c9302a", 3), 0, 0.2, z); add(stork, box(0.5, 0.02, 0.2, "#2a2a2e"), -0.15, 0.5, 0);
  add(g, stork, 1.9, 12.45, 1.2);
  g.userData.tick = (t) => { stork.rotation.y = Math.sin(t * 0.5) * 0.4; };
  return g;
}

/** Jemaa el-Fna: a snake charmer, an orange juice cart, a storyteller's circle, a water seller. */
export function jemaaSquare(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(10, 7), mat("#d9c7a0")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  // the charmer and the cobra
  const charmer = islander("#f4f1ea"); charmer.userData.sit?.(); wear(charmer, box(0.36, 0.2, 0.36, "#f4f1ea"), 0, 1.2, 0); add(g, charmer, -2.5, -0.3, 0.6); charmer.rotation.y = 0.3; add(charmer, cyl(0.02, 0.02, 0.5, MD.wood, 4), 0.1, 0.9, 0.35).rotation.x = -0.9;
  add(g, cyl(0.3, 0.26, 0.2, C.straw, 10), -1.7, 0.1, 1.4);
  const cobra = new THREE.Group(); cobra.position.set(-1.7, 0.2, 1.4); g.add(cobra);
  const body = add(cobra, cyl(0.06, 0.08, 0.8, "#6f7a4a", 6), 0, 0.4, 0); const hood = add(cobra, box(0.28, 0.32, 0.06, "#6f7a4a"), 0, 0.9, 0); add(hood, ball(0.04, "#f2c14e", 4), -0.06, 0.06, 0.04); add(hood, ball(0.04, "#f2c14e", 4), 0.06, 0.06, 0.04); void body;
  cobra.scale.set(1, 0.3, 1);
  // orange juice cart
  add(g, box(1.6, 0.9, 0.8, "#3f8f5a"), 2.2, 0.55, -1.4); add(g, box(1.6, 0.06, 0.9, "#f4f1ea"), 2.2, 1.02, -1.4); for (let k = 0; k < 12; k++) add(g, ball(0.08, "#f08a2a", 6), 1.6 + (k % 6) * 0.24, 1.12 + Math.floor(k / 6) * 0.14, -1.6 + Math.floor(k / 6) * 0.1); for (let k = 0; k < 3; k++) add(g, cyl(0.05, 0.04, 0.14, "#f2a53a", 6), 1.7 + k * 0.3, 1.1, -1.1);
  add(g, box(1.8, 0.05, 1.0, "#c9302a"), 2.2, 2.2, -1.4); for (const x of [1.5, 2.9]) add(g, cyl(0.03, 0.03, 2.2, MD.wood, 4), x, 1.1, -1.9);
  const juice = islander("#3f6fb5", { apron: true, fez: true }); add(g, juice, 2.2, 0, -2.2);
  // the storyteller's circle
  const listeners: Fig[] = [];
  for (let i = 0; i < 5; i++) { const a = -0.4 + i * 0.45; const p = islander(pick(["#f4f1ea", "#7a4a3a", "#2a2a2e", "#c0392b"]), { fez: i % 2 === 0 }); p.userData.sit?.(); add(g, p, 1.5 + Math.cos(a + 1.6) * 1.4, -0.3, 1.8 + Math.sin(a + 1.6) * 1.4).rotation.y = -(a + 1.6) - Math.PI / 2 + Math.PI; listeners.push(p); }
  const teller = islander("#8e2a22", { fez: true }); add(g, teller, 1.5, 0, 1.6); teller.rotation.y = Math.PI;
  const water = islander("#c0392b"); wear(water, cyl(0.42, 0.44, 0.06, "#c0392b", 12), 0, 1.19, 0); wear(water, cyl(0.15, 0.17, 0.2, "#c0392b", 10), 0, 1.3, 0); for (let k = 0; k < 4; k++) add(water, cyl(0.04, 0.03, 0.12, "#e0b34c", 6), -0.25 + k * 0.17, 0.9, 0.24); add(water, ball(0.14, "#4a3222", 7), 0.25, 0.7, -0.1).scale.y = 1.4;
  add(g, water, -3.6, 0, -1.6); water.rotation.y = 0.8;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(charmer, "🐍 !", 1.4, 1200); bubble(teller, "مرحبا! Marhaba!", 1.6, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    cobra.scale.y = 0.3 + k * 0.7 * Math.min(1, k * 3); cobra.rotation.z = k * Math.sin(t * 4) * 0.25; cobra.rotation.y = Math.sin(t * 2) * 0.4;
    if (charmer.userData.upper) charmer.userData.upper.rotation.z = Math.sin(t * (1 + k * 6)) * 0.08;
    if (teller.userData.upper) { teller.userData.upper.rotation.z = Math.sin(t * 1.4) * 0.06 + k * Math.sin(t * 8) * 0.2; teller.userData.upper.rotation.y = k * Math.sin(t * 3) * 0.5; }
    listeners.forEach((p, i) => { if (p.userData.upper) p.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; });
    if (juice.userData.upper) juice.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3;
  };
  return g;
}

/** The souk: narrow lanes under reed shade, stalls of spice cones, pulses in sacks, mint tea, olives, slippers and lamps. */
export function souk(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(16, 10), mat("#cdb890")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (const x of [-7.5, -2.5, 2.5, 7.5]) for (const z of [-4.5, 4.5]) add(g, box(0.4, 3.2, 0.4, MD.moroccoPink), x, 1.6, z);
  for (let i = 0; i < 18; i++) add(g, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 10), mat("#c9a86a", { transparent: true, opacity: 0.55 })), -7.6 + i * 0.9, 3.3, 0).renderOrder = 3;   // reed lattice shade, light falling through
  for (const z of [-4.6, 4.6]) add(g, box(16, 0.12, 0.12, MD.wood), 0, 3.25, z);
  const vendors: Fig[] = [];
  const stall = (kind: string) => {
    const s = group();
    add(s, box(2.6, 0.8, 1.2, MD.wood), 0, 0.45, 0); add(s, box(2.6, 0.06, 1.2, "#5a3d28"), 0, 0.88, 0);
    for (const x of [-1.2, 1.2]) add(s, cyl(0.04, 0.04, 2.3, "#5a3d28", 5), x, 1.15, -0.5);
    add(s, box(2.6, 0.06, 1.4, pick([MD.moroccoRed, "#2a6f6f", "#e0b34c"])), 0, 2.3, 0.1).rotation.x = 0.15;
    const goods = new THREE.Group(); goods.position.y = 0.92; s.add(goods);
    switch (kind) {
      case "spices": for (let i = 0; i < 6; i++) { add(goods, cyl(0.22, 0.24, 0.16, "#8a6a3a", 9), -1.0 + (i % 3) * 0.8, 0.08, -0.25 + Math.floor(i / 3) * 0.5); add(goods, cone(0.2, 0.4, ["#c9302a", "#e0b34c", "#e07a3a", "#6f9b57", "#8e2a22", "#c9a86a"][i], 9), -1.0 + (i % 3) * 0.8, 0.34, -0.25 + Math.floor(i / 3) * 0.5); } for (let k = 0; k < 3; k++) add(goods, cyl(0.1, 0.08, 0.22, "#f2c14e", 8), 1.1, 0.11, -0.3 + k * 0.3); break;   // and preserved lemons in a jar
      case "pulses": for (let i = 0; i < 5; i++) { const sack = add(goods, cyl(0.3, 0.26, 0.4, "#e9d7a8", 9), -1.0 + i * 0.5, 0.2, 0); add(sack, cyl(0.24, 0.24, 0.05, ["#e9d7a8", "#8a6a3a", "#c9a86a", "#3f4a3a", "#e0b34c"][i], 9), 0, 0.22, 0); } break;
      case "tea": add(goods, cyl(0.2, 0.16, 0.3, "#c9cfd6", 8), -0.6, 0.15, 0); add(goods, cone(0.06, 0.2, "#c9cfd6", 6), -0.6, 0.4, 0); add(goods, cyl(0.02, 0.02, 0.4, "#c9cfd6", 4), -0.4, 0.3, 0).rotation.z = -0.8; for (let i = 0; i < 5; i++) add(goods, cyl(0.05, 0.04, 0.12, "#6fb06a", 6), 0.1 + i * 0.22, 0.06, 0.2); add(goods, ball(0.18, "#3f7a3a", 6), 0.6, 0.12, -0.3).scale.set(1.3, 0.8, 1); for (let k = 0; k < 6; k++) add(goods, box(0.1, 0.1, 0.1, "#f7f4ee"), -0.9 + (k % 3) * 0.12, 0.05 + Math.floor(k / 3) * 0.1, -0.3); break;   // sugar loaves and mint
      case "olives": for (let i = 0; i < 4; i++) { add(goods, cyl(0.26, 0.22, 0.28, "#8c9096", 10), -0.9 + i * 0.6, 0.14, 0); for (let k = 0; k < 12; k++) add(goods, ball(0.04, ["#2f3a2a", "#6f9b57", "#9b59b6", "#c9302a"][i], 5), -0.9 + i * 0.6 + (rnd() - 0.5) * 0.36, 0.3 + (rnd() - 0.5) * 0.04, (rnd() - 0.5) * 0.36); } add(goods, box(0.22, 0.34, 0.16, "#e0b34c"), 0.95, 0.17, -0.25); add(goods, cyl(0.05, 0.06, 0.3, "#c9b45a", 7), 0.95, 0.15, 0.3); break;
      case "slippers": for (let i = 0; i < 8; i++) { const sl = add(goods, box(0.22, 0.06, 0.1, ["#e0b34c", "#c9302a", "#2a6f6f", "#e8558a"][i % 4]), -0.9 + (i % 4) * 0.5, 0.03, -0.2 + Math.floor(i / 4) * 0.4); add(sl, cone(0.05, 0.1, ["#e0b34c", "#c9302a", "#2a6f6f", "#e8558a"][i % 4], 4), 0.13, 0.02, 0).rotation.z = -1.3; } for (let i = 0; i < 4; i++) { const l = add(s, ball(0.13, ["#c9302a", "#3fa2b0", "#e0b34c", "#9b59b6"][i], 7), -0.9 + i * 0.6, 1.75, 0.1); l.scale.y = 1.4; add(s, cyl(0.01, 0.01, 0.5, "#8a6a3a", 3), -0.9 + i * 0.6, 2.1, 0.1); } break;
      case "carpets": for (let i = 0; i < 4; i++) add(goods, box(0.6, 0.12, 1.0, [MD.moroccoRed, "#2a6f6f", "#e0b34c", "#8e2a22"][i]), -0.9 + i * 0.6, 0.06 + (i % 2) * 0.1, 0); for (let i = 0; i < 2; i++) add(s, box(1.0, 1.4, 0.04, i ? "#8e2a22" : "#2a6f6f"), -0.6 + i * 1.2, 1.6, -0.55); break;
    }
    const v = islander(pick(["#3f6fb5", "#c0392b", "#f4f1ea", "#2f5d3f"]), { apron: true, fez: kind === "tea" }); add(s, v, 0.3, 0, -0.95); vendors.push(v);
    return s;
  };
  const layout: [string, number, number, number][] = [["spices", -5.5, -2.6, 0], ["pulses", -0.5, -2.6, 0], ["tea", 4.5, -2.6, 0], ["olives", -4, 2.6, Math.PI], ["slippers", 1, 2.6, Math.PI], ["carpets", 6, 2.6, Math.PI]];
  for (const [k, x, z, rot] of layout) { const s = stall(k); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  const donkey = group(); add(donkey, box(0.9, 0.5, 0.4, "#8a8078"), 0, 0.6, 0); add(donkey, box(0.4, 0.35, 0.3, "#8a8078"), 0.6, 0.75, 0); for (const z of [-0.08, 0.08]) add(donkey, box(0.06, 0.3, 0.08, "#8a8078"), 0.55, 1.05, z); for (const x of [-0.3, 0.3]) for (const z of [-0.12, 0.12]) add(donkey, box(0.1, 0.4, 0.1, "#8a8078"), x, 0.2, z); for (const z of [-0.32, 0.32]) add(donkey, box(0.5, 0.4, 0.2, C.straw), 0, 0.6, z); add(g, donkey, 6.5, 0, 0); donkey.rotation.y = 1.6;
  const spots = [new THREE.Vector3(-5.5, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(5, 0, 0.3), new THREE.Vector3(-3, 0, -0.3)];
  type Shopper = { p: Fig; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [0, 1, 2].map((i) => { const p = islander(pick(["#c0392b", "#f2c14e", "#3f6fb5", "#f4f1ea"]), { scarf: i === 2 ? "#9b59b6" : undefined, fez: i === 1 }); const st = spots[i].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i + 2) % spots.length].clone(), wait: i * 0.8, speed: 0.7 + rnd() * 0.4 }; });
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "مرحبا! Welcome, come look!", 3.7, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    vendors.forEach((v, i) => { if (v.userData.upper) v.userData.upper.rotation.z = k * Math.sin(t * 8 + i) * 0.35; v.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.2; });
    donkey.position.y = k * Math.abs(Math.sin(t * 10)) * 0.15;
    for (const sh of shoppers) {
      if (sh.wait > 0) { sh.wait -= dt; continue; }
      const to = sh.target.clone().sub(sh.pos); const d = to.length();
      if (d < 0.15) { sh.wait = 2 + rnd() * 4; sh.target = spots[Math.floor(rnd() * spots.length)].clone(); continue; }
      to.normalize().multiplyScalar(Math.min(d, sh.speed * dt)); sh.pos.add(to); sh.p.position.copy(sh.pos); sh.p.rotation.y = Math.atan2(to.x, to.z); sh.p.userData.walk?.(t);
    }
    tickChildren(g)(t, dt);
  };
  return g;
}

/** The riad kitchen: tagines on charcoal braziers whose lids lift when clicked, couscous steaming, preserved lemons, mint tea poured from a height. */
export function riadKitchen(): P {
  const g = group();
  add(g, riad(4.4, 3.0, 2.4, { tower: true }), 0, 0, -1.4);
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(2.0, 0.3, 0.02, "#2a6f6f"), 0, 2.15, 0.24);
  for (let i = 0; i < 6; i++) add(g, box(0.5, 0.5, 0.04, i % 2 ? "#2a6f6f" : "#e0b34c"), -1.4 + i * 0.6, 0.45, 0.12);
  const lids: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const x = -1.4 + i * 1.1;
    add(g, cyl(0.34, 0.3, 0.3, "#8a4a3a", 10), x, 0.15, 1.2); for (let k = 0; k < 3; k++) add(g, ball(0.06, "#f08a2a", 5), x + Math.cos(k * 2.1) * 0.15, 0.32, 1.2 + Math.sin(k * 2.1) * 0.15);
    add(g, cyl(0.38, 0.34, 0.16, MD.terracotta, 12), x, 0.4, 1.2);
    add(g, cyl(0.34, 0.34, 0.05, i === 1 ? "#e0b34c" : "#c9573a", 12), x, 0.5, 1.2); for (let k = 0; k < 5; k++) add(g, ball(0.05, ["#e9d7a8", "#f08a2a", "#6fb06a", "#c9302a", "#e9d7a8"][k], 5), x + Math.cos(k * 1.25) * 0.2, 0.54, 1.2 + Math.sin(k * 1.25) * 0.2);
    const lid = add(g, cone(0.36, 0.55, i === 1 ? "#2a6f6f" : MD.terracotta, 12), x, 0.75, 1.2); add(lid, ball(0.05, i === 1 ? "#2a6f6f" : MD.terracotta, 5), 0, 0.3, 0); lids.push(lid);
  }
  add(g, box(1.6, 0.8, 0.8, MD.wood), 2.4, 0.4, 1.0); add(g, cyl(0.3, 0.26, 0.3, "#c9cfd6", 10), 2.0, 0.95, 1.0); add(g, cone(0.3, 0.14, "#c9cfd6", 10), 2.0, 1.17, 1.0); add(g, ball(0.26, "#e9d7a8", 9), 2.0, 1.3, 1.0).scale.y = 0.5;   // the couscoussier and its mound
  for (let k = 0; k < 3; k++) add(g, cyl(0.1, 0.08, 0.22, "#f2c14e", 8), 2.6 + (k % 2) * 0.25, 0.9, 0.75 + Math.floor(k / 2) * 0.3); add(g, cyl(0.1, 0.08, 0.22, "#c9302a", 8), 3.0, 0.9, 1.2);   // preserved lemons, harissa
  const teaPot = new THREE.Group(); teaPot.position.set(-2.4, 1.2, 1.4); g.add(teaPot); add(teaPot, cyl(0.14, 0.1, 0.22, "#c9cfd6", 8), 0, 0, 0); add(teaPot, cone(0.05, 0.16, "#c9cfd6", 6), 0, 0.18, 0); add(teaPot, cyl(0.02, 0.02, 0.3, "#c9cfd6", 4), 0.16, 0.05, 0).rotation.z = -0.9;
  const stream = add(g, cyl(0.015, 0.015, 0.8, "#c9a86a", 4), -2.15, 0.7, 1.4); stream.visible = false;
  for (let k = 0; k < 3; k++) add(g, cyl(0.05, 0.04, 0.12, "#6fb06a", 6), -2.3 + k * 0.15, 0.36, 1.7); add(g, cyl(0.4, 0.4, 0.06, "#c9cfd6", 12), -2.2, 0.32, 1.7); add(g, cyl(0.06, 0.06, 0.3, MD.wood, 6), -2.2, 0.15, 1.7);
  const server = islander("#f4f1ea", { fez: true, apron: true }); add(g, server, -2.4, 0, 0.5); server.rotation.y = 0.4;
  const cook = islander("#2a6f6f", { scarf: "#e0b34c", apron: true }); add(g, cook, 0, 0, 0.2); cook.rotation.y = 0.1;
  const diners: Fig[] = [];
  for (let i = 0; i < 2; i++) { const d = islander(pick(["#c0392b", "#3f6fb5"]), { fez: i === 0 }); d.userData.sit?.(); add(g, box(0.5, 0.2, 0.5, "#e0b34c"), 0.2 + i * 1.0, 0.1, 2.4); add(g, d, 0.2 + i * 1.0, -0.3, 2.4).rotation.y = Math.PI; diners.push(d); }
  g.userData.steam = new THREE.Vector3(-0.3, 1.0, 1.2);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(cook, "بصحة! Bsaha!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    lids.forEach((l, i) => { l.position.y = 0.75 + k * Math.max(0, Math.sin(t * 5 + i * 1.5)) * 0.6; l.rotation.z = k * Math.sin(t * 5 + i * 1.5) * 0.3; });
    teaPot.position.y = 1.2 + k * 0.8 * Math.min(1, k * 2); teaPot.rotation.z = -k * 0.8; stream.visible = k > 0.2; stream.scale.y = k; stream.position.y = 0.4 + k * 0.5;
    diners.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; });
    if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + k * Math.sin(t * 5) * 0.15;
  };
  return g;
}

export function atlas(): P {
  const g = mountain(4.5, 8, false);
  for (let i = 0; i < 3; i++) { const cap = add(g, cone(1.6 - i * 0.4, 1.6 - i * 0.4, "#f4f1ea", 12), [0, 3.4, -2.7][i], [7.3, 4.2, 3.4][i], [0, 0.9, -2.0][i]); cap.scale.set(1.35, 0.8, 1.35); }
  return g;
}

// ---------- Dalmatia ----------

export function stoneHouse(w = 3.0, d = 2.4, h = 2.2, opts: { storeys?: number } = {}): P {
  const g = group();
  const st = opts.storeys ?? 1, H = h * st;
  add(g, box(w, H, d, MD.stone), 0, H / 2, 0);
  for (let k = 0; k < 6; k++) add(g, box(0.4, 0.22, 0.05, k % 2 ? "#cfc2a8" : "#b8ab90"), -w / 2 + 0.4 + (k % 3) * (w / 3), 0.6 + Math.floor(k / 3) * 0.9, d / 2 + 0.03);
  for (const sd of [-1, 1]) { const r = add(g, box(w + 0.5, 0.12, d / 2 + 0.4, MD.terracotta), 0, H + 0.35, sd * d / 4); r.rotation.x = -sd * 0.4; } add(g, box(w + 0.4, 0.05, 0.24, "#b35a30"), 0, H + 0.72, 0);
  add(g, box(0.8, 1.5, 0.06, "#4f6f4a"), -w / 4, 0.75, d / 2 + 0.02);
  for (let s = 0; s < st; s++) { add(g, box(0.7, 0.8, 0.06, "#6fb3c9"), w / 4, s * h + 1.35, d / 2 + 0.02); for (const sd of [-1, 1]) add(g, box(0.18, 0.8, 0.05, "#4f6f4a"), w / 4 + sd * 0.45, s * h + 1.35, d / 2 + 0.06); }   // green shutters
  return g;
}

/** A walled harbour town: ramparts and towers, red roofs inside, a bell tower. */
export function walledTown(): P {
  const g = group();
  const pts: [number, number][] = [[-6, -4], [6, -4], [7, 0], [6, 4], [-6, 4], [-7, 0]];
  for (let i = 0; i < pts.length; i++) { const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length]; const len = Math.hypot(bx - ax, bz - az); const w = add(g, box(len, 2.2, 0.8, MD.stoneDark), (ax + bx) / 2, 1.1, (az + bz) / 2); w.rotation.y = -Math.atan2(bz - az, bx - ax); for (let k = 0; k < Math.floor(len / 1.0); k++) add(w, box(0.4, 0.4, 0.9, MD.stoneDark), -len / 2 + 0.5 + k * 1.0, 1.3, 0); add(g, cyl(0.9, 1.0, 3.4, MD.stoneDark, 10), ax, 1.7, az); add(g, cone(1.0, 0.8, MD.terracotta, 10), ax, 3.8, az); }
  for (let i = 0; i < 7; i++) { const x = -4 + (i % 4) * 2.6 + (i > 3 ? 1.3 : 0), z = -1.8 + Math.floor(i / 4) * 3; add(g, stoneHouse(2.0, 1.7, 1.6, { storeys: 1 + (i % 2) }), x, 0, z).rotation.y = (i % 3 - 1) * 0.15; }
  add(g, box(1.2, 6.5, 1.2, MD.stone), 0.5, 3.25, 0.4); add(g, box(1.4, 0.3, 1.4, MD.stoneDark), 0.5, 6.6, 0.4); add(g, cone(0.9, 1.2, MD.terracotta, 4), 0.5, 7.3, 0.4).rotation.y = Math.PI / 4;
  add(g, box(1.6, 2.0, 1.0, MD.stoneDark), 0, 1.0, 4.2); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.1, 10, 1, false, 0, Math.PI), mat("#2a2a2e")), 0, 1.0, 4.2).rotation.set(Math.PI / 2, 0, Math.PI / 2);   // the gate
  return g;
}

/** A konoba: stone house, a peka bell over embers, the grill, cabbage salads, a rakija bottle, an accordion player. */
export function konoba(): P {
  const g = group();
  add(g, stoneHouse(4.4, 3.0, 2.4), 0, 0, -1.4);
  add(g, box(2.0, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(1.8, 0.3, 0.02, "#f4f1ea"), 0, 2.15, 0.24);
  for (let i = 0; i < 4; i++) add(g, box(4.6, 0.05, 0.05, MD.wood), 0, 2.5, 0.4 + i * 0.9); for (const x of [-2.2, 2.2]) for (const z of [0.4, 3.1]) add(g, cyl(0.05, 0.05, 2.5, MD.wood, 5), x, 1.25, z);
  for (let i = 0; i < 12; i++) add(g, ball(0.2, "#6fa84a", 6), -2.0 + (i % 6) * 0.8, 2.6, 0.6 + Math.floor(i / 6) * 1.8).scale.set(1.3, 0.5, 1);
  add(g, cyl(0.7, 0.7, 0.3, "#8f857a", 12), -2.6, 0.15, 1.6); for (let k = 0; k < 5; k++) add(g, ball(0.08, "#f08a2a", 5), -2.6 + Math.cos(k * 1.25) * 0.35, 0.32, 1.6 + Math.sin(k * 1.25) * 0.35);
  const peka = add(g, dome(0.5, "#3a3a3d", 12), -2.6, 0.32, 1.6); add(peka, box(0.9, 0.05, 0.05, "#3a3a3d"), 0, 0.5, 0); add(peka, ball(0.05, "#3a3a3d", 5), 0, 0.55, 0);
  add(g, cyl(0.03, 0.03, 1.6, "#2a2a2e", 4), -2.6, 1.0, 1.6); add(g, box(0.5, 0.03, 0.03, "#2a2a2e"), -2.6, 1.8, 1.6);   // the chain and beam over the peka
  add(g, box(1.4, 0.8, 0.7, "#5a5a5a"), 2.6, 0.4, 0.6); add(g, box(1.3, 0.06, 0.6, "#2a2a2e"), 2.6, 0.83, 0.6); for (let i = 0; i < 6; i++) add(g, cyl(0.05, 0.05, 0.22, "#a6603a", 6), 2.1 + i * 0.2, 0.9, 0.6).rotation.z = Math.PI / 2;   // ćevapi
  const diners: Fig[] = [];
  const bowls: THREE.Group[] = [];
  for (const [x, z] of [[-1.0, 1.4], [1.0, 1.4]]) {
    add(g, box(1.0, 0.05, 0.9, "#f4f1ea"), x, 0.78, z); add(g, box(1.0, 0.02, 0.9, "#c9302a"), x, 0.81, z); add(g, cyl(0.06, 0.08, 0.72, MD.wood, 6), x, 0.36, z);
    const b = new THREE.Group(); b.position.set(x, 0.83, z); g.add(b); bowls.push(b);
    add(b, cyl(0.2, 0.16, 0.08, "#f4f1ea", 10), 0, 0, 0); for (let k = 0; k < 7; k++) add(b, box(0.1, 0.02, 0.03, "#e8f1d8"), Math.cos(k * 0.9) * 0.1, 0.08, Math.sin(k * 0.9) * 0.1).rotation.y = k;   // shredded cabbage
    add(b, ball(0.04, "#c9302a", 4), 0.1, 0.1, 0.05);
    add(b, cyl(0.04, 0.04, 0.22, "#8fc4c9", 6), 0.3, 0.1, -0.2); add(b, cyl(0.03, 0.03, 0.04, "#8fc4c9", 6), 0.3, 0.23, -0.2);   // rakija
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.5; add(g, cyl(0.2, 0.2, 0.42, MD.wood, 8), x + Math.cos(a) * 0.85, 0.21, z + Math.sin(a) * 0.85); const d = islander(pick(["#f4f1ea", "#3f6fb5", "#c0392b", "#2a2a2e"])); d.userData.sit?.(); add(g, d, x + Math.cos(a) * 0.85, 0.04, z + Math.sin(a) * 0.85).rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); diners.push(d); }
  }
  const cook = islander("#2a2a2e", { apron: true }); add(g, cook, -2.6, 0, 2.6); cook.rotation.y = Math.PI;
  const player = islander("#c0392b", { flat: true }); player.userData.sit?.(); add(g, cyl(0.2, 0.2, 0.42, MD.wood, 8), 3.2, 0.21, 2.2); add(g, player, 3.2, 0.04, 2.2); player.rotation.y = -1.2; const squeeze = add(player, box(0.4, 0.3, 0.2, "#c9302a"), 0.05, 0.7, 0.3); add(squeeze, box(0.05, 0.28, 0.18, "#f4f1ea"), -0.22, 0, 0);
  g.userData.smoke = new THREE.Vector3(-2.6, 0.9, 1.6);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(cook, "Dobar tek! Enjoy!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    peka.position.y = 0.32 + k * Math.max(0, Math.sin(t * 4)) * 0.7;
    bowls.forEach((b, i) => { b.position.y = 0.83 + k * Math.max(0, Math.sin(t * 10 + i * 1.3)) * 0.3; b.rotation.y += k * dt * 4; });
    squeeze.scale.x = 1 + Math.sin(t * (2 + k * 8)) * 0.3; if (player.userData.upper) player.userData.upper.rotation.z = Math.sin(t * (2 + k * 8)) * 0.06;
    diners.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = 0.15 + k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.z = Math.sin(t * 0.8 + i) * 0.06; } });
    if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25;
  };
  return g;
}

export function cabbageField(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#6b4a32"), 0, 0.1, 0);
  const heads: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) { const h = add(g, ball(0.28, j % 3 === 2 ? "#9b59b6" : "#a3d18a", 7), -2.5 + j * 0.83, 0.42, -1.3 + i * 0.85); h.scale.set(1, 0.85, 1); heads.push(h); for (let k = 0; k < 4; k++) add(g, ball(0.16, j % 3 === 2 ? "#7a3f8f" : "#7fbf5a", 5), -2.5 + j * 0.83 + Math.cos(k * 1.6) * 0.3, 0.3, -1.3 + i * 0.85 + Math.sin(k * 1.6) * 0.3).scale.set(1, 0.4, 1); }
  for (let i = 0; i < 4; i++) { add(g, cyl(0.02, 0.02, 0.5, "#4f9a4a", 4), 3.3 + (i % 2) * 0.3, 0.25, 0.6 + Math.floor(i / 2) * 0.35); for (let k = 0; k < 3; k++) add(g, cone(0.05, 0.18, "#c9302a", 5), 3.3 + (i % 2) * 0.3 + Math.cos(k * 2.1) * 0.08, 0.45, 0.6 + Math.floor(i / 2) * 0.35 + Math.sin(k * 2.1) * 0.08).rotation.x = Math.PI; }   // paprika peppers
  add(g, cyl(0.3, 0.26, 0.5, MD.wood, 10), 3.5, 0.25, -1.0); add(g, cyl(0.26, 0.26, 0.06, "#e8f1d8", 10), 3.5, 0.52, -1.0); add(g, box(0.4, 0.3, 0.4, "#8f857a"), 3.5, 0.7, -1.0);   // the sauerkraut barrel under its stone
  const farmer = islander("#3f6fb5", { hat: true }); add(g, farmer, 3.4, 0, 1.8); farmer.rotation.y = -1.8;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "Kupus! Cabbage!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); heads.forEach((h, i) => { h.position.y = 0.42 + k * Math.max(0, Math.sin(t * 9 + i * 0.7)) * 0.35; h.rotation.y += k * dt * 4; }); if (farmer.userData.upper) farmer.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

export function sailboat(color = MD.white): P {
  const g = group();
  add(g, box(2.4, 0.4, 0.9, color), 0, 0.2, 0); add(g, box(2.4, 0.06, 0.96, MD.blue), 0, 0.42, 0);
  add(g, cyl(0.03, 0.03, 2.6, "#c9a37a", 4), 0.1, 1.7, 0);
  const sail = add(g, new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 3), mat("#f7f4ee", { side: THREE.DoubleSide })), 0.1, 1.6, 0); sail.rotation.y = Math.PI / 2; sail.scale.set(1, 1, 0.05);
  add(g, islander("#3f6fb5", { hat: true }), -0.7, 0.45, 0).scale.setScalar(0.85);
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 0.9) * 0.05; sail.rotation.y = Math.PI / 2 + Math.sin(t * 0.7) * 0.15; };
  return g;
}

export function dolphin(): P {
  const g = group();
  add(g, ball(0.3, "#7f93a6", 9), 0, 0, 0).scale.set(2.2, 0.8, 0.9); add(g, ball(0.1, "#f4f1ea", 6), 0, -0.12, 0).scale.set(2, 0.6, 0.8);
  add(g, cone(0.12, 0.4, "#7f93a6", 5), 0.75, 0.02, 0).rotation.z = -Math.PI / 2; add(g, cone(0.12, 0.3, "#7f93a6", 4), -0.2, 0.3, 0).rotation.z = 0.3;
  const tail = add(g, box(0.3, 0.05, 0.5, "#7f93a6"), -0.75, 0, 0); tail.rotation.y = 0.2;
  return g;
}

export const MED_PROPS: Record<string, () => P> = {
  taverna, goatDairy, saladGarden, oliveGroveGr, fishingPort, tapasBar, flamenco, orangeGrove, souk, riadKitchen, jemaaSquare, konoba, cabbageField, none: () => group(),
};

export const MED_ICONS: Record<string, () => P> = {
  saladVeg: () => { const g = group(); add(g, ball(0.16, "#c9302a", 9), -0.3, 0.16, 0); add(g, cyl(0.07, 0.07, 0.5, "#3f7a3a", 8), 0.05, 0.08, 0.1).rotation.z = Math.PI / 2; add(g, box(0.14, 0.2, 0.14, "#f2c14e"), 0.45, 0.1, -0.15); add(g, ball(0.09, "#9b59b6", 6), 0.35, 0.09, 0.28); return g; },
  feta: () => { const g = group(); add(g, box(0.4, 0.2, 0.3, "#f7f4ee"), -0.2, 0.1, 0); add(g, box(0.3, 0.16, 0.24, "#f7f4ee"), 0.15, 0.08, 0.2).rotation.y = 0.4; add(g, cyl(0.14, 0.12, 0.2, MD.terracotta, 8), 0.45, 0.1, -0.2); add(g, cyl(0.12, 0.12, 0.03, "#f7f4ee", 8), 0.45, 0.21, -0.2); for (let k = 0; k < 3; k++) add(g, ball(0.035, "#2f3a2a", 4), -0.4 + k * 0.1, 0.22, 0.1); return g; },
  olivesGr: () => { const g = group(); for (let k = 0; k < 7; k++) add(g, ball(0.07, k % 2 ? "#2f3a2a" : "#6f9b57", 6), -0.3 + (k % 4) * 0.2, 0.07, -0.1 + Math.floor(k / 4) * 0.2); add(g, cyl(0.09, 0.08, 0.34, "#c9b45a", 6), 0.5, 0.17, 0.1); add(g, box(0.16, 0.02, 0.06, "#4f9a4a"), -0.1, 0.16, -0.25); return g; },
  fishMed: () => { const g = group(); const f = add(g, ball(0.2, "#b3bfc9", 8), -0.2, 0.15, 0); f.scale.set(2, 0.6, 0.8); add(g, cone(0.1, 0.2, "#b3bfc9", 4), -0.65, 0.15, 0).rotation.z = Math.PI / 2; for (let k = 0; k < 3; k++) add(g, ball(0.06, "#f08a6a", 6), 0.3 + k * 0.15, 0.06, 0.15 - k * 0.1).scale.set(1.6, 0.6, 0.8); return g; },
  oranges: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.16, "#f08a2a", 10), -0.3 + i * 0.3, 0.16, (i - 1) * 0.12); for (let k = 0; k < 5; k++) add(g, ball(0.045, "#e9d7a8", 5), 0.3 + (k % 3) * 0.1, 0.04, 0.3 + Math.floor(k / 3) * 0.1).scale.set(1.4, 0.7, 1); return g; },
  cabbage: () => { const g = group(); add(g, ball(0.28, "#a3d18a", 8), -0.2, 0.26, 0).scale.y = 0.85; for (let k = 0; k < 3; k++) add(g, ball(0.16, "#7fbf5a", 5), -0.2 + Math.cos(k * 2.1) * 0.3, 0.15, Math.sin(k * 2.1) * 0.3).scale.set(1, 0.4, 1); add(g, cone(0.06, 0.24, "#c9302a", 5), 0.4, 0.12, 0.1).rotation.z = 1.3; return g; },
  pulses: () => { const g = group(); for (let i = 0; i < 2; i++) { const sack = add(g, cyl(0.22, 0.18, 0.3, "#e9d7a8", 9), -0.25 + i * 0.5, 0.15, 0); add(sack, cyl(0.17, 0.17, 0.04, i ? "#3f4a3a" : "#e9d7a8", 9), 0, 0.17, 0); } return g; },
  spicesMed: () => { const g = group(); for (let i = 0; i < 4; i++) { add(g, cyl(0.12, 0.13, 0.08, "#8a6a3a", 8), -0.4 + i * 0.27, 0.04, (i % 2) * 0.15); add(g, cone(0.11, 0.24, ["#c9302a", "#e0b34c", "#e07a3a", "#8e2a22"][i], 8), -0.4 + i * 0.27, 0.2, (i % 2) * 0.15); } add(g, cyl(0.07, 0.06, 0.16, "#f2c14e", 6), 0.55, 0.08, -0.2); return g; },
  tagine: () => { const g = group(); add(g, cyl(0.38, 0.34, 0.14, MD.terracotta, 12), 0, 0.07, 0); add(g, cone(0.36, 0.5, MD.terracotta, 12), 0, 0.39, 0); add(g, ball(0.05, MD.terracotta, 5), 0, 0.66, 0); return g; },
  taverna: () => { const g = group(); add(g, cyl(0.3, 0.26, 0.05, "#f4f1ea", 12), 0, 0.02, 0); for (let k = 0; k < 6; k++) add(g, ball(0.06, ["#c9302a", "#6fb06a", "#f4f1ea", "#2f3a2a", "#c9302a", "#9b59b6"][k], 5), Math.cos(k * 1.05) * 0.15, 0.08, Math.sin(k * 1.05) * 0.15); add(g, box(0.18, 0.06, 0.12, "#f7f4ee"), 0, 0.12, 0); add(g, box(0.16, 0.02, 0.14, "#4f9a4a"), 0.05, 0.16, 0.02); add(g, cyl(0.05, 0.04, 0.16, "#e8f1f4", 6), 0.4, 0.08, -0.2); return g; },
  plancha: () => { const g = group(); add(g, cyl(0.42, 0.38, 0.06, "#5a5a5a", 16), 0, 0.03, 0); add(g, cyl(0.38, 0.38, 0.03, "#e0b34c", 16), 0, 0.07, 0); for (let k = 0; k < 5; k++) add(g, ball(0.05, "#f08a6a", 6), Math.cos(k * 1.25) * 0.24, 0.1, Math.sin(k * 1.25) * 0.24).scale.set(1.5, 0.6, 0.8); add(g, cyl(0.02, 0.02, 0.3, "#5a5a5a", 5), 0.5, 0.03, 0).rotation.z = Math.PI / 2; return g; },
  konoba: () => { const g = group(); add(g, dome(0.32, "#3a3a3d", 12), 0, 0.02, 0); add(g, box(0.6, 0.04, 0.04, "#3a3a3d"), 0, 0.34, 0); add(g, cyl(0.16, 0.13, 0.06, "#f4f1ea", 10), 0.5, 0.03, 0.15); for (let k = 0; k < 5; k++) add(g, box(0.08, 0.02, 0.03, "#e8f1d8"), 0.5 + Math.cos(k * 1.2) * 0.07, 0.08, 0.15 + Math.sin(k * 1.2) * 0.07).rotation.y = k; return g; },
  souk: () => { const g = group(); for (let i = 0; i < 3; i++) { add(g, cyl(0.12, 0.13, 0.08, "#8a6a3a", 8), -0.3 + i * 0.3, 0.04, 0); add(g, cone(0.11, 0.22, ["#c9302a", "#e0b34c", "#e07a3a"][i], 8), -0.3 + i * 0.3, 0.18, 0); } add(g, box(0.16, 0.05, 0.08, "#e0b34c"), 0.5, 0.03, -0.25); add(g, cone(0.04, 0.08, "#e0b34c", 4), 0.6, 0.03, -0.25).rotation.z = -1.3; return g; },
  mintTea: () => { const g = group(); add(g, cyl(0.16, 0.12, 0.26, "#c9cfd6", 8), -0.2, 0.13, 0); add(g, cone(0.05, 0.16, "#c9cfd6", 6), -0.2, 0.34, 0); add(g, cyl(0.02, 0.02, 0.3, "#c9cfd6", 4), -0.02, 0.2, 0).rotation.z = -0.8; for (let i = 0; i < 2; i++) add(g, cyl(0.06, 0.05, 0.14, "#6fb06a", 6), 0.25 + i * 0.2, 0.07, 0.1); add(g, ball(0.08, "#3f7a3a", 5), 0.35, 0.05, -0.25).scale.set(1.3, 0.7, 1); return g; },
  jemaa: () => { const g = group(); add(g, cyl(0.2, 0.17, 0.14, C.straw, 10), -0.2, 0.07, 0); add(g, cyl(0.05, 0.06, 0.5, "#6f7a4a", 6), -0.2, 0.35, 0); add(g, box(0.2, 0.22, 0.05, "#6f7a4a"), -0.2, 0.65, 0); add(g, cyl(0.02, 0.02, 0.4, MD.wood, 4), 0.3, 0.3, 0).rotation.z = 0.4; return g; },
  flamenco: () => { const g = group(); const s = add(g, cone(0.32, 0.45, "#c0392b", 14), 0, 0.22, 0); s.rotation.x = Math.PI; add(g, ball(0.12, C.skin, 7), 0, 0.62, 0); add(g, ball(0.06, "#c9302a", 5), 0.1, 0.7, 0.02); add(g, box(0.3, 0.2, 0.1, "#a37a4f"), 0.5, 0.15, 0.1); return g; },
};
