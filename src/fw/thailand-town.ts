/** The Thai clusters as they are built: the road ribbons drawn from the road table, the five decorative
 *  houses at their fixed coordinates, the four bridges, the rickshaws and the ox cart on the old-city street,
 *  the paddled boats on the khlongs, the landing stages and the spirit houses.
 *
 *  The road, bridge and lane tables themselves live in `thailand-landscape.ts`, because the paddy grid is cut
 *  round them; they are re-exported here so a caller may import them from either file, in the shape
 *  `spain-town.ts` uses.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';
import { TH, thaiHouse, spiritHouse, landingStage, salaPavilion, watChedi, type ThaiStyle } from './thailand-architecture';
import { thailandResident } from './thailand-people';
import {
  TH_ROADS, TH_CROSSINGS, TH_BRIDGES, TH_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y, ROAD_LIFT, KHLONGS, KHLONG_WIDTH,
  BASIN, tryPlace, tryPlaceAny, type Lane, type Pt, type Road,
} from './thailand-landscape';
import type { LayoutCtx } from './worldkit';

export { TH_ROADS, TH_BRIDGES, TH_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y, type Lane, type Road };
/** Paving heights: the town slabs sit under every road ribbon, and each ribbon a hair above the last. */
export const ROAD_Y = .036, PAVING_Y = .018;
const PLANK = '#8A6338';

/** How far a walker is raised while it is on a bridge deck, and the ramp at each end. Each crossing carries
 *  its own span, so a walker steps up onto the short khlong decks and the long river deck alike. */
export function thaiBridgeLift(lane: Lane): ((u: number) => number) | undefined {
  const dx = lane.to[0] - lane.from[0], dz = lane.to[1] - lane.from[1], length = Math.hypot(dx, dz) || 1;
  for (const crossing of TH_CROSSINGS) {
    const [bx, bz] = crossing.at;
    const t = ((bx - lane.from[0]) * dx + (bz - lane.from[1]) * dz) / (length * length);
    if (t < 0 || t > 1) continue;
    const off = Math.hypot(lane.from[0] + dx * t - bx, lane.from[1] + dz * t - bz);
    if (off > 1.2) continue;
    const half = crossing.span / 2 / length, ramp = .8 / length;
    return (u: number) => {
      const d = Math.abs(u - t);
      return d > half ? 0 : d < half - ramp ? BRIDGE_DECK_Y : BRIDGE_DECK_Y * (half - d) / ramp;
    };
  }
  return undefined;
}

/** A road ribbon: one mesh per route, above the paving and marked so it wins the depth test. */
function ribbon(points: Pt[], width: number, color: string, y: number): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, y, z)));
  const steps = points.length * 10, pts = curve.getSpacedPoints(steps), pos: number[] = [], idx: number[] = [];
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
/** A flat quadrilateral at a fixed height: the swept earth of a cluster under its roads. */
function slab(x: number, z: number, w: number, d: number, color: string, y: number, name: string): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; m.name = name; return m;
}

/** A timber crossing at the road height: the deck clears the water and lands on a stone abutment on each
 *  bank, so a walker steps up ROAD_LIFT and comes down again instead of wading. */
function woodenCrossing(len: number, deckWidth = 1.9): P {
  const g = new THREE.Group(), deckTop = BRIDGE_DECK_Y;
  for (const x of [-len / 2 + .35, len / 2 - .35]) add(g, block(1.1, deckTop - .1, deckWidth + .2, TH.limestoneGrey), x, (deckTop - .1) / 2, 0);
  add(g, block(len, .1, deckWidth, PLANK), 0, deckTop - .05, 0);
  const planks = Math.max(6, Math.round(len * 1.6));
  for (let i = 0; i < planks; i++) add(g, block(.09, .04, deckWidth, '#6B4A30'), -len / 2 + .3 + i * (len - .6) / (planks - 1), deckTop + .02, 0);
  for (const z of [-deckWidth / 2 + .03, deckWidth / 2 - .03]) {
    add(g, block(len, .07, .07, TH.teakDark), 0, deckTop + .56, z);
    for (let i = 0; i <= 4; i++) add(g, block(.09, .52, .09, TH.teakDark), -len / 2 + .2 + i * (len - .4) / 4, deckTop + .30, z);
  }
  // The ramp onto the lane sits just outside the deck, not a whole deck-length away: three khlong crossings
  // stand three and a half apart and a long ramp turns them into one boardwalk. It is set 0.03 further out
  // than it was: the ramp and the deck are the same width, so their long side faces lie in one plane, and a
  // ramp that tucked 25 mm under the deck end left a z-fighting sliver there (`coplanarOverlaps` in
  // thailand-world.mjs). At 0.23 the ramp meets the deck end instead of overlapping it.
  for (const x of [-len / 2, len / 2]) add(g, block(.44, .1, deckWidth, '#B7A986'), x + (x > 0 ? .23 : -.23), deckTop - .05, 0).rotation.z = x > 0 ? -.16 : .16;
  return masonry(g) as P;
}

/** A khlong sampan: a shallow hull with a standing paddler and a load of produce, poled along a canal. */
function khlongSampan(colour = '#7FB069'): P {
  const g = new THREE.Group();
  add(g, block(2.2, .26, .68, TH.teakDark), 0, .13, 0);
  add(g, block(2.0, .05, .62, PLANK), 0, .27, 0);
  for (const x of [-1.1, 1.1]) add(g, new THREE.Mesh(new THREE.ConeGeometry(.34, .5, 6), mat(TH.teakDark)), x, .15, 0).rotation.z = x < 0 ? Math.PI / 2 : -Math.PI / 2;
  for (let k = 0; k < 5; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.11, 7, 6), mat([colour, '#E8563F', '#E0A52C', '#8FC26A', '#F2E0A0'][k])), -.45 + (k % 3) * .35, .36, -.14 + Math.floor(k / 3) * .3);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .18, 9), mat(TH.bambooPale)), .55, .38, .05);
  const pole = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 2.4, 5), mat(TH.bambooPale)), -.62, .9, .22);
  pole.rotation.z = .42; pole.rotation.x = .16;
  const sampan = g as P; sampan.userData.pole = pole;
  return sampan;
}

/** Decorative houses: style, position, rotation, footprint and storeys. The blueprint caps the area at five,
 *  one per cluster; four stand, and every coordinate moved.
 *
 *  Why. The blueprint's paper check treats a decorative house as a 1.5-radius blocker, so it asks for 2.5 of
 *  clear ground between the house's centre and a clickable object's. What the corridor rule actually measures
 *  is the *box* a house occupies against the object's 6 x 5 pad, and a Thai house on posts under a deep
 *  overhanging eave is wider than three units however modest its walls are. Each house is therefore built at
 *  2.2 to 2.6 wide instead of 3.0 to 3.8, and each moved off its blueprint coordinate by the smallest step
 *  that clears every pad, every 2.5 corridor, every road centreline and the water:
 *
 *  - `th-khlong-house` [-37, 8.5] to [-33.4, 8.8], 0.4 from the position it already had to take when the quay
 *    moved east out of the mooring basin. Still the stilt house on the bank above the landing stage
 *  - `th-shophouse-row` [-31.8, -11.4] to [-32.6, -12.8], 1.6 south, off the palace kitchen's pad
 *  - `th-isan-house` [-22.5, -23] to [-23.2, -25.7], 2.8 north up the plateau, off the grill's and the jar
 *    yard's pads. It stands on the raised ground, so it is set at the plateau's own height
 *  - `th-kampong-house` [-61, 16.2] to [-61, 9.8], 6.4 south into the coconut groves: the turmeric beds, the
 *    Malay kitchen, the salt pans and the grove itself leave no ground on the Gulf shore outside all four pads
 *  - `th-lanna-house` is **not built**. The Lanna valley holds three stands that are eight to ten units across
 *    within six units of one another, and a search out to eight units from the blueprint coordinate found no
 *    ground at all outside their pads and corridors. Castile kept no house on the Spanish table for the same
 *    reason; `lanna` stays a buildable style in `thailand-architecture.ts` and nothing places one
 */
const HOUSES: { id: string; style: ThaiStyle; x: number; z: number; rot: number; w: number; d: number; h: number; storeys?: number; y?: number }[] = [
  { id: 'th-khlong-house', style: 'central', x: -33.4, z: 8.8, rot: -.35, w: 2.4, d: 1.9, h: 2.0 },
  { id: 'th-shophouse-row', style: 'shophouse', x: -32.6, z: -12.8, rot: .1, w: 4.8, d: 2.0, h: 1.9, storeys: 2 },
  { id: 'th-isan-house', style: 'isan', x: -23.2, z: -25.7, rot: .25, w: 2.2, d: 1.8, h: 1.7, y: .6 },
  { id: 'th-kampong-house', style: 'kampong', x: -61, z: 9.8, rot: .4, w: 2.4, d: 1.9, h: 1.8 },
];

export function thailandTown(ctx: LayoutCtx) {
  const { group, place, tickers, TOP } = ctx;

  // ---------- swept ground under the two paved clusters, then the roads on top of it ----------
  group.add(slab(-31, -4, 15, 11, '#c4bba6', PAVING_Y, 'old-city-paving'));
  group.add(slab(-44.4, 1, 7.5, 13, '#b9a98a', PAVING_Y, 'khlong-quay-paving'));
  for (const [i, r] of TH_ROADS.entries()) {
    const strip = ribbon(r.points, r.width, r.id === 'TH-R3' ? '#cdbb94' : '#d2c3a2', ROAD_Y + i * .004);
    strip.name = 'thai-road'; strip.userData.road = r.id; group.add(strip);
  }

  // ---------- the four crossings: three short decks over the khlongs, one long one over the river ----------
  for (const crossing of TH_CROSSINGS) {
    const r = TH_ROADS.find(x => x.id === crossing.road)!;
    // The deck lies along the road, so it is turned to the direction of the segment it sits on.
    let best = 0, bd = 1e9;
    for (let i = 0; i < r.points.length - 1; i++) {
      const mx = (r.points[i][0] + r.points[i + 1][0]) / 2, mz = (r.points[i][1] + r.points[i + 1][1]) / 2;
      const d = Math.hypot(mx - crossing.at[0], mz - crossing.at[1]);
      if (d < bd) { bd = d; best = i; }
    }
    const dx = r.points[best + 1][0] - r.points[best][0], dz = r.points[best + 1][1] - r.points[best][1], l = Math.hypot(dx, dz) || 1;
    const deck = place(woodenCrossing(crossing.span, r.width + .1), crossing.at[0], crossing.at[1], Math.atan2(-dz / l, dx / l));
    deck.name = 'thai-bridge';
  }

  // ---------- the five decorative houses ----------
  for (const h of HOUSES) {
    const built = place(thaiHouse(h.style, h.w, h.d, h.h, { storeys: h.storeys }), h.x, h.z, h.rot);
    if (h.y) built.position.y = h.y;
    built.name = 'thai-house'; built.userData.houseId = h.id;
  }

  // ---------- the wat's chedi behind the temple, and open salas at the two landings ----------
  // The chedi stands behind the wat rather than in front of it — the camera looks at this table from the
  // south, so "behind" is north — and it is the skyline the old city is read against.
  {
    const chedi = tryPlaceAny(ctx, () => watChedi(5.6), [[-38.6, -13.4, .2], [-34.2, -15.4, .3], [-41.6, -13.8, .1], [-44.6, -12.2, -.2]]);
    if (chedi) chedi.name = 'wat-chedi';
  }
  for (const spots of [
    [[-34.6, 13.8, -.4], [-33.4, 16.2, -.4], [-31.8, 11.4, -.2]],
    [[-50.4, 13.6, 1.3], [-48.6, 11.8, 1.3], [-47.4, 16.4, 1.1]],
    [[-45.4, 18.6, .6], [-43.4, 16.8, .6], [-46.8, 21.4, .4]],
  ] as [number, number, number][][]) {
    const sala = tryPlaceAny(ctx, () => salaPavilion(), spots); if (sala) sala.name = 'thai-sala';
  }

  // ---------- landing stages down the quay, where the boats tie up ----------
  for (const [x, z, rot] of [[-43.2, -2.6, Math.PI / 2], [-39.6, 6.4, Math.PI / 2], [-38.8, 16.4, Math.PI / 2], [-50.6, 3.2, 0], [-40.2, 13.2, Math.PI / 2]] as [number, number, number][]) {
    const stage = tryPlace(ctx, landingStage(2.0), x, z, rot); if (stage) stage.name = 'landing-stage';
  }

  // ---------- a spirit house at every compound, the smallest building on the table ----------
  for (const [x, z, rot] of [[-36.8, -6.2, .3], [-28.6, -3.2, -.4], [-23.4, -21.8, .2], [-59.2, -21.4, .1], [-62.2, 17.4, -.3], [-55.6, -12.8, .5],
    [-34.4, -12.6, .2], [-42.8, -4.6, -.2], [-47.4, 10.6, .4], [-66.6, 6.4, -.3], [-26.8, -16.2, .1], [-63.8, -8.2, .5], [-52.4, 8.4, -.4]] as [number, number, number][]) {
    const shrine = tryPlace(ctx, spiritHouse(), x, z, rot); if (shrine) shrine.name = 'spirit-house';
  }

  // ---------- the old-city street: two pulled rickshaws and an ox cart, at a walking pace ----------
  // The blueprint retires the three decorative `tukTuk()` vehicles, which are a 1960s object; the rickshaw
  // spread to Siam from the 1880s and is in band, and the ox cart was the other way a load moved on a street.
  const street = new THREE.CatmullRomCurve3(
    [[-38.6, -4.6], [-36.2, -8.2], [-33.6, -9], [-30.8, -7.6], [-31.8, -3.8], [-31.4, -.4], [-27.8, .8], [-26, -6.8], [-28.4, -6.8], [-33.6, -9]]
      .map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  const carts = [streetRickshaw(TH.lacquerRed), streetRickshaw(TH.pelangiBlue), streetOxCart()];
  // The crew walks on its own feet: each figure is a top-level resident whose position is set from the cart,
  // so the movement observer in `thailand-people.ts` sees it travel and swings its legs for it.
  const crew = carts.map((_, i) => { const p = thailandResident(31 + i * 5); p.name = 'thai-crew'; group.add(p); return p; });
  carts.forEach(c => { group.add(c); c.name = 'street-vehicle'; });
  tickers.push((t, dt) => carts.forEach((c, i) => {
    const speed = i === 2 ? .0045 : .0075;
    const u = (t * speed + i / carts.length) % 1;
    const p = street.getPointAt(u), n = street.getPointAt((u + .004) % 1);
    const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1, facing = Math.atan2(dx, dz);
    c.position.set(p.x, TOP + .036, p.z);
    c.rotation.y = facing - Math.PI / 2;
    c.userData.tick?.(t, dt);
    // The puller walks between the shafts; the drover walks at the oxen's shoulder, clear of the yoke.
    const ahead = i === 2 ? 3.9 : 1.55, sideways = i === 2 ? .95 : 0;
    crew[i].position.set(p.x + dx / l * ahead - dz / l * sideways, .034, p.z + dz / l * ahead + dx / l * sideways);
    crew[i].rotation.y = facing;
    crew[i].userData.tick?.(t, dt);
  }));

  // ---------- boats on the khlongs: one paddled sampan per canal, poled up and back ----------
  for (const [i, k] of KHLONGS.entries()) {
    const boat = khlongSampan(['#7FB069', '#E0A52C', '#8FC26A', '#E8563F'][i]);
    boat.name = 'khlong-boat'; group.add(boat);
    const a = k.points[0], b = k.points[1];
    // The boat stops short of both ends so its hull never leaves the canal.
    const lo = 1.6 / Math.hypot(b[0] - a[0], b[1] - a[1]), hi = 1 - lo;
    const pole = boat.userData.pole as THREE.Object3D;
    tickers.push(t => {
      const raw = (t * .035 + i * .27) % 2, s = raw < 1 ? raw : 2 - raw;
      const u = lo + (hi - lo) * s;
      boat.position.set(a[0] + (b[0] - a[0]) * u, TOP + .06, a[1] + (b[1] - a[1]) * u);
      boat.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]) - Math.PI / 2 + (raw < 1 ? 0 : Math.PI);
      pole.rotation.z = .42 + Math.sin(t * 1.6 + i) * .26;      // the pole works, so the boat is being moved
      boat.position.y = TOP + .06 + Math.sin(t * .9 + i) * .012;
    });
  }
  // A moored sampan at the basin's western edge, tied up and still.
  const moored = khlongSampan('#E0A52C'); moored.name = 'khlong-boat-moored';
  place(moored, BASIN.x - BASIN.r + .9, BASIN.z - 1.4, .5).position.y = TOP + .06;
  (moored.userData.pole as THREE.Object3D).rotation.z = 1.45;

  void KHLONG_WIDTH; void ROAD_LIFT;
}

/** A pulled rickshaw: two tall wheels, a hooded seat, shafts, and a puller between them who steps as it moves. */
function streetRickshaw(hood = TH.lacquerRed): P {
  const g = new THREE.Group();
  const body = add(g, block(.9, .5, .78, TH.teakDark), 0, .62, 0);
  add(g, block(.86, .06, .7, PLANK), 0, .88, 0);
  add(g, block(.9, .62, .08, hood), 0, 1.16, -.37);
  const canopy = add(g, block(.94, .08, .8, hood), 0, 1.44, -.1); canopy.rotation.x = -.16;
  const wheels: THREE.Mesh[] = [];
  for (const z of [-.5, .5]) {
    const w = add(g, new THREE.Mesh(new THREE.TorusGeometry(.42, .05, 6, 16), mat('#4A3A28')), 0, .45, z);
    for (let i = 0; i < 6; i++) add(w, new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .8, 4), mat('#6B5334')), 0, 0, 0).rotation.z = i * Math.PI / 6;
    wheels.push(w as THREE.Mesh);
  }
  for (const z of [-.3, .3]) { const shaft = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 1.5, 5), mat('#7A5A38')), .82, .8, z); shaft.rotation.z = Math.PI / 2; shaft.rotation.y = z > 0 ? -.06 : .06; }
  const out = g as P;
  out.userData.wheels = wheels;
  let last: THREE.Vector3 | undefined;
  out.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? out.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(out.position);
    for (const w of wheels) w.rotation.z -= moved / .42;   // the wheels turn with the ground they cover
  };
  return out;
}

/** An ox cart: two solid wheels, a plank bed of rice sacks, a yoke and a pair of humped oxen. */
function streetOxCart(): P {
  const g = new THREE.Group();
  add(g, block(1.7, .16, .95, PLANK), 0, .72, 0);
  for (const z of [-.5, .5]) add(g, block(1.7, .34, .07, TH.teakDark), 0, .9, z);
  for (let k = 0; k < 4; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), mat('#D9CFB4')), -.5 + (k % 2) * .55, .94, -.2 + Math.floor(k / 2) * .38).scale.set(1, .72, 1.1);
  const wheels: THREE.Mesh[] = [];
  for (const z of [-.55, .55]) {
    const w = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .1, 14), mat('#6B5334')), -.2, .52, z);
    w.rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) add(w, block(.06, .12, .9, TH.teakDark), 0, 0, 0).rotation.y = i * Math.PI / 4;
    wheels.push(w as THREE.Mesh);
  }
  const pole = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.4, 6), mat('#7A5A38')), 1.1, .68, 0); pole.rotation.z = Math.PI / 2;
  add(g, block(.1, .1, 1.2, TH.teakDark), 2.2, .78, 0);   // the yoke across both necks
  for (const z of [-.42, .42]) {
    const ox = new THREE.Group(); ox.position.set(2.55, 0, z); g.add(ox);
    add(ox, block(1.0, .48, .42, '#8A7454'), 0, .74, 0);
    add(ox, block(.34, .34, .3, '#8A7454'), .62, .82, 0);
    add(ox, block(.34, .16, .1, '#6B5334'), .1, 1.02, 0);
    for (const s of [-1, 1]) add(ox, block(.24, .05, .05, '#C9BFA6'), .62, 1.0, s * .13).rotation.y = s * .5;
    for (const [i, [lx, lz]] of ([[.3, -.14], [.3, .14], [-.3, -.14], [-.3, .14]] as [number, number][]).entries())
      add(ox, block(.1, .5, .1, i < 2 ? '#8A7454' : '#6B5334'), lx, .28, lz);
  }
  const out = g as P;
  let last: THREE.Vector3 | undefined;
  out.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? out.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(out.position);
    for (const w of wheels) w.rotation.z -= moved / .5;
  };
  return out;
}
