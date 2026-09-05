export type Recipe = {
  id: string;
  title: string;
  cuisine: string | null;
  course: string | null;
  mealType: string | null;
  effort: "easy" | "medium" | "hard" | null;
  prepMin: number | null;
  cookMin: number | null;
  totalMin: number | null;
  stars: number;
  liked: number;
  timesCooked: number;
  lastCooked: string | null;
  mainIngredient: string[];
  protein: string[];
  tags: string[];
  portions: number | null;
  carb: string | null;
  proteinScore: string | null;
  method: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  notionUrl: string;
};

export type RecipeBody = { ingredients: string[]; groups?: { title: string; items: string[] }[]; steps: string[]; notes: string[] };

export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export const WEEKDAYS: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export type PlanSlot = {
  id: string;
  day: Weekday;
  status: "planned" | "skip" | string;
  recipeId?: string;
  title?: string;
  estimatedMinutes?: number;
  constraint?: { type: "normal" | "easy" | "skip" | "custom" };
};

export type Plan = { id: string; weekStart: string; status: string; slots: PlanSlot[] };

export type PlanState =
  | { online: true; plan: Plan; plannerUrl: string }
  | { online: false; reason: string; plan: Plan };

/** Static hosting (GitHub Pages): read exported JSON and photos instead of the API. */
export const STATIC = import.meta.env.VITE_STATIC === "1";
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const imageUrl = (id: string) => (STATIC ? `${BASE}/static/images/${id}.jpg` : `/api/image/${id}`);

export async function fetchRecipes(refresh = false): Promise<{ recipes: Recipe[]; stale: boolean }> {
  const res = await fetch(STATIC ? `${BASE}/static/recipes.json` : `/api/recipes${refresh ? "?refresh=1" : ""}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Recipes failed (${res.status})`);
  return res.json();
}

export async function fetchBody(id: string): Promise<RecipeBody> {
  const res = await fetch(STATIC ? `${BASE}/static/bodies/${id}.json` : `/api/recipes/${id}/body`);
  if (!res.ok) throw new Error("Could not load the recipe page");
  return res.json();
}

const LOCAL_KEY = "food-tour:local-plan";

function localPlan(): Plan {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  const monday = nextMonday();
  return {
    id: "local",
    weekStart: monday,
    status: "local",
    slots: WEEKDAYS.map((day) => ({ id: `local-${day}`, day, status: "planned", constraint: { type: "normal" } })),
  };
}

function saveLocal(plan: Plan) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(plan)); } catch { /* ignore */ }
}

function nextMonday(): string {
  const d = new Date();
  const diff = (8 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export async function fetchPlan(): Promise<PlanState> {
  try {
    const res = await fetch("/api/plan");
    const data = await res.json();
    if (data.online) return { online: true, plan: data.plan, plannerUrl: data.plannerUrl };
    return { online: false, reason: data.reason ?? "offline", plan: localPlan() };
  } catch (error) {
    return { online: false, reason: String(error), plan: localPlan() };
  }
}

/** Put a recipe on a day. `slotId` replaces that dish; omit it to add a dish to the day. */
export async function assignRecipe(state: PlanState, day: Weekday, recipe: Recipe, slotId?: string): Promise<PlanState> {
  if (state.online) {
    const res = await fetch("/api/plan/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: state.plan.id, slotId, day, recipeId: recipe.id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "The planner refused the change");
    return fetchPlan();
  }
  const plan = structuredClone(state.plan);
  const slot: PlanSlot = {
    id: slotId ?? `local-${day}-${Date.now()}`,
    day,
    status: "planned",
    recipeId: recipe.id,
    title: recipe.title,
    estimatedMinutes: recipe.totalMin ?? undefined,
    constraint: { type: "normal" },
  };
  const idx = slotId ? plan.slots.findIndex((s) => s.id === slotId) : -1;
  if (idx >= 0) plan.slots[idx] = slot; else plan.slots.push(slot);
  saveLocal(plan);
  return { ...state, plan };
}

export async function removeSlot(state: PlanState, slotId: string): Promise<PlanState> {
  if (state.online) {
    const res = await fetch("/api/plan/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: state.plan.id, slotId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Could not remove the dish");
    return fetchPlan();
  }
  const plan = structuredClone(state.plan);
  const slot = plan.slots.find((s) => s.id === slotId);
  const dayCount = plan.slots.filter((s) => s.day === slot?.day).length;
  if (slot && dayCount > 1) plan.slots = plan.slots.filter((s) => s.id !== slotId);
  else if (slot) { delete slot.recipeId; delete slot.title; delete slot.estimatedMinutes; }
  saveLocal(plan);
  return { ...state, plan };
}

// ---------- filtering ----------

export type Filters = {
  query: string;
  quick: boolean;      // ≤ 30 minutes
  easy: boolean;
  vegetarian: boolean;
  kids: boolean;
  mains: boolean;
  unplanned: boolean;  // not on the current plan
};

export const EMPTY_FILTERS: Filters = { query: "", quick: false, easy: false, vegetarian: false, kids: false, mains: false, unplanned: false };

export function matches(recipe: Recipe, f: Filters, plannedIds: Set<string>): boolean {
  if (f.quick && !(recipe.totalMin !== null && recipe.totalMin <= 30)) return false;
  if (f.easy && recipe.effort !== "easy") return false;
  if (f.vegetarian && !(recipe.tags.includes("vegetarian") || recipe.mainIngredient.includes("Vegetarian"))) return false;
  if (f.kids && !recipe.tags.includes("kid_friendly")) return false;
  if (f.mains && recipe.course !== "Main") return false;
  if (f.unplanned && plannedIds.has(recipe.id)) return false;
  const q = f.query.trim().toLowerCase();
  if (q) {
    const hay = [recipe.title, recipe.cuisine, recipe.course, recipe.method, ...recipe.tags, ...recipe.mainIngredient, ...recipe.protein]
      .filter(Boolean).join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function minutesLabel(recipe: Recipe): string {
  if (recipe.totalMin === null) return "time unknown";
  const m = recipe.totalMin;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

export const DAY_SHORT: Record<Weekday, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
};

export function dayDate(weekStart: string, day: Weekday): string {
  const d = new Date(weekStart + "T00:00:00");
  d.setDate(d.getDate() + WEEKDAYS.indexOf(day));
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function dayNumber(weekStart: string, day: Weekday): number {
  const d = new Date(weekStart + "T00:00:00");
  d.setDate(d.getDate() + WEEKDAYS.indexOf(day));
  return d.getDate();
}
