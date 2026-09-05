import { CUISINE_FLAGS } from "../regions";
import { DAY_SHORT, WEEKDAYS, dayNumber, fetchBody, minutesLabel, type Plan, type Recipe, type Weekday } from "../data";
import { imageUrl } from "../data";
import { escapeHtml } from "../world/plates";

export type InspectorHandlers = {
  onClose: () => void;
  onPickDay: (day: Weekday, anchor: { x: number; y: number }) => Promise<void>;
};

export function mountInspector(root: HTMLElement, h: InspectorHandlers) {
  let current: Recipe | null = null;
  let bodyToken = 0;

  function render(recipe: Recipe, plan: Plan | null) {
    const planned = new Map<Weekday, { count: number; hasThis: boolean; skip: boolean; easy: boolean }>();
    for (const day of WEEKDAYS) {
      const slots = plan?.slots.filter((s) => s.day === day) ?? [];
      planned.set(day, {
        count: slots.filter((s) => s.recipeId).length,
        hasThis: slots.some((s) => s.recipeId === recipe.id),
        skip: slots.length > 0 && slots.every((s) => s.status === "skip"),
        easy: slots.some((s) => s.constraint?.type === "easy"),
      });
    }
    const flag = recipe.cuisine ? CUISINE_FLAGS[recipe.cuisine] ?? "" : "🥗";
    const last = recipe.lastCooked ? new Date(recipe.lastCooked).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";
    root.innerHTML = `
      <div class="photo${recipe.imageUrl ? "" : " empty"}" style="${recipe.imageUrl ? `background-image:url(${imageUrl(recipe.id)})` : ""}">
        <button class="close" aria-label="Close">×</button>
        <span class="cuisine">${flag} ${escapeHtml(recipe.cuisine ?? recipe.course ?? "Pantry")}</span>
      </div>
      <div class="body">
        <h2>${escapeHtml(recipe.title)}</h2>
        ${recipe.stars ? `<div class="stars">${"★".repeat(recipe.stars)}<span style="color:#ddd">${"★".repeat(5 - recipe.stars)}</span></div>` : ""}
        <h3>Put it on the week${plan ? ` · ${new Date(plan.weekStart + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}` : ""}</h3>
        <div class="days">
          ${WEEKDAYS.map((d) => { const p = planned.get(d)!; return `<button data-day="${d}" class="${p.hasThis ? "current" : p.skip ? "skip" : p.count ? "has" : ""}" title="${p.skip ? "Skip day — adding a dish turns it into a cooking day" : p.count ? `${p.count} dish${p.count > 1 ? "es" : ""} planned` : "Free"}">
            <b>${DAY_SHORT[d]}</b><small>${plan ? dayNumber(plan.weekStart, d) : ""}</small></button>`; }).join("")}
        </div>
        <p class="hint">Click a day to add it, or drag the plate onto the week tray below.</p>
        <div class="facts">
          <div class="fact"><b>${escapeHtml(minutesLabel(recipe))}</b><span>${recipe.prepMin != null && recipe.cookMin != null ? `${recipe.prepMin} prep · ${recipe.cookMin} cook` : "total time"}</span></div>
          <div class="fact"><b>${escapeHtml(recipe.effort ?? "—")}</b><span>effort</span></div>
          <div class="fact"><b>${recipe.portions ?? "—"}</b><span>portions</span></div>
          <div class="fact"><b>${escapeHtml(recipe.course ?? "—")}</b><span>${escapeHtml(recipe.method ?? "course")}</span></div>
          <div class="fact"><b>${recipe.liked > 0 ? `+${recipe.liked}` : recipe.liked}</b><span>liked score</span></div>
          <div class="fact"><b>${last}</b><span>last cooked</span></div>
        </div>
        <div class="tags">
          ${recipe.protein.map((p) => `<span class="tag protein">${escapeHtml(p)}</span>`).join("")}
          ${recipe.tags.map((t) => `<span class="tag">${escapeHtml(t.replace(/_/g, " "))}</span>`).join("")}
          ${recipe.carb ? `<span class="tag">${recipe.carb} carb</span>` : ""}
        </div>
        <div id="recipe-body"><div class="skeleton" style="width:60%"></div><div class="skeleton"></div><div class="skeleton" style="width:80%"></div></div>
        <div class="links">
          <a href="${escapeHtml(recipe.notionUrl)}" target="_blank" rel="noopener">Open in Notion ↗</a>
          ${recipe.sourceUrl ? `<a href="${escapeHtml(recipe.sourceUrl)}" target="_blank" rel="noopener">Source ↗</a>` : ""}
        </div>
      </div>`;
    root.querySelector(".close")!.addEventListener("click", h.onClose);
    root.querySelector(".days")!.addEventListener("click", async (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-day]");
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.disabled = true;
      try { await h.onPickDay(b.dataset.day as Weekday, { x: r.left + r.width / 2, y: r.top }); } finally { b.disabled = false; }
    });

    const token = ++bodyToken;
    fetchBody(recipe.id).then((body) => {
      if (token !== bodyToken) return;
      const el = root.querySelector("#recipe-body");
      if (!el) return;
      const groups = (body.groups ?? []).filter((g) => g.items.length);
      const ing = body.ingredients.length
        ? `<h3>Ingredients · ${body.ingredients.length}</h3>` + (groups.some((g) => g.title)
          ? groups.map((g) => `${g.title ? `<p class="hint" style="margin:8px 0 2px;font-weight:800">${escapeHtml(g.title)}</p>` : ""}<ul class="ingredients">${g.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`).join("")
          : `<ul class="ingredients">${body.ingredients.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`)
        : "";
      const steps = body.steps.length ? `<h3>Steps</h3><ol class="steps">${body.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>` : "";
      el.innerHTML = ing + steps || `<p class="hint">The Notion page has no ingredient list yet.</p>`;
    }).catch(() => {
      const el = root.querySelector("#recipe-body");
      if (el && token === bodyToken) el.innerHTML = `<p class="hint">Couldn't load the recipe page.</p>`;
    });
  }

  return {
    show(recipe: Recipe, plan: Plan | null) { current = recipe; root.hidden = false; render(recipe, plan); },
    refresh(plan: Plan | null) { if (current && !root.hidden) { const scroll = root.querySelector(".body")?.scrollTop ?? 0; render(current, plan); const b = root.querySelector(".body"); if (b) b.scrollTop = scroll; } },
    hide() { current = null; root.hidden = true; },
    get recipe() { return current; },
  };
}
