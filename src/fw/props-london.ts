/**
 * Britain stands (area id `london`): one builder per `prop` name in the object list of docs/london-world.md.
 * Owned by the Stand maker, Stage C of docs/agent-team-playbook.md.
 *
 * Every room stand follows the hotpot table in docs/building-a-world.md section 5: its own period building from its
 * region (the thirteen buildings below, no two with the same wall and roof), a visible work surface, modelled food, an always-on loop, six to nine people with idle motion, a walker
 * whose legs step with the distance it covers, lamps under a beam, steam at every hot source, and a click chain
 * that moves the food or material first, the worker second, one bystander third and speaks last. The ten
 * ingredient stops and the six landmarks are simpler, but each has a real prop and a 3D reaction of its own.
 *
 * `uk_dairy` is a cold room and `daleDairy` is a cold stand: no fire, no boiling and **no steam point anywhere on
 * it**. Its liquid is whey running out of a press, which drips and runs. The market is cold too: it is a stone
 * and iron hall of raw cheese, game and vegetables at first light.
 *
 * Buildings, vehicles and people are local to this file until `london-architecture.ts` and `london-people.ts`
 * land: the playbook says a missing helper is built in the owning file, never in `props.ts`. `ukResident` below is
 * the single line that becomes `londonResident(seed, working)` when the Builder's people file arrives, and
 * `LD` here is this file's working palette, not the Builder's exported one.
 *
 * Period band 1880 to 1914, research 1.3 and 1.5: flat caps, bowlers, shawls, aprons, a fishwife's striped skirt
 * and oilskin, clogs, a Highland bonnet, a countryman's smock. The vehicles are a horse omnibus with a knifeboard
 * top, a hansom cab, a coster's barrow, a donkey cart and — at the very end of the band — one motor omnibus of
 * 1907, which is what the pillar-box speech means by "the engine". Nothing later than 1914 is built anywhere in
 * this file: no Routemaster, no K6 telephone kiosk, no observation wheel, no motorcar and no traffic light. The
 * harness greps this file for all of them.
 */
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { add, mat, rnd, wear, bubble, ambientChat, tickChildren, person, type P } from "./props";
import { UK_LINES } from "./london-speech";

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

/** The twelve palette names of research 1.3, plus the working tones this file mixes from them. */
const LD = {
  londonStock: "#A8946E", portlandStone: "#DED6C2", millstoneGrit: "#6E6A60", moorGranite: "#8A8880",
  slateNorth: "#4A5058", kentPeg: "#A85A3A", pubGreen: "#2A4432", oxbloodTile: "#7A2A24",
  postRed: "#9C2B22", oakSmoke: "#4A3526", hopGreen: "#6E8A42", northSea: "#3E5A66",
  // working tones
  oak: "#6E5236", deal: "#A88A5E", brass: "#B08A3A", iron: "#2E2B2A", lead: "#6A6E70", whitewash: "#EDE6D6",
  beef: "#8E3A34", crust: "#C9862A", batter: "#E0BC72", gravy: "#5A3320", liquor: "#6E9442", cream: "#F2EAD2",
  flame: "#E9612D", flameHot: "#F2A03C", coalSmoke: "#3A3733", glass: "#BFD7DC", ale: "#B8712A",
  herring: "#B9C2C4", haddock: "#C9A45A", tea: "#8A4A22", milk: "#F6F2E6", soil: "#4A3A2C", sand: "#D9CFAE",
  grass: "#7E9455", straw: "#C9B489", gorse: "#C9A82A", rhubarb: "#B8324A", leek: "#5E8A3A", apple: "#8AA83A",
};

/**
 * Ambient speech per object id is the Researcher's, in `london-speech.ts`, and is re-exported here because the
 * module contract in docs/london-world.md lists the line table among this file's exports while the lines
 * themselves are hers. There is exactly one copy of them, in her file.
 */
export { UK_LINES } from "./london-speech";

// ---------- reaction machinery, copied from props-thailand.ts (module-private there) ----------

/** A sine pulse that runs between two points of the decaying reaction `k`. */
const beat = (k: number, start = 0, end = 1) => k > 0 ? Math.sin(Math.PI * clamp01(((1 - k) - start) / (end - start))) : 0;
/**
 * A trapezoid over the same decaying reaction: it rises to 1 by `rise`, holds while the visitor's camera arrives,
 * and returns to exactly 0 at the end. A pour needs this rather than `beat`, because a sine pulse has the vessel
 * only part of the way to the cup when the 1.6-second approach finishes.
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
  const lines = UK_LINES[id] ?? ["Mind how you go."];
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
        case "hop": object.position.y += pulse * .28; object.rotation.y += pulse * .9; break;
        case "lift": object.position.y += pulse * .36; object.position.z += pulse * .10; object.rotation.x -= pulse * .40; break;
        case "puff": object.scale.y = scale.y * (1 + pulse * 1.3); object.position.y += pulse * .26; break;
        case "contents": object.scale.set(scale.x * (1 + pulse * .13), scale.y * (1 + pulse * .70), scale.z * (1 + pulse * .13)); object.position.y += pulse * .18; break;
        case "sway": object.rotation.z += pulse * .32; break;
        case "roll": object.rotation.x -= pulse * 2.2; break;
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
 * so the group's y scale is the real height of the fall.
 */
function pourFall(g: THREE.Object3D, name: string, color: string, radius = .03, segs = 3) {
  const col = add(g, new THREE.Group(), 0, 0, 0);
  col.name = name; col.visible = false;
  const skin = { emissive: color, emissiveIntensity: .16, transparent: true, opacity: .92 };
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
/** Rings that open where a falling liquid lands, on a surface or in a vessel. */
function splashRings(g: THREE.Object3D, n: number, x: number, y: number, z: number, r: number, color: string) {
  return Array.from({ length: n }, (_, i) => {
    const m = add(g, new THREE.Mesh(new THREE.TorusGeometry(r, r * .2, 5, 12), mat(color, { transparent: true, opacity: .8 })), x + Math.cos(i * 1.3) * r * 2, y, z + Math.sin(i * 1.3) * r * 2);
    m.rotation.x = Math.PI / 2; m.visible = false; return m;
  });
}
/** World-space point of a local offset on a tilted object, expressed in the stand's space. */
function tipOf(obj: THREE.Object3D, local: THREE.Vector3, out: THREE.Vector3) { return out.copy(local).applyQuaternion(obj.quaternion).add(obj.position); }

// ---------- people: the eight clothing profiles of research 1.3, as data ----------

/**
 * The eight everyday working profiles of 1880 to 1914. `hat` is a flat cap, a bowler, a shawl over the head, a
 * white cook's cap, a headscarf, a Highland blue bonnet or a countryman's billycock. `skirt` is the long working
 * skirt, striped for the fishwife, and `over` is the apron, the oilskin, the pinafore or the waistcoat over it.
 */
const PROFILES = [
  { key: "costerMan", top: "#6A5A46", trouser: "#3E3A34", hat: "flatCap", skirt: "", over: "waistcoat", scarf: "#9C2B22" },
  { key: "clerkBowler", top: "#33343A", trouser: "#2A2B30", hat: "bowler", skirt: "", over: "coat", scarf: "" },
  { key: "shawlWoman", top: "#7A6A70", trouser: "#3A3630", hat: "shawl", skirt: "#4A4048", over: "apron", scarf: "" },
  { key: "apronCook", top: "#E4DCCB", trouser: "#4A4640", hat: "cookCap", skirt: "", over: "whiteApron", scarf: "" },
  { key: "fishwife", top: "#8A4A44", trouser: "#3A3630", hat: "headscarf", skirt: "stripe", over: "oilskin", scarf: "" },
  { key: "millLass", top: "#9CA8B4", trouser: "#4A4640", hat: "headscarf", skirt: "#5A5A52", over: "pinafore", scarf: "" },
  { key: "highlander", top: "#5A6A56", trouser: "#4A4438", hat: "bonnet", skirt: "", over: "jacket", scarf: "" },
  { key: "farmSmock", top: "#B4A88E", trouser: "#5A4E3A", hat: "billycock", skirt: "", over: "smock", scarf: "" },
] as const;

/**
 * One resident of 1880 to 1914. **This function is the whole swap.** When `london-people.ts` lands, the body
 * becomes `return londonResident(seed, working) as Figure;` and nothing else in this file changes: every stand
 * asks for its people through `resident(role)` and never builds a figure itself.
 */
function ukResident(seed: number, working: boolean): Figure {
  const p = PROFILES[((seed % PROFILES.length) + PROFILES.length) % PROFILES.length];
  const f = person(p.top, { apron: working && p.over === "whiteApron" }) as Figure;
  if (p.skirt === "stripe") {                                        // the fishwife's striped skirt, Newhaven and Cullercoats
    wear(f, box(.36, .46, .30, "#3A4A6A"), 0, .42, 0);
    for (let i = 0; i < 4; i++) wear(f, box(.365, .05, .305, "#D9CFC0"), 0, .27 + i * .11, 0);
  } else if (p.skirt) wear(f, box(.36, .48, .29, p.skirt), 0, .43, 0);
  else for (const dx of [-.085, .085]) wear(f, box(.13, .06, .18, p.trouser), dx, .48, 0);   // the turn-up of a working trouser
  if (p.over === "waistcoat") { wear(f, box(.30, .30, .21, "#4A4238"), 0, .70, 0); wear(f, box(.05, .28, .02, LD.brass), .07, .70, .10); }
  if (p.over === "coat") { wear(f, box(.34, .52, .24, "#2A2B30"), 0, .62, 0); wear(f, box(.30, .06, .21, "#E4DCCB"), 0, .90, .01); }
  if (p.over === "apron") wear(f, box(.28, .40, .03, "#C9BCA0"), 0, .58, .13);
  if (p.over === "whiteApron") wear(f, box(.30, .46, .03, LD.whitewash), 0, .56, .14);
  if (p.over === "oilskin") { wear(f, box(.30, .40, .03, "#6E5A3A"), 0, .58, .14); wear(f, box(.34, .10, .26, "#5A4A2E"), 0, .86, 0); }
  if (p.over === "pinafore") { wear(f, box(.26, .44, .03, "#D9D2C2"), 0, .58, .13); for (const dx of [-.10, .10]) wear(f, box(.05, .18, .02, "#D9D2C2"), dx, .86, .11); }
  if (p.over === "jacket") { wear(f, box(.34, .44, .24, "#4A5244"), 0, .64, 0); wear(f, box(.34, .07, .25, "#6A6A5A"), 0, .86, 0); }
  if (p.over === "smock") { wear(f, box(.36, .52, .26, "#C2B89C"), 0, .62, 0); for (let i = 0; i < 5; i++) wear(f, box(.02, .16, .02, "#A89C80"), -.08 + i * .04, .82, .13); }
  if (p.hat === "flatCap") { wear(f, ball(.17, "#5E5244", 8), 0, 1.19, 0).scale.set(1, .55, 1); wear(f, box(.24, .03, .13, "#5E5244"), 0, 1.19, .18); }
  if (p.hat === "bowler") { wear(f, cyl(.235, .25, .035, LD.iron, 12), 0, 1.18, 0); wear(f, ball(.155, LD.iron, 8), 0, 1.23, 0).scale.y = .82; }
  if (p.hat === "shawl") { wear(f, ball(.20, "#5A4A50", 9), 0, 1.10, -.02).scale.set(1.05, .95, 1.05); wear(f, box(.40, .34, .30, "#5A4A50"), 0, .84, -.01); }
  if (p.hat === "cookCap") wear(f, cyl(.155, .165, .13, LD.whitewash, 10), 0, 1.20, 0);
  if (p.hat === "headscarf") { wear(f, ball(.165, "#A8402E", 8), 0, 1.16, 0).scale.set(1, .8, 1); wear(f, box(.10, .16, .06, "#A8402E"), 0, 1.02, -.13).rotation.x = -.4; }
  if (p.hat === "bonnet") { wear(f, cyl(.21, .20, .07, "#2E3E5E", 12), 0, 1.18, 0); wear(f, ball(.05, "#9C2B22", 6), 0, 1.24, 0); }
  if (p.hat === "billycock") { wear(f, cyl(.215, .225, .035, "#4A3E30", 12), 0, 1.18, 0); wear(f, cyl(.145, .15, .17, "#4A3E30", 10), 0, 1.27, 0); }
  if (p.scarf) wear(f, cyl(.155, .155, .09, p.scarf, 8), 0, .97, 0);
  return f;
}

type Role = "coster" | "clerk" | "shawl" | "cook" | "server" | "fishwife" | "mill" | "highland" | "farmer"
  | "porter" | "carter" | "child" | "drinker" | "lady" | "picker" | "miner" | "curer" | "lascar";
/** Which of the eight profiles a trade wears. */
const PROFILE_OF: Record<Role, number> = {
  coster: 0, clerk: 1, shawl: 2, cook: 3, server: 3, fishwife: 4, mill: 5, highland: 6, farmer: 7,
  porter: 0, carter: 7, child: 5, drinker: 0, lady: 2, picker: 5, miner: 0, curer: 4, lascar: 0,
};
let nth = 0;
/** A resident for a trade. Working trades get the apron; everyone else keeps the profile's own dress. */
function resident(role: Role, working = role === "cook" || role === "server" || role === "curer"): Figure {
  const f = ukResident(PROFILE_OF[role] + 8 * (nth++ % 5), working);
  if (role === "child") f.scale.setScalar(.72);
  if (role === "lascar") {                                            // a Sylheti seaman's lungi and cap, Shadwell
    wear(f, box(.35, .42, .28, "#3A4A5E"), 0, .43, 0);
    wear(f, cyl(.15, .155, .10, "#E4DCCB", 10), 0, 1.18, 0);
  }
  if (role === "miner") wear(f, cyl(.20, .21, .05, "#3A342E", 10), 0, 1.20, 0);
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
  add(g, fig, x, seatTop - bottom, z).rotation.y = angle; fig.name = "uk-sitter"; fig.userData.seatTop = seatTop;
  return fig;
}
/** A stool, and someone on it. */
function sit(g: THREE.Object3D, x: number, z: number, angle: number, role: Role, seatTop = .46) {
  const seat = add(g, cyl(.16, .17, seatTop, LD.oak, 10), x - Math.sin(angle) * .11, seatTop / 2, z - Math.cos(angle) * .11); seat.name = "uk-stool";
  return seatFigure(g, resident(role), x, z, angle, seatTop);
}
/** A plank bench or a pub settle on two ends. Returns the seat height. */
function bench(g: THREE.Object3D, x: number, z: number, len: number, angle: number, seatTop = .46, back = false) {
  const b = add(g, new THREE.Group(), x, 0, z); b.rotation.y = angle;
  add(b, box(len, .07, .34, LD.oak), 0, seatTop, -.12).name = "uk-bench";
  for (const dx of [-len / 2 + .14, len / 2 - .14]) add(b, box(.09, seatTop - .04, .30, LD.oak), dx, (seatTop - .04) / 2, -.12);
  if (back) add(b, box(len, .52, .07, LD.oak), 0, seatTop + .28, -.30);
  return seatTop;
}
/** A working table, a marble slab or a scrubbed deal board. */
function table(g: THREE.Object3D, x: number, z: number, w = 2.0, d = .85, color = LD.deal, height = .80) {
  add(g, box(w, .07, d, color), x, height - .035, z);
  for (const dx of [-w / 2 + .11, w / 2 - .11]) for (const dz of [-d / 2 + .09, d / 2 - .09]) add(g, box(.08, height - .07, .08, LD.oak), x + dx, (height - .07) / 2, z + dz);
  return height;
}
/**
 * A walker that paces a straight segment, pauses and turns at each end, and steps while it travels: the legs
 * swing in proportion to the distance covered, so no figure slides. `londonWalk` in the Builder's people file
 * replaces the stepping half of this; the pacing stays here.
 */
function pacer(p: Figure, from: THREE.Vector3, to: THREE.Vector3, speed = .32, phase = 0, pause = 1.6) {
  const dir = to.clone().sub(from), len = dir.length(), leg = len / speed, cycle = 2 * (leg + pause), heading = Math.atan2(dir.x, dir.z);
  const legs = legsOf(p), arm = arms(p);
  return (t: number) => {
    const s = (t + phase) % cycle;
    let d: number, facing: number, moving: boolean;
    if (s < leg) { d = s * speed; facing = heading; moving = true; }
    else if (s < leg + pause) { d = len; facing = heading + Math.PI * clamp01((s - leg) / pause); moving = false; }
    else if (s < 2 * leg + pause) { d = len - (s - leg - pause) * speed; facing = heading + Math.PI; moving = true; }
    else { d = 0; facing = heading + Math.PI + Math.PI * clamp01((s - 2 * leg - pause) / pause); moving = false; }
    p.position.copy(from).addScaledVector(dir, d / len); p.rotation.y = facing;
    // steps matched to distance: one stride per .62 units covered, and the legs rest when the figure stands still
    const swing = moving ? Math.sin(d / .62 * Math.PI * 2) * .5 : 0;
    legs.left.thigh.rotation.x = swing; legs.right.thigh.rotation.x = -swing;
    legs.left.shin.rotation.x = Math.max(0, -swing) * .9; legs.right.shin.rotation.x = Math.max(0, swing) * .9;
    arm.left.rotation.x = -swing * .7; arm.right.rotation.x = swing * .7;
    const u = upper(p); u.position.y = (p.userData.hipY as number) + (moving ? Math.abs(Math.cos(d / .62 * Math.PI * 2)) * .02 : 0);
  };
}

// ---------- lamps, signs, walls ----------

/**
 * A hanging lamp: a gas lantern in a glazed box on the street, an oil hurricane lamp in a yard, a bare filament
 * nowhere. Same conventions as `lantern()` in props.ts — the name, the `suspensionPoint`, and the cord last in the
 * swing group, so `london-reactions.mjs` can prove it hangs from a real beam and its cord stays on the anchor.
 */
function ukLamp(scale = 1, gas = true): P {
  const g = group(); g.name = "hanging-lantern";
  const anchorY = .4 * scale; g.userData.suspensionPoint = V(0, anchorY, 0);
  const swing = new THREE.Group(); swing.position.y = anchorY; g.add(swing);
  if (gas) {
    // a four-sided glass lantern under a lead hood, the way a shop front and a station platform carried one
    add(swing, cyl(.115, .05, .09 * scale, LD.lead, 4), 0, -.19 * scale, 0);
    const glassBox = add(swing, box(.17 * scale, .21 * scale, .17 * scale, LD.glass), 0, -.33 * scale, 0);
    glassBox.material = mat("#F2D89A", { emissive: "#E9B24A", emissiveIntensity: .68, transparent: true, opacity: .84 });
    for (const dx of [-1, 1]) for (const dz of [-1, 1]) add(swing, box(.016 * scale, .22 * scale, .016 * scale, LD.iron), dx * .085 * scale, -.33 * scale, dz * .085 * scale);
    add(swing, ball(.04 * scale, "#F6E4A8", 6), 0, -.31 * scale, 0);                        // the mantle itself
    add(swing, box(.19 * scale, .022 * scale, .19 * scale, LD.lead), 0, -.45 * scale, 0);
  } else {
    add(swing, cyl(.10 * scale, .05 * scale, .06 * scale, LD.iron, 8), 0, -.20 * scale, 0);
    add(swing, cyl(.085 * scale, .095 * scale, .17 * scale, LD.glass, 10), 0, -.32 * scale, 0).material = mat("#F2C46A", { emissive: "#E9A94A", emissiveIntensity: .66, transparent: true, opacity: .85 });
    add(swing, cyl(.05 * scale, .05 * scale, .06 * scale, "#F2C46A", 8), 0, -.32 * scale, 0);
    add(swing, cyl(.10 * scale, .10 * scale, .02 * scale, LD.brass, 10), 0, -.42 * scale, 0);
    for (let i = 0; i < 3; i++) add(swing, cyl(.006 * scale, .006 * scale, .15 * scale, LD.iron, 4), Math.cos(i * 2.1) * .075 * scale, -.30 * scale, Math.sin(i * 2.1) * .075 * scale);
  }
  add(swing, cyl(.008, .008, .16 * scale, LD.iron, 4), 0, -.08 * scale, 0);   // the cord, last, its top at the anchor
  const phase = rnd() * 6;
  g.userData.tick = (t) => { swing.rotation.z = Math.sin(t * 1.2 + phase) * .05; swing.rotation.x = Math.cos(t * .95 + phase) * .03; };
  return g;
}
/** Lamps hung from the underside of a front beam, at the ends where they never cross the line to the food. */
function lamps(g: P, beamY: number, z: number, xs: number[], scale = .85, gas = true) { for (const x of xs) add(g, ukLamp(scale, gas), x, beamY - .08 - .4 * scale, z); }

/** A free-standing gas lamp standard on the pavement, the kind the lamplighter works. */
function lampPost(g: THREE.Object3D, x: number, z: number, h = 2.5) {
  const post = add(g, new THREE.Group(), x, 0, z);
  add(post, cyl(.11, .15, .22, LD.iron, 10), 0, .11, 0);
  add(post, cyl(.055, .075, h, LD.iron, 10), 0, h / 2 + .2, 0);
  add(post, cyl(.10, .07, .09, LD.iron, 10), 0, h + .24, 0);
  for (const dx of [-1, 1]) { const bar = add(post, box(.32, .02, .02, LD.iron), dx * .16, h + .06, 0); bar.rotation.z = dx * .5; }   // the lamplighter's ladder bar
  const head = add(post, new THREE.Group(), 0, h + .48, 0); head.name = "lamp-head";
  const glassBox = add(head, box(.26, .34, .26, LD.glass), 0, 0, 0);
  glassBox.material = mat("#F2D89A", { emissive: "#E9B24A", emissiveIntensity: .25, transparent: true, opacity: .8 });
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) add(head, box(.02, .35, .02, LD.iron), dx * .13, 0, dz * .13);
  const mantle = add(head, ball(.055, "#F6E4A8", 6), 0, -.05, 0); mantle.name = "lamp-mantle";
  add(head, cone(.23, .17, LD.lead, 4), 0, .24, 0);
  add(head, cyl(.02, .03, .10, LD.iron, 6), 0, .36, 0);
  return { head, mantle, glass: glassBox };
}

const SIGN_TEX: Record<string, THREE.CanvasTexture> = {};
function signTexture(text: string, w: number, h: number, ink: string, paper: string): THREE.CanvasTexture {
  const key = `${text}|${w}|${h}|${ink}|${paper}`; if (SIGN_TEX[key]) return SIGN_TEX[key];
  const W = 256, H = Math.round((256 * h) / w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.fillStyle = ink; ctx.font = `bold ${Math.min(H * .58, (W * 1.6) / Math.max(4, text.length))}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; SIGN_TEX[key] = tex; return tex;
}
function sign(g: THREE.Object3D, text: string, w: number, h: number, x: number, y: number, z: number, ink = LD.brass, paper = LD.pubGreen, rot = 0) {
  const b = new THREE.Group(); b.position.set(x, y, z); b.rotation.y = rot; g.add(b);
  add(b, box(w + .06, h + .06, .04, LD.oakSmoke), 0, 0, -.01);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: signTexture(text, w, h, ink, paper), roughness: .85 })); face.position.z = .015; b.add(face);
}

/** A brick chimney stack with pots, on the ridge line. The Builder's smoke anchor is the top of the pot. */
function chimney(g: THREE.Object3D, x: number, y: number, z: number, h = .9, pots = 2) {
  add(g, box(.42, h, .38, LD.londonStock), x, y + h / 2, z);
  for (let i = 0; i < pots; i++) add(g, cyl(.075, .085, .26, "#B4644A", 10), x - .1 + i * .2, y + h + .13, z);
  return y + h + .26;
}
/** A drystone wall in courses, the Dales and the Pennines. */
function drystone(g: THREE.Object3D, x: number, z: number, len: number, angle: number, h = .62) {
  const w = add(g, new THREE.Group(), x, 0, z); w.rotation.y = angle;
  for (let c = 0; c < 4; c++) for (let i = 0; i < Math.floor(len / .28); i++) {
    const s = .24 + (i % 3) * .03;
    add(w, box(s, .15, .26 - c * .02, c % 2 ? "#8E8C84" : "#7E7C74"), -len / 2 + .14 + i * .28 + (c % 2) * .08, .08 + c * .15, 0);
  }
  add(w, box(len, .10, .20, "#8A8880"), 0, h + .02, 0);
  return w;
}
/** A hawthorn hedge on a bank, the Weald and the West Country. */
function hedge(g: THREE.Object3D, x: number, z: number, len: number, angle: number) {
  const h = add(g, new THREE.Group(), x, 0, z); h.rotation.y = angle;
  add(h, box(len, .30, .55, "#5E6E44"), 0, .15, 0);
  for (let i = 0; i < Math.floor(len / .42); i++) add(h, ball(.30, i % 2 ? "#5A7A3E" : "#4E6E38", 6), -len / 2 + .21 + i * .42, .42, (i % 2) * .06).scale.set(1, .85, .9);
  return h;
}

// ---------- period buildings: each room stand is its own building, read from its research and its painting ----------

/**
 * Merge a static shell by colour, so a whole building is a handful of meshes and a roof of three hundred slates
 * costs no more to draw than a box. Only static parts go in: people, food, lamps, signs with painted faces and
 * anything named for a harness stay outside it.
 */
function solid(shell: THREE.Group): THREE.Group {
  const by = new Map<string, { m: THREE.Material; geos: THREE.BufferGeometry[] }>();
  shell.updateMatrixWorld(true);
  shell.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const m = o.material as THREE.MeshStandardMaterial;
    const key = `${m.color.getHexString()}|${m.emissive?.getHexString()}|${m.emissiveIntensity}|${m.transparent}|${m.opacity}|${m.side}`;
    const geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    geo.applyMatrix4(o.matrixWorld);
    for (const name of Object.keys(geo.attributes)) if (name !== "position" && name !== "normal" && name !== "uv") geo.deleteAttribute(name);
    if (!geo.attributes.normal) geo.computeVertexNormals();
    if (!geo.attributes.uv) geo.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    geo.clearGroups();
    const slot = by.get(key) ?? { m, geos: [] }; slot.geos.push(geo); by.set(key, slot);
  });
  const out = new THREE.Group(); out.name = "uk-building";
  for (const { m, geos } of by.values()) {
    const merged = mergeGeometries(geos, false);
    if (!merged) throw new Error("props-london: a building shell would not merge");
    const mesh = new THREE.Mesh(merged, m); mesh.castShadow = true; mesh.receiveShadow = true; out.add(mesh);
    geos.forEach((geo) => geo.dispose());
  }
  shell.traverse((o) => { if (o instanceof THREE.Mesh) o.geometry.dispose(); });
  return out;
}
/** A round bar between two points: a truss member, a bracket, a hoop stay, a driftwood post. */
function strut(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, colour: string, seg = 6) {
  const d = b.clone().sub(a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), seg), mat(colour));
  m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); parent.add(m);
  return m;
}
/** A flat square bar between two points: a lattice web, a rail, a glazing bar seen on edge. */
function bar(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, w: number, t: number, colour: string) {
  const d = b.clone().sub(a), m = box(w, d.length(), t, colour);
  m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); parent.add(m);
  return m;
}

/** How a roof is covered, and what an overview sees on it: courses of slate or tile, graded stone, rolls, battens. */
type Cover = { colour: string; line: string; every: number; kind: "line" | "graded" | "roll" | "batten" | "seam" | "none"; thick?: number };
const COVERS = {
  /** Blue-grey Welsh slate, the London roof: close thin courses. The public house. */
  welshSlate: { colour: "#56616C", line: "#434D57", every: .19, kind: "line" },
  /** Red plain clay tile, the Queen Anne shop of the 1890s. The tea room. */
  plainTile: { colour: "#A4523A", line: "#86422E", every: .14, kind: "line" },
  /** Pennine stone slate, heavy and graded, big at the eaves and small at the ridge. The fried fish shop. */
  stoneFlag: { colour: "#857A68", line: "#645A4C", every: .30, kind: "graded", thick: .14 },
  /** Westmorland-grey graded slate with a stone ridge. The dale dairy. */
  gradedSlate: { colour: "#6A6670", line: "#524E58", every: .26, kind: "graded", thick: .12 },
  /** Cornish scantle slate: small, steep, wet-dark. The bakehouse. */
  scantle: { colour: "#3E4448", line: "#2C3236", every: .11, kind: "line" },
  /** Speyside slate over white harl. The distillery. */
  highlandSlate: { colour: "#5E6A70", line: "#4A555A", every: .22, kind: "line" },
  /** Heather and straw thatch, thick and roped. The Angus bothy. */
  thatch: { colour: "#8E7650", line: "#6E5A3A", every: .16, kind: "seam", thick: .30 },
  /** Tarred felt on boards with battens down the slope. The Shadwell lean-to. */
  tarFelt: { colour: "#34302C", line: "#22201E", every: .42, kind: "batten" },
  /** A hop-picker's tarpaulin, olive and patched. The Weald cookhouse. */
  tarpaulin: { colour: "#76704C", line: "#5E5A3C", every: .75, kind: "seam", thick: .04 },
  /** An old tan sail. The cockle shelter. */
  sailcloth: { colour: "#9C5E3A", line: "#7E4A2E", every: .6, kind: "seam", thick: .04 },
  /** The coffee stall's weathered red canvas. */
  redCanvas: { colour: "#8E4A38", line: "#76392A", every: .55, kind: "seam", thick: .04 },
} satisfies Record<string, Cover>;

/** Courses laid across one slope, in the slope's own frame: `eave` is the local z of the eave edge (+L/2 or -L/2). */
function coverSlope(slope: THREE.Object3D, cover: Cover, length: number, L: number, thick: number, eave: number) {
  const top = thick / 2 + .008, dir = -Math.sign(eave);
  if (cover.kind === "line") for (let s = cover.every / 2; s < L - .05; s += cover.every) add(slope, box(length, .022, .035, cover.line), 0, top, eave + dir * s);
  if (cover.kind === "graded") { let s = .08, step = cover.every * 1.35; while (s < L - .05) { add(slope, box(length, .04, .05, cover.line), 0, top, eave + dir * s); s += step; step = Math.max(cover.every * .55, step * .88); } }
  if (cover.kind === "roll") for (let x = -length / 2 + cover.every / 2; x < length / 2; x += cover.every) add(slope, cyl(.045, .045, L, cover.line, 6), x, top, 0).rotation.x = Math.PI / 2;
  if (cover.kind === "batten") for (let x = -length / 2 + cover.every / 2; x < length / 2; x += cover.every) add(slope, box(.05, .04, L, cover.line), x, top, 0);
  if (cover.kind === "seam") for (let x = -length / 2 + cover.every; x < length / 2 - .1; x += cover.every) add(slope, box(.025, .012, L, cover.line), x, top, 0);
}
/**
 * A double-pitched roof over a rectangle w (along x) by d (along z), eaves at `y`, ridge along x. `ends` closes
 * each gable with a triangle of wall. Returns the ridge height. A roof whose ridge runs front to back is this one
 * inside a group turned a quarter.
 */
function gableRoof(g: THREE.Object3D, w: number, d: number, y: number, rise: number, cover: Cover, o: { x?: number; z?: number; over?: number; ridge?: string; ends?: string; verge?: number } = {}) {
  const x = o.x ?? 0, z = o.z ?? 0, over = o.over ?? .22, thick = cover.thick ?? .09, half = d / 2 + over, L = Math.hypot(half, rise * half / (d / 2)), angle = Math.atan2(rise, d / 2);
  const length = w + 2 * over;
  for (const side of [-1, 1]) {
    const slope = add(g, box(length, thick, L, cover.colour), x, y + rise / 2 - over * Math.tan(angle) / 2, z + side * half / 2);
    slope.rotation.x = side * angle;
    coverSlope(slope, cover, length, L, thick, side * L / 2);
  }
  add(g, box(length + .04, .12, .16, o.ridge ?? cover.line), x, y + rise + .03, z);
  if (o.ends) for (const sx of [-1, 1]) add(g, gableEnd(d, rise, .16, o.ends), x + sx * (w / 2 - .08), y, z);
  if (o.verge) for (const sx of [-1, 1]) for (const side of [-1, 1]) {   // a stone verge on each rake, which is what makes a gable read as stone
    const v = add(g, box(o.verge, .10, L - .1, o.ends ?? cover.line), x + sx * (length / 2 - o.verge / 2), y + rise / 2 - over * Math.tan(angle) / 2 + .07, z + side * half / 2);
    v.rotation.x = side * angle;
  }
  return y + rise;
}
/** A triangle of wall filling a gable: base d along z, apex `rise` above its foot, `t` thick along x. */
function gableEnd(d: number, rise: number, t: number, colour: string) {
  const shape = new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, rise)]);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false }); geo.translate(0, 0, -t / 2);
  const m = new THREE.Mesh(geo, mat(colour)); m.rotation.y = Math.PI / 2; return m;
}
/** A hipped roof on four faces, eaves W by D at `y`, with courses on the two long faces and a roll down each hip. */
function hipRoof(g: THREE.Object3D, W: number, D: number, y: number, rise: number, cover: Cover, o: { x?: number; z?: number; ridge?: string } = {}) {
  const x = o.x ?? 0, z = o.z ?? 0, rx = Math.max(.2, W / 2 - D / 2 * .85);
  const p = [-W / 2, y, -D / 2, W / 2, y, -D / 2, W / 2, y, D / 2, -W / 2, y, D / 2, -rx, y + rise, 0, rx, y + rise, 0];
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0]);
  const flat = geo.toNonIndexed(); flat.computeVertexNormals();
  const roof = add(g, new THREE.Mesh(flat, mat(cover.colour, { side: THREE.DoubleSide })), x, 0, z);
  const angle = Math.atan2(rise, D / 2), slope = Math.hypot(D / 2, rise);
  for (const side of [-1, 1]) for (let s = cover.every / 2; s < slope - .08; s += cover.every) {
    const f = s / slope, len = W - 2 * f * (W / 2 - rx);
    const c = add(roof, box(len, .022, .035, cover.line), 0, y + f * rise + .02, side * (D / 2) * (1 - f));
    c.rotation.x = side * angle;
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) strut(roof, V(sx * W / 2, y + .02, sz * D / 2), V(sx * rx, y + rise + .02, 0), .045, o.ridge ?? cover.line, 5);
  add(roof, box(2 * rx + .08, .1, .12, o.ridge ?? cover.line), 0, y + rise + .03, 0);
  return y + rise;
}
/** A sash window with its frame, glazing bars and a sill, on a face turned toward `face` (+z front, +x or -x side). */
function sash(g: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, frame: string, face: "z" | "x" | "-x" = "z", glass = "#5E7078") {
  const p = add(g, new THREE.Group(), x, y, z); p.rotation.y = face === "x" ? Math.PI / 2 : face === "-x" ? -Math.PI / 2 : 0;
  add(p, box(w + .08, h + .08, .05, frame), 0, 0, 0);
  add(p, box(w, h, .03, glass), 0, 0, .025);
  add(p, box(w, .035, .04, frame), 0, 0, .04);
  add(p, box(.03, h, .04, frame), 0, 0, .04);
  add(p, box(w + .16, .06, .12, frame), 0, -h / 2 - .06, .05);
  return p;
}
/** Quoins: dressed stones at a corner, alternating long and short, the mark of a stone building. */
function quoins(g: THREE.Object3D, x: number, z: number, h: number, colour: string, faceX: number, faceZ: number) {
  for (let i = 0, y = .14; y < h - .1; i++, y += .26) {
    const long = i % 2 === 0;
    add(g, box(long ? .34 : .2, .22, .06, colour), x - faceX * (long ? .17 : .1), y, z + faceZ * .03);
    add(g, box(.06, .22, long ? .2 : .34, colour), x + faceX * .03, y, z - faceZ * (long ? .1 : .17));
  }
}
/** Rubble: a scatter of stones standing proud of a face, so a stone wall does not read as a painted box. */
function rubble(g: THREE.Object3D, x0: number, x1: number, y0: number, y1: number, z: number, colour: string, n: number, seed = 1) {
  for (let i = 0; i < n; i++) {
    const u = (Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1, v = (Math.sin(i * 39.3468 + seed * 11.135) * 24634.6345) % 1;
    add(g, box(.18 + Math.abs(u) * .14, .1 + Math.abs(v) * .06, .03, colour), x0 + Math.abs(u) * (x1 - x0), y0 + Math.abs(v) * (y1 - y0), z);
  }
}
/** A brick stack with its pots on a roof. Returns the top of the pots, where a kitchen fire's smoke is published. */
function stack(g: THREE.Object3D, x: number, y0: number, z: number, h: number, colour: string, pots = 2, w = .46, d = .40) {
  add(g, box(w, h, d, colour), x, y0 + h / 2, z);
  add(g, box(w + .1, .08, d + .1, "#C9BFAE"), x, y0 + h, z);
  for (let i = 0; i < pots; i++) add(g, cyl(.07, .085, .28, "#B4644A", 8), x - (pots - 1) * .09 + i * .18, y0 + h + .18, z);
  return y0 + h + .34;
}
/** A spoked wheel in the plane of its travel: iron tyre, felloe, spokes and a hub on the axle, which is along z. */
function wheel(r: number, spokes: number, felloe = LD.oak, spoke = LD.cream, tyre = LD.iron, solidTyre = 0): THREE.Group {
  const w = new THREE.Group(); w.name = "uk-wheel";
  add(w, new THREE.Mesh(new THREE.TorusGeometry(r - .02, Math.max(.035, r * .09), 6, 20), mat(felloe)), 0, 0, 0);
  add(w, new THREE.Mesh(new THREE.TorusGeometry(r + .012, solidTyre || .022, 5, 20), mat(tyre)), 0, 0, 0);
  for (let n = 0; n < spokes; n++) { const s = add(w, cyl(.016, .022, r * 1.9, spoke, 5), 0, 0, 0); s.rotation.z = (n * Math.PI) / spokes; }
  add(w, cyl(r * .2, r * .2, .16, felloe, 10), 0, 0, 0).rotation.x = Math.PI / 2;
  add(w, cyl(r * .1, r * .12, .22, tyre, 8), 0, 0, 0).rotation.x = Math.PI / 2;
  return w;
}

// ---------- animals and vehicles, exported for the Builder's decor as well as for the stands ----------

/** A horse in harness or at grass: the legs swing about z and the hooves plant and push back under the body. */
function horseBody(g: THREE.Object3D, x: number, z: number, coat = "#5A3E2C", angle = 0) {
  const h = add(g, new THREE.Group(), x, 0, z); h.rotation.y = angle;
  const body = add(h, box(1.35, .62, .58, coat), 0, .96, 0);
  add(body, box(.5, .46, .5, coat), .72, .16, 0);
  const neck = add(h, box(.34, .62, .36, coat), .72, 1.32, 0); neck.rotation.z = -.42;
  const head = add(h, new THREE.Group(), 1.06, 1.60, 0); head.name = "horse-head";
  add(head, box(.46, .26, .26, coat), .08, 0, 0);
  add(head, box(.22, .20, .20, "#3A2A20"), .34, -.06, 0);
  for (const dz of [-.09, .09]) add(head, cone(.05, .14, coat, 5), -.08, .14, dz);
  add(h, box(.10, .52, .10, "#2E241C"), -.70, 1.06, 0).rotation.z = .5;                     // the tail
  const legs = [[-.46, -.20], [-.46, .20], [.46, -.20], [.46, .20]].map(([dx, dz]) => {
    const leg = add(h, new THREE.Group(), dx, .74, dz);
    add(leg, box(.14, .44, .15, coat), 0, -.22, 0);
    add(leg, box(.12, .32, .13, coat), 0, -.56, 0);
    add(leg, box(.15, .09, .17, "#2A2420"), 0, -.76, 0);
    return leg;
  });
  return { root: h, body, head, legs };
}
/** A pit pony or a beach donkey: smaller, shaggier and with the same planted gait. */
function donkeyBody(g: THREE.Object3D, x: number, z: number, coat = "#8A7A68", angle = 0) {
  const d = horseBody(g, x, z, coat, angle);
  d.root.scale.setScalar(.72);
  for (const dz of [-.10, .10]) add(d.head, cone(.055, .26, coat, 5), -.10, .20, dz).rotation.x = dz * .4;   // the long ears
  return d;
}
/** Legs that swing about z and plant: `step` is 0 when the animal stands still. */
function animalGait(legs: THREE.Group[], phase: number, step: number) {
  legs.forEach((leg, n) => { leg.rotation.z = -Math.sin(phase + (n % 2 ? Math.PI : 0) + (n < 2 ? .4 : 0)) * .42 * (step > .02 ? 1 : 0); });
}

/**
 * The knifeboard omnibus of the General: a pair in front, a driver on the box, a back-to-back bench on the roof
 * and a ladder up to it. Horse-drawn, which is what the object's reaction means by "the pair steps off".
 */
export function horseOmnibus(): P {
  const g = group();
  const bus = add(g, new THREE.Group(), 0, 0, 0); bus.name = "omnibus-body";
  add(bus, box(2.9, 1.15, 1.30, LD.oxbloodTile), 0, .96, 0);
  add(bus, box(2.94, .07, 1.34, LD.cream), 0, 1.56, 0);
  add(bus, box(2.3, .30, 1.20, LD.cream), 0, 1.44, 0);                                   // the advertised board along the side
  for (let i = 0; i < 4; i++) for (const dz of [-1, 1]) add(bus, box(.46, .46, .04, LD.glass), -.95 + i * .62, 1.02, dz * .66);
  add(bus, box(.05, .62, .92, LD.glass), 1.47, 1.02, 0);
  // the knifeboard: a back-to-back bench down the middle of the roof, and the ladder to it
  const board = add(bus, box(2.2, .06, .30, LD.oak), 0, 1.86, 0);
  add(bus, box(2.2, .44, .07, LD.oak), 0, 2.06, 0); void board;
  for (let i = 0; i < 5; i++) add(bus, box(.05, .40, .05, LD.iron), -1.35, 1.78 - i * .0, .34 + i * .0);
  const ladder = add(bus, new THREE.Group(), -1.52, 1.0, 0);
  for (const dz of [-.17, .17]) add(ladder, cyl(.026, .026, 1.7, LD.iron, 5), 0, .5, dz);
  for (let i = 0; i < 5; i++) add(ladder, cyl(.02, .02, .36, LD.iron, 5), 0, .02 + i * .33, 0).rotation.x = Math.PI / 2;
  const wheels = [[-1.0, -.72], [-1.0, .72], [1.0, -.72], [1.0, .72]].map(([x, z], i) => {
    const r = i < 2 ? .42 : .34;
    // the wheel stands in the plane it rolls in, with its felloe, tyre and hub, so from above it reads as a wheel
    return add(bus, wheel(r, 10, "#8A2A22", LD.cream), x, r, z);
  });
  add(bus, box(1.0, .10, .10, LD.oak), 1.8, .78, -.32); add(bus, box(1.0, .10, .10, LD.oak), 1.8, .78, .32);   // the pole and traces
  const pair = [-1, 1].map((side) => horseBody(bus, 2.9, side * .45, side > 0 ? "#4A3628" : "#5E4634", 0));
  for (const horse of pair) { add(horse.root, box(.5, .14, .62, LD.oakSmoke), .1, 1.30, 0); add(horse.head, box(.03, .22, .03, LD.iron), .18, .02, .13); }
  const driver = seatFigure(bus, resident("carter", false), 1.35, 0, Math.PI / 2, 1.72);
  arms(driver).left.rotation.x = -1.25; arms(driver).right.rotation.x = -1.20;
  const reins = add(bus, cyl(.012, .012, 1.9, LD.oakSmoke, 4), 2.2, 1.62, 0); reins.rotation.z = 1.42;
  const riders = [-.55, .2, .8].map((x, i) => seatFigure(bus, resident(i === 1 ? "clerk" : "shawl", false), x, i === 1 ? -.24 : .24, i === 1 ? Math.PI : 0, 1.92));
  g.userData.bus = bus; g.userData.wheels = wheels; g.userData.pair = pair;
  g.userData.figures = [driver, ...riders];
  return g;
}
/** The hansom cab: two tall wheels, the driver up behind on his perch, the fare in front under the hood. */
export function hansomCab(withFare = true): P {
  const g = group();
  const cab = add(g, new THREE.Group(), 0, 0, 0); cab.name = "hansom-body";
  add(cab, box(1.30, .96, 1.05, LD.iron), 0, .92, 0);
  add(cab, new THREE.Mesh(new THREE.CylinderGeometry(.56, .56, 1.05, 14, 1, true, 0, Math.PI), mat("#25262A", { side: THREE.DoubleSide })), -.08, 1.40, 0).rotation.set(Math.PI / 2, 0, -Math.PI / 2);
  add(cab, box(.05, .60, .96, LD.glass), .66, 1.02, 0);
  add(cab, box(.9, .07, 1.0, LD.oak), .1, .48, 0);
  const wheels = [-1, 1].map((side) => {
    return add(cab, wheel(.60, 12, LD.iron, "#C9A83A"), -.06, .62, side * .70);
  });
  const perch = add(cab, box(.52, .08, .60, LD.oak), -.62, 1.66, 0);
  add(cab, box(.10, .46, .60, LD.oak), -.86, 1.90, 0); void perch;
  const cabman = seatFigure(cab, resident("carter", false), -.62, 0, Math.PI / 2, 1.74);
  arms(cabman).left.rotation.x = -1.15; arms(cabman).right.rotation.x = -1.10;
  add(cab, box(1.2, .09, .09, LD.oak), 1.25, .74, -.30); add(cab, box(1.2, .09, .09, LD.oak), 1.25, .74, .30);
  const horse = horseBody(cab, 2.25, 0, "#3E2E24", 0);
  add(horse.root, box(.5, .14, .62, LD.oakSmoke), .1, 1.30, 0);
  const figures = [cabman, ...(withFare ? [seatFigure(cab, resident("clerk", false), .12, 0, Math.PI / 2, 1.00)] : [])];
  g.userData.cab = cab; g.userData.wheels = wheels; g.userData.horse = horse; g.userData.figures = figures;
  return g;
}
/**
 * One motor omnibus of 1907, the year the General put them on the Westminster routes: a solid-tyred chassis, an
 * open top with a stair at the back and a bonnet in front. It is the newest thing on the table and the pillar
 * box's own speech means it when it says the horse does not care for the engine.
 */
export function motorOmnibus(): P {
  const g = group();
  const bus = add(g, new THREE.Group(), 0, 0, 0); bus.name = "motor-body";
  add(bus, box(3.2, 1.10, 1.35, LD.oxbloodTile), 0, .92, 0);                        // the General's red, the livery of 1907, same as the horse bus
  add(bus, box(3.24, .07, 1.40, LD.cream), 0, 1.50, 0);
  add(bus, box(2.6, .28, 1.24, LD.cream), 0, 1.38, 0);
  for (let i = 0; i < 4; i++) for (const dz of [-1, 1]) add(bus, box(.5, .44, .04, LD.glass), -1.0 + i * .68, .98, dz * .69);
  add(bus, box(.9, .62, 1.10, LD.oakSmoke), 1.95, .86, 0);                                  // the bonnet
  add(bus, box(.1, .5, 1.0, LD.iron), 2.44, .86, 0);
  add(bus, box(2.4, .06, .30, LD.oak), 0, 1.80, 0); add(bus, box(2.4, .42, .07, LD.oak), 0, 2.00, 0);
  for (let i = 0; i < 4; i++) add(bus, cyl(.02, .02, .38, LD.iron, 5), -1.55, 1.56 + i * .12, 0).rotation.x = Math.PI / 2;
  for (const [x, z] of [[-1.15, -.72], [-1.15, .72], [1.25, -.72], [1.25, .72]]) {
    add(bus, wheel(.40, 10, "#6E2420", "#9C9488", "#1E1E1E", .07), x, .40, z);   // the artillery wheel on its solid rubber tyre
  }
  const driver = seatFigure(bus, resident("carter", false), 1.35, 0, Math.PI / 2, 1.42);
  arms(driver).left.rotation.x = -1.3; arms(driver).right.rotation.x = -1.3;
  add(bus, new THREE.Mesh(new THREE.TorusGeometry(.17, .022, 5, 12), mat(LD.oakSmoke)), 1.66, 1.58, 0).rotation.set(0, 0, 1.2);
  g.userData.bus = bus; g.userData.figures = [driver];
  return g;
}
/** A coster's barrow: two wheels, two handles, a rail of produce and a naphtha flare on a stick. */
export function costerBarrow(flare = false): P {
  const g = group();
  const b = add(g, new THREE.Group(), 0, 0, 0); b.name = "coster-barrow";
  add(b, box(1.5, .28, .84, LD.deal), 0, .70, 0);
  add(b, box(1.54, .06, .88, LD.oak), 0, .86, 0);
  for (const side of [-1, 1]) add(b, box(1.5, .18, .05, LD.oak), 0, .95, side * .42);
  for (const side of [-1, 1]) {
    add(b, wheel(.34, 8, LD.oak, LD.deal), -.1, .36, side * .50);
  }
  for (const side of [-1, 1]) add(b, cyl(.03, .035, 1.1, LD.oak, 5), 1.0, .62, side * .32).rotation.z = 1.50;
  for (const side of [-1, 1]) add(b, cyl(.035, .045, .58, LD.oak, 5), -.72, .30, side * .32);
  if (flare) { const post = add(b, cyl(.022, .026, 1.1, LD.iron, 5), -.62, 1.44, 0); void post; add(b, cone(.09, .16, LD.brass, 8), -.62, 2.02, 0); }
  return g;
}
/** A donkey and a flat cart: the Penclawdd cockle women's, and the coal round's. */
export function cockleDonkey(): P {
  const g = group();
  const cart = add(g, new THREE.Group(), 0, 0, 0); cart.name = "donkey-cart";
  add(cart, box(1.25, .12, .82, LD.deal), 0, .58, 0);
  for (const side of [-1, 1]) add(cart, box(1.25, .22, .05, LD.oak), 0, .72, side * .41);
  add(cart, box(.05, .22, .82, LD.oak), -.62, .72, 0);
  for (const side of [-1, 1]) {
    add(cart, wheel(.32, 8, LD.oak, LD.deal), -.02, .34, side * .52);
  }
  for (const side of [-1, 1]) add(cart, cyl(.028, .034, 1.15, LD.oak, 5), .92, .56, side * .30).rotation.z = 1.52;
  const donkey = donkeyBody(g, 2.0, 0, "#8A7A68", 0);
  g.userData.cart = cart; g.userData.donkey = donkey;
  return g;
}

// ---------- the thirteen buildings ----------
//
// Walls and roofs, one pair per room and no pair repeated (docs/london-research.md section 1.3 and each room's
// setting in section 3.1):
//
//   public house        red brick over green glazed tile   blue Welsh slate, hipped, terracotta ridge
//   tea room            cream stucco                        red plain tile behind a shaped gable
//   market              green cast-iron columns             glass on iron glazing bars, a ridge lantern
//   pie and mash shop   yellow stock brick, green tile      lead flat behind a parapet, party-wall stacks
//   fried fish shop     dark Accrington brick, blue bands   Pennine stone slate, graded
//   coffee stall        a painted barrow                    a cambered red canvas on iron hoops
//   seamen's kitchen    soot-black stock brick              tarred felt lean-to
//   hop cookhouse       corrugated-iron hopper hut          an olive tarpaulin on a ridge pole
//   dale dairy          grey limestone rubble, quoins       graded Westmorland slate, stone verges
//   bakehouse           Cornish granite, slate-hung flank   dark scantle slate, the oven stack
//   cockle shelter      driftwood                           an old tan sail
//   curing yard bothy   red sandstone rubble                roped heather thatch
//   distillery          white harl, grey margins            Speyside slate, the kiln and its pagoda
//
// Every building keeps the room's working front open to the street, so the food is seen through it, and every one
// stands inside the ground the stand had before (the shared-ground pass is done and london-world.mjs holds it).

/** A floor inside the room, the block of the building behind the room, and the room's two flanks. */
function room(s: THREE.Object3D, w: number, zB: number, zR: number, zF: number, h: number, wall: string, floor: string, flankH = h) {
  add(s, box(w - .24, .07, zF - zR, floor), 0, .035, (zF + zR) / 2);
  add(s, box(w, h, zR - zB, wall), 0, h / 2, (zB + zR) / 2);
  for (const sx of [-1, 1]) add(s, box(.16, flankH, zF - zR, wall), sx * (w / 2 - .08), flankH / 2, (zF + zR) / 2);
}
/**
 * The fascia over a shop's open front: the board the lamps hang from, named `front-beam` for the harness, with the
 * lettering on its face and a moulded cornice over it. Returns what `lamps()` needs: the lamps' anchor lies on the
 * board's underside.
 */
function fascia(g: P, w: number, y0: number, z: number, colour: string, text: string, ink: string, cornice: string, x = 0, rot = 0) {
  const f = add(g, new THREE.Group(), x, 0, z); f.rotation.y = rot;
  const beam = add(f, box(w, .30, .16, colour), 0, y0 + .15, 0); beam.name = "front-beam";
  add(f, box(w + .14, .08, .26, cornice), 0, y0 + .34, .03);
  if (text) sign(f, text, Math.min(2.5, w * .7), .22, 0, y0 + .15, .095, ink, colour);
  return { beam, y: y0 + .08, zFront: z };
}
/** A prism standing on the plan outline `pts` (x, z pairs), h tall from its foot: a chamfered corner. Place it with
 *  `add(parent, prism(...), 0, y0, 0)`, since `add` sets the position. */
function prism(pts: [number, number][], h: number, colour: string) {
  const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
  const m = new THREE.Mesh(geo, mat(colour)); m.rotation.x = -Math.PI / 2; return m;
}
/** A wall in a plane of constant x whose outline in (z, y) is `pts`: a lean-to's end. Place it with `add(..., x, 0, 0)`. */
function flank(pts: [number, number][], t: number, colour: string) {
  const shape = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(-z, y)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false }); geo.translate(0, 0, -t / 2);
  const m = new THREE.Mesh(geo, mat(colour)); m.rotation.y = Math.PI / 2; return m;
}
/** A single-pitch roof from a high back edge to a low front edge, both along x. */
function leanRoof(s: THREE.Object3D, w: number, zBack: number, yBack: number, zFront: number, yFront: number, cover: Cover, over = .2) {
  const run = zFront - zBack, drop = yBack - yFront, angle = Math.atan2(drop, run), L = Math.hypot(run, drop) + over * 1.6, thick = cover.thick ?? .08;
  const slope = add(s, box(w + 2 * over, thick, L, cover.colour), 0, (yBack + yFront) / 2 + .05, (zBack + zFront) / 2 + over * .3);
  slope.rotation.x = angle;
  coverSlope(slope, cover, w + 2 * over, L, thick, L / 2);
  return slope;
}

/**
 * The public house: a two-storey corner house of the 1890s rebuilding, red brick over a ground floor faced in green
 * glazed tile, etched glass in the flank windows, two canted oriels over the fascia, a hipped Welsh slate roof
 * with a terracotta ridge and a stack on each flank. The bar is the open ground floor under the fascia, so the
 * carving board faces the street. The painted sign hangs off an iron bracket at the corner (the stand swings it).
 */
function publicHouse(g: P) {
  const s = new THREE.Group(), brick = "#8E4A38", tile = "#2F5C42", stone = "#DCD0B8";
  const w = 3.8, zB = -3.9, zR = -1.8, zF = .9, h = 2.2, up = 2.0, top = h + .3 + up;
  room(s, w, zB, zR, zF, top, brick, "#7A6450", h + .3);
  for (const sx of [-1, 1]) {
    add(s, box(.03, .95, zF - zB + .02, tile), sx * (w / 2 + .012), .475, (zF + zB) / 2);             // the tiled dado round the flanks
    add(s, box(.30, h + .3, .26, tile), sx * (w / 2 - .05), (h + .3) / 2, zF + .02);                   // the tiled pilasters
    add(s, box(.38, .10, .32, stone), sx * (w / 2 - .05), h + .35, zF + .02);
    const etched = add(s, new THREE.Group(), sx * (w / 2 + .02), 1.5, -.35); etched.rotation.y = sx * Math.PI / 2;
    add(etched, box(1.3, .92, .04, LD.oakSmoke), 0, 0, 0);
    add(etched, box(1.18, .80, .03, "#D2DEDA"), 0, 0, .025);                                           // frosted
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) add(etched, box(.07, .07, .02, "#F6FAF8"), -.44 + i * .22, -.22 + j * .22, .045).rotation.z = Math.PI / 4;
    for (const z of [-.4, -2.9]) sash(s, sx * (w / 2 + .01), h + 1.35, z, .5, .9, stone, sx > 0 ? "x" : "-x");
  }
  // the upper storey over the bar, a stone band, the cornice, and the two canted oriels
  add(s, box(w, up, zF - zR, brick), 0, h + .3 + up / 2, (zF + zR) / 2);
  add(s, box(w + .08, .1, zF - zB + .08, stone), 0, h + .33, (zF + zB) / 2);
  add(s, box(w + .22, .16, zF - zB + .22, stone), 0, top, (zF + zB) / 2);
  for (const x of [-.95, .95]) {
    const o = add(s, new THREE.Group(), x, h + .3, zF);
    add(o, box(.76, .14, .46, stone), 0, .3, .2);
    for (const [dx, dz, ry, ww] of [[0, .38, 0, .54], [-.36, .22, .95, .34], [.36, .22, -.95, .34]] as [number, number, number, number][]) {
      const p = add(o, new THREE.Group(), dx, 1.02, dz); p.rotation.y = ry;
      add(p, box(ww, 1.2, .06, "#E8E0CC"), 0, 0, 0); add(p, box(ww - .1, 1.0, .04, "#5E7078"), 0, .03, .03); add(p, box(.03, 1.0, .05, "#E8E0CC"), 0, .03, .045);
    }
    add(o, box(.86, .1, .54, "#6E767A"), 0, 1.68, .2);                                                  // the lead cap
  }
  hipRoof(s, w + .36, zF - zB + .36, top + .08, 1.3, COVERS.welshSlate, { z: (zF + zB) / 2, ridge: "#A8503A" });
  for (const sx of [-1, 1]) stack(s, sx * 1.45, top - .2, -2.9, 1.9, brick, 3);
  g.add(solid(s));
  const f = fascia(g, w - .56, h, zF + .1, tile, "FREE HOUSE", LD.brass, stone);
  // the sign on its bracket: the stand swings the board on its hooks
  const bracket = add(g, new THREE.Group(), -w / 2 + .02, h + 1.0, zF + .12);
  strut(bracket, V(0, 0, 0), V(0, 0, .66), .026, LD.iron, 5);
  strut(bracket, V(0, -.42, 0), V(0, 0, .52), .016, LD.iron, 4);
  add(bracket, ball(.04, LD.brass, 6), 0, 0, .68);
  const board = add(bracket, new THREE.Group(), 0, -.02, .40); board.name = "pub-signboard";
  for (const dx of [-.2, .2]) add(board, cyl(.008, .008, .10, LD.iron, 4), dx, -.05, 0);
  sign(board, "THE RED LION", .58, .42, 0, -.33, 0, LD.brass, "#7A2A24");
  return { ...f, zBack: zR, floor: .07, board };
}

/**
 * The tea room: a stucco shop of two floors under a red plain-tile roof whose ridge runs back from a shaped gable,
 * a striped awning over the pavement, and a bow window of curved glass beside the door. The first table stands in
 * the door under the awning, where the pot is poured.
 */
function teaShop(g: P) {
  const s = new THREE.Group(), stucco = "#E6DBC4", line = "#CDC0A6", trim = "#6E2A26", paint = "#EFE7D4";
  // narrower than its neighbours and only one storey at the back, so the chippy's and the forcing shed's rays pass
  const w = 3.6, zB = -3.9, zR = -1.8, zU = -2.0, zF = .9, h = 2.2, up = 1.8, top = h + .3 + up;
  room(s, w, zB, zR, zF, h + .3, stucco, "#9A8872");
  add(s, box(w, up, zF - zU, stucco), 0, h + .3 + up / 2, (zF + zU) / 2);
  add(s, box(w + .06, .06, zU - zB + .06, "#7E868A"), 0, h + .33, (zU + zB) / 2);                           // the lead flat over the back
  for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) add(s, box(.02, .03, zF - zB, line), sx * (w / 2 + .006), .38 + i * .44, (zF + zB) / 2);   // rusticated ground floor
  add(s, box(w + .1, .1, zF - zB + .1, paint), 0, h + .33, (zF + zB) / 2);
  for (const sx of [-1, 1]) {
    add(s, box(.24, h + .3, .2, paint), sx * (w / 2 - .06), (h + .3) / 2, zF + .03);                    // the pilasters
    add(s, box(.3, .3, .28, paint), sx * (w / 2 - .06), h + .12, zF + .06);                              // the consoles
    sash(s, sx * .9, h + .3 + .95, zF + .02, .56, .9, paint);
    sash(s, sx * (w / 2 + .01), h + .3 + .95, -1.9, .5, .8, paint, sx > 0 ? "x" : "-x");
  }
  // the bow window, right of the door: a panelled stall riser, curved glass on its bars, a lead-covered head
  const bow = add(s, new THREE.Group(), 1.0, 0, zF); bow.scale.z = .58;
  add(bow, new THREE.Mesh(new THREE.CylinderGeometry(.66, .66, .5, 16, 1, false, -Math.PI / 2, Math.PI), mat(trim)), 0, .3, 0);
  add(bow, new THREE.Mesh(new THREE.CylinderGeometry(.64, .64, 1.4, 16, 1, true, -Math.PI / 2, Math.PI), mat("#6E828A", { side: THREE.DoubleSide })), 0, 1.25, 0);
  for (let i = 1; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; add(bow, box(.035, 1.4, .035, paint), Math.sin(a) * .65, 1.25, Math.cos(a) * .65); }
  add(bow, new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .14, 16, 1, false, -Math.PI / 2, Math.PI), mat("#747C80")), 0, 2.02, 0);
  // the striped awning over the pavement, run out from under the cornice
  const aw = add(s, new THREE.Group(), 0, h + .32, zF + .16); aw.rotation.x = .42;
  for (let i = 0; i < 12; i++) add(aw, box((w - .3) / 12, .03, .9, i % 2 ? "#2F5A44" : "#EDE6D2"), -(w - .3) / 2 + (i + .5) * (w - .3) / 12, 0, .45);
  for (let i = 0; i < 12; i++) add(aw, box((w - .3) / 12 - .02, .16, .02, i % 2 ? "#2F5A44" : "#EDE6D2"), -(w - .3) / 2 + (i + .5) * (w - .3) / 12, -.06, .9).rotation.x = -.42;
  // the shaped gable over the front, and a red tile roof whose ridge runs back from it
  const gs = new THREE.Shape([new THREE.Vector2(-1.84, 0), new THREE.Vector2(1.84, 0), new THREE.Vector2(1.84, .38), new THREE.Vector2(1.42, .38), new THREE.Vector2(1.42, .58)]);
  gs.quadraticCurveTo(1.38, 1.0, .74, 1.02); gs.lineTo(.74, 1.22); gs.absarc(0, 1.22, .74, 0, Math.PI, false);
  gs.lineTo(-.74, 1.02); gs.quadraticCurveTo(-1.38, 1.0, -1.42, .58); gs.lineTo(-1.42, .38); gs.lineTo(-1.84, .38);
  const gable = add(s, new THREE.Mesh(new THREE.ExtrudeGeometry(gs, { depth: .22, bevelEnabled: false, curveSegments: 8 }), mat(paint)), 0, top, zF - .06);
  void gable;
  add(s, cyl(.26, .26, .05, "#C9B89A", 14), 0, top + 1.24, zF + .17).rotation.x = Math.PI / 2;           // the roundel in the gable
  add(s, box(.12, .34, .12, paint), 0, top + 2.12, zF + .05);                                              // the finial
  const turned = add(s, new THREE.Group(), 0, 0, (zF + zU) / 2); turned.rotation.y = Math.PI / 2;
  gableRoof(turned, zF - zU, w, top, 1.2, COVERS.plainTile, { over: .05, ridge: "#8A3E2A" });
  add(s, gableEnd(w, 1.2, .16, stucco), 0, top, zU + .08).rotation.y = 0;
  stack(s, 1.3, top + .3, -1.6, 1.5, "#B49C7E", 2);
  g.add(solid(s));
  const f = fascia(g, w - .5, h, zF + .1, trim, "TEA ROOM", LD.brass, paint);
  return { ...f, zBack: zR, floor: .07 };
}

/**
 * The market hall: green cast-iron columns with their capitals and spandrel brackets, a lattice girder each way, a
 * glass roof on iron glazing bars with a raised lantern down the ridge, and a fan of iron in each open gable. A cold
 * hall, open on every side.
 */
function marketHall(g: P) {
  const s = new THREE.Group(), iron = "#2F4A3E", w = 4.3, d = 2.9, h = 2.45;
  add(s, box(4.4, .07, 3.0, "#B0A898"), 0, .035, 0);
  const posts: [number, number][] = [[-1.95, -1.25], [0, -1.25], [1.95, -1.25], [-1.95, 1.25], [1.95, 1.25]];
  for (const [x, z] of posts) {
    add(s, box(.30, .22, .30, "#8A8478"), x, .11, z);
    add(s, cyl(.075, .10, h - .2, iron, 10), x, .2 + (h - .2) / 2, z);
    add(s, cyl(.17, .09, .16, iron, 10), x, h - .06, z);
    for (const dz of [-.08, .08]) for (let i = 0; i < 3; i++) add(s, box(.02, .06, .02, iron), x + (i - 1) * .06, .5 + i * .02, z + dz);
    for (const dx of [-1, 1]) if (Math.abs(x + dx * .4) < 2.1) {                                          // the spandrel brackets
      const arc = add(s, new THREE.Mesh(new THREE.TorusGeometry(.32, .025, 4, 10, Math.PI / 2), mat(iron)), x + dx * .32, h - .32, z);
      arc.rotation.z = dx > 0 ? Math.PI / 2 : 0;
    }
  }
  for (const z of [-1.25, 1.25]) {
    if (z < 0) add(s, box(w, .14, .16, iron), 0, h + .08, z);
    add(s, box(w, .08, .10, iron), 0, h + .5, z);
    for (let i = 0; i < 14; i++) bar(s, V(-w / 2 + .15 + i * .3, h + .16, z), V(-w / 2 + .3 + i * .3, h + .46, z), .035, .04, iron);
  }
  for (const x of [-1.95, 0, 1.95]) add(s, box(.10, .10, d, iron), x, h + .5, 0);
  gableRoof(s, w, d, h + .54, .82, { colour: "#A9C8D0", line: iron, every: .3, kind: "batten", thick: .05 }, { over: .06, ridge: iron });
  // the lantern down the ridge: louvred sides and its own shallow glass roof
  for (const sz of [-1, 1]) { add(s, box(2.8, .26, .04, "#6E8A86"), 0, h + 1.47, sz * .3); for (let i = 0; i < 10; i++) add(s, box(.03, .28, .05, iron), -1.35 + i * .3, h + 1.47, sz * .3); }
  gableRoof(s, 2.8, .6, h + 1.6, .16, { colour: "#A9C8D0", line: iron, every: .3, kind: "batten", thick: .04 }, { over: .1, ridge: iron });
  // a fan of iron in each open gable
  for (const sx of [-1, 1]) {
    const x = sx * (w / 2 + .1);
    add(s, box(.06, .08, d, iron), x, h + .54, 0);
    for (let i = 0; i <= 6; i++) { const a = Math.PI * i / 6; bar(s, V(x, h + .56, 0), V(x, h + .56 + Math.sin(a) * .74, Math.cos(a) * 1.3), .03, .03, iron); }
    const rib = add(s, new THREE.Mesh(new THREE.TorusGeometry(1.0, .03, 4, 14, Math.PI), mat(iron)), x, h + .56, 0); rib.rotation.y = Math.PI / 2; rib.scale.set(1, .74, 1.3);
  }
  g.add(solid(s));
  const beam = add(g, box(w, .14, .18, iron), 0, h + .08, 1.25); beam.name = "front-beam";
  return { beam, y: h + .08, zFront: 1.25 };
}

/**
 * The pie and mash shop: a narrow shop of two floors in yellow stock brick, the ground floor in green and white
 * glazed tile with the marble counter at the window, gauged red arches over the upper sashes, and a flat lead roof
 * behind a parapet between two party-wall stacks, which is how a London terrace shop reads from above.
 */
function pieShopFront(g: P) {
  const s = new THREE.Group(), stock = "#BBA67E", tileG = "#2E6A4A", tileW = "#E6EAE2", stone = "#DAD2C0";
  const w = 3.8, zB = -3.9, zR = -1.8, zF = .9, h = 2.2, up = 2.0, top = h + .3 + up;
  room(s, w, zB, zR, zF, top, stock, "#C9B48A", h + .3);
  add(s, box(w, up, zF - zR, stock), 0, h + .3 + up / 2, (zF + zR) / 2);
  for (const sx of [-1, 1]) {
    add(s, box(.30, h + .3, .24, tileG), sx * (w / 2 - .05), (h + .3) / 2, zF + .02);
    for (let i = 0; i < 6; i++) add(s, box(.31, .05, .25, tileW), sx * (w / 2 - .05), .3 + i * .36, zF + .02);   // the white bands in the green
    add(s, box(.03, 1.0, zF - zB + .02, tileG), sx * (w / 2 + .012), .5, (zF + zB) / 2);
    add(s, box(.035, .06, zF - zB + .03, tileW), sx * (w / 2 + .014), 1.02, (zF + zB) / 2);
  }
  add(s, box(3.0, .66, .03, tileG), -.1, .4, 1.15);                                                        // the tiled front of the counter
  add(s, box(3.0, .05, .035, tileW), -.1, .72, 1.155);
  for (const x of [-1.2, 0, 1.2]) {
    sash(s, x, h + .3 + 1.0, zF + .02, .52, 1.0, stone);
    add(s, box(.66, .18, .06, "#A4523A"), x, h + .3 + 1.6, zF + .03);                                     // the gauged red arch
  }
  add(s, box(w + .08, .1, zF - zB + .08, stone), 0, h + .33, (zF + zB) / 2);
  // the parapet, its coping, and the lead flat behind it with its standing rolls
  for (const sz of [-1, 1]) add(s, box(w, .5, .14, stock), 0, top + .25, sz > 0 ? zF - .07 : zB + .07);
  for (const sx of [-1, 1]) add(s, box(.14, .5, zF - zB, stock), sx * (w / 2 - .07), top + .25, (zF + zB) / 2);
  add(s, box(w + .1, .07, .24, stone), 0, top + .52, zF - .07);
  add(s, box(w - .28, .05, zF - zB - .28, "#7E868A"), 0, top + .04, (zF + zB) / 2);
  for (let i = 0; i < 8; i++) add(s, cyl(.025, .025, zF - zB - .3, "#6A7276", 5), -1.6 + i * .46, top + .09, (zF + zB) / 2).rotation.x = Math.PI / 2;
  for (const sx of [-1, 1]) stack(s, sx * 1.6, top, -1.3, 1.1, stock, 4, .52, 1.0);
  stack(s, 0, top, -3.5, .8, stock, 2);
  g.add(solid(s));
  const f = fascia(g, w - .56, h, zF + .1, tileG, "PIE & MASH", LD.whitewash, stone);
  return { ...f, zBack: zR, floor: .07 };
}

/**
 * The fried fish shop: a two-storey corner shop in dark mill-town brick with blue-brick bands, the door in the
 * cut corner, the coal range standing in the shop window where the street sees it, and a roof of graded Pennine
 * stone slate. The range's flue is the stack at the back, and the smoke comes out of it.
 */
function cornerShop(g: P) {
  const s = new THREE.Group(), brick = "#6E3A2E", blue = "#2E3440", stone = "#CFC6B2";
  // 3.75 wide and set .125 east of the stand's centre, so the Forth Bridge's rays pass west of it
  const w = 3.75, cx = .125, zB = -3.9, zR = -1.8, zF = 1.2, h = 2.2, up = 2.0, top = h + .3 + up, ch = .4, L = -w / 2;
  add(s, box(w - .24, .07, zF - zR, "#8A7E70"), 0, .035, (zF + zR) / 2);
  add(s, box(w, top, zR - zB, brick), 0, top / 2, (zB + zR) / 2);
  add(s, box(.16, h + .3, zF - zR, brick), w / 2 - .08, (h + .3) / 2, (zF + zR) / 2);
  add(s, box(.16, h + .3, zF - ch - zR, brick), L + .08, (h + .3) / 2, (zF - ch + zR) / 2);
  // the cut corner, with the shop door in it under a fanlight
  const cut = add(s, new THREE.Group(), L + ch / 2, 0, zF - ch / 2); cut.rotation.y = -Math.PI / 4;
  add(cut, box(ch * Math.SQRT2, h + .3, .16, brick), 0, (h + .3) / 2, 0);
  add(cut, box(.5, 1.75, .04, "#2A3A30"), 0, .9, .09);
  add(cut, box(.5, .26, .03, "#6E828A"), 0, 1.95, .09);
  // the upper storey follows the corner round
  add(s, prism([[L + ch, zR], [w / 2, zR], [w / 2, zF], [L + ch, zF], [L, zF - ch], [L, zR]], up, brick), 0, h + .3, 0);
  for (const y of [.25, h + .32, top - .1]) add(s, prism([[L - .02, zB - .02], [w / 2 + .02, zB - .02], [w / 2 + .02, zF + .02], [L + ch, zF + .02], [L - .02, zF - ch], [L - .02, zB - .02]], .1, blue), 0, y - .05, 0);
  for (const x of [-.5, .5, 1.5]) sash(s, x, h + .3 + 1.0, zF + .02, .5, .9, stone);
  const up2 = add(s, new THREE.Group(), L + ch / 2 + .03, 0, zF - ch / 2 + .03); up2.rotation.y = -Math.PI / 4;
  sash(up2, 0, h + .3 + 1.0, .02, .34, .9, stone);
  for (const z of [-.6, -2.9]) sash(s, w / 2 + .01, h + .3 + 1.0, z, .5, .9, stone, "x");
  // the shop window: brick piers, a mullion between the range and the slab, and a row of top lights
  for (const x of [.98, w / 2 - .1]) add(s, box(.2, h + .3, .22, brick), x, (h + .3) / 2, zF);   // no pier at the cut corner: the street sees the pan past it
  add(s, box(w - ch, .08, .2, stone), (L + ch + w / 2) / 2, 1.98, zF);
  for (let i = 0; i < 8; i++) add(s, box(.36, .16, .03, "#8FA2A8"), L + ch + .3 + i * .38, 2.1, zF + .02);
  // hipped, as a corner shop is, so the rays from the Forth Bridge behind it pass over the corner
  hipRoof(s, w, zF - zB + .1, top, 1.35, COVERS.stoneFlag, { z: (zF + zB) / 2, ridge: "#5E5448" });
  const flue = stack(s, -1.3, top + .3, -2.7, 1.5, brick, 2);
  add(g, solid(s), cx, 0, 0);
  const f = fascia(g, w - ch - .3, h, zF + .1, LD.oxbloodTile, "FRIED FISH", LD.whitewash, stone, cx + (L + ch + w / 2) / 2);
  const corner = fascia(g, ch * Math.SQRT2 - .1, h, zF - ch / 2 + .07, LD.oxbloodTile, "", LD.whitewash, stone, cx + L + ch / 2 - .07, -Math.PI / 4);
  return { ...f, corner, zBack: zR, floor: .07, flue: V(cx - 1.3, flue + .1, -2.7), cornerAt: V(cx + L + ch / 2 - .12, 0, zF - ch / 2 + .12) };
}

/**
 * The coffee stall: a painted barrow with its boiler, under a cambered red canvas on iron hoops and four stanchions,
 * a scalloped valance with the lettering along it, and the naphtha flare on its own stick at the corner, outside
 * the canvas where a flame belongs.
 */
function coffeeBarrow(g: P) {
  const s = new THREE.Group(), body = "#2E4A3A", line = "#8A2A22", iron = LD.iron;
  add(s, box(2.9, .86, 1.10, body), 0, .58, 0);
  for (const sz of [-1, 1]) { add(s, box(2.8, .04, .02, line), 0, .40, sz * .56); add(s, box(2.8, .04, .02, line), 0, .92, sz * .56); for (const x of [-1.0, 0, 1.0]) add(s, box(.7, .4, .02, "#3A5A48"), x, .66, sz * .56); }
  add(s, box(3.0, .07, 1.20, "#C9BCA0"), 0, 1.03, 0);
  for (const side of [-1, 1]) add(s, cyl(.03, .036, 1.1, LD.oak, 5), 1.74, .56, side * .38).rotation.z = 1.50;
  for (const x of [-1.46, 1.46]) for (const z of [-.56, 1.0]) add(s, cyl(.03, .035, 2.1, iron, 6), x, 1.05, z);
  // the canvas: a shallow arc across the stall on three iron hoops
  const R = 2.13, a = .49;
  const canvas = add(s, new THREE.Mesh(new THREE.CylinderGeometry(R, R, 3.3, 14, 1, true, Math.PI / 2 - a, 2 * a), mat(COVERS.redCanvas.colour, { side: THREE.DoubleSide })), 0, 2.35 - R, .22);
  canvas.rotation.z = Math.PI / 2;
  for (const x of [-1.5, 0, 1.5]) { const hoop = add(s, new THREE.Mesh(new THREE.TorusGeometry(R - .02, .018, 4, 12, 2 * a), mat(iron)), x, 2.35 - R, .22); hoop.rotation.set(0, Math.PI / 2, Math.PI / 2 - a); }
  for (let i = 0; i < 6; i++) { const seam = add(s, new THREE.Mesh(new THREE.CylinderGeometry(R + .005, R + .005, .03, 14, 1, true, Math.PI / 2 - a, 2 * a), mat(COVERS.redCanvas.line, { side: THREE.DoubleSide })), -1.4 + i * .56, 2.35 - R, .22); seam.rotation.z = Math.PI / 2; }
  for (let i = 0; i < 11; i++) add(s, cyl(.075, .075, .02, "#EDE2C8", 10, ), -1.5 + i * .3, 1.84, 1.02).rotation.x = Math.PI / 2;   // the scallops
  // the naphtha flare's stick at the corner
  add(s, cyl(.026, .03, 2.2, iron, 5), -1.92, 1.1, .92);
  add(s, box(.3, .03, .03, iron), -1.78, 2.2, .92);
  g.add(solid(s));
  const beam = add(g, box(3.3, .18, .06, "#EDE2C8"), 0, 1.95, 1.03); beam.name = "front-beam";
  sign(g, "HOT COFFEE", 1.5, .14, 0, 1.95, 1.07, LD.oxbloodTile, "#EDE2C8");
  return { beam, y: 1.94, zFront: 1.03, flare: V(-1.92, 2.26, .92) };
}

/**
 * The seamen's kitchen: the back room of a Shadwell boarding house, a lean-to of soot-black stock brick with small
 * barred windows and a tarred felt roof, against the tall back of the house with its own small windows and stacks.
 * The street side is a wide doorway under a timber lintel, and the cooking fire is at the door.
 */
function seamensRoom(g: P) {
  const s = new THREE.Group(), soot = "#5C5248", dark = "#3E3830", w = 3.8, zB = -3.9, zR = -1.8, zF = .9, hF = 2.2, hB = 2.95, hH = 4.3;
  add(s, box(w - .24, .07, zF - zR, "#6E685E"), 0, .035, (zF + zR) / 2);
  add(s, box(w, hH, zR - zB, soot), 0, hH / 2, (zB + zR) / 2);
  add(s, box(w + .1, .08, zR - zB + .1, "#8A8276"), 0, hH, (zB + zR) / 2);
  add(s, box(w - .2, .05, zR - zB - .2, "#2A2624"), 0, hH - .02, (zB + zR) / 2);
  for (const x of [-1.0, 1.0]) {                                                                          // the house's back windows over the lean-to
    sash(s, x, 3.7, zR + .02, .38, .48, "#8A7A66");
    for (let i = 0; i < 3; i++) add(s, box(.02, .5, .02, LD.iron), x - .1 + i * .1, 3.7, zR + .07);
  }
  for (const sx of [-1, 1]) {
    add(s, flank([[zR, 0], [zF, 0], [zF, hF], [zR, hB]], .16, soot), sx * (w / 2 - .08), 0, 0);
    const win = add(s, new THREE.Group(), sx * (w / 2 + .01), 1.35, -.45); win.rotation.y = sx * Math.PI / 2;
    add(win, box(.52, .46, .05, dark)); add(win, box(.42, .36, .04, "#4E5E66"), 0, 0, .02);
    for (let i = 0; i < 3; i++) add(win, box(.02, .4, .03, LD.iron), -.12 + i * .12, 0, .05);
    add(win, box(.62, .08, .1, "#8A8276"), 0, .28, .03);
    sash(s, sx * (w / 2 + .01), 3.2, -2.9, .38, .5, "#8A7A66", sx > 0 ? "x" : "-x");
  }
  rubble(s, -1.9, 1.9, 2.4, 4.2, zR + .015, dark, 16, 3);
  leanRoof(s, w, zR, hB, zF + .12, hF, COVERS.tarFelt, .16);
  for (const sx of [-1, 1]) stack(s, sx * 1.35, hH, -2.9, 1.0, soot, 3);
  g.add(solid(s));
  const beam = add(g, box(w, .22, .18, LD.oakSmoke), 0, hF - .13, zF); beam.name = "front-beam";
  sign(g, "SEAMEN'S HOME", 2.0, .18, 0, hF - .13, zF + .1, LD.cream, "#3A4A5E");
  return { beam, y: hF - .16, zFront: zF, zBack: zR, floor: .07 };
}

/**
 * The hop-pickers' cookhouse: an olive tarpaulin over a ridge pole on its uprights, pegged to a rail front and back,
 * with the fire under its front edge; a corrugated-iron hopper hut behind on the left and the ends of three hop rows
 * behind on the right, poles, wirework and bines. The rows are kept low enough that the market's rays pass over them.
 */
function hopFly(g: P) {
  const s = new THREE.Group(), pole = "#6E5236", zR = -.2;
  for (const sx of [-1, 1]) {
    add(s, cyl(.05, .06, 2.85, pole, 6), sx * 2.05, 1.425, zR);
    for (const z of [-1.5, 1.1]) add(s, cyl(.04, .05, 2.15, pole, 6), sx * 2.05, 1.075, z);
  }
  add(s, cyl(.045, .045, 4.4, pole, 6), 0, 2.85, zR).rotation.z = Math.PI / 2;
  add(s, box(4.3, .1, .1, pole), 0, 2.15, -1.5);
  gableRoof(s, 4.3, 2.6, 2.15, .7, COVERS.tarpaulin, { z: zR, over: .12, ridge: "#5E5A3C" });
  add(s, box(.7, .02, .6, "#8A8458"), -1.0, 2.62, .35).rotation.x = .5;                                  // a patch
  // the hopper hut: corrugated iron on a timber frame, a curved roof, a door and its number
  const hut = add(s, new THREE.Group(), -1.3, 0, -2.55);
  add(hut, box(1.7, 1.45, 1.3, "#8E9290"), 0, .725, 0);
  for (let i = 0; i < 14; i++) add(hut, box(.03, 1.45, 1.32, "#7A7E7C"), -.8 + i * .123, .725, 0);
  const roof = add(hut, new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, 1.84, 12, 1, false, -Math.PI / 2, Math.PI), mat("#7E8280")), 0, 1.45, 0); roof.rotation.z = Math.PI / 2; roof.scale.set(1, 1, .5);
  add(hut, box(.5, 1.1, .04, "#4A3A2C"), .35, .55, .67);
  add(hut, box(.2, .14, .02, "#E9E2CC"), .35, 1.2, .69);
  // the ends of three hop rows: poles, the wirework, strings and bines
  for (let r = 0; r < 3; r++) {
    const z = -2.2 - r * .6;
    for (const x of [.3, 1.15, 2.0]) add(s, cyl(.035, .045, 2.25, "#7A6448", 5), x, 1.125, z);
    add(s, box(1.8, .02, .02, "#3A3A3A"), 1.15, 2.22, z);
    for (let i = 0; i < 5; i++) {
      const x = .35 + i * .4, lean = (i % 2 ? .12 : -.12);
      strut(s, V(x, 0, z), V(x + lean, 2.2, z), .012, "#B4A47E", 4);
      for (let k = 0; k < 5; k++) add(s, ball(.07, k % 2 ? "#6E8A42" : "#5E7A38", 5), x + lean * (.3 + k * .15), .6 + k * .32, z).scale.set(.8, 1.3, .8);
    }
  }
  g.add(solid(s));
  const beam = add(g, box(4.3, .1, .1, pole), 0, 2.15, 1.1); beam.name = "front-beam";
  return { beam, y: 2.18, zFront: 1.1 };
}

/**
 * The dale dairy: a long low range of grey limestone rubble with dressed quoins and a graded slate roof on stone
 * verges, its working side open under one heavy timber lintel, and a low door in the stone at the end. No chimney:
 * a dairy is kept cold.
 */
function dairyRange(g: P) {
  const s = new THREE.Group(), lime = "#A9A597", quoin = "#CDC9BA", dark = "#8E8A7E", w = 4.2, zB = -3.9, zR = -1.8, zF = .9, h = 2.15;
  room(s, w, zB, zR, zF, h, lime, "#8A8A80");
  add(s, box(.58, h, .22, lime), -w / 2 + .29, h / 2, zF - .02);                                          // the stone end with the low door
  add(s, box(.2, h, .22, lime), w / 2 - .1, h / 2, zF - .02);
  add(s, box(.40, 1.12, .04, "#3E3226"), -w / 2 + .3, .56, zF + .1);
  add(s, box(.54, .14, .1, quoin), -w / 2 + .3, 1.2, zF + .1);
  for (const [x, z, fx, fz] of [[-w / 2, zF + .09, -1, 1], [w / 2, zF + .09, 1, 1], [-w / 2, zB, -1, -1], [w / 2, zB, 1, -1]] as [number, number, number, number][]) quoins(s, x, z, h, quoin, fx, fz);
  for (const sx of [-1, 1]) rubble(s, sx * (w / 2 + .012), sx * (w / 2 + .012), .2, h - .1, 0, dark, 0);
  for (const sx of [-1, 1]) for (let i = 0; i < 14; i++) {
    const z = zB + .3 + (i % 7) * .62, y = .3 + Math.floor(i / 7) * .9 + (i % 3) * .18;
    add(s, box(.03, .12, .24, i % 2 ? dark : "#B8B4A6"), sx * (w / 2 + .012), y, z);
  }
  rubble(s, -2.05, -1.55, .2, 1.9, zF + .1, dark, 5, 7);
  const turnedWin = add(s, new THREE.Group(), w / 2 + .01, 1.3, -2.8); turnedWin.rotation.y = Math.PI / 2;     // the dairy's slatted north light
  add(turnedWin, box(.6, .44, .05, quoin)); for (let i = 0; i < 5; i++) add(turnedWin, box(.5, .03, .04, "#6E6A60"), 0, -.16 + i * .08, .03);
  gableRoof(s, w, zF - zB, h, 1.25, COVERS.gradedSlate, { z: (zF + zB) / 2, over: .16, ends: lime, ridge: "#9A968A", verge: .16 });
  g.add(solid(s));
  const beam = add(g, box(3.5, .24, .22, "#5A4632"), .2, h - .12, zF); beam.name = "front-beam";
  return { beam, y: h - .16, zFront: zF, zBack: zR, floor: .07 };
}

/**
 * The Cornish bakehouse: granite rubble with dressed quoins and a granite lintel over the open front, slate hung on
 * the weather flank, a steep roof of small dark scantle slate, and the oven's own tall stack rising through the
 * back slope over the oven.
 */
function graniteBakehouse(g: P) {
  const s = new THREE.Group(), granite = "#8E8C86", dressed = "#AAA8A0", speck = "#74726C", w = 4.2, zB = -3.9, zR = -1.8, zF = .9, h = 2.3;
  room(s, w, zB, zR, zF, h, granite, "#7E7A72");
  for (const sx of [-1, 1]) add(s, box(.16, h, .22, dressed), sx * (w / 2 - .08), h / 2, zF - .04);   // slim dressed jambs: the oven is seen past them
  for (const [x, fx] of [[-w / 2, -1], [w / 2, 1]] as [number, number][]) quoins(s, x, zB, h, dressed, fx, -1);
  rubble(s, -1.9, 1.9, .3, 2.1, zB - .01, speck, 12, 5);
  for (let i = 0; i < 9; i++) add(s, box(.03, .03, zF - zB + .02, "#4A5054"), -w / 2 - .016, .25 + i * .24, (zF + zB) / 2);   // slate hung on the weather side
  add(s, box(.02, 2.2, zF - zB, "#5E6468"), -w / 2 - .012, 1.1, (zF + zB) / 2);
  for (let i = 0; i < 10; i++) add(s, box(.03, .1, .16, i % 2 ? speck : dressed), w / 2 + .014, .3 + (i % 5) * .4, -3.4 + i * .5);
  gableRoof(s, w, zF - zB, h, 1.55, COVERS.scantle, { z: (zF + zB) / 2, over: .14, ends: granite, ridge: "#6E7276" });
  // the oven's stack, granite to the roof and brick above it
  add(s, box(.86, 2.6, .86, granite), 1.15, h + 1.3, -2.55);
  add(s, box(.72, .9, .72, "#9A5A42"), 1.15, h + 3.05, -2.55);
  add(s, box(.84, .1, .84, dressed), 1.15, h + 3.55, -2.55);
  g.add(solid(s));
  const beam = add(g, box(w - .6, .26, .26, dressed), 0, h - .13, zF); beam.name = "front-beam";
  return { beam, y: h - .18, zFront: zF, zBack: zR, floor: .07, flue: V(1.15, h + 3.8, -2.55) };
}

/**
 * The cockle shelter on the sand: grey driftwood posts leaning a little, a driftwood rail front and back, an old tan
 * sail lashed over them with a patch in it, and a windbreak of washed-up planks along the back and the weather end.
 */
function beachShelter(g: P) {
  const s = new THREE.Group(), drift = "#A09A8C", dark = "#7E786C";
  // kept as low as the old shade, 2.2 at the back, so the bakehouse's rays pass over the sail
  const posts: [number, number, number, number, number][] = [[-1.75, -1.2, 2.14, .05, -.03], [0, -1.25, 2.18, -.04, 0], [1.75, -1.2, 2.12, -.06, .02], [-1.95, 1.0, 1.92, .04, .03], [1.95, 1.0, 1.9, -.05, .02]];
  for (const [x, z, h, lx, lz] of posts) { strut(s, V(x, 0, z), V(x + lx, h, z + lz), .065, drift, 6); add(s, ball(.08, dark, 5), x + lx * .5, h * .55, z + lz * .5).scale.set(1, .6, 1); }
  strut(s, V(-2.0, 2.14, -1.22), V(2.0, 2.1, -1.18), .06, drift, 6);
  // the sail, sloping from the back rail to the front log, lashed at the corners
  const sail = add(s, new THREE.Group(), 0, 2.06, -.1); sail.rotation.x = Math.atan2(.24, 2.3);
  // a tanned sail, sagging between its lashings, with a paler patch sewn into it and its bolt rope round the edge
  const sagged = (w: number, d: number, sag: number, cx = 0, cz = 0) => {
    const geo = new THREE.PlaneGeometry(w, d, 10, 6); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i) + cx, z = pos.getZ(i) + cz; pos.setY(i, -sag * (1 - (2 * x / 4.1) ** 2) * (1 - (2 * z / 2.46) ** 2)); }
    geo.computeVertexNormals(); return geo;
  };
  add(sail, new THREE.Mesh(sagged(4.1, 2.46, .16), mat(COVERS.sailcloth.colour, { side: THREE.DoubleSide })), 0, 0, 0);
  add(sail, new THREE.Mesh(sagged(1.0, .8, .16, .9, .3), mat("#C8A87A", { side: THREE.DoubleSide })), .9, .012, .3);
  for (const x of [-1.37, 0, 1.37]) add(sail, new THREE.Mesh(sagged(.03, 2.4, .16, x, 0), mat(COVERS.sailcloth.line, { side: THREE.DoubleSide })), x, .01, 0);   // the cloths' seams
  add(sail, box(4.12, .03, .05, "#E4DCC8"), 0, .02, 1.22);
  for (const x of [-2.0, 2.0]) for (const z of [-1.2, 1.2]) add(sail, cyl(.02, .02, .14, "#C9BCA0", 4), x, -.05, z);
  // the windbreak of planks
  for (let i = 0; i < 11; i++) { const p = add(s, box(.34, .9 + (i % 3) * .18, .05, i % 2 ? drift : dark), -1.8 + i * .36, .45 + (i % 3) * .09, -1.3); p.rotation.z = (i % 2 ? .05 : -.04); }
  for (let i = 0; i < 4; i++) { const p = add(s, box(.05, .8 + (i % 2) * .2, .34, i % 2 ? dark : drift), -2.02, .42, -1.0 + i * .34); p.rotation.x = (i % 2 ? .05 : -.05); }
  g.add(solid(s));
  const beam = add(g, cyl(.075, .085, 4.1, drift, 7), 0, 1.9, 1.0); beam.rotation.z = Math.PI / 2 + .01; beam.name = "front-beam";
  return { beam, y: 1.9, zFront: 1.0 };
}

/**
 * The curing yard's bothy on the Angus shore: a low house of red sandstone rubble with quoins, a door and one small
 * window, a stack on the west gable, and a thick heather thatch roped over the ridge with stones hung on the ropes
 * against the sea wind. Under its eave is the rail the tied fish and the lamps hang from.
 */
function bothy(g: P) {
  // It stands on the west side of the yard: the oat mill's rays pass west of it and the distillery's east of it.
  const s = new THREE.Group(), sand = "#9A5E4A", dark = "#7E4A3A", quoin = "#B4745C", w = 2.65, cx = -.725, zB = -3.45, zF = -1.6, h = 1.9;
  add(s, box(w, h, zF - zB, sand), 0, h / 2, (zB + zF) / 2);
  rubble(s, -1.15, 1.15, .2, 1.75, zF + .01, dark, 14, 9);
  for (const [x, fx] of [[-w / 2, -1], [w / 2, 1]] as [number, number][]) quoins(s, x, zF, h, quoin, fx, 1);
  add(s, box(.6, 1.35, .05, "#3E2E22"), -.45, .68, zF + .03);
  add(s, box(.78, .16, .1, quoin), -.45, 1.43, zF + .05);
  sash(s, .72, 1.12, zF + .02, .38, .38, quoin);
  gableRoof(s, w, zF - zB, h, 1.3, COVERS.thatch, { z: (zB + zF) / 2, over: .15, ends: sand, ridge: "#8A7448" });
  const e = (zF - zB) / 2 + .15, dip = .15 * 1.3 / ((zF - zB) / 2);                                             // the eave edge, and how far it falls below the wall head
  for (const sz of [-1, 1]) add(s, cyl(.15, .15, w + .3, "#7A6444", 8), 0, h - dip + .02, (zB + zF) / 2 + sz * (e - .08)).rotation.z = Math.PI / 2;   // the rounded eaves
  add(s, cyl(.2, .2, w + .2, "#6E5A3A", 8), 0, h + 1.32, (zB + zF) / 2).rotation.z = Math.PI / 2;                // the ridge roll
  for (let i = 0; i < 5; i++) {                                                                                   // the ropes and their stones
    const x = -1.0 + i * .5, zm = (zB + zF) / 2;
    for (const sz of [-1, 1]) {
      strut(s, V(x, h + 1.45, zm), V(x, h - dip + .06, zm + sz * (e + .02)), .03, "#3E3222", 4);
      add(s, ball(.1, "#8A8680", 6), x, h - dip - .3, zm + sz * (e + .05)).scale.set(1, .8, 1);
      add(s, cyl(.01, .01, .22, "#5A4A32", 3), x, h - dip - .12, zm + sz * (e + .04));
    }
  }
  stack(s, -w / 2 + .3, h + .6, (zB + zF) / 2, 1.3, sand, 1, .5, .5);
  add(g, solid(s), cx, 0, 0);
  // the rail under the eave, run out on iron brackets past the gables so the lamps hang clear of the walls
  const beam = add(g, box(w + .5, .1, .1, LD.oak), cx, 1.5, -1.36); beam.name = "front-beam";
  for (const x of [cx - w / 2 + .05, cx + w / 2 - .05]) add(g, box(.06, .06, .3, LD.iron), x, 1.5, -1.5);
  return { beam, y: 1.53, zFront: -1.36, xs: [cx - w / 2 - .1, cx + w / 2 + .1] };
}

/**
 * The distillery: a long whitewashed range, harled, with dressed grey margins round the openings and at the
 * corners, a Speyside slate roof with a louvred ridge vent, and the kiln rising out of its back at the east end
 * under a steep slate pyramid that carries the pagoda vent. The malting floor is the open front.
 */
function distilleryRange(g: P) {
  const s = new THREE.Group(), harl = "#ECE7DA", margin = "#8A867C", w = 4.4, zB = -3.9, zR = -1.8, zF = .9, h = 2.3;
  room(s, w, zB, zR, zF, h, harl, "#9A948A");
  for (const sx of [-1, 1]) {
    add(s, box(.3, h, .26, margin), sx * (w / 2 - .15), h / 2, zF);
    const win = add(s, new THREE.Group(), sx * (w / 2 + .01), 1.25, -1.0); win.rotation.y = sx * Math.PI / 2;
    add(win, box(.62, .82, .05, margin)); add(win, box(.46, .66, .04, "#4E5E66"), 0, 0, .02);
    for (let i = 0; i < 2; i++) add(win, box(.46, .03, .05, "#E9E4D6"), 0, -.11 + i * .22, .03);
  }
  for (const [x, z, fx, fz] of [[-w / 2, zB, -1, -1], [w / 2, zB, 1, -1]] as [number, number, number, number][]) quoins(s, x, z, h, margin, fx, fz);
  gableRoof(s, w, zF - zB, h, 1.2, COVERS.highlandSlate, { z: (zF + zB) / 2, over: .16, ends: harl, ridge: "#3E464A" });
  for (let i = 0; i < 3; i++) { add(s, box(.5, .24, .34, harl), -1.6 + i * .7, h + 1.3, (zF + zB) / 2); add(s, box(.62, .06, .5, "#4A555A"), -1.6 + i * .7, h + 1.45, (zF + zB) / 2); }
  // the kiln: a tall harled block through the back of the range, with its pyramid roof
  add(s, box(1.6, 3.9, 1.6, harl), 1.45, 1.95, -2.8);
  for (const [x, z, fx, fz] of [[.65, -2.0, -1, 1], [2.25, -2.0, 1, 1]] as [number, number, number, number][]) quoins(s, x, z, 3.9, margin, fx, fz);
  add(s, box(1.76, .1, 1.76, margin), 1.45, 3.9, -2.8);
  add(s, cone(1.22, .72, COVERS.highlandSlate.colour, 4), 1.45, 4.3, -2.8).rotation.y = Math.PI / 4;
  g.add(solid(s));
  const beam = add(g, box(w - .5, .24, .22, margin), 0, h - .12, zF); beam.name = "front-beam";
  return { beam, y: h - .16, zFront: zF, zBack: zR, floor: .07, pagoda: V(1.45, 4.56, -2.8) };
}

/**
 * The pastrycook's shop behind the pastry board: a one-storey shop of stock brick with a painted timber front in
 * deep blue, its pilasters and fascia picked out in cream, and a hipped roof of green Westmorland slate. It is the
 * only shop of its kind on the table and shares no wall and roof with any room's building.
 */
function pastryShop(g: P) {
  const s = new THREE.Group(), stock = "#B4A07C", paint = "#2E3E5E", cream = "#E9DFC8", w = 3.6, zB = -3.6, zR = -1.7, zF = .8, h = 2.2;
  room(s, w, zB, zR, zF, h + .3, stock, "#A89C88");
  for (const sx of [-1, 1]) {
    add(s, box(.26, h + .3, .2, paint), sx * (w / 2 - .06), (h + .3) / 2, zF + .02);
    add(s, box(.32, .12, .26, cream), sx * (w / 2 - .06), h + .36, zF + .02);
    for (let i = 0; i < 3; i++) add(s, box(.03, .6, .21, cream), sx * (w / 2 - .06), .5 + i * .7, zF + .03);
  }
  add(s, box(w + .12, .12, zF - zB + .12, cream), 0, h + .36, (zF + zB) / 2);
  hipRoof(s, w + .24, zF - zB + .24, h + .42, 1.0, { colour: "#5E6E66", line: "#4A5852", every: .2, kind: "line" }, { z: (zF + zB) / 2, ridge: "#7E868A" });
  stack(s, -1.2, h + .6, -2.6, 1.0, stock, 2);
  g.add(solid(s));
  const f = fascia(g, w - .52, h, zF + .1, paint, "PASTRYCOOK", cream, cream);
  return { ...f, zBack: zR, floor: .07 };
}

// ---------- the thirteen room stands ----------

/**
 * The public house, Westminster: one sirloin a week carved at the counter, a batter pudding in the same tin, a
 * raised pork pie and a wedge of cheese for everyone who is not having the beef, and a hand pump on the bar.
 * The click draws the knife and a slice separates from the joint onto the plate.
 */
export function pub(): P {
  const g = group();
  const sh = publicHouse(g);
  lamps(g, sh.y, sh.zFront, [-1.5, 1.5], .85);
  // the etched glass screen and the tiled dado along the back of the bar
  for (let i = 0; i < 3; i++) add(g, box(.92, .86, .04, LD.glass), -1.2 + i * 1.2, 1.46, sh.zBack + .10);
  for (let i = 0; i < 8; i++) add(g, box(.42, .52, .03, i % 2 ? LD.oxbloodTile : "#8A3A30"), -1.5 + i * .44, .40, sh.zBack + .10);
  // the mahogany counter across the bay, the brass rail, and the hand pumps
  add(g, box(3.2, .82, .62, LD.oakSmoke), -.1, .41, .74);
  const bar = add(g, box(3.3, .07, .78, "#7A4A30"), -.1, .86, .74); void bar;
  add(g, cyl(.022, .022, 3.2, LD.brass, 6), -.1, .30, 1.06).rotation.z = Math.PI / 2;
  for (let i = 0; i < 3; i++) { add(g, cyl(.045, .05, .34, LD.brass, 8), .85 + i * .24, 1.06, .62); add(g, box(.05, .04, .20, LD.oak), .85 + i * .24, 1.24, .70); }
  // the joint on the board: a sirloin with a fat cap, the slice that comes off it, the plate it falls onto
  const boardTop = .90;
  add(g, box(.86, .05, .52, "#A37A4F"), -1.05, boardTop, .78);
  const joint = add(g, new THREE.Group(), -1.05, boardTop + .18, .78); joint.name = "pub-joint";
  add(joint, box(.62, .30, .40, LD.beef), 0, 0, 0);
  add(joint, box(.63, .08, .41, "#E4D6A8"), 0, .19, 0);                                  // the fat cap
  add(joint, cyl(.035, .035, .44, "#D9CFB0", 8), -.34, -.02, 0).rotation.z = Math.PI / 2;   // the bone
  const plate = add(g, cyl(.20, .17, .035, LD.cream, 16), -.26, boardTop + .04, 1.06); plate.name = "pub-plate";
  const slice = add(g, new THREE.Group(), -.58, boardTop + .22, 1.02); slice.name = "pub-slice";
  add(slice, box(.06, .27, .38, LD.beef), 0, 0, 0);
  add(slice, box(.065, .07, .39, "#E4D6A8"), 0, .17, 0);
  add(slice, box(.062, .19, .27, "#A8443C"), .002, -.02, 0);                             // the pink inside of the cut
  // the batter pudding in its tin, the pork pie under its crust, the cheese and the pickles
  const tin = add(g, new THREE.Group(), .22, boardTop + .05, .80); tin.name = "pub-tin";
  add(tin, box(.54, .07, .40, LD.iron), 0, 0, 0);
  for (let i = 0; i < 4; i++) { const p = add(tin, cyl(.10, .085, .13, LD.batter, 10), -.17 + (i % 2) * .22, .09, -.09 + Math.floor(i / 2) * .18); p.userData.foodReaction = "puff"; }
  const pie = add(g, cyl(.19, .19, .22, LD.crust, 14), .84, boardTop + .11, .86); pie.name = "pub-pie";
  add(g, cyl(.155, .155, .03, "#B4762A", 14), .84, boardTop + .23, .86);
  add(g, box(.30, .16, .22, "#E0C86A"), 1.28, boardTop + .08, .80);                       // the cheese
  add(g, cyl(.10, .09, .16, LD.glass, 10), 1.50, boardTop + .08, .68);
  for (let i = 0; i < 3; i++) add(g, ball(.045, "#D9CFA0", 6), 1.50, boardTop + .04 + i * .05, .68);
  const pints = [0, 1, 2].map((i) => { const p = add(g, cyl(.065, .055, .21, LD.ale, 10), -1.7 + i * .20, boardTop + .10, 1.02); add(g, cyl(.065, .065, .035, "#F2EAD8", 10), -1.7 + i * .20, boardTop + .22, 1.02); return p; });
  // the fire in the grate, the always-on loop, and the settle beside it
  const grate = add(g, new THREE.Group(), -1.62, 0, -.10);
  add(grate, box(.52, .70, .34, LD.iron), 0, .35, 0);
  const flames = Array.from({ length: 4 }, (_, i) => { const f = add(grate, cone(.06, .18, i % 2 ? LD.flameHot : LD.flame, 6), -.14 + i * .09, .30, .04); f.name = "pub-flame"; return f; });
  bench(g, 1.30, -.30, 1.5, -Math.PI / 2, .46, true);
  g.userData.steam = V(-1.05, 1.38, .78);
  // seven people: the carver, two at the settle, two at the counter, the potboy and a walker on the pavement
  const carver = add(g, own(resident("cook")), -1.05, sh.floor, .16) as Figure; carver.rotation.y = 0;
  arms(carver).right.rotation.x = -1.35; arms(carver).left.rotation.x = -1.05;
  const knife = add(arms(carver).right, box(.03, .02, .34, "#B9BCC0"), 0, arms(carver).hand - .04, .16);
  const settle = [seatFigure(g, resident("drinker", false), 1.30, -.68, -Math.PI / 2 + .2, .46), seatFigure(g, resident("clerk", false), 1.30, .10, -Math.PI / 2 - .2, .46)];
  const atBar = [0, 1].map((i) => { const p = add(g, own(resident(i ? "coster" : "shawl", false)), 1.05 + i * .55, sh.floor, 1.40) as Figure; p.rotation.y = Math.PI + i * .2; arms(p).right.rotation.x = -.8; return p; });
  const potboy = add(g, own(resident("server")), .92, sh.floor, .28) as Figure; potboy.rotation.y = -.5;
  arms(potboy).left.rotation.x = -1.4;
  const walker = resident("clerk", false); add(g, walker, -2.4, 0, 2.95);
  const walk = pacer(walker, V(-2.4, 0, 2.95), V(2.4, 0, 3.0), .30, .8);
  const sliceRest = slice.position.clone(), tinRest = tin.position.clone();
  return life(g, "roastPub", [carver, settle[0], atBar[0], atBar[1], settle[1], potboy, walker], (t, k) => {
    sh.board.rotation.x = Math.sin(t * .9) * .06 + beat(k, .3, 1) * Math.sin(t * 6) * .12;   // the sign on its hooks
    flames.forEach((f, i) => { const s = .8 + Math.sin(t * 8 + i * 2) * .2 + beat(k, .1, .8) * .35; f.scale.set(s, s, s); f.rotation.y = t * 1.6 + i; });
    pints.forEach((p, i) => { p.position.y = boardTop + .10 + Math.sin(t * 1.1 + i) * .003; });
    // 1. food first: the knife draws across the joint and the slice separates and falls onto the plate
    const draw = beat(k, 0, .34), fall = k > 0 ? clamp01(((1 - k) - .22) / .46) : 0;
    joint.rotation.z = -draw * .06;
    slice.position.copy(sliceRest);
    slice.position.x = sliceRest.x + draw * .05 + fall * .30;   // away from the joint, onto the plate
    slice.position.y = sliceRest.y - fall * fall * .28;
    slice.position.z = sliceRest.z + fall * .04;
    slice.rotation.z = fall * 1.30; slice.rotation.x = fall * .22;
    tin.position.copy(tinRest); tin.position.z = tinRest.z + beat(k, .18, .74) * .22;
    // 2. the carver's arm follows the knife, 3. a drinker at the settle looks up
    arms(carver).right.rotation.x = -1.35 - draw * .42;
    knife.rotation.x = -draw * .3;
    upper(carver).rotation.y = Math.sin(t * .5) * .05 - draw * .16;
    upper(settle[0]).rotation.y = Math.sin(t * .4) * .08 + beat(k, .45, 1) * .55;
    arms(potboy).left.rotation.x = -1.4 - Math.abs(Math.sin(t * .9)) * .12;
    walk(t);
  });
}

/**
 * The tea room: a bow window on the street, marble-topped tables, a woman on her own at one of them, and a pot
 * that tilts so a thread of tea falls through the strainer into the cup.
 */
export function teaRoom(): P {
  const g = group();
  const sh = teaShop(g);
  lamps(g, sh.y, sh.zFront, [-1.55, .2], .8);   // one each side of the door; the bow window keeps the right-hand end
  // the counter at the back with its urn, and the marble tables: the first in the door under the awning, where the
  // arrival camera reaches it, the second inside behind the bow window
  add(g, box(1.5, .86, .5, LD.oakSmoke), .55, .43, -1.5);
  add(g, box(1.56, .05, .56, "#E9E4D6"), .55, .88, -1.5);
  add(g, cyl(.16, .18, .42, LD.brass, 12), .95, 1.12, -1.5); add(g, cyl(.05, .05, .1, LD.brass, 8), .95, 1.38, -1.5);
  const top = .78, t2 = V(1.05, 0, -.05);
  add(g, cyl(.07, .09, top, LD.iron, 10), -.75, top / 2, 1.06);
  const marble = add(g, cyl(.52, .52, .06, "#E9E4D6", 20), -.75, top, 1.06); void marble;
  add(g, cyl(.07, .09, top, LD.iron, 10), t2.x, top / 2, t2.z);
  add(g, cyl(.46, .46, .06, "#E9E4D6", 18), t2.x, top, t2.z);
  // the pot, the strainer and the cup: the pour that the click makes
  const pot = add(g, new THREE.Group(), -.98, top + .14, 1.06); pot.name = "tearoom-pot";
  add(pot, ball(.155, "#D9CFC0", 12), 0, 0, 0).scale.set(1, .82, 1);
  add(pot, cyl(.10, .13, .04, "#D9CFC0", 12), 0, .12, 0);
  add(pot, cyl(.055, .05, .03, "#D9CFC0", 10), 0, .16, 0);
  const spout = add(pot, cyl(.024, .036, .19, "#D9CFC0", 8), .14, .04, 0); spout.rotation.z = -.85;
  add(pot, new THREE.Mesh(new THREE.TorusGeometry(.07, .018, 5, 12), mat("#D9CFC0")), -.16, .02, 0);
  const cup = add(g, cyl(.085, .065, .09, LD.cream, 14), -.52, top + .07, 1.10); cup.name = "tearoom-cup";
  add(g, cyl(.135, .135, .015, LD.cream, 14), -.52, top + .035, 1.10);
  const strainer = add(g, cyl(.065, .05, .035, LD.brass, 12), -.52, top + .14, 1.10); strainer.name = "tearoom-strainer";
  const brew = add(g, cyl(.072, .072, .02, LD.tea, 14), -.52, top + .09, 1.10);
  const pour = pourFall(g, "tearoom-pour", "#8A4A22", .022);
  const rings = splashRings(g, 3, -.52, top + .11, 1.10, .055, "#A85A2A");
  // bread and butter, scones, and a cake stand: three modelled foods
  for (let i = 0; i < 4; i++) add(g, box(.14, .012, .10, "#F2E4C0"), -.95 + i * .10, top + .04, .84).rotation.y = i * .3;
  for (let i = 0; i < 3; i++) { add(g, cyl(.075, .08, .09, "#D9BC86", 10), t2.x - .13 + (i % 2) * .22, top + .08, t2.z - .12 + Math.floor(i / 2) * .2); add(g, cyl(.07, .07, .015, "#E9D9A8", 10), t2.x - .13 + (i % 2) * .22, top + .13, t2.z - .12 + Math.floor(i / 2) * .2); }
  const stand = add(g, new THREE.Group(), t2.x + .23, top + .02, t2.z + .1);
  add(stand, cyl(.012, .012, .34, LD.brass, 5), 0, .17, 0);
  for (let i = 0; i < 2; i++) { add(stand, cyl(.17 - i * .05, .17 - i * .05, .012, LD.cream, 14), 0, .06 + i * .20, 0); for (let n = 0; n < 4; n++) add(stand, box(.05, .03, .05, n % 2 ? "#E9C4A8" : "#D9A8B4"), Math.cos(n * 1.6) * .09, .08 + i * .20, Math.sin(n * 1.6) * .09); }
  g.userData.steam = V(-.52, top + .22, 1.10);
  // seven people: the waitress, the woman alone, two at the second table, a customer at the counter, a child, a walker
  const waitress = add(g, own(resident("server")), -1.30, sh.floor, .72) as Figure; waitress.rotation.y = -.9;
  arms(waitress).right.rotation.x = -1.25;
  // she sits at the far side of the table, between it and the window, so she never stands between the pot and
  // the visitor: a bystander is behind the food, never in front of it
  const alone = seatFigure(g, resident("lady", false), -.75, .40, 0, .46);
  add(g, cyl(.16, .17, .46, LD.oak, 10), -.75, .23, .28);
  // the pair at the second table, one each side of it, behind the bow window
  const pair = [seatFigure(g, resident("shawl", false), t2.x - .62, t2.z, Math.PI / 2, .46), seatFigure(g, resident("clerk", false), t2.x + .62, t2.z, -Math.PI / 2, .46)];
  for (const [x, a] of [[t2.x - .62, Math.PI / 2], [t2.x + .62, -Math.PI / 2]]) add(g, cyl(.16, .17, .46, LD.oak, 10), x - Math.sin(a) * .11, .23, t2.z);
  const atCounter = add(g, own(resident("lady", false)), .35, sh.floor, -.98) as Figure; atCounter.rotation.y = Math.PI - .2;
  const child = add(g, own(resident("child")), .28, sh.floor, 1.52) as Figure; child.rotation.y = .4;
  const walker = resident("shawl", false); add(g, walker, -2.4, 0, 3.40);
  const walk = pacer(walker, V(-2.4, 0, 3.40), V(2.4, 0, 3.45), .28, 1.1);
  const potRest = pot.position.clone(), from = V(), to = V();
  return life(g, "teaRoomUk", [waitress, alone, pair[0], pair[1], atCounter, child, walker], (t, k) => {
    brew.position.y = top + .09 + Math.sin(t * .9) * .002;
    // 1. the pot first: it tilts on its own base and a thread of tea falls through the strainer into the cup
    const tilt = hold(k, .26, .74);
    pot.position.copy(potRest);
    // the pot is lifted as it tilts, so the spout ends up over the strainer and the tea falls into it
    pot.position.x = potRest.x + tilt * .27; pot.position.y = potRest.y + tilt * .33;
    pot.rotation.z = -tilt * 1.05;
    tipOf(pot, V(.21, .10, 0), from);
    to.set(cup.position.x, cup.position.y + .03, cup.position.z);
    pour.set(from, to, tilt > .04);
    rings.forEach((r, i) => { const a = clamp01(tilt * 1.4 - i * .18); r.visible = a > .05; r.scale.setScalar(.4 + a * 1.5); (r.material as THREE.MeshStandardMaterial).opacity = (1 - a) * .7; });
    brew.scale.set(1 + tilt * .5, 1 + tilt * 1.6, 1 + tilt * .5);
    strainer.rotation.z = Math.sin(t * 3) * .02 + tilt * .06;
    // 2. the waitress turns to the table, 3. the woman alone looks up
    arms(waitress).right.rotation.x = -1.25 - beat(k, .30, .88) * .35;
    upper(waitress).rotation.y = -.2 + beat(k, .25, .9) * .5;
    upper(alone).rotation.y = Math.sin(t * .35) * .07 + beat(k, .5, 1) * .45;
    upper(child).rotation.y = beat(k, .55, 1) * .5;
    walk(t);
  });
}

/**
 * Borough Market at first light, under its iron roof: a cheese truckle on the stall with a wire through it, a
 * brace of game on the rail, a brass balance, and a porter's barrow. A cold hall - nothing here steams.
 */
export function boroughMarket(): P {
  const g = group();
  // the hall: cast-iron columns, lattice girders, a glass roof and its lantern (marketHall above)
  const hall = marketHall(g);
  lamps(g, hall.y, hall.zFront, [-1.5, 1.5], .8, true);
  // the cheese stall at the front: the truckle, the wire, the wedge that falls away, the board
  const stallTop = .84;
  add(g, box(2.2, .80, .78, LD.deal), -.55, .40, .95);
  add(g, box(2.3, .06, .86, "#D9D2C2"), -.55, stallTop, .95);
  const truckle = add(g, new THREE.Group(), -.75, stallTop + .22, .98); truckle.name = "market-truckle";
  add(truckle, cyl(.30, .30, .42, "#E4D49A", 18), 0, 0, 0).rotation.x = Math.PI / 2;
  add(truckle, cyl(.305, .305, .04, "#C9B478", 18), 0, 0, 0).rotation.x = Math.PI / 2;
  const wedge = add(g, new THREE.Group(), -.75, stallTop + .22, 1.20); wedge.name = "market-wedge";
  const wedgeMesh = new THREE.Mesh(new THREE.CylinderGeometry(.30, .30, .12, 18, 1, false, 0, 1.15), mat("#E9DCA8"));
  add(wedge, wedgeMesh, 0, 0, 0).rotation.x = Math.PI / 2;
  const wire = add(g, new THREE.Group(), -.75, stallTop + .56, .98); wire.name = "market-wire";
  add(wire, cyl(.008, .008, .70, "#C9C4B8", 4), 0, 0, 0).rotation.z = Math.PI / 2;
  for (const dx of [-.35, .35]) add(wire, box(.05, .05, .11, LD.oak), dx, 0, 0);
  // the brass balance, a basket of vegetables, a brace of game on the rail
  const balance = add(g, new THREE.Group(), .42, stallTop + .04, .90); balance.name = "market-balance";
  add(balance, cyl(.05, .07, .06, LD.brass, 10), 0, .03, 0);
  add(balance, cyl(.016, .016, .30, LD.brass, 6), 0, .18, 0);
  const beamArm = add(balance, box(.52, .022, .03, LD.brass), 0, .32, 0);
  for (const dx of [-.24, .24]) add(beamArm, cyl(.09, .09, .015, LD.brass, 12), dx, -.05, 0);
  for (let i = 0; i < 3; i++) add(g, cyl(.035, .035, .03, LD.iron, 10), .72 + i * .09, stallTop + .02, 1.15);
  const veg = add(g, cyl(.24, .19, .18, LD.straw, 12), 1.28, stallTop + .10, .92);
  for (let i = 0; i < 7; i++) add(veg, ball(.062, i % 3 ? "#5E8A3A" : "#C97A2A", 6), Math.cos(i) * .12, .10, Math.sin(i) * .12).scale.y = .8;
  const game = [0, 1].map((i) => {
    const bird = add(g, new THREE.Group(), 1.55 + i * .30, 1.62, -.30); bird.name = i === 0 ? "market-game" : "";
    add(bird, cyl(.008, .008, .22, "#8A7A5A", 4), 0, .11, 0);
    add(bird, ball(.10, "#6E5A38", 7), 0, -.06, 0).scale.set(.9, 1.5, .9);
    add(bird, ball(.055, "#4E4028", 6), 0, -.22, .02);
    add(bird, box(.04, .18, .12, "#7A6A46"), .06, -.04, 0).rotation.z = .3;
    bird.userData.foodReaction = "sway";
    return bird;
  });
  add(g, cyl(.02, .02, 1.6, LD.iron, 5), 1.70, 1.74, -.30).rotation.z = Math.PI / 2;
  // the porter's barrow, the always-on wheel, and the crates stacked behind
  const barrow = add(g, costerBarrow(false), -1.95, 0, 1.50); barrow.rotation.y = -.35; barrow.name = "market-barrow";
  for (let i = 0; i < 5; i++) add(barrow, ball(.075, i % 2 ? "#B4402A" : "#8AA83A", 6), -.4 + i * .2, .98, 0);
  for (let i = 0; i < 4; i++) add(g, box(.52, .30, .38, LD.deal), -1.55 + (i % 2) * .58, .16 + Math.floor(i / 2) * .32, -1.05);
  // seven people: the cheesemonger, the porter, two buyers, the balance man, a child, a walker down the aisle
  const monger = add(g, own(resident("cook")), -.75, .07, .34) as Figure; monger.rotation.y = 0;
  arms(monger).right.rotation.x = -1.45; arms(monger).left.rotation.x = -1.45;
  const porter = add(g, own(resident("porter", false)), -2.45, 0, 1.50) as Figure; porter.rotation.y = -1.4;
  arms(porter).left.rotation.x = -1.2; arms(porter).right.rotation.x = -1.2;
  wear(porter, box(.34, .10, .30, LD.straw), 0, 1.24, 0);                                  // the porter's knot on his head
  // the buyers stand a clear two units in front of the stall, where the arrival camera's line passes over their
  // heads rather than into them: a bystander never stands between the visitor and the food
  const buyers = [0, 1].map((i) => { const p = add(g, own(resident(i ? "shawl" : "lady", false)), -1.45 + i * 1.9, 0, 3.05 + i * .2) as Figure; p.rotation.y = Math.PI + (i - .5) * .5; return p; });
  const weigher = add(g, own(resident("coster", false)), .58, .07, .30) as Figure; weigher.rotation.y = .2;
  arms(weigher).right.rotation.x = -1.1;
  const child = add(g, own(resident("child")), 1.95, 0, 2.10) as Figure; child.rotation.y = 2.5;
  const walker = resident("clerk", false); add(g, walker, -2.5, 0, 3.50);
  const walk = pacer(walker, V(-2.5, 0, 3.50), V(2.5, 0, 3.55), .30, .5);
  const wedgeRest = wedge.position.clone(), wireRest = wire.position.clone();
  return life(g, "boroughUk", [monger, porter, buyers[0], weigher, buyers[1], child, walker], (t, k) => {
    // 1. the cheese first: the wire draws down through the truckle and the wedge falls away from it
    const draw = hold(k, .24, .62), fall = k > 0 ? clamp01(((1 - k) - .30) / .44) : 0;
    wire.position.copy(wireRest); wire.position.y = wireRest.y - draw * .56;
    wedge.position.copy(wedgeRest);
    wedge.position.z = wedgeRest.z + fall * .22; wedge.position.y = wedgeRest.y - fall * fall * .18;
    wedge.rotation.x = fall * .9; wedge.rotation.y = fall * .5;
    truckle.rotation.z = Math.sin(t * .4) * .006 - draw * .05;
    // the balance settles: the beam rocks and comes back level
    beamArm.rotation.z = Math.sin(t * .6) * .02 + beat(k, .35, 1) * .18 * Math.cos(t * 9);
    // 2. the cheesemonger's arms follow the wire, 3. the porter leans in over the barrow
    arms(monger).right.rotation.x = -1.45 - draw * .30; arms(monger).left.rotation.x = -1.45 - draw * .30;
    upper(monger).rotation.x = draw * .16;
    upper(porter).rotation.y = -.1 + beat(k, .42, 1) * .4;
    upper(buyers[0]).rotation.x = beat(k, .5, 1) * .18;
    game.forEach((b, i) => { b.rotation.z = Math.sin(t * 1.1 + i) * .05; });
    walk(t);
  });
}

/**
 * The pie and mash shop: marble, tile and mirrors, three things on the plate and the eels they were built on.
 * The ladle tips and green liquor runs over the pie; the pie's lid breaks open under it.
 */
export function pieShop(): P {
  const g = group();
  const sh = pieShopFront(g);
  lamps(g, sh.y, sh.zFront, [-1.5, 1.5], .8);
  for (let i = 0; i < 10; i++) for (let r = 0; r < 3; r++) add(g, box(.34, .34, .03, r % 2 ? "#E9E4D6" : "#C9D4CE"), -1.62 + i * .36, .32 + r * .36, sh.zBack + .10);
  for (let i = 0; i < 2; i++) add(g, box(.90, .70, .03, "#C9D2D4"), -.8 + i * 1.6, 1.62, sh.zBack + .10);   // the mirrors
  // the marble counter and the marble-topped table, the whole point of the room
  const top = .84;
  add(g, box(3.0, .80, .66, "#D9D2C2"), -.1, .40, .80);
  add(g, box(3.1, .07, .74, "#E9E4D6"), -.1, top, .80);
  add(g, box(1.5, .06, .70, "#E9E4D6"), 1.35, .48, 3.05);
  for (const dx of [.85, 1.85]) add(g, box(.08, .46, .60, LD.iron), dx, .23, 3.05);
  // the pie under the ladle, the mash round the edge, the liquor
  const pie = add(g, new THREE.Group(), -.62, top + .06, .96); pie.name = "pie-pie";
  add(pie, cyl(.165, .15, .10, LD.crust, 16), 0, 0, 0);
  const lid = add(pie, cyl(.155, .155, .025, "#C9862A", 16), 0, .06, 0); lid.name = "pie-lid";
  for (let i = 0; i < 6; i++) add(lid, box(.03, .012, .05, "#B4762A"), Math.cos(i) * .10, .015, Math.sin(i) * .10).rotation.y = i;
  const mash = add(g, new THREE.Group(), -.62, top + .05, .96);
  for (let i = 0; i < 5; i++) add(mash, ball(.075, "#F2EAD0", 7), Math.cos(i * 1.26) * .21, 0, Math.sin(i * 1.26) * .21).scale.y = .6;
  add(g, cyl(.29, .26, .02, LD.cream, 18), -.62, top + .035, .96);
  const ladle = add(g, new THREE.Group(), -.30, top + .30, .96); ladle.name = "pie-ladle";
  add(ladle, cyl(.075, .065, .05, LD.iron, 12), 0, 0, 0);
  add(ladle, cyl(.07, .07, .015, LD.liquor, 12), 0, .015, 0);
  add(ladle, cyl(.012, .012, .30, LD.oak, 5), .13, .10, 0).rotation.z = -.5;
  const liquor = pourFall(g, "pie-liquor", "#6E9442", .024);
  const rings = splashRings(g, 3, -.62, top + .12, .96, .07, "#7EA452");
  // the eel tub, the pepper pot and the vinegar, and a second pie on the shelf
  const tub = add(g, cyl(.28, .24, .26, LD.iron, 14), 1.28, top + .13, .86); tub.name = "pie-eeltub";
  add(g, cyl(.245, .245, .03, "#4A5A4A", 14), 1.28, top + .25, .86);
  const eels = Array.from({ length: 5 }, (_, i) => { const e = add(g, cyl(.022, .016, .30, "#3A4A3E", 6), 1.28 + Math.cos(i * 1.3) * .11, top + .27, .86 + Math.sin(i * 1.3) * .11); e.rotation.set(1.3, i, .4); return e; });
  add(g, cyl(.05, .045, .13, LD.iron, 10), .62, top + .07, 1.14); add(g, cyl(.045, .04, .14, LD.glass, 10), .80, top + .07, 1.14);
  for (let i = 0; i < 3; i++) { const p = add(g, cyl(.15, .14, .09, LD.crust, 14), -1.55 + i * .34, top + .05, .62); p.userData.foodReaction = "hop"; }
  g.userData.steam = V(-.62, top + .22, .96);
  // seven people: the pieman, the boy at the eel tub, two at the marble table, two standing, a walker
  const pieman = add(g, own(resident("cook")), -.52, sh.floor, .22) as Figure; pieman.rotation.y = 0;
  arms(pieman).right.rotation.x = -1.4;
  const boy = add(g, own(resident("child")), 1.28, sh.floor, .28) as Figure; boy.rotation.y = .2;
  arms(boy).right.rotation.x = -1.1;
  const atTable = [seatFigure(g, resident("coster", false), .92, 3.05, 1.4, .46), seatFigure(g, resident("porter", false), 2.00, 3.05, -1.4, .46)];
  for (const [x, z] of [[.80, 3.05], [2.12, 3.05]]) add(g, cyl(.15, .16, .46, LD.oak, 10), x, .23, z);
  const standing = [0, 1].map((i) => { const p = add(g, own(resident(i ? "shawl" : "mill", false)), -1.75 + i * .60, sh.floor, 3.10 + i * .22) as Figure; p.rotation.y = Math.PI - i * .3; return p; });
  // the pavement walk stops short of the strait: the shop's east end is 2.4 from the water (walkthrough item 21)
  const walker = resident("coster", false); add(g, walker, -2.4, 0, 3.40);
  const walk = pacer(walker, V(-2.4, 0, 3.40), V(1.3, 0, 3.45), .30, .3);
  const ladleRest = ladle.position.clone(), from = V(), to = V();
  return life(g, "pieMashUk", [pieman, atTable[0], boy, standing[0], atTable[1], standing[1], walker], (t, k) => {
    eels.forEach((e, i) => { e.rotation.y = i + Math.sin(t * .8 + i) * .2; e.position.y = top + .27 + Math.sin(t * 1.4 + i) * .006; });
    // 1. the liquor first: the ladle tips and green liquor runs over the pie, whose lid breaks under it
    const tip = hold(k, .26, .74), open = beat(k, .30, .95);
    ladle.position.copy(ladleRest);
    ladle.position.x = ladleRest.x - tip * .31; ladle.position.y = ladleRest.y + tip * .14;   // right over the pie
    ladle.rotation.z = tip * 1.15;
    tipOf(ladle, V(-.06, -.02, 0), from);
    to.set(pie.position.x, pie.position.y + .12, pie.position.z);
    liquor.set(from, to, tip > .04);
    rings.forEach((r, i) => { const a = clamp01(tip * 1.4 - i * .18); r.visible = a > .05; r.scale.setScalar(.5 + a * 1.4); (r.material as THREE.MeshStandardMaterial).opacity = (1 - a) * .7; });
    lid.rotation.x = open * .55; lid.position.y = .06 + open * .05; lid.position.z = open * .04;
    pie.rotation.y = Math.sin(t * .3) * .01;
    // 2. the pieman wipes the marble, 3. the boy at the eel tub looks round
    arms(pieman).right.rotation.x = -1.4 - beat(k, .32, .92) * .4;
    upper(pieman).rotation.y = Math.sin(t * .5) * .06 - beat(k, .32, .92) * .25;
    upper(boy).rotation.y = .2 + beat(k, .5, 1) * .7;
    upper(atTable[0]).rotation.x = beat(k, .55, 1) * .16;
    walk(t);
  });
}

/**
 * The fried fish shop, a mill town on a Friday: a coal range under a brick arch, two pans of beef dripping, and
 * the wire basket that lifts clear of the fat and shakes, with the fat streaming off it.
 */
export function chipShop(): P {
  const g = group();
  const sh = cornerShop(g);
  // one lamp on the cut corner over the door, one at the far end of the window: neither between the street and the pan
  add(g, ukLamp(.8, true), sh.cornerAt.x, sh.corner.y - .08 - .32, sh.cornerAt.z);
  add(g, ukLamp(.8, true), 1.72, sh.y - .08 - .32, sh.zFront);
  for (let i = 0; i < 2; i++) add(g, box(1.15, .92, .04, LD.glass), -.75 + i * 1.5, 1.34, sh.zBack + .10);
  // the range: a brick arch, the coal fire under it, two pans of dripping
  add(g, box(2.45, .92, .76, "#8A5A46"), -.3, .46, .70);
  add(g, box(2.55, .07, .84, LD.iron), -.3, .95, .70);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.42, .09, 6, 14, Math.PI), mat("#7A4A38")), -.35, .92, .35).rotation.x = Math.PI;
  const coals = Array.from({ length: 6 }, (_, i) => { const c = add(g, ball(.055, i % 2 ? "#D9541E" : "#8A2A16", 6), -.95 + i * .22, .30, .66); c.name = "chippy-coal"; return c; });
  const pans = [-.95, .30].map((x, i) => {
    const p = add(g, new THREE.Group(), x, 1.02, .70);
    add(p, box(.78, .18, .62, LD.iron), 0, 0, 0);
    add(p, box(.72, .03, .56, "#D9B462"), 0, .09, 0);
    if (i === 0) p.name = "chippy-pan";
    return p;
  });
  // the wire basket of chips: the subject, lifted clear of the fat and shaken
  const basket = add(g, new THREE.Group(), -.95, 1.14, .70); basket.name = "chippy-basket";
  add(basket, box(.60, .18, .46, "#9C9488")).material = mat("#9C9488", { wireframe: true });
  for (let i = 0; i < 4; i++) add(basket, box(.62, .012, .46, "#A8A096"), 0, -.09 + i * .06, 0);
  for (let i = 0; i < 12; i++) add(basket, box(.05, .045, .17, i % 3 ? "#E0C06A" : "#D9A84A"), -.24 + (i % 4) * .16, -.02 + Math.floor(i / 4) * .05, -.13 + (i % 3) * .13).rotation.y = i * .4;
  add(basket, cyl(.014, .014, .30, "#A8A096", 5), .38, .10, 0).rotation.z = -.7;
  const drips = Array.from({ length: 6 }, (_, i) => { const d = add(g, cyl(.012, .008, .12, "#E9C88A", 5), -1.1 + i * .08, 1.0, .70 + (i % 2) * .1); d.visible = false; return d; });
  // the fish on the marble slab, the tray of scraps, the vinegar and salt on the counter
  add(g, box(1.1, .78, .58, LD.deal), 1.42, .39, .90);
  add(g, box(1.16, .06, .64, "#D9D2C2"), 1.42, .81, .90);
  for (let i = 0; i < 3; i++) { const f = add(g, ball(.115, LD.haddock, 8), 1.18 + i * .22, .90, .88); f.scale.set(1.9, .55, .8); f.rotation.y = i * .2; f.userData.foodReaction = "hop"; }
  const scraps = add(g, cyl(.19, .16, .10, LD.iron, 12), 1.42, .88, 1.22);
  for (let i = 0; i < 6; i++) add(scraps, ball(.033, "#E4C486", 5), Math.cos(i) * .10, .06, Math.sin(i) * .10).scale.y = .6;
  add(g, cyl(.04, .035, .16, LD.glass, 10), 1.72, .90, 1.16); add(g, cyl(.045, .04, .11, LD.iron, 10), 1.86, .87, 1.12);
  for (let i = 0; i < 4; i++) add(g, box(.22, .008, .16, "#D9CFB4"), 1.78, .845 + i * .012, 1.02).rotation.y = i * .2;   // the newspaper on the slab
  g.userData.steam = V(-.95, 1.42, .70); g.userData.smoke = sh.flue;   // the range's flue is the stack at the back
  // seven people: the frier, the salter, three in the queue, a child, a walker on the street
  const frier = add(g, own(resident("cook")), -.95, sh.floor, .12) as Figure; frier.rotation.y = 0;
  arms(frier).right.rotation.x = -1.5; arms(frier).left.rotation.x = -1.1;
  const salter = add(g, own(resident("server")), 1.42, sh.floor, .34) as Figure; salter.rotation.y = .1;
  arms(salter).right.rotation.x = -1.2;
  const queue = [0, 1, 2].map((i) => { const p = add(g, own(resident(["mill", "shawl", "coster"][i] as Role, false)), -.6 + i * .62, sh.floor, 1.60 + (i % 2) * .22) as Figure; p.rotation.y = Math.PI + (i - 1) * .2; return p; });
  const child = add(g, own(resident("child")), -1.30, sh.floor, 1.44) as Figure; child.rotation.y = 2.9;
  const walker = resident("mill", false); add(g, walker, -2.5, 0, 3.50);
  const walk = pacer(walker, V(-2.5, 0, 3.50), V(2.5, 0, 3.55), .30, 1.4);
  const basketRest = basket.position.clone();
  return life(g, "chippyUk", [frier, queue[0], salter, queue[1], child, queue[2], walker], (t, k) => {
    coals.forEach((c, i) => { const s = .85 + Math.sin(t * 5 + i) * .12 + beat(k, 0, .8) * .3; c.scale.setScalar(s); (c.material as THREE.MeshStandardMaterial).emissive?.setHex?.(0); });
    pans.forEach((p, i) => { p.children[1].position.y = .09 + Math.sin(t * 2.2 + i) * .004; });
    // 1. the basket first: it lifts clear of the fat, shakes twice, and fat streams off it
    const lift = hold(k, .22, .70), shake = beat(k, .28, .78);
    basket.position.copy(basketRest);
    basket.position.y = basketRest.y + lift * .42;
    basket.position.z = basketRest.z + lift * .10;
    basket.rotation.x = -lift * .22 + shake * Math.sin(t * 22) * .16;
    basket.rotation.z = shake * Math.sin(t * 19) * .10;
    drips.forEach((d, i) => { const a = clamp01(lift * 1.5 - (i % 3) * .2); d.visible = a > .1 && a < .95; d.position.set(basketRest.x - .26 + i * .1, basketRest.y + lift * .42 - .18 - a * .28, basketRest.z + (i % 2) * .1); d.scale.y = .6 + a; });
    // 2. the frier's arm follows the basket, 3. a child in the queue leans in
    arms(frier).right.rotation.x = -1.5 - lift * .42;
    upper(frier).rotation.x = lift * .12;
    upper(child).rotation.x = beat(k, .45, 1) * .3; upper(child).rotation.y = 2.9 - 2.9 + beat(k, .45, 1) * .2;
    arms(salter).right.rotation.x = -1.2 - Math.abs(Math.sin(t * 1.3)) * .15;
    walk(t);
  });
}

/**
 * The porters' coffee stall, four in the morning under a naphtha flare: a two-wheeled stall with a boiler, a
 * griddle of bacon, thick bread and butter, and mugs that fill from the tap.
 */
export function coffeeStall(): P {
  const g = group();
  // the stall itself: a painted barrow under a cambered canvas on iron hoops (coffeeBarrow above)
  const sh = coffeeBarrow(g);
  for (const side of [-1, 1]) add(g, wheel(.46, 10, LD.oxbloodTile, "#C9A83A"), -.5, .46, side * .66);
  lamps(g, sh.y, sh.zFront, [-1.25, 1.25], .75, false);
  // the naphtha flare on its stick at the corner, outside the canvas: the light the stall works by, always alive
  add(g, cone(.09, .12, LD.brass, 8), sh.flare.x, sh.flare.y - .06, sh.flare.z);
  const flare = add(g, cone(.11, .30, LD.flameHot, 8), sh.flare.x, sh.flare.y + .15, sh.flare.z); flare.name = "breakfast-flare";
  (flare.material as THREE.MeshStandardMaterial).emissive.set("#E9822A"); (flare.material as THREE.MeshStandardMaterial).emissiveIntensity = .7;
  // the boiler with its tap, the griddle, the rashers, the mugs
  const boiler = add(g, cyl(.27, .29, .52, LD.brass, 16), -1.0, 1.32, .06); boiler.name = "breakfast-boiler";
  add(g, cyl(.24, .24, .05, "#9C7A2A", 16), -1.0, 1.60, .06);
  add(g, cyl(.05, .05, .07, LD.brass, 10), -1.0, 1.66, .06);
  const tap = add(g, new THREE.Group(), -.78, 1.16, .22); tap.name = "breakfast-tap";
  add(tap, cyl(.028, .032, .16, LD.brass, 8), 0, 0, 0).rotation.z = -1.1;
  add(tap, cyl(.022, .022, .10, LD.brass, 8), .07, -.06, 0);
  add(tap, box(.09, .02, .03, LD.brass), 0, .07, 0);
  const mug = add(g, cyl(.075, .062, .13, "#D9D2C2", 12), -.66, 1.10, .30); mug.name = "breakfast-mug";
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.04, .012, 5, 10), mat("#D9D2C2")), -.58, 1.10, .30).rotation.y = Math.PI / 2;
  const brew = add(g, cyl(.062, .062, .02, LD.tea, 12), -.66, 1.08, .30);
  const pour = pourFall(g, "breakfast-pour", "#5A3320", .018);
  const griddle = add(g, box(1.0, .06, .62, LD.iron), .40, 1.09, .04);
  const rasher = add(g, new THREE.Group(), .22, 1.14, .02); rasher.name = "breakfast-rasher";
  for (let i = 0; i < 3; i++) { add(rasher, box(.30, .022, .10, "#B4543A"), 0, i * .0, -.12 + i * .12); add(rasher, box(.30, .022, .03, "#E9D2B4"), 0, .012, -.16 + i * .12); }
  const others = Array.from({ length: 3 }, (_, i) => { const r = add(g, box(.28, .022, .09, "#A8483A"), .62 + (i % 2) * .16, 1.13, -.14 + i * .13); r.userData.foodReaction = "hop"; return r; });
  for (let i = 0; i < 4; i++) { add(g, box(.20, .05, .14, "#E9DCB4"), 1.24, 1.08 + i * .05, .24); add(g, box(.20, .012, .14, "#E9C86A"), 1.24, 1.11 + i * .05, .24); }   // bread and butter
  for (let i = 0; i < 4; i++) add(g, cyl(.07, .058, .12, "#D9D2C2", 12), 1.22 - i * .19, 1.09, -.28);
  g.userData.steam = V(-1.0, 1.72, .06); g.userData.smoke = V(sh.flare.x, sh.flare.y + .42, sh.flare.z);
  // seven people: the stallholder, a porter taking his mug, three more at the stall, a boy, a walker
  const holder = add(g, own(resident("cook")), -.2, 0, -.92) as Figure; holder.rotation.y = 0;
  arms(holder).right.rotation.x = -1.3; arms(holder).left.rotation.x = -1.1;
  const porter = add(g, own(resident("porter", false)), -.66, 0, 1.12) as Figure; porter.rotation.y = Math.PI;
  arms(porter).right.rotation.x = -1.45;
  const atStall = [0, 1, 2].map((i) => { const p = add(g, own(resident(["coster", "carter", "mill"][i] as Role, false)), .35 + i * .62, 0, 1.18 + (i % 2) * .2) as Figure; p.rotation.y = Math.PI + (i - 1) * .22; return p; });
  const boy = add(g, own(resident("child")), -1.55, 0, 1.06) as Figure; boy.rotation.y = 2.7;
  const walker = resident("porter", false); add(g, walker, -2.6, 0, 3.30);
  const walk = pacer(walker, V(-2.6, 0, 3.30), V(2.6, 0, 3.35), .32, .9);
  const from = V(), to = V();
  return life(g, "breakfastUk", [holder, porter, atStall[0], atStall[1], boy, atStall[2], walker], (t, k) => {
    const s = .9 + Math.sin(t * 7) * .12 + beat(k, .1, .9) * .3; flare.scale.set(s, 1 + Math.sin(t * 9) * .12, s); flare.rotation.y = t * .8;
    brew.position.y = 1.08 + Math.sin(t * 1.2) * .002;
    // 1. the food first: a rasher curls on the griddle and the mug fills from the boiler tap
    const curl = beat(k, 0, .52), fill = hold(k, .24, .76);
    rasher.children.forEach((r, i) => { if (i % 2) return; r.rotation.x = curl * (.5 + (i % 4) * .1); r.position.y = curl * .03; });
    // the whole rasher lifts off the iron, curls over on itself and comes back down flat
    rasher.position.y = 1.14 + curl * .16;
    rasher.position.x = .22 - curl * .10;
    rasher.rotation.x = curl * 1.15;
    others.forEach((r, i) => { r.rotation.x = Math.sin(t * .9 + i) * .04; });
    tap.rotation.z = -fill * .5;
    from.set(-.78, 1.10, .22); to.set(mug.position.x, mug.position.y + .04, mug.position.z);
    pour.set(from, to, fill > .05);
    brew.scale.set(1, 1 + fill * 2.2, 1); brew.position.y = 1.06 + fill * .02;
    // 2. the stallholder turns the bacon, 3. the porter takes the mug
    arms(holder).right.rotation.x = -1.3 - curl * .40;
    upper(holder).rotation.x = curl * .12;
    arms(porter).right.rotation.x = -1.45 - beat(k, .40, 1) * .35;
    upper(porter).rotation.y = Math.PI + beat(k, .40, 1) * .2;
    upper(boy).rotation.y = 2.7 - beat(k, .5, 1) * .5;
    walk(t);
  });
}

/**
 * The seamen's kitchen, a back room off a Shadwell wharf: Sylheti and Chittagonian firemen and lascars cooking
 * for each other. Ground spice slides off the slab into the hot fat and the pan tilts under it.
 */
export function lascarKitchen(): P {
  const g = group();
  const sh = seamensRoom(g);
  lamps(g, sh.y, sh.zFront, [-1.5, 1.5], .8, false);
  for (let i = 0; i < 8; i++) add(g, box(.42, 2.0, .05, "#7A5A42"), -1.55 + i * .44, 1.1, sh.zBack + .09);
  // the grinding slab at the front: the subject, and the spices heaped along it
  const slabTop = .80;
  add(g, box(1.4, .78, .70, LD.deal), -.85, .39, .92);
  const slab = add(g, box(1.3, .08, .62, LD.moorGranite), -.85, slabTop, .92); void slab;
  const muller = add(g, cyl(.09, .10, .30, LD.moorGranite, 12), -1.15, slabTop + .10, .92); muller.rotation.z = Math.PI / 2;
  const ground = add(g, new THREE.Group(), -.62, slabTop + .05, .92); ground.name = "lascar-spice";
  add(ground, box(.34, .035, .28, "#B4682A"), 0, 0, 0);
  for (let i = 0; i < 5; i++) add(ground, ball(.035, i % 2 ? "#C97A22" : "#8A4A1E", 5), -.10 + i * .05, .025, (i % 3) * .06 - .06).scale.y = .6;
  for (const [x, c] of [[-1.28, "#C9A82A"], [-1.06, "#8A2A1E"], [-.84, "#6E4A22"]] as [number, string][]) {
    add(g, cyl(.075, .065, .05, LD.brass, 10), x, slabTop + .05, 1.20);
    for (let i = 0; i < 4; i++) add(g, ball(.028, c, 5), x + Math.cos(i * 1.6) * .035, slabTop + .09, 1.20 + Math.sin(i * 1.6) * .035);
  }
  // the chula and the pan of hot fat, the rice pot, the fish
  add(g, cyl(.30, .34, .46, "#8A6A4A", 14), .62, .23, 1.00);
  const fire = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.06, .18, i % 2 ? LD.flameHot : LD.flame, 6), .62 + Math.cos(i * 1.6) * .11, .50, 1.00 + Math.sin(i * 1.6) * .11); f.name = "lascar-flame"; return f; });
  const pan = add(g, new THREE.Group(), .62, .74, 1.00); pan.name = "lascar-pan";
  add(pan, new THREE.Mesh(new THREE.SphereGeometry(.30, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(LD.iron)), 0, 0, 0);
  add(pan, cyl(.30, .28, .02, "#D9B462", 16), 0, -.02, 0);
  add(pan, cyl(.014, .014, .34, LD.iron, 5), -.36, .04, 0).rotation.z = .5;
  // the rice pot and the morning's fish on a scrubbed table by the door
  add(g, box(.9, .72, .56, LD.deal), 1.45, .36, .70);
  const pot = add(g, cyl(.24, .20, .30, LD.iron, 14), 1.28, .87, .70);
  add(g, cyl(.22, .22, .03, "#E9E4D2", 14), 1.28, 1.02, .70);
  add(g, cyl(.26, .26, .025, LD.iron, 14), 1.28, 1.05, .70);
  for (let i = 0; i < 3; i++) { const f = add(g, ball(.10, "#B9C2C4", 7), 1.70, .77, .52 + i * .18); f.scale.set(1.8, .5, .7); f.userData.foodReaction = "hop"; }
  g.userData.steam = V(.62, 1.10, 1.00); g.userData.smoke = V(.62, .95, 1.00);
  // seven people: the cook, the grinder, three on the bench, a man at the door, a walker on the wharf
  const cook = add(g, own(resident("lascar", false)), .62, sh.floor, .34) as Figure; cook.rotation.y = 0;
  arms(cook).right.rotation.x = -1.35;
  const grinder = add(g, own(resident("lascar", false)), -.85, sh.floor, .30) as Figure; grinder.rotation.y = .1;
  arms(grinder).right.rotation.x = -1.5; arms(grinder).left.rotation.x = -1.4;
  const seat = bench(g, .30, 3.86, 2.2, 0, .44);
  const onBench = [-.5, .25, 1.0].map((x, i) => seatFigure(g, resident("lascar", false), x, 3.80, 0, seat));
  const atDoor = add(g, own(resident("porter", false)), -2.05, sh.floor, 2.95) as Figure; atDoor.rotation.y = 2.4;
  const walker = resident("lascar", false); add(g, walker, -2.4, 0, 3.50);
  const walk = pacer(walker, V(-2.4, 0, 3.50), V(2.4, 0, 3.55), .28, 1.2);
  const groundRest = ground.position.clone(), panRest = pan.rotation.clone();
  return life(g, "lascarUk", [cook, onBench[0], grinder, onBench[1], atDoor, onBench[2], walker], (t, k) => {
    fire.forEach((f, i) => { const s = .8 + Math.sin(t * 8 + i * 2) * .18 + beat(k, .05, .8) * .55; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    muller.position.x = -1.15 + Math.sin(t * 1.6) * .07;
    // 1. the spice first: the ground masala slides off the slab and drops into the fat, which spits
    const slide = hold(k, .22, .60), drop = k > 0 ? clamp01(((1 - k) - .30) / .40) : 0;
    ground.position.copy(groundRest);
    ground.position.x = groundRest.x + slide * .68 + drop * .38;
    ground.position.y = groundRest.y - drop * drop * .06;
    ground.rotation.z = -slide * .35;
    ground.scale.set(1 - drop * .5, 1 + drop * .3, 1 - drop * .3);
    pan.rotation.copy(panRest);
    pan.rotation.z = beat(k, .34, .92) * .32;
    pan.position.y = .74 + beat(k, .34, .92) * .03;
    // 2. the cook's hand follows the pan, 3. a man on the bench looks over
    arms(cook).right.rotation.x = -1.35 - beat(k, .34, .92) * .5;
    upper(cook).rotation.z = beat(k, .34, .92) * .12;
    arms(grinder).right.rotation.x = -1.5 - Math.abs(Math.sin(t * 1.6)) * .12;
    upper(onBench[0]).rotation.y = Math.sin(t * .3) * .08 + beat(k, .5, 1) * .5;
    walk(t);
  });
}

/**
 * The hop-pickers' cookhouse in the Weald: a faggot fire in the open, a pot on a chain over it, the bin end and
 * a quarter of a million Londoners' working holiday. The pot swings and the ladle lifts and pours back.
 */
export function hopCookhouse(): P {
  const g = group();
  const sh = hopFly(g);
  lamps(g, sh.y, sh.zFront, [-1.8, 1.8], .8, false);
  // the fire, the tripod and the pot: the subject
  add(g, cyl(.62, .70, .10, "#6E6A5E", 14), .10, .05, .70);
  const logs = Array.from({ length: 5 }, (_, i) => add(g, cyl(.05, .06, .58, "#5A4632", 6), .10 + Math.cos(i * 1.26) * .16, .12, .70 + Math.sin(i * 1.26) * .16).rotation.set(.2, i * 1.26, 1.3));
  const flames = Array.from({ length: 5 }, (_, i) => { const f = add(g, cone(.09, .32, i % 2 ? LD.flameHot : LD.flame, 6), .10 + Math.cos(i * 1.26) * .12, .32, .70 + Math.sin(i * 1.26) * .12); f.name = "hop-flame"; return f; });
  const tripod = [0, 1, 2].map((i) => { const a = i * 2.09; const l = add(g, cyl(.035, .045, 2.1, "#6E5236", 6), .10 + Math.cos(a) * .58, 1.0, .70 + Math.sin(a) * .58); l.rotation.set(Math.sin(a) * .52, 0, -Math.cos(a) * .52); return l; });
  add(g, cyl(.01, .01, .34, LD.iron, 4), .10, 1.86, .70);
  const chain = add(g, new THREE.Group(), .10, 1.80, .70);
  for (let i = 0; i < 5; i++) add(chain, new THREE.Mesh(new THREE.TorusGeometry(.028, .008, 4, 8), mat(LD.iron)), 0, -.06 - i * .055, 0).rotation.x = i % 2 ? Math.PI / 2 : 0;
  const potGroup = add(chain, new THREE.Group(), 0, -.52, 0); potGroup.name = "hop-pot";
  add(potGroup, new THREE.Mesh(new THREE.SphereGeometry(.34, 14, 9, 0, Math.PI * 2, 0, Math.PI * .62), mat(LD.iron)), 0, 0, 0);
  add(potGroup, new THREE.Mesh(new THREE.TorusGeometry(.33, .022, 5, 14), mat(LD.iron)), 0, .03, 0).rotation.x = Math.PI / 2;
  add(potGroup, new THREE.Mesh(new THREE.TorusGeometry(.30, .018, 5, 14, Math.PI), mat(LD.iron)), 0, .22, 0).rotation.y = Math.PI / 2;
  const stew = add(potGroup, cyl(.29, .29, .03, "#8A6A32", 14), 0, -.02, 0); stew.name = "hop-stew";
  const bits = Array.from({ length: 7 }, (_, i) => add(potGroup, ball(.035, i % 3 ? "#B4783A" : "#6E8A3A", 5), Math.cos(i) * .16, .0, Math.sin(i) * .16));
  const ladle = add(g, new THREE.Group(), .58, .96, 1.02); ladle.name = "hop-ladle";
  add(ladle, cyl(.085, .075, .06, LD.iron, 12), 0, 0, 0);
  add(ladle, cyl(.08, .08, .015, "#8A6A32", 12), 0, .015, 0);
  add(ladle, cyl(.012, .012, .42, LD.oak, 5), .18, .16, 0).rotation.z = -.6;
  const drip = pourFall(g, "hop-drip", "#8A6A32", .02);
  // the hop bin, the picked hops, the loaf and the kettle: the modelled food round the fire
  const bin = add(g, new THREE.Group(), -1.35, 0, .95); bin.name = "hop-bin";
  for (const dx of [-.62, .62]) for (const dz of [-.38, .38]) add(bin, cyl(.05, .06, .78, LD.oak, 6), dx, .39, dz);
  add(bin, box(1.34, .05, .86, "#9C8A66"), 0, .60, 0);
  for (let i = 0; i < 9; i++) add(bin, cone(.075, .16, "#8AA84A", 6), -.5 + (i % 5) * .25, .70, -.2 + Math.floor(i / 5) * .26).rotation.x = Math.PI;
  add(g, box(.34, .16, .22, "#C9A86A"), 1.30, .12, 1.28);
  add(g, cyl(.13, .15, .20, LD.iron, 12), 1.55, .12, .90);
  g.userData.steam = V(.10, 1.60, .70); g.userData.smoke = V(.10, .80, .70);
  // seven people: the cook at the pot, a woman at the bin, two pickers, a child, a measurer, a walker
  const cook = add(g, own(resident("shawl")), .58, 0, 1.44) as Figure; cook.rotation.y = Math.PI - .3;
  arms(cook).right.rotation.x = -1.4;
  const binner = add(g, own(resident("picker", false)), -1.35, 0, 1.64) as Figure; binner.rotation.y = Math.PI;
  arms(binner).right.rotation.x = -1.2; arms(binner).left.rotation.x = -1.1;
  const pickers = [0, 1].map((i) => { const p = add(g, own(resident(i ? "shawl" : "picker", false)), -2.45 + i * .1, 0, .30 - i * .7) as Figure; p.rotation.y = 1.2 + i * .3; arms(p).right.rotation.x = -1.35; return p; });
  const child = add(g, own(resident("child")), -.62, 0, 1.92) as Figure; child.rotation.y = 2.6;
  const measurer = add(g, own(resident("farmer", false)), 1.86, 0, 1.70) as Figure; measurer.rotation.y = -2.1;
  const walker = resident("picker", false); add(g, walker, -2.7, 0, 3.60);
  const walk = pacer(walker, V(-2.7, 0, 3.60), V(2.7, 0, 3.65), .30, .7);
  const ladleRest = ladle.position.clone(), from = V(), to = V();
  void logs;
  return life(g, "hopKitchenUk", [cook, binner, pickers[0], child, pickers[1], measurer, walker], (t, k) => {
    flames.forEach((f, i) => { const s = .85 + Math.sin(t * 7 + i * 1.7) * .2 + beat(k, 0, .8) * .5; f.scale.set(s, 1 + Math.sin(t * 9 + i) * .2, s); f.rotation.y = t * 1.4 + i; });
    bits.forEach((b, i) => { b.position.y = Math.sin(t * 1.8 + i) * .012; b.position.x = Math.cos(t * .5 + i) * .17; b.position.z = Math.sin(t * .5 + i) * .17; });
    // the pot swings on its chain whatever happens; the click swings it further and lifts the ladle out of it
    const swing = Math.sin(t * 1.1) * .05 + beat(k, 0, .62) * .26 * Math.sin(t * 5);
    chain.rotation.z = swing; chain.rotation.x = Math.cos(t * .9) * .03;
    stew.position.y = -.02 + Math.sin(t * 2.4) * .006;
    const lift = hold(k, .26, .70);
    ladle.position.copy(ladleRest);
    ladle.position.x = ladleRest.x - lift * .42; ladle.position.y = ladleRest.y + lift * .58;
    ladle.rotation.z = lift * .9;
    from.copy(ladle.position).add(V(-.05, -.02, 0));
    to.set(.10, 1.32, .70);
    drip.set(from, to, lift > .25);
    // 2. the cook's arm follows the ladle, 3. a child at the bin turns round
    arms(cook).right.rotation.x = -1.4 - lift * .55;
    upper(cook).rotation.x = lift * .14;
    upper(child).rotation.y = 2.6 - 2.6 + beat(k, .5, 1) * .8;
    arms(binner).right.rotation.x = -1.2 - Math.abs(Math.sin(t * 1.1)) * .2;
    walk(t);
  });
}

/**
 * The dale dairy: a cold stone room with a north light, a press whose screw turns down, whey running into the
 * pail, and a truckle settling in its hoop. **Nothing in this stand is hot and nothing steams.**
 */
export function daleDairy(): P {
  const g = group();
  const sh = dairyRange(g);
  lamps(g, sh.y, sh.zFront, [-1.3, 1.72], .8, false);
  for (let i = 0; i < 12; i++) for (let r = 0; r < 4; r++) add(g, box(.36, .22, .04, r % 2 ? "#8E8C84" : "#7E7C74"), -1.85 + i * .34 + (r % 2) * .1, .22 + r * .24, sh.zBack + .09);
  add(g, box(.95, .70, .05, "#C9D4D8"), -1.0, 1.50, sh.zBack + .10);                        // the north light
  // the press: two uprights, a cross head, a screw that turns down, a follower on the hoop
  const press = add(g, new THREE.Group(), -.85, 0, .96); press.name = "dairy-press";
  for (const dx of [-.42, .42]) add(press, box(.14, 1.60, .16, LD.oak), dx, .80, 0);
  add(press, box(1.10, .16, .22, LD.oak), 0, 1.56, 0);
  add(press, box(1.10, .10, .26, LD.oak), 0, .62, 0);
  const screw = add(press, new THREE.Group(), 0, 1.18, 0); screw.name = "dairy-screw";
  add(screw, cyl(.06, .06, .62, LD.iron, 10), 0, 0, 0);
  for (let i = 0; i < 7; i++) add(screw, new THREE.Mesh(new THREE.TorusGeometry(.068, .014, 4, 10), mat(LD.iron)), 0, -.28 + i * .09, 0).rotation.x = Math.PI / 2;
  const handle = add(screw, cyl(.018, .018, .56, LD.oak, 6), 0, .30, 0); handle.rotation.z = Math.PI / 2;
  const follower = add(press, cyl(.20, .20, .07, LD.oak, 16), 0, .80, 0); follower.name = "dairy-follower";
  const hoop = add(press, cyl(.23, .23, .30, "#9C8A66", 18), 0, .78, 0);
  const truckle = add(press, cyl(.195, .195, .26, "#F2EAD0", 18), 0, .78, 0); truckle.name = "dairy-truckle";
  void hoop;
  // the spout, the whey and the pail: a drip, never a steam source, because this room is cold
  const spout = add(press, cyl(.022, .028, .22, LD.lead, 8), .30, .60, .22); spout.rotation.set(.9, 0, 1.2);   // out and down, over the pail
  const pail = add(g, cyl(.19, .16, .26, LD.deal, 14), -.45, .13, 1.26); pail.name = "dairy-pail";
  for (const yy of [.06, .20]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.185, .012, 4, 14), mat(LD.iron)), -.45, yy, 1.26).rotation.x = Math.PI / 2;
  const whey = add(g, cyl(.16, .16, .02, "#E9E9DC", 14), -.45, .18, 1.26);
  const run = pourFall(g, "dairy-whey", "#E9E9DC", .017);
  const rings = splashRings(g, 3, -.45, .20, 1.26, .05, "#DCDCCE");
  // the cold food of the room: a cheese ladder of truckles, a bowl of curd, a churn, a bowl of cream
  for (let i = 0; i < 6; i++) { const c = add(g, cyl(.19, .19, .16, "#EFE4C4", 16), .72 + (i % 3) * .46, .48 + Math.floor(i / 3) * .58, -.32); c.userData.foodReaction = "hop"; add(g, cyl(.195, .195, .02, "#D9C89A", 16), .72 + (i % 3) * .46, .56 + Math.floor(i / 3) * .58, -.32); }
  for (let r = 0; r < 2; r++) add(g, box(1.8, .06, .44, LD.oak), 1.18, .38 + r * .58, -.32);
  for (const dx of [.35, 1.97]) add(g, box(.09, 1.0, .44, LD.oak), dx, .5, -.32);
  const curd = add(g, cyl(.30, .26, .20, "#D9D2C2", 16), 1.10, .90, 1.05);
  for (let i = 0; i < 6; i++) add(curd, box(.09, .06, .09, "#F6F2E6"), Math.cos(i) * .13, .10, Math.sin(i) * .13).rotation.y = i;
  add(g, box(1.3, .80, .62, LD.deal), 1.10, .40, 1.05);
  const churn = add(g, cyl(.20, .26, .72, LD.deal, 14), 1.92, .36, 1.18);
  add(g, cyl(.09, .09, .05, LD.oak, 12), 1.92, .74, 1.18); add(g, cyl(.02, .02, .52, LD.oak, 6), 1.92, 1.0, 1.18);
  void churn;
  // six people: the dairymaid at the press, a second at the churn, two at the ladder, a child, a walker
  const maid = add(g, own(resident("cook")), -.85, sh.floor, .30) as Figure; maid.rotation.y = 0;
  arms(maid).right.rotation.x = -1.45; arms(maid).left.rotation.x = -1.30;
  const churner = add(g, own(resident("mill", false)), 1.92, sh.floor, 1.62) as Figure; churner.rotation.y = Math.PI;
  arms(churner).right.rotation.x = -1.5; arms(churner).left.rotation.x = -1.5;
  const atLadder = [0, 1].map((i) => { const p = add(g, own(resident(i ? "farmer" : "shawl", false)), .95 + i * .8, sh.floor, .35) as Figure; p.rotation.y = -1.4 + i * .3; return p; });
  const child = add(g, own(resident("child")), .85, sh.floor, 3.20) as Figure; child.rotation.y = 2.8;
  const walker = resident("farmer", false); add(g, walker, -2.6, 0, 3.50);
  const walk = pacer(walker, V(-2.6, 0, 3.50), V(2.6, 0, 3.55), .28, 1.5);
  const screwRest = screw.position.clone(), followRest = follower.position.clone(), truckleRest = truckle.position.clone();
  const from = V(), to = V();
  return life(g, "dairyUk", [maid, churner, atLadder[0], child, atLadder[1], walker], (t, k) => {
    // 1. the material first: the screw turns down, the truckle settles in the hoop, whey runs into the pail
    const turn = hold(k, .24, .72);
    screw.rotation.y = t * .25 + turn * 7.0;
    screw.position.copy(screwRest); screw.position.y = screwRest.y - turn * .13;
    follower.position.copy(followRest); follower.position.y = followRest.y - turn * .12;
    truckle.position.copy(truckleRest);
    truckle.scale.set(1 + turn * .02, 1 - turn * .14, 1 + turn * .02);
    truckle.position.y = truckleRest.y - turn * .02;
    tipOf(spout, V(0, -.12, 0), from).add(V(-.85, 0, .96));
    to.set(pail.position.x, pail.position.y + .07, pail.position.z);
    run.set(from, to, turn > .05);
    rings.forEach((r, i) => { const a = clamp01(turn * 1.4 - i * .18); r.visible = a > .05; r.scale.setScalar(.5 + a * 1.3); (r.material as THREE.MeshStandardMaterial).opacity = (1 - a) * .6; });
    whey.scale.set(1, 1 + turn * 1.8, 1); whey.position.y = .18 + turn * .015;
    // 2. the dairymaid leans on the handle, 3. the woman at the churn straightens
    handle.rotation.y = t * .25 + turn * 7.0;
    arms(maid).right.rotation.x = -1.45 - turn * .35; arms(maid).left.rotation.x = -1.30 - turn * .30;
    upper(maid).rotation.x = turn * .2;
    upper(churner).rotation.x = .12 - beat(k, .45, 1) * .3;
    arms(churner).right.rotation.x = -1.5 - Math.abs(Math.sin(t * 1.5)) * .22;
    upper(child).rotation.y = beat(k, .55, 1) * .5;
    walk(t);
  });
}

/**
 * The Cornish bakehouse: a granite cob building with a cloam oven, pasties crimped on the board and slid in on
 * the peel, each with its owner's letters on one corner.
 */
export function pastyBakehouse(): P {
  const g = group();
  const sh = graniteBakehouse(g);
  lamps(g, sh.y, sh.zFront, [-1.55, 1.55], .8, false);
  // the oven in the back wall: a granite arch, a glowing mouth, an iron door leaning beside it
  const mouth = add(g, new THREE.Group(), 1.15, .92, sh.zBack + .16); mouth.name = "pasty-oven";
  add(g, box(1.5, 1.7, .42, LD.moorGranite), 1.15, .85, sh.zBack + .30);
  add(mouth, new THREE.Mesh(new THREE.TorusGeometry(.42, .10, 6, 14, Math.PI), mat("#7A6A56")), 0, 0, 0);
  const glow = add(mouth, box(.80, .48, .06, "#E07A22"), 0, -.20, .02);
  glow.material = mat("#E07A22", { emissive: "#E9622A", emissiveIntensity: .55 });
  glow.name = "pasty-glow";
  const emberSet = Array.from({ length: 4 }, (_, i) => add(mouth, ball(.05, i % 2 ? LD.flameHot : LD.flame, 6), -.24 + i * .16, -.34, .04));
  add(g, cyl(.30, .30, .05, LD.iron, 14), .40, .58, sh.zBack + .40).rotation.x = .3;
  // the board at the front: the crimped pasties, the raw one under the thumb, the peel
  const boardTop = .82;
  add(g, box(2.4, .80, .80, LD.deal), .10, .40, 1.00);
  add(g, box(2.5, .07, .88, "#C9B89C"), .10, boardTop, 1.00);
  const raw = add(g, new THREE.Group(), -.55, boardTop + .07, 1.02); raw.name = "pasty-raw";
  add(raw, ball(.17, "#E4D6A8", 9), 0, 0, 0).scale.set(1.25, .62, .82);
  const crimp = add(raw, new THREE.Group(), 0, .05, 0);
  for (let i = 0; i < 7; i++) add(crimp, box(.045, .035, .05, "#D9C892"), -.13 + i * .043, .04, .02).rotation.y = i * .2;
  const tray = add(g, new THREE.Group(), .62, boardTop + .06, 1.02); tray.name = "pasty-tray";
  add(tray, box(.86, .04, .56, LD.iron), 0, 0, 0);
  for (let i = 0; i < 4; i++) {
    const p = add(tray, ball(.15, LD.crust, 9), -.27 + (i % 2) * .38, .06, -.13 + Math.floor(i / 2) * .26);
    p.scale.set(1.2, .58, .78);
    for (let n = 0; n < 5; n++) add(tray, box(.04, .03, .04, "#B4762A"), -.27 + (i % 2) * .38 - .10 + n * .05, .13, -.13 + Math.floor(i / 2) * .26 + .04);
    add(tray, box(.06, .012, .04, "#8A5A22"), -.27 + (i % 2) * .38 + .14, .14, -.13 + Math.floor(i / 2) * .26);   // the owner's letters
  }
  const peel = add(g, new THREE.Group(), 1.50, boardTop + .16, 1.14); peel.name = "pasty-peel";
  add(peel, box(.62, .03, .50, "#C9B489"), 0, 0, 0);
  add(peel, cyl(.024, .028, 1.4, LD.oak, 6), .90, .06, 0).rotation.z = Math.PI / 2 + .12;
  // flour, a bowl of turnip and beef, and the dough under a cloth
  add(g, cyl(.20, .17, .16, "#D9D2C2", 14), -1.45, boardTop + .08, .92);
  for (let i = 0; i < 4; i++) add(g, ball(.045, i % 2 ? "#E4E0D2" : "#C9A86A", 5), -1.45 + Math.cos(i * 1.6) * .09, boardTop + .18, .92 + Math.sin(i * 1.6) * .09);
  const filling = add(g, cyl(.19, .16, .14, "#B4A88E", 14), -1.10, boardTop + .07, 1.22);
  for (let i = 0; i < 5; i++) add(filling, box(.07, .05, .07, i % 2 ? "#E9D9A8" : "#9C4A3A"), Math.cos(i * 1.26) * .09, .07, Math.sin(i * 1.26) * .09);
  add(g, ball(.24, "#E9E2CC", 9), -1.72, boardTop + .10, 1.24).scale.y = .6;
  add(g, box(.56, .01, .46, "#F2EEE0"), -1.72, boardTop + .18, 1.24);
  g.userData.steam = V(1.15, 1.42, sh.zBack + .30); g.userData.smoke = sh.flue;   // the oven's stack
  // seven people: the baker at the board, the oven man, two women bringing pasties, a child, a miner, a walker
  const baker = add(g, own(resident("cook")), -.55, sh.floor, .34) as Figure; baker.rotation.y = 0;
  arms(baker).right.rotation.x = -1.5; arms(baker).left.rotation.x = -1.35;
  const ovenMan = add(g, own(resident("server")), 1.85, sh.floor, -.20) as Figure; ovenMan.rotation.y = -1.3;
  arms(ovenMan).right.rotation.x = -1.4; arms(ovenMan).left.rotation.x = -1.3;
  const women = [0, 1].map((i) => { const p = add(g, own(resident(i ? "mill" : "shawl", false)), -1.95 + i * .7, sh.floor, 3.35) as Figure; p.rotation.y = Math.PI + (i - .5) * .3; return p; });
  const child = add(g, own(resident("child")), 1.75, sh.floor, 3.15) as Figure; child.rotation.y = 3.0;
  const miner = add(g, own(resident("miner", false)), 2.45, sh.floor, 2.55) as Figure; miner.rotation.y = -2.4;
  const walker = resident("miner", false); add(g, walker, -2.6, 0, 3.60);
  const walk = pacer(walker, V(-2.6, 0, 3.60), V(2.6, 0, 3.65), .30, .4);
  const trayRest = tray.position.clone(), peelRest = peel.position.clone();
  return life(g, "pastyUk", [baker, ovenMan, women[0], child, women[1], miner, walker], (t, k) => {
    emberSet.forEach((e, i) => { const s = .8 + Math.sin(t * 6 + i * 1.5) * .18 + beat(k, .1, .9) * .4; e.scale.setScalar(s); });
    (glow.material as THREE.MeshStandardMaterial).emissiveIntensity = .55 + Math.sin(t * 1.8) * .06 + beat(k, .18, .92) * .85;
    // 1. the food first: the peel takes the tray of pasties off the board and slides it into the oven mouth
    const slide = hold(k, .22, .70);
    peel.position.copy(peelRest);
    peel.position.x = peelRest.x - slide * .32; peel.position.z = peelRest.z - slide * 1.15; peel.position.y = peelRest.y + slide * .10;
    peel.rotation.y = slide * .30;
    tray.position.copy(trayRest);
    tray.position.x = trayRest.x + slide * .48; tray.position.z = trayRest.z - slide * .86; tray.position.y = trayRest.y + slide * .12;
    tray.rotation.y = slide * .28;
    // the raw pasty is crimped under the thumb all the while
    crimp.rotation.z = Math.sin(t * 2.2) * .05 + beat(k, .05, .6) * .18;
    raw.position.y = boardTop + .07 + Math.abs(Math.sin(t * 2.2)) * .006;
    // 2. the oven man's arms follow the peel, 3. a child steps back from the mouth
    arms(ovenMan).right.rotation.x = -1.4 - slide * .35; arms(ovenMan).left.rotation.x = -1.3 - slide * .30;
    upper(ovenMan).rotation.y = -.4 - slide * .5;
    arms(baker).right.rotation.x = -1.5 - Math.abs(Math.sin(t * 2.2)) * .12;
    upper(child).rotation.x = -beat(k, .45, 1) * .25;
    walk(t);
  });
}

/**
 * The cockle sands at the head of the Bristol Channel: the Penclawdd women, the riddle, the donkey and the
 * copper. The riddle is shaken and the sand falls through it in a curtain.
 */
export function cockleStall(): P {
  const g = group();
  const sh = beachShelter(g);
  lamps(g, sh.y, sh.zFront, [-1.55, 1.55], .75, false);
  // the wet sand the stall works on, ribbed and draining
  add(g, box(6.4, .05, 4.4, LD.sand), 0, .025, .90);
  for (let i = 0; i < 12; i++) add(g, box(5.9, .015, .12, "#C9BFA0"), .1, .05, -.9 + i * .30);
  add(g, box(6.4, .02, 1.1, "#9CB0AE"), 0, .045, 2.70);                                    // the tide's edge at the far side
  // the boiling copper on its fire: the one hot thing on the sand
  add(g, cyl(.42, .48, .42, "#7A6A58", 14), 1.35, .21, .55);
  const fire = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.07, .20, i % 2 ? LD.flameHot : LD.flame, 6), 1.35 + Math.cos(i * 1.6) * .14, .26, .55 + Math.sin(i * 1.6) * .14); f.name = "cockle-flame"; return f; });
  const copper = add(g, cyl(.40, .34, .34, LD.brass, 16), 1.35, .58, .55); copper.name = "cockle-copper";
  const water = add(g, cyl(.36, .36, .03, "#9CB0A8", 16), 1.35, .74, .55);
  const netBasket = add(g, new THREE.Group(), 1.35, .80, .55); netBasket.name = "cockle-basket";
  add(netBasket, cyl(.26, .21, .22, "#9C8A66", 12), 0, 0, 0);
  for (let i = 0; i < 9; i++) add(netBasket, ball(.042, "#D9CFB0", 6), Math.cos(i * .7) * .14, .10, Math.sin(i * .7) * .14).scale.y = .7;
  // the riddle over the heap: the subject
  const riddle = add(g, new THREE.Group(), -.75, .74, 1.15); riddle.name = "cockle-riddle";
  add(riddle, new THREE.Mesh(new THREE.TorusGeometry(.32, .035, 6, 16), mat("#9C8A66")), 0, 0, 0).rotation.x = Math.PI / 2;
  const mesh = add(riddle, cyl(.31, .31, .012, "#B4A88E", 18), 0, -.02, 0); mesh.material = mat("#B4A88E", { transparent: true, opacity: .85 });
  for (let i = 0; i < 11; i++) add(riddle, ball(.04, "#D9CFB0", 6), Math.cos(i * .95) * (.06 + (i % 3) * .07), .03, Math.sin(i * .95) * (.06 + (i % 3) * .07)).scale.y = .65;
  const sandFall = Array.from({ length: 9 }, (_, i) => { const s = add(g, ball(.018, "#CFC4A4", 5), -.75 + Math.cos(i) * .2, .6, 1.15 + Math.sin(i) * .2); s.visible = false; return s; });
  const heap = add(g, cyl(.40, .48, .16, "#C9BFA4", 16), -.75, .10, 1.15);
  for (let i = 0; i < 8; i++) add(heap, ball(.035, "#D9CFB0", 5), Math.cos(i * .8) * .26, .08, Math.sin(i * .8) * .26).scale.y = .6;
  // the sacks, the rake, the laverbread crock and the donkey with her cart
  for (let i = 0; i < 3; i++) { const s = add(g, cyl(.19, .22, .40, "#B4A488", 10), -1.85 + i * .34, .21, .40); s.rotation.z = (i - 1) * .1; add(g, cyl(.14, .14, .05, "#9C8A66", 10), -1.85 + i * .34, .42, .40); }
  const rake = add(g, new THREE.Group(), -1.55, 0, 1.75);
  add(rake, cyl(.02, .024, 1.7, LD.oak, 5), 0, .80, 0).rotation.x = .38;
  add(rake, box(.44, .05, .07, "#9C8A66"), 0, .06, -.32);
  for (let i = 0; i < 5; i++) add(rake, box(.025, .11, .025, LD.iron), -.18 + i * .09, -.02, -.32);
  const crock = add(g, cyl(.17, .14, .22, "#4A4238", 12), 1.90, .11, 1.30);
  add(g, cyl(.15, .15, .03, "#3A5A3A", 12), 1.90, .23, 1.30);
  // the donkey stands at the weather end of the shelter with her cart behind her, out of everyone's way
  const cart = add(g, cockleDonkey(), -2.55, 0, 1.9); cart.rotation.y = Math.PI / 2;
  for (let i = 0; i < 4; i++) add(cart, cyl(.15, .17, .30, "#B4A488", 10), -.3 + (i % 2) * .34, .78, -.2 + Math.floor(i / 2) * .3);
  g.userData.steam = V(1.35, .96, .55); g.userData.smoke = V(1.35, .60, .55);
  // seven people: the riddler, the woman at the copper, two gathering, a child, a man loading, a walker
  // she works the riddle from behind it, facing the visitor, so her own body never covers the sand falling
  const riddler = add(g, own(resident("fishwife")), -.75, 0, .48) as Figure; riddler.rotation.y = 0;
  arms(riddler).right.rotation.x = -1.5; arms(riddler).left.rotation.x = -1.5;
  const atCopper = add(g, own(resident("fishwife")), 1.35, 0, -.15) as Figure; atCopper.rotation.y = 0;
  arms(atCopper).right.rotation.x = -1.35;
  const gathering = [0, 1].map((i) => { const p = add(g, own(resident("shawl", false)), -1.75 + i * .65, 0, 2.95 + i * .1) as Figure; p.rotation.y = .4 - i * .5; arms(p).right.rotation.x = -1.2; upper(p).rotation.x = .38; return p; });
  const child = add(g, own(resident("child")), .45, 0, 3.30) as Figure; child.rotation.y = -2.6;
  const loader = add(g, own(resident("fishwife", false)), -2.78, 0, 3.0) as Figure; loader.rotation.y = Math.PI - .3;
  // the walker goes along the sand in front of the shelter, between the heap and the women gathering, and never
  // through the sacks, the copper or the donkey
  const walker = resident("shawl", false); add(g, walker, -1.0, 0, 2.15);
  const walk = pacer(walker, V(-1.0, 0, 2.15), V(2.6, 0, 2.2), .28, 1.0);
  const riddleRest = riddle.position.clone(), basketRest = netBasket.position.clone();
  void rake; void crock;
  return life(g, "cocklesUk", [riddler, atCopper, gathering[0], child, gathering[1], loader, walker], (t, k) => {
    fire.forEach((f, i) => { const s = .8 + Math.sin(t * 7 + i * 1.6) * .16 + beat(k, .1, .9) * .3; f.scale.set(s, s, s); });
    water.position.y = .74 + Math.sin(t * 2.0) * .004;
    // 1. the riddle first: it is shaken side to side and the sand falls through it in a curtain
    const shake = beat(k, 0, .60), sift = k > 0 ? clamp01(((1 - k) - .05) / .55) : 0;
    riddle.position.copy(riddleRest);
    riddle.position.x = riddleRest.x + shake * Math.sin(t * 18) * .13;
    riddle.position.y = riddleRest.y + shake * .06;
    riddle.rotation.z = shake * Math.sin(t * 16) * .14;
    sandFall.forEach((s, i) => { const a = clamp01(sift * 1.5 - (i % 4) * .15); s.visible = a > .05 && a < .98; s.position.set(riddleRest.x + Math.cos(i) * .18, riddleRest.y - .08 - a * .5, riddleRest.z + Math.sin(i) * .18); });
    // the basket lifts out of the copper as the second beat
    const lift = beat(k, .38, .96);
    netBasket.position.copy(basketRest); netBasket.position.y = basketRest.y + lift * .34;
    netBasket.rotation.z = lift * Math.sin(t * 9) * .08;
    // 2. the riddler's arms drive the shake, 3. the donkey's head turns
    arms(riddler).right.rotation.x = -1.5 - shake * .2; arms(riddler).left.rotation.x = -1.5 - shake * .2;
    upper(riddler).rotation.z = shake * Math.sin(t * 18) * .10;
    arms(atCopper).right.rotation.x = -1.35 - lift * .4;
    (cart.userData.donkey as { head: THREE.Group }).head.rotation.y = Math.sin(t * .4) * .1 + beat(k, .5, 1) * .7;
    walk(t);
  });
}

/**
 * The smokehouse on the Angus coast: a half whisky barrel sunk in the ground, a hardwood fire in the bottom, and
 * haddock tied in pairs over a speet. The speet is lowered over the pit and the smoke gusts up.
 */
export function smokehouse(): P {
  const g = group();
  // the curing yard: a flagged floor in front of the bothy, whose eave rail carries the lamps and the tied fish
  add(g, box(5.0, .06, 3.6, "#8E8C84"), 0, .03, .20);
  const lean = bothy(g);
  lamps(g, lean.y, lean.zFront, lean.xs, .75, false);
  drystone(g, 2.35, .6, 2.2, Math.PI / 2, .6);                                                   // a low wall on the sea side
  // the pit: a sunk barrel, the fire in it, and the hessian folded on the rim
  const pit = add(g, new THREE.Group(), .55, 0, .80);
  add(pit, cyl(.60, .56, .50, "#5A4632", 18), 0, .25, 0);
  for (const yy of [.10, .42]) add(pit, new THREE.Mesh(new THREE.TorusGeometry(.605, .025, 5, 18), mat(LD.iron)), 0, yy, 0).rotation.x = Math.PI / 2;
  add(pit, cyl(.54, .54, .06, "#2A2420", 16), 0, .30, 0);
  const embers = Array.from({ length: 5 }, (_, i) => { const e = add(pit, ball(.06, i % 2 ? "#D9541E" : "#8A2A16", 6), Math.cos(i * 1.26) * .26, .35, Math.sin(i * 1.26) * .26); return e; });
  const chips = Array.from({ length: 4 }, (_, i) => add(pit, box(.14, .04, .10, "#6E5236"), Math.cos(i * 1.6) * .18, .38, Math.sin(i * 1.6) * .18));
  const hessian = add(pit, box(.96, .05, .90, "#9C8A66"), 0, .56, .62); hessian.name = "smoke-hessian";
  // the speet of paired fish: the subject
  const speet = add(g, new THREE.Group(), .55, 1.22, .80); speet.name = "smoke-speet";
  add(speet, cyl(.022, .022, 1.15, LD.oak, 6), 0, 0, 0).rotation.z = Math.PI / 2;
  for (let i = 0; i < 4; i++) for (const side of [-1, 1]) {
    const fish = add(speet, ball(.10, LD.haddock, 8), -.38 + i * .25, -.16, side * .07);
    fish.scale.set(.62, 1.55, .58); fish.rotation.z = side * .12;
    add(speet, cyl(.006, .006, .14, "#C9BCA0", 4), -.38 + i * .25, -.06, side * .07);
  }
  // the posts the speet rests on between smokings, the salt tub, the finished smokies on the board
  for (const dx of [-.72, .72]) add(g, cyl(.06, .07, 1.30, LD.oak, 6), .55 + dx, .65, .80);
  add(g, box(1.6, .08, .12, LD.oak), .55, 1.34, .80);
  const tub = add(g, cyl(.26, .23, .34, LD.deal, 14), -1.30, .17, 1.00);
  for (let i = 0; i < 5; i++) add(tub, ball(.05, "#F2EEE0", 5), Math.cos(i * 1.26) * .13, .15, Math.sin(i * 1.26) * .13);
  add(g, box(1.1, .78, .62, LD.deal), -1.95, .39, 1.55);
  add(g, box(1.16, .06, .68, "#C9B89C"), -1.95, .81, 1.55);
  for (let i = 0; i < 4; i++) { const f = add(g, ball(.10, "#B4783A", 8), -2.25 + i * .2, .88, 1.55); f.scale.set(.6, 1.5, .55); f.userData.foodReaction = "hop"; }
  const ties = [0, 1].map((i) => { const s = add(g, new THREE.Group(), -.35 + i * .5, lean.y - .08, lean.zFront); s.userData.foodReaction = "sway"; add(s, cyl(.008, .008, .26, "#C9BCA0", 4), 0, -.13, 0); for (let n = 0; n < 3; n++) { const f = add(s, ball(.085, LD.haddock, 7), Math.cos(n * 2.1) * .08, -.34, Math.sin(n * 2.1) * .08); f.scale.set(.6, 1.5, .55); } return s; });
  g.userData.smoke = V(.55, .90, .80);
  // six people: the curer, his mate, two women tying pairs, a child, a walker along the wall
  // the curer stands on the far side of the pit, facing the visitor over it, so the speet is never behind him
  const curer = add(g, own(resident("curer")), .55, .06, -.30) as Figure; curer.rotation.y = 0;
  arms(curer).right.rotation.x = -1.45; arms(curer).left.rotation.x = -1.45;
  const mate = add(g, own(resident("curer")), 2.05, .06, .30) as Figure; mate.rotation.y = -1.6;
  arms(mate).right.rotation.x = -1.2;
  const tying = [0, 1].map((i) => { const p = add(g, own(resident("fishwife", false)), -2.25 + i * .0, .06, 2.95 + i * .55) as Figure; p.rotation.y = Math.PI - i * .3; arms(p).right.rotation.x = -1.35; arms(p).left.rotation.x = -1.3; return p; });
  const child = add(g, own(resident("child")), -.70, .06, 3.30) as Figure; child.rotation.y = 2.5;
  const walker = resident("highland", false); add(g, walker, -2.3, 0, -.78);
  const walk = pacer(walker, V(-2.3, 0, -.78), V(1.9, 0, -.8), .28, 1.3);
  const speetRest = speet.position.clone(), hessianRest = hessian.position.clone();
  void chips;
  return life(g, "smokehouseUk", [curer, tying[0], mate, child, tying[1], walker], (t, k) => {
    embers.forEach((e, i) => { const s = .85 + Math.sin(t * 4.5 + i * 1.4) * .14 + beat(k, .12, .9) * .45; e.scale.setScalar(s); });
    // 1. the fish first: the speet of paired haddock is lowered over the pit and the smoke gusts up
    const lower = hold(k, .26, .74);
    speet.position.copy(speetRest);
    speet.position.y = speetRest.y - lower * .52;
    speet.rotation.z = lower * .04 * Math.sin(t * 6);
    // 2. the hessian is thrown over the rim, 3. the curer steps back from the heat
    hessian.position.copy(hessianRest);
    const throwOver = beat(k, .44, .98);
    hessian.position.z = hessianRest.z - throwOver * .60; hessian.position.y = hessianRest.y + throwOver * .22;
    hessian.rotation.x = -throwOver * .5;
    arms(curer).right.rotation.x = -1.45 - lower * .3; arms(curer).left.rotation.x = -1.45 - lower * .3;
    upper(curer).rotation.x = -throwOver * .2;
    upper(mate).rotation.y = -1.9 + 1.9 - 1.9 + beat(k, .5, 1) * .4;
    ties.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.1 + i) * .05; });
    walk(t);
  });
}

/**
 * The distillery: a malting floor with barley turned by a wooden shiel, a pagoda vent over the kiln, and the
 * spirit safe where the still's run can be seen and never touched. The shiel turns the piece and the spirit runs.
 */
export function distillery(): P {
  const g = group();
  const sh = distilleryRange(g);
  lamps(g, sh.y, sh.zFront, [-1.75, 1.75], .8, false);
  // the pagoda vent on the kiln's pyramid, behind and to one side, so it never crosses the line to the floor
  const pagoda = add(g, new THREE.Group(), sh.pagoda.x, sh.pagoda.y, sh.pagoda.z); pagoda.name = "distillery-pagoda";
  add(pagoda, box(1.15, .10, 1.05, "#5A4A42"), 0, .05, 0);
  add(pagoda, cone(.80, .50, "#5A4A42", 4), 0, .34, 0).rotation.y = Math.PI / 4;
  add(pagoda, box(.60, .10, .55, "#5A4A42"), 0, .60, 0);
  const cowl = add(pagoda, cone(.42, .40, "#4A3E38", 4), 0, .82, 0); cowl.rotation.y = Math.PI / 4; cowl.name = "distillery-cowl";
  add(pagoda, cyl(.04, .05, .22, LD.iron, 6), 0, 1.10, 0);
  // the malting floor at the front: the piece of barley, the shiel that turns it
  // the malting floor is a raised timber floor, as it is in a real malting: the piece lies above head height of
  // nothing, but well clear of the ground, where the arrival camera reaches it over the people on the yard
  add(g, box(3.4, .60, 1.7, LD.moorGranite), -.30, .30, 1.05);
  add(g, box(3.5, .07, 1.8, "#B4A88E"), -.30, .63, 1.05);
  for (let i = 0; i < 7; i++) add(g, box(.42, .05, 1.8, "#A89C80"), -1.85 + i * .48, .68, 1.05);
  const piece = add(g, new THREE.Group(), -.55, .72, 1.05); piece.name = "distillery-barley";
  for (let i = 0; i < 12; i++) { const h = add(piece, ball(.17, "#D9C88A", 8), -.85 + (i % 6) * .34, 0, -.28 + Math.floor(i / 6) * .42); h.scale.set(1.25, .38, 1.05); }
  const shiel = add(g, new THREE.Group(), .55, .90, .58); shiel.name = "distillery-shiel";
  add(shiel, box(.44, .05, .30, "#C9B489"), 0, 0, 0);
  add(shiel, cyl(.024, .028, 1.5, LD.oak, 6), .04, .72, -.10).rotation.x = .30;
  const dust = Array.from({ length: 7 }, (_, i) => { const d = add(g, ball(.026, "#E4D6A8", 5), -.55 + Math.cos(i) * .3, .24, 1.05 + Math.sin(i) * .25); d.visible = false; return d; });
  // the spirit safe on its stand, the copper still behind it, the cask
  const still = add(g, new THREE.Group(), -1.55, 0, -.20);
  add(still, cyl(.42, .56, 1.10, LD.brass, 16), 0, .60, 0);
  add(still, cone(.42, .60, LD.brass, 16), 0, 1.42, 0);
  add(still, cyl(.09, .09, .60, LD.brass, 10), 0, 1.90, 0);
  const lyne = add(still, cyl(.075, .075, 1.20, LD.brass, 10), .55, 2.10, 0); lyne.rotation.set(0, 0, -1.05);
  add(g, box(.9, .68, .58, LD.oakSmoke), -.05, .34, -.30);
  const safe = add(g, new THREE.Group(), -.05, .82, -.30); safe.name = "distillery-safe";
  add(safe, box(.62, .40, .40, LD.brass), 0, 0, 0);
  add(safe, box(.50, .30, .03, LD.glass), 0, .02, .21).material = mat("#CFE0E4", { transparent: true, opacity: .55 });
  for (let i = 0; i < 2; i++) add(safe, cyl(.075, .075, .18, LD.brass, 10), -.14 + i * .28, -.04, .12);
  const spirit = add(safe, cyl(.012, .012, .26, "#E9E2C0", 6), -.14, .04, .12); spirit.name = "distillery-spirit";
  spirit.material = mat("#F2EAC8", { emissive: "#E9DCA0", emissiveIntensity: .3, transparent: true, opacity: .9 });
  const cask = add(g, cyl(.30, .26, .78, "#7A5236", 14), 1.55, .30, 1.30); cask.rotation.z = Math.PI / 2;
  for (const dx of [-.22, .22]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.295, .022, 5, 14), mat(LD.iron)), 1.55 + dx, .30, 1.30).rotation.y = Math.PI / 2;
  for (let i = 0; i < 3; i++) add(g, cyl(.13, .13, .05, LD.brass, 12), -1.90 + i * .26, .82, 1.30);
  add(g, box(1.0, .76, .56, LD.deal), -1.90, .38, 1.30);
  g.userData.steam = V(-1.55, 2.10, -.20); g.userData.smoke = V(sh.pagoda.x, sh.pagoda.y + 1.3, sh.pagoda.z);
  // seven people: the maltman, the stillman at the safe, two on the floor, a cooper, a child, a walker
  // he drives the shiel from behind it, facing the visitor down the floor, so the piece stays in front of him
  const maltman = add(g, own(resident("highland", false)), .95, 0, .02) as Figure; maltman.rotation.y = -.4;
  arms(maltman).right.rotation.x = -1.45; arms(maltman).left.rotation.x = -1.25;
  const stillman = add(g, own(resident("cook")), -.05, sh.floor, .35) as Figure; stillman.rotation.y = .1;
  arms(stillman).right.rotation.x = -1.1;
  const onFloor = [0, 1].map((i) => { const p = add(g, own(resident("highland", false)), -1.95 + i * .55, 0, 3.35 + i * .25) as Figure; p.rotation.y = Math.PI + (i - .5) * .4; arms(p).right.rotation.x = -1.2; return p; });
  const cooper = add(g, own(resident("farmer", false)), 2.05, 0, 2.95) as Figure; cooper.rotation.y = Math.PI + .2;
  arms(cooper).right.rotation.x = -1.3;
  const child = add(g, own(resident("child")), 2.45, 0, 1.60) as Figure; child.rotation.y = -2.2;
  const walker = resident("highland", false); add(g, walker, -2.8, 0, 3.70);
  const walk = pacer(walker, V(-2.8, 0, 3.70), V(2.8, 0, 3.75), .28, .6);
  const shielRest = shiel.position.clone();
  return life(g, "distilleryUk", [maltman, stillman, onFloor[0], child, onFloor[1], cooper, walker], (t, k) => {
    pagoda.rotation.y = Math.sin(t * .22) * .10 + beat(k, .3, 1) * .45;
    (spirit.material as THREE.MeshStandardMaterial).emissiveIntensity = .3 + Math.sin(t * 2.4) * .05 + beat(k, .2, .95) * .6;
    // 1. the material first: the shiel drives through the piece and the barley turns over in front of it
    const turn = hold(k, .24, .70);
    shiel.position.copy(shielRest);
    shiel.position.x = shielRest.x - turn * 1.05;   // it drives the piece ahead of it and never in front of it
    shiel.rotation.y = -turn * .25;
    // the whole piece is pushed along the floor and spread thinner as the shiel goes through it
    piece.position.x = -.55 - turn * .26; piece.position.y = .72;
    piece.scale.set(1 + turn * .20, 1 - turn * .18, 1 + turn * .06);
    piece.children.forEach((h, i) => {
      const reach = clamp01(turn * 1.3 - i * .06);
      h.rotation.x = reach * 1.1; h.position.y = reach * .07;
      h.scale.set(1.25 * (1 + reach * .08), .38 * (1 + reach * .5), 1.05);
    });
    dust.forEach((d, i) => { const a = clamp01(turn * 1.5 - (i % 4) * .2); d.visible = a > .1 && a < .95; d.position.set(-.55 + Math.cos(i) * .3 - turn * .5, .84 + a * .28, 1.05 + Math.sin(i) * .25); });
    // the spirit runs in the safe all the while, and harder on the click
    spirit.scale.set(1, 1 + Math.sin(t * 3) * .05 + turn * .3, 1);
    // 2. the maltman leans on the shiel, 3. the stillman at the safe watches the run
    arms(maltman).right.rotation.x = -1.45 - turn * .3; arms(maltman).left.rotation.x = -1.25 - turn * .3;
    upper(maltman).rotation.x = turn * .22;
    upper(stillman).rotation.x = beat(k, .45, 1) * .2;
    arms(stillman).right.rotation.x = -1.1 - beat(k, .45, 1) * .3;
    upper(child).rotation.y = beat(k, .55, 1) * .5;
    walk(t);
  });
}

// ---------- the ten ingredient and flavour stops ----------

/** The pastry board beside the pub: butter, flour and suet, and the four pastries a British kitchen turns out. */
export function bakeryCe(): P {
  const g = group();
  const sh = pastryShop(g);
  lamps(g, sh.y, sh.zFront, [-1.45, 1.45], .75);
  const top = .84;
  add(g, box(2.8, .80, .72, LD.deal), 0, .40, .90);
  add(g, box(2.9, .07, .80, "#C9B89C"), 0, top, .90);
  // the laminated block under the pin: the subject
  const block = add(g, new THREE.Group(), -.75, top + .10, .92); block.name = "pastry-block";
  add(block, box(.52, .14, .40, "#F2E4C0"), 0, 0, 0);
  for (let i = 0; i < 5; i++) add(block, box(.53, .012, .41, "#E9C46A"), 0, -.06 + i * .03, 0);
  const pin = add(g, new THREE.Group(), -.75, top + .24, .92); pin.name = "pastry-pin";
  add(pin, cyl(.052, .052, .58, "#C9A86A", 10), 0, 0, 0).rotation.z = Math.PI / 2;
  for (const dx of [-.36, .36]) add(pin, cyl(.026, .026, .14, "#B49458", 8), dx, 0, 0).rotation.z = Math.PI / 2;
  const flour = Array.from({ length: 7 }, (_, i) => { const f = add(g, ball(.022, "#F2EEE0", 5), -.75 + Math.cos(i) * .28, top + .20, .92 + Math.sin(i) * .22); f.visible = false; return f; });
  // the four pastries, the suet and the butter: modelled food
  for (let i = 0; i < 3; i++) { const p = add(g, cyl(.135, .125, .20, "#C9862A", 14), .42 + i * .32, top + .11, .84); p.userData.foodReaction = "hop"; add(g, cyl(.11, .11, .025, "#B4762A", 14), .42 + i * .32, top + .22, .84); }
  add(g, ball(.17, "#E4D6A8", 9), 1.42, top + .09, 1.18).scale.set(1.2, .5, .9);
  add(g, box(.24, .12, .18, "#F2E08A"), -1.45, top + .09, 1.14);
  add(g, cyl(.18, .16, .14, "#D9D2C2", 12), -1.45, top + .10, .74);
  for (let i = 0; i < 4; i++) add(g, ball(.038, "#E9E4D2", 5), -1.45 + Math.cos(i * 1.6) * .08, top + .19, .74 + Math.sin(i * 1.6) * .08);
  // three people: the baker, a customer, a boy with a tray
  const baker = add(g, own(resident("cook")), -.75, sh.floor, .30) as Figure; baker.rotation.y = 0;
  arms(baker).right.rotation.x = -1.45; arms(baker).left.rotation.x = -1.45;
  const customer = add(g, own(resident("lady", false)), .85, sh.floor, 1.48) as Figure; customer.rotation.y = Math.PI - .2;
  const boy = add(g, own(resident("child")), 1.55, sh.floor, .42) as Figure; boy.rotation.y = -.7;
  const blockRest = block.scale.clone(), pinRest = pin.position.clone();
  return life(g, "pastryCe", [baker, customer, boy], (t, k) => {
    // 1. the dough first: the pin rolls across the block, which spreads and thins under it, and flour puffs up
    const roll = beat(k, 0, .56), spread = beat(k, .06, .84);
    pin.position.copy(pinRest);
    pin.position.x = pinRest.x + Math.sin(t * .9) * .05 + roll * .34;
    pin.rotation.x = -(Math.sin(t * .9) * .05 + roll * .34) / .052;
    block.scale.copy(blockRest);
    block.scale.set(blockRest.x * (1 + spread * .28), blockRest.y * (1 - spread * .40), blockRest.z * (1 + spread * .10));
    flour.forEach((f, i) => { const a = clamp01(spread * 1.4 - (i % 3) * .2); f.visible = a > .1 && a < .95; f.position.set(-.75 + Math.cos(i) * (.22 + a * .2), top + .18 + a * .22, .92 + Math.sin(i) * (.18 + a * .16)); });
    // 2. the baker's arms drive the pin, 3. the customer leans over the counter
    arms(baker).right.rotation.x = -1.45 - roll * .30; arms(baker).left.rotation.x = -1.45 - roll * .30;
    upper(baker).rotation.x = roll * .18;
    upper(customer).rotation.x = beat(k, .45, 1) * .22;
    upper(boy).rotation.y = -.7 + .7 - .7 + beat(k, .5, 1) * .4;
  });
}

/** The oyster smacks at the river mouth: two shallow smacks moored, the Whitstable and Colchester natives on a
 *  barrel, and a man opening them with a short knife. The smacks are the only part of the stand in the water.
 *
 *  Second walkthrough 52 (2026-09-23): the barrel, the tray of opened natives, the basket, the boy and both
 *  mooring posts stood on the open strait east of the smacks, the boy on the water beside the second smack's
 *  bow and the basket floating. Everything but the two smacks now stands on the quay west of them, on the stone
 *  edge between the dock basin (z 12.7) and the dock road (z 15.2), x -37.7 to -36.3 in the world: the opener
 *  stands at his barrel facing the visitor, the tray is a trestle beside it, the boy and the basket are on the
 *  road side, and the two posts are short bollards on the quay's lip with the first smack's bow laid against
 *  them. The stand is turned -0.1, so the quay is at local x -3.4 to -2.0. Each smack is a group named
 *  `oyster-smack`, and `london-world.mjs` holds every other mesh of this stand to dry ground. */
export function oysterSmack(): P {
  const g = group();
  const boats = [0, 1].map((i) => {
    const b = add(g, new THREE.Group(), i ? -2.60 : .10, 0, i ? -1.85 : .25); b.rotation.y = i ? .42 : -.12; b.name = "oyster-smack";
    add(b, box(3.0, .46, 1.15, "#5A4632"), 0, -.02, 0);
    for (const end of [-1, 1]) { const tip = add(b, box(.62, .42, .74, "#5A4632"), end * 1.66, .06, 0); tip.rotation.z = end * .26; }
    add(b, box(2.9, .05, 1.02, "#8A6A48"), 0, .22, 0);
    for (const side of [-1, 1]) add(b, box(2.96, .14, .06, LD.oak), 0, .28, side * .58);
    add(b, cyl(.05, .07, 2.9, LD.oak, 8), -.20, 1.66, 0);
    add(b, cyl(.03, .04, 1.9, LD.oak, 6), .60, 1.10, 0).rotation.z = -.9;
    const sail = add(b, box(.03, 1.5, 1.6, "#A87A4A"), -.18, 1.55, .0); sail.rotation.z = .1; sail.name = i ? "" : "oyster-sail";
    for (let n = 0; n < 4; n++) add(b, cyl(.02, .02, .40, "#9C8A66", 4), -.20 + n * .0, .60 + n * .5, 0).rotation.x = Math.PI / 2;
    return b;
  });
  // the culch on the first smack's deck, where the dredge tipped it
  for (let i = 0; i < 9; i++) add(boats[0], ball(.06, "#8E8878", 6), -.5 + (i % 5) * .22, .27, -.15 + Math.floor(i / 5) * .26).scale.y = .4;
  // on the quay: the barrel with the native being opened, the knife, and the tray of opened natives on a trestle
  const QX = -2.61, QZ = 1.02;
  const barrel = add(g, cyl(.32, .28, .56, "#6E5236", 14), QX, .28, QZ);
  for (const yy of [.10, .46]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.315, .022, 5, 14), mat(LD.iron)), QX, yy, QZ).rotation.x = Math.PI / 2;
  const shell = add(g, new THREE.Group(), QX, .60, QZ); shell.name = "oyster-shell";
  const lower = add(shell, ball(.13, "#B4AC96", 8), 0, 0, 0); lower.scale.set(1, .32, .86);
  add(shell, cyl(.095, .095, .02, "#D9CFB8", 12), 0, .03, 0);
  const top = add(shell, ball(.13, "#9C9480", 8), 0, .06, 0); top.scale.set(1, .30, .86); top.name = "oyster-lid";
  add(g, box(.02, .015, .22, "#B9BCC0"), QX + .30, .59, QZ - .12);
  const TX = -3.19, TZ = .77;
  add(g, box(.95, .05, .50, "#9C8A66"), TX, .53, TZ);
  for (const [dx, dz] of [[-.40, -.19], [.40, -.19], [-.40, .19], [.40, .19]]) add(g, box(.05, .51, .05, LD.oak), TX + dx, .255, TZ + dz);
  for (let i = 0; i < 6; i++) { const o = add(g, ball(.115, "#A89C84", 7), TX - .28 + (i % 3) * .28, .58, TZ - .12 + Math.floor(i / 3) * .24); o.scale.set(1, .34, .86); o.userData.foodReaction = "hop"; }
  // two short bollards on the quay's lip, the first smack's bow against them, and a basket of natives packed in weed
  for (const [x, z] of [[-2.18, .27], [-2.03, 1.76]]) { add(g, cyl(.09, .11, .52, "#5A4A38", 8), x, .26, z); add(g, cyl(.12, .12, .06, "#4A3C2E", 8), x, .55, z); }
  const basket = add(g, cyl(.26, .21, .24, LD.straw, 12), -2.74, .12, 1.73);
  for (let i = 0; i < 7; i++) add(basket, ball(.06, "#A89C84", 5), Math.cos(i * .9) * .13, .12, Math.sin(i * .9) * .13).scale.y = .4;
  add(basket, box(.34, .03, .30, "#5A6E4A"), 0, .14, 0);
  // three people: the opener standing at his barrel on the quay, his mate on the second smack, a boy by the basket
  const opener = add(g, own(resident("fishwife", false)), QX - .16, 0, QZ - .62) as Figure; opener.rotation.y = .15;
  arms(opener).right.rotation.x = -1.30; arms(opener).left.rotation.x = -1.20;
  const mate = seatFigure(boats[1], resident("fishwife", false), -.35, -.12, 1.3, .30);
  arms(mate).right.rotation.x = -1.0;
  const boy = add(g, own(resident("child")), -3.31, 0, 1.59) as Figure; boy.rotation.y = 1.0;
  void barrel;
  const lidRest = top.position.clone();
  return life(g, "oystersUk", [opener, mate, boy], (t, k) => {
    boats.forEach((b, i) => { b.rotation.z = Math.sin(t * .85 + i * 1.7) * .035; b.position.y = Math.sin(t * .75 + i) * .025; });
    // 1. the oyster first: the knife goes in at the hinge and the top shell lifts away from the meat
    const open = hold(k, .24, .74);
    top.position.copy(lidRest);
    top.position.y = lidRest.y + open * .16; top.position.x = lidRest.x + open * .10;
    top.rotation.z = -open * .9;
    shell.rotation.y = Math.sin(t * .4) * .02 + open * .2;
    // 2. the opener's hands work the knife, 3. his mate looks across from the second smack
    arms(opener).right.rotation.x = -1.30 - open * .35;
    upper(opener).rotation.x = open * .18;
    upper(mate).rotation.y = beat(k, .45, 1) * .6;
    upper(boy).rotation.y = beat(k, .5, 1) * .5;
  });
}

/** The hop garden and its oast: bines twelve feet up the strings, a bin at the row end, and the cowl that turns
 *  to the wind. The oast is the stand's own building and stands behind the garden, off the arrival line. */
export function hopGarden(): P {
  const g = group();
  add(g, box(6.6, .05, 5.0, "#7FA84E"), 0, .025, .60);
  // the rows: wirework on chestnut poles, and the bines wound up the strings
  const bines: THREE.Group[] = [];
  for (let row = 0; row < 3; row++) {
    const z = -.60 + row * 1.35;
    for (const x of [-2.6, 2.6]) add(g, cyl(.07, .09, 3.1, "#6E5A42", 6), x, 1.55, z);
    add(g, cyl(.012, .012, 5.2, "#8A8070", 4), 0, 3.05, z).rotation.z = Math.PI / 2;
    for (let i = 0; i < 6; i++) {
      const bx = -2.1 + i * .84;
      add(g, cyl(.006, .006, 2.9, "#C9BCA0", 4), bx, 1.50, z);
      const bine = add(g, new THREE.Group(), bx, 0, z);
      if (row === 2 && i === 2) bine.name = "hop-bine";   // the front row, where nothing of the garden or the oast stands between it and the visitor
      for (let n = 0; n < 9; n++) {
        const a = n * 1.1, r = .085;
        add(bine, cyl(.016, .016, .34, "#6E8A42", 4), Math.cos(a) * r, .38 + n * .28, Math.sin(a) * r).rotation.set(.2, a, .3);
        add(bine, cone(.065, .15, "#9CB45A", 6), Math.cos(a) * (r + .13), .42 + n * .28, Math.sin(a) * (r + .13)).rotation.x = Math.PI;
        if (n % 2) add(bine, box(.14, .012, .12, "#5E7A38"), Math.cos(a) * (r + .10), .50 + n * .28, Math.sin(a) * (r + .10)).rotation.y = a;
      }
      bines.push(bine);
    }
  }
  // the oast: a roundel with a white cowl, the stand's own building, set back behind the rows.
  // Second walkthrough 59 (2026-09-23): what took one or two of the cookhouse's ten arrival rays at 10 of 66
  // moments was not the bines but this oast. The cookhouse's box moves with its walking picker, so its east rays
  // wander between x -52.9 and -52.4, and there they grazed the edge of the oast's cone roof and its turning cowl
  // vane at x -52.3. The oast stands 0.85 further east now, its roof at y 3.2 ending at x -51.6 and the vane's
  // sweep at -51.7, and the stowage moved to its west side, where it is 1.6 high and every ray passes over it at
  // 2.2 or more. The bines, which sway 0.02 rad about their feet, were never first on a ray.
  const oast = add(g, new THREE.Group(), 3.40, 0, -2.45); oast.name = "hop-oast";
  add(oast, cyl(1.05, 1.15, 2.4, LD.kentPeg, 16), 0, 1.20, 0);
  for (let i = 0; i < 3; i++) add(oast, new THREE.Mesh(new THREE.TorusGeometry(1.12 - i * .03, .035, 5, 18), mat("#8E4A2E")), 0, .5 + i * .8, 0).rotation.x = Math.PI / 2;
  add(oast, cone(1.10, 1.50, "#8E4A2E", 16), 0, 3.12, 0);
  const cowl = add(oast, new THREE.Group(), 0, 3.86, 0); cowl.name = "hop-cowl";
  add(cowl, cone(.42, .70, LD.whitewash, 12), 0, .18, 0);
  add(cowl, box(.30, .78, .05, LD.whitewash), 0, .12, .46);                                // the vane the wind turns
  add(cowl, cyl(.05, .06, .30, LD.whitewash, 8), 0, .52, 0);
  add(oast, box(1.4, 1.7, .10, LD.oakSmoke), 0, .85, 1.12);
  add(oast, box(1.9, 1.5, 1.6, "#C9B89C"), -1.55, .75, -.35);                                // the stowage beside it
  add(oast, box(2.05, .09, 1.75, LD.kentPeg), -1.55, 1.55, -.35);
  // the bin at the row end, the pokes of picked hops, the measurer's basket
  const bin = add(g, new THREE.Group(), -2.15, 0, 2.20);
  for (const dx of [-.62, .62]) for (const dz of [-.36, .36]) add(bin, cyl(.05, .06, .80, LD.oak, 6), dx, .40, dz);
  add(bin, box(1.36, .05, .84, "#9C8A66"), 0, .62, 0);
  for (let i = 0; i < 12; i++) { const h = add(bin, cone(.075, .16, "#8AA84A", 6), -.52 + (i % 6) * .21, .72, -.18 + Math.floor(i / 6) * .24); h.rotation.x = Math.PI; h.userData.foodReaction = "hop"; }
  for (let i = 0; i < 3; i++) add(g, cyl(.22, .26, .80, "#C9BCA0", 10), .10 + i * .42, .40, 2.55).rotation.z = (i - 1) * .06;
  // three people: the picker at the bine, the measurer at the bin, a child
  const picker = add(g, own(resident("picker", false)), -1.26, 0, 1.55) as Figure; picker.rotation.y = -.5;
  arms(picker).right.rotation.x = -1.9; arms(picker).left.rotation.x = -1.6;
  const measurer = add(g, own(resident("farmer", false)), -2.15, 0, 2.90) as Figure; measurer.rotation.y = Math.PI;
  arms(measurer).right.rotation.x = -1.2;
  const child = add(g, own(resident("child")), -1.45, 0, 2.55) as Figure; child.rotation.y = 2.4;
  const target = bines.find((b) => b.name === "hop-bine")!;
  return life(g, "hopsUk", [picker, measurer, child], (t, k) => {
    bines.forEach((b, i) => { b.rotation.z = Math.sin(t * .9 + i * .7) * .02; });
    cowl.rotation.y = Math.sin(t * .18) * .35 + beat(k, .3, 1) * .9;
    // 1. the bine first: it is pulled down off its string and swings over the bin
    const pull = hold(k, .24, .72);
    target.rotation.z = Math.sin(t * .9 + 1.4) * .02 - pull * .55;
    target.position.y = -pull * .30;
    target.children.forEach((c, i) => { c.rotation.z = (c.rotation.z || 0) * 0 + pull * .3 * Math.sin(i); });
    // 2. the picker's arms come down with it, 3. the measurer at the bin looks up
    arms(picker).right.rotation.x = -1.9 + pull * .9; arms(picker).left.rotation.x = -1.6 + pull * .7;
    upper(picker).rotation.x = -pull * .2;
    upper(measurer).rotation.x = -beat(k, .45, 1) * .25;
    upper(child).rotation.y = beat(k, .5, 1) * .6;
  });
}

/** The woods on the south coast: oak and hornbeam, field mushrooms in the ride and ceps under the beech, and a
 *  forager who lifts one clear of the leaf mould into her basket. */
export function mushroomWood(): P {
  const g = group();
  add(g, box(7.0, .05, 5.0, "#5F7A46"), 0, .025, .20);
  for (let i = 0; i < 26; i++) add(g, box(.16, .012, .12, i % 3 ? "#7A6A42" : "#8A6A38"), -3.2 + (i % 9) * .72, .06, -1.8 + Math.floor(i / 9) * 1.3).rotation.y = i;
  // five trees: oak and hornbeam, each with a heavy bole and a broken crown
  for (let i = 0; i < 5; i++) {
    const tr = add(g, new THREE.Group(), -2.9 + i * 1.45, 0, -1.70 + (i % 2) * .95);
    const h = 2.4 + (i % 3) * .45;
    add(tr, cyl(.20, .30, h, "#5A4632", 8), 0, h / 2, 0);
    for (let n = 0; n < 3; n++) add(tr, cyl(.06, .09, .9, "#5A4632", 5), Math.cos(n * 2.1) * .28, h * .82, Math.sin(n * 2.1) * .28).rotation.set(Math.sin(n * 2.1) * .6, 0, -Math.cos(n * 2.1) * .6);
    for (let n = 0; n < 4; n++) add(tr, ball(.72 - n * .06, n % 2 ? "#4E6E38" : "#5A7A3E", 7), Math.cos(n * 1.6) * .38, h + .35 + (n % 2) * .25, Math.sin(n * 1.6) * .34).scale.y = .8;
  }
  // the mushrooms: field mushrooms in a ring, ceps under the beech, and the one that is lifted
  const shrooms = Array.from({ length: 11 }, (_, i) => {
    const m = add(g, new THREE.Group(), -2.2 + (i % 6) * .78, 0, .95 + Math.floor(i / 6) * .85 + (i % 3) * .16);
    const kind = i % 3;
    add(m, cyl(.05, .07, .20, "#EFE8DA", 8), 0, .10, 0);
    const cap = add(m, ball(kind === 0 ? .17 : .13, kind === 0 ? "#8A5A38" : kind === 1 ? "#D9CFB4" : "#C98A3A", 9), 0, .22, 0);
    cap.scale.y = .55;
    if (kind === 0) for (let n = 0; n < 5; n++) add(m, box(.02, .012, .10, "#7A5A46"), Math.cos(n * 1.26) * .07, .19, Math.sin(n * 1.26) * .07).rotation.y = n * 1.26;
    if (i === 4) m.name = "wood-cep";
    m.userData.foodReaction = i === 4 ? undefined : "hop";
    return m;
  });
  const basket = add(g, cyl(.27, .22, .24, LD.straw, 12), 2.30, .13, 1.30);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.20, .016, 4, 12, Math.PI), mat("#9C8A66")), 2.30, .30, 1.30).rotation.y = Math.PI / 2;
  for (let i = 0; i < 5; i++) add(basket, ball(.09, i % 2 ? "#8A5A38" : "#C9A86A", 6), Math.cos(i * 1.26) * .13, .10, Math.sin(i * 1.26) * .13).scale.y = .6;
  // a fallen trunk with bracket fungus, and a woodcock's nest of leaves
  add(g, cyl(.19, .22, 2.4, "#4A3A2C", 8), -2.1, .20, 2.30).rotation.z = Math.PI / 2;
  for (let i = 0; i < 4; i++) add(g, cyl(.13, .13, .03, "#B4A070", 10), -2.7 + i * .42, .36, 2.30).rotation.x = .3;
  // three people: the forager, a boy with the basket, a keeper on the ride
  // she reaches down to the cep from beside it, not from in front of it
  const forager = add(g, own(resident("shawl", false)), 2.05, 0, .80) as Figure; forager.rotation.y = -1.9;
  arms(forager).right.rotation.x = -1.6; upper(forager).rotation.x = .42;
  const boy = add(g, own(resident("child")), 2.85, 0, 3.10) as Figure; boy.rotation.y = -2.0;
  const keeper = add(g, own(resident("farmer", false)), -2.55, 0, 2.95) as Figure; keeper.rotation.y = 1.2;
  add(keeper, cyl(.02, .02, 1.3, LD.oak, 4), .22, .70, .04).rotation.z = .12;
  const cep = shrooms[4], cepRest = cep.position.clone();
  return life(g, "mushroomsCe", [forager, boy, keeper], (t, k) => {
    shrooms.forEach((m, i) => { if (i === 4) return; m.rotation.z = Math.sin(t * .8 + i) * .012; });
    // 1. the mushroom first: the cep comes up out of the leaf mould, turns over and goes into the basket
    const lift = hold(k, .22, .68);
    cep.position.copy(cepRest);
    cep.position.y = cepRest.y + lift * .52;
    cep.position.x = cepRest.x + lift * .55; cep.position.z = cepRest.z + lift * .30;
    cep.rotation.x = lift * 1.1; cep.rotation.y = lift * .8;
    // 2. the forager's arm follows it up, 3. the boy holds the basket out
    arms(forager).right.rotation.x = -1.6 + lift * .6;
    upper(forager).rotation.x = .42 - lift * .30;
    upper(boy).rotation.y = beat(k, .45, 1) * .5;
    upper(keeper).rotation.y = Math.sin(t * .3) * .08 + beat(k, .5, 1) * .35;
  });
}

/** Hay as a painted surface: close downward strokes in two golds on the stack's combed sides; on the thatch,
 *  longer strokes in a greyer straw laid down the slope. */
const HAY_TEX: Record<string, THREE.CanvasTexture> = {};
function hayTexture(thatch: boolean): THREE.CanvasTexture {
  const key = thatch ? "thatch" : "hay"; if (HAY_TEX[key]) return HAY_TEX[key];
  const W = 128, H = 128, c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  let seed = thatch ? 17 : 13; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  ctx.fillStyle = thatch ? "#9a8452" : "#c4ad66"; ctx.fillRect(0, 0, W, H);
  const tones = thatch ? ["#b09a64", "#85703f", "#a38c56", "#6f5d36"] : ["#d8c27c", "#b39a52", "#cdb46c", "#a88f4c", "#e2cf92"];
  for (let i = 0; i < (thatch ? 700 : 900); i++) {
    const x = r() * W, y = r() * H, len = (thatch ? 8 : 5) + r() * (thatch ? 10 : 7), a = Math.PI / 2 + (r() - .5) * (thatch ? .35 : .9);
    ctx.strokeStyle = tones[Math.floor(r() * tones.length)]; ctx.lineWidth = thatch ? 1.2 : 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(thatch ? 2 : 2.5, thatch ? 1 : 1.2);
  HAY_TEX[key] = tex; return tex;
}

/** The dale flock: horned Swaledales hefted to their own fell, a drystone wall climbing out of sight, a pen at
 *  the top, and a shepherd with his crook. The lead ewe lifts her head and steps down the fell. */
export function daleFlock(): P {
  const g = group();
  add(g, box(7.0, .05, 5.2, "#9FB08A"), 0, .025, .20);
  for (let i = 0; i < 20; i++) add(g, ball(.16, i % 3 ? "#8AA070" : "#7E9464", 6), -3.2 + (i % 7) * .95, .06, -1.9 + Math.floor(i / 7) * 1.4).scale.y = .34;
  drystone(g, 0, -2.10, 6.6, 0, .66);
  drystone(g, -2.30, .60, 3.4, Math.PI / 2, .62);
  // the pen at the wall end: hurdles on stakes
  for (let i = 0; i < 4; i++) { const hz = 1.50 + i * .0, hx = 1.80 + i * .58; add(g, cyl(.045, .05, .90, LD.oak, 5), hx, .45, hz); for (let n = 0; n < 3; n++) add(g, box(.60, .06, .04, LD.oak), hx + .29, .26 + n * .22, hz); }
  // the flock: five horned ewes and two lambs, the nearest one the subject
  const sheep = Array.from({ length: 5 }, (_, i) => {
    const s = add(g, new THREE.Group(), -1.7 + i * .95, 0, 1.15 + (i % 2) * .62); s.rotation.y = -1.2 + (i % 3) * .5;
    if (i === 1) s.name = "flock-ewe";
    const body = add(s, ball(.40, "#D9D2C2", 9), 0, .56, 0); body.scale.set(1.35, .92, .85);
    for (let n = 0; n < 7; n++) add(s, ball(.14, "#CFC8B6", 6), -.34 + (n % 4) * .22, .72 + (n % 2) * .1, -.18 + Math.floor(n / 4) * .3);
    const head = add(s, new THREE.Group(), .52, .60, 0); head.name = i === 1 ? "flock-head" : "";
    add(head, box(.30, .20, .19, "#3A3630"), .08, 0, 0);
    add(head, ball(.10, "#3A3630", 6), .24, -.02, 0);
    for (const dz of [-.09, .09]) { const horn = add(head, new THREE.Mesh(new THREE.TorusGeometry(.10, .025, 5, 10, Math.PI * 1.4), mat("#C9BCA0")), -.02, .09, dz); horn.rotation.set(Math.PI / 2, 0, dz > 0 ? .4 : -.4); }
    const legs = [[-.24, -.16], [-.24, .16], [.24, -.16], [.24, .16]].map(([dx, dz]) => {
      const leg = add(s, new THREE.Group(), dx, .40, dz);
      add(leg, box(.075, .40, .08, "#3A3630"), 0, -.20, 0);
      return leg;
    });
    return { root: s, head, legs, body };
  });
  const lambs = [0, 1].map((i) => {
    const l = add(g, new THREE.Group(), 1.15 + i * .60, 0, 2.30 - i * .40); l.rotation.y = 1.0 - i * .6; l.scale.setScalar(.62);
    add(l, ball(.36, "#E4DED0", 8), 0, .52, 0).scale.set(1.3, .9, .85);
    add(l, box(.26, .18, .17, "#3A3630"), .46, .56, 0);
    for (const [dx, dz] of [[-.2, -.14], [-.2, .14], [.2, -.14], [.2, .14]]) add(l, box(.07, .38, .07, "#3A3630"), dx, .20, dz);
    return l;
  });
  // the fleece on the wall, the shepherd's crook, and the winter's hay in one long stack
  for (let i = 0; i < 3; i++) add(g, ball(.20, "#CFC4AA", 7), -2.85 + i * .34, .78, -2.00).scale.set(1.1, .6, .9);
  // Second walkthrough 6 (2026-09-23): the two round ricks, banded cylinders under pointed caps, read from above as
  // beehives. The hay is one rectangular stack now, the shape a Dales field barn's winter stack took outside: a long
  // block of hay on a bed of stones, its sides combed down and swelling a little under the eaves, and a hipped
  // thatch roped over and weighted with stones. Painted, not built of strips: stripes of wood on the sides read as
  // a shed. Long side to the camera, where the ricks stood.
  {
    const stack = add(g, new THREE.Group(), 2.95, 0, -.80); stack.name = "flock-rick"; stack.rotation.y = -.18;
    const L = 1.9, D = 1.0, H = .95;
    const hayMat = new THREE.MeshStandardMaterial({ map: hayTexture(false), roughness: 1 });
    const thatchMat = new THREE.MeshStandardMaterial({ map: hayTexture(true), roughness: 1 });
    for (let i = 0; i < 9; i++) add(stack, box(.20, .08, .16, "#8A8880"), -L / 2 + .1 + (i % 5) * (L - .2) / 4, .04, i < 5 ? -D / 2 + .08 : D / 2 - .08);
    add(stack, new THREE.Mesh(new THREE.BoxGeometry(L, H * .62, D), hayMat), 0, .06 + H * .31, 0);
    add(stack, new THREE.Mesh(new THREE.BoxGeometry(L + .10, H * .38, D + .10), hayMat), 0, .06 + H * .81, 0);   // the swell under the eaves
    const roofGeo = new THREE.ConeGeometry(.78, .62, 4, 1); roofGeo.rotateY(Math.PI / 4);                     // square, sides on the axes
    const roof = add(stack, new THREE.Mesh(roofGeo, thatchMat), 0, .06 + H + .31, 0);
    roof.scale.set((L + .28) / 1.1, 1, (D + .28) / 1.1);                                                         // a hipped thatch, eaves all round
    for (const x of [-.45, .45]) for (const side of [-1, 1]) {                                                    // two ropes over it, a stone at each eave
      strut(stack, V(x * .55, .06 + H + .52, 0), V(x, .06 + H + .02, side * (D / 2 + .12)), .012, "#4A3C28", 3);
      add(stack, ball(.08, "#8A8680", 5), x, .06 + H - .04, side * (D / 2 + .13));                               // no rope hangs free below it
    }
  }
  // three people: the shepherd, a boy, and a woman coming up the wall side
  const shepherd = add(g, own(resident("farmer", false)), -2.35, 0, 2.55) as Figure; shepherd.rotation.y = 1.1;
  const crook = add(shepherd, cyl(.022, .022, 1.5, LD.oak, 5), .24, .78, .04);
  add(shepherd, new THREE.Mesh(new THREE.TorusGeometry(.10, .018, 4, 10, Math.PI * 1.3), mat("#C9BCA0")), .24, 1.55, .04).rotation.set(0, Math.PI / 2, .4);
  const boy = add(g, own(resident("child")), -1.55, 0, 2.85) as Figure; boy.rotation.y = 1.5;
  const wife = add(g, own(resident("mill", false)), 2.70, 0, 2.60) as Figure; wife.rotation.y = -1.8;
  const leadRest = sheep[1].root.position.clone();
  void crook; void lambs;
  return life(g, "sheepUk", [shepherd, boy, wife], (t, k) => {
    sheep.forEach((s, i) => {
      if (i === 1) return;
      s.head.rotation.x = .18 + Math.sin(t * .35 + i) * .06;
      s.root.rotation.y = -1.2 + (i % 3) * .5 + Math.sin(t * .22 + i) * .03;
      animalGait(s.legs, 0, 0);
    });
    // 1. the animal first: the lead ewe lifts her head off the grass and takes two steps down the fell
    const lift = beat(k, 0, .46), step = beat(k, .16, .84);
    const lead = sheep[1];
    lead.head.rotation.x = .30 - lift * .62;
    lead.head.rotation.y = lift * .35;
    lead.root.position.copy(leadRest);
    lead.root.position.z = leadRest.z + step * .62;
    lead.root.position.y = Math.abs(Math.sin(step * Math.PI * 2)) * .015;
    animalGait(lead.legs, step * Math.PI * 4, step);
    lead.body.rotation.z = Math.sin(step * Math.PI * 4) * .03;
    // 2. the shepherd's crook comes up, 3. the boy turns to look
    arms(shepherd).right.rotation.x = -.2 - beat(k, .40, 1) * .8;
    upper(shepherd).rotation.y = beat(k, .40, 1) * .3;
    upper(boy).rotation.y = beat(k, .5, 1) * .7;
    upper(wife).rotation.y = Math.sin(t * .3) * .08;
  });
}

/** The forcing shed: nine square miles of them once, rhubarb grown in the dark and pulled by candlelight. The
 *  shed is the stand's own building; the click pulls a stick away from the crown with a crack. */
export function forcingShed(): P {
  const g = group();
  add(g, box(6.2, .05, 4.4, "#6E5A44"), 0, .025, .30);
  // the shed: long, low and black, its two doors swung wide on the street side so the dark inside can be seen,
  // and the forced rhubarb growing in rows in there by candlelight, which is the only place forced rhubarb grows
  const shed = add(g, new THREE.Group(), -1.30, 0, -1.30); shed.name = "rhubarb-shed";
  const sh = new THREE.Group(), tar = "#3A322C", x0 = -2.2, x1 = 2.2, zb = -1.1, zf = 1.1, h = 1.85, o0 = -.6, o1 = 1.8;   // the door opening, in shed coordinates
  add(sh, box(x1 - x0, .03, zf - zb, "#241E1A"), 0, .06, 0);                                                    // the black earth floor
  add(sh, box(x1 - x0, h, .12, tar), 0, h / 2, zb + .06);
  for (const sx of [-1, 1]) add(sh, box(.12, h, zf - zb, tar), sx * (x1 - .06), h / 2, 0);
  add(sh, box(o0 - x0, h, .12, tar), (x0 + o0) / 2, h / 2, zf - .06);
  add(sh, box(x1 - o1, h, .12, tar), (o1 + x1) / 2, h / 2, zf - .06);
  add(sh, box(o1 - o0, h - 1.45, .12, tar), (o0 + o1) / 2, 1.45 + (h - 1.45) / 2, zf - .06);                   // over the door
  for (let i = 0; i < 16; i++) add(sh, box(.03, h, .02, "#2A2420"), x0 + .15 + i * .28, h / 2, zf + .005);       // the boarding
  for (const [x, dir] of [[o0, -1], [o1, 1]] as [number, number][]) {                                           // the doors, swung back flat against the wall
    add(sh, box(1.18, 1.4, .06, "#4A3E34"), x + dir * .6, .72, zf + .06);
    for (const yy of [.3, 1.1]) add(sh, box(1.1, .08, .02, "#2E2620"), x + dir * .6, yy, zf + .1);
  }
  gableRoof(sh, x1 - x0, zf - zb, h, .55, COVERS.tarFelt, { over: .08, ends: tar, ridge: "#22201E" });
  add(sh, cyl(.08, .1, .9, "#2A2622", 8), x0 + .5, h + .5, -.4);                                               // the stove's flue
  shed.add(solid(sh));
  // inside: three rows of pale forced stalks with their small yellow leaves, and the candles between them
  const sticks: THREE.Group[] = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) {
    const x = -2.95 + i * .44 + (row % 2) * .2, z = -.62 - row * .44;
    const crown = add(g, new THREE.Group(), x, .09, z);
    for (let n = 0; n < 3; n++) {
      const st = add(crown, new THREE.Group(), 0, 0, 0);
      st.rotation.y = n * 2.1 + row + i;
      add(st, cyl(.022, .028, .52, "#D65A74", 6), .05, .27, 0).rotation.z = -.1;
      add(st, ball(.07, "#D2CC6A", 5), .08, .55, 0).scale.set(1.3, .6, 1.1);                                   // the crumpled little leaf
      if (row === 0 && i === 5 && n === 0) st.name = "rhubarb-stick";
      sticks.push(st);
    }
  }
  const candles = [[-2.6, -.84], [-1.3, -1.28], [0, -.84], [-.65, -1.72]].map(([x, z], i) => {
    const c = add(g, new THREE.Group(), x, .07, z);
    add(c, cyl(.02, .025, .16, "#E9E2CC", 8), 0, .08, 0);
    const fl = add(c, cone(.03, .09, LD.flameHot, 6), 0, .21, 0); fl.name = "rhubarb-candle";
    fl.material = mat(LD.flameHot, { emissive: "#F2A03C", emissiveIntensity: .9 });
    const glow = add(c, ball(.16, "#F2C46A", 8), 0, .22, 0); glow.material = mat("#F2C46A", { emissive: "#F2A03C", emissiveIntensity: .5, transparent: true, opacity: .22 });
    void i; return fl;
  });
  // out in the field, the crowns growing on in the open: each only a low rosette of big green leaves
  for (let bed = 0; bed < 2; bed++) for (let i = 0; i < 6; i++) {
    const x = -2.2 + i * .82, z = 1.05 + bed * 1.10;
    add(g, ball(.16, "#4A3A2C", 6), x, .05, z).scale.y = .4;
    for (let n = 0; n < 5; n++) {
      const leaf = add(g, ball(.2, n % 2 ? "#4E7A3A" : "#5A8A42", 7), x + Math.cos(n * 1.26 + bed) * .2, .12, z + Math.sin(n * 1.26 + bed) * .2);
      leaf.scale.set(1.2, .22, .9); leaf.rotation.y = -n * 1.26 - bed;
    }
    add(g, cyl(.018, .022, .14, "#9A3A4A", 5), x, .14, z);
  }
  // the crates the sticks go into, and a barrow of them at the door
  for (let i = 0; i < 3; i++) { const cr = add(g, box(.80, .26, .50, LD.deal), 1.55 + (i % 2) * .1, .13 + i * .27, 1.90); void cr; }
  for (let i = 0; i < 6; i++) add(g, cyl(.026, .03, .56, LD.rhubarb, 6), 1.35 + (i % 3) * .14, .92, 1.90).rotation.z = .1 + (i % 2) * .1;
  const barrow = add(g, costerBarrow(false), 2.55, 0, .35); barrow.rotation.y = -1.4;
  // three people: the puller on her knees, a man with the crate, a boy holding a candle
  // she pulls kneeling in the door, beside the row, and the boy holds a candle up for her
  const puller = add(g, own(resident("mill", false)), .05, .07, -.72) as Figure; puller.rotation.y = -1.9;
  arms(puller).right.rotation.x = -1.7; arms(puller).left.rotation.x = -1.3; upper(puller).rotation.x = .45;
  const crateMan = add(g, own(resident("farmer", false)), 1.95, 0, 2.35) as Figure; crateMan.rotation.y = -2.4;
  arms(crateMan).right.rotation.x = -1.3; arms(crateMan).left.rotation.x = -1.3;
  const boy = add(g, own(resident("child")), .75, 0, .35) as Figure; boy.rotation.y = -2.6;
  add(arms(boy).right, cyl(.02, .025, .12, "#E9E2CC", 6), 0, arms(boy).hand - .08, .02);
  add(arms(boy).right, cone(.025, .07, LD.flameHot, 6), 0, arms(boy).hand - .17, .02).material = mat(LD.flameHot, { emissive: "#F2A03C", emissiveIntensity: .9 });
  const target = sticks.find((s) => s.name === "rhubarb-stick")!;
  const targetRest = target.position.clone();
  return life(g, "rhubarbUk", [puller, crateMan, boy], (t, k) => {
    candles.forEach((f, i) => { const s = .85 + Math.sin(t * 6 + i * 1.8) * .18 + beat(k, .2, .95) * .3; f.scale.set(s, 1 + Math.sin(t * 8 + i) * .2, s); });
    sticks.forEach((s, i) => { if (s === target) return; s.rotation.z = Math.sin(t * .7 + i * .3) * .012; });
    // 1. the stick first: it is pulled away from the crown, comes clear with its leaf and goes into the crate
    const pull = hold(k, .24, .70);
    target.position.copy(targetRest);
    target.position.y = targetRest.y + pull * .46;
    target.position.x = targetRest.x + pull * .90; target.position.z = targetRest.z + pull * .55;
    target.rotation.z = pull * .9; target.rotation.x = pull * .25;
    // 2. the puller's arm follows it up, 3. the boy lifts the candle to see
    arms(puller).right.rotation.x = -1.7 + pull * .8;
    upper(puller).rotation.x = .45 - pull * .35;
    arms(boy).right.rotation.x = -.4 - beat(k, .45, 1) * .9;
    upper(crateMan).rotation.y = -2.4 + 2.4 - 2.4 + beat(k, .5, 1) * .35;
  });
}

/** The orchard and the cider pound: bittersweet apples nobody would eat, a horse walking a stone round the
 *  trough, and the cheese of pomace building under the press. The click shakes the trees and the apples fall. */
export function ciderOrchard(): P {
  const g = group();
  add(g, box(7.4, .05, 5.4, "#7E9455"), 0, .025, .30);
  const trees = Array.from({ length: 4 }, (_, i) => {
    const tr = add(g, new THREE.Group(), -2.85 + i * 1.45, 0, -1.55 + (i % 2) * .85);
    const h = 1.75 + (i % 3) * .25;
    add(tr, cyl(.19, .28, h, "#5A4632", 8), 0, h / 2, 0);
    const crown = add(tr, new THREE.Group(), 0, h, 0);
    for (let n = 0; n < 4; n++) add(crown, ball(.68 - n * .05, n % 2 ? "#4E6E38" : "#5E7E42", 7), Math.cos(n * 1.6) * .34, .32 + (n % 2) * .2, Math.sin(n * 1.6) * .30).scale.y = .82;
    const fruits = Array.from({ length: 7 }, (_, n) => add(crown, ball(.085, n % 3 ? "#C9A82A" : "#A8442A", 6), Math.cos(n * .9) * .56, .18 + (n % 3) * .22, Math.sin(n * .9) * .48) as THREE.Mesh);
    tr.userData.crown = crown; tr.userData.fruits = fruits;
    return tr;
  });
  // the pound: a circular stone trough, the runner stone, the shaft and the horse that walks the round
  const pound = add(g, new THREE.Group(), 1.70, 0, 1.55);
  add(pound, new THREE.Mesh(new THREE.TorusGeometry(1.05, .17, 6, 20), mat(LD.moorGranite)), 0, .20, 0).rotation.x = Math.PI / 2;
  add(pound, cyl(1.05, 1.05, .10, "#8A8880", 20), 0, .10, 0);
  for (let i = 0; i < 9; i++) add(pound, ball(.075, "#B4901E", 6), Math.cos(i * .7) * .88, .20, Math.sin(i * .7) * .88).scale.y = .7;
  add(pound, cyl(.14, .16, .90, LD.oak, 10), 0, .46, 0);
  const arm = add(pound, new THREE.Group(), 0, .58, 0); arm.name = "cider-arm";
  add(arm, cyl(.055, .055, 2.0, LD.oak, 8), .95, .18, 0).rotation.z = Math.PI / 2;
  const stone = add(arm, cyl(.46, .46, .22, LD.moorGranite, 18), .92, -.08, 0); stone.rotation.x = Math.PI / 2; stone.name = "cider-stone";
  // the press behind it: the cheese of pomace in straw, and the juice running into the tub
  const press = add(g, new THREE.Group(), -1.05, 0, 2.00);
  for (const dx of [-.50, .50]) add(press, box(.16, 1.65, .18, LD.oak), dx, .82, 0);
  add(press, box(1.25, .16, .26, LD.oak), 0, 1.62, 0);
  add(press, box(1.25, .12, .90, LD.oak), 0, .34, 0);
  const cheese = add(press, new THREE.Group(), 0, .44, 0); cheese.name = "cider-cheese";
  for (let i = 0; i < 4; i++) { add(cheese, box(.78, .09, .70, "#9C7A38"), 0, i * .12, 0); add(cheese, box(.84, .03, .76, LD.straw), 0, i * .12 + .06, 0); }
  add(press, cyl(.05, .05, .56, LD.iron, 10), 0, 1.24, 0);
  const tub = add(g, cyl(.30, .26, .36, LD.deal, 14), -1.05, .18, 2.75);
  add(g, cyl(.27, .27, .03, "#B4842A", 14), -1.05, .34, 2.75);
  // the horse, the baskets and a barrel cart
  const horse = horseBody(g, 3.40, 1.55, "#6E5236", -1.57);
  add(horse.root, box(.5, .14, .62, LD.oakSmoke), .1, 1.30, 0);
  add(horse.root, box(.06, .05, 1.9, LD.oak), -.55, 1.05, 0);
  const baskets = [V(-2.2, .28, 1.25), V(-.4, .28, .05), V(1.0, .28, -.55)];
  for (const b of baskets) { const bk = add(g, cyl(.30, .24, .30, LD.straw, 12), b.x, .15, b.z); for (let i = 0; i < 5; i++) add(bk, ball(.08, i % 2 ? "#C9A82A" : "#A8442A", 6), Math.cos(i * 1.26) * .14, .13, Math.sin(i * 1.26) * .14); }
  // three people: the pressman, the horse's lad, a woman with a basket
  const pressman = add(g, own(resident("farmer", false)), -1.05, 0, 2.80) as Figure; pressman.rotation.y = Math.PI;
  arms(pressman).right.rotation.x = -1.4; arms(pressman).left.rotation.x = -1.35;
  const lad = add(g, own(resident("child")), 2.85, 0, 2.70) as Figure; lad.rotation.y = -2.0;
  const woman = add(g, own(resident("shawl", false)), -2.90, 0, .55) as Figure; woman.rotation.y = -1.2;
  arms(woman).right.rotation.x = -1.2; upper(woman).rotation.x = .30;
  const shake = harvest(g, trees, baskets, .18);
  return life(g, "orchardUk", [pressman, lad, woman], (t, k, dt) => {
    // the horse walks the round whatever happens, and the stone turns with him
    arm.rotation.y = t * .22;
    horse.root.position.x = 1.70 + Math.cos(t * .22) * 1.70;
    horse.root.position.z = 1.55 + Math.sin(t * .22) * 1.70;
    horse.root.rotation.y = -t * .22 + Math.PI;
    animalGait(horse.legs, t * 2.4, 1);
    horse.head.rotation.z = Math.sin(t * .6) * .05;
    // 1. the fruit first: the nearest three trees are shaken and apples drop into the baskets
    shake.tick(t, k, dt);
    // 2. the pressman leans on the beam, 3. the woman straightens over her basket
    arms(pressman).right.rotation.x = -1.4 - beat(k, .35, .95) * .4;
    upper(pressman).rotation.x = beat(k, .35, .95) * .22;
    upper(woman).rotation.x = .30 - beat(k, .45, 1) * .3;
    upper(lad).rotation.y = beat(k, .5, 1) * .5;
  }, () => shake.poke());
}

/** The leek bed by a Welsh cottage: leeks earthed up in a trench, the cawl pot on the doorstep, and the emblem
 *  of a country growing in a garden. The click pulls one clear of the earth. */
export function leekBed(): P {
  const g = group();
  add(g, box(5.8, .05, 4.4, "#7E9455"), 0, .025, .30);
  // the cottage behind: a long low whitewashed house with a slate roof and a chimney at the gable
  add(g, box(3.4, 1.85, 2.0, LD.whitewash), -.85, .92, -1.85);
  add(g, box(3.6, .09, 2.2, "#4E5450"), -.85, 1.92, -1.85);
  for (const side of [-1, 1]) add(g, box(3.6, .08, 1.35, "#4E5450"), -.85, 2.16, -1.85 + side * .58).rotation.x = side * .62;   // each slope rises to the ridge
  chimney(g, -2.35, 2.10, -1.85, .75, 1);
  add(g, box(.72, 1.30, .07, LD.oakSmoke), -.35, .65, -.83);
  for (const dx of [-1.70, .55]) add(g, box(.62, .58, .05, LD.glass), dx, 1.10, -.83);
  // the bed: three rows of leeks in earthed-up ridges
  const leeks: THREE.Group[] = [];
  for (let row = 0; row < 3; row++) {
    const z = .55 + row * .80;
    add(g, box(4.6, .14, .46, "#5A4632"), .10, .09, z);
    for (let i = 0; i < 8; i++) {
      const l = add(g, new THREE.Group(), -1.95 + i * .55, .16, z);
      add(l, cyl(.055, .065, .34, "#E9E9DC", 8), 0, .17, 0);
      add(l, cyl(.05, .04, .22, LD.leek, 8), 0, .44, 0);
      for (let n = 0; n < 4; n++) { const bl = add(l, box(.07, .40, .02, n % 2 ? "#4E7A32" : LD.leek), Math.cos(n * 1.6) * .04, .68, Math.sin(n * 1.6) * .04); bl.rotation.set(Math.sin(n * 1.6) * .35, n * 1.6, -Math.cos(n * 1.6) * .35); }
      if (row === 1 && i === 3) l.name = "leek-pulled";
      leeks.push(l);
    }
  }
  const soil = Array.from({ length: 7 }, (_, i) => { const s = add(g, ball(.026, "#4A3A2C", 5), 0, .2, 1.35); s.visible = false; return s; });
  // the cawl pot on its trivet by the door, the crock of salt bacon, a spade and a basket
  add(g, cyl(.26, .22, .28, LD.iron, 14), -1.55, .28, .30);
  for (let i = 0; i < 3; i++) add(g, cyl(.02, .02, .30, LD.iron, 5), -1.55 + Math.cos(i * 2.1) * .15, .15, .30 + Math.sin(i * 2.1) * .15);
  add(g, cyl(.24, .24, .03, "#8A6A32", 14), -1.55, .42, .30);
  for (let i = 0; i < 5; i++) add(g, ball(.045, i % 2 ? LD.leek : "#C9862A", 5), -1.55 + Math.cos(i * 1.26) * .12, .45, .30 + Math.sin(i * 1.26) * .12);
  const crock = add(g, cyl(.19, .16, .30, "#4A4238", 12), -2.30, .15, .70); void crock;
  const spade = add(g, new THREE.Group(), 1.95, 0, .95);
  add(spade, cyl(.022, .026, 1.10, LD.oak, 5), 0, .58, 0).rotation.z = .16;
  add(spade, box(.24, .30, .04, "#9C9488"), -.10, .12, 0).rotation.z = .16;
  const basket = add(g, cyl(.27, .22, .26, LD.straw, 12), 2.10, .14, 1.90);
  for (let i = 0; i < 5; i++) add(basket, cyl(.05, .045, .34, "#E9E9DC", 6), Math.cos(i * 1.26) * .10, .16, Math.sin(i * 1.26) * .10).rotation.z = .2;
  // three people: the gardener on the bed, a woman at the pot, a child on the step
  const gardener = add(g, own(resident("farmer", false)), -.30, 0, 1.92) as Figure; gardener.rotation.y = Math.PI - .2;
  arms(gardener).right.rotation.x = -1.65; arms(gardener).left.rotation.x = -1.2; upper(gardener).rotation.x = .40;
  const cook = add(g, own(resident("shawl")), -1.55, 0, .95) as Figure; cook.rotation.y = Math.PI;
  arms(cook).right.rotation.x = -1.35;
  const child = add(g, own(resident("child")), -.35, 0, -.35) as Figure; child.rotation.y = .3;
  const target = leeks.find((l) => l.name === "leek-pulled")!;
  const targetRest = target.position.clone();
  return life(g, "leeksUk", [gardener, cook, child], (t, k) => {
    leeks.forEach((l, i) => { if (l === target) return; l.rotation.z = Math.sin(t * .8 + i * .4) * .02; });
    // 1. the leek first: it lifts clear of the ridge with the earth falling off its roots
    const pull = hold(k, .24, .70);
    target.position.copy(targetRest);
    target.position.y = targetRest.y + pull * .52;
    target.position.z = targetRest.z + pull * .46;
    target.rotation.z = pull * .55; target.rotation.x = pull * .3;
    soil.forEach((s, i) => { const a = clamp01(pull * 1.4 - (i % 4) * .18); s.visible = a > .1 && a < .96; s.position.set(targetRest.x + Math.cos(i) * .12, targetRest.y + pull * .5 - a * .45, targetRest.z + pull * .4 + Math.sin(i) * .10); });
    // 2. the gardener's arm rises with it, 3. the woman at the pot looks up
    arms(gardener).right.rotation.x = -1.65 + pull * .75;
    upper(gardener).rotation.x = .40 - pull * .35;
    upper(cook).rotation.y = beat(k, .45, 1) * .55;
    arms(cook).right.rotation.x = -1.35 - Math.abs(Math.sin(t * 1.1)) * .12;
    upper(child).rotation.y = .3 - .3 + beat(k, .5, 1) * .6;
  });
}

/** Standing oats as a painted surface: the top is a mat of open panicles, the sides close stalks under a band of
 *  spikelets hanging from them, greener at the foot than a wheat field and paler in the ear. */
const OAT_TEX: Record<string, THREE.CanvasTexture> = {};
function oatTexture(top: boolean): THREE.CanvasTexture {
  const key = top ? "top" : "side"; if (OAT_TEX[key]) return OAT_TEX[key];
  const W = 256, H = top ? 128 : 64;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  let seed = top ? 11 : 5; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  ctx.fillStyle = top ? "#c8bd78" : "#a9a466"; ctx.fillRect(0, 0, W, H);
  if (!top) {
    for (let x = 0; x < W; x += 2) { ctx.strokeStyle = r() < .5 ? "#c2b774" : "#8f9a58"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + r(), H); ctx.lineTo(x + (r() - .5) * 3, H * .3); ctx.stroke(); }
    const foot = ctx.createLinearGradient(0, H * .55, 0, H); foot.addColorStop(0, "rgba(70,80,40,0)"); foot.addColorStop(1, "rgba(70,80,40,.5)");
    ctx.fillStyle = foot; ctx.fillRect(0, 0, W, H);
  }
  // spikelets: small pale drops hanging on short curved threads from a stem, in loose open heads
  const heads = top ? 260 : 60, band = top ? H : H * .36;
  for (let i = 0; i < heads; i++) {
    const x = r() * W, y = r() * band;
    ctx.strokeStyle = "#9c9258"; ctx.lineWidth = .6;
    for (let k = 0; k < 4; k++) {
      const a = (r() - .5) * (top ? 6.2 : 1.6) + (top ? 0 : Math.PI / 2), len = 3 + r() * 4;
      const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = r() < .5 ? "#e9dfa8" : "#d6ca86"; ctx.beginPath(); ctx.ellipse(ex, ey, 1.3, 2.4, a, 0, Math.PI * 2); ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(top ? 1.2 : 1.6, 1);
  OAT_TEX[key] = tex; return tex;
}

/** The oat field and the meal mill: the grain that grows where wheat will not, a water wheel on the burn, three
 *  grades off the stone, and a girdle on the fire. The meal runs from the stone into the bin. */
export function oatMill(): P {
  const g = group();
  add(g, box(6.6, .05, 4.8, "#93A884"), 0, .025, .40);
  // Second walkthrough 55 (2026-09-23): forty single stalks, each a thin stick with a bead on top, stood in rows on
  // the bare plate and read as a bed of pins. The oats are one low block of standing crop now, as Italy's wheat is:
  // its sides painted with close stalks under a band of hanging spikelets, its top a mat of open panicles that
  // ripples as its texture slides in the wind. Knee-high at 0.32 (below the 0.35 a front-door test counts), it
  // stands in the stand's front west corner, west of the boy and clear of the bowls, and the ground under it is
  // the green of an oat field, not a pale bed.
  const oatTop = oatTexture(true), oatSide = oatTexture(false);
  const sideMat = new THREE.MeshStandardMaterial({ map: oatSide, roughness: .95 });
  const oatField = add(g, new THREE.Mesh(new THREE.BoxGeometry(1.75, .32, 1.30), [sideMat, sideMat,
    new THREE.MeshStandardMaterial({ map: oatTop, roughness: .95 }), new THREE.MeshStandardMaterial({ color: "#7A6A44" }), sideMat, sideMat]), -2.15, .16, 2.90);
  oatField.name = "oat-crop"; oatField.castShadow = true; oatField.receiveShadow = true;
  // the mill: a rubble building with a wheel on its gable and a lade running to it
  add(g, box(2.6, 2.4, 2.0, LD.moorGranite), -1.20, 1.20, -1.30);
  add(g, box(2.8, .09, 2.2, "#4E5450"), -1.20, 2.48, -1.30);
  for (const side of [-1, 1]) add(g, box(2.8, .08, 1.45, "#4E5450"), -1.20, 2.74, -1.30 + side * .62).rotation.x = side * .60;   // each slope rises to the ridge
  add(g, box(.66, 1.30, .08, LD.oakSmoke), -1.20, .65, -.28);
  add(g, box(.5, .5, .05, LD.glass), -2.10, 1.60, -.29);
  const wheel = add(g, new THREE.Group(), .45, 1.10, -1.30); wheel.name = "mill-wheel";
  add(wheel, new THREE.Mesh(new THREE.TorusGeometry(1.00, .07, 6, 20), mat(LD.oak)), 0, 0, -.28);
  add(wheel, new THREE.Mesh(new THREE.TorusGeometry(1.00, .07, 6, 20), mat(LD.oak)), 0, 0, .28);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; add(wheel, box(.20, .05, .60, "#8A7A5E"), Math.cos(a) * .95, Math.sin(a) * .95, 0).rotation.z = a; add(wheel, cyl(.02, .02, 1.9, LD.oak, 4), Math.cos(a) * .5, Math.sin(a) * .5, 0).rotation.z = a + Math.PI / 2; }
  add(g, cyl(.09, .09, .75, LD.iron, 10), .45, 1.10, -1.30).rotation.x = Math.PI / 2;
  add(g, box(1.0, .12, .70, LD.oak), 1.05, 1.95, -1.30);                                    // the lade that feeds it
  add(g, box(.96, .05, .58, "#7EA0A8"), 1.05, 2.02, -1.30);
  // the stone, the spout and the bin: the subject
  const stoneHouse = add(g, new THREE.Group(), .55, 0, .90);
  add(stoneHouse, box(1.1, .74, .96, LD.oak), 0, .37, 0);
  const runner = add(stoneHouse, cyl(.44, .44, .16, LD.moorGranite, 18), 0, .82, 0); runner.name = "mill-stone";
  add(stoneHouse, cyl(.46, .46, .08, "#7A7870", 18), 0, .70, 0);
  add(stoneHouse, cyl(.09, .09, .20, LD.iron, 10), 0, .96, 0);
  const hopper = add(stoneHouse, new THREE.Group(), 0, 1.30, 0);
  add(hopper, new THREE.Mesh(new THREE.CylinderGeometry(.34, .12, .42, 4), mat(LD.deal)), 0, 0, 0).rotation.y = Math.PI / 4;
  for (let i = 0; i < 6; i++) add(hopper, ball(.035, "#D9C88A", 5), Math.cos(i) * .14, .14, Math.sin(i) * .14);
  const spout = add(stoneHouse, box(.20, .06, .40, LD.deal), 0, .58, .62); spout.rotation.x = .38;
  const meal = add(g, new THREE.Group(), .55, .24, 1.85); meal.name = "oat-meal";
  add(meal, cone(.34, .40, "#E4D9B4", 14), 0, .20, 0);
  for (let i = 0; i < 5; i++) add(meal, ball(.032, "#EFE4C4", 5), Math.cos(i * 1.26) * .22, .04, Math.sin(i * 1.26) * .22);
  const bin = add(g, new THREE.Group(), .55, 0, 1.85);
  for (const dx of [-.46, .46]) add(bin, box(.06, .50, .90, LD.deal), dx, .25, 0);
  for (const dz of [-.45, .45]) add(bin, box(.98, .50, .06, LD.deal), 0, .25, dz);
  const grains = Array.from({ length: 8 }, (_, i) => { const m = add(g, ball(.022, "#E9DCB4", 5), .55, .70, 1.55); m.visible = false; return m; });
  // the girdle on its fire and three bowls of the three grades
  add(g, cyl(.34, .38, .28, "#6E6A5E", 14), 2.30, .14, 1.60);
  const fire = Array.from({ length: 3 }, (_, i) => add(g, cone(.06, .18, i % 2 ? LD.flameHot : LD.flame, 6), 2.30 + Math.cos(i * 2.1) * .12, .30, 1.60 + Math.sin(i * 2.1) * .12));
  const girdle = add(g, cyl(.34, .34, .04, LD.iron, 16), 2.30, .44, 1.60);
  for (let i = 0; i < 3; i++) { const oat = add(g, cyl(.13, .13, .02, "#E4D9B4", 12), 2.30 + Math.cos(i * 2.1) * .14, .48, 1.60 + Math.sin(i * 2.1) * .14); oat.userData.foodReaction = "hop"; }
  for (let i = 0; i < 3; i++) { add(g, cyl(.13, .11, .10, "#C9BCA0", 12), -2.30 + i * .38, .07, 1.35); add(g, cyl(.115, .115, .04, ["#E9DCB4", "#E4D9B4", "#DCD0A8"][i], 12), -2.30 + i * .38, .13, 1.35); }
  g.userData.steam = V(2.30, .70, 1.60); g.userData.smoke = V(2.30, .52, 1.60);
  // three people: the miller, a woman at the girdle, a boy with a sack
  const miller = add(g, own(resident("farmer", false)), 1.35, 0, 1.05) as Figure; miller.rotation.y = -1.5;
  arms(miller).right.rotation.x = -1.3;
  const baker = add(g, own(resident("highland", false)), 2.30, 0, 2.25) as Figure; baker.rotation.y = Math.PI;
  arms(baker).right.rotation.x = -1.45;
  const boy = add(g, own(resident("child")), -.35, 0, 2.05) as Figure; boy.rotation.y = 1.7;
  const mealRest = meal.scale.clone();
  return life(g, "oatsUk", [miller, baker, boy], (t, k) => {
    oatTop.offset.set(Math.sin(t * 1.1) * .012, Math.sin(t * .8) * .02);   // the heads ripple in the wind
    wheel.rotation.z = -t * .55;
    runner.rotation.y = t * 2.2;
    fire.forEach((f, i) => { const s = .85 + Math.sin(t * 7 + i * 1.5) * .15; f.scale.set(s, s, s); });
    // 1. the meal first: it runs out of the spout and the heap in the bin grows under it
    const run = hold(k, .22, .72);
    grains.forEach((m, i) => { const a = clamp01(run * 1.5 - (i % 4) * .16); m.visible = a > .06 && a < .98; m.position.set(.55 + Math.cos(i) * .06, .70 - a * .42, 1.62 + Math.sin(i) * .05 + a * .12); });
    meal.scale.copy(mealRest);
    meal.scale.set(mealRest.x * (1 + run * .22), mealRest.y * (1 + run * .40), mealRest.z * (1 + run * .22));
    // 2. the miller's hand goes to the hopper, 3. the woman at the girdle turns a bannock
    hopper.rotation.z = Math.sin(t * .8) * .02 + run * .06;
    arms(miller).right.rotation.x = -1.3 - run * .35;
    upper(miller).rotation.y = -.1 + run * .2;
    arms(baker).right.rotation.x = -1.45 - Math.abs(Math.sin(t * 1.2)) * .18 - beat(k, .45, 1) * .3;
    upper(boy).rotation.y = beat(k, .5, 1) * .6;
  });
}

/** The herring quay: the autumn fleet in, the farlane full, the three-woman crew gutting into the barrels and
 *  the cooper heading them up. The cran basket tips and the silver darlings spill into the trough. */
export function herringQuay(): P {
  const g = group();
  add(g, box(6.8, .10, 4.2, "#8E8C84"), 0, .05, .30);
  for (let i = 0; i < 14; i++) add(g, box(.44, .02, 4.2, i % 2 ? "#8A8880" : "#7E7C74"), -3.0 + i * .47, .11, .30);
  // the quay edge with its bollards, and beyond it on the hard a Fifie drifter drawn up on her keel, propped on
  // her legs for the tarring, her brown lugsail hoisted to dry: the hull of the boat the mast belongs to
  add(g, box(6.8, .22, .24, "#6E6A60"), 0, .16, -1.72);
  for (const x of [-2.2, .4, 2.6]) { add(g, cyl(.13, .16, .46, LD.iron, 10), x, .23, -1.60); add(g, cyl(.17, .14, .08, LD.iron, 10), x, .48, -1.60); }
  add(g, box(3.4, .05, 1.3, "#7E7A70"), .7, .025, -2.45);                                                // the hard she stands on
  for (let i = 0; i < 8; i++) add(g, box(.03, .012, 1.3, "#6A665C"), -.85 + i * .44, .055, -2.45);
  const boat = add(g, new THREE.Group(), .72, 0, -2.45); boat.name = "herring-drifter";
  const tar = "#2A2622", strake = "#3E6A5A";
  for (let i = 0; i < 3; i++) add(boat, box(.3, .22, .3, "#5A4A3A"), -1.0 + i * 1.0, .11, 0);             // the keel blocks
  add(boat, box(3.0, .12, .12, tar), 0, .28, 0);                                                          // the keel
  add(boat, box(2.3, .52, .84, tar), 0, .6, 0);
  add(boat, box(2.3, .38, .6, tar), 0, .4, 0);
  for (const end of [-1, 1]) {                                                                              // the Fifie's upright stem and stern
    const tip = add(boat, box(.42, .5, .6, tar), end * 1.3, .64, 0); tip.rotation.z = end * .08;
    add(boat, box(.2, .46, .34, tar), end * 1.58, .68, 0);
    add(boat, box(.08, .74, .12, LD.oak), end * 1.7, .72, 0);
  }
  for (const side of [-1, 1]) {
    add(boat, box(3.1, .1, .05, strake), 0, .82, side * .43);                                               // the painted strake
    add(boat, box(3.2, .06, .06, LD.oak), 0, .9, side * .42);                                               // the gunwale
    add(boat, box(.8, .05, .05, "#E9E2CC"), -.9, .64, side * .44);                                          // her port letters
    for (const x of [-.9, .2, 1.1]) strut(boat, V(x, .65, side * .42), V(x + .05, 0, side * .72), .035, LD.oak, 5);   // the legs she stands on
  }
  add(boat, box(2.9, .04, .8, "#8A6A48"), 0, .88, 0);
  add(boat, box(.6, .3, .5, "#6E5236"), .7, 1.05, 0);                                                     // the hatch coaming
  const mast = add(boat, new THREE.Group(), -.35, .88, 0);
  add(mast, cyl(.07, .09, 3.0, LD.oak, 8), 0, 1.5, 0);
  const yard = add(mast, cyl(.035, .04, 1.9, LD.oak, 6), .2, 2.6, .05); yard.rotation.z = Math.PI / 2 - .32;
  const sail = add(mast, box(1.7, 1.55, .03, "#8A5A36"), .22, 1.82, .06); sail.rotation.z = -.1;
  for (let i = 0; i < 3; i++) add(mast, box(1.6, .02, .035, "#6E4628"), .22, 1.4 + i * .36, .07).rotation.z = -.1;
  strut(boat, V(-.35, 3.7, 0), V(1.75, 1.05, 0), .01, "#5A4A32", 3);                                     // the forestay
  strut(boat, V(-.35, 3.7, 0), V(-1.7, 1.05, 0), .01, "#5A4A32", 3);
  // the farlane: a long trough of herring under salt, and the cran basket that tips into it
  const farlane = add(g, new THREE.Group(), -.30, 0, .95);
  add(farlane, box(3.0, .42, .90, LD.deal), 0, .32, 0);
  add(farlane, box(2.86, .05, .78, "#8A7A5E"), 0, .52, 0);
  const catchFish = Array.from({ length: 16 }, (_, i) => { const f = add(farlane, ball(.085, LD.herring, 7), -1.28 + (i % 8) * .36, .58, -.18 + Math.floor(i / 8) * .30); f.scale.set(.52, 1.5, .5); f.rotation.y = i * .4; f.userData.foodReaction = "hop"; return f; });
  const basket = add(g, new THREE.Group(), 1.60, .58, 1.00); basket.name = "herring-basket";
  add(basket, cyl(.40, .32, .46, "#9C8A66", 14), 0, 0, 0);
  for (let i = 0; i < 3; i++) add(basket, new THREE.Mesh(new THREE.TorusGeometry(.38 - i * .03, .022, 4, 14), mat("#8A7A56")), 0, -.16 + i * .18, 0).rotation.x = Math.PI / 2;
  const load = Array.from({ length: 9 }, (_, i) => { const f = add(basket, ball(.082, LD.herring, 7), Math.cos(i * .9) * .16, .18, Math.sin(i * .9) * .16); f.scale.set(.52, 1.4, .5); f.rotation.set(.3, i, .2); return f; });
  const spill = Array.from({ length: 7 }, (_, i) => { const f = add(g, ball(.08, LD.herring, 7), 1.2, .8, 1.0); f.scale.set(.52, 1.4, .5); f.visible = false; return f; });
  // the barrels, the cooper's block, the salt heap and the gutting knives
  for (let i = 0; i < 4; i++) { const br = add(g, cyl(.30, .26, .62, "#7A5236", 14), -2.35 + (i % 2) * .72, .31, 1.60 + Math.floor(i / 2) * .78); for (const yy of [.12, .50]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.295, .022, 5, 14), mat(LD.iron)), br.position.x, yy, br.position.z).rotation.x = Math.PI / 2; }
  add(g, cyl(.34, .38, .52, LD.oak, 12), -1.35, .26, 2.45);
  add(g, box(.28, .10, .10, LD.iron), -1.35, .58, 2.45);
  const salt = add(g, cone(.40, .46, "#F2EEE0", 14), 2.60, .28, 2.10);
  for (let i = 0; i < 5; i++) add(g, ball(.035, "#F6F2E6", 5), 2.60 + Math.cos(i * 1.26) * .30, .08, 2.10 + Math.sin(i * 1.26) * .30);
  void salt;
  // four people: three gutting at the farlane and the cooper at his block
  // the crew gut from the far side of the farlane, facing the street, so the card's camera sees the trough past them
  const crew = [-.85, -.10, .65].map((x, i) => {
    const p = add(g, own(resident("fishwife")), x, .10, .22) as Figure; p.rotation.y = 0;
    arms(p).right.rotation.x = -1.45; arms(p).left.rotation.x = -1.40; upper(p).rotation.x = .18;
    for (const side of [-1, 1]) wear(p, box(.06, .05, .05, "#D9CFC0"), side * .06, .62, .14);   // the bound fingers
    void i; return p;
  });
  const cooper = add(g, own(resident("highland", false)), -1.35, .10, 2.95) as Figure; cooper.rotation.y = Math.PI;
  arms(cooper).right.rotation.x = -1.6; arms(cooper).left.rotation.x = -1.2;
  const basketRest = basket.position.clone();
  return life(g, "herringUk", [crew[0], cooper, crew[1], crew[2]], (t, k) => {
    catchFish.forEach((f, i) => { f.position.y = .58 + Math.sin(t * .9 + i * .3) * .004; });
    // 1. the fish first: the cran basket tips over the farlane and the herring spill into the trough
    const tip = hold(k, .24, .70), pourOut = k > 0 ? clamp01(((1 - k) - .26) / .48) : 0;
    basket.position.copy(basketRest);
    basket.position.x = basketRest.x - tip * .62; basket.position.y = basketRest.y + tip * .30;
    basket.rotation.z = tip * 1.25;
    load.forEach((f, i) => { f.position.y = .18 - tip * .10 * (1 + (i % 3) * .2); });
    spill.forEach((f, i) => {
      const a = clamp01(pourOut * 1.5 - (i % 4) * .14);
      f.visible = a > .05 && a < .97;
      f.position.set(1.0 - a * .55, .92 - a * a * .36, .95 + Math.sin(i) * .18);
      f.rotation.set(a * 2.2, i, a * .8);
    });
    // 2. the crew's knives keep working, 3. the cooper's hammer comes down on the hoop
    crew.forEach((p, i) => { arms(p).right.rotation.x = -1.45 - Math.abs(Math.sin(t * 3.2 + i * 1.1)) * .22 - beat(k, .4, 1) * .12; });
    upper(crew[0]).rotation.y = beat(k, .45, 1) * .35;
    arms(cooper).right.rotation.x = -1.6 - Math.abs(Math.sin(t * 2.4)) * .35;
    upper(cooper).rotation.x = beat(k, .5, 1) * .18;
  });
}

// ---------- the six landmarks ----------

/**
 * Big Ben and the river front of the Palace of Westminster. The Clock Tower stands on its own feet at the east end
 * of the palace, the tallest thing in Westminster, well over twice the houses and stands round it: a panelled shaft,
 * the clock stage with a dial on each face, the open belfry where the bell hangs in sight, and the iron spire with
 * the Ayrton light in its lantern. The palace beside it is long and low, its buttresses carried up into pinnacles
 * with their own shafts and spirelets, the Central Tower's octagon on the roof and the Victoria Tower at the west
 * end, lower than the clock. The tower stands where the rays from the forcing shed and the distillery, north of it,
 * pass either side of it. On the click the minute hand steps a whole minute at a stroke, the dials warm, the bell
 * swings in the belfry and the light in the lantern comes up.
 */
export function bigBen(): P {
  const g = group();
  const stone = "#D6C8A0", shade = "#B8AA84", dark = "#4A5058", iron = "#4E5652", gilt = "#C9A23A";
  const s = new THREE.Group();
  // the palace: a long low range with buttresses, two rows of lancets, a parapet and a steep iron roof
  const x0 = -3.78, x1 = .35, pw = x1 - x0, pc = (x0 + x1) / 2, zb = -1.8, zf = .45, ph = 2.2;
  add(s, box(pw, ph, zf - zb, stone), pc, ph / 2, (zb + zf) / 2);
  add(s, box(pw + .1, .16, zf - zb + .1, shade), pc, ph + .08, (zb + zf) / 2);
  for (let i = 0; i < 12; i++) {
    const x = x0 + .2 + i * .355;
    for (const y of [.75, 1.6]) add(s, box(.14, .52, .04, dark), x + .17, y, zf + .02);
  }
  gableRoof(s, pw, zf - zb, ph + .12, .75, { colour: "#56605E", line: "#454E4C", every: .2, kind: "line" }, { x: pc, z: (zb + zf) / 2, over: .08, ends: stone, ridge: gilt });
  for (let i = 0; i < 18; i++) add(s, box(.03, .14, .03, gilt), x0 + .15 + i * .23, ph + .96, (zb + zf) / 2);   // the iron cresting on the ridge
  // the buttresses, carried up past the parapet into pinnacles: an octagonal shaft, a ring, a spirelet and a finial
  const pinnacle = (x: number, y: number, z: number, r: number) => {
    add(s, cyl(r, r * 1.1, .5, stone, 8), x, y + .25, z);
    add(s, cyl(r * 1.35, r * 1.35, .06, shade, 8), x, y + .52, z);
    add(s, cone(r * 1.25, .55, stone, 8), x, y + .82, z);
    for (let k = 0; k < 4; k++) add(s, box(.03, .06, .06, shade), x + Math.cos(k * 1.57) * r * .9, y + .72, z + Math.sin(k * 1.57) * r * .9);   // crockets
    add(s, ball(r * .5, gilt, 5), x, y + 1.12, z);
  };
  for (let i = 0; i < 6; i++) {
    const x = x0 + .35 + i * .71;
    add(s, box(.2, ph + .1, .14, shade), x, (ph + .1) / 2, zf + .06);
    pinnacle(x, ph + .16, zf + .06, .085);
  }
  for (const x of [x0 + .1, x1 - .1]) { add(s, cyl(.24, .26, ph + .5, stone, 8), x, (ph + .5) / 2, zf - .05); pinnacle(x, ph + .5, zf - .05, .14); }
  // the Central Tower's octagon and spire on the roof, and the Victoria Tower at the west end, lower than the clock
  add(s, cyl(.46, .5, 1.3, stone, 8), -1.5, ph + 1.0, -.7);
  for (let k = 0; k < 8; k++) add(s, box(.1, .7, .04, dark), -1.5 + Math.cos(k * .785) * .47, ph + 1.05, -.7 + Math.sin(k * .785) * .47).rotation.y = -k * .785 + Math.PI / 2;
  add(s, cone(.5, 1.45, "#6A7270", 8), -1.5, ph + 2.38, -.7);
  add(s, box(1.5, 4.5, 1.5, stone), -3.2, 2.25, -.7);
  for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) add(s, box(.16, .7, .04, dark), -3.2 + sx * .38, 1.0 + k * .95, .07);
  add(s, box(1.66, .18, 1.66, shade), -3.2, 4.55, -.7);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) pinnacle(-3.2 + sx * .7, 4.62, -.7 + sz * .7, .1);
  add(s, cyl(.02, .03, .6, iron, 4), -3.2, 4.95, -.7);
  // the Clock Tower: plinth, panelled shaft, the clock stage, the belfry piers, the spire and its lantern
  const T = V(1.0, 0, -.85), S = 1.2, shaftTop = 4.85, clockTop = 6.05, belTop = 6.9, dialY = shaftTop + .6;
  add(s, box(S + .2, .3, S + .2, shade), T.x, .15, T.z);
  add(s, box(S, shaftTop - .3, S, stone), T.x, .3 + (shaftTop - .3) / 2, T.z);
  for (let f = 0; f < 4; f++) {
    const face = add(s, new THREE.Group(), T.x, 0, T.z); face.rotation.y = f * Math.PI / 2;
    for (const dx of [-.36, 0, .36]) add(face, box(.06, shaftTop - .6, .04, shade), dx, .3 + (shaftTop - .6) / 2 + .15, S / 2 + .01);
    for (let k = 1; k < 5; k++) add(face, box(S + .02, .06, .05, shade), 0, .3 + k * .94, S / 2 + .01);
    for (let k = 0; k < 4; k++) for (const dx of [-.18, .18]) add(face, box(.12, .4, .03, dark), dx, .85 + k * .94, S / 2 + .02);
  }
  add(s, box(S + .16, clockTop - shaftTop, S + .16, stone), T.x, (shaftTop + clockTop) / 2, T.z);
  add(s, box(S + .26, .1, S + .26, shade), T.x, clockTop, T.z);
  for (let f = 0; f < 4; f++) {
    const face = add(s, new THREE.Group(), T.x, 0, T.z); face.rotation.y = f * Math.PI / 2;
    add(face, box(1.02, 1.02, .04, gilt), 0, dialY, (S + .16) / 2 + .01);                                       // the gilded surround
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) add(face, cone(.06, .12, gilt, 4), sx * .44, dialY + sy * .44, (S + .16) / 2 + .04).rotation.x = Math.PI / 2;
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    add(s, box(.22, belTop - clockTop - .05, .22, stone), T.x + sx * (S / 2 - .06), (clockTop + belTop) / 2, T.z + sz * (S / 2 - .06));
    pinnacle(T.x + sx * (S / 2 + .02), belTop + .06, T.z + sz * (S / 2 + .02), .08);
  }
  for (let f = 0; f < 4; f++) {                                                                                 // the belfry's arches, open between the piers
    const face = add(s, new THREE.Group(), T.x, 0, T.z); face.rotation.y = f * Math.PI / 2;
    add(face, box(.05, .6, .06, stone), 0, clockTop + .38, S / 2 - .06);
    for (const dx of [-.22, .22]) add(face, new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 4, 8, Math.PI), mat(stone)), dx, belTop - .28, S / 2 - .06);
    add(face, box(S - .3, .1, .06, stone), 0, belTop - .06, S / 2 - .06);
    add(face, box(S - .3, .06, .05, shade), 0, clockTop + .14, S / 2 - .06);
  }
  add(s, box(S + .24, .1, S + .24, shade), T.x, belTop + .02, T.z);
  add(s, cone(.8, .85, dark, 4), T.x, belTop + .5, T.z).rotation.y = Math.PI / 4;                              // the lower spire, in iron
  for (let k = 0; k < 4; k++) add(s, box(.04, .95, .04, gilt), T.x + Math.cos(k * 1.57 + .785) * .38, belTop + .5, T.z + Math.sin(k * 1.57 + .785) * .38).rotation.z = 0;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(s, cyl(.025, .025, .34, gilt, 4), T.x + sx * .14, belTop + 1.08, T.z + sz * .14);   // the lantern's posts
  add(s, box(.4, .05, .4, gilt), T.x, belTop + 1.26, T.z);
  add(s, cone(.26, .55, dark, 4), T.x, belTop + 1.55, T.z).rotation.y = Math.PI / 4;
  add(s, cyl(.015, .02, .22, gilt, 4), T.x, belTop + 1.9, T.z);
  add(s, ball(.06, gilt, 6), T.x, belTop + 1.84, T.z);
  // the terrace on the river and its balustrade, and New Palace Yard's railing east of the tower
  add(s, box(7.6, .40, .90, "#9C9488"), 0, .20, .95);
  for (let i = 0; i < 12; i++) add(s, box(.10, .34, .10, stone), -3.4 + i * .62, .58, 1.34);
  add(s, box(7.6, .10, .16, stone), 0, .78, 1.34);
  for (let i = 0; i < 14; i++) add(s, cyl(.012, .012, .7, "#2E2B2A", 4), 1.95 + i * .13, .75, -.55);
  add(s, box(1.9, .04, .04, "#2E2B2A"), 2.8, 1.05, -.55);
  g.add(solid(s));
  // the moving parts, outside the merged stone: four dials with their hands, the bell, the Ayrton light
  const dials = [0, 1, 2, 3].map((rot) => {
    const face = new THREE.Group(); face.rotation.y = rot * Math.PI / 2; face.position.set(T.x, dialY, T.z); g.add(face);
    const plate = add(face, cyl(.42, .42, .03, "#E9E2CC", 20), 0, 0, (S + .16) / 2 + .045); plate.rotation.x = Math.PI / 2;
    plate.material = mat("#F2EAD2", { emissive: "#E9C46A", emissiveIntensity: .08 });
    plate.name = rot === 0 ? "bigben-dial" : "";
    add(face, new THREE.Mesh(new THREE.TorusGeometry(.42, .03, 5, 20), mat(LD.iron)), 0, 0, (S + .16) / 2 + .06);
    for (let i = 0; i < 12; i++) add(face, box(.03, .08, .015, LD.iron), Math.sin(i * .524) * .34, Math.cos(i * .524) * .34, (S + .16) / 2 + .065);
    const hour = add(face, box(.04, .26, .015, LD.iron), 0, .1, (S + .16) / 2 + .075); hour.rotation.z = .9;
    const minute = add(face, box(.03, .38, .015, LD.iron), 0, .17, (S + .16) / 2 + .085);
    if (rot === 0) minute.name = "bigben-minute";
    Object.assign(face.userData, { minute, hour, plate });
    return face;
  });
  const bellPivot = add(g, new THREE.Group(), T.x, belTop - .22, T.z);
  add(g, box(S - .2, .06, .08, LD.oak), T.x, belTop - .2, T.z);
  const bell = add(bellPivot, new THREE.Mesh(new THREE.CylinderGeometry(.16, .27, .36, 12, 1, true), mat(LD.brass, { side: THREE.DoubleSide })), 0, -.3, 0); bell.name = "bigben-bell";
  add(bellPivot, ball(.05, LD.iron, 6), 0, -.52, 0);
  add(bellPivot, cyl(.012, .012, .12, LD.iron, 4), 0, -.08, 0);
  const light = add(g, ball(.1, "#F2E4A8", 8), T.x, belTop + 1.08, T.z); light.name = "bigben-ayrton";
  light.material = mat("#F2E4A8", { emissive: "#F2C85A", emissiveIntensity: .3 });
  // two people on the terrace and a lamp standard in the yard
  lampPost(g, 3.05, 1.30, 2.3);
  const member = add(g, own(resident("clerk", false)), 2.2, .40, 1.15) as Figure; member.rotation.y = -1.9;
  const constable = add(g, own(resident("coster", false)), -1.35, .40, 1.15) as Figure; constable.rotation.y = 1.7;
  let hands = 0;
  return life(g, "bigBen", [member, constable], (t, k, dt) => {
    // 1. the dial first: the minute hand steps a whole minute at a stroke, and the dials warm as at dusk
    hands += dt * (.22 + beat(k, 0, .55) * 9);
    const warm = .08 + beat(k, .05, .95) * .85;
    dials.forEach((face) => {
      const u = face.userData as { minute: THREE.Mesh; hour: THREE.Mesh; plate: THREE.Mesh };
      u.minute.rotation.z = -Math.floor(hands * 6) / 6;
      u.hour.rotation.z = .9 - hands * .08;
      (u.plate.material as THREE.MeshStandardMaterial).emissiveIntensity = warm;
    });
    // the bell swings in the open belfry and the light in the lantern comes up
    bellPivot.rotation.z = hold(k, .1, .85) * Math.sin(t * 3.2) * .42;
    bellPivot.rotation.x = beat(k, .15, .9) * Math.cos(t * 2.7) * .12;
    (light.material as THREE.MeshStandardMaterial).emissiveIntensity = .3 + beat(k, .1, .95) * 1.2;
    // 2. the member on the terrace turns to the tower, 3. the constable looks up
    upper(member).rotation.y = Math.sin(t * .3) * .08 + beat(k, .4, 1) * .5;
    upper(constable).rotation.x = -beat(k, .5, 1) * .22;
  });
}

/** Tower Bridge: two Gothic towers on granite piers, the high walkways between them, and the bascules that lift
 *  to let a steam coaster through. It is built to stand in the estuary and carries no road of its own. */
export function towerBridge(len = 9): P {
  const g = group();
  const stone = LD.portlandStone;
  for (const sd of [-1, 1]) {
    const x = sd * len * .38;   // the towers stand well out, so a lifted leaf is in open span, never behind a shaft
    add(g, box(2.1, .70, 3.4, "#8F857A"), x, .35, 0);                                      // the pier
    for (const sz of [-1, 1]) {
      add(g, box(1.30, 4.30, .95, stone), x, 2.85, sz * 1.15);
      for (let k = 0; k < 4; k++) add(g, box(.26, .50, .04, "#5A6A7A"), x, 1.60 + k * .80, sz * 1.15 + .50);
    }
    add(g, box(1.30, 1.10, 3.20, stone), x, 4.60, 0);
    add(g, box(1.50, .35, 3.40, stone), x, 5.30, 0);
    add(g, cone(.85, 1.35, LD.slateNorth, 4), x, 6.15, 0).rotation.y = Math.PI / 4;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(g, cone(.15, .80, stone, 4), x + sx * .58, 5.75, sz * 1.35);
  }
  // the high walkways and the blue ironwork of the approaches
  add(g, box(len * .76, .34, 1.30, "#3F6FB5"), 0, 3.85, 0);
  add(g, box(len * .76, .06, 1.42, stone), 0, 4.06, 0);
  for (let i = 0; i < 9; i++) add(g, box(.09, .55, .09, "#3F6FB5"), -len * .32 + i * (len * .08), 4.28, 0);
  add(g, box(len * .76, .10, 1.10, "#3F6FB5"), 0, 4.56, 0);
  for (const sd of [-1, 1]) {
    add(g, box(len * .22, .26, 2.30, "#3F6FB5"), sd * (len * .38 + len * .15), .95, 0);
    add(g, box(len * .22, .40, 2.10, "#8F857A"), sd * (len * .38 + len * .15), .48, 0);
    // The side spans hang from chains, as on the real bridge: on each side of the deck a chain runs from the tower's
    // outer face at walkway height down to the deck's far end, and four rods hang from it to the deck top, so
    // nothing stands on its own over the strait (residual fixes, 2026-09-23; the old rods stood free above the deck).
    const ax = sd * (len * .38 + .65), ay = 4.0, bx = sd * (len * .64 - .06), by = 1.15, deckTop = 1.08;
    for (const sz of [-1, 1]) {
      const chain = add(g, box(Math.hypot(bx - ax, ay - by), .12, .10, "#3F6FB5"), (ax + bx) / 2, (ay + by) / 2, sz * .85);
      chain.rotation.z = Math.atan2(by - ay, bx - ax);
      for (let k = 0; k < 4; k++) {
        const x = sd * (len * .38 + .8 + k * .45), cy = ay + (by - ay) * ((x - ax) / (bx - ax)), h = cy - deckTop;
        add(g, cyl(.03, .03, h, "#3F6FB5", 4), x, deckTop + h / 2, sz * .85);
      }
    }
  }
  // the bascules: two leaves hinged at the piers
  const leaves = [-1, 1].map((sd) => {
    const hinge = len * .38 - .65, leaf = add(g, new THREE.Group(), sd * hinge, .95, 0);
    const deck = add(leaf, box(hinge, .22, 2.30, "#3F6FB5"), -sd * hinge / 2, 0, 0);
    add(leaf, box(hinge, .06, 2.40, "#6E6A60"), -sd * hinge / 2, .13, 0);
    for (const sz of [-1, 1]) add(leaf, box(hinge, .34, .08, "#3F6FB5"), -sd * hinge / 2, .28, sz * 1.06);
    leaf.name = sd < 0 ? "bridge-bascule" : "";
    void deck;
    return { leaf, sd };
  });
  // a steam coaster waiting below, and two people on the north approach
  const coaster = add(g, new THREE.Group(), 0, 0, 3.90); coaster.name = "bridge-coaster";
  add(coaster, box(3.6, .60, 1.05, "#3A3630"), 0, .18, 0);
  for (const end of [-1, 1]) { const tip = add(coaster, box(.70, .55, .70, "#3A3630"), end * 2.0, .22, 0); tip.rotation.z = end * .30; }
  add(coaster, box(3.4, .10, .95, "#6E5A42"), 0, .50, 0);
  add(coaster, box(.90, .55, .80, "#C9BCA0"), -.90, .78, 0);
  const funnel = add(coaster, cyl(.20, .22, .90, "#7A2A24", 12), .30, .98, 0); funnel.name = "bridge-funnel";
  add(coaster, cyl(.21, .21, .14, LD.iron, 12), .30, 1.45, 0);
  add(coaster, cyl(.05, .06, 1.7, LD.oak, 6), 1.50, 1.35, 0);
  const watchers = [0, 1].map((i) => { const p = add(g, own(resident(i ? "shawl" : "coster", false)), -len * .56 + i * .7, 1.08, .80) as Figure; p.rotation.y = 1.4 - i * .3; return p; });
  return life(g, "towerBridge", [watchers[0], watchers[1]], (t, k) => {
    coaster.position.y = Math.sin(t * .7) * .035;
    coaster.rotation.z = Math.sin(t * .6) * .012;
    // 1. the bridge first: the two leaves swing up and hold open while the coaster comes through
    const raise = hold(k, .26, .74);
    // Each leaf's free end swings up, not down, and it stops at about 32 degrees rather than standing upright:
    // a leaf raised to the vertical folds back against its own tower, and from the arrival camera's own angle
    // the tower is then in front of it. Thirty-odd degrees keeps the lifted deck out over the span, where the
    // visitor sees the whole of it and the coaster passing underneath.
    leaves.forEach(({ leaf, sd }) => { leaf.rotation.z = -sd * raise * .55; });
    coaster.position.x = -2.2 + raise * 3.4;
    funnel.rotation.z = Math.sin(t * .9) * .01;
    // 2. one watcher steps back from the gate, 3. the other points at the coaster
    upper(watchers[0]).rotation.y = 1.4 - 1.4 + beat(k, .4, 1) * .5;
    arms(watchers[1]).right.rotation.x = -beat(k, .45, 1) * 1.3;
  });
}

/** The omnibus and the hansom cab at the Westminster stand, 1907: the knifeboard horse omnibus with its pair in the
 *  traces and the General's new motor omnibus standing beside it at the kerb, both in the same red, and one hansom
 *  waiting. The research's point is that the red livery came first on the horse buses and the motor bus arrived
 *  beside them, so the card's picture is the two side by side. */
export function omnibus(): P {
  const g = group();
  add(g, box(8.0, .07, 4.2, "#B8B4AD"), 0, .035, .30);
  for (let i = 0; i < 16; i++) add(g, box(.48, .02, 4.2, i % 2 ? "#B0ACA4" : "#BCB8B0"), -3.75 + i * .5, .08, .30);
  add(g, box(8.0, .16, .34, "#9C9890"), 0, .10, -1.85);                                     // the kerb
  // Second walkthrough 60 (2026-09-23): the three vehicles stood touching — the motor omnibus's side against the
  // horse omnibus's, the hansom's wheel against its other side, and the motor omnibus against the terminus loop
  // on the street outside, where the looping omnibus and hansom pass — so from above six horses and four vehicles
  // read as one pile-up. They stand in two ranks with half a unit between every body now: the horse omnibus and
  // its pair on the inner rank, the motor omnibus and the hansom nose to tail on the outer rank, and the strip
  // along the kerb holds only the conductor, the two waiting passengers, the trough and the lamp, so the nearest
  // vehicle is 1.4 clear of the looping traffic (which runs 0.2 further north than it did).
  const bus = add(g, horseOmnibus(), -2.16, .07, .39);
  const motor = add(g, motorOmnibus(), -2.27, .07, 2.55); motor.name = "motor-omnibus";
  const cab = add(g, hansomCab(true), 1.64, .07, 2.55);
  // the stand's own furniture: a cabmen's water trough, a post and a lamp standard
  add(g, box(1.2, .46, .52, LD.moorGranite), 3.45, .30, -1.30);
  add(g, box(1.06, .05, .40, "#9CB0B4"), 3.45, .53, -1.30);
  add(g, cyl(.09, .11, .90, LD.iron, 10), 3.85, .45, -.75);
  lampPost(g, -3.7, -1.55, 2.4);
  const body = bus.userData.bus as THREE.Group; body.name = "omnibus-body";
  const pair = bus.userData.pair as { root: THREE.Group; head: THREE.Group; legs: THREE.Group[] }[];
  const wheels = bus.userData.wheels as THREE.Group[];
  const cabman = (cab.userData.figures as Figure[])[0];
  const cabHorse = cab.userData.horse as { root: THREE.Group; head: THREE.Group; legs: THREE.Group[] };
  // the conductor stands on the pavement calling for passengers, so nobody rides standing
  const conductor = add(g, own(resident("carter", false)), -3.10, .07, -1.05) as Figure; conductor.rotation.y = .5;
  arms(conductor).right.rotation.x = -.9;
  const waiting = [0, 1].map((i) => { const p = add(g, own(resident(i ? "lady" : "clerk", false)), .95 + i * .55, .07, -1.10 + i * .15) as Figure; p.rotation.y = 2.8 - i * .4; return p; });
  const busRest = bus.position.clone();
  const figures = [conductor, waiting[0], waiting[1], ...(bus.userData.figures as Figure[]), cabman];
  return life(g, "redBus", figures, (t, k) => {
    pair.forEach((h, i) => { h.head.rotation.z = Math.sin(t * .5 + i) * .05; });
    cabHorse.head.rotation.z = Math.sin(t * .42) * .05;
    // 1. the vehicle first: the pair leans into the traces, steps off, and the omnibus rolls forward with them
    const off = hold(k, .28, .78);
    bus.position.copy(busRest);
    bus.position.x = busRest.x + off * .95;
    (body as THREE.Object3D).rotation.z = beat(k, 0, .4) * .03;
    wheels.forEach((w) => { w.rotation.z = -off * 2.6; });
    pair.forEach((h, i) => { animalGait(h.legs, t * 5.5 + i * 1.1, off); h.root.position.y = off * Math.abs(Math.sin(t * 5.5 + i)) * .02; h.head.rotation.x = -off * .16; });
    // 2. the cabman touches his hat, 3. a passenger waiting on the pavement turns to watch
    arms(cabman).right.rotation.x = -1.10 - beat(k, .42, .96) * 1.25;
    upper(cabman).rotation.y = Math.PI / 2 - Math.PI / 2 + beat(k, .42, .96) * .25;
    arms(conductor).right.rotation.x = -.9 - Math.abs(Math.sin(t * 1.1)) * .3 - beat(k, .2, .9) * .5;
    upper(waiting[0]).rotation.y = beat(k, .5, 1) * .55;
  });
}

/** The Penfold pillar box and the gas lamp beside it: hexagonal, acanthus-capped, and painted the green it was
 *  first painted before the red. The collection door swings open and the lamplighter's pole lights the mantle. */
export function pillarBox(): P {
  const g = group();
  add(g, box(4.6, .07, 3.2, "#B8B4AD"), 0, .035, .20);
  for (let i = 0; i < 9; i++) add(g, box(.48, .02, 3.2, i % 2 ? "#B0ACA4" : "#BCB8B0"), -2.1 + i * .5, .08, .20);
  add(g, box(4.6, .16, .30, "#9C9890"), 0, .10, -1.35);
  // the box itself: a hexagonal column, a beaded plinth, an acanthus cap and the aperture
  const post = add(g, new THREE.Group(), -.75, .07, .30); post.name = "pillar-post";
  add(post, cyl(.34, .36, .10, LD.postRed, 6), 0, .05, 0);
  add(post, cyl(.30, .32, 1.24, LD.postRed, 6), 0, .70, 0);
  for (let i = 0; i < 6; i++) add(post, box(.03, 1.20, .03, "#7A2018"), Math.cos(i * 1.047) * .29, .70, Math.sin(i * 1.047) * .29);
  add(post, box(.30, .045, .05, LD.iron), 0, 1.16, .31);                                     // the aperture
  add(post, box(.34, .05, .06, "#7A2018"), 0, 1.22, .31);
  const door = add(post, new THREE.Group(), 0, .56, .30); door.name = "pillar-door";
  add(door, box(.34, .58, .045, "#8A241C"), 0, 0, 0);
  add(door, cyl(.035, .035, .05, LD.iron, 8), .11, 0, .03);
  for (let i = 0; i < 3; i++) add(door, box(.24, .012, .05, "#E9E2CC"), 0, .18 - i * .11, .03);   // the collection plate
  const letters = Array.from({ length: 5 }, (_, i) => { const l = add(post, box(.16, .015, .11, "#E9E2CC"), .06, .40 + i * .03, .30); l.visible = false; l.rotation.z = (i - 2) * .12; return l; });
  add(post, cyl(.33, .30, .14, LD.postRed, 6), 0, 1.38, 0);
  for (let i = 0; i < 6; i++) { const leaf = add(post, box(.11, .22, .05, LD.postRed), Math.cos(i * 1.047) * .24, 1.52, Math.sin(i * 1.047) * .24); leaf.rotation.set(-.5, -i * 1.047, 0); }
  add(post, ball(.16, LD.postRed, 8), 0, 1.66, 0).scale.y = .8;
  add(post, cyl(.04, .05, .10, LD.postRed, 6), 0, 1.78, 0);
  // the lamp standard and the lamplighter with his pole
  const lamp = lampPost(g, .95, .30, 2.45);
  const pole = add(g, new THREE.Group(), 1.55, .07, 1.05); pole.name = "lamplighter-pole";
  add(pole, cyl(.022, .026, 2.60, LD.oak, 6), 0, 1.30, 0).rotation.z = .30;
  add(pole, cyl(.018, .018, .16, LD.brass, 6), -.40, 2.52, 0);
  const wick = add(pole, cone(.035, .11, LD.flameHot, 6), -.43, 2.62, 0); wick.name = "lamplighter-wick";
  // the post office handcart and a dog at the kerb
  const cart = add(g, costerBarrow(false), -2.10, .07, -.75); cart.rotation.y = .3;
  for (let i = 0; i < 3; i++) add(cart, box(.34, .22, .28, "#6E4A2A"), -.34 + i * .34, .98, 0);
  // three people: the lamplighter, a woman posting a letter, a boy watching
  const lighter = add(g, own(resident("coster", false)), 1.72, .07, 1.35) as Figure; lighter.rotation.y = -.5;
  arms(lighter).right.rotation.x = -2.0; arms(lighter).left.rotation.x = -1.5;
  // she posts from the side of the box, so the collection door facing the street stays in view
  const poster = add(g, own(resident("lady", false)), -1.50, .07, .45) as Figure; poster.rotation.y = 1.5;
  arms(poster).right.rotation.x = -1.35;
  const boy = add(g, own(resident("child")), -1.70, .07, .35) as Figure; boy.rotation.y = -1.4;
  return life(g, "phoneBox", [poster, lighter, boy], (t, k) => {
    // 1. the box first: the collection door swings open on its hinge and the letters inside show
    const open = hold(k, .26, .72);
    door.rotation.y = -open * 1.30;
    door.position.x = -open * .14;
    letters.forEach((l, i) => { l.visible = open > .3; l.position.z = .30 - open * .04; void i; });
    // the lamplighter's pole comes up to the mantle and it takes light
    const light = beat(k, .32, .96);
    pole.rotation.z = -light * .22; pole.position.y = .07 + light * .30;
    (wick.material as THREE.MeshStandardMaterial).emissive?.setHex?.(0);
    wick.scale.set(.8 + light * .5, 1 + Math.sin(t * 9) * .2 + light * .6, .8 + light * .5);
    const glass = lamp.glass.material as THREE.MeshStandardMaterial;
    glass.emissiveIntensity = .25 + Math.sin(t * .4) * .03 + light * .9;
    lamp.mantle.scale.setScalar(1 + light * .5);
    // 2. the woman's hand comes off the aperture, 3. the boy looks up at the lamp
    arms(poster).right.rotation.x = -1.35 + beat(k, .1, .7) * .5;
    upper(poster).rotation.y = beat(k, .1, .7) * .2;
    arms(lighter).right.rotation.x = -2.0 - light * .25;
    upper(boy).rotation.x = -beat(k, .5, 1) * .28;
  });
}

/**
 * The Forth Bridge: three cantilevers in Forth red, each a pair of tall towers on granite piers with its two arms
 * reaching out, the great tubes of the bottom chords sweeping up from the piers to the arm ends and the top chords
 * running down to them, so each reads as the diamond it is; two short suspended spans hang between the arm ends,
 * the second of them over the firth, and one continuous rail deck runs the whole length from the shore pier to the
 * far one. The train stands on the deck with its last coach inside the west end and runs east along it, stopping
 * over the suspended span with its engine still on the deck. No pier stands in the water, and no member of the
 * bridge ends over it: the suspended span's ends sit on the arm ends either side of the narrows. The flat blue
 * plate the old stand laid under itself is gone; the firth under the bridge is the Builder's water.
 */
export function forthBridge(): P {
  const g = group();
  const red = "#9A3326", dark = "#7A2820", granite = "#8E8C84";
  const s = new THREE.Group();
  add(s, box(4.2, .40, 3.0, granite), -3.60, .20, .20);                                                      // the shore it stands on
  const a = 1.4, deck = 3.1, centres = [-3.9, .1, 4.7];   // the second span's ends stand on land either side of the narrows
  for (const c of centres) {
    // the piers, the towers and their lateral bracing
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      add(s, cyl(.3, .36, .5, granite, 10), c + sx * .3, .25, sz * .8);
      strut(s, V(c + sx * .3, .5, sz * .8), V(c + sx * .3, 5.35, sz * .5), .1, red, 8);
    }
    for (const y of [1.6, 3.0, 4.4]) { const zz = .8 - (y - .5) / 4.85 * .3; for (const sx of [-1, 1]) strut(s, V(c + sx * .3, y, -zz), V(c + sx * .3, y, zz), .05, red, 6); }
    for (const sx of [-1, 1]) for (const [y0, y1] of [[.6, 2.3], [2.3, 4.0]] as [number, number][]) {
      const z0 = .8 - (y0 - .5) / 4.85 * .3, z1 = .8 - (y1 - .5) / 4.85 * .3;
      strut(s, V(c + sx * .3, y0, -z0), V(c + sx * .3, y1, z1), .035, red, 5); strut(s, V(c + sx * .3, y0, z0), V(c + sx * .3, y1, -z1), .035, red, 5);
    }
    for (const sz of [-1, 1]) {
      add(s, box(.7, .22, .12, red), c, 5.38, sz * .5);
      strut(s, V(c - .3, 3.0, sz * .66), V(c + .3, 3.0, sz * .66), .05, red, 6);
      for (const sx of [-1, 1]) {
        // an arm: the bottom chord from the pier up to the arm end, the top chord from the tower head down to it
        const tip = c + sx * a, zt = sz * .62, mid = c + sx * a * .55;
        strut(s, V(c + sx * .3, .55, sz * .8), V(mid, 1.9, sz * .7), .13, red, 8);
        strut(s, V(mid, 1.9, sz * .7), V(tip, deck - .05, zt), .12, red, 8);
        strut(s, V(c + sx * .3, 5.3, sz * .5), V(tip, deck + .3, zt), .08, red, 6);
        // the web between the chords
        strut(s, V(mid, 1.9, sz * .7), V(mid, 4.3 - (a * .25) * 1.4, sz * .56), .045, red, 5);
        strut(s, V(c + sx * .3, 2.6, sz * .74), V(mid, 4.3 - (a * .25) * 1.4, sz * .56), .035, red, 5);
        strut(s, V(mid, 1.9, sz * .7), V(tip - sx * .2, deck + .25, zt), .035, red, 5);
        strut(s, V(tip, deck - .05, zt), V(tip, deck + .3, zt), .05, red, 5);
      }
    }
  }
  // the suspended spans, each hung between two arm ends: chords, end posts and one cross of diagonals a side
  for (let k = 0; k < 2; k++) {
    const x0 = centres[k] + a, x1 = centres[k + 1] - a;
    for (const sz of [-1, 1]) {
      const z = sz * .6;
      add(s, box(x1 - x0 + .1, .1, .08, dark), (x0 + x1) / 2, deck + .5, z);
      bar(s, V(x0 + .05, deck, z), V(x1 - .05, deck + .5, z), .05, .05, dark);
      bar(s, V(x0 + .05, deck + .5, z), V(x1 - .05, deck, z), .05, .05, dark);
    }
  }
  // the continuous deck and its rails, from the shore pier to the far pier, and the two end piers
  add(s, box(12.0, .16, 1.0, dark), .4, deck, 0);
  for (const sz of [-1, 1]) add(s, box(12.0, .03, .05, "#3A3A3A"), .4, deck + .1, sz * .2);
  for (let i = 0; i < 30; i++) { const x = -5.5 + i * .4; if (x < 1.4 || x > 3.4) add(s, box(.08, .03, .6, "#5A4632"), x, deck + .09, 0); }
  add(s, box(.7, deck - .48, 1.1, granite), -5.35, .4 + (deck - .48) / 2, 0);                               // the shore pier, on the shore
  add(s, box(.7, deck - .08, 1.1, granite), 6.2, (deck - .08) / 2, 0);                                       // the far pier
  g.add(solid(s));
  // the train on the deck: the subject. Its last coach starts inside the deck's west end.
  const train = add(g, new THREE.Group(), -.8, deck + .08, 0); train.name = "forth-train";
  const loco = add(train, new THREE.Group(), 0, 0, 0);
  add(loco, cyl(.24, .24, 1.15, "#2E3E34", 12), .10, .30, 0).rotation.z = Math.PI / 2;
  add(loco, box(.55, .52, .56, "#2E3E34"), -.55, .34, 0);
  add(loco, box(.60, .10, .62, "#2E3E34"), -.55, .62, 0);
  add(loco, cyl(.08, .10, .28, "#2E3E34", 10), .55, .62, 0);
  add(loco, cyl(.05, .05, .12, LD.brass, 8), .22, .56, 0);
  for (const dz of [-.28, .28]) for (const dx of [-.42, .0, .42]) add(loco, new THREE.Mesh(new THREE.TorusGeometry(.15, .035, 5, 12), mat("#4A4438")), dx, .15, dz);
  for (let c = 0; c < 3; c++) {
    const coach = add(train, new THREE.Group(), -1.45 - c * 1.30, 0, 0);
    add(coach, box(1.15, .58, .60, c % 2 ? "#6E3A28" : "#4A3526"), 0, .40, 0);
    add(coach, box(1.18, .07, .64, "#D9D2C2"), 0, .72, 0);
    for (let i = 0; i < 3; i++) for (const dz of [-1, 1]) add(coach, box(.22, .22, .03, LD.glass), -.34 + i * .34, .46, dz * .31);
    for (const dz of [-.26, .26]) for (const dx of [-.34, .34]) add(coach, new THREE.Mesh(new THREE.TorusGeometry(.12, .03, 5, 10), mat("#4A4438")), dx, .12, dz);
  }
  // the painters' cradle hanging from the far cantilever's top chord, outside the deck
  const cx = centres[2] + .8, cy = 5.3 - (.5 / (a - .3)) * (5.3 - deck - .3);
  const cradle = add(g, new THREE.Group(), cx, cy, .82); cradle.name = "forth-cradle";
  for (const dx of [-.42, .42]) add(cradle, cyl(.008, .008, .90, LD.iron, 4), dx, -.45, 0);
  add(cradle, box(1.05, .06, .42, LD.oak), 0, -.90, 0);
  for (const dx of [-.50, .50]) add(cradle, box(.05, .34, .42, LD.oak), dx, -.74, 0);
  const painter = seatFigure(cradle, resident("highland", false), -.20, 0, 0, -.87);
  arms(painter).right.rotation.x = -1.4;
  add(arms(painter).right, cyl(.05, .05, .10, "#8A2A22", 8), 0, arms(painter).hand - .06, .02);
  add(cradle, cyl(.11, .13, .20, "#8A2A22", 10), .34, -.78, 0);
  // two people on the shore under the bridge
  const ganger = add(g, own(resident("highland", false)), -3.90, .40, 1.35) as Figure; ganger.rotation.y = .5;
  const boy = add(g, own(resident("child")), -4.60, .40, 1.05) as Figure; boy.rotation.y = .9;
  const trainRest = train.position.clone(), run = 5.18;   // from the west end to the suspended span over the firth
  return life(g, "forthBridge", [ganger, boy], (t, k) => {
    cradle.rotation.z = Math.sin(t * .8) * .035;
    cradle.rotation.x = Math.cos(t * .65) * .02;
    // 1. the train first: it runs east along the deck, through the middle cantilever, and stops over the firth
    const cross = hold(k, .20, .84);
    train.position.copy(trainRest);
    train.position.x = trainRest.x + cross * run;
    train.position.y = trainRest.y + Math.sin(t * 9) * .006 * (cross > .05 ? 1 : 0);
    // the cradle swings harder as the train goes over
    cradle.rotation.z = Math.sin(t * .8) * .035 + beat(k, .25, .95) * Math.sin(t * 3.4) * .22;
    // 2. the ganger on the shore turns to watch it, 3. the boy points
    upper(ganger).rotation.y = Math.sin(t * .3) * .07 + beat(k, .35, 1) * .6;
    arms(boy).right.rotation.x = -beat(k, .45, 1) * 1.35;
  });
}

/** The engine house on the cliff road: a granite house with a bob wall, a beam rocking on its bearing, a stack
 *  with smoke on it, and the whim and count house beside it. Stop the engine an hour and the level comes back. */
export function engineHouse(): P {
  const g = group();
  add(g, box(7.8, .06, 5.0, "#8A9068"), 0, .03, .30);
  for (let i = 0; i < 16; i++) add(g, ball(.20, i % 3 ? "#9A8F80" : "#8A8880", 6), -3.4 + (i % 8) * .88, .05, -1.6 + Math.floor(i / 8) * 3.0).scale.y = .32;
  // the engine house: a granite box with the thick bob wall facing the shaft, and the stack at its corner
  const house = add(g, new THREE.Group(), .10, 0, -1.40); house.name = "engine-house-building";
  add(house, box(2.6, 2.70, 2.2, LD.moorGranite), 0, 1.35, 0);
  add(house, box(2.75, .09, 2.35, "#5A5450"), 0, 2.74, 0);
  for (const side of [-1, 1]) add(house, box(2.75, .08, 1.45, "#5A5450"), 0, 2.96, side * .62).rotation.x = side * .45;   // each slope rises to the ridge
  const bobWall = add(house, box(.85, 3.30, 2.2, LD.moorGranite), 1.55, 1.65, 0); bobWall.name = "engine-bob-wall";
  add(house, box(.95, .12, 2.35, "#7A7468"), 1.55, 3.36, 0);
  for (let i = 0; i < 2; i++) for (const side of [-1, 1]) add(house, box(.05, .90, .55, LD.glass), side * 1.31, 1.0 + i * 1.30, -.40);
  add(house, box(.80, 1.45, .06, LD.oakSmoke), -.55, .72, 1.11);
  // the stack: granite at the foot, brick above, with the smoke anchor at the top
  const stack = add(g, new THREE.Group(), -1.55, 0, -2.10); stack.name = "engine-stack";
  add(stack, box(1.20, .70, 1.20, LD.moorGranite), 0, .35, 0);
  add(stack, cyl(.42, .56, 4.10, LD.moorGranite, 12), 0, 2.75, 0);
  add(stack, cyl(.40, .40, 1.10, "#8A5A3A", 12), 0, 5.35, 0);
  add(stack, cyl(.46, .42, .18, "#8A5A3A", 12), 0, 5.98, 0);
  // the beam: it rocks on a bearing on the bob wall, with the pump rod down the shaft
  // the beam rides on its bearing on top of the bob wall, clear of the masonry, and rocks in the open
  const beamPivot = add(g, new THREE.Group(), 1.75, 3.66, -1.40); beamPivot.name = "engine-beam";
  add(beamPivot, box(3.30, .42, .50, LD.oakSmoke), 0, 0, 0);
  add(beamPivot, box(3.34, .07, .56, LD.iron), 0, .22, 0);
  add(beamPivot, box(3.34, .07, .56, LD.iron), 0, -.22, 0);
  for (let i = 0; i < 4; i++) add(beamPivot, cyl(.05, .05, .52, LD.iron, 6), -1.2 + i * .8, 0, 0).rotation.x = Math.PI / 2;
  add(g, cyl(.16, .18, .30, LD.iron, 12), 1.75, 3.52, -1.90).rotation.x = Math.PI / 2;   // the bearing, on the far side of the beam
  const rod = add(g, new THREE.Group(), 3.25, 0, -1.40); rod.name = "engine-rod";
  add(rod, cyl(.10, .10, 3.10, LD.oakSmoke, 8), 0, 1.80, 0);
  add(rod, box(.34, .16, .34, LD.iron), 0, 3.38, 0);
  // the shaft head with its collar, the whim, the count house and the coal
  add(g, cyl(.66, .70, .50, "#7A7468", 12), 3.25, .25, -1.40);
  add(g, cyl(.52, .52, .10, "#3A342E", 12), 3.25, .48, -1.40);
  for (const dx of [-.66, .66]) add(g, box(.16, 1.90, .16, LD.oak), 3.25 + dx, .95, -.78);
  add(g, box(1.55, .16, .18, LD.oak), 3.25, 1.88, -.78);
  const whim = add(g, new THREE.Group(), 3.25, 1.88, -.78);
  add(whim, new THREE.Mesh(new THREE.TorusGeometry(.32, .04, 5, 14), mat(LD.iron)), 0, 0, 0);   // the rim in the plane of its spokes
  for (let i = 0; i < 6; i++) add(whim, cyl(.016, .016, .62, LD.iron, 4), 0, 0, 0).rotation.z = (i * Math.PI) / 6;
  add(g, box(2.0, 1.60, 1.5, LD.moorGranite), -2.90, .80, 1.55);
  add(g, box(2.15, .09, 1.65, "#5A5450"), -2.90, 1.66, 1.55);
  for (const side of [-1, 1]) add(g, box(2.15, .08, 1.05, "#5A5450"), -2.90, 1.88, 1.55 + side * .46).rotation.x = side * .60;   // each slope rises to the ridge
  add(g, box(.62, 1.10, .06, LD.oakSmoke), -2.90, .55, 2.31);
  for (let i = 0; i < 9; i++) add(g, ball(.14, "#3A342E", 6), -.9 + (i % 5) * .26, .10, 1.85 + Math.floor(i / 5) * .28);
  const kibble = add(g, cyl(.24, .20, .40, LD.iron, 12), 2.45, .20, .35);
  for (let i = 0; i < 4; i++) add(kibble, ball(.08, "#6E5A42", 5), Math.cos(i * 1.6) * .10, .18, Math.sin(i * 1.6) * .10);
  g.userData.smoke = V(-1.55, 6.10, -2.10);
  // three people: the engineman at the door, a miner at the shaft, a boy on the count house step
  const engineman = add(g, own(resident("miner", false)), -.55, 0, 1.15) as Figure; engineman.rotation.y = .2;
  arms(engineman).right.rotation.x = -.9;
  const miner = add(g, own(resident("miner", false)), 2.45, 0, .95) as Figure; miner.rotation.y = -1.0;
  arms(miner).right.rotation.x = -1.2;
  const boy = add(g, own(resident("child")), -2.90, 0, 2.60) as Figure; boy.rotation.y = .6;
  return life(g, "engineHouseUk", [engineman, miner, boy], (t, k) => {
    // 1. the machine first: the beam rocks on its bearing and the pump rod rises and falls in the shaft
    const drive = .18 + beat(k, 0, .9) * .9;
    const stroke = Math.sin(t * (1.1 + drive * 2.2));
    beamPivot.rotation.z = stroke * (.055 + drive * .085);
    rod.position.y = stroke * (.10 + drive * .30);
    whim.rotation.z = -t * (.35 + drive * 1.4);
    // 2. the engineman leans out of the door, 3. the miner at the shaft turns
    upper(engineman).rotation.y = Math.sin(t * .3) * .07 + beat(k, .4, 1) * .45;
    arms(engineman).right.rotation.x = -.9 - beat(k, .4, 1) * .4;
    upper(miner).rotation.y = beat(k, .5, 1) * .5;
    upper(boy).rotation.y = beat(k, .55, 1) * .6;
  });
}

// ---------- the registry ----------

const BUILDERS = {
  // thirteen rooms
  pub, teaRoom, boroughMarket, pieShop, chipShop, coffeeStall, lascarKitchen, hopCookhouse,
  daleDairy, pastyBakehouse, cockleStall, smokehouse, distillery,
  // ten ingredient and flavour stops
  bakeryCe, oysterSmack, hopGarden, mushroomWood, daleFlock, forcingShed, ciderOrchard, leekBed, oatMill, herringQuay,
  // six landmarks. `horseOmnibus`, `hansomCab`, `motorOmnibus`, `costerBarrow` and `cockleDonkey` above are
  // exported as bare vehicles for the Builder's street and road decor as well as standing in these stands.
  bigBen, towerBridge, omnibus, pillarBox, forthBridge, engineHouse,
};
/**
 * Each stand starts its residents from its own place in the profile band, so a stand is built the same way
 * whatever else has been built before it: the clothing still changes from stand to stand, but the people in one
 * stand no longer depend on how many stands a harness or a world happened to build first.
 */
export const LONDON_PROPS: Record<string, () => P> = Object.fromEntries(
  Object.entries(BUILDERS).map(([id, make], i) => [id, () => { nth = i * 3; return make(); }]),
);

/** One small food or tool per room object, for the card badge where no painted art is loaded. Keyed by object id. */
export const LONDON_ICONS: Record<string, () => P> = {
  roastPub: () => { const g = group(); add(g, box(.62, .04, .40, "#A37A4F"), 0, .02, 0); add(g, box(.40, .22, .30, LD.beef), -.08, .15, 0); add(g, box(.41, .06, .31, "#E4D6A8"), -.08, .28, 0); const s = add(g, box(.05, .20, .28, LD.beef), .22, .14, 0); s.rotation.z = .5; add(s, box(.052, .13, .19, "#A8443C"), 0, 0, 0); add(g, cyl(.09, .08, .10, LD.batter, 10), .30, .09, .22); add(g, cyl(.05, .04, .16, LD.ale, 8), -.34, .12, .24); add(g, cyl(.05, .05, .03, "#F2EAD8", 8), -.34, .21, .24); return g; },
  teaRoomUk: () => { const g = group(); const p = add(g, ball(.17, "#D9CFC0", 12), -.12, .18, 0); p.scale.y = .82; add(g, cyl(.11, .14, .04, "#D9CFC0", 12), -.12, .31, 0); add(g, cyl(.026, .04, .20, "#D9CFC0", 8), .06, .22, 0).rotation.z = -.9; add(g, new THREE.Mesh(new THREE.TorusGeometry(.075, .018, 5, 12), mat("#D9CFC0")), -.30, .17, 0); add(g, cyl(.135, .135, .015, LD.cream, 14), .34, .01, .04); add(g, cyl(.085, .065, .09, LD.cream, 14), .34, .06, .04); add(g, cyl(.072, .072, .015, LD.tea, 14), .34, .10, .04); add(g, cyl(.075, .08, .08, "#D9BC86", 10), .30, .04, -.30); return g; },
  boroughUk: () => { const g = group(); const t = add(g, cyl(.24, .24, .34, "#E4D49A", 18), -.10, .24, 0); t.rotation.x = Math.PI / 2; add(g, cyl(.245, .245, .03, "#C9B478", 18), -.10, .24, 0).rotation.x = Math.PI / 2; const w = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .10, 18, 1, false, 0, 1.1), mat("#E9DCA8")), .30, .10, .16); w.rotation.set(Math.PI / 2, 0, .5); add(g, cyl(.006, .006, .60, "#C9C4B8", 4), -.10, .52, 0).rotation.z = Math.PI / 2; for (const dx of [-.38, .18]) add(g, box(.05, .05, .09, LD.oak), dx, .52, 0); return g; },
  pieMashUk: () => { const g = group(); add(g, cyl(.26, .24, .02, LD.cream, 18), 0, .01, 0); add(g, cyl(.15, .14, .09, LD.crust, 16), -.06, .07, 0); add(g, cyl(.14, .14, .02, "#C9862A", 16), -.06, .12, 0); for (let i = 0; i < 4; i++) add(g, ball(.07, "#F2EAD0", 7), .16 + Math.cos(i * 1.6) * .06, .04, Math.sin(i * 1.6) * .10).scale.y = .6; add(g, cyl(.19, .19, .012, LD.liquor, 16), .10, .055, .02); add(g, cyl(.07, .06, .04, LD.iron, 12), .30, .20, -.18); add(g, cyl(.011, .011, .26, LD.oak, 5), .42, .26, -.18).rotation.z = -.5; return g; },
  chippyUk: () => { const g = group(); add(g, box(.48, .014, .34, "#D9CFB4"), 0, .01, 0); const f = add(g, ball(.13, LD.haddock, 8), -.06, .10, 0); f.scale.set(1.6, .55, .8); for (let i = 0; i < 9; i++) add(g, box(.05, .045, .17, i % 3 ? "#E0C06A" : "#D9A84A"), .10 + (i % 3) * .09, .06 + Math.floor(i / 3) * .05, -.10 + (i % 3) * .09).rotation.y = i * .4; add(g, cyl(.035, .03, .13, LD.glass, 10), -.30, .07, .18); return g; },
  breakfastUk: () => { const g = group(); add(g, box(.42, .05, .30, LD.iron), -.06, .03, 0); for (let i = 0; i < 3; i++) { const r = add(g, box(.26, .02, .09, "#B4543A"), -.06, .07, -.10 + i * .10); r.rotation.x = .3; add(g, box(.26, .02, .03, "#E9D2B4"), -.06, .09, -.12 + i * .10); } add(g, cyl(.075, .062, .13, "#D9D2C2", 12), .32, .07, .06); add(g, cyl(.062, .062, .02, LD.tea, 12), .32, .13, .06); add(g, new THREE.Mesh(new THREE.TorusGeometry(.04, .012, 5, 10), mat("#D9D2C2")), .40, .07, .06).rotation.y = Math.PI / 2; add(g, box(.16, .04, .12, "#E9DCB4"), -.36, .04, .14); return g; },
  lascarUk: () => { const g = group(); add(g, new THREE.Mesh(new THREE.SphereGeometry(.26, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(LD.iron)), 0, .26, 0); add(g, cyl(.26, .24, .02, "#D9B462", 16), 0, .25, 0); add(g, cyl(.012, .012, .30, LD.iron, 5), -.32, .29, 0).rotation.z = .5; add(g, box(.24, .03, .20, LD.moorGranite), .40, .02, .12); add(g, box(.16, .02, .13, "#B4682A"), .40, .05, .12); for (let i = 0; i < 3; i++) add(g, ball(.026, i % 2 ? "#C97A22" : "#8A4A1E", 5), .34 + i * .05, .07, .12); add(g, cyl(.09, .08, .10, "#E9E4D2", 12), -.40, .05, -.20); return g; },
  hopKitchenUk: () => { const g = group(); add(g, new THREE.Mesh(new THREE.SphereGeometry(.24, 14, 9, 0, Math.PI * 2, 0, Math.PI * .62), mat(LD.iron)), 0, .26, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(.235, .018, 5, 14), mat(LD.iron)), 0, .28, 0); add(g, new THREE.Mesh(new THREE.TorusGeometry(.21, .014, 5, 14, Math.PI), mat(LD.iron)), 0, .42, 0).rotation.y = Math.PI / 2; add(g, cyl(.20, .20, .02, "#8A6A32", 14), 0, .25, 0); for (let i = 0; i < 4; i++) add(g, ball(.03, i % 2 ? "#B4783A" : "#6E8A3A", 5), Math.cos(i * 1.6) * .11, .26, Math.sin(i * 1.6) * .11); for (let i = 0; i < 3; i++) add(g, cone(.05, .12, "#8AA84A", 6), .38, .06 + i * .07, -.14 + i * .08).rotation.x = Math.PI; return g; },
  dairyUk: () => { const g = group(); add(g, cyl(.22, .22, .24, "#F2EAD0", 18), -.08, .12, 0); add(g, cyl(.225, .225, .03, "#D9C89A", 18), -.08, .25, 0); add(g, cyl(.24, .24, .06, "#9C8A66", 18), -.08, .03, 0); add(g, cyl(.16, .13, .22, LD.deal, 14), .36, .11, .10); add(g, new THREE.Mesh(new THREE.TorusGeometry(.155, .01, 4, 14), mat(LD.iron)), .36, .19, .10).rotation.x = Math.PI / 2; add(g, cyl(.13, .13, .02, "#E9E9DC", 14), .36, .16, .10); add(g, cyl(.02, .024, .22, LD.lead, 8), .14, .26, .06).rotation.z = -1.1; return g; },
  pastyUk: () => { const g = group(); const p = add(g, ball(.20, LD.crust, 9), 0, .10, 0); p.scale.set(1.25, .58, .80); for (let i = 0; i < 7; i++) add(g, box(.05, .035, .05, "#B4762A"), -.16 + i * .055, .18, .04).rotation.y = i * .2; add(g, box(.07, .014, .05, "#8A5A22"), .20, .19, -.02); const q = add(g, ball(.17, "#E4D6A8", 9), .40, .07, -.22); q.scale.set(1.2, .55, .78); add(g, cyl(.16, .14, .12, "#D9D2C2", 12), -.40, .06, .16); return g; },
  cocklesUk: () => { const g = group(); add(g, new THREE.Mesh(new THREE.TorusGeometry(.26, .03, 6, 16), mat("#9C8A66")), 0, .10, 0).rotation.x = Math.PI / 2; add(g, cyl(.25, .25, .012, "#B4A88E", 18), 0, .09, 0); for (let i = 0; i < 9; i++) add(g, ball(.042, "#D9CFB0", 6), Math.cos(i * .9) * (.06 + (i % 3) * .06), .13, Math.sin(i * .9) * (.06 + (i % 3) * .06)).scale.y = .65; add(g, cyl(.13, .11, .14, LD.brass, 14), .42, .07, .10); add(g, cyl(.11, .11, .02, "#9CB0A8", 14), .42, .14, .10); add(g, cyl(.11, .09, .12, "#4A4238", 12), -.42, .06, -.14); add(g, cyl(.10, .10, .02, "#3A5A3A", 12), -.42, .12, -.14); return g; },
  smokehouseUk: () => { const g = group(); add(g, cyl(.02, .02, .70, LD.oak, 6), 0, .30, 0).rotation.z = Math.PI / 2; for (let i = 0; i < 3; i++) for (const side of [-1, 1]) { const f = add(g, ball(.085, LD.haddock, 8), -.22 + i * .22, .16, side * .06); f.scale.set(.6, 1.5, .55); f.rotation.z = side * .12; } add(g, cyl(.24, .22, .16, "#5A4632", 14), .0, .04, .34); add(g, cyl(.20, .20, .03, "#2A2420", 14), 0, .10, .34); for (let i = 0; i < 3; i++) add(g, cone(.045, .12, i % 2 ? LD.flameHot : LD.flame, 6), Math.cos(i * 2.1) * .09, .14, .34 + Math.sin(i * 2.1) * .09); return g; },
  distilleryUk: () => { const g = group(); add(g, cyl(.20, .28, .48, LD.brass, 16), -.10, .24, 0); add(g, cone(.20, .26, LD.brass, 16), -.10, .60, 0); add(g, cyl(.045, .045, .26, LD.brass, 10), -.10, .82, 0); add(g, cyl(.04, .04, .44, LD.brass, 10), .16, .92, 0).rotation.z = -1.0; add(g, box(.30, .20, .20, LD.brass), .42, .12, .04); add(g, box(.24, .14, .02, LD.glass), .42, .13, .15); add(g, cyl(.01, .01, .13, "#F2EAC8", 6), .36, .14, .11); for (let i = 0; i < 4; i++) { const h = add(g, ball(.08, "#D9C88A", 7), -.44 + (i % 2) * .14, .03, .30 + Math.floor(i / 2) * .14); h.scale.set(1.2, .35, 1.0); } return g; },
};
