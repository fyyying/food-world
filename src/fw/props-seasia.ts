/** Southeast Asian props: a Thai wat, the floating market, tuk-tuks and monks, Hanoi's tube houses and Turtle Tower, pho and banh mi, stilt houses, buffalo paddies, karsts and longtail boats. Text is Thai / Vietnamese + English. */
import * as THREE from "three";
import { mat, add, rnd, C, person, cow, chicken, bubble, wear, tree, type P } from "./props";
import { datePalm } from "./props-mideast";
import { bananaTree } from "./props-india";
import { freshWater } from "./worldkit";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick) (c as P).userData.tick!(t, dt); });
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate * 0.7); return k; } }; }
type Fig = P & { userData: { upper?: THREE.Group; walk?: (t: number) => void; sit?: () => void } };

export const SE = { gold: "#e0b34c", saffron: "#f08a2a", red: "#c0392b", green: "#3f8f5a", teak: "#7a4a2a", white: "#f4f1ea", yellow: "#e9c46a", ochre: "#d9a86c", karst: "#8f9a8a", karstDark: "#6f7a6a", jade: "#2a8f8f", blue: "#2f6fb5", pink: "#e8558a" };

/** Someone in a conical nón lá, a Thai farmer's hat, a monk's robe or a sarong. */
export function local(shirt: string, opts: { nonLa?: boolean; monk?: boolean; apron?: boolean; sarong?: string; scarf?: string } = {}): Fig {
  const p = person(opts.monk ? SE.saffron : shirt, { apron: opts.apron }) as Fig;
  if (opts.nonLa) wear(p, cone(0.38, 0.3, "#e9d7a8", 12), 0, 1.3, 0);
  if (opts.monk) { wear(p, box(0.42, 0.45, 0.32, SE.saffron), 0, 0.8, 0); wear(p, box(0.16, 0.5, 0.2, SE.saffron), -0.14, 1.05, -0.06).rotation.z = -0.3; }
  if (opts.sarong) wear(p, box(0.36, 0.42, 0.28, opts.sarong), 0, 0.42, 0);
  if (opts.scarf) wear(p, box(0.36, 0.12, 0.2, opts.scarf), 0, 1.02, -0.1);
  return p;
}

// ---------- landmarks ----------

/** A Thai wat: a tiered red-and-gold roof with chofa finials, a golden chedi, naga stairs. */
export function wat(): P {
  const g = group();
  add(g, box(9, 0.5, 7, "#c9bda3"), 0, 0.25, 0);
  add(g, box(5, 3.2, 4, SE.white), -1.5, 2.1, 0);
  for (let i = 0; i < 4; i++) add(g, cyl(0.16, 0.18, 3.2, SE.gold, 8), -4.2 + i * 1.8, 2.1, 2.2);
  for (let i = 0; i < 3; i++) { const w = 6.2 - i * 1.2, d = 5 - i * 1.0; for (const sd of [-1, 1]) { const r = add(g, box(w, 0.1, d / 2 + 0.3, i % 2 ? SE.red : SE.saffron), -1.5, 3.9 + i * 0.9, sd * d / 4); r.rotation.x = -sd * 0.55; } add(g, box(w + 0.2, 0.08, 0.2, SE.gold), -1.5, 4.7 + i * 0.9, 0); for (const sd of [-1, 1]) add(g, cone(0.08, 0.5, SE.gold, 4), -1.5 + sd * (w / 2 + 0.05), 4.95 + i * 0.9, 0); }
  for (let k = 0; k < 6; k++) add(g, box(0.4, 0.4, 0.2, "#c9a86a"), -3.6 + k * 0.8, 1.6, 2.0);
  for (let k = 0; k < 6; k++) add(g, box(1.6, 0.2, 0.4, "#d9c9a8"), -1.5, 0.6 + k * 0.2, 3.5 - k * 0.3); for (const sd of [-1, 1]) { add(g, cyl(0.12, 0.12, 2.2, SE.green, 6), -1.5 + sd * 0.95, 0.9, 3.1).rotation.x = -0.6; add(g, ball(0.2, SE.green, 6), -1.5 + sd * 0.95, 1.9, 2.1); }   // the naga balustrade
  add(g, cyl(1.4, 1.6, 0.6, SE.white, 12), 2.8, 0.8, -0.5); add(g, cyl(1.1, 1.3, 0.5, SE.gold, 12), 2.8, 1.35, -0.5); add(g, ball(1.1, SE.gold, 12), 2.8, 2.4, -0.5).scale.y = 1.2; add(g, cone(0.5, 2.6, SE.gold, 10), 2.8, 4.6, -0.5); for (let k = 0; k < 4; k++) add(g, cyl(0.42 - k * 0.08, 0.5 - k * 0.08, 0.2, SE.gold, 10), 2.8, 3.7 + k * 0.25, -0.5);   // the chedi
  add(g, cyl(0.3, 0.3, 0.5, SE.gold, 10), -1.5, 0.75, -1.5); add(g, ball(0.32, SE.gold, 8), -1.5, 1.25, -1.5); add(g, cone(0.14, 0.4, SE.gold, 6), -1.5, 1.7, -1.5);   // the Buddha's spire seen through the door
  for (let k = 0; k < 3; k++) { add(g, cyl(0.02, 0.02, 0.3, "#8a6a3a", 3), -3.2 + k * 0.5, 0.65, 3.3); add(g, ball(0.06, "#e8558a", 5), -3.2 + k * 0.5, 0.82, 3.3); }
  const monk = local("", { monk: true }); add(g, monk, 1.2, 0.5, 2.6); monk.rotation.y = Math.PI;
  g.userData.smoke = new THREE.Vector3(-3.0, 1.0, 3.3);
  const bells: THREE.Mesh[] = []; for (let k = 0; k < 4; k++) bells.push(add(g, cone(0.06, 0.12, SE.gold, 6), -4.5 + k * 2.0, 4.6 + (k % 2) * 0.9, 2.6 + (k % 2) * -0.5));
  g.userData.tick = (t) => bells.forEach((b, i) => { b.rotation.z = Math.sin(t * 2 + i) * 0.2; });
  return g;
}

/** Hanoi's Turtle Tower on its island in Hoan Kiem lake, with the red bridge. */
export function hoanKiem(): P {
  const g = group();
  const waterMat = freshWater();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(4.4, 24), mat("#c9bda3")), 0, 0.03, 0).rotation.x = -Math.PI / 2;
  const w = new THREE.Mesh(new THREE.CircleGeometry(3.9, 24), waterMat); w.rotation.x = -Math.PI / 2; w.position.y = 0.06; w.renderOrder = 2; g.add(w);
  add(g, cyl(0.9, 1.1, 0.4, "#a89f8c", 10), 0, 0.2, 0);
  for (let i = 0; i < 3; i++) { add(g, box(1.2 - i * 0.25, 0.8, 1.2 - i * 0.25, "#b8a888"), 0, 0.8 + i * 0.85, 0); add(g, box(1.4 - i * 0.25, 0.12, 1.4 - i * 0.25, "#8a7a5a"), 0, 1.25 + i * 0.85, 0); for (let k = 0; k < 2; k++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8, 1, false, 0, Math.PI), mat("#3a2a1a")), -0.25 + k * 0.5, 0.85 + i * 0.85, (1.2 - i * 0.25) / 2 + 0.02).rotation.set(Math.PI / 2, 0, Math.PI / 2); }
  add(g, cone(0.5, 0.5, "#8a7a5a", 4), 0, 3.4, 0).rotation.y = Math.PI / 4; add(g, ball(0.14, "#c0392b", 5), 0, 3.75, 0);
  add(g, box(0.9, 0.08, 3.8, "#c0392b"), 2.6, 0.5, 1.6).rotation.y = -0.5; for (let k = 0; k < 6; k++) { add(g, box(0.05, 0.4, 0.05, "#c0392b"), 2.6 + Math.sin(-0.5) * (-1.6 + k * 0.7) * -1 + 0.4, 0.75, 1.6 + Math.cos(-0.5) * (-1.6 + k * 0.7)); }   // the red Huc bridge
  for (let k = 0; k < 4; k++) add(g, cyl(0.04, 0.04, 0.5, "#8a6a3a", 4), 2.6, 0.25, 1.6 - 1.2 + k * 0.8);
  add(g, tree("willow", 1.2), -4.2, 0, 2.6); add(g, tree("willow", 1.0), 3.8, 0, -2.4);
  const turtle = new THREE.Group(); g.add(turtle); add(turtle, ball(0.22, "#3f5a3a", 8), 0, 0.08, 0).scale.set(1.3, 0.5, 1); add(turtle, ball(0.08, "#4f6a4a", 5), 0.3, 0.08, 0);
  g.userData.tick = (t) => { waterMat.uniforms.uTime.value = t; const a = t * 0.15; turtle.position.set(Math.cos(a) * 2.6, 0.06, Math.sin(a) * 2.6); turtle.rotation.y = -a + Math.PI / 2; };
  return g;
}

/** A Hanoi tube house: tall, narrow, yellow ochre, with a balcony and a shop below. */
export function tubeHouse(color = SE.yellow, storeys = 3): P {
  const g = group();
  const H = storeys * 1.9;
  add(g, box(2.2, H, 3.4, color), 0, H / 2, 0);
  add(g, box(2.3, 0.15, 3.5, "#8a6a3a"), 0, H + 0.07, 0);
  add(g, box(2.2, 1.5, 0.06, "#4a3a2a"), 0, 0.75, 1.72); add(g, box(2.2, 0.06, 0.8, SE.green), 0, 1.6, 2.1);   // shop and awning
  for (let s = 1; s < storeys; s++) { add(g, box(1.0, 0.9, 0.06, "#6fb3c9"), 0, s * 1.9 + 0.95, 1.72); add(g, box(1.6, 0.06, 0.5, "#8a6a3a"), 0, s * 1.9 + 0.35, 1.95); for (let k = 0; k < 5; k++) add(g, box(0.02, 0.5, 0.02, "#2a2a2e"), -0.7 + k * 0.35, s * 1.9 + 0.6, 2.18); if (s % 2) { add(g, cyl(0.08, 0.06, 0.14, "#a45a3a", 6), 0.5, s * 1.9 + 0.45, 2.0); add(g, ball(0.1, "#c0392b", 6), 0.5, s * 1.9 + 0.6, 2.0); } }
  add(g, box(0.5, 0.35, 0.02, "#c0392b"), 0, H - 0.4, 1.74); add(g, ball(0.06, SE.gold, 5), 0, H - 0.4, 1.76);   // the flag with its star
  return g;
}

/** A stilt house over the water with a thatched roof and a ladder. */
export function stiltHouse(): P {
  const g = group();
  for (const x of [-1.2, 1.2]) for (const z of [-0.9, 0.9]) add(g, cyl(0.07, 0.08, 1.6, SE.teak, 5), x, 0.8, z);
  add(g, box(3.0, 0.12, 2.4, "#a37a4f"), 0, 1.6, 0);
  add(g, box(2.4, 1.4, 1.8, "#c9a86a"), -0.2, 2.35, -0.2);
  for (const sd of [-1, 1]) { const r = add(g, box(2.9, 0.1, 1.3, C.straw), -0.2, 3.35, -0.2 + sd * 0.55); r.rotation.x = -sd * 0.6; } add(g, box(3.0, 0.06, 0.16, "#8a6a3a"), -0.2, 3.7, -0.2);
  add(g, box(0.5, 0.9, 0.05, "#4a3a2a"), 0.4, 2.1, 0.72);
  for (let k = 0; k < 5; k++) add(g, box(0.5, 0.04, 0.04, SE.teak), 1.7, 0.2 + k * 0.32, 0.9 + k * 0.1); for (const x of [1.48, 1.92]) add(g, box(0.04, 1.7, 0.04, SE.teak), x, 0.85, 1.1).rotation.x = -0.3;
  const p = local("#f4f1ea", { nonLa: true }); p.userData.sit?.(); add(g, p, 1.0, 1.65, 0.6); p.rotation.y = 0.6; p.scale.setScalar(0.85);
  add(g, cyl(0.16, 0.14, 0.05, "#8fc4c9", 8), 0.6, 1.7, 0.9); for (let k = 0; k < 3; k++) add(g, ball(0.04, "#b3bfc9", 4), 0.6 + (k - 1) * 0.07, 1.74, 0.9).scale.set(1.6, 0.5, 1);
  add(g, box(1.0, 0.03, 0.4, "#c0392b"), -1.2, 1.68, 0.9);   // chillies drying on the deck
  return g;
}

/** A limestone karst: a tall pillar of grey rock with greenery on top and a cave at the waterline. */
export function karst(h = 7, r = 2.2): P {
  const g = group();
  const rock = add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r, h, 9), mat(SE.karst)), 0, h / 2, 0); rock.scale.set(1, 1, 0.8);
  add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(r * 0.7, 0), mat(SE.karstDark)), r * 0.5, h * 0.6, 0);
  add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(r * 0.5, 0), mat(SE.karst)), -r * 0.5, h * 0.85, r * 0.2);
  for (let i = 0; i < 4; i++) add(g, ball(r * 0.35, i % 2 ? "#4f8a4a" : "#3f7a3a", 6), Math.cos(i * 1.6) * r * 0.5, h + r * 0.15, Math.sin(i * 1.6) * r * 0.35);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.35, r * 0.5, 8, 1, false, 0, Math.PI), mat("#3a3a3d")), 0, 0.3, r * 0.7).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  return g;
}

/** A longtail boat with a long propeller shaft and coloured ribbons on the bow. */
export function longtail(color = SE.blue): P {
  const g = group();
  add(g, box(3.2, 0.4, 0.8, SE.teak), 0, 0.2, 0); add(g, box(3.2, 0.06, 0.86, color), 0, 0.42, 0);
  add(g, box(0.6, 0.6, 0.3, SE.teak), 1.5, 0.5, 0).rotation.z = 0.5;
  for (let k = 0; k < 3; k++) add(g, box(0.05, 0.5, 0.02, ["#e8558a", "#f2c14e", "#3f8f5a"][k]), 1.75 + k * 0.05, 0.9, (k - 1) * 0.06);
  add(g, cyl(0.03, 0.03, 2.2, "#8c9096", 5), -1.9, 0.55, 0).rotation.z = 0.35; add(g, box(0.4, 0.3, 0.3, "#5a5a5a"), -1.2, 0.6, 0);
  const driver = local("#f4f1ea", { nonLa: true }); driver.userData.sit?.(); add(g, driver, -0.9, 0.35, 0); driver.rotation.y = Math.PI / 2; driver.scale.setScalar(0.85);
  for (let i = 0; i < 2; i++) { const p = local(pick(["#e8558a", "#f2c14e", "#3f6fb5"])); p.userData.sit?.(); add(g, p, 0.2 + i * 0.7, 0.35, 0).rotation.y = Math.PI / 2; p.scale.setScalar(0.85); }
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 1.1) * 0.03; };
  return g;
}

export function tukTuk(color = SE.blue): P {
  const g = group();
  add(g, box(1.4, 0.5, 0.9, color), 0, 0.5, 0); add(g, box(1.4, 0.5, 0.92, "#f2c14e"), 0, 1.0, 0); add(g, box(0.6, 0.5, 0.94, "#6fb3c9"), 0.45, 1.0, 0); add(g, box(1.5, 0.06, 1.0, color), 0, 1.3, 0);
  add(g, cyl(0.22, 0.22, 0.14, "#2a2a2e", 8), 0.7, 0.22, 0).rotation.x = Math.PI / 2; for (const z of [-0.5, 0.5]) add(g, cyl(0.22, 0.22, 0.14, "#2a2a2e", 8), -0.45, 0.22, z).rotation.x = Math.PI / 2;
  add(g, ball(0.1, "#f4f1ea", 5), 0.75, 0.75, 0); for (let k = 0; k < 3; k++) add(g, box(0.1, 0.2, 0.02, ["#e8558a", "#f2c14e", "#3f8f5a"][k]), -0.75, 1.1, -0.2 + k * 0.2);
  const drv = local("#f4f1ea"); drv.userData.sit?.(); add(g, drv, 0.25, 0.45, 0).scale.setScalar(0.75);
  return g;
}

export function motorbike(color = SE.red): P {
  const g = group();
  for (const x of [-0.4, 0.4]) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 6, 12), mat("#2a2a2e")), x, 0.24, 0);
  add(g, box(0.8, 0.2, 0.25, color), 0, 0.45, 0); add(g, box(0.4, 0.1, 0.3, "#2a2a2e"), -0.1, 0.6, 0); add(g, box(0.05, 0.4, 0.05, "#8c9096"), 0.35, 0.65, 0); add(g, box(0.05, 0.05, 0.5, "#8c9096"), 0.35, 0.85, 0);
  const r = local(pick(["#f4f1ea", "#3f6fb5", "#e8558a", "#2a2a2e"]), { nonLa: rnd() > 0.6 }); r.userData.sit?.(); r.scale.setScalar(0.8); r.position.set(-0.05, 0.42, 0); r.rotation.y = Math.PI / 2; g.add(r);
  if (rnd() > 0.5) { for (let k = 0; k < 4; k++) add(g, box(0.16, 0.16, 0.16, ["#e8558a", "#f2c14e", "#6fb3c9", "#3f8f5a"][k]), -0.5 - (k % 2) * 0.15, 0.6 + Math.floor(k / 2) * 0.16, (k % 2 - 0.5) * 0.3); }   // a load strapped on the back
  return g;
}

// ---------- food places ----------

/** The floating market: boats moored along a wooden pier, each a stall: fruit and durian, noodles, herbs, coconuts, flowers. */
export function floatingMarket(): P {
  const g = group();
  add(g, box(12, 0.3, 1.6, "#a37a4f"), 0, 0.5, 2.4); for (let i = 0; i < 7; i++) add(g, cyl(0.08, 0.08, 0.8, SE.teak, 5), -5.4 + i * 1.8, 0.2, 2.4);
  for (let i = 0; i < 4; i++) { add(g, cyl(0.04, 0.04, 2.4, SE.teak, 5), -5 + i * 3.3, 1.7, 2.4); } add(g, box(12, 0.06, 1.8, "#c9302a"), 0, 2.9, 2.4).rotation.x = 0.1; for (let i = 0; i < 10; i++) add(g, cyl(0.12, 0.12, 0.25, ["#e8558a", "#f2c14e", "#6fb3c9"][i % 3], 8), -5.2 + i * 1.15, 2.6, 2.4);   // lanterns under the pier's awning
  const vendors: Fig[] = [];
  const boats: THREE.Group[] = [];
  const stall = (kind: string) => {
    const b = new THREE.Group(); boats.push(b);
    add(b, box(3.0, 0.4, 1.0, SE.teak), 0, 0.2, 0); add(b, box(3.0, 0.06, 1.06, "#a37a4f"), 0, 0.42, 0); add(b, box(0.4, 0.4, 0.3, SE.teak), 1.5, 0.4, 0).rotation.z = 0.5;
    const goods = new THREE.Group(); goods.position.y = 0.45; b.add(goods);
    switch (kind) {
      case "fruit": for (let i = 0; i < 3; i++) { const bk = add(goods, cyl(0.26, 0.2, 0.22, C.straw, 9), -0.9 + i * 0.7, 0.11, 0); for (let k = 0; k < 6; k++) add(bk, ball(0.08, ["#f2b64d", "#c0392b", "#7fbf3a"][i], 6), (rnd() - 0.5) * 0.32, 0.18, (rnd() - 0.5) * 0.32); } const dur = add(goods, ball(0.2, "#a8b85a", 8), 0.9, 0.2, 0); for (let k = 0; k < 10; k++) add(dur, cone(0.03, 0.08, "#a8b85a", 4), Math.cos(k * 1.3) * 0.18, Math.sin(k * 0.9) * 0.15, Math.sin(k * 1.3) * 0.18).lookAt(new THREE.Vector3(0, 0, 0)); break;   // mangoes, rambutan, limes, and a durian
      case "noodles": add(goods, cyl(0.3, 0.26, 0.4, "#8c9096", 10), -0.8, 0.2, 0); add(goods, cyl(0.28, 0.28, 0.04, "#e07a3a", 10), -0.8, 0.42, 0); for (let k = 0; k < 4; k++) { add(goods, cyl(0.12, 0.1, 0.1, "#f4f1ea", 8), -0.1 + (k % 2) * 0.35, 0.05, -0.2 + Math.floor(k / 2) * 0.4); add(goods, ball(0.09, "#e9d7a8", 6), -0.1 + (k % 2) * 0.35, 0.12, -0.2 + Math.floor(k / 2) * 0.4).scale.y = 0.5; } add(goods, ball(0.14, "#3f7a3a", 6), 0.9, 0.12, 0.1).scale.set(1.3, 0.7, 1); b.userData.steam = new THREE.Vector3(-0.8, 0.9, 0); break;
      case "herbs": for (let i = 0; i < 4; i++) { const bk = add(goods, cyl(0.22, 0.18, 0.2, C.straw, 8), -1.0 + i * 0.65, 0.1, 0); for (let k = 0; k < 6; k++) add(bk, ball(0.06, ["#3f7a3a", "#6fb06a", "#7fbf3a", "#c9302a"][i], 5), (rnd() - 0.5) * 0.28, 0.16, (rnd() - 0.5) * 0.28); } for (let k = 0; k < 3; k++) add(goods, cyl(0.025, 0.025, 0.6, "#a8c46a", 4), 1.1 + k * 0.06, 0.3, 0.2 - k * 0.1).rotation.z = 0.3; break;   // basil, mint, coriander, chillies, lemongrass
      case "coconut": for (let k = 0; k < 8; k++) add(goods, ball(0.14, "#8fb06a", 7), -1.0 + (k % 4) * 0.5, 0.14 + Math.floor(k / 4) * 0.2, -0.15 + Math.floor(k / 4) * 0.3); add(goods, box(0.05, 0.02, 0.35, "#8c9096"), 1.1, 0.05, 0.2); for (let k = 0; k < 2; k++) add(goods, cyl(0.015, 0.015, 0.4, "#e8558a", 3), 0.9 + k * 0.2, 0.3, -0.2).rotation.z = 0.2; break;   // young coconuts with straws
      case "flowers": for (let k = 0; k < 8; k++) { add(goods, cyl(0.02, 0.02, 0.3, "#3f7a3a", 3), -1.0 + k * 0.28, 0.15, (k % 2) * 0.2 - 0.1); add(goods, ball(0.09, k % 2 ? "#e8558a" : "#f2c14e", 6), -1.0 + k * 0.28, 0.34, (k % 2) * 0.2 - 0.1); } for (let k = 0; k < 3; k++) add(goods, cone(0.12, 0.3, k ? "#f4f1ea" : "#e8558a", 6), 0.9 + (k - 1) * 0.25, 0.2, 0.1);   // marigolds and lotus buds
        break;
    }
    const v = local(pick(["#3f6fb5", "#c0392b", "#f4f1ea", "#2f5d3f"]), { nonLa: true }); v.userData.sit?.(); add(b, v, -1.3, 0.4, 0); v.rotation.y = Math.PI / 2; v.scale.setScalar(0.85); vendors.push(v);
    add(b, cyl(0.02, 0.02, 1.6, SE.teak, 4), -1.6, 0.9, 0.3).rotation.z = 0.5;
    return b;
  };
  const layout: [string, number, number][] = [["fruit", -4.8, 0.4], ["noodles", -1.6, -0.1], ["herbs", 1.6, 0.4], ["coconut", 4.8, -0.1], ["flowers", 0, -2.6]];
  for (const [k, x, z] of layout) { const b = stall(k); b.position.set(x, 0, z); b.rotation.y = (rnd() - 0.5) * 0.3; g.add(b); if (b.userData.steam) g.userData.steam = b.localToWorld((b.userData.steam as THREE.Vector3).clone()); }
  const shoppers: Fig[] = [];
  for (let i = 0; i < 4; i++) { const p = local(pick(["#e8558a", "#f2c14e", "#3f6fb5", "#f4f1ea"]), { nonLa: i % 2 === 0 }); add(g, p, -4 + i * 2.6, 0.65, 2.4); p.rotation.y = 0; shoppers.push(p); }
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "สวัสดีค่ะ! Welcome, come look!", 3.6, 1500); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); boats.forEach((b, i) => { b.position.y = Math.sin(t * 1.3 + i) * 0.03 + k * Math.abs(Math.sin(t * 7 + i)) * 0.2; b.rotation.z = Math.sin(t * 1.1 + i) * 0.02; }); vendors.forEach((v, i) => { if (v.userData.upper) v.userData.upper.rotation.z = k * Math.sin(t * 8 + i) * 0.3; }); shoppers.forEach((p, i) => { if (p.userData.upper) p.userData.upper.rotation.x = 0.1 + Math.sin(t * 0.7 + i) * 0.05 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI); }); };
  return g;
}

/** The Thai curry kitchen: a granite mortar where the green paste is pounded, coconut cream cracking in a wok, Thai basil and aubergines, a street stall with stools. */
export function curryKitchen(): P {
  const g = group();
  add(g, box(4.4, 2.2, 3.0, "#e9c46a"), 0, 1.1, -1.4); for (const sd of [-1, 1]) { const r = add(g, box(4.9, 0.12, 1.9, SE.red), 0, 2.5, -1.4 + sd * 0.8); r.rotation.x = -sd * 0.45; } add(g, box(4.8, 0.06, 0.24, SE.gold), 0, 2.9, -1.4); for (const sd of [-1, 1]) add(g, cone(0.06, 0.4, SE.gold, 4), sd * 2.45, 3.05, -1.4);
  add(g, box(2.2, 0.5, 0.06, "#1f2430"), 0, 2.05, 0.2); add(g, box(2.0, 0.3, 0.02, SE.jade), 0, 2.05, 0.24);
  add(g, box(3.2, 0.85, 1.0, "#8c9096"), -0.6, 0.42, 1.2);
  const mortar = new THREE.Group(); mortar.position.set(-1.6, 0.85, 1.2); g.add(mortar); add(mortar, cyl(0.28, 0.2, 0.32, "#5a5a5a", 12), 0, 0.16, 0); add(mortar, cyl(0.22, 0.22, 0.05, "#6f9b57", 12), 0, 0.31, 0); const pestle = add(mortar, cyl(0.05, 0.07, 0.6, "#5a5a5a", 8), 0.05, 0.6, 0); pestle.rotation.z = 0.2;
  for (let k = 0; k < 4; k++) add(g, cone(0.03, 0.18, "#4f9a4a", 5), -2.2 + k * 0.1, 0.9, 0.8).rotation.z = Math.PI / 2 + k * 0.3; add(g, cyl(0.04, 0.05, 0.3, "#e9d7a8", 6), -2.4, 0.95, 1.5).rotation.z = 0.3; add(g, ball(0.08, "#c9a86a", 6), -2.1, 0.92, 1.6); for (let k = 0; k < 3; k++) add(g, box(0.06, 0.02, 0.05, "#3f7a3a"), -2.5 + k * 0.08, 0.88, 1.15);   // green chillies, lemongrass, galangal, lime leaves
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat("#3a3a3d")), 0.1, 1.25, 1.2); add(g, cyl(0.38, 0.38, 0.04, "#8fbf6a", 14), 0.1, 1.24, 1.2); for (let k = 0; k < 5; k++) add(g, ball(0.06, k % 2 ? "#f4f1ea" : "#6f9b57", 5), 0.1 + Math.cos(k * 1.25) * 0.22, 1.28, 1.2 + Math.sin(k * 1.25) * 0.22);   // the wok of green curry
  add(g, box(0.5, 0.25, 0.5, "#a45a3a"), 0.1, 0.97, 1.2); add(g, ball(0.08, "#f08a2a", 5), 0.1, 1.05, 1.35);
  add(g, cyl(0.16, 0.16, 0.14, "#f4f1ea", 8), 1.0, 0.92, 1.0); add(g, cyl(0.14, 0.14, 0.03, "#f7f4ee", 8), 1.0, 1.0, 1.0); add(g, cyl(0.1, 0.08, 0.16, "#f4f1ea", 8), 1.35, 0.93, 1.4); for (let k = 0; k < 3; k++) add(g, ball(0.05, "#7fbf3a", 5), 1.6 + k * 0.1, 0.9, 1.0);   // coconut cream, rice, pea aubergines
  const cook = local("#f4f1ea", { apron: true }); add(g, cook, -1.6, 0, 2.0); cook.rotation.y = Math.PI;
  const diners: Fig[] = [];
  for (const x of [1.4, 2.4]) { add(g, cyl(0.16, 0.16, 0.4, SE.red, 8), x, 0.2, 2.4); const d = local(pick(["#3f6fb5", "#e8558a", "#f2c14e"])); d.userData.sit?.(); add(g, d, x, 0.04, 2.4).rotation.y = Math.PI; diners.push(d); }
  add(g, box(1.0, 0.05, 0.6, "#f4f1ea"), 1.9, 0.5, 1.9); add(g, cyl(0.14, 0.12, 0.08, "#f4f1ea", 8), 1.9, 0.56, 1.9); add(g, ball(0.09, "#8fbf6a", 6), 1.9, 0.6, 1.9).scale.y = 0.5;
  g.userData.steam = new THREE.Vector3(0.1, 1.5, 1.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "อร่อยมาก! Delicious!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); pestle.position.y = 0.6 + Math.abs(Math.sin(t * (2 + k * 12))) * 0.2; if (cook.userData.upper) cook.userData.upper.rotation.x = 0.15 + Math.abs(Math.sin(t * (2 + k * 12))) * 0.1; diners.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.1 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); };
  return g;
}

/** A Hanoi street kitchen: a charcoal brazier grilling chicken, a pho pot, plastic stools, the goi ga salad tossed in a big bowl. */
export function hanoiKitchen(): P {
  const g = group();
  add(g, tubeHouse(SE.ochre, 2), 0, 0, -1.7);
  add(g, box(2.4, 0.5, 0.06, "#1f2430"), 0, 1.9, 0.2); add(g, box(2.2, 0.3, 0.02, SE.red), 0, 1.9, 0.24);
  add(g, box(1.6, 0.7, 0.8, "#8c9096"), -1.4, 0.35, 1.2); add(g, cyl(0.34, 0.3, 0.5, "#8c9096", 12), -1.4, 0.95, 1.2); add(g, cyl(0.32, 0.32, 0.04, "#e9c46a", 12), -1.4, 1.2, 1.2);   // the pho pot
  add(g, box(0.9, 0.4, 0.5, "#5a5a5a"), 0.4, 0.2, 1.3); for (let k = 0; k < 5; k++) add(g, cyl(0.06, 0.06, 0.4, "#c9573a", 6), 0.05 + k * 0.18, 0.45, 1.3).rotation.z = Math.PI / 2; for (let k = 0; k < 3; k++) add(g, ball(0.05, "#f08a2a", 4), 0.1 + k * 0.3, 0.4, 1.3);   // chicken on the brazier
  const bowl = new THREE.Group(); bowl.position.set(1.6, 0.5, 1.2); g.add(bowl); add(bowl, cyl(0.36, 0.28, 0.24, "#c9cfd6", 12), 0, 0.12, 0); for (let k = 0; k < 10; k++) add(bowl, ball(0.06, ["#e9d7a8", "#3f7a3a", "#f4f1ea", "#e07a3a", "#6fb06a"][k % 5], 5), Math.cos(k * 0.63) * 0.2, 0.26, Math.sin(k * 0.63) * 0.2); add(g, box(0.5, 0.5, 0.5, "#8a6a3a"), 1.6, 0.25, 1.2);
  for (let k = 0; k < 3; k++) { add(g, cyl(0.02, 0.02, 0.6, "#3f7a3a", 3), 2.3 + k * 0.1, 0.55, 1.0); add(g, ball(0.08, k ? "#6fb06a" : "#3f7a3a", 5), 2.3 + k * 0.1, 0.85, 1.0).scale.y = 0.6; } add(g, cyl(0.06, 0.06, 0.08, "#f2c14e", 6), 2.5, 0.3, 1.4); for (let k = 0; k < 6; k++) add(g, ball(0.03, "#c9a86a", 4), 2.2 + (k % 3) * 0.08, 0.29, 1.5 + Math.floor(k / 3) * 0.08);   // herbs, lime, peanuts
  const cook = local("#f4f1ea", { apron: true, nonLa: true }); add(g, cook, 0.2, 0, 2.1); cook.rotation.y = Math.PI;
  const diners: Fig[] = [];
  for (let i = 0; i < 4; i++) { add(g, cyl(0.14, 0.12, 0.28, ["#2f6fb5", "#c0392b", "#3f8f5a", "#e8558a"][i], 8), -1.8 + i * 0.9, 0.14, 2.9); const d = local(pick(["#f4f1ea", "#3f6fb5", "#e8558a", "#2a2a2e"])); d.userData.sit?.(); add(g, d, -1.8 + i * 0.9, -0.1, 2.9).rotation.y = Math.PI; diners.push(d); add(g, cyl(0.12, 0.1, 0.08, "#f4f1ea", 8), -1.8 + i * 0.9, 0.26, 2.45); add(g, ball(0.08, i % 2 ? "#e9d7a8" : "#8fbf6a", 5), -1.8 + i * 0.9, 0.3, 2.45).scale.y = 0.5; }
  g.userData.steam = new THREE.Vector3(-1.4, 1.5, 1.2); g.userData.smoke = new THREE.Vector3(0.4, 0.7, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(cook, "Ngon quá! Delicious!", 1.6, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); bowl.rotation.y += k * dt * 6; bowl.position.y = 0.5 + k * Math.abs(Math.sin(t * 9)) * 0.25; diners.forEach((d, i) => { if (d.userData.upper) d.userData.upper.rotation.x = 0.15 + k * 0.3 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t + i) * 0.03; }); if (cook.userData.upper) cook.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

/** A banh mi cart: baguettes in a glass case, pâté, pickles, chilli, a seller filling a loaf, a customer on a scooter. */
export function banhMiCart(): P {
  const g = group();
  add(g, box(1.8, 0.9, 0.9, "#8c9096"), 0, 0.55, 0); for (const x of [-0.6, 0.6]) add(g, cyl(0.22, 0.22, 0.08, "#2a2a2e", 10), x, 0.22, 0.5).rotation.x = Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.9), mat("#bfe0ea", { transparent: true, opacity: 0.35 })), 0, 1.3, 0); add(g, box(1.85, 0.05, 0.95, "#8c9096"), 0, 1.62, 0);
  for (let k = 0; k < 8; k++) { const b = add(g, cyl(0.06, 0.06, 0.45, "#e9c46a", 7), -0.6 + (k % 4) * 0.4, 1.1 + Math.floor(k / 4) * 0.14, -0.2 + Math.floor(k / 4) * 0.35); b.rotation.z = Math.PI / 2; b.rotation.y = 0.2; }
  for (let k = 0; k < 4; k++) { add(g, cyl(0.08, 0.07, 0.1, "#f4f1ea", 8), -0.55 + k * 0.35, 1.05, 0.3); add(g, ball(0.06, ["#8a5a3a", "#f08a2a", "#3f7a3a", "#c9302a"][k], 5), -0.55 + k * 0.35, 1.12, 0.3).scale.y = 0.6; }   // pâté, pickled carrot, cucumber and coriander, chilli
  add(g, box(0.6, 0.5, 0.06, SE.red), 0, 1.95, 0); add(g, box(0.5, 0.3, 0.02, "#f4f1ea"), 0, 1.95, 0.04);
  const seller = local("#f4f1ea", { apron: true, nonLa: true }); add(g, seller, 0, 0, -0.8); const loaf = add(seller, cyl(0.05, 0.05, 0.4, "#e9c46a", 7), 0.2, 0.9, 0.3); loaf.rotation.z = Math.PI / 2;
  const bike = motorbike("#6fb3c9"); add(g, bike, 1.6, 0, 0.9); bike.rotation.y = -0.6;
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(seller, "Bánh mì nóng! Hot banh mi!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); loaf.position.y = 0.9 + k * Math.abs(Math.sin(t * 9)) * 0.3; if (seller.userData.upper) seller.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; bike.position.y = k * Math.abs(Math.sin(t * 12)) * 0.05; };
  return g;
}

/** A herb garden: Thai basil, mint, coriander, kaffir lime, lemongrass and chillies, a woman with a basket. */
export function herbGardenSea(): P {
  const g = group();
  add(g, box(5.4, 0.2, 3.4, "#6b4a32"), 0, 0.1, 0);
  const plants: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) {
    const pl = new THREE.Group(); pl.position.set(-2.4 + j * 0.8, 0.2, -1.2 + i * 0.8); g.add(pl); plants.push(pl);
    if (i === 3) { for (let k = 0; k < 5; k++) add(pl, cyl(0.02, 0.03, 0.7, "#a8c46a", 4), (k - 2) * 0.05, 0.35, 0).rotation.z = (k - 2) * 0.12; }   // lemongrass
    else { const col = ["#4f7a3a", "#6fb06a", "#7fbf3a"][i]; for (let k = 0; k < 5; k++) { add(pl, cyl(0.015, 0.015, 0.3, "#5f9a4a", 3), (k - 2) * 0.05, 0.15, (k % 2) * 0.05); add(pl, ball(0.06, col, 5), (k - 2) * 0.05, 0.32, (k % 2) * 0.05).scale.y = 0.6; } if (i === 0) add(pl, ball(0.04, "#9b59b6", 4), 0, 0.42, 0); }
  }
  add(g, cyl(0.1, 0.12, 0.9, "#6b4a2c", 6), 3.4, 0.45, -0.8); add(g, ball(0.6, "#3f7a3a", 8), 3.4, 1.2, -0.8); for (let k = 0; k < 5; k++) add(g, ball(0.06, "#7fbf3a", 5), 3.4 + Math.cos(k * 1.3) * 0.45, 1.0 + (k % 2) * 0.4, -0.8 + Math.sin(k * 1.3) * 0.45);   // a kaffir lime tree
  for (let k = 0; k < 4; k++) { const c = add(g, cone(0.03, 0.14, "#c9302a", 5), 3.0 + k * 0.2, 0.5, 0.9); c.rotation.x = Math.PI; }
  const woman = local("#e8558a", { nonLa: true }); add(g, woman, 3.6, 0, 1.2); woman.rotation.y = Math.PI; add(g, cyl(0.25, 0.2, 0.2, C.straw, 8), 4.1, 0.1, 1.5); for (let k = 0; k < 6; k++) add(g, ball(0.05, "#6fb06a", 4), 4.1 + (rnd() - 0.5) * 0.3, 0.24, 1.5 + (rnd() - 0.5) * 0.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(woman, "Rau thơm! Fresh herbs!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); plants.forEach((p) => { const s2 = 1 + k * Math.max(0, Math.sin((1 - k) * 9 - (p.position.x + 2.4) * 1.2)) * 0.6; p.scale.set(s2, 1 + (s2 - 1) * 1.2, s2); }); if (woman.userData.upper) woman.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.2; };
  return g;
}

/** Thai spices: chillies drying, galangal, lemongrass and garlic in baskets, a mortar. */
export function spiceStall(): P {
  const g = group();
  add(g, box(3.0, 0.8, 1.2, SE.teak), 0, 0.4, 0); for (const x of [-1.4, 1.4]) add(g, cyl(0.04, 0.04, 2.3, SE.teak, 5), x, 1.15, -0.5); add(g, box(3.4, 0.06, 1.8, SE.saffron), 0, 2.3, 0.1).rotation.x = 0.15;
  const goods: THREE.Object3D[] = [];
  for (let i = 0; i < 4; i++) { const bk = add(g, cyl(0.28, 0.22, 0.22, C.straw, 9), -1.05 + i * 0.7, 0.9, 0); goods.push(bk); for (let k = 0; k < 7; k++) { const item = i === 0 ? cone(0.035, 0.22, "#c9302a", 5) : i === 1 ? ball(0.07, "#c9a86a", 6) : i === 2 ? cyl(0.02, 0.025, 0.4, "#a8c46a", 4) : ball(0.07, "#f1e9dc", 6); add(bk, item, (rnd() - 0.5) * 0.35, 0.18, (rnd() - 0.5) * 0.35); if (i === 0 || i === 2) item.rotation.z = rnd() * 3; } }
  for (let k = 0; k < 3; k++) { add(g, box(1.0, 0.03, 0.6, C.straw), -1.6 + k * 1.3, 0.02, 1.3); for (let j = 0; j < 12; j++) { const c = add(g, cone(0.035, 0.2, "#d3342b", 5), -1.6 + k * 1.3 + (rnd() - 0.5) * 0.9, 0.06, 1.3 + (rnd() - 0.5) * 0.5); c.rotation.z = Math.PI / 2; c.rotation.y = rnd() * 3; } }
  const seller = local("#3f8f5a", { apron: true }); add(g, seller, 0.3, 0, -0.9);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(seller, "เผ็ด! Spicy!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); goods.forEach((b, i) => { b.position.y = 0.9 + k * Math.max(0, Math.sin(t * 9 + i * 1.4)) * 0.3; }); if (seller.userData.upper) seller.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.3; };
  return g;
}

/** Wet paddies with a water buffalo pulling a plough, planters bent in rows, an egret. */
export function paddySea(): P {
  const g = group();
  const seedlings: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) { add(g, box(7, 0.18, 2.8, "#9ec9b8"), 0, 0.09, -1.6 + i * 3.2); for (let r = 0; r < 3; r++) for (let c = 0; c < 14; c++) { const sd = add(g, cone(0.08, 0.55, "#7fc85a", 4), -3.2 + c * 0.5, 0.3, -2.5 + i * 3.2 + r * 0.8); sd.geometry = sd.geometry.clone(); sd.geometry.translate(0, 0.27, 0); sd.position.y -= 0.27; seedlings.push(sd); } }
  add(g, box(7.5, 0.2, 0.3, "#a37a4f"), 0, 0.1, 0);
  const buff = cow(true, false, "Ọ! Moo!"); buff.position.set(-2.2, 0, -1.6); buff.rotation.y = -1.5; buff.scale.setScalar(0.9); g.add(buff);
  add(g, box(0.6, 0.3, 0.2, SE.teak), -0.6, 0.25, -1.6); add(g, cyl(0.02, 0.02, 1.4, SE.teak, 3), -1.3, 0.5, -1.6).rotation.z = Math.PI / 2;
  const plough = local("#2a2a2e", { nonLa: true }); add(g, plough, 0.1, 0, -1.6); plough.rotation.y = -Math.PI / 2;
  const planters: Fig[] = [];
  for (let i = 0; i < 3; i++) { const p = local(pick(["#2a2a2e", "#3f6fb5", "#f4f1ea"]), { nonLa: true }); add(g, p, -2 + i * 1.6, 0, 1.6); p.rotation.y = Math.PI; if (p.userData.upper) p.userData.upper.rotation.x = 0.9; planters.push(p); }
  const egret = group(); add(egret, ball(0.1, "#f4f1ea", 6), 0, 0.5, 0).scale.set(1.4, 0.8, 1); add(egret, cyl(0.02, 0.02, 0.4, "#f4f1ea", 4), 0.12, 0.72, 0).rotation.z = -0.3; add(egret, ball(0.05, "#f4f1ea", 5), 0.22, 0.9, 0); add(egret, cone(0.015, 0.14, "#e0b34c", 4), 0.32, 0.9, 0).rotation.z = -1.5; add(egret, cyl(0.01, 0.01, 0.4, "#2a2a2e", 3), 0, 0.2, 0); add(g, egret, 3.0, 0.15, -1.2);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(plough, "Lúa! Rice!", 1.5, 1300); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); seedlings.forEach((sd) => { sd.rotation.z = Math.sin(t * 1.5 + sd.position.x * 0.8) * 0.08 + k * Math.sin((1 - k) * 10 - sd.position.x * 1.5) * 0.5; }); planters.forEach((p, i) => { if (p.userData.upper) p.userData.upper.rotation.x = 0.9 - Math.abs(Math.sin(t * (1 + k * 6) + i)) * 0.3; }); egret.position.y = 0.15 + k * Math.abs(Math.sin(t * 5)) * 1.2; tickChildren(g)(t, dt); };
  return g;
}

export function chickenSea(): P { return chicken("#a8602a", "Cục tác! Cluck!"); }

/** A fishing village on the shore: nets, squid drying on lines, fish sauce fermenting in tall jars, prawns in a basket. */
export function fishSauceVillage(): P {
  const g = group();
  add(g, box(3.2, 1.6, 2.4, "#c9a86a"), -1.4, 0.8, -1.0); for (const sd of [-1, 1]) { const r = add(g, box(3.6, 0.1, 1.4, C.straw), -1.4, 1.75, -1.0 + sd * 0.6); r.rotation.x = -sd * 0.55; } add(g, box(3.6, 0.06, 0.16, "#8a6a3a"), -1.4, 2.1, -1.0);
  for (let i = 0; i < 5; i++) { const x = 1.4 + (i % 3) * 0.8, z = -1.4 + Math.floor(i / 3) * 0.9; add(g, cyl(0.3, 0.26, 0.9, "#8a4a2a", 10), x, 0.45, z); add(g, cyl(0.24, 0.24, 0.06, "#7a5a3a", 10), x, 0.93, z); add(g, cyl(0.28, 0.24, 0.06, C.straw, 10), x, 1.0, z); }   // the fish sauce jars, salted anchovy under woven lids
  add(g, cyl(0.02, 0.02, 3.6, SE.teak, 3), 0.4, 1.7, 1.2).rotation.z = Math.PI / 2; for (const x of [-1.4, 2.2]) add(g, cyl(0.03, 0.03, 1.8, SE.teak, 4), x, 0.9, 1.2);
  for (let k = 0; k < 7; k++) { const sq = add(g, box(0.18, 0.4, 0.02, "#f4e6d0"), -1.1 + k * 0.55, 1.45, 1.2); for (let j = 0; j < 4; j++) add(sq, cyl(0.015, 0.015, 0.2, "#f4e6d0", 3), -0.06 + j * 0.04, -0.3, 0); }   // squid drying
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.2, 5, 3), new THREE.MeshStandardMaterial({ color: "#c9b45a", wireframe: true })), -2.6, 0.6, 1.4).rotation.y = 0.3;
  const bk = add(g, cyl(0.3, 0.24, 0.24, C.straw, 9), 2.6, 0.12, 1.9); for (let k = 0; k < 7; k++) add(bk, ball(0.06, "#f08a6a", 5), (rnd() - 0.5) * 0.35, 0.16, (rnd() - 0.5) * 0.35).scale.set(1.6, 0.6, 0.8);
  const woman = local("#e8558a", { nonLa: true }); add(g, woman, 0.6, 0, 2.2); woman.rotation.y = Math.PI;
  const fisher = local("#3f6fb5", { nonLa: true }); fisher.userData.sit?.(); add(g, box(0.4, 0.4, 0.4, SE.teak), -2.4, 0.2, 2.4); add(g, fisher, -2.4, 0.04, 2.4); fisher.rotation.y = 0.6;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(woman, "Nước mắm! Fish sauce!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); g.children.forEach((c, i) => { if ((c as THREE.Mesh).isMesh && (c as THREE.Mesh).geometry.type === "BoxGeometry" && Math.abs(c.position.y - 1.45) < 0.01) c.rotation.y = Math.sin(t * 1.2 + i) * 0.15 + k * Math.sin(t * 8 + i) * 0.5; }); if (woman.userData.upper) woman.userData.upper.rotation.z = k * Math.sin(t * 8) * 0.25; };
  return g;
}

/** A coconut grove by the beach, a climber, a vendor hacking open young coconuts with a cleaver. */
export function coconutSea(): P {
  const g = group();
  const palms: P[] = [];
  for (let i = 0; i < 5; i++) { const p = datePalm(1.0 + (i % 2) * 0.3); const cr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; cr.forEach((d) => { (d.material as THREE.MeshStandardMaterial).color.set("#8fb06a"); d.scale.set(1.5, 1.3, 1.5); }); p.position.set(-3 + i * 1.5, 0, (i % 2) * 1.8 - 0.9); p.rotation.y = i * 1.3; g.add(p); palms.push(p); }
  const climber = local("#f4f1ea"); climber.rotation.z = -0.3; add(g, climber, -1.15, 1.8, 0.9); climber.rotation.y = 0.6;
  add(g, box(1.4, 0.8, 0.7, SE.teak), 3.4, 0.4, 0.6); for (let k = 0; k < 6; k++) add(g, ball(0.15, "#8fb06a", 7), 3.0 + (k % 3) * 0.4, 0.95, 0.4 + Math.floor(k / 3) * 0.4); add(g, box(0.05, 0.02, 0.35, "#8c9096"), 3.9, 0.82, 0.3);
  const vendor = local("#3f8f5a", { apron: true }); add(g, vendor, 3.4, 0, -0.3); const cleaver = add(vendor, box(0.05, 0.02, 0.35, "#8c9096"), 0.25, 0.95, 0.3);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => { shake = 1; bubble(g, "มะพร้าว! Coconuts!", 3.8, 1400); for (const p of palms) { const fr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; const src = fr[Math.floor(rnd() * fr.length)]; const m = ball(0.16, "#8fb06a", 7); const wp = src.getWorldPosition(new THREE.Vector3()); g.worldToLocal(wp); m.position.copy(wp); g.add(m); falling.push({ m, v: 0, life: 0 }); } };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.2); for (const p of palms) { const c = (p.userData as { crown?: THREE.Group }).crown; if (c) c.rotation.x = Math.sin(t * 24 + p.position.x) * 0.12 * shake; } cleaver.rotation.x = Math.sin(t * 20) * 0.6 * shake; }
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 8; f.life += dt; f.m.position.y = Math.max(0.16, f.m.position.y - f.v * dt); if (f.m.position.y <= 0.161) f.v = 0; if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
    tickChildren(g)(t, dt);
  };
  return g;
}

/** A row of monks on the morning alms round, each with a bowl, and a kneeling woman offering rice. */
export function almsRound(): P {
  const g = group();
  const monks: Fig[] = [];
  for (let i = 0; i < 4; i++) { const m = local("", { monk: true }); add(m, ball(0.12, "#3a2a1a", 7), 0.05, 0.85, 0.28).scale.y = 0.8; add(g, m, -2.4 + i * 1.2, 0, 0); monks.push(m); }
  const giver = local("#f4f1ea", { sarong: "#9b59b6" }); giver.userData.sit?.(); add(g, giver, 2.0, -0.3, 0.9); giver.rotation.y = -Math.PI / 2 - 0.4; add(g, cyl(0.16, 0.14, 0.08, "#c9cfd6", 8), 1.6, 0.06, 0.6); add(g, ball(0.1, "#f7f4ee", 6), 1.6, 0.12, 0.6).scale.y = 0.5;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(monks[0], "สาธุ! Sadhu!", 1.5, 1400); };
  g.userData.tick = (t, dt) => { const k = re.step(dt); monks.forEach((m, i) => { if (m.userData.upper) m.userData.upper.rotation.x = 0.12 + k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI) + Math.sin(t * 0.8 + i) * 0.02; }); if (giver.userData.upper) giver.userData.upper.rotation.x = 0.4 + k * 0.4 * Math.sin(Math.min(1, k * 2) * Math.PI); };
  return g;
}

export const SEASIA_PROPS: Record<string, () => P> = {
  floatingMarket, curryKitchen, hanoiKitchen, banhMiCart, herbGardenSea, spiceStall, paddySea, chickenSea, fishSauceVillage, coconutSea, almsRound, none: () => group(),
};

export const SEASIA_ICONS: Record<string, () => P> = {
  riceSea: () => { const g = group(); add(g, cyl(0.36, 0.3, 0.1, "#f4f1ea", 12), 0, 0.05, 0); add(g, ball(0.3, "#f7f2e6", 9), 0, 0.14, 0).scale.y = 0.5; for (let k = 0; k < 6; k++) add(g, cyl(0.02, 0.02, 0.5, "#c9b45a", 3), 0.45 + (k % 3) * 0.08, 0.25, -0.2 + Math.floor(k / 3) * 0.1); return g; },
  chickenSea: () => chicken("#a8602a"),
  herbsSea: () => { const g = group(); for (let k = 0; k < 6; k++) { add(g, cyl(0.015, 0.015, 0.35, "#5f9a4a", 3), -0.3 + k * 0.12, 0.18, (k % 2) * 0.1); add(g, ball(0.07, ["#4f7a3a", "#6fb06a"][k % 2], 5), -0.3 + k * 0.12, 0.38, (k % 2) * 0.1).scale.y = 0.6; } add(g, ball(0.1, "#7fbf3a", 7), 0.45, 0.1, -0.2); for (let k = 0; k < 3; k++) add(g, cyl(0.02, 0.025, 0.5, "#a8c46a", 4), 0.4 + k * 0.06, 0.25, 0.25).rotation.z = 0.25; return g; },
  coconutSea: () => { const g = group(); add(g, ball(0.2, "#8fb06a", 8), -0.25, 0.2, 0); add(g, cyl(0.18, 0.18, 0.14, "#f7f4ee", 8), 0.2, 0.07, 0.1); add(g, cyl(0.14, 0.14, 0.02, "#f7f4ee", 8), 0.2, 0.15, 0.1); add(g, cyl(0.012, 0.012, 0.4, "#e8558a", 3), -0.2, 0.45, 0).rotation.z = 0.2; return g; },
  spicesSea: () => { const g = group(); for (let i = 0; i < 3; i++) { const c = add(g, cone(0.05, 0.3, "#7fbf3a", 5), -0.4 + i * 0.15, 0.1, 0); c.rotation.z = Math.PI / 2 + (i - 1) * 0.3; } add(g, cyl(0.03, 0.04, 0.5, "#a8c46a", 4), 0.15, 0.25, -0.1).rotation.z = 0.2; add(g, ball(0.1, "#c9a86a", 6), 0.4, 0.1, 0.15); add(g, box(0.1, 0.02, 0.06, "#3f7a3a"), 0.45, 0.02, -0.25); return g; },
  fishSauce: () => { const g = group(); add(g, cyl(0.16, 0.13, 0.4, "#8a4a2a", 10), -0.25, 0.2, 0); add(g, cyl(0.14, 0.12, 0.04, C.straw, 10), -0.25, 0.42, 0); for (let k = 0; k < 4; k++) add(g, ball(0.06, "#f08a6a", 5), 0.15 + (k % 2) * 0.2, 0.06, -0.15 + Math.floor(k / 2) * 0.25).scale.set(1.6, 0.6, 0.8); add(g, cyl(0.05, 0.05, 0.2, "#c9a86a", 6), 0.5, 0.1, 0.2); return g; },
  curryPaste: () => { const g = group(); add(g, cyl(0.3, 0.22, 0.28, "#5a5a5a", 12), -0.15, 0.14, 0); add(g, cyl(0.24, 0.24, 0.05, "#6f9b57", 12), -0.15, 0.28, 0); add(g, cyl(0.05, 0.07, 0.45, "#5a5a5a", 8), -0.05, 0.5, 0).rotation.z = 0.3; add(g, cyl(0.12, 0.1, 0.16, "#f4f1ea", 8), 0.4, 0.08, 0.15); return g; },
  hanoiKitchen: () => { const g = group(); add(g, cyl(0.32, 0.26, 0.2, "#c9cfd6", 12), 0, 0.1, 0); for (let k = 0; k < 8; k++) add(g, ball(0.06, ["#e9d7a8", "#3f7a3a", "#f4f1ea", "#e07a3a"][k % 4], 5), Math.cos(k * 0.785) * 0.18, 0.22, Math.sin(k * 0.785) * 0.18); add(g, cyl(0.1, 0.09, 0.2, "#2f6fb5", 8), 0.5, 0.1, -0.2); return g; },
  banhMi: () => { const g = group(); const b = add(g, cyl(0.08, 0.08, 0.6, "#e9c46a", 7), 0, 0.08, 0); b.rotation.z = Math.PI / 2; add(g, box(0.5, 0.04, 0.12, "#3f7a3a"), 0, 0.15, 0.03); add(g, box(0.4, 0.04, 0.1, "#f08a2a"), 0.02, 0.18, 0.02); add(g, ball(0.04, "#c9302a", 4), 0.1, 0.22, 0.02); return g; },
  floatingMarket: () => { const g = group(); add(g, box(0.9, 0.12, 0.3, SE.teak), 0, 0.06, 0); add(g, box(0.9, 0.02, 0.32, "#a37a4f"), 0, 0.13, 0); for (let k = 0; k < 3; k++) add(g, ball(0.06, ["#f2b64d", "#c0392b", "#7fbf3a"][k], 5), -0.25 + k * 0.2, 0.2, 0); add(g, cone(0.12, 0.1, "#e9d7a8", 10), 0.35, 0.3, 0); return g; },
  durian: () => { const g = group(); const d = add(g, ball(0.25, "#a8b85a", 8), 0, 0.25, 0); for (let k = 0; k < 14; k++) { const s = add(d, cone(0.04, 0.1, "#a8b85a", 4), Math.cos(k * 1.1) * 0.24, Math.sin(k * 0.7) * 0.2, Math.sin(k * 1.1) * 0.24); s.lookAt(new THREE.Vector3(0, 0, 0)); s.rotateX(Math.PI / 2); } add(g, ball(0.09, "#f2c14e", 6), 0.42, 0.09, 0.1); return g; },
  wat: () => { const w = wat(); w.scale.setScalar(0.22); return w; },
  almsRound: () => { const g = group(); const m = local("", { monk: true }); m.scale.setScalar(0.6); add(g, m, -0.2, 0, 0); add(g, ball(0.08, "#3a2a1a", 6), 0.2, 0.3, 0.1); return g; },
  tukTuk: () => { const t = tukTuk(); t.scale.setScalar(0.5); return t; },
  hoanKiem: () => { const g = group(); add(g, new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), mat("#8fd0dc")), 0, 0.02, 0).rotation.x = -Math.PI / 2; for (let i = 0; i < 3; i++) add(g, box(0.3 - i * 0.07, 0.18, 0.3 - i * 0.07, "#b8a888"), 0, 0.1 + i * 0.18, 0); add(g, cone(0.12, 0.12, "#8a7a5a", 4), 0, 0.62, 0).rotation.y = Math.PI / 4; return g; },
  stilts: () => { const s = stiltHouse(); s.scale.setScalar(0.25); return s; },
  karsts: () => { const g = group(); const a = karst(0.9, 0.3); a.position.x = -0.25; g.add(a); const b = karst(0.6, 0.22); b.position.set(0.3, 0, 0.1); g.add(b); return g; },
  longtail: () => { const l = longtail(); l.scale.setScalar(0.3); return l; },
  motorbikes: () => { const m = motorbike(); m.scale.setScalar(0.6); return m; },
};
