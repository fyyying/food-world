import { escapeHtml } from "../world/plates";

export type Choice = { label: string; sub?: string; value: string | null; kind?: "add" };

/** Small anchored menu; resolves with the chosen value, or undefined when dismissed. */
export function choose(anchor: { x: number; y: number }, title: string, choices: Choice[]): Promise<string | null | undefined> {
  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "popover";
    el.innerHTML = `<div class="title">${escapeHtml(title)}</div>` + choices.map((c, i) =>
      `<button data-i="${i}" class="${c.kind ?? ""}">${escapeHtml(c.label)}${c.sub ? `<small>${escapeHtml(c.sub)}</small>` : ""}</button>`).join("");
    document.body.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    el.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, anchor.x - w / 2))}px`;
    el.style.top = `${Math.max(8, Math.min(window.innerHeight - h - 8, anchor.y - h - 12))}px`;
    const close = (v: string | null | undefined) => { el.remove(); document.removeEventListener("pointerdown", outside, true); document.removeEventListener("keydown", key); resolve(v); };
    const outside = (e: PointerEvent) => { if (!el.contains(e.target as Node)) close(undefined); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(undefined); };
    setTimeout(() => { document.addEventListener("pointerdown", outside, true); document.addEventListener("keydown", key); });
    el.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest("button");
      if (b) close(choices[Number(b.dataset.i)].value);
    });
  });
}
