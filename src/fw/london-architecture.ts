/** British building vocabulary for the Central Europe table: London stock brick and Portland stone in
 *  Westminster, four floors of dock warehouse on the estuary, tile-hung Kentish cottages under peg tile,
 *  gritstone farmhouses in the Dales, harled and pantiled cottages in Fife, cob and granite in Cornwall and a
 *  long-house on the Welsh side. Pure builders, no positions.
 *
 *  The twelve palette names are the ones in docs/london-research.md section 1.3 and
 *  docs/london-image-brief.md, "Palette"; the hexes agree with both, name for name. `props-london.ts` carries
 *  its own copy for the stands' own food and people; this one is the Builder's.
 *
 *  The module contract in docs/london-world.md names `britishHouse(style, ...)`; the Stage C brief names
 *  `ukHouse(style, ...)`. They are one builder under two names, so neither owner has to change a call.
 */
import * as THREE from 'three';
import { add, mat, type P } from './props';
import { block, masonry } from './turkey-architecture';

/** The twelve palette names from docs/london-research.md, section 1.3. */
export const LD = {
  londonStock: '#B9A183', portlandStone: '#E4DCCA', millstoneGrit: '#6E675C', moorGranite: '#9B9691',
  slateNorth: '#49515A', kentPeg: '#A85B34', pubGreen: '#1E3A28', oxbloodTile: '#7B2E2B',
  postRed: '#B22C24', oakSmoke: '#4A3526', hopGreen: '#7E8A4E', northSea: '#3E5A63',
};
/** Working tones derived from the twelve: thatch, lime wash, glass, soot and the green of a growing thing. */
const LIME = '#D9D2C0', GLASS = '#8FA7B2', SOOT = '#33302C', THATCH = '#C0A868', LEAD = '#5E6670', HARL = '#CFC6B2';

export type UkStyle = 'londonTerrace' | 'dockWarehouse' | 'kentishCottage' | 'daleFarm' | 'fifeCottage' | 'cornishCob' | 'welshLongHouse';
/** The name the Stage B module contract uses for the same seven. */
export type BritishStyle = UkStyle;

/** A pitched roof with a ridge along x and a course of tiles or slates down each slope. `verge` carries the
 *  gable ends past the wall, which is what makes a stone verge read as stone rather than as a flat end. */
function pitched(w: number, d: number, y: number, rise: number, colour: string, opts: { overhang?: number; verge?: boolean } = {}): THREE.Group {
  const g = new THREE.Group();
  const overhang = opts.overhang ?? .22, span = d / 2 + overhang, length = w + overhang * 2;
  const slope = Math.hypot(span, rise), angle = Math.atan2(rise, span);
  for (const side of [-1, 1]) {
    const face = add(g, block(length, .1, slope, colour), 0, y + rise / 2, side * span / 2);
    face.rotation.x = -side * angle;
    // The courses: a slate roof is read from above, and a plain slab reads as a lid.
    for (let i = 0; i < Math.max(2, Math.floor(slope / .34)); i++)
      add(face, block(length, .035, .03, side > 0 ? '#3D444C' : '#40474F'), 0, .07, -slope / 2 + .17 + i * .34);
  }
  add(g, block(length, .1, .14, colour), 0, y + rise + .02, 0);
  if (opts.verge) for (const x of [-length / 2 + .06, length / 2 - .06]) {
    const gable = add(g, block(.12, rise + .16, d + .1, colour), x, y + rise / 2, 0);
    gable.scale.z = 1;
  }
  return g;
}

/** A hipped roof on four faces, for the Fife cottage's pantile and the warehouse's shallow cap. */
function hipped(w: number, d: number, y: number, rise: number, colour: string, overhang = .2): THREE.Group {
  const g = new THREE.Group(), W = w + overhang * 2, D = d + overhang * 2, rx = W * .22;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([
    -W / 2, y, -D / 2, W / 2, y, -D / 2, W / 2, y, D / 2, -W / 2, y, D / 2, -rx, y + rise, 0, rx, y + rise, 0], 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0]); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat(colour)); m.castShadow = true; m.receiveShadow = true; g.add(m);
  add(g, block(rx * 2 + .1, .08, .12, colour), 0, y + rise + .02, 0);
  return g;
}

/** A brick stack with its pots: the thing that makes a British roofline a British roofline, and the anchor a
 *  kitchen fire's smoke is published at. Returns the top of the tallest pot in local coordinates. */
function chimney(g: THREE.Group, x: number, y: number, z: number, pots: number, brick: string, h = .9): number {
  add(g, block(.42, h, .34, brick), x, y + h / 2, z);
  add(g, block(.5, .08, .42, LIME), x, y + h + .04, z);
  for (let i = 0; i < pots; i++)
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.075, .085, .28, 8), mat(LD.kentPeg)), x + (i - (pots - 1) / 2) * .17, y + h + .22, z);
  return y + h + .36;
}

function sashWindow(g: THREE.Group, x: number, y: number, z: number, w = .42, h = .66, frame = LIME) {
  add(g, block(w + .1, h + .1, .05, frame), x, y, z);
  add(g, block(w, h, .04, GLASS), x, y, z + .015);
  add(g, block(w, .04, .045, frame), x, y, z + .02);               // the meeting rail of a sash
  add(g, block(.03, h, .045, frame), x, y, z + .02);               // the glazing bar
}

/** One British house in one of seven regional styles. The origin is the footprint centre and the front faces
 *  +z, which is the camera's side. A house with a kitchen fire publishes `userData.smoke` above its stack,
 *  taken from the assembled box rather than from the wall arithmetic, so the column is never born in the tile.
 */
export function ukHouse(style: UkStyle, w = 3.0, d = 2.2, h = 2.2, opts: { storeys?: number; bay?: boolean } = {}): P {
  const g = new THREE.Group();
  const storeys = opts.storeys ?? (style === 'londonTerrace' ? 3 : style === 'dockWarehouse' ? 4 : style === 'kentishCottage' ? 2 : 1);
  const bay = opts.bay ?? (style === 'londonTerrace');
  const H = h * storeys, f = d / 2;
  let smoke: THREE.Vector3 | undefined, top = 0;

  const wall = style === 'londonTerrace' || style === 'dockWarehouse' ? LD.londonStock
    : style === 'kentishCottage' ? LD.portlandStone
      : style === 'daleFarm' ? LD.millstoneGrit
        : style === 'fifeCottage' ? HARL
          : style === 'cornishCob' ? '#CDBFA0' : LD.moorGranite;
  const roof = style === 'kentishCottage' || style === 'fifeCottage' ? LD.kentPeg : style === 'welshLongHouse' ? THATCH : LD.slateNorth;
  const trim = style === 'londonTerrace' ? LD.pubGreen : style === 'dockWarehouse' ? LD.oakSmoke : style === 'fifeCottage' ? LD.northSea : LD.pubGreen;

  // A plinth course under every wall: no British house of the band sits its brick straight on the soil.
  add(g, block(w + .16, .22, d + .16, style === 'daleFarm' || style === 'welshLongHouse' ? LD.moorGranite : LIME), 0, .11, 0);
  add(g, block(w, H, d, wall), 0, .22 + H / 2, 0);

  if (style === 'londonTerrace') {
    // A stock-brick terrace read as one building: three narrow fronts, a stone band at each floor, railings
    // and an area in front, and a stack of pots on the party walls.
    const bays = Math.max(2, Math.round(w / 1.7));
    for (let s = 1; s <= storeys; s++) add(g, block(w + .06, .1, d + .06, LIME), 0, .22 + s * h, 0);   // the stone band course
    for (let i = 0; i < bays; i++) {
      const x = -w / 2 + (i + .5) * w / bays;
      add(g, block(.16, H, d + .1, LIME), x - w / bays / 2, .22 + H / 2, 0);                            // the party wall
      for (let s = 0; s < storeys; s++) sashWindow(g, x, .22 + s * h + h * .58, f + .03, Math.min(.5, w / bays - .5), h * .5);
      if (i === Math.floor(bays / 2)) {
        add(g, block(.5, 1.1, .06, trim), x, .22 + .55, f + .04);                                       // the front door
        add(g, new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .07, 12, 1, false, 0, Math.PI), mat(LIME)), x, .22 + 1.12, f + .04).rotation.x = Math.PI / 2;
      }
    }
    add(g, block(w + .16, .12, d + .16, LIME), 0, .22 + H + .06, 0);                                     // the parapet cornice
    add(g, block(w + .16, .34, .12, LIME), 0, .22 + H + .24, f + .06);
    for (let i = 0; i <= bays; i++) add(g, block(.05, .6, .05, SOOT), -w / 2 + i * w / bays, .5, f + .55);  // the area railings
    add(g, block(w + .1, .05, .05, SOOT), 0, .8, f + .55);
    g.add(pitched(w, d, .22 + H + .12, d * .3, roof, { overhang: .1 }));
    top = .22 + H + .12 + d * .3;
    const potTop = chimney(g, -w / 2 + .5, top - .18, -f * .35, 3, LD.londonStock, 1.0);
    chimney(g, w / 2 - .5, top - .18, -f * .35, 3, LD.londonStock, 1.0);
    smoke = new THREE.Vector3(-w / 2 + .5, potTop + .1, -f * .35);
  } else if (style === 'dockWarehouse') {
    // Four floors of stock brick over a segmental cart arch, a loophole door at every floor under a hoist
    // beam with its wheel, and iron shutters. The read from above is a plain slate rectangle, which is what a
    // warehouse is; nothing on it reads as a bridge.
    for (let s = 0; s < storeys; s++) {
      for (const x of [-w / 3, w / 3]) {
        add(g, block(.46, h * .56, .05, SOOT), x, .22 + s * h + h * .58, f + .02);
        add(g, block(.5, .07, .07, LD.oakSmoke), x, .22 + s * h + h * .88, f + .04);    // the flat brick arch
      }
      // The loading door on the centre line, one above the other: a warehouse is loaded through its face.
      add(g, block(.62, h * .66, .06, trim), 0, .22 + s * h + h * .55, f + .03);
      add(g, block(.66, .07, .09, LD.oakSmoke), 0, .22 + s * h + h * .9, f + .05);
    }
    add(g, block(1.0, 1.3, .08, SOOT), 0, .22 + .65, f + .02);                           // the cart arch at the quay
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .09, 14, 1, false, 0, Math.PI), mat(LD.londonStock)), 0, .22 + 1.3, f + .02).rotation.x = Math.PI / 2;
    // The hoist: a beam out of the gable head with a sheave and a fall of rope.
    const beam = add(g, block(.16, .16, 1.0, LD.oakSmoke), 0, .22 + H - .28, f + .42);
    add(g, new THREE.Mesh(new THREE.TorusGeometry(.14, .04, 5, 12), mat(SOOT)), 0, .22 + H - .42, f + .84).rotation.y = Math.PI / 2;
    add(g, block(.03, .9, .03, '#6E6045'), 0, .22 + H - .92, f + .84);
    void beam;
    g.add(hipped(w, d, .22 + H, d * .22, roof, .16));
    top = .22 + H + d * .22;
  } else if (style === 'kentishCottage') {
    // One storey and a half: brick to the first floor, clay tiles hung on the upper wall, a steep peg-tile
    // roof, a catslide over the back and a big stack on the flank.
    add(g, block(w + .04, h * .9, d + .04, LD.kentPeg), 0, .22 + h + h * .45, 0);         // the tile hanging
    for (let i = 0; i < Math.floor((h * .9) / .18); i++)
      add(g, block(w + .06, .03, d + .06, '#8F4A2A'), 0, .22 + h + .1 + i * .18, 0);      // the courses of the hung tile
    sashWindow(g, -w / 4, .22 + h * .55, f + .03, .44, .6);
    add(g, block(.5, 1.05, .06, trim), w / 4, .22 + .52, f + .04);
    for (const x of [-w / 4, w / 4]) add(g, block(.4, .42, .05, LIME), x, .22 + h + h * .5, f + .05);   // the eyebrow dormer lights
    g.add(pitched(w, d, .22 + h * 2, d * .62, roof, { overhang: .3 }));
    top = .22 + h * 2 + d * .62;
    const potTop = chimney(g, -w / 2 + .3, top - .5, 0, 2, LD.kentPeg, 1.1);
    smoke = new THREE.Vector3(-w / 2 + .3, potTop + .1, 0);
    add(g, block(1.2, .07, .8, LD.oakSmoke), w / 2 - .3, .95, f + .5);                    // the tiled porch over the door
  } else if (style === 'daleFarm') {
    // Gritstone, blackened by the mills, under a stone-slate roof with a heavy verge, mullioned windows and a
    // field barn end. A Dales farmhouse is one long range, not a square box.
    for (const x of [-w / 4, w / 4]) {
      add(g, block(.62, .56, .05, GLASS), x, .22 + h * .6, f + .02);
      for (const m of [-.2, 0, .2]) add(g, block(.06, .6, .06, LD.portlandStone), x + m, .22 + h * .6, f + .04);   // the mullions
      add(g, block(.74, .09, .1, LD.portlandStone), x, .22 + h * .92, f + .05);
    }
    add(g, block(.52, 1.05, .06, trim), 0, .22 + .52, f + .04);
    add(g, block(.66, .1, .12, LD.portlandStone), 0, .22 + 1.1, f + .05);
    // The barn end: a lower range with a cart door, added on the west gable.
    add(g, block(w * .55, h * .82, d * .9, LD.millstoneGrit), -w / 2 - w * .27, .22 + h * .41, 0);
    add(g, block(.8, .95, .06, LD.oakSmoke), -w / 2 - w * .27, .22 + .48, d * .45 + .03);
    g.add(pitched(w * .55, d * .9, .22 + h * .82, d * .3, roof, { overhang: .12, verge: true })).position.x = -w / 2 - w * .27;
    g.add(pitched(w, d, .22 + H, d * .44, roof, { overhang: .12, verge: true }));
    top = .22 + H + d * .44;
    const potTop = chimney(g, -w / 2 + .35, top - .3, 0, 2, LD.millstoneGrit, 1.0);
    chimney(g, w / 2 - .35, top - .3, 0, 1, LD.millstoneGrit, .8);
    smoke = new THREE.Vector3(-w / 2 + .35, potTop + .1, 0);
  } else if (style === 'fifeCottage') {
    // Harled walls under a red pantile roof with crow-stepped gables, a forestair to the loft and a box bed
    // window: the east-coast fishing cottage, not a highland cot.
    for (const x of [-w / 3, w / 3]) sashWindow(g, x, .22 + h * .58, f + .03, .4, .52, LD.northSea);
    add(g, block(.5, 1.0, .06, trim), 0, .22 + .5, f + .04);
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++)                                 // the crow steps
      add(g, block(.22, .14, d + .06, LD.moorGranite), side * (w / 2 - .11 - i * .0), .22 + H + .07 + i * .14, 0).scale.z = 1 - i * .2;
    g.add(pitched(w, d, .22 + H, d * .46, roof, { overhang: .1, verge: true }));
    top = .22 + H + d * .46;
    // The forestair: five steps up the gable end to the loft door.
    for (let i = 0; i < 5; i++) add(g, block(.5, .12, .3, LD.moorGranite), w / 2 + .3, .18 + i * .22, f - .2 - i * .26);
    const potTop = chimney(g, -w / 2 + .25, top - .34, 0, 1, HARL, .8);
    smoke = new THREE.Vector3(-w / 2 + .25, potTop + .1, 0);
  } else if (style === 'cornishCob') {
    // Thick cob on a granite plinth, lime-washed, small deep windows, a scantle-slate roof and a granite porch.
    add(g, block(w + .1, .34, d + .1, LD.moorGranite), 0, .17, 0);
    for (const x of [-w / 3.2, w / 3.2]) {
      add(g, block(.36, .44, .06, GLASS), x, .22 + h * .6, f + .02);
      add(g, block(.46, .1, .14, LD.moorGranite), x, .22 + h * .86, f + .06);
    }
    add(g, block(.46, .98, .06, trim), 0, .22 + .49, f + .04);
    add(g, block(.8, .9, .5, LD.moorGranite), 0, .22 + .45, f + .3);                       // the granite porch
    add(g, block(.5, .84, .07, SOOT), 0, .22 + .42, f + .56);
    g.add(pitched(w, d, .22 + H, d * .5, roof, { overhang: .14 }));
    top = .22 + H + d * .5;
    const potTop = chimney(g, -w / 2 + .3, top - .3, 0, 1, LIME, .95);
    smoke = new THREE.Vector3(-w / 2 + .3, potTop + .1, 0);
  } else {
    // welshLongHouse: people at one end, cattle at the other, one long roof over both, thick stone walls and a
    // thatch held down at the ridge.
    add(g, block(w * .7, h * .86, d, LD.moorGranite), w / 2 + w * .35, .22 + h * .43, 0);    // the byre end
    add(g, block(.9, 1.0, .06, LD.oakSmoke), w / 2 + w * .35, .22 + .5, f + .03);
    add(g, block(.46, .96, .06, trim), -w / 4, .22 + .48, f + .04);
    add(g, block(.4, .4, .05, GLASS), w / 5, .22 + h * .62, f + .02);
    g.add(pitched(w * 1.7 + .1, d, .22 + h * .92, d * .58, roof, { overhang: .34 })).position.x = w * .35;
    top = .22 + h * .92 + d * .58;
    for (let i = 0; i < 6; i++) add(g, block(.05, .05, d + .7, '#8F7A45'), -w * .5 + i * w * .34, top - .04, 0);  // the ropes over the thatch
    const potTop = chimney(g, -w / 2 + .25, top - .5, 0, 1, LD.moorGranite, .8);
    smoke = new THREE.Vector3(-w / 2 + .25, potTop + .1, 0);
  }

  const result = masonry(g) as P;
  result.userData.houseStyle = style; result.userData.storeys = storeys; result.userData.roofTop = top;
  result.userData.bay = bay;
  if (smoke) {
    const box = new THREE.Box3().setFromObject(result);
    smoke.y = box.max.y + .24;
    result.userData.smoke = smoke; result.userData.smokeTint = '#b5aea3';
  }
  return result;
}
/** The name the Stage B module contract uses. One builder, two names. */
export const britishHouse = ukHouse;

/** An oast cowl: the white boarded cowl on its spindle over a kentish roundel, turned by the vane so the
 *  draught always draws away from the wind. Built for the Stand maker's hop garden; the Builder places none. */
export function oastCowl(r = .5): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.ConeGeometry(r, r * 1.5, 10), mat('#EFEAD9')), 0, r * .75, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(r * .32, r * .38, r * .5, 10), mat('#EFEAD9')), 0, r * 1.62, 0);
  const vane = add(g, block(r * 1.9, r * .5, .05, '#EFEAD9'), r * .9, r * .5, 0);
  const out = g as P;
  out.userData.tick = (t: number) => { g.rotation.y = Math.sin(t * .18) * .5; void vane; };
  return out;
}

/** A rhubarb forcing shed: a long, low, windowless brick shed with a stove flue, its door shut on the dark.
 *  The Stand maker owns the one at [-53.8, -17.4]; this is the builder both files share. */
export function forcingShed(w = 2.8, d = 1.8): P {
  const g = new THREE.Group();
  add(g, block(w + .12, .2, d + .12, LD.moorGranite), 0, .1, 0);
  add(g, block(w, 1.5, d, LD.londonStock), 0, .95, 0);
  add(g, block(.66, 1.15, .07, LD.oakSmoke), 0, .78, d / 2 + .04);
  add(g, block(.74, .09, .12, LD.portlandStone), 0, 1.4, d / 2 + .06);
  g.add(pitched(w, d, 1.7, d * .34, LD.slateNorth, { overhang: .16 }));
  const flue = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09, .11, 1.1, 8), mat(SOOT)), -w / 2 + .35, 2.1, 0);
  const shed = masonry(g) as P;
  shed.userData.smoke = new THREE.Vector3(flue.position.x, 2.75, 0);
  shed.userData.smokeTint = '#b5aea3';
  return shed;
}

/** A Cornish engine house: the granite box, the massive bob wall the beam rocks in, and the stack at the
 *  corner. The beam is the only moving part; the house is built round the engine, which is why they all look
 *  alike. `userData.tick` rocks the bob, so a caller that adds it to the world gets the motion for nothing. */
export function engineHouseBob(h = 3.4): P {
  const g = new THREE.Group(), w = 2.2, d = 1.9;
  add(g, block(w + .2, .26, d + .2, LD.moorGranite), 0, .13, 0);
  add(g, block(w, h, d, LD.moorGranite), 0, .26 + h / 2, 0);
  add(g, block(w + .26, h * .92, .55, '#8B8781'), 0, .26 + h * .46, d / 2 + .2);           // the bob wall, thicker than the rest
  for (const x of [-w / 2 - .06, w / 2 + .06]) add(g, block(.3, h, .3, LD.portlandStone), x, .26 + h / 2, d / 2 + .2);   // the quoins
  add(g, block(.5, .62, .1, SOOT), 0, .26 + h * .88, d / 2 + .48);                          // the opening the beam rocks through
  for (const x of [-w / 4, w / 4]) add(g, block(.34, .5, .06, SOOT), x, .26 + h * .3, d / 2 + .48);
  const stack = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24, .34, h * 1.25, 10), mat(LD.londonStock)), w / 2 - .1, .26 + h * .62, -d / 2 + .1);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.3, .26, .18, 10), mat(LD.portlandStone)), w / 2 - .1, .26 + h * 1.25, -d / 2 + .1);
  const house = masonry(g) as P;
  const beam = add(house, block(2.5, .3, .32, SOOT), 0, .26 + h * .9, d / 2 + .62);
  add(beam, block(.16, .5, .2, SOOT), -1.1, -.36, 0);
  add(beam, block(.16, .5, .2, SOOT), 1.1, -.36, 0);
  house.userData.smoke = new THREE.Vector3(stack.position.x, .26 + h * 1.4, stack.position.z);
  house.userData.smokeTint = '#b5aea3';
  house.userData.tick = (t: number) => { beam.rotation.z = Math.sin(t * .8) * .085; };
  return house;
}

/** The frame of a fish smoke pit: a whitewashed half barrel sunk in a stone yard, the speets of fish across
 *  its mouth and a hessian cover thrown back. The Stand maker hangs the fish; this is the frame and the yard. */
export function smokePitFrame(): P {
  const g = new THREE.Group();
  add(g, block(2.6, .16, 2.0, LD.moorGranite), 0, .08, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.52, .46, .8, 12, 1, true), mat(LD.oakSmoke, { side: THREE.DoubleSide })), 0, .56, 0);
  for (const y of [.28, .62, .9]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.53, .035, 5, 14), mat('#5E5348')), 0, y, 0).rotation.x = Math.PI / 2;
  for (const z of [-.3, 0, .3]) add(g, new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.3, 5), mat('#9A8355')), 0, .98, z).rotation.z = Math.PI / 2;
  add(g, block(1.0, .06, .8, '#8B7B5C'), 1.0, .46, 0).rotation.z = -.5;                     // the hessian thrown back
  const pit = masonry(g) as P;
  pit.userData.smoke = new THREE.Vector3(0, 1.5, 0);
  pit.userData.smokeTint = '#b5aea3';
  return pit;
}

/** A distillery's malting pagoda: the louvred pyramid over the kiln that every Speyside skyline is read by. */
export function maltingPagoda(w = 1.5, h = 1.7): P {
  const g = new THREE.Group();
  add(g, block(w, h * .34, w, LD.portlandStone), 0, h * .17, 0);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(w * .82, h * .5, 4), mat(LD.slateNorth));
  add(g, cap, 0, h * .58, 0).rotation.y = Math.PI / 4;
  add(g, block(w * .5, h * .22, w * .5, LD.portlandStone), 0, h * .9, 0);
  const top = new THREE.Mesh(new THREE.ConeGeometry(w * .46, h * .38, 4), mat(LD.slateNorth));
  add(g, top, 0, h * 1.18, 0).rotation.y = Math.PI / 4;
  for (const [dx, dz] of [[w * .26, 0], [-w * .26, 0], [0, w * .26], [0, -w * .26]] as [number, number][])
    add(g, block(.1, h * .16, .1, SOOT), dx, h * .92, dz);                                   // the louvres the kiln breathes through
  const pagoda = masonry(g) as P;
  pagoda.userData.smoke = new THREE.Vector3(0, h * 1.45, 0);
  pagoda.userData.smokeTint = '#b5aea3';
  return pagoda;
}

/** A market's iron-and-glass roof: cast columns, a lattice girder each way and a ridge light. It reads from
 *  above as a glass roof, which is what Borough's is; nothing on it reads as a bridge. */
export function ironMarketRoof(w = 4.2, d = 3.2, h = 2.4): P {
  const g = new THREE.Group();
  for (const x of [-w / 2 + .2, 0, w / 2 - .2]) for (const z of [-d / 2 + .2, d / 2 - .2]) {
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, h, 9), mat(LD.pubGreen)), x, h / 2, z);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.17, .13, .16, 9), mat(LD.pubGreen)), x, h - .08, z);   // the capital
  }
  for (const z of [-d / 2 + .2, d / 2 - .2]) {
    add(g, block(w, .16, .12, LD.pubGreen), 0, h + .08, z);
    for (let i = 0; i < 7; i++) add(g, block(.06, .3, .06, LD.pubGreen), -w / 2 + .3 + i * (w - .6) / 6, h + .3, z).rotation.z = i % 2 ? .5 : -.5;
  }
  add(g, block(w + .3, .07, d + .3, GLASS), 0, h + .52, 0);
  add(g, block(w + .36, .1, .5, LEAD), 0, h + .58, 0);
  add(g, block(w * .5, .3, .5, GLASS), 0, h + .72, 0);                                        // the ridge light
  return masonry(g) as P;
}

/** A gas standard: a fluted cast column, a ladder rest and the four-pane lantern a lamplighter reaches with a
 *  pole twice a night. Under .6 across in both directions, so it hides nothing at the camera's pitch. */
export function gasLamp(h = 2.6): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .22, .26, 10), mat(SOOT)), 0, .13, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.055, .085, h, 9), mat(SOOT)), 0, h / 2 + .2, 0);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.13, .022, 5, 12), mat(SOOT)), 0, h * .72, 0).rotation.x = Math.PI / 2;
  add(g, block(.26, .34, .26, '#F2E6B4'), 0, h + .34, 0);
  add(g, new THREE.Mesh(new THREE.ConeGeometry(.22, .18, 4), mat(SOOT)), 0, h + .58, 0).rotation.y = Math.PI / 4;
  add(g, new THREE.Mesh(new THREE.SphereGeometry(.04, 6, 5), mat(SOOT)), 0, h + .7, 0);
  return masonry(g) as P;
}

/** A drystone wall segment: coursed grit with a line of throughs and a row of coping on edge. Walls climb the
 *  fell in straight runs, so a run is drawn from its two ends. */
export function drystoneRun(length: number, h = .78, colour = '#8A8A80'): P {
  const g = new THREE.Group();
  const courses = Math.max(3, Math.round(h / .17));
  for (let c = 0; c < courses; c++) {
    const taper = 1 - c / courses * .28;
    add(g, block(length, .16, .38 * taper, c % 2 ? colour : '#93938A'), 0, .08 + c * (h - .1) / courses, 0);
  }
  for (let i = 0; i < Math.max(2, Math.round(length / .34)); i++)
    add(g, block(.16, .22, .3, '#9B9B90'), -length / 2 + .17 + i * .34, h + .05, 0).rotation.z = i % 2 ? .12 : -.12;   // the coping on edge
  return masonry(g) as P;
}

/** A field gate and its two stone posts, hung on the wall line so a wall reads as a worked field boundary. */
export function fieldGate(w = 1.3): P {
  const g = new THREE.Group();
  for (const x of [-w / 2, w / 2]) add(g, block(.18, 1.05, .18, '#9B9B90'), x, .52, 0);
  for (let i = 0; i < 4; i++) add(g, block(w - .2, .06, .05, LD.oakSmoke), 0, .28 + i * .22, 0);
  add(g, block(.06, .9, .05, LD.oakSmoke), 0, .55, 0).rotation.z = .5;
  return masonry(g) as P;
}
