/** Mexican props: colonial houses, the cathedral and pyramids, the mercado with papel picado, the taquería's trompo, milpa, agave, trajineras, a cenote and a Maya pyramid. Text is Spanish + English only. */
import * as THREE from "three";
import { mat, add, rnd, C, person, cow, bubble, wear, tree, type P } from "./props";
import { freshWater } from "./worldkit";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate); return k; } }; }
type Fig = P & { userData: { upper?: THREE.Group; arms?: THREE.Group[]; walk?: (t: number) => void; sit?: () => void } };

export const MX = { pink: "#e8558a", blue: "#2f6fb5", yellow: "#f2c14e", orange: "#ec7a2b", green: "#3f8f5a", terracotta: "#c46a3a", cream: "#f3e9d2", stone: "#b9ad98", stoneDark: "#8f857a", adobe: "#d9a86c", wood: "#7a4a2a", copper: "#b8703a", agave: "#6f9fb0", marigold: "#f5a623", papel: ["#e8558a", "#f2c14e", "#2f6fb5", "#3f8f5a", "#ec7a2b", "#9b59b6"] };

export function sombrero(color = "#d9b56a"): THREE.Group {
  const g = new THREE.Group();
  add(g, cyl(0.42, 0.46, 0.04, color, 14), 0, 0, 0); add(g, cyl(0.16, 0.2, 0.22, color, 10), 0, 0.12, 0); add(g, cyl(0.17, 0.17, 0.04, "#8e2a22", 10), 0, 0.05, 0);
  return g;
}
/** A person in a sombrero, or a woman in a rebozo shawl. */
export function mexican(shirt: string, opts: { hat?: boolean; apron?: boolean; rebozo?: string } = {}): Fig {
  const p = person(shirt, { apron: opts.apron }) as Fig;
  if (opts.hat) wear(p, sombrero(), 0, 1.19, 0);
  if (opts.rebozo) wear(p, box(0.62, 0.34, 0.36, opts.rebozo), 0, 0.98, 0);
  return p;
}

// ---------- papel picado, marigolds, cacti, palms ----------

/** A string of papel picado banners that flutter. */
export function papelPicado(len: number, n = 7, y = 2.4): P {
  const g = group();
  add(g, cyl(0.012, 0.012, len, "#5a4a3a", 3), 0, y, 0).rotation.z = Math.PI / 2;
  const flags: THREE.Mesh[] = [];
  for (let i = 0; i < n; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), mat(MX.papel[i % MX.papel.length], { side: THREE.DoubleSide })); f.position.set(-len / 2 + (i + 0.5) * (len / n), y - 0.16, 0); g.add(f); flags.push(f); }
  g.userData.tick = (t) => flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 2.2 + i) * 0.35; f.rotation.x = Math.sin(t * 1.7 + i * 0.7) * 0.15; });
  return g;
}
export function saguaro(s = 1): P {
  const g = group();
  add(g, cyl(0.16 * s, 0.2 * s, 2.2 * s, "#5f8f4f", 8), 0, 1.1 * s, 0);
  for (const sd of [-1, 1]) { add(g, cyl(0.1 * s, 0.1 * s, 0.5 * s, "#5f8f4f", 7), sd * 0.35 * s, 1.0 * s, 0).rotation.z = Math.PI / 2; add(g, cyl(0.1 * s, 0.11 * s, 0.9 * s, "#5f8f4f", 7), sd * 0.55 * s, 1.4 * s, 0); }
  return g;
}
export function palm(s = 1): P {
  const g = group();
  const trunk = add(g, cyl(0.08 * s, 0.14 * s, 3 * s, "#a6844f", 6), 0, 1.5 * s, 0); trunk.rotation.z = 0.12;
  const crown = new THREE.Group(); crown.position.set(0.35 * s, 3 * s, 0); g.add(crown);
  for (let i = 0; i < 7; i++) { const fr = add(crown, box(1.6 * s, 0.03, 0.28 * s, "#4f9a4a"), 0, 0, 0); fr.geometry.translate(0.8 * s, 0, 0); fr.rotation.y = (i / 7) * Math.PI * 2; fr.rotation.z = -0.5 - (i % 2) * 0.2; }
  for (let i = 0; i < 3; i++) add(crown, ball(0.09 * s, "#8a6a3a", 6), Math.cos(i * 2) * 0.12 * s, -0.1 * s, Math.sin(i * 2) * 0.12 * s);
  g.userData.tick = (t) => { crown.rotation.y = Math.sin(t * 0.6) * 0.08; crown.rotation.z = Math.sin(t * 0.9) * 0.05; };
  return g;
}
export function marigolds(n = 8): P {
  const g = group();
  for (let i = 0; i < n; i++) { const x = (rnd() - 0.5) * 2.2, z = (rnd() - 0.5) * 1.2; add(g, cyl(0.02, 0.02, 0.3, "#3f7a3a", 4), x, 0.15, z); add(g, ball(0.09, MX.marigold, 7), x, 0.34, z); }
  return g;
}

// ---------- buildings ----------

/** A colonial house: bright plaster, a flat parapet or clay-tile roof, wrought-iron balconies and wooden doors. */
export function casa(color = MX.pink, w = 3.2, d = 2.6, h = 2.4, opts: { tiles?: boolean; storeys?: number } = {}): P {
  const g = group();
  const st = opts.storeys ?? 1, H = h * st;
  add(g, box(w, H, d, color), 0, H / 2, 0);
  add(g, box(w + 0.1, 0.16, d + 0.1, "#f3e9d2"), 0, H + 0.06, 0);   // parapet
  if (opts.tiles) { for (const sd of [-1, 1]) { const r = add(g, box(w + 0.5, 0.12, d / 2 + 0.4, MX.terracotta), 0, H + 0.45, sd * d / 4); r.rotation.x = -sd * 0.35; } add(g, box(w + 0.4, 0.05, 0.24, "#b35a30"), 0, H + 0.78, 0); }
  for (let s = 0; s < st; s++) {
    const y = s * h;
    add(g, box(0.9, 1.6, 0.06, MX.wood), -w / 4, y + 0.8, d / 2 + 0.02);
    add(g, box(0.05, 0.05, 0.1, "#2a2a2e"), -w / 4 + 0.3, y + 0.85, d / 2 + 0.06);
    const win = add(g, box(0.7, 0.9, 0.06, "#6fb3c9"), w / 4, y + 1.35, d / 2 + 0.02); void win;
    for (let k = 0; k < 4; k++) add(g, box(0.02, 0.9, 0.02, "#2a2a2e"), w / 4 - 0.3 + k * 0.2, y + 1.35, d / 2 + 0.06);
    add(g, box(0.8, 0.04, 0.2, "#2a2a2e"), w / 4, y + 0.92, d / 2 + 0.12);
  }
  return g;
}

/** The baroque cathedral: two bell towers, a dome, a stone façade. */
export function cathedral(): P {
  const g = group();
  add(g, box(10, 5, 7, MX.stone), 0, 2.5, 0);
  add(g, box(6, 6.5, 1.0, MX.cream), 0, 3.25, 3.4);
  add(g, box(1.6, 3.2, 0.2, "#4a3222"), 0, 1.6, 3.95);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 14, 1, false, 0, Math.PI), mat("#4a3222")), 0, 3.2, 3.95).rotation.z = Math.PI / 2;
  for (const sd of [-1, 1]) {
    add(g, box(2.4, 8, 2.4, MX.stone), sd * 3.8, 4, 2.8);
    add(g, box(2.0, 1.4, 2.0, MX.cream), sd * 3.8, 8.7, 2.8);
    for (const ax of [-0.55, 0.55]) add(g, box(0.5, 0.9, 0.05, "#2a2a2e"), sd * 3.8 + ax, 8.7, 3.85);
    add(g, cone(1.4, 1.5, MX.terracotta, 8), sd * 3.8, 10.15, 2.8);
    add(g, box(0.06, 0.6, 0.06, C.gold), sd * 3.8, 11.2, 2.8); add(g, box(0.3, 0.06, 0.06, C.gold), sd * 3.8, 11.3, 2.8);
  }
  add(g, cyl(2.0, 2.0, 1.6, MX.cream, 16), 0, 5.8, -1);
  add(g, ball(2.1, MX.yellow, 16), 0, 6.6, -1).scale.y = 0.8;
  add(g, cyl(0.5, 0.5, 0.9, MX.cream, 10), 0, 8.5, -1); add(g, box(0.06, 0.7, 0.06, C.gold), 0, 9.3, -1);
  return g;
}

/** Templo Mayor: the Aztec double pyramid, stepped, with twin shrines. */
export function aztecPyramid(): P {
  const g = group();
  for (let i = 0; i < 4; i++) add(g, box(8 - i * 1.6, 0.9, 7 - i * 1.4, i % 2 ? "#a89f8c" : "#9c9483"), 0, 0.45 + i * 0.9, 0);
  for (const sd of [-1, 1]) { add(g, box(1.6, 1.4, 1.6, sd < 0 ? "#b0413e" : "#3f6fb5"), sd * 1.2, 4.3, 0); add(g, box(2.0, 0.3, 2.0, "#f3e9d2"), sd * 1.2, 5.1, 0); }
  for (const sd of [-1, 1]) for (let k = 0; k < 12; k++) add(g, box(0.9, 0.3, 0.32, "#c9c2b0"), sd * 1.2, 0.15 + k * 0.3, 3.5 - k * 0.3);
  return g;
}

/** El Castillo at Chichén Itzá: nine terraces, four stairways, the temple on top. */
export function mayaPyramid(): P {
  const g = group();
  for (let i = 0; i < 9; i++) add(g, box(11 - i * 1.0, 0.55, 11 - i * 1.0, i % 2 ? "#b8b09b" : "#a89f8c"), 0, 0.275 + i * 0.55, 0);
  add(g, box(2.4, 1.6, 2.4, "#c9c2b0"), 0, 5.75, 0); add(g, box(2.8, 0.3, 2.8, "#8f857a"), 0, 6.7, 0);
  for (const r of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) { const st = new THREE.Group(); st.rotation.y = r; g.add(st); for (let k = 0; k < 16; k++) add(st, box(1.6, 0.32, 0.36, "#d5cdb8"), 0, 0.16 + k * 0.31, 5.5 - k * 0.31); add(st, ball(0.3, "#8f857a", 6), -1.0, 0.3, 5.6); add(st, ball(0.3, "#8f857a", 6), 1.0, 0.3, 5.6); }   // serpent heads at the foot
  return g;
}

/** Monte Albán: a low platform with a stair and a stela. */
export function ruins(): P {
  const g = group();
  add(g, box(7, 0.8, 5, "#b8b09b"), 0, 0.4, 0); add(g, box(5, 0.8, 3.4, "#a89f8c"), 0, 1.2, 0);
  for (let k = 0; k < 5; k++) add(g, box(1.6, 0.3, 0.34, "#d5cdb8"), 0, 0.15 + k * 0.3, 2.6 - k * 0.3);
  add(g, box(0.5, 1.6, 0.25, "#8f857a"), -1.5, 2.4, -0.5); add(g, box(0.5, 1.2, 0.25, "#8f857a"), 1.6, 2.2, 0.4);
  return g;
}

/** The zócalo's flagpole with a great flag that ripples. */
export function flagpole(): P {
  const g = group();
  add(g, cyl(0.08, 0.1, 9, "#dfe3e6", 8), 0, 4.5, 0);
  const geo = new THREE.PlaneGeometry(4.2, 2.4, 14, 4);
  const colors: number[] = [];
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i); const c = new THREE.Color(x < -0.7 ? "#3f8f5a" : x < 0.7 ? "#f3e9d2" : "#c9302a"); colors.push(c.r, c.g, c.b); }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const flag = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.9 }));
  flag.position.set(2.1, 7.6, 0); g.add(flag);
  add(flag, ball(0.22, "#8a6a3a", 7), 0, 0, 0.01).scale.set(1, 1.2, 0.2);
  const base = pos.array.slice() as Float32Array;
  g.userData.tick = (t) => { for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1]; pos.setZ(i, Math.sin(x * 1.6 - t * 3.5) * 0.18 * ((x + 2.1) / 4.2) + Math.sin(y * 2 + t * 2) * 0.05); } pos.needsUpdate = true; geo.computeVertexNormals(); };
  return g;
}

// ---------- food places ----------

/** The mercado: stalls under papel picado. Chillies, tortillas, avocados, limes and herbs, sweets. */
export function mercado(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(15, 9), mat("#cfc6b2")), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  for (const x of [-7, 0, 7]) for (const z of [-4, 4]) add(g, cyl(0.1, 0.1, 3.4, MX.wood, 6), x, 1.7, z);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.06, 9.5), mat("#e3d7bf", { transparent: true, opacity: 0.35 })), 0, 3.5, 0).renderOrder = 3;   // a light awning, see-through from above
  for (const z of [-4, 0, 4]) { const pp = papelPicado(15, 12, 3.1); pp.position.z = z; g.add(pp); }
  const vendors: Fig[] = [];
  const stall = (kind: string) => {
    const s = group();
    add(s, box(2.6, 0.75, 1.2, MX.wood), 0, 0.42, 0); add(s, box(2.6, 0.08, 1.2, "#5a3a1e"), 0, 0.82, 0);
    const goods = new THREE.Group(); goods.position.y = 0.86; s.add(goods);
    switch (kind) {
      case "chillies": for (let i = 0; i < 3; i++) { const b = add(goods, cyl(0.32, 0.26, 0.24, C.straw, 9), -0.85 + i * 0.85, 0.12, 0); const col = ["#8e2a22", "#c9302a", "#3f2a2a"][i]; for (let k = 0; k < 8; k++) { const c = add(b, cone(0.045, 0.28, col, 5), (rnd() - 0.5) * 0.4, 0.2, (rnd() - 0.5) * 0.4); c.rotation.z = rnd() * 3; c.rotation.x = rnd(); } } for (let k = 0; k < 2; k++) { for (let j = 0; j < 8; j++) add(s, cone(0.05, 0.26, "#c9302a", 5), -0.9 + k * 1.8, 2.0 - j * 0.14, -0.55).rotation.z = Math.PI + (j % 2 - 0.5) * 0.4; }   // ristras hanging
        break;
      case "tortillas": add(goods, cyl(0.42, 0.42, 0.04, "#f2c14e", 14), -0.6, 0.02, 0); for (let i = 0; i < 6; i++) add(goods, cyl(0.28, 0.28, 0.03, i % 2 ? "#e9cf8a" : "#f2dca0", 12), -0.6, 0.06 + i * 0.03, 0); add(goods, box(0.8, 0.5, 0.6, "#f3e9d2"), 0.6, 0.25, 0); for (let i = 0; i < 6; i++) add(goods, cyl(0.06, 0.06, 0.28, "#e9d28a", 6), 0.3 + (i % 3) * 0.3, 0.2, -0.2 + Math.floor(i / 3) * 0.4).rotation.z = Math.PI / 2;   // corn cobs
        break;
      case "avocados": for (let i = 0; i < 3; i++) { const b = add(goods, cyl(0.32, 0.26, 0.24, C.straw, 9), -0.85 + i * 0.85, 0.12, 0); for (let k = 0; k < 7; k++) add(b, ball(0.1, i === 1 ? "#c9302a" : "#2f4f2a", 6), (rnd() - 0.5) * 0.4, 0.2, (rnd() - 0.5) * 0.4).scale.y = i === 1 ? 1 : 1.3; } break;
      case "limes": for (let i = 0; i < 2; i++) { const b = add(goods, cyl(0.32, 0.26, 0.24, C.straw, 9), -0.8 + i * 0.8, 0.12, 0); for (let k = 0; k < 8; k++) add(b, ball(0.08, i ? "#f3e9d2" : "#7fbf3a", 6), (rnd() - 0.5) * 0.4, 0.2, (rnd() - 0.5) * 0.4); } for (let k = 0; k < 4; k++) add(goods, cyl(0.02, 0.03, 0.5, "#4f9a4a", 4), 0.7 + k * 0.08, 0.3, 0.2 - k * 0.05).rotation.z = 0.3 - k * 0.1; add(goods, ball(0.14, "#3f7a3a", 6), 0.9, 0.16, -0.25).scale.set(1.3, 0.8, 1);   // cilantro
        break;
      case "sweets": for (let i = 0; i < 8; i++) add(goods, ball(0.07, MX.papel[i % 6], 6), -0.9 + (i % 4) * 0.5, 0.08, -0.25 + Math.floor(i / 4) * 0.5); add(goods, cyl(0.16, 0.16, 0.5, "#7a4a2a", 8), 0.9, 0.25, 0); for (let i = 0; i < 3; i++) add(goods, box(0.5, 0.06, 0.3, "#e07a3a"), -0.2 + i * 0.05, 0.03 + i * 0.06, 0.3);   // piloncillo, tamarind, alegrías
        break;
    }
    const v = mexican(pick(["#3f6fb5", "#e8558a", "#f2c14e", "#3f8f5a"]), { apron: true, rebozo: kind === "tortillas" ? "#8e2a22" : undefined });
    add(s, v, 0.3, 0, -0.95); vendors.push(v);
    return s;
  };
  const layout: [string, number, number, number][] = [["chillies", -5, -2.4, 0], ["tortillas", 0, -2.4, 0], ["avocados", 5, -2.4, 0], ["limes", -3, 2.4, Math.PI], ["sweets", 3, 2.4, Math.PI]];
  for (const [k, x, z, rot] of layout) { const s = stall(k); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s); }
  const spots = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(6, 0, 0.3), new THREE.Vector3(-3, 0, -0.3)];
  type Shopper = { p: Fig; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [0, 1, 2].map((i) => { const p = mexican(pick(["#c0392b", "#f2c14e", "#3f6fb5", "#f4f1ea"]), { hat: i === 1, rebozo: i === 2 ? "#9b59b6" : undefined }); const st = spots[i].clone(); p.position.copy(st); g.add(p); return { p, pos: st, target: spots[(i + 2) % spots.length].clone(), wait: i * 0.8, speed: 0.7 + rnd() * 0.4 }; });
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "¡Pásele, pásele! Come in!", 3.9, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    vendors.forEach((v, i) => { if (v.userData.upper) v.userData.upper.rotation.z = k * Math.sin(t * 8 + i) * 0.25; });
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

/** Taquería al pastor: the trompo turning by the flame, pineapple on top, the taquero slicing onto tortillas. */
export function taqueria(): P {
  const g = group();
  add(g, casa(MX.orange, 4.4, 3.0, 2.4, { tiles: true }), 0, 0, -1.2);
  add(g, box(2.6, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.4); add(g, box(2.4, 0.3, 0.02, MX.yellow), 0, 2.15, 0.44);
  const pp = papelPicado(5, 8, 2.9); pp.position.z = 1.0; g.add(pp);
  add(g, box(3.0, 0.85, 1.0, "#8c9096"), -0.6, 0.42, 1.2);
  // the trompo: a vertical spit of stacked marinated pork, pineapple on top, gas flame behind
  const trompo = new THREE.Group(); trompo.position.set(1.4, 0.9, 1.3); g.add(trompo);
  add(g, box(0.5, 0.05, 0.5, "#5a5a5a"), 1.4, 0.87, 1.3);
  add(g, cyl(0.03, 0.03, 2.2, "#8c9096", 5), 1.4, 1.95, 1.3);
  for (let i = 0; i < 10; i++) add(trompo, cyl(0.16 + Math.sin(i * 0.5) * 0.06 + i * 0.012, 0.16 + Math.sin(i * 0.5 + 0.5) * 0.06 + i * 0.012, 0.12, i % 2 ? "#b0413e" : "#c9573a", 10), 0, 0.06 + i * 0.12, 0);
  add(trompo, cyl(0.2, 0.2, 0.3, "#f2c14e", 8), 0, 1.4, 0); add(trompo, cone(0.08, 0.3, "#3f7a3a", 5), 0, 1.7, 0);
  add(g, box(0.1, 1.3, 0.6, "#2a2a2e"), 1.85, 1.5, 1.3);
  const flame = add(g, box(0.05, 1.0, 0.5, "#f08a2a"), 1.79, 1.5, 1.3);
  const taquero = mexican("#f4f1ea", { apron: true }); add(g, taquero, 0.6, 0, 2.2); taquero.rotation.y = 2.6;
  const knife = add(g, box(0.03, 0.4, 0.06, "#c9cfd6"), 1.05, 1.35, 1.7); knife.rotation.z = 0.8;
  for (let i = 0; i < 5; i++) add(g, cyl(0.16, 0.16, 0.02, "#f2dca0", 10), -1.6 + i * 0.4, 0.86, 1.0);   // tortillas on the plancha
  for (let i = 0; i < 3; i++) { add(g, cyl(0.15, 0.15, 0.02, "#f2dca0", 10), -1.2 + i * 0.45, 0.86, 1.45); add(g, box(0.2, 0.05, 0.12, "#c9573a"), -1.2 + i * 0.45, 0.9, 1.45); add(g, ball(0.04, "#7fbf3a", 5), -1.15 + i * 0.45, 0.94, 1.45); }
  add(g, cyl(0.1, 0.08, 0.12, "#c9302a", 8), -2.0, 0.9, 1.45); add(g, cyl(0.1, 0.08, 0.12, "#3f7a3a", 8), -2.0, 0.9, 1.15);   // salsas roja y verde
  for (const x of [-1.2, 2.6]) { add(g, cyl(0.2, 0.2, 0.4, "#c0392b", 8), x, 0.2, 3.0); const e = mexican(pick(["#3f6fb5", "#f2c14e", "#2a2a2e"]), { hat: x < 0 }); e.userData.sit?.(); add(g, e, x, 0.04, 3.0).rotation.y = Math.PI; }
  g.userData.steam = new THREE.Vector3(-0.6, 1.1, 1.0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(taquero, "¡Con todo! With everything!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    trompo.rotation.y += dt * (0.6 + k * 6);
    flame.scale.y = 0.9 + Math.sin(t * 17) * 0.1; flame.scale.z = 0.9 + Math.cos(t * 13) * 0.15;
    knife.position.y = 1.35 + k * Math.abs(Math.sin(t * 12)) * 0.3;
    if (taquero.userData.upper) taquero.userData.upper.rotation.x = 0.15 + k * Math.sin(t * 12) * 0.15;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** A fonda: the neighbourhood lunch place with checked cloths, clay pots of rice and beans, agua fresca jars. */
export function fonda(): P {
  const g = group();
  add(g, casa(MX.blue, 4.2, 3.0, 2.4), 0, 0, -1.2);
  add(g, box(2.0, 0.5, 0.06, "#1f2430"), 0, 2.15, 0.4); add(g, box(1.8, 0.3, 0.02, "#f3e9d2"), 0, 2.15, 0.44);
  const diners: Fig[] = [];
  for (const x of [-1.3, 1.3]) {
    add(g, box(1.2, 0.06, 1.0, "#f2c14e"), x, 0.78, 1.6); add(g, cyl(0.08, 0.1, 0.72, MX.wood, 6), x, 0.36, 1.6);
    add(g, cyl(0.26, 0.22, 0.12, "#a44a3a", 10), x, 0.86, 1.6); add(g, ball(0.18, "#e07a3a", 7), x, 0.92, 1.6).scale.y = 0.5;
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.4; add(g, cyl(0.2, 0.2, 0.42, MX.wood, 8), x + Math.cos(a) * 0.95, 0.21, 1.6 + Math.sin(a) * 0.95); const d = mexican(pick(["#3f6fb5", "#e8558a", "#f4f1ea", "#3f8f5a"])); d.userData.sit?.(); add(g, d, x + Math.cos(a) * 0.95, 0.04, 1.6 + Math.sin(a) * 0.95).rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); diners.push(d); }
  }
  // clay pots on a brick stove: arroz rojo, frijoles, a big cazuela of guisado
  add(g, box(1.6, 0.8, 0.8, "#a45a3a"), -2.6, 0.4, 0.4);
  const pots = [["#c9573a", -3.1], ["#5a3a2a", -2.6], ["#3f7a3a", -2.1]] as [string, number][];
  pots.forEach(([c, x]) => { add(g, cyl(0.24, 0.2, 0.26, MX.terracotta, 10), x, 0.93, 0.4); add(g, cyl(0.2, 0.2, 0.04, c, 10), x, 1.06, 0.4); });
  for (let i = 0; i < 3; i++) { add(g, cyl(0.18, 0.14, 0.4, ["#e8558a", "#f2c14e", "#7fbf3a"][i], 10), 2.4 + i * 0.45, 1.0, 0.3); add(g, cyl(0.19, 0.19, 0.03, "#dfe3e6", 10), 2.4 + i * 0.45, 1.22, 0.3); }   // aguas frescas
  add(g, box(1.6, 0.8, 0.6, MX.wood), 2.85, 0.4, 0.3);
  const cook = mexican("#f4f1ea", { apron: true, rebozo: "#e8558a" }); add(g, cook, -2.6, 0, 1.2); cook.rotation.y = Math.PI;
  g.userData.steam = new THREE.Vector3(-2.6, 1.3, 0.4);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Provecho! Enjoy!", 1.5, 1400); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    diners.forEach((d, i) => { if (d.userData.upper) { d.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); d.userData.upper.rotation.y = Math.sin(t * 0.5 + i) * 0.15; } });
    if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** The molcajete stand: a basalt mortar, avocados, tomatoes, limes and cilantro, a vendor grinding salsa. */
export function molcajeteStand(): P {
  const g = group();
  add(g, box(2.8, 0.8, 1.2, MX.wood), 0, 0.4, 0);
  for (const x of [-1.3, 1.3]) add(g, cyl(0.04, 0.04, 2.3, MX.wood, 5), x, 1.15, -0.5);
  const awn = add(g, box(3.2, 0.06, 1.8, MX.pink), 0, 2.3, 0.1); awn.rotation.x = 0.15;
  const mort = new THREE.Group(); mort.position.set(0.2, 0.82, 0.1); g.add(mort);
  add(mort, cyl(0.42, 0.3, 0.3, "#3a3a3d", 12), 0, 0.15, 0); for (let i = 0; i < 3; i++) add(mort, box(0.1, 0.1, 0.1, "#3a3a3d"), Math.cos(i * 2.1) * 0.3, -0.05, Math.sin(i * 2.1) * 0.3);
  add(mort, cyl(0.34, 0.34, 0.06, "#8fc26a", 12), 0, 0.3, 0);
  const pestle = add(mort, cyl(0.07, 0.1, 0.4, "#3a3a3d", 8), 0.1, 0.5, 0); pestle.rotation.z = 0.5;
  for (let i = 0; i < 3; i++) { const b = add(g, cyl(0.24, 0.2, 0.2, C.straw, 9), -1.0 + (i % 2) * 0.5, 0.9, -0.3 + Math.floor(i / 2) * 0.5); for (let k = 0; k < 5; k++) add(b, i === 0 ? ball(0.09, "#2f4f2a", 6) : i === 1 ? ball(0.09, "#c9302a", 6) : ball(0.07, "#7fbf3a", 6), (rnd() - 0.5) * 0.3, 0.16, (rnd() - 0.5) * 0.3); }
  add(g, ball(0.14, "#3f7a3a", 6), 1.0, 0.9, 0.3).scale.set(1.3, 0.8, 1); add(g, cyl(0.1, 0.08, 0.16, "#f3e9d2", 8), 1.1, 0.9, -0.2);
  for (let i = 0; i < 6; i++) add(g, box(0.05, 0.16, 0.1, "#f2dca0"), 0.75 + (i % 3) * 0.07, 0.9, 0.5 + Math.floor(i / 3) * 0.12).rotation.z = 0.2;   // totopos
  const vendor = mexican("#f2c14e", { apron: true, rebozo: "#3f6fb5" }); add(g, vendor, 0.2, 0, -0.9);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(vendor, "¡Salsa fresca! Fresh salsa!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pestle.rotation.y = t * (0.5 + k * 8); pestle.position.x = 0.1 + Math.cos(t * (0.5 + k * 8)) * 0.1 * (0.5 + k); pestle.position.z = Math.sin(t * (0.5 + k * 8)) * 0.1 * (0.5 + k); if (vendor.userData.upper) vendor.userData.upper.rotation.x = 0.15 + k * Math.abs(Math.sin(t * 9)) * 0.2; };
  return g;
}

/** A churros cart with a copper vat of oil and sugar-dusted churros. */
export function churrosCart(): P {
  const g = group();
  add(g, box(1.6, 0.8, 0.9, MX.yellow), 0, 0.6, 0); for (const x of [-0.5, 0.5]) add(g, cyl(0.22, 0.22, 0.08, "#2a2a2e", 10), x, 0.22, 0.5).rotation.x = Math.PI / 2;
  add(g, cyl(0.32, 0.28, 0.3, MX.copper, 12), -0.3, 1.15, 0); add(g, cyl(0.29, 0.29, 0.04, "#e0a52c", 12), -0.3, 1.3, 0);
  for (let i = 0; i < 6; i++) add(g, cyl(0.035, 0.035, 0.6, "#d9a441", 6), 0.35 + (i % 3) * 0.12, 1.15 + Math.floor(i / 3) * 0.1, -0.15 + (i % 2) * 0.2).rotation.z = 0.2;
  add(g, cyl(0.03, 0.03, 1.9, "#8c9096", 4), 0.6, 1.5, -0.35); add(g, cone(0.9, 0.35, MX.pink, 10), 0.6, 2.5, -0.35);
  const vendor = mexican("#3f8f5a", { apron: true, hat: true }); add(g, vendor, 0, 0, -0.9);
  g.userData.steam = new THREE.Vector3(-0.3, 1.5, 0);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(vendor, "¡Churros calientitos! Hot churros!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); if (vendor.userData.upper) vendor.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

/** A mariachi trio: trumpet, guitar and guitarrón, in charro suits and sombreros. They play when clicked. */
export function mariachi(): P {
  const g = group();
  const players: { p: Fig; kind: string }[] = [];
  ["trumpet", "guitar", "guitarron"].forEach((kind, i) => {
    const p = mexican("#2a2a2e", { hat: true }); add(p, box(0.1, 0.5, 0.04, "#c9a37a"), 0, 0.85, 0.28);   // silver buttons down the front
    add(g, p, -1.2 + i * 1.2, 0, (i % 2) * 0.3); p.rotation.y = 0.2 - i * 0.2;
    if (kind === "trumpet") add(p, cone(0.09, 0.4, "#e0a52c", 8), 0.25, 1.05, 0.5).rotation.x = -Math.PI / 2;
    else add(p, box(kind === "guitar" ? 0.5 : 0.7, kind === "guitar" ? 0.3 : 0.5, 0.12, "#a37a4f"), 0.1, 0.8, 0.3);
    players.push({ p, kind });
  });
  const notes: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) { const n = ball(0.07, "#2a2a2e", 6); n.visible = false; g.add(n); notes.push(n); }
  const re = reaction(0.35);
  g.userData.poke = () => { re.poke(); bubble(g, "¡Ay, ay, ay, ay! ♪", 2.3, 1800); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    players.forEach(({ p }, i) => { if (p.userData.upper) { p.userData.upper.rotation.z = Math.sin(t * 1.2 + i) * 0.04 + k * Math.sin(t * 7 + i) * 0.12; p.userData.upper.rotation.x = k * Math.abs(Math.sin(t * 4 + i)) * 0.1; } });
    notes.forEach((n, i) => { const a = (t * 1.5 + i * 1.3) % 6; n.visible = k > 0.05; n.position.set(Math.sin(a) * 1.4, 1.8 + a * 0.4, Math.cos(a) * 0.6); n.scale.setScalar(Math.max(0.01, 1 - a / 6) * k * 2); });
  };
  return g;
}

/** A Xochimilco trajinera: a flat boat with a painted arch and a name, poled along the canal. */
export function trajinera(color = MX.pink, name = "LUPITA"): P {
  const g = group();
  add(g, box(3.2, 0.3, 1.2, "#8a6a3a"), 0, 0.2, 0); add(g, box(3.0, 0.05, 1.1, "#c9a37a"), 0, 0.37, 0);
  for (const x of [-1.2, 1.2]) for (const z of [-0.5, 0.5]) add(g, cyl(0.03, 0.03, 1.4, "#f4f1ea", 4), x, 1.05, z);
  add(g, box(3.2, 0.06, 1.3, color), 0, 1.75, 0);
  const arch = add(g, new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.09, 6, 12, Math.PI), mat(color)), 1.6, 0.9, 0); arch.rotation.y = Math.PI / 2; void name;
  for (let i = 0; i < 6; i++) add(g, ball(0.08, MX.papel[i % 6], 6), 1.62, 0.9 + Math.sin(i / 5 * Math.PI) * 0.65 - 0.0, -0.65 + i / 5 * 1.3);
  add(g, box(1.8, 0.4, 0.5, "#a37a4f"), 0, 0.6, 0);
  for (let i = 0; i < 4; i++) { const p = mexican(pick(["#f2c14e", "#3f6fb5", "#e8558a", "#f4f1ea"]), { hat: i === 1 }); p.userData.sit?.(); add(g, p, -0.9 + i * 0.6, 0.35, (i % 2 ? 0.35 : -0.35)).rotation.y = i % 2 ? 0 : Math.PI; p.scale.setScalar(0.85); }
  const poler = mexican("#f4f1ea", { hat: true }); add(g, poler, -1.4, 0.37, 0); poler.rotation.y = -Math.PI / 2; poler.scale.setScalar(0.85);
  add(g, cyl(0.02, 0.02, 2.6, "#8a6a3a", 4), -1.6, 1.0, 0.3).rotation.z = 0.35;
  g.userData.tick = (t) => { g.position.y += 0; g.rotation.z = Math.sin(t * 1.1) * 0.02; if (poler.userData.upper) poler.userData.upper.rotation.x = 0.1 + Math.sin(t * 1.6) * 0.2; };
  return g;
}

/** The milpa: corn with beans climbing the stalks and squash between the rows. */
export function milpa(): P {
  const g = group();
  add(g, box(7, 0.2, 4.4, "#7a5a3a"), 0, 0.1, 0);
  const stalks: THREE.Group[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) {
    const st = new THREE.Group(); st.position.set(-3.2 + c * 0.8, 0.2, -1.5 + r * 1.0); g.add(st); stalks.push(st);
    const h = 1.5 + rnd() * 0.5;
    add(st, cyl(0.03, 0.04, h, "#6fa84a", 5), 0, h / 2, 0);
    for (let l = 0; l < 4; l++) { const leaf = add(st, box(0.55, 0.02, 0.1, "#7fbf3a"), 0.25, 0.4 + l * 0.32, 0); leaf.rotation.y = l * 1.6; leaf.rotation.z = 0.35; }
    add(st, cone(0.05, 0.3, "#e9d28a", 5), 0, h + 0.1, 0);
    if (c % 2) add(st, cyl(0.07, 0.07, 0.3, "#e9cf6a", 6), 0.08, h * 0.55, 0.05).rotation.z = 0.3;   // the cob
    if (r % 2) for (let b = 0; b < 3; b++) add(st, ball(0.04, "#3f7a3a", 5), Math.cos(b * 2) * 0.06, 0.5 + b * 0.35, Math.sin(b * 2) * 0.06);   // beans climbing
  }
  for (let i = 0; i < 6; i++) { add(g, ball(0.2, "#e0a52c", 7), -2.8 + i * 1.1, 0.32, 0.5 - (i % 2)).scale.y = 0.7; add(g, ball(0.22, "#4f9a4a", 6), -2.5 + i * 1.1, 0.3, 0.7 - (i % 2)).scale.set(1.4, 0.3, 1.4); }   // squash under big leaves
  const farmer = mexican("#f4f1ea", { hat: true }); add(g, farmer, 4.0, 0, 0.5); farmer.rotation.y = -1.2;
  add(g, cyl(0.25, 0.2, 0.3, C.straw, 8), 4.4, 0.15, 1.3); for (let k = 0; k < 4; k++) add(g, cyl(0.06, 0.06, 0.26, "#e9cf6a", 6), 4.3 + (k % 2) * 0.15, 0.36, 1.2 + Math.floor(k / 2) * 0.15).rotation.z = Math.PI / 2;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(farmer, "¡Maíz! Corn!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); stalks.forEach((s) => { s.rotation.z = Math.sin(t * 1.3 + s.position.x) * 0.05 + k * Math.sin((1 - k) * 9 - s.position.x * 1.2) * 0.35; }); if (farmer.userData.upper) farmer.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** The tortillería: nixtamal soaking, the metate, a woman patting tortillas onto a clay comal over the fire. */
export function tortilleria(): P {
  const g = group();
  add(g, casa(MX.adobe, 3.6, 2.6, 2.0, { tiles: true }), 0, 0, -1.0);
  add(g, box(1.6, 0.5, 0.06, "#1f2430"), 0, 1.85, 0.4); add(g, box(1.4, 0.3, 0.02, MX.yellow), 0, 1.85, 0.44);
  add(g, cyl(0.6, 0.5, 0.5, "#a45a3a", 12), 0.2, 0.25, 1.4);
  const comal = add(g, cyl(0.62, 0.62, 0.05, "#3a3a3d", 16), 0.2, 0.53, 1.4);
  add(g, box(0.25, 0.4, 0.25, "#e07a3a"), 0.2, 0.2, 1.4);
  const tortillas: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) tortillas.push(add(g, cyl(0.16, 0.16, 0.02, "#f2dca0", 10), 0.2 + Math.cos(i * 2.1) * 0.32, 0.57, 1.4 + Math.sin(i * 2.1) * 0.32));
  const cook = mexican("#f4f1ea", { rebozo: "#8e2a22" }); add(g, cook, -0.9, 0, 1.8); cook.rotation.y = 1.4;
  const hand = add(g, cyl(0.14, 0.14, 0.02, "#f2dca0", 10), -0.55, 0.95, 1.55);
  add(g, box(0.7, 0.16, 0.4, "#3a3a3d"), -1.8, 0.08, 0.9).rotation.x = 0.15; add(g, cyl(0.05, 0.05, 0.5, "#3a3a3d", 6), -1.8, 0.28, 0.9).rotation.z = Math.PI / 2;   // the metate and its mano
  add(g, cyl(0.3, 0.26, 0.3, MX.terracotta, 10), 1.6, 0.15, 1.9); add(g, cyl(0.28, 0.28, 0.04, "#f3e9c0", 10), 1.6, 0.3, 1.9);   // nixtamal in lime water
  for (let i = 0; i < 6; i++) add(g, cyl(0.28, 0.28, 0.03, "#f2dca0", 12), 1.8, 0.62 + i * 0.03, 0.8); add(g, box(0.8, 0.6, 0.8, MX.wood), 1.8, 0.3, 0.8);
  g.userData.steam = new THREE.Vector3(0.2, 0.9, 1.4);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Tortillas! Fresh tortillas!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); hand.position.y = 0.95 + Math.sin(t * (2 + k * 8)) * 0.06; hand.rotation.z = Math.sin(t * (2 + k * 8)) * 0.4; tortillas.forEach((tt, i) => { tt.position.y = 0.57 + k * Math.max(0, Math.sin(t * 10 + i * 2)) * 0.15; }); if (cook.userData.upper) cook.userData.upper.rotation.x = 0.2 + Math.sin(t * (2 + k * 8)) * 0.05; void comal; };
  return g;
}

/** Ristras of chillies drying on a rack, baskets of dried anchos and guajillos, and a woman toasting them on a comal. */
export function chilliRacks(): P {
  const g = group();
  const ristras: THREE.Group[] = [];
  for (let r = 0; r < 2; r++) {
    add(g, cyl(0.05, 0.05, 2.0, MX.wood, 5), -2.6, 1.0, -0.8 + r * 1.6); add(g, cyl(0.05, 0.05, 2.0, MX.wood, 5), 2.6, 1.0, -0.8 + r * 1.6); add(g, cyl(0.03, 0.03, 5.2, MX.wood, 4), 0, 1.95, -0.8 + r * 1.6).rotation.z = Math.PI / 2;
    for (let i = 0; i < 7; i++) { const rs = new THREE.Group(); rs.position.set(-2.2 + i * 0.73, 1.95, -0.8 + r * 1.6); g.add(rs); ristras.push(rs); for (let j = 0; j < 9; j++) { const c = add(rs, cone(0.05, 0.28, j % 3 === 2 ? "#8e2a22" : "#c9302a", 5), (j % 2 - 0.5) * 0.08, -0.1 - j * 0.15, (j % 3 - 1) * 0.05); c.rotation.z = Math.PI + (j % 2 - 0.5) * 0.4; } }
  }
  for (let i = 0; i < 3; i++) { const b = add(g, cyl(0.34, 0.28, 0.26, C.straw, 9), -1.4 + i * 1.4, 0.13, 2.2); const col = ["#3f2a2a", "#8e2a22", "#c9573a"][i]; for (let k = 0; k < 9; k++) { const c = add(b, cone(0.05, 0.3, col, 5), (rnd() - 0.5) * 0.45, 0.2, (rnd() - 0.5) * 0.45); c.rotation.z = rnd() * 3; c.rotation.x = rnd(); } }
  add(g, cyl(0.4, 0.4, 0.05, "#3a3a3d", 14), 2.4, 0.42, 2.0); add(g, box(0.3, 0.4, 0.3, "#a45a3a"), 2.4, 0.2, 2.0);
  const cook = mexican("#e8558a", { rebozo: "#2f6fb5" }); add(g, cook, 3.2, 0, 2.4); cook.rotation.y = -2.2;
  g.userData.smoke = new THREE.Vector3(2.4, 0.8, 2.0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Pica! Hot!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); ristras.forEach((rs, i) => { rs.rotation.x = Math.sin(t * 1.5 + i) * 0.04 + k * Math.sin(t * 9 + i) * 0.3; }); };
  return g;
}

/** The cocina de humo: mole ground on the metate, a cazuela of it bubbling, cacao and dried chillies at hand. */
export function moleKitchen(): P {
  const g = group();
  add(g, casa("#f3e9d2", 3.8, 2.8, 2.0, { tiles: true }), 0, 0, -1.0);
  add(g, box(1.8, 0.5, 0.06, "#1f2430"), 0, 1.85, 0.4); add(g, box(1.6, 0.3, 0.02, "#e8558a"), 0, 1.85, 0.44);
  add(g, box(2.0, 0.7, 0.8, "#a45a3a"), -0.6, 0.35, 1.3);
  const caz = add(g, cyl(0.5, 0.4, 0.4, MX.terracotta, 12), -0.6, 0.9, 1.3); void caz;
  const sauce = add(g, cyl(0.46, 0.46, 0.05, "#3a2418", 12), -0.6, 1.1, 1.3);
  const bubbles: THREE.Mesh[] = []; for (let i = 0; i < 4; i++) { const b = ball(0.05, "#5a3a28", 5); b.position.set(-0.6 + Math.cos(i * 1.6) * 0.25, 1.12, 1.3 + Math.sin(i * 1.6) * 0.25); g.add(b); bubbles.push(b); }
  const spoon = add(g, cyl(0.03, 0.03, 0.8, MX.wood, 5), -0.3, 1.4, 1.3); spoon.rotation.z = 0.6;
  add(g, box(0.7, 0.16, 0.4, "#3a3a3d"), 1.2, 0.08, 1.6).rotation.x = 0.15; add(g, cyl(0.05, 0.05, 0.5, "#3a3a3d", 6), 1.2, 0.28, 1.6).rotation.z = Math.PI / 2;
  for (let i = 0; i < 4; i++) add(g, cyl(0.12, 0.1, 0.14, ["#8e2a22", "#5a3a2a", "#e9d28a", "#3a2418"][i], 8), 0.6 + i * 0.32, 0.9, 0.9);   // chillies, cacao, sesame, chocolate
  const cook = mexican("#3f8f5a", { apron: true, rebozo: "#f2c14e" }); add(g, cook, -0.6, 0, 2.3); cook.rotation.y = Math.PI;
  g.userData.steam = new THREE.Vector3(-0.6, 1.4, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Mole! Mole!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); spoon.rotation.y = t * (0.6 + k * 6); bubbles.forEach((b, i) => { b.position.y = 1.12 + Math.max(0, Math.sin(t * (2 + k * 6) + i * 1.7)) * 0.08; }); sauce.rotation.y = t * 0.2; if (cook.userData.upper) cook.userData.upper.rotation.x = 0.2 + k * Math.sin(t * 6) * 0.1; };
  return g;
}

/** Blue agave in rows, a jimador with his coa, and the distillery's copper stills and barrels. */
export function agaveField(): P {
  const g = group();
  const plants: THREE.Group[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    const a = new THREE.Group(); a.position.set(-3.5 + c * 1.4, 0, -2 + r * 1.6); g.add(a); plants.push(a);
    for (let l = 0; l < 12; l++) { const leaf = add(a, cone(0.13, 1.3, l % 3 ? "#5f8fa0" : "#6f9fb0", 4), 0, 0, 0); leaf.geometry.translate(0, 0.65, 0); leaf.rotation.y = (l / 12) * Math.PI * 2; leaf.rotation.x = 0.55 + (l % 2) * 0.35; leaf.rotation.z = (l % 3) * 0.05; }
    add(a, ball(0.22, "#7fa8b8", 7), 0, 0.2, 0);
  }
  const jim = mexican("#f4f1ea", { hat: true }); add(g, jim, 4.2, 0, -0.5); jim.rotation.y = -1.6;
  add(g, cyl(0.02, 0.02, 1.4, MX.wood, 4), 4.5, 0.7, -0.2).rotation.z = 0.3; add(g, box(0.3, 0.02, 0.2, "#c9cfd6"), 4.7, 1.35, -0.2);   // the coa
  add(g, ball(0.35, "#e9d7a8", 8), 4.4, 0.35, 0.8);   // a harvested piña
  // the distillery: a small building with copper stills and barrels
  add(g, casa("#f3e9d2", 3.0, 2.2, 2.0, { tiles: true }), 0, 0, 3.6);
  for (let i = 0; i < 2; i++) { add(g, cyl(0.3, 0.36, 0.7, MX.copper, 10), -2.6 + i * 0.8, 0.35, 3.4); add(g, ball(0.3, MX.copper, 8), -2.6 + i * 0.8, 0.8, 3.4); add(g, cyl(0.04, 0.04, 0.8, MX.copper, 5), -2.4 + i * 0.8, 1.2, 3.4).rotation.z = -0.9; }
  for (let i = 0; i < 3; i++) add(g, cyl(0.28, 0.28, 0.6, "#7a4a2a", 10), 2.4, 0.3, 2.9 + i * 0.7).rotation.z = Math.PI / 2;
  add(g, cyl(0.1, 0.08, 0.3, "#8fc4c9", 8), 2.4, 0.9, 2.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(jim, "¡Salud! Cheers!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { p.rotation.y = k * Math.sin(t * 6 + p.position.x) * 0.15; p.scale.setScalar(1 + k * Math.max(0, Math.sin(t * 8 + p.position.x)) * 0.08); }); if (jim.userData.upper) jim.userData.upper.rotation.x = 0.15 + k * Math.abs(Math.sin(t * 8)) * 0.35; };
  return g;
}

/** An avocado tree: a broad lighter crown with the dark pear-shaped fruit hanging clear of the leaves. */
export function avocadoTree(s = 1): P {
  const tr = group();
  add(tr, cyl(0.1 * s, 0.14 * s, 1.0 * s, "#6b4a2c", 6), 0, 0.5 * s, 0);
  const crown = new THREE.Group(); tr.add(crown); (tr.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[] }).crown = crown;
  add(crown, ball(0.85 * s, "#5f9a4a", 9), 0, 1.6 * s, 0).scale.y = 1.05;
  add(crown, ball(0.55 * s, "#6fae52", 8), 0.35 * s, 2.0 * s, 0.2 * s);
  const fruits: THREE.Mesh[] = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + rnd() * 0.5; const f = add(crown, ball(0.11 * s, "#2f4f2a", 7), Math.cos(a) * 0.75 * s, (0.95 + rnd() * 0.7) * s, Math.sin(a) * 0.75 * s); f.scale.y = 1.5; add(crown, cyl(0.01, 0.01, 0.16 * s, "#6b4a2c", 3), f.position.x, f.position.y + 0.2 * s, f.position.z); fruits.push(f); }
  (tr.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[] }).fruits = fruits;
  return tr;
}

export function avocadoOrchard(): P {
  const g = group();
  const trees: P[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) trees.push(add(g, avocadoTree(0.85 + rnd() * 0.25), -2.4 + j * 2.4, 0, -2.4 + i * 2.4));
  const picker = mexican("#3f6fb5", { hat: true }); add(g, picker, 3.6, 0, 0.4);
  add(g, cyl(0.02, 0.02, 2.2, "#a37a4f", 4), 3.9, 1.1, 0.6).rotation.z = 0.2; add(g, cyl(0.12, 0.1, 0.16, "#a37a4f", 8), 4.1, 2.2, 0.6);   // the picking pole with its basket
  const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 4.0, 0.15, 1.3); for (let k = 0; k < 6; k++) add(crate, ball(0.08, "#2f4f2a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3).scale.y = 1.4;
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "¡Aguacates! Avocados!", 3.0, 1300); for (const tr of trees) { const fr = (tr.userData as { fruits?: THREE.Mesh[] }).fruits ?? []; for (let i = 0; i < 2; i++) { const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.1, "#2f4f2a", 6); m.scale.y = 1.5; const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const tr of trees) { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) { c.rotation.z = Math.sin(t * 26 + tr.position.x) * 0.06 * shake; c.rotation.x = Math.cos(t * 21 + tr.position.z) * 0.05 * shake; } } }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.1, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.101) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

/** A horse for the charro. */
export function horse(color = "#6b4a2c"): P {
  const g = group();
  add(g, box(1.3, 0.6, 0.55, color), 0, 0.95, 0);
  const neck = add(g, box(0.35, 0.7, 0.35, color), 0.6, 1.35, 0); neck.rotation.z = -0.5;
  add(g, box(0.5, 0.3, 0.3, color), 0.95, 1.6, 0); add(g, box(0.12, 0.08, 0.08, "#2a2a2e"), 1.2, 1.55, 0);
  for (const z of [-0.1, 0.1]) add(g, cone(0.05, 0.16, color, 4), 0.85, 1.82, z);
  for (let i = 0; i < 5; i++) add(g, box(0.08, 0.14, 0.12, "#2a2a2e"), 0.55 + i * 0.1, 1.7 - i * 0.12, 0);   // mane
  for (const x of [-0.5, 0.5]) for (const z of [-0.18, 0.18]) add(g, box(0.14, 0.7, 0.14, color), x, 0.35, z);
  add(g, box(0.1, 0.5, 0.1, "#2a2a2e"), -0.7, 0.9, 0).rotation.z = 0.3;
  add(g, box(0.5, 0.1, 0.6, "#8e2a22"), 0, 1.28, 0);   // the saddle blanket
  return g;
}

/** The rancho: hanwoo-style cattle in a corral, a charro on horseback, and the asador where the chili con carne pot sits over the coals. */
export function rancho(): P {
  const g = group();
  const cows: P[] = [];
  for (let i = 0; i < 3; i++) { const cw = cow(i === 1, false, "¡Muuu! Moo!"); cw.position.set(-2.2 + i * 2.0, 0, -0.5 + (i % 2) * 1.4); cw.rotation.y = i * 1.4; g.add(cw); cows.push(cw); }
  for (const [x, z, rot, len] of [[0, -2.2, 0, 7], [0, 2.2, 0, 7], [-3.5, 0, Math.PI / 2, 4.4], [3.5, 0, Math.PI / 2, 4.4]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.1); for (let i = 0; i <= n; i++) add(f, box(0.1, 0.8, 0.1, MX.wood), -len / 2 + (i / n) * len, 0.4, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.62, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.34, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  const hs = horse(); add(g, hs, 5.6, 0, 1.0); hs.rotation.y = 0.4;
  const charro = mexican("#2a2a2e", { hat: true }); charro.userData.sit?.(); add(hs, charro, 0, 1.3, 0); charro.rotation.y = Math.PI / 2; charro.scale.setScalar(0.9);
  // the asador: a fire ring with a cast-iron pot of chili, and a rack of flour tortillas
  add(g, cyl(0.7, 0.7, 0.25, "#8f857a", 12), 5.4, 0.12, -1.8); add(g, cyl(0.45, 0.45, 0.06, "#f08a2a", 10), 5.4, 0.27, -1.8);
  add(g, cyl(0.4, 0.34, 0.4, "#2a2a2e", 12), 5.4, 0.55, -1.8); add(g, cyl(0.36, 0.36, 0.05, "#8e2a22", 12), 5.4, 0.75, -1.8);
  add(g, cyl(0.03, 0.03, 0.6, MX.wood, 4), 5.6, 1.0, -1.8).rotation.z = 0.5;
  const cook = mexican("#c0392b", { hat: true, apron: true }); add(g, cook, 6.6, 0, -1.4); cook.rotation.y = -1.8;
  g.userData.smoke = new THREE.Vector3(5.4, 1.0, -1.8);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cows[1], "¡Muuu! Moo!", 1.6, 1200); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); cows.forEach((c, i) => { c.position.y = k * Math.abs(Math.sin(t * 10 + i)) * 0.1; }); hs.position.y = Math.abs(Math.sin(t * 1.2)) * 0.02; if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; tickChildren(g)(t, dt); };
  return g;
}

/** Carnitas: pigs in a pen beside the great copper cazo where pork confits in its own fat. */
export function carnitasStand(): P {
  const g = group();
  const pigs: P[] = [];
  for (let i = 0; i < 3; i++) {
    const p = group();
    add(p, box(1.0, 0.55, 0.6, C.pinkPig), 0, 0.45, 0); const head = add(p, box(0.45, 0.45, 0.45, C.pinkPig), 0.65, 0.45, 0); add(head, box(0.14, 0.2, 0.26, "#d98b83"), 0.28, -0.05, 0); for (const z of [-0.16, 0.16]) add(head, box(0.1, 0.18, 0.1, "#d98b83"), 0, 0.28, z);
    for (const x of [-0.32, 0.32]) for (const z of [-0.18, 0.18]) add(p, box(0.15, 0.28, 0.15, C.pinkPig), x, 0.14, z);
    p.position.set(-3.2 + i * 1.1, 0, (i % 2) * 0.9 - 0.4); p.rotation.y = i * 1.3 + 0.5; g.add(p); pigs.push(p);
    (p.userData as { head?: THREE.Mesh }).head = head;
  }
  for (const [x, z, rot, len] of [[-2.6, -1.4, 0, 4.2], [-2.6, 1.4, 0, 4.2], [-4.7, 0, Math.PI / 2, 2.8], [-0.5, 0, Math.PI / 2, 2.8]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.0); for (let i = 0; i <= n; i++) add(f, box(0.1, 0.7, 0.1, MX.wood), -len / 2 + (i / n) * len, 0.35, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.55, 0); add(f, box(len, 0.06, 0.05, "#a37a4f"), 0, 0.3, 0); f.position.set(x, 0, z); f.rotation.y = rot; g.add(f); }
  // the copper cazo on a brick hearth, with the stand and its awning
  add(g, box(1.6, 0.6, 1.6, "#a45a3a"), 1.6, 0.3, 0);
  add(g, cyl(0.75, 0.5, 0.55, MX.copper, 14), 1.6, 0.85, 0); add(g, cyl(0.7, 0.7, 0.05, "#d9a441", 14), 1.6, 1.1, 0);
  const chunks: THREE.Mesh[] = []; for (let i = 0; i < 6; i++) { const c = add(g, box(0.22, 0.14, 0.18, i % 2 ? "#a6603a" : "#c47a4a"), 1.6 + Math.cos(i * 1.05) * 0.4, 1.15, Math.sin(i * 1.05) * 0.4); c.rotation.y = i; chunks.push(c); }
  const paddle = add(g, cyl(0.03, 0.03, 1.2, MX.wood, 5), 2.0, 1.5, 0.3); paddle.rotation.z = 0.5; paddle.rotation.x = 0.3;
  add(g, box(2.4, 0.8, 0.9, MX.wood), 3.6, 0.4, 0.2); for (let i = 0; i < 4; i++) add(g, cyl(0.15, 0.15, 0.02, "#f2dca0", 10), 2.8 + i * 0.45, 0.82, 0.2);
  add(g, box(0.3, 0.2, 0.25, "#a6603a"), 4.2, 0.9, 0.0); add(g, cyl(0.1, 0.08, 0.14, "#3f7a3a", 8), 4.5, 0.88, 0.4); add(g, ball(0.09, "#e0a52c", 6), 3.0, 0.9, -0.15);   // chopped pork, salsa verde, an orange
  for (const x of [2.6, 4.6]) add(g, cyl(0.04, 0.04, 2.3, MX.wood, 5), x, 1.15, -0.3); add(g, box(2.8, 0.06, 1.6, MX.yellow), 3.6, 2.3, 0.1).rotation.x = 0.15;
  const cook = mexican("#f4f1ea", { apron: true, hat: true }); add(g, cook, 2.4, 0, 1.0); cook.rotation.y = 2.6;
  g.userData.steam = new THREE.Vector3(1.6, 1.4, 0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Carnitas! Surtidas!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); paddle.rotation.y = t * (0.4 + k * 5); chunks.forEach((c, i) => { c.position.y = 1.15 + k * Math.max(0, Math.sin(t * 10 + i * 1.3)) * 0.14; }); pigs.forEach((p, i) => { p.position.y = k * Math.abs(Math.sin(t * 12 + i)) * 0.08; const h = (p.userData as { head?: THREE.Mesh }).head; if (h) h.position.y = 0.45 + Math.abs(Math.sin(t * 2 + i)) * 0.05; }); if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + k * Math.sin(t * 6) * 0.15; };
  return g;
}

/** Cacao trees with pods growing straight from the trunk, and a woman frothing chocolate with a molinillo. */
export function cacaoGrove(): P {
  const g = group();
  const pods: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const x = -2.4 + i * 1.2, z = (i % 2) * 1.4 - 0.7;
    add(g, cyl(0.1, 0.13, 1.6, "#6b4a2c", 6), x, 0.8, z);
    add(g, ball(0.75, "#3f7a3a", 8), x, 1.9, z).scale.y = 0.8;
    for (let k = 0; k < 4; k++) { const pd = add(g, ball(0.1, k % 2 ? "#e0a52c" : "#b0413e", 6), x + Math.cos(k * 1.6) * 0.16, 0.5 + k * 0.28, z + Math.sin(k * 1.6) * 0.16); pd.scale.y = 1.8; pods.push(pd); }
  }
  add(g, box(1.2, 0.7, 0.7, MX.wood), 3.0, 0.35, 0.6); add(g, cyl(0.2, 0.16, 0.3, MX.terracotta, 10), 3.0, 0.85, 0.6); add(g, cyl(0.18, 0.18, 0.04, "#5a3a28", 10), 3.0, 1.0, 0.6);
  const molinillo = add(g, cyl(0.02, 0.02, 0.6, MX.wood, 5), 3.0, 1.3, 0.6);
  add(g, box(0.5, 0.12, 0.3, "#3a3a3d"), 2.5, 0.76, 0.5); for (let k = 0; k < 5; k++) add(g, ball(0.04, "#5a3a28", 5), 2.4 + k * 0.06, 0.85, 0.45 + (k % 2) * 0.08);   // beans on the metate
  const cook = mexican("#f4f1ea", { rebozo: "#e8558a" }); add(g, cook, 3.0, 0, 1.5); cook.rotation.y = Math.PI;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Chocolate! ", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); molinillo.rotation.y = t * (1 + k * 20); pods.forEach((p, i) => { p.rotation.z = k * Math.sin(t * 12 + i) * 0.2; }); if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 20) * 0.08; };
  return g;
}

/** The pib: a pit in the ground where banana-leaf parcels of cochinita cook over hot stones. */
export function pibOven(): P {
  const g = group();
  add(g, cyl(1.2, 1.0, 0.5, "#7a5a3a", 12), 0, 0.25, 0); add(g, cyl(0.9, 0.9, 0.08, "#3a3a3d", 12), 0, 0.5, 0);
  for (let i = 0; i < 6; i++) add(g, ball(0.16, "#f08a2a", 6), Math.cos(i * 1.05) * 0.5, 0.56, Math.sin(i * 1.05) * 0.5);
  const parcel = add(g, box(0.9, 0.3, 0.6, "#4f9a4a"), 0, 0.8, 0); add(parcel, box(0.95, 0.04, 0.1, "#8a6a3a"), 0, 0.12, 0); add(parcel, box(0.1, 0.04, 0.65, "#8a6a3a"), 0, 0.12, 0);
  for (let i = 0; i < 5; i++) add(g, ball(0.12, "#e0a52c", 6), -1.9 + i * 0.3, 0.1, 1.4);   // sour oranges
  add(g, cyl(0.16, 0.12, 0.24, "#b0413e", 8), 1.4, 0.12, 1.3); add(g, cyl(0.2, 0.16, 0.2, "#e8558a", 8), 1.9, 0.1, 1.2);   // achiote paste, pickled red onion
  for (let i = 0; i < 4; i++) { const lf = add(g, box(1.2, 0.02, 0.35, "#4f9a4a"), -1.8 + i * 0.1, 0.03 + i * 0.03, -1.2); lf.rotation.y = i * 0.3; }
  const cook = mexican("#f4f1ea", { hat: true, apron: true }); add(g, cook, 1.6, 0, -0.8); cook.rotation.y = -2.4;
  g.userData.smoke = new THREE.Vector3(0, 1.2, 0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "¡Cochinita! ", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); parcel.position.y = 0.8 + k * Math.abs(Math.sin(t * 8)) * 0.3; parcel.rotation.y = k * Math.sin(t * 4) * 0.4; if (cook.userData.upper) cook.userData.upper.rotation.x = 0.2 + k * Math.abs(Math.sin(t * 8)) * 0.3; };
  return g;
}

/** A cenote: a round sinkhole of turquoise water in the limestone, with a wooden ladder and swimmers. */
export function cenote(): P {
  const g = group();
  const waterMat = freshWater();
  add(g, new THREE.Mesh(new THREE.RingGeometry(3.0, 4.2, 24), mat("#c9c2b0")), 0, 0.04, 0).rotation.x = -Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.RingGeometry(2.6, 3.1, 24), mat("#8f857a")), 0, 0.05, 0).rotation.x = -Math.PI / 2;
  const w = new THREE.Mesh(new THREE.CircleGeometry(2.9, 24), waterMat); w.rotation.x = -Math.PI / 2; w.position.y = 0.06; w.renderOrder = 2; g.add(w);
  for (let i = 0; i < 6; i++) add(g, cyl(0.03, 0.03, 0.5, "#a37a4f", 4), 2.8, 0.2, -1.0 + i * 0.4).rotation.z = Math.PI / 2; for (const z of [-1.2, 1.2]) add(g, cyl(0.04, 0.04, 1.6, "#a37a4f", 4), 2.8, 0.2, z).rotation.z = Math.PI / 2;   // the ladder
  const swimmers: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) { const s = new THREE.Group(); add(s, ball(0.13, C.skin, 7), 0, 0.12, 0); add(s, ball(0.1, "#2a2a2e", 6), 0, 0.2, 0); s.position.set(Math.cos(i * 2.1) * 1.4, 0, Math.sin(i * 2.1) * 1.4); g.add(s); swimmers.push(s); }
  for (let i = 0; i < 5; i++) { const v = add(g, cyl(0.02, 0.02, 1.4 + (i % 2) * 0.6, "#4f9a4a", 4), Math.cos(i * 1.3) * 3.6, 0.7, Math.sin(i * 1.3) * 3.6); v.rotation.z = (i % 2 - 0.5) * 0.4; }   // hanging roots and vines
  add(g, tree("round", 1.1), -3.8, 0, -2.4); add(g, tree("round", 0.9), 3.4, 0, 3.0);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "¡Al agua! Splash!", 1.4, 1300); };
  g.userData.tick = (t, dt) => { waterMat.uniforms.uTime.value = t; const k = re.step(dt); swimmers.forEach((s, i) => { const a = t * 0.3 + i * 2.1; s.position.set(Math.cos(a) * 1.4, Math.sin(t * 2 + i) * 0.04 - k * Math.max(0, Math.sin(k * Math.PI)) * 0.3, Math.sin(a) * 1.4); s.rotation.y = -a; }); };
  return g;
}

export function flamingo(): P {
  const g = group();
  add(g, ball(0.2, "#f27a9a", 8), 0, 0.85, 0).scale.set(1.4, 0.8, 1);
  const neck = add(g, cyl(0.04, 0.05, 0.7, "#f27a9a", 6), 0.25, 1.25, 0); neck.rotation.z = -0.4;
  add(g, ball(0.09, "#f27a9a", 6), 0.42, 1.6, 0); add(g, cone(0.04, 0.16, "#2a2a2e", 5), 0.52, 1.55, 0).rotation.z = -1.4;
  add(g, cyl(0.02, 0.02, 0.85, "#e07a3a", 4), 0, 0.42, 0.06); add(g, cyl(0.02, 0.02, 0.5, "#e07a3a", 4), 0.05, 0.6, -0.06).rotation.x = 0.5;
  return g;
}


/** Tomatoes and tomatillos in their papery husks, staked in rows, with a picker. */
export function tomatoPatch(): P {
  const g = group();
  add(g, box(6, 0.2, 4, "#7a5a3a"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) {
    const x = -2.6 + j * 0.75, z = -1.4 + i * 0.95;
    const pl = new THREE.Group(); pl.position.set(x, 0.2, z); g.add(pl); plants.push(pl);
    add(pl, cyl(0.02, 0.02, 0.9, "#a37a4f", 4), 0, 0.45, 0);
    add(pl, ball(0.22, "#4f9a4a", 6), 0, 0.5, 0).scale.set(1, 1.3, 1);
    if (i < 2) for (let k = 0; k < 3; k++) add(pl, ball(0.07, k ? "#c9302a" : "#e07a3a", 6), Math.cos(k * 2.1) * 0.15, 0.3 + k * 0.2, Math.sin(k * 2.1) * 0.15);
    else for (let k = 0; k < 3; k++) { add(pl, ball(0.06, "#7fbf3a", 6), Math.cos(k * 2.1) * 0.15, 0.3 + k * 0.2, Math.sin(k * 2.1) * 0.15); add(pl, cone(0.08, 0.14, "#c9d6a0", 5), Math.cos(k * 2.1) * 0.15, 0.36 + k * 0.2, Math.sin(k * 2.1) * 0.15); }   // tomatillos in their husks
  }
  const picker = mexican("#e8558a", { rebozo: "#3f6fb5" }); add(g, picker, 3.4, 0, 0.4); picker.rotation.y = -1.4;
  const crate = add(g, box(0.6, 0.3, 0.45, "#a37a4f"), 3.8, 0.15, 1.2); for (let k = 0; k < 6; k++) add(crate, ball(0.08, k % 2 ? "#c9302a" : "#7fbf3a", 6), (rnd() - 0.5) * 0.45, 0.18, (rnd() - 0.5) * 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(picker, "¡Jitomates! Tomatoes!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.6) * 1.2)) * 0.5; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); if (picker.userData.upper) picker.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** Xochimilco: two canals between chinampas, trajineras poled along them, flowers on the banks. */
export function xochimilco(): P {
  const g = group();
  const waterMat = freshWater();
  // the boats circle the chinampa: along the south canal, up the east channel, back along the north canal and down the west one
  const loop = new THREE.CatmullRomCurve3([new THREE.Vector3(-5.5, 0, 2), new THREE.Vector3(0, 0, 2.1), new THREE.Vector3(5.5, 0, 2), new THREE.Vector3(7.2, 0, 0), new THREE.Vector3(5.5, 0, -2), new THREE.Vector3(0, 0, -2.1), new THREE.Vector3(-5.5, 0, -2), new THREE.Vector3(-7.2, 0, 0)], true);
  const strip = (w: number, d: number, x: number, z: number, m: THREE.Material, y: number) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); s.rotation.x = -Math.PI / 2; s.position.set(x, y, z); s.receiveShadow = true; g.add(s); return s; };
  const bank = mat("#c9b98a");
  for (const z of [-2, 2]) { strip(15.4, 3.4, 0, z, bank, 0.03); strip(15, 2.4, 0, z, waterMat, 0.06).renderOrder = 2; }
  for (const x of [-7.2, 7.2]) { strip(3.4, 7.4, x, 0, bank, 0.03); strip(2.4, 6.4, x, 0, waterMat, 0.06).renderOrder = 2; }
  // the chinampa between the canals: flowers and vegetables
  add(g, box(12, 0.3, 1.6, "#5f8f4f"), 0, 0.15, 0);
  for (let i = 0; i < 12; i++) { add(g, cyl(0.02, 0.02, 0.35, "#3f7a3a", 4), -5.5 + i * 1.0, 0.45, (i % 2) * 0.6 - 0.3); add(g, ball(0.1, MX.papel[i % 6], 6), -5.5 + i * 1.0, 0.65, (i % 2) * 0.6 - 0.3); }
  for (let i = 0; i < 3; i++) add(g, tree("willow", 0.8), -4 + i * 4, 0.3, 0.2);
  const boats = [trajinera(MX.pink), trajinera(MX.yellow), trajinera(MX.blue)];
  boats.forEach((b) => g.add(b));
  const mariachiBoat = boats[1]; add(mariachiBoat, cone(0.07, 0.3, "#e0a52c", 6), 0.3, 1.2, 0.5).rotation.x = -Math.PI / 2;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(boats[0], "¡Viva Xochimilco!", 2.2, 1500); };
  g.userData.tick = (t, dt) => {
    waterMat.uniforms.uTime.value = t;
    const k = re.step(dt);
    boats.forEach((b, i) => { const u = (t * 0.012 + i / 3) % 1; const p = loop.getPointAt(u), n = loop.getPointAt((u + 0.006) % 1); b.position.set(p.x, 0.06 + k * Math.abs(Math.sin(t * 6 + i)) * 0.25, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; b.userData.tick?.(t, dt); });
  };
  return g;
}

export const MEXICO_PROPS: Record<string, () => P> = {
  milpa, tortilleria, chilliRacks, moleKitchen, agaveField, avocadoOrchard, rancho, carnitasStand, cacaoGrove, pibOven, mercado, taqueria, fonda, molcajeteStand, churrosCart, mariachi, tomatoPatch, xochimilco, cenote, none: () => group(),
};

export const MEXICO_ICONS: Record<string, () => P> = {
  corn: () => { const g = group(); for (let i = 0; i < 3; i++) { const c = add(g, cyl(0.1, 0.1, 0.6, "#f2cf3a", 8), -0.3 + i * 0.3, 0.12, (i - 1) * 0.15); c.rotation.z = Math.PI / 2; c.rotation.y = i * 0.3; add(g, box(0.5, 0.02, 0.16, "#7fbf3a"), -0.3 + i * 0.3, 0.02, (i - 1) * 0.15 + 0.1).rotation.y = i * 0.3; } return g; },
  chilliesMx: () => { const g = group(); for (let i = 0; i < 4; i++) { const c = add(g, cone(0.07, 0.42, i % 2 ? "#8e2a22" : "#c9302a", 6), -0.4 + i * 0.27, 0.2, (i % 2) * 0.15); c.rotation.z = Math.PI / 2 + (i - 1.5) * 0.25; } add(g, cone(0.09, 0.3, "#3f7a3a", 6), 0.55, 0.12, -0.2).rotation.z = 1.2; return g; },
  tomatoMx: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.18, "#c9302a", 10), -0.3 + i * 0.3, 0.18, (i - 1) * 0.1).scale.y = 0.9; add(g, ball(0.14, "#7fbf3a", 8), 0.45, 0.14, 0.3); add(g, cone(0.15, 0.1, "#c9d6a0", 6), 0.45, 0.32, 0.3); return g; },
  avocado: () => { const g = group(); add(g, ball(0.28, "#2f4f2a", 9), -0.3, 0.3, 0).scale.y = 1.3; const h = add(g, ball(0.26, "#8fc26a", 9), 0.35, 0.28, 0); h.scale.set(0.5, 1.3, 1); add(g, ball(0.11, "#8a5a3c", 7), 0.42, 0.28, 0); return g; },
  limes: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.13, "#7fbf3a", 8), -0.3 + i * 0.28, 0.13, (i - 1) * 0.1); add(g, ball(0.16, "#3f7a3a", 6), 0.45, 0.16, 0.2).scale.set(1.3, 0.8, 1); add(g, ball(0.14, "#f3e9d2", 8), 0.5, 0.14, -0.3); return g; },
  cacao: () => { const g = group(); for (let i = 0; i < 2; i++) add(g, ball(0.15, i ? "#e0a52c" : "#b0413e", 7), -0.25 + i * 0.5, 0.2, 0).scale.y = 1.8; add(g, cyl(0.12, 0.1, 0.2, MX.terracotta, 8), 0.1, 0.1, 0.4); add(g, cyl(0.11, 0.11, 0.03, "#5a3a28", 8), 0.1, 0.2, 0.4); return g; },
  beefMx: () => cow(false, false),
  carnitas: () => { const g = group(); add(g, cyl(0.42, 0.28, 0.32, MX.copper, 14), 0, 0.16, 0); add(g, cyl(0.38, 0.38, 0.04, "#d9a441", 14), 0, 0.32, 0); for (let i = 0; i < 5; i++) add(g, box(0.18, 0.12, 0.14, i % 2 ? "#a6603a" : "#c47a4a"), Math.cos(i * 1.25) * 0.2, 0.38, Math.sin(i * 1.25) * 0.2).rotation.y = i; return g; },
  comal: () => { const g = group(); add(g, cyl(0.45, 0.45, 0.05, "#3a3a3d", 16), 0, 0.03, 0); for (let i = 0; i < 3; i++) add(g, cyl(0.16, 0.16, 0.02, "#f2dca0", 10), Math.cos(i * 2.1) * 0.24, 0.07, Math.sin(i * 2.1) * 0.24); return g; },
  molcajete: () => { const g = group(); add(g, cyl(0.42, 0.3, 0.32, "#3a3a3d", 12), 0, 0.16, 0); add(g, cyl(0.34, 0.34, 0.05, "#8fc26a", 12), 0, 0.32, 0); add(g, cyl(0.07, 0.1, 0.4, "#3a3a3d", 8), 0.15, 0.5, 0).rotation.z = 0.5; add(g, ball(0.08, "#c9302a", 6), -0.15, 0.36, 0.1); return g; },
  trompo: () => { const g = group(); for (let i = 0; i < 6; i++) add(g, cyl(0.2 + i * 0.03, 0.2 + i * 0.03, 0.09, i % 2 ? "#b0413e" : "#c9573a", 10), 0, 0.05 + i * 0.09, 0); add(g, cyl(0.16, 0.16, 0.2, "#f2c14e", 8), 0, 0.7, 0); add(g, cone(0.06, 0.2, "#3f7a3a", 5), 0, 0.9, 0); add(g, cyl(0.02, 0.02, 1.1, "#8c9096", 5), 0, 0.5, 0); return g; },
  fonda: () => { const g = group(); add(g, cyl(0.3, 0.24, 0.24, MX.terracotta, 12), 0, 0.12, 0); add(g, cyl(0.26, 0.26, 0.05, "#c9573a", 12), 0, 0.26, 0); add(g, cyl(0.03, 0.03, 0.5, MX.wood, 4), 0.2, 0.45, 0).rotation.z = 0.5; add(g, cyl(0.12, 0.1, 0.3, "#e8558a", 8), 0.5, 0.15, 0.2); return g; },
  churros: () => { const g = group(); for (let i = 0; i < 3; i++) add(g, cyl(0.045, 0.045, 0.7, "#d9a441", 6), -0.15 + i * 0.15, 0.3, (i % 2) * 0.1).rotation.z = 0.15; add(g, cyl(0.2, 0.15, 0.25, "#f3e9d2", 8), 0, 0.12, 0); add(g, cyl(0.1, 0.09, 0.12, "#5a3a28", 8), 0.45, 0.06, 0.1); return g; },
  tequila: () => { const g = group(); add(g, cyl(0.1, 0.12, 0.5, "#8fc4c9", 8), -0.2, 0.25, 0); add(g, cyl(0.04, 0.04, 0.15, "#8fc4c9", 6), -0.2, 0.57, 0); add(g, cyl(0.06, 0.05, 0.14, "#dfe3e6", 8), 0.15, 0.07, 0.15); for (let l = 0; l < 6; l++) { const leaf = add(g, cone(0.05, 0.4, MX.agave, 4), 0.45, 0.2, -0.1); leaf.geometry.translate(0, 0.2, 0); leaf.position.y = 0; leaf.rotation.y = l; leaf.rotation.x = 0.8; } return g; },
  mole: () => { const g = group(); add(g, cyl(0.36, 0.3, 0.26, MX.terracotta, 12), 0, 0.13, 0); add(g, cyl(0.32, 0.32, 0.04, "#3a2418", 12), 0, 0.28, 0); add(g, ball(0.05, "#e9d28a", 5), 0.1, 0.32, 0.05); add(g, cone(0.05, 0.3, "#8e2a22", 5), -0.5, 0.1, 0.1).rotation.z = Math.PI / 2; return g; },
  pib: () => { const g = group(); add(g, box(0.7, 0.24, 0.5, "#4f9a4a"), 0, 0.12, 0); add(g, box(0.75, 0.04, 0.08, "#8a6a3a"), 0, 0.22, 0); add(g, cyl(0.12, 0.1, 0.16, "#e8558a", 8), 0.5, 0.08, 0.2); return g; },
  mariachi: () => { const g = group(); add(g, box(0.6, 0.36, 0.14, "#a37a4f"), 0, 0.3, 0); add(g, cyl(0.03, 0.03, 0.5, "#4a3222", 5), 0.45, 0.45, 0).rotation.z = -1.2; add(g, sombrero(), -0.4, 0.06, 0.2); return g; },
  xochimilco: () => trajinera(),
  cenoteIcon: () => { const g = group(); add(g, new THREE.Mesh(new THREE.RingGeometry(0.3, 0.45, 20), mat("#c9c2b0")), 0, 0.02, 0).rotation.x = -Math.PI / 2; add(g, new THREE.Mesh(new THREE.CircleGeometry(0.31, 20), mat("#5fb8c8")), 0, 0.03, 0).rotation.x = -Math.PI / 2; return g; },
};
