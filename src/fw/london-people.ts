/** British residents of about 1880 to 1914 in everyday working clothes, with footsteps driven by the distance
 *  they actually cover. The eight profiles are the table in docs/london-research.md section 1.3; colours use
 *  the palette names in `london-architecture.ts`.
 *
 *  Two things the research says an image tool supplies unasked are absent here on purpose: the Pearly King
 *  costume, which is a specific charitable tradition and reads as fancy dress, and tartan on anybody in the
 *  Scottish cluster. A Speyside maltman and an Arbroath fishwife wore neither. Nobody wears a top hat and
 *  frock coat either: this is a working table, and the one bowler on it belongs to a clerk on the Strand.
 *
 *  The module contract in docs/london-world.md names `britishResident`; the Stage C brief names
 *  `londonResident`. They are one builder under two names.
 */
import * as THREE from 'three';
import { person, wear, add, box, cyl, ball, mat, C, type P } from './props';
import { LD } from './london-architecture';

type Dress = 'flannel' | 'counter' | 'pinafore' | 'lascar' | 'gansey' | 'oilskin' | 'tweed' | 'shawl' | 'clerk';
type Headwear = 'clothCap' | 'armbands' | 'whiteCap' | 'knitCap' | 'souwester' | 'headscarf' | 'feltHat' | 'gook' | 'bowler';
type Legs = 'moleskin' | 'darkTrousers' | 'longSkirt' | 'lungi' | 'serge' | 'kiltedSkirt';
type Resident = {
  name: string; dress: Dress; head: Headwear; legs: Legs; outer: string; shirt: string; lower: string; sash: string;
  height: number; build: number; pace: number; stride: number; elderly?: boolean; woman?: boolean;
  carry?: 'basket' | 'tray' | 'bundle' | 'broom';
};
const SOOT = '#33302C', MOLESKIN = '#6A5F4E', SERGE = '#33414A';

/** The eight profiles of docs/london-research.md section 1.3, in the order that table lists them. */
export const RESIDENTS: Resident[] = [
  { name: 'street-worker', dress: 'flannel', head: 'clothCap', legs: 'moleskin', outer: LD.oakSmoke, shirt: LD.portlandStone, lower: MOLESKIN, sash: LD.postRed, height: 1.01, build: 1.0, pace: .70, stride: .66, carry: 'bundle' },
  { name: 'counter-worker', dress: 'counter', head: 'armbands', legs: 'darkTrousers', outer: LD.slateNorth, shirt: '#F2EDE0', lower: SOOT, sash: LD.portlandStone, height: 1.00, build: 1.04, pace: .62, stride: .60 },
  { name: 'shop-girl', dress: 'pinafore', head: 'whiteCap', legs: 'longSkirt', outer: LD.slateNorth, shirt: '#F2EDE0', lower: LD.slateNorth, sash: LD.portlandStone, height: .95, build: .90, pace: .58, stride: .54, woman: true, carry: 'tray' },
  { name: 'lascar-cook', dress: 'lascar', head: 'knitCap', legs: 'lungi', outer: LD.slateNorth, shirt: '#E6DCC6', lower: LD.kentPeg, sash: '#8E5A33', height: .98, build: .96, pace: .60, stride: .58 },
  { name: 'quay-hand', dress: 'gansey', head: 'souwester', legs: 'serge', outer: '#28434C', shirt: '#28434C', lower: SERGE, sash: '#B7A05A', height: 1.03, build: 1.06, pace: .66, stride: .64, carry: 'basket' },
  { name: 'herring-lassie', dress: 'oilskin', head: 'headscarf', legs: 'longSkirt', outer: '#9A8A4A', shirt: '#E6DCC6', lower: SOOT, sash: LD.postRed, height: .96, build: .94, pace: .56, stride: .56, woman: true, carry: 'basket' },
  { name: 'dales-farm-worker', dress: 'tweed', head: 'feltHat', legs: 'moleskin', outer: LD.millstoneGrit, shirt: '#DCD3BC', lower: '#6B5B44', sash: '#8B7A55', height: 1.02, build: 1.02, pace: .54, stride: .62, carry: 'bundle' },
  { name: 'cockle-woman', dress: 'shawl', head: 'gook', legs: 'kiltedSkirt', outer: LD.oxbloodTile, shirt: LD.portlandStone, lower: '#5C5142', sash: LD.kentPeg, height: .95, build: .92, pace: .58, stride: .56, woman: true, carry: 'basket' },
];
/** Two the street needs and the eight do not cover: the clerk on the Strand under his bowler, and the
 *  crossing-sweeper with his broom. Neither is a trade profile, so both are picked by name, not by index. */
export const CLERK: Resident = { name: 'strand-clerk', dress: 'clerk', head: 'bowler', legs: 'darkTrousers', outer: SOOT, shirt: '#F2EDE0', lower: SOOT, sash: '#2A3A4A', height: 1.02, build: .96, pace: .74, stride: .70 };
export const SWEEPER: Resident = { name: 'crossing-sweeper', dress: 'flannel', head: 'clothCap', legs: 'moleskin', outer: '#4E4636', shirt: '#CFC5AE', lower: '#54493A', sash: '#7A6A4A', height: .88, build: .88, pace: .40, stride: .46, carry: 'broom' };

type Leg = { thigh: THREE.Group; shin: THREE.Group };
type Rig = { upper: THREE.Group; hipY: number; figureScale: number; legs: { left: Leg; right: Leg }; arms: { left: THREE.Group; right: THREE.Group; hand: number } };

/** One resident. `working` picks the standing trades (a work apron, no carried load) for a stand or a stall.
 *  Every seventh resident is a child: the hop gardens and the cockle sands were mostly women and children,
 *  and the research says the outdoor rooms should read that way. */
export function londonResident(index: number, working = false): P {
  const seed = Math.abs(Math.round(index));
  const base = working ? RESIDENTS[[1, 2, 6, 7, 4, 3][seed % 6]]
    : seed % 19 === 11 ? CLERK
      : seed % 23 === 9 ? SWEEPER
        : RESIDENTS[seed % RESIDENTS.length];
  const child = !working && seed % 7 === 6;
  const style: Resident = child
    ? { ...base, height: .68, build: .80, pace: .80, stride: .42, elderly: false, carry: undefined, woman: base.woman,
        head: base.woman ? 'whiteCap' : 'clothCap', dress: base.woman ? 'pinafore' : 'flannel' }
    : base;
  const p = person(style.shirt), rig = p.userData as unknown as Rig, s = rig.figureScale;
  const hair = style.elderly ? '#A9A296' : ['#2A1F1C', '#4A3524', '#6B4A2C', '#1F1A18'][Math.floor(seed / 3) % 4];
  const skin = ['#EFC9A4', '#E2B48C', '#C48F68', '#9A6B48'][style.dress === 'lascar' ? 3 : Math.floor(seed / 2) % 3];
  p.traverse(o => { if (o instanceof THREE.Mesh) { const m = o.material as THREE.MeshStandardMaterial; if (m.color.getHexString() === C.skin.slice(1)) m.color.set(skin); } });
  const hairCap = rig.upper.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry && o.position.z < 0);
  if (hairCap instanceof THREE.Mesh) (hairCap.material as THREE.MeshStandardMaterial).color.set(hair);

  // Leg cloth belongs to the articulated legs so it bends at the knee. Trousers and a lungi run to the ankle;
  // a long skirt is a tube that hides the shin; a kilted skirt is drawn up over a petticoat, so the shin is
  // bare above a clog, which is how a cockle woman worked the sands.
  const skirted = style.legs === 'longSkirt' || style.legs === 'kiltedSkirt';
  for (const leg of [rig.legs.left, rig.legs.right]) {
    leg.thigh.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o.geometry instanceof THREE.BoxGeometry) return;
      const shin = o.parent === leg.shin;
      const colour = style.legs === 'kiltedSkirt' && shin ? skin : shin && style.legs === 'longSkirt' ? style.lower : style.lower;
      (o.material as THREE.MeshStandardMaterial).color.set(colour);
      if (o.parent === leg.thigh) o.scale.set(skirted ? 1.45 : 1.2, 1, skirted ? 1.4 : 1.15);
      if (shin && style.legs === 'longSkirt') o.scale.set(1.3, 1, 1.25);
    });
    // Hobnailed boots on the street and the farm, clogs on the quay and the sands, bare feet on a lascar.
    const shoe = leg.shin.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry);
    if (shoe instanceof THREE.Mesh) (shoe.material as THREE.MeshStandardMaterial).color.set(
      style.dress === 'lascar' ? skin : style.legs === 'kiltedSkirt' || style.dress === 'gansey' ? '#9A7A4E' : '#1F1A18');
  }

  const garment = (o: THREE.Object3D, x: number, y: number, z: number) => wear(p, o, x * s, y * s, z * s);
  // The lower cloth.
  if (style.legs === 'longSkirt') {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .25 * s, .46 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .27, 0);
  } else if (style.legs === 'kiltedSkirt') {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .24 * s, .28 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .38, 0);
    garment(cyl(.2 * s, .235 * s, .08 * s, '#DCD3BC', 12), 0, .25, 0);         // the petticoat showing under the kilted skirt
  } else if (style.legs === 'lungi') {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.175 * s, .225 * s, .40 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .27, 0);
    for (let i = 0; i < 4; i++) garment(box(.34 * s, .02 * s, .02 * s, '#7A4A2A'), 0, .16 + i * .08, .19);   // the check of the cloth
  } else {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.175 * s, .185 * s, .18 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .40, 0);
  }
  garment(cyl(.155 * s, .155 * s, .06 * s, style.sash, 10), 0, .47, 0);

  switch (style.dress) {
    case 'flannel':
      // Collarless flannel, a waistcoat over it, braces and a knotted neckerchief. No tie, no collar.
      garment(cyl(.175 * s, .152 * s, .3 * s, style.outer, 10), 0, .64, 0);
      for (const x of [-.07, .07]) garment(box(.045 * s, .3 * s, .02 * s, style.lower), x, .64, .16);   // the braces over the shirt
      garment(box(.15 * s, .1 * s, .08 * s, style.sash), 0, .84, .11);                                  // the neckerchief, knotted at the throat
      break;
    case 'counter':
      // A white shirt with the sleeves rolled and held by armbands, a dark waistcoat and a long white apron.
      garment(cyl(.175 * s, .152 * s, .28 * s, style.outer, 10), 0, .66, 0);
      garment(box(.06 * s, .3 * s, .02 * s, '#C8B16A'), 0, .66, .17);                                    // the watch chain
      garment(box(.24 * s, .5 * s, .04 * s, style.sash), 0, .42, .17);                                   // the apron to below the knee
      for (const x of [-.175, .175]) garment(cyl(.05 * s, .048 * s, .05 * s, SOOT, 6), x, .72, 0);       // the armbands
      break;
    case 'pinafore':
      garment(cyl(.172 * s, .15 * s, .34 * s, style.outer, 10), 0, .65, 0);
      garment(box(.2 * s, .34 * s, .04 * s, style.sash), 0, .62, .16);                                   // the bibbed pinafore
      garment(box(.26 * s, .36 * s, .05 * s, style.sash), 0, .4, .16);
      for (const x of [-.175, .175]) garment(cyl(.05 * s, .042 * s, .27 * s, style.outer, 6), x, .68, 0);
      garment(box(.3 * s, .05 * s, .06 * s, '#F4F1E6'), 0, .86, .04);                                    // the white collar
      break;
    case 'lascar':
      // A European jacket out of the ship's slop chest over a cotton lungi, and a blanket shawl over one arm.
      garment(cyl(.19 * s, .165 * s, .36 * s, style.outer, 10), 0, .64, 0);
      garment(box(.06 * s, .3 * s, .02 * s, style.shirt), 0, .66, .19);
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .045 * s, .24 * s, style.outer, 6), x, .69, 0);
      garment(box(.12 * s, .44 * s, .07 * s, '#8A6A52'), -.15, .68, .03).rotation.z = -.24;
      break;
    case 'gansey':
      // A hand-knitted gansey, the yoke worked in the family's own pattern, high in the neck.
      garment(cyl(.18 * s, .16 * s, .4 * s, style.outer, 10), 0, .64, 0);
      for (const y of [.74, .78, .82]) garment(cyl(.181 * s, .181 * s, .012 * s, '#33505A', 12), 0, y, 0);   // the pattern across the yoke
      garment(cyl(.1 * s, .1 * s, .07 * s, style.outer, 10), 0, .88, 0);
      for (const x of [-.175, .175]) garment(cyl(.052 * s, .046 * s, .3 * s, style.outer, 6), x, .68, 0);
      break;
    case 'oilskin':
      // A heavy oilskin apron and sleeves over a dark dress, and fingers bound against the gutting knife.
      garment(cyl(.172 * s, .15 * s, .34 * s, SOOT, 10), 0, .65, 0);
      garment(box(.3 * s, .54 * s, .05 * s, style.outer), 0, .48, .17);
      for (const x of [-.178, .178]) garment(cyl(.056 * s, .05 * s, .3 * s, style.outer, 6), x, .68, 0);
      for (const x of [-.178, .178]) garment(ball(.05 * s, '#EDE6D4', 6), x, .5, 0);                      // the bound fingers
      break;
    case 'tweed':
      garment(cyl(.185 * s, .16 * s, .36 * s, style.outer, 10), 0, .65, 0);
      garment(box(.16 * s, .26 * s, .02 * s, style.shirt), 0, .7, .18);
      for (const x of [-.175, .175]) garment(cyl(.052 * s, .046 * s, .28 * s, style.outer, 6), x, .68, 0);
      for (const x of [-.075, .075]) garment(cyl(.055 * s, .06 * s, .04 * s, style.sash, 6), x, .18, 0);  // the cord tied below the knee
      break;
    case 'shawl':
      garment(cyl(.172 * s, .15 * s, .32 * s, style.shirt, 10), 0, .65, 0);
      garment(box(.36 * s, .2 * s, .18 * s, style.outer), 0, .76, 0);                                     // the shawl crossed over the chest
      garment(box(.12 * s, .3 * s, .06 * s, style.outer), .08, .62, .14).rotation.z = .35;
      garment(box(.26 * s, .34 * s, .05 * s, style.sash), 0, .42, .16);                                   // the hessian apron
      break;
    case 'clerk':
      garment(cyl(.18 * s, .155 * s, .44 * s, style.outer, 10), 0, .62, 0);
      garment(box(.08 * s, .34 * s, .02 * s, style.shirt), 0, .68, .18);
      garment(box(.05 * s, .16 * s, .03 * s, style.sash), 0, .78, .19);                                   // the tie
      for (const x of [-.175, .175]) garment(cyl(.05 * s, .044 * s, .32 * s, style.outer, 6), x, .68, 0);
      break;
  }
  if (working && style.dress !== 'counter') garment(box(.22 * s, .38 * s, .035 * s, '#E4DCCA'), 0, .45, .17);

  switch (style.head) {
    case 'clothCap':
      garment(cyl(.15 * s, .16 * s, .07 * s, style.outer, 10), 0, 1.15, -.01);
      garment(box(.26 * s, .03 * s, .14 * s, style.outer), 0, 1.13, .14);                                 // the peak
      break;
    case 'armbands': break;                                                                               // bare-headed behind a counter
    case 'whiteCap':
      garment(cyl(.14 * s, .15 * s, .05 * s, '#F4F1E6', 10), 0, 1.15, -.02);
      garment(box(.26 * s, .09 * s, .05 * s, '#F4F1E6'), 0, 1.13, -.13);                                  // the cap band and its tail
      break;
    case 'knitCap':
      garment(ball(.155 * s, '#4A4034', 9), 0, 1.12, -.01).scale.set(1, .78, 1);
      break;
    case 'souwester':
      garment(cyl(.16 * s, .17 * s, .1 * s, '#8A7238', 10), 0, 1.14, -.01);
      garment(cyl(.3 * s, .3 * s, .025 * s, '#8A7238', 12), 0, 1.09, -.03).rotation.x = .18;             // the brim, longer at the nape
      break;
    case 'headscarf':
      garment(ball(.165 * s, style.sash, 9), 0, 1.11, -.03).scale.set(1.02, .95, .9);
      garment(box(.14 * s, .2 * s, .07 * s, style.sash), 0, 1.0, -.13);                                   // tied back at the nape
      break;
    case 'feltHat':
      garment(cyl(.145 * s, .15 * s, .14 * s, '#5C5142', 10), 0, 1.18, -.01);
      garment(cyl(.29 * s, .29 * s, .025 * s, '#5C5142', 12), 0, 1.1, -.01);
      break;
    case 'gook':
      // The bal maiden's and the cockle woman's stiffened bonnet, with its long neck curtain.
      garment(cyl(.17 * s, .2 * s, .18 * s, '#EDE6D4', 10), 0, 1.15, -.02);
      garment(box(.34 * s, .05 * s, .2 * s, '#EDE6D4'), 0, 1.24, .05);
      garment(box(.3 * s, .26 * s, .06 * s, '#EDE6D4'), 0, .99, -.14);
      break;
    case 'bowler':
      garment(cyl(.145 * s, .15 * s, .16 * s, SOOT, 12), 0, 1.19, -.01);
      garment(new THREE.Mesh(new THREE.SphereGeometry(.15 * s, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(SOOT)), 0, 1.26, -.01);
      garment(cyl(.23 * s, .23 * s, .02 * s, SOOT, 12), 0, 1.12, -.01);
      break;
  }

  const carry = working || child ? undefined : style.carry;
  const leftHome = carry === 'basket' || carry === 'bundle' ? -.85 : carry === 'broom' ? -.55 : 0;
  const rightHome = carry === 'tray' ? -1.3 : carry === 'broom' ? -.9 : 0;
  if (carry) {
    const hand = carry === 'tray' || carry === 'broom' ? rig.arms.right : rig.arms.left;
    const load = add(hand, new THREE.Group(), 0, rig.arms.hand, 0); load.scale.setScalar(s);
    load.rotation.x = -(hand === rig.arms.right ? rightHome : leftHome);
    if (carry === 'basket') {
      // A withy cockle basket, carried on the arm.
      add(load, cyl(.17, .13, .22, '#C3A86A', 10), 0, -.22, 0);
      for (const y of [-.14, -.28]) add(load, new THREE.Mesh(new THREE.TorusGeometry(.16, .016, 5, 12), mat('#A88D55')), 0, y, 0).rotation.x = Math.PI / 2;
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.15, .018, 5, 12, Math.PI), mat('#A88D55')), 0, -.1, 0);
      for (const [i, x] of [-.07, .02, .09].entries()) add(load, ball(.05, ['#8B8177', '#6F6A60', '#9A9188'][i], 7), x, -.1, .01);
    } else if (carry === 'tray') {
      add(load, box(.34, .04, .24, '#8A6A45'), 0, -.06, 0);                                               // a japanned tray, carried flat
      add(load, box(.36, .03, .26, '#4A3526'), 0, -.09, 0);
      for (const [i, x] of [-.09, .02, .11].entries()) add(load, cyl(.05, .045, .06, i % 2 ? '#F4F1E6' : '#E4DCCA', 8), x, -.01, 0);
    } else if (carry === 'bundle') {
      const sack = add(load, ball(.15, '#C0B08A', 8), .02, -.13, 0); sack.scale.set(1, .86, 1.15);
      add(load, cyl(.02, .02, .1, '#6E5C3C', 5), .02, .02, 0);
    } else {
      // The crossing-sweeper's birch broom: the handle in the hand, the head on the ground in front.
      const stick = add(load, cyl(.02, .02, 1.25, '#7A5A38', 5), 0, -.5, .1); stick.rotation.x = .3;
      add(load, cyl(.11, .14, .26, '#8A7A4A', 9), 0, -1.12, .48);
    }
  }

  p.scale.set(style.build, style.height, 1);
  p.userData.britishResident = true; p.userData.londonResident = true; p.userData.profile = style.name;
  p.userData.pace = style.pace; p.userData.stride = style.stride; p.userData.isWalking = false;
  p.userData.child = child; p.userData.woman = !!style.woman;
  const homes = p.children.map(o => ({ o, y: o.position.y }));
  let last: THREE.Vector3 | undefined, lastTime: number | undefined, phase = seed * .73;
  const pose = (t: number, dt: number) => {
    const moved = last && lastTime !== undefined && t > lastTime && dt > 0 ? p.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(p.position); lastTime = t;
    const speed = dt > 0 ? moved / dt : 0, walking = speed > .025;
    if (walking) phase += moved / (style.stride * s * style.height) * Math.PI * 2;
    const strength = walking ? Math.min(1, speed / .35) : 0;
    const sw = Math.sin(phase) * (style.elderly ? .22 : child ? .44 : .35) * strength;
    const { left, right } = rig.legs;
    left.thigh.rotation.x = sw; right.thigh.rotation.x = -sw;
    left.shin.rotation.x = Math.max(0, -sw) * 1.05; right.shin.rotation.x = Math.max(0, sw) * 1.05;
    rig.arms.left.rotation.x = leftHome - sw * (carry === 'basket' || carry === 'bundle' ? 0 : .6);
    rig.arms.right.rotation.x = rightHome + sw * (carry === 'tray' || carry === 'broom' ? 0 : .6);
    // Lower the whole figure enough to keep the supporting foot on the walking surface.
    const bottom = (leg: Leg) => { const a = leg.thigh.rotation.x, b = a + leg.shin.rotation.x; return rig.hipY - .22 * s * Math.cos(a) - .20 * s * Math.cos(b) - .035 * s * Math.sin(b) - .025 * s * Math.abs(Math.cos(b)) - .085 * s * Math.abs(Math.sin(b)); };
    const groundOffset = -Math.min(bottom(left), bottom(right));
    homes.forEach(({ o, y }) => { o.position.y = y + groundOffset; });
    rig.upper.rotation.x = style.elderly ? .07 : 0;
    rig.upper.rotation.z = walking ? Math.sin(phase) * .018 : Math.sin(t * .7 + seed) * .008;
    rig.upper.rotation.y = walking ? Math.sin(phase) * .022 : Math.sin(t * .36 + seed) * .09;
    p.userData.isWalking = walking; p.userData.walkDistance = (p.userData.walkDistance ?? 0) + moved;
  };
  pose(0, 0);
  p.userData.walk = undefined;   // Britain uses the movement observer instead of the shared time-based gait.
  if (!working) p.userData.tick = pose;
  return p;
}
/** The name the Stage B module contract uses. One builder, two names. */
export const britishResident = londonResident;

export type WalkState = { from: [number, number]; to: [number, number]; u: number; forward: boolean; turn: number; facing: number };

/** Constant pace along a straight segment, a real stop, then a gradual turn. `lift(u)` raises the walker onto
 *  a bridge deck. Steps are matched to distance by the observer in `londonResident`, never to the clock.
 *  `pace` overrides the resident's own pace, which is how the blueprint's 0.009 on the Westminster street and
 *  0.007 everywhere else are carried without changing the residents. */
export function londonWalk(p: P, from: [number, number], to: [number, number], range: [number, number], seed: number, lift?: (u: number) => number, pace?: number) {
  const [lo, hi] = range, dx = to[0] - from[0], dz = to[1] - from[1], angle = Math.atan2(dx, dz);
  const speed = (pace ?? .008) * 100 * (p.userData.pace as number);
  const duration = Math.hypot(dx, dz) * (hi - lo) / speed, pause = 1.6 + seed % 4 * .6, half = duration + pause, period = half * 2;
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

/** A dales pit pony with its panniers: stocky, shaggy, its head on local +x so it leads with it. Its legs step
 *  with the distance it covers, and a planted hoof travels backward under the body for most of the cycle and
 *  swings forward quickly, which is what makes it read as stepping rather than sliding. */
export function pitPony(): P {
  const g = new THREE.Group() as P, coat = '#6A5240', dark = '#463525', mane = '#2E241B';
  add(g, box(1.02, .52, .46, coat), 0, .66, 0);
  add(g, box(.3, .36, .28, coat), .66, .78, 0);                          // the head, forward on +x
  add(g, box(.22, .18, .22, dark), .8, .66, 0);
  for (const z of [-.1, .1]) add(g, box(.07, .13, .05, dark), .62, .98, z);
  add(g, box(.34, .16, .1, mane), .38, .94, 0);                          // the mane over the crest
  add(g, box(.06, .3, .06, mane), -.54, .6, 0).rotation.x = .3;          // the tail
  // The panniers: a pair of withy baskets slung across the back on a pad.
  add(g, box(.5, .06, .5, '#8B7A55'), 0, .93, 0);
  for (const z of [-.3, .3]) {
    const pannier = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.19, .15, .3, 9), mat('#C3A86A')), 0, .72, z);
    for (let k = 0; k < 3; k++) add(pannier, ball(.07, ['#8FA84A', '#B2603A', '#D6C68A'][k], 6), (k - 1) * .11, .16, 0);
  }
  const legs: THREE.Group[] = [];
  for (const [i, [x, z]] of ([[.34, -.16], [.34, .16], [-.34, -.16], [-.34, .16]] as [number, number][]).entries()) {
    const leg = new THREE.Group(); leg.position.set(x, .48, z); g.add(leg); legs.push(leg);
    leg.name = i === 0 ? 'pony-leg' : `pony-leg-${i}`;
    add(leg, box(.12, .48, .12, i < 2 ? coat : dark), 0, -.24, 0);
    add(leg, box(.14, .07, .14, '#2A2622'), 0, -.46, .01);
  }
  let last: THREE.Vector3 | undefined, phase = 0;
  const A = .4, STANCE = .64;
  g.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? g.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(g.position);
    if (moved > 1e-4) phase += moved / .7;
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

/** The pony trails 1.4 behind its leader along the direction of travel, on a lead rope, and walks round to be
 *  behind again while the leader turns. Its head follows the ground it actually covers, not the lane's
 *  direction: taking it from the lane is what made Spain's mill mule circle its stone tail first. */
export function followPony(pony: P, leader: P, group: THREE.Object3D) {
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 5), mat('#8A7A5A')); rope.name = 'pony-lead'; group.add(rope);
  const hand = new THREE.Vector3(), halter = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let facing: number | null = null;
  const was = new THREE.Vector3();
  return (t: number, dt: number) => {
    const s = leader.userData.walkState as WalkState | undefined; if (!s) return;
    const dx = s.to[0] - s.from[0], dz = s.to[1] - s.from[1], len = Math.hypot(dx, dz) || 1;
    const side = (s.forward ? 1 : -1) * (1 - 2 * s.turn * s.turn * (3 - 2 * s.turn));
    const u = s.u - 1.4 * side / len;
    was.copy(pony.position);
    pony.position.set(s.from[0] + dx * u, .034, s.from[1] + dz * u);
    const mx = pony.position.x - was.x, mz = pony.position.z - was.z;
    if (Math.hypot(mx, mz) > 1e-5) {
      const want = Math.atan2(-mz, mx);   // the head is local +x, so it points the way the animal is going
      if (facing === null) facing = want;
      else { let d = want - facing; d = Math.atan2(Math.sin(d), Math.cos(d)); facing = Math.abs(d) > .5 ? want : facing + d * Math.min(1, dt * 6); }
    }
    pony.rotation.y = facing ?? Math.atan2(-dz, dx);
    pony.userData.tick?.(t, dt);
    hand.set(0, .52, 0); leader.localToWorld(hand); group.worldToLocal(hand);
    halter.set(.86, .8, 0); pony.localToWorld(halter); group.worldToLocal(halter);
    rope.position.copy(hand).add(halter).multiplyScalar(.5);
    rope.scale.y = Math.max(.01, hand.distanceTo(halter));
    rope.quaternion.setFromUnitVectors(up, halter.clone().sub(hand).normalize());
  };
}

/** A hefted Swaledale ewe at rest: dark face and legs, a curled horn, a grey fleece. It stands, so it does not
 *  step; it lifts and lowers its head to graze. */
export function daleSheep(s = 1): P {
  const g = new THREE.Group() as P;
  add(g, new THREE.Mesh(new THREE.SphereGeometry(.3 * s, 9, 7), mat('#C9C2B4')), 0, .5 * s, 0).scale.set(1.35, .95, .95);
  const head = add(g, box(.18 * s, .18 * s, .16 * s, '#3A352E'), .4 * s, .5 * s, 0);
  add(head, box(.14 * s, .12 * s, .12 * s, '#3A352E'), .12 * s, -.04 * s, 0);
  for (const z of [-.09, .09]) add(head, new THREE.Mesh(new THREE.TorusGeometry(.09 * s, .025 * s, 5, 9, Math.PI * 1.5), mat('#B6A88A')), 0, .08 * s, z * s).rotation.y = Math.PI / 2;
  for (const [x, z] of [[.18, -.13], [.18, .13], [-.2, -.13], [-.2, .13]] as [number, number][])
    add(g, box(.07 * s, .34 * s, .07 * s, '#3A352E'), x * s, .2 * s, z * s);
  g.userData.tick = (t: number) => { head.rotation.z = -.35 + Math.abs(Math.sin(t * .35)) * .35; };
  return g;
}

/** A closed round at a steady pace with two short halts a lap: the pit pony's handler in the dale yard. The
 *  pony used to trail a walker up and down a 3.4-unit lane and swing round behind him at every turn, which put
 *  it through the tea room's back wall and made it jump sixfold in speed (walkthrough item 20, 2026-09-23). On
 *  a ring nobody turns back, so the pony simply follows the same curve at the same pace. `lead` is how far
 *  along the curve the walker is ahead of the returned position function's zero. */
export function ringWalk(p: P, curve: THREE.CatmullRomCurve3, pace: number, halt = 2.2) {
  const length = curve.getLength(), speed = pace * 100 * (p.userData.pace as number), lap = length / speed;
  const stops = [.18, .68], period = lap + halt * stops.length;
  /** Distance along the ring at time t: walking, with a halt at each of the two stops. */
  const along = (t: number) => {
    let q = ((t % period) + period) % period, d = 0;
    for (const s of stops) {
      const walk = (s * length - d) / speed;
      if (q < walk) return d + q * speed;
      q -= walk; d = s * length;
      if (q < halt) return d;
      q -= halt;
    }
    return Math.min(length, d + q * speed);
  };
  const state = { along: 0, length };
  p.userData.ringState = state;
  const tick = (t: number, dt: number) => {
    const d = along(t), u = d / length;
    const at = curve.getPointAt(u), ahead = curve.getPointAt((u + .002) % 1);
    p.position.set(at.x, .034, at.z); p.rotation.y = Math.atan2(ahead.x - at.x, ahead.z - at.z);
    state.along = d;
    p.userData.tick?.(t, dt);
  };
  return tick;
}

/** The pony on the same ring, 1.4 behind its handler along the curve, facing the way it goes. */
export function ringPony(pony: P, leader: P, curve: THREE.CatmullRomCurve3, group: THREE.Object3D) {
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 5), mat('#8A7A5A')); rope.name = 'pony-lead'; group.add(rope);
  const hand = new THREE.Vector3(), halter = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), was = new THREE.Vector3();
  let first = true;
  return (t: number, dt: number) => {
    const s = leader.userData.ringState as { along: number; length: number } | undefined; if (!s) return;
    const u = (((s.along - 1.4) / s.length) % 1 + 1) % 1;
    const at = curve.getPointAt(u), ahead = curve.getPointAt((u + .002) % 1);
    was.copy(pony.position);
    pony.position.set(at.x, .034, at.z);
    // The head (local +x) points the way the pony actually went since the last frame; on the ring that is the
    // curve's own direction, and after a jump in time it is still the way it moved.
    const mx = at.x - was.x, mz = at.z - was.z;
    pony.rotation.y = !first && Math.hypot(mx, mz) > 1e-5 ? Math.atan2(-mz, mx) : first ? Math.atan2(-(ahead.z - at.z), ahead.x - at.x) : pony.rotation.y;
    first = false;
    pony.userData.tick?.(t, dt);
    hand.set(0, .6, 0); leader.localToWorld(hand); group.worldToLocal(hand);
    halter.set(.86, .72, 0); pony.localToWorld(halter); group.worldToLocal(halter);
    rope.position.copy(hand).add(halter).multiplyScalar(.5);
    rope.scale.y = Math.max(.01, hand.distanceTo(halter));
    rope.quaternion.setFromUnitVectors(up, halter.clone().sub(hand).normalize());
  };
}
