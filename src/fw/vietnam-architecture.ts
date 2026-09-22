/** Vietnamese building vocabulary for the Southeast Asia table: lime wash and ochre render over brick in the
 *  towns, yin-yang tile on two slopes, teak frames and folded shutters, bamboo screens on the Red River
 *  courtyards, palm leaf over the delta, and a timber floor on posts where the ground is wet. Pure builders,
 *  no positions: `vietnam-town.ts` and `vietnam-countryside.ts` decide where a house stands.
 *
 *  The period band is 1900 to 1931 (docs/vietnam-research.md section 8), so nothing here is rendered concrete,
 *  plate glass or a modern shopfront. Materials follow the cluster characters in that document's section 3.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';

/** The twelve palette names. docs/vietnam-research.md carries no colour table, so these are named for the
 *  materials its section 3 lists per cluster, and the values are the ones `props-vietnam.ts` already uses for
 *  the same materials, so the stands and the town read as one area. */
export const VN = {
  voi: '#F1E8D6',        // vôi, lime wash on the guild street and the Huế garden walls
  hoangTho: '#D9A24A',   // hoàng thổ, the ochre render of the Old Quarter fronts
  gach: '#B4572F',       // gạch, brick and terracotta
  ngoi: '#6A5B4A',       // ngói âm dương, yin-yang roof tile
  ngoiAm: '#4A4038',     // the darker ridge and hip tile
  go: '#7A4A2A',         // gỗ, teak and ironwood framing
  goDam: '#4A2F1C',      // gỗ đậm, the dark oiled timber of shutters and doors
  tre: '#C9B06A',        // tre, bamboo screen and scaffold
  la: '#D9C088',         // lá, palm and water-coconut leaf thatch
  dat: '#C9C0A8',        // đất, swept earth and brick dust underfoot
  song: '#6F9FA8',       // sông, the river seen through a doorway
  luc: '#6F9B57',        // lục, the delta's wet green
};

export type VietnamStyle = 'tube' | 'courtyard' | 'hue' | 'hoiAn' | 'cholon' | 'stilt';

const RIDGE = '#3B332C', SHUTTER = '#6E5233', LIME_TRIM = '#E2D7BE';

/** Two tiled slopes on a ridge beam, the Vietnamese way: a deep overhang, half-round tile laid along the
 *  slope and a heavy ridge. Leaf thatch gets layered courses instead of tile rolls. */
export function tileRoof(w: number, d: number, y: number, rise: number, color = VN.ngoi, overhang = .42, ridgeAlongX = true): THREE.Group {
  const g = new THREE.Group();
  const span = (ridgeAlongX ? d : w) / 2 + overhang, length = (ridgeAlongX ? w : d) + overhang * 2;
  const slope = Math.hypot(span, rise), angle = Math.atan2(rise, span);
  const leaf = color === VN.la;
  for (const side of [-1, 1]) {
    const face = add(g, block(length, .1, slope, color), 0, y + rise / 2, side * span / 2);
    face.rotation.x = -side * angle;
    if (leaf) for (let i = 0; i < 5; i++) add(face, block(length, .035, slope / 6, '#B79E62'), 0, .06, -slope / 2 + slope / 6 * (i + .8));
    else for (let i = 0; i < Math.floor(length / .34); i++) {
      const roll = add(face, new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, slope, 6), mat(side > 0 ? color : VN.ngoiAm)), -length / 2 + .17 + i * .34, .06, 0);
      roll.rotation.x = Math.PI / 2;
    }
  }
  add(g, block(length + .1, .13, .18, leaf ? VN.go : RIDGE), 0, y + rise + .04, 0);
  if (!ridgeAlongX) g.rotation.y = Math.PI / 2;
  return g;
}

/** Four tiled faces on a short ridge, with the eaves lifted at the corners: the Huế garden house and the
 *  communal roofs of the Red River villages. */
export function hipRoof(w: number, d: number, y: number, rise: number, color = VN.ngoi): THREE.Group {
  const g = new THREE.Group(), rx = w * .2, over = .36;
  const W = w + over * 2, D = d + over * 2;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-W / 2, y, -D / 2, W / 2, y, -D / 2, W / 2, y, D / 2, -W / 2, y, D / 2, -rx, y + rise, 0, rx, y + rise, 0], 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0]); geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, mat(color)));
  // the eave board, and the four corner horns that lift the tile: the roof reads as Huế from above and from the side
  for (const z of [-D / 2, D / 2]) add(g, block(W, .12, .14, VN.ngoiAm), 0, y - .04, z);
  for (const x of [-W / 2, W / 2]) add(g, block(.14, .12, D, VN.ngoiAm), x, y - .04, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const horn = add(g, block(.5, .1, .1, VN.ngoiAm), sx * (W / 2 - .2), y + .08, sz * (D / 2 - .06));
    horn.rotation.z = sx * -.45; horn.rotation.y = sx * sz * .5;
  }
  add(g, block(rx * 2 + .3, .12, .16, RIDGE), 0, y + rise + .03, 0);
  return g;
}

/** A bank of folded timber shutters over a shop opening. */
function shutters(g: THREE.Group, x: number, y: number, z: number, w: number, h: number) {
  add(g, block(w, h, .05, VN.goDam), x, y, z);
  const leaves = Math.max(2, Math.round(w / .3));
  for (let i = 0; i < leaves; i++) add(g, block(w / leaves - .04, h - .06, .04, i % 2 ? SHUTTER : VN.go), x - w / 2 + (i + .5) * w / leaves, y, z + .03);
  add(g, block(w + .12, .07, .22, VN.go), x, y + h / 2 + .06, z + .08);   // the lintel board keeps the rain off the leaves
}
/** A bamboo screen: split canes on two rails, the Red River courtyard's shade. */
function bambooScreen(g: THREE.Group, x: number, y: number, z: number, w: number, h: number) {
  for (let i = 0; i < Math.round(w / .12); i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, h, 5), mat(i % 3 ? VN.tre : '#B79E62')), x - w / 2 + .06 + i * .12, y, z);
  for (const dy of [-h / 2 + .08, h / 2 - .08]) add(g, block(w, .06, .07, VN.go), x, y + dy, z + .02);
}
function doorLeaf(g: THREE.Group, x: number, z: number, w = .82, h = 1.6, colour = VN.goDam) {
  add(g, block(w, h, .06, colour), x, h / 2, z);
  add(g, block(.03, h, .02, '#8A6A44'), x, h / 2, z + .04);
  for (const sx of [-1, 1]) add(g, block(.07, h + .08, .07, VN.go), x + sx * (w / 2 + .04), (h + .08) / 2, z);
  add(g, block(w + .3, .1, .14, VN.go), x, h + .1, z);
}

/**
 * One house in one of six regional styles, origin at the footprint centre, front towards +z.
 *
 * - `tube`  the Old Quarter tube house: a narrow ochre front, two or three shallow storeys, folded shutters
 *           and a tiled pitch. `fronts` builds a terrace of that many party-walled fronts as one building
 * - `courtyard` the Red River craft house: low, wide, bamboo-screened, a tiled hip over an earth floor
 * - `hue`   the garden house: a timber frame on stone bases inside its own wall, a steep lifted hip roof
 * - `hoiAn` the shophouse front: brick and lime below, timber above, shutters to the street, tile over
 * - `cholon` the Chợ Lớn row: a rendered parapet front with arched upper openings, deeper than it is wide
 * - `stilt` the delta house: a leaf roof over a plank floor on ironwood posts, with a ladder to the ground
 */
export function vietnamHouse(style: VietnamStyle, w = 3.2, d = 2.6, h = 2.6, opts: { storeys?: number; posts?: boolean; fronts?: number } = {}): P {
  const g = new THREE.Group();
  const storeys = style === 'courtyard' || style === 'hue' || style === 'stilt' ? 1 : opts.storeys ?? 2;
  const onPosts = opts.posts ?? style === 'stilt';
  const lift = onPosts ? 1.05 : 0;
  const H = h * storeys, f = d / 2;
  const wall = style === 'tube' ? VN.hoangTho : style === 'cholon' ? '#E6D2A8' : style === 'stilt' ? VN.tre : VN.voi;
  const trim = style === 'hue' || style === 'courtyard' ? VN.go : VN.goDam;

  if (style === 'tube' && (opts.fronts ?? 1) > 1) {
    // A terrace: narrow fronts sharing party walls, each a little different in wash and height, under one
    // run of tile. It is one building, and counts as one decorative house.
    const n = opts.fronts!, washes = [VN.hoangTho, '#E7C98A', VN.voi, '#D9B06A'];
    for (let i = 0; i < n; i++) {
      const x = -((n - 1) / 2) * w + i * w, hh = H + (i % 2 ? .22 : 0);
      add(g, block(w - .06, hh, d, washes[i % washes.length]), x, hh / 2, 0);
      add(g, block(.12, hh + .12, d + .1, VN.voi), x + w / 2, (hh + .12) / 2, 0);   // the party wall stands proud
      doorLeaf(g, x - w * .22, f + .02, .74, 1.5);
      shutters(g, x + w * .2, h * .52, f + .03, w * .4, .82);
      for (let s = 1; s < storeys; s++) {
        shutters(g, x, s * h + h * .55, f + .03, w * .5, .86);
        add(g, block(w * .66, .07, .3, VN.go), x, s * h + h * .28, f + .16);        // the shallow awning over the street
        for (let k = 0; k < 4; k++) add(g, block(.03, .32, .03, VN.goDam), x - w * .2 + k * w * .13, s * h + h * .46, f + .3);
      }
      g.add(tileRoof(w - .02, d, hh + .02, d * .3, VN.ngoi, .3));
      (g.children[g.children.length - 1] as THREE.Group).position.x = x;
    }
    add(g, block(n * w + .2, .12, .2, VN.go), 0, H + .04, f + .06);
    const terrace = masonry(g) as P;
    terrace.userData.houseStyle = style; terrace.userData.storeys = storeys; terrace.userData.fronts = n;
    return terrace;
  }

  if (onPosts) {
    for (const x of [-w / 2 + .25, 0, w / 2 - .25]) for (const z of [-f + .25, f - .25])
      add(g, new THREE.Mesh(new THREE.CylinderGeometry(.1, .12, lift, 7), mat(VN.go)), x, lift / 2, z);
    add(g, block(w + .3, .14, d + .3, '#A37A4F'), 0, lift + .07, 0);                 // the plank floor, proud of the posts
    for (let i = 0; i < 5; i++) add(g, block(.5, .07, .1, VN.go), 0, lift * (i + .4) / 5.4, f + .3 + i * .08).rotation.x = .12;   // the ladder
  }
  const base = lift + (onPosts ? .14 : 0);
  add(g, block(w, H, d, wall), 0, base + H / 2, 0);
  if (style === 'hoiAn' || style === 'cholon') add(g, block(w + .06, .7, d + .06, VN.gach), 0, base + .35, 0);   // a brick plinth against the flood
  if (style === 'hue' || style === 'courtyard') {
    // a timber frame on stone bases, read on the front face
    for (const x of [-w / 2 + .18, -w / 6, w / 6, w / 2 - .18]) {
      add(g, block(.16, H, .16, trim), x, base + H / 2, f - .04);
      add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .19, .18, 8), mat('#9A968C')), x, base + .09, f - .04);
    }
    add(g, block(w + .2, .14, .2, trim), 0, base + H - .05, f - .04);
  }
  doorLeaf(g, style === 'cholon' ? 0 : -w / 4, f + .02, style === 'hue' ? 1.0 : .82, 1.6, trim);
  if (style === 'courtyard') { bambooScreen(g, w / 5, base + h * .55, f + .05, w * .44, h * .6); bambooScreen(g, -w / 4, base + h * .55, -f - .05, w * .3, h * .5); }
  else if (style === 'hue') { shutters(g, w / 4, base + h * .55, f + .04, w * .36, .9); add(g, block(w * .9, .08, .95, VN.go), 0, base + h - .1, f + .45); for (const x of [-w * .35, w * .35]) add(g, block(.12, h - .1, .12, VN.go), x, base + (h - .1) / 2, f + .82); }
  else for (let s = 0; s < storeys; s++) {
    const y = base + s * h + h * .55;
    if (s === 0 && style !== 'cholon') shutters(g, w / 4, y, f + .04, w * .36, .86);
    else if (s > 0) {
      if (style === 'cholon') {
        // rendered parapet front: two arched openings with a moulded sill band
        for (const x of [-w / 4, w / 4]) { add(g, block(w * .3, h * .5, .05, VN.goDam), x, y, f + .03); add(g, new THREE.Mesh(new THREE.CylinderGeometry(w * .15, w * .15, .05, 12, 1, false, 0, Math.PI), mat(VN.goDam)), x, y + h * .25, f + .03).rotation.set(Math.PI / 2, 0, 0); }
        add(g, block(w + .1, .1, .22, LIME_TRIM), 0, y - h * .3, f + .06);
      } else shutters(g, 0, y, f + .04, w * .52, .9);
      for (let k = 0; k < 5; k++) add(g, block(.03, .34, .03, VN.goDam), -w * .22 + k * w * .11, y - h * .3, f + .28);   // the balcony rail
      add(g, block(w * .72, .07, .34, VN.go), 0, y - h * .34, f + .2);
    }
  }
  if (style === 'stilt') { for (const z of [-f, f]) add(g, block(w + .3, .1, .12, VN.go), 0, base + H - .06, z); }

  if (style === 'hue' || style === 'courtyard') g.add(hipRoof(w, d, base + H + .02, d * .46, VN.ngoi));
  else if (style === 'cholon') {
    add(g, block(w + .12, .55, .18, wall), 0, base + H + .28, f - .02);              // the street parapet hides the pitch
    add(g, block(w + .12, .12, .24, LIME_TRIM), 0, base + H + .56, f - .02);
    g.add(tileRoof(w, d - .3, base + H + .02, d * .24, VN.ngoi, .24));
  } else g.add(tileRoof(w, d, base + H + .02, d * (style === 'stilt' ? .5 : .32), style === 'stilt' ? VN.la : VN.ngoi, style === 'stilt' ? .38 : .4));

  // A kitchen flue where the style has one: brick in the courtyard and the row, a clay pipe through the leaf
  // roof in the delta. Its top is published as userData.smoke so the world hangs a tinted column on it.
  let smoke: THREE.Vector3 | undefined;
  if (style === 'courtyard' || style === 'cholon' || style === 'stilt') {
    const cx = w / 3.2, cz = -f * .45;
    const ridge = style === 'courtyard' ? d * .46 + .1 : style === 'cholon' ? d * .24 + .1 : d * .5 + .1;
    const capY = base + H + .02 + ridge + .42, foot = base + H + .18, shaft = capY - .07 - foot;
    add(g, block(.34, shaft, .34, style === 'stilt' ? '#9A7448' : VN.gach), cx, foot + shaft / 2, cz);
    add(g, block(.44, .09, .44, VN.ngoiAm), cx, capY, cz);
    smoke = new THREE.Vector3(cx, capY + .22, cz);
  }
  const house = masonry(g) as P;
  house.userData.houseStyle = style; house.userData.storeys = storeys;
  if (smoke) { house.userData.smoke = smoke; house.userData.smokeTint = '#b5aea3'; }
  return house;
}

/** A garden wall with a tiled coping and an open gateway: what closes a Huế garden and a Red River courtyard
 *  without becoming a building. Origin at the centre of the run, the gateway on +z. */
export function gardenWall(w = 5.2, h = 1.35, gate = 1.3): P {
  const g = new THREE.Group(), side = (w - gate) / 2;
  for (const sx of [-1, 1]) {
    add(g, block(side, h, .26, VN.voi), sx * (gate / 2 + side / 2), h / 2, 0);
    add(g, block(side + .1, .12, .4, VN.ngoiAm), sx * (gate / 2 + side / 2), h + .06, 0);
    add(g, block(.3, h + .28, .34, VN.voi), sx * gate / 2, (h + .28) / 2, 0);        // the gate pier
    add(g, block(.4, .1, .44, VN.ngoiAm), sx * gate / 2, h + .34, 0);
  }
  return masonry(g) as P;
}

/** A low timber crossing over a river or a channel: two stone abutments, a plank deck at the road height and
 *  a rail each side, so a walker steps up on to it and comes down again instead of wading. */
export function woodenBridge(len = 5.4, deckY = .22): P {
  const g = new THREE.Group();
  // No two of the deck, the abutment, the rail and the ramp end in one plane at either end of the span.
  for (const x of [-len / 2 + .8, len / 2 - .8]) add(g, block(1.1, deckY - .08, 2.0, '#9A968C'), x, (deckY - .08) / 2, 0);
  add(g, block(len, .1, 1.8, VN.go), 0, deckY - .05, 0);
  for (let i = 0; i < 10; i++) add(g, block(.09, .04, 1.62, VN.goDam), -len / 2 + .32 + i * (len - .64) / 9, deckY + .02, 0);
  for (const z of [-.85, .85]) {
    add(g, block(len - .36, .07, .07, VN.go), 0, deckY + .56, z);
    for (let i = 0; i <= 4; i++) add(g, block(.085, .5, .085, VN.go), -len / 2 + .25 + i * (len - .5) / 4, deckY + .29, z);
  }
  // The ramp on to the lane starts clear of the abutment, so no two faces lie in one plane.
  for (const side of [-1, 1]) add(g, block(.6, .1, 1.8, '#B7A986'), side * (len / 2 + .4), deckY - .06, 0).rotation.z = side * -.16;
  return masonry(g) as P;
}
