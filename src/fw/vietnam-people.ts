/** Vietnamese residents of 1900 to 1931 in working clothes, with footsteps driven by the distance travelled.
 *  The seven profiles follow docs/vietnam-research.md section 7: the four-panel áo tứ thân and the yếm in the
 *  north, the áo bà ba in the south, the five-part áo ngũ thân at Huế, the nón lá where work needs shade, the
 *  flat fringed nón quai thao on a northern market day, the checked khăn rằn in the delta, and plain tunic and
 *  trousers on everyone who is working. No modern fitted áo dài: that is a 1930s redesign, outside the band.
 *
 *  The gait is the one `spain-people.ts` uses and the harnesses check: a figure that translates swings its
 *  legs in proportion to the distance it covers, a figure that stops stops stepping, and the whole body is
 *  lowered each frame so the supporting shoe stays on the walking surface.
 */
import * as THREE from 'three';
import { person, wear, add, box, cyl, ball, cone, mat, C, type P } from './props';
import { VN } from './vietnam-architecture';

type Dress = 'aoTuThan' | 'aoBaBa' | 'aoNguThan' | 'tunic' | 'longGown' | 'shortShirt';
type Headwear = 'nonLa' | 'quaiThao' | 'khanVan' | 'khanRan' | 'hair' | 'skullcap' | 'turbanCloth';
type Legs = 'trousers' | 'panelSkirt' | 'rolled';
export type Carry = 'pole' | 'tray' | 'basket' | 'jar' | 'bicycle';
type Resident = {
  name: string; dress: Dress; head: Headwear; legs: Legs; outer: string; shirt: string; trousers: string; sash: string;
  height: number; build: number; pace: number; stride: number; elderly?: boolean; beard?: boolean; woman?: boolean;
  carry?: Carry;
};

const INDIGO = '#2E3F5C', NAU = '#5B4433', CHECK_RED = '#B03A2E', SANDAL = '#4A3728';
/** Seven clothing profiles as data, in the order the research lists them: Hanoi first, the delta last. */
export const VN_RESIDENTS: Resident[] = [
  { name: 'hanoi-vendor', dress: 'aoTuThan', head: 'quaiThao', legs: 'panelSkirt', outer: NAU, shirt: '#E9DCC4', trousers: '#2C2A2E', sash: CHECK_RED, height: .95, build: .93, pace: .54, stride: .56, woman: true, carry: 'pole' },
  { name: 'northern-farmer', dress: 'tunic', head: 'nonLa', legs: 'rolled', outer: NAU, shirt: '#D9CDB2', trousers: '#3A3730', sash: '#8A6A3A', height: 1.0, build: 1.0, pace: .62, stride: .64 },
  { name: 'hue-woman', dress: 'aoNguThan', head: 'khanVan', legs: 'panelSkirt', outer: '#6C4B6E', shirt: '#F1E8D6', trousers: '#3B3A44', sash: '#C9A24A', height: .97, build: .9, pace: .46, stride: .52, woman: true, carry: 'tray' },
  { name: 'hoian-porter', dress: 'shortShirt', head: 'turbanCloth', legs: 'rolled', outer: INDIGO, shirt: '#CFC6B0', trousers: '#2F3D4C', sash: '#8A6A3A', height: 1.04, build: 1.08, pace: .68, stride: .7, carry: 'jar' },
  { name: 'saigon-worker', dress: 'aoBaBa', head: 'khanRan', legs: 'trousers', outer: '#E7DFCC', shirt: '#E7DFCC', trousers: '#3A3A44', sash: '#B7B2A4', height: 1.01, build: .97, pace: .72, stride: .66, carry: 'bicycle' },
  { name: 'cholon-merchant', dress: 'longGown', head: 'skullcap', legs: 'trousers', outer: '#3B4A5C', shirt: '#EFE6D6', trousers: '#2B2A2E', sash: '#8E5A3A', height: 1.03, build: 1.04, pace: .5, stride: .58, elderly: true, beard: true },
  { name: 'delta-woman', dress: 'aoBaBa', head: 'nonLa', legs: 'rolled', outer: '#3F5E6B', shirt: '#DCD2BC', trousers: '#2E3B33', sash: CHECK_RED, height: .94, build: .95, pace: .58, stride: .54, woman: true, carry: 'basket' },
];

type Leg = { thigh: THREE.Group; shin: THREE.Group };
type Rig = { upper: THREE.Group; hipY: number; figureScale: number; legs: { left: Leg; right: Leg }; arms: { left: THREE.Group; right: THREE.Group; hand: number } };

/** A nón lá: the cone and the rim ring, in split palm leaf over a bamboo frame. */
function nonLa(g: THREE.Object3D, s: number, y: number) {
  add(g, cone(.33 * s, .26 * s, '#E0CB93', 12), 0, y + .06 * s, -.01 * s);
  add(g, cyl(.335 * s, .335 * s, .02 * s, '#C9AD68', 14), 0, y - .05 * s, -.01 * s);
  for (let i = 0; i < 3; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(.2 * s + i * .06 * s, .008 * s, 4, 14), mat('#B79E62')), 0, y - .02 * s + i * .03 * s, -.01 * s).rotation.x = Math.PI / 2;
}
/** A period bicycle whose wheels turn with the distance it covers; it is wheeled, never ridden. */
function wheeledBicycle(frame = '#2E3848'): P {
  const g = new THREE.Group() as P, wheels: THREE.Group[] = [];
  for (const z of [-.6, .6]) {
    const wheel = new THREE.Group(); wheel.position.set(0, .34, z); g.add(wheel); wheels.push(wheel);
    add(wheel, new THREE.Mesh(new THREE.TorusGeometry(.32, .022, 5, 16), mat('#2E2B2A'))).rotation.y = Math.PI / 2;
    for (let i = 0; i < 8; i++) add(wheel, box(.01, .6, .01, '#B7BEC4')).rotation.set(0, 0, i * .39);
    add(wheel, cyl(.04, .04, .05, '#B7BEC4', 8)).rotation.x = Math.PI / 2;
  }
  add(g, cyl(.022, .022, 1.0, frame, 5), 0, .48, 0).rotation.x = Math.PI / 2 + .28;
  add(g, cyl(.022, .022, .7, frame, 5), 0, .58, -.28).rotation.x = -.5;
  add(g, cyl(.022, .022, .5, frame, 5), 0, .5, .46).rotation.x = .35;
  add(g, box(.05, .04, .22, VN.goDam), 0, .78, -.32);
  add(g, cyl(.018, .018, .44, '#2E2B2A', 5), 0, .86, .4).rotation.z = Math.PI / 2;
  add(g, box(.3, .03, .22, VN.go), 0, .66, -.6);
  add(g, cyl(.06, .05, .2, '#C9B06A', 8), 0, .76, -.6);                   // a basket of greens on the rack
  g.userData.roll = (distance: number) => { for (const w of wheels) w.rotation.x = distance / .32; };
  return g;
}

/** One resident. `working` picks the standing trades — no carried load, sleeves pushed back — for a stand or
 *  a doorway. Every thirteenth seed on a lane is a child, which keeps the seed that carries a load an adult. */
export function vietnamResident(seed: number, working = false): P {
  const base = VN_RESIDENTS[working ? [1, 4, 0, 3, 6, 2][seed % 6] : seed % VN_RESIDENTS.length];
  const child = !working && seed % 13 === 8;
  const style: Resident = child
    ? { ...base, height: .68, build: .8, pace: .8, stride: .44, elderly: false, beard: false, carry: undefined, woman: false, head: base.head === 'quaiThao' || base.head === 'skullcap' ? 'hair' : base.head, dress: 'shortShirt', legs: 'rolled' }
    : base;
  const p = person(style.shirt), rig = p.userData as unknown as Rig, s = rig.figureScale;
  const hair = style.elderly ? '#A8A096' : '#1F1A18';
  const skin = ['#D9A880', '#E3BC96', '#C48F68', '#EAC6A2'][Math.floor(seed / 2) % 4];
  p.traverse(o => { if (o instanceof THREE.Mesh) { const m = o.material as THREE.MeshStandardMaterial; if (m.color.getHexString() === C.skin.slice(1)) m.color.set(skin); } });
  const hairCap = rig.upper.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry && o.position.z < 0);
  if (hairCap instanceof THREE.Mesh) (hairCap.material as THREE.MeshStandardMaterial).color.set(hair);
  // Leg cloth belongs to the articulated legs so it bends at the knee; rolled trousers leave the shin bare.
  for (const leg of [rig.legs.left, rig.legs.right]) {
    leg.thigh.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o.geometry instanceof THREE.BoxGeometry) return;
      const shin = o.parent === leg.shin;
      (o.material as THREE.MeshStandardMaterial).color.set(style.legs === 'rolled' && shin ? skin : style.trousers);
      if (o.parent === leg.thigh) o.scale.set(style.legs === 'panelSkirt' ? 1.15 : 1.5, 1, style.legs === 'panelSkirt' ? 1.1 : 1.35);
    });
    const shoe = leg.shin.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry);
    if (shoe instanceof THREE.Mesh) (shoe.material as THREE.MeshStandardMaterial).color.set(style.legs === 'rolled' ? SANDAL : '#2B2420');
  }
  const garment = (o: THREE.Object3D, x: number, y: number, z: number) => wear(p, o, x * s, y * s, z * s);
  garment(cyl(.163 * s, .163 * s, .07 * s, style.sash, 10), 0, .455, 0);                              // the waist band
  if (style.dress === 'aoTuThan') {
    // four panels: a dark open gown over a bright yếm, the front two panels tied at the waist
    garment(cyl(.185 * s, .155 * s, .36 * s, style.outer, 10), 0, .64, 0);
    garment(box(.2 * s, .3 * s, .03 * s, '#C94F3A'), 0, .63, .168);                                   // the yếm shows at the opening
    for (const sx of [-1, 1]) garment(box(.1 * s, .44 * s, .04 * s, style.outer), sx * .12 * s, .34, .16);
    garment(box(.38 * s, .16 * s, .12 * s, '#6C4B52'), 0, .8, -.08);
  } else if (style.dress === 'aoBaBa') {
    garment(cyl(.182 * s, .16 * s, .34 * s, style.outer, 10), 0, .635, 0);
    garment(box(.05 * s, .32 * s, .02 * s, '#B7B2A4'), 0, .64, .18);                                  // the button strip
    for (const x of [-.17, .17]) garment(cyl(.05 * s, .045 * s, .24 * s, style.outer, 6), x, .69, 0);
  } else if (style.dress === 'aoNguThan') {
    garment(cyl(.19 * s, .17 * s, .38 * s, style.outer, 10), 0, .65, 0);
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.17 * s, .24 * s, .34 * s, 12, 1, true), mat(style.outer, { side: THREE.DoubleSide })), 0, .3, 0);
    garment(box(.07 * s, .34 * s, .025 * s, style.sash), 0, .66, .19);
    for (const x of [-.175, .175]) garment(cyl(.055 * s, .05 * s, .26 * s, style.outer, 6), x, .69, 0);
  } else if (style.dress === 'longGown') {
    garment(cyl(.19 * s, .165 * s, .38 * s, style.outer, 10), 0, .65, 0);
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.165 * s, .215 * s, .3 * s, 12, 1, true), mat(style.outer, { side: THREE.DoubleSide })), 0, .33, 0);
    for (const x of [-.175, .175]) garment(cyl(.055 * s, .05 * s, .28 * s, style.outer, 6), x, .69, 0);
  } else if (style.dress === 'tunic') {
    garment(cyl(.18 * s, .155 * s, .32 * s, style.outer, 10), 0, .64, 0);
    garment(box(.16 * s, .05 * s, .1 * s, style.sash), 0, .88, .09);                                  // the neck cloth
  } else {
    garment(cyl(.175 * s, .15 * s, .28 * s, style.outer, 10), 0, .62, 0);
  }
  if (working) garment(box(.21 * s, .3 * s, .03 * s, '#DCD2BC'), 0, .47, .175);                        // the work cloth at the waist
  if (style.legs === 'panelSkirt') garment(new THREE.Mesh(new THREE.CylinderGeometry(.17 * s, .23 * s, .38 * s, 12, 1, true), mat(style.trousers, { side: THREE.DoubleSide })), 0, .265, 0);
  if (style.beard) garment(ball(.09 * s, hair, 8), 0, .965, .095).scale.set(1, .7, .6);
  switch (style.head) {
    case 'nonLa': nonLa(rig.upper, s, 1.12 * s - rig.hipY); break;
    case 'quaiThao':
      // the flat fringed market hat: a wide shallow disc on a low crown, with its chin cords
      garment(cyl(.36 * s, .36 * s, .035 * s, '#D8BC72', 14), 0, 1.17, -.01);
      garment(cyl(.15 * s, .17 * s, .1 * s, '#C9AD68', 10), 0, 1.13, -.01);
      for (const x of [-.16, .16]) garment(box(.02 * s, .2 * s, .02 * s, CHECK_RED), x, 1.05, .02);
      break;
    case 'khanVan': garment(new THREE.Mesh(new THREE.TorusGeometry(.15 * s, .045 * s, 5, 14), mat(style.trousers)), 0, 1.15, -.01).rotation.x = Math.PI / 2; break;
    case 'khanRan':
      garment(box(.3 * s, .09 * s, .3 * s, '#E6E0D2'), 0, 1.15, -.02);
      for (let i = 0; i < 3; i++) garment(box(.3 * s, .02 * s, .05 * s, CHECK_RED), 0, 1.16 + i * .012, -.1 * s + i * .1 * s);
      garment(box(.08 * s, .26 * s, .06 * s, '#E6E0D2'), .14 * s, 1.0, -.1);
      break;
    case 'turbanCloth': garment(cyl(.16 * s, .17 * s, .1 * s, INDIGO, 10), 0, 1.16, -.01); garment(box(.07 * s, .22 * s, .05 * s, INDIGO), -.13 * s, 1.02, -.04); break;
    case 'skullcap': garment(ball(.155 * s, '#2B2A2E', 9), 0, 1.11, -.02).scale.set(1, .6, 1); break;
  }

  const carry = working ? undefined : style.carry;
  let bicycle: P | undefined, jar: THREE.Object3D | undefined, pole: THREE.Group | undefined;
  if (carry === 'pole') {
    // The shoulder pole rides on the right shoulder and the baskets swing under their cords as she walks.
    pole = new THREE.Group();
    wear(p, pole, .17 * s, .9 * s, 0); pole.scale.setScalar(s);
    add(pole, cyl(.022, .022, 1.7, '#C9AD68', 5), 0, 0, 0).rotation.x = Math.PI / 2;
    for (const z of [-.76, .76]) {
      const sling = add(pole, new THREE.Group(), 0, 0, z);
      for (const sx of [-1, 1]) add(sling, cyl(.008, .008, .4, '#8A7A5A', 4), sx * .12, -.2, 0);
      const basket = add(sling, cyl(.2, .15, .16, '#C9B06A', 10), 0, -.46, 0);
      for (let k = 0; k < 4; k++) add(basket, ball(.07, ['#7FB069', '#E0842C', '#C9302A', '#8FC26A'][k], 6), (k % 2 ? .07 : -.07), .1, (k < 2 ? .06 : -.06));
      sling.name = 'pole-sling';
    }
    rig.arms.right.rotation.x = -1.4;
  } else if (carry === 'bicycle') {
    bicycle = wheeledBicycle(); bicycle.position.set(.62 * s, 0, .1); bicycle.scale.setScalar(s); p.add(bicycle);
    rig.arms.right.rotation.x = -1.15; rig.arms.right.rotation.z = -.22;
  } else if (carry === 'jar') {
    // A glazed jar rolled along the quay on its side: it turns with the porter's step and he stoops to it.
    jar = add(p, new THREE.Group(), 0, .3 * s, .62 * s);
    add(jar, cyl(.3, .3, .62, '#6B4A36', 12), 0, 0, 0).rotation.x = Math.PI / 2;
    add(jar, cyl(.24, .24, .06, '#8A6A44', 12), 0, 0, .33).rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) add(jar, new THREE.Mesh(new THREE.TorusGeometry(.3, .022, 4, 14), mat('#4A3728')), 0, 0, -.24 + i * .16).rotation.x = 0;
    jar.scale.setScalar(s);
    rig.arms.left.rotation.x = -1.3; rig.arms.right.rotation.x = -1.3;
    rig.upper.rotation.x = .22;
  } else if (carry) {
    const hand = carry === 'tray' ? rig.arms.left : rig.arms.left;
    const load = add(hand, new THREE.Group(), 0, rig.arms.hand, 0); load.scale.setScalar(s);
    load.rotation.x = carry === 'tray' ? 1.3 : .85;
    if (carry === 'tray') {
      add(load, cyl(.24, .23, .05, '#C9B06A', 12), 0, -.06, 0);
      add(load, cyl(.2, .2, .06, '#A9C87A', 12), 0, -.02, 0);                                        // green rice on a lotus leaf
      add(load, new THREE.Mesh(new THREE.CircleGeometry(.23, 12), mat('#3F7A3A')), 0, .015, 0).rotation.x = -Math.PI / 2;
    } else {
      add(load, cyl(.19, .15, .24, '#B79E62', 10), 0, -.22, 0);
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.185, .02, 5, 12, Math.PI), mat('#8A6D44')), 0, -.1, 0);
      for (let i = 0; i < 3; i++) add(load, ball(.06, i % 2 ? '#8FA3B5' : '#C9D6C0', 7), (i - 1) * .09, -.08, .02);   // river fish in the basket
    }
    rig.arms.left.rotation.x = -.9;
  }

  p.scale.set(style.build, style.height, 1);
  p.userData.vietnameseResident = true; p.userData.profile = style.name; p.userData.pace = style.pace;
  p.userData.stride = style.stride; p.userData.isWalking = false; p.userData.child = child; p.userData.woman = !!style.woman;
  p.userData.carry = carry ?? null;
  const homes = p.children.map(o => ({ o, y: o.position.y }));
  let last: THREE.Vector3 | undefined, lastTime: number | undefined, phase = seed * .73, rolled = 0;
  const pose = (t: number, dt: number) => {
    const moved = last && lastTime !== undefined && t > lastTime && dt > 0 ? p.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(p.position); lastTime = t;
    const speed = dt > 0 ? moved / dt : 0, walking = speed > .025;
    if (walking) phase += moved / (style.stride * s * style.height) * Math.PI * 2;
    const strength = walking ? Math.min(1, speed / .35) : 0;
    const sw = Math.sin(phase) * (style.elderly ? .22 : child ? .44 : .34) * strength;
    const { left, right } = rig.legs;
    left.thigh.rotation.x = sw; right.thigh.rotation.x = -sw;
    left.shin.rotation.x = Math.max(0, -sw) * 1.05; right.shin.rotation.x = Math.max(0, sw) * 1.05;
    if (!carry) { rig.arms.left.rotation.x = -sw * .6; rig.arms.right.rotation.x = sw * .6; }
    else if (carry === 'pole') rig.arms.left.rotation.x = -sw * .5;
    // Lower the whole figure enough to keep the supporting shoe on the walking surface.
    const bottom = (leg: Leg) => { const a = leg.thigh.rotation.x, b = a + leg.shin.rotation.x; return rig.hipY - .22 * s * Math.cos(a) - .2 * s * Math.cos(b) - .035 * s * Math.sin(b) - .025 * s * Math.abs(Math.cos(b)) - .085 * s * Math.abs(Math.sin(b)); };
    const groundOffset = -Math.min(bottom(left), bottom(right));
    homes.forEach(({ o, y }) => { o.position.y = y + groundOffset; });
    rig.upper.rotation.x = carry === 'jar' ? .22 : style.elderly ? .07 : 0;
    rig.upper.rotation.z = walking ? Math.sin(phase) * .018 : Math.sin(t * .7 + seed) * .008;
    rig.upper.rotation.y = walking ? Math.sin(phase) * .02 : Math.sin(t * .36 + seed) * .085;
    if (pole) for (const sling of pole.children) if (sling.name === 'pole-sling') sling.rotation.x = Math.sin(phase) * .1 * strength + Math.sin(t * 1.1 + seed) * .012;
    if (bicycle) { rolled += moved; (bicycle.userData as { roll?: (d: number) => void }).roll?.(rolled / (style.build || 1)); }
    if (jar) { rolled += moved; jar.rotation.x = rolled / .3; }
    p.userData.isWalking = walking; p.userData.walkDistance = (p.userData.walkDistance ?? 0) + moved;
  };
  pose(0, 0);
  p.userData.walk = undefined;   // Vietnam uses the movement observer, not the shared time-based gait
  if (!working) p.userData.tick = pose;
  return p;
}

export type WalkState = { from: [number, number]; to: [number, number]; u: number; forward: boolean; turn: number; facing: number };

/** Constant pace along a straight segment, a real stop, then a gradual turn. `lift(u)` raises the walker on to
 *  a bridge deck, so the river passes under the feet instead of through them. Steps are matched to distance:
 *  the duration is the segment's own length divided by the resident's pace. */
export function vietnamWalk(p: P, from: [number, number], to: [number, number], range: [number, number], seed: number, lift?: (u: number) => number) {
  const [lo, hi] = range, dx = to[0] - from[0], dz = to[1] - from[1], angle = Math.atan2(dx, dz);
  const duration = Math.hypot(dx, dz) * (hi - lo) / p.userData.pace, pause = 1.6 + seed % 4 * .6, half = duration + pause, period = half * 2;
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

/** A water buffalo standing in a paddy with its head down, the delta's own animal. It does not travel, so its
 *  hooves stay planted; only the head, the ears and the tail move. */
export function buffalo(seed = 0): P {
  const g = new THREE.Group() as P, coat = C.buffalo, dark = '#3A3838';
  add(g, box(1.25, .62, .56, coat), 0, .82, 0);
  const neck = add(g, new THREE.Group(), .66, .92, 0);
  add(neck, box(.42, .38, .34, coat), .12, -.06, 0);
  add(neck, box(.3, .24, .26, dark), .38, -.16, 0);
  for (const sz of [-1, 1]) {
    const horn = add(neck, new THREE.Mesh(new THREE.TorusGeometry(.26, .035, 5, 10, Math.PI * .8), mat('#B7AE9A')), .14, .14, sz * .16);
    horn.rotation.set(Math.PI / 2, 0, sz > 0 ? 1.1 : 2.0);
    add(neck, box(.06, .14, .1, coat), .1, .04, sz * .22);
  }
  for (const [i, [x, z]] of [[.42, -.19], [.42, .19], [-.42, -.19], [-.42, .19]].entries()) {
    const leg = add(g, new THREE.Group(), x, .52, z);
    add(leg, box(.14, .52, .14, i < 2 ? coat : dark), 0, -.26, 0);
    add(leg, box(.16, .07, .17, '#2B2420'), 0, -.52, .01);
  }
  const tail = add(g, box(.06, .46, .06, dark), -.62, .72, 0);
  g.userData.tick = (t: number) => {
    neck.rotation.z = -.42 + Math.sin(t * .5 + seed) * .12;                       // grazing, the head dipping to the water
    tail.rotation.x = Math.sin(t * 1.6 + seed) * .22;
  };
  return g;
}
