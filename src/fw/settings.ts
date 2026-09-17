import "./settings.css";
import { isRecipeLayerEnabled, setRecipeLayerEnabled } from "../data";

/** One settings surface shared by the welcome screen, atlas, rooms and recipes. */
export function mountSettings() {
  const trigger = document.getElementById("settings-toggle") as HTMLButtonElement;
  const dialog = document.getElementById("settings") as HTMLDialogElement;

  // Recipes are an add-on, not part of an area, so the switch is built here rather than shipped in the page.
  const recipesRow = document.createElement("label");
  recipesRow.className = "setting-row";
  recipesRow.htmlFor = "recipes-enabled";
  recipesRow.innerHTML = `<span>Recipes<small>Show the family recipes that match each place</small></span><input id="recipes-enabled" type="checkbox" role="switch"/><span class="switch-track" aria-hidden="true"></span>`;
  dialog.querySelector(".controls-help")!.before(recipesRow);
  const recipes = recipesRow.querySelector("input")!;

  trigger.addEventListener("click", () => {
    recipes.checked = isRecipeLayerEnabled();
    dialog.showModal();
    trigger.setAttribute("aria-expanded", "true");
  });
  recipes.addEventListener("change", () => setRecipeLayerEnabled(recipes.checked));
  dialog.addEventListener("close", () => trigger.setAttribute("aria-expanded", "false"));
  // Escape dismisses settings alone, leaving the room or recipe underneath intact.
  dialog.addEventListener("keydown", event => {
    if (event.key === "Escape") event.stopPropagation();
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
