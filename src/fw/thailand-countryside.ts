/** The land between the Thai clusters: coconut and toddy palms, the river orchards on their ridged beds,
 *  mangrove along the Andaman shore, teak and bamboo on the Lanna slopes, dry dipterocarp over Isan, the
 *  rubber rows behind the Gulf shore, the salt sheds at the seaward corner of the plain, and the buffalo.
 *
 *  Decorative only. Every crop or tree that carries a card — the toddy palms of `tanTh`, the orchard of
 *  `suanTh`, the salt pans of `kluaTh`, the turmeric beds of `khamminTh`, the coconut grove of `coconutSea` —
 *  belongs to the Stand maker's `props-thailand.ts`; what is here is the country around them.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { TH, sugarPalmRig, saltPanShed, riceBarn } from './thailand-architecture';
import { thaiBuffalo } from './thailand-people';
import { distToRoads, isWet, waterOutlines, plateauHeight, objectDistance, tryPlace, tryPlaceAny } from './thailand-landscape';
import type { LayoutCtx } from './worldkit';

/** A coconut palm: a leaning ringed trunk, a crown of long fronds and a cluster of nuts under it. */
function coconutPalm(s = 1, nuts = true): P {
  const g = new THREE.Group(), h = 4.6 * s;
  const trunk = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16 * s, .27 * s, h, 9), mat('#7A6242')), 0, h / 2, 0);
  trunk.rotation.z = .07;
  for (let i = 0; i < 12; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(.22 * s + i * .004, .025 * s, 4, 9), mat('#6B5334')), .03 * i * s * .1, .4 * s + i * (h - .8 * s) / 11, 0).rotation.x = Math.PI / 2;
  const crown = add(g, new THREE.Group(), .16 * s, h, 0);
  for (let i = 0; i < 7; i++) {
    const frond = add(crown, new THREE.Mesh(new THREE.BoxGeometry(2.5 * s, .07 * s, .42 * s), mat(i % 2 ? '#4F7A3A' : '#5E8A45')), 0, 0, 0);
    frond.position.set(Math.cos(i * .9) * 1.2 * s, -.1 * s - (i % 3) * .12 * s, Math.sin(i * .9) * 1.2 * s);
    frond.rotation.y = -i * .9; frond.rotation.z = -.34 - (i % 3) * .1;
  }
  if (nuts) for (let k = 0; k < 4; k++) add(crown, new THREE.Mesh(new THREE.SphereGeometry(.16 * s, 7, 6), mat('#8A7A4A')), Math.cos(k * 1.6) * .3 * s, -.28 * s, Math.sin(k * 1.6) * .3 * s);
  const palm = g as P;
  palm.userData.tick = (t: number) => { crown.rotation.z = Math.sin(t * .6 + h) * .028; crown.rotation.x = Math.cos(t * .5 + h) * .022; };
  return palm;
}

/** A banana clump: three short pseudostems with broad split leaves, the thing at the foot of every house. */
function bananaClump(s = 1): P {
  const g = new THREE.Group();
  for (const [i, [dx, dz, k]] of ([[0, 0, 1], [.55, .3, .78], [-.5, .4, .66]] as [number, number, number][]).entries()) {
    const h = 1.9 * s * k;
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.11 * s * k, .17 * s * k, h, 8), mat('#6E8A4A')), dx * s, h / 2, dz * s);
    for (let j = 0; j < 5; j++) {
      const leaf = add(g, new THREE.Mesh(new THREE.BoxGeometry(1.5 * s * k, .05, .55 * s * k), mat(j % 2 ? TH.paddyGreen : '#6F9B4A')), dx * s, h - .05, dz * s);
      leaf.position.x += Math.cos(j * 1.3 + i) * .6 * s * k; leaf.position.z += Math.sin(j * 1.3 + i) * .6 * s * k;
      leaf.rotation.y = -(j * 1.3 + i); leaf.rotation.z = -.3 - (j % 2) * .12;
    }
  }
  return g as P;
}

/** A teak or dipterocarp: a tall straight bole with a high, flat, open crown. */
function forestTree(s = 1, dry = false): P {
  const g = new THREE.Group(), h = 3.4 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16 * s, .26 * s, h, 8), mat(dry ? '#7A6448' : '#5F4B38')), 0, h / 2, 0);
  for (const [i, [x, y, z, r]] of ([[0, h + .5 * s, 0, 1.15], [.6, h + .1 * s, .32, .7], [-.55, h + .18 * s, -.34, .64]] as [number, number, number, number][]).entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(dry ? (i % 2 ? '#8A9A54' : '#7C8E48') : (i % 2 ? '#4F7A3A' : '#436B33'))), x * s, y, z * s);
    crown.scale.set(1.25, .62, 1.2);
  }
  return g as P;
}

/** A bamboo clump: a fan of thin culms with leaf sprays near the top, bending together in the wind. */
function bambooClump(s = 1): P {
  const g = new THREE.Group(), culms: THREE.Object3D[] = [];
  for (let i = 0; i < 7; i++) {
    const h = (2.6 + (i % 3) * .7) * s, a = i * .9;
    const culm = add(g, new THREE.Group(), Math.cos(a) * .3 * s, 0, Math.sin(a) * .3 * s);
    culm.rotation.z = Math.cos(a) * .12; culm.rotation.x = -Math.sin(a) * .12;
    add(culm, new THREE.Mesh(new THREE.CylinderGeometry(.045 * s, .06 * s, h, 6), mat('#8FA84A')), 0, h / 2, 0);
    for (let j = 0; j < 4; j++) { const leaf = add(culm, new THREE.Mesh(new THREE.BoxGeometry(.6 * s, .03, .14 * s), mat('#6F9B4A')), .26 * s, h * (.6 + j * .12), 0); leaf.rotation.y = j * 1.4; leaf.rotation.z = -.34; }
    culms.push(culm);
  }
  const clump = g as P;
  clump.userData.tick = (t: number) => culms.forEach((c, i) => { c.rotation.z = Math.cos(i * .9) * .12 + Math.sin(t * 1.1 + i) * .045; });
  return clump;
}

/** A mangrove: a low dark crown over a cage of stilt roots standing in the shallows. */
function mangrove(s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.13 * s, .18 * s, 1.5 * s, 7), mat('#4E4034')), 0, .9 * s, 0);
  for (let i = 0; i < 7; i++) { const root = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.035 * s, .05 * s, 1.1 * s, 5), mat('#4E4034')), Math.cos(i * .9) * .34 * s, .48 * s, Math.sin(i * .9) * .34 * s); root.rotation.z = -Math.cos(i * .9) * .48; root.rotation.x = Math.sin(i * .9) * .48; }
  for (const [i, [x, z, r]] of ([[0, 0, .85], [.44, .26, .5], [-.4, -.3, .46]] as [number, number, number][]).entries()) {
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#3E6B36' : '#335C2E')), x * s, (1.7 + (i % 2) * .2) * s, z * s).scale.set(1.2, .8, 1.2);
  }
  return g as P;
}

/** A rubber row: slim pale trunks in a line, each with its tapping cut and a cup under it. */
function rubberTree(s = 1): P {
  const g = new THREE.Group(), h = 3.2 * s;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.11 * s, .17 * s, h, 8), mat('#B7A88E')), 0, h / 2, 0);
  const cut = add(g, new THREE.Mesh(new THREE.BoxGeometry(.03, .5 * s, .19 * s), mat('#8A7458')), .13 * s, .9 * s, 0); cut.rotation.x = .5;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.07 * s, .06 * s, .12 * s, 8), mat('#6E5C3C')), .16 * s, .6 * s, 0);
  for (const [i, [x, z]] of ([[0, 0], [.4, .24], [-.36, -.22]] as [number, number][]).entries())
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry((.72 - i * .14) * s, 1), mat(i % 2 ? '#4F7A3A' : '#5E8A45')), x * s, h + (.2 - i * .12) * s, z * s).scale.set(1.1, .8, 1.1);
  return g as P;
}

export function thailandCountryside(ctx: LayoutCtx) {
  const { group, tickers } = ctx;
  const wet = waterOutlines();
  /** Dry ground, off the road, and outside every clickable's approach. `tryPlace` re-tests the box the plant
   *  actually occupies, so this is only the cheap first pass. */
  const free = (x: number, z: number, clear: number) => !isWet(x, z, wet) && distToRoads(x, z) > clear && objectDistance(x, z) > 2.8;
  /** Walk a grid over a region, plant what fits and stop at `max`. The blueprint gives the regions as corners;
   *  which square of each one is free is settled by the water, the roads and the stands, not by hand. */
  const scatter = (build: (i: number) => P, name: string, x0: number, x1: number, z0: number, z1: number, step: number, max: number, clear = 1.5, lift?: (x: number, z: number) => number) => {
    let n = 0, i = 0;
    for (let z = z0; z <= z1 && n < max; z += step) for (let x = x0; x <= x1 && n < max; x += step) {
      i++;
      const jx = x + Math.sin(i * 2.7) * step * .3, jz = z + Math.cos(i * 1.9) * step * .3;
      if (!free(jx, jz, clear)) continue;
      const t = tryPlace(ctx, build(i), jx, jz, jx + jz, lift?.(jx, jz) ?? 0);
      if (t) { t.name = name; n++; }
    }
    return n;
  };

  // ---------- the central plain: toddy palms west of the palm stand, orchard beds, the rice barns ----------
  // The blueprint's line of toddy palms ran from [-63, -12] to [-66, -16], which is the ground the toddy-palm
  // stand itself works; the decorative line stands west of it, along the same road.
  scatter(i => sugarPalmRig(4.2 + (i % 3) * .5), 'toddy-palm', -72, -67, -20, -12, 2.2, 6, 1.4);
  // Ridged orchard beds along the river, west of the beds the orchard stand works.
  scatter(() => forestTree(.62, false), 'orchard-tree', -64, -50, -20, -10, 1.3, 9, 1.4);
  for (const t of group.children) if (t.name === 'orchard-tree')
    add(group, new THREE.Mesh(new THREE.BoxGeometry(1.15, .18, 1.2), mat('#8A7454')), t.position.x, .09, t.position.z).name = 'orchard-bed';
  { const barn = tryPlaceAny(ctx, () => riceBarn(), [[-59.8, -18.6, .3], [-64.6, -18.8, .2], [-51.2, -18.8, .1], [-67.8, -8.6, -.2], [-67.4, -12.4, .4], [-46.4, -14.6, .2]]); if (barn) barn.name = 'rice-barn'; }

  // ---------- the water buffalo at rest, in a bamboo pen at the plain's dry western corner ----------
  const pen = new THREE.Group(); pen.name = 'buffalo-pen';
  for (const z of [-2.1, 2.1]) add(pen, new THREE.Mesh(new THREE.BoxGeometry(5.0, .1, .1), mat(TH.bambooPale)), 0, .74, z);
  for (const x of [-2.5, 2.5]) add(pen, new THREE.Mesh(new THREE.BoxGeometry(.1, .1, 4.2), mat(TH.bambooPale)), x, .74, 0);
  for (let i = 0; i < 10; i++) add(pen, new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, 1.0, 6), mat('#8A6338')), -2.5 + (i % 6) * 1.0, .5, i < 6 ? -2.1 : 2.1);
  for (const [i, [x, z, rot]] of ([[-1.2, -.7, .4], [1.0, .6, 2.2]] as [number, number, number][]).entries()) {
    const b = add(pen, thaiBuffalo(), x, 0, z); b.rotation.y = rot; b.scale.setScalar(.92 + i * .06); b.name = 'penned-buffalo';
    // A penned animal does not travel, so its legs stay still; it breathes and swings its head instead.
    b.userData.tick = undefined;
    tickers.push((t: number) => { b.rotation.y = rot + Math.sin(t * .45 + i * 2) * .08; b.position.y = Math.sin(t * .9 + i) * .01; });
  }
  if (!tryPlaceAny(ctx, () => pen, [[-66.6, -1.6, .15], [-70.4, -4.6, .1], [-69.6, 1.8, .2], [-73.2, -9.8, -.1], [-45.8, -17.8, .2]])) group.remove(pen);

  // ---------- Lanna: teak and bamboo on the slopes, tea gardens under the canopy ----------
  scatter(i => forestTree(1.0 + (i % 3) * .14, false), 'lanna-teak', -70, -50, -27.4, -25, 2.0, 9, 1.6);
  scatter(() => bambooClump(1.05), 'lanna-bamboo', -70, -63, -22, -16, 2.4, 5, 1.6);
  scatter(() => { const b = new THREE.Group() as P; add(b, new THREE.Mesh(new THREE.SphereGeometry(.42, 7, 5), mat('#3E6B36')), 0, .22, 0).scale.y = .62; return b; },
    'tea-bush', -70, -64, -22, -16.5, 1.1, 26, 1.2);

  // ---------- Isan: dry dipterocarp and sandy scrub over the plateau ----------
  scatter(i => forestTree(.9 + (i % 3) * .12, true), 'isan-dipterocarp', -32, -18, -26, -13, 2.2, 10, 1.5, plateauHeight);
  scatter(() => { const t = new THREE.Group() as P; add(t, new THREE.Mesh(new THREE.SphereGeometry(.26, 6, 4), mat('#A89A62')), 0, .13, 0).scale.y = .58; return t; },
    'isan-scrub', -31, -18, -25.5, -13.5, 1.5, 22, 1.2, plateauHeight);

  // ---------- the peninsula: coconut groves, rubber rows, mangrove along the Andaman shore ----------
  scatter(i => coconutPalm(.9 + (i % 3) * .1), 'coconut-palm', -71, -58, 6, 20, 1.9, 16, 1.5);
  scatter(() => rubberTree(.95), 'rubber-tree', -62, -50, 4, 22, 1.6, 12, 1.4);
  scatter(i => mangrove(1.0 + (i % 2) * .12), 'mangrove', -76.4, -73.4, 3, 20, 1.7, 10, 1.4);
  // The salt sheds at the plain's seaward corner, behind the pans the salt stand works.
  for (const spots of [[[-57.4, 16.8, .2], [-58.6, 12.4, .3], [-55.2, 19.6, .1]], [[-50.2, 17.8, -.3], [-48.4, 13.2, -.2], [-51.6, 20.8, -.1]]] as [number, number, number][][]) {
    const shed = tryPlaceAny(ctx, () => saltPanShed(), spots); if (shed) shed.name = 'salt-shed';
  }

  // ---------- banana at the foot of every house, and along the khlongs ----------
  scatter(() => bananaClump(1.0), 'banana-clump', -58, -32, -14, 12, 2.6, 14, 1.5);
}
