/**
 * Thailand stands (area id `bangkok`): one builder per `prop` name in the object list of docs/thailand-world.md.
 * Owned by the Stand maker, Stage C of docs/agent-team-playbook.md.
 *
 * Every room stand follows the hotpot table in docs/building-a-world.md section 5: a building or shelter from the
 * region, a visible work surface, modelled food, an always-on loop, six to nine people with idle motion, a walker,
 * lamps under a beam, steam at every hot source, and a click chain that moves the food or material first, the
 * worker second, one bystander third and speaks last. Ingredient stops and landmarks are simpler, but each has a
 * real prop and a 3D reaction of its own.
 *
 * Buildings, boats and people are local to this file until `thailand-architecture.ts` and `thailand-people.ts`
 * land: the playbook says a missing helper is built in the owning file, never in `props.ts`. `thaiFigure` below is
 * the single line that becomes `thailandResident(seed, working)` when the Builder's people file arrives.
 *
 * Period band 1880 to 1910, research 1.5: the `chong kraben`, the `pha khao ma`, the `sinh`, the `ngob` sun hat.
 * No `nón lá` (that is Hanoi and the Mekong, in this same world), no `chada` headdress, no hill-tribe costume,
 * and nothing modern: the Andaman coast carries no lounger and no parasol, the rickshaw is pulled and the sea
 * people's boat is a `kabang`.
 */
import * as THREE from "three";
import { add, mat, rnd, wear, bubble, ambientChat, tickChildren, person, type P } from "./props";
import { TH_LINES } from "./thailand-speech";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, c: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
const cyl = (rt: number, rb: number, h: number, c: string, seg = 12) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(c));
const cone = (r: number, h: number, c: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(c));
const ball = (r: number, c: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(c));
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
type Figure = P;
const upper = (p: Figure) => p.userData.upper as THREE.Group;
const arms = (p: Figure) => p.userData.arms as { left: THREE.Group; right: THREE.Group; hand: number };
const legsOf = (p: Figure) => p.userData.legs as { left: { thigh: THREE.Group; shin: THREE.Group }; right: { thigh: THREE.Group; shin: THREE.Group } };
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** The twelve palette names of the image brief, section 1.3; the Builder's `TH` constant carries the same names. */
export const TH = {
  khlongBrown: "#6E5C3C", andamanGreen: "#2F7D72", teakDark: "#5A3B22", bambooPale: "#C9B489", paddyGreen: "#8FA84A",
  limestoneGrey: "#A79E90", watOrange: "#C8622C", chediGold: "#C79B3B", lacquerRed: "#9C2B23", pelangiBlue: "#2E4E7E",
  charcoalSmoke: "#3A3733", stuccoPastel: "#E7D9C4",
  // working tones derived from the twelve, used for thatch, brass, flesh and flame
  thatch: "#B9A46A", teak: "#7A4F2A", brass: "#B08A3A", leaf: "#4F7A3A", clay: "#8A5A3C", riceWhite: "#F4EFE2",
  flame: "#E9612D", flameHot: "#F2A03C", broth: "#B4763A", water: "#8FB8A8", glass: "#BFD7DC", iron: "#2E2B2A",
};

/**
 * Ambient speech per object id comes from the Researcher's `thailand-speech.ts` and is re-exported here, because
 * the module contract in docs/thailand-world.md lists `TH_LINES` among this file's exports while the lines
 * themselves are hers. There is exactly one copy of them, in her file.
 *
 * The four market stall boats have no key of their own there, so each speaks with the voice of the boat it is
 * moored beside: the fruit, herb and coconut boats from `floatingMarket`, the noodle boat from `kuaitiaoRuea`.
 * If the Researcher adds four keys, the four `life(...)` calls in the stall builders take them and nothing else
 * changes.
 */
export { TH_LINES } from "./thailand-speech";

// ---------- reaction machinery, copied from props-turkey.ts and props-spain.ts (module-private there) ----------

/** A sine pulse that runs between two points of the decaying reaction `k`. */
const beat = (k: number, start = 0, end = 1) => k > 0 ? Math.sin(Math.PI * clamp01(((1 - k) - start) / (end - start))) : 0;
/**
 * A trapezoid over the same decaying reaction: it rises to 1 by `rise`, holds there while the visitor's camera
 * arrives, and returns to exactly 0 at the end. A pour needs this rather than `beat`, because a sine pulse has
 * the vessel only part of the way to the cup at the 1.6-second arrival and the stream reads as crossing the
 * stand rather than falling into it.
 */
const hold = (k: number, rise = .30, fall = .80) => { if (k <= 0) return 0; const u = 1 - k; return u < rise ? u / rise : u > fall ? Math.max(0, (1 - u) / (1 - fall)) : 1; };

function deferredBubble(targets: THREE.Object3D[], lines: string[], y: number, ms: number) {
  let delay = -1, n = 0;
  return {
    schedule() { delay = .28; },
    tick(dt: number) { if (delay < 0) return; delay -= dt; if (delay <= 0) { delay = -1; n++; bubble(targets[n % targets.length], lines[n % lines.length], y, ms); } },
  };
}

/**
 * The stand animates itself. Food or material tagged `userData.foodReaction` moves first, the worker (people[0])
 * follows, one bystander (people[1]) acknowledges, speech comes last through a deferred bubble, then ambient chat.
 * The reaction decays over about 3.5 s so the first beat is still readable when the 1.6-second approach arrives.
 */
function life(g: P, id: string, people: Figure[], work?: (t: number, k: number, dt: number) => void, onPoke?: () => void, speakers?: Figure[]) {
  g.userData.ownReaction = true;
  let reaction = 0;
  const lines = TH_LINES[id] ?? ["สวัสดี · Hello."];
  const food: { object: THREE.Object3D; position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }[] = [];
  g.traverse((o) => { if (o.userData.foodReaction) food.push({ object: o, position: o.position.clone(), rotation: o.rotation.clone(), scale: o.scale.clone() }); });
  const chat = ambientChat(g, lines);
  const speech = deferredBubble((speakers ?? people).length ? (speakers ?? people) : [g], lines, 1.45, 1800);
  g.userData.poke = () => { reaction = 1; onPoke?.(); speech.schedule(); };
  g.userData.tick = (t, dt) => {
    reaction = Math.max(0, reaction - dt * .285);
    tickChildren(g)(t, dt);
    people.forEach((p, i) => { if (p.userData.tick) return; const u = upper(p); if (!u) return; u.rotation.y = Math.sin(t * .45 + i) * .09; u.rotation.z = Math.sin(t * .7 + i) * .025; });
    food.forEach(({ object, position, rotation, scale }, i) => {
      const phase = clamp01((1 - reaction - (i % 3) * .09) / .73), pulse = reaction > 0 ? Math.sin(Math.PI * phase) : 0;
      object.position.copy(position); object.rotation.copy(rotation); object.scale.copy(scale);
      switch (object.userData.foodReaction) {
        case "hop": object.position.y += pulse * .32; object.rotation.y += pulse * .9; break;
        case "lift": object.position.y += pulse * .40; object.position.z += pulse * .12; object.rotation.x -= pulse * .42; break;
        case "puff": object.scale.y = scale.y * (1 + pulse * 1.4); object.position.y += pulse * .3; break;
        case "contents": object.scale.set(scale.x * (1 + pulse * .13), scale.y * (1 + pulse * .75), scale.z * (1 + pulse * .13)); object.position.y += pulse * .2; break;
        case "sway": object.rotation.z += pulse * .35; break;
        case "roll": object.rotation.x -= pulse * 2.4; break;
        default: break;
      }
    });
    if (people[0]) arms(people[0]).right.rotation.z = -beat(reaction, .52, .90) * .14;
    if (people[1]) { const u = upper(people[1]); u.rotation.x = (people[1].userData.tick ? u.rotation.x : 0) + beat(reaction, .58, 1) * .13; }
    work?.(t, reaction, dt);
    speech.tick(dt);
    chat(dt);
  };
  return g;
}

/** Reuse fruit geometry, hide the picked fruit, let a bounded handful fall to a target and clean up. */
function harvest(g: P, trees: THREE.Object3D[], baskets: THREE.Vector3[], floor = 0) {
  const falling: { mesh: THREE.Group; source: THREE.Mesh; start: THREE.Vector3; matrix: THREE.Matrix4; age: number; target: THREE.Vector3 }[] = [];
  const position = V(), spin = new THREE.Matrix4(), fadeScale = V();
  let pickIndex = 0;
  return {
    poke: () => {
      g.updateWorldMatrix(true, true);
      for (const [i, tr] of trees.slice(0, 3).entries()) {
        if (falling.length >= 24) break;
        const fruit = (tr.userData.fruits ?? []) as THREE.Mesh[];
        const available = fruit.filter((f) => f.visible); if (!available.length) continue;
        const source = available[(pickIndex + i) % available.length], visual = source.clone(), mesh = new THREE.Group();
        source.updateWorldMatrix(true, false); mesh.name = "harvest-fruit"; mesh.matrixAutoUpdate = false; g.add(mesh);
        const matrix = source.matrixWorld.clone().premultiply(g.matrixWorld.clone().invert()); mesh.matrix.copy(matrix);
        visual.position.set(0, 0, 0); visual.quaternion.identity(); visual.scale.set(1, 1, 1); mesh.add(visual);
        source.visible = false;
        const target = baskets[i % baskets.length].clone().add(V(Math.sin(pickIndex + i) * .10, floor, Math.cos(pickIndex + i) * .10));
        falling.push({ mesh, source, start: V().setFromMatrixPosition(matrix), matrix, age: -i * .22, target });
      }
      pickIndex++;
    },
    tick: (t: number, k: number, dt: number) => {
      trees.forEach((tr, i) => {
        const crown = (tr.userData.crown ?? tr) as THREE.Object3D;
        crown.rotation.z = Math.sin(t * 1.3 + i) * .012 + (i === 0 ? Math.sin(t * 19) * .10 * k : 0);
        crown.rotation.x = i === 0 ? Math.cos(t * 16) * .055 * k : 0;
      });
      for (let i = falling.length - 1; i >= 0; i--) {
        const f = falling[i]; f.age += dt; if (f.age < 0) continue;
        const landing = 1.8, p = Math.min(1, f.age / landing), after = f.age - landing;
        const bounce = after > 0 && after < .28 ? Math.sin(after / .28 * Math.PI) * .065 : 0;
        position.lerpVectors(f.start, f.target, p); position.y = f.start.y + (f.target.y - f.start.y) * p * p + bounce;
        const fade = clamp01((3.6 - f.age) / .5);
        f.mesh.matrix.copy(f.matrix).setPosition(position).multiply(spin.makeRotationZ(f.age * .9)).scale(fadeScale.setScalar(fade));
        if (f.age >= 3.6) { g.remove(f.mesh); f.source.visible = true; falling.splice(i, 1); }
      }
    },
  };
}

/**
 * A falling column of liquid between a real spout and a real vessel. One unit tall, hanging from its own origin,
 * so the group's y scale is the real height of the fall: three lengths that thin as the fall stretches them.
 */
function pourFall(g: THREE.Object3D, name: string, color: string, radius = .03, segs = 3) {
  const col = add(g, new THREE.Group(), 0, 0, 0);
  col.name = name; col.visible = false;
  const skin = { emissive: color, emissiveIntensity: .18, transparent: true, opacity: .92 };
  for (let i = 0; i < segs; i++) {
    const r = radius * (1 - i * .16), h = .96 / segs;
    add(col, new THREE.Mesh(new THREE.CylinderGeometry(r, r * .86, h, 8), mat(color, skin)), 0, -(i + .5) / segs, 0);
  }
  add(col, new THREE.Mesh(new THREE.SphereGeometry(radius * 1.15, 7, 5), mat(color, skin)), 0, -.02, 0);
  const down = V(0, -1, 0), dir = V();
  return {
    mesh: col,
    /** Both points are in the stand's space; the column hangs from `from` and ends at `to`. */
    set(from: THREE.Vector3, to: THREE.Vector3, visible: boolean) {
      col.visible = visible; if (!visible) return;
      col.position.copy(from);
      dir.subVectors(to, from);
      col.scale.set(1, Math.max(.02, dir.length()), 1);
      col.quaternion.setFromUnitVectors(down, dir.normalize());
    },
  };
}
/** Rings that open where a falling liquid lands, on a surface or in a cup. */
function splashRings(g: THREE.Object3D, n: number, x: number, y: number, z: number, r: number, color: string) {
  return Array.from({ length: n }, (_, i) => {
    const m = add(g, new THREE.Mesh(new THREE.TorusGeometry(r, r * .2, 5, 12), mat(color, { transparent: true, opacity: .8 })), x + Math.cos(i * 1.3) * r * 2, y, z + Math.sin(i * 1.3) * r * 2);
    m.rotation.x = Math.PI / 2; m.visible = false; return m;
  });
}
/** World-space point of a local offset on a tilted object, expressed in the stand's space. */
function tipOf(obj: THREE.Object3D, local: THREE.Vector3, out: THREE.Vector3) { return out.copy(local).applyQuaternion(obj.quaternion).add(obj.position); }

// ---------- people: the eight clothing profiles of research 1.5, as data ----------

/**
 * The eight everyday working profiles of 1880 to 1910. `lower` is the wrapped cloth — a `chong kraben` for the
 * central Siamese, a `sinh` tube skirt for Isan and Lanna, a `kain` sarong in the Malay south. `hat` is the flat
 * woven `ngob`, a `pha khao ma` round the head, a `songkok`, a Yunnanese skull cap or nothing. No `nón lá`.
 */
const PROFILES = [
  { key: "marketWoman", top: "#D9CDB4", lower: TH.pelangiBlue, hat: "ngob", sabai: "#C9A9A0", hem: "" },
  { key: "workingMan", top: "#CFC3A6", lower: "#6E6350", hat: "khaoma", sabai: "", hem: "" },
  { key: "nobleWoman", top: "#E6D7B8", lower: "#7A3F5A", hat: "none", sabai: TH.chediGold, hem: "" },
  { key: "teochewMan", top: "#3A3E46", lower: "#2E3138", hat: "none", sabai: "", hem: "" },
  { key: "isanHousehold", top: "#B9C2C9", lower: TH.pelangiBlue, hat: "khaoma", sabai: "", hem: "#C9B489" },
  { key: "lannaWoman", top: "#E4DCCB", lower: "#4A5A44", hat: "bun", sabai: "#9C6A4A", hem: "#C79B3B" },
  { key: "malayHousehold", top: "#D8CFC0", lower: "#2F6F63", hat: "songkok", sabai: "#B8496A", hem: "" },
  { key: "babaHousehold", top: "#E9E2D2", lower: "#3E5A7A", hat: "none", sabai: "#2E4E7E", hem: "#C79B3B" },
] as const;

/**
 * One resident of 1880 to 1910. **This function is the whole swap.** When `thailand-people.ts` lands, the body
 * becomes `return thaiResident(seed, working) as Figure;` and nothing else in this file changes: every stand asks
 * for its people through `resident(role)` and never builds a figure itself.
 */
function thaiFigure(seed: number, working: boolean): Figure {
  const p = PROFILES[((seed % PROFILES.length) + PROFILES.length) % PROFILES.length];
  const f = person(p.top, { apron: working && (p.key === "teochewMan" || p.key === "babaHousehold") }) as Figure;
  // the wrapped lower cloth, on the hip pivot so it leans with the body as props-seasia's sarong does
  wear(f, box(.34, .40, .27, p.lower), 0, .44, 0);
  if (p.hem) wear(f, box(.345, .07, .275, p.hem), 0, .27, 0);            // the woven hem band of a sinh
  if (p.sabai) wear(f, box(.30, .10, .19, p.sabai), 0, .78, -.02).rotation.z = .22;   // pha sabai over one shoulder
  if (p.hat === "ngob") { wear(f, cyl(.30, .33, .04, TH.bambooPale, 14), 0, 1.16, 0); wear(f, cone(.27, .10, "#B9A46A", 12), 0, 1.22, 0); }
  if (p.hat === "khaoma") { wear(f, box(.30, .11, .24, "#B4544A"), 0, 1.14, 0); wear(f, box(.09, .30, .07, "#B4544A"), -.14, .97, -.06).rotation.z = -.28; }
  if (p.hat === "songkok") wear(f, cyl(.135, .15, .14, TH.pelangiBlue, 12), 0, 1.16, 0);
  if (p.hat === "bun") { wear(f, ball(.085, "#241C18", 7), 0, 1.16, -.07); wear(f, ball(.035, "#E8D06A", 5), .09, 1.14, -.05); }
  if (working && p.key === "workingMan") wear(f, box(.10, .30, .07, "#C9B489"), .15, .95, -.05).rotation.z = .3;
  return f;
}

type Role = "vendor" | "paddler" | "cook" | "server" | "carrier" | "noble" | "scribe" | "teochew" | "farmer" | "isan" | "lanna" | "muleteer" | "malay" | "baba" | "fisher" | "monk" | "child" | "townswoman" | "townsman";
/** Which of the eight profiles a trade wears. */
const PROFILE_OF: Record<Role, number> = {
  vendor: 0, paddler: 1, cook: 0, server: 1, carrier: 1, noble: 2, scribe: 3, teochew: 3, farmer: 1, isan: 4,
  lanna: 5, muleteer: 5, malay: 6, baba: 7, fisher: 1, monk: 1, child: 0, townswoman: 0, townsman: 1,
};
let nth = 0;
/** A resident for a role. Working trades get the apron band; everyone else keeps the profile's own dress. */
function resident(role: Role, working = role === "cook" || role === "server" || role === "vendor" || role === "teochew"): Figure {
  const f = thaiFigure(PROFILE_OF[role] + 8 * (nth++ % 5), working);
  if (role === "child") { f.scale.setScalar(.72); }
  if (role === "monk") {
    // an ochre robe over one shoulder and a shaved head; barefoot, and only at dawn
    wear(f, box(.40, .46, .31, TH.watOrange), 0, .80, 0);
    wear(f, box(.15, .48, .20, TH.watOrange), -.15, 1.04, -.05).rotation.z = -.3;
    wear(f, ball(.15, "#C8A075", 8), 0, 1.09, -.02).scale.set(1, .72, 1);
  }
  return f;
}
/** The stand takes over a figure's limbs: any observer of its own is dropped so the choreography is not overwritten. */
function own(fig: Figure): Figure { fig.userData.tick = undefined; return fig; }
/** The pelvis rests on the seat; the seat stands a little behind the hanging calves. */
function seatFigure(g: THREE.Object3D, fig: Figure, x: number, z: number, angle: number, seatTop: number): Figure {
  fig.userData.sit?.();
  own(fig);
  const pelvis = fig.children.find((c) => c instanceof THREE.Mesh) as THREE.Mesh;
  pelvis.geometry.computeBoundingBox();
  const bottom = (pelvis.position.y + pelvis.geometry.boundingBox!.min.y) * fig.scale.y;
  add(g, fig, x, seatTop - bottom, z).rotation.y = angle; fig.name = "th-sitter"; fig.userData.seatTop = seatTop;
  return fig;
}
/**
 * Someone sitting on a boat's thwart. The shared rig hangs a seated figure's shins straight down, which on a
 * hull whose floor boards are a hand below the thwart puts the feet through the bottom of the boat; here the
 * knees stay up and the feet come back onto the boards, where a paddler's feet actually are.
 */
function boatSeat(b: THREE.Object3D, fig: Figure, x: number, z: number, angle: number, seatTop = .28): Figure {
  const f = seatFigure(b, fig, x, z, angle, seatTop);
  const legs = legsOf(f);
  for (const leg of [legs.left, legs.right]) { leg.thigh.rotation.x = -1.42; leg.shin.rotation.x = .78; }
  return f;
}
/** A stool, and someone on it. */
function sit(g: THREE.Object3D, x: number, z: number, angle: number, role: Role, seatTop = .40): Figure {
  const seat = add(g, cyl(.17, .18, seatTop, TH.teak), x - Math.sin(angle) * .11, seatTop / 2, z - Math.cos(angle) * .11); seat.name = "th-stool";
  return seatFigure(g, resident(role), x, z, angle, seatTop);
}
/** A plank bench on two ends. Returns the seat height. */
function bench(g: THREE.Object3D, x: number, z: number, len: number, angle: number, seatTop = .40) {
  const b = add(g, new THREE.Group(), x, 0, z); b.rotation.y = angle;
  add(b, box(len, .06, .30, TH.teak), 0, seatTop, -.11).name = "th-bench";
  for (const dx of [-len / 2 + .14, len / 2 - .14]) add(b, box(.08, seatTop - .03, .26, TH.teak), dx, (seatTop - .03) / 2, -.11);
  return seatTop;
}
/** A low table. Thai kitchens of the band work close to the ground; `height` says how low. */
function table(g: THREE.Object3D, x: number, z: number, w = 2.2, d = .95, color = TH.teak, height = .68) {
  add(g, box(w, .07, d, color), x, height - .035, z);
  for (const dx of [-w / 2 + .11, w / 2 - .11]) for (const dz of [-d / 2 + .09, d / 2 - .09]) add(g, box(.08, height - .07, .08, TH.teakDark), x + dx, (height - .07) / 2, z + dz);
  return height;
}
/**
 * A walker that paces a straight segment, pauses and turns at each end, and steps while it travels: the legs
 * swing in proportion to the distance covered, so no figure slides. `thailandWalk` in the Builder's people file
 * will replace the stepping half of this; the pacing stays here.
 */
function pacer(p: Figure, from: THREE.Vector3, to: THREE.Vector3, speed = .32, phase = 0, pause = 1.6) {
  const dir = to.clone().sub(from), len = dir.length(), leg = len / speed, cycle = 2 * (leg + pause), heading = Math.atan2(dir.x, dir.z);
  const legs = legsOf(p), arm = arms(p);
  let travelled = 0;
  return (t: number) => {
    const s = (t + phase) % cycle;
    let d: number, facing: number, moving: boolean;
    if (s < leg) { d = s * speed; facing = heading; moving = true; }
    else if (s < leg + pause) { d = len; facing = heading + Math.PI * clamp01((s - leg) / pause); moving = false; }
    else if (s < 2 * leg + pause) { d = len - (s - leg - pause) * speed; facing = heading + Math.PI; moving = true; }
    else { d = 0; facing = heading + Math.PI + Math.PI * clamp01((s - 2 * leg - pause) / pause); moving = false; }
    p.position.copy(from).addScaledVector(dir, d / len); p.rotation.y = facing;
    // steps matched to distance: one stride per .62 units covered, and the legs rest when the figure stands still
    travelled = d;
    const swing = moving ? Math.sin(travelled / .62 * Math.PI * 2) * .5 : 0;
    legs.left.thigh.rotation.x = swing; legs.right.thigh.rotation.x = -swing;
    legs.left.shin.rotation.x = Math.max(0, -swing) * .9; legs.right.shin.rotation.x = Math.max(0, swing) * .9;
    arm.left.rotation.x = -swing * .7; arm.right.rotation.x = swing * .7;
    const u = upper(p); u.position.y = (p.userData.hipY as number) + (moving ? Math.abs(Math.cos(travelled / .62 * Math.PI * 2)) * .02 : 0);
  };
}

// ---------- lamps, signs, shelters, boats ----------

/**
 * A hanging lamp: a small oil lamp in a glass shade on the khlongs, a red paper lantern in Sampheng. Same
 * conventions as `lantern()` in props.ts — the name, the `suspensionPoint`, and the cord last in the swing group,
 * so `thailand-reactions.mjs` can prove it hangs from a real beam and that its cord stays on the anchor.
 */
function thaiLamp(scale = 1, paper = false): P {
  const g = group(); g.name = "hanging-lantern";
  const anchorY = .4 * scale; g.userData.suspensionPoint = V(0, anchorY, 0);
  const swing = new THREE.Group(); swing.position.y = anchorY; g.add(swing);
  if (paper) {
    const body = add(swing, ball(.15 * scale, TH.lacquerRed, 10), 0, -.36 * scale, 0); body.scale.set(1, .85, 1);
    body.material = mat(TH.lacquerRed, { emissive: "#E9803A", emissiveIntensity: .55 });
    for (let i = 0; i < 6; i++) add(swing, box(.006 * scale, .26 * scale, .006 * scale, "#7A1E18"), Math.cos(i) * .14 * scale, -.36 * scale, Math.sin(i) * .14 * scale);
    add(swing, cyl(.05 * scale, .05 * scale, .03 * scale, TH.chediGold, 8), 0, -.21 * scale, 0);
    add(swing, box(.03 * scale, .12 * scale, .01, TH.chediGold), 0, -.56 * scale, 0);
  } else {
    add(swing, cone(.12 * scale, .08 * scale, TH.brass, 6), 0, -.20 * scale, 0);
    add(swing, cyl(.09 * scale, .10 * scale, .18 * scale, TH.glass, 10), 0, -.33 * scale, 0).material = mat("#F2C46A", { emissive: "#E9A94A", emissiveIntensity: .7, transparent: true, opacity: .85 });
    add(swing, cyl(.045 * scale, .045 * scale, .06 * scale, "#F2C46A", 8), 0, -.33 * scale, 0);
    add(swing, cyl(.10 * scale, .10 * scale, .02 * scale, TH.brass, 10), 0, -.43 * scale, 0);
    for (let i = 0; i < 3; i++) add(swing, cyl(.006 * scale, .006 * scale, .16 * scale, TH.brass, 4), Math.cos(i * 2.1) * .08 * scale, -.30 * scale, Math.sin(i * 2.1) * .08 * scale);
  }
  add(swing, cyl(.008, .008, .16 * scale, TH.iron, 4), 0, -.08 * scale, 0);   // the cord, last, its top at the anchor
  const phase = rnd() * 6;
  g.userData.tick = (t) => { swing.rotation.z = Math.sin(t * 1.3 + phase) * .06; swing.rotation.x = Math.cos(t * 1.0 + phase) * .035; };
  return g;
}
/** Lamps hung from the underside of a front beam, at the ends where they never cross the line to the food. */
function lamps(g: P, beamY: number, z: number, xs: number[], scale = .9, paper = false) { for (const x of xs) add(g, thaiLamp(scale, paper), x, beamY - .08 - .4 * scale, z); }

const SIGN_TEX: Record<string, THREE.CanvasTexture> = {};
function signTexture(text: string, w: number, h: number, ink: string, paper: string): THREE.CanvasTexture {
  const key = `${text}|${w}|${h}|${ink}|${paper}`; if (SIGN_TEX[key]) return SIGN_TEX[key];
  const W = 256, H = Math.round((256 * h) / w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = ink; ctx.lineWidth = 6; ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.fillStyle = ink; ctx.font = `bold ${Math.min(H * .62, (W * 1.5) / Math.max(3, text.length))}px "Noto Sans Thai", Georgia, serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; SIGN_TEX[key] = tex; return tex;
}
function sign(g: THREE.Object3D, text: string, w: number, h: number, x: number, y: number, z: number, ink = TH.chediGold, paper = TH.lacquerRed, rot = 0) {
  const b = new THREE.Group(); b.position.set(x, y, z); b.rotation.y = rot; g.add(b);
  add(b, box(w + .06, h + .06, .04, TH.teakDark), 0, 0, -.01);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: signTexture(text, w, h, ink, paper), roughness: .85 })); face.position.z = .015; b.add(face);
}

type Style = "central" | "raft" | "shophouse" | "isan" | "lanna" | "kampong" | "sinoPortuguese" | "wang";
const WALLS: Record<Style, { wall: string; roof: string; trim: string; pitch: number; tiled: boolean }> = {
  central: { wall: TH.teak, roof: TH.thatch, trim: TH.teakDark, pitch: .78, tiled: false },
  raft: { wall: TH.bambooPale, roof: TH.thatch, trim: TH.teakDark, pitch: .62, tiled: false },
  shophouse: { wall: TH.stuccoPastel, roof: TH.watOrange, trim: TH.lacquerRed, pitch: .34, tiled: true },
  isan: { wall: "#9C8464", roof: TH.thatch, trim: TH.teakDark, pitch: .70, tiled: false },
  lanna: { wall: TH.teakDark, roof: "#7A5A3A", trim: TH.chediGold, pitch: .50, tiled: false },
  kampong: { wall: "#C9B9A0", roof: TH.thatch, trim: "#2F6F63", pitch: .66, tiled: false },
  sinoPortuguese: { wall: "#E4C8B0", roof: TH.watOrange, trim: TH.stuccoPastel, pitch: .30, tiled: true },
  wang: { wall: TH.stuccoPastel, roof: TH.watOrange, trim: TH.chediGold, pitch: .56, tiled: true },
};
/** A pitched roof over a bay, thatch as split strips or tile as rolls, with a ridge board. Returns the ridge height. */
function roofOver(g: THREE.Object3D, style: Style, w: number, d: number, y: number, z: number) {
  const { roof, pitch, tiled } = WALLS[style], half = (d + .9) / 2, slope = Math.sqrt(half * half + (half * pitch) ** 2);
  for (const side of [-1, 1]) {
    const r = add(g, box(w + .6, .1, slope, roof), 0, y + .16 + (half * pitch) / 2, z + (side * half) / 2);
    r.rotation.x = side * Math.atan(pitch);
    if (tiled) for (let i = 0; i < Math.floor((w + .6) / .3); i++) add(r, cyl(.05, .05, slope, "#B4552A", 6), -(w + .6) / 2 + .15 + i * .3, .06, 0).rotation.x = Math.PI / 2;
    else for (let i = 0; i < Math.floor((w + .6) / .26); i++) add(r, box(.06, .04, slope, "#A48E5A"), -(w + .6) / 2 + .13 + i * .26, .06, 0);
  }
  add(g, box(w + .7, .1, .12, tiled ? "#B4552A" : "#8A7448"), 0, y + .21 + half * pitch, z);
  if (style === "lanna") for (const side of [-1, 1]) {   // the crossed kalae barge boards of a Lanna gable
    for (const lean of [-1, 1]) add(g, box(.06, 1.0, .05, TH.chediGold), side * (w / 2 + .2), y + .55 + half * pitch, z + lean * .1).rotation.z = lean * side * .5;
  }
  return y + .21 + half * pitch;
}
/**
 * An open-front working bay of the region: a house mass behind, back and side walls, a pitched roof, and a front
 * beam on two posts where the lamps hang. The floor is a low plinth inside the walls only, so it never lies
 * coplanar with the town paving, and the front posts stand outside the width of the work surface so neither of
 * them crosses the arrival camera's line to the food.
 */
function shelter(g: P, style: Style, w = 5.2, d = 3.2, h = 2.4, opts: { sign?: string; posts?: boolean; storeys?: number; arcade?: number; stilts?: number } = {}) {
  const { wall, trim } = WALLS[style], zBack = -d / 2 - .6, zFront = d / 2 - .6;
  const lift = opts.stilts ?? 0;
  if (lift) for (const x of [-w / 2 + .3, 0, w / 2 - .3]) for (const z of [zBack + .2, zFront - .2]) add(g, cyl(.09, .11, lift, TH.teakDark, 6), x, lift / 2, z);
  // the house mass behind, its front wall on the bay's back line
  const storeys = opts.storeys ?? 1, hh = 2.5 * storeys;
  add(g, box(w - .3, hh, 2.6, wall), 0, lift + hh / 2, zBack - 1.4);
  for (const side of [-1, 1]) for (let s = 0; s < storeys; s++) for (const dz of [-.72, .72]) {
    add(g, box(.05, .88, .58, trim), side * ((w - .3) / 2 + .02), lift + s * 2.5 + 1.18, zBack - 1.4 + dz);
    add(g, box(.06, .06, .64, WALLS[style].roof), side * ((w - .3) / 2 + .03), lift + s * 2.5 + 1.66, zBack - 1.4 + dz);
  }
  roofOver(g, style, w - .3, 2.6, lift + hh, zBack - 1.4);
  if (storeys > 1) for (let s = 1; s < storeys; s++) for (const x of [-w / 4, w / 4]) { add(g, box(.7, .9, .05, TH.teakDark), x, lift + s * 2.5 + .9, zBack - 1.4 + 1.31); add(g, box(.8, .06, .3, TH.teakDark), x, lift + s * 2.5 + .4, zBack - 1.4 + 1.45); }
  // the bay
  add(g, box(w, .08, d, style === "shophouse" || style === "sinoPortuguese" || style === "wang" ? "#B9B0A0" : TH.teak), 0, lift + .04, -.6);
  add(g, box(w, h, .18, wall), 0, lift + h / 2, zBack);
  for (const x of [-w / 2 + .09, w / 2 - .09]) add(g, box(.18, h, d, wall), x, lift + h / 2, -.6);
  if (opts.arcade) {
    // An arcade springs from short piers and its crown stays under the beam. The first version of this used a
    // half-cylinder turned twice, which read from the arrival camera as two tall curved fins standing above the
    // roof rather than as arches over the bays; the radius is now measured back from the beam.
    const bays = opts.arcade, bw = w / bays, r = Math.min(bw / 2 - .1, (h - .34) / 2);
    const spring = lift + h - r - .12;
    for (let i = 0; i <= bays; i++) add(g, box(.26, spring - lift, .26, trim), -w / 2 + i * bw, lift + (spring - lift) / 2, zFront + .1);
    for (let i = 0; i < bays; i++) {
      const arch = add(g, new THREE.Mesh(new THREE.TorusGeometry(r, .075, 5, 16, Math.PI), mat(trim)), -w / 2 + (i + .5) * bw, spring, zFront + .1);
      add(g, box(bw - .26, .14, .24, trim), -w / 2 + (i + .5) * bw, spring + r + .07, zFront + .1);   // the spandrel band over the crown
      void arch;
    }
  } else for (const x of [-w / 2 + .12, w / 2 - .12]) add(g, cyl(.09, .10, h, TH.teakDark, 6), x, lift + h / 2, zFront + .1);
  const beam = add(g, box(w + .1, .16, .2, TH.teakDark), 0, lift + h + .08, zFront + .1); beam.name = "front-beam";
  add(g, box(w + .1, .16, .2, TH.teakDark), 0, lift + h + .08, zBack);
  roofOver(g, style, w, d, lift + h, -.6);
  if (opts.sign) sign(g, opts.sign, Math.min(2.4, w * .46), .34, 0, lift + h - .32, zFront + .22);
  return { beam, y: lift + h + .08, zFront: zFront + .1, zBack, floor: lift + .08 };
}
/** A light open shade on four posts: a field shelter or a market awning. No walls, so it reads as a shade from above. */
function shade(g: P, w: number, d: number, h: number, x = 0, z = 0, colour = TH.thatch) {
  for (const px of [-w / 2 + .15, w / 2 - .15]) for (const pz of [-d / 2 + .15, d / 2 - .15]) add(g, cyl(.06, .07, h, TH.teakDark, 6), x + px, h / 2, z + pz);
  add(g, box(w, .08, d, colour), x, h + .04, z);
  for (let i = 0; i < Math.floor(w / .3); i++) add(g, box(.05, .04, d, "#A48E5A"), x - w / 2 + .15 + i * .3, h + .10, z);
  const beam = add(g, box(w + .1, .13, .16, TH.teakDark), x, h - .07, z + d / 2 - .15); beam.name = "front-beam";
  return { beam, y: h - .07, zFront: z + d / 2 - .15 };
}
/**
 * A wooden hull: the flat-bottomed `ruea` of the khlongs, drawn in one piece so the market boats, the noodle boat
 * and the `kabang` all share the same water line. The hull bottom sits at -.22, the water surface at 0.
 */
function hull(g: THREE.Object3D, len: number, beam: number, x = 0, z = 0, colour = TH.teakDark) {
  const b = add(g, new THREE.Group(), x, 0, z);
  add(b, box(len * .74, .38, beam, colour), 0, -.02, 0);
  for (const end of [-1, 1]) {                                   // the rising bow and stern
    const tip = add(b, box(len * .16, .34, beam * .62, colour), end * len * .44, .09, 0); tip.rotation.z = end * .28;
    add(b, box(len * .07, .26, beam * .34, colour), end * len * .52, .24, 0).rotation.z = end * .5;
  }
  add(b, box(len * .72, .05, beam - .1, "#8A6844"), 0, .16, 0);   // the floor boards
  for (const side of [-1, 1]) add(b, box(len * .76, .12, .05, TH.teak), 0, .22, (side * beam) / 2);   // the gunwales
  for (let i = 0; i < 3; i++) add(b, box(.05, .14, beam - .12, TH.teak), -len * .24 + i * len * .24, .22, 0);   // the thwarts
  return b;
}

// ---------- boats and vehicles, exported for the Builder's decor as well as for the stands ----------

/**
 * The sea people's `kabang`: a dug-out hull with a notched bow and stern, a palm-thatch roof on four bent poles,
 * and a household living under it. The owner's ruling recast the longtail onto this, because the longtail was
 * built in Sing Buri in the 1930s and this area's band ends in 1910.
 */
export function kabang(seed = 0, withChild = true): P {
  const g = group();
  const b = hull(g, 4.0, 1.15, 0, 0, "#6A4628");
  add(b, box(.30, .26, 1.0, "#5A3B22"), -1.72, .22, 0);                       // the notched stern block
  for (const side of [-1, 1]) {                                                 // the bent poles the roof rides on
    for (const z of [-.35, .35]) add(b, cyl(.035, .04, 1.1, TH.bambooPale, 5), side * .85, .70, z).rotation.z = -side * .30;
  }
  const roof = add(b, new THREE.Group(), 0, 1.10, 0); roof.name = seed === 0 ? "kabang-roof" : "kabang-roof-2";
  add(roof, box(2.5, .07, 1.3, TH.thatch), 0, 0, 0);
  for (let i = 0; i < 9; i++) add(roof, box(.07, .05, 1.34, "#A48E5A"), -1.15 + i * .29, .05, 0);
  for (const side of [-1, 1]) add(roof, box(2.5, .05, .42, "#A48E5A"), 0, -.09, side * .80).rotation.x = side * .45;
  add(b, box(.9, .05, .8, TH.bambooPale), .1, .26, 0);                        // the sleeping platform
  add(b, cyl(.24, .26, .20, TH.clay, 12), -.9, .34, .28);                     // the hearth box, on sand in a tray
  add(b, box(.44, .05, .44, "#9C8464"), -.9, .20, .28);
  for (let i = 0; i < 4; i++) add(b, ball(.07, ["#C9302A", "#8A5A3C", "#D9C089", "#4F7A3A"][i], 6), 1.05, .30, -.3 + i * .2);   // the day's catch and a gourd
  for (let i = 0; i < 5; i++) add(b, box(.30, .012, .07, "#D9B07A"), 1.35, .34 + i * .02, -.24 + i * .12);   // split squid drying on the foredeck
  add(b, cyl(.035, .035, 2.1, TH.teak, 5), 0, .34, -.52).rotation.set(0, .12, 1.45);   // the paddle, lying along the gunwale
  const fisher = boatSeat(b, resident("fisher"), -.55, .05, 1.35, .28);
  const figures: Figure[] = [fisher];
  if (withChild) { const kid = add(b, own(resident("child")), 1.15, .26, .05) as Figure; kid.rotation.y = 1.0; kid.name = "kabang-child"; figures.push(kid); }
  g.userData.figures = figures;
  g.userData.boat = b; g.userData.roof = roof;
  const phase = seed * 1.7;
  g.userData.tick = (t) => { b.rotation.z = Math.sin(t * .9 + phase) * .035; b.rotation.x = Math.cos(t * .7 + phase) * .02; b.position.y = Math.sin(t * .8 + phase) * .025; };
  return g;
}
/**
 * The pulled rickshaw, in Siam from the 1880s: two tall spoked wheels, a folding hood, two shafts and a man
 * between them. Serves both as the `tukTuk` landmark's stand and as the Builder's road decor on TH-R3.
 */
export function rickshaw(passenger = true): P {
  const g = group();
  const body = add(g, new THREE.Group(), 0, 0, 0);
  add(body, box(1.05, .42, .82, TH.lacquerRed), 0, .62, 0);
  add(body, box(1.09, .06, .86, TH.teakDark), 0, .84, 0);
  add(body, box(.10, .50, .80, TH.teakDark), -.52, 1.05, 0);                  // the back rest
  add(body, box(1.0, .05, .30, TH.teakDark), .1, .40, 0);                     // the foot board
  const hood = add(body, new THREE.Group(), -.40, 1.28, 0); hood.name = "rickshaw-hood";
  for (let i = 0; i < 4; i++) add(hood, new THREE.Mesh(new THREE.TorusGeometry(.46 - i * .02, .022, 5, 12, Math.PI), mat(TH.charcoalSmoke)), 0, 0, -.34 + i * .23).rotation.y = Math.PI / 2;
  add(hood, new THREE.Mesh(new THREE.CylinderGeometry(.46, .46, .82, 14, 1, true, 0, Math.PI), mat("#3A3733", { side: THREE.DoubleSide })), 0, 0, 0).rotation.set(Math.PI / 2, 0, -Math.PI / 2);
  const wheels = [-1, 1].map((side) => {
    const w = add(g, new THREE.Group(), -.05, .48, side * .54);
    add(w, new THREE.Mesh(new THREE.TorusGeometry(.46, .045, 6, 16), mat(TH.teakDark)), 0, 0, 0).rotation.y = Math.PI / 2;
    for (let i = 0; i < 10; i++) add(w, cyl(.012, .012, .88, "#C9B489", 4), 0, 0, 0).rotation.z = (i * Math.PI) / 10;
    add(w, cyl(.07, .07, .1, TH.iron, 8), 0, 0, 0).rotation.x = Math.PI / 2;
    return w;
  });
  add(g, cyl(.05, .05, 1.1, TH.iron, 8), -.05, .48, 0).rotation.x = Math.PI / 2;
  const shafts = [-1, 1].map((side) => { const s = add(g, cyl(.035, .045, 2.3, TH.teak, 6), .95, .78, side * .38); s.rotation.set(0, 0, 1.50); return s; });
  const puller = add(g, own(resident("carrier", false)), 2.0, 0, 0); puller.rotation.y = -Math.PI / 2; puller.name = "rickshaw-puller";
  arms(puller).left.rotation.x = -1.35; arms(puller).right.rotation.x = -1.35;
  const figures: Figure[] = [puller];
  if (passenger) figures.push(seatFigure(g, resident("townswoman"), -.05, 0, Math.PI / 2, .87));
  g.userData.figures = figures; g.userData.hood = hood; g.userData.wheels = wheels; g.userData.shafts = shafts;
  return g;
}
/** An ox cart for the Isan track and the plain road: two wheels, a woven body, a yoke and one ox. */
export function oxCart(): P {
  const g = group();
  add(g, box(1.9, .34, 1.0, TH.bambooPale), 0, .80, 0);
  for (let i = 0; i < 7; i++) add(g, box(.05, .40, 1.02, "#A48E5A"), -.85 + i * .28, .90, 0);
  add(g, box(1.94, .05, 1.04, TH.teakDark), 0, .64, 0);
  for (const side of [-1, 1]) { const w = add(g, new THREE.Group(), -.1, .52, side * .62); add(w, new THREE.Mesh(new THREE.TorusGeometry(.50, .06, 6, 16), mat(TH.teakDark)), 0, 0, 0).rotation.y = Math.PI / 2; for (let i = 0; i < 8; i++) add(w, cyl(.016, .016, .96, TH.teak, 4), 0, 0, 0).rotation.z = (i * Math.PI) / 8; }
  add(g, cyl(.045, .045, 2.6, TH.teak, 6), 1.2, .70, 0).rotation.z = 1.52;
  add(g, box(.12, .1, .9, TH.teak), 2.4, .78, 0);
  const ox = add(g, new THREE.Group(), 3.1, 0, 0);
  add(ox, ball(.46, "#8A7458", 9), 0, .82, 0).scale.set(1.7, .95, .95);
  add(ox, ball(.24, "#8A7458", 8), .78, .92, 0).scale.set(1.2, .9, .85);
  for (const side of [-1, 1]) add(ox, cone(.05, .30, "#E4DCCB", 6), .84, 1.16, side * .13).rotation.z = -.5 - side * .1;
  for (const [dx, dz] of [[-.5, -.28], [-.5, .28], [.5, -.28], [.5, .28]]) add(ox, cyl(.08, .06, .72, "#7A6648", 6), dx, .36, dz);
  add(ox, cyl(.04, .015, .62, "#7A6648", 5), -.82, .78, 0).rotation.z = .6;
  g.userData.tick = (t) => { ox.children[1].rotation.z = Math.sin(t * .9) * .05; };
  return g;
}

// ---------- the twelve room stands ----------

/**
 * The floating market on its mooring basin: a landing stage on piles behind, four boats gunwale to gunwale in
 * front of it. The cleaver takes the top off a young coconut and the water runs into a cup.
 */
export function floatingMarket(): P {
  const g = group();
  // the landing stage on piles at the back, and a light awning over it: everything in front of the boats is water
  for (const x of [-2.6, -.8, 2.2, 4.0]) for (const z of [-2.95, -1.6]) add(g, cyl(.10, .12, 1.0, TH.teakDark, 6), x, .5, z);
  add(g, box(6.8, .12, 2.0, TH.teak), .7, 1.02, -2.2);
  for (let i = 0; i < 21; i++) add(g, box(.28, .04, 2.0, "#8A6844"), -2.55 + i * .32, 1.10, -2.2);
  const sh = shade(g, 5.4, 1.9, 2.55, .7, -2.2);
  lamps(g, sh.y, sh.zFront, [-1.4, 2.8], .85);
  for (let i = 0; i < 5; i++) add(g, cyl(.08, .06, .30, TH.bambooPale, 8), -2.2 + i * .34, 1.23, -2.75);   // baskets stacked on the stage
  // a bunch of young coconuts hung from the awning beam: the always-on sway
  const bunch = add(g, new THREE.Group(), 1.9, sh.y - .16, sh.zFront - .05); bunch.userData.foodReaction = "sway";
  add(bunch, cyl(.012, .012, .20, "#6E6350", 4), 0, -.10, 0);
  for (let i = 0; i < 5; i++) add(bunch, ball(.13, "#8FA84A", 7), Math.cos(i * 1.26) * .13, -.32, Math.sin(i * 1.26) * .13);
  // the hero boat, moored square to the stage, with the chopping plank across the thwarts at its front
  const boat = hull(g, 4.6, 1.30, -.2, .35);
  add(boat, box(1.20, .06, .90, "#9C7A4A"), -.95, .30, 0);                      // the chopping plank, on the end the visitor arrives at
  for (let i = 0; i < 7; i++) add(boat, ball(.155, "#8FA84A", 8), 1.5 - (i % 4) * .34, .35, -.26 + Math.floor(i / 4) * .32);   // young coconuts amidships
  for (let i = 0; i < 6; i++) add(boat, ball(.10, i % 2 ? "#E0A92C" : "#D98A2C", 7), .35 - (i % 3) * .2, .33, -.32 + Math.floor(i / 3) * .3).scale.set(1.35, .85, .85);   // mangoes
  for (let i = 0; i < 5; i++) { const r = add(boat, ball(.075, "#B4342A", 7), .3 - i * .16, .33, .38); for (let k = 0; k < 7; k++) add(r, cyl(.008, .004, .09, "#7A9B3A", 4), Math.cos(k) * .06, Math.sin(k * .8) * .05, Math.sin(k) * .06).rotation.set(k, k * .7, k); }   // rambutan
  const durian = add(boat, ball(.20, "#A8B85A", 9), 1.9, .38, .22);
  for (let k = 0; k < 16; k++) { const s = add(durian, cone(.045, .10, "#96A84E", 4), Math.cos(k * 1.1) * .19, Math.sin(k * .7) * .16, Math.sin(k * 1.1) * .19); s.lookAt(V(0, 0, 0)); s.rotateX(Math.PI / 2); }
  for (let i = 0; i < 4; i++) add(boat, cyl(.035, .03, .34, "#7FA84A", 5), 1.1 - i * .1, .48, -.36).rotation.z = .12;   // morning glory in a bundle
  // the coconut being opened: the top lifts off, the water falls into the cup, the cleaver follows
  const nut = add(boat, ball(.175, "#8FA84A", 10), -1.0, .46, .04); nut.scale.y = .95;
  const top = add(boat, new THREE.Group(), -1.0, .62, .04); top.name = "market-coconut-top";
  add(top, cyl(.115, .135, .05, "#A8B85A", 12), 0, 0, 0);
  add(top, cyl(.10, .10, .015, TH.riceWhite, 12), 0, .028, 0);
  const cup = add(boat, cyl(.075, .062, .14, TH.bambooPale, 12), -1.0, .37, .52); cup.name = "market-cup";
  add(boat, cyl(.065, .055, .05, "#DCE9E2", 12), -1.0, .44, .52);
  const water = pourFall(boat, "market-coconut-water", "#E4F0EA", .022);
  const rings = splashRings(boat, 3, -1.0, .45, .52, .055, "#E4F0EA");
  const vendor = add(boat, own(resident("vendor")), -.45, .21, -.08) as Figure; vendor.rotation.y = -1.25;
  const cleaver = add(arms(vendor).right, box(.26, .02, .09, "#9AA0A6"), .04, arms(vendor).hand - .04, .14);
  add(cleaver, box(.10, .03, .05, TH.teakDark), -.17, 0, 0);
  arms(vendor).right.rotation.x = -.85;
  const paddler = boatSeat(boat, resident("paddler"), 1.55, .0, 1.35, .28);
  const paddle = add(arms(paddler).right, cyl(.02, .02, .92, TH.teak, 5), .02, arms(paddler).hand - .04, .08); paddle.rotation.x = .5;
  add(paddle, box(.15, .36, .02, "#9C7A4A"), 0, -.38, 0);   // the blade dips to the waterline, not through the table
  // two neighbouring boats moored beyond the hero, one buyer leaning across, one seller with her own load
  const left = hull(g, 3.8, 1.15, 4.3, .15); left.rotation.y = .16;
  for (let i = 0; i < 6; i++) add(left, box(.24, .16, .24, ["#C9302A", "#E0A92C", "#7FA84A", "#D9B07A"][i % 4]), -1.1 + (i % 3) * .5, .30, -.22 + Math.floor(i / 3) * .3);
  const buyer = boatSeat(left, resident("townswoman"), .55, .05, -1.15, .28);
  const right = hull(g, 3.6, 1.10, 2.1, 1.95); right.rotation.y = -.2;
  for (let i = 0; i < 4; i++) add(right, cyl(.15, .12, .22, TH.bambooPale, 10), -.9 + i * .5, .34, 0);
  for (let i = 0; i < 4; i++) add(right, ball(.09, "#E8D06A", 6), -.9 + i * .5, .49, 0).scale.y = .6;
  const seller = boatSeat(right, resident("vendor", false), .2, .1, -1.6, .28);
  // the stage: a porter with a shoulder pole, a woman counting, a child, and a walker along the boards
  const porter = add(g, own(resident("carrier", false)), -1.9, 1.14, -2.05) as Figure; porter.rotation.y = 1.3;
  add(porter, cyl(.02, .02, 1.7, TH.teak, 4), .17, .95, .05).rotation.x = Math.PI / 2;
  for (const z of [-.72, .72]) { add(porter, cyl(.01, .01, .34, "#8A6844", 3), .17, .72, z); const bk = add(porter, cyl(.20, .15, .16, TH.bambooPale, 8), .17, .50, z); for (let k = 0; k < 4; k++) add(bk, ball(.08, ["#7FA84A", "#C9302A", "#E0A92C", "#8FA84A"][k], 5), (k % 2 - .5) * .16, .10, (Math.floor(k / 2) - .5) * .16); }
  const counter = add(g, resident("townswoman", false), 1.3, 1.14, -2.60) as Figure; counter.rotation.y = .3;
  const child = add(g, own(resident("child")), 2.6, 1.14, -1.80) as Figure; child.rotation.y = -.6;
  const walker = resident("townsman", false); add(g, walker, -2.4, 1.14, -1.85);
  const walk = pacer(walker, V(-2.4, 1.14, -1.85), V(3.8, 1.14, -2.35), .30, 1.4);
  const nutRest = nut.position.clone(), topRest = top.position.clone();
  return life(g, "floatingMarket", [vendor, buyer, paddler, seller, porter, counter, child, walker], (t, k) => {
    // every hull rides the basin: the always-on loop, under everything else
    boat.rotation.z = Math.sin(t * .85) * .028 * (1 - beat(k, .5, 1) * .7); boat.position.y = Math.sin(t * .7) * .022;
    left.rotation.z = Math.sin(t * .9 + 1.2) * .03; right.rotation.z = Math.sin(t * .8 + 2.4) * .03;
    // 1. food first: the cleaver comes down, the top lifts clear and tips, and the water falls into the cup
    const cut = beat(k, 0, .55), pour = k > 0 ? clamp01(((1 - k) - .16) / .50) : 0;
    // the cleaver flicks the lid up and away over the far gunwale, so it never stands in front of the nut
    top.position.copy(topRest);
    top.position.y = topRest.y + cut * .34 + pour * .04;
    top.position.z = topRest.z - cut * .34; top.position.x = topRest.x - cut * .46;
    top.rotation.z = -cut * 1.5; top.rotation.x = cut * .5;
    // the opened nut is lifted and held over the cup, so the water falls into it rather than across the boat
    const hold = beat(k, .10, .96);
    nut.position.copy(nutRest);
    nut.position.y = nutRest.y + hold * .36; nut.position.z = nutRest.z + hold * .34;
    nut.rotation.z = Math.sin(t * .85) * .01 - cut * .10 - hold * .85;
    const running = pour > .04 && pour < .94;
    water.set(V(nut.position.x + .04, nut.position.y + .02, nut.position.z + .06), V(cup.position.x, cup.position.y + .10, cup.position.z), running);
    rings.forEach((r, i) => { const a = (pour * 2.4 - i * .22); r.visible = running && a > 0 && a < 1; const s = .4 + a * 1.5; r.scale.set(s, s, 1); (r.material as THREE.MeshStandardMaterial).opacity = Math.max(0, .8 - a * .8); });
    // 2. the vendor's wrist follows the cleaver, 3. the paddler steadies the boat and the buyer leans across
    arms(vendor).right.rotation.x = -.85 - cut * .7;
    upper(vendor).rotation.x = cut * .12;
    paddle.rotation.x = .55 + beat(k, .35, .9) * .5; arms(paddler).right.rotation.x = -.2 - beat(k, .35, .9) * .45;
    upper(buyer).rotation.x = .06 + beat(k, .5, 1) * .30; upper(buyer).rotation.y = -.2 + beat(k, .5, 1) * .2;
    bunch.rotation.z = Math.sin(t * 1.1) * .06;
    walk(t);
  });
}

/**
 * The noodle boat at its landing stage: one charcoal pot amidships, small bowls handed up over the gunwale to
 * eaters sitting on the quay. The ladle lifts out of the pot and pours broth into a bowl.
 */
export function noodleBoat(): P {
  const g = group();
  // the quay the eaters sit on, at the back; the boat lies in front of it, and nothing stands beyond the boat
  for (const x of [-1.6, .4, 2.4, 4.2]) add(g, cyl(.10, .12, 1.0, TH.teakDark, 6), x, .5, -2.7);
  add(g, box(6.4, .12, 2.2, TH.teak), 1.2, 1.02, -2.2);
  for (let i = 0; i < 20; i++) add(g, box(.28, .04, 2.2, "#8A6844"), -1.85 + i * .32, 1.10, -2.2);
  const sh = shade(g, 5.0, 2.0, 2.6, 1.2, -2.2);
  lamps(g, sh.y, sh.zFront, [-.7, 3.1], .85);
  const by = bench(g, 1.2, -2.9, 4.0, 0, 1.44);
  const eaters = [seatFigure(g, resident("townsman"), -.2, -2.9, .1, by), seatFigure(g, resident("teochew", false), 1.2, -2.9, 0, by), seatFigure(g, resident("townswoman"), 2.6, -2.9, -.1, by)];
  for (const [i, x] of [-.2, 1.2, 2.6].entries()) {   // their bowls on the quay boards, chopsticks across
    const bowl = add(g, cyl(.12, .085, .10, TH.riceWhite, 12), x, 1.14, -1.7);
    add(g, cyl(.10, .10, .03, TH.broth, 12), x, 1.22, -1.7);
    for (let n = 0; n < 4; n++) add(g, cyl(.018, .014, .09, i % 2 ? "#E4DCCB" : "#D9C089", 5), x + (n - 1.5) * .03, 1.25, -1.7).rotation.x = .3;
    for (const dz of [-.02, .02]) add(g, cyl(.006, .006, .22, TH.bambooPale, 4), x + .13, 1.27, -1.7 + dz).rotation.set(.1, 0, 1.2);
    void bowl;
  }
  add(g, cyl(.13, .11, .16, TH.clay, 10), 3.5, 1.14, -1.8); for (let i = 0; i < 4; i++) add(g, cone(.028, .12, TH.lacquerRed, 5), 3.5 + Math.cos(i * 1.6) * .05, 1.26, -1.8 + Math.sin(i * 1.6) * .05);   // the chilli jar the eaters season from
  // the boat: the charcoal pot amidships, the stock pot on it, the bowls stacked on a plank
  const boat = hull(g, 5.4, 1.35, .2, -.35);
  add(boat, box(.62, .05, .70, "#9C8464"), .1, .21, 0);
  const brazier = add(boat, cyl(.30, .34, .34, TH.clay, 14), .1, .38, 0);
  for (let i = 0; i < 6; i++) add(brazier, box(.09, .07, .09, TH.charcoalSmoke), Math.cos(i) * .14, .16, Math.sin(i) * .14);
  const flames = Array.from({ length: 3 }, (_, i) => { const f = add(boat, cone(.07, .20, i % 2 ? TH.flameHot : TH.flame, 6), .1 + Math.cos(i * 2.1) * .11, .58, Math.sin(i * 2.1) * .11); f.name = "noodle-flame"; return f; });
  const pot = add(boat, cyl(.36, .30, .34, TH.brass, 16), .1, .74, 0);
  add(boat, new THREE.Mesh(new THREE.TorusGeometry(.36, .025, 5, 16), mat(TH.brass)), .1, .90, 0).rotation.x = Math.PI / 2;
  const broth = add(boat, cyl(.32, .32, .04, TH.broth, 16), .1, .89, 0);
  const bits = Array.from({ length: 8 }, (_, i) => add(boat, ball(.035, i % 3 ? "#8A5A3C" : "#4F7A3A", 5), .1 + Math.cos(i * .78) * .2, .91, Math.sin(i * .78) * .2));
  void pot; void broth;
  add(boat, box(.85, .05, .80, "#9C7A4A"), -1.05, .30, 0);                      // the serving plank, on the end the visitor arrives at
  for (let i = 0; i < 6; i++) add(boat, cyl(.105, .08, .075, TH.riceWhite, 10), -.82 - (i % 3) * .24, .37 + Math.floor(i / 3) * .08, -.22);   // the stack of small bowls
  const bowl = add(boat, new THREE.Group(), -1.15, .35, .28); bowl.name = "noodle-bowl";
  add(bowl, cyl(.115, .082, .10, TH.riceWhite, 12), 0, .05, 0);
  const fill = add(bowl, cyl(.095, .095, .03, TH.broth, 12), 0, .085, 0); fill.name = "noodle-fill";
  for (let i = 0; i < 4; i++) add(bowl, cyl(.018, .014, .085, "#E4DCCB", 5), (i - 1.5) * .028, .11, 0).rotation.x = .25;
  add(bowl, ball(.032, "#9C4A3A", 5), .03, .12, .03).scale.set(1.5, .7, 1);      // a slice of beef
  add(bowl, box(.06, .012, .05, "#4F7A3A"), -.04, .115, -.02);                   // morning glory
  for (let i = 0; i < 5; i++) add(boat, cyl(.028, .024, .26, "#7FA84A", 5), 1.75, .34 + i * .02, -.1 + i * .06).rotation.z = 1.5;   // greens in a bundle on the bow
  for (let i = 0; i < 3; i++) add(boat, cyl(.11, .09, .14, TH.clay, 10), 1.3 - i * .24, .32, .3);   // the seasoning crocks
  // the ladle: the subject. It lifts out of the pot and the broth falls into the bowl
  const ladle = add(boat, new THREE.Group(), .1, .95, .12); ladle.name = "noodle-ladle";
  add(ladle, new THREE.Mesh(new THREE.SphereGeometry(.085, 9, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(TH.brass)), 0, 0, 0);
  add(ladle, cyl(.075, .075, .02, TH.broth, 10), 0, -.02, 0);
  add(ladle, cyl(.013, .013, .46, TH.teak, 5), 0, .22, -.05).rotation.x = -.18;
  const pour = pourFall(boat, "noodle-broth", TH.broth, .026);
  const rings = splashRings(boat, 3, -1.15, .43, .28, .05, "#D9A86A");
  const cook = add(boat, own(resident("cook")), .75, .21, .08) as Figure; cook.rotation.y = -1.2;
  add(boat, box(.48, .05, .52, "#9C8464"), .75, .19, .08);
  const poler = boatSeat(boat, resident("paddler"), 2.0, .0, -1.4, .28);
  const pole = add(arms(poler).right, cyl(.022, .026, 1.62, TH.bambooPale, 5), .02, arms(poler).hand - .18, .05); pole.rotation.x = .35;
  const child = add(g, own(resident("child")), 4.1, 1.14, -1.85) as Figure; child.rotation.y = -1.0;
  const waiter = resident("server", false); add(g, waiter, -1.4, 1.14, -1.95);
  const walk = pacer(waiter, V(-1.4, 1.14, -1.95), V(4.0, 1.14, -2.5), .28, .8);
  g.userData.steam = V(.3, 1.30, -.35); g.userData.smoke = V(.3, .95, -.35);
  const ladleRest = ladle.position.clone(), fillRest = fill.scale.clone();
  return life(g, "kuaitiaoRuea", [cook, eaters[0], poler, ...eaters.slice(1), child, waiter], (t, k) => {
    boat.rotation.z = Math.sin(t * .8) * .025; boat.position.y = Math.sin(t * .65) * .02;
    flames.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .18 + beat(k, 0, .6) * .5; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    bits.forEach((b, i) => { b.position.y = .91 + Math.max(0, Math.sin(t * 3.4 + i * .9)) * .018; });
    // 1. the ladle lifts clear of the pot and tips, and the broth falls into the bowl on the plank
    const lift = hold(k, .28, .78), tip = hold(k, .40, .80), run = tip;
    ladle.position.copy(ladleRest);
    ladle.position.y = ladleRest.y + lift * .34; ladle.position.z = ladleRest.z + lift * .30; ladle.position.x = ladleRest.x - lift * 1.12;
    ladle.rotation.z = tip * 1.0;
    const running = tip > .15;
    const lipLocal = V(ladle.position.x + .04, ladle.position.y - .10, ladle.position.z);
    pour.set(lipLocal, V(bowl.position.x, bowl.position.y + .12, bowl.position.z), running);
    fill.scale.copy(fillRest); fill.scale.y = fillRest.y * (1 + run * 1.9);
    rings.forEach((r, i) => { const a = run * 2.2 - i * .2; r.visible = running && a > 0 && a < 1; const s = .4 + a * 1.4; r.scale.set(s, s, 1); (r.material as THREE.MeshStandardMaterial).opacity = Math.max(0, .8 - a * .8); });
    // 2. the cook turns to the plank, 3. one eater on the stage reaches down over the gunwale
    upper(cook).rotation.y = Math.sin(t * .4) * .06 + beat(k, .3, .95) * .55;
    arms(cook).right.rotation.x = -.5 - beat(k, .1, .8) * .9;
    upper(eaters[1]).rotation.x = .05 + beat(k, .52, 1) * .34;
    arms(eaters[1]).right.rotation.x = -.9 - beat(k, .52, 1) * .7;
    pole.rotation.x = .35 + Math.sin(t * .5) * .05;
    walk(t);
  });
}

/**
 * The household kitchen of a noble compound: a tiled open-sided pavilion inside a whitewashed wall, where
 * *Mae Khrua Hua Pa* was written down from 1888. The small knife turns a chilli into a flower and it opens.
 */
export function wangKitchen(): P {
  const g = group();
  const sh = shelter(g, "wang", 6.0, 3.4, 2.5, { arcade: 3 });
  lamps(g, sh.y, sh.zFront, [-2.7, 2.7]);
  // the compound wall behind, whitewashed, with a tiled coping; it stands behind the house, never in the view
  add(g, box(9.0, 2.1, .3, TH.stuccoPastel), 0, 1.05, sh.zBack - 3.3);
  add(g, box(9.2, .14, .5, TH.watOrange), 0, 2.18, sh.zBack - 3.3);
  for (let i = 0; i < 12; i++) add(g, box(.42, .42, .03, i % 2 ? TH.pelangiBlue : TH.stuccoPastel), -2.5 + i * .46, .5, sh.zBack + .11);   // the tiled dado
  // the low work table, the recorded recipes and the brass trays: everything the room is about is on it
  const ty = table(g, 0, 1.15, 3.1, 1.15, TH.teak, .72);
  const board = add(g, box(.82, .045, .58, "#9C7A4A"), -.15, ty + .022, 1.35);
  void board;
  // the carved chilli: the subject. The petals open outward as the knife turns it
  const flower = add(g, new THREE.Group(), -.15, ty + .09, 1.42); flower.name = "wang-chilli-flower";
  add(flower, cone(.038, .20, "#B4342A", 7), 0, .02, 0).rotation.x = Math.PI;
  const petals = Array.from({ length: 6 }, (_, i) => {
    const p = add(flower, new THREE.Group(), 0, .05, 0); p.rotation.y = (i * Math.PI * 2) / 6;
    const blade = add(p, box(.035, .012, .13, "#C9402E"), 0, 0, .055); blade.rotation.x = -.15;
    return p;
  });
  add(flower, cyl(.008, .006, .12, "#4F7A3A", 4), 0, .14, 0);
  for (let i = 0; i < 4; i++) add(g, cone(.032, .17, "#B4342A", 6), .18 + i * .09, ty + .03, 1.48).rotation.z = 1.4 + i * .2;   // the chillies still to carve
  // carved fruit and vegetables, a betel set, three curries on a brass tray, the manuscript on its stand
  const carved = add(g, new THREE.Group(), .7, ty + .04, 1.2);
  for (let i = 0; i < 3; i++) { const f = add(carved, ball(.10, ["#E0A92C", "#D9C089", "#B8496A"][i], 9), i * .26, .09, 0); for (let k = 0; k < 8; k++) add(f, box(.022, .012, .07, ["#C98A1C", "#C9A86A", "#9C3A56"][i]), Math.cos(k * .78) * .075, .05, Math.sin(k * .78) * .075).rotation.y = -k * .78; }
  const tray = add(g, cyl(.42, .40, .035, TH.brass, 20), -1.15, ty + .02, .95);
  for (let i = 0; i < 3; i++) { add(g, cyl(.13, .10, .07, TH.riceWhite, 12), -1.15 + Math.cos(i * 2.1) * .21, ty + .07, .95 + Math.sin(i * 2.1) * .21); add(g, cyl(.11, .11, .025, ["#B4542A", TH.chediGold, "#4F7A3A"][i], 12), -1.15 + Math.cos(i * 2.1) * .21, ty + .11, .95 + Math.sin(i * 2.1) * .21); }
  void tray;
  add(g, cyl(.20, .18, .07, TH.riceWhite, 14), 1.35, ty + .035, .85); add(g, ball(.17, TH.riceWhite, 10), 1.35, ty + .10, .85).scale.y = .55;   // a bowl of jasmine rice
  const betel = add(g, new THREE.Group(), -1.4, .0, -.1);
  add(betel, cyl(.24, .22, .10, TH.brass, 16), 0, .05, 0);
  for (let i = 0; i < 4; i++) add(betel, cyl(.065, .06, .07, TH.brass, 10), Math.cos(i * 1.57) * .11, .13, Math.sin(i * 1.57) * .11);
  for (let i = 0; i < 3; i++) add(betel, box(.09, .012, .07, "#4F7A3A"), Math.cos(i) * .06, .18, Math.sin(i) * .06).rotation.y = i;
  const desk = add(g, new THREE.Group(), 2.05, 0, .15);
  add(desk, box(.72, .05, .5, TH.teak), 0, .42, 0); for (const dx of [-.3, .3]) for (const dz of [-.2, .2]) add(desk, box(.06, .42, .06, TH.teakDark), dx, .21, dz);
  const folio = add(desk, box(.34, .02, .24, "#E9E2D2"), -.05, .46, 0); folio.rotation.z = -.05;
  add(desk, box(.30, .012, .2, "#DCD3BC"), -.05, .48, .02);
  add(desk, cyl(.028, .028, .05, TH.iron, 8), .22, .45, -.1);
  // the charcoal stove at the end of the pavilion: the one hot source
  const stove = add(g, cyl(.30, .34, .40, TH.clay, 14), -2.25, .20, 1.25);
  for (let i = 0; i < 5; i++) add(stove, box(.09, .07, .09, TH.charcoalSmoke), Math.cos(i * 1.26) * .13, .18, Math.sin(i * 1.26) * .13);
  const stoveFire = Array.from({ length: 3 }, (_, i) => add(g, cone(.06, .16, i % 2 ? TH.flameHot : TH.flame, 6), -2.25 + Math.cos(i * 2.1) * .1, .44, 1.25 + Math.sin(i * 2.1) * .1));
  add(g, cyl(.28, .24, .22, TH.brass, 16), -2.25, .54, 1.25);
  const simmer = Array.from({ length: 5 }, (_, i) => add(g, ball(.028, "#C9A83A", 5), -2.25 + Math.cos(i * 1.26) * .15, .65, 1.25 + Math.sin(i * 1.26) * .15));
  g.userData.steam = V(-2.25, .85, 1.25); g.userData.smoke = V(-2.25, .70, 1.25);
  // the mortar the older woman works, on the pavilion floor
  const mortar = add(g, cyl(.15, .18, .22, TH.limestoneGrey, 14), 1.05, sh.floor + .11, -.35);
  add(g, cyl(.12, .12, .04, "#6E8A3A", 12), 1.05, sh.floor + .21, -.35);
  const pestleW = add(g, cyl(.035, .045, .30, TH.limestoneGrey, 8), 1.05, sh.floor + .38, -.35);
  void mortar;
  // seven women and a child: the carver, the older woman at the tray, two kitchen hands, the scribe, a servant
  const carver = add(g, own(resident("noble")), -.15, sh.floor, .35) as Figure; carver.rotation.y = Math.PI;
  const knife = add(arms(carver).right, box(.11, .014, .035, "#C9CFD6"), .02, arms(carver).hand - .03, .07);
  add(knife, box(.05, .022, .03, TH.teakDark), -.075, 0, 0);
  arms(carver).right.rotation.x = -1.25; arms(carver).left.rotation.x = -1.15;
  const elder = add(g, own(resident("noble", false)), -1.15, sh.floor, .25) as Figure; elder.rotation.y = 2.5;
  const hand1 = sit(g, 1.05, -.75, 0, "vendor", .32);
  const hand2 = add(g, own(resident("townswoman", false)), -2.25, sh.floor, .55) as Figure; hand2.rotation.y = -2.5;
  arms(hand2).right.rotation.x = -.9;
  const fanner = add(arms(hand2).right, box(.20, .22, .02, TH.bambooPale), 0, arms(hand2).hand - .09, .04);
  const scribe = sit(g, 2.05, -.5, .2, "scribe", .40);
  const child = add(g, own(resident("child")), 1.85, sh.floor, 1.05) as Figure; child.rotation.y = Math.PI - .5;
  const servant = resident("townswoman", false); add(g, servant, -2.8, 0, 2.3);
  const walk = pacer(servant, V(-2.8, 0, 2.3), V(2.6, 0, 2.5), .28, 1.1);
  return life(g, "wangKitchenTh", [carver, elder, hand1, hand2, scribe, child, servant], (t, k) => {
    stoveFire.forEach((f, i) => { const s = .85 + Math.sin(t * 8 + i * 2) * .15; f.scale.set(s, s, s); });
    simmer.forEach((b, i) => { b.position.y = .65 + Math.max(0, Math.sin(t * 3 + i)) * .022; });
    // 1. food first: the chilli opens. The petals turn out and back and the whole flower lifts a little
    const open = beat(k, 0, .68);
    petals.forEach((p, i) => { p.rotation.z = -open * (.95 + (i % 3) * .12); p.rotation.y = (i * Math.PI * 2) / 6 + open * .18; });
    flower.position.y = ty + .09 + open * .05; flower.rotation.y = open * .8;
    // 2. the carver's hands follow, 3. the older woman at the tray looks over, then the girl fans the stove
    arms(carver).right.rotation.x = -1.25 - beat(k, .3, .9) * .25; arms(carver).right.rotation.z = beat(k, .3, .9) * .3;
    arms(carver).left.rotation.x = -1.15 - beat(k, .3, .9) * .12;
    upper(elder).rotation.y = 0 + Math.sin(t * .4) * .06 + beat(k, .5, 1) * .5;
    fanner.rotation.z = Math.sin(t * 5) * .25 + Math.sin(t * 14) * .3 * beat(k, .4, 1);
    pestleW.position.y = sh.floor + .38 + Math.abs(Math.sin(t * 1.6)) * .05;
    walk(t);
  });
}

/**
 * The curry mortar on Sampheng lane: granite, a quarter of an hour of pounding, and coconut cream fried in a
 * brass pan until the oil splits. The pestle comes down and the paste moves under it; the cream ring widens.
 */
export function curryKitchen(): P {
  const g = group();
  const sh = shelter(g, "shophouse", 5.6, 3.2, 2.5, { sign: "แกง", storeys: 2 });
  lamps(g, sh.y, sh.zFront, [-2.5, 2.5], .9, true);
  for (let i = 0; i < 9; i++) add(g, box(.5, .5, .03, i % 2 ? TH.pelangiBlue : TH.stuccoPastel), -2.1 + i * .5, .5, sh.zBack + .11);
  // the granite mortar on its own block, at the front of the bay where the arrival camera reaches it
  const block = add(g, box(.9, .62, .8, TH.teak), -1.0, .31, 1.25); void block;
  const mortar = add(g, new THREE.Group(), -1.0, .62, 1.25);
  add(mortar, cyl(.26, .20, .30, TH.limestoneGrey, 16), 0, .15, 0);
  add(mortar, cyl(.27, .27, .05, "#8E8A80", 16), 0, .30, 0);
  add(mortar, cyl(.30, .32, .07, "#8E8A80", 16), 0, .035, 0);
  const paste = add(mortar, cyl(.20, .18, .07, "#5E7A32", 16), 0, .29, 0); paste.name = "curry-paste";
  for (let i = 0; i < 6; i++) add(paste, ball(.032, i % 2 ? "#7A9B3A" : "#B4342A", 5), Math.cos(i * 1.05) * .12, .035, Math.sin(i * 1.05) * .12).scale.y = .6;
  const pestle = add(g, new THREE.Group(), -1.0, 1.02, 1.25); pestle.name = "curry-pestle";
  add(pestle, cyl(.055, .075, .34, TH.limestoneGrey, 10), 0, 0, 0);
  add(pestle, cyl(.045, .05, .10, "#8E8A80", 10), 0, .21, 0);
  // the brass pan on the charcoal stove: the cream ring widens as the oil splits
  const stove = add(g, cyl(.32, .36, .44, TH.clay, 14), 1.25, .22, 1.20);
  for (let i = 0; i < 6; i++) add(stove, box(.09, .07, .09, TH.charcoalSmoke), Math.cos(i) * .14, .20, Math.sin(i) * .14);
  const fire = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.07, .20, i % 2 ? TH.flameHot : TH.flame, 6), 1.25 + Math.cos(i * 1.6) * .12, .50, 1.20 + Math.sin(i * 1.6) * .12); f.name = "curry-flame"; return f; });
  add(g, cyl(.44, .34, .13, TH.brass, 20), 1.25, .73, 1.20);
  const oil = add(g, cyl(.40, .40, .03, "#E4C46A", 20), 1.25, .80, 1.20);
  const ring = add(g, new THREE.Mesh(new THREE.TorusGeometry(.12, .026, 6, 20), mat("#F2E4C0")), 1.25, .81, 1.20); ring.rotation.x = Math.PI / 2; ring.name = "curry-cream-ring";
  const split = Array.from({ length: 7 }, (_, i) => { const m = add(g, ball(.028, "#C9A83A", 5), 1.25 + Math.cos(i * .9) * .22, .81, 1.20 + Math.sin(i * .9) * .22); return m; });
  void oil;
  g.userData.steam = V(1.25, 1.10, 1.20); g.userData.smoke = V(1.25, .95, 1.20);
  // the ingredients, modelled: shallot, garlic, galangal, lemongrass, kaffir lime, shrimp paste, dried chillies
  const ty = table(g, .1, -.1, 2.6, .9, TH.teak, .70);
  for (let i = 0; i < 5; i++) add(g, ball(.055, "#B4746A", 6), -.9 + i * .1, ty + .05, -.3).scale.set(1, 1.3, 1);
  for (let i = 0; i < 6; i++) add(g, ball(.038, "#E9E2D2", 6), -.5 + (i % 3) * .08, ty + .04, -.32 + Math.floor(i / 3) * .1);
  for (let i = 0; i < 3; i++) add(g, cyl(.05, .035, .22, "#E4D9A8", 8), -.15 + i * .07, ty + .11, -.05).rotation.z = .2;
  for (let i = 0; i < 4; i++) add(g, cyl(.028, .022, .30, "#C9D49A", 6), .25 + i * .06, ty + .04, -.2).rotation.z = 1.5;
  for (let i = 0; i < 5; i++) add(g, ball(.055, "#4F7A3A", 6), .6 + (i % 3) * .1, ty + .05, -.28 + Math.floor(i / 3) * .12).scale.set(1, .85, 1);
  add(g, cyl(.11, .09, .12, TH.clay, 10), 1.05, ty + .06, -.05); add(g, cyl(.09, .09, .03, "#7A5A46", 10), 1.05, ty + .13, -.05);
  const basket = add(g, cyl(.22, .17, .12, TH.bambooPale, 12), -1.25, ty + .06, -.15);
  for (let i = 0; i < 9; i++) add(basket, cone(.026, .15, "#9C2B23", 5), Math.cos(i * .7) * .12, .08, Math.sin(i * .7) * .12).rotation.set(1.3, i, .3);
  // dried spices hanging from the beam: the always-on sway
  const strings = [-1.9, 1.9].map((x, i) => {
    const s = add(g, new THREE.Group(), x, sh.y - .18, sh.zFront - .02); s.userData.foodReaction = "sway";
    add(s, cyl(.01, .01, .22, "#8A6844", 4), 0, -.11, 0);
    for (let n = 0; n < 7; n++) add(s, cone(.03, .16, i ? "#9C2B23" : "#8A6A3A", 5), Math.cos(n * .9) * .06, -.30 - n * .035, Math.sin(n * .9) * .06).rotation.set(.2, n, .25);
    return s;
  });
  // seven people: the pounder, the girl at the stove, two customers, a porter, a child, a walker on the lane
  const pounder = add(g, own(resident("cook")), -1.0, sh.floor, .35) as Figure; pounder.rotation.y = Math.PI;
  arms(pounder).right.rotation.x = -2.1; arms(pounder).left.rotation.x = -1.5;
  const girl = add(g, own(resident("vendor", false)), 1.9, sh.floor, .55) as Figure; girl.rotation.y = -2.3;
  arms(girl).right.rotation.x = -1.0;
  const fan = add(arms(girl).right, box(.20, .22, .02, TH.bambooPale), 0, arms(girl).hand - .09, .04);
  const buyers = [sit(g, -2.3, -.5, .5, "townswoman", .38), sit(g, 2.4, -.6, -.5, "townsman", .38)];
  const porter = add(g, own(resident("carrier", false)), .1, sh.floor, -1.0) as Figure; porter.rotation.y = .4;
  add(porter, cyl(.02, .02, 1.6, TH.teak, 4), .17, .95, .05).rotation.x = Math.PI / 2;
  for (const z of [-.66, .66]) { add(porter, cyl(.01, .01, .3, "#8A6844", 3), .17, .74, z); add(porter, cyl(.18, .14, .15, TH.bambooPale, 8), .17, .53, z); }
  const child = add(g, own(resident("child")), 2.0, sh.floor, -1.15) as Figure; child.rotation.y = -1.2;
  const walker = resident("teochew", false); add(g, walker, -2.9, 0, 2.4);
  const walk = pacer(walker, V(-2.9, 0, 2.4), V(2.7, 0, 2.6), .30, .6);
  const pasteRest = paste.scale.clone(), pestleRest = pestle.position.clone();
  return life(g, "curryPaste", [pounder, buyers[0], girl, buyers[1], porter, child, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .18 + beat(k, 0, .7) * .7; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    // the always-on loop: the paste is being pounded whatever happens, slowly
    const idle = Math.abs(Math.sin(t * 1.5));
    // 1. material first: the pestle drives down and the paste spreads and flattens under it
    const strike = beat(k, 0, .42), spread = beat(k, .05, .70);
    pestle.position.copy(pestleRest);
    pestle.position.y = pestleRest.y - idle * .09 - strike * .22;
    pestle.rotation.z = Math.sin(t * 1.5) * .04;
    paste.scale.copy(pasteRest);
    paste.scale.set(pasteRest.x * (1 + spread * .16), pasteRest.y * (1 - spread * .40), pasteRest.z * (1 + spread * .16));
    paste.rotation.y = spread * .7;
    // the cream ring widens in the pan and the oil beads break out of it
    const widen = beat(k, .10, .95);
    ring.scale.set(1 + widen * 2.1, 1 + widen * 2.1, 1 + widen * .5);
    (ring.material as THREE.MeshStandardMaterial).opacity = 1;
    split.forEach((m, i) => { const a = widen * (.6 + (i % 3) * .18); m.position.y = .81 + Math.max(0, Math.sin(t * 4 + i)) * .014 + a * .05; m.scale.setScalar(.8 + a * .6); });
    // 2. the pounder's arm follows, 3. the girl at the stove fans harder
    arms(pounder).right.rotation.x = -2.1 - strike * .55;
    upper(pounder).rotation.x = idle * .04 + strike * .12;
    fan.rotation.z = Math.sin(t * 6) * .3 + Math.sin(t * 16) * .45 * beat(k, .45, 1);
    strings.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.2 + i) * .05; });
    walk(t);
  });
}

/**
 * The sweets kitchen at Kudi Chin: egg yolk, sugar and coconut over charcoal, and a Portuguese inheritance three
 * hundred years old. The cone draws golden `foi thong` threads down onto the syrup.
 */
export function khanomKitchen(): P {
  const g = group();
  const sh = shelter(g, "central", 5.6, 3.2, 2.5, { sign: "ขนม" });
  lamps(g, sh.y, sh.zFront, [-2.5, 2.5]);
  // the charcoal range at the front of the bay with the brass syrup pan on it
  add(g, box(2.3, .52, 1.0, TH.clay), -.1, .26, 1.20);
  add(g, box(2.34, .06, 1.04, "#7A5A46"), -.1, .55, 1.20);
  for (let i = 0; i < 7; i++) add(g, box(.10, .08, .10, TH.charcoalSmoke), -.9 + i * .26, .60, 1.34);
  const fire = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.07, .18, i % 2 ? TH.flameHot : TH.flame, 6), -.7 + i * .38, .66, 1.34); f.name = "khanom-flame"; return f; });
  const pan = add(g, cyl(.52, .44, .12, TH.brass, 22), -.1, .64, 1.14);
  const syrup = add(g, cyl(.48, .48, .035, "#E8C24A", 22), -.1, .71, 1.14);
  void pan;
  const bubbles = Array.from({ length: 8 }, (_, i) => add(g, ball(.026, "#F2E0A0", 5), -.1 + Math.cos(i * .78) * .3, .72, 1.14 + Math.sin(i * .78) * .3));
  g.userData.steam = V(-.1, 1.00, 1.14); g.userData.smoke = V(-.1, .82, 1.34);
  // the threads: the subject. A brass cone held over the pan draws them down onto the syrup in a coil
  const cone1 = add(g, new THREE.Group(), -.1, 1.14, 1.02); cone1.name = "khanom-cone";
  add(cone1, cyl(.09, .02, .16, TH.brass, 10), 0, 0, 0);
  add(cone1, new THREE.Mesh(new THREE.TorusGeometry(.08, .012, 5, 12, Math.PI), mat(TH.brass)), .05, .07, 0).rotation.z = -1.2;
  const threads = add(g, new THREE.Group(), -.1, .72, 1.14); threads.name = "foi-thong-threads";
  const strands = Array.from({ length: 7 }, (_, i) => {
    const s = add(threads, cyl(.008, .008, .40, "#E8C24A", 5), Math.cos(i * .9) * .07, .20, Math.sin(i * .9) * .07);
    s.material = mat("#EFCB55", { emissive: "#C79B3B", emissiveIntensity: .25 });
    s.visible = false; return s;
  });
  const coil = add(threads, new THREE.Mesh(new THREE.TorusGeometry(.13, .022, 6, 18), mat("#E8C24A")), 0, .02, 0); coil.rotation.x = Math.PI / 2;
  // the finished sweets on the rack: foi thong coils, thong yip cups, met khanun, khanom mo kaeng squares
  const rack = add(g, new THREE.Group(), 1.9, 0, .55);
  for (let s = 0; s < 3; s++) { add(rack, box(1.1, .05, .62, TH.teak), 0, .52 + s * .32, 0); for (const dx of [-.5, .5]) add(rack, box(.06, .95, .06, TH.teakDark), dx, .48, -.26); }
  for (let s = 0; s < 3; s++) for (let i = 0; i < 4; i++) {
    const x = -.4 + i * .27, y = .56 + s * .32;
    if (s === 0) { const c = add(rack, new THREE.Mesh(new THREE.TorusGeometry(.065, .022, 5, 12), mat("#E8C24A")), x, y, 0); c.rotation.x = Math.PI / 2; }
    else if (s === 1) { add(rack, cone(.055, .07, "#EFCB55", 6), x, y + .03, 0); add(rack, cyl(.05, .04, .015, "#D9B04A", 8), x, y, 0); }
    else { add(rack, box(.11, .05, .11, "#C98A4A"), x, y + .025, 0); add(rack, box(.105, .012, .105, "#E8C24A"), x, y + .055, 0); }
  }
  // the ingredients: a basket of duck eggs, a bowl of split yolks, palm sugar cakes, pandan, grated coconut
  const ty = table(g, -2.0, .35, 1.7, .95, TH.teak, .70);
  const eggs = add(g, cyl(.24, .19, .13, TH.bambooPale, 12), -2.45, ty + .065, .35);
  for (let i = 0; i < 7; i++) add(eggs, ball(.055, "#E9E2D2", 7), Math.cos(i * .9) * .11, .09, Math.sin(i * .9) * .11).scale.set(1, 1.25, 1);
  add(g, cyl(.16, .13, .07, TH.riceWhite, 12), -1.85, ty + .035, .3);
  for (let i = 0; i < 4; i++) add(g, ball(.045, "#E8A62C", 6), -1.85 + Math.cos(i * 1.57) * .06, ty + .08, .3 + Math.sin(i * 1.57) * .06).scale.y = .8;
  for (let i = 0; i < 3; i++) add(g, cyl(.075, .075, .05, "#9C6A32", 12), -1.5, ty + .025 + i * .05, .5);
  for (let i = 0; i < 4; i++) add(g, box(.04, .012, .30, "#3F7A3A"), -1.45 + i * .05, ty + .02, .2).rotation.z = .08;
  add(g, cyl(.15, .12, .08, TH.clay, 12), -1.45, ty + .04, -.02); add(g, ball(.13, TH.riceWhite, 8), -1.45, ty + .10, -.02).scale.y = .45;
  // seven people: the maker, the child at the rack, two who mix and split eggs, a customer, a monk passing, a walker
  const maker = add(g, own(resident("vendor")), -.1, sh.floor, .42) as Figure; maker.rotation.y = Math.PI;
  arms(maker).right.rotation.x = -1.6; arms(maker).left.rotation.x = -.5;
  const child = add(g, own(resident("child")), 1.85, sh.floor, -.15) as Figure; child.rotation.y = -.3;
  const splitter = sit(g, -2.0, -.45, .1, "townswoman", .36);
  const mixer = add(g, own(resident("cook", false)), -2.55, sh.floor, .95) as Figure; mixer.rotation.y = -2.0;
  arms(mixer).right.rotation.x = -1.2;
  add(arms(mixer).right, cyl(.016, .016, .34, TH.teak, 4), 0, arms(mixer).hand - .15, .03).rotation.x = .4;
  const customer = sit(g, 2.6, -.9, -.6, "townsman", .38);
  const monk = add(g, own(resident("monk")), 2.9, 0, 1.9) as Figure; monk.rotation.y = -1.9;
  const walker = resident("townswoman", false); add(g, walker, -2.9, 0, 2.5);
  const walk = pacer(walker, V(-2.9, 0, 2.5), V(2.5, 0, 2.6), .28, 1.9);
  return life(g, "sweetsTh", [maker, child, splitter, mixer, customer, monk, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .16; f.scale.set(s, s, s); });
    bubbles.forEach((b, i) => { b.position.y = .72 + Math.max(0, Math.sin(t * 3.6 + i * .8)) * .02; });
    // 1. food first: the cone sweeps across the pan and the threads fall from it onto the syrup, which coils
    const draw = beat(k, 0, .72), run = k > 0 ? clamp01((1 - k) / .78) : 0;
    cone1.position.x = -.1 + Math.sin(run * Math.PI * 3) * .26 * (k > 0 ? 1 : 0) + Math.sin(t * .6) * .02;
    cone1.position.y = 1.14 - draw * .16;
    cone1.rotation.z = -.15 - draw * .35;
    strands.forEach((s, i) => {
      s.visible = draw > .06;
      const spread = .07 + draw * .10;
      s.position.set(cone1.position.x + .1 + Math.cos(i * .9) * spread * .3, .20 + draw * .10, 1.14 - .12 + Math.sin(i * .9) * spread);
      s.scale.y = .5 + draw * 1.05; s.rotation.z = Math.sin(t * 5 + i) * .05;
    });
    coil.scale.set(1 + draw * .7, 1 + draw * .7, 1 + draw * .35);
    coil.rotation.z = run * 2.2;
    threads.rotation.y = run * .9;
    // 2. the maker's arm sweeps back, 3. the child at the rack leans in
    arms(maker).right.rotation.x = -1.6 - draw * .45; arms(maker).right.rotation.z = draw * .5;
    upper(maker).rotation.y = Math.sin(t * .4) * .05 + draw * .22;
    upper(child).rotation.x = .05 + beat(k, .5, 1) * .32;
    walk(t);
  });
}

/**
 * The Sampheng shophouse kitchen: the Teochew wok, the noodle, the roast meats and the charcoal, on a street cut
 * between 1892 and 1900. The wok tosses and the noodles lift clear in one mass; the flame rises round the rim.
 */
export function shophouseTh(): P {
  const g = group();
  const sh = shelter(g, "shophouse", 6.0, 3.2, 2.5, { sign: "หมี่", storeys: 2, arcade: 3 });
  lamps(g, sh.y, sh.zFront, [-2.7, 2.7], .95, true);
  for (let i = 0; i < 10; i++) add(g, box(.5, .5, .03, i % 2 ? TH.lacquerRed : TH.stuccoPastel), -2.3 + i * .5, .5, sh.zBack + .11);
  // the roast meats on a rail under the arcade, well to one side of the wok: the always-on sway
  add(g, cyl(.022, .022, 1.6, TH.iron, 6), 2.1, sh.y - .46, sh.zBack + .55).rotation.z = Math.PI / 2;
  for (const dx of [-.75, .75]) add(g, cyl(.016, .016, .46, TH.iron, 5), 2.1 + dx, sh.y - .23, sh.zBack + .55);
  const meats = Array.from({ length: 4 }, (_, i) => {
    const p = add(g, new THREE.Group(), 1.5 + i * .4, sh.y - .46, sh.zBack + .55); p.userData.foodReaction = "sway";
    add(p, cyl(.012, .012, .14, TH.iron, 4), 0, -.07, 0);
    if (i % 2) { const duck = add(p, ball(.14, "#9C4A22", 8), 0, -.34, 0); duck.scale.set(.8, 1.9, .6); add(p, cyl(.035, .05, .18, "#8A3E1E", 6), 0, -.16, 0); }
    else { const pork = add(p, box(.24, .34, .11, "#B4342A"), 0, -.34, 0); add(p, box(.24, .05, .115, "#E4C4A0"), 0, -.20, 0); }
    return p;
  });
  // the range: two wok wells in a brick bench, the second with a stock pot
  add(g, box(2.7, .62, 1.05, TH.clay), -.5, .31, 1.95);
  add(g, box(2.74, .06, 1.09, TH.charcoalSmoke), -.5, .65, 1.95);
  const rimFlames = Array.from({ length: 7 }, (_, i) => {
    const f = add(g, cone(.055, .22, i % 2 ? TH.flameHot : TH.flame, 6), -1.15 + Math.cos(i * .9) * .34, .72, 1.85 + Math.sin(i * .9) * .30);
    f.name = "shophouse-flame"; return f;
  });
  const wok = add(g, new THREE.Group(), -1.15, .70, 1.85); wok.name = "shophouse-wok";
  add(wok, new THREE.Mesh(new THREE.SphereGeometry(.42, 18, 9, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat("#4A4540")), 0, .06, 0);
  add(wok, new THREE.Mesh(new THREE.TorusGeometry(.42, .028, 5, 20), mat("#3A3733")), 0, .06, 0).rotation.x = Math.PI / 2;
  add(wok, cyl(.022, .022, .62, TH.teak, 6), .52, .12, 0).rotation.z = 1.42;
  const noodles = add(wok, new THREE.Group(), 0, .05, 0); noodles.name = "shophouse-noodles";
  for (let i = 0; i < 11; i++) { const n = add(noodles, cyl(.013, .013, .34, "#E4CE8A", 5), Math.cos(i * .6) * .13, .02 + (i % 3) * .015, Math.sin(i * .6) * .13); n.rotation.set(.1 + (i % 3) * .2, i * .6, 1.45); }
  for (let i = 0; i < 4; i++) add(noodles, box(.09, .022, .05, "#4F7A3A"), Math.cos(i * 1.57) * .16, .05, Math.sin(i * 1.57) * .16).rotation.y = i;
  for (let i = 0; i < 3; i++) add(noodles, ball(.035, "#D9704A", 5), Math.cos(i * 2.1) * .1, .06, Math.sin(i * 2.1) * .1).scale.set(1.3, .8, .8);
  for (let i = 0; i < 3; i++) add(noodles, ball(.03, "#E9D9A6", 5), Math.cos(i * 2.1 + 1) * .18, .05, Math.sin(i * 2.1 + 1) * .18);
  const stock = add(g, cyl(.30, .26, .34, "#6E6A62", 16), .35, .82, 1.90);
  add(g, cyl(.27, .27, .03, TH.broth, 16), .35, .98, 1.90);
  const stockBits = Array.from({ length: 5 }, (_, i) => add(g, ball(.03, i % 2 ? "#8A5A3C" : "#E4DCCB", 5), .35 + Math.cos(i * 1.26) * .17, 1.00, 1.90 + Math.sin(i * 1.26) * .17));
  void stock;
  g.userData.steam = V(.35, 1.22, 1.90); g.userData.smoke = V(-1.15, 1.12, 1.85);
  // the chopping block, the cleaver, the bowls and the noodle baskets
  const blockTop = .78;
  add(g, cyl(.30, .32, blockTop, TH.teakDark, 14), 1.55, blockTop / 2, 1.0);
  add(g, cyl(.31, .31, .06, "#9C7A4A", 14), 1.55, blockTop + .03, 1.0);
  for (let i = 0; i < 4; i++) add(g, box(.16, .035, .10, "#C9704A"), 1.48 + (i % 2) * .1, blockTop + .07 + Math.floor(i / 2) * .035, 1.02);
  const cleaver = add(g, new THREE.Group(), 1.62, blockTop + .12, .86); cleaver.name = "shophouse-cleaver";
  add(cleaver, box(.20, .015, .13, "#9AA0A6"), 0, 0, 0); add(cleaver, box(.10, .03, .045, TH.teakDark), -.14, 0, 0);
  const ty = table(g, 1.6, -.6, 1.3, .8, TH.teak, .70);
  for (let i = 0; i < 6; i++) add(g, cyl(.105, .08, .075, TH.riceWhite, 10), 1.25 + (i % 3) * .28, ty + .04 + Math.floor(i / 3) * .08, -.6);
  for (let i = 0; i < 3; i++) { const bk = add(g, cyl(.14, .11, .11, TH.bambooPale, 12), -2.3 + i * .3, .74, 1.95); for (let n = 0; n < 5; n++) add(bk, cyl(.011, .011, .18, "#E4CE8A", 4), Math.cos(n) * .07, .06, Math.sin(n) * .07).rotation.z = 1.45; }
  // eight people: the wok cook, the chopper, three at the street tables, a boy with bowls, a walker, a porter
  const cook = add(g, own(resident("teochew")), -1.15, sh.floor, 1.00) as Figure; cook.rotation.y = Math.PI;
  arms(cook).right.rotation.x = -1.45; arms(cook).left.rotation.x = -1.0;
  const chopper = add(g, own(resident("teochew", false)), 1.9, sh.floor, .55) as Figure; chopper.rotation.y = -2.4;
  arms(chopper).right.rotation.x = -1.5;
  const diners = [sit(g, .3, -1.25, .2, "townsman", .38), sit(g, 1.6, -1.35, 0, "townswoman", .38), sit(g, 2.55, -.9, -.6, "teochew", .38)];
  const boy = add(g, own(resident("child")), -2.2, sh.floor, -.1) as Figure; boy.rotation.y = 1.0;
  add(boy, cyl(.09, .07, .06, TH.riceWhite, 10), .16, .78, .1);
  const porter = add(g, own(resident("carrier", false)), -2.8, 0, 1.6) as Figure; porter.rotation.y = .8;
  add(porter, box(.34, .28, .26, TH.charcoalSmoke), 0, 1.22, -.06);
  const walker = resident("townsman", false); add(g, walker, -3.0, 0, 2.5);
  const walk = pacer(walker, V(-3.0, 0, 2.5), V(2.8, 0, 2.7), .32, 1.2);
  return life(g, "shophouseTh", [cook, chopper, diners[0], ...diners.slice(1), boy, porter, walker], (t, k) => {
    rimFlames.forEach((f, i) => { const s = .8 + Math.sin(t * 11 + i * 2) * .2 + beat(k, 0, .62) * 2.0; f.scale.set(s, s * (1 + beat(k, 0, .62) * .8), s); f.rotation.y = t * 3 + i; });
    stockBits.forEach((b, i) => { b.position.y = 1.00 + Math.max(0, Math.sin(t * 3.2 + i)) * .018; });
    // 1. food first: the wok tips and the noodles lift clear of it in one mass, then settle back
    const toss = beat(k, 0, .52);
    wok.rotation.z = -toss * .55; wok.position.y = .70 + toss * .07;
    noodles.position.set(0, .05 + toss * .46, -toss * .16);
    noodles.rotation.z = -toss * .8; noodles.rotation.x = toss * .35;
    noodles.scale.setScalar(1 + toss * .10);
    // 2. the cook's wrist follows, 3. the chopper at the block looks up
    arms(cook).right.rotation.x = -1.45 - toss * .55; arms(cook).right.rotation.z = -toss * .30;
    upper(cook).rotation.x = toss * .10;
    arms(chopper).right.rotation.x = -1.5 - Math.abs(Math.sin(t * 2.2)) * .35;
    cleaver.position.y = blockTop + .12 + Math.abs(Math.sin(t * 2.2)) * .14;
    upper(chopper).rotation.y = Math.sin(t * .4) * .05 + beat(k, .5, 1) * .55;
    meats.forEach((m, i) => { m.rotation.z = Math.sin(t * 1.15 + i) * .05; m.rotation.x = Math.cos(t * .9 + i) * .03; });
    walk(t);
  });
}

/**
 * The rice-field lunch: the meal carried out to the harvest and cooked on the bund. The banana leaf peels back off
 * the fish on the fire. The shade behind is this stand's own, and it is an open shade on four posts, not a house:
 * the Albufera barraca was a white block with a folded roof from above, and the owner asked for it to be removed.
 */
export function fieldLunch(): P {
  const g = group();
  const sh = shade(g, 4.4, 2.2, 2.30, 0, -2.0);
  lamps(g, sh.y, sh.zFront, [-1.9, 1.9], .8);
  // the bund the meal is laid on, a hand's width above the field, and the sheaves stacked under the shade
  add(g, box(9.0, .18, 3.0, "#A08A5E"), 0, .09, .4);
  for (let i = 0; i < 5; i++) { const s = add(g, cyl(.16, .10, .80, "#D9C089", 7), -1.6 + i * .42, .49, -2.3); s.rotation.z = (i - 2) * .06; for (let n = 0; n < 4; n++) add(s, cyl(.012, .012, .26, "#C9B45A", 4), Math.cos(n * 1.57) * .08, .48, Math.sin(n * 1.57) * .08).rotation.z = (n - 1.5) * .12; }
  add(g, box(.7, .05, .5, TH.bambooPale), 1.6, .30, -2.2);
  for (let i = 0; i < 3; i++) add(g, cyl(.02, .02, 1.5, TH.bambooPale, 5), 1.9 + i * .08, .28, -1.9).rotation.set(0, .2, 1.45);   // the sickles and a pole
  // the fire on the bund: three stones, wood and the fish wrapped in its leaf
  add(g, cyl(.60, .66, .10, TH.limestoneGrey, 14), 0, .23, .95);
  for (let i = 0; i < 3; i++) add(g, ball(.13, "#8E8A80", 6), Math.cos(i * 2.1) * .42, .27, .95 + Math.sin(i * 2.1) * .42).scale.y = .8;
  for (let i = 0; i < 5; i++) add(g, cyl(.032, .038, .55, "#5C3E2A", 5), Math.cos(i * 1.25) * .16, .30, .95 + Math.sin(i * 1.25) * .16).rotation.set(1.3, i * 1.25, 0);
  const fire = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.085, .26, i % 2 ? TH.flameHot : TH.flame, 6), Math.cos(i * 1.6) * .14, .42, .95 + Math.sin(i * 1.6) * .14); f.name = "paddy-flame"; return f; });
  const embers = Array.from({ length: 5 }, (_, i) => add(g, ball(.035, "#E9612D", 5), Math.cos(i * 1.26) * .26, .29, .95 + Math.sin(i * 1.26) * .26));
  g.userData.smoke = V(0, .70, .95);
  // the fish in its banana leaf, on a green-stick rack over the fire: the subject
  for (const dz of [-.3, .3]) add(g, cyl(.018, .018, 1.1, "#6E8A3A", 5), 0, .40, .95 + dz).rotation.z = Math.PI / 2;
  const fish = add(g, new THREE.Group(), 0, .47, .95);
  const body = add(fish, ball(.14, "#B8B0A0", 9), 0, 0, 0); body.scale.set(2.5, .8, .95);
  add(fish, cone(.10, .22, "#A8A090", 6), -.44, .01, 0).rotation.z = Math.PI / 2;
  add(fish, box(.05, .012, .14, "#9C9484"), .18, .08, 0);
  for (let i = 0; i < 5; i++) add(fish, box(.05, .015, .06, "#C9B8A0"), -.2 + i * .1, .10, .04);
  add(fish, ball(.02, "#3A3733", 5), .28, .05, .06);
  const leaf = add(g, new THREE.Group(), 0, .52, .95); leaf.name = "paddy-banana-leaf";
  const blade = add(leaf, box(.78, .02, .40, "#3F7A3A"), 0, 0, 0);
  add(blade, box(.78, .012, .06, "#2F6A2A"), 0, .012, 0);
  for (let i = 0; i < 6; i++) add(blade, box(.02, .014, .38, "#356F30"), -.32 + i * .13, .01, 0);
  for (const dz of [-1, 1]) { const flap = add(leaf, box(.78, .02, .18, "#356F30"), 0, -.05, dz * .26); flap.rotation.x = dz * .6; }
  // the meal laid out on the leaf mat on the bund: sticky rice baskets, nam phrik, greens, a water gourd
  add(g, box(1.5, .02, .9, "#4F7A3A"), 1.8, .19, .95);
  for (let i = 0; i < 2; i++) { const bk = add(g, cyl(.15, .12, .17, TH.bambooPale, 12), 1.45 + i * .45, .29, 1.15); add(g, ball(.13, TH.riceWhite, 8), 1.45 + i * .45, .40, 1.15).scale.y = .5; void bk; }
  const mortar = add(g, cyl(.14, .17, .20, TH.clay, 14), 2.15, .29, .72);
  add(g, cyl(.12, .12, .04, "#7A5A32", 12), 2.15, .40, .72);
  const pestleF = add(g, cyl(.028, .034, .28, TH.teak, 8), 2.15, .56, .72);
  void mortar;
  for (let i = 0; i < 5; i++) add(g, cyl(.03, .024, .26, "#7FA84A", 5), 1.6 + i * .07, .21, .72).rotation.z = 1.5;
  add(g, ball(.12, "#8A7448", 8), 2.6, .30, 1.1).scale.set(1, 1.3, 1); add(g, cyl(.035, .035, .10, "#6E6350", 6), 2.6, .46, 1.1);
  for (let i = 0; i < 4; i++) add(g, ball(.045, "#B4342A", 6), 2.45 + (i % 2) * .1, .22, .62 + Math.floor(i / 2) * .1);
  // the buffalo in the far flooded square, at the side of the view: the one animal in water in this area
  add(g, box(4.6, .04, 3.2, "#5E8A5A"), -5.0, .10, -.6);
  add(g, box(4.4, .02, 3.0, "#7FA88A"), -5.0, .13, -.6);
  for (const dx of [-2.3, 2.3]) add(g, box(.18, .16, 3.2, "#A08A5E"), -5.0 + dx, .08, -.6);
  const buffalo = add(g, new THREE.Group(), -5.0, .0, -.4);
  const torso = add(buffalo, ball(.50, "#6A6560", 10), 0, 1.00, 0); torso.scale.set(1.62, .74, .78);
  add(buffalo, ball(.44, "#8A857E", 9), 0, .90, 0).scale.set(1.44, .46, .70);       // the pale underbelly, so the barrel is not one mass
  add(buffalo, cyl(.20, .24, .46, "#6A6560", 8), .66, 1.10, 0).rotation.z = -.55;   // the neck
  const head = add(buffalo, new THREE.Group(), .96, 1.20, 0); head.name = "paddy-buffalo-head";
  add(head, ball(.23, "#6A6560", 8), 0, 0, 0).scale.set(1.30, .88, .80);
  add(head, ball(.10, "#4A4642", 7), .26, -.07, 0);
  for (const side of [-1, 1]) { const horn = add(head, new THREE.Mesh(new THREE.TorusGeometry(.34, .045, 5, 12, Math.PI * 1.15), mat("#D9D0BA")), .02, .14, side * .13); horn.rotation.set(Math.PI / 2, 0, side * .55); }
  for (const [dx, dz] of [[-.50, -.26], [-.50, .26], [.50, -.26], [.50, .26]]) add(buffalo, cyl(.10, .08, .98, "#4A4642", 6), dx, .49, dz);
  const egrets = Array.from({ length: 3 }, (_, i) => {
    const e = add(g, new THREE.Group(), -6.2 + i * .9, .16, -1.5 + (i % 2) * .8);
    add(e, ball(.11, TH.riceWhite, 7), 0, .34, 0).scale.set(1.5, .85, .85);
    add(e, cyl(.035, .03, .24, TH.riceWhite, 5), .1, .50, 0).rotation.z = -.35;
    add(e, ball(.065, TH.riceWhite, 6), .18, .62, 0); add(e, cone(.022, .12, "#E8C24A", 5), .27, .61, 0).rotation.z = -1.4;
    for (const side of [-1, 1]) add(e, cyl(.012, .012, .30, "#3A3733", 4), 0, .17, side * .05);
    const wings = [-1, 1].map((side) => add(e, box(.20, .02, .09, "#F4EFE2"), 0, .36, side * .10));
    e.userData.wings = wings;
    return e;
  });
  // six people and a child: the cook, two harvesters resting, a woman pounding, a water carrier, a child
  const cook = add(g, own(resident("farmer")), 0, .18, .35) as Figure; cook.rotation.y = Math.PI;
  arms(cook).right.rotation.x = -1.35; arms(cook).left.rotation.x = -1.30;
  const resting = [seatFigure(g, resident("farmer", false), 1.35, .18, .1, .60), seatFigure(g, resident("isan"), 2.3, .18, -.35, .60)];
  add(g, box(1.6, .06, .40, TH.teak), 1.8, .60, .28);
  for (const dx of [-.7, .7]) add(g, box(.08, .42, .3, TH.teakDark), 1.8 + dx, .39, .28);
  const pounder = add(g, own(resident("isan", false)), 2.15, .18, .3) as Figure; pounder.rotation.y = Math.PI - .4;
  arms(pounder).right.rotation.x = -1.9;
  const carrier = add(g, own(resident("carrier", false)), -1.6, .18, -1.3) as Figure; carrier.rotation.y = 1.1;
  add(carrier, cyl(.02, .02, 1.5, TH.teak, 4), .17, .95, .05).rotation.x = Math.PI / 2;
  for (const z of [-.6, .6]) { add(carrier, cyl(.01, .01, .28, "#8A6844", 3), .17, .75, z); add(carrier, cyl(.16, .13, .16, TH.clay, 8), .17, .56, z); }
  const child = add(g, own(resident("child")), -1.95, .18, .05) as Figure; child.rotation.y = -1.3;
  const walker = resident("farmer", false); add(g, walker, -2.6, .18, 1.6);
  const walk = pacer(walker, V(-2.6, .18, 1.6), V(2.9, .18, 1.9), .28, .4);
  const leafRest = leaf.position.clone();
  return life(g, "naKhaoTh", [cook, resting[0], pounder, resting[1], carrier, child, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 10 + i * 2) * .2 + beat(k, 0, .6) * .5; f.scale.set(s, s, s); f.rotation.y = t * 2.4 + i; });
    embers.forEach((e, i) => { (e.material as THREE.MeshStandardMaterial).color.setStyle(Math.sin(t * 2 + i) > 0 ? "#E9612D" : "#8A3A1E"); });
    // 1. food first: the leaf peels back off the fish and the fish is revealed steaming on the sticks
    const peel = beat(k, 0, .62);
    leaf.position.copy(leafRest); leaf.position.y = leafRest.y + peel * .22; leaf.position.z = leafRest.z - peel * .40;
    leaf.rotation.x = -peel * 1.35; leaf.rotation.z = peel * .18;
    blade.scale.z = 1 - peel * .25;
    fish.position.y = .47 + peel * .02; fish.rotation.z = peel * .06;
    // 2. the cook's hands follow, 3. the buffalo raises its head in the far square
    arms(cook).right.rotation.x = -1.35 - peel * .5; arms(cook).left.rotation.x = -1.30 - peel * .45;
    upper(cook).rotation.x = peel * .14;
    head.rotation.z = Math.sin(t * .35) * .04 + beat(k, .42, 1) * .55;
    buffalo.rotation.y = Math.sin(t * .18) * .06;
    egrets.forEach((e, i) => {
      const lift = beat(k, .5, 1);
      e.position.y = .16 + lift * (.5 + i * .18);
      (e.userData.wings as THREE.Object3D[]).forEach((w, n) => { w.rotation.z = Math.sin(t * 13 + n * Math.PI) * .8 * lift; });
      e.rotation.y = Math.sin(t * .4 + i * 2) * .4;
    });
    pestleF.position.y = .56 + Math.abs(Math.sin(t * 1.9)) * .08;
    arms(pounder).right.rotation.x = -1.9 - Math.abs(Math.sin(t * 1.9)) * .3;
    walk(t);
  });
}

/**
 * The Isan grill: a charcoal trough, flattened chickens in split-bamboo clamps, a tall clay mortar on the ground
 * and a basket of sticky rice. The pestle strikes down into the mortar and the papaya turns under it.
 */
export function isanGrill(): P {
  const g = group();
  const sh = shelter(g, "isan", 5.0, 2.8, 2.3, { stilts: .9 });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .8);
  add(g, box(5.4, .12, 3.2, "#B49A70"), 0, .06, .9);                            // the swept sandy yard in front
  for (let i = 0; i < 5; i++) add(g, box(.5, .04, .5, "#A88E64"), -1.8 + i * .9, .13, 1.9);
  // the jars of pla ra and water under the raised floor, where they belong
  for (let i = 0; i < 4; i++) { const j = add(g, cyl(.20, .16, .42, TH.clay, 12), -1.6 + i * .95, .21, -1.9); add(g, cyl(.17, .17, .04, "#7A5A46", 12), -1.6 + i * .95, .44, -1.9); void j; }
  // the charcoal trough grill at the front, and the chickens in their clamps over it
  add(g, box(2.4, .34, .58, TH.clay), -.5, .30, 1.35);
  add(g, box(2.3, .06, .48, TH.charcoalSmoke), -.5, .48, 1.35);
  for (let i = 0; i < 9; i++) add(g, box(.16, .08, .16, TH.charcoalSmoke), -1.55 + i * .26, .52, 1.35);
  const coals = Array.from({ length: 6 }, (_, i) => { const c = add(g, ball(.06, "#E9612D", 5), -1.35 + i * .35, .53, 1.35); c.scale.y = .5; return c; });
  const clamps = Array.from({ length: 3 }, (_, i) => {
    const c = add(g, new THREE.Group(), -1.15 + i * .62, .66, 1.35); if (i === 0) c.name = "isan-chicken";
    const bird = add(c, box(.34, .06, .24, "#C98A4A"), 0, 0, 0);
    add(bird, box(.30, .02, .20, "#B4702A"), 0, .035, 0);
    for (const side of [-1, 1]) add(bird, box(.12, .04, .05, "#B4702A"), -.10, .01, side * .11).rotation.y = side * .4;
    add(bird, box(.09, .04, .07, "#A8621E"), .20, .01, 0);
    for (const side of [-1, 1]) add(c, cyl(.014, .014, .76, TH.bambooPale, 5), 0, .01, side * .15).rotation.set(0, 0, 1.45);
    add(c, cyl(.013, .013, .30, TH.bambooPale, 4), -.34, .01, 0);
    return c;
  });
  g.userData.smoke = V(-.5, .90, 1.35);
  // the tall clay mortar on the ground: the subject
  const mortar = add(g, new THREE.Group(), 1.45, 0, 1.25);
  add(mortar, cyl(.20, .26, .54, TH.clay, 14), 0, .27, 0);
  add(mortar, cyl(.22, .20, .06, "#7A5A46", 14), 0, .55, 0);
  add(mortar, cyl(.27, .29, .07, "#7A5A46", 14), 0, .035, 0);
  const papaya = add(mortar, new THREE.Group(), 0, .54, 0); papaya.name = "isan-papaya";
  add(papaya, cyl(.17, .15, .06, "#C9D48A", 14), 0, 0, 0);
  for (let i = 0; i < 9; i++) add(papaya, box(.10, .014, .022, i % 3 ? "#D9E09A" : "#C9D07A"), Math.cos(i * .7) * .09, .035, Math.sin(i * .7) * .09).rotation.y = -i * .7;
  for (let i = 0; i < 4; i++) add(papaya, cone(.022, .10, "#B4342A", 5), Math.cos(i * 1.57) * .11, .04, Math.sin(i * 1.57) * .11).rotation.set(1.4, i, 0);
  for (let i = 0; i < 3; i++) add(papaya, ball(.028, "#D9604A", 5), Math.cos(i * 2.1) * .06, .05, Math.sin(i * 2.1) * .06).scale.set(1.2, .7, 1);
  const pestle = add(g, new THREE.Group(), 1.45, 1.02, 1.25); pestle.name = "isan-pestle";
  add(pestle, cyl(.030, .040, .60, TH.teak, 8), 0, 0, 0);
  add(pestle, cyl(.045, .038, .09, TH.teakDark, 8), 0, .33, 0);
  // the sticky-rice steamer on its clay pot, the basket, the greens and the lime
  const pot = add(g, cyl(.22, .20, .32, TH.clay, 14), -2.1, .90, 1.05);
  const steamer = add(g, new THREE.Group(), -2.1, 1.20, 1.05);
  add(steamer, cyl(.21, .14, .30, TH.bambooPale, 12), 0, .15, 0);
  for (let i = 0; i < 4; i++) add(steamer, cyl(.215, .215, .02, "#A48E5A", 12), 0, .05 + i * .07, 0);
  add(steamer, cyl(.13, .13, .03, "#B9A46A", 12), 0, .31, 0);
  void pot;
  add(g, cyl(.17, .13, .20, TH.bambooPale, 12), -1.6, 1.0, 1.35); add(g, ball(.15, TH.riceWhite, 8), -1.6, 1.12, 1.35).scale.y = .5;
  for (let i = 0; i < 4; i++) add(g, ball(.055, "#7FA84A", 6), 2.05 + (i % 2) * .11, .93, 1.3 + Math.floor(i / 2) * .11);
  for (let i = 0; i < 5; i++) add(g, cyl(.028, .022, .26, "#5E8A3A", 5), 1.95 + i * .06, .92, 1.6).rotation.z = 1.5;
  g.userData.steam = V(-2.1, 1.58, 1.05);
  // the fish pond corner and the chickens in the yard, small and to the side
  const hens = Array.from({ length: 2 }, (_, i) => {
    const h = add(g, new THREE.Group(), 2.6 + i * .5, .13, 2.2 - i * .55);
    add(h, ball(.13, i ? "#A8602A" : "#D9C089", 7), 0, .16, 0).scale.set(1.4, .95, .9);
    add(h, ball(.07, i ? "#A8602A" : "#D9C089", 6), .14, .28, 0); add(h, cone(.025, .07, "#E8A62C", 5), .21, .27, 0).rotation.z = -1.4;
    add(h, box(.05, .05, .02, TH.lacquerRed), .15, .35, 0);
    for (const side of [-1, 1]) add(h, cyl(.012, .012, .13, "#C98A4A", 4), 0, .06, side * .05);
    return h;
  });
  // seven people: the pounder, the grill cook, a child at the basket, two neighbours, a weaver, a walker
  const pounder = add(g, own(resident("isan")), 1.45, .13, .58) as Figure; pounder.rotation.y = Math.PI;
  arms(pounder).right.rotation.x = -2.0; arms(pounder).left.rotation.x = -1.1;
  const griller = add(g, own(resident("isan", false)), -.5, .13, .62) as Figure; griller.rotation.y = Math.PI;
  arms(griller).right.rotation.x = -1.3;
  const tongs = add(arms(griller).right, box(.03, .03, .34, TH.iron), 0, arms(griller).hand - .04, .14);
  const child = add(g, own(resident("child")), -1.55, .13, .85) as Figure; child.rotation.y = Math.PI - .6;
  const neighbours = [sit(g, 2.5, .6, -.4, "isan", .36), sit(g, -2.6, .3, .7, "farmer", .36)];
  const weaver = seatFigure(g, resident("isan", false), .35, -1.6, .2, sh.floor);
  add(g, box(.7, .05, .5, TH.bambooPale), .35, sh.floor - .02, -1.25);
  const walker = resident("farmer", false); add(g, walker, -2.4, .13, 2.5);
  const walk = pacer(walker, V(-2.4, .13, 2.5), V(2.6, .13, 2.7), .26, 1.6);
  const papayaRest = papaya.scale.clone();
  return life(g, "isanGrillTh", [pounder, child, griller, neighbours[0], neighbours[1], weaver, walker], (t, k) => {
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissive.setStyle(Math.sin(t * 1.6 + i) > 0 ? "#B4340E" : "#5A1A08"); (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2 + i) * .2; });
    // 1. material first: the pestle strikes and the papaya turns and flattens under it
    const idle = Math.abs(Math.sin(t * 1.7)), strike = beat(k, 0, .40), turn = beat(k, .04, .76);
    pestle.position.y = 1.02 - idle * .10 - strike * .26;
    pestle.rotation.z = Math.sin(t * 1.7) * .05;
    papaya.scale.copy(papayaRest);
    papaya.scale.set(papayaRest.x * (1 + turn * .13), papayaRest.y * (1 - turn * .30), papayaRest.z * (1 + turn * .13));
    papaya.rotation.y = turn * 1.5;
    // the chickens roll over in their clamps: the supporting food beat
    clamps.forEach((c, i) => { c.rotation.z = Math.sin(t * .8 + i) * .03 - beat(k, .18, .82) * (2.9 + i * .1); c.position.y = .66 + beat(k, .18, .82) * .06; });
    // 2. the pounder's arm follows, 3. the child looks up from the basket
    arms(pounder).right.rotation.x = -2.0 - strike * .5;
    upper(pounder).rotation.x = idle * .05 + strike * .10;
    arms(griller).right.rotation.x = -1.3 - beat(k, .3, .9) * .5;
    tongs.rotation.x = beat(k, .3, .9) * .4;
    upper(child).rotation.x = .04 + beat(k, .52, 1) * .3; upper(child).rotation.y = beat(k, .52, 1) * .3;
    hens.forEach((h, i) => { h.rotation.y = Math.sin(t * .5 + i * 2) * .5; h.children[1].position.y = .28 + Math.abs(Math.sin(t * 1.3 + i)) * .03; });
    walk(t);
  });
}

/**
 * The Lanna kitchen: khao soi off the caravan road, sai ua on the grill and a khantoke tray, under a low wide
 * Lanna roof with crossed kalae boards. The coil of sai ua turns on the grill; the crisp noodle nest settles.
 */
export function lannaKitchen(): P {
  const g = group();
  const sh = shelter(g, "lanna", 5.6, 3.0, 2.25, { sign: "ข้าวซอย" });
  lamps(g, sh.y, sh.zFront, [-2.5, 2.5], .85);
  // the khao soi pot on its charcoal ring and the grill beside it, both at the front of the bay
  add(g, box(2.5, .56, 1.0, TH.clay), -.7, .28, 1.85);
  add(g, box(2.54, .06, 1.04, TH.charcoalSmoke), -.7, .59, 1.85);
  const pot = add(g, cyl(.34, .28, .36, "#6E6A62", 16), .05, .77, 1.80);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.34, .026, 5, 16), mat("#5A564E")), .05, .95, 1.80).rotation.x = Math.PI / 2;
  const curry = add(g, cyl(.30, .30, .035, "#C98A2C", 16), .05, .94, 1.80);
  const curryBits = Array.from({ length: 6 }, (_, i) => add(g, ball(.032, i % 2 ? "#9C5A2A" : "#E4CE8A", 5), .05 + Math.cos(i * 1.05) * .19, .96, 1.80 + Math.sin(i * 1.05) * .19));
  void pot; void curry;
  g.userData.steam = V(.05, 1.22, 1.80);
  // the grill and the sai ua coil: the subject
  add(g, box(.86, .06, .52, TH.charcoalSmoke), -1.35, .62, 1.82);
  for (let i = 0; i < 6; i++) add(g, cyl(.012, .012, .50, TH.iron, 5), -1.68 + i * .13, .66, 1.82).rotation.x = Math.PI / 2;
  const coals = Array.from({ length: 4 }, (_, i) => { const c = add(g, ball(.055, "#E9612D", 5), -1.62 + i * .19, .60, 1.82); c.scale.y = .5; return c; });
  const saiUa = add(g, new THREE.Group(), -1.35, .71, 1.82); saiUa.name = "lanna-sai-ua";
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2, r = .17;
    const seg = add(saiUa, cyl(.045, .045, .09, i % 3 ? "#A8462A" : "#9C3E22", 8), Math.cos(a) * r, 0, Math.sin(a) * r);
    seg.rotation.set(Math.PI / 2, -a, 0);
  }
  for (let i = 0; i < 4; i++) add(saiUa, ball(.02, "#D9B07A", 5), Math.cos(i * 1.57) * .17, .04, Math.sin(i * 1.57) * .17);
  g.userData.smoke = V(-1.35, .92, 1.82);
  // the bowl the noodle nest settles onto, on the serving plank
  add(g, box(1.3, .06, .62, TH.teak), 1.55, .74, 1.05);
  for (const dx of [-.5, .5]) for (const dz of [-.2, .2]) add(g, box(.08, .71, .08, TH.teakDark), 1.55 + dx, .355, 1.05 + dz);
  const bowl = add(g, new THREE.Group(), 1.5, .78, 1.05); bowl.name = "lanna-bowl";
  add(bowl, cyl(.19, .13, .14, TH.riceWhite, 14), 0, .07, 0);
  add(bowl, cyl(.16, .16, .03, "#C98A2C", 14), 0, .125, 0);
  for (let i = 0; i < 5; i++) add(bowl, cyl(.016, .013, .13, "#E4CE8A", 5), (i - 2) * .035, .15, 0).rotation.x = .25;
  const nest = add(g, new THREE.Group(), 1.5, .96, 1.05); nest.name = "lanna-noodle-nest";
  for (let i = 0; i < 12; i++) { const n = add(nest, cyl(.009, .009, .22, "#D9A83A", 5), Math.cos(i * .8) * .07, (i % 3) * .012, Math.sin(i * .8) * .07); n.rotation.set(.4 + (i % 3) * .2, i * .8, 1.3); }
  // the khantoke tray of the meal, the pickles and the shallots, and a lacquer betel box
  const khantoke = add(g, new THREE.Group(), 2.6, 0, .1);
  add(khantoke, cyl(.44, .34, .10, "#8A3E22", 20), 0, .38, 0);
  add(khantoke, cyl(.16, .20, .34, "#8A3E22", 14), 0, .17, 0);
  for (let i = 0; i < 4; i++) { add(khantoke, cyl(.11, .09, .06, TH.riceWhite, 12), Math.cos(i * 1.57) * .23, .46, Math.sin(i * 1.57) * .23); add(khantoke, cyl(.095, .095, .022, ["#C98A2C", "#4F7A3A", "#B4342A", "#E4DCCB"][i], 12), Math.cos(i * 1.57) * .23, .49, Math.sin(i * 1.57) * .23); }
  add(khantoke, cyl(.13, .11, .12, TH.bambooPale, 12), 0, .49, 0); add(khantoke, ball(.115, TH.riceWhite, 8), 0, .57, 0).scale.y = .5;
  const ty = table(g, -2.3, .1, 1.5, .9, TH.teak, .66);
  for (let i = 0; i < 4; i++) add(g, cyl(.09, .075, .09, "#9C8A5A", 10), -2.7 + i * .22, ty + .045, .1);
  for (let i = 0; i < 6; i++) add(g, ball(.045, "#B4746A", 6), -2.65 + (i % 3) * .1, ty + .04, .38 + Math.floor(i / 3) * .1).scale.set(1, 1.3, 1);
  for (let i = 0; i < 4; i++) add(g, cyl(.028, .024, .22, "#5E8A3A", 5), -1.95 + i * .06, ty + .02, .3).rotation.z = 1.5;
  // the mule at the gate, standing, with its panniers: the caravan road ends here
  const mule = add(g, new THREE.Group(), -3.7, 0, -1.2); mule.rotation.y = .5;
  add(mule, ball(.36, "#6E5C48", 9), 0, .82, 0).scale.set(1.6, .9, .9);
  add(mule, ball(.17, "#6E5C48", 8), .62, .95, 0).scale.set(1.2, .9, .85);
  for (const side of [-1, 1]) add(mule, cone(.05, .16, "#5A4A38", 5), .56, 1.16, side * .08).rotation.z = -.2;
  for (const [dx, dz] of [[-.38, -.22], [-.38, .22], [.38, -.22], [.38, .22]]) add(mule, cyl(.065, .05, .74, "#5A4A38", 6), dx, .37, dz);
  for (const side of [-1, 1]) { const p = add(mule, box(.5, .34, .22, TH.bambooPale), -.05, .82, side * .34); for (let i = 0; i < 3; i++) add(p, box(.12, .10, .02, "#4F6A3A"), -.15 + i * .15, .05, side * .11); }
  // seven people: the cook, the noodle woman, the muleteer in the doorway, two eating, a child, a walker
  const cook = add(g, own(resident("lanna")), -1.35, 0, 1.12) as Figure; cook.rotation.y = Math.PI;
  arms(cook).right.rotation.x = -1.4;
  const tongs = add(arms(cook).right, box(.03, .03, .32, TH.iron), 0, arms(cook).hand - .04, .13);
  const noodleWoman = add(g, own(resident("lanna", false)), 1.5, sh.floor, .48) as Figure; noodleWoman.rotation.y = Math.PI + .3;
  arms(noodleWoman).right.rotation.x = -1.5;
  const muleteer = add(g, own(resident("muleteer", false)), -2.30, sh.floor, -.35) as Figure; muleteer.rotation.y = 1.4;
  wear(muleteer, cyl(.13, .14, .09, "#E9E2D2", 12), 0, 1.16, 0);                 // the Yunnanese white skull cap
  const eaters = [seatFigure(g, resident("lanna", false), 2.6, .85, Math.PI, .44), seatFigure(g, resident("townsman"), 2.0, -.55, -.5, .40)];
  add(g, box(.5, .06, .36, TH.teak), 2.6, .44, 1.05); for (const dx of [-.18, .18]) add(g, box(.07, .41, .3, TH.teakDark), 2.6 + dx, .205, 1.05);
  add(g, cyl(.17, .18, .40, TH.teak, 12), 2.0, .20, -.66);
  const child = add(g, own(resident("child")), .85, sh.floor, -.55) as Figure; child.rotation.y = .5;
  const walker = resident("lanna", false); add(g, walker, -2.9, 0, 2.5);
  const walk = pacer(walker, V(-2.9, 0, 2.5), V(2.8, 0, 2.6), .26, 2.2);
  const nestRest = nest.position.clone();
  return life(g, "khaoSoiTh", [cook, eaters[0], noodleWoman, muleteer, eaters[1], child, walker], (t, k) => {
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissive.setStyle(Math.sin(t * 1.5 + i) > 0 ? "#B4340E" : "#5A1A08"); (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2.2 + i) * .22; });
    curryBits.forEach((b, i) => { b.position.y = .96 + Math.max(0, Math.sin(t * 3.2 + i)) * .016; });
    // 1. food first: the coil turns once on the grill and the fat catches; the noodle nest settles onto the bowl
    const turn = beat(k, 0, .60);
    saiUa.rotation.y = Math.sin(t * .3) * .04 + turn * 2.1;
    saiUa.position.y = .71 + turn * .09;
    saiUa.rotation.z = turn * .12;
    const settle = k > 0 ? clamp01(((1 - k) - .18) / .50) : 0;
    nest.position.copy(nestRest);
    nest.position.y = nestRest.y - settle * .12 + (1 - settle) * .0;
    nest.rotation.y = settle * .8;
    nest.scale.setScalar(1 - settle * .06);
    // 2. the cook's tongs follow, 3. the muleteer in the doorway steps in
    tongs.rotation.x = beat(k, .28, .88) * .5;
    arms(cook).right.rotation.x = -1.4 - beat(k, .28, .88) * .45;
    arms(noodleWoman).right.rotation.x = -1.5 - beat(k, .12, .7) * .55;
    const step = beat(k, .45, 1);
    muleteer.position.set(-2.30 + step * .26, sh.floor, -.35 + step * .40);
    const ml = legsOf(muleteer), swing = Math.sin(step * Math.PI * 2) * .42;
    ml.left.thigh.rotation.x = swing; ml.right.thigh.rotation.x = -swing;
    ml.left.shin.rotation.x = Math.max(0, -swing) * .8; ml.right.shin.rotation.x = Math.max(0, swing) * .8;
    mule.children[1].rotation.z = Math.sin(t * .8) * .05;
    walk(t);
  });
}

/**
 * The Andaman fishing kitchen: turmeric, fresh fish and a fire on the sand under the limestone. The fish turns on
 * the green-stick grill and the skin lifts. No lounger, no parasol: this is a working beach in 1890.
 */
export function andamanKitchen(): P {
  const g = group();
  const sh = shade(g, 4.6, 2.4, 2.35, 0, -1.9, "#A48E5A");
  lamps(g, sh.y, sh.zFront, [-2.0, 2.0], .8);
  add(g, box(9.0, .10, 5.4, "#E4D9BC"), 0, .05, .4);                            // the pale sand
  for (let i = 0; i < 6; i++) add(g, ball(.10, TH.limestoneGrey, 6), -3.6 + i * 1.5, .08, 2.6 + (i % 2) * .5).scale.set(1.4, .5, 1.1);
  // the limestone outcrop at the back corner, small and well out of the line to the fire
  const rock = add(g, new THREE.Group(), -4.4, 0, -3.6);
  add(rock, new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.35, 4.2, 9), mat(TH.limestoneGrey)), 0, 2.1, 0).scale.set(1, 1, .8);
  add(rock, new THREE.Mesh(new THREE.DodecahedronGeometry(.9, 0), mat("#8E8A80")), .6, 2.6, 0);
  for (let i = 0; i < 4; i++) add(rock, ball(.5, i % 2 ? "#4F8A4A" : "#3F7A3A", 6), Math.cos(i * 1.6) * .6, 4.3, Math.sin(i * 1.6) * .45);
  add(rock, new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .6, 8, 1, false, 0, Math.PI), mat("#3A3A3D")), 0, .4, .9).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  // the fire on the sand, three stones, and the green-stick grill over it
  add(g, cyl(.58, .64, .10, "#C9BCA0", 14), 0, .13, 1.05);
  for (let i = 0; i < 3; i++) add(g, ball(.14, TH.limestoneGrey, 6), Math.cos(i * 2.1) * .44, .17, 1.05 + Math.sin(i * 2.1) * .44).scale.y = .8;
  for (let i = 0; i < 5; i++) add(g, cyl(.03, .036, .52, "#5C3E2A", 5), Math.cos(i * 1.25) * .15, .2, 1.05 + Math.sin(i * 1.25) * .15).rotation.set(1.3, i * 1.25, 0);
  const fire = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.08, .26, i % 2 ? TH.flameHot : TH.flame, 6), Math.cos(i * 1.6) * .13, .32, 1.05 + Math.sin(i * 1.6) * .13); f.name = "andaman-flame"; return f; });
  for (const dz of [-.34, .34]) add(g, cyl(.02, .02, 1.2, "#6E8A3A", 5), 0, .46, 1.05 + dz).rotation.z = Math.PI / 2;
  for (let i = 0; i < 5; i++) add(g, cyl(.014, .014, .82, "#6E8A3A", 4), -.34 + i * .17, .48, 1.05).rotation.x = Math.PI / 2;
  // the turmeric-rubbed fish on the grill: the subject
  const fish = add(g, new THREE.Group(), 0, .57, 1.05); fish.name = "andaman-fish";
  const body = add(fish, ball(.15, "#E0A92C", 9), 0, 0, 0); body.scale.set(2.6, .75, .95);
  add(fish, cone(.11, .24, "#C98A1C", 6), -.46, .01, 0).rotation.z = Math.PI / 2;
  add(fish, box(.06, .012, .16, "#B47A16"), .16, .07, 0);
  add(fish, ball(.022, "#3A3733", 5), .3, .04, .06);
  const skin = Array.from({ length: 5 }, (_, i) => add(fish, box(.10, .012, .09, "#F2D98A"), -.22 + i * .11, .075, .02));
  for (let i = 0; i < 3; i++) add(fish, box(.05, .014, .04, "#4F7A3A"), -.1 + i * .12, .085, -.04);
  g.userData.smoke = V(0, .82, 1.05);
  // the squid on a line, the fish tray, the turmeric bowl, the coconut and the nets
  add(g, cyl(.02, .02, 3.2, TH.bambooPale, 5), 2.5, 1.55, .0).rotation.set(0, 0, 1.5);
  const squid = Array.from({ length: 5 }, (_, i) => {
    const s = add(g, new THREE.Group(), 2.5, 1.52, -1.3 + i * .62); s.userData.foodReaction = "sway";
    add(s, cyl(.008, .008, .10, TH.bambooPale, 4), 0, -.05, 0);
    add(s, box(.20, .26, .015, "#E4CCA8"), 0, -.22, 0);
    for (let n = 0; n < 4; n++) add(s, box(.03, .09, .012, "#D9BC98"), -.075 + n * .05, -.39, 0);
    return s;
  });
  for (const x of [-2.2, 2.0]) { for (let i = 0; i < 2; i++) add(g, cyl(.05, .06, 1.7, TH.bambooPale, 5), x + i * .1, .95, -1.0).rotation.z = (i - .5) * .3; }
  const tray = add(g, new THREE.Group(), 1.5, 0, 1.55);
  add(tray, box(.9, .10, .64, TH.bambooPale), 0, .21, 0);
  for (const dx of [-.34, .34]) add(tray, box(.09, .16, .6, TH.teakDark), dx, .08, 0);
  for (let i = 0; i < 5; i++) { const f = add(tray, ball(.085, "#B7BEC4", 7), -.28 + (i % 3) * .28, .29, -.14 + Math.floor(i / 3) * .26); f.scale.set(2.1, .6, .8); f.rotation.y = i * .4; }
  add(g, cyl(.14, .11, .09, TH.clay, 12), .95, .24, 1.85); add(g, cyl(.12, .12, .03, "#D9942C", 12), .95, .30, 1.85);
  for (let i = 0; i < 3; i++) add(g, cyl(.045, .04, .13, "#D9942C", 8), 1.2 + i * .1, .17, 2.05).rotation.z = 1.5;
  add(g, ball(.16, "#8A6A48", 8), -1.0, .21, 1.7); add(g, cyl(.14, .14, .04, TH.riceWhite, 12), -1.0, .35, 1.7);
  for (let i = 0; i < 4; i++) add(g, cone(.028, .13, "#B4342A", 5), -1.35 + i * .07, .14, 1.9).rotation.set(1.4, i, .2);
  const netFrame = add(g, new THREE.Group(), -2.6, 0, 1.9);
  for (const dx of [-.5, .5]) add(netFrame, cyl(.05, .06, 1.5, TH.bambooPale, 5), dx, .75, 0).rotation.z = dx * .22;
  for (let i = 0; i < 7; i++) add(netFrame, box(.95, .015, .015, "#C9BCA0"), 0, .35 + i * .16, 0);
  for (let i = 0; i < 6; i++) add(netFrame, box(.015, 1.1, .015, "#C9BCA0"), -.42 + i * .17, .85, 0);
  // the boat drawn up on the sand behind, out of the water as it should be
  const drawn = hull(g, 3.8, 1.1, 3.6, -2.4, "#6A4628"); drawn.rotation.y = -.5; drawn.position.y = .12;
  // seven people: the cook, the man at the net, two gutting fish, a child, a woman with turmeric, a walker
  const cook = add(g, own(resident("fisher")), 0, .10, .38) as Figure; cook.rotation.y = Math.PI;
  arms(cook).right.rotation.x = -1.4;
  const tongs = add(arms(cook).right, box(.028, .028, .36, TH.iron), 0, arms(cook).hand - .04, .15);
  const netMan = add(g, own(resident("fisher", false)), -2.6, .10, 1.2) as Figure; netMan.rotation.y = -.5;
  arms(netMan).left.rotation.x = -1.2; arms(netMan).right.rotation.x = -1.1;
  const gutters = [sit(g, 1.6, -.30, Math.PI - .3, "malay", .34), sit(g, 2.5, .30, Math.PI + .2, "fisher", .34)];
  const child = add(g, own(resident("child")), -2.35, .10, .30) as Figure; child.rotation.y = -1.1;
  const turmericWoman = add(g, own(resident("malay", false)), 1.0, .10, 2.3) as Figure; turmericWoman.rotation.y = -.2;
  arms(turmericWoman).right.rotation.x = -1.1;
  const walker = resident("fisher", false); add(g, walker, -3.6, .10, -.6);
  const walk = pacer(walker, V(-3.6, .10, -.6), V(-3.6, .10, 2.2), .28, 1.5);
  return life(g, "talayTh", [cook, netMan, gutters[0], gutters[1], child, turmericWoman, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 10 + i * 2) * .2 + beat(k, 0, .6) * .6; f.scale.set(s, s, s); f.rotation.y = t * 2.2 + i; });
    // 1. food first: the fish turns over on the sticks and the skin lifts off the flesh
    const turn = beat(k, 0, .56), lift = beat(k, .22, .84);
    fish.rotation.x = turn * Math.PI;
    fish.position.y = .57 + turn * .13;
    fish.rotation.z = turn * .1;
    skin.forEach((s, i) => { s.position.y = .075 + lift * (.05 + (i % 3) * .012); s.rotation.x = lift * .5; s.rotation.z = lift * ((i % 2) - .5) * .5; });
    // 2. the cook's tongs follow, 3. the man at the net looks round
    tongs.rotation.x = -beat(k, .3, .9) * .6;
    arms(cook).right.rotation.x = -1.4 - beat(k, .3, .9) * .4;
    upper(netMan).rotation.y = Math.sin(t * .4) * .08 + beat(k, .48, 1) * .8;
    arms(turmericWoman).right.rotation.x = -1.1 - Math.abs(Math.sin(t * 1.5)) * .2;
    squid.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.2 + i * .8) * .07; s.rotation.x = Math.cos(t * .9 + i) * .04; });
    walk(t);
  });
}

/**
 * The Malay-Muslim kitchen of the deep south: roti on the steel plate, budu in the jar, and the curries of
 * Pattani. The roti disc is thrown out thin and settles onto the plate.
 */
export function muslimKitchen(): P {
  const g = group();
  const sh = shelter(g, "kampong", 5.4, 3.0, 2.35, { stilts: .55 });
  lamps(g, sh.y, sh.zFront, [-2.4, 2.4], .85);
  add(g, box(1.5, .06, 1.0, TH.teak), -2.4, sh.floor - .28, 1.85);               // the step down to the ground
  add(g, box(1.5, .06, 1.0, TH.teak), -2.4, sh.floor - .55, 2.55);
  for (let i = 0; i < 8; i++) add(g, box(.42, .42, .03, i % 2 ? "#2F6F63" : TH.stuccoPastel), -1.9 + i * .5, sh.floor + .5, sh.zBack + .11);
  // the steel plate over its brick fire, at the front where the arrival camera reaches it
  add(g, box(1.7, .48, .95, TH.clay), -.5, .24, 2.30);
  const plate = add(g, cyl(.60, .58, .05, "#9AA0A6", 22), -.5, .51, 2.25); plate.name = "muslim-plate";
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.60, .022, 5, 22), mat("#6E7378")), -.5, .52, 2.25).rotation.x = Math.PI / 2;
  const fire = Array.from({ length: 3 }, (_, i) => { const f = add(g, cone(.07, .18, i % 2 ? TH.flameHot : TH.flame, 6), -.5 + Math.cos(i * 2.1) * .2, .34, 2.48 + Math.sin(i * 2.1) * .12); f.name = "muslim-flame"; return f; });
  // two roti already cooking on the plate, and the disc that is thrown: the subject
  for (const [i, dx] of [-.28, .24].entries()) { const r = add(g, cyl(.19, .19, .016, "#E4C48A", 18), -.5 + dx, .545, 2.25 + (i ? .2 : -.2)); add(g, cyl(.12, .12, .006, "#D9A85A", 14), -.5 + dx, .556, 2.25 + (i ? .2 : -.2)); void r; }
  const roti = add(g, new THREE.Group(), -.5, 1.05, 2.25); roti.name = "muslim-roti";
  const disc = add(roti, cyl(.20, .20, .022, "#E9D6A8", 20), 0, 0, 0);
  for (let i = 0; i < 5; i++) add(roti, cyl(.05, .05, .008, "#DCC48A", 10), Math.cos(i * 1.26) * .11, .014, Math.sin(i * 1.26) * .11);
  // the dough balls in oil, the budu jar, the khao mok pot, the curries in their bowls
  const ty = table(g, 1.55, .9, 1.6, .9, TH.teak, .70);
  const oilTray = add(g, cyl(.26, .24, .07, "#9AA0A6", 16), 1.2, ty + .035, .9);
  for (let i = 0; i < 5; i++) add(g, ball(.06, "#EFE0B8", 7), 1.2 + Math.cos(i * 1.26) * .13, ty + .08, .9 + Math.sin(i * 1.26) * .13).scale.y = .7;
  void oilTray;
  add(g, cyl(.20, .17, .38, TH.clay, 14), 2.05, .19, .95); add(g, cyl(.17, .17, .04, "#6E5C48", 14), 2.05, .40, .95);
  add(g, cyl(.06, .05, .16, "#4A3A2A", 8), 2.05, .48, .95);
  add(g, box(.24, .15, .02, TH.pelangiBlue), 2.05, .28, 1.14);                   // the budu jar, labelled, and cold
  const potM = add(g, cyl(.30, .26, .30, TH.brass, 16), -2.2, sh.floor + .70, 1.05);
  add(g, cyl(.31, .28, .05, TH.brass, 16), -2.2, sh.floor + .88, 1.05);
  add(g, box(1.1, .44, .8, TH.clay), -2.2, sh.floor + .22, 1.05);
  void potM;
  for (let i = 0; i < 3; i++) { add(g, cyl(.12, .095, .07, TH.riceWhite, 12), 1.35 + i * .3, ty + .035, .55); add(g, cyl(.10, .10, .025, ["#C9702C", "#D9942C", "#8A5A2A"][i], 12), 1.35 + i * .3, ty + .08, .55); }
  for (let i = 0; i < 4; i++) add(g, cyl(.045, .04, .14, "#D9942C", 8), 1.0 + i * .08, ty + .02, .35).rotation.z = 1.5;
  add(g, cyl(.16, .13, .10, TH.bambooPale, 12), 2.2, ty + .05, .55); for (let i = 0; i < 4; i++) add(g, ball(.05, "#E8D06A", 6), 2.2 + Math.cos(i * 1.57) * .08, ty + .12, .55 + Math.sin(i * 1.57) * .08);
  g.userData.steam = V(-2.2, sh.floor + 1.10, 1.05); g.userData.smoke = V(-.5, .80, 2.48);
  // a pelangi cloth hung to dry on a line to one side: the always-on sway
  add(g, cyl(.015, .015, 2.4, TH.bambooPale, 5), 3.0, 1.7, .4).rotation.set(0, 0, 1.5);
  const cloths = Array.from({ length: 3 }, (_, i) => {
    const c = add(g, new THREE.Group(), 3.0, 1.68, -.4 + i * .8); c.userData.foodReaction = "sway";
    add(c, box(.44, .60, .012, ["#B8496A", "#2F6F63", "#E8C24A"][i]), 0, -.32, 0);
    for (let n = 0; n < 4; n++) add(c, box(.42, .05, .014, "#E7D9C4"), 0, -.12 - n * .15, .006);
    return c;
  });
  // seven people: the roti maker, the child on the step, the rice cook, two eating, a woman at the jar, a walker
  const maker = add(g, own(resident("malay")), -.5, 0, 1.55) as Figure; maker.rotation.y = Math.PI;
  arms(maker).right.rotation.x = -1.9; arms(maker).left.rotation.x = -1.85;
  const child = add(g, own(resident("child")), -2.4, sh.floor - .49, 2.5) as Figure; child.rotation.y = 0;
  arms(child).left.rotation.x = -2.2; arms(child).right.rotation.x = -2.1;
  const riceCook = add(g, own(resident("malay", false)), -2.2, sh.floor, .45) as Figure; riceCook.rotation.y = Math.PI - .25;
  arms(riceCook).right.rotation.x = -1.0;
  const eaters = [seatFigure(g, resident("malay", false), 2.5, 1.75, Math.PI - .4, .38), seatFigure(g, resident("townsman"), 1.5, 1.95, Math.PI, .38)];
  add(g, box(1.9, .06, .34, TH.teak), 2.0, .38, 2.05); for (const dx of [-.8, .8]) add(g, box(.08, .35, .3, TH.teakDark), 2.0 + dx, .175, 2.05);
  const jarWoman = add(g, own(resident("malay", false)), 2.6, 0, .5) as Figure; jarWoman.rotation.y = -1.6;
  const walker = resident("fisher", false); add(g, walker, -2.9, 0, 3.35);
  const walk = pacer(walker, V(-2.9, 0, 3.35), V(2.9, 0, 3.45), .28, 1.0);
  const rotiRest = roti.position.clone();
  return life(g, "muslimKitchenTh", [maker, child, riceCook, eaters[0], eaters[1], jarWoman, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .18; f.scale.set(s, s, s); });
    // 1. food first: the disc is thrown out thin, spins, drops and settles onto the plate
    const throwOut = k > 0 ? clamp01((1 - k) / .70) : 0, spin = beat(k, 0, .70);
    roti.position.copy(rotiRest);
    roti.position.y = rotiRest.y - throwOut * .50 + Math.sin(throwOut * Math.PI) * .16;
    roti.rotation.y = throwOut * 9.0;
    roti.rotation.x = Math.sin(throwOut * Math.PI) * .35;
    const thin = 1 + throwOut * .75;
    disc.scale.set(thin, 1 - throwOut * .55, thin);
    roti.visible = true;
    void spin;
    // 2. the maker's hands follow the disc, 3. the child on the step reaches up
    arms(maker).right.rotation.x = -1.9 + throwOut * .7; arms(maker).left.rotation.x = -1.85 + throwOut * .65;
    upper(maker).rotation.x = -throwOut * .12;
    arms(child).left.rotation.x = -2.2 - beat(k, .45, 1) * .5; arms(child).right.rotation.x = -2.1 - beat(k, .45, 1) * .55;
    arms(riceCook).right.rotation.x = -1.0 - Math.abs(Math.sin(t * 1.4)) * .2;
    cloths.forEach((c, i) => { c.rotation.z = Math.sin(t * 1.1 + i * .9) * .08; c.rotation.x = Math.cos(t * .8 + i) * .04; });
    walk(t);
  });
}

/**
 * The tin town kitchen: a Phuket Baba household in a Sino-Portuguese shophouse, on tin money. The tiffin tier
 * lifts clear of the stack with steam off it; the clay pot's lid is set down.
 */
export function babaKitchen(): P {
  const g = group();
  const sh = shelter(g, "sinoPortuguese", 5.8, 3.2, 2.5, { sign: "บาบ๋า", storeys: 2, arcade: 3 });
  lamps(g, sh.y, sh.zFront, [-2.6, 2.6], .9, true);
  for (let i = 0; i < 10; i++) add(g, box(.48, .48, .03, i % 2 ? "#3E5A7A" : TH.stuccoPastel), -2.2 + i * .48, .5, sh.zBack + .11);
  // the tiled work bench at the front: the tiffin stack, the clay pot and the porcelain
  add(g, box(2.9, .78, 1.0, TH.stuccoPastel), -.2, .39, 2.04);
  add(g, box(2.94, .06, 1.04, "#B9B0A0"), -.2, .81, 2.04);
  for (let i = 0; i < 10; i++) add(g, box(.28, .28, .02, i % 2 ? "#3E5A7A" : "#E9E2D2"), -1.5 + i * .29, .55, 2.57);
  // the tiffin carrier: four tiers on a frame, the top one lifting clear. The subject
  const stack = add(g, new THREE.Group(), -1.25, .84, 2.00);
  const tiers = Array.from({ length: 3 }, (_, i) => {
    const tier = add(stack, new THREE.Group(), 0, i * .155, 0);
    add(tier, cyl(.155, .15, .14, TH.brass, 16), 0, .07, 0);
    add(tier, cyl(.16, .16, .018, "#9C7A2A", 16), 0, .148, 0);
    return tier;
  });
  const top = add(stack, new THREE.Group(), 0, .465, 0); top.name = "baba-tiffin";
  add(top, cyl(.155, .15, .14, TH.brass, 16), 0, .07, 0);
  add(top, cyl(.165, .165, .022, "#9C7A2A", 16), 0, .152, 0);
  add(top, cyl(.13, .13, .03, "#8A5A2A", 14), 0, .10, 0);
  add(top, new THREE.Mesh(new THREE.TorusGeometry(.055, .012, 5, 12, Math.PI), mat("#9C7A2A")), 0, .17, 0).rotation.z = 0;
  for (const side of [-1, 1]) add(stack, cyl(.012, .012, .66, "#9C7A2A", 5), side * .17, .33, 0);
  add(stack, box(.40, .022, .05, "#9C7A2A"), 0, .68, 0);
  void tiers;
  // the clay pot of moo hong with its lid, on the charcoal ring
  add(g, cyl(.24, .28, .22, TH.clay, 14), .55, .92, 2.00);
  const potB = add(g, cyl(.30, .26, .28, "#8A5A3C", 16), .55, 1.17, 2.00); potB.name = "baba-pot";
  const stewSurface = add(g, cyl(.26, .26, .03, "#5E3A22", 16), .55, 1.30, 2.00);
  const stewBits = Array.from({ length: 5 }, (_, i) => add(g, ball(.038, i % 2 ? "#7A4A2A" : "#C98A4A", 5), .55 + Math.cos(i * 1.26) * .15, 1.32, 2.00 + Math.sin(i * 1.26) * .15));
  const lid = add(g, new THREE.Group(), .55, 1.36, 2.00); lid.name = "baba-lid";
  add(lid, cyl(.30, .30, .035, "#8A5A3C", 16), 0, 0, 0);
  add(lid, ball(.045, "#7A4A2A", 7), 0, .045, 0);
  void stewSurface;
  const coalsB = Array.from({ length: 4 }, (_, i) => { const c = add(g, ball(.05, "#E9612D", 5), .55 + Math.cos(i * 1.57) * .13, .96, 2.00 + Math.sin(i * 1.57) * .13); c.scale.y = .5; return c; });
  g.userData.steam = V(-1.25, 1.45, 2.00); g.userData.smoke = V(.55, 1.05, 2.00);
  // the blue-and-white porcelain on the table, the Nyonya dishes, and the shrine niche
  const ty = table(g, 1.9, -.3, 1.9,1.0, "#6A4A32", .74);
  for (let i = 0; i < 4; i++) { const p = add(g, cyl(.15, .13, .028, "#E9E2D2", 16), 1.35 + i * .38, ty + .015, -.3); for (let n = 0; n < 6; n++) add(p, box(.035, .004, .035, TH.pelangiBlue), Math.cos(n * 1.05) * .10, .016, Math.sin(n * 1.05) * .10).rotation.y = n; }
  for (let i = 0; i < 3; i++) { add(g, cyl(.11, .09, .06, "#E9E2D2", 12), 1.5 + i * .5, ty + .045, .1); add(g, cyl(.09, .09, .025, ["#8A4A2A", "#C9A83A", "#4F7A3A"][i], 12), 1.5 + i * .5, ty + .085, .1); }
  add(g, cyl(.14, .11, .13, "#E9E2D2", 14), 2.55, ty + .08, -.25); add(g, ball(.12, TH.riceWhite, 8), 2.55, ty + .16, -.25).scale.y = .5;
  for (let i = 0; i < 6; i++) add(g, cyl(.014, .011, .18, "#3A2A1A", 5), 1.3 + (i % 3) * .03, ty + .03, .35 + Math.floor(i / 3) * .05).rotation.z = 1.5;
  const niche = add(g, new THREE.Group(), 2.5, 0, sh.zBack + .2);
  add(niche, box(.56, .78, .22, TH.lacquerRed), 0, 1.15, 0);
  add(niche, box(.62, .08, .28, TH.chediGold), 0, 1.58, 0);
  add(niche, cyl(.10, .09, .06, TH.brass, 10), 0, .80, .12);
  for (let i = 0; i < 3; i++) add(niche, cyl(.008, .008, .22, "#8A3A2A", 4), -.04 + i * .04, .92, .12);
  add(niche, box(.5, .06, .26, TH.teakDark), 0, .76, .0);
  // seven people: the woman at the table, the cook at the pot, a girl with the tiffin, two eating, a clerk, a walker
  const woman = add(g, own(resident("baba")), 1.9, 0, -1.25) as Figure; woman.rotation.y = 0;
  const cook = add(g, own(resident("baba", false)), .55, sh.floor, 1.05) as Figure; cook.rotation.y = Math.PI;
  arms(cook).right.rotation.x = -1.6; arms(cook).left.rotation.x = -1.4;
  const girl = add(g, own(resident("townswoman", false)), -1.25, sh.floor, 1.05) as Figure; girl.rotation.y = Math.PI - .15;
  arms(girl).right.rotation.x = -1.7;
  const eaters = [seatFigure(g, resident("baba", false), 1.35, .55, -.4, .42), seatFigure(g, resident("townsman"), 2.5, .6, .4, .42)];
  for (const [x, z] of [[1.35, .8], [2.5, .85]]) add(g, cyl(.17, .18, .42, TH.teakDark, 12), x, .21, z);
  const clerk = add(g, own(resident("baba", false)), -2.6, 0, 1.4) as Figure; clerk.rotation.y = 1.2;
  add(clerk, box(.22, .28, .04, "#E9E2D2"), .16, 1.0, .14);
  const walker = resident("teochew", false); add(g, walker, -3.0, 0, 2.6);
  const walk = pacer(walker, V(-3.0, 0, 2.6), V(2.9, 0, 2.8), .30, 1.7);
  const topRest = top.position.clone(), lidRest = lid.position.clone();
  return life(g, "babaTh", [girl, woman, cook, eaters[0], eaters[1], clerk, walker], (t, k) => {
    coalsB.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissive.setStyle(Math.sin(t * 1.5 + i) > 0 ? "#B4340E" : "#5A1A08"); (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .45 + Math.sin(t * 2 + i) * .2; });
    stewBits.forEach((b, i) => { b.position.y = 1.32 + Math.max(0, Math.sin(t * 2.8 + i)) * .014; });
    // 1. food first: the top tier lifts clear of the stack and turns, then the clay pot's lid is set down
    const lift = beat(k, 0, .62);
    top.position.copy(topRest);
    top.position.y = topRest.y + lift * .46; top.position.z = topRest.z + lift * .18;
    top.rotation.y = lift * 1.1; top.rotation.z = lift * .10;
    const setDown = beat(k, .20, .88);
    lid.position.copy(lidRest);
    lid.position.y = lidRest.y + setDown * .18; lid.position.x = lidRest.x - setDown * .34;
    lid.rotation.z = setDown * .55;
    // 2. the girl's arm follows the tier, 3. the woman at the table turns
    arms(girl).right.rotation.x = -1.7 - lift * .5;
    upper(girl).rotation.x = -lift * .10;
    arms(cook).right.rotation.x = -1.6 - setDown * .4;
    upper(woman).rotation.y = Math.sin(t * .35) * .07 + beat(k, .5, 1) * .9;
    walk(t);
  });
}

// ---------- the four market stall boats, ordinary clickable siblings on the basin ----------

/** The shared body of a stall boat: a hull, a paddler at the stern and a mooring pole. The load is the caller's. */
function stallBoat(g: P, len = 3.6, beamW = 1.1) {
  const b = hull(g, len, beamW, 0, 0);
  add(g, cyl(.045, .05, 2.0, TH.bambooPale, 6), -len / 2 + .2, .9, -.55).rotation.z = .12;
  add(g, cyl(.012, .012, .5, "#8A7448", 4), -len / 2 + .3, .45, -.4).rotation.set(.5, 0, 1.0);
  const paddler = boatSeat(b, resident("paddler"), -len * .34, .0, 1.3, .28);
  const paddle = add(arms(paddler).right, cyl(.02, .02, 1.0, TH.teak, 5), .02, arms(paddler).hand - .10, .08); paddle.rotation.x = .5;
  add(paddle, box(.15, .38, .02, "#9C7A4A"), 0, -.45, 0);
  return { boat: b, paddler, paddle };
}

/** Mangoes, rambutan and durian on a boat. A durian is lifted off the pile and split open. */
export function stallFruitBoat(): P {
  const g = group();
  const { boat, paddler, paddle } = stallBoat(g, 3.8, 1.2);
  add(boat, box(1.5, .05, .9, "#9C7A4A"), .35, .28, 0);
  for (let i = 0; i < 8; i++) add(boat, ball(.105, i % 2 ? "#E0A92C" : "#D98A2C", 7), -.15 + (i % 4) * .28, .36, -.28 + Math.floor(i / 4) * .3).scale.set(1.35, .85, .85);
  for (let i = 0; i < 7; i++) { const r = add(boat, ball(.075, "#B4342A", 7), .95 - (i % 4) * .18, .35, -.24 + Math.floor(i / 4) * .26); for (let k = 0; k < 7; k++) add(r, cyl(.008, .004, .09, "#7A9B3A", 4), Math.cos(k) * .06, Math.sin(k * .8) * .05, Math.sin(k) * .06).rotation.set(k, k * .7, k); }
  for (let i = 0; i < 3; i++) { const bn = add(boat, new THREE.Group(), -1.1, .34, -.2 + i * .22); for (let n = 0; n < 6; n++) add(bn, cyl(.032, .026, .20, "#C9C44A", 6), Math.cos(n) * .06, .05, Math.sin(n) * .06).rotation.set(.2, n, .3); }
  const durian = add(boat, new THREE.Group(), 1.25, .44, .0); durian.name = "stall-durian";
  const shell = add(durian, ball(.20, "#A8B85A", 9), 0, 0, 0);
  for (let k = 0; k < 18; k++) { const s = add(shell, cone(.045, .10, "#96A84E", 4), Math.cos(k * 1.1) * .19, Math.sin(k * .7) * .17, Math.sin(k * 1.1) * .19); s.lookAt(V(0, 0, 0)); s.rotateX(Math.PI / 2); }
  const halves = [-1, 1].map((side) => {
    const h = add(durian, new THREE.Group(), 0, 0, 0);
    const flesh = add(h, ball(.09, "#E8C24A", 7), side * .06, -.02, 0); flesh.scale.set(1.1, .8, .9);
    add(h, ball(.035, "#8A6A32", 6), side * .06, -.04, 0).scale.set(1, 1.3, 1);
    h.visible = false; return h;
  });
  for (let i = 0; i < 2; i++) add(boat, ball(.19, "#A8B85A", 8), -1.5, .40, -.15 + i * .3);
  const vendor = add(boat, own(resident("vendor")), .35, .21, -.1) as Figure; vendor.rotation.y = 1.3;
  add(boat, box(.5, .05, .5, "#9C8464"), .35, .19, -.1);
  const buyer = add(g, own(resident("townswoman", false)), -1.35, 0, 1.95) as Figure; buyer.rotation.y = 2.5;
  const shellRest = shell.scale.clone();
  return life(g, "floatingMarket", [vendor, buyer, paddler], (t, k) => {
    boat.rotation.z = Math.sin(t * .85) * .03; boat.position.y = Math.sin(t * .7) * .022;
    // 1. food first: the durian lifts off the pile, turns and splits, showing the flesh
    const lift = beat(k, 0, .52), split = beat(k, .22, .9);
    durian.position.set(1.25, .44 + lift * .30, .0);
    durian.rotation.y = lift * 1.3; durian.rotation.z = split * .2;
    shell.scale.copy(shellRest); shell.scale.x = shellRest.x * (1 + split * .35);
    (shell.material as THREE.MeshStandardMaterial).opacity = 1;
    halves.forEach((h, i) => { h.visible = split > .12; h.position.x = (i ? 1 : -1) * split * .16; h.rotation.z = (i ? 1 : -1) * split * .5; });
    arms(vendor).right.rotation.x = -.7 - lift * .8;
    upper(buyer).rotation.x = .05 + beat(k, .5, 1) * .28;
    paddle.rotation.x = .5 + Math.sin(t * .5) * .05;
  });
}

/** Boat noodles from the next boat over: one pot, small bowls, and a bowl handed up over the gunwale. */
export function stallNoodleBoat(): P {
  const g = group();
  const { boat, paddler, paddle } = stallBoat(g, 3.6, 1.1);
  add(boat, box(.5, .05, .55, "#9C8464"), -.2, .21, 0);
  add(boat, cyl(.24, .27, .28, TH.clay, 12), -.2, .34, 0);
  const flames = Array.from({ length: 3 }, (_, i) => add(boat, cone(.055, .16, i % 2 ? TH.flameHot : TH.flame, 6), -.2 + Math.cos(i * 2.1) * .09, .52, Math.sin(i * 2.1) * .09));
  add(boat, cyl(.28, .24, .26, TH.brass, 16), -.2, .62, 0);
  add(boat, cyl(.25, .25, .03, TH.broth, 16), -.2, .75, 0);
  const bits = Array.from({ length: 5 }, (_, i) => add(boat, ball(.03, i % 2 ? "#8A5A3C" : "#4F7A3A", 5), -.2 + Math.cos(i * 1.26) * .15, .77, Math.sin(i * 1.26) * .15));
  add(boat, box(.72, .05, .62, "#9C7A4A"), .95, .28, 0);
  for (let i = 0; i < 6; i++) add(boat, cyl(.095, .075, .07, TH.riceWhite, 10), .78 + (i % 3) * .2, .34 + Math.floor(i / 3) * .075, -.16);
  for (let i = 0; i < 3; i++) add(boat, cyl(.09, .075, .10, TH.clay, 10), -1.15 + i * .2, .32, .2);
  const bowl = add(boat, new THREE.Group(), 1.15, .33, .24); bowl.name = "stall-bowl";
  add(bowl, cyl(.115, .082, .10, TH.riceWhite, 12), 0, .05, 0);
  add(bowl, cyl(.095, .095, .028, TH.broth, 12), 0, .085, 0);
  for (let i = 0; i < 4; i++) add(bowl, cyl(.018, .014, .085, "#E4DCCB", 5), (i - 1.5) * .028, .11, 0).rotation.x = .25;
  add(bowl, ball(.03, "#9C4A3A", 5), .03, .12, .03).scale.set(1.5, .7, 1);
  const cook = add(boat, own(resident("cook")), .35, .21, -.06) as Figure; cook.rotation.y = 1.25;
  add(boat, box(.48, .05, .5, "#9C8464"), .35, .19, -.06);
  arms(cook).right.rotation.x = -1.2;
  const eater = add(g, own(resident("townsman", false)), -1.30, 0, 1.95) as Figure; eater.rotation.y = 2.4;
  arms(eater).right.rotation.x = -1.0;
  g.userData.steam = V(-.2, 1.0, 0); g.userData.smoke = V(-.2, .85, 0);
  const bowlRest = bowl.position.clone();
  return life(g, "kuaitiaoRuea", [cook, eater, paddler], (t, k) => {
    boat.rotation.z = Math.sin(t * .9 + .6) * .03; boat.position.y = Math.sin(t * .72) * .02;
    flames.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .2; f.scale.set(s, s, s); });
    bits.forEach((b, i) => { b.position.y = .77 + Math.max(0, Math.sin(t * 3.4 + i)) * .016; });
    // 1. food first: the bowl is lifted clear of the plank and handed up over the gunwale
    const hand = beat(k, 0, .62);
    bowl.position.copy(bowlRest);
    bowl.position.y = bowlRest.y + hand * .40; bowl.position.z = bowlRest.z + hand * .34; bowl.position.x = bowlRest.x + hand * .14;
    bowl.rotation.z = hand * .06;
    arms(cook).right.rotation.x = -1.2 - hand * .7;
    arms(eater).right.rotation.x = -1.0 - beat(k, .5, 1) * .7;
    upper(eater).rotation.x = .04 + beat(k, .5, 1) * .26;
    paddle.rotation.x = .5 + Math.sin(t * .45) * .05;
  });
}

/** Herbs and chillies on a boat: a bunch of lemongrass lifts out of the basket and the chillies shift under it. */
export function stallHerbBoat(): P {
  const g = group();
  const { boat, paddler, paddle } = stallBoat(g, 3.5, 1.05);
  add(boat, box(1.6, .05, .82, "#9C7A4A"), .3, .28, 0);
  const baskets = [-.35, .2, .75, 1.25].map((x, i) => {
    const bk = add(boat, cyl(.19, .15, .13, TH.bambooPale, 12), x, .365, (i % 2 ? .22 : -.2));
    if (i === 0) for (let n = 0; n < 9; n++) add(bk, cone(.026, .13, "#B4342A", 5), Math.cos(n * .7) * .1, .07, Math.sin(n * .7) * .1).rotation.set(1.3, n, .2);
    if (i === 1) for (let n = 0; n < 7; n++) add(bk, ball(.05, "#3F7A3A", 6), Math.cos(n * .9) * .1, .08, Math.sin(n * .9) * .1).scale.y = .7;
    if (i === 2) for (let n = 0; n < 6; n++) add(bk, cyl(.045, .035, .14, "#E4D9A8", 8), Math.cos(n) * .09, .08, Math.sin(n) * .09).rotation.z = .15;
    if (i === 3) for (let n = 0; n < 8; n++) add(bk, ball(.035, "#E9E2D2", 6), Math.cos(n * .8) * .1, .07, Math.sin(n * .8) * .1);
    return bk;
  });
  const bunch = add(boat, new THREE.Group(), -1.05, .40, .0); bunch.name = "stall-lemongrass";
  for (let i = 0; i < 7; i++) { const s = add(bunch, cyl(.026, .020, .46, "#C9D49A", 6), Math.cos(i * .9) * .045, .2, Math.sin(i * .9) * .045); s.rotation.set(Math.cos(i) * .10, 0, Math.sin(i) * .10); add(bunch, cyl(.014, .008, .30, "#7FA84A", 5), Math.cos(i * .9) * .05, .55, Math.sin(i * .9) * .05).rotation.set(Math.cos(i) * .2, 0, Math.sin(i) * .2); }
  add(bunch, box(.12, .02, .12, "#8A6844"), 0, .18, 0);
  const chillies = Array.from({ length: 6 }, (_, i) => add(boat, cone(.026, .14, i % 2 ? "#B4342A" : "#7FA84A", 5), -.75 + i * .12, .33, .3 - (i % 2) * .1));
  for (let i = 0; i < 4; i++) add(boat, box(.16, .012, .12, "#3F7A3A"), 1.5, .32 + i * .012, -.12 + i * .08).rotation.y = i * .3;
  const vendor = add(boat, own(resident("vendor")), -.5, .21, -.02) as Figure; vendor.rotation.y = 1.3;
  add(boat, box(.48, .05, .5, "#9C8464"), -.5, .19, -.02);
  arms(vendor).right.rotation.x = -1.1;
  const buyer = add(g, own(resident("townswoman", false)), 1.45, 0, 1.95) as Figure; buyer.rotation.y = -2.6;
  const bunchRest = bunch.position.clone();
  return life(g, "floatingMarket", [vendor, buyer, paddler], (t, k) => {
    boat.rotation.z = Math.sin(t * .95 + 1.4) * .03; boat.position.y = Math.sin(t * .68) * .02;
    // 1. material first: the bunch of lemongrass lifts out of the basket and turns; the chillies shift
    const lift = beat(k, 0, .58);
    bunch.position.copy(bunchRest);
    bunch.position.y = bunchRest.y + lift * .34; bunch.position.x = bunchRest.x + lift * .18;
    bunch.rotation.z = lift * .30; bunch.rotation.y = lift * .9;
    chillies.forEach((c, i) => { c.position.y = .33 + Math.abs(Math.sin(t * 2 + i)) * .004 + beat(k, .18, .8) * Math.abs(Math.sin(i * 2.3)) * .1; c.rotation.z = beat(k, .18, .8) * (i % 2 ? .6 : -.5); });
    baskets.forEach((b, i) => { b.rotation.y = Math.sin(t * .5 + i) * .03; });
    arms(vendor).right.rotation.x = -1.1 - lift * .75;
    upper(buyer).rotation.x = .05 + beat(k, .5, 1) * .28;
    paddle.rotation.x = .5 + Math.sin(t * .52) * .05;
  });
}

/** Young coconuts on a boat: one rolls off the pile into the vendor's hand and the cleaver waits over it. */
export function stallCoconutBoat(): P {
  const g = group();
  const { boat, paddler, paddle } = stallBoat(g, 3.7, 1.15);
  add(boat, box(1.7, .05, .9, "#9C7A4A"), .2, .28, 0);
  const pile: THREE.Mesh[] = [];
  for (let i = 0; i < 10; i++) pile.push(add(boat, ball(.155, "#8FA84A", 8), -.55 + (i % 5) * .30, .36 + Math.floor(i / 5) * .27, -.2 + (i % 2) * .26));
  for (let i = 0; i < 4; i++) add(boat, ball(.145, "#8A6A48", 8), -1.25, .35 + (i % 2) * .26, -.16 + Math.floor(i / 2) * .3);
  const roller = add(boat, new THREE.Group(), 1.1, .40, .0); roller.name = "stall-coconut-roll";
  add(roller, ball(.16, "#8FA84A", 9), 0, 0, 0).scale.y = .95;
  add(roller, cyl(.055, .075, .05, "#A8B85A", 10), 0, .14, 0);
  const cup = add(boat, cyl(.07, .058, .13, TH.bambooPale, 12), 1.35, .34, .34);
  const vendor = add(boat, own(resident("vendor")), .5, .21, -.06) as Figure; vendor.rotation.y = 1.3;
  add(boat, box(.48, .05, .5, "#9C8464"), .5, .19, -.06);
  const cleaver = add(arms(vendor).right, box(.24, .02, .085, "#9AA0A6"), .04, arms(vendor).hand - .04, .13);
  add(cleaver, box(.09, .03, .045, TH.teakDark), -.16, 0, 0);
  arms(vendor).right.rotation.x = -.8;
  const child = add(g, own(resident("child")), -1.30, 0, 1.90) as Figure; child.rotation.y = 2.4;
  void cup;
  const rollRest = roller.position.clone();
  return life(g, "floatingMarket", [vendor, child, paddler], (t, k) => {
    boat.rotation.z = Math.sin(t * .8 + 2.2) * .03; boat.position.y = Math.sin(t * .66) * .02;
    pile.forEach((p, i) => { p.rotation.y = Math.sin(t * .4 + i) * .04; });
    // 1. food first: the coconut rolls forward off the pile and settles under the cleaver
    const roll = k > 0 ? clamp01((1 - k) / .62) : 0;
    roller.position.copy(rollRest);
    roller.position.x = rollRest.x + roll * .28;
    roller.position.y = rollRest.y - Math.sin(roll * Math.PI) * .05;
    roller.rotation.z = -roll * 3.4;
    arms(vendor).right.rotation.x = -.8 - beat(k, .35, .95) * .55;
    upper(child).rotation.x = .05 + beat(k, .5, 1) * .3;
    paddle.rotation.x = .5 + Math.sin(t * .48) * .05;
  });
}

// ---------- trees, and the ten ingredient stops ----------

/** A coconut palm: a leaning trunk with ringed scars, a crown of fronds and nuts that `harvest` can pick. */
function coconutPalm(scale = 1, nuts = 5): P {
  const g = group();
  const h = 5.2 * scale;
  const trunk = add(g, cyl(.16 * scale, .26 * scale, h, "#9C8464", 9), 0, h / 2, 0); trunk.rotation.z = .07;
  for (let i = 0; i < 9; i++) add(g, cyl(.17 * scale, .17 * scale, .05, "#8A7454", 9), i * .02, .5 + i * (h - 1) / 9, 0);
  const crown = add(g, new THREE.Group(), .16 * scale, h, 0); g.userData.crown = crown;
  for (let i = 0; i < 8; i++) {
    const frond = add(crown, new THREE.Group(), 0, 0, 0); frond.rotation.y = (i * Math.PI * 2) / 8; frond.rotation.z = -.55 - (i % 3) * .12;
    add(frond, cyl(.035 * scale, .02 * scale, 1.9 * scale, "#4F7A3A", 5), .95 * scale, 0, 0).rotation.z = Math.PI / 2;
    for (let n = 0; n < 9; n++) for (const side of [-1, 1]) add(frond, box(.30 * scale, .012, .05 * scale, n % 2 ? "#3F7A3A" : "#5E8A3A"), (.35 + n * .19) * scale, -.03 * n * scale, side * .16 * scale).rotation.z = -.25;
  }
  const fruits = Array.from({ length: nuts }, (_, i) => add(crown, ball(.16 * scale, "#8FA84A", 7), Math.cos(i * 1.26) * .26 * scale, -.18 * scale, Math.sin(i * 1.26) * .26 * scale));
  g.userData.fruits = fruits;
  return g;
}
/** An orchard tree on a ridged bed: durian, mangosteen, mango or rambutan, with pickable fruit. */
function orchardTree(kind: "durian" | "mangosteen" | "mango" | "rambutan", scale = 1): P {
  const g = group();
  const h = 3.2 * scale;
  add(g, cyl(.14 * scale, .22 * scale, h, "#6E5642", 8), 0, h / 2, 0);
  for (let i = 0; i < 3; i++) add(g, cyl(.05 * scale, .08 * scale, .9 * scale, "#6E5642", 5), Math.cos(i * 2.1) * .3 * scale, h * .8, Math.sin(i * 2.1) * .3 * scale).rotation.set(Math.sin(i * 2.1) * .6, 0, -Math.cos(i * 2.1) * .6);
  const crown = add(g, new THREE.Group(), 0, h + .5 * scale, 0); g.userData.crown = crown;
  const leaf = kind === "durian" ? "#3A6A36" : kind === "mangosteen" ? "#2F5F33" : "#4F7A3A";
  for (let i = 0; i < 6; i++) add(crown, ball((.85 + (i % 3) * .16) * scale, i % 2 ? leaf : "#5E8A3A", 7), Math.cos(i * 1.05) * .7 * scale, Math.sin(i * .8) * .32 * scale, Math.sin(i * 1.05) * .7 * scale).scale.y = .8;
  const colour = kind === "durian" ? "#A8B85A" : kind === "mangosteen" ? "#5A2A32" : kind === "mango" ? "#E0A92C" : "#B4342A";
  const fruits = Array.from({ length: 5 }, (_, i) => {
    const f = add(crown, ball(kind === "durian" ? .18 * scale : .095 * scale, colour, 7), Math.cos(i * 1.26) * .85 * scale, -.42 * scale, Math.sin(i * 1.26) * .85 * scale);
    if (kind === "durian") for (let k = 0; k < 10; k++) add(f, cone(.04, .08, "#96A84E", 4), Math.cos(k * 1.3) * .16 * scale, Math.sin(k * .8) * .14 * scale, Math.sin(k * 1.3) * .16 * scale).lookAt(V(0, 0, 0));
    if (kind === "mango") f.scale.set(1.35, .9, .9);
    return f;
  });
  g.userData.fruits = fruits;
  return g;
}
/** A toddy palm: taller, straighter and stiffer than a coconut, with fan leaves and a cut flower stalk. */
function toddyPalm(scale = 1): P {
  const g = group();
  const h = 7.0 * scale;
  add(g, cyl(.18 * scale, .30 * scale, h, "#7A6A54", 9), 0, h / 2, 0);
  for (let i = 0; i < 12; i++) add(g, cyl(.19 * scale, .19 * scale, .06, "#6E6048", 9), 0, .6 + i * (h - 1.2) / 12, 0);
  const crown = add(g, new THREE.Group(), 0, h, 0); g.userData.crown = crown;
  for (let i = 0; i < 9; i++) {
    const fan = add(crown, new THREE.Group(), 0, 0, 0); fan.rotation.y = (i * Math.PI * 2) / 9; fan.rotation.z = -.35 - (i % 3) * .18;
    add(fan, cyl(.03 * scale, .02 * scale, 1.0 * scale, "#3F6A34", 5), .5 * scale, 0, 0).rotation.z = Math.PI / 2;
    for (let n = 0; n < 5; n++) add(fan, box(.9 * scale, .015, .1 * scale, n % 2 ? "#3F7A3A" : "#4F8A3A"), 1.35 * scale, 0, (n - 2) * .16 * scale).rotation.y = (n - 2) * .16;
  }
  return g;
}

/** Chilli, galangal and lemongrass: the Sampheng spice stall of shallow baskets under a cloth awning. */
export function spiceStall(): P {
  const g = group();
  const sh = shade(g, 3.8, 2.2, 2.25, 0, -.9, "#C9B489");
  lamps(g, sh.y, sh.zFront, [-1.6, 1.6], .75);
  add(g, box(4.4, .10, 2.6, "#C4BBA6"), 0, .05, -.5);
  // the stepped stall: three boards of shallow baskets, the front row where the camera reaches them
  for (const [row, z, y] of [[0, .45, .52], [1, -.05, .70], [2, -.55, .88]] as const) {
    add(g, box(3.4, .06, .5, TH.teak), 0, y, z);
    for (const dx of [-1.5, 1.5]) add(g, box(.08, y - .03, .44, TH.teakDark), dx, (y - .03) / 2, z);
    for (let i = 0; i < 4; i++) {
      const bk = add(g, cyl(.20, .16, .09, TH.bambooPale, 14), -1.2 + i * .8, y + .075, z);
      const kind = (row * 4 + i) % 8;
      if (kind === 0) for (let n = 0; n < 11; n++) add(bk, cone(.028, .15, "#9C2B23", 5), Math.cos(n * .6) * .12, .06, Math.sin(n * .6) * .12).rotation.set(1.35, n, .2);
      if (kind === 1) for (let n = 0; n < 8; n++) add(bk, cone(.026, .14, "#7FA84A", 5), Math.cos(n * .8) * .11, .06, Math.sin(n * .8) * .11).rotation.set(1.35, n, .2);
      if (kind === 2) for (let n = 0; n < 7; n++) add(bk, cyl(.05, .035, .16, "#E4D9A8", 8), Math.cos(n * .9) * .1, .09, Math.sin(n * .9) * .1).rotation.z = .18;
      if (kind === 3) for (let n = 0; n < 6; n++) add(bk, cyl(.03, .024, .28, "#C9D49A", 6), Math.cos(n) * .09, .06, Math.sin(n) * .09).rotation.z = 1.4;
      if (kind === 4) for (let n = 0; n < 9; n++) add(bk, ball(.04, "#E9E2D2", 6), Math.cos(n * .7) * .11, .06, Math.sin(n * .7) * .11);
      if (kind === 5) for (let n = 0; n < 8; n++) add(bk, ball(.05, "#B4746A", 6), Math.cos(n * .8) * .11, .06, Math.sin(n * .8) * .11).scale.set(1, 1.3, 1);
      if (kind === 6) for (let n = 0; n < 7; n++) add(bk, ball(.055, "#4F7A3A", 6), Math.cos(n * .9) * .1, .06, Math.sin(n * .9) * .1).scale.set(1, .85, 1);
      if (kind === 7) { add(bk, cyl(.17, .17, .05, "#8A6A32", 14), 0, .07, 0); for (let n = 0; n < 4; n++) add(bk, ball(.026, "#7A5A28", 5), Math.cos(n * 1.57) * .09, .10, Math.sin(n * 1.57) * .09); }
    }
  }
  // the scoop of dried chillies: the subject. It lifts out of the front basket and pours back into it
  const scoop = add(g, new THREE.Group(), 1.15, .64, .45); scoop.name = "spice-scoop";
  add(scoop, new THREE.Mesh(new THREE.SphereGeometry(.11, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(TH.bambooPale)), 0, 0, 0);
  for (let n = 0; n < 7; n++) add(scoop, cone(.022, .11, "#9C2B23", 5), Math.cos(n * .9) * .05, -.03, Math.sin(n * .9) * .05).rotation.set(1.3, n, .3);
  add(scoop, cyl(.013, .013, .22, TH.teak, 5), 0, .12, -.06).rotation.x = -.25;
  const falling = Array.from({ length: 6 }, (_, i) => { const m = add(g, cone(.02, .10, "#9C2B23", 5), 1.15 + Math.cos(i) * .05, .60, .45 + Math.sin(i) * .05); m.visible = false; return m; });
  // the weighing scale, the paper cones and the sacks on the ground
  const scale = add(g, new THREE.Group(), -1.75, 0, .35);
  add(scale, cyl(.05, .07, .95, TH.teakDark, 8), 0, .48, 0);
  add(scale, box(.7, .025, .04, TH.iron), 0, .98, 0);
  for (const side of [-1, 1]) { add(scale, cyl(.006, .006, .20, TH.iron, 4), side * .3, .88, 0); add(scale, cyl(.11, .10, .02, TH.brass, 12), side * .3, .78, 0); }
  for (let i = 0; i < 3; i++) add(g, cyl(.22, .27, .42, "#C9B48A", 10), -1.95 + i * .42, .21, -1.5);
  for (let i = 0; i < 3; i++) add(g, cone(.06, .18, "#E4DCCB", 6), 1.8, .12 + i * .04, -.2 + i * .14).rotation.z = 1.5;
  const seller = add(g, own(resident("vendor")), .85, 0, -1.30) as Figure; seller.rotation.y = 0;
  arms(seller).right.rotation.x = -1.2;
  const buyer = add(g, own(resident("townswoman", false)), -.7, 0, 1.35) as Figure; buyer.rotation.y = Math.PI - .3;
  const porter = resident("carrier", false); add(g, porter, -2.6, 0, 1.9);
  const walk = pacer(porter, V(-2.6, 0, 1.9), V(2.5, 0, 2.1), .28, .9);
  const scoopRest = scoop.position.clone();
  return life(g, "chilliesSea", [seller, buyer, porter], (t, k) => {
    // 1. material first: the scoop lifts out of the basket, tips, and the chillies fall back into it
    const lift = beat(k, 0, .48), tip = beat(k, .18, .72), fall = k > 0 ? clamp01(((1 - k) - .26) / .34) : 0;
    scoop.position.copy(scoopRest);
    scoop.position.y = scoopRest.y + lift * .34; scoop.position.z = scoopRest.z + lift * .12;
    scoop.rotation.z = tip * 1.15;
    falling.forEach((m, i) => { m.visible = fall > 0 && fall < 1; m.position.y = .90 - fall * .28 - (i % 3) * .02; m.position.x = 1.15 + Math.cos(i) * .05 * (1 + fall); m.rotation.set(1.2 + fall * 2, i, .3); });
    arms(seller).right.rotation.x = -1.2 - lift * .55;
    upper(buyer).rotation.x = .05 + beat(k, .5, 1) * .26;
    walk(t);
  });
}

/** The coconut groves: a climber's ladder on a palm, a grating stool and the press. Nuts fall into the baskets. */
export function coconutSea(): P {
  const g = group();
  add(g, box(8.0, .08, 6.0, "#7FA05A"), 0, .04, -.5);
  const palms = [coconutPalm(1.0, 6), coconutPalm(.88, 5), coconutPalm(1.05, 5), coconutPalm(.8, 4)];
  const at: [number, number][] = [[-1.5, -2.2], [1.8, -2.8], [-3.3, -3.6], [3.4, -3.4]];
  palms.forEach((p, i) => add(g, p, at[i][0], 0, at[i][1]));
  for (let i = 0; i < 6; i++) add(g, box(.5, .04, .5, TH.bambooPale), -1.4 + i * .26, .09, .5 + (i % 2) * .3);   // notched climbing steps lying by
  const baskets = [V(-.6, .12, 1.0), V(.9, .12, 1.2)];
  baskets.forEach((b, i) => { const bk = add(g, cyl(.38, .30, .32, TH.bambooPale, 14), b.x, .16, b.z); for (let n = 0; n < 5; n++) add(bk, ball(.15, "#8A6A48", 7), Math.cos(n * 1.26) * .16, .18, Math.sin(n * 1.26) * .16); void i; void bk; });
  // the grating stool ("rabbit") and the press: the cream comes off here
  const stool = add(g, new THREE.Group(), 2.0, 0, 1.0); stool.rotation.y = -.4;
  add(stool, box(.9, .10, .30, TH.teak), 0, .30, 0);
  for (const dx of [-.34, .34]) add(stool, box(.09, .30, .26, TH.teakDark), dx, .15, 0);
  const blade = add(stool, cyl(.075, .075, .03, "#9AA0A6", 12), .48, .34, 0); blade.rotation.z = Math.PI / 2;
  for (let n = 0; n < 8; n++) add(blade, box(.02, .012, .02, "#6E7378"), 0, Math.cos(n * .78) * .06, Math.sin(n * .78) * .06);
  const half = add(g, ball(.16, "#8A6A48", 9), 2.42, .42, 1.18); half.name = "coconut-half";
  add(g, cyl(.14, .14, .03, TH.riceWhite, 12), 2.42, .53, 1.18);
  const shreds = add(g, cyl(.16, .12, .06, TH.riceWhite, 14), 2.0, .40, 1.5); shreds.name = "coconut-shreds";
  for (let i = 0; i < 5; i++) add(shreds, box(.05, .01, .02, "#F4EFE2"), Math.cos(i * 1.26) * .08, .035, Math.sin(i * 1.26) * .08).rotation.y = i;
  const bowl = add(g, cyl(.20, .16, .12, TH.clay, 14), 2.6, .06, 1.85);
  const cream = add(g, cyl(.17, .17, .03, "#F7F2E6", 14), 2.6, .14, 1.85); cream.name = "coconut-cream";
  void bowl;
  const picker = add(g, own(resident("farmer")), -1.05, 0, -1.55) as Figure; picker.rotation.y = .6;
  arms(picker).left.rotation.x = -2.3; arms(picker).right.rotation.x = -2.2;
  const grater = seatFigure(g, resident("townswoman", false), 2.0, .28, -1.5, .40);
  const carrier = resident("carrier", false); add(g, carrier, -2.8, 0, 1.6);
  const walk = pacer(carrier, V(-2.8, 0, 1.6), V(2.6, 0, 2.3), .26, 1.3);
  const pick = harvest(g, palms, baskets, .30);
  return life(g, "coconutSea", [picker, grater, carrier], (t, k, dt) => {
    pick.tick(t, k, dt);
    // the cream loop: the grated flesh turns on the blade whatever happens, and the bowl fills on the click
    shreds.rotation.y = t * .6;
    half.rotation.y = -t * 1.1 - beat(k, .2, .9) * 2.0;
    cream.scale.y = 1 + beat(k, .3, 1) * 1.6;
    cream.position.y = .14 + beat(k, .3, 1) * .02;
    arms(picker).left.rotation.x = -2.3 - beat(k, 0, .6) * .35;
    arms(grater).right.rotation.x = -1.0 - Math.abs(Math.sin(t * 1.8)) * .3;
    walk(t);
  }, () => pick.poke());
}

/** The paddy and the buffalo: bunded squares, a plough and the egrets. The blade turns a curl of wet mud. */
export function paddyTh(): P {
  const g = group();
  for (let sx = 0; sx < 2; sx++) for (let sz = 0; sz < 2; sz++) {
    add(g, box(3.6, .05, 3.0, "#5E8A5A"), -2.1 + sx * 4.2, .09, -1.9 + sz * 3.4);
    add(g, box(3.4, .02, 2.8, "#7FA88A"), -2.1 + sx * 4.2, .12, -1.9 + sz * 3.4);
  }
  for (const x of [-4.0, 0, 4.0]) add(g, box(.24, .20, 7.0, "#A08A5E"), x, .10, -.2);
  for (const z of [-3.6, -.2, 3.2]) add(g, box(8.4, .20, .24, "#A08A5E"), 0, .10, z);
  for (let i = 0; i < 40; i++) { const r = add(g, cyl(.012, .010, .34, TH.paddyGreen, 4), -3.5 + (i % 10) * .32, .28, -3.0 + Math.floor(i / 10) * .55); r.rotation.set((i % 3) * .06, i, (i % 5) * .05); }
  // the buffalo on the bund with the plough behind it, and the furrow of turned mud
  const buffalo = add(g, new THREE.Group(), -.8, .20, .6); buffalo.rotation.y = -.25;
  const torso = add(buffalo, ball(.50, "#6A6560", 10), 0, 1.00, 0); torso.scale.set(1.62, .74, .78);
  add(buffalo, ball(.44, "#8A857E", 9), 0, .90, 0).scale.set(1.44, .46, .70);       // the pale underbelly
  add(buffalo, cyl(.20, .24, .46, "#6A6560", 8), .68, 1.10, 0).rotation.z = -.55;   // the neck
  const head = add(buffalo, new THREE.Group(), .99, 1.20, 0); head.name = "paddy-head";
  add(head, ball(.23, "#6A6560", 8), 0, 0, 0).scale.set(1.30, .88, .80);
  add(head, ball(.10, "#4A4642", 7), .26, -.07, 0);
  for (const side of [-1, 1]) { const horn = add(head, new THREE.Mesh(new THREE.TorusGeometry(.34, .045, 5, 12, Math.PI * 1.15), mat("#D9D0BA")), .02, .14, side * .14); horn.rotation.set(Math.PI / 2, 0, side * .55); }
  for (const [dx, dz] of [[-.50, -.26], [-.50, .26], [.50, -.26], [.50, .26]]) add(buffalo, cyl(.10, .08, .98, "#4A4642", 6), dx, .49, dz);
  add(buffalo, cyl(.03, .012, .5, "#4A4642", 5), -.88, 1.00, 0).rotation.z = .8;
  add(buffalo, box(.1, .08, .74, TH.teak), .46, 1.34, 0);                        // the yoke across the shoulders
  const plough = add(g, new THREE.Group(), -2.3, .20, .6);
  add(plough, cyl(.045, .05, 2.3, TH.teak, 6), .9, .55, 0).rotation.z = 1.42;
  add(plough, cyl(.04, .045, .8, TH.teak, 6), -.15, .42, 0).rotation.z = .5;
  const share = add(plough, box(.44, .10, .17, "#6E7378"), -.42, .12, 0); share.rotation.z = .3;
  add(plough, box(.05, .38, .05, TH.teak), -.05, .60, 0);
  const furrow = add(g, new THREE.Group(), -2.75, .20, .6); furrow.name = "paddy-furrow";
  const curls = Array.from({ length: 5 }, (_, i) => { const c = add(furrow, box(.22, .07, .13, "#6E5C3C"), -.1 - i * .16, .03, (i % 2 - .5) * .12); c.rotation.z = .2; return c; });
  add(g, box(1.6, .05, .34, "#6E5C3C"), -3.3, .21, .6);
  // the rice barn on its posts, well to the back, and the egrets in the near square
  const barn = add(g, new THREE.Group(), 3.4, 0, -3.5);
  for (const dx of [-.8, .8]) for (const dz of [-.6, .6]) add(barn, cyl(.11, .13, 1.2, TH.teakDark, 6), dx, .6, dz);
  for (const dx of [-.8, .8]) for (const dz of [-.6, .6]) add(barn, cyl(.2, .2, .08, "#9AA0A6", 10), dx, 1.24, dz);
  add(barn, box(2.2, 1.3, 1.7, "#9C8464"), 0, 1.95, 0);
  roofOver(barn, "central", 2.2, 1.7, 2.6, 0);
  const egrets = Array.from({ length: 4 }, (_, i) => {
    const e = add(g, new THREE.Group(), 1.5 + (i % 2) * 1.1, .14, -1.0 + Math.floor(i / 2) * 1.4);
    add(e, ball(.12, TH.riceWhite, 7), 0, .36, 0).scale.set(1.5, .85, .85);
    add(e, cyl(.036, .03, .26, TH.riceWhite, 5), .1, .53, 0).rotation.z = -.35;
    add(e, ball(.07, TH.riceWhite, 6), .19, .66, 0); add(e, cone(.023, .13, "#E8C24A", 5), .29, .65, 0).rotation.z = -1.4;
    for (const side of [-1, 1]) add(e, cyl(.012, .012, .32, "#3A3733", 4), 0, .18, side * .05);
    e.userData.wings = [-1, 1].map((side) => add(e, box(.22, .02, .10, "#F4EFE2"), 0, .38, side * .11));
    return e;
  });
  const ploughman = add(g, own(resident("farmer")), -2.95, .20, .05) as Figure; ploughman.rotation.y = 1.5;
  arms(ploughman).left.rotation.x = -1.5; arms(ploughman).right.rotation.x = -1.4;
  const planter = add(g, own(resident("farmer", false)), 1.9, .14, 1.6) as Figure; planter.rotation.y = -.4;
  upper(planter).rotation.x = .7;
  const walker = resident("farmer", false); add(g, walker, -3.6, .22, 2.6);
  const walk = pacer(walker, V(-3.6, .22, 2.6), V(3.4, .22, 2.8), .26, 1.1);
  return life(g, "naPaddyTh", [ploughman, planter, walker], (t, k) => {
    // 1. material first: the share bites and a curl of wet mud turns up in front of the plough
    const pull = beat(k, 0, .56);
    furrow.position.set(-2.75 + pull * .20, .20 + pull * .06, .6);
    furrow.rotation.z = pull * .18;
    curls.forEach((c, i) => { c.position.y = .03 + pull * (.10 + (i % 3) * .03); c.rotation.z = .2 + pull * (1.2 + (i % 2) * .4); c.position.x = -.1 - i * .16 - pull * .1; });
    share.rotation.z = .3 - pull * .16;
    plough.position.x = -2.3 + pull * .20;
    // 2. the buffalo leans into the yoke and lifts its head, 3. the egrets go up out of the square
    buffalo.position.x = -.8 + pull * .22;
    head.rotation.z = Math.sin(t * .3) * .04 + beat(k, .2, .9) * .5;
    torso.rotation.z = -pull * .05;
    // the buffalo covers ground, so its hooves swing in the travel direction and plant under the body
    buffalo.children.forEach((leg, n) => { if ((leg as THREE.Mesh).isMesh && leg !== torso) leg.rotation.z = -Math.sin(pull * Math.PI * 2 + (n % 2 ? Math.PI : 0)) * .30; });
    arms(ploughman).left.rotation.x = -1.5 - pull * .3; upper(ploughman).rotation.x = pull * .16;
    upper(planter).rotation.x = .7 + Math.sin(t * .9) * .12;
    egrets.forEach((e, i) => {
      const lift = beat(k, .42, 1);
      e.position.y = .14 + lift * (.55 + i * .16);
      (e.userData.wings as THREE.Object3D[]).forEach((w, n) => { w.rotation.z = Math.sin(t * 13 + n * Math.PI + i) * .85 * lift; });
      e.rotation.y = Math.sin(t * .4 + i * 2) * .45;
    });
    walk(t);
  });
}

/** The river fish and the traps: bamboo `sai` drawn up on the bank. One is tipped and the catch spills out. */
export function fishTraps(): P {
  const g = group();
  add(g, box(6.6, .10, 4.4, "#8A7A5A"), 0, .05, -.3);
  add(g, box(6.6, .06, 1.1, "#6E5C3C"), 0, .04, 2.0);                            // the wet mud at the canal's edge
  // the drying rack of traps, behind, and the working trap at the front
  for (const dx of [-2.3, .2]) { for (const x of [dx, dx + 1.6]) add(g, cyl(.05, .06, 1.5, TH.bambooPale, 5), x, .75, -2.1); add(g, cyl(.035, .035, 1.7, TH.bambooPale, 5), dx + .8, 1.40, -2.1).rotation.z = Math.PI / 2; }
  const dryers = Array.from({ length: 4 }, (_, i) => {
    const tr = add(g, new THREE.Group(), -2.1 + i * 1.05, 1.15, -2.1); tr.rotation.z = 1.3 + (i % 2) * .2;
    add(tr, cyl(.20, .28, .68, TH.bambooPale, 10), 0, 0, 0);
    for (let n = 0; n < 6; n++) add(tr, cyl(.205 + n * .012, .205 + n * .012, .02, "#A48E5A", 10), 0, -.30 + n * .12, 0);
    add(tr, cone(.18, .22, "#A48E5A", 8), 0, .38, 0);
    return tr;
  });
  const trap = add(g, new THREE.Group(), .9, .55, 1.05); trap.name = "fish-trap";
  add(trap, cyl(.24, .32, .80, TH.bambooPale, 12), 0, 0, 0);
  for (let n = 0; n < 7; n++) add(trap, cyl(.245 + n * .012, .245 + n * .012, .022, "#A48E5A", 12), 0, -.34 + n * .115, 0);
  add(trap, cone(.22, .26, "#A48E5A", 9), 0, .46, 0);
  add(trap, cyl(.07, .13, .18, "#8A7448", 8), 0, -.44, 0);
  const inside = Array.from({ length: 4 }, (_, i) => { const f = add(trap, ball(.065, i % 2 ? "#6E7A62" : "#8A8A7A", 6), Math.cos(i * 1.57) * .1, -.18 + (i % 2) * .1, Math.sin(i * 1.57) * .1); f.scale.set(2.1, .7, .8); return f; });
  // the basket the catch falls into, and the fish already on the rack
  const basket = add(g, cyl(.34, .27, .30, TH.bambooPale, 14), 1.6, .15, 1.35);
  const catchFish = Array.from({ length: 5 }, (_, i) => {
    const f = add(g, new THREE.Group(), 1.6 + Math.cos(i * 1.26) * .12, .28, 1.35 + Math.sin(i * 1.26) * .12); f.name = i === 0 ? "fish-catch" : "";
    const b = add(f, ball(.085, i % 2 ? "#6E7A62" : "#9AA090", 7), 0, 0, 0); b.scale.set(2.2, .7, .8);
    add(f, cone(.06, .14, i % 2 ? "#5E6A52" : "#8A9080", 6), -.22, .01, 0).rotation.z = Math.PI / 2;
    add(f, box(.04, .012, .09, "#4A5442"), .06, .05, 0);
    return f;
  });
  void basket;
  for (let i = 0; i < 4; i++) { const s = add(g, new THREE.Group(), -1.5 + i * .5, 1.05, .2); add(s, cyl(.01, .01, .2, "#8A7448", 4), 0, .1, 0); const f = add(s, ball(.07, "#B8B0A0", 6), 0, -.1, 0); f.scale.set(.8, 2.0, .6); }   // split fish drying on a line
  add(g, cyl(.015, .015, 2.4, TH.bambooPale, 5), -.75, 1.15, .2).rotation.set(0, 0, 1.5);
  // the lift-net frame at the water's edge, its net out of the water
  const frame = add(g, new THREE.Group(), -2.5, 0, 1.9);
  for (const dx of [-.6, .6]) add(frame, cyl(.055, .07, 2.2, TH.bambooPale, 5), dx, 1.1, 0).rotation.z = dx * .16;
  add(frame, cyl(.04, .04, 1.5, TH.bambooPale, 5), 0, 2.1, 0).rotation.z = Math.PI / 2;
  for (let i = 0; i < 5; i++) add(frame, cyl(.012, .012, 1.0, "#C9BCA0", 4), -.5 + i * .25, 1.55, .1).rotation.x = .2;
  add(frame, box(1.3, .02, 1.0, "#D9CFB4"), 0, 1.05, .35).rotation.x = .3;
  const fisher = add(g, own(resident("fisher")), .9, 0, .0) as Figure; fisher.rotation.y = Math.PI - .15;
  arms(fisher).right.rotation.x = -2.0; arms(fisher).left.rotation.x = -1.9;
  const sorter = seatFigure(g, resident("townswoman", false), 2.2, .55, -1.0, .34);
  const child = add(g, own(resident("child")), -.3, 0, 1.6) as Figure; child.rotation.y = -1.6;
  const walker = resident("farmer", false); add(g, walker, -2.9, 0, -1.0);
  const walk = pacer(walker, V(-2.9, 0, -1.0), V(2.8, 0, -1.2), .26, 1.6);
  const trapRest = trap.position.clone();
  return life(g, "plaTh", [fisher, sorter, child, walker], (t, k) => {
    // 1. material first: the trap is lifted, tips over the basket and the catch spills out of it
    const lift = beat(k, 0, .48), tip = beat(k, .16, .76), spill = k > 0 ? clamp01(((1 - k) - .28) / .42) : 0;
    trap.position.copy(trapRest);
    trap.position.y = trapRest.y + lift * .46; trap.position.x = trapRest.x + tip * .34;
    trap.rotation.z = tip * 1.5;
    inside.forEach((f, i) => { f.position.y = -.18 + (i % 2) * .1 + tip * .18; f.rotation.z = tip * (i % 2 ? 1.1 : -.9); });
    catchFish.forEach((f, i) => { const a = spill * (1 - i * .10); f.position.y = .28 + Math.abs(Math.sin(t * 2 + i)) * .01 + a * .16 * Math.sin(spill * Math.PI); f.rotation.z = a * (i % 2 ? .9 : -.8); f.rotation.y = a * 1.4; });
    dryers.forEach((d, i) => { d.rotation.y = Math.sin(t * .4 + i) * .03; });
    arms(fisher).right.rotation.x = -2.0 + lift * .55; arms(fisher).left.rotation.x = -1.9 + lift * .5;
    upper(fisher).rotation.x = -lift * .12;
    upper(sorter).rotation.x = .1 + Math.sin(t * 1.2) * .06 + beat(k, .5, 1) * .22;
    walk(t);
  });
}

/** The river orchards on ridged beds: durian, mangosteen, mango and rambutan. Fruit falls into the baskets. */
export function riverOrchard(): P {
  const g = group();
  add(g, box(8.4, .06, 6.0, "#6E8A4A"), 0, .03, -.6);
  for (let i = 0; i < 4; i++) { add(g, box(7.6, .22, .9, "#7A9A52"), 0, .14, -2.6 + i * 1.5); add(g, box(7.6, .04, .5, "#5E7A8A"), 0, .05, -1.85 + i * 1.5); }   // the beds and the water channels between them
  const trees = [orchardTree("durian", 1.0), orchardTree("mangosteen", .82), orchardTree("mango", .9), orchardTree("rambutan", .8)];
  const at: [number, number][] = [[-2.3, -2.4], [.6, -2.6], [2.8, -1.1], [-1.2, -1.0]];
  trees.forEach((tr, i) => add(g, tr, at[i][0], .25, at[i][1]));
  const baskets = [V(-.9, .28, 1.3), V(.8, .28, 1.5)];
  baskets.forEach((b) => { const bk = add(g, cyl(.36, .28, .30, TH.bambooPale, 14), b.x, .15, b.z); for (let n = 0; n < 5; n++) add(bk, ball(.09, n % 2 ? "#5A2A32" : "#E0A92C", 6), Math.cos(n * 1.26) * .15, .17, Math.sin(n * 1.26) * .15); });
  // the picking pole, the punt on the channel bank, the sorting mat
  add(g, cyl(.028, .035, 2.7, TH.bambooPale, 5), 2.4, 1.12, 1.4).rotation.set(.35, 0, .45);   // the picking pole leans on the bed, its butt on the ground
  add(g, box(1.6, .02, 1.1, "#4F7A3A"), 1.9, .27, 1.9);
  for (let i = 0; i < 6; i++) add(g, ball(.085, ["#5A2A32", "#E0A92C", "#B4342A"][i % 3], 7), 1.55 + (i % 3) * .35, .33, 1.7 + Math.floor(i / 3) * .38);
  for (let i = 0; i < 3; i++) { const d = add(g, ball(.17, "#A8B85A", 8), -2.5 + i * .42, .38, 1.7); for (let n = 0; n < 12; n++) add(d, cone(.04, .08, "#96A84E", 4), Math.cos(n * 1.1) * .16, Math.sin(n * .8) * .14, Math.sin(n * 1.1) * .16).lookAt(V(0, 0, 0)); }
  const picker = add(g, own(resident("farmer")), 1.9, .25, .35) as Figure; picker.rotation.y = -.4;
  arms(picker).left.rotation.x = -2.4; arms(picker).right.rotation.x = -2.35;
  const sorter = seatFigure(g, resident("townswoman", false), 2.5, 2.35, Math.PI - .4, .34);
  const carrier = resident("carrier", false); add(g, carrier, -3.2, .25, 2.2);
  const walk = pacer(carrier, V(-3.2, .25, 2.2), V(3.0, .25, 2.4), .26, 1.9);
  const pick = harvest(g, trees, baskets, .30);
  return life(g, "suanTh", [picker, sorter, carrier], (t, k, dt) => {
    pick.tick(t, k, dt);
    arms(picker).left.rotation.x = -2.4 - beat(k, 0, .6) * .3;
    upper(sorter).rotation.x = .12 + Math.sin(t * 1.1) * .07;
    walk(t);
  }, () => pick.poke());
}

/** The sugar palms of Phetchaburi: the climb, the bamboo cylinder under the cut stalk, the flat boiling pan. */
export function sugarPalms(): P {
  const g = group();
  add(g, box(7.6, .06, 5.4, "#B4A472"), 0, .03, -.4);
  const palms = [toddyPalm(1.0), toddyPalm(.9), toddyPalm(1.05)];
  const at: [number, number][] = [[-1.9, -2.4], [1.4, -3.0], [3.4, -2.0]];
  palms.forEach((p, i) => add(g, p, at[i][0], 0, at[i][1]));
  // the ladder lashed to the first palm, and the cylinder under its cut flower stalk
  const ladder = add(g, new THREE.Group(), -1.75, 0, -2.15);
  for (const dx of [-.16, .16]) add(ladder, cyl(.035, .04, 6.2, TH.bambooPale, 5), dx, 3.1, 0).rotation.z = -.04;
  for (let i = 0; i < 13; i++) add(ladder, cyl(.022, .022, .36, "#A48E5A", 5), 0, .5 + i * .44, 0).rotation.z = Math.PI / 2;
  const stalk = add(g, cyl(.035, .05, .9, "#7A6A3A", 6), -1.55, 6.3, -2.1); stalk.rotation.z = .9;
  const cylinder = add(g, new THREE.Group(), -1.05, 5.95, -2.1); cylinder.name = "palm-cylinder";
  add(cylinder, cyl(.09, .085, .46, TH.bambooPale, 10), 0, 0, 0);
  add(cylinder, cyl(.092, .092, .02, "#A48E5A", 10), 0, .16, 0);
  add(cylinder, cyl(.075, .075, .10, "#E4D9A8", 10), 0, -.10, 0);
  add(cylinder, cyl(.008, .008, .30, "#8A7448", 4), 0, .30, 0);
  // the boiling pan on its long fire: the toddy is boiled down to palm sugar here
  add(g, box(2.2, .44, .95, TH.clay), 1.6, .22, 1.35);
  add(g, box(2.24, .05, .99, TH.charcoalSmoke), 1.6, .46, 1.35);
  const fire = Array.from({ length: 5 }, (_, i) => { const f = add(g, cone(.07, .20, i % 2 ? TH.flameHot : TH.flame, 6), .85 + i * .38, .30, 1.62); f.name = "palm-flame"; return f; });
  const pan = add(g, cyl(.66, .52, .16, TH.brass, 22), 1.6, .57, 1.30); void pan;
  const syrup = add(g, cyl(.60, .60, .04, "#C9942C", 22), 1.6, .65, 1.30); syrup.name = "palm-syrup";
  const boil = Array.from({ length: 8 }, (_, i) => add(g, ball(.035, "#E4B85A", 5), 1.6 + Math.cos(i * .78) * .38, .67, 1.30 + Math.sin(i * .78) * .38));
  const pour = pourFall(g, "palm-toddy", "#E4D9A8", .028);
  const rings = splashRings(g, 3, 1.6, .67, 1.30, .09, "#E4D9A8");
  g.userData.steam = V(1.6, 1.00, 1.30); g.userData.smoke = V(1.6, .80, 1.62);
  // the moulds of set sugar, the stirring paddle and the stacked cylinders
  for (let i = 0; i < 6; i++) add(g, cyl(.085, .085, .05, "#9C6A32", 12), 3.0 + (i % 3) * .2, .06 + Math.floor(i / 3) * .05, 1.1);
  add(g, box(.7, .04, .44, TH.bambooPale), 3.2, .03, 1.1);
  for (let i = 0; i < 5; i++) add(g, cyl(.09, .085, .46, TH.bambooPale, 10), -2.6 + (i % 3) * .24, .23, 1.1 + Math.floor(i / 3) * .28);
  const paddle = add(g, cyl(.02, .02, 1.3, TH.teak, 5), 1.6, 1.0, .9); paddle.rotation.x = .5;
  add(paddle, box(.20, .34, .02, "#9C7A4A"), 0, -.6, 0);
  const boiler = add(g, own(resident("farmer")), 1.6, 0, .35) as Figure; boiler.rotation.y = Math.PI;
  arms(boiler).right.rotation.x = -1.3;
  const climber = add(g, own(resident("farmer", false)), -1.35, 2.6, -1.95) as Figure; climber.rotation.y = .1;
  arms(climber).left.rotation.x = -2.6; arms(climber).right.rotation.x = -2.5;
  legsOf(climber).left.thigh.rotation.x = -.5; legsOf(climber).right.thigh.rotation.x = -.2;
  const carrier = resident("carrier", false); add(g, carrier, -3.0, 0, 2.2);
  const walk = pacer(carrier, V(-3.0, 0, 2.2), V(2.8, 0, 2.4), .26, .7);
  const cylRest = cylinder.position.clone();
  return life(g, "tanTh", [boiler, climber, carrier], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .18; f.scale.set(s, s, s); });
    boil.forEach((b, i) => { b.position.y = .67 + Math.max(0, Math.sin(t * 3.4 + i * .8)) * .026; });
    // 1. material first: the cylinder comes down off the stalk and the toddy falls into the boiling pan
    const down = hold(k, .26, .78), tip = hold(k, .40, .80);
    cylinder.position.copy(cylRest);
    // the cylinder comes down the ladder and is held directly over the pan, so the toddy falls into it
    cylinder.position.y = cylRest.y - down * 4.70; cylinder.position.x = cylRest.x + down * 2.65; cylinder.position.z = cylRest.z + down * 3.40;
    cylinder.rotation.z = tip * 1.3;
    const running = tip > .15;
    pour.set(V(cylinder.position.x + .04, cylinder.position.y - .12, cylinder.position.z), V(1.6, .70, 1.30), running);
    rings.forEach((r, i) => { const a = tip * 2.0 - i * .25; r.visible = running && a > 0 && a < 1; const s = .4 + a * 1.4; r.scale.set(s, s, 1); (r.material as THREE.MeshStandardMaterial).opacity = Math.max(0, .8 - a * .8); });
    syrup.scale.y = 1 + tip * .9;
    paddle.rotation.z = Math.sin(t * .9) * .18 + tip * .3;
    arms(boiler).right.rotation.x = -1.3 - Math.abs(Math.sin(t * .9)) * .2 - tip * .3;
    arms(climber).left.rotation.x = -2.6 + beat(k, 0, .5) * .4;
    walk(t);
  });
}

/** The salt pans: sea water let into tiled pans in the dry season. The rake draws the cone higher. */
export function saltPans(): P {
  const g = group();
  add(g, box(8.6, .06, 6.0, "#C9BCA0"), 0, .03, -.4);
  for (let sx = 0; sx < 3; sx++) for (let sz = 0; sz < 2; sz++) {
    const x = -2.7 + sx * 2.7, z = -2.3 + sz * 2.2;
    add(g, box(2.4, .06, 1.9, sz ? "#E9E2D2" : "#CFCFC4"), x, .07, z);
    add(g, box(2.5, .12, .14, "#A79E90"), x, .07, z - .98); add(g, box(2.5, .12, .14, "#A79E90"), x, .07, z + .98);
    add(g, box(.14, .12, 2.0, "#A79E90"), x - 1.22, .07, z); add(g, box(.14, .12, 2.0, "#A79E90"), x + 1.22, .07, z);
    if (!sz) add(g, box(2.3, .015, 1.8, "#BCC9C4"), x, .09, z);                  // the pans still holding water
  }
  for (let i = 0; i < 5; i++) add(g, box(.16, .10, 6.0, "#B4A88E"), -3.6 + i * 1.8, .06, -.4);   // the walking bunds
  // the salt cones on the finished pan: the subject is the nearest of them
  const cones = [0, 1, 2].map((i) => {
    const c = add(g, new THREE.Group(), -1.1 + i * 1.3, .10, 1.55); if (i === 1) c.name = "salt-cone";
    add(c, cone(.42 - i * .04, .52 - i * .05, "#F4F2EA", 14), 0, .26, 0);
    for (let n = 0; n < 5; n++) add(c, ball(.035, "#FFFDF6", 5), Math.cos(n * 1.26) * .3, .05, Math.sin(n * 1.26) * .3);
    return c;
  });
  const grains = Array.from({ length: 8 }, (_, i) => { const m = add(g, ball(.028, "#FFFDF6", 5), .2 + Math.cos(i) * .3, .5, 1.55 + Math.sin(i) * .3); m.visible = false; return m; });
  // the rake, the baskets, the shed and the barrow
  const rake = add(g, new THREE.Group(), -.60, 0, 2.05); rake.name = "salt-rake";
  add(rake, cyl(.024, .028, 2.3, TH.teak, 5), 0, 1.0, 0).rotation.x = .42;
  add(rake, box(.95, .05, .10, "#9C7A4A"), 0, .06, -.46);
  for (let i = 0; i < 7; i++) add(rake, box(.03, .12, .03, TH.teakDark), -.4 + i * .135, -.02, -.46);
  for (let i = 0; i < 3; i++) { const bk = add(g, cyl(.26, .20, .24, TH.bambooPale, 12), 2.4 + (i % 2) * .6, .12, 1.7 + Math.floor(i / 2) * .5); add(bk, cone(.20, .18, "#F4F2EA", 10), 0, .18, 0); void bk; }
  const shed = add(g, new THREE.Group(), 3.5, 0, -2.4);
  for (const dx of [-1.0, 1.0]) for (const dz of [-.7, .7]) add(shed, cyl(.08, .10, 1.9, TH.teakDark, 6), dx, .95, dz);
  add(shed, box(2.3, .10, 1.7, "#9C8464"), 0, 1.90, 0);
  roofOver(shed, "central", 2.3, 1.7, 1.90, 0);
  for (let i = 0; i < 4; i++) add(shed, cyl(.24, .19, .26, TH.bambooPale, 12), -.7 + i * .45, .13, .3);
  add(shed, box(1.8, .9, .12, "#F4F2EA"), 0, .45, -.75);
  const barrow = add(g, new THREE.Group(), -2.9, 0, 1.9);
  add(barrow, box(.9, .26, .6, TH.teak), 0, .45, 0);
  add(barrow, cone(.28, .22, "#F4F2EA", 10), 0, .66, 0);
  add(barrow, new THREE.Mesh(new THREE.TorusGeometry(.26, .05, 6, 14), mat(TH.teakDark)), .55, .26, 0).rotation.y = Math.PI / 2;
  for (const dz of [-.22, .22]) add(barrow, cyl(.03, .03, 1.2, TH.teak, 5), -.3, .4, dz).rotation.z = 1.5;
  const raker = add(g, own(resident("farmer")), -.60, 0, 2.55) as Figure; raker.rotation.y = Math.PI;
  arms(raker).right.rotation.x = -1.1; arms(raker).left.rotation.x = -.9;
  const basketWoman = add(g, own(resident("townswoman", false)), 2.4, 0, 2.5) as Figure; basketWoman.rotation.y = Math.PI - .5;
  arms(basketWoman).right.rotation.x = -1.5;
  const carrier = resident("carrier", false); add(g, carrier, -3.4, 0, 2.7);
  const walk = pacer(carrier, V(-3.4, 0, 2.7), V(3.2, 0, 2.9), .26, 1.2);
  const coneRest = cones[1].scale.clone();
  return life(g, "kluaTh", [raker, basketWoman, carrier], (t, k) => {
    // 1. material first: the rake sweeps in and the cone grows, and grains tumble down its side
    const sweep = beat(k, 0, .52), grow = beat(k, .06, .88), fall = k > 0 ? clamp01(((1 - k) - .18) / .5) : 0;
    rake.position.z = 2.05 - sweep * .55; rake.rotation.x = -sweep * .16;
    cones[1].scale.copy(coneRest);
    cones[1].scale.set(coneRest.x * (1 + grow * .10), coneRest.y * (1 + grow * .34), coneRest.z * (1 + grow * .10));
    grains.forEach((m, i) => { m.visible = fall > 0 && fall < 1; const a = clamp01(fall * 1.6 - (i % 4) * .12); m.position.set(.2 + Math.cos(i) * (.14 + a * .34), .54 - a * .44, 1.55 + Math.sin(i) * (.14 + a * .34)); });
    cones[0].rotation.y = Math.sin(t * .2) * .02; cones[2].rotation.y = -Math.sin(t * .22) * .02;
    arms(raker).right.rotation.x = -1.1 - sweep * .45; upper(raker).rotation.x = sweep * .14;
    arms(basketWoman).right.rotation.x = -1.5 - Math.abs(Math.sin(t * 1.1)) * .25;
    walk(t);
  });
}

/** The pla ra jars under a raised house: fish under salt and rice bran for six months. The lid comes off. */
export function plaRaYard(): P {
  const g = group();
  add(g, box(6.4, .10, 4.6, "#C2A473"), 0, .05, -.4);
  // the underside of the house the jars stand in the shade of: posts and a floor, and nothing else
  for (const dx of [-2.3, .4, 2.6]) for (const dz of [-2.5, -.9]) add(g, cyl(.13, .15, 1.9, TH.teakDark, 6), dx, .95, dz);
  add(g, box(6.0, .16, 2.4, "#9C8464"), .1, 1.98, -1.7);
  for (let i = 0; i < 17; i++) add(g, box(.30, .05, 2.4, "#8A7454"), -2.7 + i * .35, 2.08, -1.7);
  const sh = shade(g, 3.6, 2.0, 2.30, .2, 1.0, "#B9A46A");
  lamps(g, sh.y, sh.zFront, [-1.4, 1.6], .75);
  // the row of jars; the front one is the one that opens
  const jars = Array.from({ length: 6 }, (_, i) => {
    const x = -2.0 + (i % 3) * .95, z = -2.3 + Math.floor(i / 3) * 1.0;
    const j = add(g, new THREE.Group(), x, 0, z);
    add(j, cyl(.30, .24, .64, TH.clay, 14), 0, .32, 0);
    add(j, cyl(.26, .30, .10, "#7A5A46", 14), 0, .67, 0);
    add(j, cyl(.28, .28, .04, "#6E5238", 14), 0, .73, 0);
    for (let n = 0; n < 3; n++) add(j, cyl(.305, .305, .02, "#7A5A46", 14), 0, .20 + n * .16, 0);
    return j;
  });
  const openJar = add(g, new THREE.Group(), 1.05, 0, 1.25);
  add(openJar, cyl(.34, .27, .70, TH.clay, 16), 0, .35, 0);
  for (let n = 0; n < 3; n++) add(openJar, cyl(.345, .345, .022, "#7A5A46", 16), 0, .22 + n * .18, 0);
  add(openJar, cyl(.30, .34, .10, "#7A5A46", 16), 0, .73, 0);
  const bran = add(openJar, cyl(.28, .28, .06, "#C9A86A", 16), 0, .72, 0); bran.name = "plara-bran";
  const brine = add(openJar, cyl(.26, .26, .04, "#7A5A32", 16), 0, .70, 0); brine.name = "plara-brine";
  const lid = add(g, new THREE.Group(), 1.05, .80, 1.25); lid.name = "plara-lid";
  add(lid, cyl(.33, .33, .05, "#6E5238", 16), 0, 0, 0);
  add(lid, ball(.06, "#5E4630", 7), 0, .055, 0);
  add(lid, box(.66, .012, .10, TH.bambooPale), 0, .03, 0);
  // the weight stone, the salt basket, the fish tray and the bran sack
  add(g, ball(.16, TH.limestoneGrey, 7), 1.75, .12, 1.7).scale.set(1.2, .7, 1.1);
  const saltBasket = add(g, cyl(.24, .19, .22, TH.bambooPale, 12), -.35, .11, 1.55);
  add(saltBasket, cone(.19, .16, "#F4F2EA", 10), 0, .17, 0);
  const tray = add(g, box(.9, .10, .62, TH.bambooPale), -1.4, .21, 1.35);
  for (const dx of [-.34, .34]) add(g, box(.09, .16, .58, TH.teakDark), -1.4 + dx, .08, 1.35);
  for (let i = 0; i < 5; i++) { const f = add(g, ball(.08, "#8A8A7A", 7), -1.65 + (i % 3) * .26, .29, 1.22 + Math.floor(i / 3) * .24); f.scale.set(2.0, .6, .8); f.rotation.y = i * .4; }
  void tray;
  add(g, cyl(.23, .28, .44, "#C9B48A", 10), 2.4, .22, .35);
  const keeper = add(g, own(resident("isan")), 1.60, 0, .55) as Figure; keeper.rotation.y = -.62;
  arms(keeper).right.rotation.x = -1.55; arms(keeper).left.rotation.x = -1.45;
  const salter = seatFigure(g, resident("isan", false), -1.4, 2.05, Math.PI, .34);
  const child = add(g, own(resident("child")), 2.2, 0, 1.9) as Figure; child.rotation.y = Math.PI + .5;
  const walker = resident("farmer", false); add(g, walker, -2.7, 0, 2.6);
  const walk = pacer(walker, V(-2.7, 0, 2.6), V(2.6, 0, 2.8), .26, 2.0);
  const lidRest = lid.position.clone();
  return life(g, "plaRaTh", [keeper, salter, child, walker], (t, k) => {
    // 1. material first: the lid comes off, the bran crust is pressed down and the brine wells up through it
    const off = beat(k, 0, .50), press = beat(k, .18, .82);
    lid.position.copy(lidRest);
    lid.position.y = lidRest.y + off * .34; lid.position.x = lidRest.x + off * .52; lid.position.z = lidRest.z + off * .18;
    lid.rotation.z = off * .7; lid.rotation.x = off * .2;
    bran.position.y = .72 - press * .07;
    bran.scale.set(1 + press * .04, 1 - press * .3, 1 + press * .04);
    brine.position.y = .70 + press * .045;
    brine.scale.y = 1 + press * 1.5;
    jars.forEach((j, i) => { j.rotation.y = Math.sin(t * .18 + i) * .015; });
    arms(keeper).right.rotation.x = -1.55 - off * .5; arms(keeper).left.rotation.x = -1.45 - press * .4;
    upper(child).rotation.x = .05 + beat(k, .5, 1) * .3;
    upper(salter).rotation.x = .12 + Math.sin(t * 1.2) * .06;
    walk(t);
  });
}

/** The miang tea gardens: Assam tea under the forest canopy, steamed and fermented in bamboo baskets. */
export function miangGrove(): P {
  const g = group();
  add(g, box(7.8, .06, 5.6, "#5E7A44"), 0, .03, -.6);
  // the forest canopy the tea grows under, at the back, and the tea bushes in rows in front of it
  for (const [x, z, s] of [[-3.2, -3.4, 1.15], [.4, -3.8, 1.0], [3.3, -3.2, .92]] as const) {
    const tr = add(g, new THREE.Group(), x, 0, z);
    add(tr, cyl(.20 * s, .30 * s, 4.4 * s, "#5E4A36", 8), 0, 2.2 * s, 0);
    for (let i = 0; i < 5; i++) add(tr, ball(1.0 * s, i % 2 ? "#3A6A36" : "#4F7A3A", 7), Math.cos(i * 1.26) * .8 * s, (4.5 + Math.sin(i) * .4) * s, Math.sin(i * 1.26) * .8 * s).scale.y = .75;
  }
  const bushes = Array.from({ length: 8 }, (_, i) => {
    const b = add(g, new THREE.Group(), -2.6 + (i % 4) * 1.6, 0, -1.9 + Math.floor(i / 4) * 1.2);
    add(b, cyl(.07, .09, .5, "#6E5642", 6), 0, .25, 0);
    for (let n = 0; n < 4; n++) add(b, ball(.34, n % 2 ? "#3F7A3A" : "#4F8A44", 7), Math.cos(n * 1.57) * .22, .62 + (n % 2) * .12, Math.sin(n * 1.57) * .22).scale.y = .8;
    return b;
  });
  // the picker's basket, the leaves that drop into it, and the steamer on its pot
  const basket = add(g, cyl(.30, .24, .34, TH.bambooPale, 14), .55, .17, 1.15); basket.name = "miang-basket";
  const leaves = add(g, new THREE.Group(), .55, .36, 1.15); leaves.name = "miang-leaves";
  for (let i = 0; i < 9; i++) { const l = add(leaves, box(.13, .012, .07, i % 2 ? "#3F7A3A" : "#4F8A44"), Math.cos(i * .7) * .13, (i % 3) * .018, Math.sin(i * .7) * .13); l.rotation.set(.1, i * .7, .1); }
  const dropping = Array.from({ length: 5 }, (_, i) => { const l = add(g, box(.12, .012, .065, "#4F8A44"), .55 + Math.cos(i) * .1, .8, 1.15 + Math.sin(i) * .1); l.visible = false; return l; });
  add(g, box(1.5, .48, .9, TH.clay), 2.3, .24, 1.0);
  add(g, box(1.54, .05, .94, TH.charcoalSmoke), 2.3, .50, 1.0);
  const fire = Array.from({ length: 3 }, (_, i) => add(g, cone(.06, .17, i % 2 ? TH.flameHot : TH.flame, 6), 2.0 + i * .3, .36, 1.28));
  add(g, cyl(.28, .24, .30, TH.clay, 14), 2.3, .66, 1.0);
  const steamer = add(g, new THREE.Group(), 2.3, .96, 1.0); steamer.name = "miang-steamer";
  add(steamer, cyl(.30, .26, .40, TH.bambooPale, 14), 0, .20, 0);
  for (let i = 0; i < 4; i++) add(steamer, cyl(.305, .305, .022, "#A48E5A", 14), 0, .07 + i * .10, 0);
  const lid = add(g, new THREE.Group(), 2.3, 1.42, 1.0); lid.name = "miang-lid";
  add(lid, cyl(.31, .28, .06, "#A48E5A", 14), 0, 0, 0); add(lid, cyl(.05, .05, .07, TH.teak, 8), 0, .06, 0);
  g.userData.steam = V(2.3, 1.55, 1.0); g.userData.smoke = V(2.3, 1.10, 1.28);
  // the fermenting baskets lined with leaves, bound with strips, under the shade
  const sh = shade(g, 3.0, 1.8, 2.25, -2.6, -1.4, "#B9A46A");
  lamps(g, sh.y, sh.zFront, [-3.45, -1.75], .72);   // the beam is offset with the shade, and the lamps hang from its ends
  for (let i = 0; i < 4; i++) { const b = add(g, cyl(.26, .21, .34, TH.bambooPale, 12), -3.4 + (i % 2) * .9, .17, -1.9 + Math.floor(i / 2) * .7); add(b, box(.44, .03, .44, "#3F7A3A"), 0, .18, 0); for (let n = 0; n < 3; n++) add(b, cyl(.265, .265, .02, "#8A7448", 12), 0, -.08 + n * .12, 0); }
  const picker = add(g, own(resident("lanna")), .55, 0, 1.85) as Figure; picker.rotation.y = Math.PI;
  arms(picker).right.rotation.x = -1.7; arms(picker).left.rotation.x = -1.6;
  const steamerHand = add(g, own(resident("lanna", false)), 2.3, 0, 1.95) as Figure; steamerHand.rotation.y = Math.PI - .2;
  arms(steamerHand).right.rotation.x = -1.3;
  const binder = seatFigure(g, resident("lanna", false), -2.6, -.55, Math.PI, .34);
  const walker = resident("muleteer", false); add(g, walker, -3.2, 0, 2.6);
  const walk = pacer(walker, V(-3.2, 0, 2.6), V(3.0, 0, 2.8), .26, 1.4);
  const lidRest = lid.position.clone();
  return life(g, "miangTh", [picker, steamerHand, binder, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 9 + i * 2) * .18; f.scale.set(s, s, s); });
    // 1. material first: a handful of leaves drops into the basket, then the steamer lid lifts off the tea
    const drop = k > 0 ? clamp01((1 - k) / .48) : 0, open = beat(k, .28, .92);
    dropping.forEach((l, i) => { const a = clamp01(drop * 1.5 - i * .1); l.visible = drop > .02 && a < 1; l.position.set(.55 + Math.cos(i) * .12, .82 - a * .42, 1.15 + Math.sin(i) * .12); l.rotation.set(a * 3, i, a * 2); });
    leaves.scale.setScalar(1 + beat(k, .3, 1) * .22);
    leaves.position.y = .36 + beat(k, .3, 1) * .04;
    lid.position.copy(lidRest);
    lid.position.y = lidRest.y + open * .30; lid.position.x = lidRest.x + open * .22;
    lid.rotation.z = open * .35;
    bushes.forEach((b, i) => { b.rotation.z = Math.sin(t * .9 + i) * .02 + (i === 2 ? beat(k, 0, .5) * .08 : 0); });
    arms(picker).right.rotation.x = -1.7 - beat(k, 0, .6) * .5;
    arms(steamerHand).right.rotation.x = -1.3 - open * .45;
    walk(t);
  });
}

/** Turmeric and the southern beds: turmeric, black pepper and krachai. A rhizome is pulled and the earth falls off. */
export function turmericBeds(): P {
  const g = group();
  add(g, box(7.4, .06, 5.2, "#8A6A48"), 0, .03, -.4);
  for (let i = 0; i < 4; i++) { add(g, box(6.6, .24, .8, "#9C7A52"), 0, .15, -2.3 + i * 1.25); for (let n = 0; n < 12; n++) { const leaf = add(g, new THREE.Group(), -2.9 + n * .52, .27, -2.3 + i * 1.25); for (let m = 0; m < 3; m++) { const l = add(leaf, box(.10, .012, .46, "#5E8A3A"), Math.cos(m * 2.1) * .05, .22 + m * .04, Math.sin(m * 2.1) * .05); l.rotation.set(-.5 - m * .12, m * 2.1, 0); } } }
  // the pepper vines on their poles at the back, and the krachai clump beside the beds
  for (let i = 0; i < 3; i++) {
    const pole = add(g, new THREE.Group(), -2.4 + i * 2.4, 0, -3.1);
    add(pole, cyl(.07, .09, 2.6, TH.teakDark, 6), 0, 1.3, 0);
    for (let n = 0; n < 9; n++) add(pole, ball(.19, n % 2 ? "#3F7A3A" : "#4F8A44", 6), Math.cos(n * .9) * .22, .5 + n * .24, Math.sin(n * .9) * .22).scale.y = .7;
    for (let n = 0; n < 5; n++) { const s = add(pole, new THREE.Group(), Math.cos(n * 1.26) * .26, .9 + n * .3, Math.sin(n * 1.26) * .26); for (let m = 0; m < 6; m++) add(s, ball(.022, m > 3 ? "#B4342A" : "#7FA84A", 5), 0, -m * .045, 0); }
  }
  for (let i = 0; i < 4; i++) { const kr = add(g, new THREE.Group(), 2.6 + (i % 2) * .5, .06, .6 + Math.floor(i / 2) * .5); for (let n = 0; n < 5; n++) add(kr, cyl(.026, .02, .30, "#D9A83A", 5), Math.cos(n * 1.26) * .05, .15, Math.sin(n * 1.26) * .05).rotation.set(.15, n, .1); }
  // the rhizome that is pulled: the subject, at the front of the nearest bed
  const plant = add(g, new THREE.Group(), -.6, .27, 1.35);
  for (let m = 0; m < 4; m++) { const l = add(plant, box(.12, .014, .52, "#5E8A3A"), Math.cos(m * 1.57) * .06, .26 + m * .04, Math.sin(m * 1.57) * .06); l.rotation.set(-.5 - m * .1, m * 1.57, 0); }
  const root = add(g, new THREE.Group(), -.6, .18, 1.35); root.name = "turmeric-root";
  add(root, ball(.10, "#D9942C", 8), 0, 0, 0).scale.set(1.5, .85, .9);
  for (let i = 0; i < 5; i++) add(root, cyl(.036, .028, .15, "#E0A92C", 6), Math.cos(i * 1.26) * .10, -.01, Math.sin(i * 1.26) * .10).rotation.set(1.3, i * 1.26, .3);
  add(root, ball(.045, "#C9842C", 6), -.13, -.02, 0);
  const soil = Array.from({ length: 7 }, (_, i) => { const m = add(g, ball(.030, "#6E5238", 5), -.6 + Math.cos(i) * .1, .2, 1.35 + Math.sin(i) * .1); m.visible = false; return m; });
  // the washing tub, the cut rhizomes on the mat, the pepper drying mat and the mortar
  const tub = add(g, cyl(.38, .32, .26, TH.clay, 16), 1.2, .13, 1.75);
  add(g, cyl(.34, .34, .04, "#C9A86A", 16), 1.2, .24, 1.75);
  for (let i = 0; i < 4; i++) add(g, ball(.075, "#E0A92C", 6), 1.2 + Math.cos(i * 1.57) * .16, .27, 1.75 + Math.sin(i * 1.57) * .16).scale.set(1.4, .8, .9);
  void tub;
  add(g, box(1.5, .02, 1.0, TH.bambooPale), 2.5, .07, 1.9);
  for (let i = 0; i < 12; i++) add(g, ball(.026, i % 3 ? "#3A2A1A" : "#6E5238", 5), 2.1 + (i % 4) * .26, .10, 1.65 + Math.floor(i / 4) * .26);
  for (let i = 0; i < 6; i++) add(g, cyl(.034, .026, .16, "#E0A92C", 6), 2.85 + (i % 3) * .1, .09, 2.1 + Math.floor(i / 3) * .12).rotation.z = 1.5;
  const mortar = add(g, cyl(.16, .19, .24, TH.limestoneGrey, 14), -2.2, .12, 1.6);
  add(g, cyl(.14, .14, .04, "#D9942C", 12), -2.2, .25, 1.6);
  const pestle = add(g, cyl(.035, .045, .30, TH.limestoneGrey, 8), -2.2, .45, 1.6);
  void mortar;
  const puller = add(g, own(resident("malay")), -1.20, 0, .70) as Figure; puller.rotation.y = .70;
  arms(puller).right.rotation.x = -2.2; arms(puller).left.rotation.x = -2.0;
  const washer = seatFigure(g, resident("malay", false), 1.2, 2.35, Math.PI, .34);
  const pounder = seatFigure(g, resident("townswoman", false), -2.2, 2.2, Math.PI, .34);
  const walker = resident("fisher", false); add(g, walker, -3.0, 0, 2.8);
  const walk = pacer(walker, V(-3.0, 0, 2.8), V(2.9, 0, 3.0), .26, .5);
  const rootRest = root.position.clone();
  return life(g, "khamminTh", [puller, washer, pounder, walker], (t, k) => {
    // 1. material first: the rhizome comes up out of the bed, the earth falls off it and the orange shows
    const pull = beat(k, 0, .56), shake = beat(k, .22, .86), fall = k > 0 ? clamp01(((1 - k) - .20) / .46) : 0;
    root.position.copy(rootRest);
    root.position.y = rootRest.y + pull * .58; root.position.z = rootRest.z + pull * .18;
    root.rotation.z = shake * Math.sin(t * 22) * .28; root.rotation.y = pull * .8;
    plant.position.y = .27 + pull * .10; plant.rotation.z = pull * .18;
    soil.forEach((m, i) => { const a = clamp01(fall * 1.6 - (i % 4) * .1); m.visible = fall > 0 && a < 1; m.position.set(-.6 + Math.cos(i) * (.08 + a * .22), .70 - a * .52, 1.35 + Math.sin(i) * (.08 + a * .22)); });
    arms(puller).right.rotation.x = -2.2 + pull * .75; arms(puller).left.rotation.x = -2.0 + pull * .6;
    upper(puller).rotation.x = .18 - pull * .34;
    upper(washer).rotation.x = .12 + Math.sin(t * 1.3) * .07;
    pestle.position.y = .45 + Math.abs(Math.sin(t * 1.7)) * .07;
    arms(pounder).right.rotation.x = -1.2 - Math.abs(Math.sin(t * 1.7)) * .28;
    walk(t);
  });
}

// ---------- the six landmarks, each with a card and a 3D reaction ----------

/** The wat: tiered orange-and-green roofs, gilded chofa finials, naga stairs and a white and gold chedi. */
export function wat(): P {
  const g = group();
  add(g, box(9.4, .5, 7.0, "#C9BDA3"), -.3, .25, -.6);
  add(g, box(9.6, .12, 7.2, "#B9AD93"), -.3, .54, -.6);
  // the vihara, its roofs in three falls, with naga running down the eave edges
  add(g, box(5.0, 3.2, 4.0, TH.stuccoPastel), -1.6, 2.1, -.9);
  for (let i = 0; i < 4; i++) add(g, cyl(.16, .18, 3.2, TH.chediGold, 8), -4.0 + i * 1.7, 2.1, 1.05);
  for (let i = 0; i < 3; i++) {
    const w = 6.2 - i * 1.2, d = 5.0 - i * 1.0;
    for (const sd of [-1, 1]) { const r = add(g, box(w, .1, d / 2 + .3, i % 2 ? TH.watOrange : "#3F7A4A"), -1.6, 3.9 + i * .9, -.9 + (sd * d) / 4); r.rotation.x = -sd * .55; }
    add(g, box(w + .2, .08, .2, TH.chediGold), -1.6, 4.7 + i * .9, -.9);
    for (const sd of [-1, 1]) for (let n = 0; n < 4; n++) add(g, ball(.05, TH.chediGold, 5), -1.6 + sd * (w / 2 + .05), 4.55 + i * .9 - n * .12, -.9 + sd * .1 + n * .3);
  }
  // the chofa finials: the pair at the ridge ends, the near one turns toward the sun
  const chofas = [-1, 1].map((sd, i) => {
    const c = add(g, new THREE.Group(), -1.6 + sd * 3.2, 6.35, -.9); if (i === 1) c.name = "wat-chofa";
    const body = add(c, cone(.13, 1.15, TH.chediGold, 6), 0, .5, 0); body.rotation.z = sd * .35;
    add(c, new THREE.Mesh(new THREE.TorusGeometry(.22, .045, 5, 10, Math.PI * 1.2), mat(TH.chediGold)), sd * .22, 1.0, 0).rotation.set(Math.PI / 2, 0, sd * 1.2);
    add(c, ball(.09, TH.chediGold, 6), 0, 1.35, 0);
    c.children.forEach((m) => { if ((m as THREE.Mesh).isMesh) (m as THREE.Mesh).material = mat(TH.chediGold, { emissive: "#8A6A12", emissiveIntensity: .1, metalness: .3, roughness: .45 }); });
    return c;
  });
  // the chedi, white below and gold above: the gold catches on a click
  const chedi = add(g, new THREE.Group(), 3.3, 0, -1.3);
  add(chedi, cyl(1.5, 1.7, .6, TH.stuccoPastel, 14), 0, .85, 0);
  add(chedi, cyl(1.2, 1.4, .5, TH.stuccoPastel, 14), 0, 1.4, 0);
  const bell = add(chedi, ball(1.15, TH.stuccoPastel, 14), 0, 2.5, 0); bell.scale.y = 1.2;
  const goldParts: THREE.Mesh[] = [];
  for (let k = 0; k < 5; k++) { const r = add(chedi, cyl(.46 - k * .08, .54 - k * .08, .22, TH.chediGold, 12), 0, 3.6 + k * .26, 0); r.material = mat(TH.chediGold, { emissive: "#8A6A12", emissiveIntensity: .1, metalness: .35, roughness: .4 }); goldParts.push(r); }
  const spire = add(chedi, cone(.30, 2.4, TH.chediGold, 10), 0, 6.1, 0);
  spire.material = mat(TH.chediGold, { emissive: "#8A6A12", emissiveIntensity: .1, metalness: .35, roughness: .4 }); goldParts.push(spire);
  add(chedi, ball(.12, TH.chediGold, 6), 0, 7.4, 0);
  // the naga balustrade on the stairs, the bell in its frame, and the offering table
  for (let k = 0; k < 6; k++) add(g, box(1.8, .2, .4, "#D9C9A8"), -1.6, .62 + k * .2, 2.5 - k * .32);
  for (const sd of [-1, 1]) { add(g, cyl(.13, .13, 2.4, "#3F8F5A", 6), -1.6 + sd * 1.05, .95, 2.0).rotation.x = -.62; add(g, ball(.22, "#3F8F5A", 7), -1.6 + sd * 1.05, 1.95, .95); for (let n = 0; n < 3; n++) add(g, cone(.07, .18, TH.chediGold, 5), -1.6 + sd * 1.05, 2.12 + n * .04, 1.05 - n * .16); }
  const frame = add(g, new THREE.Group(), -4.6, 0, 2.2);
  for (const dx of [-.5, .5]) add(frame, cyl(.09, .11, 2.3, TH.teakDark, 6), dx, 1.15, 0);
  add(frame, box(1.3, .14, .18, TH.teakDark), 0, 2.3, 0);
  add(frame, box(1.5, .1, .5, TH.watOrange), 0, 2.45, 0);
  const bellSwing = add(frame, new THREE.Group(), 0, 2.22, 0); bellSwing.name = "wat-bell";
  add(bellSwing, cyl(.012, .012, .22, TH.iron, 4), 0, -.11, 0);
  add(bellSwing, cyl(.20, .28, .40, TH.brass, 12), 0, -.42, 0);
  add(bellSwing, new THREE.Mesh(new THREE.TorusGeometry(.28, .03, 5, 14), mat("#9C7A2A")), 0, -.62, 0).rotation.x = Math.PI / 2;
  add(bellSwing, cyl(.02, .04, .18, "#9C7A2A", 6), 0, -.68, 0);
  const offering = add(g, new THREE.Group(), -1.6, .6, 3.3);
  add(offering, box(1.5, .06, .7, TH.teakDark), 0, .70, 0);
  for (const dx of [-.62, .62]) for (const dz of [-.26, .26]) add(offering, box(.08, .68, .08, TH.teakDark), dx, .34, dz);
  add(offering, cyl(.16, .14, .10, TH.brass, 12), -.45, .78, 0);
  for (let i = 0; i < 5; i++) add(offering, cyl(.008, .008, .30, "#8A3A2A", 4), -.47 + i * .022, .95, 0);
  for (let i = 0; i < 4; i++) { add(offering, cyl(.10, .08, .05, TH.chediGold, 10), 0 + i * .3, .755, 0); for (let n = 0; n < 4; n++) add(offering, ball(.035, n % 2 ? "#E8558A" : "#F4EFE2", 5), i * .3 + Math.cos(n * 1.57) * .05, .80, Math.sin(n * 1.57) * .05); }
  g.userData.smoke = V(-2.05, 1.5, 3.3);
  const monks = [add(g, own(resident("monk")), -.2, .6, 2.9) as Figure, add(g, own(resident("monk")), .9, .6, 3.6) as Figure];
  monks[0].rotation.y = Math.PI - .4; monks[1].rotation.y = Math.PI + .3;
  const gilder = add(g, own(resident("townswoman", false)), 2.2, .6, 2.1) as Figure; gilder.rotation.y = -1.1;
  arms(gilder).right.rotation.x = -1.6;
  const ringer = add(g, own(resident("townsman", false)), -4.6, 0, 3.1) as Figure; ringer.rotation.y = Math.PI;
  arms(ringer).right.rotation.x = -1.5;
  return life(g, "wat", [monks[0], gilder, monks[1], ringer], (t, k) => {
    // 1. the gold first: it catches, the near chofa turns toward the sun, and the bell swings
    const catchLight = beat(k, 0, .80);
    goldParts.forEach((m, i) => { (m.material as THREE.MeshStandardMaterial).emissiveIntensity = .10 + catchLight * (.55 + (i % 3) * .12); });
    chofas[1].children.forEach((m) => { const mm = (m as THREE.Mesh).material as THREE.MeshStandardMaterial; if (mm) mm.emissiveIntensity = .10 + catchLight * .7; });
    chofas[1].rotation.y = Math.sin(t * .25) * .03 + catchLight * .55;
    bellSwing.rotation.z = Math.sin(t * 1.6) * .05 + Math.sin(t * 6.5) * .28 * beat(k, .1, .95);
    arms(ringer).right.rotation.x = -1.5 - beat(k, .1, .8) * .55;
    arms(gilder).right.rotation.x = -1.6 - Math.abs(Math.sin(t * 1.1)) * .18;
    monks.forEach((m, i) => { upper(m).rotation.y = Math.sin(t * .35 + i * 2) * .10 + beat(k, .5, 1) * .3; });
  });
}

/** The alms round at dawn: a line of monks with their bowls, and a hand lowering rice into the nearest one. */
export function almsRound(): P {
  const g = group();
  add(g, box(9.0, .08, 3.4, "#C4BBA6"), 0, .04, 0);
  for (let i = 0; i < 12; i++) add(g, box(.7, .02, 3.4, "#BCB39E"), -3.85 + i * .7, .09, 0);
  // the line of monks, barefoot, each with a bowl on a sling; the nearest is the one that is given to
  const monks = Array.from({ length: 4 }, (_, i) => {
    const m = add(g, own(resident("monk")), 1.6 - i * 1.15, .08, -.15 - i * .12) as Figure;
    m.rotation.y = -1.52;
    arms(m).left.rotation.x = -1.6; arms(m).right.rotation.x = -1.55;
    const bowl = add(m, new THREE.Group(), 0, .92, .24);
    add(bowl, ball(.155, "#3A2A1A", 10), 0, 0, 0).scale.y = .8;
    add(bowl, new THREE.Mesh(new THREE.TorusGeometry(.155, .018, 5, 14), mat("#2A1C12")), 0, .06, 0).rotation.x = Math.PI / 2;
    if (i === 0) bowl.name = "alms-bowl";
    add(m, box(.05, .5, .02, TH.watOrange), .1, 1.0, .1).rotation.z = .3;
    m.userData.bowl = bowl;
    return m;
  });
  // the giver kneeling at the kerb with her pot of rice, and the rice that goes into the bowl
  const giver = add(g, own(resident("vendor", false)), 2.3, .08, 1.15) as Figure;
  giver.rotation.y = -1.6;
  giver.userData.sit?.();
  giver.position.y = .08;
  legsOf(giver).left.thigh.rotation.x = -1.35; legsOf(giver).right.thigh.rotation.x = -1.35;
  legsOf(giver).left.shin.rotation.x = 2.5; legsOf(giver).right.shin.rotation.x = 2.5;
  arms(giver).right.rotation.x = -1.75;
  const pot = add(g, cyl(.24, .20, .30, TH.bambooPale, 14), 2.75, .23, 1.35);
  add(g, ball(.21, TH.riceWhite, 10), 2.75, .38, 1.35).scale.y = .5;
  const spoon = add(arms(giver).right, new THREE.Group(), 0, arms(giver).hand - .04, .13);
  add(spoon, cyl(.012, .012, .26, TH.teak, 5), 0, .11, -.02).rotation.x = -.3;
  const scoop = add(spoon, new THREE.Mesh(new THREE.SphereGeometry(.058, 9, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(TH.bambooPale)), 0, 0, 0);
  const rice = add(spoon, ball(.05, TH.riceWhite, 7), 0, -.015, 0); rice.name = "alms-rice"; rice.scale.y = .7;
  void pot; void scoop;
  const falling = Array.from({ length: 5 }, (_, i) => { const m = add(g, ball(.022, TH.riceWhite, 5), 1.6 + Math.cos(i) * .04, 1.0, .1 + Math.sin(i) * .04); m.visible = false; return m; });
  // a second giver waiting with her basket, a child watching, and the dawn mat
  const waiting = add(g, own(resident("townswoman", false)), 3.4, 0, 1.5) as Figure; waiting.rotation.y = -1.9;
  add(waiting, cyl(.17, .14, .17, TH.bambooPale, 12), .18, .72, .12);
  const child = add(g, own(resident("child")), 3.1, 0, -1.1) as Figure; child.rotation.y = -2.2;
  add(g, box(1.1, .02, .7, "#B8496A"), 2.3, .09, 1.15);
  const giverRest = V(2.3, .08, 1.15);
  return life(g, "almsRound", [giver, monks[0], waiting, child, ...monks.slice(1)], (t, k) => {
    // 1. the rice first: the spoon tips into the nearest bowl and the grains fall
    const tip = beat(k, 0, .48), fall = k > 0 ? clamp01(((1 - k) - .18) / .40) : 0;
    spoon.rotation.z = tip * 1.25;
    rice.scale.set(1 - tip * .7, .7 - tip * .4, 1 - tip * .7);
    falling.forEach((m, i) => { const a = clamp01(fall * 1.6 - (i % 3) * .12); m.visible = fall > 0 && a < 1; m.position.set(1.6 + Math.cos(i) * .05, 1.24 - a * .26, .14 + Math.sin(i) * .05); });
    // 2. the giver's arm lowers, 3. the line of monks steps forward, legs swinging with the distance covered
    arms(giver).right.rotation.x = -1.75 - tip * .35;
    upper(giver).rotation.x = tip * .18;
    giver.position.copy(giverRest);
    const step = beat(k, .42, 1);
    monks.forEach((m, i) => {
      const advance = step * (.34 - i * .04);
      m.position.set(1.6 - i * 1.15 + advance, .08, -.15 - i * .12);
      const legs = legsOf(m), swing = Math.sin((step + i * .12) * Math.PI * 2) * .38;
      legs.left.thigh.rotation.x = swing; legs.right.thigh.rotation.x = -swing;
      legs.left.shin.rotation.x = Math.max(0, -swing) * .8; legs.right.shin.rotation.x = Math.max(0, swing) * .8;
      upper(m).rotation.y = Math.sin(t * .3 + i) * .04;
    });
    upper(child).rotation.y = Math.sin(t * .4) * .2 + beat(k, .5, 1) * .3;
  });
}

/** The limestone karsts of the Andaman: swifts leave the overhang and the water flashes at the undercut base. */
export function karst(): P {
  const g = group();
  add(g, box(10.0, .08, 7.0, "#E4D9BC"), 0, .04, 1.6);                           // the sand the visitor stands on
  add(g, box(10.0, .04, 3.2, "#5E8A82"), 0, .05, -2.6);                          // the shallow green water at the foot
  const towers = [[0, -2.2, 1.0], [-3.4, -3.2, .62], [3.2, -3.6, .5]].map(([x, z, s], i) => {
    const tw = add(g, new THREE.Group(), x, 0, z);
    const h = 9.5 * s, r = 1.7 * s;
    const rock = add(tw, new THREE.Mesh(new THREE.CylinderGeometry(r * .72, r, h, 9), mat(TH.limestoneGrey)), 0, h / 2, 0); rock.scale.set(1, 1, .82);
    add(tw, new THREE.Mesh(new THREE.DodecahedronGeometry(r * .7, 0), mat("#8E8A80")), r * .5, h * .58, 0);
    add(tw, new THREE.Mesh(new THREE.DodecahedronGeometry(r * .5, 0), mat(TH.limestoneGrey)), -r * .5, h * .84, r * .2);
    for (let n = 0; n < 5; n++) add(tw, ball(r * .38, n % 2 ? "#4F8A4A" : "#3F7A3A", 6), Math.cos(n * 1.26) * r * .55, h + r * .12, Math.sin(n * 1.26) * r * .38);
    for (let n = 0; n < 4; n++) add(tw, cyl(.035 * s, .015 * s, .8 * s, "#C9BCA8", 5), Math.cos(n * 1.6) * r * .6, h * .34, r * .62 + Math.sin(n * 1.6) * .1);   // stalactites in the overhang
    // the undercut at the waterline, where the sea has eaten the foot away
    add(tw, new THREE.Mesh(new THREE.CylinderGeometry(r * .52, r * .52, r * .5, 9), mat("#6E6A62")), 0, r * .22, 0).scale.set(1, 1, .82);
    if (i === 0) tw.name = "karst-tower";
    return tw;
  });
  const flash = add(g, new THREE.Mesh(new THREE.TorusGeometry(1.4, .07, 6, 26), mat("#CFEBE4", { transparent: true, opacity: .0 })), 0, .10, -1.15);
  flash.rotation.x = Math.PI / 2; flash.name = "karst-flash";
  const swifts = Array.from({ length: 7 }, (_, i) => {
    const s = add(g, new THREE.Group(), Math.cos(i) * .6, 3.4 + (i % 3) * .3, -2.2 + Math.sin(i) * .4);
    add(s, ball(.075, "#3A3733", 6), 0, 0, 0).scale.set(1.7, .7, .7);
    add(s, cone(.03, .1, "#2A2723", 5), .11, 0, 0).rotation.z = -1.4;
    s.userData.wings = [-1, 1].map((side) => add(s, box(.20, .014, .06, "#2E2B27"), -.02, .015, side * .06));
    s.visible = true; return s;
  });
  // the mangrove at the edge, a drawn-up boat, and two people on the sand
  for (let i = 0; i < 4; i++) {
    const mg = add(g, new THREE.Group(), -4.2 + i * .9, 0, -1.2 - (i % 2) * .4);
    for (let n = 0; n < 5; n++) add(mg, cyl(.025, .035, .7, "#5E4A36", 5), Math.cos(n * 1.26) * .16, .35, Math.sin(n * 1.26) * .16).rotation.set(Math.sin(n * 1.26) * .5, 0, -Math.cos(n * 1.26) * .5);
    add(mg, cyl(.07, .09, .9, "#5E4A36", 6), 0, .9, 0);
    for (let n = 0; n < 3; n++) add(mg, ball(.35, n % 2 ? "#3F7A3A" : "#4F8A44", 6), Math.cos(n * 2.1) * .2, 1.5, Math.sin(n * 2.1) * .2).scale.y = .8;
  }
  const drawn = hull(g, 3.6, 1.05, 3.0, 1.9, "#6A4628"); drawn.rotation.y = -.4; drawn.position.y = .12;
  const fisher = add(g, own(resident("fisher")), .9, .08, 2.2) as Figure; fisher.rotation.y = .3;
  arms(fisher).right.rotation.x = -.7;
  const child = add(g, own(resident("child")), -.7, .08, 2.5) as Figure; child.rotation.y = -.2;
  return life(g, "karsts", [fisher, child], (t, k) => {
    // 1. the birds and the water first: the swifts leave the overhang and a flash runs round the undercut
    const leave = beat(k, 0, .88);
    swifts.forEach((s, i) => {
      const a = t * (.5 + (i % 3) * .1) + i * .9;
      const r = .7 + leave * (2.6 + (i % 4) * .7);
      s.position.set(Math.cos(a) * r, 3.4 + (i % 3) * .3 + leave * (1.4 + (i % 2) * .6) + Math.sin(a * 2) * .2, -2.2 + Math.sin(a) * r * .55);
      s.rotation.y = -a + Math.PI / 2;
      (s.userData.wings as THREE.Object3D[]).forEach((w, n) => { w.rotation.z = Math.sin(t * 16 + n * Math.PI + i) * (.35 + leave * .7); });
    });
    const ripple = ((t * .3) % 1);
    flash.scale.set(.75 + ripple * .45, .75 + ripple * .45, 1);
    (flash.material as THREE.MeshStandardMaterial).opacity = (1 - ripple) * (.18 + beat(k, 0, .9) * .7);
    towers.forEach((tw, i) => { tw.rotation.y = Math.sin(t * .05 + i) * .004; });
    arms(fisher).right.rotation.x = -.7 - beat(k, .45, 1) * .9;
    upper(fisher).rotation.x = -beat(k, .45, 1) * .22;
    upper(child).rotation.x = -beat(k, .5, 1) * .3;
  });
}

/** The sea people's boats: two `kabang` on their mooring. The boat rocks, the palm-thatch roof lifts. */
export function mokenBoat(): P {
  const g = group();
  const boats = [kabang(0, true), kabang(1, false)];
  add(g, boats[0], 0, 0, 0);
  add(g, boats[1], -1.1, 0, -2.9).rotation.y = .38;
  // the mooring: two poles driven into the sand bar, a line to each bow, and a fish trap floating alongside
  for (const [x, z] of [[2.7, .9], [1.9, -3.2]]) add(g, cyl(.06, .08, 2.4, TH.bambooPale, 6), x, .9, z).rotation.z = .1;
  add(g, cyl(.012, .012, 1.4, "#C9BCA0", 4), 1.85, .48, .55).rotation.set(.2, .4, 1.3);
  add(g, cyl(.012, .012, 1.5, "#C9BCA0", 4), 1.0, .48, -3.1).rotation.set(.2, -.3, 1.25);
  const float = add(g, new THREE.Group(), -2.6, 0, -1.0);
  add(float, cyl(.18, .24, .52, TH.bambooPale, 10), 0, .06, 0).rotation.z = 1.4;
  for (let n = 0; n < 4; n++) add(float, cyl(.185 + n * .01, .185 + n * .01, .02, "#A48E5A", 10), -.18 + n * .12, .06, 0).rotation.z = 1.4;
  const figures = [...(boats[0].userData.figures as Figure[]), ...(boats[1].userData.figures as Figure[])];
  const roof = boats[0].userData.roof as THREE.Group;
  const child = figures.find((f) => f.name === "kabang-child")!;
  const roofRest = roof.position.clone();
  return life(g, "longtail", figures, (t, k) => {
    // both hulls ride the swell; the near boat's thatch roof lifts and the child on the bow turns
    boats.forEach((b) => b.userData.tick?.(t, .016));
    const lift = beat(k, 0, .72);
    roof.position.copy(roofRest);
    roof.position.y = roofRest.y + lift * .26;
    roof.rotation.z = lift * .13; roof.rotation.x = -lift * .07;
    float.rotation.z = 1.4 + Math.sin(t * 1.1) * .0;
    float.position.y = Math.sin(t * .95) * .03;
    if (child) { child.rotation.y = 1.0 + Math.sin(t * .5) * .12 + beat(k, .45, 1) * 1.5; upper(child).rotation.x = beat(k, .45, 1) * .15; }
  });
}

/** The rickshaw stand at the lane's east end: the puller leans into the shafts and the hood rocks back. */
export function rickshawStand(): P {
  const g = group();
  add(g, box(6.0, .08, 4.0, "#C4BBA6"), 0, .04, 0);
  for (let i = 0; i < 8; i++) add(g, box(.7, .02, 4.0, "#BCB39E"), -2.45 + i * .7, .09, 0);
  const car = add(g, rickshaw(true), -.4, .08, .35); car.rotation.y = -.25;
  const waiting = add(g, rickshaw(false), 1.6, .08, -1.9); waiting.rotation.y = 2.5;
  // the stand's own furniture: a water jar under a small shade, a bench and a lamp post
  const sh = shade(g, 2.4, 1.6, 2.30, -2.2, -1.2, "#B9A46A");
  lamps(g, sh.y, sh.zFront, [-3.0, -1.4], .75);
  add(g, cyl(.26, .21, .46, TH.clay, 14), -2.2, .31, -.9);
  add(g, cyl(.22, .22, .04, "#7A5A46", 14), -2.2, .56, -.9);
  add(g, cyl(.08, .07, .1, TH.bambooPale, 10), -1.9, .60, -.75);
  const by = bench(g, -2.2, -2.1, 1.6, 0, .40);
  const resting = seatFigure(g, resident("carrier", false), -2.2, -2.1, .1, by);
  const hood = car.getObjectByName("rickshaw-hood") as THREE.Group;
  const puller = car.getObjectByName("rickshaw-puller") as Figure;
  const figures = [...(car.userData.figures as Figure[]), ...(waiting.userData.figures as Figure[]), resting];
  const wheels = car.userData.wheels as THREE.Group[];
  const shafts = car.userData.shafts as THREE.Mesh[];
  const hoodRest = hood.position.clone(), carRest = car.position.clone(), pullerRest = puller.position.clone();
  return life(g, "tukTuk", figures, (t, k) => {
    // 1. the vehicle first: the hood rocks back on its ribs and the whole car tips onto its wheels
    const lean = beat(k, 0, .62);
    hood.position.copy(hoodRest);
    hood.rotation.z = -lean * .34; hood.position.x = hoodRest.x - lean * .06;
    car.position.copy(carRest);
    car.rotation.z = lean * .055;
    wheels.forEach((w) => { w.rotation.x = -lean * 1.4; });
    shafts.forEach((s) => { s.rotation.z = 1.50 - lean * .10; });
    // 2. the puller leans into the shafts, taking a half step and setting his legs down again
    const legs = legsOf(puller), swing = Math.sin(lean * Math.PI * 2) * .40;
    puller.position.copy(pullerRest); puller.position.x = pullerRest.x + lean * .26;
    legs.left.thigh.rotation.x = swing; legs.right.thigh.rotation.x = -swing;
    legs.left.shin.rotation.x = Math.max(0, -swing) * .8; legs.right.shin.rotation.x = Math.max(0, swing) * .8;
    upper(puller).rotation.x = .12 + lean * .30;
    arms(puller).left.rotation.x = -1.35 - lean * .18; arms(puller).right.rotation.x = -1.35 - lean * .18;
    // 3. the man on the bench looks up
    upper(resting).rotation.y = Math.sin(t * .35) * .1 + beat(k, .5, 1) * .5;
  });
}

/** The Chin Haw caravan on the road into Lanna: the lead mule steps off and the pack panniers swing. */
export function muleCaravan(): P {
  const g = group();
  add(g, box(9.0, .08, 3.0, "#9C8464"), 0, .04, .2);
  for (let i = 0; i < 7; i++) add(g, ball(.12, "#8E8A80", 6), -3.6 + i * 1.2, .06, -.5 + (i % 2) * .9).scale.y = .5;
  const mules = [0, 1, 2].map((i) => {
    const m = add(g, new THREE.Group(), 1.7 - i * 2.0, .08, -.1 + i * .22); if (i === 0) m.name = "caravan-lead";
    m.rotation.y = .06 + i * .05;   // the road runs east to west: the mules' long axis lies along x and their flanks face the visitor
    const torso = add(m, ball(.38, i % 2 ? "#6E5C48" : "#5A4A3A", 9), 0, .80, 0); torso.scale.set(1.7, .92, .92);
    const head = add(m, new THREE.Group(), .66, .94, 0);
    add(head, ball(.18, i % 2 ? "#6E5C48" : "#5A4A3A", 8), 0, 0, 0).scale.set(1.25, .9, .85);
    add(head, ball(.08, "#4A3C2E", 7), .22, -.05, 0);
    for (const side of [-1, 1]) add(head, cone(.05, .18, "#4A3C2E", 5), -.02, .18, side * .08).rotation.z = -.15;
    add(head, cyl(.012, .012, .34, "#C9BCA0", 4), .1, -.02, 0).rotation.z = 1.5;
    const legs = [[-.4, -.22], [-.4, .22], [.4, -.22], [.4, .22]].map(([dx, dz]) => add(m, cyl(.065, .05, .74, "#4A3C2E", 6), dx, .37, dz));
    const panniers = [-1, 1].map((side) => {
      const p = add(m, new THREE.Group(), -.02, .86, side * .36); if (i === 0 && side === 1) p.name = "caravan-pannier";
      add(p, box(.52, .38, .24, TH.bambooPale), 0, 0, 0);
      for (let n = 0; n < 4; n++) add(p, box(.52, .03, .245, "#8A7448"), 0, -.14 + n * .1, 0);
      add(p, box(.30, .12, .22, "#3F6A3A"), 0, .24, 0);                         // the pressed tea on top
      for (let n = 0; n < 3; n++) add(p, cyl(.09, .09, .10, "#7A5A32", 10), -.14 + n * .14, .34, 0);
      return p;
    });
    add(m, box(.10, .06, .82, TH.teak), -.02, 1.06, 0);
    add(m, box(.36, .05, .80, "#9C2B23"), -.02, 1.10, 0);
    m.userData.parts = { torso, head, legs, panniers };
    return m;
  });
  const muleteers = [add(g, own(resident("muleteer")), 2.70, .08, -.55) as Figure, add(g, own(resident("muleteer", false)), -1.5, .08, .9) as Figure];
  muleteers[0].rotation.y = -.6; muleteers[1].rotation.y = .1;
  for (const m of muleteers) wear(m, cyl(.13, .14, .09, "#E9E2D2", 12), 0, 1.16, 0);
  arms(muleteers[0]).right.rotation.x = -1.3;
  const halter = add(arms(muleteers[0]).right, cyl(.008, .008, .55, "#C9BCA0", 4), 0, arms(muleteers[0]).hand - .12, .18); halter.rotation.x = .6;
  const trader = add(g, own(resident("lanna", false)), 3.4, 0, 1.5) as Figure; trader.rotation.y = -2.2;
  const child = add(g, own(resident("child")), -3.0, 0, 1.2) as Figure; child.rotation.y = -1.3;
  const rests = mules.map((m) => m.position.clone());
  return life(g, "chinHawTh", [muleteers[0], trader, muleteers[1], child], (t, k) => {
    // 1. the load first: the lead mule steps off and the panniers swing on its back
    const step = beat(k, 0, .70);
    mules.forEach((m, i) => {
      const advance = step * (.42 - i * .10);
      m.position.copy(rests[i]); m.position.x = rests[i].x + advance;
      const parts = m.userData.parts as { torso: THREE.Mesh; head: THREE.Group; legs: THREE.Mesh[]; panniers: THREE.Group[] };
      // hooves plant and push backward under the body, in step with the distance covered
      const phase = (step + i * .16) * Math.PI * 2;
      // the hooves swing in the travel direction and push backward under the body, so they turn about z, not x
      parts.legs.forEach((leg, n) => { leg.rotation.z = -Math.sin(phase + (n % 2 ? Math.PI : 0) + (n < 2 ? .4 : 0)) * .42 * (step > .02 ? 1 : 0); });
      parts.torso.position.y = .80 + Math.abs(Math.sin(phase)) * .02 * (step > .02 ? 1 : 0);
      parts.head.rotation.z = Math.sin(t * .4 + i) * .04 + step * .12;
      parts.panniers.forEach((p, n) => { p.rotation.z = Math.sin(phase * 1.0 + n * Math.PI) * .20 * step + Math.sin(t * .8 + i + n) * .012; p.position.y = .86 + Math.abs(Math.sin(phase)) * .02 * step; });
    });
    // 2. the muleteer shifts the halter, 3. the trader at the roadside turns
    arms(muleteers[0]).right.rotation.x = -1.3 - step * .35;
    halter.rotation.x = .6 + step * .4;
    upper(muleteers[1]).rotation.y = Math.sin(t * .35) * .06 + beat(k, .35, .95) * .3;
    upper(trader).rotation.y = Math.sin(t * .3) * .08 + beat(k, .5, 1) * .6;
    upper(child).rotation.y = beat(k, .5, 1) * .4;
  });
}

// ---------- the registry ----------

const BUILDERS = {
  // twelve rooms
  floatingMarket, noodleBoat, wangKitchen, curryKitchen, khanomKitchen, shophouseTh,
  fieldLunch, isanGrill, lannaKitchen, andamanKitchen, muslimKitchen, babaKitchen,
  // the four market stall boats, ordinary clickable siblings on the basin
  stallFruitBoat, stallNoodleBoat, stallHerbBoat, stallCoconutBoat,
  // ten ingredient stops
  spiceStall, coconutSea, paddyTh, fishTraps, riverOrchard, sugarPalms, saltPans, plaRaYard, miangGrove, turmericBeds,
  // six landmarks. `rickshaw` is the stand at the lane's east end; the bare `rickshaw()` vehicle above is
  // exported for the Builder's road decor, as `kabang()` and `oxCart()` are.
  wat, almsRound, karst, mokenBoat, rickshaw: rickshawStand, muleCaravan,
};
/**
 * Each stand starts its residents from its own place in the profile band, so a stand is built the same way
 * whatever else has been built before it: the clothing still changes from stand to stand, but the people in one
 * stand no longer depend on how many stands a harness or a world happened to build first.
 */
export const THAILAND_PROPS: Record<string, () => P> = Object.fromEntries(
  Object.entries(BUILDERS).map(([id, make], i) => [id, () => { nth = i * 3; return make(); }]),
);

/** One small food or tool per room object and per dish child, for the card badge where no painted art exists. */
export const THAILAND_ICONS: Record<string, () => P> = {
  floatingMarket: () => { const g = group(); add(g, box(.9, .12, .32, TH.teakDark), 0, .06, 0); add(g, box(.88, .03, .34, "#8A6844"), 0, .13, 0); for (const e of [-1, 1]) add(g, box(.12, .1, .2, TH.teakDark), e * .46, .13, 0).rotation.z = e * .4; add(g, ball(.13, "#8FA84A", 8), -.2, .24, 0); add(g, cyl(.09, .11, .04, "#A8B85A", 10), -.2, .36, 0); add(g, ball(.09, "#E0A92C", 7), .1, .22, .02).scale.set(1.35, .85, .85); add(g, ball(.07, "#B4342A", 7), .34, .21, -.02); add(g, cyl(.055, .045, .11, TH.bambooPale, 10), .2, .22, .12); return g; },
  kuaitiaoRuea: () => { const g = group(); add(g, cyl(.30, .21, .24, TH.riceWhite, 16), 0, .12, 0); add(g, cyl(.26, .26, .05, TH.broth, 16), 0, .23, 0); for (let i = 0; i < 5; i++) add(g, cyl(.024, .019, .22, "#E4DCCB", 5), (i - 2) * .05, .27, 0).rotation.x = .25; add(g, ball(.06, "#9C4A3A", 6), .06, .29, .05).scale.set(1.5, .7, 1); add(g, box(.1, .02, .08, "#4F7A3A"), -.08, .28, -.04); for (const dz of [-.03, .03]) add(g, cyl(.008, .008, .34, TH.bambooPale, 4), .30, .32, dz).rotation.set(.1, 0, 1.15); return g; },
  wangKitchenTh: () => { const g = group(); add(g, cyl(.34, .32, .03, TH.brass, 20), 0, .015, 0); const f = add(g, new THREE.Group(), 0, .05, 0); add(f, cone(.05, .24, "#B4342A", 7), 0, .02, 0).rotation.x = Math.PI; for (let i = 0; i < 6; i++) { const p = add(f, new THREE.Group(), 0, .06, 0); p.rotation.y = i * 1.05; p.rotation.z = -.9; add(p, box(.045, .014, .17, "#C9402E"), 0, 0, .075); } add(g, ball(.08, "#E0A92C", 8), .34, .08, .1); add(g, cyl(.09, .075, .05, TH.riceWhite, 12), -.34, .025, .06); return g; },
  curryPaste: () => { const g = group(); add(g, cyl(.26, .20, .30, TH.limestoneGrey, 16), -.12, .15, 0); add(g, cyl(.27, .27, .05, "#8E8A80", 16), -.12, .30, 0); add(g, cyl(.20, .18, .06, "#5E7A32", 16), -.12, .30, 0); add(g, cyl(.055, .075, .38, TH.limestoneGrey, 10), -.02, .44, .02).rotation.z = .35; add(g, cyl(.20, .16, .07, TH.brass, 16), .42, .035, .08); add(g, new THREE.Mesh(new THREE.TorusGeometry(.09, .02, 5, 14), mat("#F2E4C0")), .42, .08, .08).rotation.x = Math.PI / 2; return g; },
  sweetsTh: () => { const g = group(); add(g, cyl(.30, .26, .07, TH.brass, 20), 0, .035, 0); add(g, cyl(.27, .27, .02, "#E8C24A", 20), 0, .08, 0); const c = add(g, new THREE.Mesh(new THREE.TorusGeometry(.10, .025, 5, 14), mat("#E8C24A")), 0, .11, 0); c.rotation.x = Math.PI / 2; for (let i = 0; i < 5; i++) add(g, cyl(.007, .007, .26, "#EFCB55", 5), Math.cos(i) * .05, .26, Math.sin(i) * .05); add(g, cyl(.08, .02, .14, TH.brass, 10), 0, .44, 0); add(g, cone(.05, .07, "#EFCB55", 6), .42, .06, .06); return g; },
  shophouseTh: () => { const g = group(); add(g, new THREE.Mesh(new THREE.SphereGeometry(.34, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat("#4A4540")), 0, .30, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(.34, .022, 5, 18), mat("#3A3733")), 0, .30, 0).rotation.x = Math.PI / 2; add(g, cyl(.018, .018, .5, TH.teak, 6), .44, .34, 0).rotation.z = 1.42; for (let i = 0; i < 8; i++) { const n = add(g, cyl(.011, .011, .28, "#E4CE8A", 5), Math.cos(i * .8) * .1, .30, Math.sin(i * .8) * .1); n.rotation.set(.2, i * .8, 1.42); } add(g, box(.07, .018, .04, "#4F7A3A"), .06, .34, .06); for (let i = 0; i < 3; i++) add(g, cone(.045, .14, i % 2 ? TH.flameHot : TH.flame, 6), Math.cos(i * 2.1) * .3, .12, Math.sin(i * 2.1) * .3); return g; },
  naKhaoTh: () => { const g = group(); add(g, box(.66, .02, .34, "#3F7A3A"), 0, .06, 0); const f = add(g, ball(.11, "#B8B0A0", 9), 0, .13, 0); f.scale.set(2.3, .8, .95); add(g, cone(.08, .18, "#A8A090", 6), -.35, .13, 0).rotation.z = Math.PI / 2; add(g, box(.5, .02, .1, "#356F30"), 0, .2, .1).rotation.x = -.7; add(g, cyl(.11, .09, .13, TH.bambooPale, 12), .42, .065, .12); add(g, ball(.09, TH.riceWhite, 8), .42, .14, .12).scale.y = .5; for (const dz of [-.14, .14]) add(g, cyl(.012, .012, .5, "#6E8A3A", 5), 0, .04, dz).rotation.z = Math.PI / 2; return g; },
  isanGrillTh: () => { const g = group(); add(g, cyl(.18, .24, .48, TH.clay, 14), -.2, .24, 0); add(g, cyl(.20, .18, .05, "#7A5A46", 14), -.2, .50, 0); add(g, cyl(.15, .13, .05, "#C9D48A", 14), -.2, .52, 0); for (let i = 0; i < 6; i++) add(g, box(.09, .012, .02, "#D9E09A"), -.2 + Math.cos(i) * .08, .55, Math.sin(i) * .08).rotation.y = i; add(g, cyl(.028, .036, .52, TH.teak, 8), -.1, .72, 0).rotation.z = .3; add(g, box(.3, .05, .2, "#C98A4A"), .38, .08, 0); for (const side of [-1, 1]) add(g, cyl(.012, .012, .6, TH.bambooPale, 5), .38, .1, side * .1).rotation.z = 1.45; return g; },
  khaoSoiTh: () => { const g = group(); add(g, cyl(.30, .21, .22, TH.riceWhite, 16), 0, .11, 0); add(g, cyl(.26, .26, .04, "#C98A2C", 16), 0, .21, 0); for (let i = 0; i < 6; i++) add(g, cyl(.02, .016, .2, "#E4CE8A", 5), (i - 2.5) * .04, .24, 0).rotation.x = .25; for (let i = 0; i < 9; i++) { const n = add(g, cyl(.008, .008, .2, "#D9A83A", 5), Math.cos(i * .8) * .08, .30, Math.sin(i * .8) * .08); n.rotation.set(.4, i * .8, 1.3); } for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; add(g, cyl(.035, .035, .07, "#A8462A", 8), .48 + Math.cos(a) * .13, .05, Math.sin(a) * .13).rotation.set(Math.PI / 2, -a, 0); } return g; },
  talayTh: () => { const g = group(); const f = add(g, ball(.13, "#E0A92C", 9), 0, .16, 0); f.scale.set(2.5, .75, .95); add(g, cone(.09, .2, "#C98A1C", 6), -.4, .17, 0).rotation.z = Math.PI / 2; add(g, box(.05, .012, .14, "#B47A16"), .14, .22, 0); for (let i = 0; i < 4; i++) add(g, box(.09, .012, .08, "#F2D98A"), -.16 + i * .1, .225, .02); for (const dz of [-.18, .18]) add(g, cyl(.014, .014, .6, "#6E8A3A", 5), 0, .06, dz).rotation.z = Math.PI / 2; for (let i = 0; i < 3; i++) add(g, cone(.05, .16, i % 2 ? TH.flameHot : TH.flame, 6), Math.cos(i * 2.1) * .22, .06, Math.sin(i * 2.1) * .18); add(g, cyl(.08, .065, .06, TH.clay, 12), .46, .03, .2); add(g, cyl(.07, .07, .02, "#D9942C", 12), .46, .07, .2); return g; },
  muslimKitchenTh: () => { const g = group(); add(g, cyl(.36, .35, .04, "#9AA0A6", 20), 0, .02, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(.36, .018, 5, 20), mat("#6E7378")), 0, .025, 0).rotation.x = Math.PI / 2; add(g, cyl(.22, .22, .018, "#E4C48A", 20), -.08, .05, 0); add(g, cyl(.13, .13, .008, "#D9A85A", 14), -.08, .062, 0); const d = add(g, cyl(.21, .21, .018, "#E9D6A8", 20), .12, .36, .06); d.rotation.z = .25; add(g, ball(.06, "#EFE0B8", 7), .42, .05, -.16).scale.y = .7; add(g, cyl(.09, .075, .16, TH.clay, 12), -.46, .08, .14); return g; },
  babaTh: () => { const g = group(); for (let i = 0; i < 3; i++) { add(g, cyl(.155, .15, .14, TH.brass, 16), 0, .07 + i * .155, 0); add(g, cyl(.165, .165, .02, "#9C7A2A", 16), 0, .148 + i * .155, 0); } add(g, cyl(.155, .15, .14, TH.brass, 16), .06, .62, .04); add(g, cyl(.13, .13, .03, "#8A5A2A", 14), .06, .66, .04); for (const side of [-1, 1]) add(g, cyl(.012, .012, .52, "#9C7A2A", 5), side * .17, .27, 0); add(g, box(.4, .022, .05, "#9C7A2A"), 0, .54, 0); add(g, cyl(.14, .12, .03, "#E9E2D2", 16), .42, .015, -.2); for (let n = 0; n < 5; n++) add(g, box(.03, .004, .03, TH.pelangiBlue), .42 + Math.cos(n * 1.26) * .09, .033, -.2 + Math.sin(n * 1.26) * .09); return g; },
  "stall-fruit": () => { const g = group(); const d = add(g, ball(.2, "#A8B85A", 9), -.2, .22, 0); for (let k = 0; k < 14; k++) { const s = add(d, cone(.045, .1, "#96A84E", 4), Math.cos(k * 1.1) * .19, Math.sin(k * .7) * .16, Math.sin(k * 1.1) * .19); s.lookAt(V(0, 0, 0)); s.rotateX(Math.PI / 2); } add(g, ball(.1, "#E0A92C", 7), .26, .11, .06).scale.set(1.35, .85, .85); const r = add(g, ball(.075, "#B4342A", 7), .5, .08, -.1); for (let k = 0; k < 7; k++) add(r, cyl(.008, .004, .09, "#7A9B3A", 4), Math.cos(k) * .06, Math.sin(k * .8) * .05, Math.sin(k) * .06).rotation.set(k, k * .7, k); return g; },
  "stall-noodles": () => { const g = group(); add(g, cyl(.26, .19, .20, TH.riceWhite, 14), 0, .10, 0); add(g, cyl(.22, .22, .04, TH.broth, 14), 0, .19, 0); for (let i = 0; i < 4; i++) add(g, cyl(.022, .018, .19, "#E4DCCB", 5), (i - 1.5) * .05, .23, 0).rotation.x = .25; add(g, ball(.05, "#9C4A3A", 6), .05, .25, .04).scale.set(1.5, .7, 1); add(g, cyl(.2, .17, .18, TH.brass, 14), .5, .09, .06); add(g, cyl(.17, .17, .03, TH.broth, 14), .5, .18, .06); return g; },
};
