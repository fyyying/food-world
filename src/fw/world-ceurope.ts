/** Central Europe: Britain as an island in the west of a grown table, the Alps below and east of the strait,
 *  Budapest and the puszta on the Danube down the middle, Georgia and the Black Sea to the east.
 *
 *  The table grew on 2026-09-22 from W 76 to **W 120, D 56, cx -22**, identical to the Mediterranean and to
 *  Southeast Asia, so x runs -82 to 38 and z stays -28 to 28. Britain owns x -80 to -34; every Alpine,
 *  Hungarian and Georgian coordinate is the one it had, except the two western Alpine peaks, which stood in
 *  what is now the strait and moved east to [-22.5, 16.5] and [-27.8, 2.6].
 *
 *  What went with the growth: the old Thames curve and its Westminster Bridge, the closed London rectangle with
 *  its red buses, black cabs, loop walkers, standing pairs, round trees and pigeons, the London paving tint,
 *  and the Channel polygon, which is now the strait inside Britain's own sea ring. The red bus and the black
 *  cab are post-war objects and are not on this table anywhere; the street traffic is a 1907 motor omnibus and
 *  two hansom cabs in `london-town.ts`.
 *
 *  Britain's ground, water, roads, buildings, people and countryside are the five `london-*` modules. Objects
 *  come from graph.ts.
 */
import * as THREE from "three";
import { CEUROPE_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, path, birds, mountain, tree } from "./props";
import { CEUROPE_PROPS, cableCarAlps, ferry, local, CE } from "./props-ceurope";
import { LONDON_PROPS } from "./props-london";
import { horse } from "./props-namerica";
import { londonLandscape } from "./london-landscape";
import { londonTown } from "./london-town";
import { londonCountryside } from "./london-countryside";
import { buildWorld, riverGeometry, seaWater, freshWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildCeurope(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    // The Stand maker's `props-london.ts` landed and type-checks, so the props table is the merge; the British
    // builders win every key they share with the continent's, which is how `pub`, `bakeryCe`, `mushroomWood`,
    // `bigBen`, `towerBridge` and `phoneBox` become their Britain versions at Stage D.
    id: "central-europe", W: 120, D: 56, cx: -22, ground: "#8fb56a", plinth: "#5a4a3a", recipes,
    objects: CEUROPE_OBJECTS, props: { ...CEUROPE_PROPS, ...LONDON_PROPS },
    small: /^(phoneBox|khmeli|redBus|cableCar)$/, fallbackPlace: "roastPub",
    layout: layoutCeurope,
  });
}

function layoutCeurope(ctx: LayoutCtx) {
  const { group, tickers, place, tint, TOP } = ctx;
  tint(-20, 14, 13, 13, "#9fc27a", 0.03);        // alpine meadow
  tint(13, 12, 9, 12, "#c9c48a", 0.05);          // the puszta's dry grass
  tint(28, -2, 10, 10, "#c9b784", 0.05);         // Tbilisi's ochre

  // ---------- Britain: its ground, its one sea with the island as the hole in it, its river and its inlets ----------
  londonLandscape(ctx);

  // ---------- the continent's own water: the Black Sea east, the Danube, the alpine lake and the Széchenyi pool ----------
  const sea = seaWater(), danube = freshWater(), lake = freshWater(), pool = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; danube.uniforms.uTime.value = t; lake.uniforms.uTime.value = t; pool.uniforms.uTime.value = t; });
  // The edge tests are the grown table's own extents, so a cap at the edge stays square wherever it is; the
  // hand-written `Math.abs(x) >= 38` went with the growth, because the west edge is now -82, not -38.
  const atEdgeX = (x: number) => x <= -82 || x >= 38, atEdgeZ = (z: number) => Math.abs(z) >= 28;
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const wx = atEdgeX(x) ? x : x + Math.sin(i * 2.7) * 0.35, wz = atEdgeZ(z) ? z : z + Math.cos(i * 1.9) * 0.35; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const coast = (pts: [number, number][], sign: number, d: number) => pts.map(([x, z], i) => { const [px, pz] = pts[(i + pts.length - 1) % pts.length], [nx, nz] = pts[(i + 1) % pts.length]; const e0 = [x - px, z - pz], e1 = [nx - x, nz - z]; const l0 = Math.hypot(e0[0], e0[1]) || 1, l1 = Math.hypot(e1[0], e1[1]) || 1; let ox = (-e0[1] / l0 - e1[1] / l1), oz = (e0[0] / l0 + e1[0] / l1); const l = Math.hypot(ox, oz) || 1; ox = (ox / l) * d * sign; oz = (oz / l) * d * sign; if (atEdgeX(x)) ox = 0; if (atEdgeZ(z)) oz = 0; return [x + ox, z + oz] as [number, number]; });
  const blackSea: [number, number][] = [[38, 2], [38, 28], [24, 28], [25, 25], [28.5, 21], [32, 15], [33.5, 8], [34, 3]];
  for (const pts of [blackSea]) {
    const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(coast(pts, -1, 1.2))), mat("#e6dfc4")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
    const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(pts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; seaM.name = "black-sea"; group.add(seaM);
  }
  const danubeC = new THREE.CatmullRomCurve3([new THREE.Vector3(8, 0, -28), new THREE.Vector3(8, 0, -26.5), new THREE.Vector3(7, 0, -20), new THREE.Vector3(8, 0, -12), new THREE.Vector3(6.5, 0, -4), new THREE.Vector3(7.5, 0, 4), new THREE.Vector3(6.5, 0, 12), new THREE.Vector3(7.5, 0, 20), new THREE.Vector3(7, 0, 26.5), new THREE.Vector3(7, 0, 28)]);
  add(group, new THREE.Mesh(riverGeometry(danubeC, 5.2), mat("#e6dfc4")), 0, 0.022, 0);
  const danubeM = new THREE.Mesh(riverGeometry(danubeC, 3.6), danube); danubeM.position.y = 0.068; danubeM.renderOrder = 2; danubeM.name = "danube"; group.add(danubeM);
  addFish(ctx, danubeC, [["#8fa3b5", "#d9dee3"], ["#6f8f6f", "#c9d6b0"]], 1.0, 0.28);
  const disc = (x: number, z: number, rx: number, rz: number, m: THREE.Material, rim: string, rimW = 0.8) => { const r = new THREE.Mesh(new THREE.CircleGeometry(1, 36), mat(rim)); r.rotation.x = -Math.PI / 2; r.position.set(x, TOP + 0.03, z); r.scale.set(rx + rimW, rz + rimW, 1); group.add(r); const w = new THREE.Mesh(new THREE.CircleGeometry(1, 36), m); w.rotation.x = -Math.PI / 2; w.position.set(x, TOP + 0.064, z); w.scale.set(rx, rz, 1); w.renderOrder = 2; group.add(w); };
  disc(-8, 18, 3.4, 2.4, lake, "#e6dfc4");   // an alpine lake
  const poolM = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 4.6), pool); poolM.rotation.x = -Math.PI / 2; poolM.position.set(16, TOP + 0.24, -17.4); poolM.renderOrder = 2; group.add(poolM);   // the Széchenyi pool
  // boats
  const cruise = new THREE.Group(); add(cruise, new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 1.1), mat(CE.white)), 0, 0.25, 0); add(cruise, new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 1.0), mat(CE.glass)), -0.2, 0.7, 0); add(cruise, new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.1), mat(CE.white)), -0.2, 0.98, 0); group.add(cruise);
  tickers.push((t) => { const raw = (t * 0.02) % 2; const u = raw < 1 ? raw : 2 - raw; const uu = 0.5 + u * 0.42; const p = danubeC.getPointAt(uu), n = danubeC.getPointAt(uu + (raw < 1 ? 0.01 : -0.01)); cruise.position.set(p.x, TOP + 0.05, p.z); cruise.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; });
  const ships = [ferry(), ferry()]; ships.forEach((s) => { group.add(s); tickers.push(s.userData.tick!); });
  const lane = new THREE.CatmullRomCurve3([[35.5, 5], [37, 12], [36, 20], [32, 25.5], [29.5, 23.5], [33, 16], [35, 9]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => ships.forEach((s, i) => { const u = (t * 0.007 + i / 2) % 1; const p = lane.getPointAt(u), n = lane.getPointAt((u + 0.005) % 1); s.position.set(p.x, TOP + 0.05, p.z); s.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));

  // anything crossing a bridge rides up onto its deck: Westminster Bridge, Tower Bridge and the Chain Bridge
  const decks: [number, number, number][] = [[-44, 2.85, 3.0], [-39.4, 3.9, 4.0], [6.5, -4, 6.5]];
  const deckY = (x: number, z: number) => { let y = 0; for (const [bx, bz, half] of decks) { if (Math.abs(z - bz) > 1.6) continue; const d = Math.abs(x - bx); if (d < half) y = Math.max(y, 0.9 * Math.min(1, (half - d) / 1.2)); } return y; };

  // ---------- Britain: the built clusters, then the country between them ----------
  londonTown(ctx);
  londonCountryside(ctx);

  // ---------- the Alps ----------
  const snowy = (r: number, h: number, dark: boolean, x: number, z: number) => { const m = mountain(r, h, dark); place(m, x, z); add(group, new THREE.Mesh(new THREE.ConeGeometry(r * 0.44, h * 0.33, 12), mat("#f4f1ea")), x, TOP + h * 0.885, z); };
  // The two western peaks stood at [-34.5, 12] and [-33, 4], which the strait now runs through. Both moved
  // east into the lead's band of x -33 to -7, clear of every Alpine pine, peak and clickable by their own
  // radius plus a unit, and the second's base is 0.6 clear of the strait's eastern shore at x -31.4.
  snowy(5.5, 10, false, -28, 22); snowy(4.2, 8, true, -20, 25.5); snowy(3.6, 6.5, false, -22.5, 16.5); snowy(4.5, 8.5, false, -11, 25.5); place(mountain(3.0, 5.5, true), -27.8, 2.6);
  for (const [x, z, s] of [[-24, 4, 1.2], [-30, 8, 1.0], [-16, 21, 1.1], [-26, 12.5, 0.9], [-14, 3, 1.0], [-4, 24, 1.1], [-3, 14, 0.9], [-30, 16.5, 1.0]] as [number, number, number][]) place(tree("pine", s), x, z, x);
  const lift = cableCarAlps(9.55, 7); lift.position.set(-13, TOP, 19); lift.rotation.y = Math.atan2(-6.5, -7); group.add(lift); tickers.push(lift.userData.tick!);
  const rowboat = new THREE.Group(); add(rowboat, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.7), mat(CE.wood)), 0, 0.15, 0); const rower = local("#c0392b", { alpine: true }); rower.userData.sit?.(); rower.scale.setScalar(0.75); rower.position.set(-0.1, 0.3, 0); rowboat.add(rower); group.add(rowboat);
  tickers.push((t) => { const a = t * 0.2; rowboat.position.set(-8 + Math.cos(a) * 2.0, TOP + 0.06, 18 + Math.sin(a) * 1.3); rowboat.rotation.y = -a; });
  for (let i = 0; i < 2; i++) { const hiker = local(["#3f5f8f", "#c0392b"][i], { alpine: true }); place(hiker, -24 + i * 0.7, 8.5, 0.6 + i); }

  // ---------- Budapest & the puszta ----------
  group.add(path([[10.6, -7], [10.6, -13], [10.5, -23], [14, -25.5], [19.5, -25.5], [22.5, -20], [22, -12], [19.5, -8], [13.5, -6], [11, -5.5], [10.6, -7]], 1.8, "#cfc6a8"));
  for (let i = 0; i < 2; i++) place(local([CE.white, "#3f5f8f"][i], { flatCap: i === 0 }), 4.5 + i * 0.6, -12, -1.0 + i * 2.2);
  const bpWalkers = Array.from({ length: 6 }, (_, i) => local([CE.white, "#3f5f8f", "#8a2a2a", "#2a2a2e", "#2f5d3f", CE.white][i], { flatCap: i % 2 === 0 })); bpWalkers.forEach((w) => group.add(w));
  const bpLoop = new THREE.CatmullRomCurve3([[10.6, -7], [10.6, -13], [10.5, -23], [14, -25.5], [19.5, -25.5], [22.5, -20], [22, -12], [19.5, -8], [13.5, -6], [11, -5.5]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => bpWalkers.forEach((w, i) => { const u = (t * 0.005 + i / 6) % 1; const p = bpLoop.getPointAt(u), n = bpLoop.getPointAt((u + 0.004) % 1); w.position.set(p.x, deckY(p.x, p.z), p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  const trailPts: [number, number][] = [[10, 13.5], [18.5, 13], [19.5, 22], [11, 23.5]];
  const trail = new THREE.CatmullRomCurve3(trailPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  group.add(path([...trailPts, trailPts[0]], 1.4, "#d9c7a0"));
  const riders = [horse("#3a2a1e"), horse("#6b4a2c")]; riders.forEach((h) => { const r = local("#3f5f8f", { csikos: true }); r.userData.sit?.(); add(h, r, 0, 1.3, 0); r.rotation.y = Math.PI / 2; r.scale.setScalar(0.9); add(r, new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.4), mat(CE.white)), 0, 0.4, 0); group.add(h); });
  tickers.push((t) => riders.forEach((h, i) => { const u = (t * 0.012 + i / 2) % 1; const p = trail.getPointAt(u), n = trail.getPointAt((u + 0.004) % 1); h.position.set(p.x, 0, p.z); h.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; h.userData.gait?.(t + i, 1); }));
  for (const [x, z] of [[-1, 4], [3, 14], [-3, 22], [16, 25], [2, 25.5], [-2, -25]] as [number, number][]) place(tree("round", 1.0), x, z, x);
  const storks = birds(3, 6, 8); storks.position.set(13, TOP, 14); group.add(storks); tickers.push(storks.userData.tick!);

  // ---------- Georgia ----------
  snowy(4, 8, false, 26.5, -25); snowy(4, 8, true, 33, -25); snowy(3.5, 6.5, false, 34.5, -18);
  group.add(path([[22, -8.2], [34, -8.2], [35, -1], [26, -1.5], [21, -4], [22, -8.2]], 1.6, "#d3c8ad"));
  const geLoop = new THREE.CatmullRomCurve3([[22, -8.2], [34, -8.2], [35, -1], [26, -1.5], [21, -4]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  const geWalkers = Array.from({ length: 5 }, (_, i) => local(["#2a2a2e", CE.white, "#8a2a2a", "#3f5f8f", "#2a2a2e"][i], { papakha: i % 2 === 0, scarf: i === 1 ? "#c0392b" : undefined })); geWalkers.forEach((w) => group.add(w));
  tickers.push((t) => geWalkers.forEach((w, i) => { const u = (t * 0.005 + i / 5) % 1; const p = geLoop.getPointAt(u), n = geLoop.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  for (const [x, z, s] of [[21, 0, 1.0], [34, 6, 0.9], [20, 24, 1.1], [30, 15, 1.0], [23, -1, 0.9]] as [number, number, number][]) place(tree("round", s), x, z, x);
  for (const [x, z] of [[36, -8], [21, -14], [37, -14]] as [number, number][]) place(tree("pine", 1.1), x, z, x);
  const gulls = birds(5, 6, 7); gulls.position.set(32, TOP, 16); group.add(gulls); tickers.push(gulls.userData.tick!);
}
