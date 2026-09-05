import { DAY_SHORT, WEEKDAYS, dayDate, type PlanState, type Recipe, type Weekday } from "../data";
import { imageUrl } from "../data";
import { escapeHtml } from "../world/plates";

export type TrayHandlers = {
  onMealClick: (recipeId: string) => void;
  onRemove: (slotId: string) => void;
  onRefresh: () => void;
  onSyncRecipes: () => void;
};

export function mountTray(root: HTMLElement, h: TrayHandlers) {
  let state: PlanState | null = null;
  let recipesById = new Map<string, Recipe>();

  function render() {
    if (!state) { root.innerHTML = `<div class="head"><h2>This week</h2><span class="status">loading…</span></div>`; return; }
    const { plan } = state;
    const weekLabel = new Date(plan.weekStart + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long" });
    root.innerHTML = `
      <div class="head">
        <h2>Week of ${weekLabel}</h2>
        <span class="status ${state.online ? "online" : "offline"}">${state.online ? `planner · ${escapeHtml(plan.status.replace(/_/g, " "))}` : "planner offline · saved here"}</span>
        <span class="spacer"></span>
        <button id="sync" title="Re-read the Recipes database from Notion and rebuild the islands">↻ Sync Notion</button>
        <button id="refresh" title="Reload this week from the planner">↻ Plan</button>
        ${state.online ? `<a href="${escapeHtml(state.plannerUrl)}/plan" target="_blank" rel="noopener">Open planner ↗</a>` : ""}
      </div>
      <div class="days-row">
        ${WEEKDAYS.map((day) => {
          const slots = plan.slots.filter((s) => s.day === day);
          const dishes = slots.filter((s) => s.recipeId);
          const skip = slots.length > 0 && slots.every((s) => s.status === "skip");
          const kind = slots.find((s) => s.constraint?.type)?.constraint?.type;
          return `<div class="day${skip ? " skip" : ""}" data-day="${day}">
            <div class="dh"><b>${DAY_SHORT[day]}</b><small>${dayDate(plan.weekStart, day)}</small>${kind && kind !== "normal" ? `<span class="kind ${kind}">${kind}</span>` : ""}</div>
            ${dishes.length ? dishes.map((s) => {
              const r = recipesById.get(s.recipeId!);
              return `<button class="meal" data-recipe="${s.recipeId}" data-slot="${s.id}" title="${escapeHtml(s.title ?? "")}">
                <span class="thumb" style="${r?.imageUrl ? `background-image:url(${imageUrl(r.id)})` : ""}"></span>
                <span class="txt"><div>${escapeHtml(s.title ?? r?.title ?? "Dish")}</div><small>${s.estimatedMinutes ? `${s.estimatedMinutes} min` : ""}</small></span>
                <span class="x" data-remove="${s.id}" title="Remove from ${DAY_SHORT[day]}">×</span>
              </button>`; }).join("")
              : `<div class="empty-day">${skip ? "skip · drop to cook" : "drop a plate"}</div>`}
          </div>`;
        }).join("")}
      </div>`;
    root.querySelector("#refresh")!.addEventListener("click", h.onRefresh);
    root.querySelector("#sync")!.addEventListener("click", h.onSyncRecipes);
    root.querySelector(".days-row")!.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      const x = t.closest<HTMLElement>("[data-remove]");
      if (x) { e.stopPropagation(); h.onRemove(x.dataset.remove!); return; }
      const m = t.closest<HTMLElement>(".meal");
      if (m) h.onMealClick(m.dataset.recipe!);
    });
  }

  render();
  return {
    update(next: PlanState, recipes: Recipe[]) {
      state = next;
      recipesById = new Map(recipes.map((r) => [r.id, r]));
      render();
    },
    flash(recipeId: string) {
      const el = root.querySelector<HTMLElement>(`.meal[data-recipe="${recipeId}"]`);
      if (el) { el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 700); }
    },
    dayAt(x: number, y: number): Weekday | null {
      const el = document.elementFromPoint(x, y)?.closest<HTMLElement>(".day");
      return (el?.dataset.day as Weekday) ?? null;
    },
    highlight(day: Weekday | null) {
      root.querySelectorAll(".day").forEach((d) => d.classList.toggle("over", (d as HTMLElement).dataset.day === day));
    },
    get plan() { return state?.plan ?? null; },
  };
}
