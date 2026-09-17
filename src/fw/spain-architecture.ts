/** Spanish building vocabulary: lime wash and curved tile in the south and east, brick over granite in the centre,
 *  dark timber over stone in the north, bare granite and slate in Galicia. Pure builders, no positions. */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, arch, masonry } from './turkey-architecture';

/** The twelve palette names from docs/spain-research.md section 1.3. */
export const SP = {
  calBlanca: '#F3EDE2', piedraDorada: '#D8C49A', granitoGalego: '#8E9299', tejaArabe: '#B4572F',
  pizarraNorte: '#4A4F55', almagre: '#A4432B', maderaCastano: '#5A3B27', azulTalavera: '#2E5C8A',
  albero: '#E0B45F', tierraManchega: '#C2A473', verdeOliva: '#6E7A4E', aguaCosta: '#2E7A96',
};
const IRON = '#2f3238', GLASS = '#a9c4c9', BRICK = '#a0523d', THATCH = '#c9a961', TILE_SEAM = '#9a4526';

export type SpainStyle = 'andalus' | 'castile' | 'mancha' | 'catalan' | 'basque' | 'galician' | 'valencian';

/** Two sloping faces on a ridge beam. Curved tile gets seams along the slope; slate gets none. */
export function gableRoof(w: number, d: number, y: number, rise: number, color: string, overhang = .35, seams = true, ridgeAlongX = true): THREE.Group {
  // Built with the ridge along local x; the whole group turns when the ridge should run along z.
  const g = new THREE.Group();
  const span = (ridgeAlongX ? d : w) / 2 + overhang, length = (ridgeAlongX ? w : d) + overhang * 2;
  const slope = Math.hypot(span, rise), angle = Math.atan2(rise, span);
  for (const side of [-1, 1]) {
    const face = add(g, block(length, .11, slope, color), 0, y + rise / 2, side * span / 2);
    face.rotation.x = -side * angle;
    if (seams) for (let i = 0; i < Math.floor(length / .42); i++) add(face, block(.05, .05, slope, TILE_SEAM), -length / 2 + .21 + i * .42, .07, 0);
  }
  add(g, block(length, .12, .16, seams ? '#8f4022' : '#3c4046'), 0, y + rise + .03, 0);
  if (!ridgeAlongX) g.rotation.y = Math.PI / 2;
  return g;
}

/** A hip roof of the Madrid kind: four slate faces on a short ridge, granite eaves. */
export function slateHip(w: number, d: number, y: number, color = SP.pizarraNorte): THREE.Group {
  const g = new THREE.Group(), h = Math.min(w, d) * .28, rx = w * .22;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-w / 2, y, -d / 2, w / 2, y, -d / 2, w / 2, y, d / 2, -w / 2, y, d / 2, -rx, y + h, 0, rx, y + h, 0], 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0]); geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, mat(color)));
  for (const z of [-d / 2, d / 2]) add(g, block(w, .10, .12, SP.granitoGalego), 0, y - .02, z);
  for (const x of [-w / 2, w / 2]) add(g, block(.12, .10, d, SP.granitoGalego), x, y - .02, 0);
  add(g, block(rx * 2 + .1, .09, .12, '#3c4046'), 0, y + h + .02, 0);
  return g;
}

function ironBalcony(g: THREE.Group, x: number, y: number, z: number, w = .9) {
  add(g, block(w, .05, .34, SP.granitoGalego), x, y, z + .17);
  for (let i = 0; i <= Math.round(w / .12); i++) add(g, block(.02, .42, .02, IRON), x - w / 2 + i * (w / Math.round(w / .12)), y + .22, z + .33);
  add(g, block(w, .025, .025, IRON), x, y + .44, z + .33);
}
function shutteredWindow(g: THREE.Group, x: number, y: number, z: number, color: string, w = .5, h = .7) {
  add(g, block(w, h, .05, '#5f6d72'), x, y, z);
  for (const side of [-1, 1]) add(g, block(w * .42, h, .04, color), x + side * (w / 2 + w * .21), y, z + .01);
}
function door(g: THREE.Group, x: number, z: number, color: string, w = .8, h = 1.5) {
  add(g, block(w, h, .06, color), x, h / 2, z);
  add(g, block(.06, h, .06, '#3b2a1e'), x - w / 2 - .03, h / 2, z); add(g, block(.06, h, .06, '#3b2a1e'), x + w / 2 + .03, h / 2, z);
}
function geraniums(g: THREE.Group, x: number, y: number, z: number, n = 3) {
  for (let k = 0; k < n; k++) {
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.07, .06, .12, 7), mat(SP.azulTalavera)), x + (k - (n - 1) / 2) * .26, y + .06, z);
    add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.10, 0), mat(k % 2 ? '#c8383a' : '#e0637a')), x + (k - (n - 1) / 2) * .26, y + .18, z);
  }
}

/** One house in one of seven regional styles. The origin is the footprint centre, the front faces +z. */
export function spainHouse(style: SpainStyle, w = 3, d = 2.4, h = 2.2, opts: { storeys?: number } = {}): P {
  const g = new THREE.Group();
  const storeys = style === 'mancha' ? 1 : opts.storeys ?? (style === 'castile' ? 3 : 2), H = h * storeys, f = d / 2;
  const wall = style === 'castile' ? BRICK : style === 'catalan' ? '#e4cfa8' : style === 'galician' ? SP.granitoGalego : style === 'basque' ? SP.calBlanca : SP.calBlanca;
  const trim = style === 'mancha' ? SP.azulTalavera : style === 'basque' ? SP.almagre : style === 'valencian' ? '#4d6b56' : style === 'galician' ? '#f1ece0' : SP.maderaCastano;
  if (style === 'basque') {
    add(g, block(w, h, d, SP.granitoGalego), 0, h / 2, 0);
    add(g, block(w, H - h, d, wall), 0, h + (H - h) / 2, 0);
    // The dark frame reads as posts and rails on the pale infill.
    for (const z of [f, -f]) for (let i = 0; i <= 4; i++) add(g, block(.09, H - h, .07, trim), -w / 2 + i * w / 4, h + (H - h) / 2, z);
    for (const x of [-w / 2, w / 2]) for (let i = 0; i <= 3; i++) add(g, block(.07, H - h, .09, trim), x, h + (H - h) / 2, -f + i * d / 3);
    for (const y of [h, h + (H - h) / 2, H]) { for (const z of [f, -f]) add(g, block(w + .04, .08, .07, trim), 0, y, z); for (const x of [-w / 2, w / 2]) add(g, block(.07, .08, d + .04, trim), x, y, 0); }
  } else if (style === 'castile') {
    add(g, block(w, .9, d, SP.granitoGalego), 0, .45, 0);
    add(g, block(w, H - .9, d, wall), 0, .9 + (H - .9) / 2, 0);
    for (let s = 1; s < storeys; s++) add(g, block(w + .06, .09, d + .06, SP.piedraDorada), 0, s * h, 0);
  } else if (style === 'galician') {
    add(g, block(w, H, d, wall), 0, H / 2, 0);
    for (const y of [h, H]) add(g, block(w + .08, .09, d + .08, '#767a80'), 0, y - .04, 0);
  } else {
    add(g, block(w, H, d, wall), 0, H / 2, 0);
    if (style === 'mancha') add(g, block(w + .04, .55, d + .04, SP.piedraDorada), 0, .275, 0);
  }
  // Doors, windows, balconies and skirting per storey.
  door(g, -w / 4, f + .01, style === 'galician' ? SP.maderaCastano : trim);
  for (let s = 0; s < storeys; s++) {
    const y = s * h + (s ? h * .55 : h * .62);
    if (style === 'galician' && s > 0) {
      // A glazed wooden gallery hangs across the upper front against the rain.
      add(g, block(w * .82, h * .62, .32, '#f1ece0'), 0, y, f + .16);
      for (let i = 0; i < 6; i++) add(g, block(w * .82 / 6 - .06, h * .44, .03, GLASS), -w * .41 + (i + .5) * w * .82 / 6, y + .02, f + .33);
      add(g, block(w * .82, .06, .34, '#767a80'), 0, y - h * .31, f + .16);
      continue;
    }
    if (s === 0) shutteredWindow(g, w / 4, y, f + .01, trim);
    else {
      for (const x of style === 'castile' ? [-w / 4, w / 4] : [w / 4]) { shutteredWindow(g, x, y, f + .01, trim, .5, .8); if (style !== 'mancha' && style !== 'basque') ironBalcony(g, x, y - .4, f); }
      if (style === 'andalus') geraniums(g, w / 4, y + .04, f + .36);
    }
  }
  if (style === 'andalus' || style === 'valencian') for (let i = 0; i < Math.floor(w / .36); i++) add(g, block(.3, .3, .03, i % 2 ? SP.azulTalavera : '#e6ebef'), -w / 2 + .18 + i * .36, .2, f + .02);
  if (style === 'andalus') { add(g, block(.9, .06, .06, IRON), -w / 4, 1.62, f + .04); geraniums(g, w / 4 + .1, .02, f + .3, 2); }
  if (style === 'valencian') {
    // A reed shade (canyis) on poles keeps the sun off the doorway.
    for (const x of [-w / 4 - .55, -w / 4 + .55]) add(g, block(.05, 1.75, .05, SP.maderaCastano), x, .875, f + .95);
    const shade = add(g, block(1.3, .05, 1.05, THATCH), -w / 4, 1.78, f + .5); shade.rotation.x = .08;
    for (let i = 0; i < 9; i++) add(shade, block(.03, .02, 1.05, '#a8894a'), -.6 + i * .15, .035, 0);
  }
  if (style === 'mancha') { add(g, block(.5, .4, .05, '#2b241d'), w / 4, H - .35, f + .01); add(g, block(.55, .05, .16, trim), w / 4, H - .15, f + .06); }   // the straw-loft opening
  if (style === 'catalan') {
    // A roof terrace behind a low parapet, the way the flat tiled roofs are used.
    add(g, block(w + .1, .35, .12, wall), 0, H + .17, f - .06); add(g, block(w + .1, .35, .12, wall), 0, H + .17, -f + .06);
    for (const x of [-w / 2 + .06, w / 2 - .06]) add(g, block(.12, .35, d, wall), x, H + .17, 0);
    add(g, block(w - .3, .05, d - .3, SP.tejaArabe), 0, H + .03, 0);
    add(g, block(.6, .5, .6, wall), w / 2 - .6, H + .55, -f + .5); add(g, block(.7, .05, .7, SP.tejaArabe), w / 2 - .6, H + .82, -f + .5);   // stair head
    for (let i = 0; i < 5; i++) add(g, block(.16, .16, .03, i % 2 ? SP.azulTalavera : '#d9a54a'), -w / 2 + .5 + i * .5, H + .2, f + .01);   // trencadis on the parapet
  } else if (style === 'castile') g.add(slateHip(w + .3, d + .3, H + .02));
  else if (style === 'basque') g.add(gableRoof(w, d, H + .02, d * .30, SP.tejaArabe, .6));
  else if (style === 'galician') g.add(gableRoof(w, d, H + .02, d * .42, SP.pizarraNorte, .25, false));
  else g.add(gableRoof(w, d, H + .02, d * .24, SP.tejaArabe, .3));
  if (style === 'basque') for (const x of [-w / 2 + .3, w / 2 - .3]) add(g, block(.14, h, .14, trim), x, h / 2, f + .5);   // porch posts under the deep eave
  // A kitchen chimney where the style has one: brick in Castile, granite in Galicia, lime wash over the
  // Andalusian, Manchegan and Basque hearths. Its top is published as userData.smoke so the world assembler
  // hangs a thread of smoke on it, the way props.ts does for the Chinese houses.
  const CHIMNEY: Partial<Record<SpainStyle, [string, string]>> = {
    castile: [BRICK, SP.pizarraNorte], galician: [SP.granitoGalego, SP.pizarraNorte],
    andalus: [SP.calBlanca, SP.tejaArabe], mancha: [SP.calBlanca, SP.tejaArabe], basque: [SP.calBlanca, SP.tejaArabe],
  };
  const stack = CHIMNEY[style];
  let smoke: THREE.Vector3 | undefined;
  if (stack) {
    const cx = w / 3, cz = -f / 2;
    // The stack has to clear its own ridge, or the smoke starts inside the roof and is never seen: the Galician
    // slate gable rises d * .42 above the wall head, well past the fixed .9 stack this used to build.
    const ridge = style === 'castile' ? Math.min(w + .3, d + .3) * .28 + .085
      : style === 'galician' ? d * .42 + .09
      : style === 'basque' ? d * .30 + .09 : d * .24 + .09;
    const capY = H + .02 + ridge + .40, foot = H + .2, shaft = capY - .06 - foot;
    add(g, block(.4, shaft, .4, stack[0]), cx, foot + shaft / 2, cz);
    add(g, block(.5, .08, .5, stack[1]), cx, capY, cz);
    smoke = new THREE.Vector3(cx, capY + .22, cz);
  }
  const result = masonry(g) as P; result.userData.houseStyle = style; result.userData.storeys = storeys;
  // The tint is the only thing that separates a chimney from a cooking stand: same sprite size, count and
  // opacity, a wood-smoke grey-white instead of pure white, so the column reads at the overview zoom.
  if (smoke) { result.userData.smoke = smoke; result.userData.smokeTint = '#b5aea3'; }
  return result;
}

/** Granite piers and round arches with a timber beam above; iron lanterns hang under the beam at alternate bays.
 *  Origin at the footprint centre, depth 1.6, open towards +z and -z. */
export function arcade(bays = 4, w = 8): P {
  const g = new THREE.Group(), bay = w / bays, leg = 1.75, depth = 1.6;
  for (let i = 0; i < bays; i++) {
    const x = -w / 2 + bay * (i + .5);
    // The ring sits back from the pier face, so no two upward or outward faces share a plane.
    const ring = arch(bay - .5, leg, .3, SP.granitoGalego); ring.position.set(x, 0, depth / 2 - .35); g.add(ring);
  }
  for (let i = 0; i <= bays; i++) add(g, block(.28, leg + .2, depth, SP.granitoGalego), -w / 2 + bay * i, (leg + .2) / 2, 0);
  add(g, block(w + .28, .22, depth + .1, SP.maderaCastano), 0, leg + .9, 0);
  // The cornice is narrower than the beam, so their outer faces never share a plane.
  add(g, block(w + .16, .14, depth + .3, SP.piedraDorada), 0, leg + 1.08, 0);
  const stone = masonry(g) as P;
  for (let i = 0; i < bays; i += 2) {
    const x = -w / 2 + bay * (i + .5);
    add(stone, block(.02, .22, .02, IRON), x, leg + .68, 0);
    const lamp = add(stone, block(.16, .22, .16, IRON), x, leg + .46, 0);
    add(lamp, new THREE.Mesh(new THREE.BoxGeometry(.12, .16, .12), mat('#e9c877', { emissive: '#8a5a1c', emissiveIntensity: .45 })), 0, 0, 0);
  }
  stone.userData.bays = bays;
  return stone;
}

/** A cast-iron market hall of the 1876 to 1889 kind: iron columns, brick base walls, a glazed roof with a clerestory. */
export function ironMarketHall(): P {
  const g = new THREE.Group(), w = 5.6, d = 4.6;
  for (const x of [-w / 2, w / 2]) add(g, block(.22, .7, d, BRICK), x, .35, 0);
  add(g, block(w, .7, .22, BRICK), 0, .35, -d / 2);
  for (const x of [-w / 2, -w / 6, w / 6, w / 2]) for (const z of [-d / 2, d / 2]) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 3.2, 8), mat(IRON)), x, 1.6, z);
  for (const z of [-d / 2, d / 2]) add(g, block(w + .2, .12, .14, IRON), 0, 3.2, z);
  for (const x of [-w / 2, w / 2]) add(g, block(.14, .12, d, IRON), x, 3.2, 0);
  const rise = 1.1;
  for (const side of [-1, 1]) {
    const slope = Math.hypot(d / 2 + .3, rise), face = add(g, new THREE.Mesh(new THREE.BoxGeometry(w + .4, .06, slope), mat(GLASS, { transparent: true, opacity: .55 })), 0, 3.25 + rise / 2, side * (d / 2 + .3) / 2);
    face.rotation.x = -side * Math.atan2(rise, d / 2 + .3);
    for (let i = 0; i < 8; i++) add(face, block(.05, .07, slope, IRON), -w / 2 - .2 + (i + .5) * (w + .4) / 8, .03, 0);
  }
  add(g, block(w + .4, .12, .16, IRON), 0, 3.25 + rise + .04, 0);
  // The clerestory: a raised lantern with its own small roof lets the heat out.
  add(g, block(w * .5, .5, 1.2, IRON), 0, 3.25 + rise + .3, 0);
  for (let i = 0; i < 6; i++) add(g, block(w * .5 / 6 - .05, .32, .04, GLASS), -w * .25 + (i + .5) * w * .5 / 6, 3.25 + rise + .3, .62);
  add(g, block(w * .5 + .3, .08, 1.5, SP.pizarraNorte), 0, 3.25 + rise + .58, 0);
  for (let i = 0; i < 5; i++) add(g, block(.03, .9, .03, IRON), -w / 2 + .3 + i * (w - .6) / 4, 2.75, d / 2 + .02);   // spandrel tracery on the entrance side
  return masonry(g) as P;
}

// The Albufera field house, `barraca()`, was removed on 2026-09-17: the town's own was taken out on the
// owner's word the day before and the rice fire's was the "strange red bar house in front of the rice fire".
// Nothing places one any more, so the builder went with it. The module contract in docs/spain-world.md records
// the change.

/** A Galician granary on staddle stones: a slatted chamber on granite feet, slate roof, cross on the gable.
 *  The chamber door is a separate group under userData.door so a stand can swing it open. */
export function horreo(): P {
  const g = new THREE.Group(), w = 2.4, d = 1.2, lift = .85;
  const stone = new THREE.Group();
  for (const x of [-w / 2 + .2, 0, w / 2 - .2]) for (const z of [-d / 2 + .15, d / 2 - .15]) {
    add(stone, block(.22, lift - .1, .22, SP.granitoGalego), x, (lift - .1) / 2, z);
    add(stone, new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .1, 10), mat('#7b7f86')), x, lift - .05, z);
  }
  add(stone, block(w, .12, d, SP.granitoGalego), 0, lift + .06, 0);
  add(stone, block(w, .95, .12, SP.maderaCastano), 0, lift + .6, -d / 2); add(stone, block(.12, .95, d, SP.granitoGalego), -w / 2, lift + .6, 0); add(stone, block(.12, .95, d, SP.granitoGalego), w / 2, lift + .6, 0);
  for (let i = 0; i < 9; i++) add(stone, block(.06, .95, .04, SP.maderaCastano), -w / 2 + .25 + i * (w - .5) / 8, lift + .6, d / 2);
  for (const y of [lift + .3, lift + .9]) add(stone, block(w, .05, .05, SP.maderaCastano), 0, y, d / 2 + .02);
  add(stone, block(w, .06, d, SP.maderaCastano), 0, lift + 1.1, 0);
  stone.add(gableRoof(w, d, lift + 1.12, .5, SP.pizarraNorte, .2, false));
  add(stone, block(.05, .34, .05, SP.granitoGalego), w / 2 + .15, lift + 1.75, 0); add(stone, block(.05, .05, .2, SP.granitoGalego), w / 2 + .15, lift + 1.85, 0);
  const merged = masonry(stone) as P; g.add(merged);
  const door = new THREE.Group(); door.position.set(w / 2 - .25, lift + .12, d / 2 + .04); g.add(door);
  add(door, block(.4, .85, .04, '#4a3020'), -.2, .48, 0);
  for (let i = 0; i < 5; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .22, 6), mat('#e2c052')), -.6 + i * .3, lift + .25, -.1).rotation.z = Math.PI / 2;   // maize cobs inside
  g.userData.door = door;
  return g as P;
}

/** A La Mancha windmill body: white cylinder, conical roof, four lattice sails under userData.sails for the stand to turn. */
export function manchaWindmillBody(): P {
  const g = new THREE.Group(), r = 1.1, h = 3.0;
  const stone = new THREE.Group();
  add(stone, new THREE.Mesh(new THREE.CylinderGeometry(r * .92, r, h, 14), mat(SP.calBlanca)), 0, h / 2, 0);
  add(stone, new THREE.Mesh(new THREE.ConeGeometry(r * 1.05, 1.15, 14), mat('#4a4f55')), 0, h + .55, 0);
  add(stone, block(.5, .9, .1, SP.maderaCastano), 0, .5, r - .02);
  add(stone, block(.34, .34, .1, '#35302b'), .3, h - .55, r * .9);
  g.add(masonry(stone));
  const sails = new THREE.Group(); sails.position.set(0, h - .15, r + .35); g.add(sails);
  add(sails, new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .7, 8), mat(SP.maderaCastano)), 0, 0, -.2).rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Group(); arm.rotation.z = i * Math.PI / 2; sails.add(arm);
    add(arm, block(.08, 2.3, .06, SP.maderaCastano), 0, 1.25, 0);
    for (let k = 0; k < 6; k++) add(arm, block(.5, .03, .03, '#8a6a48'), .25, .5 + k * .3, .02);
    for (let k = 0; k < 2; k++) add(arm, block(.025, 1.65, .025, '#8a6a48'), .12 + k * .26, 1.3, .02);
  }
  g.userData.sails = sails;
  return g as P;
}

/** A sherry bodega nave: tall lime-washed walls, high shuttered clerestory windows, a broad tiled gable, an arched door. */
export function bodegaNave(): P {
  const g = new THREE.Group(), w = 5.6, d = 4.2, h = 3.6;
  add(g, block(w, h, d, SP.calBlanca), 0, h / 2, 0);
  add(g, block(w + .06, .5, d + .06, SP.albero), 0, .25, 0);
  for (const z of [d / 2 + .01, -d / 2 - .01]) for (let i = 0; i < 5; i++) shutteredWindow(g, -w / 2 + .7 + i * (w - 1.4) / 4, h - .7, z, '#4d6b56', .4, .6);
  const doorway = arch(1.4, 1.6, .14, SP.piedraDorada); doorway.position.set(0, 0, d / 2 + .02); g.add(doorway);
  add(g, block(1.4, 1.6, .05, SP.maderaCastano), 0, .8, d / 2 - .03);
  g.add(gableRoof(w, d, h + .02, d * .26, SP.tejaArabe, .4));
  for (let i = 0; i < 3; i++) add(g, block(.14, .5, .14, SP.calBlanca), -w / 2 + .9 + i * (w - 1.8) / 2, h + .25, -d / 2 + .1);   // vents on the north eave
  return masonry(g) as P;
}

/** A Basque farmstead: stone ground floor, dark red timber frame over pale infill, a broad shallow gable, a porch under the eave. */
export function baserri(): P {
  const g = new THREE.Group(), w = 4.4, d = 3.6, h = 1.6;
  add(g, block(w, h, d, SP.granitoGalego), 0, h / 2, 0);
  add(g, block(w, 1.5, d, SP.calBlanca), 0, h + .75, 0);
  for (const z of [d / 2, -d / 2]) for (let i = 0; i <= 5; i++) add(g, block(.1, 1.5, .08, SP.almagre), -w / 2 + i * w / 5, h + .75, z);
  for (let i = 0; i < 5; i++) for (const z of [d / 2 + .04, -d / 2 - .04]) { const brace = add(g, block(.06, 1.0, .05, SP.almagre), -w / 2 + (i + .5) * w / 5, h + .75, z); brace.rotation.z = i % 2 ? .6 : -.6; }
  for (const y of [h, h + 1.5]) { for (const z of [d / 2, -d / 2]) add(g, block(w + .1, .1, .1, SP.almagre), 0, y, z); for (const x of [-w / 2, w / 2]) add(g, block(.1, .1, d + .1, SP.almagre), x, y, 0); }
  // The ground floor is recessed at the front to make the covered porch.
  add(g, block(1.6, h - .05, .5, '#6c7076'), 0, (h - .05) / 2, d / 2 - .25);
  add(g, block(.8, 1.3, .06, SP.almagre), 0, .65, d / 2 + .02);
  add(g, block(1.2, .3, .06, SP.piedraDorada), 0, h - .2, d / 2 + .02);   // the carved date lintel
  for (const x of [-1.2, 1.2]) shutteredWindow(g, x, h + .8, d / 2 + .02, SP.almagre, .5, .6);
  g.add(gableRoof(w, d, h + 1.52, d * .24, SP.tejaArabe, .75));
  for (const x of [-w / 2 + .35, w / 2 - .35]) add(g, block(.16, h + 1.5, .16, SP.almagre), x, (h + 1.5) / 2, d / 2 + .6);
  return masonry(g) as P;
}
