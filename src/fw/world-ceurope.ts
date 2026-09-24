/** The United Kingdom (world id `central-europe` until the id rename to `uk`): Britain alone on its own table.
 *
 *  UK re-lay, 2026-09-24 (docs/london-world.md, "UK re-lay"). The owner ruled that Britain becomes its own world:
 *  Budapest, the Alps and Georgia leave this table and wait, card-only, for an unpublished Central Europe world of
 *  their own. Their objects stay in `CEUROPE_OBJECTS` and their props in `props-ceurope.ts`, and recipes routed to
 *  them fall back to the public house; this table builds none of them, and none of their water, peaks, cable car,
 *  ferries, walkers or farmland. The table is **W 85, D 109, cx -52.5, cz 8.5** (grown from W 68 x D 88 on the lead's QC so the sea is wide round the headlands): the island has all of it, and its six
 *  clusters are pulled apart by `london-warp.ts` so hills, moor and river lie between them.
 *
 *  Britain's ground, water, roads, buildings, people and countryside are the `london-*` modules. Objects come from
 *  graph.ts, filtered to the `london` area.
 */
import { CEUROPE_OBJECTS, type EnrichedRecipe } from "./graph";
import { LONDON_PROPS } from "./props-london";
import { londonLandscape } from "./london-landscape";
import { londonTown } from "./london-town";
import { londonCountryside, londonUplands } from "./london-countryside";
import { buildWorld, type Diorama, type LayoutCtx } from "./worldkit";

/** The areas that are not on this table: they keep their objects in graph.ts for the Central Europe world to come. */
export const OFF_TABLE_AREAS = new Set(["budapest", "alps", "georgia"]);

export function buildCeurope(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "central-europe", W: 85, D: 109, cx: -52.5, cz: 8.5, ground: "#8fb56a", plinth: "#5a4a3a", recipes,
    objects: CEUROPE_OBJECTS.filter((o) => !OFF_TABLE_AREAS.has(o.area)), props: LONDON_PROPS,
    small: /^(phoneBox|redBus)$/, fallbackPlace: "roastPub",
    layout: layoutUk,
  });
}

function layoutUk(ctx: LayoutCtx) {
  // Britain: its ground, its sea with the island as the hole in it, its river and its inlets; then the built
  // clusters; then the uplands, moors and downs that part them; then the country between.
  londonLandscape(ctx);
  londonTown(ctx);
  londonUplands(ctx);
  londonCountryside(ctx);
}
