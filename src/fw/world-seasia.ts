/** Southeast Asia: one grown table carrying Thailand across the west and the Vietnam package across the east.
 *
 *  The table is W 120, D 56, cx -22, identical to the Mediterranean, so x runs -82 to 38 and z stays -28 to 28.
 *  Thailand owns x -82 to -14, Vietnam owns x -12 to 38 and the two-unit strip between them carries ground
 *  only. The sea is one polygon wrapping the west, south and east edges and belongs to `thailand-landscape.ts`;
 *  every other piece of water belongs to the area it is in. Objects come from `graph.ts`.
 */
import * as THREE from 'three';
import { SEASIA_OBJECTS, type EnrichedRecipe } from "./graph";
import { type P } from "./props";
import { SEASIA_PROPS } from "./props-seasia";
import { THAILAND_PROPS } from "./props-thailand";
import { VIETNAM_PROPS } from "./props-vietnam";
import { thailandLandscape, TH_LANES, BUFFALO_LANE, type Lane } from "./thailand-landscape";
import { thailandTown, thaiBridgeLift } from "./thailand-town";
import { thailandCountryside } from "./thailand-countryside";
import { thailandResident, thailandWalk, thaiBuffalo, followBuffalo } from "./thailand-people";
import { vietnamLandscape } from "./vietnam-landscape";
import { vietnamTown } from "./vietnam-town";
import { vietnamCountryside } from "./vietnam-countryside";
import { buildWorld, type Diorama, type LayoutCtx } from "./worldkit";

export function buildSeasia(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "southeast-asia", W: 120, D: 56, cx: -22, ground: "#8fbf6e", plinth: "#6b4a32", recipes,
    objects: SEASIA_OBJECTS, props: { ...SEASIA_PROPS, ...THAILAND_PROPS, ...VIETNAM_PROPS },
    small: /^(chickenSea)$/, fallbackPlace: "curryPaste", discoveryCues: true,
    layout: layoutSeasia,
  });
}

function layoutSeasia(ctx: LayoutCtx) {
  const { group } = ctx;

  // ---------- Thailand: ground, the one sea, the rivers, the khlong grid and the relief ----------
  thailandLandscape(ctx);
  // ---------- Vietnam: its own ground, rivers, lake, paddies and karsts, inside its own band ----------
  vietnamLandscape(ctx);

  // ---------- the built clusters, then the country between them ----------
  thailandTown(ctx);
  vietnamTown(ctx);
  thailandCountryside(ctx);
  vietnamCountryside(ctx);

  // ---------- Thai life: four peopled loops on the lanes, one with a buffalo on a halter ----------
  const led: [P, P][] = [];
  for (const lane of TH_LANES) {
    const lift = thaiBridgeLift(lane as Lane);
    for (let i = 0; i < lane.walkers; i++) {
      const seed = lane.seed + i;
      const p = thailandResident(seed);
      p.name = 'thai-walker'; p.userData.lane = lane.id; group.add(p);
      ctx.tickers.push(thailandWalk(p, lane.from, lane.to, lane.range, seed + i * 5, lift));
      if (lane.id === BUFFALO_LANE && i === 0) { const b = thaiBuffalo(); b.name = 'thai-buffalo'; group.add(b); led.push([b, p]); }
    }
  }
  for (const [buffalo, handler] of led) ctx.tickers.push(followBuffalo(buffalo, handler, group));

  // Neighbours who stand and talk: the quay, the wat corner, the Sampheng lane, the plain and the peninsula.
  // A standing figure does not translate, so it does not step.
  for (const [i, [x, z, n]] of ([[-38.9, -6.8, 3], [-33.2, -8.4, 2], [-29.4, -0.8, 2], [-56.8, -8.6, 2], [-66.4, 19.4, 2], [-25.8, -19.6, 2]] as [number, number, number][]).entries()) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i;
      const neighbour = ctx.place(thailandResident(50 + i * 3 + k), x + Math.cos(a) * .55, z + Math.sin(a) * .55, -a - Math.PI / 2);
      neighbour.name = 'thai-neighbour';
    }
  }
  void THREE;
}
