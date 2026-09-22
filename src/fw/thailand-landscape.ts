/** Ground, water and relief on the grown Southeast Asia table.
 *
 *  The sea is one polygon for the whole table — the Andaman on the west, the Gulf of Thailand becoming the
 *  South China Sea on the south, Vietnam's coast on the east — so it is built here, in Thailand's landscape,
 *  and `vietnam-landscape.ts` does not own it.
 *
 *  The Vietnamese rivers are NOT laid here. The Stage C brief asked this file for them on the assumption that
 *  `vietnam-landscape.ts` would still be an empty stub; by the time the table was grown that file existed and
 *  already laid the Red River, the Perfume River, the three Mekong channels, Hoàn Kiếm lake and the Hạ Long
 *  karsts, with its own corrections (the lake is an ellipse so the lakeside path stays dry, the puppet tank is
 *  the stand's own pool). Building them twice would put two ribbons in one place. The sea's east and south
 *  margin is still cut to meet those mouths, which is this file's side of the join.
 *
 *  Owner rule, 2026-09-21: the dark-to-light blue transition of this table's water is kept. `seaWater()`,
 *  `freshWater()` and `estuaryWater(..., 5, axis)` are the same materials and the same blend radius the table
 *  carried before it grew; only the mouths moved, because the coast did. The rim is `#eadfbd` inset 1.2,
 *  computed per vertex rather than from one centre, so the caps at the table edge stay square.
 */
import * as THREE from 'three';
import { add, mat, birds, type P } from './props';
import { terrace } from './turkey-landscape';
import { riverGeometry, seaWater, freshWater, estuaryWater, addFish, type LayoutCtx } from './worldkit';
import { TH } from './thailand-architecture';
import { THAILAND_OBJECTS } from './thailand-objects';

export type Pt = [number, number];
/** Table edges after the growth to W 120, D 56, cx -22: x runs -82 to 38, z stays -28 to 28. */
export const TABLE = { minX: -82, maxX: 38, minZ: -28, maxZ: 28 };
export const atEdgeX = (x: number) => x <= TABLE.minX || x >= TABLE.maxX;
export const atEdgeZ = (z: number) => Math.abs(z) >= TABLE.maxZ;
/** The band rule: Thailand owns x -82 to -14, Vietnam x -12 to 38, and the strip between carries ground only. */
export const TH_BAND: Pt = [-82, -14];
export const VN_BAND: Pt = [-12, 38];

/** The one sea, clockwise from the west edge: the Andaman coast, the Gulf, the delta and Saigon coast,
 *  Vietnam's east coast, the Red River bight, then back round the table edges with square caps. */
export const SEA_SHORE: Pt[] = [
  // The three Andaman vertices at z 8, 14 and 19 are 2 to 2.5 west of the blueprint's [-75, 8] [-74, 14]
  // [-73, 19]. The blueprint's own line ran under the Andaman fishing kitchen and the tin-town kitchen, which
  // stand at fixed object positions on that shore; the bay was cut back until both are on dry sand. The karst
  // decor and the clickable `karsts` still stand in the water west of it, which is what a drowned limestone
  // coast is, and no road, house or countryside plant moved.
  [-82, -6], [-78, -4], [-76, 2], [-77, 8], [-77, 14], [-75.5, 19],
  [-70, 22], [-64, 23], [-58, 22.5], [-52, 22], [-46, 21], [-40, 21.5],
  [-34, 22], [-28, 22.5], [-22, 23], [-16, 23], [-14, 23], [-12, 23],
  [-6, 23.5], [0, 24], [6, 23.5], [12, 23], [18, 22], [24, 21],
  [28, 18], [30, 12], [33, 6], [34, 0], [34, -4], [33, -10], [34, -16],
  [32, -21], [29, -23.5], [24, -25.5], [24.5, -28],
  [38, -28], [38, 28], [-82, 28],
];

/** Thailand's river. The blueprint starts it at z -27; it is carried the last unit to the table edge with
 *  the same x, so the cap at the edge is square, exactly as Spain's river leaves its western edge. */
export const CHAO_POINTS: Pt[] = [
  [-52, -28], [-52, -27], [-51, -21], [-50, -15], [-49, -9], [-47, -3], [-45, 2], [-44, 7], [-43, 13], [-42, 18], [-41, 21.5],
];
export const CHAO_WIDTH = 4.5, CHAO_RIM = 6.4;
export const CHAO_CURVE = new THREE.CatmullRomCurve3(CHAO_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** The mouth of the Thai river in the Gulf: the estuary blends by z, so everything past the coast is sea. */
export const CHAO_MOUTH: Pt = [-41, 21.5];

/** The khlong grid, cut early with the landscape: three canals off the west bank and the cross canal.
 *
 *  Owner defect, 2026-09-22: "rivers are not cut properly and it can't stop in the middle". At the blueprint's
 *  coordinates khlong 1 ran on to x -58 and khlong 2 to x -57, two and one units past the cross canal at
 *  x -56, so both ended in open ground; and all three began exactly on the Chao Phraya's centreline, which is
 *  a join the eye has to take on trust. Every khlong now ends inside the water it joins: one unit east of the
 *  river's centreline at the east end, and on the cross canal at the west end. The grid, the width and the
 *  spacing are the blueprint's. */
export const KHLONGS: { id: string; points: Pt[] }[] = [
  { id: 'khlong-1', points: [[-45.4, -1.5], [-56, -1.5]] },
  { id: 'khlong-2', points: [[-44, 2], [-56, 2]] },
  { id: 'khlong-3', points: [[-43.4, 5], [-56, 5]] },
  { id: 'khlong-4', points: [[-56, -1.5], [-56, 5]] },
];
export const KHLONG_WIDTH = 1.6;
/** The mooring basin: the river widening where the floating market lies. The blueprint centres it at
 *  [-43, 4.5] with r 3.8; it is 0.4 east of that, because at the blueprint centre the north-west arc passed
 *  0.03 inside the sweets kitchen's own tray bench, which stands at the fixed object position [-49.5, 7.6].
 *  The radius, the market's mooring and all four stall boats are unchanged. */
export const BASIN = { x: -42.6, z: 4.5, r: 3.8 };

/** Heights. Tints end near .012, town paving .018, the road ribbons .036 upward, the sea rim .030, the river
 *  banks .034, the sea .060, the rivers .090, the canals .094, the basin and the lake .098. Each step is
 *  .004, the distance at which two flat surfaces stop fighting for the depth test. */
export const RIM_Y = .030, BANK_Y = .034, SEA_Y = .060, RIVER_Y = .090, KHLONG_Y = .094, BASIN_Y = .098;
/** How far a bridge deck, and a walker on it, stands above the lane so the water passes underneath. */
export const ROAD_LIFT = .22;

export function inPolygon(x: number, z: number, poly: Pt[]): boolean {
  let yes = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[i], [bx, bz] = poly[j];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) yes = !yes;
  }
  return yes;
}
/** The shore as drawn: a small index-driven wobble away from the table edges, exactly as the mesh is built. */
export function seaOutline(): Pt[] {
  return SEA_SHORE.map(([x, z], i) => [atEdgeX(x) ? x : x + Math.sin(i * 2.7) * .2, atEdgeZ(z) ? z : z + Math.cos(i * 1.9) * .2]);
}
/** Each vertex moves outward along the bisector of its two edge normals; edge coordinates stay put, so the
 *  caps at the table edge remain square. This is the inset the owner rule asks to be kept at 1.2. */
export function offsetOutline(poly: Pt[], d: number): Pt[] {
  const n = poly.length, normals: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const [ax, az] = poly[i], [bx, bz] = poly[(i + 1) % n], ex = bx - ax, ez = bz - az, l = Math.hypot(ex, ez) || 1;
    let nx = ez / l, nz = -ex / l;
    if (inPolygon((ax + bx) / 2 + nx * .05, (az + bz) / 2 + nz * .05, poly)) { nx = -nx; nz = -nz; }
    normals.push([nx, nz]);
  }
  return poly.map(([x, z], i) => {
    const [px, pz] = normals[(i + n - 1) % n], [qx, qz] = normals[i];
    const mx = px + qx, mz = pz + qz, m2 = mx * mx + mz * mz;
    const flat = m2 < 1e-9, k = flat ? 0 : 2 * d / Math.max(m2, 1);
    const ox = flat ? qx * d : mx * k, oz = flat ? qz * d : mz * k;
    return [atEdgeX(x) ? x : x + ox, atEdgeZ(z) ? z : z + oz] as Pt;
  });
}
/** The polygon of a water ribbon, for tests that keep roads, stands and walkers out of it. */
export function ribbonOutline(curve: THREE.CatmullRomCurve3, width: number): Pt[] {
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= 160; i++) {
    const u = i / 160, p = curve.getPointAt(u), t = curve.getTangentAt(u), s = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(width / 2);
    left.push([p.x - s.x, p.z - s.z]); right.push([p.x + s.x, p.z + s.z]);
  }
  return [...left, ...right.reverse()];
}
const curveOf = (points: Pt[]) => new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** A circle as a polygon, for the basin and the lake. */
export function circleOutline(c: { x: number; z: number; r: number }, segments = 40): Pt[] {
  return Array.from({ length: segments }, (_, i) => { const a = i / segments * Math.PI * 2; return [c.x + Math.cos(a) * c.r, c.z + Math.sin(a) * c.r] as Pt; });
}
export const chaoOutline = () => ribbonOutline(CHAO_CURVE, CHAO_WIDTH);
/** Every Thai waterway as a named curve, so a harness can check that each one runs from a source to a mouth
 *  instead of stopping in the middle. `vietnam-landscape.ts` exports its own list of the same shape. */
export const TH_WATERWAYS: { id: string; points: Pt[]; width: number }[] = [
  { id: 'chao-phraya', points: CHAO_POINTS, width: CHAO_WIDTH },
  ...KHLONGS.map(k => ({ id: k.id, points: k.points, width: KHLONG_WIDTH })),
];
/** Every still body of Thai water: a valid source and a valid mouth for a waterway. */
export const TH_POOLS: { id: string; x: number; z: number; rx: number; rz: number }[] = [
  { id: 'mooring-basin', x: BASIN.x, z: BASIN.z, rx: BASIN.r, rz: BASIN.r },
];
/** The sea and every piece of Thai water, in one list, so a harness can ask "is this point wet?" once.
 *  Vietnam's own rivers and lake are in `vietnamWaterOutlines()` in that builder's file. */
export function waterOutlines(): Pt[][] {
  return [
    seaOutline(), chaoOutline(),
    ...KHLONGS.map(k => ribbonOutline(curveOf(k.points), KHLONG_WIDTH)),
    circleOutline(BASIN),
  ];
}
export const isWet = (x: number, z: number, polys = waterOutlines()) => polys.some(p => inPolygon(x, z, p));

function shape(points: Pt[]): THREE.Shape {
  const sh = new THREE.Shape(); points.forEach(([x, z], i) => i ? sh.lineTo(x, z) : sh.moveTo(x, z)); sh.closePath(); return sh;
}

/** Height of the raised Isan plateau at a point, for anything that stands on its slope. */
export const ISAN_PLATEAU = { x: -24, z: -21, rx: 9, rz: 6.5, h: .6, crown: .82 };
export function plateauHeight(x: number, z: number, t = ISAN_PLATEAU): number {
  const r = Math.hypot((x - t.x) / t.rx, (z - t.z) / t.rz);
  return r <= t.crown ? t.h : r >= 1 ? 0 : t.h * (1 - r) / (1 - t.crown);
}

/** A limestone tower of the Andaman kind: undercut at the waterline, vertical, forested on the crown. */
function limestone(h = 6, r = 2.0): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * .78, r * .52, h * .18, 9), mat('#8D8477')), 0, h * .09, 0);   // the undercut notch the sea eats
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * .62, r * .92, h * .66, 9), mat(TH.limestoneGrey)), 0, h * .5, 0);
  add(g, new THREE.Mesh(new THREE.ConeGeometry(r * .66, h * .3, 9), mat('#9A9285')), 0, h * .93, 0);
  for (const [i, a] of [.4, 1.9, 3.4, 5.1].entries()) add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * (.30 + (i % 2) * .08), 0), mat(i % 2 ? '#4F7A3A' : '#5E8A45')), Math.cos(a) * r * .5, h * (.86 + (i % 3) * .05), Math.sin(a) * r * .5);
  const rock = g as P; rock.name = 'karst-decor';
  return rock;
}

/** A hill with a forested foot, for the Lanna ridges and the Isan scarp. */
function ridge(r: number, h: number, dark = false): P {
  const g = new THREE.Group();
  for (const [i, [dx, dz, s]] of ([[0, 0, 1], [r * .72, r * .3, .66], [-r * .66, -r * .24, .58], [r * .1, -r * .7, .5]] as [number, number, number][]).entries()) {
    const cone = add(g, new THREE.Mesh(new THREE.ConeGeometry(r * s, h * s * (i ? .8 : 1), 11, 3), mat(dark ? (i % 2 ? '#4E7042' : '#446038') : (i % 2 ? '#5F8A4C' : '#537A44'))), dx, h * s * (i ? .8 : 1) / 2, dz);
    cone.rotation.y = i * 1.1; cone.receiveShadow = true; cone.castShadow = true;
  }
  const hill = g as P; hill.name = 'thai-ridge';
  return hill;
}

/** Distance from a point to the nearest Thai clickable object, so nothing the Builder plants stands in a
 *  stand's approach. The positions are the Researcher's, in `thailand-objects.ts`. */
export function objectDistance(x: number, z: number): number {
  let best = 1e9;
  for (const o of THAILAND_OBJECTS) best = Math.min(best, Math.hypot(x - o.pos[0], z - o.pos[1]));
  return best;
}

/** The two rules a piece of Builder's scenery has to satisfy against every Thai clickable, measured on the
 *  box it actually occupies rather than on its anchor: it must not reach into the blueprint's 6 x 5 pad round
 *  an object, and it must leave the 2.5 of clear ground the approach needs in front of one. `thailand-world.mjs`
 *  asserts exactly these, so anything that fails here would fail there. */
export function clearOfObjects(box: THREE.Box3): boolean {
  for (const o of THAILAND_OBJECTS) {
    const [x, z] = o.pos;
    if (box.min.x < x + 3 && box.max.x > x - 3 && box.min.z < z + 2.5 && box.max.z > z - 2.5) return false;
    const gx = Math.max(box.min.x - x, 0, x - box.max.x), gz = Math.max(box.min.z - z, 0, z - box.max.z);
    if (Math.hypot(gx, gz) < 2.5) return false;
  }
  return true;
}
/** Place a piece of scenery and take it away again if it blocks a clickable object. Everything the Builder
 *  plants goes through this, so a tree or a shrine that would stand in an approach simply is not there. */
export function tryPlace<T extends THREE.Object3D>(ctx: LayoutCtx, o: T, x: number, z: number, rot = 0, y = 0): T | null {
  ctx.place(o, x, z, rot);
  if (y) o.position.y = y;
  o.updateMatrixWorld(true);
  let box: THREE.Box3 | null = null;
  o.traverse(m => {
    const mesh = m as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld);
    if (b.max.y < .35) return;
    box = box ? (box as THREE.Box3).union(b) : b;
  });
  if (box && (!clearOfObjects(box) || onRoad(box) || inCameraWedge(box))) { ctx.group.remove(o); return null; }
  return o;
}
/** `main.ts` drops the visitor into a world at the target plus (2, 48, 60) and every later move keeps that
 *  offset direction, so the camera always looks at this table from the south, and the visitor may swing it
 *  through an 86-degree fan. Anything solid inside a hundred-degree wedge on a clickable object's camera side,
 *  out to nine units, is between the visitor and that object. This is the cheap version of the ten-ray check
 *  in `thailand-world.mjs`: it is stricter, so whatever survives it passes there. */
const TO_CAMERA: Pt = [Math.sin(Math.atan2(2, 60)), Math.cos(Math.atan2(2, 60))];
const WEDGE_COS = Math.cos(Math.PI * 100 / 360);
export function inCameraWedge(box: THREE.Box3): boolean {
  // A lamp-post-thin thing hides nothing at this camera pitch, and a waist-high thing hides nothing past five
  // units. Only a building or a full-grown tree reaches the whole nine.
  if (box.max.x - box.min.x < .6 && box.max.z - box.min.z < .6) return false;
  const reach = box.max.y > 2.6 ? 9 : 5;
  const xs = [box.min.x, (box.min.x + box.max.x) / 2, box.max.x], zs = [box.min.z, (box.min.z + box.max.z) / 2, box.max.z];
  for (const o of THAILAND_OBJECTS) for (const x of xs) for (const z of zs) {
    const vx = x - o.pos[0], vz = z - o.pos[1], l = Math.hypot(vx, vz);
    if (l > reach) continue;
    if (l < 1e-6) return true;
    if ((vx * TO_CAMERA[0] + vz * TO_CAMERA[1]) / l >= WEDGE_COS) return true;
  }
  return false;
}
/** Place a piece of scenery at the first of several candidate spots that leaves every clickable object and
 *  every road clear. Used for the buildings that must exist somewhere — the chedi, the salas — rather than
 *  for dressing that may simply be dropped. */
export function tryPlaceAny<T extends THREE.Object3D>(ctx: LayoutCtx, build: () => T, spots: [number, number, number][], y = 0): T | null {
  for (const [x, z, rot] of spots) { const o = tryPlace(ctx, build(), x, z, rot, y); if (o) return o; }
  return null;
}
/** True when a road centreline passes through the box, so nothing solid is ever left standing on a lane. */
export function onRoad(box: THREE.Box3): boolean {
  for (const r of TH_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) * 4)), half = r.width / 2;
    for (let k = 0; k <= n; k++) {
      const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
      if (x > box.min.x - half && x < box.max.x + half && z > box.min.z - half && z < box.max.z + half) return true;
    }
  }
  return false;
}

/** Distance from a point to the nearest road centreline, used to cut the paddy grid round the plain road. */
export function distToRoads(x: number, z: number): number {
  let best = 1e9;
  for (const r of TH_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
    best = Math.min(best, Math.hypot(x - ax - ex * t, z - az - ez * t));
  }
  return best;
}

export function thailandLandscape(ctx: LayoutCtx) {
  const { group, tickers, place, tint, TOP } = ctx;

  // ---------- ground tints, one per cluster, laid before anything solid ----------
  tint(-44, 1, 8, 8, '#b9a98a');              // the khlongs: wet brown mud on the banks, no paving
  tint(-31, -4, 7, 5, '#c4bba6');             // the old city and Sampheng: new brick paving
  tint(-57, -10, 10, 9, '#8fb86a', .05);      // the central plain, flooded green
  tint(-66, -6, 7, 6, '#c9c08a', -.05);       // and the dry gold it runs to at the south-west
  tint(-24, -21, 7, 5, '#c2a473');            // Isan: dry sandy plateau
  tint(-58, -23, 8, 5, '#9fb08a', .1);        // Lanna: cool valley green
  tint(-62, -20.5, 5, 3, '#8a7f6a', -.08);    // with earth terraces under the teak
  tint(-68, 14, 9, 9, '#7fb86a');             // the southern peninsula, wet green
  tint(-74, 12, 3.5, 8, '#eadfbd', .05);      // sand along the Andaman shore

  // ---------- the one sea, its rim, and every river that joins it ----------
  // Same materials and the same blend radius the table carried before it grew (owner rule, 2026-09-21).
  const sea = seaWater(), basinW = freshWater(), khlongW = freshWater();
  const chaoEstuary = estuaryWater(CHAO_MOUTH[0], CHAO_MOUTH[1], 5, 'z');
  const waters = [sea, basinW, khlongW, chaoEstuary];
  tickers.push(t => { for (const w of waters) w.uniforms.uTime.value = t; });

  const outline = seaOutline();
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(shape(offsetOutline(outline, 1.2))), mat('#eadfbd'));
  rim.rotation.x = -Math.PI / 2; rim.scale.y = -1; rim.position.y = TOP + RIM_Y; rim.receiveShadow = true; rim.name = 'sea-rim'; group.add(rim);
  const water = new THREE.Mesh(new THREE.ShapeGeometry(shape(outline)), sea);
  water.rotation.x = -Math.PI / 2; water.scale.y = -1; water.position.y = TOP + SEA_Y; water.receiveShadow = true; water.name = 'sea'; group.add(water);

  /** A river: a sand bank under a water ribbon, both mirrored into place like the rest of the table's water. */
  const river = (points: Pt[], width: number, bank: number, material: THREE.ShaderMaterial, name: string, y = RIVER_Y) => {
    const curve = curveOf(points);
    const b = new THREE.Mesh(riverGeometry(curve, bank, 200), mat('#eadfbd'));
    b.position.y = TOP + BANK_Y; b.receiveShadow = true; b.name = `${name}-bank`; group.add(b);
    const w = new THREE.Mesh(riverGeometry(curve, width, 240), material);
    w.position.y = TOP + y; w.renderOrder = 2; w.receiveShadow = true; w.name = name; group.add(w);
    return curve;
  };
  const chao = river(CHAO_POINTS, CHAO_WIDTH, CHAO_RIM, chaoEstuary, 'chao-phraya');
  addFish(ctx, chao, [['#d9a441', '#f4e1a1'], ['#8fa3b5', '#d9dee3'], ['#6f8f6f', '#c9d6b0']], 1.4, .32);
  // The khlong grid is cut with the landscape, not added at the end: it is what makes this area look like
  // nowhere else on the atlas.
  for (const k of KHLONGS) river(k.points, KHLONG_WIDTH, KHLONG_WIDTH + 1.1, khlongW, k.id, KHLONG_Y);
  // The mooring basin: the river widening where the floating market lies.
  add(group, new THREE.Mesh(new THREE.CircleGeometry(BASIN.r + .8, 30), mat('#eadfbd')), BASIN.x, TOP + BANK_Y, BASIN.z).rotation.x = -Math.PI / 2;
  const basinM = new THREE.Mesh(new THREE.CircleGeometry(BASIN.r, 30), basinW);
  basinM.rotation.x = -Math.PI / 2; basinM.position.set(BASIN.x, TOP + BASIN_Y, BASIN.z); basinM.renderOrder = 2; basinM.name = 'mooring-basin'; group.add(basinM);


  // ---------- the flooded plain: bunded paddy squares, mirror-bright, with egrets standing in them ----------
  // From [-64, -4] to [-50, -18], the ground the plain road runs through.
  // The blueprint gives the band, [-64, -4] to [-50, -18], not the squares. The band is walked on a grid and
  // a square is dropped when it would touch water, a road corridor or a stand's approach; the grid runs wider
  // than the blueprint's corners because five stands and the plain road stand inside those corners.
  const paddyMat = mat('#9ec9b4', { roughness: .24, metalness: .05 });
  const flooded: Pt[] = [];
  let sq = 0;
  for (let z = -20.4; z <= -3.6; z += 2.4) for (let x = -70.4; x <= -50.4; x += 2.4) {
    sq++;
    const half = 1.0;
    if ([[x - half, z - half], [x + half, z - half], [x + half, z + half], [x - half, z + half], [x, z]].some(([cx, cz]) => isWet(cx, cz))) continue;
    if (distToRoads(x, z) < 2.4) continue;                       // the plain road runs on the bunds, not through a flooded square
    if (objectDistance(x, z) < 3.4) continue;                    // and a flooded square never reaches a stand's approach
    const square = add(group, new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), paddyMat), x, TOP + .016, z);
    square.rotation.x = -Math.PI / 2; square.name = 'paddy-square'; square.receiveShadow = true; flooded.push([x, z]);
    for (const [dx, dz, w, d] of [[0, -1.06, 2.2, .16], [0, 1.06, 2.2, .16], [-1.06, 0, .16, 2.2], [1.06, 0, .16, 2.2]])
      add(group, new THREE.Mesh(new THREE.BoxGeometry(w, .12, d), mat('#a8956f')), x + dx, .06, z + dz).name = 'paddy-bund';
    if (sq % 3 === 0) for (let k = 0; k < 6; k++) {
      const blade = add(group, new THREE.Mesh(new THREE.BoxGeometry(.05, .30, .05), mat(TH.paddyGreen)), x - .7 + (k % 3) * .7, .17, z - .6 + Math.floor(k / 3) * .6);
      blade.rotation.z = (k % 2 ? .12 : -.12);
    }
  }
  // Egrets stand in the flooded squares themselves, which by construction are already clear of every road and
  // every stand's approach; three is enough to read as a plain that is being worked.
  let birdsPlanted = 0;
  for (const [i, [x, z]] of flooded.entries()) {
    if (birdsPlanted >= 3 || i % 3) continue;
    // A standing egret: one leg down, the body level, the neck folded. It stands, so it does not step.
    const e = new THREE.Group();
    add(e, new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .38, 5), mat('#D8B65C')), 0, .19, 0);
    add(e, new THREE.Mesh(new THREE.SphereGeometry(.15, 8, 6), mat('#F4F1EA')), 0, .46, 0).scale.set(1.5, .8, .8);
    add(e, new THREE.Mesh(new THREE.CylinderGeometry(.03, .04, .26, 5), mat('#F4F1EA')), .12, .62, 0).rotation.z = -.5;
    add(e, new THREE.Mesh(new THREE.SphereGeometry(.06, 7, 6), mat('#F4F1EA')), .23, .72, 0);
    add(e, new THREE.Mesh(new THREE.ConeGeometry(.03, .16, 5), mat('#E0A52C')), .33, .72, 0).rotation.z = -Math.PI / 2;
    e.scale.setScalar(.85);
    const bird = tryPlace(ctx, e, x + .4, z + .3, i * 2.1);
    if (bird) { bird.name = 'paddy-egret'; birdsPlanted++; }
  }

  // ---------- relief: the Isan plateau, the Lanna ridges, the karsts ----------
  const p = ISAN_PLATEAU;
  terrace(ctx, p.x, p.z, p.rx, p.rz, p.h, '#c2a473', p.crown);
  // The hills stand on the strip of north edge that no road reaches: west of the Lanna road's western end and
  // east of its eastern end. Nothing on the plateau's own ground, where the Isan track runs.
  for (const [x, z, r, h, dark] of [[-77, -25.5, 4.0, 5.6, true], [-71, -26.6, 4.2, 6.4, false], [-69.5, -25.8, 3.0, 3.8, true],
    [-46, -26.4, 3.4, 4.4, false], [-38, -26.8, 3.0, 3.8, true], [-31, -27.2, 2.6, 3.2, false]] as [number, number, number, number, boolean][])
    place(ridge(r, h, dark), x, z, x * .2);
  // Karsts in the Andaman, west of the coast: decor, no card. The clickable `karsts` object stands on the
  // Andaman shore and belongs to the Stand maker.
  for (const [x, z, h, r] of [[-79, 1, 6.2, 2.0], [-79.6, 5.5, 5.0, 1.7], [-80.4, 19.5, 6.8, 2.2], [-76.8, 22.5, 4.4, 1.5], [-79.5, -3.5, 5.4, 1.8]] as [number, number, number, number][])
    place(limestone(h, r), x, z, x).position.y = TOP + .05;
  // The Ha Long group in the north-east sea is `vietnam-landscape.ts`'s own decor, and is not repeated here.

  // ---------- the air over the water ----------
  const egretFlight = birds(5, 7, 7); egretFlight.position.set(-57, TOP, -12); group.add(egretFlight); tickers.push(egretFlight.userData.tick!);
  const seaBirds = birds(6, 9, 9); seaBirds.position.set(-70, TOP, 18); group.add(seaBirds); tickers.push(seaBirds.userData.tick!);
}

// ---------------------------------------------------------------------------------------------------------
// Roads, bridges and walking lanes.
//
// The tables live here rather than in `thailand-town.ts` because the landscape needs them too: the paddy grid
// is cut round them, and the module contract in docs/thailand-world.md puts `TH_LANES`, `TH_BRIDGES`,
// `BRIDGE_SPAN` and `BRIDGE_DECK_Y` on this file. `thailand-town.ts` draws them and re-exports them, so either
// import path reaches the same data.
// ---------------------------------------------------------------------------------------------------------

export type Road = { id: string; width: number; points: Pt[] };
/** One continuous ribbon each, at the blueprint widths. Every door in the object list meets one of these.
 *
 *  Two routes carry a departure from the blueprint's own points, both for the same reason: the blueprint says
 *  "no road point comes inside a river or khlong bank; if one ever does, move the road, not the water", and the
 *  drawn *surface* of a road is wider than its centreline. TH-R1's northern half and TH-R2's southern end both
 *  had their outer edge inside the Chao Phraya or the mooring basin at the blueprint coordinates. The points
 *  named below moved east or west by half a road width plus a margin; nothing else changed, and every junction
 *  in the blueprint's connection list is still a shared point.
 */
export const TH_ROADS: Road[] = [
  // TH-R1, the khlong quay. Points 3 to 7 moved east and were straightened: at the blueprint's x the ribbon's
  // west edge lay 0.2 to 1.0 inside the mooring basin and the Chao Phraya all the way from z 4.5 to the
  // estuary. The quay now runs 1.4 to 2.4 clear of the bank instead of over it.
  { id: 'TH-R1', width: 2.2, points: [[-38.2, -9.4], [-38.6, -4.6], [-38.4, 0.4], [-36.8, 4.5], [-36.8, 9.6], [-37, 13.6], [-36.8, 17.4], [-36.4, 20.6]] },
  // TH-R4's first point is the quay junction and moved with it, from [-39.6, 0.2] to [-38.4, 0.4].
  // TH-R2, the west bank lane. Its first point moved 0.8 west: at [-51, -6.8] the ribbon's east edge was 0.4
  // inside the Chao Phraya. TH-R4 shares the junction and moved with it.
  { id: 'TH-R2', width: 1.8, points: [[-51.8, -6.8], [-50.2, -1.5], [-50, 2], [-49.8, 5], [-51.4, 7.6], [-50.6, 11], [-52, 16.6], [-53.4, 19.6]] },
  { id: 'TH-R3', width: 2.4, points: [[-38.6, -4.6], [-36.2, -8.2], [-33.6, -9], [-30.8, -7.6], [-28.4, -6.8], [-26, -6.8], [-24.2, -4.6]] },
  { id: 'TH-R3b', width: 1.8, points: [[-30.8, -7.6], [-31.8, -3.8], [-31.4, -0.4], [-27.8, 0.8]] },
  { id: 'TH-R4', width: 1.8, points: [[-38.4, 0.4], [-42.5, -2.4], [-45, -5.4], [-48, -6.2], [-51.8, -6.8], [-53, -7.6], [-56.4, -9.4], [-60.4, -8.8], [-62.4, -12.4], [-60.8, -15.4], [-57.6, -16.6], [-54, -16.6], [-54.4, -19]] },
  { id: 'TH-R5', width: 1.6, points: [[-54.4, -19], [-55.4, -19.8], [-57.2, -22.2], [-59.4, -24.6], [-63.2, -23.4], [-64, -20.6]] },
  { id: 'TH-R6', width: 1.6, points: [[-24.2, -4.6], [-27.4, -8.6], [-26.6, -13.4], [-27, -19], [-24, -19.2], [-20.8, -20.2]] },
  { id: 'TH-R7', width: 1.8, points: [[-52, 16.6], [-57.2, 17], [-62.8, 20.2], [-65.4, 20.4], [-67.8, 18.4], [-68.4, 12.6], [-68.2, 8.6], [-71, 6.4], [-73, 5.8]] },
  { id: 'TH-R7b', width: 1.4, points: [[-68.4, 12.6], [-65.8, 13.4], [-62.2, 12.6]] },
];
export const road = (id: string) => TH_ROADS.find(r => r.id === id)!;

/** A crossing: the deck centre, how far it spans and which road carries it. The three khlong decks are short.
 *  A khlong is 1.6 wide and the three run 3.5 apart, so a deck any longer than 2.2 runs into its neighbour and
 *  the west bank lane reads as one long boardwalk instead of three bridges over three canals. The river deck
 *  is 6.4, which is the 4.5 of the Chao Phraya plus an abutment on each bank. */
export type Crossing = { at: Pt; span: number; road: string };
export const TH_CROSSINGS: Crossing[] = [
  { at: [-50.2, -1.5], span: 2.2, road: 'TH-R2' },
  { at: [-50, 2], span: 2.2, road: 'TH-R2' },
  { at: [-49.8, 5], span: 2.2, road: 'TH-R2' },
  { at: [-48, -6.2], span: 6.4, road: 'TH-R4' },
];
/** Deck centres, in the shape `spain-town.ts` uses. A road may touch the water only inside one of these. */
export const TH_BRIDGES: Pt[] = TH_CROSSINGS.map(c => c.at);
export const BRIDGE_SPAN = 6.4, BRIDGE_DECK_Y = ROAD_LIFT;

/** Straight walking segments cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the first clothing profile on the lane out of `thailand-people.ts`. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number };
function segments(r: Road, first: number, last: number, walkers: number[], seeds: number[]): Lane[] {
  return r.points.slice(first + 1, last + 1).map((to, i) => ({
    id: `${r.id}-${first + i}`, from: r.points[first + i], to, range: [.07, .93] as [number, number],
    walkers: walkers[i], seed: seeds[i],
  }));
}
/** Four peopled loops: the quay, Sampheng, the plain and the peninsula. Twenty residents in all. */
export const TH_LANES: Lane[] = [
  ...segments(road('TH-R1'), 1, 7, [1, 1, 1, 1, 1, 1], [1, 7, 0, 2, 23, 11]),
  ...segments(road('TH-R3'), 1, 6, [1, 1, 1, 1, 1], [3, 12, 4, 6, 17]),
  ...segments(road('TH-R4'), 5, 9, [1, 1, 1, 1], [9, 5, 13, 20]),
  ...segments(road('TH-R7'), 2, 7, [1, 1, 1, 1, 1], [6, 14, 8, 21, 10]),
];
/** The lane the buffalo is led along, and the lane the rickshaw is pulled along. */
export const BUFFALO_LANE = 'TH-R4-5', RICKSHAW_LANE = 'TH-R3-1';
