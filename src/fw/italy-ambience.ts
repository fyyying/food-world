/** Always-on painting motion per Italy room, per orientation, and the sprites hung over the paintings.
 *  Owned by the Room maker. Every box, path and sprite fraction below was measured on the delivered file at that
 *  orientation — `public/scenes/it_<id>/wide.jpg` (1672 x 941) or `portrait.jpg` (941 x 1672) — never converted from
 *  the other one. The reasoning per room is in docs/italy-rooms.md.
 *
 *  Italy ships **no `breeze` crop**, for the same reason Thailand and Vietnam ship none: the image brief asked every
 *  painting for an empty hook, peg, chain, rail or cane and for the hanging object to arrive as a separate keyed
 *  sprite, so every room with hanging motion hangs a delivered `it-<name>` sprite over clean lime wash, plaster,
 *  stone or sky. Nothing is cut out of a finished picture and no wall has to be repaired behind it.
 *
 *  The engine's `choose` in scene-painted.ts keeps `3 - heat - flyers` ambience patches, so a room that steams and
 *  burns keeps one patch, and a hung sprite swings on its own timer on top of that. Four rooms therefore carry no
 *  ambience list at all: their four always-on loops are the signature, the steam, the fire and the sprite. The
 *  order inside each list runs from the cue that matters most to the one the engine may drop.
 *
 *  **The cold half of this world.** `it_casale` has no fire, no steam and nothing hot in it at all; its liquid is
 *  whey off the draining table and it takes the `drip` glint variant. `it_market`, `it_pescaria`, `it_bacaro`,
 *  `it_ballaro` and `it_pasticceria` are cold too — raw fish on marble, artichokes, wine, produce, pastry and ice —
 *  and not one of them carries a steam source or a fire ellipse.
 */
import type { AmbientPatch } from './scene-ambience';
import type { HungSprite } from './scene-painted';

export const ITALY_AMBIENCE: Record<string, AmbientPatch[]> = {
  it_trattoria: [
    // The piazza door at the right, wide only. The wide painting's empty hook sits under the room heading (the
    // salumi hung from it crossed the end of the title at 1280 x 720), so the wide composition spends its fourth
    // loop on the daylight the room is lit by. The portrait hangs the salumi and has no slot for this.
    { kind: 'sunray', wide: [.56, 0, .90, .70], angles: [.36, .32], sway: [.095, .085] },
  ],
  it_market: [
    // The clean sky over the house fronts on the far side of the Campo. The market is the brightest room in Rome's
    // cluster and its only real openings are the sky and the young tree beside the statue base.
    { kind: 'birds', wide: [.60, .02, .90, .14], phone: [.56, .115, .90, .19], period: 6.5, scale: 1.5 },
    // The small tree left of Bruno's plinth in the wide painting, and the bigger one over the left-hand stalls in
    // the portrait. Both are painted foliage, not stall greens: the crates of chicory below them stay still.
    { kind: 'leaves', wide: [.53, .16, .62, .27], phone: [.11, .14, .33, .31], leaf: 'olive', color: '#7d9440', count: 6, size: 1.3 },
    // A second flock over the palazzi on the left of the Campo, wide only: the wide painting cannot hang the awning
    // (its hook is under the room heading at 1280 x 720), so this is its fourth loop.
    { kind: 'birds', wide: [.40, .02, .56, .10], period: 7.5, scale: 1.4 },
  ],
  // it_pasta carries no ambience patch: the window's shaft, the open copper's steam, the fire under it and the
  // hung pasta cane are its four loops in both orientations.
  it_forno: [
    // The street door onto the lane, which is the room's one cool light against the oven. Wide keeps it; the
    // portrait keeps its own narrower doorway. This is the patch the engine drops first if the heat ever grows.
    { kind: 'sunray', wide: [.02, 0, .24, .74], phone: [.10, .02, .32, .56], angles: [-.40, -.36], sway: [.090, .080] },
  ],
  it_casale: [
    // The open door onto the Agro Romano. The cold room's light is all of its warmth and it carries the wide
    // composition, where the cheese wall and the press stand in shadow.
    { kind: 'sunray', wide: [.56, 0, .86, .72], phone: [.30, 0, .70, .52], angles: [.34, .30], sway: [.110, .110] },
    // The olive beside the door, painted in both compositions.
    { kind: 'leaves', wide: [.72, .09, .82, .26], phone: [.42, .10, .56, .24], leaf: 'olive', color: '#7f9a4e', count: 8, size: 1.6 },
    // Birds over the hills, portrait only: the wide painting's fourth loop is the garlic braid on the peg, and the
    // portrait cannot hang it (the peg sits at x .900, on the edge of the slice a 390-wide phone shows), so the
    // freed loop goes here.
    { kind: 'birds', phone: [.60, .06, .86, .16], period: 6, scale: 1.6 },
  ],
  it_pescaria: [
    // The lagoon behind the slabs at first light. The Pescaria is a cold room and its whole budget is light, haze
    // and birds; nothing is drawn on the fish, the marble or the water the gondolas sit in.
    { kind: 'mist', wide: [.12, .25, .62, .34], phone: [.10, .22, .60, .29], alpha: .42 },
    { kind: 'birds', wide: [.62, .09, .88, .18], phone: [.30, .10, .62, .18], period: 6.5, scale: 1.5 },
  ],
  it_bacaro: [
    // The oil lamp burning on the shelf behind the counter, the one lit thing in the room. Boxed to its glass and
    // its halo, clear of the drinker's cap below it in both compositions.
    { kind: 'light', wide: [.530, .225, .600, .320], phone: [.490, .235, .560, .315], color: '#f3a34b' },
    // The canal door at the right. It is what makes this an osteria on the water rather than a cellar.
    { kind: 'sunray', wide: [.52, 0, .98, .74], phone: [.50, .02, .90, .60], angles: [.42, .36], sway: [.110, .110] },
  ],
  it_laguna: [
    // The green canal outside the door, wide only. The portrait spends this loop on the gull instead, and the wide
    // painting cannot fly one: its whole sky is the top-left corner, which the room heading and the Back button
    // cover at 1280 x 720 (docs/italy-rooms.md, "What the room heading covers").
    { kind: 'mist', wide: [.02, .30, .21, .46], alpha: .40 },
  ],
  // it_veneto carries no ambience patch: the hearth's glow signs the room, the polenta copper and two more vessels
  // steam, the fire burns under the copper and the garlic braid hangs on the empty S-hook.
  // it_friggitoria carries no ambience patch: the lane's sun, the lard's steam, the charcoal under the pan and the
  // awning on the stone jamb's hook.
  it_ballaro: [
    // Hard Palermo sun across the market. Ballarò is a cold room — nothing in it is cooked — so light, sky and the
    // palm carry it beside the thrown water.
    { kind: 'sunray', wide: [.40, 0, .84, .60], phone: [.22, 0, .86, .56], angles: [.38, .34], sway: [.095, .110] },
    { kind: 'birds', wide: [.62, .04, .86, .14], phone: [.30, .05, .62, .14], period: 6, scale: 1.6 },
    // The palm over the far stalls, portrait only: the wide composition's fourth loop is the awning on the cane
    // frame's hook, and the portrait hook sits under the room heading, so the portrait hangs nothing.
    { kind: 'leaves', phone: [.60, .06, .82, .26], leaf: 'olive', color: '#6e8c3f', count: 8, size: 1.6 },
  ],
  it_pasticceria: [
    // The oil lamp on the shelf. The pasticceria has **no steam anywhere** — ricotta, almond, candied fruit and ice
    // are all cold — so its three supporting loops are the lamp, the bay and the hung lamp sprite.
    { kind: 'light', wide: [.075, .115, .115, .175], phone: [.085, .105, .135, .165], color: '#f3a34b' },
    { kind: 'birds', wide: [.80, .13, .94, .22], phone: [.72, .13, .90, .21], period: 6, scale: 1.6 },
  ],
  it_tonnara: [
    // The coast's own light. The tonnara has three boiling coppers and no pictured flame at all — they are set in
    // masonry and fired from behind — so the room takes no fire ellipse and spends that loop on the sun.
    { kind: 'sunray', wide: [.55, 0, .90, .58], phone: [.52, .02, .88, .42], angles: [.40, .36], sway: [.095, .085] },
  ],
};

/**
 * Sprites hung over the paintings, per room and orientation. Each is a delivered `it-<name>` sprite laid over the
 * empty hook, peg, chain, ring or cane the painting was generated with, so nothing is cut out of a finished picture
 * and no wall has to be repaired behind it. `fx` and `fy` are the sprite's top-left corner and `fw` its width, all
 * as fractions of that orientation's painting, measured on its own pixels; the sprite pivots at its top centre,
 * where its own loop, twine or S-hook meets the painted fitting.
 *
 * Eight orientations that have a painted fitting hang nothing from it, and every one of them is recorded in
 * docs/italy-rooms.md with the pixels:
 *   - `it_trattoria` wide and `it_market` wide: the hook is under the room heading at 1280 x 720, and the sprite
 *     hung from it ran behind the title's own letters
 *   - `it_casale` portrait: the peg is at x .900, and the slice a 390-wide viewport shows ends at x .906
 *   - `it_ballaro` portrait: the hook's bend is at y .098 and the one-line room heading runs y .081 to .107
 *   - `it_pescaria` wide, `it_laguna` wide: the hook stands inside the block the room heading and the Back button
 *     cover at 1280 x 720 (x .013 to .231, y .094 to .186), and in both rooms the assigned sprite is a gull, which
 *     flies rather than hangs
 *   - `it_forno` wide and portrait: the room contract gives the forno no sprite; its painted hook stays empty
 * `it-gull` never hangs from anything. It is placed in clean painted sky, as Thailand's egret is.
 */
export const ITALY_HUNG: Record<string, { wide?: HungSprite[]; phone?: HungSprite[] }> = {
  it_trattoria: {
    // The iron hook driven into the lime wash: the bottom of its J at (.424, .078) in portrait, where the salumi
    // hangs from it on its own twine and only the twine and the shoulder pass behind the one-line heading. Portrait
    // only: the wide hook is at (.136, .100), and a salumi hung from it at 1280 x 720 ran behind the end of the
    // title "The trattoria" (glyphs x 28 to 208, y 97 to 138 on screen) from y 97 to 138.
    phone: [{ name: 'it-salumi', fx: .3825, fy: .062, fw: .085, sway: 2.6, tone: .90 }],
  },
  it_market: {
    // The empty S-hook on the stall rail, against the plain canvas: the bend of the J is at (.342, .102) in
    // portrait, and a scrap of striped awning hangs from it. Portrait only: the wide hook's bend is at (.132, .127),
    // and an awning hung from it at 1280 x 720 sat squarely behind both lines of the title. In portrait the awning's
    // top 12 px pass behind the heading's name and its lower-left corner behind the story button; the rest swings
    // in the clear. This is the weakest sprite placement in the world and is recorded as such in docs/italy-rooms.md.
    phone: [{ name: 'it-awning', fx: .252, fy: .102, fw: .180, sway: 3.2, tone: .94 }],
  },
  it_pasta: {
    // The bare cane between its two iron brackets: it runs from (.47, .045) to (.73, .050) in wide, brackets at
    // .497 and .703, and from (.43, .150) to (.83, .156) in portrait, brackets at .465 and .790, with nothing on it. The sprite is the cane with its nests already
    // over it, so its own cane sits on the painted one.
    wide: [{ name: 'it-pasta-cane', fx: .510, fy: .047, fw: .180, sway: 1.8, tone: .96 }],
    phone: [{ name: 'it-pasta-cane', fx: .520, fy: .150, fw: .250, sway: 1.8, tone: .96 }],
  },
  it_casale: {
    // The wooden peg in the lime wash beside the press: its knob is at (.852, .092) and it protrudes to (.861, .097).
    // Wide only. The portrait's peg is at x .893 to .905 — its tip is at .900, and a braid wide enough to read from
    // it would cross x .906, the right edge of the slice a 390-wide viewport shows, so the portrait leaves it empty
    // and spends the loop on the birds over the hills.
    wide: [{ name: 'it-garlic-braid', fx: .838, fy: .095, fw: .036, sway: 2.8, tone: .92 }],
  },
  it_pescaria: {
    // No hook: the gull flies. The painted hook on the cast-iron column (x .219 to .232, bend at y .115) sits inside
    // the block the room heading covers at 1280 x 720 and stays empty. The bird crosses the clean grey band over the
    // lagoon, clear of the Salute's domes in both compositions.
    wide: [{ name: 'it-gull', fx: .530, fy: .085, fw: .070, sway: 3.0, tone: .97 }],
    phone: [{ name: 'it-gull', fx: .550, fy: .125, fw: .120, sway: 3.0, tone: .97 }],
  },
  it_bacaro: {
    // The brass chain and ring hanging from the ceiling over a clear part of the counter: the ring's lower arc is at
    // (.500, .093) in wide and (.4975, .086) in portrait. The lamp arrives unlit and with its own short chain, so it
    // hangs from the ring and stays unlit in a room the painting lights with one oil lamp.
    wide: [{ name: 'it-lamp', fx: .475, fy: .091, fw: .050, sway: 2.2, tone: .88 }],
    phone: [{ name: 'it-lamp', fx: .455, fy: .084, fw: .085, sway: 2.2, tone: .88 }],
  },
  it_laguna: {
    // Portrait only, and not on the painted hook: the empty iron hook on the grey render is at (.598, .195), and the
    // room's sprite is a gull. It glides over the canal inside the open door, in front of the Burano house fronts.
    // The wide painting has no sky a bird can cross that the room heading does not cover, so it flies in the
    // portrait alone and the wide loop goes to the haze on the canal.
    phone: [{ name: 'it-gull', fx: .130, fy: .178, fw: .110, sway: 3.0, tone: .96 }],
  },
  it_veneto: {
    // The second bare chain beside the pot's, with an empty S-hook on its end: (.584, .110) in wide and
    // (.463, .150) in portrait, both against plain smoke-darkened stone. The salami on the beam at the right of the
    // wide painting is painted and stays still; this braid is the only thing in the room that moves on a chain.
    wide: [{ name: 'it-garlic-braid', fx: .5665, fy: .110, fw: .035, sway: 2.8, tone: .86 }],
    phone: [{ name: 'it-garlic-braid', fx: .428, fy: .150, fw: .070, sway: 2.8, tone: .86 }],
  },
  it_friggitoria: {
    // The empty iron hook on the bare stone jamb: the bend is at (.4955, .115) in wide and (.710, .132) in portrait.
    // A strip of striped awning hangs from it over the lane in both compositions.
    wide: [{ name: 'it-awning', fx: .4355, fy: .112, fw: .120, sway: 3.4, tone: .95 }],
    phone: [{ name: 'it-awning', fx: .620, fy: .132, fw: .180, sway: 3.4, tone: .95 }],
  },
  it_ballaro: {
    // The empty hook on the awning's cane frame, against plain sky: (.5395, .118) in wide. Wide only — the portrait
    // hook's bend is at (.503, .098) and the one-line room heading at 390 x 844 runs from y .081 to y .107 across
    // x .127 to .706, so a portrait awning would hang out of the heading's own text. That orientation keeps the palm.
    wide: [{ name: 'it-awning', fx: .4595, fy: .118, fw: .160, sway: 3.4, tone: .95 }],
  },
  it_pasticceria: {
    // The empty brass chain and ring from the ceiling: the ring's lower arc is at (.505, .092) in wide and
    // (.495, .086) in portrait, both over the dark shelf wall behind the counter. Unlit, like the painted room.
    wide: [{ name: 'it-lamp', fx: .480, fy: .090, fw: .050, sway: 2.2, tone: .90 }],
    phone: [{ name: 'it-lamp', fx: .4525, fy: .084, fw: .085, sway: 2.2, tone: .90 }],
  },
  it_tonnara: {
    // No hook: the gull flies. The empty iron hook in the arch (wide (.552, .050), portrait (.500, .095)) stays
    // empty, as the whitewashed pier was painted with it. The bird crosses the clean blue over the sea in wide and
    // the sky inside the arch in portrait, clear of the mast and the rigging.
    wide: [{ name: 'it-gull', fx: .620, fy: .040, fw: .070, sway: 3.0, tone: .98 }],
    phone: [{ name: 'it-gull', fx: .400, fy: .130, fw: .140, sway: 3.0, tone: .98 }],
  },
};
