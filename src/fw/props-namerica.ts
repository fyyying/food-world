/** North American props: skyscrapers and Liberty, a diner, a barn and silo, cornfields, a smokehouse pit, longhorns, a pumpjack, the Golden Gate, redwoods, a farmers market and a food truck. Text is English. */
import * as THREE from "three";
import { mat, add, rnd, C, person, cow, chicken, bubble, wear, tree, type P } from "./props";
import { citrusTree } from "./props-italy";
import { avocadoTree, chilliRacks } from "./props-mexico";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate * 0.7); return k; } }; }
type Fig = P & { userData: { upper?: THREE.Group; walk?: (t: number) => void; sit?: () => void } };

export const NA = { barn: "#b8342a", white: "#f4f1ea", steel: "#8c9096", chrome: "#c9cfd6", denim: "#3f5f8f", brick: "#a8553a", glass: "#8fc4d9", copper: "#4f8f7a", corn: "#e0c84a", wood: "#7a4a2a", asphalt: "#4a4a50", sand: "#e9dcb4", sage: "#8fa872", red: "#c0392b", yellow: "#f2c14e", orange: "#e07a2a" };

/** Someone in a cowboy hat, a cap, a beanie or a chef's cap. */
export function american(shirt: string, opts: { cowboy?: boolean; cap?: string; beanie?: string; apron?: boolean } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.cowboy) { wear(p, cyl(0.36, 0.38, 0.05, "#a37a4f", 12), 0, 1.19, 0); wear(p, cyl(0.15, 0.17, 0.2, "#a37a4f", 10), 0, 1.3, 0); }
  if (opts.cap) { wear(p, ball(0.17, opts.cap, 8), 0, 1.2, 0).scale.set(1, 0.7, 1); wear(p, box(0.3, 0.03, 0.2, opts.cap), 0, 1.2, 0.2); }
  if (opts.beanie) wear(p, ball(0.18, opts.beanie, 8), 0, 1.22, 0).scale.set(1, 0.85, 1);
  return p;
}

// ---------- New York & New England ----------

export function skyscraper(w = 2.4, h = 9, d = 2.4, color = "#8fa3b5", glass = false): P {
  const g = group();
  add(g, box(w, h, d, glass ? "#6fa8c8" : color), 0, h / 2, 0);
  const rows = Math.floor(h / 0.8);
  const face = (len: number, ax: "x" | "z", sign: number) => { const cols = Math.max(2, Math.round(len / 0.55)); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const lit = (r * 7 + c * 3) % 5 === 0; const win = box(ax === "z" ? 0.28 : 0.04, 0.4, ax === "z" ? 0.04 : 0.28, glass ? (lit ? "#f2e6a0" : "#a9d4e8") : lit ? "#f2e6a0" : NA.glass); const off = -len / 2 + 0.28 + c * (len - 0.56) / (cols - 1); if (ax === "z") add(g, win, off, 0.55 + r * 0.8, sign * (d / 2 + 0.02)); else add(g, win, sign * (w / 2 + 0.02), 0.55 + r * 0.8, off); } };
  face(w, "z", 1); face(w, "z", -1); face(d, "x", 1); face(d, "x", -1);
  if (glass) { add(g, box(w * 0.7, 0.4, d * 0.7, "#5a8fb0"), 0, h + 0.2, 0); add(g, cyl(0.03, 0.05, 2.5, NA.steel, 4), 0, h + 1.6, 0); }
  else if (h > 8) { add(g, box(w * 0.55, 0.6, d * 0.55, color), 0, h + 0.3, 0); add(g, cyl(0.04, 0.04, 1.2, NA.steel, 4), 0, h + 1.2, 0); }
  else { add(g, cyl(0.28, 0.28, 0.5, "#7a5a3a", 8), w * 0.22, h + 0.25, -d * 0.2); add(g, cone(0.32, 0.2, "#5a4a3a", 8), w * 0.22, h + 0.6, -d * 0.2); for (const sd of [-1, 1]) add(g, box(0.05, 0.6, 0.05, "#5a4a3a"), w * 0.22 + sd * 0.2, h + 0.15, -d * 0.2 + sd * 0.15); }   // the rooftop water tank
  return g;
}

/** The Empire State: a stepped limestone tower with a spire. */
export function empireState(): P {
  const g = group();
  const c = "#c9bda4";
  add(g, box(3.2, 3, 2.6, c), 0, 1.5, 0); add(g, box(2.6, 6, 2.1, c), 0, 6, 0); add(g, box(1.9, 5, 1.6, c), 0, 11.5, 0); add(g, box(1.3, 1.6, 1.1, c), 0, 14.8, 0);
  for (const [w, d, y0, y1] of [[3.2, 2.6, 0, 3], [2.6, 2.1, 3, 9], [1.9, 1.6, 9, 14], [1.3, 1.1, 14, 15.6]] as [number, number, number, number][]) { const rows = Math.floor((y1 - y0) / 0.7); const cols = Math.max(2, Math.round(w / 0.5)); for (let r = 0; r < rows; r++) for (let cc = 0; cc < cols; cc++) { const x = -w / 2 + 0.22 + cc * (w - 0.44) / (cols - 1); const lit = (r * 5 + cc) % 4 === 0; add(g, box(0.2, 0.32, 0.04, lit ? "#f2e6a0" : "#5a6a7a"), x, y0 + 0.45 + r * 0.7, d / 2 + 0.02); add(g, box(0.2, 0.32, 0.04, lit ? "#f2e6a0" : "#5a6a7a"), x, y0 + 0.45 + r * 0.7, -d / 2 - 0.02); } }
  add(g, cyl(0.35, 0.5, 1.6, "#a89f8c", 8), 0, 16.4, 0); add(g, cyl(0.08, 0.2, 2.6, NA.steel, 6), 0, 18.4, 0); add(g, cyl(0.02, 0.04, 1.2, NA.steel, 4), 0, 20.2, 0);
  const tip = add(g, ball(0.1, "#f2e6a0", 5), 0, 20.8, 0);
  g.userData.tick = (t) => { tip.visible = Math.sin(t * 3) > 0; };
  return g;
}

/** A Chrysler-style art deco tower with a stacked crown. */
export function chrysler(): P {
  const g = group();
  const c = "#b8b4ad";
  add(g, box(2.2, 12, 2.2, c), 0, 6, 0);
  const rows = 15; for (let r = 0; r < rows; r++) for (let cc = 0; cc < 4; cc++) for (const sd of [-1, 1]) { const x = -0.8 + cc * 0.53; add(g, box(0.2, 0.34, 0.04, (r + cc) % 4 ? "#5a6a7a" : "#f2e6a0"), x, 0.5 + r * 0.76, sd * 1.12); add(g, box(0.04, 0.34, 0.2, (r + cc) % 4 ? "#5a6a7a" : "#f2e6a0"), sd * 1.12, 0.5 + r * 0.76, x); }
  for (let k = 0; k < 6; k++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.0 - k * 0.15, 1.15 - k * 0.15, 0.7, 12), mat(k % 2 ? "#c9cfd6" : "#8c9096")), 0, 12.35 + k * 0.7, 0);
  add(g, cone(0.35, 1.4, "#c9cfd6", 8), 0, 17.2, 0); add(g, cyl(0.03, 0.06, 1.6, NA.steel, 4), 0, 18.6, 0);
  for (let k = 0; k < 4; k++) add(g, cone(0.12, 0.5, "#c9cfd6", 4), Math.cos(k * 1.57 + 0.78) * 1.2, 12.2, Math.sin(k * 1.57 + 0.78) * 1.2).rotation.z = 0;   // the eagle gargoyles' corners
  return g;
}

/** A sedan in any colour. */
export function car(color: string): P {
  const g = group();
  add(g, box(2.1, 0.45, 1.0, color), 0, 0.48, 0); add(g, box(1.1, 0.45, 0.94, color), -0.05, 0.9, 0); add(g, box(1.0, 0.32, 0.96, NA.glass), -0.05, 0.95, 0);
  for (const x of [-0.65, 0.65]) for (const z of [-0.5, 0.5]) add(g, cyl(0.2, 0.2, 0.14, "#2a2a2e", 10), x, 0.2, z).rotation.x = Math.PI / 2;
  add(g, box(0.04, 0.1, 0.24, NA.yellow), 1.06, 0.5, 0.3); add(g, box(0.04, 0.1, 0.24, NA.yellow), 1.06, 0.5, -0.3); add(g, box(0.04, 0.1, 0.24, "#c0392b"), -1.06, 0.5, 0.3); add(g, box(0.04, 0.1, 0.24, "#c0392b"), -1.06, 0.5, -0.3);
  return g;
}

/** A city bus, blue and white. */
export function bus(): P {
  const g = group();
  add(g, box(3.6, 1.3, 1.2, NA.white), 0, 0.95, 0); add(g, box(3.62, 0.5, 1.22, "#2f6fb5"), 0, 0.55, 0); for (let k = 0; k < 6; k++) for (const sd of [-1, 1]) add(g, box(0.45, 0.5, 0.04, NA.glass), -1.4 + k * 0.56, 1.15, sd * 0.62); add(g, box(0.04, 0.6, 1.0, NA.glass), 1.82, 1.1, 0); add(g, box(0.9, 0.18, 0.02, "#2a2a2e"), 1.2, 1.5, 0.62);
  for (const x of [-1.1, 1.1]) for (const z of [-0.55, 0.55]) add(g, cyl(0.24, 0.24, 0.16, "#2a2a2e", 10), x, 0.24, z).rotation.x = Math.PI / 2;
  return g;
}
export function liberty(): P {
  const g = group();
  add(g, box(4, 1.2, 4, "#8f857a"), 0, 0.6, 0); add(g, box(2.6, 2.6, 2.6, "#a89f8c"), 0, 2.5, 0); add(g, box(3, 0.3, 3, "#8f857a"), 0, 3.95, 0);
  const s = new THREE.Group(); s.position.y = 4.1; g.add(s);
  add(s, cone(1.0, 3.6, NA.copper, 8), 0, 1.8, 0);                    // the robe
  add(s, box(1.0, 1.2, 0.8, NA.copper), 0, 3.9, 0); add(s, ball(0.42, NA.copper, 8), 0, 4.9, 0);
  for (let k = 0; k < 7; k++) add(s, cone(0.06, 0.6, NA.copper, 4), Math.cos(k * 0.45 + 1.2) * 0.45, 5.4, Math.sin(k * 0.45 + 1.2) * 0.45).rotation.z = -(k - 3) * 0.3;   // the crown
  const arm = add(s, cyl(0.16, 0.16, 2.4, NA.copper, 6), 0.7, 5.0, 0); arm.rotation.z = -0.2; add(s, cone(0.22, 0.5, NA.yellow, 6), 0.95, 6.5, 0);   // the torch
  add(s, box(0.6, 0.8, 0.2, NA.copper), -0.7, 3.8, 0.2).rotation.z = 0.3;   // the tablet
  return g;
}

/** A classic chrome diner: stools at a counter, a griddle, stacks of pancakes and waffles, coffee, a neon sign. */
export function diner(): P {
  const g = group();
  add(g, box(6, 2.4, 3.2, NA.chrome), 0, 1.2, -1.6); add(g, box(6.2, 0.3, 3.4, NA.red), 0, 2.55, -1.6); add(g, box(6.2, 0.25, 3.4, NA.red), 0, 0.3, -1.6);
  for (let k = 0; k < 5; k++) add(g, box(0.8, 1.0, 0.04, NA.glass), -2.2 + k * 1.1, 1.4, 0.02);
  add(g, box(2.6, 0.7, 0.1, "#1f2430"), 0, 3.1, -1.4); add(g, box(2.2, 0.35, 0.02, "#f06a8a"), 0, 3.15, -1.34); add(g, box(1.4, 0.06, 0.02, "#6fd0e0"), 0, 2.9, -1.34);
  add(g, box(5.2, 0.9, 0.7, NA.red), 0, 0.45, 1.0); add(g, box(5.4, 0.08, 0.9, NA.chrome), 0, 0.94, 1.0);
  const stacks: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) { const st = new THREE.Group(); st.position.set(-1.8 + i * 1.2, 0.98, 1.0); g.add(st); stacks.push(st); add(st, cyl(0.24, 0.22, 0.03, NA.white, 12), 0, 0, 0); if (i % 2) { for (let k = 0; k < 4; k++) add(st, cyl(0.17, 0.17, 0.05, "#e0b060", 12), 0, 0.05 + k * 0.05, 0); add(st, box(0.12, 0.05, 0.12, NA.yellow), 0, 0.28, 0); add(st, cyl(0.16, 0.16, 0.02, "#a8602a", 12), 0, 0.31, 0); } else { add(st, box(0.32, 0.06, 0.32, "#d9a441"), 0, 0.05, 0); for (let k = 0; k < 9; k++) add(st, box(0.07, 0.02, 0.07, "#b8782a"), -0.1 + (k % 3) * 0.1, 0.09, -0.1 + Math.floor(k / 3) * 0.1); add(st, ball(0.05, NA.red, 5), 0.08, 0.14, 0.06); add(st, ball(0.04, "#5a2a8a", 5), -0.06, 0.14, -0.04); } }   // pancakes with butter and syrup, waffles with berries
  add(g, cyl(0.05, 0.04, 0.12, NA.white, 8), -1.0, 1.02, 1.3); add(g, cyl(0.05, 0.04, 0.12, NA.white, 8), 1.6, 1.02, 1.3); add(g, cyl(0.09, 0.08, 0.28, "#e07a2a", 8), 2.2, 1.1, 0.7); add(g, box(0.5, 0.3, 0.4, "#5a5a5a"), -2.4, 1.1, 0.8); add(g, cyl(0.06, 0.06, 0.12, "#8a5a2a", 8), 0.6, 1.02, 0.7);   // coffee mugs, the syrup bottle, the griddle, a mug of coffee
  const cook = american(NA.white, { apron: true, cap: NA.white }); add(g, cook, -2.4, 0, 0.45); cook.rotation.y = Math.PI; const flip = add(g, box(0.04, 0.02, 0.3, NA.chrome), -2.2, 1.2, 0.5);
  const eaters: Fig[] = [];
  for (let i = 0; i < 4; i++) { add(g, cyl(0.05, 0.05, 0.5, NA.chrome, 6), -1.8 + i * 1.2, 0.25, 1.9); add(g, cyl(0.24, 0.24, 0.1, NA.red, 10), -1.8 + i * 1.2, 0.55, 1.9); const e = american(pick([NA.denim, "#c0392b", "#2f5d3f", NA.white]), { cap: i === 1 ? NA.denim : undefined }); e.userData.sit?.(); add(g, e, -1.8 + i * 1.2, 0.2, 1.9).rotation.y = Math.PI; eaters.push(e); }
  g.userData.steam = new THREE.Vector3(-2.4, 1.5, 0.8);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Order up! Short stack!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); stacks.forEach((s, i) => { s.position.y = 0.98 + k * Math.max(0, Math.sin(t * 9 + i * 1.3)) * 0.35; s.rotation.y += k * dt * 4; }); flip.position.y = 1.2 + k * Math.abs(Math.sin(t * 10)) * 0.4; flip.rotation.x = k * Math.sin(t * 10) * 1.0; eaters.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

/** A hot dog cart with a striped umbrella. */
export function hotDogCart(): P {
  const g = group();
  add(g, box(1.4, 0.9, 0.8, NA.chrome), 0, 0.55, 0); for (const x of [-0.5, 0.5]) add(g, cyl(0.2, 0.2, 0.08, "#2a2a2e", 10), x, 0.2, 0.45).rotation.x = Math.PI / 2;
  for (let k = 0; k < 4; k++) { add(g, box(0.4, 0.1, 0.14, "#e9c46a"), -0.45 + k * 0.3, 1.05, 0); add(g, cyl(0.045, 0.045, 0.42, "#c0392b", 6), -0.45 + k * 0.3, 1.1, 0).rotation.z = Math.PI / 2; add(g, box(0.36, 0.02, 0.03, NA.yellow), -0.45 + k * 0.3, 1.14, 0.02); }
  add(g, cyl(0.03, 0.03, 2.0, NA.steel, 4), 0.5, 1.5, -0.3); const um = new THREE.Group(); um.position.set(0.5, 2.5, -0.3); g.add(um); for (let i = 0; i < 8; i++) add(um, new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.35, 8, 1, false, (i / 8) * Math.PI * 2, Math.PI / 4), mat(i % 2 ? NA.yellow : "#2f6fb5")), 0, 0, 0);
  const seller = american(NA.white, { apron: true, cap: "#2f6fb5" }); add(g, seller, 0, 0, -0.9);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(seller, "Get your hot dogs here!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); if (seller.userData.upper) seller.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; um.rotation.y += k * dt * 3; };
  return g;
}

export function lighthouse(): P {
  const g = group();
  add(g, cyl(1.4, 1.6, 0.6, "#8f857a", 12), 0, 0.3, 0);
  add(g, cyl(0.7, 0.9, 5, NA.white, 12), 0, 3.1, 0); for (let k = 0; k < 3; k++) add(g, cyl(0.85 - k * 0.06, 0.88 - k * 0.06, 0.6, NA.red, 12), 0, 1.4 + k * 1.6, 0);
  add(g, cyl(0.8, 0.8, 0.2, "#2a2a2e", 12), 0, 5.7, 0); add(g, cyl(0.55, 0.55, 0.9, NA.glass, 10), 0, 6.25, 0); add(g, cone(0.7, 0.6, NA.red, 10), 0, 7.0, 0);
  const beam = add(g, box(2.6, 0.2, 0.06, NA.yellow), 1.3, 6.25, 0); void beam;
  add(g, box(2.2, 1.6, 1.6, NA.white), 1.9, 0.8, 0.5); add(g, cone(1.5, 0.9, "#4a4a50", 4), 1.9, 2.05, 0.5).rotation.y = Math.PI / 4;
  g.userData.tick = (t) => { beam.rotation.y = t * 1.2; beam.position.set(Math.cos(t * 1.2) * 1.3, 6.25, -Math.sin(t * 1.2) * 1.3); };
  return g;
}

export function lobsterBoat(): P {
  const g = group();
  add(g, box(3.0, 0.5, 1.2, NA.white), 0, 0.3, 0); add(g, box(3.0, 0.1, 1.24, "#2f6fb5"), 0, 0.12, 0);
  add(g, box(1.0, 0.9, 1.0, NA.white), 0.6, 0.95, 0); add(g, box(1.0, 0.08, 1.05, "#2a2a2e"), 0.6, 1.42, 0); add(g, box(0.7, 0.4, 0.05, NA.glass), 0.6, 1.05, 0.52);
  for (let k = 0; k < 4; k++) add(g, box(0.4, 0.3, 0.3, "#c9a86a"), -0.9 + (k % 2) * 0.45, 0.7 + Math.floor(k / 2) * 0.3, -0.3 + (k % 2) * 0.25);   // lobster traps
  for (let k = 0; k < 3; k++) add(g, ball(0.09, ["#c0392b", NA.yellow, "#3f8f5a"][k], 6), -1.2 + k * 0.3, 0.6, 0.45);   // buoys
  const skipper = american(NA.yellow, { beanie: "#2a2a2e" }); add(g, skipper, -0.3, 0.55, 0.1); skipper.scale.setScalar(0.85);
  add(g, ball(0.14, "#c0392b", 6), -1.0, 0.65, 0.1).scale.set(1.6, 0.5, 0.8); for (const sd of [-1, 1]) add(g, box(0.16, 0.06, 0.08, "#c0392b"), -0.8, 0.7, 0.1 + sd * 0.14);   // the lobster
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 1.1) * 0.03; };
  return g;
}

/** Apple trees and sugar maples with buckets on taps, a cider press. */
export function orchardNE(): P {
  const g = group();
  const trees: P[] = [];
  const fruits: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) { const tr = group(); tr.position.set(-2.4 + j * 2.4, 0, -1.2 + i * 2.4); g.add(tr); trees.push(tr); add(tr, cyl(0.1, 0.14, 0.9, "#6b4a2c", 6), 0, 0.45, 0); const crown = new THREE.Group(); tr.add(crown); (tr.userData as { crown?: THREE.Group }).crown = crown; add(crown, ball(0.8, "#5f9a4a", 9), 0, 1.5, 0); for (let k = 0; k < 7; k++) { const a = rnd() * 6.3; fruits.push(add(crown, ball(0.09, "#c0392b", 6), Math.cos(a) * 0.65, 1.0 + rnd() * 0.8, Math.sin(a) * 0.65)); } }
  for (let i = 0; i < 3; i++) { add(g, cyl(0.12, 0.16, 1.8, "#5a3d28", 6), 4.0 + (i % 2) * 1.2, 0.9, -1.4 + i * 1.3); add(g, ball(0.7, i % 2 ? "#e07a2a" : "#c9302a", 8), 4.0 + (i % 2) * 1.2, 2.2, -1.4 + i * 1.3); add(g, cyl(0.1, 0.08, 0.16, NA.steel, 8), 4.0 + (i % 2) * 1.2 + 0.16, 0.9, -1.4 + i * 1.3); }   // sugar maples in fall colour with sap buckets
  add(g, box(1.0, 0.7, 0.7, NA.wood), 4.4, 0.35, 2.0); add(g, cyl(0.3, 0.3, 0.5, "#a37a4f", 10), 4.4, 0.95, 2.0); add(g, cyl(0.04, 0.04, 0.8, NA.steel, 5), 4.4, 1.5, 2.0); add(g, box(0.5, 0.05, 0.05, NA.steel), 4.4, 1.85, 2.0); add(g, cyl(0.1, 0.08, 0.2, "#e9c46a", 8), 5.1, 0.1, 2.3);   // the cider press and a jug
  const picker = american("#c0392b", { cap: "#2f5d3f" }); add(g, picker, 2.2, 0, 2.4); picker.rotation.y = Math.PI; add(g, cyl(0.28, 0.24, 0.3, C.straw, 9), 1.5, 0.15, 2.4); for (let k = 0; k < 7; k++) add(g, ball(0.08, "#c0392b", 5), 1.5 + (rnd() - 0.5) * 0.35, 0.34, 2.4 + (rnd() - 0.5) * 0.35);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(picker, "Apples and maple!", 1.5, 1400); for (const tr of trees) for (let i = 0; i < 2; i++) { const src = fruits[Math.floor(rnd() * fruits.length)]; const m = ball(0.09, "#c0392b", 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); void tr; } };
  g.userData.tick = (t, dt) => { if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; } } for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.09, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.091) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } } };
  return g;
}

// ---------- the Midwest ----------

export function barn(): P {
  const g = group();
  add(g, box(4.4, 2.4, 3.4, NA.barn), 0, 1.2, 0);
  for (const sd of [-1, 1]) { const r1 = add(g, box(4.8, 0.1, 1.2, "#5a5a5a"), 0, 3.0, sd * 1.35); r1.rotation.x = -sd * 0.9; const r2 = add(g, box(4.8, 0.1, 1.3, "#5a5a5a"), 0, 3.6, sd * 0.55); r2.rotation.x = -sd * 0.35; }
  add(g, box(4.6, 0.08, 0.3, "#3a3a3d"), 0, 3.85, 0);
  add(g, box(1.4, 1.6, 0.06, NA.white), 0, 0.8, 1.73); add(g, box(0.06, 1.6, 0.08, "#4a2a1a"), 0, 0.8, 1.76); for (const sd of [-1, 1]) { add(g, box(1.5, 0.06, 0.08, NA.white), 0, 0.8 + sd * 0.7, 1.76).rotation.z = sd * 0.9; }
  add(g, box(0.6, 0.6, 0.06, NA.white), 1.6, 2.0, 1.73);
  add(g, cyl(0.9, 0.9, 5, "#c9cfd6", 12), 3.4, 2.5, -0.6); add(g, new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat("#8c9096")), 3.4, 5.0, -0.6);   // the silo
  const vane = add(g, box(0.5, 0.04, 0.04, "#2a2a2e"), 0, 4.3, 0); add(g, box(0.04, 0.5, 0.04, "#2a2a2e"), 0, 4.1, 0); add(vane, box(0.16, 0.14, 0.02, "#2a2a2e"), 0.2, 0.08, 0);   // the weathervane
  add(g, box(1.6, 0.4, 1.2, C.straw), -3.2, 0.2, 1.0); add(g, box(1.6, 0.4, 1.2, C.straw), -3.2, 0.6, 1.0).rotation.y = 0.1;   // hay bales
  g.userData.tick = (t) => { vane.rotation.y = Math.sin(t * 0.4) * 0.6 + t * 0.05; };
  return g;
}

export function waterTower(): P {
  const g = group();
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.06, 0.06, 5, NA.steel, 5), sx * 0.9, 2.5, sz * 0.9).rotation.set(sz * 0.1, 0, -sx * 0.1);
  add(g, cyl(1.3, 1.1, 1.6, "#c9cfd6", 12), 0, 5.6, 0); add(g, cone(1.35, 0.7, "#8c9096", 12), 0, 6.75, 0); add(g, box(2.0, 0.4, 0.04, "#2f6fb5"), 0, 5.6, 1.32);
  return g;
}

/** A cornfield with tall stalks, a wheat strip, a scarecrow, a red tractor. */
export function cornfield(): P {
  const g = group();
  add(g, box(8, 0.2, 4.6, "#6b4a32"), 0, 0.1, 0);
  const stalks: THREE.Group[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) { const st = new THREE.Group(); st.position.set(-3.6 + c * 0.72, 0.2, -1.7 + r * 0.95); g.add(st); stalks.push(st); const h = 1.6 + rnd() * 0.5; add(st, cyl(0.03, 0.04, h, "#6fa84a", 5), 0, h / 2, 0); for (let l = 0; l < 4; l++) { const leaf = add(st, box(0.55, 0.02, 0.1, "#7fbf3a"), 0.25, 0.4 + l * 0.32, 0); leaf.rotation.y = l * 1.6; leaf.rotation.z = 0.35; } add(st, cone(0.05, 0.3, "#e9d28a", 5), 0, h + 0.1, 0); if (c % 2) add(st, cyl(0.07, 0.07, 0.3, NA.corn, 6), 0.08, h * 0.55, 0.05).rotation.z = 0.3; }
  add(g, cyl(0.04, 0.04, 1.8, NA.wood, 4), 0, 0.9, 2.0); add(g, box(1.0, 0.05, 0.05, NA.wood), 0, 1.3, 2.0); add(g, box(0.5, 0.5, 0.2, "#3f5f8f"), 0, 1.2, 2.0); add(g, ball(0.16, C.straw, 7), 0, 1.65, 2.0); add(g, cyl(0.3, 0.32, 0.05, "#a37a4f", 10), 0, 1.78, 2.0);   // the scarecrow
  const tractor = new THREE.Group(); tractor.position.set(5.2, 0, 0.6); tractor.rotation.y = -0.4; g.add(tractor);
  add(tractor, box(1.6, 0.7, 0.9, NA.red), 0, 0.75, 0); add(tractor, box(0.7, 0.6, 0.8, NA.red), 0.3, 1.35, 0); add(tractor, box(0.9, 0.06, 0.9, "#2a2a2e"), 0.2, 1.7, 0); add(tractor, cyl(0.04, 0.04, 0.6, "#2a2a2e", 5), -0.5, 1.4, 0.2);
  for (const z of [-0.55, 0.55]) { add(tractor, cyl(0.5, 0.5, 0.3, "#2a2a2e", 10), -0.5, 0.5, z).rotation.x = Math.PI / 2; add(tractor, cyl(0.28, 0.28, 0.24, "#2a2a2e", 10), 0.7, 0.28, z).rotation.x = Math.PI / 2; }
  const farmer = american(NA.denim, { cap: "#3f8f5a" }); farmer.userData.sit?.(); add(tractor, farmer, 0.1, 1.05, 0).scale.setScalar(0.8);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "Knee-high by the Fourth of July!", 1.5, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); stalks.forEach((s) => { s.rotation.z = Math.sin(t * 1.3 + s.position.x) * 0.05 + k * Math.sin((1 - k) * 9 - s.position.x * 1.2) * 0.35; }); tractor.position.y = k * Math.abs(Math.sin(t * 12)) * 0.06; };
  return g;
}

/** The farmyard: a chicken coop, hens, a dairy cow, milk churns and an egg basket. */
export function farmyard(): P {
  const g = group();
  const hens: P[] = [];
  for (let i = 0; i < 4; i++) { const h = chicken(i % 2 ? "#a8602a" : C.white, "Cluck cluck!"); h.position.set(-1.5 + i * 1.0, 0, (i % 2) * 1.2 - 0.6); h.rotation.y = i * 1.5; g.add(h); hens.push(h); }
  add(g, box(1.6, 1.2, 1.2, NA.barn), -3.0, 0.6, 0); add(g, cone(1.2, 0.7, "#5a5a5a", 4), -3.0, 1.55, 0).rotation.y = Math.PI / 4; add(g, box(0.4, 0.5, 0.06, "#2a2a2e"), -3.0, 0.35, 0.63); add(g, box(0.8, 0.04, 0.5, NA.wood), -3.0, 0.1, 0.9).rotation.x = 0.3;
  const cw = cow(false, false, "Moo!"); cw.position.set(2.4, 0, -0.4); cw.rotation.y = 0.5; g.add(cw);
  for (let i = 0; i < 2; i++) { add(g, cyl(0.2, 0.18, 0.5, "#c9cfd6", 10), 3.8 + i * 0.5, 0.25, 1.0); add(g, cyl(0.12, 0.12, 0.12, "#c9cfd6", 8), 3.8 + i * 0.5, 0.56, 1.0); }
  add(g, cyl(0.24, 0.2, 0.2, C.straw, 9), 0.8, 0.1, 1.6); for (let k = 0; k < 6; k++) add(g, ball(0.06, "#f4e6d0", 5), 0.8 + (rnd() - 0.5) * 0.3, 0.24, 1.6 + (rnd() - 0.5) * 0.3).scale.y = 1.3;
  const farmer = american("#c0392b", { cap: NA.denim }); add(g, farmer, 1.0, 0, 2.2); farmer.rotation.y = Math.PI;
  for (const [x, z, rot, len] of [[0.6, -1.6, 0, 8], [0.6, 2.8, 0, 8], [-3.4, 0.6, Math.PI / 2, 4.4], [4.6, 0.6, Math.PI / 2, 4.4]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.1); for (let i = 0; i <= n; i++) add(f, box(0.09, 0.7, 0.09, NA.white), -len / 2 + (i / n) * len, 0.35, 0); add(f, box(len, 0.06, 0.05, NA.white), 0, 0.55, 0); add(f, box(len, 0.06, 0.05, NA.white), 0, 0.3, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(hens[1], "Cluck cluck!", 1.1, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); hens.forEach((h, i) => { h.position.y = k * Math.abs(Math.sin(t * 12 + i)) * 0.35; }); tickChildren(g)(t, dt); };
  return g;
}

/** A farmhouse kitchen with an Instant Pot on the counter, a lemon bowl, a pie cooling, a porch with a rocking chair. */
export function farmKitchen(): P {
  const g = group();
  add(g, box(4.4, 2.4, 3.2, NA.white), 0, 1.2, -1.4); for (const sd of [-1, 1]) { const r = add(g, box(4.9, 0.1, 2.0, "#4a4a50"), 0, 2.6, -1.4 + sd * 0.85); r.rotation.x = -sd * 0.5; } add(g, box(4.8, 0.06, 0.24, "#3a3a3d"), 0, 3.05, -1.4);
  add(g, box(0.9, 1.6, 0.06, "#2f5d3f"), -1.2, 0.8, 0.23); for (let k = 0; k < 2; k++) add(g, box(0.8, 0.8, 0.06, NA.glass), 0.4 + k * 1.2, 1.5, 0.23);
  add(g, box(4.6, 0.12, 1.6, "#a37a4f"), 0, 0.3, 1.0); for (const x of [-2.1, 2.1]) add(g, cyl(0.06, 0.06, 2.2, NA.white, 6), x, 1.4, 1.7); add(g, box(4.8, 0.08, 1.8, "#4a4a50"), 0, 2.5, 1.0);
  // the kitchen counter seen through the open front
  add(g, box(2.4, 0.8, 0.7, "#c9a86a"), -0.4, 0.75, 0.6); add(g, box(2.4, 0.06, 0.74, NA.white), -0.4, 1.18, 0.6);
  const pot = new THREE.Group(); pot.position.set(-1.2, 1.2, 0.6); g.add(pot); add(pot, cyl(0.28, 0.26, 0.42, NA.chrome, 12), 0, 0.21, 0); add(pot, cyl(0.3, 0.3, 0.06, "#2a2a2e", 12), 0, 0.45, 0); add(pot, box(0.16, 0.08, 0.04, "#2a2a2e"), 0, 0.3, 0.27); add(pot, ball(0.03, "#3fa2b0", 4), 0.08, 0.3, 0.27); const lid = add(pot, box(0.14, 0.04, 0.06, "#2a2a2e"), 0, 0.5, 0);   // the Instant Pot and its lid handle
  add(g, cyl(0.24, 0.2, 0.1, NA.white, 10), -0.1, 1.24, 0.5); for (let k = 0; k < 5; k++) add(g, ball(0.07, NA.yellow, 6), -0.1 + Math.cos(k * 1.25) * 0.12, 1.32, 0.5 + Math.sin(k * 1.25) * 0.12).scale.set(1.2, 1, 1);   // lemons
  add(g, cyl(0.26, 0.22, 0.08, "#c9a86a", 12), 0.6, 1.24, 0.6); add(g, cyl(0.22, 0.22, 0.05, "#b8782a", 12), 0.6, 1.3, 0.6); for (let k = 0; k < 4; k++) add(g, box(0.4, 0.02, 0.05, "#d9a441"), 0.6, 1.34, 0.6).rotation.y = k * 0.78;   // the pie
  for (let k = 0; k < 3; k++) add(g, ball(0.05, "#f1e9dc", 5), 0.5 + k * 0.1, 1.24, 0.95);
  const cook = american("#e8558a", { apron: true }); add(g, cook, -0.4, 0, 1.5); cook.rotation.y = Math.PI;
  add(g, box(0.5, 0.05, 0.5, NA.wood), 1.7, 0.6, 1.2); add(g, box(0.5, 0.6, 0.05, NA.wood), 1.7, 0.9, 0.95); for (const x of [-0.2, 0.2]) add(g, box(0.05, 0.3, 0.6, NA.wood), 1.7 + x, 0.45, 1.2).rotation.x = 0.0; const rocker = american(NA.denim, { cowboy: true }); rocker.userData.sit?.(); add(g, rocker, 1.7, 0.2, 1.2);   // grandpa in the rocking chair
  g.userData.steam = new THREE.Vector3(-1.2, 1.9, 0.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Supper's ready!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); lid.position.y = 0.5 + k * Math.abs(Math.sin(t * 6)) * 0.2; lid.rotation.y += k * dt * 6; pot.rotation.y = k * Math.sin(t * 10) * 0.05; if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; rocker.rotation.x = Math.sin(t * 1.5) * 0.08 + k * Math.sin(t * 6) * 0.1; };
  return g;
}

/** A drive-in burger stand: a flat-top, smash burgers, fries in a basket, shakes, a picnic table. */
export function burgerStand(): P {
  const g = group();
  add(g, box(4.6, 2.2, 2.6, NA.white), 0, 1.1, -1.0); add(g, box(5.0, 0.12, 3.0, NA.red), 0, 2.26, -1.0); for (let k = 0; k < 8; k++) add(g, box(0.62, 0.12, 3.0, k % 2 ? NA.white : NA.red), -2.2 + k * 0.63, 2.28, -1.0);
  add(g, cyl(0.05, 0.05, 3.2, NA.steel, 5), 3.0, 1.6, 0.8); add(g, box(1.6, 0.9, 0.08, NA.yellow), 3.0, 3.6, 0.8); add(g, box(1.3, 0.3, 0.02, NA.red), 3.0, 3.6, 0.85); add(g, cone(0.12, 0.3, NA.red, 5), 3.0, 4.2, 0.8);   // the sign
  add(g, box(3.2, 0.8, 0.8, NA.chrome), -0.4, 0.4, 0.7); add(g, box(1.2, 0.06, 0.7, "#3a3a3d"), -1.2, 0.83, 0.7);
  const patties: THREE.Mesh[] = []; for (let k = 0; k < 4; k++) patties.push(add(g, cyl(0.14, 0.14, 0.04, "#6b3a2a", 10), -1.6 + (k % 2) * 0.4, 0.88, 0.5 + Math.floor(k / 2) * 0.35));
  const burger = (x: number, z: number) => { const b = new THREE.Group(); b.position.set(x, 0.86, z); g.add(b); add(b, cyl(0.15, 0.15, 0.05, "#e9c46a", 10), 0, 0.02, 0); add(b, cyl(0.15, 0.15, 0.04, "#6b3a2a", 10), 0, 0.07, 0); add(b, box(0.28, 0.02, 0.28, NA.yellow), 0, 0.1, 0); add(b, cyl(0.14, 0.14, 0.03, "#8fc26a", 10), 0, 0.13, 0); add(b, cyl(0.14, 0.14, 0.03, "#c0392b", 10), 0, 0.16, 0); add(b, ball(0.15, "#e9c46a", 8), 0, 0.2, 0).scale.y = 0.6; for (let s = 0; s < 4; s++) add(b, ball(0.015, "#f4e6d0", 3), Math.cos(s * 1.6) * 0.08, 0.3, Math.sin(s * 1.6) * 0.08); return b; };
  const burgers = [burger(0.3, 0.6), burger(0.7, 0.9)];
  add(g, box(0.4, 0.3, 0.4, NA.red), 1.2, 0.98, 0.6); for (let k = 0; k < 8; k++) add(g, box(0.04, 0.35, 0.04, NA.yellow), 1.05 + (k % 4) * 0.1, 1.25, 0.5 + Math.floor(k / 4) * 0.12);   // fries
  for (let k = 0; k < 2; k++) { add(g, cyl(0.08, 0.07, 0.24, ["#f4a6b8", "#8a5a3a"][k], 8), 1.6 + k * 0.25, 0.95, 0.9); add(g, ball(0.08, NA.white, 6), 1.6 + k * 0.25, 1.1, 0.9); add(g, cyl(0.01, 0.01, 0.2, NA.red, 3), 1.6 + k * 0.25, 1.2, 0.9); }   // shakes
  const cook = american(NA.white, { apron: true, cap: NA.white }); add(g, cook, -1.2, 0, 0.0); cook.rotation.y = 0; const spat = add(g, box(0.05, 0.02, 0.3, NA.chrome), -1.0, 1.05, 0.5);
  add(g, box(2.0, 0.08, 0.8, NA.wood), 0, 0.7, 2.6); for (const z of [2.1, 3.1]) add(g, box(2.0, 0.06, 0.3, NA.wood), 0, 0.45, z); for (const x of [-0.8, 0.8]) add(g, box(0.08, 0.7, 1.2, NA.wood), x, 0.35, 2.6);
  const eaters: Fig[] = [];
  for (let i = 0; i < 4; i++) { const e = american(pick([NA.denim, "#c0392b", "#2f5d3f", NA.yellow]), { cap: i % 2 ? NA.red : undefined }); e.userData.sit?.(); add(g, e, -0.5 + (i % 2) * 1.0, 0.04, i < 2 ? 2.0 : 3.2).rotation.y = i < 2 ? 0 : Math.PI; eaters.push(e); }
  g.userData.steam = new THREE.Vector3(-1.2, 1.3, 0.7);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Two smash burgers, extra pickles!", 1.5, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); spat.position.y = 1.05 + k * Math.abs(Math.sin(t * 12)) * 0.3; patties.forEach((p, i) => { p.position.y = 0.88 + k * Math.max(0, Math.sin(t * 10 + i * 1.4)) * 0.25; p.rotation.x = k * Math.sin(t * 10 + i) * 1.5; }); burgers.forEach((b, i) => { b.position.y = 0.86 + k * Math.abs(Math.sin(t * 8 + i)) * 0.2; }); eaters.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); };
  return g;
}

/** A county-fair bake stand: cookies and pies under a striped awning, a blue ribbon, a Ferris wheel behind. */
export function bakeStand(): P {
  const g = group();
  add(g, box(3.0, 0.8, 1.2, NA.white), 0, 0.4, 0); add(g, box(3.0, 0.06, 1.2, NA.red), 0, 0.83, 0); for (const x of [-1.4, 1.4]) add(g, cyl(0.04, 0.04, 2.3, NA.white, 5), x, 1.15, -0.5); for (let k = 0; k < 6; k++) add(g, box(0.56, 0.06, 1.8, k % 2 ? NA.white : "#2f6fb5"), -1.4 + k * 0.57, 2.3, 0.1).rotation.x = 0.15;
  const trays: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const tr = new THREE.Group(); tr.position.set(-1.0 + i * 1.0, 0.86, 0); g.add(tr); trays.push(tr); add(tr, box(0.8, 0.03, 0.6, "#c9c2b0"), 0, 0, 0); for (let k = 0; k < 6; k++) { const c = add(tr, cyl(0.1, 0.1, 0.04, i === 1 ? "#d9a441" : "#c9862a", 10), -0.25 + (k % 3) * 0.25, 0.04, -0.15 + Math.floor(k / 3) * 0.3); if (i !== 1) for (let s = 0; s < 3; s++) add(c, ball(0.02, "#3a2a1a", 4), (s - 1) * 0.05, 0.03, (s % 2 - 0.5) * 0.06); else add(c, ball(0.03, "#e9c46a", 4), 0, 0.03, 0); } }   // chocolate chip and banana-nut cookies
  add(g, cyl(0.26, 0.22, 0.08, "#c9a86a", 12), 1.1, 0.9, 0.4); add(g, cyl(0.22, 0.22, 0.05, "#c0392b", 12), 1.1, 0.96, 0.4); add(g, cyl(0.1, 0.1, 0.02, "#2f6fb5", 8), -1.3, 0.87, 0.45); add(g, box(0.04, 0.16, 0.01, "#2f6fb5"), -1.3, 0.78, 0.45);   // a cherry pie and the blue ribbon
  const baker = american("#e8558a", { apron: true }); add(g, baker, 0.3, 0, -0.9);
  const kid = american(NA.yellow, { cap: NA.red }); add(g, kid, -0.8, 0, 1.0); kid.rotation.y = Math.PI; kid.scale.setScalar(0.75);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(baker, "Fresh out of the oven!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); trays.forEach((tr, i) => { tr.position.y = 0.86 + k * Math.max(0, Math.sin(t * 9 + i * 1.3)) * 0.3; }); if (baker.userData.upper) baker.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; kid.position.y = k * Math.abs(Math.sin(t * 10)) * 0.25; };
  return g;
}

export function ferrisWheel(): P {
  const g = group();
  for (const sd of [-1, 1]) add(g, cyl(0.08, 0.1, 4.4, NA.steel, 5), sd * 0.5, 2.2, 0).rotation.z = sd * 0.25;
  const wheel = new THREE.Group(); wheel.position.y = 4.2; g.add(wheel);
  add(wheel, new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.06, 6, 24), mat(NA.steel)), 0, 0, 0);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; add(wheel, cyl(0.03, 0.03, 3.0, NA.steel, 4), Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0).rotation.z = a + Math.PI / 2; }
  const cars: THREE.Mesh[] = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const c = add(wheel, box(0.5, 0.4, 0.5, [NA.red, NA.yellow, "#2f6fb5", "#3f8f5a"][i % 4]), Math.cos(a) * 3.0, Math.sin(a) * 3.0 - 0.3, 0); cars.push(c); }
  g.userData.tick = (t) => { wheel.rotation.z = t * 0.2; cars.forEach((c) => { c.rotation.z = -wheel.rotation.z; }); };
  return g;
}

// ---------- Texas & the South ----------

/** The smokehouse: an offset barrel smoker with a chimney, ribs and brisket on the grate, a chili pot, a kamado, a wood pile, picnic tables. */
export function smokehouse(): P {
  const g = group();
  add(g, box(5.0, 2.4, 3.0, "#8a6a4a"), 0, 1.2, -1.4); for (let k = 0; k < 9; k++) add(g, box(5.1, 0.04, 0.04, "#6a4a2a"), 0, 0.3 + k * 0.26, 0.11); add(g, box(5.4, 0.1, 3.4, "#5a5a5a"), 0, 2.5, -1.4).rotation.x = 0.08;
  add(g, box(2.6, 0.6, 0.08, "#2a2a2e"), 0, 2.0, 0.22); add(g, box(2.3, 0.35, 0.02, NA.yellow), 0, 2.0, 0.27);
  const smoker = add(g, cyl(0.55, 0.55, 2.4, "#2a2a2e", 14), -1.4, 0.95, 1.0); smoker.rotation.z = Math.PI / 2; add(g, cyl(0.4, 0.4, 0.9, "#2a2a2e", 12), -2.9, 0.75, 1.0); add(g, cyl(0.1, 0.1, 1.4, "#2a2a2e", 8), -2.9, 1.8, 1.0); for (const x of [-2.2, -0.6]) add(g, box(0.1, 0.5, 0.1, "#2a2a2e"), x, 0.25, 1.0);
  const lid = new THREE.Group(); lid.position.set(-1.4, 0.95, 0.5); g.add(lid); add(lid, new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 2.3, 14, 1, false, 0, Math.PI), mat("#3a3a3d")), 0, 0, 0.5).rotation.set(0, 0, Math.PI / 2); add(lid, cyl(0.03, 0.03, 0.5, NA.steel, 4), 0, 0.5, 0.6).rotation.x = Math.PI / 2;
  const meats: THREE.Mesh[] = []; for (let k = 0; k < 3; k++) { const rib = add(g, box(0.6, 0.12, 0.28, "#7a3a2a"), -2.0 + k * 0.6, 1.05, 1.0); for (let b = 0; b < 4; b++) add(rib, box(0.04, 0.02, 0.28, "#f4e6d0"), -0.22 + b * 0.15, 0.07, 0); meats.push(rib); } meats.push(add(g, box(0.7, 0.3, 0.45, "#5a2a1a"), -0.4, 1.12, 1.0));   // ribs and a brisket
  // the kamado and the chili pot over coals
  add(g, ball(0.5, "#2f5d3f", 12), 1.4, 0.8, 0.8).scale.y = 1.2; add(g, cyl(0.45, 0.45, 0.05, "#5a5a5a", 12), 1.4, 1.05, 0.8); add(g, cyl(0.3, 0.3, 0.3, "#2a2a2e", 10), 1.4, 0.2, 0.8); const kamadoLid = add(g, new THREE.Mesh(new THREE.SphereGeometry(0.52, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat("#2f5d3f")), 1.4, 1.05, 0.8); for (let k = 0; k < 4; k++) add(g, ball(0.08, "#e07a3a", 5), 1.4 + Math.cos(k * 1.6) * 0.25, 1.08, 0.8 + Math.sin(k * 1.6) * 0.25);   // carrots on the kamado
  add(g, cyl(0.5, 0.5, 0.2, "#8f857a", 12), 2.7, 0.1, 1.2); for (let k = 0; k < 4; k++) add(g, ball(0.07, "#f08a2a", 5), 2.7 + Math.cos(k * 1.6) * 0.25, 0.22, 1.2 + Math.sin(k * 1.6) * 0.25); const chiliPot = add(g, cyl(0.4, 0.34, 0.45, "#2a2a2e", 12), 2.7, 0.5, 1.2); add(g, cyl(0.36, 0.36, 0.05, "#8e2a22", 12), 2.7, 0.75, 1.2); const ladle = add(g, cyl(0.02, 0.02, 0.7, NA.steel, 4), 2.85, 1.0, 1.2); ladle.rotation.z = 0.5; void chiliPot;
  for (let k = 0; k < 8; k++) add(g, cyl(0.1, 0.1, 0.8, "#8a6a3a", 6), -3.6 + (k % 4) * 0.22, 0.1 + Math.floor(k / 4) * 0.2, 2.2 + (k % 2) * 0.1).rotation.z = Math.PI / 2;   // the wood pile
  const pit = american("#2a2a2e", { apron: true, cowboy: true }); add(g, pit, -1.4, 0, 2.2); pit.rotation.y = Math.PI; const tongs = add(g, box(0.04, 0.35, 0.04, NA.steel), -1.2, 1.2, 1.8); tongs.rotation.x = 0.6;
  const eaters: Fig[] = [];
  for (const x of [1.2, 3.4]) { add(g, box(1.6, 0.08, 0.8, NA.wood), x, 0.7, 3.2); for (const z of [2.7, 3.7]) add(g, box(1.6, 0.06, 0.3, NA.wood), x, 0.45, z); add(g, box(0.5, 0.03, 0.4, "#c9a86a"), x, 0.75, 3.2); add(g, box(0.3, 0.06, 0.2, "#7a3a2a"), x - 0.1, 0.8, 3.2); add(g, cyl(0.05, 0.04, 0.16, NA.yellow, 6), x + 0.4, 0.82, 3.0); add(g, ball(0.06, "#e9c46a", 5), x + 0.3, 0.8, 3.4).scale.y = 0.5; for (let i = 0; i < 2; i++) { const e = american(pick([NA.denim, "#c0392b", NA.white, "#2f5d3f"]), { cowboy: i === 0 }); e.userData.sit?.(); add(g, e, x - 0.4 + i * 0.8, 0.04, 3.9).rotation.y = Math.PI; eaters.push(e); } }
  g.userData.smoke = new THREE.Vector3(-2.9, 2.6, 1.0); g.userData.steam = new THREE.Vector3(2.7, 1.1, 1.2);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(pit, "Low and slow, y'all!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); lid.rotation.x = -k * Math.max(0, Math.sin(k * Math.PI)) * 1.2; kamadoLid.position.y = 1.05 + k * Math.max(0, Math.sin(t * 4)) * 0.5; meats.forEach((m, i) => { m.position.y = (i === 3 ? 1.12 : 1.05) + k * Math.max(0, Math.sin(t * 9 + i)) * 0.25; }); ladle.rotation.y = t * (0.4 + k * 6); tongs.position.y = 1.2 + k * Math.abs(Math.sin(t * 10)) * 0.3; eaters.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (pit.userData.upper) pit.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** A longhorn ranch: cattle with wide horns, a cowboy on a horse, a windmill pump, a corral, hog pen alongside. */
export function longhornRanch(): P {
  const g = group();
  const cattle: P[] = [];
  for (let i = 0; i < 3; i++) { const c = cow(i === 1, false, "Moo!"); for (const sd of [-1, 1]) { const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 1.1, 6), mat("#e9d7a8")); horn.position.set(0.95, 1.55, sd * 0.55); horn.rotation.z = Math.PI / 2; horn.rotation.x = sd * 0.5; c.add(horn); add(horn, ball(0.04, "#5a4a3a", 4), 0, 0.55, 0); } c.position.set(-2.2 + i * 2.0, 0, -0.5 + (i % 2) * 1.4); c.rotation.y = i * 1.4; g.add(c); cattle.push(c); }
  for (const [x, z, rot, len] of [[0, -2.2, 0, 7], [0, 2.2, 0, 7], [-3.5, 0, Math.PI / 2, 4.4], [3.5, 0, Math.PI / 2, 4.4]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.1); for (let i = 0; i <= n; i++) add(f, box(0.1, 0.8, 0.1, NA.wood), -len / 2 + (i / n) * len, 0.4, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.62, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.34, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  const mount = horse("#6b4a2c", NA.denim); mount.position.set(5.6, 0, 1.0); mount.rotation.y = 0.4; g.add(mount); const cowboy = (mount.userData as { rider?: Fig }).rider!;
  for (const sd of [-1, 1]) add(g, cyl(0.05, 0.06, 4.5, NA.steel, 5), 5.2 + sd * 0.35, 2.25, -1.6).rotation.z = sd * 0.1; add(g, box(0.5, 0.3, 0.3, NA.steel), 5.2, 4.5, -1.6); const fan = new THREE.Group(); fan.position.set(5.2, 4.5, -1.35); g.add(fan); for (let i = 0; i < 12; i++) add(fan, box(0.12, 0.7, 0.02, "#c9cfd6"), Math.cos(i * 0.52) * 0.4, Math.sin(i * 0.52) * 0.4, 0).rotation.z = i * 0.52 + Math.PI / 2; add(g, box(0.06, 0.5, 0.5, "#c9cfd6"), 5.2, 4.5, -2.0); add(g, cyl(0.7, 0.7, 0.4, NA.steel, 10), 5.2, 0.2, -1.6); add(g, cyl(0.62, 0.62, 0.05, "#8fd0dc", 10), 5.2, 0.43, -1.6);   // the windmill pump and its trough
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cowboy, "Yeehaw!", 1.6, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); fan.rotation.z = t * 1.5; cattle.forEach((c, i) => { c.position.y = k * Math.abs(Math.sin(t * 10 + i)) * 0.1; }); mount.userData.gait?.(t, k); mount.position.y += k * Math.abs(Math.sin(t * 8)) * 0.2; tickChildren(g)(t, dt); };
  return g;
}


/** A horse; legs swing when `gait` is driven. Optional rider in a cowboy hat. */
export function horse(coat = "#6b4a2c", rider?: string): P {
  const g = group();
  add(g, box(1.3, 0.6, 0.55, coat), 0, 0.95, 0); const neck = add(g, box(0.35, 0.7, 0.35, coat), 0.6, 1.35, 0); neck.rotation.z = -0.5; add(g, box(0.5, 0.3, 0.3, coat), 0.95, 1.6, 0); add(g, box(0.08, 0.14, 0.06, coat), 1.0, 1.8, 0.1); add(g, box(0.08, 0.14, 0.06, coat), 1.0, 1.8, -0.1);
  add(g, box(0.1, 0.5, 0.12, "#2a2a2e"), 0.55, 1.5, 0).rotation.z = -0.5; add(g, box(0.08, 0.5, 0.08, "#2a2a2e"), -0.7, 0.75, 0).rotation.z = 0.3;   // mane and tail
  const legs: THREE.Mesh[] = []; for (const x of [-0.5, 0.5]) for (const z of [-0.18, 0.18]) { const l = box(0.14, 0.7, 0.14, coat); l.position.set(x, 0.65, z); l.geometry.translate(0, -0.3, 0); g.add(l); legs.push(l); }
  add(g, box(0.5, 0.1, 0.6, "#8a5a3a"), 0, 1.28, 0);
  if (rider) { const c = american(rider, { cowboy: true }); c.userData.sit?.(); add(g, c, 0, 1.3, 0); c.rotation.y = Math.PI / 2; c.scale.setScalar(0.9); add(c, new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 5, 12), mat("#c9a86a")), 0.3, 0.9, 0.2); (g.userData as { rider?: Fig }).rider = c; }
  g.userData.gait = (t: number, k: number) => { legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 6 + (i % 2) * Math.PI + Math.floor(i / 2) * 0.5) * 0.5 * k; }); g.position.y = Math.abs(Math.sin(t * 6)) * 0.08 * k; };
  return g;
}

/** A hitching post with two horses tied up, and a cowboy leaning on the rail. */
export function hitchingPost(): P {
  const g = group();
  add(g, box(2.6, 0.08, 0.08, NA.wood), 0, 0.9, 0); for (const x of [-1.2, 1.2]) add(g, box(0.12, 0.9, 0.12, NA.wood), x, 0.45, 0);
  const hs = [horse("#6b4a2c"), horse("#3a2a1e")]; hs.forEach((h, i) => { h.position.set(-0.7 + i * 1.4, 0, 1.0); h.rotation.y = -Math.PI / 2 + (i ? 0.2 : -0.2); g.add(h); });
  add(g, cyl(0.3, 0.3, 0.3, "#8c9096", 8), 1.9, 0.15, 0.6); add(g, cyl(0.26, 0.26, 0.04, "#8fd0dc", 8), 1.9, 0.32, 0.6);
  const cb = american(NA.denim, { cowboy: true }); add(g, cb, -1.7, 0, -0.4); cb.rotation.y = 0.6;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(hs[0], "Neigh!", 1.9, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); hs.forEach((h, i) => { h.userData.gait?.(t + i, k); h.rotation.x = k * Math.sin(t * 8 + i) * 0.1; }); if (cb.userData.upper) cb.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

export function hogPen(): P {
  const g = group();
  const pigs: P[] = [];
  for (let i = 0; i < 3; i++) { const p = group(); add(p, box(1.0, 0.55, 0.6, C.pinkPig), 0, 0.45, 0); const head = add(p, box(0.45, 0.45, 0.45, C.pinkPig), 0.65, 0.45, 0); add(head, box(0.14, 0.2, 0.26, "#d98b83"), 0.28, -0.05, 0); for (const z of [-0.16, 0.16]) add(head, box(0.1, 0.18, 0.1, "#d98b83"), 0, 0.28, z); for (const x of [-0.32, 0.32]) for (const z of [-0.18, 0.18]) add(p, box(0.15, 0.28, 0.15, C.pinkPig), x, 0.14, z); p.position.set(-1.2 + i * 1.1, 0, (i % 2) * 0.9 - 0.4); p.rotation.y = i * 1.3 + 0.5; g.add(p); pigs.push(p); }
  for (const [x, z, rot, len] of [[-0.1, -1.4, 0, 4.2], [-0.1, 1.4, 0, 4.2], [-2.2, 0, Math.PI / 2, 2.8], [2.0, 0, Math.PI / 2, 2.8]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.0); for (let i = 0; i <= n; i++) add(f, box(0.1, 0.7, 0.1, NA.wood), -len / 2 + (i / n) * len, 0.35, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.55, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.3, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  add(g, cyl(0.3, 0.26, 0.2, "#8c9096", 8), 1.4, 0.1, 0.8); add(g, ball(0.06, "#e9c46a", 4), 1.4, 0.22, 0.8);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(pigs[1], "Oink oink!", 1.1, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pigs.forEach((p, i) => { p.position.y = k * Math.abs(Math.sin(t * 12 + i)) * 0.3; p.rotation.z = k * Math.sin(t * 16 + i) * 0.12; }); };
  return g;
}

export function pumpjack(): P {
  const g = group();
  add(g, box(2.4, 0.3, 1.2, "#5a5a5a"), 0, 0.15, 0);
  for (const sd of [-1, 1]) add(g, box(0.15, 2.6, 0.15, "#2a2a2e"), sd * 0.4, 1.5, 0).rotation.z = sd * 0.15;
  const beam = new THREE.Group(); beam.position.y = 2.8; g.add(beam); add(beam, box(3.2, 0.2, 0.3, "#2a2a2e"), 0, 0, 0); add(beam, box(0.4, 0.8, 0.5, "#c0392b"), 1.6, -0.1, 0); add(beam, cyl(0.04, 0.04, 1.4, "#8c9096", 4), 1.7, -0.9, 0);
  add(g, cyl(0.5, 0.5, 0.2, "#2a2a2e", 12), -1.4, 0.9, 0.5).rotation.x = Math.PI / 2; add(g, box(1.0, 0.7, 0.7, "#5a5a5a"), -1.2, 0.5, -0.3);
  const arm = add(g, box(0.1, 1.6, 0.1, "#8c9096"), -1.4, 1.8, 0.5); void arm;
  g.userData.tick = (t) => { beam.rotation.z = Math.sin(t * 1.6) * 0.12; arm.rotation.z = Math.sin(t * 1.6) * 0.1; };
  return g;
}

/** A honky-tonk saloon with swing doors, a neon boot, a band on the porch, and a Route 66 shield out front. */
export function saloon(): P {
  const g = group();
  add(g, box(4.8, 2.6, 3.0, "#8a6a4a"), 0, 1.3, -1.2); add(g, box(5.2, 1.0, 0.2, "#6a4a2a"), 0, 3.1, 0.3); add(g, box(4.4, 0.5, 0.06, "#1f2430"), 0, 3.1, 0.42); add(g, box(0.5, 0.4, 0.02, "#f06a8a"), 1.4, 3.1, 0.46); add(g, box(2.6, 0.25, 0.02, "#6fd0e0"), -0.6, 3.1, 0.46);
  add(g, box(5.2, 0.1, 1.6, "#6a4a2a"), 0, 2.5, 1.0); for (const x of [-2.4, 2.4]) add(g, cyl(0.06, 0.06, 2.5, "#6a4a2a", 6), x, 1.25, 1.7); add(g, box(5.2, 0.15, 1.8, "#a37a4f"), 0, 0.1, 1.0);
  for (const sd of [-1, 1]) add(g, box(0.5, 0.9, 0.05, "#5a3d28"), sd * 0.3, 1.0, 0.33).rotation.y = sd * 0.4;   // swing doors
  const band: Fig[] = [];
  for (let i = 0; i < 3; i++) { const m = american(["#2a2a2e", NA.denim, "#c0392b"][i], { cowboy: true }); add(g, m, -1.6 + i * 1.3, 0.18, 1.1); m.rotation.y = 0.2 - i * 0.2; if (i === 0) add(m, box(0.5, 0.3, 0.12, "#a37a4f"), 0.1, 0.8, 0.3); if (i === 1) add(m, box(0.3, 0.9, 0.12, "#a37a4f"), 0.1, 0.9, 0.3); if (i === 2) add(m, box(0.25, 0.5, 0.1, "#c9a37a"), 0.15, 0.85, 0.28); band.push(m); }
  add(g, cyl(0.04, 0.04, 2.4, NA.steel, 5), 3.4, 1.2, 1.4); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 6), mat(NA.white)), 3.4, 2.6, 1.4).rotation.x = Math.PI / 2; add(g, box(0.5, 0.2, 0.02, "#2a2a2e"), 3.4, 2.6, 1.44);   // the Route 66 shield
  const truck = new THREE.Group(); truck.position.set(-4.2, 0, 1.6); truck.rotation.y = 0.3; g.add(truck); add(truck, box(2.6, 0.6, 1.2, "#3f8f5a"), 0, 0.6, 0); add(truck, box(1.0, 0.7, 1.15, "#3f8f5a"), -0.6, 1.25, 0); add(truck, box(0.9, 0.5, 1.1, NA.glass), -0.6, 1.3, 0); add(truck, box(1.3, 0.35, 1.1, "#2f5d3f"), 0.6, 1.05, 0); for (const x of [-0.9, 0.9]) for (const z of [-0.6, 0.6]) add(truck, cyl(0.28, 0.28, 0.2, "#2a2a2e", 10), x, 0.3, z).rotation.x = Math.PI / 2; for (let k = 0; k < 3; k++) add(truck, cyl(0.12, 0.14, 0.4, "#c9a86a", 6), 0.3 + k * 0.3, 1.3, -0.2 + (k % 2) * 0.3);   // the pickup with hay in the bed
  const notes: THREE.Mesh[] = []; for (let i = 0; i < 4; i++) { const n = ball(0.06, "#2a2a2e", 6); n.visible = false; g.add(n); notes.push(n); }
  const re = reaction(0.4);
  g.userData.poke = () => { re.poke(); bubble(band[1], "Y'all come on in!", 1.6, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); band.forEach((m, i) => { if (m.userData.upper) { m.userData.upper.rotation.z = Math.sin(t * 1.2 + i) * 0.04 + k * Math.sin(t * 7 + i) * 0.15; m.userData.upper.rotation.x = k * Math.abs(Math.sin(t * 4 + i)) * 0.1; } m.position.y = 0.18 + k * Math.abs(Math.sin(t * 8 + i)) * 0.15; }); notes.forEach((n, i) => { const a = (t * 1.5 + i * 1.3) % 6; n.visible = k > 0.05; n.position.set(-0.3 + Math.sin(a) * 1.4, 2.0 + a * 0.4, 1.1 + Math.cos(a) * 0.5); n.scale.setScalar(Math.max(0.01, 1 - a / 6) * k * 2); }); };
  return g;
}

export function mesa(w = 6, h = 4, d = 4): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(w * 0.4, w * 0.55, h, 8), mat("#c0704a")), 0, h / 2, 0).scale.z = d / w;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(w * 0.32, w * 0.4, h * 0.3, 8), mat("#d98a5a")), 0, h + h * 0.15, 0).scale.z = d / w;
  for (let k = 0; k < 3; k++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(w * 0.55 - k * 0.05, w * 0.58 - k * 0.05, 0.12, 8), mat(k % 2 ? "#a8553a" : "#c96a3a")), 0, h * 0.3 + k * h * 0.22, 0).scale.z = d / w;
  return g;
}

// ---------- California ----------

export function goldenGate(len = 8): P {
  const g = group();
  const c = "#c0522a";
  add(g, box(len + 2, 0.4, 2.0, c), 0, 2.2, 0); for (let k = 0; k < 3; k++) add(g, box(len + 2, 0.02, 0.06, "#e9dcb4"), 0, 2.42, -0.5 + k * 0.5);
  for (const sd of [-1, 1]) { add(g, box(2.2, 2.0, 2.4, "#8f857a"), sd * (len / 2 + 0.4), 1.0, 0); add(g, box(1.6, 1.1, 2.4, "#8f857a"), sd * (len / 2 + 2.2), 0.55, 0); }   // the stone abutments and the approach ramps
  for (const sd of [-1, 1]) { const x = sd * len * 0.3; for (const z of [-0.8, 0.8]) add(g, box(0.5, 7.5, 0.5, c), x, 3.75, z); for (const y of [4.2, 6.0, 7.4]) add(g, box(1.6, 0.4, 0.4, c), x, y, 0); }
  const cable = (x0: number, x1: number, y0: number, y1: number, sag: number) => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(new THREE.Vector3(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * sag, 0)); } return new THREE.CatmullRomCurve3(pts); };
  for (const z of [-0.8, 0.8]) { for (const [a, b, ya, yb, sg] of [[-len * 0.3, len * 0.3, 7.4, 7.4, 3.0], [-len / 2 - 1, -len * 0.3, 2.6, 7.4, 0.4], [len * 0.3, len / 2 + 1, 7.4, 2.6, 0.4]] as [number, number, number, number, number][]) { const tube = new THREE.Mesh(new THREE.TubeGeometry(cable(a, b, ya, yb, sg), 12, 0.05, 5, false), mat(c)); tube.position.z = z; g.add(tube); } for (let i = 0; i < 9; i++) { const x = -len * 0.3 + (i / 8) * len * 0.6; const y = 7.4 - Math.sin((i / 8) * Math.PI) * 3.0; add(g, cyl(0.015, 0.015, y - 2.4, c, 3), x, (y + 2.4) / 2, z); } }
  return g;
}

export function redwood(s = 1): P {
  const g = group();
  add(g, cyl(0.28 * s, 0.45 * s, 7 * s, "#7a3a2a", 8), 0, 3.5 * s, 0);
  for (let i = 0; i < 6; i++) add(g, cone((2.2 - i * 0.28) * s, 1.8 * s, i % 2 ? "#2f5d3f" : "#3a6b48", 9), 0, (3.2 + i * 1.1) * s, 0);
  return g;
}

/** A California farmers market: citrus and avocados, greens for slaw, honey and lemons, berries, a juice stand. */
export function farmersMarket(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(15, 9), mat("#cfc6b2")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  const vendors: Fig[] = [];
  const stall = (kind: string, color: string) => {
    const s = group();
    add(s, box(2.6, 0.8, 1.2, NA.wood), 0, 0.45, 0); add(s, box(2.6, 0.06, 1.2, "#5a3d28"), 0, 0.88, 0);
    for (const x of [-1.2, 1.2]) for (const z of [-0.55, 0.55]) add(s, cyl(0.04, 0.04, 2.4, NA.white, 5), x, 1.2, z); add(s, box(2.8, 0.06, 1.6, color), 0, 2.4, 0);
    const goods = new THREE.Group(); goods.position.y = 0.92; s.add(goods);
    switch (kind) {
      case "citrus": for (let i = 0; i < 3; i++) { const bk = add(goods, box(0.7, 0.2, 0.5, "#a37a4f"), -0.85 + i * 0.85, 0.1, 0); for (let k = 0; k < 8; k++) add(bk, ball(0.08, ["#f2cf3a", "#7fbf3a", "#f08a2a"][i], 6), -0.25 + (k % 4) * 0.17, 0.2, -0.12 + Math.floor(k / 4) * 0.24); } break;
      case "greens": for (let i = 0; i < 4; i++) { const bk = add(goods, cyl(0.26, 0.2, 0.22, C.straw, 9), -0.95 + i * 0.63, 0.11, 0); const col = ["#a3d18a", "#9b59b6", "#e07a3a", "#3f7a3a"][i]; for (let k = 0; k < 5; k++) add(bk, i === 2 ? cone(0.05, 0.22, col, 5) : ball(i < 2 ? 0.14 : 0.08, col, 6), (rnd() - 0.5) * 0.3, 0.2, (rnd() - 0.5) * 0.3).rotation.z = i === 2 ? Math.PI / 2 : 0; } break;   // green cabbage, red cabbage, carrots, kale
      case "avocado": for (let i = 0; i < 2; i++) { const bk = add(goods, box(0.9, 0.2, 0.5, "#a37a4f"), -0.6 + i * 1.2, 0.1, 0); for (let k = 0; k < 8; k++) add(bk, ball(0.09, i ? "#1f3a1a" : "#c0392b", 6), -0.35 + (k % 4) * 0.23, 0.2, -0.12 + Math.floor(k / 4) * 0.24).scale.y = i ? 1.4 : 0.9; } add(goods, ball(0.14, "#8fc26a", 8), 0.05, 0.14, 0.4).scale.set(1, 0.4, 1.3); add(goods, ball(0.07, "#8a5a3c", 6), 0.05, 0.22, 0.4); break;   // avocados and strawberries, a cut half
      case "honey": for (let i = 0; i < 4; i++) { add(goods, cyl(0.09, 0.09, 0.2, "#e0a52c", 8), -0.6 + i * 0.4, 0.1, -0.2); add(goods, cyl(0.1, 0.1, 0.03, NA.yellow, 8), -0.6 + i * 0.4, 0.22, -0.2); } for (let k = 0; k < 6; k++) add(goods, ball(0.08, NA.yellow, 6), -0.5 + k * 0.2, 0.08, 0.3).scale.set(1.2, 1, 1); add(goods, box(0.5, 0.4, 0.4, NA.white), 0.9, 0.2, 0.1); add(goods, box(0.55, 0.06, 0.45, NA.yellow), 0.9, 0.43, 0.1); break;   // honey jars, lemons, a beehive box
      case "juice": add(goods, box(0.8, 0.5, 0.5, NA.chrome), -0.6, 0.25, 0); for (let k = 0; k < 4; k++) { add(goods, cyl(0.06, 0.05, 0.18, ["#f08a2a", "#7fbf3a", "#e8558a", "#f2cf3a"][k], 6), 0.1 + k * 0.28, 0.09, 0.1); add(goods, cyl(0.01, 0.01, 0.22, NA.white, 3), 0.1 + k * 0.28, 0.25, 0.1).rotation.z = 0.2; } break;
    }
    const v = american(pick([NA.denim, "#c0392b", NA.white, "#2f5d3f"]), { apron: true, cap: kind === "juice" ? NA.yellow : undefined }); add(s, v, 0.3, 0, -0.95); vendors.push(v);
    return s;
  };
  const layout: [string, string, number, number, number][] = [["citrus", NA.yellow, -5, -2.4, 0], ["avocado", "#3f8f5a", 0, -2.4, 0], ["greens", "#2f6fb5", 5, -2.4, 0], ["honey", NA.orange, -3, 2.4, Math.PI], ["juice", "#e8558a", 3, 2.4, Math.PI]];
  for (const [k, c, x, z, rot] of layout) { const s = stall(k, c); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  const spots = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(6, 0, 0.3), new THREE.Vector3(-3, 0, -0.3)];
  type Shopper = { p: Fig; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [0, 1, 2].map((i) => { const p = american(pick([NA.denim, NA.yellow, "#e8558a", NA.white]), { cap: i === 1 ? NA.red : undefined }); const st = spots[i].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i + 2) % spots.length].clone(), wait: i * 0.8, speed: 0.7 + rnd() * 0.4 }; });
  const dog = group(); add(dog, box(0.5, 0.25, 0.2, "#c9a86a"), 0, 0.3, 0); add(dog, box(0.2, 0.2, 0.18, "#c9a86a"), 0.32, 0.4, 0); for (const x of [-0.18, 0.18]) for (const z of [-0.07, 0.07]) add(dog, box(0.06, 0.2, 0.06, "#c9a86a"), x, 0.1, z); add(dog, box(0.04, 0.04, 0.25, "#c9a86a"), -0.3, 0.4, 0).rotation.x = 0.5; add(g, dog, 1.5, 0, 0.6); dog.rotation.y = 0.8;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "Fresh from the farm, folks!", 3.0, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    vendors.forEach((v, i) => { if (v.userData.upper) v.userData.upper.rotation.z = k * Math.sin(t * 8 + i) * 0.35; v.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.2; });
    dog.position.y = k * Math.abs(Math.sin(t * 12)) * 0.25;
    for (const sh of shoppers) {
      if (sh.wait > 0) { sh.wait -= dt; continue; }
      const to = sh.target.clone().sub(sh.pos); const d = to.length();
      if (d < 0.15) { sh.wait = 2 + rnd() * 4; sh.target = spots[Math.floor(rnd() * spots.length)].clone(); continue; }
      to.normalize().multiplyScalar(Math.min(d, sh.speed * dt)); sh.pos.add(to); sh.p.position.copy(sh.pos); sh.p.rotation.y = Math.atan2(to.x, to.z); sh.p.userData.walk?.(t);
    }
  };
  return g;
}

/** A backyard on the beach road: a kamado and a gas grill, lime chicken and wings, a cooler, surfboards, folding chairs. */
export function backyard(): P {
  const g = group();
  add(g, box(4.4, 2.2, 2.8, "#f3e9d2"), 0, 1.1, -1.4); for (const sd of [-1, 1]) { const r = add(g, box(4.9, 0.1, 1.7, "#c0704a"), 0, 2.45, -1.4 + sd * 0.75); r.rotation.x = -sd * 0.4; } add(g, box(4.8, 0.06, 0.24, "#a8553a"), 0, 2.85, -1.4);
  add(g, box(4.6, 0.04, 0.04, NA.white), 0, 0.9, 0.2); for (let k = 0; k < 12; k++) add(g, box(0.1, 0.9, 0.04, NA.white), -2.2 + k * 0.4, 0.45, 0.2);   // the picket fence
  add(g, ball(0.5, "#c0392b", 12), -1.2, 0.8, 1.2).scale.y = 1.2; add(g, cyl(0.45, 0.45, 0.05, "#5a5a5a", 12), -1.2, 1.05, 1.2); add(g, cyl(0.3, 0.3, 0.3, "#2a2a2e", 10), -1.2, 0.2, 1.2); const lid = add(g, new THREE.Mesh(new THREE.SphereGeometry(0.52, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat("#c0392b")), -1.2, 1.05, 1.2);
  const wings: THREE.Mesh[] = []; for (let k = 0; k < 6; k++) wings.push(add(g, box(0.16, 0.08, 0.1, "#c9862a"), -1.2 + Math.cos(k * 1.05) * 0.25, 1.1, 1.2 + Math.sin(k * 1.05) * 0.25));
  add(g, box(1.4, 0.8, 0.6, "#5a5a5a"), 0.6, 0.4, 1.2); add(g, box(1.3, 0.06, 0.5, "#2a2a2e"), 0.6, 0.83, 1.2); for (let k = 0; k < 3; k++) add(g, box(0.3, 0.1, 0.22, "#d9a441"), 0.2 + k * 0.4, 0.9, 1.2); for (let k = 0; k < 3; k++) add(g, ball(0.05, "#7fbf3a", 5), 0.2 + k * 0.4, 0.98, 1.05);   // lime chicken on the gas grill
  add(g, box(0.8, 0.5, 0.5, "#2f6fb5"), 2.0, 0.25, 1.4); add(g, box(0.82, 0.08, 0.52, NA.white), 2.0, 0.54, 1.4); for (let k = 0; k < 3; k++) add(g, cyl(0.05, 0.05, 0.16, ["#c0392b", NA.yellow, "#3f8f5a"][k], 6), 1.8 + k * 0.2, 0.66, 1.4);   // the cooler
  for (let k = 0; k < 2; k++) { const sb = add(g, box(0.4, 0.04, 1.8, k ? NA.yellow : "#6fd0e0"), -2.0 + k * 0.5, 0.9, 0.3); sb.rotation.x = -0.25; sb.rotation.z = 0.05 * (k ? -1 : 1); }   // surfboards against the fence
  const cook = american(NA.yellow, { apron: true, cap: "#2f6fb5" }); add(g, cook, -0.3, 0, 2.0); cook.rotation.y = Math.PI; const tongs = add(g, box(0.04, 0.35, 0.04, NA.steel), -0.9, 1.2, 1.5); tongs.rotation.x = 0.6;
  const sitters: Fig[] = [];
  for (let i = 0; i < 2; i++) { const x = 1.4 + i * 1.0; add(g, box(0.4, 0.04, 0.4, ["#c0392b", "#2f6fb5"][i]), x, 0.42, 2.6); add(g, box(0.4, 0.5, 0.04, ["#c0392b", "#2f6fb5"][i]), x, 0.67, 2.42); for (const cx of [-0.17, 0.17]) for (const cz of [-0.17, 0.17]) add(g, box(0.03, 0.42, 0.03, NA.white), x + cx, 0.21, 2.6 + cz); const s = american(pick([NA.white, "#e8558a", "#3f8f5a"]), { cap: i ? NA.yellow : undefined }); s.userData.sit?.(); add(g, s, x, 0.04, 2.6).rotation.y = 0.3; sitters.push(s); }
  g.userData.smoke = new THREE.Vector3(-1.2, 1.4, 1.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Wings are up!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); lid.position.y = 1.05 + k * Math.max(0, Math.sin(t * 4)) * 0.5; wings.forEach((w, i) => { w.position.y = 1.1 + k * Math.max(0, Math.sin(t * 10 + i)) * 0.3; w.rotation.y += k * dt * 5; }); tongs.position.y = 1.2 + k * Math.abs(Math.sin(t * 10)) * 0.3; sitters.forEach((s, i) => { if (s.userData.upper) s.userData.upper.rotation.x = -k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

export function foodTruck(): P {
  const g = group();
  add(g, box(3.2, 1.6, 1.4, "#e8558a"), 0, 1.1, 0); add(g, box(0.9, 1.0, 1.36, NA.white), -1.9, 0.9, 0); add(g, box(0.8, 0.6, 1.3, NA.glass), -1.9, 1.1, 0); add(g, box(3.2, 0.06, 1.5, NA.white), 0, 1.93, 0);
  for (const x of [-1.5, 1.1]) for (const z of [-0.7, 0.7]) add(g, cyl(0.3, 0.3, 0.2, "#2a2a2e", 10), x, 0.3, z).rotation.x = Math.PI / 2;
  add(g, box(2.2, 0.8, 0.06, "#2a2a2e"), 0.3, 1.2, 0.72); add(g, box(2.4, 0.06, 1.0, "#e8558a"), 0.3, 1.9, 1.2).rotation.x = 0.4; add(g, box(2.2, 0.06, 0.4, NA.white), 0.3, 0.85, 0.9);
  for (let k = 0; k < 3; k++) { add(g, cyl(0.12, 0.12, 0.03, "#e9c46a", 8), -0.3 + k * 0.5, 0.9, 0.9); add(g, ball(0.06, ["#c0392b", "#8fc26a", "#e07a3a"][k], 5), -0.3 + k * 0.5, 0.95, 0.9); }
  add(g, box(1.6, 0.4, 0.04, NA.yellow), 0.3, 1.6, 0.76); const cook = american(NA.white, { apron: true, cap: "#2a2a2e" }); cook.scale.setScalar(0.85); add(g, cook, 0.3, 0.5, 0.2);
  for (let i = 0; i < 3; i++) { const p = american(pick([NA.denim, NA.yellow, "#3f8f5a"]), { cap: i === 1 ? NA.red : undefined }); add(g, p, -0.6 + i * 0.9, 0, 1.9); p.rotation.y = 0; }
  g.userData.steam = new THREE.Vector3(0.3, 2.1, 0.3);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(cook, "Order 42, tacos!", 1.6, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); g.position.y = k * Math.abs(Math.sin(t * 12)) * 0.05; if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** Citrus and avocado groves, with a bee box for the honey. */
export function citrusGroveCA(): P {
  const g = group();
  const trees: P[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) trees.push(add(g, j % 2 ? citrusTree("lemon", 0.9 + rnd() * 0.2) : avocadoTree(0.8 + rnd() * 0.2), -3.6 + j * 2.4, 0, -1.2 + i * 2.4));
  for (let k = 0; k < 2; k++) { add(g, box(0.5, 0.4, 0.4, NA.white), 4.2 + k * 0.7, 0.2, -1.2); add(g, box(0.55, 0.06, 0.45, NA.yellow), 4.2 + k * 0.7, 0.43, -1.2); }
  const picker = american(NA.denim, { cap: NA.yellow }); add(g, picker, 4.4, 0, 0.8); const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 4.8, 0.15, 1.5); for (let k = 0; k < 6; k++) add(crate, ball(0.08, k % 2 ? "#f2cf3a" : "#7fbf3a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const bees: THREE.Mesh[] = []; for (let k = 0; k < 6; k++) { const b = ball(0.04, NA.yellow, 4); g.add(b); bees.push(b); }
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(picker, "Lemons, limes and avocados!", 1.5, 1500); for (const tr of trees) { const fr = (tr.userData as { fruits?: THREE.Mesh[] }).fruits ?? []; if (!fr.length) continue; for (let i = 0; i < 2; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.09, (src.material as THREE.MeshStandardMaterial).color.getStyle(), 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; } }
    bees.forEach((b, i) => { const a = t * 2 + i * 1.1; b.position.set(4.5 + Math.cos(a) * (0.6 + (i % 2) * 0.4), 0.9 + Math.sin(a * 1.7) * 0.3, -1.2 + Math.sin(a) * 0.6); });
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.09, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.091) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

export function cableCar(): P {
  const g = group();
  add(g, box(2.4, 1.0, 1.2, "#8a2a2a"), 0, 0.9, 0); add(g, box(2.4, 0.5, 1.22, "#e9c46a"), 0, 1.35, 0); add(g, box(2.5, 0.08, 1.3, "#5a2a1a"), 0, 1.64, 0); for (let k = 0; k < 4; k++) add(g, box(0.4, 0.4, 0.04, NA.glass), -0.9 + k * 0.6, 1.3, 0.62);
  for (const x of [-0.8, 0.8]) add(g, cyl(0.2, 0.2, 0.14, "#2a2a2e", 10), x, 0.2, 0).rotation.x = Math.PI / 2;
  const rider = american(NA.denim, { cap: "#2a2a2e" }); add(g, rider, 1.0, 0.4, 0.6); rider.scale.setScalar(0.8);
  return g;
}

export const NAMERICA_PROPS: Record<string, () => P> = {
  diner, hotDogCart, orchardNE, cornfield, farmyard, farmKitchen, burgerStand, bakeStand, smokehouse, longhornRanch, hogPen, saloon, farmersMarket, backyard, foodTruck, citrusGroveCA, none: () => group(),
};

export const NAMERICA_ICONS: Record<string, () => P> = {
  beefNA: () => cow(false, false),
  porkNA: () => { const g = group(); add(g, box(0.9, 0.5, 0.55, C.pinkPig), 0, 0.4, 0); const h = add(g, box(0.4, 0.4, 0.4, C.pinkPig), 0.6, 0.4, 0); add(h, box(0.12, 0.18, 0.24, "#d98b83"), 0.25, -0.04, 0); for (const z of [-0.14, 0.14]) add(h, box(0.09, 0.16, 0.09, "#d98b83"), 0, 0.26, z); for (const x of [-0.3, 0.3]) for (const z of [-0.16, 0.16]) add(g, box(0.13, 0.25, 0.13, C.pinkPig), x, 0.12, z); return g; },
  chickenNA: () => chicken(C.white),
  cornNA: () => { const g = group(); for (let i = 0; i < 3; i++) { const c = add(g, cyl(0.1, 0.1, 0.6, NA.corn, 8), -0.3 + i * 0.3, 0.12, (i - 1) * 0.15); c.rotation.z = Math.PI / 2; c.rotation.y = i * 0.3; add(g, box(0.5, 0.02, 0.16, "#7fbf3a"), -0.3 + i * 0.3, 0.02, (i - 1) * 0.15 + 0.1).rotation.y = i * 0.3; } return g; },
  dairyNA: () => { const g = group(); add(g, cyl(0.14, 0.12, 0.34, "#c9cfd6", 8), -0.3, 0.17, 0); add(g, cyl(0.08, 0.08, 0.1, "#c9cfd6", 8), -0.3, 0.39, 0); add(g, box(0.3, 0.16, 0.24, NA.yellow), 0.15, 0.08, 0.1); for (let k = 0; k < 3; k++) add(g, ball(0.06, "#f4e6d0", 5), 0.45 + (k % 2) * 0.1, 0.06, -0.2 + k * 0.1).scale.y = 1.3; return g; },
  mapleApple: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.12, "#c0392b", 8), -0.3 + i * 0.3, 0.12, (i - 1) * 0.1); add(g, cyl(0.08, 0.1, 0.3, "#c9862a", 7), 0.45, 0.15, -0.2); add(g, cyl(0.03, 0.03, 0.08, "#8a5a2a", 5), 0.45, 0.34, -0.2); return g; },
  citrusNA: () => { const g = group(); add(g, ball(0.13, "#f2cf3a", 8), -0.3, 0.13, 0).scale.set(1.15, 0.9, 0.9); add(g, ball(0.12, "#7fbf3a", 8), 0, 0.12, 0.15); add(g, ball(0.16, "#1f3a1a", 8), 0.35, 0.16, -0.1).scale.y = 1.4; add(g, cyl(0.06, 0.06, 0.16, "#e0a52c", 8), 0.55, 0.08, 0.25); return g; },
  bananaNut: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, cyl(0.045, 0.045, 0.4, "#e0c84a", 5), -0.3 + i * 0.12, 0.1, 0).rotation.z = 0.4 + i * 0.1; for (let k = 0; k < 5; k++) add(g, ball(0.04, "#8a5a3c", 5), 0.2 + (k % 3) * 0.1, 0.04, -0.15 + Math.floor(k / 3) * 0.12).scale.set(1, 0.7, 1.4); add(g, cyl(0.1, 0.1, 0.04, "#c9862a", 10), 0.45, 0.02, 0.2); return g; },
  smoker: () => { const g = group(); const s = add(g, cyl(0.2, 0.2, 0.7, "#2a2a2e", 12), 0, 0.3, 0); s.rotation.z = Math.PI / 2; add(g, cyl(0.04, 0.04, 0.4, "#2a2a2e", 6), -0.35, 0.65, 0); for (const x of [-0.25, 0.25]) add(g, box(0.05, 0.2, 0.05, "#2a2a2e"), x, 0.08, 0.1); add(g, box(0.3, 0.06, 0.16, "#7a3a2a"), 0.5, 0.08, 0.1); return g; },
  griddle: () => { const g = group(); add(g, cyl(0.28, 0.28, 0.03, NA.white, 12), -0.15, 0.02, 0); for (let k = 0; k < 4; k++) add(g, cyl(0.2, 0.2, 0.05, "#e0b060", 12), -0.15, 0.06 + k * 0.05, 0); add(g, box(0.12, 0.05, 0.12, NA.yellow), -0.15, 0.3, 0); add(g, box(0.32, 0.06, 0.32, "#d9a441"), 0.4, 0.04, 0.1); return g; },
  kamado: () => { const g = group(); add(g, ball(0.32, "#c0392b", 12), 0, 0.36, 0).scale.y = 1.2; add(g, cyl(0.3, 0.3, 0.04, "#5a5a5a", 12), 0, 0.5, 0); add(g, cyl(0.2, 0.2, 0.2, "#2a2a2e", 10), 0, 0.1, 0); for (let k = 0; k < 3; k++) add(g, box(0.12, 0.06, 0.08, "#c9862a"), Math.cos(k * 2.1) * 0.14, 0.55, Math.sin(k * 2.1) * 0.14); return g; },
  instantPot: () => { const g = group(); add(g, cyl(0.26, 0.24, 0.4, NA.chrome, 12), 0, 0.2, 0); add(g, cyl(0.28, 0.28, 0.06, "#2a2a2e", 12), 0, 0.43, 0); add(g, box(0.14, 0.08, 0.04, "#2a2a2e"), 0, 0.28, 0.25); add(g, ball(0.03, "#3fa2b0", 4), 0.06, 0.28, 0.25); add(g, ball(0.07, NA.yellow, 6), 0.42, 0.07, 0.15); return g; },
  burger: () => { const g = group(); add(g, cyl(0.24, 0.24, 0.07, "#e9c46a", 12), 0, 0.03, 0); add(g, cyl(0.24, 0.24, 0.06, "#6b3a2a", 12), 0, 0.1, 0); add(g, box(0.44, 0.03, 0.44, NA.yellow), 0, 0.14, 0); add(g, cyl(0.22, 0.22, 0.04, "#8fc26a", 12), 0, 0.18, 0); add(g, cyl(0.22, 0.22, 0.04, "#c0392b", 12), 0, 0.22, 0); add(g, ball(0.24, "#e9c46a", 10), 0, 0.28, 0).scale.y = 0.6; return g; },
  bakery: () => { const g = group(); for (let k = 0; k < 4; k++) { const c = add(g, cyl(0.12, 0.12, 0.05, "#c9862a", 10), -0.25 + (k % 2) * 0.3, 0.03, -0.15 + Math.floor(k / 2) * 0.3); for (let s = 0; s < 3; s++) add(c, ball(0.025, "#3a2a1a", 4), (s - 1) * 0.06, 0.03, (s % 2 - 0.5) * 0.07); } add(g, cyl(0.1, 0.1, 0.02, "#2f6fb5", 8), 0.45, 0.02, 0.2); return g; },
  slawVeg: () => { const g = group(); const bk = add(g, box(0.6, 0.15, 0.4, "#a37a4f"), -0.15, 0.08, 0); for (let k = 0; k < 6; k++) add(bk, ball(0.07, ["#f2cf3a", "#7fbf3a", "#f08a2a"][k % 3], 6), -0.2 + (k % 3) * 0.2, 0.15, -0.1 + Math.floor(k / 3) * 0.2); add(g, ball(0.14, "#a3d18a", 7), 0.45, 0.14, 0.1); return g; },
  hotDog: () => { const g = group(); add(g, box(0.5, 0.12, 0.18, "#e9c46a"), 0, 0.06, 0); add(g, cyl(0.05, 0.05, 0.54, "#c0392b", 6), 0, 0.14, 0).rotation.z = Math.PI / 2; add(g, box(0.46, 0.02, 0.03, NA.yellow), 0, 0.19, 0.02); return g; },
  liberty: () => { const l = liberty(); l.scale.setScalar(0.09); return l; },
  goldenGate: () => { const b = goldenGate(6); b.scale.setScalar(0.08); return b; },
  ranch: () => cow(false, false),
  cableCar: () => { const c = cableCar(); c.scale.setScalar(0.35); return c; },
  foodTruck: () => { const f = foodTruck(); f.scale.setScalar(0.28); return f; },
};

/** A yellow cab with a roof sign. */
export function taxi(): P {
  const g = group();
  add(g, box(2.2, 0.5, 1.1, NA.yellow), 0, 0.5, 0); add(g, box(1.2, 0.5, 1.0, NA.yellow), -0.1, 0.95, 0); add(g, box(1.1, 0.35, 1.02, NA.glass), -0.1, 1.0, 0); add(g, box(0.5, 0.18, 0.3, NA.white), -0.1, 1.28, 0); add(g, box(0.4, 0.1, 0.02, "#2a2a2e"), -0.1, 1.28, 0.16);
  for (const x of [-0.7, 0.7]) for (const z of [-0.55, 0.55]) add(g, cyl(0.22, 0.22, 0.16, "#2a2a2e", 10), x, 0.22, z).rotation.x = Math.PI / 2;
  add(g, box(0.06, 0.12, 0.3, "#2a2a2e"), 0, 0.6, 0.56); add(g, box(0.06, 0.12, 0.3, "#2a2a2e"), 0, 0.6, -0.56);
  return g;
}

/** The wood pile: split oak, a stump with an axe, and a small smoking fire. */
export function woodpile(): P {
  const g = group();
  for (let k = 0; k < 12; k++) add(g, cyl(0.11, 0.11, 0.9, k % 3 ? "#8a6a3a" : "#a37a4f", 6), -1.2 + (k % 6) * 0.24, 0.12 + Math.floor(k / 6) * 0.22, (k % 2) * 0.1).rotation.z = Math.PI / 2;
  add(g, cyl(0.28, 0.32, 0.5, "#6b4a2c", 8), 0.9, 0.25, 0.6); add(g, box(0.05, 0.7, 0.05, "#5a3d28"), 1.0, 0.75, 0.6).rotation.z = -0.4; add(g, box(0.2, 0.14, 0.04, NA.steel), 1.2, 1.05, 0.6);
  for (let k = 0; k < 6; k++) add(g, cyl(0.16, 0.16, 0.5, "#8f857a", 6), 0.6 + Math.cos(k * 1.05) * 0.45, 0.1, -0.7 + Math.sin(k * 1.05) * 0.45); const fire = add(g, cone(0.22, 0.5, "#f08a2a", 6), 0.6, 0.35, -0.7); add(g, cone(0.12, 0.35, NA.yellow, 5), 0.6, 0.42, -0.7);
  const fig = american(NA.denim, { cowboy: true }); add(g, fig, -0.4, 0, 1.4); fig.rotation.y = Math.PI;
  g.userData.smoke = new THREE.Vector3(0.6, 0.9, -0.7);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(fig, "Post oak, nothing else.", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); fire.scale.setScalar(0.9 + Math.sin(t * 9) * 0.1 + k * 0.6); if (fig.userData.upper) fig.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

NAMERICA_PROPS.woodpile = woodpile;
NAMERICA_PROPS.waterTower = waterTower;
NAMERICA_PROPS.chilliRacks = chilliRacks;
NAMERICA_PROPS.lighthouse = lighthouse;
NAMERICA_PROPS.saloon = saloon;
NAMERICA_PROPS.goldenGate = () => goldenGate(8);
NAMERICA_PROPS.liberty = () => { const g = group(); const l = liberty(); l.scale.setScalar(0.62); g.add(l); return g; };
NAMERICA_PROPS.ferrisWheel = ferrisWheel;
NAMERICA_PROPS.foodTruck = foodTruck;
NAMERICA_PROPS.hotDogCart = hotDogCart;
NAMERICA_PROPS.barn = barn;
NAMERICA_PROPS.hitchingPost = hitchingPost;
