/** Life in the six regions (owner round, 2026-09-24: "a bit too few things in one region"). The UK re-lay gave each
 *  region room of its own; this fills it with things that are not clickable, as a China area is filled: a street of
 *  terraces in London between Westminster and the Docks, a Kentish village and more hop rows round the Weald, dale
 *  barns, a mill chimney and dry-stone walls in the Dales, and a fenced pasture with cattle and a sheep pen beside the
 *  West Country. Farm animals stand only by the farm regions and always inside a fence. Every building goes through
 *  `placeBuilding` (a unit off every water edge, off the roads, clear of every stand's pad, approach and ten rays),
 *  every other piece through `tryPlace`. Coordinates are in the new frame (london-warp.ts). Built before the uplands
 *  and the country, so they keep clear of these buildings. */
import * as THREE from 'three';
import { add, mat, cow, fence, type P } from './props';
import { sheepPen } from './props-north';
import { ukHouse, drystoneRun, type UkStyle } from './london-architecture';
import { placeBuilding, tryPlace, isWet, distToRoads, objectDistance } from './london-landscape';
import { hopRow } from './london-countryside';
import type { LayoutCtx } from './worldkit';

type Box = [number, number, number, number];

/** Houses of one style on a grid over a region, at least `spacing` apart, the first `count` that pass. */
function village(ctx: LayoutCtx, style: UkStyle, count: number, [x0, x1, z0, z1]: Box, [w, d, h, storeys]: [number, number, number, number?], spacing = 4, name = 'uk-village') {
  const done: [number, number][] = [];
  for (let z = z0; z <= z1 && done.length < count; z += 1.5) for (let x = x0; x <= x1 && done.length < count; x += 1.5) {
    if (done.some(([px, pz]) => Math.hypot(px - x, pz - z) < spacing)) continue;
    if (isWet(x, z) || distToRoads(x, z) < 1.4 || objectDistance(x, z) < 4) continue;
    const built = placeBuilding(ctx, () => ukHouse(style, w, d, h, { storeys }), [[x, z, 0]]);
    if (built) { built.name = name; built.userData.houseStyle = style; done.push([x, z]); }
  }
  return done.length;
}

/** A mill: a brick block with a tall round chimney at its end, the Dales' woollen mills. */
function mill(): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 1.8), mat('#8A5540')), 0, .9, 0);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(3.3, .14, 1.9), mat('#4E4A48')), 0, 1.87, 0);
  for (let i = 0; i < 4; i++) add(g, new THREE.Mesh(new THREE.BoxGeometry(.34, .44, .04), mat('#2F3438')), -1.1 + i * .73, 1.1, .92);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.2, .3, 4.4, 10), mat('#7E4A38')), 1.95, 2.2, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .18, 10), mat('#4E4A48')), 1.95, 4.45, 0);
  return g as P;
}

/** A fenced pasture with two cattle, standing still, grazing inside the rails. */
function pasture(): P {
  const g = new THREE.Group(), w = 4.4, d = 3.2;
  for (const [x, z, len, rot] of [[0, -d / 2, w, 0], [0, d / 2, w, 0], [-w / 2, 0, d, Math.PI / 2], [w / 2, 0, d, Math.PI / 2]] as [number, number, number, number][])
    add(g, fence(len), x, 0, z).rotation.y = rot;
  for (const [x, z, rot, dark] of [[-.9, -.3, .4, false], [1.0, .4, 2.6, true]] as [number, number, number, boolean][]) {
    const c = cow(dark, false, 'Moo!'); c.scale.setScalar(.7); c.position.set(x, 0, z); c.rotation.y = rot; g.add(c);
  }
  return g as P;
}

export function londonLife(ctx: LayoutCtx) {
  // ---------- London: terraces between Westminster and the Docks, so the two are one town on the river ----------
  village(ctx, 'londonTerrace', 5, [-54.5, -37.5, 4.0, 19.0], [3.4, 1.6, 1.3, 2], 4.2);
  // ---------- the Weald: a Kentish village and more hop rows ----------
  village(ctx, 'kentishCottage', 3, [-25.0, -2.0, -1.0, 24.0], [2.6, 1.9, 1.1, 2], 4.0);
  let rows = 0;
  for (let z = 0; z <= 24 && rows < 6; z += 1.6) for (let x = -25; x <= -3 && rows < 6; x += 2.6) {
    if (isWet(x, z) || distToRoads(x, z) < 1.4 || objectDistance(x, z) < 3.2) continue;
    const r = tryPlace(ctx, hopRow(2.0), x, z, 0); if (r) { r.name = 'hop-row'; rows++; }
  }
  // ---------- the Dales: barns, a mill with its chimney, dry-stone walls along the moor road ----------
  village(ctx, 'daleFarm', 2, [-47.0, -18.0, -28.0, -7.5], [2.2, 1.7, 1.6], 4.5, 'uk-barn');
  for (let z = -28; z <= -7.5; z += 1.5) {
    let done = false;
    for (let x = -46; x <= -18 && !done; x += 1.5) {
      if (isWet(x, z) || distToRoads(x, z) < 1.8 || objectDistance(x, z) < 4.5) continue;
      const m = placeBuilding(ctx, mill, [[x, z, 0]]); if (m) { m.name = 'uk-mill'; done = true; }
    }
    if (done) break;
  }
  for (let x = -35.5; x < -22; x += 1.9) { const wall = tryPlace(ctx, drystoneRun(1.7), x, -9.6, 0); if (wall) wall.name = 'drystone-wall'; }
  // ---------- beside the West Country: a fenced pasture with cattle and a sheep pen ----------
  let fields = 0;
  for (let z = 40; z <= 56 && fields < 2; z += 1.5) for (let x = -71; x <= -58 && fields < 2; x += 1.5) {
    if (isWet(x, z) || distToRoads(x, z) < 2.6 || objectDistance(x, z) < 5) continue;
    const f = tryPlace(ctx, fields ? sheepPen() : pasture(), x, z, 0); if (f) { f.name = 'uk-pasture'; fields++; }
  }
}
