/** Thai building vocabulary for the Southeast Asia table: teak and hardwood on posts in the centre and the
 *  north, split bamboo on the Khorat plateau, brick-and-timber shophouse rows in Sampheng, plank walls and a
 *  steep hipped tile on the Malay coast, stucco and arcades in the tin towns. Pure builders, no positions.
 *
 *  The twelve palette names are the ones in docs/thailand-image-brief.md, "Palette". The stand maker's
 *  `props-thailand.ts` carries its own copy of the same twelve for its own food and people; this one is the
 *  Builder's, and the two agree hex for hex.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';

/** The twelve palette names from docs/thailand-image-brief.md, "Palette". */
export const TH = {
  khlongBrown: '#6E5C3C', andamanGreen: '#2F7D72', teakDark: '#5A3B22', bambooPale: '#C9B489',
  paddyGreen: '#8FA84A', limestoneGrey: '#A79E90', watOrange: '#C8622C', chediGold: '#C79B3B',
  lacquerRed: '#9C2B23', pelangiBlue: '#2E4E7E', charcoalSmoke: '#3A3733', stuccoPastel: '#E7D9C4',
};
/** Working tones derived from the twelve: thatch, shingle, plank, glass and the green of a growing thing. */
const THATCH = '#B9A46A', SHINGLE = '#7C6A4E', PLANK = '#8A6338', LEAF = '#4F7A3A', CLAY = '#8A5A3C';

export type ThaiStyle = 'central' | 'raft' | 'shophouse' | 'isan' | 'lanna' | 'kampong' | 'sinoPortuguese';

/** A steep Siamese gable: two faces on a ridge, the peak carried up into the `ngao` finial at each end.
 *  `tiers` repeats the slope in shorter, lower skirts, which is what makes a Lanna roof read as Lanna. */
export function thaiGable(w: number, d: number, y: number, rise: number, color: string, opts: { overhang?: number; finial?: boolean; tiers?: number; ridgeAlongX?: boolean } = {}): THREE.Group {
  const g = new THREE.Group();
  const overhang = opts.overhang ?? .45, tiers = opts.tiers ?? 1, ridgeAlongX = opts.ridgeAlongX ?? true;
  const span = (ridgeAlongX ? d : w) / 2 + overhang, length = (ridgeAlongX ? w : d) + overhang * 2;
  for (let tier = 0; tier < tiers; tier++) {
    // Each tier is a shorter slope starting lower on the wall, so the eaves step out as they come down.
    const f = 1 - tier * .34, ty = y - tier * rise * .42, ts = span * (1 + tier * .30), tr = rise * f;
    const slope = Math.hypot(ts, tr), angle = Math.atan2(tr, ts);
    for (const side of [-1, 1]) {
      const face = add(g, block(length + tier * .8, .11, slope, color), 0, ty + tr / 2, side * ts / 2);
      face.rotation.x = -side * angle;
      for (let i = 0; i < Math.floor((length + tier * .8) / .46); i++) add(face, block(.05, .05, slope, tier ? color : '#8f4022'), -(length + tier * .8) / 2 + .23 + i * .46, .07, 0);
    }
  }
  add(g, block(length, .13, .17, '#8f4022'), 0, y + rise + .04, 0);
  if (opts.finial !== false) for (const x of [-length / 2 + .1, length / 2 - .1]) {
    // The ngao: the barge board carried past the ridge and turned up in a slim horn.
    const horn = add(g, block(.07, .62, .07, TH.teakDark), x, y + rise + .34, 0);
    horn.rotation.z = x < 0 ? .5 : -.5;
    add(g, block(.06, .30, .06, TH.teakDark), x + (x < 0 ? .23 : -.23), y + rise + .72, 0).rotation.z = x < 0 ? 1.0 : -1.0;
  }
  if (!ridgeAlongX) g.rotation.y = Math.PI / 2;
  return g;
}

/** A shallow four-faced hip of tile or thatch, for the Malay village house and the tin-town shed. */
function hip(w: number, d: number, y: number, rise: number, color: string, overhang = .4): THREE.Group {
  const g = new THREE.Group(), W = w + overhang * 2, D = d + overhang * 2, rx = W * .2;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-W / 2, y, -D / 2, W / 2, y, -D / 2, W / 2, y, D / 2, -W / 2, y, D / 2, -rx, y + rise, 0, rx, y + rise, 0], 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0]); geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, mat(color)));
  add(g, block(rx * 2 + .12, .10, .14, '#8f4022'), 0, y + rise + .03, 0);
  return g;
}

/** The posts a Thai house stands on, with the cross bracing that stops them racking, and the ladder up. */
function posts(g: THREE.Group, w: number, d: number, lift: number, colour = TH.teakDark, ladder = true) {
  const xs = [-w / 2 + .3, 0, w / 2 - .3], zs = [-d / 2 + .3, d / 2 - .3];
  for (const x of xs) for (const z of zs) {
    add(g, block(.22, lift, .22, colour), x, lift / 2, z);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.22, .26, .12, 8), mat(TH.limestoneGrey)), x, .06, z);   // the stone footing keeps the post out of the mud
  }
  for (const z of zs) add(g, block(w - .4, .1, .12, colour), 0, lift * .45, z);
  if (ladder) {
    const lx = w / 2 - .7, lz = d / 2 + .34;
    for (const dx of [-.22, .22]) { const rail = add(g, block(.08, lift + .34, .08, colour), lx + dx, (lift + .34) / 2 - .1, lz); rail.rotation.x = -.26; }
    for (let i = 0; i < Math.max(2, Math.round(lift / .32)); i++) add(g, block(.52, .05, .1, PLANK), lx, .18 + i * .32, lz + .06 - i * .085);
  }
}

/** Water jars and a rice mortar at the foot of the posts: the dressing every Thai house has under it. */
function underHouse(g: THREE.Group, w: number, d: number) {
  for (const [i, x] of [-w / 2 + .5, -w / 2 + 1.0].entries()) {
    add(g, new THREE.Mesh(new THREE.SphereGeometry(.3, 9, 7), mat(CLAY)), x, .28, -d / 2 + .5 + i * .1).scale.y = 1.15;
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.19, .22, .07, 9), mat(TH.limestoneGrey)), x, .56, -d / 2 + .5 + i * .1);
  }
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24, .3, .42, 10), mat(TH.teakDark)), w / 2 - .6, .21, -d / 2 + .6);   // the rice mortar
}

function shutter(g: THREE.Group, x: number, y: number, z: number, colour: string, w = .52, h = .74) {
  add(g, block(w, h, .05, TH.charcoalSmoke), x, y, z);
  for (const side of [-1, 1]) add(g, block(w * .44, h, .04, colour), x + side * (w / 2 + w * .22), y, z + .012);
}

/** One Thai house in one of seven regional styles. The origin is the footprint centre, the front faces +z.
 *  A kitchen fire that leaves through a roof vent publishes `userData.smoke` at the vent, above the ridge,
 *  so the world assembler hangs the tinted wood-smoke thread on it exactly as it does for Spain's chimneys. */
export function thaiHouse(style: ThaiStyle, w = 3.2, d = 2.6, h = 2.2, opts: { storeys?: number; posts?: boolean } = {}): P {
  const g = new THREE.Group();
  const onPosts = opts.posts ?? (style === 'central' || style === 'isan' || style === 'lanna' || style === 'kampong' || style === 'raft');
  const storeys = style === 'shophouse' || style === 'sinoPortuguese' ? opts.storeys ?? 2 : 1;
  const lift = !onPosts ? 0 : style === 'central' ? 2.0 : style === 'isan' ? 1.5 : style === 'lanna' ? 1.8 : style === 'kampong' ? 1.3 : .45;
  const wall = style === 'isan' ? TH.bambooPale : style === 'shophouse' ? TH.stuccoPastel : style === 'sinoPortuguese' ? '#DFC9A8' : style === 'kampong' ? PLANK : TH.teakDark;
  const trim = style === 'shophouse' ? TH.lacquerRed : style === 'sinoPortuguese' ? TH.pelangiBlue : style === 'kampong' ? TH.pelangiBlue : style === 'lanna' ? TH.lacquerRed : TH.teakDark;
  const H = h * storeys, f = d / 2;
  let smoke: THREE.Vector3 | undefined, top = 0;

  if (onPosts) {
    posts(g, w, d, lift, style === 'isan' ? PLANK : TH.teakDark, style !== 'raft');
    if (style === 'raft') for (let i = 0; i < 5; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, w + .5, 7), mat(TH.bambooPale)), 0, .19, -d / 2 + .22 + i * (d - .44) / 4).rotation.z = Math.PI / 2;
    add(g, block(w + .5, .14, d + .5, PLANK), 0, lift + .07, 0);   // the platform floor, wider than the walls
    add(g, block(w, h, d, wall), 0, lift + .14 + h / 2, 0);
    // The open verandah under the eave: a rail rather than a wall on the front third.
    const vz = f + .18;
    for (const x of [-w / 2 + .12, w / 2 - .12]) add(g, block(.11, .96, .11, TH.teakDark), x, lift + .62, vz);
    add(g, block(w - .1, .07, .07, TH.teakDark), 0, lift + 1.02, vz);
    add(g, block(w - .1, .07, .07, TH.teakDark), 0, lift + .58, vz);
  } else {
    add(g, block(w, .42, d, TH.limestoneGrey), 0, .21, 0);
    add(g, block(w, H, d, wall), 0, .42 + H / 2, 0);
  }

  if (style === 'central') {
    // Panelled teak walls leaning very slightly inward, the shutters high, a steep tiled gable with ngao horns.
    for (let i = 0; i < Math.floor(w / .44); i++) add(g, block(.06, h - .18, .05, PLANK), -w / 2 + .22 + i * .44, lift + .14 + h / 2, f + .012);
    shutter(g, -w / 4, lift + .14 + h * .58, f + .04, trim);
    shutter(g, w / 4, lift + .14 + h * .58, f + .04, trim);
    add(g, block(.86, h * .78, .05, PLANK), 0, lift + .14 + h * .39, -f - .012);
    g.add(thaiGable(w, d, lift + .16 + h, d * .58, TH.watOrange, { overhang: .55 }));
    top = lift + .16 + h + d * .58;
    // The kitchen end has a louvred smoke vent in the gable; the fire is under it, on the platform.
    add(g, block(.5, .34, .1, TH.charcoalSmoke), w / 3, lift + .18 + h + d * .22, -f - .04);
    smoke = new THREE.Vector3(w / 3, top + .44, -f * .5);
  } else if (style === 'raft') {
    for (let i = 0; i < Math.floor(w / .5); i++) add(g, block(.07, h - .2, .05, TH.bambooPale), -w / 2 + .25 + i * .5, lift + .14 + h / 2, f + .012);
    g.add(thaiGable(w, d, lift + .16 + h, d * .46, THATCH, { overhang: .5, finial: false }));
    top = lift + .16 + h + d * .46;
  } else if (style === 'isan') {
    // Lower, plainer, split bamboo: the shaded tai thun space under it is the room that matters.
    for (let i = 0; i < Math.floor(w / .3); i++) add(g, block(.05, h - .22, .04, i % 2 ? PLANK : TH.bambooPale), -w / 2 + .15 + i * .3, lift + .14 + h / 2, f + .012);
    shutter(g, w / 4, lift + .14 + h * .6, f + .04, trim, .44, .6);
    g.add(thaiGable(w, d, lift + .16 + h, d * .40, THATCH, { overhang: .62, finial: false }));
    top = lift + .16 + h + d * .40;
    // The separate kitchen hut, its thatch smoke-blackened, standing on the platform's short end.
    const kw = 1.25, kx = -w / 2 - .5;
    add(g, block(kw, 1.05, 1.25, PLANK), kx, lift + .14 + .52, 0);
    add(g, hip(kw, 1.25, lift + 1.19, .46, TH.charcoalSmoke, .28), kx, 0, 0);
    smoke = new THREE.Vector3(kx, lift + 1.19 + .46 + .3, 0);
    for (let i = 0; i < 3; i++) { const jar = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24, .28, .62, 10), mat('#7A5230')), -w / 2 + .6 + i * .58, .31, d / 2 - .55); add(g, new THREE.Mesh(new THREE.CylinderGeometry(.2, .24, .08, 10), mat(TH.bambooPale)), jar.position.x, .66, jar.position.z); }   // the pla ra jars under the floor
    add(g, block(1.2, .07, .5, PLANK), w / 4, lift * .45, -d / 4);   // the loom in the shade under the floor
  } else if (style === 'lanna') {
    // Heavy teak posts, a deep three-tier shingle roof that comes down far lower than the central style,
    // and the crossed kalae barge boards over the gable that give the house its name.
    for (let i = 0; i < Math.floor(w / .52); i++) add(g, block(.08, h - .16, .05, PLANK), -w / 2 + .26 + i * .52, lift + .14 + h / 2, f + .012);
    shutter(g, -w / 4, lift + .14 + h * .56, f + .04, trim, .5, .66);
    g.add(thaiGable(w, d, lift + .16 + h, d * .40, SHINGLE, { overhang: .8, finial: false, tiers: 3 }));
    top = lift + .16 + h + d * .40;
    for (const side of [-1, 1]) {
      const kalae = add(g, block(.09, 1.5, .09, TH.teakDark), side * (w / 2 - .1), top + .32, 0);
      kalae.rotation.z = side * .62; kalae.rotation.x = 0;
    }
    add(g, block(.9, .16, .08, TH.lacquerRed), 0, lift + .14 + h - .12, f + .05);   // the ham yon lintel over the door
    add(g, block(.5, .3, .09, TH.charcoalSmoke), -w / 3, lift + .2 + h + d * .16, -f - .04);
    smoke = new THREE.Vector3(-w / 3, top + .4, -f * .5);
    for (const [i, x] of [-w / 2 + .5, -w / 2 + 1.05].entries()) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24, .28, .58, 10), mat('#7A5230')), x, .29, d / 2 - .4 + i * .08);   // the water-jar rack at the gate
  } else if (style === 'kampong') {
    // Plank walls, a steep hipped tile, a short flight of steps at the front instead of a ladder.
    for (let i = 0; i < Math.floor(w / .36); i++) add(g, block(.05, h - .2, .04, PLANK), -w / 2 + .18 + i * .36, lift + .14 + h / 2, f + .012);
    shutter(g, -w / 4, lift + .14 + h * .58, f + .04, trim, .5, .7);
    shutter(g, w / 4, lift + .14 + h * .58, f + .04, trim, .5, .7);
    g.add(hip(w, d, lift + .16 + h, d * .5, TH.watOrange, .5));
    top = lift + .16 + h + d * .5;
    for (let i = 0; i < 4; i++) add(g, block(1.0, .08, .26, TH.limestoneGrey), 0, .18 + i * .3, d / 2 + .78 - i * .24);
    add(g, block(.5, .28, .1, TH.charcoalSmoke), w / 3, lift + .2 + h + d * .2, -f - .04);
    smoke = new THREE.Vector3(w / 3, top + .38, -f * .5);
  } else if (style === 'shophouse') {
    // A row read as one building: brick-and-timber fronts, an open shopfront under a five-foot way, the
    // upper floor shuttered, a low pantile over the whole terrace.
    const bays = Math.max(2, Math.round(w / 2.4));
    for (let i = 0; i < bays; i++) {
      const x = -w / 2 + (i + .5) * w / bays;
      add(g, block(w / bays - .22, h * .9, .06, TH.charcoalSmoke), x, .42 + h * .45, f + .02);   // the open shopfront
      add(g, block(.22, H, d + .12, TH.stuccoPastel), x - w / bays / 2, .42 + H / 2, 0);        // the party wall between fronts
      shutter(g, x, .42 + h + h * .5, f + .04, trim, .58, .8);
      add(g, block(w / bays - .4, .07, .34, TH.teakDark), x, .42 + h + .02, f + .2);            // the shop sign board
      if (i % 2 === 0) { const lamp = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .3, 9), mat(TH.lacquerRed)), x, .42 + h - .22, f + .4); lamp.name = 'shophouse-lantern'; }
    }
    add(g, block(.22, H, d + .12, TH.stuccoPastel), w / 2, .42 + H / 2, 0);
    // The five-foot way: a covered walk on posts in front of the shopfronts.
    for (let i = 0; i <= bays; i++) add(g, block(.16, h, .16, TH.stuccoPastel), -w / 2 + i * w / bays, h / 2 + .42, f + .95);
    add(g, block(w + .35, .14, 1.15, TH.teakDark), 0, .42 + h + .05, f + .6);
    g.add(thaiGable(w, d + 1.1, .42 + H + .02, d * .2, TH.watOrange, { overhang: .3, finial: false }));
    top = .42 + H + .02 + d * .2;
  } else {
    // sinoPortuguese: pastel render, moulded pilasters, arched shuttered windows, an arcaded walk.
    add(g, block(w + .1, .34, d + .1, TH.stuccoPastel), 0, .42 + H + .17, 0);
    for (let i = 0; i <= 3; i++) add(g, block(.2, H, .12, TH.stuccoPastel), -w / 2 + i * w / 3, .42 + H / 2, f + .06);
    for (let i = 0; i < 3; i++) {
      const x = -w / 2 + (i + .5) * w / 3;
      shutter(g, x, .42 + h * 1.5, f + .05, trim, .48, .8);
      add(g, new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .09, 12, 1, false, 0, Math.PI), mat(TH.stuccoPastel)), x, .42 + h * 1.5 + .42, f + .05).rotation.x = Math.PI / 2;
      add(g, block(.72, h - .3, .06, TH.charcoalSmoke), x, .42 + (h - .3) / 2, f + .02);
    }
    for (let i = 0; i <= 3; i++) add(g, block(.18, h, .18, TH.stuccoPastel), -w / 2 + i * w / 3, h / 2 + .42, f + .95);
    add(g, block(w + .3, .16, 1.15, TH.stuccoPastel), 0, .42 + h + .06, f + .55);
    g.add(hip(w, d, .42 + H + .34, d * .18, TH.watOrange, .3));
    top = .42 + H + .34 + d * .18;
  }
  if (onPosts && style !== 'raft') underHouse(g, w, d);

  const result = masonry(g) as P;
  result.userData.houseStyle = style; result.userData.storeys = storeys; result.userData.roofTop = top;
  // Same sprite size, count and opacity as a stand's steam, in the wood-smoke grey-white that reads at
  // overview zoom. The anchor is taken from the assembled house rather than from the wall arithmetic: a ngao
  // finial and a kalae cross stand well above the ridge, and smoke born under them is smoke nobody sees.
  if (smoke) {
    const box = new THREE.Box3().setFromObject(result);
    smoke.y = box.max.y + .24;
    result.userData.smoke = smoke; result.userData.smokeTint = '#b5aea3';
  }
  return result;
}

/** A whitewashed chedi: a stepped square base, a bell, a ringed spire and a gilded tip. */
export function watChedi(h = 5.2): P {
  const g = new THREE.Group(), r = h * .19;
  for (let i = 0; i < 3; i++) add(g, block(r * (2.6 - i * .4), h * .06, r * (2.6 - i * .4), TH.stuccoPastel), 0, h * .03 + i * h * .06, 0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(TH.stuccoPastel)), 0, h * .2, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * .72, r * .95, h * .16, 14), mat(TH.stuccoPastel)), 0, h * .28, 0);
  for (let i = 0; i < 9; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * (.5 - i * .045), r * (.55 - i * .045), h * .05, 12), mat(i % 2 ? TH.chediGold : TH.stuccoPastel)), 0, h * .38 + i * h * .05, 0);
  add(g, new THREE.Mesh(new THREE.ConeGeometry(r * .12, h * .18, 10), mat(TH.chediGold)), 0, h * .92, 0);
  return masonry(g) as P;
}

/** An open sala: six posts, a tiled tiered roof and a plank floor, the shelter that stands at every landing. */
export function salaPavilion(w = 2.6, d = 2.0): P {
  const g = new THREE.Group(), leg = 1.9;
  add(g, block(w + .4, .14, d + .4, PLANK), 0, .3, 0);
  for (const x of [-w / 2, 0, w / 2]) for (const z of [-d / 2, d / 2]) add(g, block(.14, leg, .14, TH.teakDark), x, leg / 2 + .37, z);
  for (const z of [-d / 2, d / 2]) add(g, block(w + .3, .12, .12, TH.teakDark), 0, leg + .4, z);
  for (const x of [-w / 2, w / 2]) add(g, block(.12, .34, d, TH.teakDark), x, .55, 0);   // the bench rail along each side
  g.add(thaiGable(w, d, leg + .46, d * .52, TH.watOrange, { overhang: .55, tiers: 2 }));
  return masonry(g) as P;
}

/** A rice barn on its own posts: a plank chamber with a plank door and a short thatched gable. */
export function riceBarn(): P {
  const g = new THREE.Group(), w = 2.1, d = 1.5, lift = 1.1;
  for (const x of [-w / 2 + .22, w / 2 - .22]) for (const z of [-d / 2 + .2, d / 2 - .2]) {
    add(g, block(.2, lift, .2, TH.teakDark), x, lift / 2, z);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .1, 10), mat(TH.limestoneGrey)), x, lift + .04, z);   // the rat guard under the floor
  }
  add(g, block(w, .12, d, PLANK), 0, lift + .15, 0);
  add(g, block(w, 1.25, d, PLANK), 0, lift + .82, 0);
  for (let i = 0; i < 5; i++) add(g, block(.07, 1.25, .04, TH.teakDark), -w / 2 + .25 + i * (w - .5) / 4, lift + .82, d / 2 + .02);
  add(g, block(.62, .82, .05, '#4A3020'), 0, lift + .62, d / 2 + .05);
  g.add(thaiGable(w, d, lift + 1.46, d * .52, THATCH, { overhang: .42, finial: false }));
  return masonry(g) as P;
}

/** A toddy-palm tapper's rig: the notched bamboo ladder lashed up a palm trunk, and the sap cylinders at its foot. */
export function sugarPalmRig(h = 4.6): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.19, .3, h, 9), mat('#6B5334')), 0, h / 2, 0);
  for (let i = 0; i < 11; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(.26 + i * .004, .03, 4, 9), mat('#5B4630')), 0, .45 + i * (h - .9) / 10, 0).rotation.x = Math.PI / 2;
  const ladder = add(g, block(.12, h - .5, .12, TH.bambooPale), .34, (h - .5) / 2 + .15, .12); ladder.rotation.z = -.05;
  for (let i = 0; i < 9; i++) add(g, block(.44, .05, .07, TH.bambooPale), .3, .5 + i * (h - 1.1) / 8, .12);
  for (const [i, a] of [0, 1.4, 2.8, 4.2, 5.4].entries()) {
    const frond = add(g, block(2.3, .07, .34, LEAF), Math.cos(a) * 1.05, h + .18 - (i % 2) * .16, Math.sin(a) * 1.05);
    frond.rotation.y = -a; frond.rotation.z = -.32 - (i % 2) * .1;
  }
  for (const [i, x] of [-.55, -.3].entries()) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .48, 8), mat(TH.bambooPale)), x, .24, .5 + i * .22);   // the sap cylinders waiting
  return masonry(g) as P;
}

/** A salt pan shed: a thatched lean-to over a plank floor, with the raking boards leaning on its gable. */
export function saltPanShed(): P {
  const g = new THREE.Group(), w = 2.4, d = 1.8, leg = 1.5;
  add(g, block(w + .3, .1, d + .3, PLANK), 0, .18, 0);
  for (const x of [-w / 2, w / 2]) { add(g, block(.13, leg, .13, TH.teakDark), x, leg / 2 + .22, -d / 2); add(g, block(.13, leg * .72, .13, TH.teakDark), x, leg * .36 + .22, d / 2); }
  const roof = add(g, block(w + .5, .1, d + .7, THATCH), 0, leg + .12, .06); roof.rotation.x = .34;
  add(g, block(w + .3, .12, .12, TH.teakDark), 0, leg + .28, -d / 2);
  for (const [i, x] of [-.7, -.3, .2].entries()) { const rake = add(g, block(.06, 1.7, .06, TH.teakDark), x, .95, d / 2 + .16 + i * .07); rake.rotation.x = .28; add(g, block(.66, .06, .12, PLANK), x, .18, d / 2 + .62 + i * .07); }
  for (let i = 0; i < 3; i++) { const cone = add(g, new THREE.Mesh(new THREE.ConeGeometry(.42, .55, 10), mat('#F4EFE6')), -w / 2 + .5 + i * .9, .27, -d / 2 - .9); cone.name = 'salt-cone'; }
  return masonry(g) as P;
}

/** A spirit house: a small gabled shrine on a single post, with offerings on its platform.
 *  Every compound in the area has one, and it is the smallest building on the table. */
export function spiritHouse(): P {
  const g = new THREE.Group(), lift = 1.25;
  add(g, block(.34, lift, .34, TH.stuccoPastel), 0, lift / 2, 0);
  add(g, block(.86, .1, .78, TH.stuccoPastel), 0, lift + .05, 0);
  add(g, block(.56, .48, .5, TH.lacquerRed), 0, lift + .34, -.06);
  for (const x of [-.22, .22]) add(g, block(.06, .48, .06, TH.chediGold), x, lift + .34, .2);
  g.add(thaiGable(.62, .56, lift + .6, .42, TH.watOrange, { overhang: .18 }));
  const stone = masonry(g) as P;
  for (const [i, x] of [-.24, 0, .24].entries()) {
    add(stone, new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, .09, 8), mat(TH.chediGold)), x, lift + .14, .28);
    add(stone, new THREE.Mesh(new THREE.SphereGeometry(.05, 7, 6), mat(i % 2 ? '#E8B4C8' : '#F2E0A0')), x, lift + .22, .28);   // a garland and a cup of rice
  }
  stone.userData.houseStyle = 'spirit';
  return stone;
}

/** A landing stage on the canal bank: plank deck on four posts, with a mooring bollard and a jar of water. */
export function landingStage(w = 1.8): P {
  const g = new THREE.Group();
  for (const x of [-w / 2 + .18, w / 2 - .18]) for (const z of [-.5, .5]) add(g, block(.16, .78, .16, TH.teakDark), x, .39, z);
  add(g, block(w, .1, 1.3, PLANK), 0, .82, 0);
  add(g, block(.18, .5, .18, TH.teakDark), w / 2 - .3, 1.1, .5);
  for (let i = 0; i < 3; i++) add(g, block(w - .3, .05, .12, PLANK), 0, .5 + i * .16, -.72 + i * .1);   // the steps down to the water
  return masonry(g) as P;
}
