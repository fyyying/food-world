/** The six Vietnamese clusters as built ground: the thirteen road ribbons of the fixed blueprint, the paving
 *  under the densest streets, the three bridges, the six decorative houses at their fixed coordinates, the
 *  four peopled walker loops with their shoulder poles, carts and bicycles, and the boats working the rivers
 *  and the delta channels. Positions live here; the shapes come from `vietnam-architecture.ts`.
 *
 *  There is no motorbike anywhere in Vietnam: the `motorbikes` object keeps its id and is the street carriers'
 *  stand, and the old circular Hanoi ring road went with the table growth.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { handcart, bicycle, sampanTied } from './props-vietnam';
import { VN, vietnamHouse, woodenBridge, type VietnamStyle } from './vietnam-architecture';
import { vietnamResident, vietnamWalk } from './vietnam-people';
import {
  VN_ROADS, VN_BRIDGES, BRIDGE_SPAN, ROAD_LIFT, RED_RIVER_CURVE, CHANNEL_CURVES, RIVER_Y, CHANNEL_Y,
  freeGround, roadDistance, type Pt,
} from './vietnam-landscape';
import type { LayoutCtx } from './worldkit';

export const ROAD_Y = .036, PAVING_Y = .018;
export const BRIDGE_DECK_Y = ROAD_LIFT;

/** A straight walking segment cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the resident: 0 the Hanoi vendor with her shoulder pole, 1 the northern farmer, 2 the Huế
 *  woman with her tray, 3 the Hội An porter and his jar, 4 the Saigon worker wheeling a bicycle, 5 the Chợ Lớn
 *  merchant, 6 the delta woman with her fish basket, and every thirteenth seed a child. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number };
const road = (id: string) => VN_ROADS.find(r => r.id === id)!;
function segments(id: string, first: number, last: number, walkers: number[], seeds: number[]): Lane[] {
  const r = road(id);
  return r.points.slice(first + 1, last + 1).map((to, i) => ({
    id: `${id}-${first + i}`, from: r.points[first + i], to, range: [.07, .93] as [number, number],
    walkers: walkers[i], seed: seeds[i],
  }));
}
/** The four loops of the blueprint, in its own order: the guild street, the Red River road and the lotus lane,
 *  the Hội An quay, the delta lane and the fish-basket path over its bridge. */
export const VN_LANES: Lane[] = [
  // The guild street: six residents, three with a shoulder pole and one wheeling a bicycle.
  ...segments('VN-R1', 0, 4, [2, 1, 2, 1], [0, 7, 14, 4]),
  // The Red River road and the lotus lane: five, one with a tray of green rice.
  ...segments('VN-R2', 0, 4, [1, 1, 1, 1], [2, 1, 5, 6]),
  ...segments('VN-R2b', 0, 2, [1, 0], [16, 0]).filter(l => l.walkers > 0),
  // The Hội An quay: five, two porters rolling a jar from the threshold to the quay.
  ...segments('VN-R4', 1, 5, [1, 1, 1, 1], [3, 10, 1, 5]),
  ...segments('VN-R4b', 0, 2, [1, 0], [6, 0]).filter(l => l.walkers > 0),
  // The delta lane and the fish-basket path over its bridge: four plus the two on the path.
  ...segments('VN-R7', 0, 4, [1, 1, 1, 1], [6, 1, 5, 18]),
  ...segments('VN-R7b', 0, 2, [1, 1], [13, 8]),
];

/**
 * Style, position, rotation, width, depth, height, storeys.
 *
 * The blueprint fixes six houses. Four are built. The owner's rule is that every clickable object is fully
 * visible from the arrival camera, and the camera looks from the south, so a house south of a stand hides it;
 * the ten-ray check in `vietnam-world.mjs` is the measure. Two of the six stand on ground that has no
 * wedge-free spot at all, the same finding Spain's third pass made when it took fourteen houses down to five:
 *
 * - `vn-hue-garden-house` [16, -1.4] covered `hueKitchenVn` on four of ten rays, and its garden wall covered
 *   `banhHueVn` on one. CT1's three stands as built fill x 11 to 23 from z -14.3 to +0.4, the Huế gate holds
 *   the north bank and the road corridor holds the west, so every candidate is either inside a stand, in the
 *   river or in another stand's wedge. Removed, with its wall.
 * - `vn-cholon-row` [18.4, 20.2] covered `banhMi` and `huTieuVn` on six of ten rays each. Bến Thành's own
 *   footprint runs x 8.6 to 19.0 and z 13.7 to 21.4, and the south coast is at z 21.6 to 19.5 across the rest
 *   of SG1, so there is no ground on the street's seaward side outside every wedge. Removed.
 * - `vn-hoian-front` [25, 1] covered `caoLauVn` on five of ten rays and moved to [18.8, 8.2], the open ground
 *   inland of the quay where it is behind nothing.
 *
 * What is left keeps 2.5 from every clickable anchor, stays out of every road corridor and out of the water.
 */
export const VN_HOUSES: [string, VietnamStyle, number, number, number, number, number, number, number][] = [
  // A terrace of three narrow ochre fronts north of the guild street; it is one building and counts as one.
  ['vn-tube-terrace', 'tube', -9.6, -22.2, .05, 1.5, 2.0, 2.4, 2],
  // The Red River craft house: low, tiled, bamboo-screened, at the cluster's south-east edge.
  ['vn-courtyard-house', 'courtyard', 13.2, -19.4, -.15, 2.2, 1.9, 2.4, 1],
  // A Hội An shopfront inland of the quay, shutters to the street; moved off caoLauVn's camera side.
  ['vn-hoian-front', 'hoiAn', 18.8, 8.2, -.15, 3.0, 2.2, 2.05, 2],
  // The delta house on its posts, on dry ground above the channel.
  ['vn-stilt-house', 'stilt', -0.8, 9.6, -.1, 2.1, 1.7, 2.2, 1],
];

/** A road ribbon: one mesh per route, above the paving and marked so it wins the depth test. */
function ribbon(points: Pt[], width: number, color: string, y: number): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, y, z)));
  const steps = points.length * 12, pts = curve.getSpacedPoints(steps), pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = pts[i], tg = curve.getTangentAt(i / steps);
    const side = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, y, p.z - side.z, p.x + side.x, y, p.z + side.z);
    if (i < steps) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat(color, { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  m.receiveShadow = true; return m;
}
function slab(x: number, z: number, w: number, d: number, color: string, y: number, name: string): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; m.name = name; return m;
}

/** How far a walker is raised while it is on a bridge deck, and the ramp at each end. */
function bridgeLift(lane: Lane): ((u: number) => number) | undefined {
  const dx = lane.to[0] - lane.from[0], dz = lane.to[1] - lane.from[1], length = Math.hypot(dx, dz) || 1;
  for (const [bx, bz] of VN_BRIDGES) {
    const t = ((bx - lane.from[0]) * dx + (bz - lane.from[1]) * dz) / (length * length);
    if (t < 0 || t > 1) continue;
    if (Math.hypot(lane.from[0] + dx * t - bx, lane.from[1] + dz * t - bz) > 1.4) continue;
    const half = BRIDGE_SPAN / 2 / length, ramp = .9 / length;
    return (u: number) => {
      const d = Math.abs(u - t);
      return d <= half ? BRIDGE_DECK_Y : d >= half + ramp ? 0 : BRIDGE_DECK_Y * (1 - (d - half) / ramp);
    };
  }
  return undefined;
}

export function vietnamTown(ctx: LayoutCtx) {
  const { group, place, tickers, TOP } = ctx;

  // ---------- paving under the densest clusters, then the lanes on top of it ----------
  group.add(slab(-4.2, -18.2, 13, 4.4, '#CFC4A6', PAVING_Y, 'guild-street-paving'));
  group.add(slab(18.2, 14.6, 9.6, 7.2, '#CFC4A6', PAVING_Y, 'saigon-street-paving'));
  group.add(slab(29.2, -1.2, 6.4, 5.4, '#D6CCB2', PAVING_Y, 'hoi-an-quay-paving'));
  group.add(slab(17.2, -5.6, 5.6, 3.2, '#D2C8AE', PAVING_Y, 'hue-veranda-paving'));
  // Each route sits a little above the last: two ribbons at one height z-fight where they cross.
  for (const [i, r] of VN_ROADS.entries()) {
    const strip = ribbon(r.points, r.width, r.width >= 2.2 ? '#CDBB94' : '#D2C3A2', ROAD_Y + i * .004);
    strip.name = 'vietnamese-road'; strip.userData.road = r.id; group.add(strip);
  }

  // ---------- the three bridges, square to the water they cross ----------
  // The north bank path crosses the Red River, the quay road crosses the Perfume, the fish-basket path crosses
  // Mekong channel A. Each deck lies along its own lane, so it is turned to the lane's direction.
  // Each deck lies along its own lane: the turn is read off the road that passes through the deck centre, so
  // the bridge always spans square to the water instead of at a hand-written angle.
  for (const [x, z] of VN_BRIDGES) {
    let best = null, bd = 1e9;
    for (const r of VN_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
      const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1];
      const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
      const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
      const d = Math.hypot(x - ax - ex * t, z - az - ez * t);
      if (d < bd) { bd = d; best = [ex, ez]; }
    }
    const deck = place(woodenBridge(BRIDGE_SPAN, BRIDGE_DECK_Y), x, z, -Math.atan2(best![1], best![0]));
    deck.name = 'vietnamese-bridge';
  }

  // ---------- the six decorative houses ----------
  for (const [id, style, x, z, rot, w, d, h, storeys] of VN_HOUSES) {
    const house = place(vietnamHouse(style, w, d, h, { storeys, fronts: id === 'vn-tube-terrace' ? 3 : 1 }), x, z, rot);
    house.name = 'vietnamese-house'; house.userData.houseId = id;
  }

  // ---------- the street carriers: the vehicles that replaced the motorbike ring ----------
  // Two handcarts and two bicycles stand where a cart really stands: beside the lane, not on it. The spots are
  // searched rather than written down, because the guild street is dense and a hand-written pair landed on the
  // centreline of VN-R1b and VN-R2.
  const parked: Pt[] = [];
  for (let x = -11; x <= 22 && parked.length < 6; x += .5) for (let z = -22; z <= 17 && parked.length < 6; z += .5) {
    const lane = roadDistance(x, z);
    if (lane < 1.5 || lane > 2.6) continue;                       // beside the lane, within reach of it
    if (!freeGround(x, z, 4.4, 1.5, 1.0)) continue;
    if (parked.some(([px, pz]) => Math.hypot(px - x, pz - z) < 7)) continue;
    parked.push([x, z]);
  }
  for (const [i, [x, z]] of parked.entries()) {
    const rot = (i * 1.7) % Math.PI - .8;
    if (i % 2 === 0) { const cart = place(handcart(i ? '#E0842C' : '#7FBF5A'), x, z, rot); cart.name = 'street-handcart'; tickers.push(cart.userData.tick!); }
    else place(bicycle(), x, z, rot).name = 'street-bicycle';
  }
  for (const [i, [x, z]] of ([[-8.2, -17.2], [20.6, 16.2]] as Pt[]).entries()) {
    if (!freeGround(x, z, 2.6, 1.3, .6)) continue;
    const stack = new THREE.Group(); stack.name = 'basket-stack'; stack.position.set(x, 0, z); group.add(stack);
    for (let k = 0; k < 3; k++) add(stack, new THREE.Mesh(new THREE.CylinderGeometry(.26 - k * .02, .21, .18, 10), mat(k % 2 ? '#C9B06A' : '#B79E62')), (k % 2) * .05, .09 + k * .17, (i ? -1 : 1) * (k % 2) * .05);
  }

  // ---------- boats: sampans working the Red River and the delta channels ----------
  // They are on the water, which is where a boat belongs; nothing else Vietnamese touches it.
  const boats: [P, THREE.CatmullRomCurve3, number, number, number][] = [];
  for (const [i, [curve, y, speed, from, to]] of ([
    [RED_RIVER_CURVE, RIVER_Y, .012, .3, .72],
    [RED_RIVER_CURVE, RIVER_Y, .009, .45, .86],
    [CHANNEL_CURVES.a, CHANNEL_Y, .014, .18, .78],
    [CHANNEL_CURVES.c, CHANNEL_Y, .016, .2, .8],
  ] as [THREE.CatmullRomCurve3, number, number, number, number][]).entries()) {
    const boat = sampanTied(); boat.name = 'vietnamese-sampan'; boat.scale.setScalar(.95 + (i % 2) * .12); group.add(boat);
    boats.push([boat, curve, speed, from, to]);
  }
  tickers.push((t, dt) => {
    for (const [i, [boat, curve, speed, from, to]] of boats.entries()) {
      const raw = (t * speed + i * .37) % 2, swing = raw < 1 ? raw : 2 - raw;
      const u = from + (to - from) * swing;
      const p = curve.getPointAt(u), ahead = curve.getPointAt(Math.min(.999, Math.max(.001, u + (raw < 1 ? .006 : -.006))));
      boat.position.set(p.x, TOP + (i < 2 ? RIVER_Y : CHANNEL_Y) + .02, p.z);
      boat.rotation.y = Math.atan2(ahead.x - p.x, ahead.z - p.z) - Math.PI / 2;
      boat.userData.tick?.(t, dt);
    }
  });

  // ---------- the four walker loops ----------
  for (const lane of VN_LANES) {
    const lift = bridgeLift(lane);
    for (let i = 0; i < lane.walkers; i++) {
      const seed = lane.seed + i;                     // the second walker on a segment is a different profile
      const walker = vietnamResident(seed);
      walker.name = 'vietnamese-walker'; walker.userData.lane = lane.id; group.add(walker);
      tickers.push(vietnamWalk(walker, lane.from, lane.to, lane.range, seed + i * 5, lift));
    }
  }
  // Neighbours who stand and talk where the clusters meet: the lake shore, the craft courtyard, the quay, the
  // Saigon street corner and the delta landing. They stand still, so they do not step.
  for (const [i, [x, z, n]] of ([[-5.4, -18.4, 2], [7.4, -14.6, 2], [30.2, -3.6, 2], [21.2, 15.4, 3], [-3.4, 14.6, 2]] as [number, number, number][]).entries()) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i;
      const neighbour = place(vietnamResident(40 + i * 3 + k, true), x + Math.cos(a) * .58, z + Math.sin(a) * .58, -a - Math.PI / 2);
      neighbour.name = 'vietnamese-neighbour';
    }
  }
}
