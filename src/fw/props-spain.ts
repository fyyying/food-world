/**
 * Spain stands: one stand function per object in docs/spain-world.md. Owned by the Stand maker.
 * Every main stand follows the hotpot table in docs/building-a-world.md section 5: a shelter from the region,
 * a visible work surface, modelled food, an always-on food loop, six to nine people with idle motion, a walker,
 * lamps under a beam, steam at every hot source, and a click chain that moves the food first and speaks last.
 * Buildings are local until spain-architecture.ts and spain-people.ts land; the palette follows research 1.3.
 */
import * as THREE from "three";
import { add, mat, rnd, wear, bubble, ambientChat, tickChildren, type P } from "./props";
import { citrusTree, oliveTree, cypress, umbrellaPine } from "./props-italy";
import { arcade, barraca, baserri, bodegaNave, horreo as horreoBody, ironMarketHall, manchaWindmillBody, spainHouse, type SpainStyle } from "./spain-architecture";
import { spainResident } from "./spain-people";

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

/** Palette from research 1.3; the Builder's SP constant carries the same names. */
export const ES = {
  cal: "#F3EDE2", piedra: "#D8C49A", granito: "#8E9299", teja: "#B4572F", pizarra: "#4A4F55", almagre: "#A4432B",
  castano: "#5A3B27", talavera: "#2E5C8A", albero: "#E0B45F", tierra: "#C2A473", oliva: "#6E7A4E", agua: "#2E7A96", ria: "#3F6B6B",
  ladrillo: "#A85D3F", hierro: "#2E2B2A", marmol: "#EDE7DA", vidrio: "#BFD7DC", lino: "#EFE6D2",
};

/** Ambient speech per object id, local language then English on one line. Room objects are verbatim from research 2.5. */
export const ES_LINES: Record<string, string[]> = {
  paellaEs: ["El foc, baix i llarg. Low fire, long fire.", "No remenes l'arròs! Don't stir the rice!", "Un dit d'arròs, no més. One finger of rice, no more.", "El garrofó, al principi. The garrofó goes in first.", "Sarment de vinya crema millor. Vine wood burns better.", "Escolta el socarrat. Listen for the socarrat.", "¡A comer, que se pasa! Come and eat, it won't wait!"],
  plancha: ["¿Qué te pongo? What can I get you?", "Una caña y unas bravas. A small beer and some bravas.", "Va por la casa. That one's on the house.", "¡Marchando dos! Two coming up!", "Deja el hueso en el plato. Leave the bone on the plate.", "Nos vamos a la siguiente. We're moving to the next bar."],
  jamonEs: ["Lonchas finas, casi transparentes. Thin slices, almost see-through.", "Contra la veta, siempre. Against the grain, always.", "Este viene de la dehesa. This one came off the dehesa.", "Tapa el corte con su tocino. Cover the cut with its own fat.", "El cuchillo, largo y flexible. The knife, long and flexible.", "Huele antes de comprar. Smell it before you buy."],
  tortillaEs: ["Con cebolla, siempre con cebolla. With onion, always with onion.", "Sin cebolla, que si no es puré. Without onion, or it turns to mush.", "Poco cuajada por dentro. Runny in the middle.", "Ahora el plato, y le damos la vuelta. Now the plate, and we turn it.", "La patata se pocha, no se fríe. The potato softens, it doesn't fry.", "Aceite bueno, que se nota. Good oil, you can tell."],
  churrosEs: ["Chocolate espeso, que el palo se tenga. Chocolate thick enough to hold the spoon.", "Porras para mí, churros para ti. Porras for me, churros for you.", "Recién hechos, quema. Straight out, it's hot.", "Una docena para casa. A dozen to take home.", "El aceite, limpio y muy caliente. The oil, clean and very hot.", "A las seis ya huele la calle. By six the street already smells of it."],
  pintxosEs: ["Bat gehiago, mesedez. One more, please.", "Oliba, antxoa eta piparra. Olive, anchovy and pickled pepper.", "Kontatu makilak. Count the sticks.", "Hurrengo tabernara goaz. On to the next bar.", "Antxoa Kantauri itsasokoa da. The anchovy is from the Cantabrian sea.", "On egin! Enjoy your food!"],
  gazpachoEs: ["Bien frío, del pozo. Really cold, from the well.", "Vinagre de Jerez, no otro. Sherry vinegar, no other.", "El pan, remojado primero. The bread goes in soaked first.", "A la sombra, que aprieta. Into the shade, it's fierce out.", "Con pepino y huevo aparte. With cucumber and egg on the side.", "Riega los geranios antes de comer. Water the geraniums before we eat."],
  pulpoEs: ["Asústao tres veces. Scare it three times.", "Corta coa tesoira, non co coitelo. Cut it with scissors, not a knife.", "Pemento doce ou picante? Sweet paprika or hot?", "O prato ten que ser de madeira. The plate has to be wooden.", "Cachelos debaixo. Potatoes underneath.", "Un viño do país. A glass of the local wine."],
  paTomaquet: ["Primer el tomàquet, després l'oli. Tomato first, then the oil.", "Pa de pagès, del d'ahir. Country bread, yesterday's.", "La sal al final. Salt at the end.", "No el piquis, sucal! Don't chop it, rub it!", "Amb pernil a sobre. With ham on top.", "Això és esmorzar, no dinar. This is breakfast, not lunch."],
  manchegoEs: ["Leche de oveja manchega, y nada más. Manchega sheep's milk, and nothing else.", "La pleita deja el dibujo. The esparto band leaves the pattern.", "La flor, arriba y abajo. The flower, top and bottom.", "Dale la vuelta cada semana. Turn it every week.", "El suero, al cubo. The whey goes in the bucket.", "Este ya lleva un año. This one is a year old."],
  sidreriaEs: ["Echa un culín. Pour a culín.", "Alza la botella, ho. Raise the bottle, come on.", "Bébelo d'un traigu. Drink it in one.", "Lo que sobra, al suelu. Whatever's left goes on the floor.", "La mazana ye d'esti añu. The apples are this year's.", "Puxa Asturies. Long live Asturias."],
  bodegaJerez: ["Saca de la solera, no de arriba. Draw from the solera, not from the top.", "El velo de flor está vivo. The film of flor is alive.", "Deja la bota a treinta arrobas. Fill the butt to thirty arrobas.", "Poniente esta tarde, bien. West wind this afternoon, good.", "Riega el albero. Water the sand floor.", "Un fino y una tapa. A fino and a tapa."],
  // Ingredient stops and landmarks: short working lines written by the Stand maker, not from the research.
  fishMed: ["¡Pescado fresco, de hoy! Fresh fish, today's!", "Gambas de la bahía. Prawns from the bay.", "Amarra bien la barca. Tie the boat up properly.", "Sardina para la parrilla. Sardines for the grill."],
  oranges: ["¡Naranjas dulces! Sweet oranges!", "Les taronges, a la caixa. Oranges into the crate.", "Almendra en flor, ya viene la primavera. Almond blossom, spring is coming.", "Taronja de la Ribera. Oranges from the Ribera."],
  oliveEs: ["La piedra muele despacio. The stone grinds slowly.", "Aceite del primer prensado. Oil from the first pressing.", "Arre, mula. Walk on, mule.", "No fuerces la prensa. Don't force the press."],
  albuferaRice: ["Aigua a l'arrossar. Water to the paddy.", "Arròs bomba, gra curt. Bomba rice, short grain.", "Obri la comporta. Open the sluice.", "El fang fins als genolls. Mud up to the knees."],
  huertaEs: ["Tomaques madures. Ripe tomatoes.", "Ferraura i garrofó, per a l'arròs. Flat beans and garrofó, for the rice.", "L'aigua de la séquia. Water from the channel.", "Rega abans que pegue el sol. Water before the sun hits."],
  azafranEs: ["La rosa se coge al alba. The flower is picked at dawn.", "Tres hebras por flor. Three threads per flower.", "El azafrán se tuesta despacio. Saffron is toasted slowly.", "Una rosa, tres hebras, nada más. One flower, three threads, no more."],
  dehesaEs: ["La montanera, de octubre a febrero. Acorn season, October to February.", "¡Bellotas! Acorns!", "Cerdo ibérico, pata negra. Iberian pig, black hoof.", "Encina y alcornoque. Holm oak and cork oak."],
  ovejaManchega: ["¡Ovejas, al aprisco! Sheep, into the fold!", "Beee. Baa.", "Leche para el queso. Milk for the cheese.", "Dos ordeños al día. Two milkings a day."],
  pimentonVera: ["Humo de encina, quince días. Oak smoke, fifteen days.", "Dulce, agridulce o picante. Sweet, bittersweet or hot.", "Dale la vuelta a los pimientos. Turn the peppers.", "El humo no se apaga de noche. The smoke does not go out at night."],
  pementoHerbon: ["Uns pican e outros non. Some are hot and some are not.", "Sal gorda por riba. Coarse salt on top.", "Pementos de Herbón, fritos. Herbón peppers, fried.", "Aceite ben quente. Really hot oil."],
  alhambraEs: ["El agua canta en la Alhambra. Water sings in the Alhambra.", "Mira los cipreses. Look at the cypresses.", "Sombra y agua. Shade and water.", "Los estanques miden el cielo. The pools measure the sky."],
  flamenco: ["¡Olé!", "Palmas, palmas. Clap, clap.", "Compás, compás. Keep the beat.", "Ahora por soleá. Now a soleá.", "Que salga del pecho. Let it come from the chest."],
  molinosMancha: ["¡Son molinos, no gigantes! They are windmills, not giants!", "Viento de levante. East wind.", "La harina, al saco. Flour into the sack.", "Las aspas piden viento. The sails are asking for wind."],
  gaudiEs: ["Trencadís, tros a tros. Trencadís, piece by piece.", "Seu una estona. Sit a while.", "La llum sobre el mosaic. Light on the mosaic.", "Cada tros ve d'un plat trencat. Every piece comes from a broken plate."],
};

// ---------- reaction machinery, copied from props-turkey.ts (module-private there) ----------

/** A sine pulse that runs between two points of the decaying reaction `k`. */
const beat = (k: number, start = 0, end = 1) => k > 0 ? Math.sin(Math.PI * clamp01(((1 - k) - start) / (end - start))) : 0;

function deferredBubble(targets: THREE.Object3D[], lines: string[], y: number, ms: number) {
  let delay = -1, n = 0;
  return {
    schedule() { delay = .28; },
    tick(dt: number) { if (delay < 0) return; delay -= dt; if (delay <= 0) { delay = -1; n++; bubble(targets[n % targets.length], lines[n % lines.length], y, ms); } },
  };
}

/**
 * The stand animates itself. Food tagged `userData.foodReaction` moves first, the worker (people[0]) follows,
 * one bystander (people[1]) acknowledges, speech comes last through a deferred bubble, then ambient chat.
 * The reaction decays over 3.5 s so the food beat is still readable when the 1.6-second approach arrives.
 */
function life(g: P, id: string, people: Figure[], work?: (t: number, k: number, dt: number) => void, onPoke?: () => void, speakers?: Figure[]) {
  g.userData.ownReaction = true;
  let reaction = 0;
  const lines = ES_LINES[id] ?? ["¡Hola! Hello!"];
  const food: { object: THREE.Object3D; position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }[] = [];
  g.traverse((o) => { if (o.userData.foodReaction) food.push({ object: o, position: o.position.clone(), rotation: o.rotation.clone(), scale: o.scale.clone() }); });
  const chat = ambientChat(g, lines);
  const speech = deferredBubble((speakers ?? people).length ? (speakers ?? people) : [g], lines, 1.45, 1800);
  g.userData.poke = () => { reaction = 1; onPoke?.(); speech.schedule(); };
  g.userData.tick = (t, dt) => {
    reaction = Math.max(0, reaction - dt * .285);
    // Residents from spain-people.ts pose themselves from the distance they moved; they run first so the stand's
    // own choreography below is what the visitor sees. Figures the stand drives have had that observer removed.
    tickChildren(g)(t, dt);
    people.forEach((p, i) => { if (p.userData.tick) return; const u = upper(p); if (!u) return; u.rotation.y = Math.sin(t * .45 + i) * .09; u.rotation.z = Math.sin(t * .7 + i) * .025; });
    food.forEach(({ object, position, rotation, scale }, i) => {
      const phase = clamp01((1 - reaction - (i % 3) * .09) / .73), pulse = reaction > 0 ? Math.sin(Math.PI * phase) : 0;
      object.position.copy(position); object.rotation.copy(rotation); object.scale.copy(scale);
      switch (object.userData.foodReaction) {
        case "hop": object.position.y += pulse * .34; object.rotation.y += pulse * .9; break;
        case "lift": object.position.y += pulse * .42; object.position.z += pulse * .12; object.rotation.x -= pulse * .42; break;
        case "puff": object.scale.y = scale.y * (1 + pulse * 1.4); object.position.y += pulse * .3; break;
        case "contents": object.scale.set(scale.x * (1 + pulse * .13), scale.y * (1 + pulse * .75), scale.z * (1 + pulse * .13)); object.position.y += pulse * .2; break;
        case "sway": object.rotation.z += pulse * .35; break;
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
        mesh.userData.harvestTarget = target.clone();
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

/** A thin liquid cylinder that connects a real spout to a real vessel; never a floating line. */
function stream(g: THREE.Object3D, name: string, color: string, radius = .03) {
  const mesh = add(g, new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.2, 1, 8), mat(color, { emissive: color, emissiveIntensity: .18, transparent: true, opacity: .92 })));
  mesh.name = name; mesh.visible = false;
  const up = V(0, 1, 0), dir = V(), mid = V();
  return {
    mesh,
    set(from: THREE.Vector3, to: THREE.Vector3, visible: boolean) {
      mesh.visible = visible; if (!visible) return;
      dir.subVectors(to, from); mesh.position.copy(mid.copy(from).add(to).multiplyScalar(.5));
      mesh.scale.set(1, Math.max(.02, dir.length()), 1); mesh.quaternion.setFromUnitVectors(up, dir.normalize());
    },
  };
}
/**
 * A falling column of liquid between a real spout and a real vessel. The model is one unit tall, hanging from
 * its own origin, so the group's y scale is the real height of the fall and the segments never change thickness:
 * three lengths that thin as the fall stretches them, and a break where the column meets the vessel. It reads as
 * falling liquid rather than a rod only while the spout stands over the vessel, which `pourFall` asserts by
 * keeping the lean under a quarter of the drop.
 */
function pourFall(g: THREE.Object3D, name: string, color: string, radius = .03, segs = 3) {
  const col = add(g, new THREE.Group(), 0, 0, 0);
  col.name = name; col.visible = false;
  const skin = { emissive: color, emissiveIntensity: .18, transparent: true, opacity: .92 };
  for (let i = 0; i < segs; i++) {
    const r = radius * (1 - i * .16), h = .96 / segs;
    add(col, new THREE.Mesh(new THREE.CylinderGeometry(r, r * .86, h, 8), mat(color, skin)), 0, -(i + .5) / segs, 0);
  }
  // the head of the fall, where the liquid gathers before it leaves the spout, and the tail that breaks at the lip
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
/** Rings that open where a falling liquid lands, on a surface or in a glass. */
function splashRings(g: THREE.Object3D, n: number, x: number, y: number, z: number, r: number, color: string) {
  return Array.from({ length: n }, (_, i) => {
    const m = add(g, new THREE.Mesh(new THREE.TorusGeometry(r, r * .2, 5, 12), mat(color, { transparent: true, opacity: .8 })), x + Math.cos(i * 1.3) * r * 2, y, z + Math.sin(i * 1.3) * r * 2);
    m.rotation.x = Math.PI / 2; m.visible = false; return m;
  });
}
/** World-space point of a local offset on a tilted object, expressed in the stand's space. */
function tipOf(obj: THREE.Object3D, local: THREE.Vector3, out: THREE.Vector3) { return out.copy(local).applyQuaternion(obj.quaternion).add(obj.position); }

// ---------- people, seats, walkers ----------

type Role = "cook" | "server" | "carrier" | "townsman" | "townswoman" | "huertano" | "andalus" | "patio" | "shepherd" | "galician" | "basque" | "catalan" | "child";
/** Index into spainResident's working band [huertano, andalusian, counter-worker, basque, catalan, shepherd]. */
const WORKING: Record<string, number> = { cook: 2, server: 2, carrier: 2, huertano: 0, andalus: 1, townsman: 1, townswoman: 2, patio: 2, basque: 3, catalan: 4, shepherd: 5, galician: 0, child: 2 };
/** Index into the eight profiles of RESIDENTS, in their declared order. */
const IDLE: Record<string, number> = { huertano: 0, andalus: 1, townsman: 1, patio: 2, townswoman: 2, shepherd: 3, carrier: 4, cook: 4, server: 4, galician: 5, basque: 6, catalan: 7, child: 2 };
const CHILD_SEEDS = [6, 13, 20, 27, 34, 41, 48];   // spainResident makes a child when the seed is 6 modulo 7
let nth = 0, kid = 0;
/**
 * One resident of 1880 to 1910 from spain-people.ts. Counter trades come from the working band, which carries
 * nothing and wears a work cloth; everyone else keeps the profile's own load and the movement observer that steps them.
 */
function resident(role: Role, working = role === "cook" || role === "server" || role === "carrier"): Figure {
  if (role === "child") return spainResident(CHILD_SEEDS[kid++ % CHILD_SEEDS.length], false) as Figure;
  const step = working ? 6 : 8;
  let index = (working ? WORKING[role] : IDLE[role]) + step * (nth++ % 6);
  if (!working) while (index % 7 === 6) index += step;                       // never a child where a grown worker belongs
  return spainResident(index, working) as Figure;
}
/** The stand takes over a figure's limbs: its own movement observer is dropped so the choreography is not overwritten. */
function own(fig: Figure): Figure { fig.userData.tick = undefined; return fig; }
/** The pelvis rests on the seat; the seat stands a little behind the hanging calves. */
function seatFigure(g: THREE.Object3D, fig: Figure, x: number, z: number, angle: number, seatTop: number): Figure {
  fig.userData.sit?.();
  own(fig);                                                                  // a seated resident keeps the seated pose
  const pelvis = fig.children.find((c) => c instanceof THREE.Mesh) as THREE.Mesh;
  pelvis.geometry.computeBoundingBox();
  const bottom = (pelvis.position.y + pelvis.geometry.boundingBox!.min.y) * fig.scale.y;
  add(g, fig, x, seatTop - bottom, z).rotation.y = angle; fig.name = "es-sitter"; fig.userData.seatTop = seatTop;
  return fig;
}
function sit(g: THREE.Object3D, x: number, z: number, angle: number, role: Role): Figure {
  const seatTop = .42;
  const seat = add(g, cyl(.19, .19, seatTop, ES.castano), x - Math.sin(angle) * .12, seatTop / 2, z - Math.cos(angle) * .12); seat.name = "es-seat";
  return seatFigure(g, resident(role), x, z, angle, seatTop);
}
function bench(g: THREE.Object3D, x: number, z: number, len: number, angle: number) {
  const b = add(g, new THREE.Group(), x, 0, z); b.rotation.y = angle;
  add(b, box(len, .06, .34, ES.castano), 0, .42, -.12).name = "es-bench";
  for (const dx of [-len / 2 + .15, len / 2 - .15]) add(b, box(.08, .39, .3, ES.castano), dx, .195, -.12);
  return .45;
}
function table(g: THREE.Object3D, x: number, z: number, w = 2.4, d = 1.0, color = ES.castano, height = .75) {
  add(g, box(w, .07, d, color), x, height - .035, z);
  for (const dx of [-w / 2 + .12, w / 2 - .12]) for (const dz of [-d / 2 + .1, d / 2 - .1]) add(g, box(.09, height - .07, .09, ES.castano), x + dx, (height - .07) / 2, z + dz);
  return height;
}
/**
 * A walker that paces a straight segment, pauses and turns at each end. Only the position and the facing are set:
 * the resident's own observer in spain-people.ts measures the distance covered and matches the steps to it.
 * A figure handed to this must therefore come from `resident(role, false)`: the working band drops that observer
 * for the counter trades the stand poses itself, and ten paced walkers built from it slid along with stiff legs
 * until the owner saw it on 2026-09-16. `spain-world.mjs` now fails any figure that travels without stepping.
 */
function pacer(p: Figure, from: THREE.Vector3, to: THREE.Vector3, speed = .35, phase = 0, pause = 1.6) {
  const dir = to.clone().sub(from), len = dir.length(), leg = len / speed, cycle = 2 * (leg + pause), heading = Math.atan2(dir.x, dir.z);
  return (t: number) => {
    const s = (t + phase) % cycle;
    let d: number, facing: number, moving: boolean;
    if (s < leg) { d = s * speed; facing = heading; moving = true; }
    else if (s < leg + pause) { d = len; facing = heading + Math.PI * clamp01((s - leg) / pause); moving = false; }
    else if (s < 2 * leg + pause) { d = len - (s - leg - pause) * speed; facing = heading + Math.PI; moving = true; }
    else { d = 0; facing = heading + Math.PI + Math.PI * clamp01((s - 2 * leg - pause) / pause); moving = false; }
    void moving;
    p.position.copy(from).addScaledVector(dir, d / len); p.rotation.y = facing;
  };
}
function orbit(p: Figure, cx: number, cz: number, r: number, speed = .12, phase = 0, y = 0) {
  return (t: number) => { const a = t * speed + phase; p.position.set(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r); p.rotation.y = -a; };
}

// ---------- shelters, lamps, signs ----------

/** A hanging iron lantern (farol). Same conventions as lantern(): name, suspensionPoint, cord last in the swing group. */
function farol(scale = 1): P {
  const g = group(); g.name = "hanging-lantern";
  const anchorY = .4 * scale; g.userData.suspensionPoint = V(0, anchorY, 0);
  const swing = new THREE.Group(); swing.position.y = anchorY; g.add(swing);
  add(swing, cone(.13 * scale, .08 * scale, ES.hierro, 6), 0, -.2 * scale, 0);
  add(swing, box(.14 * scale, .2 * scale, .14 * scale, "#F2C46A"), 0, -.34 * scale, 0).material = mat("#F2C46A", { emissive: "#E9A94A", emissiveIntensity: .7 });
  for (const [x, z] of [[-.07, -.07], [.07, -.07], [-.07, .07], [.07, .07]]) add(swing, box(.02 * scale, .22 * scale, .02 * scale, ES.hierro), x * scale, -.34 * scale, z * scale);
  add(swing, box(.16 * scale, .02 * scale, .16 * scale, ES.hierro), 0, -.46 * scale, 0);
  add(swing, cyl(.008, .008, .16 * scale, ES.hierro, 4), 0, -.08 * scale, 0);   // the cord, last, its top at the anchor
  const phase = rnd() * 6;
  g.userData.tick = (t) => { swing.rotation.z = Math.sin(t * 1.4 + phase) * .07; swing.rotation.x = Math.cos(t * 1.0 + phase) * .04; };
  return g;
}
const SIGN_TEX: Record<string, THREE.CanvasTexture> = {};
function signTexture(text: string, w: number, h: number, ink: string, paper: string): THREE.CanvasTexture {
  const key = `${text}|${w}|${h}|${ink}|${paper}`; if (SIGN_TEX[key]) return SIGN_TEX[key];
  const W = 256, H = Math.round((256 * h) / w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = ink; ctx.lineWidth = 6; ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.fillStyle = ink; ctx.font = `bold ${Math.min(H * .6, W * 1.5 / Math.max(4, text.length))}px Georgia, "Times New Roman", serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; SIGN_TEX[key] = tex; return tex;
}
function sign(g: THREE.Object3D, text: string, w: number, h: number, x: number, y: number, z: number, ink = ES.cal, paper = ES.almagre, rot = 0) {
  const b = new THREE.Group(); b.position.set(x, y, z); b.rotation.y = rot; g.add(b);
  add(b, box(w + .06, h + .06, .04, ES.castano), 0, 0, -.01);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: signTexture(text, w, h, ink, paper), roughness: .85 })); face.position.z = .015; b.add(face);
}
type Style = "cal" | "piedra" | "ladrillo" | "granito" | "pizarra" | "baserri" | "catalan" | "valenciana";
/** Which builder in spain-architecture.ts stands behind a working bay of this style. */
const HOUSE: Record<Style, SpainStyle> = {
  cal: "andalus", piedra: "castile", ladrillo: "castile", granito: "galician", pizarra: "mancha", baserri: "basque", catalan: "catalan", valenciana: "valencian",
};
const WALLS: Record<Style, { wall: string; roof: string; trim: string }> = {
  cal: { wall: ES.cal, roof: ES.teja, trim: ES.talavera }, piedra: { wall: ES.piedra, roof: ES.teja, trim: ES.castano }, ladrillo: { wall: ES.ladrillo, roof: ES.pizarra, trim: ES.granito },
  granito: { wall: ES.granito, roof: ES.pizarra, trim: ES.castano }, pizarra: { wall: "#B9AE98", roof: ES.pizarra, trim: ES.castano }, baserri: { wall: "#EEE4D0", roof: ES.teja, trim: ES.almagre },
  catalan: { wall: "#D9A870", roof: ES.teja, trim: ES.hierro }, valenciana: { wall: ES.cal, roof: "#C9B27A", trim: ES.talavera },
};
/**
 * An open-front working bay of the region, built against a real house from spain-architecture.ts: the house stands
 * behind, the bay adds back and side walls, a pitched roof and a front beam on two posts where the lamps hang.
 * The floor is a low plinth inside the walls only, so it never lies coplanar with the town paving.
 */
function shelter(g: P, style: Style, w = 5.2, d = 3.2, h = 2.5, opts: { sign?: string; arches?: number; gallery?: boolean; storeys?: number } = {}) {
  const { wall, roof, trim } = WALLS[style], zBack = -d / 2 - .6, zFront = d / 2 - .6;
  // The regional house: its front wall lands on the bay's back line, so the bay reads as its open ground floor.
  if (style === "baserri") add(g, baserri(), 0, 0, zBack - 1.8 - .1);
  else add(g, spainHouse(HOUSE[style], w - .3, 2.8, h - .1, { storeys: opts.storeys ?? (style === "ladrillo" ? 2 : 1) }), 0, 0, zBack - 1.4 - .1);
  add(g, box(w, .08, d, style === "granito" || style === "pizarra" ? "#a9a6a0" : ES.albero), 0, .04, -.6);
  add(g, box(w, h, .18, wall), 0, h / 2, zBack);
  for (const x of [-w / 2 + .09, w / 2 - .09]) add(g, box(.18, h, d, wall), x, h / 2, -.6);
  if (style === "ladrillo") { add(g, box(w + .02, .5, d + .02, ES.granito), 0, .25, -.6); }
  if (style === "baserri") { for (const x of [-w / 2 + .5, 0, w / 2 - .5]) add(g, box(.12, h - .4, .06, trim), x, h / 2 + .2, zBack + .12); add(g, box(w - .3, .12, .06, trim), 0, h * .55, zBack + .12); }
  // The arcade springs high: a low arrival camera looks in under the arch heads rather than through them.
  if (opts.arches) { const bays = opts.arches, bw = w / bays; for (let i = 0; i <= bays; i++) add(g, box(.28, h * .86, .28, style === "ladrillo" ? ES.granito : wall), -w / 2 + i * bw, h * .43, zFront + .1); for (let i = 0; i < bays; i++) add(g, new THREE.Mesh(new THREE.CylinderGeometry(bw / 2 - .1, bw / 2 - .1, .3, 12, 1, false, 0, Math.PI), mat(style === "ladrillo" ? ES.granito : wall)), -w / 2 + (i + .5) * bw, h * .86, zFront + .1).rotation.set(Math.PI / 2, 0, Math.PI / 2); }
  else for (const x of [-w / 2 + .12, w / 2 - .12]) add(g, box(.16, h, .16, trim), x, h / 2, zFront + .1);
  const beam = add(g, box(w + .1, .16, .2, ES.castano), 0, h + .08, zFront + .1); beam.name = "front-beam";
  add(g, box(w + .1, .16, .2, ES.castano), 0, h + .08, zBack);
  // roof: two slopes meeting on a ridge, tiles as strips
  const pitch = style === "granito" || style === "pizarra" || style === "ladrillo" ? .55 : .36, half = (d + .9) / 2, slope = Math.sqrt(half * half + (half * pitch) ** 2);
  for (const side of [-1, 1]) {
    const r = add(g, box(w + .6, .1, slope, roof), 0, h + .16 + half * pitch / 2, -.6 + side * half / 2); r.rotation.x = side * Math.atan(pitch);
    if (roof === ES.teja) for (let i = 0; i < Math.floor((w + .6) / .3); i++) add(r, cyl(.05, .05, slope, "#C56A42", 6), -(w + .6) / 2 + .15 + i * .3, .06, 0).rotation.x = Math.PI / 2;
  }
  add(g, box(w + .7, .1, .12, roof === ES.teja ? "#C56A42" : ES.pizarra), 0, h + .21 + half * pitch, -.6);
  if (opts.gallery) { add(g, box(w - .4, .06, .5, ES.castano), 0, h * .6, zBack + .38); for (let i = 0; i < 9; i++) add(g, box(.05, .5, .05, ES.castano), -w / 2 + .4 + i * (w - .8) / 8, h * .6 + .25, zBack + .6); }
  if (opts.sign) sign(g, opts.sign, Math.min(2.6, w * .5), .36, 0, h - .3, zFront + .22);
  return { beam, y: h + .08, zFront: zFront + .1, zBack };
}
/** Two farols hung from a front beam, at its underside. */
function lamps(g: P, beamY: number, z: number, xs: number[], scale = .9) { for (const x of xs) add(g, farol(scale), x, beamY - .08 - .4 * scale, z); }

/** Cured hams on a rail: each hangs from a hook and sways from it. */
function hamRail(g: P, x: number, y: number, z: number, n = 3, w = 1.8, hangTo = y + .6): THREE.Group[] {
  add(g, cyl(.02, .02, w, ES.hierro, 6), x, y, z).rotation.z = Math.PI / 2;
  for (const dx of [-w / 2 + .05, w / 2 - .05]) add(g, cyl(.016, .016, hangTo - y, ES.hierro, 5), x + dx, (y + hangTo) / 2, z);   // the droppers up to the beam
  return Array.from({ length: n }, (_, i) => {
    const pivot = add(g, new THREE.Group(), x - w / 2 + (i + .5) * w / n, y, z);
    add(pivot, cyl(.012, .012, .16, ES.hierro, 4), 0, -.08, 0);
    const leg = add(pivot, ball(.12, "#8A3A2A", 8), 0, -.42, 0); leg.scale.set(.75, 2.2, .55);
    add(pivot, cyl(.035, .05, .22, "#E7CFA6", 6), 0, -.2, 0);
    return pivot;
  });
}
function crate(g: THREE.Object3D, x: number, z: number, color: string, count = 6, r = .07, y = 0, w = .62, d = .44) {
  add(g, box(w, .28, d, "#A88A5C"), x, y + .14, z); add(g, box(w + .02, .04, .05, ES.castano), x, y + .22, z + d / 2);
  const fill = add(g, new THREE.Group(), x, y + .3, z);
  for (let i = 0; i < count; i++) add(fill, ball(r, color, 6), -w / 2 + .12 + (i % 3) * (w - .24) / 2, 0, -d / 2 + .12 + Math.floor(i / 3) * (d - .24));
  return fill;
}
function plate(g: THREE.Object3D, x: number, y: number, z: number, r = .17, color = ES.marmol) { return add(g, cyl(r, r * .85, .025, color, 14), x, y + .012, z); }
function bottle(g: THREE.Object3D, x: number, y: number, z: number, color: string, h = .3, r = .045) { const b = add(g, new THREE.Group(), x, y, z); add(b, cyl(r, r, h * .7, color, 8), 0, h * .35, 0); add(b, cyl(r * .45, r, h * .3, color, 8), 0, h * .85, 0); return b; }
function glassOf(g: THREE.Object3D, x: number, y: number, z: number, liquid: string, r = .05, h = .14) { const c = add(g, new THREE.Group(), x, y, z); add(c, cyl(r, r * .85, h, ES.vidrio, 8), 0, h / 2, 0); add(c, cyl(r * .8, r * .7, h * .5, liquid, 8), 0, h * .3, 0); return c; }

// ---------- the twelve room stands ----------

/** The rice fire: a wide pan over vine wood under a reed shade beside the paddies. The rice surface lifts and the fire flares. */
export function paellaFire(): P {
  const g = group();
  add(g, barraca(), -1.7, 0, -3.7);   // the Albufera field house at the back, front wall facing the fire
  // reed shade (canyís) on four posts, the front beam carries the lamps
  // The front posts stand outside the width of the pan, so neither of them crosses the line from the arrival
  // camera to the rice at either end of its azimuth range.
  for (const [x, z] of [[-2.9, -1.4], [2.9, -1.4], [-2.9, 1.6], [2.9, 1.6]]) add(g, cyl(.07, .08, 2.5, ES.castano, 6), x, 1.25, z);
  add(g, box(6.2, .12, 3.4, "#D6C48E"), 0, 2.56, .1); for (let i = 0; i < 20; i++) add(g, box(.05, .04, 3.4, "#B9A46A"), -2.95 + i * .31, 2.64, .1);
  const beam = add(g, box(6.2, .14, .16, ES.castano), 0, 2.5, 1.6); beam.name = "front-beam"; lamps(g, 2.5, 1.6, [-2.2, 2.2], .8);
  // the fire ring, vine wood, the tripod and the pan
  add(g, cyl(.75, .8, .12, ES.granito, 16), 0, .06, .2);
  for (let i = 0; i < 5; i++) add(g, cyl(.035, .04, .6, "#5C3E2A", 5), Math.cos(i * 1.25) * .2, .16, .2 + Math.sin(i * 1.25) * .2).rotation.set(1.3, i * 1.25, 0);
  const flames = Array.from({ length: 4 }, (_, i) => { const f = add(g, cone(.1, .3, i % 2 ? "#F2A03C" : "#E9612D", 6), Math.cos(i * 1.6) * .16, .3, .2 + Math.sin(i * 1.6) * .16); f.name = "paella-flame"; return f; });
  for (let i = 0; i < 3; i++) add(g, cyl(.02, .02, .9, ES.hierro, 5), Math.cos(i * 2.1) * .5, .45, .2 + Math.sin(i * 2.1) * .5).rotation.set(Math.sin(i * 2.1) * .5, 0, -Math.cos(i * 2.1) * .5);
  add(g, cyl(.9, .82, .1, "#6B6B6E", 24), 0, .9, .2); add(g, cyl(.8, .8, .04, "#3F3F42", 24), 0, .93, .2);
  for (const x of [-.98, .98]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.12, .02, 6, 12, Math.PI), mat("#6B6B6E")), x, .92, .2).rotation.y = Math.PI / 2;
  const rice = add(g, new THREE.Group(), 0, .95, .2); rice.name = "paella-rice";
  add(rice, cyl(.76, .76, .05, "#E5B54B", 24), 0, 0, 0);
  for (let i = 0; i < 5; i++) add(rice, ball(.09, i % 2 ? "#8B5A2B" : "#A5703A", 6), Math.cos(i * 1.26) * .42, .05, Math.sin(i * 1.26) * .42).scale.set(1.2, .7, 1);   // chicken and rabbit
  for (let i = 0; i < 7; i++) add(rice, box(.16, .03, .05, "#6F9B57"), Math.cos(i * .9 + .4) * .3, .05, Math.sin(i * .9 + .4) * .3).rotation.y = i;   // flat beans
  for (let i = 0; i < 6; i++) add(rice, ball(.04, "#F1E6C8", 5), Math.cos(i * 1.05 + 1) * .55, .04, Math.sin(i * 1.05 + 1) * .55).scale.set(1.4, .8, 1);   // garrofó
  for (let i = 0; i < 3; i++) add(rice, ball(.045, "#8A6A4A", 6), Math.cos(i * 2.1 + .7) * .6, .05, Math.sin(i * 2.1 + .7) * .6);   // snails
  add(rice, cyl(.01, .01, .3, "#4F7A3A", 4), .2, .06, -.5).rotation.z = 1.2;   // rosemary
  const bubbles = Array.from({ length: 7 }, (_, i) => add(rice, ball(.03, "#F3DE9A", 5), Math.cos(i * 1.7) * .4, .04, Math.sin(i * 1.7) * .4));
  g.userData.steam = V(0, 1.3, .2); g.userData.smoke = V(0, .8, .2);
  // people: the cook with a long spoon, a helper with vine wood, four diners at a long table, a walker fetching wood
  const cook = add(g, resident("huertano", true), -1.15, 0, .9); cook.rotation.y = .9;
  const spoon = add(arms(cook).right, cyl(.015, .015, .9, ES.castano, 4), 0, arms(cook).hand, .1); spoon.rotation.x = 1.1;
  const helper = add(g, resident("huertano"), 1.3, 0, -.9); helper.rotation.y = -2.2; add(helper, cyl(.03, .03, .5, "#5C3E2A", 5), .2, .6, .2).rotation.x = .3;
  const ty = table(g, 0, 3.4, 3.0, .9, "#C9A97A"); const diners: Figure[] = [];
  for (const [i, x] of [-1.0, 0, 1.0].entries()) diners.push(sit(g, x, 4.2, Math.PI, i % 2 ? "townswoman" : "huertano"));
  diners.push(sit(g, -1.0, 2.6, 0, "townsman"));
  for (const x of [-1.0, 0, 1.0]) { plate(g, x, ty, 3.4); add(g, cyl(.1, .1, .01, "#E5B54B", 10), x, ty + .03, 3.4); glassOf(g, x + .3, ty, 3.6, "#B33A3A", .04, .12); }
  add(g, cyl(.16, .16, .01, "#F1E6C8", 10), .5, ty + .04, 3.2); for (let i = 0; i < 6; i++) add(g, box(.12, .025, .04, "#6F9B57"), .42 + (i % 3) * .07, ty + .06, 3.15 + Math.floor(i / 3) * .08);   // a bowl of beans and garrofó
  const woodPile = add(g, new THREE.Group(), 3.0, 0, -1.0); for (let i = 0; i < 9; i++) add(woodPile, cyl(.04, .04, .9, "#5C3E2A", 5), (i % 3 - 1) * .1, .05 + Math.floor(i / 3) * .09, 0).rotation.x = Math.PI / 2;
  const walker = add(g, resident("huertano"), 3.0, 0, .4); const walk = pacer(walker, V(3.0, 0, .2), V(2.2, 0, 3.6), .32, 2);
  add(walker, cyl(.03, .03, .5, "#5C3E2A", 5), .2, .6, .2).rotation.x = .3;
  const rest = rice.position.clone();
  return life(g, "paellaEs", [cook, diners[0], helper, ...diners.slice(1), walker], (t, k) => {
    // 1. food: the rice surface lifts and the grains break through it; the fire flares under the pan
    const lift = beat(k, 0, .7);
    rice.position.copy(rest); rice.position.y = rest.y + lift * .28;
    bubbles.forEach((b, i) => { b.position.y = .04 + Math.max(0, Math.sin(t * 4 + i * 1.3)) * .03 + lift * Math.abs(Math.sin(t * 9 + i)) * .3; });
    flames.forEach((f, i) => { const s = .8 + Math.sin(t * 9 + i * 2) * .2 + beat(k, 0, .8) * 1.6; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    // 2. the cook's spoon follows, then the diners lean in
    spoon.rotation.x = 1.1 - beat(k, .45, .9) * .8; arms(cook).right.rotation.x = -.5 - beat(k, .45, .9) * .6;
    diners.forEach((d, i) => { upper(d).rotation.x = .05 + beat(k, .55, 1) * (i === 0 ? .18 : .06); });
    walk(t);
  });
}

/** The tapas bar under the Plaza Mayor arcade: the jug tilts and a ribbon of sauce reaches the bravas plate. */
export function tapasBar(): P {
  const g = group();
  const sh = shelter(g, "ladrillo", 5.6, 3.2, 2.7, { sign: "TABERNA", arches: 3 });
  lamps(g, sh.y, sh.zFront, [-2.5, 2.5]);   // at the ends of the beam, clear of the line to the bravas
  for (let i = 0; i < 8; i++) add(g, box(.5, .5, .03, i % 2 ? ES.talavera : "#E9D9A6"), -2.4 + i * .66, .45, sh.zBack + .11);   // tile dado
  hamRail(g, 1.2, sh.y - .5, sh.zBack + .5, 3, 1.6, sh.y - .08).forEach((h) => (h.userData.foodReaction = "sway"));
  // the bar: a long counter with a marble top and a tiled front
  const by = .95; add(g, box(4.6, .9, .7, ES.castano), 0, .45, 1.2); add(g, box(4.7, .06, .8, ES.marmol), 0, by - .03, 1.2);
  for (let i = 0; i < 9; i++) add(g, box(.42, .42, .02, i % 2 ? ES.talavera : "#E9D9A6"), -2.0 + i * .5, .42, 1.56);
  for (const x of [-2.3, 0, 2.3]) add(g, box(.12, 1.35, .5, ES.castano), x, .675, -.9);   // the back fitting stands on the floor
  add(g, box(4.6, .06, .5, ES.castano), 0, .7, -.9); add(g, box(4.6, .06, .5, ES.castano), 0, 1.32, -.9);
  for (let i = 0; i < 6; i++) bottle(g, -2.0 + i * .8, 1.35, -.9, i % 2 ? "#3B5A3A" : "#7A2E2A", .28);
  for (let i = 0; i < 5; i++) add(g, cyl(.13, .13, .16, "#C9B27A", 10), -1.8 + i * .9, .81, -.9);   // crocks on the lower shelf
  // food, modelled: bravas, croquetas, olives, an anchovy tin, bread, vermouth
  const bravas = add(g, new THREE.Group(), -.9, by, 1.25); bravas.name = "bravas-plate"; add(bravas, cyl(.2, .17, .025, ES.marmol, 14), 0, .012, 0);
  for (let i = 0; i < 7; i++) add(bravas, box(.08, .07, .08, "#E3B15C"), Math.cos(i * .9) * .1, .06, Math.sin(i * .9) * .1).rotation.y = i;
  const ribbon = add(bravas, new THREE.Mesh(new THREE.TorusGeometry(.1, .018, 5, 16, Math.PI * 1.5), mat("#C9502E")), 0, .105, 0); ribbon.rotation.x = Math.PI / 2; ribbon.name = "bravas-ribbon"; ribbon.visible = false;
  const croquetas = plate(g, 0, by, 1.3); for (let i = 0; i < 5; i++) add(g, ball(.045, "#B57A3A", 6), -.1 + i * .05, by + .06, 1.25 + (i % 2) * .1).scale.set(1.7, 1, 1);
  const cut = add(g, ball(.045, "#B57A3A", 6), .17, by + .06, 1.4); cut.scale.set(1.7, 1, 1); add(g, box(.05, .05, .01, "#F7EFD6"), .25, by + .06, 1.4);   // one opened croqueta shows béchamel
  plate(g, .8, by, 1.3, .12); for (let i = 0; i < 6; i++) add(g, ball(.03, "#8FA64A", 5), .8 + Math.cos(i) * .06, by + .04, 1.3 + Math.sin(i) * .06);   // olives
  add(g, box(.22, .04, .14, "#B7BEC4"), 1.4, by + .02, 1.25); for (let i = 0; i < 3; i++) add(g, box(.16, .015, .03, "#8A7A70"), 1.4, by + .05, 1.2 + i * .04);   // salt anchovies in their tin
  for (let i = 0; i < 3; i++) add(g, ball(.06, "#D9B77A", 6), -1.7 + i * .12, by + .05, 1.35).scale.set(1, .6, 1.4);   // bread
  for (const x of [-1.4, .4, 1.9]) glassOf(g, x, by, 1.5, "#7A2E2A", .04, .13);
  void croquetas;
  // the sauce jug with a real spout; the stream leaves the spout and lands on the bravas
  const jug = add(g, new THREE.Group(), -.4, by, 1.15); jug.name = "bravas-jug";
  add(jug, cyl(.07, .09, .2, "#C9502E", 10), 0, .1, 0); add(jug, cone(.03, .12, "#C9502E", 6), -.09, .18, 0).rotation.z = 1.2; add(jug, new THREE.Mesh(new THREE.TorusGeometry(.05, .012, 5, 10, Math.PI), mat("#C9502E")), .09, .12, 0).rotation.z = -Math.PI / 2;
  const jugRest = jug.position.clone(), spoutLocal = V(-.15, .22, 0), spout = V(), target = V(-.9, by + .1, 1.25);
  const sauce = stream(g, "bravas-stream", "#C9502E", .022);
  // the fryer at the back: the always-on food loop, croquetas bobbing in hot oil, steam above it
  add(g, cyl(.3, .28, .3, "#3F3F42", 14), 1.9, by + .05, -.1); add(g, cyl(.26, .26, .02, "#E9C36A", 14), 1.9, by + .2, -.1);
  const frying = Array.from({ length: 4 }, (_, i) => add(g, ball(.04, "#B57A3A", 6), 1.9 + Math.cos(i * 1.6) * .14, by + .22, -.1 + Math.sin(i * 1.6) * .14));
  g.userData.steam = V(1.9, 1.5, -.1);
  // people: the barman, three standing at the bar, two at a barrel table, a waiter between them, a child
  const barman = add(g, resident("server"), -.4, .08, .3); barman.rotation.y = .1;
  const drinkers: Figure[] = []; for (const [i, x] of [-1.5, .3, 1.7].entries()) { const d = add(g, resident(i % 2 ? "townswoman" : "townsman"), x, 0, 2.1); d.rotation.y = Math.PI; drinkers.push(d); }
  const barrel = add(g, cyl(.32, .3, .9, ES.castano, 12), 3.4, .45, 1.2); void barrel;
  const seated = [sit(g, 2.9, 1.2, Math.PI / 2, "townsman"), sit(g, 3.9, 1.2, -Math.PI / 2, "andalus")];
  glassOf(g, 3.3, .9, 1.1, "#7A2E2A", .04, .13); glassOf(g, 3.5, .9, 1.3, "#E9C36A", .04, .13);
  const child = add(g, resident("child"), 1.6, 0, 2.5); child.rotation.y = Math.PI - .4;
  const waiter = add(g, resident("server", false), 2.4, 0, 2.6); const walk = pacer(waiter, V(2.4, 0, 2.6), V(-2.4, 0, 2.9), .38, 1);
  add(waiter, cyl(.14, .14, .02, ES.marmol, 10), .28, .95, .2);
  return life(g, "plancha", [barman, drinkers[1], ...drinkers.filter((_, i) => i !== 1), ...seated, child, waiter], (t, k) => {
    frying.forEach((b, i) => { b.position.y = by + .22 + Math.max(0, Math.sin(t * 5 + i * 1.4)) * .04; });
    // 1. food: the jug tilts over the bravas, the stream connects spout to plate, the ribbon appears on the potatoes
    const tilt = beat(k, .02, .7);
    jug.position.copy(jugRest); jug.position.y = jugRest.y + tilt * .32; jug.position.x = jugRest.x - tilt * .2; jug.rotation.z = tilt * 1.15;
    tipOf(jug, spoutLocal, spout);
    const progress = 1 - k, pouring = k > 0 && progress > .12 && progress < .62;
    sauce.set(spout, target, pouring);
    ribbon.visible = k > 0 && progress > .2; ribbon.scale.setScalar(.6 + clamp01((progress - .2) / .4) * .5);
    // 2. barman's hand follows the jug; 3. the nearest drinker raises a glass
    arms(barman).left.rotation.x = -.6 - tilt * .7;
    arms(drinkers[1]).right.rotation.x = -beat(k, .55, 1) * 1.1;
    walk(t);
  });
}

/** The ham counter in the iron market hall: one thin slice separates from the leg and lands on the plate. */
export function jamonStall(): P {
  const g = group();
  // one bay of a cast-iron and glass market hall of the 1876 to 1889 generation
  add(g, ironMarketHall(), 0, 0, -.5);
  const beam = add(g, box(5.5, .14, .18, ES.castano), 0, 3.0, 1.72); beam.name = "front-beam"; lamps(g, 3.0, 1.72, [-1.8, 1.8]);
  add(g, box(5.9, .08, 4.0, "#B9B3A7"), 0, .04, -.5);
  add(g, box(3.2, 1.6, .1, ES.cal), 0, .8, -2.3); sign(g, "JAMONES", 2.0, .34, 0, 1.95, -2.22, ES.cal, ES.castano);
  // the counter with a marble top, the jamonero clamp and the leg
  const cy = .95; add(g, box(3.6, .9, .8, ES.castano), 0, .45, .6); add(g, box(3.7, .06, .9, ES.marmol), 0, cy - .03, .6);
  add(g, box(.7, .05, .2, ES.castano), -.9, cy + .025, .6); add(g, cyl(.02, .02, .5, ES.hierro, 6), -1.15, cy + .3, .6); add(g, box(.12, .06, .08, ES.hierro), -1.15, cy + .55, .6);
  const leg = add(g, new THREE.Group(), -.7, cy + .3, .6); leg.name = "jamon-leg"; leg.rotation.z = .35;
  add(leg, ball(.16, "#8A3A2A", 10), 0, 0, 0).scale.set(2.6, 1, .8); add(leg, cyl(.04, .06, .5, "#E7CFA6", 6), -.55, .05, 0).rotation.z = Math.PI / 2;
  add(leg, cyl(.13, .13, .02, "#C9635A", 12), .12, .13, 0).rotation.z = .1; add(leg, cyl(.14, .14, .01, "#F1DEB8", 12), .12, .12, 0).rotation.z = .1;   // the cut face, pink with a rim of fat
  const knife = new THREE.Group(); add(knife, box(.5, .015, .04, "#C9CFD6"), .25, 0, 0); add(knife, box(.12, .03, .04, ES.castano), -.06, 0, 0);
  const slices = plate(g, .3, cy, .8, .2); for (let i = 0; i < 6; i++) add(g, box(.16, .008, .07, "#B0403A"), .3 + Math.cos(i * 1.05) * .07, cy + .03 + i * .006, .8 + Math.sin(i * 1.05) * .07).rotation.y = i * .5;
  void slices;
  const slice = add(g, box(.18, .008, .08, "#B0403A"), -.6, cy + .43, .68); slice.name = "jamon-slice"; slice.rotation.z = .35; slice.visible = false;
  const sliceStart = slice.position.clone(), sliceEnd = V(.3, cy + .08, .8);
  add(g, box(.18, .01, .18, "#8A8F94"), 1.1, cy + .01, .5); add(g, cyl(.09, .09, .02, "#C9B27A", 10), 1.0, cy + .1, .5); add(g, cyl(.09, .09, .02, "#C9B27A", 10), 1.22, cy + .1, .5); add(g, box(.02, .12, .02, ES.hierro), 1.1, cy + .07, .5);   // the balance
  const scalePan = g.children[g.children.length - 3];
  const hams = hamRail(g, .4, 2.6, -1.4, 5, 3.4, 3.2); hams.forEach((h) => (h.userData.foodReaction = "sway"));
  hamRail(g, -1.6, 2.4, .1, 2, 1.2, 2.94).forEach((h) => (h.userData.foodReaction = "sway"));
  // people: the carver, the assistant at the scale, three customers, a porter with a basket crossing the aisle, a child
  const carver = add(g, resident("server"), -.6, .08, -.3); carver.rotation.y = -.2;
  const held = add(arms(carver).right, knife, 0, arms(carver).hand, .04); held.rotation.y = Math.PI / 2; held.rotation.x = -.45;   // the blade reaches the cut face from the carving hand
  const assistant = add(g, own(resident("townswoman")), 1.2, .08, -.4);
  const customers: Figure[] = []; for (const [i, x] of [-.9, .4, 1.6].entries()) { const c = add(g, resident(["townsman", "townswoman", "andalus"][i] as Role), x, .08, 1.6 + (i % 2) * .3); c.rotation.y = Math.PI; customers.push(c); }
  const child = add(g, resident("child"), -.2, .08, 2.0); child.rotation.y = Math.PI + .3;
  const porter = add(g, resident("carrier", false), 2.6, .08, 2.9); const walk = pacer(porter, V(2.6, .08, 2.9), V(-2.6, .08, 2.9), .34, 3);
  const basket = add(porter, cyl(.16, .13, .2, "#C9B27A", 8), -.3, .5, 0); for (let i = 0; i < 3; i++) add(basket, ball(.05, ["#D94F3A", "#6F9B57", "#F1E6C8"][i], 5), -.06 + i * .06, .12, 0);
  return life(g, "jamonEs", [carver, customers[0], assistant, ...customers.slice(1), child, porter], (t, k) => {
    // 1. food: a slice separates from the cut face and lands on the plate (the leg stays clamped)
    const p = beat(k, 0, .75) > 0 ? clamp01(((1 - k) - .05) / .6) : 0;
    slice.visible = k > 0 && (1 - k) > .05 && (1 - k) < .9;
    slice.position.lerpVectors(sliceStart, sliceEnd, p); slice.position.y += Math.sin(p * Math.PI) * .25; slice.rotation.z = .35 - p * .35; slice.rotation.y = p * 1.2;
    // 2. the carver's long stroke; the knife slides along the face
    const stroke = beat(k, 0, .5); knife.rotation.x = -.45 - stroke * .22; arms(carver).right.rotation.x = -1.9 - stroke * .3; arms(carver).right.rotation.z = -.1 - stroke * .16;
    // 3. the first customer nods toward the plate
    upper(customers[0]).rotation.x = beat(k, .55, 1) * .16;
    scalePan.rotation.z = Math.sin(t * 1.1) * .02 + beat(k, .6, 1) * .12;
    // the always-on loop of a ham counter: the curing legs never hang quite still on their rail
    hams.forEach((h, i) => { h.rotation.z = Math.sin(t * .85 + i * .7) * .035 + beat(k, 0, .8) * .16; h.rotation.x = Math.cos(t * .62 + i) * .022; });
    walk(t);
  });
}

/** The family kitchen in central Castile: the tortilla flips onto its plate. */
export function tortillaKitchen(): P {
  const g = group();
  const sh = shelter(g, "piedra", 6.0, 3.2, 2.5, { sign: "CASA LOLA" }); lamps(g, sh.y, sh.zFront, [-2.3, 2.3]);
  add(g, box(1.0, .9, .05, "#6F8FB0"), 1.5, 1.5, sh.zBack + .11); for (let i = 0; i < 3; i++) add(g, box(.02, .9, .02, ES.hierro), 1.2 + i * .3, 1.5, sh.zBack + .15);   // a window with a grille
  const ristra = add(g, new THREE.Group(), 2.15, 2.2, sh.zBack + .2); for (let i = 0; i < 7; i++) add(ristra, cone(.04, .14, i % 3 ? "#C0392B" : "#8E2A22", 5), (i % 2) * .05, -.1 - i * .13, 0).rotation.z = Math.PI + (i % 2 ? .3 : -.3);
  // the iron range with two pans; a café counter across the front lane
  add(g, box(1.7, .85, .8, "#3A3A3E"), -1.2, .43, -.6); add(g, box(1.8, .06, .9, "#2A2A2E"), -1.2, .88, -.6); for (const x of [-1.6, -.8]) add(g, cyl(.16, .16, .02, "#E9612D", 12), x, .92, -.6);
  const pan = add(g, new THREE.Group(), -.8, .93, -.6); pan.name = "tortilla-pan"; add(pan, cyl(.3, .27, .06, "#3F3F42", 16), 0, .03, 0); add(pan, cyl(.03, .03, .4, ES.hierro, 5), .45, .05, 0).rotation.z = Math.PI / 2;
  const tortilla = add(g, new THREE.Group(), -.8, .99, -.6); tortilla.name = "tortilla"; add(tortilla, cyl(.26, .24, .09, "#E6B84A", 18), 0, .045, 0); add(tortilla, cyl(.245, .245, .01, "#D89A3A", 18), 0, .095, 0);
  const tRest = tortilla.position.clone(), tPlate = V(-.15, .99, -.15);
  const plateBig = plate(g, -.15, .93, -.15, .3); void plateBig;
  const second = add(g, cyl(.3, .27, .06, "#3F3F42", 16), -1.6, .95, -.6); add(g, cyl(.27, .27, .02, "#F2CC5A", 18), -1.6, .99, -.6); void second;
  const eggBits = Array.from({ length: 5 }, (_, i) => add(g, ball(.025, "#F7E3A0", 5), -1.6 + Math.cos(i * 1.3) * .15, 1.01, -.6 + Math.sin(i * 1.3) * .15));
  g.userData.steam = V(-1.6, 1.4, -.6);
  const wy = table(g, 1.0, -.5, 1.8, .8, "#C9A97A", .85);
  add(g, box(.5, .03, .35, "#D9B77A"), .6, wy + .015, -.55); for (let i = 0; i < 6; i++) add(g, cyl(.06, .06, .012, "#F1E6C8", 8), .45 + (i % 3) * .12, wy + .04, -.65 + Math.floor(i / 3) * .15);   // potato slices on the board
  add(g, cyl(.14, .1, .1, ES.marmol, 10), 1.3, wy + .05, -.6); for (let i = 0; i < 4; i++) add(g, ball(.04, "#F1E6C8", 6), 1.3 + Math.cos(i * 1.6) * .06, wy + .11, -.6 + Math.sin(i * 1.6) * .06).scale.y = 1.3;   // eggs
  add(g, cyl(.11, .09, .08, "#E9D9A6", 10), 1.7, wy + .04, -.4); for (let i = 0; i < 4; i++) add(g, ball(.035, "#E8D8B0", 5), 1.7 + Math.cos(i * 1.6) * .05, wy + .1, -.4 + Math.sin(i * 1.6) * .05);   // onion, in its own bowl
  bottle(g, 1.6, wy, -.75, "#8FA64A", .26, .04);
  // the counter at the front: neighbours are served through it
  const cy = .95; add(g, box(3.4, .9, .5, ES.castano), .4, .45, 1.3); add(g, box(3.5, .05, .6, "#C9A97A"), .4, cy - .025, 1.3);
  for (const x of [-.4, .6, 1.5]) { plate(g, x, cy, 1.3, .13); const w = add(g, cyl(.11, .11, .06, "#E6B84A", 3), x, cy + .045, 1.3); w.rotation.y = .5; }   // wedges
  for (const x of [0, 1.1]) glassOf(g, x, cy, 1.45, "#B33A3A", .04, .12);
  // people: the cook, a helper peeling, three neighbours at the counter, a child, a walker on the lane
  const cook = add(g, own(resident("patio")), -.9, .08, .3); cook.rotation.y = Math.PI;
  const helper = sit(g, 1.0, .5, Math.PI, "townswoman"); add(arms(helper).right, ball(.05, "#E8D8B0", 5), 0, arms(helper).hand, 0);
  const neighbours: Figure[] = []; for (const [i, x] of [-.4, .6, 1.5].entries()) { const n = add(g, resident(i === 1 ? "townswoman" : "townsman"), x, 0, 2.1); n.rotation.y = Math.PI; neighbours.push(n); }
  const child = add(g, resident("child"), 2.2, 0, 1.9); child.rotation.y = Math.PI + .5;
  const walker = add(g, resident("carrier", false), -2.2, 0, 2.5); const walk = pacer(walker, V(-2.2, 0, 2.5), V(3.0, 0, 2.5), .36, 5);
  return life(g, "tortillaEs", [cook, neighbours[0], helper, ...neighbours.slice(1), child, walker], (t, k) => {
    eggBits.forEach((b, i) => { b.position.y = 1.01 + Math.max(0, Math.sin(t * 4.5 + i)) * .03; });
    ristra.rotation.x = Math.sin(t * 1.3) * .07; ristra.rotation.z = Math.sin(t * .9) * .04;
    // 1. food: the tortilla rises out of the pan, turns over in the air and lands on the plate
    const p = k > 0 ? clamp01((1 - k) / .7) : 0;
    tortilla.position.lerpVectors(tRest, tPlate, p); tortilla.position.y += Math.sin(p * Math.PI) * .6; tortilla.rotation.z = p * Math.PI;
    if (k <= 0) { tortilla.position.copy(tRest); tortilla.rotation.z = 0; }
    // 2. the cook's arms follow the pan; 3. a neighbour leans over the counter
    arms(cook).right.rotation.x = -.7 - beat(k, .05, .6) * .9; arms(cook).left.rotation.x = -.7 - beat(k, .05, .6) * .9;
    upper(neighbours[0]).rotation.x = beat(k, .5, 1) * .18;
    walk(t);
  });
}

/** The churrería off the square: a churro rises from the oil on the tongs. */
export function churreria(): P {
  const g = group();
  const sh = shelter(g, "ladrillo", 4.6, 3.0, 2.5, { sign: "CHURRERÍA" }); lamps(g, sh.y, sh.zFront, [-1.5, 1.5]);
  // the fryer: a wide shallow vat of oil with bubbles that never stop; the chocolate pot beside it
  add(g, box(1.6, .8, 1.0, "#3A3A3E"), -1.0, .4, -.5); add(g, cyl(.7, .65, .2, "#5A5A5E", 20), -1.0, .9, -.5); add(g, cyl(.64, .64, .03, "#E9C36A", 20), -1.0, .99, -.5);
  const oilBubbles = Array.from({ length: 9 }, (_, i) => add(g, ball(.03, "#F3DE9A", 5), -1.0 + Math.cos(i * 1.4) * .45, 1.0, -.5 + Math.sin(i * 1.4) * .45));
  for (let i = 0; i < 3; i++) { const c = add(g, new THREE.Mesh(new THREE.TorusGeometry(.2 + i * .1, .03, 6, 16, Math.PI * 1.6), mat("#D9A24A")), -1.0, 1.01, -.5); c.rotation.x = Math.PI / 2; c.rotation.z = i; }   // churro spirals frying
  add(g, cyl(.22, .2, .4, "#B87333", 12), .8, 1.1, -.7); add(g, cyl(.19, .19, .02, "#5A2E1E", 12), .8, 1.31, -.7);
  g.userData.steam = V(.8, 1.6, -.7); g.userData.smoke = V(-1.0, 1.4, -.5);
  const cy = .95; add(g, box(3.8, .9, .6, ES.castano), 0, .45, 1.2); add(g, box(3.9, .05, .7, ES.marmol), 0, cy - .025, 1.2);
  // the draining tray with churros and porras, the sugar dish, cups of thick chocolate
  const tray = add(g, new THREE.Group(), -.9, cy, 1.15); add(tray, box(.9, .03, .5, "#9A9A9E"), 0, .015, 0);
  for (let i = 0; i < 7; i++) { const c = add(tray, cyl(.028, .028, .5, "#D9A24A", 6), -.3 + i * .1, .06, 0); c.rotation.x = Math.PI / 2; for (let r = 0; r < 4; r++) add(c, box(.006, .5, .006, "#B8802A"), Math.cos(r * 1.57) * .03, 0, Math.sin(r * 1.57) * .03); }   // ridged churros
  for (let i = 0; i < 3; i++) add(tray, cyl(.045, .045, .55, "#E2B968", 8), .25 + i * .07, .13, 0).rotation.x = Math.PI / 2;   // porras, thicker and paler
  plate(g, .5, cy, 1.25, .12, "#F7F1E6"); add(g, cyl(.1, .1, .02, ES.cal, 10), .5, cy + .04, 1.25);   // sugar
  for (const x of [1.1, 1.4]) { add(g, cyl(.05, .04, .16, ES.cal, 10), x, cy + .08, 1.3); add(g, cyl(.045, .045, .01, "#5A2E1E", 10), x, cy + .165, 1.3); }
  const tongs = new THREE.Group(); tongs.name = "churro-tongs"; for (const dz of [-.03, .03]) add(tongs, box(.02, .02, .5, "#8A8F94"), 0, -.22, dz);
  const rising = add(g, cyl(.028, .028, .45, "#D9A24A", 6), -1.0, .98, -.5); rising.name = "churro-rising"; rising.rotation.x = Math.PI / 2; rising.visible = false;
  for (let r = 0; r < 4; r++) add(rising, box(.006, .45, .006, "#B8802A"), Math.cos(r * 1.57) * .03, 0, Math.sin(r * 1.57) * .03);
  const riseStart = rising.position.clone(), riseEnd = V(-.9, cy + .1, 1.15);
  // people: the churrero at the vat, a server pouring chocolate, two seated with cups, two at the counter, a boy with a paper cone
  const churrero = add(g, resident("server"), -1.0, .08, .4); churrero.rotation.y = Math.PI;
  const heldTongs = add(arms(churrero).right, tongs, 0, arms(churrero).hand, .03); heldTongs.rotation.x = 1.35;   // the tongs never leave the hand that lifts the churro
  const server = add(g, own(resident("townswoman")), .9, .08, .2); server.rotation.y = .3;
  const ty = table(g, 3.0, 1.4, 1.0, .8, "#C9A97A", .72);
  const seated = [sit(g, 2.5, 1.4, Math.PI / 2, "townsman"), sit(g, 3.5, 1.4, -Math.PI / 2, "townswoman")];
  for (const x of [2.8, 3.2]) { add(g, cyl(.05, .04, .16, ES.cal, 10), x, ty + .08, 1.4); add(g, cyl(.045, .045, .01, "#5A2E1E", 10), x, ty + .165, 1.4); }
  const standing: Figure[] = []; for (const [i, x] of [-1.4, .3].entries()) { const s = add(g, resident(i ? "andalus" : "townsman"), x, 0, 2.0); s.rotation.y = Math.PI; standing.push(s); }
  const boy = add(g, resident("child"), 1.6, 0, 2.6); const walk = pacer(boy, V(1.6, 0, 2.6), V(-2.4, 0, 2.7), .3, 4);
  add(boy, cone(.07, .3, "#D9C7A6", 6), .2, .75, .15).rotation.x = .4;
  return life(g, "churrosEs", [churrero, standing[0], server, standing[1], ...seated, boy], (t, k) => {
    oilBubbles.forEach((b, i) => { b.position.y = 1.0 + Math.max(0, Math.sin(t * 6 + i * 1.1)) * .04; });
    // 1. food: a churro rises out of the oil in the tongs and travels to the draining tray
    const p = k > 0 ? clamp01(((1 - k) - .02) / .7) : 0;
    rising.visible = k > 0 && (1 - k) > .02 && (1 - k) < .95;
    rising.position.lerpVectors(riseStart, riseEnd, p); rising.position.y += Math.sin(p * Math.PI) * .55; rising.rotation.z = p * .8;
    tongs.rotation.x = 1.35 - p * .35; tongs.children.forEach((c, i) => (c.rotation.z = (i ? 1 : -1) * (.06 - beat(k, 0, .3) * .05)));
    // 2. the churrero's arm; 3. a customer at the counter leans in
    arms(churrero).right.rotation.x = -1.95 - beat(k, .05, .7) * .45;
    upper(standing[0]).rotation.x = beat(k, .55, 1) * .15;
    walk(t);
  });
}

/** The counter of small bites on the Cantabrian coast: a cruet tilts and one bite lifts. */
export function pintxoBar(): P {
  const g = group();
  const sh = shelter(g, "baserri", 5.4, 3.2, 2.6, { sign: "TABERNA" }); lamps(g, sh.y, sh.zFront, [-1.8, 1.8]);
  add(g, box(5.2, .3, .9, ES.almagre), 0, sh.y - .5, sh.zFront + .5).rotation.x = .2;   // the awning
  const fringe = Array.from({ length: 12 }, (_, i) => add(g, box(.3, .18, .02, "#EEE4D0"), -2.4 + i * .43, sh.y - .75, sh.zFront + .92));
  const cy = .98; add(g, box(4.8, .92, .7, "#3F2A1E"), 0, .46, 1.2); add(g, box(4.9, .06, .8, "#4F3626"), 0, cy - .03, 1.2);
  for (const x of [-2.4, 0, 2.4]) add(g, box(.12, 1.55, .5, "#3F2A1E"), x, .775, sh.zBack + .4);
  add(g, box(4.8, .06, .5, "#3F2A1E"), 0, .8, sh.zBack + .4); add(g, box(4.8, .06, .5, "#3F2A1E"), 0, 1.52, sh.zBack + .4);
  for (let i = 0; i < 7; i++) bottle(g, -2.1 + i * .7, 1.55, sh.zBack + .4, i % 3 ? "#3B5A3A" : "#C9CFD6", .3);
  for (let i = 0; i < 5; i++) add(g, cyl(.12, .12, .18, "#C9B27A", 10), -1.9 + i * .95, .92, sh.zBack + .4);
  // the counter: plates of bites in a row, the guindilla jar, the anchovy tin, a wedge of tortilla
  const bites: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) {
    const p = plate(g, -1.7 + i * .55, cy, 1.25, .17); void p;
    for (let j = 0; j < 3; j++) {
      const b = add(g, new THREE.Group(), -1.7 + i * .55 + Math.cos(j * 2.1) * .08, cy + .03, 1.25 + Math.sin(j * 2.1) * .08);
      add(b, box(.1, .04, .1, "#D9B77A"), 0, .02, 0); add(b, cyl(.006, .006, .16, "#C9B27A", 4), 0, .1, 0);
      if (i % 2 === 0) { add(b, ball(.028, "#8FA64A", 5), 0, .06, 0); add(b, ball(.02, "#8A7A70", 5), 0, .095, 0).scale.set(1.8, .8, .8); add(b, cone(.018, .06, "#9BB05A", 5), 0, .14, 0); }   // olive, anchovy, guindilla
      else { add(b, box(.08, .03, .08, i === 1 ? "#E6B84A" : "#B57A3A"), 0, .06, 0); add(b, ball(.02, "#D94F3A", 5), 0, .09, 0); }
      bites.push(b);
    }
  }
  const bite = bites[1]; bite.name = "pintxo-bite";
  const jar = add(g, new THREE.Group(), .9, cy, 1.15); add(jar, cyl(.1, .1, .28, ES.vidrio, 10), 0, .14, 0).material = mat(ES.vidrio, { transparent: true, opacity: .55 }); add(jar, cyl(.1, .1, .03, ES.castano, 10), 0, .3, 0);
  const guindillas = Array.from({ length: 5 }, (_, i) => add(jar, cone(.02, .12, "#9BB05A", 5), Math.cos(i * 1.3) * .05, .1 + (i % 2) * .05, Math.sin(i * 1.3) * .05));
  add(g, box(.22, .04, .14, "#B7BEC4"), 1.5, cy + .02, 1.25); for (let i = 0; i < 3; i++) add(g, box(.16, .015, .03, "#8A7A70"), 1.5, cy + .05, 1.2 + i * .04);
  plate(g, 2.0, cy, 1.25, .13); add(g, cyl(.11, .11, .06, "#E6B84A", 3), 2.0, cy + .045, 1.25);
  for (const x of [-1.3, .2, 1.8]) glassOf(g, x, cy, 1.5, "#E9E3A0", .035, .12);   // txakoli glasses
  const cruet = add(g, new THREE.Group(), -1.4, cy, 1.05); cruet.name = "pintxo-cruet"; add(cruet, cyl(.05, .07, .16, "#8FA64A", 8), 0, .08, 0); add(cruet, cyl(.012, .012, .12, "#8A8F94", 5), 0, .21, 0); add(cruet, cone(.02, .06, "#8A8F94", 5), -.03, .27, 0).rotation.z = .9;
  const cruetRest = cruet.position.clone(), spoutLocal = V(-.05, .3, 0), spout = V(), target = V(), oil = stream(g, "pintxo-stream", "#C9B84A", .012);
  // people: the barman, three standing customers, two at a barrel, a man moving along the quay to the next bar, a child
  const barman = add(g, resident("basque", true), -1.2, .08, .3); barman.rotation.y = .2;
  const standing: Figure[] = []; for (const [i, x] of [-1.6, -.2, 1.4].entries()) { const s = add(g, resident(i === 1 ? "townswoman" : "basque"), x, 0, 2.1); s.rotation.y = Math.PI; standing.push(s); }
  add(g, cyl(.32, .3, .9, ES.castano, 12), 3.3, .45, 1.2); const seated = [sit(g, 2.8, 1.2, Math.PI / 2, "basque"), sit(g, 3.8, 1.2, -Math.PI / 2, "townswoman")];
  const child = add(g, resident("child"), .7, 0, 2.5); child.rotation.y = Math.PI;
  const walker = add(g, resident("basque"), -3.0, 0, 3.0); const walk = pacer(walker, V(-3.0, 0, 3.0), V(3.4, 0, 3.0), .34, 2);
  const biteRest = bite.position.clone();
  return life(g, "pintxosEs", [barman, standing[1], standing[0], standing[2], ...seated, child, walker], (t, k) => {
    fringe.forEach((f, i) => { f.rotation.x = Math.sin(t * 1.6 + i * .6) * .12; });
    guindillas.forEach((p, i) => { p.position.y = .1 + (i % 2) * .05 + Math.sin(t * .8 + i) * .015; p.rotation.y = t * .2 + i; });
    // 1. food: the cruet tilts over the plate, a thread of oil reaches the bite, the bite lifts
    const tilt = beat(k, .02, .65);
    cruet.position.copy(cruetRest); cruet.position.y = cruetRest.y + tilt * .3; cruet.position.x = cruetRest.x + tilt * .15; cruet.rotation.z = -tilt * 1.2;
    tipOf(cruet, spoutLocal, spout); target.copy(biteRest).add(V(0, .16, 0));
    const progress = 1 - k; oil.set(spout, target, k > 0 && progress > .12 && progress < .6);
    bite.position.copy(biteRest); bite.position.y = biteRest.y + beat(k, .3, .9) * .38; bite.rotation.y = beat(k, .3, .9) * 1.2;
    // 2. the barman's hand; 3. one customer raises a glass
    arms(barman).left.rotation.x = -.6 - tilt * .7; arms(standing[1]).right.rotation.x = -beat(k, .55, 1) * 1.1;
    walk(t);
  });
}

/** The courtyard kitchen: an earthenware jug tilts and the bowl fills with cold gazpacho. No steam anywhere. */
export function patioKitchen(): P {
  const g = group();
  // the patio: whitewashed walls on three sides with a blue tile dado, geraniums on the wall, a pergola beam at the front
  add(g, box(6.0, .08, 4.4, ES.albero), 0, .04, -.4);
  add(g, box(6.0, 2.6, .18, ES.cal), 0, 1.3, -2.6); for (const x of [-2.95, 2.95]) add(g, box(.18, 2.6, 4.4, ES.cal), x, 1.3, -.4);
  for (let i = 0; i < 10; i++) add(g, box(.5, .5, .02, i % 2 ? ES.talavera : "#E9D9A6"), -2.5 + i * .55, .45, -2.5);
  for (let i = 0; i < 5; i++) { add(g, cyl(.09, .07, .16, ES.talavera, 8), -2.2 + i * 1.1, 1.5, -2.48); add(g, ball(.11, i % 2 ? "#E0483A" : "#E8558A", 6), -2.2 + i * 1.1, 1.66, -2.44); add(g, ball(.08, "#6F9B57", 5), -2.2 + i * 1.1 + .1, 1.58, -2.4); }
  for (const x of [-2.9, 2.9]) add(g, cyl(.1, .1, 2.6, ES.castano, 6), x, 1.3, 1.9);
  const beam = add(g, box(6.0, .14, .16, ES.castano), 0, 2.67, 1.9); beam.name = "front-beam"; for (let i = 0; i < 7; i++) add(g, box(.08, .1, 4.4, ES.castano), -2.7 + i * .9, 2.7, -.3);
  lamps(g, 2.67, 1.9, [-2.0, 2.0], .8);
  add(g, citrusTree("orange", 1.15), 2.0, .08, -1.5);
  // the well: a low ring with a basin and an iron hoop; the ripple ring pulses on the basin surface
  add(g, cyl(.45, .5, .55, ES.granito, 14), -2.0, .35, -1.6); add(g, cyl(.38, .38, .02, ES.agua, 14), -2.0, .62, -1.6); add(g, new THREE.Mesh(new THREE.TorusGeometry(.42, .02, 5, 16, Math.PI), mat(ES.hierro)), -2.0, 1.1, -1.6);
  const ripple = add(g, new THREE.Mesh(new THREE.TorusGeometry(.15, .012, 5, 18), mat("#CFEBF0", { transparent: true, opacity: .8 })), -2.0, .64, -1.6); ripple.rotation.x = Math.PI / 2;
  // the table: a dornillo of gazpacho, tomatoes, peppers, cucumber, bread, garnish dishes, the oil vessel, mortar and pestle
  const ty = table(g, 0, .3, 2.6, 1.1, "#C9A97A");
  add(g, cyl(.3, .22, .16, "#A88A5C", 14), -.6, ty + .08, .3); add(g, cyl(.27, .27, .02, "#D9603A", 14), -.6, ty + .17, .3);   // the dornillo
  for (let i = 0; i < 4; i++) add(g, ball(.07, "#D94F3A", 7), .3 + Math.cos(i * 1.6) * .1, ty + .07, .1 + Math.sin(i * 1.6) * .1);
  for (let i = 0; i < 3; i++) add(g, cone(.035, .16, "#5F9A3C", 6), .7 + i * .08, ty + .05, .05).rotation.z = Math.PI / 2 + .3;
  add(g, cyl(.035, .035, .3, "#3F7A3A", 6), .9, ty + .04, .5).rotation.z = Math.PI / 2; add(g, ball(.08, "#D9B77A", 6), .2, ty + .06, .6).scale.set(1.6, .8, 1);
  for (const [i, x] of [-1.0, -.75].entries()) { plate(g, x, ty, -.05, .07); add(g, ball(.03, i ? "#F7E3A0" : "#5F9A3C", 5), x, ty + .04, -.05); }   // garnishes: egg, pepper
  add(g, cyl(.06, .08, .22, "#7A9A3A", 8), 1.1, ty + .11, .35); add(g, cyl(.02, .02, .08, "#7A9A3A", 6), 1.1, ty + .26, .35);   // the oil vessel
  const mortar = add(g, cyl(.09, .07, .1, ES.marmol, 10), -1.05, ty + .05, .55); const pestle = add(g, cyl(.02, .025, .2, ES.castano, 6), -1.05, ty + .18, .55); void mortar;
  const bowl = add(g, new THREE.Group(), .1, ty, .45); bowl.name = "gazpacho-bowl"; add(bowl, cyl(.14, .1, .09, "#E9D9A6", 12), 0, .045, 0);
  const contents = add(bowl, cyl(.12, .12, .02, "#D9603A", 12), 0, .05, 0); contents.name = "gazpacho-contents";
  const jug = add(g, new THREE.Group(), -.2, ty, .55); jug.name = "gazpacho-jug"; add(jug, cyl(.09, .1, .26, "#B87A52", 10), 0, .13, 0); add(jug, cone(.035, .1, "#B87A52", 6), .1, .26, 0).rotation.z = -1.1; add(jug, new THREE.Mesh(new THREE.TorusGeometry(.06, .014, 5, 10, Math.PI), mat("#B87A52")), -.1, .16, 0).rotation.z = Math.PI / 2;
  const jugRest = jug.position.clone(), spoutLocal = V(.15, .3, 0), spout = V(), target = V(.1, ty + .1, .45), pour = stream(g, "gazpacho-stream", "#D9603A", .022);
  // people: the cook, a grandmother in the shade, two diners, two children, a man watering geraniums along the wall
  const cook = add(g, own(resident("patio")), -.5, .08, -.5); cook.rotation.y = Math.PI;
  const abuela = sit(g, 2.4, .6, -Math.PI / 2 - .4, "townswoman"); add(arms(abuela).right, cone(.12, .02, "#C0392B", 8), 0, arms(abuela).hand, 0);
  // The first diner sat at [-.8, 1.3], square on the line from the low south-west arrival to the jug; he moved
  // round to the end of the table, where the sight-line check clears him at every azimuth and every build order.
  const diners = [sit(g, -1.8, .3, Math.PI / 2, "andalus"), sit(g, .6, 1.3, Math.PI, "townsman")];
  const kids = [add(g, resident("child"), -2.2, .08, .6), add(g, resident("child"), -1.6, .08, 1.0)]; kids[0].rotation.y = .8; kids[1].rotation.y = -2.2;
  const waterer = add(g, resident("andalus"), -2.4, .08, -2.0); const walk = pacer(waterer, V(-2.4, .08, -2.0), V(1.2, .08, -2.0), .28, 6);
  add(waterer, cyl(.08, .07, .16, "#7A9A8A", 8), -.28, .45, 0);
  return life(g, "gazpachoEs", [cook, diners[0], abuela, diners[1], ...kids, waterer], (t, k) => {
    pestle.rotation.z = .25; pestle.rotation.y = t * 2.2; pestle.position.x = -1.05 + Math.cos(t * 2.2) * .03; pestle.position.z = .55 + Math.sin(t * 2.2) * .03;
    const rp = (t * .35) % 1; ripple.scale.setScalar(.5 + rp * 1.6); (ripple.material as THREE.MeshStandardMaterial).opacity = .8 * (1 - rp);
    // 1. food: the jug tilts, the stream leaves the spout, the bowl fills (contents rise and widen)
    const tilt = beat(k, .02, .68);
    jug.position.copy(jugRest); jug.position.y = jugRest.y + tilt * .34; jug.position.x = jugRest.x + tilt * .1; jug.rotation.z = -tilt * 1.2;
    tipOf(jug, spoutLocal, spout); const progress = 1 - k; pour.set(spout, target, k > 0 && progress > .12 && progress < .62);
    const fill = k > 0 ? clamp01((progress - .15) / .5) : 0; contents.position.y = .05 + fill * .03; contents.scale.setScalar(1 + fill * .15 - (k > 0 ? 0 : 0));
    if (k <= 0) { contents.position.y = .05; contents.scale.setScalar(1); }
    // 2. the cook's hand on the jug; 3. a diner leans toward the bowl
    arms(cook).right.rotation.x = -.7 - tilt * .8; upper(diners[0]).rotation.x = beat(k, .55, 1) * .16;
    walk(t);
  });
}

/** The fair cauldron under a granite arcade: the scissors cut, a piece drops onto the wooden plate and paprika falls. */
export function pulperia(): P {
  const g = group();
  add(g, arcade(4, 8.0), 0, 0, -3.0);
  add(g, box(8.4, .08, 4.6, "#a9a6a0"), 0, .04, -.8);   // the fair ground under and in front of the arcade
  for (const x of [-2.7, 2.7]) add(g, cyl(.09, .11, 2.55, ES.castano, 6), x, 1.275, 1.5);
  const beam = add(g, box(5.7, .16, .2, ES.castano), 0, 2.62, 1.5); beam.name = "front-beam";
  for (let i = 0; i < 7; i++) add(g, box(.09, .1, 4.4, ES.castano), -2.55 + i * .85, 2.7, -.7);   // the awning poles over the pitch
  add(g, box(5.6, .05, 4.4, "#C9B27A"), 0, 2.76, -.7);
  lamps(g, 2.62, 1.5, [-1.5, 1.5]);
  sign(g, "PULPO", 1.8, .34, 0, 2.2, -2.18, ES.cal, ES.almagre);
  // the copper cauldron on its tripod over an oak fire; the water never stops turning over
  add(g, cyl(.7, .75, .1, ES.granito, 14), -2.2, .09, .2);
  for (let i = 0; i < 4; i++) add(g, cyl(.035, .04, .5, "#5C3E2A", 5), -2.2 + Math.cos(i * 1.57) * .18, .22, .2 + Math.sin(i * 1.57) * .18).rotation.set(1.2, i * 1.57, 0);
  const fireEs = Array.from({ length: 3 }, (_, i) => add(g, cone(.09, .26, i % 2 ? "#F2A03C" : "#E9612D", 6), -2.2 + Math.cos(i * 2.1) * .13, .35, .2 + Math.sin(i * 2.1) * .13));
  for (let i = 0; i < 3; i++) add(g, cyl(.02, .02, 1.1, ES.hierro, 5), -2.2 + Math.cos(i * 2.1) * .55, .55, .2 + Math.sin(i * 2.1) * .55).rotation.set(Math.sin(i * 2.1) * .55, 0, -Math.cos(i * 2.1) * .55);
  add(g, cyl(.58, .5, .55, "#B87333", 18), -2.2, .82, .2); add(g, cyl(.52, .52, .03, "#8A4A3A", 18), -2.2, 1.04, .2);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(.56, .025, 6, 18, Math.PI), mat("#8A8F94")), -2.2, 1.28, .2).rotation.y = Math.PI / 2;
  const boiling = Array.from({ length: 6 }, (_, i) => add(g, ball(.055, "#7A3A4A", 6), -2.2 + Math.cos(i * 1.05) * .3, 1.05, .2 + Math.sin(i * 1.05) * .3));
  g.userData.steam = V(-2.2, 1.5, .2); g.userData.smoke = V(-2.2, .8, .2);
  // the trestle where the tentacle is cut: a round wooden plate, cachelos underneath, the paprika tin and coarse salt
  const ty = table(g, .9, .8, 3.2, 1.1, "#A88A5C", .78);
  const woodPlate = add(g, cyl(.32, .3, .04, "#C9A97A", 20), .3, ty + .02, .8); woodPlate.name = "pulpo-plate";
  for (let i = 0; i < 5; i++) add(g, cyl(.09, .09, .045, "#F1E6C8", 12), .3 + Math.cos(i * 1.26) * .16, ty + .06, .8 + Math.sin(i * 1.26) * .16);   // cachelos
  const pieces = Array.from({ length: 6 }, (_, i) => {
    const p = add(g, cyl(.055, .05, .022, "#9B3B4A", 10), .3 + Math.cos(i * 1.05 + .4) * .17, ty + .1, .8 + Math.sin(i * 1.05 + .4) * .17);
    add(p, cyl(.03, .03, .024, "#E2B0A6", 8), 0, .001, 0); p.userData.foodReaction = "hop"; return p;
  });
  void pieces;
  const secondPlate = add(g, cyl(.3, .28, .04, "#C9A97A", 20), 1.7, ty + .02, .7); void secondPlate;
  for (let i = 0; i < 4; i++) add(g, cyl(.085, .085, .04, "#F1E6C8", 12), 1.7 + Math.cos(i * 1.6) * .14, ty + .06, .7 + Math.sin(i * 1.6) * .14);
  add(g, cyl(.09, .09, .1, "#B7BEC4", 12), -.4, ty + .05, .55); add(g, cyl(.085, .085, .02, "#B2402B", 12), -.4, ty + .11, .55);   // the paprika tin, open
  add(g, cyl(.08, .07, .07, "#E9D9A6", 10), -.7, ty + .035, .8); for (let i = 0; i < 4; i++) add(g, ball(.018, ES.cal, 5), -.7 + Math.cos(i * 1.6) * .04, ty + .08, .8 + Math.sin(i * 1.6) * .04);   // coarse salt
  for (const x of [-.1, .9, 1.9]) { add(g, cyl(.08, .06, .05, ES.marmol, 12), x, ty + .025, 1.15); add(g, cyl(.07, .07, .015, "#7A2E2A", 12), x, ty + .05, 1.15); }   // white bowls of country wine
  for (let i = 0; i < 3; i++) add(g, ball(.07, "#D9B77A", 6), 1.3 + i * .16, ty + .05, .3).scale.set(1, .6, 1.5);
  // the raised tentacle, the scissors, the piece that falls and the paprika that follows it
  const tentacle = new THREE.Group(); tentacle.name = "pulpo-tentacle";
  for (let i = 0; i < 3; i++) { const seg = add(tentacle, cyl(.05 - i * .009, .043 - i * .009, .09, "#9B3B4A", 8), Math.sin(i * .8) * .03, -i * .085, 0); seg.rotation.z = Math.sin(i * .8) * .3; }
  const scissors = new THREE.Group(); scissors.name = "pulpo-scissors";
  const blade = [0, 1].map((i) => add(scissors, box(.22, .012, .03, "#C9CFD6"), .11, 0, (i ? .02 : -.02)));
  for (const i of [0, 1]) add(scissors, new THREE.Mesh(new THREE.TorusGeometry(.04, .01, 5, 10), mat(ES.hierro)), -.09, 0, i ? .03 : -.03);
  const cut = add(g, cyl(.055, .05, .022, "#9B3B4A", 10), .42, ty + .16, .42); cut.name = "pulpo-cut"; cut.visible = false;
  add(cut, cyl(.03, .03, .024, "#E2B0A6", 8), 0, .001, 0);
  const cutStart = cut.position.clone(), cutEnd = V(.3, ty + .12, .8);
  const paprika = Array.from({ length: 7 }, (_, i) => { const m = add(g, ball(.012, "#B2402B", 4), .3 + Math.cos(i) * .1, ty + .45, .8 + Math.sin(i) * .1); m.visible = false; return m; });
  // people: the pulpeira, her fire helper, four fairgoers, a child and a walker crossing the fair
  const pulpeira = add(g, resident("cook"), .55, .08, .05); pulpeira.rotation.y = .1;
  const heldArm = add(arms(pulpeira).left, tentacle, 0, arms(pulpeira).hand, .02); heldArm.rotation.x = 1.8;   // the tentacle hangs from the left hand
  const heldScissors = add(arms(pulpeira).right, scissors, 0, arms(pulpeira).hand, .05); heldScissors.rotation.y = Math.PI / 2; heldScissors.rotation.x = 1.25;
  const stoker = add(g, own(resident("galician")), -2.9, .08, .9); stoker.rotation.y = -1.0;
  add(arms(stoker).right, cyl(.02, .02, .8, "#5C3E2A", 5), 0, arms(stoker).hand, .1).rotation.x = 1.3;
  const fair: Figure[] = [sit(g, -.1, 1.8, Math.PI, "galician"), sit(g, .9, 1.8, Math.PI, "townsman")];
  for (const [i, x] of [1.9, 2.6].entries()) { const s = add(g, resident(i ? "townswoman" : "galician"), x, .08, 1.7); s.rotation.y = Math.PI - .3; fair.push(s); }
  const child = add(g, resident("child"), -1.2, .08, 1.9); child.rotation.y = Math.PI + .4;
  const walker = add(g, resident("carrier", false), -3.4, .08, 2.7); const walk = pacer(walker, V(-3.4, .08, 2.7), V(3.4, .08, 2.7), .34, 2);
  return life(g, "pulpoEs", [pulpeira, fair[0], stoker, ...fair.slice(1), child, walker], (t, k) => {
    boiling.forEach((b, i) => { const a = t * 1.1 + i; b.position.set(-2.2 + Math.cos(a) * (.18 + (i % 3) * .08), 1.05 + Math.max(0, Math.sin(t * 4 + i)) * .035, .2 + Math.sin(a) * (.18 + (i % 2) * .1)); });
    fireEs.forEach((f, i) => { const s = .85 + Math.sin(t * 8 + i * 2) * .18; f.scale.set(s, s, s); });
    // 1. food: the blades close, one piece drops onto the wooden plate and the paprika falls after it
    const close = beat(k, 0, .35), p = k > 0 ? clamp01(((1 - k) - .12) / .5) : 0;
    blade[0].rotation.y = .22 - close * .2; blade[1].rotation.y = -.22 + close * .2;
    scissors.rotation.x = 1.25 - close * .22;
    cut.visible = k > 0 && (1 - k) > .12 && (1 - k) < .85;
    cut.position.lerpVectors(cutStart, cutEnd, p); cut.position.y += Math.sin(p * Math.PI) * .12; cut.rotation.x = p * 2.2;
    const dust = k > 0 ? clamp01(((1 - k) - .45) / .35) : 0;
    paprika.forEach((m, i) => { m.visible = dust > 0 && dust < 1; m.position.y = ty + .45 - dust * .3 - (i % 3) * .01; });
    tentacle.rotation.z = beat(k, 0, .5) * .18; tentacle.rotation.x = 1.8 - beat(k, 0, .5) * .12;
    arms(pulpeira).left.rotation.x = -2.05 - beat(k, 0, .5) * .1;
    // 2. the pulpeira's cutting arm, 3. one fairgoer leans over the plate
    arms(pulpeira).right.rotation.x = -1.85 - close * .25;
    upper(fair[0]).rotation.x = beat(k, .55, 1) * .17;
    walk(t);
  });
}

/** The bread terrace above the Barcelona street: the tomato half rubs across the slice and the crumb turns red. */
export function panTerrace(): P {
  const g = group();
  const sh = shelter(g, "catalan", 6.0, 3.2, 2.6, { sign: "FORN" }); lamps(g, sh.y, sh.zFront, [-2.3, 2.3]);
  // the iron balcony and the curved trencadis balustrade that closes the terrace towards the street
  for (let i = 0; i <= 16; i++) add(g, box(.025, .5, .025, ES.hierro), -2.4 + i * .3, 1.35, 2.5);
  add(g, box(4.9, .05, .05, ES.hierro), 0, 1.62, 2.5); add(g, box(4.9, .05, .05, ES.hierro), 0, 1.12, 2.5);
  const rail = add(g, new THREE.Group(), 0, 0, 2.62);
  for (let i = 0; i < 18; i++) {
    const a = -1.25 + i * (2.5 / 17), x = Math.sin(a) * 3.4, z = Math.cos(a) * 3.4 - 3.0;
    const post = add(rail, box(.26, 1.0, .22, ES.cal), x, .5, z); post.rotation.y = a;
    for (let k = 0; k < 4; k++) add(post, box(.11, .11, .015, ["#2E5C8A", "#E0B45F", "#A4432B", "#EDE7DA"][(i + k) % 4]), -.06 + (k % 2) * .12, .62 + Math.floor(k / 2) * .16, .112);
  }
  const plane = add(g, new THREE.Group(), 3.5, 0, -1.4);   // a plane tree at the terrace edge, behind the board
  add(plane, cyl(.16, .22, 2.3, "#B9AE98", 7), 0, 1.15, 0);
  const leaves = Array.from({ length: 5 }, (_, i) => add(plane, ball(.62, i % 2 ? "#6F9B57" : "#5E8A4C", 7), Math.cos(i * 1.26) * .45, 2.5 + (i % 2) * .3, Math.sin(i * 1.26) * .45));
  // the work surface: a marble table, the board, the loaf, the cut slices, the halved tomatoes, oil and salt
  const my = .8; add(g, box(2.8, .06, 1.1, ES.marmol), 0, my - .03, .7);
  for (const dx of [-1.2, 1.2]) for (const dz of [-.4, .4]) add(g, box(.08, my - .06, .08, ES.hierro), dx, (my - .06) / 2, .7 + dz);
  const board = add(g, box(1.0, .05, .5, "#C9A97A"), -.4, my + .025, .7); board.name = "pa-board";
  const loaf = add(g, ball(.3, "#D9B77A", 9), -1.0, my + .12, .95); loaf.scale.set(1, .62, .7); loaf.userData.foodReaction = "hop";
  add(g, box(.42, .015, .26, "#E3C48E"), -1.0, my + .2, .95).rotation.z = .06;   // the cut face of the loaf
  const slice = add(g, box(.34, .045, .24, "#E3C48E"), -.42, my + .075, .7); slice.name = "pa-slice";
  const rubbed = add(g, box(.32, .012, .22, "#C9502E"), 0, .03, 0); rubbed.name = "pa-rubbed"; rubbed.scale.set(.02, 1, .02); slice.add(rubbed);
  for (const [i, x] of [.25, .55].entries()) { const s = add(g, box(.32, .045, .22, "#E3C48E"), x, my + .06, .95 - i * .2); add(s, box(.3, .012, .2, "#C9502E"), 0, .03, 0); add(s, box(.26, .01, .16, "#B0403A"), .01, .045, 0); s.userData.foodReaction = "hop"; }   // finished slices with ham
  add(g, cyl(.13, .11, .07, "#E9D9A6", 12), 1.15, my + .035, .55);
  const tomatoes = Array.from({ length: 3 }, (_, i) => { const m = add(g, ball(.075, "#D94F3A", 8), 1.15 + Math.cos(i * 2.1) * .06, my + .1, .55 + Math.sin(i * 2.1) * .06); m.scale.y = .8; m.userData.foodReaction = "hop"; return m; });
  const half = add(g, new THREE.Group(), -.42, my + .3, .48); half.name = "pa-tomato-half";
  add(half, ball(.075, "#D94F3A", 8), 0, 0, 0).scale.set(1, .5, 1); add(half, cyl(.07, .07, .01, "#E88A6A", 10), 0, -.038, 0);
  const halfRest = half.position.clone();
  add(g, cyl(.05, .07, .18, "#8FA64A", 8), .95, my + .09, .3); add(g, cyl(.012, .012, .1, "#8A8F94", 5), .95, my + .23, .3); add(g, cone(.02, .05, "#8A8F94", 5), .92, my + .29, .3).rotation.z = .8;   // the oil cruet
  add(g, cyl(.06, .05, .05, ES.marmol, 10), .72, my + .025, .28); for (let i = 0; i < 3; i++) add(g, ball(.014, ES.cal, 4), .72 + Math.cos(i * 2.1) * .03, my + .06, .28 + Math.sin(i * 2.1) * .03);
  // two cups of coffee: the one hot thing on the terrace, so the steam point has a real source
  for (const [i, x] of [1.7, 1.95].entries()) { add(g, cyl(.055, .045, .1, ES.cal, 10), x, my + .05, .9 - i * .18); add(g, cyl(.05, .05, .012, "#5A3B27", 10), x, my + .095, .9 - i * .18); }
  g.userData.steam = V(1.82, my + .32, .81);
  // people: the baker, a woman laying slices, three at the table, a child, a walker on the terrace lane
  const baker = add(g, resident("cook"), -.5, .08, .05); baker.rotation.y = Math.PI;
  const layer = add(g, own(resident("catalan")), .8, .08, .1); layer.rotation.y = Math.PI - .4;
  const guests = [sit(g, -.5, 1.55, Math.PI, "townswoman"), sit(g, .4, 1.55, Math.PI, "catalan")];
  const leaning = add(g, resident("townsman"), 1.6, .08, 1.5); leaning.rotation.y = Math.PI - .5; guests.push(leaning);
  const child = add(g, resident("child"), -1.9, .08, 1.5); child.rotation.y = .6;
  const walker = add(g, resident("carrier", false), -2.6, .08, 2.0); const walk = pacer(walker, V(-2.6, .08, 2.0), V(2.6, .08, 2.0), .3, 3);
  return life(g, "paTomaquet", [baker, guests[0], layer, ...guests.slice(1), child, walker], (t, k) => {
    leaves.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.1 + i) * .05; l.rotation.x = Math.cos(t * .9 + i) * .04; });
    tomatoes.forEach((m, i) => { m.rotation.y = Math.sin(t * .6 + i) * .2; });
    // 1. food: the tomato half sweeps across the slice and the red it leaves widens behind it
    const sweep = k > 0 ? clamp01(((1 - k) - .04) / .55) : 0, travel = k > 0 ? Math.sin(sweep * Math.PI * 2) * .5 + sweep : .5;
    half.position.set(halfRest.x + (travel - .5) * .3, halfRest.y - beat(k, .02, .7) * .2, halfRest.z + .22 * Math.min(1, sweep * 3));
    half.rotation.z = Math.sin(sweep * Math.PI * 4) * .25;
    rubbed.scale.set(.02 + sweep * .98, 1, .02 + sweep * .98);
    slice.rotation.z = Math.sin(sweep * Math.PI * 4) * .035;
    // 2. the baker's rubbing arm, 3. a guest leans in over the board
    arms(baker).right.rotation.x = -1.15 - Math.sin(sweep * Math.PI * 4) * .18 * (k > 0 ? 1 : 0);
    upper(guests[0]).rotation.x = beat(k, .55, 1) * .16;
    walk(t);
  });
}

/** The cheese farm on the dry plain: the press screw lowers and the whey runs out into the bucket. */
export function quesoFarm(): P {
  const g = group();
  const sh = shelter(g, "pizarra", 6.2, 3.4, 2.5, { sign: "QUESERÍA" }); lamps(g, sh.y, sh.zFront, [-2.4, 2.4]);
  const ristra = add(g, new THREE.Group(), 2.3, 2.1, sh.zBack + .2);
  for (let i = 0; i < 7; i++) add(ristra, cone(.04, .14, i % 3 ? "#C0392B" : "#8E2A22", 5), (i % 2) * .05, -.1 - i * .13, 0).rotation.z = Math.PI + (i % 2 ? .3 : -.3);
  // the copper vat over a small fire: the milk is warmed before it sets, so the steam has a real source
  add(g, cyl(.5, .55, .1, ES.granito, 14), -1.9, .09, -.5);
  const vatFire = Array.from({ length: 3 }, (_, i) => add(g, cone(.07, .2, i % 2 ? "#F2A03C" : "#E9612D", 6), -1.9 + Math.cos(i * 2.1) * .12, .28, -.5 + Math.sin(i * 2.1) * .12));
  add(g, cyl(.44, .38, .42, "#B87333", 16), -1.9, .55, -.5);
  const milk = add(g, cyl(.4, .4, .02, "#F7F2E6", 16), -1.9, .74, -.5); milk.name = "queso-milk";
  g.userData.steam = V(-1.9, 1.1, -.5); g.userData.smoke = V(-1.9, .7, -.5);
  // the draining table: the pleita band, the press, the wheel, the cut wedge and the whey bucket
  const dy = .84; add(g, box(2.6, .07, 1.1, "#C9A97A"), .3, dy - .035, .1);
  for (const dx of [-1.1, 1.1]) for (const dz of [-.4, .4]) add(g, box(.09, dy - .07, .09, ES.castano), .3 + dx, (dy - .07) / 2, .1 + dz);
  add(g, box(2.6, .03, .1, "#B8945F"), .3, dy + .015, .64).rotation.x = .12;   // the lip the whey runs off
  const mould = add(g, new THREE.Group(), -.2, dy, .1); mould.name = "queso-mould";
  add(mould, new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .22, 18, 1, true), mat("#C9A15A", { side: THREE.DoubleSide })), 0, .11, 0);
  for (let i = 0; i < 10; i++) add(mould, box(.09, .21, .012, "#B8894A"), Math.cos(i * .63) * .28, .11, Math.sin(i * .63) * .28).rotation.y = -i * .63;   // the esparto zig-zag
  const curd = add(mould, cyl(.26, .26, .16, "#F3EEDE", 18), 0, .09, 0); curd.name = "queso-curd"; curd.userData.foodReaction = "contents";
  const press = add(g, new THREE.Group(), -.2, dy + .58, .1); press.name = "queso-press";
  add(press, cyl(.27, .27, .05, ES.castano, 16), 0, 0, 0); add(press, cyl(.03, .03, .5, ES.hierro, 8), 0, .28, 0);
  add(press, box(.44, .05, .05, ES.castano), 0, .52, 0);
  for (const dx of [-.42, .42]) add(g, box(.08, 1.3, .08, ES.castano), -.2 + dx, dy + .65, .1);
  add(g, box(1.0, .08, .1, ES.castano), -.2, dy + 1.28, .1);
  const bucket = add(g, cyl(.16, .13, .26, "#8A8F94", 12), .3, .13, .95); bucket.name = "queso-bucket";
  add(g, cyl(.14, .14, .02, "#EFEAD8", 12), .3, .22, .95);
  const whey = stream(g, "queso-whey", "#F1ECDC", .016);
  const drip = add(g, ball(.022, "#F1ECDC", 5), .3, dy - .02, .68); drip.name = "queso-drip";
  const wheel = add(g, new THREE.Group(), .9, dy + .07, -.05); wheel.name = "queso-wheel";
  add(wheel, cyl(.26, .26, .14, "#E8DFC2", 20), 0, 0, 0);
  for (let i = 0; i < 12; i++) add(wheel, box(.1, .13, .012, "#D8CCA8"), Math.cos(i * .52) * .26, 0, Math.sin(i * .52) * .26).rotation.y = -i * .52;
  for (let i = 0; i < 6; i++) add(wheel, box(.04, .012, .12, "#D8CCA8"), Math.cos(i * 1.05) * .1, .072, Math.sin(i * 1.05) * .1).rotation.y = i * 1.05;   // the flower on the face
  const wedge = add(g, cyl(.24, .24, .13, "#F3EEDE", 3), 1.5, dy + .065, .3); wedge.rotation.y = .7; wedge.userData.foodReaction = "lift";
  add(g, cyl(.245, .245, .01, "#C9A15A", 3), 1.5, dy + .135, .3).rotation.y = .7;
  // a rack of older wheels along the back wall, turned every week
  for (let s = 0; s < 3; s++) { add(g, box(2.2, .05, .5, ES.castano), 1.0, 1.0 + s * .5, sh.zBack + .35); for (let i = 0; i < 3; i++) add(g, cyl(.19, .19, .11, s ? "#E0D3AE" : "#E8DFC2", 16), .3 + i * .7, 1.08 + s * .5, sh.zBack + .35); }
  for (const x of [-.1, 2.1]) add(g, box(.07, 1.6, .5, ES.castano), x, .8, sh.zBack + .35);
  // people: the cheesemaker, a woman turning wheels, two buyers, a shepherd at the door, a child, a walker
  const maker = add(g, resident("cook"), -.2, .08, .85); maker.rotation.y = Math.PI;
  const turner = add(g, own(resident("townswoman")), 1.6, .08, sh.zBack + .95); turner.rotation.y = 0;
  const buyers = [sit(g, -1.4, 1.6, Math.PI, "townsman"), sit(g, -.5, 1.7, Math.PI, "townswoman")];
  const herd = add(g, resident("shepherd"), 2.6, .08, 1.3); herd.rotation.y = Math.PI - .7;
  add(arms(herd).left, cyl(.02, .02, 1.3, "#7A5A3A", 5), 0, arms(herd).hand + .35, 0);
  const child = add(g, resident("child"), .9, .08, 1.9); child.rotation.y = Math.PI;
  const walker = add(g, resident("carrier", false), -2.8, .08, 2.4); const walk = pacer(walker, V(-2.8, .08, 2.4), V(2.8, .08, 2.4), .32, 4);
  return life(g, "manchegoEs", [maker, buyers[0], turner, buyers[1], herd, child, walker], (t, k) => {
    ristra.rotation.x = Math.sin(t * 1.3) * .07; ristra.rotation.z = Math.sin(t * .9) * .04;
    vatFire.forEach((f, i) => { const s = .8 + Math.sin(t * 9 + i * 2) * .2; f.scale.set(s, s, s); });
    milk.rotation.y = t * .25; milk.scale.setScalar(1 + Math.sin(t * 1.6) * .012);
    // the whey never stops: one drop gathers at the lip and falls into the bucket
    const cycle = (t * .55) % 1;
    drip.position.set(.3, dy - .02 - cycle * cycle * .55, .68); drip.scale.setScalar(cycle < .08 ? cycle / .08 : 1); drip.visible = cycle < .96;
    // 1. material: the screw lowers, the curd is squeezed and the whey runs off the lip into the bucket
    const down = beat(k, 0, .6);
    press.position.y = dy + .58 - down * .17; press.rotation.y = -down * 2.4;
    whey.set(V(.3, dy + .02, .66), V(.3, .24, .95), k > 0 && (1 - k) > .1 && (1 - k) < .7);
    wheel.rotation.y = beat(k, .45, 1) * .5;
    // 2. the cheesemaker leans on the press bar, 3. a buyer looks over the table
    arms(maker).right.rotation.x = -1.3 - down * .3; arms(maker).left.rotation.x = -1.3 - down * .3;
    upper(buyers[0]).rotation.x = beat(k, .55, 1) * .15;
    walk(t);
  });
}

/** How far across his body the escanciador swings the raised bottle, and where the low glass is held under it.
 *  Tuned so the cider falls within a few centimetres of vertical; `spain-reactions.mjs` guards the lean. */
const ARM_ACROSS = .18, GLASS_ACROSS = .165, GLASS_AHEAD = .05;
/** The same for the venenciador's copita, held out under the silver cup of the raised cane. */
const COPITA_ACROSS = .2, COPITA_AHEAD = .22;

/** The cider house: the bottle rises to full arm height, the stream breaks into the tilted glass and splashes at the feet. */
export function sidreria(): P {
  const g = group();
  const sh = shelter(g, "granito", 5.4, 3.4, 2.6, { sign: "LLAGAR" }); lamps(g, sh.y, sh.zFront, [-1.8, 1.8]);
  add(g, horreoBody(), 3.6, 0, -2.6);   // the granary beside the cider room
  for (const [i, [x, z]] of ([[-3.4, -2.2], [-3.2, .6]] as [number, number][]).entries()) {
    const tr = add(g, new THREE.Group(), x, 0, z);
    add(tr, cyl(.13, .18, 1.0, "#6B5340", 6), 0, .5, 0);
    for (let j = 0; j < 4; j++) add(tr, ball(.5, j % 2 ? "#5E8A4C" : "#6F9B57", 7), Math.cos(j * 1.57) * .32, 1.5 + (j % 2) * .22, Math.sin(j * 1.57) * .32);
    for (let j = 0; j < 6; j++) add(tr, ball(.075, j % 2 ? "#C0392B" : "#C9A02B", 6), Math.cos(j * 1.05 + i) * .58, 1.25 + (j % 3) * .25, Math.sin(j * 1.05 + i) * .58);
  }
  // the beam press and the barrels along the back wall
  add(g, box(1.6, .28, 1.2, ES.castano), -1.8, .14, sh.zBack + .8);
  add(g, box(.34, 1.9, .34, ES.castano), -2.5, .95, sh.zBack + .8); add(g, box(.34, 1.9, .34, ES.castano), -1.1, .95, sh.zBack + .8);
  const pressBeam = add(g, box(3.4, .26, .3, ES.castano), -1.4, 1.75, sh.zBack + .8); pressBeam.rotation.z = -.05;
  add(g, cyl(.09, .09, 1.1, ES.castano, 8), -.1, 1.2, sh.zBack + .8);
  add(g, cyl(.22, .26, .5, ES.granito, 12), -.1, .25, sh.zBack + .8);
  for (const [i, x] of [1.2, 2.2].entries()) { const b = add(g, cyl(.42, .38, 1.3, ES.castano, 14), x, .45, sh.zBack + .7); b.rotation.z = Math.PI / 2; for (const dx of [-.4, 0, .4]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.4, .025, 5, 14), mat(ES.hierro)), x + dx, .45, sh.zBack + .7).rotation.y = Math.PI / 2; void i; }
  // crates of apples: the always-on loop is the pile settling as the crate is nudged
  const appleCrates = [crate(g, -2.6, 1.5, "#C0392B", 6, .085), crate(g, -2.6, 2.1, "#C9A02B", 6, .085)];
  appleCrates.forEach((c) => c.children.forEach((a) => (a.userData.foodReaction = "hop")));
  // the table: wide thin glasses, bread, a bowl of cheese
  const ty = table(g, 2.2, .5, 2.4, 1.0, "#A88A5C", .76);
  for (const x of [1.4, 2.2, 3.0] as number[]) glassOf(g, x, ty, .5, "#E9D98A", .075, .1);
  add(g, cyl(.16, .13, .06, ES.marmol, 12), 1.8, ty + .03, .15); for (let i = 0; i < 4; i++) add(g, box(.09, .06, .09, "#F3EEDE"), 1.8 + Math.cos(i * 1.6) * .07, ty + .09, .15 + Math.sin(i * 1.6) * .07);
  for (let i = 0; i < 3; i++) add(g, ball(.08, "#D9B77A", 6), 2.7 + i * .14, ty + .06, .15).scale.set(1, .6, 1.5);
  // The pour is one man's work: the escanciador holds the bottle above his head in the right hand and the wide
  // glass low in the left, out in front of his hip and directly under the bottle mouth, so the cider falls the
  // whole way instead of crossing the room. He stands side-on at the front of the bay, clear of the counter.
  const pourer = add(g, resident("cook"), -.25, .08, 1.15); pourer.rotation.y = .38;
  const bottleEs = add(arms(pourer).right, new THREE.Group(), 0, arms(pourer).hand, 0); bottleEs.name = "sidra-bottle";
  add(bottleEs, cyl(.05, .055, .3, "#3B5A3A", 10), 0, -.15, 0); add(bottleEs, cyl(.02, .045, .12, "#3B5A3A", 8), 0, .04, 0);
  const wide = add(arms(pourer).left, new THREE.Group(), GLASS_ACROSS, arms(pourer).hand, GLASS_AHEAD); wide.name = "sidra-glass";
  add(wide, new THREE.Mesh(new THREE.CylinderGeometry(.085, .06, .1, 12, 1, true), mat(ES.vidrio, { side: THREE.DoubleSide, transparent: true, opacity: .55 })), 0, -.05, 0);
  const culin = add(wide, cyl(.07, .055, .02, "#E9D98A", 10), 0, -.08, 0); culin.name = "sidra-culin";
  const cider = pourFall(g, "sidra-stream", "#E9D98A", .028);
  // what breaks at the glass, and what misses it and wets the stone at his feet
  const lipSplash = splashRings(g, 3, 0, 0, 0, .055, "#E9D98A");
  const splash = splashRings(g, 5, -.1, .05, 1.5, .09, "#E9D98A");
  add(g, box(1.6, .02, 1.2, "#7E8288"), -.1, .05, 1.5);   // the wet stone where the cider lands
  // the rest of the room: three drinkers, two at the table, a child, a walker to the orchard
  const drinkers: Figure[] = [];
  const holder = add(g, resident("basque", true), .75, .08, 1.0); holder.rotation.y = Math.PI + .5;
  const emptyGlass = add(arms(holder).left, new THREE.Group(), 0, arms(holder).hand, 0);
  add(emptyGlass, new THREE.Mesh(new THREE.CylinderGeometry(.085, .06, .1, 12, 1, true), mat(ES.vidrio, { side: THREE.DoubleSide, transparent: true, opacity: .55 })), 0, -.05, 0);
  for (const [i, x] of [1.7, 2.5].entries()) { const d = add(g, resident(i ? "townswoman" : "galician"), x, .08, .5); d.rotation.y = Math.PI + .8; drinkers.push(d); }
  drinkers.push(sit(g, 1.6, 1.3, 0, "basque"), sit(g, 2.8, 1.3, 0, "townsman"));
  const child = add(g, resident("child"), -1.5, .08, 2.2); child.rotation.y = .9;
  const walker = add(g, resident("carrier", false), -3.2, .08, 2.9); const walk = pacer(walker, V(-3.2, .08, 2.9), V(3.2, .08, 2.9), .3, 5);
  const mouth = V(), lip = V();
  return life(g, "sidreriaEs", [pourer, holder, ...drinkers, child, walker], (t, k, dt) => {
    void dt;
    appleCrates.forEach((c, i) => { c.rotation.y = Math.sin(t * .5 + i) * .04; });
    pressBeam.rotation.z = -.05 + Math.sin(t * .35) * .006;
    // 1. material: the bottle arm reaches full height and the cider falls the whole way into the tilted glass
    const raise = beat(k, 0, .75);
    arms(pourer).right.rotation.x = -.35 - raise * 2.5; arms(pourer).right.rotation.z = ARM_ACROSS * raise;
    bottleEs.rotation.x = raise * 2.4;
    arms(pourer).left.rotation.x = -.08 - raise * .14; arms(pourer).left.rotation.z = .45 + raise * .18;
    // the glass follows the bottle out as the arm comes down, so the fall stays under the mouth the whole way
    wide.position.set(GLASS_ACROSS, arms(pourer).hand, GLASS_AHEAD + (1 - raise) * .19);
    wide.rotation.z = -.2 - raise * .32;
    g.updateWorldMatrix(true, true);
    // both ends are read from the real objects: the bottle's mouth and the glass's lip
    bottleEs.localToWorld(mouth.set(0, .1, 0)); g.worldToLocal(mouth);
    wide.getWorldPosition(lip); g.worldToLocal(lip);
    const progress = 1 - k, pouring = k > 0 && progress > .18 && progress < .60;
    cider.set(mouth, lip, pouring);
    culin.scale.setScalar(1 + (pouring ? clamp01((progress - .18) / .4) * .5 : 0));
    // the fall breaks where it enters the glass, and what misses it wets the stone at his feet
    const burst = k > 0 ? clamp01((progress - .22) / .3) : 0;
    lipSplash.forEach((m, i) => {
      m.visible = pouring; m.position.set(lip.x + Math.cos(i * 2.1) * .05, lip.y + .02 + i * .012, lip.z + Math.sin(i * 2.1) * .05);
      m.scale.setScalar(.35 + burst * (.8 + i * .25)); (m.material as THREE.MeshStandardMaterial).opacity = .8 * (1 - burst * .6);
    });
    const wet = k > 0 ? clamp01((progress - .3) / .5) : 0;
    splash.forEach((m, i) => { m.visible = wet > 0 && wet < 1; m.scale.setScalar(.4 + wet * (1.4 + i * .2)); (m.material as THREE.MeshStandardMaterial).opacity = .75 * (1 - wet); });
    // 3. one drinker turns to watch the stream
    upper(drinkers[0]).rotation.y = Math.sin(t * .5) * .1 - beat(k, .5, 1) * .4;
    walk(t);
  });
}

/** The sherry bodega: the venencia rises out of the butt and a thin thread of wine reaches the copita. */
export function jerezBodega(): P {
  const g = group();
  add(g, bodegaNave(), 0, 0, -3.2);
  add(g, box(7.0, .08, 5.2, ES.albero), 0, .04, .2);   // the sand floor, watered every afternoon
  for (const x of [-2.8, 2.8]) add(g, cyl(.12, .14, 3.2, ES.castano, 8), x, 1.6, 1.9);
  const beam = add(g, box(6.0, .2, .24, ES.castano), 0, 3.3, 1.9); beam.name = "front-beam"; lamps(g, 3.3, 1.9, [-1.8, 1.8]);
  for (const z of [-.6, 1.9]) add(g, box(6.0, .16, .2, ES.castano), 0, 3.3, z);
  // the three-tier solera: butts on their sides on timber rails, the top tier opened
  const butts: THREE.Group[] = [];
  for (let tier = 0; tier < 3; tier++) {
    const y = .55 + tier * .95;
    const post = y - .46;   // the timber uprights run from the sand floor to the tier they carry
    if (post > .06) for (const x of [-2.9, -.1, 2.7]) add(g, box(.16, post, .9, ES.castano), x, post / 2, -1.6);
    else for (const x of [-2.9, -.1, 2.7]) add(g, box(.24, .1, .9, ES.castano), x, .05, -1.6);
    for (let i = 0; i < 3; i++) {
      const b = add(g, new THREE.Group(), -1.9 + i * 1.9, y, -1.6); butts.push(b);
      const body = add(b, cyl(.46, .42, 1.5, ES.castano, 16), 0, 0, 0); body.rotation.z = Math.PI / 2;
      for (const dx of [-.5, -.15, .15, .5]) add(b, new THREE.Mesh(new THREE.TorusGeometry(.44, .03, 5, 16), mat(ES.hierro)), dx, 0, 0).rotation.y = Math.PI / 2;
      if (tier === 2 && i === 1) { const lid = add(b, cyl(.2, .2, .03, ES.castano, 14), 0, .44, 0); lid.position.x = .3; lid.rotation.z = .4; }
    }
  }
  const openButt = butts[butts.length - 2];
  const flor = add(openButt, cyl(.19, .19, .012, "#EDE7D2", 16), 0, .40, 0); flor.name = "bodega-flor"; flor.userData.foodReaction = "contents";
  add(openButt, cyl(.2, .2, .04, "#6B4B2A", 16), 0, .385, 0);
  const buttTop = V(-.1 + 0, 2.85, -1.6);
  // the butt head used as a table: the copita, a plate of jamon and olives, the chalk mark
  const headY = .55; add(g, cyl(.46, .46, .06, ES.castano, 16), 1.4, 1.03, .9); add(g, cyl(.42, .46, 1.0, ES.castano, 16), 1.4, .5, .9);
  for (const dy of [.2, .8]) add(g, new THREE.Mesh(new THREE.TorusGeometry(.45, .03, 5, 16), mat(ES.hierro)), 1.4, dy, .9);
  void headY;
  // A second copita and the tasting plates stay on the butt head; the one that fills is the one in his hand.
  const spareCopita = add(g, new THREE.Group(), 1.75, 1.06, .75);
  add(spareCopita, cyl(.055, .028, .13, ES.vidrio, 12), 0, .1, 0); add(spareCopita, cyl(.008, .008, .05, ES.vidrio, 6), 0, .025, 0); add(spareCopita, cyl(.045, .045, .012, ES.vidrio, 12), 0, .006, 0);
  plate(g, 1.72, 1.06, 1.15, .14); for (let i = 0; i < 4; i++) add(g, box(.11, .006, .06, "#B0403A"), 1.72 + Math.cos(i * 1.6) * .05, 1.1 + i * .006, 1.15 + Math.sin(i * 1.6) * .05).rotation.y = i * .7;
  plate(g, 1.1, 1.06, 1.2, .1); for (let i = 0; i < 5; i++) add(g, ball(.026, "#8FA64A", 5), 1.1 + Math.cos(i * 1.25) * .05, 1.1, 1.2 + Math.sin(i * 1.25) * .05);
  // the venencia: a whalebone cane with a small silver cup, and the thread it pours. The venenciador stands clear
  // of the solera at the front of the nave, the cane up in his right hand and the copita out in his left, directly
  // under the silver cup, so the thread falls straight down instead of running across the room on a diagonal.
  const capataz = add(g, resident("cook"), .75, .08, 1.45); capataz.rotation.y = .2;
  const copita = add(arms(capataz).left, new THREE.Group(), COPITA_ACROSS, arms(capataz).hand, COPITA_AHEAD); copita.name = "bodega-copita";
  add(copita, cyl(.055, .028, .13, ES.vidrio, 12), 0, .1, 0); add(copita, cyl(.008, .008, .05, ES.vidrio, 6), 0, .025, 0); add(copita, cyl(.045, .045, .012, ES.vidrio, 12), 0, .006, 0);
  const wine = add(copita, cyl(.045, .03, .01, "#E3B85A", 12), 0, .06, 0); wine.name = "bodega-wine";
  const venencia = add(arms(capataz).right, new THREE.Group(), 0, arms(capataz).hand, 0); venencia.name = "bodega-venencia";
  venencia.rotation.x = Math.PI;   // the cane stands up out of the hand, the cup at its top end
  add(venencia, cyl(.008, .008, .9, "#C9CFD6", 6), 0, -.45, 0);
  const cupEs = add(venencia, cyl(.035, .03, .09, "#C9CFD6", 10), 0, -.93, 0);
  add(venencia, cyl(.03, .03, .012, "#3A2A1E", 10), 0, .01, 0);
  const thread = pourFall(g, "bodega-thread", "#8A5A24", .009);
  // the shaft of light from a high window, with dust turning in it
  const shaft = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.5, .95, 3.4, 12, 1, true), mat("#F6E8BE", { transparent: true, opacity: .1, side: THREE.DoubleSide, emissive: "#F6E8BE", emissiveIntensity: .25 })), -1.6, 1.8, -.2);
  shaft.rotation.z = .18;
  const motes = Array.from({ length: 9 }, (_, i) => add(g, ball(.018, "#F6E8BE", 4), -1.6 + Math.cos(i) * .4, .5 + i * .3, -.2 + Math.sin(i) * .4));
  // people: the capataz, an arumbador watering the floor, two buyers at the butt head, two rolling a butt, a child
  // the arumbador waters the sand between the solera and the butt head, behind the pour rather than across it
  const waterer = add(g, resident("carrier", false), -2.4, .08, -.2); const walk = pacer(waterer, V(-2.4, .08, -.2), V(1.0, .08, -.2), .26, 3);
  add(arms(waterer).left, cyl(.09, .075, .18, "#7A9A8A", 8), 0, arms(waterer).hand - .1, 0);
  const buyers = [add(g, resident("townsman"), 2.2, .08, 1.1), add(g, resident("townswoman"), 2.5, .08, 1.8)];
  buyers[0].rotation.y = -1.3; buyers[1].rotation.y = -1.1;
  const rollers = [add(g, own(resident("andalus")), -2.2, .08, .6), add(g, own(resident("catalan")), -1.4, .08, .9)];
  rollers.forEach((p, i) => { p.rotation.y = 1.2 + i * .3; arms(p).left.rotation.x = -1.4; arms(p).right.rotation.x = -1.4; });
  const spare = add(g, cyl(.42, .38, 1.3, ES.castano, 14), -1.8, .42, 1.3); spare.rotation.z = Math.PI / 2;
  const child = add(g, resident("child"), 2.6, .08, 1.2); child.rotation.y = Math.PI - .6;
  const tip = V(), target = V();
  return life(g, "bodegaJerez", [capataz, buyers[0], ...rollers, buyers[1], child, waterer], (t, k) => {
    flor.scale.set(1 + Math.sin(t * .5) * .03, 1, 1 + Math.cos(t * .4) * .03);
    motes.forEach((m, i) => { const a = t * .12 + i; m.position.set(-1.6 + Math.cos(a) * (.25 + (i % 3) * .12), .4 + ((t * .14 + i * .38) % 3) , -.2 + Math.sin(a) * (.25 + (i % 3) * .12)); });
    // 1. material: the venencia comes up out of the butt and lets a thin thread down into the copita
    const rise = beat(k, 0, .62);
    arms(capataz).right.rotation.x = -.5 - rise * 2.05; arms(capataz).right.rotation.z = -.06 - rise * .06;
    // the wrist keeps the cane upright whatever the arm is doing, which is how a venenciador carries it:
    // the silver cup rides at the top of the cane, straight above the hand and above the copita below it
    venencia.rotation.x = Math.PI - arms(capataz).right.rotation.x; venencia.rotation.z = .06;
    arms(capataz).left.rotation.x = -.5 - rise * .35; arms(capataz).left.rotation.z = .5 + rise * .1;
    // the copita follows the cane out as the arm falls, so the thread stays under the cup all the way down
    copita.position.set(COPITA_ACROSS, arms(capataz).hand, COPITA_AHEAD + (1 - rise) * .1);
    g.updateWorldMatrix(true, true);
    cupEs.getWorldPosition(tip); g.worldToLocal(tip);
    copita.localToWorld(target.set(0, .16, 0)); g.worldToLocal(target);
    const progress = 1 - k, pouring = k > 0 && progress > .22 && progress < .68;
    thread.set(tip, target, pouring);
    const fill = k > 0 ? clamp01((progress - .24) / .45) : 0;
    wine.scale.set(1, 1 + fill * 2.6, 1); wine.position.y = .06 + fill * .013;
    upper(buyers[0]).rotation.x = beat(k, .58, 1) * .15;
    walk(t);
  });
}

// ---------- ingredient stops: one crop, animal, tree or vessel responds, one or two workers ----------

/** The port: the boats rock and a crate of anchovies lifts from the deck onto the quay. */
export function fishingPort(): P {
  const g = group();
  add(g, box(9, .5, 2.6, ES.granito), 0, .25, 0);
  add(g, box(1.6, .5, 5, ES.granito), 3.6, .25, -2.6);
  add(g, cyl(.32, .4, 2.2, ES.cal, 10), 3.6, 1.6, -4.6); add(g, cyl(.34, .34, .36, ES.almagre, 10), 3.6, 2.5, -4.6);
  add(g, umbrellaPine(.8), -4.6, 0, 1.6); add(g, umbrellaPine(.7), 4.8, 0, 1.4);
  const boats: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const b = add(g, new THREE.Group(), -2.8 + i * 2.7, .06, -2.4 + (i % 2) * .5); b.rotation.y = .18 - i * .2; boats.push(b);
    add(b, box(2.3, .46, .95, i === 1 ? ES.talavera : ES.cal), 0, .23, 0);
    add(b, box(2.3, .08, 1.0, i === 1 ? ES.cal : ES.almagre), 0, .48, 0);
    add(b, cyl(.035, .035, 1.9, "#C9A37A", 5), .25, 1.4, 0);
    add(b, box(.22, .3, .02, ES.almagre), .4, 2.15, 0);
    for (let k = 0; k < 3; k++) add(b, ball(.08, k % 2 ? "#B3BFC9" : "#7F93A6", 7), -.6 + k * .3, .55, 0).scale.set(1.8, .5, 1);
  }
  for (let i = 0; i < 5; i++) add(g, cyl(.035, .035, 1.0, ES.castano, 5), -4.0 + i * 1.8, .95, -1.1);
  add(g, new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3, 6, 3), new THREE.MeshStandardMaterial({ color: "#C9B45A", wireframe: true })), -3.1, 1.05, -1.1);
  const quayCrates: THREE.Group[] = [];
  for (const [i, x] of [-2.6, -1.3, 0].entries()) quayCrates.push(crate(g, x, .7, ["#B3BFC9", "#F08A6A", "#8A7A70"][i], 6, .065, .5));
  quayCrates.forEach((c) => c.children.forEach((f) => (f.userData.foodReaction = "hop")));
  const lifted = add(g, new THREE.Group(), -.1, .55, -2.4); lifted.name = "port-crate"; lifted.visible = false;
  add(lifted, box(.62, .28, .44, "#A88A5C"), 0, .14, 0);
  for (let i = 0; i < 4; i++) add(lifted, ball(.055, "#8A7A70", 5), -.18 + i * .12, .3, 0).scale.set(1.8, .5, 1);
  const liftStart = lifted.position.clone(), liftEnd = V(1.1, .78, .6);
  const gull = add(g, new THREE.Group(), 3.6, 2.85, -4.6); add(gull, ball(.1, "#F4F1EA", 7), 0, 0, 0).scale.set(1.3, .7, 1);
  for (const side of [-1, 1]) add(gull, box(.26, .02, .1, "#F4F1EA"), side * .16, .02, 0);
  const fisher = add(g, own(resident("basque")), 1.0, .5, -1.2); fisher.rotation.y = -1.9;
  add(g, box(.46, .42, .46, ES.castano), 2.35, .71, -.85);   // an upturned crate on the quay to mend nets from
  const mender = seatFigure(g, resident("galician"), 2.3, -.85, .7, .92);
  return life(g, "fishMed", [fisher, mender], (t, k) => {
    boats.forEach((b, i) => { b.position.y = .06 + Math.sin(t * 1.1 + i) * .05 + beat(k, 0, .8) * .12 * (i === 1 ? 1.6 : .7); b.rotation.z = Math.sin(t * .85 + i) * .05 + beat(k, 0, .8) * .07; });
    const p = k > 0 ? clamp01(((1 - k) - .05) / .62) : 0;
    lifted.visible = k > 0 && (1 - k) > .05 && (1 - k) < .92;
    lifted.position.lerpVectors(liftStart, liftEnd, p); lifted.position.y += Math.sin(p * Math.PI) * .45;
    arms(fisher).right.rotation.x = -.5 - beat(k, .05, .7) * 1.4; arms(fisher).left.rotation.x = -.5 - beat(k, .05, .7) * 1.4;
    gull.position.set(3.6 + Math.sin(t * .5) * .3, 2.85 + beat(k, .5, 1) * 1.1, -4.6 + Math.cos(t * .5) * .3);
    gull.children.slice(1).forEach((w, i) => { w.rotation.z = Math.sin(t * 6 + i * Math.PI) * .35 * (k > .1 ? 1 : .25); });
  });
}

/** The grove beside the huerta: orange trees and almond blossom, and the fruit drops into the pickers' crates. */
export function orangeGrove(): P {
  const g = group();
  const trees: THREE.Object3D[] = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) trees.push(add(g, citrusTree("orange", .95 + (i + j) % 3 * .1), -3.6 + j * 2.4, 0, -1.2 + i * 2.4));
  // The almond row stands behind the orange trees; in front of them it hid the picking from the arrival camera.
  for (let i = 0; i < 5; i++) {
    const al = add(g, new THREE.Group(), -3.4 + i * 1.7, 0, -2.8);
    add(al, cyl(.06, .1, 1.1, "#8A6A3A", 6), 0, .55, 0); add(al, ball(.42, "#7A5A3A", 7), 0, 1.3, 0).scale.set(1, .62, 1);
    for (let k = 0; k < 6; k++) add(al, ball(.06, k % 2 ? "#E9D7A8" : "#FBF5EA", 5), Math.cos(k * 1.05) * .34, 1.3 + Math.sin(k) * .12, Math.sin(k * 1.05) * .28);
  }
  // The crates stand clear of the front row, so the fruit falls in the open rather than behind a crown.
  const baskets = [-1.0, .6].map((x) => { crate(g, x, 2.6, "#F08A2A", 6, .085); return V(x, .38, 2.6); });
  const picker = add(g, own(resident("huertano")), 2.4, 0, 2.2); picker.rotation.y = -1.1;
  const carrier = add(g, resident("townswoman"), -2.6, 0, 3.4); const walk = pacer(carrier, V(-2.6, 0, 3.4), V(2.6, 0, 3.6), .28, 2);
  const crop = harvest(g, [trees[5], trees[1], trees[6]], baskets);
  return life(g, "oranges", [picker, carrier], (t, k, dt) => {
    crop.tick(t, k, dt);
    arms(picker).right.rotation.x = -1.7 + Math.sin(t * (1 + k * 3)) * (.12 + k * .2);
    walk(t);
  }, crop.poke);
}

/** Jaen's groves and the mill: the stone turns in its basin and the first oil runs from the press into the jar. */
export function oliveMillEs(): P {
  const g = group();
  const trees: THREE.Object3D[] = [];
  for (const [x, z] of [[-4.5, -2.4], [-4.3, 1.2], [4.3, -2.4], [4.5, 1.0]] as [number, number][]) {
    const tr = add(g, oliveTree(1.15), x, 0, z); trees.push(tr);
    (tr.userData as { fruits?: THREE.Mesh[] }).fruits = (tr.userData as { olives?: THREE.Mesh[] }).olives;
  }
  // the mill house: a low stone shed with an open front where the stone turns
  // The shed stands behind the basin with its open front towards the visitor: it used to stand between the
  // arrival camera and the stone it shelters, which hid the whole reaction from every azimuth.
  add(g, box(4.4, 2.0, 3.0, ES.piedra), .4, 1.0, -3.0); add(g, box(2.6, 1.5, .1, ES.castano), .4, .75, -1.52);
  for (const side of [-1, 1]) { const r = add(g, box(4.8, .12, 2.0, ES.teja), .4, 2.35, -3.0 + side * .75); r.rotation.x = side * .52; }
  add(g, box(4.9, .1, .14, "#C56A42"), .4, 2.76, -3.0);
  const beam = add(g, box(3.4, .16, .2, ES.castano), .4, 2.12, 1.55); beam.name = "front-beam"; lamps(g, 2.12, 1.55, [-1.3, 2.1], .8);
  // the basin and the vertical stone the mule turns
  add(g, cyl(1.25, 1.3, .3, ES.granito, 20), .4, .15, .2); add(g, cyl(1.1, 1.1, .06, "#6E5A3E", 20), .4, .3, .2);
  const stoneArm = add(g, new THREE.Group(), .4, .33, .2); stoneArm.name = "mill-arm";
  add(stoneArm, cyl(.11, .11, .9, ES.castano, 8), 0, .45, 0);
  add(stoneArm, box(3.4, .12, .12, ES.castano), .1, .82, 0);   // the beam runs through the axle: the stone on one arm, the mule harnessed to the other
  const runner = add(stoneArm, cyl(.45, .45, .22, ES.granito, 18), .8, .34, 0); runner.rotation.z = Math.PI / 2; runner.name = "mill-stone";
  const paste = add(g, cyl(1.0, 1.0, .03, "#5E5A3A", 20), .4, .34, .2); paste.name = "mill-paste";
  // the press and the jar it runs into
  add(g, box(1.1, .9, 1.1, ES.granito), 2.6, .45, -1.5); add(g, cyl(.42, .42, .12, ES.castano, 14), 2.6, .96, -1.5);
  for (let i = 0; i < 4; i++) add(g, cyl(.4, .4, .07, "#9A8A6A", 14), 2.6, 1.05 + i * .08, -1.5);   // the esparto mats stacked under the screw
  add(g, cyl(.05, .05, 1.2, ES.hierro, 8), 2.6, 1.8, -1.5); add(g, box(1.0, .08, .08, ES.castano), 2.6, 2.35, -1.5);
  add(g, box(.5, .06, .3, ES.granito), 2.6, .92, -.9);
  const jar = add(g, new THREE.Group(), 2.6, 0, -.45); add(jar, ball(.3, "#8A5A3C", 12), 0, .32, 0).scale.y = 1.15; add(jar, cyl(.14, .16, .12, "#6B4530", 10), 0, .68, 0);
  const oil = stream(g, "mill-oil", "#C9B84A", .014);
  const jarLevel = add(jar, cyl(.13, .13, .02, "#C9B84A", 10), 0, .66, 0); jarLevel.name = "mill-oil-level";
  const miller = add(g, own(resident("andalus")), 1.9, 0, -.7); miller.rotation.y = -1.2;
  const driver = add(g, resident("huertano"), -1.9, 0, -.9); driver.rotation.y = 1.4;
  const mule = add(g, new THREE.Group(), .4, 0, .2); mule.name = "mill-mule";
  add(mule, box(.95, .48, .4, "#6B5A4A"), 0, .72, 0);
  add(mule, box(.32, .36, .28, "#6B5A4A"), .58, .86, 0).name = "mill-mule-head";   // the head leads, at local +x
  for (const z of [-.09, .09]) add(mule, box(.06, .22, .05, "#4A3D31"), .58, 1.1, z);
  // The yoke: a collar over the shoulders and the pole that trails back from it to the end of the mill beam.
  for (const z of [-.2, .2]) add(mule, box(.07, .3, .07, "#4A3D31"), .34, .92, z);
  add(mule, box(1.15, .07, .07, ES.castano), -.22, 1.02, 0);
  // The legs hinge at the shoulder so the mule steps the circle it walks instead of sliding round it.
  const muleLegs = ([[.3, -.12], [.3, .12], [-.3, -.12], [-.3, .12]] as [number, number][]).map(([x, z], i) => {
    const leg = add(mule, new THREE.Group(), x, .52, z);
    add(leg, box(.1, .5, .1, "#4A3D31"), 0, -.25, 0);
    if (i === 0) leg.name = "mill-mule-leg";
    return leg;
  });
  const crop = harvest(g, trees, [V(-2.6, .34, -1.2), V(-2.2, .34, .2)]);
  for (const [x, z] of [[-2.6, -1.2], [-2.2, .2]] as [number, number][]) crate(g, x, z, "#2F3A2A", 6, .06);
  return life(g, "oliveEs", [miller, driver], (t, k, dt) => {
    crop.tick(t, k, dt);
    const speed = .34 + k * 1.9;
    stoneArm.rotation.y += dt * speed; runner.rotation.y += dt * speed * 3;
    // Owner feedback, 2026-09-16: "the cow is walking backward pulling the grind". The mule circled the stone
    // tail first: its bearing ran the opposite way round to the beam and its body faced against its travel, and
    // nothing joined it to the beam. It is now harnessed to the beam's far arm, opposite the stone as a tahona
    // harnesses one, a little ahead of the attachment so the head leads and the yoke pole trails to the beam.
    const arm = stoneArm.rotation.y, lead = .45;
    mule.position.set(.4 - Math.cos(arm + lead) * 1.5, 0, .2 + Math.sin(arm + lead) * 1.5);
    mule.rotation.y = arm + lead - Math.PI / 2;
    // One stride for every .55 of the circle it covers, so the pace follows the speed of the stone. The stride
    // is not a sine: the hoof is planted for the first .62 of the cycle and travels backward under the body at
    // the speed of the ground, then swings forward, lifted clear, in the rest. A symmetrical swing reads as a
    // figure sliding, which is the other half of what the owner saw.
    const step = arm * 1.5 / .55, SWING = .62, REACH = .42;
    muleLegs.forEach((leg, i) => {
      const u = (step + (i % 3 ? .5 : 0)) % 1;
      const stance = u < SWING;
      leg.rotation.z = stance ? REACH * (1 - 2 * (u / SWING)) : -REACH + 2 * REACH * ((u - SWING) / (1 - SWING));
      leg.scale.y = stance ? 1 : .88;                                       // the hoof lifts clear on the way forward
    });
    paste.rotation.y = stoneArm.rotation.y * .35; paste.scale.setScalar(1 + Math.sin(t * .7) * .01);
    oil.set(V(2.6, .95, -1.2), V(2.6, .7, -.5), k > 0 && (1 - k) > .15 && (1 - k) < .75);
    jarLevel.scale.setScalar(1 + beat(k, .2, 1) * .25);
    arms(miller).right.rotation.x = -1.2 - beat(k, .05, .6) * .7;
  }, crop.poke);
}

/** The Albufera paddies: the water ripples across the bunds and a cut sheaf lifts onto the bank. */
export function albuferaPaddy(): P {
  const g = group();
  const rows: THREE.Object3D[][] = [];
  for (let plot = 0; plot < 4; plot++) {
    const px = -3.3 + (plot % 2) * 3.4, pz = -1.8 + Math.floor(plot / 2) * 3.4;
    add(g, box(3.0, .12, 3.0, "#8A7A56"), px, .06, pz);
    add(g, box(2.7, .06, 2.7, "#5A8A96"), px, .11, pz);
    const blades: THREE.Object3D[] = [];
    for (let i = 0; i < 24; i++) {
      const bx = px - 1.1 + (i % 6) * .44, bz = pz - 1.1 + Math.floor(i / 6) * .44;
      const tuft = add(g, new THREE.Group(), bx, .13, bz);
      for (let k = 0; k < 3; k++) { const bl = add(tuft, box(.03, .38, .03, k % 2 ? "#8FAE52" : "#A8BE63"), (k - 1) * .05, .19, 0); bl.rotation.z = (k - 1) * .22; }
      add(tuft, cone(.035, .12, "#D9C878", 5), 0, .42, 0);   // the ear, already heavy
      blades.push(tuft);
    }
    rows.push(blades);
  }
  // the sluice that draws from the river, and the punt on the channel
  add(g, box(.9, .7, .5, ES.granito), 0, .35, -3.9); add(g, box(.6, .55, .08, ES.castano), 0, .3, -3.64);
  add(g, cyl(.03, .03, .5, ES.hierro, 6), 0, .82, -3.7); add(g, box(.3, .05, .05, ES.hierro), 0, 1.04, -3.7);
  const punt = add(g, new THREE.Group(), 1.0, .1, 3.4); add(punt, box(2.4, .3, .7, ES.castano), 0, .15, 0); add(punt, box(2.4, .05, .74, "#8A6A4A"), 0, .3, 0);
  for (let i = 0; i < 3; i++) add(punt, cyl(.09, .1, .5, "#C9B27A", 8), -.6 + i * .6, .5, 0);
  // the cut sheaf that lifts out of the water onto the bund
  const sheaf = add(g, new THREE.Group(), -3.3, .16, -.4); sheaf.name = "paddy-sheaf";
  for (let i = 0; i < 9; i++) { const st = add(sheaf, box(.03, .6, .03, "#C9B86A"), Math.cos(i * .7) * .07, .3, Math.sin(i * .7) * .07); st.rotation.z = Math.cos(i * .7) * .16; st.rotation.x = Math.sin(i * .7) * .16; }
  add(sheaf, cyl(.1, .1, .04, "#A88A5C", 10), 0, .3, 0);
  const sheafRest = sheaf.position.clone(), sheafTarget = V(-3.3, .28, -3.3);
  const reaper = add(g, own(resident("huertano")), -2.6, .12, -.5); reaper.rotation.y = 1.4;
  add(arms(reaper).right, new THREE.Mesh(new THREE.TorusGeometry(.16, .015, 5, 12, Math.PI), mat("#C9CFD6")), 0, arms(reaper).hand, .05).rotation.x = 1.2;
  const punter = add(g, resident("huertano"), 1.0, .38, 3.4); punter.rotation.y = -Math.PI / 2;
  add(arms(punter).left, cyl(.02, .02, 2.2, ES.castano, 5), 0, arms(punter).hand + .6, 0);
  return life(g, "albuferaRice", [reaper, punter], (t, k) => {
    // 1. crop: a wave of wind and water crosses the plots, stronger on the click
    rows.forEach((blades, plot) => blades.forEach((b, i) => {
      const phase = t * 1.4 - (plot % 2) * .6 - (i % 6) * .18;
      b.rotation.z = Math.sin(phase) * (.06 + beat(k, 0, .8) * .22);
      b.rotation.x = Math.cos(phase * .8) * (.04 + beat(k, 0, .8) * .12);
    }));
    const p = k > 0 ? clamp01(((1 - k) - .08) / .6) : 0;
    sheaf.position.lerpVectors(sheafRest, sheafTarget, p); sheaf.position.y += Math.sin(p * Math.PI) * .5; sheaf.rotation.z = p * .5;
    punt.position.y = .1 + Math.sin(t * .9) * .025; punt.rotation.z = Math.sin(t * .7) * .02;
    arms(reaper).right.rotation.x = -.9 - beat(k, .05, .6) * .7;
  });
}

/** The huerta beds: the tomatoes hop on their canes and two fall into the picker's crate. */
export function huertaBeds(): P {
  const g = group();
  add(g, box(9.0, .1, 6.4, "#9A7A52"), 0, .05, 0);
  add(g, box(9.0, .18, .5, "#7A6A4A"), 0, .09, -3.4); add(g, box(8.4, .1, .36, "#5A8A96"), 0, .16, -3.4);   // the irrigation channel
  const plants: THREE.Object3D[] = [];
  for (let bed = 0; bed < 4; bed++) {
    const bx = -3.3 + bed * 2.2;
    add(g, box(1.5, .16, 5.4, "#7D5A3D"), bx, .13, .2);
    for (let i = 0; i < 4; i++) {
      const pz = -1.9 + i * 1.3;
      const tr = add(g, new THREE.Group(), bx, .21, pz); plants.push(tr);
      const crown = add(tr, new THREE.Group(), 0, 0, 0); tr.userData.crown = crown;
      if (bed % 2 === 0) {
        for (const dz of [-.3, .3]) { const cane = add(crown, cyl(.02, .02, 1.3, "#C9B27A", 5), dz * .5, .65, dz * .3); cane.rotation.z = dz * .12; }
        for (let k = 0; k < 4; k++) add(crown, ball(.18, k % 2 ? "#4D7A44" : "#5E8A4C", 6), Math.cos(k * 1.57) * .22, .5 + (k % 2) * .3, Math.sin(k * 1.57) * .18);
        const fruits: THREE.Mesh[] = [];
        for (let k = 0; k < 4; k++) fruits.push(add(crown, ball(.085, k % 3 ? "#D94F3A" : "#C9A02B", 7), Math.cos(k * 1.6 + bed) * .3, .42 + (k % 3) * .26, Math.sin(k * 1.6 + bed) * .24));
        tr.userData.fruits = fruits;
      } else if (bed === 1) {
        for (let k = 0; k < 5; k++) add(crown, ball(.16, "#5E8A4C", 6), Math.cos(k * 1.26) * .2, .32 + (k % 2) * .18, Math.sin(k * 1.26) * .18);
        const fruits: THREE.Mesh[] = [];
        for (let k = 0; k < 3; k++) { const pep = add(crown, cone(.06, .24, "#5F9A3C", 6), Math.cos(k * 2.1) * .24, .3, Math.sin(k * 2.1) * .2); pep.rotation.x = Math.PI - .3; fruits.push(pep); }
        tr.userData.fruits = fruits;
      } else {
        const pole = add(crown, cyl(.025, .03, 1.6, "#C9B27A", 5), 0, .8, 0); pole.rotation.z = .07;
        for (let k = 0; k < 7; k++) add(crown, box(.2, .04, .06, "#6F9B57"), Math.cos(k * .9) * .16, .3 + k * .17, Math.sin(k * .9) * .14).rotation.y = k;
        const fruits: THREE.Mesh[] = [];
        for (let k = 0; k < 3; k++) fruits.push(add(crown, box(.18, .035, .05, "#8FAE52"), Math.cos(k * 2.1 + 1) * .2, .5 + k * .3, Math.sin(k * 2.1 + 1) * .16));
        tr.userData.fruits = fruits;
      }
    }
  }
  const baskets = [-1.0, 1.2].map((x) => { crate(g, x, 2.6, "#D94F3A", 6, .08); return V(x, .38, 2.6); });
  const picker = add(g, own(resident("huertano")), -2.2, .1, 2.2); picker.rotation.y = -.7;
  const hoer = add(g, resident("townswoman"), 2.6, .1, 1.4); const walk = pacer(hoer, V(2.6, .1, 1.4), V(2.6, .1, -2.4), .22, 2);
  add(arms(hoer).right, cyl(.02, .02, 1.2, ES.castano, 5), 0, arms(hoer).hand + .3, 0).rotation.x = .4;
  const crop = harvest(g, [plants[0], plants[4], plants[1]], baskets, .02);
  return life(g, "huertaEs", [picker, hoer], (t, k, dt) => {
    crop.tick(t, k, dt);
    plants.forEach((p, i) => { const c = p.userData.crown as THREE.Object3D; c.rotation.z = Math.sin(t * 1.1 + i * .4) * .02; });
    arms(picker).right.rotation.x = -1.6 + Math.sin(t * (1 + k * 3.5)) * (.1 + k * .25);
    walk(t);
  }, crop.poke);
}

/** The saffron plot: the flowers open at dawn and three threads lift from one of them onto the stripping tray. */
export function azafranField(): P {
  const g = group();
  add(g, box(9.0, .1, 6.0, "#B79A63"), 0, .05, 0);
  const flowers: THREE.Group[] = [];
  for (let row = 0; row < 5; row++) for (let i = 0; i < 12; i++) {
    const f = add(g, new THREE.Group(), -3.6 + i * .66, .1, -2.2 + row * .85); flowers.push(f);
    add(f, box(.03, .22, .03, "#5E8A4C"), 0, .11, 0);
    const petals: THREE.Mesh[] = [];
    for (let k = 0; k < 5; k++) { const pl = add(f, cone(.045, .16, k % 2 ? "#8A5FA8" : "#7A4F98", 5), Math.cos(k * 1.26) * .03, .26, Math.sin(k * 1.26) * .03); pl.rotation.z = Math.cos(k * 1.26) * .3; pl.rotation.x = -Math.sin(k * 1.26) * .3; petals.push(pl); }
    f.userData.petals = petals;
    for (let k = 0; k < 3; k++) add(f, cyl(.008, .006, .1, "#C9402B", 4), (k - 1) * .015, .3, 0).rotation.z = (k - 1) * .3;
  }
  // the stripping table under a low awning, the tray of threads and the toasting sieve
  add(g, box(2.4, .07, 1.0, "#C9A97A"), 2.6, .74, 2.6);
  for (const dx of [-1.0, 1.0]) for (const dz of [-.4, .4]) add(g, box(.08, .71, .08, ES.castano), 2.6 + dx, .355, 2.6 + dz);
  for (const x of [1.5, 3.7]) add(g, cyl(.06, .07, 2.1, ES.castano, 6), x, 1.05, 2.6);
  const beam = add(g, box(2.4, .12, .16, ES.castano), 2.6, 2.14, 3.05); beam.name = "front-beam"; lamps(g, 2.14, 3.05, [1.9, 3.3], .75);
  add(g, box(2.6, .05, 1.2, "#C9B27A"), 2.6, 2.2, 2.6);
  add(g, box(.7, .04, .5, "#B8945F"), 2.1, .79, 2.6);
  const threads = Array.from({ length: 5 }, (_, i) => add(g, cyl(.007, .006, .09, "#B2402B", 4), 2.1 + (i - 2) * .06, .82, 2.55));
  add(g, cyl(.24, .24, .08, "#C9B27A", 14), 3.2, .81, 2.5); for (let i = 0; i < 6; i++) add(g, cyl(.008, .007, .1, "#8E2A22", 4), 3.2 + Math.cos(i * 1.05) * .1, .86, 2.5 + Math.sin(i * 1.05) * .1);
  const basket = add(g, cyl(.24, .2, .26, "#C9B27A", 12), 1.3, .13, 2.2);
  for (let i = 0; i < 6; i++) add(g, ball(.05, "#7A4F98", 5), 1.3 + Math.cos(i * 1.05) * .1, .28, 2.2 + Math.sin(i * 1.05) * .1); void basket;
  const rising = add(g, new THREE.Group(), -3.0, .4, -2.2); rising.name = "azafran-threads"; rising.visible = false;
  for (let k = 0; k < 3; k++) add(rising, cyl(.008, .006, .1, "#C9402B", 4), (k - 1) * .018, 0, 0).rotation.z = (k - 1) * .35;
  const riseStart = rising.position.clone(), riseEnd = V(2.1, .86, 2.55);
  const stripper = add(g, own(resident("townswoman")), 2.6, 0, 3.4); stripper.rotation.y = Math.PI;
  const gatherer = add(g, resident("patio"), -3.0, 0, -1.4); const walk = pacer(gatherer, V(-3.0, 0, -1.4), V(-3.0, 0, 2.2), .2, 1);
  return life(g, "azafranEs", [stripper, gatherer], (t, k) => {
    // 1. crop: the flowers open, widest on the click, and one gives up its three threads
    const open = .12 + beat(k, 0, .75) * .55;
    flowers.forEach((f, i) => {
      const petals = f.userData.petals as THREE.Mesh[], phase = Math.sin(t * .5 + i * .2) * .04;
      petals.forEach((p, m) => { p.rotation.z = Math.cos(m * 1.26) * (.3 + open) + phase; p.rotation.x = -Math.sin(m * 1.26) * (.3 + open); });
      f.rotation.z = Math.sin(t * .9 + i * .3) * .03;
    });
    const p = k > 0 ? clamp01(((1 - k) - .1) / .58) : 0;
    rising.visible = k > 0 && (1 - k) > .1 && (1 - k) < .88;
    rising.position.lerpVectors(riseStart, riseEnd, p); rising.position.y += Math.sin(p * Math.PI) * .5; rising.rotation.y = p * 2;
    threads.forEach((th, i) => { th.rotation.z = Math.sin(t * .8 + i) * .12 + beat(k, .5, 1) * .3; });
    arms(stripper).right.rotation.x = -1.35 + Math.sin(t * (1.4 + k * 4)) * (.08 + k * .2);
    walk(t);
  });
}

/** The holm-oak dehesa: the oaks shake, the acorns fall and the pigs are under them. */
export function dehesaOaks(): P {
  const g = group();
  const trees: THREE.Object3D[] = [];
  for (const [i, [x, z]] of ([[-3.2, -1.6], [0, -2.6], [3.0, -1.2], [-1.4, 1.2]] as [number, number][]).entries()) {
    const tr = add(g, new THREE.Group(), x, 0, z); trees.push(tr);
    add(tr, cyl(.22, .34, 1.5, "#6B5340", 7), 0, .75, 0).rotation.z = (i % 2 ? .05 : -.05);
    const crown = add(tr, new THREE.Group(), 0, 0, 0); tr.userData.crown = crown;
    for (let k = 0; k < 5; k++) add(crown, ball(.85 + (k % 2) * .18, k % 2 ? "#4F6B3E" : "#5C7A47", 8), Math.cos(k * 1.26) * .62, 2.0 + (k % 3) * .28, Math.sin(k * 1.26) * .62).scale.y = .72;
    const fruits: THREE.Mesh[] = [];
    for (let k = 0; k < 6; k++) { const ac = add(crown, cone(.07, .18, "#8A6A3A", 6), Math.cos(k * 1.05 + i) * 1.0, 1.7 + (k % 3) * .3, Math.sin(k * 1.05 + i) * 1.0); ac.rotation.x = Math.PI; add(ac, cyl(.055, .05, .05, "#5C4326", 6), 0, .085, 0); fruits.push(ac); }
    tr.userData.fruits = fruits;
  }
  // a dry-stone pen with the black pigs in it
  const penX = 2.4, penZ = 2.6;
  // the south wall has a gate gap in it, and the acorns land in front of it rather than behind a wall
  for (const [dx, dz, w, d] of [[0, -1.3, 3.6, .2], [-1.35, 1.3, .9, .2], [1.35, 1.3, .9, .2], [-1.8, 0, .2, 2.8], [1.8, 0, .2, 2.8]] as [number, number, number, number][]) add(g, box(w, .55, d, ES.granito), penX + dx, .275, penZ + dz);
  for (const dx of [-.45, .45]) add(g, box(.16, .8, .16, ES.castano), penX + dx, .4, penZ + 1.3);
  const pigs = [-.9, 0, .9].map((dx, i) => {
    const p = add(g, new THREE.Group(), penX + dx, 0, penZ + (i % 2 ? .4 : -.4)); p.rotation.y = i * 1.1;
    add(p, ball(.32, "#3A3134", 9), 0, .42, 0).scale.set(1.5, .85, .85);
    const head = add(p, new THREE.Group(), .44, .42, 0); add(head, ball(.18, "#3A3134", 8), 0, 0, 0).scale.set(1.2, .9, .9);
    add(head, cyl(.07, .08, .1, "#5A4A48", 8), .18, -.03, 0).rotation.z = Math.PI / 2;
    for (const z of [-.09, .09]) add(head, box(.09, .1, .02, "#2F2729"), .02, .13, z).rotation.x = .3;
    p.userData.head = head;
    for (const [x, z] of [[.2, -.14], [.2, .14], [-.2, -.14], [-.2, .14]] as [number, number][]) add(p, box(.09, .3, .09, "#2F2729"), x, .17, z);
    add(p, cyl(.02, .015, .16, "#2F2729", 5), -.46, .46, 0).rotation.x = .6;
    return p;
  });
  const swineherd = add(g, own(resident("shepherd")), -.2, 0, 3.0); swineherd.rotation.y = .9;
  add(arms(swineherd).left, cyl(.02, .02, 1.6, "#7A5A3A", 5), 0, arms(swineherd).hand + .4, 0);
  const walker = add(g, resident("galician"), -4.0, 0, 3.2); const walk = pacer(walker, V(-4.0, 0, 3.2), V(2.0, 0, 3.6), .24, 3);
  const crop = harvest(g, trees, [V(penX - .5, .06, penZ + 2.0), V(penX + .5, .06, penZ + 2.2), V(-.6, .06, 1.6)], .02);
  return life(g, "dehesaEs", [swineherd, walker], (t, k, dt) => {
    crop.tick(t, k, dt);
    pigs.forEach((p, i) => {
      const nose = Math.sin(t * 1.6 + i * 2) * .12 + beat(k, .35, 1) * .45;
      (p.userData.head as THREE.Object3D).rotation.z = -.25 - nose;
      p.position.x = penX + (i - 1) * .9 + Math.sin(t * .4 + i) * .07;
    });
    arms(swineherd).right.rotation.x = -beat(k, .05, .7) * 1.3;
    walk(t);
  }, crop.poke);
}

/** The Manchega flock: the sheep shift a step together and one of them lifts its head to bleat. */
export function manchegaFlock(): P {
  const g = group();
  add(g, box(9.0, .1, 6.4, "#C2A473"), 0, .05, 0);
  for (const [dx, dz, w, d] of [[0, -2.6, 6.4, .25], [-3.2, 0, .25, 5.2], [3.2, 0, .25, 5.2]] as [number, number, number, number][]) add(g, box(w, .6, d, ES.granito), dx, .3, dz);
  add(g, box(2.6, 1.6, 2.2, ES.cal), -2.0, .8, -3.6);
  for (const side of [-1, 1]) { const r = add(g, box(3.0, .1, 1.5, ES.teja), -2.0, 2.0, -3.6 + side * .55); r.rotation.x = side * .6; }
  const sheep = Array.from({ length: 9 }, (_, i) => {
    const s = add(g, new THREE.Group(), -2.4 + (i % 3) * 1.6 + (i % 2) * .3, .05, -1.4 + Math.floor(i / 3) * 1.5);
    s.rotation.y = .4 + i * .7; if (i === 0) s.name = "manchega-sheep";
    add(s, ball(.3, "#EFE9DA", 9), 0, .5, 0).scale.set(1.5, .95, .95);
    for (let k = 0; k < 5; k++) add(s, ball(.16, "#E7E0CE", 6), -.2 + k * .1, .66, (k % 2 ? .12 : -.12));
    const head = add(s, new THREE.Group(), .42, .52, 0); s.userData.head = head;
    add(head, ball(.14, "#D9D2BE", 8), 0, 0, 0).scale.set(1.2, .95, .85);
    add(head, cyl(.055, .05, .12, "#C9C0A8", 8), .15, -.05, 0).rotation.z = 1.2;
    for (const z of [-.1, .1]) add(head, box(.08, .05, .02, "#C9C0A8"), -.02, .1, z).rotation.x = z > 0 ? .5 : -.5;
    for (const [x, z] of [[.18, -.12], [.18, .12], [-.18, -.12], [-.18, .12]] as [number, number][]) add(s, box(.07, .32, .07, "#C9C0A8"), x, .2, z);
    return s;
  });
  const pail = add(g, cyl(.16, .13, .24, "#8A8F94", 12), 1.9, .17, 1.6); add(g, cyl(.14, .14, .02, "#F7F2E6", 12), 1.9, .28, 1.6); void pail;
  const shepherd = add(g, own(resident("shepherd")), 1.3, .05, 2.2); shepherd.rotation.y = Math.PI - .5;
  add(arms(shepherd).left, cyl(.02, .02, 1.6, "#7A5A3A", 5), 0, arms(shepherd).hand + .4, 0);
  const dog = add(g, new THREE.Group(), -2.6, .05, 2.0);
  add(dog, ball(.17, "#7A6A52", 8), 0, .34, 0).scale.set(1.5, .85, .8);
  add(dog, ball(.11, "#7A6A52", 7), .26, .4, 0); for (const z of [-.06, .06]) add(dog, box(.06, .08, .02, "#5C4E3A"), .26, .5, z);
  for (const [x, z] of [[.12, -.08], [.12, .08], [-.12, -.08], [-.12, .08]] as [number, number][]) add(dog, box(.06, .24, .06, "#5C4E3A"), x, .14, z);
  const tail = add(dog, cyl(.025, .015, .22, "#7A6A52", 5), -.26, .38, 0); tail.rotation.z = .8;
  const milker = add(g, resident("townswoman"), 3.0, .05, 2.6); const walk = pacer(milker, V(3.0, .05, 2.6), V(-3.0, .05, 2.8), .24, 2);
  const homes = sheep.map((s) => s.position.clone());
  return life(g, "ovejaManchega", [shepherd, milker], (t, k) => {
    const shift = beat(k, 0, .75);
    sheep.forEach((s, i) => {
      s.position.set(homes[i].x + shift * (.3 + (i % 3) * .12), .05, homes[i].z - shift * (.16 + (i % 2) * .1));
      s.rotation.y = .4 + i * .7 + shift * .3;
      const head = s.userData.head as THREE.Object3D;
      head.rotation.z = i === 4 ? -.15 + beat(k, .2, .85) * .95 : -.3 + Math.sin(t * .8 + i) * .12;
      head.rotation.y = Math.sin(t * .5 + i * 1.3) * .2;
    });
    tail.rotation.z = .8 + Math.sin(t * 5) * .3 + beat(k, .4, 1) * .5;
    dog.position.z = 2.0 - beat(k, .3, 1) * .5;
    arms(shepherd).right.rotation.x = -beat(k, .1, .7) * 1.1;
    walk(t);
  });
}

/** The pepper drying house: the strings sway and oak smoke rises through the slatted floor. */
export function veraDryhouse(): P {
  const g = group();
  // the secadero: a stone ground floor with the fire, a slatted upper floor, an open gallery under the eave
  add(g, box(4.4, 1.3, 3.0, ES.piedra), 0, .65, -.4);
  add(g, box(4.4, .12, 3.0, ES.castano), 0, 1.36, -.4);
  for (let i = 0; i < 14; i++) add(g, box(.08, .06, 3.0, "#8A6A48"), -2.0 + i * .31, 1.44, -.4);
  add(g, box(4.4, 1.2, .16, ES.cal), 0, 2.0, -1.84);
  for (const x of [-2.12, 2.12]) add(g, box(.16, 1.2, 3.0, ES.cal), x, 2.0, -.4);
  const beam = add(g, box(4.6, .16, .2, ES.castano), 0, 2.68, 1.0); beam.name = "front-beam";
  for (const x of [-2.1, 2.1]) add(g, box(.16, 1.3, .16, ES.castano), x, 2.0, 1.0);
  for (const side of [-1, 1]) { const r = add(g, box(5.0, .12, 1.9, ES.teja), 0, 3.05, -.4 + side * .8); r.rotation.x = side * .5; }
  add(g, box(5.1, .1, .14, "#C56A42"), 0, 3.45, -.4);
  lamps(g, 2.68, 1.0, [-1.3, 1.3], .8);
  add(g, box(1.0, .9, .1, ES.castano), -1.2, .45, 1.11); add(g, box(.7, .6, .1, ES.hierro), 1.0, .4, 1.11);   // the fire door
  const fireEs = Array.from({ length: 3 }, (_, i) => add(g, cone(.1, .3, i % 2 ? "#F2A03C" : "#E9612D", 6), 1.0 + (i - 1) * .18, .3, .9));
  g.userData.smoke = V(0, 2.0, -.4);
  // the strings of peppers hanging from the upper floor, and the racks they are turned on
  const ristras = Array.from({ length: 7 }, (_, i) => {
    const pivot = add(g, new THREE.Group(), -1.7 + i * .58, 2.6, .55);
    add(pivot, cyl(.012, .012, .12, "#8A6A48", 4), 0, -.06, 0);
    for (let k = 0; k < 9; k++) { const pep = add(pivot, cone(.05, .18, k % 3 ? "#B2402B" : "#8E2A22", 5), (k % 2 ? .06 : -.06), -.2 - k * .16, 0); pep.rotation.z = Math.PI + (k % 2 ? .35 : -.35); }
    pivot.userData.foodReaction = "sway"; if (i === 0) pivot.name = "vera-ristra";
    return pivot;
  });
  const rack = add(g, new THREE.Group(), 0, 1.5, -.4); add(rack, box(3.4, .05, 1.6, ES.castano), 0, 0, 0);
  const drying: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) drying.push(add(rack, cone(.055, .2, i % 3 ? "#B2402B" : "#C0392B", 5), -1.4 + (i % 6) * .56, .1, -.3 + Math.floor(i / 6) * .6));
  drying.forEach((d) => (d.rotation.z = Math.PI / 2));
  const smokePuffs = Array.from({ length: 4 }, (_, i) => {
    const m = add(g, ball(.22, "#CFC6B4", 7), (i - 1.5) * .5, 1.5, -.4);
    m.material = mat("#CFC6B4", { transparent: true, opacity: .0 }); return m;
  });
  const turner = add(g, own(resident("andalus")), 1.5, 1.42, -1.2); turner.rotation.y = Math.PI;
  const stoker = add(g, resident("shepherd"), 2.4, 0, 1.6); const walk = pacer(stoker, V(2.4, 0, 1.6), V(-2.4, 0, 1.9), .24, 2);
  return life(g, "pimentonVera", [turner, stoker], (t, k) => {
    ristras.forEach((r, i) => { r.rotation.z = Math.sin(t * 1.2 + i * .6) * (.045 + beat(k, 0, .8) * .3); r.rotation.x = Math.cos(t * .9 + i) * (.03 + beat(k, 0, .8) * .12); });
    fireEs.forEach((f, i) => { const s = .8 + Math.sin(t * 8 + i * 2) * .2 + beat(k, .1, .8) * .6; f.scale.set(s, s, s); });
    smokePuffs.forEach((m, i) => {
      const a = ((t * .28 + i * .25) % 1);
      m.position.y = 1.5 + a * 1.7; m.scale.setScalar(.5 + a * 1.5);
      (m.material as THREE.MeshStandardMaterial).opacity = (1 - a) * (.10 + beat(k, .1, 1) * .22);
    });
    drying.forEach((d, i) => { d.position.y = .1 + beat(k, .4, 1) * (.1 + (i % 3) * .04); d.rotation.y = beat(k, .4, 1) * 1.6; });
    arms(turner).right.rotation.x = -1.2 - beat(k, .3, .9) * .5;
    walk(t);
  });
}

/** The Herbon peppers: small green peppers hop in the hot oil and the coarse salt falls on them. */
export function herbonPeppers(): P {
  const g = group();
  add(g, box(4.0, .08, 3.2, "#9FB08A"), 0, .04, 0);
  add(g, box(2.6, 1.9, .2, ES.granito), -.4, .95, -1.5); add(g, box(.2, 1.9, 1.6, ES.granito), -1.6, .95, -.8);
  for (const side of [-1, 1]) { const r = add(g, box(3.0, .1, 1.3, ES.pizarra), -.4, 2.2, -1.1 + side * .55); r.rotation.x = side * .6; }
  const beam = add(g, box(2.6, .14, .18, ES.castano), -.4, 2.02, -.2); beam.name = "front-beam";
  for (const x of [-1.55, .75]) add(g, box(.14, 2.0, .14, ES.castano), x, 1.0, -.2);
  lamps(g, 2.02, -.2, [-1.0, .2], .75);
  // the fire, the pan and the peppers in it
  add(g, cyl(.45, .5, .5, ES.granito, 14), -.5, .25, -.5);
  const fireEs = Array.from({ length: 3 }, (_, i) => add(g, cone(.08, .22, i % 2 ? "#F2A03C" : "#E9612D", 6), -.5 + Math.cos(i * 2.1) * .12, .56, -.5 + Math.sin(i * 2.1) * .12));
  const pan = add(g, new THREE.Group(), -.5, .72, -.5); pan.name = "herbon-pan";
  add(pan, cyl(.38, .32, .09, "#3F3F42", 18), 0, .045, 0); add(pan, cyl(.34, .34, .02, "#E9C36A", 18), 0, .09, 0);
  add(pan, cyl(.028, .028, .5, ES.hierro, 5), .58, .06, 0).rotation.z = Math.PI / 2;
  const peppers = Array.from({ length: 7 }, (_, i) => {
    const p = add(pan, cone(.045, .2, i % 4 ? "#5F9A3C" : "#4F8A32", 6), Math.cos(i * .9) * .18, .11, Math.sin(i * .9) * .18);
    p.rotation.z = Math.PI / 2 + Math.cos(i) * .3; p.rotation.y = i; p.userData.foodReaction = "hop"; if (i === 0) p.name = "herbon-pepper"; return p;
  });
  g.userData.steam = V(-.5, 1.2, -.5); g.userData.smoke = V(-.5, .7, -.5);
  // the table beside it: baskets of raw peppers, a plate of fried ones, coarse salt
  const ty = table(g, 1.3, .5, 1.6, .9, "#A88A5C", .76);
  const raw = crate(g, 1.0, .3, "#5F9A3C", 6, .055, ty);
  raw.children.forEach((p) => (p.userData.foodReaction = "hop"));
  const dish = plate(g, 1.8, ty, .7, .18, "#E9D9A6"); void dish;
  for (let i = 0; i < 5; i++) add(g, cone(.04, .17, i % 3 ? "#6F9B57" : "#8FAE52", 6), 1.8 + Math.cos(i * 1.26) * .08, ty + .05, .7 + Math.sin(i * 1.26) * .08).rotation.z = Math.PI / 2 + i;
  const salt = add(g, cyl(.07, .06, .06, ES.marmol, 10), 2.0, ty + .03, .2);
  for (let i = 0; i < 3; i++) add(g, ball(.016, ES.cal, 4), 2.0 + Math.cos(i * 2.1) * .03, ty + .07, .2 + Math.sin(i * 2.1) * .03); void salt;
  const grains = Array.from({ length: 6 }, (_, i) => { const m = add(g, ball(.014, ES.cal, 4), 1.8 + Math.cos(i) * .09, ty + .35, .7 + Math.sin(i) * .09); m.visible = false; return m; });
  // The cook stood at [.2, .1], between the low south-east arrival and the pan; he now works from the far
  // side of the fire, so the camera sees the peppers jump past his shoulder instead of through it.
  const cook = add(g, resident("cook"), .45, 0, -.85); cook.rotation.y = -1.22;
  const basketWoman = add(g, resident("galician"), 2.2, 0, 1.6); const walk = pacer(basketWoman, V(2.2, 0, 1.6), V(-1.8, 0, 1.8), .24, 2);
  return life(g, "pementoHerbon", [cook, basketWoman], (t, k) => {
    fireEs.forEach((f, i) => { const s = .8 + Math.sin(t * 9 + i * 2) * .2 + beat(k, 0, .7) * .8; f.scale.set(s, s, s); });
    // 1. food: the peppers jump in the oil, the pan follows the wrist, then the salt falls on them
    const toss = beat(k, 0, .55);
    peppers.forEach((p, i) => { p.position.y = .11 + Math.max(0, Math.sin(t * 4 + i * 1.1)) * .02 + toss * Math.abs(Math.sin(t * 11 + i)) * .3; });
    pan.rotation.z = toss * .3; pan.position.y = .72 + toss * .08;
    const fall = k > 0 ? clamp01(((1 - k) - .5) / .3) : 0;
    grains.forEach((m, i) => { m.visible = fall > 0 && fall < 1; m.position.y = ty + .35 - fall * .28 - (i % 3) * .012; });
    arms(cook).right.rotation.x = -1.1 - toss * .4;
    walk(t);
  });
}

// ---------- landmarks with a card and a 3D reaction ----------

/** The Alhambra on its terrace: the long pool ripples from end to end and the cypresses sway. */
export function alhambra(): P {
  const g = group();
  add(g, box(12, 3.4, 5, "#B86A4A"), 0, 1.7, -2.6);
  add(g, box(3, 5.6, 3, "#B86A4A"), -4.5, 2.8, -3.1); add(g, box(3.2, .3, 3.2, "#8A4A3A"), -4.5, 5.7, -3.1);
  add(g, box(2.4, 4.6, 2.4, "#B86A4A"), 5.0, 2.3, -3.3); add(g, box(2.6, .3, 2.6, "#8A4A3A"), 5.0, 4.75, -3.3);
  for (let i = 0; i < 7; i++) {
    add(g, cyl(.12, .14, 1.8, ES.marmol, 8), -3.6 + i * 1.2, .9, .2);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .3, 12, 1, false, 0, Math.PI), mat(ES.marmol)), -3.0 + i * 1.2, 1.9, .2).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  }
  add(g, box(9, .5, .4, ES.marmol), 0, 2.45, .2);
  for (let i = 0; i < 12; i++) add(g, box(.4, .4, .04, i % 2 ? ES.talavera : ES.albero), -3.5 + i * .64, 2.45, .42);
  // the long pool with a myrtle hedge on each side; a ripple ring travels its length
  add(g, box(2.6, .3, 7.4, ES.granito), 0, .15, 4.2); add(g, box(2.1, .1, 6.9, "#5FA8BC"), 0, .31, 4.2);
  const ripple = add(g, new THREE.Mesh(new THREE.TorusGeometry(.5, .022, 5, 22), mat("#D9F0F4", { transparent: true, opacity: .8 })), 0, .33, 1.0);
  ripple.rotation.x = Math.PI / 2; ripple.scale.set(1, .5, 1); ripple.name = "alhambra-ripple";
  for (const side of [-1, 1]) add(g, box(.7, .45, 6.9, "#4F7A48"), side * 1.95, .22, 4.2);
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) add(g, ball(.36, i % 2 ? "#5E8A4C" : "#4F7A48", 6), side * 1.95, .5, 1.2 + i * 1.2).scale.y = .7;
  const cypresses = [-1, 1].flatMap((side) => [0, 1, 2, 3].map((i) => add(g, cypress(.72 + (i % 2) * .18), side * 3.1, 0, 1.4 + i * 1.8)));
  // the fountain at the far end, always running
  add(g, cyl(.65, .75, .4, ES.granito, 14), 0, .2, 8.2); add(g, cyl(.55, .55, .08, "#5FA8BC", 14), 0, .42, 8.2);
  add(g, cyl(.1, .1, .5, ES.marmol, 8), 0, .65, 8.2); const bowlTop = add(g, cyl(.32, .2, .1, ES.marmol, 14), 0, .95, 8.2); void bowlTop;
  const jet = add(g, cyl(.02, .02, .5, "#CFEBF0", 6), 0, 1.25, 8.2);
  const guide = add(g, own(resident("andalus")), -1.6, 0, 7.2); guide.rotation.y = 1.0;
  const visitor = add(g, resident("townswoman"), 1.8, 0, 6.6); const walk = pacer(visitor, V(1.8, 0, 6.6), V(1.8, 0, 1.4), .22, 2);
  return life(g, "alhambraEs", [guide, visitor], (t, k) => {
    // 1. water first: one ring travels the length of the pool and the jet lifts
    const cycle = ((t * .22) % 1), push = beat(k, 0, .85);
    ripple.position.z = 1.0 + cycle * 6.4;
    ripple.scale.set(.6 + cycle * 1.4, .5, .6 + cycle * 1.4);
    (ripple.material as THREE.MeshStandardMaterial).opacity = (1 - cycle) * (.45 + push * .5);
    jet.scale.y = 1 + Math.sin(t * 3) * .1 + push * 1.5; jet.position.y = 1.25 + push * .35;
    cypresses.forEach((c, i) => { c.rotation.z = Math.sin(t * .8 + i * .7) * (.012 + push * .06); c.rotation.x = Math.cos(t * .6 + i) * (.01 + push * .04); });
    upper(guide).rotation.y = Math.sin(t * .5) * .2 + beat(k, .45, 1) * .35;
    arms(guide).right.rotation.x = -.2 - beat(k, .45, 1) * 1.1;
    walk(t);
  });
}

/** The tablao: the dancer turns and her skirt flares, the guitarist leans in and the palmas follow. */
export function flamenco(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(2.9, 22), mat("#C9B98A")), 0, .02, 0).rotation.x = -Math.PI / 2;
  add(g, cyl(2.3, 2.35, .18, ES.castano, 22), 0, .09, .2);   // the boards the heels sound on
  for (let i = 0; i < 16; i++) add(g, box(.28, .02, 4.4, "#8A6A48"), -2.1 + i * .28, .185, .2);
  for (const [i, x] of [-2.6, 2.6].entries()) { add(g, cyl(.08, .09, 2.6, ES.castano, 6), x, 1.3, -1.6); void i; }
  const beam = add(g, box(5.4, .14, .18, ES.castano), 0, 2.64, -1.6); beam.name = "front-beam"; lamps(g, 2.64, -1.6, [-1.5, 1.5], .85);
  add(g, box(5.4, 2.2, .16, ES.cal), 0, 1.1, -1.75);
  for (let i = 0; i < 9; i++) add(g, box(.5, .5, .03, i % 2 ? ES.talavera : "#E9D9A6"), -2.0 + i * .5, .45, -1.64);
  const dancer = add(g, own(resident("patio")), 0, .18, .5); dancer.rotation.y = .3;
  const skirt = add(dancer, cone(.56, .86, ES.almagre, 16), 0, .5, 0); skirt.rotation.x = Math.PI; skirt.name = "flamenco-skirt";
  for (let k = 0; k < 10; k++) add(skirt, ball(.055, ES.cal, 4), Math.cos(k * .63) * .48, .3, Math.sin(k * .63) * .48);
  wear(dancer, ball(.08, "#C9302A", 6), .13, 1.3, .02);
  const clapper = add(g, own(resident("andalus")), 1.5, .18, -.5); clapper.rotation.y = -1.0;
  const guitarist = sit(g, -2.7, -1.2, .8, "catalan");
  add(guitarist, ball(.2, "#A37A4F", 8), .05, .72, .3).scale.set(.8, 1, .45);
  add(guitarist, box(.04, .04, .62, "#4A3222"), .16, .92, .56);
  const audience = [sit(g, -1.4, 2.4, Math.PI, "townsman"), sit(g, -.2, 2.6, Math.PI, "townswoman"), sit(g, 1.2, 2.4, Math.PI, "basque")];
  const child = add(g, resident("child"), 2.2, 0, 2.0); child.rotation.y = Math.PI - .5;
  const palmas = Array.from({ length: 5 }, (_, i) => { const m = add(g, ball(.06, ES.cal, 5), Math.cos(i * 1.26) * .9, 1.6, .5 + Math.sin(i * 1.26) * .9); m.visible = false; return m; });
  return life(g, "flamenco", [dancer, audience[0], clapper, guitarist, ...audience.slice(1), child], (t, k) => {
    // 1. the dancer first: she turns on the spot, the skirt flares and the heels mark the beat
    const drive = beat(k, 0, .9);
    dancer.rotation.y = .3 + (k > 0 ? (1 - k) * 5.2 : 0);
    skirt.scale.set(1 + drive * .55, 1 + drive * .12, 1 + drive * .55);
    upper(dancer).rotation.z = Math.sin(t * 1.2) * .04 + Math.sin(t * 9) * .18 * drive;
    arms(dancer).left.rotation.z = .35 + drive * 1.5; arms(dancer).right.rotation.z = -.35 - drive * 1.5;
    // The zapateado is in the heels, not in the whole body: she never leaves the boards.
    legsOf(dancer).right.thigh.rotation.x = Math.max(0, Math.sin(t * 13)) * .32 * drive;
    legsOf(dancer).left.thigh.rotation.x = Math.max(0, -Math.sin(t * 13)) * .32 * drive;
    // 2. the guitarist's hand, 3. the clapper's palmas
    upper(guitarist).rotation.z = Math.sin(t * 2) * .04 + Math.sin(t * 10) * .1 * drive;
    arms(guitarist).right.rotation.x = -1.0 - Math.sin(t * 11) * .18 * drive;
    arms(clapper).left.rotation.z = .5 + Math.sin(t * 12) * .35 * drive;
    arms(clapper).right.rotation.z = -.5 - Math.sin(t * 12) * .35 * drive;
    palmas.forEach((m, i) => { const a = (t * 1.4 + i * .8) % 3; m.visible = drive > .1; m.position.set(1.5 + Math.sin(a * 2) * .4, 1.5 + a * .32, -.5 + Math.cos(a * 2) * .3); m.scale.setScalar(Math.max(.01, 1 - a / 3) * drive * 1.4); });
    audience.forEach((p, i) => { upper(p).rotation.z = Math.sin(t * 1.1 + i * 2) * .05 + Math.sin(t * 12 + i) * .06 * drive; });
  });
}

/** The windmill ridge: the first mill's sails already turn, and a tap sets them running faster for a long while. */
export function manchaWindmill(): P {
  const g = group();
  add(g, box(11, .6, 5.0, "#C2A473"), 0, .3, 0);
  const mills = [-2.6, 1.6, 4.4].map((x, i) => { const m = add(g, manchaWindmillBody(), x, .6, -.6 - (i % 2) * .8); m.rotation.y = -.25 + i * .22; if (i === 0) (m.userData.sails as THREE.Object3D).name = "molino-sails"; return m; });
  // the miller's yard in front of the nearest mill: sacks of grain and flour, a hand cart, a measure
  for (let i = 0; i < 5; i++) { const s = add(g, cyl(.24, .3, .5, i % 2 ? "#D9CFB4" : "#E6DCC2", 9), -3.4 + (i % 3) * .55, .85, 1.5 + Math.floor(i / 3) * .6); add(g, cyl(.16, .16, .06, "#C9BC9A", 9), s.position.x, 1.13, s.position.z); }
  const cart = add(g, new THREE.Group(), -1.4, .6, 1.9); add(cart, box(1.3, .28, .8, ES.castano), 0, .42, 0);
  for (const z of [-.44, .44]) add(cart, cyl(.34, .34, .07, ES.castano, 14), -.2, .34, z).rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) add(cart, cyl(.2, .24, .38, "#E6DCC2", 9), -.3 + i * .3, .72, 0);
  add(cart, cyl(.035, .035, 1.0, ES.castano, 5), .85, .5, 0).rotation.z = 1.2;
  add(g, cyl(.18, .18, .22, ES.castano, 12), -2.4, .71, 2.2); add(g, cyl(.16, .16, .04, "#EFE6D2", 12), -2.4, .84, 2.2);   // the measure, full
  const miller = add(g, own(resident("catalan")), -2.0, .6, 1.2); miller.rotation.y = Math.PI - .4;
  const carter = add(g, resident("carrier", false), 2.6, .6, 2.2); const walk = pacer(carter, V(2.6, .6, 2.2), V(-3.6, .6, 2.4), .26, 3);
  let spin = 0;
  return life(g, "molinosMancha", [miller, carter], (t, k, dt) => {
    // the near mill never stops; a tap adds speed that runs on well past the reaction
    spin += dt * (.42 + k * 2.4);
    (mills[0].userData.sails as THREE.Object3D).rotation.z = -spin;
    (mills[1].userData.sails as THREE.Object3D).rotation.z = -spin * .45 - .8;
    (mills[2].userData.sails as THREE.Object3D).rotation.z = -spin * .22 + 1.7;
    arms(miller).right.rotation.x = -.9 - beat(k, .3, .9) * .5;
    walk(t);
  });
}

/** The mosaic balustrade: light travels along the broken tile from one end of the curve to the other. */
export function gaudiBench(): P {
  const g = group();
  add(g, box(9.0, .3, 5.0, "#D9CFAE"), 0, .15, 0);
  for (let i = 0; i < 22; i++) add(g, box(.42, .04, 5.0, "#CFC3A0"), -4.3 + i * .41, .31, 0);
  // the undulating bench: a run of segments on a curve, each faced with broken tile
  const tiles: { mesh: THREE.Mesh; u: number }[] = [];
  const segments = 22;
  for (let i = 0; i < segments; i++) {
    const u = i / (segments - 1), a = -1.15 + u * 2.3;
    const x = Math.sin(a) * 4.4, z = Math.cos(a) * 4.4 - 3.4;
    const seat = add(g, new THREE.Group(), x, .3, z); seat.rotation.y = a;
    add(seat, box(.44, .42, .62, ES.cal), 0, .21, 0);
    add(seat, box(.44, .5, .2, ES.cal), 0, .55, -.3).rotation.x = -.18;
    for (let k = 0; k < 6; k++) {
      const colour = ["#2E5C8A", "#E0B45F", "#A4432B", "#EDE7DA", "#4F8A82", "#C9A02B"][(i + k) % 6];
      const t1 = add(seat, box(.12, .012, .12, colour), -.14 + (k % 3) * .14, .42, -.18 + Math.floor(k / 3) * .22);
      t1.rotation.y = (i + k) * .7; t1.material = mat(colour, { emissive: colour, emissiveIntensity: 0 });
      if (!tiles.length) t1.name = "trencadis-tile";
      tiles.push({ mesh: t1, u });
      const t2 = add(seat, box(.11, .11, .012, colour), -.13 + (k % 3) * .13, .5 + Math.floor(k / 3) * .16, -.39);
      t2.rotation.z = (i + k) * .5; t2.material = mat(colour, { emissive: colour, emissiveIntensity: 0 });
      tiles.push({ mesh: t2, u });
    }
  }
  // a small trencadis lizard on the paving, as the terrace has
  const lizard = add(g, new THREE.Group(), -2.2, .33, 1.5);
  add(lizard, ball(.24, "#4F8A82", 8), 0, .1, 0).scale.set(1.9, .5, .9);
  add(lizard, ball(.14, "#4F8A82", 7), .42, .12, 0).scale.set(1.1, .6, .9);
  for (const side of [-1, 1]) for (const dx of [.2, -.2]) add(lizard, box(.2, .04, .07, "#E0B45F"), dx, .08, side * .22).rotation.y = side * .5;
  add(lizard, cyl(.05, .015, .7, "#4F8A82", 6), -.5, .08, 0).rotation.z = Math.PI / 2;
  const sitters = [seatFigure(g, resident("catalan"), Math.sin(-.5) * 4.4, Math.cos(-.5) * 4.4 - 3.4, -.5, .72), seatFigure(g, resident("townswoman"), Math.sin(.35) * 4.4, Math.cos(.35) * 4.4 - 3.4, .35, .72)];
  const pigeons = Array.from({ length: 4 }, (_, i) => {
    const p = add(g, new THREE.Group(), -1.0 + i * .7, .33, 2.2);
    add(p, ball(.11, i % 2 ? "#8A8F94" : "#B7BEC4", 7), 0, .11, 0).scale.set(1.4, .9, .9);
    add(p, ball(.06, i % 2 ? "#8A8F94" : "#B7BEC4", 6), .13, .19, 0);
    for (const side of [-1, 1]) add(p, box(.16, .02, .07, "#6E7378"), 0, .14, side * .07);
    return p;
  });
  const walker = add(g, resident("carrier", false), -3.8, .3, 2.8); const walk = pacer(walker, V(-3.8, .3, 2.8), V(3.8, .3, 2.8), .28, 1);
  return life(g, "gaudiEs", [sitters[0], sitters[1], walker], (t, k) => {
    // 1. the light first: a band travels the curve, slow always, bright and quick on the click
    const head = ((t * .11) % 1.4) - .2 + beat(k, 0, .9) * .5;
    tiles.forEach(({ mesh, u }) => {
      const d = Math.abs(u - head);
      const glow = Math.max(0, 1 - d / .22);
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * (.35 + beat(k, 0, .9) * .75);
    });
    lizard.rotation.y = Math.sin(t * .4) * .03;
    pigeons.forEach((p, i) => {
      const lift = beat(k, .3, 1);
      p.position.set(-1.0 + i * .7 + lift * (i - 1.5) * .35, .33 + lift * .7, 2.2 + Math.sin(t * .6 + i) * .05 + lift * .3);
      p.children.slice(2).forEach((w, m) => { w.rotation.z = Math.sin(t * 14 + m * Math.PI) * .7 * lift; });
      p.rotation.y = Math.sin(t * .5 + i * 2) * .5;
    });
    walk(t);
  });
}

// ---------- the registry ----------

const BUILDERS = {
  paellaFire, tapasBar, jamonStall, tortillaKitchen, churreria, pintxoBar, patioKitchen, pulperia, panTerrace, quesoFarm, sidreria, jerezBodega,
  fishingPort, orangeGrove, oliveMillEs, albuferaPaddy, huertaBeds, azafranField, dehesaOaks, manchegaFlock, veraDryhouse, herbonPeppers,
  alhambra, flamenco, manchaWindmill, gaudiBench,
};
/**
 * Each stand starts its residents from its own place in the profile band, so a stand is built the same way
 * whatever else has been built before it: the clothing still changes from stand to stand, but the people in
 * one stand no longer depend on how many stands a harness or a world happened to build first. The sight-line
 * check in spain-reactions.mjs needs that, and so does anyone reproducing a screenshot.
 */
export const SPAIN_PROPS: Record<string, () => P> = Object.fromEntries(
  Object.entries(BUILDERS).map(([id, make], i) => [id, () => { nth = i * 5; kid = i; return make(); }]),
);

/** One small food or tool per room object, rendered into the card badge when no painted card art exists. */
export const SPAIN_ICONS: Record<string, () => P> = {
  paellaEs: () => { const g = group(); add(g, cyl(.6, .54, .07, "#6B6B6E", 20), 0, .04, 0); add(g, cyl(.54, .54, .04, "#E5B54B", 20), 0, .08, 0); for (let i = 0; i < 4; i++) add(g, ball(.08, i % 2 ? "#8B5A2B" : "#A5703A", 6), Math.cos(i * 1.57) * .3, .12, Math.sin(i * 1.57) * .3).scale.set(1.2, .7, 1); for (let i = 0; i < 4; i++) add(g, box(.14, .03, .05, "#6F9B57"), Math.cos(i * 1.2 + .5) * .2, .12, Math.sin(i * 1.2 + .5) * .2).rotation.y = i; for (let i = 0; i < 3; i++) add(g, ball(.04, "#F1E6C8", 5), Math.cos(i * 2.1) * .42, .11, Math.sin(i * 2.1) * .42).scale.set(1.4, .8, 1); return g; },
  plancha: () => { const g = group(); add(g, cyl(.26, .22, .03, ES.marmol, 14), -.22, .015, 0); for (let i = 0; i < 6; i++) add(g, box(.1, .09, .1, "#E3B15C"), -.22 + Math.cos(i) * .12, .08, Math.sin(i) * .12).rotation.y = i; add(g, new THREE.Mesh(new THREE.TorusGeometry(.12, .022, 5, 14, Math.PI * 1.5), mat("#C9502E")), -.22, .14, 0).rotation.x = Math.PI / 2; for (let i = 0; i < 3; i++) add(g, ball(.055, "#B57A3A", 6), .3 + i * .06, .06, .16 - i * .12).scale.set(1.7, 1, 1); add(g, cyl(.05, .04, .16, ES.vidrio, 8), .34, .08, -.3); return g; },
  jamonEs: () => { const g = group(); const leg = add(g, ball(.2, "#8A3A2A", 10), 0, .34, 0); leg.scale.set(2.4, 1, .8); leg.rotation.z = .3; add(g, cyl(.05, .07, .5, "#E7CFA6", 6), -.62, .18, 0).rotation.z = 1.25; add(g, cyl(.16, .16, .02, "#C9635A", 12), .3, .5, 0).rotation.z = .3; for (let i = 0; i < 4; i++) add(g, box(.18, .01, .09, "#B0403A"), .3 + Math.cos(i) * .1, .06 + i * .008, -.35 + Math.sin(i) * .1).rotation.y = i * .6; add(g, cyl(.22, .2, .02, ES.marmol, 14), .3, .04, -.35); return g; },
  tortillaEs: () => { const g = group(); add(g, cyl(.38, .35, .16, "#E6B84A", 20), 0, .1, 0); add(g, cyl(.36, .36, .012, "#D89A3A", 20), 0, .19, 0); const w = add(g, cyl(.34, .34, .15, "#F2CC5A", 3), .42, .1, .2); w.rotation.y = .6; for (let i = 0; i < 3; i++) add(w, cyl(.09, .09, .02, "#F1E6C8", 8), 0, -.03 + i * .05, .06); add(g, ball(.06, "#E8D8B0", 6), -.45, .06, .3); return g; },
  churrosEs: () => { const g = group(); for (let i = 0; i < 5; i++) { const c = add(g, cyl(.035, .035, .62, "#D9A24A", 6), -.2 + i * .1, .05 + (i % 2) * .05, 0); c.rotation.x = Math.PI / 2; c.rotation.z = .2 - i * .1; for (let r = 0; r < 4; r++) add(c, box(.008, .62, .008, "#B8802A"), Math.cos(r * 1.57) * .036, 0, Math.sin(r * 1.57) * .036); } add(g, cyl(.13, .1, .3, ES.cal, 12), .5, .15, .1); add(g, cyl(.115, .115, .02, "#5A2E1E", 12), .5, .3, .1); return g; },
  pintxosEs: () => { const g = group(); add(g, cyl(.3, .26, .03, ES.marmol, 14), 0, .015, 0); for (let i = 0; i < 3; i++) { const b = add(g, new THREE.Group(), -.16 + i * .16, .03, (i % 2) * .12 - .06); add(b, box(.15, .06, .15, "#D9B77A"), 0, .03, 0); add(b, cyl(.008, .008, .24, "#C9B27A", 4), 0, .16, 0); add(b, ball(.04, "#8FA64A", 5), 0, .09, 0); add(b, ball(.03, "#8A7A70", 5), 0, .14, 0).scale.set(1.8, .8, .8); add(b, cone(.026, .09, "#9BB05A", 5), 0, .21, 0); } return g; },
  gazpachoEs: () => { const g = group(); add(g, cyl(.3, .22, .18, "#E9D9A6", 14), 0, .09, 0); add(g, cyl(.27, .27, .02, "#D9603A", 14), 0, .18, 0); add(g, ball(.11, "#D94F3A", 8), .42, .11, .1); add(g, cone(.05, .22, "#5F9A3C", 6), .4, .06, -.28).rotation.z = 1.3; add(g, cyl(.05, .06, .2, "#7A9A3A", 8), -.42, .1, .2); return g; },
  pulpoEs: () => { const g = group(); add(g, cyl(.36, .34, .045, "#C9A97A", 20), 0, .02, 0); for (let i = 0; i < 3; i++) add(g, cyl(.1, .1, .05, "#F1E6C8", 12), Math.cos(i * 2.1) * .16, .07, Math.sin(i * 2.1) * .16); for (let i = 0; i < 5; i++) { const p = add(g, cyl(.06, .055, .025, "#9B3B4A", 10), Math.cos(i * 1.26 + .5) * .18, .12, Math.sin(i * 1.26 + .5) * .18); add(p, cyl(.032, .032, .027, "#E2B0A6", 8), 0, .001, 0); } add(g, cyl(.08, .08, .09, "#B7BEC4", 12), .48, .045, -.2); add(g, cyl(.075, .075, .02, "#B2402B", 12), .48, .095, -.2); return g; },
  paTomaquet: () => { const g = group(); const s = add(g, box(.52, .07, .34, "#E3C48E"), 0, .035, 0); s.rotation.y = .2; add(s, box(.48, .016, .3, "#C9502E"), 0, .045, 0); add(g, ball(.11, "#D94F3A", 8), .4, .1, .26).scale.set(1, .55, 1); add(g, cyl(.07, .09, .24, "#8FA64A", 8), -.44, .12, .16); add(g, cyl(.016, .016, .12, "#8A8F94", 5), -.44, .3, .16); return g; },
  manchegoEs: () => { const g = group(); add(g, cyl(.32, .32, .2, "#E8DFC2", 20), 0, .1, 0); for (let i = 0; i < 12; i++) add(g, box(.12, .19, .014, "#C9A15A"), Math.cos(i * .52) * .32, .1, Math.sin(i * .52) * .32).rotation.y = -i * .52; for (let i = 0; i < 6; i++) add(g, box(.05, .014, .14, "#D8CCA8"), Math.cos(i * 1.05) * .12, .2, Math.sin(i * 1.05) * .12).rotation.y = i * 1.05; const w = add(g, cyl(.3, .3, .18, "#F3EEDE", 3), .48, .09, .22); w.rotation.y = .8; add(g, cyl(.305, .305, .012, "#C9A15A", 3), .48, .19, .22).rotation.y = .8; return g; },
  sidreriaEs: () => { const g = group(); add(g, cyl(.06, .066, .42, "#3B5A3A", 10), -.3, .5, 0); add(g, cyl(.026, .055, .16, "#3B5A3A", 8), -.3, .78, 0); const gl = add(g, new THREE.Group(), .3, .1, 0); gl.rotation.z = -.35; add(gl, new THREE.Mesh(new THREE.CylinderGeometry(.12, .085, .14, 14, 1, true), mat(ES.vidrio, { side: THREE.DoubleSide, transparent: true, opacity: .6 })), 0, .07, 0); add(gl, cyl(.1, .08, .025, "#E9D98A", 12), 0, .02, 0); add(g, cyl(.007, .007, .6, "#E9D98A", 6), 0, .42, 0).rotation.z = .55; add(g, ball(.09, "#C0392B", 7), -.55, .09, .28); return g; },
  bodegaJerez: () => { const g = group(); add(g, cyl(.055, .028, .16, ES.vidrio, 14), .22, .13, 0); add(g, cyl(.008, .008, .06, ES.vidrio, 6), .22, .04, 0); add(g, cyl(.05, .05, .012, ES.vidrio, 14), .22, .008, 0); add(g, cyl(.045, .032, .05, "#E3B85A", 12), .22, .1, 0); add(g, cyl(.008, .008, .7, "#C9CFD6", 6), -.3, .38, 0).rotation.z = -.2; add(g, cyl(.045, .04, .11, "#C9CFD6", 10), -.24, .06, 0); add(g, cyl(.3, .27, .22, ES.castano, 16), -.02, .11, -.42).rotation.z = Math.PI / 2; return g; },
};
