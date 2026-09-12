import "./settings.css";
import { isRoomSoundEnabled, setRoomSoundEnabled } from "./room-sound";

/** One settings surface shared by the welcome screen, atlas, rooms and recipes. */
export function mountSettings() {
  const trigger = document.getElementById("settings-toggle") as HTMLButtonElement;
  const dialog = document.getElementById("settings") as HTMLDialogElement;
  const sound = document.getElementById("sound-enabled") as HTMLInputElement;

  trigger.addEventListener("click", () => {
    sound.checked = isRoomSoundEnabled();
    dialog.showModal();
    trigger.setAttribute("aria-expanded", "true");
  });
  sound.addEventListener("change", () => setRoomSoundEnabled(sound.checked));
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
