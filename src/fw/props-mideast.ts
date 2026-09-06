/** Middle East props: mosques and minarets, the Bosphorus ferries, the bazaar, kebab and mezze houses, a taboon bakery, oases, Bedouin tents, camels, Petra, Isfahan's dome and bridge. Text is Turkish / Arabic / Persian + English. */
import * as THREE from "three";
import { mat, add, rnd, C, person, bubble, wear, tree, chicken, goat, type P } from "./props";
import { citrusTree, oliveTree } from "./props-italy";
import { freshWater } from "./worldkit";

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

export const ME = { stone: "#d9c9a8", stoneDark: "#b8a88a", cream: "#f3ecdc", dome: "#8fa5a8", lead: "#6f7f86", turquoise: "#3fa2b0", cobalt: "#2f4f9f", gold: "#e0b34c", wood: "#7a4a2a", sand: "#e3cf9a", tent: "#2a2420", rug: "#8e2a22", rug2: "#c9413f", copper: "#b8703a", cedar: "#2f5d3f" };

/** Someone in a keffiyeh, a fez, a hijab or a Persian felt hat. */
export function local(shirt: string, opts: { keffiyeh?: boolean; fez?: boolean; hijab?: string; apron?: boolean; skull?: boolean } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.keffiyeh) { wear(p, box(0.36, 0.22, 0.36, "#f4f1ea"), 0, 1.3, 0); wear(p, new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.025, 6, 12), mat("#1f1f1f")), 0, 1.36, 0).rotation.x = Math.PI / 2; wear(p, box(0.3, 0.3, 0.05, "#f4f1ea"), 0, 1.15, -0.18); }
  if (opts.fez) { wear(p, cyl(0.12, 0.14, 0.18, "#8e2a22", 10), 0, 1.36, 0); wear(p, box(0.02, 0.1, 0.02, "#1f1f1f"), 0, 1.45, -0.1); }
  if (opts.hijab) { wear(p, ball(0.19, opts.hijab, 8), 0, 1.25, -0.02).scale.set(1, 1.1, 1); wear(p, box(0.36, 0.28, 0.2, opts.hijab), 0, 1.0, -0.12); }
  if (opts.skull) wear(p, cyl(0.15, 0.16, 0.08, "#f4f1ea", 10), 0, 1.38, 0);
  return p;
}

// ---------- trees and ground ----------

/** A Lebanon cedar: layered flat crowns. */
export function cedar(s = 1): P {
  const g = group();
  add(g, cyl(0.12 * s, 0.18 * s, 1.6 * s, "#5a3d28", 6), 0, 0.8 * s, 0);
  for (let i = 0; i < 4; i++) add(g, cyl(0.2 * s, (1.3 - i * 0.28) * s, 0.22 * s, i % 2 ? "#2f5d3f" : "#3a6b48", 8), (i % 2 - 0.5) * 0.2 * s, (1.0 + i * 0.45) * s, 0);
  return g;
}
export function datePalm(s = 1): P {
  const g = group();
  add(g, cyl(0.1 * s, 0.16 * s, 3.2 * s, "#8a6a3a", 7), 0, 1.6 * s, 0);
  for (let i = 0; i < 8; i++) add(g, box(0.28 * s, 0.06 * s, 0.24 * s, "#7a5a2a"), Math.cos(i * 1.3) * 0.12 * s, 0.4 * s + i * 0.36 * s, Math.sin(i * 1.3) * 0.12 * s).rotation.y = i;
  const crown = new THREE.Group(); crown.position.y = 3.2 * s; g.add(crown);
  for (let i = 0; i < 9; i++) { const fr = add(crown, box(1.7 * s, 0.03, 0.22 * s, "#4f8a4a"), 0, 0, 0); fr.geometry.translate(0.85 * s, 0, 0); fr.rotation.y = (i / 9) * Math.PI * 2; fr.rotation.z = -0.35 - (i % 2) * 0.3; }
  const dates: THREE.Mesh[] = [];
  for (let k = 0; k < 3; k++) { const d = add(crown, ball(0.14 * s, "#b8601e", 7), Math.cos(k * 2.1) * 0.25 * s, -0.25 * s, Math.sin(k * 2.1) * 0.25 * s); d.scale.y = 1.6; dates.push(d); }
  (g.userData as { crown?: THREE.Group; dates?: THREE.Mesh[] }).crown = crown; (g.userData as { crown?: THREE.Group; dates?: THREE.Mesh[] }).dates = dates;
  g.userData.tick = (t) => { crown.rotation.y = Math.sin(t * 0.5) * 0.06; crown.rotation.z = Math.sin(t * 0.8) * 0.04; };
  return g;
}
export function dune(w = 6, h = 1.2, d = 4): P {
  const g = group();
  const m = add(g, ball(1, "#e9d9a8", 14), 0, -h * 0.15, 0); m.scale.set(w / 2, h, d / 2);
  return g;
}
export function tulips(n = 10): P {
  const g = group();
  for (let i = 0; i < n; i++) { const x = (rnd() - 0.5) * 2.4, z = (rnd() - 0.5) * 1.2; add(g, cyl(0.02, 0.02, 0.35, "#3f7a3a", 4), x, 0.17, z); add(g, cone(0.07, 0.16, i % 2 ? "#c9302a" : "#f2c14e", 6), x, 0.42, z).rotation.x = Math.PI; }
  return g;
}

// ---------- buildings ----------

/** A stone or whitewashed house with a flat roof, arched door and mashrabiya window. */
export function casaMe(color = ME.stone, w = 3.2, d = 2.6, h = 2.4, opts: { domes?: boolean; storeys?: number } = {}): P {
  const g = group();
  const st = opts.storeys ?? 1, H = h * st;
  add(g, box(w, H, d, color), 0, H / 2, 0);
  add(g, box(w + 0.1, 0.2, d + 0.1, ME.stoneDark), 0, H + 0.08, 0);
  if (opts.domes) add(g, dome(w * 0.28, ME.cream, 12), 0, H + 0.18, 0);
  add(g, box(0.8, 1.5, 0.06, ME.wood), -w / 4, 0.75, d / 2 + 0.02); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 12, 1, false, 0, Math.PI), mat(ME.wood)), -w / 4, 1.5, d / 2 + 0.02).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  for (let s = 0; s < st; s++) { const y = s * h; add(g, box(0.9, 1.0, 0.16, "#8a6a3a"), w / 4, y + 1.35, d / 2 + 0.06); for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) add(g, box(0.16, 0.16, 0.04, "#5a3d28"), w / 4 - 0.33 + k * 0.22, y + 1.0 + j * 0.24, d / 2 + 0.16); }
  return g;
}

/** An Ottoman mosque: a great lead dome on half-domes, four pencil minarets, a courtyard. */
export function mosque(): P {
  const g = group();
  add(g, box(12, 0.5, 12, ME.stoneDark), 0, 0.25, 0);
  add(g, box(8, 4.5, 8, ME.stone), 0, 2.75, 0);
  for (const sd of [-1, 1]) { add(g, box(8, 3, 1.6, ME.stone), 0, 2.0, sd * 4.5); add(g, new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(ME.lead)), 0, 3.5, sd * 4.0).scale.set(1, 0.8, 0.6); }
  for (const sd of [-1, 1]) add(g, new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(ME.lead)), sd * 4.0, 3.5, 0).scale.set(0.6, 0.8, 1);
  add(g, cyl(3.4, 3.4, 1.4, ME.stone, 16), 0, 5.7, 0);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(g, box(0.4, 0.9, 0.1, "#3a4a5a"), Math.cos(a) * 3.35, 5.7, Math.sin(a) * 3.35).rotation.y = -a + Math.PI / 2; }
  add(g, dome(3.5, ME.lead, 18), 0, 6.4, 0);
  add(g, cyl(0.06, 0.06, 1.2, ME.gold, 6), 0, 10.4, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 6, 12), mat(ME.gold)), 0, 11.0, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * 5.2, z = sz * 5.2;
    add(g, cyl(0.32, 0.4, 11, ME.stone, 10), x, 5.5, z);
    for (const y of [6.5, 9.0]) add(g, cyl(0.5, 0.42, 0.3, ME.stoneDark, 10), x, y, z);
    add(g, cone(0.42, 1.6, ME.lead, 10), x, 11.8, z);
  }
  // courtyard arcade with small domes
  add(g, box(12, 0.15, 5, ME.stone), 0, 0.55, 8.5);
  for (let i = 0; i < 5; i++) { add(g, cyl(0.14, 0.14, 2.2, ME.stone, 8), -4.8 + i * 2.4, 1.6, 10.6); add(g, dome(0.9, ME.lead, 10), -3.6 + i * 2.4 - 1.2, 2.7, 10.6); }
  add(g, box(12, 0.2, 1.6, ME.stone), 0, 2.7, 10.6);
  add(g, cyl(0.9, 1.0, 0.5, ME.stone, 12), 0, 0.8, 8.0); add(g, cyl(0.7, 0.7, 0.2, "#5fb8c8", 12), 0, 1.1, 8.0); add(g, dome(1.2, ME.lead, 10), 0, 2.4, 8.0); for (let i = 0; i < 6; i++) add(g, cyl(0.06, 0.06, 1.6, ME.stone, 6), Math.cos(i * 1.05) * 1.1, 1.8, 8.0 + Math.sin(i * 1.05) * 1.1);   // ablution fountain
  return g;
}

export function galataTower(): P {
  const g = group();
  add(g, cyl(1.5, 1.7, 7, ME.stoneDark, 14), 0, 3.5, 0);
  add(g, cyl(1.9, 1.5, 1.2, ME.stone, 14), 0, 7.6, 0);
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; add(g, box(0.4, 0.6, 0.08, "#2a2a2e"), Math.cos(a) * 1.85, 7.6, Math.sin(a) * 1.85).rotation.y = -a + Math.PI / 2; }
  add(g, cone(1.9, 2.4, ME.lead, 14), 0, 9.4, 0);
  return g;
}

/** A Bosphorus ferry: white hull, yellow funnel, gulls. */
export function ferry(): P {
  const g = group();
  add(g, box(3.2, 0.5, 1.2, "#f4f1ea"), 0, 0.3, 0); add(g, box(3.2, 0.1, 1.24, "#2f4f9f"), 0, 0.1, 0);
  add(g, box(2.4, 0.5, 1.0, "#f4f1ea"), -0.2, 0.8, 0); add(g, box(2.4, 0.06, 1.05, "#e0b34c"), -0.2, 1.08, 0);
  for (let i = 0; i < 5; i++) add(g, box(0.25, 0.25, 0.04, "#6fb3c9"), -1.1 + i * 0.45, 0.8, 0.52);
  add(g, cyl(0.16, 0.16, 0.7, "#e0b34c", 8), -0.4, 1.4, 0); add(g, cyl(0.17, 0.17, 0.12, "#2a2a2e", 8), -0.4, 1.8, 0);
  add(g, box(0.5, 0.35, 0.02, "#c9302a"), 1.3, 1.3, 0); add(g, cyl(0.015, 0.015, 0.8, "#f4f1ea", 4), 1.3, 1.1, 0);
  for (let i = 0; i < 3; i++) add(g, local(pick(["#3f6fb5", "#c0392b", "#f4f1ea"])), -0.9 + i * 0.7, 0.55, i % 2 ? 0.3 : -0.3).scale.setScalar(0.8);
  g.userData.smoke = new THREE.Vector3(-0.4, 1.9, 0);
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 0.9) * 0.02; };
  return g;
}

/** Petra: the Treasury carved into a rose cliff. */
export function petra(): P {
  const g = group();
  const rock = add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(5, 1), mat("#b86a5a")), -3.5, 3.5, -2.5); rock.scale.set(1.1, 1.2, 0.8);
  const rock2 = add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(4.2, 1), mat("#c47a66")), 4, 3.0, -2.6); rock2.scale.set(1, 1.3, 0.8);
  add(g, box(7, 8.5, 1.2, "#c0705c"), 0, 4.25, -1.8);
  // the façade: six columns, a pediment, the tholos on top
  for (let i = 0; i < 6; i++) add(g, cyl(0.22, 0.24, 3.6, "#d9917c", 8), -2.5 + i, 1.8, -1.05);
  add(g, box(6.4, 0.5, 0.5, "#d9917c"), 0, 3.85, -1.05);
  add(g, new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 3), mat("#d9917c")), 0, 4.7, -1.05).rotation.y = Math.PI / 6;
  for (let i = 0; i < 4; i++) add(g, cyl(0.18, 0.2, 2.2, "#d9917c", 8), -1.5 + i, 6.2, -1.05);
  add(g, cyl(0.9, 0.9, 2.2, "#d9917c", 10), 0, 6.2, -1.05); add(g, cone(1.0, 0.8, "#d9917c", 10), 0, 7.7, -1.05); add(g, ball(0.2, "#d9917c", 6), 0, 8.2, -1.05);
  add(g, box(1.4, 2.2, 0.3, "#3a2420"), 0, 1.1, -1.15);
  add(g, local("#f4f1ea", { keffiyeh: true }), 2.6, 0, 1.2).rotation.y = -2.6;
  const cam = camel(); add(g, cam, -3, 0, 1.6); cam.rotation.y = 1.2; cam.scale.setScalar(0.9);
  return g;
}

/** Isfahan: a turquoise-tiled dome over an iwan, two minarets, a pool. */
export function persianMosque(): P {
  const g = group();
  add(g, box(9, 0.4, 7, ME.stoneDark), 0, 0.2, 0);
  add(g, box(6, 4.2, 5, "#d9c9a8"), 0, 2.3, -0.5);
  add(g, box(4.2, 5.2, 0.6, ME.cobalt), 0, 2.8, 2.2);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.7, 14, 1, false, 0, Math.PI), mat("#f3ecdc")), 0, 3.0, 2.25).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  add(g, box(2.6, 2.6, 0.7, "#1f2a4a"), 0, 1.5, 2.25);
  for (let i = 0; i < 6; i++) add(g, box(0.3, 0.3, 0.05, i % 2 ? ME.turquoise : ME.gold), -1.75 + i * 0.7, 5.1, 2.55);
  add(g, cyl(2.0, 2.0, 1.2, ME.turquoise, 16), 0, 5.0, -0.5);
  add(g, dome(2.4, ME.turquoise, 18), 0, 5.6, -0.5).scale.y = 1.15;
  for (let i = 0; i < 8; i++) add(g, box(0.4, 0.5, 0.06, ME.cobalt), Math.cos(i * 0.785) * 2.0, 5.0, -0.5 + Math.sin(i * 0.785) * 2.0).rotation.y = -i * 0.785 + Math.PI / 2;
  add(g, cyl(0.06, 0.06, 0.8, ME.gold, 6), 0, 8.7, -0.5);
  for (const sd of [-1, 1]) { add(g, cyl(0.28, 0.32, 7.5, "#d9c9a8", 10), sd * 2.7, 3.75, 2.4); for (let k = 0; k < 6; k++) add(g, cyl(0.29, 0.29, 0.3, ME.turquoise, 10), sd * 2.7, 1.0 + k * 1.2, 2.4); add(g, cyl(0.42, 0.34, 0.5, ME.turquoise, 10), sd * 2.7, 7.6, 2.4); add(g, dome(0.4, ME.turquoise, 8), sd * 2.7, 7.85, 2.4); }
  add(g, box(4, 0.3, 2, ME.stoneDark), 0, 0.55, 4.8); add(g, box(3.6, 0.1, 1.6, "#5fb8c8"), 0, 0.75, 4.8);   // the reflecting pool
  add(g, local("#2a2a2e", { skull: true }), -3.2, 0.4, 4.2).rotation.y = 1.2;
  return g;
}

/** Si-o-se-pol: a long bridge of arches. */
export function arcadeBridge(len = 14): P {
  const g = group();
  const n = Math.round(len / 1.4);
  add(g, box(len, 0.4, 2.2, ME.stone), 0, 1.5, 0);
  for (let i = 0; i <= n; i++) add(g, box(0.5, 1.4, 2.4, ME.stoneDark), -len / 2 + (i / n) * len, 0.7, 0);
  for (let i = 0; i < n; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.5, 10, 1, false, 0, Math.PI), mat(ME.stoneDark)), -len / 2 + ((i + 0.5) / n) * len, 1.35, 0).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  for (const z of [-1.05, 1.05]) { add(g, box(len, 0.5, 0.12, ME.stoneDark), 0, 1.95, z); for (let i = 0; i < n; i++) add(g, box(0.9, 0.55, 0.14, ME.stone), -len / 2 + ((i + 0.5) / n) * len, 2.0, z); }
  return g;
}

// ---------- food places ----------

/** The Grand Bazaar: vaulted arcades with skylights, stalls of spices, lamps, sweets, nuts, tea and olives. */
export function bazaar(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(16, 10), mat("#c9bda3")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (const x of [-7.5, -2.5, 2.5, 7.5]) for (const z of [-4.5, 4.5]) add(g, box(0.5, 3.4, 0.5, ME.stoneDark), x, 1.7, z);
  for (let i = 0; i < 4; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 4.3, 12, 1, false, 0, Math.PI), mat("#e3d7bf", { transparent: true, opacity: 0.32 })), -6 + i * 4, 3.4, 0).rotation.set(0, 0, Math.PI / 2), (g.children[g.children.length - 1] as THREE.Mesh).renderOrder = 3;   // see-through vaults
  for (let i = 0; i <= 4; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.12, 6, 14, Math.PI), mat(ME.stoneDark)), -8 + i * 4, 3.4, 0).rotation.y = Math.PI / 2;
  const vendors: Fig[] = [];
  const lamps: THREE.Mesh[] = [];
  const stall = (kind: string) => {
    const s = group();
    add(s, box(2.6, 0.8, 1.2, ME.wood), 0, 0.45, 0); add(s, box(2.6, 0.06, 1.2, "#5a3d28"), 0, 0.88, 0);
    add(s, box(2.6, 0.06, 1.4, pick([ME.rug, ME.cobalt, "#2f5d3f"])), 0, 2.4, 0.1).rotation.x = 0.15;
    const goods = new THREE.Group(); goods.position.y = 0.92; s.add(goods);
    switch (kind) {
      case "spices": for (let i = 0; i < 6; i++) { add(goods, cyl(0.22, 0.24, 0.16, "#8a6a3a", 9), -1.0 + (i % 3) * 0.8, 0.08, -0.25 + Math.floor(i / 3) * 0.5); add(goods, cone(0.2, 0.36, ["#c9302a", "#e0b34c", "#8e2a22", "#6f9b57", "#e07a3a", "#5a3a2a"][i], 9), -1.0 + (i % 3) * 0.8, 0.32, -0.25 + Math.floor(i / 3) * 0.5); } break;
      case "lamps": for (let i = 0; i < 7; i++) { const l = add(s, ball(0.13, ["#c9302a", "#3fa2b0", "#e0b34c", "#9b59b6", "#3f8f5a", "#e8558a", "#2f4f9f"][i], 7), -1.1 + i * 0.37, 1.85 - (i % 2) * 0.25, 0.1); l.scale.y = 1.4; lamps.push(l); add(s, cyl(0.01, 0.01, 0.5, "#8a6a3a", 3), -1.1 + i * 0.37, 2.2 - (i % 2) * 0.12, 0.1); } for (let i = 0; i < 3; i++) add(goods, cyl(0.1, 0.14, 0.2, ME.copper, 8), -0.6 + i * 0.6, 0.1, 0.2); break;
      case "sweets": for (let i = 0; i < 3; i++) { add(goods, box(0.7, 0.08, 0.5, "#c9c2b0"), -0.8 + i * 0.8, 0.04, 0); for (let k = 0; k < 6; k++) add(goods, box(0.14, 0.1, 0.14, i === 0 ? "#d9a441" : i === 1 ? "#6f9b57" : "#e8a0a8"), -0.8 + i * 0.8 - 0.22 + (k % 3) * 0.22, 0.13, -0.12 + Math.floor(k / 3) * 0.24); } break;
      case "nuts": for (let i = 0; i < 5; i++) { const b = add(goods, cyl(0.2, 0.16, 0.24, C.straw, 8), -1.0 + i * 0.5, 0.12, 0); for (let k = 0; k < 5; k++) add(b, ball(0.05, ["#6f9b57", "#b8601e", "#5a3a2a", "#e0b34c", "#8e2a22"][i], 5), (rnd() - 0.5) * 0.25, 0.14, (rnd() - 0.5) * 0.25); } break;
      case "tea": for (let i = 0; i < 6; i++) add(goods, cyl(0.06, 0.04, 0.14, "#8fc4c9", 6), -0.9 + i * 0.36, 0.07, 0.3); add(goods, cyl(0.24, 0.2, 0.5, ME.copper, 10), 0.4, 0.25, -0.2); add(goods, cyl(0.12, 0.12, 0.12, ME.copper, 8), 0.4, 0.56, -0.2); add(goods, box(0.5, 0.2, 0.3, "#2a2a2e"), -0.6, 0.1, -0.2); break;
      case "olives": for (let i = 0; i < 3; i++) { add(goods, cyl(0.28, 0.24, 0.28, "#4a4a50", 10), -0.8 + i * 0.8, 0.14, 0); add(goods, cyl(0.25, 0.25, 0.05, i ? "#2f3a2a" : "#6f9b57", 10), -0.8 + i * 0.8, 0.3, 0); } add(goods, cyl(0.1, 0.08, 0.32, "#c9b45a", 6), 0.9, 0.16, 0.3); break;
    }
    const v = local(pick(["#3f6fb5", "#c0392b", "#f4f1ea", "#2f5d3f"]), { apron: true, fez: kind === "tea", skull: kind === "spices" }); add(s, v, 0.3, 0, -0.95); vendors.push(v);
    return s;
  };
  const layout: [string, number, number, number][] = [["spices", -5.5, -2.6, 0], ["lamps", -0.5, -2.6, 0], ["sweets", 4.5, -2.6, 0], ["nuts", -4, 2.6, Math.PI], ["tea", 1, 2.6, Math.PI], ["olives", 6, 2.6, Math.PI]];
  for (const [k, x, z, rot] of layout) { const s = stall(k); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  const spots = [new THREE.Vector3(-5.5, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(6.5, 0, 0.3), new THREE.Vector3(-3, 0, -0.3)];
  type Shopper = { p: Fig; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [0, 1, 2].map((i) => { const p = local(pick(["#c0392b", "#f2c14e", "#3f6fb5", "#f4f1ea"]), { hijab: i === 2 ? "#9b59b6" : undefined, fez: i === 1 }); const st = spots[i].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i + 2) % spots.length].clone(), wait: i * 0.8, speed: 0.7 + rnd() * 0.4 }; });
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "Buyurun! Welcome!", 3.9, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    vendors.forEach((v, i) => { if (v.userData.upper) v.userData.upper.rotation.z = k * Math.sin(t * 8 + i) * 0.35; v.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.2; });
    lamps.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.4 + i) * 0.08 + k * Math.sin(t * 9 + i) * 0.5; });
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

/** Ocakbaşı: the charcoal mangal with skewers, the usta fanning the coals, diners with ayran and lavash. */
export function kebabHouse(): P {
  const g = group();
  add(g, casaMe(ME.cream, 4.4, 3.0, 2.4, { domes: false }), 0, 0, -1.2);
  add(g, box(2.4, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.4); add(g, box(2.2, 0.3, 0.02, ME.gold), 0, 2.15, 0.44);
  add(g, box(3.2, 0.85, 1.0, "#5a5a5a"), -0.4, 0.42, 1.3); add(g, box(3.0, 0.1, 0.8, "#2a2a2e"), -0.4, 0.9, 1.3);
  for (let i = 0; i < 8; i++) add(g, ball(0.09, i % 2 ? "#f08a2a" : "#3a2a2a", 5), -1.7 + i * 0.38, 0.94, 1.3 + (i % 2) * 0.2);   // coals
  const skewers: THREE.Group[] = [];
  for (let i = 0; i < 5; i++) { const sk = new THREE.Group(); sk.position.set(-1.5 + i * 0.55, 1.05, 1.3); g.add(sk); skewers.push(sk); add(sk, box(0.03, 0.03, 1.0, "#c9cfd6"), 0, 0, 0); for (let k = 0; k < 4; k++) add(sk, box(0.14, 0.13, 0.16, k % 2 ? "#c9573a" : "#f2c14e"), 0, 0, -0.35 + k * 0.23); }
  const fan = add(g, box(0.4, 0.02, 0.3, C.straw), 1.4, 1.2, 1.6); fan.rotation.z = 0.4;
  const usta = local("#f4f1ea", { apron: true, skull: true }); add(g, usta, 1.7, 0, 2.2); usta.rotation.y = 2.8;
  const diners: Fig[] = [];
  for (const x of [-1.4, 1.4]) {
    add(g, box(1.2, 0.06, 0.9, ME.wood), x, 0.78, 3.0); add(g, cyl(0.08, 0.1, 0.72, "#5a3d28", 6), x, 0.36, 3.0);
    add(g, cyl(0.28, 0.28, 0.03, "#f2dca0", 10), x, 0.82, 3.0); add(g, box(0.5, 0.06, 0.2, "#c9573a"), x, 0.87, 3.0); add(g, cyl(0.06, 0.05, 0.18, "#f4f1ea", 8), x + 0.4, 0.9, 2.8);
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.4; add(g, cyl(0.2, 0.2, 0.42, "#5a3d28", 8), x + Math.cos(a) * 0.95, 0.21, 3.0 + Math.sin(a) * 0.95); const d = local(pick(["#3f6fb5", "#c0392b", "#2a2a2e", "#f4f1ea"]), { fez: i === 0 && x < 0 }); d.userData.sit?.(); add(g, d, x + Math.cos(a) * 0.95, 0.04, 3.0 + Math.sin(a) * 0.95).rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); diners.push(d); }
  }
  g.userData.smoke = new THREE.Vector3(-0.4, 1.3, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(usta, "Afiyet olsun! Enjoy!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    skewers.forEach((s, i) => { s.rotation.z += k * dt * 9; s.position.y = 1.05 + k * Math.max(0, Math.sin(t * 10 + i)) * 0.35; });
    fan.rotation.x = Math.sin(t * (2 + k * 14)) * 0.5; if (usta.userData.upper) usta.userData.upper.rotation.z = k * Math.sin(t * 12) * 0.2;
    diners.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.y = Math.sin(t * 0.5 + i) * 0.15; } });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** Çay bahçesi: a samovar, tulip glasses, backgammon under a plane tree, a nargile, and a dervish who spins when you click. */
export function teaGarden(): P {
  const g = group();
  add(g, tree("round", 1.5), -2.4, 0, -1.2);
  const tables: THREE.Group[] = [];
  const sitters: Fig[] = [];
  for (const [x, z] of [[-1.2, 1.2], [1.4, 0.4], [0.2, 2.6]]) {
    add(g, cyl(0.5, 0.5, 0.05, ME.copper, 12), x, 0.6, z); add(g, cyl(0.05, 0.06, 0.6, "#2a2a2e", 6), x, 0.3, z);
    for (let i = 0; i < 2; i++) { add(g, cyl(0.06, 0.04, 0.14, "#8fc4c9", 6), x - 0.2 + i * 0.4, 0.7, z); add(g, cyl(0.07, 0.07, 0.02, "#f4f1ea", 8), x - 0.2 + i * 0.4, 0.62, z); }
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.5; add(g, cyl(0.2, 0.2, 0.4, "#c9413f", 8), x + Math.cos(a) * 0.85, 0.2, z + Math.sin(a) * 0.85); const p = local(pick(["#2a2a2e", "#f4f1ea", "#3f6fb5", "#7a4a3a"]), { fez: i === 0 }); p.userData.sit?.(); add(g, p, x + Math.cos(a) * 0.85, 0.04, z + Math.sin(a) * 0.85).rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); sitters.push(p); }
    const tb = new THREE.Group(); tb.position.set(x, 0.63, z); g.add(tb); tables.push(tb);
  }
  add(g, box(0.5, 0.04, 0.35, "#5a3d28"), 1.4, 0.65, 0.4); for (let i = 0; i < 8; i++) add(g, cyl(0.03, 0.03, 0.02, i % 2 ? "#f4f1ea" : "#2a2a2e", 6), 1.2 + (i % 4) * 0.12, 0.68, 0.3 + Math.floor(i / 4) * 0.18);   // backgammon
  add(g, cyl(0.3, 0.26, 0.6, ME.copper, 10), 3.0, 0.3 + 0.55, -0.8); add(g, cyl(0.12, 0.12, 0.2, ME.copper, 8), 3.0, 1.25, -0.8); add(g, cyl(0.16, 0.14, 0.14, "#8fc4c9", 8), 3.0, 1.42, -0.8); add(g, box(0.9, 0.55, 0.6, ME.wood), 3.0, 0.27, -0.8);   // the samovar
  add(g, cyl(0.12, 0.16, 0.5, "#8fc4c9", 8), -1.2, 0.25, 3.2); add(g, cyl(0.04, 0.04, 0.7, ME.copper, 6), -1.2, 0.85, 3.2); add(g, ball(0.08, "#2a2a2e", 6), -1.2, 1.2, 3.2); add(g, cyl(0.02, 0.02, 0.9, "#8e2a22", 4), -0.9, 0.7, 3.4).rotation.z = 0.6;   // nargile
  const dervish = local("#f4f1ea"); wear(dervish, cyl(0.12, 0.14, 0.34, "#8a6a3a", 8), 0, 1.42, 0); const skirt = add(dervish, cone(0.55, 0.9, "#f4f1ea", 14), 0, 0.5, 0); skirt.rotation.x = Math.PI; add(g, dervish, 3.4, 0, 2.6);
  const waiter = local("#2a2a2e", { apron: true, fez: true }); add(g, waiter, 1.8, 0, -1.6); waiter.rotation.y = 2.4;
  add(g, box(0.3, 0.02, 0.2, ME.copper), 2.05, 1.05, -1.4); add(g, cyl(0.05, 0.04, 0.12, "#8fc4c9", 6), 2.05, 1.12, -1.4);
  g.userData.steam = new THREE.Vector3(3.0, 1.6, -0.8);
  const re = reaction(0.4);
  g.userData.poke = () => { re.poke(); bubble(waiter, "Çay! Tea!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    dervish.rotation.y += dt * (0.3 + k * 9); skirt.scale.setScalar(1 + k * 0.6); if (dervish.userData.upper) dervish.userData.upper.rotation.z = 0.05;
    sitters.forEach((p, i) => { if (p.userData.upper) { p.userData.upper.rotation.z = Math.sin(t * 0.9 + i) * 0.08; p.userData.upper.rotation.x = k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); } p.position.y = 0.04 + k * Math.abs(Math.sin(t * 8 + i)) * 0.15; });
    if (waiter.userData.upper) waiter.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** Simit seller with a tray on his head and a cart. */
export function simitCart(): P {
  const g = group();
  add(g, box(1.4, 0.9, 0.8, "#c9302a"), 0, 0.6, 0); add(g, box(1.4, 0.05, 0.84, "#f4f1ea"), 0, 1.05, 0); for (const x of [-0.45, 0.45]) add(g, cyl(0.2, 0.2, 0.08, "#2a2a2e", 10), x, 0.2, 0.45).rotation.x = Math.PI / 2;
  add(g, box(1.6, 0.2, 1.0, "#6fb3c9"), 0, 1.4, 0);
  for (let i = 0; i < 9; i++) { const r = add(g, new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 6, 12), mat("#c9862a")), -0.5 + (i % 3) * 0.5, 1.1 + Math.floor(i / 3) * 0.08, -0.25 + (i % 2) * 0.3); r.rotation.x = Math.PI / 2; }
  const seller = local("#3f6fb5", { apron: true }); add(g, seller, 0, 0, -0.9);
  const tray = add(seller, cyl(0.4, 0.4, 0.04, "#8a6a3a", 12), 0, 1.5, 0); for (let i = 0; i < 6; i++) add(tray, new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 6, 12), mat("#c9862a")), Math.cos(i * 1.05) * 0.22, 0.05, Math.sin(i * 1.05) * 0.22).rotation.x = Math.PI / 2;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(seller, "Simit! Sıcak simit!", 1.8, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); tray.rotation.y = t * (0.3 + k * 6); seller.position.y = k * Math.abs(Math.sin(t * 10)) * 0.2; };
  return g;
}

/** The mezze house: a long table of small plates, hummus, tabbouleh, olives, pita, an oud player. */
export function mezzeHouse(): P {
  const g = group();
  add(g, casaMe(ME.stone, 4.6, 3.0, 2.4, { domes: true }), 0, 0, -1.4);
  add(g, box(2.6, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(2.4, 0.3, 0.02, ME.turquoise), 0, 2.15, 0.24);
  add(g, box(4.0, 0.08, 1.2, "#f4f1ea"), 0, 0.78, 1.2); for (const x of [-1.6, 1.6]) add(g, box(0.12, 0.72, 0.9, ME.wood), x, 0.36, 1.2);
  const plates: THREE.Group[] = [];
  const cols = ["#e9d7a8", "#4f8a4a", "#2f3a2a", "#c9413f", "#f4f1ea", "#e07a3a", "#d9a441", "#8e2a22"];
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Group(); p.position.set(-1.7 + (i % 4) * 1.1, 0.82, 0.9 + Math.floor(i / 4) * 0.6); g.add(p); plates.push(p);
    add(p, cyl(0.24, 0.2, 0.05, "#f4f1ea", 12), 0, 0, 0); add(p, ball(0.16, cols[i], 8), 0, 0.06, 0).scale.y = 0.45;
    if (i === 0) { add(p, cyl(0.06, 0.06, 0.02, "#c9862a", 8), 0, 0.14, 0); add(p, ball(0.03, "#c9302a", 4), 0.08, 0.14, 0.05); }   // hummus with paprika and oil
    if (i === 4) for (let k = 0; k < 4; k++) add(p, cyl(0.12, 0.12, 0.02, "#f2dca0", 10), 0, 0.14 + k * 0.025, 0);   // pita stack
  }
  const diners: Fig[] = [];
  for (let i = 0; i < 4; i++) { const x = -1.5 + i * 1.0; add(g, cyl(0.2, 0.2, 0.42, "#5a3d28", 8), x, 0.21, 2.2); const d = local(pick(["#3f6fb5", "#c0392b", "#f4f1ea", "#2f5d3f"]), { hijab: i === 1 ? "#9b59b6" : undefined, keffiyeh: i === 3 }); d.userData.sit?.(); add(g, d, x, 0.04, 2.2).rotation.y = Math.PI; diners.push(d); }
  const oud = local("#8e2a22", { fez: false }); oud.userData.sit?.(); add(g, cyl(0.2, 0.2, 0.42, "#5a3d28", 8), 3.0, 0.21, 1.4); add(g, oud, 3.0, 0.04, 1.4).rotation.y = -1.0; add(oud, ball(0.22, "#a37a4f", 8), 0.05, 0.75, 0.3).scale.set(0.8, 1, 0.5); add(oud, box(0.05, 0.05, 0.5, "#4a3222"), 0.1, 0.95, 0.55);
  const server = local("#f4f1ea", { apron: true }); add(g, server, -2.9, 0, 1.6); server.rotation.y = 1.4;
  const notes: THREE.Mesh[] = []; for (let i = 0; i < 4; i++) { const n = ball(0.06, "#2a2a2e", 6); n.visible = false; g.add(n); notes.push(n); }
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(server, "صحتين! Sahtein!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    plates.forEach((p, i) => { p.position.y = 0.82 + k * Math.max(0, Math.sin(t * 10 + i * 1.1)) * 0.3; p.rotation.y += k * dt * 4; });
    diners.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = 0.15 + k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.z = Math.sin(t * 0.8 + i) * 0.06 + k * Math.sin(t * 7 + i) * 0.15; } });
    if (oud.userData.upper) oud.userData.upper.rotation.z = Math.sin(t * 2.2) * 0.06 + k * Math.sin(t * 9) * 0.12;
    notes.forEach((n, i) => { const a = (t * 1.5 + i * 1.5) % 6; n.visible = k > 0.05; n.position.set(3.0 + Math.sin(a) * 0.6, 1.5 + a * 0.35, 1.4 + Math.cos(a) * 0.4); n.scale.setScalar(Math.max(0.01, 1 - a / 6) * k * 2); });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** The taboon bakery: a domed clay oven, the baker slapping pita to its wall, loaves puffing, shakshuka pans at the counter. */
export function bakery(): P {
  const g = group();
  add(g, casaMe(ME.cream, 4.2, 2.8, 2.2), 0, 0, -1.2);
  add(g, box(2.0, 0.5, 0.06, "#1f2430"), 0, 2.0, 0.3); add(g, box(1.8, 0.3, 0.02, ME.gold), 0, 2.0, 0.34);
  add(g, dome(0.9, "#a45a3a", 12), -1.2, 0.5, 1.3); add(g, cyl(0.9, 0.9, 0.5, "#a45a3a", 12), -1.2, 0.25, 1.3);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 10, 1, false, 0, Math.PI), mat("#2a1a14")), -1.2, 0.65, 2.1).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  add(g, ball(0.2, "#f08a2a", 6), -1.2, 0.62, 1.9);
  const pitas: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) pitas.push(add(g, cyl(0.16, 0.16, 0.03, "#f2dca0", 10), -1.2 + Math.cos(i * 1.6) * 0.5, 1.45, 1.3 + Math.sin(i * 1.6) * 0.5));
  const baker = local("#f4f1ea", { apron: true, skull: true }); add(g, baker, -2.4, 0, 2.2); baker.rotation.y = 0.8;
  const paddle = add(g, box(0.06, 0.02, 1.2, ME.wood), -2.0, 1.0, 1.8); paddle.rotation.y = 0.6;
  add(g, box(2.4, 0.8, 0.9, ME.wood), 1.2, 0.4, 1.6);
  for (let i = 0; i < 8; i++) add(g, cyl(0.2, 0.2, 0.025, "#f2dca0", 10), 0.4 + (i % 4) * 0.45, 0.82 + Math.floor(i / 4) * 0.03, 1.4 + Math.floor(i / 4) * 0.35);
  for (let i = 0; i < 2; i++) { add(g, cyl(0.26, 0.22, 0.1, "#2a2a2e", 12), 1.0 + i * 0.7, 0.86, 1.95); add(g, cyl(0.23, 0.23, 0.04, "#c9302a", 12), 1.0 + i * 0.7, 0.92, 1.95); for (let k = 0; k < 3; k++) { add(g, ball(0.06, "#f4f1ea", 6), 1.0 + i * 0.7 + Math.cos(k * 2.1) * 0.12, 0.96, 1.95 + Math.sin(k * 2.1) * 0.12).scale.y = 0.5; add(g, ball(0.035, "#f2c14e", 5), 1.0 + i * 0.7 + Math.cos(k * 2.1) * 0.12, 0.98, 1.95 + Math.sin(k * 2.1) * 0.12); } }   // shakshuka pans
  add(g, cyl(0.15, 0.12, 0.2, "#e9d7a8", 8), 2.2, 0.9, 1.4); add(g, ball(0.08, "#3f7a3a", 5), 2.2, 1.02, 1.4).scale.y = 0.5;   // za'atar and oil
  const customer = local("#3f6fb5", { hijab: "#e8558a" }); add(g, customer, 1.4, 0, 2.7); customer.rotation.y = Math.PI;
  g.userData.smoke = new THREE.Vector3(-1.2, 1.5, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(baker, "خبز! Fresh bread!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pitas.forEach((p, i) => { p.position.y = 1.45 + Math.sin(t * 2 + i) * 0.03 + k * Math.max(0, Math.sin(t * 9 + i)) * 0.4; p.scale.y = 1 + k * Math.max(0, Math.sin(t * 9 + i)) * 4; p.rotation.y += k * dt * 5; }); paddle.rotation.y = 0.6 + Math.sin(t * (1.2 + k * 8)) * 0.4; if (baker.userData.upper) baker.userData.upper.rotation.x = 0.15 + Math.sin(t * (1.2 + k * 8)) * 0.1; };
  return g;
}

/** The shawarma stand: a vertical spit, the falafel fryer, garlic sauce, pickles. */
export function shawarmaStand(): P {
  const g = group();
  add(g, box(3.0, 0.85, 1.0, "#8c9096"), -0.3, 0.42, 0.3);
  for (const x of [-1.6, 1.4]) add(g, cyl(0.04, 0.04, 2.4, "#8c9096", 5), x, 1.2, -0.3);
  add(g, box(3.4, 0.06, 1.8, ME.rug), -0.1, 2.4, 0.1).rotation.x = 0.12;
  const spit = new THREE.Group(); spit.position.set(1.0, 0.9, 0.3); g.add(spit);
  add(g, cyl(0.03, 0.03, 2.0, "#8c9096", 5), 1.0, 1.9, 0.3);
  for (let i = 0; i < 11; i++) add(spit, cyl(0.15 + Math.sin(i * 0.6) * 0.05 + i * 0.01, 0.15 + Math.sin(i * 0.6 + 0.5) * 0.05 + i * 0.01, 0.1, i % 2 ? "#a6603a" : "#c47a4a", 10), 0, 0.05 + i * 0.1, 0);
  add(spit, ball(0.12, "#e9d7a8", 7), 0, 1.25, 0);
  add(g, box(0.08, 1.2, 0.5, "#2a2a2e"), 1.45, 1.45, 0.3); const flame = add(g, box(0.04, 0.95, 0.4, "#f08a2a"), 1.4, 1.45, 0.3);
  add(g, box(0.6, 0.3, 0.5, "#5a5a5a"), -1.3, 1.0, 0.3); add(g, cyl(0.24, 0.2, 0.05, "#e0b34c", 10), -1.3, 1.17, 0.3);
  const falafels: THREE.Mesh[] = []; for (let i = 0; i < 6; i++) falafels.push(add(g, ball(0.06, "#8a6a3a", 6), -1.3 + Math.cos(i * 1.05) * 0.14, 1.2, 0.3 + Math.sin(i * 1.05) * 0.14));
  add(g, cyl(0.1, 0.08, 0.18, "#f4f1ea", 8), -0.4, 0.94, 0.5); add(g, cyl(0.1, 0.08, 0.18, "#e8558a", 8), -0.1, 0.94, 0.55); add(g, cyl(0.1, 0.08, 0.18, "#6f9b57", 8), 0.2, 0.94, 0.5);   // toum, pickled turnip, pickles
  for (let i = 0; i < 4; i++) add(g, cyl(0.15, 0.15, 0.02, "#f2dca0", 10), -0.9 + i * 0.3, 0.87 + (i % 2) * 0.02, 0.1);
  const cook = local("#f4f1ea", { apron: true, keffiyeh: true }); add(g, cook, 0.4, 0, -0.5); cook.rotation.y = 0.2;
  const knife = add(g, box(0.03, 0.4, 0.06, "#c9cfd6"), 0.6, 1.3, 0.0); knife.rotation.z = 0.7;
  for (const x of [-1.2, 2.2]) { add(g, cyl(0.18, 0.18, 0.4, "#5a3d28", 8), x, 0.2, 1.4); const e = local(pick(["#3f6fb5", "#c0392b", "#2a2a2e"])); e.userData.sit?.(); add(g, e, x, 0.04, 1.4).rotation.y = Math.PI; }
  g.userData.steam = new THREE.Vector3(-1.3, 1.5, 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "شاورما! Shawarma!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); spit.rotation.y += dt * (0.6 + k * 7); flame.scale.y = 0.9 + Math.sin(t * 17) * 0.1; knife.position.y = 1.3 + k * Math.abs(Math.sin(t * 12)) * 0.35; falafels.forEach((f, i) => { f.position.y = 1.2 + k * Math.max(0, Math.sin(t * 11 + i)) * 0.35; }); if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + k * Math.sin(t * 12) * 0.15; };
  return g;
}

/** Rows of parsley and mint with a girl chopping for tabbouleh, and bulgur drying on a cloth. */
export function herbGarden(): P {
  const g = group();
  add(g, box(5.4, 0.2, 3.4, "#6b4a32"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) {
    const pl = new THREE.Group(); pl.position.set(-2.4 + j * 0.8, 0.2, -1.2 + i * 0.8); g.add(pl); plants.push(pl);
    const col = i < 2 ? "#3f7a3a" : "#6fb06a";
    for (let k = 0; k < 5; k++) { add(pl, cyl(0.015, 0.015, 0.3, "#5f9a4a", 3), (k - 2) * 0.05, 0.15, (k % 2) * 0.05); add(pl, ball(0.06, col, 5), (k - 2) * 0.05, 0.32, (k % 2) * 0.05).scale.y = 0.6; }
  }
  add(g, box(1.2, 0.04, 0.8, "#f4f1ea"), 3.4, 0.03, -0.6); for (let i = 0; i < 24; i++) add(g, ball(0.03, "#c9a86a", 4), 3.0 + (i % 6) * 0.16, 0.07, -0.9 + Math.floor(i / 6) * 0.2);   // bulgur drying
  add(g, box(1.0, 0.7, 0.7, ME.wood), 3.4, 0.35, 0.8); add(g, box(0.5, 0.04, 0.35, "#a37a4f"), 3.4, 0.72, 0.8);
  const cook = local("#e8558a", { hijab: "#3f6fb5", apron: true }); add(g, cook, 3.4, 0, 1.6); cook.rotation.y = Math.PI;
  const knife = add(g, box(0.03, 0.02, 0.28, "#c9cfd6"), 3.5, 0.78, 0.8);
  add(g, ball(0.1, "#3f7a3a", 6), 3.25, 0.8, 0.8).scale.y = 0.5; add(g, ball(0.06, "#c9302a", 5), 3.7, 0.78, 0.7); add(g, ball(0.05, "#f2c14e", 5), 3.7, 0.78, 0.95);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "بقدونس ونعناع! Parsley & mint!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.4) * 1.2)) * 0.6; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); knife.position.y = 0.78 + k * Math.abs(Math.sin(t * 14)) * 0.12; if (cook.userData.upper) cook.userData.upper.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 14)) * 0.08; };
  return g;
}

/** A chickpea field being harvested, sesame sheaves, and the tahini press. */
export function chickpeaField(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#a08a5a"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) {
    const pl = new THREE.Group(); pl.position.set(-2.6 + j * 0.75, 0.2, -1.4 + i * 0.95); g.add(pl); plants.push(pl);
    add(pl, ball(0.2, "#8fb06a", 6), 0, 0.22, 0).scale.set(0.9, 1.2, 0.9);
    for (let k = 0; k < 3; k++) add(pl, ball(0.04, "#c9c26a", 4), Math.cos(k * 2.1) * 0.16, 0.18 + k * 0.1, Math.sin(k * 2.1) * 0.16);
  }
  for (let i = 0; i < 4; i++) { add(g, cyl(0.04, 0.12, 0.7, "#c9b45a", 6), 3.5 + (i % 2) * 0.4, 0.35, -1.2 + Math.floor(i / 2) * 0.5); }   // sesame sheaves
  add(g, cyl(0.4, 0.4, 0.3, "#8f857a", 12), 3.7, 0.15, 0.8); add(g, cyl(0.3, 0.3, 0.2, "#7a7268", 12), 3.7, 0.4, 0.8); add(g, cyl(0.03, 0.03, 0.8, ME.wood, 4), 3.7, 0.6, 0.8).rotation.z = Math.PI / 2;   // the tahini millstone
  add(g, cyl(0.12, 0.1, 0.2, "#e9d7a8", 8), 4.3, 0.1, 1.3);
  const farmer = local("#f4f1ea", { keffiyeh: true }); add(g, farmer, -3.3, 0, 1.0); farmer.rotation.y = 1.0;
  add(g, cyl(0.28, 0.22, 0.3, C.straw, 8), -3.6, 0.15, 1.8); for (let k = 0; k < 8; k++) add(g, ball(0.04, "#e9d7a8", 4), -3.6 + (rnd() - 0.5) * 0.3, 0.32, 1.8 + (rnd() - 0.5) * 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "حمص! Chickpeas!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.6) * 1.2)) * 0.5; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); if (farmer.userData.upper) farmer.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

/** Olives and lemons on terraces, a stone press. */
export function oliveLemonGrove(): P {
  const g = group();
  const trees: P[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) trees.push(add(g, j % 2 ? oliveTree(0.9 + rnd() * 0.2) : citrusTree("lemon", 0.85 + rnd() * 0.2), -3.6 + j * 2.4, 0, -1.2 + i * 2.4));
  add(g, box(9.5, 0.3, 0.3, ME.stoneDark), 0, 0.15, 3.0);
  add(g, cyl(0.6, 0.6, 0.3, "#8f857a", 12), 4.4, 0.15, 0.4); add(g, cyl(0.5, 0.5, 0.35, "#7a7268", 12), 4.4, 0.45, 0.4).rotation.z = Math.PI / 2; add(g, cyl(0.03, 0.03, 1.2, ME.wood, 4), 4.4, 0.8, 0.4);
  add(g, local("#2f5d3f", { keffiyeh: true }), 4.2, 0, 1.6).rotation.y = -1.5;
  const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 4.8, 0.15, 2.2); for (let k = 0; k < 6; k++) add(crate, ball(0.08, k % 2 ? "#f2cf3a" : "#2f3a2a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "زيتون وليمون! Olives & lemons!", 2.6, 1400); for (const tr of trees) { const u = tr.userData as { fruits?: THREE.Mesh[]; olives?: THREE.Mesh[] }; const fr = u.fruits ?? u.olives ?? []; for (let i = 0; i < 2; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(u.fruits ? 0.09 : 0.06, u.fruits ? "#f2cf3a" : "#2f3a2a", 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) { c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; c.rotation.x = Math.cos(t * 21 + tr.position.z) * 0.05 * shake; } } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.08, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.081) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

/** A flock of sheep and goats with a shepherd, and yogurt straining in cloth bags for labneh. */
export function flock(): P {
  const g = group();
  const sheep: P[] = [];
  for (let i = 0; i < 5; i++) {
    const s = group();
    add(s, ball(0.38, "#f1ece2", 8), 0, 0.5, 0).scale.set(1.3, 0.9, 1); const head = add(s, ball(0.16, "#2a2a2e", 7), 0.5, 0.55, 0); add(head, ball(0.05, "#f1ece2", 4), 0.05, 0.12, 0.1); add(head, ball(0.05, "#f1ece2", 4), 0.05, 0.12, -0.1);
    for (const x of [-0.25, 0.25]) for (const z of [-0.14, 0.14]) add(s, box(0.08, 0.3, 0.08, "#2a2a2e"), x, 0.15, z);
    s.position.set(-2.2 + (i % 3) * 1.4, 0, -0.8 + Math.floor(i / 3) * 1.4 + (i % 2) * 0.4); s.rotation.y = i * 1.1; g.add(s); sheep.push(s); (s.userData as { head?: THREE.Mesh }).head = head;
  }
  const gt = goat(); add(g, gt, 2.2, 0, 0.6); gt.rotation.y = 2.2;
  const shepherd = local("#7a4a3a", { keffiyeh: true }); add(g, shepherd, 3.2, 0, -1.0); add(g, cyl(0.02, 0.02, 1.6, ME.wood, 4), 3.45, 0.8, -1.0);
  const dog = group(); add(dog, box(0.5, 0.25, 0.2, "#c9a86a"), 0, 0.3, 0); add(dog, box(0.2, 0.2, 0.18, "#c9a86a"), 0.32, 0.4, 0); for (const x of [-0.18, 0.18]) for (const z of [-0.07, 0.07]) add(dog, box(0.06, 0.2, 0.06, "#c9a86a"), x, 0.1, z); add(g, dog, 3.6, 0, 0.2); dog.rotation.y = -0.6;
  for (let i = 0; i < 3; i++) { add(g, cyl(0.02, 0.02, 1.2, ME.wood, 4), -3.6 + i * 0.7, 0.6, 2.0); const bag = add(g, ball(0.16, "#f4f1ea", 7), -3.6 + i * 0.7, 0.75, 2.0); bag.scale.y = 1.4; add(g, cyl(0.12, 0.1, 0.1, "#a45a3a", 8), -3.6 + i * 0.7, 0.05, 2.0); }   // labneh bags dripping into bowls
  add(g, cyl(0.02, 0.02, 2.2, ME.wood, 3), -2.9, 1.2, 2.0).rotation.z = Math.PI / 2;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(sheep[1], "مااا! Baa!", 1.0, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); sheep.forEach((s, i) => { s.position.y = k * Math.abs(Math.sin(t * 11 + i)) * 0.3; s.rotation.z = k * Math.sin(t * 14 + i) * 0.12; const h = (s.userData as { head?: THREE.Mesh }).head; if (h) h.position.y = 0.55 - Math.abs(Math.sin(t * 1.5 + i)) * 0.12; }); gt.position.y = k * Math.abs(Math.sin(t * 12)) * 0.35; };
  return g;
}

export function camel(): P {
  const g = group();
  add(g, box(1.6, 0.7, 0.6, "#c9a86a"), 0, 1.25, 0); add(g, ball(0.42, "#c9a86a", 8), 0, 1.7, 0).scale.set(1, 0.9, 0.8);
  const neck = add(g, box(0.28, 1.0, 0.3, "#c9a86a"), 0.85, 1.75, 0); neck.rotation.z = -0.35;
  add(g, box(0.5, 0.28, 0.26, "#c9a86a"), 1.1, 2.3, 0); add(g, box(0.16, 0.1, 0.1, "#8a6a3a"), 1.38, 2.25, 0);
  for (const z of [-0.08, 0.08]) add(g, cone(0.04, 0.12, "#c9a86a", 4), 1.05, 2.48, z);
  for (const x of [-0.55, 0.55]) for (const z of [-0.18, 0.18]) add(g, box(0.14, 0.95, 0.14, "#c9a86a"), x, 0.48, z);
  add(g, box(0.06, 0.5, 0.06, "#8a6a3a"), -0.8, 1.1, 0).rotation.z = 0.3;
  add(g, box(0.7, 0.12, 0.7, ME.rug), 0, 1.98, 0); add(g, box(0.5, 0.1, 0.5, ME.rug2), 0, 2.06, 0);
  return g;
}

/** A caravan of camels with riders. */
export function caravan(): P {
  const g = group();
  const camels: P[] = [];
  for (let i = 0; i < 3; i++) { const c = camel(); c.position.set(-2.4 + i * 2.4, 0, (i % 2) * 0.6); g.add(c); camels.push(c); if (i !== 1) { const r = local("#f4f1ea", { keffiyeh: true }); r.userData.sit?.(); add(c, r, 0.1, 2.05, 0); r.scale.setScalar(0.85); } else { add(c, box(0.5, 0.5, 0.7, "#8a6a3a"), 0, 2.3, 0); add(c, box(0.6, 0.4, 0.5, "#a37a4f"), -0.3, 2.35, 0.1); } }
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(camels[0], "يلا! Yalla!", 3.0, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); camels.forEach((c, i) => { c.position.y = Math.abs(Math.sin(t * 1.4 + i)) * 0.03 + k * Math.abs(Math.sin(t * 8 + i)) * 0.3; c.rotation.z = Math.sin(t * 1.4 + i) * 0.015; }); };
  return g;
}

/** The oasis: date palms round a pool, a camel drinking, baskets of dates. */
export function oasis(): P {
  const g = group();
  const waterMat = freshWater();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(2.6, 20), mat("#8fbf7a")), 0, 0.03, 0).rotation.x = -Math.PI / 2;
  const w = new THREE.Mesh(new THREE.CircleGeometry(1.7, 20), waterMat); w.rotation.x = -Math.PI / 2; w.position.y = 0.06; w.renderOrder = 2; g.add(w);
  const palms: P[] = [];
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; const p = datePalm(0.8 + (i % 2) * 0.25); p.position.set(Math.cos(a) * 3.0, 0, Math.sin(a) * 2.6); p.rotation.y = a; g.add(p); palms.push(p); }
  const cam = camel(); add(g, cam, 2.3, 0, 1.2); cam.rotation.y = 2.4; cam.scale.setScalar(0.85);
  add(g, local("#f4f1ea", { keffiyeh: true }), -2.8, 0, 2.4).rotation.y = 0.6;
  for (let i = 0; i < 2; i++) { const b = add(g, cyl(0.28, 0.22, 0.24, C.straw, 8), -3.4 + i * 0.6, 0.12, 3.0); for (let k = 0; k < 7; k++) add(b, ball(0.06, "#8a4a1e", 5), (rnd() - 0.5) * 0.3, 0.16, (rnd() - 0.5) * 0.3).scale.y = 1.5; }
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "تمر! Dates!", 3.4, 1300); for (const p of palms) { const fr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; for (let i = 0; i < 2; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.06, "#8a4a1e", 5); m.scale.y = 1.5; const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    waterMat.uniforms.uTime.value = t;
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const p of palms) { const c = (p.userData as { crown?: THREE.Group }).crown; if (c) c.rotation.x = Math.sin(t * 24 + p.position.x) * 0.12 * shake; } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.06, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.061) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
    tickChildren(g)(t, dt);
  };
  return g;
}

/** A Bedouin tent: black goat-hair, rugs and cushions, the coffee dallah on the fire, a falcon. */
export function bedouinTent(): P {
  const g = group();
  add(g, box(5.4, 0.08, 4.2, ME.tent), 0, 2.2, 0).rotation.x = 0.1;
  add(g, box(5.4, 1.8, 0.08, ME.tent), 0, 1.3, -2.1);
  for (const [x, z] of [[-2.5, -2], [2.5, -2], [-2.5, 2], [2.5, 2], [0, 2.1]]) add(g, cyl(0.04, 0.04, 2.3 + (z > 0 ? 0.2 : 0), ME.wood, 4), x, 1.1, z);
  add(g, box(4.6, 0.06, 3.4, ME.rug), 0, 0.03, 0); add(g, box(3.6, 0.04, 2.4, ME.rug2), 0, 0.07, 0); for (let i = 0; i < 6; i++) add(g, box(0.5, 0.2, 0.5, ["#e0b34c", "#2f4f9f", "#3f8f5a"][i % 3]), -2.0 + (i % 3) * 0.7, 0.18, -1.5 + Math.floor(i / 3) * 0.5);
  add(g, cyl(0.5, 0.5, 0.15, "#8f857a", 10), 0.4, 0.08, 0.6); for (let i = 0; i < 4; i++) add(g, ball(0.1, "#f08a2a", 5), 0.4 + Math.cos(i * 1.6) * 0.2, 0.18, 0.6 + Math.sin(i * 1.6) * 0.2);
  const dallah = new THREE.Group(); dallah.position.set(0.4, 0.2, 0.6); g.add(dallah); add(dallah, cyl(0.1, 0.16, 0.36, ME.gold, 8), 0, 0.18, 0); add(dallah, cone(0.1, 0.16, ME.gold, 8), 0, 0.42, 0); add(dallah, cyl(0.02, 0.02, 0.4, ME.gold, 4), 0.15, 0.32, 0).rotation.z = -0.8; add(dallah, new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 5, 10), mat(ME.gold)), -0.12, 0.25, 0);
  for (let i = 0; i < 4; i++) add(g, cyl(0.04, 0.03, 0.06, "#f4f1ea", 6), -0.3 + i * 0.16, 0.12, 1.2);   // finjan cups
  const sitters: Fig[] = [];
  for (let i = 0; i < 3; i++) { const p = local(pick(["#f4f1ea", "#2a2a2e", "#7a4a3a"]), { keffiyeh: true }); p.userData.sit?.(); add(g, p, -1.4 + i * 1.2, -0.3, -0.6 + (i % 2) * 0.4).rotation.y = 0.3 - i * 0.3; sitters.push(p); }
  add(g, cyl(0.03, 0.03, 1.2, ME.wood, 4), 2.6, 0.6, 1.4); const falcon = add(g, ball(0.12, "#5a4a3a", 6), 2.6, 1.3, 1.4); falcon.scale.set(1, 1.4, 0.8); add(falcon, cone(0.03, 0.08, "#e0b34c", 4), 0.1, 0.05, 0).rotation.z = -1.5;
  add(g, cyl(0.28, 0.22, 0.24, C.straw, 8), -2.2, 0.12, 1.6); for (let k = 0; k < 7; k++) add(g, ball(0.06, "#8a4a1e", 5), -2.2 + (rnd() - 0.5) * 0.3, 0.28, 1.6 + (rnd() - 0.5) * 0.3).scale.y = 1.5;
  g.userData.smoke = new THREE.Vector3(0.4, 0.5, 0.6);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(sitters[1], "قهوة! Coffee, welcome!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); dallah.rotation.z = k * Math.sin(t * 6) * 0.5; dallah.position.y = 0.2 + k * Math.abs(Math.sin(t * 6)) * 0.3; sitters.forEach((p, i) => { if (p.userData.upper) { p.userData.upper.rotation.x = 0.1 + k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI); p.userData.upper.rotation.z = Math.sin(t * 0.8 + i) * 0.05; } }); falcon.rotation.z = k * Math.sin(t * 20) * 0.3; falcon.position.y = 1.3 + k * Math.abs(Math.sin(t * 5)) * 0.6; };
  return g;
}

/** A saffron field: rows of purple crocus, pickers with baskets, threads drying. */
export function saffronField(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#8a6a4a"), 0, 0.1, 0);
  const flowers: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 12; j++) { const x = -2.7 + j * 0.49, z = -1.6 + i * 0.8; add(g, cyl(0.015, 0.015, 0.14, "#4f8a4a", 3), x, 0.27, z); const f = add(g, cone(0.07, 0.14, "#9b59b6", 6), x, 0.4, z); f.rotation.x = Math.PI; flowers.push(f); add(g, box(0.02, 0.08, 0.02, "#c9302a"), x, 0.44, z); }
  const picker = local("#c0392b", { hijab: "#f2c14e" }); add(g, picker, 3.4, 0, 0.2); picker.rotation.y = -1.6;
  add(g, cyl(0.25, 0.2, 0.2, C.straw, 8), 3.4, 0.1, 1.0); for (let k = 0; k < 6; k++) add(g, cone(0.05, 0.1, "#9b59b6", 5), 3.4 + (rnd() - 0.5) * 0.3, 0.24, 1.0 + (rnd() - 0.5) * 0.3);
  add(g, box(0.8, 0.03, 0.5, "#f4f1ea"), 3.6, 0.03, -1.2); for (let k = 0; k < 12; k++) add(g, box(0.02, 0.02, 0.08, "#c9302a"), 3.3 + (k % 6) * 0.12, 0.06, -1.35 + Math.floor(k / 6) * 0.25);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(picker, "زعفران! Saffron!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); flowers.forEach((f, i) => { f.scale.setScalar(1 + k * Math.max(0, Math.sin(t * 9 + i * 0.5)) * 0.8); }); if (picker.userData.upper) picker.userData.upper.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 8)) * 0.3; };
  return g;
}

export function pomegranateOrchard(): P {
  const g = group();
  const trees: P[] = [];
  const fruits: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
    const tr = group(); tr.position.set(-2.4 + j * 2.4, 0, -1.2 + i * 2.4); g.add(tr); trees.push(tr);
    add(tr, cyl(0.08, 0.12, 0.8, "#6b4a2c", 6), 0, 0.4, 0);
    const crown = new THREE.Group(); tr.add(crown); (tr.userData as { crown?: THREE.Group }).crown = crown;
    add(crown, ball(0.75, "#4f8a4a", 8), 0, 1.35, 0).scale.y = 1.0;
    for (let k = 0; k < 6; k++) { const a = rnd() * 6.3; const f = add(crown, ball(0.11, "#b0263a", 7), Math.cos(a) * 0.6, 0.9 + rnd() * 0.8, Math.sin(a) * 0.6); add(f, cone(0.04, 0.06, "#7a1a2a", 5), 0, 0.12, 0); fruits.push(f); }
  }
  const picker = local("#3f6fb5", { skull: true }); add(g, picker, 3.4, 0, 0.4);
  add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 3.8, 0.15, 1.1); for (let k = 0; k < 5; k++) add(g, ball(0.09, "#b0263a", 6), 3.8 + (rnd() - 0.5) * 0.4, 0.34, 1.1 + (rnd() - 0.5) * 0.3);
  add(g, cyl(0.24, 0.2, 0.06, "#f4f1ea", 12), 3.0, 0.03, 1.8); for (let k = 0; k < 14; k++) add(g, ball(0.025, "#c9302a", 4), 3.0 + (rnd() - 0.5) * 0.35, 0.08, 1.8 + (rnd() - 0.5) * 0.35);   // a plate of arils
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "انار! Pomegranates!", 2.6, 1400); for (const tr of trees) for (let i = 0; i < 2; i++) { const src = fruits[Math.floor(rnd() * fruits.length)]; const m = ball(0.1, "#b0263a", 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); void tr; } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) { c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; c.rotation.x = Math.cos(t * 21 + tr.position.z) * 0.05 * shake; } } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.1, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.101) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

/** A Persian kitchen: the rice pot turned out as a golden tahdig, saffron rice, koobideh on the grill, a tea samovar. */
export function pilafKitchen(): P {
  const g = group();
  add(g, casaMe("#e9dcc0", 4.4, 3.0, 2.4, { domes: true }), 0, 0, -1.2);
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.4); add(g, box(2.0, 0.3, 0.02, ME.turquoise), 0, 2.15, 0.44);
  add(g, box(3.4, 0.8, 1.0, ME.wood), -0.3, 0.4, 1.3);
  const pot = add(g, cyl(0.42, 0.36, 0.5, "#8c9096", 12), -1.4, 1.05, 1.3);
  const tahdig = new THREE.Group(); tahdig.position.set(-0.3, 0.82, 1.3); g.add(tahdig);
  add(tahdig, cyl(0.42, 0.42, 0.05, "#f4f1ea", 14), 0, 0, 0); add(tahdig, cyl(0.36, 0.36, 0.14, "#d9a441", 14), 0, 0.09, 0); add(tahdig, ball(0.33, "#f7f2e6", 10), 0, 0.2, 0).scale.y = 0.5; for (let k = 0; k < 8; k++) add(tahdig, ball(0.03, "#f2c14e", 4), Math.cos(k * 0.8) * 0.2, 0.36, Math.sin(k * 0.8) * 0.2); add(tahdig, box(0.04, 0.02, 0.02, "#c9302a"), 0.05, 0.38, 0);   // saffron and barberries
  add(g, cyl(0.24, 0.2, 0.05, "#f4f1ea", 10), 0.8, 0.84, 1.3); for (let k = 0; k < 3; k++) add(g, box(0.4, 0.06, 0.08, "#a44a3a"), 0.8, 0.9, 1.15 + k * 0.14);   // koobideh
  add(g, cyl(0.15, 0.15, 0.03, "#f2dca0", 10), 0.8, 0.86, 1.65); add(g, ball(0.06, "#c9302a", 6), 1.2, 0.9, 1.5); add(g, cyl(0.06, 0.04, 0.14, "#8fc4c9", 6), 1.35, 0.92, 1.2);
  const cook = local("#f4f1ea", { apron: true, skull: true }); add(g, cook, -0.3, 0, 0.3); cook.rotation.y = 0.1;
  const diners: Fig[] = [];
  for (let i = 0; i < 3; i++) { add(g, cyl(0.2, 0.2, 0.42, "#5a3d28", 8), -1.4 + i * 1.2, 0.21, 2.6); const d = local(pick(["#3f6fb5", "#c0392b", "#2f5d3f"]), { hijab: i === 1 ? "#e8558a" : undefined }); d.userData.sit?.(); add(g, d, -1.4 + i * 1.2, 0.04, 2.6).rotation.y = Math.PI; diners.push(d); }
  g.userData.steam = new THREE.Vector3(-1.4, 1.5, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "نوش جان! Nooshe jan!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pot.position.y = 1.05 + k * Math.abs(Math.sin(t * 5)) * 0.5; pot.rotation.x = k * Math.sin(t * 5) * 0.6; tahdig.position.y = 0.82 + k * Math.max(0, Math.sin(t * 9)) * 0.25; tahdig.rotation.y += k * dt * 4; diners.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + k * Math.sin(t * 5) * 0.2; };
  return g;
}

/** A baklava and Turkish delight shop. */
export function sweetShop(): P {
  const g = group();
  add(g, casaMe(ME.cream, 3.6, 2.6, 2.2), 0, 0, -1.0);
  add(g, box(1.8, 0.5, 0.06, "#1f2430"), 0, 1.85, 0.4); add(g, box(1.6, 0.3, 0.02, "#e8558a"), 0, 1.85, 0.44);
  add(g, box(3.0, 0.8, 0.9, ME.wood), 0, 0.4, 1.2); add(g, new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 0.9), mat("#bfe0ea", { transparent: true, opacity: 0.35 })), 0, 1.05, 1.2);
  const trays: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const tr = new THREE.Group(); tr.position.set(-1.0 + i * 1.0, 0.82, 1.2); g.add(tr); trays.push(tr); add(tr, cyl(0.42, 0.42, 0.04, "#c9c2b0", 12), 0, 0, 0); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; if (i === 0) add(tr, box(0.16, 0.12, 0.16, "#d9a441"), Math.cos(a) * 0.25, 0.08, Math.sin(a) * 0.25).rotation.y = a; else if (i === 1) add(tr, cyl(0.07, 0.07, 0.12, "#6f9b57", 6), Math.cos(a) * 0.25, 0.08, Math.sin(a) * 0.25); else add(tr, box(0.12, 0.12, 0.12, k % 2 ? "#e8a0a8" : "#f2c14e"), Math.cos(a) * 0.25, 0.08, Math.sin(a) * 0.25); } }
  const seller = local("#f4f1ea", { apron: true, fez: true }); add(g, seller, 0.3, 0, 0.3); seller.rotation.y = 0.2;
  const customer = local("#3f6fb5", { hijab: "#9b59b6" }); add(g, customer, -0.6, 0, 2.2); customer.rotation.y = Math.PI;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(seller, "Baklava! Lokum!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); trays.forEach((tr, i) => { tr.position.y = 0.82 + k * Math.max(0, Math.sin(t * 9 + i * 1.3)) * 0.3; tr.rotation.y += k * dt * 5; }); if (seller.userData.upper) seller.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}


/** A Cappadocia hot-air balloon: striped envelope, a wicker basket, two people looking down. */
export function balloon(a = "#c9302a", b = "#f2c14e"): P {
  const g = group();
  const env = new THREE.Group(); g.add(env);
  for (let i = 0; i < 12; i++) { const gore = add(env, new THREE.Mesh(new THREE.SphereGeometry(1.3, 4, 10, (i / 12) * Math.PI * 2, Math.PI / 6, 0, Math.PI * 0.72), mat(i % 2 ? a : b, { side: THREE.DoubleSide })), 0, 0, 0); void gore; }
  add(env, cone(0.6, 0.9, a, 12), 0, -1.2, 0).rotation.x = Math.PI;
  add(env, cyl(0.28, 0.28, 0.2, "#4a3222", 10), 0, -1.7, 0);
  for (const sd of [-1, 1]) for (const sz of [-1, 1]) add(g, cyl(0.015, 0.015, 1.4, "#4a3222", 3), sd * 0.35, -2.3, sz * 0.35);
  add(g, box(0.9, 0.6, 0.9, "#a37a4f"), 0, -3.2, 0); add(g, box(0.95, 0.06, 0.95, "#8a6a3a"), 0, -2.9, 0);
  for (let i = 0; i < 2; i++) { const p = person(i ? "#3f6fb5" : "#f4f1ea"); p.scale.setScalar(0.7); p.position.set(-0.2 + i * 0.4, -3.05, 0); p.rotation.y = i * Math.PI; g.add(p); }
  const flame = add(g, cone(0.12, 0.35, "#f08a2a", 6), 0, -1.95, 0);
  g.userData.tick = (t) => { flame.scale.y = 0.6 + Math.max(0, Math.sin(t * 7)) * 0.8; flame.visible = Math.sin(t * 0.9) > -0.3; };
  return g;
}

export const MIDEAST_PROPS: Record<string, () => P> = {
  bazaar, kebabHouse, teaGarden, simitCart, mezzeHouse, bakery, shawarmaStand, herbGarden, chickpeaField, oliveLemonGrove, flock, caravan, oasis, bedouinTent, saffronField, pomegranateOrchard, pilafKitchen, sweetShop, none: () => group(),
};

export const MIDEAST_ICONS: Record<string, () => P> = {
  chickpeas: () => { const g = group(); add(g, cyl(0.36, 0.3, 0.1, "#f4f1ea", 12), 0, 0.05, 0); add(g, ball(0.3, "#e9d7a8", 9), 0, 0.14, 0).scale.y = 0.45; add(g, cyl(0.12, 0.12, 0.02, "#c9862a", 8), 0, 0.28, 0); add(g, ball(0.04, "#c9302a", 4), 0.15, 0.28, 0.1); for (let k = 0; k < 6; k++) add(g, ball(0.04, "#e9d7a8", 4), 0.45 + (k % 3) * 0.08, 0.04, -0.3 + Math.floor(k / 3) * 0.08); return g; },
  lambYogurt: () => { const g = group(); add(g, ball(0.3, "#f1ece2", 8), -0.2, 0.35, 0).scale.set(1.3, 0.9, 1); const h = add(g, ball(0.13, "#2a2a2e", 7), 0.22, 0.4, 0); add(h, ball(0.04, "#f1ece2", 4), 0.04, 0.1, 0.08); add(h, ball(0.04, "#f1ece2", 4), 0.04, 0.1, -0.08); for (const x of [-0.35, 0.0]) for (const z of [-0.12, 0.12]) add(g, box(0.07, 0.25, 0.07, "#2a2a2e"), x, 0.12, z); add(g, cyl(0.14, 0.12, 0.16, "#a45a3a", 8), 0.55, 0.08, 0.2); add(g, cyl(0.13, 0.13, 0.03, "#f4f1ea", 8), 0.55, 0.17, 0.2); return g; },
  herbs: () => { const g = group(); for (let k = 0; k < 7; k++) { add(g, cyl(0.015, 0.015, 0.4, "#5f9a4a", 3), -0.3 + k * 0.1, 0.2, (k % 2) * 0.1); add(g, ball(0.08, k % 2 ? "#3f7a3a" : "#6fb06a", 5), -0.3 + k * 0.1, 0.42, (k % 2) * 0.1).scale.y = 0.6; } add(g, ball(0.12, "#f2cf3a", 8), 0.45, 0.12, -0.2).scale.set(1, 0.85, 0.8); return g; },
  oliveLemon: () => { const g = group(); add(g, ball(0.16, "#f2cf3a", 9), -0.3, 0.16, 0).scale.set(1.15, 0.9, 0.9); for (let k = 0; k < 6; k++) add(g, ball(0.06, k % 2 ? "#2f3a2a" : "#6f9b57", 5), 0.1 + (k % 3) * 0.14, 0.06, -0.1 + Math.floor(k / 3) * 0.14); add(g, cyl(0.08, 0.07, 0.3, "#c9b45a", 6), 0.55, 0.15, 0.15); return g; },
  dates: () => { const g = group(); for (let k = 0; k < 5; k++) add(g, ball(0.08, "#8a4a1e", 6), -0.3 + k * 0.15, 0.08, (k % 2) * 0.1).scale.set(1, 1.5, 1); add(g, cyl(0.06, 0.08, 0.28, ME.gold, 8), 0.5, 0.14, -0.15); add(g, cone(0.06, 0.1, ME.gold, 8), 0.5, 0.33, -0.15); return g; },
  spicesMe: () => { const g = group(); for (let i = 0; i < 4; i++) { add(g, cyl(0.12, 0.13, 0.08, "#8a6a3a", 8), -0.4 + i * 0.27, 0.04, (i % 2) * 0.15); add(g, cone(0.11, 0.2, ["#c9302a", "#e0b34c", "#6f9b57", "#8e2a22"][i], 8), -0.4 + i * 0.27, 0.18, (i % 2) * 0.15); } return g; },
  saffron: () => { const g = group(); for (let k = 0; k < 5; k++) { add(g, cyl(0.015, 0.015, 0.2, "#4f8a4a", 3), -0.3 + k * 0.15, 0.1, (k % 2) * 0.1); const f = add(g, cone(0.08, 0.16, "#9b59b6", 6), -0.3 + k * 0.15, 0.26, (k % 2) * 0.1); f.rotation.x = Math.PI; add(g, box(0.02, 0.1, 0.02, "#c9302a"), -0.3 + k * 0.15, 0.3, (k % 2) * 0.1); } add(g, ball(0.16, "#b0263a", 8), 0.5, 0.16, -0.2); return g; },
  mangal: () => { const g = group(); add(g, box(0.9, 0.2, 0.4, "#5a5a5a"), 0, 0.1, 0); for (let i = 0; i < 3; i++) { add(g, box(0.02, 0.02, 0.6, "#c9cfd6"), -0.25 + i * 0.25, 0.26, 0); for (let k = 0; k < 3; k++) add(g, box(0.1, 0.1, 0.12, k % 2 ? "#f2c14e" : "#c9573a"), -0.25 + i * 0.25, 0.26, -0.18 + k * 0.18); } return g; },
  spit: () => { const g = group(); for (let i = 0; i < 7; i++) add(g, cyl(0.16 + i * 0.02, 0.16 + i * 0.02, 0.08, i % 2 ? "#a6603a" : "#c47a4a", 10), 0, 0.04 + i * 0.08, 0); add(g, cyl(0.02, 0.02, 0.9, "#8c9096", 5), 0, 0.45, 0); add(g, ball(0.08, "#e9d7a8", 6), 0, 0.68, 0); for (let k = 0; k < 3; k++) add(g, ball(0.045, "#8a6a3a", 5), 0.4 + (k % 2) * 0.1, 0.05, -0.2 + k * 0.1); return g; },
  taboon: () => { const g = group(); add(g, dome(0.4, "#a45a3a", 12), 0, 0.15, 0); add(g, cyl(0.4, 0.4, 0.15, "#a45a3a", 12), 0, 0.075, 0); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 8, 1, false, 0, Math.PI), mat("#2a1a14")), 0, 0.2, 0.36).rotation.set(Math.PI / 2, 0, Math.PI / 2); for (let k = 0; k < 3; k++) add(g, cyl(0.14, 0.14, 0.025, "#f2dca0", 10), 0.5, 0.03 + k * 0.03, 0.2); return g; },
  mezze: () => { const g = group(); const cols = ["#e9d7a8", "#4f8a4a", "#c9413f", "#2f3a2a"]; cols.forEach((c, i) => { add(g, cyl(0.15, 0.13, 0.03, "#f4f1ea", 10), -0.3 + (i % 2) * 0.4, 0.02, -0.2 + Math.floor(i / 2) * 0.4); add(g, ball(0.1, c, 7), -0.3 + (i % 2) * 0.4, 0.06, -0.2 + Math.floor(i / 2) * 0.4).scale.y = 0.45; }); add(g, cyl(0.16, 0.16, 0.025, "#f2dca0", 10), 0.5, 0.02, 0.4); return g; },
  bazaar: () => { const g = group(); for (let i = 0; i < 3; i++) { add(g, cyl(0.12, 0.13, 0.08, "#8a6a3a", 8), -0.3 + i * 0.3, 0.04, 0); add(g, cone(0.11, 0.22, ["#c9302a", "#e0b34c", "#6f9b57"][i], 8), -0.3 + i * 0.3, 0.18, 0); } const l = add(g, ball(0.1, "#3fa2b0", 7), 0.55, 0.3, -0.3); l.scale.y = 1.4; add(g, cyl(0.01, 0.01, 0.4, "#8a6a3a", 3), 0.55, 0.6, -0.3); return g; },
  tea: () => { const g = group(); add(g, cyl(0.16, 0.14, 0.34, ME.copper, 10), -0.25, 0.17, 0); add(g, cyl(0.08, 0.08, 0.12, ME.copper, 8), -0.25, 0.4, 0); add(g, cyl(0.1, 0.09, 0.1, "#8fc4c9", 8), -0.25, 0.51, 0); add(g, cyl(0.07, 0.05, 0.16, "#8fc4c9", 6), 0.25, 0.1, 0.1); add(g, cyl(0.08, 0.08, 0.02, "#f4f1ea", 8), 0.25, 0.01, 0.1); return g; },
  sweets: () => { const g = group(); for (let k = 0; k < 4; k++) add(g, box(0.16, 0.12, 0.16, "#d9a441"), -0.3 + (k % 2) * 0.2, 0.06, -0.1 + Math.floor(k / 2) * 0.2).rotation.y = 0.4; for (let k = 0; k < 3; k++) add(g, box(0.12, 0.12, 0.12, k % 2 ? "#e8a0a8" : "#6f9b57"), 0.3 + k * 0.15, 0.06, 0.1 - k * 0.1); return g; },
  coffee: () => { const g = group(); add(g, cyl(0.1, 0.16, 0.36, ME.gold, 8), -0.15, 0.18, 0); add(g, cone(0.1, 0.16, ME.gold, 8), -0.15, 0.42, 0); add(g, cyl(0.02, 0.02, 0.4, ME.gold, 4), 0.0, 0.32, 0).rotation.z = -0.8; for (let k = 0; k < 3; k++) add(g, cyl(0.045, 0.035, 0.06, "#f4f1ea", 6), 0.3, 0.03, -0.15 + k * 0.15); for (let k = 0; k < 4; k++) add(g, ball(0.05, "#8a4a1e", 5), 0.45 + (k % 2) * 0.1, 0.05, 0.2 + Math.floor(k / 2) * 0.1).scale.y = 1.5; return g; },
  pilaf: () => { const g = group(); add(g, cyl(0.36, 0.36, 0.04, "#f4f1ea", 14), 0, 0.02, 0); add(g, cyl(0.3, 0.3, 0.1, "#d9a441", 14), 0, 0.09, 0); add(g, ball(0.28, "#f7f2e6", 10), 0, 0.16, 0).scale.y = 0.5; for (let k = 0; k < 6; k++) add(g, ball(0.03, "#f2c14e", 4), Math.cos(k * 1.05) * 0.16, 0.3, Math.sin(k * 1.05) * 0.16); add(g, box(0.05, 0.02, 0.02, "#c9302a"), 0, 0.31, 0.05); return g; },
  camels: () => { const c = camel(); c.scale.setScalar(0.4); return c; },
  cenoteMe: () => group(),
};
