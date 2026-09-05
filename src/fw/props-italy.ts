/** Italian props: Roman stone and umbrella pines, Venetian canals and gondolas, Sicilian lava and citrus. */
import * as THREE from "three";
import { mat, add, rnd, C, chineseRoof, person, cow, chicken, awning, type P } from "./props";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate); return k; } }; }

export const IT = {
  travertine: "#e9dcc3", terracotta: "#c9603e", ochre: "#d9a55b", rose: "#d7a48e", venRed: "#a8433a", venOchre: "#e0b36a", venCream: "#f1e6d0",
  lava: "#3d3a3f", lavaLight: "#5c5760", pine: "#3f6b3f", pineDark: "#2f5232", cypress: "#2f5232", lemon: "#f2cf3a", orange: "#f08a2a", sea: "#5fa8b8",
  shutter: "#4f6f4a", stone: "#b9ad98", stoneDark: "#8c8272", wood: "#8b5e3c", roof: "#b8654a",
};

// ---------- roofs & houses ----------

/** Low-pitched terracotta roof, Italian style, with a slight overhang. */
function tiledRoof(w: number, d: number, h: number, color = IT.terracotta): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.ConeGeometry(1, h, 4);
  geo.rotateY(Math.PI / 4); geo.scale(w * 0.74, 1, d * 0.74);
  const m = new THREE.Mesh(geo, mat(color)); m.position.y = h / 2; add(g, m);
  add(g, box(w * 1.06, 0.1, d * 1.06, "#a55a42"), 0, 0.02, 0);
  add(g, box(w * 0.5, 0.12, 0.16, "#a55a42"), 0, h, 0);
  return g;
}

export function italianHouse(style: "rome" | "venice" | "sicily", w = 3, d = 2.6, h = 2.4, storeys = 2): P {
  const g = group();
  const walls = style === "rome" ? [IT.ochre, IT.rose, "#e2b98a", "#c98d5e", "#e8d3a8"] : style === "venice" ? [IT.venRed, IT.venOchre, IT.venCream, "#c97a5a", "#8f6a4a"] : ["#f1e6d0", "#e8d7b0", "#d9b07a", "#f3e9d4"];
  const wall = pick(walls);
  const hh = h * storeys;
  add(g, box(w, hh, d, wall), 0, hh / 2, 0);
  const trim = style === "venice" ? IT.venCream : "#f1e6d0";
  // shuttered windows in rows, arched for Venice
  for (let s = 0; s < storeys; s++) for (let i = 0; i < Math.max(1, Math.round(w / 1.3)); i++) {
    const x = -w / 2 + (i + 0.5) * (w / Math.max(1, Math.round(w / 1.3)));
    const y = s * h + h * 0.6;
    if (style === "venice") { add(g, cyl(0.24, 0.24, 0.06, "#2f2a2a", 10), x, y + 0.12, d / 2 + 0.02).rotation.x = Math.PI / 2; add(g, box(0.48, 0.5, 0.06, "#2f2a2a"), x, y - 0.12, d / 2 + 0.02); }
    else { add(g, box(0.42, 0.55, 0.05, "#2f2a2a"), x, y, d / 2 + 0.02); for (const sd of [-1, 1]) add(g, box(0.18, 0.55, 0.04, IT.shutter), x + sd * 0.31, y, d / 2 + 0.03); }
    if (s > 0 && style !== "sicily") { add(g, box(0.7, 0.05, 0.3, trim), x, s * h + 0.1, d / 2 + 0.12); for (let k = 0; k < 4; k++) add(g, cyl(0.02, 0.02, 0.3, trim, 4), x - 0.3 + k * 0.2, s * h + 0.25, d / 2 + 0.25); }
  }
  add(g, box(0.8, 1.5, 0.06, style === "venice" ? "#3b6b5a" : "#4a3222"), 0, 0.75, d / 2 + 0.03);
  if (style === "venice") add(g, cyl(0.4, 0.4, 0.06, "#3b6b5a", 10), 0, 1.5, d / 2 + 0.03).rotation.x = Math.PI / 2;
  if (style === "sicily") { add(g, box(w + 0.2, 0.25, d + 0.2, "#f1e6d0"), 0, hh + 0.1, 0); add(g, box(w * 0.6, 0.8, 0.12, "#f1e6d0"), 0, hh + 0.5, d / 2 - 0.1); for (let i = 0; i < 3; i++) add(g, box(0.1, 0.5, 0.1, "#f1e6d0"), -w * 0.25 + i * w * 0.25, hh + 0.45, -d / 2 + 0.1); }
  else add(g, tiledRoof(w + 0.5, d + 0.5, style === "venice" ? 0.9 : 1.1), 0, hh, 0);
  // flower boxes / laundry
  if (rnd() > 0.5) for (let i = 0; i < 3; i++) add(g, ball(0.09, pick(["#e8563f", "#f2b64d", "#e07aa0"]), 5), -0.4 + i * 0.4, h * 0.35, d / 2 + 0.1);
  if (style === "venice") { const pole = add(g, cyl(0.05, 0.05, 1.6, IT.venRed, 6), w / 2 + 0.3, 0.8, d / 2 + 0.4); void pole; }
  return g;
}

export function umbrellaPine(s = 1): P {
  const g = group();
  add(g, cyl(0.1 * s, 0.16 * s, 2.6 * s, "#5a4030", 6), 0, 1.3 * s, 0).rotation.z = (rnd() - 0.5) * 0.1;
  for (let i = 0; i < 4; i++) { const br = add(g, cyl(0.04 * s, 0.06 * s, 1.1 * s, "#5a4030", 5), Math.cos(i * 1.6) * 0.5 * s, 2.7 * s, Math.sin(i * 1.6) * 0.5 * s); br.rotation.z = Math.cos(i * 1.6) * 0.9; br.rotation.x = -Math.sin(i * 1.6) * 0.9; }
  const crown = add(g, ball(1.25 * s, IT.pine, 9), 0, 3.3 * s, 0); crown.scale.y = 0.42;
  add(g, ball(0.9 * s, "#4a7a48", 8), 0.2 * s, 3.5 * s, 0.1 * s).scale.y = 0.4;
  return g;
}

export function cypress(s = 1): P {
  const g = group();
  add(g, cone(0.32 * s, 3.2 * s, IT.cypress, 7), 0, 1.6 * s, 0);
  add(g, cone(0.22 * s, 1.4 * s, "#3a6238", 7), 0, 3.0 * s, 0);
  return g;
}

export function oliveTree(s = 1): P {
  const g = group();
  const trunk = add(g, cyl(0.12 * s, 0.22 * s, 0.9 * s, "#7a6a55", 6), 0, 0.45 * s, 0); trunk.rotation.z = (rnd() - 0.5) * 0.3;
  for (let i = 0; i < 4; i++) add(g, ball(0.55 * s, i % 2 ? "#8fa872" : "#7f9a68", 7), (rnd() - 0.5) * 1.0 * s, (1.0 + rnd() * 0.5) * s, (rnd() - 0.5) * 1.0 * s).scale.y = 0.75;
  return g;
}

export function citrusTree(kind: "lemon" | "orange" = "lemon", s = 1): P {
  const g = group();
  add(g, cyl(0.09 * s, 0.13 * s, 0.7 * s, "#6b4a2c", 6), 0, 0.35 * s, 0);
  add(g, ball(0.7 * s, "#3f7a3a", 9), 0, 1.15 * s, 0).scale.y = 0.95;
  for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, r = 0.55 * s; const f = add(g, ball(0.09 * s, kind === "lemon" ? IT.lemon : IT.orange, 7), Math.cos(a) * r, (0.8 + rnd() * 0.7) * s, Math.sin(a) * r); if (kind === "lemon") f.scale.set(0.8, 1.15, 0.8); }
  return g;
}

export function pricklyPear(): P {
  const g = group();
  for (let i = 0; i < 4; i++) { const pad = add(g, ball(0.28, "#6f9b57", 8), (i - 1.5) * 0.25, 0.35 + (i % 2) * 0.35, 0); pad.scale.set(0.9, 1.2, 0.35); pad.rotation.z = (i - 1.5) * 0.3; if (i % 2) add(g, ball(0.07, "#e0483a", 6), pad.position.x, pad.position.y + 0.32, 0); }
  return g;
}

// ---------- Rome ----------

export function colosseum(): P {
  const g = group();
  const R = 4.2, rows = 3;
  for (let r = 0; r < rows; r++) {
    const y = r * 1.3;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(R - r * 0.05, R - r * 0.05, 1.3, 40, 1, true), mat(IT.travertine, { side: THREE.DoubleSide }));
    ring.position.y = y + 0.65; ring.castShadow = true; ring.receiveShadow = true;
    // the broken side: cut the top rows short with a mask of arches
    g.add(ring);
    const n = 28;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      if (r === 2 && a > 0.4 && a < 2.2) continue;           // the collapsed top on one side
      const arch = add(g, box(0.5, 0.8, 0.25, "#4a4238"), Math.cos(a) * (R + 0.02), y + 0.6, Math.sin(a) * (R + 0.02));
      arch.rotation.y = -a;
      add(g, cyl(0.25, 0.25, 0.26, "#4a4238", 10), Math.cos(a) * (R + 0.02), y + 1.0, Math.sin(a) * (R + 0.02)).rotation.set(Math.PI / 2, 0, -a);
      add(g, box(0.16, 1.3, 0.2, "#d9ccb0"), Math.cos(a + Math.PI / n) * (R + 0.05), y + 0.65, Math.sin(a + Math.PI / n) * (R + 0.05)).rotation.y = -a - Math.PI / n;
    }
    add(g, new THREE.Mesh(new THREE.TorusGeometry(R + 0.05, 0.12, 6, 40), mat("#d9ccb0")), 0, y + 1.3, 0).rotation.x = Math.PI / 2;
  }
  // inner arena floor and a few standing walls
  add(g, new THREE.Mesh(new THREE.CircleGeometry(R - 0.4, 32), mat("#cbb894")), 0, 0.05, 0).rotation.x = -Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.RingGeometry(1.6, R - 0.6, 32), mat("#a89a7c")), 0, 0.08, 0).rotation.x = -Math.PI / 2;
  // the arena: two gladiators circling each other, and a tiger pacing
  const glad = (color: string) => {
    const p = person(color);
    add(p, cyl(0.16, 0.16, 0.12, "#8c9096", 10), 0, 1.1, 0);                  // helmet
    add(p, box(0.04, 0.06, 0.08, "#c0392b"), 0, 1.2, 0);                        // crest
    add(p, cyl(0.28, 0.28, 0.04, "#8e2a22", 12), -0.25, 0.6, 0.15).rotation.y = Math.PI / 2;   // shield
    add(p, box(0.04, 0.5, 0.04, "#c9ccd0"), 0.3, 0.75, 0.25).rotation.x = -0.6;               // short sword
    return p;
  };
  const g1 = add(g, glad("#8e2a22"), -1.1, 0.1, 0.4), g2 = add(g, glad("#3f6b8f"), 1.1, 0.1, -0.4);
  const tiger = group();
  add(tiger, box(1.3, 0.55, 0.5, "#e8912a"), 0, 0.55, 0);
  for (let i = 0; i < 5; i++) add(tiger, box(0.08, 0.5, 0.54, "#2a2a2e"), -0.45 + i * 0.22, 0.6, 0);
  const th = add(tiger, box(0.45, 0.42, 0.44, "#e8912a"), 0.8, 0.7, 0);
  add(th, box(0.2, 0.16, 0.3, "#f4f1ea"), 0.2, -0.12, 0); for (const z of [-0.14, 0.14]) { add(th, cone(0.06, 0.12, "#e8912a", 4), 0, 0.26, z); add(th, ball(0.03, "#1f1f1f", 4), 0.22, 0.05, z); }
  for (const x of [-0.45, 0.45]) for (const z of [-0.18, 0.18]) add(tiger, box(0.16, 0.35, 0.16, "#e8912a"), x, 0.17, z);
  const tail = add(tiger, cyl(0.03, 0.03, 0.7, "#e8912a", 4), -0.85, 0.65, 0); tail.rotation.z = 0.9;
  g.add(tiger); tiger.position.set(0, 0.1, -1.8);
  for (let i = 0; i < 3; i++) add(g, person(pick(["#3f6b8f", "#e0a52c", "#c0392b"])), Math.cos(i * 2.2) * 5.4, 0, Math.sin(i * 2.2) * 5.4).rotation.y = -i * 2.2 + Math.PI;
  g.userData.tick = (t) => {
    // gladiators circle and lunge
    const a = t * 0.4;
    g1.position.set(Math.cos(a) * 1.1, 0.1, Math.sin(a) * 1.1); g2.position.set(-Math.cos(a) * 1.1, 0.1, -Math.sin(a) * 1.1);
    g1.rotation.y = Math.atan2(g2.position.x - g1.position.x, g2.position.z - g1.position.z); g2.rotation.y = Math.atan2(g1.position.x - g2.position.x, g1.position.z - g2.position.z);
    const lunge = Math.max(0, Math.sin(t * 2.2));
    for (const [p, k] of [[g1, lunge], [g2, Math.max(0, Math.sin(t * 2.2 + Math.PI))]] as [P, number][]) { const up = (p.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.15 + k * 0.4; (p.userData as { walk?: (t: number) => void }).walk?.(t * 1.3); }
    // the tiger paces the far side of the arena
    const u = t * 0.5; tiger.position.set(Math.sin(u) * 2.2, 0.1, -2.2 + Math.cos(u * 0.5) * 0.4); tiger.rotation.y = Math.cos(u) > 0 ? Math.PI / 2 : -Math.PI / 2;
    tail.rotation.y = Math.sin(t * 3) * 0.5; th.rotation.y = Math.sin(t * 1.1) * 0.3;
  };
  return g;
}

export function fountain(): P {
  const g = group();
  add(g, cyl(2.0, 2.2, 0.5, IT.travertine, 16), 0, 0.25, 0);
  add(g, cyl(1.8, 1.8, 0.06, "#8fc4c9", 16), 0, 0.53, 0);
  add(g, cyl(0.25, 0.35, 1.4, IT.travertine, 10), 0, 1.2, 0);
  add(g, cyl(0.8, 0.9, 0.2, IT.travertine, 12), 0, 1.9, 0);
  add(g, cyl(0.7, 0.7, 0.05, "#8fc4c9", 12), 0, 2.02, 0);
  add(g, ball(0.3, IT.travertine, 8), 0, 2.4, 0);
  // jets
  const jets: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2; const j = add(g, cyl(0.03, 0.05, 0.9, "#cfe7ea", 5), Math.cos(a) * 0.4, 2.7, Math.sin(a) * 0.4); j.rotation.z = Math.cos(a) * 0.5; j.rotation.x = -Math.sin(a) * 0.5; jets.push(j); }
  add(g, person("#e0a52c"), 2.6, 0, 0.4).rotation.y = -Math.PI / 2;
  g.userData.tick = (t) => jets.forEach((j, i) => { j.scale.y = 0.85 + Math.sin(t * 6 + i) * 0.15; });
  return g;
}

export function obelisk(): P {
  const g = group();
  add(g, box(1.4, 0.6, 1.4, IT.travertine), 0, 0.3, 0);
  add(g, cyl(0.28, 0.42, 4.4, "#b89a7a", 4), 0, 2.8, 0);
  add(g, cone(0.3, 0.5, "#b89a7a", 4), 0, 5.25, 0);
  add(g, ball(0.14, C.gold, 8), 0, 5.6, 0);
  return g;
}

export function trattoria(): P {
  const g = group();
  add(g, italianHouse("rome", 4.2, 3.0, 2.3, 2), 0, 0, -0.6);
  add(g, awning(4.2, 1.6, "#8e2a22"), 0, 2.2, 1.6);
  for (const x of [-1.9, 1.9]) add(g, cyl(0.05, 0.05, 2.2, "#4a3222", 6), x, 1.1, 2.3);
  add(g, box(2.4, 0.4, 0.06, "#f3e6c8"), 0, 2.75, 0.95);
  // tables outside with checked cloths, diners, wine and a big bowl of pasta
  const diners: P[] = [];
  for (const [x, z] of [[-1.2, 1.5], [1.2, 1.5]]) {
    add(g, cyl(0.55, 0.55, 0.06, "#c9413f", 10), x, 0.78, z); add(g, cyl(0.08, 0.1, 0.72, "#4a3222", 6), x, 0.36, z);
    add(g, cyl(0.3, 0.26, 0.1, "#f7f2e6", 10), x, 0.86, z); add(g, ball(0.2, "#e9c46a", 7), x, 0.94, z).scale.y = 0.5;
    add(g, cyl(0.06, 0.05, 0.3, "#5a1f2a", 6), x + 0.35, 0.95, z - 0.2);
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.4; add(g, cyl(0.2, 0.2, 0.42, "#4a3222", 8), x + Math.cos(a) * 0.95, 0.21, z + Math.sin(a) * 0.95); const d = person(pick(["#3f6b8f", "#e0a52c", "#f4f1ea", "#2f5d3f"])); (d.userData as { sit?: () => void }).sit?.(); add(g, d, x + Math.cos(a) * 0.95, 0.04, z + Math.sin(a) * 0.95).rotation.y = Math.atan2(x - (x + Math.cos(a) * 0.95), z - (z + Math.sin(a) * 0.95)); diners.push(d); }
  }
  const waiter = add(g, person("#f4f1ea", { apron: true }), 2.6, 0, 1.0); waiter.rotation.y = -1.2;
  add(g, cyl(0.03, 0.03, 0.5, "#2a2a2a", 4), 2.5, 1.05, 1.2).rotation.z = 0.5; // pepper mill
  const pot = add(g, cyl(0.4, 0.36, 0.5, "#8c2f2a", 12), -2.4, 0.95, -0.2);
  add(g, box(1.2, 0.7, 0.8, IT.stone), -2.4, 0.35, -0.2);
  g.userData.steam = new THREE.Vector3(-2.4, 1.3, -0.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    diners.forEach((d, i) => { const up = (d.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.z = Math.sin(t * 0.9 + i) * 0.08; up.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); up.rotation.y = Math.sin(t * 0.5 + i) * 0.15 + k * 0.5; } });
    const w = (waiter.userData as { upper?: THREE.Group }).upper; if (w) w.rotation.z = k * Math.sin(t * 8) * 0.25;
    pot.rotation.y += dt * 0.5 * (1 + k * 4);
    tickChildren(g)(t, dt);
  };
  return g;
}

export function pizzeria(): P {
  const g = group();
  add(g, italianHouse("rome", 3.6, 2.8, 2.3, 1), 0, 0, -0.8);
  // domed brick oven out front
  add(g, box(2.2, 1.0, 1.6, IT.stone), 1.6, 0.5, 1.2);
  const dome = add(g, ball(0.85, "#b8654a", 12), 1.6, 1.3, 1.1); dome.scale.y = 0.75;
  add(g, box(0.7, 0.45, 0.2, "#1f1a18"), 1.6, 1.2, 1.95);
  const fire = add(g, cone(0.25, 0.4, "#ff9a3c", 6), 1.6, 1.15, 1.9);
  add(g, box(0.35, 1.2, 0.35, "#6b5a4a"), 1.6, 2.2, 0.6);
  g.userData.smoke = new THREE.Vector3(1.6, 2.9, 0.6);
  // pizzaiolo with a peel and a pizza; a stack of boxes
  const cook = add(g, person("#f4f1ea", { apron: true }), 0.2, 0, 1.9); cook.rotation.y = 0.6;
  const peel = new THREE.Group(); peel.position.set(0.5, 1.0, 1.9); g.add(peel);
  add(peel, cyl(0.03, 0.03, 1.8, "#c9a37a", 4), 0.9, 0, 0).rotation.z = Math.PI / 2;
  add(peel, cyl(0.32, 0.32, 0.04, "#c9a37a", 12), 1.8, 0, 0);
  const pizza = add(peel, cyl(0.28, 0.28, 0.05, "#e9c46a", 14), 1.8, 0.05, 0);
  add(pizza, cyl(0.24, 0.24, 0.03, "#c9413f", 14), 0, 0.03, 0); add(pizza, cyl(0.2, 0.2, 0.03, "#f7f2e6", 14), 0, 0.055, 0);
  for (let i = 0; i < 4; i++) add(pizza, ball(0.035, "#3f7a3a", 5), Math.cos(i * 1.6) * 0.12, 0.08, Math.sin(i * 1.6) * 0.12);
  for (let i = 0; i < 3; i++) add(g, box(0.5, 0.08, 0.5, "#e9dcc3"), -1.6, 0.9 + i * 0.09, 1.7);
  add(g, box(1.6, 0.8, 0.8, IT.wood), -1.6, 0.4, 1.7);
  add(g, awning(3.0, 1.4, "#2f5d3f"), -0.6, 2.25, 1.9);
  const re = reaction(0.7);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    fire.scale.set(1 + k * 1.2, 1 + Math.sin(t * 20) * 0.3 + k * 1.5, 1 + k * 1.2);
    peel.rotation.z = k * Math.sin(t * 7) * 0.35;          // the peel dips into the oven
    peel.position.x = 0.5 + k * Math.max(0, Math.sin(t * 3.5)) * 0.6;
    pizza.rotation.y += dt * (0.5 + k * 8);                 // the pizza gets spun
    const up = (cook.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = k * Math.abs(Math.sin(t * 7)) * 0.2;
    tickChildren(g)(t, dt);
  };
  return g;
}

export function gelateria(): P {
  const g = group();
  add(g, italianHouse("rome", 3.2, 2.4, 2.3, 1), 0, 0, -0.5);
  add(g, awning(3.4, 1.4, "#e07aa0"), 0, 2.2, 1.4);
  add(g, box(2.4, 0.9, 0.8, IT.stone), 0, 0.45, 1.2);
  add(g, box(2.4, 0.06, 0.8, "#cfe7ea"), 0, 0.93, 1.2);
  const flavours = ["#f2cf3a", "#8fbf6a", "#7a4a2c", "#e07aa0", "#f4f1ea", "#f08a2a"];
  flavours.forEach((c, i) => { add(g, cyl(0.16, 0.14, 0.12, "#d9ccb0", 10), -1.0 + i * 0.4, 0.98, 1.2); add(g, ball(0.14, c, 8), -1.0 + i * 0.4, 1.08, 1.2).scale.y = 0.6; });
  add(g, person("#f4f1ea", { apron: true }), 0, 0, 0.4);
  const kids = [add(g, person("#e0a52c"), -1.2, 0, 2.3), add(g, person("#3f6b8f"), -0.4, 0, 2.5)];
  kids.forEach((k) => k.scale.setScalar(0.62));
  for (let i = 0; i < 2; i++) { const cone2 = add(g, cone(0.06, 0.2, "#d9a441", 5), -1.2 + i * 0.8, 0.8, 2.5 + i * 0.2); cone2.rotation.x = Math.PI; add(g, ball(0.07, flavours[i * 3], 6), cone2.position.x, 0.93, cone2.position.z); }
  add(g, cyl(0.28, 0.28, 0.7, "#2a2a2a", 10), 1.3, 0.35, 2.0); add(g, cyl(0.1, 0.1, 0.3, "#f7f2e6", 8), 1.3, 0.85, 2.0); // espresso machine on a cart
  g.userData.steam = new THREE.Vector3(1.3, 1.1, 2.0);
  const re = reaction(0.7);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); kids.forEach((kd, i) => { kd.position.y = k * Math.abs(Math.sin(t * 9 + i)) * 0.12; }); tickChildren(g)(t, dt); };
  return g;
}

/** Rome's market on the piazza: stalls under umbrellas with tomatoes, cheese, salumi, herbs and oil. */
export function italyMarket(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(7, 24), mat("#cfc2a6")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  const stall = (kind: string, color: string) => {
    const s = group();
    add(s, box(2.4, 0.75, 1.2, IT.wood), 0, 0.42, 0); add(s, box(2.4, 0.08, 1.2, "#5a3d28"), 0, 0.82, 0);
    add(s, cyl(0.05, 0.05, 2.6, "#4a3222", 6), 0, 1.3, 0);
    const um = add(s, cone(1.7, 0.6, color, 10), 0, 2.6, 0); void um;
    const goods = new THREE.Group(); goods.position.y = 0.86; s.add(goods);
    switch (kind) {
      case "tomato": for (let i = 0; i < 3; i++) { const b = add(goods, box(0.7, 0.16, 0.5, "#a37a4f"), -0.75 + i * 0.75, 0.08, 0); for (let k = 0; k < 8; k++) add(b, ball(0.1, k % 3 ? "#e0483a" : "#f0a030", 7), (rnd() - 0.5) * 0.55, 0.15, (rnd() - 0.5) * 0.35); } break;
      case "cheese": add(goods, cyl(0.42, 0.42, 0.28, "#e9c46a", 14), -0.7, 0.14, 0); add(goods, cyl(0.42, 0.42, 0.28, "#e9c46a", 14, ), -0.7, 0.42, 0); add(goods, box(0.5, 0.3, 0.5, "#e9c46a"), 0.1, 0.15, 0.1); for (let i = 0; i < 4; i++) add(goods, ball(0.13, "#fbf7ee", 8), 0.6 + (i % 2) * 0.3, 0.12, -0.2 + Math.floor(i / 2) * 0.3); break;
      case "salumi": add(goods, box(2.2, 0.05, 0.05, "#4a3222"), 0, 1.4, -0.3); for (let i = 0; i < 5; i++) { add(goods, cyl(0.09, 0.09, 0.7, i % 2 ? "#8e3b2f" : "#a44a3a", 7), -0.8 + i * 0.4, 1.0, -0.3); add(goods, cyl(0.01, 0.01, 0.15, "#4a3222", 3), -0.8 + i * 0.4, 1.4, -0.3); } add(goods, ball(0.28, "#c9744f", 9), 0.3, 0.25, 0.15).scale.set(1.6, 0.9, 0.9); break;
      case "herbs": for (let i = 0; i < 4; i++) { const b = add(goods, cyl(0.28, 0.22, 0.2, C.straw, 9), -0.9 + i * 0.6, 0.1, 0); for (let k = 0; k < 6; k++) add(b, cone(0.07, 0.25, ["#3f7a3a", "#6f9b57", "#8fbf6a", "#4f8a3c"][i], 4), (rnd() - 0.5) * 0.3, 0.25, (rnd() - 0.5) * 0.3); } for (let i = 0; i < 3; i++) add(goods, ball(0.08, "#e07aa0", 6), 0.6 + i * 0.2, 0.3, 0.3); break;
      case "oil": for (let i = 0; i < 5; i++) { add(goods, cyl(0.1, 0.12, 0.45, "#3f6b3f", 8), -0.8 + i * 0.4, 0.22, 0.1); add(goods, cyl(0.03, 0.03, 0.15, "#3f6b3f", 6), -0.8 + i * 0.4, 0.52, 0.1); } const bb = add(goods, cyl(0.3, 0.24, 0.2, C.straw, 9), 0.7, 0.1, -0.3); for (let k = 0; k < 8; k++) add(bb, ball(0.05, k % 2 ? "#2f3a2a" : "#6f9b57", 5), (rnd() - 0.5) * 0.4, 0.15, (rnd() - 0.5) * 0.4); break;
    }
    add(s, person(pick(["#3f6b8f", "#c0392b", "#7a4a3a", "#2f5d3f"]), { apron: true }), 0.3, 0, -0.95);
    return s;
  };
  const layout: [string, string, number, number, number][] = [["tomato", "#c9413f", -4.2, -2.2, 0.5], ["cheese", "#e9c46a", 0, -2.8, 0], ["salumi", "#8e2a22", 4.2, -2.2, -0.5], ["herbs", "#2f5d3f", 4.2, 2.2, -2.6], ["oil", "#3f6b3f", -4.2, 2.2, 2.6]];
  for (const [k, c, x, z, rot] of layout) { const s = stall(k, c); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  // a flower cart in the middle instead of a fountain, so nobody wades
  add(g, box(1.4, 0.5, 0.8, IT.wood), 0, 0.55, 1.2); for (let i = 0; i < 8; i++) add(g, ball(0.1, pick(["#e8563f", "#f2b64d", "#e07aa0", "#f4f1ea"]), 6), -0.55 + (i % 4) * 0.37, 0.92, 1.0 + Math.floor(i / 4) * 0.4); add(g, cyl(0.2, 0.2, 0.08, "#2a2a2a", 10), 0.6, 0.2, 1.2).rotation.x = Math.PI / 2;
  // shoppers stroll between stalls
  const spots = layout.map(([, , x, z]) => new THREE.Vector3(x * 0.6, 0, z * 0.55)); spots.push(new THREE.Vector3(-2.2, 0, -0.3), new THREE.Vector3(2.2, 0, -0.3));
  const shoppers = [0, 1, 2, 3].map((i) => { const p = person(pick(["#c0392b", "#e0a52c", "#3f6b8f", "#f4f1ea"])); const st = spots[i * 2 % spots.length].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i * 3 + 1) % spots.length].clone(), wait: i, speed: 0.7 + rnd() * 0.4 }; });
  // pigeons
  const pigeons: THREE.Group[] = [];
  for (let i = 0; i < 5; i++) { const pg = new THREE.Group(); add(pg, ball(0.09, "#8c8f96", 7), 0, 0.09, 0).scale.set(1.3, 0.8, 1); add(pg, ball(0.05, "#6f7378", 6), 0.1, 0.16, 0); pg.position.set((rnd() - 0.5) * 6, 0, (rnd() - 0.5) * 4); g.add(pg); pigeons.push(pg); }
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    for (const sh of shoppers) {
      if (sh.wait > 0) { sh.wait -= dt; continue; }
      const to = sh.target.clone().sub(sh.pos); const d = to.length();
      if (d < 0.15) { sh.wait = 2 + rnd() * 4; sh.target = spots[Math.floor(rnd() * spots.length)].clone(); continue; }
      to.normalize().multiplyScalar(Math.min(d, sh.speed * dt)); sh.pos.add(to); sh.p.position.copy(sh.pos); sh.p.rotation.y = Math.atan2(to.x, to.z);
      (sh.p.userData as { walk?: (t: number) => void }).walk?.(t);
    }
    pigeons.forEach((pg, i) => { pg.position.x += Math.sin(t * 0.7 + i) * dt * 0.3; pg.position.z += Math.cos(t * 0.5 + i) * dt * 0.3; pg.position.y = k * Math.abs(Math.sin(t * 8 + i)) * 1.5; pg.rotation.y = t * 0.3 + i; });   // pigeons scatter on a click
    tickChildren(g)(t, dt);
  };
  return g;
}

export function pastaWorkshop(): P {
  const g = group();
  add(g, italianHouse("rome", 3.6, 2.8, 2.3, 1), 0, 0, -0.6);
  add(g, box(2.4, 0.8, 1.2, IT.wood), 0.4, 0.4, 1.4);
  add(g, box(2.2, 0.05, 1.0, "#f3e6c8"), 0.4, 0.83, 1.4);       // floured board
  const nonna = add(g, person("#5a5a66", { apron: true }), 0.4, 0, 0.5);
  const pin = add(g, cyl(0.05, 0.05, 0.9, "#c9a37a", 6), 0.4, 0.92, 1.3); pin.rotation.z = Math.PI / 2;
  const sheet = add(g, box(1.2, 0.02, 0.8, "#f1d98a"), 0.4, 0.86, 1.5);
  // drying rack with tagliatelle
  add(g, box(0.05, 1.7, 0.05, "#4a3222"), 2.2, 0.85, 1.0); add(g, box(0.05, 1.7, 0.05, "#4a3222"), 2.2, 0.85, 2.0); add(g, box(0.05, 0.05, 1.1, "#4a3222"), 2.2, 1.7, 1.5);
  for (let i = 0; i < 10; i++) add(g, cyl(0.012, 0.012, 1.1, "#f1d98a", 3), 2.2, 1.15, 1.05 + i * 0.1);
  for (let i = 0; i < 3; i++) add(g, cyl(0.3, 0.3, 0.06, C.straw, 9), -1.6, 0.03 + i * 0.07, 1.5 + i * 0.1);
  add(g, ball(0.35, "#d9c5a3", 7), -1.6, 0.3, 0.6).scale.y = 0.8; // flour sack
  const re = reaction(0.8);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    pin.position.z = 1.3 + k * Math.sin(t * 6) * 0.3; pin.rotation.x += dt * (1 + k * 10);        // rolling the sheet out
    sheet.scale.x = 1 + k * Math.max(0, Math.sin(t * 6)) * 0.4;
    const up = (nonna.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.25 + k * Math.sin(t * 6) * 0.15;
    tickChildren(g)(t, dt);
  };
  return g;
}

export function tomatoField(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#8a5a3c"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) {
    const x = -2.6 + j * 0.75, z = -1.4 + i * 0.95;
    const pl = new THREE.Group(); pl.position.set(x, 0.2, z); g.add(pl); plants.push(pl);
    add(pl, cyl(0.02, 0.02, 1.1, "#c9a37a", 4), 0, 0.55, 0);
    add(pl, ball(0.22, "#4f8a3c", 6), 0, 0.5, 0).scale.y = 1.4;
    for (let k = 0; k < 3; k++) add(pl, ball(0.06, k ? "#e0483a" : "#f0a030", 6), (rnd() - 0.5) * 0.3, 0.3 + rnd() * 0.5, (rnd() - 0.5) * 0.3);
  }
  add(g, person("#c0392b", { hat: true }), 3.4, 0, 0.5);
  const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 3.6, 0.15, 1.4); for (let k = 0; k < 6; k++) add(crate, ball(0.08, "#e0483a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.6) * 1.2)) * 0.3; p.scale.set(s, 1 + (s - 1) * 1.2, s); p.rotation.z = Math.sin(t * 1.2 + p.position.x) * 0.03; }); };
  return g;
}

export function oliveGrove(): P {
  const g = group();
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) add(g, oliveTree(0.9 + rnd() * 0.3), -3 + j * 3, 0, -2.5 + i * 2.5);
  // stone press and oil jars
  add(g, cyl(0.7, 0.7, 0.4, IT.stone, 12), 4.5, 0.2, 0); add(g, cyl(0.5, 0.5, 0.3, IT.stoneDark, 12), 4.5, 0.55, 0).rotation.z = Math.PI / 2;
  add(g, box(0.06, 0.06, 1.6, "#4a3222"), 4.5, 0.7, 0);
  for (let i = 0; i < 3; i++) add(g, ball(0.32, "#7a5a3c", 8), 3.4 + i * 0.5, 0.3, 1.6).scale.y = 1.2;
  add(g, person("#7a4a3a", { hat: true }), -1.5, 0, 0.6);
  // nets under one tree
  add(g, new THREE.Mesh(new THREE.CircleGeometry(1.4, 12), mat("#3f4a3a")), 0, 0.04, 0).rotation.x = -Math.PI / 2;
  const olives: THREE.Mesh[] = [];
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); for (let i = 0; i < 12; i++) { const o = add(g, ball(0.05, i % 2 ? "#2f3a2a" : "#6f9b57", 5), (rnd() - 0.5) * 1.6, 1.3 + rnd() * 0.5, (rnd() - 0.5) * 1.6); o.userData.v = 0; olives.push(o); } };
  g.userData.tick = (t, dt) => { re.step(dt); for (let i = olives.length - 1; i >= 0; i--) { const o = olives[i]; o.userData.v += dt * 8; o.position.y = Math.max(0.08, o.position.y - o.userData.v * dt); o.userData.life = (o.userData.life ?? 0) + dt; if (o.userData.life > 4) { g.remove(o); olives.splice(i, 1); } } };
  return g;
}

function fenceRail(len: number): THREE.Group {
  const g = new THREE.Group();
  const n = Math.max(2, Math.round(len / 1.1));
  for (let i = 0; i <= n; i++) add(g, box(0.09, 0.7, 0.09, "#6e4a2c"), -len / 2 + (i / n) * len, 0.35, 0);
  add(g, box(len, 0.06, 0.05, "#8b5e3c"), 0, 0.55, 0); add(g, box(len, 0.06, 0.05, "#8b5e3c"), 0, 0.3, 0);
  return g;
}

export function dairy(): P {
  const g = group();
  add(g, italianHouse("rome", 4.0, 3.0, 2.2, 1), 0, 0, -0.5);
  // parmesan wheels on shelves, mozzarella tubs
  for (let s = 0; s < 3; s++) for (let i = 0; i < 3; i++) add(g, cyl(0.3, 0.3, 0.2, "#e9c46a", 14), -1.2 + i * 0.7, 0.3 + s * 0.55, 1.4).rotation.x = Math.PI / 2;
  for (let s = 0; s < 3; s++) add(g, box(2.4, 0.05, 0.5, "#4a3222"), -0.5, 0.05 + s * 0.55, 1.4);
  add(g, cyl(0.35, 0.3, 0.3, "#f7f2e6", 10), 1.6, 0.15, 1.6); for (let i = 0; i < 4; i++) add(g, ball(0.11, "#fbf7ee", 8), 1.6 + Math.cos(i * 1.6) * 0.15, 0.36, 1.6 + Math.sin(i * 1.6) * 0.15);
  add(g, person("#f4f1ea", { apron: true }), 0.6, 0, 2.2);
  const cows = [add(g, cow(false, false), -3.9, 0, 1.4), add(g, cow(false, false), 4.0, 0, 0.2)];
  cows[0].rotation.y = 0.9; cows[1].rotation.y = -2.2;
  for (const [x, z, rot, len] of [[-3.9, -0.2, 0, 3], [-3.9, 3.0, 0, 3], [-5.4, 1.4, Math.PI / 2, 3.2], [-2.4, 1.4, Math.PI / 2, 3.2]] as [number, number, number, number][]) { const f = fenceRail(len); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  cows.forEach((c) => c.scale.setScalar(0.85));
  g.userData.tick = tickChildren(g);
  g.userData.poke = () => cows.forEach((c) => c.userData.poke?.());
  return g;
}

export function herbGarden(): P {
  const g = group();
  add(g, box(4.6, 0.25, 2.4, IT.stone), 0, 0.12, 0);
  const rows = ["#3f7a3a", "#6f9b57", "#8fbf6a", "#4f8a3c"];
  const bushes: THREE.Mesh[] = [];
  rows.forEach((c, i) => { for (let j = 0; j < 6; j++) { const b = add(g, ball(0.2, c, 6), -2.0 + j * 0.8, 0.4, -0.8 + i * 0.55); b.scale.y = 0.8; bushes.push(b); } });
  for (let i = 0; i < 4; i++) add(g, cone(0.12, 0.6, "#2f5232", 5), -2.4 + i * 1.6, 0.55, 1.0);   // rosemary spears
  for (let i = 0; i < 3; i++) { add(g, cyl(0.16, 0.13, 0.2, "#c9603e", 8), 2.6, 0.35, -0.6 + i * 0.6); add(g, ball(0.16, "#6f9b57", 6), 2.6, 0.55, -0.6 + i * 0.6); }
  const re = reaction(0.7);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); bushes.forEach((b, i) => { const s = 1 + k * Math.max(0, Math.sin(t * 6 + i * 0.5)) * 0.25; b.scale.set(s, 0.8 * s, s); }); };
  return g;
}

export function porciniWood(): P {
  const g = group();
  for (let i = 0; i < 5; i++) { const tr = group(); add(tr, cyl(0.16, 0.24, 2.2, "#5a4030", 6), 0, 1.1, 0); add(tr, ball(1.0, i % 2 ? "#6f8f4a" : "#7fa05a", 8), 0, 2.4, 0).scale.y = 0.9; tr.position.set(-2.4 + i * 1.3, 0, (i % 2) * 1.4 - 0.5); g.add(tr); }
  const caps: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) { const x = -2.6 + rnd() * 5.6, z = -1.4 + rnd() * 2.8; add(g, cyl(0.07, 0.09, 0.22, "#e7d9c3", 6), x, 0.11, z); const cap = add(g, ball(0.16, "#8a5a3c", 8), x, 0.22, z); cap.scale.y = 0.5; caps.push(cap); }
  add(g, person("#2f5d3f", { hat: true, pole: false }), 2.8, 0, 1.2);
  add(g, cyl(0.3, 0.24, 0.24, C.straw, 9), 3.2, 0.12, 1.6);
  const re = reaction(0.8);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); caps.forEach((c, i) => { const s = 1 + Math.max(0, Math.sin(k * Math.PI * 2 + i)) * 0.5 * k; c.scale.set(s, 0.5 * s, s); }); };
  return g;
}

// ---------- Venice ----------

export function campanile(): P {
  const g = group();
  add(g, box(1.6, 8, 1.6, "#b8654a"), 0, 4, 0);
  for (let s = 0; s < 3; s++) add(g, box(0.5, 0.9, 0.06, "#4a2f26"), 0, 6.2 - s * 0.5, 0.81);
  add(g, box(2.0, 1.2, 2.0, IT.venCream), 0, 8.6, 0);
  for (const x of [-0.55, 0, 0.55]) add(g, cyl(0.18, 0.18, 0.06, "#2f2a2a", 8), x, 8.7, 1.01).rotation.x = Math.PI / 2;
  add(g, cone(1.3, 2.2, "#3f7a5a", 4), 0, 10.3, 0).rotation.y = Math.PI / 4;
  add(g, ball(0.16, C.gold, 8), 0, 11.5, 0);
  return g;
}

export function gondola(): P {
  const g = group();
  const hull = add(g, box(2.6, 0.22, 0.55, "#1f1f22"), 0, 0.14, 0);
  void hull;
  for (const sd of [-1, 1]) { const tip = add(g, box(0.5, 0.35, 0.25, "#1f1f22"), sd * 1.45, 0.3, 0); tip.rotation.z = -sd * 0.5; }
  add(g, box(0.25, 0.45, 0.1, "#8c9096"), 1.7, 0.55, 0);      // ferro
  add(g, box(0.9, 0.16, 0.45, "#8e2a22"), 0, 0.3, 0);        // cushions
  const passengers = [add(g, person("#e0a52c"), -0.2, 0.15, 0.1), add(g, person("#3f6b8f"), 0.3, 0.15, -0.1)];
  passengers.forEach((p) => { (p.userData as { sit?: () => void }).sit?.(); p.scale.setScalar(0.8); p.rotation.y = Math.PI / 2; });
  const gondolier = add(g, person("#1f1f22"), -1.0, 0.22, 0); gondolier.rotation.y = Math.PI / 2; gondolier.scale.setScalar(0.9);
  add(gondolier, cyl(0.14, 0.14, 0.05, "#f7f2e6", 10), 0, 1.22, 0); add(gondolier, cyl(0.12, 0.12, 0.08, "#c9413f", 10), 0, 1.26, 0);
  const oar = add(g, cyl(0.02, 0.02, 2.2, "#c9a37a", 4), -0.8, 0.6, 0.35); oar.rotation.set(0.5, 0, 0.9);
  g.userData.tick = (t) => { oar.rotation.z = 0.9 + Math.sin(t * 1.5) * 0.25; oar.rotation.x = 0.5 + Math.cos(t * 1.5) * 0.15; g.rotation.z = Math.sin(t * 1.1) * 0.02; };
  return g;
}

export function venetianBridge(len = 4): P {
  const g = group();
  const steps = 5;
  for (let i = 0; i < steps; i++) { const w = len * (0.5 + i * 0.12); add(g, box(w, 0.2, 1.6, IT.venCream), 0, 0.1 + i * 0.2, 0); }
  add(g, box(len * 0.55, 0.16, 1.6, IT.venCream), 0, 0.1 + steps * 0.2, 0);
  for (const z of [-0.7, 0.7]) { add(g, box(len * 1.1, 0.08, 0.08, "#5a5a66"), 0, 1.35, z); for (let i = 0; i <= 5; i++) add(g, box(0.06, 0.4, 0.06, "#5a5a66"), -len * 0.55 + i * len * 0.22, 1.15, z); }
  return g;
}

export function mooringPole(): P {
  const g = group();
  const pole = add(g, cyl(0.07, 0.09, 2.4, "#f4f1ea", 8), 0, 1.2, 0);
  for (let i = 0; i < 6; i++) add(g, cyl(0.075, 0.075, 0.18, i % 2 ? "#3f6b8f" : "#f4f1ea", 8), 0, 0.3 + i * 0.36, 0);
  void pole; add(g, cone(0.09, 0.2, "#f4f1ea", 8), 0, 2.5, 0);
  return g;
}

export function fishMarket(): P {
  const g = group();
  // an open loggia with columns and a red-tiled roof, the Pescheria
  add(g, box(6, 0.3, 4, IT.venCream), 0, 0.15, 0);
  for (const x of [-2.6, -0.9, 0.9, 2.6]) for (const z of [-1.6, 1.6]) add(g, cyl(0.14, 0.16, 2.6, "#d9ccb0", 8), x, 1.6, z);
  add(g, tiledRoof(6.8, 4.8, 1.1, "#a8433a"), 0, 2.9, 0);
  // slabs of fish on ice, crates, a lobster
  for (const x of [-1.6, 0, 1.6]) { add(g, box(1.3, 0.7, 0.9, IT.stone), x, 0.65, 0.2); add(g, box(1.3, 0.1, 0.9, "#eef4f4"), x, 1.05, 0.2); for (let i = 0; i < 4; i++) { const f = add(g, ball(0.12, i % 2 ? "#7f93a6" : "#b3bfc9", 7), x - 0.4 + i * 0.27, 1.14, 0.2 + (i % 2) * 0.25 - 0.12); f.scale.set(1.9, 0.6, 0.9); } }
  add(g, ball(0.16, "#c9413f", 8), 1.6, 1.16, 0.45).scale.set(1.8, 0.7, 0.8);
  for (let i = 0; i < 5; i++) add(g, ball(0.06, "#3b3f45", 6), -1.9 + i * 0.12, 1.14, -0.15); // mussels
  add(g, person("#3f6b8f", { apron: true }), -0.8, 0, -0.9); add(g, person("#7a4a3a", { apron: true }), 1.2, 0, -0.9);
  const gulls: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const gl = new THREE.Group(); add(gl, ball(0.1, "#f4f1ea", 7), 0, 0, 0).scale.set(1.3, 0.7, 1); for (const sd of [-1, 1]) add(gl, box(0.32, 0.03, 0.12, "#e6e2da"), sd * 0.2, 0.02, 0); gl.position.set(-2.5 + i * 2.5, 3.6, 0.3); g.add(gl); gulls.push(gl); }
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); gulls.forEach((gl, i) => { gl.position.y = 3.6 + Math.sin(t * 1.3 + i) * 0.2 + k * 1.8 * Math.abs(Math.sin(t * 5 + i)); gl.position.x += Math.sin(t * 0.8 + i) * dt * 0.4; gl.rotation.y = t * 0.5 + i; }); };
  return g;
}

export function bacaro(): P {
  const g = group();
  // its own little quay so it sits above the lagoon like the islands do
  add(g, box(5.2, 0.5, 4.6, IT.venCream), 0, 0.2, 0.6);
  add(g, box(5.6, 0.25, 5.0, "#b9ad98"), 0, 0.05, 0.6);
  const inner = new THREE.Group(); inner.position.y = 0.45; g.add(inner);
  add(inner, italianHouse("venice", 3.4, 2.6, 2.2, 2), 0, 0, -0.5);
  add(inner, box(2.2, 0.9, 0.7, "#4a3222"), 0, 0.45, 1.3);
  for (let i = 0; i < 6; i++) { add(inner, cyl(0.12, 0.1, 0.06, "#d9ccb0", 8), -0.8 + i * 0.32, 0.93, 1.3); add(inner, ball(0.07, ["#f7f2e6", "#8e3b2f", "#e9c46a", "#f7f2e6", "#3b3f45", "#c9744f"][i], 6), -0.8 + i * 0.32, 1.02, 1.3); }
  for (let i = 0; i < 3; i++) add(inner, cyl(0.05, 0.04, 0.16, "#8e2a22", 6), 0.6 + i * 0.2, 0.98, 1.5);
  add(inner, box(1.2, 0.35, 0.05, "#3b6b5a"), 0, 2.0, 0.85);
  const standers = [add(inner, person("#e0a52c"), -1.2, 0, 2.2), add(inner, person("#3f6b8f"), 0.2, 0, 2.4), add(inner, person("#f4f1ea"), 1.3, 0, 2.1)];
  add(inner, person("#f4f1ea", { apron: true }), 0, 0, 0.5);
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); standers.forEach((p, i) => { const up = (p.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.y = Math.sin(t * 0.5 + i) * 0.3; up.rotation.x = -k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); } }); tickChildren(g)(t, dt); };
  return g;
}

export function riceFieldItaly(): P {
  const g = group();
  for (let i = 0; i < 2; i++) { add(g, box(6, 0.18, 2.4, "#8fbfbd"), 0, 0.09, -1.4 + i * 2.8); for (let r = 0; r < 3; r++) for (let c = 0; c < 12; c++) add(g, cone(0.05, 0.42, "#8fcf6a", 4), -2.7 + c * 0.49, 0.3, -2.2 + i * 2.8 + r * 0.7); }
  add(g, box(6.4, 0.2, 0.3, "#a37a4f"), 0, 0.1, 0);
  add(g, person("#3f6b8f", { hat: true }), 3.4, 0, 0);
  const heron = group(); for (const z of [-0.05, 0.05]) add(heron, cyl(0.012, 0.012, 0.5, "#3a3a44", 4), 0, 0.25, z); add(heron, ball(0.16, "#cfd6d8", 8), 0, 0.6, 0).scale.set(1.5, 0.9, 1); add(heron, cyl(0.025, 0.03, 0.5, "#cfd6d8", 5), 0.25, 0.85, 0).rotation.z = -0.4; add(heron, ball(0.07, "#cfd6d8", 6), 0.36, 1.1, 0); add(heron, cone(0.02, 0.2, "#e0a52c", 4), 0.5, 1.08, 0).rotation.z = -Math.PI / 2;
  add(g, heron, -2.2, 0.1, 0.9);
  return g;
}

// ---------- Sicily ----------

export function etna(): P {
  const g = group();
  const geo = new THREE.ConeGeometry(9, 11, 14, 5);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const dark = new THREE.Color(IT.lava), mid = new THREE.Color("#6b5a55"), green = new THREE.Color("#6f9b57");
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), f = (y + 5.5) / 11;
    if (f < 0.999) { const k = 1 + (Math.sin(i * 12.9) * 0.08) * (1 - f); pos.setX(i, pos.getX(i) * k * Math.pow(Math.max(0.001, 1 - f), -0.25)); pos.setZ(i, pos.getZ(i) * k * Math.pow(Math.max(0.001, 1 - f), -0.25)); }
    const c = f > 0.55 ? mid.clone().lerp(dark, (f - 0.55) / 0.45) : green.clone().lerp(mid, f / 0.55);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })); m.castShadow = true; m.receiveShadow = true; m.position.y = 5.5; g.add(m);
  add(g, cyl(1.2, 1.6, 0.6, "#2a2528", 12), 0, 10.9, 0);
  const glow = add(g, cyl(0.9, 0.9, 0.1, "#ff6a2a", 12), 0, 11.2, 0);
  g.userData.smoke = new THREE.Vector3(0, 11.4, 0);
  for (let i = 0; i < 6; i++) { const a = rnd() * Math.PI * 2, d = 6 + rnd() * 4; add(g, pricklyPear(), Math.cos(a) * d, 0.2 + Math.max(0, (9.5 - d)) * 0.6, Math.sin(a) * d); }
  g.userData.tick = (t) => { (glow.material as THREE.MeshStandardMaterial).emissive = new THREE.Color("#ff4a1a"); (glow.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3; };
  return g;
}

export function citrusGrove(): P {
  const g = group();
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) add(g, citrusTree(j % 2 ? "lemon" : "orange", 0.9 + rnd() * 0.25), -4 + j * 2.6, 0, -2.4 + i * 2.4);
  add(g, box(9.5, 0.3, 0.3, IT.stone), 0, 0.15, 3.0);
  add(g, person("#e0a52c", { hat: true }), 3.2, 0, -3.4);
  const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 4.2, 0.15, -3.4); for (let k = 0; k < 6; k++) add(crate, ball(0.09, k % 2 ? IT.lemon : IT.orange, 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const falling: THREE.Mesh[] = [];
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); for (let i = 0; i < 8; i++) { const f = add(g, ball(0.09, i % 2 ? IT.lemon : IT.orange, 6), -4 + Math.floor(rnd() * 4) * 2.6 + (rnd() - 0.5) * 0.8, 1.2 + rnd() * 0.5, -2.4 + Math.floor(rnd() * 3) * 2.4 + (rnd() - 0.5) * 0.8); f.userData.v = 0; f.userData.life = 0; falling.push(f); } };
  g.userData.tick = (t, dt) => { re.step(dt); for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.userData.v += dt * 8; f.position.y = Math.max(0.09, f.position.y - f.userData.v * dt); f.userData.life += dt; if (f.userData.life > 4) { g.remove(f); falling.splice(i, 1); } } };
  return g;
}

export function fishingBoat(color = "#3f6b8f"): P {
  const g = group();
  add(g, box(2.0, 0.4, 0.8, color), 0, 0.2, 0);
  add(g, box(2.0, 0.08, 0.86, "#f4f1ea"), 0, 0.42, 0);
  add(g, box(0.5, 0.3, 0.3, color), 1.05, 0.35, 0).rotation.z = 0.4;
  add(g, cyl(0.03, 0.03, 1.6, "#c9a37a", 4), 0.2, 1.2, 0);
  add(g, person("#c0392b", { hat: true }), -0.4, 0.45, 0).scale.setScalar(0.85);
  for (let i = 0; i < 3; i++) add(g, ball(0.09, "#b3bfc9", 6), 0.4 + i * 0.25, 0.5, 0.15).scale.set(1.6, 0.5, 0.8);
  g.userData.tick = (t) => { g.position.y = Math.sin(t * 1.2) * 0.04; g.rotation.z = Math.sin(t * 0.9) * 0.04; };
  return g;
}

export function baroqueChurch(): P {
  const g = group();
  add(g, box(4.4, 3.4, 5, "#e8d7b0"), 0, 1.7, 0);
  add(g, box(4.8, 4.2, 0.5, "#f1e6d0"), 0, 2.1, 2.5);
  add(g, box(2.2, 1.0, 0.55, "#f1e6d0"), 0, 4.7, 2.5);
  add(g, cone(0.4, 0.5, "#f1e6d0", 4), 0, 5.4, 2.5).rotation.y = Math.PI / 4;
  for (const x of [-1.5, 1.5]) for (let i = 0; i < 2; i++) add(g, cyl(0.16, 0.18, 1.6, "#d9ccb0", 8), x + (i ? 0.5 : -0.5), 1.0, 2.85);
  add(g, box(0.9, 1.6, 0.1, "#3b2a22"), 0, 0.8, 2.78);
  add(g, cyl(0.45, 0.45, 0.08, "#3b2a22", 12), 0, 3.1, 2.78).rotation.x = Math.PI / 2;
  add(g, cyl(1.7, 1.7, 1.2, "#e8d7b0", 12), 0, 4.0, -0.6);
  add(g, ball(1.7, "#3f7a8a", 14, ), 0, 4.6, -0.6).scale.y = 0.75;
  add(g, cyl(0.3, 0.3, 0.8, "#f1e6d0", 8), 0, 6.1, -0.6); add(g, ball(0.16, C.gold, 8), 0, 6.6, -0.6);
  for (let i = 0; i < 2; i++) add(g, cypress(1.0), -3.0 + i * 6, 0, 1.5);
  return g;
}

export function sicilyMarket(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(14, 8), mat("#cfc2a6")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  const stall = (kind: string, color: string) => {
    const s = group();
    add(s, box(2.4, 0.75, 1.2, IT.wood), 0, 0.42, 0); add(s, box(2.4, 0.08, 1.2, "#5a3d28"), 0, 0.82, 0);
    for (const x of [-1.1, 1.1]) add(s, cyl(0.05, 0.05, 2.2, "#4a3222", 6), x, 1.1, -0.5);
    add(s, awning(2.8, 1.8, color), 0, 2.2, 0.1);
    const goods = new THREE.Group(); goods.position.y = 0.86; s.add(goods);
    switch (kind) {
      case "lemon": for (let i = 0; i < 3; i++) { const b = add(goods, box(0.7, 0.16, 0.5, "#a37a4f"), -0.75 + i * 0.75, 0.08, 0); for (let k = 0; k < 9; k++) add(b, ball(0.09, i === 1 ? IT.orange : IT.lemon, 6), (rnd() - 0.5) * 0.55, 0.16, (rnd() - 0.5) * 0.35).scale.set(0.85, 1.1, 0.85); } break;
      case "tomato": for (let i = 0; i < 3; i++) { const b = add(goods, box(0.7, 0.16, 0.5, "#a37a4f"), -0.75 + i * 0.75, 0.08, 0); for (let k = 0; k < 8; k++) add(b, ball(0.09, "#e0483a", 6), (rnd() - 0.5) * 0.55, 0.15, (rnd() - 0.5) * 0.35); } for (let i = 0; i < 6; i++) add(goods, ball(0.045, "#8e3b2f", 5), -0.9 + i * 0.12, 1.3, -0.4); break;
      case "arancini": add(goods, box(1.4, 0.05, 0.6, "#5a3d28"), -0.4, 0.03, 0); for (let i = 0; i < 8; i++) add(goods, ball(0.11, "#e0a52c", 8), -0.95 + (i % 4) * 0.35, 0.16, -0.15 + Math.floor(i / 4) * 0.3).scale.y = 1.15; add(goods, cyl(0.32, 0.28, 0.3, C.iron, 10), 0.8, 0.15, 0); for (let i = 0; i < 3; i++) add(goods, box(0.36, 0.08, 0.2, "#e9c46a"), 0.2 + i * 0.05, 0.05 + i * 0.09, 0.4); break;
      case "fish": add(goods, box(2.3, 0.14, 0.9, "#eef4f4"), 0, 0.07, 0); const sw = add(goods, ball(0.2, "#7f93a6", 8), -0.4, 0.22, 0); sw.scale.set(3.0, 0.6, 0.9); add(goods, cone(0.05, 0.9, "#7f93a6", 4), -1.45, 0.22, 0).rotation.z = Math.PI / 2; for (let i = 0; i < 4; i++) add(goods, ball(0.1, "#b3bfc9", 7), 0.5 + i * 0.25, 0.2, 0.3).scale.set(1.8, 0.6, 0.8); break;
    }
    add(s, person(pick(["#3f6b8f", "#c0392b", "#7a4a3a"]), { apron: true }), 0.3, 0, -0.95);
    return s;
  };
  const layout: [string, string, number, number, number][] = [["lemon", "#f2cf3a", -4, -2, 0.3], ["tomato", "#c9413f", 4, -2, -0.3], ["arancini", "#e0a52c", 0, -3.5, 0], ["fish", "#3f6b8f", 4.5, 2.4, -2.8]];
  for (const [k, c, x, z, rot] of layout) { const s = stall(k, c); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  add(g, person("#e0a52c"), -1.5, 0, 0.5); add(g, person("#c0392b"), 1.2, 0, 1.2).rotation.y = 2;
  // a vespa
  const vespa = group(); add(vespa, box(0.9, 0.35, 0.35, "#8fc4c9"), 0, 0.45, 0); add(vespa, cyl(0.16, 0.16, 0.1, "#2a2a2a", 10), -0.35, 0.16, 0).rotation.x = Math.PI / 2; add(vespa, cyl(0.16, 0.16, 0.1, "#2a2a2a", 10), 0.4, 0.16, 0).rotation.x = Math.PI / 2; add(vespa, box(0.4, 0.1, 0.3, "#3b2a22"), -0.1, 0.65, 0); add(vespa, cyl(0.02, 0.02, 0.5, "#8c9096", 4), 0.35, 0.8, 0).rotation.z = 0.3;
  add(g, vespa, -4.5, 0, 2.6).rotation.y = 0.8;
  const cats = [0, 1].map((i) => { const c = group(); add(c, ball(0.12, i ? "#e0a52c" : "#3a3a44", 7), 0, 0.14, 0).scale.set(1.5, 0.8, 0.9); add(c, ball(0.08, i ? "#e0a52c" : "#3a3a44", 6), 0.16, 0.24, 0); for (const sd of [-1, 1]) add(c, cone(0.03, 0.06, i ? "#e0a52c" : "#3a3a44", 4), 0.16, 0.32, sd * 0.05); add(c, cyl(0.015, 0.02, 0.3, i ? "#e0a52c" : "#3a3a44", 4), -0.2, 0.2, 0).rotation.z = 0.8; c.position.set(-1 + i * 3, 0, 2.6); g.add(c); return c; });
  const re = reaction(0.7);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); cats.forEach((c, i) => { c.position.x += k * Math.sin(t * 2 + i) * dt * 2; c.rotation.y = Math.sin(t * 0.4 + i) * 0.5; }); tickChildren(g)(t, dt); };
  return g;
}

export function pasticceria(): P {
  const g = group();
  add(g, italianHouse("sicily", 3.4, 2.6, 2.3, 1), 0, 0, -0.5);
  add(g, awning(3.4, 1.4, "#e07aa0"), 0, 2.2, 1.4);
  add(g, box(2.4, 0.9, 0.8, IT.stone), 0, 0.45, 1.2); add(g, box(2.4, 0.05, 0.8, "#cfe7ea"), 0, 0.93, 1.2);
  for (let i = 0; i < 4; i++) { const cn = add(g, cyl(0.07, 0.07, 0.4, "#d9a441", 8), -0.9 + i * 0.35, 1.02, 1.0); cn.rotation.z = Math.PI / 2; add(g, ball(0.06, "#fbf7ee", 6), -0.9 + i * 0.35 + 0.2, 1.02, 1.0); add(g, ball(0.03, "#8fbf6a", 5), -0.9 + i * 0.35 + 0.24, 1.02, 1.0); }
  add(g, cyl(0.3, 0.3, 0.16, "#8fbf6a", 12), 0.7, 1.02, 1.3); add(g, cyl(0.3, 0.3, 0.06, "#f4f1ea", 12), 0.7, 1.13, 1.3);
  for (let i = 0; i < 5; i++) add(g, ball(0.06, ["#e0483a", "#f2cf3a", "#f08a2a", "#8fbf6a", "#e07aa0"][i], 6), -0.6 + i * 0.25, 1.02, 1.45);   // marzipan fruits
  add(g, person("#f4f1ea", { apron: true }), 0, 0, 0.4);
  add(g, person("#3f6b8f"), 1.4, 0, 2.2).rotation.y = -0.6;
  g.userData.tick = tickChildren(g);
  return g;
}

export const ITALY_PROPS: Record<string, () => P> = {
  tomatoField, pastaWorkshop, oliveGrove, dairy, herbGarden, cow: () => cow(false), chicken: () => chicken(), porciniWood, citrusGrove, fishMarket, riceFieldItaly,
  pizzeria, trattoria, italyMarket, gelateria, bacaro, sicilyMarket, pasticceria, none: () => group(),
};

export const ITALY_ICONS: Record<string, () => P> = {
  tomato: () => { const g = group(); for (let i = 0; i < 3; i++) { const t = add(g, ball(0.22, "#e0483a", 12), -0.3 + i * 0.3, 0.2, (i - 1) * 0.15); t.scale.y = 0.85; add(g, cone(0.06, 0.1, "#3f7a3a", 5), t.position.x, 0.42, t.position.z); } return g; },
  pasta: () => { const g = group(); for (let i = 0; i < 12; i++) { const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.5 + rnd() * 0.2, 0.05 + i * 0.025, -0.3 + rnd() * 0.2), new THREE.Vector3((rnd() - 0.5) * 0.5, 0.15 + i * 0.025, (rnd() - 0.5) * 0.5), new THREE.Vector3(0.4 + rnd() * 0.2, 0.05 + i * 0.025, 0.25 + rnd() * 0.15)]); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 12, 0.03, 6), mat("#f1d98a", { roughness: 0.6 })); g.add(m); } return g; },
  olive: () => { const g = group(); add(g, cyl(0.12, 0.14, 0.7, "#3f6b3f", 10), 0, 0.35, 0); add(g, cyl(0.04, 0.04, 0.25, "#3f6b3f", 6), 0, 0.8, 0); add(g, cyl(0.06, 0.06, 0.06, "#c9a37a", 8), 0, 0.95, 0); for (let i = 0; i < 6; i++) add(g, ball(0.06, i % 2 ? "#2f3a2a" : "#6f9b57", 6), 0.35 + (rnd() - 0.5) * 0.3, 0.06, (rnd() - 0.5) * 0.4); add(g, cone(0.08, 0.3, "#8fa872", 4), 0.4, 0.2, 0.2).rotation.z = 1.2; return g; },
  cheese: () => { const g = group(); const w = add(g, cyl(0.42, 0.42, 0.3, "#e9c46a", 16), -0.1, 0.15, 0); void w; const wedge = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16, 1, false, 0, Math.PI / 3), mat("#f1d98a")); wedge.position.set(0.55, 0.15, 0.2); wedge.rotation.y = 2.4; g.add(wedge); add(g, ball(0.16, "#fbf7ee", 9), 0.2, 0.46, -0.3); return g; },
  basil: () => { const g = group(); add(g, cyl(0.16, 0.13, 0.22, "#c9603e", 9), 0, 0.11, 0); for (let i = 0; i < 7; i++) { const l = add(g, ball(0.11, i % 2 ? "#3f7a3a" : "#6f9b57", 6), (rnd() - 0.5) * 0.35, 0.35 + rnd() * 0.3, (rnd() - 0.5) * 0.35); l.scale.set(1, 0.4, 1.4); l.rotation.y = rnd() * 3; } return g; },
  italyBeef: () => cow(false), italyChicken: () => chicken(),
  mushrooms: () => { const g = group(); for (const [x, z, r] of [[-0.25, 0, 0.3], [0.3, 0.1, 0.22]]) { add(g, cyl(r * 0.5, r * 0.55, 0.32, "#e7d9c3", 7), x, 0.16, z); add(g, ball(r, "#8a5a3c", 9), x, 0.36, z).scale.y = 0.65; } return g; },
  lemon: () => { const g = group(); for (let i = 0; i < 3; i++) { const l = add(g, ball(0.2, i === 1 ? IT.orange : IT.lemon, 12), -0.3 + i * 0.32, 0.2, (i - 1) * 0.12); l.scale.set(1, i === 1 ? 1 : 1.2, 1); } add(g, ball(0.1, "#3f7a3a", 6), 0.05, 0.4, 0.15).scale.set(1, 0.3, 1.6); return g; },
  seafood: () => { const g = group(); add(g, box(1.2, 0.1, 0.8, "#eef4f4"), 0, 0.05, 0); const f = add(g, ball(0.16, "#7f93a6", 9), -0.2, 0.2, 0); f.scale.set(2.0, 0.6, 0.9); add(g, cone(0.1, 0.24, "#7f93a6", 4), -0.62, 0.2, 0).rotation.z = Math.PI / 2; for (let i = 0; i < 3; i++) { const p = add(g, ball(0.06, "#f08a6a", 6), 0.3 + i * 0.15, 0.16, 0.25); p.scale.set(1.5, 0.7, 0.8); } for (let i = 0; i < 4; i++) add(g, ball(0.05, "#3b3f45", 5), 0.2 + i * 0.12, 0.14, -0.25); return g; },
  rice: () => { const g = group(); add(g, cyl(0.42, 0.28, 0.32, "#f7f2e6", 12), 0, 0.16, 0); add(g, ball(0.38, "#f4ecc8", 9), 0, 0.36, 0).scale.y = 0.45; for (let i = 0; i < 6; i++) add(g, ball(0.03, "#e0a52c", 5), (rnd() - 0.5) * 0.4, 0.5, (rnd() - 0.5) * 0.4); return g; },
  oven: () => { const g = group(); const d = add(g, ball(0.5, "#b8654a", 12), 0, 0.4, 0); d.scale.y = 0.75; add(g, box(0.4, 0.25, 0.1, "#1f1a18"), 0, 0.3, 0.45); add(g, cone(0.12, 0.2, "#ff9a3c", 6), 0, 0.28, 0.42); add(g, cyl(0.3, 0.3, 0.05, "#e9c46a", 14), 0.5, 0.05, 0.45); add(g, cyl(0.25, 0.25, 0.03, "#c9413f", 14), 0.5, 0.09, 0.45); add(g, cyl(0.2, 0.2, 0.03, "#f7f2e6", 14), 0.5, 0.12, 0.45); return g; },
  ragu: () => { const g = group(); add(g, cyl(0.42, 0.38, 0.4, "#8c2f2a", 14), 0, 0.2, 0); add(g, cyl(0.38, 0.38, 0.04, "#a63d2a", 14), 0, 0.41, 0); for (let i = 0; i < 6; i++) add(g, ball(0.04, i % 2 ? "#e0483a" : "#5a3a2a", 5), (rnd() - 0.5) * 0.5, 0.44, (rnd() - 0.5) * 0.5); add(g, cyl(0.03, 0.03, 0.5, "#c9a37a", 5), 0.3, 0.55, 0.1).rotation.z = -0.8; return g; },
  dough: () => { const g = group(); add(g, ball(0.32, "#f3e6c8", 12), 0, 0.28, 0).scale.y = 0.75; add(g, cyl(0.04, 0.04, 0.9, "#c9a37a", 6), 0.1, 0.1, 0.4).rotation.z = Math.PI / 2; for (let i = 0; i < 5; i++) add(g, ball(0.03, "#f7f2e6", 4), (rnd() - 0.5) * 0.9, 0.02, (rnd() - 0.5) * 0.6); return g; },
  gelateria: () => { const g = group(); const c = add(g, cone(0.12, 0.45, "#d9a441", 6), 0, 0.22, 0); c.rotation.x = Math.PI; add(g, ball(0.14, "#e07aa0", 8), 0, 0.5, 0); add(g, ball(0.12, "#8fbf6a", 8), 0.05, 0.7, 0.02); return g; },
  bacaro: () => { const g = group(); add(g, cyl(0.06, 0.05, 0.22, "#8e2a22", 8), 0.3, 0.11, 0); add(g, cyl(0.02, 0.02, 0.15, "#e8e8e8", 5), 0.3, 0.29, 0); for (let i = 0; i < 3; i++) { add(g, cyl(0.12, 0.1, 0.05, "#d9ccb0", 8), -0.4 + i * 0.28, 0.03, 0); add(g, ball(0.07, ["#f7f2e6", "#8e3b2f", "#e9c46a"][i], 6), -0.4 + i * 0.28, 0.1, 0); } return g; },
  "stall-arancini": () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.16, "#e0a52c", 9), -0.3 + i * 0.3, 0.16, (i - 1) * 0.1).scale.y = 1.15; return g; },
  pastry: () => { const g = group(); for (let i = 0; i < 2; i++) { const cn = add(g, cyl(0.09, 0.09, 0.5, "#d9a441", 8), -0.1, 0.1 + i * 0.16, (i - 0.5) * 0.25); cn.rotation.z = Math.PI / 2; add(g, ball(0.085, "#fbf7ee", 7), 0.16, 0.1 + i * 0.16, (i - 0.5) * 0.25); add(g, ball(0.04, "#8fbf6a", 5), 0.22, 0.1 + i * 0.16, (i - 0.5) * 0.25); } return g; },
};

// ---------- grand Rome ----------

/** The Pantheon: a columned portico with a pediment in front of a great drum and dome with an oculus. */
export function pantheon(): P {
  const g = group();
  add(g, box(9, 0.5, 8, IT.travertine), 0, 0.25, 2);
  const drum = add(g, cyl(4.2, 4.2, 4.2, "#c9b89a", 24), 0, 2.6, -1.5);
  void drum;
  add(g, cyl(4.4, 4.4, 0.3, "#b9ad98", 24), 0, 4.85, -1.5);
  const dome = add(g, ball(4.1, "#8a8478", 24), 0, 4.9, -1.5); dome.scale.y = 0.62;
  for (let i = 1; i < 5; i++) add(g, cyl(4.15 - i * 0.55, 4.15 - i * 0.55, 0.08, "#7a7468", 24), 0, 4.95 + i * 0.5, -1.5);
  add(g, cyl(0.7, 0.7, 0.2, "#5a554c", 16), 0, 7.45, -1.5);
  // portico: two rows of columns, a pediment
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { const c = add(g, cyl(0.28, 0.32, 4.0, "#d9ccb0", 12), -3.5 + i * 1.0, 2.5, 4.6 - r * 1.6); add(c, box(0.8, 0.22, 0.8, "#e9dcc3"), 0, 2.05, 0); }
  add(g, box(8.4, 0.5, 4, "#d9ccb0"), 0, 4.75, 3.8);
  // the pediment: a shallow triangular gable sitting on the portico's entablature
  const tri = new THREE.Shape(); tri.moveTo(-4.4, 0); tri.lineTo(4.4, 0); tri.lineTo(0, 1.6); tri.closePath();
  const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.6, bevelEnabled: false }), mat("#e9dcc3"));
  ped.position.set(0, 5.0, 5.3); ped.castShadow = true; g.add(ped);
  const gable = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 3.2, bevelEnabled: false }), mat("#d9ccb0"));
  gable.position.set(0, 5.0, 2.1); g.add(gable);
  add(g, box(8.4, 0.5, 4, "#d9ccb0"), 0, 4.75, 3.8);
  add(g, box(2.2, 3.2, 0.2, "#4a3222"), 0, 2.1, 2.2);  // bronze doors
  for (let i = 0; i < 4; i++) add(g, person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea"])), -3 + i * 2, 0.5, 6.4).rotation.y = Math.PI;
  return g;
}

/** A triumphal arch over the street. */
export function triumphalArch(): P {
  const g = group();
  const stone = "#d9ccb0";
  for (const x of [-2.6, 2.6]) { add(g, box(2.0, 5.2, 2.2, stone), x, 2.6, 0); for (const z of [-1.2, 1.2]) add(g, cyl(0.22, 0.26, 4.4, "#e9dcc3", 10), x + 0.9 * Math.sign(x), 2.3, z); }
  add(g, box(7.4, 1.6, 2.4, stone), 0, 6.0, 0);
  add(g, box(7.0, 0.5, 2.2, "#b9ad98"), 0, 6.95, 0);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.45, 8, 16, Math.PI), mat(stone)); arch.position.set(0, 3.6, 0); g.add(arch);
  for (const x of [-2.6, 2.6]) add(g, box(0.9, 1.3, 0.9, "#c9b89a"), x, 7.8, 0);
  for (let i = 0; i < 3; i++) add(g, cyl(0.25, 0.25, 0.12, "#7a7468", 10), -2 + i * 2, 6.2, 1.25).rotation.x = Math.PI / 2;
  return g;
}

/** St Peter's: a great dome on a drum with a colonnaded front and two sweeping colonnades around the square. */
export function basilica(): P {
  const g = group();
  add(g, box(14, 0.5, 8, IT.travertine), 0, 0.25, 0);
  add(g, box(12, 3.6, 6, "#e9dcc3"), 0, 2.3, -1);
  for (let i = 0; i < 8; i++) { const c = add(g, cyl(0.26, 0.3, 3.6, "#f1e6d0", 12), -5.25 + i * 1.5, 2.3, 2.3); add(c, box(0.7, 0.22, 0.7, "#f6ede0"), 0, 1.85, 0); }
  add(g, box(12.6, 0.7, 6.8, "#f1e6d0"), 0, 4.45, -1);
  add(g, box(4, 1.2, 1.0, "#f1e6d0"), 0, 5.4, 2.3);
  for (let i = 0; i < 7; i++) add(g, cyl(0.16, 0.16, 1.0, "#f6ede0", 8), -4.5 + i * 1.5, 5.3, 2.3).scale.set(1, 1, 1);
  add(g, cyl(3.4, 3.4, 2.8, "#e9dcc3", 20), 0, 6.2, -1.5);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(g, cyl(0.16, 0.16, 2.6, "#f6ede0", 8), Math.cos(a) * 3.5, 6.2, -1.5 + Math.sin(a) * 3.5); }
  const dome = add(g, ball(3.5, "#6f8f8a", 24), 0, 7.6, -1.5); dome.scale.y = 0.95;
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI; const rib = add(g, box(0.1, 3.4, 0.1, "#e9dcc3"), 0, 9.6, -1.5); rib.rotation.y = a; rib.position.set(Math.cos(a) * 2.0, 9.4, -1.5 + Math.sin(a) * 2.0); rib.rotation.z = 0.6; void rib; }
  add(g, cyl(0.6, 0.6, 1.2, "#f1e6d0", 10), 0, 11.5, -1.5); add(g, ball(0.25, C.gold, 8), 0, 12.3, -1.5); add(g, box(0.06, 0.6, 0.06, C.gold), 0, 12.7, -1.5);
  for (const x of [-5, 5]) { add(g, ball(1.3, "#6f8f8a", 14), x, 4.8, -2).scale.y = 0.8; add(g, cyl(0.25, 0.25, 0.8, "#f1e6d0", 8), x, 5.9, -2); }
  // the colonnades curving around the square, with an obelisk in the middle
  for (const sd of [-1, 1]) for (let i = 0; i < 12; i++) { const a = Math.PI / 2 + sd * (0.35 + i * 0.16); const x = Math.cos(a) * 9.5, z = 3.5 + Math.sin(a) * 9.5 - 3; add(g, cyl(0.2, 0.22, 3.0, "#e9dcc3", 8), x, 1.5, z + 6); add(g, cyl(0.2, 0.22, 3.0, "#e9dcc3", 8), x * 1.12, 1.5, (z + 3) * 1.12 + 3); }
  for (const sd of [-1, 1]) { const arc = new THREE.Mesh(new THREE.TorusGeometry(10.1, 0.5, 6, 24, 1.9), mat("#f1e6d0")); arc.rotation.x = Math.PI / 2; arc.rotation.z = Math.PI / 2 + sd * 0.35 + (sd < 0 ? -1.9 : 0); arc.position.set(0, 3.2, 6.5); g.add(arc); }
  add(g, obelisk(), 0, 0, 9).scale.setScalar(0.8);
  for (let i = 0; i < 8; i++) add(g, person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#2a2a2e"])), -6 + i * 1.7, 0, 5.5 + (i % 2) * 2.5).rotation.y = Math.PI - (i % 3) * 0.5;
  return g;
}

/** A Trevi-style fountain: palace façade with statues in niches, rocks, and a wide pool people sit around. */
export function treviFountain(): P {
  const g = group();
  const stone = "#e9dcc3";
  add(g, box(10, 6.5, 2.2, stone), 0, 3.25, -2.5);
  for (let i = 0; i < 4; i++) add(g, cyl(0.22, 0.26, 4.2, "#f1e6d0", 10), -3.9 + i * 2.6, 2.4, -1.3);
  add(g, box(10.4, 0.5, 2.6, "#f1e6d0"), 0, 4.8, -2.5);
  add(g, box(3.6, 1.6, 0.4, "#f1e6d0"), 0, 5.9, -1.6);
  add(g, box(0.9, 1.6, 0.4, "#d9ccb0"), 0, 3.0, -1.35);   // Oceanus niche
  add(g, ball(0.28, "#d9ccb0", 8), 0, 3.6, -1.15); add(g, box(0.5, 0.9, 0.35, "#d9ccb0"), 0, 2.9, -1.15);
  for (const x of [-2.4, 2.4]) { add(g, box(0.4, 1.1, 0.3, "#d9ccb0"), x, 2.6, -1.3); add(g, ball(0.2, "#d9ccb0", 7), x, 3.35, -1.3); }
  // rocks and the pool
  for (let i = 0; i < 9; i++) add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 + (i % 3) * 0.25, 0), mat("#c9bda5")), -3.5 + i * 0.9, 0.6 + (i % 2) * 0.35, -0.4 + (i % 3) * 0.3);
  add(g, box(11, 0.5, 5, stone), 0, 0.25, 2);
  add(g, box(10.2, 0.2, 4.2, "#7fc4cc"), 0, 0.55, 2);
  const jets: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) { const j = add(g, cyl(0.04, 0.06, 1.0, "#cfe7ea", 5), -2 + i, 1.5, 0.3); j.rotation.x = 0.5; jets.push(j); }
  // crowd on the rim, backs to the water, one tossing a coin
  const rim: P[] = [];
  for (let i = 0; i < 7; i++) { const p = person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#e07aa0", "#2f5d3f"])); (p.userData as { sit?: () => void }).sit?.(); add(g, p, -4.5 + i * 1.5, 0.4, 4.5).rotation.y = Math.PI; rim.push(p); }
  const tosser = add(g, person("#e0a52c"), 3.2, 0, 6.2); tosser.rotation.y = Math.PI;
  const coin = add(g, cyl(0.06, 0.06, 0.02, C.gold, 8), 3.2, 1.3, 5.5); coin.visible = false;
  add(g, person("#2a2a2e"), -4.5, 0, 6.5).rotation.y = 0.5; add(g, person("#2a2a2e"), -3.8, 0, 6.8).rotation.y = 0.3;   // two nuns
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); coin.visible = true; coin.position.set(3.2, 1.3, 5.5); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    jets.forEach((j, i) => { j.scale.y = 0.85 + Math.sin(t * 6 + i) * 0.15 + k * 0.8; });
    if (coin.visible) { const a = 1 - k; coin.position.set(3.2, 1.3 + Math.sin(a * Math.PI) * 1.4, 5.5 - a * 3.5); coin.rotation.x += dt * 12; if (k === 0) coin.visible = false; }
    const up = (tosser.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * -0.8 * Math.sin(Math.min(1, k * 3) * Math.PI);
    rim.forEach((p, i) => { const u = (p.userData as { upper?: THREE.Group }).upper; if (u) u.rotation.y = Math.sin(t * 0.5 + i) * 0.3; });
  };
  return g;
}

export function vespa(color = "#8fc4c9"): P {
  const g = group();
  add(g, box(0.9, 0.35, 0.35, color), 0, 0.45, 0);
  add(g, cyl(0.16, 0.16, 0.1, "#2a2a2a", 10), -0.35, 0.16, 0).rotation.x = Math.PI / 2;
  add(g, cyl(0.16, 0.16, 0.1, "#2a2a2a", 10), 0.4, 0.16, 0).rotation.x = Math.PI / 2;
  add(g, box(0.4, 0.1, 0.3, "#3b2a22"), -0.1, 0.65, 0);
  add(g, cyl(0.02, 0.02, 0.5, "#8c9096", 4), 0.35, 0.8, 0).rotation.z = 0.3;
  add(g, box(0.06, 0.06, 0.5, "#8c9096"), 0.4, 1.0, 0);
  const rider = add(g, person(pick(["#c0392b", "#3f6b8f", "#e0a52c"])), -0.05, 0.3, 0);
  (rider.userData as { sit?: () => void }).sit?.(); rider.rotation.y = Math.PI / 2; rider.scale.setScalar(0.85);
  add(rider, ball(0.17, "#f4f1ea", 9), 0, 1.06, 0).scale.set(1, 0.8, 1);  // helmet
  return g;
}

/** A few café tables on the piazza edge with people at them. */
export function cafeTables(): P {
  const g = group();
  for (let i = 0; i < 3; i++) {
    const x = i * 1.9;
    add(g, cyl(0.45, 0.45, 0.05, "#f4f1ea", 10), x, 0.75, 0); add(g, cyl(0.04, 0.06, 0.72, "#4a3222", 6), x, 0.36, 0);
    add(g, cyl(0.06, 0.05, 0.08, "#f4f1ea", 8), x - 0.1, 0.82, 0.1); add(g, cyl(0.05, 0.05, 0.06, "#f4f1ea", 8), x + 0.15, 0.81, -0.1);
    for (const sd of [-1, 1]) { add(g, cyl(0.18, 0.18, 0.42, "#4a3222", 8), x, 0.21, sd * 0.75); const p = person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#e07aa0"])); (p.userData as { sit?: () => void }).sit?.(); add(g, p, x, 0.04, sd * 0.75).rotation.y = sd > 0 ? Math.PI : 0; }
  }
  add(g, awning(6.4, 1.6, "#8e2a22"), 1.9, 2.3, -1.2);
  for (const x of [-1.2, 5.0]) add(g, cyl(0.05, 0.05, 2.3, "#4a3222", 6), x, 1.15, -0.5);
  return g;
}
