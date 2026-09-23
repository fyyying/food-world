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

/** The Tiber road bridge: one segmental arch of warm peperino over the river, its abutments on the two banks,
 *  low parapets, and the road laid across the top at `deckY`, with an earth ramp at each end that the lane walks
 *  up. Walkthrough 2026-09-23 read the old one as "a long white staircase wider than the river": travertine
 *  voussoirs, a sett stripe every 0.42 that read as treads, and 8.6 units of stone over 2.4 of water. This one is
 *  `span` long in stone — the arch clears 3.0, a little over the river's 2.4, and the abutments take the rest —
 *  and the ramps are graded road, not stone.
 *
 *  Three materials are kept apart on purpose: the stone body, the deck (a thin slab the movement audit reads as a
 *  deck, so a walker on it is not "in the water") and the ramps. */
export function stoneBridge(span = 5.0, deckWidth = 2.2, deckY = .9): P {
  const g = new THREE.Group(), half = span / 2, clear = 1.5, rise = .72, par = .16, W = deckWidth + par * 2;
  const STONE = '#BCA57E', RING = '#9F8A66', COPING = '#CDBB98';
  // The body: an elevation with the arch cut out of its foot, extruded across the full width.
  const elevation = (inset: number) => {
    const sh = new THREE.Shape();
    sh.moveTo(-half + inset, 0); sh.lineTo(-clear, 0);
    const r = (clear * clear + rise * rise) / (2 * rise), cy = rise - r, a0 = Math.atan2(-cy, -clear), a1 = Math.atan2(-cy, clear);
    for (let i = 1; i <= 16; i++) { const a = a0 + (a1 - a0) * i / 16; sh.lineTo(Math.cos(a) * r, cy + Math.sin(a) * r); }
    sh.lineTo(half - inset, 0); sh.lineTo(half - inset, deckY - .06); sh.lineTo(-half + inset, deckY - .06); sh.closePath();
    return sh;
  };
  const body = add(g, new THREE.Mesh(new THREE.ExtrudeGeometry(elevation(0), { depth: W, bevelEnabled: false }), mat(STONE)), 0, 0, -W / 2);
  body.castShadow = true;
  // The voussoir ring on both faces, standing a finger proud of the spandrel so the arch reads from above.
  for (const side of [-1, 1]) {
    const ring = new THREE.Shape(), r = (clear * clear + rise * rise) / (2 * rise), cy = rise - r, a0 = Math.atan2(-cy, -clear), a1 = Math.atan2(-cy, clear), R = r + .22;
    for (let i = 0; i <= 16; i++) { const a = a0 + (a1 - a0) * i / 16; const x = Math.cos(a) * r, y = cy + Math.sin(a) * r; if (i) ring.lineTo(x, y); else ring.moveTo(x, y); }
    for (let i = 16; i >= 0; i--) { const a = a0 + (a1 - a0) * i / 16; ring.lineTo(Math.cos(a) * R, Math.max(0, cy + Math.sin(a) * R)); }
    ring.closePath();
    add(g, new THREE.Mesh(new THREE.ExtrudeGeometry(ring, { depth: .05, bevelEnabled: false }), mat(RING)), 0, 0, side > 0 ? W / 2 : -W / 2 - .05);
  }
  // The deck: the road itself carried over, between the parapets.
  add(g, block(span - .04, .06, deckWidth, '#cdbb94'), 0, deckY - .03, 0);
  // Low parapets with a coping, knee-high, so the walkers on the deck show above them.
  for (const side of [-1, 1]) {
    add(g, block(span - .06, .28, par - .02, STONE), 0, deckY + .14, side * (deckWidth / 2 + par / 2));
    add(g, block(span + .04, .06, par + .06, COPING), 0, deckY + .31, side * (deckWidth / 2 + par / 2));
  }
  // The graded ramps: road-coloured earth wedges from the deck end down to the lane, 1.2 long, as the walkers'
  // own lift expects.
  for (const side of [-1, 1]) {
    const w = new THREE.Shape();
    w.moveTo(0, 0); w.lineTo(side * 1.2, 0); w.lineTo(0, deckY - .02); w.closePath();
    add(g, new THREE.Mesh(new THREE.ExtrudeGeometry(w, { depth: deckWidth - .1, bevelEnabled: false }), mat('#c9b690')), side * half, 0, -(deckWidth - .1) / 2);
  }
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

/** A dry-stone lava wall, the thing that divides every field on Etna's flank. Length along local x. Walkthrough
 *  2026-09-23 read the old one — a row of identical black boxes in two alternating tones — as black bars lying in
 *  the grass. This is a knee-high wall of rough stones: two courses of irregular, turned, differently sized
 *  blocks in three weathered lava greys, a ragged top course and a flat capstone here and there. */
export function lavaWall(len = 4): P {
  const g = new THREE.Group(), tones = ['#4F4A4C', '#615B58', '#57524F', '#6E6862'];
  const n = Math.max(4, Math.round(len / .3));
  for (let c = 0; c < 2; c++) for (let i = 0; i < n; i++) {
    const k = Math.abs(Math.sin((i + 1) * 12.9898 + c * 78.233) * 43758.5453) % 1;
    const w = .26 + k * .16, h = (c ? .16 : .2) + k * .06, d = (c ? .26 : .34) - k * .04;
    const x = -len / 2 + (i + .5 + (c ? .5 : 0)) * len / n;
    if (x > len / 2 - .1) continue;
    if (c && k > .8) continue;                                    // a gap in the top course
    const stone = add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(.5, 0), mat(tones[(i + c * 2) % 4])), x, c ? .26 + h / 2 : h / 2, (k - .5) * .06);
    stone.scale.set(w, h, d); stone.rotation.set(k * .6, k * 2.1, (k - .5) * .3);
  }
  for (let i = 0; i < Math.floor(len / 1.1); i++) {
    const cap = add(g, block(.44, .06, .30, '#6E6862'), -len / 2 + .6 + i * 1.1, .44, 0); cap.rotation.y = (i % 2 - .5) * .3;
  }
  return masonry(g) as P;
}

/** A stone sheepfold on the Agro: a rectangular pen of dry-stone walls, knee-high, with a hurdle gate of split
 *  chestnut in the middle of the front wall and a strip of straw along the back wall. Walkthrough 2026-09-23 read
 *  the old oval of standing blocks as a stone circle from above; a fold is a walled rectangle with a gate. `w` is
 *  the length along local x, `d` the depth; the gate faces +z. */
export function sheepfoldWall(w = 3.6, d = 2.6): P {
  const g = new THREE.Group(), tones = ['#CFC3A8', '#BDB195', '#D9CDB2'];
  const wall = (x0: number, z0: number, x1: number, z1: number, seed: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(3, Math.round(len / .34)), a = Math.atan2(-(z1 - z0), x1 - x0);
    for (let c = 0; c < 2; c++) for (let i = 0; i < n; i++) {
      const k = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 7.1 + c * 78.233) * 43758.5453) % 1;
      const t = (i + .5 + (c ? .4 : 0)) / n; if (t > 1) continue;
      const s = add(g, block(.30 + k * .1, c ? .2 : .24, .26, tones[(i + c) % 3]), x0 + (x1 - x0) * t, c ? .34 : .12, z0 + (z1 - z0) * t);
      s.rotation.y = a + (k - .5) * .25;
    }
  };
  const X = w / 2, Z = d / 2, gate = .55;
  wall(-X, -Z, X, -Z, 1); wall(X, -Z, X, Z, 2); wall(-X, -Z, -X, Z, 3);
  wall(-X, Z, -gate, Z, 4); wall(gate, Z, X, Z, 5);
  // The hurdle gate: two posts and three split rails, closed.
  for (const x of [-gate, gate]) add(g, block(.08, .62, .08, TIMBER), x, .31, Z);
  for (let i = 0; i < 3; i++) add(g, block(gate * 2 - .08, .05, .04, '#8A6D44'), 0, .16 + i * .16, Z);
  add(g, block(w - .4, .03, .5, '#D9C58A'), 0, .015, -Z + .35);            // the straw bedding along the back wall
  return masonry(g) as P;
}

/** The piazza fountain: a round travertine basin with a raised tazza on a baluster, a jet that breathes, four
 *  sheets falling from the tazza's lip into the basin, droplets thrown off the jet, and rings that widen on the
 *  basin where the water lands — the way Spain's three fountains run. Walkthrough 2026-09-23: the old one was
 *  placed through a scaled holder and its tick was never called, so it never moved. This one is built at its own
 *  size and publishes its own tick, which `place()` registers. */
export function piazzaFountain(): P {
  const g = new THREE.Group(), stone = ITP.travertine, WATER = '#BFE3EA';
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, .40, 18), mat(stone)), 0, .20, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, .08, 18), mat('#D5C7AA')), 0, .44, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .24, .95, 10), mat(stone)), 0, .82, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.55, .22, .20, 14), mat(stone)), 0, 1.36, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, .22, 8), mat(stone)), 0, 1.55, 0);
  const out = masonry(g) as P;
  const water = (o = .55) => mat(WATER, { transparent: true, opacity: o, depthWrite: false });
  const pool = add(out, new THREE.Mesh(new THREE.CylinderGeometry(1.16, 1.16, .06, 18), mat('#6FB6C4', { roughness: .25 })), 0, .38, 0);
  add(out, new THREE.Mesh(new THREE.CylinderGeometry(.48, .48, .03, 14), mat('#6FB6C4', { roughness: .25 })), 0, 1.47, 0);
  const jet = add(out, new THREE.Mesh(new THREE.CylinderGeometry(.03, .05, .5, 6), water(.6)), 0, 1.9, 0);
  const sheets = [0, 1, 2, 3].map(i => {
    const a = i * Math.PI / 2 + Math.PI / 4;
    return add(out, new THREE.Mesh(new THREE.CylinderGeometry(.05, .09, 1.02, 6, 1, true), water(.5)), Math.cos(a) * .56, .93, Math.sin(a) * .56);
  });
  const ripples = [0, 1, 2, 3].map(i => {
    const a = i * Math.PI / 2 + Math.PI / 4;
    const r = add(out, new THREE.Mesh(new THREE.RingGeometry(.10, .16, 16), water(.5)), Math.cos(a) * .58, .42, Math.sin(a) * .58);
    r.rotation.x = -Math.PI / 2; return r;
  });
  const drops = Array.from({ length: 6 }, () => add(out, new THREE.Mesh(new THREE.SphereGeometry(.04, 5, 4), water(.75)), 0, 2, 0));
  out.userData.tick = (t: number) => {
    const p = .85 + Math.sin(t * 2.3) * .15;
    jet.scale.set(1, p, 1); jet.position.y = 1.66 + .25 * p;
    sheets.forEach((s, i) => { const k = .88 + Math.sin(t * 3.1 + i * 1.7) * .12; s.scale.set(k, 1, k); });
    pool.scale.set(1 + Math.sin(t * 1.7) * .006, 1, 1 + Math.cos(t * 1.9) * .006);
    ripples.forEach((r, i) => { const u = (t * .8 + i * .25) % 1; r.scale.setScalar(.6 + u * 2.4); (r.material as THREE.MeshStandardMaterial).opacity = .5 * (1 - u); });
    drops.forEach((d, i) => {
      const u = (t * .85 + i / 6) % 1, a = i * 1.047 + t * .15, reach = .08 + u * .5;
      d.position.set(Math.cos(a) * reach, 2.15 + u * .3 - u * u * .78, Math.sin(a) * reach);
      (d.material as THREE.MeshStandardMaterial).opacity = .75 * (1 - u * u);
    });
  };
  return out;
}

/** The Trevi: a palazzo front with a central triumphal arch, Oceanus in the niche, a rock reef (the scogliera)
 *  spilling across the whole width, water falling over the rocks in three cascades, and a wide basin in front
 *  that ripples where they land. Walkthrough 2026-09-23 read the old one, at 0.4 of the Stand maker's
 *  ten-wide build, as "a white wall and a pool at the end of an alley", and it never moved. This one is built
 *  at this table's scale (5.4 wide, 2.7 tall at the attic, 4.0 deep with the basin), faces +z and runs. */
export function treviFountainIt(): P {
  const g = new THREE.Group(), stone = '#E6DAC0', dark = '#CDBFA2', W = 5.4;
  // The palazzo front, with pilasters, a cornice, the attic and a row of windows either side of the arch.
  add(g, block(W, 2.1, .7, stone), 0, 1.05, -1.6);
  add(g, block(W + .2, .16, .82, dark), 0, 2.18, -1.6);
  add(g, block(2.0, .5, .6, stone), 0, 2.5, -1.55);                       // the attic over the arch
  add(g, block(2.2, .1, .7, dark), 0, 2.78, -1.55);
  for (const x of [-2.5, -1.85, -.7, .7, 1.85, 2.5]) add(g, block(.16, 2.0, .12, dark), x, 1.0, -1.2);
  for (const x of [-2.2, -1.5, 1.5, 2.2]) for (const y of [1.0, 1.65]) add(g, block(.3, .38, .04, '#6F6452'), x, y, -1.235);
  // The arch and the niche, with Oceanus and his shell chariot.
  add(g, block(1.1, 1.5, .1, '#A99A7E'), 0, .95, -1.22);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .1, 12, 1, false, 0, Math.PI), mat('#A99A7E')), 0, 1.7, -1.22).rotation.x = Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, .7, 8), mat('#F2EADA')), 0, 1.15, -1.0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(.13, 8, 6), mat('#F2EADA')), 0, 1.6, -1.0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(.34, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat('#F2EADA')), 0, .62, -.85).scale.set(1.2, .5, .8);
  for (const x of [-1.2, 1.2]) {                                                            // Abundance and Health in their niches
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.1, .14, .55, 8), mat('#F2EADA')), x, 1.25, -1.15);
    add(g, new THREE.Mesh(new THREE.SphereGeometry(.09, 7, 5), mat('#F2EADA')), x, 1.6, -1.15);
  }
  // The scogliera: rough travertine rocks piled across the whole front, lower toward the ends.
  for (let i = 0; i < 17; i++) {
    const k = Math.abs(Math.sin((i + 3) * 12.9898) * 43758.5453) % 1, x = -2.4 + i * .3;
    const h = .45 + (1 - Math.abs(x) / 2.6) * .45 + k * .15;
    const rock = add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(.3 + k * .12, 0), mat(i % 3 ? '#D8CCB0' : '#C4B696')), x, h * .5, -.95 + k * .35);
    rock.scale.set(1.1, h * 1.6, 1); rock.rotation.set(k, k * 3, 0);
  }
  // The basin: a low curved rim, the steps down to it at the front, and the water.
  add(g, block(W + .6, .12, 3.0, '#D9CDB2'), 0, .06, .1);
  add(g, block(W + .6, .32, .18, stone), 0, .16, 1.55);
  for (const x of [-(W + .6) / 2, (W + .6) / 2]) add(g, block(.18, .32, 2.6, stone), x, .16, .3);
  add(g, block(W + 1.0, .06, .5, '#D9CDB2'), 0, .03, 1.95);
  const out = masonry(g) as P;
  const water = (o = .55) => mat('#BFE3EA', { transparent: true, opacity: o, depthWrite: false });
  const pool = add(out, new THREE.Mesh(new THREE.BoxGeometry(W + .2, .04, 2.3), mat('#6FB6C4', { roughness: .22 })), 0, .24, .35);
  // Three cascades over the rocks, each a column of thin sheets whose lengths breathe out of phase.
  const falls = [-1.3, 0, 1.3].map((x, i) => Array.from({ length: 3 }, (_, k) => {
    const s = add(out, new THREE.Mesh(new THREE.PlaneGeometry(.36 - k * .04, .55), water(.62 - k * .1)), x + (k - 1) * .12, .72 - k * .18, -.55 + k * .28);
    s.rotation.x = -.5 - k * .25; s.userData.base = s.position.y; s.userData.i = i * 3 + k; return s;
  })).flat();
  const ripples = [-1.3, 0, 1.3].flatMap(x => [0, 1].map(k => {
    const r = add(out, new THREE.Mesh(new THREE.RingGeometry(.12, .2, 18), water(.5)), x, .27, .15 + k * .05);
    r.rotation.x = -Math.PI / 2; r.userData.k = k; return r;
  }));
  const drops = Array.from({ length: 8 }, () => add(out, new THREE.Mesh(new THREE.SphereGeometry(.04, 5, 4), water(.7)), 0, .5, 0));
  out.userData.tick = (t: number) => {
    falls.forEach(s => { const i = s.userData.i as number; s.scale.y = .85 + Math.sin(t * 4.1 + i * .9) * .15; s.position.y = (s.userData.base as number) + Math.sin(t * 5.3 + i) * .015; });
    pool.scale.set(1, 1, 1 + Math.sin(t * 1.3) * .004);
    ripples.forEach((r, i) => { const u = (t * .7 + (r.userData.k as number) * .5 + i * .13) % 1; r.scale.setScalar(.7 + u * 3.2); (r.material as THREE.MeshStandardMaterial).opacity = .5 * (1 - u); });
    drops.forEach((d, i) => {
      const u = (t * .9 + i / 8) % 1, x = [-1.3, 0, 1.3][i % 3] + (i % 2 ? .2 : -.2) * u;
      d.position.set(x, .75 - u * u * .5, -.35 + u * .55);
      (d.material as THREE.MeshStandardMaterial).opacity = .7 * (1 - u);
    });
  };
  return out;
}

/** One of the two granite columns of the Piazzetta, with its capital and the figure on top. */
export function piazzettaColumn(lion = true): P {
  const g = new THREE.Group();
  add(g, block(.8, .3, .8, ITP.istrianStone), 0, .15, 0);
  add(g, block(.6, .25, .6, '#D9D2C0'), 0, .42, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.17, .21, 2.1, 12), mat('#9A9A9E')), 0, 1.6, 0);
  add(g, block(.46, .2, .46, ITP.istrianStone), 0, 2.75, 0);
  if (lion) {                                                                       // the winged lion of St Mark
    add(g, block(.46, .2, .2, '#6E6A55'), 0, 2.95, 0);
    add(g, block(.15, .18, .18, '#6E6A55'), .22, 3.12, 0);
    for (const z of [-.12, .12]) add(g, block(.28, .04, .15, '#6E6A55'), -.05, 3.13, z).rotation.x = z > 0 ? -.5 : .5;
  } else {                                                                          // St Theodore on his crocodile
    add(g, block(.42, .09, .17, '#7A8A6A'), 0, 2.9, 0);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .36, 8), mat('#EDE6D6')), 0, 3.12, 0);
    add(g, new THREE.Mesh(new THREE.SphereGeometry(.065, 7, 5), mat('#EDE6D6')), 0, 3.35, 0);
  }
  return masonry(g) as P;
}

/** A Venetian well-head (vera da pozzo) on its stepped base, with the iron frame and the bucket. */
export function wellHead(): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.7, .75, .1, 12), mat('#D9D2C0')), 0, .05, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.46, .5, .62, 12), mat(ITP.istrianStone)), 0, .41, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .06, 12), mat('#CFC6B1')), 0, .75, 0);
  for (const x of [-.36, .36]) add(g, block(.04, .7, .04, IRON), x, 1.1, 0);
  add(g, block(.76, .04, .04, IRON), 0, 1.45, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09, .07, .16, 8), mat('#7A5232')), .1, .88, 0);
  return masonry(g) as P;
}

/** A plain Istrian-stone bench on two blocks, for the quay. */
export function stoneBench(len = 1.6): P {
  const g = new THREE.Group();
  add(g, block(len, .08, .38, ITP.istrianStone), 0, .42, 0);
  for (const x of [-len / 2 + .2, len / 2 - .2]) add(g, block(.18, .38, .32, '#D9D2C0'), x, .19, 0);
  return masonry(g) as P;
}
