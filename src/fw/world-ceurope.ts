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
import { londonLandscape, LD_CROSSINGS } from "./london-landscape";
import { masonry } from "./turkey-architecture";
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

  // Anything crossing a bridge rides up onto its deck. The Budapest walkers are the only ones who read this
  // table, over the Chain Bridge; Britain's walkers take their decks from `LD_CROSSINGS`. The British entry is
  // Westminster Bridge where the shared-ground pass put it (the old list still had it at [-44, 2.85] and Tower
  // Bridge at [-39.4, 3.9]); Tower Bridge carries no walker and no road, so it is not a deck here.
  const decks: [number, number, number][] = [...LD_CROSSINGS.map(c => [c.at[0], c.at[1], c.span / 2] as [number, number, number]), [6.5, -4, 6.5]];
  const deckY = (x: number, z: number) => { let y = 0; for (const [bx, bz, half] of decks) { if (Math.abs(z - bz) > 1.6) continue; const d = Math.abs(x - bx); if (d < half) y = Math.max(y, 0.9 * Math.min(1, (half - d) / 1.2)); } return y; };

  // ---------- Britain: the built clusters, then the country between them ----------
  londonTown(ctx);
  londonCountryside(ctx);

  // ---------- the Alps ----------
  const snowy = (r: number, h: number, dark: boolean, x: number, z: number) => { const m = mountain(r, h, dark); place(m, x, z); add(group, new THREE.Mesh(new THREE.ConeGeometry(r * 0.44, h * 0.33, 12), mat("#f4f1ea")), x, TOP + h * 0.885, z); };
  // The two western peaks stood at [-34.5, 12] and [-33, 4], which the strait now runs through. Both moved
  // east into the lead's band of x -33 to -7, clear of every Alpine pine, peak and clickable by their own
  // radius plus a unit, and the second's base is 0.6 clear of the strait's eastern shore at x -31.4.
  // The two peaks that moved out of the strait are green foothills now, [-22.5, 16.5] 2.8 high and [-27.8, 2.6]
  // 2.4 high, where they were a 6.5 snow peak and a 5.5 dark cone: from the oyster smacks' and Tower Bridge's
  // card approach, 28 units out, the snow peak filled half the frame across the strait (walkthrough item 15,
  // 2026-09-23). Both keep their places and radii, so nothing Alpine moves; the Alps' own snow peaks stand
  // behind them as before. The nearest of those, [-28, 22], was 10 high and still filled the lower right of the
  // oyster smacks' card view, and the card camera's swing is clamped to 0.75 radians, so no approach clears it: it
  // is 6.7 high now, a third lower, same place and radius (residual fixes, 2026-09-23).
  snowy(5.5, 6.7, false, -28, 22); snowy(4.2, 8, true, -20, 25.5); place(mountain(3.6, 2.8, false), -22.5, 16.5); snowy(4.5, 8.5, false, -11, 25.5); place(mountain(3.0, 2.4, false), -27.8, 2.6);
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

  // ---------- the continent between the strait and the Danube ----------
  continentCountry(ctx);
}

/** The farmland between the strait and the Danube, x -30 to -3 and z -27 to -2, where the old London street
 *  stood until the table grew: from the zoom-out limit it was an empty lawn beside a crowded Britain
 *  (walkthrough item 14, 2026-09-23). It is laid in the continental way: long open-field strips in blocks
 *  that turn at the headlands, a vineyard on a south-facing slope, hedgerows only along the lanes and the
 *  block edges, woods of spruce and beech, a white farmstead with a steep red roof, and haystacks. Nothing here
 *  is clickable, nothing stands south of z -1.5 (the Alpine meadow and its foothill begin there), nothing east
 *  of x -3 (the Parliament is at x 1), and nothing draws on the shared random stream, so every Alpine,
 *  Hungarian and Georgian object is built exactly as before. Built after them, merged by material. */
function continentCountry(ctx: LayoutCtx) {
  const { group, TOP } = ctx;
  // one material per colour, so the merge below leaves one mesh per colour instead of one per piece
  const mats = new Map<string, THREE.Material>();
  const cm = (c: string): THREE.Material => { let m = mats.get(c); if (!m) { m = mat(c); mats.set(c, m); } return m; };
  const cyl = (rt: number, rb: number, h: number, c: string, seg = 8) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), cm(c));
  const cone = (r: number, h: number, c: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), cm(c));
  const flat = new THREE.Group(), solid = new THREE.Group();
  const strip = (x: number, z: number, w: number, d: number, colour: string, y = .014) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .02, d), cm(colour)); m.position.set(x, TOP + y, z); flat.add(m); return m; };
  const crops = ['#d8c27a', '#8fae5a', '#c9b25e', '#8a6e4e', '#a8c46a', '#d9cf4a', '#cbbd8e', '#7fa252'];
  // Block A, west: strips running north to south, each 1.2 wide with a green balk between them.
  for (let i = 0; i < 8; i++) { const x = -29.2 + i * 1.3, c = crops[(i * 3) % crops.length]; strip(x, -20.5, 1.18, 10.6, c); if (i % 2 === 0) for (let k = 0; k < 7; k++) strip(x, -25.3 + k * 1.6, 1.0, .07, '#8a7a52', .026); }
  // Block B, middle: strips running east to west across the headland.
  for (let i = 0; i < 7; i++) { const z = -25.9 + i * 1.3, c = crops[(i * 5 + 2) % crops.length]; strip(-13.6, z, 9.6, 1.18, c); }
  // Block C, north-west: pasture and a rapeseed field either side of the lane.
  strip(-25.6, -6.4, 7.4, 5.4, '#9cc06a'); strip(-17.9, -6.4, 6.4, 5.4, '#d9cf4a');
  for (let k = 0; k < 6; k++) strip(-17.9, -8.7 + k * .9, 6.2, .06, '#b8ae3a', .026);
  // The vineyard: rows of vines on the slope north of the lane, low green bands on bare earth.
  strip(-8.2, -6.2, 8.2, 5.6, '#9a8468');
  for (let k = 0; k < 9; k++) { const row = new THREE.Mesh(new THREE.BoxGeometry(7.6, .34, .22), cm('#5f7f3a')); row.position.set(-8.2, TOP + .19, -8.6 + k * .6); solid.add(row); }
  // The lane from the strait to Budapest, and a cart track up the middle.
  group.add(path([[-30.2, -12.6], [-24, -12.4], [-17, -13.0], [-10, -12.2], [-3, -12.8]], 1.2, '#cdbf9c'));
  group.add(path([[-18.4, -12.8], [-18.6, -8.5], [-18.2, -3.6]], .9, '#cdbf9c'));
  // Hedgerows along the lane and at the block edges: low, rounded, broken where a gate goes through.
  const hedge = (x0: number, z0: number, x1: number, z1: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, z1 - z0) / .55));
    for (let i = 0; i <= n; i++) { if (i % 9 === 8) continue; const t = i / n, m = new THREE.Mesh(new THREE.IcosahedronGeometry(.3, 1), cm(i % 2 ? '#4a6a34' : '#56773c')); m.scale.set(1.2, .8, 1.2); m.position.set(x0 + (x1 - x0) * t, TOP + .24, z0 + (z1 - z0) * t); solid.add(m); }
  };
  hedge(-29.8, -13.6, -19.4, -13.6); hedge(-17.4, -13.8, -4, -13.6); hedge(-29.8, -11.4, -19.4, -11.3); hedge(-17.4, -11.2, -4, -11.2);
  hedge(-18.2, -15.2, -18.2, -26.6); hedge(-29.6, -3.4, -19.6, -3.4);
  // Woods: spruce and beech, deterministic, in two stands and a copse.
  const spruce = (x: number, z: number, s: number) => { add(solid, cyl(.1 * s, .14 * s, .8 * s, '#5a4a38', 6), x, TOP + .4 * s, z); for (let k = 0; k < 3; k++) add(solid, cone((.95 - k * .25) * s, 1.1 * s, k % 2 ? '#35573a' : '#2f4f35', 8), x, TOP + (1.0 + k * .62) * s, z); };
  const beech = (x: number, z: number, s: number) => { add(solid, cyl(.12 * s, .18 * s, 1.3 * s, '#6e6250', 7), x, TOP + .65 * s, z); for (const [dx, dy, dz, r] of [[0, 1.9, 0, .95], [.45, 1.55, .3, .62], [-.42, 1.62, -.28, .6]] as [number, number, number, number][]) { const m = add(solid, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), cm('#5f8a44')), x + dx * s, TOP + dy * s, z + dz * s); m.scale.set(1.15, .9, 1.15); } };
  const wood: [number, number, number, number][] = [
    [-6.2, -24.8, 1.0, 0], [-4.6, -23.2, .9, 1], [-7.4, -22.6, 1.1, 0], [-5.4, -21.2, .95, 1], [-3.8, -25.8, .85, 0], [-7.8, -25.9, .9, 1], [-3.6, -21.9, 1.0, 0],
    [-27.8, -9.6, 1.0, 1], [-29.0, -8.2, .9, 0], [-26.6, -8.6, .85, 1],
    [-12.6, -3.2, .9, 1], [-14.2, -2.6, .8, 0], [-22.6, -26.2, .9, 0], [-24.2, -26.4, .85, 1],
  ];
  for (const [x, z, sc, kind] of wood) (kind ? beech : spruce)(x, z, sc);
  // The farmstead: white walls, a steep red-tiled roof, a barn and three haystacks in the yard.
  const house = (x: number, z: number, w: number, d: number, h: number, wall: string, roof: string) => {
    add(solid, new THREE.Mesh(new THREE.BoxGeometry(w, h, d), cm(wall)), x, TOP + h / 2, z);
    // a steep gable roof: a triangle across the depth, run the length of the house, with a little eave all round
    const tri = new THREE.Shape([new THREE.Vector2(-d / 2 - .15, 0), new THREE.Vector2(d / 2 + .15, 0), new THREE.Vector2(0, d * .75)]);
    const roofGeo = new THREE.ExtrudeGeometry(tri, { depth: w + .3, bevelEnabled: false }); roofGeo.translate(0, 0, -(w + .3) / 2);
    const r = add(solid, new THREE.Mesh(roofGeo, cm(roof)), x, TOP + h, z); r.rotation.y = Math.PI / 2;
  };
  house(-23.4, -16.6, 2.6, 1.7, 1.1, '#efe9dc', '#b0442e'); house(-20.6, -16.9, 2.0, 1.5, 1.3, '#8a6a4a', '#7a4a34');
  for (const [x, z] of [[-22.2, -18.6], [-21.2, -18.9], [-23.8, -18.8]] as [number, number][]) { add(solid, cone(.42, .9, '#d6c27e', 10), x, TOP + .45, z); }
  group.add(masonry(flat)); group.add(masonry(solid));
}
