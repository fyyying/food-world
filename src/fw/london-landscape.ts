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
 *  the tarn the river rises in, and `estuaryWater(mouth, 'z')` for the river, which is fresh upstream and the
 *  sea's own colour at and past the mouth. The rim is `#e6dfc4`, the colour the Channel and the Black Sea
 *  already used, inset 1.2 computed per vertex rather than from one centre, so the caps at the table edge stay
 *  square.
 */
import * as THREE from 'three';
import { add, mat, birds } from './props';
import { seaWater, freshWater, estuaryWater, addFish, type LayoutCtx } from './worldkit';
import { LONDON_OBJECTS, LONDON_CLUSTERS } from './london-objects';
import { LONDON_PROPS } from './props-london';
import { W, WPS, ukOffset } from './london-warp';

export type Pt = [number, number];
/** Table edges after the UK re-lay (2026-09-24): Britain has the whole table, W 106, D 110, cx -49, cz 10. The old
 *  frame's coordinates below go through `W` (london-warp.ts), which pulls the six clusters apart. */
export const TABLE = { minX: -102, maxX: 4, minZ: -45, maxZ: 65 };
export const atEdgeX = (x: number) => x <= TABLE.minX || x >= TABLE.maxX;
export const atEdgeZ = (z: number) => z <= TABLE.minZ || z >= TABLE.maxZ;
/** The band rule: Britain owns the whole table now; there is no continent and no strait. */
export const LD_BAND: Pt = [TABLE.minX, TABLE.maxX];

/** The sea's outer ring: the table's west, north and south edges, and the continent's west coast at x -31.4.
 *  Four vertices, every one of them on a table edge or on that dead-straight coast, so this ring takes no
 *  jitter at all: a wobble here would tilt the strait's eastern shore. */
export const SEA_RING: Pt[] = [[TABLE.minX, TABLE.minZ], [TABLE.maxX, TABLE.minZ], [TABLE.maxX, TABLE.maxZ], [TABLE.minX, TABLE.maxZ]];

/** The Firth of Forth as drawn, west shore then east, cut to fit the Forth Bridge rather than the bridge to the
 *  firth (re-cluster pass, 2026-09-23): seven units of open water from the west bank at x -62.75 to the east bank
 *  at -55.75, under the bridge at [-59.6, -23.2], so its outer cantilevers and both end piers stand on the two
 *  shores and the middle cantilever in the water. The owner saw the old narrows, 1.2 wide under a 12-unit bridge,
 *  as a train bridge that "just stops in the middle". The head is just south of the bridge's front, with a small
 *  bay at its west corner where the oat mill's burn comes in, and the shore road runs along the head to the bridge.
 *  The shores take none of the coast's wobble. */
export const FIRTH: Pt[] = WPS([
  [-63.2, -27.6], [-62.8, -24.6], [-62.75, -22.2], [-62.7, -21.0], [-62.2, -20.7], [-61.6, -20.9], [-61.3, -21.35],
  [-58.5, -21.4], [-56.3, -21.5], [-55.75, -22.2], [-55.6, -24.6], [-55.1, -27.4],
]);
/** The river's mouth on the south coast, as drawn from the strait westward (re-cluster pass, 2026-09-23). The river
 *  comes south out of Westminster's reach, passes under Tower Bridge at [-45.5, 20] and opens into the sea between
 *  these two shores. The owner's rule: Tower Bridge crosses the river itself, an abutment on each bank and the
 *  bascules over the river's own water, with no dock basin cut beside it ("Tower Bridge is on the land now, doesn't
 *  make sense" of the first draft, which put it over a basin). Its east abutment stands on the four units of land
 *  between the river and the strait; the owner had seen the old one end over the strait. */
export const ESTUARY: Pt[] = WPS([
  [-35.4, 23.6], [-36.4, 24.4], [-39.4, 24.5], [-41.0, 24.0], [-41.9, 23.5], [-48.3, 23.5], [-49.0, 24.2], [-50.0, 26.4],
]);
/** The Bristol Channel, from the west coast to its head at x -72.9, where the cockle sand is. */
export const CHANNEL: Pt[] = WPS([[-80.5, 13.1], [-76.5, 13.2], [-73.8, 13.3], [-72.9, 12.9], [-73.3, 11.9], [-76.4, 11.4], [-80.3, 11.0]]);
/** The north coast behind the Firths' and the Dales' back rows, drawn a unit clear of their buildings (the owner's
 *  rule of 2026-09-23: no house and no stand building within a unit of the water) and taking none of the wobble. */
/** The west coast beside the Cornish bakehouse, a unit clear of it and taking no wobble. */
export const SOUTH_WEST: Pt[] = WPS([[-80.7, 23.5], [-80.7, 18.8], [-80.7, 14.2]]);
export const NORTH_WEST: Pt[] = WPS([[-80.4, -24.4], [-79.9, -26.6], [-79.0, -27.5], [-73, -27.75], [-69, -27.75], [-65.5, -27.75]]);
export const NORTH_EAST: Pt[] = WPS([[-52, -27.2], [-49, -27.75], [-37.6, -27.75], [-35.5, -26.8], [-35.4, -24]]);
/** The island's coast, traced so the land stays inside it: the north coast with the Firth of Forth cut into
 *  it, the strait's west shore, the river's mouth, the south coast, and the west coast with the Bristol Channel cut into
 *  it. This polygon is the **hole** in the shape above. The re-cluster pass pushed the north and south coasts out
 *  to z -27 and 27 (a unit from the table edge, as before on the north) to give the six clusters room. */
export const ISLAND: Pt[] = [
  ...NORTH_WEST,                                                                                      // Scotland's north coast
  ...FIRTH,                                                                                           // the Firth of Forth
  [-49.5, -36.0], [-45.2, -32.5], [-41.4, -28.3],                                                     // Scotland's east coast, down to England
  ...NORTH_EAST,                                                                                      // the Dales' coast and the north-east cape
  ...WPS([[-35.6, -20], [-35.4, -17]]), [-19.8, -12.2], [-14.0, -10.5], [-6.0, -7.8], [-2.4, -3.0], [-2.6, 3.5],   // the Pennine coast
  [-4.4, 8.0], [-4.4, 11.5], [-4.8, 16.1], [-4.9, 19.1], [-4.0, 23.0],                                // the Weald's shore, Kent
  [-3.0, 28.0], [-2.6, 36.0], [-5.0, 43.0], [-10.0, 46.5], [-16.0, 45.5], [-19.0, 40.0],             // Kent reaching south (table trim, 2026-09-24)
  [-20.5, 33.0], [-24.0, 29.0], [-31.0, 26.8], [-35.4, 26.4],                                         // the Thames estuary between Kent and the Docks
  ...WPS([[-35.4, 19.5]]),                                                                            // the Docks' east bank
  ...ESTUARY,                                                                                         // the Thames's mouth below Tower Bridge
  ...WPS([[-52, 27], [-56, 26.9]]), [-58.5, 45.5], [-62.5, 51.5], [-66.5, 56.5], [-70.5, 58.4],       // the south coast, round to Cornwall
  ...WPS([[-60, 27], [-64, 26.9], [-68, 27], [-72, 26.9], [-76, 27.2], [-79.4, 27.0]]),            // Cornwall's south coast
  ...SOUTH_WEST,                                                                                      // Land's End
  ...CHANNEL,                                                                                         // the Bristol Channel
  [-93.0, 37.5], [-89.0, 33.0], [-85.0, 28.5], [-81.8, 24.5],                                         // Wales and the Exmoor shore
  ...WPS([[-80.3, 6], [-80.1, 0], [-80.3, -6]]), [-81.2, 2.5], [-81.8, -2.5], [-81.0, -7], [-78.4, -10.5],
  ...WPS([[-80, -12], [-80.4, -18]]),                                                                 // Scotland's west coast, back to the start
];
/** How far the drawn coast wobbles off the traced line. The blueprint asks the strait to stay at least 4.0
 *  wide after the jitter and it is only 4.2 at its narrowest, so the strait's own shore — every island vertex
 *  at x -37 or east of it — takes no sideways wobble at all. */
export const COAST_JITTER = .18;
const STRAIT_SHORE = 1e9;   // no vertex is exempt by position; the designed shores are listed in DESIGNED   // the east coast, straight as it was cut, takes no wobble

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
/** The island's coast as drawn: a small index-driven wobble, none of it on the designed shores — the firth, the
 *  river mouth, the Bristol Channel and the strait's own shore keep exactly the line they were cut to. */
const DESIGNED = new Set<Pt>([...SOUTH_WEST, ...NORTH_WEST, ...FIRTH, ...NORTH_EAST, ...ESTUARY, ...CHANNEL]);
export function islandOutline(): Pt[] {
  return ISLAND.map((p, k) => {
    const [x, z] = p;
    if (DESIGNED.has(p) || x >= STRAIT_SHORE) return [x, z] as Pt;
    return [x + Math.sin(k * 2.7) * COAST_JITTER, z + Math.cos(k * 1.9) * COAST_JITTER] as Pt;
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
export function ribbonOutline(curve: THREE.CatmullRomCurve3, widthAt: (u: number) => number, steps = 200): Pt[] {
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps, p = curve.getPointAt(u), t = curve.getTangentAt(u);
    const half = widthAt(u) / 2;
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

/** The island river (re-laid in the re-cluster pass, 2026-09-23). It rises in the tarn on the west coast, runs east
 *  between Westminster and the West Country, under Westminster Bridge at x -55.6, narrows past the hop cookhouse and
 *  the seamen's kitchen, then turns south at the oyster quay, widens toward the estuary, passes under Tower Bridge at
 *  [-45.5, 20] and reaches the sea on the south coast. Its source is inside the tarn and its mouth inside the sea
 *  (docs/building-a-world.md, "Water rules"). */
export const RIVER_POINTS: Pt[] = WPS([
  // Owner round, 2026-09-24: Westminster and the Docks take the same move, so the Thames runs exactly as the
  // re-cluster pass laid it, from the tarn past Westminster, under Westminster Bridge, down to the Docks and Tower Bridge
  [-78, 8.2], [-74, 8.5], [-68, 8.7], [-62, 8.6], [-57, 7.7], [-53, 6.7], [-50, 6.9], [-47.3, 7.5], [-45.2, 8.3],
  [-44.3, 9.8], [-44.6, 12.0], [-44.7, 14.5], [-45.1, 17.0], [-45.2, 20.0], [-45.2, 25.0],
]);
export const RIVER_MOUTH: Pt = W(-45.2, 25.0);
/** The width at each point above, interpolated along the curve: 2.6 through Westminster, 1.6 to 2.2 where it
 *  runs as a narrow reach between the hop cookhouse and the seamen's kitchen, a unit clear of both buildings, 4.5 at the oyster quay, 5.5 under Tower Bridge, whose
 *  bascule piers stand at its edges, and 6.5 at the mouth. Each ribbon has a bank 1.6 wider. */
export const RIVER_WIDTHS = [2.6, 2.6, 2.6, 2.6, 2.6, 1.7, 1.6, 2.2, 3.2, 4.2, 4.5, 4.6, 5.2, 5.5, 6.5];
export function riverWidth(u: number): number {
  const t = RIVER_CURVE.getUtoTmapping(Math.max(0, Math.min(1, u)), 0);   // the curve's own parameter, so each width sits on its point
  const f = t * (RIVER_POINTS.length - 1), i = Math.min(RIVER_POINTS.length - 2, Math.floor(f));
  return RIVER_WIDTHS[i] + (RIVER_WIDTHS[i + 1] - RIVER_WIDTHS[i]) * (f - i);
}
export const riverBank = (u: number) => riverWidth(u) + 1.6;
export const RIVER_CURVE = new THREE.CatmullRomCurve3(RIVER_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** The river is fresh upstream and the sea's own colour from z 21 south, blending over four units above Tower
 *  Bridge, so the estuary under the bridge and the sea past the mouth are one water. */
export const ESTUARY_SEA_Z = W(-45.2, 21)[1], ESTUARY_BLEND = 4;

/** Every still body of British water: a valid source and a valid mouth for a waterway. */
export const LD_POOLS: { id: string; x: number; z: number; rx: number; rz: number }[] = [
  { id: 'west-tarn', x: W(-78.3, 8.2)[0], z: W(-78.3, 8.2)[1], rx: 1.3, rz: 1.3 },
  // The oat mill's pond, north-east of the mill, which the burn leaves by the lade and the wheel.
  { id: 'mill-pond', x: W(-59.9, -19.25)[0], z: W(-59.9, -19.25)[1], rx: .45, rz: .45 },
];
/** The mill burn: out of the mill pond, south-west under the lade and the wheel on the oat mill's east gable (the
 *  axle is at [-61.6, -17.42]), then north past the gable into the little bay at the Firth of Forth's west corner.
 *  Its source is inside the pond and its mouth inside the firth, by the water rule. */
export const BURN_POINTS: Pt[] = WPS([
  [-59.95, -19.15], [-60.55, -18.45], [-61.15, -17.8], [-61.6, -17.48], [-61.95, -18.4], [-62.1, -19.6], [-62.2, -21.25],
]);
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

/** The head of the Bristol Channel is wet sand, not open water: the sand tint under a low-alpha sheet, ribbed and
 *  draining, with the cockle stall on the dry flat at its head. Two polygons, because the western half lies over the
 *  sea and the eastern half is the dry flat the stall stands on. */
export const CHANNEL_SAND_WET: Pt[] = WPS([[-75.9, 11.3], [-73.3, 11.95], [-72.9, 12.9], [-73.8, 13.3], [-75.9, 13.4]]);
export const CHANNEL_SAND_DRY: Pt[] = WPS([[-72.8, 11.95], [-71.0, 11.95], [-71.0, 13.5], [-72.8, 13.3]]);

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
 *  Re-laid in the re-cluster pass (2026-09-23, docs/london-world.md). Each cluster has its own street along the
 *  fronts of its rows, and the roads between clusters run through the open country that separates them. Every
 *  stand's front faces the camera (+z), so a road runs across the front of every door, within 2.0 of it; a short
 *  spur (`LD-S-*`) comes to the doorstep of a stand whose front stands deep in front of its anchor, so the anchor
 *  rule (2.6) holds as well. The network is one piece: Whitehall (LD-R1) with the east lane (LD-EL) and the bridge
 *  road (LD-R2) over Westminster Bridge; the Embankment (LD-EM); the moor road (LD-R5) from the west coast past the
 *  Firths, the omnibus terminus (LD-TS) and the Dales to the strait; the Dales back street (LD-DB) and lane (LD-DL);
 *  the Firths street (LD-FS) and lane (LD-FL) and the shore road to the Forth Bridge (LD-FB); the Weald's roads
 *  (LD-WR, LD-MR, LD-HL, LD-HR); the east lane down the strait shore to the pie shop (LD-EE, LD-PQ); the
 *  seamen's kitchen road and the oyster quay (LD-LQ, LD-OQ); and the West Country street, lane and south road
 *  (LD-WS, LD-WL, LD-SC). No road but LD-R2 crosses water, and it crosses on the bridge.
 */
const RAW_ROADS: Road[] = [
  // Westminster
  { id: 'LD-R1', width: 1.8, points: [[-79.0, -1.6], [-69.34, -1.6], [-55.6, -1.6], [-53.4, -1.6]] },
  // UK re-lay: the east lane is the pass road north from Whitehall's east end, between the Highlands and the Pennines,
  // to the moor road; written in the new frame
  { id: 'LD-EL', width: 1.2, points: [[-53.4, -11.4], W(-53.4, -1.6)] },
  { id: 'LD-EM', width: 1.4, points: [[-79.0, 5.75], [-69.34, 5.75], [-58.3, 5.75]] },
  { id: 'LD-ML', width: 0.8, points: [[-69.34, -1.6], [-69.34, 5.75]] },   // the lane between the omnibus stand and the market
  // UK re-lay: the bridge road runs straight south from Westminster Bridge over the moor to the West Country street;
  // written in the new frame
  { id: 'LD-R2', width: 1.2, points: [[-55.6, -1.6], [-55.6, 2.4], [-55.6, 7.9], [-55.6, 13.4], [-55.6, 17.8]] },
  // the moor road, the Firths and the Dales
  { id: 'LD-R5', width: 1.4, points: [[-78.4, -10.5], [-60.2, -10.5], [-56.5, -11.4], [-36.3, -11.4]] },
  { id: 'LD-TS', width: 2.6, points: [[-53.9, -10.4], [-57.1, -10.4]] },
  // UK re-lay: the back lane behind Westminster's north row, from the terminus to the west coast, where the moor road
  // ran before the clusters were pulled apart; written in the new frame
  { id: 'LD-TW', width: 1.4, points: [[-57.1, 3.1], [-79.6, 3.1]] },
  { id: 'LD-FS', width: 1.2, points: [[-78.8, -19.6], [-68.5, -19.6]] },
  { id: 'LD-FL', width: 1.0, points: [[-78.8, -19.6], [-78.8, -10.5]] },
  { id: 'LD-FB', width: 1.2, points: [[-60.8, -20.5], [-54.8, -20.5], [-52.4, -19.9]] },
  { id: 'LD-DB', width: 1.2, points: [[-52.4, -19.9], [-36.6, -19.9]] },
  { id: 'LD-DL', width: 1.2, points: [[-52.4, -19.9], [-52.4, -11.4]] },
  // the Weald
  { id: 'LD-WR', width: 1.2, points: [[-55.6, 1.6], [-53.4, 3.4], [-51.8, 4.9], [-37.0, 4.9]] },
  { id: 'LD-MR', width: 1.0, points: [[-53.4, -2.45], [-44.4, -2.45]] },
  { id: 'LD-HL', width: 1.0, points: [[-44.4, -2.45], [-44.4, 4.9]] },
  { id: 'LD-HR', width: 1.0, points: [[-44.4, 0.8], [-36.4, 0.8]] },
  // the Docks
  // the east lane, rerouted in the new frame between the river and the North Sea bay (lead QC, 2026-09-24)
  { id: 'LD-EE', width: 0.7, points: [[-37.0, 4.9], [-36.9, 8.0], [-36.3, 9.2], [-35.95, 10.4], [-35.95, 17.7]] },
  { id: 'LD-PQ', width: 0.9, points: [[-35.95, 17.7], [-38.9, 17.7]] },
  { id: 'LD-LQ', width: 0.9, points: [[-55.6, 17.6], [-49.5, 17.6]] },
  { id: 'LD-OQ', width: 1.0, points: [[-49.5, 17.6], [-49.3, 15.0], [-47.4, 13.5]] },
  // the West Country
  { id: 'LD-WS', width: 1.2, points: [[-55.6, 17.8], [-57.95, 18.0], [-69.6, 18.1]] },
  { id: 'LD-WL', width: 1.0, points: [[-57.95, 18.0], [-57.95, 25.7]] },
  { id: 'LD-SC', width: 1.2, points: [[-77.6, 25.7], [-57.95, 25.7], [-56.8, 24.6], [-51.9, 24.6]] },
  // doorsteps
  { id: 'LD-S-herring', width: 1.0, points: [[-72.92, -10.5], [-72.92, -11.5]] },
  { id: 'LD-S-oats', width: 1.0, points: [[-62.05, -10.5], [-62.05, -13.1]] },
  { id: 'LD-S-sheep', width: 1.0, points: [[-47.77, -11.4], [-47.77, -12.9]] },
  { id: 'LD-S-rhubarb', width: 1.0, points: [[-38.92, -11.4], [-38.92, -12.6]] },
  { id: 'LD-S-mushrooms', width: 1.0, points: [[-48.38, -2.45], [-48.38, -4.1]] },
  { id: 'LD-S-hops', width: 1.0, points: [[-40.46, 0.8], [-40.46, -0.9]] },
  { id: 'LD-S-pie', width: 0.9, points: [[-38.6, 17.7], [-38.6, 15.2]] },
  { id: 'LD-S-lascar', width: 0.9, points: [[-52.05, 17.6], [-52.05, 15.2]] },
  { id: 'LD-S-forth', width: 1.0, points: [[-54.2, -20.35], [-53.4, -21.6]] },   // to the Forth Bridge's east abutment
  { id: 'LD-S-tower', width: 0.9, points: [[-50.6, 17.6], [-52.0, 19.3]] },   // to Tower Bridge's west abutment
  { id: 'LD-S-breakfast', width: 1.0, points: [[-54.32, 24.6], [-54.32, 22.4]] },
  { id: 'LD-S-cockles', width: 1.0, points: [[-69.6, 18.1], [-69.6, 15.7]] },
  { id: 'LD-S-engine', width: 1.0, points: [[-61.41, 18.05], [-61.41, 16.2]] },
  { id: 'LD-S-pasty', width: 1.0, points: [[-77.3, 25.7], [-77.3, 21.0]] },
  { id: 'LD-S-leeks', width: 1.0, points: [[-70.2, 25.7], [-70.2, 23.4]] },
  { id: 'LD-S-orchard', width: 1.0, points: [[-62.55, 25.7], [-62.55, 23.0]] },
  // The dale yard west of the Dales lane: a ring of cart track the pit pony is led round.
  { id: 'LD-YG', width: 1.0, points: [[-53.8, -15.3], [-52.4, -15.3]] },   // the yard gate onto the Dales lane
  { id: 'LD-YD', width: 1.0, points: [[-54.6, -18.2], [-53.8, -17.2], [-53.8, -15.3], [-53.8, -14.6], [-54.6, -13.8], [-55.4, -14.6], [-55.4, -17.2], [-54.6, -18.2]] },
];
/** Roads whose points stand in one row's band of the old frame but belong to the next row's cluster: the omnibus
 *  terminus behind the tea room lay beside the moor road, which now runs along the Firths fifteen units north. */
const FORCED_ROW: Record<string, number> = { 'LD-TS': 1 };
/** Roads written in the new frame already: they take no warp and join the network in the second pass. */
const NEW_FRAME = new Set(['LD-EL', 'LD-TW']);
/** Every junction is a vertex of both routes: where one route ends on another's centreline, the point on that centreline
 *  is inserted into it, so the network reads as one piece to the walkers and to the harness, which joins routes at
 *  their vertices. Rings are left as drawn. */
function joinJunctions(roads: Road[]) { for (const r of roads) for (const [x, z] of [r.points[0], r.points[r.points.length - 1]]) for (const o of roads) {
  if (o === r) continue;
  const ring = Math.hypot(o.points[0][0] - o.points[o.points.length - 1][0], o.points[0][1] - o.points[o.points.length - 1][1]) < 1e-6;
  if (ring || o.points.some(([ox, oz]) => Math.hypot(ox - x, oz - z) < 1.6)) continue;
  for (let i = 0; i < o.points.length - 1; i++) {
    const [ax, az] = o.points[i], [bx, bz] = o.points[i + 1], ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2)), px = ax + ex * t, pz = az + ez * t;
    if (Math.hypot(x - px, z - pz) <= o.width / 2 + .05 && t > .02 && t < .98) { o.points.splice(i + 1, 0, [+px.toFixed(2), +pz.toFixed(2)]); break; }
  }
} }
// The junctions are joined in the old frame first, so a doorstep that met a street mid-segment is a vertex of that
// street before the clusters are pulled apart and moves with it; then every point goes through `W`, and the joins are
// made once more for the one road that changed rows (the omnibus terminus on the east lane).
joinJunctions(RAW_ROADS.filter(r => !(r.id in FORCED_ROW) && !NEW_FRAME.has(r.id)));
export const LD_ROADS: Road[] = RAW_ROADS.map(r => NEW_FRAME.has(r.id) ? r : ({ ...r, points: WPS(r.points, FORCED_ROW[r.id]) }));
{
  // and the pass road meets the moor road where the Firths' move left it
  const r5 = LD_ROADS.find(r => r.id === 'LD-R5')!.points, el = LD_ROADS.find(r => r.id === 'LD-EL')!.points;
  for (let i = 0; i < r5.length - 1; i++) { const [ax, az] = r5[i], [bx, bz] = r5[i + 1]; if ((ax + 53.4) * (bx + 53.4) <= 0) { el[0] = [-53.4, +(az + (bz - az) * (-53.4 - ax) / ((bx - ax) || 1)).toFixed(2)]; break; } }
}
joinJunctions(LD_ROADS);
export const road = (id: string) => LD_ROADS.find(r => r.id === id)!;

/** A crossing: the deck centre, how far it spans and which road carries it. One road crosses water in the
 *  whole of Britain, and this is it. */
export type Crossing = { at: Pt; span: number; road: string };
export const LD_CROSSINGS: Crossing[] = [
  { at: W(-55.6, 7.9), span: 6.0, road: 'LD-R2' },
];
/** Deck centres, in the shape `spain-town.ts` uses: Westminster Bridge, which carries the bridge road, and
 *  Tower Bridge, which carries no road and is the landmark, over the river's southward reach. */
export const LD_BRIDGES: Pt[] = WPS([[-55.6, 7.9], [-45.2, 20.0]]);
export const BRIDGE_SPAN = 6.0, BRIDGE_DECK_Y = ROAD_LIFT;

/** Straight walking segments cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the first clothing profile on the lane out of `london-people.ts`. `strips` sets each walker's
 *  own line across the road, as an offset from the centreline along the lane's left-hand normal (for a lane
 *  running east, positive is south): two walkers on one segment keep 0.6 or more apart and never meet, which
 *  is what the Italy fix of 2026-09-23 did for its streets. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number; pace: number; strips?: number[] };
/** Twelve peopled lanes on eight roads, twenty residents, at 0.009 on Whitehall and 0.007 everywhere else (re-cluster pass,
 *  2026-09-23). A walker in front of a stand hides it from the arrival camera unless it keeps 1.125 or more in front
 *  of the stand's face (the rays climb 0.8 a unit and a resident is 1.7 tall), so the lanes are on the stretches of
 *  road where that holds and each lane's strips (offsets south of its centreline) are set to keep it: Whitehall
 *  only in front of the palace, the moor road past the Firths east of the palace's roof line, the dale road past the Dales, the West Country
 *  street, the Embankment in front of the omnibus stand, the south road past the bakehouse and the leek bed, the
 *  Weald road east of the cookhouse and
 *  the hops road. Every lane stops 12 percent short of its ends. */
const lane = (id: string, from: Pt, to: Pt, walkers: number, seed: number, pace: number, strips: number[]): Lane =>
  ({ id, from: W(...from), to: W(...to), range: [.12, .88], walkers, seed, pace, strips });
export const LD_LANES: Lane[] = [
  lane('LD-R1-0', [-78.6, -1.6], [-75.0, -1.6], 2, 8, .009, [.15, .75]),
  lane('LD-R1-1', [-75.0, -1.6], [-71.3, -1.6], 2, 5, .009, [.15, .75]),
  lane('LD-R5-1', [-70.6, -10.5], [-66.0, -10.5], 1, 1, .007, [.65]),
  lane('LD-R5-2', [-66.0, -10.5], [-60.6, -10.5], 1, 0, .007, [.35]),
  lane('LD-R5-3', [-52.0, -11.4], [-45.0, -11.4], 1, 9, .007, [.3]),
  lane('LD-R5-4', [-45.0, -11.4], [-37.0, -11.4], 1, 20, .007, [.6]),
  lane('LD-WS-0', [-63.8, 18.06], [-58.4, 18.03], 2, 3, .007, [-.05, .55]),
  lane('LD-WS-1', [-69.0, 18.1], [-63.8, 18.06], 1, 6, .007, [.3]),
  lane('LD-EM-0', [-75.6, 5.75], [-70.2, 5.75], 2, 4, .007, [.05, .65]),
  lane('LD-SC-0', [-76.8, 25.7], [-66.6, 25.7], 2, 26, .007, [-.1, .5]),
  lane('LD-WR-0', [-45.0, 4.9], [-37.8, 4.9], 2, 17, .007, [-.05, .55]),
  lane('LD-HR-0', [-43.4, 0.8], [-37.0, 0.8], 2, 14, .007, [.05, .6]),
  // The pony's handler: one walker, led round the dale yard's ring by `london-town.ts` rather than up and down.
  { id: 'LD-YD-0', from: W(-54.6, -18.2), to: W(-54.6, -13.8), range: [0, 1], walkers: 1, seed: 23, pace: .007 },
  // Owner round, 2026-09-24: more people on the roads between the regions, written in the new frame
  { id: 'LD-MR-0', from: [-50, 11.05], to: [-24, 11.05], range: [.12, .88], walkers: 2, seed: 30, pace: .007, strips: [-.1, .1] },
  { id: 'LD-WS-2', from: [-58.03, 33.78], to: [-70.0, 45.99], range: [.12, .88], walkers: 2, seed: 33, pace: .007, strips: [0, .15] },
];
/** The lane the pit pony is led along, and the two lanes whose walkers carry cockle baskets. */
export const PONY_LANE = 'LD-YD-0', COCKLE_LANES = ['LD-WS-1', 'LD-SC-0'];

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
  if (wet || (b && (!clearOfWater(b, .1) || !clearOfObjects(b) || onRoad(b) || onHouse(ctx, b, !!o.userData.keepOffDoors) || inRoomApproach(b) || !raysClear(o)))) { ctx.group.remove(o); return null; }
  return o;
}
/** True when the box stands inside a decorative house already built, so the country is never planted through
 *  a wall. The houses are built first (`london-town.ts`), then the countryside round them. */
function onHouse(ctx: LayoutCtx, box: THREE.Box3, door = false): boolean {
  for (const h of ctx.group.children) {
    if (h.name !== 'britain-house' && !/^uk-(village|barn|mill|pasture)$/.test(h.name)) continue;   // the owner round's villages too
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
/** True when every point of the box's ground footprint is dry and at least `margin` from every water edge: the sea,
 *  the strait, the inlets, the river, the tarn, the mill pond and the burn. The owner's note on the live site,
 *  "please make sure houses are not standing in the river" (2026-09-23), is the reason: a decorative house or a
 *  stand's own building keeps a unit of dry ground between its walls and any water. */
export function clearOfWater(b: THREE.Box3, margin: number): boolean {
  const nx = Math.max(2, Math.ceil((b.max.x - b.min.x) / .25)), nz = Math.max(2, Math.ceil((b.max.z - b.min.z) / .25));
  for (let i = 0; i <= nx; i++) for (let k = 0; k <= nz; k++) {
    const x = b.min.x + (b.max.x - b.min.x) * i / nx, z = b.min.z + (b.max.z - b.min.z) * k / nz;
    if (isWet(x, z) || waterEdge(x, z) < margin || burnDistance(x, z) < BURN_WIDTH / 2 + margin) return false;
  }
  return true;
}
/** A building: dry, off every road, clear of every stand's pad and approach, and hiding no stand from the
 *  arrival camera by the ray test above, and a unit clear of every water edge. The first candidate that passes is the
 *  one that stands. */
export function placeBuilding<T extends THREE.Object3D>(ctx: LayoutCtx, build: () => T, spots: [number, number, number][]): T | null {
  for (const [x, z, rot] of spots) {
    const o = build(); ctx.place(o, x, z, rot); o.updateMatrixWorld(true);
    let box: THREE.Box3 | null = null;
    o.traverse(m => { const mesh = m as THREE.Mesh; if (!mesh.isMesh) return; mesh.geometry.computeBoundingBox(); const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld); if (b.max.y < .35) return; box = box ? (box as THREE.Box3).union(b) : b; });
    const b = box as THREE.Box3 | null;
    const wet = !b || !clearOfWater(b, 1.0);
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
function riverGeo(curve: THREE.CatmullRomCurve3, widthAt: (u: number) => number, segments = 280): THREE.BufferGeometry {
  const pts = curve.getSpacedPoints(segments), position: number[] = [], uv: number[] = [], index: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, p = pts[i], t = curve.getTangentAt(u);
    const half = widthAt(u) / 2 * (.96 + Math.sin(u * 26) * .04);   // a gentle, smooth swell in the banks
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
const SAND_EDGE = (z: number) => -75.8 + Math.sin(z * 2.3 + .6) * .22 + Math.sin(z * 5.1) * .06;
function wetSand(): THREE.Mesh {
  const lerpAlong = (pts: Pt[], x: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
      if ((x - ax) * (x - bx) <= 0) return az + (bz - az) * ((x - ax) / ((bx - ax) || 1));
    }
    return pts[x < pts[0][0] ? 0 : pts.length - 1][1];
  };
  // The two shores of the channel's head (re-laid with the channel in the re-cluster pass, 2026-09-23), pulled 0.1
  // inside the drawn coast so the sand's sides sit under the rim, not over the grass; the sand runs on past the head
  // onto the dry flat where the cockle stall stands.
  const south: Pt[] = [[-76.6, 11.5], [-73.3, 12.05], [-71.4, 12.05]];
  const north: Pt[] = [[-76.6, 13.3], [-73.8, 13.2], [-72.95, 12.85], [-71.4, 13.0]];
  const cols = 64, rows = 10, position: number[] = [], color: number[] = [], index: number[] = [];
  const lip = new THREE.Color('#d8ccaa'), wettest = new THREE.Color('#978a6b'), damp = new THREE.Color('#b7a882'), dry = new THREE.Color('#d3c7a0');
  const runnels = [12.3, 12.8];
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
    const v = r / rows, zGuess = 11.8 + v * 1.3;
    const x0 = SAND_EDGE(zGuess), u = c / cols, x = x0 + (-71.4 - x0) * u;
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
  // built in the old frame, where the ripple and runnel curves are written, and carried with the West Country
  const [ox, oz] = ukOffset(-73, 12.5);
  m.position.set(ox, SAND_WET_Y, oz); m.renderOrder = 3; m.receiveShadow = true; m.name = 'cockle-sand-wet';
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
  // One tint for each of the six clusters (re-cluster pass, 2026-09-23), from `LONDON_CLUSTERS`: a soft ellipse over
  // the cluster's anchors and 3.3 to 3.8 beyond them, so each place stands on its own ground and the country between
  // them keeps the table's own green.
  for (const c of LONDON_CLUSTERS) {
    const pts = c.ids.map(id => LONDON_OBJECTS.find(o => o.id === id)!.pos);
    const xs = pts.map(p => p[0]), zs = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
    tint((x0 + x1) / 2, (z0 + z1) / 2, (x1 - x0) / 2 + 3.3, (z1 - z0) / 2 + 3.8, c.tint);
  }
  tint(...W(-71.6, 12.8), 1.8, 1.3, '#d9cfae');      // the dry sand at the Bristol Channel's head

  // ---------- the one sea: the ring, the island as its hole, one rim, one shader ----------
  const sea = seaWater(), tarnW = freshWater();
  const river = estuaryWater(RIVER_MOUTH[0], ESTUARY_SEA_Z, ESTUARY_BLEND, 'z');
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
  const burnW = estuaryWater(BURN_POINTS[BURN_POINTS.length - 1][0], BURN_POINTS[BURN_POINTS.length - 1][1], 1.1);
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
  flock(5, 1.2, 5, -19.4, -19.5);   // the North Sea off the Dales (UK re-lay: the strait is gone)
  flock(4, .7, 4.5, ...W(-79.2, -5.5));   // the west coast, behind the palace
  flock(4, .8, 4, ...W(-38.5, 26.4));     // the sea off the river's mouth, east of Tower Bridge's coaster
}
