/** The British clusters as they are built: the road ribbons drawn from the road table, the Westminster street
 *  paving, the five decorative houses, Westminster Bridge, the 1907 motor omnibus and the two hansom cabs on
 *  the street, the gas standards, the dock furniture and the four peopled walker loops with the pit pony.
 *
 *  The road, bridge and lane tables live in `london-landscape.ts`, because the countryside is cut round them;
 *  they are re-exported here so a caller may import them from either file, in the shape `spain-town.ts` uses.
 *
 *  Tower Bridge is **not** built here. It is the clickable landmark `towerBridge` at [-39.4, 3.9] and its
 *  geometry is the Stand maker's `towerBridge` prop in `props-london.ts`; building a second one over it would
 *  put two bascule bridges in one place. Both deck centres are in `LD_BRIDGES` and in the `decks` table of
 *  `world-ceurope.ts` all the same, so anything crossing either one rides up onto it.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';
import { LD, ukHouse, gasLamp, type UkStyle } from './london-architecture';
import { londonResident, londonWalk, pitPony, followPony } from './london-people';
import {
  LD_ROADS, LD_CROSSINGS, LD_BRIDGES, LD_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y, PONY_LANE,
  tryPlace, placeBuilding, isWet, type Lane, type Pt, type Road,
} from './london-landscape';
import { LONDON_OBJECTS } from './london-objects';
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
  ['westminster-paving', -51, -5.2, 14.0, 4.2, '#b8b4ad'],
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
    if (Math.abs(z) >= 27.6 || x <= -81.6) continue;                             // the road leaves the table
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

/** Style, footprint, storeys and candidate spots. The blueprint fixes five decorative houses in the whole of
 *  Britain, one per cluster and none in the West Country, each a 1.5-radius blocker.
 *
 *  None of the five blueprint coordinates survives the built stands. The paper check used 1.5-radius discs;
 *  the stands in `props-london.ts` are four to ten units across, and `main.ts` looks at the table from the
 *  south, so a house at a larger z than a stand is between the visitor and it. Each list starts at the
 *  blueprint coordinate, so a house returns there by itself if that ground is ever freed, and then gives the
 *  nearest spot that passes every rule — dry, off every road, clear of every stand's 6 x 5 pad and 2.5
 *  approach, and first on none of the ten arrival rays of any stand (`placeBuilding`):
 *
 *  - `uk-westminster-terrace` [-53, -9.6] to [-51, -11.5], 2.8: on the tea room's and the pastry board's pads
 *  - `uk-dock-warehouse` [-41, 12.4] to [-48, 8], 8.3: at the blueprint spot it covered the pie shop and the
 *    coffee stall; the Docks, the dock road and the estuary leave no dry ground behind the three shops, so the
 *    warehouse stands on the river bank west of the bridge road, the nearest ground where it hides nobody.
 *    [-48.5, 12], 7.5, also passes and was tried first: from the camera it stacked behind the Kentish cottage
 *    into one tower
 *  - `uk-kentish-cottage` [-48.2, 16.2] to [-51, 15], 3.0: its box was on the hop road's corridor, and 0.8 away
 *    it lined up with the warehouse on the camera's axis
 *  - `uk-dale-farmhouse` [-60.8, -16] to [-59.5, -16.5], 1.4: its barn end was on the flock's pad
 *  - `uk-fife-cottage` [-64, -19] to [-71.5, -24.5], 9.3: in front of the distillery and the smokehouse at the
 *    blueprint spot; the nearest clear ground inside the Firths is 3 from the dale farmhouse and they collide,
 *    so it stands at the west end of the herring coast, behind the meal mill
 */
const HOUSES: { id: string; style: UkStyle; w: number; d: number; h: number; storeys?: number; spots: [number, number, number][] }[] = [
  { id: 'uk-westminster-terrace', style: 'londonTerrace', w: 4.0, d: 1.8, h: 1.45, storeys: 3,
    spots: [[-53, -9.6, 0], [-51, -11.5, 0], [-51, -12, 0], [-50.5, -11.5, 0], [-47.5, -13.5, 0]] },
  { id: 'uk-dock-warehouse', style: 'dockWarehouse', w: 3.0, d: 2.0, h: 1.25, storeys: 4,
    spots: [[-41, 12.4, 0], [-48, 8, 0], [-48.5, 8, 0], [-50.5, 12, 0], [-48.5, 12, 0]] },
  { id: 'uk-kentish-cottage', style: 'kentishCottage', w: 2.8, d: 2.0, h: 1.15, storeys: 2,
    spots: [[-48.2, 16.2, 0], [-51, 15, 0], [-50.5, 15.5, 0], [-51, 15.5, 0], [-48.5, 15.5, 0]] },
  { id: 'uk-dale-farmhouse', style: 'daleFarm', w: 2.4, d: 1.9, h: 1.9,
    spots: [[-60.8, -16, 0], [-59.5, -16.5, 0], [-64, -12.5, 0], [-64, -12, 0]] },
  { id: 'uk-fife-cottage', style: 'fifeCottage', w: 2.4, d: 1.8, h: 1.8,
    spots: [[-64, -19, 0], [-71.5, -24.5, 0], [-72, -24.5, 0], [-72.5, -24, 0]] },
];

/** Where a gas standard may stand. Each is tried in turn and dropped if it would crowd a clickable, stand on
 *  a lane or reach into the water; a lamp is under .6 across, so it blocks nothing at this camera pitch. */
const LAMPS: [number, number][] = [
  [-57.9, -5.05], [-45.0, -4.95], [-45.6, .4], [-45.6, 5.0], [-43.0, 6.5], [-46.4, -3.0],
  [-60.4, -6.6], [-53.6, -20.0], [-66.8, -8.2], [-75.4, 5.0], [-43.4, 19.0], [-58.6, -7.6],
  [-60.2, -4.2], [-43.2, -3.0], [-45.4, -.6], [-45.4, 1.2], [-42.9, 5.6], [-45.4, 8.4], [-46.4, 12.6],
  [-46.4, 17.4], [-61.4, -8.9], [-58.4, -12.4], [-60.6, -18.2], [-63.4, -21.0], [-67.4, -21.4], [-70.2, -9.9],
  [-76.8, -8.0], [-79.0, -2.0], [-76.4, 4.4], [-72.8, 11.8], [-66.4, 14.4],
];

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

  // ---------- gas standards on the street, the bridge road and the dock road ----------
  for (const [i, [x, z]] of LAMPS.entries()) {
    const lamp = tryPlace(ctx, gasLamp(2.5 + (i % 2) * .2), x, z, i * .7);
    if (lamp) lamp.name = 'gas-lamp';
  }

  // ---------- the dock furniture: bollards, coils of rope and stacked barrels along the river bank ----------
  for (const [i, [x, z]] of ([[-43.4, 6.2], [-41.6, 6.2], [-39.8, 6.4], [-38.2, 6.8], [-36.9, 7.2]] as [number, number][]).entries()) {
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
  for (const [x, z, rot] of [[-42.2, 6.4, .2], [-40.5, 6.9, -.3], [-37.8, 6.1, .1]] as [number, number, number][]) {
    const stack = new THREE.Group();
    for (const [dx, dy, dz] of [[0, 0, 0], [.52, 0, .1], [.26, .46, .05]] as [number, number, number][])
      add(stack, new THREE.Mesh(new THREE.CylinderGeometry(.23, .19, .44, 10), mat(LD.oakSmoke)), dx, dy + .22, dz);
    const s = tryPlace(ctx, stack, x, z, rot); if (s) s.name = 'dock-barrels';
  }
  // A coster's barrow standing at the kerb at each end of the street, and one on the dock road.
  for (const [x, z, rot] of [[-58.4, -4.1, .1], [-44.9, -6.3, 3.0], [-43.8, 6.7, .3]] as [number, number, number][]) {
    const barrow = tryPlace(ctx, costerBarrow(), x, z, rot); if (barrow) barrow.name = 'coster-barrow';
  }

  // ---------- the traffic on the Westminster street: one 1907 omnibus and two hansom cabs ----------
  // No red bus and no black cab anywhere on this table: both are post-war objects and the blueprint retires
  // them with the old London rectangle. The street is 2.4 wide and the walkers keep to its crown, so the
  // vehicles, a unit wide, run 0.85 either side of it on the paving's edge and turn at the two junctions past the walkers' ends.
  // All three run at one speed a third of the loop apart, so none ever overtakes another.
  // The loop: the north lane east-bound, a half circle round the Strand junction, the south lane
  // back, a half circle in front of the palace. Each lane follows the street's own centreline, so it bends
  // where the street bends, and the two turns lie past the ends of the walkers' own stretch.
  const crown = (x: number) => {
    const pts = LD_ROADS[0].points;
    for (let i = 0; i < pts.length - 1; i++) { const [ax, az] = pts[i], [bx, bz] = pts[i + 1]; if ((x - ax) * (x - bx) <= 0) return az + (bz - az) * (x - ax) / ((bx - ax) || 1); }
    return pts[0][1];
  };
  const WEST = -58.9, EAST = -44.0, SIDE = .85, loop: THREE.Vector3[] = [];
  for (let k = 0; k <= 12; k++) { const x = WEST + (EAST - WEST) * k / 12; loop.push(new THREE.Vector3(x, 0, crown(x) - SIDE)); }
  for (let k = 1; k < 8; k++) { const a = -Math.PI / 2 + Math.PI * k / 8; loop.push(new THREE.Vector3(EAST + Math.cos(a) * SIDE, 0, crown(EAST) + Math.sin(a) * SIDE)); }
  for (let k = 0; k <= 12; k++) { const x = EAST + (WEST - EAST) * k / 12; loop.push(new THREE.Vector3(x, 0, crown(x) + SIDE)); }
  for (let k = 1; k < 8; k++) { const a = Math.PI / 2 + Math.PI * k / 8; loop.push(new THREE.Vector3(WEST + Math.cos(a) * SIDE, 0, crown(WEST) + Math.sin(a) * SIDE)); }
  const street = new THREE.CatmullRomCurve3(loop, true);
  const streetLength = street.getLength();
  // Each vehicle is set by two points on the loop, its rear axle and its front (the horse, or the omnibus's
  // front wheels), so the whole body follows the curve through the turns instead of its nose swinging out
  // across the walkers on the crown.
  const traffic: { v: P; rear: number; reach: number }[] = [
    { v: motorOmnibus(), rear: -1.15, reach: 2.5 }, { v: hansomCab(), rear: 0, reach: 2.0 }, { v: hansomCab('#2A2420'), rear: 0, reach: 2.0 },
  ];
  traffic.forEach(({ v }) => { group.add(v); v.name = 'street-vehicle'; });
  tickers.push((t, dt) => traffic.forEach(({ v, rear, reach }, i) => {
    const u = (t * .011 + i / traffic.length) % 1;
    const front = street.getPointAt(u), back = street.getPointAt(((u - reach / streetLength) % 1 + 1) % 1);
    const dx = front.x - back.x, dz = front.z - back.z, l = Math.hypot(dx, dz) || 1;
    v.position.set(back.x - dx / l * rear, TOP + .04, back.z - dz / l * rear);
    v.rotation.y = Math.atan2(dx, dz) - Math.PI / 2;
    v.userData.tick?.(t, dt);
  }));

  // ---------- four peopled loops, twenty residents, one leading a pit pony up the dale ----------
  const led: [P, P][] = [];
  for (const lane of LD_LANES) {
    const lift = londonBridgeLift(lane);
    for (let i = 0; i < lane.walkers; i++) {
      const seed = lane.seed + i * 3;
      const p = londonResident(seed);
      p.name = 'britain-walker'; p.userData.lane = lane.id; group.add(p);
      tickers.push(londonWalk(p, lane.from, lane.to, lane.range, seed + i * 5, lift, lane.pace));
      if (lane.id === PONY_LANE && i === 0) { const pony = pitPony(); pony.name = 'britain-pony'; group.add(pony); led.push([pony, p]); }
    }
  }
  for (const [pony, handler] of led) tickers.push(followPony(pony, handler, group));

  // ---------- neighbours who stand and talk: the street corner, the market row, the quay and the fell gate ----------
  // A standing figure does not translate, so it does not step.
  for (const [i, [x, z, n]] of ([[-57.4, -6.4, 2], [-49.9, -5.9, 2], [-43.5, 8.9, 2], [-57.9, -18.0, 2], [-67.2, 11.6, 2], [-68.5, -22.0, 2]] as [number, number, number][]).entries()) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i;
      const neighbour = place(londonResident(60 + i * 3 + k), x + Math.cos(a) * .55, z + Math.sin(a) * .55, -a - Math.PI / 2);
      neighbour.name = 'britain-neighbour';
    }
  }
}
