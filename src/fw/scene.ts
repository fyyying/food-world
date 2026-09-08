// Living Scenes: the reusable pattern for stepping out of the 3D world into a living illustration.
//
//   3D world → approach the place → paper fade → living illustrated scene → back to exactly where you were.
//
// A scene is a stack of SVG layers (back to front) plus one particle canvas, all drawn in a 1600×900 stage
// that is "sliced" to the viewport. The engine adds parallax (mouse or slow idle drift), a slow camera push,
// a flickering warm light, the title block, the dish chips and the way back. Each scene only supplies its art,
// its particle painter and a tick that moves the small things (see scene-hotpot.ts).

import { imageUrl } from "../data";
import { type EnrichedRecipe } from "./graph";
import { escapeHtml as esc } from "./plates";

export const STAGE_W = 1600, STAGE_H = 900;

export type SceneLayer = {
  /** inner SVG markup (no <svg> wrapper): drawn in a 1600×900 box */
  svg: string;
  /** 0 = pinned to the frame, 1 = full parallax */
  depth: number;
  /** blur radius in px for out-of-focus foreground pieces */
  blur?: number;
};

export type SceneDef = {
  id: string;
  title: string;
  zh?: string;
  caption: string;
  layers: SceneLayer[];
  /** particle canvas depth (steam, bubbles) */
  fxDepth: number;
  /** paints the particle canvas in stage coordinates; called every frame (`portrait` when a phone shows the portrait painting) */
  fx: (ctx: CanvasRenderingContext2D, t: number, dt: number, portrait: boolean) => void;
  /** where the lantern light lives (stage coordinates) and its colour */
  light: { x: number; y: number; color: string };
  /** binds the live SVG elements once and returns the per-frame animator */
  animate: (root: HTMLElement) => (t: number, dt: number) => void;
};

export type SceneOpts = {
  dishes: EnrichedRecipe[];
  /** heading over the dish thumbnails */
  label?: string;
  onDish: (r: EnrichedRecipe) => void;
  /** opens the place's story card (history, flavours, dishes) */
  onStory: () => void;
  /** the stands inside a place (a market's stalls): each opens its own card */
  stalls?: { label: string; onClick: () => void }[];
  onClose: () => void;
};

export type LivingScene = {
  el: HTMLElement;
  tick: (t: number, dt: number) => void;
  destroy: () => void;
  /** composite the layers to a canvas (for the dev screenshot hook) */
  snapshot: () => Promise<HTMLCanvasElement>;
};

/** small smooth noise for flicker: three incommensurate sines */
export const flickerNoise = (t: number, seed = 0) => 0.5 + (Math.sin(t * 7.3 + seed) * 0.45 + Math.sin(t * 13.1 + seed * 2.1) * 0.3 + Math.sin(t * 2.7 + seed * 0.7) * 0.25) * 0.5;

export function openLivingScene(def: SceneDef, opts: SceneOpts): LivingScene {
  const el = document.createElement("section");
  el.id = "scene";
  el.className = "scene";
  el.dataset.scene = def.id;
  const layerHtml = def.layers.map((l, i) => `<div class="layer" data-depth="${l.depth}" data-i="${i}" ${l.blur ? `style="filter:blur(${l.blur}px)"` : ""}><svg viewBox="0 0 ${STAGE_W} ${STAGE_H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${l.svg}</svg></div>`);
  // the particle canvas sits between the layers at its own depth
  const fxIndex = def.layers.findIndex((l) => l.depth > def.fxDepth);
  layerHtml.splice(fxIndex < 0 ? layerHtml.length : fxIndex, 0, `<canvas class="layer fx" data-depth="${def.fxDepth}"></canvas>`);
  el.innerHTML = `
    <div class="scene-stage">
      ${layerHtml.join("")}
      <div class="scene-light"></div>
      <div class="scene-vignette"></div>
    </div>
    <div class="scene-ui">
      <button class="scene-back" type="button">← Back to the village</button>
      <div class="scene-title">
        ${def.zh ? `<span class="zh">${esc(def.zh)}</span>` : ""}
        <h2>${esc(def.title)}</h2>
        <p>${esc(def.caption)}</p>
        ${opts.stalls?.length ? `<div class="scene-stalls"><span class="lbl">The stands</span>${opts.stalls.map((st, i) => `<button class="stall" type="button" data-i="${i}">${esc(st.label)}</button>`).join("")}</div>` : ""}
        <div class="scene-actions">
          <button class="story" type="button">📖 The story</button>
          ${opts.dishes.length ? `<span class="lbl">${esc(opts.label ?? "On the table")}</span><span class="plates">${opts.dishes.map((r) => `<button class="dish" type="button" data-recipe="${r.id}" title="${esc(r.title)}" aria-label="${esc(r.title)}"><span class="th" ${r.imageUrl ? `style="background-image:url(${imageUrl(r.id)})"` : ""}></span></button>`).join("")}</span>` : ""}
        </div>
      </div>
    </div>`;
  document.getElementById("app")!.appendChild(el);

  const stage = el.querySelector<HTMLElement>(".scene-stage")!;
  const layers = Array.from(el.querySelectorAll<HTMLElement>(".layer"));
  const fx = el.querySelector<HTMLCanvasElement>("canvas.fx")!;
  const light = el.querySelector<HTMLElement>(".scene-light")!;
  const ctx = fx.getContext("2d")!;

  // stage → viewport mapping (xMidYMid slice)
  let W = 1, H = 1, S = 1, OX = 0, OY = 0, dpr = 1, isPortrait = false;
  function resize() {
    W = el.clientWidth || window.innerWidth; H = el.clientHeight || window.innerHeight;
    const portrait = W / H < 0.85;   // phones get the portrait painting where a room has one
    el.classList.toggle("portrait", portrait);
    el.querySelectorAll(".portrait-only").forEach((e) => e.setAttribute("visibility", portrait ? "visible" : "hidden"));
    el.querySelectorAll(".wide-only").forEach((e) => e.setAttribute("visibility", portrait ? "hidden" : "visible"));
    // the portrait painting covers whatever slice of the stage the screen shows (a tablet shows more than a phone)
    const visibleW = W / S;
    el.querySelectorAll<SVGImageElement>("image.portrait-only").forEach((im) => { const w = Math.max(Number(im.dataset.minw), visibleW); im.setAttribute("x", ((STAGE_W - w) / 2).toFixed(1)); im.setAttribute("width", w.toFixed(1)); });
    isPortrait = portrait;
    S = Math.max(W / STAGE_W, H / STAGE_H);
    OX = (W - STAGE_W * S) / 2; OY = (H - STAGE_H * S) / 2;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr);
    fx.style.width = `${W}px`; fx.style.height = `${H}px`;
    const lx = OX + def.light.x * S, ly = OY + def.light.y * S;
    light.style.background = `radial-gradient(ellipse ${Math.round(W * 0.55)}px ${Math.round(H * 0.6)}px at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, ${def.light.color} 0%, rgba(255,160,70,0.10) 45%, rgba(20,8,4,0.25) 100%)`;
  }
  resize();
  window.addEventListener("resize", resize);

  // parallax: pointer when it moves, a slow drift when it does not
  let px = 0, py = 0, tx = 0, ty = 0, lastMove = -10;
  const onMove = (e: PointerEvent) => { tx = (e.clientX / W) * 2 - 1; ty = (e.clientY / H) * 2 - 1; lastMove = now; };
  el.addEventListener("pointermove", onMove);
  const onLeave = () => { lastMove = -10; };
  el.addEventListener("pointerleave", onLeave);

  el.querySelector(".scene-back")!.addEventListener("click", close);   // Escape is handled by the app, after cards
  el.querySelector(".story")!.addEventListener("click", () => opts.onStory());
  el.querySelectorAll<HTMLButtonElement>(".stall").forEach((b) => b.addEventListener("click", () => opts.stalls?.[Number(b.dataset.i)]?.onClick()));
  el.querySelectorAll<HTMLButtonElement>(".dish").forEach((b) => b.addEventListener("click", () => { const r = opts.dishes.find((x) => x.id === b.dataset.recipe); if (r) opts.onDish(r); }));

  const animate = def.animate(el);
  let now = 0, t0 = -1, alive = true;

  function tick(t: number, dt: number) {
    if (!alive) return;
    if (t0 < 0) t0 = t;
    now = t; const age = t - t0;
    // idle drift takes over a moment after the pointer stops
    if (now - lastMove > 1.6) { tx = Math.sin(age * 0.21) * 0.45; ty = Math.cos(age * 0.16) * 0.3; }
    px += (tx - px) * Math.min(1, dt * 2.2); py += (ty - py) * Math.min(1, dt * 2.2);
    // gentle camera push: ease in over ~40 s, then breathe
    const arrive = 1 + 0.05 * Math.pow(1 - Math.min(1, age / 2.4), 2);   // settle in from slightly too close
    const push = 1 + 0.07 * (1 - Math.pow(1 - Math.min(1, age / 42), 2)) + Math.sin(age * 0.35) * 0.004;
    stage.style.transform = `scale(${(arrive * push).toFixed(4)})`;
    for (const l of layers) {
      const d = Number(l.dataset.depth);
      const ax = px * d * 26, ay = py * d * 16;
      l.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0) scale(${(1 + d * 0.05).toFixed(3)})`;
    }
    light.style.opacity = (0.35 + flickerNoise(age) * 0.55).toFixed(3);   // the room breathes with the lanterns
    animate(age, dt);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.setTransform(S * dpr, 0, 0, S * dpr, OX * dpr, OY * dpr);
    def.fx(ctx, age, dt, isPortrait);
  }

  function close() {
    if (!alive) return;
    opts.onClose();
  }

  function destroy() {
    alive = false;
    window.removeEventListener("resize", resize);
    el.remove();
  }
  window.setTimeout(() => el.classList.add("in"), 20);

  async function snapshot() {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d")!;
    g.fillStyle = "#2a1410"; g.fillRect(0, 0, W, H);
    for (const l of layers) {
      if (l instanceof HTMLCanvasElement) { g.drawImage(l, 0, 0, W, H); continue; }
      const svg = l.querySelector("svg")!.cloneNode(true) as SVGSVGElement;
      // an SVG drawn as an image cannot fetch external pictures: inline them first
      for (const im of Array.from(svg.querySelectorAll("image"))) {
        const href = im.getAttribute("href"); if (!href || href.startsWith("data:")) continue;
        const blob = await fetch(href).then((r) => r.blob());
        const data = await new Promise<string>((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result as string); fr.readAsDataURL(blob); });
        im.setAttribute("href", data);
      }
      const xml = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      await new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`; });
      g.drawImage(img, 0, 0, W, H);
    }
    g.globalCompositeOperation = "soft-light"; g.fillStyle = "rgba(255,170,80,0.5)"; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "source-over";
    return c;
  }

  return { el, tick, destroy, snapshot };
}
