import "./world-intro.css";
import { AREAS, WORLDS, type Area, type WorldId } from "./graph";
import { escapeHtml } from "./plates";
import { WORLD_INTROS } from "./world-intros";

type WorldIntroHandlers = {
  onExploreArea: (area: Area) => void;
};

const SEEN_KEY = "food-world:seen-world-intro:";

/** A paper storybook that introduces a world without replacing the world behind it. */
export function mountWorldIntro({ onExploreArea }: WorldIntroHandlers) {
  const trigger = document.getElementById("world-intro-toggle") as HTMLButtonElement;
  const dialog = document.getElementById("world-intro") as HTMLDialogElement;
  const seen = new Set<WorldId>();
  let currentWorld: WorldId | null = null;
  let page = 0;

  function render() {
    if (!currentWorld) return;
    const intro = WORLD_INTROS[currentWorld];
    const world = WORLDS[currentWorld];
    const beat = intro.beats[page];
    const last = page === intro.beats.length - 1;
    dialog.style.setProperty("--world-story-accent", intro.accent);
    dialog.innerHTML = `
      <button class="world-intro-close" type="button" aria-label="Close the world story">×</button>
      <header>
        <p class="world-intro-kicker">World story · ${page + 1} of ${intro.beats.length}</p>
        <h2 id="world-intro-title">${escapeHtml(world.name)} <span>${escapeHtml(world.zh)}</span></h2>
        <p class="world-intro-summary">${escapeHtml(intro.summary)}</p>
      </header>
      <article tabindex="-1" aria-live="polite">
        <div class="world-intro-illustration" aria-hidden="true"><span>${beat.emoji}</span></div>
        <div class="world-intro-copy">
          <p class="world-intro-eyebrow">${escapeHtml(beat.eyebrow)}</p>
          <h3>${escapeHtml(beat.title)}</h3>
          <p>${escapeHtml(beat.body)}</p>
          ${beat.sources?.length ? `<p class="world-intro-sources"><span>Sources</span>${beat.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>`).join("")}</p>` : ""}
          ${beat.areas?.length ? `<div class="world-intro-places" aria-label="Places in this story">${beat.areas.map(area => `<button type="button" data-area="${area}">${escapeHtml(AREAS[area].name)} <span>${escapeHtml(AREAS[area].zh)}</span></button>`).join("")}</div>` : ""}
        </div>
      </article>
      <footer>
        <button class="world-intro-back" type="button"${page === 0 ? " disabled" : ""}>← Back</button>
        <div class="world-intro-pages" aria-label="Story progress">${intro.beats.map((_, index) => `<button type="button" data-page="${index}" aria-label="Story page ${index + 1}"${index === page ? ` aria-current="step"` : ""}></button>`).join("")}</div>
        <button class="world-intro-next" type="button">${last ? "Explore this world" : "Next →"}</button>
      </footer>
      <p class="world-intro-scope">A starting point, not a complete map of this food culture.</p>`;

    dialog.querySelector<HTMLButtonElement>(".world-intro-close")!.addEventListener("click", close);
    dialog.querySelector<HTMLButtonElement>(".world-intro-back")!.addEventListener("click", () => showPage(page - 1));
    dialog.querySelector<HTMLButtonElement>(".world-intro-next")!.addEventListener("click", () => last ? close() : showPage(page + 1));
    dialog.querySelectorAll<HTMLButtonElement>("[data-page]").forEach(button => button.addEventListener("click", () => showPage(Number(button.dataset.page))));
    dialog.querySelectorAll<HTMLButtonElement>("[data-area]").forEach(button => button.addEventListener("click", () => {
      const area = button.dataset.area as Area;
      close();
      onExploreArea(area);
    }));
  }

  function showPage(nextPage: number) {
    if (!currentWorld) return;
    page = Math.max(0, Math.min(nextPage, WORLD_INTROS[currentWorld].beats.length - 1));
    render();
    dialog.querySelector<HTMLElement>("article")?.focus({ preventScroll: true });
  }

  function open() {
    if (!currentWorld || dialog.open) return;
    page = 0;
    render();
    dialog.showModal();
    trigger.setAttribute("aria-expanded", "true");
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  function hasSeen(world: WorldId) {
    if (seen.has(world)) return true;
    try { return localStorage.getItem(`${SEEN_KEY}${world}`) === "1"; }
    catch { return false; }
  }

  function markSeen(world: WorldId) {
    seen.add(world);
    try { localStorage.setItem(`${SEEN_KEY}${world}`, "1"); }
    catch { /* The in-memory set still prevents repeats during this visit. */ }
  }

  trigger.addEventListener("click", open);
  dialog.addEventListener("close", () => trigger.setAttribute("aria-expanded", "false"));
  dialog.addEventListener("keydown", event => {
    event.stopPropagation();
    if (event.key === "ArrowLeft") showPage(page - 1);
    if (event.key === "ArrowRight") showPage(page + 1);
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });

  return {
    enter(world: WorldId, autoOpen = true) {
      currentWorld = world;
      trigger.hidden = false;
      trigger.title = `Read the ${WORLDS[world].name} food story`;
      trigger.setAttribute("aria-label", trigger.title);
      if (autoOpen && !hasSeen(world)) {
        markSeen(world);
        open();
      }
    },
    leave() {
      close();
      currentWorld = null;
      trigger.hidden = true;
    },
  };
}
