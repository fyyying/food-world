import type { Filters } from "../data";
import { escapeHtml } from "../world/plates";

export type TopbarHandlers = {
  onFilters: (f: Filters) => void;
  onSearchEnter: () => void;
  onBack: () => void;
};

const CHIPS: { key: keyof Omit<Filters, "query">; label: string }[] = [
  { key: "quick", label: "≤ 30 min" },
  { key: "easy", label: "Easy" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "kids", label: "Kid friendly" },
  { key: "mains", label: "Mains only" },
  { key: "unplanned", label: "Not on the plan" },
];

export function mountTopbar(root: HTMLElement, filters: Filters, h: TopbarHandlers) {
  root.innerHTML = `
    <div class="brand">
      <h1>Little <em>Kitchens</em></h1>
      <div class="crumb" id="crumb"><span>Seven islands · all your recipes</span></div>
    </div>
    <div class="tools">
      <label class="search"><span aria-hidden="true">⌕</span><input id="q" type="search" placeholder="Search dishes, tags, ingredients…" autocomplete="off" /><kbd>/</kbd></label>
      <div class="chips" id="chips">
        ${CHIPS.map((c) => `<button class="chip" data-key="${c.key}" aria-pressed="false">${c.label}</button>`).join("")}
        <button class="chip reset" id="reset" hidden>Clear</button>
        <span class="match-count" id="matches"></span>
      </div>
    </div>`;

  const q = root.querySelector<HTMLInputElement>("#q")!;
  const chips = root.querySelector<HTMLElement>("#chips")!;
  const reset = root.querySelector<HTMLButtonElement>("#reset")!;
  const crumb = root.querySelector<HTMLElement>("#crumb")!;
  const matches = root.querySelector<HTMLElement>("#matches")!;

  const emit = () => {
    const anyChip = CHIPS.some((c) => filters[c.key]);
    reset.hidden = !anyChip && !filters.query;
    h.onFilters({ ...filters });
  };
  q.addEventListener("input", () => { filters.query = q.value; emit(); });
  q.addEventListener("keydown", (e) => { if (e.key === "Enter") h.onSearchEnter(); if (e.key === "Escape") { q.value = ""; filters.query = ""; emit(); q.blur(); } });
  chips.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>(".chip[data-key]");
    if (!b) return;
    const key = b.dataset.key as keyof Omit<Filters, "query">;
    filters[key] = !filters[key];
    b.setAttribute("aria-pressed", String(filters[key]));
    emit();
  });
  reset.addEventListener("click", () => {
    for (const c of CHIPS) { filters[c.key] = false; chips.querySelector(`[data-key="${c.key}"]`)!.setAttribute("aria-pressed", "false"); }
    filters.query = ""; q.value = "";
    emit();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== q && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); q.focus(); }
  });

  return {
    setCrumb(islandName: string | null, count?: number) {
      crumb.innerHTML = islandName
        ? `<button id="back">← All islands</button><span>·</span><span>${escapeHtml(islandName)}${count !== undefined ? ` · ${count} dish${count === 1 ? "" : "es"}` : ""}</span>`
        : `<span>Seven islands · all your recipes</span>`;
      crumb.querySelector("#back")?.addEventListener("click", h.onBack);
    },
    setMatches(shown: number, total: number, active: boolean) {
      matches.textContent = active ? `${shown} of ${total}` : "";
    },
    focusSearch() { q.focus(); },
  };
}
