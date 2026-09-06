/** Indian props: the Taj Mahal and Golden Temple, a tandoor, a dhaba with its painted truck, a hill fort, camels, Mumbai's Gateway and market, Kerala's backwaters, fishing nets and a temple elephant. Text is Hindi / Malayalam / Marathi + English. */
import * as THREE from "three";
import { mat, add, rnd, C, person, cow, chicken, bubble, wear, tree, type P } from "./props";
import { datePalm } from "./props-mideast";
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

export const IN = { marble: "#f4efe6", sandstone: "#c96a3a", gold: "#e0b34c", saffron: "#f08a2a", green: "#2f7f4a", pink: "#e8558a", teal: "#2a8f8f", wood: "#7a4a2a", laterite: "#b85a3a", palmGreen: "#4f9a4a", cream: "#f3e9d2", blue: "#2f6fb5", turmeric: "#e0a52c" };

/** Someone in a turban, a sari, a dhoti or a Nehru cap. */
export function indian(shirt: string, opts: { turban?: string; sari?: string; cap?: boolean; apron?: boolean; dhoti?: boolean } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.turban) { wear(p, ball(0.2, opts.turban, 9), 0, 1.24, 0).scale.set(1.15, 0.8, 1.15); wear(p, box(0.1, 0.16, 0.1, opts.turban), 0.12, 1.36, 0.05); }
  if (opts.sari) { wear(p, box(0.42, 0.55, 0.3, opts.sari), 0, 0.72, 0); wear(p, box(0.16, 0.5, 0.2, opts.sari), 0.14, 1.05, -0.06).rotation.z = 0.3; wear(p, ball(0.19, opts.sari, 8), 0, 1.25, -0.04).scale.set(1, 1.05, 1); }
  if (opts.cap) wear(p, box(0.32, 0.11, 0.22, "#f4f1ea"), 0, 1.22, 0);
  if (opts.dhoti) wear(p, box(0.36, 0.4, 0.28, "#f4f1ea"), 0, 0.42, 0);
  return p;
}

// ---------- landmarks ----------

export function tajMahal(): P {
  const g = group();
  add(g, box(14, 0.8, 14, IN.marble), 0, 0.4, -2);
  add(g, box(7, 5, 7, IN.marble), 0, 3.3, -2);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, box(1.6, 5, 1.6, IN.marble), sx * 3.2, 3.3, -2 + sz * 3.2);
  for (const sz of [-1, 1]) { add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.6, 12, 1, false, 0, Math.PI), mat("#e6dfd2")), 0, 4.0, -2 + sz * 3.55).rotation.set(Math.PI / 2, 0, sz > 0 ? Math.PI / 2 : -Math.PI / 2); add(g, box(2.2, 3.2, 0.5, "#4a3a2a"), 0, 2.4, -2 + sz * 3.55); }
  for (const sx of [-1, 1]) { add(g, box(0.5, 3.2, 2.2, "#4a3a2a"), sx * 3.55, 2.4, -2); }
  add(g, cyl(2.2, 2.2, 1.2, IN.marble, 16), 0, 6.4, -2);
  add(g, dome(2.6, IN.marble, 18), 0, 6.6, -2).scale.y = 1.25;
  add(g, cyl(0.06, 0.06, 1.2, IN.gold, 6), 0, 10.4, -2); add(g, ball(0.16, IN.gold, 6), 0, 11.0, -2);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { add(g, cyl(0.6, 0.6, 0.6, IN.marble, 10), sx * 3.2, 6.1, -2 + sz * 3.2); add(g, dome(0.75, IN.marble, 10), sx * 3.2, 6.3, -2 + sz * 3.2); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { add(g, cyl(0.34, 0.42, 8.5, IN.marble, 10), sx * 6.4, 4.25, -2 + sz * 6.4); for (const y of [3.4, 6.2]) add(g, cyl(0.5, 0.42, 0.25, "#e6dfd2", 10), sx * 6.4, y, -2 + sz * 6.4); add(g, dome(0.5, IN.marble, 8), sx * 6.4, 8.6, -2 + sz * 6.4); }
  // the long reflecting pool between cypress rows
  add(g, box(2.2, 0.3, 12, "#c9bda8"), 0, 0.15, 11); add(g, box(1.8, 0.1, 11.6, "#8fd0dc"), 0, 0.32, 11);
  for (const sd of [-1, 1]) for (let i = 0; i < 5; i++) add(g, cone(0.35, 1.8, "#2f5d3f", 6), sd * 1.9, 0.9, 6 + i * 2.5);
  for (const sd of [-1, 1]) { add(g, box(4, 0.15, 12, "#7fb06a"), sd * 4.2, 0.07, 11); }
  const pea = new THREE.Group(); pea.position.set(-4.5, 0, 8); g.add(pea);
  add(pea, ball(0.18, IN.blue, 7), 0, 0.5, 0).scale.set(1.3, 0.9, 1); add(pea, cyl(0.04, 0.05, 0.4, IN.blue, 5), 0.18, 0.75, 0); add(pea, ball(0.08, IN.blue, 6), 0.22, 0.98, 0); add(pea, cone(0.02, 0.1, IN.gold, 4), 0.32, 0.96, 0).rotation.z = -1.5;
  const tail = add(pea, new THREE.Mesh(new THREE.CircleGeometry(0.9, 16, Math.PI * 0.15, Math.PI * 0.7), mat(IN.green, { side: THREE.DoubleSide })), -0.25, 0.5, 0); tail.rotation.y = Math.PI / 2; for (let k = 0; k < 7; k++) add(tail, ball(0.06, IN.blue, 5), Math.cos(Math.PI * 0.15 + k * 0.31) * 0.7, Math.sin(Math.PI * 0.15 + k * 0.31) * 0.7, 0.01);
  for (const z of [-0.05, 0.05]) add(pea, cyl(0.015, 0.015, 0.4, "#8a6a3a", 3), 0, 0.2, z);
  g.userData.tick = (t) => { tail.rotation.z = Math.sin(t * 0.8) * 0.15; pea.rotation.y = Math.sin(t * 0.3) * 0.5; };
  return g;
}

/** The Golden Temple: a gilded shrine in a pool, a causeway, pilgrims, and the langar kitchen. */
export function goldenTemple(): P {
  const g = group();
  add(g, box(14, 0.4, 12, IN.marble), 0, 0.2, 0);
  add(g, box(12, 0.15, 10, "#8fd0dc"), 0, 0.45, 0);
  add(g, box(3.6, 0.6, 3.6, IN.marble), 0, 0.6, 0);
  add(g, box(3.2, 2.2, 3.2, IN.marble), 0, 1.9, 0); for (let k = 0; k < 4; k++) add(g, box(0.5, 0.9, 0.06, "#4a3a2a"), -1.2 + k * 0.8, 1.9, 1.63);
  add(g, box(3.4, 1.6, 3.4, IN.gold), 0, 3.8, 0); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { add(g, cyl(0.25, 0.25, 0.6, IN.gold, 8), sx * 1.5, 4.9, sz * 1.5); add(g, dome(0.35, IN.gold, 8), sx * 1.5, 5.2, sz * 1.5); }
  add(g, cyl(1.2, 1.4, 0.5, IN.gold, 12), 0, 4.85, 0); add(g, dome(1.4, IN.gold, 16), 0, 5.1, 0).scale.y = 0.95; add(g, cyl(0.05, 0.05, 0.8, IN.gold, 6), 0, 6.8, 0);
  add(g, box(1.4, 0.5, 5.2, IN.marble), 0, 0.5, 4.2);   // the causeway
  const pilgrims: Fig[] = [];
  for (let i = 0; i < 4; i++) { const p = indian(pick(["#f4f1ea", "#e0b34c", "#3f6fb5", "#e8558a"]), { turban: i % 2 ? IN.saffron : undefined, sari: i % 2 ? undefined : "#e8558a" }); add(g, p, (i % 2 ? -0.35 : 0.35), 0.75, 2.4 + i * 1.1).rotation.y = Math.PI; pilgrims.push(p); }
  // the langar: a great pot and rows of people seated on the floor
  add(g, box(4, 0.15, 3, "#c9bda8"), 9.5, 0.47, 3); add(g, cyl(0.6, 0.5, 0.7, "#8c9096", 12), 9.5, 0.9, 1.2); add(g, cyl(0.55, 0.55, 0.05, "#e0a52c", 12), 9.5, 1.25, 1.2);
  const server = indian("#f4f1ea", { turban: IN.blue, apron: true }); add(g, server, 8.5, 0.55, 1.4); server.rotation.y = 1.4;
  const eaters: Fig[] = [];
  for (let i = 0; i < 6; i++) { const e = indian(pick(["#f4f1ea", "#3f6fb5", "#e0b34c", "#2f7f4a"]), { turban: i % 3 === 0 ? IN.saffron : undefined, sari: i % 3 === 1 ? "#9b59b6" : undefined }); e.userData.sit?.(); add(g, e, 8 + (i % 3) * 1.2, 0.2, 2.6 + Math.floor(i / 3) * 1.1).rotation.y = Math.PI; eaters.push(e); add(g, cyl(0.16, 0.14, 0.04, "#8c9096", 8), 8 + (i % 3) * 1.2, 0.56, 2.2 + Math.floor(i / 3) * 1.1); }
  g.userData.steam = new THREE.Vector3(9.5, 1.5, 1.2);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(server, "ਲੰਗਰ! Langar, everyone eats!", 1.6, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pilgrims.forEach((p, i) => { p.position.y = 0.75 + k * Math.abs(Math.sin(t * 8 + i)) * 0.2; }); eaters.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.15 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (server.userData.upper) server.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

export function gateway(): P {
  const g = group();
  add(g, box(9, 0.6, 5, "#b8a88a"), 0, 0.3, 0);
  add(g, box(7, 7, 4, "#c9a86a"), 0, 4.1, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 4.2, 14, 1, false, 0, Math.PI), mat("#4a3a2a")), 0, 3.6, 0).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  for (const sx of [-1, 1]) { add(g, box(1.6, 8.4, 1.6, "#c9a86a"), sx * 3.2, 4.2, 1.6); add(g, box(1.6, 8.4, 1.6, "#c9a86a"), sx * 3.2, 4.2, -1.6); for (const sz of [-1, 1]) add(g, dome(0.9, "#a88a5a", 10), sx * 3.2, 8.4, sz * 1.6); }
  add(g, cyl(1.9, 1.9, 0.6, "#c9a86a", 14), 0, 7.9, 0); add(g, dome(2.0, "#a88a5a", 14), 0, 8.2, 0).scale.y = 0.8;
  for (let i = 0; i < 6; i++) add(g, box(0.5, 0.6, 0.1, "#4a3a2a"), -2.5 + i * 1.0, 6.4, 2.05);
  return g;
}

/** A Rajput hill fort: ramparts climbing a rock, cupolas, a ramp with a painted gate. */
export function hillFort(): P {
  const g = group();
  const rock = add(g, new THREE.Mesh(new THREE.CylinderGeometry(5, 6.5, 4, 10), mat("#b8905a")), 0, 2, 0); rock.scale.z = 0.8;
  add(g, box(9, 3.2, 6.5, IN.sandstone), 0, 5.6, 0);
  for (let k = 0; k < 9; k++) for (const sz of [-1, 1]) add(g, box(0.5, 0.5, 0.4, IN.sandstone), -4 + k * 1.0, 7.4, sz * 3.3);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { add(g, cyl(0.9, 1.0, 4.2, IN.sandstone, 10), sx * 4.2, 6.6, sz * 3.0); add(g, cyl(0.7, 0.7, 0.5, IN.sandstone, 8), sx * 4.2, 8.9, sz * 3.0); add(g, dome(0.8, "#e0b34c", 10), sx * 4.2, 9.1, sz * 3.0); }
  add(g, box(4, 2.6, 3, "#d9a86c"), 0, 8.5, -0.5); add(g, dome(1.2, "#f4efe6", 12), 0, 9.8, -0.5); for (let k = 0; k < 5; k++) add(g, box(0.3, 0.8, 0.06, "#4a3a2a"), -1.5 + k * 0.7, 8.5, 1.03);
  for (let k = 0; k < 10; k++) add(g, box(1.6, 0.3, 0.9, "#c9a86a"), 5.5 - k * 0.5, 0.2 + k * 0.45, 4.5 - k * 0.25);   // the ramp
  add(g, box(1.8, 2.0, 0.4, IN.sandstone), 0.6, 5.0, 3.4); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5, 10, 1, false, 0, Math.PI), mat("#4a3a2a")), 0.6, 4.7, 3.45).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  add(g, box(0.05, 1.2, 0.05, IN.wood), 0, 10.9, -0.5); add(g, box(0.5, 0.3, 0.02, IN.saffron), 0.28, 11.3, -0.5);
  return g;
}

// ---------- Punjab: tandoor, dhaba, fields, dairy ----------

/** The tandoor: a clay oven sunk in a counter, naan slapped to its wall, chicken on skewers, a wheat field behind. */
export function tandoorHouse(): P {
  const g = group();
  add(g, box(4.4, 2.4, 3.0, IN.cream), 0, 1.2, -1.4); add(g, box(4.5, 0.2, 3.1, "#b8a88a"), 0, 2.5, -1.4);
  for (let k = 0; k < 3; k++) add(g, box(0.5, 0.7, 0.06, "#4a3a2a"), -1.4 + k * 1.4, 1.4, 0.13);
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(2.0, 0.3, 0.02, IN.saffron), 0, 2.15, 0.24);
  add(g, box(3.2, 0.85, 1.2, "#a45a3a"), -0.4, 0.42, 1.3);
  add(g, cyl(0.5, 0.42, 0.9, "#7a4a2a", 12), -1.3, 0.5, 1.3); add(g, cyl(0.4, 0.4, 0.06, "#f08a2a", 12), -1.3, 0.9, 1.3); add(g, cyl(0.5, 0.5, 0.06, "#3a2a1a", 12), -1.3, 0.93, 1.3); add(g, cyl(0.32, 0.32, 0.08, "#f08a2a", 12), -1.3, 0.95, 1.3);
  const naans: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) { const n = add(g, cyl(0.2, 0.2, 0.025, "#f2dca0", 10), -1.3 + Math.cos(i * 2.1) * 0.4, 1.0, 1.3 + Math.sin(i * 2.1) * 0.4); n.scale.x = 1.4; naans.push(n); }
  const skewers: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const sk = new THREE.Group(); sk.position.set(-1.3 + (i - 1) * 0.28, 1.5, 1.3); g.add(sk); skewers.push(sk); add(sk, cyl(0.015, 0.015, 1.6, "#c9cfd6", 4), 0, 0, 0); for (let k = 0; k < 3; k++) add(sk, ball(0.09, "#d9482a", 6), 0, -0.4 + k * 0.3, 0).scale.set(1, 1.3, 1); }
  for (let i = 0; i < 6; i++) add(g, cyl(0.2, 0.2, 0.025, "#f2dca0", 10), 0.5 + (i % 3) * 0.45, 0.87 + Math.floor(i / 3) * 0.03, 1.0 + Math.floor(i / 3) * 0.5).scale.x = 1.4;
  add(g, cyl(0.1, 0.08, 0.16, "#e0a52c", 8), 1.2, 0.93, 1.6); add(g, cyl(0.1, 0.08, 0.16, "#3f7a3a", 8), 1.45, 0.93, 1.55);   // butter and mint chutney
  const cook = indian("#f4f1ea", { apron: true, turban: IN.saffron }); add(g, cook, -1.3, 0, 2.3); cook.rotation.y = Math.PI;
  const paddle = add(g, box(0.05, 0.02, 0.8, IN.wood), -1.0, 1.05, 1.8); paddle.rotation.y = 0.4;
  for (const x of [1.0, 2.4]) { add(g, cyl(0.18, 0.18, 0.4, IN.wood, 8), x, 0.2, 2.4); const e = indian(pick(["#3f6fb5", "#e0b34c", "#2f7f4a"]), { turban: x > 2 ? IN.blue : undefined }); e.userData.sit?.(); add(g, e, x, 0.04, 2.4).rotation.y = Math.PI; }
  g.userData.smoke = new THREE.Vector3(-1.3, 1.3, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "गरम नान! Hot naan!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); naans.forEach((n, i) => { n.position.y = 1.0 + k * Math.max(0, Math.sin(t * 9 + i * 2)) * 0.6; n.scale.y = 1 + k * Math.max(0, Math.sin(t * 9 + i * 2)) * 5; n.rotation.y += k * dt * 5; }); skewers.forEach((s, i) => { s.position.y = 1.5 + k * Math.abs(Math.sin(t * 6 + i)) * 0.5; s.rotation.y += k * dt * 8; }); paddle.rotation.y = 0.4 + Math.sin(t * (1.5 + k * 8)) * 0.4; if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + Math.sin(t * (1.5 + k * 8)) * 0.1; };
  return g;
}

/** A highway dhaba: charpoys to sit on, a big karahi over a fire, a painted truck pulled up outside. */
export function dhaba(): P {
  const g = group();
  add(g, box(4.4, 2.2, 3.0, "#d9b98a"), 0, 1.1, -1.4); add(g, box(4.6, 0.1, 3.2, "#8c9096"), 0, 2.25, -1.4);
  add(g, box(3.0, 0.7, 0.06, "#c0392b"), 0, 2.6, -1.0); add(g, box(2.6, 0.4, 0.02, "#f2c14e"), 0, 2.6, -0.96);
  add(g, box(1.6, 0.8, 0.8, "#a45a3a"), -1.4, 0.4, 0.8); for (let k = 0; k < 3; k++) add(g, ball(0.08, "#f08a2a", 5), -1.4 + Math.cos(k * 2.1) * 0.25, 0.85, 0.8 + Math.sin(k * 2.1) * 0.25);
  const karahi = new THREE.Group(); karahi.position.set(-1.4, 0.95, 0.8); g.add(karahi);
  add(karahi, new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat("#3a3a3d")), 0, 0.4, 0); add(karahi, cyl(0.52, 0.52, 0.05, "#e07a2a", 14), 0, 0.38, 0); for (let k = 0; k < 6; k++) add(karahi, ball(0.07, "#c9573a", 5), Math.cos(k * 1.05) * 0.3, 0.42, Math.sin(k * 1.05) * 0.3);
  for (const sd of [-1, 1]) add(karahi, new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 5, 8), mat("#3a3a3d")), sd * 0.58, 0.32, 0);
  const ladle = add(g, cyl(0.02, 0.02, 0.7, "#8c9096", 4), -1.2, 1.5, 0.9); ladle.rotation.z = 0.5;
  add(g, cyl(0.5, 0.5, 0.05, "#3a3a3d", 14), 0.4, 0.83, 0.8); add(g, box(0.4, 0.4, 0.4, "#a45a3a"), 0.4, 0.6, 0.8); for (let k = 0; k < 3; k++) add(g, cyl(0.2, 0.2, 0.02, "#f2dca0", 10), 0.4 + Math.cos(k * 2.1) * 0.25, 0.87, 0.8 + Math.sin(k * 2.1) * 0.25);   // rotis on the tawa
  const cook = indian("#f4f1ea", { apron: true, turban: IN.blue }); add(g, cook, -0.5, 0, 1.7); cook.rotation.y = Math.PI;
  const diners: Fig[] = [];
  for (const x of [-2.0, 2.2]) {
    add(g, box(1.6, 0.06, 0.9, "#c9a86a"), x, 0.45, 2.6); for (const cx of [-0.7, 0.7]) for (const cz of [-0.35, 0.35]) add(g, box(0.08, 0.45, 0.08, IN.wood), x + cx, 0.22, 2.6 + cz);   // charpoy
    for (let i = 0; i < 2; i++) { const d = indian(pick(["#3f6fb5", "#e0b34c", "#2f7f4a", "#f4f1ea"]), { turban: i === 0 ? IN.saffron : undefined }); d.userData.sit?.(); add(g, d, x - 0.4 + i * 0.8, 0.06, 2.6).rotation.y = Math.PI; diners.push(d); }
    add(g, cyl(0.16, 0.14, 0.05, "#8c9096", 8), x, 0.5, 2.15); add(g, ball(0.1, "#e07a2a", 6), x, 0.54, 2.15).scale.y = 0.5; add(g, cyl(0.06, 0.05, 0.16, "#f4f1ea", 6), x + 0.4, 0.55, 2.15);   // steel thali, curry, a glass of lassi
  }
  // the painted truck
  const truck = new THREE.Group(); truck.position.set(4.6, 0, -0.4); truck.rotation.y = 0.25; g.add(truck);
  add(truck, box(2.6, 1.5, 1.3, "#2f7f4a"), 0.4, 1.15, 0); add(truck, box(1.1, 1.2, 1.3, "#e0b34c"), -1.5, 1.0, 0); add(truck, box(0.9, 0.5, 1.2, "#6fb3c9"), -1.5, 1.35, 0); add(truck, box(2.7, 0.12, 1.4, "#c0392b"), 0.4, 1.95, 0); for (let k = 0; k < 6; k++) add(truck, box(0.3, 0.3, 0.04, ["#e8558a", "#f2c14e", "#6fb3c9"][k % 3]), -0.6 + k * 0.4, 1.0, 0.67); add(truck, box(2.6, 0.3, 0.04, "#f2c14e"), 0.4, 1.6, 0.67);
  for (const x of [-1.3, 1.2]) for (const z of [-0.6, 0.6]) add(truck, cyl(0.28, 0.28, 0.2, "#2a2a2e", 10), x, 0.3, z).rotation.x = Math.PI / 2;
  for (let k = 0; k < 5; k++) add(truck, ball(0.05, ["#c0392b", "#f2c14e", "#2f7f4a", "#e8558a", "#6fb3c9"][k], 4), -2.1, 1.1 + k * 0.12, -0.5 + k * 0.25);   // tassels
  add(truck, box(1.1, 0.16, 0.04, "#f4f1ea"), 1.4, 1.75, 0.68);
  const driver = indian("#f4f1ea", { turban: IN.saffron }); driver.userData.sit?.(); add(truck, driver, -1.5, 0.75, 0.3).scale.setScalar(0.8);
  g.userData.steam = new THREE.Vector3(-1.4, 1.5, 0.8);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "खाना तैयार! Food's ready!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); ladle.rotation.y = t * (0.5 + k * 7); ladle.position.x = -1.2 + Math.cos(t * (0.5 + k * 7)) * 0.15; ladle.position.z = 0.9 + Math.sin(t * (0.5 + k * 7)) * 0.15; karahi.rotation.z = k * Math.sin(t * 6) * 0.15; diners.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); truck.position.y = k * Math.abs(Math.sin(t * 10)) * 0.08; if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** Wheat with yellow mustard in bloom, a woman rolling rotis on a board, sheaves. */
export function wheatMustard(): P {
  const g = group();
  add(g, box(7, 0.2, 4.4, "#8a6a3a"), 0, 0.1, 0);
  const stalks: THREE.Group[] = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 12; c++) { const st = new THREE.Group(); st.position.set(-3.2 + c * 0.58, 0.2, -1.8 + r * 0.9); g.add(st); stalks.push(st); if (r < 3) { add(st, cyl(0.02, 0.02, 0.7, "#c9b45a", 3), 0, 0.35, 0); add(st, ball(0.06, "#e0c46a", 5), 0, 0.75, 0).scale.set(0.6, 1.6, 0.6); } else { add(st, cyl(0.02, 0.02, 0.8, "#7fbf5a", 3), 0, 0.4, 0); for (let k = 0; k < 3; k++) add(st, ball(0.05, "#f2d13a", 4), (k - 1) * 0.08, 0.72 + (k % 2) * 0.1, 0); } }
  for (let i = 0; i < 3; i++) add(g, cyl(0.08, 0.2, 0.7, "#c9b45a", 7), 3.9 + (i % 2) * 0.4, 0.35, -1.4 + i * 0.45);
  add(g, box(0.8, 0.1, 0.6, IN.wood), 4.2, 0.18, 0.8); add(g, cyl(0.16, 0.16, 0.02, "#f2dca0", 10), 4.2, 0.24, 0.8); add(g, cyl(0.03, 0.03, 0.5, "#c9a37a", 6), 4.2, 0.28, 0.9).rotation.z = Math.PI / 2;
  const cook = indian("#e8558a", { sari: "#2f7f4a" }); cook.userData.sit?.(); add(g, cook, 4.2, -0.3, 1.5); cook.rotation.y = Math.PI;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "गेहूँ और रोटी! Wheat and roti!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); stalks.forEach((s) => { s.rotation.z = Math.sin(t * 1.4 + s.position.x) * 0.06 + k * Math.sin((1 - k) * 9 - s.position.x * 1.2) * 0.4; }); if (cook.userData.upper) cook.userData.upper.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 10)) * 0.15; };
  return g;
}

/** Dairy: a buffalo and a cow, a milk churn, paneer pressed under a stone, ghee in tins, a lassi stand. */
export function dairyIn(): P {
  const g = group();
  const cw = cow(false, false, "हम्बा! Moo!"); cw.position.set(-2.2, 0, -0.6); cw.rotation.y = 0.6; g.add(cw);
  const buff = cow(true, false, "हम्बा! Moo!"); buff.position.set(0.4, 0, -1.0); buff.rotation.y = -0.4; g.add(buff);
  for (const [x, z, rot, len] of [[-1, -2.4, 0, 6], [-1, 1.0, 0, 6], [-4, -0.7, Math.PI / 2, 3.4], [2, -0.7, Math.PI / 2, 3.4]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.1); for (let i = 0; i <= n; i++) add(f, box(0.09, 0.7, 0.09, IN.wood), -len / 2 + (i / n) * len, 0.35, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.55, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.3, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  const churn = add(g, cyl(0.24, 0.2, 0.7, "#8c9096", 10), 3.2, 0.35, -1.6); void churn; const rod = add(g, cyl(0.02, 0.02, 0.9, IN.wood, 4), 3.2, 0.9, -1.6);
  add(g, box(0.6, 0.2, 0.6, "#f4f1ea"), 3.2, 0.1, -0.4); add(g, box(0.5, 0.25, 0.5, "#8f857a"), 3.2, 0.32, -0.4);   // paneer under its stone
  for (let i = 0; i < 2; i++) { add(g, cyl(0.16, 0.16, 0.3, "#e0b34c", 8), 4.0, 0.15, -1.4 + i * 0.5); add(g, cyl(0.17, 0.17, 0.03, "#8c9096", 8), 4.0, 0.31, -1.4 + i * 0.5); }
  add(g, box(1.6, 0.8, 0.7, IN.wood), 3.6, 0.4, 1.6); for (let i = 0; i < 4; i++) { add(g, cyl(0.07, 0.06, 0.2, "#f4f1ea", 6), 3.1 + i * 0.35, 0.9, 1.6); add(g, ball(0.06, "#f7f4ee", 5), 3.1 + i * 0.35, 1.02, 1.6); }
  const seller = indian("#2f7f4a", { turban: IN.pink, apron: true }); add(g, seller, 3.6, 0, 0.8); seller.rotation.y = Math.PI;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(seller, "लस्सी! Lassi!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); rod.position.y = 0.9 + Math.sin(t * (2 + k * 10)) * 0.12; rod.rotation.y = t * (1 + k * 8); tickChildren(g)(t, dt); };
  return g;
}

export function chickenIn(): P { return chicken(C.white, "कुक-कुक! Cluck!"); }

// ---------- Rajasthan ----------

/** Lentils drying on a cloth, sacks of dal, and a woman winnowing. */
export function lentilField(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#c9a86a"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) { const pl = new THREE.Group(); pl.position.set(-2.6 + j * 0.72, 0.2, -1.4 + i * 0.9); g.add(pl); plants.push(pl); add(pl, ball(0.18, "#8fb06a", 6), 0, 0.2, 0).scale.set(0.9, 1.1, 0.9); for (let k = 0; k < 3; k++) add(pl, ball(0.03, "#d9a441", 4), Math.cos(k * 2.1) * 0.14, 0.2 + k * 0.08, Math.sin(k * 2.1) * 0.14); }
  add(g, box(1.4, 0.03, 1.0, "#f4f1ea"), 3.6, 0.03, -0.8); for (let k = 0; k < 30; k++) add(g, ball(0.03, k % 3 ? "#e07a3a" : "#e0b34c", 4), 3.0 + (k % 6) * 0.22, 0.06, -1.2 + Math.floor(k / 6) * 0.2);   // red and yellow dal drying
  for (let i = 0; i < 3; i++) { const sack = add(g, cyl(0.28, 0.24, 0.4, "#e9d7a8", 9), 3.2 + i * 0.6, 0.2, 1.2); add(sack, cyl(0.22, 0.22, 0.05, ["#e07a3a", "#e0b34c", "#8fb06a"][i], 9), 0, 0.22, 0); }
  const woman = indian("#e0b34c", { sari: "#c0392b" }); add(g, woman, 3.6, 0, 0.3); woman.rotation.y = -1.6;
  const tray = add(woman, cyl(0.3, 0.3, 0.03, "#c9a86a", 12), 0, 0.9, 0.35); tray.rotation.x = 0.3;
  const grains: THREE.Mesh[] = []; for (let k = 0; k < 8; k++) { const gr = ball(0.025, "#e07a3a", 4); gr.visible = false; g.add(gr); grains.push(gr); }
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(woman, "दाल! Dal!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.6) * 1.2)) * 0.5; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); tray.rotation.z = k * Math.sin(t * 9) * 0.25; grains.forEach((gr, i) => { const a = (t * 2 + i * 0.8) % 2; gr.visible = k > 0.1; gr.position.set(3.6 + Math.sin(i) * 0.2, 1.2 + Math.sin(a * Math.PI) * 0.6 * k, 0.65 + (i - 4) * 0.05); }); };
  return g;
}

/** Red chillies drying on the roof and the ground, garlands hanging, a spice grinder. */
export function chilliYard(): P {
  const g = group();
  add(g, box(3.2, 2.0, 2.6, IN.sandstone), -1.4, 1.0, -1.2); add(g, box(3.4, 0.15, 2.8, "#a85a3a"), -1.4, 2.05, -1.2);
  const chillies: THREE.Mesh[] = [];
  for (let i = 0; i < 40; i++) { const c = add(g, cone(0.04, 0.24, i % 4 ? "#c9302a" : "#8e2a22", 5), -2.8 + (i % 10) * 0.31, 2.16, -2.3 + Math.floor(i / 10) * 0.6); c.rotation.z = Math.PI / 2; c.rotation.y = rnd() * 3; chillies.push(c); }
  for (let m = 0; m < 2; m++) { add(g, box(2.4, 0.05, 1.5, C.straw), 1.4 + m * 0.2, 0.03, -1.0 + m * 2.0); for (let i = 0; i < 26; i++) { const c = add(g, cone(0.045, 0.24, "#d3342b", 5), 1.4 + m * 0.2 + (rnd() - 0.5) * 2.1, 0.09, -1.0 + m * 2.0 + (rnd() - 0.5) * 1.3); c.rotation.z = Math.PI / 2; c.rotation.y = rnd() * 3; chillies.push(c); } }
  for (let k = 0; k < 2; k++) { for (let j = 0; j < 7; j++) add(g, cone(0.05, 0.26, "#c9302a", 5), -2.6 + k * 2.2, 1.7 - j * 0.15, 0.15).rotation.z = Math.PI; }
  add(g, cyl(0.3, 0.3, 0.2, "#8f857a", 10), -1.0, 0.1, 1.2); add(g, cyl(0.06, 0.06, 0.6, IN.wood, 5), -0.9, 0.5, 1.2).rotation.z = 0.4; add(g, cyl(0.25, 0.25, 0.04, "#c9302a", 10), -1.0, 0.22, 1.2);
  const woman = indian("#e0b34c", { sari: "#e8558a" }); add(g, woman, -0.2, 0, 1.9); woman.rotation.y = Math.PI + 0.4;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(woman, "मिर्च! Chillies!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); chillies.forEach((c, i) => { c.position.y = (i < 40 ? 2.16 : 0.09) + k * Math.max(0, Math.sin(t * 11 + i)) * 0.4; c.rotation.y += k * dt * 6; }); if (woman.userData.upper) woman.userData.upper.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 9)) * 0.25; };
  return g;
}

/** A thali house: steel platters with dal, sabzi, rice, roti, pickle and a sweet, diners cross-legged, a ghee pourer. */
export function thaliHouse(): P {
  const g = group();
  add(g, box(4.4, 2.4, 3.0, IN.sandstone), 0, 1.2, -1.4); add(g, box(4.6, 0.2, 3.2, "#a85a3a"), 0, 2.5, -1.4);
  for (let k = 0; k < 5; k++) add(g, box(0.35, 0.35, 0.05, "#e0b34c"), -1.6 + k * 0.8, 2.35, 0.13); for (let k = 0; k < 3; k++) { add(g, box(0.5, 0.8, 0.06, "#4a3a2a"), -1.4 + k * 1.4, 1.3, 0.13); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 10, 1, false, 0, Math.PI), mat("#4a3a2a")), -1.4 + k * 1.4, 1.7, 0.13).rotation.set(Math.PI / 2, 0, Math.PI / 2); }
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(2.0, 0.3, 0.02, IN.pink), 0, 2.15, 0.24);
  add(g, box(5, 0.08, 3.2, "#c0392b"), 0, 0.04, 1.6);
  const thalis: THREE.Group[] = [];
  const diners: Fig[] = [];
  for (let i = 0; i < 4; i++) {
    const x = -1.5 + i * 1.0;
    const th = new THREE.Group(); th.position.set(x, 0.1, 1.0); g.add(th); thalis.push(th);
    add(th, cyl(0.36, 0.34, 0.04, "#c9cfd6", 14), 0, 0, 0); const cols = ["#e0b34c", "#3f7a3a", "#f7f2e6", "#c9573a", "#e07a3a", "#f2c14e"]; cols.forEach((c, k) => { const a = (k / 6) * Math.PI * 2; add(th, cyl(0.08, 0.07, 0.05, "#c9cfd6", 8), Math.cos(a) * 0.24, 0.04, Math.sin(a) * 0.24); add(th, ball(0.06, c, 5), Math.cos(a) * 0.24, 0.08, Math.sin(a) * 0.24).scale.y = 0.6; }); add(th, cyl(0.14, 0.14, 0.02, "#f2dca0", 10), 0, 0.04, 0);
    const d = indian(pick(["#f4f1ea", "#3f6fb5", "#e0b34c", "#2f7f4a"]), { turban: i % 2 ? IN.saffron : undefined, sari: i % 2 ? undefined : "#9b59b6" }); d.userData.sit?.(); add(g, d, x, -0.3, 1.9).rotation.y = Math.PI; diners.push(d);
  }
  const server = indian("#f4f1ea", { turban: IN.pink, apron: true }); add(g, server, 2.6, 0, 1.2); server.rotation.y = -1.4; add(server, cyl(0.06, 0.05, 0.14, "#8c9096", 6), 0.25, 0.95, 0.2);
  add(g, cyl(0.3, 0.26, 0.4, "#8c9096", 10), -2.6, 0.2, 0.6); add(g, cyl(0.28, 0.28, 0.04, "#e0b34c", 10), -2.6, 0.42, 0.6);   // the dal pot
  g.userData.steam = new THREE.Vector3(-2.6, 0.8, 0.6);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(server, "और लीजिए! Have some more!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); thalis.forEach((th, i) => { th.position.y = 0.1 + k * Math.max(0, Math.sin(t * 10 + i * 1.3)) * 0.3; th.rotation.y += k * dt * 4; }); diners.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = 0.15 + k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.z = Math.sin(t * 0.8 + i) * 0.06; } }); if (server.userData.upper) server.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

export function camelCart(): P {
  const g = group();
  const camels: P[] = [];
  for (let i = 0; i < 2; i++) {
    const c = group();
    add(c, box(1.6, 0.7, 0.6, "#c9a86a"), 0, 1.25, 0); add(c, ball(0.42, "#c9a86a", 8), 0, 1.7, 0).scale.set(1, 0.9, 0.8);
    const neck = add(c, box(0.28, 1.0, 0.3, "#c9a86a"), 0.85, 1.75, 0); neck.rotation.z = -0.35; add(c, box(0.5, 0.28, 0.26, "#c9a86a"), 1.1, 2.3, 0);
    for (const x of [-0.55, 0.55]) for (const z of [-0.18, 0.18]) add(c, box(0.14, 0.95, 0.14, "#c9a86a"), x, 0.48, z);
    add(c, box(0.7, 0.12, 0.7, "#c0392b"), 0, 1.98, 0); add(c, box(0.5, 0.1, 0.5, "#e0b34c"), 0, 2.06, 0); for (let k = 0; k < 6; k++) add(c, ball(0.04, ["#e8558a", "#f2c14e", "#6fb3c9"][k % 3], 4), 0.9 + (k % 3) * 0.05, 2.1 - k * 0.12, (k % 2 - 0.5) * 0.3);   // tassels on the harness
    c.position.set(-1.5 + i * 3.0, 0, 0); g.add(c); camels.push(c);
  }
  const rider = indian("#f4f1ea", { turban: IN.saffron }); rider.userData.sit?.(); add(camels[0], rider, 0.1, 2.05, 0); rider.scale.setScalar(0.85);
  // the cart the second camel pulls
  add(g, box(1.6, 0.1, 1.2, IN.wood), 3.6, 0.7, 0); for (const z of [-0.65, 0.65]) add(g, cyl(0.4, 0.4, 0.08, IN.wood, 10), 3.6, 0.4, z).rotation.x = Math.PI / 2; add(g, cyl(0.02, 0.02, 1.6, IN.wood, 3), 2.6, 0.7, 0).rotation.z = Math.PI / 2;
  for (let k = 0; k < 4; k++) add(g, cyl(0.22, 0.2, 0.3, "#e9d7a8", 8), 3.3 + (k % 2) * 0.6, 0.9, -0.3 + Math.floor(k / 2) * 0.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(camels[0], "चलो! Chalo!", 3.0, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); camels.forEach((c, i) => { c.position.y = Math.abs(Math.sin(t * 1.4 + i)) * 0.03 + k * Math.abs(Math.sin(t * 8 + i)) * 0.3; c.rotation.z = Math.sin(t * 1.4 + i) * 0.015; }); };
  return g;
}

export function dune(w = 6, h = 0.5, d = 4): P {
  const g = group();
  const m = add(g, ball(1, "#e9d3a0", 14), 0, -h * 0.15, 0); m.scale.set(w / 2, h, d / 2);
  return g;
}

// ---------- Mumbai ----------

/** Crawford market: stalls of vegetables and mushrooms, onion-garlic-ginger-tomato, spices, mangoes and mithai, a chai wallah. */
export function bazaarIn(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(15, 9), mat("#c9bda3")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (const x of [-7, -2.3, 2.3, 7]) for (const z of [-4, 4]) add(g, box(0.4, 3.4, 0.4, "#8a5a3a"), x, 1.7, z);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.06, 9.5), mat("#c9a86a", { transparent: true, opacity: 0.35 })), 0, 3.5, 0).renderOrder = 3;
  for (let i = 0; i < 4; i++) add(g, box(15.5, 0.12, 0.12, "#8a5a3a"), 0, 3.44, -4.5 + i * 3);
  const vendors: Fig[] = [];
  const stall = (kind: string) => {
    const s = group();
    add(s, box(2.6, 0.8, 1.2, IN.wood), 0, 0.45, 0); add(s, box(2.6, 0.06, 1.2, "#5a3d28"), 0, 0.88, 0);
    for (const x of [-1.2, 1.2]) add(s, cyl(0.04, 0.04, 2.3, "#5a3d28", 5), x, 1.15, -0.5);
    add(s, box(2.6, 0.06, 1.4, pick([IN.saffron, IN.green, IN.pink, IN.blue])), 0, 2.3, 0.1).rotation.x = 0.15;
    const goods = new THREE.Group(); goods.position.y = 0.92; s.add(goods);
    switch (kind) {
      case "veg": for (let i = 0; i < 4; i++) { const b = add(goods, cyl(0.28, 0.22, 0.24, C.straw, 9), -0.95 + i * 0.63, 0.12, 0); const col = ["#3f7a3a", "#f4f1ea", "#9b59b6", "#e0a52c"][i]; for (let k = 0; k < 6; k++) add(b, i === 1 ? cyl(0.06, 0.03, 0.12, "#e9d7a8", 6) : ball(0.08, col, 6), (rnd() - 0.5) * 0.35, 0.18, (rnd() - 0.5) * 0.35); } break;   // spinach, mushrooms, aubergine, potato
      case "aromatics": for (let i = 0; i < 4; i++) { const b = add(goods, cyl(0.28, 0.22, 0.24, C.straw, 9), -0.95 + i * 0.63, 0.12, 0); const col = ["#c9302a", "#9b59b6", "#f1e9dc", "#d9b27a"][i]; for (let k = 0; k < 6; k++) add(b, i === 3 ? box(0.14, 0.07, 0.09, col) : ball(0.08, col, 6), (rnd() - 0.5) * 0.35, 0.18, (rnd() - 0.5) * 0.35); } break;   // tomato, red onion, garlic, ginger
      case "spices": for (let i = 0; i < 6; i++) { add(goods, cyl(0.2, 0.22, 0.14, "#8a6a3a", 9), -1.0 + (i % 3) * 0.8, 0.07, -0.25 + Math.floor(i / 3) * 0.5); add(goods, cone(0.18, 0.36, ["#e0a52c", "#c9302a", "#8e2a22", "#6f9b57", "#c9a86a", "#3a2a1a"][i], 9), -1.0 + (i % 3) * 0.8, 0.3, -0.25 + Math.floor(i / 3) * 0.5); } break;
      case "mangoes": for (let i = 0; i < 3; i++) { add(goods, box(0.7, 0.2, 0.5, "#a37a4f"), -0.8 + i * 0.8, 0.1, 0); for (let k = 0; k < 6; k++) add(goods, ball(0.09, i === 2 ? "#e8558a" : "#f2b64d", 6), -0.8 + i * 0.8 - 0.2 + (k % 3) * 0.2, 0.25, -0.12 + Math.floor(k / 3) * 0.24).scale.set(1.2, 0.9, 0.8); } for (let k = 0; k < 6; k++) add(goods, box(0.16, 0.1, 0.16, k % 2 ? "#e0a52c" : "#f4f1ea"), 0.9 + (k % 3) * 0.18, 0.05, -0.4 + Math.floor(k / 3) * 0.2); break;   // mangoes, jalebi and barfi
    }
    const v = indian(pick(["#3f6fb5", "#c0392b", "#f4f1ea", "#2f7f4a"]), { apron: true, cap: kind === "spices", sari: kind === "veg" ? "#9b59b6" : undefined }); add(s, v, 0.3, 0, -0.95); vendors.push(v);
    return s;
  };
  const layout: [string, number, number, number][] = [["veg", -5, -2.4, 0], ["aromatics", 0, -2.4, 0], ["spices", 5, -2.4, 0], ["mangoes", -3, 2.4, Math.PI]];
  for (const [k, x, z, rot] of layout) { const s = stall(k); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  // the chai wallah
  add(g, box(1.2, 0.8, 0.7, IN.wood), 3.5, 0.4, 2.6); add(g, cyl(0.2, 0.18, 0.3, "#8c9096", 8), 3.2, 0.95, 2.6); add(g, ball(0.08, "#f08a2a", 5), 3.2, 0.78, 2.9); for (let k = 0; k < 4; k++) add(g, cyl(0.04, 0.035, 0.1, "#c9a86a", 6), 3.7 + (k % 2) * 0.15, 0.85, 2.45 + Math.floor(k / 2) * 0.2);
  const chai = indian("#e0b34c", { cap: true, apron: true }); add(g, chai, 3.5, 0, 3.4); chai.rotation.y = Math.PI; vendors.push(chai);
  const pour = add(g, cyl(0.012, 0.012, 0.5, "#c9a86a", 4), 3.35, 1.1, 2.6); pour.visible = false;
  const spots = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(6, 0, 0.3), new THREE.Vector3(-3, 0, -0.3)];
  type Shopper = { p: Fig; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [0, 1, 2].map((i) => { const p = indian(pick(["#c0392b", "#f2c14e", "#3f6fb5", "#f4f1ea"]), { sari: i === 0 ? "#e8558a" : i === 2 ? "#2a8f8f" : undefined, cap: i === 1 }); const st = spots[i].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i + 2) % spots.length].clone(), wait: i * 0.8, speed: 0.7 + rnd() * 0.4 }; });
  g.userData.steam = new THREE.Vector3(3.2, 1.3, 2.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(chai, "चाय! Chai, garam chai!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    vendors.forEach((v, i) => { if (v.userData.upper) v.userData.upper.rotation.z = k * Math.sin(t * 8 + i) * 0.35; v.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.2; });
    pour.visible = k > 0.2; pour.scale.y = 0.2 + k * 1.6; pour.position.y = 0.9 + k * 0.4;
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

/** Chowpatty: a pav bhaji griddle, bhel puri, a cutting-chai stand, kulfi, an auto-rickshaw, people at the sea wall. */
export function chowpatty(): P {
  const g = group();
  add(g, box(2.6, 0.8, 1.0, "#8c9096"), -1.4, 0.4, 0); add(g, cyl(0.6, 0.6, 0.06, "#3a3a3d", 16), -1.8, 0.83, 0); add(g, cyl(0.5, 0.5, 0.05, "#c9573a", 16), -1.8, 0.88, 0); add(g, box(0.4, 0.06, 0.06, "#e0b34c"), -1.8, 0.93, 0.15);
  for (let k = 0; k < 4; k++) add(g, box(0.18, 0.1, 0.14, "#f2dca0"), -0.6 + (k % 2) * 0.22, 0.9, -0.2 + Math.floor(k / 2) * 0.3);   // pav
  for (const x of [-2.4, -1.4]) add(g, cyl(0.04, 0.04, 2.2, "#8c9096", 5), x, 1.1, -0.5); add(g, box(2.8, 0.06, 1.6, IN.saffron), -1.4, 2.2, 0.1).rotation.x = 0.12;
  const cook = indian("#f4f1ea", { cap: true, apron: true }); add(g, cook, -1.8, 0, -0.9); const spat = add(g, box(0.04, 0.02, 0.4, "#8c9096"), -1.7, 0.95, -0.2);
  add(g, box(1.2, 0.8, 0.7, IN.wood), 1.4, 0.4, 0); add(g, cyl(0.3, 0.26, 0.1, "#c9a86a", 12), 1.4, 0.85, 0); for (let k = 0; k < 8; k++) add(g, ball(0.035, k % 2 ? "#e07a3a" : "#f2dca0", 4), 1.4 + (rnd() - 0.5) * 0.4, 0.92, (rnd() - 0.5) * 0.4);   // bhel puri
  for (let k = 0; k < 3; k++) { add(g, cyl(0.08, 0.06, 0.16, "#f4f1ea", 6), 0.9 + k * 0.28, 0.88, 0.25); add(g, cone(0.06, 0.2, ["#e8558a", "#f2c14e", "#6fb06a"][k], 6), 0.9 + k * 0.28, 1.06, 0.25); }   // kulfi
  const seller = indian("#c0392b", { apron: true }); add(g, seller, 1.4, 0, -0.9);
  // the auto-rickshaw
  const auto = new THREE.Group(); auto.position.set(3.6, 0, 0.6); auto.rotation.y = -0.5; g.add(auto);
  add(auto, box(1.2, 0.7, 0.9, "#2a2a2e"), 0, 0.55, 0); add(auto, box(1.2, 0.5, 0.92, "#f2c14e"), 0, 1.15, 0); add(auto, box(0.5, 0.5, 0.94, "#6fb3c9"), 0.4, 1.15, 0); add(auto, box(1.3, 0.06, 1.0, "#2a2a2e"), 0, 1.45, 0);
  add(auto, cyl(0.2, 0.2, 0.14, "#2a2a2e", 8), 0.65, 0.2, 0).rotation.x = Math.PI / 2; for (const z of [-0.5, 0.5]) add(auto, cyl(0.2, 0.2, 0.14, "#2a2a2e", 8), -0.4, 0.2, z).rotation.x = Math.PI / 2;
  const drv = indian("#f4f1ea", { cap: true }); drv.userData.sit?.(); add(auto, drv, 0.25, 0.5, 0).scale.setScalar(0.75);
  const eaters: Fig[] = [];
  for (let i = 0; i < 3; i++) { const e = indian(pick(["#3f6fb5", "#e0b34c", "#2f7f4a", "#e8558a"]), { sari: i === 1 ? "#2a8f8f" : undefined }); add(g, e, -2.8 + i * 1.0, 0, 1.6).rotation.y = Math.PI; add(e, cyl(0.1, 0.08, 0.04, "#c9a86a", 8), 0.2, 0.9, 0.22); eaters.push(e); }
  g.userData.steam = new THREE.Vector3(-1.8, 1.2, 0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "पाव भाजी! Pav bhaji!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); spat.position.x = -1.7 + Math.cos(t * (1 + k * 8)) * 0.2; spat.position.z = -0.2 + Math.sin(t * (1 + k * 8)) * 0.2; eaters.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); auto.position.y = k * Math.abs(Math.sin(t * 14)) * 0.05; if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** A dabbawala on his bicycle with a crate of tiffins. */
export function dabbaBike(): P {
  const r = group();
  for (const x of [-0.45, 0.45]) add(r, new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 6, 14), mat("#2a2a2e")), x, 0.28, 0);
  add(r, box(0.9, 0.04, 0.04, "#2a2a2e"), 0, 0.5, 0); add(r, box(0.04, 0.5, 0.04, "#2a2a2e"), 0.3, 0.55, 0); add(r, box(0.3, 0.04, 0.04, "#2a2a2e"), 0.4, 0.8, 0).rotation.y = Math.PI / 2;
  add(r, box(0.6, 0.35, 0.5, "#a37a4f"), -0.55, 0.65, 0); for (let k = 0; k < 4; k++) add(r, cyl(0.07, 0.07, 0.16, "#c9cfd6", 8), -0.7 + (k % 2) * 0.3, 0.9, -0.12 + Math.floor(k / 2) * 0.24);
  const p = indian("#f4f1ea", { cap: true }); p.userData.sit?.(); p.scale.setScalar(0.85); p.position.set(-0.05, 0.45, 0); p.rotation.y = Math.PI / 2; r.add(p);
  r.userData.tick = (t) => { r.rotation.z = Math.sin(t * 6) * 0.015; };
  return r;
}

/** The dabbawalas' sorting corner: crates of tiffins on the pavement, a handcart, one man sorting, a parked bicycle. */
export function dabbawalas(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.2), mat("#c9bda3")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 3; i++) { add(g, box(1.0, 0.35, 0.7, "#a37a4f"), -1.4 + i * 1.2, 0.18, 0.6); for (let k = 0; k < 6; k++) add(g, cyl(0.08, 0.08, 0.2, "#c9cfd6", 8), -1.4 + i * 1.2 - 0.3 + (k % 3) * 0.3, 0.45, 0.45 + Math.floor(k / 3) * 0.3); }
  add(g, box(1.6, 0.1, 0.9, IN.wood), 1.2, 0.5, -0.8); for (const z of [-0.45, 0.45]) add(g, cyl(0.3, 0.3, 0.08, "#2a2a2e", 10), 1.2, 0.3, -0.8 + z).rotation.x = Math.PI / 2; for (let k = 0; k < 8; k++) add(g, cyl(0.08, 0.08, 0.2, "#c9cfd6", 8), 0.6 + (k % 4) * 0.35, 0.65, -1.0 + Math.floor(k / 4) * 0.4);   // the handcart
  const sorter = indian("#f4f1ea", { cap: true }); add(g, sorter, -0.3, 0, -0.6); sorter.rotation.y = Math.PI; const tiffin = add(sorter, cyl(0.07, 0.07, 0.18, "#c9cfd6", 8), 0.2, 0.85, 0.25);
  const parked = dabbaBike(); parked.position.set(-1.6, 0, -1.0); parked.rotation.y = 0.4; g.add(parked);
  add(g, cyl(0.04, 0.04, 2.2, "#8c9096", 5), 2.0, 1.1, 0.9); add(g, box(0.9, 0.3, 0.04, "#2f6fb5"), 2.4, 1.9, 0.9); add(g, box(0.8, 0.2, 0.02, "#f4f1ea"), 2.4, 1.9, 0.93);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(sorter, "डब्बा! Lunch is on its way!", 1.6, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); tiffin.position.y = 0.85 + k * Math.abs(Math.sin(t * 8)) * 0.4; if (sorter.userData.upper) sorter.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; parked.userData.tick?.(t, dt); };
  return g;
}

// ---------- Kerala ----------

/** A spice garden: pepper vines on trees, cardamom, turmeric, cinnamon bark, drying mats. */
export function spiceGarden(): P {
  const g = group();
  add(g, box(6.5, 0.2, 4.4, "#6b4a32"), 0, 0.1, 0);
  const vines: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) { add(g, cyl(0.08, 0.1, 2.0, "#6b4a2c", 6), -2.4 + i * 1.6, 1.0, -1.2); const v = new THREE.Group(); v.position.set(-2.4 + i * 1.6, 0.2, -1.2); g.add(v); vines.push(v); for (let k = 0; k < 8; k++) { add(v, ball(0.14, "#3f7a3a", 5), Math.cos(k * 1.3) * 0.22, 0.4 + k * 0.22, Math.sin(k * 1.3) * 0.22).scale.y = 0.6; if (k % 2) for (let j = 0; j < 4; j++) add(v, ball(0.025, "#2a3a2a", 4), Math.cos(k * 1.3) * 0.22, 0.32 + k * 0.22 - j * 0.04, Math.sin(k * 1.3) * 0.22 + 0.12); } }
  for (let i = 0; i < 6; i++) { const pl = new THREE.Group(); pl.position.set(-2.6 + i * 1.0, 0.2, 0.5); g.add(pl); vines.push(pl); for (let k = 0; k < 4; k++) add(pl, box(0.5, 0.02, 0.12, "#6fa84a"), 0.2, 0.3 + k * 0.15, 0).rotation.set(0, k * 1.5, 0.3); add(pl, ball(0.04, "#8fc26a", 4), 0.15, 0.2, 0.1); }
  for (let i = 0; i < 4; i++) { const pl = new THREE.Group(); pl.position.set(-2.4 + i * 1.5, 0.2, 1.6); g.add(pl); vines.push(pl); add(pl, box(0.6, 0.02, 0.2, "#4f9a4a"), 0.25, 0.4, 0).rotation.z = 0.6; add(pl, box(0.6, 0.02, 0.2, "#4f9a4a"), -0.25, 0.4, 0.1).rotation.z = -0.6; add(pl, ball(0.06, IN.turmeric, 5), 0, 0.02, 0.15); }
  add(g, box(1.6, 0.03, 1.0, "#f4f1ea"), 3.8, 0.03, -0.9); for (let k = 0; k < 18; k++) add(g, cyl(0.03, 0.03, 0.4, "#a86a3a", 4), 3.2 + (k % 6) * 0.22, 0.07, -1.2 + Math.floor(k / 6) * 0.25).rotation.x = Math.PI / 2;   // cinnamon quills
  for (let k = 0; k < 24; k++) add(g, ball(0.025, "#2a3a2a", 4), 3.2 + (k % 8) * 0.18, 0.06, 0.3 + Math.floor(k / 8) * 0.18);   // peppercorns drying
  add(g, cyl(0.3, 0.24, 0.24, C.straw, 8), 4.4, 0.12, 1.4); for (let k = 0; k < 8; k++) add(g, ball(0.03, "#8fc26a", 4), 4.4 + (rnd() - 0.5) * 0.3, 0.28, 1.4 + (rnd() - 0.5) * 0.3);
  const picker = indian("#e0b34c", { sari: "#2a8f8f" }); add(g, picker, 3.6, 0, 1.8); picker.rotation.y = Math.PI + 0.6;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(picker, "കുരുമുളക്! Pepper!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); vines.forEach((v, i) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - i * 0.6)) * 0.4; v.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); if (picker.userData.upper) picker.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** Coconut palms, a climber up a trunk, cashews on a tray, a coconut being split. */
export function coconutGrove(): P {
  const g = group();
  const palms: P[] = [];
  for (let i = 0; i < 5; i++) { const p = datePalm(0.9 + (i % 2) * 0.3); const cr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; cr.forEach((d) => { (d.material as THREE.MeshStandardMaterial).color.set("#6fa84a"); d.scale.set(1.4, 1.2, 1.4); }); p.position.set(-3 + i * 1.5, 0, (i % 2) * 1.8 - 0.9); p.rotation.y = i; g.add(p); palms.push(p); }
  const climber = indian("#f4f1ea", { dhoti: true }); climber.rotation.z = -0.3; add(g, climber, -3 + 0.35, 1.6, -0.9); climber.rotation.y = 0.6;
  add(g, box(0.8, 0.5, 0.5, IN.wood), 3.2, 0.25, 0.6); for (let k = 0; k < 4; k++) add(g, ball(0.16, "#8a6a3a", 7), 3.0 + (k % 2) * 0.4, 0.6, 0.45 + Math.floor(k / 2) * 0.3);
  add(g, cyl(0.16, 0.16, 0.14, "#f7f4ee", 8), 3.6, 0.58, 1.0); add(g, box(0.05, 0.02, 0.35, "#8c9096"), 3.4, 0.55, 1.2).rotation.y = 0.5;   // the split coconut and the knife
  add(g, cyl(0.3, 0.3, 0.03, "#c9a86a", 12), 4.0, 0.03, -0.4); for (let k = 0; k < 10; k++) add(g, ball(0.035, "#e9d7a8", 4), 4.0 + (rnd() - 0.5) * 0.4, 0.07, -0.4 + (rnd() - 0.5) * 0.4).scale.set(1, 0.7, 1.6);   // cashews
  const woman = indian("#e0b34c", { sari: "#c0392b" }); add(g, woman, 3.6, 0, 1.8); woman.rotation.y = Math.PI;
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "തേങ്ങ! Coconuts!", 3.6, 1400); for (const p of palms) { const fr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.16, "#6fa84a", 7); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const p of palms) { const c = (p.userData as { crown?: THREE.Group }).crown; if (c) c.rotation.x = Math.sin(t * 24 + p.position.x) * 0.12 * shake; } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.16, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.161) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
    tickChildren(g)(t, dt);
  };
  return g;
}

export function ricePaddyIn(): P {
  const g = group();
  const seedlings: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) { add(g, box(6.5, 0.18, 2.6, "#9ec9b8"), 0, 0.09, -1.5 + i * 3); for (let r = 0; r < 3; r++) for (let c = 0; c < 13; c++) { const sd = add(g, cone(0.09, 0.6, "#7fc85a", 4), -3 + c * 0.5, 0.3, -2.3 + i * 3 + r * 0.7); sd.geometry = sd.geometry.clone(); sd.geometry.translate(0, 0.3, 0); sd.position.y -= 0.3; seedlings.push(sd); } }
  add(g, box(7, 0.2, 0.3, "#a37a4f"), 0, 0.1, 0);
  const farmer = indian("#f4f1ea", { dhoti: true }); add(g, farmer, 3.9, 0, -0.4); wear(farmer, cone(0.36, 0.3, C.straw, 10), 0, 1.3, 0);
  const buff = cow(true, false, "മ്മേ! Moo!"); buff.position.set(-4.0, 0, 1.6); buff.rotation.y = 1.2; buff.scale.setScalar(0.9); g.add(buff);
  const egret = group(); add(egret, ball(0.1, "#f4f1ea", 6), 0, 0.5, 0).scale.set(1.4, 0.8, 1); add(egret, cyl(0.02, 0.02, 0.4, "#f4f1ea", 4), 0.12, 0.72, 0).rotation.z = -0.3; add(egret, ball(0.05, "#f4f1ea", 5), 0.22, 0.9, 0); add(egret, cone(0.015, 0.14, "#e0b34c", 4), 0.32, 0.9, 0).rotation.z = -1.5; add(egret, cyl(0.01, 0.01, 0.4, "#2a2a2e", 3), 0, 0.2, 0); add(g, egret, 1.5, 0.15, 1.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "അരി! Rice!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); seedlings.forEach((sd) => { sd.rotation.z = Math.sin(t * 1.5 + sd.position.x * 0.8) * 0.08 + k * Math.sin((1 - k) * 10 - sd.position.x * 1.5) * 0.5; }); egret.position.y = 0.15 + k * Math.abs(Math.sin(t * 5)) * 1.2; if (farmer.userData.upper) farmer.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; tickChildren(g)(t, dt); };
  return g;
}

/** A Kerala kitchen: dosas on a tawa, sambar and coconut chutney, a stone grinder, curry leaves, a banana-leaf sadya. */
export function keralaKitchen(): P {
  const g = group();
  add(g, box(4.4, 2.2, 3.0, IN.laterite), 0, 1.1, -1.4);
  for (const sd of [-1, 1]) { const r = add(g, box(4.9, 0.12, 1.9, "#8a4a2a"), 0, 2.5, -1.4 + sd * 0.8); r.rotation.x = -sd * 0.4; } add(g, box(4.8, 0.06, 0.24, "#6a3a1a"), 0, 2.85, -1.4);
  for (let k = 0; k < 3; k++) add(g, box(0.5, 0.7, 0.06, "#4a3a2a"), -1.4 + k * 1.4, 1.3, 0.13);
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.2); add(g, box(2.0, 0.3, 0.02, IN.teal), 0, 2.15, 0.24);
  add(g, box(3.2, 0.85, 1.0, "#8f857a"), -0.6, 0.42, 1.2);
  add(g, cyl(0.55, 0.55, 0.05, "#3a3a3d", 16), -1.4, 0.87, 1.2); const dosa = add(g, cyl(0.45, 0.45, 0.02, "#e0b34c", 16), -1.4, 0.91, 1.2);
  const ladle = add(g, cyl(0.03, 0.03, 0.5, "#8c9096", 4), -1.2, 1.1, 1.3); ladle.rotation.z = 0.6;
  add(g, cyl(0.2, 0.16, 0.3, "#8c9096", 10), 0.2, 1.0, 1.2); add(g, cyl(0.18, 0.18, 0.04, "#e07a3a", 10), 0.2, 1.16, 1.2);   // sambar
  add(g, cyl(0.14, 0.12, 0.08, "#f4f1ea", 8), 0.7, 0.9, 1.35); add(g, ball(0.1, "#f7f4ee", 6), 0.7, 0.96, 1.35).scale.y = 0.5;   // coconut chutney
  add(g, box(0.5, 0.16, 0.36, "#3a3a3d"), 1.2, 0.94, 1.1).rotation.x = 0.15; add(g, cyl(0.05, 0.05, 0.4, "#3a3a3d", 6), 1.2, 1.1, 1.1).rotation.z = Math.PI / 2;   // the ammikkallu grinding stone
  for (let k = 0; k < 6; k++) add(g, box(0.1, 0.02, 0.05, "#3f7a3a"), 1.0 + (k % 3) * 0.12, 0.88, 1.5 + Math.floor(k / 3) * 0.1);   // curry leaves
  for (let k = 0; k < 3; k++) add(g, ball(0.12, "#8a6a3a", 7), -2.4 + k * 0.28, 0.9, 1.0 + (k % 2) * 0.3);   // coconuts
  const cook = indian("#f4f1ea", { dhoti: true, apron: true }); add(g, cook, -1.4, 0, 2.0); cook.rotation.y = Math.PI;
  const diners: Fig[] = [];
  for (let i = 0; i < 3; i++) { const leaf = add(g, box(0.7, 0.02, 0.4, "#4f9a4a"), 0.2 + i * 1.0, 0.06, 2.6); void leaf; const cols = ["#f7f2e6", "#e07a3a", "#e0b34c", "#3f7a3a", "#f2c14e"]; cols.forEach((c, k) => add(g, ball(0.05, c, 5), 0.2 + i * 1.0 - 0.25 + k * 0.12, 0.1, 2.6 + (k % 2) * 0.1).scale.y = 0.6); const d = indian(pick(["#3f6fb5", "#e0b34c", "#2f7f4a"]), { sari: i === 1 ? "#e8558a" : undefined, dhoti: i !== 1 }); d.userData.sit?.(); add(g, d, 0.2 + i * 1.0, -0.3, 3.3).rotation.y = Math.PI; diners.push(d); }
  g.userData.steam = new THREE.Vector3(-1.4, 1.3, 1.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "ദോശ! Dosa!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); dosa.scale.setScalar(0.6 + k * Math.abs(Math.sin(t * 5)) * 0.5 + (1 - k) * 0.4); dosa.position.y = 0.91 + k * Math.max(0, Math.sin(t * 8)) * 0.3; ladle.rotation.y = t * (0.6 + k * 8); diners.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.15 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + k * Math.sin(t * 8) * 0.15; };
  return g;
}

/** Kochi's Chinese fishing nets: an A-frame with a long lever, the net hung from its far end on ropes, stones on the tail; they dip when clicked. */
export function fishingNets(): P {
  const g = group();
  add(g, box(9, 0.4, 2.0, "#8a7a5a"), 0, 0.2, 1.4);
  const nets: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const base = new THREE.Group(); base.position.set(-3 + i * 3, 0.4, 1.0); g.add(base);
    for (const x of [-0.7, 0.7]) { const leg = add(base, cyl(0.07, 0.09, 3.4, IN.wood, 5), x, 1.6, 0); leg.rotation.z = -x * 0.3; }   // the A-frame
    add(base, cyl(0.05, 0.05, 1.6, IN.wood, 5), 0, 3.15, 0).rotation.z = Math.PI / 2;
    const arm = new THREE.Group(); arm.position.set(0, 3.2, 0); base.add(arm); nets.push(arm);
    add(arm, cyl(0.07, 0.09, 8, IN.wood, 6), 0, 0, -2.2).rotation.x = Math.PI / 2;   // the lever: long toward the water, short toward the land
    for (let k = 0; k < 5; k++) add(arm, ball(0.18, "#8f857a", 6), (k % 2 - 0.5) * 0.3, -0.3 - (k % 3) * 0.2, 1.4 + k * 0.12);   // counterweight stones on the tail
    const frame = new THREE.Group(); frame.position.set(0, -2.6, -6.0); arm.add(frame);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(arm, cyl(0.015, 0.015, 2.7, "#5a4a3a", 3), sx * 1.4, -1.3, -6.0 + sz * 1.4);   // four ropes from the lever's end
    for (const sx of [-1, 1]) add(frame, cyl(0.04, 0.04, 3.0, IN.wood, 4), sx * 1.4, 0, 0).rotation.x = Math.PI / 2;
    for (const sz of [-1, 1]) add(frame, cyl(0.04, 0.04, 3.0, IN.wood, 4), 0, 0, sz * 1.4).rotation.z = Math.PI / 2;
    add(frame, new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8, 7, 7), new THREE.MeshStandardMaterial({ color: "#c9b45a", wireframe: true })), 0, -0.4, 0).rotation.x = -Math.PI / 2;
  }
  const fishers: Fig[] = [];
  for (let i = 0; i < 2; i++) { const f = indian("#3f6fb5", { dhoti: true }); add(g, f, -2 + i * 3, 0.4, 2.0); f.rotation.y = 0.3; fishers.push(f); }
  add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 3.4, 0.55, 2.0); for (let k = 0; k < 4; k++) add(g, ball(0.06, "#b3bfc9", 5), 3.4 + (k % 2) * 0.2 - 0.1, 0.75, 2.0 + Math.floor(k / 2) * 0.15).scale.set(1.8, 0.5, 1);
  g.userData.hitBox = new THREE.Box3(new THREE.Vector3(-4.8, 0, -0.6), new THREE.Vector3(4.8, 3.6, 2.8));   // click the quay and frames, not the arms reaching over the water and the spice garden
  const re = reaction(0.4);
  g.userData.poke = () => { re.poke(); bubble(fishers[0], "വല! The nets!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); nets.forEach((n, i) => { n.rotation.x = 0.12 + Math.sin(t * 0.5 + i) * 0.02 - k * Math.max(0, Math.sin(k * Math.PI)) * 0.45; }); fishers.forEach((f) => { if (f.userData.upper) f.userData.upper.rotation.x = 0.1 + k * Math.abs(Math.sin(t * 4)) * 0.3; }); };
  return g;
}

/** A temple elephant with painted forehead and a mahout; it lifts its trunk and sprays when clicked. */
export function elephant(): P {
  const g = group();
  add(g, box(2.6, 1.6, 1.4, "#6f6f78"), 0, 1.6, 0); add(g, ball(0.9, "#6f6f78", 9), 0, 2.2, 0).scale.set(1.3, 0.7, 1);
  const head = add(g, ball(0.7, "#6f6f78", 9), 1.5, 1.9, 0);
  for (const z of [-1, 1]) { const ear = add(head, box(0.1, 0.9, 0.7, "#6f6f78"), -0.1, 0, z * 0.7); ear.rotation.y = z * 0.4; }
  add(head, box(0.5, 0.7, 0.5, "#e0b34c"), 0.55, 0.15, 0); for (let k = 0; k < 4; k++) add(head, box(0.5, 0.06, 0.06, ["#c0392b", "#2f7f4a", "#f4f1ea", "#c0392b"][k], ), 0.56, 0.4 - k * 0.16, 0);   // the nettipattam, the golden caparison
  for (const z of [-0.2, 0.2]) add(head, ball(0.06, "#1a1a1e", 4), 0.55, 0.3, z);
  for (const z of [-0.25, 0.25]) add(head, cone(0.06, 0.6, "#f4f1ea", 5), 0.75, -0.2, z).rotation.z = -1.4;
  const trunk = new THREE.Group(); trunk.position.set(0.55, -0.2, 0); head.add(trunk);
  for (let k = 0; k < 5; k++) add(trunk, cyl(0.16 - k * 0.02, 0.18 - k * 0.02, 0.4, "#6f6f78", 8), 0.1 * k, -0.2 - k * 0.38, 0);
  for (const x of [-0.9, 0.9]) for (const z of [-0.45, 0.45]) add(g, cyl(0.26, 0.28, 1.0, "#6f6f78", 8), x, 0.5, z);
  add(g, cyl(0.03, 0.03, 0.8, "#6f6f78", 4), -1.35, 1.4, 0).rotation.z = 0.3;
  add(g, box(1.6, 0.15, 1.5, "#c0392b"), 0, 2.6, 0); add(g, box(1.2, 0.08, 1.2, "#e0b34c"), 0, 2.7, 0);
  const mahout = indian("#f4f1ea", { dhoti: true }); mahout.userData.sit?.(); add(g, mahout, 0.2, 2.65, 0); mahout.scale.setScalar(0.85);
  const spray: THREE.Mesh[] = []; for (let i = 0; i < 6; i++) { const s = ball(0.05, "#8fd0dc", 4); s.visible = false; g.add(s); spray.push(s); }
  const re = reaction(0.45);
  g.userData.poke = () => { re.poke(); bubble(mahout, "ആന! Elephant!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); trunk.rotation.z = -k * Math.max(0, Math.sin(k * Math.PI)) * 1.6 + Math.sin(t * 0.8) * 0.06; head.rotation.y = Math.sin(t * 0.4) * 0.15; g.position.y = k * Math.abs(Math.sin(t * 3)) * 0.05; spray.forEach((s, i) => { const a = (t * 3 + i * 0.5) % 2; s.visible = k > 0.4; s.position.set(2.4 + a * 0.8, 3.4 + Math.sin(a * Math.PI) * 1.2 - a * 0.6, (i - 2.5) * 0.12); }); };
  return g;
}

/** A kettuvallam houseboat: a thatched cabin on a wooden hull. */
export function houseboat(): P {
  const g = group();
  add(g, box(4.2, 0.5, 1.4, "#5a3d28"), 0, 0.25, 0); add(g, box(4.2, 0.08, 1.46, "#c9a37a"), 0, 0.5, 0);
  const cab = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.8, 12, 1, false, 0, Math.PI), mat(C.straw)), -0.3, 0.55, 0); cab.rotation.set(0, 0, Math.PI / 2); cab.scale.set(1, 1, 1.4);
  for (let k = 0; k < 3; k++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.05, 6, 12, Math.PI), mat("#8a6a3a")), -1.4 + k * 1.1, 0.55, 0).rotation.y = Math.PI / 2;
  add(g, box(0.5, 0.5, 0.08, "#4a3a2a"), -1.7, 0.85, 0.7);
  const poler = indian("#f4f1ea", { dhoti: true }); add(g, poler, 1.7, 0.55, 0); poler.rotation.y = -Math.PI / 2; poler.scale.setScalar(0.85); add(g, cyl(0.02, 0.02, 2.4, IN.wood, 4), 1.9, 1.2, 0.3).rotation.z = 0.35;
  for (let i = 0; i < 2; i++) { const p = indian(pick(["#3f6fb5", "#e8558a", "#e0b34c"]), { sari: i ? "#2a8f8f" : undefined }); p.userData.sit?.(); add(g, p, -1.4, 0.55, -0.2 + i * 0.5).rotation.y = i ? 0 : Math.PI; p.scale.setScalar(0.8); }
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 1.1) * 0.02; if (poler.userData.upper) poler.userData.upper.rotation.x = 0.1 + Math.sin(t * 1.6) * 0.2; };
  return g;
}


/** A banana plant: a green stem, long drooping leaves, a hand of bananas. */
export function bananaTree(s = 1): P {
  const g = group();
  add(g, cyl(0.1 * s, 0.14 * s, 1.6 * s, "#8fb06a", 7), 0, 0.8 * s, 0);
  const crown = new THREE.Group(); crown.position.y = 1.6 * s; g.add(crown);
  for (let i = 0; i < 6; i++) {
    // each leaf is two boards: a rising base and a drooping tip, broad and paddle-shaped, with a pale midrib
    const ang = (i / 6) * Math.PI * 2 + 0.3, tilt = 0.5 + (i % 3) * 0.2;
    const base = add(crown, box(0.8 * s, 0.03, 0.62 * s, i % 2 ? "#4f9a4a" : "#5fae52"), 0, 0, 0); base.geometry.translate(0.4 * s, 0, 0); base.rotation.y = ang; base.rotation.z = tilt;
    const tip = new THREE.Group(); tip.position.set(Math.cos(ang) * Math.cos(tilt) * 0.8 * s, Math.sin(tilt) * 0.8 * s, -Math.sin(ang) * Math.cos(tilt) * 0.8 * s); crown.add(tip);
    const tipLeaf = add(tip, box(1.0 * s, 0.03, 0.62 * s, i % 2 ? "#4f9a4a" : "#5fae52"), 0, 0, 0); tipLeaf.geometry.translate(0.5 * s, 0, 0); tipLeaf.rotation.y = ang; tipLeaf.rotation.z = tilt - 1.2;
    add(base, box(0.8 * s, 0.04, 0.06 * s, "#c9e0a0"), 0.4 * s, 0.01, 0); add(tipLeaf, box(1.0 * s, 0.04, 0.06 * s, "#c9e0a0"), 0.5 * s, 0.01, 0);
  }
  const hand = new THREE.Group(); hand.position.set(0.35 * s, -0.25 * s, 0.2 * s); crown.add(hand);
  for (let k = 0; k < 7; k++) { const b = add(hand, cyl(0.04 * s, 0.045 * s, 0.32 * s, "#e0c84a", 5), Math.cos(k * 0.9) * 0.12 * s, -k * 0.06 * s, Math.sin(k * 0.9) * 0.12 * s); b.rotation.z = 0.3; }
  add(hand, ball(0.07 * s, "#8e2a5a", 6), 0, -0.6 * s, 0).scale.y = 1.6;   // the purple flower
  g.userData.tick = (t) => { crown.rotation.y = Math.sin(t * 0.4) * 0.05; crown.rotation.z = Math.sin(t * 0.9) * 0.04; };
  return g;
}

/** A Dravidian gopuram: a stepped tower crowded with painted gods, a gold finial, a sanctum behind. */
export function gopuram(): P {
  const g = group();
  add(g, box(6, 0.5, 4.5, "#c9bda3"), 0, 0.25, 0);
  const tiers = 5;
  for (let i = 0; i < tiers; i++) { const w = 5 - i * 0.7, d = 3.6 - i * 0.5, y = 0.5 + i * 1.3; add(g, box(w, 1.3, d, i % 2 ? "#e9d7a8" : "#f3e9d2"), 0, y + 0.65, 0); for (let k = 0; k < Math.round(w / 0.7); k++) { const c = ["#e8558a", "#2f6fb5", "#f2c14e", "#3f8f5a", "#e07a3a", "#9b59b6"][(k + i) % 6]; add(g, box(0.4, 0.9, 0.2, c), -w / 2 + 0.4 + k * 0.7, y + 0.6, d / 2 + 0.08); add(g, ball(0.12, "#f2c9a4", 5), -w / 2 + 0.4 + k * 0.7, y + 1.15, d / 2 + 0.1); } }
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.2, 10, 1, false, 0, Math.PI), mat("#c0392b")), 0, 7.2, 0).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  for (let k = 0; k < 5; k++) add(g, ball(0.16, IN.gold, 6), -0.9 + k * 0.45, 8.0, 0).scale.set(0.6, 1.6, 0.6);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.2, 10, 1, false, 0, Math.PI), mat("#3a2a1a")), 0, 0.9, 1.9).rotation.set(Math.PI / 2, 0, Math.PI / 2); add(g, box(1.6, 1.2, 0.3, "#3a2a1a"), 0, 0.9, 1.95);
  add(g, box(4, 2.2, 3, "#e9d7a8"), 0, 1.6, -3.5); add(g, cone(1.6, 1.8, "#c0392b", 4), 0, 3.6, -3.5).rotation.y = Math.PI / 4; add(g, cyl(0.04, 0.04, 1.0, IN.gold, 5), 0, 5.0, -3.5);
  add(g, cyl(0.06, 0.06, 4, "#e0b34c", 6), 2.4, 2.5, 2.8); add(g, box(0.5, 0.3, 0.02, IN.saffron), 2.65, 4.3, 2.8);   // the flagstaff
  const garland = new THREE.Group(); g.add(garland); for (let k = 0; k < 12; k++) add(garland, ball(0.07, k % 2 ? IN.saffron : "#f2c14e", 5), -2.4 + k * 0.44, 2.0 - Math.sin((k / 11) * Math.PI) * 0.4, 2.35);
  for (let i = 0; i < 3; i++) { const p = indian(pick(["#f4f1ea", "#e0b34c", "#c0392b"]), { sari: i === 1 ? "#e8558a" : undefined, dhoti: i !== 1 }); add(g, p, -1.2 + i * 1.2, 0.5, 3.2).rotation.y = Math.PI; }
  add(g, box(1.6, 0.03, 1.6, "#f4f1ea"), 0, 0.52, 4.0); for (let k = 0; k < 8; k++) add(g, ball(0.08, ["#e8558a", "#f2c14e", "#3f8f5a", "#2f6fb5"][k % 4], 5), Math.cos(k * 0.785) * 0.5, 0.56, 4.0 + Math.sin(k * 0.785) * 0.5).scale.y = 0.3;   // a kolam on the ground
  g.userData.tick = (t) => { garland.position.y = Math.sin(t * 1.2) * 0.03; };
  return g;
}

/** A ghat: stone steps into the river, a small shikhara shrine, bathers, a boatman, saris drying on a line. */
export function ghat(): P {
  const g = group();
  for (let k = 0; k < 7; k++) add(g, box(7, 0.22, 0.6, k % 2 ? "#d9c9a8" : "#c9b898"), 0, 0.11 + k * 0.2, 1.0 - k * 0.55);
  add(g, box(1.6, 1.8, 1.6, "#e9c46a"), -2.2, 2.4, 1.0); add(g, cone(1.0, 2.2, "#e07a3a", 4), -2.2, 4.4, 1.0).rotation.y = Math.PI / 4; add(g, cyl(0.03, 0.03, 0.8, IN.gold, 5), -2.2, 5.8, 1.0); add(g, box(0.4, 0.28, 0.02, IN.saffron), -2.0, 5.9, 1.0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8, 1, false, 0, Math.PI), mat("#3a2a1a")), -2.2, 2.0, 1.82).rotation.set(Math.PI / 2, 0, Math.PI / 2); add(g, box(0.7, 0.9, 0.3, "#3a2a1a"), -2.2, 1.9, 1.85);
  for (let k = 0; k < 2; k++) { add(g, cyl(0.03, 0.03, 2.2, "#8c9096", 5), 1.6 + k * 1.8, 2.6, 0.6); add(g, cone(0.9, 0.35, k ? "#e8558a" : IN.saffron, 10), 1.6 + k * 1.8, 3.7, 0.6); }
  const bathers: Fig[] = [];
  for (let i = 0; i < 3; i++) { const b = indian(pick(["#f4f1ea", "#e0b34c", "#3f6fb5"]), { dhoti: i !== 1, sari: i === 1 ? "#e8558a" : undefined }); add(g, b, -1.0 + i * 1.2, -0.45, -2.6 + (i % 2) * 0.3); b.rotation.y = i * 0.5; bathers.push(b); }
  const priest = indian(IN.saffron, { dhoti: true }); priest.userData.sit?.(); add(g, priest, 0.4, 0.95, 0.4); priest.rotation.y = Math.PI; add(g, cyl(0.16, 0.14, 0.05, "#e0b34c", 8), 0.4, 1.0, -0.1); for (let k = 0; k < 4; k++) add(g, ball(0.035, IN.saffron, 4), 0.4 + Math.cos(k * 1.6) * 0.08, 1.05, -0.1 + Math.sin(k * 1.6) * 0.08);
  add(g, cyl(0.02, 0.02, 4.2, "#5a3d28", 3), 1.2, 1.9, 2.1).rotation.z = Math.PI / 2; for (let k = 0; k < 5; k++) add(g, box(0.5, 0.8, 0.02, ["#e8558a", "#f2c14e", "#2a8f8f", "#9b59b6", "#f08a2a"][k]), -0.6 + k * 0.85, 1.5, 2.1);   // saris drying
  const boat = new THREE.Group(); boat.position.set(3.2, -0.5, -3.6); g.add(boat); add(boat, box(2.2, 0.35, 0.8, "#6b4a2c"), 0, 0.2, 0); add(boat, box(2.2, 0.06, 0.86, "#a37a4f"), 0, 0.4, 0); const bm = indian("#f4f1ea", { dhoti: true }); add(boat, bm, -0.5, 0.4, 0); bm.scale.setScalar(0.85); add(boat, cyl(0.02, 0.02, 1.8, IN.wood, 4), -0.3, 1.0, 0.3).rotation.z = 0.4;
  const lamps: THREE.Mesh[] = []; for (let k = 0; k < 4; k++) { const l = ball(0.05, "#f2c14e", 4); l.visible = false; g.add(l); lamps.push(l); }
  const re = reaction(0.4);
  g.userData.poke = () => { re.poke(); bubble(priest, "गंगा! The river!", 1.3, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); bathers.forEach((b, i) => { b.position.y = -0.45 + Math.sin(t * 1.5 + i) * 0.04 - k * Math.max(0, Math.sin(t * 3 + i)) * 0.4; }); boat.position.x = 3.2 + Math.sin(t * 0.3) * 0.6; boat.rotation.z = Math.sin(t * 1.1) * 0.03; lamps.forEach((l, i) => { const a = (t * 0.5 + i * 0.6) % 3; l.visible = k > 0.1; l.position.set(1.0 + a * 1.2, -0.42, -2.8 + Math.sin(a) * 0.3); }); };
  return g;
}

/** A string of marigold garlands. */
export function marigoldString(len: number, y = 2.4): P {
  const g = group();
  add(g, cyl(0.012, 0.012, len, "#5a4a3a", 3), 0, y, 0).rotation.z = Math.PI / 2;
  const n = Math.round(len / 0.9);
  for (let i = 0; i < n; i++) { const x = -len / 2 + (i + 0.5) * (len / n); for (let k = 0; k < 4; k++) add(g, ball(0.07, k % 2 ? IN.saffron : "#f2c14e", 5), x, y - 0.12 - k * 0.14, 0); }
  return g;
}

export const INDIA_PROPS: Record<string, () => P> = {
  tandoorHouse, dhaba, wheatMustard, dairyIn, chickenIn, lentilField, chilliYard, thaliHouse, camelCart, bazaarIn, chowpatty, dabbawalas, spiceGarden, coconutGrove, ricePaddyIn, keralaKitchen, fishingNets, elephant, none: () => group(),
};

export const INDIA_ICONS: Record<string, () => P> = {
  wheatNaan: () => { const g = group(); for (let k = 0; k < 3; k++) add(g, cyl(0.2, 0.2, 0.03, "#f2dca0", 10), -0.2 + k * 0.05, 0.02 + k * 0.03, (k - 1) * 0.06).scale.x = 1.4; for (let k = 0; k < 4; k++) { add(g, cyl(0.015, 0.015, 0.5, "#c9b45a", 3), 0.4 + k * 0.08, 0.25, -0.2 + k * 0.05); add(g, ball(0.05, "#e0c46a", 4), 0.4 + k * 0.08, 0.52, -0.2 + k * 0.05).scale.set(0.6, 1.6, 0.6); } return g; },
  dairyIn: () => { const g = group(); add(g, box(0.4, 0.2, 0.3, "#f4f1ea"), -0.3, 0.1, 0); add(g, cyl(0.14, 0.12, 0.28, "#8c9096", 8), 0.2, 0.14, 0); add(g, cyl(0.12, 0.12, 0.2, "#e0b34c", 8), 0.5, 0.1, 0.2); add(g, cyl(0.13, 0.13, 0.03, "#8c9096", 8), 0.5, 0.21, 0.2); return g; },
  chickenIn: () => chicken(C.white),
  lentils: () => { const g = group(); add(g, cyl(0.36, 0.3, 0.1, "#c9cfd6", 12), 0, 0.05, 0); add(g, ball(0.3, "#e0b34c", 9), 0, 0.14, 0).scale.y = 0.45; for (let k = 0; k < 10; k++) add(g, ball(0.03, "#e07a3a", 4), 0.5 + (k % 5) * 0.06, 0.03, -0.3 + Math.floor(k / 5) * 0.08); add(g, box(0.1, 0.02, 0.05, "#3f7a3a"), 0.05, 0.28, 0); return g; },
  chilliesIn: () => { const g = group(); for (let i = 0; i < 4; i++) { const c = add(g, cone(0.06, 0.4, i % 2 ? "#8e2a22" : "#c9302a", 6), -0.4 + i * 0.27, 0.2, (i % 2) * 0.15); c.rotation.z = Math.PI / 2 + (i - 1.5) * 0.25; } return g; },
  spicesIn: () => { const g = group(); for (let i = 0; i < 4; i++) { add(g, cyl(0.12, 0.13, 0.08, "#8a6a3a", 8), -0.4 + i * 0.27, 0.04, (i % 2) * 0.15); add(g, cone(0.11, 0.24, ["#e0a52c", "#c9302a", "#6f9b57", "#8e2a22"][i], 8), -0.4 + i * 0.27, 0.2, (i % 2) * 0.15); } for (let k = 0; k < 5; k++) add(g, ball(0.025, "#2a3a2a", 4), 0.55 + (k % 3) * 0.05, 0.03, -0.2 + Math.floor(k / 3) * 0.06); return g; },
  coconut: () => { const g = group(); add(g, ball(0.2, "#8a6a3a", 8), -0.25, 0.2, 0); add(g, cyl(0.18, 0.18, 0.14, "#f7f4ee", 8), 0.2, 0.07, 0.1); add(g, cyl(0.14, 0.14, 0.02, "#f7f4ee", 8), 0.2, 0.15, 0.1); for (let k = 0; k < 5; k++) add(g, ball(0.035, "#e9d7a8", 4), 0.45 + (k % 3) * 0.08, 0.03, -0.25 + Math.floor(k / 3) * 0.1).scale.set(1, 0.7, 1.6); return g; },
  aromaticsIn: () => { const g = group(); add(g, ball(0.13, "#c9302a", 8), -0.35, 0.13, 0); add(g, ball(0.12, "#9b59b6", 8), -0.05, 0.12, 0.15); add(g, ball(0.11, "#f1e9dc", 7), 0.25, 0.11, -0.05); add(g, box(0.22, 0.09, 0.12, "#d9b27a"), 0.5, 0.05, 0.2); return g; },
  vegIn: () => { const g = group(); add(g, ball(0.14, "#3f7a3a", 6), -0.35, 0.14, 0).scale.y = 0.7; for (let k = 0; k < 3; k++) add(g, cyl(0.07, 0.04, 0.14, "#e9d7a8", 6), -0.05 + k * 0.18, 0.07, (k % 2) * 0.12); add(g, ball(0.12, "#9b59b6", 7), 0.5, 0.12, -0.1).scale.set(1, 1.3, 1); return g; },
  mango: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.14, i === 1 ? "#e8558a" : "#f2b64d", 8), -0.3 + i * 0.3, 0.14, (i - 1) * 0.1).scale.set(1.2, 0.9, 0.8); add(g, box(0.16, 0.1, 0.16, "#e0a52c"), 0.55, 0.05, 0.2); return g; },
  tandoor: () => { const g = group(); add(g, cyl(0.32, 0.28, 0.5, "#7a4a2a", 12), 0, 0.25, 0); add(g, cyl(0.22, 0.22, 0.06, "#f08a2a", 12), 0, 0.5, 0); add(g, cyl(0.015, 0.015, 0.8, "#c9cfd6", 4), 0.1, 0.7, 0); for (let k = 0; k < 3; k++) add(g, ball(0.07, "#d9482a", 6), 0.1, 0.5 + k * 0.2, 0).scale.set(1, 1.3, 1); add(g, cyl(0.16, 0.16, 0.02, "#f2dca0", 10), 0.5, 0.02, 0.2).scale.x = 1.4; return g; },
  dhaba: () => { const g = group(); add(g, new THREE.Mesh(new THREE.SphereGeometry(0.4, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat("#3a3a3d")), 0, 0.42, 0); add(g, cyl(0.38, 0.38, 0.04, "#e07a2a", 14), 0, 0.4, 0); for (let k = 0; k < 5; k++) add(g, ball(0.06, "#c9573a", 5), Math.cos(k * 1.25) * 0.22, 0.44, Math.sin(k * 1.25) * 0.22); for (const sd of [-1, 1]) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 5, 8), mat("#3a3a3d")), sd * 0.43, 0.36, 0); return g; },
  thali: () => { const g = group(); add(g, cyl(0.42, 0.4, 0.04, "#c9cfd6", 14), 0, 0.02, 0); const cols = ["#e0b34c", "#3f7a3a", "#f7f2e6", "#c9573a", "#e07a3a", "#f2c14e"]; cols.forEach((c, k) => { const a = (k / 6) * Math.PI * 2; add(g, cyl(0.1, 0.08, 0.05, "#c9cfd6", 8), Math.cos(a) * 0.28, 0.05, Math.sin(a) * 0.28); add(g, ball(0.07, c, 5), Math.cos(a) * 0.28, 0.1, Math.sin(a) * 0.28).scale.y = 0.6; }); add(g, cyl(0.15, 0.15, 0.02, "#f2dca0", 10), 0, 0.05, 0); return g; },
  southKitchen: () => { const g = group(); add(g, cyl(0.4, 0.4, 0.04, "#3a3a3d", 16), 0, 0.02, 0); const d = add(g, cyl(0.33, 0.33, 0.02, "#e0b34c", 16), 0, 0.05, 0); void d; add(g, cyl(0.1, 0.08, 0.14, "#8c9096", 8), 0.5, 0.07, 0.15); add(g, cyl(0.09, 0.09, 0.02, "#e07a3a", 8), 0.5, 0.15, 0.15); add(g, ball(0.07, "#f7f4ee", 6), 0.5, 0.04, -0.2).scale.y = 0.5; return g; },
  market: () => { const g = group(); for (let i = 0; i < 3; i++) { add(g, cyl(0.12, 0.13, 0.08, "#8a6a3a", 8), -0.3 + i * 0.3, 0.04, 0); add(g, cone(0.11, 0.22, ["#e0a52c", "#c9302a", "#6f9b57"][i], 8), -0.3 + i * 0.3, 0.18, 0); } add(g, ball(0.1, "#f2b64d", 7), 0.55, 0.1, -0.25).scale.set(1.2, 0.9, 0.8); return g; },
  streetFood: () => { const g = group(); add(g, cyl(0.3, 0.3, 0.04, "#3a3a3d", 14), -0.15, 0.02, 0); add(g, cyl(0.26, 0.26, 0.04, "#c9573a", 14), -0.15, 0.06, 0); add(g, box(0.18, 0.1, 0.14, "#f2dca0"), 0.3, 0.05, 0.1); add(g, cyl(0.05, 0.04, 0.12, "#c9a86a", 6), 0.5, 0.06, -0.2); return g; },
  dabbawala: () => { const g = group(); for (let k = 0; k < 3; k++) add(g, cyl(0.12, 0.12, 0.18, "#c9cfd6", 10), -0.2 + k * 0.25, 0.09 + (k % 2) * 0.0, (k - 1) * 0.1); add(g, new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 6, 14), mat("#2a2a2e")), 0.55, 0.18, -0.2); return g; },
  backwaters: () => { const b = houseboat(); b.scale.setScalar(0.3); return b; },
  nets: () => { const g = group(); add(g, cyl(0.03, 0.03, 1.0, IN.wood, 4), 0, 0.4, 0).rotation.z = 0.6; add(g, new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6, 4, 4), new THREE.MeshStandardMaterial({ color: "#c9b45a", wireframe: true })), -0.35, 0.05, 0).rotation.x = Math.PI / 2; return g; },
  elephant: () => { const e = elephant(); e.scale.setScalar(0.32); return e; },
};
