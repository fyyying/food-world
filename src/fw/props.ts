/**
 * Procedural miniature props for the China world: clay, wood, tile and paper.
 * Builders return a Group; userData.tick(t, dt) animates, userData.poke() reacts to a click,
 * userData.steam / smoke give a local point where puffs rise.
 */
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { wobble } from "../world/noise";

/** A little speech bubble that pops over an object for a moment. */
export function bubble(g: THREE.Object3D, text: string, y: number, ms = 1500) {
  const el = document.createElement("div");
  el.className = "bubble";
  el.textContent = text;
  const o = new CSS2DObject(el); o.position.set(0, y, 0); g.add(o);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => g.remove(o), 300); }, ms);
}
/** Reaction clock: poke() sets it to 1, tick() decays it; animations read it as intensity. */
function reaction(rate = 1.1) {
  let k = 0;
  return { poke: () => { k = 1; }, step: (dt: number) => { k = Math.max(0, k - dt * rate); return k; }, get k() { return k; } };
}

export const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, metalness: 0, ...extra });
const smooth = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });

export const C = {
  wood: "#a5713f", woodDark: "#6e4a2c", woodRed: "#9b3b2e", tile: "#3f434b", tileGlazed: "#c9952b", tileGreen: "#4f7d63",
  wall: "#f3ebdc", wallWarm: "#e9d7b8", brick: "#b9ab98", red: "#c0392b", redDark: "#8e2a22", gold: "#d9a441",
  green: "#6f9b57", greenDark: "#4d7a44", leaf: "#7fb069", clay: "#8a5a3c", straw: "#d9bf7a", soil: "#7d5a3d",
  water: "#8fc4c9", stone: "#a09d95", stoneDark: "#7d7a72", skin: "#f2c9a4", pinkPig: "#e9a9a0", cowWhite: "#f4efe6",
  cowBrown: "#6f4a35", buffalo: "#4d4a4a", iron: "#3a3a3f", steel: "#8c9096", white: "#faf6ee",
};

export type P = THREE.Group & { userData: { tick?: (t: number, dt: number) => void; poke?: () => void; steam?: THREE.Vector3; smoke?: THREE.Vector3 } };
const group = (): P => new THREE.Group() as P;
export function add<T extends THREE.Object3D>(g: THREE.Object3D, o: T, x = 0, y = 0, z = 0): T {
  o.position.set(x, y, z);
  o.traverse((m) => { if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  g.add(o);
  return o;
}
const box = (w: number, h: number, d: number, color: string) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const cyl = (rt: number, rb: number, h: number, color: string, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
const cone = (r: number, h: number, color: string, seg = 8) => new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
const ball = (r: number, color: string, seg = 8) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color));

let seed = 7;
export const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];

// ---------- textures (tiny canvases, repeated) ----------

let tileTex: THREE.Texture | null = null;
function roofTiles(): THREE.Texture {
  if (tileTex) return tileTex;
  const c = document.createElement("canvas"); c.width = 64; c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = "rgba(0,0,0,0.28)"; ctx.lineWidth = 2;
  for (let y = 8; y < 64; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(64, y); ctx.stroke(); }
  ctx.strokeStyle = "rgba(0,0,0,0.16)"; ctx.lineWidth = 1.5;
  for (let y = 0; y < 64; y += 16) for (let x = (y / 16) % 2 ? 8 : 0; x < 64; x += 16) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 16); ctx.stroke(); }
  tileTex = new THREE.CanvasTexture(c);
  tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping;
  return tileTex;
}
let awningTex: Map<string, THREE.Texture> = new Map();
function stripes(color: string): THREE.Texture {
  const hit = awningTex.get(color); if (hit) return hit;
  const c = document.createElement("canvas"); c.width = 64; c.height = 16;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fbf6ea"; ctx.fillRect(0, 0, 64, 16);
  ctx.fillStyle = color; for (let x = 0; x < 64; x += 16) ctx.fillRect(x, 0, 8, 16);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  awningTex.set(color, t); return t;
}

/** A striped cloth awning on a light frame, like the market stalls. */
export function awning(w: number, d: number, color: string, sag = 0.1): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(w, d, 8, 4);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i) / (w / 2); pos.setZ(i, -sag * (1 - x * x)); } // gentle sag between the poles
  geo.computeVertexNormals();
  const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: stripes(color), side: THREE.DoubleSide, roughness: 1 }));
  cloth.material.map!.repeat.set(Math.max(2, Math.round(w)), 1);
  cloth.rotation.x = -Math.PI / 2 + 0.12; cloth.castShadow = true; cloth.receiveShadow = true;
  g.add(cloth);
  // scalloped front edge
  for (let i = 0; i < Math.round(w * 2); i++) add(g, cone(0.12, 0.14, color, 4), -w / 2 + 0.25 + i * (w - 0.5) / Math.max(1, Math.round(w * 2) - 1), -0.08, d / 2 - 0.02).rotation.x = Math.PI;
  return g;
}

// ---------- the Chinese roof ----------

/**
 * Hipped roof with concave slopes and lifted corners, the silhouette that says "China" from any distance.
 * `w`×`d` footprint (with overhang already included), `h` ridge height.
 */
export function chineseRoof(w: number, d: number, h: number, color = C.tile, lift = 0.32): THREE.Group {
  const g = new THREE.Group();
  const nx = 14, nz = 10;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const ridgeHalf = Math.max(0, (w - d) / 2);
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    const x = (i / nx - 0.5) * w, z = (j / nz - 0.5) * d;
    const tx = Math.min(1, Math.max(0, Math.abs(x) - ridgeHalf) / (d / 2)), tz = Math.abs(z) / (d / 2);
    const t = Math.max(tx, tz);
    let y = h * Math.pow(1 - t, 1.45);
    const corner = Math.max(0, tx + tz - 1.3);
    y += lift * corner * corner * 6;
    pos.push(x, y, z); uv.push((x / w + 0.5) * (w / 1.2), (z / d + 0.5) * (d / 1.2));
  }
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c2 = a + nx + 1, d2 = c2 + 1;
    idx.push(a, c2, b, b, c2, d2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const roof = new THREE.Mesh(geo, smooth(color, { map: roofTiles(), side: THREE.DoubleSide }));
  roof.castShadow = true; roof.receiveShadow = true;
  g.add(roof);
  // underside board so the eave has thickness
  const under = new THREE.Mesh(geo.clone(), mat(C.woodDark, { side: THREE.BackSide }));
  under.position.y = -0.08; g.add(under);
  // ridge with upturned ends
  const ridgeLen = Math.max(0.6, ridgeHalf * 2 + 0.4);
  add(g, box(ridgeLen, 0.16, 0.22, color === C.tile ? "#55595f" : color), 0, h + 0.02, 0);
  for (const s of [-1, 1]) { const orn = add(g, cone(0.12, 0.35, color === C.tile ? "#55595f" : C.gold, 5), s * (ridgeLen / 2), h + 0.2, 0); orn.rotation.z = -s * 0.5; }
  return g;
}

/** Octagonal pavilion / pagoda roof with a concave sweep. */
export function pavilionRoof(r: number, h: number, color = C.tile, segs = 8): THREE.Group {
  const g = new THREE.Group();
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector2(r * (1 - t) + 0.02, h * Math.pow(t, 1.6) + (i === 0 ? 0.25 : 0))); }
  const geo = new THREE.LatheGeometry(pts, segs);
  const m = new THREE.Mesh(geo, smooth(color, { map: roofTiles(), side: THREE.DoubleSide }));
  m.castShadow = true; m.receiveShadow = true;
  g.add(m);
  add(g, ball(0.12, C.gold, 8), 0, h + 0.3, 0);
  return g;
}

function lattice(w: number, h: number): THREE.Group {
  const g = new THREE.Group();
  add(g, box(w, h, 0.05, "#3b2a22"));
  for (let i = 1; i < 3; i++) add(g, box(0.03, h, 0.07, C.wood), -w / 2 + (i * w) / 3, 0, 0);
  for (let i = 1; i < 3; i++) add(g, box(w, 0.03, 0.07, C.wood), 0, -h / 2 + (i * h) / 3, 0);
  return g;
}

export function lantern(scale = 1): P {
  const g = group();
  const body = add(g, ball(0.22 * scale, C.red, 10), 0, -0.05 * scale, 0);
  body.scale.y = 0.85;
  add(g, cyl(0.09 * scale, 0.09 * scale, 0.05, C.gold, 8), 0, 0.15 * scale, 0);
  add(g, cyl(0.07 * scale, 0.07 * scale, 0.05, C.gold, 8), 0, -0.25 * scale, 0);
  add(g, cyl(0.012, 0.012, 0.22 * scale, C.gold, 4), 0, -0.38 * scale, 0);
  add(g, cyl(0.01, 0.01, 0.3 * scale, C.woodDark, 4), 0, 0.3 * scale, 0);
  const phase = rnd() * 6;
  g.userData.tick = (t) => { g.rotation.z = Math.sin(t * 1.6 + phase) * 0.1; g.rotation.x = Math.cos(t * 1.1 + phase) * 0.05; };
  return g;
}

/** A house in the Chinese vernacular: timber frame or whitewashed walls, curved tiled roof, red door, lanterns. */
export function house(style: "sichuan" | "jiangnan" | "northern", w = 3, d = 2.4, h = 1.8, storeys = 1): P {
  const g = group();
  const WALLS = { sichuan: [C.wallWarm, "#b98a5a", "#8f6540", "#e3cfae", "#a87a4e"], jiangnan: [C.wall, "#faf5ea", "#ece3cf"], northern: [C.brick, "#a89c8a", "#c4b6a1"] };
  const ROOFS = { sichuan: [C.tile, "#4a4038", "#35383f", "#5a4a40"], jiangnan: [C.tile, "#2f3238", "#454a54"], northern: ["#4a4d55", "#5c5a5a", "#6b6560"] };
  const wallColor = pick(WALLS[style]);
  const roofColor = pick(ROOFS[style]);
  let baseY = 0;
  for (let s = 0; s < storeys; s++) {
    const ww = w - s * 0.5, dd = d - s * 0.4, hh = s === 0 ? h : h * 0.8;
    add(g, box(ww, hh, dd, wallColor), 0, baseY + hh / 2, 0);
    // timber posts and beams (Sichuan) or dark trim (Jiangnan)
    const trim = style === "sichuan" ? (wallColor === C.wallWarm || wallColor === "#e3cfae" ? C.woodDark : "#4a3222") : style === "jiangnan" ? "#3b3f45" : "#6a5c4a";
    for (const x of [-ww / 2 + 0.08, ww / 2 - 0.08]) for (const z of [-dd / 2 + 0.03, dd / 2 - 0.03]) add(g, box(0.14, hh, 0.14, trim), x, baseY + hh / 2, z);
    add(g, box(ww + 0.02, 0.12, dd + 0.02, trim), 0, baseY + hh - 0.06, 0);
    // windows
    const win = lattice(0.55, 0.5);
    add(g, win, ww / 4, baseY + hh * 0.58, dd / 2 + 0.01);
    if (s === 0) add(g, lattice(0.55, 0.5), -ww / 4, baseY + hh * 0.58, dd / 2 + 0.01);
    else add(g, box(ww * 0.9, 0.06, 0.3, trim), 0, baseY + 0.25, dd / 2 + 0.12); // balcony rail
    baseY += hh;
    if (s < storeys - 1) add(g, chineseRoof(ww + 0.9, dd + 0.9, 0.5, roofColor, 0.22), 0, baseY - 0.05, 0);
  }
  add(g, chineseRoof(w + 1.1 - (storeys - 1) * 0.5, d + 1.0 - (storeys - 1) * 0.4, style === "northern" ? 1.0 : 1.25, roofColor), 0, baseY - 0.02, 0);
  // door with couplets and a pair of lanterns
  add(g, box(0.62, h * 0.6, 0.06, style === "jiangnan" ? C.woodDark : C.woodRed), 0, h * 0.3, d / 2 + 0.03);
  for (const x of [-0.42, 0.42]) add(g, box(0.1, h * 0.55, 0.02, C.red), x, h * 0.33, d / 2 + 0.05);
  for (const x of [-0.75, 0.75]) { const l = lantern(0.7); add(g, l, x, h - 0.15, d / 2 + 0.3); g.userData.tick = tickChildren(g); }
  // steps
  add(g, box(1.0, 0.12, 0.5, C.stone), 0, 0.06, d / 2 + 0.3);
  // a third of the houses have a chimney with a thread of smoke
  if (rnd() < 0.35) { const cx = w / 2 - 0.5, cz = -d / 4; add(g, box(0.34, 0.9, 0.34, "#5a5550"), cx, baseY + 0.9, cz); g.userData.smoke = new THREE.Vector3(cx, baseY + 1.4, cz); }
  return g;
}

const tickChildren = (g: THREE.Object3D) => (t: number, dt: number) => g.traverse((c) => { if (c !== g && (c as P).userData.tick && !(c as P).userData.__ticked) (c as P).userData.tick!(t, dt); });

/** A temple: stone platform, red columns, double-eave glazed roof, incense burner and stone lions. */
export function temple(): P {
  const g = group();
  add(g, box(9, 0.6, 7, C.stone), 0, 0.3, 0);
  add(g, box(7.6, 0.3, 5.6, C.stoneDark), 0, 0.75, 0);
  const wallH = 2.6;
  add(g, box(5.4, wallH, 3.6, C.redDark), 0, 0.9 + wallH / 2, -0.4);
  for (let i = 0; i < 6; i++) add(g, cyl(0.16, 0.18, wallH, C.red, 10), -3.0 + i * 1.2, 0.9 + wallH / 2, 1.8);
  for (const x of [-3.0, 3.0]) add(g, cyl(0.16, 0.18, wallH, C.red, 10), x, 0.9 + wallH / 2, -2.2);
  add(g, box(6.6, 0.28, 4.6, C.gold), 0, 0.9 + wallH, -0.2);
  add(g, chineseRoof(8.6, 6.4, 0.9, C.tileGlazed, 0.45), 0, 0.9 + wallH + 0.2, -0.2);
  add(g, box(3.6, 1.3, 2.6, C.redDark), 0, 0.9 + wallH + 1.6, -0.4);
  add(g, chineseRoof(5.6, 4.4, 1.3, C.tileGlazed, 0.5), 0, 0.9 + wallH + 2.25, -0.4);
  // door, plaque
  add(g, box(1.2, 1.7, 0.08, "#5a1f18"), 0, 0.9 + 0.85, 1.42);
  add(g, box(1.6, 0.4, 0.06, "#1f2430"), 0, 0.9 + 2.3, 1.45);
  add(g, box(1.4, 0.25, 0.02, C.gold), 0, 0.9 + 2.3, 1.49);
  // incense burner
  add(g, cyl(0.45, 0.35, 0.6, C.iron, 10), 0, 1.2, 3.0);
  for (const x of [-0.3, 0.3]) add(g, cyl(0.06, 0.06, 0.5, C.iron, 6), x, 1.55, 3.0);
  add(g, chineseRoof(1.3, 1.3, 0.35, C.tile, 0.2), 0, 1.9, 3.0);
  g.userData.smoke = new THREE.Vector3(0, 1.7, 3.0);
  // stone lions
  for (const x of [-2.4, 2.4]) { const lion = group(); add(lion, box(0.5, 0.5, 0.7, C.stoneDark), 0, 0.25, 0); add(lion, ball(0.28, C.stoneDark, 7), 0, 0.68, 0.2); add(lion, box(0.7, 0.3, 0.9, C.stone), 0, -0.15, 0); add(g, lion, x, 0.75, 3.4); }
  // lanterns on the columns
  for (const x of [-1.8, 1.8]) add(g, lantern(1.1), x, 0.9 + wallH - 0.5, 2.2);
  g.userData.tick = tickChildren(g);
  return g;
}

export function pagoda(levels = 5): P {
  const g = group();
  add(g, cyl(2.4, 2.6, 0.5, C.stone, 8), 0, 0.25, 0);
  let y = 0.5;
  for (let i = 0; i < levels; i++) {
    const r = 1.6 - i * 0.22, hh = 1.1 - i * 0.06;
    add(g, cyl(r * 0.85, r * 0.85, hh, i % 2 ? C.wall : C.wallWarm, 8), 0, y + hh / 2, 0);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; add(g, box(0.1, hh, 0.1, C.red), Math.cos(a) * r * 0.86, y + hh / 2, Math.sin(a) * r * 0.86); }
    add(g, box(0.3, 0.32, 0.04, "#3b2a22"), 0, y + hh * 0.55, r * 0.86);
    y += hh;
    add(g, pavilionRoof(r + 0.7, 0.55, C.tile), 0, y - 0.1, 0);
    y += 0.2;
  }
  add(g, cone(0.14, 1.2, C.gold, 6), 0, y + 0.8, 0);
  return g;
}

/** Paifang: the ceremonial gate at the head of a street. */
export function gate(): P {
  const g = group();
  for (const x of [-2.2, -0.75, 0.75, 2.2]) { add(g, cyl(0.16, 0.18, 3.2, C.red, 10), x, 1.6, 0); add(g, box(0.5, 0.3, 0.5, C.stone), x, 0.15, 0); }
  add(g, box(5.2, 0.28, 0.5, C.woodRed), 0, 3.0, 0);
  add(g, box(5.2, 0.2, 0.4, C.gold), 0, 3.35, 0);
  add(g, chineseRoof(2.4, 1.6, 0.6, C.tileGlazed, 0.3), 0, 3.5, 0);
  for (const x of [-1.5, 1.5]) add(g, chineseRoof(1.6, 1.4, 0.45, C.tileGlazed, 0.25), x, 3.4, 0);
  add(g, box(1.2, 0.4, 0.06, "#1f2430"), 0, 2.6, 0.3);
  return g;
}

export function lanternString(len: number, n = 5): P {
  const g = group();
  const rope = new THREE.CatmullRomCurve3([new THREE.Vector3(-len / 2, 0, 0), new THREE.Vector3(0, -0.35, 0), new THREE.Vector3(len / 2, 0, 0)]);
  add(g, new THREE.Mesh(new THREE.TubeGeometry(rope, 12, 0.015, 4), mat(C.woodDark)));
  for (let i = 0; i < n; i++) { const p = rope.getPoint((i + 0.5) / n); add(g, lantern(0.75), p.x, p.y - 0.35, p.z); }
  g.userData.tick = tickChildren(g);
  return g;
}

/** A golden dragon: body of scaled segments with a crest, animated as a slow undulating flight around `radius`. */
export function dragon(opts: { radius: number; height: number; speed?: number; segments?: number; poles?: boolean }): P {
  const g = group();
  const n = opts.segments ?? 22, speed = opts.speed ?? 0.25;
  const segs: THREE.Mesh[] = [];
  const bodyMat = mat("#e0a52c", { roughness: 0.55, metalness: 0.15 });
  for (let i = 0; i < n; i++) {
    const r = 0.34 * (1 - i / n) + 0.12;
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 9, 7), bodyMat);
    s.castShadow = true;
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), mat(C.red));
    fin.position.y = r + 0.1; s.add(fin);
    if (i % 3 === 1) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.45, 5), bodyMat); leg.position.set(0, -r, 0.15); leg.rotation.x = 0.4; s.add(leg); }
    g.add(s); segs.push(s);
  }
  // head
  const head = new THREE.Group();
  add(head, box(0.7, 0.5, 0.55, "#e0a52c"), 0.1, 0, 0);
  add(head, box(0.45, 0.28, 0.5, C.red), 0.5, -0.12, 0);
  for (const z of [-0.18, 0.18]) { add(head, ball(0.1, C.white, 6), 0.3, 0.2, z); add(head, ball(0.05, "#1f1f1f", 5), 0.36, 0.2, z); add(head, cone(0.06, 0.5, C.gold, 5), -0.1, 0.45, z).rotation.x = z * 1.5; }
  for (const z of [-0.12, 0.12]) { const w = add(head, cyl(0.012, 0.012, 0.9, C.white, 4), 0.6, -0.1, z); w.rotation.z = 1.2; w.rotation.x = z * 3; }
  add(head, ball(0.12, C.red, 6), 0.75, 0.05, 0);
  const mane = add(head, ball(0.32, C.red, 7), -0.25, 0.15, 0); mane.scale.set(0.6, 1, 1.1);
  g.add(head);
  const poles: THREE.Mesh[] = [];
  if (opts.poles) for (let i = 0; i < 5; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 4), mat(C.woodDark)); g.add(p); poles.push(p); const d = person(pick(["#c0392b", "#d9a441", "#2f5d3f", "#3f6b8f"])); g.add(d); p.userData.person = d; }
  g.userData.tick = (t) => {
    const th = t * speed;
    for (let i = 0; i <= n; i++) {
      const a = th - i * 0.13;
      const x = Math.cos(a) * opts.radius, z = Math.sin(a) * opts.radius * (opts.poles ? 0.45 : 0.8);
      const y = opts.height + Math.sin(a * 3 + t) * (opts.poles ? 0.35 : 0.8) + (opts.poles ? 0 : Math.cos(a * 2) * 0.4);
      if (i === 0) { head.position.set(x, y, z); head.lookAt(Math.cos(a + 0.2) * opts.radius, y, Math.sin(a + 0.2) * opts.radius * (opts.poles ? 0.45 : 0.8)); head.rotateY(Math.PI / 2 + Math.PI); }
      else { const s = segs[i - 1]; s.position.set(x, y, z); s.lookAt(x + Math.sin(a), y, z - Math.cos(a)); }
    }
    poles.forEach((p, k) => {
      const s = segs[Math.floor((k + 0.5) * (n / poles.length))];
      const handY = 0.95, topY = s.position.y + 0.05;           // from the dancer's raised hands up into the body segment
      p.position.set(s.position.x, (handY + topY) / 2, s.position.z); p.scale.y = Math.max(0.3, topY - handY);
      const d = p.userData.person as P;
      const prev = d.position.clone();
      d.position.set(s.position.x, 0, s.position.z + 0.25);
      const dx = d.position.x - prev.x, dz = d.position.z - prev.z;
      if (dx * dx + dz * dz > 1e-6) d.rotation.y = Math.atan2(dx, dz);
      (d.userData as { walk?: (t: number) => void }).walk?.(t * 1.6 + k);   // running, not sliding
    });
  };
  return g;
}

/** A loose flock of birds circling; each bird is two flapping wings. */
export function birds(n = 6, radius = 10, height = 14): P {
  const g = group();
  const wingGeo = new THREE.PlaneGeometry(0.55, 0.16);
  const wm = new THREE.MeshStandardMaterial({ color: "#3a3a44", side: THREE.DoubleSide, roughness: 1 });
  const flock: { b: THREE.Group; l: THREE.Group; r: THREE.Group; off: number; ph: number }[] = [];
  for (let i = 0; i < n; i++) {
    const b = new THREE.Group();
    const l = new THREE.Group(), r = new THREE.Group();
    const lw = new THREE.Mesh(wingGeo, wm), rw = new THREE.Mesh(wingGeo, wm);
    lw.position.x = -0.28; rw.position.x = 0.28; l.add(lw); r.add(rw); b.add(l, r);
    g.add(b); flock.push({ b, l, r, off: i * 0.45, ph: rnd() * 6 });
  }
  g.userData.tick = (t) => {
    for (const f of flock) {
      const a = t * 0.18 + f.off;
      f.b.position.set(Math.cos(a) * radius + Math.sin(f.ph + t * 0.3) * 1.5, height + Math.sin(t * 0.5 + f.ph) * 1.2, Math.sin(a) * radius * 0.7);
      f.b.rotation.y = -a;
      const flap = Math.sin(t * 9 + f.ph) * 0.7;
      f.l.rotation.z = flap; f.r.rotation.z = -flap;
    }
  };
  return g;
}

/** A red-crowned crane, standing in the water. */
export function crane(): P {
  const g = group();
  for (const z of [-0.06, 0.06]) add(g, cyl(0.015, 0.015, 0.6, "#3a3a44", 4), 0, 0.3, z);
  add(g, ball(0.22, C.white, 8), 0, 0.72, 0).scale.set(1.5, 0.9, 1);
  add(g, ball(0.12, "#2a2a30", 6), -0.3, 0.72, 0).scale.set(1.2, 0.7, 0.8);
  const neck = add(g, cyl(0.03, 0.04, 0.6, C.white, 5), 0.32, 1.02, 0); neck.rotation.z = -0.35;
  add(g, ball(0.08, C.white, 6), 0.44, 1.3, 0);
  add(g, ball(0.04, C.red, 5), 0.44, 1.37, 0);
  add(g, cone(0.02, 0.22, "#3a3a44", 4), 0.6, 1.28, 0).rotation.z = -Math.PI / 2;
  const ph = rnd() * 6;
  g.userData.tick = (t) => { neck.rotation.z = -0.35 + Math.sin(t * 0.6 + ph) * 0.15; };
  return g;
}

/** A panda sitting and chewing bamboo. */
export function panda(): P {
  const g = group();
  const white = "#f4f1ea", black = "#26262a";
  add(g, ball(0.42, white, 10), 0, 0.42, 0).scale.set(1, 0.9, 0.9);
  add(g, ball(0.34, black, 9), 0, 0.62, 0).scale.set(1.05, 0.4, 0.9); // shoulder band
  const head = add(g, ball(0.3, white, 10), 0, 1.0, 0.05);
  for (const x of [-0.2, 0.2]) { add(head, ball(0.1, black, 7), x, 0.22, -0.02); add(head, ball(0.085, black, 7), x * 0.6, 0.04, 0.24).scale.set(1, 1.3, 0.6); add(head, ball(0.03, white, 5), x * 0.6, 0.05, 0.29); }
  add(head, ball(0.05, black, 6), 0, -0.08, 0.29);
  for (const x of [-0.42, 0.42]) add(g, ball(0.16, black, 8), x, 0.28, 0.2).scale.set(1, 0.8, 1.2); // legs out front
  const armL = add(g, ball(0.13, black, 8), -0.3, 0.7, 0.25); armL.scale.set(1, 1.6, 1);
  const armR = add(g, ball(0.13, black, 8), 0.3, 0.7, 0.25); armR.scale.set(1, 1.6, 1);
  const stalk = add(g, cyl(0.03, 0.035, 0.9, "#8fbf6a", 5), 0.1, 0.85, 0.42); stalk.rotation.z = 0.5; stalk.rotation.x = -0.4;
  for (let i = 0; i < 3; i++) add(stalk, cone(0.09, 0.28, C.leaf, 4), 0, 0.2 + i * 0.15, 0).rotation.z = 1.2 + i * 0.4;
  const ph = rnd() * 6;
  g.userData.tick = (t) => { head.rotation.x = Math.sin(t * 5 + ph) * 0.06; head.rotation.z = Math.sin(t * 0.7 + ph) * 0.08; stalk.rotation.z = 0.5 + Math.sin(t * 5 + ph) * 0.08; };
  return g;
}

/** A Sichuan teahouse: open pavilion with tables, teapots, a brazier and regulars in bamboo chairs. */
export function teahouse(): P {
  const g = group();
  add(g, box(6.4, 0.3, 5.2, C.stone), 0, 0.15, 0);
  add(g, box(3.2, 2.2, 2.0, C.wallWarm), 0, 1.4, -1.4);
  add(g, box(0.7, 1.4, 0.06, C.woodRed), 0, 1.0, -0.36);
  for (const x of [-2.8, 0, 2.8]) for (const z of [-2.2, 2.2]) add(g, cyl(0.12, 0.14, 2.6, C.woodRed, 8), x, 1.6, z);
  add(g, chineseRoof(7.4, 6.2, 1.2, C.tile, 0.4), 0, 2.85, 0);
  // hanging sign 茶
  add(g, box(0.55, 0.9, 0.06, "#f3e6c8"), 2.6, 2.1, 2.35);
  add(g, box(0.06, 0.06, 0.4, C.woodDark), 2.6, 2.6, 2.35);
  // brazier with a big copper kettle
  add(g, cyl(0.4, 0.45, 0.5, C.iron, 10), -2.2, 0.55, -1.2);
  add(g, ball(0.38, "#b87333", 10), -2.2, 1.1, -1.2).scale.y = 0.8;
  add(g, cyl(0.04, 0.04, 0.5, "#b87333", 6), -1.85, 1.25, -1.2).rotation.z = -0.8;
  g.userData.steam = new THREE.Vector3(-2.2, 1.5, -1.2);
  // tables with pots, cups and regulars
  const tables: [number, number][] = [[-1.5, 0.9], [1.4, 0.6], [0.2, -0.2]];
  const guests: P[] = [];
  tables.forEach(([x, z], k) => {
    add(g, cyl(0.6, 0.6, 0.08, C.wood, 12), x, 0.85, z); add(g, cyl(0.08, 0.1, 0.55, C.woodDark, 6), x, 0.55, z);
    add(g, ball(0.13, "#f7f2e6", 8), x, 0.98, z).scale.y = 0.8; add(g, cyl(0.02, 0.02, 0.2, "#f7f2e6", 4), x + 0.16, 1.02, z).rotation.z = -0.9;
    for (let i = 0; i < 3; i++) { const a = k + i * 2.1; add(g, cyl(0.06, 0.05, 0.06, "#f7f2e6", 8), x + Math.cos(a) * 0.35, 0.92, z + Math.sin(a) * 0.35); }
    for (let i = 0; i < 2; i++) {
      const a = k * 1.3 + i * Math.PI + 0.6;
      const px = x + Math.cos(a) * 1.05, pz = z + Math.sin(a) * 1.05;
      add(g, cyl(0.22, 0.22, 0.4, "#c9b16a", 8), px, 0.5, pz);            // bamboo chair
      add(g, box(0.44, 0.5, 0.06, "#c9b16a"), px - Math.cos(a) * 0.2, 0.95, pz - Math.sin(a) * 0.2).rotation.y = -a;
      const p = person(pick(["#3f6b8f", "#6a7fb0", "#7a4a3a", "#2f5d3f", "#e9d7b8"]), { hat: i === 0 && k === 1 });
      (p.userData as { sit?: () => void }).sit?.();
      add(g, p, px, 0.32, pz).rotation.y = Math.atan2(x - px, z - pz);
      guests.push(p);
    }
  });
  add(g, lantern(0.9), -2.8, 2.3, 2.2); add(g, lantern(0.9), 2.8, 2.3, 2.2);
  // a birdcage hanging from the eave, very Chengdu
  add(g, cyl(0.16, 0.14, 0.3, C.gold, 8), -1.4, 2.2, 2.3); add(g, cyl(0.01, 0.01, 0.35, C.woodDark, 3), -1.4, 2.5, 2.3);
  const cage = g.children[g.children.length - 2];
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(g, "请喝茶~ Have some tea", 3.0, 1500); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    guests.forEach((p, i) => { const up = (p.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.z = Math.sin(t * 0.8 + i * 1.9) * 0.08; up.rotation.y = Math.sin(t * 0.5 + i) * 0.2 + k * 0.4; up.rotation.x = 0.08 + Math.sin(t * 1.7 + i) * 0.04 - k * 0.15; } });  // guests turn and raise cups
    if (cage) { cage.rotation.z = Math.sin(t * 1.4) * 0.05 + k * Math.sin(t * 9) * 0.25; }
    tickChildren(g)(t, dt);
  };
  return g;
}

/** A koi: six body slices that bend with a travelling wave, a tail that lags the body, and side fins. */
export function fish(color = "#e07a3a", pattern = "#f4f1ea", len = 0.9): P {
  const g = group();
  const n = 6;
  const slices: THREE.Group[] = [];
  const skin = new THREE.MeshStandardMaterial({ color, roughness: 0.45 });
  const spot = new THREE.MeshStandardMaterial({ color: pattern, roughness: 0.45 });
  let parent: THREE.Object3D = g;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const seg = new THREE.Group(); seg.position.x = i === 0 ? len * 0.2 : -len / (n - 1);
    const r = 0.11 * len * Math.sin(0.35 + t * 2.2);  // fat in the middle, narrow at both ends
    const m = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.02, r * 1.6), 9, 7), i % 2 ? spot : skin);
    m.scale.set(1.45, 0.55, 1); m.castShadow = false; seg.add(m);
    if (i === 2) { for (const sd of [-1, 1]) { const fin = new THREE.Mesh(new THREE.ConeGeometry(0.05 * len, 0.18 * len, 3), skin); fin.rotation.z = sd * 1.3; fin.position.set(0, -0.02, sd * 0.12 * len); seg.add(fin); } }
    if (i === 1) { const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.04 * len, 0.12 * len, 3), skin); dorsal.position.y = 0.11 * len; seg.add(dorsal); }
    parent.add(seg); parent = seg; slices.push(seg);
  }
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.11 * len, 0.26 * len, 4), skin);
  tail.rotation.z = Math.PI / 2; tail.position.x = -0.16 * len; tail.scale.z = 0.35; parent.add(tail);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02 * len, 6, 5), mat("#1f1f1f"));
  for (const sd of [-1, 1]) { const e = eye.clone(); e.position.set(0.1 * len, 0.03 * len, sd * 0.08 * len); slices[0].add(e); }
  (g.userData as { swim?: (t: number, k: number) => void }).swim = (t, k) => {
    // travelling wave down the spine: head steady, tail swinging widest
    // slow, gentle undulation: barely visible at the head, a soft flick at the tail
    const w = t * 2.6 * Math.min(1.3, k);
    slices.forEach((sg, i) => { sg.rotation.y = Math.sin(w + i * 0.8) * 0.045 * (0.3 + i / n); });
    tail.rotation.y = Math.sin(w + n * 0.8) * 0.16;
  };
  return g;
}

/** Attach an accessory (hat, helmet, shield) to a figure's upper body so it moves with the lean and sway. */
export function wear(p: P, o: THREE.Object3D, x: number, y: number, z: number): THREE.Object3D {
  const u = p.userData as { upper?: THREE.Group; hipY?: number };
  if (!u.upper) return add(p, o, x, y, z);
  return add(u.upper, o, x, y - (u.hipY ?? 0), z);
}

// ---------- people ----------

export function person(shirt = "#3f6b8f", opts: { hat?: boolean; pole?: boolean; apron?: boolean } = {}): P {
  const g = group();
  const s = 0.92 + rnd() * 0.16;
  const trousers = pick(["#3a3a44", "#2f3d5c", "#4a3a32", "#5a5a66"]);
  const hair = pick(["#1f1a18", "#2a1f1c", "#3b2d28"]);
  // legs: thigh hinged at the hip, shin hinged at the knee, shoe on the shin; hips bridge into the torso
  const hipY = 0.44 * s, thighLen = 0.22 * s, shinLen = 0.2 * s;
  add(g, cyl(0.14 * s, 0.13 * s, 0.1 * s, trousers, 8), 0, hipY - 0.03 * s, 0);
  const makeLeg = (x: number) => {
    const thigh = new THREE.Group(); thigh.position.set(x, hipY, 0); g.add(thigh);
    const t = cyl(0.065 * s, 0.06 * s, thighLen, trousers, 6); add(thigh, t, 0, -thighLen / 2, 0);
    add(thigh, ball(0.065 * s, trousers, 6), 0, 0, 0);
    const shin = new THREE.Group(); shin.position.y = -thighLen; thigh.add(shin);
    const sh = cyl(0.06 * s, 0.05 * s, shinLen, trousers, 6); add(shin, sh, 0, -shinLen / 2, 0);
    add(shin, ball(0.06 * s, trousers, 6), 0, 0, 0);
    add(shin, box(0.1 * s, 0.05 * s, 0.17 * s, "#1f1a18"), 0, -shinLen, 0.035 * s);
    return { thigh, shin };
  };
  const legL = makeLeg(-0.08 * s), legR = makeLeg(0.08 * s);
  // upper body hangs off a hip pivot so it can lean, nod and sway without leaving the feet
  const upper = new THREE.Group(); upper.position.y = hipY; g.add(upper);
  const U = (y: number) => y - hipY;
  add(upper, cyl(0.17 * s, 0.13 * s, 0.44 * s, shirt, 8), 0, U(0.63 * s), 0);
  add(upper, ball(0.17 * s, shirt, 8), 0, U(0.82 * s), 0).scale.set(1, 0.45, 0.85);
  const armL = new THREE.Group(); armL.position.set(-0.17 * s, U(0.79 * s), 0); upper.add(armL);
  const armR = new THREE.Group(); armR.position.set(0.17 * s, U(0.79 * s), 0); upper.add(armR);
  for (const a of [armL, armR]) { const m = cyl(0.045 * s, 0.04 * s, 0.36 * s, shirt, 6); add(a, m, 0, -0.18 * s, 0); add(a, ball(0.055 * s, shirt, 6), 0, 0, 0); add(a, ball(0.045 * s, C.skin, 6), 0, -0.37 * s, 0); }
  // head, hair, ears
  add(upper, cyl(0.045 * s, 0.05 * s, 0.08 * s, C.skin, 6), 0, U(0.9 * s), 0);
  add(upper, ball(0.14 * s, C.skin, 9), 0, U(1.04 * s), 0);
  add(upper, ball(0.145 * s, hair, 9), 0, U(1.08 * s), -0.02 * s).scale.set(1, 0.75, 1);
  for (const x of [-0.13, 0.13]) add(upper, ball(0.03 * s, C.skin, 5), x * s, U(1.03 * s), 0);
  if (opts.hat) { add(upper, cone(0.4 * s, 0.28 * s, C.straw, 10), 0, U(1.15 * s), 0); add(upper, cyl(0.41 * s, 0.41 * s, 0.02, "#c9ad68", 12), 0, U(1.02 * s), 0); }
  if (opts.apron) { add(upper, box(0.24 * s, 0.42 * s, 0.04, C.white), 0, U(0.58 * s), 0.15 * s); add(upper, cyl(0.15 * s, 0.15 * s, 0.1 * s, C.white, 8), 0, U(1.18 * s), 0); }
  (g.userData as { upper?: THREE.Group; hipY?: number }).upper = upper;
  (g.userData as { upper?: THREE.Group; hipY?: number }).hipY = hipY;
  (g.userData as { arms?: { left: THREE.Group; right: THREE.Group; hand: number } }).arms = { left: armL, right: armR, hand: -0.37 * s };
  if (opts.pole) {
    // a shoulder pole the traditional way: resting on the right shoulder, running front to back, one hand steadying it
    const pole = add(upper, cyl(0.02, 0.02, 1.8, C.wood, 4), 0.17 * s, U(0.9 * s), 0.05 * s); pole.rotation.x = Math.PI / 2;
    armR.rotation.x = -1.45;                                    // right arm forward, hand on the pole
    for (const z of [-0.8, 0.8]) { add(upper, cyl(0.01, 0.01, 0.4, C.woodDark, 3), 0.17 * s, U(0.72 * s), z); const b = add(upper, cyl(0.22, 0.16, 0.16, C.straw, 8), 0.17 * s, U(0.5 * s), z); for (let k = 0; k < 4; k++) add(b, ball(0.09, pick(["#7fb069", "#e8563f", "#e0a52c", "#8fc26a"]), 6), (rnd() - 0.5) * 0.2, 0.12, (rnd() - 0.5) * 0.2); }
  }
  // seated pose: legs forward, hands on the lap
  (g.userData as { sit?: () => void }).sit = () => { for (const l of [legL, legR]) { l.thigh.rotation.x = -1.5; l.shin.rotation.x = 1.45; } armL.rotation.x = armR.rotation.x = -0.9; };
  // gait: swing legs and arms when walking
  (g.userData as { walk?: (t: number) => void }).walk = (t) => {
    const sw = Math.sin(t * 7) * 0.5;
    legL.thigh.rotation.x = sw; legR.thigh.rotation.x = -sw;
    legL.shin.rotation.x = Math.max(0, -sw) * 0.9; legR.shin.rotation.x = Math.max(0, sw) * 0.9;   // knee bends as the leg swings back
    if (!opts.pole) { armL.rotation.x = -sw * 0.7; armR.rotation.x = sw * 0.7; } else armL.rotation.x = -sw * 0.7;   // the free arm swings
    g.position.y = Math.abs(Math.cos(t * 7)) * 0.02;
  };
  return g;
}

// ---------- landscape ----------

/** A mountain: a cluster of flared, softly irregular peaks with rock at the summit and forest at the foot. */
export function mountain(r: number, h: number, dark = false): P {
  const g = group();
  const seedBase = Math.floor(rnd() * 1e6);
  const grass = new THREE.Color(dark ? "#5a8a52" : "#6f9f5f"), rock = new THREE.Color("#8d9384"), foot = new THREE.Color(dark ? "#4f7d48" : "#628f55");
  const peak = (pr: number, ph: number, x: number, z: number, seed: number) => {
    const geo = new THREE.ConeGeometry(pr, ph, 12, 5);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i), f = (y + ph / 2) / ph;                 // 0 at the foot, 1 at the apex
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      const flare = Math.pow(Math.max(0.001, 1 - f), -0.3);          // concave slope: wide foot, steeper summit
      const wob = 1 + wobble(a, seed) * 0.1 * (1 - f);              // gentle coherent irregularity
      if (f < 0.999) { pos.setX(i, pos.getX(i) * flare * wob); pos.setZ(i, pos.getZ(i) * flare * wob); }
      const c = f > 0.72 && ph > 7 ? grass.clone().lerp(rock, (f - 0.72) / 0.28) : f < 0.25 ? foot.clone().lerp(grass, f / 0.25) : grass;
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
    add(g, m, x, ph / 2, z);
  };
  peak(r, h, 0, 0, seedBase);
  peak(r * 0.7, h * 0.62, r * 0.75, r * 0.2, seedBase + 1);
  peak(r * 0.6, h * 0.5, -r * 0.6, -r * 0.45, seedBase + 2);
  // forest at the foot and up the lower slope
  for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, d = r * (0.55 + rnd() * 0.5); add(g, tree("pine", 0.55 + rnd() * 0.3), Math.cos(a) * d, Math.max(0, h * 0.12 * (1 - d / (r * 1.1))), Math.sin(a) * d); }
  return g;
}

export function tree(kind: "round" | "pine" | "willow" | "bamboo" | "blossom" | "ginkgo" | "persimmon" = "round", s = 1): P {
  const g = group();
  if (kind === "bamboo") {
    for (let i = 0; i < 6; i++) {
      const st = add(g, cyl(0.04, 0.05, 2.2 * s + rnd(), "#8fbf6a", 5), (rnd() - 0.5) * 0.7, 1.1 * s, (rnd() - 0.5) * 0.7);
      st.rotation.z = (rnd() - 0.5) * 0.15;
      for (let k = 0; k < 3; k++) add(g, cone(0.22 * s, 0.6, C.leaf, 4), st.position.x + (rnd() - 0.5) * 0.4, 1.4 * s + k * 0.45 + rnd() * 0.3, st.position.z + (rnd() - 0.5) * 0.4).rotation.z = (rnd() - 0.5) * 1.2;
    }
    return g;
  }
  add(g, cyl(0.08 * s, 0.14 * s, 0.9 * s, C.woodDark, 5), 0, 0.45 * s, 0);
  switch (kind) {
    case "pine": add(g, cone(0.6 * s, 1.2 * s, C.greenDark, 6), 0, 1.2 * s, 0); add(g, cone(0.42 * s, 0.9 * s, C.greenDark, 6), 0, 1.85 * s, 0); add(g, cone(0.26 * s, 0.6 * s, C.greenDark, 6), 0, 2.35 * s, 0); break;
    case "willow": { const c = add(g, ball(0.8 * s, C.leaf, 7), 0, 1.4 * s, 0); c.scale.set(1, 0.7, 1); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; add(g, cyl(0.03, 0.03, 1.0 * s, "#8fbf6a", 4), Math.cos(a) * 0.7 * s, 0.95 * s, Math.sin(a) * 0.7 * s); } break; }
    case "blossom": for (let i = 0; i < 4; i++) add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(0.45 * s, 0), mat(i % 2 ? "#f4b7c9" : "#f9d3dd")), (rnd() - 0.5) * 0.8 * s, (1.1 + rnd() * 0.5) * s, (rnd() - 0.5) * 0.8 * s); break;
    case "ginkgo": add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 * s, 0), mat("#e8c547")), 0, 1.4 * s, 0).scale.set(0.9, 1.2, 0.9); break;
    case "persimmon": { add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.65 * s, 0), mat("#6f9b57")), 0, 1.3 * s, 0); for (let i = 0; i < 6; i++) { const a = rnd() * Math.PI * 2; add(g, ball(0.09 * s, "#f07a2a", 6), Math.cos(a) * 0.55 * s, (1.0 + rnd() * 0.6) * s, Math.sin(a) * 0.55 * s); } break; }
    default: add(g, new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 * s, 0), mat(pick([C.leaf, "#6f9b57", "#8fbf6a"]))), 0, 1.3 * s, 0);
  }
  return g;
}

export function terrace(levels = 4, r = 4, tea = false): P {
  const g = group();
  for (let i = 0; i < levels; i++) {
    const rr = r * (1 - i / (levels + 0.5));
    const step = add(g, cyl(rr, rr + 0.3, 0.6, i % 2 ? "#a9c77c" : "#8fb86a", 14), i * 0.25, 0.3 + i * 0.6, i * 0.1);
    if (tea) for (let k = 0; k < Math.floor(rr * 4); k++) { const a = (k / Math.floor(rr * 4)) * Math.PI * 2; const b = add(g, ball(0.22, "#3f7d4a", 6), step.position.x + Math.cos(a) * (rr - 0.35), 0.72 + i * 0.6, step.position.z + Math.sin(a) * (rr - 0.35)); b.scale.y = 0.7; }
    else add(g, cyl(rr - 0.1, rr - 0.1, 0.06, "#b9dbd2", 14), step.position.x, 0.63 + i * 0.6, step.position.z);
  }
  return g;
}

export function fence(len: number): P {
  const g = group();
  const n = Math.max(2, Math.round(len / 1.1));
  for (let i = 0; i <= n; i++) add(g, box(0.09, 0.7, 0.09, C.woodDark), -len / 2 + (i / n) * len, 0.35, 0);
  add(g, box(len, 0.06, 0.05, C.wood), 0, 0.55, 0); add(g, box(len, 0.06, 0.05, C.wood), 0, 0.3, 0);
  return g;
}

export function pond(): P {
  const g = group();
  add(g, new THREE.Mesh(new THREE.CircleGeometry(3, 18), mat(C.soil)), 0, 0.02, 0).rotation.x = -Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.CircleGeometry(2.6, 18), smooth("#8fc4c9")), 0, 0.05, 0).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 10; i++) { const a = rnd() * Math.PI * 2; add(g, cyl(0.02, 0.03, 0.9, "#6fae4f", 4), Math.cos(a) * 2.8, 0.45, Math.sin(a) * 2.8).rotation.z = (rnd() - 0.5) * 0.3; }
  for (let i = 0; i < 3; i++) { const lp = add(g, new THREE.Mesh(new THREE.CircleGeometry(0.28, 8), mat("#4f8a3c")), (rnd() - 0.5) * 3, 0.08, (rnd() - 0.5) * 3); lp.rotation.x = -Math.PI / 2; }
  const ducks: P[] = [];
  for (let i = 0; i < 3; i++) { const d = group(); add(d, ball(0.16, C.white, 7), 0, 0.14, 0).scale.set(1.3, 0.8, 1); add(d, ball(0.09, C.white, 6), 0.18, 0.28, 0); add(d, cone(0.03, 0.1, "#f07a2a", 4), 0.28, 0.27, 0).rotation.z = -Math.PI / 2; g.add(d); ducks.push(d); }
  g.userData.tick = (t) => ducks.forEach((d, i) => { const a = t * 0.15 + i * 2.1; d.position.set(Math.cos(a) * 1.4, 0.04, Math.sin(a) * 1.4); d.rotation.y = -a + Math.PI / 2; });
  return g;
}

export function boat(): P {
  const g = group();
  add(g, box(1.8, 0.3, 0.6, C.woodDark), 0, 0.15, 0);
  add(g, box(0.4, 0.2, 0.5, C.woodDark), 1.0, 0.3, 0).rotation.z = 0.5;
  add(g, box(1.0, 0.4, 0.5, C.straw), -0.1, 0.5, 0);
  add(g, chineseRoof(1.3, 0.8, 0.3, C.straw, 0.1), -0.1, 0.7, 0);
  add(g, person("#3f6b8f", { hat: true }), 0.7, 0.3, 0).scale.setScalar(0.8);
  add(g, cyl(0.02, 0.02, 1.8, C.wood, 4), 0.9, 0.9, 0.2).rotation.z = 0.6;
  g.userData.tick = (t) => { g.position.y = Math.sin(t * 1.3) * 0.03; g.rotation.z = Math.sin(t * 0.9) * 0.03; };
  return g;
}

export function bridge(len = 5): P {
  const g = group();
  const arc = new THREE.Mesh(new THREE.TorusGeometry(len / 2, 0.38, 6, 16, Math.PI), mat(C.stone));
  add(g, arc, 0, 0, 0); arc.scale.y = 0.55;
  add(g, box(len + 0.8, 0.2, 1.4, C.stone), 0, 1.05, 0);
  for (let i = 0; i <= 6; i++) for (const z of [-0.65, 0.65]) add(g, box(0.12, 0.45, 0.12, C.stoneDark), -len / 2 + (i / 6) * len, 1.35, z);
  for (const z of [-0.65, 0.65]) add(g, box(len + 0.8, 0.08, 0.08, C.stoneDark), 0, 1.58, z);
  // stepped ramps at both ends so the deck actually meets the ground
  for (const sd of [-1, 1]) for (let k = 0; k < 5; k++) add(g, box(0.36, 0.22 + k * 0.2, 1.4, k % 2 ? C.stone : "#aaa79e"), sd * (len / 2 + 0.4 + (4 - k) * 0.34 + 0.18), (0.22 + k * 0.2) / 2, 0);
  return g;
}

export function woodenBridge(len = 4): P {
  const g = group();
  add(g, box(len, 0.12, 1.1, C.wood), 0, 0.55, 0);
  for (const x of [-len / 2 + 0.2, len / 2 - 0.2]) for (const z of [-0.45, 0.45]) add(g, box(0.1, 0.9, 0.1, C.woodDark), x, 0.5, z);
  for (const z of [-0.5, 0.5]) add(g, box(len, 0.06, 0.06, C.woodDark), 0, 1.0, z);
  return g;
}

export function signpost(): P {
  const g = group();
  add(g, cyl(0.05, 0.06, 1.4, C.woodDark, 5), 0, 0.7, 0);
  add(g, box(1.1, 0.34, 0.08, C.wood), 0.3, 1.25, 0).rotation.z = 0.05;
  return g;
}

export function path(points: [number, number][], width = 1.6, color = "#cdbb94"): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0.03, z)));
  const segments = points.length * 8;
  const pts = curve.getSpacedPoints(segments);
  const pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const p = pts[i], tg = curve.getTangentAt(i / segments);
    const side = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, p.y, p.z - side.z, p.x + side.x, p.y, p.z + side.z);
    if (i < segments) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat(color)); m.receiveShadow = true;
  return m;
}

// ---------- animals ----------

export function cow(dark = false, wander = true, voice = "哞~ Moo~"): P {
  const g = group();
  const body = new THREE.Group();
  g.add(body);
  const coat = dark ? C.buffalo : C.cowWhite;
  add(body, box(1.5, 0.8, 0.8, coat), 0, 0.85, 0);
  if (!dark) {
    // patches sit a hair outside the coat so they never z-fight with it
    const patch = (w: number, h: number, d: number, x: number, y: number, z: number) => add(body, box(w, h, d, C.cowBrown), x, y, z);
    patch(0.5, 0.42, 0.84, 0.3, 1.05, 0);
    patch(0.42, 0.55, 0.84, -0.45, 0.8, 0);
    patch(1.54, 0.3, 0.44, 0, 1.12, 0.22);
    patch(0.36, 0.84, 0.35, 0.05, 0.85, -0.25);
    patch(0.3, 0.3, 0.3, -0.1, 0.64, 0.3);
  }
  const head = add(body, box(0.5, 0.5, 0.5, coat), 0.95, 0.85, 0);
  add(head, box(0.3, 0.2, 0.42, dark ? "#6a6060" : "#e9b8a5"), 0.15, -0.16, 0);
  if (!dark) add(head, box(0.22, 0.28, 0.52, C.cowBrown), -0.1, 0.1, 0);
  for (const z of [-0.2, 0.2]) { const horn = add(head, cyl(0.03, 0.06, dark ? 0.55 : 0.28, dark ? "#2b2626" : "#e8dcc2", 5), 0.05, 0.3, z); horn.rotation.x = z * (dark ? 3.2 : 1.2); horn.rotation.z = dark ? 1.3 : 0.2; }
  for (const z of [-0.22, 0.22]) add(head, box(0.08, 0.14, 0.05, dark ? "#6a6060" : "#e9b8a5"), -0.1, 0.22, z * 1.25);
  const legs = [-0.5, 0.5].flatMap((x) => [-0.25, 0.25].map((z) => add(body, box(0.18, 0.5, 0.18, dark ? C.buffalo : (x < 0 ? C.cowBrown : coat)), x, 0.25, z)));
  const tail = add(body, cyl(0.03, 0.03, 0.6, dark ? C.buffalo : C.cowBrown, 4), -0.78, 0.7, 0); tail.rotation.x = 0.3;
  // wander: a slow amble around the origin with grazing pauses
  const ph = rnd() * 6, r = 1.1 + rnd() * 0.5;
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); bubble(body, voice, 1.9); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const cycle = wander ? (t * 0.05 + ph) % 1 : 0.9;   // one loop ≈ 20 s; a penned cow just grazes
    const walking = cycle < 0.55 && k === 0;
    const a = (walking ? cycle / 0.55 : cycle < 0.55 ? cycle / 0.55 : 1) * Math.PI * 2 + ph;
    body.position.set(Math.cos(a) * r, 0, Math.sin(a) * r * 0.7);
    body.rotation.y = -a - Math.PI / 2 + (walking ? 0 : Math.sin(t * 0.4) * 0.1);
    const step = walking ? Math.sin(t * 6 + ph) * 0.35 : 0;
    legs.forEach((l, i) => { l.rotation.x = (i % 2 ? step : -step); });
    // mooing: head up, mouth open (chin drops), tail wagging fast, a little hop
    head.rotation.z = k > 0 ? 0.45 * Math.sin(k * Math.PI) : walking ? Math.sin(t * 3 + ph) * 0.06 : -0.55 + Math.sin(t * 1.2 + ph) * 0.12;
    tail.rotation.y = Math.sin(t * (k > 0 ? 14 : 2.3) + ph) * 0.5;
    body.position.y = k > 0 ? Math.abs(Math.sin(k * Math.PI * 2)) * 0.12 * k : 0;
  };
  return g;
}

export function pig(): P {
  const g = group();
  add(g, box(1.1, 0.6, 0.65, C.pinkPig), 0, 0.5, 0);
  const head = add(g, box(0.5, 0.5, 0.5, C.pinkPig), 0.7, 0.5, 0);
  add(head, box(0.15, 0.22, 0.28, "#d98b83"), 0.3, -0.05, 0);
  for (const z of [-0.18, 0.18]) add(head, box(0.12, 0.2, 0.12, "#d98b83"), 0, 0.3, z);
  for (const x of [-0.35, 0.35]) for (const z of [-0.2, 0.2]) add(g, box(0.16, 0.3, 0.16, C.pinkPig), x, 0.15, z);
  const ph = rnd() * 6;
  const re = reaction(0.8);
  g.userData.poke = () => { re.poke(); bubble(g, "哼哼 Oink oink", 1.2); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    head.position.y = 0.45 + Math.abs(Math.sin(t * 2.4 + ph)) * 0.06;
    head.rotation.z = k * Math.sin(t * 30) * 0.12;               // snout shaking
    g.rotation.z = k * Math.sin(t * 16) * 0.08;                  // whole pig wiggles
    g.position.y = k > 0 ? Math.abs(Math.sin(t * 12)) * 0.08 * k : 0;
  };
  return g;
}

export function chicken(color = C.white, voice = "咯咯! Cluck!"): P {
  const g = group();
  add(g, ball(0.22, color, 7), 0, 0.42, 0).scale.set(1.2, 0.9, 1);
  const head = add(g, ball(0.12, color, 6), 0.22, 0.62, 0);
  add(head, cone(0.04, 0.12, C.gold, 4), 0.14, 0, 0).rotation.z = -Math.PI / 2;
  add(head, box(0.06, 0.1, 0.03, C.red), 0, 0.14, 0);
  add(g, cone(0.12, 0.25, color === C.white ? "#d9b56b" : "#3b2a22", 4), -0.28, 0.55, 0).rotation.z = 0.9;
  for (const z of [-0.06, 0.06]) add(g, cyl(0.015, 0.015, 0.25, C.gold, 4), 0, 0.15, z);
  const wings = [-1, 1].map((sd) => { const w = new THREE.Group(); w.position.set(0, 0.48, sd * 0.2); const m = add(w, box(0.26, 0.05, 0.16, color), 0, 0, sd * 0.08); void m; g.add(w); return { w, sd }; });
  const re = reaction(0.7);
  let egg: THREE.Mesh | null = null;
  g.userData.poke = () => {
    re.poke(); bubble(g, voice, 1.0, 1200);
    if (egg) g.remove(egg);
    egg = add(g, ball(0.09, "#f6ecd8", 8), -0.3, 0.1, 0); egg.scale.set(1.2, 1, 1);
    const e = egg; setTimeout(() => { if (egg === e) { g.remove(e); egg = null; } }, 6000);
  };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    wings.forEach(({ w, sd }) => { w.rotation.x = k > 0 ? sd * Math.sin(t * 28) * 0.9 * k : 0; });
    g.position.y = k > 0 ? Math.abs(Math.sin(t * 14)) * 0.25 * k : 0;
    head.rotation.z = k > 0 ? Math.sin(t * 20) * 0.2 : 0;
  };
  return g;
}

export function coop(): P {
  const g = group();
  add(g, box(1.6, 0.9, 1.2, C.wood), 0, 0.65, 0);
  for (const x of [-0.65, 0.65]) for (const z of [-0.45, 0.45]) add(g, box(0.1, 0.4, 0.1, C.woodDark), x, 0.2, z);
  add(g, chineseRoof(2.0, 1.6, 0.4, C.straw, 0.1), 0, 1.1, 0);
  add(g, box(0.4, 0.45, 0.05, "#3b2a22"), 0, 0.5, 0.61);
  const ramp = add(g, box(0.4, 0.05, 1.0, C.woodDark), 0, 0.2, 1.05); ramp.rotation.x = 0.35;
  for (let i = 0; i < 3; i++) add(g, cyl(0.03, 0.03, 0.9, C.woodDark, 4), -0.9 + i * 0.9, 0.45, 1.5);
  add(g, box(1.9, 0.04, 0.04, C.woodDark), 0, 0.85, 1.5);
  return g;
}

export function goat(): P {
  const g = group();
  add(g, box(0.8, 0.45, 0.4, "#ece6dc"), 0, 0.55, 0);
  const head = add(g, box(0.3, 0.3, 0.28, "#ece6dc"), 0.5, 0.7, 0);
  for (const z of [-0.08, 0.08]) add(head, cone(0.03, 0.2, "#7a6a5a", 4), -0.05, 0.22, z).rotation.x = -0.4;
  add(head, cyl(0.03, 0.02, 0.15, "#ece6dc", 4), 0.05, -0.2, 0);
  for (const x of [-0.28, 0.28]) for (const z of [-0.13, 0.13]) add(g, box(0.1, 0.35, 0.1, "#ece6dc"), x, 0.17, z);
  return g;
}

export function butterfly(color = "#f2b64d"): P {
  const g = group();
  const wingGeo = new THREE.PlaneGeometry(0.28, 0.22);
  const wm = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 1 });
  const l = new THREE.Mesh(wingGeo, wm), r = new THREE.Mesh(wingGeo, wm);
  l.position.x = -0.14; r.position.x = 0.14;
  const lp = new THREE.Group(); lp.add(l); const rp = new THREE.Group(); rp.add(r);
  g.add(lp, rp);
  g.userData.tick = (t) => { const f = Math.sin(t * 14) * 0.9; lp.rotation.y = f; rp.rotation.y = -f; };
  return g;
}

// ---------- fields & ingredient props ----------

export function chilliField(): P {
  const g = group();
  add(g, box(7, 0.2, 4.2, C.soil), 0, 0.1, 0);
  for (let i = 0; i < 4; i++) add(g, box(7, 0.15, 0.5, "#6a4b32"), 0, 0.22, -1.6 + i * 1.05);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 9; j++) {
    const x = -3.1 + j * 0.78, z = -1.6 + i * 1.05;
    add(g, ball(0.3, C.greenDark, 6), x, 0.5, z).scale.y = 0.8;
    for (let k = 0; k < 4; k++) { const c = add(g, cone(0.05, 0.24, C.red, 5), x + (rnd() - 0.5) * 0.4, 0.5 + (rnd() - 0.4) * 0.2, z + (rnd() - 0.5) * 0.4); c.rotation.x = Math.PI + (rnd() - 0.5); c.rotation.z = rnd() - 0.5; }
  }
  // drying racks with chilli strings and a farmer
  for (const zx of [-2.2, 2.2]) { add(g, box(0.08, 1.7, 0.08, C.woodDark), -3.9, 0.85, zx); }
  add(g, box(0.08, 0.08, 4.5, C.woodDark), -3.9, 1.7, 0);
  const strings: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) { const st = add(g, cyl(0.07, 0.07, 0.8 + rnd() * 0.4, C.red, 6), -3.9, 1.7, -2.0 + i * 0.66); st.geometry.translate(0, -0.5, 0); strings.push(st); }
  const farmer = add(g, person("#c0392b", { hat: true }), 3.9, 0, 1.0);
  const bask = add(g, cyl(0.35, 0.28, 0.3, C.straw, 9), 4.2, 0.15, 1.8);
  for (let i = 0; i < 6; i++) add(bask, cone(0.05, 0.22, C.red, 5), (rnd() - 0.5) * 0.4, 0.2, (rnd() - 0.5) * 0.4).rotation.x = rnd() * 3;
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  const re = reaction(0.9);
  g.userData.poke = () => {
    re.poke();
    for (let i = 0; i < 10; i++) { const m = cone(0.05, 0.24, C.red, 5); m.position.set(-3 + rnd() * 6, 0.55, -1.6 + rnd() * 3.2); m.rotation.x = Math.PI; g.add(m); falling.push({ m, v: 0, life: 0 }); }
  };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const up = (farmer.userData as { upper?: THREE.Group }).upper;
    if (up) { up.rotation.z = k * Math.sin(t * 9) * 0.25; }                    // farmer waves
    strings.forEach((st, i) => { st.rotation.x = Math.sin(t * 1.4 + i) * 0.05 + k * Math.sin(t * 9 + i) * 0.35; });
    for (let i = falling.length - 1; i >= 0; i--) { const f = falling[i]; f.v += dt * 9; f.life += dt; f.m.position.y = Math.max(0.25, f.m.position.y - f.v * dt); f.m.rotation.z += dt * 3 * (f.m.position.y > 0.26 ? 1 : 0); if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); } }
  };
  return g;
}

export function pepperTree(): P {
  const g = group();
  add(g, cyl(0.14, 0.24, 1.7, C.woodDark, 6), 0, 0.85, 0);
  for (let i = 0; i < 3; i++) { const br = add(g, cyl(0.05, 0.08, 0.9, C.woodDark, 5), Math.cos(i * 2.1) * 0.4, 1.7, Math.sin(i * 2.1) * 0.4); br.rotation.z = Math.cos(i * 2.1) * 0.7; br.rotation.x = -Math.sin(i * 2.1) * 0.7; }
  const crown = new THREE.Group();
  for (let i = 0; i < 6; i++) add(crown, new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 0), mat(i % 2 ? "#6f9f57" : "#7fae60")), (rnd() - 0.5) * 1.5, 2.2 + (rnd() - 0.3) * 0.8, (rnd() - 0.5) * 1.5);
  const berries: THREE.Mesh[] = [];
  for (let i = 0; i < 34; i++) berries.push(add(crown, ball(0.07, "#b23a2f", 5), (rnd() - 0.5) * 2.4, 1.7 + rnd() * 1.4, (rnd() - 0.5) * 2.4));
  g.add(crown);
  // a low stone wall and a basket under the tree
  add(g, cyl(0.4, 0.32, 0.3, C.straw, 9), 1.3, 0.15, 0.6);
  const falling: { m: THREE.Mesh; v: number; life: number }[] = [];
  let shake = 0;
  g.userData.poke = () => {
    shake = 1;
    for (let i = 0; i < 12; i++) { const src = berries[Math.floor(rnd() * berries.length)]; const m = ball(0.07, "#b23a2f", 5); m.position.copy(src.position); g.add(m); falling.push({ m, v: 0, life: 0 }); }
  };
  g.userData.tick = (t, dt) => {
    if (shake > 0) { shake = Math.max(0, shake - dt * 1.3); crown.rotation.z = Math.sin(t * 28) * 0.07 * shake; crown.rotation.x = Math.cos(t * 23) * 0.05 * shake; }
    for (let i = falling.length - 1; i >= 0; i--) {
      const f = falling[i]; f.v += dt * 9; f.life += dt;
      f.m.position.y = Math.max(0.06, f.m.position.y - f.v * dt);
      if (f.m.position.y <= 0.061) f.v = 0;
      if (f.life > 4) { g.remove(f.m); falling.splice(i, 1); }
    }
  };
  return g;
}

export function tofuWorkshop(): P {
  const g = group();
  add(g, house("sichuan", 3.4, 2.8, 1.8), 0, 0, 0);
  add(g, box(1.2, 0.5, 0.9, C.wood), 2.5, 0.25, 0.5);
  for (let i = 0; i < 4; i++) add(g, box(1.0, 0.07, 0.7, "#f7f2e6"), 2.5, 0.55 + i * 0.09, 0.5);
  add(g, box(1.0, 0.1, 0.7, C.woodDark), 2.5, 0.95, 0.5);
  add(g, cyl(0.42, 0.42, 0.9, C.stoneDark, 12), -2.3, 0.45, 1.2); // stone mill
  add(g, cyl(0.45, 0.45, 0.12, C.stone, 12), -2.3, 0.96, 1.2);
  add(g, box(0.06, 0.06, 1.2, C.woodDark), -2.3, 1.05, 1.2);
  for (let i = 0; i < 3; i++) add(g, ball(0.32, C.straw, 6), -2.2 + i * 0.45, 0.28, -0.9 - (i % 2) * 0.3).scale.y = 0.8;
  add(g, cyl(0.55, 0.5, 0.7, C.iron, 12), 2.6, 0.35, -1.0);
  const worker = add(g, person("#e9d7b8", { apron: true }), 1.9, 0, 1.6);
  const pressTop = g.children[g.children.length - 5]; // the press lid (box added above the trays)
  const block = add(g, box(0.5, 0.2, 0.5, "#fbf7ee"), 2.5, 1.1, 0.5); block.visible = false;
  const re = reaction(0.7);
  g.userData.steam = new THREE.Vector3(2.6, 0.8, -1.0);
  g.userData.poke = () => { re.poke(); block.visible = true; block.position.set(2.5, 1.0, 0.5); bubble(worker, "豆腐! Fresh tofu!", 1.5, 1300); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    if (pressTop) pressTop.position.y = 0.95 - k * 0.12 * Math.abs(Math.sin(t * 10));  // press thumps
    if (block.visible) { block.position.y = 1.0 + Math.sin(k * Math.PI) * 0.8; block.rotation.y += dt * 4 * k; if (k === 0) block.visible = false; }
    const up = (worker.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.1 + k * Math.abs(Math.sin(t * 10)) * 0.3;
    tickChildren(g)(t, dt);
  };
  return g;
}

export function vegPlot(): P {
  const g = group();
  add(g, box(5.4, 0.2, 3.6, C.soil), 0, 0.1, 0);
  const crops: THREE.Object3D[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) {
    const x = -2.4 + j * 0.8, z = -1.2 + i * 0.8;
    const plant = new THREE.Group(); plant.position.set(x, 0.2, z); g.add(plant); crops.push(plant);
    if (i === 0) { const c = add(plant, cyl(0.09, 0.09, 0.6, "#4f8a3c", 6), 0, 0.1, 0); c.rotation.z = 0.4 + (rnd() - 0.5) * 0.3; c.rotation.x = (rnd() - 0.5) * 0.5; }
    else if (i === 1) add(plant, ball(0.28, "#8fc26a", 6), 0, 0.15, 0).scale.y = 0.7;
    else if (i === 2) { for (let k = 0; k < 3; k++) add(plant, cone(0.05, 0.5, "#6fae4f", 4), (k - 1) * 0.1, 0.25, 0); }
    else { add(plant, ball(0.22, "#6f3d8a", 6), 0, 0.12, 0).scale.set(0.8, 1.2, 0.8); add(plant, cone(0.12, 0.2, "#4f8a3c", 4), 0, 0.42, 0); }
  }
  add(g, fence(5.6), 0, 0, 1.9); add(g, fence(5.6), 0, 0, -1.9);
  const gardener = add(g, person("#2f5d3f", { hat: true }), 3.2, 0, -0.5);
  add(g, box(0.05, 1.3, 0.05, C.wood), 3.35, 0.9, -0.3).rotation.z = 0.5;
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    crops.forEach((c) => { const phase = (1 - k) * 8 - (c.position.x + 2.4) * 1.2; const s = k > 0 ? 1 + Math.max(0, Math.sin(phase)) * 0.35 * k : 1; c.scale.set(s, 1 + (s - 1) * 1.4, s); c.rotation.z = Math.sin(t * 1.2 + c.position.x) * 0.03; });
    const up = (gardener.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * Math.sin(t * 8) * 0.2;
  };
  return g;
}

export function mushroomLogs(): P {
  const g = group();
  const caps: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const l = add(g, cyl(0.18, 0.2, 2.2, "#5f4432", 7), -1.2 + i * 0.6, 0.6, 0);
    l.rotation.z = 0.35 + (i % 2) * 0.1; l.rotation.x = (rnd() - 0.5) * 0.3;
    for (let k = 0; k < 4; k++) { const cap = add(g, ball(0.12, "#8a5a3c", 6), l.position.x + (rnd() - 0.5) * 0.5, 0.35 + rnd() * 0.9, (rnd() - 0.5) * 0.5); cap.scale.y = 0.5; caps.push(cap); add(g, cyl(0.04, 0.05, 0.12, "#e7d9c3", 5), cap.position.x, cap.position.y - 0.06, cap.position.z); }
  }
  add(g, chineseRoof(3.4, 1.8, 0.3, C.straw, 0.1), 0, 1.8, 0);
  for (const x of [-1.4, 1.4]) for (const z of [-0.6, 0.6]) add(g, cyl(0.04, 0.04, 1.8, C.woodDark, 4), x, 0.9, z);
  for (let i = 0; i < 3; i++) add(g, cyl(0.3, 0.3, 0.06, C.straw, 9), -1.8, 0.03 + i * 0.07, 1.4 + i * 0.1);
  const re = reaction(0.8);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => { const k = re.step(dt); caps.forEach((c, i) => { const s = 1 + Math.max(0, Math.sin(k * Math.PI * 2 + i)) * 0.5 * k; c.scale.set(s, 0.5 * s, s); }); };
  return g;
}

export function ricePaddy(wide = 6): P {
  const g = group();
  const seedlings: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const w = wide - i * 0.6;
    add(g, box(w, 0.22, 2.4, "#7fb6b8"), i * 0.3, 0.1 + i * 0.22, -2.6 + i * 2.6);
    add(g, box(w + 0.3, 0.18, 2.7, C.soil), i * 0.3, 0.05 + i * 0.22, -2.6 + i * 2.6);
    for (let r = 0; r < 4; r++) for (let c = 0; c < Math.floor(w * 1.6); c++) { const sd = add(g, cone(0.05, 0.4, "#8fcf6a", 4), i * 0.3 - w / 2 + 0.4 + c * (w - 0.8) / Math.max(1, Math.floor(w * 1.6) - 1), 0.4 + i * 0.22, -3.4 + i * 2.6 + r * 0.55); sd.geometry = sd.geometry.clone(); sd.geometry.translate(0, 0.2, 0); sd.position.y -= 0.2; seedlings.push(sd); }
  }
  const farmers = [add(g, person("#3f6b8f", { hat: true }), wide / 2 - 1.2, 0.2, 0.4), add(g, person("#7a4a3a", { hat: true }), -wide / 2 + 1.5, 0.2, -2.2)];
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    seedlings.forEach((sd) => { sd.rotation.z = Math.sin(t * 1.5 + sd.position.x * 0.8 + sd.position.z) * 0.08 + k * Math.sin((1 - k) * 10 - sd.position.x * 1.5) * 0.5; });
    farmers.forEach((f, i) => { const up = (f.userData as { upper?: THREE.Group }).upper; if (up) { up.rotation.x = 0.35 * (1 - k) + Math.sin(t * 1.1 + i) * 0.05; up.rotation.z = k * Math.sin(t * 8 + i) * 0.25; } });
  };
  return g;
}

export function wheatField(): P {
  const g = group();
  add(g, box(7, 0.18, 4, "#c9b16a"), 0, 0.09, 0);
  const stalks: THREE.Group[] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 16; j++) {
    const x = -3.2 + j * 0.42, z = -1.7 + i * 0.7;
    const st = new THREE.Group(); st.position.set(x, 0.18, z); g.add(st); stalks.push(st);
    add(st, cyl(0.03, 0.03, 0.7 + rnd() * 0.2, "#e2c46a", 4), 0, 0.32, 0).rotation.z = (rnd() - 0.5) * 0.15;
    add(st, box(0.09, 0.22, 0.09, "#d9a441"), 0, 0.77, 0);
  }
  add(g, cone(0.8, 1.3, C.straw, 8), -4.2, 0.65, 1.2);
  add(g, cone(0.6, 1.0, C.straw, 8), -4.4, 0.5, -0.4);
  const reaper = add(g, person("#7a4a3a", { hat: true }), 4.2, 0, 0);
  const re = reaction(0.6);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    stalks.forEach((st) => { st.rotation.z = Math.sin(t * 1.3 + st.position.x * 1.1 + st.position.z * 0.5) * 0.06 + k * Math.sin((1 - k) * 12 - st.position.x * 1.4) * 0.45; });
    const up = (reaper.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.z = k * Math.sin(t * 8) * 0.25;
  };
  return g;
}

export function jars(): P {
  const g = group();
  add(g, box(3.8, 0.15, 2.6, C.stone), 0, 0.07, 0);
  const sizes = [0.55, 0.45, 0.6, 0.4, 0.5, 0.42, 0.5, 0.36];
  const lids: { lid: THREE.Group; base: number; ph: number }[] = [];
  sizes.forEach((r, i) => {
    const x = -1.4 + (i % 4) * 0.95, z = -0.6 + Math.floor(i / 4) * 1.2;
    add(g, ball(r, i % 2 ? C.clay : "#5c3a28", 9), x, r * 0.9 + 0.15, z).scale.y = 1.15;
    const lid = new THREE.Group(); lid.position.set(x, r * 1.95 + 0.15, z); g.add(lid);
    add(lid, cyl(r * 0.5, r * 0.55, 0.12, "#3c2a22", 9), 0, 0, 0);
    add(lid, cone(r * 0.55, 0.22, C.straw, 9), 0, 0.15, 0);
    lids.push({ lid, base: lid.position.y, ph: rnd() * 6 });
  });
  const keeper = add(g, person("#e9d7b8", { apron: true }), 2.4, 0, 0.6);
  const bubbles: { m: THREE.Mesh; life: number; x: number; z: number }[] = [];
  const bubMat = new THREE.MeshStandardMaterial({ color: "#f3d7a4", transparent: true, opacity: 0.8, roughness: 0.3 });
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); lids.forEach((l) => { for (let n = 0; n < 2; n++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.05 + rnd() * 0.05, 7, 5), bubMat); m.position.set(l.lid.position.x + (rnd() - 0.5) * 0.3, l.base + 0.15, l.lid.position.z + (rnd() - 0.5) * 0.3); g.add(m); bubbles.push({ m, life: rnd() * 0.5, x: m.position.x, z: m.position.z }); } }); bubble(keeper, "咕嘟~ Blub blub", 1.5, 1200); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    lids.forEach((l) => { l.lid.position.y = l.base + k * Math.abs(Math.sin(t * 14 + l.ph)) * 0.18; l.lid.rotation.z = k * Math.sin(t * 12 + l.ph) * 0.15; });
    for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; b.life += dt; b.m.position.y += dt * 0.8; b.m.position.x = b.x + Math.sin(t * 5 + i) * 0.05; if (b.life > 1.6) { g.remove(b.m); bubbles.splice(i, 1); } }
  };
  return g;
}

/** The village market: stalls with striped awnings, heaps of produce, hanging ducks, steamers, fish on ice, sacks of spice. */
export function market(): P {
  const g = group();
  const plaza = add(g, new THREE.Mesh(new THREE.CircleGeometry(7.2, 24), mat("#cbbb96")), -0.6, 0.02, 0);
  plaza.rotation.x = -Math.PI / 2; plaza.scale.y = 0.7; // flattened toward the river so the square stays on the bank
  const stall = (kind: string, awning: string) => {
    const s = group();
    add(s, box(2.6, 0.75, 1.2, C.wood), 0, 0.42, 0);
    add(s, box(2.6, 0.08, 1.2, C.woodDark), 0, 0.82, 0);
    for (const x of [-1.2, 1.2]) for (const z of [-0.55, 0.55]) add(s, cyl(0.05, 0.05, 2.1, C.woodDark, 5), x, 1.05, z);
    const aw = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.7), new THREE.MeshStandardMaterial({ map: stripes(awning), side: THREE.DoubleSide, roughness: 1 }));
    aw.material.map!.repeat.set(3, 1); aw.rotation.x = -Math.PI / 2 + 0.28; aw.position.set(0, 2.15, 0.15); aw.castShadow = true; s.add(aw);
    const goods = new THREE.Group(); goods.position.y = 0.86; s.add(goods);
    switch (kind) {
      case "produce": for (let i = 0; i < 4; i++) { const b = add(goods, cyl(0.32, 0.26, 0.24, C.straw, 9), -0.95 + i * 0.63, 0.12, (i % 2) * 0.35 - 0.15); const col = ["#7fb069", "#f07a2a", "#e8563f", "#6f3d8a"][i]; for (let k = 0; k < 7; k++) add(b, ball(0.1, col, 6), (rnd() - 0.5) * 0.4, 0.2 + rnd() * 0.08, (rnd() - 0.5) * 0.4); } for (let i = 0; i < 4; i++) add(goods, ball(0.22, "#8fc26a", 6), -0.9 + i * 0.6, 0.18, 0.4).scale.y = 0.7; break;
      case "butcher": add(goods, box(2.4, 0.06, 0.06, C.woodDark), 0, 1.15, -0.3); for (let i = 0; i < 4; i++) { const duck = add(goods, ball(0.16, "#a8552a", 7), -0.9 + i * 0.6, 0.75, -0.3); duck.scale.set(0.8, 1.4, 0.8); add(goods, cyl(0.01, 0.01, 0.3, C.woodDark, 3), -0.9 + i * 0.6, 1.05, -0.3); } for (let i = 0; i < 6; i++) add(goods, cyl(0.05, 0.05, 0.5, "#9b2f2a", 6), -1.0 + i * 0.4, 0.35, 0.3).rotation.x = 0.2; add(goods, box(0.8, 0.12, 0.5, "#e9b8a5"), 0.6, 0.06, 0.2); break;
      case "steamers": for (let i = 0; i < 4; i++) add(goods, cyl(0.42, 0.42, 0.18, C.straw, 12), -0.7, 0.09 + i * 0.2, 0); add(goods, cone(0.44, 0.15, "#c9b16a", 12), -0.7, 0.95, 0); for (let i = 0; i < 3; i++) add(goods, cyl(0.42, 0.42, 0.18, C.straw, 12), 0.5, 0.09 + i * 0.2, 0.1); for (let i = 0; i < 6; i++) add(goods, ball(0.09, "#f3ead8", 6), 0.3 + (i % 3) * 0.25, 0.75, -0.2 + Math.floor(i / 3) * 0.28).scale.set(1.3, 0.8, 0.9); s.userData.steam = new THREE.Vector3(-0.7, 1.9, 0); break;
      case "fish": add(goods, box(2.3, 0.14, 0.9, C.white), 0, 0.07, 0); for (let i = 0; i < 5; i++) { const f = add(goods, ball(0.14, i % 2 ? "#7f93a6" : "#b3bfc9", 7), -0.9 + i * 0.45, 0.2, (i % 2) * 0.3 - 0.15); f.scale.set(1.8, 0.6, 0.9); add(goods, cone(0.08, 0.2, i % 2 ? "#7f93a6" : "#b3bfc9", 4), -0.9 + i * 0.45 - 0.3, 0.2, f.position.z).rotation.z = Math.PI / 2; } add(goods, cyl(0.3, 0.25, 0.3, "#3f6b8f", 9), 1.1, 0.15, 0.3); for (let k = 0; k < 5; k++) add(goods, ball(0.06, "#e8563f", 5), 1.1 + (rnd() - 0.5) * 0.3, 0.33, 0.3 + (rnd() - 0.5) * 0.3); break;
      case "spices": for (let i = 0; i < 5; i++) { const sack = add(goods, cyl(0.28, 0.32, 0.4, "#d9c5a3", 8), -1.0 + i * 0.5, 0.2, (i % 2) * 0.3 - 0.15); add(sack, cone(0.24, 0.16, ["#c0392b", "#d9a441", "#8a5a3c", "#e8563f", "#4f4a3a"][i], 8), 0, 0.28, 0); } add(goods, cyl(0.1, 0.1, 0.5, C.red, 8), 1.1, 0.25, 0.3); add(goods, cyl(0.12, 0.12, 0.35, "#3c2a22", 8), 0.8, 0.18, -0.3); break;
      case "aromatics": {
        const basket = (x: number, color: string, kind: "ball" | "root" | "stalk") => {
          const b = add(goods, cyl(0.32, 0.26, 0.24, C.straw, 9), x, 0.12, 0.1);
          for (let i = 0; i < 6; i++) {
            const px = (rnd() - 0.5) * 0.4, pz = (rnd() - 0.5) * 0.4;
            if (kind === "ball") add(b, ball(0.09, color, 6), px, 0.2, pz);
            else if (kind === "root") add(b, box(0.2, 0.09, 0.12, color), px, 0.2, pz).rotation.y = rnd() * 3;
            else add(b, cyl(0.02, 0.03, 0.6, color, 4), px, 0.4, pz).rotation.z = 0.5 + (rnd() - 0.5) * 0.3;
          }
        };
        basket(-0.8, "#f1e9dc", "ball"); basket(0, "#d9b27a", "root"); basket(0.8, "#7fbf5a", "stalk");
        for (let i = 0; i < 5; i++) add(goods, ball(0.09, "#f1e9dc", 6), -0.9 + i * 0.12, 1.0 + (i % 2) * 0.1, -0.45); // garlic braid hanging
        break;
      }
      case "tofu": {
        // tofu sits in a shallow water tray and a bamboo basket, the way it is actually sold
        add(goods, box(1.5, 0.16, 0.8, C.woodDark), -0.45, 0.08, 0);
        add(goods, box(1.38, 0.04, 0.68, "#9fd0d6"), -0.45, 0.16, 0);
        for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) add(goods, box(0.36, 0.14, 0.26, "#fbf7ee"), -0.95 + i * 0.5, 0.2, -0.17 + k * 0.34);
        const bsk = add(goods, cyl(0.38, 0.3, 0.2, C.straw, 10), 0.75, 0.1, 0.1);
        for (let i = 0; i < 4; i++) add(bsk, box(0.22, 0.12, 0.22, "#fbf7ee"), -0.13 + (i % 2) * 0.26, 0.16, -0.13 + Math.floor(i / 2) * 0.26);
        add(goods, cyl(0.22, 0.19, 0.3, C.wood, 10), 0.8, 0.15, -0.38);   // wooden bucket of soy milk
        add(goods, cyl(0.19, 0.19, 0.03, "#f7f2e6", 10), 0.8, 0.3, -0.38);
        add(goods, cyl(0.015, 0.015, 0.4, C.woodDark, 4), 0.9, 0.42, -0.3).rotation.z = -0.5; // ladle
        break;
      }
    }
    add(s, person(pick(["#3f6b8f", "#6a7fb0", "#7a4a3a", "#2f5d3f"]), { apron: true }), 0.4, 0, -0.95);
    return s;
  };
  const kinds: [string, string][] = [["produce", "#c0392b"], ["butcher", "#3f6b8f"], ["steamers", "#2f5d3f"], ["fish", "#3f6b8f"], ["spices", "#d9a441"], ["tofu", "#c0392b"]];
  const ar = stall("aromatics", "#2f5d3f"); ar.position.set(-7.6, 0, 0); ar.rotation.y = -Math.PI / 2; g.add(ar);
  kinds.forEach(([k, a], i) => {
    const s = stall(k, a);
    const angle = -Math.PI * 0.75 + i * (Math.PI * 1.5) / 5;
    s.position.set(Math.cos(angle) * 5.6, 0, Math.sin(angle) * 2.9); s.rotation.y = -angle - Math.PI / 2;
    g.add(s);
    if (s.userData.steam) g.userData.steam = s.localToWorld(s.userData.steam.clone());
  });
  // shoppers stroll from stall to stall and stop to browse
  const spots = kinds.map((_, i) => { const a = -Math.PI * 0.75 + i * (Math.PI * 1.5) / 5; return new THREE.Vector3(Math.cos(a) * 3.8, 0, Math.sin(a) * 1.7); });
  spots.push(new THREE.Vector3(-5.8, 0, 0.2));
  spots.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2, 0, 0.3), new THREE.Vector3(1.5, 0, -0.6));
  type Shopper = { p: P; pos: THREE.Vector3; target: THREE.Vector3; wait: number; speed: number };
  const shoppers: Shopper[] = [];
  for (let i = 0; i < 5; i++) {
    const p = person(pick(["#c0392b", "#e0a52c", "#3f6b8f", "#e9d7b8", "#2f5d3f"]), { pole: i === 0 });
    g.add(p);
    const start = spots[(i * 2) % spots.length].clone();
    p.position.copy(start);
    shoppers.push({ p, pos: start, target: spots[(i * 3 + 1) % spots.length].clone(), wait: i * 1.3, speed: 0.7 + rnd() * 0.4 });
  }
  add(g, lanternString(9, 6), 0, 3.2, 0);
  add(g, lanternString(5.5, 4), 0, 3.0, 0).rotation.y = Math.PI / 2;
  for (const [x, z] of [[-4.5, 0], [4.5, 0], [0, -2.75], [0, 2.75]]) add(g, cyl(0.07, 0.09, 3.3, C.woodRed, 6), x, 1.65, z);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); };
  g.userData.tick = (t, dt) => {
    const kk = re.step(dt);
    if (kk > 0) g.traverse((o) => { const u = (o as { userData?: { upper?: THREE.Group } }).userData?.upper; if (u && o.parent && (o.parent as THREE.Object3D).userData && !(o as P).userData.tick) u.rotation.z = kk * Math.sin(t * 8 + o.position.x) * 0.25; });
    for (const sh of shoppers) {
      if (sh.wait > 0) { sh.wait -= dt; continue; }              // browsing at a stall
      const to = sh.target.clone().sub(sh.pos); const dist = to.length();
      if (dist < 0.15) {                                          // arrived: face the stall, browse, pick the next one
        sh.wait = 2.5 + rnd() * 4;
        const away = sh.target.clone().normalize(); sh.p.rotation.y = Math.atan2(away.x, away.z);
        let next = spots[Math.floor(rnd() * spots.length)]; if (next.distanceTo(sh.target) < 0.5) next = spots[(spots.indexOf(next) + 1) % spots.length];
        sh.target = next.clone().add(new THREE.Vector3((rnd() - 0.5) * 0.6, 0, (rnd() - 0.5) * 0.6));
        continue;
      }
      to.normalize().multiplyScalar(Math.min(dist, sh.speed * dt));
      sh.pos.add(to); sh.p.position.copy(sh.pos);
      sh.p.rotation.y = Math.atan2(to.x, to.z);
      (sh.p.userData as { walk?: (t: number) => void }).walk?.(t);
    }
    tickChildren(g)(t, dt);
  };
  return g;
}

// ---------- technique & dish props ----------

export function wokKitchen(): P {
  const g = group();
  add(g, house("sichuan", 3.8, 3.0, 1.9, 2), 0, 0, -0.9);
  add(g, box(2.2, 0.9, 1.0, "#6f6a66"), 0, 0.45, 1.5);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(C.iron, { side: THREE.DoubleSide })), -0.4, 1.02, 1.5);
  add(g, cyl(0.03, 0.03, 0.6, C.woodDark, 4), 0.1, 1.0, 1.5).rotation.z = -1.2;
  const flame = add(g, cone(0.22, 0.3, "#ff9a3c", 6), -0.4, 0.98, 1.5);
  const flame2 = add(g, cone(0.12, 0.2, "#ffd36b", 6), -0.4, 1.05, 1.5);
  add(g, box(0.4, 1.2, 0.4, "#5a5550"), 1.2, 3.3, -1.2);
  const cook = add(g, person("#f1f1f1", { apron: true }), 0.6, 0, 2.3);
  for (let i = 0; i < 3; i++) add(g, cyl(0.2, 0.16, 0.12, "#f7f2e6", 9), 0.6 + (i % 2) * 0.35, 0.96, 1.2 + i * 0.25);
  const bits: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) { const b = add(g, ball(0.06, i % 2 ? C.red : "#8fc26a", 5), -0.4, 1.0, 1.5); b.visible = false; bits.push(b); }
  g.userData.steam = new THREE.Vector3(-0.4, 1.4, 1.5);
  g.userData.smoke = new THREE.Vector3(1.2, 3.95, -1.2);
  const re = reaction(0.8);
  g.userData.poke = () => { re.poke(); bits.forEach((b) => { b.visible = true; b.userData.vx = (rnd() - 0.5) * 1.2; b.userData.vz = (rnd() - 0.5) * 1.2; b.userData.vy = 3 + rnd() * 2; b.position.set(-0.4, 1.05, 1.5); }); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const f = (0.8 + Math.sin(t * 18) * 0.25) * (1 + k * 1.6);                 // flare
    flame.scale.set(f, (1 + Math.sin(t * 22) * 0.35) * (1 + k * 1.8), f); flame2.scale.set(f, 1 + Math.cos(t * 19) * 0.3, f);
    cook.position.y = Math.abs(Math.sin(t * 4)) * 0.05 + k * Math.abs(Math.sin(t * 12)) * 0.15; cook.rotation.z = Math.sin(t * 4) * 0.08;
    const up = (cook.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.15 + k * Math.sin(t * 12) * 0.3;
    bits.forEach((b) => { if (!b.visible) return; b.userData.vy -= dt * 9; b.position.x += b.userData.vx * dt; b.position.z += b.userData.vz * dt; b.position.y += b.userData.vy * dt; if (b.position.y < 1.0) { b.visible = false; } });
    tickChildren(g)(t, dt);
  };
  return g;
}

export function clayPotKitchen(): P {
  const g = group();
  add(g, house("jiangnan", 3.6, 2.8, 2.0), 0, 0, -0.6);
  add(g, box(1.8, 0.8, 1.0, "#8c8a86"), 0.2, 0.4, 1.4);
  const pot = add(g, ball(0.45, "#5c3a28", 10), 0.2, 1.05, 1.4); pot.scale.y = 0.85;
  const lid = new THREE.Group(); lid.position.set(0.2, 1.42, 1.4); g.add(lid);
  add(lid, cyl(0.3, 0.32, 0.1, "#3c2a22", 10), 0, 0, 0); add(lid, ball(0.08, "#3c2a22", 6), 0, 0.1, 0);
  const glow = add(g, cone(0.18, 0.2, "#ff7a3c", 6), 0.2, 0.86, 1.4);
  const cook = add(g, person("#e9d7b8", { apron: true }), 1.5, 0, 1.9);
  add(g, cyl(0.12, 0.12, 0.35, "#5c3a28", 8), -0.5, 0.98, 1.6);
  g.userData.steam = new THREE.Vector3(0.2, 1.6, 1.4);
  const re = reaction(0.7);
  g.userData.poke = () => { re.poke(); bubble(cook, "好香! Smells so good!", 1.5, 1300); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    glow.scale.setScalar((0.8 + Math.sin(t * 9) * 0.2) * (1 + k));
    lid.position.y = 1.42 + k * Math.abs(Math.sin(t * 16)) * 0.14; lid.rotation.z = k * Math.sin(t * 13) * 0.12;   // lid rattles on the boil
    const up = (cook.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = k * 0.35 * Math.sin(Math.min(1, k * 2) * Math.PI); // leans in to sniff
    tickChildren(g)(t, dt);
  };
  return g;
}

export function griddleStall(): P {
  const g = group();
  add(g, box(2.6, 0.8, 1.2, C.wood), 0, 0.45, 0);
  add(g, cyl(0.75, 0.75, 0.1, C.iron, 16), -0.4, 0.9, 0);
  const dumps: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) { const d = add(g, ball(0.11, "#e9d6a8", 7), -0.4 + Math.cos(i * 1.05) * 0.42, 0.99, Math.sin(i * 1.05) * 0.42); d.scale.set(1.2, 0.7, 0.8); dumps.push(d); }
  add(g, box(0.6, 0.06, 0.45, "#d99a4a"), 0.75, 0.9, 0.2);
  for (const x of [-1.15, 1.15]) add(g, cyl(0.05, 0.05, 2.2, C.woodDark, 5), x, 1.1, -0.5);
  add(g, chineseRoof(3.0, 1.9, 0.5, C.red, 0.2), 0, 2.15, 0);
  const fryer = add(g, person("#6a7fb0", { apron: true }), 0.2, 0, -0.95);
  const spat = add(g, box(0.06, 0.04, 0.3, C.steel), -0.1, 1.0, -0.4);
  g.userData.steam = new THREE.Vector3(-0.4, 1.2, 0);
  const re = reaction(0.8);
  g.userData.poke = () => re.poke();
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    dumps.forEach((d, i) => { d.position.y = 0.99 + k * Math.max(0, Math.sin(t * 14 + i * 1.1)) * 0.22; d.rotation.y = k * Math.sin(t * 6 + i) * 0.6; });   // dumplings hop on the sizzling iron
    spat.position.y = 1.0 + k * Math.abs(Math.sin(t * 14)) * 0.12; spat.rotation.x = k * Math.sin(t * 14) * 0.4;
    const up = (fryer.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.1 + k * Math.abs(Math.sin(t * 14)) * 0.15;
  };
  return g;
}

export function prepTable(): P {
  const g = group();
  add(g, box(2.4, 0.12, 1.2, C.wood), 0, 0.85, 0);
  for (const x of [-1.05, 1.05]) for (const z of [-0.45, 0.45]) add(g, box(0.1, 0.8, 0.1, C.woodDark), x, 0.4, z);
  add(g, cyl(0.45, 0.45, 0.12, "#c99a63", 14), -0.5, 0.97, 0);
  const cleaver = new THREE.Group(); cleaver.position.set(-0.85, 1.06, 0.3); g.add(cleaver);
  add(cleaver, box(0.45, 0.04, 0.14, C.steel), 0.3, 0, -0.1).rotation.y = 0.4; add(cleaver, box(0.16, 0.06, 0.06, C.woodDark), 0, 0, 0);
  const cukes: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) { const c = add(g, cyl(0.08, 0.08, 0.5, "#5f9e46", 6), 0.5 + (i % 2) * 0.25, 1.0, -0.2 + Math.floor(i / 2) * 0.3); c.rotation.z = 1.57; cukes.push(c); }
  add(g, cyl(0.25, 0.2, 0.15, "#f7f2e6", 10), 0.7, 0.98, 0.35);
  const chef = add(g, person("#c0392b", { apron: true }), -0.3, 0, -1.0);
  const re = reaction(0.8);
  g.userData.poke = () => { re.poke(); bubble(chef, "啪! Smash!", 1.5, 900); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    cleaver.position.y = 1.06 + k * Math.abs(Math.sin(t * 16)) * 0.35;                        // chop chop
    cleaver.rotation.x = k * Math.sin(t * 16) * 0.4;
    cukes.forEach((c, i) => { c.position.y = 1.0 + k * Math.max(0, Math.sin(t * 16 + i * 1.3)) * 0.1; });
    const up = (chef.userData as { upper?: THREE.Group }).upper; if (up) up.rotation.x = 0.15 + k * Math.abs(Math.sin(t * 16)) * 0.15;
  };
  add(g, chineseRoof(3.0, 2.0, 0.4, C.straw, 0.1), 0, 2.0, 0);
  for (const x of [-1.2, 1.2]) for (const z of [-0.7, 0.7]) add(g, cyl(0.04, 0.04, 2.0, C.woodDark, 4), x, 1.0, z);
  return g;
}

export function hotpot(): P {
  const g = group();
  add(g, house("sichuan", 4.0, 3.2, 2.0, 2), 0, 0, 0);
  add(g, box(1.6, 0.45, 0.06, C.red), 0, 2.25, 1.75);
  add(g, box(1.2, 0.3, 0.02, C.gold), 0, 2.25, 1.79);
  // round table under a small awning
  const tz = 3.0;
  add(g, cyl(1.15, 1.15, 0.1, C.wood, 16), 0, 0.72, tz);
  add(g, cyl(0.12, 0.14, 0.7, C.woodDark, 6), 0, 0.35, tz);
  // the pot: copper rim, red broth split by a divider, bits bobbing in it
  add(g, cyl(0.6, 0.55, 0.3, "#b87333", 18), 0, 0.92, tz);
  add(g, cyl(0.52, 0.52, 0.04, "#b8302a", 18), 0, 1.08, tz);
  add(g, box(1.02, 0.06, 0.05, "#d8a35a"), 0, 1.1, tz);
  for (let i = 0; i < 6; i++) { const a = rnd() * Math.PI * 2, r = 0.15 + rnd() * 0.3; const c = add(g, cone(0.035, 0.16, C.red, 5), Math.cos(a) * r, 1.11, tz + Math.sin(a) * r); c.rotation.z = Math.PI / 2; c.rotation.y = rnd() * 3; }
  for (let i = 0; i < 4; i++) { const a = rnd() * Math.PI * 2, r = 0.1 + rnd() * 0.3; add(g, box(0.09, 0.05, 0.09, i % 2 ? "#f3ead8" : "#8fc26a"), Math.cos(a) * r, 1.11, tz + Math.sin(a) * r); }
  add(g, cyl(0.62, 0.62, 0.06, C.iron, 18), 0, 0.78, tz); // burner
  // four diners on stools, facing the pot, bowls and chopsticks in front of them
  const colors = ["#3f6b8f", "#c9413f", "#6f9b57", "#d9a441"];
  const diners: { d: P; a: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const x = Math.cos(a) * 1.4, z = tz + Math.sin(a) * 1.4;
    add(g, cyl(0.2, 0.2, 0.42, C.woodDark, 8), x, 0.21, z);
    const d = person(colors[i]);
    (d.userData as { sit?: () => void }).sit?.();
    add(g, d, x, 0.04, z).rotation.y = Math.atan2(-x, tz - z);
    diners.push({ d, a });
    add(g, cyl(0.15, 0.11, 0.1, "#f7f2e6", 9), Math.cos(a) * 0.85, 0.82, tz + Math.sin(a) * 0.85);
    add(g, cyl(0.012, 0.012, 0.45, C.woodDark, 3), Math.cos(a) * 0.85 + 0.1, 0.84, tz + Math.sin(a) * 0.85).rotation.set(Math.PI / 2, 0, a);
  }
  for (const x of [-1.6, 1.6]) for (const z of [tz - 1.3, tz + 1.4]) add(g, cyl(0.05, 0.06, 2.3, C.woodDark, 6), x, 1.15, z);
  add(g, awning(3.6, 3.2, C.red), 0, 2.32, tz);
  add(g, lantern(0.9), -1.6, 2.1, tz + 1.4); add(g, lantern(0.9), 1.6, 2.1, tz + 1.4);
  const brothBits: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) { const b = add(g, ball(0.045, "#e8c9a0", 6), 0, 1.1, tz); b.visible = false; brothBits.push(b); }
  g.userData.steam = new THREE.Vector3(0, 1.3, tz);
  const re = reaction(0.5);
  g.userData.poke = () => { re.poke(); diners.forEach(({ d }, i) => setTimeout(() => bubble(d, ["干杯! Cheers!", "好辣! So spicy!", "再来! More!", "哈哈 Haha"][i], 1.4, 1200), i * 180)); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    diners.forEach(({ d }, i) => {
      const upper = (d.userData as { upper?: THREE.Group }).upper;
      if (!upper) return;
      upper.rotation.z = Math.sin(t * 1.1 + i * 1.7) * 0.14;
      upper.rotation.x = 0.12 + Math.sin(t * 2.3 + i * 2) * 0.06 - k * 0.35;       // lean back and cheer
      upper.rotation.y = Math.sin(t * 0.6 + i) * 0.18;
      const arms = upper.children.filter((c) => c.type === "Group");                 // the two arm pivots
      arms.forEach((a, j) => { a.rotation.z = k * (j ? 2.4 : -2.4) * Math.sin(Math.min(1, k * 1.5) * Math.PI / 2); });
    });
    brothBits.forEach((b, i) => { b.visible = k > 0; b.position.set(Math.cos(t * 2 + i) * 0.3 * (1 + i % 3 * 0.3), 1.1 + k * Math.abs(Math.sin(t * 9 + i)) * 0.18, tz + Math.sin(t * 2 + i) * 0.3 * (1 + i % 2 * 0.4)); });
    tickChildren(g)(t, dt);
  };
  return g;
}

export function noodleStall(): P {
  const g = group();
  add(g, house("sichuan", 3.2, 2.6, 1.7), 0, 0, -1.4);
  add(g, box(3.0, 0.8, 1.3, C.wood), 0, 0.45, 0.6);
  add(g, box(1.3, 0.38, 0.06, "#f3e6c8"), 0, 1.85, 0.3);
  for (const x of [-0.45, 0.45]) add(g, box(0.12, 0.38, 0.06, C.red), x, 1.85, 0.34);
  add(g, cyl(0.42, 0.38, 0.5, C.steel, 12), -0.9, 1.1, 0.6);
  for (let i = 0; i < 4; i++) { add(g, cyl(0.2, 0.14, 0.14, "#f7f2e6", 9), 0.1 + (i % 2) * 0.5, 0.92, 0.35 + Math.floor(i / 2) * 0.5); add(g, cyl(0.16, 0.16, 0.05, "#e2c46a", 9), 0.1 + (i % 2) * 0.5, 1.0, 0.35 + Math.floor(i / 2) * 0.5); }
  add(g, cyl(0.1, 0.1, 0.4, C.red, 8), 1.1, 1.1, 0.95);
  for (const x of [-0.9, 0, 0.9]) { add(g, cyl(0.18, 0.18, 0.4, C.woodDark, 8), x, 0.2, 2.0); }
  for (const x of [-0.9, 0.9]) add(g, person(pick(["#3f6b8f", "#6a7fb0"])), x, 0.2, 2.0).rotation.y = Math.PI;
  const noodleCook = add(g, person("#f1f1f1", { apron: true }), -0.3, 0, -0.3);
  const strand = add(g, cyl(0.02, 0.02, 1.0, "#f3ead8", 4), -0.3, 1.2, 0.2); strand.visible = false;
  // noodles drying on a rack
  add(g, box(0.05, 1.6, 0.05, C.woodDark), 2.2, 0.8, 0.4); add(g, box(0.05, 1.6, 0.05, C.woodDark), 2.2, 0.8, -1.0); add(g, box(0.05, 0.05, 1.4, C.woodDark), 2.2, 1.6, -0.3);
  for (let i = 0; i < 8; i++) add(g, cyl(0.015, 0.015, 1.2, "#f3ead8", 3), 2.2, 1.0, -0.9 + i * 0.16);
  g.userData.steam = new THREE.Vector3(-0.9, 1.5, 0.6);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); strand.visible = true; };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const up = (noodleCook.userData as { upper?: THREE.Group }).upper;
    if (up) { up.rotation.z = k * Math.sin(t * 5) * 0.3; }
    // the cook pulls a long noodle up out of the pot and drops it back
    if (strand.visible) { const s = Math.sin(k * Math.PI); strand.scale.y = 0.2 + s * 2.2; strand.position.y = 1.0 + strand.scale.y * 0.5; strand.rotation.z = Math.sin(t * 5) * 0.15 * s; if (k === 0) strand.visible = false; }
    tickChildren(g)(t, dt);
  };
  return g;
}

export function dumplingStall(): P {
  const g = group();
  add(g, house("northern", 3.6, 2.8, 1.7), 0, 0, -0.9);
  add(g, box(2.4, 0.8, 1.1, C.wood), 0.3, 0.4, 1.3);
  for (let i = 0; i < 4; i++) add(g, cyl(0.42, 0.42, 0.18, C.straw, 12), -0.4, 0.9 + i * 0.2, 1.3);
  const steamerLid = add(g, cone(0.44, 0.15, "#c9b16a", 12), -0.4, 1.75, 1.3);
  const steamBuns: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) { const b = add(g, ball(0.11, "#fbf7ee", 8), -0.4 + Math.cos(i * 2.1) * 0.2, 1.7, 1.3 + Math.sin(i * 2.1) * 0.2); b.scale.y = 0.8; b.visible = false; steamBuns.push(b); }
  add(g, box(1.0, 0.06, 0.6, C.woodDark), 0.7, 0.86, 1.3);
  for (let i = 0; i < 8; i++) add(g, ball(0.09, "#f3ead8", 6), 0.35 + (i % 4) * 0.23, 0.95, 1.15 + Math.floor(i / 4) * 0.3).scale.set(1.3, 0.8, 0.9);
  add(g, cyl(0.03, 0.03, 0.5, C.wood, 5), 1.0, 0.95, 1.0).rotation.z = Math.PI / 2;
  const p = add(g, person("#6a7fb0", { apron: true }), 1.7, 0, 1.9);
  add(g, person("#c0392b"), -1.4, 0, 2.0).rotation.y = 0.5;
  g.userData.steam = new THREE.Vector3(-0.4, 1.95, 1.3);
  const re = reaction(0.6);
  g.userData.poke = () => { re.poke(); steamBuns.forEach((b) => (b.visible = true)); };
  g.userData.tick = (t, dt) => {
    const k = re.step(dt);
    const s = Math.sin(k * Math.PI);
    steamerLid.position.y = 1.75 + s * 0.7; steamerLid.position.x = -0.4 - s * 0.5; steamerLid.rotation.z = s * 0.5;   // lid lifts to show the buns
    steamBuns.forEach((b, i) => { b.position.y = 1.7 + s * (0.05 + Math.abs(Math.sin(t * 8 + i)) * 0.08); if (k === 0) b.visible = false; });
    p.rotation.z = Math.sin(t * 5) * 0.1;
    tickChildren(g)(t, dt);
  };
  return g;
}

export function familyTable(): P {
  const g = group();
  add(g, cyl(1.25, 1.25, 0.1, C.wood, 14), 0, 0.75, 0);
  add(g, cyl(0.12, 0.14, 0.7, C.woodDark, 6), 0, 0.35, 0);
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; add(g, cyl(0.16, 0.12, 0.1, "#f7f2e6", 9), Math.cos(a) * 0.85, 0.85, Math.sin(a) * 0.85); add(g, cyl(0.12, 0.12, 0.05, "#fbf7ef", 9), Math.cos(a) * 0.85, 0.92, Math.sin(a) * 0.85); }
  add(g, cyl(0.35, 0.3, 0.08, "#e9e2d2", 12), 0, 0.85, 0);
  add(g, cyl(0.3, 0.3, 0.06, "#8a4a2c", 12), 0, 0.92, 0);
  add(g, cyl(0.12, 0.1, 0.24, "#3f6b8f", 8), 0.35, 0.95, -0.3);
  const colors = ["#c9413f", "#3f6b8f", "#6f9b57", "#d9a441", "#8a5a3c"];
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.3; const p = add(g, person(colors[i]), Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6); p.rotation.y = -a - Math.PI / 2; if (i === 4) p.scale.setScalar(0.7); }
  add(g, chineseRoof(4.6, 4.6, 0.7, C.tile, 0.3), 0, 2.4, 0);
  for (const [x, z] of [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]]) add(g, cyl(0.09, 0.1, 2.4, C.red, 8), x, 1.2, z);
  for (const [x, z] of [[-1.8, 1.8], [1.8, 1.8]]) add(g, lantern(0.9), x, 2.1, z + 0.3);
  g.userData.tick = tickChildren(g);
  return g;
}

export const PROPS: Record<string, () => P> = {
  cow: () => cow(false), pig,
  chicken: () => chicken(), tofuWorkshop, vegPlot, mushroomLogs, ricePaddy: () => ricePaddy(6), wheatField, chilliField, pepperTree, jars, market,
  wokKitchen, clayPotKitchen, griddleStall, prepTable, hotpot, noodleStall, dumplingStall, familyTable, teahouse,
  none: () => group(),
};

// ---------- card icons: the ingredient or tool itself, not the whole scene ----------

/** A plump, glossy, gently curved chilli: one smooth tapered tube along a bent curve, with a calyx and a curled stem. */
function chilliFruit(len = 1.2, bend = 0.35, color = "#d3342b"): THREE.Group {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(len * 0.35, bend * 0.45, 0), new THREE.Vector3(len * 0.7, bend * 0.35, bend * 0.15), new THREE.Vector3(len, -bend * 0.25, bend * 0.3),
  ]);
  const tub = 40, rad = 16, r0 = 0.19;
  const geo = new THREE.TubeGeometry(curve, tub, r0, rad, false);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const c = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= tub; i++) {
    const t = i / tub;
    const taper = Math.pow(1 - t, 0.62) * Math.min(1, 0.45 + t * 5);        // rounded shoulder, long taper to the tip
    curve.getPointAt(t, c);
    for (let k = 0; k <= rad; k++) {
      const idx = i * (rad + 1) + k;
      v.set(pos.getX(idx), pos.getY(idx), pos.getZ(idx)).sub(c).multiplyScalar(taper).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  const skin = new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.02 });
  const body = new THREE.Mesh(geo, skin); body.castShadow = true; g.add(body);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), skin); tip.position.copy(curve.getPointAt(1)); g.add(tip);
  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(r0 * 0.46, 12, 8), skin); shoulder.position.copy(curve.getPointAt(0)); g.add(shoulder);
  const green = new THREE.MeshStandardMaterial({ color: "#4f8a3c", roughness: 0.6 });
  const calyx = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.2, 7), green); calyx.rotation.z = Math.PI / 2; calyx.position.set(-0.03, 0.01, 0); g.add(calyx);
  const stemCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.08, 0.03, 0), new THREE.Vector3(-0.28, 0.14, 0.02), new THREE.Vector3(-0.4, 0.32, 0.05)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 8, 0.03, 6), green));
  return g;
}

export const ICONS: Record<string, () => P> = {
  chilli: () => { const g = group(); const a = chilliFruit(1.25, 0.4); a.position.set(-0.55, 0.2, 0.1); a.rotation.z = 0.15; g.add(a); const b = chilliFruit(1.05, 0.3, "#e0483a"); b.position.set(-0.35, 0.18, -0.35); b.rotation.set(0.6, 0.35, -0.25); g.add(b); const c = chilliFruit(0.9, 0.25, "#c9302a"); c.position.set(-0.2, 0.55, 0.15); c.rotation.set(-0.4, -0.5, 0.9); g.add(c); return g; },
  pepper: () => { const g = group(); const br = add(g, cyl(0.04, 0.05, 1.2, C.woodDark, 5), 0, 0.5, 0); br.rotation.z = 0.5; for (let i = 0; i < 14; i++) add(g, ball(0.09, "#b23a2f", 7), (rnd() - 0.5) * 0.9 - 0.1, 0.55 + rnd() * 0.7, (rnd() - 0.5) * 0.6); for (let i = 0; i < 4; i++) add(g, cone(0.12, 0.4, "#6f9f57", 4), (rnd() - 0.5) * 0.9, 0.6 + rnd() * 0.6, (rnd() - 0.5) * 0.6).rotation.z = rnd() * 3; return g; },
  jars: () => { const g = group(); add(g, ball(0.55, "#5c3a28", 12), 0, 0.6, 0).scale.y = 1.15; add(g, cyl(0.28, 0.3, 0.14, "#3c2a22", 10), 0, 1.25, 0); add(g, cone(0.32, 0.22, C.straw, 10), 0, 1.4, 0); add(g, cyl(0.22, 0.2, 0.18, "#b8302a", 10), 0.75, 0.09, 0.2); return g; },
  tofu: () => { const g = group(); for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) add(g, box(0.5, 0.26, 0.5, "#fbf7ee"), -0.28 + i * 0.56, 0.13 + k * 0.27, 0); add(g, ball(0.09, C.straw, 6), 0.7, 0.09, 0.4); add(g, ball(0.09, C.straw, 6), 0.85, 0.09, 0.2); return g; },
  veg: () => { const g = group(); const cu = add(g, cyl(0.12, 0.12, 0.9, "#4f8a3c", 7), -0.3, 0.12, 0); cu.rotation.z = 1.4; add(g, ball(0.34, "#8fc26a", 8), 0.35, 0.3, 0).scale.y = 0.8; add(g, ball(0.2, "#6f3d8a", 7), -0.1, 0.2, 0.5).scale.set(0.8, 1.2, 0.8); return g; },
  mushroom: () => { const g = group(); for (const [x, z, r] of [[-0.25, 0, 0.32], [0.3, 0.1, 0.24]]) { add(g, cyl(r * 0.35, r * 0.4, 0.3, "#e7d9c3", 6), x, 0.15, z); add(g, ball(r, "#8a5a3c", 9), x, 0.32, z).scale.y = 0.55; } return g; },
  rice: () => { const g = group(); add(g, cyl(0.42, 0.28, 0.32, "#f7f2e6", 12), 0, 0.16, 0); add(g, ball(0.38, "#fbf7ef", 9), 0, 0.36, 0).scale.y = 0.5; add(g, cyl(0.02, 0.02, 0.9, C.woodDark, 4), 0.2, 0.5, 0.1).rotation.z = -1.1; add(g, cyl(0.02, 0.02, 0.9, C.woodDark, 4), 0.28, 0.5, 0.18).rotation.z = -1.1; return g; },
  wheat: () => { const g = group();
    // a bamboo steamer of buns, a nest of noodles and a couple of pleated dumplings
    add(g, cyl(0.42, 0.42, 0.2, C.straw, 14), -0.35, 0.1, 0); add(g, cyl(0.38, 0.38, 0.03, "#c9b16a", 14), -0.35, 0.21, 0);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; add(g, ball(0.13, "#fbf7ee", 9), -0.35 + Math.cos(a) * 0.19, 0.31, Math.sin(a) * 0.19).scale.y = 0.85; }
    const nest = new THREE.MeshStandardMaterial({ color: "#f0dfa8", roughness: 0.7 });
    for (let i = 0; i < 9; i++) { const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0.25 + rnd() * 0.2, 0.05 + i * 0.03, -0.3 + rnd() * 0.2), new THREE.Vector3(0.55 + (rnd() - 0.5) * 0.2, 0.1 + i * 0.03, -0.1 + (rnd() - 0.5) * 0.3), new THREE.Vector3(0.7 + (rnd() - 0.5) * 0.2, 0.06 + i * 0.03, 0.25 + rnd() * 0.15)]); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 12, 0.022, 5), nest); m.castShadow = true; g.add(m); }
    for (let i = 0; i < 2; i++) { const d = add(g, ball(0.12, "#f3ead8", 8), 0.2 + i * 0.3, 0.1, 0.45); d.scale.set(1.4, 0.8, 0.9); for (let k = 0; k < 4; k++) add(d, ball(0.03, "#ece0c8", 5), -0.09 + k * 0.06, 0.1, 0); }
    return g; },
  cow: () => { const g = group(); add(g, cyl(0.62, 0.5, 0.1, "#f7f2e6", 16), 0, 0.05, 0); for (let i = 0; i < 7; i++) { const sl = add(g, box(0.34, 0.07, 0.22, i % 2 ? "#8e3b2f" : "#a44a3a"), -0.3 + i * 0.1, 0.13 + i * 0.03, (i % 2) * 0.1 - 0.05); sl.rotation.y = 0.5; sl.rotation.z = 0.15; } for (let i = 0; i < 4; i++) add(g, cone(0.035, 0.16, C.red, 5), -0.35 + i * 0.25, 0.14, 0.32).rotation.z = Math.PI / 2; for (let i = 0; i < 3; i++) add(g, cyl(0.03, 0.03, 0.2, "#7fbf5a", 4), -0.2 + i * 0.2, 0.15, -0.35).rotation.x = 1.4; return g; },
  pig: () => { const g = group(); add(g, cyl(0.6, 0.48, 0.1, "#f7f2e6", 16), 0, 0.05, 0); for (let i = 0; i < 6; i++) { const c = add(g, box(0.26, 0.24, 0.26, "#7a3a24"), -0.3 + (i % 3) * 0.3, 0.22, -0.15 + Math.floor(i / 3) * 0.3); add(c, box(0.27, 0.06, 0.27, "#c9744f"), 0, 0.1, 0); add(c, box(0.27, 0.05, 0.27, "#e8b48e"), 0, 0.0, 0); } for (let i = 0; i < 3; i++) add(g, cyl(0.03, 0.03, 0.18, "#7fbf5a", 4), -0.35 + i * 0.35, 0.36, 0.3).rotation.x = 1.4; return g; },
  chicken: () => chicken(),
  spices: () => { const g = group(); for (let i = 0; i < 4; i++) { const sack = add(g, cyl(0.24, 0.28, 0.36, "#d9c5a3", 8), -0.55 + i * 0.38, 0.18, (i % 2) * 0.3 - 0.15); add(sack, cone(0.2, 0.14, ["#8a5a3c", "#d9a441", "#4f4a3a", "#c0392b"][i], 8), 0, 0.25, 0); } for (let i = 0; i < 3; i++) { const st = add(g, cone(0.09, 0.04, "#6b3e1f", 8), -0.2 + i * 0.25, 0.42, 0.45); st.rotation.x = Math.PI; } return g; },
  fish: () => { const g = group(); add(g, box(1.4, 0.1, 0.8, C.white), 0, 0.05, 0); for (let i = 0; i < 2; i++) { const f = add(g, ball(0.16, i ? "#7f93a6" : "#b3bfc9", 9), -0.2 + i * 0.35, 0.2, (i - 0.5) * 0.35); f.scale.set(2.0, 0.6, 0.9); add(g, cone(0.1, 0.24, i ? "#7f93a6" : "#b3bfc9", 4), f.position.x - 0.4, 0.2, f.position.z).rotation.z = Math.PI / 2; add(g, ball(0.03, "#1f1f1f", 5), f.position.x + 0.22, 0.24, f.position.z + 0.12); } return g; },
  garlic: () => { const g = group(); const b = add(g, cyl(0.45, 0.36, 0.3, C.straw, 10), 0, 0.15, 0); for (let i = 0; i < 4; i++) add(b, ball(0.11, "#f1e9dc", 7), (rnd() - 0.5) * 0.4, 0.22, (rnd() - 0.5) * 0.4); add(g, box(0.34, 0.14, 0.2, "#d9b27a"), 0.55, 0.07, 0.3).rotation.y = 0.6; for (let i = 0; i < 3; i++) add(g, cyl(0.02, 0.03, 0.8, "#7fbf5a", 4), -0.5 + i * 0.08, 0.4, 0.4).rotation.z = 0.35; return g; },
  wok: () => { const g = group(); add(g, new THREE.Mesh(new THREE.SphereGeometry(0.6, 14, 7, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(C.iron, { side: THREE.DoubleSide })), 0, 0.6, 0); add(g, cyl(0.03, 0.03, 0.7, C.woodDark, 5), 0.55, 0.62, 0).rotation.z = -1.2; add(g, cone(0.25, 0.35, "#ff9a3c", 6), 0, 0.15, 0); for (let i = 0; i < 5; i++) add(g, ball(0.07, i % 2 ? C.red : "#8fc26a", 6), (rnd() - 0.5) * 0.5, 0.35, (rnd() - 0.5) * 0.5); return g; },
  claypot: () => { const g = group(); add(g, ball(0.5, "#5c3a28", 12), 0, 0.5, 0).scale.y = 0.85; add(g, cyl(0.34, 0.36, 0.1, "#3c2a22", 12), 0, 0.92, 0); add(g, ball(0.08, "#3c2a22", 6), 0, 1.02, 0); add(g, cyl(0.5, 0.5, 0.06, C.iron, 12), 0, 0.03, 0); return g; },
  griddle: () => { const g = group(); add(g, cyl(0.7, 0.7, 0.08, C.iron, 18), 0, 0.1, 0); for (let i = 0; i < 6; i++) add(g, ball(0.12, "#e9d6a8", 7), Math.cos(i * 1.05) * 0.4, 0.2, Math.sin(i * 1.05) * 0.4).scale.set(1.2, 0.7, 0.8); return g; },
  prep: () => { const g = group(); add(g, cyl(0.55, 0.55, 0.12, "#c99a63", 16), 0, 0.06, 0); add(g, box(0.5, 0.04, 0.16, C.steel), 0.05, 0.16, 0.1).rotation.y = 0.5; add(g, box(0.18, 0.06, 0.07, C.woodDark), -0.3, 0.16, 0.28).rotation.y = 0.5; add(g, cyl(0.09, 0.09, 0.5, "#5f9e46", 7), 0.1, 0.2, -0.2).rotation.z = 1.57; return g; },
  noodle: () => { const g = group(); add(g, cyl(0.5, 0.34, 0.36, "#f7f2e6", 14), 0, 0.18, 0); add(g, cyl(0.42, 0.42, 0.06, "#e2c46a", 14), 0, 0.38, 0); for (let i = 0; i < 6; i++) add(g, ball(0.06, C.red, 5), (rnd() - 0.5) * 0.5, 0.44, (rnd() - 0.5) * 0.5); add(g, cyl(0.02, 0.02, 1.0, C.woodDark, 4), 0.25, 0.7, 0).rotation.z = -0.9; return g; },
  dumpling: () => { const g = group(); add(g, cyl(0.5, 0.5, 0.16, C.straw, 14), 0, 0.08, 0); for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; add(g, ball(0.14, "#f3ead8", 7), Math.cos(a) * 0.25, 0.22, Math.sin(a) * 0.25).scale.set(1.3, 0.8, 0.9); } return g; },
  hotpot: () => { const g = group(); add(g, cyl(0.6, 0.55, 0.3, "#b87333", 18), 0, 0.15, 0); add(g, cyl(0.52, 0.52, 0.04, "#b8302a", 18), 0, 0.31, 0); add(g, box(1.02, 0.06, 0.05, "#d8a35a"), 0, 0.33, 0); for (let i = 0; i < 5; i++) add(g, cone(0.035, 0.16, C.red, 5), (rnd() - 0.5) * 0.7, 0.34, (rnd() - 0.5) * 0.7).rotation.z = Math.PI / 2; return g; },
  teahouse: () => { const g = group(); add(g, ball(0.32, "#3f6b8f", 10), 0, 0.32, 0).scale.y = 0.8; add(g, cyl(0.03, 0.03, 0.45, "#3f6b8f", 5), 0.36, 0.42, 0).rotation.z = -0.9; add(g, ball(0.06, "#3f6b8f", 6), 0, 0.62, 0); add(g, cyl(0.14, 0.11, 0.16, "#f7f2e6", 9), 0.6, 0.08, 0.3); add(g, cyl(0.14, 0.11, 0.16, "#f7f2e6", 9), 0.5, 0.08, -0.35); return g; },
};
