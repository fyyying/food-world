/** The world engine: base slab, interactive objects, dish markers, steam, hover and highlight. Each world supplies a layout. */
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { AREAS, type EnrichedRecipe, type WorldId, type WorldObject } from "./graph";
import { mat, add, fish, type P } from "./props";
import { plateTexture, escapeHtml as esc } from "../world/plates";

export type Placed = { obj: WorldObject; group: THREE.Group; hit: THREE.Mesh; labelEl: HTMLElement; anchor: THREE.Vector3; top: number; ring: THREE.Mesh; small: boolean };
export type DishMarker = { recipe: EnrichedRecipe; host: Placed; group: THREE.Group; hit: THREE.Mesh; labelEl: HTMLElement; anchor: THREE.Vector3; ring: THREE.Mesh; base: THREE.Vector3; shown: boolean };

export type Diorama = {
  group: THREE.Group;
  placed: Placed[];
  dishes: DishMarker[];
  bounds: THREE.Box3;
  tick: (t: number, dt: number) => void;
  highlight: (objectIds: Set<string> | null, dishIds: Set<string> | null) => void;
  hover: (thing: Placed | DishMarker | null) => void;
  /** keep name labels showing on these objects (used by "Explore ingredients") */
  pin: (ids: Set<string> | null) => void;
  poke: (p: Placed) => void;
};

const TOP = 0;

export type LayoutCtx = {
  group: THREE.Group;
  tickers: ((t: number, dt: number) => void)[];
  place: <T extends THREE.Object3D>(o: T, x: number, z: number, rot?: number, s?: number) => T;
  tint: (x: number, z: number, rx: number, rz: number, color: string, rot?: number) => void;
  TOP: number;
};
export type WorldSpec = {
  id: WorldId;
  W: number; D: number;
  ground: string; plinth: string;
  recipes: EnrichedRecipe[];
  objects: WorldObject[];
  props: Record<string, () => P>;
  /** props that hop on hover (animals, small trees, jars) */
  small: RegExp;
  fallbackPlace: string;
  layout: (ctx: LayoutCtx) => void;
};

export function riverGeometry(curve: THREE.CatmullRomCurve3, width: number, segments = 180): THREE.BufferGeometry {
  const pts = curve.getSpacedPoints(segments);
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, p = pts[i], tangent = curve.getTangentAt(u);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(width / 2 * (0.94 + Math.sin(u * 34) * 0.06));   // a gentle, smooth swell in the banks
    positions.push(p.x - side.x, p.y, p.z - side.z, p.x + side.x, p.y, p.z + side.z);
    uvs.push(0, i / segments, 1, i / segments);
    if (i < segments) { const k = i * 2; indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function ringMesh(r: number): THREE.Mesh {
  // rings are no longer shown; kept as invisible placeholders so the object records stay simple
  const m = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.3, 8), new THREE.MeshBasicMaterial({ color: "#f2b64d", transparent: true, opacity: 0, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.07; m.visible = false;
  return m;
}

function softDot(): THREE.Texture {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function buildWorld(spec: WorldSpec): Diorama {
  const { W, D, recipes, objects: OBJECTS, props: PROPS } = spec;
  const group = new THREE.Group();
  const tickers: ((t: number, dt: number) => void)[] = [];
  const place = <T extends THREE.Object3D>(o: T, x: number, z: number, rot = 0, s = 1): T => { o.position.set(x, TOP, z); o.rotation.y = rot; o.scale.setScalar(s); group.add(o); const tk = (o as unknown as P).userData?.tick; if (tk) tickers.push(tk); return o; };

  // ---------- base: a model on a wooden plinth ----------
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(W + 4, 2.4, D + 4), mat(spec.plinth, { roughness: 0.6 }));
  plinth.position.y = -1.7; plinth.receiveShadow = true; group.add(plinth);
  add(group, new THREE.Mesh(new THREE.BoxGeometry(W + 4.6, 0.25, D + 4.6), mat("#8a5f3a")), 0, -0.55, 0);
  const ground = new THREE.Mesh(new THREE.BoxGeometry(W, 1.0, D), mat(spec.ground));
  ground.position.y = -0.5; ground.receiveShadow = true; group.add(ground);
  const tint = (x: number, z: number, rx: number, rz: number, color: string, rot = 0) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(1, 20), mat(color));
    m.scale.set(rx, rz, 1); m.rotation.x = -Math.PI / 2; m.rotation.z = rot; m.position.set(x, TOP + 0.006, z); m.receiveShadow = true; group.add(m);
  };

  // ---------- the world's own scenery ----------
  spec.layout({ group, tickers, place, tint, TOP });


  // ---------- interactive objects ----------
  const steamSources: THREE.Vector3[] = [];
  const placed: Placed[] = OBJECTS.map((obj) => {
    if (obj.hitOnly) {
      // a clickable spot inside a place (a market stall): no prop of its own
      const hit = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.6, 2.4), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.set(obj.pos[0], 1.3, obj.pos[1]); group.add(hit);
      const ring = ringMesh(1.6); ring.position.set(obj.pos[0], TOP + 0.07, obj.pos[1]); group.add(ring);
      const labelEl = document.createElement("div");
      labelEl.className = "obj-label";
      labelEl.innerHTML = `<span class="pill">${obj.emoji} ${esc(obj.name)}${obj.zh ? `<span class="zh">${obj.zh}</span>` : ""}<span class="k">${obj.kind}</span></span>`;
      const label = new CSS2DObject(labelEl); label.position.set(obj.pos[0], 2.6, obj.pos[1]); group.add(label);
      const p: Placed = { obj, group: new THREE.Group(), hit, labelEl, anchor: new THREE.Vector3(obj.pos[0], TOP, obj.pos[1]), top: 2.4, ring, small: false };
      hit.userData.placed = p;
      return p;
    }
    const prop = PROPS[obj.prop]();
    prop.position.set(obj.pos[0], TOP, obj.pos[1]);
    prop.rotation.y = obj.rot ?? 0;
    group.add(prop);
    prop.updateMatrixWorld(true);
    if (prop.userData.tick) tickers.push(prop.userData.tick);
    for (const key of ["steam", "smoke"] as const) { const local = prop.userData[key]; if (local) steamSources.push(/market/i.test(obj.prop) ? local.clone() : prop.localToWorld(local.clone())); }
    // a prop may declare its own clickable footprint (local space) when parts of it reach over other things, like the fishing nets' arms
    const own = prop.userData.hitBox as THREE.Box3 | undefined;
    const box = own ? own.clone().applyMatrix4(prop.matrixWorld) : new THREE.Box3().setFromObject(prop);
    const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    const roam = obj.prop === "cow" ? 1.8 : 0;
    const hit = new THREE.Mesh(new THREE.BoxGeometry(Math.max(2.2, size.x + 0.4 + roam), Math.max(2, size.y + 0.6), Math.max(2.2, size.z + 0.4 + roam)), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(center); group.add(hit);
    const ring = ringMesh(Math.max(size.x, size.z) * 0.55 + 0.4); ring.position.set(center.x, TOP + 0.07, center.z); group.add(ring);
    const labelEl = document.createElement("div");
    labelEl.className = "obj-label";
    labelEl.innerHTML = `<span class="pill">${obj.emoji} ${esc(obj.placeName ?? obj.name)}${obj.zh && !obj.placeName ? `<span class="zh">${obj.zh}</span>` : ""}<span class="k">${obj.placeName || obj.kind === "landmark" ? "place" : obj.kind}</span></span>`;
    const label = new CSS2DObject(labelEl); label.position.set(center.x, box.max.y + 0.4, center.z); group.add(label);
    const p: Placed = { obj, group: prop, hit, labelEl, anchor: new THREE.Vector3(center.x, TOP, center.z), top: box.max.y, ring, small: spec.small.test(obj.prop) };
    hit.userData.placed = p;
    return p;
  });

  // ---------- dish markers: plates that emerge around their place when it is opened ----------
  const dishes: DishMarker[] = [];
  const byPlace = new Map<string, EnrichedRecipe[]>();
  for (const r of recipes) { const list = byPlace.get(r.place) ?? []; list.push(r); byPlace.set(r.place, list); }
  const plateGeo = new THREE.CircleGeometry(0.72, 30);
  const rimGeo = new THREE.CylinderGeometry(0.86, 0.8, 0.1, 30);
  for (const [placeId, list] of byPlace) {
    const host = placed.find((p) => p.obj.id === placeId) ?? placed.find((p) => p.obj.id === spec.fallbackPlace)!;
    list.forEach((recipe, i) => {
      const g = new THREE.Group();
      const spread = Math.min(1.0, 0.55 + list.length * 0.12);
      const angle = Math.PI / 2 + (i - (list.length - 1) / 2) * spread; // fan toward the viewer (+z)
      const dist = 2.6 + list.length * 0.25;
      const base = new THREE.Vector3(host.anchor.x + Math.cos(angle) * dist, host.top + 1.2, host.anchor.z + Math.sin(angle) * dist);
      g.position.copy(base);
      const rim = new THREE.Mesh(rimGeo, mat("#fbf6ec", { roughness: 0.4 })); rim.castShadow = true; g.add(rim);
      const dishMat = new THREE.MeshStandardMaterial({ color: "#e9d6a8", roughness: 0.6 });
      const dish = new THREE.Mesh(plateGeo, dishMat); dish.rotation.x = -Math.PI / 2; dish.position.y = 0.055; g.add(dish);
      plateTexture(recipe).then((tex) => { if (tex) { dishMat.map = tex; dishMat.color.set("#ffffff"); dishMat.needsUpdate = true; } });
      g.rotation.x = 0.55; // tilt toward the camera
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.8, 10), new THREE.MeshBasicMaterial({ visible: false })); g.add(hit);
      const ring = ringMesh(0.95); ring.position.set(base.x, TOP + 0.07, base.z); group.add(ring);
      const labelEl = document.createElement("div");
      labelEl.className = "obj-label";
      labelEl.innerHTML = `<span class="pill dish">🍽 ${esc(recipe.title)}${recipe.zh ? `<span class="zh">${recipe.zh}</span>` : ""}</span>`;
      const label = new CSS2DObject(labelEl); label.position.set(0, 1.0, 0); g.add(label);
      g.scale.setScalar(0.001); g.visible = false;
      group.add(g);
      const marker: DishMarker = { recipe, host, group: g, hit, labelEl, anchor: base.clone(), ring, base, shown: false };
      hit.userData.dish = marker;
      dishes.push(marker);
    });
  }

  // ---------- ambient life ----------
  const puffTex = softDot();
  const puffs: { s: THREE.Sprite; life: number; max: number; src: THREE.Vector3; drift: number }[] = [];
  // chimneys, incense burners, ovens: anything placed with a smoke point
  group.traverse((o) => { const sm = (o as P).userData?.smoke; if (sm && o.parent === group && !placed.some((p) => p.group === o)) { o.updateMatrixWorld(true); steamSources.push(o.localToWorld(sm.clone())); } });
  for (const src of steamSources) for (let i = 0; i < 4; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, opacity: 0.7, depthWrite: false }));
    s.visible = false; group.add(s);
    puffs.push({ s, life: Math.random() * 2.6, max: 2.6, src, drift: Math.random() * 6 });
  }
  tickers.push((t, dt) => {
    for (const p of puffs) {
      p.life += dt;
      if (p.life > p.max) { p.life = 0; p.s.position.copy(p.src); }
      const k = p.life / p.max;
      p.s.visible = true;
      p.s.position.y = p.src.y + k * 2.4;
      p.s.position.x = p.src.x + Math.sin(t * 0.8 + p.drift) * 0.25 * k;
      p.s.position.z = p.src.z + Math.cos(t * 0.6 + p.drift) * 0.2 * k;
      const sc = 0.5 + k * 1.4; p.s.scale.set(sc, sc, 1);
      (p.s.material as THREE.SpriteMaterial).opacity = 0.5 * (1 - k) * Math.min(1, k * 6);
    }
  });

  // ---------- hover feedback: the thing under the cursor lifts and wobbles a little ----------
  let hovered: Placed | DishMarker | null = null;
  const hoverPhase = new Map<THREE.Object3D, number>();
  const hoverScale = new Map<THREE.Object3D, number>();
  // click feedback: a squash-and-stretch bounce of the whole prop plus a burst of sparkles from its top
  const bounce = new Map<THREE.Object3D, number>();
  type Spark = { m: THREE.Mesh; v: THREE.Vector3; spin: THREE.Vector3; life: number };
  const sparks: Spark[] = [];
  const sparkGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const sparkMats = ["#f2c14e", "#ffffff", "#f4a6b8", "#e0483a", "#8fc4c9"].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, emissive: new THREE.Color(c), emissiveIntensity: 0.35 }));
  function burst(p: Placed) {
    bounce.set(p.group, 1);
    const n = 16;
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(sparkGeo, sparkMats[i % sparkMats.length]);
      m.position.set(p.anchor.x + (Math.random() - 0.5) * 0.6, Math.min(p.top, 6) + 0.4, p.anchor.z + (Math.random() - 0.5) * 0.6);
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const v = new THREE.Vector3(Math.cos(a) * (1.2 + Math.random() * 1.6), 3.2 + Math.random() * 2.2, Math.sin(a) * (1.2 + Math.random() * 1.6));
      group.add(m);
      sparks.push({ m, v, spin: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8), life: 0 });
    }
  }
  tickers.push((t, dt) => {
    for (const p of placed) {
      const on = hovered === p;
      const k = Math.min(1, dt * 9);
      let hs = hoverScale.get(p.group) ?? 1;
      if (p.small) {
        // small things (animals, trees, jars, tables) hop and wobble
        const targetY = TOP + (on ? 0.18 : 0);
        p.group.position.y += (targetY - p.group.position.y) * k;
        hs += ((on ? 1.035 : 1) - hs) * k;
        hoverScale.set(p.group, hs);
        const ph = hoverPhase.get(p.group) ?? 0;
        const wob = on ? Math.min(1, ph + dt * 2) : Math.max(0, ph - dt * 3);
        hoverPhase.set(p.group, wob);
        p.group.rotation.z = Math.sin(t * 6) * 0.025 * wob * (1 - wob * 0.6);
      }
      // buildings, fields and the market get no hover effect at all; the label pill is enough
      const b = bounce.get(p.group) ?? 0;
      if (b > 0) {
        const nb = Math.max(0, b - dt * 1.4);
        bounce.set(p.group, nb);
        const w = Math.sin((1 - nb) * Math.PI * 3) * nb * 0.09;   // three decaying wobbles
        p.group.scale.set(hs * (1 - w * 0.6), hs * (1 + w), hs * (1 - w * 0.6));
      } else if (p.group.scale.x !== hs) p.group.scale.setScalar(hs);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life += dt; s.v.y -= dt * 9;
      s.m.position.addScaledVector(s.v, dt);
      s.m.rotation.x += s.spin.x * dt; s.m.rotation.y += s.spin.y * dt;
      const sc = Math.max(0.001, 1 - s.life / 1.1);
      s.m.scale.setScalar(sc);
      if (s.life > 1.1 || s.m.position.y < TOP) { group.remove(s.m); sparks.splice(i, 1); }
    }
  });

  // ---------- highlight & dish emergence ----------
  let hiObjects: Set<string> | null = null, hiDishes: Set<string> | null = null;
  function highlight(objectIds: Set<string> | null, dishIds: Set<string> | null) {
    hiObjects = objectIds; hiDishes = dishIds;
    for (const d of dishes) d.shown = dishIds?.has(d.recipe.id) ?? false;
  }
  tickers.push((t, dt) => {
    for (const p of placed) {
      void p; // no rings on objects at all: the card, the camera glide and the emerging dishes carry the selection
    }
    for (const d of dishes) {
      const targetScale = d.shown ? 1 : 0.001;
      const sc = d.group.scale.x + (targetScale - d.group.scale.x) * Math.min(1, dt * (d.shown ? 7 : 10));
      d.group.scale.setScalar(sc);
      d.group.visible = sc > 0.02;
      d.group.position.y = d.base.y + (d.shown ? Math.sin(t * 2.2 + d.base.x) * 0.12 : -0.6);
    }
  });

  return {
    group, placed, dishes,
    bounds: new THREE.Box3(new THREE.Vector3(-W / 2, 0, -D / 2), new THREE.Vector3(W / 2, 0, D / 2)),
    tick: (t, dt) => { for (const f of tickers) f(t, dt); },
    highlight,
    hover: (thing) => { hovered = thing && "obj" in thing ? thing : null; if (thing && "recipe" in thing) thing.group.scale.setScalar(1.15); },
    pin: (ids) => { for (const p of placed) p.labelEl.classList.toggle("show", ids?.has(p.obj.id) ?? false); for (const p of placed) p.labelEl.classList.toggle("pinned", ids?.has(p.obj.id) ?? false); },
    poke: (p) => { burst(p); p.group.userData.poke?.(); },
  };
}

export const areaCenter = (a: keyof typeof AREAS) => new THREE.Vector3(AREAS[a].center[0], 0, AREAS[a].center[1]);

/** Shared water-life: koi that steer along a curve, and a translucent water ribbon with bed and pebbles. */
export function addWater(ctx: LayoutCtx, curve: THREE.CatmullRomCurve3, width = 3.4, bedColor = "#5e8a86"): THREE.Mesh {
  const { group, tickers } = ctx;
  const riverMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; varying vec2 vUv;
      void main(){ float edge = smoothstep(0.0,0.18,vUv.x)*smoothstep(1.0,0.82,vUv.x);
        float ripple = 0.5+0.5*sin((vUv.y*70.0 - uTime*1.6) + sin(vUv.x*12.0+uTime)*1.5);
        vec3 col = mix(vec3(0.40,0.66,0.68), vec3(0.62,0.83,0.84), ripple*0.6);
        col = mix(vec3(0.86,0.9,0.86), col, edge);
        gl_FragColor = vec4(col, 0.72 + 0.2*(1.0-edge)); }`,
    transparent: true, depthWrite: false,
  });
  const river = new THREE.Mesh(riverGeometry(curve, width), riverMat); river.receiveShadow = true; river.renderOrder = 2; group.add(river);
  const bed = new THREE.Mesh(riverGeometry(curve, width - 0.3), mat(bedColor)); bed.position.y = -0.025; bed.receiveShadow = true; group.add(bed);
  const bank = new THREE.Mesh(riverGeometry(curve, width + 1.4), mat("#d9c89a")); bank.position.y = -0.02; bank.receiveShadow = true; group.add(bank);
  for (let i = 0; i < 30; i++) { const u = (i + 0.5) / 30; const p = curve.getPointAt(u), tg = curve.getTangentAt(u); const side = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar((Math.random() - 0.5) * (width - 1)); const pb = add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.08, 0), mat("#9fb3a6")), p.x + side.x, 0.005, p.z + side.z); pb.scale.y = 0.4; }
  tickers.push((t) => { riverMat.uniforms.uTime.value = t; });
  return river;
}


/** Flowing water surface for arbitrary shapes: ripples and glints driven by world position, opaque. */
/** Seas are deep blue; rivers, canals, ponds and fountains are the light turquoise China's river set. */
export const seaWater = () => flowingWaterMaterial("#4f95b8", "#245f88");
export const freshWater = () => flowingWaterMaterial("#a8dfe6", "#6fc0cf");

/** A river that meets the sea: fresh water upstream, fading into the sea's colours within `radius` of the mouth. */
/** `axis: "z"` blends by distance along z only, so everything past the coast line (z ≥ mouth) is exactly the sea's colour, cap corners included. */
export const estuaryWater = (x: number, z: number, radius: number, axis: "radial" | "z" = "radial") => flowingWaterMaterial("#a8dfe6", "#6fc0cf", { x, z, radius, shallow: "#4f95b8", deep: "#245f88", axis });

export function flowingWaterMaterial(shallow = "#6ab3c2", deep = "#3f8fa4", mouth?: { x: number; z: number; radius: number; shallow: string; deep: string; axis?: "radial" | "z" }): THREE.ShaderMaterial {
  const m = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uShallow: { value: new THREE.Color(shallow) }, uDeep: { value: new THREE.Color(deep) },
      uMouth: { value: new THREE.Vector4(mouth?.x ?? 0, mouth?.z ?? 0, mouth?.radius ?? 0, mouth?.axis === "z" ? 1 : 0) }, uSeaShallow: { value: new THREE.Color(mouth?.shallow ?? shallow) }, uSeaDeep: { value: new THREE.Color(mouth?.deep ?? deep) },
    },
    vertexShader: `varying vec3 vPos; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vPos = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform float uTime; uniform vec3 uShallow; uniform vec3 uDeep; uniform vec4 uMouth; uniform vec3 uSeaShallow; uniform vec3 uSeaDeep; varying vec3 vPos;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
      void main(){
        vec2 p = vPos.xz;
        float n = noise(p*0.35 + vec2(uTime*0.12, -uTime*0.08))*0.6 + noise(p*0.9 - vec2(uTime*0.2, uTime*0.1))*0.4;
        float wave = 0.5 + 0.5*sin(p.x*1.6 + p.y*0.9 + uTime*1.4 + n*3.0);
        float dMouth = uMouth.w > 0.5 ? max(0.0, uMouth.y - p.y) : distance(p, uMouth.xy);
        float toSea = uMouth.z > 0.0 ? 1.0 - smoothstep(0.0, uMouth.z, dMouth) : 0.0;   // 1 at (and past) the river mouth, 0 upstream
        vec3 shallow = mix(uShallow, uSeaShallow, toSea), deep = mix(uDeep, uSeaDeep, toSea);
        vec3 col = mix(deep, shallow, wave*0.55 + n*0.25);
        float glint = smoothstep(0.80, 0.9, noise(p*1.8 + vec2(uTime*0.5, -uTime*0.35)));
        col += glint*0.18;
        gl_FragColor = vec4(col, 1.0); }`,
    side: THREE.DoubleSide,   // the shore shapes are mirrored into place, so their winding is reversed
  });
  return m;
}

/** A school of small fish that steer along a curve with gentle lane changes, bending as they swim. */
export function addFish(ctx: LayoutCtx, curve: THREE.CatmullRomCurve3, palette: [string, string][], laneWidth = 1.4, size = 0.4) {
  const { group, tickers, TOP } = ctx;
  type F = { g: THREE.Group; u: number; side: number; targetSide: number; speed: number; heading: number; ph: number };
  const school: F[] = palette.map(([c1, c2], i) => {
    const f = fish(c1, c2, size + (i % 3) * 0.06); group.add(f);
    return { g: f, u: (i / palette.length + Math.random() * 0.05) % 1, side: (Math.random() - 0.5) * laneWidth, targetSide: (Math.random() - 0.5) * laneWidth, speed: 0.003 + Math.random() * 0.003, heading: 0, ph: Math.random() * 6 };
  });
  tickers.push((t, dt) => {
    for (const k of school) {
      if (Math.random() < dt * 0.15) k.targetSide = (Math.random() - 0.5) * laneWidth;
      k.side += (k.targetSide - k.side) * Math.min(1, dt * 0.6);
      const glide = 1 + Math.sin(t * 0.5 + k.ph) * 0.2;
      k.u = (k.u + dt * k.speed * glide) % 1;
      const p = curve.getPointAt(k.u), tg = curve.getTangentAt(k.u);
      const n = new THREE.Vector3(-tg.z, 0, tg.x).normalize();
      const pos = p.clone().addScaledVector(n, k.side);
      const ahead = curve.getPointAt((k.u + 0.01) % 1).addScaledVector(n, k.targetSide);
      const want = Math.atan2(ahead.x - pos.x, ahead.z - pos.z);
      let d = want - k.heading; d = Math.atan2(Math.sin(d), Math.cos(d)); k.heading += d * Math.min(1, dt * 1.6);
      k.g.position.set(pos.x, TOP + 0.09 + Math.sin(t * 1.3 + k.ph) * 0.012, pos.z);   // on top of the (opaque) surface
      k.g.rotation.set(0, k.heading - Math.PI / 2, 0);
      (k.g.userData as { swim?: (t: number, k: number) => void }).swim?.(t + k.ph, glide);
    }
  });
}
