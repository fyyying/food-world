/** North America: the Pacific and California on the left, the Midwest above the Mississippi's middle reach, Texas below it, New York and New England on the Atlantic to the right. Objects come from graph.ts. */
import * as THREE from "three";
import { NAMERICA_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, path, birds, lounger, tree } from "./props";
import { NAMERICA_PROPS, skyscraper, empireState, chrysler, redwood, lobsterBoat, mesa, pumpjack, cableCar, taxi, car, bus, horse, american, NA } from "./props-namerica";
import { saguaro } from "./props-mexico";
import { buildWorld, riverGeometry, seaWater, freshWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildNamerica(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "north-america", W: 76, D: 56, ground: "#9dbf6a", plinth: "#6b4a32", recipes, objects: NAMERICA_OBJECTS, props: NAMERICA_PROPS,
    small: /^(chickenNA|hotDog|bananaNut)$/, fallbackPlace: "diner",
    layout: layoutNamerica,
  });
}

function layoutNamerica({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(-1, -14, 14, 14, "#a8c26a", -0.03);      // the corn belt
  tint(-2, 15, 14, 14, "#c9b784", 0.06);        // Texas dust
  tint(-24, 6, 12, 12, "#e6d9a8", 0.05);        // the California valley
  tint(-30, 18, 5, 8, "#eadfbd", 0.1);          // the beach

  // ---------- water: the Pacific west, the Atlantic and the Gulf east, the Mississippi down the middle ----------
  const sea = seaWater(), river = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; river.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.4, wz = edge ? z : z + Math.cos(i * 1.9) * 0.4; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const coast = (pts: [number, number][], sign: number, d: number) => pts.map(([x, z], i) => { const [px, pz] = pts[(i + pts.length - 1) % pts.length], [nx, nz] = pts[(i + 1) % pts.length]; const e0 = [x - px, z - pz], e1 = [nx - x, nz - z]; const l0 = Math.hypot(e0[0], e0[1]) || 1, l1 = Math.hypot(e1[0], e1[1]) || 1; let ox = (-e0[1] / l0 - e1[1] / l1), oz = (e0[0] / l0 + e1[0] / l1); const l = Math.hypot(ox, oz) || 1; ox = (ox / l) * d * sign; oz = (oz / l) * d * sign; if (Math.abs(x) >= 38) ox = 0; if (Math.abs(z) >= 28) oz = 0; return [x + ox, z + oz] as [number, number]; });
  const atlantic: [number, number][] = [[32, -28], [38, -28], [38, 28], [17, 28], [17, 26.5], [21, 24], [27, 22], [31, 20], [32.5, 12], [31.5, 4], [32.5, -4], [30.5, -10], [30, -18], [30.5, -24]];
  const pacific: [number, number][] = [[-38, -28], [-32, -28], [-32.5, -22], [-31.5, -14], [-32, -11], [-29.5, -10.8], [-27.5, -10.2], [-25.5, -9.6], [-23.8, -8.6], [-22.8, -7], [-22.5, -5], [-22.6, -3], [-23.2, -1.2], [-24.6, 0.3], [-26.4, 0.4], [-28, -0.6], [-29.2, -2], [-32, -3], [-31.5, 4], [-32.5, 12], [-31.5, 20], [-32.5, 28], [-38, 28]];
  for (const [pts, cx] of [[atlantic, -1], [pacific, -1]] as [[number, number][], number][]) {
    const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(coast(pts, cx, 1.2))), mat("#eadfbd")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
    const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(pts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  }
  // Liberty Island
  const isle = new THREE.Shape(); isle.absellipse(35, -17, 2.4, 2.0, 0, Math.PI * 2, false, 0);
  const isleM = new THREE.Mesh(new THREE.ShapeGeometry(isle), mat("#9dbf6a")); isleM.rotation.x = -Math.PI / 2; isleM.scale.y = -1; isleM.position.y = TOP + 0.075; group.add(isleM);
  const isleRim = new THREE.Shape(); isleRim.absellipse(35, -17, 2.9, 2.5, 0, Math.PI * 2, false, 0);
  const rimI = new THREE.Mesh(new THREE.ShapeGeometry(isleRim), mat("#8f857a")); rimI.rotation.x = -Math.PI / 2; rimI.scale.y = -1; rimI.position.y = TOP + 0.07; group.add(rimI);
  // the Mississippi, from the north edge to the Gulf
  const miss = new THREE.CatmullRomCurve3([new THREE.Vector3(1, 0, -28), new THREE.Vector3(1, 0, -26.5), new THREE.Vector3(0, 0, -20), new THREE.Vector3(1, 0, -12), new THREE.Vector3(-1, 0, -4), new THREE.Vector3(0, 0, 4), new THREE.Vector3(-1, 0, 12), new THREE.Vector3(1, 0, 18), new THREE.Vector3(5, 0, 23), new THREE.Vector3(8, 0, 26.5), new THREE.Vector3(8, 0, 28)]);
  add(group, new THREE.Mesh(riverGeometry(miss, 6.2), mat("#eadfbd")), 0, 0.022, 0);
  const missM = new THREE.Mesh(riverGeometry(miss, 4.4), river); missM.position.y = 0.068; missM.renderOrder = 2; group.add(missM);
  addFish({ group, tickers, place, tint, TOP }, miss, [["#8fa3b5", "#d9dee3"], ["#6f8f6f", "#c9d6b0"]], 1.2, 0.3);
  // two bridges and a paddle steamer
  for (const z of [-8, 14]) { const b = new THREE.Group(); add(b, new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.25, 2.2), mat("#8a6a4a")), 0, 0.6, 0); for (const sd of [-1, 1]) { add(b, new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.06, 0.06), mat("#5a5a5a")), 0, 1.3, sd * 1.05); for (let k = 0; k < 7; k++) add(b, new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), mat("#5a5a5a")), -3.3 + k * 1.1, 0.95, sd * 1.05); for (let k = 0; k < 6; k++) add(b, new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.06), mat("#5a5a5a")), -2.75 + k * 1.1, 0.95, sd * 1.05).rotation.z = k % 2 ? 0.6 : -0.6; } for (const x of [-2.8, 2.8]) add(b, new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 2.4), mat("#8f857a")), x, 0.25, 0); const p = miss.getPointAt(z === -8 ? 0.36 : 0.7); b.position.set(p.x, TOP, p.z); group.add(b); }
  const steamer = new THREE.Group(); add(steamer, new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.4, 1.3), mat(NA.white)), 0, 0.2, 0); add(steamer, new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.1), mat(NA.white)), -0.1, 0.65, 0); add(steamer, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.9), mat(NA.white)), -0.2, 1.15, 0); for (const x of [0.4, 1.0]) add(steamer, new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), mat("#2a2a2e")), x, 1.6, 0); const wheel = add(steamer, new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.0, 12), mat("#c0392b")), -1.7, 0.5, 0); wheel.rotation.z = Math.PI / 2; for (let k = 0; k < 8; k++) add(wheel, new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 1.0), mat("#c0392b")), 0, 0, 0).rotation.x = k * Math.PI / 8; group.add(steamer);
  steamer.userData.smoke = new THREE.Vector3(0.4, 2.3, 0);
  tickers.push((t) => { const raw = (t * 0.03) % 2; const u = raw < 1 ? raw : 2 - raw; const uu = 0.42 + u * 0.22; const p = miss.getPointAt(uu), n = miss.getPointAt(uu + (raw < 1 ? 0.01 : -0.01)); steamer.position.set(p.x, TOP + 0.05, p.z); steamer.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; wheel.rotation.x = t * 3; });

  // ---------- New York & New England ----------
  // Manhattan: two blocks of towers between three avenues, the Empire State and a Chrysler-style tower among them
  tint(22, -22, 16, 11, "#9a9a9e", 0.08);
  place(empireState(), 18.8, -23.8, 0); place(chrysler(), 24.4, -23.9, 0);
  for (const [x, z, w, d, h, c, glass] of [[26.4, -23.8, 1.6, 2.4, 8, "#a89f8c", false], [17.8, -21.3, 1.6, 1.6, 9, "#8fa3b5", false], [19.8, -21.3, 1.6, 1.6, 12, "#7f8f9f", true], [17.8, -19.3, 1.6, 1.6, 6, "#b88a6a", false], [19.8, -19.3, 1.6, 1.6, 10, "#c9b48c", false], [24.2, -21.3, 1.6, 1.6, 11, "#8fa3b5", false], [26.4, -21.3, 1.6, 1.6, 7, "#a8553a", false], [24.2, -19.3, 1.6, 1.6, 14, "#7f8f9f", true], [26.4, -19.3, 1.6, 1.6, 9, "#a89f8c", false], [13.6, -21, 1.6, 1.6, 7, "#c9b48c", false], [13.6, -18.6, 1.6, 1.6, 5, "#a8553a", false], [18.5, -14.2, 1.6, 1.6, 8, "#8fa3b5", false], [25.5, -14.2, 1.6, 1.6, 6, "#b88a6a", false]] as [number, number, number, number, number, string, boolean][]) place(skyscraper(w, h, d, c, glass), x, z, 0);
  group.add(path([[14.4, -26.5], [29.6, -26.5]], 2.2, "#6e6e72"));
  for (const x of [15.5, 22, 28.5]) { const av = path([[x, -27.6], [x, -16]], 2.2, "#6e6e72"); av.position.y = 0.008; group.add(av); }
  for (const [x0, x1, z] of [[15.5, 28.5, -26.5], [16.5, 27.5, -17]] as [number, number, number][]) for (let x = x0; x <= x1; x += 0.9) add(group, new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.06), mat("#e9e6da")), x, TOP + 0.048, z).rotation.x = -Math.PI / 2;   // the centre lines
  for (const [x, z] of [[15.5, -24.9], [22, -24.9], [28.5, -24.9], [15.5, -18.6], [22, -18.6], [28.5, -18.6]] as [number, number][]) for (let k = 0; k < 5; k++) add(group, new THREE.Mesh(new THREE.PlaneGeometry(0.18, 2.0), mat("#e9e6da")), x - 0.72 + k * 0.36, TOP + 0.052, z).rotation.x = -Math.PI / 2;   // crosswalks
  const loopW = new THREE.CatmullRomCurve3([[15.5, -26.5], [22, -26.5], [22, -17], [15.5, -17]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true, "catmullrom", 0.0);
  const loopE = new THREE.CatmullRomCurve3([[22, -26.5], [28.5, -26.5], [28.5, -17], [22, -17]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true, "catmullrom", 0.0);
  const nyPts: [number, number][] = [[15.5, -17], [28.5, -17], [28.5, -10], [26.5, -2.5], [17.5, -2.5], [15.5, -9]];
  const nyLoop = new THREE.CatmullRomCurve3(nyPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true, "catmullrom", 0.0);
  nyPts.forEach((a, i) => { if (i === 0) return; const b = nyPts[(i + 1) % nyPts.length]; const seg = path([a, b], 2.2, "#6e6e72"); seg.position.y = 0.004 * (i % 2 + 1); group.add(seg); });
  const carColours = ["#c0392b", "#2f6fb5", NA.white, "#2a2a2e", "#3f8f5a", "#8a8a8e"];
  type Traffic = { curve: THREE.CatmullRomCurve3; vehicles: THREE.Object3D[]; dir: 1 | -1; speed: number; off: number };
  const traffic: Traffic[] = [];
  const fleet = (n: number, withBus = false) => { const v: THREE.Object3D[] = []; for (let i = 0; i < n; i++) v.push(i % 2 ? taxi() : withBus && i === 0 ? bus() : car(carColours[i % carColours.length])); v.forEach((c) => group.add(c)); return v; };
  traffic.push({ curve: loopW, vehicles: fleet(3, true), dir: 1, speed: 0.03, off: 0.5 }, { curve: loopE, vehicles: fleet(3), dir: 1, speed: 0.027, off: 0.5 }, { curve: nyLoop, vehicles: fleet(3), dir: 1, speed: 0.03, off: 0.5 });
  tickers.push((t) => { for (const tr of traffic) tr.vehicles.forEach((c, i) => { const u = ((tr.dir * t * tr.speed + i / tr.vehicles.length) % 1 + 1) % 1; const p = tr.curve.getPointAt(u), n = tr.curve.getPointAt(((u + tr.dir * 0.003) % 1 + 1) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; c.position.set(p.x + (dz / l) * tr.off, 0, p.z - (dx / l) * tr.off); c.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; }); });
  // the sidewalks: crowds walking both ways along the avenues, and groups at the corners
  const pedLoops: [THREE.CatmullRomCurve3, number, number][] = [[loopW, 1.3, 1], [loopE, 1.3, -1], [nyLoop, 1.35, 1]];
  for (const [curve, off, dir] of pedLoops) { const n = curve === nyLoop ? 6 : 7; const walkers = Array.from({ length: n }, (_, i) => american([NA.white, "#2a2a2e", NA.denim, "#c0392b", NA.yellow, "#2f5d3f", "#e8558a"][i % 7], { cap: i % 3 === 0 ? "#2a2a2e" : undefined, beanie: i % 5 === 4 ? "#c0392b" : undefined })); walkers.forEach((w) => group.add(w)); tickers.push((t) => walkers.forEach((w, i) => { const u = ((dir * t * 0.006 + i / n + (dir > 0 ? 0 : 0.5 / n)) % 1 + 1) % 1; const p = curve.getPointAt(u), q = curve.getPointAt(((u + dir * 0.004) % 1 + 1) % 1); const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; w.position.set(p.x - (dz / l) * off * (dir > 0 ? 1 : -1), 0, p.z + (dx / l) * off * (dir > 0 ? 1 : -1)); w.rotation.y = Math.atan2(dx, dz); w.userData.walk?.(t + i); })); }
  for (const [x, z, n] of [[19.8, -12.6, 3], [24.4, -13.2, 2], [14, -14.2, 2], [30, -13.6, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(american([NA.white, NA.denim, "#2a2a2e", NA.yellow][(i + Math.abs(Math.round(x))) % 4], { cap: i === 0 ? "#2a2a2e" : undefined }), x + Math.cos(a) * 0.4, z + Math.sin(a) * 0.4, -a - Math.PI / 2); }
  for (const [x, z] of [[16.4, -13.6], [27.6, -13.4], [13.2, -23.6], [13.4, -15.8]] as [number, number][]) place(tree("round", 0.7), x, z, x);
  for (const [x, z] of [[18, -6], [29, -5], [14, -13]] as [number, number][]) place(tree("round", 0.9), x, z, x);
  for (const [x, z, s] of [[19, 4, 1.0], [30, 2, 0.9], [20, 12, 1.1], [24, 16, 0.9], [17, 20, 1.0], [21, 19, 1.1], [26, 11, 0.9], [15, 8, 0.9]] as [number, number, number][]) place(tree(s > 1 ? "pine" : "round", s), x, z, x + z);
  const boats = [lobsterBoat(), lobsterBoat()]; boats.forEach((b) => { group.add(b); tickers.push(b.userData.tick!); });
  const lane = new THREE.CatmullRomCurve3([[34, -6], [36.5, 2], [35, 12], [36.5, 22], [33.5, 25], [33, 14], [33.5, 4]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => boats.forEach((b, i) => { const u = (t * 0.008 + i / 2) % 1; const p = lane.getPointAt(u), n = lane.getPointAt((u + 0.005) % 1); b.position.set(p.x, TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  const gulls = birds(6, 6, 8); gulls.position.set(31, TOP, 10); group.add(gulls); tickers.push(gulls.userData.tick!);

  // ---------- the Midwest ----------
  group.add(path([[-13, -18], [-2, -18], [-2, -9], [3.5, -9], [3.5, -18], [12, -18], [13.5, -10], [8, -8.5], [3.5, -9]], 1.8, "#c9b784"));
  group.add(path([[-13, -18], [-13, -4], [-8, -3], [-2, -3.5], [-2, -9]], 1.8, "#c9b784"));
  for (const [x, z] of [[-13, -25], [-3, -27], [-4, -8.5], [-3, -1], [14, -8], [10, -1]] as [number, number][]) place(tree("round", 1.0), x, z, x);
  const crate = new THREE.Group(); add(crate, new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.6), mat("#a37a4f")), 0, 0.2, 0); for (let k = 0; k < 5; k++) add(crate, new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 5), mat("#e0c84a")), -0.3 + k * 0.15, 0.42, (k % 2) * 0.15 - 0.05).rotation.z = 1.2; add(crate, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.02, 1), mat(NA.white)), 0.3, 0.55, 0.3); place(crate, 3.5, -1.5, 0.3);

  // ---------- Texas & the South ----------
  group.add(path([[-13, 4], [-3, 4], [-2.5, 10], [-3, 15.5], [-13, 15.5], [-14, 9], [-13, 4]], 1.8, "#d9b98a"));
  group.add(path([[3.5, 4], [14, 4], [14.5, 13], [4, 13.5], [3.5, 4]], 1.8, "#d9b98a"));
  place(mesa(4.5, 3, 3), -14, 25); place(mesa(3.5, 2.5, 2.5), -18.5, 26);
  // riders on the trail: a loop out past the mesas and back along the river
  const trailPts: [number, number][] = [[-3, 23.5], [-8.5, 23.5], [-10.5, 25.5], [-8, 27], [-3, 26.5]];
  const trail = new THREE.CatmullRomCurve3(trailPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  group.add(path([...trailPts, trailPts[0]], 1.4, "#d9b98a"));
  const riders = [horse("#6b4a2c", "#c0392b"), horse("#3a2a1e", NA.denim), horse("#c9b48c", "#2a2a2e")];
  riders.forEach((r) => group.add(r));
  tickers.push((t) => riders.forEach((r, i) => { const u = (t * 0.012 + i / 3) % 1; const p = trail.getPointAt(u), n = trail.getPointAt((u + 0.004) % 1); r.position.set(p.x, 0, p.z); r.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; r.userData.gait?.(t + i, 1); }));
  for (const [x, z, rot, shirt] of [[-12, 0.5, 0.4, "#2a2a2e"], [14, 15, -0.6, NA.white]] as [number, number, number, string][]) { const h = horse(x < 0 ? "#c9b48c" : "#6b4a2c", shirt); place(h, x, z, rot); tickers.push((t) => h.userData.gait?.(t, 0.15)); }
  for (const [x, z, rot] of [[-6, 14.6, 0.5], [12.5, 5.6, -0.4], [-10, 14.6, 2.5]] as [number, number, number][]) place(american([NA.denim, "#c0392b", "#2a2a2e"][Math.abs(Math.round(x)) % 3], { cowboy: true }), x, z, rot);
  place(pumpjack(), 10, 24, 0.4); place(pumpjack(), 13.5, 26, -0.3);
  for (const [x, z, s] of [[-12, 22.5, 1.0], [-6, 25.3, 0.9], [-1.5, 22.5, 1.1], [14, 18, 0.8]] as [number, number, number][]) place(saguaro(s), x, z, x);
  for (const [x, z] of [[-14, 7], [5, 7.5], [14, 12], [-4, 16]] as [number, number][]) place(tree("round", 0.9), x, z, x);

  // ---------- California ----------
  for (const [x, z, s] of [[-30, -24, 1.0], [-27, -21, 0.9], [-31, -18, 0.8], [-25, -25, 1.1], [-21, -23, 0.85], [-29, -14, 0.7]] as [number, number, number][]) place(redwood(s), x, z, x);
  place(cableCar(), -25, -14, 0.5);
  group.add(path([[-26, -12], [-21, -15], [-15, -11], [-14, 2], [-16, 6], [-25, 5], [-21, 1.5], [-20.5, -7], [-24, -11.5], [-26, -12]], 1.8, "#c9c0a8"));
  for (const [x, z, c] of [[-29, 15, "#e8558a"], [-29, 18.5, "#2f6fb5"]] as [number, number, string][]) {
    add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 5), mat("#f4f1ea")), x, TOP + 0.9, z);
    add(group, new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.45, 10), mat(c)), x, TOP + 1.9, z);
    const lg = lounger("#f4f1ea", c); place(lg, x + 1.1, z + 0.3, -0.6);
  }
  for (const [x, z, s] of [[-16, 17, 1.0], [-14, 21.5, 0.9], [-30, 9, 0.9], [-30.5, -26, 0.8], [-19, -6, 0.9]] as [number, number, number][]) { const p = tree("round", s); place(p, x, z, x); }
  for (let k = 0; k < 4; k++) { const palm = new THREE.Group(); add(palm, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 4.5, 6), mat("#8a6a4a")), 0, 2.25, 0).rotation.z = 0.08; for (let f = 0; f < 7; f++) { const leaf = add(palm, new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.5), mat("#5f9a4a")), 0.8, 4.5, 0); leaf.rotation.y = f * 0.9; leaf.rotation.z = -0.5; } place(palm, [-30, -28.5, -30, -28.5][k], [8, 9.5, 23, 25][k], k); }

  // ---------- life ----------
  const loops: [THREE.CatmullRomCurve3, [string, string][], number][] = [
    [new THREE.CatmullRomCurve3([[-13, -18], [-2, -18], [-2, -9], [-2, -3.5], [-8, -3], [-13, -4]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [[NA.denim, "cap"], ["#c0392b", ""], [NA.white, "cap"], ["#2f5d3f", ""]], 0.006],
    [new THREE.CatmullRomCurve3([[-13, 4], [-3, 4], [-2.5, 10], [-3, 15.5], [-13, 15.5], [-14, 9]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [[NA.denim, "cowboy"], ["#c0392b", "cowboy"], [NA.white, ""], ["#2a2a2e", "cowboy"]], 0.006],
    [new THREE.CatmullRomCurve3([[-26, -12], [-21, -15], [-15, -11], [-14, 2], [-16, 6], [-25, 5], [-21, 1.5], [-20.5, -7], [-24, -11.5]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#e8558a", ""], [NA.yellow, "cap"], ["#2f6fb5", ""], [NA.white, "cap"], ["#3f8f5a", ""]], 0.006],
  ];
  for (const [curve, people, speed] of loops) {
    const walkers = people.map(([c, kind]) => american(c, { cowboy: kind === "cowboy", cap: kind === "cap" ? "#2a2a2e" : undefined, beanie: kind === "beanie" ? "#c0392b" : undefined }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length + 0.5 / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; w.position.set(p.x - (dz / l) * 0.6, 0, p.z + (dx / l) * 0.6); w.rotation.y = Math.atan2(dx, dz); w.userData.walk?.(t + i); }));
  }
  for (const [x, z, n] of [[25, -10, 3], [19, -8, 2], [-5.5, -6, 2], [-13, 11, 2], [-20, 4, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(american([NA.white, NA.denim, "#e8558a", NA.yellow][(i + Math.abs(x)) % 4], { cap: i === 0 ? "#2a2a2e" : undefined }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  const crows = birds(5, 7, 7); crows.position.set(-6, TOP, -20); group.add(crows); tickers.push(crows.userData.tick!);
  const pelicans = birds(4, 6, 6); pelicans.position.set(-30, TOP, 8); group.add(pelicans); tickers.push(pelicans.userData.tick!);
}
