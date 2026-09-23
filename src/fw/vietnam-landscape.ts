/** Vietnamese ground, water and relief on the grown Southeast Asia table: the cluster tints, the Red River
 *  across the north with its estuary at the bight, the Perfume River out of the hills east of HN2, the three
 *  Mekong channels, Hoàn Kiếm lake, the flooded paddy squares of the Red River and the delta, the low hills
 *  behind Hạ Long and the karsts standing in the north-east sea.
 *
 *  It does not own the sea: one shape wraps the whole table's west, south and east edges and belongs to the
 *  Thailand builder's `thailand-landscape.ts`. Nothing here crosses west of x -12.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { karst } from './props-seasia';
import { terrace } from './turkey-landscape';
import { riverGeometry, freshWater, estuaryWater, addFish, type LayoutCtx } from './worldkit';
import { VIETNAM_OBJECTS } from './vietnam-objects';
// The sea is one shape for the whole table and belongs to `thailand-landscape.ts`; this file reads its outline
// so nothing Vietnamese is laid on the shore, and draws none of it.
import { seaOutline } from './thailand-landscape';
import { VN } from './vietnam-architecture';

export type Pt = [number, number];
/** The shared table after the growth to W 120, D 56, cx -22, and the band Vietnam owns inside it. */
export const TABLE = { minX: -82, maxX: 38, minZ: -28, maxZ: 28 };
export const VN_BAND = { minX: -12, maxX: 38 };
export const atEdgeX = (x: number) => x <= TABLE.minX || x >= TABLE.maxX;
export const atEdgeZ = (z: number) => Math.abs(z) >= TABLE.maxZ;

/** The Red River: off the north edge at x -9, across the whole north of the band south of the guild street,
 *  into the eastern sea at the bight. The first two points share an x so the cap at the table edge is square. */
export const RED_RIVER: Pt[] = [[-9, -28], [-9, -26.9], [-8, -26], [-5, -25], [1, -24.5], [8, -24], [13, -24.4], [18, -25], [21, -25.6], [24.3, -26.2], [25.2, -26.6]];
export const RED_RIVER_WIDTH = 3.6, RED_RIVER_RIM = 5.2;
/** The Perfume River, past Huế at CT1 and into the eastern sea at [33, -7]. Its head moved from the
 *  blueprint's [12.5, -11.5] to [15.1, -10.0]: the blueprint's first two points lie inside the corridor of
 *  VN-R3, the Huế river road, whose own points are fixed, so the river as blueprinted ran along the inside of
 *  the road for two units. It now rises clear of it. Nothing else about the line changed. */
export const PERFUME: Pt[] = [[15.1, -10.0], [17, -9.2], [21, -7.6], [25, -6], [29, -6], [33, -7], [34.4, -7.2]];
export const PERFUME_WIDTH = 2.8, PERFUME_RIM = 4.2;
/** The spring the Perfume rises from. The stones at the head were already here; under the river-continuity
 *  rule (owner, 2026-09-22) a ring of stones is not a source, so the head is a pool of water and the river's
 *  first point lies inside it. Thailand's builder added this with the shared sea fix; nothing else moved. */
export const PERFUME_SPRING = { x: 15.1, z: -10.0, r: .85 };
/** The three Mekong channels, from the western band edge to the southern sea. They replace the old delta curve. */
export const CHANNEL_A: Pt[] = [[-12, 14.5], [-7, 16.5], [-2, 19.5], [2, 22], [4, 24]];
export const CHANNEL_B: Pt[] = [[-7.7, 19.2], [-4.5, 21], [-2.5, 23.4], [-2.2, 24.3]];
export const CHANNEL_C: Pt[] = [[-7, 16.5], [-7.8, 20], [-8.2, 23.4], [-8.3, 24.3]];
export const CHANNEL_WIDTH = { a: 2.6, b: 2.6, c: 2.0 };
/** The head of the delta, where channel A comes out of the trees at the western edge of MK1. The blueprint
 *  gives the channel a source at the band edge, which under the river-continuity rule (owner, 2026-09-22) is
 *  open ground: the channel stopped in the middle of the delta. It now rises from a pool, the way the Perfume
 *  rises from its spring. The pool reaches 0.4 into the two-unit strip between the areas, which carries ground
 *  only for objects, roads, clusters and decor; the sea's own south margin already crosses it. */
export const MEKONG_HEAD = { x: -11.6, z: 14.4, r: .8 };
/** Hoàn Kiếm lake. The blueprint's circle of r 1.8 at [1, -19.8] cannot be drawn: the `hoanKiem` embankment as
 *  built runs from x -5.87 to 0.40 and the lakeside path VN-R1b closes the pocket on the other three sides, so
 *  a circle of that radius puts both the path and the stand in the water. The lake is the largest ellipse that
 *  fits between them, found by search. The road points and the stand are fixed; the lake is the landscape's. */
export const HOAN_KIEM = { x: 1.45, z: -20.75, rx: .78, rz: .86 };
/** Low relief. The blueprint asks for Red River hills behind the north bank and a pine-and-areca slope on the
 *  Huế garden side. The hill over HN2 could not be built: the Huế gate, the lemongrass kitchen and the cake
 *  bench as built fill x 11 to 23 from z -14.3 to +0.4 and both roads run through what is left, so raised
 *  ground there would put a stand on a slope. The Red River hills are therefore the one mass in the north-east,
 *  where they come down to the coast behind the Hạ Long karsts, and the Huế slope sits south of the gardens. */
export const HILLS = [
  { x: 27.5, z: -19.5, rx: 2.6, rz: 2.0, h: 1.25, crown: .35, colour: '#7F9A62' },
  { x: 15.0, z: 2.6, rx: 4.0, rz: 1.9, h: .7, crown: .45, colour: '#87A567' },
];

export const RIVER_Y = .09, CHANNEL_Y = .086, LAKE_Y = .075, RIM_Y = .034, PADDY_Y = .05;
/** How far a bridge deck, and a walker on it, stands above the lane so the water passes underneath. */
export const ROAD_LIFT = .22;

const curveOf = (pts: Pt[]) => new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** Every Vietnamese waterway and still pool as named data, so a harness can check that each river runs from a
 *  source to a mouth instead of stopping in the middle. `thailand-landscape.ts` exports the same two shapes. */
export const VN_WATERWAYS: { id: string; points: Pt[]; width: number }[] = [
  { id: 'red-river', points: RED_RIVER, width: RED_RIVER_WIDTH },
  { id: 'perfume-river', points: PERFUME, width: PERFUME_WIDTH },
  { id: 'mekong-channel-a', points: CHANNEL_A, width: CHANNEL_WIDTH.a },
  { id: 'mekong-channel-b', points: CHANNEL_B, width: CHANNEL_WIDTH.b },
  { id: 'mekong-channel-c', points: CHANNEL_C, width: CHANNEL_WIDTH.c },
];
export const VN_POOLS: { id: string; x: number; z: number; rx: number; rz: number }[] = [
  { id: 'hoan-kiem-lake', x: HOAN_KIEM.x, z: HOAN_KIEM.z, rx: HOAN_KIEM.rx, rz: HOAN_KIEM.rz },
  { id: 'perfume-spring', x: PERFUME_SPRING.x, z: PERFUME_SPRING.z, rx: PERFUME_SPRING.r, rz: PERFUME_SPRING.r * .8 },
  { id: 'mekong-head', x: MEKONG_HEAD.x, z: MEKONG_HEAD.z, rx: MEKONG_HEAD.r, rz: MEKONG_HEAD.r * .85 },
];

export const RED_RIVER_CURVE = curveOf(RED_RIVER);
export const PERFUME_CURVE = curveOf(PERFUME);
export const CHANNEL_CURVES = { a: curveOf(CHANNEL_A), b: curveOf(CHANNEL_B), c: curveOf(CHANNEL_C) };

export function inPolygon(x: number, z: number, poly: Pt[]): boolean {
  let yes = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[i], [bx, bz] = poly[j];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) yes = !yes;
  }
  return yes;
}
/** The polygon of a water ribbon, for the tests that keep roads, stands and walkers out of it. */
export function ribbonOutline(curve: THREE.CatmullRomCurve3, width: number): Pt[] {
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= 160; i++) {
    const u = i / 160, p = curve.getPointAt(u), t = curve.getTangentAt(u), s = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(width / 2);
    left.push([p.x - s.x, p.z - s.z]); right.push([p.x + s.x, p.z + s.z]);
  }
  return [...left, ...right.reverse()];
}
/** Every Vietnamese water body as polygons: both rivers, the three channels, the lake and the puppet tank. */
export function vietnamWaterOutlines(): Pt[][] {
  const ellipse = (c: { x: number; z: number; rx: number; rz: number }): Pt[] =>
    Array.from({ length: 40 }, (_, i) => [c.x + Math.cos(i / 40 * Math.PI * 2) * c.rx, c.z + Math.sin(i / 40 * Math.PI * 2) * c.rz] as Pt);
  return [
    ribbonOutline(RED_RIVER_CURVE, RED_RIVER_WIDTH), ribbonOutline(PERFUME_CURVE, PERFUME_WIDTH),
    ribbonOutline(CHANNEL_CURVES.a, CHANNEL_WIDTH.a), ribbonOutline(CHANNEL_CURVES.b, CHANNEL_WIDTH.b), ribbonOutline(CHANNEL_CURVES.c, CHANNEL_WIDTH.c),
    ellipse(HOAN_KIEM),
  ];
}
const WATER_OUTLINES = vietnamWaterOutlines();
let SEA: Pt[] | null = null;
/** Is this point in Vietnamese water, or in the shared sea? The sea's shape is read from Thailand's file. */
export const inVietnamWater = (x: number, z: number) => {
  SEA ??= seaOutline() as Pt[];
  return inPolygon(x, z, SEA) || WATER_OUTLINES.some(poly => inPolygon(x, z, poly));
};

/** The height of the raised ground at a point, so a tree on a slope stands on it instead of under it. */
export function groundHeight(x: number, z: number): number {
  let y = 0;
  for (const t of HILLS) {
    const r = Math.hypot((x - t.x) / t.rx, (z - t.z) / t.rz);
    y = Math.max(y, r <= t.crown ? t.h : r >= 1 ? 0 : t.h * (1 - r) / (1 - t.crown));
  }
  return y;
}
/** How far the nearest clickable object's anchor is; the countryside and the paddies keep off their pads. */
export function objectDistance(x: number, z: number): number {
  let d = 1e9;
  for (const o of VIETNAM_OBJECTS) d = Math.min(d, Math.hypot(x - o.pos[0], z - o.pos[1]));
  return d;
}

/** A flooded, bunded paddy square: a low earth bund round a sheet of still water with young rice in rows. */
function paddySquare(g: THREE.Group, water: THREE.Material, x: number, z: number, w: number, d: number, seed: number) {
  const field = new THREE.Group(); field.name = 'paddy-square'; field.position.set(x, 0, z); g.add(field);
  for (const sx of [-1, 1]) add(field, new THREE.Mesh(new THREE.BoxGeometry(.24, .17, d), mat('#A8956F')), sx * w / 2, .085, 0);
  for (const sz of [-1, 1]) add(field, new THREE.Mesh(new THREE.BoxGeometry(w + .24, .17, .24), mat('#A8956F')), 0, .085, sz * d / 2);
  const sheet = add(field, new THREE.Mesh(new THREE.PlaneGeometry(w - .1, d - .1), water), 0, PADDY_Y, 0);
  sheet.rotation.x = -Math.PI / 2; sheet.receiveShadow = true;
  const rows = Math.max(2, Math.floor(d / .5));
  for (let r = 0; r < rows; r++) for (let c = 0; c < Math.max(2, Math.floor(w / .5)); c++) {
    if ((r + c + seed) % 3 === 0) continue;                                   // the rows are hand-planted, not a printed grid
    const sx = -w / 2 + .35 + c * .5, sz = -d / 2 + .35 + r * .5;
    const shoot = add(field, new THREE.Mesh(new THREE.ConeGeometry(.055, .26, 4), mat((r + c + seed) % 2 ? '#7FBF5A' : '#6F9B57')), sx, .16, sz);
    shoot.rotation.z = ((r * 7 + c * 3 + seed) % 5 - 2) * .05;
  }
}

export function vietnamLandscape(ctx: LayoutCtx) {
  const { group, tickers, tint, TOP } = ctx;

  // ---------- the six cluster tints, laid before anything solid ----------
  tint(-4, -18, 8, 6, '#C9C0A8');             // HN1, the guild street: swept earth and brick dust
  tint(8, -16, 7, 5, '#B9C48A');              // HN2, the Red River craft courtyard: silt green
  tint(16.5, -6.5, 6.5, 5, '#A9B58A');        // CT1, the Huế garden edge
  tint(17.1, -5.4, 2.6, 2.0, '#C4BBA6');      // and its clay tile apron at the veranda
  tint(28, -1, 6, 5.5, '#C4BBA6');            // CT2, Hội An's paving
  tint(30.9, -2.2, 2.6, 2.2, '#EADFBD');      // turning to sand at the quay
  tint(18.2, 14.5, 5.4, 4, '#C9C0A8');        // SG1, Saigon and Chợ Lớn, inside the street's own ring
  tint(-5, 13, 8, 7, '#7FB86A', -.05);        // MK1, the delta's wet green
  tint(-8.5, 16.5, 4, 3.4, '#8FB86A', .1);    // and the flooded ground between the channels
  tint(2, -22.6, 13, 2.2, '#9FB07A');         // the Red River's own damp bank, under the paddies

  // ---------- water: two rivers with their estuaries, three delta channels, the lake and two decor pools ----------
  // The owner's rule for this table (2026-09-21): the dark-to-light blue transition is kept, the same materials
  // and the same estuary blend at every mouth. Fresh upstream, the sea's blue at the mouth.
  const red = estuaryWater(24.3, 0, 3.3, 'x');            // blended from x 21 to the bight
  const perfume = estuaryWater(33, 0, 4, 'x');            // blended from x 29 to the coast
  const delta = estuaryWater(0, 24, 5, 'z');              // blended from z 19 to the southern sea
  const still = freshWater();
  tickers.push(t => { red.uniforms.uTime.value = t; perfume.uniforms.uTime.value = t; delta.uniforms.uTime.value = t; still.uniforms.uTime.value = t; });

  const ribbon = (curve: THREE.CatmullRomCurve3, width: number, rim: number, material: THREE.Material, name: string, segments = 200) => {
    const bank = add(group, new THREE.Mesh(riverGeometry(curve, rim, segments), mat('#D9C89A')), 0, TOP + RIM_Y, 0);
    bank.name = `${name}-bank`; bank.receiveShadow = true;
    const water = new THREE.Mesh(riverGeometry(curve, width, segments), material);
    water.position.y = TOP + (name === 'red-river' || name === 'perfume-river' ? RIVER_Y : CHANNEL_Y);
    water.name = name; water.renderOrder = 2; water.receiveShadow = true; group.add(water);
    return water;
  };
  ribbon(RED_RIVER_CURVE, RED_RIVER_WIDTH, RED_RIVER_RIM, red, 'red-river', 240);
  ribbon(PERFUME_CURVE, PERFUME_WIDTH, PERFUME_RIM, perfume, 'perfume-river', 200);
  ribbon(CHANNEL_CURVES.a, CHANNEL_WIDTH.a, CHANNEL_WIDTH.a + 1.4, delta, 'mekong-channel-a', 160);
  ribbon(CHANNEL_CURVES.b, CHANNEL_WIDTH.b, CHANNEL_WIDTH.b + 1.3, delta, 'mekong-channel-b', 120);
  ribbon(CHANNEL_CURVES.c, CHANNEL_WIDTH.c, CHANNEL_WIDTH.c + 1.3, delta, 'mekong-channel-c', 120);
  addFish(ctx, RED_RIVER_CURVE, [['#D9A441', '#F4E1A1'], ['#8FA3B5', '#D9DEE3'], ['#C9A24A', '#EFE3C0']], 1.2, .3);
  addFish(ctx, CHANNEL_CURVES.a, [['#6F8F6F', '#C9D6B0'], ['#8FA3B5', '#DCD2BC']], 1.0, .28);

  // Hoàn Kiếm lake: a still sheet with a stone kerb, the Turtle Tower's islet left to the stand on the shore.
  const pool = (x: number, z: number, rx: number, rz: number, name: string, kerb: string) => {
    const rim = add(group, new THREE.Mesh(new THREE.CircleGeometry(1, 40), mat(kerb)), x, TOP + RIM_Y, z);
    rim.rotation.x = -Math.PI / 2; rim.scale.set(rx + .34, rz + .34, 1); rim.receiveShadow = true; rim.name = `${name}-kerb`;
    const water = add(group, new THREE.Mesh(new THREE.CircleGeometry(1, 40), still), x, TOP + LAKE_Y, z);
    water.rotation.x = -Math.PI / 2; water.scale.set(rx, rz, 1); water.renderOrder = 2; water.name = name;
    return water;
  };
  pool(HOAN_KIEM.x, HOAN_KIEM.z, HOAN_KIEM.rx, HOAN_KIEM.rz, 'hoan-kiem-lake', '#A8A092');
  // A river may not stop in the middle: the Perfume rises from a spring pool and the delta from a head pool,
  // and each river's first point lies inside its own pool. Both use the same still fresh water as the lake.
  pool(PERFUME_SPRING.x, PERFUME_SPRING.z, PERFUME_SPRING.r, PERFUME_SPRING.r * .8, 'perfume-spring', '#A8A092');
  pool(MEKONG_HEAD.x, MEKONG_HEAD.z, MEKONG_HEAD.r, MEKONG_HEAD.r * .85, 'mekong-head', '#B7A986');
  // The head of the Perfume: stones and reeds at the spring, so the river has a source instead of a cut end.
  for (const [i, [x, z]] of ([[14.6, -10.5], [14.7, -9.4], [15.6, -10.8]] as Pt[]).entries()) {
    const rock = add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(.26 + i * .07, 0), mat('#9A968C')), x, .1, z);
    rock.scale.set(1.3, .55, 1); rock.name = 'spring-rock';
  }

  // ---------- relief: the Red River hills, the coast hill behind the karsts, the Huế garden slope ----------
  for (const h of HILLS) terrace(ctx, h.x, h.z, h.rx, h.rz, h.h, h.colour, h.crown);

  // ---------- the flooded paddy squares ----------
  // The blueprint gives the two bands, not the squares. Each band is walked on a half-unit grid and a square
  // is laid wherever its whole footprint is dry, 3 clear of every clickable anchor, clear of the road
  // corridors, off the slopes and not touching a square already laid. The Red River's own strip is narrow —
  // the river's south bank runs at about z -22.3 and the guild street's ground begins at -21 — so its squares
  // are small and single-file, which is what a dyke-side paddy looks like.
  const bands = [
    { x0: -11, x1: 13, z0: -22.9, z1: -20.6, w: 1.6, d: 1.15, pad: 3.0 },   // the Red River bank, north of HN1 and HN2
    { x0: -11.5, x1: 3.5, z0: 6, z1: 23, w: 1.9, d: 1.6, pad: 3.0 },        // the delta between the channels
  ];
  let seed = 0;
  const laid: Pt[] = [];
  for (const band of bands) {
    for (let x = band.x0 + band.w / 2; x <= band.x1 - band.w / 2; x += .5)
      for (let z = band.z0 + band.d / 2; z <= band.z1 - band.d / 2; z += .5) {
        const reach = Math.hypot(band.w, band.d) / 2;
        if (laid.some(([lx, lz]) => Math.abs(lx - x) < band.w + .35 && Math.abs(lz - z) < band.d + .35)) continue;
        if (corners(x, z, band.w + .5, band.d + .5).some(([cx, cz]) => inVietnamWater(cx, cz))) continue;
        if (objectDistance(x, z) < band.pad) continue;
        if (groundHeight(x, z) > .02) continue;
        if (roadDistance(x, z) < reach + .5) continue;
        if (x < VN_BAND.minX + .8 || x > VN_BAND.maxX - .8) continue;
        paddySquare(group, still, x, z, band.w, band.d, ++seed);
        laid.push([x, z]);
      }
  }

  // ---------- Hạ Long: the karsts stand in the north-east sea, and carry no card ----------
  for (const [x, z, h, r] of [[29.2, -25.6, 6.5, 1.9], [32.4, -24.4, 5, 1.5], [34.8, -26, 7, 2.1], [30.4, -23.2, 4, 1.3], [35.6, -23.6, 5.5, 1.7]] as [number, number, number, number][]) {
    const rock = add(group, karst(h, r), x, TOP + .05, z); rock.rotation.y = x; rock.name = 'halong-karst';
  }
  void VN;
}

const corners = (x: number, z: number, w: number, d: number): Pt[] => [[x - w / 2, z - d / 2], [x + w / 2, z - d / 2], [x + w / 2, z + d / 2], [x - w / 2, z + d / 2], [x, z]];

/** The road table, held here so the landscape can keep the paddies and the countryside off the lanes without
 *  importing the town (which imports this file). `vietnam-town.ts` draws the ribbons from it. */
export type Road = { id: string; width: number; points: Pt[] };
export const VN_ROADS: Road[] = [
  // Seven ends were moved on 2026-09-22, after the owner saw two ribbons stop short of each other at the
  // Saigon street: every end of every route now finishes on another route, on a bridge, at a stand's door or
  // at the table edge, so no end is left hanging in the grass. The moved end is named in each comment.
  { id: 'VN-R1', width: 2.4, points: [[-1.2, -8.6], [-6.9, -13.6], [-5.8, -16.4], [-0.6, -17.2], [1.8, -14.2]] },        // west end on to the herb trays' door
  { id: 'VN-R1b', width: 1.4, points: [[-0.6, -17.2], [-1.8, -19.8], [-0.5, -22.2], [2.2, -22.4], [3.7, -20.4], [2.8, -16.2]] },   // east end carried up to the street carriers
  { id: 'VN-R2', width: 2.0, points: [[1.8, -14.2], [5, -16.4], [8.2, -17.2], [11.4, -16], [12.8, -13]] },
  { id: 'VN-R2b', width: 1.6, points: [[5, -16.4], [5.8, -13.4], [6.3, -9]] },                                        // ends at the lotus tea tray, not past it
  { id: 'VN-R2c', width: 1.4, points: [[2.2, -22.4], [2, -24.4], [2.2, -28]] },                                          // carried to the table edge: the path leaves the table
  { id: 'VN-R3', width: 2.0, points: [[12.8, -13], [10.9, -7.6], [10.6, -1.2], [15.4, -2.7], [19.8, -6.4], [19.6, -10.4]] },
  { id: 'VN-R4', width: 2.2, points: [[19.6, -10.4], [21.9, -10.4], [24.6, -6.2], [23.6, -2.4], [28.6, -2], [30.6, 1.6]] },
  { id: 'VN-R4b', width: 1.6, points: [[28.6, -2], [29.7, -2.5], [30.4, -2.8]] },                                        // ends at the quay's door
  { id: 'VN-R5', width: 2.4, points: [[17.6, 10.8], [14.2, 13.2], [14.7, 15.8], [17.9, 17], [20.3, 15.2], [20, 12], [17.6, 10.8]] },   // a ring: drawn closed
  { id: 'VN-R6', width: 2.0, points: [[30.6, 1.6], [28.4, 8.9], [23.8, 9.6], [19.4, 7.8], [20, 12]] },
  { id: 'VN-R7', width: 1.8, points: [[-9.1, 9.8], [-8.4, 10.4], [-4.8, 4.6], [-1.5, 10.6], [-0.6, 16]] },                // west end at the chicken yard's door
  { id: 'VN-R7b', width: 1.4, points: [[-8.4, 10.4], [-9.6, 14.2], [-10.6, 18.4]] },                                     // ends at the river-fish basket
  { id: 'VN-R8', width: 1.8, points: [[-0.6, 16], [4.8, 18.6], [6.6, 17.5], [9, 11.7], [14.2, 13.2]] },
];
/** Deck centres. A road may touch the water only inside one of these. The blueprint names three; the fourth,
 *  on VN-R3 where the Huế river road turns north to the citadel, is added here because that road crosses the
 *  Perfume at [19.7, -8.0] and the blueprint gives it no crossing. Both the road and the river are fixed, so
 *  the crossing gets a bridge rather than a ford. */
export const VN_BRIDGES: Pt[] = [[2, -24.4], [24.6, -6.2], [-9.7, 15.5], [19.7, -8.0]];
export const BRIDGE_SPAN = 5.4;

/** Distance from a point to the nearest road centreline, minus that road's half width. */
export function roadDistance(x: number, z: number): number {
  let best = 1e9;
  for (const road of VN_ROADS) for (let i = 0; i < road.points.length - 1; i++) {
    const [ax, az] = road.points[i], [bx, bz] = road.points[i + 1];
    const ex = bx - ax, ez = bz - az, l2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2));
    best = Math.min(best, Math.hypot(x - ax - ex * t, z - az - ez * t) - road.width / 2);
  }
  return best;
}
/** Ground a tree or a piece of decor of radius `r` may stand on: the whole of its own footprint is dry, it is
 *  `pad` clear of every clickable anchor, `lane` clear of every road corridor and inside Vietnam's band. */
export function freeGround(x: number, z: number, pad = 2.6, lane = 1.6, r = 1.1): boolean {
  if (objectDistance(x, z) < pad || roadDistance(x, z) < lane) return false;
  if (x < VN_BAND.minX + r + .4 || x > VN_BAND.maxX - r - .4 || Math.abs(z) > TABLE.maxZ - r - .4) return false;
  // The corners of the crown's own box, not just its circle: a crown that clears the shore on the diagonal
  // still puts its bounding box in the water, and the box is what the harness reads.
  for (const dx of [-r, 0, r]) for (const dz of [-r, 0, r]) if (inVietnamWater(x + dx, z + dz)) return false;
  return true;
}

/** A point on the deck of one of the three bridges? Walkers and road surfaces may be over water only there. */
export const onBridge = (x: number, z: number) => VN_BRIDGES.some(([bx, bz]) => Math.hypot(x - bx, z - bz) < BRIDGE_SPAN / 2 + 1.4);

export type { P };
