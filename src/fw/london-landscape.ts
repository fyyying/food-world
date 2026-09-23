/** Ground, water and relief for Britain on the grown Central Europe table.
 *
 *  The table grows to W 120, D 56, cx -22, identical to the Mediterranean and to Southeast Asia, so x runs
 *  -82 to 38 and z stays -28 to 28. Britain owns x -80 to -34, z -28 to 24; the Alps, Hungary and Georgia keep
 *  every coordinate they have.
 *
 *  The sea is **one** `seaWater()` polygon: an outer ring along the table's west, north and south edges and
 *  the continent's west coast at x -31.4, with **the island's coast as that shape's hole**. One polygon, one
 *  rim, one shader, and the strait between the island's east shore and the continent falls out of the ring
 *  rather than being a second piece of water laid beside it. `THREE.Shape` holes triangulate cleanly under
 *  `ShapeGeometry`, so the two-polygon fallback the brief allows was not needed.
 *
 *  Water materials are the continent's own and are not changed: `seaWater()` for the sea, `freshWater()` for
 *  the tarn the river rises in, and `estuaryWater(mouth, 'x')` for the river, which is fresh upstream and the
 *  sea's own colour at and past the mouth. The rim is `#e6dfc4`, the colour the Channel and the Black Sea
 *  already used, inset 1.2 computed per vertex rather than from one centre, so the caps at the table edge stay
 *  square.
 */
import * as THREE from 'three';
import { add, mat, birds } from './props';
import { seaWater, freshWater, estuaryWater, addFish, type LayoutCtx } from './worldkit';
import { LONDON_OBJECTS } from './london-objects';
import { LONDON_PROPS } from './props-london';

export type Pt = [number, number];
/** Table edges after the growth to W 120, D 56, cx -22. */
export const TABLE = { minX: -82, maxX: 38, minZ: -28, maxZ: 28 };
export const atEdgeX = (x: number) => x <= TABLE.minX || x >= TABLE.maxX;
export const atEdgeZ = (z: number) => Math.abs(z) >= TABLE.maxZ;
/** The band rule: Britain owns x -80 to -34 and z -28 to 24. Nothing British is laid east of the strait. */
export const LD_BAND: Pt = [-80, -34];

/** The sea's outer ring: the table's west, north and south edges, and the continent's west coast at x -31.4.
 *  Four vertices, every one of them on a table edge or on that dead-straight coast, so this ring takes no
 *  jitter at all: a wobble here would tilt the strait's eastern shore. */
export const SEA_RING: Pt[] = [[-82, -28], [-31.4, -28], [-31.4, 28], [-82, 28]];

/** The Firth of Forth as drawn, west shore then east: a mouth that opens to 2.6 on the north coast, a narrows of
 *  about 1.45 under the bridge (the bridge's west anchor stands on land at the harness's ±1.4 proxy, and its east
 *  piers on the far shore), then a shallow bend to a rounded head at z -20.6. The owner saw the old four-point cut
 *  as a straight-sided slot, a dry dock (walkthrough item 4, 2026-09-23), so the shores are laid close enough to
 *  read as curves and take none of the coast's wobble. */
export const FIRTH: Pt[] = [
  [-58.2, -26.15], [-57.75, -25.7], [-57.7, -24.7], [-57.78, -23.6], [-57.95, -22.6], [-57.9, -21.6], [-57.55, -20.85],
  [-57.05, -20.55], [-56.6, -20.75], [-56.4, -21.5], [-56.38, -22.5], [-56.33, -23.6], [-56.32, -24.6], [-56.35, -25.6],
  [-56.0, -26.05], [-55.5, -26.3],
];
/** The island's coast, traced so the land stays inside it: the north coast with the Firth of Forth cut into
 *  it, the strait's west shore with the river-mouth notch, the south coast, and the west coast with the
 *  Bristol Channel cut into it. This polygon is the **hole** in the shape above. */
export const ISLAND: Pt[] = [
  [-79.8, -24], [-77, -25.4], [-73, -26], [-69, -25.6], [-65, -26.4], [-62, -26], [-59.6, -26.3],   // the north coast
  ...FIRTH,                                                                                         // the Firth of Forth, a natural inlet to z -20.6
  [-53, -26.2], [-49, -25.6], [-45, -26.2], [-41, -25.8], [-37.4, -26], [-35.8, -24],                // on to the north-east cape
  [-35.6, -20], [-35.8, -14], [-35.6, -8], [-35.6, -2], [-36.2, 2.6], [-36, 5.6],                    // the strait's west shore, notched for the river mouth,
  [-36.3, 5.5], [-40.2, 4.8], [-40.2, 8.1], [-37.9, 8.1], [-37.9, 12.6], [-35.9, 12.7],               // then the dock basin under Tower Bridge, where the coaster and the oyster smacks lie
  [-36, 16], [-36, 23], [-37.2, 25.6],
  [-40, 26], [-44, 25.9], [-48, 25.8], [-52, 26], [-56, 25.8], [-60, 26], [-64, 25.8], [-68, 26],      // the south coast
  [-72, 25.8], [-76, 25.5], [-79, 24.6], [-79.7, 21.5], [-79.6, 18.8],
  [-76, 17.8], [-71.8, 16.6], [-71.4, 14], [-73.5, 13.5], [-77, 13.2], [-79.6, 12.4],                // the Bristol Channel, its head at x -71.4
  [-79.7, 6], [-79.5, 0], [-79.7, -6], [-79.4, -12], [-79.8, -18],                                   // the west coast, back to the start
];
/** How far the drawn coast wobbles off the traced line. The blueprint asks the strait to stay at least 4.0
 *  wide after the jitter and it is only 4.2 at its narrowest, so the strait's own shore — every island vertex
 *  at x -37 or east of it — takes no sideways wobble at all. */
export const COAST_JITTER = .18;
const STRAIT_SHORE = -37;

export const RIM_Y = .030, BANK_Y = .034, SEA_Y = .060, RIVER_Y = .090, TARN_Y = .094, SAND_WET_Y = .100, SAND_DRY_Y = .020;
/** How far a bridge deck, and a walker on it, stands above the lane so the river passes underneath. */
export const ROAD_LIFT = .9;

// ---------------------------------------------------------------------------------------------------------
// Polygon helpers. The harness reads the drawn outlines out of this file, so every measurement it makes is a
// measurement of the mesh that is actually in the world.
// ---------------------------------------------------------------------------------------------------------

export function inPolygon(x: number, z: number, poly: Pt[]): boolean {
  let yes = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[i], [bx, bz] = poly[j];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) yes = !yes;
  }
  return yes;
}
/** Distance from a point to a polygon's boundary, whichever side of it the point is on. */
export function edgeDistance(x: number, z: number, poly: Pt[]): number {
  let d = 1e9;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j], [bx, bz] = poly[i];
    const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
    d = Math.min(d, Math.hypot(x - ax - ex * t, z - az - ez * t));
  }
  return d;
}
/** The sea's outer ring as drawn. It carries no wobble: every one of its four vertices is a table edge or the
 *  straight continental coast the strait is measured against. */
export function seaOutline(): Pt[] { return SEA_RING.map(p => [...p] as Pt); }
/** The island's coast as drawn: a small index-driven wobble, none of it sideways on the strait's own shore. */
export function islandOutline(): Pt[] {
  // The wobble is keyed to each vertex's index in the coast as it was before the firth was redrawn with sixteen
  // points in place of three, so every other shore keeps exactly the line the shared-ground pass measured.
  const firstFirth = ISLAND.findIndex(p => p === FIRTH[0]), shift = FIRTH.length - 3;
  return ISLAND.map(([x, z], i) => {
    if (i >= firstFirth && i < firstFirth + FIRTH.length) return [x, z] as Pt;
    const k = i >= firstFirth + FIRTH.length ? i - shift : i;
    return [x >= STRAIT_SHORE ? x : x + Math.sin(k * 2.7) * COAST_JITTER, z + Math.cos(k * 1.9) * COAST_JITTER] as Pt;
  });
}
/** Each vertex moves along the bisector of its two edge normals; a vertex on a table edge stays put, so the
 *  caps there remain square. `d` positive grows the polygon, negative shrinks it. */
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
/** The island's rim: the coast shrunk by `d`. The Firth of Forth is 1.7 across and the Bristol Channel's head
 *  narrower still, so a flat inset of 1.2 would fold the rim's two walls through each other inside both
 *  inlets. Each vertex therefore takes the largest share of the inset that still leaves it inside the island,
 *  which keeps the rim a simple ring instead of a bow tie. */
export function insetOutline(poly: Pt[], d: number): Pt[] {
  const full = offsetOutline(poly, -d);
  const cap = d * 1.6;   // a mitre at a right angle needs d * 1.41; past that the corner is a spike, not a corner
  return poly.map(([x, z], i) => {
    let ox = full[i][0] - x, oz = full[i][1] - z;
    const len = Math.hypot(ox, oz);
    if (len > cap) { ox = ox / len * cap; oz = oz / len * cap; }
    for (const share of [1, .6, .35, .18]) {
      const nx = x + ox * share, nz = z + oz * share;
      if (inPolygon(nx, nz, poly)) return [nx, nz] as Pt;
    }
    return [x, z] as Pt;
  });
}
/** The polygon of a water ribbon of varying width, for tests that keep roads, stands and walkers out of it. */
export function ribbonOutline(curve: THREE.CatmullRomCurve3, widthAt: (x: number) => number, steps = 160): Pt[] {
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps, p = curve.getPointAt(u), t = curve.getTangentAt(u);
    const half = widthAt(p.x) / 2;
    const s = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(half);
    left.push([p.x - s.x, p.z - s.z]); right.push([p.x + s.x, p.z + s.z]);
  }
  return [...left, ...right.reverse()];
}
/** A circle as a polygon, for the tarn. */
export function circleOutline(c: { x: number; z: number; rx: number; rz: number }, segments = 36): Pt[] {
  return Array.from({ length: segments }, (_, i) => { const a = i / segments * Math.PI * 2; return [c.x + Math.cos(a) * c.rx, c.z + Math.sin(a) * c.rz] as Pt; });
}

// ---------------------------------------------------------------------------------------------------------
// Britain's own water.
// ---------------------------------------------------------------------------------------------------------

/** The island river. It rises in the tarn in the western hills, runs east past the Dales, through the
 *  Westminster cluster, widens past the Docks and reaches the strait at the mouth.
 *
 *  Its source is a pool, not a point in the grass. The blueprint gives [-75, -6] as the rise; a ribbon may
 *  never end in land, so the tarn is laid round that point and the river's first vertex is inside it (see
 *  docs/building-a-world.md, "Water rules"). The west road passes north of both. */
export const RIVER_POINTS: Pt[] = [
  [-75, -6], [-70, -4.5], [-64, -2.5], [-58, -1], [-54, 0], [-50, 1.5], [-46, 2.5], [-42, 3.2], [-38, 3.8], [-35.8, 4.2],
];
export const RIVER_MOUTH: Pt = [-35.8, 4.2];
/** 2.6 to x -42, 4.0 to x -38, 5.2 at the mouth, each on a bank 1.6 wider. */
export function riverWidth(x: number): number {
  if (x <= -42) return 2.6;
  if (x <= -38) return 2.6 + (x + 42) / 4 * 1.4;
  return 4.0 + Math.min(1, (x + 38) / 2.2) * 1.2;
}
export const riverBank = (x: number) => riverWidth(x) + 1.6;
export const RIVER_CURVE = new THREE.CatmullRomCurve3(RIVER_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** The estuary blend is the blueprint's own 2.2 units, but it ends at x -40.4, where the river first meets the
 *  dock basin, not at the mouth. The river's ribbon is 5.2 wide at the mouth and its south edge runs out over the
 *  dock basin under Tower Bridge from x -37.7 east; with the blend ending at the mouth, that stretch of ribbon
 *  was still nearly fresh-water turquoise and lay on the basin's dark sea as a pale cyan sheet with a straight
 *  diagonal edge (second walkthrough 53, 2026-09-23). East of x -40.4 the river is now exactly the sea's colour
 *  and draws with the sea's own noise and time, so the basin, the mouth and the strait are one water. */
export const ESTUARY_BLEND = 2.2, ESTUARY_SEA_X = -40.4;
/*  The same pass moved the dock basin's north edge from z 6.0 to 5.5 at x -36.3 and 4.8 at x -40.2, under the
 *  river's own south edge, which runs from 5.2 at x -40 to 6.3 at x -37. With the blend fixed, the strip of rim
 *  sand left between the two waters showed as a pale triangle with the ribbon's straight diagonal edge across it;
 *  now the basin opens into the river along its whole width and the water is one. Two vertices move and none is
 *  added, so every other coast vertex keeps its wobble. */

/** Every still body of British water: a valid source and a valid mouth for a waterway. */
export const LD_POOLS: { id: string; x: number; z: number; rx: number; rz: number }[] = [
  { id: 'west-tarn', x: -75.6, z: -6.2, rx: 1.4, rz: 1.4 },
  // The oat mill's pond, which the burn leaves by the lade and the wheel (walkthrough item 7, 2026-09-23).
  { id: 'mill-pond', x: -73.45, z: -24.15, rx: .6, rz: .6 },
];
/** The mill burn: out of the mill pond east of the oat mill, west under the lade and the wheel on the mill's
 *  gable (the wheel's axle is at [-75.85, -21.96]), then north past the gable to the sea on the north coast. A
 *  water mill with no water was walkthrough item 7. Its source is inside the pond and its mouth 0.5 inside the
 *  sea, by the water rule. */
export const BURN_POINTS: Pt[] = [
  [-73.55, -23.95], [-74.2, -23.2], [-74.95, -22.45], [-75.85, -22.02], [-75.72, -23.3], [-75.9, -24.8], [-76.05, -26.35],
];
export const BURN_WIDTH = .55;
export const BURN_CURVE = new THREE.CatmullRomCurve3(BURN_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** Every British waterway as a named route, so a harness can check that each one runs from a source to a
 *  mouth instead of stopping in the middle. */
export const LD_WATERWAYS: { id: string; points: Pt[]; width: number }[] = [
  { id: 'island-river', points: RIVER_POINTS, width: 2.6 },
  { id: 'mill-burn', points: BURN_POINTS, width: BURN_WIDTH },
];
/** Distance to the burn's centreline. The burn is not in `isWet`: the oat mill's wheel and lade stand over it
 *  by design, and a stand's vertex over water is the harness's own ceiling. Scenery keeps off it through
 *  `tryPlace`, and no road crosses it. */
const BURN_SAMPLES = BURN_CURVE.getSpacedPoints(80);
export function burnDistance(x: number, z: number): number {
  let d = 1e9; for (const p of BURN_SAMPLES) d = Math.min(d, Math.hypot(x - p.x, z - p.z)); return d;
}

/** The head of the Bristol Channel east of x -75.5 is wet sand, not open water: the sand tint under a
 *  low-alpha sheet, ribbed and draining, with the cockle beds on it. Two polygons, because the western half
 *  lies over the sea and the eastern half is the dry flat the cockle stall stands on. */
export const CHANNEL_SAND_WET: Pt[] = [[-74.9, 13.47], [-73.5, 13.62], [-71.4, 14.12], [-71.0, 14.2], [-71.0, 16.7], [-71.8, 16.5], [-74.9, 17.4]];
export const CHANNEL_SAND_DRY: Pt[] = [[-71.2, 14.1], [-68.4, 14.2], [-68.4, 16.2], [-71.2, 16.8]];

/** Is this point in water? The sea is the ring **minus** the island, so a point inside the island's coast is
 *  dry however far inside the outer ring it is. The wet sand is not water: cockles are gathered standing on
 *  it, and it is the one ground on the table a cart is driven over at low tide. */
export function isWet(x: number, z: number): boolean {
  if (inPolygon(x, z, RIVER_OUTLINE)) return true;
  if (LD_POOLS.some(p => Math.hypot((x - p.x) / p.rx, (z - p.z) / p.rz) <= 1)) return true;
  return inPolygon(x, z, SEA_DRAWN) && !inPolygon(x, z, ISLAND_DRAWN);
}
/** Distance to the nearest water boundary, whichever side of it the point is on. */
export function waterEdge(x: number, z: number): number {
  return Math.min(edgeDistance(x, z, ISLAND_DRAWN), edgeDistance(x, z, SEA_DRAWN), edgeDistance(x, z, RIVER_OUTLINE),
    ...LD_POOLS.map(p => edgeDistance(x, z, circleOutline(p))));
}
/** Every water boundary as a polygon, for a harness that wants the outlines rather than the predicate. */
export function waterOutlines(): Pt[][] {
  return [SEA_DRAWN, ISLAND_DRAWN, RIVER_OUTLINE, ...LD_POOLS.map(p => circleOutline(p))];
}
const SEA_DRAWN = seaOutline(), ISLAND_DRAWN = islandOutline();
const RIVER_OUTLINE = ribbonOutline(RIVER_CURVE, riverWidth);
export const seaDrawn = () => SEA_DRAWN, islandDrawn = () => ISLAND_DRAWN, riverOutline = () => RIVER_OUTLINE;

// ---------------------------------------------------------------------------------------------------------
// Roads, bridges and walking lanes. The tables live here because the landscape needs them too — the hop rows,
// the drystone walls and the moor are cut round them — and `london-town.ts` draws them and re-exports them.
// ---------------------------------------------------------------------------------------------------------

export type Road = { id: string; width: number; points: Pt[] };
/** One continuous ribbon each. Every door in the object list meets one of these.
 *
 *  Re-laid in the shared-ground pass (2026-09-23, docs/london-world.md). Every stand's front faces the camera
 *  (+z), so a road runs across the front of every door, within 2.0 of it, and the stands no longer turn to find
 *  their road. The network is one piece: Whitehall and the Embankment (LD-R1) along the river's north bank with
 *  the Westminster row on its north side; the bridge road (LD-R2) over Westminster Bridge; the dock quay (LD-R3)
 *  under Tower Bridge; Borough High Street and the West Country lane (LD-SB) along the south bank and round the
 *  engine house to the west road; the hop road (LD-R4), the dock road (LD-R3b), the orchard lane (LD-OL), the
 *  cockle lane (LD-CL) and the south coast road (LD-SC) in the south; the dale road (LD-R5) between the tea room
 *  and the pastry board to the flock, the moor road (LD-R5c) to the dairy and the herring quay, the chippy and
 *  forcing-shed lane (LD-R5b), the firth road (LD-R6) and the west road (LD-R7) round the river's tarn. No road
 *  but LD-R2 crosses water, and it crosses on the bridge.
 */
export const LD_ROADS: Road[] = [
  { id: 'LD-R1', width: 2.4, points: [[-72.6, -8.4], [-71.7, -8.2], [-68, -7.0], [-64, -6.0], [-60, -4.8], [-56, -3.5], [-52, -2.6], [-48, -1.7], [-44.6, -1.1], [-41, -0.9], [-37.4, -0.7]] },
  { id: 'LD-R2', width: 1.8, points: [[-44.6, -1.1], [-44.6, 2.85], [-44.6, 5.6], [-44.4, 7.9]] },
  { id: 'LD-R3', width: 1.4, points: [[-44.4, 7.9], [-41.2, 7.9], [-40.4, 9.0], [-38.7, 9.0]] },
  { id: 'LD-R3b', width: 1.4, points: [[-50.5, 15.3], [-45.3, 15.2], [-40, 15.7], [-36.5, 15.9]] },
  { id: 'LD-R4', width: 1.4, points: [[-50.5, 7.95], [-50.5, 15.3], [-55.5, 15.2]] },
  { id: 'LD-SB', width: 1.8, points: [[-44.4, 7.9], [-45.5, 8.35], [-49.5, 8.35], [-51.6, 7.5], [-54.2, 6.9], [-57, 6.9], [-62, 7.4], [-63.6, 8.2], [-64.3, 10.6], [-70.75, 10.6], [-70.75, 4.2], [-73.3, 3.8], [-78.4, 3.8]] },
  { id: 'LD-OL', width: 1.4, points: [[-70.75, 10.6], [-71.8, 11.9], [-75.5, 11.4]] },
  { id: 'LD-CL', width: 1.4, points: [[-64.3, 10.6], [-63.6, 12.0], [-63.6, 18.8], [-67, 19.0], [-71.2, 19.2], [-71.2, 23.9]] },
  { id: 'LD-SC', width: 1.4, points: [[-76.6, 23.9], [-71.2, 23.9], [-66, 24.8], [-58, 24.8], [-54.5, 24.72], [-50, 24.6], [-44, 24.4], [-39.5, 24.2]] },
  { id: 'LD-R5', width: 1.2, points: [[-52.95, -3.1], [-52.95, -10.5], [-49.5, -10.65], [-45.2, -10.9]] },
  { id: 'LD-R5c', width: 1.2, points: [[-49.5, -10.65], [-49.5, -15.4], [-49.5, -17.5], [-46.13, -17.5], [-39.2, -17.5], [-37.4, -17.5]] },
  { id: 'LD-R5b', width: 1.2, points: [[-49.5, -15.4], [-52.4, -15.4], [-55.5, -14.2], [-59.8, -14.1]] },
  { id: 'LD-R6', width: 1.4, points: [[-77.5, -9.0], [-77.8, -12.5], [-77.6, -16.1], [-68.95, -16.1], [-65.0, -16.1], [-65.0, -21.3], [-59.3, -21.3]] },
  // Short spurs from a road to the doorstep of a stand whose front stands deep in front of its anchor.
  { id: 'LD-S-piemash', width: 1.2, points: [[-37.4, -0.7], [-38, -1.6], [-38, -2.8]] },
  { id: 'LD-S-breakfast', width: 1.2, points: [[-45.46, 24.42], [-45.46, 23.9]] },
  { id: 'LD-S-hops', width: 1.2, points: [[-54.5, 24.72], [-54.5, 23.4]] },
  { id: 'LD-S-dairy', width: 1.2, points: [[-46.13, -17.5], [-46.13, -18.4]] },
  { id: 'LD-S-herring', width: 1.2, points: [[-39.2, -17.5], [-39.19, -18.9]] },
  { id: 'LD-S-cockles', width: 1.2, points: [[-67, 19.0], [-68.31, 17.6]] },
  { id: 'LD-S-distillery', width: 1.2, points: [[-68.95, -16.1], [-68.95, -17.4]] },
  { id: 'LD-S-oats', width: 1.2, points: [[-77.6, -16.1], [-76.3, -17.6]] },
  { id: 'LD-S-engine', width: 1.2, points: [[-73.3, 3.8], [-73.3, 3.15]] },
  { id: 'LD-R7', width: 1.4, points: [[-72.6, -8.4], [-77.5, -9.0], [-78.5, -6.8], [-78.5, -1.0], [-78.4, 3.8]] },
  // The omnibus terminus at the south foot of Westminster Bridge: Borough High Street widened to 2.6 where the
  // omnibus and a hansom turn their loop, off every clickable's sight line (walkthrough items 17 and 22).
  { id: 'LD-TS', width: 2.6, points: [[-45.9, 8.35], [-49.3, 8.35]] },
  // The dale yard behind the pillar box: a ring of cart track the pit pony is led round (walkthrough item 20).
  { id: 'LD-YD', width: 1.2, points: [[-47.3, -10.05], [-47.3, -8.3], [-42.6, -8.3], [-42.6, -10.05], [-45.2, -10.1], [-47.3, -10.05]] },
];
export const road = (id: string) => LD_ROADS.find(r => r.id === id)!;

/** A crossing: the deck centre, how far it spans and which road carries it. One road crosses water in the
 *  whole of Britain, and this is it. */
export type Crossing = { at: Pt; span: number; road: string };
export const LD_CROSSINGS: Crossing[] = [
  { at: [-44.6, 2.85], span: 6.0, road: 'LD-R2' },
];
/** Deck centres, in the shape `spain-town.ts` uses: Westminster Bridge, which carries the bridge road, and
 *  Tower Bridge, which carries no road and is the landmark. */
export const LD_BRIDGES: Pt[] = [[-44.6, 2.85], [-37.7, 3.4]];
export const BRIDGE_SPAN = 6.0, BRIDGE_DECK_Y = ROAD_LIFT;

/** Straight walking segments cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the first clothing profile on the lane out of `london-people.ts`. `strips` sets each walker's
 *  own line across the road, as an offset from the centreline along the lane's left-hand normal (for a lane
 *  running east, positive is south): two walkers on one segment keep 0.55 or more apart and never meet, which
 *  is what the Italy fix of 2026-09-23 did for its streets. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number; pace: number; strips?: number[] };
function segments(r: Road, first: number, last: number, walkers: number[], seeds: number[], pace: number): Lane[] {
  return r.points.slice(first + 1, last + 1).map((to, i) => ({
    id: `${r.id}-${first + i}`, from: r.points[first + i], to, range: [.12, .88] as [number, number],
    walkers: walkers[i], seed: seeds[i], pace,
  }));
}
/** Five peopled lanes: the Westminster street, the docks, the dale road, the West Country lane and the dale
 *  yard. Twenty residents in all, at 0.009 on the Westminster street and 0.007 everywhere else. Every segment
 *  stops 12 percent short of its corners, so two walkers arriving at a shared corner from both sides stay a
 *  unit apart, and a pair on one segment walks two strips.
 *
 *  Whitehall carries no traffic now (the omnibus and the hansoms turn at the south foot of Westminster Bridge),
 *  so its walkers use the whole street from the palace to the bridge. They keep to its river edge, 0.95 and 1.5
 *  south of the crown, clear of the tea room's figures (one of whom steps out onto the street) and below every
 *  ray to the north-bank row, and stop half a unit short of the bridge's ramp walls. Nobody walks on
 *  Westminster Bridge: the walker who did was the movement audit's wall crossing at its parapets and ramp
 *  (walkthrough item 18). */
export const LD_LANES: Lane[] = [
  ...segments(road('LD-R1'), 3, 8, [1, 1, 2, 2, 2], [8, 5, 11, 1, 0], .009),
  ...segments(road('LD-R3b'), 0, 3, [2, 1, 1], [3, 6, 17], .007),
  ...segments(road('LD-R5'), 0, 2, [1, 1], [9, 20], .007),
  ...segments(road('LD-SB'), 8, 12, [1, 1, 1, 1], [4, 7, 14, 21], .007),
  ...segments(road('LD-CL'), 2, 3, [1], [26], .007),
  // The pony's handler: one walker, led round the dale yard's ring by `london-town.ts` rather than up and down.
  { id: 'LD-YD-0', from: [-47.3, -10.05], to: [-42.6, -10.05], range: [0, 1], walkers: 1, seed: 23, pace: .007 },
];
/** The lane the pit pony is led along, and the two lanes whose walkers carry cockle baskets. */
export const PONY_LANE = 'LD-YD-0', COCKLE_LANES = ['LD-CL-2', 'LD-SB-11'];
for (const lane of LD_LANES) {
  if (lane.id.startsWith('LD-R1-')) lane.strips = [.95, 1.5];
  if (lane.id === 'LD-R1-7') lane.range = [.12, .55];            // x -46.1 at most: the bridge's ramp and its walls begin at -45.65
  if (lane.id.startsWith('LD-R3b-')) lane.strips = [.2, .7];     // the dock side, below the omnibus stand's rays
  if (lane.id === 'LD-R5-0') lane.range = [.2, .88];              // clear of the Whitehall junction
  if (lane.id === 'LD-SB-8') lane.range = [.22, .88];             // clear of the bakehouse's crates at its door
}

// ---------------------------------------------------------------------------------------------------------
// Placement rules: what the Builder may put down, and where.
// ---------------------------------------------------------------------------------------------------------

/** Distance from a point to the nearest British clickable object. Positions are the Researcher's, in
 *  `london-objects.ts`. */
export function objectDistance(x: number, z: number): number {
  let best = 1e9;
  for (const o of LONDON_OBJECTS) best = Math.min(best, Math.hypot(x - o.pos[0], z - o.pos[1]));
  return best;
}
/** Distance from a point to the nearest road centreline. */
export function distToRoads(x: number, z: number): number {
  let best = 1e9;
  for (const r of LD_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
    best = Math.min(best, Math.hypot(x - ax - ex * t, z - az - ez * t));
  }
  return best;
}
/** True when a road centreline passes through the box, so nothing solid is left standing on a lane. */
export function onRoad(box: THREE.Box3): boolean {
  for (const r of LD_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
    const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) * 4)), half = r.width / 2;
    for (let k = 0; k <= n; k++) {
      const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
      if (x > box.min.x - half && x < box.max.x + half && z > box.min.z - half && z < box.max.z + half) return true;
    }
  }
  return false;
}
/** The two rules a piece of Builder's scenery has to satisfy against every British clickable, measured on the
 *  box it occupies rather than on its anchor: it must not reach into the 6 x 5 pad round an object, and it
 *  must leave the 2.5 of clear ground the approach needs in front of one. */
export function clearOfObjects(box: THREE.Box3): boolean {
  for (const o of LONDON_OBJECTS) {
    const [x, z] = o.pos;
    if (box.min.x < x + 3 && box.max.x > x - 3 && box.min.z < z + 2.5 && box.max.z > z - 2.5) return false;
    const gx = Math.max(box.min.x - x, 0, x - box.max.x), gz = Math.max(box.min.z - z, 0, z - box.max.z);
    if (Math.hypot(gx, gz) < 2.5) return false;
  }
  return true;
}
/** `main.ts` drops the visitor into a world at the target plus (2, 48, 60) and every later move keeps that
 *  offset direction, so the camera always looks at this table from the south. Anything solid inside a
 *  hundred-degree wedge on a clickable object's camera side, out to nine units, is between the visitor and
 *  that object. This is the cheap version of the ten-ray check in `london-world.mjs`: it is stricter, so
 *  whatever survives it passes there. */
const TO_CAMERA: Pt = [Math.sin(Math.atan2(2, 60)), Math.cos(Math.atan2(2, 60))];
const WEDGE_COS = Math.cos(Math.PI * 100 / 360);
export function inCameraWedge(box: THREE.Box3): boolean {
  // A lamp-post-thin thing hides nothing at this camera pitch, and a waist-high thing hides nothing past five.
  if (box.max.x - box.min.x < .6 && box.max.z - box.min.z < .6) return false;
  const reach = box.max.y > 2.6 ? 9 : 5;
  const xs = [box.min.x, (box.min.x + box.max.x) / 2, box.max.x], zs = [box.min.z, (box.min.z + box.max.z) / 2, box.max.z];
  for (const o of LONDON_OBJECTS) for (const x of xs) for (const z of zs) {
    const vx = x - o.pos[0], vz = z - o.pos[1], l = Math.hypot(vx, vz);
    if (l > reach) continue;
    if (l < 1e-6) return true;
    if ((vx * TO_CAMERA[0] + vz * TO_CAMERA[1]) / l >= WEDGE_COS) return true;
  }
  return false;
}
/** Place a piece of scenery and take it away again if it stands in water, on a road, inside a stand's pad or
 *  between a stand and the camera. Everything the Builder plants goes through this. */
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
  const wet = isWet(x, z) || isWet(x + .6, z) || isWet(x - .6, z) || isWet(x, z + .6) || isWet(x, z - .6) || burnDistance(x, z) < BURN_WIDTH / 2 + .45;
  // Visibility is tested with the owner's own rule, the ten arrival rays per stand, not with the hundred-degree
  // wedge: the stands in `props-london.ts` are four to ten units across, and against them the wedge left the
  // Weald without a tree and the fell without a wall. `inCameraWedge` stays exported for comparison.
  const b = box as THREE.Box3 | null;
  if (wet || (b && (!clearOfObjects(b) || onRoad(b) || onHouse(ctx, b, !!o.userData.keepOffDoors) || inRoomApproach(b) || !raysClear(o)))) { ctx.group.remove(o); return null; }
  return o;
}
/** True when the box stands inside a decorative house already built, so the country is never planted through
 *  a wall. The houses are built first (`london-town.ts`), then the countryside round them. */
function onHouse(ctx: LayoutCtx, box: THREE.Box3, door = false): boolean {
  for (const h of ctx.group.children) {
    if (h.name !== 'britain-house') continue;
    const hb = new THREE.Box3().setFromObject(h);
    // A tall screen (a hop row) keeps 1.8 of clear ground in front of the door, since every house faces +z: the
    // row that stood 0.2 off the Kentish cottage's front read as a trellis across its door (walkthrough item 11).
    if (box.min.x < hb.max.x + .2 && box.max.x > hb.min.x - .2 && box.min.z < hb.max.z + (door ? 1.8 : .2) && box.max.z > hb.min.z - .2) return true;
  }
  return false;
}
/** The room approach: when a room is clicked, `main.ts` flies the camera down to the stand along the visitor's
 *  compass direction (the arrival direction, (2, 48, 60)) to 10 units from a point 1.2 over its anchor, with
 *  its eye 1.57 above that point, then opens the room. The ground between that camera and the stand's counter
 *  is the approach. Anything of the Builder's taller than 1.2 standing in it, or taller than 0.3 within 6 in
 *  front of the camera and 1.5 either side of it, is in front of the counter at the moment the reaction plays: the hop poles and the bush
 *  in front of the pub, the tree in front of the cockle stall, the gas lamp across the fried fish shop
 *  (walkthrough items 23 to 30, 2026-09-23). Each approach is a trapezoid on the ground, 2 wide at the camera
 *  and the stand's width plus 0.8 a side at its counter, as `italy-landscape.ts` did for the Italian rooms. */
type Corridor = { id: string; cam: Pt; front: number; x0: number; x1: number };
let corridors: Corridor[] | null = null;
export function roomCorridors(): Corridor[] {
  if (corridors) return corridors;
  corridors = [];
  for (const s of britishStands()) {
    const o = LONDON_OBJECTS.find(x => x.id === s.id)!;
    if (!o.scene) continue;
    const b = new THREE.Box3(); for (const m of s.meshes) b.expandByObject(m);
    const size = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
    // The counter is the stand's solid front, not the front of its box: figures and low crates stand out in
    // front of it, and a lamp between them and the counter is still across the counter from the camera.
    let door = -1e9;
    for (const m of s.meshes) {
      let figure = false; for (let q: THREE.Object3D | null = m; q; q = q.parent) if (q.userData?.legs) { figure = true; break; }
      if (figure) continue;
      const mb = new THREE.Box3().setFromObject(m); if (mb.max.y < .35) continue; door = Math.max(door, mb.max.z);
    }
    const dist = Math.max(8.8, Math.min(18, Math.max(Math.max(2.2, size.x + .4), Math.max(2.2, size.z + .4)) * 1.05));
    const off = new THREE.Vector3(2, 0, 60).setLength(dist).add(new THREE.Vector3(0, 1.4, 0)); if (off.length() < 10) off.setLength(10);
    corridors.push({ id: s.id, cam: [c.x + off.x, c.z + off.z], front: Math.min(b.max.z, door > -1e8 ? door : b.max.z), x0: b.min.x - .8, x1: b.max.x + .8 });
  }
  return corridors;
}
export function inRoomApproach(box: THREE.Box3): boolean {
  if (box.max.y <= .3) return false;
  for (const k of roomCorridors()) {
    if (box.max.z < k.front - .3 || box.min.z > k.cam[1] + .6) continue;
    // Tall things anywhere in the approach; low things (a hedgebank, a wall) only in the 3.5 nearest the camera,
    // where even a knee-high wall fills the bottom of the frame.
    const low = box.max.y <= 1.2;
    if (low && box.max.z < k.cam[1] - 6) continue;
    const zLo = Math.max(box.min.z, low ? k.cam[1] - 6 : k.front), zHi = Math.min(box.max.z, k.cam[1] + .6);
    // the corridor's half-width at each end of the box's z span, interpolated from the front to the camera
    for (const z of [zLo, zHi, (zLo + zHi) / 2]) {
      const t = Math.min(1, Math.max(0, (z - k.front) / ((k.cam[1] - k.front) || 1)));
      const lo = low ? k.cam[0] - 1.5 : k.x0 + (k.cam[0] - 1 - k.x0) * t, hi = low ? k.cam[0] + 1.5 : k.x1 + (k.cam[0] + 1 - k.x1) * t;
      if (box.max.x > lo && box.min.x < hi) return true;
    }
  }
  return false;
}
/** The exact form of the owner's rule, for buildings. The hundred-degree wedge is right for a tree or a wall,
 *  but for a house it is so much stricter than the rule it stands in for that not one of the blueprint's five
 *  coordinates survives it, and the dale farmhouse finds no ground anywhere in its cluster. So a house is
 *  tested the way `london-world.mjs` tests it: each British stand is built once from `props-london.ts` at its
 *  own position, ten rays are cast at it along the arrival direction — nine at its camera-facing front face at
 *  three heights, one at the diamond cue over its anchor — and the house fails if it is the first thing any
 *  ray meets. */
type StandRays = { id: string; meshes: THREE.Object3D[]; aims: THREE.Vector3[]; x: number; z: number };
let standRays: StandRays[] | null = null;
const CAM = new THREE.Vector3(2, 48, 60).normalize();
function britishStands(): StandRays[] {
  if (standRays) return standRays;
  standRays = [];
  for (const o of LONDON_OBJECTS) {
    const make = LONDON_PROPS[o.prop]; if (!make) continue;
    const g = make(); g.position.set(o.pos[0], o.elevation ?? 0, o.pos[1]); g.rotation.y = o.rot ?? 0; g.updateMatrixWorld(true);
    const meshes: THREE.Object3D[] = [];
    g.traverse(m => { const mesh = m as THREE.Mesh; if (mesh.isMesh && mesh.geometry && !(mesh as unknown as THREE.Sprite).isSprite) meshes.push(mesh); });
    const b = new THREE.Box3().setFromObject(g); if (!Number.isFinite(b.min.y)) continue;
    const floor = Math.max(b.min.y, 0), aims: THREE.Vector3[] = [];
    for (const fx of [.2, .5, .8]) for (const dy of [.8, 1.5, 2.2]) aims.push(new THREE.Vector3(b.min.x + (b.max.x - b.min.x) * fx, floor + dy, b.max.z - .2));
    aims.push(new THREE.Vector3(o.pos[0], b.max.y + .7, o.pos[1]));
    standRays.push({ id: o.id, meshes, aims, x: o.pos[0], z: o.pos[1] });
  }
  return standRays;
}
export function raysClear(o: THREE.Object3D): boolean {
  o.updateMatrixWorld(true);
  const mine: THREE.Object3D[] = []; o.traverse(m => { if ((m as THREE.Mesh).isMesh) mine.push(m); });
  const own = new Set(mine), box = new THREE.Box3().setFromObject(o), c = box.getCenter(new THREE.Vector3());
  const ray = new THREE.Raycaster(), back = CAM.clone().multiplyScalar(70), into = CAM.clone().negate();
  for (const s of britishStands()) {
    if (Math.hypot(s.x - c.x, s.z - c.z) > 18) continue;
    for (const t of s.aims) {
      ray.set(t.clone().add(back), into);
      const hit = ray.intersectObjects([...s.meshes, ...mine], false).find(h => h.distance < 69.8);
      if (hit && own.has(hit.object)) return false;
    }
  }
  return true;
}
/** A building: dry, off every road, clear of every stand's pad and approach, and hiding no stand from the
 *  arrival camera by the ray test above. The first candidate that passes is the one that stands. */
export function placeBuilding<T extends THREE.Object3D>(ctx: LayoutCtx, build: () => T, spots: [number, number, number][]): T | null {
  for (const [x, z, rot] of spots) {
    const o = build(); ctx.place(o, x, z, rot); o.updateMatrixWorld(true);
    let box: THREE.Box3 | null = null;
    o.traverse(m => { const mesh = m as THREE.Mesh; if (!mesh.isMesh) return; mesh.geometry.computeBoundingBox(); const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld); if (b.max.y < .35) return; box = box ? (box as THREE.Box3).union(b) : b; });
    const b = box as THREE.Box3 | null;
    const wet = !b || [[b.min.x, b.min.z], [b.min.x, b.max.z], [b.max.x, b.min.z], [b.max.x, b.max.z], [x, z]].some(([px, pz]) => isWet(px, pz));
    if (!wet && b && clearOfObjects(b) && !onRoad(b) && !inRoomApproach(b) && raysClear(o)) return o;
    ctx.group.remove(o);
  }
  return null;
}
/** Place a piece of scenery at the first of several candidate spots that leaves every clickable object and
 *  every road clear. Used for the buildings that must exist somewhere rather than for dressing that may
 *  simply be dropped. */
export function tryPlaceAny<T extends THREE.Object3D>(ctx: LayoutCtx, build: () => T, spots: [number, number, number][], y = 0): T | null {
  for (const [x, z, rot] of spots) { const o = tryPlace(ctx, build(), x, z, rot, y); if (o) return o; }
  return null;
}

// ---------------------------------------------------------------------------------------------------------
// The build.
// ---------------------------------------------------------------------------------------------------------

function shapeOf(points: Pt[]): THREE.Shape {
  const sh = new THREE.Shape(); points.forEach(([x, z], i) => i ? sh.lineTo(x, z) : sh.moveTo(x, z)); sh.closePath(); return sh;
}
function pathOf(points: Pt[]): THREE.Path {
  const p = new THREE.Path(); points.forEach(([x, z], i) => i ? p.lineTo(x, z) : p.moveTo(x, z)); p.closePath(); return p;
}
/** A water ribbon whose width changes along its length: the river is 2.6 in the hills and 5.2 at the mouth. */
function riverGeo(curve: THREE.CatmullRomCurve3, widthAt: (x: number) => number, segments = 240): THREE.BufferGeometry {
  const pts = curve.getSpacedPoints(segments), position: number[] = [], uv: number[] = [], index: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, p = pts[i], t = curve.getTangentAt(u);
    const half = widthAt(p.x) / 2 * (.96 + Math.sin(u * 26) * .04);   // a gentle, smooth swell in the banks
    const s = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(half);
    position.push(p.x - s.x, 0, p.z - s.z, p.x + s.x, 0, p.z + s.z);
    uv.push(0, u, 1, u);
    if (i < segments) { const k = i * 2; index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index); geo.computeVertexNormals();
  return geo;
}

/** The wet sand at the Bristol Channel's head: a sand flat laid between the channel's two shores from a defined,
 *  gently wavy waterline at x -74.9 to the head. The owner read the old version, whose alpha faded to nothing
 *  over three units, as a pale fog smear lying on the sea (walkthrough item 10, 2026-09-23). It is opaque now:
 *  a narrow pale lip at the waterline where the ebb has just left it, the darkest wet band behind the lip, and
 *  the sand drying toward the head, with ripple marks worked into the vertex colour as faint alternating bands
 *  across the flow and two darker runnels draining back to the water. All colour, no geometry standing up: a
 *  row of thin ridges on the sand read as boards, and the owner's rule is no sticks. */
const SAND_EDGE = (z: number) => -74.9 + Math.sin(z * 2.3 + .6) * .22 + Math.sin(z * 5.1) * .06;
function wetSand(): THREE.Mesh {
  const lerpAlong = (pts: Pt[], x: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
      if ((x - ax) * (x - bx) <= 0) return az + (bz - az) * ((x - ax) / ((bx - ax) || 1));
    }
    return pts[x < pts[0][0] ? 0 : pts.length - 1][1];
  };
  // The two shores, pulled 0.1 inside the drawn coast so the sand's sides sit under the rim, not over the grass.
  const south: Pt[] = [[-75.6, 13.43], [-73.5, 13.62], [-71.4, 14.12], [-70.6, 14.4]];
  const north: Pt[] = [[-75.6, 17.6], [-71.8, 16.5], [-70.6, 16.4]];
  const cols = 64, rows = 10, position: number[] = [], color: number[] = [], index: number[] = [];
  const lip = new THREE.Color('#d8ccaa'), wettest = new THREE.Color('#978a6b'), damp = new THREE.Color('#b7a882'), dry = new THREE.Color('#d3c7a0');
  const runnels = [15.1, 16.0];
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
    const v = r / rows, zGuess = 14 + v * 2.8;
    const x0 = SAND_EDGE(zGuess), u = c / cols, x = x0 + (-70.6 - x0) * u;
    const zs = lerpAlong(south, x), zn = lerpAlong(north, x), z = zs + (zn - zs) * v;
    const from = x - SAND_EDGE(z);                                                     // distance from the waterline
    const col = from < .14 ? lip.clone() : from < 1.4 ? wettest.clone().lerp(damp, (from - .14) / 1.26) : damp.clone().lerp(dry, Math.min(1, (from - 1.4) / 2.4));
    const ripple = Math.sin(x * 11 + Math.sin(z * 3.1) * 1.4) * .5 + .5;                // ripple marks across the ebb
    col.offsetHSL(0, 0, (ripple - .5) * .045 * (from < 3 ? 1 : .5));
    for (const rz of runnels) { const d = Math.abs(z - rz - Math.sin(x * 1.7) * .12); if (d < .09 && from > .2) col.lerp(wettest, .55 * (1 - d / .09)); }
    position.push(x, 0, z); color.push(col.r, col.g, col.b);
    if (r < rows && c < cols) { const k = r * (cols + 1) + c; index.push(k, k + cols + 1, k + 1, k + 1, k + cols + 1, k + cols + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  geo.setIndex(index); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .8, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  m.position.y = SAND_WET_Y; m.renderOrder = 3; m.receiveShadow = true; m.name = 'cockle-sand-wet';
  return m;
}

/** A small burn: one bank of stones and one ribbon of water, fresh upstream and the sea's colour at its mouth. */
function burnGeo(curve: THREE.CatmullRomCurve3, width: number, segments = 120): THREE.BufferGeometry {
  const pts = curve.getSpacedPoints(segments), position: number[] = [], uv: number[] = [], index: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, p = pts[i], t = curve.getTangentAt(u);
    const half = width / 2 * (.92 + Math.sin(u * 31) * .08);
    const s = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(half);
    position.push(p.x - s.x, 0, p.z - s.z, p.x + s.x, 0, p.z + s.z); uv.push(0, u, 1, u);
    if (i < segments) { const k = i * 2; index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index); geo.computeVertexNormals();
  return geo;
}

export function londonLandscape(ctx: LayoutCtx) {
  const { group, tickers, tint, TOP } = ctx;

  // ---------- the ground tints, one per cluster, laid before anything solid ----------
  tint(-55, -5.5, 11, 3.2, '#b8b4ad');         // Westminster: wet paving along Whitehall and the Embankment
  tint(-56, 6, 6, 2.6, '#b8b4ad');             // and Southwark across the bridge
  tint(-42, 13, 6.5, 4, '#a89c86');            // the Docks: brown dock mud and stone, no paving
  tint(-56, 16, 7, 5, '#7fae5a');              // the Weald: hop green in strings
  tint(-62, 22.5, 4.5, 2.6, '#5f7a46', .1);    // and the darker green under the wood on the south coast
  tint(-50, -16, 9, 6, '#9fb08a');             // the Dales: wet green
  tint(-48, -15, 4, 3, '#8a8a80', -.2);        // cut by drystone walls
  tint(-71, 9, 8, 8, '#8fa06a');               // the West Country: moor green
  tint(-73.3, 0, 4, 3, '#9a8f80', .1);         // over granite
  tint(-70.5, 15.2, 3.4, 2.0, '#d9cfae');      // and the wet sand at the channel head
  tint(-68, -19, 10, 5, '#93a884');            // the Firths: cold green
  tint(-73, -22, 4, 2.5, '#8a8a80', .15);      // with rock

  // ---------- the one sea: the ring, the island as its hole, one rim, one shader ----------
  const sea = seaWater(), tarnW = freshWater();
  const river = estuaryWater(ESTUARY_SEA_X, RIVER_MOUTH[1], ESTUARY_BLEND, 'x');
  const waters = [sea, tarnW, river];
  tickers.push(t => { for (const w of waters) w.uniforms.uTime.value = t; });

  const outer = seaOutline(), island = islandOutline();
  const rimShape = shapeOf(offsetOutline(outer, 1.2));
  rimShape.holes.push(pathOf(insetOutline(island, 1.2)));
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(rimShape), mat('#e6dfc4'));
  rim.rotation.x = -Math.PI / 2; rim.scale.y = -1; rim.position.y = TOP + RIM_Y; rim.receiveShadow = true; rim.name = 'britain-sea-rim'; group.add(rim);

  const seaShape = shapeOf(outer);
  seaShape.holes.push(pathOf(island));
  const water = new THREE.Mesh(new THREE.ShapeGeometry(seaShape), sea);
  water.rotation.x = -Math.PI / 2; water.scale.y = -1; water.position.y = TOP + SEA_Y; water.receiveShadow = true; water.name = 'britain-sea'; group.add(water);

  // ---------- the island river: one bank, one ribbon, fresh in the hills and the sea's own blue at the mouth ----------
  const bank = new THREE.Mesh(riverGeo(RIVER_CURVE, riverBank), mat('#e6dfc4'));
  bank.position.y = TOP + BANK_Y; bank.receiveShadow = true; bank.name = 'island-river-bank'; group.add(bank);
  const stream = new THREE.Mesh(riverGeo(RIVER_CURVE, riverWidth), river);
  stream.position.y = TOP + RIVER_Y; stream.renderOrder = 2; stream.receiveShadow = true; stream.name = 'island-river'; group.add(stream);
  addFish(ctx, RIVER_CURVE, [['#8fa3b5', '#d9dee3'], ['#6f8f6f', '#c9d6b0'], ['#9a8f6a', '#ded6b8']], 1.0, .26);

  // ---------- the tarn the river rises in, so the source is water and not a point in the grass ----------
  for (const pool of LD_POOLS) {
    add(group, new THREE.Mesh(new THREE.CircleGeometry(pool.rx + .8, 28), mat('#e6dfc4')), pool.x, TOP + BANK_Y, pool.z).rotation.x = -Math.PI / 2;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(pool.rx, 28), tarnW);
    disc.rotation.x = -Math.PI / 2; disc.position.set(pool.x, TOP + TARN_Y, pool.z); disc.renderOrder = 2; disc.name = pool.id; group.add(disc);
    if (pool.id !== 'west-tarn') continue;                                          // the mill pond has a stone lip, not boulders
    for (let i = 0; i < 7; i++) {
      const a = i * 1.1, r = pool.rx + .5 + (i % 3) * .22;
      add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(.16 + (i % 3) * .05, 0), mat('#8B8781')), pool.x + Math.cos(a) * r, .06, pool.z + Math.sin(a) * r).name = 'tarn-boulder';
    }
  }

  // ---------- the mill burn: out of the mill pond, under the oat mill's lade and wheel, north to the sea ----------
  const burnW = estuaryWater(BURN_POINTS[BURN_POINTS.length - 1][0], -25.7, 1.1);
  waters.push(burnW);
  const burnBank = new THREE.Mesh(burnGeo(BURN_CURVE, BURN_WIDTH + .34), mat('#9a9280'));
  burnBank.position.y = TOP + BANK_Y; burnBank.receiveShadow = true; burnBank.name = 'mill-burn-bank'; group.add(burnBank);
  const burn = new THREE.Mesh(burnGeo(BURN_CURVE, BURN_WIDTH), burnW);
  burn.position.y = TOP + RIVER_Y; burn.renderOrder = 2; burn.receiveShadow = true; burn.name = 'mill-burn'; group.add(burn);

  // ---------- the Bristol Channel's head: wet sand, ribbed and draining, not open water ----------
  group.add(wetSand());
  // The dry flat east of the head is the soft sand tint laid with the ground above, not a second hard-edged
  // polygon: drawn as one, it read from above as a slab set on the grass. No ribs are drawn either — a row of
  // thin bands on the sand read as boards lying on the beach, and the owner's rule is no sticks.

  // ---------- the air: gulls over the strait, the moor and the south coast ----------
  // Second walkthrough 54 (2026-09-23): at the shared size and the shared dark tone the gulls drew as black bent
  // planks in the sky and as black arcs over the paper past the table edge. They are drawn at Italy's 0.45 with a
  // body, pale grey-white, and low: a gull at height h over (x, z) draws, from the arrival camera (2, 48, 60), in
  // front of the ground at (x - h / 24, z - 1.25 h), so a high flock anywhere in the north half draws over the
  // paper, and one over the south half draws over the stands north of it. Each flock circles where that ground is
  // the table and where no stand's ten rays or card line pass: over the strait north of the herring quay, over the
  // moor west of the curing yard, and low along the south coast between the leek bed and the wood. The estuary
  // flock, which crossed the pie shop's rays, and the inland rooks are gone; `london-world.mjs` checks every bird's
  // ground point against the table and every stand's rays over 240 seconds.
  const gull = { size: .45, tone: '#DCDAD4' };
  const flock = (n: number, r: number, h: number, x: number, z: number) => {
    const b = birds(n, r, h, gull); b.position.set(x, TOP, z); b.name = 'britain-birds'; group.add(b); tickers.push(b.userData.tick!);
  };
  flock(5, 1.5, 5, -32.5, -17.0);   // the strait, off the herring coast
  flock(5, 1.5, 5, -77.5, -6.0);    // the moor above the west coast
  flock(4, .8, 3, -69.0, 25.6);     // the south coast, between the leek bed and the wood
}
