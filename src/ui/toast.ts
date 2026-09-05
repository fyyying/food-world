const root = () => document.getElementById("toasts")!;

export function toast(message: string, kind: "ok" | "err" = "ok", ms = 2600) {
  const el = document.createElement("div");
  el.className = `toast${kind === "err" ? " err" : ""}`;
  el.textContent = message;
  root().appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .3s"; setTimeout(() => el.remove(), 300); }, ms);
}
