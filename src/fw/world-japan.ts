/** Japan: Hokkaido's port and fields in the north-west, Kyoto on the Kamo river in the south-west, Fuji and its lake in the middle with the shinkansen looping round, Tokyo on the Pacific in the north-east. Objects come from graph.ts. */
import * as THREE from "three";
import { JAPAN_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, path, birds, tree } from "./props";
import { JAPAN_PROPS, tokyoBlock, vendingMachine, machiya, sakura, stoneLantern, fishingBoat, shinkansenCar, local, JP } from "./props-japan";
import { car } from "./props-namerica";
import { buildWorld, riverGeometry, seaWater, freshWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildJapan(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "japan", W: 76, D: 56, ground: "#8fb56a", plinth: "#5a4a3a", recipes, objects: JAPAN_OBJECTS, props: JAPAN_PROPS,
    small: /^(sakura|wheatJp|dashi|sesameGinger|umami)$/, fallbackPlace: "ramen",
    layout: layoutJapan,
  });
}

function layoutJapan({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(15, -18, 13, 12, "#a8a8ac", 0.06);        // Tokyo's paving
  tint(-24, 12, 12, 13, "#b9c39a", 0.04);        // Kyoto's gravel gardens
  tint(-20, -17, 12, 11, "#e9ecec", 0.08);       // Hokkaido's late snow
  tint(4, 10, 8, 8, "#7aa060", -0.03);           // the forest at Fuji's foot

  // ---------- water: the Pacific east and south, a bay in Hokkaido, the Kamo river, the lake, the pond ----------
  const sea = seaWater(), kamo = freshWater(), lake = freshWater(), pond = freshWater(), spring = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; kamo.uniforms.uTime.value = t; lake.uniforms.uTime.value = t; pond.uniforms.uTime.value = t; spring.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.35, wz = edge ? z : z + Math.cos(i * 1.9) * 0.35; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const coast = (pts: [number, number][], sign: number, d: number) => pts.map(([x, z], i) => { const [px, pz] = pts[(i + pts.length - 1) % pts.length], [nx, nz] = pts[(i + 1) % pts.length]; const e0 = [x - px, z - pz], e1 = [nx - x, nz - z]; const l0 = Math.hypot(e0[0], e0[1]) || 1, l1 = Math.hypot(e1[0], e1[1]) || 1; let ox = (-e0[1] / l0 - e1[1] / l1), oz = (e0[0] / l0 + e1[0] / l1); const l = Math.hypot(ox, oz) || 1; ox = (ox / l) * d * sign; oz = (oz / l) * d * sign; if (Math.abs(x) >= 38) ox = 0; if (Math.abs(z) >= 28) oz = 0; return [x + ox, z + oz] as [number, number]; });
  const pacific: [number, number][] = [[30.5, -28], [38, -28], [38, 28], [-10, 28], [-10, 26.5], [-5, 25.4], [0, 24.6], [5, 23.6], [10, 22.6], [15, 21.4], [20, 20], [24, 17.6], [27, 13.5], [28.8, 8], [29.6, 2], [30, -4], [29.4, -10], [29.6, -16], [30.2, -22]];
  const bay: [number, number][] = [[-38, -28], [-32, -28], [-31.2, -24], [-29.4, -20.5], [-28, -17], [-27.6, -13.5], [-28.6, -10.2], [-31, -7.6], [-34.5, -6.4], [-38, -6]];
  for (const pts of [pacific, bay]) {
    const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(coast(pts, -1, 1.2))), mat("#e6dfc4")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
    const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(pts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  }
  // the Kamo river, north edge to the south sea through Kyoto
  const river = new THREE.CatmullRomCurve3([new THREE.Vector3(-12, 0, -28), new THREE.Vector3(-12, 0, -26.5), new THREE.Vector3(-12.5, 0, -18), new THREE.Vector3(-11, 0, -10), new THREE.Vector3(-12, 0, -2), new THREE.Vector3(-11, 0, 6), new THREE.Vector3(-12.5, 0, 14), new THREE.Vector3(-11, 0, 20), new THREE.Vector3(-10.5, 0, 25), new THREE.Vector3(-10.5, 0, 28)]);
  add(group, new THREE.Mesh(riverGeometry(river, 5.0), mat("#e6dfc4")), 0, 0.022, 0);
  const riverM = new THREE.Mesh(riverGeometry(river, 3.4), kamo); riverM.position.y = 0.068; riverM.renderOrder = 2; group.add(riverM);
  addFish({ group, tickers, place, tint, TOP }, river, [["#e8558a", "#f4f1ea"], ["#f08a2a", "#f4f1ea"], ["#f4f1ea", "#c0392b"]], 1.0, 0.28);   // koi
  // stepping stones and a wooden bridge in Kyoto
  for (let k = 0; k < 5; k++) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.14, 7), mat("#8f857a")), -12.9 + k * 0.7, TOP + 0.1, 12 + Math.sin(k) * 0.2);
  const bridge = new THREE.Group(); add(bridge, new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 1.8), mat(JP.wood)), 0, 0.7, 0); for (const sd of [-1, 1]) { add(bridge, new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.06, 0.06), mat(JP.vermilion)), 0, 1.3, sd * 0.85); for (let k = 0; k < 6; k++) add(bridge, new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), mat(JP.vermilion)), -2.6 + k * 1.04, 1.0, sd * 0.85); } for (const x of [-2.4, 2.4]) add(bridge, new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 2.0), mat("#8f857a")), x, 0.3, 0); const bp = river.getPointAt(0.63); bridge.position.set(bp.x, TOP, bp.z); group.add(bridge);
  // Fuji's lake, the Mirror Pond at Kinkaku-ji, the hot spring
  const disc = (x: number, z: number, rx: number, rz: number, m: THREE.Material, rim: string, rimW = 0.8) => { const r = new THREE.Mesh(new THREE.CircleGeometry(1, 36), mat(rim)); r.rotation.x = -Math.PI / 2; r.position.set(x, TOP + 0.03, z); r.scale.set(rx + rimW, rz + rimW, 1); group.add(r); const w = new THREE.Mesh(new THREE.CircleGeometry(1, 36), m); w.rotation.x = -Math.PI / 2; w.position.set(x, TOP + 0.064, z); w.scale.set(rx, rz, 1); w.renderOrder = 2; group.add(w); };
  disc(17, 9, 3.0, 2.4, lake, "#e6dfc4"); disc(-27.5, 8.4, 4.6, 3.2, pond, "#cfc6a8"); disc(-2, -2.5, 2.2, 1.5, spring, "#8f857a", 0.3);
  add(group, new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 1.0), mat(JP.wood)), 15.6, TOP + 0.12, 6.9);   // a jetty on the lake
  const rowboat = new THREE.Group(); add(rowboat, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.7), mat(JP.white)), 0, 0.15, 0); add(rowboat, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.74), mat(JP.vermilion)), 0, 0.3, 0); const rower = local(JP.indigo); rower.userData.sit?.(); rower.scale.setScalar(0.75); rower.position.set(-0.1, 0.3, 0); rowboat.add(rower); group.add(rowboat);
  tickers.push((t) => { const a = t * 0.25; rowboat.position.set(17 + Math.cos(a) * 1.7, TOP + 0.06, 9 + Math.sin(a) * 1.2); rowboat.rotation.y = -a; });

  // ---------- Tokyo ----------
  for (const [x, z, w, h, d, c, sg] of [[5, -24, 2.0, 7, 2.0, "#c9c2b0", JP.vermilion], [5, -20, 2.0, 5, 2.0, "#b8b4ad", JP.indigo], [26, -21, 2.0, 6, 2.0, "#a89f8c", "#3fa2b0"], [26, -9.5, 2.4, 8, 2.4, "#c9c2b0", JP.vermilion], [22, -5.5, 2.0, 5, 2.0, "#b8b4ad", JP.indigo], [10, -3.5, 2.2, 6, 2.2, "#a89f8c", "#3fa2b0"], [25.5, -11.5, 1.8, 3.5, 1.8, "#c9c2b0", JP.vermilion]] as [number, number, number, number, number, string, string][]) place(tokyoBlock(w, h, d, c, sg), x, z, 0);
  place(vendingMachine(), 6.7, -17, Math.PI / 2); place(vendingMachine(), 6.7, -16.2, Math.PI / 2); place(vendingMachine(), 21, -23, -Math.PI / 2);
  const tokyoPts: [number, number][] = [[7.5, -25.5], [22.5, -25.5], [22.5, -9], [7.5, -9]];
  const tokyoLoop = new THREE.CatmullRomCurve3(tokyoPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true, "catmullrom", 0.0);
  tokyoPts.forEach((a, i) => { const b = tokyoPts[(i + 1) % tokyoPts.length]; const seg = path([a, b], 2.2, "#6e6e72"); seg.position.y = 0.004 * (i % 2 + 1); group.add(seg); });
  for (const [x, z] of [[15, -25.5], [15, -9]] as [number, number][]) for (let k = 0; k < 5; k++) add(group, new THREE.Mesh(new THREE.PlaneGeometry(0.18, 2.0), mat("#e9e6da")), x - 0.72 + k * 0.36, TOP + 0.052, z).rotation.x = -Math.PI / 2;
  const cars = [car("#2a2a2e"), car(JP.white), car("#3f8f5a")]; cars.forEach((c) => group.add(c));
  tickers.push((t) => cars.forEach((c, i) => { const u = (t * 0.028 + i / 3) % 1; const p = tokyoLoop.getPointAt(u), n = tokyoLoop.getPointAt((u + 0.003) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; c.position.set(p.x + (dz / l) * 0.5, 0, p.z - (dx / l) * 0.5); c.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; }));
  const tokyoWalkers = Array.from({ length: 7 }, (_, i) => local([JP.white, "#2a2a2e", JP.indigo, "#e8558a", "#3f8f5a", JP.white, "#8a2a2a"][i], { cap: i % 4 === 0 })); tokyoWalkers.forEach((w) => group.add(w));
  tickers.push((t) => tokyoWalkers.forEach((w, i) => { const u = (t * 0.006 + i / 7) % 1; const p = tokyoLoop.getPointAt(u), n = tokyoLoop.getPointAt((u + 0.004) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; w.position.set(p.x - (dz / l) * 1.3, 0, p.z + (dx / l) * 1.3); w.rotation.y = Math.atan2(dx, dz); w.userData.walk?.(t + i); }));
  for (const [x, z] of [[8.5, -12], [21, -12.5], [4, -9.5], [24, -13.5]] as [number, number][]) place(sakura(0.8), x, z, x);

  // ---------- Kyoto ----------
  for (const [x, z, w, c] of [[-22, 14, 3.2, JP.darkWood], [-18.5, 14, 3.0, JP.wood], [-25.5, 14, 3.0, "#5a3d28"], [-22, 19, 3.4, JP.wood], [-18.5, 19, 3.0, JP.darkWood]] as [number, number, number, string][]) place(machiya(w, c), x, z, z > 16 ? Math.PI : 0);
  group.add(path([[-27.5, 16.5], [-15.5, 16.5]], 2.0, "#cfc6a8"));
  for (const [x, z] of [[-15, 3], [-15.5, 9], [-8, 8], [-8.5, 2], [-8, 14], [-15, 21], [-7.5, 20], [-30, 13], [-24, 4], [-33, 8]] as [number, number][]) place(sakura(0.9 + ((x + z) % 3) * 0.1), x, z, x);
  for (const [x, z] of [[-24, 1], [-31, 4.5], [-27, 16.5], [-13.5, 10]] as [number, number][]) place(stoneLantern(0.9), x, z, 0);
  for (const [x, z] of [[-36, 12], [-35, 24], [-24, 26], [-14, -6], [-6, 24]] as [number, number][]) place(tree("pine", 1.0), x, z, x);
  const kyotoPts: [number, number][] = [[-27.5, 16.5], [-15.5, 16.5], [-14.5, 11], [-16, 5], [-22, 4.5], [-24, 11]];
  const kyotoLoop = new THREE.CatmullRomCurve3(kyotoPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  group.add(path([...kyotoPts.slice(1), kyotoPts[0], kyotoPts[1]], 1.6, "#cfc6a8"));
  const kyotoWalkers = [local(JP.white, { kimono: "#7a3a5a" }), local(JP.white, { kimono: "#c8402a" }), local(JP.indigo), local(JP.white, { kimono: "#3f8f5a" }), local("#2a2a2e", { kimono: JP.indigo })]; kyotoWalkers.forEach((w) => group.add(w));
  tickers.push((t) => kyotoWalkers.forEach((w, i) => { const u = (t * 0.005 + i / 5) % 1; const p = kyotoLoop.getPointAt(u), n = kyotoLoop.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  for (const [x, z] of [[-8.2, 6], [-8, 11]] as [number, number][]) { const pair = [local(JP.indigo), local("#e8558a", { kimono: "#f6b8c8" })]; pair.forEach((q, i) => { q.userData.sit?.(); place(q, x + i * 0.6, z, Math.PI / 2); }); }   // couples on the Kamo bank

  // ---------- Fuji, the lake, the shinkansen ----------
  const trackPts: [number, number][] = [[-6, -6.5], [12, -6.5], [20, -3], [22.5, 6], [20.5, 15], [14, 20], [4, 21.5], [-5, 19], [-8, 8]];
  const track = new THREE.CatmullRomCurve3(trackPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  group.add(path([...trackPts, trackPts[0]], 1.7, "#9a9a92"));
  for (const off of [-0.42, 0.42]) { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 120; i++) { const u = i / 120; const p = track.getPointAt(u), tg = track.getTangentAt(u); pts.push(new THREE.Vector3(p.x - tg.z * off, TOP + 0.06, p.z + tg.x * off)); } const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 240, 0.035, 4, true), mat("#5a5a5a")); group.add(rail); }
  const train = [shinkansenCar(true), shinkansenCar(), shinkansenCar(), shinkansenCar()]; train.forEach((c) => group.add(c));
  const trackLen = track.getLength();
  tickers.push((t) => train.forEach((c, i) => { const u = ((t * 0.05 - i * 3.15 / trackLen) % 1 + 1) % 1; const p = track.getPointAt(u), n = track.getPointAt((u + 0.002) % 1); c.position.set(p.x, TOP + 0.05, p.z); c.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  add(group, new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 1.6), mat("#8f857a")), 24.6, TOP + 0.15, 7).rotation.y = 0.2; add(group, new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 1.2), mat(JP.tile)), 24.6, TOP + 2.1, 7).rotation.y = 0.2; for (const sd of [-1, 1]) add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 5), mat("#5a5a5a")), 24.6 + sd * 1.3, TOP + 1.2, 7 - sd * 0.3);   // a platform with a shelter
  for (const [x, z] of [[13.5, 3.5], [19.5, 4], [15, 13], [19, 13.5], [-1, 21.5], [-7, 12]] as [number, number][]) place(sakura(0.9), x, z, x);
  for (const [x, z] of [[-6, -3], [4, 24.5], [13, -1.5], [17.5, -1.5], [10, 21.8]] as [number, number][]) place(tree("pine", 1.1), x, z, x);

  // ---------- Hokkaido ----------
  const boats = [fishingBoat(), fishingBoat("#c9cfd6"), fishingBoat()]; boats.forEach((b) => { group.add(b); tickers.push(b.userData.tick!); });
  const lane = new THREE.CatmullRomCurve3([[-34, -12], [-31, -16], [-33, -22], [-35.5, -19], [-36, -10]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  const seaLane = new THREE.CatmullRomCurve3([[33, -20], [35, -8], [33.5, 4], [35, 14], [32, 22], [30, 12], [32.5, 0], [33, -12]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => boats.forEach((b, i) => { const cv = i < 2 ? lane : seaLane; const u = (t * 0.008 + i / 2) % 1; const p = cv.getPointAt(u), n = cv.getPointAt((u + 0.005) % 1); b.position.set(p.x, TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  for (const [x, z] of [[-33, -25], [-25, -26], [-11, -25], [-7, -14], [-24, -8]] as [number, number][]) place(tree("pine", 1.2), x, z, x);
  for (const [x, z] of [[-22, -9.5], [-31, -19.5], [-13, -26]] as [number, number][]) place(tree("pine", 0.9), x, z, x + z);
  const cranes = birds(4, 7, 6); cranes.position.set(-18, TOP, -18); group.add(cranes); tickers.push(cranes.userData.tick!);
  const gulls = birds(5, 6, 7); gulls.position.set(28, TOP, 20); group.add(gulls); tickers.push(gulls.userData.tick!);
  for (const [x, z, n] of [[-24, -19, 2], [-29, 12, 2], [12, -12, 3], [-4, 17, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(local([JP.white, JP.indigo, "#e8558a", "#2a2a2e"][(i + Math.abs(Math.round(x))) % 4], { kimono: x < -20 && z > 0 ? "#7a3a5a" : undefined, cap: x > 0 && i === 0 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
}
