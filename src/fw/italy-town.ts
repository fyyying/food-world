/** The Italian clusters as they are built: the ten road ribbons drawn from the road table, the paving under
 *  the three densest streets, the stone bridge over the Tiber, the thirteen decorative houses and the three
 *  buildings that belong to stands, the five boat lanes with their gondolas, sandoli, barges, bragozzi and the
 *  one sailing ferry across the strait, and the five peopled walker loops with the Castelli wine carts, the
 *  Agro mule and the Rialto porters.
 *
 *  The road, bridge, boat-lane and walker-lane tables live in `italy-landscape.ts`, because the countryside
 *  grid is cut round them; they are re-exported here so a caller may import them from either file, in the
 *  shape `spain-town.ts` uses.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';
import { obelisk, fountain, triumphalArch, basilica, treviFountain, baroqueChurch, cafeTables } from './props-italy';
import { ITP, italyBuilding, fornoOvenHouse, casaleByre, tonnaraShed, stoneBridge, latifondoMasseria } from './italy-architecture';
import { italianResident, italyWalk, italyMule, wineCart, followCart, lagoonRower } from './italy-people';
import {
  IT_ROADS, IT_CROSSINGS, IT_BRIDGES, IT_LANES, IT_BOAT_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y,
  CART_LANE, MULE_LANE, IT_HOUSES, IT_STAND_BUILDINGS, tryPlace, tryPlaceAny, occupy, overlapsOccupied, distToRoads, objectDistance, isWet, type Lane, type Pt, type Road,
} from './italy-landscape';
import { ITALY_OBJECTS } from './italy-objects';
import type { LayoutCtx } from './worldkit';

export { IT_ROADS, IT_BRIDGES, IT_LANES, IT_BOAT_LANES, BRIDGE_SPAN, BRIDGE_DECK_Y, IT_HOUSES, IT_STAND_BUILDINGS, type Lane, type Road };
/** Paving heights: the town slabs sit under every road ribbon, and each ribbon a hair above the last. */
export const ROAD_Y = .036, PAVING_Y = .018;

/** The paved squares: name, centre, width, depth, colour. Axis-aligned rectangles, never blobs; each side
 *  lies under a road's own surface or against the front of the buildings it serves, and `italy-world.mjs`
 *  measures every side.
 *  - the piazza street with the market on its south side and the forno and the caffè on its north
 *  - the Rialto fondamenta between the fish market, the osteria and the water
 *  - the Albergheria lane with Ballarò on its north side and the two fry shops on its south */
export const IT_PAVING: [string, number, number, number, number, string][] = [
  ['piazza-paving', -16, -7.4, 23, 5, '#d9cbb0'],
  ['rialto-paving', 27.7, -21.3, 11, 2.8, '#ded3b6'],
  ['albergheria-paving', -8.5, 22.6, 17, 4.4, '#cdbb92'],
];

/** A road ribbon: one mesh per route, above the paving and marked so it wins the depth test. */
function ribbon(points: Pt[], width: number, color: string, y: number): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, y, z)));
  const steps = points.length * 12, pts = curve.getSpacedPoints(steps), pos: number[] = [], idx: number[] = [];
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
 * between them, because each one stops on the junction's centre and their edges are not parallel; the owner
 * saw exactly that in Vietnam where the coast road meets the Saigon street. So a route that ends on another
 * route, on a bridge deck or at a stand's door is carried a little past that point along its own last
 * direction, and the two surfaces overlap instead of meeting. A route that ends at the table edge or on the
 * water is left alone. Nothing here changes the road table; it changes only what is drawn.
 */
function drawnPoints(r: Road): Pt[] {
  const points = r.points.map(p => [...p] as Pt);
  for (const end of [0, 1]) {
    const i = end ? points.length - 1 : 0, j = end ? points.length - 2 : 1;
    const [x, z] = points[i];
    let reach = 0;
    for (const other of IT_ROADS) {
      if (other.id === r.id) continue;
      for (let k = 0; k < other.points.length - 1; k++) {
        const [ax, az] = other.points[k], [bx, bz] = other.points[k + 1];
        const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
        if (Math.hypot(x - ax - ex * t, z - az - ez * t) < 2.4) reach = Math.max(reach, other.width / 2 + .45);
      }
    }
    for (const [bx, bz] of IT_BRIDGES) if (Math.hypot(x - bx, z - bz) < 2.4) reach = Math.max(reach, .8);
    for (const o of ITALY_OBJECTS) if (Math.hypot(x - o.pos[0], z - o.pos[1]) < 2.4) reach = Math.max(reach, .7);
    if (!reach) continue;
    const dx = x - points[j][0], dz = z - points[j][1], len = Math.hypot(dx, dz) || 1;
    points[i] = [x + dx / len * reach, z + dz / len * reach];
  }
  return points;
}

/** A paved surface: an axis-aligned rectangle, never a soft shape. Each side lies under a road or a wall. */
function slab(x: number, z: number, w: number, d: number, color: string, y: number, name: string): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; m.name = name; return m;
}

/** How far a walker is raised while it is on a bridge deck, and the ramp at each end. The Italian decks stand
 *  0.9 above the lane — a stone arch, not a plank — so the ramp is long enough to be walked up. */
export function italyBridgeLift(lane: Lane): ((u: number) => number) | undefined {
  const dx = lane.to[0] - lane.from[0], dz = lane.to[1] - lane.from[1], length = Math.hypot(dx, dz) || 1;
  for (const crossing of IT_CROSSINGS) {
    const [bx, bz] = crossing.at;
    const t = ((bx - lane.from[0]) * dx + (bz - lane.from[1]) * dz) / (length * length);
    if (t < 0 || t > 1) continue;
    if (Math.hypot(lane.from[0] + dx * t - bx, lane.from[1] + dz * t - bz) > 1.4) continue;
    const half = crossing.span / 2 / length, ramp = 1.2 / length;
    return (u: number) => {
      const d = Math.abs(u - t);
      return d <= half ? BRIDGE_DECK_Y : d >= half + ramp ? 0 : BRIDGE_DECK_Y * (1 - (d - half) / ramp);
    };
  }
  return undefined;
}

// ---------------------------------------------------------------------------------------------------------
// The boats. Five lanes, five hulls, and none of them touches a quay.
// ---------------------------------------------------------------------------------------------------------

/** A gondola: a long black asymmetric hull, the curved stern deck the rower stands on, and the iron ferro
 *  with **four teeth**, which is what the old photographs show — not six, and no striped jersey and no boater,
 *  both of which are of the 1950s. */
function gondolaHull(): P {
  const g = new THREE.Group(), black = '#17171A';
  add(g, block(4.6, .30, .62, black), 0, .18, 0);
  add(g, block(4.2, .12, .74, black), 0, .34, 0);
  for (const [i, x] of [-2.3, 2.3].entries()) { const tip = add(g, new THREE.Mesh(new THREE.ConeGeometry(.30, 1.1, 6), mat(black)), x, .26, 0); tip.rotation.z = i ? -Math.PI / 2 : Math.PI / 2; }
  add(g, block(1.2, .05, .66, '#7A5232'), .6, .40, 0);                                  // the stern deck
  add(g, block(.9, .06, .56, '#9C2B23'), -.5, .40, 0);                                  // the passenger's carpet
  for (const z of [-.26, .26]) add(g, block(.8, .22, .05, '#5A3B22'), -.5, .52, z);      // the two low seats
  const ferro = add(g, block(.09, 1.25, .16, '#C9C4BA'), -2.5, .95, 0);
  for (let i = 0; i < 4; i++) add(ferro, block(.30, .07, .13, '#C9C4BA'), .16, .42 - i * .24, 0);
  add(g, block(.09, .7, .12, '#C9C4BA'), 2.42, .66, 0);
  const forcola = add(g, new THREE.Mesh(new THREE.TorusGeometry(.17, .045, 5, 10, Math.PI * 1.3), mat('#8A6D44')), 1.0, .62, .30);
  forcola.rotation.y = Math.PI / 2; forcola.rotation.z = .5;
  const boat = masonry(g) as P; boat.userData.deckY = .45;
  return boat;
}
/** A sandolo: the flat lagoon working boat, lighter and lower than a gondola, rowed standing. */
function sandoloHull(colour = '#4E6E52'): P {
  const g = new THREE.Group();
  add(g, block(3.4, .26, .80, colour), 0, .15, 0);
  add(g, block(3.1, .10, .92, '#C9B27A'), 0, .29, 0);
  for (const [i, x] of [-1.7, 1.7].entries()) { const tip = add(g, new THREE.Mesh(new THREE.ConeGeometry(.34, .7, 6), mat(colour)), x, .18, 0); tip.rotation.z = i ? -Math.PI / 2 : Math.PI / 2; }
  for (let k = 0; k < 4; k++) add(g, block(.44, .26, .40, '#B7A986'), -1.0 + k * .5, .40, (k % 2 - .5) * .22);
  const forcola = add(g, new THREE.Mesh(new THREE.TorusGeometry(.15, .04, 5, 10, Math.PI * 1.3), mat('#8A6D44')), .8, .52, .36);
  forcola.rotation.y = Math.PI / 2; forcola.rotation.z = .5;
  const boat = masonry(g) as P; boat.userData.deckY = .36;
  return boat;
}
/** A flat-bottomed market barge: a wide open hull loaded with crates, poled up the lane. */
function bargeHull(): P {
  const g = new THREE.Group();
  add(g, block(3.8, .34, 1.35, '#6E5C3C'), 0, .17, 0);
  add(g, block(3.5, .08, 1.2, '#B7A986'), 0, .36, 0);
  for (const z of [-.62, .62]) add(g, block(3.8, .26, .08, '#5A3B22'), 0, .48, z);
  for (let k = 0; k < 6; k++) {
    const crate = add(g, block(.52, .34, .46, k % 2 ? '#C9B27A' : '#A08A5E'), -1.2 + (k % 3) * .62, .58, (Math.floor(k / 3) - .5) * .5);
    for (let j = 0; j < 3; j++) add(crate, new THREE.Mesh(new THREE.SphereGeometry(.09, 7, 6), mat(['#C9302A', '#6F9B57', '#E0842C'][j])), -.14 + j * .14, .22, 0);
  }
  const boat = masonry(g) as P; boat.userData.deckY = .40;
  return boat;
}
/** A bragozzo: the broad Chioggia fishing boat with its high stem and a tan lugsail carrying a painted mark. */
function bragozzoHull(sail = '#C9682F'): P {
  const g = new THREE.Group();
  add(g, block(4.2, .52, 1.5, '#8E3B2C'), 0, .26, 0);
  add(g, block(3.9, .10, 1.34, '#C9B27A'), 0, .56, 0);
  add(g, block(.5, 1.1, 1.0, '#8E3B2C'), -2.0, .8, 0);                                    // the high stem
  add(g, block(.4, .7, 1.1, '#8E3B2C'), 2.0, .7, 0);
  const mast = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, 3.6, 7), mat('#8A6D44')), .2, 2.3, 0);
  const canvas = add(g, block(.06, 2.3, 2.5, sail), .3, 2.2, .1);
  add(canvas, block(.02, .9, .9, '#E4D7BC'), .04, .2, 0);                                  // the painted mark on the sail
  const boat = masonry(g) as P;
  boat.userData.deckY = .62;
  boat.userData.tick = (t: number) => { canvas.rotation.x = Math.sin(t * .6) * .05; mast.rotation.x = Math.sin(t * .6) * .012; };
  return boat;
}
/** The strait ferry: a single-masted sailing boat, mole to mole, because there is no bridge and there was none. */
function ferryHull(): P {
  const g = new THREE.Group();
  add(g, block(5.0, .56, 1.7, '#E4D7BC'), 0, .28, 0);
  add(g, block(5.0, .18, 1.7, '#2E6E8E'), 0, .62, 0);
  add(g, block(4.6, .10, 1.5, '#B7A986'), 0, .74, 0);
  for (const [i, x] of [-2.5, 2.5].entries()) { const tip = add(g, new THREE.Mesh(new THREE.ConeGeometry(.75, 1.1, 6), mat('#E4D7BC')), x, .32, 0); tip.rotation.z = i ? -Math.PI / 2 : Math.PI / 2; }
  const mast = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.08, .10, 4.2, 7), mat('#8A6D44')), 0, 2.8, 0);
  const canvas = add(g, block(.06, 2.8, 3.0, '#EFE6D6'), .1, 2.6, .1);
  for (let k = 0; k < 5; k++) add(g, block(.42, .36, .40, '#A08A5E'), -1.6 + k * .8, .96, -.4);
  const boat = masonry(g) as P;
  boat.userData.deckY = .80;
  boat.userData.tick = (t: number) => { canvas.rotation.x = Math.sin(t * .5) * .06; mast.rotation.x = Math.sin(t * .5) * .015; };
  return boat;
}

export function italyTown(ctx: LayoutCtx) {
  const { group, place, tickers, TOP } = ctx;

  // ---------- swept ground under the three paved streets, then the roads on top of it ----------
  for (const [name, x, z, w, d, colour] of IT_PAVING) group.add(slab(x, z, w, d, colour, PAVING_Y, name));
  // Each route sits a little above the last: two ribbons at one height z-fight where they cross.
  for (const [i, r] of IT_ROADS.entries()) {
    const strip = ribbon(drawnPoints(r), r.width, r.width >= 2.0 ? '#cdbb94' : '#d2c3a2', ROAD_Y + i * .004);
    strip.name = 'italy-road'; strip.userData.road = r.id; group.add(strip);
  }

  // ---------- the one bridge the Builder owns: the stone arch where IT-R2 crosses the Tiber ----------
  // `rialtoIt` is a registered clickable landmark and its deck comes from `props-italy.ts`, so nothing is
  // drawn at [27, -18]; the road and the walkers still ride over it.
  for (const crossing of IT_CROSSINGS) {
    if (!crossing.built) continue;
    const r = IT_ROADS.find(x => x.id === crossing.road)!;
    let best = 0, bd = 1e9;
    for (let i = 0; i < r.points.length - 1; i++) {
      const mx = (r.points[i][0] + r.points[i + 1][0]) / 2, mz = (r.points[i][1] + r.points[i + 1][1]) / 2;
      const d = Math.hypot(mx - crossing.at[0], mz - crossing.at[1]);
      if (d < bd) { bd = d; best = i; }
    }
    const dx = r.points[best + 1][0] - r.points[best][0], dz = r.points[best + 1][1] - r.points[best][1], l = Math.hypot(dx, dz) || 1;
    const deck = place(stoneBridge(crossing.span, r.width + .2, BRIDGE_DECK_Y), crossing.at[0], crossing.at[1], Math.atan2(-dz / l, dx / l));
    deck.name = 'italy-bridge'; deck.userData.crossing = crossing.id;
  }

  // ---------- the thirteen decorative houses, and the three buildings that belong to a stand ----------
  for (const h of IT_HOUSES.filter(x => x.built)) {
    const built = h.id === 'it-latifondo-masseria'
      ? place(latifondoMasseria(), h.x, h.z, h.rot)
      : place(italyBuilding(h.style, h.w, h.d, h.h, { storeys: h.storeys }), h.x, h.z, h.rot);
    built.name = 'italy-house'; built.userData.houseId = h.id;
    if (h.id === 'it-latifondo-masseria') built.userData.houseStyle = 'masseria';
  }
  for (const b of IT_STAND_BUILDINGS) {
    const built = place(b.id === 'forno-oven-house' ? fornoOvenHouse() : b.id === 'casale-byre' ? casaleByre() : tonnaraShed(), b.x, b.z, b.rot);
    built.name = 'stand-building'; built.userData.houseId = b.id; built.userData.owner = b.owner;
  }
  // The valli's casone is not built. The blueprint puts it, the walled enclosures and the fish weirs "in the
  // water", and the owner's rules are that nothing stands in water and there are no sticks in it; on the valli
  // bank itself `valliIt`'s pad and approach leave no ground a 3 by 2.4 lodge fits on. `valliCasone()` stays
  // in `italy-architecture.ts` for the Stand maker, whose stand may carry its own.

  // ---------- the decor the blueprint keeps, re-sited into this frame ----------
  // `colosseum()`, `pantheon()`, `campanile()` and `etna()` are gone from here: each is a registered clickable
  // object now and the same mesh must not stand twice. These six stay as decoration and are placed by rule,
  // so a candidate that would stand in front of a clickable is simply not used.
  // The old table placed these at 0.7 to 0.85 of their builders' size, which is 28 units across for the
  // basilica; on this table each is a small landmark at the edge of its quarter, scaled inside a holder so
  // `place()` cannot reset it.
  const scaled = (build: () => P, k: number) => () => { const holder = new THREE.Group() as P; const o = build(); o.scale.setScalar(k); holder.add(o); return holder; };
  for (const [build, spots, name] of [
    [scaled(obelisk, .8), [[-5.2, -3.6, 0], [-4.4, -1.2, 0], [-8.4, -1.2, 0]], 'piazza-obelisk'],
    [scaled(fountain, .5), [[-6.8, 0, .2], [-7.6, -3.6, .2], [-3.6, .4, .1]], 'piazza-fountain'],
    [scaled(cafeTables, .5), [[-10.8, .8, 0], [-12, 0, .1], [-2.8, .4, .2]], 'cafe-tables'],
    [scaled(triumphalArch, .45), [[1.6, -3.2, 1.57], [2, .4, 1.57], [-2.4, -4.4, 1.57]], 'triumphal-arch'],
    [scaled(treviFountain, .4), [[-12.8, -14.4, 0], [-11.2, -14.8, 0], [-5.6, -16.4, 0]], 'trevi-fountain'],
    [scaled(basilica, .3), [[-32.6, -19.6, .06], [-33, -20.4, .06], [-31.8, -21, .04], [-27.6, -17.2, .04]], 'basilica'],
    [scaled(baroqueChurch, .55), [[13.4, 18.8, .05], [21.6, 27, .04], [13.2, 18.2, .05]], 'baroque-church'],
  ] as [() => P, [number, number, number][], string][]) {
    const thing = tryPlaceAny(ctx, build, spots); if (thing) thing.name = name;
  }
  // Broken travertine columns behind the piazza street, between the palazzo and the fountain.
  for (const [i, [x, z]] of ([[-18.6, -15.4], [-17.4, -15.8], [-16.2, -15.6], [-9.2, -13.4], [-8.2, -14.4]] as Pt[]).entries()) {
    const col = new THREE.Group() as P;
    add(col, new THREE.Mesh(new THREE.CylinderGeometry(.28, .32, .9 + (i % 3) * 1.1, 10), mat(ITP.travertine)), 0, (.9 + (i % 3) * 1.1) / 2, 0);
    add(col, new THREE.Mesh(new THREE.CylinderGeometry(.36, .36, .16, 10), mat(ITP.travertine)), 0, .08, 0);
    const c = tryPlace(ctx, col, x, z, i * .7); if (c) c.name = 'broken-column';
  }

  // ---------- the boats: five lanes, and nothing tied to a quay it would stand on ----------
  for (const lane of IT_BOAT_LANES) {
    const curve = new THREE.CatmullRomCurve3(lane.points.map(([x, z]) => new THREE.Vector3(x, 0, z)));
    const length = curve.getLength();
    for (let i = 0; i < lane.boats; i++) {
      const hull = lane.kind === 'gondola' ? gondolaHull() : lane.kind === 'sandolo' ? sandoloHull(['#4E6E52', '#2E6E8E', '#8E3B2C'][i % 3])
        : lane.kind === 'barge' ? bargeHull() : lane.kind === 'bragozzo' ? bragozzoHull(['#C9682F', '#B4572F'][i % 2]) : ferryHull();
      hull.name = `italy-boat-${lane.kind}`; hull.userData.lane = lane.id; group.add(hull);
      // Every hull that is rowed carries its rower on its own deck, so the figure travels with the boat and
      // never walks: he is `seated` in the movement sense, exactly as a diner on a stool is.
      if (lane.kind !== 'bragozzo' && lane.kind !== 'ferry') {
        const rower = lagoonRower(i + lane.id.charCodeAt(1), lane.kind === 'gondola' ? 3.4 : 3.0);
        rower.name = 'italy-rower';
        add(hull, rower, lane.kind === 'gondola' ? 1.4 : 1.0, hull.userData.deckY as number, .04);
        rower.rotation.y = -Math.PI / 2;
      }
      // The hull stops short of both ends so it never leaves the lane, and turns round instead of teleporting.
      const margin = Math.min(.45, 2.6 / Math.max(1, length));
      const lo = margin, hi = 1 - margin, off = i / lane.boats;
      tickers.push((t, dt) => {
        const raw = (t * lane.speed * 2 + off * 2) % 2, s = raw < 1 ? raw : 2 - raw;
        const u = lo + (hi - lo) * s;
        const p = curve.getPointAt(u), n = curve.getPointAt(Math.min(1, u + .004));
        hull.position.set(p.x, TOP + .05 + Math.sin(t * .8 + off * 5) * .014, p.z);
        hull.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2 + (raw < 1 ? 0 : Math.PI);
        hull.rotation.z = Math.sin(t * .9 + off * 4) * .018;
        hull.userData.tick?.(t, dt);
        hull.traverse(o => { if (o !== hull && (o as P).userData.tick) (o as P).userData.tick!(t, dt); });
      });
    }
  }

  // ---------- the five peopled loops ----------
  const led: { mule: P; cart: P | null; leader: P; gap: number }[] = [];
  for (const lane of IT_LANES) {
    const lift = italyBridgeLift(lane);
    for (let i = 0; i < lane.walkers; i++) {
      const seed = lane.seed + i * 3;
      const p = italianResident(seed);
      p.name = 'italy-walker'; p.userData.lane = lane.id; group.add(p);
      tickers.push(italyWalk(p, lane.from, lane.to, lane.range, seed + i * 5, lift));
      if (lane.id === CART_LANE && i === 0) {
        // The Castelli carrettiere: a mule in the shafts of a hooded two-wheeled wine cart, walking at the
        // mule's shoulder. There is no Vespa anywhere on this table; it is of 1946.
        const mule = italyMule(false); mule.name = 'italy-mule'; group.add(mule);
        const cart = wineCart(); cart.name = 'wine-cart'; group.add(cart);
        led.push({ mule, cart, leader: p, gap: 1.6 });
      }
      if (lane.id === MULE_LANE && i === 0) {
        const mule = italyMule(true); mule.name = 'italy-mule'; group.add(mule);
        led.push({ mule, cart: null, leader: p, gap: 1.5 });
      }
    }
  }
  for (const { mule, cart, leader, gap } of led) tickers.push(followCart(mule, cart, leader, group, gap));

  // ---------- neighbours who stand and talk: the piazza, Testaccio, the fondamenta, the lane and the coast ----------
  // A standing figure does not translate, so it does not step. A knot of people stands at the first of its
  // candidate spots that is dry, off every lane by more than the lane's half width plus a body, at least 2.4
  // from any clickable's anchor, and clear of every building and tree, so no walker passes through a neighbour
  // and no neighbour stands in a stall. People 1.2 tall hide nothing from the arrival camera.
  for (const [i, [n, spots]] of ([
    [3, [[-12.4, -2.2], [-9.6, -3.6], [-24.4, -11.4], [-10.8, -11.8]]],
    [2, [[-28.4, -5.2], [-30.4, -9.8], [-26, -12.6]]],
    [2, [[-36.4, 1.2], [-32.6, 4.6], [-34.2, 9.0]]],
    [2, [[33.6, -23.8], [21.8, -23.4], [34, -12], [24.4, -12.4]]],
    [3, [[-1.6, 25.6], [-17.6, 19.6], [-19.2, 24.4], [-6.4, 25.8]]],
    [2, [[20.4, 24.6], [9.6, 24.8], [22.4, 27.8], [18.4, 21.2]]],
  ] as [number, [number, number][]][]).entries()) {
    const spot = spots.find(([x, z]) => {
      const box = new THREE.Box3(new THREE.Vector3(x - .95, 0, z - .95), new THREE.Vector3(x + .95, 1.2, z + .95));
      return !isWet(x - .95, z - .95) && !isWet(x + .95, z + .95) && !isWet(x - .95, z + .95) && !isWet(x + .95, z - .95)
        && distToRoads(x, z) > 2.2
        && objectDistance(x, z) > 2.4 && !overlapsOccupied(box);
    });
    if (!spot) continue;
    const knot = new THREE.Group() as P; knot.name = 'italy-neighbours';
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i;
      const p = add(knot, italianResident(60 + i * 3 + k), Math.cos(a) * .55, 0, Math.sin(a) * .55);
      p.rotation.y = -a - Math.PI / 2; p.name = 'italy-neighbour';
      const tk = (p as P).userData.tick; if (tk) tickers.push(tk);
    }
    place(knot, spot[0], spot[1]);
    occupy(new THREE.Box3(new THREE.Vector3(spot[0] - .95, 0, spot[1] - .95), new THREE.Vector3(spot[0] + .95, 1.2, spot[1] + .95)));
  }
}
