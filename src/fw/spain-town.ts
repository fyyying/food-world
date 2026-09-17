/** The six Spanish clusters: the road network, the open Plaza Mayor, decorative houses in each regional style,
 *  the statue, running fountains, plane trees, cypresses and the square's iron lamp posts. Positions live here. */
import * as THREE from 'three';
import { add, mat, tree, type P } from './props';
import { cypress, umbrellaPine } from './props-italy';
import { block, masonry } from './turkey-architecture';
import { SP, spainHouse, type SpainStyle } from './spain-architecture';
import { ROAD_LIFT, type Pt } from './spain-landscape';
import type { LayoutCtx } from './worldkit';

export type Road = { id: string; width: number; points: Pt[] };
/** One continuous ribbon each, at the blueprint widths. Every door in the object list meets one of these,
 *  or stands on the Plaza Mayor paving, which is the square's own walking surface. */
export const SPAIN_ROADS: Road[] = [
  { id: 'main-street', width: 2.6, points: [[-41.5, -3.6], [-36, -3], [-28, -2], [-22, -1], [-20.6, -2]] },
  { id: 'south-lane', width: 1.8, points: [[-44, 0], [-42, 3], [-42, 8], [-46, 9.5], [-50, 10], [-48, 16], [-42, 20]] },
  // The blueprint ran the Alhambra approach back along the south lane; one ribbon cannot double back on itself.
  { id: 'alhambra-lane', width: 1.8, points: [[-42, 20], [-48, 21.2], [-52, 22], [-56, 20]] },
  { id: 'olive-spur', width: 1.6, points: [[-50, 10], [-56, 10], [-60, 8]] },
  { id: 'west-road', width: 1.8, points: [[-46, 9.5], [-52, 7], [-58, 2], [-62, -2], [-66, -6], [-70, 0], [-68, 4], [-72, 10], [-78, 16], [-72, 20]] },
  { id: 'windmill-spur', width: 1.6, points: [[-70, 0], [-76, -8]] },
  // The lane out of the square's north side used to start at [-44, -8] and run straight into the equestrian
  // statue's plinth; it now leaves a unit further west and passes it. Its old fourth point, [-48, -24], carried
  // the horreo's door and was dropped with the horreo: the road now ends at the fair, where the coast lane and
  // the pepper spur take over.
  { id: 'north-road', width: 1.8, points: [[-45.2, -8.2], [-46, -14], [-50, -18]] },
  { id: 'pepper-spur', width: 1.6, points: [[-50, -18], [-53, -15.5], [-58, -12]] },
  { id: 'coast-lane', width: 1.8, points: [[-50, -18], [-44, -21], [-40, -22], [-34, -22], [-28, -21], [-24, -18], [-22.6, -14], [-22.2, -10], [-21.4, -6], [-20.6, -2]] },
  // Owner feedback, 2026-09-17: "the rice farm and the huerta beds are overlapped a bit and show both in a
  // section". The four Albufera stands were stacked on one another; they are now spread over the open ground
  // between the river and the southern table edge, and the lane follows them: down the east side to the
  // paddies and the rice fire, round the bottom and back up the west side past the huerta beds and the orange
  // grove. Both river crossings keep their bridges at [-28, 5.0] and [-34, 5.6].
  { id: 'valencia-lane', width: 1.6, points: [[-28, -2], [-28, 3], [-28, 8], [-24, 11], [-22.5, 14], [-23, 18], [-25, 22], [-30, 23], [-33, 21], [-33, 14], [-34, 10], [-34, 4], [-36, -3]] },
  // The spur used to run from the coast lane out to the trencadis terrace at [-21.4, -19.8]. The mosaic
  // balustrade moved north on 2026-09-17, out from under the bread terrace's own roof, and the spur followed:
  // it now leaves the coast lane at the strait and runs west along the terrace's landward side to its door.
  { id: 'terrace-spur', width: 1.6, points: [[-22.3, -11], [-24, -10.6], [-25.6, -10.2]] },
  // The churreria stood inside the square behind the tapas bar, where nothing of its reaction could be seen on
  // the approach, so in Stage E it moved to a lane off the north-east corner, at [-34, -13]. That put its
  // six-unit body directly between the camera and the pintxo bar, five units behind it. On 2026-09-17 it moved
  // again, to [-33, 0] on the south side of the main street where it leaves the square, which is both clear of
  // every other stand and where a churreria belongs: Madrid's oldest is in a pasadizo off Calle Arenal. This
  // ribbon is now that passage, from the main street to its door.
  { id: 'churro-lane', width: 1.6, points: [[-35.6, -2.2], [-34.4, -0.8], [-33.4, 0.2]] },
];
/** Deck centres on the river. A road may touch the water only inside these. */
export const SPAIN_BRIDGES: Pt[] = [[-42, 5.4], [-28, 5.0], [-34, 5.6]];
/** The open paved square: x from -50.5 to -36.5, z from -9 to 1. Four objects stand on it. */
export const PLAZA = { x: -43.5, z: -4, w: 14, d: 10 };
/** Moved half a unit east and south on 2026-09-17: the plinth reached into the fair cauldron's wedge. */
export const PLAZA_STATUE: Pt = [-43.5, -8.8];
export const ROAD_Y = .036, SQUARE_Y = .027, PAVING_Y = .018;

/** Straight walking segments cut from the road table, so a walker never rounds a corner into a wall.
 *  `seed` picks the first clothing profile on the lane: 0 huertano, 1 Andalusian with a basket, 2 patio woman
 *  with a jug, 3 shepherd, 4 counter worker, 5 Galician in a rush cape, 6 Basque, 7 Catalan. */
export type Lane = { id: string; from: Pt; to: Pt; range: [number, number]; walkers: number; seed: number };
function segments(road: Road, first: number, last: number, walkers: number[], seeds: number[]): Lane[] {
  return road.points.slice(first + 1, last + 1).map((to, i) => ({
    id: `${road.id}-${first + i}`, from: road.points[first + i], to, range: [.07, .93] as [number, number],
    walkers: walkers[i], seed: seeds[i],
  }));
}
const road = (id: string) => SPAIN_ROADS.find(r => r.id === id)!;
/** Loop 1: the plaza, six residents round the statue, one with a basket and one with a jug. */
export const PLAZA_LOOP: Lane[] = [
  { id: 'plaza-0', from: [-48.5, -7], to: [-38.5, -7], range: [.05, .95], walkers: 2, seed: 1 },
  { id: 'plaza-1', from: [-38.5, -7], to: [-38.5, -1], range: [.05, .95], walkers: 1, seed: 4 },
  { id: 'plaza-2', from: [-38.5, -1], to: [-48.5, -1], range: [.05, .95], walkers: 2, seed: 6 },
  { id: 'plaza-3', from: [-48.5, -1], to: [-48.5, -7], range: [.05, .95], walkers: 1, seed: 0 },
];
/** Loops 2 to 4: the Andalusian south lane, the coast lane from the fair to the terrace, the Valencia lane. */
export const SPAIN_LANES: Lane[] = [
  ...PLAZA_LOOP,
  ...segments(road('south-lane'), 1, 6, [1, 1, 1, 1, 1], [2, 1, 3, 9, 17]),
  ...segments(road('coast-lane'), 0, 5, [1, 1, 1, 1, 1], [5, 21, 6, 7, 2]),
  ...segments(road('valencia-lane'), 0, 4, [1, 1, 1, 1], [4, 7, 0, 25]),
];

const IRON = '#2f3238';

/** A road ribbon: one mesh per route, above the square paving and marked so it wins the depth test. */
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
/** A flat quadrilateral surface at a fixed height, used for the town paving and the square. */
function slab(x: number, z: number, w: number, d: number, color: string, y: number, name: string): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(color));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; m.name = name; return m;
}

/** A cast-iron lamp post: a granite kerb, a tapered column and the lantern on a short scroll at the top.
 *  It replaces the bracket lamp that used to hang from the arcade beams, so nothing is left in the air. */
function lampPost(g: THREE.Group, x: number, z: number) {
  const top = 2.45;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .16, 8), mat(SP.granitoGalego)), x, .08, z);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.055, .085, top - .16, 8), mat(IRON)), x, .16 + (top - .16) / 2, z);
  add(g, block(.05, .05, .05, IRON), x, top + .04, z);
  const lamp = add(g, block(.17, .24, .17, IRON), x, top + .21, z);
  add(lamp, new THREE.Mesh(new THREE.BoxGeometry(.12, .18, .12), mat('#e9c877', { emissive: '#8a5a1c', emissiveIntensity: .45 })), 0, 0, 0);
  add(g, new THREE.Mesh(new THREE.ConeGeometry(.13, .1, 8), mat(IRON)), x, top + .38, z);
}

/** A stone basin with a spout column; the Andalusian squares and the huerta share it.
 *  The stone is merged once; the water is eight small meshes on a tick: a jet out of the upper bowl,
 *  four droplets that arc back into the basin, two thin sheets falling from the bowl rim, and the
 *  basin surface, which pulses where the sheets land. */
const WATER = '#9fd4e0';
function fountain(color = SP.piedraDorada): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, .42, 14), mat(color)), 0, .21, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.13, .16, 1.0, 8), mat(color)), 0, .94, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.36, .26, .12, 12), mat(color)), 0, 1.46, 0);
  for (const a of [0, Math.PI]) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .16, 6), mat('#8a7a5a')), Math.sin(a) * .16, 1.30, Math.cos(a) * .16);
  const stone = masonry(g) as P;

  // The basin surface, which ripples where the sheets land.
  const pool = add(stone, new THREE.Mesh(new THREE.CylinderGeometry(.86, .86, .10, 14), mat('#6fc0cf')), 0, .44, 0);
  // The jet: a narrow column standing on the lip of the upper bowl, breathing with the pressure.
  const jet = add(stone, new THREE.Mesh(new THREE.CylinderGeometry(.035, .05, .34, 6), mat(WATER, { transparent: true, opacity: .55 })), 0, 1.69, 0);
  // Two thin sheets from the bowl rim down into the basin, on opposite sides so the fall reads from any angle.
  const sheets = [0, Math.PI].map((a) => {
    const sheet = add(stone, new THREE.Mesh(new THREE.CylinderGeometry(.07, .10, .92, 5), mat(WATER, { transparent: true, opacity: .5 })), Math.sin(a) * .345, .95, Math.cos(a) * .345);
    return sheet;
  });
  // A ring on the basin surface that widens and fades where the sheets strike.
  const ripple = add(stone, new THREE.Mesh(new THREE.RingGeometry(.22, .30, 16), mat(WATER, { transparent: true, opacity: .5, side: THREE.DoubleSide })), 0, .50, 0);
  ripple.rotation.x = -Math.PI / 2;
  // Droplets thrown off the jet, falling back into the basin on their own clocks.
  const drops = [0, 1, 2, 3].map(() => add(stone, new THREE.Mesh(new THREE.SphereGeometry(.035, 5, 4), mat(WATER, { transparent: true, opacity: .7 })), 0, 1.86, 0));
  stone.userData.tick = (t: number) => {
    const pressure = .85 + Math.sin(t * 2.3) * .15;
    jet.scale.set(1, pressure, 1); jet.position.y = 1.52 + .17 * pressure;
    for (const [i, sheet] of sheets.entries()) { const s = .9 + Math.sin(t * 3.1 + i * 2.1) * .1; sheet.scale.set(s, 1, s); }
    pool.scale.set(1 + Math.sin(t * 1.7) * .006, 1, 1 + Math.cos(t * 1.9) * .006);
    const r = (t * .7) % 1;
    ripple.scale.setScalar(.7 + r * 2.1);
    (ripple.material as THREE.MeshStandardMaterial).opacity = .42 * (1 - r);
    drops.forEach((drop, i) => {
      const u = ((t * .9 + i * .25) % 1);
      const a = i * 1.57 + t * .2, reach = .18 + u * .5;
      drop.position.set(Math.cos(a) * reach, 1.86 + u * .30 - u * u * 1.42, Math.sin(a) * reach);
      (drop.material as THREE.MeshStandardMaterial).opacity = .7 * (1 - u * u);
    });
  };
  return stone;
}

/** A low timber crossing: the deck clears the river surface and lands on a stone abutment at each bank,
 *  so a walker steps up ROAD_LIFT and comes down again instead of wading. */
export const BRIDGE_SPAN = 5.2, BRIDGE_DECK_Y = ROAD_LIFT;
function riverBridge(len = BRIDGE_SPAN): P {
  const g = new THREE.Group(), deckTop = BRIDGE_DECK_Y;
  // The abutments stop under the deck, so no two upward faces share the deck's plane.
  for (const x of [-len / 2 + .35, len / 2 - .35]) add(g, block(1.2, deckTop - .1, 2.1, SP.granitoGalego), x, (deckTop - .1) / 2, 0);
  add(g, block(len, .1, 1.9, SP.maderaCastano), 0, deckTop - .05, 0);
  for (let i = 0; i < 9; i++) add(g, block(.09, .04, 1.9, '#6b4a30'), -len / 2 + .3 + i * (len - .6) / 8, deckTop + .02, 0);
  for (const z of [-.92, .92]) {
    add(g, block(len, .07, .07, SP.maderaCastano), 0, deckTop + .58, z);
    for (let i = 0; i <= 4; i++) add(g, block(.09, .54, .09, SP.maderaCastano), -len / 2 + .2 + i * (len - .4) / 4, deckTop + .31, z);   // the posts start above the planks
  }
  for (const x of [-len / 2, len / 2]) add(g, block(.5, .1, 1.9, '#b7a986'), x * 1.12, deckTop - .05, 0).rotation.z = x > 0 ? -.16 : .16;   // the ramp onto the lane
  return masonry(g) as P;
}

/** The equestrian statue on its plinth in the middle of the square. It is built narrow: the market hall
 *  and the tapas bar take the square's west and east halves, and the statue stands in the gap between them. */
function equestrian(): P {
  const g = new THREE.Group(), stone = SP.granitoGalego, bronze = '#4d5a4a';
  add(g, block(1.7, .26, 1.5, SP.piedraDorada), 0, .13, 0);
  add(g, block(1.3, 1.25, 1.1, stone), 0, .88, 0);
  add(g, block(1.45, .14, 1.25, SP.piedraDorada), 0, 1.57, 0);
  const horse = new THREE.Group(); horse.position.y = 1.64; g.add(horse);
  add(horse, block(1.05, .44, .40, bronze), -.05, .66, 0);
  add(horse, block(.32, .36, .27, bronze), .5, .84, 0);
  add(horse, block(.22, .19, .22, bronze), .64, .96, 0);
  for (const z of [-.08, .08]) add(horse, block(.07, .21, .05, bronze), .53, 1.08, z);
  for (const [i, [x, z]] of [[.3, -.13], [.3, .13], [-.36, -.13], [-.36, .13]].entries()) {
    const leg = add(horse, block(.11, .46, .11, bronze), x, .22, z);
    leg.rotation.z = i < 2 ? .18 : -.14;
  }
  add(horse, block(.1, .36, .09, bronze), -.58, .68, 0).rotation.z = .5;
  const rider = add(horse, new THREE.Group(), -.08, .94, 0);
  add(rider, block(.25, .45, .26, bronze), 0, .22, 0);
  add(rider, new THREE.Mesh(new THREE.SphereGeometry(.12, 9, 7), mat(bronze)), 0, .53, 0);
  add(rider, block(.32, .05, .32, bronze), 0, .63, 0);
  return masonry(g) as P;
}

/** Decorative houses: style, position, rotation, size and storeys. Object pads stay clear.
 *  Owner feedback, 2026-09-17: "there should be no house in front of a clickable object". The camera looks at
 *  Spain from the south (azimuth .033 rad, 38.7 degrees up) and the visitor may swing it 43 degrees either way,
 *  so every stand keeps a 100-degree wedge on its camera side clear for nine units. Twenty-six stands spread
 *  over sixty by fifty units leave very little ground that is outside all twenty-six wedges, and almost none of
 *  it is in the Plaza Mayor, where four stands and the statue stand within fourteen units of each other. Nine
 *  of the fourteen houses were therefore removed and three moved to free ground in their own region; five are
 *  left, one per region and none in Castile. The Plaza Mayor keeps no decorative house at all: its built
 *  fabric is the market hall, the taberna, Casa Lola, the churreria, the statue and the lamp posts. `spain-world.mjs` holds both the wedge and the
 *  count. See docs/spain-world.md, "Third pass".
 */
const HOUSES: [SpainStyle, number, number, number, number, number, number][] = [
  // La Albufera y el Puerto has no decorative house since 2026-09-17. Two by the port stood in front of the
  // port, the bread terrace and the mosaic bench; the last one, on the bay's southern shore, stood in front of
  // the rice fire once the four Albufera stands were spread over that ground to stop them overlapping. Like
  // Castile, the cluster now reads from its own stands.
  // El Patio y la Bodega: the last white house on the road to the Alhambra, west of the terrace. The two on the
  // patio hill stood in front of the courtyard kitchen and the oil mill; the one above the bodega stood in
  // front of the bodega and three units in front of the flamenco stage. It came down from two storeys to one
  // on 2026-09-17: at 5.3 units its roof caught one ray to the Manchega flock eleven units behind it.
  ['andalus', -65.6, 21.0, .05, 2.8, 2.2, 1],
  // El Secano Manchego: one single-storey lime-washed house on the dry plain west of the cheese farm. The
  // other two stood in front of the windmill ridge, the oil mill and the flock; the only other ground on the
  // plain that is behind every stand is inside the dehesa's pig pen. It moved two units south on 2026-09-17,
  // when the saffron plot moved to [-71, -7] and put the house in its camera-side wedge.
  ['mancha', -75.0, 5.0, .15, 3.0, 2.4, 1],
  // La Ria: bare granite and slate with a glazed gallery against the rain; it stands west of the fair, behind
  // nothing, and did not move.
  ['galician', -63.3, -14.6, .2, 3.0, 2.4, 2],
  // El Cantabrico i la Terrassa: render and tile at the corner. The house behind the churreria's lane stood in
  // front of the churreria, the bread terrace and the mosaic bench, and was removed.
  ['catalan', -26.5, -23.0, .15, 3.0, 2.4, 2],
];

export function spainTown(ctx: LayoutCtx) {
  const { group, place } = ctx;
  // Town paving under the densest clusters, then the square on top of it, then the lanes on top of that.
  group.add(slab(-43.5, -4, 22, 18, '#cfc2a4', PAVING_Y, 'spanish-town-paving'));
  group.add(slab(-49, 15, 16, 14, '#e2d8c0', PAVING_Y, 'patio-lane-paving'));
  group.add(slab(PLAZA.x, PLAZA.z, PLAZA.w, PLAZA.d, '#d9c9a8', SQUARE_Y, 'plaza-mayor-paving'));
  // Each route sits a little above the last: two ribbons at one height z-fight where they cross.
  for (const [i, r] of SPAIN_ROADS.entries()) {
    const strip = ribbon(r.points, r.width, r.id === 'main-street' ? '#cdbb94' : '#d2c3a2', ROAD_Y + i * .004);
    strip.name = 'spanish-road'; strip.userData.road = r.id; group.add(strip);
  }

  // Two wooden bridges on the blueprint's crossings, and a third where the Valencia lane returns over the river.
  // All three carry a road that runs along z, so the deck turns a quarter to lie along the lane.
  for (const [x, z] of SPAIN_BRIDGES) {
    const deck = place(riverBridge(BRIDGE_SPAN), x, z, Math.PI / 2);
    deck.name = 'spanish-bridge';
  }

  // Owner feedback, 2026-09-16: the four free-standing arcades that ringed the square were removed. Each was a
  // long tan cornice slab on a row of grey granite piers, attached to no building, and from the overview camera
  // it read as a bridge standing half in the water; the west one, at the river's edge beside the brick Castilian
  // house, was the "yellow bridge-looking thing" the owner pointed at. The arcade motif survives where it is
  // part of a building: the pulperia's granite arcade in props-spain.ts and the painted tapas-bar room.
  // The square keeps its light on iron lamp posts, which stand on the ground instead of hanging from a beam.
  for (const [x, z] of [[-50.6, -7.4], [-50.6, -1.2], [-47.4, -9.4], [-41.6, -9.4], [-41.0, 1.7], [-36.4, 1.7]] as Pt[]) {
    const lamp = new THREE.Group(); lamp.name = 'plaza-lamp'; group.add(lamp); lampPost(lamp, x, z);
  }

  place(equestrian(), PLAZA_STATUE[0], PLAZA_STATUE[1]).name = 'plaza-statue';
  place(fountain(), -56, 12).name = 'patio-fountain';   // moved west off the courtyard kitchen's camera side, 2026-09-17
  place(fountain(SP.calBlanca), -26, 2.2).name = 'valencia-fountain';   // moved east down the main street, 2026-09-17: it stood inside the churreria's new pad
  place(fountain(SP.granitoGalego), -46.2, -17.6).name = 'ria-fountain';

  for (const [style, x, z, rot, w, d, storeys] of HOUSES) {
    const h = place(spainHouse(style, w, d, style === 'castile' ? 1.9 : style === 'mancha' ? 2.4 : 2.1, { storeys }), x, z, rot);
    h.name = 'spanish-house';
  }
  // The barraca that stood in the rice fields at [-22.2, 9.0] was removed on the owner's word, 2026-09-16.
  // The Basque farmhouse that stood at [-28.2, -11.0] went on 2026-09-17: at 5.1 by 4.6 it was the widest
  // decoration on the table and it stood in front of four clickable objects at once, the bread terrace (2.8
  // away), the mosaic bench, the pintxo bar and the churreria. The quay, the churreria's lane and the
  // trencadis terrace leave no plot on that coast that is behind all four, so it was removed rather than moved.
  // `baserri()` stays in spain-architecture.ts; nothing places one now.

  // Plane trees on the square edges and the Catalan terrace; cypresses at the Alhambra; pines on the sandbar.
  // All four plane trees came down to a crown under two units on 2026-09-17, so they are no longer "big trees"
  // in front of the market hall, the family kitchen and the churreria; the one at [-31.0, -7.8] was 4.9 from
  // the churreria. All three east-side trees moved again on 2026-09-17, out of the churreria's new footprint
  // at [-33, 0] and out of the mosaic balustrade's pad at [-27, -10]; they now line the lane that leaves the
  // square's east side for the coast.
  for (const [x, z, s] of [[-33, -11, .95], [-50.4, 2.4, .95], [-32.5, -5.8, .92], [-35, -7.4, .95]]) {
    add(group, block(1.4, .22, 1.4, SP.granitoGalego), x, .11, z);
    place(tree('round', s), x, z).name = 'plane-tree';
  }
  // Two of the four Alhambra cypresses stood in front of the courtyard kitchen and the oil mill and came out;
  // the third moved north-west to the foot of the terrace, where the oil mill's wedge ends.
  for (const [x, z] of [[-62.8, 17.4], [-64, 18.5]]) place(cypress(.95), x, z, x).name = 'alhambra-cypress';
  // The pine sandbar along the bay shore is gone, 2026-09-17. The paddies moved west onto the ground it stood
  // on, and the strip left between the paddies' pad and the water is inside the port's own camera-side wedge,
  // so there is nowhere on that shore a three-metre pine can stand without hiding a clickable object.
}
