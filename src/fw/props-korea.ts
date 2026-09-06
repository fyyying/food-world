/** Korean props: hanok, palace and temple, onggi jars, barbecue grills, street tents, Jeju's volcano, divers and stone grandfathers. */
import * as THREE from "three";
import { mat, add, rnd, C, chineseRoof, person, cow, bubble, wear, tree, mountain, type P } from "./props";
import { citrusTree } from "./props-italy";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate * 0.7); return k; } }; }

export const KR = { giwa: "#3b3d44", wall: "#f3ede0", wood: "#9a6b45", woodDark: "#5a3d28", stone: "#9a9891", dancheongG: "#2f7f6a", dancheongR: "#b83a3a", dancheongB: "#3c5fa8", onggi: "#5a3a2a", tent: "#f08a2a", basalt: "#3a3a3d", pine: "#3f6b3f" };

// ---------- buildings ----------

/** Hanok: stone base, wooden columns, whitewashed walls, lattice doors and a gently curved dark-tile roof. */
export function hanok(w = 3.4, d = 2.6, h = 1.8, opts: { lattice?: boolean; walls?: string } = {}): P {
  const g = group();
  add(g, box(w + 0.6, 0.35, d + 0.6, KR.stone), 0, 0.17, 0);
  add(g, box(w, h, d, opts.walls ?? KR.wall), 0, 0.35 + h / 2, 0);
  for (const x of [-w / 2 + 0.1, w / 2 - 0.1]) for (const z of [-d / 2 + 0.05, d / 2 - 0.05]) add(g, box(0.16, h, 0.16, KR.wood), x, 0.35 + h / 2, z);
  add(g, box(w + 0.1, 0.14, d + 0.1, KR.woodDark), 0, 0.35 + h - 0.07, 0);
  // lattice doors on the front
  const n = Math.max(2, Math.round(w / 1.0));
  for (let i = 0; i < n; i++) { const x = -w / 2 + (i + 0.5) * (w / n); add(g, box(0.72, h * 0.75, 0.05, "#e8dcc0"), x, 0.35 + h * 0.45, d / 2 + 0.03); for (let k = 1; k < 3; k++) { add(g, box(0.72, 0.03, 0.06, KR.woodDark), x, 0.35 + h * 0.45 - h * 0.3 + k * h * 0.25, d / 2 + 0.05); add(g, box(0.03, h * 0.75, 0.06, KR.woodDark), x - 0.36 + k * 0.24, 0.35 + h * 0.45, d / 2 + 0.05); } }
  add(g, chineseRoof(w + 1.3, d + 1.2, 1.0, KR.giwa, 0.18), 0, 0.35 + h, 0);
  add(g, box(w * 0.9, 0.1, 0.9, KR.wood), 0, 0.42, d / 2 + 0.5);   // maru, the wooden veranda
  return g;
}

export function stoneWall(len: number): P {
  const g = group();
  add(g, box(len, 0.9, 0.35, "#8a8580"), 0, 0.45, 0);
  add(g, chineseRoof(len + 0.3, 0.9, 0.22, KR.giwa, 0.05), 0, 0.9, 0);
  for (let i = 0; i < Math.round(len / 0.7); i++) add(g, box(0.28, 0.2, 0.37, i % 2 ? "#a29d95" : "#7f7a74"), -len / 2 + 0.4 + i * 0.7, 0.3 + (i % 3) * 0.2, 0);
  return g;
}

/** The palace gate: stone arch base, two storeys of painted timber, a great hipped roof, and guards. */
export function palaceGate(): P {
  const g = group();
  add(g, box(10, 2.4, 4, "#a8a49c"), 0, 1.2, 0);
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 4.2, 14, 1, false, 0, Math.PI), mat("#2a2a2e", { side: THREE.DoubleSide })); arch.rotation.x = Math.PI / 2; arch.rotation.z = Math.PI / 2; arch.position.set(0, 1.0, 0); g.add(arch);
  add(g, box(2.0, 1.0, 4.3, "#2a2a2e"), 0, 0.5, 0);
  for (let s = 0; s < 2; s++) {
    const y = 2.4 + s * 2.0, w = 8.2 - s * 0.8, d = 3.2 - s * 0.4;
    add(g, box(w, 1.6, d, KR.dancheongR), 0, y + 0.8, 0);
    for (let i = 0; i < 6; i++) add(g, cyl(0.16, 0.18, 1.6, KR.dancheongR, 8), -w / 2 + 0.4 + i * (w - 0.8) / 5, y + 0.8, d / 2 + 0.1);
    add(g, box(w + 0.4, 0.25, d + 0.3, KR.dancheongG), 0, y + 1.65, 0);
    add(g, box(w + 0.2, 0.12, d + 0.2, KR.dancheongB), 0, y + 1.5, 0);
    add(g, chineseRoof(w + 2.0, d + 1.8, 1.0, KR.giwa, 0.3), 0, y + 1.75, 0);
  }
  add(g, box(2.6, 0.5, 0.06, "#1f2430"), 0, 3.9, 1.8); add(g, box(2.3, 0.3, 0.02, C.gold), 0, 3.9, 1.84);
  // guards in red and blue with flags
  for (const sd of [-1, 1]) { const gd = person(sd < 0 ? "#b83a3a" : "#3c5fa8"); wear(gd, cone(0.28, 0.28, "#1f1f1f", 8), 0, 1.28, 0); add(g, gd, sd * 2.6, 0, 2.6); add(g, cyl(0.02, 0.02, 2.2, KR.woodDark, 4), sd * 3.0, 1.1, 2.6); add(g, box(0.5, 0.35, 0.02, sd < 0 ? "#e0a52c" : "#b83a3a"), sd * 3.25, 1.9, 2.6); }
  return g;
}

/** A palace throne hall on a double stone terrace behind the gate. */
export function palaceHall(): P {
  const g = group();
  add(g, box(14, 0.6, 9, "#b8b3a8"), 0, 0.3, 0); add(g, box(12, 0.6, 7.5, "#a8a49c"), 0, 0.9, 0);
  add(g, box(9, 3.2, 5.5, KR.dancheongR), 0, 2.8, -0.5);
  for (let i = 0; i < 7; i++) add(g, cyl(0.18, 0.2, 3.2, KR.dancheongR, 8), -4.2 + i * 1.4, 2.8, 2.6);
  add(g, box(10.4, 0.3, 6.6, KR.dancheongG), 0, 4.55, -0.2);
  add(g, chineseRoof(12, 8, 1.0, KR.giwa, 0.32), 0, 4.7, -0.2);
  add(g, box(6, 1.6, 4, KR.dancheongR), 0, 6.4, -0.6);
  add(g, box(7, 0.25, 4.8, KR.dancheongG), 0, 7.25, -0.6);
  add(g, chineseRoof(8.6, 6, 1.2, KR.giwa, 0.4), 0, 7.4, -0.6);
  for (let i = 0; i < 3; i++) add(g, box(0.5, 0.6, 0.5, "#8a8580"), -3 + i * 3, 1.5, 4.0);
  return g;
}

export function templeKorea(): P {
  const g = group();
  add(g, box(7, 0.5, 5.5, "#a8a49c"), 0, 0.25, 0);
  add(g, box(4.6, 2.6, 3.2, "#8a5a3c"), 0, 1.8, -0.4);
  for (let i = 0; i < 5; i++) add(g, cyl(0.16, 0.18, 2.6, KR.dancheongR, 8), -2 + i, 1.8, 1.4);
  add(g, box(5.6, 0.3, 4.2, KR.dancheongG), 0, 3.25, 0);
  add(g, chineseRoof(7, 5.4, 1.1, KR.giwa, 0.32), 0, 3.4, 0);
  add(g, box(1.2, 1.6, 0.08, "#4a3222"), 0, 1.4, 1.22);
  // rows of paper lanterns in pink, yellow and green, and a stone pagoda
  const lanterns: THREE.Mesh[] = [];
  for (let r = 0; r < 3; r++) { add(g, cyl(0.015, 0.015, 6.6, KR.woodDark, 3), 0, 3.6 - r * 0.05, 2.4 + r * 0.9).rotation.z = Math.PI / 2; for (let i = 0; i < 8; i++) { const l = add(g, cyl(0.16, 0.16, 0.3, ["#e07aa0", "#f2cf3a", "#6fb06a", "#f08a2a"][(i + r) % 4], 8), -3.2 + i * 0.9, 3.3 - r * 0.05, 2.4 + r * 0.9); lanterns.push(l); } }
  for (let i = 0; i < 5; i++) { add(g, box(1.2 - i * 0.18, 0.18, 1.2 - i * 0.18, "#8a8580"), -4.2, 0.6 + i * 0.5, 1.5); add(g, box(0.6 - i * 0.08, 0.32, 0.6 - i * 0.08, "#a29d95"), -4.2, 0.85 + i * 0.5, 1.5); }
  add(g, person("#8a8580"), 3.6, 0.5, 2.0).rotation.y = Math.PI;   // a monk
  g.userData.tick = (t) => lanterns.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.5 + i) * 0.08; });
  return g;
}

/** N Seoul Tower on its hill. */
export function seoulTower(): P {
  const g = group();
  add(g, cyl(5, 6.5, 3.5, "#5f8f56", 12), 0, 1.75, 0);
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; add(g, tree("pine", 0.9), Math.cos(a) * 4.5, 3.0, Math.sin(a) * 4.5); }
  add(g, cyl(0.4, 0.6, 7, "#dfe3e6", 10), 0, 7, 0);
  add(g, cyl(1.5, 1.2, 1.2, "#f4f1ea", 12), 0, 10.6, 0);
  add(g, cyl(1.3, 1.5, 0.5, "#8fc4c9", 12), 0, 11.3, 0);
  add(g, cyl(0.15, 0.3, 4, "#dfe3e6", 6), 0, 13.5, 0);
  add(g, ball(0.2, "#e0483a", 6), 0, 15.6, 0);
  return g;
}

// ---------- food places ----------

/** Jangdokdae: the terrace of onggi jars where kimchi, gochujang and soy sauce ferment. */
export function jangdokdae(): P {
  const g = group();
  add(g, box(6.5, 0.3, 4, "#b8b3a8"), 0, 0.15, 0);
  const lids: { lid: THREE.Group; base: number; ph: number }[] = [];
  const sizes = [0.7, 0.55, 0.62, 0.48, 0.66, 0.5, 0.58, 0.44, 0.6, 0.5];
  sizes.forEach((r, i) => {
    const x = -2.5 + (i % 5) * 1.25, z = -0.9 + Math.floor(i / 5) * 1.8;
    add(g, ball(r, KR.onggi, 12), x, r * 0.9 + 0.3, z).scale.y = 1.15;
    add(g, cyl(r * 0.6, r * 0.7, 0.14, "#4a3020", 12), x, r * 1.9 + 0.3, z);
    const lid = new THREE.Group(); lid.position.set(x, r * 1.98 + 0.3, z); g.add(lid);
    add(lid, cyl(r * 0.75, r * 0.5, 0.16, "#4a3020", 12), 0, 0, 0); add(lid, ball(0.06, "#4a3020", 6), 0, 0.12, 0);
    lids.push({ lid, base: lid.position.y, ph: rnd() * 6 });
  });
  const keeper = add(g, person("#e9d7b8", { apron: true }), 3.8, 0, 1.2); keeper.rotation.y = -1.0;
  add(g, cyl(0.3, 0.24, 0.25, "#a8a49c", 8), 3.6, 0.13, 2.0); add(g, ball(0.2, "#c9413f", 7), 3.6, 0.32, 2.0).scale.y = 0.6;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(keeper, "김치! Kimchi!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); lids.forEach((l) => { l.lid.position.y = l.base + k * Math.abs(Math.sin(t * 12 + l.ph)) * 0.45; l.lid.rotation.z = k * Math.sin(t * 10 + l.ph) * 0.35; l.lid.rotation.y += k * dt * 6; }); };
  return g;
}

/** Gochugaru: chillies drying on mats and a pepper-pounding mortar. */
export function chilliMats(): P {
  const g = group();
  const chillies: THREE.Mesh[] = [];
  for (let m = 0; m < 3; m++) { add(g, box(2.2, 0.06, 1.4, C.straw), -2.4 + m * 2.4, 0.03, 0); for (let i = 0; i < 26; i++) { const c = add(g, cone(0.045, 0.24, "#d3342b", 5), -2.4 + m * 2.4 + (rnd() - 0.5) * 1.9, 0.09, (rnd() - 0.5) * 1.2); c.rotation.z = Math.PI / 2; c.rotation.y = rnd() * 3; chillies.push(c); } }
  add(g, cyl(0.35, 0.3, 0.5, "#8a8580", 10), 3.6, 0.25, 0.5); add(g, cyl(0.05, 0.05, 0.9, KR.wood, 5), 3.7, 0.8, 0.5).rotation.z = 0.5;
  add(g, cyl(0.3, 0.3, 0.06, "#b83a3a", 10), 3.6, 0.53, 0.5);
  const worker = add(g, person("#7a4a3a", { hat: true }), 3.4, 0, -0.9);
  const re = reaction(0.8);
  g.userData.poke = () => { re.poke(); bubble(worker, "고추! Chilli!", 1.5, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); chillies.forEach((c, i) => { c.position.y = 0.09 + k * Math.max(0, Math.sin(t * 11 + i)) * 0.5; c.rotation.y += k * dt * 8; }); const up = (worker.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 8)) * 0.3; };
  return g;
}

/** Korean barbecue house: tabletop charcoal grills, thin beef slices, lettuce leaves, side dishes, diners with tongs. */
export function bbqHouse(): P {
  const g = group();
  add(g, hanok(4.2, 3.0, 1.9), 0, 0, -1.2);
  add(g, box(1.4, 0.5, 0.06, "#1f2430"), 0, 2.0, 0.4); add(g, box(1.2, 0.3, 0.02, C.gold), 0, 2.0, 0.44);
  const tables: { top: THREE.Vector3; slices: THREE.Mesh[] }[] = [];
  const diners: P[] = [];
  for (const x of [-1.6, 1.6]) {
    add(g, box(1.6, 0.08, 1.2, KR.wood), x, 0.72, 1.6); add(g, box(0.12, 0.7, 0.12, KR.woodDark), x, 0.36, 1.6);
    add(g, cyl(0.38, 0.34, 0.16, "#2a2a2e", 14), x, 0.84, 1.6); add(g, cyl(0.34, 0.34, 0.03, "#5a5a5a", 14), x, 0.93, 1.6);
    const slices: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) { const s = add(g, box(0.22, 0.03, 0.14, i % 2 ? "#8e3b2f" : "#a44a3a"), x + Math.cos(i * 1.25) * 0.18, 0.96, 1.6 + Math.sin(i * 1.25) * 0.18); s.rotation.y = i; slices.push(s); }
    for (let i = 0; i < 6; i++) { add(g, cyl(0.09, 0.07, 0.05, "#f7f2e6", 8), x - 0.6 + (i % 3) * 0.25, 0.79, 1.15 + Math.floor(i / 3) * 0.9); add(g, ball(0.05, ["#c9413f", "#8fc26a", "#f2cf3a", "#e8dcc3", "#c9413f", "#3f7a3a"][i], 5), x - 0.6 + (i % 3) * 0.25, 0.84, 1.15 + Math.floor(i / 3) * 0.9); }
    add(g, ball(0.18, "#8fc26a", 7), x + 0.6, 0.82, 1.2).scale.y = 0.5;   // lettuce
    tables.push({ top: new THREE.Vector3(x, 1.0, 1.6), slices });
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.3; const d = person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea"])); (d.userData as { sit?: () => void }).sit?.(); add(g, cyl(0.2, 0.2, 0.4, KR.woodDark, 8), x + Math.cos(a) * 0.95, 0.2, 1.6 + Math.sin(a) * 0.95); add(g, d, x + Math.cos(a) * 0.95, 0.04, 1.6 + Math.sin(a) * 0.95).rotation.y = Math.atan2(x - (x + Math.cos(a) * 0.95), 1.6 - (1.6 + Math.sin(a) * 0.95)); diners.push(d); }
  }
  add(g, box(0.5, 1.4, 0.5, "#5a5550"), -2.4, 2.9, -1.6);
  const tongs = add(g, box(0.04, 0.3, 0.04, "#8c9096"), 1.3, 1.15, 1.9); tongs.rotation.x = 0.6;
  g.userData.steam = new THREE.Vector3(-1.6, 1.1, 1.6);
  g.userData.smoke = new THREE.Vector3(-2.4, 3.65, -1.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(diners[2], "맛있다! Delicious!", 1.4, 1300); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    for (const tb of tables) tb.slices.forEach((s, i) => { s.position.y = 0.96 + k * Math.max(0, Math.sin(t * 12 + i * 1.3)) * 0.4; s.rotation.y += k * dt * 9; s.rotation.x = k * Math.sin(t * 12 + i) * 1.2; });   // slices flipped
    tongs.position.y = 1.15 + k * Math.abs(Math.sin(t * 12)) * 0.45;
    diners.forEach((d, i) => { const up = (d.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.x = 0.15 + Math.sin(t * 1.4 + i) * 0.05 + k * 0.25 * Math.sin(Math.min(1, k * 2) * Math.PI); up.rotation.y = Math.sin(t * 0.6 + i) * 0.2; } });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** A Jeonju hanok restaurant serving bibimbap in stone bowls. */
export function dolsotHouse(): P {
  const g = group();
  add(g, hanok(4.4, 3.0, 1.9), 0, 0, -1.2);
  add(g, box(1.6, 0.5, 0.06, "#1f2430"), 0, 2.0, 0.4); add(g, box(1.4, 0.3, 0.02, C.gold), 0, 2.0, 0.44);
  // low tables on the maru with stone bowls and colourful toppings
  const bowls: THREE.Group[] = [];
  const diners: P[] = [];
  for (const x of [-1.5, 1.5]) {
    add(g, box(1.5, 0.06, 1.0, KR.woodDark), x, 0.5, 1.6);
    for (const dz of [-0.25, 0.25]) {
      const b = new THREE.Group(); b.position.set(x + (dz > 0 ? 0.35 : -0.35), 0.53, 1.6 + dz); g.add(b); bowls.push(b);
      add(b, cyl(0.24, 0.2, 0.18, "#2a2a2e", 12), 0, 0.09, 0); add(b, cyl(0.2, 0.2, 0.04, "#f4ecc8", 12), 0, 0.2, 0);
      const cols = ["#f2cf3a", "#3f7a3a", "#e07a3a", "#c9413f", "#8fc26a", "#e8dcc3"];
      cols.forEach((c, i) => { const a = (i / 6) * Math.PI * 2; add(b, ball(0.05, c, 5), Math.cos(a) * 0.12, 0.24, Math.sin(a) * 0.12); });
      add(b, ball(0.06, "#f2cf3a", 7), 0, 0.26, 0).scale.y = 0.5;   // the egg yolk
    }
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.4; const d = person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea"])); (d.userData as { sit?: () => void }).sit?.(); add(g, d, x + Math.cos(a) * 0.95, 0.04, 1.6 + Math.sin(a) * 0.95).rotation.y = Math.atan2(x - (x + Math.cos(a) * 0.95), 1.6 - (1.6 + Math.sin(a) * 0.95)); d.position.y = -0.3; diners.push(d); }
  }
  const server = add(g, person("#e9d7b8", { apron: true }), 0, 0, 2.6);
  g.userData.steam = new THREE.Vector3(-1.15, 0.9, 1.35);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(server, "비빔밥! Bibimbap!", 1.5, 1300); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    bowls.forEach((b, i) => { b.rotation.y += k * dt * 12; b.position.y = 0.53 + k * Math.abs(Math.sin(t * 10 + i)) * 0.25; });   // bowls stirred
    diners.forEach((d, i) => { const up = (d.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.x = 0.2 + Math.sin(t * 1.4 + i) * 0.05 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); up.rotation.z = Math.sin(t * 0.9 + i) * 0.06; } });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** Gwangjang market: a covered arcade of stalls with orange tents: kimchi tubs, gimbap, tteokbokki, bindaetteok, vegetables, sesame and garlic. */
export function gwangjang(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(15, 9), mat("#cbc3b0")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (const x of [-6.5, -2.2, 2.2, 6.5]) for (const z of [-4, 4]) add(g, cyl(0.1, 0.1, 3.6, "#8c9096", 6), x, 1.8, z);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.08, 9.5), mat("#dfe6ea", { transparent: true, opacity: 0.35 })), 0, 3.7, 0).renderOrder = 3;   // a glass skylight roof, so the alley is visible from above
  for (let i = 0; i < 5; i++) add(g, box(0.15, 0.15, 9.5, "#8c9096"), -6.5 + i * 3.25, 3.62, 0); for (const z of [-4.6, 0, 4.6]) add(g, box(15.5, 0.15, 0.15, "#8c9096"), 0, 3.62, z);
  const vendors: P[] = [];
  const stall = (kind: string) => {
    const s = group();
    add(s, box(2.4, 0.75, 1.2, KR.wood), 0, 0.42, 0); add(s, box(2.4, 0.08, 1.2, KR.woodDark), 0, 0.82, 0);
    for (const x of [-1.1, 1.1]) add(s, cyl(0.04, 0.04, 2.2, "#8c9096", 5), x, 1.1, -0.5);
    const tent = add(s, box(2.8, 0.06, 1.8, KR.tent), 0, 2.2, 0.1); tent.rotation.x = 0.2;
    const goods = new THREE.Group(); goods.position.y = 0.86; s.add(goods);
    switch (kind) {
      case "kimchi": for (let i = 0; i < 3; i++) { add(goods, cyl(0.34, 0.3, 0.32, "#c9413f", 10), -0.75 + i * 0.75, 0.16, 0); add(goods, cyl(0.3, 0.3, 0.06, "#b83a3a", 10), -0.75 + i * 0.75, 0.34, 0); for (let k = 0; k < 4; k++) add(goods, ball(0.07, k % 2 ? "#d94f3a" : "#e8dcc3", 5), -0.75 + i * 0.75 + (rnd() - 0.5) * 0.3, 0.4, (rnd() - 0.5) * 0.3); } break;
      case "gimbap": for (let i = 0; i < 8; i++) { const r = add(goods, cyl(0.11, 0.11, 0.3, "#2a2a2e", 10), -0.9 + (i % 4) * 0.5, 0.11, -0.2 + Math.floor(i / 4) * 0.45); r.rotation.z = Math.PI / 2; add(goods, cyl(0.09, 0.09, 0.31, "#f4ecc8", 10), -0.9 + (i % 4) * 0.5, 0.11, -0.2 + Math.floor(i / 4) * 0.45).rotation.z = Math.PI / 2; add(goods, ball(0.035, i % 2 ? "#3f7a3a" : "#e07a3a", 4), -0.9 + (i % 4) * 0.5 + 0.16, 0.11, -0.2 + Math.floor(i / 4) * 0.45); } break;
      case "tteokbokki": add(goods, cyl(0.7, 0.62, 0.16, "#2a2a2e", 16), -0.3, 0.08, 0); add(goods, cyl(0.62, 0.62, 0.05, "#c9302a", 16), -0.3, 0.18, 0); for (let i = 0; i < 9; i++) { const c = add(goods, cyl(0.05, 0.05, 0.22, "#f7f2e6", 6), -0.3 + (rnd() - 0.5) * 0.9, 0.24, (rnd() - 0.5) * 0.9); c.rotation.z = Math.PI / 2; c.rotation.y = rnd() * 3; } add(goods, cyl(0.06, 0.06, 0.5, "#c9413f", 6), 0.8, 0.25, 0.2); s.userData.steam = new THREE.Vector3(-0.3, 1.2, 0); break;
      case "bindaetteok": add(goods, cyl(0.6, 0.6, 0.08, "#2a2a2e", 16), 0.2, 0.04, 0); for (let i = 0; i < 4; i++) add(goods, cyl(0.22, 0.22, 0.05, "#d9a441", 12), 0.2 + Math.cos(i * 1.6) * 0.3, 0.1, Math.sin(i * 1.6) * 0.3); add(goods, cyl(0.24, 0.2, 0.24, "#f4ecc8", 9), -0.8, 0.12, 0.2); s.userData.steam = new THREE.Vector3(0.2, 1.1, 0); break;
      case "veg": for (let i = 0; i < 4; i++) { const b = add(goods, cyl(0.3, 0.24, 0.22, C.straw, 9), -0.9 + i * 0.6, 0.11, 0); const col = ["#8fc26a", "#3f7a3a", "#e8dcc3", "#f2cf3a"][i]; for (let k = 0; k < 6; k++) add(b, ball(0.09, col, 6), (rnd() - 0.5) * 0.38, 0.18, (rnd() - 0.5) * 0.38); } for (let i = 0; i < 3; i++) add(goods, cyl(0.02, 0.03, 0.6, "#7fbf5a", 4), 0.9 + i * 0.08, 0.35, 0.3).rotation.z = 0.4; break;
      case "aromatics": for (let i = 0; i < 3; i++) { const b = add(goods, cyl(0.3, 0.24, 0.22, C.straw, 9), -0.75 + i * 0.75, 0.11, 0); for (let k = 0; k < 6; k++) add(b, i === 0 ? ball(0.08, "#f1e9dc", 6) : i === 1 ? box(0.18, 0.08, 0.1, "#d9b27a") : ball(0.05, "#e8d7a8", 5), (rnd() - 0.5) * 0.38, 0.18, (rnd() - 0.5) * 0.38); } add(goods, cyl(0.12, 0.1, 0.36, "#8a5a3c", 8), 0.9, 0.18, 0.3); break;
    }
    vendors.push(add(s, person(pick(["#3f6b8f", "#c0392b", "#7a4a3a", "#2f5d3f"]), { apron: true }), 0.3, 0, -0.95));
    return s;
  };
  const layout: [string, number, number, number][] = [["kimchi", -5, -2.2, 0], ["gimbap", -1.5, -2.2, 0], ["tteokbokki", 2, -2.2, 0], ["bindaetteok", 5.5, -2.2, 0], ["veg", -3.5, 2.2, Math.PI], ["aromatics", 1.5, 2.2, Math.PI]];
  for (const [k, x, z, rot] of layout) { const s = stall(k); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); if (s.userData.steam) { const w = s.userData.steam.clone(); s.updateMatrixWorld(true); g.userData.steam = s.localToWorld(w); } }
  // eaters on stools along the aisle
  const spots = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(6, 0, 0), new THREE.Vector3(-3, 0, 0.3), new THREE.Vector3(1, 0, -0.3)];
  type Shopper = { p: P; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [0, 1, 2, 3].map((i) => { const p = person(pick(["#c0392b", "#e0a52c", "#3f6b8f", "#f4f1ea"])); const st = spots[i].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i + 2) % spots.length].clone(), wait: i * 0.8, speed: 0.7 + rnd() * 0.4 }; });
  for (const x of [-5, 2]) { add(g, cyl(0.18, 0.18, 0.4, KR.woodDark, 8), x, 0.2, -0.9); const e = person(pick(["#3f6b8f", "#e07aa0"])); (e.userData as { sit?: () => void }).sit?.(); add(g, e, x, 0.04, -0.9); }
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "어서 오세요! Welcome!", 4.0, 1300); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    vendors.forEach((v, i) => { const up = (v.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.z = k * Math.sin(t * 8 + i) * 0.4; up.rotation.x = -k * Math.abs(Math.sin(t * 6 + i)) * 0.25; } v.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.25; });
    for (const sh of shoppers) {
      if (sh.wait > 0) { sh.wait -= dt; continue; }
      const to = sh.target.clone().sub(sh.pos); const d = to.length();
      if (d < 0.15) { sh.wait = 2 + rnd() * 4; sh.target = spots[Math.floor(rnd() * spots.length)].clone(); continue; }
      to.normalize().multiplyScalar(Math.min(d, sh.speed * dt)); sh.pos.add(to); sh.p.position.copy(sh.pos); sh.p.rotation.y = Math.atan2(to.x, to.z);
      (sh.p.userData as { walk?: (t: number) => void }).walk?.(t);
    }
    tickChildren(g)(t, dt);
  };
  return g;
}

/** Pojangmacha: an orange street tent with stools, soju and skewers. */
export function pojangmacha(): P {
  const g = group();
  add(g, box(3.2, 0.8, 1.2, KR.wood), 0, 0.45, 0);
  for (const x of [-1.5, 1.5]) for (const z of [-0.8, 1.0]) add(g, cyl(0.04, 0.04, 2.3, "#8c9096", 5), x, 1.15, z);
  add(g, box(3.6, 0.06, 2.4, KR.tent), 0, 2.32, 0.1); add(g, box(3.6, 1.2, 0.05, KR.tent), 0, 1.7, -0.9);
  for (let i = 0; i < 6; i++) add(g, cyl(0.05, 0.05, 0.28, "#3f8f5a", 6), -1.2 + i * 0.3, 0.98, -0.3);
  for (let i = 0; i < 5; i++) { add(g, cyl(0.01, 0.01, 0.5, KR.wood, 3), -0.8 + i * 0.4, 0.95, 0.3).rotation.z = 0.3; add(g, ball(0.05, i % 2 ? "#a44a3a" : "#e07a3a", 5), -0.8 + i * 0.4 + 0.1, 1.1, 0.3); }
  add(g, cyl(0.28, 0.24, 0.2, "#2a2a2e", 10), 1.1, 0.95, 0.1); add(g, cyl(0.26, 0.26, 0.04, "#c9302a", 10), 1.1, 1.06, 0.1);
  const people: P[] = [];
  for (let i = 0; i < 3; i++) { add(g, cyl(0.17, 0.17, 0.4, "#3f4a5a", 8), -1.0 + i * 1.0, 0.2, 1.1); const p = person(pick(["#3f6b8f", "#e0a52c", "#f4f1ea", "#2a2a2e"])); (p.userData as { sit?: () => void }).sit?.(); add(g, p, -1.0 + i * 1.0, 0.04, 1.1).rotation.y = Math.PI; people.push(p); }
  add(g, person("#e9d7b8", { apron: true }), 0, 0, -0.5);
  add(g, ball(0.16, "#f2cf3a", 8), -1.6, 2.6, 0.3);   // a bare bulb
  g.userData.steam = new THREE.Vector3(1.1, 1.3, 0.1);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(people[1], "건배! Cheers!", 1.4, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); people.forEach((p, i) => { const up = (p.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.z = Math.sin(t * 0.9 + i) * 0.08 + k * Math.sin(t * 7 + i) * 0.25; up.rotation.x = -k * 0.5 * Math.sin(Math.min(1, k * 2) * Math.PI); } p.position.y = 0.04 + k * Math.abs(Math.sin(t * 8 + i)) * 0.2; }); tickChildren(g)(t, dt); };
  return g;
}

export function hanwoo(): P { return cow(false, true, "음메~ Moo~"); }

export function blackPigs(): P {
  const g = group();
  const pigs: P[] = [];
  for (let i = 0; i < 3; i++) {
    const p = group();
    const coat = "#4a4044";
    add(p, ball(0.5, coat, 10), 0, 0.5, 0).scale.set(1.1, 0.65, 0.65); const head = add(p, ball(0.28, coat, 9), 0.62, 0.5, 0); head.scale.set(1, 0.9, 0.9);
    add(head, cyl(0.12, 0.14, 0.14, "#e8a0a8", 8), 0.3, -0.04, 0).rotation.z = Math.PI / 2; for (const z of [-0.05, 0.05]) add(head, ball(0.025, "#5a2a30", 4), 0.37, -0.04, z);   // pink snout with nostrils
    for (const z of [-0.14, 0.14]) { const ear = add(head, cone(0.09, 0.22, coat, 4), 0.02, 0.26, z); ear.rotation.x = z > 0 ? 0.5 : -0.5; add(ear, cone(0.05, 0.12, "#e8a0a8", 4), 0, -0.02, 0); }
    for (const z of [-0.14, 0.14]) { add(head, ball(0.045, "#f4f1ea", 5), 0.22, 0.08, z); add(head, ball(0.025, "#1a1a1e", 4), 0.25, 0.08, z); }
    for (const x of [-0.32, 0.32]) for (const z of [-0.18, 0.18]) add(p, box(0.15, 0.3, 0.15, coat), x, 0.15, z);
    const tail = add(p, cyl(0.02, 0.02, 0.22, "#e8a0a8", 4), -0.55, 0.62, 0); tail.rotation.z = 1.2;
    p.position.set(-1.2 + i * 1.2, 0, (i % 2) * 0.8 - 0.4); p.rotation.y = i * 1.3; g.add(p); pigs.push(p);
    (p.userData as { head?: THREE.Mesh }).head = head;
  }
  for (const [x, z, rot, len] of [[0, -1.5, 0, 4.6], [0, 1.5, 0, 4.6], [-2.3, 0, Math.PI / 2, 3], [2.3, 0, Math.PI / 2, 3]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 0.9); for (let i = 0; i <= n; i++) add(f, box(0.14, 0.7, 0.14, KR.basalt), -len / 2 + (i / n) * len, 0.35, 0); add(f, box(len, 0.07, 0.07, KR.basalt), 0, 0.5, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  const re = reaction(0.8);
  g.userData.poke = () => { re.poke(); bubble(pigs[1], "꿀꿀 Oink!", 1.1, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pigs.forEach((p, i) => { p.position.y = k * Math.abs(Math.sin(t * 12 + i)) * 0.35; p.rotation.z = k * Math.sin(t * 16 + i) * 0.15; p.rotation.y += k * dt * 3; const h = (p.userData as { head?: THREE.Mesh }).head; if (h) h.position.y = 0.45 + Math.abs(Math.sin(t * 2 + i)) * 0.05; }); };
  return g;
}

/** Haenyeo, Jeju's diving women, with their orange floats, and a rocky shore. */
export function haenyeo(): P {
  const g = group();
  const divers: { d: THREE.Group; float: THREE.Mesh; ph: number }[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new THREE.Group(); d.position.set(-1.5 + i * 1.5, 0, (i % 2) * 0.8);
    add(d, ball(0.15, "#1f1f22", 7), 0, 0.12, 0); add(d, ball(0.13, C.skin, 7), 0.05, 0.2, 0).scale.set(0.8, 0.6, 0.8); add(d, box(0.5, 0.12, 0.3, "#1f1f22"), -0.3, 0.02, 0);
    const fl = add(d, ball(0.22, "#f08a2a", 9), 0.45, 0.12, 0.25); fl.scale.y = 0.7;
    add(d, cyl(0.16, 0.14, 0.2, "#a8a49c", 8), 0.45, 0.28, 0.25);
    g.add(d); divers.push({ d, float: fl, ph: i * 2 });
  }
  for (let i = 0; i < 6; i++) add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.35 + (i % 3) * 0.2, 0), mat(KR.basalt)), -2.5 + i * 1.0, 0.1, -2.2 + (i % 2) * 0.5);
  add(g, ball(0.3, "#f08a2a", 9), 2.6, 0.12, -1.6).scale.y = 0.7;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "숨비소리~ Whistle!", 1.2, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); divers.forEach(({ d, ph }, i) => { d.position.y = Math.sin(t * 1.2 + ph) * 0.04 - k * Math.max(0, Math.sin(k * Math.PI)) * 1.1 * (i === 1 ? 1 : 0.5); d.rotation.x = -k * Math.max(0, Math.sin(k * Math.PI)) * 1.0; d.rotation.y = Math.sin(t * 0.4 + ph) * 0.4; }); };
  return g;
}

/** Dol hareubang, Jeju's basalt stone grandfathers. */
export function dolHareubang(): P {
  const g = group();
  for (const sd of [-1, 1]) {
    const s = new THREE.Group(); s.position.x = sd * 1.4; g.add(s);
    add(s, cyl(0.5, 0.6, 1.6, KR.basalt, 9), 0, 0.8, 0);
    add(s, ball(0.5, KR.basalt, 9), 0, 1.7, 0).scale.set(1, 1.1, 1);
    add(s, cyl(0.55, 0.45, 0.45, KR.basalt, 9), 0, 2.25, 0);
    for (const ex of [-0.2, 0.2]) add(s, ball(0.12, "#2a2a2d", 7), ex, 1.8, 0.42);
    add(s, ball(0.12, "#2a2a2d", 6), 0, 1.6, 0.48).scale.set(1, 1.2, 0.8);
    add(s, box(0.34, 0.22, 0.3, KR.basalt), sd * 0.35, 1.05, 0.35); add(s, box(0.34, 0.22, 0.3, KR.basalt), -sd * 0.35, 0.75, 0.35);
  }
  add(g, person("#e0a52c"), 0, 0, 1.4).rotation.y = Math.PI;
  return g;
}

export function tangerineGrove(): P {
  const g = group();
  const trees: P[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) trees.push(add(g, citrusTree("orange", 0.8 + rnd() * 0.2), -3.6 + j * 2.4, 0, -1.2 + i * 2.4));
  // basalt drystone wall around it, the way Jeju fields are fenced
  for (let i = 0; i < 12; i++) add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), mat(KR.basalt)), -5 + i * 0.9, 0.15 + (i % 2) * 0.12, 2.6);
  add(g, person("#e07aa0", { hat: true }), 4.2, 0, 0.4); const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 4.8, 0.15, 1.0); for (let k = 0; k < 6; k++) add(crate, ball(0.09, "#f08a2a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "귤! Tangerines!", 2.2, 1300); for (const tr of trees) { const fr = (tr.userData as { fruits?: THREE.Mesh[] }).fruits ?? []; for (let i = 0; i < 2; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.08, "#f08a2a", 6); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) { c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; c.rotation.x = Math.cos(t * 21 + tr.position.z) * 0.05 * shake; } } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.08, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.081) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

export function ricePaddyKorea(): P {
  const g = group();
  const seedlings: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) { add(g, box(6.5, 0.18, 2.6, "#9ec9b8"), 0, 0.09, -1.5 + i * 3); for (let r = 0; r < 3; r++) for (let c = 0; c < 13; c++) { const sd = add(g, cone(0.09, 0.6, "#7fc85a", 4), -3 + c * 0.5, 0.3, -2.3 + i * 3 + r * 0.7); sd.geometry = sd.geometry.clone(); sd.geometry.translate(0, 0.21, 0); sd.position.y -= 0.21; seedlings.push(sd); } }
  add(g, box(7, 0.2, 0.3, "#a37a4f"), 0, 0.1, 0);
  const farmer = add(g, person("#3f6b8f", { hat: true }), 3.9, 0, -0.4);
  // a scarecrow and an egret
  add(g, cyl(0.04, 0.04, 1.6, KR.wood, 4), -3.6, 0.8, 1.2); add(g, box(0.9, 0.05, 0.05, KR.wood), -3.6, 1.2, 1.2); add(g, box(0.5, 0.5, 0.2, "#c9413f"), -3.6, 1.1, 1.2); add(g, ball(0.16, C.straw, 7), -3.6, 1.55, 1.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "쌀! Rice!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); seedlings.forEach((sd) => { sd.rotation.z = Math.sin(t * 1.5 + sd.position.x * 0.8) * 0.08 + k * Math.sin((1 - k) * 10 - sd.position.x * 1.5) * 0.5; }); const up = (farmer.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

export function namulPlot(): P {
  const g = group();
  add(g, box(5.4, 0.2, 3.4, "#6b4a32"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) {
    const pl = new THREE.Group(); pl.position.set(-2.4 + j * 0.8, 0.2, -1.2 + i * 0.8); g.add(pl); plants.push(pl);
    if (i === 0) add(pl, ball(0.26, "#a3d18a", 6), 0, 0.15, 0).scale.set(0.8, 1, 0.8);            // napa cabbage
    else if (i === 1) { for (let k = 0; k < 4; k++) add(pl, cyl(0.02, 0.03, 0.5, "#7fbf5a", 4), (k - 1.5) * 0.06, 0.25, 0); }   // scallions
    else if (i === 2) add(pl, ball(0.22, "#f7f2e6", 7), 0, 0.14, 0).scale.set(0.8, 1.1, 0.8);   // radish
    else { add(pl, ball(0.2, "#3f7a3a", 6), 0, 0.14, 0).scale.y = 0.8; add(pl, ball(0.05, "#8a5a3c", 5), 0.1, 0.34, 0); }  // spinach with a bean
  }
  const gardener = add(g, person("#2f5d3f", { hat: true }), 3.2, 0, 0.5);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(gardener, "나물! Namul!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.4) * 1.2)) * 0.6; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); const up = (gardener.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

export function hallasan(): P {
  const g = mountain(4.8, 6, true);
  // a broad shield volcano with the crater lake Baengnokdam on top
  add(g, cyl(1.3, 1.9, 0.9, "#6f7a68", 12), 0, 5.4, 0);                       // rocky summit
  add(g, new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.28, 8, 14), mat("#5b6356")), 0, 5.85, 0).rotation.x = Math.PI / 2;   // the crater rim
  add(g, cyl(0.8, 0.8, 0.1, "#4a4f45", 12), 0, 5.7, 0);                        // crater floor
  add(g, cyl(0.5, 0.5, 0.05, "#7fb8c4", 12), 0, 5.76, 0);                      // Baengnokdam, the small lake in the floor
  return g;
}

/** Jagalchi: Busan's fish market. Blue tarpaulin roofs, tanks of live fish, crabs and octopus on ice, the ajumma who run it. */
export function jagalchi(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(11, 6), mat("#a8a9a4")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (const x of [-4.8, -1.6, 1.6, 4.8]) for (const z of [-2.6, 2.6]) add(g, cyl(0.07, 0.07, 3.0, "#8c9096", 6), x, 1.5, z);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.06, 6.6), mat("#5f8fd0", { transparent: true, opacity: 0.4 })), 0, 3.0, 0).renderOrder = 3;   // blue tarpaulin, thin enough to see the tanks through
  for (let i = 0; i < 4; i++) add(g, box(0.1, 0.1, 6.6, "#2f5a90"), -4.8 + i * 3.2, 2.94, 0); for (const z of [-3.2, 0, 3.2]) add(g, box(11.4, 0.1, 0.1, "#2f5a90"), 0, 2.94, z);
  add(g, box(3.2, 0.5, 0.06, "#1f2430"), 0, 2.6, 3.32); add(g, box(2.9, 0.3, 0.02, "#f2cf3a"), 0, 2.6, 3.36);
  const vendors: P[] = [];
  const swimmers: { m: THREE.Mesh; cx: number; cz: number; ph: number }[] = [];
  // tanks of live fish along the front
  for (let i = 0; i < 3; i++) {
    const x = -3.6 + i * 3.6;
    add(g, box(2.4, 0.7, 1.2, "#5a5e66"), x, 0.35, 1.6);
    add(g, new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.5, 1.1), mat("#6fb3c9", { transparent: true, opacity: 0.55 })), x, 0.95, 1.6);
    for (let k = 0; k < 4; k++) { const m = add(g, ball(0.08, ["#8fa3b5", "#d9a441", "#c9413f", "#4f6f8f"][k], 6), x + (k - 1.5) * 0.45, 1.0, 1.6); m.scale.set(1.8, 0.7, 1); swimmers.push({ m, cx: x, cz: 1.6, ph: k * 1.7 + i }); }
    add(g, cyl(0.03, 0.03, 0.9, "#8c9096", 4), x - 1.0, 1.4, 1.1).rotation.x = 0.4;   // a hose
  }
  // ice slabs at the back: octopus, crabs, flatfish, shells
  for (let i = 0; i < 3; i++) {
    const x = -3.6 + i * 3.6;
    add(g, box(2.4, 0.7, 1.2, KR.wood), x, 0.35, -1.5); add(g, box(2.3, 0.14, 1.1, "#e8f1f4"), x, 0.77, -1.5);
    if (i === 0) { for (let k = 0; k < 3; k++) { const f = add(g, ball(0.16, k ? "#b3bfc9" : "#7f93a6", 7), x - 0.7 + k * 0.7, 0.87, -1.5 + (k % 2) * 0.3); f.scale.set(1.7, 0.4, 1); add(g, cone(0.08, 0.2, k ? "#b3bfc9" : "#7f93a6", 4), x - 0.7 + k * 0.7 - 0.36, 0.87, -1.5 + (k % 2) * 0.3).rotation.z = Math.PI / 2; } }
    if (i === 1) { add(g, ball(0.22, "#9a5a6a", 8), x, 0.98, -1.5); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; add(g, cyl(0.03, 0.05, 0.5, "#9a5a6a", 5), x + Math.cos(a) * 0.32, 0.86, -1.5 + Math.sin(a) * 0.3).rotation.set(Math.sin(a) * 1.3, 0, Math.cos(a) * 1.3); } for (let k = 0; k < 6; k++) add(g, ball(0.06, "#e8e0d0", 5), x - 0.9 + (k % 3) * 0.2, 0.87, -1.9 + Math.floor(k / 3) * 0.2); }
    if (i === 2) { for (let k = 0; k < 2; k++) { const cx = x - 0.5 + k * 0.9; add(g, ball(0.18, "#c9573a", 7), cx, 0.9, -1.5).scale.set(1.3, 0.5, 1); for (const sd of [-1, 1]) { add(g, box(0.16, 0.06, 0.06, "#c9573a"), cx + sd * 0.3, 0.92, -1.75); for (let l = 0; l < 3; l++) add(g, box(0.16, 0.04, 0.04, "#c9573a"), cx + sd * 0.28, 0.86, -1.5 + (l - 1) * 0.14).rotation.y = sd * 0.3; } } }
    vendors.push(add(g, person(pick(["#e07aa0", "#c0392b", "#6a7fb0"]), { apron: true }), x + 0.3, 0, -0.4));
  }
  for (const [x, z] of [[-4.2, -2.4], [4.4, 2.3]]) { for (let k = 0; k < 3; k++) add(g, cyl(0.28, 0.24, 0.16, "#e46b2c", 10), x, 0.08 + k * 0.17, z); }   // stacked crates
  add(g, ball(0.2, "#f4f1ea", 7), 5.0, 3.15, -2.6).scale.set(1.3, 0.7, 1);   // a gull on the roof
  const buyer = add(g, person("#3f6b8f"), 3.0, 0, 2.7); buyer.rotation.y = Math.PI;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(vendors[1], "싱싱해요! Fresh!", 1.5, 1300); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    swimmers.forEach((s, i) => { const a = t * (0.6 + (i % 3) * 0.2) + s.ph; s.m.position.x = s.cx + Math.cos(a) * 0.9; s.m.position.z = s.cz + Math.sin(a) * 0.35; s.m.rotation.y = -a; s.m.position.y = 1.0 + k * Math.max(0, Math.sin(t * 9 + i)) * 0.9; });   // fish leap when poked
    vendors.forEach((v, i) => { const up = (v.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * Math.sin(t * 8 + i) * 0.25; });
    tickChildren(g)(t, dt);
  };
  return g;
}

export const KOREA_PROPS: Record<string, () => P> = {
  hanwoo, blackPigs, haenyeo, tangerineGrove, ricePaddyKorea, namulPlot, jangdokdae, chilliMats, bbqHouse, dolsotHouse, gwangjang, pojangmacha, jagalchi, none: () => group(),
};

export const KOREA_ICONS: Record<string, () => P> = {
  hanwoo: () => cow(false, false),
  blackPig: () => { const g = group(); const coat = "#4a4044"; add(g, ball(0.5, coat, 10), 0, 0.5, 0).scale.set(1.1, 0.65, 0.65); const h = add(g, ball(0.28, coat, 9), 0.62, 0.5, 0); add(h, cyl(0.12, 0.14, 0.14, "#e8a0a8", 8), 0.3, -0.04, 0).rotation.z = Math.PI / 2; for (const z of [-0.14, 0.14]) { add(h, cone(0.09, 0.22, coat, 4), 0.02, 0.26, z); add(h, ball(0.045, "#f4f1ea", 5), 0.22, 0.08, z); add(h, ball(0.025, "#1a1a1e", 4), 0.25, 0.08, z); } for (const x of [-0.32, 0.32]) for (const z of [-0.18, 0.18]) add(g, box(0.15, 0.3, 0.15, coat), x, 0.15, z); return g; },
  seafoodKr: () => { const g = group(); add(g, ball(0.28, "#5a5a5a", 9), -0.3, 0.2, 0).scale.set(1.2, 0.6, 1); for (let i = 0; i < 5; i++) add(g, ball(0.06, "#e8e0d0", 5), -0.3 + Math.cos(i * 1.3) * 0.25, 0.3, Math.sin(i * 1.3) * 0.2); add(g, ball(0.22, "#f08a2a", 9), 0.45, 0.16, 0.1).scale.y = 0.7; add(g, cyl(0.12, 0.1, 0.16, "#a8a49c", 8), 0.45, 0.3, 0.1); return g; },
  tangerine: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.2, "#f08a2a", 12), -0.3 + i * 0.32, 0.2, (i - 1) * 0.12).scale.y = 0.85; add(g, ball(0.09, "#3f7a3a", 6), 0.05, 0.4, 0.15).scale.set(1, 0.3, 1.6); return g; },
  riceKr: () => { const g = group(); add(g, cyl(0.42, 0.28, 0.32, "#2a2a2e", 12), 0, 0.16, 0); add(g, ball(0.38, "#fbf7ef", 9), 0, 0.36, 0).scale.y = 0.5; for (let i = 0; i < 6; i++) add(g, ball(0.05, ["#f2cf3a", "#3f7a3a", "#e07a3a", "#c9413f", "#8fc26a", "#e8dcc3"][i], 5), Math.cos(i * 1.05) * 0.24, 0.55, Math.sin(i * 1.05) * 0.24); add(g, ball(0.09, "#f2cf3a", 7), 0, 0.58, 0).scale.y = 0.5; return g; },
  namul: () => { const g = group(); add(g, ball(0.3, "#a3d18a", 8), -0.35, 0.28, 0).scale.set(0.8, 1, 0.8); for (let k = 0; k < 4; k++) add(g, cyl(0.02, 0.03, 0.6, "#7fbf5a", 4), 0.1 + k * 0.07, 0.3, 0.2).rotation.z = 0.15; add(g, ball(0.2, "#f7f2e6", 7), 0.45, 0.2, -0.15).scale.set(0.8, 1.1, 0.8); return g; },
  kimchi: () => { const g = group(); add(g, ball(0.42, KR.onggi, 12), 0, 0.42, 0).scale.y = 1.1; add(g, cyl(0.24, 0.28, 0.1, "#4a3020", 10), 0, 0.9, 0); add(g, cyl(0.3, 0.2, 0.12, "#4a3020", 10), 0, 1.0, 0); add(g, cyl(0.2, 0.16, 0.16, "#c9413f", 9), 0.6, 0.08, 0.25); for (let k = 0; k < 4; k++) add(g, ball(0.06, k % 2 ? "#d94f3a" : "#e8dcc3", 5), 0.6 + (rnd() - 0.5) * 0.2, 0.2, 0.25 + (rnd() - 0.5) * 0.2); return g; },
  gochujang: () => { const g = group(); for (let i = 0; i < 3; i++) { const c = add(g, cone(0.06, 0.4, "#d3342b", 6), -0.3 + i * 0.3, 0.2, (i - 1) * 0.1); c.rotation.z = Math.PI / 2 + (i - 1) * 0.3; } add(g, cyl(0.2, 0.2, 0.22, "#b83a3a", 10), 0.5, 0.11, -0.3); add(g, cyl(0.12, 0.12, 0.06, "#4a3020", 8), 0.5, 0.25, -0.3); return g; },
  aromaticsKr: () => { const g = group(); const b = add(g, cyl(0.42, 0.34, 0.28, C.straw, 10), 0, 0.14, 0); for (let i = 0; i < 4; i++) add(b, ball(0.1, "#f1e9dc", 7), (rnd() - 0.5) * 0.4, 0.22, (rnd() - 0.5) * 0.4); for (let i = 0; i < 3; i++) add(g, cyl(0.02, 0.03, 0.7, "#7fbf5a", 4), -0.5 + i * 0.08, 0.4, 0.4).rotation.z = 0.35; add(g, cyl(0.12, 0.1, 0.36, "#8a5a3c", 8), 0.6, 0.18, 0.35); for (let i = 0; i < 12; i++) add(g, ball(0.02, "#e8d7a8", 4), 0.6 + (rnd() - 0.5) * 0.18, 0.37, 0.35 + (rnd() - 0.5) * 0.18); return g; },
  grill: () => { const g = group(); add(g, cyl(0.42, 0.38, 0.18, "#2a2a2e", 14), 0, 0.09, 0); add(g, cyl(0.38, 0.38, 0.03, "#5a5a5a", 14), 0, 0.2, 0); for (let i = 0; i < 5; i++) { const s = add(g, box(0.24, 0.03, 0.15, i % 2 ? "#8e3b2f" : "#a44a3a"), Math.cos(i * 1.25) * 0.2, 0.23, Math.sin(i * 1.25) * 0.2); s.rotation.y = i; } add(g, box(0.04, 0.3, 0.04, "#8c9096"), 0.45, 0.3, 0.2).rotation.x = 0.6; add(g, ball(0.16, "#8fc26a", 7), -0.5, 0.1, 0.3).scale.y = 0.5; return g; },
  dolsot: () => { const g = group(); add(g, cyl(0.36, 0.3, 0.26, "#2a2a2e", 14), 0, 0.13, 0); add(g, cyl(0.3, 0.3, 0.05, "#f4ecc8", 14), 0, 0.28, 0); for (let i = 0; i < 6; i++) add(g, ball(0.07, ["#f2cf3a", "#3f7a3a", "#e07a3a", "#c9413f", "#8fc26a", "#e8dcc3"][i], 6), Math.cos(i * 1.05) * 0.18, 0.34, Math.sin(i * 1.05) * 0.18); add(g, ball(0.09, "#f2cf3a", 7), 0, 0.36, 0).scale.y = 0.5; add(g, cyl(0.015, 0.015, 0.7, "#8c9096", 4), 0.3, 0.5, 0.1).rotation.z = -0.9; return g; },
  fermentation: () => { const g = group(); for (const [x, r] of [[-0.35, 0.28], [0.3, 0.22]] as [number, number][]) { add(g, ball(r, KR.onggi, 12), x, r * 0.9, 0).scale.y = 1.1; add(g, cyl(r * 0.6, r * 0.5, 0.1, "#4a3020", 10), x, r * 1.95, 0); } return g; },
  gwangjang: () => { const g = group(); const r = add(g, cyl(0.11, 0.11, 0.5, "#2a2a2e", 10), -0.3, 0.11, 0); r.rotation.z = Math.PI / 2; add(g, cyl(0.09, 0.09, 0.51, "#f4ecc8", 10), -0.3, 0.11, 0).rotation.z = Math.PI / 2; add(g, cyl(0.3, 0.27, 0.1, "#2a2a2e", 12), 0.35, 0.05, 0.1); add(g, cyl(0.27, 0.27, 0.04, "#c9302a", 12), 0.35, 0.12, 0.1); for (let i = 0; i < 4; i++) add(g, cyl(0.04, 0.04, 0.2, "#f7f2e6", 6), 0.35 + Math.cos(i * 1.6) * 0.15, 0.16, 0.1 + Math.sin(i * 1.6) * 0.15).rotation.z = Math.PI / 2; return g; },
  pojangmacha: () => { const g = group(); add(g, cyl(0.06, 0.06, 0.34, "#3f8f5a", 8), -0.2, 0.17, 0); add(g, cyl(0.03, 0.03, 0.08, "#3f8f5a", 6), -0.2, 0.38, 0); add(g, cyl(0.07, 0.06, 0.08, "#e8e8e8", 8), 0.1, 0.04, 0.15); for (let i = 0; i < 2; i++) { add(g, cyl(0.01, 0.01, 0.5, KR.wood, 3), 0.3 + i * 0.15, 0.2, -0.1).rotation.z = 0.2; add(g, ball(0.05, i ? "#a44a3a" : "#e07a3a", 5), 0.35 + i * 0.15, 0.4, -0.1); } return g; },
};
