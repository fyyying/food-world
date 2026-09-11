// Jiangnan: the water-town props of the China world. Each answers a click with a reaction inside the world
// (steamers lifting, crabs scattering, lotus opening, cups raised) before any card or room opens, the way Sichuan does.
import * as THREE from "three";
import { C, add, box, cyl, cone, ball, group, reaction, pick, tickChildren, smooth, mat, house, person, lantern, chineseRoof, pavilionRoof, terrace, bubble, rnd, hopFood, ambientChat, type P } from "./props";

const JN_LINES = ["阿要吃点啥? What will you have?", "慢慢吃 Take your time", "今朝蟹肥 The crabs are fat today", "再添点黄酒 A little more yellow wine", "落雨了 Rain is coming", "鲜得来! So fresh!"];
type Fig = P & { userData: { upper?: THREE.Group; arms?: { left: THREE.Group; right: THREE.Group } ; sit?: () => void } };
const upper = (p: THREE.Object3D) => (p.userData as { upper?: THREE.Group }).upper;
const arms = (p: THREE.Object3D) => (p.userData as { arms?: { left: THREE.Group; right: THREE.Group } }).arms;

/** a stack of bamboo steamers with a lid; the lid can lift */
function steamerStack(g: THREE.Object3D, x: number, y: number, z: number, n: number, r = 0.34) {
  for (let i = 0; i < n; i++) { add(g, cyl(r, r, 0.16, "#c9a86a", 12), x, y + 0.08 + i * 0.17, z); add(g, new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 4, 14), mat("#a5813f")), x, y + 0.16 + i * 0.17, z).rotation.x = Math.PI / 2; }
  const lid = new THREE.Group(); lid.position.set(x, y + n * 0.17 + 0.02, z); g.add(lid);
  add(lid, cyl(r + 0.02, r + 0.02, 0.06, "#b8944f", 12), 0, 0, 0); add(lid, ball(0.05, "#8a6a3a", 6), 0, 0.06, 0);
  return lid;
}

/** 包子铺: a shop front with steamer towers, a cook rolling dough, a queue. Click: the lids pop and the steam rolls out. */
export function baoShop(): P {
  const g = group();
  add(g, house("jiangnan", 3.4, 2.6, 2.0), 0, 0, -0.9);
  add(g, box(3.0, 0.9, 0.9, C.wood), 0, 0.45, 0.9);                       // counter
  const lids = [steamerStack(g, -1.0, 0.9, 0.9, 4), steamerStack(g, 0.1, 0.9, 0.95, 5), steamerStack(g, 1.0, 0.9, 0.85, 3, 0.28)];
  for (let i = 0; i < 6; i++) add(g, ball(0.07, "#fbf5e8", 7), -1.3 + i * 0.22, 0.98, 1.25).scale.y = 0.8;   // buns cooling on the board
  add(g, box(0.5, 0.7, 0.05, "#f3e6c8"), 1.55, 1.8, 0.4);                  // sign 包
  const cook = add(g, person("#f4f1ea", { apron: true, hat: false }), 0.1, 0, -0.1) as Fig;
  add(upper(cook)!, cyl(0.02, 0.02, 0.5, C.wood, 4), 0, 0.15, 0.2).rotation.z = Math.PI / 2;   // rolling pin
  const queue = [person("#6a7fb0"), person("#e0a52c"), person("#2f5d3f")].map((p, i) => add(g, p, 1.6 + i * 0.55, 0, 1.9 + i * 0.5)) as Fig[];
  queue.forEach((p, i) => { p.rotation.y = -0.6; p.scale.setScalar(i === 1 ? 0.65 : 0.95); });
  add(g, lantern(0.8), -1.6, 2.1, 0.5); add(g, lantern(0.8), 1.6, 2.1, 0.5);
  g.userData.steam = new THREE.Vector3(0.1, 1.9, 0.95);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(g, "小笼包出笼咯! Fresh from the steamer!", 2.9, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    lids.forEach((l, i) => { l.position.y = 0.9 + [4, 5, 3][i] * 0.17 + 0.02 + k * (0.25 + Math.abs(Math.sin(t * 9 + i)) * 0.12); l.rotation.z = k * Math.sin(t * 7 + i) * 0.2; });
    const up = upper(cook); if (up) { up.rotation.x = 0.25 + Math.sin(t * 2.4) * 0.08 * (1 + k * 3); }
    queue.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 1.1 + i) * 0.05 + k * Math.sin(t * 6 + i) * 0.15; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** a crab: a flat body, two claws, six legs; scuttles sideways */
function crab(scale = 1): THREE.Group {
  const c = new THREE.Group();
  add(c, ball(0.16, "#5a4a3a", 8), 0, 0.1, 0).scale.set(1.3, 0.55, 1);
  for (const sd of [-1, 1]) { add(c, ball(0.06, "#4a3a2c", 6), sd * 0.24, 0.1, 0.12).scale.set(1.4, 0.8, 1); for (let i = 0; i < 3; i++) { const leg = add(c, cyl(0.012, 0.012, 0.22, "#4a3a2c", 3), sd * 0.2, 0.07, -0.1 + i * 0.09); leg.rotation.z = sd * 1.1; } }
  c.scale.setScalar(scale);
  return c;
}

/** 蟹塘: a stone-rimmed crab pen by the water, crabs scuttling, a basket of straw-tied crabs, the crab man with his net. Click: they scatter. */
export function crabPond(): P {
  const g = group();
  add(g, box(4.4, 0.3, 3.2, C.stone), 0, 0.15, 0);
  add(g, box(4.0, 0.12, 2.8, "#7fb6b8"), 0, 0.32, 0);
  for (const x of [-1.6, -0.5, 0.6, 1.7]) { add(g, cyl(0.03, 0.04, 1.3, C.wood, 4), x, 0.9, -1.2); }
  add(g, box(3.4, 0.5, 0.02, "#a9b7a0"), 0, 1.1, -1.2);                     // net between the poles
  const crabs = Array.from({ length: 6 }, (_, i) => { const c = crab(0.8 + (i % 3) * 0.15); add(g, c, -1.4 + i * 0.55, 0.36, (i % 2) * 0.8 - 0.4); return { c, ph: i * 1.7, dir: i % 2 ? 1 : -1 }; });
  add(g, cyl(0.42, 0.34, 0.5, C.straw, 9), 2.6, 0.25, 0.9);                   // basket of tied crabs
  for (let i = 0; i < 4; i++) { const c = crab(0.7); add(g, c, 2.6 + (i % 2) * 0.2 - 0.1, 0.5 + Math.floor(i / 2) * 0.12, 0.9 + (i > 1 ? 0.15 : -0.1)); add(c, new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 4, 10), mat(C.straw)), 0, 0.1, 0).rotation.x = Math.PI / 2; }
  const man = add(g, person("#4a3a32", { hat: true }), -2.7, 0, 0.6) as Fig; man.rotation.y = 1.2;
  const net = add(upper(man)!, cyl(0.02, 0.02, 1.6, C.wood, 4), 0.2, 0.3, 0); net.rotation.z = -0.9;
  add(net, new THREE.Mesh(new THREE.CircleGeometry(0.3, 10), mat("#a9b7a0", { side: THREE.DoubleSide })), 0, 0.85, 0);
  add(g, ball(0.5, "#e6b33a", 8), 3.0, 0.5, -1.1).scale.set(1, 0.9, 1);     // an osmanthus bush in flower
  for (let i = 0; i < 14; i++) add(g, ball(0.05, "#f4c542", 5), 3.0 + (rnd() - 0.5) * 0.9, 0.5 + (rnd() - 0.5) * 0.7, -1.1 + (rnd() - 0.5) * 0.9);
  const re = reaction(0.8);
  g.userData.poke = () => { re.poke(); bubble(man, "大闸蟹上市了! Hairy crab season!", 1.6, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    crabs.forEach(({ c, ph, dir }) => {
      const speed = 0.25 + k * 3;
      c.position.x += Math.sin(t * 0.7 + ph) * dir * speed * dt;
      c.position.x = THREE.MathUtils.clamp(c.position.x, -1.8, 1.8);
      c.position.z += Math.cos(t * 0.5 + ph) * speed * 0.3 * dt; c.position.z = THREE.MathUtils.clamp(c.position.z, -1.0, 1.0);
      c.position.y = 0.36 + k * Math.abs(Math.sin(t * 12 + ph)) * 0.05;
      c.rotation.y = Math.sin(t * 0.7 + ph) * 0.2;
    });
    const up = upper(man); if (up) { up.rotation.z = Math.sin(t * 0.9) * 0.05 + k * Math.sin(t * 5) * 0.2; up.rotation.x = -k * 0.3; }
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 荷塘: lotus leaves and flowers on a pond with a small pavilion; the flowers open when you click. */
export function lotusPond(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(3.6, 20), mat(C.soil)), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.CircleGeometry(3.3, 20), smooth("#8fc4c9")), 0, 0.05, 0).rotation.x = -Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.14, 5, 26), mat(C.stone)), 0, 0.12, 0).rotation.x = Math.PI / 2;
  const leaves: THREE.Mesh[] = [], flowers: { g: THREE.Group; petals: THREE.Mesh[]; ph: number }[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rnd() * Math.PI * 2, d = 0.6 + rnd() * 2.4;
    const stem = add(g, cyl(0.02, 0.025, 0.3 + rnd() * 0.5, "#4f8a3c", 4), Math.cos(a) * d, 0.2, Math.sin(a) * d);
    const leaf = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.32 + rnd() * 0.2, 9), mat(i % 3 ? "#4f8a3c" : "#6aa55a", { side: THREE.DoubleSide })), stem.position.x, stem.position.y + 0.2 + rnd() * 0.3, stem.position.z);
    leaf.rotation.x = -Math.PI / 2 + (rnd() - 0.5) * 0.4; leaves.push(leaf);
  }
  for (let i = 0; i < 6; i++) {
    const a = i * 1.05 + 0.3, d = 0.9 + (i % 3) * 0.8;
    const f = new THREE.Group(); f.position.set(Math.cos(a) * d, 0.75 + (i % 2) * 0.2, Math.sin(a) * d); g.add(f);
    add(g, cyl(0.02, 0.025, f.position.y, "#4f8a3c", 4), f.position.x, f.position.y / 2, f.position.z);
    const petals: THREE.Mesh[] = [];
    for (let k = 0; k < 6; k++) { const pt = add(f, cone(0.09, 0.28, k % 2 ? "#f4a6b8" : "#f7c6d2", 5), 0, 0.1, 0); pt.rotation.y = (k / 6) * Math.PI * 2; pt.rotation.z = 0.35; petals.push(pt); }
    add(f, ball(0.06, "#e6c04a", 6), 0, 0.16, 0);
    flowers.push({ g: f, petals, ph: i });
  }
  for (let i = 0; i < 4; i++) { const a = i * 1.6 + 0.8; add(g, cyl(0.12, 0.09, 0.1, "#7f9e4a", 8), Math.cos(a) * 2.2, 0.85, Math.sin(a) * 2.2); add(g, cyl(0.02, 0.02, 0.8, "#4f8a3c", 4), Math.cos(a) * 2.2, 0.4, Math.sin(a) * 2.2); }   // seed pods
  // a waterside pavilion on the rim, a couple inside with tea
  const pav = new THREE.Group(); pav.position.set(3.6, 0, -1.2); g.add(pav);
  add(pav, cyl(1.3, 1.4, 0.3, C.stone, 8), 0, 0.15, 0);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; add(pav, cyl(0.07, 0.08, 2.0, C.woodRed, 6), Math.cos(a) * 1.05, 1.3, Math.sin(a) * 1.05); }
  add(pav, pavilionRoof(1.6, 0.9, C.tile, 6), 0, 2.3, 0);
  add(pav, lantern(0.7), 0, 2.0, 1.0);
  const guests = [person("#e9d7b8"), person("#6a7fb0")].map((p, i) => { (p.userData as { sit?: () => void }).sit?.(); const q = add(pav, p, -0.4 + i * 0.8, 0.32, 0.1); q.rotation.y = i ? -1.6 : 1.6; return q as Fig; });
  add(pav, cyl(0.3, 0.3, 0.06, C.wood, 10), 0, 0.85, 0.1); add(pav, ball(0.08, "#f7f2e6", 6), 0, 0.95, 0.1);
  // a dragonfly on a loop
  const fly = new THREE.Group(); g.add(fly);
  add(fly, cyl(0.015, 0.01, 0.35, "#3f6fb0", 4), 0, 0, 0).rotation.z = Math.PI / 2;
  const wings = [-1, 1].map((sd) => add(fly, new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.08), mat("#dfe9f7", { side: THREE.DoubleSide, transparent: true, opacity: 0.7 })), 0, 0.02, sd * 0.1));
  const re = reaction(0.45);
  g.userData.poke = () => { re.poke(); bubble(g, "接天莲叶无穷碧 Lotus to the horizon", 2.4, 1700); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    leaves.forEach((l, i) => { l.rotation.z = Math.sin(t * 0.9 + i) * 0.06 + k * Math.sin(t * 6 + i) * 0.3; });
    flowers.forEach(({ petals, ph }) => { const open = 0.35 + 0.15 * Math.sin(t * 0.4 + ph) + k * 0.9; petals.forEach((pt) => { pt.rotation.z = open; }); });
    fly.position.set(Math.cos(t * 0.5) * 2.2, 1.1 + Math.sin(t * 2.3) * 0.15, Math.sin(t * 0.7) * 1.8); fly.rotation.y = -t * 0.5 + Math.PI / 2;
    wings.forEach((w, i) => { w.rotation.x = Math.sin(t * 40 + i) * 0.5; });
    guests.forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 0.8 + i * 2) * 0.06 - k * 0.15; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 酒坊: a Shaoxing wine shed, urns under red cloth, a fermenting vat and the master pouring. Click: cups up. */
export function wineCellar(): P {
  const g = group();
  add(g, box(5.2, 0.25, 4.0, C.stone), 0, 0.12, 0);
  for (const [x, z] of [[-2.3, -1.7], [2.3, -1.7], [-2.3, 1.7], [2.3, 1.7]] as [number, number][]) add(g, cyl(0.1, 0.11, 2.4, C.woodDark, 6), x, 1.35, z);
  add(g, chineseRoof(6.0, 4.8, 0.8, C.tile, 0.3), 0, 2.6, 0);
  add(g, box(5.0, 2.0, 0.1, C.wall), 0, 1.25, -1.9);
  const urns: THREE.Mesh[] = [];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) {
    const rad = 0.36 + (i % 2) * 0.05, x = -1.8 + i * 0.95 + r * 0.3, z = -1.1 + r * 0.85;
    const u = add(g, ball(rad, r ? "#5c3a28" : "#7a4a2e", 10), x, 0.25 + rad * 0.9, z); u.scale.y = 1.15; urns.push(u);
    add(g, cyl(rad * 0.55, rad * 0.6, 0.08, C.red, 10), x, 0.25 + rad * 1.95, z);                 // red cloth over the mouth
    add(g, new THREE.Mesh(new THREE.TorusGeometry(rad * 0.58, 0.02, 4, 12), mat(C.straw)), x, 0.25 + rad * 1.9, z).rotation.x = Math.PI / 2;
  }
  add(g, cyl(0.6, 0.55, 0.9, "#8a6a3a", 12), 1.8, 0.7, 1.0);                     // the fermenting vat
  add(g, cyl(0.52, 0.52, 0.04, "#e9dcb8", 12), 1.8, 1.14, 1.0);                     // rice cap
  const master = add(g, person("#3f4a5a", { apron: true }), 0.6, 0.25, 1.3) as Fig; master.rotation.y = 0.9;
  const ladle = add(arms(master)!.right, cyl(0.02, 0.02, 0.5, C.wood, 4), 0.02, -0.3, 0.05); ladle.rotation.x = 1.2; add(ladle, cyl(0.07, 0.06, 0.06, C.woodDark, 8), 0, -0.25, 0);
  add(g, cyl(0.2, 0.16, 0.34, "#e0d3b8", 10), -0.6, 0.42, 1.6); add(g, ball(0.06, "#c99a3a", 6), -0.6, 0.62, 1.6);   // a wine pot and cup
  add(g, box(0.5, 0.7, 0.05, "#f3e6c8"), 2.7, 1.8, 1.9);                            // 酒 sign
  add(g, lantern(0.8), -2.3, 2.05, 2.0);
  g.userData.steam = new THREE.Vector3(1.8, 1.3, 1.0);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(master, "绍兴黄酒, 干杯! Shaoxing wine, cheers!", 1.6, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    const up = upper(master); if (up) { up.rotation.x = 0.2 * (1 - k) + Math.sin(t * 1.3) * 0.04; up.rotation.z = k * Math.sin(Math.min(1, k * 2) * Math.PI) * 0.3; }
    urns.forEach((u, i) => { u.scale.y = 1.15 + k * Math.sin(t * 10 + i) * 0.03; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 茶山: tea terraces with pickers, a hilltop pavilion; click and the pickers pluck and the leaves fly. */
export function teaHill(): P {
  const g = group();
  add(g, terrace(4, 3.4, true), 0, 0, 0);
  const pickers = [add(g, person("#6a7fb0", { hat: true }), -1.6, 0.6, 1.8), add(g, person("#e9d7b8", { hat: true }), 1.9, 1.2, -0.4), add(g, person("#7a4a3a", { hat: true }), -0.4, 1.8, -1.6)] as Fig[];
  pickers.forEach((p, i) => { p.rotation.y = i * 2.0; p.scale.setScalar(0.9); add(p, cyl(0.2, 0.16, 0.3, C.straw, 8), 0.35, 0.2, 0.1); });
  add(g, cyl(0.9, 1.0, 0.2, C.stone, 8), 0.7, 2.5, 0.3);
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; add(g, cyl(0.06, 0.07, 1.5, C.woodRed, 6), 0.7 + Math.cos(a) * 0.7, 3.3, 0.3 + Math.sin(a) * 0.7); }
  add(g, pavilionRoof(1.2, 0.7, C.tile, 4), 0.7, 4.1, 0.3);
  const leaves = Array.from({ length: 12 }, () => { const l = add(g, new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.14), mat("#7fcf6a", { side: THREE.DoubleSide })), 0, -1, 0); l.visible = false; return { m: l, t: -1, x: 0, z: 0 }; });
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "明前龙井 Longjing, picked before Qingming", 4.6, 1700); leaves.forEach((l, i) => { const p = pickers[i % 3]; l.t = i * 0.08; l.x = p.position.x; l.z = p.position.z; l.m.position.set(l.x, p.position.y + 0.8, l.z); }); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    pickers.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.x = 0.3 + Math.sin(t * 1.2 + i) * 0.06 + k * Math.sin(t * 8 + i) * 0.2; } const a = arms(p); if (a) { a.right.rotation.x = -0.6 - Math.abs(Math.sin(t * (1 + k * 6) + i)) * 0.5; } });
    leaves.forEach((l) => { if (l.t < 0) { l.m.visible = false; return; } l.t += dt; l.m.visible = true; l.m.position.y += (0.6 - l.t * 0.8) * dt; l.m.position.x = l.x + Math.sin(l.t * 3 + l.z) * 0.25; l.m.rotation.y += dt * 4; if (l.t > 2.2) l.t = -1; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 水乡集市: canal-bank stalls and a moored produce boat. Click: the fishmonger holds up the catch and the fish jump. */
export function riverMarket(): P {
  const g = group();
  // two stalls under cloth awnings, on the bank
  for (const [x, col] of [[-1.5, "#3f6fb0"], [1.3, "#c9a86a"]] as [number, string][]) {
    add(g, box(2.2, 0.8, 1.1, C.wood), x, 0.4, 0);
    for (const dx of [-0.95, 0.95]) add(g, cyl(0.04, 0.04, 2.2, C.woodDark, 5), x + dx, 1.1, -0.5);
    add(g, box(2.5, 0.06, 1.7, col), x, 2.15, -0.1).rotation.x = 0.15;
  }
  add(g, cyl(0.5, 0.42, 0.45, "#7f8a8c", 12), -2.0, 1.02, 0.1); add(g, cyl(0.44, 0.44, 0.04, "#8fc4c9", 12), -2.0, 1.24, 0.1);   // fish tub
  const fishes = [0, 1, 2].map((i) => { const f = add(g, cone(0.05, 0.22, i ? "#8a949c" : "#e07a3a", 5), -2.1 + i * 0.12, 1.28, 0.1 + (i - 1) * 0.1); f.rotation.z = Math.PI / 2; return f; });
  for (let i = 0; i < 5; i++) add(g, ball(0.09, "#a9b7a0", 5), -1.2 + i * 0.12, 0.86, 0.3).scale.set(1.6, 0.4, 0.7);   // shrimp on a tray
  for (let i = 0; i < 6; i++) add(g, ball(0.13, i % 2 ? "#8fc26a" : "#4f8a3c", 6), 0.7 + i * 0.2, 0.9, 0.2).scale.y = 0.7;   // greens
  for (let i = 0; i < 4; i++) add(g, box(0.14, 0.12, 0.14, "#fbf5e8"), 1.5 + (i % 2) * 0.18, 0.86, -0.2 + Math.floor(i / 2) * 0.18);   // tofu
  for (let i = 0; i < 4; i++) add(g, cyl(0.07, 0.06, 0.12, "#e9dcb8", 8), 2.0 + i * 0.16, 0.86, 0.25);   // lotus root slices
  const monger = add(g, person("#3f4a5a", { apron: true }), -1.5, 0, -0.9) as Fig;
  const veg = add(g, person("#e9d7b8", { hat: true }), 1.3, 0, -0.9) as Fig;
  const shopper = add(g, person("#c0392b"), -0.2, 0, 1.4) as Fig; shopper.rotation.y = Math.PI;
  const kid = add(g, person("#e0a52c"), 0.5, 0, 1.6) as Fig; kid.scale.setScalar(0.62); kid.rotation.y = Math.PI;
  // moored boat piled with baskets, on the water in front of the bank
  const bt = new THREE.Group(); bt.position.set(0.4, -0.05, 2.3); g.add(bt);
  add(bt, box(2.4, 0.3, 0.8, C.woodDark), 0, 0.15, 0); add(bt, box(0.4, 0.2, 0.7, C.woodDark), 1.3, 0.3, 0).rotation.z = 0.5; add(bt, box(0.4, 0.2, 0.7, C.woodDark), -1.3, 0.3, 0).rotation.z = -0.5;
  for (let i = 0; i < 3; i++) { add(bt, cyl(0.26, 0.2, 0.3, C.straw, 8), -0.7 + i * 0.7, 0.45, 0); for (let k = 0; k < 4; k++) add(bt, ball(0.09, pick(["#8fc26a", "#e07a3a", "#f2c14e", "#fbf5e8"]), 5), -0.7 + i * 0.7 + (rnd() - 0.5) * 0.25, 0.62, (rnd() - 0.5) * 0.25); }
  const boatman = add(bt, person("#3f6b8f", { hat: true }), 1.0, 0.3, 0) as Fig; boatman.scale.setScalar(0.8); boatman.rotation.y = -1.4;
  add(upper(boatman)!, cyl(0.02, 0.02, 1.8, C.wood, 4), 0.15, 0.2, 0).rotation.z = 0.5;
  add(g, lantern(0.7), -2.5, 2.0, -0.4); add(g, lantern(0.7), 2.4, 2.0, -0.4);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(monger, "新鲜的河虾! Fresh river shrimp!", 1.6, 1500); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    const um = upper(monger); if (um) { um.rotation.x = -k * 0.25; um.rotation.z = Math.sin(t * 1.1) * 0.04 + k * Math.sin(t * 7) * 0.15; }
    const am = arms(monger); if (am) am.right.rotation.x = -0.3 - k * 2.2;
    fishes.forEach((f, i) => { f.position.y = 1.28 + k * Math.abs(Math.sin(t * 9 + i * 2)) * 0.25; f.rotation.z = Math.PI / 2 + k * Math.sin(t * 9 + i * 2) * 0.8; });
    [veg, shopper, kid].forEach((p, i) => { const u = upper(p); if (u) u.rotation.z = Math.sin(t * 0.9 + i * 1.7) * 0.05 + k * Math.sin(t * 5 + i) * 0.1; });
    bt.position.y = -0.05 + Math.sin(t * 1.4) * 0.03; bt.rotation.x = Math.sin(t * 1.1) * 0.03;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 河边饭馆: a two-storey house with a terrace on piles over the canal, tables of diners under lanterns. Click: 干杯. */
export function riversideRestaurant(): P {
  const g = group();
  add(g, house("jiangnan", 3.8, 2.8, 2.2, 2), 0, 0, -1.6);
  // the terrace deck on piles, out over the water
  add(g, box(5.4, 0.16, 3.0, C.wood), 0, 0.55, 1.4);
  for (const x of [-2.4, -0.8, 0.8, 2.4]) add(g, cyl(0.07, 0.08, 0.6, C.woodDark, 6), x, 0.25, 2.7);
  for (const x of [-2.6, 2.6]) add(g, box(0.06, 0.6, 3.0, C.woodDark), x, 0.93, 1.4);
  add(g, box(5.4, 0.06, 0.06, C.woodDark), 0, 1.2, 2.9); for (let i = 0; i < 9; i++) add(g, box(0.05, 0.55, 0.05, C.woodDark), -2.5 + i * 0.62, 0.9, 2.9);
  const diners: Fig[] = [];
  for (const [x, z] of [[-1.5, 1.3], [1.4, 1.5]] as [number, number][]) {
    add(g, cyl(0.62, 0.62, 0.08, C.wood, 12), x, 1.35, z); add(g, cyl(0.08, 0.1, 0.7, C.woodDark, 6), x, 0.98, z);
    add(g, cyl(0.2, 0.18, 0.06, "#f7f2e6", 10), x, 1.42, z); add(g, ball(0.12, "#c9413f", 7), x, 1.48, z).scale.y = 0.5;
    for (let i = 0; i < 3; i++) { const a = i * 2.1 + x; add(g, cyl(0.06, 0.05, 0.05, "#f7f2e6", 8), x + Math.cos(a) * 0.4, 1.42, z + Math.sin(a) * 0.4); }
    for (let i = 0; i < 2; i++) { const a = i * Math.PI + 0.7 + x; const px = x + Math.cos(a) * 1.0, pz = z + Math.sin(a) * 1.0; const p = person(pick(["#3f6b8f", "#6a7fb0", "#e9d7b8", "#d97a8a"])); (p.userData as { sit?: () => void }).sit?.(); add(g, p, px, 0.95, pz).rotation.y = Math.atan2(x - px, z - pz); diners.push(p as Fig); }
  }
  const waiter = add(g, person("#f4f1ea", { apron: true }), 0, 0.63, 0.2) as Fig;
  for (const x of [-2.2, 0, 2.2]) add(g, lantern(0.8), x, 2.6, 2.9);
  add(g, box(0.9, 0.5, 0.05, "#f3e6c8"), 0, 3.6, -0.15);   // 河鲜 sign under the eave
  g.userData.steam = new THREE.Vector3(-1.5, 1.7, 1.3);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(g, "干杯! 来一壶黄酒 Cheers! A pot of yellow wine", 4.2, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    diners.forEach((p, i) => { const u = upper(p); if (u) { u.rotation.z = Math.sin(t * 0.9 + i * 1.7) * 0.06; u.rotation.x = 0.05 - k * 0.2; } const a = arms(p); if (a) a.right.rotation.x = -0.9 - k * Math.sin(Math.min(1, k * 2) * Math.PI) * 1.4; });
    const uw = upper(waiter); if (uw) uw.rotation.x = 0.1 + k * 0.25;
    tickChildren(g)(t, dt);
  };
  return g;
}

/** 江南人家: a home with the kitchen open to the lane, a bamboo steamer on the stove, greens on the board, children helping. */
export function jiangnanHome(): P {
  const g = group();
  add(g, house("jiangnan", 3.8, 2.8, 2.1), 0, 0, -0.8);
  add(g, box(3.2, 0.85, 1.0, C.brick), 0, 0.42, 1.2);                          // brick stove
  const lid = steamerStack(g, -0.9, 0.85, 1.2, 2, 0.36);
  add(g, ball(0.34, C.iron, 10), 0.5, 0.95, 1.15).scale.y = 0.55;               // wok
  add(g, cone(0.15, 0.18, "#ff7a3c", 6), 0.5, 0.75, 1.55);                     // fire in the stove mouth
  add(g, box(1.4, 0.1, 0.7, C.wood), 1.9, 0.75, 1.6); for (const x of [1.3, 2.5]) for (const z of [1.35, 1.85]) add(g, box(0.07, 0.7, 0.07, C.woodDark), x, 0.36, z);
  for (let i = 0; i < 5; i++) add(g, ball(0.09, i % 2 ? "#8fc26a" : "#4f8a3c", 5), 1.5 + i * 0.18, 0.86, 1.6).scale.y = 0.7;   // greens on the board
  add(g, cyl(0.02, 0.02, 0.3, "#8a949c", 4), 2.3, 0.82, 1.5).rotation.z = Math.PI / 2;   // cleaver
  const mother = add(g, person("#7f9e4a", { apron: true }), 1.9, 0, 2.3) as Fig; mother.rotation.y = Math.PI;
  const father = add(g, person("#3f4a5a", { apron: true }), 0.5, 0, 2.0) as Fig; father.rotation.y = Math.PI;
  const kids = [person("#d97a8a"), person("#6a7fb0")].map((p, i) => { const q = add(g, p, -0.8 + i * 0.5, 0, 2.4); q.scale.setScalar(0.6); q.rotation.y = Math.PI + (i ? 0.4 : -0.4); return q as Fig; });
  add(upper(father)!, cyl(0.02, 0.02, 0.45, C.wood, 4), 0.1, 0.2, 0.15).rotation.x = -0.9;   // wok spatula
  add(g, cyl(0.28, 0.24, 0.35, C.straw, 9), -1.7, 0.18, 2.2); for (let i = 0; i < 4; i++) add(g, cone(0.06, 0.3, "#e0d3b8", 5), -1.7 + (i - 1.5) * 0.12, 0.45, 2.2 + (i % 2) * 0.1);   // basket of bamboo shoots
  add(g, lantern(0.8), -1.6, 2.1, 0.7);
  g.userData.steam = new THREE.Vector3(-0.9, 1.5, 1.2);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(mother, "吃饭啦! Dinner's ready!", 1.6, 1500); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => {
    const k = re.step(dt); hopFood(g, k, t, dt); chat(dt);
    lid.position.y = 0.85 + 2 * 0.17 + 0.02 + k * Math.abs(Math.sin(t * 8)) * 0.2;
    const um = upper(mother); if (um) { um.rotation.x = 0.25 + Math.sin(t * 6) * 0.05 * (1 + k * 2); }
    const uf = upper(father); if (uf) { uf.rotation.z = Math.sin(t * 5) * 0.08 * (1 + k * 3); }
    kids.forEach((p, i) => { p.position.y = k * Math.abs(Math.sin(t * 10 + i)) * 0.12; const u = upper(p); if (u) u.rotation.y = Math.sin(t * 1.3 + i) * 0.2; });
    tickChildren(g)(t, dt);
  };
  return g;
}

/** quiet Jiangnan food details, nothing to click */
export function jnDetail(kind: "lotusBasket" | "crabPots" | "wineJars" | "teaBaskets" | "fishRack" | "bambooShoots"): P {
  const g = group();
  const basket = (r: number, x: number, z: number) => add(g, cyl(r, r * 0.8, r * 0.75, C.straw, 9), x, r * 0.375, z);
  switch (kind) {
    case "lotusBasket": { basket(0.4, 0, 0); for (let k = 0; k < 4; k++) add(g, cyl(0.09, 0.09, 0.5, "#e9dcb8", 8), (k - 1.5) * 0.16, 0.45, (k % 2) * 0.15).rotation.z = 0.3; basket(0.3, 0.75, 0.2); for (let k = 0; k < 5; k++) add(g, cyl(0.1, 0.08, 0.08, "#7f9e4a", 8), 0.75 + (rnd() - 0.5) * 0.3, 0.3, 0.2 + (rnd() - 0.5) * 0.3); break; }
    case "crabPots": { for (let i = 0; i < 3; i++) { add(g, cyl(0.3, 0.3, 0.5, C.wood, 8), i * 0.7 - 0.7, 0.25, (i % 2) * 0.3); for (let k = 0; k < 3; k++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.015, 4, 10), mat("#8a949c")), i * 0.7 - 0.7, 0.12 + k * 0.16, (i % 2) * 0.3).rotation.x = Math.PI / 2; } add(g, cyl(0.02, 0.02, 1.4, C.wood, 4), 0.9, 0.7, -0.3); add(g, box(1.0, 0.5, 0.02, "#a9b7a0"), 0.4, 1.0, -0.3); break; }
    case "wineJars": { for (let i = 0; i < 4; i++) { const r = 0.26 + (i % 2) * 0.06; add(g, ball(r, i % 2 ? "#5c3a28" : "#7a4a2e", 9), (i - 1.5) * 0.6, r * 0.9, (i % 2) * 0.25).scale.y = 1.15; add(g, cyl(r * 0.5, r * 0.55, 0.06, C.red, 9), (i - 1.5) * 0.6, r * 1.9, (i % 2) * 0.25); } break; }
    case "teaBaskets": { basket(0.38, 0, 0); basket(0.3, 0.6, 0.35); for (let k = 0; k < 14; k++) add(g, ball(0.05, k % 2 ? "#7fcf6a" : "#4f8a3c", 5), (rnd() - 0.5) * 0.5, 0.3 + (k % 3) * 0.04, (rnd() - 0.5) * 0.5); add(g, cyl(0.9, 0.9, 0.05, "#d9c28a", 16), 1.4, 0.03, -0.3); for (let k = 0; k < 30; k++) add(g, ball(0.04, "#5f9a4a", 4), 1.4 + (rnd() - 0.5) * 1.5, 0.07, -0.3 + (rnd() - 0.5) * 1.5); break; }
    case "fishRack": { for (const x of [-0.8, 0.8]) add(g, box(0.07, 1.8, 0.07, C.woodDark), x, 0.9, 0); add(g, box(1.8, 0.05, 0.05, C.woodDark), 0, 1.78, 0); for (let i = 0; i < 5; i++) { const f = add(g, cone(0.07, 0.4, "#c9c0a8", 5), -0.6 + i * 0.3, 1.5, 0); f.rotation.x = Math.PI; f.scale.z = 0.4; } break; }
    case "bambooShoots": { basket(0.36, 0, 0); for (let k = 0; k < 6; k++) add(g, cone(0.07, 0.36, "#e0d3b8", 5), (rnd() - 0.5) * 0.4, 0.4, (rnd() - 0.5) * 0.4).rotation.z = (rnd() - 0.5) * 0.5; for (let k = 0; k < 3; k++) add(g, cyl(0.03, 0.03, 1.6, "#8fb86a", 5), 0.7 + k * 0.2, 0.8, -0.4 + k * 0.2); break; }
  }
  return g;
}

/** 笋: a bamboo clump with spring shoots breaking the soil, a digger with a hoe and a basket */
export function bambooShootClump(): P {
  const g = group();
  add(g, cyl(1.5, 1.6, 0.1, "#7a5a3a", 14), 0, 0.05, 0);
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, r = 0.5 + (i % 2) * 0.5; const st = add(g, cyl(0.05, 0.06, 3.2 + (i % 3) * 0.5, i % 2 ? "#8fbf6e" : "#6fae4f", 6), Math.cos(a) * r, 1.7, Math.sin(a) * r); st.rotation.z = (rnd() - 0.5) * 0.12; for (let k = 0; k < 3; k++) add(g, cone(0.2, 0.4, "#6fae4f", 5), Math.cos(a) * r + (k - 1) * 0.2, 2.4 + k * 0.5, Math.sin(a) * r).rotation.z = (k - 1) * 0.9; }
  const shoots = [[0.9, 1.4], [1.5, 0.7], [0.2, 1.7], [-1.4, 1.1]].map(([x, z]) => add(g, cone(0.14, 0.5, "#c9a86a", 6), x, 0.3, z));
  add(g, cyl(0.28, 0.22, 0.3, C.straw, 9), 2.0, 0.15, -0.4); add(g, cone(0.12, 0.4, "#c9a86a", 6), 2.0, 0.45, -0.4).rotation.z = 0.9;
  const digger = add(g, person("#2f5d3f", { hat: true }), 1.6, 0, 1.6) as Fig; digger.rotation.y = Math.PI * 1.2;
  add(g, cyl(0.02, 0.025, 1.1, C.woodDark, 4), 1.8, 0.7, 1.9).rotation.z = 0.6;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(digger, "春笋 Spring shoots, dug before the sun finds them", 1.7, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => { const k = re.step(dt); hopFood(g, k, t, dt); chat(dt); shoots.forEach((sh, i) => { sh.position.y = 0.3 + k * Math.abs(Math.sin(t * 5 + i)) * 0.2; }); const u = upper(digger); if (u) u.rotation.x = 0.3 + Math.sin(t * 2.2) * 0.15 * (1 + k); tickChildren(g)(t, dt); };
  return g;
}

/** 火腿: Jinhua hams hanging under an eave to cure, salt in a crock, the master pressing one with his thumb */
export function hamRack(): P {
  const g = group();
  add(g, house("jiangnan", 3.0, 2.2, 2.0), 0, 0, -0.8);
  add(g, box(3.2, 0.06, 0.06, C.woodDark), 0, 2.05, 0.6);
  const hams = Array.from({ length: 5 }, (_, i) => { const h = new THREE.Group(); h.position.set(-1.2 + i * 0.6, 2.05, 0.6); g.add(h); add(h, cyl(0.01, 0.01, 0.25, "#c9a86a", 3), 0, -0.12, 0); const body = add(h, ball(0.17, i % 2 ? "#8a3a2e" : "#a04a3a", 8), 0, -0.6, 0); body.scale.set(0.8, 1.5, 0.55); add(h, cyl(0.05, 0.07, 0.3, "#d9b88a", 6), 0, -0.3, 0); return h; });
  add(g, cyl(0.24, 0.2, 0.4, "#5c3a28", 10), 1.6, 0.2, 0.9); add(g, cyl(0.2, 0.2, 0.05, "#f3ece0", 10), 1.6, 0.42, 0.9);   // the salt crock
  const master = add(g, person("#6a7fb0", { apron: true }), -0.6, 0, 1.4) as Fig; master.rotation.y = Math.PI;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(master, "金华火腿 Salted in winter, hung till autumn", 1.9, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => { const k = re.step(dt); hopFood(g, k, t, dt); chat(dt); hams.forEach((h, i) => { h.rotation.z = Math.sin(t * 1.1 + i) * 0.05 * (1 + k * 4); }); const a = arms(master); if (a) a.right.rotation.x = -1.4 - k * Math.sin(Math.min(1, k * 2) * Math.PI) * 0.6; tickChildren(g)(t, dt); };
  return g;
}

/** 桂花: an osmanthus tree in flower, tiny gold blossoms, a cloth spread to catch them for the sugar */
export function osmanthusTree(): P {
  const g = group();
  add(g, cyl(0.14, 0.18, 1.5, "#5a4a3a", 7), 0, 0.75, 0);
  const crown = add(g, ball(1.2, "#4f7d4a", 9), 0, 2.2, 0); crown.scale.y = 0.85;
  for (let i = 0; i < 60; i++) { const a = rnd() * Math.PI * 2, b = rnd() * Math.PI, r = 1.15; add(g, ball(0.04, i % 3 ? "#f4c542" : "#f9d86a", 4), Math.cos(a) * Math.sin(b) * r, 2.2 + Math.cos(b) * r * 0.85, Math.sin(a) * Math.sin(b) * r); }
  add(g, box(2.6, 0.02, 2.2, "#f3ece0"), 0, 0.02, 0.3); for (let i = 0; i < 40; i++) add(g, ball(0.03, "#f4c542", 4), (rnd() - 0.5) * 2.4, 0.04, 0.3 + (rnd() - 0.5) * 2.0);
  add(g, cyl(0.16, 0.14, 0.24, "#f3ece0", 10), 1.6, 0.14, -0.9); add(g, cyl(0.12, 0.12, 0.03, "#d9a05a", 10), 1.6, 0.27, -0.9);   // osmanthus sugar jar
  const falling: { m: THREE.Object3D; t: number; x: number }[] = [];
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); for (let i = 0; i < 14; i++) falling.push({ m: add(g, ball(0.035, "#f4c542", 4), (rnd() - 0.5) * 2.2, 2.0 + rnd() * 0.6, (rnd() - 0.5) * 2.0), t: rnd() * 0.5, x: rnd() * 6 }); bubble(g, "桂花糖 Osmanthus for the sugar, the wine and the cakes", 3.4, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => { const k = re.step(dt); hopFood(g, k, t, dt); chat(dt); crown.rotation.z = Math.sin(t * 0.8) * 0.02 + k * Math.sin(t * 9) * 0.05; for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.t += dt; f.m.position.y -= dt * 0.45; f.m.position.x += Math.sin(f.t * 3 + f.x) * dt * 0.3; if (f.m.position.y < 0.04) { g.remove(f.m); falling.splice(i, 1); } } };
  return g;
}

/** 茭白荸荠: a wet plot of water bamboo and water chestnuts, a woman wading with a basket of the white stems */
export function waterBamboo(): P {
  const g = group();
  add(g, box(3.6, 0.1, 2.6, "#5e8a86"), 0, 0.03, 0); add(g, box(3.8, 0.14, 0.2, "#7a5a3a"), 0, 0.07, -1.35); add(g, box(3.8, 0.14, 0.2, "#7a5a3a"), 0, 0.07, 1.35); add(g, box(0.2, 0.14, 2.8, "#7a5a3a"), -1.85, 0.07, 0); add(g, box(0.2, 0.14, 2.8, "#7a5a3a"), 1.85, 0.07, 0);
  const stems: THREE.Object3D[] = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const x = -1.4 + i * 0.47, z = -0.8 + r * 0.8; add(g, cyl(0.05, 0.06, 0.5, "#f3ece0", 6), x, 0.3, z); for (let k = 0; k < 4; k++) { const l = add(g, box(0.06, 1.4, 0.01, k % 2 ? "#6fae4f" : "#8fbf6e"), x, 1.1, z); l.rotation.set((k - 1.5) * 0.18, k * 1.6, 0); stems.push(l); } }
  for (let i = 0; i < 10; i++) add(g, ball(0.06, "#4a2a1e", 6), -1.5 + i * 0.33, 0.1, 1.05).scale.y = 0.6;   // water chestnuts on the bank
  const woman = add(g, person("#c0392b", { hat: true }), 1.4, 0.1, 0.3) as Fig; woman.rotation.y = -Math.PI / 2;
  add(g, cyl(0.24, 0.2, 0.28, C.straw, 9), 1.6, 0.25, 0.9); for (let i = 0; i < 4; i++) add(g, cyl(0.04, 0.05, 0.5, "#f3ece0", 6), 1.6 + (rnd() - 0.5) * 0.2, 0.5, 0.9 + (rnd() - 0.5) * 0.2).rotation.z = 0.4 + rnd() * 0.6;
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); bubble(woman, "茭白 Water bamboo: sweet, white, stir-fried tonight", 1.7, 1600); };
  const chat = ambientChat(g, JN_LINES);
  g.userData.tick = (t, dt) => { const k = re.step(dt); hopFood(g, k, t, dt); chat(dt); stems.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.3 + i * 0.4) * 0.08 * (1 + k * 3); }); const u = upper(woman); if (u) u.rotation.x = 0.25 + Math.sin(t * 1.8) * 0.1 * (1 + k); tickChildren(g)(t, dt); };
  return g;
}

export const JN_PROPS: Record<string, () => P> = { baoShop, crabPond, lotusPond, wineCellar, teaHill, riverMarket, riversideRestaurant, jiangnanHome, bambooShootClump, hamRack, osmanthusTree, waterBamboo };
