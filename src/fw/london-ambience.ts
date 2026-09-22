/** Always-on painting motion per Britain room, per orientation, and the sprites hung over the paintings.
 *  Owned by the Room maker. Every box, path and sprite fraction below was measured on the delivered file at that
 *  orientation — `public/scenes/uk_<id>/wide.jpg` (1672 x 941) or `portrait.jpg` (941 x 1672) — never converted from
 *  the other one. The reasoning per room is in docs/london-rooms.md.
 *
 *  Britain ships **no `breeze` crop**, and it never needed one. The image brief asked every painting for an empty
 *  hook, bracket, chain end, nail, peg or rail against a plain wall or sky, and for the hanging object to arrive as
 *  a separate keyed sprite, so every room with hanging motion hangs a delivered `uk-<name>` sprite over a painting
 *  that already has clean brick, plaster, timber, canvas or sky behind it. That is the standard Spain ended on
 *  (docs/spain-rooms.md, "Sprites") and Thailand and Vietnam kept.
 *
 *  The engine's `choose` in scene-painted.ts keeps `3 - heat - flyers` ambience patches, so a room that steams and
 *  burns keeps one patch, and a hung sprite swings on its own timer on top of that. Several rooms below therefore
 *  carry no ambience list at all, or a list whose entry is bound to one orientation: their four always-on loops are
 *  the signature, the steam, the fire and the sprite. The order inside each list runs from the cue that matters
 *  most to the one the engine may drop.
 */
import type { AmbientPatch } from './scene-ambience';
import type { HungSprite } from './scene-painted';

export const LONDON_AMBIENCE: Record<string, AmbientPatch[]> = {
  uk_pub: [
    // The lit gas globe on the bar back, portrait only. A phone shows only x .094 to .906 of the portrait painting
    // and the coal grate runs from the left edge to x .122, so the room's `light` signature keeps only the grate's
    // right-hand edge there; this globe is the lamp a phone actually sees burning. In wide the room's four loops
    // are already the hearth, the joint and the gravy copper, and the two hung sprites, so the globe has no wide
    // box: it would be a fifth.
    { kind: 'light', phone: [.176, .036, .240, .064], color: '#ffc47a' },
  ],
  uk_tearoom: [
    // Rain on the plate glass the tea room looks out of, which is what the image brief asked this window for and
    // what both paintings draw: a wet street, an omnibus and a pair of gas standards behind the glass. The wide box
    // is the clear upper half of the right-hand sash, above the omnibus and clear of both mullions; the phone box
    // is the same window recomposed, pulled in to end at x .900 so it stays inside the band a phone shows.
    { kind: 'rain', wide: [.780, .018, .982, .330], phone: [.720, .035, .902, .300], color: '#e8f1ef' },
  ],
  uk_market: [
    // The market's own gaslight under the iron roof. The wide hall keeps two lamps and the portrait one, because
    // the portrait's second lamp is behind the cheesemonger's shoulder.
    { kind: 'light', wide: [.766, .072, .822, .136], phone: [.676, .064, .744, .130], color: '#ffc47a' },
    // The haze down the far aisle at first light, with the locomotive's smoke drifting off the viaduct into it.
    // Kept low: this is an iron hall in the early morning, not a valley.
    { kind: 'mist', wide: [.530, .075, .835, .300], phone: [.215, .095, .655, .310], alpha: .58 },
    // A second lit lamp over the middle of the aisle, wide only. The wide painting has the loop free, because its
    // empty S-hook carries nothing (see LONDON_HUNG): the hook sits behind the room heading at desktop size.
    { kind: 'light', wide: [.524, .110, .578, .172], color: '#ffc47a' },
  ],
  uk_piemash: [
    // Rain on the glazed door onto the wet dock street, in the clear column of glass above the handle rail and
    // below the head rail, so the clip keeps every streak off the stiles and off the men walking past outside.
    { kind: 'rain', wide: [.612, .035, .643, .240], phone: [.735, .045, .900, .245], color: '#e8f1ef' },
    // The shop's hanging gas globe over the counter.
    { kind: 'light', wide: [.416, .092, .454, .138], phone: [.445, .026, .532, .074], color: '#ffc47a' },
  ],
  uk_chippy: [
    // Rain on the shop window, which is the whole reason the queue is indoors. Wide: the upper light of the
    // right-hand sash, above the shelf of plates and clear of the two hanging lamps. Phone: the same window
    // recomposed, pulled in past x .094 so the box is inside the band a phone shows.
    { kind: 'rain', wide: [.532, .030, .628, .215], phone: [.105, .022, .430, .190], color: '#e8f1ef' },
  ],
  uk_breakfast: [
    // The naphtha flare the stall works under. This is the one night painting in the area and the flare is the
    // largest thing it does; the coals under the griddle are pictured in the portrait and carry no ellipse,
    // because the room's four loops — the tap's pour, two plumes, the flare and the gull — are already full.
    { kind: 'light', wide: [.538, .010, .594, .072], phone: [.104, .046, .194, .128], color: '#ffc47a' },
  ],
  // uk_lascar carries no ambience patch: the spice fall, the curry and rice plumes, the fire under the copper and
  // the hung brass lamp are its four loops in both orientations.
  // uk_hopkitchen carries no ambience patch: the ladle's pour, the cauldron's plume, the open fire and the hung
  // hop bine are its four loops in both orientations.
  uk_dairy: [
    // The cold room, and the only room in the area with no heat of any kind, so it spends all three patch slots.
    // The daylight coming in at the open door and down across the flags, which is where the painting's light
    // comes from. The wide box is the dim stone interior the beam crosses, not the doorway itself: a beam over the
    // sunlit meadow is light on light and barely registers, which the first capture showed.
    { kind: 'sunray', wide: [.480, .060, .930, .960], phone: [.096, 0, .440, .520], angles: [.40, .30], sway: [.098, .092] },
    // The morning air over the pasture and the scar beyond the door. This patch replaced a pair of gulls on
    // 2026-09-22: with the beam, the birds and the tree the wide painting measured 2.1 to 2.5 per cent against its
    // floor, because two silhouettes and eight leaves are a rounding error in a changed-pixel count and the beam
    // stalls twice in every drift cycle. Haze over a Dales pasture at milking time is the largest thing the
    // doorway actually does, and it never stops moving.
    { kind: 'mist', wide: [.660, .120, .878, .420], phone: [.098, .140, .352, .400], alpha: .52 },
    // The tree beside the door, wide only: the portrait crops it to a sliver at the left edge of the phone band.
    // Green and narrow on purpose. The default painted leaves are the hotpot room's red autumn cut-outs, and the
    // live look on 2026-09-22 showed them as red flakes over a green summer pasture, so this is the procedural
    // leaf in the tree's own green.
    { kind: 'leaves', wide: [.655, .100, .818, .345], leaf: 'olive', color: '#5f7f3b', count: 8, size: 2.0 },
    // Whey off the draining rack, portrait only, and the room's second cold liquid. The curd sits on slats over a
    // bench and the whey runs off the slats in separate threads; they fade out on the bench, which the painting
    // does not open, so the portrait takes no splash ring here. The press spout's own thread is the signature.
    { kind: 'drip', phone: [.640, .750, .880, .815], color: '#f2eddc', period: 1.2, splash: [false, false],
      paths: [undefined, [[[.10, 0], [.10, 1]], [[.33, 0], [.33, 1]], [[.53, 0], [.53, 1]], [[.77, 0], [.77, 1]]]] },
  ],
  uk_pasty: [
    // Gulls over the cove in the open doorway, which is the clean sky band the brief reserved in both compositions.
    // Both boxes keep clear of the room heading, which covers painting x .022 to .281, y .094 to .249 of the wide
    // painting at 1280 x 720 and y .079 to .173 across the whole portrait at 390 x 844 (measured live): the wide
    // gulls fly in the strip of sky above it, the portrait ones in the sky below it and above the headland.
    { kind: 'birds', wide: [.050, .028, .200, .090], phone: [.170, .176, .320, .232], period: 4.8, scale: 1.8 },
  ],
  // uk_cockles carries no ambience patch: the sand through the riddle, the copper's plume, its driftwood fire and
  // the hung gull are its four loops in both orientations.
  // uk_smokehouse carries no ambience patch: the sparks off the pit, the pit's smoke and the table's fish, and two
  // hung sprites — the speet of tied pairs and the gull.
  uk_distillery: [
    // The shaft from the high window across the malting floor, which is the direction both paintings are lit from:
    // in over the stone sill and down onto the green malt. The wide beam leans down to the right out of a window at
    // the left; the portrait's window is at the right and its beam leans the other way.
    { kind: 'sunray', wide: [.100, 0, .400, .540], phone: [.545, 0, .900, .480], angles: [.40, -.36], sway: [.095, .095] },
  ],
};

/**
 * Sprites hung over the paintings, per room and orientation. The three portrait gulls fly below the portrait room
 * heading (painting y .079 to .173 at 390 x 844, measured live on 2026-09-22), not in the sky above it, because the
 * heading runs the whole width of a phone. Painted fittings cannot move: the pub's beam nail, the tea room's chain,
 * the hop line, the market post and the smokehouse cross-bar sit at portrait y .04 to .09, so their sprites start
 * at the heading's top edge and hang down past it; each one reads to the right of, or below, the title text.
 * Each is a delivered `uk-<name>` sprite laid over the
 * empty hook, bracket, chain end, cross-bar or peg the painting was generated with, so nothing is cut out of a
 * finished picture and no wall has to be repaired behind it. `fx` and `fy` are the sprite's top-left corner and
 * `fw` its width, all as fractions of that orientation's painting, measured on its own pixels; the sprite pivots at
 * its top centre, where its own eye, loop, chain ring or cord meets the painted fitting.
 *
 * Two fittings the room contract lists a sprite for carry none:
 *  - `uk_pub` portrait, whose street bracket's eye is at x .923, past the right edge of the slice a 390-wide
 *    viewport shows, so a sign wide enough to read would be cut in half on a phone;
 *  - `uk_market` wide, whose S-hook is at (.259, .158) — squarely inside the rectangle the room heading covers at
 *    desktop size (painting x .022 to .334, y .094 to .261 at 1280 x 720), which is the case docs/vietnam-rooms.md
 *    recorded for the phở room's peg. A brace hung there is completely behind the title.
 * Both rooms spend the freed loop on a patch instead, and five more painted fittings stay empty by the contract:
 * the pie shop's brass counter hook, the chippy's iron hook, the dairy's wooden peg, the pasty bakehouse's iron
 * hook, the distillery's wall hook and the coffee stall's canopy hook.
 */
export const LONDON_HUNG: Record<string, { wide?: HungSprite[]; phone?: HungSprite[] }> = {
  uk_pub: {
    // Two fittings in the wide painting. The wrought-iron street bracket runs out of the brick over the open door
    // and its scrolled eye is at (.720, .092), against the wet street; the sign hangs from it in front of the gas
    // standard further down the pavement, which is where a pub sign hangs. The plain iron J-nail under the bar beam
    // is at (.5265, .064), on dark timber, and carries the hop bine that every bar of the period hung over it.
    // In portrait only the beam nail is inside the phone band; the street bracket's eye is at x .923.
    wide: [{ name: 'uk-pub-sign', fx: .697, fy: .092, fw: .046, sway: 3.4, tone: .92 },
      { name: 'uk-hop-bine', fx: .499, fy: .064, fw: .055, sway: 5.2, tone: .90 }],
    phone: [{ name: 'uk-hop-bine', fx: .523, fy: .0375, fw: .110, sway: 4.2, tone: .90 }],
  },
  uk_tearoom: {
    // The brass ceiling chain over the tea room, ending in an empty ring: (.5815, .092) in wide, (.557, .050) in
    // portrait. The lamp arrives with its own chain and ring, so it hangs on the painted ring without anything
    // being added to the picture, and it is unlit in the sprite, as the tea room's own gas is.
    wide: [{ name: 'uk-hanging-lamp', fx: .5490, fy: .086, fw: .065, sway: 5.2, tone: .94 }],
    phone: [{ name: 'uk-hanging-lamp', fx: .5045, fy: .046, fw: .105, sway: 5.2, tone: .94 }],
  },
  uk_market: {
    // The empty S-hook on the stall post, its belly at (.838, .092) in portrait, over plain timber and well inside
    // the phone band. **No wide sprite**: the wide painting's hook is at (.259, .158), behind the room heading.
    phone: [{ name: 'uk-game-brace', fx: .7955, fy: .092, fw: .085, sway: 3.0, tone: .92 }],
  },
  uk_breakfast: {
    // No hook: the gull flies. The brief asked for a clean band of night sky over the market roof for exactly this,
    // and the bird is placed inside it in both compositions. The stall's own empty canopy hook stays empty.
    wide: [{ name: 'uk-gull', fx: .425, fy: .020, fw: .080, sway: 3.2, tone: .88 }],
    phone: [{ name: 'uk-gull', fx: .340, fy: .178, fw: .140, sway: 3.2, tone: .88 }],
  },
  uk_lascar: {
    // The empty chain and S-hook over the range end: the chain drops from the joist and its hook's belly is at
    // (.628, .202) in wide and (.775, .110) in portrait, both on plain lime wash.
    wide: [{ name: 'uk-hanging-lamp', fx: .6055, fy: .200, fw: .045, sway: 2.8, tone: .90 }],
    phone: [{ name: 'uk-hanging-lamp', fx: .7325, fy: .108, fw: .085, sway: 2.8, tone: .90 }],
  },
  uk_hopkitchen: {
    // The empty wire line strung between two poles over the bin, with plain grey sky behind it: it crosses x .600
    // at y .040 in wide and x .400 at y .065 in portrait. A cut bine hung on the line is what a hop garden looks
    // like when the pickers stop for dinner.
    wide: [{ name: 'uk-hop-bine', fx: .5675, fy: .040, fw: .065, sway: 4.6, tone: .94 }],
    phone: [{ name: 'uk-hop-bine', fx: .335, fy: .065, fw: .130, sway: 4.6, tone: .94 }],
  },
  uk_cockles: {
    // No hook: the gull flies over the sands in both compositions, in the clean sky the brief reserved. The stall
    // upright's empty peg stays empty — in portrait it sits at about x .925, outside the phone band anyway.
    wide: [{ name: 'uk-gull', fx: .592, fy: .015, fw: .095, sway: 5.4, tone: .94 }],
    phone: [{ name: 'uk-gull', fx: .765, fy: .180, fw: .120, sway: 4.4, tone: .94 }],
  },
  uk_smokehouse: {
    // Two sprites. The bare upper cross-bar of the right-hand frame is empty in both compositions — (.830, .100) in
    // wide, (.780, .070) in portrait — and takes a second speet of tied pairs above the painted rail of fish; and
    // the gull crosses the grey sky over the harbour. The wide speet is hung small so it stops clear of the painted
    // fish on the rail below at y .18.
    wide: [{ name: 'uk-smoke-speet', fx: .780, fy: .100, fw: .055, sway: 2.6, tone: .96 },
      { name: 'uk-gull', fx: .600, fy: .015, fw: .075, sway: 3.2, tone: .94 }],
    phone: [{ name: 'uk-smoke-speet', fx: .730, fy: .070, fw: .100, sway: 2.6, tone: .96 },
      { name: 'uk-gull', fx: .725, fy: .176, fw: .115, sway: 3.2, tone: .94 }],
  },
};
