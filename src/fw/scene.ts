// Living Scenes: the reusable pattern for stepping out of the 3D world into a living illustration.
//
//   3D world → approach the place → paper fade → living illustrated scene → back to exactly where you were.
//
// A scene is a stack of SVG layers (back to front) plus one particle canvas, all drawn in a 1600×900 stage
// that is "sliced" to the viewport. The engine adds parallax (mouse or slow idle drift), a slow camera push,
// a flickering warm light, the title block, the dish chips and the way back. Each scene only supplies its art,
// its particle painter and a tick that moves the small things (see scene-hotpot.ts).

import { animateRoomTouch, type RoomInteraction } from "./scene-props";
import { playRoomSound } from "./room-sound";
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

export type SceneHotspot = {
  id: string; label: string; text: string;
  activeLabel?: string;
  interaction?: RoomInteraction;
  x: number; y: number;
  portrait: { x: number; y: number };
};

export type SceneDef = {
  id: string;
  title: string;
  zh?: string;
  caption: string;
  layers: SceneLayer[];
  hotspots?: SceneHotspot[];
  react?: (id: string) => boolean | void;
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
  stallsLabel?: string;
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
  const anchoredRoom = Boolean(def.hotspots?.some(h => h.interaction));
  const el = document.createElement("section");
  el.id = "scene";
  el.className = "scene";
  el.classList.toggle("has-room-touches", Boolean(def.hotspots?.some(h => h.interaction)));
  el.dataset.scene = def.id;
  const layerHtml = def.layers.map((l, i) => `<div class="layer" data-depth="${l.depth}" data-i="${i}" ${l.blur ? `style="filter:blur(${l.blur}px)"` : ""}><svg viewBox="0 0 ${STAGE_W} ${STAGE_H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${l.svg}</svg></div>`);
  // the particle canvas sits between the layers at its own depth
  const fxIndex = def.layers.findIndex((l) => l.depth > def.fxDepth);
  layerHtml.splice(fxIndex < 0 ? layerHtml.length : fxIndex, 0, `<canvas class="layer fx" data-depth="${def.fxDepth}"></canvas>`);
  el.innerHTML = `
    <div class="scene-stage">
      ${layerHtml.join("")}
      ${def.hotspots?.length ? `<div class="scene-hotspots layer" data-depth="0.5">${def.hotspots.map((h, i) => `<button class="scene-hotspot${h.interaction ? ' room-touch' : ''}" data-hotspot="${i}" type="button" ${h.activeLabel ? 'aria-pressed="false"' : h.interaction && h.interaction.effect !== 'detail' ? '' : 'aria-expanded="false" aria-controls="scene-feedback"'} aria-label="${esc(h.label)}" title="${esc(h.label)}"><span>${h.interaction?.icon ?? '＋'}</span><b>${esc(h.label)}</b></button>${h.interaction ? `<div class="room-response" data-response="${i}" aria-hidden="true"></div>` : ''}`).join("")}</div>` : ""}
      <div class="scene-light"></div>
      <div class="scene-vignette"></div>
    </div>
    <div class="scene-ui">
      ${def.hotspots?.length ? `<aside id="scene-feedback" class="scene-feedback" hidden aria-label="Room discovery"><button type="button" aria-label="Close discovery">×</button><strong></strong><div class="scene-detail" hidden></div><p role="status" aria-live="polite"></p></aside>` : ""}
      <button class="scene-back" type="button">← Back to the village</button>
      <div class="scene-title">
        <div class="scene-heading">
        ${def.zh ? `<span class="zh">${esc(def.zh)}</span>` : ""}
        <h2>${esc(def.title)}</h2>
        <p>${esc(def.caption)}</p>
        </div>
        ${opts.stalls?.length ? `<div class="scene-stalls"><span class="lbl">${esc(opts.stallsLabel ?? "The stands")}</span>${opts.stalls.map((st, i) => `<button class="stall" type="button" data-i="${i}">${esc(st.label)}</button>`).join("")}</div>` : ""}
        ${def.hotspots?.length ? `<p class="scene-discovery" role="status" aria-live="polite">${def.id === "hotpot" ? "Touch the pot, the chilli bowl or a diner." : "Touch a small mark to explore the picture."}</p>` : ""}
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
    W = el.clientWidth || window.innerWidth || 1200; H = el.clientHeight || window.innerHeight || 675;   // a hidden pane reports 0×0: keep a sane stage for snapshots
    const portrait = W / H < 0.85;   // phones get the portrait painting where a room has one
    el.classList.toggle("portrait", portrait);
    el.querySelectorAll(".portrait-only").forEach((e) => e.setAttribute("visibility", portrait ? "visible" : "hidden"));
    el.querySelectorAll(".wide-only").forEach((e) => e.setAttribute("visibility", portrait ? "hidden" : "visible"));
    // the portrait painting covers whatever slice of the stage the screen shows (a tablet shows more than a phone)
    S = Math.max(W / STAGE_W, H / STAGE_H);
    const visibleW = W / S;
    el.querySelectorAll<SVGImageElement>("image.portrait-only").forEach((im) => { const w = Math.max(Number(im.dataset.minw), visibleW); im.setAttribute("x", ((STAGE_W - w) / 2).toFixed(1)); im.setAttribute("width", w.toFixed(1)); });
    if (isPortrait !== portrait) {
      const panel = el.querySelector<HTMLElement>('.scene-feedback');
      if (panel) panel.hidden = true;
      el.querySelectorAll('[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    }
    isPortrait = portrait;
    OX = (W - STAGE_W * S) / 2; OY = (H - STAGE_H * S) / 2;
    el.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((button) => {
      const spot = def.hotspots![Number(button.dataset.hotspot)];
      const interaction = spot.interaction;
      let point = portrait ? spot.portrait : spot;
      if (interaction) {
        button.hidden = Boolean(interaction.wideOnly && portrait);
        const fractions = portrait ? interaction.phone : interaction.wide;
        const label = button.querySelector<HTMLElement>('b')!;
        label.style.left = fractions[0] > .72 ? 'auto' : fractions[0] < .28 ? '0' : '50%';
        label.style.right = fractions[0] > .72 ? '0' : 'auto';
        label.style.transform = fractions[0] > .72 || fractions[0] < .28 ? 'none' : 'translateX(-50%)';
        const painted = el.querySelector<SVGImageElement>('image.portrait-only');
        const pw = painted ? Number(painted.getAttribute('width')) : visibleW;
        point = { x: portrait ? (STAGE_W - pw) / 2 + fractions[0] * pw : -8 + fractions[0] * 1616, y: -5 + fractions[1] * 910 };
        const response = el.querySelector<HTMLElement>(`[data-response="${button.dataset.hotspot}"]`)!;
        const diameter = interaction.extent[portrait ? 1 : 0] * (portrait ? pw : 1616) * S;
        response.hidden = button.hidden;
        response.style.cssText = `left:${OX + point.x * S}px;top:${OY + point.y * S}px;width:${diameter}px;height:${diameter}px`;
      }
      button.style.left = `${OX + point.x * S}px`;
      button.style.top = `${OY + point.y * S}px`;
    });
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

  const feedback = el.querySelector<HTMLElement>(".scene-feedback");
  let activeHotspot: HTMLButtonElement | null = null;
  function positionFeedback() {
    if (!feedback || feedback.hidden || !activeHotspot) return;
    const bounds = el.getBoundingClientRect(), button = activeHotspot.getBoundingClientRect();
    const left = button.left - bounds.left + button.width / 2 - feedback.offsetWidth / 2;
    const top = button.top - bounds.top - feedback.offsetHeight - 14;
    feedback.style.left = `${Math.max(12, Math.min(W - feedback.offsetWidth - 12, left))}px`;
    feedback.style.top = `${Math.max(12, Math.min(H - feedback.offsetHeight - 12, top < 64 ? button.bottom - bounds.top + 14 : top))}px`;
  }
  feedback?.querySelector("button")?.addEventListener("click", () => {
    feedback.hidden = true;
    activeHotspot?.setAttribute("aria-expanded", "false");
    activeHotspot?.focus({ preventScroll: true });
    activeHotspot = null;
  });
  const propCleanups = new Map<HTMLButtonElement, () => void>();
  el.querySelectorAll<HTMLButtonElement>("[data-hotspot]").forEach((button) => button.addEventListener("click", () => {
    const spot = def.hotspots![Number(button.dataset.hotspot)];
    if (spot.interaction) {
      propCleanups.get(button)?.();
      const response = el.querySelector<HTMLElement>(`[data-response="${button.dataset.hotspot}"]`)!;
      propCleanups.set(button, animateRoomTouch(response, spot.interaction, button));
      activeHotspot?.setAttribute("aria-expanded", "false");
      el.querySelector(".scene-discovery")!.textContent = spot.text;
      if (spot.interaction.effect !== 'detail') {
        if (feedback) feedback.hidden = true;
        activeHotspot = null;
        return;
      }
    }
    const pressed = def.react?.(spot.id);
    if (spot.activeLabel) {
      if (spot.id === 'pot') {
        propCleanups.get(button)?.();
        if (pressed) propCleanups.set(button, playRoomSound('broth'));
      }
      if (feedback) feedback.hidden = true;
      activeHotspot?.setAttribute("aria-expanded", "false");
      activeHotspot = null;
      const label = pressed ? spot.activeLabel : spot.label;
      button.setAttribute("aria-pressed", String(Boolean(pressed)));
      button.setAttribute("aria-label", label);
      button.title = label;
      button.querySelector("b")!.textContent = label;
      button.querySelector("span")!.textContent = pressed ? "≈" : "＋";
      return;
    }
    activeHotspot?.setAttribute("aria-expanded", "false");
    activeHotspot = button;
    button.setAttribute("aria-expanded", "true");
    if (feedback) {
      const detail = feedback.querySelector<HTMLElement>('.scene-detail')!;
      detail.hidden = !spot.interaction;
      if (spot.interaction) {
        const { folder, wide, phone } = spot.interaction;
        const [x, y] = isPortrait ? phone : wide;
        const height = 900, width = isPortrait ? Number(el.querySelector<SVGImageElement>('image.portrait-only')?.dataset.minw) || 506 : 1600;
        const cropW = width * (isPortrait ? .50 : .17), cropH = cropW * .56;
        const left = Math.max(0, Math.min(width - cropW, x * width - cropW / 2));
        const top = Math.max(0, Math.min(height - cropH, y * height - cropH / 2));
        detail.innerHTML = `<svg viewBox="${left} ${top} ${cropW} ${cropH}" xmlns="http://www.w3.org/2000/svg"><image href="${import.meta.env.BASE_URL}scenes/${folder}/${isPortrait ? 'portrait' : 'wide'}.jpg" width="${width}" height="${height}" preserveAspectRatio="none"/></svg>`;
      }
      feedback.querySelector("strong")!.textContent = spot.label;
      feedback.querySelector("p")!.textContent = spot.text;
      feedback.hidden = false;
      positionFeedback();
    }
  }));

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
    stage.style.transform = anchoredRoom ? "none" : `scale(${(arrive * push).toFixed(4)})`;
    for (const l of layers) {
      const d = Number(l.dataset.depth);
      const ax = px * d * 26, ay = py * d * 16;
      l.style.transform = anchoredRoom ? "none" : `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0) scale(${(1 + d * 0.05).toFixed(3)})`;
    }
    positionFeedback();
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
    propCleanups.forEach(cleanup => cleanup());
    propCleanups.clear();
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
      const sourceSvg = l.querySelector("svg");
      if (!sourceSvg) continue; // HTML discovery controls are not part of the artwork snapshot.
      const svg = sourceSvg.cloneNode(true) as SVGSVGElement;
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
