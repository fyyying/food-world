/** India: Punjab and Delhi in the north, Rajasthan's desert to the west, Mumbai on the south coast, Kerala's backwaters in the south-east. Objects come from graph.ts. */
import * as THREE from "three";
import { INDIA_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, tree, path, birds, bridge, cow, type P } from "./props";
import { INDIA_PROPS, tajMahal, goldenTemple, gateway, hillFort, dune, houseboat, indian, bananaTree, gopuram, ghat, marigoldString, dabbaBike } from "./props-india";
import { datePalm } from "./props-mideast";
import { fishingBoat } from "./props-italy";
import { buildWorld, riverGeometry, seaWater, freshWater, estuaryWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildIndia(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "india", W: 76, D: 56, ground: "#b4bf72", plinth: "#6b4a32", recipes, objects: INDIA_OBJECTS, props: INDIA_PROPS,
    small: /^(chickenIn)$/, fallbackPlace: "dhaba",
    layout: layoutIndia,
  });
}

function layoutIndia({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(-4, -16, 22, 10, "#a9bf7a", 0.05);      // Punjab's green
  tint(-26, 6, 12, 12, "#d9c48a", -0.05);       // Rajasthan's sand
  tint(-3, 12, 12, 8, "#c4bba6", 0.05);          // Mumbai's paving
  tint(24, 10, 14, 12, "#7fb06a", 0.05);         // Kerala's wet green

  // ---------- the Arabian Sea along the south, the backwaters winding to it ----------
  const sea = seaWater(), canal = estuaryWater(33.5, 22, 5, "z"), river = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; canal.uniforms.uTime.value = t; river.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.5, wz = edge ? z : z + Math.cos(i * 1.9) * 0.5; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const seaPts: [number, number][] = [[-38, 28], [38, 28], [38, 22], [30, 23], [22, 22], [14, 22.5], [6, 21.5], [-2, 22], [-10, 21.5], [-18, 22.5], [-26, 22], [-34, 23], [-38, 22]];
  const rimPts: [number, number][] = seaPts.map(([x, z]) => [x, Math.abs(z) >= 28 ? z : z - 1.2] as [number, number]);
  const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(rimPts)), mat("#eadfbd")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
  const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(seaPts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  const water = new THREE.CatmullRomCurve3([new THREE.Vector3(11, 0, -4.8), new THREE.Vector3(11.3, 0, -2), new THREE.Vector3(12, 0, 4), new THREE.Vector3(16, 0, 8), new THREE.Vector3(22, 0, 10), new THREE.Vector3(27, 0, 14), new THREE.Vector3(31, 0, 19), new THREE.Vector3(33, 0, 23), new THREE.Vector3(33.5, 0, 25)]);
  add(group, new THREE.Mesh(riverGeometry(water, 5.2), mat("#eadfbd")), 0, 0.03, 0);
  const canalM = new THREE.Mesh(riverGeometry(water, 3.5), canal); canalM.position.y = 0.068; canalM.renderOrder = 2; group.add(canalM);
  addFish({ group, tickers, place, tint, TOP }, water, [["#d9a441", "#f4e1a1"], ["#6f8f6f", "#c9d6b0"]], 1.0, 0.3);
  const boats = [houseboat(), houseboat()];
  boats.forEach((b) => { b.scale.setScalar(0.85); group.add(b); tickers.push(b.userData.tick!); });
  tickers.push((t) => boats.forEach((b, i) => { const raw = (t * 0.015 + i * 0.9) % 2; const u = raw < 1 ? raw : 2 - raw; const uu = Math.min(0.84, Math.max(0.22, 0.22 + u * 0.62)); const p = water.getPointAt(uu), n = water.getPointAt(Math.min(0.83, Math.max(0.03, uu + (raw < 1 ? 0.01 : -0.01)))); b.position.set(p.x + (i ? 1.0 : -1.0), TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  for (const [x, z, c] of [[20, 24.5, "#3f6fb5"], [30, 25.5, "#c0392b"], [-14, 25, "#f4f1ea"]] as [number, number, string][]) { const b = fishingBoat(c); place(b, x, z, x * 0.1).position.y = TOP + 0.05; tickers.push(b.userData.tick!); }
  // ---------- the Ganga crosses the whole table from west to east, between Punjab and the south ----------
  const ganga = new THREE.CatmullRomCurve3([new THREE.Vector3(-38, 0, -9), new THREE.Vector3(-36.5, 0, -8.9), new THREE.Vector3(-30, 0, -8), new THREE.Vector3(-22, 0, -6.5), new THREE.Vector3(-12, 0, -5.5), new THREE.Vector3(0, 0, -5.2), new THREE.Vector3(12, 0, -4.8), new THREE.Vector3(24, 0, -5), new THREE.Vector3(36.5, 0, -5.5), new THREE.Vector3(38, 0, -5.5)]);
  add(group, new THREE.Mesh(riverGeometry(ganga, 5.6), mat("#e6d9b0")), 0, 0.03, 0);
  const gangaM = new THREE.Mesh(riverGeometry(ganga, 3.8), river); gangaM.position.y = 0.06; group.add(gangaM);
  addFish({ group, tickers, place, tint, TOP }, ganga, [["#8fa3b5", "#d9dee3"], ["#d9a441", "#f4e1a1"]], 1.1, 0.32);
  place(bridge(5.5), -17, -6.9, Math.PI / 2);
  place(bridge(5.5), 5, -5.1, Math.PI / 2);
  const gh = ghat(); place(gh, -2, -1.6, 0); tickers.push(gh.userData.tick!);
  group.add(path([[-17, -9.5], [-17, -4.2]], 1.6, "#d3c8ad")); group.add(path([[5, -8], [5, -1.8]], 1.6, "#d3c8ad"));

  // ---------- Punjab & Delhi ----------
  const taj = tajMahal(); place(taj, -24, -22.5, 0).scale.setScalar(0.7); tickers.push(taj.userData.tick!);
  place(goldenTemple(), 2, -22, 0);
  for (let i = 0; i < 3; i++) { const b = bananaTree(1.0 + (i % 2) * 0.2); place(b, -20 + i * 2.2, -10 + (i % 2) * 0.8, i); tickers.push(b.userData.tick!); }
  for (const [x, z] of [[-10, -10], [-8, -20]]) { const m = marigoldString(6); place(m, x, z, Math.PI / 2); }
  group.add(path([[-16, -8], [-8, -8], [2, -8], [10, -8], [15, -12], [15, -16], [9, -16], [2, -14.5], [-8, -16], [-16, -16], [-16, -8]], 2.0, "#d3c8ad"));

  // ---------- Rajasthan ----------
  place(hillFort(), -31, -1, 0.1).scale.setScalar(0.8);
  for (const [x, z, w, h, d] of [[-33, 19, 8, 0.5, 4], [-24, 19.5, 7, 0.45, 3.5], [-35, 9, 6, 0.4, 3]] as [number, number, number, number, number][]) place(dune(w, h, d), x, z, x * 0.1);
  for (const [x, z] of [[-35, 14], [-27, 16]]) { const p = datePalm(0.9); place(p, x, z, x); tickers.push(p.userData.tick!); }
  group.add(path([[-18, -1], [-12, -1], [-9.5, 2], [-13, 7.5], [-18, 8], [-25, 8], [-26, 2], [-24, -2], [-18, -1]], 1.6, "#d9c7a0"));

  // ---------- Mumbai ----------
  place(gateway(), 2, 19.5, 0).scale.setScalar(0.8);
  for (let i = 0; i < 3; i++) { const p = datePalm(0.9 + (i % 2) * 0.2); place(p, -14 + i * 1.6, 17 + (i % 2), i); tickers.push(p.userData.tick!); }
  group.add(path([[-13, 6], [-13, 15], [-6, 16], [2, 16], [4.3, 9], [5, 4], [-2, 4], [-13, 6]], 1.8, "#d3c8ad"));
  // dabbawalas ride the street loop on the kerb side, a little ahead of each other, never through the walkers
  const street = new THREE.CatmullRomCurve3([[-13, 6], [-13, 15], [-6, 16], [2, 16], [4.3, 9], [5, 4], [-2, 4]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  const riders = [dabbaBike(), dabbaBike(), dabbaBike()];
  riders.forEach((r) => { group.add(r); tickers.push(r.userData.tick!); });
  tickers.push((t) => riders.forEach((r, i) => { const u = (t * 0.02 + i * 0.12) % 1; const p = street.getPointAt(u), n = street.getPointAt((u + 0.003) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; r.position.set(p.x + (dz / l) * 1.1, 0, p.z - (dx / l) * 1.1); r.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; }));

  // ---------- Kerala ----------
  for (const [x, z, s] of [[20, 20.5, 1.0], [29, 21, 1.1], [36, 19, 0.9], [36, 4, 1.0], [10, 12, 0.9], [20, -4, 0.9]] as [number, number, number][]) { const p = datePalm(s); const cr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; cr.forEach((d) => { (d.material as THREE.MeshStandardMaterial).color.set("#6fa84a"); d.scale.set(1.4, 1.2, 1.4); }); place(p, x, z, x); tickers.push(p.userData.tick!); }
  const gp = gopuram(); place(gp, 33, -1.2, 0).scale.setScalar(0.75); tickers.push(gp.userData.tick!);
  for (const [x, z, sc] of [[8, 9, 1.1], [11, 16, 1.0], [18, 22, 1.2], [23, 22.5, 1.0], [27, 20.5, 1.1], [33, 20, 1.0], [36, 14, 1.2], [35, 9, 1.0], [30, 5.5, 0.9], [20, 12.5, 1.1], [13, 9.5, 0.9], [25, -1, 1.0], [-6, 15.5, 1.0], [-15, 14.5, 1.1], [-3, 7, 0.9], [-30, -18, 1.0], [-18, -19, 1.1], [14, -18, 1.0], [26, -12, 1.1]] as [number, number, number][]) { const b = bananaTree(sc); place(b, x, z, x + z); tickers.push(b.userData.tick!); }
  group.add(path([[12, 12], [20, 13.5], [21.5, 19.5], [19.5, 21], [11, 17], [12, 12]], 1.6, "#d3c8ad"));
  const streetCow = cow(false, true, "हम्बा! Moo!"); place(streetCow, -15, 12.5, 0.5); tickers.push((t, dt) => streetCow.userData.tick?.(t, dt));   // a sacred cow ambling through Mumbai
  for (const [x, z] of [[-4, 4.5], [-12, 2]]) { const m = marigoldString(5, 2.2); place(m, x, z, Math.PI / 2); }

  // ---------- life ----------
  const loops: [THREE.CatmullRomCurve3, [string, string][], number][] = [
    [new THREE.CatmullRomCurve3([[-16, -8], [-8, -8], [2, -8], [10, -8], [15, -12], [15, -16], [9, -16], [2, -14.5], [-8, -16], [-16, -16]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "turban"], ["#3f6fb5", ""], ["#e8558a", "sari"], ["#2f7f4a", "turban"], ["#e0b34c", "sari"], ["#2a2a2e", ""], ["#c0392b", "turban"]], 0.008],
    [new THREE.CatmullRomCurve3([[-18, -1], [-12, -1], [-9.5, 2], [-13, 7.5], [-18, 8], [-25, 8], [-26, 2], [-24, -2]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "turban"], ["#c0392b", "sari"], ["#e0b34c", "turban"], ["#9b59b6", "sari"], ["#2f7f4a", ""]], 0.007],
    [new THREE.CatmullRomCurve3([[-13, 6], [-13, 15], [-6, 16], [2, 16], [4.3, 9], [5, 4], [-2, 4]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#3f6fb5", "cap"], ["#f4f1ea", ""], ["#e8558a", "sari"], ["#2a2a2e", ""], ["#2a8f8f", "sari"], ["#e0b34c", "cap"]], 0.009],
    [new THREE.CatmullRomCurve3([[12, 12], [20, 13.5], [21.5, 19.5], [19.5, 21], [11, 17]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "dhoti"], ["#e8558a", "sari"], ["#3f6fb5", ""], ["#2a8f8f", "sari"]], 0.007],
  ];
  for (const [curve, people, speed] of loops) {
    const walkers = people.map(([c, kind]) => indian(c, { turban: kind === "turban" ? ["#f08a2a", "#2f6fb5", "#e8558a"][c.length % 3] : undefined, sari: kind === "sari" ? ["#e8558a", "#2a8f8f", "#9b59b6", "#f2c14e"][c.length % 4] : undefined, cap: kind === "cap", dhoti: kind === "dhoti" }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  }
  for (const [x, z, n] of [[-6, -10.5, 3], [-16, 10, 2], [-3, 17.5, 3], [26, 0, 2], [-30, -14, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(indian(["#f4f1ea", "#3f6fb5", "#c0392b", "#e0b34c"][(i + Math.abs(x)) % 4], { turban: i === 0 ? "#f08a2a" : undefined, sari: i === 1 ? "#e8558a" : undefined }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  const kites = birds(5, 8, 9); kites.position.set(-4, TOP, 12); group.add(kites); tickers.push(kites.userData.tick!);
  const parrots = birds(4, 6, 6); parrots.position.set(24, TOP, 12); group.add(parrots); tickers.push(parrots.userData.tick!);
}
