/** The land between the British clusters: oak and hornbeam along the south coast, the hop gardens' bine rows
 *  on their wirework, hedged and ditched fields between the Weald and the river, drystone walls climbing the
 *  dale yard, moor and bracken between the Firths and the Dales, barley on the Firths' shore
 *  behind the distillery, peat cut in lines, granite hedgebanks and gorse over the West Country, and the cider
 *  orchard's rows above the channel.
 *
 *  Decorative only. Every crop or animal that carries a card — the hop garden of `hopsUk`, the flock of
 *  `sheepUk`, the orchard of `orchardUk`, the leek bed of `leeksUk`, the oat field of `oatsUk`, the wood of
 *  `mushroomsCe` — belongs to the Stand maker's `props-london.ts`; what is here is the country around them.
 */
import * as THREE from 'three';
import { add, mat, mountain, type P } from './props';
import { LD, drystoneRun } from './london-architecture';
import { distToRoads, isWet, objectDistance, tryPlace, LD_ROADS } from './london-landscape';
import { W } from './london-warp';
import type { LayoutCtx } from './worldkit';

/** An English oak: a short thick bole and a broad, heavy, lobed crown that spreads wider than it is tall. */
function oak(s = 1): P {
  const g = new THREE.Group(), h = 2.0 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.22 * s, .38 * s, h, 9), mat('#5A4A38')), 0, h / 2, 0);
  for (const [i, a] of [.4, 2.1, 3.9, 5.4].entries())
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09 * s, .14 * s, .9 * s, 6), mat('#5A4A38')), Math.cos(a) * .3 * s, h + .3 * s, Math.sin(a) * .3 * s).rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5 + i * 0);
  for (const [i, [x, y, z, r]] of ([[0, h + 1.0, 0, 1.35], [.9, h + .62, .5, .82], [-.85, h + .7, -.45, .78], [.2, h + .5, -.95, .7]] as [number, number, number, number][]).entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#4F6B33' : '#5E7A3C')), x * s, y * s, z * s);
    crown.scale.set(1.3, .72, 1.25);
  }
  const t = g as P;
  t.userData.tick = (time: number) => { g.rotation.z = Math.sin(time * .4 + h) * .012; };
  return t;
}

/** A hornbeam: taller, narrower and more upright than an oak, the tree the Weald was coppiced for. */
function hornbeam(s = 1): P {
  const g = new THREE.Group(), h = 2.6 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.14 * s, .24 * s, h, 8), mat('#6E6250')), 0, h / 2, 0);
  for (const [i, [x, y, z, r]] of ([[0, h + .8, 0, .95], [.5, h + .35, .3, .6], [-.45, h + .45, -.3, .58]] as [number, number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#456B33' : '#53793D')), x * s, y * s, z * s).scale.set(1.0, 1.15, 1.0);
  return g as P;
}

/** A standard cider apple: a low open goblet on a short trunk, with fruit in it and windfalls at the foot. */
function appleTree(s = 1, fruit = true): P {
  const g = new THREE.Group(), h = 1.1 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.14 * s, .2 * s, h, 8), mat('#6B5240')), 0, h / 2, 0);
  for (const a of [.5, 2.2, 3.8, 5.3]) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.06 * s, .09 * s, .7 * s, 5), mat('#6B5240')), Math.cos(a) * .22 * s, h + .28 * s, Math.sin(a) * .22 * s).rotation.set(Math.sin(a) * .6, 0, -Math.cos(a) * .6);
  const crown = add(g, new THREE.Group(), 0, h + .62 * s, 0);
  for (const [i, [x, z, r]] of ([[0, 0, .78], [.46, .28, .48], [-.42, -.26, .45]] as [number, number, number][]).entries())
    add(crown, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#587C3E' : '#4B6E36')), x * s, 0, z * s).scale.set(1.2, .8, 1.2);
  if (fruit) for (let k = 0; k < 6; k++) add(crown, new THREE.Mesh(new THREE.SphereGeometry(.075 * s, 6, 5), mat(k % 2 ? '#B9452E' : '#C9922E')), Math.cos(k * 1.05) * .55 * s, -.14 * s, Math.sin(k * 1.05) * .55 * s);
  for (let k = 0; k < 3; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.07 * s, 6, 5), mat('#A8542E')), (k - 1) * .35 * s, .06, .5 * s + (k % 2) * .2);
  const t = g as P;
  t.userData.tick = (time: number) => { crown.rotation.z = Math.sin(time * .55 + h) * .022; };
  return t;
}

/** A gorse bush: a low, dense, rounded cushion, wider than it is tall, dark green and thick with yellow flower
 *  on its crown. Built from smooth lumps pressed together so it has no points: the old one, of sharp
 *  low-detail lumps and flowers round its rim, read from above as a starfish (walkthrough item 8, 2026-09-23). */
function gorse(s = 1): P {
  const g = new THREE.Group();
  for (const [i, [x, z, r]] of ([[0, 0, .42], [.3, .14, .3], [-.28, .18, .28], [.06, -.28, .27], [-.16, -.16, .24]] as [number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 2), mat(i % 2 ? '#3E5230' : '#465C36')), x * s, r * s * .5, z * s).scale.set(1.15, .62, 1.15);
  for (let k = 0; k < 9; k++) { const a = k * 2.4, r = (k % 3) * .11; add(g, new THREE.Mesh(new THREE.SphereGeometry(.05 * s, 6, 4), mat(k % 2 ? '#D9B33A' : '#E4C24A')), Math.cos(a) * r * s, (.34 - r * .35) * s, Math.sin(a) * r * s); }
  return g as P;
}

/** Bracken: a low, rounded spread of fronds, bronze on the outside where it has turned and green in the middle,
 *  lying on the moor as a drift rather than standing up. Soft domes only: the old clump of six flat blades set
 *  radially read as a little palm tree or a starfish (walkthrough item 8, 2026-09-23). */
function bracken(s = 1): P {
  const g = new THREE.Group();
  for (const [i, [x, z, r]] of ([[0, 0, .34], [.3, .1, .26], [-.26, .14, .24], [.05, -.24, .22]] as [number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 2), mat(['#6E6A32', '#8A6A34', '#7A7036', '#94703A'][i])), x * s, r * s * .35, z * s).scale.set(1.3, .5, 1.15);
  return g as P;
}


/** A granite hedgebank: the West Country's field wall, stone laid in herringbone with turf and gorse on top. */
function hedgebankStone(length: number): P {
  const g = new THREE.Group();
  for (let i = 0; i < Math.max(4, Math.round(length / .42)); i++) {
    const s = add(g, new THREE.Mesh(new THREE.BoxGeometry(.38, .3, .52), mat(i % 2 ? '#9B9691' : '#8E8984')), -length / 2 + .21 + i * .42, .16, 0);
    s.rotation.z = i % 2 ? .38 : -.38;
  }
  add(g, new THREE.Mesh(new THREE.BoxGeometry(length, .12, .48), mat('#6E7A45')), 0, .36, 0);
  return g as P;
}

/** A peat stack: turves set on edge in a herringbone so the wind dries them, in a line on the cut bank. */
function peatStack(): P {
  const g = new THREE.Group();
  for (let row = 0; row < 3; row++) for (let i = 0; i < 5 - row; i++) {
    const t = add(g, new THREE.Mesh(new THREE.BoxGeometry(.3, .1, .18), mat(row % 2 ? '#4A3A2C' : '#3E3226')), -.6 + i * .3 + row * .15, .06 + row * .13, 0);
    t.rotation.x = (i % 2 ? .5 : -.5);
  }
  return g as P;
}


/** A hop row: two twelve-foot chestnut poles, the wirework between them and four bines twisted up the strings.
 *  The bines sway; the poles do not. */
function hopRow(length = 2.6): P {
  const g = new THREE.Group(), h = 3.3;
  for (const x of [-length / 2, length / 2]) {
    const pole = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.06, .09, h, 6), mat('#7A6045')), x, h / 2, 0);
    pole.rotation.z = x < 0 ? .04 : -.04;
  }
  add(g, new THREE.Mesh(new THREE.BoxGeometry(length, .03, .03), mat('#6B6357')), 0, h - .08, 0);
  const bines: THREE.Object3D[] = [];
  for (let i = 0; i < 4; i++) {
    const x = -length / 2 + (i + .5) * length / 4;
    const bine = add(g, new THREE.Group(), x, 0, 0); bines.push(bine);
    add(bine, new THREE.Mesh(new THREE.CylinderGeometry(.022, .03, h - .2, 5), mat('#6F7F3E')), 0, (h - .2) / 2, 0);
    for (let k = 0; k < 7; k++) {
      const leaf = add(bine, new THREE.Mesh(new THREE.BoxGeometry(.3, .02, .16), mat(k % 2 ? LD.hopGreen : '#6B7A3E')), 0, .5 + k * (h - .9) / 6, 0);
      leaf.rotation.y = k * 1.3; leaf.position.x += Math.cos(k * 1.3) * .16; leaf.position.z += Math.sin(k * 1.3) * .16;
    }
    for (let k = 0; k < 4; k++) add(bine, new THREE.Mesh(new THREE.ConeGeometry(.055, .12, 5), mat('#93A25A')), Math.cos(k * 1.7) * .12, h - .5 - (k % 2) * .35, Math.sin(k * 1.7) * .12);
  }
  const row = g as P;
  row.userData.keepOffDoors = true;
  row.userData.tick = (t: number) => bines.forEach((b, i) => { b.rotation.z = Math.sin(t * .8 + i) * .028; b.rotation.x = Math.cos(t * .7 + i) * .022; });
  return row;
}

/** A strip of barley: stems with a nodding ear, in a block on the coastal strip. */
function barleyTuft(): P {
  const g = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const x = (i % 3 - 1) * .2, z = (Math.floor(i / 3) - 1) * .2;
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.012, .016, .52, 4), mat('#B8A96E')), x, .26, z);
    const ear = add(g, new THREE.Mesh(new THREE.ConeGeometry(.035, .18, 5), mat('#D2BE7E')), x, .58, z);
    ear.rotation.z = (i % 2 ? .3 : -.3);
  }
  return g as P;
}

export function londonCountryside(ctx: LayoutCtx) {
  const { group, tickers } = ctx;
  /** Dry ground, off the road, and outside every clickable's approach. `tryPlace` re-tests the box the plant
   *  actually occupies, so this is only the cheap first pass. */
  const free = (x: number, z: number, clear: number) => !isWet(x, z) && distToRoads(x, z) > clear && objectDistance(x, z) > 2.8;
  /** Walk a grid over a region, plant what fits and stop at `max`. The blueprint gives the regions as corners;
   *  which square of each one is free is settled by the water, the roads and the stands, not by hand. */
  const scatter = (build: (i: number) => P, name: string, ox0: number, ox1: number, oz0: number, oz1: number, step: number, max: number, clear = 1.5, row?: number) => {
    // the region is written in the old frame and carried with its cluster (london-warp.ts)
    const [x0, z0] = W(ox0, oz0, row), [x1, z1] = W(ox1, oz1, row);
    let n = 0, i = 0;
    for (let z = z0; z <= z1 && n < max; z += step) for (let x = x0; x <= x1 && n < max; x += step) {
      i++;
      const jx = x + Math.sin(i * 2.7) * step * .3, jz = z + Math.cos(i * 1.9) * step * .3;
      if (!free(jx, jz, clear)) continue;
      const t = tryPlace(ctx, build(i), jx, jz, jx + jz);
      if (t) { t.name = name; n++; }
    }
    return n;
  };
  /** A run of wall or bank laid along a line, broken into segments so each one is tested on its own ground. */
  const runAlong = (build: (len: number) => P, name: string, oa: [number, number], ob: [number, number], seg: number, gapEvery = 0) => {
    const a = W(...oa), b = W(...ob);
    const dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz), steps = Math.max(1, Math.round(length / seg));
    const rot = Math.atan2(dx, dz) + Math.PI / 2;
    let n = 0;
    for (let k = 0; k < steps; k++) {
      if (gapEvery && k % gapEvery === gapEvery - 1) continue;                     // a gap where a gate or a track goes through
      const t = (k + .5) / steps, x = a[0] + dx * t, z = a[1] + dz * t;
      const piece = tryPlace(ctx, build(length / steps), x, z, rot);
      if (piece) { piece.name = name; n++; }
    }
    return n;
  };

  // Re-cluster pass (2026-09-23): the regions below are the open country between the six clusters and the few spots
  // inside a cluster that hide nothing. `tryPlace` re-tests every piece against the water, the roads, every stand's
  // pad and room approach and every stand's ten arrival rays, so a region only says where the country is, not what
  // fits in it. The owner's rule: sheep, hay and farm decor only in the Dales and the West Country, so the drystone
  // walls are in the dale yard at the Dales' west edge, the granite hedgebanks and the orchard trees are in the West
  // Country, and the moor between the Firths and the Dales carries only bracken and gorse.

  // ---------- the dale yard and the moor between the Firths and the Dales ----------
  // UK re-lay: the dale yard's walls and moor stood west of the north row's column cut; written 0.5 east of it, so they
  // move with the Dales and keep their places beside the yard
  for (const [a, b] of [[[-55.9, -19.2], [-53.4, -19.2]], [[-55.9, -12.3], [-53.3, -12.3]]] as [number, number][][])
    runAlong(len => drystoneRun(len), 'drystone-wall', a as [number, number], b as [number, number], 1.8, 0);
  scatter(i => bracken(.9 + (i % 3) * .12), 'moor-bracken', -55.9, -53.2, -19.0, -12.6, 1.1, 10, 1.4);
  scatter(i => gorse(.9 + (i % 3) * .12), 'moor-gorse', -55.9, -53.2, -18.6, -12.8, 1.4, 4, 1.4);
  // peat cut in lines on the Firths' shore road, between the distillery and the Firth of Forth
  for (let line = 0; line < 2; line++) for (let i = 0; i < 3; i++) {
    const stack = tryPlace(ctx, peatStack(), ...W(-65.9 + i * 1.0, -21.4 + line * .8), .1 + line * .05);
    if (stack) stack.name = 'peat-stack';
  }
  scatter(() => barleyTuft(), 'barley', -67.8, -63.4, -22.4, -20.6, .9, 10, .8);

  // ---------- the Weald: a hop row and hedged country on the east bank of the river ----------
  for (const [x, z] of [[-42.8, 6.5], [-37.4, 6.6], [-42.6, 7.4]] as [number, number][]) {
    const row = tryPlace(ctx, hopRow(2.0), ...W(x, z), 0); if (row) row.name = 'hop-row';
  }
  scatter(i => oak(.85 + (i % 3) * .1), 'weald-oak', -52.4, -50.8, -0.8, 3.0, 1.6, 2, 1.0);
  scatter(i => hornbeam(.85 + (i % 2) * .15), 'weald-hornbeam', -36.9, -36.0, -10.0, -7.6, 1.2, 2, .8, 1);   // with the Weald

  // ---------- the West Country: granite hedgebanks, gorse and cider trees between the tarn and the channel ----------
  for (const [a, b] of [[[-77.0, 10.4], [-74.0, 10.4]]] as [number, number][][])
    runAlong(len => hedgebankStone(len), 'granite-hedgebank', a as [number, number], b as [number, number], 1.5, 0);
  scatter(i => appleTree(.7 + (i % 2) * .05), 'orchard-tree', -79.6, -57.5, 9.6, 26.4, .5, 3, .6);
  scatter(i => gorse(.95 + (i % 3) * .1), 'west-gorse', -79.6, -73.8, 9.8, 10.9, 1.1, 6, .8);
  scatter(i => gorse(.95 + (i % 3) * .1), 'west-gorse', -79.6, -78.0, 15.6, 18.6, 1.1, 3, .8);

  // ---------- Westminster's river bank and the moor road's verges ----------
  scatter(i => bracken(.9 + (i % 3) * .12), 'moor-bracken', -69.3, -65.6, -12.0, -11.0, 1.0, 4, .8);
  void group;
}

// ---------------------------------------------------------------------------------------------------------
// The country that parts the clusters (UK re-lay, 2026-09-24). The owner: "can't tell where one area belongs vs
// another. China has a clear area for Sichuan, separated by mountains from Xinjiang." Each gap the warp opened
// (london-warp.ts) is given a landscape a visitor reads at a glance: the Highlands between the Firths and England,
// the Southern Uplands between the Firths and the Dales, the Pennines under the Dales, the North Downs and the
// Thames between the Weald and London, moorland between Westminster and the West Country and again between the West
// Country and the Docks, and a wood north of the Docks with the river and its estuary round it. Coordinates here are
// in the new frame. Every piece goes through `tryPlace` (water, roads, pads, room approaches, the ten rays) and keeps
// 0.9 of clear ground from every road's edge, so no walker brushes a hillside.
// ---------------------------------------------------------------------------------------------------------

/** A rounded hill: a half-ellipsoid of turf, darker at the foot, with an optional tor of grey granite on its crown.
 *  Low and smooth: the Downs, the moors and the fells, as opposed to `mountain`'s peaks. */
function dome(rx: number, rz: number, h: number, turf: string, foot: string, tor = false): P {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute, colors: number[] = [];
  const top = new THREE.Color(turf), low = new THREE.Color(foot);
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), a = Math.atan2(pos.getZ(i), pos.getX(i));
    const wob = 1 + Math.sin(a * 3 + rx) * .05 * (1 - y);
    pos.setX(i, pos.getX(i) * wob); pos.setZ(i, pos.getZ(i) * wob);
    const c = low.clone().lerp(top, Math.min(1, y * 1.6)); colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const hill = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .95 }));
  hill.scale.set(rx / 1.06, h, rz / 1.06); hill.receiveShadow = true; hill.castShadow = true; g.add(hill);
  if (tor) for (const [dx, dz, s, k] of [[-.25, .1, .42, 0], [.2, -.12, .36, 1], [.02, .3, .28, 2]] as [number, number, number, number][]) {
    const rock = add(g, new THREE.Mesh(new THREE.BoxGeometry(s * 1.3, s, s), mat(k % 2 ? '#8E8A82' : '#9C978E')), dx * rx * .4, h - .12 + s * .4, dz * rz * .4);
    rock.rotation.y = k * .7; rock.rotation.z = (k - 1) * .12;
  }
  return g as P;
}

export function londonUplands(ctx: LayoutCtx) {
  const { group, tint } = ctx;
  // The ground of each separating landscape, laid before its hills: muted upland green, pale chalk downland, heather
  // brown for the moors, the deep green of the wood.
  tint(-67.0, -5.2, 13.5, 4.6, '#7f9670');   // the Highlands
  tint(-47.0, -20.0, 5.6, 7.2, '#7f9670');   // the Southern Uplands
  tint(-35.5, -3.8, 16.0, 4.8, '#95a06c');   // the Pennines
  tint(-45.2, 11.6, 7.6, 6.0, '#a9c47a');    // the North Downs
  tint(-67.5, 31.0, 11.5, 5.4, '#8c7a66');   // Exmoor, between Westminster and the West Country
  tint(-48.8, 40.0, 6.0, 3.8, '#8c7a66');    // Dartmoor, between the West Country and the Docks
  tint(-45.5, 29.0, 8.5, 4.6, '#6a8f4c');    // the wood north of the Docks

  /** Distance from a box's ground footprint to the nearest road's edge. */
  const roadGap = (b: THREE.Box3) => {
    let d = 1e9;
    for (const r of LD_ROADS) for (let i = 0; i < r.points.length - 1; i++) {
      const [ax, az] = r.points[i], [bx, bz] = r.points[i + 1], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) * 2));
      for (let k = 0; k <= n; k++) {
        const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
        const gx = Math.max(b.min.x - x, 0, x - b.max.x), gz = Math.max(b.min.z - z, 0, z - b.max.z);
        d = Math.min(d, Math.hypot(gx, gz) - r.width / 2);
      }
    }
    return d;
  };
  const put = (name: string, o: P, x: number, z: number, rot = 0, gap = .9) => {
    const placed = tryPlace(ctx, o, x, z, rot);
    if (!placed) return null;
    const b = new THREE.Box3().setFromObject(placed);
    if (roadGap(b) < gap) { group.remove(placed); return null; }
    placed.name = name; return placed;
  };

  // ---------- the Highlands, between the Firths and England: a wall of peaks from the west coast to the pass road ----------
  for (const [x, z, r, h, dark] of [[-75.8, -5.4, 3.0, 5.0, true], [-67.4, -5.0, 3.2, 5.4, false], [-59.6, -5.3, 3.0, 4.8, true]] as [number, number, number, number, boolean][])
    put('uk-highland', mountain(r, h, dark), x, z, 0);
  for (const [x, z] of [[-71.6, -3.2], [-63.4, -2.8]] as [number, number][]) put('uk-highland', dome(2.0, 1.6, 1.6, '#7c9068', '#6c8058'), x, z);

  // ---------- the Southern Uplands, between the Firths and the Dales: the tallest hills on the table ----------
  for (const [x, z, r, h, dark] of [[-48.2, -24.0, 2.0, 6.8, true], [-43.6, -24.1, 2.1, 6.2, false], [-48.6, -15.9, 1.9, 5.2, false], [-44.3, -15.9, 1.7, 4.4, true]] as [number, number, number, number, boolean][])
    put('uk-upland', mountain(r, h, dark), x, z, 0);

  // ---------- the Pennines, under the Dales: a long chain of fells ----------
  for (const [x, z, r, h, dark] of [[-46.2, -3.6, 3.1, 5.2, false], [-37.4, -3.4, 3.2, 5.6, true], [-28.6, -3.6, 3.0, 5.0, false]] as [number, number, number, number, boolean][])
    put('uk-pennine', mountain(r, h, dark), x, z, 0);
  put('uk-pennine', dome(2.2, 2.0, 2.2, '#8e9a62', '#7a8652', true), -22.6, -4.6);

  // ---------- the North Downs, between the Weald and London, and the Thames below them ----------
  put('uk-downs', dome(6.6, 2.2, 2.0, '#b6cc86', '#94ad68'), -45.2, 7.0);
  put('uk-downs', dome(4.0, 1.35, 1.2, '#b6cc86', '#94ad68'), -45.2, 14.3);

  // ---------- the moors: Exmoor between Westminster and the West Country, Dartmoor between it and the Docks ----------
  for (const [x, z, rx, rz, h] of [[-75.4, 30.2, 3.8, 2.8, 2.6], [-66.8, 32.2, 4.4, 3.0, 3.0], [-59.8, 30.6, 2.7, 3.0, 2.3], [-71.0, 26.2, 2.4, 1.6, 1.4]] as [number, number, number, number, number][])
    put('uk-moor', dome(rx, rz, h, '#8a8458', '#6f6a48', h > 2), x, z);
  put('uk-moor', dome(5.2, 3.0, 2.6, '#8a8458', '#6f6a48', true), -48.8, 39.6);
  for (const [x, z, rx, rz, h] of [[-52.2, 48.4, 1.8, 1.4, 1.0], [-45.8, 48.6, 2.0, 1.4, 1.1]] as [number, number, number, number, number][])
    put('uk-moor', dome(rx, rz, h, '#8a8458', '#6f6a48'), x, z);
  const heath = (i: number) => (i % 2 ? gorse(.95 + (i % 3) * .1) : bracken(.9 + (i % 3) * .12));
  let k = 0;
  for (const [x0, x1, z0, z1] of [[-79.0, -57.5, 24.5, 36.5], [-54.0, -43.0, 36.5, 43.5]] as [number, number, number, number][])
    for (let z = z0; z <= z1; z += 2.1) for (let x = x0; x <= x1; x += 2.3) {
      k++; const jx = x + Math.sin(k * 2.7) * .6, jz = z + Math.cos(k * 1.9) * .6;
      if (isWet(jx, jz) || distToRoads(jx, jz) < 1.6 || objectDistance(jx, jz) < 3) continue;
      put(k % 2 ? 'moor-gorse' : 'moor-bracken', heath(k), jx, jz, k);
    }

  // ---------- the wood north of the Docks, with the river round two sides of it ----------
  k = 0;
  for (let z = 24.6; z <= 34.0; z += 2.3) for (let x = -53.0; x <= -37.5; x += 2.4) {
    k++; const jx = x + Math.sin(k * 2.3) * .7, jz = z + Math.cos(k * 1.7) * .7;
    if (isWet(jx, jz) || distToRoads(jx, jz) < 1.8 || objectDistance(jx, jz) < 3.5) continue;
    put('uk-wood', k % 3 ? oak(.8 + (k % 3) * .1) : hornbeam(.9), jx, jz, k);
  }
  for (const [x, z] of [[-50.5, 47.6], [-47.6, 49.4], [-44.2, 47.4]] as [number, number][]) put('uk-wood', oak(.8), x, z, x);
}
