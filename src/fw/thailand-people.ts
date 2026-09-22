/** Thai residents of about 1880 to 1910 — the later reign of Chulalongkorn — in everyday working clothes,
 *  with footsteps driven by distance travelled. The eight profiles are the table in docs/thailand-research.md
 *  section 1.5; colours use the palette names in `thailand-architecture.ts`.
 *
 *  Three things that section says an image tool supplies unasked are absent here on purpose: the gold-spired
 *  `chada` and the sequinned classical costume, the hill-tribe silver-and-embroidery dress, and above all the
 *  conical Vietnamese `nón lá`, which belongs to `hanoi` and `mekong` on the other half of this table. The
 *  Siamese sun hat is the flatter, wider, woven `ngob`, and it is built as one.
 */
import * as THREE from 'three';
import { person, wear, add, box, cyl, ball, cone, mat, C, type P } from './props';
import { TH } from './thailand-architecture';

type Dress = 'bareChest' | 'jacket' | 'sabai' | 'silkSabai' | 'frogged' | 'blouse' | 'baju' | 'kebaya' | 'robe';
type Headwear = 'ngob' | 'phaKhaoMa' | 'crop' | 'bun' | 'selendang' | 'songkok' | 'skullCap' | 'queue' | 'shaven';
type Legs = 'chongKraben' | 'sarong' | 'sinh' | 'trousers';
type Resident = {
  name: string; dress: Dress; head: Headwear; legs: Legs; outer: string; shirt: string; lower: string; sash: string;
  height: number; build: number; pace: number; stride: number; elderly?: boolean; woman?: boolean;
  carry?: 'basket' | 'tray' | 'pole' | 'bundle';
};
const INDIGO = '#2E4E7E', SKIN_BARE = '#C48F68', CHECK = '#B8443A';

/** The eight profiles of docs/thailand-research.md section 1.5, in the order that table lists them. */
export const RESIDENTS: Resident[] = [
  { name: 'market-woman', dress: 'sabai', head: 'ngob', legs: 'chongKraben', outer: INDIGO, shirt: '#EFE6D6', lower: INDIGO, sash: TH.lacquerRed, height: .94, build: .93, pace: .58, stride: .56, woman: true, carry: 'basket' },
  { name: 'working-man', dress: 'bareChest', head: 'phaKhaoMa', legs: 'chongKraben', outer: '#8A6338', shirt: SKIN_BARE, lower: '#C9B489', sash: CHECK, height: 1.02, build: 1.0, pace: .68, stride: .68, carry: 'pole' },
  { name: 'compound-woman', dress: 'silkSabai', head: 'crop', legs: 'chongKraben', outer: '#8E4F6E', shirt: '#F2E7D2', lower: '#7A3F5C', sash: TH.chediGold, height: .96, build: .90, pace: .50, stride: .54, woman: true, carry: 'tray' },
  { name: 'teochew-cook', dress: 'frogged', head: 'queue', legs: 'trousers', outer: '#2F3238', shirt: '#EDE5D4', lower: '#33363C', sash: '#F4F0E6', height: 1.00, build: 1.04, pace: .72, stride: .62 },
  { name: 'isan-grower', dress: 'blouse', head: 'phaKhaoMa', legs: 'sinh', outer: INDIGO, shirt: '#DFD6BE', lower: '#27456E', sash: '#8A6338', height: .95, build: .98, pace: .54, stride: .56, woman: true, carry: 'bundle' },
  { name: 'lanna-woman', dress: 'blouse', head: 'bun', legs: 'sinh', outer: '#9C2B23', shirt: '#F1E8D6', lower: '#3E5E4A', sash: TH.chediGold, height: .97, build: .92, pace: .52, stride: .58, woman: true, carry: 'tray' },
  { name: 'malay-household', dress: 'baju', head: 'selendang', legs: 'sarong', outer: '#2F7D72', shirt: '#EFE8D8', lower: '#7A4A78', sash: '#C79B3B', height: .98, build: .96, pace: .56, stride: .60, woman: true },
  { name: 'baba-merchant', dress: 'kebaya', head: 'bun', legs: 'sarong', outer: '#3F6B8F', shirt: '#F4EFE2', lower: '#8A4A3A', sash: TH.lacquerRed, height: .99, build: .94, pace: .62, stride: .60, carry: 'bundle' },
];
/** Two more the lanes need and the eight do not cover: the Yunnanese muleteer of the caravan road, and the
 *  monk on the dawn alms round. Neither is a street profile, so they are picked by name, not by index. */
export const MULETEER: Resident = { name: 'chin-haw-muleteer', dress: 'jacket', head: 'skullCap', legs: 'trousers', outer: '#2A2F3A', shirt: '#E3DAC6', lower: '#2A2F3A', sash: '#6E5C3C', height: 1.04, build: 1.06, pace: .48, stride: .66 };
export const MONK: Resident = { name: 'monk', dress: 'robe', head: 'shaven', legs: 'sarong', outer: TH.watOrange, shirt: TH.watOrange, lower: TH.watOrange, sash: TH.watOrange, height: 1.0, build: .95, pace: .44, stride: .52 };

type Leg = { thigh: THREE.Group; shin: THREE.Group };
type Rig = { upper: THREE.Group; hipY: number; figureScale: number; legs: { left: Leg; right: Leg }; arms: { left: THREE.Group; right: THREE.Group; hand: number } };

/** One resident. `working` picks the standing trades (no carried load, a work cloth) for a stand or a stall.
 *  Every seventh resident is a child, which the research says is right for every outdoor room here. */
export function thailandResident(index: number, working = false): P {
  const seed = Math.abs(Math.round(index));
  const base = working ? RESIDENTS[[1, 0, 3, 4, 6, 5][seed % 6]]
    : seed % 17 === 11 ? MULETEER
      : seed % 23 === 7 ? MONK
        : RESIDENTS[seed % RESIDENTS.length];
  const child = !working && base !== MONK && seed % 7 === 6;
  const style: Resident = child
    ? { ...base, height: .70, build: .80, pace: .78, stride: .44, elderly: false, carry: undefined, woman: base.woman, head: base.head === 'ngob' ? 'ngob' : 'crop', dress: base.dress === 'sabai' || base.dress === 'silkSabai' ? 'blouse' : base.dress }
    : base;
  const p = person(style.shirt), rig = p.userData as unknown as Rig, s = rig.figureScale;
  const hair = style.elderly ? '#A9A296' : '#161211';
  const skin = ['#C48F68', '#D2A078', '#B57F58', '#E0B48C'][Math.floor(seed / 2) % 4];
  p.traverse(o => { if (o instanceof THREE.Mesh) { const m = o.material as THREE.MeshStandardMaterial; if (m.color.getHexString() === C.skin.slice(1)) m.color.set(skin); } });
  const hairCap = rig.upper.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry && o.position.z < 0);
  if (hairCap instanceof THREE.Mesh) (hairCap.material as THREE.MeshStandardMaterial).color.set(style.head === 'shaven' ? skin : hair);

  // Leg cloth belongs to the articulated legs so it bends at the knee. A chong kraben is wrapped, drawn
  // between the legs and tucked behind, so it ends above the knee and leaves the shin bare; a sarong and a
  // sinh are tubes to the ankle, so the shin is cloth to the foot.
  for (const leg of [rig.legs.left, rig.legs.right]) {
    leg.thigh.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o.geometry instanceof THREE.BoxGeometry) return;
      const shin = o.parent === leg.shin;
      const colour = style.legs === 'chongKraben' ? (shin ? skin : style.lower) : style.lower;
      (o.material as THREE.MeshStandardMaterial).color.set(colour);
      if (o.parent === leg.thigh) o.scale.set(style.legs === 'chongKraben' ? 1.5 : 1.25, 1, style.legs === 'chongKraben' ? 1.45 : 1.15);
      if (shin && style.legs !== 'chongKraben') o.scale.set(1.3, 1, 1.25);
    });
    // Everybody in this area walks barefoot except the Baba merchant in leather shoes and the Teochew cook
    // in wooden clogs, so the shoe box takes the skin or the clog rather than a European boot.
    const shoe = leg.shin.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry);
    if (shoe instanceof THREE.Mesh) (shoe.material as THREE.MeshStandardMaterial).color.set(style.name === 'baba-merchant' ? '#3A2A1E' : style.name === 'teochew-cook' ? '#9A7A4E' : skin);
  }

  const garment = (o: THREE.Object3D, x: number, y: number, z: number) => wear(p, o, x * s, y * s, z * s);
  // The lower cloth: a chong kraben tucked at the waist, or a sarong / sinh tube down to the ankle.
  if (style.legs === 'sarong' || style.legs === 'sinh') {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.175 * s, .23 * s, .42 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .26, 0);
    if (style.legs === 'sinh') garment(cyl(.228 * s, .232 * s, .07 * s, style.sash, 12), 0, .075, 0);   // the separate woven hem band the sinh is known by
  } else {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .19 * s, .20 * s, 12, 1, true), mat(style.lower, { side: THREE.DoubleSide })), 0, .38, 0);
    garment(box(.13 * s, .22 * s, .05 * s, style.lower), 0, .40, -.17);   // the tail of the cloth tucked up behind
  }
  garment(cyl(.16 * s, .16 * s, .07 * s, style.sash, 10), 0, .465, 0);

  switch (style.dress) {
    case 'bareChest':
      // Bare to the waist with the pha khao ma over one shoulder: the everyday dress of a paddler or a field hand.
      garment(box(.10 * s, .46 * s, .06 * s, CHECK), -.13, .66, .02).rotation.z = -.22;
      break;
    case 'sabai':
      garment(box(.20 * s, .36 * s, .05 * s, style.outer), 0, .64, .155);
      garment(box(.34 * s, .16 * s, .10 * s, style.outer), 0, .80, -.05);
      garment(box(.09 * s, .40 * s, .06 * s, style.sash), .14, .68, .06).rotation.z = .2;   // the sabai over one shoulder
      break;
    case 'silkSabai':
      garment(cyl(.175 * s, .152 * s, .28 * s, style.outer, 10), 0, .63, 0);
      garment(box(.09 * s, .44 * s, .06 * s, style.sash), .14, .70, .07).rotation.z = .2;
      garment(new THREE.Mesh(new THREE.TorusGeometry(.055 * s, .014 * s, 5, 10), mat(TH.chediGold)), -.19, .49, 0).rotation.y = Math.PI / 2;   // gold at the wrist
      break;
    case 'frogged':
      garment(cyl(.19 * s, .165 * s, .36 * s, style.outer, 10), 0, .64, 0);
      for (const y of [.56, .66, .76]) garment(box(.05 * s, .03 * s, .02 * s, style.sash), 0, y, .19);   // the frogging down the front
      garment(box(.22 * s, .38 * s, .035 * s, style.sash), 0, .46, .18);   // the cook's cloth apron
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .045 * s, .22 * s, style.outer, 6), x, .69, 0);
      break;
    case 'jacket':
      garment(cyl(.19 * s, .165 * s, .38 * s, style.outer, 10), 0, .65, 0);
      garment(box(.06 * s, .30 * s, .02 * s, style.shirt), 0, .66, .19);
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .045 * s, .24 * s, style.outer, 6), x, .69, 0);
      break;
    case 'blouse':
      garment(cyl(.175 * s, .152 * s, .32 * s, style.outer, 10), 0, .645, 0);
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .042 * s, .26 * s, style.outer, 6), x, .68, 0);   // the long sleeves of a northern blouse
      break;
    case 'baju':
      garment(new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .215 * s, .46 * s, 12, 1, true), mat(style.outer, { side: THREE.DoubleSide })), 0, .60, 0);
      for (const x of [-.175, .175]) garment(cyl(.052 * s, .046 * s, .28 * s, style.outer, 6), x, .68, 0);
      break;
    case 'kebaya':
      garment(cyl(.172 * s, .15 * s, .34 * s, style.outer, 10), 0, .65, 0);
      for (const y of [.58, .70]) garment(new THREE.Mesh(new THREE.TorusGeometry(.03 * s, .009 * s, 4, 8), mat(TH.chediGold)), 0, y, .16);   // the brooch chain down the front
      for (const x of [-.17, .17]) garment(cyl(.05 * s, .042 * s, .26 * s, style.outer, 6), x, .68, 0);
      break;
    case 'robe':
      // One cloth wound over the left shoulder and under the right arm, which is what makes a robe read as a robe.
      garment(new THREE.Mesh(new THREE.CylinderGeometry(.19 * s, .235 * s, .56 * s, 12, 1, true), mat(style.outer, { side: THREE.DoubleSide })), 0, .58, 0);
      garment(box(.13 * s, .44 * s, .07 * s, '#B1541F'), -.14, .70, .03).rotation.z = -.26;
      break;
  }
  if (working && style.dress !== 'frogged') garment(box(.21 * s, .34 * s, .035 * s, '#DDD3BB'), 0, .47, .18);

  switch (style.head) {
    case 'ngob':
      // The Siamese sun hat: flat, wide and woven, a shallow disc on a low crown. Never a cone.
      garment(cyl(.36 * s, .38 * s, .035 * s, TH.bambooPale, 14), 0, 1.15, -.01);
      garment(cyl(.15 * s, .17 * s, .10 * s, TH.bambooPale, 10), 0, 1.20, -.01);
      garment(new THREE.Mesh(new THREE.TorusGeometry(.20 * s, .015 * s, 4, 12), mat('#A88D5A')), 0, 1.155, -.01).rotation.x = Math.PI / 2;
      break;
    case 'phaKhaoMa':
      // The checked cloth wound round the head, its end hanging at the nape.
      garment(cyl(.155 * s, .16 * s, .11 * s, CHECK, 10), 0, 1.14, -.01);
      garment(box(.10 * s, .20 * s, .05 * s, CHECK), .10, 1.03, -.09);
      break;
    case 'crop':
      garment(ball(.148 * s, hair, 9), 0, 1.09, -.02).scale.set(1.02, .68, 1.0);   // the short dok krathum crop of the period
      break;
    case 'bun':
      garment(ball(.09 * s, hair, 8), 0, 1.14, -.09).scale.set(1, .9, .9);
      garment(ball(.045 * s, '#F2E0C8', 6), .085, 1.15, -.05);   // fresh flowers pinned in
      break;
    case 'selendang':
      garment(ball(.175 * s, style.sash, 10), 0, 1.10, -.07).scale.set(1.04, 1.10, .74);
      for (const x of [-.148, .148]) garment(box(.055 * s, .28 * s, .19 * s, style.sash), x, 1.02, -.04);
      garment(box(.26 * s, .22 * s, .07 * s, style.sash), 0, .92, -.15);
      break;
    case 'songkok': garment(cyl(.145 * s, .148 * s, .13 * s, '#2A2F3A', 12), 0, 1.20, -.01); break;
    case 'skullCap': garment(cyl(.132 * s, .142 * s, .075 * s, '#F4F0E6', 10), 0, 1.185, -.02); break;
    case 'queue':
      garment(cyl(.02 * s, .016 * s, .40 * s, hair, 5), 0, .94, -.16);   // the plaited queue down the back
      garment(ball(.148 * s, hair, 9), 0, 1.09, -.02).scale.set(1, .7, 1);
      break;
    case 'shaven': break;
  }

  const carry = working || child ? undefined : style.carry;
  const leftHome = carry === 'basket' || carry === 'bundle' ? -.85 : carry === 'pole' ? -1.42 : 0;
  const rightHome = carry === 'tray' ? -1.35 : carry === 'pole' ? -1.42 : 0;
  if (carry === 'pole') {
    // A shoulder pole, the way the research describes it: across one shoulder, a load swinging at each end.
    const pole = add(rig.upper, cyl(.022 * s, .022 * s, 1.7 * s, '#B9A46A', 5), .17 * s, .46 * s, .04 * s);
    pole.rotation.x = Math.PI / 2;
    for (const z of [-.72, .72]) {
      add(rig.upper, cyl(.012 * s, .012 * s, .34 * s, '#8A6338', 4), .17 * s, .30 * s, z * s);
      const basket = add(rig.upper, cyl(.21 * s, .15 * s, .16 * s, TH.bambooPale, 9), .17 * s, .10 * s, z * s);
      for (let k = 0; k < 4; k++) add(basket, ball(.075 * s, ['#7FB069', '#E8563F', '#E0A52C', '#8FC26A'][k], 6), (k % 2 - .5) * .16 * s, .10 * s, (Math.floor(k / 2) - .5) * .16 * s);
    }
  } else if (carry) {
    const hand = carry === 'tray' ? rig.arms.right : rig.arms.left;
    const load = add(hand, new THREE.Group(), 0, rig.arms.hand, 0); load.scale.setScalar(s);
    load.rotation.x = -(carry === 'tray' ? rightHome : leftHome);
    if (carry === 'basket') {
      add(load, cyl(.16, .12, .21, TH.bambooPale, 10), 0, -.21, 0);
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.15, .018, 5, 12, Math.PI), mat('#8A6D44')), 0, -.11, 0);
      for (const [i, x] of [-.08, 0, .08].entries()) add(load, ball(.048, ['#E0842C', '#6F9B57', '#C9302A'][i], 7), x, -.09, .015);
    } else if (carry === 'tray') {
      add(load, cyl(.21, .22, .045, '#9C2B23', 12), 0, -.06, 0);   // a lacquer tray, carried flat
      for (const [i, a] of [0, 2.1, 4.2].entries()) add(load, cyl(.055, .06, .055, i % 2 ? '#F4EFE2' : '#C79B3B', 8), Math.cos(a) * .1, -.01, Math.sin(a) * .1);
    } else {
      const bundle = add(load, ball(.15, '#C9B489', 8), .02, -.12, 0); bundle.scale.set(1, .82, 1.2);
      add(load, cyl(.02, .02, .10, '#6E5C3C', 5), .02, .02, 0);
    }
  }

  p.scale.set(style.build, style.height, 1);
  p.userData.thaiResident = true; p.userData.profile = style.name; p.userData.pace = style.pace;
  p.userData.stride = style.stride; p.userData.isWalking = false; p.userData.child = child; p.userData.woman = !!style.woman;
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
    rig.arms.left.rotation.x = leftHome - sw * (carry && carry !== 'tray' ? 0 : .62);
    rig.arms.right.rotation.x = rightHome + sw * (carry === 'tray' || carry === 'pole' ? 0 : .62);
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
  p.userData.walk = undefined;   // Thailand uses the movement observer instead of the shared time-based gait.
  if (!working) p.userData.tick = pose;
  return p;
}
/** The name the Stage B module contract uses. One builder, two names, so neither owner has to change a call. */
export const thaiResident = thailandResident;

export type WalkState = { from: [number, number]; to: [number, number]; u: number; forward: boolean; turn: number; facing: number };

/** Constant pace along a straight segment, a real stop, then a gradual turn. `lift(u)` raises the walker over
 *  a bridge deck. Steps are matched to distance by the observer in `thailandResident`, never to the clock. */
export function thailandWalk(p: P, from: [number, number], to: [number, number], range: [number, number], seed: number, lift?: (u: number) => number) {
  const [lo, hi] = range, dx = to[0] - from[0], dz = to[1] - from[1], angle = Math.atan2(dx, dz);
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

/** A water buffalo: grey, heavy, wide horns swept back over the neck, its head on local +x so it leads with it.
 *  Its legs step with the distance it covers, and a planted hoof travels backward under the body for most of
 *  the cycle and swings forward quickly, which is what makes it read as stepping rather than sliding. */
export function thaiBuffalo(): P {
  const g = new THREE.Group() as P, hide = '#5B5B5E', dark = '#3E3E42', horn = '#C9BFA6';
  add(g, box(1.28, .62, .56, hide), 0, .78, 0);
  add(g, box(.40, .40, .34, hide), .78, .86, 0);                       // the head, forward on +x
  add(g, box(.26, .20, .26, dark), .98, .74, 0);                       // the muzzle
  for (const z of [-.12, .12]) add(g, box(.08, .16, .06, dark), .78, 1.10, z);
  for (const side of [-1, 1]) {
    // The horn sweeps out and back over the neck: two segments rather than one straight bar.
    const a = add(g, box(.34, .07, .07, horn), .74, 1.06, side * .2); a.rotation.y = side * .5; a.rotation.z = .18;
    const b = add(g, box(.30, .065, .065, horn), .52, 1.16, side * .38); b.rotation.y = side * 1.1; b.rotation.z = .1;
  }
  add(g, box(.5, .16, .1, dark), .3, 1.06, 0);                          // the hump over the shoulder
  add(g, box(.06, .34, .06, dark), -.68, .62, 0).rotation.x = .26;      // the tail
  const legs: THREE.Group[] = [];
  for (const [i, [x, z]] of ([[.42, -.19], [.42, .19], [-.42, -.19], [-.42, .19]] as [number, number][]).entries()) {
    const leg = new THREE.Group(); leg.position.set(x, .56, z); g.add(leg); legs.push(leg);
    leg.name = i === 0 ? 'buffalo-leg' : `buffalo-leg-${i}`;
    add(leg, box(.14, .56, .14, i < 2 ? hide : dark), 0, -.28, 0);
    add(leg, box(.16, .07, .16, '#2A2622'), 0, -.53, .01);
  }
  let last: THREE.Vector3 | undefined, phase = 0;
  const A = .42, STANCE = .65;
  g.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? g.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(g.position);
    if (moved > 1e-4) phase += moved / .78;
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

/** The buffalo trails 1.5 behind its handler along the direction of travel, on a halter rope, and walks round
 *  to be behind again while the handler turns. It never enters the water: it follows a lane that does not. */
export function followBuffalo(buffalo: P, leader: P, group: THREE.Object3D) {
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(.013, .013, 1, 5), mat('#8A7A5A')); rope.name = 'buffalo-halter'; group.add(rope);
  const hand = new THREE.Vector3(), halter = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  // The head follows the ground the animal actually covers, not the lane's direction. Taking it from the lane
  // is what made Spain's mill mule circle its stone tail first: while the handler turns at the end of a lane
  // the buffalo walks round to the other side, and for those two seconds the lane's direction is the opposite
  // of the way it is really going.
  let facing: number | null = null;
  const was = new THREE.Vector3();
  return (t: number, dt: number) => {
    const s = leader.userData.walkState as WalkState | undefined; if (!s) return;
    const dx = s.to[0] - s.from[0], dz = s.to[1] - s.from[1], len = Math.hypot(dx, dz) || 1;
    const side = (s.forward ? 1 : -1) * (1 - 2 * s.turn * s.turn * (3 - 2 * s.turn));
    const u = s.u - 1.5 * side / len;
    was.copy(buffalo.position);
    buffalo.position.set(s.from[0] + dx * u, .034, s.from[1] + dz * u);
    const mx = buffalo.position.x - was.x, mz = buffalo.position.z - was.z;
    if (Math.hypot(mx, mz) > 1e-5) {
      const want = Math.atan2(-mz, mx);   // the head is local +x, so it points the way the animal is going
      if (facing === null) facing = want;
      else {
        let d = want - facing; d = Math.atan2(Math.sin(d), Math.cos(d));
        // A lane bends by a few degrees a frame and is eased; turning at the end of one is a real turn and is
        // taken at once, because a head that lags a reversal is an animal walking backward.
        facing = Math.abs(d) > .5 ? want : facing + d * Math.min(1, dt * 6);
      }
    }
    buffalo.rotation.y = facing ?? Math.atan2(-dz, dx);
    buffalo.userData.tick?.(t, dt);
    hand.set(0, .55, 0); leader.localToWorld(hand); group.worldToLocal(hand);
    halter.set(1.0, .86, 0); buffalo.localToWorld(halter); group.worldToLocal(halter);
    rope.position.copy(hand).add(halter).multiplyScalar(.5);
    rope.scale.y = Math.max(.01, hand.distanceTo(halter));
    rope.quaternion.setFromUnitVectors(up, halter.clone().sub(hand).normalize());
  };
}

void cone;
