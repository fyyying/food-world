/** Spanish ground, water and relief on the grown Mediterranean table: one continuous sea with a per-vertex beach rim,
 *  the river with its estuary, the irrigation channel, the Alhambra terrace, the windmill ridge, olive ledges, rock. */
import * as THREE from 'three';
import { add, mat, cyl } from './props';
import { terrace, terraceStairs } from './turkey-landscape';
import { riverGeometry, seaWater, estuaryWater, type LayoutCtx } from './worldkit';
import { SP } from './spain-architecture';

export type Pt = [number, number];
/** Table edges after the growth to W 120, D 56, cx -22. */
export const TABLE = { minX: -82, maxX: 38, minZ: -28, maxZ: 28 };
export const atEdgeX = (x: number) => x <= TABLE.minX || x >= TABLE.maxX;
export const atEdgeZ = (z: number) => Math.abs(z) >= TABLE.maxZ;

/** Sea vertices, clockwise from the north-west corner: the north strip over Spain, the strait, the old sea, the Spanish shore.
 *  The Cantabrian, ria and Catalan vertices sit north and east of the blueprint line, because the blueprint's own line
 *  puts pulpoEs, horreoEs, pintxosEs and gaudiEs in the water. See the status note. */
export const SEA_SHORE: Pt[] = [
  [-82, -28], [-18, -28],
  [-18, -23], [-16.5, -20], [-18, -15.5], [-18, -14], [-17, -11],
  [-8, -14], [4, -15], [16, -14], [28, -15], [38, -14], [38, 28], [16, 28], [14, 22], [12, 14], [2, 12], [-8, 11],
  [-14, 12], [-17.6, 10], [-18.4, 6], [-17.6, 0], [-18.6, -6], [-20.2, -11], [-20.6, -16], [-18.9, -20], [-19.2, -22], [-21.6, -23.8],
  [-26, -25], [-32, -26.4], [-40, -26.8], [-47, -26.8], [-51, -26.2], [-54, -23], [-56, -19], [-57.5, -15.5],
  [-60, -19], [-62, -22], [-70, -22.5], [-82, -22.5],
];
/** The river from the western table edge to the bay; the last points run under the sea so the join is hidden.
 *  The two western points share a z so the cap at the edge is square. */
export const RIVER_POINTS: Pt[] = [
  [-82, -15], [-77, -15], [-71, -13.2], [-65, -11.4], [-60, -9], [-57, -6], [-55.5, -2.5], [-54, 0.8],
  [-50, 3.4], [-46, 5.0], [-42, 5.4], [-35, 5.6], [-28, 5.0], [-23, 5.0], [-19, 4.9], [-17.4, 4.9],
];
export const RIVER_WIDTH = 2.4;
export const RIVER_CURVE = new THREE.CatmullRomCurve3(RIVER_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
/** The acequia leaves the river east of the Valencia lane and runs north towards the paddies. */
export const CHANNEL_POINTS: Pt[] = [[-22.6, 5.4], [-22.8, 9], [-23.2, 11]];
export const CHANNEL_CURVE = new THREE.CatmullRomCurve3(CHANNEL_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)));
export const CHANNEL_WIDTH = .65;
/** Raised ground: centre, radii, height. The crown fraction gives the flat top. */
export const ALHAMBRA_TERRACE = { x: -56, z: 22, rx: 7.5, rz: 5, h: 1.2, crown: .88 };
export const WINDMILL_RIDGE = { x: -76, z: -8, rx: 4.6, rz: 3.2, h: .8, crown: .8 };
/** Heights: tints end near .012, town paving .018, squares .027, the beach rim .030, the twelve roads .036 to .080,
 *  the sea .06, the river .09. Each step is .004, the distance at which two flat surfaces stop z-fighting. */
export const SEA_Y = .06, RIM_Y = .03, RIVER_Y = .09, CHANNEL_Y = .094;
/** How far a bridge deck, and a walker on it, stands above the lane so the river passes underneath. */
export const ROAD_LIFT = .22;

export function inPolygon(x: number, z: number, poly: Pt[]): boolean {
  let yes = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[i], [bx, bz] = poly[j];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) yes = !yes;
  }
  return yes;
}
/** The shore as drawn: a small index-driven wobble away from the table edges, exactly as the mesh is built. */
export function seaOutline(): Pt[] {
  return SEA_SHORE.map(([x, z], i) => [atEdgeX(x) ? x : x + Math.sin(i * 2.7) * .2, atEdgeZ(z) ? z : z + Math.cos(i * 1.9) * .2]);
}
/** Each vertex moves outward along the bisector of its two edge normals; edge coordinates stay put so caps remain square. */
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
    // The miter offset is 2 d m / |m| squared; a very sharp corner is capped at twice the offset.
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
export const riverOutline = () => ribbonOutline(RIVER_CURVE, RIVER_WIDTH);
export const channelOutline = () => ribbonOutline(CHANNEL_CURVE, CHANNEL_WIDTH);

function shape(points: Pt[]): THREE.Shape {
  const sh = new THREE.Shape(); points.forEach(([x, z], i) => i ? sh.lineTo(x, z) : sh.moveTo(x, z)); sh.closePath(); return sh;
}
/** Height of the raised ground at a point, for anything that stands on a terrace slope. */
export function terraceHeight(x: number, z: number, t = ALHAMBRA_TERRACE): number {
  const r = Math.hypot((x - t.x) / t.rx, (z - t.z) / t.rz);
  return r <= t.crown ? t.h : r >= 1 ? 0 : t.h * (1 - r) / (1 - t.crown);
}

export function spainLandscape(ctx: LayoutCtx) {
  const { group, tickers, tint, TOP } = ctx;
  // Ground tints per cluster, laid before anything solid.
  tint(-43.5, -4, 11, 8, '#d9c9a8');          // the town around the Plaza Mayor
  tint(-28, 8, 12, 9, '#c9c08a', .05);        // dry gold round the huerta
  tint(-50, 14, 10, 7, '#e5dcc6', -.05);      // lime-washed lanes on the low hill
  tint(-72, 4, 13, 15, SP.tierraManchega);    // the dry plain
  tint(-52, -16, 12, 8, '#9fb08a', .1);       // wet green above the ria
  tint(-31, -20, 9, 5, '#a9b58a');            // the Cantabrian green
  tint(-23, -17, 5, 6, '#d9cfae');            // turning to render and tile at the corner
  tint(-19.6, 10, 2.2, 3.2, '#e6d9b2');       // the pine sandbar along the bay
  tint(-56, 8, 6, 4, '#b3ad7e');              // the olive slope

  // One sea, one beach rim under it, both mirrored into the x/z plane like the rest of the Mediterranean water.
  const sea = seaWater(), estuary = estuaryWater(-18.5, 5, 9, 'x');
  tickers.push(t => { sea.uniforms.uTime.value = t; estuary.uniforms.uTime.value = t; });
  const outline = seaOutline();
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(shape(offsetOutline(outline, 1.2))), mat('#eee3bf'));
  rim.rotation.x = -Math.PI / 2; rim.scale.y = -1; rim.position.y = TOP + RIM_Y; rim.receiveShadow = true; rim.name = 'sea-rim'; group.add(rim);
  const water = new THREE.Mesh(new THREE.ShapeGeometry(shape(outline)), sea);
  water.rotation.x = -Math.PI / 2; water.scale.y = -1; water.position.y = TOP + SEA_Y; water.receiveShadow = true; water.name = 'sea'; group.add(water);
  // The river and the acequia that feeds the paddies.
  const river = new THREE.Mesh(riverGeometry(RIVER_CURVE, RIVER_WIDTH, 260), estuary); river.position.y = TOP + RIVER_Y; river.name = 'river'; river.receiveShadow = true; group.add(river);
  const channel = new THREE.Mesh(riverGeometry(CHANNEL_CURVE, CHANNEL_WIDTH, 24), estuary); channel.position.y = TOP + CHANNEL_Y; channel.name = 'irrigation-channel'; group.add(channel);
  for (const x of [-23.2, -22.0]) add(group, new THREE.Mesh(new THREE.BoxGeometry(.14, .55, .14), mat(SP.maderaCastano)), x, .27, 5.8);   // the sluice posts
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.35, .08, .12), mat(SP.maderaCastano)), -22.6, .52, 5.8);
  // A low earth bund carries the water on from the head of the channel to the paddy bunds.
  const bund = add(group, new THREE.Mesh(new THREE.BoxGeometry(.5, .14, 2.2), mat('#a8956f')), -23.4, .07, 12.1); bund.rotation.y = .12; bund.name = 'acequia-bund';
  // Reeds and stones along the river, clear of the bridges and the lanes.
  for (const [i, [x, z]] of ([[-52.0, 0.2], [-40.5, 6.4], [-32.5, 3.6], [-25, 3.6], [-20.5, 6.6], [-52.5, -0.4], [-60.2, -6.6], [-67, -10.2]] as Pt[]).entries()) {
    if (i % 2) add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(.22 + (i % 3) * .06, 0), mat('#a3a094')), x, .1, z);
    else for (let k = 0; k < 4; k++) add(group, cyl(.02, .03, .8, '#7f9d55', 4), x + (k - 1.5) * .16, .4, z + (k % 2) * .14);
  }
  // The Alhambra stands on a terrace with its stairs on the north side; the windmills on a ridge with stairs to the south.
  const a = ALHAMBRA_TERRACE, r = WINDMILL_RIDGE;
  terrace(ctx, a.x, a.z, a.rx, a.rz, a.h, '#cdbf9a', a.crown);
  const north = add(group, terraceStairs(a.h, 1.4), a.x, 0, a.z - a.rz + .16); north.rotation.y = Math.PI;
  terrace(ctx, r.x, r.z, r.rx, r.rz, r.h, '#c9b07e', r.crown);
  add(group, terraceStairs(r.h, 1.3), r.x, 0, r.z + r.rz - .16);
  // Olive ledges step up the slope between the west road and the olive spur.
  for (const [i, z] of [7.0, 8.5].entries()) {
    add(group, new THREE.Mesh(new THREE.BoxGeometry(6, .18 + i * .06, 1.1), mat('#b7ad84')), -54, .09 + i * .03, z);
    add(group, new THREE.Mesh(new THREE.BoxGeometry(6, .30, .13), mat('#c9bd9c')), -54, .15, z + .49);   // the kerb stands proud of the ledge, never level with it
  }
  // Granite outcrops break the wet northern ground of the ria.
  // The fourth outcrop sat on the north road at [-45.4, -13.8]; it moved two units east onto the bank.
  for (const [x, z, s] of [[-67.4, -13.4, .8], [-64, -17, .6], [-66.5, -11, .5], [-43.4, -13.6, .45]]) {
    const rock = add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat(SP.granitoGalego)), x, s * .4, z);
    rock.scale.set(1.3, .6, .95); rock.rotation.y = x * .5; rock.name = 'granite-outcrop';
  }
}
