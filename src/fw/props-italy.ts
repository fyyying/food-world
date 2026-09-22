/**
 * Italian stands (world `italy`, areas `rome`, `venice`, `sicily`): one builder per `prop` name in the object
 * list of docs/italy-world.md. Owned by the Stand maker, Stage C of docs/agent-team-playbook.md.
 *
 * Every room stand follows the hotpot table in docs/building-a-world.md section 5: a building or shelter from the
 * region, a visible work surface, modelled food, an always-on loop, six to nine people with idle motion, a walker
 * whose legs step with the distance it covers, lamps under a beam, steam only where something is actually hot,
 * and a click chain that moves the food or material first, the worker second, one bystander third and speaks
 * last. The fifteen ingredient stops and the eight landmarks are simpler, but each has a real prop and a 3D
 * reaction of its own, because docs/new-area-methodology.md asks for clickable places that are not food stands.
 *
 * Buildings and people are local to this file until `italy-architecture.ts` and `italy-people.ts` land: the
 * playbook says a missing helper is built in the owning file, never in `props.ts`. `itResident` below is the one
 * line that becomes `italianResident(seed, working)` when the Builder's people file arrives; every stand asks for
 * its people through `resident(role)` and none of them builds a figure itself.
 *
 * Period band about 1880 to 1914, and this file is greppable proof of it (`scripts/tests/italy-reactions.mjs`):
 * **no Vespa, no motor car, no scooter, no spritz glass, no tiramisù, no carbonara, no red-check cloth and no
 * fiasco in a raffia basket.** Wine travels by hooded two-wheeled cart, the Rialto fish market stands under the
 * plain iron canopy of 1884 rather than the stone loggia of 1907, and the Colosseum is an overgrown ruin with
 * swifts in it rather than an arena with anybody in it.
 *
 * Two rulings from docs/italy-world.md are built in here rather than left to the review: **the casale is a cold
 * room** — whey runs and drips, nothing steams, and it carries no steam point at all — and **the osteria is the
 * one grade of Venetian wine house where people drank and ate**, a cask, a counter and a few plates, not a
 * modern cicchetti bar.
 *
 * Decor that other worlds import from here — `italianHouse`, `umbrellaPine`, `cypress`, `oliveTree`,
 * `citrusTree`, `pricklyPear`, `fountain`, `obelisk`, `gondola`, `venetianBridge`, `mooringPole`, `fishingBoat`,
 * `baroqueChurch`, `triumphalArch`, `basilica`, `treviFountain`, `cafeTables` — keeps its name and signature;
 * eight files outside Italy depend on them.
 */
import * as THREE from "three";
import { mat, add, rnd, C, person, wear, bubble, ambientChat, tickChildren, awning, type P } from "./props";
import { IT_LINES } from "./italy-speech";
import { ITALY_OBJECTS } from "./italy-objects";

/** The Researcher owns the lines (docs/italy-world.md, module contracts); this file re-exports the one copy. */
export { IT_LINES } from "./italy-speech";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Figure = P;
const upper = (p: Figure) => p.userData.upper as THREE.Group;
const arms = (p: Figure) => p.userData.arms as { left: THREE.Group; right: THREE.Group; hand: number };
const legsOf = (p: Figure) => p.userData.legs as { left: { thigh: THREE.Group; shin: THREE.Group }; right: { thigh: THREE.Group; shin: THREE.Group } };

/**
 * The palette. The first block is the one `world-italy.ts`, `world-med.ts` and `map.ts` already read by name and
 * it does not change; the second is the working tones this file's stands are built from. The twelve names of the
 * image brief live in the Builder's `ITP` constant in `italy-architecture.ts`, not here — two constants, because
 * the module contract says `props-italy.ts` already exports `IT` and `ITP` must not collide with it.
 */
export const IT = {
  travertine: "#e9dcc3", terracotta: "#c9603e", ochre: "#d9a55b", rose: "#d7a48e", venRed: "#a8433a", venOchre: "#e0b36a", venCream: "#f1e6d0",
  lava: "#3d3a3f", lavaLight: "#5c5760", pine: "#3f6b3f", pineDark: "#2f5232", cypress: "#2f5232", lemon: "#f2cf3a", orange: "#f08a2a", sea: "#5fa8b8",
  shutter: "#4f6f4a", stone: "#b9ad98", stoneDark: "#8c8272", wood: "#8b5e3c", roof: "#b8654a",
  // working tones: marble and lime for the counters, copper and brass for the vessels, the three fires
  marble: "#e7e4dc", lime: "#f3ece0", ash: "#b6b0a4", iron: "#33302e", copper: "#a8622f", brass: "#b08a3a",
  wineRed: "#6e1f24", wineWhite: "#e4d08a", whey: "#eef0e4", curd: "#f6f2e4", lard: "#f2eee0", dough: "#f1e4c4",
  crust: "#c98a4a", flame: "#e9612d", flameHot: "#f2a03c", ember: "#c0392b", sardine: "#9aa7b0", tuna: "#8e3b3a",
  greens: "#5f8a3a", artichoke: "#8fa06a", salt: "#f4f2ea", charcoal: "#3a3733", canvas: "#d9cdb4", tufa: "#cdbb92",
};

// ---------- every stand faces the arrival camera ----------

/**
 * main.ts always approaches from the south: the overview keeps OrbitControls' azimuth within 0.75 of world +z and
 * the flight keeps the visitor's compass direction. Eleven of the thirty-six blueprint rotations turn an object's
 * front to a road on its north side (rot near 3.14), which would show the camera the back wall of a bay. So each
 * builder here is authored with its work front on +z, and `facing` turns that body by minus the object's own
 * `rot` from `italy-objects.ts`: placed at the blueprint rotation, every stand shows its food to the south. The
 * stall children and the three stand-owned buildings are world offsets from the object's anchor, so inside a
 * body they are written as those offsets unchanged. Steam and smoke points are carried out into the wrapper.
 */
const ROT: Record<string, number> = Object.fromEntries(ITALY_OBJECTS.filter((o) => o.prop !== "none").map((o) => [o.prop, o.rot ?? 0]));
function facing(prop: string, body: P): P {
  const g = group(); g.name = `it-stand-${prop}`;
  g.add(body); body.rotation.y = -(ROT[prop] ?? 0); body.updateMatrix();
  for (const key of ["steam", "smoke"] as const) { const v = body.userData[key]; if (v) { g.userData[key] = v.clone().applyMatrix4(body.matrix); delete body.userData[key]; } }
  g.userData.ownReaction = body.userData.ownReaction; g.userData.poke = body.userData.poke; g.userData.tick = body.userData.tick;
  delete body.userData.tick; delete body.userData.poke;
  return g;
}

// ---------- reaction machinery, copied from props-thailand.ts (module-private there) ----------

/** A sine pulse that runs between two points of the decaying reaction `k`. */
const beat = (k: number, start = 0, end = 1) => (k > 0 ? Math.sin(Math.PI * clamp01(((1 - k) - start) / (end - start))) : 0);
/**
 * A trapezoid over the same decaying reaction: it rises to 1 by `rise`, holds there while the visitor's camera
 * finishes its 1.6-second approach, and returns to exactly 0 at the end. A pour needs this rather than `beat`,
 * because a sine pulse has the vessel only part of the way to the glass when the flight ends.
 */
const hold = (k: number, rise = 0.30, fall = 0.80) => { if (k <= 0) return 0; const u = 1 - k; return u < rise ? u / rise : u > fall ? Math.max(0, (1 - u) / (1 - fall)) : 1; };

function deferredBubble(targets: THREE.Object3D[], lines: string[], y: number, ms: number) {
  let delay = -1, n = 0;
  return {
    schedule() { delay = 0.28; },
    tick(dt: number) { if (delay < 0) return; delay -= dt; if (delay <= 0) { delay = -1; n++; bubble(targets[n % targets.length], lines[n % lines.length], y, ms); } },
  };
}

/**
 * The stand animates itself. Food or material tagged `userData.foodReaction` moves first, the worker (people[0])
 * follows, one bystander (people[1]) acknowledges, speech comes last through a deferred bubble, then ambient
 * chat. The reaction decays over about 3.5 s, so the first beat is still readable when the approach arrives.
 */
function life(g: P, id: string, people: Figure[], work?: (t: number, k: number, dt: number) => void, onPoke?: () => void, speakers?: Figure[]) {
  g.userData.ownReaction = true;
  let reaction = 0;
  const lines = IT_LINES[id] ?? ["Buongiorno · Good morning."];
  const food: { object: THREE.Object3D; position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }[] = [];
  g.traverse((o) => { if (o.userData.foodReaction) food.push({ object: o, position: o.position.clone(), rotation: o.rotation.clone(), scale: o.scale.clone() }); });
  const chat = ambientChat(g, lines);
  const speech = deferredBubble((speakers ?? people).length ? (speakers ?? people) : [g], lines, 1.45, 1900);
  g.userData.poke = () => { reaction = 1; onPoke?.(); speech.schedule(); };
  g.userData.tick = (t, dt) => {
    reaction = Math.max(0, reaction - dt * 0.285);
    tickChildren(g)(t, dt);
    people.forEach((p, i) => { if (p.userData.tick) return; const u = upper(p); if (!u) return; u.rotation.y = Math.sin(t * 0.45 + i) * 0.09; u.rotation.z = Math.sin(t * 0.7 + i) * 0.025; });
    food.forEach(({ object, position, rotation, scale }, i) => {
      const phase = clamp01((1 - reaction - (i % 3) * 0.09) / 0.73), pulse = reaction > 0 ? Math.sin(Math.PI * phase) : 0;
      object.position.copy(position); object.rotation.copy(rotation); object.scale.copy(scale);
      switch (object.userData.foodReaction) {
        case "hop": object.position.y += pulse * 0.30; object.rotation.y += pulse * 0.9; break;
        case "lift": object.position.y += pulse * 0.38; object.position.z += pulse * 0.12; object.rotation.x -= pulse * 0.40; break;
        case "puff": object.scale.y = scale.y * (1 + pulse * 1.3); object.position.y += pulse * 0.26; break;
        case "contents": object.scale.set(scale.x * (1 + pulse * 0.13), scale.y * (1 + pulse * 0.7), scale.z * (1 + pulse * 0.13)); object.position.y += pulse * 0.18; break;
        case "sway": object.rotation.z += pulse * 0.32; break;
        case "roll": object.rotation.x -= pulse * 2.2; break;
        default: break;
      }
    });
    if (people[0]) arms(people[0]).right.rotation.z = -beat(reaction, 0.52, 0.90) * 0.14;
    if (people[1]) { const u = upper(people[1]); u.rotation.x = (people[1].userData.tick ? u.rotation.x : 0) + beat(reaction, 0.58, 1) * 0.13; }
    work?.(t, reaction, dt);
    speech.tick(dt);
    chat(dt);
  };
  return g;
}

/** Reuse fruit geometry, hide the picked fruit, let a bounded handful fall to a target and clean up after it. */
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
        const target = baskets[i % baskets.length].clone().add(V(Math.sin(pickIndex + i) * 0.10, floor, Math.cos(pickIndex + i) * 0.10));
        falling.push({ mesh, source, start: V().setFromMatrixPosition(matrix), matrix, age: -i * 0.22, target });
      }
      pickIndex++;
    },
    tick: (t: number, k: number, dt: number) => {
      trees.forEach((tr, i) => {
        const crown = (tr.userData.crown ?? tr) as THREE.Object3D;
        crown.rotation.z = Math.sin(t * 1.3 + i) * 0.012 + (i === 0 ? Math.sin(t * 19) * 0.10 * k : 0);
        crown.rotation.x = i === 0 ? Math.cos(t * 16) * 0.055 * k : 0;
      });
      for (let i = falling.length - 1; i >= 0; i--) {
        const f = falling[i]; f.age += dt; if (f.age < 0) continue;
        const landing = 1.8, p = Math.min(1, f.age / landing), after = f.age - landing;
        const bounce = after > 0 && after < 0.28 ? Math.sin((after / 0.28) * Math.PI) * 0.065 : 0;
        position.lerpVectors(f.start, f.target, p); position.y = f.start.y + (f.target.y - f.start.y) * p * p + bounce;
        const fade = clamp01((3.6 - f.age) / 0.5);
        f.mesh.matrix.copy(f.matrix).setPosition(position).multiply(spin.makeRotationZ(f.age * 0.9)).scale(fadeScale.setScalar(fade));
        if (f.age >= 3.6) { g.remove(f.mesh); f.source.visible = true; falling.splice(i, 1); }
      }
    },
  };
}

/**
 * A falling column of liquid between a real spout and a real vessel. One unit tall, hanging from its own origin,
 * so the group's y scale is the real height of the fall: segments that thin as the fall stretches them.
 */
function pourFall(g: THREE.Object3D, name: string, color: string, radius = 0.03, segs = 3) {
  const col = add(g, new THREE.Group(), 0, 0, 0);
  col.name = name; col.visible = false;
  const skin = { emissive: color, emissiveIntensity: 0.18, transparent: true, opacity: 0.92 };
  for (let i = 0; i < segs; i++) {
    const r = radius * (1 - i * 0.16), h = 0.96 / segs;
    add(col, new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.86, h, 8), mat(color, skin)), 0, -(i + 0.5) / segs, 0);
  }
  add(col, new THREE.Mesh(new THREE.SphereGeometry(radius * 1.15, 7, 5), mat(color, skin)), 0, -0.02, 0);
  const down = V(0, -1, 0), dir = V();
  return {
    mesh: col,
    /** Both points are in the stand's space; the column hangs from `from` and ends at `to`. */
    set(from: THREE.Vector3, to: THREE.Vector3, visible: boolean) {
      col.visible = visible; if (!visible) return;
      col.position.copy(from);
      dir.subVectors(to, from);
      col.scale.set(1, Math.max(0.02, dir.length()), 1);
      col.quaternion.setFromUnitVectors(down, dir.normalize());
    },
  };
}
/** Rings that open where a falling liquid lands, on a surface or in a vessel. */
function splashRings(g: THREE.Object3D, n: number, x: number, y: number, z: number, r: number, color: string) {
  return Array.from({ length: n }, (_, i) => {
    const m = add(g, new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.2, 5, 12), mat(color, { transparent: true, opacity: 0.8 })), x + Math.cos(i * 1.3) * r * 2, y, z + Math.sin(i * 1.3) * r * 2);
    m.rotation.x = Math.PI / 2; m.visible = false; return m;
  });
}

// ---------- people: eight working profiles of 1880 to 1914, as data ----------

/**
 * Roman, Venetian and Sicilian working dress, as the palette in docs/italy-world.md asks for. `skirt` is the
 * long wool skirt or the man's trousers, `over` a waistcoat, leather apron or shawl, `head` the cloth, cap or
 * coppola. **The eight profiles are not pinned to a catalogued garment or a photograph**: Stage A recorded that
 * gap and closing it belongs to `italy-people.ts`, so the profiles here are the research's descriptions turned
 * into colour and cut and nothing more, and they are marked unverified in the same words the Stage A check used.
 */
const PROFILES = [
  { key: "romanWoman", top: "#d9cdb4", skirt: "#5a4636", over: "#8e6a52", head: "cloth", sash: "" },
  { key: "romanMan", top: "#cfc3a6", skirt: "#4a4438", over: "#3f3a33", head: "cap", sash: "" },
  { key: "vaccinaro", top: "#e4dccb", skirt: "#3e3a34", over: "#7a5a3a", head: "cap", sash: "#8e2a22" },
  { key: "venetianWoman", top: "#e6dcc8", skirt: "#39414c", over: "#5d4a5a", head: "shawl", sash: "" },
  { key: "venetianPorter", top: "#dbd3c0", skirt: "#2f3a48", over: "", head: "cap", sash: "#a8433a" },
  { key: "buranoWoman", top: "#efe6d2", skirt: "#7a5a4a", over: "#b4736a", head: "scarf", sash: "" },
  { key: "sicilianMan", top: "#d8cfc0", skirt: "#5a4a34", over: "#6b5334", head: "coppola", sash: "#8e5a2a" },
  { key: "sicilianWoman", top: "#e9e2d2", skirt: "#3a3430", over: "#4a3f3a", head: "shawl", sash: "" },
] as const;

/**
 * One resident of 1880 to 1914. **This function is the whole swap.** When `italy-people.ts` lands, the body
 * becomes `return italianResident(seed, working) as Figure;` and nothing else in this file changes.
 */
function itResident(seed: number, working: boolean): Figure {
  const p = PROFILES[((seed % PROFILES.length) + PROFILES.length) % PROFILES.length];
  const f = person(p.top, { apron: working && (p.key === "romanWoman" || p.key === "buranoWoman" || p.key === "sicilianWoman") }) as Figure;
  wear(f, box(0.34, 0.42, 0.28, p.skirt), 0, 0.45, 0);                                   // the long skirt or the trousers
  if (p.over === "#7a5a3a") wear(f, box(0.30, 0.46, 0.05, p.over), 0, 0.68, 0.15);        // the butcher's leather apron
  else if (p.over) wear(f, box(0.32, 0.30, 0.23, p.over), 0, 0.80, 0).rotation.z = 0.05;  // a waistcoat or a shoulder shawl
  if (p.sash) wear(f, box(0.345, 0.09, 0.285, p.sash), 0, 0.64, 0);
  if (p.head === "cloth") wear(f, box(0.28, 0.12, 0.24, "#e4dccb"), 0, 1.14, 0);
  if (p.head === "scarf") { wear(f, box(0.28, 0.13, 0.25, "#d9a55b"), 0, 1.14, 0); wear(f, box(0.10, 0.22, 0.06, "#d9a55b"), -0.12, 0.99, -0.06).rotation.z = -0.25; }
  if (p.head === "shawl") { wear(f, ball(0.19, "#2f2a2a", 8), 0, 1.10, -0.02).scale.set(1, 0.85, 1); wear(f, box(0.26, 0.30, 0.20, "#2f2a2a"), 0, 0.88, -0.05); }
  if (p.head === "cap") wear(f, cyl(0.15, 0.16, 0.10, "#4a4438", 10), 0, 1.15, 0);
  if (p.head === "coppola") { wear(f, cyl(0.16, 0.17, 0.07, "#6b5334", 10), 0, 1.15, 0); wear(f, box(0.26, 0.03, 0.13, "#6b5334"), 0, 1.13, 0.14); }
  if (working && p.key === "romanMan") wear(f, box(0.10, 0.28, 0.07, "#e4dccb"), 0.15, 0.94, -0.05).rotation.z = 0.3;
  return f;
}

type Role = "oste" | "cook" | "baker" | "server" | "vendor" | "fishwife" | "porter" | "vaccinaro" | "dairywoman"
  | "shepherd" | "carter" | "fisher" | "farmer" | "townsman" | "townswoman" | "child" | "priest" | "worker";
/** Which of the eight profiles a trade wears. */
const PROFILE_OF: Record<Role, number> = {
  oste: 1, cook: 0, baker: 1, server: 0, vendor: 0, fishwife: 3, porter: 4, vaccinaro: 2, dairywoman: 0,
  shepherd: 1, carter: 6, fisher: 5, farmer: 6, townsman: 1, townswoman: 0, child: 0, priest: 7, worker: 6,
};
let nth = 0;
/** A resident for a role. Working trades get the apron band; everyone else keeps the profile's own dress. */
function resident(role: Role, working = role === "cook" || role === "baker" || role === "server" || role === "vendor" || role === "oste"): Figure {
  const f = itResident(PROFILE_OF[role] + 8 * (nth++ % 5), working);
  if (role === "child") f.scale.setScalar(0.72);
  if (role === "priest") { wear(f, box(0.36, 0.72, 0.29, "#2a2622"), 0, 0.62, 0); wear(f, box(0.20, 0.06, 0.04, "#f4f1ea"), 0, 0.92, 0.13); }
  return f;
}
/** The stand takes over a figure's limbs: any observer of its own is dropped, so the choreography stands. */
function own(fig: Figure): Figure { fig.userData.tick = undefined; return fig; }
/** The pelvis rests on the seat; the seat stands a little behind the hanging calves. */
function seatFigure(g: THREE.Object3D, fig: Figure, x: number, z: number, angle: number, seatTop: number): Figure {
  fig.userData.sit?.();
  own(fig);
  const pelvis = fig.children.find((c) => c instanceof THREE.Mesh) as THREE.Mesh;
  pelvis.geometry.computeBoundingBox();
  const bottom = (pelvis.position.y + pelvis.geometry.boundingBox!.min.y) * fig.scale.y;
  add(g, fig, x, seatTop - bottom, z).rotation.y = angle; fig.name = "it-sitter"; fig.userData.seatTop = seatTop;
  return fig;
}
/** A rush-seated chair or a stool, and someone on it. */
function sit(g: THREE.Object3D, x: number, z: number, angle: number, role: Role, seatTop = 0.44, back = true) {
  const seat = add(g, box(0.36, 0.05, 0.36, IT.wood), x, seatTop, z); seat.name = "it-chair";
  for (const dx of [-0.15, 0.15]) for (const dz of [-0.15, 0.15]) add(g, box(0.045, seatTop, 0.045, "#6e4a2c"), x + dx, seatTop / 2, z + dz);
  if (back) { const b = add(g, new THREE.Group(), x, 0, z); b.rotation.y = angle; add(b, box(0.36, 0.42, 0.04, "#6e4a2c"), 0, seatTop + 0.21, -0.17); }
  return seatFigure(g, resident(role), x, z, angle, seatTop + 0.025);
}
/** A plank bench on two ends. Returns the seat height. */
function bench(g: THREE.Object3D, x: number, z: number, len: number, angle: number, seatTop = 0.44) {
  const b = add(g, new THREE.Group(), x, 0, z); b.rotation.y = angle;
  add(b, box(len, 0.07, 0.32, IT.wood), 0, seatTop, -0.11).name = "it-bench";
  for (const dx of [-len / 2 + 0.16, len / 2 - 0.16]) add(b, box(0.09, seatTop - 0.035, 0.28, "#6e4a2c"), dx, (seatTop - 0.035) / 2, -0.11);
  return seatTop;
}
/** A trattoria table under a cloth, or a bare work table. `cloth` is the marble or the linen on top of it. */
function table(g: THREE.Object3D, x: number, z: number, w = 1.5, d = 1.0, top = IT.marble, height = 0.76) {
  add(g, box(w, 0.07, d, top), x, height - 0.035, z);
  for (const dx of [-w / 2 + 0.12, w / 2 - 0.12]) for (const dz of [-d / 2 + 0.11, d / 2 - 0.11]) add(g, box(0.08, height - 0.07, 0.08, "#6e4a2c"), x + dx, (height - 0.07) / 2, z + dz);
  return height;
}
/**
 * A walker that paces a straight segment, pauses and turns at each end, and steps while it travels: the legs
 * swing in proportion to the distance covered, so no figure slides. `italyWalk` in the Builder's people file
 * will replace the stepping half of this; the pacing stays here.
 */
function pacer(p: Figure, from: THREE.Vector3, to: THREE.Vector3, speed = 0.32, phase = 0, pause = 1.6) {
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
    const swing = moving ? Math.sin((d / 0.62) * Math.PI * 2) * 0.5 : 0;
    legs.left.thigh.rotation.x = swing; legs.right.thigh.rotation.x = -swing;
    legs.left.shin.rotation.x = Math.max(0, -swing) * 0.9; legs.right.shin.rotation.x = Math.max(0, swing) * 0.9;
    arm.left.rotation.x = -swing * 0.7; arm.right.rotation.x = swing * 0.7;
    const u = upper(p); u.position.y = (p.userData.hipY as number) + (moving ? Math.abs(Math.cos((d / 0.62) * Math.PI * 2)) * 0.02 : 0);
  };
}

// ---------- lamps, signs, shelters ----------

/**
 * A hanging lamp: an oil lamp in a glass shade over a Roman counter, a brass lantern on a Venetian fondamenta.
 * Same conventions as `lantern()` in props.ts — the name, the `suspensionPoint`, and the cord last in the swing
 * group, so the harness can prove it hangs from a real beam and that its cord stays on the anchor as it sways.
 */
function itLamp(scale = 1, venetian = false): P {
  const g = group(); g.name = "hanging-lantern";
  const anchorY = 0.4 * scale; g.userData.suspensionPoint = V(0, anchorY, 0);
  const swing = new THREE.Group(); swing.position.y = anchorY; g.add(swing);
  if (venetian) {
    add(swing, cone(0.11, 0.09, IT.brass, 4), 0, -0.19 * scale, 0);
    const glass = add(swing, box(0.17 * scale, 0.22 * scale, 0.17 * scale, "#f2e2b0"), 0, -0.33 * scale, 0);
    glass.material = mat("#f2e2b0", { emissive: "#e9a94a", emissiveIntensity: 0.6, transparent: true, opacity: 0.85 });
    for (const dx of [-0.085, 0.085]) for (const dz of [-0.085, 0.085]) add(swing, box(0.012, 0.24 * scale, 0.012, IT.brass), dx * scale, -0.33 * scale, dz * scale);
    add(swing, cyl(0.09 * scale, 0.10 * scale, 0.03 * scale, IT.brass, 4), 0, -0.45 * scale, 0);
  } else {
    add(swing, cone(0.13 * scale, 0.09 * scale, IT.iron, 8), 0, -0.20 * scale, 0);
    add(swing, cyl(0.09 * scale, 0.10 * scale, 0.19 * scale, "#f2e2b0", 10), 0, -0.34 * scale, 0).material = mat("#f2e2b0", { emissive: "#e9a94a", emissiveIntensity: 0.65, transparent: true, opacity: 0.85 });
    add(swing, cyl(0.045 * scale, 0.045 * scale, 0.06 * scale, "#f7d98a", 8), 0, -0.34 * scale, 0);
    add(swing, cyl(0.10 * scale, 0.10 * scale, 0.02 * scale, IT.brass, 10), 0, -0.44 * scale, 0);
  }
  add(swing, cyl(0.008, 0.008, 0.16 * scale, IT.iron, 4), 0, -0.08 * scale, 0);   // the cord, last, its top at the anchor
  const phase = rnd() * 6;
  g.userData.tick = (t) => { swing.rotation.z = Math.sin(t * 1.3 + phase) * 0.06; swing.rotation.x = Math.cos(t * 1.0 + phase) * 0.035; };
  return g;
}
/** Lamps hung from the underside of a front beam, at the ends where they never cross the line to the food. */
function lamps(g: P, beamY: number, z: number, xs: number[], scale = 0.9, venetian = false) { for (const x of xs) add(g, itLamp(scale, venetian), x, beamY - 0.08 - 0.4 * scale, z); }

const SIGN_TEX: Record<string, THREE.CanvasTexture> = {};
function signTexture(text: string, w: number, h: number, ink: string, paper: string): THREE.CanvasTexture {
  const key = `${text}|${w}|${h}|${ink}|${paper}`; if (SIGN_TEX[key]) return SIGN_TEX[key];
  const W = 256, H = Math.round((256 * h) / w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.fillStyle = ink; ctx.font = `bold ${Math.min(H * 0.58, (W * 1.45) / Math.max(3, text.length))}px Georgia, serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; SIGN_TEX[key] = tex; return tex;
}
function sign(g: THREE.Object3D, text: string, w: number, h: number, x: number, y: number, z: number, ink = "#f1e6d0", paper = "#5a3b2a", rot = 0) {
  const b = new THREE.Group(); b.position.set(x, y, z); b.rotation.y = rot; g.add(b);
  add(b, box(w + 0.06, h + 0.06, 0.04, "#4a3222"), 0, 0, -0.01);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: signTexture(text, w, h, ink, paper), roughness: 0.85 })); face.position.z = 0.015; b.add(face);
}

type Style = "romanPalazzo" | "trastevere" | "casale" | "venetianQuay" | "buranoCottage" | "terraferma" | "palermoTufa" | "sicilianCoast";
const WALLS: Record<Style, { wall: string; roof: string; trim: string; pitch: number }> = {
  romanPalazzo: { wall: "#d9a55b", roof: IT.terracotta, trim: "#e9dcc3", pitch: 0.34 },
  trastevere: { wall: "#c98d5e", roof: IT.terracotta, trim: "#e9dcc3", pitch: 0.36 },
  casale: { wall: "#e2d3ae", roof: "#b8654a", trim: "#b9ad98", pitch: 0.40 },
  venetianQuay: { wall: "#a8433a", roof: "#a55a42", trim: IT.venCream, pitch: 0.30 },
  buranoCottage: { wall: "#5d8fb0", roof: "#b8654a", trim: IT.venCream, pitch: 0.38 },
  terraferma: { wall: "#d6c9a4", roof: "#a55a42", trim: "#b9ad98", pitch: 0.42 },
  palermoTufa: { wall: "#cdbb92", roof: "#c9805a", trim: "#f1e6d0", pitch: 0.28 },
  sicilianCoast: { wall: "#f1e6d0", roof: "#c9805a", trim: "#d9ccb0", pitch: 0.26 },
};
/** A low-pitched pantile roof over a bay, with a ridge tile. Returns the ridge height. */
function roofOver(g: THREE.Object3D, style: Style, w: number, d: number, y: number, z: number) {
  const { roof, pitch } = WALLS[style], half = (d + 0.9) / 2, slope = Math.sqrt(half * half + (half * pitch) ** 2);
  for (const side of [-1, 1]) {
    const r = add(g, box(w + 0.7, 0.10, slope, roof), 0, y + 0.16 + (half * pitch) / 2, z + (side * half) / 2);
    r.rotation.x = side * Math.atan(pitch);
    for (let i = 0; i < Math.floor((w + 0.7) / 0.3); i++) add(r, cyl(0.055, 0.055, slope, "#a55a42", 6), -(w + 0.7) / 2 + 0.15 + i * 0.3, 0.06, 0).rotation.x = Math.PI / 2;
  }
  add(g, box(w + 0.8, 0.10, 0.14, "#a55a42"), 0, y + 0.21 + half * pitch, z);
  return y + 0.21 + half * pitch;
}
/**
 * An open-front working bay: the house mass behind, back and side walls, a pantile roof, and a front beam on two
 * posts where the lamps hang. The floor is a low plinth inside the walls only, so it never lies coplanar with
 * the town paving, and the front posts stand outside the width of the work surface, so neither of them crosses
 * the arrival camera's line to the food.
 */
function bay(g: P, style: Style, w = 5.2, d = 3.2, h = 2.5, opts: { sign?: string; storeys?: number; arcade?: number } = {}) {
  const { wall, trim } = WALLS[style], zBack = -d / 2 - 0.6, zFront = d / 2 - 0.6;
  const storeys = opts.storeys ?? 1;
  add(g, box(w, 0.08, d, style === "casale" || style === "terraferma" ? "#b39a72" : "#c9bfa8"), 0, 0.04, -0.6);
  add(g, box(w, h, 0.18, wall), 0, h / 2, zBack);
  for (const x of [-w / 2 + 0.09, w / 2 - 0.09]) {
    add(g, box(0.18, h, d, wall), x, h / 2, -0.6);
    for (const dz of [-0.55, 0.35]) add(g, box(0.05, 0.8, 0.46, "#2f2a2a"), x + Math.sign(x) * 0.1, 1.3, -0.6 + dz);
  }
  if (opts.arcade) {
    const bays = opts.arcade, bw = w / bays, r = Math.min(bw / 2 - 0.1, (h - 0.34) / 2), spring = h - r - 0.12;
    for (let i = 0; i <= bays; i++) add(g, box(0.24, spring, 0.24, trim), -w / 2 + i * bw, spring / 2, zFront + 0.1);
    for (let i = 0; i < bays; i++) {
      add(g, new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 5, 16, Math.PI), mat(trim)), -w / 2 + (i + 0.5) * bw, spring, zFront + 0.1);
      add(g, box(bw - 0.24, 0.14, 0.22, trim), -w / 2 + (i + 0.5) * bw, spring + r + 0.07, zFront + 0.1);
    }
  } else for (const x of [-w / 2 + 0.12, w / 2 - 0.12]) add(g, cyl(0.09, 0.10, h, trim, 8), x, h / 2, zFront + 0.1);
  const beam = add(g, box(w + 0.1, 0.16, 0.2, "#6e4a2c"), 0, h + 0.08, zFront + 0.1); beam.name = "front-beam";
  add(g, box(w + 0.1, 0.16, 0.2, "#6e4a2c"), 0, h + 0.08, zBack);
  // the upper storeys stand on the bay itself, set back behind the beam: a house over its shop, not one behind it
  const up = 2.4 * (storeys - 1);
  if (up > 0) {
    add(g, box(w, up, d - 0.3, wall), 0, h + 0.16 + up / 2, -0.75);
    for (let s = 0; s < storeys - 1; s++) for (const x of [-w / 4, w / 4]) {
      add(g, box(0.62, 0.86, 0.05, "#2f2a2a"), x, h + 0.16 + s * 2.4 + 1.2, zFront - 0.14);
      for (const lean of [-1, 1]) add(g, box(0.26, 0.86, 0.04, IT.shutter), x + lean * 0.46, h + 0.16 + s * 2.4 + 1.2, zFront - 0.12);
      add(g, box(0.76, 0.06, 0.26, trim), x, h + 0.16 + s * 2.4 + 0.7, zFront - 0.02);
    }
  }
  roofOver(g, style, w, d - (up > 0 ? 0.3 : 0), h + (up > 0 ? 0.16 + up : 0), up > 0 ? -0.75 : -0.6);
  if (opts.sign) sign(g, opts.sign, Math.min(2.3, w * 0.45), 0.32, 0, h - 0.30, zFront + 0.22);
  return { beam, y: h + 0.08, zFront: zFront + 0.1, zBack, floor: 0.08 };
}
/** A light open shade on four posts: a market awning or a field shelter. It reads as a shade from above. */
function shade(g: P, w: number, d: number, h: number, x = 0, z = 0, colour = IT.canvas) {
  for (const px of [-w / 2 + 0.15, w / 2 - 0.15]) for (const pz of [-d / 2 + 0.15, d / 2 - 0.15]) add(g, cyl(0.06, 0.07, h, "#6e4a2c", 6), x + px, h / 2, z + pz);
  add(g, box(w, 0.07, d, colour), x, h + 0.035, z);
  for (let i = 0; i < Math.floor(w / 0.42); i++) add(g, box(0.05, 0.05, d, "#6e4a2c"), x - w / 2 + 0.2 + i * 0.42, h + 0.09, z);
  const beam = add(g, box(w + 0.1, 0.13, 0.16, "#6e4a2c"), x, h - 0.07, z + d / 2 - 0.15); beam.name = "front-beam";
  return { beam, y: h - 0.07, zFront: z + d / 2 - 0.15 };
}
/** A wooden hull for the lagoon: the flat-bottomed sandolo and the bragozzo share it. Bottom at -.22, water at 0. */
function hull(g: THREE.Object3D, len: number, beam: number, x = 0, z = 0, colour = "#6e4a2c") {
  const b = add(g, new THREE.Group(), x, 0, z);
  add(b, box(len * 0.74, 0.38, beam, colour), 0, -0.02, 0);
  for (const end of [-1, 1]) {
    const tip = add(b, box(len * 0.16, 0.34, beam * 0.62, colour), end * len * 0.44, 0.09, 0); tip.rotation.z = end * 0.28;
    add(b, box(len * 0.07, 0.26, beam * 0.34, colour), end * len * 0.52, 0.24, 0).rotation.z = end * 0.5;
  }
  add(b, box(len * 0.72, 0.05, beam - 0.1, "#8a6844"), 0, 0.16, 0);
  for (const side of [-1, 1]) add(b, box(len * 0.76, 0.12, 0.05, IT.wood), 0, 0.22, (side * beam) / 2);
  for (let i = 0; i < 3; i++) add(b, box(0.05, 0.14, beam - 0.12, IT.wood), -len * 0.24 + i * len * 0.24, 0.22, 0);
  return b;
}
/** A mule in the shafts of a cart: the animal both carts on this table lean into. Not a figure, so no gait test. */
function mule(g: THREE.Object3D, x: number, y: number, z: number, coat = "#6b5a48") {
  const m = add(g, new THREE.Group(), x, y, z);
  add(m, ball(0.42, coat, 9), 0, 0.86, 0).scale.set(1.75, 0.95, 0.9);
  const neck = add(m, cyl(0.17, 0.2, 0.5, coat, 8), 0.62, 1.0, 0); neck.rotation.z = -0.7;
  const head = add(m, ball(0.2, coat, 8), 0.92, 1.06, 0); head.scale.set(1.35, 0.85, 0.8);
  add(m, box(0.22, 0.12, 0.16, "#3a332c"), 1.12, 1.0, 0);
  for (const side of [-1, 1]) add(m, cone(0.055, 0.26, coat, 5), 0.82, 1.28, side * 0.11).rotation.z = -0.25 - side * 0.12;
  for (const [dx, dz] of [[-0.44, -0.24], [-0.44, 0.24], [0.44, -0.24], [0.44, 0.24]]) add(m, cyl(0.08, 0.06, 0.7, coat, 6), dx, 0.42, dz);
  add(m, cyl(0.04, 0.015, 0.5, "#3a332c", 5), -0.76, 0.82, 0).rotation.z = 0.7;
  add(m, box(0.5, 0.06, 0.44, "#6b3f2a"), 0, 1.12, 0);                                   // the pad and the harness
  add(m, box(0.06, 0.34, 0.5, "#6b3f2a"), 0.5, 0.94, 0);
  return { mule: m, head };
}

// ---------- decor kept for eight other worlds: houses, trees, water and the grand monuments ----------

/** A click that fades, for the decor pieces that keep their own small reaction. */
function reaction(rate = 1) { let k = 0; return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate); return k; } }; }

// ---------- roofs & houses ----------

/** Low-pitched terracotta roof, Italian style, with a slight overhang. */
function tiledRoof(w: number, d: number, h: number, color = IT.terracotta): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.ConeGeometry(1, h, 4);
  geo.rotateY(Math.PI / 4); geo.scale(w * 0.74, 1, d * 0.74);
  const m = new THREE.Mesh(geo, mat(color)); add(g, m, 0, h / 2, 0);
  add(g, box(w * 1.06, 0.1, d * 1.06, "#a55a42"), 0, 0.02, 0);
  add(g, box(w * 0.5, 0.12, 0.16, "#a55a42"), 0, h, 0);
  return g;
}
export function italianHouse(style: "rome" | "venice" | "sicily", w = 3, d = 2.6, h = 2.4, storeys = 2): P {
  const g = group();
  const walls = style === "rome" ? [IT.ochre, IT.rose, "#e2b98a", "#c98d5e", "#e8d3a8"] : style === "venice" ? [IT.venRed, IT.venOchre, IT.venCream, "#c97a5a", "#8f6a4a"] : ["#f1e6d0", "#e8d7b0", "#d9b07a", "#f3e9d4"];
  const wall = pick(walls);
  const hh = h * storeys;
  add(g, box(w, hh, d, wall), 0, hh / 2, 0);
  const trim = style === "venice" ? IT.venCream : "#f1e6d0";
  // shuttered windows in rows, arched for Venice
  for (let s = 0; s < storeys; s++) for (let i = 0; i < Math.max(1, Math.round(w / 1.3)); i++) {
    const x = -w / 2 + (i + 0.5) * (w / Math.max(1, Math.round(w / 1.3)));
    const y = s * h + h * 0.6;
    if (style === "venice") { add(g, cyl(0.24, 0.24, 0.06, "#2f2a2a", 10), x, y + 0.12, d / 2 + 0.02).rotation.x = Math.PI / 2; add(g, box(0.48, 0.5, 0.06, "#2f2a2a"), x, y - 0.12, d / 2 + 0.02); }
    else { add(g, box(0.42, 0.55, 0.05, "#2f2a2a"), x, y, d / 2 + 0.02); for (const sd of [-1, 1]) add(g, box(0.18, 0.55, 0.04, IT.shutter), x + sd * 0.31, y, d / 2 + 0.03); }
    if (s > 0 && style !== "sicily") { add(g, box(0.7, 0.05, 0.3, trim), x, s * h + 0.1, d / 2 + 0.12); for (let k = 0; k < 4; k++) add(g, cyl(0.02, 0.02, 0.3, trim, 4), x - 0.3 + k * 0.2, s * h + 0.25, d / 2 + 0.25); }
  }
  add(g, box(0.8, 1.5, 0.06, style === "venice" ? "#3b6b5a" : "#4a3222"), 0, 0.75, d / 2 + 0.03);
  if (style === "venice") add(g, cyl(0.4, 0.4, 0.06, "#3b6b5a", 10), 0, 1.5, d / 2 + 0.03).rotation.x = Math.PI / 2;
  if (style === "sicily") { add(g, box(w + 0.2, 0.25, d + 0.2, "#f1e6d0"), 0, hh + 0.1, 0); add(g, box(w * 0.6, 0.8, 0.12, "#f1e6d0"), 0, hh + 0.5, d / 2 - 0.1); for (let i = 0; i < 3; i++) add(g, box(0.1, 0.5, 0.1, "#f1e6d0"), -w * 0.25 + i * w * 0.25, hh + 0.45, -d / 2 + 0.1); }
  else add(g, tiledRoof(w + 0.5, d + 0.5, style === "venice" ? 0.9 : 1.1), 0, hh, 0);
  // flower boxes / laundry
  if (rnd() > 0.5) for (let i = 0; i < 3; i++) add(g, ball(0.09, pick(["#e8563f", "#f2b64d", "#e07aa0"]), 5), -0.4 + i * 0.4, h * 0.35, d / 2 + 0.1);
  if (style === "venice") { const pole = add(g, cyl(0.05, 0.05, 1.6, IT.venRed, 6), w / 2 + 0.3, 0.8, d / 2 + 0.4); void pole; }
  return g;
}

export function umbrellaPine(s = 1): P {
  const g = group();
  add(g, cyl(0.1 * s, 0.16 * s, 2.6 * s, "#5a4030", 6), 0, 1.3 * s, 0).rotation.z = (rnd() - 0.5) * 0.1;
  for (let i = 0; i < 4; i++) { const br = add(g, cyl(0.04 * s, 0.06 * s, 1.1 * s, "#5a4030", 5), Math.cos(i * 1.6) * 0.5 * s, 2.7 * s, Math.sin(i * 1.6) * 0.5 * s); br.rotation.z = Math.cos(i * 1.6) * 0.9; br.rotation.x = -Math.sin(i * 1.6) * 0.9; }
  const crown = add(g, ball(1.25 * s, IT.pine, 9), 0, 3.3 * s, 0); crown.scale.y = 0.42;
  add(g, ball(0.9 * s, "#4a7a48", 8), 0.2 * s, 3.5 * s, 0.1 * s).scale.y = 0.4;
  return g;
}

export function cypress(s = 1): P {
  const g = group();
  add(g, cone(0.32 * s, 3.2 * s, IT.cypress, 7), 0, 1.6 * s, 0);
  add(g, cone(0.22 * s, 1.4 * s, "#3a6238", 7), 0, 3.0 * s, 0);
  return g;
}

export function oliveTree(s = 1): P {
  const g = group();
  const trunk = add(g, cyl(0.12 * s, 0.22 * s, 0.9 * s, "#7a6a55", 6), 0, 0.45 * s, 0); trunk.rotation.z = (rnd() - 0.5) * 0.3;
  const crown = new THREE.Group(); g.add(crown);
  for (let i = 0; i < 4; i++) add(crown, ball(0.55 * s, i % 2 ? "#8fa872" : "#7f9a68", 7), (rnd() - 0.5) * 1.0 * s, (1.0 + rnd() * 0.5) * s, (rnd() - 0.5) * 1.0 * s).scale.y = 0.75;
  const olives: THREE.Mesh[] = [];
  for (let i = 0; i < 16; i++) olives.push(add(crown, ball(0.06 * s, i % 3 ? "#2f3a2a" : "#6f9b57", 5), (rnd() - 0.5) * 1.5 * s, (0.75 + rnd() * 0.9) * s, (rnd() - 0.5) * 1.5 * s));
  (g.userData as { crown?: THREE.Group; olives?: THREE.Mesh[] }).crown = crown;
  (g.userData as { crown?: THREE.Group; olives?: THREE.Mesh[] }).olives = olives;
  return g;
}

export function citrusTree(kind: "lemon" | "orange" = "lemon", s = 1): P {
  const g = group();
  add(g, cyl(0.09 * s, 0.13 * s, 0.7 * s, "#6b4a2c", 6), 0, 0.35 * s, 0);
  const crown = new THREE.Group(); g.add(crown);
  add(crown, ball(0.7 * s, "#3f7a3a", 9), 0, 1.15 * s, 0).scale.y = 0.95;
  const fruits: THREE.Mesh[] = [];
  for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, r = 0.55 * s; const f = add(crown, ball(0.09 * s, kind === "lemon" ? IT.lemon : IT.orange, 7), Math.cos(a) * r, (0.8 + rnd() * 0.7) * s, Math.sin(a) * r); if (kind === "lemon") f.scale.set(0.8, 1.15, 0.8); fruits.push(f); }
  (g.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[]; kind?: string }).crown = crown;
  (g.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[]; kind?: string }).fruits = fruits;
  (g.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[]; kind?: string }).kind = kind;
  return g;
}

export function pricklyPear(): P {
  const g = group();
  for (let i = 0; i < 4; i++) { const pad = add(g, ball(0.28, "#6f9b57", 8), (i - 1.5) * 0.25, 0.35 + (i % 2) * 0.35, 0); pad.scale.set(0.9, 1.2, 0.35); pad.rotation.z = (i - 1.5) * 0.3; if (i % 2) add(g, ball(0.07, "#e0483a", 6), pad.position.x, pad.position.y + 0.32, 0); }
  return g;
}
/** Arcs of water: tubes along parabolas from a source, plus droplets that ride along them. */
function waterArcs(g: THREE.Object3D, src: THREE.Vector3, n: number, reach: number, rise: number, drop: number, fan = false) {
  const mat2 = new THREE.MeshStandardMaterial({ color: "#d9f0f4", transparent: true, opacity: 0.75, roughness: 0.2 });
  const arcs: { m: THREE.Mesh; curve: THREE.CatmullRomCurve3; drops: THREE.Mesh[] }[] = [];
  for (let i = 0; i < n; i++) {
    const a = fan ? Math.PI / 2 + (i - (n - 1) / 2) * 0.35 : (i / n) * Math.PI * 2;
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const curve = new THREE.CatmullRomCurve3([src.clone(), src.clone().addScaledVector(dir, reach * 0.45).add(new THREE.Vector3(0, rise, 0)), src.clone().addScaledVector(dir, reach * 0.85).add(new THREE.Vector3(0, rise * 0.6, 0)), src.clone().addScaledVector(dir, reach).add(new THREE.Vector3(0, -drop, 0))]);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.035, 6), mat2); g.add(m);
    const drops: THREE.Mesh[] = [];
    for (let k = 0; k < 3; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 4), mat2); g.add(d); drops.push(d); }
    arcs.push({ m, curve, drops });
  }
  return {
    tick: (t: number, _dt: number, k = 1) => arcs.forEach((arc, i) => { arc.m.scale.setScalar(0.96 + Math.sin(t * 7 + i) * 0.04 * k); arc.drops.forEach((d, j) => { const u = ((t * 0.9 + j / 3 + i * 0.1) % 1); d.position.copy(arc.curve.getPointAt(u)); d.scale.setScalar(0.6 + (1 - u) * 0.6); }); }),
  };
}

// ---------- Rome ----------
export function fountain(): P {
  const g = group();
  add(g, cyl(2.0, 2.2, 0.5, IT.travertine, 16), 0, 0.25, 0);
  add(g, cyl(1.8, 1.8, 0.06, "#8fc4c9", 16), 0, 0.53, 0);
  add(g, cyl(0.25, 0.35, 1.4, IT.travertine, 10), 0, 1.2, 0);
  add(g, cyl(0.8, 0.9, 0.2, IT.travertine, 12), 0, 1.9, 0);
  add(g, cyl(0.7, 0.7, 0.05, "#8fc4c9", 12), 0, 2.02, 0);
  add(g, ball(0.3, IT.travertine, 8), 0, 2.4, 0);
  // jets: arcs that rise from the top and fall into the upper bowl, with a few droplets
  const jets = waterArcs(g, new THREE.Vector3(0, 2.6, 0), 4, 0.9, 0.7, 0.8);
  add(g, person("#e0a52c"), 2.6, 0, 0.4).rotation.y = -Math.PI / 2;
  g.userData.tick = (t, dt) => jets.tick(t, dt);
  return g;
}

export function obelisk(): P {
  const g = group();
  add(g, box(1.4, 0.6, 1.4, IT.travertine), 0, 0.3, 0);
  add(g, cyl(0.28, 0.42, 4.4, "#b89a7a", 4), 0, 2.8, 0);
  add(g, cone(0.3, 0.5, "#b89a7a", 4), 0, 5.25, 0);
  add(g, ball(0.14, C.gold, 8), 0, 5.6, 0);
  return g;
}
export function gondola(): P {
  const g = group();
  const hull = add(g, box(2.6, 0.22, 0.55, "#1f1f22"), 0, 0.14, 0);
  void hull;
  for (const sd of [-1, 1]) { const tip = add(g, box(0.5, 0.35, 0.25, "#1f1f22"), sd * 1.45, 0.3, 0); tip.rotation.z = -sd * 0.5; }
  add(g, box(0.25, 0.45, 0.1, "#8c9096"), 1.7, 0.55, 0);      // ferro
  add(g, box(0.9, 0.16, 0.45, "#8e2a22"), 0, 0.3, 0);        // cushions
  const passengers = [add(g, person("#e0a52c"), -0.2, 0.15, 0.1), add(g, person("#3f6b8f"), 0.3, 0.15, -0.1)];
  passengers.forEach((p) => { (p.userData as { sit?: () => void }).sit?.(); p.scale.setScalar(0.8); p.rotation.y = Math.PI / 2; });
  const gondolier = add(g, person("#1f1f22"), -1.0, 0.22, 0); gondolier.rotation.y = Math.PI / 2; gondolier.scale.setScalar(0.9);
  wear(gondolier, cyl(0.14, 0.14, 0.05, "#f7f2e6", 10), 0, 1.22, 0); wear(gondolier, cyl(0.12, 0.12, 0.08, "#c9413f", 10), 0, 1.26, 0);
  const oar = add(g, cyl(0.02, 0.02, 2.2, "#c9a37a", 4), -0.8, 0.6, 0.35); oar.rotation.set(0.5, 0, 0.9);
  g.userData.tick = (t) => { oar.rotation.z = 0.9 + Math.sin(t * 1.5) * 0.25; oar.rotation.x = 0.5 + Math.cos(t * 1.5) * 0.15; g.rotation.z = Math.sin(t * 1.1) * 0.02; };
  return g;
}

/** A Venetian footbridge: a stone arch boats can pass under, with steps up each side and iron railings. */
export function venetianBridge(len = 4): P {
  const g = group();
  const R = len * 0.5;
  const arch = new THREE.Mesh(new THREE.TorusGeometry(R, 0.42, 8, 18, Math.PI), mat(IT.venCream)); arch.scale.y = 0.75; arch.castShadow = true; arch.receiveShadow = true; g.add(arch);
  // stepped deck following the arch, then a flat crown
  for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) add(g, box(0.34, 0.16, 1.5, i % 2 ? IT.venCream : "#e6dcc6"), sd * (R - 0.15 - i * 0.34), R * 0.75 - 0.5 + i * 0.16, 0);
  add(g, box(len * 0.4, 0.16, 1.5, IT.venCream), 0, R * 0.75 + 0.2, 0);
  for (const sd of [-1, 1]) add(g, box(0.9, 0.9, 1.6, IT.venCream), sd * (R + 0.3), 0.45, 0);   // abutments on the quays
  for (const z of [-0.7, 0.7]) { add(g, box(len * 1.1, 0.06, 0.06, "#5a5a66"), 0, R * 0.75 + 0.75, z); for (let i = 0; i <= 5; i++) add(g, box(0.05, 0.5, 0.05, "#5a5a66"), -len * 0.55 + i * len * 0.22, R * 0.75 + 0.5, z); }
  return g;
}

export function mooringPole(): P {
  const g = group();
  const pole = add(g, cyl(0.07, 0.09, 2.4, "#f4f1ea", 8), 0, 1.2, 0);
  for (let i = 0; i < 6; i++) add(g, cyl(0.075, 0.075, 0.18, i % 2 ? "#3f6b8f" : "#f4f1ea", 8), 0, 0.3 + i * 0.36, 0);
  void pole; add(g, cone(0.09, 0.2, "#f4f1ea", 8), 0, 2.5, 0);
  return g;
}
/** Bits of seafood for the market slabs and the card picture. */
function shrimp(g: THREE.Object3D, x: number, y: number, z: number, rot = 0) {
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.12, 0.09, 0), new THREE.Vector3(0.24, 0.06, 0), new THREE.Vector3(0.3, -0.04, 0)]);
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.045, 6), mat("#f08a6a", { roughness: 0.5 })); m.position.set(x, y, z); m.rotation.y = rot; m.castShadow = true; g.add(m);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 3), mat("#e06a52")); tail.position.set(0.32, -0.05, 0); tail.rotation.z = -1.3; m.add(tail);
  for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.3, 3), mat("#e06a52")); w.position.set(-0.05, 0.03, sd * 0.03); w.rotation.z = 1.2; w.rotation.x = sd * 0.4; m.add(w); }
}
function octopus(g: THREE.Object3D, x: number, y: number, z: number, s = 1) {
  const o = new THREE.Group(); o.position.set(x, y, z); g.add(o);
  add(o, ball(0.22 * s, "#8a5a8a", 10), 0, 0.18 * s, 0).scale.set(1, 1.2, 1);
  for (const sd of [-1, 1]) { add(o, ball(0.05 * s, "#f4f1ea", 6), sd * 0.1 * s, 0.2 * s, 0.17 * s); add(o, ball(0.025 * s, "#1f1f1f", 5), sd * 0.1 * s, 0.2 * s, 0.21 * s); }
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.05 * s, 0), new THREE.Vector3(Math.cos(a) * 0.2 * s, 0.02 * s, Math.sin(a) * 0.2 * s), new THREE.Vector3(Math.cos(a) * 0.36 * s, 0.03 * s, Math.sin(a) * 0.36 * s), new THREE.Vector3(Math.cos(a + 0.6) * 0.42 * s, 0.09 * s, Math.sin(a + 0.6) * 0.42 * s)]); const t = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.035 * s, 6), mat("#8a5a8a")); t.castShadow = true; o.add(t); }
}
function crab(g: THREE.Object3D, x: number, y: number, z: number) {
  const c = new THREE.Group(); c.position.set(x, y, z); g.add(c);
  add(c, ball(0.16, "#d9533a", 9), 0, 0.06, 0).scale.set(1.3, 0.5, 1);
  for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) { const l = add(c, cyl(0.012, 0.012, 0.18, "#d9533a", 4), sd * 0.2, 0.04, -0.12 + i * 0.08); l.rotation.z = sd * 1.2; }
  for (const sd of [-1, 1]) add(c, ball(0.05, "#d9533a", 6), sd * 0.18, 0.08, 0.16).scale.set(1.4, 0.8, 1.2);
}
function fishOnIce(g: THREE.Object3D, x: number, y: number, z: number, color: string, len = 0.45) {
  const f = new THREE.Group(); f.position.set(x, y, z); g.add(f);
  add(f, ball(0.1, color, 9), 0, 0, 0).scale.set(len / 0.1 * 0.45, 0.55, 0.9);
  add(f, cone(0.08, 0.18, color, 4), -len * 0.55, 0, 0).rotation.z = Math.PI / 2;
  add(f, cone(0.04, 0.1, color, 3), 0, 0.06, 0);
  add(f, ball(0.02, "#1f1f1f", 5), len * 0.35, 0.03, 0.05);
}
export function fishingBoat(color = "#3f6b8f"): P {
  const g = group();
  add(g, box(2.0, 0.4, 0.8, color), 0, 0.2, 0);
  add(g, box(2.0, 0.08, 0.86, "#f4f1ea"), 0, 0.42, 0);
  add(g, box(0.5, 0.3, 0.3, color), 1.05, 0.35, 0).rotation.z = 0.4;
  add(g, cyl(0.03, 0.03, 1.6, "#c9a37a", 4), 0.2, 1.2, 0);
  add(g, person("#c0392b", { hat: true }), -0.4, 0.45, 0).scale.setScalar(0.85);
  for (let i = 0; i < 3; i++) add(g, ball(0.09, "#b3bfc9", 6), 0.4 + i * 0.25, 0.5, 0.15).scale.set(1.6, 0.5, 0.8);
  g.userData.tick = (t) => { g.position.y = Math.sin(t * 1.2) * 0.04; g.rotation.z = Math.sin(t * 0.9) * 0.04; };
  return g;
}
export function baroqueChurch(): P {
  const g = group();
  add(g, box(4.4, 3.4, 5, "#e8d7b0"), 0, 1.7, 0);
  add(g, box(4.8, 4.2, 0.5, "#f1e6d0"), 0, 2.1, 2.5);
  add(g, box(2.2, 1.0, 0.55, "#f1e6d0"), 0, 4.7, 2.5);
  add(g, cone(0.4, 0.5, "#f1e6d0", 4), 0, 5.4, 2.5).rotation.y = Math.PI / 4;
  for (const x of [-1.5, 1.5]) for (let i = 0; i < 2; i++) add(g, cyl(0.16, 0.18, 1.6, "#d9ccb0", 8), x + (i ? 0.5 : -0.5), 1.0, 2.85);
  add(g, box(0.9, 1.6, 0.1, "#3b2a22"), 0, 0.8, 2.78);
  add(g, cyl(0.45, 0.45, 0.08, "#3b2a22", 12), 0, 3.1, 2.78).rotation.x = Math.PI / 2;
  add(g, cyl(1.7, 1.7, 1.2, "#e8d7b0", 12), 0, 4.0, -0.6);
  add(g, ball(1.7, "#3f7a8a", 14, ), 0, 4.6, -0.6).scale.y = 0.75;
  add(g, cyl(0.3, 0.3, 0.8, "#f1e6d0", 8), 0, 6.1, -0.6); add(g, ball(0.16, C.gold, 8), 0, 6.6, -0.6);
  for (let i = 0; i < 2; i++) add(g, cypress(1.0), -3.0 + i * 6, 0, 1.5);
  return g;
}
/** A triumphal arch over the street. */
export function triumphalArch(): P {
  const g = group();
  const stone = "#d9ccb0";
  for (const x of [-2.6, 2.6]) { add(g, box(2.0, 5.2, 2.2, stone), x, 2.6, 0); for (const z of [-1.2, 1.2]) add(g, cyl(0.22, 0.26, 4.4, "#e9dcc3", 10), x + 0.9 * Math.sign(x), 2.3, z); }
  add(g, box(7.4, 1.6, 2.4, stone), 0, 6.0, 0);
  add(g, box(7.0, 0.5, 2.2, "#b9ad98"), 0, 6.95, 0);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.45, 8, 16, Math.PI), mat(stone)); arch.position.set(0, 3.6, 0); g.add(arch);
  for (const x of [-2.6, 2.6]) add(g, box(0.9, 1.3, 0.9, "#c9b89a"), x, 7.8, 0);
  for (let i = 0; i < 3; i++) add(g, cyl(0.25, 0.25, 0.12, "#7a7468", 10), -2 + i * 2, 6.2, 1.25).rotation.x = Math.PI / 2;
  return g;
}

/** St Peter's: a great dome on a drum with a colonnaded front and two sweeping colonnades around the square. */
export function basilica(): P {
  const g = group();
  add(g, box(14, 0.5, 8, IT.travertine), 0, 0.25, 0);
  add(g, box(12, 3.6, 6, "#e9dcc3"), 0, 2.3, -1);
  for (let i = 0; i < 8; i++) { const c = add(g, cyl(0.26, 0.3, 3.6, "#f1e6d0", 12), -5.25 + i * 1.5, 2.3, 2.3); add(c, box(0.7, 0.22, 0.7, "#f6ede0"), 0, 1.85, 0); }
  add(g, box(12.6, 0.7, 6.8, "#f1e6d0"), 0, 4.45, -1);
  add(g, box(4, 1.2, 1.0, "#f1e6d0"), 0, 5.4, 2.3);
  for (let i = 0; i < 7; i++) add(g, cyl(0.16, 0.16, 1.0, "#f6ede0", 8), -4.5 + i * 1.5, 5.3, 2.3).scale.set(1, 1, 1);
  add(g, cyl(3.4, 3.4, 2.8, "#e9dcc3", 20), 0, 6.2, -1.5);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(g, cyl(0.16, 0.16, 2.6, "#f6ede0", 8), Math.cos(a) * 3.5, 6.2, -1.5 + Math.sin(a) * 3.5); }
  const dome = add(g, ball(3.5, "#6f8f8a", 24), 0, 7.6, -1.5); dome.scale.y = 0.95;
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI; const rib = add(g, box(0.1, 3.4, 0.1, "#e9dcc3"), 0, 9.6, -1.5); rib.rotation.y = a; rib.position.set(Math.cos(a) * 2.0, 9.4, -1.5 + Math.sin(a) * 2.0); rib.rotation.z = 0.6; void rib; }
  add(g, cyl(0.6, 0.6, 1.2, "#f1e6d0", 10), 0, 11.5, -1.5); add(g, ball(0.25, C.gold, 8), 0, 12.3, -1.5); add(g, box(0.06, 0.6, 0.06, C.gold), 0, 12.7, -1.5);
  for (const x of [-5, 5]) { add(g, ball(1.3, "#6f8f8a", 14), x, 4.8, -2).scale.y = 0.8; add(g, cyl(0.25, 0.25, 0.8, "#f1e6d0", 8), x, 5.9, -2); }
  // the colonnades curving around the square, with an obelisk in the middle
  for (const sd of [-1, 1]) for (let i = 0; i < 12; i++) { const a = Math.PI / 2 + sd * (0.35 + i * 0.16); const x = Math.cos(a) * 9.5, z = 3.5 + Math.sin(a) * 9.5 - 3; add(g, cyl(0.2, 0.22, 3.0, "#e9dcc3", 8), x, 1.5, z + 6); add(g, cyl(0.2, 0.22, 3.0, "#e9dcc3", 8), x * 1.12, 1.5, (z + 3) * 1.12 + 3); }
  for (const sd of [-1, 1]) { const arc = new THREE.Mesh(new THREE.TorusGeometry(10.1, 0.5, 6, 24, 1.9), mat("#f1e6d0")); arc.rotation.x = Math.PI / 2; arc.rotation.z = Math.PI / 2 + sd * 0.35 + (sd < 0 ? -1.9 : 0); arc.position.set(0, 3.2, 6.5); g.add(arc); }
  add(g, obelisk(), 0, 0, 9).scale.setScalar(0.8);
  for (let i = 0; i < 8; i++) add(g, person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#2a2a2e"])), -6 + i * 1.7, 0, 5.5 + (i % 2) * 2.5).rotation.y = Math.PI - (i % 3) * 0.5;
  return g;
}

/** A Trevi-style fountain: palace façade with statues in niches, rocks, and a wide pool people sit around. */
export function treviFountain(): P {
  const g = group();
  const stone = "#e9dcc3";
  add(g, box(10, 6.5, 2.2, stone), 0, 3.25, -2.5);
  for (let i = 0; i < 4; i++) add(g, cyl(0.22, 0.26, 4.2, "#f1e6d0", 10), -3.9 + i * 2.6, 2.4, -1.3);
  add(g, box(10.4, 0.5, 2.6, "#f1e6d0"), 0, 4.8, -2.5);
  add(g, box(3.6, 1.6, 0.4, "#f1e6d0"), 0, 5.9, -1.6);
  add(g, box(0.9, 1.6, 0.4, "#d9ccb0"), 0, 3.0, -1.35);   // Oceanus niche
  add(g, ball(0.28, "#d9ccb0", 8), 0, 3.6, -1.15); add(g, box(0.5, 0.9, 0.35, "#d9ccb0"), 0, 2.9, -1.15);
  for (const x of [-2.4, 2.4]) { add(g, box(0.4, 1.1, 0.3, "#d9ccb0"), x, 2.6, -1.3); add(g, ball(0.2, "#d9ccb0", 7), x, 3.35, -1.3); }
  // rocks and the pool
  for (let i = 0; i < 9; i++) add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 + (i % 3) * 0.25, 0), mat("#c9bda5")), -3.5 + i * 0.9, 0.6 + (i % 2) * 0.35, -0.4 + (i % 3) * 0.3);
  add(g, box(11, 0.5, 5, stone), 0, 0.25, 2);
  add(g, box(10.2, 0.2, 4.2, "#7fc4cc"), 0, 0.55, 2);
  const jets = waterArcs(g, new THREE.Vector3(0, 1.6, -0.3), 5, 1.4, 1.1, 2.2, true);
  // crowd on the rim, backs to the water, one tossing a coin
  const rim: P[] = [];
  for (let i = 0; i < 7; i++) { const p = person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#e07aa0", "#2f5d3f"])); (p.userData as { sit?: () => void }).sit?.(); add(g, p, -4.5 + i * 1.5, 0.4, 4.5).rotation.y = Math.PI; rim.push(p); }
  const tosser = add(g, person("#e0a52c"), 3.2, 0, 6.2); tosser.rotation.y = Math.PI;
  const coin = add(g, cyl(0.06, 0.06, 0.02, C.gold, 8), 3.2, 1.3, 5.5); coin.visible = false;
  add(g, person("#2a2a2e"), -4.5, 0, 6.5).rotation.y = 0.5; add(g, person("#2a2a2e"), -3.8, 0, 6.8).rotation.y = 0.3;   // two nuns
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); coin.visible = true; coin.position.set(3.2, 1.3, 5.5); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    jets.tick(t, dt, 1 + k * 0.6);
    if (coin.visible) { const a = 1 - k; coin.position.set(3.2, 1.3 + Math.sin(a * Math.PI) * 1.4, 5.5 - a * 3.5); coin.rotation.x += dt * 12; if (k === 0) coin.visible = false; }
    const up = (tosser.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * -0.8 * Math.sin(Math.min(1, k * 3) * Math.PI);
    rim.forEach((p, i) => { const u = (p.userData as { upper?: THREE.Group }).upper; if (u) u.rotation.y = Math.sin(t * 0.5 + i) * 0.3; });
  };
  return g;
}
/** A few café tables on the piazza edge with people at them. */
export function cafeTables(): P {
  const g = group();
  for (let i = 0; i < 3; i++) {
    const x = i * 1.9;
    add(g, cyl(0.45, 0.45, 0.05, "#f4f1ea", 10), x, 0.75, 0); add(g, cyl(0.04, 0.06, 0.72, "#4a3222", 6), x, 0.36, 0);
    add(g, cyl(0.06, 0.05, 0.08, "#f4f1ea", 8), x - 0.1, 0.82, 0.1); add(g, cyl(0.05, 0.05, 0.06, "#f4f1ea", 8), x + 0.15, 0.81, -0.1);
    for (const sd of [-1, 1]) { add(g, cyl(0.18, 0.18, 0.42, "#4a3222", 8), x, 0.21, sd * 0.75); const p = person(pick(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#e07aa0"])); (p.userData as { sit?: () => void }).sit?.(); add(g, p, x, 0.04, sd * 0.75).rotation.y = sd > 0 ? Math.PI : 0; }
  }
  add(g, awning(6.4, 1.6, "#8e2a22"), 1.9, 2.3, -1.2);
  for (const x of [-1.2, 5.0]) add(g, cyl(0.05, 0.05, 2.3, "#4a3222", 6), x, 1.15, -0.5);
  return g;
}

// ---------- the thirteen room stands ----------

/**
 * The trattoria in Testaccio, under the slaughterhouse wall. The copper of oxtail is lifted off the coal range
 * and carried onto the marble, where the ladle turns it over; the oste's arm follows and a man at the next
 * table looks up. Everything the visitor has to read sits on the marble at the front, in front of the posts.
 */
export function trattoria(): P {
  const g = group();
  const b = bay(g, "trastevere", 5.6, 3.4, 2.5, { sign: "Ostaria", storeys: 2 });
  lamps(g, b.y, b.zFront, [-2.3, 2.3], 0.9);
  // the coal range at the back of the bay, its fire the always-on light
  add(g, box(1.7, 0.86, 0.9, "#8a7f70"), -1.5, 0.51, -1.2);
  add(g, box(1.74, 0.07, 0.94, IT.iron), -1.5, 0.97, -1.2);
  const mouth = add(g, box(0.62, 0.34, 0.06, "#1f1a18"), -1.5, 0.42, -0.74);
  const fires = Array.from({ length: 3 }, (_, i) => { const f = add(g, cone(0.09, 0.26, i % 2 ? IT.flameHot : IT.flame, 6), -1.75 + i * 0.25, 0.46, -0.72); f.name = "it-range-fire"; return f; });
  void mouth;
  add(g, cyl(0.16, 0.18, 2.6, "#9a8f80", 8), -2.3, 1.3, -2.1);                    // the flue up the back wall
  // the marble counter across the front, outside the posts: the visitor's line to it is never crossed
  add(g, box(4.6, 0.09, 1.0, IT.marble), 0, 0.92, 1.7);
  for (const dx of [-2.0, 0, 2.0]) add(g, box(0.16, 0.88, 0.9, "#b9ad98"), dx, 0.44, 1.7);
  // the pot: copper, broth, six pieces of oxtail and the ladle that turns them. It is the click's first move.
  const pot = add(g, new THREE.Group(), -1.5, 1.08, -1.2); pot.name = "it-oxtail-pot";
  add(pot, cyl(0.34, 0.29, 0.36, IT.copper, 16), 0, 0, 0);
  add(pot, new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 5, 16), mat(IT.copper)), 0, 0.17, 0).rotation.x = Math.PI / 2;
  const broth = add(pot, cyl(0.30, 0.30, 0.04, "#8e3b2a", 16), 0, 0.16, 0);
  const tails = Array.from({ length: 6 }, (_, i) => add(pot, ball(0.075, i % 2 ? "#6b3a2a" : "#7f4732", 6), Math.cos(i * 1.05) * 0.17, 0.18, Math.sin(i * 1.05) * 0.17));
  for (let i = 0; i < 5; i++) add(pot, box(0.05, 0.02, 0.10, IT.greens), Math.cos(i * 1.6) * 0.2, 0.19, Math.sin(i * 1.6) * 0.2);   // the celery
  const ladle = add(pot, new THREE.Group(), 0.05, 0.22, 0.02);
  add(ladle, new THREE.Mesh(new THREE.SphereGeometry(0.075, 9, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(IT.iron)), 0, 0, 0);
  add(ladle, cyl(0.012, 0.012, 0.42, IT.wood, 5), 0, 0.2, -0.05).rotation.x = -0.2;
  // the rest of the table: tripe with mint, cacio e pepe, bread, the foglietta and two tumblers
  const trippa = add(g, cyl(0.19, 0.17, 0.05, IT.lime, 12), -0.6, 0.98, 1.65); trippa.userData.foodReaction = "hop";
  for (let i = 0; i < 6; i++) add(g, box(0.09, 0.02, 0.05, "#c9a98a"), -0.6 + Math.cos(i) * 0.09, 1.02, 1.65 + Math.sin(i) * 0.09);
  for (let i = 0; i < 4; i++) add(g, box(0.05, 0.01, 0.04, IT.greens), -0.6 + Math.cos(i * 1.7) * 0.1, 1.04, 1.65 + Math.sin(i * 1.7) * 0.1);
  const cacio = add(g, cyl(0.2, 0.18, 0.05, IT.lime, 12), 0.5, 0.98, 1.7); cacio.userData.foodReaction = "hop";
  for (let i = 0; i < 9; i++) add(g, cyl(0.014, 0.014, 0.2, "#efd9a0", 5), 0.5 + (rnd() - 0.5) * 0.22, 1.02, 1.7 + (rnd() - 0.5) * 0.22).rotation.set(1.5, rnd() * 3, 0);
  const foglietta = add(g, cyl(0.075, 0.09, 0.26, "#cfd8cf", 12), 1.5, 1.09, 1.55); foglietta.userData.foodReaction = "sway";
  add(g, cyl(0.03, 0.03, 0.08, "#cfd8cf", 8), 1.5, 1.26, 1.55);
  add(g, cyl(0.075, 0.075, 0.08, IT.wineWhite, 10), 1.5, 1.02, 1.55);
  for (const dx of [1.75, 1.9]) add(g, cyl(0.05, 0.045, 0.1, "#e2e6e2", 10), dx, 1.01, 1.72);
  for (let i = 0; i < 3; i++) add(g, ball(0.09, "#c9a06a", 7), -1.9 + i * 0.16, 1.0, 1.6).scale.set(1.4, 0.7, 0.9);   // the bread
  // salumi on a rail under the beam: the always-on sway, at the ends where nothing crosses the food
  const rail = add(g, cyl(0.02, 0.02, 1.4, IT.iron, 5), -2.0, 2.12, 0.1); rail.rotation.z = Math.PI / 2;
  const salumi = Array.from({ length: 4 }, (_, i) => {
    const s = add(g, new THREE.Group(), -2.5 + i * 0.32, 2.1, 0.1); s.userData.foodReaction = "sway";
    add(s, cyl(0.008, 0.008, 0.14, "#5a4636", 4), 0, -0.07, 0);
    add(s, cyl(0.07, 0.055, 0.34, i % 2 ? "#8e4b3a" : "#6b3a2a", 9), 0, -0.3, 0);
    return s;
  });
  // the people: the oste, four at two tables inside the bay, a boy, and a waiter who walks the floor
  const oste = add(g, own(resident("oste")), -0.35, 0.08, 0.95) as Figure; oste.rotation.y = 0.1;
  const t1 = table(g, -1.6, 0.05, 1.4, 0.9, "#e8ded0"), t2 = table(g, 1.6, 0.05, 1.4, 0.9, "#e8ded0");
  const d1 = sit(g, -2.1, 0.6, 2.6, "townsman", 0.44), d2 = sit(g, -1.1, 0.6, 3.7, "townswoman", 0.44);
  const d3 = sit(g, 1.1, 0.6, 2.6, "vaccinaro", 0.44), d4 = sit(g, 2.1, 0.6, 3.7, "townswoman", 0.44);
  void t1; void t2;
  for (const [x, z] of [[-1.6, 0.05], [1.6, 0.05]]) { add(g, cyl(0.16, 0.13, 0.1, IT.lime, 10), x, 0.80, z); add(g, cyl(0.055, 0.06, 0.16, "#cfd8cf", 8), x + 0.3, 0.84, z + 0.1); }
  const boy = add(g, own(resident("child")), 2.5, 0.08, -0.3) as Figure; boy.rotation.y = -0.8;
  const waiter = resident("server", false); add(g, waiter, -1.9, 0.08, 0.35);
  const walk = pacer(waiter, V(-1.9, 0.08, 0.35), V(1.9, 0.08, 0.35), 0.30, 1.1);
  g.userData.steam = V(-1.5, 1.5, -1.2); g.userData.smoke = V(-2.3, 2.7, -2.1);
  const potRest = pot.position.clone(), ladleRest = ladle.rotation.z;
  return life(g, "ragu", [oste, d3, d1, d2, d4, boy, waiter], (t, k) => {
    fires.forEach((f, i) => { const s = 0.85 + Math.sin(t * 9 + i * 2) * 0.18 + beat(k, 0, 0.5) * 0.4; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    tails.forEach((b, i) => { b.position.y = 0.18 + Math.max(0, Math.sin(t * 3.2 + i * 0.9)) * 0.022; });
    broth.scale.y = 1 + Math.sin(t * 2.6) * 0.12;
    salumi.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.15 + i) * 0.05; });
    // 1. food first: the copper lifts off the range and travels onto the marble, and the ladle turns it over
    const lift = hold(k, 0.26, 0.82), turn = beat(k, 0.34, 0.95);
    pot.position.copy(potRest);
    pot.position.y = potRest.y + lift * 0.30 + Math.sin(t * 5) * 0.004 * lift;
    pot.position.x = potRest.x + lift * 1.15; pot.position.z = potRest.z + lift * 2.75;
    pot.rotation.z = -turn * 0.16;
    ladle.rotation.z = ladleRest + turn * 1.5; ladle.rotation.y = turn * 2.2;
    // 2. the oste's arm carries it, 3. the man at the next table looks up, and the boy leans in
    arms(oste).right.rotation.x = -0.3 - lift * 1.0; arms(oste).left.rotation.x = -0.2 - lift * 0.8;
    upper(oste).rotation.x = lift * 0.10;
    upper(d3).rotation.x = -beat(k, 0.5, 1) * 0.22; upper(d3).rotation.y = beat(k, 0.5, 1) * 0.3;
    upper(boy).rotation.x = beat(k, 0.6, 1) * 0.18;
    walk(t);
  });
}

/**
 * Campo de' Fiori: a trestle under a canvas shade with the five stalls of the object list standing behind it in
 * the horseshoe the blueprint gives them. A woman's knife strips an artichoke to the pale heart and the leaves
 * fall into the basket at her feet; the stallholder turns and the scale swings.
 */
export function italyMarket(): P {
  const g = group();
  const sh = shade(g, 5.0, 2.6, 2.5, 0, 0.2);
  lamps(g, sh.y, sh.zFront, [-2.0, 2.0], 0.85);
  // the trestle at the front, and the produce on it
  add(g, box(4.4, 0.08, 1.1, IT.wood), 0, 0.88, 1.35);
  for (const dx of [-1.9, 1.9]) { add(g, box(0.09, 0.84, 0.09, "#6e4a2c"), dx, 0.42, 1.0); add(g, box(0.09, 0.84, 0.09, "#6e4a2c"), dx, 0.42, 1.7); }
  add(g, box(4.4, 0.20, 0.09, "#6e4a2c"), 0, 1.00, 0.85);                               // the back rail of the trestle
  for (let i = 0; i < 7; i++) { const c = add(g, ball(0.09, "#c0392b", 7), -1.9 + i * 0.3, 1.0, 1.05); c.scale.y = 0.88; c.userData.foodReaction = "hop"; }
  for (let i = 0; i < 6; i++) add(g, ball(0.10, IT.artichoke, 7), 0.5 + (i % 3) * 0.22, 1.0, 1.55 + Math.floor(i / 3) * 0.2).scale.set(0.9, 1.15, 0.9);
  for (let i = 0; i < 5; i++) add(g, cyl(0.035, 0.03, 0.30, "#e6e2d0", 6), -1.2 + i * 0.12, 1.06, 1.6).rotation.z = 1.5;   // puntarelle
  for (let i = 0; i < 4; i++) add(g, ball(0.13, IT.greens, 7), -0.3 + i * 0.26, 1.02, 1.2).scale.y = 0.6;
  // the artichoke being turned against the knife: the subject, on the front board where nothing crosses it
  const carciofo = add(g, new THREE.Group(), -0.75, 1.03, 1.85); carciofo.name = "it-carciofo";
  const heart = add(carciofo, ball(0.115, "#cfd6a8", 9), 0, 0, 0); heart.scale.set(0.92, 1.15, 0.92);
  add(carciofo, cyl(0.022, 0.03, 0.26, IT.greens, 6), 0, -0.18, 0);
  const leaves = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    const l = add(carciofo, ball(0.055, i % 2 ? IT.artichoke : "#7d9058", 6), Math.cos(a) * 0.105, 0.01 + (i % 3) * 0.03, Math.sin(a) * 0.105);
    l.scale.set(0.8, 1.35, 0.5); l.rotation.y = -a; return l;
  });
  const basket = add(g, cyl(0.26, 0.2, 0.26, "#c9a97a", 12), -1.75, 0.13, 2.25);
  for (let i = 0; i < 5; i++) add(g, ball(0.05, "#7d9058", 5), -1.75 + (rnd() - 0.5) * 0.3, 0.26, 2.25 + (rnd() - 0.5) * 0.3).scale.set(0.9, 0.5, 0.6);
  // the hanging scale under the shade beam: the always-on swing, at the end of the beam
  const scale = add(g, new THREE.Group(), 1.7, sh.y - 0.14, sh.zFront - 0.04); scale.userData.foodReaction = "sway";
  add(scale, cyl(0.01, 0.01, 0.24, IT.brass, 4), 0, -0.12, 0);
  add(scale, box(0.42, 0.02, 0.02, IT.brass), 0, -0.24, 0);
  for (const dx of [-0.19, 0.19]) { add(scale, cyl(0.006, 0.006, 0.16, IT.brass, 3), dx, -0.32, 0); add(scale, cyl(0.09, 0.08, 0.03, IT.brass, 10), dx, -0.41, 0); }
  // bunches of herbs and garlic hung from the beam, the other half of the loop
  const bunches = Array.from({ length: 3 }, (_, i) => {
    const bn = add(g, new THREE.Group(), -1.9 + i * 0.36, sh.y - 0.12, sh.zFront - 0.04); bn.userData.foodReaction = "sway";
    add(bn, cyl(0.008, 0.008, 0.16, "#8a7f60", 4), 0, -0.08, 0);
    for (let k = 0; k < 5; k++) add(bn, ball(0.05, i === 2 ? "#efe6d0" : IT.greens, 5), Math.cos(k * 1.26) * 0.06, -0.26, Math.sin(k * 1.26) * 0.06).scale.y = 1.5;
    return bn;
  });
  // the five stall children of the object list, in the horseshoe behind: local space, the market turned 3.14
  const stallAt = (x: number, z: number, cloth: string, fill: () => THREE.Object3D[]) => {
    const s = add(g, new THREE.Group(), x, 0, z);
    add(s, box(1.7, 0.07, 0.9, IT.wood), 0, 0.86, 0);
    for (const dx of [-0.72, 0.72]) for (const dz of [-0.35, 0.35]) add(s, box(0.07, 0.82, 0.07, "#6e4a2c"), dx, 0.41, dz);
    add(s, box(1.74, 0.05, 0.94, cloth), 0, 0.915, 0);                 // a cloth over the boards; no awning, the stall stays under the sight line
    for (const o of fill()) add(s, o, 0, 0, 0);
    return s;
  };
  const scatter = (make: () => THREE.Mesh, n: number, y = 0.95) => () => Array.from({ length: n }, (_, i) => { const m = make(); m.position.set(-0.6 + (i % 5) * 0.3, y + Math.floor(i / 5) * 0.09, -0.2 + (i % 2) * 0.24); return m; });
  // world offsets from the market's anchor, which is how the object list fixes them: the horseshoe opens north
  stallAt(-4.2, 0.65, "#c9603e", scatter(() => cyl(0.1, 0.09, 0.3, "#5a6b3a", 8), 8, 1.09)).rotation.y = 1.72;       // stall-oil
  stallAt(-2.5, 3.55, "#d9a55b", scatter(() => ball(0.085, "#c0392b", 6), 10)).rotation.y = 2.53;                     // stall-tomato
  stallAt(0, 4.35, "#e9dcc3", scatter(() => cyl(0.15, 0.15, 0.1, "#e9c46a", 12), 7, 0.99)).rotation.y = 3.14;         // stall-cheese
  stallAt(2.5, 3.55, "#8e4b3a", scatter(() => cyl(0.06, 0.05, 0.3, "#8e4b3a", 8), 9, 1.09)).rotation.y = -2.53;       // stall-salumi
  stallAt(3.7, 0.95, "#6f9b57", scatter(() => ball(0.1, IT.greens, 6), 10)).rotation.y = -1.82;                       // stall-herbs
  // the people: the woman with the knife, the stallholder, a buyer, two shoppers, a child and a walker
  const woman = add(g, own(resident("vendor")), -0.9, 0, 0.55) as Figure; woman.rotation.y = 0;
  const knife = add(arms(woman).right, box(0.2, 0.015, 0.05, "#bcc2c6"), 0.02, arms(woman).hand - 0.03, 0.1);
  add(knife, box(0.08, 0.03, 0.045, "#5a4636"), -0.13, 0, 0);
  arms(woman).right.rotation.x = -1.1; arms(woman).left.rotation.x = -1.0;
  const holder = add(g, own(resident("vendor", false)), 1.5, 0, 0.5) as Figure; holder.rotation.y = 0.3;
  const buyer = add(g, own(resident("townswoman", false)), 0.5, 0, 0.35) as Figure; buyer.rotation.y = 0.2;
  const shopper = add(g, own(resident("townsman", false)), -2.0, 0, 0.3) as Figure; shopper.rotation.y = 0.5;
  const nonna = add(g, own(resident("townswoman", false)), 2.9, 0, -0.4) as Figure; nonna.rotation.y = -0.9;
  const child = add(g, own(resident("child")), -2.9, 0, -0.5) as Figure; child.rotation.y = 0.9;
  const walker = resident("porter", false); add(g, walker, -2.4, 0, -1.4);
  const walk = pacer(walker, V(-2.4, 0, -1.4), V(2.4, 0, -1.4), 0.30, 0.6);
  const heartRest = heart.position.clone(), leafRest = leaves.map((l) => l.position.clone());
  return life(g, "romeMarket", [woman, holder, buyer, shopper, nonna, child, walker], (t, k) => {
    scale.rotation.z = Math.sin(t * 1.2) * 0.07;
    bunches.forEach((bn, i) => { bn.rotation.z = Math.sin(t * 1.35 + i) * 0.055; });
    // 1. food first: the head turns against the knife and the stripped leaves drop into the basket
    const turn = hold(k, 0.22, 0.86), strip = k > 0 ? clamp01(((1 - k) - 0.10) / 0.62) : 0;
    carciofo.rotation.y = turn * 3.1;
    heart.position.copy(heartRest); heart.position.y = heartRest.y + turn * 0.10;
    heart.scale.set(0.92 - turn * 0.16, 1.15 - turn * 0.2, 0.92 - turn * 0.16);
    leaves.forEach((l, i) => {
      const p = clamp01(strip * 1.5 - i * 0.12);
      l.position.copy(leafRest[i]);
      l.position.x = leafRest[i].x - p * (0.6 + i * 0.05); l.position.z = leafRest[i].z + p * 0.42;
      l.position.y = leafRest[i].y - p * p * 0.78; l.rotation.z = p * 2.4;
    });
    // 2. the knife hand follows, 3. the stallholder turns and the buyer leans over the board
    arms(woman).right.rotation.x = -1.1 - beat(k, 0.1, 0.8) * 0.4; arms(woman).left.rotation.y = beat(k, 0.1, 0.8) * 0.3;
    upper(holder).rotation.y = 0.3 - beat(k, 0.45, 1) * 0.55;
    upper(buyer).rotation.x = beat(k, 0.5, 1) * 0.26;
    walk(t);
  });
}

/**
 * The pasta board: one long pin, one sheet, and the dried maccheroni that arrives by rail drying on canes behind.
 * The folded sheet is cut into ribbons, which are lifted and shaken loose over the board.
 */
export function pastaWorkshop(): P {
  const g = group();
  const b = bay(g, "romanPalazzo", 5.4, 3.2, 2.5, { sign: "Paste all'uovo", storeys: 2 });
  lamps(g, b.y, b.zFront, [-2.2, 2.2], 0.9);
  // the board at the front, floured, with the long pin lying across the back of it
  add(g, box(3.6, 0.10, 1.4, "#e2cfa4"), 0, 0.90, 1.5);
  for (const dx of [-1.5, 1.5]) for (const dz of [1.05, 1.95]) add(g, box(0.10, 0.85, 0.10, "#6e4a2c"), dx, 0.43, dz);
  for (let i = 0; i < 14; i++) add(g, ball(0.022, "#f4eee0", 4), (rnd() - 0.5) * 3.2, 0.96, 1.5 + (rnd() - 0.5) * 1.1).scale.y = 0.3;
  const pin = add(g, cyl(0.045, 0.045, 1.9, "#c9a37a", 8), 0.2, 1.00, 1.05); pin.rotation.z = Math.PI / 2;
  // the sheet, folded into a roll, and the ribbons the knife makes of it: the subject
  const sheet = add(g, box(1.0, 0.012, 0.8, IT.dough), -0.95, 0.96, 1.7); sheet.userData.foodReaction = "sway";
  const ribbons = add(g, new THREE.Group(), 0.55, 0.97, 1.7); ribbons.name = "it-pasta-ribbons";
  const strands = Array.from({ length: 9 }, (_, i) => add(ribbons, box(0.62, 0.010, 0.035, "#f0dfb4"), 0, 0.004 * i, -0.16 + i * 0.04));
  const roll = add(ribbons, cyl(0.055, 0.055, 0.62, "#ecd9ab", 10), 0, 0.05, 0); roll.rotation.z = Math.PI / 2;
  const knife = add(g, box(0.30, 0.014, 0.07, "#bcc2c6"), 0.55, 1.06, 1.42);
  add(knife, box(0.10, 0.035, 0.05, "#5a4636"), -0.2, 0, 0);
  // the drying canes behind, and the maccheroni hanging off them: the always-on loop
  const canes = Array.from({ length: 3 }, (_, r) => {
    const c = add(g, new THREE.Group(), 0, 1.95 - r * 0.42, -0.9 + r * 0.35);
    add(c, cyl(0.022, 0.022, 3.6, "#c9a37a", 6), 0, 0, 0).rotation.z = Math.PI / 2;
    for (let i = 0; i < 11; i++) { const h = add(c, box(0.035, 0.34, 0.012, "#efdcae"), -1.55 + i * 0.31, -0.18, 0); h.userData.foodReaction = "sway"; }
    return c;
  });
  // crates of dried maccheroni and a sack of durum at the side, and the egg basket on the board
  for (let i = 0; i < 3; i++) { const cr = add(g, box(0.6, 0.34, 0.45, "#a37a4f"), 2.1, 0.17 + i * 0.35, -0.4); for (let k = 0; k < 4; k++) add(cr, cyl(0.03, 0.03, 0.16, "#efdcae", 6), -0.18 + k * 0.12, 0.2, 0); }
  const sack = add(g, cyl(0.28, 0.34, 0.6, "#d9cdb4", 10), -2.1, 0.3, -0.5); void sack;
  const eggs = add(g, cyl(0.17, 0.14, 0.12, "#c9a97a", 10), 1.6, 0.98, 1.7);
  for (let i = 0; i < 5; i++) add(eggs, ball(0.045, "#f0e2c4", 6), Math.cos(i * 1.26) * 0.07, 0.07, Math.sin(i * 1.26) * 0.07).scale.y = 1.25;
  // the people: the sfoglina, a second woman at the pin, a boy with a tray, two at the canes, a walker
  const sfoglina = add(g, own(resident("cook")), 0.55, 0.08, 0.7) as Figure; sfoglina.rotation.y = 0;
  arms(sfoglina).right.rotation.x = -1.2; arms(sfoglina).left.rotation.x = -1.0;
  const roller = add(g, own(resident("cook", false)), -1.15, 0.08, 0.7) as Figure; roller.rotation.y = 0.1;
  arms(roller).right.rotation.x = -1.25; arms(roller).left.rotation.x = -1.25;
  const boy = add(g, own(resident("child")), 2.2, 0.08, 1.2) as Figure; boy.rotation.y = -1.2;
  const hangerA = add(g, own(resident("townswoman", false)), -1.9, 0.08, -0.2) as Figure; hangerA.rotation.y = 0.4;
  const hangerB = add(g, own(resident("townsman", false)), 1.9, 0.08, -0.2) as Figure; hangerB.rotation.y = -0.4;
  const customer = add(g, own(resident("townswoman", false)), 2.6, 0, 1.3) as Figure; customer.rotation.y = -1.6;
  const walker = resident("porter", false); add(g, walker, -2.2, 0.08, 0.45);
  const walk = pacer(walker, V(-2.2, 0.08, 0.45), V(2.2, 0.08, 0.45), 0.28, 1.7);
  const ribbonRest = ribbons.position.clone(), strandRest = strands.map((s) => s.position.clone());
  return life(g, "pasta", [sfoglina, roller, boy, hangerA, hangerB, customer, walker], (t, k) => {
    canes.forEach((c, i) => { c.children.forEach((h, j) => { if (j) h.rotation.z = Math.sin(t * 1.1 + i + j * 0.3) * 0.04; }); });
    sheet.rotation.z = Math.sin(t * 0.9) * 0.01;
    // 1. food first: the knife runs down the roll and the ribbons lift off it and shake loose
    const cut = hold(k, 0.18, 0.62), shake = beat(k, 0.34, 0.98);
    knife.position.x = 0.55 - cut * 0.02; knife.position.z = 1.42 + cut * 0.42; knife.rotation.x = -cut * 0.35;
    roll.scale.set(1, 1 - cut * 0.9, 1);
    ribbons.position.copy(ribbonRest);
    ribbons.position.y = ribbonRest.y + shake * 0.46; ribbons.position.z = ribbonRest.z - shake * 0.10;
    ribbons.rotation.z = shake * 0.22;
    strands.forEach((s, i) => {
      s.position.copy(strandRest[i]);
      s.position.z = strandRest[i].z + shake * (i - 4) * 0.028;
      s.position.y = strandRest[i].y - shake * 0.24 * Math.abs(Math.sin(i * 1.1 + t * 9));
      s.rotation.x = shake * Math.sin(i * 0.8 + t * 8) * 0.5;
    });
    // 2. the sfoglina's arms follow, 3. the roller looks over and the boy comes up with the tray
    arms(sfoglina).right.rotation.x = -1.2 - shake * 0.55; arms(sfoglina).left.rotation.x = -1.0 - shake * 0.35;
    upper(sfoglina).rotation.x = cut * 0.12;
    upper(roller).rotation.y = 0.1 - beat(k, 0.45, 1) * 0.5;
    upper(boy).rotation.x = beat(k, 0.6, 1) * 0.2;
    walk(t);
  });
}

/**
 * The forno: the quarter's bread oven, and the flat dough it is tested with. The stand builds its own oven house
 * at the blueprint's [-2, -1.35] in its own space, which is a blocker under the same rule as a decorative house
 * and stands behind and to the left, clear of the arrival camera's line to the counter.
 */
export function pizzeria(): P {
  const g = group();
  const shop = add(g, group(), 0.9, 0, 0);                                    // the bay stands east of the oven house
  const b = bay(shop, "romanPalazzo", 3.2, 3.0, 2.5, { sign: "Forno", storeys: 2 });
  lamps(shop, b.y, b.zFront, [-1.1, 1.1], 0.85);
  // the oven house: a low vaulted shed round the dome, its own roof, at the blueprint's offset
  const house = add(g, new THREE.Group(), -2.0, 0, -1.35);
  add(house, box(2.0, 1.7, 2.1, "#c98d5e"), 0, 0.85, 0);
  roofOver(house, "romanPalazzo", 2.0, 2.1, 1.7, 0);
  const dome = add(house, ball(0.85, "#b8654a", 12), 0, 0.72, 0.4); dome.scale.y = 0.8;
  const mouth = add(house, box(0.72, 0.42, 0.12, "#1f1a18"), 0, 0.62, 1.12);
  const glow = add(house, box(0.62, 0.32, 0.04, IT.flameHot), 0, 0.60, 1.16);
  glow.material = mat(IT.flameHot, { emissive: "#ff7a2a", emissiveIntensity: 0.5 });
  void mouth;
  add(house, cyl(0.18, 0.22, 1.5, "#b9ad98", 8), -0.8, 2.4, -0.6);                 // the chimney
  // the counter across the front, and what is already on it
  add(g, box(4.4, 0.09, 1.1, IT.marble), 0, 0.94, 1.6);
  for (const dx of [-1.85, 0, 1.85]) add(g, box(0.16, 0.9, 1.0, "#b9ad98"), dx, 0.45, 1.6);
  for (let i = 0; i < 4; i++) { const lo = add(g, ball(0.14, "#d9a55b", 8), -1.7 + i * 0.3, 1.04, 1.35); lo.scale.set(1.6, 0.8, 0.9); lo.userData.foodReaction = "hop"; }
  for (let i = 0; i < 3; i++) add(g, box(0.5, 0.06, 0.34, "#e2c089"), 1.2 + (i % 2) * 0.1, 1.02 + i * 0.07, 1.45);   // the pizza bianca already cut
  for (let i = 0; i < 6; i++) add(g, ball(0.075, IT.dough, 6), -0.4 + (i % 3) * 0.2, 1.02, 1.85 + Math.floor(i / 3) * 0.18).scale.y = 0.6;
  // the peel and the long white pizza on it: the subject, drawn out of the mouth onto the counter
  const peel = add(g, new THREE.Group(), -2.0, 0.62, -0.2); peel.name = "it-pizza";
  add(peel, box(0.66, 0.02, 0.5, "#c9a37a"), 0, 0, 0);
  add(peel, cyl(0.022, 0.022, 1.5, "#c9a37a", 6), 0, 0.01, -1.0);
  const crust = add(peel, box(0.58, 0.05, 0.42, "#efe0b4"), 0, 0.03, 0);
  for (let i = 0; i < 7; i++) add(peel, ball(0.028, "#f4efe0", 5), -0.22 + (i % 4) * 0.14, 0.07, -0.1 + Math.floor(i / 4) * 0.16).scale.y = 0.5;
  void crust;
  // the people: the baker, a second man at the trough, a child reaching, two waiting, a walker
  const baker = add(g, own(resident("baker")), -1.1, 0.08, 0.55) as Figure; baker.rotation.y = -1.0;
  arms(baker).right.rotation.x = -1.3; arms(baker).left.rotation.x = -1.1;
  const kneader = add(g, own(resident("baker", false)), 1.5, 0.08, 0.1) as Figure; kneader.rotation.y = Math.PI;
  add(g, box(1.2, 0.5, 0.8, "#8a6844"), 1.5, 0.33, 0.7);
  for (let i = 0; i < 4; i++) add(g, ball(0.11, IT.dough, 7), 1.15 + i * 0.23, 0.62, 0.7).scale.y = 0.7;
  const child = add(g, own(resident("child")), 0.95, 0, 1.75) as Figure; child.rotation.y = 2.4;
  const mother = add(g, own(resident("townswoman", false)), 1.75, 0, 1.6) as Figure; mother.rotation.y = 2.5;
  const waiterA = add(g, own(resident("townsman", false)), -2.5, 0, 1.55) as Figure; waiterA.rotation.y = 1.4;
  const waiterB = add(g, own(resident("townswoman", false)), 2.7, 0, 1.2) as Figure; waiterB.rotation.y = -1.4;
  const walker = resident("porter", false); add(g, walker, -0.3, 0.08, -0.4);
  const walk = pacer(walker, V(-0.3, 0.08, -0.4), V(2.1, 0.08, -0.4), 0.24, 2.3);
  g.userData.steam = V(0, 1.35, 1.6); g.userData.smoke = V(-2.8, 3.2, -1.95);
  const peelRest = peel.position.clone();
  return life(g, "oven", [baker, child, kneader, mother, waiterA, waiterB, walker], (t, k) => {
    (glow.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.12 + beat(k, 0, 0.55) * 0.9;
    // 1. food first: the peel comes out of the mouth and the pizza slides forward onto the marble
    const draw = hold(k, 0.24, 0.80), slide = beat(k, 0.46, 1);
    peel.position.copy(peelRest);
    peel.position.z = peelRest.z + draw * 2.55; peel.position.x = peelRest.x + draw * 1.45; peel.position.y = peelRest.y + draw * 0.55;
    peel.rotation.x = -slide * 0.22; peel.rotation.y = draw * 0.5;
    // 2. the baker's arms draw it out and he steps back, 3. the child at the counter reaches
    arms(baker).right.rotation.x = -1.3 + draw * 0.55; arms(baker).left.rotation.x = -1.1 + draw * 0.45;
    upper(baker).rotation.x = -draw * 0.12;
    arms(child).right.rotation.x = -beat(k, 0.55, 1) * 1.25;
    upper(mother).rotation.y = beat(k, 0.6, 1) * 0.25;
    walk(t);
  });
}

/**
 * The casale in the Agro Romano: fold, press and oil jar in one yard, with the byre the blueprint gives the
 * stand at [1.1, -3.2] from its anchor. **This is the cold room.** The curd is cut and the whey runs off the
 * draining table into the pail; nothing here is heated, and the stand carries no steam point at all.
 */
export function dairy(): P {
  const g = group();
  const b = bay(g, "casale", 5.0, 3.0, 2.4, { sign: "Casale" });
  lamps(g, b.y, b.zFront, [-2.0, 2.0], 0.85);
  // the byre, the stand's own building, behind and to the left: a blocker, and clear of the sight line
  const byre = add(g, new THREE.Group(), 1.1, 0, -3.2);
  add(byre, box(2.6, 1.8, 2.2, "#d9cdb4"), 0, 0.9, 0);
  roofOver(byre, "casale", 2.6, 2.2, 1.8, 0);
  add(byre, box(1.0, 1.3, 0.08, "#6e4a2c"), 0, 0.65, 1.12);
  for (let i = 0; i < 4; i++) add(byre, box(0.06, 0.9, 0.06, "#6e4a2c"), -1.5 + i * 0.3, 0.45, 1.5);
  // the draining table at the front: marble, a lip, and the pail under it
  add(g, box(2.4, 0.10, 1.2, IT.marble), -0.2, 0.86, 1.55);
  for (const dx of [-1.05, 0.95]) for (const dz of [1.1, 2.0]) add(g, box(0.1, 0.81, 0.1, "#6e4a2c"), -0.2 + dx, 0.40, dz);
  add(g, box(2.4, 0.07, 0.06, IT.marble), -0.2, 0.94, 2.12);                               // the lip the whey runs over
  const pail = add(g, cyl(0.20, 0.17, 0.30, IT.wood, 12), -0.2, 0.15, 2.36); pail.name = "it-whey-pail";
  add(g, cyl(0.17, 0.17, 0.05, IT.whey, 12), -0.2, 0.28, 2.36);
  // the curd on the table: the subject. A block, the lira that cuts it, and the whey it gives up
  const curd = add(g, new THREE.Group(), -0.35, 0.94, 1.5); curd.name = "it-curd";
  const blocks = Array.from({ length: 6 }, (_, i) => add(curd, box(0.20, 0.13, 0.20, IT.curd), -0.22 + (i % 3) * 0.22, 0.065, -0.11 + Math.floor(i / 3) * 0.22));
  const lira = add(g, new THREE.Group(), -0.35, 1.16, 1.24);
  add(lira, box(0.62, 0.03, 0.03, "#6e4a2c"), 0, 0, 0);
  for (let i = 0; i < 7; i++) add(lira, cyl(0.004, 0.004, 0.22, "#bcc2c6", 3), -0.27 + i * 0.09, -0.11, 0);
  const whey = pourFall(g, "it-whey", IT.whey, 0.026);
  const rings = splashRings(g, 3, -0.2, 0.30, 2.36, 0.05, IT.whey);
  const drip = Array.from({ length: 3 }, (_, i) => { const d = add(g, ball(0.016, IT.whey, 5), -0.2 + (i - 1) * 0.12, 0.85, 2.14); return d; });
  // the press, the oil jar and the cheeses on the shelf: the rest of the yard
  add(g, cyl(0.42, 0.44, 0.34, IT.wood, 14), 1.75, 0.17, 0.9);
  add(g, cyl(0.40, 0.40, 0.10, IT.curd, 14), 1.75, 0.39, 0.9);
  const screw = add(g, cyl(0.06, 0.06, 0.9, "#6e4a2c", 8), 1.75, 0.9, 0.9);
  add(g, box(1.0, 0.09, 0.2, "#6e4a2c"), 1.75, 1.32, 0.9);
  for (const dx of [-0.5, 0.5]) add(g, box(0.1, 1.5, 0.12, "#6e4a2c"), 1.75 + dx, 0.75, 0.9);
  const jar = add(g, ball(0.38, "#9c6a4a", 12), -2.3, 0.4, -1.2); jar.scale.y = 1.25;
  add(g, cyl(0.12, 0.16, 0.22, "#9c6a4a", 10), -2.3, 0.88, -1.2);
  for (let r = 0; r < 2; r++) { add(g, box(1.6, 0.06, 0.4, "#6e4a2c"), -1.9, 1.05 + r * 0.55, -0.5); for (let i = 0; i < 4; i++) add(g, cyl(0.17, 0.17, 0.16, "#efe2c0", 14), -2.5 + i * 0.42, 1.16 + r * 0.55, -0.5); }
  // the ewe at the gate, a dry-stone wall, and the people
  const ewe = add(g, new THREE.Group(), 2.6, 0, 2.0); ewe.name = "it-ewe-gate";
  add(ewe, ball(0.3, "#efe6d2", 9), 0, 0.62, 0).scale.set(1.5, 0.95, 0.9);
  const eweHead = add(ewe, ball(0.15, "#d9cdb4", 8), 0.42, 0.72, 0); eweHead.scale.set(1.25, 0.9, 0.85);
  for (const [dx, dz] of [[-0.24, -0.16], [-0.24, 0.16], [0.24, -0.16], [0.24, 0.16]]) add(ewe, cyl(0.05, 0.04, 0.44, "#5a4b3a", 5), dx, 0.24, dz);
  for (let i = 0; i < 9; i++) add(g, box(0.4, 0.22, 0.34, IT.stone), 1.6 + (i % 5) * 0.42, 0.11 + Math.floor(i / 5) * 0.22, 2.7);
  const dairywoman = add(g, own(resident("dairywoman")), -0.35, 0.08, 0.75) as Figure; dairywoman.rotation.y = 0.05;
  arms(dairywoman).right.rotation.x = -1.15; arms(dairywoman).left.rotation.x = -1.15;
  const presser = add(g, own(resident("farmer", false)), 1.15, 0.08, 0.9) as Figure; presser.rotation.y = 1.4;
  const shepherd = add(g, own(resident("shepherd", false)), 2.2, 0, 1.1) as Figure; shepherd.rotation.y = -1.9;
  const carrier = add(g, own(resident("townswoman", false)), -2.2, 0.08, 1.1) as Figure; carrier.rotation.y = 0.9;
  const child = add(g, own(resident("child")), -2.7, 0, 1.3) as Figure; child.rotation.y = 0.6;
  const walker = resident("farmer", false); add(g, walker, -2.1, 0.08, -0.1);
  const walk = pacer(walker, V(-2.1, 0.08, -0.1), V(1.4, 0.08, -0.1), 0.24, 0.9);
  const curdRest = curd.position.clone(), blockRest = blocks.map((b2) => b2.position.clone());
  return life(g, "cheese", [dairywoman, presser, shepherd, carrier, child, walker], (t, k) => {
    screw.rotation.y = t * 0.2;
    // the always-on loop is cold: the whey keeps dripping off the lip into the pail, three slow drops
    drip.forEach((d, i) => { const u = ((t * 0.5 + i * 0.33) % 1); d.position.y = 0.85 - u * 0.52; d.scale.setScalar(0.7 + u * 0.5); });
    // 1. material first: the lira comes down through the curd, the blocks part and the whey runs off the lip
    const cut = hold(k, 0.20, 0.72), run = k > 0 ? clamp01(((1 - k) - 0.14) / 0.56) : 0;
    lira.position.y = 1.16 - cut * 0.18; lira.position.z = 1.24 + cut * 0.48;
    curd.position.copy(curdRest); curd.position.y = curdRest.y - cut * 0.02; curd.position.z = curdRest.z + cut * 0.12; curd.rotation.y = cut * 0.14;
    blocks.forEach((b2, i) => {
      b2.position.copy(blockRest[i]);
      b2.position.x = blockRest[i].x + cut * ((i % 3) - 1) * 0.055;
      b2.position.z = blockRest[i].z + cut * (Math.floor(i / 3) - 0.5) * 0.09;
      b2.scale.y = 1 - cut * 0.22;
    });
    const running = run > 0.05 && run < 0.95;
    whey.set(V(-0.2, 0.93, 2.16), V(pail.position.x, 0.34, pail.position.z), running);
    rings.forEach((r, i) => { const a = run * 2.4 - i * 0.22; r.visible = running && a > 0 && a < 1; const s = 0.4 + a * 1.5; r.scale.set(s, s, 1); (r.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.8 - a * 0.8); });
    // 2. the dairywoman leans on the lira, 3. the ewe at the gate lifts its head and the presser looks up
    arms(dairywoman).right.rotation.x = -1.15 - cut * 0.45; upper(dairywoman).rotation.x = cut * 0.16;
    eweHead.position.y = 0.72 + beat(k, 0.45, 1) * 0.16; ewe.rotation.y = beat(k, 0.45, 1) * -0.3;
    upper(presser).rotation.y = beat(k, 0.55, 1) * 0.4;
    walk(t);
  });
}

/**
 * The Pescaria at the Rialto, at first light, under **the plain iron canopy of 1884** and not the stone loggia
 * that replaced it in 1907. A basket of sardines is tipped out along the wet marble and they slide and settle;
 * the fishwife spreads them and a buyer leans over the slab. Nothing here is hot, so nothing steams.
 */
export function fishMarket(): P {
  const g = group();
  // the iron canopy: four columns, lattice trusses and a light pitched sheet roof. No stone, no arcade.
  const posts = [-2.9, 2.9];
  for (const x of posts) for (const z of [-2.4, 0.9]) {
    add(g, cyl(0.10, 0.13, 2.7, "#5d6a6a", 8), x, 1.35, z);
    add(g, cyl(0.16, 0.16, 0.12, "#5d6a6a", 8), x, 0.06, z);
    for (const s of [-1, 1]) add(g, box(0.05, 0.5, 0.05, "#5d6a6a"), x + s * 0.2, 2.5, z).rotation.z = s * 0.7;
  }
  for (const z of [-2.4, 0.9]) { add(g, box(6.2, 0.10, 0.10, "#5d6a6a"), 0, 2.72, z); for (let i = 0; i < 9; i++) add(g, box(0.05, 0.42, 0.05, "#5d6a6a"), -2.8 + i * 0.7, 2.95, z).rotation.z = (i % 2 ? 1 : -1) * 0.55; }
  const beam = add(g, box(6.2, 0.12, 0.16, "#5d6a6a"), 0, 2.62, 0.9); beam.name = "front-beam";
  for (const s of [-1, 1]) { const r = add(g, box(6.4, 0.06, 2.1, "#8d9a99"), 0, 3.28, -0.75 + s * 1.0); r.rotation.x = s * 0.22; }
  add(g, box(6.5, 0.08, 0.12, "#7a8686"), 0, 3.42, -0.75);
  lamps(g, 2.62, 0.9, [-2.4, 2.4], 0.85, true);
  // the marble slabs: the long one at the front, a shorter one behind, both wet and raked
  add(g, box(5.0, 0.12, 1.3, IT.marble), 0, 0.84, 1.5);
  for (const dx of [-2.1, 0, 2.1]) add(g, box(0.18, 0.80, 1.2, "#cfc8bc"), dx, 0.40, 1.5);
  add(g, box(4.0, 0.10, 0.9, IT.marble), -0.3, 0.84, -1.3);
  for (const dx of [-1.6, 1.4]) add(g, box(0.16, 0.80, 0.85, "#cfc8bc"), -0.3 + dx, 0.40, -1.3);
  for (let i = 0; i < 26; i++) add(g, ball(0.05, "#eef4f4", 5), (rnd() - 0.5) * 4.6, 0.92, 1.5 + (rnd() - 0.5) * 1.1).scale.y = 0.35;   // the crushed ice
  // what is already laid out: a sole, an eel, a crab, cuttlefish and a tub of moeche
  fishOnIce(g, -1.9, 0.95, 1.25, "#7f93a6", 0.6); fishOnIce(g, -1.4, 0.95, 1.75, "#93a3ae", 0.5);
  octopus(g, 1.85, 0.92, 1.25, 0.8); crab(g, 1.45, 0.94, 1.8);
  for (let i = 0; i < 3; i++) add(g, cyl(0.045, 0.03, 0.7, "#6b7a6a", 6), 2.3, 0.94 + i * 0.03, 1.55).rotation.set(0, 0.3 * i, Math.PI / 2);
  const tub = add(g, cyl(0.28, 0.24, 0.2, IT.wood, 12), -0.3, 0.98, -1.3);
  for (let i = 0; i < 5; i++) add(tub, ball(0.06, "#7a6a55", 6), Math.cos(i * 1.26) * 0.12, 0.10, Math.sin(i * 1.26) * 0.12).scale.set(1.3, 0.55, 1);
  // the basket and the sardines: the subject. Tipped out along the slab, and back in the basket at rest.
  const sardines = add(g, new THREE.Group(), -0.2, 1.04, 2.05); sardines.name = "it-sardines";
  const basket = add(sardines, new THREE.Group(), 0, 0.02, 0);
  add(basket, cyl(0.30, 0.24, 0.26, "#c9a97a", 12), 0, 0, 0);
  for (let i = 0; i < 4; i++) add(basket, new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.015, 4, 12), mat("#b08d62")), 0, -0.09 + i * 0.07, 0).rotation.x = Math.PI / 2;
  const fish = Array.from({ length: 12 }, (_, i) => {
    const f = add(sardines, ball(0.05, i % 3 ? IT.sardine : "#b8c2c8", 7), Math.cos(i) * 0.12, 0.06 + (i % 4) * 0.03, Math.sin(i) * 0.12);
    f.scale.set(3.1, 0.62, 0.9); f.rotation.y = i * 0.5; return f;
  });
  const spread = fish.map((_, i) => V(-1.3 + i * 0.24, -0.10, -0.15 + (i % 3) * 0.22));
  // the people: the fishwife, a buyer over the slab, two porters, a boy, a woman, and a walker on the fondamenta
  const fishwife = add(g, own(resident("fishwife")), -0.2, 0, 0.5) as Figure; fishwife.rotation.y = 0;
  arms(fishwife).right.rotation.x = -1.15; arms(fishwife).left.rotation.x = -1.15;
  const buyer = add(g, own(resident("townswoman", false)), 1.3, 0, 0.9) as Figure; buyer.rotation.y = 0.1;
  const porterA = add(g, own(resident("porter", false)), -2.6, 0, 0.2) as Figure; porterA.rotation.y = 0.9;
  add(porterA, cyl(0.26, 0.22, 0.2, "#c9a97a", 10), 0, 1.75, 0);
  const porterB = add(g, own(resident("porter", false)), 2.7, 0, -0.4) as Figure; porterB.rotation.y = -1.1;
  const boy = add(g, own(resident("child")), 2.3, 0, 1.2) as Figure; boy.rotation.y = -2.2;
  const nonna = add(g, own(resident("townswoman", false)), -2.6, 0, 1.0) as Figure; nonna.rotation.y = 2.0;
  const walker = resident("fisher", false); add(g, walker, -2.3, 0, -2.0);
  const walk = pacer(walker, V(-2.3, 0, -2.0), V(2.4, 0, -2.0), 0.28, 2.1);
  // the gulls over the slabs: the always-on loop, well above the sight line and never in front of the fish
  const gulls = Array.from({ length: 3 }, (_, i) => {
    const gu = add(g, new THREE.Group(), 0, 3.8, -2.6);
    add(gu, ball(0.11, "#f4f1ea", 7), 0, 0, 0).scale.set(1.6, 0.8, 0.8);
    for (const s of [-1, 1]) add(gu, box(0.34, 0.02, 0.12, "#e8e4da"), s * 0.2, 0.03, 0).rotation.z = s * 0.3;
    add(gu, cone(0.03, 0.10, "#e0a52c", 4), 0.19, 0.01, 0).rotation.z = -Math.PI / 2;
    gu.userData.phase = i * 2.1; return gu;
  });
  const fishRest = fish.map((f) => f.position.clone()), sardRest = sardines.position.clone();
  return life(g, "seafood", [fishwife, buyer, porterA, porterB, boy, nonna, walker], (t, k) => {
    gulls.forEach((gu, i) => { const a = t * 0.5 + (gu.userData.phase as number); gu.position.set(Math.cos(a) * 2.4, 3.6 + Math.sin(a * 1.7) * 0.3, -2.4 + Math.sin(a) * 1.2); gu.rotation.y = -a + Math.PI / 2; gu.children[1].rotation.z = 0.3 + Math.sin(t * 6 + i) * 0.35; gu.children[2].rotation.z = -0.3 - Math.sin(t * 6 + i) * 0.35; });
    // 1. food first: the basket tips and the sardines slide out and settle along the wet marble
    const tip = hold(k, 0.18, 0.66), slide = k > 0 ? clamp01(((1 - k) - 0.12) / 0.66) : 0;
    basket.rotation.x = -tip * 1.25; basket.position.y = 0.02 + tip * 0.14; basket.position.z = -tip * 0.22;
    sardines.position.copy(sardRest);
    sardines.position.y = sardRest.y + tip * 0.05 - slide * 0.14; sardines.position.z = sardRest.z - slide * 0.50;
    fish.forEach((f, i) => {
      const p = clamp01(slide * 1.5 - i * 0.055);
      f.position.copy(fishRest[i]).lerp(spread[i], p);
      f.position.y = fishRest[i].y + (spread[i].y - fishRest[i].y) * p + Math.sin(p * Math.PI) * 0.1;
      f.rotation.y = i * 0.5 + p * (1.4 - (i % 3) * 0.35);
      f.rotation.z = Math.sin(p * Math.PI) * 0.5;
    });
    // 2. the fishwife's hands spread them, 3. the buyer leans over the slab and the boy edges in
    arms(fishwife).right.rotation.x = -1.15 - beat(k, 0.3, 0.95) * 0.35; arms(fishwife).left.rotation.x = -1.15 - beat(k, 0.35, 1) * 0.3;
    upper(fishwife).rotation.x = tip * 0.14;
    upper(buyer).rotation.x = beat(k, 0.5, 1) * 0.30; upper(buyer).rotation.y = beat(k, 0.5, 1) * -0.2;
    upper(boy).rotation.y = beat(k, 0.6, 1) * 0.4;
    walk(t);
  });
}

/**
 * The osteria: **the one grade of Venetian wine house where people both drank and ate**, and not a modern
 * cicchetti counter. A cask on its stand, a plain counter, a few plates. Wine is drawn from the tap into a
 * small glass, the host sets it down on the counter, and a man at the door turns round.
 */
export function bacaro(): P {
  const g = group();
  const b = bay(g, "venetianQuay", 5.0, 3.0, 2.4, { sign: "Ostaria" });
  lamps(g, b.y, b.zFront, [-2.0, 2.0], 0.85, true);
  // the counter across the front, and the cask on its stand behind it, the tap over the glass
  add(g, box(4.2, 0.10, 1.0, "#6e4a2c"), 0, 0.98, 1.5);
  add(g, box(4.2, 0.9, 0.16, "#5a3b2a"), 0, 0.48, 1.94);
  for (const dx of [-1.8, 1.8]) add(g, box(0.14, 0.92, 0.9, "#5a3b2a"), dx, 0.47, 1.5);
  // the big cask on its stand at the back, and the small one on its cradle on the counter that is drawn from
  add(g, box(1.5, 0.5, 0.8, "#6e4a2c"), -1.1, 0.25, 0.25);
  const cask = add(g, cyl(0.46, 0.46, 1.1, "#7a5230", 16), -1.1, 0.96, 0.25); cask.rotation.z = Math.PI / 2;
  for (const dx of [-0.42, -0.1, 0.22]) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.03, 5, 16), mat(IT.iron)), -1.1 + dx, 0.96, 0.25).rotation.y = Math.PI / 2;
  for (const dx of [-0.2, 0.2]) add(g, box(0.08, 0.45, 0.7, "#5a3b2a"), -1.2 + dx, 1.255, 1.3);
  const small = add(g, cyl(0.28, 0.28, 0.7, "#7a5230", 14), -1.2, 1.72, 1.35); small.rotation.x = Math.PI / 2;
  for (const dz of [-0.24, 0.24]) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.022, 4, 14), mat(IT.iron)), -1.2, 1.72, 1.35 + dz);
  add(g, cyl(0.03, 0.03, 0.16, IT.brass, 8), -1.2, 1.54, 1.76).rotation.x = Math.PI / 2;
  add(g, cyl(0.02, 0.02, 0.1, IT.brass, 6), -1.2, 1.49, 1.84);
  const handle = add(g, box(0.05, 0.14, 0.03, IT.brass), -1.2, 1.64, 1.8);
  // the small glass, the ombra: the subject. It is tilted under the tap as it fills, then slid along the marble.
  const ombra = add(g, new THREE.Group(), -1.2, 1.035, 1.86); ombra.name = "it-ombra";
  add(ombra, cyl(0.055, 0.042, 0.11, "#e2e6e2", 12), 0, 0.055, 0).material = mat("#e2e6e2", { transparent: true, opacity: 0.55 });
  add(ombra, cyl(0.05, 0.05, 0.012, "#e2e6e2", 12), 0, 0.005, 0);
  const wine = add(ombra, cyl(0.046, 0.04, 0.08, IT.wineRed, 12), 0, 0.045, 0);
  const pour = pourFall(g, "it-wine-pour", "#7d2530", 0.016);
  const rings = splashRings(g, 3, -1.2, 1.15, 1.86, 0.03, "#7d2530");
  // the plates an osteria really put out: bread, a boiled egg cut in half, sardines under onion, a little bowl
  for (const [px, food] of [[0.6, "sarde"], [1.5, "egg"]] as [number, string][]) {
    add(g, cyl(0.17, 0.15, 0.03, IT.lime, 12), px, 1.05, 1.45);
    if (food === "sarde") for (let i = 0; i < 4; i++) { const s = add(g, ball(0.04, IT.sardine, 6), px - 0.08 + i * 0.05, 1.08, 1.45); s.scale.set(2.2, 0.55, 0.9); s.userData.foodReaction = "hop"; }
    else for (let i = 0; i < 3; i++) { const e = add(g, ball(0.05, "#f7f2e6", 7), px - 0.06 + i * 0.06, 1.08, 1.45); e.scale.y = 0.6; add(g, ball(0.025, "#e0a52c", 5), px - 0.06 + i * 0.06, 1.11, 1.45).scale.y = 0.4; void e; }
  }
  for (let i = 0; i < 3; i++) add(g, ball(0.085, "#c9a06a", 7), -0.3 + i * 0.16, 1.06, 1.7).scale.set(1.5, 0.7, 0.9);
  for (let i = 0; i < 6; i++) add(g, cyl(0.05, 0.045, 0.1, "#e2e6e2", 10), 1.8 - (i % 3) * 0.16, 1.05 + Math.floor(i / 3) * 0.11, 1.75);   // the rack of glasses
  // bottles and a rack of flasks on the back wall, and a pitcher on the counter: the still life
  add(g, box(2.2, 0.06, 0.3, "#5a3b2a"), 1.0, 1.17, -1.95);
  for (let i = 0; i < 7; i++) { add(g, cyl(0.055, 0.065, 0.3, i % 2 ? "#3f5a3a" : "#5a3b2a", 8), 0.1 + i * 0.28, 1.35, -1.95); add(g, cyl(0.022, 0.022, 0.12, i % 2 ? "#3f5a3a" : "#5a3b2a", 6), 0.1 + i * 0.28, 1.55, -1.95); }
  const pitcher = add(g, cyl(0.10, 0.13, 0.26, "#cfd8cf", 12), 0.1, 1.11, 1.2); pitcher.userData.foodReaction = "sway";
  // the people: the host, a man at the door who turns, two at the counter, two on the bench, a walker
  const host = add(g, own(resident("oste")), -0.9, 0.08, 0.7) as Figure; host.rotation.y = -0.2;
  arms(host).right.rotation.x = -1.05; arms(host).left.rotation.x = -0.6;
  const atDoor = add(g, own(resident("porter", false)), 2.6, 0, 1.15) as Figure; atDoor.rotation.y = -2.4;
  const drinkerA = add(g, own(resident("fisher", false)), -2.4, 0, 1.25) as Figure; drinkerA.rotation.y = 1.9;
  const drinkerB = add(g, own(resident("townsman", false)), 1.9, 0, 1.2) as Figure; drinkerB.rotation.y = -1.9;
  const by = bench(g, 1.9, -0.3, 1.9, -0.4, 0.44);
  const sitterA = seatFigure(g, resident("townswoman", false), 1.4, -0.15, -0.4, by + 0.02);
  const sitterB = seatFigure(g, resident("fisher", false), 2.3, -0.5, -0.4, by + 0.02);
  const walker = resident("townsman", false); add(g, walker, -2.2, 0.08, 0.2);
  const walk = pacer(walker, V(-2.2, 0.08, 0.2), V(0.6, 0.08, 0.2), 0.22, 1.4);
  const ombraRest = ombra.position.clone();
  return life(g, "bacaro", [host, atDoor, drinkerA, drinkerB, sitterA, sitterB, walker], (t, k) => {
    pitcher.rotation.z = Math.sin(t * 0.9) * 0.012;
    // 1. drink first: the tap opens, the wine falls into the glass, the level rises, the glass is set down
    const u = k > 0 ? 1 - k : 1;
    const open = k > 0 && u < 0.66 ? 1 : 0, fill = k > 0 ? clamp01((u - 0.06) / 0.58) : 0;
    const serve = k > 0 ? (u < 0.66 ? 0 : u < 0.78 ? (u - 0.66) / 0.12 : u < 0.92 ? 1 : (1 - u) / 0.08) : 0;
    const tilt = k > 0 ? Math.min(1, u / 0.12) * (1 - serve) : 0;
    handle.rotation.x = -open * 0.9;
    wine.scale.y = 0.12 + fill * 0.88; wine.position.y = 0.012 + (0.08 * (0.12 + fill * 0.88)) / 2;
    ombra.position.copy(ombraRest);
    ombra.position.y = ombraRest.y + tilt * 0.05 + Math.sin(serve * Math.PI) * 0.02; ombra.position.x = ombraRest.x + serve * 1.7;
    ombra.rotation.z = -tilt * 0.22;
    const running = open > 0 && fill > 0.02 && fill < 0.99;
    pour.set(V(-1.2, 1.44, 1.84), V(ombra.position.x, ombra.position.y + 0.1, ombra.position.z), running);
    rings.forEach((r, i) => { const a = fill * 2.4 - i * 0.22; r.visible = running && a > 0 && a < 1; const s = 0.4 + a * 1.5; r.scale.set(s, s, 1); (r.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.8 - a * 0.8); });
    // 2. the host's hand follows the glass, 3. the man at the door turns round and a drinker looks along
    arms(host).right.rotation.x = -1.05 - tilt * 0.25 + serve * 0.3; upper(host).rotation.y = -0.2 + serve * 0.5;
    atDoor.rotation.y = -2.4 + beat(k, 0.5, 1) * 1.5;
    upper(drinkerA).rotation.y = beat(k, 0.55, 1) * -0.45;
    walk(t);
  });
}

/**
 * The lagoon kitchen on Burano: a fisherman's house on the fondamenta with the floating cage beside it. Soft
 * crabs go from the cage into the beaten egg and then into the pan; the woman's hands follow and the man at the
 * door shifts the oar. The cage stands on the quay, not in the water: the Albufera rule holds for the stand too.
 */
export function buranoKitchen(): P {
  const g = group();
  const b = bay(g, "buranoCottage", 4.8, 3.0, 2.4, { sign: "Moeche" });
  lamps(g, b.y, b.zFront, [-1.9, 1.9], 0.85, true);
  // the working bench at the front, with the fire box and the pan on the end nearest the visitor
  add(g, box(4.0, 0.09, 1.1, IT.wood), 0, 0.90, 1.5);
  for (const dx of [-1.7, 1.7]) for (const dz of [1.05, 1.95]) add(g, box(0.09, 0.86, 0.09, "#6e4a2c"), dx, 0.44, dz);
  const firebox = add(g, box(0.9, 0.36, 0.8, "#8a5a3c"), 0.95, 1.13, 1.5);
  void firebox;
  const fires = Array.from({ length: 3 }, (_, i) => add(g, cone(0.07, 0.2, i % 2 ? IT.flameHot : IT.flame, 6), 0.75 + i * 0.2, 1.34, 1.5));
  const pan = add(g, cyl(0.38, 0.32, 0.12, IT.iron, 16), 0.95, 1.41, 1.5);
  const oil = add(g, cyl(0.33, 0.33, 0.03, "#e2c27a", 16), 0.95, 1.46, 1.5);
  add(g, cyl(0.02, 0.02, 0.6, IT.wood, 5), 1.55, 1.44, 1.5).rotation.z = Math.PI / 2;
  // the bowl of beaten egg and the flour plate between the cage and the pan
  const eggBowl = add(g, cyl(0.20, 0.16, 0.13, IT.lime, 12), -0.15, 0.97, 1.55);
  const eggMix = add(g, cyl(0.17, 0.17, 0.04, "#e8c86a", 12), -0.15, 1.02, 1.55);
  void eggBowl;
  add(g, cyl(0.17, 0.15, 0.04, IT.lime, 12), -0.7, 0.96, 1.7);
  for (let i = 0; i < 6; i++) add(g, ball(0.02, "#f4eee0", 4), -0.7 + (rnd() - 0.5) * 0.24, 0.99, 1.7 + (rnd() - 0.5) * 0.2).scale.y = 0.4;
  // the cage: a slatted crate on the quay with the live crabs in it, water in a shallow trough under it
  const cage = add(g, new THREE.Group(), -1.55, 0.95, 1.55);
  add(cage, box(0.74, 0.06, 0.62, "#8a6844"), 0, -0.12, 0);
  for (let i = 0; i < 7; i++) add(cage, box(0.05, 0.22, 0.62, "#8a6844"), -0.33 + i * 0.11, 0, 0);
  for (const dz of [-0.31, 0.31]) add(cage, box(0.74, 0.22, 0.05, "#8a6844"), 0, 0, dz);
  add(g, box(0.9, 0.05, 0.75, "#7fa8a0"), -1.55, 0.86, 1.55);
  // the soft crabs: the subject. They lift out of the cage, dip in the egg and land in the pan.
  const moeche = add(g, new THREE.Group(), -1.55, 1.0, 1.55);
  const crabs = Array.from({ length: 4 }, (_, i) => {
    const c = add(moeche, new THREE.Group(), -0.2 + (i % 2) * 0.28, 0.02 + Math.floor(i / 2) * 0.06, -0.14 + Math.floor(i / 2) * 0.26);
    if (i === 0) c.name = "it-moeche";
    add(c, ball(0.10, "#7a6a4a", 8), 0, 0, 0).scale.set(1.35, 0.5, 1.05);
    for (let n = 0; n < 4; n++) for (const s of [-1, 1]) add(c, cyl(0.009, 0.009, 0.14, "#7a6a4a", 3), s * 0.12, 0, -0.07 + n * 0.05).rotation.z = s * 1.1;
    for (const s of [-1, 1]) add(c, ball(0.035, "#8a7a56", 5), s * 0.11, 0.015, 0.11).scale.set(1.3, 0.7, 1.1);
    return c;
  });
  const dip = V(-0.15, 1.02, 1.55), land = V(0.95, 1.55, 1.62);
  // artichoke bottoms from Sant'Erasmo and a basket of gò in a tray, the rest of the modelled food
  for (let i = 0; i < 5; i++) add(g, cyl(0.075, 0.055, 0.05, "#cfd6a8", 10), -1.1 + i * 0.16, 0.96, 1.15);
  const tray = add(g, box(0.7, 0.05, 0.4, "#8a6844"), 1.7, 0.94, 1.9);
  for (let i = 0; i < 4; i++) { const go = add(tray, ball(0.045, "#8a8f6a", 6), -0.22 + i * 0.15, 0.05, 0); go.scale.set(2.4, 0.6, 0.95); go.userData.foodReaction = "hop"; }
  // nets and floats hung from the beam: the always-on sway at the ends of the bay
  const nets = Array.from({ length: 2 }, (_, i) => {
    const n = add(g, new THREE.Group(), -1.7 + i * 3.4, b.y - 0.14, b.zFront - 0.05); n.userData.foodReaction = "sway";
    add(n, cyl(0.008, 0.008, 0.18, "#7a6a55", 4), 0, -0.09, 0);
    for (let r = 0; r < 4; r++) add(n, box(0.28 - r * 0.04, 0.012, 0.012, "#b9ad98"), 0, -0.22 - r * 0.08, 0);
    add(n, ball(0.055, "#c0392b", 6), 0.1, -0.48, 0);
    return n;
  });
  // the people: the woman at the pan, the man at the door with the oar, a girl, two neighbours, a walker
  const woman = add(g, own(resident("cook")), 0.1, 0.08, 0.6) as Figure; woman.rotation.y = 0;
  arms(woman).right.rotation.x = -1.2; arms(woman).left.rotation.x = -1.1;
  const man = add(g, own(resident("fisher", false)), -2.3, 0.08, 0.6) as Figure; man.rotation.y = 1.2;
  const oar = add(g, new THREE.Group(), -2.05, 0.08, 0.95);                  // the oar stood on its blade beside him
  add(oar, cyl(0.022, 0.028, 1.9, IT.wood, 6), 0, 1.0, 0);
  add(oar, box(0.14, 0.42, 0.02, "#9c7a4a"), 0, 0.21, 0);
  arms(man).right.rotation.x = -0.35;
  const girl = add(g, own(resident("child")), 2.0, 0.08, 1.2) as Figure; girl.rotation.y = -2.2;
  const neighbourA = add(g, own(resident("fisher", false)), 2.5, 0, 1.4) as Figure; neighbourA.rotation.y = -1.5;
  const neighbourB = add(g, own(resident("townswoman", false)), 2.8, 0, 0.2) as Figure; neighbourB.rotation.y = -1.7;
  const walker = resident("fisher", false); add(g, walker, -2.1, 0.08, -0.1);
  const walk = pacer(walker, V(-2.1, 0.08, -0.1), V(1.9, 0.08, -0.1), 0.26, 0.4);
  g.userData.steam = V(0.95, 1.85, 1.5); g.userData.smoke = V(0.95, 1.55, 1.5);
  const crabRest = crabs.map((c) => c.position.clone());
  return life(g, "lagunaIt", [woman, man, girl, neighbourA, neighbourB, walker], (t, k) => {
    fires.forEach((f, i) => { const s = 0.85 + Math.sin(t * 10 + i * 2) * 0.2 + beat(k, 0.3, 0.9) * 0.4; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    oil.scale.y = 1 + Math.sin(t * 3.4) * 0.16;
    nets.forEach((n, i) => { n.rotation.z = Math.sin(t * 1.25 + i) * 0.05; });
    crabs.forEach((c, i) => { if (k <= 0) { c.rotation.z = i === 0 ? 0 : Math.sin(t * 2.2 + i) * 0.05; c.rotation.y = 0; } });
    // 1. food first: each crab lifts out of the cage, goes through the egg and lands in the pan
    crabs.forEach((c, i) => {
      const p = k > 0 ? clamp01(((1 - k) - i * 0.10) / 0.62) : 0;
      c.position.copy(crabRest[i]);
      if (p > 0) {
        const toEgg = clamp01(p / 0.45), toPan = clamp01((p - 0.45) / 0.55);
        const from = crabRest[i].clone().add(moeche.position);
        const at = from.clone().lerp(dip, toEgg).lerp(land.clone().add(V((i % 2) * 0.22 - 0.11, 0, (i > 1 ? 0.18 : -0.18))), toPan);
        at.y += Math.sin(toEgg * Math.PI) * 0.22 + Math.sin(toPan * Math.PI) * 0.26;
        c.position.copy(at.sub(moeche.position));
        c.rotation.z = Math.sin(p * Math.PI * 2) * 0.5; c.rotation.y = p * 1.6;
      } else c.rotation.y = 0;
    });
    eggMix.scale.y = 1 + beat(k, 0.2, 0.6) * 0.5;
    // 2. the woman's hands follow them across, 3. the man shifts the oar and the girl leans in
    arms(woman).right.rotation.x = -1.2 - beat(k, 0.15, 0.85) * 0.45; arms(woman).left.rotation.x = -1.1 - beat(k, 0.2, 0.9) * 0.3;
    arms(man).right.rotation.x = -0.35 - beat(k, 0.5, 1) * 0.5; upper(man).rotation.y = beat(k, 0.5, 1) * 0.3; oar.rotation.z = 0.08 + beat(k, 0.5, 1) * 0.25;
    upper(girl).rotation.x = beat(k, 0.6, 1) * 0.22;
    walk(t);
  });
}

/**
 * The terraferma kitchen behind the lagoon: maize in the copper, and the poverty that came with it. The polenta
 * stick turns in the paiolo and the mass folds over on itself; the woman leans into it and a child waits at the
 * board with the wire that will cut it.
 */
export function venetoFarm(): P {
  const g = group();
  const b = bay(g, "terraferma", 5.2, 3.2, 2.5, { sign: "Polenta" });
  lamps(g, b.y, b.zFront, [-2.1, 2.1], 0.9);
  // the open hearth at the front of the bay, the chain and the copper over it
  add(g, box(1.6, 0.26, 1.2, IT.stone), -0.6, 0.13, 1.35);
  const logs = Array.from({ length: 4 }, (_, i) => add(g, cyl(0.06, 0.07, 0.62, "#6e4a2c", 6), -0.8 + i * 0.13, 0.32, 1.35));
  const fires = Array.from({ length: 4 }, (_, i) => add(g, cone(0.10, 0.34, i % 2 ? IT.flameHot : IT.flame, 6), -0.85 + i * 0.18, 0.45, 1.35));
  const hook = add(g, new THREE.Group(), -0.6, 2.2, 1.35);
  for (let i = 0; i < 5; i++) add(hook, new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.010, 4, 8), mat(IT.iron)), 0, -i * 0.06, 0).rotation.x = (i % 2) * Math.PI / 2;
  add(hook, cyl(0.012, 0.012, 0.5, IT.iron, 4), 0, -0.55, 0);
  const swing = add(g, new THREE.Group(), -0.6, 2.2, 1.35);
  const paiolo = add(swing, cyl(0.42, 0.30, 0.46, IT.copper, 18), 0, -1.08, 0);
  add(swing, new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.028, 5, 18), mat(IT.copper)), 0, -0.86, 0).rotation.x = Math.PI / 2;
  add(swing, new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.018, 4, 14, Math.PI), mat(IT.iron)), 0, -0.82, 0).rotation.y = Math.PI / 2;
  void paiolo;
  // the polenta and the stick: the subject. The stick turns and the mass folds over on itself.
  const polenta = add(swing, new THREE.Group(), 0, -0.80, 0); polenta.name = "it-polenta";
  const mass = add(polenta, cyl(0.36, 0.34, 0.12, "#e0b33a", 16), 0, 0, 0);
  const lobes = Array.from({ length: 5 }, (_, i) => add(polenta, ball(0.11, "#e8bf4a", 7), Math.cos(i * 1.26) * 0.2, 0.05, Math.sin(i * 1.26) * 0.2));
  const stick = add(polenta, cyl(0.022, 0.03, 0.9, "#c9a37a", 6), 0.08, 0.44, 0.04); stick.rotation.z = 0.18;
  void mass;
  // the board, the wire and the loaf already cut, on the table at the front where the camera sees it
  add(g, box(1.6, 0.09, 1.0, IT.wood), 1.6, 0.90, 1.6);
  for (const dx of [-0.6, 0.6]) for (const dz of [-0.35, 0.35]) add(g, box(0.09, 0.86, 0.09, "#6e4a2c"), 1.6 + dx, 0.44, 1.6 + dz);
  const loaf = add(g, cyl(0.30, 0.30, 0.12, "#e6b845", 16), 1.55, 1.00, 1.55); loaf.userData.foodReaction = "hop";
  for (let i = 0; i < 3; i++) add(g, box(0.28, 0.10, 0.22, "#e6b845"), 1.95 + i * 0.02, 1.0, 1.9 + i * 0.05).rotation.y = i * 0.3;
  const wireBow = add(g, new THREE.Group(), 1.55, 1.18, 1.2);
  add(wireBow, box(0.4, 0.03, 0.03, "#6e4a2c"), 0, 0.1, 0);
  add(wireBow, cyl(0.003, 0.003, 0.4, "#bcc2c6", 3), 0, 0, 0).rotation.z = Math.PI / 2;
  // maize hanging from the beam, a bin of flour and the salt cellar: the loop and the still life
  const cobs = Array.from({ length: 5 }, (_, i) => {
    const c = add(g, new THREE.Group(), -2.2 + i * 0.28, b.y - 0.13, b.zFront - 0.05); c.userData.foodReaction = "sway";
    add(c, cyl(0.007, 0.007, 0.16, "#8a7f60", 4), 0, -0.08, 0);
    add(c, cyl(0.045, 0.055, 0.28, "#e0b33a", 8), 0, -0.3, 0);
    for (let n = 0; n < 3; n++) add(c, box(0.02, 0.2, 0.01, "#c9b06a"), Math.cos(n * 2) * 0.05, -0.2, Math.sin(n * 2) * 0.05).rotation.z = Math.cos(n) * 0.3;
    return c;
  });
  add(g, cyl(0.34, 0.38, 0.6, IT.wood, 12), 2.6, 0.3, 0.5);
  add(g, cyl(0.31, 0.31, 0.08, "#e8c86a", 12), 2.6, 0.62, 0.5);
  // the people: the woman at the copper, the child at the board, the man at the door, an old woman, two at table
  const woman = add(g, own(resident("cook")), -0.6, 0.08, 0.55) as Figure; woman.rotation.y = 0;
  arms(woman).right.rotation.x = -1.35; arms(woman).left.rotation.x = -0.9;
  const child = add(g, own(resident("child")), 1.55, 0.08, 0.9) as Figure; child.rotation.y = 0;
  const man = add(g, own(resident("farmer", false)), -2.4, 0.08, 0.5) as Figure; man.rotation.y = 1.3;
  const benchTop = bench(g, -2.2, 0.2, 1.3, 0.9, 0.42);
  const nonna = seatFigure(g, resident("townswoman", false), -2.0, 0.15, 0.9, benchTop + 0.02);
  const eater = sit(g, 2.5, 0.2, -1.2, "farmer", 0.44);
  const walker = resident("worker", false); add(g, walker, -1.9, 0.08, -0.4);
  const walk = pacer(walker, V(-1.9, 0.08, -0.4), V(1.9, 0.08, -0.4), 0.26, 1.9);
  g.userData.steam = V(-0.6, 1.6, 1.35); g.userData.smoke = V(-0.6, 0.9, 1.35);
  return life(g, "casaVeneta", [woman, child, man, nonna, eater, walker], (t, k) => {
    fires.forEach((f, i) => { const s = 0.9 + Math.sin(t * 9 + i * 1.7) * 0.2 + beat(k, 0.25, 0.85) * 0.35; f.scale.set(s, s, s); f.rotation.y = t * 1.7 + i; });
    logs.forEach((l, i) => { l.rotation.z = Math.sin(t * 0.4 + i) * 0.02; });
    swing.rotation.z = Math.sin(t * 0.8) * 0.02 + beat(k, 0.3, 0.95) * 0.07;
    cobs.forEach((c, i) => { c.rotation.z = Math.sin(t * 1.2 + i) * 0.05; });
    // 1. material first: the stick turns and the whole mass folds over on itself in the copper
    const turn = k > 0 ? (1 - k) * 7.5 : 0, fold = beat(k, 0.10, 0.95);
    stick.rotation.y = turn; stick.position.x = 0.08 + Math.sin(turn) * 0.12; stick.position.z = 0.04 + Math.cos(turn) * 0.12;
    polenta.rotation.y = turn * 0.55;
    lobes.forEach((lo, i) => {
      const a = i * 1.26 + turn * 0.55;
      lo.position.set(Math.cos(a) * (0.2 - fold * 0.07), 0.05 + fold * 0.14 * Math.abs(Math.sin(a + turn)), Math.sin(a) * (0.2 - fold * 0.07));
      lo.scale.setScalar(1 + fold * 0.18 * Math.sin(a * 2));
    });
    // 2. the woman leans into the stick, 3. the child lifts the wire and the man at the door looks in
    arms(woman).right.rotation.x = -1.35 - fold * 0.25; upper(woman).rotation.x = 0.06 + fold * 0.14;
    wireBow.position.y = 1.18 + beat(k, 0.55, 1) * 0.12; wireBow.rotation.z = beat(k, 0.55, 1) * 0.3;
    arms(child).right.rotation.x = -0.4 - beat(k, 0.55, 1) * 0.8;
    upper(man).rotation.y = beat(k, 0.6, 1) * 0.35;
    walk(t);
  });
}

/**
 * The friggitoria in the Albergheria: one pan of lard on a charcoal box, and everything Palermo eats standing
 * up. A slab of chickpea paste is cut into squares and slid into the lard, which lifts and closes; the fryer's
 * arm follows and a boy at the kerb holds out a roll.
 */
export function friggitoria(): P {
  const g = group();
  const b = bay(g, "palermoTufa", 4.8, 2.8, 2.5, { sign: "Frittura" });
  lamps(g, b.y, b.zFront, [-1.9, 1.9], 0.85);
  // the marble bench across the front: the charcoal box and the pan at the right, the board at the left
  add(g, box(4.0, 0.10, 1.1, IT.marble), 0, 0.94, 1.5);
  for (const dx of [-1.7, 0, 1.7]) add(g, box(0.16, 0.9, 1.0, IT.tufa), dx, 0.45, 1.5);
  const charcoalBox = add(g, box(1.0, 0.42, 0.9, "#8a5a3c"), 1.1, 1.20, 1.5);
  for (let i = 0; i < 6; i++) add(g, box(0.10, 0.08, 0.10, IT.charcoal), 0.75 + (i % 3) * 0.28, 1.40, 1.35 + Math.floor(i / 3) * 0.26);
  void charcoalBox;
  const fires = Array.from({ length: 3 }, (_, i) => add(g, cone(0.08, 0.22, i % 2 ? IT.flameHot : IT.flame, 6), 0.85 + i * 0.25, 1.48, 1.5));
  const pan = add(g, cyl(0.46, 0.38, 0.20, IT.iron, 18), 1.1, 1.53, 1.5);
  const lard = add(g, cyl(0.41, 0.41, 0.05, "#efe4c2", 18), 1.1, 1.60, 1.5); lard.name = "it-lard";
  add(g, cyl(0.02, 0.02, 0.7, IT.wood, 5), 1.78, 1.58, 1.5).rotation.z = Math.PI / 2;
  const skimmer = add(g, new THREE.Group(), 1.1, 1.72, 1.16);
  add(skimmer, cyl(0.13, 0.13, 0.02, "#bcc2c6", 12), 0, 0, 0);
  add(skimmer, cyl(0.012, 0.012, 0.5, IT.wood, 5), 0, 0.02, -0.26).rotation.x = Math.PI / 2;
  // the slab of panelle paste and the squares cut from it: the subject
  const board = add(g, box(1.0, 0.05, 0.7, "#c9a37a"), -0.95, 0.99, 1.55);
  void board;
  const panelle = add(g, new THREE.Group(), -0.95, 1.02, 1.55); panelle.name = "it-panelle";
  const squares = Array.from({ length: 6 }, (_, i) => add(panelle, box(0.24, 0.035, 0.22, "#e3cf8e"), -0.26 + (i % 3) * 0.26, 0.018, -0.12 + Math.floor(i / 3) * 0.24));
  const blade = add(g, box(0.34, 0.012, 0.06, "#bcc2c6"), -0.95, 1.10, 1.28);
  add(blade, box(0.1, 0.03, 0.045, "#5a4636"), -0.22, 0, 0);
  // the rest of the barrow: crocchè, sfincione squares, the lemon halves, the paper and the rolls
  for (let i = 0; i < 5; i++) { const cr = add(g, cyl(0.05, 0.05, 0.17, "#d9a55b", 8), -0.1 + i * 0.12, 1.02, 1.85); cr.rotation.z = Math.PI / 2; cr.userData.foodReaction = "hop"; }
  for (let i = 0; i < 4; i++) add(g, box(0.2, 0.07, 0.18, "#d98a4a"), 0.1 + (i % 2) * 0.22, 1.02, 1.2 + Math.floor(i / 2) * 0.2);
  for (let i = 0; i < 4; i++) { const r = add(g, ball(0.09, "#d9a55b", 7), -1.85 + (i % 2) * 0.2, 1.02, 1.3 + Math.floor(i / 2) * 0.24); r.scale.set(1.2, 0.8, 1); r.userData.foodReaction = "hop"; }
  for (const dx of [-1.55, -1.35]) add(g, ball(0.075, IT.lemon, 7), dx, 1.02, 1.85).scale.y = 0.6;
  add(g, box(0.3, 0.02, 0.28, "#e9e2d2"), -1.6, 0.99, 1.62);
  // the tufa wall's awning fringe and a string of chillies: the always-on loop, at the ends
  const strings = Array.from({ length: 2 }, (_, i) => {
    const s = add(g, new THREE.Group(), -1.75 + i * 3.5, b.y - 0.12, b.zFront - 0.05); s.userData.foodReaction = "sway";
    add(s, cyl(0.007, 0.007, 0.16, "#8a7f60", 4), 0, -0.08, 0);
    for (let n = 0; n < 6; n++) add(s, cone(0.028, 0.14, "#c0392b", 5), Math.cos(n * 1.1) * 0.05, -0.22 - n * 0.055, Math.sin(n * 1.1) * 0.05).rotation.z = Math.PI;
    return s;
  });
  // the people: the fryer, a boy at the kerb with a roll, two waiting, a woman with a basket, a walker
  const fryer = add(g, own(resident("cook")), 0.1, 0.08, 0.55) as Figure; fryer.rotation.y = 0;
  arms(fryer).right.rotation.x = -1.25; arms(fryer).left.rotation.x = -1.0;
  const boy = add(g, own(resident("child")), 0.75, 0, 1.15) as Figure; boy.rotation.y = 2.9;
  const roll = add(arms(boy).right, ball(0.085, "#d9a55b", 7), 0.02, arms(boy).hand - 0.05, 0.08); roll.scale.set(1.2, 0.8, 1);
  const waitA = add(g, own(resident("worker", false)), -1.8, 0, 1.15) as Figure; waitA.rotation.y = -2.7;
  const waitB = add(g, own(resident("carter", false)), -2.4, 0, 0.8) as Figure; waitB.rotation.y = 2.4;
  const woman = add(g, own(resident("townswoman", false)), 2.4, 0, 1.1) as Figure; woman.rotation.y = -2.3;
  const walker = resident("worker", false); add(g, walker, -1.8, 0.08, 0.3);
  const walk = pacer(walker, V(-1.8, 0.08, 0.3), V(1.8, 0.08, 0.3), 0.28, 1.2);
  g.userData.steam = V(1.1, 1.95, 1.5); g.userData.smoke = V(1.1, 1.7, 1.5);
  const squareRest = squares.map((s) => s.position.clone()), panelleRest = panelle.position.clone();
  return life(g, "friggitoria", [fryer, boy, waitA, waitB, woman, walker], (t, k) => {
    fires.forEach((f, i) => { const s = 0.85 + Math.sin(t * 11 + i * 2) * 0.22 + beat(k, 0.2, 0.8) * 0.45; f.scale.set(s, s, s); f.rotation.y = t * 2.2 + i; });
    lard.scale.y = 1 + Math.sin(t * 3.8) * 0.1;
    strings.forEach((s, i) => { s.rotation.z = Math.sin(t * 1.3 + i) * 0.05; });
    // 1. food first: the blade runs across the slab, the squares slide off the board into the lard, which lifts
    const cut = hold(k, 0.14, 0.50), slide = k > 0 ? clamp01(((1 - k) - 0.18) / 0.56) : 0;
    blade.position.z = 1.28 + cut * 0.5; blade.position.y = 1.10 - cut * 0.06; blade.rotation.x = -cut * 0.3;
    panelle.position.copy(panelleRest);
    panelle.position.x = panelleRest.x + slide * 0.55; panelle.position.y = panelleRest.y + slide * 0.30;
    panelle.rotation.z = slide * 0.18;
    squares.forEach((s, i) => {
      const p = clamp01(slide * 1.6 - i * 0.10);
      s.position.copy(squareRest[i]);
      s.position.x = squareRest[i].x + p * (1.50 + (i % 3) * 0.08); s.position.z = squareRest[i].z - p * (Math.floor(i / 3) * 0.2);
      s.position.y = squareRest[i].y + Math.sin(p * Math.PI) * 0.42 + p * 0.26;
      s.rotation.x = p * 1.2; s.rotation.y = p * 0.8;
    });
    lard.scale.y = 1 + Math.sin(t * 3.8) * 0.1 + beat(k, 0.3, 0.9) * 1.1;
    skimmer.rotation.z = beat(k, 0.4, 0.95) * 0.5; skimmer.position.y = 1.72 + beat(k, 0.4, 0.95) * 0.1;
    // 2. the fryer's arm follows the squares across, 3. the boy holds out the roll and a waiter leans in
    arms(fryer).right.rotation.x = -1.25 - beat(k, 0.2, 0.9) * 0.5; upper(fryer).rotation.y = -beat(k, 0.2, 0.9) * 0.3;
    arms(boy).right.rotation.x = -0.5 - beat(k, 0.55, 1) * 0.85;
    upper(waitA).rotation.x = beat(k, 0.6, 1) * 0.18;
    walk(t);
  });
}

/**
 * Ballarò, the market as a kitchen, with the vendors' sung cry over it and the three stall children of the
 * object list behind it at the blueprint's offsets. A swordfish steak is laid on the block and the cleaver comes
 * down; the fishmonger straightens and a woman with a basket steps in.
 */
export function sicilyMarket(): P {
  const g = group();
  const sh = shade(g, 5.2, 2.8, 2.5, 0, 0.6, "#c9603e");
  lamps(g, sh.y, sh.zFront, [-2.1, 2.1], 0.85);
  // the block and the slab at the front, with the swordfish's own bill standing at the corner
  add(g, box(4.6, 0.10, 1.2, IT.marble), 0, 0.90, 1.7);
  for (const dx of [-1.9, 0, 1.9]) add(g, box(0.18, 0.86, 1.1, IT.tufa), dx, 0.43, 1.7);
  const block = add(g, cyl(0.52, 0.56, 0.26, "#a3865a", 16), -0.55, 1.08, 1.7);
  for (let i = 0; i < 8; i++) add(block, box(0.5, 0.006, 0.03, "#8a6e46"), 0, 0.13, -0.25 + i * 0.07);
  const bill = add(g, cone(0.05, 1.1, "#6a7a86", 6), 2.05, 1.52, 1.95); bill.rotation.z = 0.35;
  add(g, ball(0.2, "#6a7a86", 9), 2.15, 1.05, 1.95).scale.set(1.4, 1, 1);
  // the swordfish steak: the subject. It is laid on the block and the cleaver parts it.
  const steak = add(g, new THREE.Group(), -0.55, 1.28, 1.7); steak.name = "it-swordfish";
  const halves = [-1, 1].map((s) => {
    const h = add(steak, new THREE.Group(), 0, 0, 0);
    const flesh = add(h, cyl(0.26, 0.26, 0.07, "#e0b4a8", 16), 0, 0, 0);
    flesh.geometry = new THREE.CylinderGeometry(0.26, 0.26, 0.07, 16, 1, false, s > 0 ? 0 : Math.PI, Math.PI);
    add(h, box(0.02, 0.075, 0.5, "#8a5a4a"), 0, 0.002, 0);
    add(h, new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.018, 4, 16, Math.PI), mat("#c9a094")), 0, 0, 0).rotation.set(Math.PI / 2, 0, s > 0 ? 0 : Math.PI);
    return h;
  });
  const cleaver = add(g, new THREE.Group(), -0.55, 1.62, 1.44);
  add(cleaver, box(0.34, 0.16, 0.02, "#bcc2c6"), 0, 0, 0);
  add(cleaver, box(0.12, 0.05, 0.04, "#5a4636"), -0.22, 0, 0);
  // the rest of the slab: sardines, a tub of olives, tomatoes, lemons, a tray of caponata vegetables
  for (let i = 0; i < 7; i++) { const s = add(g, ball(0.045, IT.sardine, 6), 0.5 + (i % 4) * 0.16, 0.98, 1.45 + Math.floor(i / 4) * 0.22); s.scale.set(2.4, 0.6, 0.9); s.userData.foodReaction = "hop"; }
  const olives = add(g, cyl(0.2, 0.17, 0.14, IT.wood, 12), 1.45, 1.01, 1.85);
  for (let i = 0; i < 6; i++) add(olives, ball(0.04, i % 2 ? "#2f3a2a" : "#7d9058", 5), Math.cos(i * 1.05) * 0.1, 0.08, Math.sin(i * 1.05) * 0.1);
  for (let i = 0; i < 6; i++) { const to = add(g, ball(0.075, "#c0392b", 7), -1.9 + (i % 3) * 0.2, 0.99, 1.5 + Math.floor(i / 3) * 0.22); to.scale.y = 0.9; to.userData.foodReaction = "hop"; }
  for (let i = 0; i < 4; i++) add(g, ball(0.07, IT.lemon, 7), -1.3 + i * 0.16, 0.99, 1.95).scale.set(0.85, 1.15, 0.85);
  // the hanging scale and a string of dried tomatoes: the always-on loop at the ends of the shade beam
  const scale = add(g, new THREE.Group(), 1.95, sh.y - 0.13, sh.zFront - 0.04); scale.userData.foodReaction = "sway";
  add(scale, cyl(0.01, 0.01, 0.22, IT.brass, 4), 0, -0.11, 0);
  add(scale, box(0.4, 0.02, 0.02, IT.brass), 0, -0.22, 0);
  for (const dx of [-0.18, 0.18]) { add(scale, cyl(0.006, 0.006, 0.14, IT.brass, 3), dx, -0.3, 0); add(scale, cyl(0.085, 0.075, 0.03, IT.brass, 10), dx, -0.38, 0); }
  const dried = add(g, new THREE.Group(), -1.95, sh.y - 0.12, sh.zFront - 0.04); dried.userData.foodReaction = "sway";
  add(dried, cyl(0.007, 0.007, 0.16, "#8a7f60", 4), 0, -0.08, 0);
  for (let n = 0; n < 7; n++) add(dried, ball(0.04, "#9c3a2a", 5), Math.cos(n) * 0.05, -0.2 - n * 0.05, Math.sin(n) * 0.05).scale.y = 0.7;
  // the three stall children of the object list, behind the market in its own space
  const stallAt = (x: number, z: number, cloth: string, fill: (s: THREE.Object3D) => void) => {
    const s = add(g, new THREE.Group(), x, 0, z);
    add(s, box(1.6, 0.07, 0.85, IT.wood), 0, 0.84, 0);
    for (const dx of [-0.68, 0.68]) for (const dz of [-0.32, 0.32]) add(s, box(0.07, 0.8, 0.07, "#6e4a2c"), dx, 0.40, dz);
    add(s, box(1.8, 0.06, 1.1, cloth), 0, 1.88, 0);
    for (const dx of [-0.8, 0.8]) for (const dz of [-0.45, 0.45]) add(s, cyl(0.045, 0.05, 1.85, "#6e4a2c", 5), dx, 0.93, dz);
    fill(s);
    return s;
  };
  stallAt(-3.6, -1.25, "#e0b36a", (s) => { for (let i = 0; i < 10; i++) add(s, ball(0.085, i % 3 ? IT.lemon : IT.orange, 7), -0.6 + (i % 5) * 0.3, 0.93 + Math.floor(i / 5) * 0.1, -0.15 + (i % 2) * 0.2); });
  stallAt(3.6, -1.25, "#c0392b", (s) => { for (let i = 0; i < 10; i++) add(s, ball(0.08, "#c0392b", 6), -0.6 + (i % 5) * 0.3, 0.93 + Math.floor(i / 5) * 0.1, -0.15 + (i % 2) * 0.2).scale.y = 0.9; });
  stallAt(0, -2.6, "#d9a55b", (s) => {
    add(s, cyl(0.28, 0.24, 0.16, IT.iron, 14), -0.5, 0.98, 0);
    for (let i = 0; i < 6; i++) add(s, ball(0.075, "#d9932c", 7), 0.1 + (i % 3) * 0.22, 0.93 + Math.floor(i / 3) * 0.14, -0.1 + (i % 2) * 0.18).scale.y = 1.15;
  });
  // the people: the fishmonger, the crier, a woman with a basket, two buyers, a boy, a walker down the lane
  const monger = add(g, own(resident("vendor")), -0.55, 0, 0.65) as Figure; monger.rotation.y = 0;
  arms(monger).right.rotation.x = -1.3; arms(monger).left.rotation.x = -1.05;
  const crier = add(g, own(resident("carter", false)), 1.7, 0, 0.8) as Figure; crier.rotation.y = 0.3;
  const basketWoman = add(g, own(resident("townswoman", false)), 1.1, 0, 0.9) as Figure; basketWoman.rotation.y = 0.2;
  add(basketWoman, cyl(0.24, 0.2, 0.18, "#c9a97a", 10), 0, 1.72, 0);
  const buyerA = add(g, own(resident("townsman", false)), -2.5, 0, 0.9) as Figure; buyerA.rotation.y = 0.8;
  const buyerB = add(g, own(resident("townswoman", false)), 2.6, 0, 0.9) as Figure; buyerB.rotation.y = -0.8;
  const boy = add(g, own(resident("child")), -3.0, 0, 1.6) as Figure; boy.rotation.y = 1.5;
  const walker = resident("worker", false); add(g, walker, -2.6, 0, -0.6);
  const walk = pacer(walker, V(-2.6, 0, -0.6), V(2.7, 0, -0.6), 0.30, 2.6);
  const steakRest = steak.position.clone();
  return life(g, "sicilyMarket", [monger, crier, basketWoman, buyerA, buyerB, boy, walker], (t, k) => {
    scale.rotation.z = Math.sin(t * 1.1) * 0.06; dried.rotation.z = Math.sin(t * 1.3 + 1) * 0.05;
    // 1. food first: the steak is laid on the block, the cleaver comes down and the two halves part
    const chop = beat(k, 0.02, 0.34), part = hold(k, 0.28, 0.92), push = hold(k, 0.45, 0.95);
    steak.position.copy(steakRest);
    steak.position.z = steakRest.z + push * 0.30;
    steak.scale.y = 1 - chop * 0.15;
    cleaver.position.y = 1.62 - chop * 0.30; cleaver.position.z = 1.44 + push * 0.1; cleaver.rotation.z = 0.25 - chop * 0.25;
    halves.forEach((h, i) => { h.position.z = (i ? 1 : -1) * part * 0.1; h.position.y = part * 0.012; h.rotation.y = (i ? 1 : -1) * part * 0.18; });
    // 2. the fishmonger's arm drives the cleaver and he straightens, 3. the woman with the basket steps in
    arms(monger).right.rotation.x = -1.3 - chop * 0.55; upper(monger).rotation.x = 0.1 - part * 0.16;
    basketWoman.position.z = 0.9 + beat(k, 0.5, 1) * 0.3; upper(basketWoman).rotation.x = beat(k, 0.5, 1) * 0.14;
    upper(crier).rotation.y = 0.3 - beat(k, 0.55, 1) * 0.5;
    walk(t);
  });
}

/**
 * The pasticceria: ricotta, almond and ice, and a calendar of feast days to sell them on. Ricotta is piped into
 * a fried shell from the bag and the ends are dipped in pistachio; the pastrycook turns the tray and the girl at
 * the counter leans in. Nothing here is hot: the shells were fried this morning and the room carries no steam.
 */
export function pasticceria(): P {
  const g = group();
  const b = bay(g, "sicilianCoast", 5.0, 3.0, 2.5, { sign: "Pasticceria", arcade: 3 });
  lamps(g, b.y, b.zFront, [-2.0, 2.0], 0.85);
  // the marble counter at the front, the glass case on it, the trays behind
  add(g, box(4.2, 0.10, 1.1, IT.marble), 0, 0.96, 1.5);
  for (const dx of [-1.8, 0, 1.8]) add(g, box(0.16, 0.92, 1.0, "#e2dccf"), dx, 0.46, 1.5);
  for (const dx of [-1.6, 1.6]) { add(g, box(0.05, 0.5, 0.9, "#dfe8ea"), dx, 1.27, 1.45); }
  add(g, box(3.3, 0.04, 0.9, "#dfe8ea"), 0, 1.52, 1.45);
  add(g, box(3.3, 0.5, 0.04, "#dfe8ea"), 0, 1.27, 1.02);
  // the tray of finished cannoli, a plate of cassata, marzipan fruit and a tub of ice under a cloth
  const tray = add(g, box(1.1, 0.04, 0.6, "#bcc2c6"), 0.85, 1.03, 1.5); tray.userData.foodReaction = "sway";
  for (let i = 0; i < 4; i++) { const c = add(g, cyl(0.055, 0.055, 0.28, "#c98a4a", 10), 0.5 + (i % 2) * 0.5, 1.07, 1.36 + Math.floor(i / 2) * 0.26); c.rotation.z = Math.PI / 2; add(g, ball(0.055, "#f7f2e6", 7), 0.5 + (i % 2) * 0.5 + 0.14, 1.07, 1.36 + Math.floor(i / 2) * 0.26); add(g, ball(0.055, "#f7f2e6", 7), 0.5 + (i % 2) * 0.5 - 0.14, 1.07, 1.36 + Math.floor(i / 2) * 0.26); }
  const cassata = add(g, cyl(0.22, 0.2, 0.12, "#e6f0d8", 16), -1.35, 1.07, 1.5); cassata.userData.foodReaction = "hop";
  add(g, cyl(0.22, 0.22, 0.02, "#f2c4d4", 16), -1.35, 1.14, 1.5);
  for (let i = 0; i < 5; i++) add(g, ball(0.035, i % 2 ? "#e0483a" : "#8fbf6a", 5), -1.35 + Math.cos(i * 1.26) * 0.13, 1.16, 1.5 + Math.sin(i * 1.26) * 0.13);
  const pail = add(g, cyl(0.24, 0.2, 0.3, IT.wood, 12), 2.1, 0.15, 0.9);
  add(g, cyl(0.21, 0.21, 0.04, "#eef2ea", 12), 2.1, 0.3, 0.9); void pail;
  // the cannolo being filled: the subject, on the marble at the front
  const cannolo = add(g, new THREE.Group(), -0.45, 1.06, 1.72); cannolo.name = "it-cannolo";
  const shell = add(cannolo, cyl(0.06, 0.06, 0.30, "#c98a4a", 12), 0, 0, 0); shell.rotation.z = Math.PI / 2;
  for (let i = 0; i < 5; i++) add(cannolo, box(0.06, 0.012, 0.11, "#b47a3a"), -0.12 + i * 0.06, 0.055, 0).rotation.y = 0.4;
  const ricotta = add(cannolo, cyl(0.052, 0.052, 0.02, "#f7f2e6", 12), 0, 0, 0); ricotta.rotation.z = Math.PI / 2;
  const caps = [-1, 1].map((s) => { const c = add(cannolo, ball(0.058, "#8fbf6a", 7), s * 0.155, 0, 0); c.scale.setScalar(0); return c; });
  const bag = add(g, new THREE.Group(), -0.45, 1.42, 1.6);
  add(bag, cone(0.13, 0.32, "#e9e2d2", 10), 0, 0, 0).rotation.x = Math.PI;
  add(bag, cyl(0.03, 0.015, 0.09, IT.brass, 8), 0, -0.19, 0);
  const pistachio = add(g, cyl(0.15, 0.13, 0.05, "#dfe8ea", 12), 0.1, 1.02, 1.82);
  for (let i = 0; i < 6; i++) add(pistachio, ball(0.02, "#8fbf6a", 5), Math.cos(i) * 0.08, 0.03, Math.sin(i) * 0.08);
  // a string of paper feast-day flags under the beam: the always-on loop, at the ends
  const flags = Array.from({ length: 2 }, (_, i) => {
    const f = add(g, new THREE.Group(), -1.8 + i * 3.6, b.y - 0.12, b.zFront - 0.05); f.userData.foodReaction = "sway";
    add(f, cyl(0.006, 0.006, 0.16, "#8a7f60", 4), 0, -0.08, 0);
    for (let n = 0; n < 4; n++) add(f, box(0.11, 0.13, 0.008, ["#c0392b", "#f1e6d0", "#3f7a5a", "#e0a52c"][n]), 0, -0.2 - n * 0.14, 0);
    return f;
  });
  // the people: the pastrycook, the girl at the counter, two customers, a boy, a priest, a walker
  const cook = add(g, own(resident("cook")), -0.45, 0.08, 0.5) as Figure; cook.rotation.y = 0;
  arms(cook).right.rotation.x = -1.3; arms(cook).left.rotation.x = -1.15;
  const girl = add(g, own(resident("child")), 0.35, 0, 1.25) as Figure; girl.rotation.y = 2.6;
  const customerA = add(g, own(resident("townswoman", false)), 1.6, 0, 1.2) as Figure; customerA.rotation.y = -2.6;
  const customerB = add(g, own(resident("carter", false)), 2.4, 0, 0.9) as Figure; customerB.rotation.y = -2.5;
  const priest = add(g, own(resident("priest", false)), -2.4, 0, 1.0) as Figure; priest.rotation.y = 2.3;
  const walker = resident("townswoman", false); add(g, walker, -1.9, 0.08, 0.35);
  const walk = pacer(walker, V(-1.9, 0.08, 0.35), V(1.9, 0.08, 0.35), 0.26, 0.7);
  const cannoloRest = cannolo.position.clone();
  return life(g, "pastry", [cook, girl, customerA, customerB, priest, walker], (t, k) => {
    flags.forEach((f, i) => { f.rotation.z = Math.sin(t * 1.4 + i) * 0.06; });
    tray.rotation.y = Math.sin(t * 0.6) * 0.01;
    // 1. food first: the shell lifts, the bag fills it, and the ends are dipped in the pistachio
    const lift = hold(k, 0.16, 0.86), fill = k > 0 ? clamp01(((1 - k) - 0.18) / 0.40) : 0, dipEnds = beat(k, 0.62, 1);
    cannolo.position.copy(cannoloRest);
    cannolo.position.y = cannoloRest.y + lift * 0.28; cannolo.position.z = cannoloRest.z - lift * 0.06;
    cannolo.rotation.z = lift * 0.25 - dipEnds * 0.45; cannolo.rotation.y = dipEnds * 0.5;
    ricotta.scale.set(1, 0.06 + fill * 0.94, 1);
    bag.position.y = 1.42 - fill * 0.06; bag.rotation.z = -fill * 0.3;
    caps.forEach((c, i) => c.scale.setScalar(clamp01(dipEnds * 1.3 - i * 0.15)));
    // 2. the pastrycook's hands follow the bag, 3. the girl at the counter leans in and a customer looks over
    arms(cook).right.rotation.x = -1.3 - fill * 0.3; arms(cook).left.rotation.x = -1.15 - lift * 0.25;
    upper(girl).rotation.x = beat(k, 0.55, 1) * 0.26;
    upper(customerA).rotation.y = beat(k, 0.6, 1) * -0.3;
    walk(t);
  });
}

/**
 * The tonnara on Favignana: one fish, boiled, tinned and covered in oil, and nothing of it thrown away. The
 * stand builds its own low sheds at the blueprint's [1.75, 1.6] from its anchor. A tuna loin is lowered into the
 * boiling copper on the hooked pole and the surface heaves; a woman at the tinning bench looks up.
 */
export function tonnara(): P {
  const g = group();
  // the works hall behind: lime-washed, open to the sea through tall arches, its chimney over the coppers' flue
  const hall = add(g, new THREE.Group(), -1.0, 0, -3.0);
  add(hall, box(5.2, 2.6, 1.6, "#f1e6d0"), 0, 1.3, 0);
  roofOver(hall, "sicilianCoast", 5.2, 1.6, 2.6, 0);
  for (let i = 0; i < 3; i++) { add(hall, box(0.9, 1.6, 0.1, "#3f4a4a"), -1.6 + i * 1.6, 0.8, 0.81); add(hall, new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 5, 14, Math.PI), mat("#e0d8c4")), -1.6 + i * 1.6, 1.6, 0.81); }
  add(hall, cyl(0.24, 0.3, 2.4, "#e0d8c4", 10), -1.9, 3.4, -0.3);
  // the sheds of the blueprint at [1.75, 1.6] from the anchor: the low salting shed, a blocker kept under the sight line
  const sheds = add(g, new THREE.Group(), 1.75, 0, 1.6);
  add(sheds, box(2.2, 1.3, 3.0, "#e8dfcc"), 0, 0.65, 0);
  add(sheds, box(2.5, 0.1, 3.3, "#c9805a"), 0, 1.36, 0).rotation.x = 0.04;
  for (let i = 0; i < 3; i++) add(sheds, box(0.06, 0.7, 0.5, "#3f4a4a"), -1.11, 0.5, -0.9 + i * 0.9);
  for (let i = 0; i < 4; i++) add(sheds, cyl(0.2, 0.2, 0.36, IT.wood, 10), 1.4, 0.18, -1.0 + i * 0.6);
  // the boiling floor and the three coppers on a raised hearth, west of the sheds where the camera reads them
  add(g, box(3.8, 0.12, 1.8, "#b9b0a0"), -1.4, 0.06, 1.2);
  const coppers = [-2.6, -1.4, -0.2].map((x, i) => {
    add(g, box(1.1, 0.62, 1.1, IT.stone), x, 0.31, 1.2);
    add(g, cyl(0.5, 0.42, 0.66, IT.copper, 18), x, 0.95, 1.2);
    add(g, new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 5, 18), mat(IT.copper)), x, 1.28, 1.2).rotation.x = Math.PI / 2;
    const water = add(g, cyl(0.45, 0.45, 0.06, "#cfd0c0", 18), x, 1.26, 1.2); water.name = `it-copper-${i}`;
    for (let n = 0; n < 4; n++) add(g, cone(0.06, 0.18, n % 2 ? IT.flameHot : IT.flame, 6), x - 0.3 + n * 0.2, 0.26, 1.77);
    return water;
  });
  // the hooked pole and the loin on it: the subject, lowered into the middle copper
  const pole = add(g, new THREE.Group(), -1.4, 2.38, 1.2);
  add(pole, cyl(0.022, 0.026, 1.7, IT.wood, 6), 0, 0.6, -0.5).rotation.x = -0.5;
  add(pole, new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 4, 10, Math.PI * 1.4), mat(IT.iron)), 0, -0.04, 0).rotation.y = Math.PI / 2;
  const loin = add(g, new THREE.Group(), -1.4, 2.1, 1.2); loin.name = "it-tuna-loin";
  add(loin, cyl(0.16, 0.14, 0.62, IT.tuna, 12), 0, 0, 0).rotation.z = Math.PI / 2;
  add(loin, cyl(0.11, 0.11, 0.64, "#a8544a", 12), 0, 0.04, 0).rotation.z = Math.PI / 2;
  add(loin, cyl(0.012, 0.012, 0.3, IT.iron, 4), 0, 0.16, 0);
  // the tinning bench, the tins, the oil jug and the salted bottarga: the rest of the modelled food
  add(g, box(2.6, 0.09, 0.9, IT.wood), -2.4, 0.86, -1.4);
  for (const dx of [-1.1, 1.1]) for (const dz of [-0.35, 0.35]) add(g, box(0.09, 0.82, 0.09, "#6e4a2c"), -2.4 + dx, 0.42, -1.4 + dz);
  for (let i = 0; i < 8; i++) { const tin = add(g, cyl(0.10, 0.10, 0.07, "#c8ccd0", 12), -3.4 + (i % 4) * 0.28, 0.94, -1.55 + Math.floor(i / 4) * 0.3); tin.userData.foodReaction = "hop"; }
  for (let i = 0; i < 3; i++) add(g, cyl(0.10, 0.10, 0.07, "#8e3b3a", 12), -3.4 + i * 0.28, 0.99, -1.55);
  const jug = add(g, cyl(0.10, 0.13, 0.3, "#9c6a4a", 10), -1.5, 1.05, -1.4); jug.userData.foodReaction = "sway";
  for (let i = 0; i < 3; i++) add(g, box(0.10, 0.06, 0.34, "#8a6a3a"), -1.5 - i * 0.16, 0.94, -1.05);   // the pressed bottarga
  // the hooks on a rail under the eaves: the always-on sway, over the bench and never over the coppers
  const hooks = Array.from({ length: 4 }, (_, i) => {
    const h = add(g, new THREE.Group(), -3.2 + i * 0.5, 2.1, -2.1); h.userData.foodReaction = "sway";
    add(h, cyl(0.007, 0.007, 0.18, IT.iron, 4), 0, -0.09, 0);
    add(h, new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 4, 10, Math.PI * 1.3), mat(IT.iron)), 0, -0.22, 0).rotation.y = Math.PI / 2;
    return h;
  });
  add(g, cyl(0.03, 0.03, 2.4, IT.iron, 5), -2.45, 2.1, -2.1).rotation.z = Math.PI / 2;
  for (const dx of [-3.5, -1.4]) add(g, cyl(0.05, 0.05, 2.1, IT.iron, 6), dx, 1.05, -2.1);
  const beam = add(g, box(2.6, 0.14, 0.18, "#6e4a2c"), -2.45, 2.32, -2.1); beam.name = "front-beam";
  lamps(g, 2.32, -2.1, [-3.3, -1.6], 0.8);
  // the people: the boiler man, the woman at the bench who looks up, two more packing, a pole man, a boy, a walker
  const boiler = add(g, own(resident("worker")), -1.4, 0.12, 0.25) as Figure; boiler.rotation.y = 0;
  arms(boiler).right.rotation.x = -1.4; arms(boiler).left.rotation.x = -1.3;
  const tinner = add(g, own(resident("townswoman")), -2.9, 0, -2.2) as Figure; tinner.rotation.y = 0;
  const packerA = add(g, own(resident("townswoman")), -2.1, 0, -2.2) as Figure; packerA.rotation.y = 0.1;
  const packerB = add(g, own(resident("townswoman")), -1.5, 0, -2.2) as Figure; packerB.rotation.y = 0.2;
  const poleMan = add(g, own(resident("fisher", false)), -0.1, 0, -0.4) as Figure; poleMan.rotation.y = -0.6;
  const boy = add(g, own(resident("child")), 3.3, 0, -0.8) as Figure; boy.rotation.y = -1.4;
  const walker = resident("worker", false); add(g, walker, -3.4, 0, -0.5);
  const walk = pacer(walker, V(-3.4, 0, -0.5), V(0.4, 0, -0.5), 0.30, 1.5);
  g.userData.steam = V(-1.4, 1.75, 1.2); g.userData.smoke = V(-2.9, 4.6, -3.3);
  const loinRest = loin.position.clone();
  return life(g, "tonnaraIt", [boiler, tinner, packerA, packerB, poleMan, boy, walker], (t, k) => {
    coppers.forEach((c, i) => { c.scale.y = 1 + Math.sin(t * 2.6 + i * 1.3) * 0.16; c.position.y = 1.26 + Math.sin(t * 2.6 + i * 1.3) * 0.006; });
    hooks.forEach((h, i) => { h.rotation.z = Math.sin(t * 1.2 + i) * 0.05; });
    // 1. food first: the loin swings out over the copper and goes down into it, and the surface heaves
    const swingOut = hold(k, 0.18, 0.44), down = hold(k, 0.36, 0.86);
    loin.position.copy(loinRest);
    loin.position.y = loinRest.y - down * 0.72; loin.position.z = loinRest.z + swingOut * 0.02;
    loin.rotation.z = swingOut * 0.2 - down * 0.15;
    pole.rotation.z = swingOut * 0.12; pole.position.y = 2.38 - down * 0.5;
    coppers[1].scale.y = 1 + Math.sin(t * 2.6 + 1.3) * 0.16 + beat(k, 0.42, 0.95) * 1.5;
    coppers[1].position.y = 1.26 + beat(k, 0.42, 0.95) * 0.03;
    // 2. the boiler man's arms lower the pole and he steps back, 3. the woman at the bench looks up
    arms(boiler).right.rotation.x = -1.4 + down * 0.45; arms(boiler).left.rotation.x = -1.3 + down * 0.35;
    upper(boiler).rotation.x = -down * 0.14;
    upper(tinner).rotation.x = -beat(k, 0.5, 1) * 0.22; upper(tinner).rotation.y = beat(k, 0.5, 1) * 0.35;
    upper(poleMan).rotation.y = beat(k, 0.55, 1) * -0.3;
    walk(t);
  });
}

// ---------- the fifteen ingredient and flavour stops ----------

/** A dry-stone wall in a line: the Agro's fields and Sicily's terraces are both held up by one of these. */
function dryStone(g: THREE.Object3D, x: number, z: number, len: number, rot = 0, h = 2) {
  const w = add(g, new THREE.Group(), x, 0, z); w.rotation.y = rot;
  for (let r = 0; r < h; r++) for (let i = 0; i < Math.floor(len / 0.42); i++) {
    const s = add(w, box(0.4, 0.22, 0.34, r % 2 ? IT.stone : "#c6bda8"), -len / 2 + 0.21 + i * 0.42 + (r % 2) * 0.1, 0.11 + r * 0.22, 0);
    s.rotation.y = (rnd() - 0.5) * 0.2;
  }
  return w;
}
/** A shallow basket, the one container every stop on this table uses. */
function basket(g: THREE.Object3D, x: number, y: number, z: number, r = 0.26) {
  const b = add(g, cyl(r, r * 0.78, r * 0.95, "#c9a97a", 12), x, y + r * 0.47, z);
  for (let i = 0; i < 3; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(r * 0.97, r * 0.055, 4, 12), mat("#b08d62")), x, y + r * 0.2 + i * r * 0.3, z).rotation.x = Math.PI / 2;
  return b;
}

/**
 * The artichoke beds of the Agro Romano: the flat spineless cimarolo, on beds between the road and the river.
 * A head is cut off its stalk, lifts clear and drops into the basket at the cutter's feet.
 */
export function carciofaia(): P {
  const g = group();
  for (let r = 0; r < 3; r++) add(g, box(5.0, 0.14, 0.9, "#7d6a48"), 0, 0.07, -1.9 + r * 1.3);
  const plants: THREE.Group[] = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) {
    const p = add(g, new THREE.Group(), -2.1 + i * 1.05, 0.14, -1.9 + r * 1.3);
    for (let n = 0; n < 6; n++) { const l = add(p, ball(0.19, n % 2 ? "#8fa06a" : "#7d9058", 6), Math.cos(n * 1.05) * 0.2, 0.16, Math.sin(n * 1.05) * 0.2); l.scale.set(0.55, 0.3, 1.5); l.rotation.y = -n * 1.05; l.rotation.x = -0.35; }
    if ((r + i) % 3 === 0) { add(p, cyl(0.03, 0.035, 0.34, IT.greens, 6), 0, 0.17, 0); const head = add(p, ball(0.11, "#a8b878", 8), 0, 0.4, 0); head.scale.set(1, 1.15, 1); }
    plants.push(p);
  }
  // the cut head: the subject, at the front of the nearest bed
  const stalk = add(g, cyl(0.03, 0.04, 0.42, IT.greens, 6), -0.6, 0.35, 2.15);
  const head = add(g, new THREE.Group(), -0.6, 0.62, 2.15); head.name = "it-carciofo-cut";
  add(head, ball(0.13, "#a8b878", 9), 0, 0, 0).scale.set(1, 1.2, 1);
  for (let n = 0; n < 6; n++) { const l = add(head, ball(0.055, "#8fa06a", 5), Math.cos(n * 1.05) * 0.1, -0.03, Math.sin(n * 1.05) * 0.1); l.scale.set(0.8, 1.3, 0.5); l.rotation.y = -n * 1.05; }
  const bskt = basket(g, -1.75, 0, 2.3, 0.3); void bskt;
  for (let i = 0; i < 5; i++) add(g, ball(0.1, "#a8b878", 6), -1.75 + (rnd() - 0.5) * 0.3, 0.26, 2.3 + (rnd() - 0.5) * 0.3).scale.y = 1.15;
  const knife = add(g, box(0.16, 0.012, 0.045, "#bcc2c6"), -0.6, 0.5, 2.38);
  add(knife, box(0.08, 0.03, 0.04, "#5a4636"), -0.12, 0, 0);
  dryStone(g, 0, -2.7, 5.0, 0, 2);
  const cutter = add(g, own(resident("farmer")), -0.6, 0, 1.6) as Figure; cutter.rotation.y = 0;
  arms(cutter).right.rotation.x = -1.25; arms(cutter).left.rotation.x = -1.0;
  const carrier = add(g, own(resident("townswoman", false)), 1.5, 0, 1.4) as Figure; carrier.rotation.y = -1.2;
  add(carrier, cyl(0.25, 0.2, 0.18, "#c9a97a", 10), 0, 1.72, 0);
  const boy = add(g, own(resident("child")), 2.2, 0, 0.9) as Figure; boy.rotation.y = -1.9;
  const headRest = head.position.clone();
  return life(g, "carciofoIt", [cutter, carrier, boy], (t, k) => {
    plants.forEach((p, i) => { p.rotation.z = Math.sin(t * 1.1 + i * 0.4) * 0.02; });
    const cut = beat(k, 0, 0.35), drop = k > 0 ? clamp01(((1 - k) - 0.24) / 0.5) : 0;
    knife.position.y = 0.5 + cut * 0.06; knife.rotation.z = cut * 0.5;
    stalk.scale.y = 1 - drop * 0.35;
    head.position.copy(headRest);
    head.position.y = headRest.y + Math.sin(drop * Math.PI) * 0.34 - drop * 0.34;
    head.position.x = headRest.x - drop * 0.55; head.position.z = headRest.z + drop * 0.35;
    head.rotation.z = drop * 2.4;
    arms(cutter).right.rotation.x = -1.25 - cut * 0.4; upper(cutter).rotation.x = 0.16 - drop * 0.14;
    upper(carrier).rotation.y = beat(k, 0.5, 1) * 0.35;
  });
}

/**
 * The flock: the sheep the Campagna was grazed for, in a walled fold with the shepherd's hut behind. The ewe at
 * the gate lifts her head and steps forward; the rest of the flock shifts behind her. The sheep stay in the pen.
 */
export function sheepFold(): P {
  const g = group();
  // the fold: four dry-stone walls with a hurdle gate on the side the visitor arrives at
  dryStone(g, 0, -1.9, 4.6, 0, 3); dryStone(g, -2.3, 0.4, 4.6, Math.PI / 2, 3); dryStone(g, 2.3, 0.4, 4.6, Math.PI / 2, 3);
  dryStone(g, -1.6, 2.7, 1.3, 0, 3); dryStone(g, 1.6, 2.7, 1.3, 0, 3);
  const gate = add(g, new THREE.Group(), -1.6, 0, 3.05); gate.rotation.y = 0.15;           // the hurdle gate, open against the wall
  for (let i = 0; i < 4; i++) add(gate, cyl(0.04, 0.05, 0.9, "#7a6a55", 5), -0.6 + i * 0.4, 0.45, 0);
  for (const y of [0.3, 0.7]) add(gate, cyl(0.03, 0.03, 1.5, "#7a6a55", 4), 0, y, 0).rotation.z = Math.PI / 2;
  // the shepherd's hut at the back and the milking stool
  add(g, box(1.4, 1.2, 1.1, "#c9bda5"), -1.3, 0.6, -1.1);
  add(g, cone(1.15, 0.9, "#a89466", 4), -1.3, 1.65, -1.1).rotation.y = Math.PI / 4;
  add(g, cyl(0.15, 0.17, 0.4, IT.wood, 8), -0.3, 0.2, -0.9);
  for (let i = 0; i < 3; i++) add(g, cyl(0.2, 0.17, 0.28, IT.wood, 10), 0.8 + i * 0.5, 0.14, -1.3);
  // the flock, penned: ten sheep and two lambs, all inside the walls
  const sheep = Array.from({ length: 6 }, (_, i) => {
    const s = add(g, new THREE.Group(), -1.2 + (i % 3) * 1.2, 0, 0.1 + Math.floor(i / 3) * 1.2);
    s.rotation.y = rnd() * 2 - 1;
    add(s, ball(0.32, "#efe6d2", 9), 0, 0.62, 0).scale.set(1.55, 0.95, 0.92);
    for (let n = 0; n < 4; n++) add(s, ball(0.16, "#f3ece0", 6), -0.3 + n * 0.2, 0.78, 0).scale.set(1, 0.8, 1.1);
    const hd = add(s, ball(0.15, "#d9cdb4", 8), 0.44, 0.7, 0); hd.scale.set(1.3, 0.92, 0.85);
    for (const side of [-1, 1]) add(s, cone(0.05, 0.14, "#c9bda5", 5), 0.44, 0.8, side * 0.11).rotation.z = -0.4 - side * 0.1;
    for (const [dx, dz] of [[-0.24, -0.16], [-0.24, 0.16], [0.24, -0.16], [0.24, 0.16]]) add(s, cyl(0.05, 0.04, 0.44, "#5a4b3a", 5), dx, 0.24, dz);
    s.userData.head = hd;
    return s;
  });
  for (let i = 0; i < 2; i++) { const l = add(g, new THREE.Group(), 1.4 + i * 0.4, 0, 2.2); l.scale.setScalar(0.6); add(l, ball(0.3, "#f6f0e2", 8), 0, 0.6, 0).scale.set(1.5, 0.95, 0.9); add(l, ball(0.14, "#e2d8c4", 7), 0.4, 0.68, 0); for (const [dx, dz] of [[-0.2, -0.14], [-0.2, 0.14], [0.2, -0.14], [0.2, 0.14]]) add(l, cyl(0.045, 0.035, 0.42, "#6a5a48", 5), dx, 0.23, dz); }
  // the ewe at the gate: the subject
  const ewe = add(g, new THREE.Group(), 0.2, 0, 2.3); ewe.name = "it-ewe";
  add(ewe, ball(0.34, "#f3ece0", 9), 0, 0.64, 0).scale.set(1.6, 0.98, 0.94);
  for (let n = 0; n < 5; n++) add(ewe, ball(0.17, "#efe6d2", 6), -0.34 + n * 0.17, 0.8, 0).scale.set(1, 0.8, 1.1);
  const eweHead = add(ewe, new THREE.Group(), 0.48, 0.72, 0);
  add(eweHead, ball(0.16, "#d9cdb4", 8), 0, 0, 0).scale.set(1.35, 0.95, 0.88);
  add(eweHead, ball(0.05, "#3a332c", 5), 0.2, -0.02, 0);
  for (const side of [-1, 1]) add(eweHead, cone(0.05, 0.15, "#c9bda5", 5), 0, 0.1, side * 0.11).rotation.z = -0.4 - side * 0.1;
  for (const [dx, dz] of [[-0.26, -0.17], [-0.26, 0.17], [0.26, -0.17], [0.26, 0.17]]) add(ewe, cyl(0.055, 0.04, 0.46, "#5a4b3a", 5), dx, 0.25, dz);
  // the dog, and the people
  const dog = add(g, new THREE.Group(), 1.9, 0, 3.3);
  add(dog, ball(0.2, "#e4dccb", 8), 0, 0.42, 0).scale.set(1.6, 0.9, 0.85);
  add(dog, ball(0.12, "#d9cdb4", 7), 0.3, 0.5, 0);
  for (const [dx, dz] of [[-0.14, -0.1], [-0.14, 0.1], [0.14, -0.1], [0.14, 0.1]]) add(dog, cyl(0.035, 0.03, 0.34, "#c9bda5", 5), dx, 0.17, dz);
  const tail = add(dog, cyl(0.03, 0.02, 0.28, "#e4dccb", 4), -0.3, 0.5, 0); tail.rotation.z = 0.9;
  const shepherd = add(g, own(resident("shepherd")), -0.9, 0, 2.3) as Figure; shepherd.rotation.y = 1.2;
  const crook = add(arms(shepherd).right, cyl(0.018, 0.022, 1.5, IT.wood, 5), 0.02, arms(shepherd).hand + 0.36, 0.05);
  add(crook, new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.016, 4, 10, Math.PI * 1.4), mat(IT.wood)), 0, 0.75, 0).rotation.y = Math.PI / 2;
  const boy = add(g, own(resident("child")), 1.1, 0, 3.0) as Figure; boy.rotation.y = -2.5;
  const milker = add(g, own(resident("dairywoman", false)), -0.2, 0, -0.4) as Figure; milker.rotation.y = 0.8;
  return life(g, "pecoraIt", [shepherd, boy, milker], (t, k) => {
    sheep.forEach((s, i) => { const hd = s.userData.head as THREE.Object3D; hd.rotation.z = Math.sin(t * 0.7 + i) * 0.08; s.rotation.y += Math.sin(t * 0.2 + i) * 0.0008; });
    tail.rotation.y = Math.sin(t * 4) * 0.5;
    // the ewe lifts her head, steps forward and settles back; the flock shifts behind her
    const lift = beat(k, 0.05, 0.7), step = beat(k, 0.2, 0.95);
    eweHead.rotation.z = lift * 0.55; eweHead.position.y = 0.72 + lift * 0.14;
    ewe.position.z = 2.3 + step * 0.28; ewe.rotation.y = -step * 0.22;
    sheep.forEach((s, i) => { (s.userData.head as THREE.Object3D).rotation.z += beat(k, 0.3 + i * 0.02, 1) * 0.3; });
    arms(shepherd).right.rotation.x = -0.1 - beat(k, 0.4, 1) * 0.3;
    upper(boy).rotation.y = beat(k, 0.5, 1) * 0.4;
  });
}

/**
 * The olive mill in the Sabina hills: the stone wheel, the press and the oil used raw. The wheel turns in its
 * trough all day; on the click the boy's basket of olives is tipped into the trough, the olives run under the
 * wheel and the wheel quickens, and the miller leans on the beam.
 */
export function oliveGrove(): P {
  const g = group();
  const trees = Array.from({ length: 3 }, (_, i) => add(g, oliveTree(0.9 + rnd() * 0.15), -2.0 + i * 2.0, 0, -1.9 + (i % 2) * 0.4));
  dryStone(g, 0, -2.9, 5.0, 0, 2);
  // the mill: a round stone trough, an upright post, a beam and the edge-runner wheel
  add(g, cyl(1.25, 1.3, 0.5, IT.stone, 20), 0, 0.25, 1.2);
  add(g, cyl(1.05, 1.05, 0.12, "#6b5a3a", 20), 0, 0.5, 1.2);
  add(g, cyl(0.16, 0.2, 1.2, "#6e4a2c", 8), 0, 0.6, 1.2);
  const arm = add(g, new THREE.Group(), 0, 0.82, 1.2);
  add(arm, cyl(0.06, 0.06, 2.4, "#6e4a2c", 6), 0, 0, 0).rotation.z = Math.PI / 2;
  const wheel = add(arm, cyl(0.52, 0.52, 0.2, "#9a8f7a", 18), 0.9, -0.12, 0); wheel.rotation.z = Math.PI / 2;
  const olives = Array.from({ length: 14 }, (_, i) => add(g, ball(0.055, i % 3 ? "#2f3a2a" : "#6f9b57", 5), Math.cos(i * 0.9) * 0.85, 0.58, 1.2 + Math.sin(i * 0.9) * 0.85));
  // the press and the jars, behind the mill
  add(g, cyl(0.45, 0.48, 0.4, IT.wood, 14), 1.9, 0.2, -0.5);
  for (let i = 0; i < 4; i++) add(g, cyl(0.38, 0.38, 0.06, "#9a8464", 14), 1.9, 0.42 + i * 0.08, -0.5);
  add(g, cyl(0.07, 0.07, 1.4, "#6e4a2c", 8), 1.9, 1.0, -0.5);
  add(g, box(1.0, 0.1, 0.22, "#6e4a2c"), 1.9, 1.6, -0.5);
  for (let i = 0; i < 3; i++) { const j = add(g, ball(0.28, "#9c6a4a", 10), -2.1 + i * 0.6, 0.3, -0.4); j.scale.y = 1.2; add(g, cyl(0.1, 0.14, 0.18, "#9c6a4a", 8), -2.1 + i * 0.6, 0.64, -0.4); }
  // the basket of olives on the trough's rim at the front: the subject, tipped into the trough
  const tip = add(g, new THREE.Group(), 0.35, 0.62, 2.55); tip.name = "it-olive-basket";
  add(tip, cyl(0.28, 0.22, 0.26, "#c9a97a", 12), 0, 0.13, 0);
  for (let i = 0; i < 3; i++) add(tip, new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.014, 4, 12), mat("#b08d62")), 0, 0.04 + i * 0.08, 0).rotation.x = Math.PI / 2;
  const load = Array.from({ length: 9 }, (_, i) => add(tip, ball(0.055, i % 2 ? "#2f3a2a" : "#6f9b57", 5), Math.cos(i * 0.7) * 0.13, 0.27 + (i % 3) * 0.03, Math.sin(i * 0.7) * 0.13));
  const miller = add(g, own(resident("farmer")), -1.5, 0, 0.6) as Figure; miller.rotation.y = 1.3;
  const boy = add(g, own(resident("child")), 0.9, 0, 2.0) as Figure; boy.rotation.y = -0.6;
  const presser = add(g, own(resident("worker", false)), 1.6, 0, 0.35) as Figure; presser.rotation.y = -1.6;
  const tipRest = tip.position.clone(), loadRest = load.map((o) => o.position.clone());
  return life(g, "olive", [miller, boy, presser], (t, k) => {
    trees.forEach((tr, i) => { const c = (tr.userData as { crown?: THREE.Group }).crown; if (c) c.rotation.z = Math.sin(t * 1.1 + i) * 0.015; });
    // the wheel turns all day, and faster while the olives run under it
    const speed = 0.35 + beat(k, 0.2, 0.95) * 1.5;
    arm.rotation.y = t * 0.35 + (k > 0 ? 0 : 0);
    wheel.rotation.x = -t * 0.9 * speed;
    olives.forEach((o, i) => { const a = i * 0.9 - t * 0.12; o.position.set(Math.cos(a) * 0.85, 0.58 + beat(k, 0.2, 0.9) * Math.abs(Math.sin(i + t * 6)) * 0.05, 1.2 + Math.sin(a) * 0.85); });
    // the basket lifts, tips over the rim and the olives pour out into the trough
    const lift = hold(k, 0.18, 0.84), pour = k > 0 ? clamp01(((1 - k) - 0.22) / 0.5) : 0;
    tip.position.copy(tipRest);
    tip.position.y = tipRest.y + lift * 0.34; tip.position.z = tipRest.z - lift * 0.42;
    tip.rotation.x = -lift * 1.2;
    load.forEach((o, i) => {
      const p2 = clamp01(pour * 1.5 - i * 0.06);
      o.position.copy(loadRest[i]);
      o.position.z = loadRest[i].z - p2 * (0.35 + i * 0.03); o.position.y = loadRest[i].y + Math.sin(p2 * Math.PI) * 0.2 - p2 * 0.28;
    });
    arms(boy).right.rotation.x = -0.4 - lift * 0.9; arms(boy).left.rotation.x = -0.4 - lift * 0.9;
    arms(miller).right.rotation.x = -0.2 - beat(k, 0.3, 0.95) * 0.4;
    upper(presser).rotation.y = beat(k, 0.45, 1) * 0.4;
  });
}

/**
 * The wine cart of the Castelli carrettieri: two tall wheels, a curved hood, a mule in the shafts, and ten
 * barrels of fifty litres going down to Rome by night. A barrel is rolled down the plank off the tail.
 */
export function wineCart(): P {
  const g = group();
  const cart = add(g, new THREE.Group(), -0.3, 0, 0);
  add(cart, box(2.5, 0.42, 1.25, "#7a5230"), 0, 0.92, 0);
  add(cart, box(2.54, 0.06, 1.3, "#6e4a2c"), 0, 1.15, 0);
  for (let i = 0; i < 6; i++) add(cart, box(0.06, 0.4, 1.28, "#6e4a2c"), -1.1 + i * 0.44, 0.92, 0);
  // the hood: the curved awning the carter slept under
  const hood = add(cart, new THREE.Group(), -0.3, 1.2, 0);
  for (let i = 0; i < 5; i++) add(hood, new THREE.Mesh(new THREE.TorusGeometry(0.62 - i * 0.015, 0.025, 5, 12, Math.PI), mat("#5a4636")), 0, 0, -0.5 + i * 0.25).rotation.y = Math.PI / 2;
  add(hood, new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 1.15, 14, 1, true, 0, Math.PI), mat("#4a4035", { side: THREE.DoubleSide })), 0, 0, 0).rotation.set(Math.PI / 2, 0, -Math.PI / 2);
  // wheels and shafts
  for (const side of [-1, 1]) {
    const w = add(cart, new THREE.Group(), -0.1, 0.72, side * 0.78);
    add(w, new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 6, 18), mat("#6e4a2c")), 0, 0, 0).rotation.y = Math.PI / 2;
    for (let i = 0; i < 12; i++) add(w, cyl(0.016, 0.016, 1.34, "#8a6844", 4), 0, 0, 0).rotation.z = (i * Math.PI) / 12;
    add(w, cyl(0.1, 0.1, 0.14, IT.iron, 8), 0, 0, 0).rotation.x = Math.PI / 2;
  }
  for (const side of [-1, 1]) { const s = add(cart, cyl(0.04, 0.05, 2.4, IT.wood, 6), 1.85, 1.0, side * 0.5); s.rotation.z = 1.52; }
  mule(cart, 3.35, 0, 0);
  // the barrels on the bed, and the one being rolled down the plank: the subject
  const stacked = Array.from({ length: 6 }, (_, i) => { const b = add(cart, cyl(0.26, 0.26, 0.5, "#8a5a34", 12), -0.9 + (i % 3) * 0.55, 1.42, -0.32 + Math.floor(i / 3) * 0.62); b.rotation.z = Math.PI / 2; for (const dx of [-0.16, 0.16]) add(cart, new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.02, 4, 12), mat(IT.iron)), -0.9 + (i % 3) * 0.55 + dx, 1.42, -0.32 + Math.floor(i / 3) * 0.62).rotation.y = Math.PI / 2; return b; });
  const plank = add(g, box(0.5, 0.05, 1.9, "#8a6844"), -1.9, 0.68, 0.75); plank.rotation.x = -0.5;
  const barrel = add(g, new THREE.Group(), -1.75, 1.35, 0.1); barrel.name = "it-wine-barrel";
  add(barrel, cyl(0.27, 0.27, 0.52, "#8a5a34", 14), 0, 0, 0).rotation.z = Math.PI / 2;
  for (const dx of [-0.17, 0.17]) add(barrel, new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.022, 4, 14), mat(IT.iron)), dx, 0, 0).rotation.y = Math.PI / 2;
  add(barrel, cyl(0.03, 0.03, 0.08, IT.wood, 6), 0, 0.26, 0);
  // the roadside: a milestone, a wine measure on a stool and a lantern hung on the hood rail
  add(g, box(0.3, 0.7, 0.3, IT.travertine), 2.4, 0.35, -1.4);
  add(g, cyl(0.2, 0.22, 0.4, IT.wood, 10), -2.6, 0.2, -0.9);
  const foglietta = add(g, cyl(0.08, 0.1, 0.28, "#cfd8cf", 12), -2.6, 0.54, -0.9); foglietta.userData.foodReaction = "sway";
  add(g, cyl(0.06, 0.06, 0.09, IT.wineWhite, 10), -2.6, 0.5, -0.9);
  const rail = add(g, box(1.3, 0.1, 0.12, "#5a4636"), -0.3, 1.9, 0.62); void rail;
  const railBeam = add(g, box(1.3, 0.12, 0.14, "#5a4636"), -0.3, 1.92, 0.62); railBeam.name = "front-beam";
  lamps(g, 1.92, 0.62, [-0.3], 0.8);
  const carter = add(g, own(resident("carter")), -2.5, 0, 0.55) as Figure; carter.rotation.y = 1.6;
  arms(carter).right.rotation.x = -1.0; arms(carter).left.rotation.x = -0.9;
  const helper = add(g, own(resident("worker", false)), -2.4, 0, -0.3) as Figure; helper.rotation.y = 1.2;
  const boy = add(g, own(resident("child")), 1.8, 0, 0.9) as Figure; boy.rotation.y = -2.0;
  const barrelRest = barrel.position.clone();
  return life(g, "vinoIt", [carter, helper, boy], (t, k) => {
    foglietta.rotation.z = Math.sin(t * 1.1) * 0.02;
    stacked.forEach((b, i) => { b.rotation.x = Math.sin(t * 0.5 + i) * 0.006; });
    // the barrel rolls down the plank and settles on the ground at the carter's feet
    const roll = k > 0 ? clamp01(((1 - k) - 0.10) / 0.62) : 0;
    barrel.position.copy(barrelRest);
    barrel.position.y = barrelRest.y - roll * 1.07; barrel.position.z = barrelRest.z + roll * 1.55;
    barrel.rotation.x = -roll * 5.4;
    arms(carter).right.rotation.x = -1.0 - beat(k, 0.15, 0.85) * 0.35; upper(carter).rotation.x = beat(k, 0.15, 0.9) * 0.2;
    arms(helper).left.rotation.x = -beat(k, 0.3, 1) * 0.8;
    upper(boy).rotation.y = beat(k, 0.5, 1) * 0.4;
  });
}

/**
 * The pig and the ox: a walled yard with the ox in it and pigs under a lean-to, the two animals a Roman kitchen
 * of this band actually cooks. The ox lifts his head off the trough and shifts his weight; the pigs shove in.
 */
function oxYard(): P {
  const g = group();
  dryStone(g, 0, -2.4, 5.4, 0, 3); dryStone(g, -2.7, -0.2, 4.2, Math.PI / 2, 3); dryStone(g, 2.7, -0.2, 4.2, Math.PI / 2, 3);
  for (let i = 0; i < 5; i++) add(g, cyl(0.05, 0.06, 0.8, "#7a6a55", 5), -2.2 + i * 1.1, 0.4, 1.9);
  for (const y of [0.3, 0.65]) add(g, cyl(0.035, 0.035, 4.6, "#7a6a55", 4), 0, y, 1.9).rotation.z = Math.PI / 2;
  // the lean-to over the pigs, at the back corner
  for (const x of [0.6, 2.4]) for (const z of [-2.1, -0.9]) add(g, cyl(0.08, 0.09, 1.5, "#6e4a2c", 6), x, 0.75, z);
  const leanRoof = add(g, box(2.2, 0.08, 1.6, "#a89466"), 1.5, 1.56, -1.5); leanRoof.rotation.x = 0.16;
  for (let i = 0; i < 6; i++) add(g, box(0.05, 0.05, 1.6, "#8a7448"), 0.6 + i * 0.36, 1.62, -1.5).rotation.x = 0.16;
  // the ox: the subject, at the trough at the front of the yard
  const trough = add(g, box(2.0, 0.3, 0.5, IT.stone), -0.8, 0.15, 1.3);
  add(g, box(1.8, 0.1, 0.36, "#8a7f60"), -0.8, 0.3, 1.3);
  const ox = add(g, new THREE.Group(), -0.8, 0, 0.35); ox.name = "it-ox";
  add(ox, ball(0.56, "#9a8464", 10), 0, 0.98, 0).scale.set(1.75, 1.0, 0.98);
  add(ox, ball(0.34, "#8a7458", 8), -0.72, 1.28, 0).scale.set(0.9, 0.8, 0.8);            // the hump over the shoulder
  const oxHead = add(ox, new THREE.Group(), 0.94, 1.0, 0);
  add(oxHead, ball(0.27, "#9a8464", 9), 0, 0, 0).scale.set(1.25, 0.95, 0.85);
  add(oxHead, box(0.2, 0.16, 0.22, "#e2d8c4"), 0.26, -0.08, 0);
  for (const side of [-1, 1]) add(oxHead, cone(0.06, 0.4, "#efe6d2", 6), 0.02, 0.22, side * 0.16).rotation.z = -0.5 - side * 0.35;
  for (const side of [-1, 1]) add(oxHead, ball(0.05, "#3a332c", 5), 0.16, 0.05, side * 0.18);
  for (const [dx, dz] of [[-0.56, -0.3], [-0.56, 0.3], [0.56, -0.3], [0.56, 0.3]]) add(ox, cyl(0.1, 0.08, 0.86, "#8a7458", 6), dx, 0.48, dz);
  const oxTail = add(ox, cyl(0.045, 0.02, 0.76, "#8a7458", 5), -0.96, 0.92, 0); oxTail.rotation.z = 0.55;
  // the pigs under the lean-to and the swill tub
  const pigs = Array.from({ length: 3 }, (_, i) => {
    const p = add(g, new THREE.Group(), 0.9 + i * 0.7, 0, -1.5 + (i % 2) * 0.4); p.rotation.y = -0.4 + i * 0.3;
    add(p, ball(0.3, "#e9c4b4", 9), 0, 0.42, 0).scale.set(1.7, 0.95, 0.95);
    const hd = add(p, ball(0.16, "#e9c4b4", 7), 0.44, 0.44, 0); add(hd, cyl(0.07, 0.08, 0.1, "#dcae9e", 8), 0.14, -0.02, 0).rotation.z = Math.PI / 2;
    for (const side of [-1, 1]) add(hd, cone(0.06, 0.12, "#dcae9e", 4), 0, 0.14, side * 0.09);
    for (const [dx, dz] of [[-0.24, -0.14], [-0.24, 0.14], [0.24, -0.14], [0.24, 0.14]]) add(p, cyl(0.055, 0.045, 0.34, "#e2b9a8", 5), dx, 0.17, dz);
    p.userData.head = hd;
    return p;
  });
  add(g, cyl(0.3, 0.26, 0.3, IT.wood, 12), 0.2, 0.15, -1.9);
  // the hooks and the scalding tub of the yard's own work, and the people
  for (let i = 0; i < 3; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 4, 10, Math.PI * 1.3), mat(IT.iron)), -2.0 + i * 0.4, 0.9, -2.2).rotation.y = Math.PI / 2;
  add(g, cyl(0.05, 0.05, 1.4, IT.iron, 5), -1.6, 0.95, -2.2).rotation.z = Math.PI / 2;
  add(g, cyl(0.4, 0.36, 0.5, IT.wood, 14), -2.0, 0.25, -1.3);
  const vaccinaro = add(g, own(resident("vaccinaro")), -2.1, 0, 0.6) as Figure; vaccinaro.rotation.y = 1.4;
  const woman = add(g, own(resident("townswoman", false)), 1.6, 0, 0.8) as Figure; woman.rotation.y = -1.6;
  add(woman, cyl(0.22, 0.18, 0.16, "#c9a97a", 10), 0, 1.72, 0);
  const boy = add(g, own(resident("child")), 2.2, 0, 0.2) as Figure; boy.rotation.y = -2.2;
  return life(g, "italyBeef", [vaccinaro, woman, boy], (t, k) => {
    oxTail.rotation.y = Math.sin(t * 1.5) * 0.35;
    pigs.forEach((p, i) => { (p.userData.head as THREE.Object3D).rotation.z = Math.sin(t * 2.4 + i) * 0.12; });
    // the ox lifts his head off the trough, shifts his weight and settles; the pigs shove at the tub
    const lift = beat(k, 0.05, 0.75), shift = beat(k, 0.15, 0.95);
    oxHead.rotation.z = lift * 0.5; oxHead.position.y = 1.0 + lift * 0.2;
    ox.position.z = 0.35 - shift * 0.16; ox.rotation.y = shift * 0.14;
    pigs.forEach((p, i) => { p.position.x = 0.9 + i * 0.7 - beat(k, 0.3 + i * 0.05, 1) * 0.3; (p.userData.head as THREE.Object3D).rotation.z += beat(k, 0.3, 1) * 0.3; });
    upper(vaccinaro).rotation.y = beat(k, 0.4, 1) * 0.35;
    upper(boy).rotation.x = beat(k, 0.5, 1) * 0.2;
  });
}

/**
 * The yard: a wired corner with a low hut, a scatter of hens and one bad-tempered cockerel. A hen flaps up onto
 * the hut's roof and settles; the others come at the scattered grain, and the eggs stay in the nest.
 */
function henYard(): P {
  const g = group();
  // the wire: posts and two rails round three sides, with the hut in the corner
  for (let i = 0; i < 6; i++) { add(g, cyl(0.04, 0.05, 1.1, "#7a6a55", 5), -2.5 + i * 1.0, 0.55, -2.4); add(g, cyl(0.04, 0.05, 1.1, "#7a6a55", 5), -2.5 + i * 1.0, 0.55, 2.2); }
  for (const z of [-2.4, 2.2]) for (const y of [0.4, 0.9]) add(g, cyl(0.02, 0.02, 5.2, "#8c9096", 4), 0, y, z).rotation.z = Math.PI / 2;
  for (const x of [-2.5, 2.5]) { for (const y of [0.4, 0.9]) add(g, cyl(0.02, 0.02, 4.6, "#8c9096", 4), x, y, -0.1).rotation.set(Math.PI / 2, 0, 0); }
  const hut = add(g, new THREE.Group(), -1.7, 0, -1.4);
  add(hut, box(1.5, 0.9, 1.1, "#8a6844"), 0, 0.45, 0);
  const hutRoof = add(hut, box(1.7, 0.08, 1.3, "#a89466"), 0, 0.95, 0); hutRoof.rotation.x = 0.12;
  add(hut, box(0.34, 0.4, 0.06, "#5a4636"), 0.3, 0.3, 0.56);
  add(hut, box(0.9, 0.06, 0.34, "#6e4a2c"), 0.2, 0.18, 0.75).rotation.x = 0.3;
  const nest = add(g, cyl(0.24, 0.2, 0.14, "#c9b06a", 10), -0.5, 0.07, -0.4);
  for (let i = 0; i < 4; i++) add(nest, ball(0.05, "#f0e2c4", 6), Math.cos(i * 1.57) * 0.09, 0.06, Math.sin(i * 1.57) * 0.09).scale.y = 1.25;
  for (let i = 0; i < 16; i++) add(g, ball(0.02, "#e0c88a", 4), (rnd() - 0.5) * 2.4, 0.03, 0.4 + (rnd() - 0.5) * 1.4).scale.y = 0.5;
  const makeHen = (colour: string, comb: string) => {
    const h = new THREE.Group();
    add(h, ball(0.17, colour, 8), 0, 0.28, 0).scale.set(1.35, 1.05, 0.95);
    const hd = add(h, ball(0.085, colour, 7), 0.2, 0.44, 0);
    add(hd, cone(0.03, 0.08, "#e0a52c", 4), 0.08, -0.01, 0).rotation.z = -Math.PI / 2;
    add(hd, box(0.03, 0.07, 0.02, comb), 0, 0.09, 0);
    const wings = [-1, 1].map((s) => { const w = add(h, ball(0.11, colour, 6), 0, 0.3, s * 0.13); w.scale.set(1.25, 0.8, 0.45); return w; });
    add(h, cone(0.09, 0.2, colour, 5), -0.2, 0.38, 0).rotation.z = 1.9;
    for (const dz of [-0.05, 0.05]) add(h, cyl(0.014, 0.012, 0.2, "#e0a52c", 4), 0.02, 0.1, dz);
    h.userData.head = hd; h.userData.wings = wings;
    return h;
  };
  const hens = Array.from({ length: 6 }, (_, i) => { const h = add(g, makeHen(i % 2 ? "#e2d8c4" : "#b4744a", "#c0392b"), -0.2 + Math.cos(i * 1.2) * 1.5, 0, 0.5 + Math.sin(i * 1.2) * 1.0); h.rotation.y = rnd() * 6; return h; });
  const cock = add(g, makeHen("#3a332c", "#c0392b"), 1.6, 0, -0.6); cock.scale.setScalar(1.25); cock.rotation.y = -1.2;
  for (let i = 0; i < 4; i++) add(cock, cone(0.06, 0.26, "#6b3a2a", 5), -0.22, 0.44 + i * 0.03, (i - 1.5) * 0.04).rotation.z = 2.2;
  // the hen that flies up: the subject
  const flyer = add(g, makeHen("#d9a55b", "#c0392b"), -0.9, 0, 0.3); flyer.name = "it-hen"; flyer.rotation.y = -0.5;
  const woman = add(g, own(resident("dairywoman", false)), 1.0, 0, 2.6) as Figure; woman.rotation.y = Math.PI - 0.3;
  const basketMesh = add(woman, cyl(0.2, 0.17, 0.15, "#c9a97a", 10), 0, 1.72, 0); void basketMesh;
  const child = add(g, own(resident("child")), 2.0, 0, 2.2) as Figure; child.rotation.y = -2.4;
  const flyerRest = flyer.position.clone();
  return life(g, "italyChicken", [woman, child], (t, k) => {
    hens.forEach((h, i) => { (h.userData.head as THREE.Object3D).rotation.z = Math.sin(t * 3.2 + i * 1.7) * 0.3; h.position.y = Math.abs(Math.sin(t * 1.4 + i)) * 0.012; });
    (cock.userData.head as THREE.Object3D).rotation.z = Math.sin(t * 2.1) * 0.25;
    // the hen flaps up onto the hut roof and settles back; the rest run in at the grain
    const up = k > 0 ? clamp01(((1 - k) - 0.06) / 0.46) : 0, back = k > 0 ? clamp01(((1 - k) - 0.60) / 0.36) : 0;
    const rise = Math.max(0, up - back);
    flyer.position.copy(flyerRest);
    flyer.position.y = flyerRest.y + rise * 1.02; flyer.position.x = flyerRest.x - rise * 0.76; flyer.position.z = flyerRest.z - rise * 1.6;
    flyer.rotation.z = Math.sin(rise * Math.PI) * 0.35;
    (flyer.userData.wings as THREE.Object3D[]).forEach((w, i) => { w.rotation.x = (i ? 1 : -1) * (rise > 0.02 ? Math.sin(t * 22) * 0.9 : 0); });
    hens.forEach((h, i) => { h.rotation.y += beat(k, 0.2 + i * 0.03, 1) * 0.03; (h.userData.wings as THREE.Object3D[]).forEach((w, n) => { w.rotation.x = (n ? 1 : -1) * beat(k, 0.2, 0.8) * Math.sin(t * 15 + i) * 0.4; }); });
    upper(woman).rotation.y = beat(k, 0.45, 1) * 0.3;
    upper(child).rotation.x = beat(k, 0.5, 1) * 0.25;
  });
}

/**
 * The chestnut wood above the Agro: porcini under the chestnuts, dried on strings for the year. A mushroom is
 * lifted out of the leaf litter and threaded onto the drying string over the gatherer's basket.
 */
export function porciniWood(): P {
  const g = group();
  for (let i = 0; i < 40; i++) add(g, box(0.16, 0.012, 0.12, i % 3 ? "#8a6a3a" : "#a07a42"), (rnd() - 0.5) * 4.6, 0.03, (rnd() - 0.5) * 4.6).rotation.y = rnd() * 3;
  // the chestnuts: broad low crowns on thick trunks, standing back from the front of the clearing
  const chestnuts = Array.from({ length: 3 }, (_, i) => {
    const tr = add(g, new THREE.Group(), -1.8 + i * 1.8, 0, -1.7 + (i % 2) * 0.5);
    add(tr, cyl(0.24, 0.34, 1.8, "#5a4636", 8), 0, 0.9, 0);
    const crown = add(tr, new THREE.Group(), 0, 0, 0);
    for (let n = 0; n < 4; n++) add(crown, ball(0.7, n % 2 ? "#4f7a3a" : "#5f8a3a", 8), (rnd() - 0.5) * 0.7, 2.1 + rnd() * 0.4, (rnd() - 0.5) * 0.7).scale.y = 0.7;
    for (let n = 0; n < 4; n++) add(tr, ball(0.07, "#8a6a3a", 6), (rnd() - 0.5) * 1.2, 0.05, (rnd() - 0.5) * 1.2);
    tr.userData.crown = crown;
    return tr;
  });
  // the drying frame at the front: two posts, a beam and the strings of sliced porcini
  for (const x of [-1.3, 1.3]) add(g, cyl(0.07, 0.08, 1.9, "#6e4a2c", 6), x, 0.95, 2.0);
  const frameBeam = add(g, box(2.8, 0.13, 0.15, "#6e4a2c"), 0, 1.92, 2.0); frameBeam.name = "front-beam";
  lamps(g, 1.92, 2.0, [-1.05, 1.05], 0.75);
  const strings = Array.from({ length: 3 }, (_, r) => {
    const s = add(g, new THREE.Group(), 0, 1.72 - r * 0.02, 2.0 - r * 0.0);
    add(s, cyl(0.006, 0.006, 2.3, "#c9b49a", 4), 0, 0, 0).rotation.z = Math.PI / 2;
    for (let i = 0; i < 9; i++) { const sl = add(s, cyl(0.075, 0.075, 0.02, "#c9a06a", 10), -0.95 + i * 0.24, -0.08 + r * -0.28, 0); sl.rotation.x = Math.PI / 2; sl.userData.foodReaction = "sway"; }
    return s;
  });
  // the porcino that is lifted: the subject, out of the litter at the front
  const porcino = add(g, new THREE.Group(), -0.35, 0.05, 2.7); porcino.name = "it-porcino";
  add(porcino, cyl(0.10, 0.13, 0.26, "#e7d9c3", 9), 0, 0.13, 0);
  add(porcino, ball(0.23, "#8a5a3c", 10), 0, 0.28, 0).scale.y = 0.6;
  add(porcino, cyl(0.2, 0.2, 0.03, "#d9c9a8", 12), 0, 0.22, 0);
  for (let i = 0; i < 5; i++) { const m = add(g, new THREE.Group(), -1.8 + i * 0.9, 0.02, 0.5 + (i % 2) * 0.6); add(m, cyl(0.07, 0.09, 0.2, "#e7d9c3", 8), 0, 0.1, 0); add(m, ball(0.16, i % 2 ? "#8a5a3c" : "#9c6a42", 9), 0, 0.22, 0).scale.y = 0.6; }
  basket(g, -1.0, 0, 2.7, 0.3);
  for (let i = 0; i < 4; i++) add(g, ball(0.12, "#8a5a3c", 6), -1.0 + (rnd() - 0.5) * 0.3, 0.3, 2.7 + (rnd() - 0.5) * 0.3).scale.y = 0.6;
  const gatherer = add(g, own(resident("farmer")), -0.35, 0, 1.45) as Figure; gatherer.rotation.y = 0;
  arms(gatherer).right.rotation.x = -1.3; arms(gatherer).left.rotation.x = -0.9;
  const woman = add(g, own(resident("townswoman", false)), 1.7, 0, 1.6) as Figure; woman.rotation.y = -2.5;
  const child = add(g, own(resident("child")), 2.2, 0, 0.8) as Figure; child.rotation.y = -1.9;
  const porcinoRest = porcino.position.clone();
  return life(g, "mushrooms", [gatherer, woman, child], (t, k) => {
    chestnuts.forEach((tr, i) => { (tr.userData.crown as THREE.Object3D).rotation.z = Math.sin(t * 0.9 + i) * 0.012; });
    strings.forEach((s, i) => { s.children.forEach((c, n) => { if (n) c.rotation.z = Math.sin(t * 1.2 + i + n * 0.3) * 0.06; }); });
    // the porcino is lifted clear of the litter and carried up to the string
    const lift = hold(k, 0.22, 0.86);
    porcino.position.copy(porcinoRest);
    porcino.position.y = porcinoRest.y + lift * 1.28; porcino.position.z = porcinoRest.z - lift * 0.62;
    porcino.rotation.z = lift * 0.6; porcino.rotation.y = lift * 1.4;
    arms(gatherer).right.rotation.x = -1.3 + lift * 0.9; upper(gatherer).rotation.x = 0.22 - lift * 0.3;
    upper(woman).rotation.y = beat(k, 0.5, 1) * 0.35;
    upper(child).rotation.x = beat(k, 0.55, 1) * 0.22;
  });
}

/**
 * The herb bed beside the market: basil, wild mint, rosemary and the bitter greens Rome actually eats. A bunch
 * of basil is pinched off and lifted into the bowl; the whole bed moves as a hand goes through it.
 */
export function herbGarden(): P {
  const g = group();
  // three raised beds behind a low brick kerb, each with its own herb
  const clumps: THREE.Group[] = [];
  const bedAt = (z: number, colour: string, tall: boolean) => {
    add(g, box(4.2, 0.24, 1.2, "#9c6a4a"), 0, 0.12, z);
    add(g, box(4.0, 0.06, 1.0, "#6b5a3a"), 0, 0.26, z);
    for (let i = 0; i < 8; i++) {
      const c = add(g, new THREE.Group(), -1.75 + i * 0.5, 0.28, z + ((i % 2) - 0.5) * 0.35);
      if (tall) for (let n = 0; n < 5; n++) add(c, cyl(0.014, 0.012, 0.42, colour, 4), Math.cos(n * 1.26) * 0.05, 0.21, Math.sin(n * 1.26) * 0.05).rotation.z = Math.cos(n) * 0.2;
      else for (let n = 0; n < 7; n++) { const l = add(c, ball(0.085, n % 2 ? colour : "#6f9b57", 6), (rnd() - 0.5) * 0.24, 0.1 + rnd() * 0.16, (rnd() - 0.5) * 0.24); l.scale.set(1, 0.35, 1.4); l.rotation.y = rnd() * 3; }
      clumps.push(c);
    }
  };
  bedAt(-1.6, "#4f7a3a", true); bedAt(0, "#5f8a3a", false); bedAt(1.6, "#3f7a3a", false);
  for (let i = 0; i < 5; i++) add(g, cyl(0.15, 0.12, 0.2, "#c9603e", 9), -2.0 + i * 1.0, 0.1, 2.4);
  for (let i = 0; i < 5; i++) for (let n = 0; n < 4; n++) add(g, ball(0.06, "#5f8a3a", 5), -2.0 + i * 1.0 + (rnd() - 0.5) * 0.18, 0.24, 2.4 + (rnd() - 0.5) * 0.18).scale.set(1, 0.4, 1.4);
  const can = add(g, cyl(0.14, 0.16, 0.26, "#8c9096", 10), 2.4, 0.13, 2.2);
  add(can, cyl(0.03, 0.05, 0.5, "#8c9096", 6), 0.2, 0.02, 0).rotation.z = -0.7;
  // the bunch that is pinched: the subject, on the near bed at the front
  const bunch = add(g, new THREE.Group(), -0.4, 0.3, 2.0); bunch.name = "it-basil-bunch";
  for (let n = 0; n < 8; n++) { const l = add(bunch, ball(0.09, n % 2 ? "#4f8a3a" : "#6f9b57", 6), (rnd() - 0.5) * 0.2, 0.06 + n * 0.02, (rnd() - 0.5) * 0.2); l.scale.set(1, 0.35, 1.45); l.rotation.y = rnd() * 3; }
  add(bunch, cyl(0.016, 0.014, 0.18, "#4f7a3a", 4), 0, -0.05, 0);
  const bowl = add(g, cyl(0.24, 0.19, 0.12, IT.lime, 12), 0.7, 0.36, 2.2);
  for (let i = 0; i < 4; i++) add(bowl, ball(0.06, "#5f8a3a", 5), Math.cos(i * 1.57) * 0.1, 0.07, Math.sin(i * 1.57) * 0.1).scale.set(1, 0.4, 1.3);
  const gardener = add(g, own(resident("vendor")), -2.4, 0, 1.7) as Figure; gardener.rotation.y = 1.7;
  arms(gardener).right.rotation.x = -1.25; arms(gardener).left.rotation.x = -0.8;
  const buyer = add(g, own(resident("townswoman", false)), 2.5, 0, 1.7) as Figure; buyer.rotation.y = -1.9;
  const bunchRest = bunch.position.clone();
  return life(g, "basil", [gardener, buyer], (t, k) => {
    clumps.forEach((c, i) => { c.rotation.z = Math.sin(t * 1.4 + i * 0.5) * 0.035 + beat(k, 0, 0.6) * Math.sin(t * 12 + i) * 0.06; });
    // the bunch is pinched off and lifted over into the bowl
    const lift = hold(k, 0.24, 0.84);
    bunch.position.copy(bunchRest);
    bunch.position.y = bunchRest.y + lift * 0.42 - lift * lift * 0.06;
    bunch.position.x = bunchRest.x + lift * 1.1; bunch.position.z = bunchRest.z + lift * 0.2;
    bunch.rotation.z = lift * 1.1;
    arms(gardener).right.rotation.x = -1.25 + lift * 0.55; upper(gardener).rotation.y = lift * -0.3;
    upper(buyer).rotation.x = beat(k, 0.5, 1) * 0.2;
  });
}

/**
 * The fish valli: the lagoon walled into shallow enclosures, and the eel, bass and goby taken out of them. The
 * stand stands on its own bank — the enclosures, the weirs and the casone are the water's and the bank's, the
 * clickable is not in the water. The fyke net is lifted out of the shallows and the eels turn over inside it.
 */
export function valliPesca(): P {
  const g = group();
  add(g, box(5, 0.24, 0.5, "#b5a882"), 0, 0.12, 0.2);                                     // the bank's edge the stand stands on
  // the reed weirs of the enclosure on the mud flat in front of the bank, low, and the bricole at its corners
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { if (i > 1 && i < 5) continue; add(g, cyl(0.035, 0.045, 0.6, "#8a7448", 5), -2.3 + i * 0.62, 0.26, 1.1 + r * 1.0).rotation.z = (rnd() - 0.5) * 0.12; }
  for (const x of [-1.9, 1.9]) for (let r = 0; r < 2; r++) add(g, box(1.3, 0.05, 0.05, "#8a7448"), x, 0.5, 1.1 + r * 1.0);
  for (const x of [-2.4, 2.2]) { for (let i = 0; i < 3; i++) add(g, cyl(0.06, 0.07, 1.4, "#7a6a55", 6), x + i * 0.16, 0.7, 2.4).rotation.z = (i - 1) * 0.1; }
  // the casone: the fisherman's reed hut on the bank, behind
  const casone = add(g, new THREE.Group(), 1.6, 0, -1.4);
  add(casone, box(1.8, 1.0, 1.5, "#b9a878"), 0, 0.5, 0);
  add(casone, cone(1.55, 1.5, "#a89466", 4), 0, 1.6, 0).rotation.y = Math.PI / 4;
  add(casone, box(0.5, 0.8, 0.06, "#6e4a2c"), 0, 0.4, 0.78);
  for (let i = 0; i < 4; i++) add(casone, cyl(0.02, 0.02, 1.4, "#8a7448", 4), -0.7 + i * 0.45, 2.1, 0).rotation.x = Math.PI / 2;
  // the holding tank the catch is kept alive in, and the fyke net lifted out of it: the subject
  add(g, box(1.6, 0.34, 1.3, "#6e4a2c"), -0.8, 0.17, 1.7);
  add(g, box(1.46, 0.02, 1.16, "#7fa8a0"), -0.8, 0.33, 1.7);
  const net = add(g, new THREE.Group(), -0.8, 0.3, 1.2); net.name = "it-eel-net";
  for (let r = 0; r < 5; r++) add(net, new THREE.Mesh(new THREE.TorusGeometry(0.3 - r * 0.05, 0.022, 4, 12), mat("#9c8f6a")), 0, 0.02, r * 0.24).rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) add(net, cyl(0.008, 0.008, 1.1, "#b9ad98", 3), Math.cos(i) * 0.2, 0.02, 0.5).rotation.x = Math.PI / 2;
  const eels = Array.from({ length: 4 }, (_, i) => {
    const curve = new THREE.CatmullRomCurve3([V(-0.2, 0, 0.1 + i * 0.12), V(0, 0.04, 0.3 + i * 0.1), V(0.18, -0.02, 0.55 + i * 0.12)]);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.033, 6), mat(i % 2 ? "#4a5a46" : "#3f4a3a"));
    net.add(m); return m;
  });
  // the tubs and the crates on the bank, behind
  for (let i = 0; i < 3; i++) { add(g, cyl(0.28, 0.24, 0.26, IT.wood, 12), 0.2 + i * 0.6, 0.13, 0.35); add(g, cyl(0.25, 0.25, 0.05, "#7fa8a0", 12), 0.2 + i * 0.6, 0.26, 0.35); }
  for (let i = 0; i < 4; i++) add(g, box(0.5, 0.26, 0.4, "#a37a4f"), -1.6 - (i % 2) * 0.55, 0.13 + Math.floor(i / 2) * 0.27, -1.0);
  for (let i = 0; i < 5; i++) add(g, cyl(0.03, 0.035, 0.55, "#8a7448", 5), -1.0 + i * 0.1, 0.28, -1.4).rotation.z = (i - 2) * 0.06;
  const fisher = add(g, own(resident("fisher")), -0.8, 0.02, 0.0) as Figure; fisher.rotation.y = 0;
  arms(fisher).right.rotation.x = -1.3; arms(fisher).left.rotation.x = -1.2;
  const mate = add(g, own(resident("fisher", false)), 0.9, 0.02, -0.5) as Figure; mate.rotation.y = -0.6;
  const boy = add(g, own(resident("child")), -2.0, 0.02, -0.2) as Figure; boy.rotation.y = 0.6;
  const netRest = net.position.clone();
  return life(g, "valliIt", [fisher, mate, boy], (t, k) => {
    eels.forEach((e, i) => { e.rotation.y = Math.sin(t * 2.4 + i) * 0.14; e.position.y = Math.sin(t * 3 + i) * 0.012; });
    // the net lifts out of the shallow water towards the bank and the eels turn over inside it
    const lift = hold(k, 0.24, 0.86);
    net.position.copy(netRest);
    net.position.y = netRest.y + lift * 0.86; net.position.z = netRest.z - lift * 0.22;
    net.rotation.x = -lift * 0.5;
    eels.forEach((e, i) => { e.rotation.y += beat(k, 0.3, 1) * Math.sin(t * 14 + i * 2) * 0.5; });
    arms(fisher).right.rotation.x = -1.3 - lift * 0.35; arms(fisher).left.rotation.x = -1.2 - lift * 0.3;
    upper(fisher).rotation.x = 0.2 - lift * 0.3;
    upper(mate).rotation.y = beat(k, 0.5, 1) * 0.4;
  });
}

/**
 * The rice fields of the terraferma: flooded, mirroring, and weeded by women standing in them all day. The
 * seedlings run in a wave across the water and a bundle of them is lifted out onto the bank.
 */
export function riceFieldItaly(): P {
  const g = group();
  const seedlings: THREE.Mesh[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) {
    const sd = add(g, cone(0.05, 0.44, "#8fcf6a", 4), -2.3 + c * 0.46, 0.22, -2.4 + r * 0.8);
    sd.geometry = sd.geometry.clone(); sd.geometry.translate(0, 0.22, 0); sd.position.y = 0.02;
    seedlings.push(sd);
  }
  add(g, box(5.4, 0.22, 0.6, "#a37a4f"), 0, 0.11, 1.4);                                    // the bank at the front
  add(g, box(0.5, 0.2, 3.6, "#a37a4f"), -2.7, 0.1, -0.7);
  // the bundle lifted onto the bank: the subject
  const sheaf = add(g, new THREE.Group(), -0.6, 0.24, 0.9); sheaf.name = "it-rice-sheaf";
  for (let i = 0; i < 9; i++) { const s = add(sheaf, cone(0.045, 0.5, "#9cd47a", 4), Math.cos(i * 0.7) * 0.07, 0.25, Math.sin(i * 0.7) * 0.07); s.rotation.z = Math.cos(i) * 0.12; }
  add(sheaf, cyl(0.1, 0.1, 0.04, "#c9b06a", 8), 0, 0.2, 0);
  // the heron, the sluice and the crates on the bank
  const heron = add(g, new THREE.Group(), 2.2, 0.12, -0.6);
  for (const z of [-0.05, 0.05]) add(heron, cyl(0.012, 0.012, 0.5, "#3a3a44", 4), 0, 0.25, z);
  add(heron, ball(0.16, "#cfd6d8", 8), 0, 0.6, 0).scale.set(1.5, 0.9, 1);
  add(heron, cyl(0.025, 0.03, 0.5, "#cfd6d8", 5), 0.25, 0.85, 0).rotation.z = -0.4;
  add(heron, ball(0.07, "#cfd6d8", 6), 0.36, 1.1, 0);
  add(heron, cone(0.02, 0.2, "#e0a52c", 4), 0.5, 1.08, 0).rotation.z = -Math.PI / 2;
  add(g, box(0.6, 0.5, 0.3, "#6e4a2c"), 2.3, 0.25, 1.4);
  add(g, cyl(0.04, 0.04, 0.7, IT.iron, 5), 2.3, 0.75, 1.4);
  for (let i = 0; i < 3; i++) add(g, box(0.5, 0.25, 0.4, "#a37a4f"), -2.2 + i * 0.55, 0.35, 1.45);
  for (let i = 0; i < 3; i++) add(g, cyl(0.16, 0.14, 0.2, "#c9a97a", 10), 0.9 + i * 0.4, 0.32, 1.45);
  // the weeders, bent into the water, and the woman on the bank
  const weeders = Array.from({ length: 3 }, (_, i) => {
    const w = add(g, own(resident("townswoman")), -1.6 + i * 1.5, 0.02, -1.0 - (i % 2) * 0.7) as Figure;
    w.rotation.y = 0.2 + i * 0.4; upper(w).rotation.x = 0.85;
    arms(w).right.rotation.x = -1.5; arms(w).left.rotation.x = -1.4;
    wear(w, cyl(0.3, 0.33, 0.04, "#d9bf7a", 12), 0, 1.16, 0);
    return w;
  });
  const overseer = add(g, own(resident("farmer", false)), 1.6, 0.22, 1.25) as Figure; overseer.rotation.y = -1.8;
  const sheafRest = sheaf.position.clone();
  return life(g, "riceIt", [overseer, ...weeders], (t, k) => {
    seedlings.forEach((sd, i) => { sd.rotation.z = Math.sin(t * 1.5 + sd.position.x * 0.8) * 0.08 + beat(k, 0, 0.75) * Math.sin((1 - k) * 9 - sd.position.x * 1.4) * 0.34; void i; });
    heron.position.y = 0.12 + beat(k, 0.35, 1) * 1.9; heron.position.x = 2.2 + beat(k, 0.35, 1) * 0.6; heron.rotation.z = beat(k, 0.35, 1) * 0.2;
    // the bundle lifts out of the water and settles on the bank
    const lift = hold(k, 0.20, 0.86);
    sheaf.position.copy(sheafRest);
    sheaf.position.y = sheafRest.y + lift * 0.52; sheaf.position.z = sheafRest.z + lift * 0.48;
    sheaf.rotation.z = lift * 0.4;
    weeders.forEach((w, i) => { upper(w).rotation.x = 0.85 - beat(k, 0.3 + i * 0.07, 1) * 0.55; });
    arms(overseer).right.rotation.x = -beat(k, 0.4, 1) * 0.6;
  });
}

/**
 * The wheat and the latifondo: durum in great unfenced blocks on an estate held by a middleman. A sheaf is
 * bound and stood into the stook; the reapers straighten behind it and the gabelloto's tally board swings.
 */
export function wheatLatifondo(): P {
  const g = group();
  // the standing wheat behind, in one great block with no fence anywhere in it
  const ears: THREE.Object3D[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {
    const st = add(g, new THREE.Group(), -2.6 + c * 0.46, 0, -2.6 + r * 0.6);
    add(st, cyl(0.012, 0.014, 0.8, "#c9a840", 4), 0, 0.4, 0);
    add(st, cone(0.04, 0.24, "#e0c060", 5), 0, 0.9, 0);
    ears.push(st);
  }
  // the stooks: sheaves stood against each other, and the cut stubble in front of them
  const stooks = Array.from({ length: 3 }, (_, i) => {
    const s = add(g, new THREE.Group(), -1.9 + i * 1.9, 0, 0.1);
    for (let n = 0; n < 5; n++) { const sh = add(s, cyl(0.12, 0.2, 1.1, "#d9bf7a", 8), Math.cos(n * 1.26) * 0.18, 0.55, Math.sin(n * 1.26) * 0.18); sh.rotation.z = Math.cos(n * 1.26) * 0.2; sh.rotation.x = -Math.sin(n * 1.26) * 0.2; add(s, cyl(0.13, 0.13, 0.04, "#c9a840", 8), Math.cos(n * 1.26) * 0.22, 0.9, Math.sin(n * 1.26) * 0.22); }
    return s;
  });
  for (let i = 0; i < 30; i++) add(g, cyl(0.012, 0.012, 0.16, "#c9a840", 3), (rnd() - 0.5) * 5, 0.08, 0.8 + rnd() * 1.6);
  // the sheaf being bound: the subject, at the front on the threshing cloth
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.8), mat("#d9cdb4")), -0.5, 0.025, 2.4).rotation.x = -Math.PI / 2;
  const sheaf = add(g, new THREE.Group(), -0.5, 0.1, 2.4); sheaf.name = "it-wheat-sheaf";
  for (let n = 0; n < 9; n++) { const s = add(sheaf, cyl(0.045, 0.06, 1.0, "#d9bf7a", 6), 0, 0.02, -0.1 + n * 0.026); s.rotation.z = Math.PI / 2; }
  const band = add(sheaf, new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.022, 4, 12), mat("#c9a840")), 0.1, 0.02, 0); band.rotation.y = Math.PI / 2;
  const sickle = add(g, new THREE.Group(), 0.6, 0.12, 2.5);
  add(sickle, new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.014, 4, 12, Math.PI * 1.1), mat("#bcc2c6")), 0, 0, 0).rotation.x = Math.PI / 2;
  add(sickle, cyl(0.02, 0.025, 0.24, "#6e4a2c", 5), -0.22, 0, 0).rotation.z = Math.PI / 2;
  // the water jar, the tally board and the mule waiting with the panniers
  add(g, ball(0.28, "#9c6a4a", 10), 1.8, 0.28, 1.9).scale.y = 1.2;
  add(g, cyl(0.09, 0.12, 0.2, "#9c6a4a", 8), 1.8, 0.62, 1.9);
  for (const x of [2.0, 2.9]) add(g, cyl(0.06, 0.07, 1.9, "#6e4a2c", 6), x, 0.95, 0.9);
  const tallyBeam = add(g, box(1.1, 0.12, 0.14, "#6e4a2c"), 2.45, 1.92, 0.9); tallyBeam.name = "front-beam";
  lamps(g, 1.92, 0.9, [2.7], 0.75);
  const tally = add(g, new THREE.Group(), 2.2, 1.78, 0.9); tally.userData.foodReaction = "sway";
  add(tally, cyl(0.006, 0.006, 0.2, "#8a7f60", 4), 0, -0.1, 0);
  add(tally, box(0.3, 0.42, 0.03, "#5a4636"), 0, -0.34, 0);
  const m = mule(g, 1.0, 0, -1.3, "#7a6a55").mule; m.rotation.y = 0.2;
  for (const dz of [-0.4, 0.4]) add(m, cyl(0.22, 0.18, 0.3, "#c9a97a", 10), 0, 1.2, dz);
  const binder = add(g, own(resident("farmer")), -2.2, 0, 2.3) as Figure; binder.rotation.y = 1.5;
  arms(binder).right.rotation.x = -1.35; arms(binder).left.rotation.x = -1.3;
  const reaperA = add(g, own(resident("worker", false)), -2.1, 0, 1.2) as Figure; reaperA.rotation.y = 0.4;
  upper(reaperA).rotation.x = 0.6;
  const reaperB = add(g, own(resident("worker", false)), 1.0, 0, 1.2) as Figure; reaperB.rotation.y = -0.4;
  upper(reaperB).rotation.x = 0.6;
  const sheafRest = sheaf.position.clone();
  return life(g, "granoIt", [binder, reaperA, reaperB], (t, k) => {
    ears.forEach((e, i) => { e.rotation.z = Math.sin(t * 1.1 + e.position.x * 0.4 + i * 0.01) * 0.055; });
    stooks.forEach((s, i) => { s.rotation.z = Math.sin(t * 0.7 + i) * 0.008; });
    tally.rotation.z = Math.sin(t * 1.3) * 0.06;
    // the band closes on the sheaf, it is lifted and stood on end
    const bind = beat(k, 0.04, 0.44), stand = hold(k, 0.42, 0.92);
    band.scale.setScalar(1 - bind * 0.25);
    sheaf.position.copy(sheafRest);
    sheaf.position.y = sheafRest.y + stand * 0.52; sheaf.position.z = sheafRest.z - stand * 0.5;
    sheaf.rotation.z = stand * 1.45; sheaf.rotation.y = stand * 0.4;
    sickle.rotation.y = bind * 0.9;
    arms(binder).right.rotation.x = -1.35 + stand * 0.75; upper(binder).rotation.x = 0.28 - stand * 0.34;
    upper(reaperA).rotation.x = 0.6 - beat(k, 0.45, 1) * 0.5;
    upper(reaperB).rotation.x = 0.6 - beat(k, 0.5, 1) * 0.5;
  });
}

/**
 * The tomato beds outside Palermo: the plum tomato, the paste dried on boards in the sun, and the cannery the
 * trade grew into. A crate is tipped onto the drying board and the fruit rolls out across it.
 */
export function tomatoField(): P {
  const g = group();
  const plants: THREE.Group[] = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) {
    const p = add(g, new THREE.Group(), -2.0 + i * 1.0, 0, -1.3 + r * 0.7);
    add(g, cyl(0.02, 0.025, 1.1, "#8a7448", 4), -2.0 + i * 1.0 + 0.16, 0.55, -1.3 + r * 0.7);
    for (let n = 0; n < 6; n++) { const l = add(p, ball(0.14, n % 2 ? "#4f7a3a" : "#5f8a3a", 6), (rnd() - 0.5) * 0.4, 0.25 + rnd() * 0.5, (rnd() - 0.5) * 0.4); l.scale.set(1, 0.35, 1.2); }
    for (let n = 0; n < 3; n++) add(p, ball(0.075, "#c0392b", 6), (rnd() - 0.5) * 0.3, 0.2 + rnd() * 0.4, (rnd() - 0.5) * 0.3).scale.y = 0.9;
    plants.push(p);
  }
  // the drying boards on trestles at the front, with the paste already spread on two of them
  for (let i = 0; i < 3; i++) {
    add(g, box(1.5, 0.05, 1.0, "#c9a37a"), -1.7 + i * 1.7, 0.66, 1.6);
    for (const dx of [-0.6, 0.6]) for (const dz of [-0.4, 0.4]) add(g, box(0.07, 0.62, 0.07, "#6e4a2c"), -1.7 + i * 1.7 + dx, 0.31, 1.6 + dz);
    if (i < 2) for (let n = 0; n < 6; n++) add(g, box(0.22, 0.02, 0.22, "#9c2f22"), -2.15 + i * 1.7 + (n % 3) * 0.45, 0.70, 1.4 + Math.floor(n / 3) * 0.4);
  }
  // the crate of fruit tipped onto the empty board: the subject
  const tomatoes = add(g, new THREE.Group(), 1.7, 0.9, 2.0); tomatoes.name = "it-tomato-tray";
  const crate = add(tomatoes, new THREE.Group(), 0, -0.08, 0.05);
  add(crate, box(0.62, 0.3, 0.44, "#a37a4f"), 0, 0, 0);
  for (let i = 0; i < 3; i++) add(crate, box(0.64, 0.03, 0.46, "#8a6844"), 0, -0.12 + i * 0.12, 0);
  const fruit = Array.from({ length: 10 }, (_, i) => { const f = add(tomatoes, ball(0.08, "#c0392b", 7), -0.18 + (i % 4) * 0.12, 0.02 + Math.floor(i / 4) * 0.08, -0.1 + (i % 3) * 0.1); f.scale.set(0.9, 1.15, 0.9); return f; });
  const spread = fruit.map((_, i) => V(-0.5 + i * 0.13, -0.15, -0.25 + (i % 3) * 0.25));
  const spatula = add(g, new THREE.Group(), 1.2, 0.72, 1.5);
  add(spatula, box(0.24, 0.02, 0.16, "#c9a37a"), 0, 0, 0);
  add(spatula, cyl(0.016, 0.016, 0.36, "#6e4a2c", 5), -0.28, 0.02, 0).rotation.z = Math.PI / 2;
  // the salt sack, the jars of paste and the cart wheel leaning on the wall
  dryStone(g, 0, -1.75, 5.2, 0, 2);
  add(g, cyl(0.26, 0.32, 0.5, "#d9cdb4", 10), -2.4, 0.25, 0.9);
  for (let i = 0; i < 4; i++) { add(g, cyl(0.11, 0.13, 0.26, "#8a6a3a", 10), -2.3 + i * 0.3, 0.13, 2.4); add(g, cyl(0.09, 0.09, 0.03, "#9c2f22", 10), -2.3 + i * 0.3, 0.27, 2.4); }
  const woman = add(g, own(resident("townswoman")), 2.6, 0, 1.2) as Figure; woman.rotation.y = -1.4;
  arms(woman).right.rotation.x = -1.2; arms(woman).left.rotation.x = -1.15;
  const helper = add(g, own(resident("worker", false)), 0.2, 0, 0.8) as Figure; helper.rotation.y = -0.6;
  const child = add(g, own(resident("child")), -1.3, 0, 0.8) as Figure; child.rotation.y = 0.4;
  const fruitRest = fruit.map((f) => f.position.clone()), trayRest = tomatoes.position.clone();
  return life(g, "tomato", [woman, helper, child], (t, k) => {
    plants.forEach((p, i) => { p.rotation.z = Math.sin(t * 1.2 + i * 0.4) * 0.025; });
    // the crate tips and the fruit rolls out across the board
    const tip = hold(k, 0.16, 0.56), roll = k > 0 ? clamp01(((1 - k) - 0.12) / 0.66) : 0;
    crate.rotation.x = -tip * 1.15; crate.position.y = -0.08 + tip * 0.1; crate.position.z = 0.05 - tip * 0.12;
    tomatoes.position.copy(trayRest);
    tomatoes.position.y = trayRest.y + tip * 0.10 - roll * 0.12; tomatoes.position.z = trayRest.z - roll * 0.45;
    fruit.forEach((f, i) => {
      const p = clamp01(roll * 1.5 - i * 0.06);
      f.position.copy(fruitRest[i]).lerp(spread[i], p);
      f.position.y = fruitRest[i].y + (spread[i].y - fruitRest[i].y) * p + Math.sin(p * Math.PI) * 0.09;
      f.rotation.x = -p * 4.2; f.rotation.z = p * 1.2;
    });
    spatula.position.x = 1.2 + beat(k, 0.4, 1) * 0.4; spatula.rotation.y = beat(k, 0.4, 1) * 0.4;
    arms(woman).right.rotation.x = -1.2 - tip * 0.4; upper(woman).rotation.x = tip * 0.16;
    upper(helper).rotation.y = beat(k, 0.5, 1) * 0.4;
  });
}

/**
 * The lemon grove in the Conca d'Oro: walled gardens, a water tank and the most profitable hectare in Europe.
 * The trees shake and the fruit falls into the pickers' baskets, then is cleaned up when it has settled.
 */
export function citrusGrove(): P {
  const g = group();
  const trees: P[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) trees.push(add(g, citrusTree(c % 2 ? "lemon" : "orange", 0.9 + rnd() * 0.15), -1.9 + c * 1.9, 0, -0.5 - r * 1.8));
  dryStone(g, 0, -3.0, 6.0, 0, 3); dryStone(g, -2.9, -1.2, 3.6, Math.PI / 2, 3); dryStone(g, 2.9, -1.2, 3.6, Math.PI / 2, 3);
  // the water tank the grove is irrigated from, and the channel out of it
  add(g, box(1.5, 0.8, 1.2, "#b9ad98"), 2.3, 0.4, 1.3);
  add(g, box(1.3, 0.08, 1.0, "#5fa8b8"), 2.3, 0.78, 1.3);
  for (let i = 0; i < 4; i++) add(g, box(0.5, 0.16, 0.3, "#b9ad98"), 1.3 - i * 0.5, 0.08, 1.9);
  for (let i = 0; i < 4; i++) add(g, box(0.42, 0.05, 0.2, "#5fa8b8"), 1.3 - i * 0.5, 0.15, 1.9);
  const baskets = [V(-1.9, 0.2, 1.2), V(0, 0.2, 1.3), V(1.4, 0.2, 1.0)];
  baskets.forEach((b) => { basket(g, b.x, 0, b.z, 0.3); for (let i = 0; i < 4; i++) add(g, ball(0.085, IT.lemon, 6), b.x + (rnd() - 0.5) * 0.3, 0.3, b.z + (rnd() - 0.5) * 0.3).scale.set(0.85, 1.15, 0.85); });
  for (let i = 0; i < 3; i++) add(g, box(0.55, 0.28, 0.42, "#a37a4f"), -2.4, 0.14 + i * 0.29, 0.3);
  const pickerA = add(g, own(resident("farmer")), -1.0, 0, 0.5) as Figure; pickerA.rotation.y = 3.0;
  arms(pickerA).right.rotation.x = -1.6;
  const pickerB = add(g, own(resident("worker", false)), 0.9, 0, 0.5) as Figure; pickerB.rotation.y = 2.8;
  const child = add(g, own(resident("child")), 1.9, 0, 0.2) as Figure; child.rotation.y = -1.2;
  const crop = harvest(g, trees, baskets, 0.12);
  return life(g, "lemon", [pickerA, pickerB, child], (t, k, dt) => {
    crop.tick(t, k, dt);
    arms(pickerA).right.rotation.x = -1.6 + beat(k, 0.1, 0.8) * 0.35;
    upper(pickerB).rotation.y = beat(k, 0.45, 1) * 0.4;
    upper(child).rotation.x = beat(k, 0.5, 1) * 0.25;
  }, () => crop.poke());
}

/** An almond tree of Avola: a pale open crown on a short trunk, with the nuts in their green husks. */
function almondTree(s = 1): P {
  const g = group();
  add(g, cyl(0.11, 0.17, 0.85 * s, "#7a6a55", 7), 0, 0.42 * s, 0).rotation.z = (rnd() - 0.5) * 0.2;
  const crown = new THREE.Group(); g.add(crown);
  for (let i = 0; i < 4; i++) { const br = add(crown, cyl(0.04, 0.06, 0.9 * s, "#7a6a55", 5), Math.cos(i * 1.6) * 0.34 * s, 1.1 * s, Math.sin(i * 1.6) * 0.34 * s); br.rotation.z = Math.cos(i * 1.6) * 0.7; br.rotation.x = -Math.sin(i * 1.6) * 0.7; }
  for (let i = 0; i < 4; i++) add(crown, ball(0.6 * s, i % 2 ? "#8fa872" : "#7f9a68", 8), (rnd() - 0.5) * 0.9 * s, (1.5 + rnd() * 0.4) * s, (rnd() - 0.5) * 0.9 * s).scale.y = 0.72;
  const fruits: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) { const f = add(crown, ball(0.07 * s, "#a8b878", 6), (rnd() - 0.5) * 1.4 * s, (1.2 + rnd() * 0.8) * s, (rnd() - 0.5) * 1.4 * s); f.scale.set(1, 1.3, 0.8); fruits.push(f); }
  (g.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[] }).crown = crown;
  (g.userData as { crown?: THREE.Group; fruits?: THREE.Mesh[] }).fruits = fruits;
  return g;
}

/**
 * The almond grove at Avola: the Pizzuta selected in this very century, and the milk pressed out of it. The
 * canes knock the husks down onto the cloths and the pickers gather them into the baskets.
 */
export function almondGrove(): P {
  const g = group();
  const trees: P[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) trees.push(add(g, almondTree(0.9 + rnd() * 0.15), -2.0 + c * 2.0, 0, -0.7 - r * 1.8));
  dryStone(g, 0, -3.1, 6.0, 0, 2);
  for (let i = 0; i < 3; i++) add(g, new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.6), mat("#e2dccb")), -2.0 + i * 2.0, 0.025, -0.7).rotation.x = -Math.PI / 2;
  const baskets = [V(-1.8, 0.2, 1.3), V(0.2, 0.2, 1.4), V(1.6, 0.2, 1.1)];
  baskets.forEach((b) => { basket(g, b.x, 0, b.z, 0.3); for (let i = 0; i < 5; i++) add(g, ball(0.06, "#a8b878", 5), b.x + (rnd() - 0.5) * 0.3, 0.3, b.z + (rnd() - 0.5) * 0.3).scale.set(1, 1.3, 0.8); });
  // the shelling bench and the stone mortar the milk is pressed in
  add(g, box(1.4, 0.08, 0.7, IT.wood), 2.3, 0.82, 1.9);
  for (const dx of [-0.6, 0.6]) for (const dz of [-0.25, 0.25]) add(g, box(0.08, 0.78, 0.08, "#6e4a2c"), 2.3 + dx, 0.39, 1.9 + dz);
  for (let i = 0; i < 8; i++) add(g, ball(0.045, "#e2cfa4", 5), 1.85 + (i % 4) * 0.3, 0.89, 1.78 + Math.floor(i / 4) * 0.24).scale.set(1, 1.35, 0.7);
  add(g, cyl(0.28, 0.26, 0.3, IT.stone, 14), 2.6, 0.15, 0.6);
  add(g, cyl(0.24, 0.24, 0.05, "#f1ece0", 14), 2.6, 0.3, 0.6);
  const cane = add(g, cyl(0.022, 0.028, 2.6, "#c9a840", 6), -0.8, 1.3, 0.35); cane.rotation.x = -0.4;
  const pickerA = add(g, own(resident("farmer")), -1.0, 0, 0.5) as Figure; pickerA.rotation.y = 3.0;
  arms(pickerA).right.rotation.x = -1.7;
  const pickerB = add(g, own(resident("townswoman", false)), 1.0, 0, 0.5) as Figure; pickerB.rotation.y = 2.8;
  const sheller = add(g, own(resident("townswoman")), 2.3, 0, 1.25) as Figure; sheller.rotation.y = 0;
  const crop = harvest(g, trees, baskets, 0.12);
  return life(g, "mandorleIt", [pickerA, pickerB, sheller], (t, k, dt) => {
    crop.tick(t, k, dt);
    cane.rotation.z = Math.sin(t * 0.8) * 0.05 + beat(k, 0, 0.6) * 0.5;
    arms(pickerA).right.rotation.x = -1.7 + beat(k, 0.05, 0.7) * 0.5;
    upper(pickerB).rotation.y = beat(k, 0.45, 1) * 0.4;
  }, () => crop.poke());
}

/**
 * The caper terraces of Pantelleria and Salina: a bud picked before it flowers and packed in salt, the island's
 * whole seasoning. The picker's hand goes through the bush, the buds drop into the tub and the salt is turned.
 */
export function caperTerrace(): P {
  const g = group();
  // three stepped terraces held up by dry-stone walls, the bushes falling over their edges
  const bushes: THREE.Group[] = [];
  for (let r = 0; r < 3; r++) {
    const y = r * 0.5;
    add(g, box(5.6, 0.5, 1.4, "#b3a57e"), 0, y + 0.25, -0.4 - r * 1.4);
    dryStone(g, 0, 0.3 - r * 1.4, 5.6, 0, 2).position.y = y - 0.18;
    for (let i = 0; i < 4; i++) {
      const b = add(g, new THREE.Group(), -2.1 + i * 1.4, y + 0.5, -0.6 - r * 1.4);
      for (let n = 0; n < 7; n++) { const l = add(b, ball(0.16, n % 2 ? "#6f9b57" : "#7d9058", 6), (rnd() - 0.5) * 0.7, 0.1 + rnd() * 0.3, (rnd() - 0.5) * 0.6); l.scale.set(1, 0.4, 1.1); }
      for (let n = 0; n < 4; n++) add(b, ball(0.035, "#4f7a3a", 5), (rnd() - 0.5) * 0.5, 0.2 + rnd() * 0.2, (rnd() - 0.5) * 0.4).scale.y = 1.4;
      if ((r + i) % 4 === 0) { add(b, ball(0.07, "#efe6f0", 6), 0.2, 0.34, 0.1).scale.y = 0.6; add(b, ball(0.04, "#c4a6d4", 5), 0.2, 0.4, 0.1); }
      bushes.push(b);
    }
  }
  // the salt tubs at the front, and the buds that fall into the nearest one: the subject
  const tubs = Array.from({ length: 3 }, (_, i) => {
    const tb = add(g, cyl(0.34, 0.3, 0.42, IT.wood, 14), -1.2 + i * 1.2, 0.21, 1.6);
    for (let n = 0; n < 3; n++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.345, 0.022, 4, 14), mat(IT.iron)), -1.2 + i * 1.2, 0.1 + n * 0.14, 1.6).rotation.x = Math.PI / 2;
    add(g, cyl(0.3, 0.3, 0.06, IT.salt, 14), -1.2 + i * 1.2, 0.43, 1.6);
    return tb;
  });
  const caperTub = add(g, new THREE.Group(), 0, 0.46, 1.6); caperTub.name = "it-caper-tub";
  const buds = Array.from({ length: 8 }, (_, i) => { const b = add(caperTub, ball(0.045, "#4f7a3a", 5), Math.cos(i * 0.8) * 0.16, 0.02, Math.sin(i * 0.8) * 0.16); b.scale.y = 1.35; return b; });
  const scoop = add(g, new THREE.Group(), 0.95, 0.6, 1.8);
  add(scoop, new THREE.Mesh(new THREE.SphereGeometry(0.11, 9, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(IT.wood)), 0, 0, 0);
  add(scoop, cyl(0.015, 0.015, 0.38, IT.wood, 5), 0, 0.2, -0.04).rotation.x = -0.2;
  for (let i = 0; i < 4; i++) add(g, cyl(0.12, 0.14, 0.22, "#9c6a4a", 10), 1.6 + i * 0.3, 0.11, 0.6);
  for (let i = 0; i < 2; i++) add(g, pricklyPear(), -2.6 + i * 0.6, 0, 0.6);
  const picker = add(g, own(resident("townswoman")), -2.1, 0, 1.7) as Figure; picker.rotation.y = 1.9;
  const pickerB = add(g, own(resident("worker", false)), 2.2, 0, 1.6) as Figure; pickerB.rotation.y = -1.9;
  const budRest = buds.map((b) => b.position.clone());
  return life(g, "capperiIt", [picker, pickerB], (t, k) => {
    bushes.forEach((b, i) => { b.rotation.z = Math.sin(t * 1.25 + i * 0.4) * 0.03; });
    // the buds drop into the salt and the scoop turns them over
    const drop = k > 0 ? clamp01(((1 - k) - 0.08) / 0.5) : 0, turn = beat(k, 0.45, 1);
    buds.forEach((b, i) => {
      const p = clamp01(drop * 1.6 - i * 0.07);
      b.position.copy(budRest[i]);
      b.position.y = budRest[i].y + (1 - p) * 0.72 * (k > 0 ? 1 : 0);
      b.position.x = budRest[i].x + (1 - p) * 0.2 * Math.cos(i) * (k > 0 ? 1 : 0);
      b.rotation.z = p * 2.0;
    });
    scoop.rotation.z = turn * 0.9; scoop.position.y = 0.6 + turn * 0.12;
    const lift = hold(k, 0.2, 0.85);
    caperTub.position.y = 0.46 + lift * 0.14; caperTub.rotation.y = lift * 0.6;
    tubs[1].rotation.y = turn * 0.12;
    upper(picker).rotation.x = 0.2 - beat(k, 0.1, 0.8) * 0.3;
    upper(pickerB).rotation.y = beat(k, 0.5, 1) * 0.4;
  });
}

// ---------- the eight landmarks and card-only places ----------

/** A small dark bird for the swifts over Rome and the pigeons of the Pantheon: a body and two wings that beat. */
function bird(colour = "#2f2a2a", s = 1) {
  const b = new THREE.Group();
  add(b, ball(0.07 * s, colour, 6), 0, 0, 0).scale.set(1.8, 0.7, 0.8);
  const wings = [-1, 1].map((side) => { const w = add(b, box(0.26 * s, 0.012, 0.09 * s, colour), 0, 0.01, side * 0.12 * s); w.rotation.x = side * 0.3; return w; });
  b.userData.wings = wings;
  return b;
}

/**
 * The Colosseum as it stood in 1900: two-thirds of the outer ring gone, the travertine pitted, the arcades open to
 * the sky and grown over. No gladiator and no beast: this is a ruin in a working city. On the click the swifts
 * leave the upper arcades in a spiral over the front of the ring, where the arrival camera looks, and come back.
 */
export function colosseum(): P {
  const g = group();
  // the ruin is drawn at half size: the blueprint stands it small and behind its neighbourhood, 4.6 from the Pantheon
  const ruin = add(g, new THREE.Group(), 0, 0, -0.4); ruin.scale.setScalar(0.5);
  const R = 4.2, rows = 3;
  for (let r = 0; r < rows; r++) {
    const y = r * 1.3;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(R - r * 0.05, R - r * 0.05, 1.3, 40, 1, true, r === 2 ? 2.4 : 0, r === 2 ? Math.PI * 2 - 2.4 : Math.PI * 2), mat(IT.travertine, { side: THREE.DoubleSide }));
    ring.position.y = y + 0.65; ruin.add(ring);
    const n = 28;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      if (r === 2 && a < 2.4) continue;                                                         // the collapsed top on one side
      const arch = add(ruin, box(0.5, 0.8, 0.25, "#4a4238"), Math.cos(a) * (R + 0.02), y + 0.6, Math.sin(a) * (R + 0.02)); arch.rotation.y = -a + Math.PI / 2;
      add(ruin, box(0.16, 1.3, 0.2, "#d9ccb0"), Math.cos(a + Math.PI / n) * (R + 0.05), y + 0.65, Math.sin(a + Math.PI / n) * (R + 0.05)).rotation.y = -a - Math.PI / n + Math.PI / 2;
    }
    if (r < 2) add(ruin, new THREE.Mesh(new THREE.TorusGeometry(R + 0.05, 0.12, 6, 40), mat("#d9ccb0")), 0, y + 1.3, 0).rotation.x = Math.PI / 2;
  }
  add(ruin, new THREE.Mesh(new THREE.CircleGeometry(R - 0.4, 32), mat("#b8a878")), 0, 0.04, 0).rotation.x = -Math.PI / 2;
  // what grows on it: the flora the botanists catalogued, as tufts along the ledges and the broken top
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, y = 1.3 * (1 + Math.floor(rnd() * 2)); add(ruin, ball(0.16, i % 3 ? "#6f8a4a" : "#8fa06a", 5), Math.cos(a) * (R + 0.1), y + 0.05, Math.sin(a) * (R + 0.1)).scale.set(1.2, 0.6, 1.2); }
  // the swifts: the subject. A few perch on the upper ledge over the front; the click sends them out in a spiral.
  const swifts = add(g, new THREE.Group(), 0.3, 1.75, 1.85); swifts.name = "it-swifts";
  const flock = Array.from({ length: 9 }, (_, i) => { const b = add(swifts, bird(), Math.cos(i * 0.7) * 0.5, 0, Math.sin(i * 0.7) * 0.2); b.rotation.y = i; return b; });
  // two visitors with a guide book, a friar, and a boy selling postcards, all on the paving below the arcades
  const visitor = add(g, own(resident("townswoman", false)), -1.5, 0, 2.2) as Figure; visitor.rotation.y = Math.PI - 0.3;
  const guide = add(g, own(resident("townsman", false)), -0.8, 0, 2.45) as Figure; guide.rotation.y = Math.PI + 0.4;
  add(arms(guide).right, box(0.12, 0.02, 0.16, "#8e2a22"), 0, arms(guide).hand, 0.08);
  arms(guide).right.rotation.x = -1.0;
  const friar = add(g, own(resident("priest", false)), 1.7, 0, 2.1) as Figure; friar.rotation.y = Math.PI + 0.6;
  const boy = add(g, own(resident("child")), 1.1, 0, 2.55) as Figure; boy.rotation.y = Math.PI - 0.2;
  const swiftRest = swifts.position.clone();
  return life(g, "colosseoIt", [guide, visitor, friar, boy], (t, k) => {
    // 1. the swifts go up off the ledge and spiral out over the front of the ring, then settle again
    const out = hold(k, 0.14, 0.86);
    swifts.position.copy(swiftRest);
    swifts.position.y = swiftRest.y + out * 0.6; swifts.position.z = swiftRest.z + out * 0.9;
    flock.forEach((b, i) => {
      const a = t * (2.2 + (i % 3) * 0.3) + i * 0.7, r = 0.5 + out * (0.6 + (i % 4) * 0.25);
      b.position.set(Math.cos(a) * r, out * Math.sin(a * 0.7 + i) * 0.35, Math.sin(a) * r * (0.4 + out * 0.6));
      b.rotation.y = out > 0.02 ? -a : i;
      (b.userData.wings as THREE.Object3D[]).forEach((w, n) => { w.rotation.x = (n ? 1 : -1) * (out > 0.02 ? 0.3 + Math.sin(t * 24 + i) * 0.7 : 0.3); });
    });
    // 2. the guide points up with the book, 3. the visitor looks up after them
    arms(guide).right.rotation.x = -1.0 - beat(k, 0.2, 0.9) * 1.1;
    upper(visitor).rotation.x = -beat(k, 0.3, 1) * 0.3;
    upper(boy).rotation.x = -beat(k, 0.4, 1) * 0.25;
  });
}

/**
 * The Pantheon: a portico of granite columns, a bronze door, a dome with an oculus that has never been glazed.
 * On the click the shaft of sun through the oculus swings across the floor inside, which the open door shows, and
 * the pigeons lift off the portico steps in front of the columns and settle again.
 */
export function pantheon(): P {
  const g = group();
  // the temple at 0.45 of the old decor's size: it stands four units from the pasta kitchen and the Colosseum
  const temple = add(g, new THREE.Group(), 0, 0, 0); temple.scale.setScalar(0.45);
  add(temple, box(9, 0.5, 8, IT.travertine), 0, 0.25, 2);
  add(temple, cyl(4.2, 4.2, 4.2, "#c9b89a", 24), 0, 2.6, -1.5);
  add(temple, cyl(4.4, 4.4, 0.3, "#b9ad98", 24), 0, 4.85, -1.5);
  const dome = add(temple, ball(4.1, "#8a8478", 24), 0, 4.9, -1.5); dome.scale.y = 0.62;
  for (let i = 1; i < 5; i++) add(temple, cyl(4.15 - i * 0.55, 4.15 - i * 0.55, 0.08, "#7a7468", 24), 0, 4.95 + i * 0.5, -1.5);
  const oculus = add(temple, cyl(0.7, 0.7, 0.2, "#f2e2b0", 16), 0, 7.45, -1.5);
  oculus.material = mat("#f2e2b0", { emissive: "#f2c46a", emissiveIntensity: 0.3 });
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { const c = add(temple, cyl(0.28, 0.32, 4.0, "#8f8a82", 12), -3.5 + i * 1.0, 2.5, 4.6 - r * 1.6); add(c, box(0.8, 0.22, 0.8, "#e9dcc3"), 0, 2.05, 0); }
  add(temple, box(8.4, 0.5, 4, "#d9ccb0"), 0, 4.75, 3.8);
  const tri = new THREE.Shape(); tri.moveTo(-4.4, 0); tri.lineTo(4.4, 0); tri.lineTo(0, 1.6); tri.closePath();
  const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.6, bevelEnabled: false }), mat("#e9dcc3")); ped.position.set(0, 5.0, 5.2); temple.add(ped);
  const gable = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 3.2, bevelEnabled: false }), mat("#d9ccb0")); gable.position.set(0, 5.0, 2.0); temple.add(gable);
  // the door stands open and the floor inside shows the disc of sun from the oculus: the always-on light
  for (const s of [-1, 1]) add(temple, box(1.1, 3.2, 0.12, "#4a3222"), s * 1.55, 2.1, 2.25).rotation.y = s * 0.5;
  add(temple, box(2.2, 3.2, 0.1, "#2a2420"), 0, 2.1, 2.1);
  const sun = add(temple, cyl(0.55, 0.55, 0.02, "#f7e6b0", 16), 0, 0.52, 1.2);
  sun.material = mat("#f7e6b0", { emissive: "#f2c46a", emissiveIntensity: 0.8 });
  // the fountain and the obelisk of the little square, off to one side of the steps
  // the pigeons on the front step: the subject
  const pigeons = add(g, new THREE.Group(), 0.2, 0.26, 2.5); pigeons.name = "it-pantheon-pigeons";
  const flock = Array.from({ length: 8 }, (_, i) => { const b = add(pigeons, bird("#8a8d96", 1.0), -0.6 + (i % 4) * 0.4, 0.02, -0.1 + Math.floor(i / 4) * 0.2); b.rotation.y = i * 0.8; return b; });
  // a water seller, a woman with a basket, a man reading and a carriage driver on the step
  const seller = add(g, own(resident("vendor", false)), -1.5, 0.225, 1.9) as Figure; seller.rotation.y = 0.6;
  add(g, ball(0.22, "#9c6a4a", 10), -1.15, 0.47, 1.85).scale.y = 1.2;
  const woman = add(g, own(resident("townswoman", false)), 1.4, 0.225, 2.2) as Figure; woman.rotation.y = -0.4;
  add(woman, cyl(0.22, 0.18, 0.16, "#c9a97a", 10), 0, 1.72, 0);
  const reader = add(g, own(resident("townsman", false)), 1.8, 0.225, 1.6) as Figure; reader.rotation.y = -0.8;
  const driver = add(g, own(resident("carter", false)), -1.1, 0.225, 1.4) as Figure; driver.rotation.y = 0.9;
  const pigeonRest = pigeons.position.clone();
  return life(g, "panteonIt", [seller, woman, reader, driver], (t, k) => {
    (oculus.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(t * 0.6) * 0.1;
    // 1. the pigeons lift off the step, wheel out in front of the columns and come down again
    const up = hold(k, 0.12, 0.84);
    pigeons.position.copy(pigeonRest);
    pigeons.position.y = pigeonRest.y + up * 1.3; pigeons.position.z = pigeonRest.z + up * 0.6;
    flock.forEach((b, i) => {
      b.position.y = 0.02 + up * Math.sin(t * 3 + i) * 0.22;
      b.rotation.y = i * 0.8 + up * t * 2;
      (b.userData.wings as THREE.Object3D[]).forEach((w, n) => { w.rotation.x = (n ? 1 : -1) * (up > 0.02 ? 0.3 + Math.sin(t * 20 + i) * 0.8 : 0.3); });
    });
    // 2. the disc of sun swings across the floor inside the open door, 3. the reader looks up from his paper
    sun.position.x = Math.sin(t * 0.3) * 0.4 + beat(k, 0.1, 0.9) * 0.6;
    upper(reader).rotation.x = -beat(k, 0.35, 1) * 0.3;
    upper(woman).rotation.y = beat(k, 0.45, 1) * 0.4;
  });
}

/**
 * The Mattatoio at Testaccio, opened around 1890: a long yellow-brick hall with iron trusses, and a covered hook
 * line along its front. A quarter moves down the rail on its trolley and the vaccinaro shoulders it off.
 */
export function mattatoio(): P {
  const g = group();
  // the hall: yellow brick, a row of round-headed windows, a low iron-truss roof
  add(g, box(5.6, 3.0, 2.0, "#d9b56a"), 0, 1.5, -1.8);
  for (let i = 0; i < 4; i++) { add(g, box(0.7, 1.3, 0.06, "#3a3733"), -1.95 + i * 1.3, 1.7, -0.78); add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 12, 1, false, 0, Math.PI), mat("#3a3733")), -1.95 + i * 1.3, 2.35, -0.78).rotation.set(Math.PI / 2, 0, 0); }
  for (let i = 0; i < 6; i++) add(g, box(0.1, 3.0, 0.12, "#c9a35a"), -2.6 + i * 1.04, 1.5, -0.78);
  const roofL = add(g, box(5.9, 0.08, 1.4, "#7a8686"), 0, 3.25, -2.3); roofL.rotation.x = 0.28;
  const roofR = add(g, box(5.9, 0.08, 1.4, "#7a8686"), 0, 3.25, -1.3); roofR.rotation.x = -0.28;
  void roofL; void roofR;
  // the covered hook line along the front: iron posts, the rail, an iron canopy above it
  for (const x of [-2.7, -0.9, 0.9, 2.7]) add(g, cyl(0.07, 0.09, 2.7, "#4a4f4f", 8), x, 1.35, 0.9);
  const canopy = add(g, box(5.9, 0.06, 1.9, "#8d9a99"), 0, 2.75, 0.2); canopy.rotation.x = -0.1;
  const beam = add(g, box(5.6, 0.12, 0.14, "#4a4f4f"), 0, 2.62, 0.9); beam.name = "front-beam";
  lamps(g, 2.62, 0.9, [-2.2, 2.2], 0.8);
  const rail = add(g, cyl(0.035, 0.035, 5.4, IT.iron, 6), 0, 2.2, 1.25); rail.rotation.z = Math.PI / 2;
  for (const x of [-2.7, -0.9, 0.9, 2.7]) add(g, box(0.06, 0.4, 0.06, IT.iron), x, 2.42, 1.08);
  // quarters hanging on the rail: the always-on sway, and the one that travels is the subject
  const hanging = [-2.3, -1.8, 2.3].map((x, i) => {
    const h = add(g, new THREE.Group(), x, 2.18, 1.25); h.userData.foodReaction = "sway";
    add(h, new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 4, 10, Math.PI * 1.3), mat(IT.iron)), 0, -0.08, 0).rotation.y = Math.PI / 2;
    add(h, cyl(0.2, 0.12, 0.9, i % 2 ? "#a8544a" : "#9c4a42", 10), 0, -0.6, 0);
    add(h, cyl(0.18, 0.18, 0.1, "#f1ece0", 10), 0, -0.2, 0);
    return h;
  });
  const quarter = add(g, new THREE.Group(), -1.0, 2.18, 1.25); quarter.name = "it-hook-quarter";
  add(quarter, box(0.14, 0.06, 0.1, IT.iron), 0, 0.04, 0);
  add(quarter, new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 4, 10, Math.PI * 1.3), mat(IT.iron)), 0, -0.08, 0).rotation.y = Math.PI / 2;
  add(quarter, cyl(0.26, 0.14, 1.05, "#a8544a", 12), 0, -0.68, 0);
  add(quarter, cyl(0.23, 0.23, 0.12, "#f1ece0", 12), 0, -0.22, 0);
  add(quarter, cyl(0.05, 0.05, 0.3, "#f1ece0", 6), 0, -1.26, 0);
  // the block, the scalding tub and the cart the fifth quarter leaves on
  add(g, cyl(0.4, 0.45, 0.8, "#8a6e46", 14), 2.0, 0.4, -0.2);
  add(g, cyl(0.45, 0.4, 0.6, IT.wood, 14), -2.3, 0.3, -0.2);
  const cart = add(g, box(1.2, 0.5, 0.8, "#6e4a2c"), 0.6, 0.55, -0.3); void cart;
  for (const s of [-1, 1]) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.04, 5, 14), mat("#5a4636")), 0.6, 0.35, -0.3 + s * 0.45);
  for (let i = 0; i < 4; i++) add(g, ball(0.12, i % 2 ? "#b86a5a" : "#d9a08a", 6), 0.3 + i * 0.2, 0.86, -0.3).scale.set(1.3, 0.6, 1);   // tripe and offal in the cart
  const vaccinaro = add(g, own(resident("vaccinaro")), 0.9, 0, 0.65) as Figure; vaccinaro.rotation.y = -1.2;
  arms(vaccinaro).right.rotation.x = -0.6; arms(vaccinaro).left.rotation.x = -0.6;
  const butcher = add(g, own(resident("vaccinaro", false)), 2.1, 0, 0.5) as Figure; butcher.rotation.y = -0.5;
  const clerk = add(g, own(resident("townsman", false)), -2.2, 0, 0.45) as Figure; clerk.rotation.y = 0.6;
  const quarterRest = quarter.position.clone();
  return life(g, "quintoQuarto", [vaccinaro, butcher, clerk], (t, k) => {
    hanging.forEach((h, i) => { h.rotation.z = Math.sin(t * 1.1 + i) * 0.04; });
    // 1. the quarter runs down the rail on its trolley and swings as it stops at the vaccinaro
    const run = hold(k, 0.30, 0.82), sw = beat(k, 0.26, 0.7);
    quarter.position.copy(quarterRest);
    quarter.position.x = quarterRest.x + run * 1.9;
    quarter.rotation.z = -sw * 0.35 + beat(k, 0.35, 0.9) * Math.sin(t * 6) * 0.08;
    // 2. the vaccinaro takes the weight on his shoulder, 3. the butcher at the block turns to watch
    arms(vaccinaro).right.rotation.x = -0.6 - run * 1.9; arms(vaccinaro).left.rotation.x = -0.6 - run * 1.6;
    upper(vaccinaro).rotation.z = run * 0.12;
    upper(butcher).rotation.y = beat(k, 0.45, 1) * -0.5;
  });
}

/**
 * The caffè on the piazza: a zinc-topped counter, a boiler that steams, and the ice pail — the sorbettiera — that is
 * turned by hand in its tub of salt and ice. The canister is turned, the paddle lifts out with the ice on it, the
 * machine steams, and a man at the counter drinks standing.
 */
export function gelateria(): P {
  const g = group();
  const b = bay(g, "romanPalazzo", 5.0, 3.0, 2.5, { sign: "Caffè", storeys: 2 });
  lamps(g, b.y, b.zFront, [-2.0, 2.0], 0.85);
  // the counter and the boiler on it: brass and copper, with the steam coming off the valve
  add(g, box(4.2, 0.1, 1.0, "#b9bdb8"), 0.2, 0.98, 1.5);
  for (const dx of [-1.8, 0.2, 2.2]) add(g, box(0.16, 0.94, 0.9, "#6e4a2c"), dx, 0.47, 1.5);
  const boiler = add(g, cyl(0.26, 0.28, 0.72, IT.copper, 14), 1.4, 1.39, 1.3);
  add(g, ball(0.26, IT.brass, 10), 1.4, 1.76, 1.3).scale.y = 0.5;
  add(g, cyl(0.03, 0.03, 0.2, IT.brass, 6), 1.4, 1.95, 1.3);
  for (const s of [-1, 1]) add(g, cyl(0.03, 0.03, 0.18, IT.brass, 6), 1.4 + s * 0.2, 1.2, 1.55).rotation.x = Math.PI / 2;
  void boiler;
  for (let i = 0; i < 5; i++) add(g, cyl(0.045, 0.04, 0.07, "#f4f1ea", 10), -1.2 + i * 0.22, 1.07, 1.3);
  for (let i = 0; i < 3; i++) add(g, cyl(0.07, 0.06, 0.02, "#f4f1ea", 10), -1.2 + i * 0.22, 1.04, 1.7);
  const cup = add(g, cyl(0.045, 0.04, 0.07, "#f4f1ea", 10), 0.6, 1.07, 1.75); cup.userData.foodReaction = "hop";
  for (let i = 0; i < 4; i++) add(g, cyl(0.06, 0.08, 0.28, i % 2 ? "#3f5a3a" : "#5a3b2a", 8), -1.7 + i * 0.2, 1.17, 1.15);
  // the sorbettiera: a wooden tub of ice and salt with the tin canister turning in it, at the front of the counter
  const tub = add(g, cyl(0.34, 0.3, 0.52, IT.wood, 14), -0.55, 0.26, 2.35);
  for (let i = 0; i < 3; i++) add(g, new THREE.Mesh(new THREE.TorusGeometry(0.335, 0.02, 4, 14), mat(IT.iron)), -0.55, 0.08 + i * 0.18, 2.35).rotation.x = Math.PI / 2;
  for (let i = 0; i < 8; i++) add(g, box(0.07, 0.05, 0.07, "#e8f0f2"), -0.55 + Math.cos(i * 0.8) * 0.26, 0.54, 2.35 + Math.sin(i * 0.8) * 0.26);
  void tub;
  const canister = add(g, new THREE.Group(), -0.55, 0.52, 2.35);
  add(canister, cyl(0.17, 0.17, 0.46, "#c8ccd0", 14), 0, 0.1, 0);
  add(canister, cyl(0.03, 0.03, 0.12, "#c8ccd0", 6), 0, 0.38, 0);
  const handle = add(canister, box(0.3, 0.03, 0.03, IT.iron), 0.15, 0.44, 0); void handle;
  const paddle = add(g, new THREE.Group(), -0.55, 0.9, 2.35); paddle.name = "it-ice-paddle";
  add(paddle, cyl(0.014, 0.014, 0.5, "#c9a37a", 5), 0, 0.12, 0);
  add(paddle, box(0.14, 0.18, 0.02, "#c8ccd0"), 0, -0.15, 0);
  const ice = add(paddle, ball(0.09, "#f2e8d8", 8), 0, -0.1, 0.03); ice.scale.set(1.2, 0.8, 0.6);
  // two small tables to the sides, and the people: the barman, a man drinking standing, a woman at a table, a boy
  const barman = add(g, own(resident("oste")), 0.4, 0.08, 0.6) as Figure; barman.rotation.y = 0;
  arms(barman).right.rotation.x = -0.9;
  const turner = add(g, own(resident("server", false)), -1.3, 0.08, 1.5) as Figure; turner.rotation.y = 1.0;
  arms(turner).right.rotation.x = -1.2;
  const drinker = add(g, own(resident("townsman", false)), 2.6, 0, 1.4) as Figure; drinker.rotation.y = -1.6;
  arms(drinker).right.rotation.x = -1.6;
  add(arms(drinker).right, cyl(0.045, 0.04, 0.07, "#f4f1ea", 10), 0, arms(drinker).hand - 0.02, 0.05);
  table(g, -2.3, 0.3, 0.8, 0.8, "#b9bdb8", 0.72);
  const sitter = sit(g, -2.3, -0.3, 0, "townswoman", 0.44);
  const boy = add(g, own(resident("child")), 1.8, 0, 2.0) as Figure; boy.rotation.y = -2.4;
  const walker = resident("server", false); add(g, walker, -1.8, 0.08, -0.6);
  const walk = pacer(walker, V(-1.8, 0.08, -0.6), V(1.8, 0.08, -0.6), 0.26, 0.9);
  g.userData.steam = V(1.4, 2.1, 1.3);
  const paddleRest = paddle.position.clone();
  return life(g, "gelateria", [turner, drinker, barman, sitter, boy, walker], (t, k) => {
    canister.rotation.y = t * 0.7 + (k > 0 ? (1 - k) * 9 : 0);
    // 1. the paddle comes up out of the canister with the ice on it and turns, 2. the turner's arm follows
    const lift = hold(k, 0.2, 0.84);
    paddle.position.copy(paddleRest);
    paddle.position.y = paddleRest.y + lift * 0.5; paddle.position.z = paddleRest.z + lift * 0.08;
    paddle.rotation.y = lift * 1.6; paddle.rotation.z = lift * 0.3;
    arms(turner).right.rotation.x = -1.2 - beat(k, 0, 0.8) * 0.6;
    // 3. the man at the counter drinks, and the boy leans in to the pail
    arms(drinker).right.rotation.x = -1.6 - beat(k, 0.45, 1) * 0.6;
    upper(boy).rotation.x = beat(k, 0.5, 1) * 0.25;
    walk(t);
  });
}

/**
 * The Rialto: the single stone arch over the Grand Canal with the shops along its deck. The stand is the one
 * object on this table that stands in water. On the click the front shop's shutter swings open and the goods
 * come out, and a gondola passes under the arch.
 */
export function rialtoBridge(): P {
  const g = group();
  const span = 5.2, rise = 1.4, width = 3.2;
  // the arch and the stepped deck, the span running along z as IT-R7 does
  const arch = new THREE.Mesh(new THREE.TorusGeometry(span / 2, 0.36, 8, 22, Math.PI), mat("#e6dcc6"));
  arch.scale.set(1, rise / (span / 2), 1); arch.rotation.y = Math.PI / 2;
  for (const x of [-width / 2 + 0.2, width / 2 - 0.2]) { const a = arch.clone(); a.position.x = x; g.add(a); }
  add(g, box(width, 0.3, 1.0, "#e6dcc6"), 0, rise + 0.2, 0);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) add(g, box(width, 0.18, 0.42, i % 2 ? "#e6dcc6" : "#ded3b6"), 0, rise + 0.14 - i * 0.24, s * (0.7 + i * 0.4));
  for (const s of [-1, 1]) add(g, box(width + 0.4, 0.9, 1.2, "#d9ccb0"), 0, 0.45, s * (span / 2 + 0.3));
  for (const x of [-width / 2, width / 2]) for (let i = 0; i < 7; i++) add(g, box(0.06, 0.34, 0.06, "#d9ccb0"), x, rise + 0.52 - Math.abs(i - 3) * 0.24, -1.8 + i * 0.6);
  // the two rows of shops on the deck, arched fronts, one lead roof over each row
  for (const s of [-1, 1]) {
    add(g, box(0.9, 1.1, 2.4, "#efe4cc"), s * 1.05, rise + 0.9, 0);
    add(g, box(1.0, 0.1, 2.6, "#8d9a99"), s * 1.05, rise + 1.5, 0).rotation.z = -s * 0.2;
    for (let i = 0; i < 3; i++) add(g, box(0.05, 0.6, 0.55, "#5a3b2a"), s * 0.58, rise + 0.75, -0.8 + i * 0.8);
  }
  add(g, box(1.4, 0.16, 0.6, "#efe4cc"), 0, rise + 1.7, 0);
  // the front shop's shutter: the subject, hinged at its side, at the top of the steps on the arrival side
  const shutter = add(g, new THREE.Group(), -0.6, rise + 0.75, 1.24); shutter.name = "it-rialto-shutters";
  add(shutter, box(0.5, 0.62, 0.05, "#3f6b4a"), 0.25, 0, 0);
  for (let i = 0; i < 4; i++) add(shutter, box(0.46, 0.02, 0.06, "#2f5232"), 0.25, -0.24 + i * 0.16, 0.01);
  add(g, box(0.5, 0.62, 0.05, "#3f6b4a"), 0.85, rise + 0.75, 1.24);
  const goods = add(g, new THREE.Group(), -0.35, rise + 0.52, 1.35);
  for (let i = 0; i < 4; i++) add(goods, box(0.12, 0.08, 0.1, ["#c9a06a", "#8e2a22", "#f1e6d0", "#3f6b8f"][i]), -0.18 + i * 0.12, 0, 0);
  goods.scale.setScalar(0.001);
  // the gondola in the canal under the arch, travelling across it
  const boat = add(g, gondola(), -2.2, 0, 0); boat.rotation.y = 0;
  // the people: two on the steps, a shopkeeper, a porter
  const shopkeeper = add(g, own(resident("vendor", false)), -1.0, rise + 0.2, 0.7) as Figure; shopkeeper.rotation.y = 0.4;
  const porter = add(g, own(resident("porter", false)), 1.0, rise - 0.15, 1.0) as Figure; porter.rotation.y = Math.PI;
  add(porter, cyl(0.24, 0.2, 0.18, "#c9a97a", 10), 0, 1.72, 0);
  const woman = add(g, own(resident("fishwife", false)), -0.9, rise - 0.6, -2.0) as Figure; woman.rotation.y = 0;
  return life(g, "rialtoIt", [shopkeeper, porter, woman], (t, k) => {
    // the gondola crosses under the arch and back, always
    const u = (t * 0.07) % 2, x = u < 1 ? -2.2 + u * 4.4 : 2.2 - (u - 1) * 4.4;
    boat.position.x = x; boat.rotation.y = u < 1 ? 0 : Math.PI; boat.position.z = Math.sin(t * 0.3) * 0.12;
    // 1. the shutter swings open on its hinge and the goods come out onto the sill
    const open = hold(k, 0.18, 0.84);
    shutter.rotation.y = -open * 1.5;
    goods.scale.setScalar(Math.max(0.001, open));
    // 2. the shopkeeper steps to the door, 3. the porter on the steps turns round
    upper(shopkeeper).rotation.y = 0.4 + beat(k, 0.3, 1) * 0.5;
    arms(shopkeeper).right.rotation.x = -beat(k, 0.2, 0.8) * 1.0;
    upper(porter).rotation.y = beat(k, 0.45, 1) * 0.8;
  });
}

/**
 * St Mark's campanile, as it stood until it fell on 14 July 1902: a brick shaft, the open belfry, the pyramid spire
 * and the angel. The tower is drawn short enough that its bells sit inside the arrival camera's frame. On the click
 * the bells swing and the whole tower leans a fraction, which is what it did before it came down.
 */
export function campanile(): P {
  const g = group();
  const tower = add(g, new THREE.Group(), 0, 0, -1.6);
  add(tower, box(1.9, 2.9, 1.9, "#b8654a"), 0, 1.45, 0);
  for (const s of [-1, 1]) for (const f of [-1, 1]) add(tower, box(0.2, 2.9, 0.08, "#a5553e"), s * 0.5, 1.45, f * 0.96);
  add(tower, box(2.1, 0.16, 2.1, IT.venCream), 0, 2.95, 0);
  // the belfry: corner piers and one wide opening on each face, so the bells are seen through it
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(tower, box(0.28, 1.1, 0.28, IT.venCream), sx * 0.83, 3.58, sz * 0.83);
  add(tower, box(2.1, 0.2, 2.1, IT.venCream), 0, 4.22, 0);
  add(tower, box(1.8, 0.7, 1.8, "#b8654a"), 0, 4.67, 0);
  for (const s of [-1, 1]) add(tower, cyl(0.26, 0.26, 0.05, IT.venCream, 12), s * 0.4, 4.67, 0.91).rotation.x = Math.PI / 2;
  add(tower, cone(1.3, 1.6, "#3f7a5a", 4), 0, 5.8, 0).rotation.y = Math.PI / 4;
  add(tower, ball(0.12, C.gold, 8), 0, 6.7, 0);
  add(tower, box(0.05, 0.4, 0.2, C.gold), 0, 6.95, 0);
  // the bells: the big one at the front is the named subject; they hang from the belfry's beam
  add(tower, box(1.5, 0.1, 0.1, "#5a3b2a"), 0, 4.05, 0.72);
  add(tower, box(1.5, 0.1, 0.1, "#5a3b2a"), 0, 4.05, -0.3);
  const bellAt = (x: number, z: number, s: number) => {
    const pivot = add(tower, new THREE.Group(), x, 4.0, z);
    add(pivot, cyl(0.02, 0.02, 0.1, IT.iron, 4), 0, -0.05, 0);
    add(pivot, cone(0.24 * s, 0.42 * s, "#8a6a2a", 12), 0, -0.3 * s, 0);
    add(pivot, ball(0.06 * s, "#5a4a1a", 6), 0, -0.52 * s, 0);
    return pivot;
  };
  const bell = bellAt(0, 0.72, 1.1); bell.name = "it-campanile-bell";
  const bells = [bellAt(-0.45, -0.3, 0.8), bellAt(0.45, -0.3, 0.8)];
  // the loggetta at the foot, low, and the piazzetta's people
  const loggetta = add(g, new THREE.Group(), 0, 0, 0.1);
  add(loggetta, box(3.0, 1.4, 0.9, "#e6d7c0"), 0, 0.7, 0);
  for (let i = 0; i < 4; i++) add(loggetta, cyl(0.1, 0.1, 1.2, "#c9a0a0", 8), -1.2 + i * 0.8, 0.6, 0.5);
  add(loggetta, box(3.2, 0.14, 1.1, IT.venCream), 0, 1.45, 0.05);
  for (let i = 0; i < 12; i++) { const p = add(g, bird("#8a8d96", 0.9), -1.8 + rnd() * 3.6, 0.05, 0.9 + rnd() * 1.4); p.rotation.y = rnd() * 6; }
  const priest = add(g, own(resident("priest", false)), -1.9, 0, 0.9) as Figure; priest.rotation.y = 0.4;
  const woman = add(g, own(resident("fishwife", false)), 1.8, 0, 1.2) as Figure; woman.rotation.y = -0.5;
  const porter = add(g, own(resident("porter", false)), 2.1, 0, -0.2) as Figure; porter.rotation.y = -0.9;
  return life(g, "campanileIt", [priest, woman, porter], (t, k) => {
    // 1. the bells swing, the big one first, 2. the tower leans a fraction and settles
    const ring = hold(k, 0.08, 0.86);
    bell.rotation.x = ring * Math.sin(t * 5.5) * 0.55 + ring * 0.35;
    bells.forEach((b, i) => { b.rotation.x = beat(k, 0.1 + i * 0.05, 0.95) * Math.sin(t * 6.2 + i) * 0.5; });
    tower.rotation.z = beat(k, 0.15, 0.95) * 0.012;
    // 3. the piazzetta looks up
    upper(priest).rotation.x = -beat(k, 0.3, 1) * 0.3;
    upper(woman).rotation.x = -beat(k, 0.35, 1) * 0.3;
  });
}

/**
 * Etna from the coast: a broad cone of basalt with the snow line and the snow pits cut into its flank, drawn low
 * enough that its summit and plume sit inside the arrival frame. The plume tilts off the summit on the click and
 * the snow cutters on the flank straighten to look.
 */
export function etna(): P {
  const g = group();
  const Rb = 3.4, H = 2.7;
  const geo = new THREE.ConeGeometry(Rb, H, 18, 6);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const snow = new THREE.Color("#f2f0ea"), dark = new THREE.Color(IT.lava), mid = new THREE.Color("#6b5a55"), green = new THREE.Color("#6f9b57");
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), f = (y + H / 2) / H;
    if (f < 0.999 && f > 0.001) { const kx = 1 + Math.sin(i * 12.9) * 0.05; pos.setX(i, pos.getX(i) * kx); pos.setZ(i, pos.getZ(i) * kx); }
    const c = f > 0.8 ? snow.clone() : f > 0.45 ? mid.clone().lerp(dark, (f - 0.45) / 0.35) : green.clone().lerp(mid, f / 0.45);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); geo.computeVertexNormals();
  const cone = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })); cone.position.y = H / 2; g.add(cone);
  add(g, cyl(0.45, 0.6, 0.3, "#2a2528", 12), 0, H - 0.08, 0);
  const glow = add(g, cyl(0.36, 0.36, 0.05, "#ff6a2a", 12), 0, H + 0.08, 0);
  glow.material = mat("#ff6a2a", { emissive: "#ff4a1a", emissiveIntensity: 0.5 });
  const onFlank = (r: number, a: number) => V(Math.sin(a) * r, H * (1 - r / Rb), Math.cos(a) * r);
  // the snow pits cut into the flank, the stone walls of the terraces and the prickly pear below
  for (let i = 0; i < 5; i++) { const p = onFlank(1.4 + (i % 2) * 0.25, -0.6 + i * 0.3); add(g, box(0.3, 0.1, 0.3, "#3a3530"), p.x, p.y + 0.02, p.z).rotation.y = -0.6 + i * 0.3; add(g, box(0.24, 0.05, 0.24, "#f2f0ea"), p.x, p.y + 0.07, p.z).rotation.y = -0.6 + i * 0.3; }
  for (let i = 0; i < 10; i++) { const p = onFlank(2.9, -1.2 + i * 0.26); add(g, box(0.36, 0.2, 0.2, IT.lavaLight), p.x, p.y + 0.08, p.z).rotation.y = -1.2 + i * 0.26; }
  for (let i = 0; i < 5; i++) { const p = onFlank(3.2, -0.9 + i * 0.45); add(g, pricklyPear(), p.x, p.y, p.z).scale.setScalar(0.7); }
  // the plume: the subject, puffs over the summit that drift always and tilt on the click
  const plume = add(g, new THREE.Group(), 0, H + 0.15, 0); plume.name = "it-etna-plume";
  const puffs = Array.from({ length: 7 }, (_, i) => { const p = add(plume, ball(0.2 + i * 0.03, "#d9d4cc", 8), 0, 0.15 + i * 0.1, 0); (p.material as THREE.MeshStandardMaterial).transparent = true; (p.material as THREE.MeshStandardMaterial).opacity = 0.85 - i * 0.07; return p; });
  g.userData.smoke = V(0, H + 0.4, 0);
  // the snow cutters on the flank with their baskets, and the muleteer lower down
  const at = onFlank(1.6, 0.35), at2 = onFlank(2.0, -0.3), at3 = onFlank(3.0, 0.8);
  const cutter = add(g, own(resident("worker")), at.x, at.y, at.z) as Figure; cutter.rotation.y = 0.25;
  upper(cutter).rotation.x = 0.4; arms(cutter).right.rotation.x = -1.4;
  const cutter2 = add(g, own(resident("worker", false)), at2.x, at2.y, at2.z) as Figure; cutter2.rotation.y = -0.2;
  add(cutter2, cyl(0.22, 0.18, 0.2, "#c9a97a", 10), 0, 1.72, 0);
  const muleteer = add(g, own(resident("carter", false)), at3.x, at3.y, at3.z) as Figure; muleteer.rotation.y = 0.5;
  const plumeRest = plume.position.clone();
  return life(g, "etnaIt", [cutter, cutter2, muleteer], (t, k) => {
    (glow.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.25 + beat(k, 0, 0.6) * 0.6;
    puffs.forEach((p, i) => { p.position.x = Math.sin(t * 0.4 + i) * 0.08 + i * 0.05; p.scale.setScalar(1 + Math.sin(t * 0.8 + i) * 0.06); });
    // 1. the plume tilts off the summit and swells, 2. the cutters straighten and look up
    const tilt = hold(k, 0.18, 0.86);
    plume.position.copy(plumeRest); plume.position.x = plumeRest.x + tilt * 0.35;
    plume.rotation.z = -tilt * 0.55; plume.scale.setScalar(1 + tilt * 0.15);
    upper(cutter).rotation.x = 0.4 - beat(k, 0.3, 1) * 0.6;
    upper(cutter2).rotation.x = -beat(k, 0.35, 1) * 0.25;
  });
}

/**
 * The Sicilian painted cart: two tall wheels, a high box body with painted panels, a carved frame, a mule with a
 * plumed headstall. On the click the mule leans into the shafts, the cart rolls a length and the panels catch
 * the light; then it rolls back to its place at the lane's end.
 */
export function carretto(): P {
  const g = group();
  const cart = add(g, new THREE.Group(), 0, 0, 0.2); cart.name = "it-carretto-body";
  const panels: THREE.Mesh[] = [];
  add(cart, box(1.9, 0.12, 1.0, "#e0a52c"), 0, 0.95, 0);
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    const pnl = add(cart, box(0.58, 0.4, 0.04, ["#c0392b", "#3f6b8f", "#e0a52c"][i]), -0.62 + i * 0.62, 1.22, s * 0.5);
    pnl.material = mat(["#c0392b", "#3f6b8f", "#e0a52c"][i], { emissive: "#ffffff", emissiveIntensity: 0 });
    panels.push(pnl);
    add(cart, box(0.3, 0.2, 0.05, "#f1e6d0"), -0.62 + i * 0.62, 1.22, s * 0.52);
  }
  for (const s of [-1, 1]) add(cart, box(1.95, 0.06, 0.06, "#e0a52c"), 0, 1.44, s * 0.5);
  add(cart, box(0.06, 0.4, 1.0, "#c0392b"), -0.95, 1.22, 0);
  const wheels = [-1, 1].map((s) => {
    const w = add(cart, new THREE.Group(), 0, 0.72, s * 0.66);
    add(w, new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 6, 18), mat("#c0392b")), 0, 0, 0);
    for (let i = 0; i < 12; i++) add(w, cyl(0.02, 0.02, 1.34, "#e0a52c", 4), 0, 0, 0).rotation.z = (i * Math.PI) / 12;
    add(w, cyl(0.12, 0.12, 0.14, "#3f6b8f", 8), 0, 0, 0).rotation.x = Math.PI / 2;
    return w;
  });
  add(cart, cyl(0.04, 0.04, 1.4, IT.iron, 6), 0, 0.72, 0).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) add(cart, cyl(0.035, 0.045, 2.2, "#e0a52c", 6), 1.6, 0.95, s * 0.4).rotation.z = 1.5;
  const { mule: m, head } = mule(cart, 2.9, 0, 0);
  add(head, cone(0.06, 0.34, "#c0392b", 6), 0, 0.28, 0);                                      // the plume on the headstall
  for (let i = 0; i < 3; i++) add(head, ball(0.04, ["#e0a52c", "#3f6b8f", "#f1e6d0"][i], 5), -0.05 + i * 0.05, 0.14, 0.12);
  for (let i = 0; i < 4; i++) add(cart, cyl(0.16, 0.13, 0.3, "#c9a97a", 10), -0.6 + i * 0.4, 1.16, 0);   // the load of baskets
  // the people: the carter walking at the mule's head on the far side, a woman and a boy by the wall
  const carter = add(g, own(resident("carter")), 2.4, 0, -0.7) as Figure; carter.rotation.y = Math.PI / 2;
  arms(carter).right.rotation.x = -0.9;
  const woman = add(g, own(resident("townswoman", false)), -1.4, 0, -1.4) as Figure; woman.rotation.y = 0.6;
  const boy = add(g, own(resident("child")), -0.4, 0, -1.6) as Figure; boy.rotation.y = 0.2;
  for (let i = 0; i < 6; i++) add(g, box(0.45, 0.3, 0.3, IT.tufa), -2.2 + i * 0.9, 0.15, -2.6);
  const cartRest = cart.position.clone();
  return life(g, "carrettoIt", [carter, woman, boy], (t, k) => {
    head.rotation.z = Math.sin(t * 0.9) * 0.05;
    // 1. the mule leans in, the cart rolls a length forward and back, and the panels catch the light
    const roll = hold(k, 0.26, 0.78), lean = beat(k, 0, 0.4);
    cart.position.copy(cartRest); cart.position.x = cartRest.x + roll * 0.9;
    wheels.forEach((w) => { w.rotation.z = -roll * 0.9 / 0.7; });
    m.rotation.z = -lean * 0.12;
    panels.forEach((p, i) => { (p.material as THREE.MeshStandardMaterial).emissiveIntensity = beat(k, 0.2 + (i % 3) * 0.06, 0.9) * 0.5; });
    // 2. the carter's arm follows the bridle, 3. the boy by the wall looks round
    arms(carter).right.rotation.x = -0.9 - lean * 0.4;
    upper(boy).rotation.y = beat(k, 0.45, 1) * 0.5;
  });
}

// ---------- the maps ----------

/**
 * One builder per `prop` name in the object list of docs/italy-world.md: thirteen rooms, fifteen ingredient and
 * flavour stops, eight landmarks and card-only places. The ten hit-only children carry `prop: "none"` and are drawn
 * by their parents: the five Roman stalls stand in `italyMarket`'s horseshoe, the three Sicilian ones behind
 * `sicilyMarket`, `trattoria` sits on `ragu`'s trattoria and `pizzeria` on `oven`'s forno.
 */
const BUILDERS: Record<string, () => P> = {
  trattoria, italyMarket, pastaWorkshop, pizzeria, dairy, fishMarket, bacaro, buranoKitchen, venetoFarm, friggitoria, sicilyMarket, pasticceria, tonnara,
  carciofaia, sheepFold, oliveGrove, wineCart, cow: oxYard, chicken: henYard, porciniWood, herbGarden, valliPesca, riceFieldItaly, wheatLatifondo, tomatoField, citrusGrove, almondGrove, caperTerrace,
  colosseum, pantheon, mattatoio, gelateria, rialtoBridge, campanile, etna, carretto,
};
export const ITALY_PROPS: Record<string, () => P> = Object.fromEntries(Object.entries(BUILDERS).map(([prop, build]) => [prop, () => facing(prop, build())]));

/**
 * Card badges. The thirteen room objects each get a small modelled dish, the hero of the room; the card shows its
 * painted card art first, so these are the fallback and the snapshot a card uses before the art loads. The
 * ingredient keys `ui.ts` already looks up by id (`tomato`, `olive`, `basil` and the rest) keep a badge too.
 */
const plate = (g: THREE.Object3D, r = 0.42) => add(g, cyl(r, r * 0.9, 0.06, IT.lime, 16), 0, 0.03, 0);
export const ITALY_ICONS: Record<string, () => P> = {
  ragu: () => { const g = group(); add(g, cyl(0.42, 0.36, 0.4, IT.copper, 16), 0, 0.2, 0); add(g, cyl(0.38, 0.38, 0.04, "#8e3b2a", 16), 0, 0.4, 0); for (let i = 0; i < 6; i++) add(g, ball(0.08, "#6b3a2a", 6), Math.cos(i) * 0.2, 0.44, Math.sin(i) * 0.2); return g; },
  romeMarket: () => { const g = group(); for (let i = 0; i < 3; i++) { const a = add(g, ball(0.2, IT.artichoke, 9), -0.36 + i * 0.36, 0.22, (i % 2) * 0.1); a.scale.set(0.9, 1.15, 0.9); add(g, cyl(0.04, 0.05, 0.2, IT.greens, 5), -0.36 + i * 0.36, 0.02, (i % 2) * 0.1); } return g; },
  pasta: () => { const g = group(); add(g, box(1.2, 0.05, 0.8, "#e2cfa4"), 0, 0.02, 0); for (let i = 0; i < 9; i++) add(g, box(0.9, 0.02, 0.05, "#f0dfb4"), 0, 0.07 + (i % 2) * 0.02, -0.28 + i * 0.07).rotation.y = (i % 3 - 1) * 0.08; return g; },
  oven: () => { const g = group(); add(g, box(1.3, 0.04, 0.5, "#c9a37a"), 0, 0.02, 0); add(g, box(1.1, 0.06, 0.4, "#efe0b4"), 0, 0.07, 0); for (let i = 0; i < 8; i++) add(g, ball(0.035, "#f4efe0", 5), -0.45 + i * 0.13, 0.11, (i % 2 - 0.5) * 0.18).scale.y = 0.5; return g; },
  cheese: () => { const g = group(); add(g, cyl(0.38, 0.38, 0.3, "#efe2c0", 16), -0.15, 0.15, 0); for (let i = 0; i < 4; i++) add(g, box(0.18, 0.12, 0.18, IT.curd), 0.35 + (i % 2) * 0.2, 0.06, -0.1 + Math.floor(i / 2) * 0.2); return g; },
  seafood: () => { const g = group(); add(g, box(1.3, 0.08, 0.8, IT.marble), 0, 0.04, 0); for (let i = 0; i < 6; i++) { const f = add(g, ball(0.06, IT.sardine, 7), -0.45 + i * 0.18, 0.12, (i % 2 - 0.5) * 0.3); f.scale.set(3, 0.6, 0.9); } return g; },
  bacaro: () => { const g = group(); add(g, cyl(0.1, 0.08, 0.2, "#e2e6e2", 12), 0.3, 0.1, 0); add(g, cyl(0.09, 0.07, 0.14, IT.wineRed, 12), 0.3, 0.08, 0); plate(g, 0.3).position.x = -0.25; for (let i = 0; i < 3; i++) add(g, ball(0.06, IT.sardine, 6), -0.35 + i * 0.1, 0.09, 0).scale.set(2, 0.6, 0.9); return g; },
  lagunaIt: () => { const g = group(); plate(g); for (let i = 0; i < 3; i++) { const c = add(g, ball(0.15, "#c98a4a", 8), -0.25 + i * 0.25, 0.12, (i % 2) * 0.1); c.scale.set(1.3, 0.5, 1); } return g; },
  casaVeneta: () => { const g = group(); add(g, cyl(0.45, 0.45, 0.05, IT.wood, 16), 0, 0.025, 0); add(g, cyl(0.36, 0.36, 0.16, "#e6b845", 16), 0, 0.13, 0); return g; },
  friggitoria: () => { const g = group(); for (let i = 0; i < 4; i++) add(g, box(0.28, 0.05, 0.26, "#e3cf8e"), -0.2 + (i % 2) * 0.32, 0.03 + Math.floor(i / 2) * 0.05, -0.15 + Math.floor(i / 2) * 0.3).rotation.y = i * 0.2; add(g, ball(0.16, "#d9a55b", 8), 0.45, 0.14, 0.2).scale.set(1.2, 0.8, 1); return g; },
  sicilyMarket: () => { const g = group(); add(g, cyl(0.42, 0.42, 0.08, "#e0b4a8", 16), 0, 0.04, 0); add(g, box(0.03, 0.09, 0.8, "#8a5a4a"), 0, 0.045, 0); add(g, cone(0.05, 0.7, "#6a7a86", 6), 0.6, 0.1, 0).rotation.z = -Math.PI / 2; return g; },
  pastry: () => { const g = group(); for (let i = 0; i < 2; i++) { const z = (i - 0.5) * 0.3; add(g, cyl(0.1, 0.1, 0.55, "#c98a4a", 10), 0, 0.12 + i * 0.05, z).rotation.z = Math.PI / 2; for (const s of [-1, 1]) { add(g, ball(0.1, "#f7f2e6", 8), s * 0.29, 0.12 + i * 0.05, z); add(g, ball(0.05, "#8fbf6a", 6), s * 0.36, 0.12 + i * 0.05, z); } } return g; },
  tonnaraIt: () => { const g = group(); add(g, cyl(0.2, 0.18, 0.8, IT.tuna, 12), 0, 0.2, 0).rotation.z = Math.PI / 2; for (let i = 0; i < 3; i++) add(g, cyl(0.14, 0.14, 0.1, "#c8ccd0", 12), -0.3 + i * 0.3, 0.05, 0.4); return g; },
  tomato: () => { const g = group(); for (let i = 0; i < 3; i++) { const t = add(g, ball(0.22, "#e0483a", 12), -0.3 + i * 0.3, 0.2, (i - 1) * 0.15); t.scale.y = 0.85; add(g, cone(0.06, 0.1, "#3f7a3a", 5), t.position.x, 0.42, t.position.z); } return g; },
  olive: () => { const g = group(); add(g, cyl(0.12, 0.14, 0.7, "#3f6b3f", 10), 0, 0.35, 0); add(g, cyl(0.06, 0.06, 0.06, "#c9a37a", 8), 0, 0.73, 0); for (let i = 0; i < 6; i++) add(g, ball(0.06, i % 2 ? "#2f3a2a" : "#6f9b57", 6), 0.35 + Math.cos(i) * 0.12, 0.06, Math.sin(i) * 0.15); return g; },
  basil: () => { const g = group(); add(g, cyl(0.16, 0.13, 0.22, "#c9603e", 9), 0, 0.11, 0); for (let i = 0; i < 7; i++) { const l = add(g, ball(0.11, i % 2 ? "#3f7a3a" : "#6f9b57", 6), Math.cos(i) * 0.14, 0.35 + (i % 3) * 0.08, Math.sin(i) * 0.14); l.scale.set(1, 0.4, 1.4); l.rotation.y = i; } return g; },
  italyBeef: () => { const g = group(); add(g, cyl(0.14, 0.1, 0.7, "#8e4b3a", 10), 0, 0.35, 0); add(g, box(0.5, 0.12, 0.3, "#f1e6d0"), 0.4, 0.06, 0.1); add(g, box(0.46, 0.04, 0.26, "#e9c4b4"), 0.4, 0.13, 0.1); return g; },
  italyChicken: () => { const g = group(); add(g, cyl(0.26, 0.2, 0.14, "#c9b06a", 12), 0, 0.07, 0); for (let i = 0; i < 4; i++) add(g, ball(0.08, "#f0e2c4", 7), Math.cos(i * 1.57) * 0.1, 0.16, Math.sin(i * 1.57) * 0.1).scale.y = 1.25; return g; },
  mushrooms: () => { const g = group(); for (const [x, z, r] of [[-0.25, 0, 0.3], [0.3, 0.1, 0.22]]) { add(g, cyl(r * 0.5, r * 0.55, 0.32, "#e7d9c3", 7), x, 0.16, z); add(g, ball(r, "#8a5a3c", 9), x, 0.36, z).scale.y = 0.65; } return g; },
  lemon: () => { const g = group(); for (let i = 0; i < 3; i++) { const l = add(g, ball(0.2, i === 1 ? IT.orange : IT.lemon, 12), -0.3 + i * 0.32, 0.2, (i - 1) * 0.12); l.scale.set(1, i === 1 ? 1 : 1.2, 1); } return g; },
  riceIt: () => { const g = group(); add(g, cyl(0.42, 0.28, 0.32, "#f7f2e6", 12), 0, 0.16, 0); add(g, ball(0.38, "#f4ecc8", 9), 0, 0.36, 0).scale.y = 0.45; return g; },
  gelateria: () => { const g = group(); add(g, cyl(0.28, 0.24, 0.4, IT.wood, 12), 0, 0.2, 0); add(g, cyl(0.14, 0.14, 0.34, "#c8ccd0", 12), 0, 0.5, 0); add(g, cyl(0.06, 0.05, 0.08, "#f4f1ea", 10), 0.45, 0.04, 0.2); return g; },
  "stall-arancini": () => { const g = group(); for (let i = 0; i < 3; i++) add(g, ball(0.16, "#e0a52c", 9), -0.3 + i * 0.3, 0.16, (i - 1) * 0.1).scale.y = 1.15; return g; },
};
