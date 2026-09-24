/** The British clusters as they are built: the road ribbons drawn from the road table, the Westminster street
 *  paving, the five decorative houses, Westminster Bridge, the 1907 motor omnibus and the two hansom cabs on
 *  the street, the gas standards, the dock furniture and the four peopled walker loops with the pit pony.
 *
 *  The road, bridge and lane tables live in `london-landscape.ts`, because the countryside is cut round them;
 *  they are re-exported here so a caller may import them from either file, in the shape `spain-town.ts` uses.
 *
 *  Tower Bridge is **not** built here. It is the clickable landmark `towerBridge` at [-37.7, 3.4] and its
 *  geometry is the Stand maker's `towerBridge` prop in `props-london.ts`; building a second one over it would
 *  put two bascule bridges in one place. Both deck centres are in `LD_BRIDGES`; `world-ceurope.ts` takes its
 *  Westminster Bridge deck from `LD_CROSSINGS`, and nobody walks over either bridge.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';
import { LD, ukHouse, gasLamp, type UkStyle } from './london-architecture';
import { londonResident, londonWalk, pitPony, ringWalk, ringPony } from './london-people';
import {
  LD_ROADS, LD_CROSSINGS, LD_BRIDGES, LD_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y, PONY_LANE,
  tryPlace, placeBuilding, isWet, inRoomApproach, road, type Lane, type Pt, type Road,
} from './london-landscape';
import { LONDON_OBJECTS } from './london-objects';
import { W, WP, WPS } from './london-warp';
import { TABLE } from './london-landscape';
import type { LayoutCtx } from './worldkit';

export { LD_ROADS, LD_BRIDGES, LD_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y, type Lane, type Road };
/** Paving heights: the street slab sits under the road ribbons, and each ribbon a hair above the last. */
export const ROAD_Y = .036, PAVING_Y = .018;
const SOOT = '#33302C', TIMBER = '#6E5A3E';

/** The paved squares: name, centre, width, depth, colour. Axis-aligned rectangles, never blobs; every side
 *  lies under a road's own surface or against the row of doors it serves.
 *
 *  One square in the whole of Britain. The blueprint gives Westminster 18 x 8 of wet paving "along the
 *  street"; at 8 deep its two long sides run three units out into the grass on both rows' far side, so it is
 *  drawn 14 x 4.2 on the street's own centre, which is the ground the paving is actually on. The Docks take
 *  no paving at all, which is the blueprint's own word for them. */
export const LD_PAVING: [string, number, number, number, number, string][] = [
  ['westminster-paving', ...W(-66.0, -1.6), 12.0, 1.6, '#b8b4ad'],
];

/** How far a walker is raised while it is on a bridge deck, and the ramp at each end. The height is read from
 *  the walker's own position rather than from the lane's parameter, so a lane that only touches the crossing
 *  at one end lifts the walker over the water and nowhere else. */
export function londonBridgeLift(lane: Lane): ((u: number) => number) | undefined {
  const dx = lane.to[0] - lane.from[0], dz = lane.to[1] - lane.from[1], l2 = dx * dx + dz * dz || 1;
  for (const crossing of LD_CROSSINGS) {
    const [bx, bz] = crossing.at;
    const t = Math.max(0, Math.min(1, ((bx - lane.from[0]) * dx + (bz - lane.from[1]) * dz) / l2));
    if (Math.hypot(lane.from[0] + dx * t - bx, lane.from[1] + dz * t - bz) > 1.4) continue;
    const half = crossing.span / 2, ramp = 1.4;
    return (u: number) => {
      const d = Math.hypot(lane.from[0] + dx * u - bx, lane.from[1] + dz * u - bz);
      return d >= half + ramp ? 0 : d <= half ? BRIDGE_DECK_Y : BRIDGE_DECK_Y * (1 - (d - half) / ramp);
    };
  }
  return undefined;
}

/** A road ribbon: one mesh per route, above the paving and marked so it wins the depth test. A route whose
 *  first and last points are the same is drawn as one closed curve, so a ring has no seam where it began. */
function ribbon(points: Pt[], width: number, color: string, y: number): THREE.Mesh {
  const ring = points.length > 3 && Math.hypot(points[0][0] - points[points.length - 1][0], points[0][1] - points[points.length - 1][1]) < 1e-6;
  const line = ring ? points.slice(0, -1) : points;
  const curve = new THREE.CatmullRomCurve3(line.map(([x, z]) => new THREE.Vector3(x, y, z)), ring);
  const steps = line.length * 12, pts = curve.getSpacedPoints(steps), pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = pts[i], tg = curve.getTangentAt(Math.min(1, i / steps));
    const side = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, y, p.z - side.z, p.x + side.x, y, p.z + side.z);
    if (i < steps) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat(color, { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  m.receiveShadow = true; return m;
}
/**
 * The points a route is drawn through. Two ribbons that meet butt-end at a junction leave a wedge of grass
 * between them, because each one stops on the junction's centre and their edges are not parallel. So a route
 * that ends on another route, on a bridge deck or at a stand's door is carried a little past that point along
 * its own last direction, and the two surfaces overlap instead of meeting. A route that ends at the table edge
 * or at the water is left alone: it leaves the table, or it is a set of river stairs. Nothing here changes the
 * road table; it changes only what is drawn.
 */
function drawnPoints(r: Road): Pt[] {
  const points = r.points.map(p => [...p] as Pt);
  const ring = Math.hypot(points[0][0] - points[points.length - 1][0], points[0][1] - points[points.length - 1][1]) < 1e-6;
  if (ring) return points;
  for (const end of [0, 1]) {
    const i = end ? points.length - 1 : 0, j = end ? points.length - 2 : 1;
    const [x, z] = points[i];
    if (z <= TABLE.minZ + .4 || z >= TABLE.maxZ - .4 || x <= TABLE.minX + .4 || x >= TABLE.maxX - .4) continue;   // the road leaves the table
    let reach = 0;
    for (const other of LD_ROADS) {
      if (other.id === r.id) continue;
      for (let k = 0; k < other.points.length - 1; k++) {
        const [ax, az] = other.points[k], [bx, bz] = other.points[k + 1];
        const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
        if (Math.hypot(x - ax - ex * t, z - az - ez * t) < 2.4) reach = Math.max(reach, other.width / 2 + .45);
      }
    }
    for (const [bx, bz] of LD_BRIDGES) if (Math.hypot(x - bx, z - bz) < 2.4) reach = Math.max(reach, .8);
    for (const o of LONDON_OBJECTS) if (Math.hypot(x - o.pos[0], z - o.pos[1]) < 2.4) reach = Math.max(reach, .7);
    if (!reach) continue;
    const dx = x - points[j][0], dz = z - points[j][1], len = Math.hypot(dx, dz) || 1;
    const carried: Pt = [x + dx / len * reach, z + dz / len * reach];
    if (isWet(carried[0], carried[1])) continue;                                 // never carry a road surface into the water
    points[i] = carried;
  }
  return points;
}

/** A paved surface: an axis-aligned rectangle, never a soft shape. */
function slab(x: number, z: number, w: number, d: number, color: string, y: number, name: string): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; m.name = name; return m;
}

/** Westminster Bridge: three segmental arches on two river piers, a stone parapet with a balustrade, and a
 *  deck at the road height so the river passes underneath and a walker steps up onto it and down again. */
function stoneBridge(len = BRIDGE_SPAN, deckWidth = 1.9): P {
  const g = new THREE.Group(), deck = BRIDGE_DECK_Y;
  // The abutment at each bank, then the two piers in the water, then the arch rings between them.
  for (const x of [-len / 2 + .45, len / 2 - .45]) add(g, block(.9, deck - .11, deckWidth + .52, LD.portlandStone), x, (deck - .11) / 2, 0);
  for (const x of [-len / 6, len / 6]) {
    add(g, block(.5, deck - .1, deckWidth + .14, LD.moorGranite), x, (deck - .1) / 2, 0);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, deckWidth + .26, 8), mat(LD.moorGranite)), x, .12, 0).rotation.x = Math.PI / 2;   // the cutwater
  }
  for (const x of [-len / 3, 0, len / 3]) {
    const arch = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, deckWidth + .36, 14, 1, false, 0, Math.PI), mat(LD.portlandStone)), x, deck - .22, 0);
    arch.rotation.set(Math.PI / 2, 0, Math.PI);
  }
  add(g, block(len - .06, .22, deckWidth + .3, LD.portlandStone), 0, deck - .11, 0);
  add(g, block(len - .12, .07, deckWidth, '#8E8878'), 0, deck + .02, 0);                       // the roadway on the deck
  for (const z of [-deckWidth / 2 - .11, deckWidth / 2 + .11]) {
    add(g, block(len + .04, .12, .18, LD.portlandStone), 0, deck + .1, z);                      // the parapet plinth
    for (let i = 0; i < Math.round(len / .42); i++)
      add(g, new THREE.Mesh(new THREE.CylinderGeometry(.045, .06, .3, 6), mat(LD.portlandStone)), -len / 2 + .21 + i * .42, deck + .31, z);   // the balusters
    add(g, block(len + .1, .1, .22, LD.portlandStone), 0, deck + .51, z);                      // the coping
  }
  // The embankment at each end: a made approach that climbs the whole 0.9 of the deck over 1.6 units, so the
  // roadway meets the bridge instead of stepping up a wall. It meets the deck rather than tucking under it,
  // so no z-fighting sliver is left where the two surfaces lie in one plane.
  const rise = deck - .04, run = 1.6, tilt = Math.atan2(rise, run);
  for (const side of [-1, 1]) {
    const bank = add(g, block(run / Math.cos(tilt), .16, deckWidth - .06, '#8E8878'), side * (len / 2 + run / 2), deck / 2 + .02, 0);
    bank.rotation.z = side > 0 ? -tilt : tilt;
    for (const z of [-deckWidth / 2 - .10, deckWidth / 2 + .10]) {
      const wall = add(g, block(run / Math.cos(tilt), .3, .18, LD.portlandStone), side * (len / 2 + run / 2), deck / 2 + .12, z);
      wall.rotation.z = side > 0 ? -tilt : tilt;
    }
  }
  const bridge = masonry(g) as P;
  // The two standards stand on the coping itself, clear of the balusters: set on the deck they sat exactly
  // on a baluster and the two bases shared a face plane, which is a flicker at world zoom.
  for (const x of [-len / 2 + .35, len / 2 - .35]) add(bridge, gasLamp(1.5), x, deck + .56, deckWidth / 2 + .11);
  return bridge;
}

/** A hansom cab: two tall wheels, a low body between them, the driver perched high behind, and one horse in
 *  the shafts. The wheels turn with the ground they cover. */
function hansomCab(body = SOOT): P {
  const g = new THREE.Group();
  add(g, block(1.0, .62, .74, body), 0, .74, 0);
  add(g, block(.9, .5, .06, '#241F1B'), .05, .78, .38);
  add(g, block(1.02, .08, .8, body), 0, 1.08, 0);
  add(g, block(.5, .1, .62, '#241F1B'), -.5, 1.16, 0);                                   // the driver's seat behind the cab
  const driver = londonResident(11, true); driver.scale.setScalar(.82);
  (driver.userData as { sit?: () => void }).sit?.(); driver.position.set(-.5, 1.22, 0); driver.rotation.y = Math.PI / 2; g.add(driver);
  const wheels: THREE.Mesh[] = [];
  for (const z of [-.46, .46]) {
    const w = add(g, new THREE.Mesh(new THREE.TorusGeometry(.46, .04, 6, 18), mat('#3A3129')), 0, .48, z);
    for (let i = 0; i < 6; i++) add(w, new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .88, 4), mat('#6B5334')), 0, 0, 0).rotation.z = i * Math.PI / 6;
    wheels.push(w as THREE.Mesh);
  }
  for (const z of [-.28, .28]) { const shaft = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1.5, 5), mat(TIMBER)), .92, .78, z); shaft.rotation.z = Math.PI / 2; }
  // The horse between the shafts.
  const horse = new THREE.Group(); horse.position.set(2.0, 0, 0); g.add(horse);
  add(horse, block(1.0, .46, .38, '#4A3A2C'), 0, .82, 0);
  add(horse, block(.28, .46, .26, '#4A3A2C'), .6, .96, 0);
  add(horse, block(.2, .18, .2, '#2E241B'), .74, .8, 0);
  add(horse, block(.3, .14, .1, '#241F1B'), .3, 1.1, 0);
  add(horse, block(.05, .3, .05, '#241F1B'), -.5, .78, 0).rotation.x = .3;
  for (const [x, z] of [[.32, -.14], [.32, .14], [-.32, -.14], [-.32, .14]] as [number, number][])
    add(horse, block(.1, .62, .1, '#3E3025'), x, .3, z);
  const out = g as P;
  let last: THREE.Vector3 | undefined;
  out.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? out.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(out.position);
    for (const w of wheels) w.rotation.z -= moved / .46;
  };
  return out;
}

/** A 1907 motor omnibus: a red bonneted chassis with solid tyres, a saloon below and an open top deck with
 *  garden seats, a stair at the back and a destination board over the driver. No Routemaster: the roofed red
 *  bus is a 1956 object and is not on this table. */
function motorOmnibus(): P {
  const g = new THREE.Group();
  add(g, block(3.3, .22, 1.0, SOOT), 0, .5, 0);                                           // the chassis
  add(g, block(2.5, .9, 1.0, LD.postRed), -.2, 1.06, 0);                                  // the saloon
  for (let i = 0; i < 4; i++) add(g, block(.4, .42, .04, '#8FA7B2'), -1.25 + i * .62, 1.2, .51);
  add(g, block(.8, .8, .92, '#7A1E18'), 1.45, .95, 0);                                    // the bonnet
  add(g, block(.5, .1, 1.0, SOOT), 1.9, 1.1, 0);
  add(g, block(2.9, .1, 1.04, LD.postRed), -.1, 1.56, 0);                                  // the top-deck floor
  for (const z of [-.5, .5]) add(g, block(2.9, .5, .07, LD.postRed), -.1, 1.82, z);     // the decency boards
  for (let i = 0; i < 4; i++) for (const z of [-.24, .24]) add(g, block(.34, .34, .26, '#5A4A34'), -1.2 + i * .66, 1.78, z);   // the garden seats
  add(g, block(1.6, .34, .07, '#F2EDE0'), -.2, 2.14, .54);                                // the advertisement board
  add(g, block(1.1, .28, .06, '#F2EDE0'), .9, 1.5, .53);                                  // the destination board
  const stair = add(g, block(.5, .08, .8, SOOT), -1.65, 1.1, 0); stair.rotation.z = -.5;
  const driver = londonResident(1, true); driver.scale.setScalar(.85);
  (driver.userData as { sit?: () => void }).sit?.(); driver.position.set(1.1, 1.14, 0); driver.rotation.y = Math.PI / 2; g.add(driver);
  for (const [i, x] of [-1.0, -.2, .5].entries()) {
    const rider = londonResident(3 + i * 4); rider.scale.setScalar(.8);
    (rider.userData as { sit?: () => void }).sit?.();
    rider.userData.tick = undefined;                                                      // a passenger is carried, so it does not step
    rider.position.set(x, 1.72, i % 2 ? .24 : -.24); rider.rotation.y = Math.PI / 2; g.add(rider);
  }
  const wheels: THREE.Mesh[] = [];
  for (const [x, r] of [[-1.15, .44], [1.35, .4]] as [number, number][]) for (const z of [-.44, .44]) {
    const w = add(g, new THREE.Mesh(new THREE.CylinderGeometry(r, r, .16, 14), mat('#2E2A26')), x, r + .04, z);
    w.rotation.x = Math.PI / 2;
    add(w, new THREE.Mesh(new THREE.CylinderGeometry(r * .4, r * .4, .18, 10), mat('#8B8177')), 0, 0, 0);
    wheels.push(w as THREE.Mesh);
  }
  const out = g as P;
  let last: THREE.Vector3 | undefined;
  out.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? out.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(out.position);
    for (const w of wheels) w.rotation.y -= moved / .44;
  };
  return out;
}

/** A coster's barrow: two wheels, a sloped tray of produce and a pair of handles. Low enough to hide nothing. */
function costerBarrow(): P {
  const g = new THREE.Group();
  add(g, block(1.2, .1, .78, TIMBER), 0, .62, 0);
  add(g, block(1.2, .22, .08, TIMBER), 0, .74, -.38);
  for (let k = 0; k < 8; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.09, 7, 6), mat(['#B2603A', '#8FA84A', '#C8922E', '#7E8A4E'][k % 4])), -.45 + (k % 4) * .3, .72, -.14 + Math.floor(k / 4) * .22);
  for (const z of [-.42, .42]) {
    const w = add(g, new THREE.Mesh(new THREE.TorusGeometry(.3, .035, 5, 14), mat('#3A3129')), 0, .32, z);
    for (let i = 0; i < 5; i++) add(w, new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .58, 4), mat('#6B5334')), 0, 0, 0).rotation.z = i * Math.PI / 5;
  }
  for (const z of [-.3, .3]) { const h = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1.1, 5), mat(TIMBER)), -.8, .66, z); h.rotation.z = Math.PI / 2; }
  return masonry(g) as P;
}

/** Style, footprint, storeys and candidate spots (re-cluster pass, 2026-09-23). At most five decorative houses in
 *  the whole of Britain, none in the West Country. Each is built at the first of its spots that is dry and at least
 *  a unit from every water edge (the owner: "please make sure houses are not standing in the river"), off every road,
 *  clear of every stand's 6 x 5 pad, 2.5 approach and room approach, and first on none of the ten arrival rays of any
 *  stand (`placeBuilding`). The clusters are dense now, so a house stands in the ground between a cluster's rows or at
 *  its edge, and a style whose spots all fail is left out rather than forced:
 *
 *  - `uk-westminster-terrace` [-62, -7.5], two storeys, behind the pastry board on the moor road
 *  - `uk-dock-warehouse` [-39, 8.5] on the river's east bank, behind the pie shop
 *  - `uk-kentish-cottage` [-43, -8] behind the hop garden
 *  - `uk-dale-farmhouse` [-49, -23.5] beside the dairy, at the head of the dale lane
 *  - `uk-fife-cottage` [-66, -12.5] between the herring quay and the oat mill
 *  The spots were found by a half-unit grid search with `placeBuilding` itself.
 */
const HOUSES: { id: string; style: UkStyle; w: number; d: number; h: number; storeys?: number; spots: [number, number, number][] }[] = [
  { id: 'uk-westminster-terrace', style: 'londonTerrace', w: 4.0, d: 1.8, h: 1.45, storeys: 2,
    spots: ([[-62.0, -7.5, 0], [-62.0, -8.0, 0]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z), r]) },
  { id: 'uk-dock-warehouse', style: 'dockWarehouse', w: 3.0, d: 2.0, h: 1.25, storeys: 4,
    spots: ([[-39.0, 8.5, 0], [-39.0, 8.0, 0], [-39.5, 7.5, 0]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z, 2), r]) },   // with the Docks, behind the pie shop
  { id: 'uk-kentish-cottage', style: 'kentishCottage', w: 2.8, d: 2.0, h: 1.15, storeys: 2,
    spots: ([[-43.0, -8.0, 0], [-43.0, -8.5, 0]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z, 1), r]) },   // with the Weald, south of the row cut
  { id: 'uk-dale-farmhouse', style: 'daleFarm', w: 2.4, d: 1.9, h: 1.9,
    spots: ([[-49.0, -23.5, 0], [-48.5, -23.0, 0], [-48.5, -22.0, 0]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z), r]) },
  { id: 'uk-fife-cottage', style: 'fifeCottage', w: 2.4, d: 1.8, h: 1.8,
    spots: ([[-66.0, -12.5, 0], [-65.5, -12.5, 0]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z), r]) },
];

/** Hand-picked gas standards; `londonTown` then lays more along every road, at least 4.5 apart. Each is
 *  dropped if it would crowd a clickable, stand on a lane, reach into the water or hide a stand. */
const LAMPS: [number, number][] = WPS([
  [-54.5, -0.3], [-56.6, 1.0],
]);

export function londonTown(ctx: LayoutCtx) {
  const { group, place, tickers, TOP } = ctx;

  // ---------- the swept ground under the one paved cluster, then the roads on top of it ----------
  for (const [name, x, z, w, d, colour] of LD_PAVING) group.add(slab(x, z, w, d, colour, PAVING_Y, name));
  for (const [i, r] of LD_ROADS.entries()) {
    const strip = ribbon(drawnPoints(r), r.width, r.id === 'LD-R1' ? '#8E8878' : r.id === 'LD-R3' ? '#9A9184' : '#B3A88C', ROAD_Y + i * .004);
    strip.name = 'britain-road'; strip.userData.road = r.id; group.add(strip);
  }

  // ---------- Westminster Bridge, where the bridge road crosses the river ----------
  for (const crossing of LD_CROSSINGS) {
    const r = LD_ROADS.find(x => x.id === crossing.road)!;
    let best = 0, bd = 1e9;
    for (let i = 0; i < r.points.length - 1; i++) {
      const mx = (r.points[i][0] + r.points[i + 1][0]) / 2, mz = (r.points[i][1] + r.points[i + 1][1]) / 2;
      const d = Math.hypot(mx - crossing.at[0], mz - crossing.at[1]);
      if (d < bd) { bd = d; best = i; }
    }
    const dx = r.points[best + 1][0] - r.points[best][0], dz = r.points[best + 1][1] - r.points[best][1], l = Math.hypot(dx, dz) || 1;
    const deck = place(stoneBridge(crossing.span, r.width + .1), crossing.at[0], crossing.at[1], Math.atan2(-dz / l, dx / l));
    deck.name = 'britain-bridge';
  }

  // ---------- the five decorative houses ----------
  for (const h of HOUSES) {
    const built = placeBuilding(ctx, () => ukHouse(h.style, h.w, h.d, h.h, { storeys: h.storeys }), h.spots);
    if (built) { built.name = 'britain-house'; built.userData.houseId = h.id; }
  }

  // ---------- gas standards along the roads ----------
  // Tried every few units along each road, a little off its kerb and on alternate sides; `tryPlace` drops any
  // that would crowd a clickable, stand on a lane, reach into the water or hide a stand. The hand-picked spots
  // come first.
  let lamps = 0;
  const lit: [number, number][] = [];
  const ts0 = road('LD-TS').points;
  const offTerminus = (x: number, z: number) => !(x > ts0[1][0] - 2.4 && x < ts0[0][0] + 2.4 && Math.abs(z - ts0[0][1]) < 2.3);   // the omnibus swings wide at its turns
  const yd = road('LD-YD').points, offYard = (x: number, z: number) => !(x > Math.min(...yd.map(p => p[0])) - 1.3 && x < Math.max(...yd.map(p => p[0])) + 1.3 && z > Math.min(...yd.map(p => p[1])) - 1.3 && z < Math.max(...yd.map(p => p[1])) + 1.3);   // the pony's ring is drawn rounder than its table
  // nothing tall within the palace's width and 1.25 of its height behind it, where the arrival camera draws it on the roof
  const [rx0, rz0] = W(-79.6, -9.0), [rx1, rz1] = W(-70.4, -6.2);   // the band behind the palace, in its own row
  const offRoofLine = (x: number, z: number) => !(x > rx0 && x < rx1 && z > rz0 - 5.2 && z < rz1);
  const spaced = (x: number, z: number) => offRoofLine(x, z) && offTerminus(x, z) && offYard(x, z) && lit.every(([lx, lz]) => Math.hypot(lx - x, lz - z) >= 4.5);   // a standard every few doors, never a cluster
  for (const [i, [x, z]] of LAMPS.entries()) {
    if (!spaced(x, z)) continue;
    const lamp = tryPlace(ctx, gasLamp(2.5 + (i % 2) * .2), x, z, i * .7);
    if (lamp) { lamp.name = 'gas-lamp'; lamps++; lit.push([x, z]); }
  }
  for (const r of LD_ROADS) {
    if (lamps >= 26) break;
    for (let k = 0; k < r.points.length - 1 && lamps < 26; k++) {
      const [ax, az] = r.points[k], [bx, bz] = r.points[k + 1], len = Math.hypot(bx - ax, bz - az);
      for (let d = 2; d < len && lamps < 26; d += 5) {
        const t = d / len, x = ax + (bx - ax) * t, z = az + (bz - az) * t, side = (k + Math.round(d)) % 2 ? 1 : -1;
        const nx = -(bz - az) / len * side, nz = (bx - ax) / len * side, off = r.width / 2 + .45;
        if (!spaced(x + nx * off, z + nz * off)) continue;
        const lamp = tryPlace(ctx, gasLamp(2.5 + (lamps % 2) * .2), x + nx * off, z + nz * off, lamps * .7);
        if (lamp) { lamp.name = 'gas-lamp'; lamps++; lit.push([x + nx * off, z + nz * off]); }
      }
    }
  }

  // ---------- the dock furniture: bollards, coils of rope and stacked barrels along the river bank ----------
  for (const [i, [x, z]] of WPS([[-48.3, 16.3], [-48.2, 14.4], [-36.9, 18.9], [-38.3, 19.2], [-49.9, 16.4]]).entries()) {
    const bollard = new THREE.Group();
    add(bollard, new THREE.Mesh(new THREE.CylinderGeometry(.15, .19, .52, 10), mat(SOOT)), 0, .26, 0);
    add(bollard, new THREE.Mesh(new THREE.SphereGeometry(.16, 9, 6), mat(SOOT)), 0, .54, 0);
    const b = tryPlace(ctx, bollard, x, z, 0); if (b) b.name = 'dock-bollard';
    if (i % 2 === 0) {
      const coil = new THREE.Group();
      for (let k = 0; k < 3; k++) add(coil, new THREE.Mesh(new THREE.TorusGeometry(.26 - k * .06, .045, 5, 14), mat('#A8925E')), 0, .05 + k * .05, 0).rotation.x = Math.PI / 2;
      const c = tryPlace(ctx, coil, x + .7, z - .5, i); if (c) c.name = 'rope-coil';
    }
  }
  for (const [x, z, rot] of ([[-37.2, 20.4, .2], [-49.9, 15.1, -.3], [-38.6, 20.9, .1]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z), r])) {
    const stack = new THREE.Group();
    for (const [dx, dy, dz] of [[0, 0, 0], [.52, 0, .1], [.26, .46, .05]] as [number, number, number][])
      add(stack, new THREE.Mesh(new THREE.CylinderGeometry(.23, .19, .44, 10), mat(LD.oakSmoke)), dx, dy + .22, dz);
    const s = tryPlace(ctx, stack, x, z, rot); if (s) s.name = 'dock-barrels';
  }
  // A coster's barrow standing at the kerb at each end of the street, and one on the dock road.
  for (const [x, z, rot] of ([[-52.6, -0.2, .1], [-37.6, 3.1, 3.0], [-58.9, 20.4, .3], [-70.6, 10.3, .2]] as [number, number, number][]).map(([x, z, r]) => [...W(x, z), r])) {
    const barrow = tryPlace(ctx, costerBarrow(), x, z, rot); if (barrow) barrow.name = 'coster-barrow';
  }

  // ---------- the street traffic: one 1907 omnibus and two hansom cabs ----------
  // No red bus and no black cab anywhere on this table: both are post-war objects and the blueprint retires
  // them with the old London rectangle. On Whitehall the omnibus and the cabs ran along the palace's front, so
  // they crossed Big Ben's arrival rays on every frame, turned inside one another in a loop too short for
  // three, and filled the tea room's room approach (walkthrough items 17, 22 and 29, 2026-09-23). They now keep
  // to the omnibus terminus at the south foot of Westminster Bridge (LD-TS), a stretch of Borough High Street no
  // stand faces and no room approach looks across: the omnibus and one hansom turn its loop half a lap apart,
  // one on each side of the street, so they meet only side by side on the straight; the second hansom waits at
  // the kerb on the east lane, with its horse to the north. Re-cluster pass (2026-09-23): the terminus is now a
  // widened stretch of the moor road at Westminster's north-east corner, behind the tea room, where no stand's rays
  // or room approach pass.
  // The loop runs 0.2 north of the street's centreline (second walkthrough 60, 2026-09-23), so its south lane
  // keeps 1.4 clear of the omnibus stand's inner rank; the north lane stays on the widened street.
  const ts = road('LD-TS').points, cz = ts[0][1] - .2, WEST = ts[1][0] + .1, EAST = ts[0][0] - .1, SIDE = .62, loop: THREE.Vector3[] = [];
  for (let k = 0; k <= 8; k++) loop.push(new THREE.Vector3(WEST + (EAST - WEST) * k / 8, 0, cz + SIDE));
  for (let k = 1; k < 8; k++) { const a = Math.PI / 2 - Math.PI * k / 8; loop.push(new THREE.Vector3(EAST + Math.cos(a) * SIDE, 0, cz + Math.sin(a) * SIDE)); }
  for (let k = 0; k <= 8; k++) loop.push(new THREE.Vector3(EAST + (WEST - EAST) * k / 8, 0, cz - SIDE));
  for (let k = 1; k < 8; k++) { const a = -Math.PI / 2 - Math.PI * k / 8; loop.push(new THREE.Vector3(WEST + Math.cos(a) * SIDE, 0, cz + Math.sin(a) * SIDE)); }
  const street = new THREE.CatmullRomCurve3(loop, true);
  const streetLength = street.getLength();
  // Each vehicle is set by two points on the loop, its rear axle and its front (the horse, or the omnibus's
  // front wheels), so the whole body follows the curve through the turns.
  const traffic: { v: P; rear: number; reach: number }[] = [
    { v: motorOmnibus(), rear: -1.15, reach: 2.5 }, { v: hansomCab(), rear: 0, reach: 2.0 },
  ];
  traffic.forEach(({ v }) => { group.add(v); v.name = 'street-vehicle'; });
  tickers.push((t, dt) => traffic.forEach(({ v, rear, reach }, i) => {
    const u = (t * .012 + i / traffic.length) % 1;
    const front = street.getPointAt(u), back = street.getPointAt(((u - reach / streetLength) % 1 + 1) % 1);
    const dx = front.x - back.x, dz = front.z - back.z, l = Math.hypot(dx, dz) || 1;
    v.position.set(back.x - dx / l * rear, TOP + .04, back.z - dz / l * rear);
    v.rotation.y = Math.atan2(dx, dz) - Math.PI / 2;
    v.userData.tick?.(t, dt);
  }));
  { const waiting = hansomCab('#2A2420'); waiting.name = 'street-vehicle'; group.add(waiting);
    // on the east lane between the tea room and the mushroom wood, clear of the loop's east turn
    const [wx, wz] = W(-53.4, -6.0); waiting.position.set(wx, TOP + .04, wz); waiting.rotation.y = Math.PI / 2; tickers.push((t, dt) => waiting.userData.tick?.(t, dt)); }

  // ---------- five peopled lanes, twenty residents, one leading a pit pony round the dale yard ----------
  for (const lane of LD_LANES) {
    const lift = londonBridgeLift(lane);
    const dx = lane.to[0] - lane.from[0], dz = lane.to[1] - lane.from[1], len = Math.hypot(dx, dz) || 1, nx = -dz / len, nz = dx / len;
    for (let i = 0; i < lane.walkers; i++) {
      const seed = lane.seed + i * 3;
      const p = londonResident(seed);
      p.name = 'britain-walker'; p.userData.lane = lane.id; group.add(p);
      if (lane.id === PONY_LANE) {
        // The dale yard: the handler leads the pit pony round the ring at a steady walk, halting twice a lap.
        const ring = road('LD-YD').points.slice(0, -1);
        const curve = new THREE.CatmullRomCurve3(ring.map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
        tickers.push(ringWalk(p, curve, lane.pace));
        const pony = pitPony(); pony.name = 'britain-pony'; group.add(pony);
        tickers.push(ringPony(pony, p, curve, group));
        continue;
      }
      const off = lane.strips ? lane.strips[i % lane.strips.length] : 0;
      const from: Pt = [lane.from[0] + nx * off, lane.from[1] + nz * off], to: Pt = [lane.to[0] + nx * off, lane.to[1] + nz * off];
      tickers.push(londonWalk(p, from, to, lane.range, seed + i * 5, lift, lane.pace));
    }
  }

  // ---------- neighbours who stand and talk: the street corner, the market row and the quay ----------
  // A standing figure does not translate, so it does not step. The pair at the fell gate, [-65.5, -13.0], stood
  // inside the walled pen 2.2 behind the palace and drew on its roof from the arrival camera (second walkthrough
  // 56, 2026-09-23); the pen is gone from there, and so is the pair.
  for (const [i, [x, z, n]] of ([[-58.4, -9.5, 2], [-52.8, 1.8, 2], [-37.3, 2.9, 2]] as [number, number, number][]).map(([x, z, k]) => [...W(x, z), k]).entries()) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i;
      const nx = x + Math.cos(a) * .55, nz = z + Math.sin(a) * .55;
      if (inRoomApproach(new THREE.Box3(new THREE.Vector3(nx - .25, 0, nz - .25), new THREE.Vector3(nx + .25, 1.3, nz + .25)))) continue;
      const neighbour = place(londonResident(60 + i * 3 + k), nx, nz, -a - Math.PI / 2);
      neighbour.name = 'britain-neighbour';
    }
  }
}
