/** China: the layout of the first world. Terrain, villages, farms, life. Objects come from graph.ts. */
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { OBJECTS, type EnrichedRecipe } from "./graph";
import { PROPS, mat, mountain, house, tree, terrace, bridge, woodenBridge, boat, signpost, chicken, butterfly, temple, pagoda, gate, lanternString, dragon, person, fence, pond, cow, goat, path, add, birds, crane, coop, panda, fish, C, type P } from "./props";
import { buildWorld, addWater, type Diorama, type LayoutCtx } from "./worldkit";

void CSS2DObject; void signpost;

export function buildChina(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "china", W: 76, D: 56, ground: "#8cb86b", plinth: "#6e4a2c", recipes, objects: OBJECTS, props: PROPS,
    small: /^(cow|pig|chicken|pepperTree|jars)$/, fallbackPlace: "wok",
    layout: layoutChina,
  });
}

function layoutChina({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(-18, 6, 18, 15, "#82b263", 0.2);
  tint(20, 8, 16, 12, "#9cc484", -0.3);
  tint(2, -16, 18, 8, "#c2bd7a");
  tint(-27, 16, 6, 5, "#7aab5c");

  // ---------- river & paths ----------
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-38, TOP + 0.03, 4), new THREE.Vector3(-28, TOP + 0.03, 8), new THREE.Vector3(-14, TOP + 0.03, 9),
    new THREE.Vector3(-2, TOP + 0.03, 6), new THREE.Vector3(10, TOP + 0.03, 8), new THREE.Vector3(20, TOP + 0.03, 3), new THREE.Vector3(30, TOP + 0.03, 6), new THREE.Vector3(38, TOP + 0.03, 4),
  ]);
  addWater({ group, tickers, place, tint, TOP }, curve, 3.4);
  // reeds and stones along the bank
  for (let i = 0; i < 40; i++) { const u = i / 40; const p = curve.getPointAt(u), tg = curve.getTangentAt(u); const side = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(2.3 * (i % 2 ? 1 : -1)); const x = p.x + side.x, z = p.z + side.z; if (Math.abs(x) > 35) continue; if (i % 3 === 0) add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(0.25 + (i % 4) * 0.08, 0), mat(C.stone)), x, 0.1, z); else for (let k = 0; k < 3; k++) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.8, 4), mat("#6fae4f")), x + (k - 1) * 0.15, 0.4, z + (k % 2) * 0.15); }
  // village street + lanes
  group.add(path([[-22, -6], [-14, -6.5], [-6, -5.5], [2, -5], [10, -6], [18, -8]], 2.6));
  group.add(path([[2, -5], [3, -9], [4, -12.5]], 1.6));
  group.add(path([[2, -5], [3, 0], [3, 3]], 1.6));
  group.add(path([[-6, -5.5], [-7, 1], [-7.5, 3]], 1.2));
  group.add(path([[18, -8], [22, -4], [24, 0]], 1.4));
  group.add(path([[-22, -6], [-26, -1], [-29, 6]], 1.2));

  // ---------- mountains: a western wall and a northern backdrop ----------
  const peaks: [number, number, number, number, boolean][] = [
    [-35, -22, 5.5, 12, false], [-33, -9, 4.5, 9, true], [-36, 12, 5, 12, false], [-35, 26.5, 3.2, 6, true],
    [-27, -25, 4, 9, true], [-18, -26, 3.4, 7, false], [-8, -27, 4, 9, true], [2, -27, 3.2, 6, false], [12, -27, 3.8, 8, true], [22, -26, 3, 6, false],
    [31, -23, 3.6, 7, true], [36, -14, 3.2, 6, false],
  ];
  peaks.forEach(([x, z, r, h, dark], i) => { const m = place(mountain(r * (0.9 + (i % 3) * 0.1), h * (0.85 + ((i * 7) % 5) * 0.08), dark), x, z, i * 1.7); m.scale.x *= 1 + (i % 2) * 0.25; });
  // pagoda on a hill in the north-west, temple with plaza north-centre, gate at the head of the street
  const hill = add(group, new THREE.Mesh(new THREE.CylinderGeometry(4.5, 6, 2.2, 12), mat("#7aab5c")), -24, 1.1, -19);
  void hill;
  place(pagoda(5), -24, -19).position.y = 2.2;
  for (let i = 0; i < 6; i++) place(tree("pine", 1.0), -24 + Math.cos(i * 1.05) * 6.5, -19 + Math.sin(i * 1.05) * 5, i);
  add(group, new THREE.Mesh(new THREE.CircleGeometry(7, 20), mat("#c9c0a8")), 3, TOP + 0.02, -17).rotation.x = -Math.PI / 2;
  place(temple(), 3, -20);
  place(gate(), 3, -12.5);
  for (const x of [-4, 10]) place(tree("blossom", 1.2), x, -21, x);
  for (const x of [-6, 12]) place(tree("ginkgo", 1.1), x, -15, x);
  // birds over the mountains, cranes in the paddies, and a dragon dance in the square
  place(birds(7, 14, 15), -22, -14);
  place(birds(5, 9, 11), 26, 6);
  place(crane(), 22, 17, 0.6); place(crane(), 27.5, 12.5, -1.2).scale.setScalar(0.9);
  place(dragon({ radius: 2.6, height: 2.3, speed: 0.4, segments: 14, poles: true }), 5, -9.2);

  // ---------- villages ----------
  const houses: [("sichuan" | "jiangnan" | "northern"), number, number, number, number, number, number, number][] = [
    // style, x, z, rot, w, d, h, storeys
    ["sichuan", -20, -12, 0.25, 3.2, 2.6, 1.9, 2], ["sichuan", -24, -11, -0.2, 2.8, 2.4, 1.7, 1], ["sichuan", -12, -10.5, 0.15, 3.6, 2.6, 1.9, 1],
    ["sichuan", -16, -1.5, 0.5, 2.6, 2.2, 1.6, 1], ["sichuan", -12, 3.8, -0.3, 3.2, 2.6, 1.9, 2],
    ["jiangnan", 15, 11, -0.4, 3.2, 2.6, 2.1, 2], ["jiangnan", 20, 12.5, 0.2, 2.8, 2.4, 1.9, 1], ["jiangnan", 27, 11, -0.3, 3.4, 2.6, 2.2, 2],
    ["jiangnan", 30, -3, 0.5, 3.0, 2.4, 2.0, 1], ["jiangnan", 19, -5, -0.2, 3.2, 2.6, 2.0, 2], ["jiangnan", 33, 3, 0.9, 2.6, 2.2, 1.8, 1],
    ["northern", 22, -19, 0.05, 3.8, 2.8, 1.7, 1], ["northern", 27, -16, -0.1, 2.8, 2.4, 1.6, 1], ["northern", 18, -15, 0.2, 3.0, 2.4, 1.6, 1],
  ];
  for (const [style, x, z, rot, w, d, h, st] of houses) place(house(style, w, d, h, st), x, z, rot);
  // courtyard wall for the northern compound
  for (const [x, z, rot, len] of [[22.5, -13, 0, 12], [16.5, -17, Math.PI / 2, 8], [28.5, -17, Math.PI / 2, 8]] as [number, number, number, number][]) { add(group, new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 0.3), mat(C.brick)), x, 0.45, z).rotation.y = rot; }
  // lantern strings across the street
  for (const x of [-18, -8, 4]) place(lanternString(6, 4), x, -6).position.y = 3.2;
  for (const x of [-18, -8, 4]) for (const s of [-1, 1]) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.3, 6), mat(C.woodRed)), x + s * 3, 1.65, -6);
  // water town: bridges, boats, willows, steps to the water
  // bridges sit on the river and span it perpendicular to the flow
  const bridgeAt = (b: THREE.Object3D, targetX: number) => {
    let best = 0, bestD = Infinity;
    for (let i = 0; i <= 200; i++) { const d = Math.abs(curve.getPointAt(i / 200).x - targetX); if (d < bestD) { bestD = d; best = i / 200; } }
    const p = curve.getPointAt(best), tg = curve.getTangentAt(best);
    place(b, p.x, p.z, -Math.atan2(tg.z, tg.x) + Math.PI / 2);
  };
  bridgeAt(bridge(6.4), 20);
  bridgeAt(woodenBridge(5.6), -14);
  const theBoat = boat(); place(theBoat, 12, 7, 0.4);
  const boat2 = boat(); place(boat2, -30, 8, 0.2);
  for (let i = 0; i < 6; i++) place(tree("willow", 1.0), 13 + i * 4, 10.5 - (i % 2) * 1.2, i);
  for (let i = 0; i < 4; i++) place(tree("blossom", 0.9), 26 + i * 2.5, -8 + (i % 2) * 2, i);
  for (let i = 0; i < 6; i++) place(tree("bamboo", 0.85), -31.5 + i * 1.4, 4.8 + (i % 2) * 0.7, i);
  // panda grove: a bamboo thicket on the south bank below the farms, where the camera can actually see it
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, d = 2.4 + (i % 3) * 1.0; place(tree("bamboo", 1.1 + (i % 2) * 0.35), -13 + Math.cos(a) * d, 22.5 + Math.sin(a) * d * 0.75, i); }
  place(panda(), -13.4, 22, 0.5); place(panda(), -11.4, 23.6, -1.1).scale.setScalar(0.8);
  place(panda(), -15.2, 23.8, 2.2).scale.setScalar(0.7);
  for (let i = 0; i < 4; i++) place(tree("pine", 1.1), -30 + i * 1.5, -17 - (i % 2) * 1.5, i);
  for (let i = 0; i < 5; i++) place(tree("persimmon", 1.0), 5 + i * 2.6, 17 + (i % 2) * 2, i);
  for (let i = 0; i < 4; i++) place(tree("round", 1.0), 29 + i * 1.8, 18 - (i % 2) * 2, i);
  for (let i = 0; i < 3; i++) place(tree("ginkgo", 0.9), 14 + i * 3, 19, i);

  // ---------- farms ----------
  place(terrace(4, 4.2, true), -30, 23.5, 0.3);
  place(terrace(3, 3.0, false), -21.5, 24, -0.4);
  // pasture with fence and animals
  for (const [x, z, rot, len] of [[-27, 12, 0, 9], [-27, 20, 0, 9], [-31.5, 16, Math.PI / 2, 8], [-22.5, 16, Math.PI / 2, 8]] as [number, number, number, number][]) place(fence(len), x, z, rot);
  place(cow(false), -29.5, 18.3, 2.4);   // second cow keeps to the back of the pasture, clear of the clickable one
  place(goat(), -24.5, 13.5, 1.2); place(goat(), -24, 18.5, -0.6);
  for (const [x, z, rot, len] of [[-18.5, 15, 0, 5], [-18.5, 19, 0, 5], [-21, 17, Math.PI / 2, 4], [-16, 17, Math.PI / 2, 4]] as [number, number, number, number][]) place(fence(len), x, z, rot);
  place(PROPS.pig(), -17, 18.5, 2.0).scale.setScalar(0.8);
  // chicken coop
  place(coop(), -12, 14, 0.3);
  for (let i = 0; i < 4; i++) place(chicken(i % 2 ? "#c9822b" : C.white), -11 + Math.cos(i * 1.6) * 1.6, 16 + Math.sin(i * 1.6) * 1.4, i);
  place(pond(), -1, 15);
  // paddies with a water buffalo
  place(cow(true), 29, 19, -0.7);
  // ambient farmers carrying produce to market
  const walkers = [person("#3f6b8f", { pole: true }), person("#c0392b", { hat: true }), person("#e0a52c"), person("#2f5d3f", { pole: true })];
  walkers.forEach((w) => group.add(w));
  // the loop follows the street: east along its north edge, back along the south edge
  const walkPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-22, 0, -6.6), new THREE.Vector3(-14, 0, -7.0), new THREE.Vector3(-6, 0, -6.2), new THREE.Vector3(2, 0, -5.8), new THREE.Vector3(10, 0, -6.8), new THREE.Vector3(16, 0, -8.6), new THREE.Vector3(12, 0, -6.0), new THREE.Vector3(4, 0, -4.6), new THREE.Vector3(-4, 0, -4.7), new THREE.Vector3(-12, 0, -5.6), new THREE.Vector3(-20, 0, -5.4)], true);
  tickers.push((t) => walkers.forEach((w, i) => { const u = ((t * 0.012 + i * 0.25) % 1); const p = walkPath.getPointAt(u), n = walkPath.getPointAt((u + 0.005) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));

  // ---------- Jiangnan life: canal-side strollers over the bridge, a fisherman, washing, kids, laundry ----------
  const jnWalkers = [person("#6a7fb0"), person("#e9d7b8", { hat: true }), person("#c0392b", { pole: true }), person("#2f5d3f"), person("#3f6b8f")];
  jnWalkers.forEach((w) => group.add(w));
  const bridgeCenter = new THREE.Vector3(20, 0, 3);
  const jnPath = new THREE.CatmullRomCurve3([
    // north bank: behind the red-braising kitchen and around the eastern houses, never through a wall
    new THREE.Vector3(20.6, 0, -0.6), new THREE.Vector3(21.8, 0, -7.6), new THREE.Vector3(26, 0, -8.6), new THREE.Vector3(30.6, 0, -6.2), new THREE.Vector3(32.6, 0, -2),
    new THREE.Vector3(31.2, 0, 1.2), new THREE.Vector3(27, 0, 0.9), new THREE.Vector3(23.5, 0, 0.9), new THREE.Vector3(20.4, 0, -0.3),
    // over the bridge and along the south-bank lane
    new THREE.Vector3(20.2, 0, 3), new THREE.Vector3(19.8, 0, 6.4), new THREE.Vector3(17, 0, 9.4), new THREE.Vector3(13, 0, 13.2), new THREE.Vector3(17.5, 0, 14.4), new THREE.Vector3(23, 0, 12.6),
    new THREE.Vector3(20.8, 0, 7.2), new THREE.Vector3(20.4, 0, 3.2),
  ], true);
  tickers.push((t) => jnWalkers.forEach((w, i) => {
    const u = (t * 0.009 + i * 0.2) % 1;
    const p = jnPath.getPointAt(u), n = jnPath.getPointAt((u + 0.004) % 1);
    const d = Math.hypot(p.x - bridgeCenter.x, p.z - bridgeCenter.z);
    // deck is flat across the span, then the stepped ramps bring you down to the bank
    const y = d < 3.6 ? 1.15 : d < 5.4 ? 1.15 * (1 - (d - 3.6) / 1.8) : 0;
    w.position.set(p.x, y, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z);
    (w.userData as { walk?: (t: number) => void }).walk?.(t + i);
  }));
  // fisherman on the bank
  const fisher = place(person("#4a3a32", { hat: true }), 27.5, 4.2, 2.6);
  const rod = add(fisher, new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 2.0, 4), mat("#5a3a22")), 0.2, 1.0, 0.5); rod.rotation.x = -1.1;
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.2, 3), mat("#e8e8e8")), 27.9, 0.75, 6.2);
  // woman washing at the river steps
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.9), mat(C.stone)), 16.5, 0.12, 8.6);
  const washer = person("#d97a8a"); (washer.userData as { sit?: () => void }).sit?.(); place(washer, 16.5, 8.2, Math.PI).position.y = 0.05;
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.25, 9), mat("#c9b16a")), 17.2, 0.37, 8.4);
  // kids under the willows and grandparents on a bench
  for (const [x, z, c] of [[12.5, 12.8, "#e0a52c"], [13.4, 13.4, "#3f6b8f"]] as [number, number, string][]) place(person(c), x, z, x).scale.setScalar(0.62);
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.45), mat(C.wood)), 24, 0.45, 9.6);
  for (const x of [23.6, 24.4]) { const gp = person(x < 24 ? "#7a4a3a" : "#5a5a66"); (gp.userData as { sit?: () => void }).sit?.(); place(gp, x, 9.4, 0.05).position.y = 0.08; }
  // laundry line between the water-town houses
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 5.2, 4), mat(C.woodDark)); line.rotation.z = Math.PI / 2; line.position.set(17.5, 2.3, 13.6); group.add(line);
  const cloths = ["#c0392b", "#3f6b8f", "#f4f1ea", "#e0a52c", "#6a7fb0"].map((c, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.9, 1, 3), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 1 })); m.geometry.translate(0, -0.45, 0); m.position.set(15.4 + i * 1.05, 2.3, 13.6); m.castShadow = true; group.add(m); return m; });
  tickers.push((t) => cloths.forEach((m, i) => { m.rotation.x = Math.sin(t * 2.2 + i * 1.3) * 0.25 + 0.15; }));
  // a couple in the northern courtyard
  place(person("#e9d7b8", { hat: true }), 21, -15.5, 0.6); place(person("#7a4a3a"), 25, -14.5, -1.8);

  // ---------- koi in the river: each fish steers smoothly toward a drifting point ahead of it, bending as it swims ----------
  type Koi = { g: THREE.Group; u: number; side: number; targetSide: number; speed: number; heading: number; ph: number; leapT: number; nextLeap: number };
  const kois: Koi[] = [];
  const palette: [string, string][] = [["#e8823f", "#f6f1e6"], ["#f1b24a", "#f6f1e6"], ["#d94f3a", "#f6f1e6"], ["#f6f1e6", "#e8823f"], ["#8a949c", "#c9d0d4"], ["#e8823f", "#2a2a2e"], ["#f1b24a", "#e8823f"], ["#d94f3a", "#f1b24a"], ["#f6f1e6", "#d94f3a"]];
  palette.forEach(([c1, c2], i) => {
    const f = fish(c1, c2, 0.36 + (i % 3) * 0.06);   // small: a koi the size of a person's hand
    group.add(f);
    kois.push({ g: f, u: (i / palette.length + Math.random() * 0.06) % 1, side: (Math.random() - 0.5) * 1.4, targetSide: (Math.random() - 0.5) * 1.4, speed: 0.003 + Math.random() * 0.003, heading: 0, ph: Math.random() * 6, leapT: -1, nextLeap: 20 + Math.random() * 40 });
  });
  const splashes: { m: THREE.Mesh; life: number }[] = [];
  const splashMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7, depthWrite: false });
  tickers.push((t, dt) => {
    for (const k of kois) {
      // drift: pick a new lane now and then and ease toward it, so the path meanders instead of running on rails
      if (Math.random() < dt * 0.15) k.targetSide = (Math.random() - 0.5) * 1.6;
      k.side += (k.targetSide - k.side) * Math.min(1, dt * 0.6);
      const glide = k.leapT >= 0 ? 1.6 : 1 + Math.sin(t * 0.5 + k.ph) * 0.2;      // a slow cruise with gentle speed changes
      k.u = (k.u + dt * k.speed * glide) % 1;
      const p = curve.getPointAt(k.u), tg = curve.getTangentAt(k.u);
      const sideV = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(k.side);
      const ahead = curve.getPointAt((k.u + 0.01) % 1).add(new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(k.targetSide));
      const want = Math.atan2(ahead.x - (p.x + sideV.x), ahead.z - (p.z + sideV.z));
      let d = want - k.heading; d = Math.atan2(Math.sin(d), Math.cos(d));
      k.heading += d * Math.min(1, dt * 1.6);                                          // smooth, unhurried turning
      // a leap every so often: up, over, and back in with a splash
      k.nextLeap -= dt;
      if (k.nextLeap <= 0 && k.leapT < 0) { k.leapT = 0; k.nextLeap = 30 + Math.random() * 50; }
      let y = 0.0 + Math.sin(t * 1.3 + k.ph) * 0.012, pitch = 0, roll = 0;   // just under the surface (the ground is solid below)
      if (k.leapT >= 0) {
        k.leapT += dt;
        const a = k.leapT / 1.1;
        if (a >= 1) { k.leapT = -1; const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 20), splashMat.clone()); ring.rotation.x = -Math.PI / 2; ring.position.set(p.x + sideV.x, 0.05, p.z + sideV.z); group.add(ring); splashes.push({ m: ring, life: 0 }); }
        else { y = Math.sin(a * Math.PI) * 0.5; pitch = (a < 0.5 ? -0.9 : 0.9) * Math.sin(a * Math.PI); roll = Math.sin(a * Math.PI * 2) * 0.6; if (a < 0.05 && k.leapT < dt * 1.5) { const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 20), splashMat.clone()); ring.rotation.x = -Math.PI / 2; ring.position.set(p.x + sideV.x, 0.05, p.z + sideV.z); group.add(ring); splashes.push({ m: ring, life: 0 }); } }
      }
      k.g.position.set(p.x + sideV.x, TOP + y, p.z + sideV.z);
      k.g.rotation.set(0, k.heading - Math.PI / 2, 0);
      k.g.rotateZ(pitch); k.g.rotateX(roll);
      (k.g.userData as { swim?: (t: number, k: number) => void }).swim?.(t + k.ph, glide);
    }
    for (let i = splashes.length - 1; i >= 0; i--) { const sp = splashes[i]; sp.life += dt; const s2 = 1 + sp.life * 6; sp.m.scale.set(s2, s2, 1); (sp.m.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - sp.life / 0.9); if (sp.life > 0.9) { group.remove(sp.m); splashes.splice(i, 1); } }
  });

  // butterflies and boats
  const flies = [[-7, 15], [25, 15], [-19, 1], [3, -15]].map(([x, z], i) => { const b = butterfly(["#f2b64d", "#f4a6b8", "#ffffff", "#f2b64d"][i]); group.add(b); tickers.push(b.userData.tick!); return { b, x, z, ph: i * 2 }; });
  tickers.push((t) => flies.forEach(({ b, x, z, ph }) => { b.position.set(x + Math.sin(t * 0.6 + ph) * 2.4, TOP + 1.8 + Math.sin(t * 1.7 + ph) * 0.4, z + Math.cos(t * 0.45 + ph) * 2); b.rotation.y = t * 0.6 + ph; }));
  tickers.push((t) => {
    const drift = (b: THREE.Object3D, u0: number, span: number, ph: number) => { const u = u0 + span * (0.5 + 0.5 * Math.sin(t * 0.05 + ph)); const p = curve.getPointAt(u), n = curve.getPointAt(Math.min(1, u + 0.01)); b.position.set(p.x, TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) + Math.PI / 2; };
    drift(theBoat, 0.5, 0.3, 0); drift(boat2, 0.05, 0.2, 2);
  });
}
