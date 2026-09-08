// The hotpot house, painted edition: Yingying's painted layers (public/scenes/hotpot, cut from the sheets by
// scripts/scenes/cut-hotpot-layers.py) stacked in the Living Scene stage. The wall, the table with its diners and
// the fence are paintings; the hanging decor, the steam, the bubbling broth, the fireplace and a few falling
// leaves are the parts that move.

import { flickerNoise, type SceneDef } from "./scene";

const A = (name: string) => `${import.meta.env.BASE_URL}scenes/hotpot/${name}.png`;
const img = (name: string, x: number, y: number, w: number, h: number, extra = "") => `<image href="${A(name)}" x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// native sizes of the cut layers (px) → stage units (1600 wide)
const WALL = { w: 1040, h: 422 }, TABLE = { w: 1040, h: 324 }, FENCE = { w: 1040, h: 168 };
const S = 1600 / 1040;
const WALL_H = WALL.h * S, TABLE_H = TABLE.h * S, FENCE_H = FENCE.h * S;
/** the pot in the painting, in stage coordinates */
const POT = { x: 831, y: 690, rx: 138, ry: 22 };

/** a hanging sprite: pivot at the top of the string so it can sway */
function hang(id: string, name: string, x: number, top: number, w: number, h: number) {
  return `<g id="${id}" data-px="${x + w / 2}" data-py="${top}">${img(name, x, top, w, h)}</g>`;
}

function backLayer() {
  return `
    <defs>
      <linearGradient id="floorP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1812"/><stop offset="1" stop-color="#140906"/></linearGradient>
      <linearGradient id="blendP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1812" stop-opacity="0"/><stop offset="1" stop-color="#2c1812" stop-opacity="1"/></linearGradient>
      <radialGradient id="fireP"><stop offset="0" stop-color="#ffb060" stop-opacity=".55"/><stop offset=".5" stop-color="#ff6a2a" stop-opacity=".18"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></radialGradient>
    </defs>
    <rect x="-100" y="-60" width="1800" height="1020" fill="#1c0e0a"/>
    ${img("wall", 0, 0, 1600, WALL_H, 'preserveAspectRatio="none"')}
    <rect x="-100" y="${WALL_H - 40}" width="1800" height="${960 - WALL_H}" fill="url(#floorP)"/>
    <rect x="-100" y="${WALL_H - 150}" width="1800" height="112" fill="url(#blendP)"/>
    <ellipse id="fire-glow" cx="1522" cy="500" rx="120" ry="90" fill="url(#fireP)"/>
  `;
}

function decorLayer() {
  return `
    ${hang("lan-a", "lantern-a", 190, -8, 119 * 1.05, 282 * 1.05)}
    ${hang("chilli-a", "chilli", 336, -8, 79 * 1.1, 280 * 1.1)}
    ${hang("garlic-a", "garlic", 1246, -8, 52 * 1.1, 258 * 1.1)}
    ${hang("lan-b", "lantern-b", 1372, -8, 81 * 1.15, 213 * 1.15)}
  `;
}

function tableLayer() {
  return img("table", 0, 900 - TABLE_H, 1600, TABLE_H, 'preserveAspectRatio="none"');
}

function frontLayer() {
  return `
    ${img("fence", 0, 900 - FENCE_H, 1600, FENCE_H, 'preserveAspectRatio="none"')}
    ${img("jar", -6, 722, 150 * 1.2, 167 * 1.2)}
    ${img("sign", 166, 738, 142 * 1.05, 169 * 1.05)}
    ${img("props-table", 1290, 782, 482 * 0.66, 182 * 0.66)}
    ${hang("lan-c", "lantern-c", 26, -10, 98 * 1.5, 176 * 1.5)}
  `;
}

// ---------- particles: steam over the pot, a rolling broth, leaves drifting down ----------

type Steam = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; age: number; drift: number };
type Bubble = { x: number; y: number; r: number; age: number; life: number };
type Leaf = { img: HTMLImageElement; x: number; y: number; vy: number; rot: number; vr: number; sway: number; age: number; life: number; s: number };

function makeFx() {
  const steam: Steam[] = [], bubbles: Bubble[] = [], leaves: Leaf[] = [];
  const leafImgs = [2, 3, 5, 6, 7, 8].map((i) => { const im = new Image(); im.src = A(`leaf-${i}`); return im; });
  let acc = 0, bacc = 0, leafAt = 2.5;
  return (ctx: CanvasRenderingContext2D, t: number, dt: number) => {
    // broth
    bacc += dt * 8;
    while (bacc > 1) {
      bacc -= 1;
      const a = rnd(0, Math.PI * 2), r = Math.sqrt(Math.random()) * 0.9;
      bubbles.push({ x: POT.x + Math.cos(a) * POT.rx * r, y: POT.y + Math.sin(a) * POT.ry * r, r: rnd(3, 7), age: 0, life: rnd(0.5, 0.9) });
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.age += dt;
      const k = b.age / b.life;
      if (k >= 1) { bubbles.splice(i, 1); continue; }
      const rr = b.r * (k < 0.75 ? k / 0.75 : 1 + (k - 0.75) * 1.6);
      ctx.beginPath(); ctx.ellipse(b.x, b.y, rr, rr * 0.5, 0, 0, Math.PI * 2);
      if (k < 0.75) { ctx.fillStyle = "rgba(255,130,80,.7)"; ctx.fill(); ctx.beginPath(); ctx.ellipse(b.x - rr * 0.3, b.y - rr * 0.2, rr * 0.3, rr * 0.16, 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,235,210,.7)"; ctx.fill(); }
      else { ctx.strokeStyle = `rgba(255,180,120,${(1 - k) * 2})`; ctx.lineWidth = 1.4; ctx.stroke(); }
    }
    for (let i = 0; i < 3; i++) {
      const ph = t * 0.9 + i * 2.1;
      ctx.beginPath(); ctx.ellipse(POT.x + Math.sin(ph) * POT.rx * 0.6, POT.y + Math.cos(ph * 0.7) * POT.ry * 0.5, 22 + Math.sin(ph * 3) * 5, 5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,200,140,.22)"; ctx.lineWidth = 2; ctx.stroke();
    }
    // steam
    acc += dt * 13;
    while (acc > 1) { acc -= 1; steam.push({ x: rnd(POT.x - 110, POT.x + 110), y: rnd(POT.y - 40, POT.y - 20), vx: rnd(-6, 6), vy: rnd(-44, -68), r: rnd(12, 20), a: rnd(0.2, 0.32), life: rnd(3, 4.6), age: 0, drift: rnd(0, 6.28) }); }
    for (let i = steam.length - 1; i >= 0; i--) {
      const s = steam[i]; s.age += dt;
      const k = s.age / s.life;
      if (k >= 1) { steam.splice(i, 1); continue; }
      s.x += (s.vx + Math.sin(t * 1.3 + s.drift) * 14) * dt; s.y += s.vy * dt;
      const r = s.r + k * 60, a = s.a * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
      g.addColorStop(0, `rgba(255,244,232,${a})`); g.addColorStop(1, "rgba(255,244,232,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
    }
    // a leaf lets go of the vine now and then
    leafAt -= dt;
    if (leafAt < 0) {
      leafAt = rnd(4, 9);
      const im = leafImgs[Math.floor(Math.random() * leafImgs.length)];
      if (im.complete && im.naturalWidth) leaves.push({ img: im, x: Math.random() < 0.5 ? rnd(40, 260) : rnd(1380, 1560), y: rnd(-40, 120), vy: rnd(28, 44), rot: rnd(0, 6.28), vr: rnd(-1.2, 1.2), sway: rnd(0, 6.28), age: 0, life: rnd(14, 20), s: rnd(0.9, 1.4) });
    }
    for (let i = leaves.length - 1; i >= 0; i--) {
      const l = leaves[i]; l.age += dt;
      if (l.age > l.life || l.y > 960) { leaves.splice(i, 1); continue; }
      l.y += l.vy * dt; l.x += Math.sin(t * 0.9 + l.sway) * 22 * dt; l.rot += l.vr * dt;
      const a = Math.min(1, l.age / 1.2) * Math.min(1, (l.life - l.age) / 2);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.scale(l.s, l.s);
      ctx.drawImage(l.img, -l.img.naturalWidth / 2, -l.img.naturalHeight / 2); ctx.restore();
    }
  };
}

function makeAnimate(root: HTMLElement) {
  const q = (id: string) => root.querySelector<SVGGraphicsElement>(`#${id}`);
  const rot = (el: SVGGraphicsElement | null, deg: number) => { el?.setAttribute("transform", `rotate(${deg.toFixed(2)} ${el.dataset.px} ${el.dataset.py})`); };
  const swing = [
    { el: q("lan-a"), ph: 0, sp: 0.9, amp: 2.4 }, { el: q("chilli-a"), ph: 1.4, sp: 0.75, amp: 1.5 },
    { el: q("garlic-a"), ph: 2.2, sp: 0.8, amp: 1.6 }, { el: q("lan-b"), ph: 3.1, sp: 1.05, amp: 2.2 }, { el: q("lan-c"), ph: 4.3, sp: 0.85, amp: 1.8 },
  ];
  const fire = q("fire-glow");
  return (t: number) => {
    for (const s of swing) rot(s.el, Math.sin(t * s.sp + s.ph) * s.amp + Math.sin(t * s.sp * 2.3 + s.ph) * 0.4);
    fire?.setAttribute("opacity", (0.6 + flickerNoise(t, 2) * 0.4).toFixed(3));
  };
}

export function hotpotPaintedScene(): SceneDef {
  return {
    id: "hotpot",
    title: "Hotpot house",
    zh: "火锅",
    caption: "A divided pot rolling on the burner, thin beef in and out in seconds, and a table that never empties.",
    layers: [
      { svg: backLayer(), depth: 0.2 },
      { svg: decorLayer(), depth: 0.42 },
      { svg: tableLayer(), depth: 0.5 },
      { svg: frontLayer(), depth: 1, blur: 0.6 },
    ],
    fxDepth: 0.5,
    fx: makeFx(),
    light: { x: POT.x, y: 320, color: "rgba(255,190,110,0.28)" },
    animate: makeAnimate,
  };
}
