/** Italian building vocabulary for the Italy table: ochre stucco and pantile over travertine in Rome, brick
 *  and Istrian stone on the Venetian quays, lime wash and a flat-ish tile on the terraferma, tufa under
 *  awnings in Palermo and lava rubble on the Etna coast. Pure builders, no positions.
 *
 *  The twelve palette names are the ones in docs/italy-image-brief.md, "Palette". `props-italy.ts` carries its
 *  own older `IT` constant for the stands; this one is the Builder's and is called `ITP` so the two never
 *  collide, exactly as the Stage B module contract asks.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';

/** The twelve palette names from docs/italy-image-brief.md, "Palette". */
export const ITP = {
  romanOchre: '#C98F3F', travertine: '#E3D6BC', sanpietrino: '#5A5751', terracotta: '#B4572F',
  pineGreen: '#3F6B3F', campagnaStraw: '#C9B27A', venetianRed: '#A8433A', istrianStone: '#EDE6D6',
  lagoonGreen: '#69B3B0', adriaticBlue: '#2E6E8E', palermoTufa: '#D9C18E', etnaBasalt: '#3D3A3F',
};
/** Working tones derived from the twelve: shutter green, sun-bleached lime, glass, iron, timber, tile seam. */
const SHUTTER = '#4F6F4A', LIME = '#F3EDE2', GLASS = '#A9C4C9', IRON = '#2F3238', TIMBER = '#7A5232', SEAM = '#8F4022';

export type ItalyStyle = 'romanPalazzo' | 'trastevere' | 'casale' | 'venetianQuay' | 'buranoCottage' | 'terraferma' | 'palermoTufa' | 'sicilianCoast';

/** A pantile roof: two faces on a ridge with the half-round seams that read as coppi from above.
 *  Built with the ridge along local x; the whole group turns when the ridge should run along z. */
export function pantileRoof(w: number, d: number, y: number, rise: number, color = ITP.terracotta, overhang = .34, ridgeAlongX = true): THREE.Group {
  const g = new THREE.Group();
  const span = (ridgeAlongX ? d : w) / 2 + overhang, length = (ridgeAlongX ? w : d) + overhang * 2;
  const slope = Math.hypot(span, rise), angle = Math.atan2(rise, span);
  for (const side of [-1, 1]) {
    const face = add(g, block(length, .10, slope, color), 0, y + rise / 2, side * span / 2);
    face.rotation.x = -side * angle;
    for (let i = 0; i < Math.floor(length / .40); i++) add(face, block(.05, .05, slope, SEAM), -length / 2 + .20 + i * .40, .065, 0);
  }
  add(g, block(length, .11, .15, SEAM), 0, y + rise + .03, 0);
  if (!ridgeAlongX) g.rotation.y = Math.PI / 2;
  return g;
}

/** A low hipped tile roof of the Sicilian and terraferma kind: four faces on a short ridge. */
function hipRoof(w: number, d: number, y: number, rise: number, color: string, overhang = .34): THREE.Group {
  const g = new THREE.Group(), W = w + overhang * 2, D = d + overhang * 2, rx = W * .22;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-W / 2, y, -D / 2, W / 2, y, -D / 2, W / 2, y, D / 2, -W / 2, y, D / 2, -rx, y + rise, 0, rx, y + rise, 0], 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0]); geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, mat(color)));
  add(g, block(rx * 2 + .12, .09, .13, SEAM), 0, y + rise + .02, 0);
  return g;
}

function shutteredWindow(g: THREE.Group, x: number, y: number, z: number, colour = SHUTTER, w = .5, h = .74) {
  add(g, block(w, h, .05, '#4A4640'), x, y, z);
  for (const side of [-1, 1]) add(g, block(w * .44, h, .04, colour), x + side * (w / 2 + w * .22), y, z + .012);
}
function doorway(g: THREE.Group, x: number, z: number, colour: string, w = .82, h = 1.55) {
  add(g, block(w, h, .06, colour), x, h / 2, z);
  for (const side of [-1, 1]) add(g, block(.07, h + .06, .07, ITP.travertine), x + side * (w / 2 + .035), (h + .06) / 2, z);
}
/** The iron balcony on a Roman or Palermitan front, with its stone slab. */
function balcony(g: THREE.Group, x: number, y: number, z: number, w = .92) {
  add(g, block(w, .06, .32, ITP.travertine), x, y, z + .16);
  const bars = Math.max(4, Math.round(w / .13));
  for (let i = 0; i <= bars; i++) add(g, block(.02, .40, .02, IRON), x - w / 2 + i * w / bars, y + .22, z + .31);
  add(g, block(w, .025, .025, IRON), x, y + .43, z + .31);
}
/** A pot of basil or a geranium on a sill: the smallest detail on an Italian front. */
function sillPot(g: THREE.Group, x: number, y: number, z: number, n = 2) {
  for (let k = 0; k < n; k++) {
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.07, .06, .12, 7), mat(ITP.terracotta)), x + (k - (n - 1) / 2) * .26, y + .06, z);
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.10, 0), mat(k % 2 ? ITP.pineGreen : '#C8383A')), x + (k - (n - 1) / 2) * .26, y + .18, z);
  }
}

/** One Italian building in one of the eight styles the blueprint names. Origin is the footprint centre and
 *  the front faces +z, which is the direction the visitor's camera comes from.
 *
 *  A house with a kitchen hearth publishes `userData.smoke` above its own ridge, plus the wood-smoke tint, so
 *  `buildWorld` hangs the denser column on it and it reads at the overview zoom. */
export function italyBuilding(style: ItalyStyle, w = 3, d = 2.4, h = 2.2, opts: { storeys?: number } = {}): P {
  const g = new THREE.Group();
  const storeys = opts.storeys ?? (style === 'romanPalazzo' ? 3 : style === 'trastevere' || style === 'venetianQuay' ? 2 : 1);
  const H = h * storeys, f = d / 2;
  const wall = style === 'romanPalazzo' ? ITP.romanOchre
    : style === 'trastevere' ? ['#D9A55B', '#C17A4E', '#D7A48E'][Math.round(w * 10) % 3]
      : style === 'casale' ? ITP.campagnaStraw
        : style === 'venetianQuay' ? ITP.venetianRed
          : style === 'buranoCottage' ? ['#E0B36A', '#4E8FA8', '#C05A4A', '#7FA85C'][Math.round(w * 10) % 4]
            : style === 'terraferma' ? LIME
              : style === 'palermoTufa' ? ITP.palermoTufa : ITP.istrianStone;
  const trim = style === 'venetianQuay' || style === 'buranoCottage' ? ITP.istrianStone : style === 'sicilianCoast' ? ITP.etnaBasalt : SHUTTER;

  // The base course: travertine in Rome, Istrian stone at the water line in Venice, lava on the Etna coast.
  if (style === 'romanPalazzo' || style === 'trastevere') add(g, block(w + .06, .62, d + .06, ITP.travertine), 0, .31, 0);
  if (style === 'venetianQuay' || style === 'buranoCottage') add(g, block(w + .10, .46, d + .10, ITP.istrianStone), 0, .23, 0);
  if (style === 'sicilianCoast') add(g, block(w + .08, .40, d + .08, ITP.etnaBasalt), 0, .20, 0);
  add(g, block(w, H, d, wall), 0, H / 2, 0);
  // Storey bands, and the rusticated quoins a palazzo is read by.
  if (style === 'romanPalazzo') {
    for (let s = 1; s < storeys; s++) add(g, block(w + .08, .10, d + .08, ITP.travertine), 0, s * h, 0);
    for (const x of [-w / 2, w / 2]) for (let i = 0; i < Math.floor(H / .5); i++) add(g, block(.16, .34, .18, ITP.travertine), x, .3 + i * .5, -f + .12 + (i % 2) * .1);
    add(g, block(w + .18, .14, d + .18, ITP.travertine), 0, H - .07, 0);   // the cornice
  }
  if (style === 'casale') add(g, block(w + .06, .48, d + .06, ITP.travertine), 0, .24, 0);

  doorway(g, -w / 4, f + .01, style === 'venetianQuay' ? ITP.istrianStone : TIMBER);
  for (let s = 0; s < storeys; s++) {
    const y = s * h + (s ? h * .56 : h * .62);
    if (style === 'venetianQuay' && s > 0) {
      // A pointed four-light window with its own balcony: the one Venetian gesture a quay house always has.
      for (const [i, x] of [-w / 4, 0, w / 4].entries()) {
        add(g, block(.30, .78, .05, GLASS), x, y, f + .012);
        add(g, block(.34, .10, .06, ITP.istrianStone), x, y + .42, f + .014);
        add(g, new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .05, 10, 1, false, 0, Math.PI), mat(ITP.istrianStone)), x, y + .40, f + .016).rotation.x = Math.PI / 2;
        void i;
      }
      balcony(g, 0, y - .44, f, w * .8);
      continue;
    }
    if (s === 0) { shutteredWindow(g, w / 4, y, f + .01, trim); continue; }
    shutteredWindow(g, w / 4, y, f + .01, trim, .5, .8);
    if (style === 'romanPalazzo' || style === 'trastevere' || style === 'palermoTufa') balcony(g, w / 4, y - .42, f, .88);
    if (style === 'trastevere' || style === 'palermoTufa') sillPot(g, w / 4, y - .36, f + .30, 2);
  }
  // A washing line across the front of a Trastevere or Palermo alley house: the sign that it is lived in.
  if (style === 'trastevere' || style === 'palermoTufa') {
    const line = add(g, block(w * .9, .02, .02, '#B7A986'), 0, H - .34, f + .26);
    for (let i = 0; i < 4; i++) add(line, block(.20, .26, .02, ['#EFE6D6', '#C9D6E0', '#E8CBA0', '#DCCFBD'][i]), -w * .33 + i * w * .22, -.15, 0);
  }
  if (style === 'palermoTufa' || style === 'sicilianCoast') {
    // A striped canvas awning on iron arms over the doorway, which is how a Palermo front keeps its shade.
    for (const x of [-w / 4 - .5, -w / 4 + .5]) add(g, block(.05, 1.0, .05, IRON), x, .5, f + .78);
    const awn = add(g, block(1.2, .05, .95, '#EFE6D6'), -w / 4, 1.58, f + .44); awn.rotation.x = .12;
    for (let i = 0; i < 5; i++) add(awn, block(.12, .03, .95, i % 2 ? ITP.venetianRed : '#EFE6D6'), -.48 + i * .24, .03, 0);
  }
  if (style === 'casale' || style === 'terraferma') {
    // An open loggia or barchessa on posts along the front, where the work is done out of the sun.
    for (const x of [-w / 2 + .3, 0, w / 2 - .3]) add(g, block(.16, H * .78, .16, ITP.travertine), x, H * .39, f + .72);
    const roof = add(g, block(w + .3, .08, 1.0, ITP.terracotta), 0, H * .78 + .06, f + .4); roof.rotation.x = .12;
  }
  if (style === 'buranoCottage') for (let i = 0; i < Math.max(2, Math.floor(w / .8)); i++) add(g, block(.06, H, .06, ITP.istrianStone), -w / 2 + .2 + i * .8, H / 2, f + .01);

  if (style === 'romanPalazzo' || style === 'sicilianCoast' || style === 'terraferma') g.add(hipRoof(w, d, H + .02, Math.min(w, d) * .22, ITP.terracotta));
  else g.add(pantileRoof(w, d, H + .02, d * (style === 'casale' ? .30 : .24), ITP.terracotta, style === 'casale' ? .48 : .34));

  // The chimney. A Roman, a casale, a terraferma and a Sicilian kitchen all burn wood; a quay house's stack is
  // the little cowled Venetian one. The stack clears its own ridge, or the smoke is born inside the roof.
  const ridge = style === 'romanPalazzo' || style === 'sicilianCoast' || style === 'terraferma'
    ? Math.min(w, d) * .22 + .07 : d * (style === 'casale' ? .30 : .24) + .08;
  const cx = w / 3, cz = -f / 2, capY = H + .02 + ridge + .42, foot = H + .18, shaft = capY - .08 - foot;
  add(g, block(.38, shaft, .38, style === 'venetianQuay' ? ITP.venetianRed : style === 'romanPalazzo' ? ITP.romanOchre : wall), cx, foot + shaft / 2, cz);
  if (style === 'venetianQuay' || style === 'buranoCottage') {
    // The camino a campana: the stack opens out into an inverted bell, which is what a Venetian roof looks like.
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.30, .18, .30, 8), mat(ITP.venetianRed)), cx, capY - .02, cz);
    add(g, block(.40, .07, .40, ITP.istrianStone), cx, capY + .16, cz);
  } else add(g, block(.48, .08, .48, ITP.travertine), cx, capY, cz);
  const result = masonry(g) as P;
  result.userData.houseStyle = style; result.userData.storeys = storeys;
  result.userData.smoke = new THREE.Vector3(cx, capY + .26, cz);
  result.userData.smokeTint = '#b5aea3';
  return result;
}
/** The name the Stage C brief uses. One builder, two names, so neither owner has to change a call. */
export const italyHouse = italyBuilding;

/** The forno's own oven house: a squat brick barrel vault with the flue and the wood stacked against it.
 *  Kept under 2.4 tall on purpose — it stands behind the forno and must not stand in front of anything. */
export function fornoOvenHouse(): P {
  const g = new THREE.Group();
  add(g, block(3.0, 1.35, 2.2, ITP.travertine), 0, .675, 0);
  const vault = add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.3, 14, 1, false, 0, Math.PI), mat(ITP.terracotta)), 0, 1.35, 0);
  vault.rotation.z = Math.PI / 2; vault.rotation.y = Math.PI / 2;
  add(g, block(1.0, .9, .1, '#2A2420'), 0, .55, 1.11);                          // the oven mouth
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.22, .26, .95, 8), mat(ITP.romanOchre)), -1.0, 1.9, -.5);
  for (let i = 0; i < 12; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1.0, 6), mat(TIMBER)), 1.7, .12 + Math.floor(i / 4) * .16, -.7 + (i % 4) * .34).rotation.z = Math.PI / 2;
  const out = masonry(g) as P;
  out.userData.smoke = new THREE.Vector3(-1.0, 2.5, -.5); out.userData.smokeTint = '#b5aea3';
  return out;
}

/** The casale's byre: a short open cattle shed of straw over chestnut posts on a low stone wall, two stalls
 *  wide. It is kept to 2.6 by 1.6 under its roof and 2.2 tall because the Agro gives it no more: the chicken
 *  yard's and the pig-and-ox yard's approaches close in on both sides of the blueprint's spot, and a full
 *  four-stall shed there stood inside both. From the arrival camera it stands behind no stand. */
export function casaleByre(): P {
  const g = new THREE.Group();
  add(g, block(2.4, .5, 1.4, ITP.travertine), 0, .25, -.05);
  for (const x of [-1.1, 0, 1.1]) for (const z of [-.6, .6]) add(g, block(.14, 1.35, .14, TIMBER), x, 1.17, z);
  add(g, block(2.6, .09, 1.6, ITP.campagnaStraw), 0, 1.9, 0);
  const roof = add(g, block(2.6, .14, 1.0, ITP.campagnaStraw), 0, 2.02, -.25); roof.rotation.x = -.18;
  for (let i = 0; i < 3; i++) add(g, block(.62, .5, .42, '#C9BFA6'), -.8 + i * .8, .75, -.46);   // hay against the back wall
  add(g, block(2.4, .10, .10, TIMBER), 0, .72, .66);                                             // the rail the cows stand behind
  return masonry(g) as P;
}

/** The tonnara's sheds: two low lime-washed works buildings with the boat gear stacked between them. */
export function tonnaraShed(): P {
  const g = new THREE.Group();
  for (const [i, x] of [-1.6, 1.8].entries()) {
    add(g, block(2.6, 1.7, 2.0, ITP.istrianStone), x, .85, 0);
    const roof = pantileRoof(2.6, 2.0, 1.72, .46, ITP.terracotta, .26); roof.position.x = x; g.add(roof);
    add(g, block(.8, 1.1, .08, '#2A2420'), x, .55, 1.01);
    void i;
  }
  for (let i = 0; i < 5; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.4, 6), mat(TIMBER)), .1, .1 + i * .12, -.5 + i * .16).rotation.z = Math.PI / 2;
  for (let i = 0; i < 3; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(.34, .06, 5, 12), mat('#6E5C3C')), .2 + i * .1, .36, .9 + i * .18).rotation.y = .3;
  return masonry(g) as P;
}

/** The Pescaria's canopy: the plain iron-and-glass shelter of 1884, never the neo-Gothic stone loggia of 1907.
 *  Eight slim columns, a shallow pitched glass roof and the scale bar hanging under the ridge. */
export function ironCanopy(w = 6.4, d = 4.0): P {
  const g = new THREE.Group(), h = 2.5;
  for (const x of [-w / 2 + .3, 0, w / 2 - .3]) for (const z of [-d / 2 + .3, d / 2 - .3]) {
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, h, 8), mat(IRON)), x, h / 2, z);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .18, .12, 8), mat(IRON)), x, h - .06, z);
  }
  for (const z of [-d / 2 + .3, d / 2 - .3]) add(g, block(w, .1, .12, IRON), 0, h, z);
  for (const side of [-1, 1]) {
    const face = add(g, block(w + .5, .05, d / 2 + .3, GLASS), 0, h + .28, side * (d / 4 + .1));
    face.rotation.x = -side * .28;
    for (let i = 0; i < 7; i++) add(face, block(.05, .05, d / 2 + .3, IRON), -(w + .5) / 2 + .3 + i * (w + .5 - .6) / 6, .05, 0);
  }
  add(g, block(w + .5, .12, .14, IRON), 0, h + .58, 0);
  // The brass scale on its chain under the ridge.
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .5, 4), mat(IRON)), w / 4, h + .28, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24, .22, .05, 12), mat('#B8863B')), w / 4, h + .02, 0);
  return g as P;
}

/** A stone road bridge with a single segmental arch, a parapet and abutments on both banks. `span` is the
 *  clear water it crosses; the deck stands at BRIDGE_DECK_Y so a walker steps up onto it. */
export function stoneBridge(span = 5.0, deckWidth = 2.4, deckY = .9): P {
  const g = new THREE.Group(), len = span + 1.8;
  for (const x of [-len / 2 + .45, len / 2 - .45]) add(g, block(1.2, deckY - .16, deckWidth + .3, ITP.travertine), x, (deckY - .16) / 2, 0);
  // The arch ring: voussoirs turned about the springing line so the soffit is a real curve.
  const r = span / 2 + .2;
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI * (.08 + .84 * i / 14);
    const v = add(g, block(.42, .30, deckWidth + (i % 2 ? .20 : .24), ITP.travertine), Math.cos(a) * r, Math.max(.05, Math.sin(a) * r * .62), 0);
    v.rotation.z = a - Math.PI / 2;
  }
  add(g, block(len, .16, deckWidth, ITP.sanpietrino), 0, deckY - .08, 0);
  for (let i = 0; i < Math.round(len / .42); i++) add(g, block(.34, .05, deckWidth - .12, '#6E6A63'), -len / 2 + .21 + i * .42, deckY + .01, 0);   // the setts
  for (const z of [-deckWidth / 2 - .09, deckWidth / 2 + .09]) {
    add(g, block(len - .04, .52, .16, ITP.travertine), 0, deckY + .20, z);
    add(g, block(len - .08, .09, .24, ITP.travertine), 0, deckY + .50, z);
  }
  // The ramps that carry the lane up onto the deck, meeting the deck end instead of tucking under it.
  for (const x of [-len / 2, len / 2]) add(g, block(.9, .14, deckWidth - .06, ITP.sanpietrino), x + (x > 0 ? .45 : -.45), deckY - .10, 0).rotation.z = x > 0 ? -.18 : .18;
  return masonry(g) as P;
}

/** The valli's casone: the reed-thatched fishing lodge of the walled fish ponds, on a low brick plinth. */
export function valliCasone(): P {
  const g = new THREE.Group();
  add(g, block(3.0, .35, 2.2, ITP.venetianRed), 0, .175, 0);
  add(g, block(2.6, 1.5, 2.0, ITP.campagnaStraw), 0, 1.1, 0);
  const roof = new THREE.Group();
  for (const side of [-1, 1]) {
    const face = add(roof, block(3.2, .12, 1.9, '#B9A46A'), 0, 1.9, side * .78);
    face.rotation.x = -side * .95;
    for (let i = 0; i < 8; i++) add(face, block(.05, .05, 1.9, '#9A8850'), -1.5 + i * .42, .07, 0);
  }
  add(roof, block(3.2, .12, .14, '#8A7A4A'), 0, 2.62, 0);
  g.add(roof);
  add(g, block(.7, 1.1, .06, TIMBER), 0, .9, 1.01);
  return masonry(g) as P;
}

/** The latifondo's masseria, reduced to its tower: the square fortified tower-house a Sicilian masseria
 *  grew round, with its dovecote holes under the roof and the cart gate at its foot. The whole farm court the
 *  blueprint imagined does not fit: `pastry` and `granoIt` stand 8.2 apart, and their 6 x 5 pads leave 2.2
 *  units of ground between them, so the tower is what stands there. */
export function latifondoMasseria(): P {
  const g = new THREE.Group();
  add(g, block(1.3, 2.9, 1.3, ITP.palermoTufa), 0, 1.45, 0);
  for (let s = 1; s < 3; s++) add(g, block(1.36, .08, 1.36, ITP.travertine), 0, s * .97, 0);
  g.add(hipRoof(1.3, 1.3, 2.92, .45, ITP.terracotta, .04));
  add(g, block(.6, 1.1, .06, TIMBER), 0, .55, .66);                              // the cart gate
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .06, 10, 1, false, 0, Math.PI), mat(ITP.travertine)), 0, 1.1, .66).rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) add(g, block(.11, .15, .04, '#2A2420'), -.38 + (i % 3) * .38, 2.35 + Math.floor(i / 3) * .26, .66);   // the dovecote holes
  shutteredWindow(g, .3, 1.55, .66, SHUTTER, .24, .42);
  add(g, block(.24, .6, .24, ITP.palermoTufa), .3, 3.4, -.3);                    // the kitchen stack, above the ridge
  const out = masonry(g) as P;
  out.userData.smoke = new THREE.Vector3(.3, 3.92, -.3); out.userData.smokeTint = '#b5aea3';
  return out;
}

/** A snow pit (nivera) on Etna's flank: a round dry-stone ring roofed with broom, where the mountain's snow
 *  was packed in winter and sold through the summer. Knee-high, so it hides nothing. */
export function snowPit(): P {
  const g = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2;
    add(g, block(.44, .5, .3, i % 2 ? ITP.etnaBasalt : '#57525A'), Math.cos(a) * 1.15, .25, Math.sin(a) * 1.15).rotation.y = -a;
  }
  const cap = add(g, new THREE.Mesh(new THREE.ConeGeometry(1.35, .6, 12), mat('#9A8850')), 0, .78, 0);
  cap.rotation.y = .3;
  add(g, block(.5, .5, .1, '#2A2420'), 0, .25, 1.16);
  return masonry(g) as P;
}

/** A dry-stone lava wall, the thing that divides every field on Etna's flank. Length along local x. */
export function lavaWall(len = 4): P {
  const g = new THREE.Group();
  for (let i = 0; i < Math.round(len / .42); i++) {
    const h = .46 + (i % 3) * .07;
    add(g, block(.42, h, .34, i % 2 ? ITP.etnaBasalt : '#4E4A52'), -len / 2 + .21 + i * .42, h / 2, (i % 3 - 1) * .04);
  }
  return masonry(g) as P;
}

/** A stone sheepfold on the Agro: a low oval wall of tufa blocks with a gap for the flock. */
export function sheepfoldWall(rx = 2.6, rz = 1.9): P {
  const g = new THREE.Group();
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2;
    if (a > 1.1 && a < 1.75) continue;   // the gate the flock goes through
    add(g, block(.5, .62, .3, i % 2 ? ITP.travertine : '#CFC3A8'), Math.cos(a) * rx, .31, Math.sin(a) * rz).rotation.y = -a;
  }
  return masonry(g) as P;
}
