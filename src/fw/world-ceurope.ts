/** Central Europe: London on the Thames in the north-west, the Alps below it, Budapest and the puszta on the Danube down the middle, Georgia and the Black Sea to the east. Objects come from graph.ts. */
import * as THREE from "three";
import { CEUROPE_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, path, birds, mountain, tree } from "./props";
import { CEUROPE_PROPS, redBus, blackCab, cableCarAlps, ferry, local, CE } from "./props-ceurope";
import { horse } from "./props-namerica";
import { buildWorld, riverGeometry, seaWater, freshWater, estuaryWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildCeurope(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "central-europe", W: 76, D: 56, ground: "#8fb56a", plinth: "#5a4a3a", recipes, objects: CEUROPE_OBJECTS, props: CEUROPE_PROPS,
    small: /^(phoneBox|khmeli|redBus|cableCar)$/, fallbackPlace: "roastPub",
    layout: layoutCeurope,
  });
}

function layoutCeurope({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(-20, -15, 12, 12, "#b8b4ad", 0.06);       // London's paving
  tint(-20, 14, 13, 13, "#9fc27a", 0.03);        // alpine meadow
  tint(13, 12, 9, 12, "#c9c48a", 0.05);          // the puszta's dry grass
  tint(28, -2, 10, 10, "#c9b784", 0.05);         // Tbilisi's ochre

  // ---------- water: the Channel in the north-west, the Black Sea east, the Thames and the Danube ----------
  const sea = seaWater(), thames = estuaryWater(-34.5, -6, 4), danube = freshWater(), lake = freshWater(), pool = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; thames.uniforms.uTime.value = t; danube.uniforms.uTime.value = t; lake.uniforms.uTime.value = t; pool.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.35, wz = edge ? z : z + Math.cos(i * 1.9) * 0.35; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const coast = (pts: [number, number][], sign: number, d: number) => pts.map(([x, z], i) => { const [px, pz] = pts[(i + pts.length - 1) % pts.length], [nx, nz] = pts[(i + 1) % pts.length]; const e0 = [x - px, z - pz], e1 = [nx - x, nz - z]; const l0 = Math.hypot(e0[0], e0[1]) || 1, l1 = Math.hypot(e1[0], e1[1]) || 1; let ox = (-e0[1] / l0 - e1[1] / l1), oz = (e0[0] / l0 + e1[0] / l1); const l = Math.hypot(ox, oz) || 1; ox = (ox / l) * d * sign; oz = (oz / l) * d * sign; if (Math.abs(x) >= 38) ox = 0; if (Math.abs(z) >= 28) oz = 0; return [x + ox, z + oz] as [number, number]; });
  const channel: [number, number][] = [[-38, -28], [-33, -28], [-34, -22.5], [-33.5, -17], [-34, -11], [-34.5, -6], [-35.5, -2], [-38, 0]];
  const blackSea: [number, number][] = [[38, 2], [38, 28], [24, 28], [25, 25], [28.5, 21], [32, 15], [33.5, 8], [34, 3]];
  for (const pts of [channel, blackSea]) {
    const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(coast(pts, -1, 1.2))), mat("#e6dfc4")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
    const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(pts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  }
  const thamesC = new THREE.CatmullRomCurve3([new THREE.Vector3(-18, 0, -28), new THREE.Vector3(-18, 0, -26.5), new THREE.Vector3(-19, 0, -20), new THREE.Vector3(-17.5, 0, -14), new THREE.Vector3(-19.5, 0, -9), new THREE.Vector3(-24, 0, -6), new THREE.Vector3(-28.5, 0, -5.5), new THREE.Vector3(-32, 0, -6), new THREE.Vector3(-35.5, 0, -6.2)]);
  add(group, new THREE.Mesh(riverGeometry(thamesC, 5.0), mat("#e6dfc4")), 0, 0.022, 0);
  const thamesM = new THREE.Mesh(riverGeometry(thamesC, 3.4), thames); thamesM.position.y = 0.068; thamesM.renderOrder = 2; group.add(thamesM);
  const danubeC = new THREE.CatmullRomCurve3([new THREE.Vector3(8, 0, -28), new THREE.Vector3(8, 0, -26.5), new THREE.Vector3(7, 0, -20), new THREE.Vector3(8, 0, -12), new THREE.Vector3(6.5, 0, -4), new THREE.Vector3(7.5, 0, 4), new THREE.Vector3(6.5, 0, 12), new THREE.Vector3(7.5, 0, 20), new THREE.Vector3(7, 0, 26.5), new THREE.Vector3(7, 0, 28)]);
  add(group, new THREE.Mesh(riverGeometry(danubeC, 5.2), mat("#e6dfc4")), 0, 0.022, 0);
  const danubeM = new THREE.Mesh(riverGeometry(danubeC, 3.6), danube); danubeM.position.y = 0.068; danubeM.renderOrder = 2; group.add(danubeM);
  addFish({ group, tickers, place, tint, TOP }, danubeC, [["#8fa3b5", "#d9dee3"], ["#6f8f6f", "#c9d6b0"]], 1.0, 0.28);
  const disc = (x: number, z: number, rx: number, rz: number, m: THREE.Material, rim: string, rimW = 0.8) => { const r = new THREE.Mesh(new THREE.CircleGeometry(1, 36), mat(rim)); r.rotation.x = -Math.PI / 2; r.position.set(x, TOP + 0.03, z); r.scale.set(rx + rimW, rz + rimW, 1); group.add(r); const w = new THREE.Mesh(new THREE.CircleGeometry(1, 36), m); w.rotation.x = -Math.PI / 2; w.position.set(x, TOP + 0.064, z); w.scale.set(rx, rz, 1); w.renderOrder = 2; group.add(w); };
  disc(-8, 18, 3.4, 2.4, lake, "#e6dfc4");   // an alpine lake
  const poolM = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 4.6), pool); poolM.rotation.x = -Math.PI / 2; poolM.position.set(14, TOP + 0.24, -17.4); poolM.renderOrder = 2; group.add(poolM);   // the Széchenyi pool
  // the bridges
  const wb = new THREE.Group(); add(wb, new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.3, 2.6), mat(CE.stone)), 0, 0.75, 0); for (const sd of [-1, 1]) add(wb, new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.5, 0.1), mat("#3f6b3a")), 0, 1.1, sd * 1.27); for (const x of [-2.4, 0, 2.4]) add(wb, new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 12, 1, false, 0, Math.PI), mat(CE.stone)), x, 0.5, 0).rotation.set(0, 0, Math.PI / 2); for (let k = 0; k < 4; k++) { add(wb, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 5), mat("#1a1a1e")), -2.7 + k * 1.8, 1.5, 1.2); add(wb, new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), mat("#f2e6a0")), -2.7 + k * 1.8, 2.0, 1.2); } const wbp = thamesC.getPointAt(0.53); wb.position.set(wbp.x, TOP, wbp.z); group.add(wb);   // Westminster Bridge
  // boats
  const cruise = new THREE.Group(); add(cruise, new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 1.1), mat(CE.white)), 0, 0.25, 0); add(cruise, new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 1.0), mat(CE.glass)), -0.2, 0.7, 0); add(cruise, new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.1), mat(CE.white)), -0.2, 0.98, 0); group.add(cruise);
  tickers.push((t) => { const raw = (t * 0.02) % 2; const u = raw < 1 ? raw : 2 - raw; const uu = 0.5 + u * 0.42; const p = danubeC.getPointAt(uu), n = danubeC.getPointAt(uu + (raw < 1 ? 0.01 : -0.01)); cruise.position.set(p.x, TOP + 0.05, p.z); cruise.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; });
  const ships = [ferry(), ferry()]; ships.forEach((s) => { group.add(s); tickers.push(s.userData.tick!); });
  const lane = new THREE.CatmullRomCurve3([[35, 6], [36.5, 14], [34, 22], [30.5, 25.5], [33, 18], [35.5, 10]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => ships.forEach((s, i) => { const u = (t * 0.007 + i / 2) % 1; const p = lane.getPointAt(u), n = lane.getPointAt((u + 0.005) % 1); s.position.set(p.x, TOP + 0.05, p.z); s.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));

  // anything crossing a bridge rides up onto its deck
  const decks: [number, number, number][] = [[-19, -22, 6.5], [-19.5, -9, 4.4], [6.5, -4, 6.5]];
  const deckY = (x: number, z: number) => { let y = 0; for (const [bx, bz, half] of decks) { if (Math.abs(z - bz) > 1.6) continue; const d = Math.abs(x - bx); if (d < half) y = Math.max(y, 0.9 * Math.min(1, (half - d) / 1.2)); } return y; };
  // ---------- London ----------
  const ldnPts: [number, number][] = [[-30, -22], [-10, -22], [-10, -9], [-30, -9]];
  const ldnLoop = new THREE.CatmullRomCurve3(ldnPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true, "catmullrom", 0.0);
  ldnPts.forEach((a, i) => { const b = ldnPts[(i + 1) % ldnPts.length]; const seg = path([a, b], 2.2, "#6e6e72"); seg.position.y = 0.03 + 0.004 * (i % 2 + 1); group.add(seg); });
  const traffic = [redBus(), blackCab("#1a1a1e"), blackCab("#1a1a1e"), redBus()]; traffic.forEach((v) => group.add(v));
  tickers.push((t) => traffic.forEach((v, i) => { const u = (t * 0.026 + i / 4) % 1; const p = ldnLoop.getPointAt(u), n = ldnLoop.getPointAt((u + 0.003) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; const vx = p.x + (dz / l) * 0.5, vz = p.z - (dx / l) * 0.5; v.position.set(vx, TOP + deckY(vx, vz), vz); v.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; }));
  const ldnWalkers = Array.from({ length: 7 }, (_, i) => local([CE.white, "#2a2a2e", "#3f5f8f", "#8a2a2a", "#2f5d3f", CE.white, "#c9a86a"][i], { bowler: i % 3 === 0, brolly: i % 3 === 0, flatCap: i % 3 === 1 })); ldnWalkers.forEach((w) => group.add(w));
  tickers.push((t) => ldnWalkers.forEach((w, i) => { const u = (t * 0.006 + i / 7) % 1; const p = ldnLoop.getPointAt(u), n = ldnLoop.getPointAt((u + 0.004) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; const wx = p.x - (dz / l) * 0.85, wz = p.z + (dx / l) * 0.85; w.position.set(wx, deckY(wx, wz), wz); w.rotation.y = Math.atan2(dx, dz); w.userData.walk?.(t + i); }));
  for (const [x, z] of [[-31.5, -12], [-8.5, -26], [-8, -12], [-31, -25]] as [number, number][]) place(tree("round", 1.0), x, z, x);
  for (const [x, z] of [[-24, -19.5], [-22, -12]] as [number, number][]) { for (let i = 0; i < 2; i++) place(local([CE.white, "#3f5f8f"][i], { bowler: i === 0, brolly: i === 0 }), x + i * 0.6, z, -1.2 + i * 2.5); }
  const pigeons = birds(5, 4, 5); pigeons.position.set(-20, TOP, -15); group.add(pigeons); tickers.push(pigeons.userData.tick!);

  // ---------- the Alps ----------
  const snowy = (r: number, h: number, dark: boolean, x: number, z: number) => { const m = mountain(r, h, dark); place(m, x, z); add(group, new THREE.Mesh(new THREE.ConeGeometry(r * 0.44, h * 0.33, 12), mat("#f4f1ea")), x, TOP + h * 0.885, z); };
  snowy(5.5, 10, false, -28, 22); snowy(4.2, 8, true, -20, 25.5); snowy(3.6, 6.5, false, -34.5, 12); snowy(4.5, 8.5, false, -11, 25.5); place(mountain(3.0, 5.5, true), -33, 4);
  for (const [x, z, s] of [[-24, 4, 1.2], [-30, 8, 1.0], [-16, 21, 1.1], [-26, 12.5, 0.9], [-14, 3, 1.0], [-4, 24, 1.1], [-3, 14, 0.9], [-30, 16.5, 1.0]] as [number, number, number][]) place(tree("pine", s), x, z, x);
  const lift = cableCarAlps(9.55, 7); lift.position.set(-13, TOP, 19); lift.rotation.y = Math.atan2(-6.5, -7); group.add(lift); tickers.push(lift.userData.tick!);
  const rowboat = new THREE.Group(); add(rowboat, new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.7), mat(CE.wood)), 0, 0.15, 0); const rower = local("#c0392b", { alpine: true }); rower.userData.sit?.(); rower.scale.setScalar(0.75); rower.position.set(-0.1, 0.3, 0); rowboat.add(rower); group.add(rowboat);
  tickers.push((t) => { const a = t * 0.2; rowboat.position.set(-8 + Math.cos(a) * 2.0, TOP + 0.06, 18 + Math.sin(a) * 1.3); rowboat.rotation.y = -a; });
  for (let i = 0; i < 2; i++) { const hiker = local(["#3f5f8f", "#c0392b"][i], { alpine: true }); place(hiker, -24 + i * 0.7, 8.5, 0.6 + i); }

  // ---------- Budapest & the puszta ----------
  group.add(path([[-2, -22], [-2, -8], [0.5, -4], [12.5, -4], [18, -7], [18, -22], [14, -24], [-2, -22]], 1.8, "#cfc6a8"));
  const bpWalkers = Array.from({ length: 6 }, (_, i) => local([CE.white, "#3f5f8f", "#8a2a2a", "#2a2a2e", "#2f5d3f", CE.white][i], { flatCap: i % 2 === 0 })); bpWalkers.forEach((w) => group.add(w));
  const bpLoop = new THREE.CatmullRomCurve3([[-2, -22], [-2, -8], [0.5, -4], [12.5, -4], [18, -7], [18, -22], [14, -24]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => bpWalkers.forEach((w, i) => { const u = (t * 0.005 + i / 6) % 1; const p = bpLoop.getPointAt(u), n = bpLoop.getPointAt((u + 0.004) % 1); w.position.set(p.x, deckY(p.x, p.z), p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  const trailPts: [number, number][] = [[10, 13.5], [18.5, 13], [19.5, 22], [11, 23.5]];
  const trail = new THREE.CatmullRomCurve3(trailPts.map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  group.add(path([...trailPts, trailPts[0]], 1.4, "#d9c7a0"));
  const riders = [horse("#3a2a1e"), horse("#6b4a2c")]; riders.forEach((h) => { const r = local("#3f5f8f", { csikos: true }); r.userData.sit?.(); add(h, r, 0, 1.3, 0); r.rotation.y = Math.PI / 2; r.scale.setScalar(0.9); add(r, new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.4), mat(CE.white)), 0, 0.4, 0); group.add(h); });
  tickers.push((t) => riders.forEach((h, i) => { const u = (t * 0.012 + i / 2) % 1; const p = trail.getPointAt(u), n = trail.getPointAt((u + 0.004) % 1); h.position.set(p.x, 0, p.z); h.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; h.userData.gait?.(t + i, 1); }));
  for (const [x, z] of [[-1, 4], [3, 14], [-3, 22], [16, 25], [2, 25.5], [-2, -25]] as [number, number][]) place(tree("round", 1.0), x, z, x);
  const storks = birds(3, 6, 8); storks.position.set(13, TOP, 14); group.add(storks); tickers.push(storks.userData.tick!);

  // ---------- Georgia ----------
  snowy(5, 10, false, 25, -24); snowy(4, 8, true, 33, -25); snowy(3.5, 6.5, false, 34.5, -18); place(mountain(3, 5.5, true), 20.5, -21);
  group.add(path([[22, -9.5], [34, -9.5], [35, -1], [26, -1.5], [21, -4], [22, -9.5]], 1.6, "#d3c8ad"));
  const geLoop = new THREE.CatmullRomCurve3([[22, -9.5], [34, -9.5], [35, -1], [26, -1.5], [21, -4]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  const geWalkers = Array.from({ length: 5 }, (_, i) => local(["#2a2a2e", CE.white, "#8a2a2a", "#3f5f8f", "#2a2a2e"][i], { papakha: i % 2 === 0, scarf: i === 1 ? "#c0392b" : undefined })); geWalkers.forEach((w) => group.add(w));
  tickers.push((t) => geWalkers.forEach((w, i) => { const u = (t * 0.005 + i / 5) % 1; const p = geLoop.getPointAt(u), n = geLoop.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  for (const [x, z, s] of [[21, 0, 1.0], [34, 6, 0.9], [20, 24, 1.1], [30, 15, 1.0], [23, -1, 0.9]] as [number, number, number][]) place(tree("round", s), x, z, x);
  for (const [x, z] of [[36, -8], [21, -14], [37, -14]] as [number, number][]) place(tree("pine", 1.1), x, z, x);
  const gulls = birds(5, 6, 7); gulls.position.set(32, TOP, 16); group.add(gulls); tickers.push(gulls.userData.tick!);
}
