/** The land between the British clusters: oak and hornbeam along the south coast, the hop gardens' bine rows
 *  on their wirework, hedged and ditched fields between the Weald and the river, drystone walls climbing the
 *  fell with the flock's own pen at the top, moor and bracken over the north-west, barley on the coastal strip
 *  behind the distillery, peat cut in lines, granite hedgebanks and gorse over the West Country, and the cider
 *  orchard's rows above the channel.
 *
 *  Decorative only. Every crop or animal that carries a card — the hop garden of `hopsUk`, the flock of
 *  `sheepUk`, the orchard of `orchardUk`, the leek bed of `leeksUk`, the oat field of `oatsUk`, the wood of
 *  `mushroomsCe` — belongs to the Stand maker's `props-london.ts`; what is here is the country around them.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { LD, drystoneRun, fieldGate } from './london-architecture';
import { daleSheep } from './london-people';
import { distToRoads, isWet, objectDistance, tryPlace, tryPlaceAny } from './london-landscape';
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

/** A gorse bush: a dense dark cushion flecked with yellow, the thing that holds a granite hedgebank together. */
function gorse(s = 1): P {
  const g = new THREE.Group();
  for (const [i, [x, z, r]] of ([[0, 0, .46], [.36, .2, .32], [-.3, .26, .3], [.1, -.34, .28]] as [number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 0), mat(i % 2 ? '#3E5230' : '#465C36')), x * s, r * s * .7, z * s).scale.set(1.15, .8, 1.15);
  for (let k = 0; k < 7; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.055 * s, 5, 4), mat('#D9B33A')), Math.cos(k * .9) * .38 * s, (.3 + (k % 3) * .1) * s, Math.sin(k * .9) * .38 * s);
  return g as P;
}

/** Bracken: a clump of low arching fronds, rust at the tips, over the moor. */
function bracken(s = 1): P {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = i * 1.05;
    const frond = add(g, new THREE.Mesh(new THREE.BoxGeometry(.62 * s, .03, .16 * s), mat(i % 3 ? '#556B32' : '#7A6A32')), Math.cos(a) * .18 * s, (.16 + (i % 3) * .04) * s, Math.sin(a) * .18 * s);
    frond.rotation.y = -a; frond.rotation.z = -.3 - (i % 2) * .12;
  }
  return g as P;
}

/** A hedgerow bank with its ditch: an earth bank, thorn on top and a shallow cut on the field side. Under the
 *  height at which anything blocks a view, which is what a laid hedge is. */
function hedgeBank(length: number): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.BoxGeometry(length, .28, .7), mat('#6E6045')), 0, .14, 0);
  for (let i = 0; i < Math.max(3, Math.round(length / .5)); i++)
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.26, 0), mat(i % 2 ? '#405C30' : '#4B6A36')), -length / 2 + .25 + i * .5, .34, (i % 2 ? .06 : -.06)).scale.set(1.1, .75, 1.0);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(length, .06, .34), mat('#5B5140')), 0, .02, .58);   // the ditch on the field side
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

/** A pen of hefted ewes on the fell: four runs of drystone, a gate and three sheep that graze without
 *  travelling. A penned animal does not step. */
function sheepPen(tickers: LayoutCtx['tickers']): P {
  const g = new THREE.Group();
  for (const z of [-1.6, 1.6]) add(g, drystoneRun(4.0, .66), 0, 0, z);
  for (const x of [-2.0, 2.0]) add(g, drystoneRun(3.2, .66), x, 0, 0).rotation.y = Math.PI / 2;
  add(g, fieldGate(1.2), 0, 0, 1.6);
  for (const [i, [x, z, rot]] of ([[-1.0, -.5, .5], [.6, .4, 2.3], [.2, -.9, 4.0]] as [number, number, number][]).entries()) {
    const ewe = add(g, daleSheep(.9 + (i % 2) * .1), x, 0, z); ewe.rotation.y = rot; ewe.name = 'penned-ewe';
    const own = ewe.userData.tick as ((t: number) => void) | undefined;
    ewe.userData.tick = undefined;
    tickers.push((t: number) => { own?.(t + i * 2); ewe.rotation.y = rot + Math.sin(t * .4 + i * 2) * .07; });
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
  const scatter = (build: (i: number) => P, name: string, x0: number, x1: number, z0: number, z1: number, step: number, max: number, clear = 1.5) => {
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
  const runAlong = (build: (len: number) => P, name: string, a: [number, number], b: [number, number], seg: number, gapEvery = 0) => {
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

  // ---------- the Weald: the hop gardens' bine rows, the oak and hornbeam wood on the south coast ----------
  // The blueprint's hop strings run from [-44, 15] to [-39, 20], east of the hop garden the stand works.
  // The blueprint's strings run from [-44, 15] to [-39, 20], which is the ground the hop garden, the oast and
  // the cookhouse stand on themselves; the decorative rows fill the rest of the Weald round them.
  scatter(i => hopRow(2.2 + (i % 3) * .4), 'hop-row', -44, -39, 15, 20, 1.6, 12, 1.3);
  scatter(i => hopRow(2.2 + (i % 3) * .4), 'hop-row', -54, -38, 12, 21, 1.7, 10, 1.3);
  scatter(i => oak(.95 + (i % 3) * .12), 'weald-oak', -50, -44, 19, 22, 1.6, 8, 1.4);
  scatter(i => hornbeam(.9 + (i % 2) * .15), 'weald-hornbeam', -50, -43.5, 18.6, 22, 1.5, 7, 1.4);
  // The wood the blueprint draws along the coast is the mushroom stand's own ground, so the Weald's oak and
  // hornbeam carry on west along the south coast, where nothing else stands.
  scatter(i => oak(.95 + (i % 3) * .12), 'weald-oak', -60, -48, 13, 20.6, 2.0, 10, 1.4);
  scatter(i => hornbeam(.9 + (i % 2) * .15), 'weald-hornbeam', -59, -47, 14, 20.6, 1.9, 8, 1.4);
  // Hedged and ditched fields between the Weald and the river.
  for (const [a, b] of [[[-50, 8.5], [-50, 13.5]], [[-50, 13.5], [-46.8, 13.5]], [[-50.6, 10.8], [-47.2, 10.8]],
    [[-52.4, 8.6], [-52.4, 13.2]], [[-52.4, 13.2], [-50, 13.2]]] as [number, number][][])
    runAlong(len => hedgeBank(len), 'hedge-bank', a as [number, number], b as [number, number], 2.2, 4);
  { const gate = tryPlaceAny(ctx, () => fieldGate(1.3), [[-50, 11.4, 0], [-51.2, 13.5, Math.PI / 2], [-52.4, 11.0, 0]]); if (gate) gate.name = 'field-gate'; }

  // ---------- the Dales: drystone walls climbing the fell, and the flock's own pen at the top ----------
  for (const [a, b] of [[[-63, -10], [-55, -18]], [[-64.4, -13.4], [-58.6, -19.4]], [[-61.6, -8.4], [-64.6, -14.6]],
    [[-56.4, -11.2], [-62.2, -17.6]], [[-66, -11], [-62.4, -17]],
    // and the open fell west of the flock, between the west road and the moor
    [[-71, -10.6], [-64, -10.6]], [[-71, -13.6], [-64, -13.6]], [[-71, -16.6], [-64, -16.6]], [[-67.5, -10.6], [-67.5, -16.6]]] as [number, number][][])
    runAlong(len => drystoneRun(len), 'drystone-wall', a as [number, number], b as [number, number], 2.4, 5);
  { const pen = tryPlaceAny(ctx, () => sheepPen(tickers), [[-64.6, -9.4, .2], [-66.6, -12.2, .1], [-69.4, -12.1, 0], [-69.4, -15.1, 0], [-65.6, -15.1, 0], [-63.4, -7.4, .25], [-67.4, -15.4, .15]]); if (pen) pen.name = 'fell-sheep-pen'; }
  // Ewes hefted on the open fell above the walls, standing still and grazing.
  scatter(i => { const e = daleSheep(.85 + (i % 3) * .08); const own = e.userData.tick as ((t: number) => void) | undefined; e.userData.tick = undefined; tickers.push((t: number) => own?.(t + i)); return e; },
    'fell-ewe', -71, -62, -16, -10, 1.7, 7, 1.3);   // on the open fell, never down on the palace forecourt
  scatter(i => oak(.8 + (i % 2) * .1), 'dale-oak', -66, -54, -8, -4, 2.0, 4, 1.6);

  // ---------- the north-west: moor and bracken, peat cut in lines, barley behind the distillery ----------
  scatter(i => bracken(.8 + (i % 3) * .1), 'moor-bracken', -72, -66, -22, -16, 1.3, 24, 1.2);
  scatter(i => bracken(.8 + (i % 3) * .1), 'moor-bracken', -78, -64, -18, -10, 1.4, 30, 1.2);
  scatter(i => gorse(.9 + (i % 3) * .12), 'moor-gorse', -73, -66, -21.4, -15.4, 1.6, 12, 1.3);
  for (let line = 0; line < 3; line++) for (let i = 0; i < 4; i++) {
    const stack = tryPlace(ctx, peatStack(), -69.4 + i * 1.1, -24.6 + line * .9, .1 + line * .05);
    if (stack) stack.name = 'peat-stack';
  }
  scatter(() => barleyTuft(), 'barley', -72, -66, -25.6, -24.2, .9, 30, 1.1);
  scatter(() => barleyTuft(), 'barley', -64, -59, -25.8, -24.4, .9, 22, 1.1);

  // ---------- the West Country: granite hedgebanks and gorse, and the cider orchard's rows ----------
  for (const [a, b] of [[[-78, 0], [-73, 0]], [[-78, 4.4], [-73.4, 4.4]], [[-77.4, 8.6], [-73, 8.6]],
    [[-78, 12], [-73.4, 12]], [[-75.2, 0], [-75.2, 12]],
    // and the fields east of the west road, between the river and the channel, which the stands leave open
    [[-72, 1.8], [-63, 1.8]], [[-72, 4.8], [-63, 4.8]], [[-71, 7.8], [-63.4, 7.8]], [[-68, 1.8], [-68, 7.8]]] as [number, number][][])
    runAlong(len => hedgebankStone(len), 'granite-hedgebank', a as [number, number], b as [number, number], 2.2, 4);
  scatter(i => gorse(.95 + (i % 3) * .1), 'west-gorse', -78, -73, 0, 12, 1.5, 16, 1.3);
  scatter(i => gorse(.95 + (i % 3) * .1), 'west-gorse', -73, -56, 9, 13, 1.6, 12, 1.3);
  scatter(i => gorse(.95 + (i % 3) * .1), 'west-gorse', -66, -56, 13, 20.5, 1.8, 10, 1.3);
  // The cider orchard's rows above the channel's north shore, west of the beds the orchard stand works.
  scatter(i => appleTree(.95 + (i % 3) * .1), 'orchard-tree', -79.4, -75.2, 5.6, 12.4, 1.5, 10, 1.3);
  // The orchard stand fills the channel's north shore itself, so the rest of the cider country is the fields
  // east of the west road, inside the granite hedgebanks.
  scatter(i => appleTree(.9 + (i % 3) * .1), 'orchard-tree', -72, -63.5, 2.4, 9.6, 1.5, 12, 1.3);
  scatter(i => oak(.9 + (i % 2) * .14), 'moor-oak', -74, -68, 4, 10, 2.0, 5, 1.5);

  // ---------- the cockle sand: the rakes and the withy baskets left on the ebb ----------
  // The blueprint's donkey and cart are not built. The dry flat at the channel head is 2.8 by 2.7 and the
  // cockle stall stands in the middle of it, so every point on it is inside that stall's own 2.5 corridor;
  // and the wet sand west of the head is sea, where nothing may stand. What is left on the sand is the gear,
  // the baskets, which are ground dressing and block nothing.
  for (const [i, [x, z, rot]] of ([[-70.6, 15.9, .4], [-68.9, 16.3, -.3], [-70.2, 13.8, .2]] as [number, number, number][]).entries()) {
    const gear = new THREE.Group();
    add(gear, new THREE.Mesh(new THREE.CylinderGeometry(.16, .12, .2, 9), mat('#C3A86A')), 0, .1, 0);
    for (let k = 0; k < 4; k++) add(gear, new THREE.Mesh(new THREE.SphereGeometry(.045, 6, 5), mat(k % 2 ? '#8B8177' : '#6F6A60')), (k % 2 - .5) * .12, .19, (Math.floor(k / 2) - .5) * .12);
    add(gear, new THREE.Mesh(new THREE.CylinderGeometry(.15, .11, .18, 9), mat('#B39A5E')), .42, .09, .18);   // a second basket, not a rake: a rake on the sand reads as a stick
    const g = tryPlace(ctx, gear, x, z, rot + i * .1); if (g) g.name = 'cockle-gear';
  }

  // ---------- scattered oaks in the hedgerows, which is where an English oak actually stands ----------
  scatter(i => oak(.9 + (i % 3) * .12), 'hedgerow-oak', -56, -40, 8, 16, 2.2, 6, 1.6);
  scatter(i => oak(.85 + (i % 2) * .12), 'westminster-oak', -60, -46, -14, -9, 2.2, 4, 1.7);
  void group;
}
