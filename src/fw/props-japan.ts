/** Japanese props: Tokyo Tower and Shibuya, a ramen shop and an izakaya, Kyoto machiya, torii gates and the Golden Pavilion, Fuji, a fishing port, an onsen with monkeys, a shinkansen. Bubbles are Japanese + English. */
import * as THREE from "three";
import { mat, add, rnd, C, person, bubble, wear, tree, type P } from "./props";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate * 0.7); return k; } }; }
type Fig = P & { userData: { upper?: THREE.Group; walk?: (t: number) => void; sit?: () => void } };

export const JP = { vermilion: "#c8402a", white: "#f4f1ea", wood: "#7a5a3a", darkWood: "#4a3526", tile: "#3a3f4a", plaster: "#efe6d2", glass: "#9fc9dc", indigo: "#2b3a67", sakura: "#f6b8c8", gold: "#d9a441", moss: "#5f8f4a", lantern: "#d94b2a" };

/** Someone in a kimono, a happi coat with a hachimaki headband, a chef's cap, or plain clothes. */
export function local(shirt: string, opts: { kimono?: string; hachimaki?: boolean; cap?: boolean; apron?: boolean; strawHat?: boolean } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.kimono) { const robe = add(p, box(0.44, 0.7, 0.34, opts.kimono), 0, 0.42, 0); robe.name = "robe"; add(p, box(0.46, 0.14, 0.36, JP.gold), 0, 0.62, 0); }
  if (opts.hachimaki) wear(p, cyl(0.17, 0.17, 0.05, JP.white, 10), 0, 1.06, 0);
  if (opts.cap) wear(p, cyl(0.16, 0.17, 0.12, JP.white, 10), 0, 1.22, 0);
  if (opts.strawHat) wear(p, cone(0.36, 0.2, C.straw, 10), 0, 1.24, 0);
  return p;
}

// ---------- Tokyo ----------

export function tokyoTower(): P {
  const g = group();
  const leg = (x: number, z: number) => { const l = cyl(0.08, 0.14, 9, JP.vermilion, 5); l.position.set(x * 0.55, 4.4, z * 0.55); l.rotation.set(-z * 0.2, 0, x * 0.2); g.add(l); };
  for (const x of [-1, 1]) for (const z of [-1, 1]) leg(x, z);
  for (const [y, s] of [[2.2, 1.55], [4.6, 1.1], [7.0, 0.7]] as [number, number][]) { add(g, box(s * 2, 0.16, s * 2, JP.white), 0, y, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(s * 1.25, 0.05, 5, 4), mat(JP.vermilion)), 0, y - 0.6, 0).rotation.x = Math.PI / 2; }
  add(g, box(1.8, 0.6, 1.8, JP.white), 0, 3.1, 0); add(g, box(1.1, 0.5, 1.1, JP.white), 0, 7.6, 0);
  add(g, cyl(0.1, 0.32, 3.2, JP.vermilion, 5), 0, 9.5, 0); add(g, cyl(0.03, 0.06, 2.2, JP.white, 4), 0, 12.0, 0);
  const light = add(g, ball(0.1, "#f2e6a0", 5), 0, 13.1, 0);
  g.userData.tick = (t) => { light.visible = Math.sin(t * 4) > 0; };
  return g;
}

export function tokyoBlock(w = 2.4, h = 6, d = 2.4, color = "#c9c2b0", sign = JP.vermilion): P {
  const g = group();
  add(g, box(w, h, d, color), 0, h / 2, 0);
  const rows = Math.floor(h / 0.8); for (let r = 0; r < rows; r++) for (const sd of [-1, 1]) add(g, box(w - 0.5, 0.36, 0.04, (r % 3) ? JP.glass : "#f2e6a0"), 0, 0.55 + r * 0.8, sd * (d / 2 + 0.02));
  for (let k = 0; k < 3; k++) add(g, box(0.06, 0.6, 0.5, [sign, JP.white, JP.indigo][k]), w / 2 + 0.1, h - 1.0 - k * 0.8, d / 2 - 0.5);   // the vertical shop signs
  add(g, box(w * 0.8, 0.5, 0.04, sign), 0, h - 0.5, d / 2 + 0.05);
  add(g, cyl(0.02, 0.02, 1.2, "#5a5a5a", 4), w * 0.3, h + 0.6, -d * 0.3); add(g, box(0.6, 0.4, 0.3, "#8c9096"), -w * 0.25, h + 0.2, d * 0.2);   // antenna and an air-con unit
  return g;
}

export function vendingMachine(): P {
  const g = group();
  add(g, box(0.7, 1.4, 0.6, JP.white), 0, 0.7, 0); add(g, box(0.6, 0.6, 0.04, "#1f2430"), 0, 0.95, 0.31); for (let k = 0; k < 6; k++) add(g, cyl(0.05, 0.05, 0.14, [JP.vermilion, "#3fa2b0", JP.gold][k % 3], 6), -0.2 + (k % 3) * 0.2, 1.05 - Math.floor(k / 3) * 0.25, 0.32);
  add(g, box(0.5, 0.2, 0.04, "#2a2a2e"), 0, 0.3, 0.31);
  return g;
}

/** Shibuya: the scramble crossing under screens, crowds pouring across from every corner when poked. */
export function shibuya(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(9, 9), mat("#6e6e72")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  const stripe = (x: number, z: number, rot: number, n: number) => { for (let k = 0; k < n; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 1.6), mat("#e9e6da")); m.rotation.x = -Math.PI / 2; m.rotation.z = rot; m.position.set(x + Math.cos(rot) * (k - (n - 1) / 2) * 0.45, 0.03, z - Math.sin(rot) * (k - (n - 1) / 2) * 0.45); g.add(m); } };
  stripe(0, -3.2, 0, 9); stripe(0, 3.2, 0, 9); stripe(-3.2, 0, Math.PI / 2, 9); stripe(3.2, 0, Math.PI / 2, 9); stripe(0, 0, Math.PI / 4, 11);
  for (const [x, z] of [[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]] as [number, number][]) { const b = tokyoBlock(1.8, 5 + rnd() * 3, 1.8, pick(["#c9c2b0", "#b8b4ad", "#a89f8c"]), pick([JP.vermilion, JP.indigo, "#3fa2b0"])); b.position.set(x, 0, z); g.add(b); const screen = add(b, box(1.4, 0.9, 0.05, "#1f2430"), 0, 3.2, -Math.sign(z) * 0.95); add(screen, box(1.2, 0.7, 0.02, pick(["#e8558a", "#3fa2b0", JP.gold])), 0, 0, -Math.sign(z) * 0.03); }
  add(g, box(0.06, 2.4, 0.06, "#2a2a2e"), -2.2, 1.2, -2.2); add(g, box(0.5, 0.2, 0.06, "#2a2a2e"), -2.0, 2.3, -2.2); add(g, ball(0.06, "#3fbf5a", 5), -1.85, 2.3, -2.15);
  const crowd: { p: Fig; from: THREE.Vector3; to: THREE.Vector3; ph: number }[] = [];
  const corners = [new THREE.Vector3(-2.4, 0, -2.4), new THREE.Vector3(2.4, 0, -2.4), new THREE.Vector3(2.4, 0, 2.4), new THREE.Vector3(-2.4, 0, 2.4)];
  for (let i = 0; i < 14; i++) { const from = corners[i % 4].clone().add(new THREE.Vector3((rnd() - 0.5) * 1.2, 0, (rnd() - 0.5) * 1.2)); const to = corners[(i + 1 + Math.floor(rnd() * 3)) % 4].clone().add(new THREE.Vector3((rnd() - 0.5) * 1.2, 0, (rnd() - 0.5) * 1.2)); const p = local(pick([JP.white, "#2a2a2e", JP.indigo, "#e8558a", C.straw, "#3f8f5a"]), { cap: i % 5 === 0 }); p.position.copy(from); p.rotation.y = Math.atan2(to.x - from.x, to.z - from.z); g.add(p); crowd.push({ p, from, to, ph: rnd() }); }
  const re = reaction(0.25);
  let phase = 0;
  g.userData.poke = () => { re.poke(); bubble(g, "スクランブル! Scramble!", 2.2, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); phase = (phase + dt * (0.08 + k * 0.5)) % 1; for (const c of crowd) { const u = (phase + c.ph) % 1; const w = u < 0.5 ? u * 2 : (1 - u) * 2; const a = u < 0.5 ? c.from : c.to, b = u < 0.5 ? c.to : c.from; c.p.position.lerpVectors(a, b, w); c.p.rotation.y = Math.atan2(b.x - a.x, b.z - a.z); c.p.userData.walk?.(t + c.ph * 7); } };
  return g;
}

/** A ramen shop: a noren curtain, a counter with stools, steaming bowls, the chef in a hachimaki. */
export function ramenShop(): P {
  const g = group();
  add(g, box(4.6, 2.6, 3.0, JP.plaster), 0, 1.3, -1.5); add(g, box(4.8, 0.2, 3.3, JP.tile), 0, 2.7, -1.5);
  for (let k = 0; k < 3; k++) add(g, box(0.9, 0.7, 0.03, JP.vermilion), -1.0 + k * 1.0, 1.9, 0.02);   // the noren
  add(g, box(2.4, 0.5, 0.06, "#1f2430"), 0.4, 2.35, 0.03); add(g, box(2.0, 0.3, 0.02, JP.gold), 0.4, 2.35, 0.07);
  add(g, box(1.4, 0.5, 0.05, JP.white), -1.4, 2.4, 0.03); add(g, cyl(0.28, 0.28, 0.6, JP.white, 12), 2.1, 1.9, 0.3); add(g, box(0.4, 0.3, 0.02, JP.vermilion), 2.1, 1.9, 0.6);   // the paper lantern
  add(g, box(4.0, 0.9, 0.7, JP.darkWood), 0, 0.45, 0.8); add(g, box(4.2, 0.08, 0.9, JP.wood), 0, 0.94, 0.8);
  const bowls: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) { const b = new THREE.Group(); b.position.set(-1.5 + i, 0.98, 0.8); g.add(b); bowls.push(b); add(b, cyl(0.24, 0.17, 0.2, i % 2 ? JP.white : "#2a2a2e", 12), 0, 0.1, 0); add(b, cyl(0.22, 0.22, 0.03, "#e0a52c", 12), 0, 0.2, 0); for (let k = 0; k < 5; k++) add(b, cyl(0.012, 0.012, 0.3, "#f2d78a", 3), -0.12 + k * 0.06, 0.22, 0).rotation.z = 1.2; add(b, ball(0.06, "#e8a95a", 6), 0.08, 0.24, 0.06).scale.set(1.3, 0.5, 1); add(b, ball(0.05, JP.white, 6), -0.08, 0.24, -0.05); add(b, ball(0.045, JP.gold, 5), 0.02, 0.25, -0.1); add(b, box(0.1, 0.15, 0.01, "#1f3a1a"), -0.12, 0.28, 0.1); for (const sd of [-1, 1]) add(b, cyl(0.008, 0.008, 0.4, JP.darkWood, 3), 0.18, 0.22, sd * 0.03).rotation.z = 0.4; }   // pumpkin slices, egg, nori, chashu
  const stools: Fig[] = [];
  for (let i = 0; i < 4; i++) { add(g, cyl(0.05, 0.05, 0.5, "#2a2a2e", 6), -1.5 + i, 0.25, 1.7); add(g, cyl(0.22, 0.22, 0.08, JP.vermilion, 10), -1.5 + i, 0.55, 1.7); const e = local(pick([JP.white, JP.indigo, "#2a2a2e", "#e8558a"]), { cap: false }); e.userData.sit?.(); add(g, e, -1.5 + i, 0.2, 1.7).rotation.y = Math.PI; stools.push(e); }
  const chef = local(JP.white, { hachimaki: true, apron: true }); add(g, chef, -0.5, 0, 0.2); const ladle = add(g, cyl(0.02, 0.02, 0.5, "#c9cfd6", 4), 0.1, 1.2, 0.3); ladle.rotation.z = 0.5;
  add(g, cyl(0.3, 0.28, 0.5, "#8c9096", 12), 1.5, 0.25 + 0.9, 0.3); add(g, cyl(0.2, 0.2, 0.05, "#e0a52c", 10), 1.5, 1.42, 0.3);   // the stock pot
  g.userData.steam = new THREE.Vector3(1.5, 1.7, 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(chef, "いらっしゃい! Welcome!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); bowls.forEach((b, i) => { b.position.y = 0.98 + k * Math.max(0, Math.sin(t * 9 + i * 1.3)) * 0.3; }); stools.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.15 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); ladle.rotation.y = t * (0.5 + k * 6); if (chef.userData.upper) chef.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

/** An izakaya: red lanterns, a robata grill with salmon and skewers, sake bottles, customers under the eaves. */
export function izakaya(): P {
  const g = group();
  add(g, box(4.4, 2.6, 3.0, JP.darkWood), 0, 1.3, -1.5); add(g, box(4.8, 0.2, 3.4, JP.tile), 0, 2.7, -1.5); add(g, box(4.8, 0.08, 1.8, JP.tile), 0, 2.2, 0.8).rotation.x = 0.15;
  for (let k = 0; k < 4; k++) { add(g, cyl(0.22, 0.22, 0.5, JP.lantern, 12), -1.6 + k * 1.05, 1.8, 0.4); add(g, box(0.3, 0.2, 0.02, "#2a2a2e"), -1.6 + k * 1.05, 1.8, 0.63); }
  for (let k = 0; k < 2; k++) add(g, box(0.9, 0.8, 0.03, JP.indigo), -0.5 + k * 1.0, 1.7, 0.02);
  add(g, box(3.4, 0.8, 0.7, JP.wood), -0.2, 0.4, 0.8); add(g, box(3.6, 0.06, 0.9, JP.darkWood), -0.2, 0.83, 0.8);
  add(g, box(1.6, 0.25, 0.5, "#2a2a2e"), -0.8, 0.98, 0.7); for (let k = 0; k < 6; k++) add(g, box(0.16, 0.04, 0.08, "#f08a2a"), -1.4 + k * 0.25, 1.06, 0.7);   // the robata with coals
  const fish: THREE.Mesh[] = []; for (let k = 0; k < 3; k++) { const f = add(g, box(0.4, 0.06, 0.16, "#f0946a"), -1.3 + k * 0.5, 1.14, 0.62); for (let s = 0; s < 3; s++) add(f, box(0.02, 0.07, 0.17, "#f4d2b8"), -0.12 + s * 0.12, 0, 0); fish.push(f); }   // salmon fillets
  for (let k = 0; k < 4; k++) { const sk = add(g, cyl(0.01, 0.01, 0.5, C.straw, 3), -1.4 + k * 0.28, 1.14, 0.85); sk.rotation.x = Math.PI / 2; for (let b = 0; b < 3; b++) add(sk, box(0.08, 0.06, 0.08, b === 1 ? JP.moss : "#c9862a"), 0, -0.12 + b * 0.12, 0); }   // yakitori
  for (let k = 0; k < 3; k++) { add(g, cyl(0.07, 0.07, 0.36, [JP.white, "#3f5f8f", "#2a2a2e"][k], 8), 0.9 + k * 0.25, 1.05, 0.65); add(g, box(0.1, 0.14, 0.01, JP.vermilion), 0.9 + k * 0.25, 1.05, 0.73); }   // sake bottles
  add(g, cyl(0.08, 0.06, 0.12, JP.white, 8), 1.5, 0.92, 0.95); add(g, cyl(0.08, 0.06, 0.12, JP.white, 8), 1.7, 0.92, 1.0);
  const cook = local("#2a2a2e", { hachimaki: true, apron: true }); add(g, cook, -0.8, 0, 0.2); const fan = add(g, box(0.3, 0.02, 0.3, C.straw), -0.5, 1.1, 0.5);
  const guests: Fig[] = [];
  for (let i = 0; i < 3; i++) { add(g, cyl(0.05, 0.05, 0.5, "#2a2a2e", 6), -1.2 + i, 0.25, 1.7); add(g, cyl(0.2, 0.2, 0.08, JP.wood, 10), -1.2 + i, 0.55, 1.7); const e = local(pick([JP.white, JP.indigo, "#8a2a2a", "#3f8f5a"])); e.userData.sit?.(); add(g, e, -1.2 + i, 0.2, 1.7).rotation.y = Math.PI; guests.push(e); }
  g.userData.smoke = new THREE.Vector3(-0.8, 1.4, 0.7);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "乾杯! Kanpai!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); fish.forEach((f, i) => { f.position.y = 1.14 + k * Math.max(0, Math.sin(t * 9 + i)) * 0.25; f.rotation.x = k * Math.sin(t * 9 + i) * 1.2; }); fan.rotation.z = Math.sin(t * (2 + k * 10)) * 0.4; guests.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 - k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); };
  return g;
}

/** A tonkatsu shop: a mountain of shredded cabbage, a cook at the mandoline, a sesame grinder, tonkatsu plates. */
export function tonkatsuShop(): P {
  const g = group();
  add(g, box(4.0, 2.4, 2.8, JP.plaster), 0, 1.2, -1.4); add(g, box(4.4, 0.2, 3.2, JP.wood), 0, 2.5, -1.4); add(g, box(4.4, 0.06, 1.6, JP.wood), 0, 2.1, 0.7).rotation.x = 0.15;
  for (let k = 0; k < 2; k++) add(g, box(0.9, 0.7, 0.03, JP.white), -0.5 + k * 1.0, 1.65, 0.02); add(g, box(1.6, 0.4, 0.04, JP.indigo), 0, 2.3, 0.03);
  add(g, box(3.2, 0.8, 0.7, JP.wood), 0, 0.4, 0.8); add(g, box(3.4, 0.06, 0.9, JP.white), 0, 0.83, 0.8);
  const heap = add(g, ball(0.32, "#c9e0a0", 9), -0.9, 0.98, 0.75); heap.scale.y = 0.6; for (let k = 0; k < 14; k++) add(heap, box(0.02, 0.02, 0.3, "#a3d18a"), (rnd() - 0.5) * 0.5, 0.15 + rnd() * 0.1, (rnd() - 0.5) * 0.5).rotation.set(rnd(), rnd(), 0);   // the cabbage heap
  const board = add(g, box(0.6, 0.04, 0.4, "#c9a86a"), 0.1, 0.88, 0.75); const half = add(g, ball(0.16, "#a3d18a", 9), 0.1, 1.02, 0.75); half.scale.y = 0.7; const knife = add(g, box(0.02, 0.05, 0.3, "#c9cfd6"), 0.3, 1.1, 0.75); void board;
  for (let k = 0; k < 2; k++) { add(g, cyl(0.2, 0.18, 0.04, JP.white, 12), 0.9 + k * 0.5, 0.88, 0.85); add(g, box(0.24, 0.08, 0.16, "#c9862a"), 0.9 + k * 0.5, 0.94, 0.8); add(g, ball(0.1, "#c9e0a0", 6), 0.9 + k * 0.5 + 0.1, 0.94, 0.95).scale.y = 0.5; }   // tonkatsu plates
  const mortar = add(g, cyl(0.12, 0.09, 0.1, "#8a6a4a", 10), 1.4, 0.9, 0.55); const pestle = add(g, cyl(0.015, 0.015, 0.3, JP.wood, 4), 1.44, 1.05, 0.55); pestle.rotation.z = 0.4; void mortar;
  add(g, cyl(0.05, 0.04, 0.14, "#5a3d28", 6), -1.5, 0.92, 0.95); add(g, cyl(0.05, 0.04, 0.14, "#2a2a2e", 6), -1.35, 0.92, 0.98);   // sesame dressing and tonkatsu sauce
  const cook = local(JP.white, { cap: true, apron: true }); add(g, cook, 0.1, 0, 0.15);
  const guests: Fig[] = []; for (let i = 0; i < 2; i++) { add(g, cyl(0.05, 0.05, 0.5, "#2a2a2e", 6), 0.6 + i * 0.7, 0.25, 1.6); add(g, cyl(0.2, 0.2, 0.08, JP.wood, 10), 0.6 + i * 0.7, 0.55, 1.6); const e = local(pick([JP.indigo, "#2a2a2e", "#e8558a"])); e.userData.sit?.(); add(g, e, 0.6 + i * 0.7, 0.2, 1.6).rotation.y = Math.PI; guests.push(e); }
  const shreds: THREE.Mesh[] = []; for (let i = 0; i < 8; i++) { const s = box(0.02, 0.02, 0.2, "#a3d18a"); s.visible = false; g.add(s); shreds.push(s); }
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "キャベツおかわり! More cabbage!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); knife.position.y = 1.1 + k * Math.abs(Math.sin(t * 14)) * 0.15; half.rotation.y += k * dt * 4; shreds.forEach((s, i) => { s.visible = k > 0.05; const a = (t * 2 + i) % 2; s.position.set(0.1 + Math.sin(a * 3 + i) * 0.3, 1.1 + a * 0.5 - a * a * 0.4, 0.75 + Math.cos(i) * 0.2); s.rotation.set(a * 3, i, a); }); pestle.rotation.y = t * (1 + k * 8); guests.forEach((e, i) => { if (e.userData.upper) e.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); };
  return g;
}

// ---------- Kyoto ----------

export function machiya(w = 3.2, color = JP.darkWood): P {
  const g = group();
  add(g, box(w, 2.2, 2.6, color), 0, 1.1, 0); add(g, box(w + 0.4, 0.14, 3.0, JP.tile), 0, 2.28, 0);
  const roof = add(g, box(w + 0.6, 0.12, 1.9, JP.tile), 0, 2.85, -0.5); roof.rotation.x = 0.45; const roof2 = add(g, box(w + 0.6, 0.12, 1.9, JP.tile), 0, 2.85, 0.5); roof2.rotation.x = -0.45;
  for (let k = 0; k < Math.floor(w / 0.35); k++) add(g, box(0.06, 1.0, 0.04, JP.wood), -w / 2 + 0.3 + k * 0.35, 1.4, 1.32);   // koshi lattice
  add(g, box(0.9, 1.3, 0.04, JP.plaster), w / 2 - 0.7, 0.65, 1.32); for (let k = 0; k < 3; k++) add(g, box(0.9, 0.02, 0.05, JP.wood), w / 2 - 0.7, 0.4 + k * 0.4, 1.34);
  add(g, box(0.6, 0.5, 0.02, JP.indigo), -w / 2 + 0.7, 1.75, 1.34); add(g, cyl(0.12, 0.12, 0.3, JP.white, 8), w / 2 - 0.3, 1.9, 1.4);
  return g;
}

/** A Kyoto kaiseki kitchen: cod fillets in a tray of white miso, a charcoal grill, lacquer trays, a chef in a white cap. */
export function kaisekiHouse(): P {
  const g = group();
  const house = machiya(4.4, JP.wood); g.add(house); house.position.z = -1.6;
  add(g, box(3.6, 0.8, 0.8, JP.darkWood), 0, 0.4, 0.5); add(g, box(3.8, 0.06, 1.0, "#c9a86a"), 0, 0.83, 0.5);
  const tray = add(g, box(0.9, 0.12, 0.6, "#c9c2b0"), -1.1, 0.92, 0.5); add(tray, box(0.8, 0.04, 0.5, "#f2e2b8"), 0, 0.06, 0);
  const fillets: THREE.Mesh[] = []; for (let k = 0; k < 3; k++) { const f = add(g, box(0.28, 0.08, 0.2, "#f4f1ea"), -1.35 + k * 0.26, 1.02, 0.5); add(f, box(0.28, 0.02, 0.2, "#f2e2b8"), 0, 0.05, 0); fillets.push(f); }   // black cod in saikyo miso
  add(g, box(0.8, 0.22, 0.4, "#2a2a2e"), 0.1, 0.94, 0.45); for (let k = 0; k < 4; k++) add(g, box(0.14, 0.04, 0.06, "#f08a2a"), -0.15 + k * 0.17, 1.02, 0.45); const grid = add(g, box(0.8, 0.02, 0.4, "#8c9096"), 0.1, 1.06, 0.45); void grid;
  const cooked = add(g, box(0.28, 0.08, 0.2, "#e0a852"), 0.1, 1.11, 0.45); for (let k = 0; k < 3; k++) add(cooked, box(0.02, 0.05, 0.2, "#c9862a"), -0.08 + k * 0.08, 0.02, 0);
  for (let k = 0; k < 2; k++) { add(g, box(0.5, 0.03, 0.36, "#1a1a1e"), 1.0 + k * 0.6, 0.88, 0.6); add(g, cyl(0.08, 0.06, 0.06, JP.white, 8), 0.9 + k * 0.6, 0.92, 0.55); add(g, ball(0.04, JP.moss, 5), 1.15 + k * 0.6, 0.92, 0.7); add(g, box(0.1, 0.02, 0.06, "#f4a6b8"), 1.1 + k * 0.6, 0.9, 0.5); }   // lacquer trays
  const chef = local(JP.white, { cap: true, apron: true }); add(g, chef, -0.4, 0, 0.0); const tongs = add(g, box(0.03, 0.3, 0.03, "#c9cfd6"), 0.0, 1.2, 0.3); tongs.rotation.x = 0.5;
  add(g, cyl(0.25, 0.3, 0.9, "#8f857a", 6), 2.4, 0.45, 1.2); add(g, box(0.5, 0.4, 0.5, "#8f857a"), 2.4, 1.1, 1.2); add(g, cone(0.45, 0.25, "#8f857a", 4), 2.4, 1.4, 1.2).rotation.y = Math.PI / 4;   // a stone lantern
  const guest = local(JP.indigo, { kimono: "#7a3a5a" }); add(g, guest, -2.2, 0, 1.4); guest.rotation.y = 0.6;
  g.userData.smoke = new THREE.Vector3(0.1, 1.3, 0.45);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(chef, "西京焼き! Miso-glazed cod!", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); fillets.forEach((f, i) => { f.position.y = 1.02 + k * Math.max(0, Math.sin(t * 9 + i)) * 0.25; }); cooked.position.y = 1.11 + k * Math.abs(Math.sin(t * 8)) * 0.2; tongs.position.y = 1.2 + k * Math.abs(Math.sin(t * 10)) * 0.3; if (chef.userData.upper) chef.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; if (guest.userData.upper) guest.userData.upper.rotation.x = k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); };
  return g;
}

/** A path of vermilion torii climbing a low hill, fox statues at the foot. */
export function toriiPath(): P {
  const g = group();
  const hill = new THREE.Mesh(new THREE.ConeGeometry(5.5, 2.4, 10), mat("#6f9f5f")); hill.position.y = 1.2; hill.scale.z = 0.7; g.add(hill);
  const gates: THREE.Group[] = [];
  for (let i = 0; i < 8; i++) { const u = i / 7; const x = -3.6 + u * 7.2; const y = 2.4 * (1 - Math.abs(u - 0.5) * 2) * 0.55; const t = new THREE.Group(); t.position.set(x, y, 0); t.rotation.y = Math.PI / 2; g.add(t); gates.push(t); for (const sd of [-1, 1]) add(t, cyl(0.06, 0.07, 1.7, JP.vermilion, 8), sd * 0.45, 0.85, 0); add(t, box(1.3, 0.1, 0.1, JP.vermilion), 0, 1.72, 0); add(t, box(1.0, 0.07, 0.08, JP.vermilion), 0, 1.5, 0); add(t, box(1.34, 0.05, 0.12, "#2a2a2e"), 0, 1.8, 0); }
  for (const sd of [-1, 1]) { add(g, box(0.4, 0.5, 0.4, "#8f857a"), -4.4, 0.25, sd * 0.8); const fox = add(g, box(0.16, 0.3, 0.3, JP.white), -4.4, 0.65, sd * 0.8); add(fox, box(0.14, 0.14, 0.14, JP.white), 0, 0.22, 0.12); add(fox, box(0.12, 0.05, 0.03, JP.vermilion), 0, 0.1, 0.27); add(fox, cone(0.04, 0.1, JP.white, 4), 0, 0.34, 0.08); }
  const climbers = [local(JP.white, { kimono: "#7a3a5a" }), local(JP.indigo), local("#e8558a", { kimono: "#3f8f5a" })]; climbers.forEach((c) => { c.scale.setScalar(0.85); g.add(c); });
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(gates[3], "千本鳥居 · a thousand gates", 2.3, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); gates.forEach((gt, i) => { gt.rotation.z = k * Math.sin(t * 8 - i * 0.6) * 0.06; }); climbers.forEach((c, i) => { const u = ((t * 0.04 + i / 3) % 1); const x = -3.6 + u * 7.2; const y = 2.4 * (1 - Math.abs(u - 0.5) * 2) * 0.55; c.position.set(x, y, 0.2); c.rotation.y = Math.PI / 2; c.userData.walk?.(t + i); }); };
  return g;
}

/** The Golden Pavilion on its pond, with a pine on the bank. Water is added by the layout. */
export function kinkakuji(): P {
  const g = group();
  add(g, box(3.4, 0.5, 2.8, "#8f857a"), 0, 0.25, 0);
  add(g, box(3.0, 1.2, 2.4, JP.white), 0, 1.1, 0); add(g, box(3.3, 0.1, 2.7, JP.tile), 0, 1.75, 0);
  add(g, box(2.6, 1.1, 2.0, JP.gold), 0, 2.35, 0); add(g, box(2.9, 0.1, 2.3, JP.tile), 0, 2.95, 0); for (let k = 0; k < 4; k++) add(g, box(0.5, 0.7, 0.03, "#2a2a2e"), -0.9 + k * 0.6, 2.35, 1.02);
  add(g, box(2.0, 1.0, 1.5, JP.gold), 0, 3.5, 0); for (let k = 0; k < 3; k++) add(g, box(0.4, 0.6, 0.03, "#2a2a2e"), -0.6 + k * 0.6, 3.5, 0.77);
  const roof = add(g, new THREE.Mesh(new THREE.ConeGeometry(1.9, 0.9, 4), mat(JP.tile)), 0, 4.45, 0); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.8;
  add(g, ball(0.12, JP.gold, 6), 0, 4.95, 0); const phoenix = add(g, box(0.16, 0.2, 0.3, JP.gold), 0, 5.15, 0); add(phoenix, cone(0.05, 0.2, JP.gold, 4), 0, 0.15, -0.15);
  add(g, cyl(0.1, 0.14, 1.4, "#5a3d28", 6), -2.6, 0.7, 1.2); add(g, ball(0.8, "#3a6b48", 8), -2.6, 1.6, 1.2).scale.y = 0.5; add(g, ball(0.5, "#3a6b48", 7), -2.2, 2.0, 1.4).scale.y = 0.5;   // the pine
  g.userData.tick = (t) => { phoenix.position.y = 5.15 + Math.sin(t * 2) * 0.03; };
  return g;
}

export function pagodaJp(): P {
  const g = group();
  for (let i = 0; i < 5; i++) { const s = 1.6 - i * 0.2; add(g, box(s, 0.9, s, JP.wood), 0, 0.45 + i * 1.1, 0); const r = add(g, box(s + 1.0, 0.1, s + 1.0, JP.tile), 0, 1.0 + i * 1.1, 0); r.rotation.y = 0; for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, box(0.4, 0.06, 0.4, JP.tile), sx * (s / 2 + 0.4), 1.12 + i * 1.1, sz * (s / 2 + 0.4)).rotation.set(-sz * 0.3, 0, sx * 0.3); }
  add(g, cyl(0.04, 0.06, 1.6, JP.gold, 6), 0, 6.2, 0); for (let k = 0; k < 5; k++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.16 - k * 0.02, 0.02, 4, 8), mat(JP.gold)), 0, 5.7 + k * 0.25, 0).rotation.x = Math.PI / 2;
  return g;
}

/** A sakura tree; petals drift down when poked. */
export function sakura(s = 1): P {
  const g = group();
  add(g, cyl(0.1 * s, 0.16 * s, 1.4 * s, "#4a3526", 6), 0, 0.7 * s, 0); for (const sd of [-1, 1]) add(g, cyl(0.05 * s, 0.07 * s, 0.8 * s, "#4a3526", 5), sd * 0.35 * s, 1.5 * s, 0).rotation.z = -sd * 0.7;
  const crown = new THREE.Group(); crown.position.y = 1.9 * s; g.add(crown);
  add(crown, ball(0.9 * s, JP.sakura, 9), 0, 0, 0).scale.y = 0.75; add(crown, ball(0.6 * s, "#f8c9d6", 8), 0.6 * s, 0.2 * s, 0.2 * s); add(crown, ball(0.55 * s, "#f3a6bc", 8), -0.6 * s, 0.1 * s, -0.2 * s); add(crown, ball(0.5 * s, "#f8c9d6", 7), 0.1 * s, 0.4 * s, -0.5 * s);
  const petals: { m: THREE.Mesh; v: THREE.Vector3; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; for (let i = 0; i < 14; i++) { const m = box(0.08 * s, 0.01, 0.06 * s, i % 2 ? JP.sakura : "#f8c9d6"); m.position.set((rnd() - 0.5) * 1.6 * s, (1.6 + rnd() * 0.8) * s, (rnd() - 0.5) * 1.6 * s); g.add(m); petals.push({ m, v: new THREE.Vector3((rnd() - 0.5) * 0.6, -0.3 - rnd() * 0.3, (rnd() - 0.5) * 0.6), life: 0 }); } };
  g.userData.tick = (t, dt) => { crown.rotation.z = Math.sin(t * 1.1) * 0.02 + (shake > 0 ? Math.sin(t * 20) * 0.08 * shake : 0); if (shake > 0) shake = Math.max(0, shake - dt * 1.0); for (let i = petals.length - 1; i >= 0; i--) { const p = petals[i]; p.life += dt; p.m.position.addScaledVector(p.v, dt); p.m.position.x += Math.sin(t * 3 + i) * dt * 0.4; p.m.rotation.x += dt * 3; p.m.rotation.z += dt * 2; if (p.m.position.y < 0.02 || p.life > 6) { g.remove(p.m); petals.splice(i, 1); } } };
  return g;
}

/** A stone lantern. */
export function stoneLantern(s = 1): P {
  const g = group();
  add(g, cyl(0.25 * s, 0.3 * s, 0.9 * s, "#8f857a", 6), 0, 0.45 * s, 0); add(g, box(0.5 * s, 0.4 * s, 0.5 * s, "#8f857a"), 0, 1.1 * s, 0); add(g, box(0.16 * s, 0.2 * s, 0.02, "#f2e6a0"), 0, 1.1 * s, 0.26 * s); add(g, cone(0.5 * s, 0.3 * s, "#8f857a", 4), 0, 1.45 * s, 0).rotation.y = Math.PI / 4; add(g, ball(0.08 * s, "#8f857a", 5), 0, 1.65 * s, 0);
  return g;
}

// ---------- Fuji & the countryside ----------

export function fuji(): P {
  const g = group();
  const geo = new THREE.ConeGeometry(10, 12, 14, 4); const pos = geo.attributes.position as THREE.BufferAttribute; const col: number[] = []; const slope = new THREE.Color("#5c6b8c"), foot = new THREE.Color("#6f9f5f"), snow = new THREE.Color("#f7f5f0");
  for (let i = 0; i < pos.count; i++) { const f = (pos.getY(i) + 6) / 12; const a = Math.atan2(pos.getZ(i), pos.getX(i)); const r = Math.hypot(pos.getX(i), pos.getZ(i)); const flare = 1 + (1 - f) * 0.35; if (r > 0.01) { pos.setX(i, Math.cos(a) * r * flare * (1 + Math.sin(a * 5) * 0.02)); pos.setZ(i, Math.sin(a) * r * flare * (1 + Math.sin(a * 5) * 0.02)); } const c = f > 0.68 + Math.sin(a * 7) * 0.03 ? snow : f < 0.25 ? foot.clone().lerp(slope, f / 0.25) : slope; col.push(c.r, c.g, c.b); }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true })); m.position.y = 6; m.castShadow = true; m.receiveShadow = true; g.add(m);
  add(g, cyl(1.4, 1.8, 0.4, "#5c6b8c", 12), 0, 11.9, 0);   // the crater rim
  const cloud = new THREE.Group(); for (let k = 0; k < 4; k++) add(cloud, ball(0.9 - k * 0.1, JP.white, 7), -1.2 + k * 0.8, Math.sin(k) * 0.2, 0).scale.y = 0.6; cloud.position.set(6, 8.5, 2); g.add(cloud);
  g.userData.tick = (t) => { cloud.position.x = 6 + Math.sin(t * 0.2) * 1.5; };
  return g;
}

/** A hot spring in the rocks with snow monkeys soaking; water added by the layout. */
export function onsen(): P {
  const g = group();
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; add(g, ball(0.45 + (k % 3) * 0.12, "#8f857a", 6), Math.cos(a) * 2.4, 0.25, Math.sin(a) * 1.8).scale.y = 0.7; }
  const monkeys: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const a = i * 1.9 + 0.4; const mk = new THREE.Group(); mk.position.set(Math.cos(a) * 1.3, 0.1, Math.sin(a) * 0.9); mk.rotation.y = -a + Math.PI / 2; g.add(mk); monkeys.push(mk); add(mk, ball(0.22, "#8a7a6a", 7), 0, 0.2, 0).scale.y = 0.8; const head = add(mk, ball(0.16, "#8a7a6a", 7), 0, 0.5, 0.05); add(head, ball(0.1, "#e8a4a0", 6), 0, -0.02, 0.1); for (const sd of [-1, 1]) add(head, ball(0.02, "#2a2a2e", 4), sd * 0.05, 0.04, 0.16); for (const sd of [-1, 1]) add(head, ball(0.04, "#8a7a6a", 4), sd * 0.15, 0.02, 0); add(mk, cyl(0.1, 0.12, 0.08, JP.white, 6), 0, 0.68, 0.05); }   // a folded towel on the head
  add(g, box(0.6, 0.8, 0.6, JP.wood), -3.0, 0.4, 0.4); add(g, cone(0.6, 0.3, JP.tile, 4), -3.0, 0.95, 0.4).rotation.y = Math.PI / 4; add(g, box(0.4, 0.5, 0.02, JP.indigo), -3.0, 0.5, 0.71);   // the bathhouse hut
  for (let k = 0; k < 3; k++) add(g, ball(0.22, JP.white, 6), 2.8 + (k % 2) * 0.4, 0.15, -1.0 + k * 0.5).scale.y = 0.6;   // snow
  g.userData.steam = new THREE.Vector3(0, 0.6, 0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(monkeys[0], "あったかい~ So warm!", 1.0, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); monkeys.forEach((mk, i) => { mk.position.y = 0.1 + Math.sin(t * 1.5 + i) * 0.03 + k * Math.abs(Math.sin(t * 8 + i)) * 0.3; mk.rotation.z = k * Math.sin(t * 10 + i) * 0.15; }); };
  return g;
}

/** A rice paddy with a farmer in a straw hat and a scarecrow. */
export function paddyJp(): P {
  const g = group();
  add(g, box(7, 0.14, 4.2, "#6b5a3a"), 0, 0.07, 0); add(g, box(6.6, 0.04, 3.8, "#8fd0dc"), 0, 0.15, 0);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) add(g, cone(0.08, 0.5, "#7fbf3a", 4), -3.0 + c * 0.46, 0.4, -1.6 + r * 0.8);
  for (const [z, s] of [[-2.2, 1], [2.2, 1]] as [number, number][]) add(g, box(7.2, 0.12, 0.3, "#8a6a4a"), 0, 0.2, z * s);
  const farmer = local(JP.indigo, { strawHat: true }); add(g, farmer, 3.9, 0, 1.5); farmer.rotation.y = -1.2;
  add(g, cyl(0.03, 0.03, 1.4, JP.wood, 4), 1.0, 0.85, 0); add(g, box(0.7, 0.05, 0.05, JP.wood), 1.0, 1.2, 0); add(g, box(0.4, 0.4, 0.2, JP.indigo), 1.0, 1.1, 0); add(g, cone(0.3, 0.16, C.straw, 9), 1.0, 1.5, 0);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(farmer, "お米! Rice!", 1.4, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); if (farmer.userData.upper) farmer.userData.upper.rotation.x = 0.2 + k * Math.sin(t * 6) * 0.3; };
  return g;
}

/** A field of cabbages and kabocha pumpkins, with a farmer and a wheelbarrow. */
export function cabbagePumpkinField(): P {
  const g = group();
  add(g, box(7.5, 0.2, 4.4, "#6b4a32"), 0, 0.1, 0);
  const heads: THREE.Mesh[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const cab = add(g, ball(0.28, r === 1 ? "#8aa860" : "#a3d18a", 8), -3.2 + c * 0.8, 0.42, -1.5 + r * 0.9); cab.scale.y = 0.75; for (let l = 0; l < 4; l++) add(cab, ball(0.16, "#7fbf3a", 6), Math.cos(l * 1.6) * 0.22, -0.05, Math.sin(l * 1.6) * 0.22).scale.y = 0.6; heads.push(cab); }
  for (let c = 0; c < 8; c++) { const pk = add(g, ball(0.26, "#2f5d3f", 8), -3.0 + c * 0.85, 0.42, 1.6); pk.scale.y = 0.65; for (let k = 0; k < 6; k++) add(pk, box(0.03, 0.4, 0.03, "#1f3a1a"), Math.cos(k * 1.05) * 0.24, 0, Math.sin(k * 1.05) * 0.24); add(pk, cyl(0.04, 0.05, 0.12, "#8a6a3a", 5), 0, 0.28, 0); add(g, box(0.5, 0.02, 0.3, "#5f9a4a"), -3.0 + c * 0.85 + 0.35, 0.22, 1.9); heads.push(pk); }
  add(g, box(0.7, 0.4, 0.5, "#3f6fb5"), 4.4, 0.4, 0.4); add(g, cyl(0.2, 0.2, 0.1, "#2a2a2e", 8), 4.7, 0.2, 0.4).rotation.z = Math.PI / 2; add(g, box(0.05, 0.05, 0.9, JP.wood), 4.2, 0.5, 0.9).rotation.x = -0.4; for (let k = 0; k < 3; k++) add(g, ball(0.16, "#2f5d3f", 6), 4.3 + (k % 2) * 0.2, 0.7, 0.3 + k * 0.12).scale.y = 0.65;   // the wheelbarrow of pumpkins
  const farmer = local("#3f5f8f", { strawHat: true, apron: true }); add(g, farmer, 4.0, 0, 1.8); farmer.rotation.y = 2.4;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "かぼちゃとキャベツ! Pumpkins & cabbages!", 1.4, 1600); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); heads.forEach((h, i) => { h.position.y = 0.42 + k * Math.max(0, Math.sin(t * 9 + i * 0.5)) * 0.3; }); if (farmer.userData.upper) farmer.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** A miso brewery: cedar vats with weighted lids, koji trays, soy barrels, a brewer with a paddle. */
export function misoBrewery(): P {
  const g = group();
  add(g, box(5.0, 2.4, 3.2, JP.plaster), 0, 1.2, -1.2); add(g, box(5.4, 0.16, 3.6, JP.tile), 0, 2.5, -1.2); const roof = add(g, box(5.6, 0.12, 2.2, JP.tile), 0, 3.0, -1.2); roof.rotation.x = 0.0; void roof; for (const sd of [-1, 1]) add(g, box(5.6, 0.12, 2.0, JP.tile), 0, 2.95, -1.2 + sd * 0.9).rotation.x = -sd * 0.5;
  add(g, box(1.2, 0.5, 0.04, JP.indigo), 0, 2.0, 0.42); add(g, ball(0.32, "#4a5a3a", 8), 1.8, 2.2, 0.4);   // the noren and the cedar sugidama
  const vats: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const v = new THREE.Group(); v.position.set(-1.6 + i * 1.3, 0, 0.9); g.add(v); vats.push(v); add(v, cyl(0.5, 0.45, 0.9, "#a37a4f", 12), 0, 0.45, 0); for (let k = 0; k < 2; k++) add(v, new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.03, 4, 14), mat("#5a3d28")), 0, 0.25 + k * 0.4, 0).rotation.x = Math.PI / 2; add(v, cyl(0.46, 0.46, 0.06, "#8a5a2a"), 0, 0.92, 0); for (let k = 0; k < 4; k++) add(v, ball(0.12, "#8f857a", 6), Math.cos(k * 1.6) * 0.25, 1.02, Math.sin(k * 1.6) * 0.25).scale.y = 0.7; }   // the stones on the lids
  for (let k = 0; k < 3; k++) { const tr = add(g, box(0.7, 0.06, 0.4, "#c9a86a"), 1.9, 0.5 + k * 0.28, 1.0); add(tr, box(0.62, 0.05, 0.32, "#f2e2b8"), 0, 0.05, 0); }   // koji trays
  add(g, cyl(0.28, 0.28, 0.6, "#5a3d28", 10), 2.6, 0.3, 1.6); add(g, box(0.16, 0.14, 0.02, JP.white), 2.6, 0.35, 1.9);   // a soy barrel
  add(g, box(0.3, 0.3, 0.2, "#8e2a22"), -0.6, 0.15, 1.8); add(g, box(0.3, 0.3, 0.2, "#e0c890"), -0.2, 0.15, 1.9);   // red and white miso
  const brewer = local(JP.indigo, { hachimaki: true, apron: true }); add(g, brewer, -0.3, 0, 1.9); brewer.rotation.y = Math.PI; const paddle = add(g, box(0.04, 1.3, 0.1, JP.wood), 0.0, 0.9, 1.5); paddle.rotation.z = 0.3;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(brewer, "味噌 · miso, three winters old", 1.5, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); vats.forEach((v, i) => { v.position.y = k * Math.max(0, Math.sin(t * 8 + i)) * 0.2; v.rotation.y += k * dt * 2; }); paddle.rotation.z = 0.3 + k * Math.sin(t * 8) * 0.4; if (brewer.userData.upper) brewer.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

// ---------- the coast ----------

export function fishingBoat(color = JP.white): P {
  const g = group();
  add(g, box(2.8, 0.5, 1.1, color), 0, 0.3, 0); add(g, box(2.8, 0.08, 1.14, JP.vermilion), 0, 0.12, 0); add(g, box(0.5, 0.3, 0.9, color), 1.1, 0.7, 0).rotation.z = 0.2;
  add(g, box(0.9, 0.8, 0.9, color), -0.3, 0.9, 0); add(g, box(0.9, 0.06, 0.95, JP.indigo), -0.3, 1.33, 0); add(g, box(0.6, 0.35, 0.05, JP.glass), -0.3, 1.0, 0.47);
  for (let k = 0; k < 3; k++) add(g, cyl(0.06, 0.06, 0.4, "#2a2a2e", 6), -1.0 + k * 0.3, 0.65, 0.5).rotation.x = Math.PI / 2;   // fishing lights
  add(g, box(0.5, 0.3, 0.4, "#3fa2b0"), 0.5, 0.7, 0.2); for (let k = 0; k < 3; k++) add(g, box(0.3, 0.06, 0.12, k ? "#f0946a" : "#c9cfd6"), 0.45 + (k % 2) * 0.1, 0.88, 0.05 + k * 0.12);   // the ice box with the catch
  const skipper = local(JP.indigo, { hachimaki: true }); skipper.scale.setScalar(0.85); add(g, skipper, -0.9, 0.55, -0.1);
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 1.1) * 0.03; };
  return g;
}

/** A fishing port: a pier with a warehouse, crates of salmon and cod on ice, gulls, and the fish jumping when poked. */
export function fishingPort(): P {
  const g = group();
  add(g, box(6.0, 0.4, 2.4, "#8a6a4a"), 0, 0.3, 0); for (let k = 0; k < 7; k++) add(g, box(0.16, 0.9, 0.16, JP.darkWood), -2.8 + k * 0.95, 0.15, 1.15);
  add(g, box(2.4, 1.6, 2.0, JP.plaster), -1.6, 1.3, -0.1); add(g, box(2.7, 0.14, 2.3, JP.tile), -1.6, 2.15, -0.1); add(g, box(1.2, 0.4, 0.02, JP.indigo), -1.6, 1.9, 0.92); add(g, box(0.8, 1.0, 0.04, JP.darkWood), -1.6, 1.0, 0.92);
  const crates: THREE.Group[] = []; const fish: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) { const c = new THREE.Group(); c.position.set(0.3 + (i % 2) * 0.9, 0.5, -0.5 + Math.floor(i / 2) * 0.9); g.add(c); crates.push(c); add(c, box(0.8, 0.3, 0.6, i % 2 ? "#3fa2b0" : "#c9a86a"), 0, 0.15, 0); add(c, box(0.72, 0.06, 0.52, JP.white), 0, 0.33, 0); for (let k = 0; k < 3; k++) { const f = add(c, box(0.5, 0.08, 0.12, i % 2 ? "#f0946a" : "#8fa3b5"), 0, 0.4, -0.18 + k * 0.18); add(f, cone(0.06, 0.12, i % 2 ? "#f0946a" : "#8fa3b5", 4), 0.3, 0, 0).rotation.z = -Math.PI / 2; fish.push(f); } }   // salmon and cod
  add(g, cyl(0.24, 0.2, 0.4, "#c9cfd6", 10), 2.4, 0.7, 0.6); for (let k = 0; k < 4; k++) add(g, ball(0.08, "#8fa3b5", 5), 2.3 + (k % 2) * 0.15, 0.95, 0.5 + Math.floor(k / 2) * 0.15);   // a bucket of the catch
  for (let k = 0; k < 3; k++) add(g, cyl(0.03, 0.03, 1.6, JP.wood, 4), 2.6, 1.3, -0.8 + k * 0.4); add(g, box(0.06, 0.02, 1.2, JP.wood), 2.6, 2.1, -0.4); for (let k = 0; k < 6; k++) add(g, box(0.04, 0.5, 0.12, "#2a3a2a"), 2.6, 1.8, -0.9 + k * 0.2);   // kombu drying
  const fisher = local(JP.indigo, { hachimaki: true, apron: true }); add(g, fisher, 1.6, 0.5, 0.6); fisher.rotation.y = 0.5; const buyer = local(JP.white, { cap: true }); add(g, buyer, 0.8, 0.5, 0.9); buyer.rotation.y = Math.PI;
  const gull = ball(0.08, JP.white, 5); gull.scale.set(1.6, 0.6, 1); g.add(gull);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(fisher, "大漁! Big catch!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); fish.forEach((f, i) => { f.position.y = 0.4 + k * Math.max(0, Math.sin(t * 10 + i * 0.9)) * 0.45; f.rotation.z = k * Math.sin(t * 10 + i) * 0.6; }); gull.position.set(1.0 + Math.cos(t * 0.8) * 2.5, 2.4 + Math.sin(t * 2) * 0.2, Math.sin(t * 0.8) * 1.5); gull.rotation.y = -t * 0.8; if (fisher.userData.upper) fisher.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** A vermilion torii standing in the sea. */
export function floatingTorii(): P {
  const g = group();
  for (const sd of [-1, 1]) { add(g, cyl(0.16, 0.2, 3.6, JP.vermilion, 8), sd * 1.3, 1.8, 0); for (const sz of [-1, 1]) add(g, cyl(0.08, 0.1, 2.6, JP.vermilion, 6), sd * 1.3, 1.3, sz * 0.5).rotation.x = sz * 0.2; }
  add(g, box(3.6, 0.25, 0.3, JP.vermilion), 0, 3.5, 0); add(g, box(2.9, 0.2, 0.2, JP.vermilion), 0, 3.0, 0); add(g, box(3.9, 0.14, 0.4, "#2a2a2e"), 0, 3.72, 0); add(g, box(0.16, 0.3, 0.16, JP.vermilion), 0, 3.25, 0);
  return g;
}

/** The shinkansen: a long white train with a duck-bill nose and a blue stripe. */
export function shinkansen(cars = 4): P {
  const g = group();
  const len = 3.2;
  for (let i = 0; i < cars; i++) { const x = -i * (len + 0.1); add(g, box(len, 0.9, 1.0, JP.white), x, 0.75, 0); add(g, box(len + 0.02, 0.14, 1.02, "#2f6fb5"), x, 0.75, 0); for (let k = 0; k < 6; k++) for (const sd of [-1, 1]) add(g, box(0.3, 0.22, 0.02, "#2a3a4a"), x - len / 2 + 0.4 + k * 0.5, 0.95, sd * 0.51); add(g, box(len, 0.1, 0.6, "#8c9096"), x, 0.25, 0); }
  const nose = add(g, box(1.6, 0.9, 1.0, JP.white), len / 2 + 0.7, 0.75, 0); nose.scale.set(1, 0.55, 0.9); nose.position.y = 0.55; add(g, box(1.2, 0.5, 0.8, JP.white), len / 2 + 0.5, 0.95, 0); add(g, box(0.6, 0.3, 0.7, "#2a3a4a"), len / 2 + 0.9, 0.95, 0);
  add(g, box(2.2, 0.14, 1.02, "#2f6fb5"), len / 2 + 0.6, 0.7, 0);
  return g;
}

export function bambooGrove(n = 12): P {
  const g = group();
  for (let i = 0; i < n; i++) { const b = tree("bamboo", 0.9 + rnd() * 0.5); b.position.set((rnd() - 0.5) * 5, 0, (rnd() - 0.5) * 3.5); g.add(b); }
  const walker = local(JP.white, { kimono: JP.vermilion }); add(g, walker, 0.4, 0, 2.2); walker.rotation.y = 0.5;
  return g;
}

export const JAPAN_PROPS: Record<string, () => P> = {
  ramenShop, izakaya, tonkatsuShop, kaisekiHouse, shibuya, tokyoTower, toriiPath, kinkakuji, pagodaJp, fuji, onsen, paddyJp, cabbagePumpkinField, misoBrewery, fishingPort, floatingTorii, bambooGrove, none: () => group(),
};

export const JAPAN_ICONS: Record<string, () => P> = {
  fishJp: () => { const g = group(); for (let k = 0; k < 2; k++) { const f = add(g, box(0.5, 0.1, 0.16, k ? "#8fa3b5" : "#f0946a"), -0.1, 0.06 + k * 0.12, (k - 0.5) * 0.2); add(f, cone(0.08, 0.15, k ? "#8fa3b5" : "#f0946a", 4), 0.3, 0, 0).rotation.z = -Math.PI / 2; } return g; },
  misoSoy: () => { const g = group(); add(g, cyl(0.22, 0.2, 0.36, "#a37a4f", 10), -0.2, 0.18, 0); add(g, cyl(0.2, 0.2, 0.04, "#8a5a2a", 10), -0.2, 0.38, 0); add(g, cyl(0.07, 0.07, 0.3, "#2a2a2e", 8), 0.3, 0.15, 0.1); add(g, box(0.1, 0.12, 0.01, JP.vermilion), 0.3, 0.15, 0.18); add(g, box(0.2, 0.2, 0.14, "#e0c890"), 0.25, 0.1, -0.25); return g; },
  vegJp: () => { const g = group(); add(g, ball(0.2, "#a3d18a", 8), -0.25, 0.2, 0).scale.y = 0.8; add(g, ball(0.22, "#2f5d3f", 8), 0.25, 0.2, 0.05).scale.y = 0.7; add(g, cyl(0.03, 0.04, 0.1, "#8a6a3a", 5), 0.25, 0.38, 0.05); return g; },
  riceJp: () => { const g = group(); add(g, cyl(0.22, 0.16, 0.16, JP.white, 12), 0, 0.08, 0); add(g, ball(0.2, JP.white, 9), 0, 0.18, 0).scale.y = 0.6; add(g, box(0.1, 0.02, 0.12, "#1f3a1a"), 0, 0.31, 0); add(g, ball(0.05, JP.vermilion, 5), 0, 0.32, 0); return g; },
  wheatJp: () => { const g = group(); add(g, cyl(0.24, 0.17, 0.2, "#2a2a2e", 12), 0, 0.1, 0); add(g, cyl(0.22, 0.22, 0.03, "#e0a52c", 12), 0, 0.2, 0); for (let k = 0; k < 6; k++) add(g, cyl(0.012, 0.012, 0.3, "#f2d78a", 3), -0.12 + k * 0.05, 0.22, 0).rotation.z = 1.2; return g; },
  dashi: () => { const g = group(); for (let k = 0; k < 4; k++) add(g, box(0.04, 0.4, 0.12, "#2a3a2a"), -0.3 + k * 0.2, 0.2, 0).rotation.x = 0.2; add(g, box(0.4, 0.14, 0.2, "#8a5a3a"), 0.4, 0.07, 0.1); for (let s = 0; s < 4; s++) add(g, box(0.08, 0.01, 0.06, "#e8c9a0"), 0.3 + s * 0.06, 0.16, 0.1 + (s % 2) * 0.05); return g; },
  sesameGinger: () => { const g = group(); add(g, cyl(0.16, 0.12, 0.14, "#8a6a4a", 10), -0.2, 0.07, 0); for (let k = 0; k < 8; k++) add(g, ball(0.02, "#e9d7a8", 4), -0.2 + Math.cos(k) * 0.08, 0.15, Math.sin(k) * 0.08); add(g, box(0.3, 0.12, 0.16, "#e9c46a"), 0.25, 0.06, 0); add(g, box(0.14, 0.1, 0.1, "#e9c46a"), 0.4, 0.12, 0.08); add(g, cyl(0.02, 0.02, 0.3, "#7fbf3a", 4), 0.0, 0.15, 0.2).rotation.z = 1.3; return g; },
  umami: () => { const g = group(); add(g, cyl(0.06, 0.06, 0.32, "#2a2a2e", 8), -0.2, 0.16, 0); add(g, box(0.09, 0.12, 0.01, JP.vermilion), -0.2, 0.16, 0.07); add(g, box(0.24, 0.2, 0.16, "#8e2a22"), 0.15, 0.1, 0); add(g, cyl(0.08, 0.06, 0.1, JP.white, 8), 0.4, 0.05, 0.15); return g; },
  ramen: () => { const g = group(); add(g, cyl(0.26, 0.18, 0.2, "#2a2a2e", 12), 0, 0.1, 0); add(g, cyl(0.24, 0.24, 0.03, "#e0a52c", 12), 0, 0.2, 0); for (let k = 0; k < 6; k++) add(g, cyl(0.012, 0.012, 0.3, "#f2d78a", 3), -0.12 + k * 0.05, 0.22, 0).rotation.z = 1.2; add(g, ball(0.07, "#e8a95a", 6), 0.08, 0.24, 0.06).scale.set(1.3, 0.5, 1); add(g, ball(0.06, JP.white, 6), -0.08, 0.24, -0.05); add(g, box(0.1, 0.15, 0.01, "#1f3a1a"), -0.12, 0.28, 0.1); return g; },
  robata: () => { const g = group(); add(g, box(0.6, 0.16, 0.3, "#2a2a2e"), 0, 0.08, 0); for (let k = 0; k < 4; k++) add(g, box(0.1, 0.03, 0.06, "#f08a2a"), -0.2 + k * 0.13, 0.17, 0); const f = add(g, box(0.4, 0.06, 0.16, "#f0946a"), 0, 0.24, 0); for (let s = 0; s < 3; s++) add(f, box(0.02, 0.07, 0.17, "#f4d2b8"), -0.12 + s * 0.12, 0, 0); return g; },
  saikyo: () => { const g = group(); add(g, box(0.5, 0.03, 0.36, "#1a1a1e"), 0, 0.02, 0); const f = add(g, box(0.28, 0.08, 0.2, "#e0a852"), -0.05, 0.08, 0); for (let k = 0; k < 3; k++) add(f, box(0.02, 0.05, 0.2, "#c9862a"), -0.08 + k * 0.08, 0.02, 0); add(g, cyl(0.06, 0.05, 0.05, JP.white, 8), 0.18, 0.06, 0.1); add(g, ball(0.03, JP.moss, 5), 0.17, 0.06, -0.1); return g; },
  tonkatsu: () => { const g = group(); add(g, cyl(0.24, 0.2, 0.04, JP.white, 12), 0, 0.02, 0); add(g, box(0.3, 0.08, 0.2, "#c9862a"), -0.06, 0.08, 0); const cab = add(g, ball(0.13, "#c9e0a0", 8), 0.15, 0.08, 0.1); cab.scale.y = 0.5; return g; },
  shibuya: () => { const s = shibuya(); s.scale.setScalar(0.11); return s; },
  tokyoTower: () => { const t = tokyoTower(); t.scale.setScalar(0.06); return t; },
  torii: () => { const t = floatingTorii(); t.scale.setScalar(0.16); return t; },
  kinkakuji: () => { const k = kinkakuji(); k.scale.setScalar(0.14); return k; },
  fuji: () => { const f = fuji(); f.scale.setScalar(0.05); return f; },
  onsen: () => { const o = onsen(); o.scale.setScalar(0.18); return o; },
  shinkansen: () => { const s = shinkansen(2); s.scale.setScalar(0.12); return s; },
  sakura: () => { const s = sakura(0.32); return s; },
  bamboo: () => { const b = tree("bamboo", 0.35); return b; },
  port: () => { const b = fishingBoat(); b.scale.setScalar(0.25); return b; },
};
