/** Central European props: London on the Thames, Budapest and the puszta on the Danube, the Alps, and Georgia by the Black Sea. Bubbles are English, with Hungarian / Georgian / German where local. */
import * as THREE from "three";
import { mat, add, rnd, C, person, cow, bubble, wear, tree, goat, type P } from "./props";
import { horse, car } from "./props-namerica";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate * 0.7); return k; } }; }
type Fig = P & { userData: { upper?: THREE.Group; walk?: (t: number) => void; sit?: () => void } };

export const CE = { brick: "#a8553a", stone: "#d9cfb6", limestone: "#e6dcc3", slate: "#4a4f5a", red: "#c0392b", busRed: "#c8281e", cab: "#1a1a1e", gold: "#d9a441", wood: "#7a5a3a", darkWood: "#4a3526", plaster: "#f3e9d2", green: "#3f6b3a", paprika: "#b7261b", ochre: "#e0b25e", white: "#f4f1ea", glass: "#9fc9dc", grey: "#8c9096" };

/** Someone in a bowler, a flat cap, a csikós hat, a Georgian papakha, an Alpine hat, or plain clothes. */
export function local(shirt: string, opts: { bowler?: boolean; flatCap?: boolean; csikos?: boolean; papakha?: boolean; alpine?: boolean; apron?: boolean; brolly?: boolean; scarf?: string } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.bowler) { wear(p, cyl(0.24, 0.26, 0.04, "#1a1a1e", 12), 0, 1.19, 0); wear(p, ball(0.16, "#1a1a1e", 8), 0, 1.24, 0).scale.y = 0.8; }
  if (opts.flatCap) { wear(p, ball(0.17, "#6b5a4a", 8), 0, 1.2, 0).scale.set(1, 0.55, 1); wear(p, box(0.24, 0.03, 0.14, "#6b5a4a"), 0, 1.2, 0.18); }
  if (opts.csikos) { wear(p, cyl(0.34, 0.36, 0.04, "#1a1a1e", 12), 0, 1.19, 0); wear(p, cyl(0.15, 0.16, 0.16, "#1a1a1e", 10), 0, 1.28, 0); }
  if (opts.papakha) wear(p, cyl(0.2, 0.19, 0.22, "#3a3230", 10), 0, 1.28, 0);
  if (opts.alpine) { wear(p, cyl(0.2, 0.22, 0.04, "#4a6b3a", 10), 0, 1.19, 0); wear(p, cone(0.15, 0.22, "#4a6b3a", 8), 0, 1.3, 0); wear(p, box(0.02, 0.16, 0.02, CE.white), 0.13, 1.32, 0).rotation.z = -0.5; }
  if (opts.brolly) { const u = new THREE.Group(); add(u, cyl(0.02, 0.02, 1.2, "#1a1a1e", 4), 0, 0.6, 0); add(u, cone(0.42, 0.18, "#1a1a1e", 10), 0, 1.25, 0); u.position.set(0.32, 0.3, 0); p.add(u); }
  if (opts.scarf) wear(p, cyl(0.15, 0.15, 0.1, opts.scarf, 8), 0, 0.98, 0);
  return p;
}

// ---------- London ----------

/** Big Ben and a wing of the Palace of Westminster. */
export function bigBen(): P {
  const g = group();
  add(g, box(2.0, 9, 2.0, CE.limestone), 0, 4.5, 0); for (let k = 0; k < 6; k++) for (const sd of [-1, 1]) { add(g, box(0.3, 0.7, 0.04, "#5a6a7a"), sd * 0.5, 1.2 + k * 1.2, 1.02); add(g, box(0.04, 0.7, 0.3, "#5a6a7a"), 1.02, 1.2 + k * 1.2, sd * 0.5); }
  for (const rot of [0, 1, 2, 3]) { const face = new THREE.Group(); face.rotation.y = rot * Math.PI / 2; face.position.y = 9.4; g.add(face); add(face, cyl(0.7, 0.7, 0.06, CE.white, 16), 0, 0, 1.02).rotation.x = Math.PI / 2; add(face, new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 5, 16), mat(CE.gold)), 0, 0, 1.03); const h = add(face, box(0.05, 0.42, 0.02, "#1a1a1e"), 0, 0.18, 1.06); h.rotation.z = 0.9; const m = add(face, box(0.04, 0.6, 0.02, "#1a1a1e"), 0, 0.26, 1.07); (face.userData as { m?: THREE.Mesh }).m = m; }
  add(g, box(2.2, 1.0, 2.2, CE.limestone), 0, 10.4, 0); add(g, cone(1.5, 2.6, CE.slate, 4), 0, 12.2, 0).rotation.y = Math.PI / 4; add(g, cyl(0.03, 0.05, 1.4, CE.gold, 4), 0, 14.2, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cone(0.18, 0.9, CE.limestone, 4), sx * 0.95, 11.3, sz * 0.95);
  add(g, box(5, 3.2, 3.0, CE.limestone), 3.6, 1.6, 0); add(g, box(5.2, 0.3, 3.2, CE.slate), 3.6, 3.35, 0); for (let k = 0; k < 6; k++) { add(g, box(0.25, 1.0, 0.04, "#5a6a7a"), 1.5 + k * 0.85, 1.2, 1.52); add(g, box(0.25, 1.0, 0.04, "#5a6a7a"), 1.5 + k * 0.85, 2.4, 1.52); add(g, cone(0.15, 0.7, CE.limestone, 4), 1.5 + k * 0.85, 3.8, 1.3); }
  add(g, box(1.6, 4.4, 1.6, CE.limestone), 6.9, 2.2, 0); add(g, box(1.8, 0.5, 1.8, CE.limestone), 6.9, 4.6, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cone(0.16, 0.8, CE.limestone, 4), 6.9 + sx * 0.75, 5.2, sz * 0.75);   // Victoria Tower
  g.userData.tick = (t) => { g.traverse((c) => { const m = (c.userData as { m?: THREE.Mesh }).m; if (m) m.rotation.z = -t * 0.3; }); };
  return g;
}

/** Tower Bridge: two Gothic towers, walkways above, a bascule deck that lifts when poked. */
export function towerBridge(len = 8): P {
  const g = group();
  const c = CE.limestone;
  for (const sd of [-1, 1]) { const x = sd * len * 0.28; add(g, box(1.6, 6.5, 1.8, c), x, 3.25, 0); add(g, box(1.8, 0.5, 2.0, c), x, 6.7, 0); add(g, cone(1.0, 1.6, CE.slate, 4), x, 7.7, 0).rotation.y = Math.PI / 4; for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cone(0.18, 1.0, c, 4), x + sx * 0.7, 7.3, sz * 0.7); for (let k = 0; k < 4; k++) add(g, box(0.3, 0.6, 0.04, "#5a6a7a"), x, 1.5 + k * 1.3, 0.92); add(g, box(2.0, 0.6, 2.4, "#8f857a"), x, 0.3, 0); }
  add(g, box(len * 0.56, 0.4, 1.6, "#3f6fb5"), 0, 4.4, 0); add(g, box(len * 0.56, 0.06, 1.7, c), 0, 4.65, 0);   // the walkways
  for (const sd of [-1, 1]) { add(g, box(len * 0.25, 0.3, 2.6, "#3f6fb5"), sd * (len * 0.28 + len * 0.16), 0.75, 0); add(g, box(len * 0.25, 0.45, 2.4, "#8f857a"), sd * (len * 0.28 + len * 0.16), 0.3, 0); for (let k = 0; k < 4; k++) add(g, cyl(0.02, 0.02, 3.2 + k * 0.7, CE.white, 3), sd * (len * 0.28 + 1.0 + k * 0.5), 3.3 + k * 0.35, 1.0); }   // the approaches with their chains
  const leaves: THREE.Mesh[] = []; for (const sd of [-1, 1]) { const leaf = box(len * 0.2, 0.3, 2.6, "#3f6fb5"); leaf.geometry.translate(-sd * len * 0.1, 0, 0); leaf.position.set(sd * len * 0.2, 0.75, 0); g.add(leaf); leaves.push(leaf); }
  const re = reaction(0.4);
  g.userData.poke = () => { re.poke(); bubble(g, "Bridge lift!", 6.6, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); leaves.forEach((l, i) => { l.rotation.z = (i ? -1 : 1) * Math.sin(Math.min(1, k) * Math.PI) * 0.9; }); };
  return g;
}

export function londonEye(): P {
  const g = group();
  for (const sd of [-1, 1]) add(g, cyl(0.08, 0.12, 5.5, CE.white, 5), sd * 0.6, 2.75, 1.0).rotation.set(0.35, 0, sd * 0.2);
  const wheel = new THREE.Group(); wheel.position.y = 5.5; g.add(wheel);
  add(wheel, new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.07, 6, 32), mat(CE.white)), 0, 0, 0);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(wheel, cyl(0.02, 0.02, 4.0, CE.white, 3), Math.cos(a) * 2, Math.sin(a) * 2, 0).rotation.z = a + Math.PI / 2; }
  const pods: THREE.Mesh[] = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const p = add(wheel, ball(0.32, CE.glass, 8), Math.cos(a) * 4.1, Math.sin(a) * 4.1, 0); p.scale.set(1.3, 0.8, 0.8); pods.push(p); }
  g.userData.tick = (t) => { wheel.rotation.z = t * 0.12; pods.forEach((p) => { p.rotation.z = -wheel.rotation.z; }); };
  return g;
}

export function redBus(): P {
  const g = group();
  add(g, box(3.4, 1.1, 1.2, CE.busRed), 0, 0.85, 0); add(g, box(3.4, 1.0, 1.2, CE.busRed), 0, 1.9, 0); add(g, box(3.4, 0.08, 1.24, "#f4f1ea"), 0, 1.38, 0); add(g, box(3.42, 0.06, 1.26, "#8a1a12"), 0, 2.42, 0);
  for (let k = 0; k < 5; k++) for (const sd of [-1, 1]) { add(g, box(0.45, 0.45, 0.04, CE.glass), -1.3 + k * 0.62, 0.95, sd * 0.62); add(g, box(0.45, 0.45, 0.04, CE.glass), -1.3 + k * 0.62, 2.0, sd * 0.62); } add(g, box(0.04, 0.55, 1.0, CE.glass), 1.72, 0.95, 0); add(g, box(0.04, 0.5, 1.0, CE.glass), 1.72, 2.0, 0); add(g, box(0.9, 0.24, 0.02, "#1a1a1e"), 1.1, 2.3, 0.63); add(g, box(0.7, 0.14, 0.01, CE.ochre), 1.1, 2.3, 0.65);
  for (const x of [-1.1, 1.1]) for (const z of [-0.55, 0.55]) add(g, cyl(0.24, 0.24, 0.16, "#2a2a2e", 10), x, 0.24, z).rotation.x = Math.PI / 2;
  return g;
}

export function phoneBox(): P {
  const g = group();
  add(g, box(0.7, 1.8, 0.7, CE.busRed), 0, 0.9, 0); for (const rot of [0, 1, 2, 3]) { const f = new THREE.Group(); f.rotation.y = rot * Math.PI / 2; g.add(f); for (let k = 0; k < 3; k++) add(f, box(0.5, 0.35, 0.02, CE.glass), 0, 0.6 + k * 0.42, 0.36); add(f, box(0.5, 0.12, 0.02, "#1a1a1e"), 0, 1.65, 0.36); }
  add(g, box(0.8, 0.12, 0.8, CE.busRed), 0, 1.86, 0); add(g, ball(0.34, CE.busRed, 6), 0, 1.9, 0).scale.y = 0.35; add(g, box(0.16, 0.06, 0.16, CE.busRed), 0, 2.05, 0);
  add(g, cyl(0.16, 0.16, 1.0, CE.busRed, 10), 1.0, 0.5, 0.2); add(g, ball(0.18, CE.busRed, 6), 1.0, 1.02, 0.2).scale.y = 0.6; add(g, box(0.2, 0.03, 0.04, "#1a1a1e"), 1.0, 0.85, 0.37);   // the pillar box
  return g;
}

/** A London pub with a carvery: a Wellington on the board, Sunday roast, Yorkshire puddings, pints at the bar, a garden bench. */
export function pub(): P {
  const g = group();
  add(g, box(5.2, 2.6, 3.2, CE.brick), 0, 1.3, -1.4); add(g, box(5.6, 0.14, 3.6, CE.slate), 0, 2.67, -1.4); for (const sd of [-1, 1]) add(g, box(5.6, 0.12, 2.0, CE.slate), 0, 3.1, -1.4 + sd * 0.85).rotation.x = -sd * 0.5; add(g, box(0.5, 1.0, 0.5, CE.brick), -1.8, 3.6, -1.6);
  add(g, box(5.2, 0.7, 0.06, "#1f3a1a"), 0, 0.35 + 1.75, 0.23); add(g, box(3.2, 0.36, 0.02, CE.gold), 0, 2.1, 0.27);   // the fascia
  for (let k = 0; k < 3; k++) { add(g, box(0.9, 1.0, 0.05, "#2a3a2a"), -1.6 + k * 1.6, 1.0, 0.23); add(g, box(0.7, 0.8, 0.02, "#f2e6a0"), -1.6 + k * 1.6, 1.0, 0.26); } add(g, box(0.8, 1.5, 0.05, "#2a3a2a"), 2.0, 0.75, 0.23);
  for (let k = 0; k < 4; k++) { const hb = add(g, box(0.5, 0.25, 0.3, "#3f6b3a"), -1.9 + k * 1.3, 1.62, 0.36); for (let f = 0; f < 4; f++) add(hb, ball(0.06, [CE.red, "#e8558a", CE.white, "#9b59b6"][f], 5), -0.18 + f * 0.12, 0.16, 0.05); }   // hanging baskets
  add(g, cyl(0.03, 0.03, 1.2, "#1a1a1e", 4), 2.8, 2.2, 0.3); add(g, box(0.9, 0.7, 0.04, "#1f3a1a"), 2.8, 2.1, 0.75).rotation.y = Math.PI / 2; add(g, box(0.7, 0.5, 0.02, CE.gold), 2.83, 2.1, 0.75).rotation.y = Math.PI / 2;   // the hanging sign
  add(g, box(3.6, 0.8, 0.7, CE.darkWood), -0.4, 0.4, 0.9); add(g, box(3.8, 0.06, 0.9, "#c9a86a"), -0.4, 0.83, 0.9);   // the carvery counter
  const board = add(g, box(0.9, 0.05, 0.5, "#a37a4f"), -1.6, 0.89, 0.9); const welly = add(g, box(0.7, 0.28, 0.32, "#c9862a"), -1.6, 1.05, 0.9); for (let k = 0; k < 4; k++) add(welly, box(0.02, 0.29, 0.33, "#b8782a"), -0.25 + k * 0.17, 0, 0); const slice = add(g, box(0.1, 0.24, 0.3, "#c9862a"), -1.15, 1.02, 0.9); add(slice, box(0.06, 0.16, 0.22, "#8e3a3a"), 0, 0, 0); void board;   // the Wellington and a slice showing pink beef
  add(g, cyl(0.24, 0.24, 0.24, "#7a3a2a", 12), -0.4, 0.98, 0.85); for (let k = 0; k < 4; k++) add(g, cyl(0.1, 0.08, 0.1, "#e0b060", 8), 0.2 + (k % 2) * 0.25, 0.9, 0.75 + Math.floor(k / 2) * 0.25); add(g, box(0.4, 0.06, 0.3, "#3f8f5a"), 0.9, 0.9, 0.9); add(g, cyl(0.08, 0.06, 0.16, "#8a5a2a", 8), 1.2, 0.94, 1.05);   // the roast, the Yorkshires, greens, gravy
  for (let k = 0; k < 3; k++) { add(g, cyl(0.07, 0.06, 0.24, "#e0a52c", 8), -1.9 + k * 0.3, 0.98, 1.2); add(g, cyl(0.07, 0.07, 0.04, CE.white, 8), -1.9 + k * 0.3, 1.12, 1.2); }   // pints
  const carver = local(CE.white, { apron: true }); add(g, carver, -1.2, 0, 0.3); const knife = add(g, box(0.03, 0.02, 0.32, CE.grey), -1.4, 1.15, 0.7);
  add(g, box(2.0, 0.08, 0.7, CE.darkWood), 1.4, 0.72, 2.6); for (const z of [2.2, 3.0]) add(g, box(2.0, 0.06, 0.3, CE.darkWood), 1.4, 0.45, z); for (const x of [0.6, 2.2]) add(g, box(0.08, 0.7, 1.1, CE.darkWood), x, 0.35, 2.6);
  const drinkers: Fig[] = []; for (let i = 0; i < 4; i++) { const d = local(pick([CE.white, "#3f5f8f", "#2a2a2e", "#8a2a2a"]), { flatCap: i === 1, bowler: i === 2 }); d.userData.sit?.(); add(g, d, 0.9 + (i % 2) * 1.0, 0.04, i < 2 ? 2.05 : 3.15).rotation.y = i < 2 ? 0 : Math.PI; drinkers.push(d); }
  add(g, box(0.9, 0.7, 0.7, "#2a2a2e"), -2.4, 0.35, 2.0); add(g, cyl(0.4, 0.4, 0.06, "#c9a86a", 10), -2.4, 0.73, 2.0);
  g.userData.steam = new THREE.Vector3(-0.4, 1.3, 0.85);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(carver, "Carving the Wellington!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); knife.position.y = 1.15 + k * Math.abs(Math.sin(t * 12)) * 0.2; welly.position.y = 1.05 + k * Math.max(0, Math.sin(t * 8)) * 0.25; slice.rotation.y = k * Math.sin(t * 8) * 0.6; drinkers.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.1 - k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (carver.userData.upper) carver.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** A patisserie with butter puff pastry: croissants, a rolling pin, a laminated block, a baker. */
export function bakeryCe(): P {
  const g = group();
  add(g, box(3.6, 2.4, 2.6, CE.plaster), 0, 1.2, -1.2); add(g, box(3.9, 0.14, 2.9, CE.slate), 0, 2.47, -1.2); for (const sd of [-1, 1]) add(g, box(3.9, 0.1, 1.6, CE.slate), 0, 2.85, -1.2 + sd * 0.7).rotation.x = -sd * 0.5;
  add(g, box(3.6, 0.6, 0.06, "#3f5f8f"), 0, 2.05, 0.13); add(g, box(2.2, 0.3, 0.02, CE.gold), 0, 2.05, 0.17); for (let k = 0; k < 2; k++) add(g, box(1.2, 1.1, 0.05, CE.glass), -0.9 + k * 1.8, 1.0, 0.13);
  for (let k = 0; k < 4; k++) add(g, box(0.62, 0.06, 1.2, k % 2 ? CE.white : "#3f5f8f"), -0.95 + k * 0.63, 1.8, 0.7).rotation.x = 0.25;
  add(g, box(2.8, 0.8, 0.6, CE.wood), 0, 0.4, 0.7); add(g, box(3.0, 0.06, 0.8, "#c9c2b0"), 0, 0.83, 0.7);
  const block = add(g, box(0.5, 0.16, 0.4, "#f2e2b8"), -1.0, 0.94, 0.7); for (let k = 0; k < 5; k++) add(block, box(0.5, 0.01, 0.4, "#e9c46a"), 0, -0.07 + k * 0.035, 0); const pin = add(g, cyl(0.05, 0.05, 0.6, "#c9a86a", 8), -1.0, 1.1, 0.7); pin.rotation.z = Math.PI / 2;
  for (let k = 0; k < 4; k++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.05, 6, 8, Math.PI * 1.4), mat("#d9a441")), -0.2 + k * 0.28, 0.9, 0.6 + (k % 2) * 0.2).rotation.x = Math.PI / 2;   // croissants
  add(g, cyl(0.2, 0.18, 0.08, CE.white, 12), 1.0, 0.9, 0.8); add(g, cyl(0.16, 0.16, 0.06, "#c9862a", 12), 1.0, 0.97, 0.8); for (let k = 0; k < 4; k++) add(g, ball(0.03, CE.red, 4), 1.0 + Math.cos(k * 1.6) * 0.08, 1.02, 0.8 + Math.sin(k * 1.6) * 0.08);   // a tart
  const baker = local(CE.white, { apron: true }); add(g, baker, 0.3, 0, 0.1); wear(baker, cyl(0.16, 0.17, 0.14, CE.white, 10), 0, 1.22, 0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(baker, "Puff pastry, thirty-two layers!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pin.position.x = -1.0 + k * Math.sin(t * 8) * 0.25; block.scale.y = 1 + k * Math.sin(t * 8) * 0.3; if (baker.userData.upper) baker.userData.upper.rotation.x = k * Math.abs(Math.sin(t * 8)) * 0.3; };
  return g;
}

/** A patch of woodland with mushrooms and a forager with a basket. */
export function mushroomWood(): P {
  const g = group();
  for (let i = 0; i < 5; i++) place(tree(i % 2 ? "round" : "pine", 0.9 + (i % 3) * 0.15), -2.6 + i * 1.3, -0.6 + (i % 2) * 1.6, i);
  function place(o: THREE.Object3D, x: number, z: number, rot: number) { o.position.set(x, 0, z); o.rotation.y = rot; g.add(o); }
  const shrooms: THREE.Group[] = [];
  for (let i = 0; i < 9; i++) { const m = new THREE.Group(); m.position.set(-3 + (i % 5) * 1.5 + (i % 2) * 0.4, 0, 0.6 + Math.floor(i / 5) * 1.2 + (i % 3) * 0.3); g.add(m); shrooms.push(m); const kind = i % 3; add(m, cyl(0.05, 0.06, 0.24, "#f1ece2", 6), 0, 0.12, 0); const cap = add(m, ball(kind === 0 ? 0.16 : 0.12, kind === 0 ? "#8a5a3a" : kind === 1 ? "#c9a86a" : "#e0a52c", 8), 0, 0.26, 0); cap.scale.y = 0.55; }
  const forager = local("#2f5d3f", { flatCap: true }); add(g, forager, 1.4, 0, 1.8); forager.rotation.y = -0.8; add(g, cyl(0.24, 0.2, 0.26, C.straw, 9), 2.0, 0.13, 2.2); for (let k = 0; k < 4; k++) add(g, ball(0.08, "#8a5a3a", 5), 2.0 + (k % 2) * 0.15 - 0.07, 0.3, 2.2 + Math.floor(k / 2) * 0.14 - 0.07).scale.y = 0.6;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(forager, "Ceps and chestnuts!", 1.4, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); shrooms.forEach((m, i) => { m.scale.setScalar(1 + k * Math.max(0, Math.sin(t * 8 + i)) * 0.4); }); if (forager.userData.upper) forager.userData.upper.rotation.x = 0.3 + k * Math.sin(t * 6) * 0.3; };
  return g;
}

// ---------- Budapest & the puszta ----------

/** The Hungarian Parliament: a great dome flanked by spires along the Danube. */
export function parliamentHu(): P {
  const g = group();
  const c = CE.limestone;
  add(g, box(11, 2.8, 3.2, c), 0, 1.4, 0); add(g, box(11.3, 0.2, 3.5, "#6a4a3a"), 0, 2.9, 0);
  for (let k = 0; k < 14; k++) { add(g, box(0.3, 1.2, 0.04, "#5a6a7a"), -5.0 + k * 0.77, 1.3, 1.62); add(g, box(0.3, 0.8, 0.04, "#5a6a7a"), -5.0 + k * 0.77, 2.4, 1.62); }
  for (let k = 0; k < 12; k++) add(g, cone(0.14, 0.9, c, 4), -4.8 + k * 0.87, 3.4, 1.4);
  add(g, box(3.4, 2.4, 3.4, c), 0, 4.2, 0); add(g, new THREE.Mesh(new THREE.SphereGeometry(1.7, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat("#8a3a2a")), 0, 5.4, 0); add(g, cyl(0.16, 0.24, 1.6, "#8a3a2a", 8), 0, 7.8, 0); add(g, cyl(0.03, 0.05, 1.0, CE.gold, 4), 0, 9.0, 0);
  for (const sd of [-1, 1]) { add(g, box(1.6, 3.6, 1.6, c), sd * 4.2, 3.4, 0); add(g, cone(1.0, 2.0, "#8a3a2a", 4), sd * 4.2, 6.2, 0).rotation.y = Math.PI / 4; for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cone(0.14, 0.8, c, 4), sd * 4.2 + sx * 0.7, 5.5, sz * 0.7); }
  for (let k = 0; k < 6; k++) add(g, box(0.3, 0.7, 0.04, "#5a6a7a"), -1.2 + k * 0.5, 4.2, 1.72);
  add(g, box(11.4, 0.14, 1.2, CE.stone), 0, 0.07, 2.2);   // the embankment
  return g;
}

/** The Chain Bridge: two stone arches, chains, and its lions. */
export function chainBridge(len = 8): P {
  const g = group();
  add(g, box(len + 2, 0.3, 2.6, "#5a5a5a"), 0, 0.75, 0); for (const sd of [-1, 1]) add(g, box(len + 2, 0.4, 0.06, "#4a4a50"), 0, 1.05, sd * 1.27);
  for (const sd of [-1, 1]) { const x = sd * len * 0.28; add(g, box(1.4, 4.5, 2.8, CE.stone), x, 2.25, 0); add(g, box(1.6, 0.3, 3.0, CE.stone), x, 4.6, 0); add(g, box(1.6, 0.6, 3.0, "#8f857a"), x, 0.3, 0); }
  const cable = (x0: number, x1: number, y0: number, y1: number, sag: number, z: number) => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(new THREE.Vector3(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * sag, z)); } g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.07, 5, false), mat("#3a3a3d"))); };
  for (const z of [-1.2, 1.2]) { cable(-len * 0.28, len * 0.28, 4.5, 4.5, 1.8, z); cable(-len / 2 - 1, -len * 0.28, 1.1, 4.5, 0.3, z); cable(len * 0.28, len / 2 + 1, 4.5, 1.1, 0.3, z); }
  for (const sd of [-1, 1]) for (const sz of [-1, 1]) { const lion = add(g, box(0.5, 0.35, 0.3, "#8f857a"), sd * (len / 2 + 0.6), 1.1, sz * 1.05); add(lion, box(0.24, 0.26, 0.26, "#8f857a"), -sd * 0.28, 0.2, 0); add(lion, ball(0.18, "#7a6a5a", 6), -sd * 0.3, 0.22, 0); }
  for (const sd of [-1, 1]) add(g, box(2.2, 0.6, 2.8, CE.stone), sd * (len / 2 + 0.6), 0.3, 0);
  return g;
}

/** Széchenyi baths: yellow baroque wings around a pool where bathers play chess. Water is added by the layout. */
export function thermalBath(): P {
  const g = group();
  const y = "#e8c25a";
  add(g, box(9, 2.4, 2.2, y), 0, 1.2, -3.2); add(g, box(9.4, 0.16, 2.5, "#6a4a3a"), 0, 2.5, -3.2); add(g, box(2.2, 1.2, 2.2, y), 0, 3.2, -3.2); add(g, new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat("#4f8f7a")), 0, 3.8, -3.2);
  for (let k = 0; k < 8; k++) add(g, box(0.5, 1.1, 0.04, "#5a6a7a"), -3.5 + k * 1.0, 1.3, -2.08); for (const sd of [-1, 1]) { add(g, box(2.2, 2.4, 6.0, y), sd * 3.9, 1.2, 0.2); add(g, box(2.5, 0.16, 6.3, "#6a4a3a"), sd * 3.9, 2.5, 0.2); for (let k = 0; k < 4; k++) add(g, box(0.04, 1.1, 0.5, "#5a6a7a"), sd * 2.78, 1.3, -1.6 + k * 1.2); }
  add(g, box(5.8, 0.2, 5.4, CE.stone), 0, 0.1, 0.6);   // the pool deck; the water disc goes on top
  const bathers: THREE.Group[] = []; for (let i = 0; i < 4; i++) { const b = new THREE.Group(); b.position.set(-1.5 + (i % 2) * 3.0, 0.2, -0.4 + Math.floor(i / 2) * 1.4); g.add(b); bathers.push(b); add(b, box(0.4, 0.3, 0.3, ["#e9b8a5", "#8a5a3a", "#e9b8a5", "#c9a086"][i]), 0, 0.3, 0); const head = add(b, ball(0.16, ["#e9b8a5", "#8a5a3a", "#e9b8a5", "#c9a086"][i], 7), 0, 0.6, 0); add(head, box(0.34, 0.14, 0.34, ["#c0392b", "#f4f1ea", "#2f6fb5", "#2a2a2e"][i]), 0, 0.12, 0); }
  const board = add(g, box(0.6, 0.06, 0.6, CE.white), 0, 0.42, 0.3); for (let k = 0; k < 8; k++) add(board, box(0.14, 0.01, 0.14, "#2a2a2e"), -0.22 + (k % 4) * 0.15 + (Math.floor(k / 4) % 2) * 0.075, 0.035, -0.22 + Math.floor(k / 4) * 0.3); for (let k = 0; k < 6; k++) add(board, cyl(0.03, 0.03, 0.1, k % 2 ? "#2a2a2e" : CE.white, 6), -0.2 + (k % 3) * 0.2, 0.08, (k < 3 ? -0.2 : 0.2));   // chess in the pool
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(bathers[0], "Sakk! Check!", 1.0, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); bathers.forEach((b, i) => { b.position.y = 0.2 + Math.sin(t * 1.4 + i) * 0.02 + k * Math.abs(Math.sin(t * 8 + i)) * 0.25; }); board.rotation.y += k * dt * 3; };
  return g;
}

/** A puszta farmstead: whitewashed house with a reed roof, paprika strings drying, a well sweep, geese. */
export function pusztaFarm(): P {
  const g = group();
  add(g, box(5.0, 2.0, 2.8, CE.white), 0, 1.0, -1.0); for (const sd of [-1, 1]) add(g, box(5.4, 0.16, 2.0, "#c9b784"), 0, 2.5, -1.0 + sd * 0.8).rotation.x = -sd * 0.5; add(g, box(5.4, 0.1, 0.3, "#a89c6a"), 0, 2.98, -1.0);
  for (let k = 0; k < 3; k++) add(g, box(0.5, 0.6, 0.04, "#3f6fb5"), -1.6 + k * 1.6, 1.1, 0.42); add(g, box(0.6, 1.3, 0.04, "#3f6fb5"), 0.8, 0.65, 0.42);
  for (const x of [-2.2, -1.2, 1.5, 2.2]) for (let k = 0; k < 8; k++) add(g, ball(0.06, CE.paprika, 5), x + (k % 2) * 0.05, 1.9 - k * 0.18, 0.45).scale.set(0.7, 1.4, 0.7);   // paprika strings under the eaves
  add(g, cyl(0.1, 0.12, 3.6, CE.wood, 6), 3.6, 1.8, 0.8); const sweep = add(g, box(4.2, 0.1, 0.1, CE.wood), 3.6, 3.6, 0.8); sweep.geometry.translate(0.6, 0, 0); sweep.rotation.z = 0.35; add(sweep, cyl(0.02, 0.02, 1.6, CE.wood, 4), 2.6, -0.8, 0); add(sweep, cyl(0.12, 0.1, 0.24, "#5a5a5a", 8), 2.6, -1.6, 0); add(sweep, box(0.5, 0.4, 0.4, "#8f857a"), -1.4, 0, 0); add(g, cyl(0.5, 0.5, 0.6, CE.stone, 10), 5.0, 0.3, 0.8);   // the gémeskút well sweep
  const geese: THREE.Group[] = []; for (let i = 0; i < 4; i++) { const gs = new THREE.Group(); gs.position.set(-2.4 + i * 0.7, 0, 1.6 + (i % 2) * 0.5); gs.rotation.y = i; g.add(gs); geese.push(gs); add(gs, ball(0.16, CE.white, 7), 0, 0.28, 0).scale.set(1.4, 0.9, 1); add(gs, cyl(0.04, 0.05, 0.3, CE.white, 5), 0.16, 0.5, 0); add(gs, ball(0.08, CE.white, 6), 0.18, 0.66, 0); add(gs, cone(0.03, 0.12, "#f08a2a", 4), 0.28, 0.65, 0).rotation.z = -Math.PI / 2; for (const z of [-0.06, 0.06]) add(gs, box(0.03, 0.14, 0.03, "#f08a2a"), 0, 0.07, z); }
  const farmer = local("#3f5f8f", { flatCap: true, apron: true }); add(g, farmer, -3.2, 0, 1.4); farmer.rotation.y = 0.8;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(geese[1], "Gá-gá! Honk!", 1.0, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); geese.forEach((gs, i) => { gs.position.y = k * Math.abs(Math.sin(t * 12 + i)) * 0.3; gs.rotation.z = k * Math.sin(t * 16 + i) * 0.15; }); sweep.rotation.z = 0.35 + k * Math.sin(t * 3) * 0.2; };
  return g;
}

/** Hungarian grey cattle with long lyre horns, a csikós rider cracking his whip. */
export function greyCattle(): P {
  const g = group();
  const cattle: P[] = [];
  for (let i = 0; i < 3; i++) { const c = cow(false, false, "Múúú! Moo!"); c.traverse((o) => { if (o instanceof THREE.Mesh) { const col = (o.material as THREE.MeshStandardMaterial).color.getHexString(); if (col !== "e9b8a5" && col !== "e8dcc2") (o.material as THREE.MeshStandardMaterial) = mat("#d9d3c4") as THREE.MeshStandardMaterial; } }); for (const sd of [-1, 1]) { const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 1.2, 6), mat("#e9e0c8")); horn.position.set(0.95, 1.6, sd * 0.4); horn.rotation.set(sd * 0.6, 0, 0.3); c.add(horn); add(horn, cone(0.04, 0.2, "#5a4a3a", 4), 0, 0.65, 0); } c.position.set(-2.2 + i * 2.0, 0, -0.4 + (i % 2) * 1.6); c.rotation.y = i * 1.5; g.add(c); cattle.push(c); }
  const mount = horse("#3a2a1e"); mount.position.set(3.4, 0, 1.2); mount.rotation.y = 0.5; g.add(mount); const rider = local("#3f5f8f", { csikos: true }); rider.userData.sit?.(); add(mount, rider, 0, 1.3, 0); rider.rotation.y = Math.PI / 2; rider.scale.setScalar(0.9); add(rider, box(0.5, 0.7, 0.4, CE.white), 0, 0.4, 0);   // the wide white gatya trousers
  const whip = add(rider, cyl(0.015, 0.015, 1.4, CE.darkWood, 3), 0.3, 1.2, 0.2); whip.rotation.z = -0.6;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(rider, "Hajrá! Yah!", 1.6, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); whip.rotation.z = -0.6 + k * Math.sin(t * 14) * 1.2; mount.userData.gait?.(t, k); cattle.forEach((c, i) => { c.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.12; }); tickChildren(g)(t, dt); };
  return g;
}

/** Goulash in a bogrács: the kettle on a tripod over an open fire, the cook stirring, bread and paprika on a trestle. */
export function bogracs(): P {
  const g = group();
  for (let k = 0; k < 8; k++) add(g, ball(0.16, "#8f857a", 6), Math.cos(k * 0.78) * 0.7, 0.1, Math.sin(k * 0.78) * 0.7).scale.y = 0.7;
  const flames: THREE.Mesh[] = []; for (let k = 0; k < 4; k++) { const f = add(g, cone(0.18, 0.5, k % 2 ? "#f08a2a" : "#f2c14e", 6), Math.cos(k * 1.6) * 0.2, 0.35, Math.sin(k * 1.6) * 0.2); flames.push(f); }
  for (let k = 0; k < 3; k++) add(g, cyl(0.06, 0.06, 1.0, "#5a3d28", 5), Math.cos(k * 2.1) * 0.3, 0.16, Math.sin(k * 2.1) * 0.3).rotation.set(0.3, k * 2.1, Math.PI / 2);
  for (let k = 0; k < 3; k++) add(g, cyl(0.04, 0.04, 2.6, CE.darkWood, 5), Math.cos(k * 2.1) * 0.9, 1.3, Math.sin(k * 2.1) * 0.9).rotation.set(-Math.sin(k * 2.1) * 0.35, 0, Math.cos(k * 2.1) * 0.35);
  add(g, cyl(0.02, 0.02, 0.8, "#2a2a2e", 4), 0, 2.1, 0);
  const kettle = new THREE.Group(); kettle.position.y = 1.2; g.add(kettle); add(kettle, cyl(0.5, 0.35, 0.6, "#2a2a2e", 12), 0, 0, 0); add(kettle, cyl(0.46, 0.46, 0.06, "#b0341e", 12), 0, 0.3, 0); for (let k = 0; k < 6; k++) add(kettle, ball(0.06, k % 2 ? "#e07a3a" : "#8e3a2a", 5), Math.cos(k * 1.05) * 0.25, 0.34, Math.sin(k * 1.05) * 0.25); add(kettle, new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 5, 12, Math.PI), mat("#2a2a2e")), 0, 0.3, 0);
  const spoon = add(g, cyl(0.03, 0.03, 1.4, CE.wood, 4), 0.4, 2.0, 0.3); spoon.rotation.z = 0.5;
  const cook = local(CE.white, { csikos: true, apron: true }); add(g, cook, 1.4, 0, 0.9); cook.rotation.y = -2.2;
  add(g, box(2.4, 0.08, 0.8, CE.wood), -2.2, 0.75, 0.6); for (const x of [-3.2, -1.2]) add(g, box(0.1, 0.7, 0.7, CE.wood), x, 0.37, 0.6); add(g, ball(0.28, "#d9a441", 8), -2.8, 0.95, 0.6).scale.y = 0.6; add(g, cyl(0.16, 0.14, 0.14, CE.white, 8), -2.2, 0.85, 0.5); for (let k = 0; k < 5; k++) add(g, ball(0.06, CE.paprika, 5), -1.8 + (k % 3) * 0.15, 0.84, 0.4 + Math.floor(k / 3) * 0.2).scale.set(0.7, 1.4, 0.7); add(g, cyl(0.06, 0.06, 0.3, "#3f5f8f", 8), -1.4, 0.95, 0.8);   // bread, sour cream, paprika, a bottle
  const eaters: Fig[] = []; for (let i = 0; i < 2; i++) { const e = local(pick([CE.white, "#3f5f8f", "#8a2a2a"]), { flatCap: i === 0 }); e.userData.sit?.(); add(g, e, -2.7 + i * 1.0, 0.04, 1.5).rotation.y = Math.PI; eaters.push(e); add(g, box(0.5, 0.3, 0.3, CE.wood), -2.7 + i * 1.0, 0.15, 1.5); }
  g.userData.smoke = new THREE.Vector3(0, 1.9, 0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Gulyás! Goulash!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); flames.forEach((f, i) => { f.scale.setScalar(0.85 + Math.sin(t * 9 + i) * 0.15 + k * 0.6); f.rotation.y = t * 2 + i; }); spoon.rotation.y = t * (0.5 + k * 6); kettle.rotation.z = Math.sin(t * 1.5) * 0.02 + k * Math.sin(t * 8) * 0.1; eaters.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); };
  return g;
}

/** A paprika drying house: garlands of red peppers on the whitewashed wall, a mill, sacks of ground paprika. */
export function paprikaHouse(): P {
  const g = group();
  add(g, box(3.6, 2.0, 2.4, CE.white), 0, 1.0, -0.8); for (const sd of [-1, 1]) add(g, box(4.0, 0.14, 1.7, "#a8553a"), 0, 2.4, -0.8 + sd * 0.7).rotation.x = -sd * 0.5; add(g, box(4.0, 0.1, 0.3, "#8a3a2a"), 0, 2.8, -0.8);
  const strings: THREE.Group[] = []; for (let s = 0; s < 6; s++) { const st = new THREE.Group(); st.position.set(-1.5 + s * 0.6, 2.0, 0.44); g.add(st); strings.push(st); for (let k = 0; k < 9; k++) add(st, ball(0.07, k % 4 === 3 ? "#8e2a22" : CE.paprika, 5), (k % 2) * 0.06 - 0.03, -k * 0.2, 0).scale.set(0.7, 1.5, 0.7); }
  add(g, box(1.2, 0.4, 0.8, CE.wood), 0.6, 0.2, 1.3); add(g, cyl(0.28, 0.28, 0.3, "#8f857a", 12), 0.6, 0.55, 1.3); add(g, cyl(0.26, 0.26, 0.06, "#8f857a", 12), 0.6, 0.73, 1.3); const crank = add(g, box(0.5, 0.04, 0.04, CE.darkWood), 0.85, 0.8, 1.3); add(crank, cyl(0.03, 0.03, 0.2, CE.darkWood, 5), 0.25, 0.1, 0);   // the stone mill
  for (let k = 0; k < 3; k++) { add(g, ball(0.22, "#c9b784", 8), -1.4 + k * 0.5, 0.2, 1.4).scale.y = 1.2; add(g, ball(0.16, CE.paprika, 7), -1.4 + k * 0.5, 0.42, 1.4).scale.y = 0.4; }   // sacks of ground paprika
  const woman = local(CE.paprika, { scarf: CE.white, apron: true }); add(g, woman, -0.6, 0, 1.9); woman.rotation.y = Math.PI;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(woman, "Paprika! Édes és csípős · sweet and hot", 1.5, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); strings.forEach((st, i) => { st.rotation.x = Math.sin(t * 1.2 + i) * 0.04 + k * Math.sin(t * 8 + i) * 0.3; }); crank.rotation.x = t * (0.6 + k * 6); };
  return g;
}

// ---------- the Alps ----------

export function chalet(): P {
  const g = group();
  add(g, box(4.6, 1.2, 3.6, CE.stone), 0, 0.6, 0); add(g, box(4.4, 1.6, 3.4, CE.wood), 0, 2.0, 0); for (let k = 0; k < 7; k++) add(g, box(4.5, 0.04, 3.5, CE.darkWood), 0, 1.3 + k * 0.24, 0);
  add(g, box(5.4, 0.1, 0.5, CE.darkWood), 0, 1.6, 1.95); for (let k = 0; k < 12; k++) add(g, box(0.06, 0.5, 0.06, CE.darkWood), -2.5 + k * 0.46, 1.9, 2.15); add(g, box(5.4, 0.05, 0.05, CE.darkWood), 0, 2.15, 2.15);
  for (let k = 0; k < 4; k++) { const b = add(g, box(0.7, 0.25, 0.3, CE.darkWood), -1.8 + k * 1.2, 1.75, 2.1); for (let f = 0; f < 4; f++) add(b, ball(0.07, f % 2 ? CE.red : "#e8558a", 5), -0.25 + f * 0.17, 0.17, 0.05); }   // geraniums
  for (let k = 0; k < 3; k++) add(g, box(0.6, 0.5, 0.04, "#f2e6a0"), -1.4 + k * 1.4, 2.1, 1.72); add(g, box(0.5, 0.5, 0.04, "#f2e6a0"), 0, 0.7, 1.82); add(g, box(0.7, 0.9, 0.04, CE.darkWood), 1.4, 0.55, 1.82);
  for (const sd of [-1, 1]) { const r = add(g, box(5.6, 0.14, 2.4, "#5a4a3a"), 0, 3.25, sd * 1.0); r.rotation.x = -sd * 0.45; for (let k = 0; k < 8; k++) add(r, ball(0.12, "#8f857a", 5), -2.4 + k * 0.7, 0.1, (k % 2) * 0.8 - 0.4).scale.y = 0.6; }   // stones on the roof
  add(g, box(5.8, 0.12, 0.3, "#4a3a2a"), 0, 3.85, 0); add(g, box(0.5, 0.8, 0.5, CE.stone), 1.5, 4.0, -0.5);
  for (let k = 0; k < 10; k++) add(g, cyl(0.12, 0.12, 0.7, "#c9a86a", 6), -2.9, 0.15 + Math.floor(k / 5) * 0.24, -1.5 + (k % 5) * 0.6).rotation.x = Math.PI / 2;   // the wood stack
  const host = local("#c0392b", { alpine: true }); add(g, host, 2.6, 0, 2.6); host.rotation.y = -0.6;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(host, "Grüezi! Welcome up!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); if (host.userData.upper) host.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** Alpine dairy: brown cows with bells, a milk churn, cheese wheels on a shelf, a herder. */
export function alpineCows(): P {
  const g = group();
  const cows: P[] = [];
  for (let i = 0; i < 3; i++) { const c = cow(false, true, "Muh! Moo!"); c.traverse((o) => { if (o instanceof THREE.Mesh) { const col = (o.material as THREE.MeshStandardMaterial).color.getHexString(); if (col !== "e9b8a5" && col !== "e8dcc2") (o.material as THREE.MeshStandardMaterial) = mat(col === C.cowBrown.replace("#", "") ? "#7a4a2a" : "#a8703a") as THREE.MeshStandardMaterial; } }); add(c.children[0], cyl(0.09, 0.1, 0.14, CE.gold, 8), 0.95, 0.55, 0); add(c.children[0], box(0.34, 0.08, 0.06, "#8a2a2a"), 0.95, 0.64, 0); c.position.set(-2.4 + i * 2.4, 0, (i % 2) * 1.5 - 0.5); g.add(c); cows.push(c); }
  add(g, box(1.6, 1.0, 0.6, CE.wood), 3.6, 0.5, -1.0); for (let k = 0; k < 3; k++) { add(g, cyl(0.28, 0.28, 0.16, "#e9c46a", 12), 3.2 + k * 0.4 - 0.1, 1.08 + (k % 2) * 0.0, -1.0 + (k % 2) * 0.1); } add(g, cyl(0.28, 0.28, 0.16, "#e9c46a", 12), 3.7, 1.24, -1.0); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 12, 1, false, 0, Math.PI * 1.5), mat("#f2e2b8")), 3.5, 1.4, -0.9);   // cheese wheels, one cut
  add(g, cyl(0.2, 0.18, 0.5, CE.grey, 10), 3.0, 0.25, 0.6); add(g, cyl(0.12, 0.12, 0.12, CE.grey, 8), 3.0, 0.56, 0.6);
  const herder = local("#3f5f8f", { alpine: true }); add(g, herder, 4.2, 0, 0.8); herder.rotation.y = -1.0; add(g, cyl(0.02, 0.02, 1.4, CE.wood, 4), 4.45, 0.7, 0.8);
  for (let k = 0; k < 5; k++) { add(g, cyl(0.01, 0.01, 0.16, "#5f9a4a", 3), -3.5 + k * 0.5, 0.08, 2.0); add(g, ball(0.06, CE.white, 5), -3.5 + k * 0.5, 0.18, 2.0).scale.y = 0.5; }   // edelweiss
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(herder, "Alpkäse! Alpine cheese!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); cows.forEach((c, i) => { c.rotation.z = k * Math.sin(t * 12 + i) * 0.06; }); tickChildren(g)(t, dt); };
  return g;
}

/** A cable car: two pylons and a cabin sliding up the wire. The layout sets the endpoints by scaling. */
export function cableCarAlps(len = 10, rise = 5): P {
  const g = group();
  add(g, box(0.5, 2.0, 0.5, CE.grey), 0, 1.0, 0); add(g, box(0.5, 2.0 + rise, 0.5, CE.grey), len, 1.0 + rise / 2, 0); add(g, box(1.6, 0.16, 0.16, CE.grey), 0, 2.0, 0); add(g, box(1.6, 0.16, 0.16, CE.grey), len, 2.0 + rise, 0);
  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, Math.hypot(len, rise), 4), mat("#3a3a3d")); wire.position.set(len / 2, 2.0 + rise / 2, 0.5); wire.rotation.z = Math.atan2(rise, len) - Math.PI / 2 + Math.PI; g.add(wire);
  const cabin = new THREE.Group(); g.add(cabin); add(cabin, cyl(0.03, 0.03, 0.6, CE.grey, 4), 0, -0.3, 0); add(cabin, box(0.8, 0.8, 0.6, CE.red), 0, -1.0, 0); add(cabin, box(0.7, 0.35, 0.62, CE.glass), 0, -0.9, 0); const rider = local(CE.white, { alpine: true }); rider.scale.setScalar(0.45); rider.position.set(0, -1.4, 0.1); cabin.add(rider);
  g.userData.tick = (t) => { const raw = (t * 0.06) % 2; const u = raw < 1 ? raw : 2 - raw; cabin.position.set(len * u, 2.0 + rise * u, 0.5); cabin.rotation.z = Math.sin(t * 1.3) * 0.03; };
  return g;
}

// ---------- Georgia ----------

/** Old Tbilisi: a row of houses with carved wooden balconies on a hill street. */
export function tbilisiRow(): P {
  const g = group();
  for (let i = 0; i < 3; i++) { const x = -3.0 + i * 3.0; const c = ["#e8c9a0", "#c9a86a", "#e6dcc3"][i]; add(g, box(2.6, 2.6, 2.6, c), x, 1.3, 0); add(g, box(2.9, 0.16, 2.9, "#8a3a2a"), x, 2.68, 0); for (const sd of [-1, 1]) add(g, box(2.9, 0.1, 1.7, "#8a3a2a"), x, 3.1, sd * 0.75).rotation.x = -sd * 0.5; const bal = add(g, box(2.8, 0.1, 0.8, "#4a7a8a"), x, 1.5, 1.7); for (let k = 0; k < 8; k++) add(bal, box(0.06, 0.6, 0.06, "#4a7a8a"), -1.3 + k * 0.37, 0.35, 0.36); add(bal, box(2.8, 0.06, 0.06, "#4a7a8a"), 0, 0.68, 0.36); add(g, box(2.8, 0.06, 0.9, "#4a7a8a"), x, 2.5, 1.7); for (const bx of [-1.3, 1.3]) add(g, box(0.08, 1.0, 0.08, "#4a7a8a"), x + bx, 2.0, 2.05); for (let k = 0; k < 2; k++) add(g, box(0.5, 0.7, 0.04, "#2a3a4a"), x - 0.6 + k * 1.2, 2.0, 1.32); add(g, box(0.6, 0.9, 0.04, "#4a7a8a"), x, 0.45, 1.32); for (let k = 0; k < 6; k++) add(g, ball(0.09, "#5f9a4a", 5), x - 1.2 + k * 0.5, 1.75 + (k % 2) * 0.1, 1.95); }   // vines on the balconies
  const grandmother = local("#2a2a2e", { scarf: "#2a2a2e" }); add(g, grandmother, 0.3, 1.6, 1.9); grandmother.scale.setScalar(0.9);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(grandmother, "გამარჯობა! Gamarjoba!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); if (grandmother.userData.upper) grandmother.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

export function sulfurBaths(): P {
  const g = group();
  for (let i = 0; i < 4; i++) { const x = -2.4 + (i % 2) * 2.4, z = -1.0 + Math.floor(i / 2) * 2.2; add(g, box(2.0, 0.9, 2.0, CE.brick), x, 0.45, z); add(g, new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(CE.brick)), x, 0.9, z); add(g, cyl(0.22, 0.22, 0.3, CE.brick, 8), x, 1.9, z); add(g, ball(0.2, "#3fa2b0", 6), x, 2.1, z).scale.y = 0.5; }
  add(g, box(1.6, 2.2, 1.4, "#3f7a8a"), 2.6, 1.1, 0); add(g, box(0.5, 1.0, 0.04, "#2a3a4a"), 2.6, 0.7, 0.72); for (let k = 0; k < 6; k++) add(g, box(0.16, 0.16, 0.04, [CE.gold, "#3fa2b0", "#c0392b"][k % 3]), 2.1 + k * 0.2, 1.8, 0.72);   // the Orbeliani bathhouse with its tiled front
  g.userData.steam = new THREE.Vector3(0, 2.3, 0);
  return g;
}

/** A Georgian supra: a long table under a vine pergola, the tamada raising a horn, lobio, khachapuri, mchadi and wine. */
export function supra(): P {
  const g = group();
  for (const x of [-2.8, 2.8]) for (const z of [-1.4, 1.4]) add(g, cyl(0.08, 0.1, 2.6, CE.darkWood, 6), x, 1.3, z); for (const z of [-1.4, 1.4]) add(g, box(6.0, 0.1, 0.1, CE.darkWood), 0, 2.6, z); for (let k = 0; k < 7; k++) add(g, box(0.08, 0.08, 3.0, CE.darkWood), -2.7 + k * 0.9, 2.62, 0);
  for (let k = 0; k < 20; k++) add(g, ball(0.2, "#5f9a4a", 6), -2.8 + (k % 10) * 0.62, 2.72 + (k % 3) * 0.05, -1.2 + Math.floor(k / 10) * 2.4).scale.y = 0.6; for (let k = 0; k < 6; k++) add(g, ball(0.09, "#5a2a6a", 6), -2.4 + k * 1.0, 2.45, (k % 2) * 2.2 - 1.1);   // the vine and its grapes
  add(g, box(5.0, 0.08, 1.2, CE.white), 0, 0.78, 0); add(g, box(5.0, 0.7, 1.1, CE.wood), 0, 0.4, 0);
  const pot = add(g, cyl(0.3, 0.24, 0.3, "#5a3d28", 10), -1.6, 0.95, 0); add(pot, cyl(0.27, 0.27, 0.04, "#8e3a3a", 10), 0, 0.16, 0); for (let k = 0; k < 5; k++) add(pot, ball(0.04, "#e9c46a", 4), Math.cos(k * 1.25) * 0.15, 0.2, Math.sin(k * 1.25) * 0.15);   // lobio with walnuts
  const boat = add(g, ball(0.32, "#e0b060", 8), 0.2, 0.86, 0.15); boat.scale.set(1.3, 0.35, 0.8); add(g, ball(0.16, "#f2e6a0", 7), 0.2, 0.94, 0.15).scale.y = 0.35; add(g, ball(0.06, CE.gold, 5), 0.2, 1.0, 0.15);   // khachapuri adjaruli with the egg
  for (let k = 0; k < 4; k++) add(g, cyl(0.12, 0.12, 0.05, "#e9c46a", 8), 1.3 + (k % 2) * 0.3, 0.85, -0.3 + Math.floor(k / 2) * 0.5);   // mchadi
  add(g, cyl(0.1, 0.1, 0.36, "#5a2a3a", 8), -0.6, 0.98, -0.35); add(g, cyl(0.06, 0.02, 0.4, "#f1ece2", 6), 2.0, 0.9, 0.3).rotation.z = 0.6; add(g, cyl(0.04, 0.03, 0.14, "#5a2a3a", 6), -1.0, 0.9, 0.4);   // wine, a horn, a glass
  const guests: Fig[] = []; for (let i = 0; i < 6; i++) { const q = local(pick([CE.white, "#2a2a2e", "#8a2a2a", "#3f5f8f"]), { papakha: i === 1 }); q.userData.sit?.(); add(g, q, -2.0 + (i % 3) * 2.0, 0.04, i < 3 ? -1.05 : 1.05).rotation.y = i < 3 ? 0 : Math.PI; guests.push(q); }
  const tamada = local("#2a2a2e", { papakha: true }); add(g, tamada, 3.6, 0, 0); tamada.rotation.y = -Math.PI / 2; add(tamada, box(0.5, 0.9, 0.4, "#1a1a1e"), 0, 0.45, 0); for (let k = 0; k < 4; k++) add(tamada, box(0.05, 0.14, 0.03, CE.white), -0.15 + k * 0.1, 0.75, 0.22);   // the chokha with its cartridge pockets
  const horn = add(tamada, cyl(0.06, 0.02, 0.4, "#f1ece2", 6), 0.3, 0.95, 0.2); horn.rotation.z = -0.5;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(tamada, "გაუმარჯოს! Gaumarjos! To victory!", 1.6, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); horn.position.y = 0.95 + k * Math.sin(Math.min(1, k * 2) * Math.PI) * 0.5; if (tamada.userData.upper) tamada.userData.upper.rotation.z = -k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); guests.forEach((q, i) => { if (q.userData.upper) q.userData.upper.rotation.x = 0.1 - k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); pot.position.y = 0.95 + k * Math.abs(Math.sin(t * 8)) * 0.15; };
  return g;
}

/** A qvevri cellar: clay amphorae buried to the neck, a winemaker with a ladle, grapes on the wall. */
export function qvevri(): P {
  const g = group();
  add(g, box(5.0, 0.3, 3.4, "#a8956a"), 0, 0.15, 0); add(g, box(5.0, 1.6, 0.4, CE.stone), 0, 0.8, -1.8); add(g, box(5.4, 0.16, 0.8, "#8a3a2a"), 0, 1.7, -1.8);
  const lids: THREE.Mesh[] = []; for (let i = 0; i < 4; i++) { const x = -1.8 + i * 1.2; add(g, new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.1, 6, 14), mat("#a45a3a")), x, 0.34, 0.2).rotation.x = Math.PI / 2; add(g, cyl(0.36, 0.36, 0.06, "#2a1a1e", 14), x, 0.32, 0.2); const lid = add(g, cyl(0.4, 0.4, 0.08, CE.stone, 12), x, 0.42, 0.2); if (i % 2) lid.position.set(x + 0.5, 0.06, 1.2); lids.push(lid); }
  for (let k = 0; k < 8; k++) add(g, ball(0.1, "#5a2a6a", 6), -2.2 + k * 0.6, 1.2 + (k % 2) * 0.2, -1.5); for (let k = 0; k < 6; k++) add(g, ball(0.18, "#5f9a4a", 6), -2.4 + k * 0.95, 1.5, -1.5).scale.y = 0.5;
  const maker = local("#3f5f8f", { papakha: true, apron: true }); add(g, maker, 0.6, 0, 1.6); maker.rotation.y = Math.PI; const ladle = add(g, cyl(0.02, 0.02, 1.0, CE.wood, 4), 0.2, 0.9, 1.0); ladle.rotation.z = 0.4; add(ladle, cyl(0.06, 0.05, 0.08, "#c9a86a", 8), 0, -0.5, 0);
  add(g, cyl(0.16, 0.14, 0.4, "#5a2a3a", 8), 2.0, 0.5, 1.0); add(g, cyl(0.14, 0.14, 0.4, "#e0b060", 8), 2.3, 0.5, 1.0);   // amber and red
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(maker, "ღვინო · qvevri wine, eight thousand years", 1.5, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); lids.forEach((l, i) => { if (!(i % 2)) l.position.y = 0.42 + k * Math.max(0, Math.sin(t * 6 + i)) * 0.3; }); ladle.rotation.y = t * (0.4 + k * 5); };
  return g;
}

/** Bean rows and walnut trees, with a woman shelling beans. */
export function beanWalnut(): P {
  const g = group();
  add(g, box(6.0, 0.18, 3.0, "#6b4a32"), -1.0, 0.09, 0.4);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const x = -3.6 + c * 0.65, z = -0.6 + r * 1.0; add(g, cyl(0.02, 0.02, 1.1, CE.wood, 4), x, 0.7, z); for (let l = 0; l < 4; l++) add(g, ball(0.1, "#5f9a4a", 5), x + (l % 2 ? 0.1 : -0.1), 0.35 + l * 0.22, z + (l % 2 ? -0.08 : 0.08)).scale.y = 0.6; for (let b = 0; b < 2; b++) add(g, cyl(0.02, 0.02, 0.18, "#7a3a2a", 4), x + 0.06, 0.5 + b * 0.3, z - 0.1).rotation.z = 0.3; }
  for (const [x, z, s] of [[3.6, -1.0, 1.1], [3.0, 1.8, 0.9]] as [number, number, number][]) { add(g, cyl(0.14 * s, 0.2 * s, 1.6 * s, "#5a4a3a", 6), x, 0.8 * s, z); const crown = add(g, ball(1.1 * s, "#4f8a3a", 9), x, 2.2 * s, z); crown.scale.y = 0.8; for (let k = 0; k < 6; k++) add(crown, ball(0.09, "#8a6a3a", 5), Math.cos(k * 1.05) * 0.8, -0.2 + (k % 2) * 0.4, Math.sin(k * 1.05) * 0.8); }   // walnuts
  const woman = local("#8a2a2a", { scarf: CE.white, apron: true }); woman.userData.sit?.(); add(g, woman, -3.4, 0.3, 2.4); add(g, box(0.5, 0.3, 0.5, CE.wood), -3.4, 0.15, 2.4); add(g, cyl(0.26, 0.22, 0.14, C.straw, 9), -2.7, 0.07, 2.5); for (let k = 0; k < 8; k++) add(g, ball(0.035, "#7a3a2a", 4), -2.7 + (rnd() - 0.5) * 0.3, 0.16, 2.5 + (rnd() - 0.5) * 0.3);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(woman, "ლობიო! Lobio!", 1.4, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); if (woman.userData.upper) woman.userData.upper.rotation.x = 0.2 + k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** A hilltop church of the Jvari kind, with a flock of sheep and a shepherd on the slope below. */
export function jvari(): P {
  const g = group();
  const hill = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2.6, 9), mat("#6f9f5f")); hill.position.y = 1.3; hill.scale.z = 0.8; g.add(hill);
  add(g, box(2.0, 1.6, 2.6, CE.stone), 0, 3.4, 0); for (const sd of [-1, 1]) { add(g, box(0.9, 1.2, 0.9, CE.stone), sd * 1.3, 3.2, 0); add(g, cone(0.7, 0.5, "#8a3a2a", 4), sd * 1.3, 4.05, 0).rotation.y = Math.PI / 4; }
  add(g, cyl(0.7, 0.7, 1.0, CE.stone, 8), 0, 4.7, 0); add(g, cone(0.8, 1.0, "#8a3a2a", 8), 0, 5.7, 0); add(g, box(0.06, 0.4, 0.06, CE.gold), 0, 6.35, 0); add(g, box(0.24, 0.06, 0.06, CE.gold), 0, 6.42, 0); add(g, box(0.5, 0.6, 0.04, "#2a3a4a"), 0, 3.4, 1.32);
  const sheep: THREE.Group[] = []; for (let i = 0; i < 5; i++) { const s = new THREE.Group(); const a = 1.2 + i * 0.7; s.position.set(Math.cos(a) * 5.0, 0, Math.sin(a) * 4.0); s.rotation.y = -a; g.add(s); sheep.push(s); add(s, ball(0.3, "#f1ece2", 8), 0, 0.4, 0).scale.set(1.3, 0.9, 1); const head = add(s, ball(0.13, "#2a2a2e", 7), 0.4, 0.45, 0); void head; for (const x of [-0.2, 0.2]) for (const z of [-0.11, 0.11]) add(s, box(0.07, 0.25, 0.07, "#2a2a2e"), x, 0.12, z); }
  const shepherd = local("#3a3230", { papakha: true }); add(g, shepherd, 4.6, 0, 3.6); shepherd.rotation.y = -0.8; add(g, cyl(0.02, 0.02, 1.6, CE.wood, 4), 4.85, 0.8, 3.6); const gt = goat(); add(g, gt, 3.4, 0, 4.4); gt.rotation.y = 2.0;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(sheep[2], "Baa!", 0.9, 1100); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); sheep.forEach((s, i) => { s.position.y = k * Math.abs(Math.sin(t * 11 + i)) * 0.25; }); };
  return g;
}

/** A Georgian spice table: khmeli suneli, blue fenugreek, dried marigold, coriander, with the woman who blends them. */
export function spiceGe(): P {
  const g = group();
  add(g, box(2.4, 0.8, 1.0, CE.wood), 0, 0.4, 0); add(g, box(2.6, 0.06, 1.2, "#c9a86a"), 0, 0.83, 0); for (const x of [-1.2, 1.2]) add(g, cyl(0.04, 0.04, 2.2, CE.darkWood, 5), x, 1.1, -0.4); add(g, box(2.8, 0.06, 1.6, "#8a2a2a"), 0, 2.2, 0.1).rotation.x = 0.12;
  const bowls: THREE.Mesh[] = []; for (let k = 0; k < 6; k++) { const b = add(g, cyl(0.18, 0.14, 0.12, "#a45a3a", 10), -0.95 + k * 0.38, 0.9, (k % 2) * 0.35 - 0.15); add(b, cyl(0.15, 0.15, 0.05, ["#7a6a2a", "#e0a52c", "#4a5a3a", "#c0392b", "#8a6a3a", "#e9c46a"][k], 10), 0, 0.08, 0); bowls.push(b); }
  for (let k = 0; k < 4; k++) add(g, ball(0.05, "#e0a52c", 5), -0.9 + k * 0.6, 2.05, 0.5);   // marigold hanging to dry
  const woman = local("#2a2a2e", { scarf: "#c0392b", apron: true }); add(g, woman, 0.2, 0, -0.9);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(woman, "ხმელი სუნელი · khmeli suneli", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); bowls.forEach((b, i) => { b.position.y = 0.9 + k * Math.max(0, Math.sin(t * 9 + i * 1.1)) * 0.25; }); if (woman.userData.upper) woman.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

export function ferry(): P {
  const g = group();
  add(g, box(3.6, 0.6, 1.4, CE.white), 0, 0.4, 0); add(g, box(3.6, 0.12, 1.44, "#2f6fb5"), 0, 0.2, 0); add(g, box(2.2, 0.8, 1.2, CE.white), -0.3, 1.1, 0); for (let k = 0; k < 5; k++) for (const sd of [-1, 1]) add(g, box(0.3, 0.3, 0.02, CE.glass), -1.1 + k * 0.4, 1.15, sd * 0.61); add(g, cyl(0.12, 0.14, 0.7, "#c0392b", 8), -0.6, 1.8, 0); add(g, cyl(0.12, 0.12, 0.1, "#1a1a1e", 8), -0.6, 2.2, 0);
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 1.0) * 0.02; };
  return g;
}

export { car as blackCab };

export const CEUROPE_PROPS: Record<string, () => P> = {
  bigBen, londonEye, pub, bakeryCe, towerBridge, chainBridge, mushroomWood, phoneBox, parliamentHu, thermalBath, pusztaFarm, greyCattle, bogracs, paprikaHouse, chalet, alpineCows, tbilisiRow, sulfurBaths, supra, qvevri, beanWalnut, jvari, spiceGe, none: () => group(),
};

export const CEUROPE_ICONS: Record<string, () => P> = {
  beefCe: () => { const c = cow(false, false); c.traverse((o) => { if (o instanceof THREE.Mesh) { const col = (o.material as THREE.MeshStandardMaterial).color.getHexString(); if (col !== "e9b8a5" && col !== "e8dcc2") (o.material as THREE.MeshStandardMaterial) = mat("#d9d3c4") as THREE.MeshStandardMaterial; } }); return c; },
  mushroomsCe: () => { const g = group(); for (let k = 0; k < 3; k++) { add(g, cyl(0.05, 0.06, 0.24, "#f1ece2", 6), -0.3 + k * 0.3, 0.12, (k % 2) * 0.15); add(g, ball(0.16, k ? "#c9a86a" : "#8a5a3a", 8), -0.3 + k * 0.3, 0.26, (k % 2) * 0.15).scale.y = 0.55; } return g; },
  pastryCe: () => { const g = group(); const b = add(g, box(0.5, 0.16, 0.4, "#f2e2b8"), -0.2, 0.08, 0); for (let k = 0; k < 5; k++) add(b, box(0.5, 0.01, 0.4, "#e9c46a"), 0, -0.07 + k * 0.035, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.05, 6, 8, Math.PI * 1.4), mat("#d9a441")), 0.35, 0.05, 0.1).rotation.x = Math.PI / 2; return g; },
  paprika: () => { const g = group(); for (let k = 0; k < 7; k++) add(g, ball(0.08, k % 3 === 2 ? "#8e2a22" : CE.paprika, 5), -0.3 + k * 0.1, 0.4 - (k % 2) * 0.12, 0).scale.set(0.7, 1.5, 0.7); add(g, ball(0.16, "#c9b784", 7), 0.35, 0.16, 0.15).scale.y = 1.2; add(g, ball(0.12, CE.paprika, 6), 0.35, 0.32, 0.15).scale.y = 0.4; return g; },
  beansWalnut: () => { const g = group(); add(g, cyl(0.24, 0.2, 0.14, "#5a3d28", 10), -0.2, 0.07, 0); for (let k = 0; k < 8; k++) add(g, ball(0.04, "#7a3a2a", 4), -0.2 + Math.cos(k) * 0.12, 0.16, Math.sin(k) * 0.12); for (let k = 0; k < 3; k++) add(g, ball(0.08, "#8a6a3a", 6), 0.25 + (k % 2) * 0.15, 0.08, -0.1 + k * 0.12); return g; },
  cheeseCe: () => { const g = group(); add(g, cyl(0.26, 0.26, 0.14, "#e9c46a", 12), -0.1, 0.07, 0); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.14, 12, 1, false, 0, Math.PI * 1.5), mat("#f2e2b8")), -0.1, 0.22, 0); add(g, cyl(0.06, 0.07, 0.1, CE.gold, 8), 0.4, 0.05, 0.1); return g; },
  onionsCe: () => { const g = group(); for (let k = 0; k < 3; k++) add(g, ball(0.12, k ? "#e0b060" : "#8a4a6a", 8), -0.25 + k * 0.25, 0.12, (k % 2) * 0.12); add(g, box(0.3, 0.06, 0.2, "#e9c46a"), 0.2, 0.04, -0.25); return g; },
  khmeli: () => { const g = group(); for (let k = 0; k < 3; k++) { const b = add(g, cyl(0.14, 0.11, 0.1, "#a45a3a", 10), -0.3 + k * 0.3, 0.05, 0); add(b, cyl(0.12, 0.12, 0.04, ["#7a6a2a", "#e0a52c", "#4a5a3a"][k], 10), 0, 0.06, 0); } return g; },
  bogracs: () => { const g = group(); add(g, cyl(0.24, 0.17, 0.3, "#2a2a2e", 12), 0, 0.2, 0); add(g, cyl(0.22, 0.22, 0.04, "#b0341e", 12), 0, 0.35, 0); for (let k = 0; k < 3; k++) add(g, cyl(0.02, 0.02, 0.9, CE.darkWood, 4), Math.cos(k * 2.1) * 0.3, 0.42, Math.sin(k * 2.1) * 0.3).rotation.set(-Math.sin(k * 2.1) * 0.3, 0, Math.cos(k * 2.1) * 0.3); add(g, cone(0.1, 0.2, "#f08a2a", 5), 0, 0.08, 0); return g; },
  supra: () => { const g = group(); const boat = add(g, ball(0.3, "#e0b060", 8), 0, 0.1, 0); boat.scale.set(1.3, 0.35, 0.8); add(g, ball(0.15, "#f2e6a0", 7), 0, 0.17, 0).scale.y = 0.35; add(g, ball(0.06, CE.gold, 5), 0, 0.23, 0); add(g, cyl(0.06, 0.02, 0.36, "#f1ece2", 6), 0.42, 0.14, 0.1).rotation.z = 0.6; return g; },
  roastPub: () => { const g = group(); const w = add(g, box(0.6, 0.24, 0.28, "#c9862a"), -0.1, 0.12, 0); for (let k = 0; k < 4; k++) add(w, box(0.02, 0.25, 0.29, "#b8782a"), -0.22 + k * 0.15, 0, 0); const s = add(g, box(0.08, 0.2, 0.26, "#c9862a"), 0.32, 0.1, 0); add(s, box(0.05, 0.14, 0.2, "#8e3a3a"), 0, 0, 0); return g; },
  bigBen: () => { const b = bigBen(); b.scale.setScalar(0.06); b.position.x = -0.3; return b; },
  towerBridge: () => { const b = towerBridge(); b.scale.setScalar(0.08); return b; },
  londonEye: () => { const e = londonEye(); e.scale.setScalar(0.07); return e; },
  redBus: () => { const b = redBus(); b.scale.setScalar(0.22); return b; },
  parliamentHu: () => { const p = parliamentHu(); p.scale.setScalar(0.07); return p; },
  chainBridge: () => { const b = chainBridge(); b.scale.setScalar(0.08); return b; },
  thermalBath: () => { const b = thermalBath(); b.scale.setScalar(0.08); return b; },
  puszta: () => { const p = pusztaFarm(); p.scale.setScalar(0.12); return p; },
  alps: () => { const g = group(); add(g, cone(0.5, 0.7, "#8d9384", 7), -0.2, 0.35, 0); add(g, cone(0.2, 0.28, CE.white, 7), -0.2, 0.56, 0); add(g, cone(0.36, 0.5, "#8d9384", 7), 0.3, 0.25, 0.1); return g; },
  chalet: () => { const c = chalet(); c.scale.setScalar(0.14); return c; },
  cableCar: () => { const c = cableCarAlps(3, 1.5); c.scale.setScalar(0.2); c.position.x = -0.3; return c; },
  tbilisi: () => { const t = tbilisiRow(); t.scale.setScalar(0.09); return t; },
  sulfurBaths: () => { const s = sulfurBaths(); s.scale.setScalar(0.14); return s; },
  jvari: () => { const j = jvari(); j.scale.setScalar(0.1); return j; },
  qvevri: () => { const g = group(); add(g, new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 14), mat("#a45a3a")), 0, 0.08, 0).rotation.x = Math.PI / 2; add(g, cyl(0.18, 0.18, 0.04, "#2a1a1e", 14), 0, 0.07, 0); add(g, cyl(0.12, 0.12, 0.3, "#e0b060", 8), 0.45, 0.15, 0); return g; },
  blackSea: () => { const f = ferry(); f.scale.setScalar(0.22); return f; },
};
