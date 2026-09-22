/**
 * Vietnam stands: one builder per `prop` name in the fixed blueprint of docs/vietnam-world.md. Owned by the Stand maker.
 * Every room stand follows the hotpot table in docs/building-a-world.md section 5: a shelter from the region, a visible
 * work surface, modelled food, an always-on food loop, six to nine people with idle motion, a walker whose legs step with
 * the distance it covers, lamps hung under a front beam, steam at every hot source, and a click chain that moves the food
 * first, the worker second, one bystander third and speaks last.
 *
 * Working dress is 1900 to 1931: the áo tứ thân and the yếm in the north, the áo bà ba in the south, the nón lá, the
 * northern nón quai thao and the southern khăn rằn. There are no motorbikes anywhere in this file: `motorbikes` keeps its
 * id and is displayed as street carriers with shoulder poles, handcarts and bicycles (docs/vietnam-world.md, Stage A
 * decisions). Nothing of Vietnam's stands stands in water.
 *
 * Buildings and residents are local until `vietnam-architecture.ts` and `vietnam-people.ts` land: every figure in this
 * file comes from `vnResident(seed, working)` below, whose body is one line to swap for `vietnamResident(seed, working)`.
 */
import * as THREE from "three";
import { add, mat, rnd, wear, bubble, ambientChat, tickChildren, person, chicken, tree, type P } from "./props";
import { VN_LINES } from "./vietnam-speech";

const group = (): P => new THREE.Group() as P;
const box = (w: number, h: number, d: number, c: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
const cyl = (rt: number, rb: number, h: number, c: string, seg = 12) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(c));
const cone = (r: number, h: number, c: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(c));
const ball = (r: number, c: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(c));
const ring = (r: number, thick: number, c: string, arc = Math.PI * 2, opacity = 1) => new THREE.Mesh(new THREE.TorusGeometry(r, thick, 5, 16, arc), mat(c, opacity < 1 ? { transparent: true, opacity } : {}));
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
type Figure = P;
const upper = (p: Figure) => p.userData.upper as THREE.Group;
const arms = (p: Figure) => p.userData.arms as { left: THREE.Group; right: THREE.Group; hand: number };
const legsOf = (p: Figure) => p.userData.legs as { left: { thigh: THREE.Group; shin: THREE.Group }; right: { thigh: THREE.Group; shin: THREE.Group } };
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Vietnamese palette: lime wash, ochre render, terracotta and yin-yang tile, teak, bamboo, thatch, river and delta greens. */
const VNC = {
  voi: "#F1E8D6", ochre: "#D9A24A", vangDam: "#C3862F", gach: "#B4572F", ngoi: "#6A5B4A", ngoiAm: "#4A4038",
  go: "#7A4A2A", goDam: "#4A2F1C", tre: "#C9B06A", la: "#D9C088", laKho: "#B79E62",
  luc: "#6F9B57", laChuoi: "#3F7A3A", rau: "#7FBF5A", song: "#6F9FA8", dat: "#C9C0A8",
  do: "#B03A2E", vang: "#D9A441", sanh: "#DFE6E3", men: "#9FC2C4", nuocMam: "#B5701F", than: "#2E2B2A",
  thit: "#B0553A", bun: "#F4EFE2", nuoc: "#C98A3A", pate: "#9B6A4A", banhMi: "#E3B871", com: "#A9C87A",
};

/**
 * Ambient speech per object id, Vietnamese then English on one line: the Researcher's `VN_LINES` in
 * `vietnam-speech.ts`, re-exported here because the module contract in docs/vietnam-world.md lists `VN_LINES` among
 * this file's exports. Every stand reads its lines through `VN_LINES[id]`; nothing in this file declares a second copy.
 */
export { VN_LINES } from "./vietnam-speech";

// ---------- reaction machinery, the shape props-spain.ts and props-turkey.ts use ----------

/** A sine pulse that runs between two points of the decaying reaction `k`. */
const beat = (k: number, start = 0, end = 1) => (k > 0 ? Math.sin(Math.PI * clamp01(((1 - k) - start) / (end - start))) : 0);
/**
 * A held pose rather than a pulse: it rises in the first quarter of the reaction, holds at one across the 1.6-second
 * camera arrival and falls back to exactly zero as the reaction ends. A strike that is over in a third of a second —
 * a pestle, a bruising block — needs this, or the visitor arrives after the only frame that showed anything.
 */
const hold = (k: number, edge = .25) => (k > 0 ? clamp01(k / edge) * clamp01((1 - k) / edge) : 0);

function deferredBubble(targets: THREE.Object3D[], lines: string[], y: number, ms: number) {
  let delay = -1, n = 0;
  return {
    schedule() { delay = .28; },
    tick(dt: number) { if (delay < 0) return; delay -= dt; if (delay <= 0) { delay = -1; n++; bubble(targets[n % targets.length], lines[n % lines.length], y, ms); } },
  };
}

/**
 * The stand animates itself. Anything tagged `userData.foodReaction` moves first, the worker (people[0]) follows, one
 * bystander (people[1]) acknowledges, speech comes last through a deferred bubble, then the ambient chat. The reaction
 * decays over about 3.5 s so the food beat is still plainly readable when the 1.6-second camera approach finishes.
 */
function life(g: P, id: string, people: Figure[], work?: (t: number, k: number, dt: number) => void, onPoke?: () => void, speakers?: Figure[]) {
  g.userData.ownReaction = true;
  let reaction = 0;
  const lines = VN_LINES[id] ?? ["Xin chào! Hello!"];
  const food: { object: THREE.Object3D; position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }[] = [];
  g.traverse((o) => { if (o.userData.foodReaction) food.push({ object: o, position: o.position.clone(), rotation: o.rotation.clone(), scale: o.scale.clone() }); });
  const chat = ambientChat(g, lines);
  const speech = deferredBubble((speakers ?? people).length ? (speakers ?? people) : [g], lines, 1.45, 1800);
  g.userData.poke = () => { reaction = 1; onPoke?.(); speech.schedule(); };
  g.userData.tick = (t, dt) => {
    reaction = Math.max(0, reaction - dt * .285);
    tickChildren(g)(t, dt);
    people.forEach((p, i) => { if (p.userData.tick || p.userData.__paced) return; const u = upper(p); if (!u) return; u.rotation.y = Math.sin(t * .45 + i) * .09; u.rotation.z = Math.sin(t * .7 + i) * .025; });
    food.forEach(({ object, position, rotation, scale }, i) => {
      const phase = clamp01((1 - reaction - (i % 3) * .09) / .73), pulse = reaction > 0 ? Math.sin(Math.PI * phase) : 0;
      object.position.copy(position); object.rotation.copy(rotation); object.scale.copy(scale);
      switch (object.userData.foodReaction) {
        case "hop": object.position.y += pulse * .30; object.rotation.y += pulse * .9; break;
        case "lift": object.position.y += pulse * .38; object.position.z += pulse * .10; object.rotation.x -= pulse * .38; break;
        case "puff": object.scale.y = scale.y * (1 + pulse * 1.3); object.position.y += pulse * .26; break;
        case "contents": object.scale.set(scale.x * (1 + pulse * .13), scale.y * (1 + pulse * .7), scale.z * (1 + pulse * .13)); object.position.y += pulse * .18; break;
        case "sway": object.rotation.z += pulse * .32; break;
        default: break;
      }
    });
    if (people[0]) arms(people[0]).right.rotation.z = -beat(reaction, .52, .90) * .14;
    if (people[1]) { const u = upper(people[1]); if (u) u.rotation.x = (people[1].userData.__paced ? u.rotation.x : 0) + beat(reaction, .58, 1) * .13; }
    work?.(t, reaction, dt);
    speech.tick(dt);
    chat(dt);
  };
  return g;
}

/** A thin liquid column between a real lip and a real vessel; never a line hanging in the air. */
function stream(g: THREE.Object3D, name: string, color: string, radius = .028) {
  const mesh = add(g, new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.15, 1, 8), mat(color, { emissive: color, emissiveIntensity: .16, transparent: true, opacity: .92 })));
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
/** World-space point of a local offset on a tilted object, expressed in the stand's own space. */
function tipOf(obj: THREE.Object3D, local: THREE.Vector3, out: THREE.Vector3) { return out.copy(local).applyQuaternion(obj.quaternion).add(obj.position); }
/** Rings that open where something lands or where the water is disturbed. */
function ripples(g: THREE.Object3D, n: number, x: number, y: number, z: number, r: number, color: string) {
  return Array.from({ length: n }, (_, i) => {
    const m = add(g, ring(r * (1 + i * .5), r * .12, color, Math.PI * 2, .7), x, y, z);
    m.rotation.x = Math.PI / 2; m.visible = false; return m;
  });
}

// ---------- residents, seats, walkers ----------

/**
 * Eight clothing profiles of 1900 to 1931, as data. North: the áo tứ thân over a yếm with the nón quai thao or the
 * khăn mỏ quạ; centre: plainer tunics under the nón lá; south: the áo bà ba with the khăn rằn. `working` swaps the
 * outer panels for a work cloth and rolls the trousers, which is what a counter trade wears.
 */
const VN_PROFILES = [
  { name: "hanoi-ao-tu-than", shirt: "#7A3B48", panel: "#5C2B37", yem: "#C9503A", hat: "quai-thao" as const, scarf: "" },
  { name: "hanoi-townsman", shirt: "#3E4A5C", panel: "#2E3848", yem: "", hat: "none" as const, scarf: "" },
  { name: "hanoi-market-woman", shirt: "#4E6B4A", panel: "#3A5238", yem: "#D9A24A", hat: "mo-qua" as const, scarf: "" },
  { name: "centre-hue-tunic", shirt: "#D8CDB6", panel: "#B9A98A", yem: "", hat: "non-la" as const, scarf: "" },
  { name: "centre-porter", shirt: "#8A7A5E", panel: "", yem: "", hat: "non-la" as const, scarf: "" },
  { name: "south-ao-ba-ba-black", shirt: "#2C2C32", panel: "", yem: "", hat: "non-la" as const, scarf: "khan-ran" as const },
  { name: "south-ao-ba-ba-indigo", shirt: "#2F4A63", panel: "", yem: "", hat: "none" as const, scarf: "khan-ran" as const },
  { name: "delta-child", shirt: "#C9754A", panel: "", yem: "", hat: "none" as const, scarf: "" },
];

/**
 * One resident in the dress of the band. Swapping this to `vietnam-people.ts` is one line: replace the body with
 * `return vietnamResident(seed, working) as Figure;` and every stand in this file follows, because no stand builds a
 * figure any other way.
 */
function vnResident(seed: number, working = false): Figure {
  const style = VN_PROFILES[Math.abs(Math.round(seed)) % VN_PROFILES.length];
  const child = style.name === "delta-child";
  const p = person(style.shirt, { apron: working && !child }) as Figure;
  const s = (p.userData.figureScale as number) ?? 1;
  if (style.panel && !working) {                                     // the four panels of the áo tứ thân, front and back
    for (const z of [.13 * s, -.13 * s]) wear(p, box(.30 * s, .56 * s, .03, style.panel), 0, .52 * s, z);
    for (const x of [-.15 * s, .15 * s]) wear(p, box(.03, .54 * s, .26 * s, style.panel), x, .52 * s, 0);
  }
  if (style.yem && !working) wear(p, box(.22 * s, .26 * s, .03, style.yem), 0, .70 * s, .14 * s);
  if (working) wear(p, box(.30 * s, .18 * s, .28 * s, "#B9A98A"), 0, .50 * s, 0);   // the work cloth tied at the waist
  // The hats are sized off the shoulders, not off the head: a nón lá a little wider than the body reads as a hat at
  // world zoom, while the wide cone props-seasia.ts used hid the whole figure under a lampshade.
  if (style.hat === "non-la") { wear(p, cone(.23 * s, .19 * s, VNC.la, 14), 0, 1.17 * s, 0); wear(p, cyl(.24 * s, .24 * s, .012, VNC.laKho, 14), 0, 1.09 * s, 0); }
  if (style.hat === "quai-thao") { wear(p, cyl(.27 * s, .27 * s, .04, VNC.la, 16), 0, 1.14 * s, 0); wear(p, cyl(.15 * s, .15 * s, .08, VNC.laKho, 12), 0, 1.17 * s, 0); wear(p, box(.02, .20 * s, .02, "#5C2B37"), .15 * s, 1.02 * s, 0); }
  if (style.hat === "mo-qua") { wear(p, box(.30 * s, .16 * s, .28 * s, "#2C2C32"), 0, 1.10 * s, -.02 * s); wear(p, cone(.10 * s, .16 * s, "#2C2C32", 5), 0, 1.14 * s, .13 * s).rotation.x = 1.5; }
  if (style.scarf === "khan-ran") { wear(p, box(.34 * s, .10 * s, .22 * s, "#E8E2D2"), 0, 1.00 * s, -.02 * s); wear(p, box(.09 * s, .34 * s, .03, "#E8E2D2"), .10 * s, .80 * s, .13 * s); }
  if (child) p.scale.setScalar(.72);
  p.userData.vnProfile = style.name;
  return p;
}

type Role = "cook" | "server" | "carrier" | "north" | "northWoman" | "centre" | "south" | "southWoman" | "child";
/** Seeds into VN_PROFILES: a counter trade comes from the working band, everyone else keeps the profile's own dress. */
const SEED: Record<Role, number> = { cook: 3, server: 5, carrier: 4, north: 1, northWoman: 0, centre: 3, south: 5, southWoman: 2, child: 7 };
let nth = 0;
function resident(role: Role, working = role === "cook" || role === "server"): Figure {
  return vnResident(SEED[role] + 8 * (nth++ % 5) + (role === "child" ? 0 : 0), working);
}

/** The pelvis rests on the seat; the seat stands a little behind the hanging calves. */
function seatFigure(g: THREE.Object3D, fig: Figure, x: number, z: number, angle: number, seatTop: number): Figure {
  fig.userData.sit?.();
  const pelvis = fig.children.find((c) => c instanceof THREE.Mesh) as THREE.Mesh;
  pelvis.geometry.computeBoundingBox();
  const bottom = (pelvis.position.y + pelvis.geometry.boundingBox!.min.y) * fig.scale.y;
  add(g, fig, x, seatTop - bottom, z).rotation.y = angle; fig.name = "vn-sitter"; fig.userData.seatTop = seatTop;
  return fig;
}
/** A low stool of the street kitchens, about a hand's width off the ground, with someone on it. */
function stool(g: THREE.Object3D, x: number, z: number, angle: number, role: Role, height = .26): Figure {
  const seat = add(g, cyl(.15, .15, height, VNC.go, 10), x - Math.sin(angle) * .10, height / 2, z - Math.cos(angle) * .10); seat.name = "vn-stool";
  return seatFigure(g, resident(role, false), x, z, angle, height);
}
function bench(g: THREE.Object3D, x: number, z: number, len: number, angle: number, height = .34) {
  const b = add(g, new THREE.Group(), x, 0, z); b.rotation.y = angle;
  add(b, box(len, .06, .30, VNC.go), 0, height, -.10).name = "vn-bench";
  for (const dx of [-len / 2 + .13, len / 2 - .13]) add(b, box(.07, height - .06, .26, VNC.goDam), dx, (height - .06) / 2, -.10);
  return height;
}
function lowTable(g: THREE.Object3D, x: number, z: number, w = 1.2, d = .8, height = .40, color = VNC.go) {
  add(g, box(w, .06, d, color), x, height - .03, z);
  for (const dx of [-w / 2 + .10, w / 2 - .10]) for (const dz of [-d / 2 + .09, d / 2 - .09]) add(g, box(.07, height - .06, .07, VNC.goDam), x + dx, (height - .06) / 2, z + dz);
  return height;
}

/**
 * A walker that paces a segment, pauses and turns at each end. The legs are driven by the distance covered, not by the
 * clock: `person()`'s gait runs one full cycle per 0.898 of its argument, so two steps cover `2 * stride`. A figure
 * handed to this keeps its own y, which is what the "people stay on their supports" check measures.
 */
function pacer(p: Figure, from: THREE.Vector3, to: THREE.Vector3, speed = .35, phase = 0, pause = 1.6) {
  const dir = to.clone().sub(from), len = dir.length(), leg = len / speed, cycle = 2 * (leg + pause), heading = Math.atan2(dir.x, dir.z);
  const stride = .58 * ((p.userData.figureScale as number) ?? 1) * p.scale.y;
  const legs = legsOf(p), armPair = arms(p);
  let travelled = 0, previous = 0;
  p.userData.__paced = true;
  return (t: number) => {
    const s = ((t + phase) % cycle + cycle) % cycle;
    let d: number, facing: number, moving: boolean;
    if (s < leg) { d = s * speed; facing = heading; moving = true; }
    else if (s < leg + pause) { d = len; facing = heading + Math.PI * clamp01((s - leg) / pause); moving = false; }
    else if (s < 2 * leg + pause) { d = len - (s - leg - pause) * speed; facing = heading + Math.PI; moving = true; }
    else { d = 0; facing = heading + Math.PI + Math.PI * clamp01((s - 2 * leg - pause) / pause); moving = false; }
    travelled += Math.abs(d - previous); previous = d;
    p.position.copy(from).addScaledVector(dir, d / len); p.rotation.y = facing;
    if (moving) p.userData.walk?.((travelled / (2 * stride)) * .898);
    else { legs.left.thigh.rotation.x = legs.right.thigh.rotation.x = 0; legs.left.shin.rotation.x = legs.right.shin.rotation.x = 0; armPair.left.rotation.x = armPair.right.rotation.x = 0; }
  };
}

// ---------- lamps, signs, shelters ----------

/** A paper or glass street lamp on a cord. Same conventions as `lantern()`: the name, the suspension point, the cord last. */
function vnLamp(scale = 1, color = "#F2C46A"): P {
  const g = group(); g.name = "hanging-lantern";
  const anchorY = .4 * scale; g.userData.suspensionPoint = V(0, anchorY, 0);
  const swing = new THREE.Group(); swing.position.y = anchorY; g.add(swing);
  add(swing, cyl(.10 * scale, .13 * scale, .06 * scale, VNC.than, 8), 0, -.20 * scale, 0);
  const globe = add(swing, ball(.13 * scale, color, 9), 0, -.32 * scale, 0);
  globe.material = mat(color, { emissive: "#E9A94A", emissiveIntensity: .65 });
  add(swing, cyl(.055 * scale, .085 * scale, .06 * scale, VNC.than, 8), 0, -.44 * scale, 0);
  add(swing, cyl(.008, .008, .16 * scale, VNC.than, 4), 0, -.08 * scale, 0);   // the cord, last, its top at the anchor
  const phase = rnd() * 6;
  g.userData.tick = (t) => { swing.rotation.z = Math.sin(t * 1.3 + phase) * .06; swing.rotation.x = Math.cos(t * 1.0 + phase) * .035; };
  return g;
}
/** Two lamps hung from the underside of a front beam. */
function lamps(g: P, beamY: number, z: number, xs: number[], scale = .9, color = "#F2C46A") { for (const x of xs) add(g, vnLamp(scale, color), x, beamY - .08 - .4 * scale, z); }

const SIGN_TEX: Record<string, THREE.CanvasTexture> = {};
function signTexture(text: string, w: number, h: number, ink: string, paper: string): THREE.CanvasTexture {
  const key = [text, w, h, ink, paper].join("|"); if (SIGN_TEX[key]) return SIGN_TEX[key];
  const W = 256, H = Math.round((256 * h) / w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.strokeRect(3, 3, W - 6, H - 6);
  ctx.fillStyle = ink; ctx.font = `bold ${Math.min(H * .58, (W * 1.45) / Math.max(4, text.length))}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; SIGN_TEX[key] = tex; return tex;
}
/** A painted shop board of the period: quốc ngữ on a lacquered panel. */
function sign(g: THREE.Object3D, text: string, w: number, h: number, x: number, y: number, z: number, ink = VNC.voi, paper = VNC.do, rot = 0) {
  const b = new THREE.Group(); b.position.set(x, y, z); b.rotation.y = rot; g.add(b);
  add(b, box(w + .06, h + .06, .04, VNC.goDam), 0, 0, -.01);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: signTexture(text, w, h, ink, paper), roughness: .85 }));
  face.position.z = .015; b.add(face);
}

type Style = "tube" | "courtyard" | "hue" | "hoiAn" | "cholon" | "stilt";
const WALLS: Record<Style, { wall: string; roof: string; trim: string }> = {
  tube: { wall: VNC.ochre, roof: VNC.gach, trim: VNC.goDam },
  courtyard: { wall: VNC.voi, roof: VNC.ngoi, trim: VNC.tre },
  hue: { wall: "#E4DCC6", roof: "#C4BBA6", trim: VNC.go },
  hoiAn: { wall: "#E8D9A8", roof: VNC.ngoi, trim: VNC.do },
  cholon: { wall: "#E9DCC2", roof: VNC.gach, trim: VNC.vangDam },
  stilt: { wall: "#C9A86A", roof: VNC.la, trim: VNC.go },
};
/** A house of the region, standing behind a working bay: a tube front, a screened courtyard, a Huế tile roof, a Hội An or Chợ Lớn shophouse, a delta stilt house. */
function vnHouse(style: Style, w = 3.2, d = 2.6, h = 2.6, opts: { storeys?: number } = {}): P {
  const g = group(); const { wall, roof, trim } = WALLS[style];
  const storeys = opts.storeys ?? (style === "tube" || style === "cholon" ? 2 : 1);
  const H = style === "stilt" ? h : h * storeys;
  if (style === "stilt") {
    for (const x of [-w / 2 + .2, w / 2 - .2]) for (const z of [-d / 2 + .2, d / 2 - .2]) add(g, cyl(.08, .09, 1.1, VNC.go, 6), x, .55, z);
    add(g, box(w, .12, d, "#A37A4F"), 0, 1.1, 0);
    add(g, box(w - .5, h - .5, d - .4, wall), 0, 1.1 + (h - .5) / 2, -.1);
  } else {
    add(g, box(w, H, d, wall), 0, H / 2, 0);
    for (let s = 0; s < storeys; s++) {
      if (style === "courtyard") { for (let k = 0; k < 4; k++) add(g, box(w / 4 - .08, H * .5, .04, VNC.tre), -w / 2 + w / 8 + (k * w) / 4, H * .5, d / 2 + .03); }
      else {
        add(g, box(w * .38, h * .50, .04, trim), 0, s * h + h * .55, d / 2 + .02);                       // the frame
        add(g, box(w * .34, h * .46, .06, style === "tube" ? "#6FA3B3" : VNC.goDam), 0, s * h + h * .55, d / 2 + .04);
        for (const sx of [-1, 1]) add(g, box(w * .09, h * .46, .05, trim), sx * w * .21, s * h + h * .55, d / 2 + .05);   // the shutters, folded back
        add(g, box(w * .5, .05, .26, trim), 0, s * h + h * .30, d / 2 + .14);
      }
      if (s > 0) for (let k = 0; k < 5; k++) add(g, box(.02, .34, .02, VNC.than), -w * .22 + k * w * .11, s * h + h * .30 + .19, d / 2 + .25);
    }
    add(g, box(w + .1, .1, .22, trim), 0, H + .04, d / 2 + .02);
  }
  // the roof, two slopes on a ridge with tile or thatch strips, so it reads as a roof from the overview camera
  const base = style === "stilt" ? 1.1 + h - .5 : H, half = (d + .5) / 2, pitch = style === "hue" || style === "stilt" ? .5 : .34;
  const slope = Math.sqrt(half * half + (half * pitch) ** 2);
  for (const side of [-1, 1]) {
    const r = add(g, box(w + .5, .1, slope, roof), 0, base + .08 + (half * pitch) / 2, (side * half) / 2);
    r.rotation.x = side * Math.atan(pitch);
    if (roof !== VNC.la) for (let i = 0; i < Math.floor((w + .5) / .32); i++) add(r, cyl(.045, .045, slope, side > 0 ? roof : WALLS[style].roof, 6), -(w + .5) / 2 + .16 + i * .32, .055, 0).rotation.x = Math.PI / 2;
    else for (let i = 0; i < 6; i++) add(r, box(w + .5, .03, slope / 7, VNC.laKho), 0, .06, -slope / 2 + (slope / 7) * (i + .7));
  }
  add(g, box(w + .6, .1, .14, roof === VNC.la ? VNC.go : VNC.ngoiAm), 0, base + .13 + half * pitch, 0);
  return g;
}
/**
 * An open-front working bay of the region, built against a real house: the house stands behind so the bay reads as its
 * ground floor, and the bay adds a back wall, side walls, a pitched roof and a front beam on two corner posts where the
 * lamps hang. The floor is a low plinth inside the walls only, never a plane coplanar with the town paving, and nothing
 * stands on the bay's centre line, so the arrival camera looks straight in at the work surface.
 */
function shelter(g: P, style: Style, w = 5.0, d = 3.0, h = 2.5, opts: { sign?: string; storeys?: number } = {}) {
  const { wall, roof, trim } = WALLS[style], zBack = -d / 2 - .6, zFront = d / 2 - .6;
  add(g, vnHouse(style, w - .4, 2.6, style === "cholon" || style === "tube" ? 2.4 : 2.6, { storeys: opts.storeys }), 0, 0, zBack - 1.4);
  add(g, box(w, .08, d, VNC.dat), 0, .04, -.6);
  add(g, box(w, h, .16, wall), 0, h / 2, zBack);
  for (const x of [-w / 2 + .08, w / 2 - .08]) add(g, box(.16, h, d, wall), x, h / 2, -.6);
  for (const x of [-w / 2 + .12, w / 2 - .12]) add(g, box(.14, h, .14, trim), x, h / 2, zFront + .1);
  const beam = add(g, box(w + .1, .16, .2, VNC.go), 0, h + .08, zFront + .1); beam.name = "front-beam";
  add(g, box(w + .1, .14, .18, VNC.go), 0, h + .08, zBack);
  const half = (d + .9) / 2, pitch = style === "hue" ? .48 : .36, slope = Math.sqrt(half * half + (half * pitch) ** 2);
  for (const side of [-1, 1]) {
    const r = add(g, box(w + .6, .1, slope, roof), 0, h + .16 + (half * pitch) / 2, -.6 + (side * half) / 2);
    r.rotation.x = side * Math.atan(pitch);
    if (roof !== VNC.la) for (let i = 0; i < Math.floor((w + .6) / .3); i++) add(r, cyl(.05, .05, slope, VNC.ngoiAm, 6), -(w + .6) / 2 + .15 + i * .3, .06, 0).rotation.x = Math.PI / 2;
    else for (let i = 0; i < 6; i++) add(r, box(w + .6, .03, slope / 7, VNC.laKho), 0, .06, -slope / 2 + (slope / 7) * (i + .7));
  }
  add(g, box(w + .7, .1, .12, roof === VNC.la ? VNC.go : VNC.ngoiAm), 0, h + .21 + half * pitch, -.6);
  if (opts.sign) sign(g, opts.sign, Math.min(2.4, w * .46), .34, 0, h - .3, zFront + .22);
  return { beam, y: h + .08, zFront: zFront + .1, zBack };
}
/** A counter of brick and board, or a bamboo bench top, with its surface clear for the food. */
function counter(g: THREE.Object3D, x: number, z: number, w = 2.8, d = .7, top = .90, body = VNC.gach) {
  add(g, box(w, top - .06, d, body), x, (top - .06) / 2, z);
  add(g, box(w + .1, .06, d + .1, VNC.go), x, top - .03, z);
  return top;
}

// ---------- small food and tool parts ----------

/** A porcelain bowl with a noodle mound and its garnish; the mound is what a click lifts. */
function noodleBowl(g: THREE.Object3D, x: number, y: number, z: number, r = .17, broth = "#D8B87A", tag = false) {
  const b = add(g, new THREE.Group(), x, y, z);
  add(b, cyl(r, r * .66, r * 1.15, VNC.sanh, 14), 0, r * .58, 0);
  add(b, cyl(r * .92, r * .92, .02, broth, 14), 0, r * 1.02, 0);
  const mound = add(b, new THREE.Group(), 0, r * 1.02, 0);
  for (let i = 0; i < 7; i++) add(mound, cyl(.012, .012, r * 1.1, VNC.bun, 4), Math.cos(i * .9) * r * .4, .03, Math.sin(i * .9) * r * .4).rotation.set(1.4, i, .2);
  for (let i = 0; i < 3; i++) add(mound, ball(r * .2, VNC.thit, 6), Math.cos(i * 2.1) * r * .45, .06, Math.sin(i * 2.1) * r * .45).scale.set(1.3, .5, 1);
  for (let i = 0; i < 4; i++) add(mound, ball(r * .17, VNC.rau, 5), Math.cos(i * 1.6 + .6) * r * .5, .07, Math.sin(i * 1.6 + .6) * r * .5).scale.set(1, .5, 1.3);
  if (tag) mound.userData.foodReaction = "hop";
  return { bowl: b, mound, lip: V(x, y + r * 1.05, z) };
}
/** A round bamboo steamer basket, its lid liftable. */
function steamer(g: THREE.Object3D, x: number, y: number, z: number, r = .30, tiers = 2) {
  const s = add(g, new THREE.Group(), x, y, z);
  for (let i = 0; i < tiers; i++) { add(s, cyl(r, r, .12, VNC.tre, 16), 0, .06 + i * .13, 0); add(s, cyl(r + .015, r + .015, .02, VNC.laKho, 16), 0, .12 + i * .13, 0); }
  const lid = add(s, new THREE.Group(), 0, .13 * tiers, 0);
  add(lid, cyl(r + .02, r + .02, .05, VNC.laKho, 16), 0, .025, 0);
  add(lid, cone(r * .5, .09, VNC.tre, 12), 0, .08, 0);
  return { steamerGroup: s, lid };
}
/** A charcoal brazier: a clay body, glowing coals and a grate. */
function brazier(g: THREE.Object3D, x: number, y: number, z: number, r = .26) {
  const b = add(g, new THREE.Group(), x, y, z);
  add(b, cyl(r, r * .8, .30, "#9B5A3A", 12), 0, .15, 0);
  add(b, cyl(r * .86, r * .86, .04, VNC.than, 12), 0, .29, 0);
  const coals = Array.from({ length: 5 }, (_, i) => {
    const c = add(b, ball(.05, "#E0522A", 6), Math.cos(i * 1.3) * r * .5, .31, Math.sin(i * 1.3) * r * .5);
    c.material = mat("#E0522A", { emissive: "#E0522A", emissiveIntensity: .8 }); return c;
  });
  for (let i = 0; i < 5; i++) add(b, cyl(.012, .012, r * 1.7, VNC.than, 4), 0, .35, -r * .8 + (i * r * 1.6) / 4).rotation.z = Math.PI / 2;
  return { brazierGroup: b, coals };
}
/** A woven basket with something in it. */
function basket(g: THREE.Object3D, x: number, y: number, z: number, r = .26, h = .22, fill?: { color: string; n: number; size: number }) {
  const b = add(g, new THREE.Group(), x, y, z);
  add(b, cyl(r, r * .82, h, VNC.tre, 12), 0, h / 2, 0);
  add(b, ring(r, .018, VNC.laKho), 0, h, 0).rotation.x = Math.PI / 2;
  if (fill) for (let i = 0; i < fill.n; i++) add(b, ball(fill.size, fill.color, 6), Math.cos(i * 1.7) * r * .5, h - .02 + (i % 2) * .04, Math.sin(i * 1.7) * r * .5);
  return b;
}
/** A banana leaf laid flat, the plate of the country. */
function bananaLeaf(g: THREE.Object3D, x: number, y: number, z: number, w = .42, d = .28) {
  const l = add(g, box(w, .012, d, VNC.laChuoi), x, y, z);
  add(g, box(w * .96, .014, .01, "#2F5F2C"), x, y + .008, z);
  return l;
}
/** A clay jar of fish sauce or rice wine with a woven lid. */
function jar(g: THREE.Object3D, x: number, y: number, z: number, r = .26, h = .60) {
  const j = add(g, new THREE.Group(), x, y, z);
  add(j, cyl(r * .8, r * .7, h, "#8A4A2A", 12), 0, h / 2, 0);
  add(j, ball(r, "#8A4A2A", 12), 0, h * .55, 0).scale.set(1, .5, 1);
  add(j, cyl(r * .5, r * .55, .06, "#7A5A3A", 12), 0, h + .02, 0);
  add(j, cyl(r * .52, r * .52, .03, VNC.laKho, 12), 0, h + .06, 0);
  return j;
}

// ---------- the twelve room stands ----------

/**
 * hanoiKitchen — the phở gánh in the guild street: the stock pot on its brazier, the noodle baskets, the bowl resting on
 * the board. A click lifts the ladle out of the pot and a column of broth falls into the bowl; the noodles lift with it.
 */
export function phoGanhVn(): P {
  const g = group();
  const sh = shelter(g, "tube", 5.2, 3.0, 2.5, { sign: "PHỞ" });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .85);
  const cy = counter(g, 0, 1.15, 3.2, .74);
  // the gánh itself: the shoulder pole and its two loads resting on trestles at the end of the counter
  add(g, cyl(.028, .028, 2.0, VNC.tre, 6), -2.1, 1.05, .5).rotation.x = Math.PI / 2;
  for (const z of [-.3, 1.3]) add(g, box(.34, 1.0, .34, VNC.go), -2.1, .5, z);
  // the stock pot on its brazier, always simmering: the always-on loop
  const { coals } = brazier(g, -1.15, cy, 1.15, .30);
  const pot = add(g, new THREE.Group(), -1.15, cy + .32, 1.15);
  add(pot, cyl(.32, .28, .40, "#8C9096", 16), 0, .20, 0);
  const brothTop = add(pot, cyl(.30, .30, .02, VNC.nuoc, 16), 0, .40, 0);
  const simmer = Array.from({ length: 6 }, (_, i) => add(pot, ball(.035, "#E3C48A", 5), Math.cos(i * 1.1) * .18, .40, Math.sin(i * 1.1) * .18));
  add(g, cyl(.02, .02, .5, VNC.go, 5), -1.15, cy + .78, .82).rotation.x = .5;   // the skimmer resting on the rim
  // modelled food: the resting bowl, the noodle baskets, the herb plate, the beef on the board
  const { bowl, mound, lip } = noodleBowl(g, .55, cy, 1.15, .19, VNC.nuoc, true);
  bowl.name = "pho-bowl";
  for (const [i, x] of [-.15, .15].entries()) { const bk = basket(g, x, cy, .95, .17, .12, { color: VNC.bun, n: 5, size: .05 }); bk.userData.foodReaction = i ? "sway" : undefined; }
  bananaLeaf(g, 1.25, cy + .01, 1.05, .46, .30);
  for (let i = 0; i < 5; i++) add(g, ball(.055, VNC.rau, 5), 1.1 + (i % 3) * .12, cy + .04, .98 + Math.floor(i / 3) * .12).scale.set(1, .5, 1.4);
  for (let i = 0; i < 4; i++) add(g, box(.11, .012, .07, VNC.thit), 1.35 + (i % 2) * .1, cy + .03 + i * .012, 1.18).rotation.y = i * .4;   // thin raw beef
  add(g, cyl(.06, .05, .09, VNC.vang, 8), 1.6, cy + .04, .95); for (let i = 0; i < 3; i++) add(g, ball(.028, "#C9302A", 5), 1.55 + i * .05, cy + .09, .95);   // chilli in a dish
  // the ladle and the falling broth
  const ladle = add(g, new THREE.Group(), -1.15, cy + .45, 1.15); ladle.name = "pho-ladle";
  add(ladle, cyl(.09, .07, .07, "#8C9096", 10), 0, 0, 0);
  add(ladle, cyl(.013, .013, .26, VNC.go, 5), 0, .14, -.05).rotation.x = .25;
  add(ladle, cyl(.085, .085, .02, VNC.nuoc, 10), 0, .025, 0);
  const ladleRest = ladle.position.clone(), lipLocal = V(0, -.02, .08), spout = V();
  const broth = stream(g, "pho-broth-stream", "#E0A44A", .034);
  const splash = ripples(g, 3, .55, 1.10, 1.15, .07, "#F0C878");
  g.userData.steam = V(-1.15, cy + .95, 1.15); g.userData.smoke = V(-1.15, cy + .5, 1.15);
  // people: the cook at the pot, a helper at the noodle baskets, four on low stools, one walker with a pole
  const cook = add(g, resident("cook"), -1.95, 0, .62); cook.rotation.y = .6;
  const helper = add(g, resident("server"), 1.0, 0, .52); helper.rotation.y = -.3;
  const diners = [stool(g, -1.5, 3.1, Math.PI, "north"), stool(g, -.5, 3.1, Math.PI, "northWoman"), stool(g, .6, 3.1, Math.PI, "north"), stool(g, 1.6, 3.1, Math.PI, "centre")];
  for (const x of [-1.5, -.5, .6, 1.6]) { noodleBowl(g, x, lowTable(g, x, 2.55, .9, .7), 2.55, .13); }
  const walker = add(g, resident("carrier", false), 2.8, 0, 2.2);
  const pole = add(upper(walker), cyl(.02, .02, 1.6, VNC.tre, 4), .16, .42, .04); pole.rotation.x = Math.PI / 2;
  for (const z of [-.66, .66]) { add(upper(walker), cyl(.01, .01, .34, VNC.laKho, 3), .16, .26, z); basket(upper(walker), .16, -.02, z, .18, .16, { color: VNC.rau, n: 4, size: .06 }); }
  const walk = pacer(walker, V(2.8, 0, 2.2), V(-2.8, 0, 3.4), .34, 1.2);
  return life(g, "hanoiKitchen", [cook, diners[1], helper, ...diners.filter((_, i) => i !== 1), walker], (t, k) => {
    // always on: the stock simmers and the coals breathe
    simmer.forEach((b, i) => { b.position.y = .40 + Math.max(0, Math.sin(t * 3.4 + i * 1.1)) * .035; });
    brothTop.position.y = .40 + Math.sin(t * 1.7) * .004;
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .55 + Math.sin(t * 2.1 + i) * .2 + beat(k, .1, .9) * .5; });
    // 1. food first: the ladle lifts out of the pot and the broth falls into the resting bowl
    const lift = beat(k, 0, .72);
    ladle.position.copy(ladleRest);
    ladle.position.y = ladleRest.y + lift * .30; ladle.position.x = ladleRest.x + lift * 1.66; ladle.position.z = ladleRest.z + lift * .02;
    ladle.rotation.z = -lift * .8;
    tipOf(ladle, lipLocal, spout);
    const progress = 1 - k, pouring = k > 0 && progress > .14 && progress < .66;
    broth.set(spout, lip, pouring);
    splash.forEach((r, i) => {
      const u = clamp01(beat(k, .16, .8) * 1.1 - i * .2);
      r.visible = pouring && u > .05;
      r.position.set(.55, 1.11, 1.15); r.scale.setScalar(.6 + u * 1.6);
      (r.material as THREE.MeshStandardMaterial).opacity = .7 * (1 - u);
    });
    // 2. the cook's arm follows the ladle; 3. the nearest diner leans in over the bowl
    arms(cook).right.rotation.x = -.5 - lift * .75;
    upper(diners[1]).rotation.x = beat(k, .55, 1) * .2;
    walk(t);
  });
}

/**
 * bunChaVn — the courtyard grill: patties and sliced pork in a split bamboo clamp over charcoal. A click lifts the clamp
 * off the coals, the fat flashes once in the fire, and the clamp settles beside the herb platter.
 */
export function bunChaGrillVn(): P {
  const g = group();
  const sh = shelter(g, "courtyard", 5.0, 3.0, 2.4, { sign: "BÚN CHẢ" });
  lamps(g, sh.y, sh.zFront, [-2.1, 2.1], .85);
  const cy = counter(g, .9, 1.1, 2.6, .7, .86, VNC.voi);
  // the charcoal trough, dug low so the arrival camera looks over its rim at the meat
  const trough = add(g, new THREE.Group(), -1.5, 0, 1.2);
  add(trough, box(1.3, .34, .6, "#7A6A58"), 0, .17, 0);
  add(trough, box(1.15, .06, .45, VNC.than), 0, .33, 0);
  const coals = Array.from({ length: 7 }, (_, i) => {
    const c = add(trough, ball(.055, "#E0522A", 6), -.45 + i * .15, .35, Math.sin(i) * .1);
    c.material = mat("#E0522A", { emissive: "#E0522A", emissiveIntensity: .8 }); return c;
  });
  const flames = Array.from({ length: 4 }, (_, i) => { const f = add(trough, cone(.07, .2, i % 2 ? "#F2A03C" : "#E9612D", 6), -.36 + i * .24, .45, 0); f.name = "bun-cha-flame"; f.scale.setScalar(.4); return f; });
  // the clamp of pork over the coals: the reacting subject
  const clamp = add(g, new THREE.Group(), -1.5, .62, 1.2); clamp.name = "bun-cha-clamp";
  for (const z of [-.14, .14]) add(clamp, cyl(.016, .016, .9, VNC.tre, 5), 0, 0, z).rotation.z = Math.PI / 2;
  add(clamp, cyl(.014, .014, .34, VNC.tre, 5), .43, 0, 0);
  for (let i = 0; i < 5; i++) add(clamp, ball(.075, VNC.thit, 6), -.3 + i * .15, 0, 0).scale.set(1, .55, 1.5);        // patties
  for (let i = 0; i < 3; i++) add(clamp, box(.13, .03, .10, "#A24A32"), -.22 + i * .2, .05, .01).rotation.y = i * .3;  // sliced belly
  const clampRest = clamp.position.clone();
  // modelled food on the counter: the herb platter, the vermicelli bowls, the dipping bowls with green papaya
  bananaLeaf(g, .2, cy + .01, 1.0, .5, .34);
  for (let i = 0; i < 7; i++) add(g, ball(.06, i % 3 ? VNC.rau : "#4F7A3A", 5), .02 + (i % 4) * .13, cy + .04, .92 + Math.floor(i / 4) * .13).scale.set(1, .5, 1.4);
  for (const [i, x] of [1.0, 1.5].entries()) { const nb = noodleBowl(g, x, cy, 1.15, .15, VNC.bun, i === 0); void nb; }
  for (const x of [1.9, 2.1]) { add(g, cyl(.09, .07, .07, VNC.sanh, 10), x, cy + .035, .95); add(g, cyl(.08, .08, .015, VNC.nuoc, 10), x, cy + .07, .95); for (let i = 0; i < 3; i++) add(g, box(.03, .01, .03, "#E7E0BC"), x + (i - 1) * .03, cy + .08, .95); }
  const fan = add(g, box(.24, .01, .2, VNC.laKho), -2.0, .95, 1.6); fan.rotation.x = .2;
  g.userData.steam = V(.2, cy + .7, 1.0); g.userData.smoke = V(-1.5, .95, 1.2);
  // people: the griller fanning the coals, a server at the counter, a family of four at the low table, a child
  const griller = add(g, resident("cook"), -1.5, 0, .35); griller.rotation.y = .1;
  const server = add(g, resident("server"), 1.6, 0, .35); server.rotation.y = -.25;
  const ty = lowTable(g, .2, 3.0, 1.9, 1.0);
  const family = [stool(g, -.6, 3.0, 1.3, "northWoman"), stool(g, 1.0, 3.0, -1.3, "north"), stool(g, .2, 3.8, Math.PI, "north"), stool(g, .9, 3.8, Math.PI, "child")];
  for (const [i, x] of [-.2, .5].entries()) noodleBowl(g, x, ty, 3.0 + (i ? .3 : -.3), .13, VNC.bun);
  const walker = add(g, resident("centre", false), 2.6, 0, 2.6);
  const walk = pacer(walker, V(2.6, 0, 2.6), V(-2.4, 0, 3.6), .3, .6);
  return life(g, "bunChaVn", [griller, family[0], server, ...family.slice(1), walker], (t, k) => {
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2.6 + i * .8) * .22 + beat(k, .05, .55) * .9; });
    flames.forEach((f, i) => { const s = .35 + Math.sin(t * 8 + i * 2) * .1 + beat(k, .05, .5) * 1.5; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    // 1. food first: the clamp lifts clear of the coals, turns over and settles beside the herbs
    const lift = beat(k, 0, .8);
    clamp.position.copy(clampRest);
    clamp.position.y = clampRest.y + lift * .5; clamp.position.x = clampRest.x + lift * .45;
    clamp.rotation.z = lift * 2.2; clamp.rotation.y = lift * .3;
    // 2. the griller's fan works harder; 3. the mother at the table looks over
    fan.rotation.z = Math.sin(t * 3) * .25 + beat(k, .2, .8) * Math.sin(t * 16) * .5;
    arms(griller).left.rotation.x = -.4 - beat(k, .35, .9) * .6;
    upper(family[0]).rotation.y = beat(k, .6, 1) * .35;
    walk(t);
  });
}

/**
 * banhCuonVn — the cloth steamer: a thin rice batter is spread on stretched cloth over a pot of boiling water and the
 * set sheet is peeled off with a bamboo wand. A click peels one translucent sheet off the cloth and lays it on the tray.
 */
export function banhCuonSteamerVn(): P {
  const g = group();
  const sh = shelter(g, "courtyard", 5.0, 3.0, 2.4, { sign: "BÁNH CUỐN" });
  lamps(g, sh.y, sh.zFront, [-2.1, 2.1], .85);
  const cy = counter(g, 1.0, 1.15, 2.4, .7, .88, VNC.voi);
  // the steaming pot with its stretched cloth: the work surface, open to the front
  const potBase = add(g, new THREE.Group(), -1.3, 0, 1.15);
  add(potBase, cyl(.42, .38, .62, "#8C9096", 16), 0, .31, 0);
  add(potBase, cyl(.44, .44, .03, VNC.go, 16), 0, .63, 0);
  const cloth = add(potBase, cyl(.40, .40, .015, "#EFE9D8", 18), 0, .66, 0);
  const batter = add(potBase, cyl(.33, .33, .012, "#F3EEE2", 18), 0, .675, 0);
  const { coals } = brazier(g, -1.3, 0, 1.15, .34);
  // the sheet that comes off the cloth
  const sheet = add(g, new THREE.Group(), -1.3, .69, 1.15); sheet.name = "banh-cuon-sheet";
  const sheetSkin = add(sheet, cyl(.30, .30, .01, "#F6F1E6", 18), 0, 0, 0);
  (sheetSkin.material as THREE.MeshStandardMaterial).transparent = true; (sheetSkin.material as THREE.MeshStandardMaterial).opacity = .82;
  add(sheet, cyl(.07, .07, .26, "#8A6A4A", 8), 0, .02, 0).rotation.z = Math.PI / 2;   // the pork and mushroom filling ready to roll
  const sheetRest = sheet.position.clone();
  const wand = add(g, cyl(.012, .012, .62, VNC.tre, 5), -.8, .95, 1.5); wand.rotation.set(.1, 0, 1.1);
  // modelled food: the finished rolls on a leaf, fried shallot, the dipping bowl, a stack of trays
  bananaLeaf(g, .8, cy + .01, 1.05, .52, .34);
  const rolls = Array.from({ length: 6 }, (_, i) => { const r = add(g, cyl(.045, .045, .26, "#F1EADA", 9), .6 + (i % 3) * .18, cy + .05, .98 + Math.floor(i / 3) * .14); r.rotation.z = Math.PI / 2; r.userData.foodReaction = i === 0 ? "hop" : undefined; return r; });
  add(g, cyl(.07, .06, .06, VNC.vang, 8), 1.6, cy + .03, .95); for (let i = 0; i < 5; i++) add(g, box(.03, .012, .03, "#C08A3A"), 1.55 + (i % 3) * .04, cy + .07, .93 + Math.floor(i / 3) * .05);
  add(g, cyl(.10, .08, .07, VNC.sanh, 10), 1.9, cy + .035, 1.1); add(g, cyl(.09, .09, .015, VNC.nuoc, 10), 1.9, cy + .07, 1.1);
  for (let i = 0; i < 3; i++) add(g, cyl(.24, .24, .02, VNC.tre, 14), 2.1, cy + .02 + i * .03, .8);
  g.userData.steam = V(-1.3, 1.05, 1.15);
  // people: the woman at the cloth, a helper rolling, four waiting on a bench, a boy with a tray
  const maker = add(g, resident("cook"), -1.3, 0, .2); maker.rotation.y = 0;
  const roller = add(g, resident("server"), .55, 0, .3); roller.rotation.y = -.2;
  const by = bench(g, .4, 3.1, 2.4, Math.PI);
  const waiting = [seatFigure(g, resident("northWoman", false), -.5, 3.0, Math.PI, by), seatFigure(g, resident("north", false), .3, 3.0, Math.PI, by), seatFigure(g, resident("centre", false), 1.1, 3.0, Math.PI, by)];
  const boy = add(g, resident("child", false), 2.3, 0, 2.3); boy.rotation.y = -1.2;
  const walker = add(g, resident("north", false), -2.6, 0, 2.6);
  const walk = pacer(walker, V(-2.6, 0, 2.6), V(2.6, 0, 3.5), .3, 1.8);
  return life(g, "banhCuonVn", [maker, waiting[0], roller, ...waiting.slice(1), boy, walker], (t, k) => {
    // always on: the batter trembles over the boiling water and the coals glow
    batter.scale.setScalar(1 + Math.sin(t * 5) * .012);
    batter.position.y = .675 + Math.sin(t * 4.2) * .004;
    cloth.position.y = .66 + Math.sin(t * 3.1) * .003;
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2 + i) * .18; });
    // 1. food first: the sheet peels off the cloth, rises on the wand and lays itself on the tray
    const peel = beat(k, 0, .78);
    sheet.position.copy(sheetRest);
    sheet.position.y = sheetRest.y + peel * .46; sheet.position.x = sheetRest.x + peel * 1.5; sheet.position.z = sheetRest.z - peel * .06;
    sheet.rotation.z = peel * .55; sheet.rotation.x = -peel * .3;
    (sheetSkin.material as THREE.MeshStandardMaterial).opacity = .82 - peel * .12;
    // 2. the wand in the maker's hand follows; 3. the first woman on the bench leans forward
    wand.rotation.z = 1.1 - peel * .7; wand.position.set(-.8 + peel * .3, .95 + peel * .2, 1.5);
    arms(maker).right.rotation.x = -.4 - peel * .8;
    upper(waiting[0]).rotation.x = beat(k, .58, 1) * .16;
    walk(t);
  });
}

/**
 * comVongVn — the green-rice courtyard: young rice roasted, then pounded in a wooden mortar and winnowed in a flat tray.
 * A click drops the pestle once and the grains jump inside the mortar.
 */
export function comCourtyardVn(): P {
  const g = group();
  const sh = shelter(g, "courtyard", 5.0, 3.0, 2.4, { sign: "CỐM" });
  lamps(g, sh.y, sh.zFront, [-2.1, 2.1], .85);
  const cy = counter(g, 1.3, 1.15, 2.2, .7, .84, VNC.voi);
  // the mortar and its pestle, out in front where nothing stands between them and the camera
  const mortar = add(g, new THREE.Group(), -1.2, 0, 1.3);
  add(mortar, cyl(.34, .30, .46, VNC.goDam, 14), 0, .23, 0);
  add(mortar, cyl(.30, .30, .05, "#3A2A1C", 14), 0, .44, 0);
  const grains = Array.from({ length: 9 }, (_, i) => add(mortar, ball(.035, VNC.com, 5), Math.cos(i * .95) * .17, .47, Math.sin(i * .95) * .17));
  grains[0].name = "com-grains";
  const pestle = add(g, new THREE.Group(), -1.2, .95, 1.3); pestle.name = "com-pestle";
  add(pestle, cyl(.05, .06, .55, VNC.go, 8), 0, .28, 0);
  add(pestle, cyl(.09, .09, .12, VNC.goDam, 10), 0, .05, 0);
  const pestleRest = pestle.position.clone();
  // the flat winnowing tray and the roasting pan: modelled material, and the always-on loop
  const tray = add(g, cyl(.46, .46, .05, VNC.tre, 18), .5, .84, 1.25);
  const trayGrain = Array.from({ length: 12 }, (_, i) => add(g, ball(.028, VNC.com, 5), .5 + Math.cos(i * .8) * .26, .88, 1.25 + Math.sin(i * .8) * .26));
  void tray;
  const pan = add(g, cyl(.30, .26, .10, "#6B6B6E", 16), 1.5, cy + .05, 1.1);
  const panGrain = Array.from({ length: 8 }, (_, i) => add(g, ball(.03, "#B9C97A", 5), 1.5 + Math.cos(i * .9) * .16, cy + .11, 1.1 + Math.sin(i * .9) * .16));
  void pan;
  // the lotus-leaf parcels of finished cốm, tied with straw
  for (let i = 0; i < 3; i++) { const p = add(g, new THREE.Group(), 2.0 + (i % 2) * .22, cy + .06, .95 + Math.floor(i / 2) * .2); add(p, ball(.12, VNC.laChuoi, 8), 0, 0, 0).scale.set(1.2, .6, 1); add(p, cyl(.012, .012, .26, VNC.la, 4), 0, .04, 0).rotation.z = Math.PI / 2; p.userData.foodReaction = i === 0 ? "sway" : undefined; }
  // people: the pounder, a woman winnowing, a girl tying parcels, three neighbours on the bench, a walker
  const pounder = add(g, resident("cook"), -1.2, 0, .45); pounder.rotation.y = 0;
  const winnower = add(g, resident("northWoman", false), .5, 0, .35); winnower.rotation.y = -.1;
  const girl = add(g, resident("child", false), 2.1, 0, .35); girl.rotation.y = -.2;
  const by = bench(g, -.2, 3.2, 2.2, Math.PI);
  const neighbours = [seatFigure(g, resident("northWoman", false), -.9, 3.1, Math.PI, by), seatFigure(g, resident("north", false), -.1, 3.1, Math.PI, by), seatFigure(g, resident("centre", false), .7, 3.1, Math.PI, by)];
  const walker = add(g, resident("north", false), 2.7, 0, 2.4);
  const walk = pacer(walker, V(2.7, 0, 2.4), V(-2.7, 0, 3.4), .3, .9);
  return life(g, "comVongVn", [pounder, neighbours[0], winnower, girl, ...neighbours.slice(1), walker], (t, k) => {
    // always on: the winnowing tray breathes and the roasting grain shifts in the pan
    trayGrain.forEach((gr, i) => { gr.position.y = .88 + Math.max(0, Math.sin(t * 2.2 + i * .7)) * .02; });
    panGrain.forEach((gr, i) => { gr.position.y = cy + .11 + Math.max(0, Math.sin(t * 3 + i)) * .015; });
    // 1. material first: the pestle falls once and the grain jumps out of the mortar's mouth
    const fall = beat(k, 0, .3), drive = hold(k, .22), jump = beat(k, .2, .85);
    pestle.position.copy(pestleRest);
    pestle.position.y = pestleRest.y - Math.max(fall, drive) * .34 + jump * .10;
    grains.forEach((gr, i) => {
      const a = i * .95;
      gr.position.set(Math.cos(a) * (.17 + jump * .06), .47 + jump * Math.abs(Math.sin(t * 11 + i)) * .28, Math.sin(a) * (.17 + jump * .06));
    });
    // 2. the pounder's arms drive it; 3. the winnower shakes her tray
    arms(pounder).right.rotation.x = -1.1 - fall * .5; arms(pounder).left.rotation.x = -1.1 - fall * .5;
    upper(winnower).rotation.x = .12 + beat(k, .35, .95) * Math.sin(t * 12) * .09;
    walk(t);
  });
}

/**
 * hueKitchenVn — the Huế veranda: the lemongrass and shrimp-paste broth is strained red-gold into the bowl and the herbs
 * are laid beside it. A click lifts the strainer clear of the pot and holds the drain over the bowl.
 */
export function bunBoHueVn(): P {
  const g = group();
  const sh = shelter(g, "hue", 5.4, 3.2, 2.6, { sign: "BÚN BÒ" });
  lamps(g, sh.y, sh.zFront, [-2.3, 2.3], .85);
  const cy = counter(g, .8, 1.2, 3.0, .74, .90, "#D8CFB8");
  // the broth pot on its ring of brick, with the always-on simmer
  add(g, cyl(.40, .44, .40, VNC.gach, 14), -1.5, .20, 1.2);
  const pot = add(g, new THREE.Group(), -1.5, .40, 1.2);
  add(pot, cyl(.36, .32, .42, "#8C9096", 16), 0, .21, 0);
  const broth = add(pot, cyl(.34, .34, .02, "#C2551F", 16), 0, .42, 0);
  const simmer = Array.from({ length: 6 }, (_, i) => add(pot, ball(.04, "#E08A3A", 5), Math.cos(i * 1.1) * .2, .42, Math.sin(i * 1.1) * .2));
  for (let i = 0; i < 4; i++) add(pot, cyl(.018, .022, .34, "#A8C46A", 5), Math.cos(i * 1.6) * .16, .48, Math.sin(i * 1.6) * .16).rotation.set(.2, i, .25);   // lemongrass standing in the broth
  // the strainer: the reacting subject, lifted out over the bowl
  const strainer = add(g, new THREE.Group(), -1.5, .86, 1.2); strainer.name = "hue-strainer";
  const mesh = add(strainer, new THREE.Mesh(new THREE.CylinderGeometry(.15, .11, .14, 12, 1, true), new THREE.MeshStandardMaterial({ color: "#B7BEC4", wireframe: true })), 0, .07, 0);
  add(strainer, cyl(.011, .011, .46, VNC.go, 5), 0, .3, -.16).rotation.x = .38;
  for (let i = 0; i < 4; i++) add(strainer, ball(.042, VNC.thit, 5), Math.cos(i * 1.6) * .07, .08, Math.sin(i * 1.6) * .07);
  const strainerRest = strainer.position.clone();
  const drip = stream(g, "hue-drain", "#C2551F", .018);
  // modelled food: the bowl, the herb plate, the pork knuckle and the chilli oil
  const { bowl, lip } = noodleBowl(g, .35, cy, 1.2, .2, "#C2551F", true); bowl.name = "hue-bowl";
  bananaLeaf(g, 1.2, cy + .01, 1.1, .52, .34);
  for (let i = 0; i < 7; i++) add(g, ball(.055, i % 2 ? VNC.rau : "#4F7A3A", 5), 1.0 + (i % 4) * .13, cy + .04, 1.02 + Math.floor(i / 4) * .14).scale.set(1, .5, 1.4);
  add(g, cyl(.15, .13, .10, VNC.sanh, 12), 1.9, cy + .05, 1.0);
  for (let i = 0; i < 3; i++) add(g, ball(.075, "#A24A32", 6), 1.9 + Math.cos(i * 2.1) * .07, cy + .11, 1.0 + Math.sin(i * 2.1) * .07).scale.set(1.1, .8, 1.1);
  add(g, cyl(.05, .045, .10, "#C9302A", 8), 2.2, cy + .05, 1.2);
  const noodleBasket = basket(g, -.4, cy, .98, .18, .16, { color: VNC.bun, n: 6, size: .05 });
  noodleBasket.userData.foodReaction = "sway";
  g.userData.steam = V(-1.5, 1.35, 1.2);
  // people: the cook, a server with a tray, four at the veranda tables, a walker on the garden path
  const cook = add(g, resident("cook"), -1.55, 0, .3); cook.rotation.y = .1;
  const server = add(g, resident("server"), 1.3, 0, .3); server.rotation.y = -.35;
  const tray = add(arms(server).left, cyl(.17, .17, .02, VNC.tre, 12), 0, arms(server).hand - .04, .12);
  const ty = lowTable(g, -.6, 3.2, 1.6, .9, .44), ty2 = lowTable(g, 1.4, 3.2, 1.6, .9, .44);
  const guests = [stool(g, -1.2, 3.2, 1.3, "centre", .3), stool(g, 0, 3.2, -1.3, "centre", .3), stool(g, .9, 3.2, 1.3, "northWoman", .3), stool(g, 2.0, 3.2, -1.3, "north", .3)];
  for (const [i, x] of [-.6, 1.4].entries()) { noodleBowl(g, x, i ? ty2 : ty, 3.2, .13, "#C2551F"); }
  const walker = add(g, resident("centre", false), 2.9, 0, 2.3);
  const walk = pacer(walker, V(2.9, 0, 2.3), V(-2.9, 0, 4.0), .32, 2.2);
  return life(g, "hueKitchenVn", [cook, guests[0], server, ...guests.slice(1), walker], (t, k) => {
    simmer.forEach((b, i) => { b.position.y = .42 + Math.max(0, Math.sin(t * 3.1 + i * 1.2)) * .03; });
    broth.position.y = .42 + Math.sin(t * 1.5) * .004;
    // 1. food first: the strainer rises out of the broth and drains into the bowl
    const lift = beat(k, 0, .74);
    strainer.position.copy(strainerRest);
    strainer.position.y = strainerRest.y + lift * .48; strainer.position.x = strainerRest.x + lift * 1.7;
    strainer.rotation.z = -lift * .35;
    const from = V().copy(strainer.position).add(V(0, .0, 0));
    const progress = 1 - k, draining = k > 0 && progress > .2 && progress < .7;
    drip.set(from, lip, draining);
    (mesh.material as THREE.MeshStandardMaterial).opacity = 1;
    // 2. the cook's arm carries it; 3. the nearest guest turns to the bowl
    arms(cook).right.rotation.x = -.5 - lift * .8;
    tray.rotation.z = Math.sin(t * .8) * .03;
    upper(guests[0]).rotation.y = beat(k, .6, 1) * .3;
    walk(t);
  });
}

/**
 * banhHueVn — the Huế cake bench: bánh bèo in their little moulds, bánh nậm and bánh lọc in banana leaf, stacked in a
 * bamboo steamer. A click lifts one filled tray out of the steamer and the steam clears off the faces behind it.
 */
export function hueCakeVn(): P {
  const g = group();
  const sh = shelter(g, "hue", 5.2, 3.0, 2.5, { sign: "BÁNH BÈO" });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .85);
  const cy = counter(g, .7, 1.15, 3.0, .72, .88, "#D8CFB8");
  // the steamer over its brazier, its lid to one side, the trays inside
  const { coals } = brazier(g, -1.5, 0, 1.15, .30);
  add(g, cyl(.36, .32, .34, "#8C9096", 14), -1.5, .17, 1.15);
  const { steamerGroup, lid } = steamer(g, -1.5, .34, 1.15, .32, 2);
  lid.position.set(-.05, .30, -.5); lid.rotation.z = .3;
  // the tray of small cakes that comes out: the reacting subject
  const tray = add(g, new THREE.Group(), -1.5, .68, 1.15); tray.name = "hue-tray";
  add(tray, cyl(.28, .28, .03, VNC.tre, 16), 0, 0, 0);
  for (let i = 0; i < 7; i++) { const dish = add(tray, cyl(.065, .05, .03, VNC.sanh, 10), Math.cos(i * .9) * .16, .03, Math.sin(i * .9) * .16); add(dish, cyl(.05, .05, .012, "#F4EFE2", 10), 0, .02, 0); add(dish, ball(.022, "#D8814A", 5), 0, .03, 0).scale.set(1.6, .5, 1.6); }
  const trayRest = tray.position.clone();
  // modelled food on the bench: bánh nậm in leaf, bánh lọc, the shrimp floss, the thin sauce
  bananaLeaf(g, .3, cy + .01, 1.05, .5, .32);
  const parcels = Array.from({ length: 4 }, (_, i) => { const p = add(g, box(.2, .04, .12, VNC.laChuoi), .1 + (i % 2) * .24, cy + .04, .96 + Math.floor(i / 2) * .16); p.rotation.y = i * .2; add(g, cyl(.01, .01, .22, VNC.la, 4), .1 + (i % 2) * .24, cy + .07, .96 + Math.floor(i / 2) * .16).rotation.z = Math.PI / 2; p.userData.foodReaction = i === 0 ? "hop" : undefined; return p; });
  void parcels;
  for (let i = 0; i < 5; i++) add(g, ball(.038, "#E8DCC2", 6), 1.1 + (i % 3) * .08, cy + .04, 1.1 + Math.floor(i / 3) * .09).scale.set(1.3, .7, 1);
  add(g, cyl(.07, .06, .05, VNC.vang, 8), 1.5, cy + .03, .98); for (let i = 0; i < 4; i++) add(g, ball(.02, "#D8814A", 5), 1.47 + (i % 2) * .05, cy + .06, .95 + Math.floor(i / 2) * .05);
  add(g, cyl(.10, .08, .07, VNC.sanh, 10), 1.85, cy + .035, 1.1); add(g, cyl(.09, .09, .015, VNC.nuoc, 10), 1.85, cy + .07, 1.1);
  for (let i = 0; i < 4; i++) add(g, cyl(.22, .22, .02, VNC.tre, 14), 2.2, cy + .02 + i * .03, .95);
  g.userData.steam = V(-1.5, 1.0, 1.15);
  // people: the woman at the steamer, a girl carrying dishes, four eating on the veranda, a walker
  const cook = add(g, resident("cook"), -1.55, 0, .3); cook.rotation.y = .05;
  const girl = add(g, resident("child", false), .9, 0, .35); girl.rotation.y = -.3;
  const gy = lowTable(g, .4, 3.1, 2.0, 1.0, .42);
  const guests = [stool(g, -.4, 3.1, 1.3, "centre", .28), stool(g, 1.2, 3.1, -1.3, "northWoman", .28), stool(g, .4, 3.9, Math.PI, "centre", .28), stool(g, 1.3, 3.9, Math.PI, "north", .28)];
  for (const x of [0, .9]) { add(g, cyl(.11, .09, .05, VNC.sanh, 10), x, gy + .03, 3.1); for (let i = 0; i < 3; i++) add(g, cyl(.05, .05, .02, "#F4EFE2", 8), x + (i - 1) * .06, gy + .07, 3.1); }
  const walker = add(g, resident("north", false), -2.7, 0, 2.5);
  const walk = pacer(walker, V(-2.7, 0, 2.5), V(2.7, 0, 3.6), .3, 1.4);
  return life(g, "banhHueVn", [cook, guests[0], girl, ...guests.slice(1), walker], (t, k) => {
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2.2 + i) * .2 + beat(k, .1, .8) * .35; });
    steamerGroup.position.y = .34 + Math.sin(t * 2.4) * .004;
    // 1. food first: the tray of cakes rises out of the steamer and comes forward onto the bench
    const lift = beat(k, 0, .76);
    tray.position.copy(trayRest);
    tray.position.y = trayRest.y + lift * .44; tray.position.x = trayRest.x + lift * 1.3; tray.position.z = trayRest.z + lift * .05;
    tray.rotation.x = -lift * .12;
    // 2. the cook's arms carry the tray; 3. the nearest guest leans over her dish
    arms(cook).right.rotation.x = -.55 - lift * .7; arms(cook).left.rotation.x = -.55 - lift * .7;
    upper(guests[0]).rotation.x = beat(k, .6, 1) * .18;
    walk(t);
  });
}

/**
 * caoLauVn — the Hội An shophouse: thick yellow cao lầu noodles are tossed once in the bowl and settle under pork,
 * herbs and squares of fried crackling. The blanching pot behind the counter is the hot source.
 */
export function caoLauShopVn(): P {
  const g = group();
  const sh = shelter(g, "hoiAn", 5.2, 3.0, 2.5, { sign: "CAO LẦU" });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .85, "#F2D08A");
  const cy = counter(g, .3, 1.15, 3.4, .74, .90, VNC.go);
  // the blanching pot on its brazier at the shaded end of the counter
  const { coals } = brazier(g, -1.7, cy, 1.1, .28);
  add(g, cyl(.30, .26, .34, "#8C9096", 14), -1.7, cy + .17, 1.1);
  const water = add(g, cyl(.27, .27, .02, "#C8D2CE", 14), -1.7, cy + .33, 1.1);
  const boil = Array.from({ length: 5 }, (_, i) => add(g, ball(.03, "#E4EAE6", 5), -1.7 + Math.cos(i * 1.3) * .15, cy + .34, 1.1 + Math.sin(i * 1.3) * .15));
  // the bowl of cao lầu: the reacting subject, out on the street side of the counter
  const noodles = add(g, new THREE.Group(), .55, cy + .19, 1.25); noodles.name = "cao-lau-noodles";
  for (let i = 0; i < 9; i++) add(noodles, cyl(.022, .022, .30, "#E3BE62", 5), Math.cos(i * .7) * .09, .02 + (i % 3) * .02, Math.sin(i * .7) * .09).rotation.set(1.42, i * .8, .15);
  for (let i = 0; i < 4; i++) add(noodles, box(.10, .022, .07, "#A8462F"), Math.cos(i * 1.6) * .10, .07, Math.sin(i * 1.6) * .10).rotation.y = i;      // char siu slices
  for (let i = 0; i < 4; i++) add(noodles, box(.06, .012, .06, "#D9A24A"), Math.cos(i * 1.5 + .7) * .12, .09, Math.sin(i * 1.5 + .7) * .12).rotation.y = i * .6;   // fried cracklings
  for (let i = 0; i < 4; i++) add(noodles, ball(.04, VNC.rau, 5), Math.cos(i * 1.7 + 1.2) * .11, .10, Math.sin(i * 1.7 + 1.2) * .11).scale.set(1, .5, 1.4);
  add(g, cyl(.20, .14, .16, VNC.sanh, 14), .55, cy + .08, 1.25);                                   // the bowl the noodles sit in
  const noodleRest = noodles.position.clone();
  const chopsticks = add(g, new THREE.Group(), .9, cy + .22, 1.25);
  for (const dx of [-.015, .015]) add(chopsticks, cyl(.008, .008, .34, VNC.go, 4), dx, 0, 0).rotation.x = 1.2;
  // the rest of the counter: noodle trays, herb plate, the crackling basket, tea glasses
  for (let i = 0; i < 3; i++) { const tr = add(g, cyl(.20, .20, .05, VNC.tre, 14), -.6 + i * .0, cy + .03 + i * .055, .98); for (let j = 0; j < 5; j++) add(g, cyl(.02, .02, .24, "#E3BE62", 4), -.68 + j * .04, cy + .07 + i * .055, .98).rotation.x = 1.5; void tr; }
  bananaLeaf(g, 1.35, cy + .01, 1.05, .48, .32);
  for (let i = 0; i < 6; i++) add(g, ball(.055, i % 2 ? VNC.rau : "#4F7A3A", 5), 1.18 + (i % 3) * .13, cy + .04, .98 + Math.floor(i / 3) * .14).scale.set(1, .5, 1.4);
  const crackBasket = basket(g, 1.85, cy, 1.15, .16, .14, { color: "#D9A24A", n: 5, size: .045 }); crackBasket.userData.foodReaction = "sway";
  for (const x of [-1.0, -.55]) { add(g, cyl(.05, .045, .12, "#CFE0DC", 8), x, cy + .06, 1.3); add(g, cyl(.045, .045, .06, "#9B6A2A", 8), x, cy + .07, 1.3); }
  g.userData.steam = V(-1.7, cy + .9, 1.1);
  // people: the cook, a boy running bowls, four at the two shophouse tables, a walker on the quay road
  const cook = add(g, resident("cook"), -.3, 0, .25); cook.rotation.y = -.05;
  const boy = add(g, resident("child", false), 1.6, 0, .3); boy.rotation.y = -.4;
  const ty = lowTable(g, -.7, 3.1, 1.7, .9, .46), ty2 = lowTable(g, 1.5, 3.1, 1.7, .9, .46);
  const guests = [stool(g, -1.4, 3.1, 1.3, "centre", .3), stool(g, 0, 3.1, -1.3, "centre", .3), stool(g, .9, 3.1, 1.3, "north", .3), stool(g, 2.1, 3.1, -1.3, "northWoman", .3)];
  for (const [i, x] of [-.7, 1.5].entries()) { const nb = noodleBowl(g, x, i ? ty2 : ty, 3.1, .13, "#E3BE62"); void nb; }
  const walker = add(g, resident("centre", false), 2.9, 0, 2.2);
  const walk = pacer(walker, V(2.9, 0, 2.2), V(-2.9, 0, 3.8), .32, 1.1);
  return life(g, "caoLauVn", [cook, guests[0], boy, ...guests.slice(1), walker], (t, k) => {
    // always on: the blanching water boils
    boil.forEach((b, i) => { b.position.y = cy + .34 + Math.max(0, Math.sin(t * 4 + i * 1.2)) * .03; });
    water.position.y = cy + .33 + Math.sin(t * 2) * .003;
    // 1. food first: the noodles lift out of the bowl, turn over once and drop back under their toppings
    const toss = beat(k, 0, .66);
    noodles.position.copy(noodleRest);
    noodles.position.y = noodleRest.y + toss * .40;
    noodles.rotation.y = toss * 1.5; noodles.rotation.z = Math.sin(toss * Math.PI) * .22;
    // 2. the cook's chopsticks follow the toss; 3. the guest opposite turns to watch
    chopsticks.position.set(.9 - toss * .25, cy + .22 + toss * .34, 1.25);
    chopsticks.rotation.z = toss * .7;
    arms(cook).right.rotation.x = -.45 - toss * .8;
    upper(guests[0]).rotation.y = beat(k, .6, 1) * .34;
    walk(t);
  });
}

/**
 * miQuangVn — the Quảng Nam counter: turmeric noodles wait under their toppings and take exactly one shallow ladle of
 * broth, so the peanuts and the grilled rice cracker stay above the line. A click tips the ladle and the broth falls in.
 */
export function miQuangShopVn(): P {
  const g = group();
  const sh = shelter(g, "hoiAn", 5.0, 3.0, 2.5, { sign: "MÌ QUẢNG" });
  lamps(g, sh.y, sh.zFront, [-2.1, 2.1], .85, "#F2D08A");
  const cy = counter(g, 0, 1.15, 3.2, .74, .90, VNC.go);
  // the broth pot, kept to one side, with the always-on simmer
  const { coals } = brazier(g, -1.6, cy, 1.05, .26);
  add(g, cyl(.28, .25, .30, "#8C9096", 14), -1.6, cy + .15, 1.05);
  const simmer = Array.from({ length: 5 }, (_, i) => add(g, ball(.03, "#E0A05A", 5), -1.6 + Math.cos(i * 1.3) * .14, cy + .31, 1.05 + Math.sin(i * 1.3) * .14));
  // the bowl: turmeric noodles, prawn, pork, quail egg, peanuts and the broken cracker
  const bowlGroup = add(g, new THREE.Group(), .5, cy, 1.25); bowlGroup.name = "mi-quang-bowl";
  add(bowlGroup, cyl(.22, .15, .17, VNC.sanh, 14), 0, .085, 0);
  const toppings = add(bowlGroup, new THREE.Group(), 0, .17, 0);
  for (let i = 0; i < 8; i++) add(toppings, cyl(.02, .02, .26, "#E2B24A", 4), Math.cos(i * .8) * .09, .01, Math.sin(i * .8) * .09).rotation.set(1.44, i * .7, .1);
  for (let i = 0; i < 2; i++) add(toppings, ball(.045, "#E07A4A", 6), Math.cos(i * 3) * .08, .05, Math.sin(i * 3) * .08).scale.set(1.5, .7, .8);        // prawns
  add(toppings, ball(.035, "#F3EEDC", 6), .02, .06, -.06).scale.set(1, .85, 1);                                                                        // quail egg
  for (let i = 0; i < 6; i++) add(toppings, ball(.018, "#C9954A", 5), Math.cos(i * 1.1 + .4) * .10, .07, Math.sin(i * 1.1 + .4) * .10);                 // roasted peanuts
  const cracker = add(toppings, box(.14, .012, .10, "#E9DCB2"), -.06, .08, .08); cracker.rotation.set(.2, .5, .35); cracker.userData.foodReaction = "sway";
  for (let i = 0; i < 3; i++) add(toppings, ball(.035, VNC.rau, 5), Math.cos(i * 2.1 + 1) * .11, .07, Math.sin(i * 2.1 + 1) * .11).scale.set(1, .5, 1.4);
  const lipPoint = V(.5, cy + .18, 1.25);
  // the ladle: the reacting subject
  const ladle = add(g, new THREE.Group(), -.55, cy + .30, 1.2); ladle.name = "mi-quang-ladle";
  add(ladle, cyl(.075, .06, .06, "#8C9096", 10), 0, 0, 0);
  add(ladle, cyl(.075, .075, .015, "#E0A05A", 10), 0, .02, 0);
  add(ladle, cyl(.011, .011, .40, VNC.go, 5), 0, .19, -.08).rotation.x = .3;
  const ladleRest = ladle.position.clone(), lipLocal = V(0, -.01, .07), spout = V();
  const broth = stream(g, "mi-quang-stream", "#E0A05A", .022);
  // the counter's other food: the noodle trays, the herb plate, the peanut crock, the cracker rack
  for (let i = 0; i < 2; i++) { add(g, cyl(.22, .22, .05, VNC.tre, 14), 1.25, cy + .03 + i * .06, 1.0); for (let j = 0; j < 6; j++) add(g, cyl(.02, .02, .26, "#E2B24A", 4), 1.14 + (j % 3) * .07, cy + .07 + i * .06, .95 + Math.floor(j / 3) * .08).rotation.x = 1.5; }
  bananaLeaf(g, 1.9, cy + .01, 1.1, .44, .30);
  for (let i = 0; i < 5; i++) add(g, ball(.05, i % 2 ? VNC.rau : "#4F7A3A", 5), 1.78 + (i % 3) * .12, cy + .04, 1.04 + Math.floor(i / 3) * .12).scale.set(1, .5, 1.4);
  add(g, cyl(.09, .075, .12, VNC.vang, 10), -1.05, cy + .06, 1.3); for (let i = 0; i < 5; i++) add(g, ball(.02, "#C9954A", 5), -1.05 + Math.cos(i * 1.3) * .05, cy + .13, 1.3 + Math.sin(i * 1.3) * .05);
  for (let i = 0; i < 4; i++) { const c = add(g, cyl(.13, .13, .012, "#E9DCB2", 14), 2.0 + (i % 2) * .05, cy + .04 + i * .02, 1.35); c.rotation.x = .1; }
  g.userData.steam = V(-1.6, cy + .8, 1.05);
  // people: the cook at the ladle, a woman with the herb tray, four on the bench, a walker
  const cook = add(g, resident("cook"), -.6, 0, .3); cook.rotation.y = -.1;
  const herbWoman = add(g, resident("northWoman"), 1.7, 0, .3); herbWoman.rotation.y = -.3;
  const by = bench(g, .2, 3.1, 2.6, Math.PI, .36);
  const guests = [seatFigure(g, resident("centre", false), -.9, 3.0, Math.PI, by), seatFigure(g, resident("north", false), -.1, 3.0, Math.PI, by), seatFigure(g, resident("centre", false), .7, 3.0, Math.PI, by), seatFigure(g, resident("northWoman", false), 1.4, 3.0, Math.PI, by)];
  for (const x of [-.5, 1.0]) noodleBowl(g, x, lowTable(g, x, 2.5, .9, .7, .42), 2.5, .12, "#E0A05A");
  const walker = add(g, resident("south", false), -2.8, 0, 2.3);
  const walk = pacer(walker, V(-2.8, 0, 2.3), V(2.8, 0, 3.7), .32, .4);
  return life(g, "miQuangVn", [cook, guests[0], herbWoman, ...guests.slice(1), walker], (t, k) => {
    simmer.forEach((b, i) => { b.position.y = cy + .31 + Math.max(0, Math.sin(t * 3.6 + i)) * .025; });
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2.3 + i) * .18; });
    // 1. food first: the ladle carries one shallow measure to the bowl and tips it in
    const carry = beat(k, 0, .76);
    ladle.position.copy(ladleRest);
    ladle.position.x = ladleRest.x + carry * .95; ladle.position.y = ladleRest.y + carry * .30;
    ladle.rotation.z = -carry * .9;
    tipOf(ladle, lipLocal, spout);
    const progress = 1 - k, pouring = k > 0 && progress > .22 && progress < .62;
    broth.set(spout, lipPoint, pouring);
    toppings.position.y = .17 + (pouring ? .012 : 0);                    // the toppings float a little as the broth arrives
    // 2. the cook's arm follows the ladle; 3. the first guest leans in
    arms(cook).right.rotation.x = -.5 - carry * .7;
    upper(guests[0]).rotation.x = beat(k, .58, 1) * .17;
    walk(t);
  });
}

/**
 * banhMi — the bread and pâté counter of Chợ Lớn, in period: a warm loaf is split and pâté is spread. No modern loaded
 * sandwich is built here (docs/vietnam-world.md, Stage A decisions); the brazier under the loaf basket is the hot source.
 */
export function breadPateCartVn(): P {
  const g = group();
  const sh = shelter(g, "cholon", 5.2, 3.0, 2.6, { sign: "BÁNH MÌ" });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .85);
  // the cart standing in the bay, with its glass case and its two wheels on the paving
  const cart = add(g, new THREE.Group(), .2, 0, 1.2);
  add(cart, box(2.0, .80, .80, "#8C9096"), 0, .48, 0);
  for (const x of [-.7, .7]) add(cart, cyl(.20, .20, .07, VNC.than, 12), x, .20, .42).rotation.x = Math.PI / 2;
  add(cart, box(2.0, .04, .84, VNC.go), 0, .90, 0);
  const caseGlass = add(cart, new THREE.Mesh(new THREE.BoxGeometry(1.5, .46, .72), mat("#CFE3EA", { transparent: true, opacity: .28 })), -.1, 1.15, 0);
  add(cart, box(1.56, .04, .78, "#8C9096"), -.1, 1.39, 0);
  void caseGlass;
  const cy = .92;
  // the loaves in the case and in the basket over the brazier: modelled food and the always-on warmth
  const caseLoaves = Array.from({ length: 6 }, (_, i) => { const b = add(cart, cyl(.055, .055, .34, VNC.banhMi, 8), -.62 + (i % 3) * .28, 1.02 + Math.floor(i / 3) * .13, -.16 + Math.floor(i / 3) * .28); b.rotation.set(0, .2, Math.PI / 2); return b; });
  const { coals } = brazier(g, 1.9, 0, 1.25, .24);
  const loafBasket = basket(g, 1.9, .34, 1.25, .26, .2);
  const warmLoaves = Array.from({ length: 4 }, (_, i) => { const b = add(g, cyl(.05, .05, .30, VNC.banhMi, 8), 1.78 + (i % 2) * .16, .48 + Math.floor(i / 2) * .09, 1.18 + Math.floor(i / 2) * .12); b.rotation.set(0, i * .4, Math.PI / 2); b.userData.foodReaction = i === 0 ? "sway" : undefined; return b; });
  void loafBasket;
  // the loaf on the board: the reacting subject, split into two halves that open
  const loaf = add(g, new THREE.Group(), -.55, cy + .06, 1.55); loaf.name = "banh-mi-loaf";
  add(g, box(.48, .035, .26, VNC.go), -.55, cy + .02, 1.55);                                  // the board it rests on
  const lower = add(loaf, cyl(.055, .055, .36, VNC.banhMi, 9), 0, 0, 0); lower.rotation.z = Math.PI / 2; lower.scale.y = 1;
  const crumb = add(loaf, box(.33, .012, .07, "#F3E8CE"), 0, .045, 0);
  const upperHalf = add(loaf, new THREE.Group(), 0, .05, 0);
  add(upperHalf, cyl(.055, .055, .36, VNC.banhMi, 9, ), 0, .0, 0).rotation.z = Math.PI / 2;
  (upperHalf.children[0] as THREE.Mesh).scale.y = 1;
  const pateSpread = add(loaf, box(.30, .014, .06, VNC.pate), 0, .052, 0); pateSpread.visible = false;
  const loafRest = loaf.position.clone();
  // the pâté crock, the knife, the pickle jar and the pepper dish
  const crock = add(g, new THREE.Group(), -1.35, cy + .04, 1.35);
  add(crock, cyl(.11, .10, .14, "#C9B27A", 12), 0, .07, 0); add(crock, cyl(.10, .10, .03, VNC.pate, 12), 0, .145, 0);
  const knife = add(g, new THREE.Group(), -.95, cy + .10, 1.5);
  add(knife, box(.26, .012, .035, "#C9CFD6"), 0, 0, 0); add(knife, box(.09, .026, .035, VNC.goDam), -.17, 0, 0);
  const knifeRest = knife.position.clone();
  add(g, cyl(.10, .09, .18, "#CFE3EA", 10), -1.7, cy + .09, 1.15); for (let i = 0; i < 4; i++) add(g, box(.05, .012, .05, "#E08A3A"), -1.7 + (i % 2) * .05, cy + .06 + i * .02, 1.15);
  add(g, cyl(.06, .05, .07, VNC.vang, 8), 1.2, cy + .04, 1.5); for (let i = 0; i < 3; i++) add(g, ball(.022, "#C9302A", 5), 1.16 + i * .05, cy + .08, 1.5);
  g.userData.steam = V(1.9, 1.0, 1.25);
  // people: the seller at the board, the baker bringing a basket, three customers at the ends, a child, a walker
  const seller = add(g, resident("server"), -.8, 0, .35); seller.rotation.y = -.15;
  const baker = add(g, resident("cook"), 1.95, 0, .35); baker.rotation.y = -.5;
  const customers = [add(g, resident("south", false), -2.0, 0, 2.5), add(g, resident("southWoman", false), 2.0, 0, 2.5)];
  customers[0].rotation.y = Math.PI - .4; customers[1].rotation.y = Math.PI + .4;
  const child = add(g, resident("child", false), -1.5, 0, 3.1); child.rotation.y = Math.PI - .2;
  const sitter = stool(g, 2.4, 3.2, -1.2, "south", .3);
  const walker = add(g, resident("southWoman", false), -2.7, 0, 3.5);
  const walk = pacer(walker, V(-2.7, 0, 3.5), V(2.7, 0, 4.2), .34, 1.6);
  return life(g, "banhMi", [seller, customers[0], baker, customers[1], child, sitter, walker], (t, k) => {
    caseLoaves.forEach((b, i) => { b.position.y = (1.02 + Math.floor(i / 3) * .13) + Math.sin(t * .8 + i) * .002; });
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .45 + Math.sin(t * 2 + i) * .15 + beat(k, .1, .8) * .3; });
    // 1. food first: the loaf opens along its cut and the pâté appears inside it
    const split = beat(k, 0, .7);
    loaf.position.copy(loafRest);
    loaf.position.y = loafRest.y + split * .07;
    upperHalf.rotation.z = split * 1.25; upperHalf.position.y = .05 + split * .035;
    crumb.scale.z = 1 + split * .5;
    pateSpread.visible = split > .35;
    pateSpread.scale.x = clamp01((split - .35) / .45);
    // 2. the seller's knife follows the cut and then spreads; 3. the nearest customer steps in
    knife.position.set(knifeRest.x + split * .3, knifeRest.y + split * .06, knifeRest.z - split * .04);
    knife.rotation.z = split * .35; knife.rotation.y = beat(k, .45, .95) * .5;
    arms(seller).right.rotation.x = -.6 - split * .5;
    upper(customers[0]).rotation.y = beat(k, .6, 1) * .3;
    crock.rotation.y = Math.sin(t * .5) * .05;
    walk(t);
  });
}

/**
 * huTieuVn — the Chợ Lớn noodle shophouse: the wire basket goes into the boiling stock, is shaken dry once and turns its
 * noodles into the bowl. The stock pot never stops moving.
 */
export function huTieuShopVn(): P {
  const g = group();
  const sh = shelter(g, "cholon", 5.2, 3.2, 2.6, { sign: "HỦ TIẾU" });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .85);
  const cy = counter(g, .4, 1.2, 3.2, .74, .92, VNC.gach);
  // the stock pot: a tall pot on a brick ring, boiling all day
  add(g, cyl(.42, .46, .38, VNC.gach, 14), -1.6, .19, 1.15);
  const pot = add(g, new THREE.Group(), -1.6, .38, 1.15);
  add(pot, cyl(.38, .34, .46, "#8C9096", 16), 0, .23, 0);
  const stock = add(pot, cyl(.36, .36, .02, "#D8C08A", 16), 0, .46, 0);
  const boil = Array.from({ length: 7 }, (_, i) => add(pot, ball(.035, "#EDE0BC", 5), Math.cos(i * .95) * .2, .46, Math.sin(i * .95) * .2));
  // the wire basket: the reacting subject
  const wire = add(g, new THREE.Group(), -1.6, .92, 1.15); wire.name = "hu-tieu-basket";
  add(wire, new THREE.Mesh(new THREE.CylinderGeometry(.13, .10, .16, 12, 1, true), new THREE.MeshStandardMaterial({ color: "#B7BEC4", wireframe: true })), 0, .08, 0);
  add(wire, cyl(.011, .011, .44, VNC.go, 5), 0, .30, -.15).rotation.x = .36;
  const inBasket = Array.from({ length: 6 }, (_, i) => add(wire, cyl(.014, .014, .17, VNC.bun, 4), Math.cos(i * 1.05) * .06, .08, Math.sin(i * 1.05) * .06).rotation.set(1.3, i, .2) as unknown as THREE.Mesh);
  const wireRest = wire.position.clone();
  // the bowl it empties into, and the rest of the counter
  const { bowl, lip } = noodleBowl(g, .1, cy, 1.25, .19, "#D8C08A", true); bowl.name = "hu-tieu-bowl";
  void lip;
  for (let i = 0; i < 2; i++) { add(g, cyl(.21, .21, .05, VNC.tre, 14), 1.1, cy + .03 + i * .06, 1.0); for (let j = 0; j < 6; j++) add(g, cyl(.016, .016, .24, VNC.bun, 4), 1.0 + (j % 3) * .07, cy + .07 + i * .06, .94 + Math.floor(j / 3) * .08).rotation.x = 1.5; }
  bananaLeaf(g, 1.75, cy + .01, 1.1, .44, .3);
  for (let i = 0; i < 5; i++) add(g, ball(.05, i % 2 ? VNC.rau : "#7FBF5A", 5), 1.62 + (i % 3) * .12, cy + .04, 1.04 + Math.floor(i / 3) * .12).scale.set(1, .5, 1.4);
  for (let i = 0; i < 4; i++) add(g, ball(.04, "#E07A4A", 6), 1.2 + (i % 2) * .09, cy + .04, 1.35 + Math.floor(i / 2) * .1).scale.set(1.4, .7, .8);      // prawns on a dish
  add(g, cyl(.20, .18, .02, VNC.sanh, 14), 1.24, cy + .02, 1.4);
  const garlicCrock = add(g, cyl(.07, .06, .08, VNC.vang, 8), 2.1, cy + .04, 1.2); garlicCrock.userData.foodReaction = "hop";
  for (const x of [-.55, -.3]) { add(g, cyl(.05, .045, .11, "#CFE3EA", 8), x, cy + .055, 1.45); add(g, cyl(.045, .045, .05, "#9B6A2A", 8), x, cy + .065, 1.45); }
  g.userData.steam = V(-1.6, 1.4, 1.15);
  // people: the noodle man, a server, four at the two tables, a walker on the street
  const noodleMan = add(g, resident("cook"), -1.65, 0, .35); noodleMan.rotation.y = .1;
  const server = add(g, resident("server"), 1.3, 0, .35); server.rotation.y = -.35;
  const ty = lowTable(g, -.8, 3.3, 1.7, .9, .46), ty2 = lowTable(g, 1.4, 3.3, 1.7, .9, .46);
  const guests = [stool(g, -1.5, 3.3, 1.3, "south", .3), stool(g, -.1, 3.3, -1.3, "southWoman", .3), stool(g, .8, 3.3, 1.3, "south", .3), stool(g, 2.0, 3.3, -1.3, "north", .3)];
  for (const [i, x] of [-.8, 1.4].entries()) noodleBowl(g, x, i ? ty2 : ty, 3.3, .13, "#D8C08A");
  const walker = add(g, resident("south", false), 2.9, 0, 2.4);
  const walk = pacer(walker, V(2.9, 0, 2.4), V(-2.9, 0, 4.1), .34, 2.4);
  return life(g, "huTieuVn", [noodleMan, guests[0], server, ...guests.slice(1), walker], (t, k) => {
    boil.forEach((b, i) => { b.position.y = .46 + Math.max(0, Math.sin(t * 4.2 + i * 1.1)) * .035; });
    stock.position.y = .46 + Math.sin(t * 1.8) * .004;
    // 1. food first: the basket dips into the stock, is shaken dry and turns the noodles into the bowl
    const dip = beat(k, 0, .34), carry = beat(k, .30, .84);
    wire.position.copy(wireRest);
    wire.position.y = wireRest.y - dip * .30 + carry * .22;
    wire.position.x = wireRest.x + carry * 1.7;
    wire.rotation.z = -carry * 1.5;
    wire.rotation.y = Math.sin((1 - k) * 34) * .12 * beat(k, .26, .40);       // the single shake that drains it
    inBasket.forEach((n, i) => { (n as unknown as THREE.Object3D).visible = carry < .55 || i > 2; });
    // 2. the noodle man's arm carries the basket; 3. the first guest looks up
    arms(noodleMan).right.rotation.x = -.5 - Math.max(dip, carry) * .7;
    upper(guests[0]).rotation.x = beat(k, .6, 1) * .16;
    walk(t);
  });
}

/**
 * banhXeoVn — the delta pan: rice batter with coconut milk goes into a hot pan and hisses, the edge crisps and lifts, and
 * the folded crêpe waits on its leaf. The fire under the pan is the hot source.
 */
export function banhXeoHearthVn(): P {
  const g = group();
  const sh = shelter(g, "stilt", 5.0, 3.0, 2.4, { sign: "BÁNH XÈO" });
  lamps(g, sh.y, sh.zFront, [-2.1, 2.1], .8, "#F2C46A");
  const cy = counter(g, 1.3, 1.15, 2.2, .7, .82, VNC.go);
  // the three-stone hearth and the wide pan, out at the front of the bay
  const hearth = add(g, new THREE.Group(), -1.3, 0, 1.25);
  for (let i = 0; i < 3; i++) add(hearth, box(.22, .30, .22, "#8A7A66"), Math.cos(i * 2.1) * .30, .15, Math.sin(i * 2.1) * .30);
  for (let i = 0; i < 5; i++) add(hearth, cyl(.035, .04, .56, "#5C3E2A", 5), Math.cos(i * 1.25) * .16, .12, Math.sin(i * 1.25) * .16).rotation.set(1.35, i * 1.25, 0);
  const flames = Array.from({ length: 4 }, (_, i) => { const f = add(hearth, cone(.08, .26, i % 2 ? "#F2A03C" : "#E9612D", 6), Math.cos(i * 1.6) * .13, .26, Math.sin(i * 1.6) * .13); f.name = "banh-xeo-flame"; return f; });
  const pan = add(g, cyl(.46, .40, .06, "#4A4A4E", 20), -1.3, .48, 1.25);
  add(g, cyl(.02, .02, .5, VNC.go, 5), -.95, .52, 1.55).rotation.set(0, .6, 1.3);          // the pan's handle
  void pan;
  // the crêpe in the pan: the reacting subject
  const crepe = add(g, new THREE.Group(), -1.3, .52, 1.25); crepe.name = "banh-xeo-crepe";
  const disc = add(crepe, cyl(.38, .38, .022, "#E8C84A", 22), 0, 0, 0);
  const rim = add(crepe, ring(.37, .022, "#D9A63A"), 0, .008, 0); rim.rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) add(crepe, ball(.045, "#E07A4A", 6), Math.cos(i * 1.6) * .17, .03, Math.sin(i * 1.6) * .17).scale.set(1.5, .6, .8);          // prawns
  for (let i = 0; i < 3; i++) add(crepe, box(.09, .022, .06, VNC.thit), Math.cos(i * 2.1 + .5) * .16, .03, Math.sin(i * 2.1 + .5) * .16).rotation.y = i;   // pork
  for (let i = 0; i < 5; i++) add(crepe, cyl(.012, .012, .12, "#F1EADA", 4), Math.cos(i * 1.3 + 1) * .2, .03, Math.sin(i * 1.3 + 1) * .2).rotation.set(0, i, 1.5);   // bean sprouts
  const crepeRest = crepe.position.clone();
  const batterJug = add(g, new THREE.Group(), -.7, cy - .02, 1.4);
  add(batterJug, cyl(.10, .12, .20, "#C9B27A", 12), 0, .10, 0); add(batterJug, cyl(.09, .09, .02, "#F2E9C6", 12), 0, .20, 0); add(batterJug, cone(.035, .09, "#C9B27A", 6), -.11, .18, 0).rotation.z = 1.2;
  // the leaf platter with the folded crêpes, the herb pile and the dipping bowl
  bananaLeaf(g, 1.0, cy + .01, 1.05, .56, .36);
  const folded = Array.from({ length: 3 }, (_, i) => { const f = add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .02, 16, 1, false, 0, Math.PI), mat("#E8C84A")), .82 + i * .2, cy + .04 + i * .01, 1.0 + (i % 2) * .12); f.rotation.set(0, i * .6, 0); f.userData.foodReaction = i === 0 ? "lift" : undefined; return f; });
  void folded;
  for (let i = 0; i < 8; i++) add(g, ball(.06, i % 3 ? VNC.rau : "#4F7A3A", 5), 1.7 + (i % 4) * .13, cy + .05, .96 + Math.floor(i / 4) * .15).scale.set(1, .5, 1.5);
  add(g, cyl(.10, .08, .07, VNC.sanh, 10), 2.1, cy + .035, 1.3); add(g, cyl(.09, .09, .015, VNC.nuoc, 10), 2.1, cy + .07, 1.3);
  g.userData.steam = V(-1.3, 1.05, 1.25); g.userData.smoke = V(-1.3, .85, 1.25);
  // people: the cook at the pan, a girl with the batter, four of the family on a mat bench, a walker on the lane
  const cook = add(g, resident("cook"), -1.35, 0, .3); cook.rotation.y = .05;
  const girl = add(g, resident("child", false), -.5, 0, .35); girl.rotation.y = -.3;
  const by = bench(g, -.2, 3.9, 2.4, Math.PI, .32);
  const family = [seatFigure(g, resident("southWoman", false), -1.1, 3.8, Math.PI, by), seatFigure(g, resident("south", false), -.4, 3.8, Math.PI, by), seatFigure(g, resident("south", false), .3, 3.8, Math.PI, by), seatFigure(g, resident("child", false), .9, 3.8, Math.PI, by)];
  for (const x of [-.7, .4]) { const mt = lowTable(g, x, 3.3, .8, .6, .4); add(g, cyl(.12, .10, .05, VNC.sanh, 10), x, mt + .03, 3.3); }
  const walker = add(g, resident("south", false), 2.8, 0, 2.6);
  const walk = pacer(walker, V(2.8, 0, 2.6), V(-2.6, 0, 3.8), .3, .7);
  return life(g, "banhXeoVn", [cook, family[0], girl, ...family.slice(1), walker], (t, k) => {
    // always on: the fire breathes under the pan and the batter's edge shivers
    flames.forEach((f, i) => { const s = .7 + Math.sin(t * 9 + i * 2) * .18 + beat(k, 0, .8) * 1.3; f.scale.set(s, s, s); f.rotation.y = t * 2 + i; });
    rim.scale.setScalar(1 + Math.sin(t * 6) * .008);
    // 1. food first: the batter swirls round the pan, then the crisp edge lifts and the crêpe folds
    const swirl = beat(k, 0, .42), liftEdge = beat(k, .38, .9);
    crepe.position.copy(crepeRest);
    crepe.rotation.y = swirl * 2.4;
    crepe.position.y = crepeRest.y + liftEdge * .10;
    crepe.rotation.z = liftEdge * .5;
    disc.scale.set(1 - swirl * .12 + liftEdge * .04, 1, 1 - swirl * .12 + liftEdge * .04);
    // 2. the jug pours as the batter goes round; 3. the girl behind it leans away from the spit
    batterJug.rotation.z = swirl * 1.1; batterJug.position.y = cy - .02 + swirl * .16;
    arms(cook).right.rotation.x = -.5 - Math.max(swirl, liftEdge) * .7;
    upper(family[0]).rotation.x = -beat(k, .1, .5) * .1 + beat(k, .6, 1) * .18;
    walk(t);
  });
}

/**
 * mekongKitchenVn — the delta family hearth: fish in a clay pot with caramel, a sour soup beside it and the rice pot at
 * the back. A click brushes the reduced caramel over the fish and the pot answers with a bubble at its rim.
 */
export function mekongHomeVn(): P {
  const g = group();
  const sh = shelter(g, "stilt", 5.2, 3.2, 2.4, { sign: "CƠM" });
  lamps(g, sh.y, sh.zFront, [-2.2, 2.2], .8, "#F2C46A");
  const cy = counter(g, 1.5, 1.2, 2.0, .7, .80, VNC.go);
  // the hearth: three fires on a raised clay bed, the clay pot at the front
  const bed = add(g, box(2.2, .34, 1.0, "#9B7A5A"), -1.0, .17, 1.2);
  void bed;
  const fires = [-1.65, -1.0, -.35].map((x, i) => {
    const f = add(g, new THREE.Group(), x, .34, 1.2);
    for (let j = 0; j < 3; j++) add(f, box(.13, .18, .13, "#8A7A66"), Math.cos(j * 2.1) * .18, .09, Math.sin(j * 2.1) * .18);
    const fl = Array.from({ length: 3 }, (_, m) => add(f, cone(.055, .18, m % 2 ? "#F2A03C" : "#E9612D", 6), Math.cos(m * 2.1) * .07, .16, Math.sin(m * 2.1) * .07));
    return { group: f, flames: fl, i };
  });
  // the clay pot of fish: the reacting subject
  const claypot = add(g, new THREE.Group(), -1.65, .52, 1.2); claypot.name = "mekong-claypot";
  add(claypot, cyl(.21, .17, .20, "#8A4A2A", 14), 0, .10, 0);
  add(claypot, ring(.21, .02, "#7A3A1A"), 0, .20, 0).rotation.x = Math.PI / 2;
  const sauce = add(claypot, cyl(.19, .19, .02, "#6B3A1A", 14), 0, .19, 0);
  const fishSteaks = Array.from({ length: 3 }, (_, i) => add(claypot, cyl(.075, .075, .07, "#D8C2A2", 10), Math.cos(i * 2.1) * .08, .21, Math.sin(i * 2.1) * .08));
  const potBubbles = Array.from({ length: 5 }, (_, i) => add(claypot, ball(.028, "#8A4A2A", 5), Math.cos(i * 1.3) * .14, .20, Math.sin(i * 1.3) * .14));
  const lid = add(g, cyl(.20, .20, .04, "#8A4A2A", 14), -1.25, .38, 1.65); lid.rotation.z = .5;
  // the brush of caramel, held over the pot
  const brush = add(g, new THREE.Group(), -1.3, .95, 1.4); brush.name = "mekong-brush";
  add(brush, cyl(.011, .011, .26, VNC.tre, 5), 0, .13, 0); add(brush, box(.05, .06, .03, "#6B3A1A"), 0, -.01, 0);
  const brushRest = brush.position.clone();
  // the sour soup and the rice pot, then the family's food on the counter
  const soup = add(g, new THREE.Group(), -1.0, .52, 1.2);
  add(soup, cyl(.24, .20, .22, "#8C9096", 14), 0, .11, 0);
  const soupTop = add(soup, cyl(.22, .22, .02, "#C98A4A", 14), 0, .22, 0);
  for (let i = 0; i < 4; i++) add(soup, box(.07, .02, .05, "#9BB05A"), Math.cos(i * 1.6) * .11, .23, Math.sin(i * 1.6) * .11).rotation.y = i;   // taro stem and tomato
  const rice = add(g, new THREE.Group(), -.35, .52, 1.2);
  add(rice, cyl(.20, .17, .24, VNC.than, 14), 0, .12, 0); add(rice, cyl(.20, .20, .03, VNC.go, 14), 0, .25, 0);
  bananaLeaf(g, 1.2, cy + .01, 1.1, .5, .32);
  for (let i = 0; i < 6; i++) add(g, ball(.055, i % 2 ? VNC.rau : "#4F7A3A", 5), 1.02 + (i % 3) * .13, cy + .04, 1.04 + Math.floor(i / 3) * .13).scale.set(1, .5, 1.4);
  const riceBowls = [1.7, 1.95, 2.2].map((x, i) => { const b = add(g, new THREE.Group(), x, cy + .02, 1.25 - (i % 2) * .16); add(b, cyl(.10, .08, .08, VNC.sanh, 10), 0, .04, 0); const heap = add(b, ball(.085, "#F7F2E6", 7), 0, .085, 0); heap.scale.y = .55; heap.userData.foodReaction = i === 0 ? "hop" : undefined; return b; });
  void riceBowls;
  add(g, cyl(.05, .04, .10, VNC.nuocMam, 8), 1.45, cy + .05, 1.42); add(g, cyl(.045, .045, .01, VNC.nuocMam, 8), 1.45, cy + .10, 1.42);
  g.userData.steam = V(-1.0, 1.0, 1.2); g.userData.smoke = V(-1.0, .8, 1.2);
  // people: the mother at the pots, the grandmother on the step, four of the family at the mat, a walker on the lane
  const mother = add(g, resident("cook"), -1.55, 0, .35); mother.rotation.y = .1;
  const grandmother = stool(g, .6, .45, Math.PI - .5, "northWoman", .3);
  const by = bench(g, .3, 3.2, 2.2, Math.PI, .3);
  const family = [seatFigure(g, resident("southWoman", false), -.5, 3.1, Math.PI, by), seatFigure(g, resident("south", false), .2, 3.1, Math.PI, by), seatFigure(g, resident("child", false), .9, 3.1, Math.PI, by)];
  const father = add(g, resident("south", false), 2.2, 0, 2.6); father.rotation.y = Math.PI + .5;
  for (const x of [-.2, .7]) { const mt = lowTable(g, x, 2.6, .8, .6, .4); add(g, cyl(.11, .09, .05, VNC.sanh, 10), x, mt + .03, 2.6); }
  const walker = add(g, resident("southWoman", false), -2.8, 0, 3.4);
  const walk = pacer(walker, V(-2.8, 0, 3.4), V(2.8, 0, 4.2), .3, 1.9);
  return life(g, "mekongKitchenVn", [mother, family[0], grandmother, ...family.slice(1), father, walker], (t, k) => {
    // always on: three fires breathe, the soup turns over and the clay pot ticks at its rim
    fires.forEach(({ flames: fl, i }) => fl.forEach((f, m) => { const s = .8 + Math.sin(t * 8 + i * 2 + m) * .2 + beat(k, .05, .7) * (i === 0 ? .9 : .3); f.scale.set(s, s, s); }));
    soupTop.position.y = .22 + Math.sin(t * 2.2) * .005;
    potBubbles.forEach((b, i) => { b.position.y = .20 + Math.max(0, Math.sin(t * 3.2 + i * 1.1)) * .02 + beat(k, .25, .85) * Math.abs(Math.sin(t * 9 + i)) * .09; });
    // 1. food first: the brush sweeps the caramel across the fish and the sauce darkens and rises
    const stroke = beat(k, 0, .6);
    brush.position.copy(brushRest);
    brush.position.x = brushRest.x - stroke * .30; brush.position.y = brushRest.y - stroke * .28; brush.position.z = brushRest.z - stroke * .16;
    brush.rotation.z = -.2 - stroke * .6; brush.rotation.x = Math.sin((1 - k) * 22) * .18 * beat(k, .1, .55);
    sauce.position.y = .19 + beat(k, .2, .8) * .022;
    fishSteaks.forEach((f, i) => { f.position.y = .21 + beat(k, .3, .9) * Math.abs(Math.sin(t * 6 + i)) * .03; });
    // 2. the mother's arm drives the brush; 3. the grandmother turns to the pot
    arms(mother).right.rotation.x = -.6 - stroke * .5;
    upper(grandmother).rotation.y = -beat(k, .6, 1) * .4;
    walk(t);
  });
}

// ---------- the nine ingredient and flavour stops ----------

/**
 * riceSea — the threshing yard: a winnowing tray on its trestle over a mat, with the four forms the grain becomes laid
 * out beside it. A click tosses the tray, grain rises and falls back into it, and each of the four forms lifts in turn.
 */
export function riceFormsVn(): P {
  const g = group();
  add(g, cyl(1.5, 1.5, .04, VNC.tre, 24), 0, .02, 0);                                   // the drying mat, a low disc, not a floor plane
  for (const x of [-.55, .55]) for (const z of [-.3, .3]) add(g, cyl(.05, .06, .62, VNC.go, 5), x, .31, z - .6);
  add(g, box(1.4, .05, .8, VNC.go), 0, .63, -.6);
  // the winnowing tray with its grain: the reacting subject
  const tray = add(g, new THREE.Group(), 0, .66, -.6); tray.name = "rice-winnow";
  add(tray, cyl(.52, .48, .06, VNC.tre, 20), 0, .03, 0);
  add(tray, ring(.52, .02, VNC.laKho), 0, .06, 0).rotation.x = Math.PI / 2;
  const grain = Array.from({ length: 14 }, (_, i) => add(tray, ball(.035, "#EFE3C0", 5), Math.cos(i * .9) * .3 * (i % 3 ? 1 : .5), .07, Math.sin(i * .9) * .3 * (i % 3 ? 1 : .5)));
  // the four forms: grain, fresh noodle, rice paper and a steamed cake, each on its own leaf
  const forms: THREE.Group[] = [];
  const spots: [number, number, string][] = [[-1.0, .55, "grain"], [-.35, .75, "noodle"], [.35, .75, "paper"], [1.0, .55, "cake"]];
  for (const [i, [x, z, kind]] of spots.entries()) {
    bananaLeaf(g, x, .05, z, .44, .3);
    const f = add(g, new THREE.Group(), x, .06, z); f.name = `rice-form-${kind}`; forms.push(f);
    if (kind === "grain") { add(f, cyl(.15, .12, .08, VNC.tre, 12), 0, .04, 0); const heap = add(f, ball(.14, "#EFE3C0", 8), 0, .09, 0); heap.scale.y = .5; }
    if (kind === "noodle") for (let j = 0; j < 7; j++) add(f, cyl(.016, .016, .28, VNC.bun, 4), -.08 + j * .026, .03, 0).rotation.x = 1.55;
    if (kind === "paper") for (let j = 0; j < 3; j++) add(f, cyl(.16, .16, .008, "#F3EFE2", 16), 0, .02 + j * .01, 0);
    if (kind === "cake") for (let j = 0; j < 3; j++) add(f, cyl(.07, .06, .04, "#F4EFE2", 10), -.09 + j * .09, .03, 0);
    void i;
  }
  // falling grain: bounded copies that land back in the tray and are cleaned up
  const falling: { mesh: THREE.Mesh; age: number; from: THREE.Vector3; to: THREE.Vector3 }[] = [];
  const winnower = add(g, resident("northWoman", true), 0, 0, -1.4); winnower.rotation.y = Math.PI;
  const helper = add(g, resident("south", false), 1.5, 0, -.4); helper.rotation.y = -1.1;
  const basketOfGrain = basket(g, 1.7, 0, .4, .28, .26, { color: "#EFE3C0", n: 6, size: .06 });
  void basketOfGrain;
  const trayRest = tray.position.clone();
  return life(g, "riceSea", [winnower, helper], (t, k, dt) => {
    grain.forEach((gr, i) => { const a = i * .9, r = .3 * (i % 3 ? 1 : .5); gr.position.set(Math.cos(a) * r, .07 + Math.max(0, Math.sin(t * 2.4 + i)) * .012 + beat(k, 0, .5) * Math.abs(Math.sin(t * 13 + i)) * .16, Math.sin(a) * r); });
    // 1. material first: the tray tosses the grain up, then each of the four forms lifts in turn
    const toss = beat(k, 0, .8);
    tray.position.copy(trayRest);
    tray.position.y = trayRest.y + toss * .16;
    tray.rotation.x = -toss * .3;
    forms.forEach((f, i) => { f.position.y = .06 + beat(k, .30 + i * .12, .55 + i * .12) * .18; f.rotation.y = beat(k, .30 + i * .12, .55 + i * .12) * .5; });
    // 2. the winnower's arms lift the tray; 3. the helper turns to the forms
    arms(winnower).left.rotation.x = arms(winnower).right.rotation.x = -.8 - toss * .5;
    upper(helper).rotation.y = beat(k, .6, 1) * .4;
    for (let i = falling.length - 1; i >= 0; i--) {
      const f = falling[i]; f.age += dt; if (f.age < 0) continue;
      const p = Math.min(1, f.age / .9);
      f.mesh.position.lerpVectors(f.from, f.to, p); f.mesh.position.y = f.from.y + (f.to.y - f.from.y) * p * p + Math.sin(p * Math.PI) * .22;
      if (f.age > 1.4) { g.remove(f.mesh); falling.splice(i, 1); }
    }
  }, () => {
    if (falling.length >= 18) return;
    for (let i = 0; i < 6; i++) {
      const a = i * 1.05, m = add(g, ball(.028, "#EFE3C0", 5), Math.cos(a) * .2, .78, -.6 + Math.sin(a) * .2);
      m.name = "winnow-grain";
      falling.push({ mesh: m, age: -i * .05, from: m.position.clone(), to: V(Math.cos(a) * .34, .74, -.6 + Math.sin(a) * .34) });
    }
  });
}
/** chickenSea — the household yard: a bamboo coop, a hen with her chicks and a feed basket. A click sets the hen scratching and one chick follows her. */
export function chickenYardVn(): P {
  const g = group();
  add(g, cyl(1.3, 1.3, .03, "#C0B896", 20), 0, .015, 0);
  // the coop: a woven basket house on short legs with a plank ramp
  const coop = add(g, new THREE.Group(), -1.0, 0, -.8);
  for (const x of [-.35, .35]) for (const z of [-.28, .28]) add(coop, cyl(.05, .055, .34, VNC.go, 5), x, .17, z);
  add(coop, box(.9, .06, .7, VNC.go), 0, .35, 0);
  add(coop, box(.8, .5, .62, VNC.tre), 0, .63, 0);
  for (let i = 0; i < 6; i++) add(coop, box(.78, .02, .04, VNC.laKho), 0, .45 + i * .09, .32);
  for (const side of [-1, 1]) { const r = add(coop, box(.95, .05, .44, VNC.la), 0, 1.0, side * .2); r.rotation.x = -side * .55; }
  add(coop, box(.28, .03, .6, VNC.go), .4, .2, .45).rotation.x = .4;
  // the hen: the reacting subject
  const hen = add(g, new THREE.Group(), .4, 0, .3); hen.name = "yard-hen";
  const body = add(hen, ball(.17, "#A8602A", 8), 0, .22, 0); body.scale.set(1.35, 1, .95);
  add(hen, ball(.085, "#A8602A", 7), .18, .36, 0);
  add(hen, cone(.03, .07, VNC.vang, 5), .27, .35, 0).rotation.z = -1.55;
  add(hen, ball(.04, "#C0392B", 5), .18, .44, 0).scale.set(.6, 1, .5);
  const tail = add(hen, cone(.07, .18, "#8A4A22", 6), -.2, .28, 0); tail.rotation.z = 1.2;
  for (const z of [-.06, .06]) add(hen, cyl(.014, .014, .14, VNC.vang, 4), .02, .08, z);
  const chicks = [[.75, .5], [.62, .16], [.95, .3]].map(([x, z], i) => {
    const c = add(g, new THREE.Group(), x, 0, z);
    add(c, ball(.075, "#E3C86A", 7), 0, .09, 0).scale.set(1.2, 1, .95);
    add(c, ball(.045, "#E3C86A", 6), .07, .16, 0);
    add(c, cone(.016, .035, VNC.vang, 4), .11, .16, 0).rotation.z = -1.55;
    c.userData.phase = i * 1.7;
    return c;
  });
  const feed = basket(g, -.2, 0, .9, .22, .18, { color: "#EFE3C0", n: 5, size: .05 });
  for (let i = 0; i < 9; i++) add(g, ball(.015, "#EFE3C0", 4), -.1 + Math.cos(i) * .35, .03, .8 + Math.sin(i) * .3);
  void feed;
  const keeper = add(g, resident("southWoman", true), -1.1, 0, .9); keeper.rotation.y = -.6;
  const extra = chicken("#C9954A", "Cục tác! Cluck!"); add(g, extra, 1.1, 0, -.6); extra.rotation.y = -2.2;
  const henRest = hen.position.clone();
  return life(g, "chickenSea", [keeper], (t, k) => {
    // always on: the hen pecks and the chicks wander round her
    hen.position.copy(henRest);
    hen.position.x = henRest.x + Math.sin(t * .4) * .12;
    body.rotation.z = Math.sin(t * 2.2) * .05;
    tail.rotation.z = 1.2 + Math.sin(t * 2.6) * .1;
    chicks.forEach((c, i) => { const a = t * .5 + (c.userData.phase as number); c.position.set(.75 + Math.cos(a) * .22 - i * .08, 0, .34 + Math.sin(a) * .2 + i * .06); c.rotation.y = -a; });
    // 1. the hen first: she scratches at the ground, head down, one foot back
    const scratch = beat(k, 0, .7);
    hen.position.y = henRest.y + Math.abs(Math.sin((1 - k) * 26)) * .04 * (k > 0 ? 1 : 0);
    hen.rotation.x = scratch * .35;
    hen.rotation.y = Math.sin((1 - k) * 9) * .5 * scratch;
    // 2. the nearest chick follows her; 3. the keeper turns to the yard
    chicks[0].position.x += scratch * .18; chicks[0].rotation.x = scratch * .3;
    upper(keeper).rotation.y = -beat(k, .5, 1) * .4;
  });
}

/** herbsSea — the herb trays at the west gate: mint, coriander and Vietnamese balm in three shallow trays under an open bamboo rack. A click pinches one bundle out of its tray into the vendor's hand. */
export function herbTraysVn(): P {
  const g = group();
  // an open bamboo rack: four posts and two cross rails only, so from above it reads as a rack and not a roof
  for (const x of [-1.3, 1.3]) for (const z of [-.7, .7]) add(g, cyl(.05, .055, 1.7, VNC.tre, 5), x, .85, z);
  for (const z of [-.7, .7]) add(g, cyl(.035, .035, 2.7, VNC.tre, 5), 0, 1.7, z).rotation.z = Math.PI / 2;
  for (let i = 0; i < 5; i++) add(g, cyl(.02, .02, 1.5, VNC.tre, 4), -1.1 + i * .55, 1.72, 0).rotation.x = Math.PI / 2;
  add(g, box(2.9, .05, 1.2, VNC.go), 0, .66, 0);
  for (const x of [-1.2, 1.2]) for (const z of [-.45, .45]) add(g, cyl(.05, .055, .64, VNC.go, 5), x, .32, z);
  // three trays of leaves, each a different green; the near tray's bundle is the reacting subject
  const trays = ([["#4F7A3A", -.95], [VNC.rau, 0], ["#6FB06A", .95]] as [string, number][]).map(([color, x], i) => {
    const tr = add(g, new THREE.Group(), x, .69, 0);
    add(tr, cyl(.40, .36, .08, VNC.tre, 16), 0, .04, 0);
    const leaves = Array.from({ length: 11 }, (_, j) => { const l = add(tr, ball(.065, color, 5), Math.cos(j * .95) * .24 * (j % 2 ? 1 : .5), .09, Math.sin(j * .95) * .24 * (j % 2 ? 1 : .5)); l.scale.set(1, .5, 1.5); return l; });
    for (let j = 0; j < 4; j++) add(tr, cyl(.012, .012, .2, "#5F9A4A", 3), Math.cos(j * 1.6) * .18, .14, Math.sin(j * 1.6) * .18).rotation.set(.2, j, .2);
    void i; return { tr, leaves, color };
  });
  const bundle = add(g, new THREE.Group(), -.95, .8, .3); bundle.name = "herb-bundle";
  for (let i = 0; i < 6; i++) add(bundle, ball(.055, "#4F7A3A", 5), Math.cos(i * 1.1) * .06, .03 + (i % 2) * .03, Math.sin(i * 1.1) * .06).scale.set(1, .5, 1.5);
  add(bundle, cyl(.014, .014, .12, "#D9C088", 4), 0, .02, 0).rotation.z = Math.PI / 2;
  const bundleRest = bundle.position.clone();
  // the tied bundles already done, in a basket, and a water pail for the leaves
  const done = basket(g, 1.6, 0, .7, .26, .24, { color: "#4F7A3A", n: 6, size: .06 });
  void done;
  add(g, cyl(.20, .17, .24, VNC.go, 12), -1.7, .12, .7); add(g, cyl(.18, .18, .02, "#9FC2C4", 12), -1.7, .25, .7);
  const vendor = add(g, resident("northWoman", true), -.9, 0, -1.0); vendor.rotation.y = Math.PI;
  const buyer = add(g, resident("north", false), .9, 0, 1.4); buyer.rotation.y = .3;
  return life(g, "herbsSea", [vendor, buyer], (t, k) => {
    // always on: the leaves shift as the trays are turned and sprinkled
    trays.forEach(({ leaves, tr }, i) => { tr.rotation.y = Math.sin(t * .35 + i) * .05; leaves.forEach((l, j) => { l.position.y = .09 + Math.max(0, Math.sin(t * 1.9 + j * .8 + i)) * .012; }); });
    // 1. the leaves first: a bundle lifts out of the near tray and turns in the air
    const pinch = beat(k, 0, .7);
    bundle.position.copy(bundleRest);
    bundle.position.y = bundleRest.y + pinch * .34; bundle.position.z = bundleRest.z + pinch * .22;
    bundle.rotation.z = pinch * .7; bundle.rotation.y = pinch * 1.1;
    trays[0].leaves.forEach((l, j) => { l.position.y = .09 + beat(k, 0, .5) * Math.abs(Math.sin(t * 9 + j)) * .05; });
    // 2. the vendor's hand follows the bundle; 3. the buyer leans over the trays
    arms(vendor).right.rotation.x = -.5 - pinch * .9;
    upper(buyer).rotation.x = beat(k, .55, 1) * .2;
  });
}

/** fishSauce — the Phú Quốc barrel rack: three wooden barrels on a frame, a tap over the catching jar and a funnel. A click opens the tap, amber falls into the jar and the tap closes exactly. */
export function phuQuocBarrelsVn(): P {
  const g = group();
  // the rack: two trestles carrying three barrels, their staves and hoops modelled
  for (const x of [-1.5, 1.5]) { add(g, box(.16, .70, 1.1, VNC.go), x, .35, 0); add(g, box(.16, .12, 1.4, VNC.go), x, .76, 0); }
  add(g, box(3.2, .12, .22, VNC.go), 0, .76, -.45); add(g, box(3.2, .12, .22, VNC.go), 0, .76, .45);
  const barrels = [-1.0, 0, 1.0].map((x, i) => {
    const b = add(g, new THREE.Group(), x, 1.12, 0);
    const body = add(b, cyl(.34, .30, .86, "#8A5A34", 16), 0, 0, 0); body.rotation.x = Math.PI / 2;
    for (const z of [-.3, 0, .3]) add(b, ring(.335, .022, "#5A4A3A"), 0, 0, z);
    for (let j = 0; j < 14; j++) add(b, box(.055, .012, .84, "#7A4A2A"), Math.cos(j * .45) * .33, Math.sin(j * .45) * .33, 0);
    void i; return b;
  });
  // the tap and the jar it fills: the reacting subject is the falling sauce
  const tap = add(g, new THREE.Group(), -1.0, .82, .46);
  add(tap, cyl(.03, .035, .16, VNC.than, 8), 0, 0, 0).rotation.x = Math.PI / 2;
  const handle = add(tap, box(.10, .02, .03, VNC.than), 0, .06, .04);
  const jarBody = jar(g, -1.0, 0, .52, .22, .46);
  const funnel = add(g, cone(.14, .16, VNC.than, 12), -1.0, .60, .52); funnel.rotation.x = Math.PI;
  const level = add(g, cyl(.16, .16, .02, VNC.nuocMam, 12), -1.0, .30, .52);
  const drip = stream(g, "fish-sauce-drip", VNC.nuocMam, .016);
  // the tap stands directly over the jar's mouth, so what leaves it falls straight into the funnel
  const from = V(-1.0, .80, .52), to = V(-1.0, .62, .52);
  // the anchovy baskets, the salt heap and the finished bottles
  const anchovy = basket(g, 1.4, 0, 1.0, .3, .24, { color: "#E8C8A8", n: 7, size: .055 });
  void anchovy;
  const salt = add(g, ball(.3, "#F3EFE6", 8), 2.0, .1, .5); salt.scale.y = .5;
  for (let i = 0; i < 4; i++) { const b = add(g, new THREE.Group(), .3 + (i % 2) * .22, 0, 1.15 + Math.floor(i / 2) * .2); add(b, cyl(.055, .055, .26, VNC.nuocMam, 9), 0, .13, 0); add(b, cyl(.022, .03, .07, "#CFE3EA", 8), 0, .29, 0); b.userData.foodReaction = i === 0 ? "sway" : undefined; }
  const tapper = add(g, resident("south", true), -1.95, 0, 1.0); tapper.rotation.y = 1.25;
  const carrier = add(g, resident("southWoman", false), 1.7, 0, 1.5); carrier.rotation.y = .9;
  return life(g, "fishSauce", [tapper, carrier], (t, k) => {
    // always on: one slow drop hangs and falls from the tap even before anyone touches it
    const slow = (t * .5) % 1;
    barrels.forEach((b, i) => { b.rotation.z = Math.sin(t * .3 + i) * .004; });
    // 1. the material first: the tap opens, amber falls into the jar, the level rises, then the tap closes
    const open = beat(k, 0, .72);
    handle.rotation.z = -open * 1.2;
    const running = k > 0 ? open > .12 : slow < .18;
    drip.set(from, running ? to : V(from.x, from.y - .09, from.z), running || slow < .18);
    level.position.y = .30 + beat(k, .2, .9) * .06;
    level.scale.setScalar(1 + beat(k, .2, .9) * .05);
    // 2. the tapper's hand is on the handle; 3. the carrier turns to the jar
    arms(tapper).right.rotation.x = -.9 - open * .35;
    upper(carrier).rotation.y = -beat(k, .55, 1) * .35;
    void jarBody;
  });
}

/** starAniseVn — the phở spice tray: star anise, cassia bark and grilled ginger in a shallow pan over coals, with the cloth bag they are tied into. A click turns the spices in the pan and the smoke curls up. */
export function phoSpiceTrayVn(): P {
  const g = group();
  add(g, box(1.6, .62, 1.0, VNC.gach), 0, .31, 0);
  add(g, box(1.7, .06, 1.1, VNC.go), 0, .65, 0);
  const { coals } = brazier(g, -.35, .68, .1, .24);
  const pan = add(g, cyl(.34, .30, .05, "#4A4A4E", 18), -.35, 1.02, .1);
  void pan;
  // the spices in the pan: the star anise is the reacting subject
  const anise = add(g, new THREE.Group(), -.35, 1.06, .1); anise.name = "spice-anise";
  const stars = Array.from({ length: 5 }, (_, i) => {
    const s = add(anise, new THREE.Group(), Math.cos(i * 1.3) * .16, 0, Math.sin(i * 1.3) * .16);
    add(s, cyl(.035, .035, .02, "#6B3A1A", 8), 0, 0, 0);
    for (let j = 0; j < 8; j++) add(s, ball(.022, "#7A421C", 5), Math.cos(j * .79) * .045, .002, Math.sin(j * .79) * .045).scale.set(1.4, .6, .8);
    s.rotation.y = i; return s;
  });
  for (let i = 0; i < 3; i++) add(anise, cyl(.022, .026, .17, "#8A5A2A", 7), -.2 + i * .1, .01, -.16).rotation.set(0, i * .5, 1.5);   // cassia bark
  const ginger = add(anise, ball(.07, "#D9C08A", 7), .2, .02, -.1); ginger.scale.set(1.5, .7, .9);
  const cardamom = Array.from({ length: 4 }, (_, i) => add(anise, ball(.022, "#8A7A5A", 5), .05 + i * .05, .01, .2));
  // the cloth bag, the mortar of ginger and the tray of dried spices on the bench
  const bag = add(g, new THREE.Group(), .55, .68, .2);
  add(bag, ball(.14, "#E8E2D2", 8), 0, .12, 0).scale.set(1, 1.2, 1);
  add(bag, cyl(.05, .07, .07, "#E8E2D2", 8), 0, .26, 0);
  add(bag, cyl(.012, .012, .1, "#B9A98A", 4), 0, .3, 0).rotation.z = .6;
  bag.userData.foodReaction = "sway";
  const trayOfSpice = add(g, cyl(.24, .22, .05, VNC.tre, 14), .55, .70, -.4);
  for (let i = 0; i < 6; i++) add(g, ball(.028, i % 2 ? "#7A421C" : "#8A5A2A", 5), .55 + Math.cos(i) * .12, .74, -.4 + Math.sin(i) * .12);
  void trayOfSpice;
  g.userData.smoke = V(-.35, 1.3, .1);
  const roaster = add(g, resident("north", true), -.35, 0, -.9); roaster.rotation.y = Math.PI;
  const buyer = add(g, resident("northWoman", false), 1.1, 0, .9); buyer.rotation.y = .6;
  const aniseRest = anise.position.clone();
  return life(g, "starAniseVn", [roaster, buyer], (t, k) => {
    // always on: the coals glow and the spices shift in the pan
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .5 + Math.sin(t * 2.4 + i) * .2 + beat(k, .05, .9) * .6; });
    stars.forEach((s, i) => { s.position.y = Math.max(0, Math.sin(t * 2.6 + i)) * .01; });
    // 1. the spices first: the pan is shaken, the stars jump and turn over, the ginger rolls
    const shake = beat(k, 0, .7);
    anise.position.copy(aniseRest);
    anise.position.y = aniseRest.y + shake * .06;
    anise.rotation.y = Math.sin((1 - k) * 18) * .3 * shake;
    stars.forEach((s, i) => { s.position.y = shake * Math.abs(Math.sin(t * 12 + i * 1.3)) * .16; s.rotation.x = shake * Math.sin(t * 9 + i) * 1.2; });
    ginger.rotation.z = shake * Math.sin(t * 7) * .8;
    cardamom.forEach((c, i) => { c.position.y = .01 + shake * Math.abs(Math.sin(t * 14 + i)) * .1; });
    // 2. the roaster's hand shakes the pan; 3. the buyer leans in for the smell
    arms(roaster).right.rotation.x = -.7 - shake * .3;
    upper(buyer).rotation.x = beat(k, .5, 1) * .2;
  });
}

/** lemongrassVn — the baskets at the Huế garden gate: lemongrass in bundles and a crock of shrimp paste. A click bruises one stalk flat on the block and a curl of scent rises off it. */
export function lemongrassBasketVn(): P {
  const g = group();
  add(g, cyl(1.2, 1.2, .03, VNC.dat, 18), 0, .015, 0);
  // two baskets of stalks and the chopping block between them
  const stalks: THREE.Mesh[] = [];
  for (const [i, x] of [-.9, .9].entries()) {
    const bk = basket(g, x, 0, -.2, .32, .34);
    for (let j = 0; j < 12; j++) { const st = add(bk, cyl(.022, .028, .78, j % 3 ? "#A8C46A" : "#BFD08A", 5), Math.cos(j * .8) * .14, .5, Math.sin(j * .8) * .14); st.rotation.set(Math.sin(j) * .12, j, Math.cos(j) * .12); stalks.push(st); }
    void i;
  }
  add(g, box(1.0, .05, .7, VNC.go), 0, .56, .5);
  for (const dx of [-.4, .4]) for (const dz of [-.25, .25]) add(g, cyl(.05, .055, .56, VNC.goDam, 5), dx, .28, .5 + dz);
  const block = add(g, cyl(.28, .28, .16, VNC.goDam, 14), 0, .66, .5);
  void block;
  // the stalk on the block: the reacting subject, at working height where nothing crosses in front of it
  const stalk = add(g, new THREE.Group(), 0, .78, .5); stalk.name = "lemongrass-stalk";
  const shaft = add(stalk, cyl(.03, .036, .52, "#A8C46A", 6), 0, 0, 0); shaft.rotation.z = Math.PI / 2;
  add(stalk, cyl(.026, .026, .1, "#D8E0B0", 6), -.3, 0, 0).rotation.z = Math.PI / 2;
  for (let i = 0; i < 3; i++) add(stalk, box(.16, .008, .03, "#8FB06A"), .3 + i * .03, .02, -.02 + i * .02).rotation.y = i * .3;
  const stalkRest = stalk.position.clone();
  const pestle = add(g, new THREE.Group(), .32, .97, .62);
  add(pestle, cyl(.05, .055, .3, VNC.go, 8), 0, .15, 0);
  const pestleRest = pestle.position.clone();
  // the scent: three rings that rise off the bruised stalk and fade
  const curls = Array.from({ length: 3 }, (_, i) => { const c = add(g, ring(.07 + i * .03, .012, "#D8E8C0", Math.PI * 2, .55), 0, .85, .5); c.rotation.x = Math.PI / 2; c.visible = false; return c; });
  // the shrimp paste crock and the tied bundles
  const crock = add(g, new THREE.Group(), 1.4, 0, .5);
  add(crock, cyl(.16, .14, .3, "#8A4A2A", 12), 0, .15, 0);
  add(crock, cyl(.15, .15, .02, "#9B4A3A", 12), 0, .30, 0);
  add(crock, cyl(.16, .16, .03, VNC.laKho, 12), 0, .33, 0);
  const paddle = add(crock, cyl(.012, .012, .3, VNC.tre, 4), .05, .4, 0); paddle.rotation.z = .3;
  for (let i = 0; i < 3; i++) { const b = add(g, new THREE.Group(), -1.5, .04, .4 + i * .18); for (let j = 0; j < 5; j++) add(b, cyl(.02, .024, .5, "#A8C46A", 5), (j - 2) * .03, .25, 0); add(b, cyl(.012, .012, .16, "#D9C088", 4), 0, .3, 0).rotation.z = Math.PI / 2; b.userData.foodReaction = i === 0 ? "sway" : undefined; }
  const worker = add(g, resident("centre", true), 1.15, 0, .45); worker.rotation.y = -1.5;
  const cook = add(g, resident("centre", false), -1.25, 0, -.5); cook.rotation.y = -.6;
  return life(g, "lemongrassVn", [worker, cook], (t, k) => {
    stalks.forEach((st, i) => { st.rotation.x = Math.sin(t * 1.2 + i * .4) * .05; });
    paddle.rotation.z = .3 + Math.sin(t * .8) * .05;
    // 1. the stalk first: the pestle falls on it, the shaft flattens and the scent curls up
    const hit = beat(k, 0, .3), flat = hold(k, .22), scent = beat(k, .2, .95);
    pestle.position.copy(pestleRest);
    pestle.position.y = pestleRest.y - Math.max(hit, flat) * .16;
    stalk.position.copy(stalkRest);
    shaft.scale.set(1, 1 + flat * .18, 1 - flat * .38);
    stalk.position.y = stalkRest.y - flat * .03; stalk.rotation.z = flat * .12;
    curls.forEach((c, i) => {
      const u = clamp01(scent - i * .18);
      c.visible = u > .02;
      c.position.y = .85 + u * .5; c.scale.setScalar(.6 + u * 1.1);
      (c.material as THREE.MeshStandardMaterial).opacity = .55 * (1 - u);
    });
    // 2. the worker's arm drives the pestle; 3. the cook by the gate looks over
    arms(worker).right.rotation.x = -.9 - hit * .5;
    upper(cook).rotation.y = -beat(k, .55, 1) * .35;
  });
}

/** riverFishVn — the channel bank: a bamboo trap basket lifted onto the dry bank, a cast net on its pole and the day's fish. A click lifts the basket and one fish turns over inside it; the basket returns to the bank. */
export function riverFishBasketVn(): P {
  const g = group();
  add(g, box(3.2, .14, 1.6, "#A8996E"), 0, .07, -.3);                                     // the dry bank the whole stand stands on
  for (let i = 0; i < 5; i++) add(g, cyl(.05, .06, .9, VNC.tre, 5), -1.3 + i * .65, .45, .6);   // the stakes at the water's edge
  for (let i = 0; i < 4; i++) add(g, cyl(.02, .02, .68, VNC.tre, 4), -.98 + i * .65, .78, .6).rotation.z = Math.PI / 2;
  // the trap basket: the reacting subject, on the bank and never in the water
  const trap = add(g, new THREE.Group(), -.2, .14, -.1); trap.name = "river-fish-basket";
  add(trap, cyl(.34, .28, .40, VNC.tre, 14), 0, .20, 0);
  for (let i = 0; i < 5; i++) add(trap, ring(.34 - i * .012, .015, VNC.laKho), 0, .06 + i * .08, 0).rotation.x = Math.PI / 2;
  add(trap, cyl(.12, .16, .08, VNC.laKho, 10), 0, .43, 0);
  const fish = Array.from({ length: 4 }, (_, i) => {
    const f = add(trap, new THREE.Group(), Math.cos(i * 1.6) * .12, .22 + (i % 2) * .05, Math.sin(i * 1.6) * .12);
    const b = add(f, ball(.09, i % 2 ? "#9FB0B8" : "#B9C4B0", 7), 0, 0, 0); b.scale.set(1.8, .8, .5);
    add(f, cone(.055, .10, i % 2 ? "#9FB0B8" : "#B9C4B0", 5), -.17, 0, 0).rotation.z = Math.PI / 2;
    f.rotation.y = i * 1.2; return f;
  });
  fish[0].name = "river-fish";
  const trapRest = trap.position.clone();
  // the cast net on its pole, the creel and a basket of small fish for salting
  const net = add(g, new THREE.Group(), 1.1, .14, -.5);
  add(net, cyl(.03, .03, 1.9, VNC.tre, 5), 0, .95, 0).rotation.z = .25;
  const mesh = add(net, new THREE.Mesh(new THREE.PlaneGeometry(1.0, .8, 6, 4), new THREE.MeshStandardMaterial({ color: "#C9B45A", wireframe: true })), .5, 1.0, .1);
  mesh.rotation.y = .4;
  const creel = basket(g, .7, .14, .3, .24, .2, { color: "#9FB0B8", n: 5, size: .05 });
  void creel;
  const salting = basket(g, -1.2, .14, .2, .28, .22, { color: "#B9C4B0", n: 6, size: .045 });
  void salting;
  const fisher = add(g, resident("south", true), -.25, .14, -1.0); fisher.rotation.y = Math.PI;
  const child = add(g, resident("child", false), .5, .14, -1.0); child.rotation.y = Math.PI - .3;
  return life(g, "riverFishVn", [fisher, child], (t, k) => {
    // always on: the fish stir in the basket and the net sways on its pole
    fish.forEach((f, i) => { f.rotation.z = Math.sin(t * 2.4 + i * 1.2) * .12; f.position.y = .22 + (i % 2) * .05 + Math.max(0, Math.sin(t * 2 + i)) * .01; });
    mesh.rotation.z = Math.sin(t * .7) * .05;
    // 1. the catch first: the basket comes up off the bank and the first fish turns right over
    const lift = beat(k, 0, .72);
    trap.position.copy(trapRest);
    trap.position.y = trapRest.y + lift * .52; trap.position.z = trapRest.z - lift * .12;
    trap.rotation.z = lift * .2;
    fish[0].rotation.z = Math.sin((1 - k) * 12) * 1.1 * beat(k, .05, .8);
    fish[0].position.y = .22 + beat(k, .05, .8) * .12;
    // 2. the fisher's arms take the weight; 3. the boy leans over the basket
    arms(fisher).left.rotation.x = arms(fisher).right.rotation.x = -.5 - lift * .8;
    upper(child).rotation.x = beat(k, .55, 1) * .22;
  });
}

/** lotusTeaVn — the lotus lane: a lacquer tray with a leaf parcel of scented tea and a cup beside it, with lotus in the pot behind. A click opens the leaf, shows the cup steaming and closes the leaf again. */
export function lotusTeaTrayVn(): P {
  const g = group();
  // the lacquer table and its tray
  add(g, box(1.3, .04, .9, "#5A2B22"), 0, .48, 0);
  for (const x of [-.55, .55]) for (const z of [-.35, .35]) add(g, cyl(.05, .05, .48, "#5A2B22", 6), x, .24, z);
  add(g, cyl(.42, .40, .04, "#7A3B2A", 18), 0, .52, 0);
  // the leaf parcel: the reacting subject, four leaf flaps that open off the cup
  const parcel = add(g, new THREE.Group(), -.02, .55, 0); parcel.name = "lotus-leaf";
  const flaps = Array.from({ length: 4 }, (_, i) => {
    const pivot = add(parcel, new THREE.Group(), Math.cos(i * 1.57) * .1, .02, Math.sin(i * 1.57) * .1);
    pivot.rotation.y = i * 1.57;
    const leaf = add(pivot, cyl(.17, .17, .012, "#4F8A3A", 12, ), .1, .05, 0);
    leaf.rotation.z = -1.1;
    return pivot;
  });
  const teaHeap = add(parcel, ball(.09, "#3F5A2A", 7), 0, .03, 0); teaHeap.scale.y = .5;
  // the cup under the leaf and the pot beside it
  const cup = add(g, new THREE.Group(), .3, .54, .18); cup.name = "lotus-cup";
  add(cup, cyl(.055, .042, .075, VNC.sanh, 12), 0, .038, 0);
  const tea = add(cup, cyl(.048, .048, .012, "#C9A24A", 12), 0, .07, 0);
  add(g, cyl(.09, .07, .1, VNC.sanh, 12), .3, .52, .18).visible = false;
  const pot = add(g, new THREE.Group(), -.42, .54, .2);
  add(pot, ball(.10, VNC.sanh, 10), 0, .08, 0).scale.y = .85;
  add(pot, cyl(.03, .04, .05, VNC.sanh, 8), 0, .16, 0);
  add(pot, cone(.02, .07, VNC.sanh, 6), -.11, .10, 0).rotation.z = 1.3;
  add(pot, ring(.045, .012, VNC.sanh), .11, .08, 0).rotation.y = Math.PI / 2;
  // the lotus in its water pot behind the table: the stand's own shallow pot, not open water
  const lotusPot = add(g, new THREE.Group(), 0, 0, -1.1);
  add(lotusPot, cyl(.62, .56, .38, "#8A6A4A", 18), 0, .19, 0);
  add(lotusPot, cyl(.58, .58, .02, "#5E8A82", 18), 0, .38, 0);
  const pads = Array.from({ length: 4 }, (_, i) => { const p = add(lotusPot, cyl(.18, .18, .012, "#4F8A3A", 12), Math.cos(i * 1.57) * .3, .40, Math.sin(i * 1.57) * .3); return p; });
  const blooms = Array.from({ length: 2 }, (_, i) => {
    const b = add(lotusPot, new THREE.Group(), Math.cos(i * 2.6) * .22, .42, Math.sin(i * 2.6) * .22);
    add(b, cyl(.014, .014, .34, "#4F7A3A", 4), 0, .17, 0);
    for (let j = 0; j < 6; j++) { const pt = add(b, ball(.05, "#E8A8C0", 6), Math.cos(j * 1.05) * .045, .36, Math.sin(j * 1.05) * .045); pt.scale.set(.7, 1.5, .5); pt.rotation.z = Math.cos(j * 1.05) * .4; pt.rotation.x = -Math.sin(j * 1.05) * .4; }
    return b;
  });
  g.userData.steam = V(.3, .68, .18);
  const secondPot = add(g, new THREE.Group(), 1.5, 0, -.9);
  add(secondPot, cyl(.5, .45, .32, "#8A6A4A", 16), 0, .16, 0);
  add(secondPot, cyl(.46, .46, .02, "#5E8A82", 16), 0, .32, 0);
  for (let i = 0; i < 3; i++) add(secondPot, cyl(.15, .15, .012, "#4F8A3A", 12), Math.cos(i * 2.1) * .22, .34, Math.sin(i * 2.1) * .22);
  const chest = add(g, new THREE.Group(), -1.35, 0, .3);
  add(chest, box(.6, .44, .44, VNC.goDam), 0, .22, 0); add(chest, box(.64, .05, .48, VNC.go), 0, .46, 0);
  add(chest, cyl(.13, .12, .16, VNC.sanh, 12), 0, .56, 0); add(chest, cyl(.12, .12, .02, "#3F5A2A", 12), 0, .64, 0);
  bench(g, .9, .95, 1.0, -.5, .36);
  const server = add(g, resident("northWoman", true), -.05, 0, .95); server.rotation.y = Math.PI;
  const guest = stool(g, .95, .6, -1.3, "north", .3);
  return life(g, "lotusTeaVn", [server, guest], (t, k) => {
    // always on: the pads turn on the water and the blooms nod
    pads.forEach((p, i) => { p.rotation.z = Math.sin(t * .8 + i) * .04; p.position.y = .40 + Math.sin(t * 1.1 + i) * .006; });
    blooms.forEach((b, i) => { b.rotation.z = Math.sin(t * .6 + i * 2) * .05; });
    tea.position.y = .07 + Math.sin(t * 1.4) * .002;
    // 1. the leaf first: the four flaps open off the tea, hold, and close again
    const open = beat(k, 0, .92);
    flaps.forEach((f, i) => { f.rotation.x = -open * (1.15 + i * .06); });
    parcel.position.y = .55 + open * .10; parcel.rotation.y = open * .30;
    teaHeap.scale.set(1 + open * .1, .5, 1 + open * .1);
    // 2. the cup answers: it lifts a little towards the guest; 3. the guest leans in over it
    cup.position.set(.3, .54 + beat(k, .35, .95) * .06, .18);
    arms(server).right.rotation.x = -.6 - open * .5;
    upper(guest).rotation.x = beat(k, .55, 1) * .2;
  });
}

/** caPheVn — the Saigon coffee stall: two glasses on the marble top, each under its filter, with the kettle on the brazier. The filter drips on its own; a click presses the grounds and the drip runs into the glass. */
export function caPheStallVn(): P {
  const g = group();
  // the marble-topped table and two stools, and the kettle on its brazier
  add(g, cyl(.52, .48, .06, VNC.sanh, 20), 0, .74, 0);
  add(g, cyl(.06, .07, .74, VNC.than, 8), 0, .37, 0);
  add(g, cyl(.24, .24, .04, VNC.than, 12), 0, .03, 0);
  const { coals } = brazier(g, 1.2, 0, -.2, .24);
  const kettle = add(g, new THREE.Group(), 1.2, .34, -.2);
  add(kettle, cyl(.17, .14, .22, "#8C9096", 14), 0, .11, 0);
  add(kettle, cyl(.07, .09, .04, "#8C9096", 10), 0, .23, 0);
  add(kettle, cone(.03, .12, "#8C9096", 6), -.18, .16, 0).rotation.z = 1.1;
  add(kettle, ring(.06, .014, "#8C9096"), .17, .14, 0).rotation.y = Math.PI / 2;
  // two glasses, each under a phin filter; the near one is the reacting subject
  const sets = [.04, -.14].map((x, i) => {
    const glass = add(g, new THREE.Group(), x, .77, i ? -.26 : .3);
    const shell = add(glass, new THREE.Mesh(new THREE.CylinderGeometry(.052, .042, .13, 14, 1, true), mat("#CFE3EA", { side: THREE.DoubleSide, transparent: true, opacity: .55 })), 0, .065, 0);
    void shell;
    add(glass, cyl(.05, .042, .012, "#CFE3EA", 14), 0, .006, 0);
    const coffee = add(glass, cyl(.046, .04, .03, "#4A2A1A", 14), 0, .02, 0);
    if (i === 0) add(glass, cyl(.046, .046, .018, "#E8D2A8", 14), 0, .008, 0);        // condensed milk in the bottom of the near glass
    const filter = add(g, new THREE.Group(), x, .90, i ? -.26 : .3);
    add(filter, cyl(.055, .05, .07, "#B7BEC4", 12), 0, .035, 0);
    add(filter, cyl(.062, .062, .012, "#B7BEC4", 12), 0, .075, 0);
    add(filter, cyl(.048, .048, .012, "#8C9096", 12), 0, .085, 0);
    const press = add(filter, cyl(.042, .042, .01, "#8C9096", 12), 0, .05, 0);
    add(filter, cyl(.042, .042, .02, "#3A2A1A", 12), 0, .028, 0);
    return { glass, coffee, filter, press, x, z: i ? -.26 : .3 };
  });
  sets[0].glass.name = "ca-phe-glass"; sets[0].filter.name = "ca-phe-filter"; sets[0].coffee.name = "ca-phe-coffee";
  const dripNear = stream(g, "ca-phe-drip", "#3A2010", .012);
  const dripFar = stream(g, "ca-phe-drip-far", "#3A2010", .010);
  const saucer = add(g, cyl(.09, .08, .012, VNC.sanh, 14), .36, .78, -.02);
  void saucer;
  const spoon = add(g, box(.012, .008, .12, "#C9CFD6"), .36, .79, -.02);
  g.userData.steam = V(1.2, .68, -.2);
  // the stall itself: a low counter against the wall line, its glasses, tins and the board over it
  add(g, box(1.8, .78, .56, VNC.go), .1, .39, -1.7);
  add(g, box(1.9, .06, .62, VNC.goDam), .1, .81, -1.7);
  for (let i = 0; i < 5; i++) add(g, cyl(.045, .036, .11, "#CFE3EA", 10), -.55 + i * .3, .89, -1.78);
  for (let i = 0; i < 3; i++) { add(g, cyl(.05, .05, .13, "#B7BEC4", 10), .55 + (i % 2) * .14, .90, -1.62 + Math.floor(i / 2) * .12); }
  add(g, box(.24, .18, .18, "#C9A24A"), -.72, .92, -1.6); add(g, box(.2, .14, .16, "#B03A2E"), -.45, .90, -1.55);
  for (const x of [-.85, 1.05]) add(g, cyl(.05, .055, 1.9, VNC.go, 6), x, .95, -1.98);
  sign(g, "CÀ PHÊ", 1.5, .32, .1, 1.72, -1.96, VNC.vang, VNC.do);
  // a second marble table at the kerb, with its own stool
  add(g, cyl(.40, .37, .05, VNC.sanh, 18), 1.55, .74, .55);
  add(g, cyl(.055, .065, .74, VNC.than, 8), 1.55, .37, .55);
  add(g, cyl(.2, .2, .04, VNC.than, 12), 1.55, .03, .55);
  add(g, cyl(.05, .042, .12, "#CFE3EA", 12), 1.45, .78, .48); add(g, cyl(.044, .04, .05, "#3A2A1A", 12), 1.45, .80, .48);
  const server = add(g, resident("south", true), -.4, 0, -1.15); server.rotation.y = -.3;
  const drinker = stool(g, 1.05, .15, -1.5, "south", .3);
  const reader = stool(g, -1.05, -.2, 1.5, "southWoman", .3);
  return life(g, "caPheVn", [server, drinker, reader], (t, k) => {
    coals.forEach((c, i) => { (c.material as THREE.MeshStandardMaterial).emissiveIntensity = .45 + Math.sin(t * 2 + i) * .15; });
    // always on: both filters drip, the near one on its own slow clock
    const slow = (t * .8) % 1, slowFar = (t * .8 + .45) % 1;
    const press = beat(k, 0, .5), run = beat(k, .1, .85);
    const from = (s: typeof sets[number]) => V(s.x, .90 + .02, s.z), to = (s: typeof sets[number]) => V(s.x, .80, s.z);
    dripNear.set(from(sets[0]), to(sets[0]), run > .1 || slow < .3);
    dripFar.set(from(sets[1]), to(sets[1]), slowFar < .25);
    // 1. the coffee first: the press goes down and the glass fills, then settles back to its rest level
    sets[0].press.position.y = .05 - press * .022;
    sets[0].coffee.scale.y = 1 + run * 1.5;
    sets[0].coffee.position.y = .02 + run * .015;
    sets.forEach((s, i) => { s.filter.position.y = .90 + (i === 0 ? -press * .004 : 0); });
    spoon.rotation.y = Math.sin(t * .5) * .2 + beat(k, .5, 1) * .8;
    // 2. the server's hand is on the filter cap; 3. the drinker lifts his glass a little
    arms(server).right.rotation.x = -.8 - press * .4;
    upper(drinker).rotation.x = beat(k, .55, 1) * .18;
    kettle.rotation.z = Math.sin(t * .4) * .01;
  });
}

// ---------- vehicles and boats the street and the quay need (also used by the Builder's lanes) ----------

/** A two-wheeled handcart with shafts down, loaded with baskets. No motor anywhere in Vietnam's set. */
export function handcart(load = VNC.rau): P {
  const g = group();
  add(g, box(1.1, .08, .7, VNC.go), 0, .52, 0);
  for (const x of [-.5, .5]) add(g, box(1.15, .18, .05, VNC.go), 0, .62, x * .7);
  for (const x of [-.56, .56]) { add(g, cyl(.26, .26, .05, VNC.goDam, 14), x, .26, 0).rotation.z = Math.PI / 2; for (let i = 0; i < 8; i++) add(g, box(.02, .44, .02, VNC.go), x, .26, 0).rotation.set(0, 0, i * .39); }
  for (const z of [-.24, .24]) { const shaft = add(g, cyl(.028, .028, 1.2, VNC.go, 5), .95, .48, z); shaft.rotation.z = Math.PI / 2 - .12; }
  add(g, cyl(.06, .06, .5, VNC.go, 5), 1.5, .25, 0).rotation.x = Math.PI / 2;      // the prop the shafts rest on when it stands
  basket(g, -.2, .56, -.15, .24, .22, { color: load, n: 5, size: .06 });
  basket(g, .2, .56, .18, .22, .2, { color: "#EFE3C0", n: 4, size: .055 });
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * .6) * .004; };
  return g;
}

/** A period bicycle with a rear rack and a bell; it stands on its stand, it is never ridden through a wall. */
export function bicycle(frame = "#2E3848"): P {
  const g = group();
  for (const z of [-.62, .62]) {
    add(g, ring(.33, .022, VNC.than), 0, .35, z).rotation.y = Math.PI / 2;
    for (let i = 0; i < 10; i++) add(g, box(.012, .62, .012, "#B7BEC4"), 0, .35, z).rotation.set(0, 0, i * .31);
    add(g, cyl(.04, .04, .05, "#B7BEC4", 8), 0, .35, z).rotation.x = Math.PI / 2;
  }
  add(g, cyl(.022, .022, 1.02, frame, 5), 0, .48, 0).rotation.x = Math.PI / 2 + .28;
  add(g, cyl(.022, .022, .72, frame, 5), 0, .58, -.3).rotation.x = -.5;
  add(g, cyl(.022, .022, .5, frame, 5), 0, .5, .48).rotation.x = .35;
  add(g, box(.05, .04, .22, VNC.goDam), 0, .78, -.34);                                 // the saddle
  const bars = add(g, cyl(.018, .018, .44, VNC.than, 5), 0, .86, .42); bars.rotation.z = Math.PI / 2;
  const bell = add(g, ball(.035, "#C9A24A", 7), .14, .86, .42); bell.name = "bicycle-bell";
  add(g, box(.3, .03, .22, VNC.go), 0, .66, -.62);                                     // the rack
  add(g, cyl(.025, .025, .34, VNC.than, 5), 0, .17, .1).rotation.z = .5;               // the stand
  add(g, cyl(.05, .05, .04, VNC.than, 8), 0, .34, .06).rotation.x = Math.PI / 2;
  g.userData.bell = bell;
  return g;
}

/** A sampan tied at a quay: the hull rests against the stone, the painter runs to a bollard, and it is never on open water. */
export function sampanTied(): P {
  const g = group();
  const hull = add(g, new THREE.Group(), 0, 0, 0);
  // a flat-bottomed hull: a floor, two sides that flare, and a raked stem and stern, all lying along z
  add(hull, box(.62, .06, 2.2, VNC.go), 0, .12, 0);
  for (const side of [-1, 1]) { const b = add(hull, box(.05, .28, 2.2, VNC.go), side * .33, .27, 0); b.rotation.z = -side * .18; }
  for (const [z, len, lift] of [[1.35, .7, .30], [-1.35, .6, .26]] as [number, number, number][]) {
    const end = add(hull, box(.5, .06, len, VNC.go), 0, .12 + lift / 2, z); end.rotation.x = (z > 0 ? -1 : 1) * .55;
    for (const side of [-1, 1]) { const b = add(hull, box(.05, .26, len, VNC.go), side * .26, .28 + lift / 2, z); b.rotation.set((z > 0 ? -1 : 1) * .55, 0, -side * .18); }
  }
  add(hull, box(.66, .05, .16, VNC.goDam), 0, .40, .55); add(hull, box(.66, .05, .16, VNC.goDam), 0, .40, -.55);   // the thwarts
  const hoops = add(hull, new THREE.Group(), 0, .42, -.05);
  for (let i = 0; i < 4; i++) { const h = add(hoops, new THREE.Mesh(new THREE.TorusGeometry(.30, .018, 5, 10, Math.PI), mat(VNC.tre)), 0, 0, -.36 + i * .24); h.rotation.y = Math.PI / 2; }
  add(hoops, new THREE.Mesh(new THREE.CylinderGeometry(.31, .31, .78, 10, 1, true, 0, Math.PI), mat(VNC.laKho)), 0, 0, -.12).rotation.set(Math.PI / 2, 0, 0);   // the mat awning
  const oar = add(hull, cyl(.022, .022, 1.3, VNC.go, 5), .26, .46, -.9); oar.rotation.set(.25, .35, 1.35);
  add(hull, box(.16, .03, .3, VNC.go), .45, .32, -1.4);
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * .7) * .012; g.position.y = Math.sin(t * .9) * .012; };
  return g;
}

// ---------- the seven landmarks ----------

/**
 * hoanKiem — the lake's west shore: the stone embankment, its railing, the willows and the stone landing. The lake itself
 * belongs to the landscape, so nothing here stands in water; the turtle surfaces in front and its ripple crosses once.
 */
export function hoanKiemVn(): P {
  const g = group();
  // the embankment: paving, kerb and railing, all behind the water line
  add(g, box(6.0, .16, 2.2, "#C9BDA3"), 0, .08, -.9);
  add(g, box(6.0, .22, .3, "#A8A092"), 0, .19, .15);
  for (let i = 0; i < 13; i++) add(g, cyl(.05, .055, .5, "#BFB6A4", 6), -2.9 + i * .48, .45, .08);
  add(g, cyl(.035, .035, 6.0, "#BFB6A4", 6), 0, .70, .08).rotation.z = Math.PI / 2;
  // the stone landing: three steps down to the water, and the mooring stone
  for (let i = 0; i < 3; i++) add(g, box(1.3, .1, .3, "#A8A092"), 2.0, .18 - i * .06, .12 + i * .1);
  add(g, cyl(.12, .14, .4, "#A8A092", 8), 2.7, .2, .0);
  // willows on the bank, and a bench under them
  add(g, tree("willow", 1.15), -2.4, .16, -1.4);
  add(g, tree("willow", .95), 1.9, .16, -1.7);
  bench(g, -.6, -1.5, 1.6, 0, .4);
  // the turtle and its ripple, out on the water in front of the embankment: the reacting subject
  const turtle = add(g, new THREE.Group(), -.3, .08, 1.15);
  const shell = add(turtle, ball(.26, "#3F5A3A", 9), 0, 0, 0); shell.scale.set(1.35, .42, 1.0);
  add(turtle, ball(.09, "#4F6A4A", 6), .3, .02, 0);
  turtle.visible = false;
  const rings = ripples(g, 4, -.3, .10, 1.15, .28, "#BFDCE0");
  rings[0].name = "hoan-kiem-ripple";
  rings[0].visible = true;
  // the walkers who stop and look, and a woman with a tea tray on the bench
  const walkerA = add(g, resident("north", false), -2.6, .16, -.55);
  const walkerB = add(g, resident("northWoman", false), 2.4, .16, -.75);
  const walkA = pacer(walkerA, V(-2.6, .16, -.55), V(2.4, .16, -.55), .3, .5);
  const walkB = pacer(walkerB, V(2.4, .16, -.75), V(-2.2, .16, -1.1), .26, 2.1);
  const sitter = seatFigure(g, resident("northWoman", false), -.6, -1.55, .2, .4);
  return life(g, "hoanKiem", [walkerA, sitter, walkerB], (t, k) => {
    // always on: one ring travels out over the water, slowly, without a click
    const idle = (t * .18) % 1;
    rings.forEach((r, i) => {
      const u = k > 0 ? clamp01(beat(k, 0, .95) > 0 ? (1 - k) * 1.5 - i * .14 : 0) : clamp01(idle - i * .2);
      r.visible = u > .02 && u < 1;
      r.scale.setScalar(.5 + u * 2.6);
      (r.material as THREE.MeshStandardMaterial).opacity = .6 * (1 - u);
      r.position.y = .10;
    });
    // 1. the water first: the turtle's shell breaks the surface and goes down again
    const surface = beat(k, 0, .7);
    turtle.visible = surface > .05;
    turtle.position.y = .02 + surface * .10;
    turtle.rotation.y = Math.PI * .2 + surface * .5;
    // 2. then the walkers look at it; 3. the woman on the bench turns her head, and both resume
    walkA(t); walkB(t);
    upper(walkerA).rotation.y = Math.sin(t * .45) * .09 + beat(k, .3, 1) * .7;
    upper(sitter).rotation.y = .1 + beat(k, .45, 1) * .5;
  });
}

/**
 * motorbikes — the street carriers, which is what this id shows in 1900 to 1931: three carriers with shoulder poles, two
 * handcarts and two bicycles at the corner of the guild street. A click shifts a pole across the shoulders and rings a bell.
 */
export function streetCarriersVn(): P {
  const g = group();
  add(g, cyl(2.6, 2.6, .03, VNC.dat, 22), 0, .015, 0);
  // the pole carrier who answers the click, standing with his load at rest on the ground
  const carrier = add(g, resident("carrier", false), .1, 0, 1.55); carrier.rotation.y = 2.5;
  const pole = add(upper(carrier), new THREE.Group(), .16, .42, .04); pole.name = "carrier-pole";
  add(pole, cyl(.022, .022, 1.7, VNC.tre, 5), 0, 0, 0).rotation.x = Math.PI / 2;
  const loads = [-.7, .7].map((z) => {
    const hook = add(pole, new THREE.Group(), 0, 0, z);
    add(hook, cyl(.01, .01, .34, VNC.laKho, 3), 0, -.17, 0);
    const bk = basket(hook, 0, -.52, 0, .2, .18, { color: z < 0 ? VNC.rau : "#EFE3C0", n: 5, size: .055 });
    return { hook, bk };
  });
  // a second carrier walking the lane with her pole, and a third resting on his heels
  const walkerCarrier = add(g, resident("carrier", false), 2.2, 0, -.6);
  const pole2 = add(upper(walkerCarrier), cyl(.02, .02, 1.5, VNC.tre, 4), .16, .42, .04); pole2.rotation.x = Math.PI / 2;
  for (const z of [-.6, .6]) { add(upper(walkerCarrier), cyl(.01, .01, .3, VNC.laKho, 3), .16, .26, z); basket(upper(walkerCarrier), .16, .0, z, .18, .16, { color: "#E3C86A", n: 4, size: .05 }); }
  const walk = pacer(walkerCarrier, V(2.2, 0, -.6), V(-2.2, 0, -1.1), .3, .8);
  const resting = stool(g, -1.5, -.2, 1.9, "south", .24);
  // two handcarts and two bicycles, standing clear of the lane
  const cartA = add(g, handcart(VNC.rau), -2.1, 0, -1.4); cartA.rotation.y = .6;
  const cartB = add(g, handcart("#E3C86A"), 2.0, 0, 1.4); cartB.rotation.y = -1.1;
  const bikeA = add(g, bicycle("#2E3848"), -2.2, 0, .8); bikeA.rotation.y = 1.3;
  const bikeB = add(g, bicycle("#3A4A3A"), 1.9, 0, -.2); bikeB.rotation.y = -.4;
  const bellA = bikeA.userData.bell as THREE.Mesh;
  // a kettle stand at the corner, so the carriers have somewhere to stop
  add(g, box(.7, .5, .5, VNC.go), -2.2, .25, 1.3);
  add(g, cyl(.13, .11, .16, "#8C9096", 12), -2.2, .58, 1.3);
  for (let i = 0; i < 3; i++) add(g, cyl(.04, .035, .06, VNC.sanh, 8), -2.4 + i * .18, .53, 1.55);
  const bystander = add(g, resident("northWoman", false), 1.5, 0, -.7); bystander.rotation.y = Math.PI - 1.9;
  return life(g, "motorbikes", [carrier, bystander, walkerCarrier, resting], (t, k) => {
    // always on: the loads swing gently on their hooks and the walking carrier's baskets ride with her step
    loads.forEach(({ hook }, i) => { hook.rotation.x = Math.sin(t * 1.2 + i * 2) * .05; });
    // 1. the load first: the pole comes up off one shoulder, crosses, and settles on the other
    const shift = beat(k, 0, .72);
    pole.position.set(.16 - shift * .30, .42 + shift * .09, .04);
    pole.rotation.z = shift * .28;
    loads.forEach(({ hook }, i) => { hook.rotation.x += shift * (i ? .22 : -.22); });
    // 2. the carrier's hands change over; 3. the bicycle bell turns one head
    arms(carrier).right.rotation.x = -1.45 + shift * .5;
    arms(carrier).left.rotation.x = -shift * 1.2;
    bellA.rotation.y = beat(k, .4, .9) * Math.sin(t * 30) * .8;
    upper(bystander).rotation.y = beat(k, .5, 1) * .6;
    walk(t);
  });
}

/**
 * stilts — the delta homestead on the wet edge: two houses on posts above the flood line, a plank ladder and the dry step.
 * A click sends a bowl of rice up the ladder from the yard to the platform; the dog watches from the dry step.
 */
export function stiltHomesVn(): P {
  const g = group();
  add(g, box(6.0, .18, 3.4, "#9BAE7A"), 0, .09, -.4);                                   // the raised dry bank the houses stand on
  const houseA = add(g, vnHouse("stilt", 3.0, 2.4, 2.1), -1.4, .18, -1.1);
  const houseB = add(g, vnHouse("stilt", 2.4, 2.0, 1.9), 2.1, .18, -1.5); houseB.rotation.y = -.5;
  void houseA;
  // the ladder from the yard up to the platform of the first house
  const deck = .18 + 1.1 + .12;
  const ladder = add(g, new THREE.Group(), -.35, .18, .35);
  for (const x of [-.24, .24]) add(ladder, cyl(.035, .035, 1.5, VNC.go, 5), x, .72, -.1).rotation.x = -.28;
  for (let i = 0; i < 5; i++) add(ladder, box(.5, .04, .07, VNC.go), 0, .18 + i * .28, .1 - i * .08);
  // the bowl that goes up the ladder: the reacting subject
  const bowl = add(g, new THREE.Group(), -.35, .34, .55); bowl.name = "stilt-bowl";
  add(bowl, cyl(.14, .11, .09, VNC.sanh, 12), 0, .045, 0);
  const heap = add(bowl, ball(.12, "#F7F2E6", 8), 0, .10, 0); heap.scale.y = .5;
  add(bowl, cyl(.008, .008, .2, VNC.go, 4), .05, .13, 0).rotation.z = .4;
  const bowlRest = bowl.position.clone(), bowlTop = V(-.35, deck + .18, -.15);
  // the dry step with the dog on it, the water jars, the drying chillies and the fish trap under the house
  add(g, box(1.0, .2, .6, "#A8996E"), 1.0, .28, 1.0);
  const dog = add(g, new THREE.Group(), 1.0, .38, 1.0);
  const dogBody = add(dog, ball(.17, "#C9A46A", 8), 0, .18, 0); dogBody.scale.set(1.6, .8, .8);
  add(dog, ball(.10, "#C9A46A", 7), .24, .28, 0);
  for (const z of [-.06, .06]) add(dog, cone(.04, .08, "#B08A54", 5), .26, .38, z);
  const dogTail = add(dog, cyl(.02, .015, .22, "#C9A46A", 4), -.26, .22, 0); dogTail.rotation.z = -.7;
  for (const x of [-.12, .12]) for (const z of [-.07, .07]) add(dog, cyl(.03, .03, .16, "#C9A46A", 5), x, .08, z);
  jar(g, -2.6, .18, .6, .24, .5);
  jar(g, -2.2, .18, .9, .2, .42);
  for (let i = 0; i < 3; i++) add(g, box(.9, .02, .3, "#C9302A"), 1.9, deck + .02, .4 + i * .0);
  basket(g, .6, .18, -.2, .26, .22, { color: "#9FB0B8", n: 5, size: .05 });
  // the family: the mother in the yard, the girl on the platform, a grandfather on the step
  const mother = add(g, resident("southWoman", true), -.35, .18, 1.0); mother.rotation.y = Math.PI;
  const girl = add(g, resident("child", false), -.35, deck, -.45); girl.rotation.y = 0;
  const grandfather = seatFigure(g, resident("south", false), 1.55, 1.25, -1.4, .38);
  return life(g, "stilts", [mother, grandfather, girl], (t, k) => {
    // always on: the dog's tail swings and the chillies shift on the platform rail
    dogTail.rotation.z = -.7 + Math.sin(t * 2.6) * .25;
    dog.rotation.y = Math.sin(t * .5) * .12;
    // 1. the bowl first: it rises up the ladder from the mother's hands to the girl's
    const rise = beat(k, 0, .8);
    bowl.position.lerpVectors(bowlRest, bowlTop, rise);
    bowl.rotation.y = rise * 1.2;
    heap.position.y = .10 + Math.sin((1 - k) * 12) * .004 * rise;
    // 2. the mother lifts it, the girl reaches down for it; 3. the dog's head turns to follow
    arms(mother).right.rotation.x = -.5 - rise * 1.1;
    arms(girl).right.rotation.x = -.3 - rise * 1.0;
    upper(girl).rotation.x = rise * .22;
    dog.rotation.y += beat(k, .3, 1) * .5;
  });
}

/**
 * hueCitadelVn — the river face of the walled city: a brick curtain wall, its arched gate and the flag tower above. A click
 * stirs the flag on the tower and the boatman on the bank points once; both settle.
 */
export function hueGateVn(): P {
  const g = group();
  // the curtain wall with its battered face and coping, and the arched gate
  add(g, box(7.0, 2.4, 1.2, "#B9A98A"), 0, 1.2, -1.2);
  add(g, box(7.2, .18, 1.4, "#A8956F"), 0, 2.45, -1.2);
  for (let i = 0; i < 14; i++) add(g, box(.34, .22, .06, "#C4B292"), -3.2 + i * .5, 2.65, -.64);      // the crenellation
  // the gateway stands proud of the wall face, and its head is laid as voussoirs round a half circle, so the arch
  // reads as an arch from the road rather than as a ring standing in front of a square hole
  add(g, box(1.24, 1.35, .5, "#4A4036"), 0, .68, -.6);
  for (let i = 0; i < 9; i++) {
    const a = (Math.PI * i) / 8, r = .72;
    const v = add(g, box(.20, .26, .5, i % 2 ? "#D8CCB0" : "#CCBFA0"), Math.cos(a) * r, 1.35 + Math.sin(a) * r, -.6);
    v.rotation.z = a - Math.PI / 2;
  }
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.58, .58, .46, 16, 1, true, 0, Math.PI), mat("#3F362C", { side: THREE.DoubleSide })), 0, 1.35, -.6).rotation.set(Math.PI / 2, 0, 0);
  for (const x of [-.78, .78]) add(g, box(.22, 1.5, .52, "#D8CCB0"), x, .75, -.6);                     // the jambs
  add(g, box(2.0, .18, .62, "#A8956F"), 0, 2.22, -.6);                                                 // the hood over the gateway
  add(g, box(1.6, .2, 1.5, "#A8956F"), 0, 2.05, -1.2);
  // the flag tower on the wall, with the flag on its staff: the reacting subject
  const tower = add(g, new THREE.Group(), 0, 2.54, -1.2);
  for (let i = 0; i < 2; i++) { add(tower, box(2.0 - i * .5, .34, 1.1 - i * .22, "#B9A98A"), 0, .17 + i * .38, 0); add(tower, box(2.1 - i * .5, .08, 1.2 - i * .22, "#A8956F"), 0, .36 + i * .38, 0); }
  add(tower, cyl(.05, .06, .7, VNC.goDam, 8), 0, 1.1, 0);
  const flag = add(tower, new THREE.Group(), .02, 1.22, 0); flag.name = "hue-flag";
  const panels = Array.from({ length: 4 }, (_, i) => add(flag, box(.24, .38, .02, i % 2 ? "#C9A24A" : "#B03A2E"), .12 + i * .24, -.05, 0));
  // the river bank in front, with the mooring post and the boatman on the bank
  add(g, box(7.0, .14, 1.6, "#C9BDA3"), 0, .07, .6);
  add(g, box(7.0, .18, .26, "#A8A092"), 0, .16, 1.45);
  add(g, cyl(.1, .12, .5, VNC.goDam, 8), 2.3, .25, 1.3);
  const boatman = add(g, resident("centre", false), 1.6, .14, 1.0); boatman.rotation.y = -.9;
  const pole = add(arms(boatman).right, cyl(.02, .02, 1.6, VNC.tre, 4), 0, arms(boatman).hand - .1, .1); pole.rotation.x = 1.2;
  const guard = add(g, resident("north", false), -1.4, .14, .9); guard.rotation.y = Math.PI - .3;
  const walker = add(g, resident("northWoman", false), -3.0, .14, 1.1);
  const walk = pacer(walker, V(-3.0, .14, 1.1), V(3.0, .14, 1.1), .3, 1.4);
  return life(g, "hueCitadelVn", [boatman, guard, walker], (t, k) => {
    // always on: the flag breathes on its staff and the boatman's pole rocks a little
    const gust = beat(k, 0, .8);
    panels.forEach((p, i) => {
      const wave = Math.sin(t * (1.4 + gust * 4) - i * .9) * (.06 + gust * .34) * (i + 1) / 4;
      p.rotation.y = wave; p.position.z = wave * .12; p.position.y = Math.sin(t * 1.1 - i) * .012 * (1 + gust * 2);
    });
    flag.rotation.z = Math.sin(t * .7) * .02 + gust * .06;
    pole.rotation.x = 1.2 + Math.sin(t * .6) * .03;
    // 2. the boatman points at the flag; 3. the guard at the gate turns to look, then both settle
    arms(boatman).left.rotation.x = -beat(k, .35, .95) * 1.5;
    upper(boatman).rotation.y = beat(k, .35, .95) * .3;
    upper(guard).rotation.y = -beat(k, .5, 1) * .5;
    walk(t);
  });
}

/**
 * hoiAnQuayVn — the shophouse-to-quay haul: the threshold, the paving, the bollards and the tied sampan against the stone.
 * A click rolls a jar from the threshold down to the quay edge and back to its chock, and the boat stays tied.
 */
export function hoiAnQuayVn(): P {
  const g = group();
  // the shophouse front at the back and the quay paving in front of it
  add(g, box(4.4, 2.6, 1.0, "#E8D9A8"), -.4, 1.3, -2.6);
  add(g, box(4.6, .2, 1.2, VNC.ngoi), -.4, 2.65, -2.6);
  for (let i = 0; i < 13; i++) add(g, cyl(.05, .05, 1.2, VNC.ngoiAm, 6), -2.5 + i * .35, 2.78, -2.6).rotation.x = Math.PI / 2;
  add(g, box(1.2, 1.9, .08, VNC.do), -.4, .95, -2.06);                                  // the open double door
  for (const x of [-1.1, .3]) add(g, box(.1, 1.9, .12, VNC.goDam), x, .95, -2.02);
  sign(g, "HỘI AN", 1.4, .34, -.4, 2.3, -2.02, VNC.vang, VNC.do);
  add(g, box(2.4, .12, .5, "#C4B292"), -.4, .06, -1.9);                                 // the threshold step
  add(g, box(6.4, .14, 3.4, "#EADFBD"), 0, .07, .1);                                    // the quay paving
  add(g, box(.3, .2, 3.4, "#C9BDA3"), -2.9, .17, .1);                                   // the quay edge, down the left side
  for (const z of [-.9, 1.1]) add(g, cyl(.12, .14, .44, "#A8A092", 8), -2.6, .29, z);
  // the jar that is rolled: the reacting subject, on its chock at the threshold
  const jarGroup = jar(g, 1.3, .14, -1.3, .28, .5); jarGroup.name = "hoian-jar";
  const chock = add(g, box(.5, .07, .2, VNC.go), 1.3, .17, -1.05);
  void chock;
  const jarRest = jarGroup.position.clone(), jarQuay = V(-2.3, .14, .5);
  // more jars stacked by the door, the coil of rope and the sampan alongside
  for (const [x, z] of [[2.1, -1.5], [2.4, -1.1]]) jar(g, x, .14, z, .24, .44);
  add(g, ring(.22, .045, "#C9B45A"), -2.6, .16, -1.5).rotation.x = Math.PI / 2;
  const boat = add(g, sampanTied(), -3.6, .0, .3); boat.rotation.y = .06;
  const rope = add(g, cyl(.02, .02, 1.1, "#C9B45A", 5), -3.1, .3, -.6); rope.rotation.set(0, -.4, 1.35);
  // the two porters and the shopkeeper in the doorway
  const porter = add(g, resident("carrier", false), 1.3, .14, -.65); porter.rotation.y = -1.9;
  const porterB = add(g, resident("carrier", false), -1.7, .14, -.95); porterB.rotation.y = -2.9;
  const keeper = add(g, resident("centre", false), -.4, .14, -1.75); keeper.rotation.y = 0;
  const walker = add(g, resident("south", false), 2.6, .14, 1.4);
  const walk = pacer(walker, V(2.6, .14, 1.4), V(-1.2, .14, 1.6), .3, 1.9);
  return life(g, "hoiAnQuayVn", [porter, keeper, porterB, walker], (t, k) => {
    // always on: the sampan rides against the stone and the rope tightens and slackens
    rope.rotation.z = 1.4 + Math.sin(t * .9) * .03;
    // 1. the jar first: it rolls out from the threshold across the paving to the quay and back to its chock
    const roll = beat(k, 0, .84);
    jarGroup.position.lerpVectors(jarRest, jarQuay, roll);
    jarGroup.rotation.z = -roll * 6.0;
    jarGroup.rotation.y = roll * .4;
    // 2. the porter walks it down bent over it; 3. the second porter at the quay reaches for it
    porter.position.set(1.3 - roll * 2.8, .14, -.65 + roll * 1.0);
    porter.rotation.y = -1.9 - roll * .5;
    porter.userData.walk?.(roll * 5.2);
    upper(porter).rotation.x = .1 + roll * .3;
    arms(porterB).left.rotation.x = -beat(k, .45, 1) * 1.1;
    upper(keeper).rotation.y = beat(k, .5, 1) * .4;
    walk(t);
  });
}

/**
 * waterPuppetsVn — the puppet tank at the edge of the lotus lane: a brick rim, shallow water inside it, the screened hut
 * behind on the bank with the puppeteer in it, and the drum. A click sends the dragon puppet up out of the water, turns it
 * once and takes it down again; a child on the rim reacts.
 */
export function waterPuppetsVn(): P {
  const g = group();
  // the tank: a brick rim with a shallow water disc inside it, the stand's own decor water
  add(g, cyl(1.26, 1.26, .16, "#A8956F", 26), 0, .08, 0);                                   // the paved apron the tank sits in
  add(g, ring(1.14, .09, VNC.gach, Math.PI * 2), 0, .20, 0).rotation.x = Math.PI / 2;        // the low brick kerb
  const water = add(g, cyl(1.06, 1.06, .02, "#5E8A82", 26), 0, .17, 0);
  (water.material as THREE.MeshStandardMaterial).transparent = true; (water.material as THREE.MeshStandardMaterial).opacity = .9;
  const rings = ripples(g, 3, 0, .19, .25, .22, "#BFDCE0");
  // the screened hut on the bank behind the tank: the puppeteer stands in it, never in the water
  const hut = add(g, new THREE.Group(), 0, 0, -1.9);
  for (const x of [-1.1, 1.1]) add(hut, cyl(.07, .08, 2.0, VNC.go, 6), x, 1.0, 0);
  add(hut, box(2.4, .14, .5, VNC.go), 0, 2.05, 0);
  for (let i = 0; i < 8; i++) add(hut, box(.26, 1.2, .04, VNC.tre), -.95 + i * .27, 1.35, .2);       // the split bamboo screen
  for (let i = 0; i < 4; i++) add(hut, box(2.3, .04, .3, VNC.laKho), 0, 1.98 - i * .0, -.2 + i * .0);
  for (const side of [-1, 1]) { const r = add(hut, box(2.6, .1, .8, VNC.ngoi), 0, 2.3, side * .35); r.rotation.x = -side * .5; }
  add(hut, box(2.7, .1, .14, VNC.ngoiAm), 0, 2.52, 0);
  sign(hut, "RỐI NƯỚC", 1.3, .3, 0, 1.75, .26, VNC.vang, VNC.do);
  // the dragon puppet: the reacting subject, resting just under the surface
  const dragon = add(g, new THREE.Group(), -.1, .06, .15); dragon.name = "puppet-dragon";
  const segs = Array.from({ length: 4 }, (_, i) => {
    const s = add(dragon, new THREE.Group(), 0, 0, -i * .18);
    add(s, ball(.10 - i * .012, i % 2 ? "#3F8F5A" : "#4F9F6A", 7), 0, 0, 0).scale.set(1, .9, 1.1);
    if (i === 0) {
      add(s, cone(.055, .13, "#C9A24A", 6), 0, .04, .12).rotation.x = 1.3;
      for (const x of [-.05, .05]) add(s, ball(.02, "#B03A2E", 5), x, .06, .06);
      add(s, box(.02, .09, .12, "#C9A24A"), 0, .10, -.02);
    } else add(s, box(.015, .07, .1, "#C9A24A"), 0, .09, 0);
    return s;
  });
  const dragonRest = dragon.position.clone();
  // a second puppet waiting on the rim, the drum and the clappers on the bank
  const farmer = add(g, new THREE.Group(), .85, .24, -.5);
  add(farmer, ball(.09, "#E8C8A8", 7), 0, .1, 0); add(farmer, box(.12, .16, .08, "#3F6B8F"), 0, -.02, 0);
  add(farmer, cone(.11, .07, VNC.la, 10), 0, .18, 0);
  const drum = add(g, new THREE.Group(), -1.9, 0, -.7);
  add(drum, cyl(.3, .3, .44, VNC.do, 16), 0, .5, 0);
  add(drum, cyl(.3, .3, .02, "#E8DCC2", 16), 0, .72, 0);
  for (const x of [-.24, .24]) add(drum, cyl(.05, .06, .5, VNC.goDam, 6), x, .25, 0);
  const stick = add(drum, cyl(.012, .012, .3, VNC.go, 4), .1, .82, .1); stick.rotation.z = .6;
  // the puppeteer behind the screen and the children on the rim
  const puppeteer = add(g, resident("north", true), .3, 0, -2.0); puppeteer.rotation.y = 0;
  const child = add(g, resident("child", false), .9, 0, 1.5); child.rotation.y = Math.PI;
  const childB = add(g, resident("child", false), -.8, 0, 1.6); childB.rotation.y = Math.PI - .3;
  const drummer = add(g, resident("northWoman", false), -1.9, 0, -.05); drummer.rotation.y = Math.PI;
  return life(g, "waterPuppetsVn", [puppeteer, child, drummer, childB], (t, k) => {
    // always on: the water stirs, the waiting puppet bobs and the drumstick taps
    water.position.y = .17 + Math.sin(t * 1.3) * .004;
    farmer.position.y = .24 + Math.sin(t * 1.6) * .012;
    stick.rotation.z = .6 + Math.sin(t * 2.2) * .18 + beat(k, .2, .8) * Math.sin(t * 20) * .5;
    rings.forEach((r, i) => {
      const u = clamp01(beat(k, .1, 1) * 1.2 - i * .18);
      r.visible = u > .03; r.scale.setScalar(.5 + u * 2.2);
      (r.material as THREE.MeshStandardMaterial).opacity = .6 * (1 - u);
    });
    // 1. the puppet first: it rises out of the water, turns once and submerges
    const rise = beat(k, 0, .62), turn = beat(k, .25, .9);
    dragon.position.copy(dragonRest);
    dragon.position.y = dragonRest.y + rise * .52;
    dragon.rotation.y = turn * 3.0;
    segs.forEach((s, i) => { s.position.y = Math.sin(t * 3 - i * .8) * .03 * (1 + rise * 2); s.rotation.z = Math.sin(t * 2.4 - i) * .12 * (1 + turn); });
    // 2. the puppeteer's arms work behind the screen; 3. a child on the rim points at it
    arms(puppeteer).right.rotation.x = -.6 - rise * .7; arms(puppeteer).left.rotation.x = -.5 - turn * .6;
    arms(child).right.rotation.x = -beat(k, .35, .95) * 1.6;
    upper(child).rotation.y = beat(k, .35, .95) * .2;
  });
}

/**
 * benThanhVn — the market's own corner: the gabled front with its clock, the arcade under a tiled roof and the first
 * produce aisle inside it. A click lifts a basket of produce in the aisle and the clock's hands move on one step.
 */
export function benThanhVn(): P {
  const g = group();
  // the hall: a tiled roof carried on an arcade, so from above it reads as a market hall and not a free-standing arcade
  add(g, box(7.6, .16, 5.0, "#D8D0BC"), 0, .08, -.8);
  const bays = 5, w = 7.2;
  for (let i = 0; i <= bays; i++) add(g, box(.34, 2.6, .34, "#E9DCC2"), -w / 2 + (i * w) / bays, 1.3, 1.3);
  for (let i = 0; i < bays; i++) {
    const arch = add(g, new THREE.Mesh(new THREE.CylinderGeometry(w / bays / 2 - .12, w / bays / 2 - .12, .34, 14, 1, false, 0, Math.PI), mat("#E9DCC2")), -w / 2 + ((i + .5) * w) / bays, 2.6, 1.3);
    arch.rotation.set(Math.PI / 2, 0, Math.PI / 2);
  }
  for (const z of [-2.9, 1.3]) add(g, box(w + .5, .26, .4, "#DFD2B6"), 0, 2.85, z);
  for (const x of [-w / 2 - .1, w / 2 + .1]) add(g, box(.34, 2.6, 4.4, "#E9DCC2"), x, 1.3, -.8);
  for (const side of [-1, 1]) { const r = add(g, box(w + .8, .12, 2.6, VNC.gach), 0, 3.3, side * 1.1 - .8); r.rotation.x = side * .42; }
  for (let i = 0; i < 24; i++) for (const side of [-1, 1]) { const tile = add(g, cyl(.05, .05, 2.6, "#A8492A", 6), -w / 2 - .3 + i * .33, 3.3 + Math.abs(side) * .0, side * 1.1 - .8); tile.rotation.set(side * .42, 0, Math.PI / 2); }
  add(g, box(w + .9, .16, .18, VNC.ngoiAm), 0, 3.52, -.8);
  // the gable and the clock over the middle bay: the clock's hands answer second
  const gable = add(g, new THREE.Group(), 0, 2.85, 1.42);
  add(gable, box(2.6, 1.5, .3, "#E9DCC2"), 0, .75, 0);
  add(gable, box(2.9, .16, .4, "#DFD2B6"), 0, 1.55, 0);
  add(gable, cone(1.5, .8, VNC.gach, 4), 0, 1.95, 0).rotation.y = Math.PI / 4;
  const clockFace = add(gable, cyl(.52, .52, .08, "#F3EFE2", 22), 0, .8, .18); clockFace.rotation.x = Math.PI / 2;
  add(gable, ring(.54, .05, VNC.goDam), 0, .8, .2).rotation.x = 0;
  for (let i = 0; i < 12; i++) add(gable, box(.04, .09, .02, VNC.than), Math.sin(i * .524) * .42, .8 + Math.cos(i * .524) * .42, .23).rotation.z = -i * .524;
  const hands = add(gable, new THREE.Group(), 0, .8, .25); hands.name = "ben-thanh-clock";
  const hourHand = add(hands, box(.035, .3, .02, VNC.than), 0, .15, 0);
  const minuteHand = add(hands, box(.025, .42, .02, VNC.than), 0, .21, .012);
  sign(gable, "BẾN THÀNH", 1.9, .3, 0, .18, .18, VNC.voi, VNC.do);
  // the produce aisle under the arcade: trestles, baskets and the reacting subject
  const aisle = add(g, new THREE.Group(), 0, 0, -.2);
  for (const x of [-2.2, 0, 2.2]) { add(aisle, box(1.9, .06, 1.0, VNC.go), x, .82, 0); for (const dx of [-.8, .8]) for (const dz of [-.4, .4]) add(aisle, cyl(.05, .055, .82, VNC.goDam, 5), x + dx, .41, dz); }
  add(g, box(2.0, .06, .9, VNC.go), -1.2, .82, 2.3);                                   // the front stall, out on the pavement
  for (const dx of [-.85, .85]) for (const dz of [-.35, .35]) add(g, cyl(.05, .055, .82, VNC.goDam, 5), -1.2 + dx, .41, 2.3 + dz);
  const produce = add(g, new THREE.Group(), -1.2, .85, 2.3); produce.name = "ben-thanh-produce";
  add(produce, cyl(.32, .27, .24, VNC.tre, 14), 0, .12, 0);
  add(produce, ring(.32, .02, VNC.laKho), 0, .24, 0).rotation.x = Math.PI / 2;
  const fruit = Array.from({ length: 8 }, (_, i) => add(produce, ball(.085, ["#E8A53F", "#C0392B", "#7FBF5A", "#D9A441"][i % 4], 7), Math.cos(i * .8) * .16, .26 + (i % 2) * .06, Math.sin(i * .8) * .16));
  const produceRest = produce.position.clone();
  for (const [x, colour] of [[0, "#7FBF5A"], [2.2, "#E8A53F"]] as [number, string][]) {
    basket(g, x - .4, .85, -.4, .26, .22, { color: colour, n: 6, size: .07 });
    basket(g, x + .5, .85, -.1, .24, .2, { color: "#C0392B", n: 5, size: .06 });
    for (let i = 0; i < 4; i++) add(g, ball(.07, colour, 6), x - .1 + (i % 2) * .16, .92, .1 + Math.floor(i / 2) * .16);
  }
  for (let i = 0; i < 4; i++) add(g, cyl(.02, .02, .5, "#4F7A3A", 4), 1.6 + i * .06, 1.1, -.5);
  // the vendors and the buyers
  const vendor = add(g, resident("southWoman", true), -1.2, 0, 1.75); vendor.rotation.y = 0;
  const vendorB = add(g, resident("southWoman", true), 2.2, 0, -1.1); vendorB.rotation.y = 0;
  const buyer = add(g, resident("south", false), .4, 0, 2.5); buyer.rotation.y = Math.PI - 1.1;
  const buyerB = add(g, resident("north", false), 1.6, 0, .8); buyerB.rotation.y = Math.PI + .3;
  const walker = add(g, resident("southWoman", false), -3.4, 0, 3.2);
  const walk = pacer(walker, V(-3.4, 0, 3.2), V(3.4, 0, 3.2), .32, 1.1);
  return life(g, "benThanhVn", [vendor, buyer, vendorB, buyerB, walker], (t, k) => {
    // always on: the clock's minute hand creeps and the fruit settles in the baskets
    minuteHand.rotation.z = -t * .05;
    hourHand.rotation.z = -t * .004 - .9;
    fruit.forEach((f, i) => { f.position.y = .26 + (i % 2) * .06 + Math.max(0, Math.sin(t * 1.6 + i)) * .006; });
    // 1. the produce first: the basket lifts off the trestle and turns, and the fruit rides in it
    const lift = beat(k, 0, .7);
    produce.position.copy(produceRest);
    produce.position.y = produceRest.y + lift * .34; produce.position.z = produceRest.z + lift * .18;
    produce.rotation.z = lift * .2; produce.rotation.y = lift * .8;
    fruit.forEach((f, i) => { f.position.y += lift * Math.abs(Math.sin(t * 8 + i)) * .06; });
    // 2. the clock's hands move on one step; 3. the buyer looks up at the clock
    minuteHand.rotation.z -= beat(k, .3, .9) * .5;
    arms(vendor).right.rotation.x = -.5 - lift * .9;
    upper(buyer).rotation.x = -beat(k, .5, 1) * .2;
    walk(t);
  });
}

// ---------- the registry ----------

const BUILDERS = {
  // rooms, in the order of the blueprint's route: HN1, HN2, CT1, CT2, SG1, MK1
  phoGanhVn, bunChaGrillVn, banhCuonSteamerVn, comCourtyardVn, bunBoHueVn, hueCakeVn,
  caoLauShopVn, miQuangShopVn, breadPateCartVn, huTieuShopVn, banhXeoHearthVn, mekongHomeVn,
  // ingredient and flavour stops
  riceFormsVn, chickenYardVn, herbTraysVn, phuQuocBarrelsVn, phoSpiceTrayVn, lemongrassBasketVn, riverFishBasketVn, lotusTeaTrayVn, caPheStallVn,
  // landmarks
  hoanKiemVn, streetCarriersVn, stiltHomesVn, hueGateVn, hoiAnQuayVn, waterPuppetsVn, benThanhVn,
};
/**
 * Each stand starts its residents from its own place in the profile band, so a stand is built the same way whatever else
 * has been built before it: the clothing still changes from stand to stand, but the people in one stand no longer depend
 * on how many stands a harness or a world happened to build first.
 */
export const VIETNAM_PROPS: Record<string, () => P> = Object.fromEntries(
  Object.entries(BUILDERS).map(([id, make], i) => [id, () => { nth = i * 3; return make(); }]),
);

/** One small food or tool per room object, rendered into the card badge when no painted card art exists. */
export const VIETNAM_ICONS: Record<string, () => P> = {
  hanoiKitchen: () => { const g = group(); add(g, cyl(.32, .24, .26, VNC.sanh, 14), 0, .13, 0); add(g, cyl(.3, .3, .02, VNC.nuoc, 14), 0, .26, 0); for (let i = 0; i < 6; i++) add(g, cyl(.016, .016, .22, VNC.bun, 4), Math.cos(i * 1.05) * .1, .28, Math.sin(i * 1.05) * .1).rotation.set(1.4, i, .2); for (let i = 0; i < 3; i++) add(g, ball(.05, VNC.thit, 6), Math.cos(i * 2.1) * .12, .3, Math.sin(i * 2.1) * .12).scale.set(1.3, .5, 1); add(g, ball(.05, VNC.rau, 5), .1, .32, -.1).scale.set(1, .5, 1.4); add(g, cyl(.035, .035, .02, "#6B3A1A", 8), .42, .02, .2); return g; },
  bunChaVn: () => { const g = group(); for (const z of [-.08, .08]) add(g, cyl(.012, .012, .6, VNC.tre, 5), 0, .12, z).rotation.z = Math.PI / 2; for (let i = 0; i < 4; i++) add(g, ball(.07, VNC.thit, 6), -.2 + i * .13, .12, 0).scale.set(1, .55, 1.5); add(g, cyl(.12, .1, .08, VNC.sanh, 10), .42, .04, .18); add(g, cyl(.11, .11, .015, VNC.nuoc, 10), .42, .08, .18); for (let i = 0; i < 3; i++) add(g, ball(.05, VNC.rau, 5), -.3 + i * .1, .03, -.25).scale.set(1, .5, 1.4); return g; },
  banhCuonVn: () => { const g = group(); for (let i = 0; i < 4; i++) { const r = add(g, cyl(.045, .045, .26, "#F1EADA", 10), -.14 + (i % 2) * .16, .05 + Math.floor(i / 2) * .09, -.08 + Math.floor(i / 2) * .12); r.rotation.z = Math.PI / 2; } add(g, cyl(.26, .24, .02, VNC.laChuoi, 14), 0, .02, 0); for (let i = 0; i < 5; i++) add(g, box(.03, .012, .03, "#C08A3A"), -.1 + i * .05, .2, -.02); add(g, cyl(.08, .07, .06, VNC.sanh, 10), .4, .03, .18); return g; },
  comVongVn: () => { const g = group(); add(g, cyl(.3, .3, .04, VNC.tre, 16), 0, .02, 0); const heap = add(g, ball(.24, VNC.com, 9), 0, .06, 0); heap.scale.y = .45; add(g, cyl(.16, .16, .01, "#4F8A3A", 12), .34, .02, .2); for (let i = 0; i < 4; i++) add(g, ball(.03, VNC.com, 5), .3 + Math.cos(i * 1.6) * .07, .05, .2 + Math.sin(i * 1.6) * .07); add(g, cyl(.012, .012, .24, "#D9C088", 4), -.28, .06, .24).rotation.z = Math.PI / 2; return g; },
  hueKitchenVn: () => { const g = group(); add(g, cyl(.3, .22, .24, VNC.sanh, 14), 0, .12, 0); add(g, cyl(.28, .28, .02, "#C2551F", 14), 0, .24, 0); for (let i = 0; i < 5; i++) add(g, cyl(.015, .015, .2, VNC.bun, 4), Math.cos(i * 1.2) * .1, .26, Math.sin(i * 1.2) * .1).rotation.set(1.4, i, .2); add(g, ball(.06, "#A24A32", 6), .06, .28, .04).scale.set(1.1, .8, 1.1); for (let i = 0; i < 3; i++) add(g, cyl(.018, .022, .26, "#A8C46A", 5), .4, .13, -.16 + i * .05).rotation.z = .2; return g; },
  banhHueVn: () => { const g = group(); for (let i = 0; i < 5; i++) { const d = add(g, cyl(.08, .06, .04, VNC.sanh, 10), -.2 + (i % 3) * .2, .02, -.1 + Math.floor(i / 3) * .2); add(d, cyl(.06, .06, .012, "#F4EFE2", 10), 0, .02, 0); add(d, ball(.025, "#D8814A", 5), 0, .03, 0).scale.set(1.6, .5, 1.6); } add(g, box(.24, .04, .14, VNC.laChuoi), .42, .02, .2); return g; },
  caoLauVn: () => { const g = group(); add(g, cyl(.28, .2, .22, VNC.sanh, 14), 0, .11, 0); for (let i = 0; i < 7; i++) add(g, cyl(.024, .024, .22, "#E3BE62", 5), Math.cos(i * .9) * .1, .24, Math.sin(i * .9) * .1).rotation.set(1.42, i, .15); for (let i = 0; i < 3; i++) add(g, box(.1, .022, .07, "#A8462F"), Math.cos(i * 2.1) * .11, .28, Math.sin(i * 2.1) * .11).rotation.y = i; for (let i = 0; i < 3; i++) add(g, box(.06, .012, .06, "#D9A24A"), Math.cos(i * 1.8 + .6) * .13, .3, Math.sin(i * 1.8 + .6) * .13).rotation.y = i * .6; return g; },
  miQuangVn: () => { const g = group(); add(g, cyl(.3, .2, .2, VNC.sanh, 14), 0, .1, 0); for (let i = 0; i < 7; i++) add(g, cyl(.02, .02, .22, "#E2B24A", 4), Math.cos(i * .9) * .1, .22, Math.sin(i * .9) * .1).rotation.set(1.44, i, .1); add(g, ball(.05, "#E07A4A", 6), .06, .26, .04).scale.set(1.5, .7, .8); add(g, ball(.035, "#F3EEDC", 6), -.06, .26, -.04); for (let i = 0; i < 5; i++) add(g, ball(.018, "#C9954A", 5), Math.cos(i * 1.2) * .12, .27, Math.sin(i * 1.2) * .12); const cr = add(g, box(.16, .012, .12, "#E9DCB2"), 0, .3, .08); cr.rotation.set(.2, .4, .35); return g; },
  banhMi: () => { const g = group(); const lower = add(g, cyl(.07, .07, .44, VNC.banhMi, 9), 0, .07, 0); lower.rotation.z = Math.PI / 2; add(g, box(.4, .014, .08, VNC.pate), 0, .12, 0); const upper2 = add(g, cyl(.07, .07, .44, VNC.banhMi, 9), 0, .17, -.06); upper2.rotation.set(.0, 0, Math.PI / 2); upper2.rotation.x = -.5; add(g, cyl(.09, .08, .1, "#C9B27A", 10), .38, .05, .18); add(g, cyl(.08, .08, .02, VNC.pate, 10), .38, .1, .18); return g; },
  huTieuVn: () => { const g = group(); add(g, cyl(.3, .22, .22, VNC.sanh, 14), 0, .11, 0); add(g, cyl(.28, .28, .02, "#D8C08A", 14), 0, .23, 0); for (let i = 0; i < 6; i++) add(g, cyl(.014, .014, .2, VNC.bun, 4), Math.cos(i * 1.05) * .1, .25, Math.sin(i * 1.05) * .1).rotation.set(1.4, i, .2); add(g, ball(.045, "#E07A4A", 6), .05, .28, .05).scale.set(1.4, .7, .8); add(g, new THREE.Mesh(new THREE.CylinderGeometry(.11, .09, .12, 12, 1, true), new THREE.MeshStandardMaterial({ color: "#B7BEC4", wireframe: true })), .42, .12, -.16); return g; },
  banhXeoVn: () => { const g = group(); add(g, cyl(.34, .3, .04, "#4A4A4E", 18), 0, .02, 0); const c = add(g, cyl(.3, .3, .02, "#E8C84A", 20), 0, .05, 0); void c; add(g, ring(.29, .02, "#D9A63A"), 0, .07, 0).rotation.x = Math.PI / 2; for (let i = 0; i < 3; i++) add(g, ball(.045, "#E07A4A", 6), Math.cos(i * 2.1) * .14, .08, Math.sin(i * 2.1) * .14).scale.set(1.5, .6, .8); for (let i = 0; i < 4; i++) add(g, cyl(.012, .012, .1, "#F1EADA", 4), Math.cos(i * 1.6 + .5) * .16, .08, Math.sin(i * 1.6 + .5) * .16).rotation.set(0, i, 1.5); add(g, ball(.05, VNC.rau, 5), .42, .04, .2).scale.set(1, .5, 1.4); return g; },
  mekongKitchenVn: () => { const g = group(); add(g, cyl(.26, .21, .24, "#8A4A2A", 14), 0, .12, 0); add(g, ring(.26, .022, "#7A3A1A"), 0, .24, 0).rotation.x = Math.PI / 2; add(g, cyl(.23, .23, .02, "#6B3A1A", 14), 0, .23, 0); for (let i = 0; i < 3; i++) add(g, cyl(.08, .08, .07, "#D8C2A2", 10), Math.cos(i * 2.1) * .09, .26, Math.sin(i * 2.1) * .09); add(g, cyl(.12, .1, .1, VNC.sanh, 12), .42, .05, .18); const heap = add(g, ball(.1, "#F7F2E6", 7), .42, .11, .18); heap.scale.y = .55; return g; },
};
