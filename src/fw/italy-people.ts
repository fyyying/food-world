/** Italian residents of about 1880 to 1914 in everyday working clothes, with footsteps driven by distance
 *  travelled. The eight profiles are the table in docs/italy-research.md section 1.5, in that order; colours
 *  use the palette names in `italy-architecture.ts`.
 *
 *  **The garment lists are UNVERIFIED and are marked so in the data.** The Stage B module contract asked for
 *  each profile to be pinned to a catalogued garment or a dated photograph before a resident is dressed, or
 *  else marked unverified here. The Researcher's own delivery says in the same sentence that its table is "not
 *  verified garment lists" and that this is the largest gap in the delivery, and it names the holdings to
 *  check each profile against without inventory numbers: the Museo di Roma in Trastevere and the Roesler Franz
 *  "Roma sparita" watercolours and the Archivio Storico Capitolino for profiles 1 to 4, the Archivio
 *  Fotografico Giacomelli and the Museo Correr for 5 and 6, the Museo Pitrè and the Accademia di Belle Arti di
 *  Palermo photographic archive for 7 and 8, and the Archivi Alinari and the ICCD for all of them. The Builder
 *  does not invent a source, so every profile below carries `verified: false` and the collection it is to be
 *  checked against; closing the gap is a Researcher task and is named back to the lead.
 *
 *  Three things the research says an image tool supplies unasked are absent here on purpose: the "ciociara"
 *  costume with its laced bodice, striped apron and `ciocie`, which is postcard dress and not what a Roman
 *  woman wore to the market; the gondolier's striped jersey and straw boater, which are of the 1950s; and any
 *  carnival mask, because carnival was outlawed in 1797 and did not return until 1979. A boatman here wears
 *  dark trousers and a plain shirt.
 */
import * as THREE from 'three';
import { person, wear, add, box, cyl, ball, cone, mat, C, type P } from './props';
import { ITP } from './italy-architecture';

type Dress = 'bodice' | 'waistcoat' | 'counterApron' | 'fustian' | 'jersey' | 'fringedShawl' | 'sashShirt' | 'blouseApron';
type Headwear = 'headCloth' | 'feltHat' | 'cap' | 'kerchief' | 'bun' | 'shawlHead' | 'strawHat' | 'crop';
type Legs = 'longSkirt' | 'trousers' | 'gaiters' | 'rolled' | 'calfTrousers';
type Resident = {
  name: string; dress: Dress; head: Headwear; legs: Legs; outer: string; shirt: string; lower: string; sash: string;
  height: number; build: number; pace: number; stride: number; elderly?: boolean; moustache?: boolean; woman?: boolean;
  carry?: 'basket' | 'tray' | 'headBasket' | 'jug' | 'bundle';
  /** Never true in this file. The collection the profile is to be checked against before it is called right. */
  verified: false; check: string;
};
const INK = '#2A2F3A', LINEN = '#EFE6D6', BOOT = '#3A2A1E', CORD = '#6E5C3C';

/** The eight profiles of docs/italy-research.md section 1.5, in the order that table lists them. */
export const RESIDENTS: Resident[] = [
  { name: 'roman-market-woman', dress: 'bodice', head: 'headCloth', legs: 'longSkirt', outer: '#3B3A44', shirt: LINEN, lower: '#5C4A48', sash: ITP.venetianRed, height: .95, build: .94, pace: .56, stride: .56, woman: true, carry: 'basket', verified: false, check: 'Museo di Roma in Trastevere; Roesler Franz, Roma sparita' },
  { name: 'roman-working-man', dress: 'waistcoat', head: 'feltHat', legs: 'trousers', outer: '#4A4640', shirt: '#E7DCC4', lower: '#3B3D45', sash: ITP.venetianRed, height: 1.03, build: 1.03, pace: .62, stride: .68, moustache: true, carry: 'bundle', verified: false, check: 'Archivio Storico Capitolino, Fondo Fotografico' },
  { name: 'counter-worker', dress: 'counterApron', head: 'cap', legs: 'trousers', outer: ITP.sanpietrino, shirt: '#F4F0E6', lower: '#3B3D45', sash: LINEN, height: .99, build: .96, pace: .70, stride: .64, carry: 'tray', verified: false, check: 'Archivi Alinari, Italian trades' },
  { name: 'campagna-shepherd', dress: 'fustian', head: 'feltHat', legs: 'gaiters', outer: CORD, shirt: '#DDD3BD', lower: '#4A4034', sash: '#8A6A3A', height: 1.02, build: 1.08, pace: .42, stride: .58, moustache: true, verified: false, check: 'Museo di Roma in Trastevere, Agro Romano holdings' },
  { name: 'lagoon-boatman', dress: 'jersey', head: 'kerchief', legs: 'rolled', outer: INK, shirt: '#D9CFBA', lower: '#2E3540', sash: ITP.venetianRed, height: 1.04, build: 1.0, pace: .60, stride: .70, verified: false, check: 'Archivio Fotografico Giacomelli, Comune di Venezia' },
  { name: 'venetian-woman', dress: 'fringedShawl', head: 'bun', legs: 'longSkirt', outer: '#23201F', shirt: '#EFE8D8', lower: '#3A3A42', sash: '#23201F', height: .93, build: .92, pace: .50, stride: .54, woman: true, carry: 'jug', verified: false, check: 'Museo Correr photographic archive' },
  { name: 'palermo-vendor', dress: 'sashShirt', head: 'cap', legs: 'calfTrousers', outer: '#E4D7BC', shirt: '#E4D7BC', lower: '#4F4A42', sash: '#8E3B2C', height: 1.0, build: 1.0, pace: .66, stride: .64, moustache: true, verified: false, check: 'Museo Pitrè, Palermo; Incorpora and Leone prints' },
  { name: 'sicilian-woman', dress: 'blouseApron', head: 'shawlHead', legs: 'longSkirt', outer: '#2F2B2A', shirt: '#EFE6D6', lower: '#463F3B', sash: '#7A6A52', height: .94, build: .95, pace: .54, stride: .55, woman: true, carry: 'headBasket', verified: false, check: 'Accademia di Belle Arti di Palermo photographic archive' },
];
/** Two the lanes need and the eight do not cover: the Castelli wine carter who walks at his mule's shoulder,
 *  and the Rialto porter who carries his basket on his head. Both are picked by name, not by index. */
export const CARTER: Resident = { name: 'castelli-carter', dress: 'waistcoat', head: 'feltHat', legs: 'trousers', outer: '#5A4632', shirt: '#E3DAC6', lower: '#43403A', sash: '#8E3B2C', height: 1.04, build: 1.06, pace: .48, stride: .66, moustache: true, verified: false, check: 'Archivio Storico Capitolino, carters of the Castelli' };
export const PORTER: Resident = { name: 'rialto-porter', dress: 'jersey', head: 'kerchief', legs: 'rolled', outer: '#3A4450', shirt: '#DCD2BC', lower: '#2E3540', sash: ITP.venetianRed, height: 1.05, build: 1.08, pace: .58, stride: .68, carry: 'headBasket', verified: false, check: 'Museo Correr, Rialto market prints' };

type Leg = { thigh: THREE.Group; shin: THREE.Group };
type Rig = { upper: THREE.Group; hipY: number; figureScale: number; legs: { left: Leg; right: Leg }; arms: { left: THREE.Group; right: THREE.Group; hand: number } };

/** One resident. `working` picks the standing trades (no carried load, a work apron) for a stand or a stall.
 *  Every seventh resident is a child, which the research says is right for every outdoor room here. */
export function italianResident(index: number, working = false): P {
  const seed = Math.abs(Math.round(index));
  const base = working ? RESIDENTS[[2, 0, 6, 1, 7, 4][seed % 6]]
    : seed % 19 === 11 ? CARTER
      : seed % 23 === 9 ? PORTER
        : RESIDENTS[seed % RESIDENTS.length];
  const child = !working && seed % 7 === 6;
  const style: Resident = child
    ? { ...base, height: .70, build: .80, pace: .80, stride: .44, elderly: false, moustache: false, carry: undefined, woman: base.woman, head: 'crop', dress: base.dress === 'bodice' || base.dress === 'fringedShawl' ? 'blouseApron' : base.dress }
    : base;
  const p = person(style.shirt), rig = p.userData as unknown as Rig, s = rig.figureScale;
  const hair = style.elderly ? '#A9A296' : seed % 3 ? '#2A1F1A' : '#14100E';
  const skin = ['#D9A880', '#C48F68', '#E6BD96', '#B57F58'][Math.floor(seed / 2) % 4];
  p.traverse(o => { if (o instanceof THREE.Mesh) { const m = o.material as THREE.MeshStandardMaterial; if (m.color.getHexString() === C.skin.slice(1)) m.color.set(skin); } });
  const hairCap = rig.upper.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry && o.position.z < 0);
  if (hairCap instanceof THREE.Mesh) (hairCap.material as THREE.MeshStandardMaterial).color.set(hair);

  // Leg cloth belongs to the articulated legs so it bends at the knee. A long skirt is a tube to the ankle;
  // calf trousers and rolled trousers leave the shin bare; gaiters bind a dark wrap below the knee.
  for (const leg of [rig.legs.left, rig.legs.right]) {
    leg.thigh.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o.geometry instanceof THREE.BoxGeometry) return;
      const shin = o.parent === leg.shin;
      const bare = shin && (style.legs === 'rolled' || style.legs === 'calfTrousers');
      (o.material as THREE.MeshStandardMaterial).color.set(bare ? skin : shin && style.legs === 'gaiters' ? CORD : style.lower);
      if (o.parent === leg.thigh) o.scale.set(style.legs === 'longSkirt' ? 1.55 : 1.3, 1, style.legs === 'longSkirt' ? 1.45 : 1.2);
      if (shin && style.legs === 'longSkirt') o.scale.set(1.45, 1, 1.35);
    });
    const shoe = leg.shin.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry);
    // Hobnailed boots on the men of the road; clogs on wet stone in Venice; rope soles in Sicily.
    if (shoe instanceof THREE.Mesh) (shoe.material as THREE.MeshStandardMaterial).color.set(
      style.name === 'lagoon-boatman' || style.name === 'rialto-porter' || style.name === 'venetian-woman' ? '#9A7A4E'
        : style.name === 'sicilian-woman' || style.name === 'palermo-vendor' ? '#B7A986' : BOOT);
  }

  const garment = (o: THREE.Object3D, x: number, y: number, z: number) => wear(p, o, x * s, y * s, z * s);
  if (style.legs === 'longSkirt') {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.175 * s, .255 * s, .46 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .28, 0);
  } else {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .19 * s, .20 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .38, 0);
    if (style.legs === 'gaiters') for (const x of [-.085, .085]) garment(cyl(.062 * s, .062 * s, .20 * s, '#3A3129', 7), x, .17, 0);
  }
  garment(cyl(.163 * s, .163 * s, style.dress === 'sashShirt' ? .13 * s : .07 * s, style.sash, 10), 0, .46, 0);

  switch (style.dress) {
    case 'bodice':
      garment(cyl(.175 * s, .152 * s, .32 * s, style.outer, 10), 0, .645, 0);
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .044 * s, .20 * s, style.shirt, 6), x, .70, 0);   // sleeves pushed up
      garment(box(.24 * s, .34 * s, .035 * s, '#CFC3A8'), 0, .44, .175);                                  // the coarse apron
      break;
    case 'waistcoat':
      garment(cyl(.181 * s, .152 * s, .32 * s, style.outer, 10), 0, .645, 0);
      garment(box(.10 * s, .30 * s, .025 * s, style.shirt), 0, .66, .176);
      garment(box(.16 * s, .09 * s, .05 * s, style.sash), 0, .80, .10).rotation.z = .25;                 // the knotted neckerchief
      break;
    case 'counterApron':
      garment(cyl(.181 * s, .152 * s, .32 * s, style.outer, 10), 0, .645, 0);
      garment(box(.24 * s, .40 * s, .035 * s, '#F4F0E6'), 0, .43, .178);                                  // the long white apron
      garment(box(.09 * s, .26 * s, .05 * s, '#F4F0E6'), .15, .74, .02).rotation.z = .18;                 // the towel over the shoulder
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .045 * s, .18 * s, style.shirt, 6), x, .71, 0);
      break;
    case 'fustian':
      garment(cyl(.19 * s, .165 * s, .38 * s, style.outer, 10), 0, .65, 0);
      for (const x of [-.17, .17]) garment(cyl(.052 * s, .046 * s, .26 * s, style.outer, 6), x, .69, 0);
      garment(box(.30 * s, .20 * s, .13 * s, '#D9CFBA'), 0, .84, -.04);                                   // the sheepskin over the shoulders
      break;
    case 'jersey':
      garment(cyl(.185 * s, .158 * s, .36 * s, style.outer, 10), 0, .65, 0);
      for (const x of [-.175, .175]) garment(cyl(.052 * s, .046 * s, .26 * s, style.outer, 6), x, .69, 0);
      break;
    case 'fringedShawl':
      garment(cyl(.172 * s, .15 * s, .32 * s, style.shirt, 10), 0, .645, 0);
      // The black shawl with very long fringes, crossed over the chest: the one Venetian garment the research
      // singles out. The fringe is a row of short bars along its hem, so it reads at world zoom.
      garment(box(.40 * s, .26 * s, .13 * s, style.outer), 0, .76, 0);
      for (const side of [-1, 1]) garment(box(.11 * s, .34 * s, .06 * s, style.outer), side * .12, .62, .15).rotation.z = side * .32;
      for (let i = 0; i < 7; i++) garment(box(.015 * s, .10 * s, .015 * s, style.outer), -.18 * s + i * .06 * s, .43, .16);
      break;
    case 'sashShirt':
      garment(cyl(.178 * s, .155 * s, .34 * s, style.shirt, 10), 0, .65, 0);
      garment(box(.12 * s, .26 * s, .03 * s, skin), 0, .74, .175);                                        // open at the neck
      garment(box(.20 * s, .30 * s, .035 * s, '#5A4632'), 0, .47, .178);                                  // the fryer's long oiled apron
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .044 * s, .18 * s, style.shirt, 6), x, .71, 0);
      break;
    case 'blouseApron':
      garment(cyl(.173 * s, .15 * s, .32 * s, style.shirt, 10), 0, .645, 0);
      garment(box(.24 * s, .36 * s, .035 * s, '#C9BFA6'), 0, .44, .175);
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .044 * s, .22 * s, style.shirt, 6), x, .70, 0);
      break;
  }
  if (working && style.dress !== 'counterApron') garment(box(.22 * s, .34 * s, .035 * s, '#E3DAC6'), 0, .46, .178);
  if (style.moustache && !child) garment(box(.09 * s, .022 * s, .02 * s, hair), 0, .955, .132);

  switch (style.head) {
    case 'headCloth':
      // A folded cloth over the head and knotted at the nape: never the ciociara's peaked head cloth.
      garment(ball(.168 * s, '#E8E0CE', 10), 0, 1.10, -.02).scale.set(1.05, .82, 1.02);
      garment(box(.16 * s, .12 * s, .09 * s, '#E8E0CE'), 0, .96, -.14);
      break;
    case 'shawlHead':
      garment(ball(.182 * s, style.outer, 10), 0, 1.09, -.05).scale.set(1.06, 1.02, .82);
      for (const x of [-.15, .15]) garment(box(.055 * s, .30 * s, .17 * s, style.outer), x, 1.00, -.03);
      break;
    case 'feltHat':
      garment(cyl(.30 * s, .31 * s, .035 * s, '#4A4034', 14), 0, 1.16, -.01);
      garment(cyl(.145 * s, .16 * s, .17 * s, '#4A4034', 12), 0, 1.24, -.01);
      garment(new THREE.Mesh(new THREE.TorusGeometry(.155 * s, .014 * s, 4, 12), mat('#2A2420')), 0, 1.175, -.01).rotation.x = Math.PI / 2;
      break;
    case 'cap':
      garment(cyl(.152 * s, .156 * s, .09 * s, INK, 12), 0, 1.16, -.02);
      garment(box(.24 * s, .03 * s, .13 * s, INK), 0, 1.13, .12);                                          // the peak
      break;
    case 'kerchief':
      garment(ball(.158 * s, style.sash, 9), 0, 1.11, -.02).scale.set(1.04, .74, 1.0);
      garment(box(.09 * s, .16 * s, .05 * s, style.sash), .09, 1.02, -.10);
      break;
    case 'bun':
      garment(ball(.09 * s, hair, 8), 0, 1.13, -.10).scale.set(1, .9, .9);
      break;
    case 'strawHat':
      garment(cyl(.33 * s, .34 * s, .03 * s, '#C9B27A', 14), 0, 1.15, -.01);
      garment(cyl(.15 * s, .165 * s, .12 * s, '#C9B27A', 10), 0, 1.21, -.01);
      break;
    case 'crop':
      garment(ball(.148 * s, hair, 9), 0, 1.09, -.02).scale.set(1.02, .70, 1.0);
      break;
  }

  const carry = working || child ? undefined : style.carry;
  const leftHome = carry === 'basket' || carry === 'bundle' || carry === 'jug' ? -.85 : 0;
  const rightHome = carry === 'tray' ? -1.35 : carry === 'headBasket' ? -2.35 : 0;
  if (carry === 'headBasket') {
    // Carried on the head, both hands steadying it: the Rialto porter and the Sicilian market woman.
    const basket = add(rig.upper, cyl(.30 * s, .23 * s, .22 * s, '#C9B27A', 11), 0, .78 * s, -.02 * s);
    add(basket, new THREE.Mesh(new THREE.TorusGeometry(.29 * s, .022 * s, 5, 14), mat('#8A6D44')), 0, .11 * s, 0).rotation.x = Math.PI / 2;
    for (let k = 0; k < 5; k++) add(basket, ball(.075 * s, ['#C9302A', '#6F9B57', '#E0842C', '#EFE6D6', '#8A949C'][k], 7), Math.cos(k * 1.3) * .13 * s, .12 * s, Math.sin(k * 1.3) * .13 * s);
  } else if (carry) {
    const hand = carry === 'tray' ? rig.arms.right : rig.arms.left;
    const load = add(hand, new THREE.Group(), 0, rig.arms.hand, 0); load.scale.setScalar(s);
    load.rotation.x = -(carry === 'tray' ? rightHome : leftHome);
    if (carry === 'basket') {
      add(load, cyl(.17, .13, .22, '#C9B27A', 10), 0, -.22, 0);
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.16, .018, 5, 12, Math.PI), mat('#8A6D44')), 0, -.11, 0);
      for (const [i, x] of [-.08, 0, .08].entries()) add(load, ball(.05, ['#C9302A', '#6F9B57', '#E0842C'][i], 7), x, -.10, .015);
    } else if (carry === 'tray') {
      add(load, cyl(.22, .23, .04, '#B4572F', 12), 0, -.06, 0);
      for (const [i, a] of [0, 2.1, 4.2].entries()) add(load, cyl(.055, .06, .06, i % 2 ? '#F4EFE2' : '#E8CBA0', 8), Math.cos(a) * .10, -.01, Math.sin(a) * .10);
    } else if (carry === 'jug') {
      add(load, cyl(.11, .15, .30, '#B4572F', 10), 0, -.24, 0);
      add(load, cyl(.07, .09, .09, '#B4572F', 9), 0, -.06, 0);
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.06, .016, 4, 9, Math.PI), mat('#B4572F')), .13, -.14, 0).rotation.y = Math.PI / 2;
    } else {
      const bundle = add(load, ball(.16, '#C9BFA6', 8), .02, -.13, 0); bundle.scale.set(1, .8, 1.2);
      add(load, cyl(.02, .02, .10, CORD, 5), .02, .02, 0);
    }
  }

  p.scale.set(style.build, style.height, 1);
  p.userData.italyResident = true; p.userData.profile = style.name; p.userData.pace = style.pace;
  p.userData.stride = style.stride; p.userData.isWalking = false; p.userData.child = child;
  p.userData.woman = !!style.woman; p.userData.dressVerified = false;
  const homes = p.children.map(o => ({ o, y: o.position.y }));
  let last: THREE.Vector3 | undefined, lastTime: number | undefined, phase = seed * .73;
  const pose = (t: number, dt: number) => {
    const moved = last && lastTime !== undefined && t > lastTime && dt > 0 ? p.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(p.position); lastTime = t;
    const speed = dt > 0 ? moved / dt : 0, walking = speed > .025;
    if (walking) phase += moved / (style.stride * s * style.height) * Math.PI * 2;
    const strength = walking ? Math.min(1, speed / .35) : 0;
    const sw = Math.sin(phase) * (style.elderly ? .23 : child ? .45 : .36) * strength;
    const { left, right } = rig.legs;
    left.thigh.rotation.x = sw; right.thigh.rotation.x = -sw;
    left.shin.rotation.x = Math.max(0, -sw) * 1.05; right.shin.rotation.x = Math.max(0, sw) * 1.05;
    rig.arms.left.rotation.x = leftHome - sw * (carry && carry !== 'tray' && carry !== 'headBasket' ? 0 : carry === 'headBasket' ? 0 : .62);
    rig.arms.right.rotation.x = rightHome + sw * (carry === 'tray' || carry === 'headBasket' ? 0 : .62);
    // Lower the whole figure enough to keep the supporting foot on the walking surface.
    const bottom = (leg: Leg) => { const a = leg.thigh.rotation.x, b = a + leg.shin.rotation.x; return rig.hipY - .22 * s * Math.cos(a) - .20 * s * Math.cos(b) - .035 * s * Math.sin(b) - .025 * s * Math.abs(Math.cos(b)) - .085 * s * Math.abs(Math.sin(b)); };
    const groundOffset = -Math.min(bottom(left), bottom(right));
    homes.forEach(({ o, y }) => { o.position.y = y + groundOffset; });
    rig.upper.rotation.x = style.elderly ? .075 : 0;
    rig.upper.rotation.z = walking ? Math.sin(phase) * .018 : Math.sin(t * .7 + seed) * .008;
    rig.upper.rotation.y = walking ? Math.sin(phase) * .022 : Math.sin(t * .36 + seed) * .09;
    p.userData.isWalking = walking; p.userData.walkDistance = (p.userData.walkDistance ?? 0) + moved;
  };
  pose(0, 0);
  p.userData.walk = undefined;   // Italy uses the movement observer instead of the shared time-based gait.
  if (!working) p.userData.tick = pose;
  return p;
}
/** The name the Stage C brief uses. One builder, two names, so neither owner has to change a call. */
export const italyResident = italianResident;

export type WalkState = { from: [number, number]; to: [number, number]; u: number; forward: boolean; turn: number; facing: number };

/** Constant pace along a straight segment, a real stop, then a gradual turn. `lift(u)` raises the walker over
 *  a bridge deck. Steps are matched to distance by the observer in `italianResident`, never to the clock. */
export function italyWalk(p: P, from: [number, number], to: [number, number], range: [number, number], seed: number, lift?: (u: number) => number, offset = 0) {
  const [lo, hi] = range, dx0 = to[0] - from[0], dz0 = to[1] - from[1], angle = Math.atan2(dx0, dz0), l0 = Math.hypot(dx0, dz0) || 1;
  // A walker keeps to its own strip of the lane, `offset` to the right of the centreline as the lane runs.
  const ox = -dz0 / l0 * offset, oz = dx0 / l0 * offset;
  from = [from[0] + ox, from[1] + oz]; to = [to[0] + ox, to[1] + oz];
  const dx = dx0, dz = dz0;
  const duration = Math.hypot(dx, dz) * (hi - lo) / p.userData.pace, pause = 1.7 + seed % 4 * .55, half = duration + pause, period = half * 2;
  const state: WalkState = { from, to, u: lo, forward: true, turn: 0, facing: angle };
  p.userData.walkState = state;
  return (t: number, dt: number) => {
    const clock = (t + (seed * .381966 % 1) * period) % period, returning = clock >= half, q = clock % half;
    const walking = q < duration, progress = Math.min(1, q / duration), u = lo + (hi - lo) * (returning ? 1 - progress : progress);
    let facing = angle + (returning ? Math.PI : 0), turn = 0;
    if (!walking) { turn = THREE.MathUtils.clamp((q - duration - .35) / Math.max(.6, pause - .7), 0, 1); facing += Math.PI * turn * turn * (3 - 2 * turn); }
    p.position.set(from[0] + dx * u, .034 + (lift?.(u) ?? 0), from[1] + dz * u); p.rotation.y = facing;
    state.u = u; state.forward = !returning; state.turn = turn; state.facing = facing;
    p.userData.tick?.(t, dt);
  };
}

/** The Castelli wine cart: two tall wheels, a hooped tilt of dark canvas, the barrels under it and the little
 *  seat the carter dozes on. This is the in-period street vehicle of the Roman piazza and it replaces both
 *  Vespas, which are of 1946 and are gone from this table. It has no engine and no mule of its own; the mule
 *  is `italyMule` and the carter walks at its shoulder. */
export function wineCart(): P {
  const g = new THREE.Group();
  add(g, box(1.9, .18, 1.0, '#7A5232'), 0, .78, 0);
  for (const z of [-.52, .52]) add(g, box(1.9, .34, .08, '#6E5C3C'), 0, .96, z);
  for (let k = 0; k < 3; k++) {
    const barrel = add(g, cyl(.27, .27, .72, '#5A3B22', 12), -.55 + k * .55, 1.12, 0);
    barrel.rotation.z = Math.PI / 2;
    for (const x of [-.22, .22]) add(barrel, new THREE.Mesh(new THREE.TorusGeometry(.275, .022, 5, 12), mat('#3A3129')), 0, x, 0).rotation.x = Math.PI / 2;
  }
  // The hooped tilt: five iron bows with dark canvas over them, which is what makes a carrettino a carrettino.
  for (let i = 0; i < 5; i++) {
    const hoop = add(g, new THREE.Mesh(new THREE.TorusGeometry(.62, .028, 5, 14, Math.PI), mat('#2F3238')), -.76 + i * .38, .92, 0);
    hoop.rotation.y = Math.PI / 2;
  }
  const tilt = add(g, box(1.6, .05, 1.28, '#2A2F3A'), -.1, 1.53, 0); tilt.rotation.x = .02;
  for (const z of [-.62, .62]) add(g, box(1.6, .48, .05, '#2A2F3A'), -.1, 1.30, z);
  const wheels: THREE.Mesh[] = [];
  for (const z of [-.58, .58]) {
    const w = add(g, new THREE.Mesh(new THREE.TorusGeometry(.56, .055, 6, 18), mat('#4A3A28')), -.1, .58, z);
    for (let i = 0; i < 6; i++) add(w, new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, 1.1, 4), mat('#8A6D44')), 0, 0, 0).rotation.z = i * Math.PI / 6;
    add(w, new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .1, 8), mat('#3A3129')), 0, 0, 0).rotation.x = Math.PI / 2;
    wheels.push(w as THREE.Mesh);
  }
  for (const z of [-.34, .34]) { const shaft = add(g, cyl(.036, .036, 1.5, '#7A5232', 5), .95, .86, z); shaft.rotation.z = Math.PI / 2; shaft.rotation.y = z > 0 ? -.05 : .05; }
  add(g, box(.5, .09, .9, '#5A3B22'), -.95, 1.02, 0);                                   // the carter's seat at the tail
  const lamp = add(g, box(.14, .2, .14, '#2F3238'), .55, 1.16, .62);
  add(lamp, ball(.055, '#F2C14E', 6), 0, 0, .06);
  const out = g as P;
  let last: THREE.Vector3 | undefined;
  out.userData.tick = (_t: number, dt: number) => {
    const moved = last && dt > 0 ? out.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(out.position);
    for (const w of wheels) w.rotation.z -= moved / .56;   // the wheels turn with the ground they cover
  };
  return out;
}

/** A mule in the shafts of a cart or under panniers. Its legs step with the distance it covers; its head is
 *  on local +x so it leads with it. */
export function italyMule(panniers = false): P {
  const g = new THREE.Group() as P, coat = '#6B5A4A', dark = '#4A3D31';
  add(g, box(1.02, .5, .42, coat), 0, .72, 0);
  add(g, box(.34, .38, .3, coat), .62, .86, 0);
  add(g, box(.28, .22, .24, coat), .78, .72, 0);
  for (const z of [-.09, .09]) add(g, box(.07, .26, .05, dark), .62, 1.14, z);
  add(g, box(.5, .12, .08, dark), .05, .92, 0);
  add(g, box(.06, .34, .06, dark), -.56, .55, 0).rotation.x = .3;
  if (panniers) for (const side of [-1, 1]) { add(g, box(.34, .40, .16, '#B89660'), .05, .70, side * .30); add(g, box(.36, .05, .18, '#8A6D44'), .05, .92, side * .30); }
  else { add(g, box(.42, .10, .46, '#8E3B2C'), .05, .99, 0); for (const z of [-.24, .24]) add(g, box(.06, .06, .06, '#C79B3B'), .22, 1.06, z); }
  const legs: THREE.Group[] = [];
  for (const [i, [x, z]] of ([[.34, -.13], [.34, .13], [-.34, -.13], [-.34, .13]] as [number, number][]).entries()) {
    const leg = new THREE.Group(); leg.position.set(x, .52, z); g.add(leg); legs.push(leg);
    leg.name = i === 0 ? 'italy-mule-leg' : `italy-mule-leg-${i}`;
    add(leg, box(.11, .52, .11, i < 2 ? coat : dark), 0, -.26, 0);
    add(leg, box(.13, .06, .13, '#2B2420'), 0, -.49, .01);
  }
  let last: THREE.Vector3 | undefined, phase = 0;
  const A = .40, STANCE = .64;
  g.userData.tick = (_t: number, dt: number) => {
    const moved = last && dt > 0 ? g.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(g.position);
    if (moved > 1e-4) phase += moved / .70;
    const k = moved > 1e-4 ? 1 : 0;
    legs.forEach((leg, i) => {
      const u = (phase + (i % 3 ? .5 : 0)) % 1;
      // Planted for STANCE of the cycle, travelling backward under the body; then a quick swing forward.
      const offset = u < STANCE ? A * (1 - 2 * u / STANCE) : A * (-1 + 2 * (u - STANCE) / (1 - STANCE));
      leg.rotation.z = Math.asin(offset * k);
    });
    g.userData.isWalking = k > 0;
  };
  return g;
}

/** A sheep of the Agro flock: small, cream, heavy-fleeced, its head on local +x so it leads with it. Its legs
 *  step with the distance it covers, and a planted hoof travels backward under the body for most of the cycle
 *  and swings forward quickly, which is what makes it read as stepping rather than sliding. A sheep standing
 *  in a fold never travels, so its `tick` is cleared there and its legs stay still. */
export function agroSheep(): P {
  const g = new THREE.Group() as P, fleece = '#E4DCCB', face = '#8A7A66';
  add(g, box(.66, .40, .34, fleece), 0, .52, 0);
  for (let i = 0; i < 5; i++) add(g, ball(.17, fleece, 7), -.24 + i * .12, .62 + (i % 2) * .03, (i % 3 - 1) * .07).scale.set(1, .85, 1);
  add(g, box(.22, .20, .18, face), .42, .50, 0);
  add(g, box(.12, .12, .14, face), .54, .44, 0);
  for (const z of [-.07, .07]) add(g, box(.05, .10, .04, face), .40, .60, z).rotation.z = .4;
  const legs: THREE.Group[] = [];
  for (const [i, [x, z]] of ([[.22, -.11], [.22, .11], [-.22, -.11], [-.22, .11]] as [number, number][]).entries()) {
    const leg = new THREE.Group(); leg.position.set(x, .35, z); g.add(leg); legs.push(leg);
    leg.name = i === 0 ? 'agro-sheep-leg' : `agro-sheep-leg-${i}`;
    add(leg, box(.07, .34, .07, face), 0, -.17, 0);
  }
  let last: THREE.Vector3 | undefined, phase = 0;
  const A = .34, STANCE = .64;
  g.userData.tick = (_t: number, dt: number) => {
    const moved = last && dt > 0 ? g.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(g.position);
    if (moved > 1e-4) phase += moved / .46;
    const k = moved > 1e-4 ? 1 : 0;
    legs.forEach((leg, i) => {
      const u = (phase + (i % 3 ? .5 : 0)) % 1;
      const offset = u < STANCE ? A * (1 - 2 * u / STANCE) : A * (-1 + 2 * (u - STANCE) / (1 - STANCE));
      leg.rotation.z = Math.asin(offset * k);
    });
    g.userData.isWalking = k > 0;
  };
  return g;
}

/** A carter and his animal on a closed loop, the owner walkthrough's fix for the wine cart and the Agro mule
 *  (2026-09-23). On a straight lane that the leader walked out and back, the animal and the cart swung through him
 *  at every turn, and the cart stood on the bridge ramp and in the market's corner. Here the path is a stadium:
 *  out along one side of the road `sep` from the other, a half circle, back along the other side, a half circle.
 *  Carter, animal and cart each stand at a fixed distance behind one another *along the path*, so none of them
 *  ever passes through another, and the team stops for a while at the end of each straight before it turns.
 *  The leader stays an ordinary walker: his steps come from the distance he covers. */
export function italyTeam(leader: P, mule: P, cart: P | null, group: THREE.Object3D, from: [number, number], to: [number, number], sep: number, seed: number) {
  const r = sep / 2, dx = to[0] - from[0], dz = to[1] - from[1], len = Math.hypot(dx, dz), ux = dx / len, uz = dz / len;
  const nx = -uz, nz = ux;                               // the right-hand side going from `from` to `to`
  const arc = Math.PI * r, L = 2 * len + 2 * arc;
  const at = (s: number): { x: number; z: number; tx: number; tz: number } => {
    s = ((s % L) + L) % L;
    if (s < len) return { x: from[0] + ux * s + nx * r, z: from[1] + uz * s + nz * r, tx: ux, tz: uz };
    s -= len;
    if (s < arc) { const a = s / r; return { x: to[0] + (nx * Math.cos(a) + ux * Math.sin(a)) * r, z: to[1] + (nz * Math.cos(a) + uz * Math.sin(a)) * r, tx: -nx * Math.sin(a) + ux * Math.cos(a), tz: -nz * Math.sin(a) + uz * Math.cos(a) }; }
    s -= arc;
    if (s < len) return { x: to[0] - ux * s - nx * r, z: to[1] - uz * s - nz * r, tx: -ux, tz: -uz };
    s -= len;
    const a = s / r; return { x: from[0] + (-nx * Math.cos(a) - ux * Math.sin(a)) * r, z: from[1] + (-nz * Math.cos(a) - uz * Math.sin(a)) * r, tx: nx * Math.sin(a) - ux * Math.cos(a), tz: nz * Math.sin(a) - uz * Math.cos(a) };
  };
  const v = (leader.userData.pace as number) * .9, pause = 3.2 + seed % 3 * .6;
  // One cycle: out along the first straight, stop, turn and back along the second, stop, turn.
  const legs = [len / v, pause, (arc + len) / v, pause, arc / v], T = legs.reduce((a, b) => a + b, 0);
  const sAt = (t: number) => {
    let q = (t % T + T) % T;
    if (q < legs[0]) return v * q; q -= legs[0];
    if (q < legs[1]) return len; q -= legs[1];
    if (q < legs[2]) return len + v * q; q -= legs[2];
    if (q < legs[3]) return 2 * len + arc; q -= legs[3];
    return 2 * len + arc + v * q;
  };
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(.013, .013, 1, 5), mat('#8A7A5A')); rope.name = 'italy-halter'; group.add(rope);
  const hand = new THREE.Vector3(), halter = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const muleGap = 1.35, cartGap = muleGap + 2.6;
  // The team keeps its own clock, advanced by each frame's step, so a jump in the world's time (a hidden tab
  // waking, a test that skips ahead) moves it one step along its loop rather than teleporting it.
  let clock = seed * 7.3;
  return (t: number, dt: number) => {
    clock += Math.min(Math.max(dt, 0), .25);
    const s = sAt(clock), a = at(s), m = at(s - muleGap);
    leader.position.set(a.x, .034, a.z); leader.rotation.y = Math.atan2(a.tx, a.tz);
    leader.userData.tick?.(t, dt);
    mule.position.set(m.x, .034, m.z); mule.rotation.y = Math.atan2(-m.tz, m.tx);   // the head is local +x
    mule.userData.tick?.(t, dt);
    if (cart) {
      // The cart trails its mule like a trailer: it stands on the path where it is `cartGap - muleGap` from the
      // mule in a straight line (not along the path, which would pull it into the mule on the half circles), and
      // its shafts — local +x — point at the mule.
      const want = cartGap - muleGap;
      let sc = s - cartGap, c = at(sc);
      for (let k = 0; k < 40 && Math.hypot(c.x - m.x, c.z - m.z) < want; k++) { sc -= .05; c = at(sc); }
      cart.position.set(c.x, .036, c.z); cart.rotation.y = Math.atan2(-(m.z - c.z), m.x - c.x);
      cart.userData.tick?.(t, dt);
    }
    hand.set(.12, .66, .1); leader.localToWorld(hand); group.worldToLocal(hand);   // held low at his side
    halter.set(.78, .86, 0); mule.localToWorld(halter); group.worldToLocal(halter);
    rope.position.copy(hand).add(halter).multiplyScalar(.5);
    rope.scale.y = Math.max(.01, hand.distanceTo(halter));
    rope.quaternion.setFromUnitVectors(up, halter.clone().sub(hand).normalize());
  };
}

/** A rower for a gondola or a sandolo, **seated** on a thwart at the stern and facing the bow, with his oar
 *  on the right-hand side, where the forcola is. Walkthrough 17 (2026-09-23) found the rowers standing bolt
 *  upright in moving boats, with the oar raised like a pole. He now sits (`userData.seated`, carried by the hull),
 *  and the oar strokes: it sweeps fore and aft about the forcola, dips on the drive and lifts on the recovery,
 *  while he leans into it and his arms follow.
 *
 *  The caller seats him at `seatTop - userData.seatDrop` and adds `userData.oar` to the hull at the forcola. */
export function lagoonRower(seed = 0, oarLength = 2.2): P {
  const p = italianResident(seed % 2 ? 4 : 44, true);
  const rig = p.userData as unknown as Rig, s = rig.figureScale;
  (p.userData as { sit?: () => void }).sit?.();
  const pelvis = p.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh;
  pelvis.geometry.computeBoundingBox();
  p.userData.seatDrop = (pelvis.position.y + pelvis.geometry.boundingBox!.min.y) * p.scale.y;
  // The oar: its shaft runs along local +x from the grip (inboard, forward) to the blade (aft, outboard).
  const oar = new THREE.Group(), pitch = new THREE.Group(); oar.add(pitch); oar.rotation.order = 'YZX';
  const shaft = add(pitch, cyl(.028, .036, oarLength, '#B7A986', 6), oarLength / 2 - .45, 0, 0); shaft.rotation.z = Math.PI / 2;
  add(pitch, box(.42, .02, .13, '#A08A5E'), oarLength - .62, 0, 0);
  oar.name = 'italy-oar';
  p.userData.oar = oar;
  p.userData.seated = true;                 // carried by the hull: it travels, so it must not be read as sliding
  const phase0 = seed * 1.7;
  p.userData.tick = (t: number) => {
    const ph = t * 1.15 + phase0, sweep = Math.sin(ph), drive = Math.cos(ph) > 0;
    oar.rotation.y = .1 + sweep * .1;                    // aft and a little outboard, swinging fore and aft
    pitch.rotation.z = drive ? -.44 : -.34;               // the blade down in the water on the drive, up on the recovery
    pitch.rotation.z += Math.cos(ph) * .03;
    rig.upper.rotation.x = .10 + sweep * .16;
    rig.arms.right.rotation.x = -1.2 - sweep * .3; rig.arms.left.rotation.x = -1.1 - sweep * .3;
  };
  void s;
  return p;
}

void cone;
