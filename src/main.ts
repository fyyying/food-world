import "./style.css";
import * as THREE from "three";
import { createWorld } from "./world/scene";
import { buildIsland, layoutIslands, type Island } from "./world/island";
import { animatePlates, buildPlates, type Plate } from "./world/plates";
import { CameraDirector } from "./world/camera";
import { REGIONS, regionForCuisine } from "./regions";
import { EMPTY_FILTERS, WEEKDAYS, assignRecipe, fetchPlan, fetchRecipes, imageUrl, matches, removeSlot, DAY_SHORT, type Filters, type PlanState, type Recipe, type Weekday } from "./data";
import { mountTopbar } from "./ui/topbar";
import { mountInspector } from "./ui/inspector";
import { mountTray } from "./ui/tray";
import { toast } from "./ui/toast";
import { choose } from "./ui/popover";

const canvas = document.getElementById("world") as HTMLCanvasElement;
const world = createWorld(canvas, document.getElementById("labels")!);
const director = new CameraDirector(world);
const status = document.getElementById("intro-status")!;

const islands: Island[] = [];
const plates: Plate[] = [];
const platesByRecipe = new Map<string, Plate>();
let recipes: Recipe[] = [];
let planState: PlanState | null = null;
const filters: Filters = { ...EMPTY_FILTERS };
let selected: Plate | null = null;
let hovered: Plate | null = null;

// ---------- UI ----------

const topbar = mountTopbar(document.getElementById("topbar")!, filters, {
  onFilters: applyFilters,
  onSearchEnter: () => {
    const first = plates.find((p) => !p.state.dimmed);
    if (first) selectPlate(first, true);
  },
  onBack: goOverview,
});

const inspector = mountInspector(document.getElementById("inspector")!, {
  onClose: () => selectPlate(null),
  onPickDay: async (day, anchor) => { if (selected) await placeOnDay(selected.recipe, day, anchor); },
});

const tray = mountTray(document.getElementById("tray")!, {
  onMealClick: (recipeId) => { const p = platesByRecipe.get(recipeId); if (p) selectPlate(p, true); else toast("That dish isn't in the Notion recipe list"); },
  onRemove: async (slotId) => {
    if (!planState) return;
    try { planState = await removeSlot(planState, slotId); syncPlan(); toast("Removed from the week"); }
    catch (e) { toast((e as Error).message, "err", 4000); }
  },
  onRefresh: () => loadPlan(true),
  onSyncRecipes: async () => {
    toast("Re-reading recipes from Notion…");
    try { await fetchRecipes(true); location.reload(); }
    catch (e) { toast((e as Error).message, "err", 4000); }
  },
});

const help = document.createElement("div");
help.className = "help";
help.textContent = "Drag to orbit · scroll to zoom · click an island to visit · click a plate to open it";
document.getElementById("app")!.appendChild(help);
setTimeout(() => help.classList.add("hide"), 14000);

// ---------- Build the world ----------

async function boot() {
  status.textContent = "Reading your Notion recipes…";
  let data;
  try { data = await fetchRecipes(); }
  catch (e) { status.textContent = `Could not load recipes: ${(e as Error).message}`; return; }
  recipes = data.recipes.sort((a, b) => (b.stars - a.stars) || (b.liked - a.liked) || a.title.localeCompare(b.title));
  if (data.stale) toast("Notion unreachable — showing the last saved recipe list", "err", 5000);

  status.textContent = "Raising the islands…";
  const groups = REGIONS.map((region) => ({ region, recipes: recipes.filter((r) => regionForCuisine(r.cuisine).id === region.id) }));
  const sizes = groups.map((g) => ({ radius: Math.max(4.2, 2.4 + Math.sqrt(g.recipes.length) * 1.55) }));
  const positions = layoutIslands(sizes, 27);

  groups.forEach((g, i) => {
    const island = buildIsland(g.region, sizes[i].radius, positions[i]);
    island.reveal(0);
    world.scene.add(island.group);
    islands.push(island);
    island.labelEl.addEventListener("click", () => focusIsland(island));
    const ps = buildPlates(island, g.recipes);
    for (const p of ps) { plates.push(p); platesByRecipe.set(p.recipe.id, p); }
    updateIslandCount(island);
  });

  // intro: islands rise one after another, then plates pop
  const t0 = performance.now();
  world.onFrame.add(function intro() {
    const t = (performance.now() - t0) / 1000;
    let allDone = true;
    islands.forEach((island, i) => {
      const k = Math.min(1, Math.max(0, (t - 0.25 - i * 0.18) / 1.1));
      island.reveal(1 - Math.pow(1 - k, 3));
      if (k < 1) allDone = false;
    });
    plates.forEach((p, i) => {
      const k = Math.min(1, Math.max(0, (t - 1.4 - (i % 17) * 0.06) / 0.7));
      p.state.intro = k;
      if (k < 1) allDone = false;
    });
    if (allDone) world.onFrame.delete(intro);
  });
  world.onFrame.add((dt, t) => {
    animatePlates(plates, t, dt);
    for (const island of islands) {
      const hub = island.group.getObjectByName("windmill-hub");
      if (hub) hub.rotation.x += dt * 0.8;
    }
  });

  const { pos, target } = director.overviewPlacement();
  world.camera.position.copy(pos);
  world.controls.target.copy(target);
  document.getElementById("intro")!.classList.add("out");
  loadPlan();
}

function updateIslandCount(island: Island) {
  const mine = plates.filter((p) => p.island === island);
  const shown = mine.filter((p) => !p.state.dimmed).length;
  const filtering = shown !== mine.length;
  island.labelEl.querySelector(".count")!.textContent = filtering ? `${shown} of ${mine.length}` : `${mine.length} dishes`;
  island.labelEl.classList.toggle("dim", filtering && shown === 0);
}

// ---------- Plan ----------

async function loadPlan(announce = false) {
  planState = await fetchPlan();
  syncPlan();
  if (announce) toast(planState.online ? "Plan reloaded from the planner" : `Planner offline: ${planState.reason}`, planState.online ? "ok" : "err");
}

function plannedIds(): Set<string> {
  return new Set(planState?.plan.slots.map((s) => s.recipeId).filter(Boolean) as string[]);
}

function syncPlan() {
  if (!planState) return;
  tray.update(planState, recipes);
  const ids = plannedIds();
  for (const p of plates) p.state.planned = ids.has(p.recipe.id);
  inspector.refresh(planState.plan);
  if (filters.unplanned) applyFilters(filters);
}

async function placeOnDay(recipe: Recipe, day: Weekday, anchor: { x: number; y: number }) {
  if (!planState) return;
  const slots = planState.plan.slots.filter((s) => s.day === day);
  const dishes = slots.filter((s) => s.recipeId);
  if (dishes.some((s) => s.recipeId === recipe.id)) { toast(`${recipe.title} is already on ${DAY_SHORT[day]}`); return; }
  let slotId: string | undefined;
  const skip = slots.length > 0 && slots.every((s) => s.status === "skip");
  if (dishes.length > 0) {
    const pick = await choose(anchor, `${DAY_SHORT[day]} already has ${dishes.length === 1 ? "a dish" : `${dishes.length} dishes`}`, [
      ...dishes.map((s) => ({ label: `Replace ${s.title ?? "dish"}`, sub: s.estimatedMinutes ? `${s.estimatedMinutes} min` : undefined, value: s.id })),
      { label: `Add as another dish`, sub: "main + side night", value: null, kind: "add" as const },
    ]);
    if (pick === undefined) return;
    slotId = pick ?? undefined;
  } else if (!skip && slots.length === 1 && !slots[0].recipeId) {
    slotId = slots[0].id; // empty primary slot
  }
  try {
    planState = await assignRecipe(planState, day, recipe, slotId);
    syncPlan();
    tray.flash(recipe.id);
    toast(`${recipe.title} → ${DAY_SHORT[day]}${skip ? " (was a skip day)" : ""}`);
  } catch (e) {
    toast((e as Error).message, "err", 4500);
  }
}

// ---------- Filters ----------

function applyFilters(f: Filters) {
  const ids = plannedIds();
  let shown = 0;
  for (const p of plates) {
    const ok = matches(p.recipe, f, ids);
    p.state.dimmed = !ok;
    if (ok) shown++;
  }
  const active = shown !== plates.length || Boolean(f.query);
  topbar.setMatches(shown, plates.length, active);
  for (const island of islands) updateIslandCount(island);
}

// ---------- Selection & camera ----------

function focusIsland(island: Island) {
  if (director.focused === island) return;
  director.focusIsland(island);
  topbar.setCrumb(island.region.name, plates.filter((p) => p.island === island).length);
}

function goOverview() {
  selectPlate(null);
  director.overview();
  topbar.setCrumb(null);
}

function selectPlate(plate: Plate | null, fly = false) {
  if (selected) selected.state.selected = false;
  selected = plate;
  if (!plate) { inspector.hide(); return; }
  plate.state.selected = true;
  inspector.show(plate.recipe, planState?.plan ?? null);
  if (director.focused !== plate.island) {
    director.focusIsland(plate.island, true);
    topbar.setCrumb(plate.island.region.name, plates.filter((p) => p.island === plate.island).length);
  } else if (fly) {
    director.nudgeForPanel(plate.island);
  }
}

// ---------- Pointer: hover, click, drag-to-tray ----------

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let down: { x: number; y: number; plate: Plate | null; island: Island | null; t: number } | null = null;
let ghost: HTMLElement | null = null;
let dragging: Plate | null = null;

function pick(x: number, y: number): { plate: Plate | null; island: Island | null } {
  const r = canvas.getBoundingClientRect();
  pointer.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, world.camera);
  const hits = raycaster.intersectObjects(islands.map((i) => i.group), true);
  for (const h of hits) {
    if (h.object.userData.plate) return { plate: h.object.userData.plate as Plate, island: null };
    if (h.object.userData.island) return { plate: null, island: h.object.userData.island as Island };
  }
  return { plate: null, island: null };
}

canvas.addEventListener("pointermove", (e) => {
  if (down && !dragging && down.plate && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) {
    startDrag(down.plate, e);
  }
  if (dragging) { moveDrag(e); return; }
  const { plate } = pick(e.clientX, e.clientY);
  if (plate !== hovered) {
    if (hovered) { hovered.state.hover = false; hovered.labelEl.classList.remove("show"); }
    hovered = plate;
    if (hovered) { hovered.state.hover = true; hovered.labelEl.classList.add("show"); }
    canvas.classList.toggle("pointing", Boolean(plate));
  }
});

canvas.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  const hit = pick(e.clientX, e.clientY);
  down = { x: e.clientX, y: e.clientY, plate: hit.plate, island: hit.island, t: performance.now() };
  if (hit.plate) world.controls.enabled = false; // a press on a plate is a pick, not an orbit
  world.controls.autoRotate = false;
});

window.addEventListener("pointerup", (e) => {
  if (dragging) { endDrag(e); }
  else if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6 && performance.now() - down.t < 600) {
    if (down.plate) selectPlate(down.plate, !selected);
    else if (down.island) { if (director.focused === down.island) selectPlate(null); else focusIsland(down.island); }
  }
  world.controls.enabled = true;
  down = null;
});

canvas.addEventListener("dblclick", (e) => {
  const hit = pick(e.clientX, e.clientY);
  if (!hit.plate && !hit.island) goOverview();
});

function startDrag(plate: Plate, e: PointerEvent) {
  dragging = plate;
  if (hovered) { hovered.state.hover = false; hovered.labelEl.classList.remove("show"); hovered = null; }
  world.controls.enabled = false;
  canvas.classList.add("grabbing");
  ghost = document.createElement("div");
  ghost.id = "ghost";
  if (plate.recipe.imageUrl) ghost.style.backgroundImage = `url(${imageUrl(plate.recipe.id)})`;
  document.body.appendChild(ghost);
  moveDrag(e);
}
function moveDrag(e: PointerEvent) {
  if (!ghost) return;
  ghost.style.left = `${e.clientX}px`;
  ghost.style.top = `${e.clientY}px`;
  const day = tray.dayAt(e.clientX, e.clientY);
  tray.highlight(day);
  ghost.style.transform = `translate(-50%, -50%) scale(${day ? 1.15 : 1})`;
}
async function endDrag(e: PointerEvent) {
  const plate = dragging!;
  dragging = null;
  canvas.classList.remove("grabbing");
  const day = tray.dayAt(e.clientX, e.clientY);
  tray.highlight(null);
  ghost?.remove(); ghost = null;
  if (day) await placeOnDay(plate.recipe, day, { x: e.clientX, y: e.clientY });
}

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.key === "Escape") { if (selected) selectPlate(null); else if (director.focused) goOverview(); }
  if (e.key === "Home") goOverview();
  const n = Number(e.key);
  if (n >= 1 && n <= islands.length && !e.metaKey && !e.ctrlKey) focusIsland(islands[n - 1]);
});

boot();
