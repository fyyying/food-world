// Painted Living Scenes from the delivered asset sheets (public/scenes/<folder>, cut by scripts/scenes/cut-sheets.py).
// The composed painting ("cover", portrait) stands in the middle of the stage with feathered edges; the wide painting
// ("back") fills the room behind it, blurred and dimmed; cut-out pieces hang from the top and stand at the bottom
// corners. Life comes from the engine's parallax and light plus steam, fire, lamps, motes, leaves and the like.

import { flickerNoise, STAGE_W, STAGE_H, type SceneDef } from "./scene";
import sizes from "./scenes.json";
import propSizes from "./scenes-props.json";

const SIZES = sizes as unknown as Record<string, Record<string, [number, number]>>;
const PROPS = (propSizes as unknown as { rooms: Record<string, Record<string, [number, number]>>; props: Record<string, [number, number]> });
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const url = (folder: string, name: string) => `${import.meta.env.BASE_URL}scenes/${folder}/${name}.png`;
const propUrl = (name: string) => `${import.meta.env.BASE_URL}scenes/props/${name}.webp`;

export type Sprite = {
  /** a piece from the room's cut sheet, or, with `prop`, a sprite from the shared prop library (public/scenes/props) */
  name: string;
  prop?: boolean;
  /** left edge on the stage; with `mirror` the sprite is flipped around its own centre */
  x: number;
  /** top edge; omit to stand the sprite on the stage floor */
  y?: number;
  /** width on the stage; height follows the picture */
  w: number;
  /** degrees of sway about the hanging point */
  sway?: number;
  /** a pulsing pool of lantern light behind it, as a fraction of its width */
  halo?: number;
  mirror?: boolean;
};

export type Walker = { name: string; w: number; y: number; from: number; to: number; dur: number; every: number; fly?: boolean };

export type PaintedCfg = {
  id: string;
  folder: string;
  title: string;
  zh: string;
  caption: string;
  night?: boolean;
  /** pieces hanging from the top, mid depth */
  hang?: Sprite[];
  /** pieces in the front, full parallax */
  front?: Sprite[];
  /** steam sources on the stage */
  steam?: { x: number; y: number; w: number; rate: number; a?: number }[];
  /** open fire: a flickering pool of orange light */
  fire?: { x: number; y: number; rx: number; ry: number }[];
  /** lamps painted into the cover that should pulse */
  lamps?: { x: number; y: number; r: number }[];
  /** seconds between falling leaves (0: none) */
  leaves?: number;
  /** motes drifting in the light */
  motes?: number;
  /** night sky: twinkling stars and sky lanterns rising */
  sky?: boolean;
  /** a slow river mist */
  mist?: { x: number; y: number; w: number; h: number };
  /** the room is one painting that fills the stage (public/scenes/<folder>/wide.jpg), with a portrait twin for phones */
  painting?: boolean;
  /** figures that walk across the front now and then */
  walkers?: Walker[];
  /** the portrait painting is a different composition: where its steam, fire, lamps and flyers are */
  portrait?: { steam?: PaintedCfg["steam"]; fire?: PaintedCfg["fire"]; lamps?: PaintedCfg["lamps"]; walkers?: Walker[] };
  light: { x: number; y: number; color: string };
};

/** where the cover painting lands on the stage (full height, centred) */
export function coverBox(folder: string) {
  const [w, h] = SIZES[folder].cover;
  const W = (STAGE_H * w) / h;
  return { x: (STAGE_W - W) / 2, y: 0, w: W, h: STAGE_H };
}
/** a point inside a room's portrait painting (centred, full height), as fractions of it */
export const pAt = (folder: string, fx: number, fy: number) => { const [w, h] = PROPS.rooms[folder].portrait; const pw = (STAGE_H * w) / h; return { x: (STAGE_W - pw) / 2 + fx * pw, y: fy * STAGE_H }; };
/** a point inside the cover painting, as fractions of it */
export const at = (folder: string, fx: number, fy: number) => { const b = coverBox(folder); return { x: b.x + fx * b.w, y: b.y + fy * b.h }; };

function size(folder: string, name: string, w: number, prop = false) { const [pw, ph] = prop ? PROPS.props[name] : SIZES[folder][name]; return { w, h: (w * ph) / pw }; }

function sprite(folder: string, s: Sprite, id: string, group: "hang" | "front") {
  const { w, h } = size(folder, s.name, s.w, s.prop);
  const y = s.y ?? STAGE_H - h + 4;   // standing pieces sit on the bottom edge; their cut edges are dissolved by the cutter
  const cx = s.x + w / 2;
  const flip = s.mirror ? `transform="translate(${(2 * cx).toFixed(1)} 0) scale(-1 1)"` : "";
  const halo = s.halo ? `<ellipse class="halo" cx="${cx.toFixed(1)}" cy="${(y + h * 0.4).toFixed(1)}" rx="${(w * s.halo).toFixed(1)}" ry="${(h * s.halo * 0.6).toFixed(1)}" fill="url(#haloQ)" opacity=".8"/>` : "";
  const image = `<image href="${s.prop ? propUrl(s.name) : url(folder, s.name)}" x="${s.x}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" ${flip}/>`;
  return group === "hang" && s.sway
    ? `<g id="${id}" class="sway" data-amp="${s.sway}" data-px="${cx.toFixed(1)}" data-py="${y.toFixed(1)}">${halo}${image}</g>`
    : `<g id="${id}">${halo}${image}</g>`;
}

const HALO = `<defs><radialGradient id="haloQ"><stop offset="0" stop-color="#ffc070" stop-opacity=".7"/><stop offset=".45" stop-color="#ff8a3a" stop-opacity=".26"/><stop offset="1" stop-color="#ff6a2a" stop-opacity="0"/></radialGradient>
  <radialGradient id="fireQ"><stop offset="0" stop-color="#ffb060" stop-opacity=".6"/><stop offset=".5" stop-color="#ff6a2a" stop-opacity=".2"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></radialGradient></defs>`;

export function paintedScene(cfg: PaintedCfg): SceneDef {
  const f = cfg.folder;
  const cb = cfg.painting ? { x: 0, y: 0, w: STAGE_W, h: STAGE_H } : coverBox(f);
  const dim = cfg.night ? 0.5 : 0.42;

  // the sides of the stage continue the painting itself: mirrored, out of focus and dimmed, in the same layer,
  // so nothing in the surroundings contradicts the room or slides against it
  const backLayer = `
    <rect x="-100" y="-60" width="1800" height="1020" fill="${cfg.night ? "#0d0a14" : "#1c110c"}"/>`;

  const hangLayer = `${HALO}${(cfg.hang ?? []).map((s, i) => sprite(f, s, `hang-${i}`, "hang")).join("")}`;

  const allWalkers: { wk: Walker; cls: string }[] = [...(cfg.walkers ?? []).map((wk) => ({ wk, cls: cfg.portrait?.walkers ? "wide-only" : "" })), ...(cfg.portrait?.walkers ?? []).map((wk) => ({ wk, cls: "portrait-only" }))];
  const walkerSvg = ({ wk, cls }: { wk: Walker; cls: string }, i: number) => { const { w, h } = size(f, wk.name, wk.w, true); return `<g id="walk-${i}" class="${cls}" opacity="0"><image href="${propUrl(wk.name)}" x="0" y="${(wk.y - h).toFixed(1)}" width="${w}" height="${h.toFixed(1)}"/></g>`; };
  // people walk across the front; birds fly in the painting's own sky, so they live in the painting's layer
  const walkers = allWalkers.map((w, i) => (w.wk.fly ? "" : walkerSvg(w, i))).join("");
  const flyers = allWalkers.map((w, i) => (w.wk.fly ? walkerSvg(w, i) : "")).join("");
  const cover = url(f, "cover");
  const painting = cfg.painting ? `${import.meta.env.BASE_URL}scenes/${f}/` : null;
  const pb = painting ? PROPS.rooms[f].portrait : null;
  const pw = pb ? (STAGE_H * pb[0]) / pb[1] : 0;
  const paint = (x: number, mirrorAt?: number) => `<image href="${cover}" x="${x.toFixed(1)}" y="-8" width="${cb.w.toFixed(1)}" height="${STAGE_H + 16}" preserveAspectRatio="none" ${mirrorAt !== undefined ? `transform="translate(${(2 * mirrorAt).toFixed(1)} 0) scale(-1 1)"` : ""}/>`;
  // one continuous strip (mirror · painting · mirror) blurred as a whole, so the blur runs across the seams
  const wings = `<g filter="url(#wingBlur)">${paint(cb.x, cb.x)}${paint(cb.x)}${paint(cb.x, cb.x + cb.w)}</g>`;
  const coverLayer = `
    <defs>
      <filter id="wingBlur" x="-2%" y="-2%" width="104%" height="104%"><feGaussianBlur stdDeviation="8"/></filter>
      <linearGradient id="featherQ" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
      <mask id="coverMask"><rect x="${cb.x}" y="0" width="${cb.w}" height="${STAGE_H}" fill="url(#featherQ)"/></mask>
    </defs>
    ${HALO}
    ${painting
      ? `<image href="${painting}wide.jpg" x="-8" y="-5" width="${STAGE_W + 16}" height="${STAGE_H + 10}" preserveAspectRatio="none"/>
         <image class="portrait-only" data-minw="${pw.toFixed(1)}" href="${painting}portrait.jpg" x="${((STAGE_W - pw) / 2).toFixed(1)}" y="-5" width="${pw.toFixed(1)}" height="${STAGE_H + 10}" preserveAspectRatio="xMidYMid slice"/>`
      : `${wings}
    <rect x="-100" y="-60" width="${(cb.x + 140).toFixed(1)}" height="1020" fill="rgba(8,4,2,${dim})"/><rect x="${(cb.x + cb.w - 40).toFixed(1)}" y="-60" width="900" height="1020" fill="rgba(8,4,2,${dim})"/>
    <image href="${cover}" x="${cb.x.toFixed(1)}" y="0" width="${cb.w.toFixed(1)}" height="${STAGE_H}" preserveAspectRatio="none" mask="url(#coverMask)"/>`}
    ${(cfg.fire ?? []).map((o, i) => `<ellipse id="fire-${i}" class="${cfg.portrait?.fire ? "wide-only" : ""}" cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" fill="url(#fireQ)"/>`).join("")}
    ${(cfg.portrait?.fire ?? []).map((o, i) => `<ellipse id="fire-p${i}" class="portrait-only" cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" rx="${o.rx}" ry="${o.ry}" fill="url(#fireQ)"/>`).join("")}
    ${(cfg.lamps ?? []).map((o, i) => `<ellipse id="lamp-${i}" class="${cfg.portrait?.lamps ? "wide-only" : ""}" cx="${o.x}" cy="${o.y}" rx="${o.r}" ry="${o.r * 0.85}" fill="url(#haloQ)" opacity=".7"/>`).join("")}
    ${(cfg.portrait?.lamps ?? []).map((o, i) => `<ellipse id="lamp-p${i}" class="portrait-only" cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" rx="${o.r}" ry="${o.r * 0.85}" fill="url(#haloQ)" opacity=".7"/>`).join("")}
    ${flyers}`;

  const frontLayer = `${HALO}${(cfg.front ?? []).map((s, i) => sprite(f, s, `front-${i}`, "front")).join("")}${walkers}`;

  return {
    id: cfg.id, title: cfg.title, zh: cfg.zh, caption: cfg.caption,
    // with a full painting the hanging pieces must sit in front of it; with a cut sheet they hang behind the cover
    layers: cfg.painting
      ? [{ svg: backLayer, depth: 0.15 }, { svg: coverLayer, depth: 0.5 }, { svg: hangLayer, depth: 0.62 }, { svg: frontLayer, depth: 1, blur: 0.5 }]
      : [{ svg: backLayer, depth: 0.15 }, { svg: hangLayer, depth: 0.42 }, { svg: coverLayer, depth: 0.5 }, { svg: frontLayer, depth: 1, blur: 0.5 }],
    fxDepth: 0.5,
    fx: makeFx(cfg),
    light: cfg.light,
    animate: (root) => {
      const q = (s: string) => Array.from(root.querySelectorAll<SVGGraphicsElement>(s));
      const sways = q("g.sway").map((el, i) => ({ el, amp: Number(el.dataset.amp), ph: i * 1.7, sp: 0.6 + (i % 3) * 0.12, halo: el.querySelector<SVGElement>(".halo") }));
      const fires = q("[id^=fire-]"), lamps = q("[id^=lamp-]");
      const staticHalos = q("g:not(.sway) > .halo");
      const walks = allWalkers.map(({ wk }, i) => ({ el: q(`#walk-${i}`)[0], wk, next: 3 + i * 7, start: -1 }));
      return (t: number) => {
        for (const w of walks) {
          if (!w.el) continue;
          if (w.start < 0 && t > w.next) w.start = t;
          if (w.start >= 0) {
            const k = (t - w.start) / w.wk.dur;
            if (k < 0) { w.start = t; continue; }   // the clock moved back (debug stepping): restart the crossing
            if (k >= 1) { w.start = -1; w.next = t + w.wk.every; w.el.setAttribute("opacity", "0"); continue; }
            const x = w.wk.from + (w.wk.to - w.wk.from) * k;
            const bob = w.wk.fly ? Math.sin(t * 1.6) * 9 : Math.abs(Math.sin(t * 5.5)) * 4;   // a glide, or footsteps
            const tilt = w.wk.fly ? Math.sin(t * 1.6 + 1) * 2 : Math.sin(t * 5.5) * 1.2;
            w.el.setAttribute("opacity", String(Math.min(1, k * 8, (1 - k) * 8)));
            w.el.setAttribute("transform", `translate(${x.toFixed(1)} ${(-bob).toFixed(1)}) rotate(${tilt.toFixed(2)} ${(w.wk.w / 2).toFixed(0)} ${w.wk.y})`);
          }
        }
        sways.forEach((s) => {
          s.el.setAttribute("transform", `rotate(${(Math.sin(t * s.sp + s.ph) * s.amp + Math.sin(t * s.sp * 2.3 + s.ph) * 0.6).toFixed(2)} ${s.el.dataset.px} ${s.el.dataset.py})`);
          s.halo?.setAttribute("opacity", (0.35 + flickerNoise(t, s.ph) * 0.65).toFixed(3));
        });
        staticHalos.forEach((h, i) => h.setAttribute("opacity", (0.35 + flickerNoise(t, i * 2.3 + 1) * 0.65).toFixed(3)));
        fires.forEach((el, i) => el.setAttribute("opacity", (0.45 + flickerNoise(t, i + 2) * 0.55).toFixed(3)));
        lamps.forEach((el, i) => el.setAttribute("opacity", (0.3 + flickerNoise(t, i * 1.9 + 7) * 0.7).toFixed(3)));
      };
    },
  };
}

// ---------- particles ----------

type Steam = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; age: number; drift: number };
type Leaf = { img: HTMLImageElement; x: number; y: number; vy: number; rot: number; vr: number; sway: number; age: number; life: number; s: number };
type Lantern = { x: number; y: number; vy: number; sway: number; age: number; life: number; r: number };

function makeFx(cfg: PaintedCfg) {
  const steam: Steam[] = [], leaves: Leaf[] = [], lanterns: Lantern[] = [];
  const leafImgs = [2, 3, 5, 6, 7, 8].map((i) => { const im = new Image(); im.src = `${import.meta.env.BASE_URL}scenes/hotpot/leaf-${i}.png`; return im; });
  const motes = Array.from({ length: cfg.motes ?? 0 }, () => ({ x: rnd(0, STAGE_W), y: rnd(-20, 720), vy: rnd(4, 11), r: rnd(1, 2.4), a: rnd(0.25, 0.6), f: rnd(0.4, 1.1), ph: rnd(0, 6.28) }));
  const stars = cfg.sky ? Array.from({ length: 90 }, () => ({ x: rnd(0, STAGE_W), y: rnd(0, 300), r: rnd(0.6, 1.8), ph: rnd(0, 6.28), f: rnd(0.5, 2.2) })) : [];
  const accs = Array.from({ length: Math.max(cfg.steam?.length ?? 0, cfg.portrait?.steam?.length ?? 0) }, () => 0);
  let leafAt = 1.5, lanternAt = 1;
  return (ctx: CanvasRenderingContext2D, t: number, dt: number, portrait: boolean) => {
    const emitters = (portrait && cfg.portrait?.steam) || cfg.steam || [];
    if (cfg.mist) {
      const m = cfg.mist;
      for (let i = 0; i < 4; i++) {
        const x = m.x + ((t * 12 + i * m.w * 0.3) % (m.w * 1.2)) - m.w * 0.1, y = m.y + Math.sin(t * 0.4 + i) * m.h * 0.2, r = m.w * 0.22;
        ctx.save(); ctx.translate(x, y); ctx.scale(1, m.h / r);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, "rgba(235,225,240,.09)"); g.addColorStop(1, "rgba(235,225,240,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    for (const s of stars) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.f + s.ph));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,250,235,${a.toFixed(3)})`; ctx.fill();
    }
    if (cfg.sky) {
      lanternAt -= dt;
      if (lanternAt < 0) { lanternAt = rnd(1.5, 3.5); lanterns.push({ x: rnd(200, 1400), y: rnd(520, 640), vy: rnd(14, 24), sway: rnd(0, 6.28), age: 0, life: rnd(22, 34), r: rnd(3, 6) }); }
      for (let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i]; l.age += dt;
        if (l.age > l.life) { lanterns.splice(i, 1); continue; }
        l.y -= l.vy * dt; l.x += Math.sin(t * 0.5 + l.sway) * 6 * dt;
        const a = Math.min(1, l.age / 2) * Math.min(1, (l.life - l.age) / 4) * (0.7 + 0.3 * Math.sin(t * 5 + l.sway));
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * 4);
        g.addColorStop(0, `rgba(255,200,110,${(a * 0.8).toFixed(3)})`); g.addColorStop(0.3, `rgba(255,140,60,${(a * 0.35).toFixed(3)})`); g.addColorStop(1, "rgba(255,120,40,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y, l.r * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,236,190,${a.toFixed(3)})`; ctx.beginPath(); ctx.ellipse(l.x, l.y, l.r * 0.8, l.r, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
    emitters.forEach((e, i) => {
      accs[i] += dt * e.rate;
      while (accs[i] > 1) { accs[i] -= 1; steam.push({ x: rnd(e.x - e.w / 2, e.x + e.w / 2), y: rnd(e.y - 8, e.y + 8), vx: rnd(-6, 6), vy: rnd(-42, -70), r: rnd(10, 18) * Math.max(0.6, e.w / 120), a: (e.a ?? 0.34) * rnd(0.8, 1.2), life: rnd(2.6, 4.4), age: 0, drift: rnd(0, 6.28) }); }
    });
    for (let i = steam.length - 1; i >= 0; i--) {
      const s = steam[i]; s.age += dt;
      const k = s.age / s.life;
      if (k >= 1) { steam.splice(i, 1); continue; }
      s.x += (s.vx + Math.sin(t * 1.3 + s.drift) * 12) * dt; s.y += s.vy * dt;
      const r = s.r + k * 70, a = s.a * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
      g.addColorStop(0, `rgba(255,246,236,${a})`); g.addColorStop(0.5, `rgba(255,240,226,${a * 0.45})`); g.addColorStop(1, "rgba(255,244,232,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
    }
    for (const m of motes) {
      m.y -= m.vy * dt; m.x += Math.sin(t * m.f + m.ph) * 9 * dt;
      if (m.y < -20) { m.y = 720; m.x = rnd(0, STAGE_W); }
      const a = m.a * (0.55 + 0.45 * Math.sin(t * m.f * 3 + m.ph));
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fillStyle = cfg.night ? `rgba(255,225,170,${a.toFixed(3)})` : `rgba(255,214,150,${a.toFixed(3)})`; ctx.fill();
    }
    if (cfg.leaves) {
      leafAt -= dt;
      if (leafAt < 0) {
        leafAt = rnd(cfg.leaves * 0.7, cfg.leaves * 1.4);
        const im = leafImgs[Math.floor(Math.random() * leafImgs.length)];
        if (im.complete && im.naturalWidth) leaves.push({ img: im, x: rnd(20, STAGE_W - 20), y: rnd(-60, 60), vy: rnd(22, 40), rot: rnd(0, 6.28), vr: rnd(-1.6, 1.6), sway: rnd(0, 6.28), age: 0, life: rnd(16, 24), s: rnd(0.8, 1.5) });
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
    }
  };
}
