import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { fetchRecipes } from "../data";
import { MAP_REGIONS, OBJECTS, enrich, isChinaRecipe, objectById, type Area, type EnrichedRecipe, type MapRegion } from "./graph";
import { buildMap, type MapWorld, type PlacedRegion } from "./map";
import { buildDiorama, areaCenter, type Diorama, type DishMarker, type Placed } from "./diorama";
import { mountUi, showRecipePage, setCrumbs, hint, toast } from "./ui";

// ---------- renderer ----------
const canvas = document.getElementById("stage") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const labelRenderer = new CSS2DRenderer({ element: document.getElementById("labels")! });

const camera = new THREE.PerspectiveCamera(34, 1, 0.5, 600);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.screenSpacePanning = false;
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
controls.zoomToCursor = true;

function makeScene(bg: string, fog: [number, number]): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  scene.fog = new THREE.Fog(bg, fog[0], fog[1]);
  scene.add(new THREE.HemisphereLight(0xfff5e6, 0xb9c8a8, 0.85));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.3);
  sun.position.set(-40, 70, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10; sun.shadow.camera.far = 220;
  const s = 70; sun.shadow.camera.left = -s; sun.shadow.camera.right = s; sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);
  return scene;
}
const mapScene = makeScene("#e8e1d0", [260, 480]);
const worldScene = makeScene("#e9e0cd", [90, 200]);
let active: THREE.Scene = mapScene;

/** CSS2D labels live in one DOM container, so hide the ones belonging to the scene we're not showing. */
function switchScene(scene: THREE.Scene) {
  active = scene;
  for (const sc of [mapScene, worldScene]) {
    const show = sc === scene;
    sc.traverse((o) => { const el = (o as { element?: HTMLElement }).element; if (el && (o as { isCSS2DObject?: boolean }).isCSS2DObject) el.style.display = show ? "" : "none"; });
  }
}

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false); labelRenderer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
resize();
window.addEventListener("resize", resize);

// ---------- camera flights ----------
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
let flight: { from: THREE.Vector3; to: THREE.Vector3; tf: THREE.Vector3; tt: THREE.Vector3; t: number; dur: number; done?: () => void } | null = null;
function fly(to: THREE.Vector3, target: THREE.Vector3, dur = 1.4, done?: () => void) {
  flight = { from: camera.position.clone(), to, tf: controls.target.clone(), tt: target, t: 0, dur, done };
}
/** Move the target and keep the current viewing offset (a glide, not a cut). `bias` shifts the subject left so the card doesn't cover it. */
function glideTo(target: THREE.Vector3, distance?: number, dur = 1.1, done?: () => void, bias = 0) {
  const offset = camera.position.clone().sub(controls.target);
  if (distance) offset.setLength(distance);
  const t = target.clone();
  if (bias && window.innerWidth > 720) {
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), offset.clone().setY(0).normalize()).normalize();
    t.add(right.multiplyScalar(bias));
  }
  fly(t.clone().add(offset), t, dur, done);
}

// ---------- state ----------
type Level = "home" | "map" | "world";
let level: Level = "home";
let mapWorld: MapWorld | null = null;
let diorama: Diorama | null = null;
let china: EnrichedRecipe[] = [];
let hoveredRegion: PlacedRegion | null = null;
let hoveredThing: Placed | DishMarker | null = null;
let currentArea: Area | null = null;

const ui = mountUi({
  onClose: () => { ui.hide(); diorama?.highlight(null, null); diorama?.pin(null); },
  onOpenRecipe: (r) => openDish(r),
  onExploreDishes: (_o, recipes) => {
    const ids = new Set(recipes.map((r) => r.id));
    diorama!.highlight(null, ids);
    frameDishes(recipes);
    hint(`${recipes.length === 1 ? "The dish is" : "The dishes are"} glowing in the world. Click a plate to see it.`);
  },
  onGoObject: (o) => openObject(diorama!.placed.find((p) => p.obj.id === o.id)!),
  onCook: (r) => { showRecipePage(r, () => {}); },
  onExploreIngredients: (r) => {
    const ids = new Set(OBJECTS.filter((o) => (o.kind === "ingredient" || o.kind === "flavour") && !o.alias && o.match(r)).map((o) => o.id));
    diorama!.highlight(null, null);
    ui.hide();
    diorama!.pin(ids);
    const spots = diorama!.placed.filter((p) => ids.has(p.obj.id));
    if (spots.length) frameThings(spots.map((p) => p.anchor));
    const names = spots.map((p) => p.obj.name).join(", ");
    hint(`${r.title} is made from: ${names}. Tap a label to read about it.`, 9000);
  },
  onEnterRegion: (region) => enterRegion(region),
});

// ---------- boot ----------
async function boot() {
  const status = document.getElementById("home-status")!;
  const enter = document.getElementById("enter") as HTMLButtonElement;
  enter.disabled = true;
  try {
    const { recipes } = await fetchRecipes();
    china = recipes.filter(isChinaRecipe).map(enrich);
    const counts = new Map<string, number>();
    for (const region of MAP_REGIONS) counts.set(region.id, recipes.filter((r) => region.cuisines.includes(r.cuisine ?? "")).length);
    counts.set("china", china.length);
    mapWorld = buildMap(counts);
    mapScene.add(mapWorld.group);
    for (const r of mapWorld.regions) r.labelEl.addEventListener("click", () => { if (level !== "map" || flight) return; if (r.region.built) enterRegion(r.region); else ui.showRegion(r.region, r.count, "/"); });
    diorama = buildDiorama(china);
    worldScene.add(diorama.group);
    for (const p of diorama.placed) p.labelEl.addEventListener("click", () => { if (p.labelEl.classList.contains("pinned")) openObject(p); });
    status.textContent = `${recipes.length} dishes · ${china.length} in China so far`;
  } catch (e) {
    status.textContent = `Couldn't load the cookbook: ${(e as Error).message}`;
    return;
  }
  enter.disabled = false;
  enter.addEventListener("click", () => {
    document.getElementById("home")!.classList.add("out");
    showMap(true);
  });
  // map camera parked, ready behind the home screen
  const { pos, target } = mapPlacement();
  camera.position.copy(pos); controls.target.copy(target);
}

function configureControls(l: Level) {
  if (l === "map") {
    controls.minDistance = 30; controls.maxDistance = 260;
    controls.minPolarAngle = 0.45; controls.maxPolarAngle = 1.15;
    controls.minAzimuthAngle = -0.6; controls.maxAzimuthAngle = 0.6;
  } else {
    controls.minDistance = 10; controls.maxDistance = 90;
    controls.minPolarAngle = 0.5; controls.maxPolarAngle = 1.12;
    controls.minAzimuthAngle = -0.75; controls.maxAzimuthAngle = 0.75;
  }
}

/** Camera spot that shows the whole atlas (x −42…42, z −18…14) for the current viewport. */
function mapPlacement(): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const tanV = Math.tan(vFov / 2), tanH = tanV * camera.aspect;
  const d = Math.max(122 / (2 * tanH * 0.94), 52 / (2 * tanV * 0.66));
  const elevation = 0.8;
  const target = new THREE.Vector3(2, 0, -2);
  return { pos: new THREE.Vector3(target.x, Math.sin(elevation) * d, target.z + Math.cos(elevation) * d), target };
}

function showMap(first = false) {
  level = "map"; switchScene(mapScene); configureControls("map");
  ui.hide(); diorama?.highlight(null, null);
  setCrumbs([{ label: "🌍 Food World" }]);
  document.getElementById("crumbs")!.hidden = true;
  const { pos, target } = mapPlacement();
  if (first) {
    camera.position.copy(pos).multiplyScalar(1.5);
    fly(pos, target, 2.2);
    hint("Hover a region to wake it. Click China to go in.", 9000);
  } else {
    camera.position.set(22, 40, 30); controls.target.set(22, 0, -6);
    fly(pos, target, 1.6);
  }
}

function enterRegion(region: MapRegion) {
  if (!region.built || !diorama) return;
  ui.hide();
  const placed = mapWorld!.regions.find((r) => r.region.id === region.id)!;
  const c = placed.group.position;
  // dive toward the region, fade to paper, arrive above the valley
  fly(new THREE.Vector3(c.x + 6, 14, c.z + 16), new THREE.Vector3(c.x, 1, c.z), 1.3, () => {
    const fade = document.getElementById("fade")!;
    fade.classList.add("on");
    setTimeout(() => {
      level = "world"; switchScene(worldScene); configureControls("world");
      camera.position.set(-6, 80, 90); controls.target.set(-4, 0, 0);
      fly(new THREE.Vector3(-2, 48, 62), new THREE.Vector3(-4, 0, 2), 2.0);
      fade.classList.remove("on");
      setCrumbsWorld();
      hint("Drag to pan · scroll to zoom · right-drag to peek around. Tap anything that looks edible.", 9000);
    }, 560);
  });
}

function setCrumbsWorld() {
  setCrumbs([{ label: "🌍 Food World", onClick: () => leaveWorld() }, { label: "China · 中国" }], {
    current: currentArea,
    onPick: (a) => { currentArea = a; setCrumbsWorld(); if (a) { glideTo(areaCenter(a), 42, 1.3); hint(`${a === "everyday" ? "The everyday table" : a[0].toUpperCase() + a.slice(1)} · ${AREAS_BLURB[a]}`, 6000); } },
  });
}
const AREAS_BLURB: Record<Area, string> = {
  sichuan: "chilli, numbing pepper and the fiercest woks",
  jiangnan: "water towns: gentle, sweet, slow-braised",
  northern: "wheat country: dumplings, rolls and griddles",
  everyday: "home cooking that belongs to no province",
};

function leaveWorld() {
  const fade = document.getElementById("fade")!;
  fade.classList.add("on");
  setTimeout(() => { showMap(false); fade.classList.remove("on"); }, 500);
}

// ---------- world interactions ----------
function openObject(p: Placed) {
  if (p.obj.open === "reveal") { revealPlace(p); return; }
  const obj = p.obj.alias ? objectById(p.obj.alias) : p.obj;   // a market stall opens its ingredient's card
  const recipes = china.filter((r) => obj.match(r));
  ui.showObject(obj, recipes, OBJECTS);
  diorama!.highlight(new Set([obj.id]), null);   // the card is enough; plates only rise at a place or on "Explore dishes"
  diorama!.poke(p);
  glideTo(p.anchor.clone().add(new THREE.Vector3(0, 0.8, 0)), p.obj.hitOnly ? 16 : 28, 1.0, undefined, p.obj.hitOnly ? 3 : 5);
}

/** A place (market, noodle shop, dumpling stall…) zooms in and shows what's inside; you pick a plate or a stall from there. */
function revealPlace(p: Placed) {
  const recipes = china.filter((r) => p.obj.match(r));
  const stalls = OBJECTS.filter((o) => o.parent === p.obj.id);
  ui.hide();
  diorama!.highlight(null, new Set(recipes.map((r) => r.id)));
  diorama!.poke(p);
  glideTo(p.anchor.clone().add(new THREE.Vector3(0, 1.2, 0)), stalls.length ? 20 : 15, 1.2);
  if (!recipes.length && !stalls.length) { ui.showObject(p.obj, [], OBJECTS); return; }
  const what = [stalls.length ? "a stall" : "", recipes.length ? (recipes.length === 1 ? "the plate" : "a plate") : ""].filter(Boolean).join(" or ");
  hint(`${p.obj.placeName ?? p.obj.name} · tap ${what}`, 6000);
}

function openDish(r: EnrichedRecipe) {
  const marker = diorama!.dishes.find((d) => d.recipe.id === r.id);
  ui.showRecipePreview(r);
  diorama!.highlight(new Set([r.place]), new Set([r.id]));
  if (marker) glideTo(marker.anchor.clone().add(new THREE.Vector3(0, 1, 0)), 22, 1.3, undefined, 4);
}

function frameThings(points: THREE.Vector3[]) {
  const box = new THREE.Box3().setFromPoints(points);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  glideTo(center, THREE.MathUtils.clamp(size * 1.1 + 18, 22, 70), 1.3);
}
function frameDishes(recipes: EnrichedRecipe[]) {
  const pts = diorama!.dishes.filter((d) => recipes.some((r) => r.id === d.recipe.id)).map((d) => d.anchor);
  if (pts.length) frameThings(pts);
}

// ---------- pointer ----------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let down: { x: number; y: number; t: number } | null = null;

function castMap(x: number, y: number): PlacedRegion | null {
  if (!mapWorld) return null;
  const r = canvas.getBoundingClientRect();
  pointer.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(mapWorld.regions.map((p) => p.hit), false);
  return (hits[0]?.object.userData.region as PlacedRegion) ?? null;
}
function castWorld(x: number, y: number): Placed | DishMarker | null {
  if (!diorama) return null;
  const r = canvas.getBoundingClientRect();
  pointer.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  // plates and stalls sit inside their place's hit box, so test them first
  const inner = raycaster.intersectObjects([...diorama.dishes.map((d) => d.hit), ...diorama.placed.filter((p) => p.obj.hitOnly).map((p) => p.hit)], false);
  const u1 = inner[0]?.object.userData;
  if (u1) return (u1.dish as DishMarker) ?? (u1.placed as Placed);
  const hits = raycaster.intersectObjects(diorama.placed.filter((p) => !p.obj.hitOnly).map((p) => p.hit), false);
  return (hits[0]?.object.userData.placed as Placed) ?? null;
}

canvas.addEventListener("pointermove", (e) => {
  if (level === "map") {
    const region = castMap(e.clientX, e.clientY);
    if (region !== hoveredRegion) { hoveredRegion = region; mapWorld!.wake(region); canvas.classList.toggle("pointing", Boolean(region)); }
  } else if (level === "world") {
    const thing = castWorld(e.clientX, e.clientY);
    if (thing !== hoveredThing) {
      if (hoveredThing && !hoveredThing.labelEl.classList.contains("pinned")) hoveredThing.labelEl.classList.remove("show");
      hoveredThing = thing;
      thing?.labelEl.classList.add("show");
      diorama!.hover(thing);
      canvas.classList.toggle("pointing", Boolean(thing));
    }
  }
});
// leaving the canvas (onto a card, the crumbs, or out of the window) ends any hover
function clearHover() {
  if (hoveredThing) { if (!hoveredThing.labelEl.classList.contains("pinned")) hoveredThing.labelEl.classList.remove("show"); hoveredThing = null; diorama?.hover(null); }
  if (hoveredRegion) { hoveredRegion = null; mapWorld?.wake(null); }
  canvas.classList.remove("pointing");
}
canvas.addEventListener("pointerleave", clearHover);
for (const id of ["card", "crumbs", "recipe"]) document.getElementById(id)!.addEventListener("pointerenter", clearHover);

canvas.addEventListener("pointerdown", (e) => { if (e.target === canvas && !flight) down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
window.addEventListener("pointerup", (e) => {
  if (!down) return;
  const isTap = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 7 && performance.now() - down.t < 500;
  down = null;
  if (!isTap || flight || (e.target as HTMLElement).closest("#card, #crumbs, #recipe, #home")) return;
  if (level === "map") {
    const region = castMap(e.clientX, e.clientY);
    if (!region) { ui.hide(); return; }
    if (region.region.built) enterRegion(region.region);
    else ui.showRegion(region.region, region.count, "/");
  } else if (level === "world") {
    const thing = castWorld(e.clientX, e.clientY);
    if (!thing) { ui.hide(); diorama!.highlight(null, null); diorama!.pin(null); return; }
    if ("recipe" in thing) openDish(thing.recipe);
    else openObject(thing);
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!document.getElementById("recipe")!.hidden) { document.getElementById("recipe")!.hidden = true; return; }
    if (ui.open) { ui.hide(); diorama?.highlight(null, null); diorama?.pin(null); return; }
    if (level === "world") leaveWorld();
  }
});

// ---------- loop ----------
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  if (flight) {
    flight.t = Math.min(1, flight.t + dt / flight.dur);
    const k = easeInOut(flight.t);
    const arc = Math.sin(k * Math.PI) * flight.from.distanceTo(flight.to) * 0.08;
    camera.position.lerpVectors(flight.from, flight.to, k).add(new THREE.Vector3(0, arc, 0));
    controls.target.lerpVectors(flight.tf, flight.tt, k);
    if (flight.t >= 1) { const d = flight.done; flight = null; d?.(); }
  } else if (level === "world" && diorama) {
    // keep the diorama on the table
    const b = diorama.bounds;
    const before = controls.target.clone();
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, b.min.x + 6, b.max.x - 6);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, b.min.z + 4, b.max.z - 4);
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, -1, 6);
    camera.position.add(controls.target.clone().sub(before));
  }
  controls.update();
  if (level === "map" || level === "home") mapWorld?.tick(t, dt);
  if (level === "world") diorama?.tick(t, dt);
  renderer.render(active, camera);
  labelRenderer.render(active, camera);
});

void toast;
(window as unknown as { __fw: () => unknown }).__fw = () => ({ level, flying: Boolean(flight), diorama: Boolean(diorama), map: Boolean(mapWorld) });
boot();
