/** Ground, water and relief on the grown Italy table.
 *
 *  The table is W 100, D 64 centred on the origin, so x runs -50 to 50 and z -32 to 32. **The sea is the
 *  table**: one `seaWater()` polygon whose outer ring is the four table edges and whose holes are the three
 *  landmasses — the mainland, Sicily — and the lagoon's five islands. One polygon, one rim, one shader, the
 *  way Britain's island is a hole in the Channel. The strait between the mainland's toe and Sicily's cape is
 *  therefore not drawn at all: it is the water the two holes leave between them, and no bridge crosses it.
 *
 *  `shore()` reads the table's own half-width and half-depth out of `TABLE`, which is derived from the same
 *  `W` and `D` `world-italy.ts` is built with. Both hand-written literals of the old 76 x 56 table are gone,
 *  so the sea stays square at the edge and the table can be resized again without editing the test.
 *
 *  The materials are the ones the atlas already uses: `seaWater()` for the sea, `freshWater()` for the Tiber's
 *  upper course and its spring, and `estuaryWater(mouth, 4, 'z')` so everything past the coast line is exactly
 *  the sea's colour. The lagoon is the same sea with no sheet over it (lead ruling, 2026-09-23): it reads as
 *  lagoon from its islands, the lido and the boats.
 */
import * as THREE from 'three';
import { add, mat, birds, type P } from './props';
import { terrace } from './turkey-landscape';
import { riverGeometry, seaWater, freshWater, estuaryWater, addFish, type LayoutCtx } from './worldkit';
import { ITP, lavaWall, snowPit, type ItalyStyle } from './italy-architecture';
import { ITALY_OBJECTS } from './italy-objects';

export type Pt = [number, number];
/** Table edges after the growth to W 100, D 64, centred: x runs -50 to 50, z runs -32 to 32. */
export const TABLE = { W: 100, D: 64, minX: -50, maxX: 50, minZ: -32, maxZ: 32 };
export const atEdgeX = (x: number) => x <= TABLE.minX || x >= TABLE.maxX;
export const atEdgeZ = (z: number) => Math.abs(z) >= TABLE.maxZ;

/** The wobble a coast takes. The blueprint measures the strait at 4.46 between the mainland's toe and
 *  Sicily's cape and asks the Builder to keep it at or above 4.0 after the jitter, so both of its shores —
 *  and every other shore on this table, for one rule — take at most 0.2. */
export const SHORE_JITTER = .2;

/** The outer ring of the sea: the table itself. Everything else is a hole in it. */
export const SEA_RING: Pt[] = [[-50, -32], [50, -32], [50, 32], [-50, 32]];

/** The mainland's coast, clockwise from the north-west: the Tyrrhenian north shore, the lagoon's landward
 *  shore running east, the Adriatic side, the toe reaching the strait, and the long south coast back to the
 *  west cape.
 *
 *  Re-cluster pass, 2026-09-23: the lagoon's landward shore stands further east and south than the blueprint's
 *  ([12.5, -23.4] to [23, -4.2] instead of [6, -24] to [23, -7.2]) so the piazza cluster's east column and the
 *  lagoon's three rows of quays each have their own ground with water between; the east coast bulges to [36.6, 1]
 *  so the terraferma farm has room. The toe that faces the strait is unchanged.
 *
 *  Three vertices depart from the blueprint, all on the west coast and all for the same reason the Thai
 *  Andaman bay was cut back: the blueprint's own line ran under the drawn surface of IT-R2. At [-46, -4] and
 *  [-45.6, 2] the Agro road's 2.0-wide ribbon had its west edge 0.3 to 0.6 inside the Tyrrhenian, and the road
 *  cannot move east without running over `italyChicken` at [-43.4, 1]. The coast is 1.2 further west there and
 *  0.8 at [-45.6, -10] so the line stays smooth; nothing else on the table moved. */
export const MAINLAND: Pt[] = [
  [-46, -27], [-38, -27.6], [-30, -27.2], [-22, -27.6], [-14, -27.2], [-6, -27.6], [0, -27.2], [5, -27.0], [9.5, -25.8], [12.5, -23.4],
  [13.8, -19.5], [14.2, -15.5], [14.8, -12], [16.4, -8.8], [19, -5.6], [23, -4.2], [28, -3.8], [33, -4.2], [36, -2.6],
  [36.6, 1], [35.6, 4.2], [33.6, 7.4], [31, 9.2], [29.6, 10.8], [27.4, 12.4],
  [23.6, 12], [20, 11.2], [16, 10.4], [12, 9.6], [8, 9.2], [4, 9.6], [0, 9], [-4, 9.6], [-8, 9.2],
  [-12, 10], [-16, 10.4], [-20, 10.2], [-24, 10.6], [-28, 10.6], [-33, 10.8], [-38, 10.4], [-42, 10], [-45, 9.4],
  [-46, 6], [-46.8, 2], [-47.2, -4], [-46.4, -10], [-46, -16], [-45.6, -22],
];
/** Sicily's coast, clockwise from the west cape, with the north-east cape at [29, 18.6] facing the toe. */
export const SICILY: Pt[] = [
  [-30.4, 20.6], [-28.6, 17.6], [-25.4, 16.2], [-22, 15.0], [-18, 14.4], [-14, 14.6], [-10, 14.6], [-6, 14.8],
  [-2, 15.0], [2, 15.4], [6, 15.2], [10, 15.4], [14, 15.0], [18, 15.4], [22, 16.1], [26, 17.0], [29, 18.6],
  [32.4, 19.4], [36, 20.4], [40.4, 21.4], [42.4, 23.6], [42.6, 27.4], [40.8, 30.0], [36, 31.3], [31, 31.6],
  [27, 31.5], [22, 31.3], [17, 30.8], [12, 30.9], [7, 30.8], [2, 30.9], [-3, 30.8], [-8, 30.9], [-13, 30.8],
  [-18, 30.6], [-22.6, 30.5], [-27.4, 30.4], [-30.4, 28.6], [-30.8, 24.2],
];

/** The five lagoon islands. The blueprint holds them as rectangles, because a paper check can measure a
 *  rectangle; a quay in the water is not one. Each rectangle is walked at about 1.6-unit intervals and every
 *  sample is stepped **inward** by 0.08 to 0.40, with a deeper notch every fifth, so the island keeps the
 *  blueprint's footprint as its outer bound and reads as a fondamenta with steps, corners and a cut or two.
 *  Inward only: a quay that grew outward would take its own boat lane's water. */
export function quayOutline(x0: number, x1: number, z0: number, z1: number, seed: number): Pt[] {
  const pts: Pt[] = [], step = 1.6;
  // `px, pz` is the previous edge's inward normal: a corner steps in along both, so no vertex is left on the
  // blueprint rectangle itself and the corner reads as a cut quay corner rather than a drawn one.
  const edge = (ax: number, az: number, bx: number, bz: number, nx: number, nz: number, px: number, pz: number) => {
    const len = Math.hypot(bx - ax, bz - az), n = Math.max(2, Math.round(len / step));
    for (let i = 0; i < n; i++) {
      const t = i / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      const k = Math.abs(Math.sin((seed + i * 1.7 + (ax + az) * .31) * 12.9898) * 43758.5453) % 1;
      // The fondamenta the island's own lane runs along (its south edge, facing the camera and the canal) is
      // kept within 0.3 so the lane stays on stone; the other three step in by up to 0.75, with a deeper cut
      // every fifth sample, which is what reads as a quay of steps, landings and slips rather than a box.
      const road = nz < 0, inset = road ? .08 + k * .08 : .10 + k * .14 + (i % 5 === 3 ? .16 : 0);
      pts.push([x + nx * inset + (i ? 0 : px * .18), z + nz * inset + (i ? 0 : pz * .18)]);
    }
  };
  edge(x0, z0, x1, z0, 0, 1, 1, 0); edge(x1, z0, x1, z1, -1, 0, 0, 1); edge(x1, z1, x0, z1, 0, -1, -1, 0); edge(x0, z1, x0, z0, 1, 0, 0, -1);
  return pts;
}
/** Island id, its blueprint rectangle and what stands on it. The lido barrier carries nothing: it is the bar
 *  of land the lagoon is shallow behind, with the open porto south of it. */
export const ISLANDS: { id: string; rect: [number, number, number, number]; seed: number }[] = [
  // Re-cluster pass, 2026-09-23: the four quays are one cluster in three rows. At the back, Burano and the San
  // Marco quay with the campanile, the tallest thing in Venice, where nothing stands behind it; the Grand Canal,
  // four wide, under the Rialto; the Rialto quay with the Pescaria and the osteria facing the fondamenta; and in
  // front the valli bank, low enough to hide nothing behind it. The lido stands east of them all.
  { id: 'rialto-quay', rect: [17.6, 43.6, -20.8, -13.85], seed: 1 },
  { id: 'san-marco-quay', rect: [25.0, 46.6, -31.7, -24.8], seed: 2 },
  { id: 'burano', rect: [13.3, 24.4, -31.7, -24.8], seed: 3 },
  { id: 'valli-bank', rect: [23.8, 32.0, -13.35, -5.8], seed: 4 },
  { id: 'lido', rect: [47.9, 49.9, -29, -13], seed: 5 },
];
export const islandOutline = (id: string): Pt[] => {
  const i = ISLANDS.find(x => x.id === id)!;
  return quayOutline(i.rect[0], i.rect[1], i.rect[2], i.rect[3], i.seed);
};

/** The Tiber. `freshWater()` at width 2.4 on a rim 1.6 wider, with an `estuaryWater` blend from z 8 to the
 *  mouth. Re-cluster pass, 2026-09-23: it runs north to south between the Agro Romano on its west bank and the
 *  piazza on its east, from a spring pool under the north coast at [-16.3, -24] to a mouth 1.6 inside the south
 *  coast, crossed once by the stone bridge where the Agro's middle lane becomes the piazza street. The history
 *  below is the blueprint route's. Two departures from the blueprint's twelve points, both required by the water rule of 2026-09-22:
 *
 *  - its **source** at [-2, -22] stood in open ground, and a ribbon may never begin in land. The spring is
 *    therefore a pool — the tarn under the Apennine hills east of Rome — and the river's first point is inside
 *    it, which is exactly what `docs/building-a-world.md` says to do with a spring. The pool is centred at
 *    [-5.2, -21.6], 3.2 west of the blueprint's source point, because at [-2, -22] it lay under the west edge
 *    of `riceIt`'s paddies, whose prop runs to x -2.4.
 *  - its **mouth** was written at [-33, 10.6] and the south coast at that x is z 10.8, so the ribbon ended on
 *    the shore line rather than inside the sea it joins and a strip of ground showed at the join once the
 *    shore's own wobble was drawn. It is carried on to [-33.2, 12], about 1.4 inside the water. */
export const TIBER_POINTS: Pt[] = [
  [-16.3, -24.0], [-16.6, -21.5], [-16.4, -18], [-16.0, -14.5], [-16.1, -10.5], [-16.2, -6.6],
  [-16.3, -2.5], [-16.0, 1.5], [-15.9, 5.5], [-16.1, 9.2], [-16.2, 12.0],
];
export const TIBER_WIDTH = 2.4, TIBER_RIM = 4.0;
export const TIBER_CURVE = new THREE.CatmullRomCurve3(TIBER_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
export const TIBER_MOUTH: Pt = [-16.2, 12];
/** The spring the Tiber rises in, under the Apennine hills east of Rome. */
export const SPRING = { id: 'tiber-spring', x: -16.3, z: -24.0, rx: 1.7, rz: 1.7 };

/** Heights. Tints end near .012, town paving .018, the road ribbons .036 upward, the sea rim .030, the river
 *  bank .034, the sea .060, the lagoon sheet .066, the river .090, the spring .094. Each step is at least
 *  .004, the distance at which two flat surfaces stop fighting for the depth test. */
export const RIM_Y = .030, QUAY_Y = .032, BANK_Y = .034, SEA_Y = .060, RIVER_Y = .090, SPRING_Y = .094;
/** How far a bridge deck, and a walker on it, stands above the lane so the water passes underneath. */
export const BRIDGE_SPAN = 5.0, BRIDGE_DECK_Y = .9;

export function inPolygon(x: number, z: number, poly: Pt[]): boolean {
  let yes = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[i], [bx, bz] = poly[j];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) yes = !yes;
  }
  return yes;
}
/** A shore as drawn: a small index-driven wobble away from the table edges, exactly as the mesh is built.
 *  The edge test is the table's own half-width and half-depth, read from `TABLE`, never a literal. */
export function shore(pts: Pt[]): Pt[] {
  return pts.map(([x, z], i) => [atEdgeX(x) ? x : x + Math.sin(i * 2.7) * SHORE_JITTER, atEdgeZ(z) ? z : z + Math.cos(i * 1.9) * SHORE_JITTER] as Pt);
}
export const mainlandOutline = () => shore(MAINLAND);
export const sicilyOutline = () => shore(SICILY);
/** The three landmasses and the five lagoon islands: every hole in the one sea, in one list. */
export function landOutlines(): { id: string; poly: Pt[] }[] {
  return [
    { id: 'mainland', poly: mainlandOutline() },
    { id: 'sicily', poly: sicilyOutline() },
    ...ISLANDS.map(i => ({ id: i.id, poly: islandOutline(i.id) })),
  ];
}
export const onLand = (x: number, z: number, land = landOutlines()) => land.some(l => inPolygon(x, z, l.poly));

/** Each vertex moves along the bisector of its two edge normals; edge coordinates stay put, so the caps at
 *  the table edge stay square. Positive `d` pushes the ring outward, away from its own interior. */
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
/** An ellipse as a polygon, for the spring. */
export function ellipseOutline(c: { x: number; z: number; rx: number; rz: number }, segments = 36): Pt[] {
  return Array.from({ length: segments }, (_, i) => { const a = i / segments * Math.PI * 2; return [c.x + Math.cos(a) * c.rx, c.z + Math.sin(a) * c.rz] as Pt; });
}
export const tiberOutline = () => ribbonOutline(TIBER_CURVE, TIBER_WIDTH);

/** Every Italian waterway as a named curve, so a harness can check that each runs from a source to a mouth
 *  instead of stopping in the middle. The Tiber is the only ribbon on this table; the strait, the Grand Canal
 *  and the porto are all the one sea, so they have no source and no mouth to cut. */
export const IT_WATERWAYS: { id: string; points: Pt[]; width: number }[] = [
  { id: 'tiber', points: TIBER_POINTS, width: TIBER_WIDTH },
];
/** Every still body of Italian water: a valid source and a valid mouth for a waterway. */
export const IT_POOLS: { id: string; x: number; z: number; rx: number; rz: number }[] = [SPRING];

/** Everything wet on this table, in one list, so a harness can ask "is this point wet?" once. The sea is the
 *  table minus the eight landmasses, so it is expressed as a test rather than as a polygon. */
export function freshOutlines(): Pt[][] {
  return [tiberOutline(), ellipseOutline(SPRING)];
}
export function isWet(x: number, z: number, land = landOutlines(), fresh = freshOutlines()): boolean {
  if (x < TABLE.minX || x > TABLE.maxX || z < TABLE.minZ || z > TABLE.maxZ) return false;
  if (!onLand(x, z, land)) return true;
  return fresh.some(p => inPolygon(x, z, p));
}
/** Distance from a point to the nearest shore or bank, whichever it is inside or outside of. */
export function waterEdge(x: number, z: number, polys = [...landOutlines().map(l => l.poly), ...freshOutlines()]): number {
  let d = 1e9;
  for (const poly of polys) for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j], [bx, bz] = poly[i];
    const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
    d = Math.min(d, Math.hypot(x - ax - ex * t, z - az - ez * t));
  }
  return d;
}

function shapeOf(points: Pt[], holes: Pt[][] = []): THREE.Shape {
  const sh = new THREE.Shape();
  points.forEach(([x, z], i) => i ? sh.lineTo(x, z) : sh.moveTo(x, z));
  sh.closePath();
  for (const hole of holes) {
    const path = new THREE.Path();
    hole.forEach(([x, z], i) => i ? path.lineTo(x, z) : path.moveTo(x, z));
    path.closePath();
    sh.holes.push(path);
  }
  return sh;
}

// ---------------------------------------------------------------------------------------------------------
// Relief: the Apennine hills in the mainland's empty south-east, and Etna's flank behind the Sicilian coast.
// ---------------------------------------------------------------------------------------------------------

/** The Apennine spur between the piazza and the terraferma (re-cluster pass, 2026-09-23: it was a 27-wide swell over
 *  the whole south-east, which is the terraferma farm's ground now). It carries no object and no road. */
export const APENNINES = { x: 16.9, z: -3.4, rx: 2.4, rz: 3.0, h: .9, crown: .5 };
/** Etna's own flank, behind the Sicilian coast road and east of the almond terraces. It is deliberately low:
 *  `etnaIt` stands at its foot at [23, 19.2] with `elevation: 0` in the object list, so a tall crown there
 *  would bury the volcano instead of raising it. */
export const ETNA_FLANK = { x: 23.45, z: 19.0, rx: 2.4, rz: 1.2, h: .5, crown: .5 };
function reliefHeight(x: number, z: number, t: { x: number; z: number; rx: number; rz: number; h: number; crown: number }): number {
  const r = Math.hypot((x - t.x) / t.rx, (z - t.z) / t.rz);
  return r <= t.crown ? t.h : r >= 1 ? 0 : t.h * (1 - r) / (1 - t.crown);
}
export const apennineHeight = (x: number, z: number) => reliefHeight(x, z, APENNINES);
export const etnaHeight = (x: number, z: number) => reliefHeight(x, z, ETNA_FLANK);
/** The ground height anything the Builder plants stands on. */
export const groundHeight = (x: number, z: number) => Math.max(apennineHeight(x, z), etnaHeight(x, z));

/** A hill of the Apennine kind: a ridge of stone-grey cones with a scrub-oak foot. */
function apennineRidge(r: number, h: number, bare = false): P {
  const g = new THREE.Group();
  for (const [i, [dx, dz, s]] of ([[0, 0, 1], [r * .74, r * .28, .66], [-r * .68, -r * .22, .58], [r * .12, -r * .68, .5]] as [number, number, number][]).entries()) {
    const cone = add(g, new THREE.Mesh(new THREE.ConeGeometry(r * s, h * s * (i ? .8 : 1), 11, 3), mat(bare ? (i % 2 ? '#9A9182' : '#8B8375') : (i % 2 ? '#6E7A4E' : '#5E6B44'))), dx, h * s * (i ? .8 : 1) / 2, dz);
    cone.rotation.y = i * 1.1; cone.receiveShadow = true; cone.castShadow = true;
  }
  const hill = g as P; hill.name = 'apennine-ridge';
  return hill;
}

/**
 * The thirteen decorative houses the blueprint fixes. Style, position, rotation, width, depth, height, storeys;
 * `built: false` would carry the reason a house is not standing, and since the shared-ground pass of 2026-09-23
 * none does. Stage C built six and left seven down because the blueprint's stands covered their ground; the pass
 * spread the clusters, grew the Venetian quays and Sicily, and put every house where it hides no clickable from
 * the arrival camera: behind a stand, beside one, or far enough in front that the ray clears its roof. Each is
 * outside every 6 x 5 pad, 2.5 from every anchor, off every road centreline and on dry ground
 * (docs/italy-world.md, "Shared-ground pass, 2026-09-23", has the table of moves).
 */
export const IT_HOUSES: { id: string; style: ItalyStyle; x: number; z: number; rot: number; w: number; d: number; h: number; storeys?: number; built: boolean; why?: string }[] = [
  // Re-cluster pass, 2026-09-23: each house stands in its own cluster where it hides no clickable — behind the
  // back row, in a gap between two stands' sight lines, or in the six-unit shadow a tall stand already casts.
  { id: 'it-piazza-palazzo', style: 'romanPalazzo', x: 4.0, z: -21.8, rot: .04, w: 3.4, d: 2.6, h: 2.0, storeys: 3, built: true },
  { id: 'it-piazza-casa', style: 'trastevere', x: -8.4, z: -21.2, rot: -.08, w: 2.8, d: 2.2, h: 2.1, storeys: 1, built: true },
  { id: 'it-trastevere-casa', style: 'trastevere', x: -11.6, z: -24.4, rot: .04, w: 3.0, d: 2.3, h: 2.1, storeys: 2, built: true },
  { id: 'it-campagna-casale', style: 'casale', x: -35.8, z: -23.4, rot: -.1, w: 3.6, d: 2.6, h: 2.3, storeys: 1, built: true },
  { id: 'it-rialto-casa', style: 'venetianQuay', x: 20.8, z: -17.8, rot: .04, w: 2.6, d: 2.0, h: 2.1, storeys: 2, built: true },
  { id: 'it-rialto-magazzino', style: 'venetianQuay', x: 35.0, z: -28.8, rot: -.04, w: 3.2, d: 2.0, h: 2.2, storeys: 2, built: true },
  { id: 'it-sanmarco-casa', style: 'venetianQuay', x: 43.4, z: -28.4, rot: .06, w: 2.6, d: 2.0, h: 2.1, storeys: 2, built: true },
  { id: 'it-burano-casa', style: 'buranoCottage', x: 16.3, z: -28.4, rot: .06, w: 2.0, d: 1.9, h: 2.0, storeys: 1, built: true },
  { id: 'it-albergheria-casa', style: 'palermoTufa', x: -19.9, z: 26.2, rot: -.04, w: 2.8, d: 2.2, h: 2.1, storeys: 2, built: true },
  { id: 'it-albergheria-torre', style: 'palermoTufa', x: 31.8, z: 22.5, rot: .04, w: 2.2, d: 2.2, h: 2.0, storeys: 3, built: true },
  { id: 'it-coast-casa', style: 'sicilianCoast', x: 38.6, z: 23.9, rot: .1, w: 2.0, d: 1.6, h: 2.0, storeys: 1, built: true },
  { id: 'it-etna-casa', style: 'sicilianCoast', x: 28.8, z: 22.4, rot: -.08, w: 1.9, d: 1.45, h: 2.0, storeys: 1, built: true },
  // Built by latifondoMasseria(), the masseria's tower: at the west edge of the tonnara coast, beside the lemon garden.
  { id: 'it-latifondo-masseria', style: 'casale', x: 3.2, z: 21.4, rot: 0, w: 1.4, d: 1.4, h: 0, built: true },
];
/** The three buildings that belong to a stand. They are not extra houses, but they are blockers under exactly
 *  the same rule. Each moved with its stand in the shared-ground pass: the oven house keeps its offset from the
 *  forno, the byre stands east of the casale inside the Agro's south loop, and the tonnara's sheds stand at the
 *  cape east of the tonnara, turned end-on to the camera. */
export const IT_STAND_BUILDINGS: { id: string; owner: string; x: number; z: number; rot: number }[] = [
  { id: 'forno-oven-house', owner: 'oven', x: 10.3, z: -8.4, rot: 0 },
  { id: 'casale-byre', owner: 'cheese', x: -21.2, z: -19.8, rot: 0 },
  { id: 'tonnara-sheds', owner: 'tonnaraIt', x: 35.4, z: 26.6, rot: 1.62 },
];

/** Everything solid the Builder has put down on this table, so nothing planted later stands inside it. It is
 *  seeded with the nine buildings that stand before the landscape plants anything, because the landscape runs first
 *  and the houses are placed unconditionally at their fixed coordinates. */
const occupied: THREE.Box3[] = [];
export function occupy(box: THREE.Box3) { occupied.push(box); }
/** What is claimed, for a harness or a probe to read back. */
export const occupiedBoxes = (): readonly THREE.Box3[] => occupied;
function seedOccupied() {
  occupied.length = 0;
  for (const h of IT_HOUSES.filter(x => x.built)) {
    const r = Math.max(h.w, h.d) / 2 + .7;
    occupy(new THREE.Box3(new THREE.Vector3(h.x - r, 0, h.z - r), new THREE.Vector3(h.x + r, 6, h.z + r)));
  }
  for (const b of IT_STAND_BUILDINGS) occupy(new THREE.Box3(new THREE.Vector3(b.x - 2.0, 0, b.z - 1.5), new THREE.Vector3(b.x + 2.0, 3, b.z + 1.5)));
}
export const overlapsOccupied = (box: THREE.Box3) => occupied.some(o => box.min.x < o.max.x + .2 && box.max.x > o.min.x - .2 && box.min.z < o.max.z + .2 && box.max.z > o.min.z - .2);

// ---------------------------------------------------------------------------------------------------------
// What the Builder may plant: the clearance rules, measured against the Researcher's object positions.
// ---------------------------------------------------------------------------------------------------------

/** Distance from a point to the nearest Italian clickable object. Positions are the Researcher's, in
 *  `italy-objects.ts`, which is the shared contract at Stage C; `graph.ts` is registered at Stage D. */
export function objectDistance(x: number, z: number): number {
  let best = 1e9;
  for (const o of ITALY_OBJECTS) best = Math.min(best, Math.hypot(x - o.pos[0], z - o.pos[1]));
  return best;
}
/** The two rules a piece of Builder's scenery has to satisfy against every Italian clickable, measured on the
 *  box it actually occupies rather than on its anchor: it must not reach into the 6 x 5 pad round an object,
 *  and it must leave the 2.5 of clear ground the approach needs in front of one. */
export function clearOfObjects(box: THREE.Box3): boolean {
  for (const o of ITALY_OBJECTS) {
    const [x, z] = o.pos;
    if (box.min.x < x + 3 && box.max.x > x - 3 && box.min.z < z + 2.5 && box.max.z > z - 2.5) return false;
    const gx = Math.max(box.min.x - x, 0, x - box.max.x), gz = Math.max(box.min.z - z, 0, z - box.max.z);
    if (Math.hypot(gx, gz) < 2.5) return false;
  }
  return true;
}
/** True when a road centreline passes through the box, so nothing solid is ever left standing on a lane. */
export function onRoad(box: THREE.Box3): boolean {
  for (const r of IT_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) * 4)), half = r.width / 2;
    for (let k = 0; k <= n; k++) {
      const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
      if (x > box.min.x - half && x < box.max.x + half && z > box.min.z - half && z < box.max.z + half) return true;
    }
  }
  return false;
}
/** Distance from a point to the nearest road centreline. */
export function distToRoads(x: number, z: number): number {
  let best = 1e9;
  for (const r of IT_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
    best = Math.min(best, Math.hypot(x - ax - ex * t, z - az - ez * t));
  }
  return best;
}
/** `main.ts` drops the visitor into a world at the target plus (2, 48, 60) and every later move keeps that
 *  offset direction, so the camera always looks at this table from the south and the visitor may swing it
 *  through an 86-degree fan. Anything solid inside a hundred-degree wedge on a clickable object's camera side
 *  is between the visitor and that object; how far it reaches depends on how tall it is, because the camera
 *  stands 38.7 degrees above the ground and a knee-high wall at six units is under the ray, not in it. This is
 *  the cheap version of the ten-ray check in `italy-world.mjs`: it is stricter, so whatever survives it passes
 *  there. */
const TO_CAMERA: Pt = [Math.sin(Math.atan2(2, 60)), Math.cos(Math.atan2(2, 60))];
const WEDGE_COS = Math.cos(Math.PI * 100 / 360);
export function inCameraWedge(box: THREE.Box3): boolean {
  if (box.max.x - box.min.x < .6 && box.max.z - box.min.z < .6) return false;   // a post hides nothing
  const reach = Math.min(9, Math.max(0, (box.max.y - .8) / .8) + 1.5);
  const xs = [box.min.x, (box.min.x + box.max.x) / 2, box.max.x], zs = [box.min.z, (box.min.z + box.max.z) / 2, box.max.z];
  for (const o of ITALY_OBJECTS) for (const x of xs) for (const z of zs) {
    const vx = x - o.pos[0], vz = z - o.pos[1], l = Math.hypot(vx, vz);
    if (l > reach) continue;
    if (l < 1e-6) return true;
    if ((vx * TO_CAMERA[0] + vz * TO_CAMERA[1]) / l >= WEDGE_COS) return true;
  }
  return false;
}
/** The room approach: when a room object is clicked, `main.ts` flies the camera down to 1.4 above the counter
 *  and 8.8 to 10 units out along the visitor's compass direction, which is the arrival direction unless the
 *  visitor has turned. Walkthrough 25 to 29 found that flight ending inside the Pantheon, under the market's
 *  pergola and behind a cypress. Anything taller than knee height inside the ground the approach looks across —
 *  a trapezoid from the stand's front, 3.2 either side, to 1.2 either side of a point 11.5 out — is not planted. */
// A room object with its own `approach` pitch (italy-objects.ts) flies in high over what stands in front of it, so the
// low trapezoid does not apply to it; its approach is verified by eye on the live page instead (graph.ts, `approach`).
const ROOM_APPROACH = ITALY_OBJECTS.filter(o => (o as { scene?: string }).scene && o.approach?.pitch === undefined).map(o => {
  const [x, z] = o.pos, out = 11.5;
  return { x, z, cx: x + TO_CAMERA[0] * out, cz: z + TO_CAMERA[1] * out };
});
export function inRoomApproach(box: THREE.Box3): boolean {
  if (box.max.y < .9) return false;
  for (const a of ROOM_APPROACH) {
    // Work in the approach's own frame: `along` from the anchor toward the camera, `across` sideways.
    const ux = TO_CAMERA[0], uz = TO_CAMERA[1];
    const corners: Pt[] = [[box.min.x, box.min.z], [box.min.x, box.max.z], [box.max.x, box.min.z], [box.max.x, box.max.z]];
    const al = corners.map(([x, z]) => (x - a.x) * ux + (z - a.z) * uz), ac = corners.map(([x, z]) => (x - a.x) * uz - (z - a.z) * ux);
    const lo = Math.min(...al), hi = Math.max(...al);
    if (hi < 1.5 || lo > 11.5) continue;
    const at = Math.max(1.5, Math.min(11.5, lo)), half = 3.2 - (at - 1.5) / 10 * 2.0;
    if (Math.min(...ac) < half && Math.max(...ac) > -half) return true;
  }
  return false;
}
/** True when any corner or the centre of the box stands in the sea, the lagoon, the Tiber or its spring:
 *  nothing the Builder plants stands in water. The outlines are computed once per build. */
let wetCache: { land: { id: string; poly: Pt[] }[]; fresh: Pt[][] } | null = null;
function inWater(box: THREE.Box3): boolean {
  wetCache ??= { land: landOutlines(), fresh: freshOutlines() };
  const xs = [box.min.x, (box.min.x + box.max.x) / 2, box.max.x], zs = [box.min.z, (box.min.z + box.max.z) / 2, box.max.z];
  return xs.some(x => zs.some(z => isWet(x, z, wetCache!.land, wetCache!.fresh)));
}
/** Which of the placement rules a box breaks, by name; empty when it may stand. */
export function placeRefusals(box: THREE.Box3, claim = true, wedge = true): string[] {
  const out: string[] = [];
  if (!clearOfObjects(box)) out.push('object pad or approach');
  if (onRoad(box)) out.push('road');
  if (wedge && inCameraWedge(box)) out.push('camera wedge');
  if (wedge && inRoomApproach(box)) out.push('room approach');
  if (inWater(box)) out.push('water');
  if (claim && overlapsOccupied(box)) out.push('occupied');
  return out;
}
/** Place a piece of scenery and take it away again if it blocks a clickable, a lane or the water. Everything
 *  the Builder plants goes through this, so a tree that would stand in an approach simply is not there. */
/** `wedge: false` is for the one landmark the Builder places, the Trevi: its facade is set 3.25 in front of the market so
 *  every one of the market's ten rays clears it, which is what the wedge approximates and `italy-world.mjs` measures. */
export function tryPlace<T extends THREE.Object3D>(ctx: LayoutCtx, o: T, x: number, z: number, rot = 0, y = 0, claim = true, wedge = true): T | null {
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
  if (box && placeRefusals(box, claim, wedge).length) { ctx.group.remove(o); return null; }
  if (box && claim) occupy(box);
  return o;
}
/** Place a piece of scenery at the first candidate spot that leaves every clickable and every road clear. */
export function tryPlaceAny<T extends THREE.Object3D>(ctx: LayoutCtx, build: () => T, spots: [number, number, number][], y = 0): T | null {
  for (const [x, z, rot] of spots) { const o = tryPlace(ctx, build(), x, z, rot, y); if (o) return o; }
  return null;
}

// ---------------------------------------------------------------------------------------------------------
// Roads, bridges, boat lanes and walking lanes.
//
// The tables live here rather than in `italy-town.ts` because the landscape needs them too: the countryside
// grid is cut round them. `italy-town.ts` draws them and re-exports them, so either import path reaches the
// same data, in the shape `spain-town.ts` and `thailand-landscape.ts` use.
// ---------------------------------------------------------------------------------------------------------

export type Road = { id: string; width: number; points: Pt[]; net: string };
/** One continuous ribbon each and **one network per landmass**: the mainland's piazza, Agro and via consolare
 *  routes meet at the Tiber bridge and the piazza street, Sicily's at the Albergheria lane and the coast road, and
 *  the lagoon's are each one quay's fondamenta, the Rialto quay's joined to the San Marco riva over the Rialto.
 *  `net` names the piece so the harness can check each network is whole instead of failing the table. The
 *  blueprint's routes and their recorded departures were replaced wholesale by the re-cluster pass of 2026-09-23
 *  (docs/italy-world.md has both tables); every door, front and row lane below was laid for the new clusters.
 */
export const IT_ROADS: Road[] = [
  // ---- the mainland: the piazza and its lanes, the Agro's spine and its three row lanes, the via consolare ----
  // Re-cluster pass, 2026-09-23. The piazza street runs along the fronts of the Pantheon and the Colosseum, where the
  // people on their steps stand, and jogs north to the caffè; the front road runs past the pasta kitchen, the market
  // and the forno; two lanes flank the market so its outer stalls have a road; one more reaches the herb beds. The
  // Agro's three row lanes meet a spine along the Tiber's west bank, and the middle one crosses the stone bridge and
  // becomes the piazza street. The via consolare leaves the forno's front road for the terraferma farm.
  { id: 'IT-R1', width: 1.8, net: 'mainland', points: [[-19.1, -6.3], [-16.2, -6.6], [-13.2, -8.8], [-9.2, -10.0], [-5.6, -9.4], [-3.2, -7.6], [0.8, -7.6], [3.4, -7.6], [6.0, -7.6]] },
  { id: 'IT-R1b', width: 1.4, net: 'mainland', points: [[-10.4, 1.0], [-9.0, 1.0], [-5.2, 1.05], [0.8, 1.05], [6.0, 1.0], [7.4, -0.1], [10.0, -0.1], [12.9, -0.1]] },
  { id: 'IT-R1c', width: 1.6, net: 'mainland', points: [[6.0, -7.6], [6.6, -9.7], [7.4, -11.7], [10.0, -11.7], [12.9, -11.7]] },
  { id: 'IT-R1d', width: 1.4, net: 'mainland', points: [[6.0, 1.0], [6.4, 3.4], [6.6, 6.2], [10.0, 6.2], [14.4, 6.2]] },
  { id: 'IT-R1w', width: 1.2, net: 'mainland', points: [[-5.2, -9.1], [-5.2, -4.0], [-5.2, 1.05]] },
  { id: 'IT-R1e', width: 1.2, net: 'mainland', points: [[6.0, -7.6], [6.0, -3.3], [6.0, 1.0]] },
  { id: 'IT-R2', width: 1.8, net: 'mainland', points: [[-19.1, -14.6], [-19.1, -10.4], [-19.1, -6.3], [-19.1, -2.6], [-19.1, 0.6]] },
  { id: 'IT-R2a', width: 1.6, net: 'mainland', points: [[-44.0, -14.6], [-39.0, -14.6], [-32.5, -14.6], [-26.0, -14.6], [-19.1, -14.6]] },
  { id: 'IT-R2b', width: 1.6, net: 'mainland', points: [[-44.6, -6.3], [-39.0, -6.3], [-32.5, -6.3], [-26.0, -6.3], [-19.1, -6.3]] },
  { id: 'IT-R2c', width: 1.6, net: 'mainland', points: [[-44.8, 0.6], [-39.0, 0.6], [-32.5, 0.6], [-26.0, 0.6], [-19.1, 0.6]] },
  { id: 'IT-R3', width: 1.6, net: 'mainland', points: [[12.9, -0.1], [14.4, 1.2], [14.4, 4.2], [14.4, 6.2], [17.2, 6.7], [20.2, 6.7], [23.8, 6.7], [27.4, 6.7], [31.0, 6.7], [33.0, 6.7]] },
  // ---- Sicily: the Albergheria lane runs on into the tonnara coast road; one south road serves both front rows ----
  { id: 'IT-R4', width: 2.0, net: 'sicily', points: [[-25.8, 23.2], [-24, 23.2], [-20.1, 23.2], [-16, 23.2], [-12, 23.2], [-8, 23.2], [-4, 23.2], [0, 23.2], [4.5, 23.2]] },
  { id: 'IT-R4c', width: 1.4, net: 'sicily', points: [[-25.6, 29.4], [-20, 29.5], [-13.6, 29.5], [-8, 29.5], [-5, 29.4], [-1, 29.4], [4.5, 29.4], [8.4, 29.4], [16.3, 29.4], [22, 29.5], [29.9, 29.5], [33.0, 29.4]] },
  { id: 'IT-R4d', width: 1.2, net: 'sicily', points: [[-20.1, 23.2], [-20.1, 19.0], [-19.6, 15.9], [-15.2, 15.8], [-11.6, 15.8]] },
  { id: 'IT-R5', width: 1.6, net: 'sicily', points: [[4.5, 23.2], [8.4, 23.0], [12, 23.0], [15.9, 23.0], [19.8, 23.1], [23.5, 23.3]] },
  { id: 'IT-R5b', width: 1.2, net: 'sicily', points: [[4.5, 23.2], [4.5, 26.3], [4.5, 29.4]] },
  // ---- the lagoon: the fondamenta, the Rialto and the San Marco riva are one piece; Burano and the valli their own ----
  { id: 'IT-R6', width: 1.4, net: 'rialto', points: [[21.6, -15.3], [25.8, -15.3], [29.5, -15.3], [32.95, -15.3], [36, -15.3], [39.4, -15.3], [42.8, -15.3]] },
  { id: 'IT-R7', width: 1.4, net: 'rialto', points: [[39.4, -15.3], [39.4, -18.5], [39.4, -22.8], [39.4, -25.8], [35, -25.8], [30.0, -25.8], [26.4, -25.8]] },
  { id: 'IT-R8', width: 1.2, net: 'burano', points: [[15.2, -25.9], [18, -25.9], [21.3, -25.9], [23.0, -25.9]] },
  { id: 'IT-R9', width: 1.2, net: 'valli', points: [[24.4, -6.8], [27.3, -6.8], [31.4, -6.8]] },
];
export const road = (id: string) => IT_ROADS.find(r => r.id === id)!;

/** Two bridges. `ponteIt` is the stone road bridge where IT-R2 crosses the Tiber, and it is the Builder's own
 *  decor. `rialtoIt` is a registered clickable landmark whose geometry comes from `props-italy.ts`, so the
 *  Builder draws no deck there and only carries the road and the walkers over it. */
export type Crossing = { id: string; at: Pt; span: number; road: string; built: boolean };
export const IT_CROSSINGS: Crossing[] = [
  { id: 'ponteIt', at: [-16.2, -6.6], span: BRIDGE_SPAN, road: 'IT-R1', built: true },
  { id: 'rialtoIt', at: [39.4, -22.8], span: BRIDGE_SPAN, road: 'IT-R7', built: false },
];
/** Deck centres, in the shape `spain-town.ts` uses. A road may touch the water only inside one of these. */
export const IT_BRIDGES: Pt[] = IT_CROSSINGS.map(c => c.at);

/** The five boat lanes. The islands are linked to each other and to the mainland by water, not by a causeway:
 *  the doc names only one bridge between them and it is built. */
export type BoatLane = { id: string; points: Pt[]; boats: number; kind: 'gondola' | 'sandolo' | 'barge' | 'bragozzo' | 'ferry'; speed: number; pass?: number };
/** Owner walkthrough fixes, 2026-09-23. The audit had sandoli running through each other, gondolas through the
 *  Rialto's own gondola and through the barge, because every multi-boat lane was one line with boats turning
 *  round on it at their own times. Now:
 *  - a lane carries one boat, or two boats half a cycle apart, which only ever meet at the lane's midpoint; there
 *    each keeps to its right by `pass` (the half-separation), eased in and out, so they pass side by side;
 *  - the gondolas (L1) run the Grand Canal under the Rialto (the Stand maker's arch of fd95d9a carries no boat of
 *    its own and clears 2.13 to 2.30 over the lane); the lane starts 3 units east of the barge's water;
 *  - the bragozzi (L4) sail out of the porto into the open Adriatic, clear of the gondolas' channel.
 *  Second walkthrough fixes, 2026-09-23 (items 29 and 56): no boat may enter a room's approach frame. L1 now turns
 *  back at x 35, under the Rialto and short of the osteria's frame, instead of running on up the channel past it;
 *  L2 left the channel between Burano and the valli bank, which is the lagoon kitchen's approach, for the open
 *  water south of the valli bank and along the San Marco shore, behind every lagoon room's camera. That water is
 *  too short for two hulls 4.3 long to pass in (the audit found them touching at .55 and .8 apart), so L2 carries
 *  one sandolo, which a lane may. */
export const IT_BOAT_LANES: BoatLane[] = [
  // Re-cluster pass, 2026-09-23: the gondolas run the new Grand Canal under the Rialto and turn short of the San Marco
  // quay's east end; the sandolo runs the channel between the quays and the lido; the barge works the open water
  // east of the valli bank, and the bragozzi sail out of the porto round the mainland's east cape.
  { id: 'L1', points: [[25.8, -22.8], [30, -22.8], [35, -22.8], [39.4, -22.8], [42.4, -22.8]], boats: 2, kind: 'gondola', speed: .008, pass: .7 },
  { id: 'L2', points: [[47.25, -29.0], [47.25, -25], [47.25, -20.5], [47.25, -16.0]], boats: 1, kind: 'sandolo', speed: .009 },
  { id: 'L3', points: [[34.2, -12.4], [35.6, -10.2], [37.6, -8.4], [40.4, -7.4]], boats: 1, kind: 'barge', speed: .008 },
  { id: 'L4', points: [[46.2, -11.4], [47.6, -6.8], [46.8, -1.6], [43.0, 2.2]], boats: 2, kind: 'bragozzo', speed: .007, pass: 1.0 },
  { id: 'L5', points: [[31.5, 11.5], [31.8, 14], [31.4, 16.4], [30.8, 18.0]], boats: 1, kind: 'ferry', speed: .006 },
];

/** Straight walking segments cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the clothing profile on the lane out of `italy-people.ts`. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number; team?: 'cart' | 'mule'; sep?: number };
function segments(r: Road, first: number, last: number, walkers: number[], seeds: number[]): Lane[] {
  return r.points.slice(first + 1, last + 1).map((to, i) => ({
    id: `${r.id}-${first + i}`, from: r.points[first + i], to, range: [.08, .92] as [number, number],
    walkers: walkers[i], seed: seeds[i],
  }));
}
/** Where on its lane's width a walker keeps, to the right of the lane's own direction (south, on the east-running
 *  streets). Two walkers on one segment take two strips 0.65 apart, so they pass instead of walking through each
 *  other (walkthrough 30), and both keep to the south half of the street, clear of the low sight lines of the
 *  stands on its north side; the Rialto fondamenta's walkers keep south of the Pescaria's front the same way. */
export const laneOffset = (lane: Lane, i: number) => lane.walkers > 1 ? (i % 2 ? -.05 : .6) : lane.id.startsWith('IT-R6-') ? .35 : 0;
/** The blueprint's five peopled loops: the piazza, the Agro road, the Rialto circuit over the bridge, the
 *  Albergheria lane and the coast road. Twenty-four residents in all. */
export const IT_LANES: Lane[] = [
  // Re-cluster pass, 2026-09-23: the piazza's residents walk the front road past the pasta kitchen, the market and
  // the forno; the Agro's walk its middle lane with the shepherd; the carter and his wine cart take the via consolare
  // between the piazza and the terraferma, and the Agro mule the spine along the Tiber, where no clickable's arrival
  // ray crosses either; the Rialto fondamenta and the San Marco riva, the Albergheria and the coast road as before.
  ...segments(road('IT-R1b'), 0, 4, [1, 1, 2, 1], [0, 7, 14, 2]).map(l => ({ ...l, range: [.12, .88] as [number, number] })),
  { id: 'IT-R3-cart', from: [14.4, 1.6], to: [14.4, 5.8], range: [0, 1], walkers: 1, seed: 11, team: 'cart', sep: 2.0 },
  { id: 'IT-R2-mule', from: [-19.1, -13.4], to: [-19.1, -8.2], range: [0, 1], walkers: 1, seed: 3, team: 'mule', sep: 1.0 },
  ...segments(road('IT-R2b'), 0, 4, [1, 1, 1, 0], [3, 12, 20, 0]).filter(l => l.walkers > 0),
  ...segments(road('IT-R6'), 0, 3, [1, 1, 1], [4, 9, 17]),
  ...segments(road('IT-R7'), 3, 6, [0, 1, 1], [0, 23, 6]).filter(l => l.walkers > 0).map(l => ({ ...l, range: [.16, .84] as [number, number] })),
  ...segments(road('IT-R4'), 1, 5, [1, 2, 1, 1], [7, 11, 1, 15]),
  ...segments(road('IT-R5'), 0, 4, [1, 1, 1, 0], [8, 21, 13, 0]).filter(l => l.walkers > 0),
];
/** The lane the Castelli wine carts run on, the lane the Agro mule is led along, and the lane the shepherd
 *  walks behind his flock. */
export const CART_LANE = 'IT-R3-cart', MULE_LANE = 'IT-R2-mule', SHEPHERD_LANE = 'IT-R2b-1';

export function italyLandscape(ctx: LayoutCtx) {
  const { group, tickers, place, tint, TOP } = ctx;
  seedOccupied(); wetCache = null;

  // ---------- ground tints, one per cluster, laid before anything solid ----------
  // Re-cluster pass, 2026-09-23: one tint per cluster, sized to its own ground, so each reads as one place.
  tint(0.4, -6.2, 16, 15.5, '#d9cbb0');           // Rome: travertine and basalt setts round the Campo
  tint(-32.5, -9.2, 16, 13.5, '#c6b489');         // the Agro Romano: dry campagna on the Tiber's west bank
  tint(31, -19, 15, 13, '#ded3b6');               // Venice: Istrian stone over brick, under the quays
  tint(27.4, 3.4, 9, 5.5, '#a9b878');             // the terraferma, maize green
  tint(-14.6, 23.2, 15, 7.5, '#cdbb92');          // Palermo: tufa under awnings
  tint(18.6, 24.6, 17, 7.5, '#b6ac7e');           // the tonnara coast, dry gold
  tint(22.4, 20.2, 5.2, 3.6, '#6b6258', -.05);    // running to basalt under Etna
  tint(16.9, -3.4, 3.4, 4.0, '#b3ab8e', .04);     // the Apennine spur between the piazza and the terraferma

  // ---------- the one sea: the table with the eight landmasses as holes, and its rim ----------
  const sea = seaWater(), spring = freshWater();
  const tiberWater = estuaryWater(TIBER_MOUTH[0], TIBER_MOUTH[1], 4, 'z');
  const waters = [sea, spring, tiberWater];
  tickers.push(t => { for (const w of waters) w.uniforms.uTime.value = t; });

  const land = landOutlines();
  // The rim is an inset of every ring by 1.2, computed per vertex rather than from one centre: the outer ring
  // is the table edge and does not move, and each landmass ring is pushed 1.2 *inland*, so a band of sand
  // shows round every coast and the caps at the table edge stay square.
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(SEA_RING, land.map(l => offsetOutline(l.poly, -1.2)))), mat('#efe0bb'));
  rim.rotation.x = -Math.PI / 2; rim.scale.y = -1; rim.position.y = TOP + RIM_Y; rim.receiveShadow = true; rim.name = 'sea-rim'; group.add(rim);
  const water = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(SEA_RING, land.map(l => l.poly))), sea);
  water.rotation.x = -Math.PI / 2; water.scale.y = -1; water.position.y = TOP + SEA_Y; water.receiveShadow = true; water.name = 'sea'; group.add(water);

  // ---------- the lagoon: the same sea, read from its islands and boats ----------
  // Lead ruling, second walkthrough 2026-09-23 (items 1 and 52): the translucent shallow-green sheet is gone. Its
  // edges read as a glass pane or a searchlight band on the sea and it tinted the San Marco quay, so the sea is one
  // material on this table and the lagoon reads as lagoon from its five islands, the lido, the valli and the boats.

  // The four Venetian islands are stone quays, not sand pads: Istrian stone laid over the sand rim right out to
  // the island's own irregular edge, and a low darker kerb along the water, so from above each island reads as a
  // fondamenta with a stone lip rather than a bank with a beach. The lido stays sand: it is the barrier, not a
  // quay. The kerb stands .14 high, under anything that blocks a walker or a ray.
  for (const id of ['rialto-quay', 'san-marco-quay', 'burano', 'valli-bank']) {
    const edge = islandOutline(id);
    const stone = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(edge)), mat('#d8cfb8'));
    stone.rotation.x = -Math.PI / 2; stone.scale.y = -1; stone.position.y = TOP + QUAY_Y; stone.receiveShadow = true; stone.name = 'quay-stone'; group.add(stone);
    const kerb = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeOf(edge, [offsetOutline(edge, -.26)]), { depth: .14, bevelEnabled: false }), mat('#b3a78c'));
    kerb.rotation.x = -Math.PI / 2; kerb.scale.y = -1; kerb.position.y = TOP + QUAY_Y; kerb.receiveShadow = true; kerb.castShadow = true; kerb.name = 'quay-kerb'; group.add(kerb);
  }

  // ---------- the Tiber: a sand bank under a water ribbon, with the estuary blend at its mouth ----------
  const bank = new THREE.Mesh(riverGeometry(TIBER_CURVE, TIBER_RIM, 200), mat('#efe0bb'));
  bank.position.y = TOP + BANK_Y; bank.receiveShadow = true; bank.name = 'tiber-bank'; group.add(bank);
  const river = new THREE.Mesh(riverGeometry(TIBER_CURVE, TIBER_WIDTH, 240), tiberWater);
  river.position.y = TOP + RIVER_Y; river.renderOrder = 2; river.receiveShadow = true; river.name = 'tiber'; group.add(river);
  addFish(ctx, TIBER_CURVE, [['#8fa3b5', '#d9dee3'], ['#6f8f6f', '#c9d6b0'], ['#d9a441', '#f4e1a1']], 1.2, .30);
  // The spring the river rises in: a pool, not a ring of stones. Its own rim first, then the water.
  add(group, new THREE.Mesh(new THREE.CircleGeometry(SPRING.rx + .8, 30), mat('#efe0bb')), SPRING.x, TOP + BANK_Y, SPRING.z).rotation.x = -Math.PI / 2;
  const pool = new THREE.Mesh(new THREE.CircleGeometry(SPRING.rx, 30), spring);
  pool.rotation.x = -Math.PI / 2; pool.position.set(SPRING.x, TOP + SPRING_Y, SPRING.z); pool.renderOrder = 2; pool.name = 'tiber-spring'; group.add(pool);

  // ---------- relief: the Apennine hills, and Etna's flank ----------
  terrace(ctx, APENNINES.x, APENNINES.z, APENNINES.rx, APENNINES.rz, APENNINES.h, '#b3ab8e', APENNINES.crown);
  terrace(ctx, ETNA_FLANK.x, ETNA_FLANK.z, ETNA_FLANK.rx, ETNA_FLANK.rz, ETNA_FLANK.h, '#6b6258', ETNA_FLANK.crown);
  // The ridge line itself stands on the raised spur between the piazza and the terraferma.
  for (const [x, z, r, h, bare] of [[16.8, -4.2, 1.4, 3.2, false], [17.6, -2.6, 1.2, 2.6, true], [16.2, -2.4, 0.9, 2.0, false]] as [number, number, number, number, boolean][]) {
    const hill = tryPlace(ctx, apennineRidge(r, h, bare), x, z, x * .2, apennineHeight(x, z), false);   // hills may run into one another
    if (hill) hill.name = 'apennine-ridge';
  }
  // A snow pit on the latifondo's high ground west of the lemon garden (the neviere were on Etna and the Madonie;
  // Etna's own flank carries the Stand maker's neviera at the volcano's foot), then the basalt walls, and black sand.
  for (const spots of [[[2.6, 17.8, .1], [2.2, 18.0, .2]]] as [number, number, number][][]) {
    const pit = tryPlaceAny(ctx, () => snowPit(), spots, 0); if (pit) { pit.name = 'snow-pit'; pit.position.y = etnaHeight(pit.position.x, pit.position.z); }
  }
  // The two field walls south of the cone. The three spots on the north flank are dropped: the Stand maker's Etna
  // of 2026-09-23 stands on that ground now.
  for (const [x, z, rot, len] of [[20.4, 25.6, .1, 2.6], [22.6, 27.4, -.05, 2.4]] as [number, number, number, number][]) {
    const wall = tryPlace(ctx, lavaWall(len), x, z, rot, etnaHeight(x, z)); if (wall) wall.name = 'lava-wall';
  }
  for (let i = 0; i < 14; i++) {
    const x = 17.4 + (i % 7) * 1.4, z = 17.6 + Math.floor(i / 7) * 1.0 + (i % 3) * .3;
    const sand = add(group, new THREE.Mesh(new THREE.CircleGeometry(.9 + (i % 3) * .3, 12), mat('#4A4650')), x, TOP + .014 + etnaHeight(x, z), z);
    sand.rotation.x = -Math.PI / 2; sand.name = 'black-sand';
  }

  // ---------- the air over the water ----------
  // Named so a sight-line probe can tell a passing wing from a building: a bird crosses a ray for a frame and
  // hides nothing.
  // Walkthrough 24: the shared flock read at approach zoom as house-sized black Vs over the lemon grove. Italy's
  // flocks are drawn at 0.45 of the shared size, with a body and a lighter grey-brown, higher up.
  // Second walkthrough 62 (2026-09-23): seen from above against the Tiber at the Mattatoio's card approach, the
  // grey-brown Rome flock still drew as thin black darts. Every flock is a pale stone grey now, the Rome birds a
  // warm one and the gulls a cool near-white, so a wing edge-on reads as a light fleck, not a dark stick.
  const flock = { size: .45, tone: '#B8B0A4' };
  const swifts = birds(6, 7, 8, flock); swifts.position.set(0.8, TOP, -9); swifts.name = 'italy-birds'; group.add(swifts); tickers.push(swifts.userData.tick!);
  const lagoonGulls = birds(6, 9, 9, { ...flock, tone: '#D2D0CA' }); lagoonGulls.position.set(31, TOP, -21); lagoonGulls.name = 'italy-birds'; group.add(lagoonGulls); tickers.push(lagoonGulls.userData.tick!);
  const coastGulls = birds(5, 8, 9, { ...flock, tone: '#D2D0CA' }); coastGulls.position.set(20, TOP, 27); coastGulls.name = 'italy-birds'; group.add(coastGulls); tickers.push(coastGulls.userData.tick!);
  void place; void curveOf;
}
