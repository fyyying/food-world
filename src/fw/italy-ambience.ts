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
    // loop on the daylight the room is lit by. The portrait hangs nothing since 2026-09-23 (the salumi on its hook
    // at (.424, .078) hung down across the oste's face) and runs on the pour, the steam and the firebox.
    { kind: 'sunray', wide: [.56, 0, .90, .70], angles: [.36, .32], sway: [.095, .085] },
  ],
  it_market: [
    // The clean sky over the house fronts on the far side of the Campo. The market is the brightest room in Rome's
    // cluster and its only real openings are the sky and the young tree beside the statue base.
    { kind: 'birds', wide: [.60, .02, .90, .14], phone: [.56, .115, .90, .19], period: 6.5, scale: 1.5 },
    // The small tree left of Bruno's plinth in the wide painting, and the bigger one over the left-hand stalls in
    // the portrait. Both are painted foliage, not stall greens: the crates of chicory below them stay still. The
    // portrait box was cut on 2026-09-23 to the canopy itself (x .10 to .30, from just under the story button,
    // which ends at y .169, to the stall roofs at .235): it had run down to y .31, over the headscarf of the woman
    // at the counter. The wide box stops at x .605, short of the statue's plinth.
    { kind: 'leaves', wide: [.53, .16, .605, .27], phone: [.10, .17, .30, .235], leaf: 'olive', color: '#7d9440', count: 6, size: 1.3 },
    // A second flock over the palazzi on the left of the Campo, wide only: the wide painting cannot hang the awning
    // (its hook is under the room heading at 1280 x 720), so this is its fourth loop.
    { kind: 'birds', wide: [.40, .02, .56, .10], period: 7.5, scale: 1.4 },
  ],
  // it_pasta carries no ambience patch: the window's shaft, the open copper's steam, the fire under it and the
  // hung pasta cane are its four loops in both orientations.
  // it_market's portrait hangs nothing since 2026-09-23: the awning on the stall rail's S-hook hung inside the
  // heading block and over the story button, so the portrait runs on the sun, the flock and the tree.
  it_forno: [
    // The street door onto the lane, which is the room's one cool light against the oven. Wide keeps it; the
    // portrait keeps its own narrower doorway. This is the patch the engine drops first if the heat ever grows.
    { kind: 'sunray', wide: [.02, 0, .24, .74], phone: [.10, .02, .32, .56], angles: [-.40, -.36], sway: [.090, .080] },
  ],
  it_casale: [
    // The open door onto the Agro Romano. The cold room's light is all of its warmth and it carries the wide
    // composition, where the cheese wall and the press stand in shadow.
    // Wide drift .15 since 2026-09-23 (was .11): the wide room measured a 2.45 percent median in the Stage E review,
    // and the beam's drift is the only one of its three cues large enough to carry it; the whey and the olive
    // leaves are small by nature and stay so.
    { kind: 'sunray', wide: [.56, 0, .86, .72], phone: [.30, 0, .70, .52], angles: [.34, .30], sway: [.150, .110] },
    // The olive outside the door, painted in both compositions. Re-boxed on 2026-09-23 to the canopy inside the
    // door opening: wide x .70 to .805 (the right jamb starts at .81), y .065 to .235; portrait x .70 to .795 (the
    // right jamb starts at .80), y .085 to .20. The portrait box had sat on the wooden door at x .42 to .56 and
    // the wide one had run over the right jamb.
    { kind: 'leaves', wide: [.70, .065, .805, .235], phone: [.70, .085, .795, .20], leaf: 'olive', color: '#7f9a4e', count: 8, size: 1.6 },
    // Birds over the hills, portrait only: the wide painting's fourth loop is the garlic braid on the peg, and the
    // portrait cannot hang it (the peg sits at x .900, on the edge of the slice a 390-wide phone shows), so the
    // freed loop goes here. Boxed to the sky inside the door opening (x .60 to .795, y .065 to .115), not the
    // plaster right of the jamb it had run over.
    { kind: 'birds', phone: [.60, .065, .795, .115], period: 6, scale: 1.6 },
  ],
  it_pescaria: [
    // The lagoon behind the slabs at first light. The Pescaria is a cold room and its whole budget is light, haze
    // and birds; nothing is drawn on the fish or the marble. Re-boxed on 2026-09-23 to the water and the far quay
    // only, because the old band (wide y .25 to .34 across x .12 to .62) lay over the fishmonger's head and the
    // man behind him. Wide: the gap between the old man's cap (right edge x .515) and the girl's headscarf (left
    // edge x .59), from the far quay at y .14 down to the water at .34. Portrait: the far quay and the strip of
    // water above the heads, x .48 (right of the fishmonger's cap) to .655, y .19 to .285 (the old man's cap
    // starts at .29).
    // Alpha stays at .42: at .55 the narrow wide box read as a pale column between the old man and the girl, and
    // it added nothing measurable (the drift of the canopy's light carries the room). Birds a little larger and
    // more frequent, since the haze now covers a third of the old band's area.
    { kind: 'mist', wide: [.525, .14, .585, .34], phone: [.48, .19, .655, .285], alpha: .42 },
    // The portrait flock starts at x .35 since 2026-09-23, clear of the story button (x .127 to .342).
    { kind: 'birds', wide: [.62, .09, .88, .18], phone: [.35, .10, .62, .18], period: 6, scale: 1.6 },
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
    // cover at 1280 x 720 (docs/italy-rooms.md, "What the room heading covers"). Trimmed on 2026-09-23 to
    // x .03 to .185, between the dark door jamb and the boy's cap (which starts at x .19, y .34).
    { kind: 'mist', wide: [.03, .30, .185, .46], alpha: .40 },
  ],
  // it_veneto carries no ambience patch: the hearth's glow signs the room, the polenta copper and two more vessels
  // steam, the fire burns under the copper and the garlic braid hangs on the empty S-hook.
  // it_friggitoria carries no ambience patch: the lane's sun, the lard's steam and the charcoal under the pan,
  // with the lard's surface moving in its pan. The awning scrap on the stone jamb's hook came out on 2026-09-23:
  // hung from a single hook it read as a flag in mid-air under the canvas, in both compositions.
  it_ballaro: [
    // Hard Palermo sun across the market. Ballarò is a cold room — nothing in it is cooked — so light, sky and the
    // palm carry it beside the thrown water.
    { kind: 'sunray', wide: [.40, 0, .84, .60], phone: [.22, 0, .86, .56], angles: [.38, .34], sway: [.095, .110] },
    // The portrait flock crosses the sky above the cathedral's dome, x .52 to .76, y .005 to .07, since
    // 2026-09-23: at [.30, .05, .62, .14] it flew behind the room's name (y .076 to .111 at 390 x 844).
    { kind: 'birds', wide: [.62, .04, .86, .14], phone: [.52, .005, .76, .07], period: 6, scale: 1.6 },
    // The palm over the far stalls, in both compositions since 2026-09-23. Boxed to the palm's own crown: wide
    // x .70 to .80, y .03 to .19 (the girl's headscarf starts at .20); portrait x .76 to .90, y .04 to .19. The
    // portrait box had run over the cathedral dome at x .60 to .72, and the wide awning it replaces hung on a chain
    // in open sky.
    { kind: 'leaves', wide: [.70, .03, .80, .19], phone: [.76, .04, .90, .19], leaf: 'olive', color: '#6e8c3f', count: 8, size: 1.6 },
  ],
  it_pasticceria: [
    // The oil lamp on the shelf. The pasticceria has **no steam anywhere** — ricotta, almond, candied fruit and ice
    // are all cold — so its supporting loops are the lamp, the bay and, wide only, the hung lamp sprite.
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
 * Fifteen orientations that have a painted fitting hang nothing from it, and every one of them is recorded in
 * docs/italy-rooms.md with the pixels:
 *   - `it_trattoria` wide and `it_market` wide: the hook is under the room heading at 1280 x 720, and the sprite
 *     hung from it ran behind the title's own letters
 *   - taken out after the second-reviewer walkthrough of 2026-09-23: `it_trattoria` portrait (the salumi hung
 *     across the oste's face), `it_market` portrait, `it_bacaro` portrait and `it_pasticceria` portrait (the
 *     awning and the lamps' chains hung inside the heading block, x .127 to .764, y .076 to .173 at 390 x 844),
 *     `it_friggitoria` wide and portrait and `it_ballaro` wide (an awning scrap on one hook, or on a chain, reads
 *     as a flag in the sky; the friggitoria's canvas beam could carry it, but a valance swings there as one rigid
 *     board about its centre, and in portrait the beam is inside the heading block)
 *   - `it_casale` portrait: the peg is at x .900, and the slice a 390-wide viewport shows ends at x .906
 *   - `it_ballaro` portrait: the hook's bend is at y .098 and the one-line room heading runs y .081 to .107
 *   - `it_pescaria` wide, `it_laguna` wide: the hook stands inside the block the room heading and the Back button
 *     cover at 1280 x 720 (x .013 to .231, y .094 to .186), and in both rooms the assigned sprite is a gull, which
 *     flies rather than hangs
 *   - `it_forno` wide and portrait: the room contract gives the forno no sprite; its painted hook stays empty
 * `it-gull` never hangs from anything. It is placed in clean painted sky, as Thailand's egret is.
 */
export const ITALY_HUNG: Record<string, { wide?: HungSprite[]; phone?: HungSprite[] }> = {
  it_pasta: {
    // The bare cane between its two iron brackets: it runs from (.47, .045) to (.73, .050) in wide, brackets at
    // .497 and .703, and from (.43, .150) to (.83, .156) in portrait, brackets at .465 and .790, with nothing on it. The sprite is the cane with its nests already
    // over it, so its own cane sits on the painted one.
    // Wide since 2026-09-23: the nests hang on the left half of the cane only, x .50 to .61 down to y .117, so
    // they end well above and left of the ribbons the woman lifts (x .60 to .70, from y .24). At x .51 to .69 and
    // down to .16 the two read as one strand from the rail to her hands.
    wide: [{ name: 'it-pasta-cane', fx: .500, fy: .047, fw: .110, sway: 1.8, tone: .96 }],
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
    // Wide only since 2026-09-23: the portrait ring at (.4975, .086) is inside the block the room heading and the
    // story button cover at 390 x 844 (x .127 to .764, y .076 to .173), and the lamp's chain crossed the heading.
    wide: [{ name: 'it-lamp', fx: .475, fy: .091, fw: .050, sway: 2.2, tone: .88 }],
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
  it_pasticceria: {
    // The empty brass chain and ring from the ceiling: the ring's lower arc is at (.505, .092) in wide and
    // (.495, .086) in portrait, both over the dark shelf wall behind the counter. Unlit, like the painted room.
    // Wide only since 2026-09-23, for the osteria's reason: the portrait ring is under the heading block.
    wide: [{ name: 'it-lamp', fx: .480, fy: .090, fw: .050, sway: 2.2, tone: .90 }],
  },
  it_tonnara: {
    // No hook: the gull flies. The empty iron hook in the arch (wide (.552, .050), portrait (.500, .095)) stays
    // empty, as the whitewashed pier was painted with it. The bird crosses the clean blue over the sea in wide and
    // the sky inside the arch in portrait, clear of the mast and the rigging.
    wide: [{ name: 'it-gull', fx: .620, fy: .040, fw: .070, sway: 3.0, tone: .98 }],
    phone: [{ name: 'it-gull', fx: .400, fy: .130, fw: .140, sway: 3.0, tone: .98 }],
  },
};
