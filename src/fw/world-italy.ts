/** Italy: three landmasses in one sea on a 100 x 64 table — the mainland carrying Rome and the Veneto's
 *  terraferma, the Venetian lagoon of island quays cut off its north-east shoulder, and Sicily across a strait
 *  in the south.
 *
 *  The table is `W: 100, D: 64` centred on the origin, so x runs -50 to 50 and z -32 to 32. The sea is the
 *  table itself with the three landmasses and the lagoon's five islands as holes in one `seaWater()` polygon,
 *  and `THREE.Shape` renders those holes cleanly, so the sea is one polygon, one rim and one shader rather
 *  than several meeting at the strait. The strait is therefore not drawn at all: it is the 4.5 units of water
 *  the mainland's toe and Sicily's cape leave between them, and a boat lane crosses it because there was no
 *  bridge.
 *
 *  Everything the old 76 x 56 table carried is gone with it: both hand-drawn shore polygons, the old lagoon
 *  rim, the nine-wide channel, the straight filler strip at x 35.75, the four island boxes, the four
 *  `venetianBridge` decks, the six mooring poles, the two Vespas, the three disconnected `path()` ribbons, the
 *  eleven houses, the two walker loops, and the decor placements of `colosseum()`, `pantheon()`, `campanile()`
 *  and `etna()`, each of which is a registered clickable object now and must not stand twice.
 *
 *  Objects come from `graph.ts`; the Stage C layout reads the Researcher's positions out of `italy-objects.ts`
 *  for its own clearance rules, because `graph.ts` is registered at Stage D.
 */
import { ITALY_OBJECTS, type EnrichedRecipe } from "./graph";
import { ITALY_PROPS } from "./props-italy";
import { italyLandscape } from "./italy-landscape";
import { italyTown } from "./italy-town";
import { italyCountryside } from "./italy-countryside";
import { buildWorld, type Diorama, type LayoutCtx } from "./worldkit";

export function buildItaly(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "italy", W: 100, D: 64, ground: "#a9bf7a", plinth: "#7a5232", recipes,
    objects: ITALY_OBJECTS, props: { ...ITALY_PROPS },
    small: /^(cow|chicken)$/, fallbackPlace: "ragu",
    layout: layoutItaly,
  });
}

function layoutItaly(ctx: LayoutCtx) {
  // ---------- the ground, the one sea, the lagoon, the strait, the Tiber and the relief ----------
  italyLandscape(ctx);
  // ---------- the built clusters: roads, paving, the bridge, the houses, the boats and the people ----------
  italyTown(ctx);
  // ---------- and the country between them ----------
  italyCountryside(ctx);
}
