/** The land between the Vietnamese clusters: lotus on the lake and the lotus lane, bamboo and mulberry on the
 *  Red River bank, areca and pine on the Huế slope, coconut and water coconut along the Hội An bank, tamarind
 *  and flame trees on the Saigon street, banana, water hyacinth and a mangrove edge through the delta, dyke
 *  banks, buffalo standing in the flooded fields and kingfishers on the channel stakes.
 *
 *  Decorative only: every crop or tree that carries a card belongs to the Stand maker's `props-vietnam.ts`.
 *  No palm-fringed beach and no parasols anywhere — that composition is Thailand's, and the period is 1900 to
 *  1931. Everything here is placed on ground the landscape says is free: dry, off the lanes, off the pads.
 */
import * as THREE from 'three';
import { add, mat, tree, type P } from './props';
import { bananaTree } from './props-india';
import { datePalm } from './props-mideast';
import { VN } from './vietnam-architecture';
import { buffalo } from './vietnam-people';
import {
  CHANNEL_CURVES, HOAN_KIEM, RED_RIVER_CURVE, freeGround, groundHeight, inVietnamWater, objectDistance,
  roadDistance, type Pt,
} from './vietnam-landscape';
import type { LayoutCtx } from './worldkit';

/** An areca palm: a slim ringed trunk under a short crown of fronds, the tree of a Vietnamese garden edge. */
function areca(s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09 * s, .13 * s, 3.1 * s, 7), mat('#B7B09A')), 0, 1.55 * s, 0);
  for (let i = 0; i < 7; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(.1 * s, .012 * s, 4, 10), mat('#9A9484')), 0, (.5 + i * .34) * s, 0).rotation.x = Math.PI / 2;
  const crown = add(g, new THREE.Group(), 0, 3.1 * s, 0);
  for (let i = 0; i < 7; i++) {
    const frond = add(crown, new THREE.Mesh(new THREE.BoxGeometry(1.5 * s, .04 * s, .3 * s), mat(i % 2 ? '#4F7D48' : '#5F8F52')), .72 * s, 0, 0);
    frond.rotation.y = i / 7 * Math.PI * 2; frond.rotation.z = -.3 - (i % 3) * .1;
    frond.position.set(Math.cos(i / 7 * Math.PI * 2) * .72 * s, -.1 * s, Math.sin(i / 7 * Math.PI * 2) * .72 * s);
  }
  for (let i = 0; i < 4; i++) add(crown, new THREE.Mesh(new THREE.SphereGeometry(.09 * s, 6, 5), mat('#D9A441')), Math.cos(i * 1.6) * .18 * s, -.22 * s, Math.sin(i * 1.6) * .18 * s);
  (g as P).userData.tick = (t: number) => { crown.rotation.z = Math.sin(t * .6 + s) * .022; };
  return g as P;
}
/** A mangrove: stilt roots out of the mud under a low dark crown. It stands at the water's edge, not in it. */
function mangrove(s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.11 * s, .15 * s, .9 * s, 6), mat('#5A4636')), 0, .45 * s, 0);
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    const root = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.035 * s, .05 * s, .8 * s, 5), mat('#5A4636')), Math.cos(a) * .22 * s, .3 * s, Math.sin(a) * .22 * s);
    root.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5);
  }
  for (const [i, [x, y, z, r]] of ([[0, 1.25, 0, .62], [.4, 1.05, .22, .4], [-.36, 1.1, -.24, .36]] as [number, number, number, number][]).entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#3F6B44' : '#4F7D48')), x * s, y * s, z * s);
    crown.scale.set(1.2, .8, 1.15);
  }
  return g as P;
}
/** A flame tree or a tamarind for the Saigon street: a broad flat crown, red flower where it flames. */
function streetTree(flame: boolean, s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.14 * s, .22 * s, 1.3 * s, 7), mat('#6A5540')), 0, .65 * s, 0);
  for (const [i, [x, y, z, r]] of ([[0, 1.9, 0, 1.05], [.5, 1.7, .3, .6], [-.5, 1.72, -.3, .58]] as [number, number, number, number][]).entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#5F8F52' : '#4F7D48')), x * s, y * s, z * s);
    crown.scale.set(1.35, .58, 1.3);
  }
  if (flame) for (let i = 0; i < 7; i++) add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.16 * s, 0), mat('#C0392B')), Math.cos(i * 2.1) * .8 * s, (1.85 + (i % 3) * .14) * s, Math.sin(i * 2.1) * .7 * s);
  return g as P;
}
/** Lotus: flat pads on the water with a few standing leaves and buds, on their own stems. */
function lotusPatch(g: THREE.Object3D, x: number, z: number, r: number, seed: number, y: number): P {
  const patch = new THREE.Group() as P; patch.name = 'lotus-patch'; patch.position.set(x, 0, z); g.add(patch);
  const pads: THREE.Object3D[] = [], stems: THREE.Object3D[] = [];
  for (let i = 0; i < 9; i++) {
    const a = i * 2.39 + seed, d = r * Math.sqrt((i + .5) / 9);
    const pad = add(patch, new THREE.Mesh(new THREE.CircleGeometry(.24 + (i % 3) * .05, 10), mat(i % 2 ? '#5F8F52' : '#6F9B57')), Math.cos(a) * d, y + .01, Math.sin(a) * d);
    pad.rotation.x = -Math.PI / 2; pad.rotation.z = a; pads.push(pad);
    if (i % 3 === 0) {
      const stem = add(patch, new THREE.Group(), Math.cos(a) * d, y, Math.sin(a) * d);
      add(stem, new THREE.Mesh(new THREE.CylinderGeometry(.02, .025, .5, 5), mat('#6F9B57')), 0, .25, 0);
      add(stem, new THREE.Mesh(new THREE.ConeGeometry(.1, .26, 7), mat(i % 2 ? '#E8A9C0' : '#F1DCE4')), 0, .58, 0);
      stems.push(stem);
    }
  }
  // The pads ride the surface and the buds lean on their stems; nothing leaves the water.
  patch.userData.tick = (t: number) => {
    for (const [i, pad] of pads.entries()) pad.position.y = y + .01 + Math.sin(t * .8 + i * 1.7 + seed) * .012;
    for (const [i, stem] of stems.entries()) { stem.rotation.x = Math.sin(t * .55 + i + seed) * .06; stem.rotation.z = Math.cos(t * .47 + i) * .05; }
  };
  return patch;
}

export function vietnamCountryside(ctx: LayoutCtx) {
  const { group, place, tickers, TOP } = ctx;
  const put = <T extends THREE.Object3D>(o: T, x: number, z: number, rot = 0): T => {
    const g = place(o, x, z, rot); g.position.y = TOP + groundHeight(x, z); return g;
  };
  /**
   * Where a family of trees or animals may stand. A hand-written scatter cannot be kept honest on this half:
   * the twenty-eight stands as built are four to twelve units across, so a coordinate that looked open on the
   * blueprint lands inside a stand's pad. Instead each family names the ground it belongs on and how big its
   * own crown is, and the spots are searched on a half-unit grid: dry over the whole crown, at least
   * 2.5 + crown from every clickable anchor, clear of every road corridor, off the slopes' own footprints and
   * `apart` from anything already placed. The search is deterministic, so the world is the same every load.
   */
  const taken: Pt[] = [];
  const spots = (box: [number, number, number, number], count: number, crown: number, apart = 3.2, lane = 1.5): Pt[] => {
    const found: Pt[] = [];
    for (let x = box[0]; x <= box[2] && found.length < count; x += .5)
      for (let z = box[1]; z <= box[3] && found.length < count; z += .5) {
        if (!freeGround(x, z, 2.5 + crown + .2, lane + crown * .5, crown)) continue;
        if (taken.some(([tx, tz]) => Math.hypot(tx - x, tz - z) < apart)) continue;
        found.push([x, z]); taken.push([x, z]);
      }
    return found;
  };

  // ---------- the Red River bank: dyke banks, bamboo, mulberry and two buffalo in the flooded fields ----------
  for (const [i, [x, z, len, rot]] of ([[-6.4, -21.4, 6.5, .06], [6.4, -21.0, 5.0, -.03], [15.4, -21.8, 5.5, .08]] as [number, number, number, number][]).entries()) {
    // A bank is only laid where the whole of its run is on dry ground and clear of every stand's pad.
    const samples = [-len / 2, -len / 4, 0, len / 4, len / 2];
    if (samples.some(d => inVietnamWater(x + d, z - .6) || inVietnamWater(x + d, z + .6) || objectDistance(x + d, z) < 3.2 || roadDistance(x + d, z) < 1.2)) continue;
    const dyke = add(group, new THREE.Mesh(new THREE.BoxGeometry(len, .3, .8), mat('#A8956F')), x, .15, z);
    dyke.rotation.y = rot; dyke.name = 'river-dyke';
    const crest = add(group, new THREE.Mesh(new THREE.BoxGeometry(len - .6, .07, .5), mat(i % 2 ? '#9A8760' : '#B09C74')), x, .32, z);
    crest.rotation.y = rot; crest.name = 'river-dyke-crest';
  }
  // The buffalo choose their ground first: they are the biggest thing on the bank and the narrowest band.
  for (const [i, [x, z]] of spots([-11, -23.2, 17, -20.2], 2, 1.2, 5).entries()) {
    const beast = put(buffalo(i * 3), x, z, i ? -1.9 : .8); beast.name = 'paddy-buffalo';
    tickers.push(beast.userData.tick!);
  }
  for (const [i, [x, z]] of spots([-11, -23, 17, -20], 5, 1.5).entries()) {
    const clump = put(tree('bamboo', 1.05 + (i % 3) * .12), x, z, x); clump.name = 'bank-bamboo';
    if (clump.userData.tick) tickers.push(clump.userData.tick);
  }
  for (const [i, [x, z]] of spots([-11, -23.2, 17, -20.4], 2, 1.6).entries()) {
    put(tree('round', .8 + i * .08), x, z, x).name = 'mulberry';
  }

  // ---------- Hoàn Kiếm and the lotus lane: lotus on the still water, willows on the shore ----------
  tickers.push(lotusPatch(group, HOAN_KIEM.x, HOAN_KIEM.z, Math.min(HOAN_KIEM.rx, HOAN_KIEM.rz) * .6, 1, TOP + .08).userData.tick!);
  for (const [i, [x, z]] of spots([2, -14, 9, -9], 3, 1.8).entries()) {
    const willow = put(tree('willow', .95 + (i % 2) * .1), x, z, x); willow.name = 'lotus-lane-willow';
    if (willow.userData.tick) tickers.push(willow.userData.tick);
  }
  // The lotus ponds of the lane itself: shallow beds cut into the bank, not open water.
  for (const [i, [x, z]] of spots([2, -14, 10, -9], 2, 1.2).entries()) {
    const bed = add(group, new THREE.Mesh(new THREE.CircleGeometry(1.0, 20), mat('#8FB8A8')), x, TOP + .045, z);
    bed.rotation.x = -Math.PI / 2; bed.name = 'lotus-bed';
    tickers.push(lotusPatch(group, x, z, .62, 7 + i, TOP + .05).userData.tick!);
  }

  // ---------- the Huế slope: pine and areca above the garden, on the raised ground ----------
  for (const [i, [x, z]] of spots([10, -4, 20, 6], 6, 1.7).entries()) {
    const t = put(i % 2 ? areca(.92 + (i % 3) * .08) : tree('pine', 1.0 + (i % 3) * .1), x, z, x);
    t.name = i % 2 ? 'hue-areca' : 'hue-pine';
    if (t.userData.tick) tickers.push(t.userData.tick);
  }

  // ---------- Hội An: coconut and water coconut along the river bank behind the quay ----------
  for (const [i, [x, z]] of spots([21, -9, 34, 6], 6, 2.0).entries()) {
    const palm = datePalm(.95 + (i % 3) * .08);
    for (const fruit of (palm.userData as { dates?: THREE.Mesh[] }).dates ?? []) { (fruit.material as THREE.MeshStandardMaterial).color.set(i % 2 ? '#8FB06A' : '#C9A24A'); fruit.scale.set(1.3, 1.2, 1.3); }
    const p = put(palm, x, z, x); p.name = 'coconut-palm';
    if (p.userData.tick) tickers.push(p.userData.tick);
  }

  // ---------- Saigon: tamarind and flame trees along the street ----------
  for (const [i, [x, z]] of spots([11, 8, 25, 21], 5, 2.2).entries()) {
    put(streetTree(i % 2 === 1, .95 + (i % 3) * .08), x, z, x).name = i % 2 ? 'flame-tree' : 'tamarind';
  }

  // ---------- the delta: banana, mangrove at the channel edge, hyacinth mats and kingfishers on the stakes ----------
  for (const [i, [x, z]] of spots([-11, 6, 3, 22], 7, 1.8).entries()) {
    const p = put(bananaTree(.95 + (i % 3) * .1), x, z, x + z); p.name = 'delta-banana';
    if (p.userData.tick) tickers.push(p.userData.tick);
  }
  for (const [i, [x, z]] of spots([-11, 13, 5, 23], 6, 1.4, 2.6, 1.2).entries()) {
    put(mangrove(.95 + (i % 3) * .1), x, z, x).name = 'delta-mangrove';
  }
  // Water hyacinth: flat mats drifting on the channels, each on its own slow clock.
  const mats: [THREE.Object3D, number, number][] = [];
  for (const [i, [curve, u0]] of ([[CHANNEL_CURVES.a, .32], [CHANNEL_CURVES.a, .58], [CHANNEL_CURVES.b, .4], [CHANNEL_CURVES.c, .46], [RED_RIVER_CURVE, .52]] as [THREE.CatmullRomCurve3, number][]).entries()) {
    const mat0 = new THREE.Group(); mat0.name = 'water-hyacinth'; group.add(mat0);
    for (let k = 0; k < 6; k++) {
      const leaf = add(mat0, new THREE.Mesh(new THREE.SphereGeometry(.17, 6, 5), mat(k % 2 ? '#6F9B57' : '#5F8F52')), (k % 3 - 1) * .3, .06, (Math.floor(k / 3) - .5) * .32);
      leaf.scale.set(1, .5, 1);
      if (k === 0) add(mat0, new THREE.Mesh(new THREE.ConeGeometry(.07, .2, 6), mat('#A98FC4')), -.3, .2, -.16);
    }
    const p = curve.getPointAt(u0); mat0.position.set(p.x, TOP + .1, p.z);
    mats.push([mat0, i, u0]);
    void curve;
  }
  tickers.push(t => { for (const [m, i, u0] of mats) { m.position.y = TOP + .1 + Math.sin(t * .8 + i) * .01; m.rotation.y = i + Math.sin(t * .25 + u0 * 10) * .12; } });
  // Kingfishers: a stake in the channel bank with a bird that shifts and darts, the delta's own small life.
  for (const [i, [x, z]] of spots([-11, 12, 4, 22], 3, .6, 4).entries()) {
    // A stake stands on the bank, at the water's edge but never in it, so the bird's perch is supported.
    const stake = new THREE.Group(); stake.name = 'channel-stake'; stake.position.set(x, 0, z); group.add(stake);
    add(stake, new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, 1.15, 6), mat(VN.go)), 0, .58, 0);
    const bird = add(stake, new THREE.Group(), 0, 1.2, 0);
    add(bird, new THREE.Mesh(new THREE.SphereGeometry(.11, 7, 6), mat('#2A6FA8'))).scale.set(1, .9, 1.4);
    add(bird, new THREE.Mesh(new THREE.SphereGeometry(.07, 6, 5), mat('#2A6FA8')), 0, .06, .12);
    add(bird, new THREE.Mesh(new THREE.ConeGeometry(.03, .16, 5), mat('#2E2B2A')), 0, .06, .24).rotation.x = Math.PI / 2;
    add(bird, new THREE.Mesh(new THREE.SphereGeometry(.08, 6, 5), mat('#D9822B')), 0, -.03, .02).scale.set(.9, .6, 1.1);
    (stake as P).userData.tick = (t: number) => {
      const beat = (t * .5 + i * .7) % 1;
      bird.rotation.y = Math.sin(t * .9 + i) * .5;
      bird.position.y = 1.2 + (beat > .92 ? Math.sin((beat - .92) / .08 * Math.PI) * .35 : 0);   // a dart at the water and back
    };
    tickers.push((stake as P).userData.tick!);
  }
}
