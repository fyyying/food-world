/** Spanish residents of about 1880 to 1910 in working clothes, with footsteps driven by distance travelled.
 *  The eight profiles come from docs/spain-research.md section 1.5; colours use the palette names. */
import * as THREE from 'three';
import { person, wear, add, box, cyl, ball, cone, mat, C, type P } from './props';
import { SP } from './spain-architecture';

type Dress = 'waistcoat' | 'jacket' | 'bodice' | 'chestApron' | 'apron' | 'rushCape' | 'smock' | 'longShirt';
type Headwear = 'straw' | 'felt' | 'scarf' | 'hair' | 'cap' | 'hood' | 'beret' | 'barretina';
type Legs = 'breeches' | 'trousers' | 'skirt' | 'chaps';
type Resident = {
  name: string; dress: Dress; head: Headwear; legs: Legs; outer: string; shirt: string; trousers: string; sash: string;
  height: number; build: number; pace: number; stride: number; elderly?: boolean; beard?: boolean; woman?: boolean;
  carry?: 'basket' | 'jug' | 'bundle' | 'sack';
};
const DARK_BLUE = '#1f3d5c', STOCKING = '#e8e1d2', BOOT = '#3a2a1e';
export const RESIDENTS: Resident[] = [
  { name: 'huertano', dress: 'waistcoat', head: 'straw', legs: 'breeches', outer: SP.azulTalavera, shirt: SP.calBlanca, trousers: '#e9e2d3', sash: SP.almagre, height: 1.0, build: .98, pace: .66, stride: .66 },
  { name: 'andalusian', dress: 'jacket', head: 'felt', legs: 'trousers', outer: SP.maderaCastano, shirt: '#e7dcc4', trousers: '#4a4640', sash: SP.almagre, height: 1.04, build: 1.02, pace: .58, stride: .68, beard: true, carry: 'basket' },
  { name: 'patio-woman', dress: 'bodice', head: 'scarf', legs: 'skirt', outer: '#3b3a44', shirt: '#efe6d6', trousers: SP.pizarraNorte, sash: SP.azulTalavera, height: .94, build: .92, pace: .52, stride: .55, woman: true, carry: 'jug' },
  { name: 'shepherd', dress: 'chestApron', head: 'felt', legs: 'chaps', outer: SP.maderaCastano, shirt: '#ddd3bd', trousers: '#2c2a2a', sash: '#8a6a3a', height: 1.02, build: 1.08, pace: .44, stride: .58, beard: true },
  { name: 'counter-worker', dress: 'apron', head: 'cap', legs: 'trousers', outer: SP.pizarraNorte, shirt: '#f4f0e6', trousers: '#3b3d45', sash: SP.calBlanca, height: .98, build: .95, pace: .70, stride: .64 },
  { name: 'galician', dress: 'rushCape', head: 'hood', legs: 'skirt', outer: SP.tierraManchega, shirt: '#e2d8c2', trousers: SP.pizarraNorte, sash: '#5b5a55', height: .92, build: 1.06, pace: .40, stride: .50, elderly: true, carry: 'bundle' },
  { name: 'basque', dress: 'smock', head: 'beret', legs: 'trousers', outer: DARK_BLUE, shirt: '#e8e2d4', trousers: '#4f5359', sash: SP.almagre, height: 1.05, build: 1.0, pace: .62, stride: .70, beard: true },
  { name: 'catalan', dress: 'longShirt', head: 'barretina', legs: 'breeches', outer: '#efe8d8', shirt: '#efe8d8', trousers: SP.calBlanca, sash: '#6e2a2a', height: .96, build: .90, pace: .74, stride: .60, carry: 'sack' },
];

type Leg = { thigh: THREE.Group; shin: THREE.Group };
type Rig = { upper: THREE.Group; hipY: number; figureScale: number; legs: { left: Leg; right: Leg }; arms: { left: THREE.Group; right: THREE.Group; hand: number } };

/** One resident. `working` picks the standing trades (no carried load, an apron) for stands. Every seventh resident is a child. */
export function spainResident(index: number, working = false): P {
  const base = RESIDENTS[working ? [0, 1, 4, 6, 7, 3][index % 6] : index % RESIDENTS.length];
  const child = !working && index % 7 === 6;
  // The Galician profile is worn by men and women alike; a man keeps breeches under the cape.
  const style: Resident = child ? { ...base, height: .70, build: .80, pace: .78, stride: .46, elderly: false, beard: false, carry: undefined, head: base.head === 'felt' || base.head === 'barretina' ? 'hair' : base.head }
    : base.name === 'galician' && index % 2 ? { ...base, legs: 'breeches', woman: false } : base.name === 'galician' ? { ...base, woman: true } : base;
  const p = person(style.shirt), rig = p.userData as unknown as Rig, s = rig.figureScale;
  const hair = style.elderly ? '#b3ada0' : index % 3 ? '#3a2a20' : '#1e1815';
  const skin = ['#d9a880', '#e6bd96', '#c48f68', '#efcaa6'][Math.floor(index / 2) % 4];
  p.traverse(o => { if (o instanceof THREE.Mesh) { const m = o.material as THREE.MeshStandardMaterial; if (m.color.getHexString() === C.skin.slice(1)) m.color.set(skin); } });
  const hairCap = rig.upper.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry && o.position.z < 0);
  if (hairCap instanceof THREE.Mesh) (hairCap.material as THREE.MeshStandardMaterial).color.set(hair);
  // Leg cloth belongs to the articulated legs so it bends at the knee; breeches leave stockings below.
  for (const leg of [rig.legs.left, rig.legs.right]) {
    leg.thigh.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o.geometry instanceof THREE.BoxGeometry) return;
      const shin = o.parent === leg.shin;
      const colour = style.legs === 'breeches' ? (shin ? STOCKING : style.trousers) : style.legs === 'chaps' ? (shin ? SP.maderaCastano : style.trousers) : style.trousers;
      (o.material as THREE.MeshStandardMaterial).color.set(colour);
      if (o.parent === leg.thigh) o.scale.set(style.legs === 'skirt' ? 1.2 : 1.55, 1, style.legs === 'skirt' ? 1.1 : 1.35);
      if (shin && style.legs === 'chaps') o.scale.set(1.5, 1, 1.4);
    });
    if (style.legs === 'chaps' || style.name === 'galician') { const shoe = leg.shin.children.find(o => o instanceof THREE.Mesh && o.geometry instanceof THREE.BoxGeometry); if (shoe instanceof THREE.Mesh) (shoe.material as THREE.MeshStandardMaterial).color.set(BOOT); }
  }
  const garment = (o: THREE.Object3D, x: number, y: number, z: number) => wear(p, o, x * s, y * s, z * s);
  garment(cyl(.16 * s, .16 * s, .08 * s, style.sash, 10), 0, .455, 0);   // the sash at the waist
  if (style.dress === 'waistcoat' || style.dress === 'apron') {
    garment(cyl(.181 * s, .15 * s, .32 * s, style.outer, 10), 0, .645, 0);
    garment(box(.10 * s, .28 * s, .025 * s, style.shirt), 0, .66, .174);
  } else if (style.dress === 'jacket' || style.dress === 'smock' || style.dress === 'longShirt') {
    garment(cyl(.19 * s, .165 * s, .36 * s, style.outer, 10), 0, .64, 0);
    if (style.dress !== 'smock') garment(box(.06 * s, .30 * s, .02 * s, style.shirt), 0, .66, .19);
    if (style.dress === 'longShirt') garment(new THREE.Mesh(new THREE.CylinderGeometry(.165 * s, .20 * s, .14 * s, 12, 1, true), mat(style.outer, { side: THREE.DoubleSide })), 0, .40, 0);
    for (const x of [-.17, .17]) garment(cyl(.05 * s, .045 * s, .22 * s, style.outer, 6), x, .69, 0);   // sleeves over the upper arm
  } else if (style.dress === 'bodice') {
    garment(cyl(.175 * s, .15 * s, .30 * s, style.outer, 10), 0, .63, 0);
    garment(box(.20 * s, .38 * s, .03 * s, SP.calBlanca), 0, .40, .17);   // the full apron over the skirt
    garment(box(.40 * s, .18 * s, .12 * s, '#6c4b52'), 0, .80, -.08);   // the shawl across the shoulders
  } else if (style.dress === 'chestApron') {
    garment(cyl(.185 * s, .16 * s, .34 * s, SP.pizarraNorte, 10), 0, .64, 0);
    garment(box(.22 * s, .34 * s, .035 * s, style.outer), 0, .62, .175);
    for (const y of [.55, .68]) garment(box(.18 * s, .05 * s, .02 * s, '#3b2a1e'), 0, y, .20);   // tool pockets on the leather
  } else if (style.dress === 'rushCape') {
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.17 * s, .30 * s, .48 * s, 12, 1, true), mat(style.outer, { side: THREE.DoubleSide })), 0, .64, 0);
    for (let i = 0; i < 10; i++) garment(box(.02 * s, .10 * s, .02 * s, '#a88d5a'), Math.cos(i * .63) * .29, .38, Math.sin(i * .63) * .29);   // loose rush ends shed the rain
  }
  if (style.dress === 'apron') garment(box(.23 * s, .42 * s, .035 * s, SP.calBlanca), 0, .40, .18);
  if (working && style.dress !== 'apron' && style.dress !== 'chestApron') garment(box(.22 * s, .36 * s, .035 * s, '#e3dac6'), 0, .46, .18);
  if (style.legs === 'skirt') {
    const length = style.dress === 'rushCape' ? .30 : .37;
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.17 * s, .24 * s, length * s, 12, 1, true), mat(style.trousers, { side: THREE.DoubleSide })), 0, .455 - length / 2, 0);
  }
  if (style.beard) garment(ball(.10 * s, hair, 8), 0, .974, .097).scale.set(1, .72, .65);
  if (style.name === 'huertano') garment(box(.16 * s, .05 * s, .10 * s, '#b8433a'), 0, .89, .09);   // the neck cloth
  switch (style.head) {
    case 'straw': garment(cyl(.30 * s, .30 * s, .02 * s, '#d8bc72', 12), 0, 1.16, -.01); garment(cyl(.13 * s, .145 * s, .12 * s, '#d8bc72', 10), 0, 1.22, -.01); break;
    case 'felt': garment(cyl(.22 * s, .22 * s, .02 * s, '#3a3330', 12), 0, 1.165, -.01); garment(cyl(.125 * s, .14 * s, .10 * s, '#3a3330', 10), 0, 1.22, -.01); break;
    case 'scarf':
      garment(ball(.17 * s, style.sash, 10), 0, 1.105, -.075).scale.set(1.05, 1.12, .70);
      for (const x of [-.146, .146]) garment(box(.06 * s, .27 * s, .20 * s, style.sash), x, 1.025, -.045);
      garment(box(.27 * s, .24 * s, .07 * s, style.sash), 0, .925, -.145); break;
    case 'cap': garment(cyl(.145 * s, .15 * s, .07 * s, '#4a4540', 10), 0, 1.185, -.02); garment(box(.20 * s, .02 * s, .10 * s, '#4a4540'), 0, 1.16, .14); break;
    case 'hood': garment(cone(.21 * s, .34 * s, style.outer, 10), 0, 1.24, -.03); garment(cyl(.19 * s, .21 * s, .12 * s, style.outer, 10), 0, 1.06, -.03); break;
    case 'beret': garment(cyl(.17 * s, .13 * s, .05 * s, SP.pizarraNorte, 12), .02, 1.185, -.02); break;
    case 'barretina': garment(cyl(.11 * s, .135 * s, .15 * s, SP.almagre, 10), 0, 1.21, -.01); garment(ball(.09 * s, SP.almagre, 8), 0, 1.30, -.10); break;
  }

  const carry = working ? undefined : style.carry;
  const leftHome = carry === 'basket' || carry === 'bundle' ? -.85 : carry === 'sack' ? -.3 : 0, rightHome = carry === 'jug' ? -.95 : 0;
  if (carry) {
    const hand = carry === 'jug' ? rig.arms.right : rig.arms.left;
    const load = add(hand, new THREE.Group(), 0, rig.arms.hand, 0); load.scale.setScalar(s);
    load.rotation.x = carry === 'jug' ? -rightHome : -leftHome;
    if (carry === 'basket') {
      add(load, cyl(.15, .12, .20, '#b89660', 10), 0, -.21, 0);
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.145, .018, 5, 12, Math.PI), mat('#8a6d44')), 0, -.11, 0);
      for (const [i, x] of [-.08, 0, .08].entries()) add(load, ball(.046, ['#e0842c', '#6f9b57', '#c9302a'][i], 7), x, -.09, .015);
    } else if (carry === 'jug') {
      add(load, ball(.115, '#b78258', 10), 0, -.14, 0).scale.y = 1.2;
      add(load, cyl(.044, .055, .10, '#a06e48', 9), 0, -.025, 0);
      add(load, new THREE.Mesh(new THREE.TorusGeometry(.07, .018, 5, 10), mat('#9a6946')), .10, -.10, 0);
    } else if (carry === 'sack') {
      const sack = add(load, ball(.13, '#d9cfb4', 8), .06, -.02, -.10); sack.scale.set(.8, 1.4, .8);
      add(load, cyl(.02, .02, .10, '#5a4a38', 5), .06, .13, -.10);
    } else { add(load, ball(.16, '#a48c6a', 8), 0, -.10, 0).scale.set(1, .8, 1.2); add(load, box(.025, .20, .27, '#6e563f'), 0, -.09, 0); }
  }
  p.scale.set(style.build, style.height, 1);
  p.userData.spanishResident = true; p.userData.profile = style.name; p.userData.pace = style.pace;
  p.userData.stride = style.stride; p.userData.isWalking = false; p.userData.child = child; p.userData.woman = !!style.woman;
  const homes = p.children.map(o => ({ o, y: o.position.y }));
  let last: THREE.Vector3 | undefined, lastTime: number | undefined, phase = index * .73;
  const pose = (t: number, dt: number) => {
    const moved = last && lastTime !== undefined && t > lastTime && dt > 0 ? p.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(p.position); lastTime = t;
    const speed = dt > 0 ? moved / dt : 0, walking = speed > .025;
    if (walking) phase += moved / (style.stride * s * style.height) * Math.PI * 2;
    const strength = walking ? Math.min(1, speed / .35) : 0, sw = Math.sin(phase) * (style.elderly ? .23 : child ? .45 : .36) * strength;
    const { left, right } = rig.legs;
    left.thigh.rotation.x = sw; right.thigh.rotation.x = -sw;
    left.shin.rotation.x = Math.max(0, -sw) * 1.05; right.shin.rotation.x = Math.max(0, sw) * 1.05;
    rig.arms.left.rotation.x = leftHome - sw * (carry && carry !== 'jug' ? 0 : .62);
    rig.arms.right.rotation.x = rightHome + sw * (carry === 'jug' ? 0 : .62);
    // Lower the whole figure enough to keep the supporting shoe on the walking surface.
    const bottom = (leg: Leg) => { const a = leg.thigh.rotation.x, b = a + leg.shin.rotation.x; return rig.hipY - .22 * s * Math.cos(a) - .20 * s * Math.cos(b) - .035 * s * Math.sin(b) - .025 * s * Math.abs(Math.cos(b)) - .085 * s * Math.abs(Math.sin(b)); };
    const groundOffset = -Math.min(bottom(left), bottom(right));
    homes.forEach(({ o, y }) => { o.position.y = y + groundOffset; });
    rig.upper.rotation.x = style.elderly ? .075 : 0;
    rig.upper.rotation.z = walking ? Math.sin(phase) * .018 : Math.sin(t * .7 + index) * .008;
    rig.upper.rotation.y = walking ? Math.sin(phase) * .022 : Math.sin(t * .36 + index) * .09;
    p.userData.isWalking = walking; p.userData.walkDistance = (p.userData.walkDistance ?? 0) + moved;
  };
  pose(0, 0);
  p.userData.walk = undefined;   // Spain uses the movement observer instead of the shared time-based gait.
  if (!working) p.userData.tick = pose;
  return p;
}

export type WalkState = { from: [number, number]; to: [number, number]; u: number; forward: boolean; turn: number; facing: number };

/** Constant pace along a straight segment, a real stop, then a gradual turn. `lift(u)` raises the walker over a bridge deck. */
export function spainWalk(p: P, from: [number, number], to: [number, number], range: [number, number], seed: number, lift?: (u: number) => number) {
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

/** A pack mule with panniers. Its legs step with the distance it covers; `followMule` keeps it on a lead behind a walker. */
export function spainMule(): P {
  const g = new THREE.Group() as P, coat = '#6b5a4a', dark = '#4a3d31';
  add(g, box(1.0, .5, .42, coat), 0, .72, 0);
  add(g, box(.34, .38, .3, coat), .62, .86, 0);
  add(g, box(.28, .22, .24, coat), .78, .72, 0);
  for (const z of [-.09, .09]) add(g, box(.07, .24, .05, dark), .62, 1.12, z);
  add(g, box(.5, .12, .08, dark), .05, .92, 0);   // the mane and headstall
  add(g, box(.06, .34, .06, dark), -.55, .55, 0).rotation.x = .3;
  for (const side of [-1, 1]) { add(g, box(.34, .40, .16, '#b89660'), .05, .70, side * .30); add(g, box(.36, .05, .18, '#8a6d44'), .05, .92, side * .30); }   // panniers on a pack saddle
  const legs: THREE.Group[] = [];
  for (const [i, [x, z]] of [[.34, -.13], [.34, .13], [-.34, -.13], [-.34, .13]].entries()) {
    const leg = new THREE.Group(); leg.position.set(x, .52, z); g.add(leg); legs.push(leg);
    add(leg, box(.11, .52, .11, i < 2 ? coat : dark), 0, -.26, 0);
    add(leg, box(.13, .06, .13, '#2b2420'), 0, -.49, .01);
  }
  let last: THREE.Vector3 | undefined, phase = 0;
  g.userData.tick = (_t, dt) => {
    const moved = last && dt > 0 ? g.position.distanceTo(last) : 0;
    last ??= new THREE.Vector3(); last.copy(g.position);
    if (moved > 1e-4) phase += moved / .55 * Math.PI * 2;
    const k = moved > 1e-4 ? 1 : 0;
    legs.forEach((leg, i) => { leg.rotation.z = Math.sin(phase + (i % 3 ? Math.PI : 0)) * .45 * k; });
    g.userData.isWalking = k > 0;
  };
  return g;
}

/** The mule trails 1.3 behind the walker along the direction of travel and walks round to the other side while the walker turns. */
export function followMule(mule: P, leader: P, group: THREE.Object3D) {
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 5), mat('#8a7a5a')); rope.name = 'mule-lead'; group.add(rope);
  const hand = new THREE.Vector3(), halter = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  return (t: number, dt: number) => {
    const s = leader.userData.walkState as WalkState | undefined; if (!s) return;
    const dx = s.to[0] - s.from[0], dz = s.to[1] - s.from[1], len = Math.hypot(dx, dz) || 1;
    // Behind on the way out, walking round to be behind again on the way back.
    const side = (s.forward ? 1 : -1) * (1 - 2 * s.turn * s.turn * (3 - 2 * s.turn));
    const gap = 1.3 * side / len;
    const u = s.u - gap;
    mule.position.set(s.from[0] + dx * u, .034, s.from[1] + dz * u);
    mule.rotation.y = Math.atan2(-dz * side, dx * side);   // the head (local +x) points the way the mule is going
    mule.userData.tick?.(t, dt);
    hand.set(0, .55, 0); leader.localToWorld(hand); group.worldToLocal(hand);
    halter.set(.78, .8, 0); mule.localToWorld(halter); group.worldToLocal(halter);
    rope.position.copy(hand).add(halter).multiplyScalar(.5);
    rope.scale.y = Math.max(.01, hand.distanceTo(halter));
    rope.quaternion.setFromUnitVectors(up, halter.clone().sub(hand).normalize());
  };
}
