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
function hang(id: string, name: string, x: number, top: number, w: number, h: number, glow = 0) {
  const halo = glow ? `<ellipse class="halo" cx="${x + w / 2}" cy="${top + h * 0.42}" rx="${w * glow}" ry="${h * glow * 0.55}" fill="url(#haloP)" opacity=".8"/>` : "";
  return `<g id="${id}" data-px="${x + w / 2}" data-py="${top}">${halo}${img(name, x, top, w, h)}</g>`;
}
const HALO_DEFS = `<defs><radialGradient id="haloP"><stop offset="0" stop-color="#ffc070" stop-opacity=".75"/><stop offset=".45" stop-color="#ff8a3a" stop-opacity=".28"/><stop offset="1" stop-color="#ff6a2a" stop-opacity="0"/></radialGradient></defs>`;
/** a pulsing pool of light on a lamp that is painted into the wall */
const lamp = (id: string, cx: number, cy: number, rx: number, ry: number) => `<ellipse id="${id}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#haloP)" opacity=".7"/>`;

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
    <ellipse id="fire-glow" cx="1522" cy="500" rx="150" ry="110" fill="url(#fireP)"/>
    ${HALO_DEFS}
    ${lamp("lamp-1", 690, 60, 130, 120)}${lamp("lamp-2", 1330, 70, 120, 110)}${lamp("lamp-3", 898, 402, 70, 60)}${lamp("lamp-4", 1462, 300, 70, 70)}${lamp("lamp-5", 190, 100, 90, 90)}
  `;
}

function decorLayer() {
  return `
    ${HALO_DEFS}
    ${hang("lan-a", "lantern-a", 190, -8, 119 * 1.05, 282 * 1.05, 1.5)}
    ${hang("chilli-a", "chilli", 336, -8, 79 * 1.1, 280 * 1.1)}
    ${hang("garlic-a", "garlic", 1246, -8, 52 * 1.1, 258 * 1.1)}
    ${hang("lan-b", "lantern-b", 1372, -8, 81 * 1.15, 213 * 1.15, 1.6)}
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
    ${HALO_DEFS}
    ${hang("lan-c", "lantern-c", 26, -10, 98 * 1.5, 176 * 1.5, 1.4)}
  `;
}

// ---------- particles: steam over the pot, a rolling broth, leaves drifting down ----------

type Steam = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; age: number; drift: number };
type Bubble = { x: number; y: number; r: number; age: number; life: number };
type Leaf = { img: HTMLImageElement; x: number; y: number; vy: number; rot: number; vr: number; sway: number; age: number; life: number; s: number };

function makeFx() {
  const steam: Steam[] = [], bubbles: Bubble[] = [], leaves: Leaf[] = [];
  const leafImgs = [2, 3, 5, 6, 7, 8].map((i) => { const im = new Image(); im.src = A(`leaf-${i}`); return im; });
  const motes = Array.from({ length: 70 }, () => ({ x: rnd(0, 1600), y: rnd(-20, 720), vy: rnd(4, 11), r: rnd(1, 2.4), a: rnd(0.25, 0.6), f: rnd(0.4, 1.1), ph: rnd(0, 6.28) }));
  let acc = 0, bacc = 0, leafAt = 1;
  return (ctx: CanvasRenderingContext2D, t: number, dt: number) => {
    // broth: domes swell out of the surface, burst, and leave a ripple that spreads and fades
    bacc += dt * 14;
    while (bacc > 1) {
      bacc -= 1;
      const hot = Math.random() < 0.6 ? 0.55 : 1;   // most of the boil is around the middle
      const a = rnd(0, Math.PI * 2), r = Math.sqrt(Math.random()) * 0.92 * hot;
      bubbles.push({ x: POT.x + Math.cos(a) * POT.rx * r, y: POT.y + Math.sin(a) * POT.ry * r, r: rnd(3.5, 9), age: 0, life: rnd(0.55, 1.1) });
    }
    ctx.beginPath(); ctx.ellipse(POT.x, POT.y, POT.rx, POT.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,120,50,${(0.05 + (0.5 + Math.sin(t * 5.1) * 0.5) * 0.06).toFixed(3)})`; ctx.fill();
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.age += dt;
      const k = b.age / b.life;
      if (k >= 1) { bubbles.splice(i, 1); continue; }
      if (k < 0.62) {
        // a dome swelling out of the broth
        const g = Math.sin((k / 0.62) * Math.PI * 0.5), rr = b.r * g;
        const grad = ctx.createRadialGradient(b.x - rr * 0.35, b.y - rr * 0.45, rr * 0.1, b.x, b.y, rr);
        grad.addColorStop(0, "rgba(255,225,190,.85)"); grad.addColorStop(0.55, "rgba(240,110,60,.7)"); grad.addColorStop(1, "rgba(150,35,15,.55)");
        ctx.beginPath(); ctx.ellipse(b.x, b.y - rr * 0.25, rr, rr * 0.62, 0, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      } else {
        // burst: a ripple ring spreading out and dying
        const q = (k - 0.62) / 0.38, rr = b.r * (1 + q * 2.4);
        ctx.beginPath(); ctx.ellipse(b.x, b.y, rr, rr * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,215,170,${((1 - q) * 0.7).toFixed(2)})`; ctx.lineWidth = 1.6 - q; ctx.stroke();
        if (q < 0.25) { ctx.beginPath(); ctx.ellipse(b.x, b.y - b.r * 0.2, b.r * 0.5 * (1 - q * 4), b.r * 0.3 * (1 - q * 4), 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,235,205,.8)"; ctx.fill(); }
      }
    }
    // steam
    acc += dt * 22;
    while (acc > 1) { acc -= 1; steam.push({ x: rnd(POT.x - 120, POT.x + 120), y: rnd(POT.y - 40, POT.y - 16), vx: rnd(-8, 8), vy: rnd(-50, -80), r: rnd(16, 28), a: rnd(0.3, 0.46), life: rnd(3, 5), age: 0, drift: rnd(0, 6.28) }); }
    for (let i = steam.length - 1; i >= 0; i--) {
      const s = steam[i]; s.age += dt;
      const k = s.age / s.life;
      if (k >= 1) { steam.splice(i, 1); continue; }
      s.x += (s.vx + Math.sin(t * 1.3 + s.drift) * 14) * dt; s.y += s.vy * dt;
      const r = s.r + k * 85, a = s.a * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
      g.addColorStop(0, `rgba(255,246,236,${a})`); g.addColorStop(0.5, `rgba(255,240,226,${a * 0.45})`); g.addColorStop(1, "rgba(255,244,232,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
    }
    // warm motes drifting in the lantern light
    for (const m of motes) {
      m.y -= m.vy * dt; m.x += Math.sin(t * m.f + m.ph) * 9 * dt;
      if (m.y < -20) { m.y = 720; m.x = rnd(0, 1600); }
      const a = m.a * (0.55 + 0.45 * Math.sin(t * m.f * 3 + m.ph));
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,214,150,${a.toFixed(3)})`; ctx.fill();
    }
    // leaves and chilli tips let go of the vines and strings and tumble down
    leafAt -= dt;
    if (leafAt < 0) {
      leafAt = rnd(1.2, 2.6);
      const im = leafImgs[Math.floor(Math.random() * leafImgs.length)];
      if (im.complete && im.naturalWidth) leaves.push({ img: im, x: rnd(20, 1580), y: rnd(-60, 60), vy: rnd(22, 40), rot: rnd(0, 6.28), vr: rnd(-1.6, 1.6), sway: rnd(0, 6.28), age: 0, life: rnd(16, 24), s: rnd(0.8, 1.5) });
    }
    for (let i = leaves.length - 1; i >= 0; i--) {
      const l = leaves[i]; l.age += dt;
      if (l.age > l.life || l.y > 960) { leaves.splice(i, 1); continue; }
      const flutter = Math.sin(t * 1.1 + l.sway);
      l.y += (l.vy + flutter * 8) * dt; l.x += flutter * 34 * dt; l.rot += (l.vr + flutter * 1.2) * dt;
      const a = Math.min(1, l.age / 1.2) * Math.min(1, (l.life - l.age) / 2);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.scale(l.s * (0.75 + 0.25 * Math.abs(Math.cos(t * 1.7 + l.sway))), l.s);
      ctx.drawImage(l.img, -l.img.naturalWidth / 2, -l.img.naturalHeight / 2); ctx.restore();
    }
  };
}

function makeAnimate(root: HTMLElement) {
  const q = (id: string) => root.querySelector<SVGGraphicsElement>(`#${id}`);
  const rot = (el: SVGGraphicsElement | null, deg: number) => { el?.setAttribute("transform", `rotate(${deg.toFixed(2)} ${el.dataset.px} ${el.dataset.py})`); };
  const swing = [
    { el: q("lan-a"), ph: 0, sp: 0.7, amp: 5.5 }, { el: q("chilli-a"), ph: 1.4, sp: 0.62, amp: 4.5 },
    { el: q("garlic-a"), ph: 2.2, sp: 0.66, amp: 4 }, { el: q("lan-b"), ph: 3.1, sp: 0.78, amp: 5 }, { el: q("lan-c"), ph: 4.3, sp: 0.6, amp: 4.5 },
  ];
  const halos = swing.map((s) => s.el?.querySelector<SVGElement>(".halo") ?? null);
  const lamps = [1, 2, 3, 4, 5].map((i) => q(`lamp-${i}`));
  const fire = q("fire-glow");
  return (t: number) => {
    swing.forEach((s, i) => {
      rot(s.el, Math.sin(t * s.sp + s.ph) * s.amp + Math.sin(t * s.sp * 2.3 + s.ph) * 0.8);
      halos[i]?.setAttribute("opacity", (0.35 + flickerNoise(t, s.ph) * 0.65).toFixed(3));
    });
    lamps.forEach((l, i) => l?.setAttribute("opacity", (0.3 + flickerNoise(t, i * 1.9 + 7) * 0.7).toFixed(3)));
    fire?.setAttribute("opacity", (0.4 + flickerNoise(t, 2) * 0.6).toFixed(3));
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
    light: { x: POT.x, y: 320, color: "rgba(255,190,110,0.36)" },
    animate: makeAnimate,
  };
}
