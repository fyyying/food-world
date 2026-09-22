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
 *  the sea's colour. The lagoon is the sea with a translucent `lagoonGreen` sheet over it, which is why its
 *  shallow green sits on the same blue rather than fighting it.
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
 *  Three vertices depart from the blueprint, all on the west coast and all for the same reason the Thai
 *  Andaman bay was cut back: the blueprint's own line ran under the drawn surface of IT-R2. At [-46, -4] and
 *  [-45.6, 2] the Agro road's 2.0-wide ribbon had its west edge 0.3 to 0.6 inside the Tyrrhenian, and the road
 *  cannot move east without running over `italyChicken` at [-43.4, 1]. The coast is 1.2 further west there and
 *  0.8 at [-45.6, -10] so the line stays smooth; nothing else on the table moved. */
export const MAINLAND: Pt[] = [
  [-46, -27], [-38, -27.6], [-30, -27.2], [-22, -27.6], [-14, -27.2], [-6, -27.6], [0, -27.2], [4, -26.4],
  [6, -24], [8, -20], [9, -16], [11, -12.5], [14, -9.5], [18, -8], [23, -7.2], [28, -7.6], [32, -8.4],
  [35, -6], [36, -2], [35, 2], [33, 5],
  [31, 8], [29.6, 10.8], [27.4, 12.4],
  [23.6, 12], [20, 11.2], [16, 10.4], [12, 9.6], [8, 9.2], [4, 9.6], [0, 9], [-4, 9.6], [-8, 9.2],
  [-12, 10], [-16, 10.4], [-20, 10.2], [-24, 10.6], [-28, 10.6], [-33, 10.8], [-38, 10.4], [-42, 10], [-45, 9.4],
  [-46, 6], [-46.8, 2], [-47.2, -4], [-46.4, -10], [-46, -16], [-45.6, -22],
];
/** Sicily's coast, clockwise from the west cape, with the north-east cape at [29, 18.6] facing the toe. */
export const SICILY: Pt[] = [
  [-21, 20], [-18, 17.6], [-14, 16.4], [-10, 16], [-6, 16.4], [-2, 15.8], [2, 16.2], [6, 15.6],
  [10, 16], [14, 15.4], [18, 15.8], [22, 16.2], [26, 17.2], [29, 18.6], [31, 21], [32, 24],
  [31, 27], [29, 29.4], [25, 30.2], [20, 30.6], [15, 30.2], [10, 30.6], [5, 30.2], [0, 30.6],
  [-5, 30.2], [-10, 30.4], [-14, 29.8], [-18, 28.6], [-20, 26], [-21.4, 23],
];

/** The five lagoon islands. The blueprint holds them as rectangles, because a paper check can measure a
 *  rectangle; a quay in the water is not one. Each rectangle is walked at about 1.6-unit intervals and every
 *  sample is stepped **inward** by 0.10 to 0.75, with a deeper notch every fifth, so the island keeps the
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
      const road = nz < 0, inset = road ? .10 + k * .16 : .12 + k * .33 + (i % 5 === 3 ? .30 : 0);
      pts.push([x + nx * inset + (i ? 0 : px * .18), z + nz * inset + (i ? 0 : pz * .18)]);
    }
  };
  edge(x0, z0, x1, z0, 0, 1, 1, 0); edge(x1, z0, x1, z1, -1, 0, 0, 1); edge(x1, z1, x0, z1, 0, -1, -1, 0); edge(x0, z1, x0, z0, 1, 0, 0, -1);
  return pts;
}
/** Island id, its blueprint rectangle and what stands on it. The lido barrier carries nothing: it is the bar
 *  of land the lagoon is shallow behind, with the open porto south of it. */
export const ISLANDS: { id: string; rect: [number, number, number, number]; seed: number }[] = [
  { id: 'rialto-quay', rect: [21, 35, -26.5, -19.5], seed: 1 },
  { id: 'san-marco-quay', rect: [23, 35, -16.5, -10], seed: 2 },
  { id: 'burano', rect: [10.5, 19, -28.6, -23], seed: 3 },
  // The valli bank is x 12.6 to 20.5 and z -17.5 to -11.2 rather than the blueprint's 11 to 20.5 and -17.5 to
  // -10.5: the blueprint rectangle's south-west corner lay up to 0.9 inside the mainland's lagoon shore, so the
  // two holes overlapped and the sea could not be cut round both. A 0.4 channel now separates bank and shore.
  { id: 'valli-bank', rect: [12.6, 20.5, -17.5, -11.2], seed: 4 },
  { id: 'lido', rect: [38, 41, -29, -13], seed: 5 },
];
export const islandOutline = (id: string): Pt[] => {
  const i = ISLANDS.find(x => x.id === id)!;
  return quayOutline(i.rect[0], i.rect[1], i.rect[2], i.rect[3], i.seed);
};

/** The Tiber. `freshWater()` at width 2.4 on a rim 1.6 wider, with an `estuaryWater` blend from z 8 to the
 *  mouth. Two departures from the blueprint's twelve points, both required by the water rule of 2026-09-22:
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
  [-5.2, -21.6], [-8, -21], [-14, -19.5], [-20, -18], [-25, -16], [-28, -13], [-30, -9.5],
  [-31, -6], [-31.5, -2], [-32, 2], [-32.5, 6], [-33, 10.6], [-33.2, 12],
];
export const TIBER_WIDTH = 2.4, TIBER_RIM = 4.0;
export const TIBER_CURVE = new THREE.CatmullRomCurve3(TIBER_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
export const TIBER_MOUTH: Pt = [-33.2, 12];
/** The spring the Tiber rises in, under the Apennine hills east of Rome. */
export const SPRING = { id: 'tiber-spring', x: -5.2, z: -21.6, rx: 1.7, rz: 1.7 };

/** Heights. Tints end near .012, town paving .018, the road ribbons .036 upward, the sea rim .030, the river
 *  bank .034, the sea .060, the lagoon sheet .066, the river .090, the spring .094. Each step is at least
 *  .004, the distance at which two flat surfaces stop fighting for the depth test. */
export const RIM_Y = .030, BANK_Y = .034, SEA_Y = .060, LAGOON_Y = .066, RIVER_Y = .090, SPRING_Y = .094;
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

/** The Apennine ridge the Tiber rises under, in the mainland's south-east between Rome and the strait. The
 *  lead's note is that this ground reads as blank without it; it carries no object and no road. */
export const APENNINES = { x: 17, z: 1.4, rx: 13.5, rz: 6.4, h: 1.05, crown: .55 };
/** Etna's own flank, behind the Sicilian coast road and east of the almond terraces. It is deliberately low:
 *  `etnaIt` stands at its foot at [23, 19.2] with `elevation: 0` in the object list, so a tall crown there
 *  would bury the volcano instead of raising it. */
export const ETNA_FLANK = { x: 25, z: 20.6, rx: 3.6, rz: 1.9, h: .62, crown: .5 };
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
 * The thirteen decorative houses the blueprint fixes, with what became of each. Style, position, rotation,
 * width, depth, height, storeys; `built: false` carries the reason it is not standing.
 *
 * The blueprint's paper check measured a house as a 1.5-radius point kept 2.5 from each clickable's anchor.
 * What this table's harness measures — the rule `thailand-world.mjs` set and `italy-world.mjs` copies — is the
 * box a house actually occupies against each clickable's 6 x 5 pad, the 2.5 of clear ground round its anchor,
 * and the arrival camera's view of it. Every house was searched for the nearest spot on its own landmass,
 * within seven units, that passes all of those, at its drawn size and again at 0.72 of it. Six stand:
 *
 * - `it-piazza-palazzo` 2.4 north, to [-19.2, -14.1], off `gelateria`'s pad; still behind the street
 * - `it-piazza-casa` 4.8 east, to [-6.8, -0.6], off `pasta`'s pad, at the Pantheon end of the street, and one
 *   storey rather than two: at two it covered the Pantheon on three of ten rays and the Colosseum on two
 * - `it-campagna-casale` 3.4 north, to [-40.4, -14.4], off the pads of the flock, the mill, the wine cart and
 *   the chestnut wood, which all four reached
 * - `it-coast-casa` 1.0 to [18.3, 25], and `it-etna-casa` 2.3 east to [28.2, 21.4], both at 0.72 size, off
 *   `tonnaraIt`'s and `etnaIt`'s pads; the latifondo's tower stays where it was put, also at 0.72
 *
 * and seven do not, which is the Thai Lanna house's and Spain's Castile's finding on this table: the
 * blueprint's own stands leave no ground outside their pads anywhere near these seven points.
 *
 * - Venice: all four. The Rialto quay is 14 by 7 and `seafood`'s and `bacaro`'s pads cover it from x 21.5 to
 *   33 and z -25.05 to -20.05, leaving 0.95 behind them; Burano is 8.5 by 5.6 and `lagunaIt`'s pad covers all
 *   but 1.5 of its east end; the San Marco quay is held between `campanileIt`'s pad and `rialtoIt`'s. Venice's
 *   built fabric is its stands: the Pescaria, the osteria, the lagoon kitchen, the campanile and the Rialto
 * - Palermo: both. The Albergheria's two houses stood inside `friggitoria`'s pad, and every spot within seven
 *   units on the lane's south side is inside `friggitoria`'s, `pastry`'s or `tomato`'s
 * - `it-trastevere-casa`: inside the pads of `basil`, `stall-tomato` and `stall-oil`, with the Tiber and the
 *   Testaccio loop on its other sides
 *
 * `terraferma` and `buranoCottage`, `venetianQuay` and `palermoTufa` stay buildable styles in
 * `italy-architecture.ts`; nothing places one on this table until the lead re-blueprints those clusters.
 */
export const IT_HOUSES: { id: string; style: ItalyStyle; x: number; z: number; rot: number; w: number; d: number; h: number; storeys?: number; built: boolean; why?: string }[] = [
  { id: 'it-piazza-palazzo', style: 'romanPalazzo', x: -19.2, z: -14.1, rot: .06, w: 3.4, d: 2.6, h: 2.0, storeys: 3, built: true },
  { id: 'it-piazza-casa', style: 'trastevere', x: -6.8, z: -.6, rot: -.12, w: 2.8, d: 2.2, h: 2.1, storeys: 1, built: true },
  { id: 'it-trastevere-casa', style: 'trastevere', x: -27.5, z: -3, rot: .18, w: 3.0, d: 2.3, h: 2.1, storeys: 2, built: false, why: 'inside the pads of basil, stall-tomato and stall-oil; no spot within 7' },
  { id: 'it-campagna-casale', style: 'casale', x: -40.4, z: -14.4, rot: -.2, w: 3.6, d: 2.6, h: 2.3, storeys: 1, built: true },
  { id: 'it-rialto-casa', style: 'venetianQuay', x: 22.8, z: -24.8, rot: .08, w: 2.6, d: 2.0, h: 2.1, storeys: 2, built: false, why: 'inside seafood\'s pad; 0.95 of quay behind the stands' },
  { id: 'it-rialto-magazzino', style: 'venetianQuay', x: 32.2, z: -24.6, rot: -.1, w: 3.2, d: 2.2, h: 2.2, storeys: 2, built: false, why: 'inside bacaro\'s pad; 0.95 of quay behind the stands' },
  { id: 'it-sanmarco-casa', style: 'venetianQuay', x: 25.5, z: -13, rot: .22, w: 2.6, d: 2.0, h: 2.1, storeys: 2, built: false, why: 'between campanileIt\'s and rialtoIt\'s pads; no spot within 7' },
  { id: 'it-burano-casa', style: 'buranoCottage', x: 17.2, z: -26.95, rot: .12, w: 2.4, d: 1.9, h: 2.0, storeys: 1, built: false, why: 'lagunaIt\'s pad covers Burano but 1.5 of its east end' },
  { id: 'it-albergheria-casa', style: 'palermoTufa', x: -9.5, z: 26.2, rot: -.08, w: 2.8, d: 2.2, h: 2.1, storeys: 2, built: false, why: 'inside friggitoria\'s pad; no spot within 7' },
  { id: 'it-albergheria-torre', style: 'palermoTufa', x: -16.2, z: 25.8, rot: .14, w: 2.2, d: 2.2, h: 2.0, storeys: 3, built: false, why: 'inside friggitoria\'s pad; no spot within 7' },
  { id: 'it-coast-casa', style: 'sicilianCoast', x: 18.3, z: 25, rot: .1, w: 2.0, d: 1.6, h: 2.0, storeys: 1, built: true },
  { id: 'it-etna-casa', style: 'sicilianCoast', x: 28.2, z: 21.4, rot: -.24, w: 1.9, d: 1.45, h: 2.0, storeys: 1, built: true },
  // Built by latifondoMasseria(), reduced to the masseria's tower and moved from [1.2, 25.4] to [0.1, 26.6]:
  // the blueprint point sat 3.0 from `granoIt`, inside its pad, and the ground between `pastry`'s pad and
  // `granoIt`'s is 2.2 wide, so the tower stands centred in it and 1.2 further from the lane.
  { id: 'it-latifondo-masseria', style: 'casale', x: .1, z: 26.6, rot: 0, w: 1.4, d: 1.4, h: 0, built: true },
];
/** The three buildings that belong to a stand. They are not extra houses, but they are blockers under exactly
 *  the same rule, and each is built low on purpose so it never stands between the visitor and a stand. The
 *  byre is at [-39, 2.4], 0.54 from the blueprint's [-39.5, 2.6] and square to the table: turned, or a unit
 *  wider, it reached into the 6 x 5 pads of both `italyChicken` and `italyBeef`. The tonnara's sheds are 0.6
 *  east of the blueprint's [15.6, 28.6], off `granoIt`'s pad. */
export const IT_STAND_BUILDINGS: { id: string; owner: string; x: number; z: number; rot: number }[] = [
  { id: 'forno-oven-house', owner: 'oven', x: -16.6, z: -10.6, rot: .1 },
  { id: 'casale-byre', owner: 'cheese', x: -39, z: 2.4, rot: 0 },
  { id: 'tonnara-sheds', owner: 'tonnaraIt', x: 16.2, z: 28.6, rot: .05 },
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
/** True when any corner or the centre of the box stands in the sea, the lagoon, the Tiber or its spring:
 *  nothing the Builder plants stands in water. The outlines are computed once per build. */
let wetCache: { land: { id: string; poly: Pt[] }[]; fresh: Pt[][] } | null = null;
function inWater(box: THREE.Box3): boolean {
  wetCache ??= { land: landOutlines(), fresh: freshOutlines() };
  const xs = [box.min.x, (box.min.x + box.max.x) / 2, box.max.x], zs = [box.min.z, (box.min.z + box.max.z) / 2, box.max.z];
  return xs.some(x => zs.some(z => isWet(x, z, wetCache!.land, wetCache!.fresh)));
}
/** Place a piece of scenery and take it away again if it blocks a clickable, a lane or the water. Everything
 *  the Builder plants goes through this, so a tree that would stand in an approach simply is not there. */
export function tryPlace<T extends THREE.Object3D>(ctx: LayoutCtx, o: T, x: number, z: number, rot = 0, y = 0, claim = true): T | null {
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
  if (box && (!clearOfObjects(box) || onRoad(box) || inCameraWedge(box) || inWater(box) || (claim && overlapsOccupied(box)))) { ctx.group.remove(o); return null; }
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
/** One continuous ribbon each, at the blueprint widths, and **one network per landmass**: the mainland's
 *  three ribbons meet at [-27.5, -7.4] and [-4, -7.4], Sicily's three at [0, 22.6] and [12, 22.2], and the
 *  lagoon's four are each one island's fondamenta, joined across the Grand Canal by the Rialto and otherwise
 *  by boat. `net` names the piece so the harness can check each network is whole instead of failing the table.
 *
 *  Six departures from the blueprint's own points, each recorded with its reason:
 *
 *  - **IT-R3** [7, -20] → [6.2, -20], [5.2, -22.4] → [4.6, -22.4], [2.6, -23.8] → [2.4, -23.8]. At the
 *    blueprint's x the via consolare's 2.2-wide ribbon had its east edge 0.1 to 0.3 inside the lagoon all the
 *    way down to the landing. The blueprint's own rule is to move the road, not the water, so it moved.
 *  - **IT-R4** gains a first point [-17, 21.4]. The lane ended at [-17, 23] in open ground, and `tomato` at
 *    [-15.5, 19] — which the blueprint itself puts "on the beds at the west end" — was 3.0 from the lane's
 *    surface, over the 2.6 a door is allowed. The lane now turns down to the beds and both are answered.
 *  - **IT-R5** gains a last point [26.2, 25.2]. The coast road ended at [24, 22.8] meeting nothing at all, and
 *    `capperiIt` at [26.5, 26.5] was 3.6 from its surface. The road climbs to the caper terraces instead.
 *    Stage D (2026-09-22) moved that point on to [26.2, 26.6], so the terraces' camera-facing front, at z 28.5,
 *    is within 2.0 of the road's edge.
 *  - **IT-R6** moves 0.3 north, to z -20.9 … -21.2, and starts at x 22.4 rather than 22. At the blueprint's
 *    line the fondamenta's 1.8-wide ribbon hung 0.2 over the Grand Canal for its whole length and 0.4 off the
 *    quay's western end. **IT-R7**'s first point follows it to [27, -21].
 *  - **IT-R8** moves 0.5 north, to z -24.4 … -24.6, and starts at x 11.8, for the same reason on Burano.
 *  - **IT-R9** moves 0.3 north and starts at x 13.4, because the valli bank it runs on was cut back off the
 *    mainland's shore (see ISLANDS).
 */
export const IT_ROADS: Road[] = [
  { id: 'IT-R1', width: 2.4, net: 'mainland', points: [[-27.5, -7.4], [-24, -7.4], [-20.5, -7.4], [-16, -7.4], [-12, -7.4], [-8, -7.4], [-4, -7.4]] },
  { id: 'IT-R2', width: 2.0, net: 'mainland', points: [[-27.5, -7.4], [-29.2, -6.8], [-31, -6], [-32.6, -5.2], [-34, -4.6], [-36, -4.2], [-38, -4.1], [-41, -4], [-44, -3.4], [-45.2, -0.8], [-44.8, 2.2], [-43.6, 5], [-41.5, 7.6], [-38.5, 8.2], [-35.6, 7.6]] },
  { id: 'IT-R3', width: 2.2, net: 'mainland', points: [[-4, -7.4], [0, -8.4], [3, -10.2], [5.6, -12], [7, -13.5], [7, -17], [6.2, -20], [4.6, -22.4], [2.4, -23.8]] },
  { id: 'IT-R4', width: 2.0, net: 'sicily', points: [[-17, 21.4], [-17, 23], [-12, 23], [-8, 23], [-4, 23], [0, 22.6]] },
  { id: 'IT-R5', width: 1.8, net: 'sicily', points: [[0, 22.6], [4, 22.2], [8, 21.8], [12, 22.2], [16, 22.6], [20, 22.4], [24, 22.8], [26.2, 26.6]] },
  { id: 'IT-R5b', width: 1.6, net: 'sicily', points: [[12, 22.2], [12, 25], [12, 28]] },
  { id: 'IT-R6', width: 1.8, net: 'rialto', points: [[22.4, -20.9], [26, -21], [30, -21.1], [33, -21.2]] },
  { id: 'IT-R7', width: 1.8, net: 'rialto', points: [[27, -21], [27, -19.6], [27, -16.6], [27.6, -14.8], [29.5, -13.9], [32, -13.6]] },
  { id: 'IT-R8', width: 1.6, net: 'burano', points: [[11.8, -24.6], [14, -24.4], [17, -24.6]] },
  { id: 'IT-R9', width: 1.4, net: 'valli', points: [[13.4, -12.9], [16, -13], [19, -12.9]] },
  // Stage D, 2026-09-22: the doors. Every stand faces the camera (+z), so a stand whose street runs behind it
  // gets a lane in front instead of being turned to the street. Four lanes, all within one landmass's network.
  { id: 'IT-R1b', width: 1.6, net: 'mainland', points: [[-8, -7.4], [-9.6, -4.4], [-11.2, -2.2], [-15.2, -2.2], [-15.6, 0.4], [-22, 0.4], [-23, 2.4], [-25.6, 2.4]] },
  { id: 'IT-R3b', width: 1.2, net: 'mainland', points: [[3, -10.2], [0.8, -13], [0.8, -17.6]] },
  { id: 'IT-R4b', width: 1.4, net: 'sicily', points: [[-8, 23], [-8.1, 27.8]] },
  { id: 'IT-R4c', width: 1.4, net: 'sicily', points: [[-13.6, 27.8], [-8.1, 27.8], [-3, 27.8]] },
];
export const road = (id: string) => IT_ROADS.find(r => r.id === id)!;

/** Two bridges. `ponteIt` is the stone road bridge where IT-R2 crosses the Tiber, and it is the Builder's own
 *  decor. `rialtoIt` is a registered clickable landmark whose geometry comes from `props-italy.ts`, so the
 *  Builder draws no deck there and only carries the road and the walkers over it. */
export type Crossing = { id: string; at: Pt; span: number; road: string; built: boolean };
export const IT_CROSSINGS: Crossing[] = [
  { id: 'ponteIt', at: [-31, -6], span: BRIDGE_SPAN, road: 'IT-R2', built: true },
  { id: 'rialtoIt', at: [27, -18], span: BRIDGE_SPAN, road: 'IT-R7', built: false },
];
/** Deck centres, in the shape `spain-town.ts` uses. A road may touch the water only inside one of these. */
export const IT_BRIDGES: Pt[] = IT_CROSSINGS.map(c => c.at);

/** The five boat lanes. The islands are linked to each other and to the mainland by water, not by a causeway:
 *  the doc names only one bridge between them and it is built. */
export type BoatLane = { id: string; points: Pt[]; boats: number; kind: 'gondola' | 'sandolo' | 'barge' | 'bragozzo' | 'ferry'; speed: number };
export const IT_BOAT_LANES: BoatLane[] = [
  { id: 'L1', points: [[19, -18.2], [24, -18], [27, -18], [31, -17.6], [36, -17.2]], boats: 3, kind: 'gondola', speed: .010 },
  { id: 'L2', points: [[8.8, -21.6], [12, -21.2], [16, -21], [19.5, -19.8], [19.8, -20.6]], boats: 3, kind: 'sandolo', speed: .009 },
  { id: 'L3', points: [[21.7, -19.2], [21.8, -16], [21.6, -13.5]], boats: 1, kind: 'barge', speed: .008 },
  // L4 bends a little further from the lido's south-west corner than the blueprint's [37.5, -15]: at that
  // point a 4.2-long bragozzo swinging through the turn put its stem on the lido's quay.
  { id: 'L4', points: [[36, -17.2], [36.6, -14.6], [37.6, -12.2], [39.5, -11.2], [42, -9.5], [45, -8]], boats: 2, kind: 'bragozzo', speed: .007 },
  { id: 'L5', points: [[31.5, 11.5], [31.8, 14], [31.4, 16.5], [30.6, 18.6]], boats: 1, kind: 'ferry', speed: .006 },
];

/** Straight walking segments cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the clothing profile on the lane out of `italy-people.ts`. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number };
function segments(r: Road, first: number, last: number, walkers: number[], seeds: number[]): Lane[] {
  return r.points.slice(first + 1, last + 1).map((to, i) => ({
    id: `${r.id}-${first + i}`, from: r.points[first + i], to, range: [.07, .93] as [number, number],
    walkers: walkers[i], seed: seeds[i],
  }));
}
/** The blueprint's five peopled loops: the piazza, the Agro road, the Rialto circuit over the bridge, the
 *  Albergheria lane and the coast road. Twenty-four residents in all. */
export const IT_LANES: Lane[] = [
  ...segments(road('IT-R1'), 1, 5, [2, 1, 2, 1], [0, 7, 14, 2]),              // the piazza, six
  ...segments(road('IT-R2'), 4, 12, [1, 0, 0, 1, 0, 0, 1, 1], [3, 0, 0, 12, 0, 0, 5, 20]).filter(l => l.walkers > 0),
  ...segments(road('IT-R6'), 0, 3, [1, 1, 1], [4, 9, 17]),                    // the Rialto, five with two porters
  ...segments(road('IT-R7'), 1, 3, [1, 1], [23, 6]),
  ...segments(road('IT-R4'), 1, 5, [1, 2, 1, 1], [7, 11, 1, 15]),             // the Albergheria, five
  ...segments(road('IT-R5'), 0, 5, [1, 0, 1, 1, 1], [8, 0, 21, 13, 6]).filter(l => l.walkers > 0),
];
/** The lane the Castelli wine carts run on, the lane the Agro mule is led along, and the lane the shepherd
 *  walks behind his flock. */
export const CART_LANE = 'IT-R1-1', MULE_LANE = 'IT-R2-4', SHEPHERD_LANE = 'IT-R2-10';

export function italyLandscape(ctx: LayoutCtx) {
  const { group, tickers, place, tint, TOP } = ctx;
  seedOccupied(); wetCache = null;

  // ---------- ground tints, one per cluster, laid before anything solid ----------
  tint(-17, -6.5, 10, 5, '#d9cbb0');            // Rome: travertine and basalt setts on the piazza
  tint(-38, -1, 11, 10, '#c6b489');             // Testaccio and the Agro: dry campagna
  tint(-33, 2, 3.4, 9, '#b9ad98', .05);         // the river quay along the Tiber below Rome
  tint(27, -19, 7, 5, '#ded3b6');               // Venice: Istrian stone over brick, the quays themselves
  tint(4, -18, 8, 7, '#a9b878');                // the terraferma, maize green
  tint(14.5, -25.6, 5, 3.4, '#c8bd93');         // Burano, sand and salt marsh
  tint(15.5, -14, 5.2, 3.6, '#c8bd93', .05);    // and the valli bank
  tint(-8, 22, 9, 5, '#cdbb92');                // Palermo: tufa under awnings
  tint(16, 23, 12, 7, '#b6ac7e');               // the tonnara coast, dry gold
  tint(25.4, 20.4, 5.6, 3.4, '#6b6258', -.05);  // running to basalt under Etna
  tint(17, 1.4, 13, 6.4, '#b3ab8e', .04);       // the Apennine ground in the mainland's south-east

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

  // ---------- the lagoon: the same sea under a translucent shallow-green sheet, held by the lido ----------
  // The blueprint tints the lagoon `#69b3b0` **over the sea's own blue**, so this is a sheet at .006 above the
  // water rather than a second body of water. Its holes are the five islands, so nothing green crosses a quay.
  // Its east edge is the lido's own lagoon side, so the shallow water stops at the barrier instead of drawing a
  // straight line across the open Adriatic.
  const lagoonRing: Pt[] = [[6.5, -32], [6.5, -24.5], [8, -20], [9, -16], [11, -12.5], [14, -9.5], [18, -8], [23, -7.2], [28, -7.6], [32, -8.4], [35, -6], [37.9, -7.4], [37.9, -32]];
  const lagoon = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(lagoonRing, ISLANDS.filter(i => i.id !== 'lido').map(i => islandOutline(i.id)))),
    mat(ITP.lagoonGreen, { transparent: true, opacity: .42, depthWrite: false }));
  lagoon.rotation.x = -Math.PI / 2; lagoon.scale.y = -1; lagoon.position.y = TOP + LAGOON_Y;
  lagoon.renderOrder = 3; lagoon.name = 'lagoon-shallows'; group.add(lagoon);

  // The two Venetian quays are paved in Istrian stone to their own irregular edge, inside the sand rim; Burano,
  // the valli bank and the lido stay marsh and sand.
  for (const id of ['rialto-quay', 'san-marco-quay']) {
    const stone = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(offsetOutline(islandOutline(id), -.35))), mat('#d8cfb8'));
    stone.rotation.x = -Math.PI / 2; stone.scale.y = -1; stone.position.y = TOP + .012; stone.receiveShadow = true; stone.name = 'quay-stone'; group.add(stone);
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
  // The ridge line itself stands on the raised ground, in the empty south-east between Rome and the strait.
  for (const [x, z, r, h, bare] of [[9, -1.4, 3.2, 4.2, false], [14, 2.2, 3.8, 5.4, false], [19, -1.8, 3.4, 4.8, true],
    [23.5, 2.6, 3.0, 4.0, false], [27, -2.2, 2.6, 3.4, true], [16, 5.6, 2.4, 3.0, false]] as [number, number, number, number, boolean][]) {
    const hill = tryPlace(ctx, apennineRidge(r, h, bare), x, z, x * .2, apennineHeight(x, z), false);   // hills may run into one another
    if (hill) hill.name = 'apennine-ridge';
  }
  // The snow pits cut into the flank under Etna first, then the basalt walls round them, and black sand.
  for (const spots of [[[21.8, 26.4, .1], [22.2, 27.4, .1], [21.2, 25.6, .1]], [[23.4, 17.6, .3], [21.6, 28.6, -.2], [19.8, 20.6, .2]]] as [number, number, number][][]) {
    const pit = tryPlaceAny(ctx, () => snowPit(), spots, 0); if (pit) { pit.name = 'snow-pit'; pit.position.y = etnaHeight(pit.position.x, pit.position.z); }
  }
  for (const [x, z, rot, len] of [[20.4, 29.0, .1, 3.0], [29.8, 22.4, 1.3, 2.4], [28.8, 23.2, 1.2, 3.2], [22.6, 22.0, .1, 4.4], [26.4, 22.4, -.15, 3.6], [21.2, 18.6, .2, 3.0], [24.8, 29.2, -.05, 2.6]] as [number, number, number, number][]) {
    const wall = tryPlace(ctx, lavaWall(len), x, z, rot, etnaHeight(x, z)); if (wall) wall.name = 'lava-wall';
  }
  for (let i = 0; i < 14; i++) {
    const x = 20 + (i % 7) * 1.4, z = 18.4 + Math.floor(i / 7) * 1.2 + (i % 3) * .3;
    const sand = add(group, new THREE.Mesh(new THREE.CircleGeometry(.9 + (i % 3) * .3, 12), mat('#4A4650')), x, TOP + .014 + etnaHeight(x, z), z);
    sand.rotation.x = -Math.PI / 2; sand.name = 'black-sand';
  }

  // ---------- the air over the water ----------
  const swifts = birds(6, 7, 7); swifts.position.set(-18, TOP, -8); group.add(swifts); tickers.push(swifts.userData.tick!);
  const lagoonGulls = birds(6, 9, 9); lagoonGulls.position.set(22, TOP, -20); group.add(lagoonGulls); tickers.push(lagoonGulls.userData.tick!);
  const coastGulls = birds(5, 8, 8); coastGulls.position.set(14, TOP, 27); group.add(coastGulls); tickers.push(coastGulls.userData.tick!);
  void place; void curveOf;
}
