/** The land between the Italian clusters: umbrella pines along the piazza street, cypresses on the ridge above
 *  Testaccio, dry campagna grass and thistle over the Agro with the flock in its own walled fold, the chestnut
 *  wood in the west, poplars and reed beds along the Tiber, vines on the Castelli slope, mulberry rows and
 *  maize stubble over the terraferma with the rice flooded and mirroring, prickly pear and agave and dry-stone
 *  terraces over Sicily, the latifondo's wheat in great unfenced blocks, the Conca d'Oro's citrus in walled
 *  gardens with their water tanks, and the almond and caper terraces stepping down to the tonnara coast.
 *
 *  Decorative only. Every crop or tree that carries a card — the artichoke beds of `carciofoIt`, the olive mill
 *  of `olive`, the chestnut wood of `mushrooms`, the rice fields of `riceIt`, the wheat of `granoIt`, the lemon
 *  grove of `lemon`, the almonds of `mandorleIt`, the capers of `capperiIt` — belongs to the Stand maker's
 *  `props-italy.ts`; what is here is the country around them.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { ITP, sheepfoldWall } from './italy-architecture';
import { agroSheep } from './italy-people';
import { distToRoads, isWet, landOutlines, freshOutlines, objectDistance, groundHeight, tryPlace, tryPlaceAny } from './italy-landscape';
import type { LayoutCtx } from './worldkit';

/** An umbrella pine: a bare russet trunk carried high, then one broad flat crown and nothing under it. */
function umbrellaPine(s = 1): P {
  const g = new THREE.Group(), h = 5.0 * s;
  const trunk = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16 * s, .30 * s, h, 9), mat('#8A5A3C')), 0, h / 2, 0);
  trunk.rotation.z = .05;
  for (let i = 0; i < 3; i++) {
    const limb = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.06 * s, .09 * s, 1.3 * s, 6), mat('#7A4E34')), Math.cos(i * 2.1) * .5 * s, h * .84, Math.sin(i * 2.1) * .5 * s);
    limb.rotation.z = -Math.cos(i * 2.1) * .7; limb.rotation.x = Math.sin(i * 2.1) * .7;
  }
  const crown = add(g, new THREE.Group(), 0, h, 0);
  for (const [i, [dx, dz, r]] of ([[0, 0, 1.9], [1.5, .8, 1.25], [-1.4, -.7, 1.2], [.6, -1.5, 1.1], [-.8, 1.4, 1.05]] as [number, number, number][]).entries()) {
    const puff = add(crown, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? ITP.pineGreen : '#355C35')), dx * s, (i ? -.25 : 0) * s, dz * s);
    puff.scale.set(1.15, .42, 1.15); puff.castShadow = true;
  }
  const pine = g as P;
  pine.userData.tick = (t: number) => { crown.rotation.z = Math.sin(t * .55 + h) * .022; crown.rotation.x = Math.cos(t * .47 + h) * .018; };
  return pine;
}
/** A cypress: a dark narrow flame, the thing that marks a drive and a graveyard on every Italian ridge. */
function cypress(s = 1): P {
  const g = new THREE.Group(), h = 4.2 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09 * s, .16 * s, h * .3, 7), mat('#6B5334')), 0, h * .15, 0);
  for (let i = 0; i < 3; i++) {
    const c = add(g, new THREE.Mesh(new THREE.ConeGeometry((.52 - i * .13) * s, (h * .82 - i * h * .16), 9), mat(i % 2 ? '#2F5232' : '#27472B')), 0, h * .32 + i * h * .16, 0);
    c.castShadow = true;
  }
  return g as P;
}
/** An olive: a short gnarled grey trunk with a low silver crown, the tree that covers the Agro. */
function oliveTree(s = 1): P {
  const g = new THREE.Group(), h = 1.5 * s;
  const trunk = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .30 * s, h, 8), mat('#8A8375')), 0, h / 2, 0);
  trunk.rotation.z = .1;
  for (const [i, [x, y, z, r]] of ([[0, 1.05, 0, .95], [.6, .85, .35, .62], [-.55, .9, -.3, .58], [.15, .8, -.6, .5]] as [number, number, number, number][]).entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#8A9A78' : '#788A66')), x * s, y * s + h * .5, z * s);
    crown.scale.set(1.15, .8, 1.1);
  }
  return g as P;
}
/** A poplar along the Tiber: a tall thin column of pale green that moves before anything else does. */
function poplar(s = 1): P {
  const g = new THREE.Group(), h = 4.6 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09 * s, .16 * s, h, 7), mat('#9A8E78')), 0, h / 2, 0);
  const crown = add(g, new THREE.Group(), 0, h * .55, 0);
  for (let i = 0; i < 4; i++) {
    const puff = add(crown, new THREE.Mesh(new THREE.IcosahedronGeometry((.62 - i * .09) * s, 1), mat(i % 2 ? '#7E9A56' : '#6E8A4A')), 0, (i - 1.5) * h * .21, 0);
    puff.scale.set(1, 1.5, 1);
  }
  const tree = g as P;
  tree.userData.tick = (t: number) => { crown.rotation.z = Math.sin(t * 1.1 + h) * .05; };
  return tree;
}
/** A chestnut of the western wood: a heavy round crown on a short bole, with the porcini drying on a string. */
function chestnut(s = 1, strung = false): P {
  const g = new THREE.Group(), h = 2.4 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24 * s, .38 * s, h, 9), mat('#5F4B38')), 0, h / 2, 0);
  for (const [i, [x, y, z, r]] of ([[0, 1.5, 0, 1.45], [.9, 1.1, .5, .95], [-.85, 1.15, -.45, .9], [.2, 1.05, -.9, .8]] as [number, number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#456B34' : '#3B5E2C')), x * s, y * s + h * .55, z * s).scale.set(1.15, .85, 1.1);
  if (strung) {
    const line = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 2.2 * s, 4), mat('#B7A986')), 0, 1.5 * s, .7 * s);
    line.rotation.z = Math.PI / 2;
    for (let i = 0; i < 7; i++) {
      const cap = add(g, new THREE.Mesh(new THREE.SphereGeometry(.10 * s, 7, 6), mat('#8A5A3C')), -.9 * s + i * .3 * s, 1.38 * s, .7 * s);
      cap.scale.y = .6;
    }
  }
  return g as P;
}
/** A vine row on the Castelli slope: four stocks on a chestnut wire, the bunches hanging under the leaves. */
function vineRow(len = 3.2): P {
  const g = new THREE.Group();
  for (const x of [-len / 2, len / 2]) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, 1.3, 5), mat('#6B5334')), x, .65, 0);
  for (const y of [.7, 1.1]) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, len, 4), mat('#8A7A5A')), 0, y, 0).rotation.z = Math.PI / 2;
  const n = Math.max(3, Math.round(len / .8));
  for (let i = 0; i < n; i++) {
    const x = -len / 2 + (i + .5) * len / n;
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, .7, 6), mat('#6B5334')), x, .35, 0);
    for (let k = 0; k < 4; k++) add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.20, 0), mat(k % 2 ? '#4F7A3A' : '#5E8A45')), x + (k % 2 - .5) * .28, .92 + Math.floor(k / 2) * .22, (k % 2 - .5) * .22).scale.set(1.2, .7, 1.2);
    const bunch = add(g, new THREE.Mesh(new THREE.ConeGeometry(.12, .34, 7), mat('#5A3B58')), x + .1, .60, .14); bunch.rotation.x = Math.PI;
  }
  return g as P;
}
/** A mulberry on the terraferma: pollarded to a knuckle, which is how a silk-country field tree looks. */
function mulberry(s = 1): P {
  const g = new THREE.Group(), h = 1.9 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.19 * s, .26 * s, h, 8), mat('#7A6448')), 0, h / 2, 0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(.33 * s, 8, 6), mat('#6B5334')), 0, h, 0).scale.y = .7;
  for (let i = 0; i < 5; i++) {
    const shoot = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.035 * s, .05 * s, 1.1 * s, 5), mat('#7E9A56')), Math.cos(i * 1.3) * .22 * s, h + .5 * s, Math.sin(i * 1.3) * .22 * s);
    shoot.rotation.z = -Math.cos(i * 1.3) * .45; shoot.rotation.x = Math.sin(i * 1.3) * .45;
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.34 * s, 0), mat(i % 2 ? '#5E8A45' : '#4F7A3A')), Math.cos(i * 1.3) * .62 * s, h + .95 * s, Math.sin(i * 1.3) * .62 * s).scale.set(1.2, .7, 1.2);
  }
  return g as P;
}
/** A prickly pear: a stack of flat pads with fruit sitting on their rims. */
function pricklyPear(s = 1): P {
  const g = new THREE.Group();
  for (const [i, [x, y, z, r, rot]] of ([[0, .45, 0, .46, 0], [.34, .95, .05, .40, .5], [-.30, .90, -.05, .36, -.6], [.10, 1.35, .02, .30, .2]] as [number, number, number, number, number][]).entries()) {
    const pad = add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * s, r * s * .8, .13 * s, 9), mat(i % 2 ? '#5E8A55' : '#527A4A')), x * s, y * s, z * s);
    pad.rotation.x = Math.PI / 2; pad.rotation.z = rot;
    if (i < 3) for (let k = 0; k < 2; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.09 * s, 7, 6), mat(k ? '#C9682F' : '#B4433A')), (x + (k - .5) * .4) * s, (y + r * .8) * s, z * s).scale.y = 1.4;
  }
  return g as P;
}
/** An agave: a rosette of stiff grey blades on the dry-stone terraces. */
function agave(s = 1): P {
  const g = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const blade = add(g, new THREE.Mesh(new THREE.ConeGeometry(.13 * s, 1.15 * s, 4), mat(i % 2 ? '#8A9A78' : '#7A8C68')), Math.cos(i * .7) * .16 * s, .5 * s, Math.sin(i * .7) * .16 * s);
    blade.rotation.z = -Math.cos(i * .7) * .7; blade.rotation.x = Math.sin(i * .7) * .7;
  }
  return g as P;
}
/** An almond on the Sicilian terraces: a low pale crown with the split husks still on it. */
function almond(s = 1): P {
  const g = new THREE.Group(), h = 1.6 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16 * s, .24 * s, h, 8), mat('#8A7A66')), 0, h / 2, 0);
  for (const [i, [x, z, r]] of ([[0, 0, .95], [.55, .3, .6], [-.5, -.28, .56]] as [number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#7E9A56' : '#8FA85F')), x * s, h + (.2 - i * .12) * s, z * s).scale.set(1.2, .72, 1.15);
  return g as P;
}
/** A citrus in a walled garden of the Conca d'Oro, with the tank the water comes out of. */
function citrus(s = 1, orange = false): P {
  const g = new THREE.Group(), h = 1.3 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.15 * s, .22 * s, h, 8), mat('#7A6448')), 0, h / 2, 0);
  for (const [i, [x, z, r]] of ([[0, 0, .88], [.48, .26, .58], [-.44, -.24, .54]] as [number, number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#2F5232' : '#3B6136')), x * s, h + (.24 - i * .1) * s, z * s).scale.set(1.15, .85, 1.1);
  for (let k = 0; k < 6; k++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.11 * s, 7, 6), mat(orange ? '#F08A2A' : '#F2CF3A')), Math.cos(k * 1.1) * .68 * s, (h + .2 + (k % 2) * .3) * s, Math.sin(k * 1.1) * .62 * s);
  return g as P;
}
/** A field block: a flat mat of crop colour with its own furrow lines, for wheat, maize stubble and flooded
 *  rice. Nothing stands up out of it, so it never blocks a stand and never reads as a building. */
function fieldBlock(w: number, d: number, colour: string, furrow: string, flooded = false): P {
  const g = new THREE.Group();
  const mesh = add(g, new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(colour, flooded ? { roughness: .22, metalness: .06 } : {})), 0, .014, 0);
  mesh.rotation.x = -Math.PI / 2; mesh.receiveShadow = true;
  for (let i = 0; i < Math.max(3, Math.round(w / .7)); i++) add(g, new THREE.Mesh(new THREE.BoxGeometry(.08, .10, d), mat(furrow)), -w / 2 + (i + .5) * w / Math.max(3, Math.round(w / .7)), .05, 0);
  return g as P;
}

export function italyCountryside(ctx: LayoutCtx) {
  const { group, tickers } = ctx;
  const land = landOutlines(), fresh = freshOutlines();
  /** Dry ground, off the road, and outside every clickable's approach. `tryPlace` re-tests the box the plant
   *  actually occupies, so this is only the cheap first pass. */
  const free = (x: number, z: number, clear: number) => !isWet(x, z, land, fresh) && distToRoads(x, z) > clear && objectDistance(x, z) > 2.8;
  /** Walk a grid over a region, plant what fits and stop at `max`. The blueprint gives the regions in words;
   *  which square of each is free is settled by the water, the roads and the stands, not by hand. */
  const scatter = (build: (i: number) => P, name: string, x0: number, x1: number, z0: number, z1: number, step: number, max: number, clear = 1.5, claim = true) => {
    let n = 0, i = 0;
    for (let z = z0; z <= z1 && n < max; z += step) for (let x = x0; x <= x1 && n < max; x += step) {
      i++;
      const jx = x + Math.sin(i * 2.7) * step * .3, jz = z + Math.cos(i * 1.9) * step * .3;
      if (!free(jx, jz, clear)) continue;
      const t = tryPlace(ctx, build(i), jx, jz, jx + jz, groundHeight(jx, jz), claim);
      if (t) { t.name = name; n++; }
    }
    return n;
  };

  // Where each crop goes was settled by the ground, not by the names. Every clickable on this table keeps a
  // 6 x 5 pad and the ground the arrival camera looks across in front of it, and the three dense clusters —
  // the piazza, the Testaccio loop and the Albergheria — leave almost nothing between their stands. The
  // country therefore lies where the blueprint left it empty: the campagna north of Rome between the Tiber and
  // the Tyrrhenian, the Agro's southern edge above the coast, the Apennine ground in the south-east, and on
  // Sicily the coastal strips behind the lane and the terraces under Etna.

  // ---------- the structured pieces first, so the scattered trees grow round them ----------
  // The fold: a low oval of tufa blocks with the flock standing in it. A penned animal does not travel, so
  // its legs stay still; it breathes and swings its head instead.
  {
    const fold = new THREE.Group(); fold.name = 'sheep-fold';
    fold.add(sheepfoldWall(2.8, 2.0));
    for (const [i, [x, z, rot]] of ([[-1.2, -.5, .5], [.4, .7, 2.1], [1.2, -.6, 3.4], [-.4, .9, 1.2], [.8, -1.1, 5.0]] as [number, number, number][]).entries()) {
      const sheep = add(fold, agroSheep(), x, 0, z);
      sheep.rotation.y = rot; sheep.scale.setScalar(.9 + (i % 3) * .05); sheep.name = 'penned-sheep';
      sheep.userData.tick = undefined;
      tickers.push((t: number) => { sheep.rotation.y = rot + Math.sin(t * .42 + i * 2) * .09; sheep.position.y = Math.sin(t * .85 + i) * .01; });
    }
    if (!tryPlaceAny(ctx, () => fold, [[-19.4, 4.8, .06], [-19.8, 4.6, .04], [-19.0, 5.0, .08]])) group.remove(fold);
  }

  // ---------- the vines, and the chestnut wood in the west with the porcini on strings ----------
  scatter(i => vineRow(2.6 + (i % 3) * .4), 'castelli-vine', 1.6, 9.4, 3.4, 8.6, 1.3, 12, 1.6);
  scatter(i => chestnut(.8 + (i % 3) * .08, i % 4 === 1), 'chestnut', 7.2, 12.6, -9.6, -4.8, 1.8, 6, 1.6);

  // ---------- Rome: umbrella pines along the campagna north of the street, cypresses on the ridge ----------
  scatter(i => umbrellaPine(.78 + (i % 3) * .08), 'umbrella-pine', -27, -2, -18, -14, 3.2, 9, 1.8);
  scatter(i => umbrellaPine(.8 + (i % 2) * .08), 'umbrella-pine', 9.6, 13.6, 4.8, 8.4, 2.0, 3, 1.8);
  scatter(i => cypress(.92 + (i % 3) * .12), 'cypress', -44, -33, -25, -19, 1.9, 9, 1.6);
  scatter(i => cypress(.9 + (i % 2) * .1), 'cypress', 14, 28, 5.6, 8.4, 2.6, 6, 1.6);

  // ---------- the Tiber: poplars and reed beds along the bank ----------
  scatter(i => poplar(.9 + (i % 3) * .12), 'tiber-poplar', -36, -4, -24, 9, 2.0, 14, 2.4);
  // Reed beds hug the bank; the grid is cut round the river itself by `free`, so they stand on the mud and
  // never in the water.
  scatter(() => {
    const reeds = new THREE.Group() as P;
    for (let k = 0; k < 9; k++) { const blade = add(reeds, new THREE.Mesh(new THREE.BoxGeometry(.05, .95, .05), mat('#7E9A56')), (k % 3 - 1) * .18, .48, (Math.floor(k / 3) - 1) * .16); blade.rotation.z = (k % 2 ? .13 : -.13); }
    return reeds;
  }, 'tiber-reeds', -35, -2, -23, 9, 1.4, 26, 2.2, false);

  // ---------- the Agro Romano: dry grass and thistle, the olives, and the flock in its own walled fold ----------
  scatter(i => oliveTree(.9 + (i % 3) * .1), 'agro-olive', -29, -4, 4.6, 8.6, 2.2, 9, 1.6);
  scatter(i => oliveTree(.95 + (i % 2) * .1), 'agro-olive', 2, 30, -5, 4, 2.6, 9, 1.6);
  scatter(() => {
    const thistle = new THREE.Group() as P;
    add(thistle, new THREE.Mesh(new THREE.SphereGeometry(.30, 7, 5), mat('#A89A72')), 0, .16, 0).scale.y = .6;
    add(thistle, new THREE.Mesh(new THREE.SphereGeometry(.10, 6, 5), mat('#8A7FA8')), .06, .42, 0);
    return thistle;
  }, 'campagna-thistle', -46, -10, -26, 8, 1.6, 36, 1.2, false);
  // ---------- the terraferma: mulberry rows, maize stubble, and the rice flooded and mirroring ----------
  scatter(i => mulberry(.95 + (i % 2) * .1), 'mulberry', -4, 6, -14, -8, 1.8, 8, 1.6);
  for (const [x, z, w, d, flooded] of [[-3.4, -18.6, 6.0, 4.0, false], [-4.2, -13.4, 5.4, 3.6, false], [-1.6, -23.4, 5.0, 3.2, true], [-6.6, -22.2, 4.4, 3.0, true]] as [number, number, number, number, boolean][]) {
    const field = tryPlace(ctx, fieldBlock(w, d, flooded ? '#9EC9B4' : '#C9BD84', flooded ? '#A8956F' : '#A89A6A', flooded), x, z, 0);
    if (field) field.name = flooded ? 'rice-field' : 'maize-field';
  }

  // ---------- Sicily: prickly pear, agave, the latifondo's wheat ----------
  scatter(i => pricklyPear(.8 + (i % 3) * .1), 'prickly-pear', -21, 32, 17, 30, 1.2, 16, 1.4);
  scatter(() => agave(.9), 'agave', -20, 10, 28, 30, 1.5, 12, 1.4);
  for (const [x, z, w, d] of [[-3.4, 28.0, 6.0, 3.0], [6.4, 27.6, 6.6, 3.2], [-13.6, 28.6, 5.0, 2.6]] as [number, number, number, number][]) {
    const field = tryPlace(ctx, fieldBlock(w, d, '#D6C07E', '#B6A268'), x, z, 0);
    if (field) field.name = 'latifondo-wheat';
  }
  // ---------- the Conca d'Oro's citrus, and the almond and caper terraces ----------
  scatter(i => citrus(.7 + (i % 3) * .08, i % 3 === 1), 'conca-citrus', 14.6, 16.0, 24.8, 29.4, 1.1, 6, 1.4);
  scatter(i => citrus(.7 + (i % 3) * .08, i % 2 === 1), 'conca-citrus', 18.8, 20.2, 24.8, 29.2, 1.1, 5, 1.4);
  scatter(i => almond(.75 + (i % 2) * .1), 'almond-terrace', 18, 23.4, 24, 28.6, 1.2, 6, 1.4);
  scatter(i => almond(.75 + (i % 2) * .1), 'almond-terrace', 26.6, 30.4, 20.2, 28, 1.2, 6, 1.4);
  scatter(i => almond(.7 + (i % 2) * .08), 'almond-terrace', 12, 16, 16.6, 21, 1.0, 4, 1.4);
  scatter(i => almond(.7 + (i % 2) * .08), 'almond-terrace', 23, 31, 18, 29, 1.0, 6, 1.4);
  scatter(() => {
    const caper = new THREE.Group() as P;
    for (let k = 0; k < 5; k++) add(caper, new THREE.Mesh(new THREE.IcosahedronGeometry(.22, 0), mat(k % 2 ? '#6E8A4A' : '#5E7A42')), (k % 3 - 1) * .3, .16 + (k % 2) * .06, (Math.floor(k / 3) - .5) * .3).scale.set(1.2, .6, 1.2);
    return caper;
  }, 'caper-terrace', 22, 30, 24.4, 28.6, 1.4, 16, 1.4, false);

  void ITP;
}
