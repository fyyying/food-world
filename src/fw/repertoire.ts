/**
 * A place is not one dish.
 *
 * Every room and every place-or-dish object declares its repertoire as world content: the hero dish first, then
 * the dishes that kitchen actually cooks. The content lives in one table per world, owned by that world's
 * Researcher (`china-repertoire.ts`, `turkey-repertoire.ts`, `spain-repertoire.ts`); this module merges them,
 * and draws the card section that shows them.
 *
 * The repertoire is world content, not the recipe add-on: it is there with the add-on off, which is how the
 * world is built and reviewed. The add-on only adds a link on the entries whose `recipe` id is a recipe that
 * really loaded.
 */
import { isRecipeLayerEnabled } from "../data";
import { CHINA_REPERTOIRE } from "./china-repertoire";
import { ITALY_REPERTOIRE } from "./italy-repertoire";
import type { EnrichedRecipe } from "./graph";
import { escapeHtml as esc } from "./plates";
import { SPAIN_REPERTOIRE } from "./spain-repertoire";
import { THAILAND_REPERTOIRE } from "./thailand-repertoire";
import { TURKEY_REPERTOIRE } from "./turkey-repertoire";
import { VIETNAM_REPERTOIRE } from "./vietnam-repertoire";

/**
 * One dish in a place's repertoire. `zh` is the local name, `recipe` an exact id from the recipe export, and
 * `art` a file stem under `public/scenes/<world>-dishes/` drawn as a small square thumbnail before the name.
 *
 * No repertoire pictures exist yet (owner, 2026-09-17: a to-do for later, not for this pass), so every list
 * renders text-only until a world's dish illustrations are delivered.
 */
export type RepertoireEntry = { name: string; zh?: string; line: string; recipe?: string; art?: string };

/** Every world's table, in the order they are searched. Ids are unique across worlds, so the order never matters. */
export const REPERTOIRE_TABLES: Record<string, RepertoireEntry[]>[] = [CHINA_REPERTOIRE, TURKEY_REPERTOIRE, SPAIN_REPERTOIRE, THAILAND_REPERTOIRE, VIETNAM_REPERTOIRE, ITALY_REPERTOIRE];

const NONE: RepertoireEntry[] = [];

/** What this object cooks. A key nobody has written yet returns nothing at all, and the card omits the section. */
export function repertoireOf(objectId: string): RepertoireEntry[] {
  for (const table of REPERTOIRE_TABLES) {
    const entries = table[objectId];
    if (entries?.length) return entries;
  }
  return NONE;
}

/**
 * A kitchen cooks a list; a single dish object is served a way. A dish that opens a painted room is a kitchen —
 * the hotpot house is `kind: "dish"` and cooks a whole table — so a room always takes the kitchen heading.
 */
export const repertoireLabel = (kind: string, room = false) => (kind === "dish" && !room ? "How it is served" : "What this kitchen cooks");

// The recipe add-on's index by id. `main.ts` fills it the moment the recipes load, which only happens while the
// add-on is on; with the add-on off nothing is indexed and no entry carries a link.
let index = new Map<string, EnrichedRecipe>();

/** The loaded recipes, so an entry that names one can link to it. */
export function setRepertoireRecipes(recipes: EnrichedRecipe[]) {
  index = new Map(recipes.map((r) => [r.id, r]));
}

/** The recipe an entry names, when the add-on is on and that recipe really loaded. */
export function repertoireRecipe(id: string | undefined): EnrichedRecipe | undefined {
  return id && isRecipeLayerEnabled() ? index.get(id) : undefined;
}

/**
 * The card section: the heading, then one line per dish — its picture where one exists, the name, the local name,
 * and the one line that says what it is. Nothing at all when the object has no repertoire, so no heading is left
 * behind.
 */
export function repertoireHtml(o: { id: string; kind: string; world: string; scene?: string }): string {
  const entries = repertoireOf(o.id);
  if (!entries.length) return "";
  const rows = entries.map((e) => {
    const linked = repertoireRecipe(e.recipe);
    const art = e.art ? `<span class="art" style="background-image:url(${import.meta.env.BASE_URL}scenes/${o.world}-dishes/${encodeURIComponent(e.art)}.webp)"></span>` : "";
    return `<li>${art}<b>${esc(e.name)}${e.zh ? `<span class="zh">${esc(e.zh)}</span>` : ""}</b><span class="line">${esc(e.line)}</span>${
      linked ? `<button class="rlink" type="button" data-recipe="${esc(linked.id)}">Recipe ↗</button>` : ""
    }</li>`;
  });
  return `<h4>${repertoireLabel(o.kind, Boolean(o.scene))}</h4><ul class="repertoire">${rows.join("")}</ul>`;
}
