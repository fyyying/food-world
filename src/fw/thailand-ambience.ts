/** Always-on painting motion per Thailand room, per orientation, and the sprites hung over the paintings.
 *  Owned by the Room maker. Every box, path and sprite fraction below was measured on the delivered file at that
 *  orientation — `public/scenes/th_<id>/wide.jpg` (1672 x 941) or `portrait.jpg` (941 x 1672) — never converted from
 *  the other one. The reasoning per room is in docs/thailand-rooms.md.
 *
 *  Thailand ships **no `breeze` crop**. It never needed one: the image brief asked every painting for an empty
 *  hook, pole, rail, line or nail and for the hanging object to arrive as a separate keyed sprite, so every room
 *  that has hanging motion hangs a delivered `th-<name>` sprite over a painting that already has clean wall, plank, sky
 *  or paddy behind it. That is the standard the Spain pass ended on (docs/spain-rooms.md, "Sprites"), reached here
 *  by the pictures rather than by a paint-out.
 *
 *  The engine's `choose` in scene-painted.ts keeps `3 - heat - flyers` ambience patches, so a room that steams and
 *  burns keeps one patch, and a hung sprite swings on its own timer on top of that. Several rooms below therefore
 *  carry no ambience list at all, or a list whose only entry is bound to one orientation: their four always-on
 *  loops are the signature, the steam, the fire and the sprite. The order inside each list runs from the cue that
 *  matters most to the one the engine may drop.
 */
import type { AmbientPatch } from './scene-ambience';
import type { HungSprite } from './scene-painted';

export const THAILAND_AMBIENCE: Record<string, AmbientPatch[]> = {
  // th_khlong carries no ambience patch in either orientation: the signature glint on the coconut water, the
  // brazier's steam and two hung sprites — the woven pla tapian mobile and the egret — already fill the ceiling.
  th_noodleboat: [
    // The canal itself. Green light off brown water is what the brief asked the painter for, and the wide painting
    // leaves the far half of the canal open behind the boat; the portrait opens the same water above the cook's
    // shoulder. Nothing is drawn on the boats or on the water the eaters sit over.
    { kind: 'mist', wide: [.62, .330, 1, .545], phone: [.28, .215, .52, .305], alpha: .40 },
  ],
  th_wang: [
    // Frangipani, in the portrait only. The wide painting's four loops are the doorway beam, the massaman steam,
    // the stove fire and the hung pla tapian, so a patch with a `wide` box would be a fifth; the portrait has no
    // pictured fire inside the band a phone shows (the girl's charcoal stove sits at x .06, left of x .094), which
    // frees the slot the petals take. The tree is painted in both compositions and stands still in the wide one.
    { kind: 'leaves', phone: [.28, .02, .70, .26], leaf: 'blossom', color: '#f6efd9', count: 6, size: 1.3 },
  ],
  // th_curry carries no ambience patch: the yard beam, the frying cream's steam, the clay stove's fire and the hung
  // garlic string are its four loops in both orientations.
  th_sweets: [
    // The open door onto the lane at Kudi Chin, which the brief names as this room's cue (f), and the river sky
    // beyond it. The wide painting keeps only the beam (it has a fire under the syrup pan as well as steam); the
    // portrait shows no charcoal under the pan, so it keeps the beam and the gulls over the river.
    { kind: 'sunray', wide: [.60, 0, .92, .60], phone: [.58, 0, .90, .52], angles: [-.32, -.28], sway: [.090, .085] },
    { kind: 'birds', phone: [.62, .05, .90, .16], period: 7.5, scale: 1.4 },
  ],
  th_shophouse: [
    // The brass oil lamp burning on its bracket inside the shophouse, portrait only. In wide this room's fourth
    // loop is the hung lantern; the portrait cannot hang it, because its empty brass hook sits at x .888 to .900
    // and any sprite wide enough to read would cross x .906, the right edge of the band a 390-wide phone shows.
    // The box was re-read on portrait.jpg on 2026-09-22: the first pass had it at [.295, .235, .375, .315], which
    // is blank plaster and the tops of two drinkers' heads. The lamp's glass and its bracket are the box below.
    { kind: 'light', phone: [.374, .190, .436, .230], color: '#f3a34b' },
  ],
  // th_paddy carries no ambience patch: the horizon haze, the opened fish, the straw fire and the hung egret.
  // th_isan carries no ambience patch: the bamboo grove, the sticky-rice baskets, the charcoal trough and the
  // hung garlic string.
  th_lanna: [
    // The ladle of khao soi broth falling into the bowl, portrait only — the wide composition shows the same woman
    // lifting noodles out of the bowl rather than pouring into it, so there is no wide thread to trace. Measured on
    // portrait.jpg: the broth leaves the ladle's rim at (.3105, .5025), bends right as it falls and lands on the
    // noodles at (.3175, .5345). Nothing is drawn above the rim or below the noodle surface.
    { kind: 'stream-glint', phone: [.302, .502, .325, .536], color: '#f2c463',
      paths: [undefined, [[[.37, 0], [.52, .47], [.674, 1]]]] },
  ],
  // th_andaman carries no ambience patch: the haze over the green water, the kaeng som and the grilling fish, the
  // driftwood fire and the hung squid line.
  th_muslim: [
    // The clean band of evening sky over the mangrove, which the brief names as this room's second cue (f). It was
    // the signature until the wide painting measured 2.55 per cent against its 3 per cent floor: two silhouettes
    // cannot carry a frame, and the low sun the painting is lit by can, so the two changed places. Bigger and more
    // frequent than the first pass, for the same reason.
    { kind: 'birds', wide: [.62, .055, .95, .16], phone: [.58, .135, .90, .215], period: 6.5, scale: 1.8 },
    // The lit stilt houses across the estuary, wide only. This is the patch the engine drops while the room steams
    // and burns; it is kept for the record and comes back if the heat ever does not.
    { kind: 'light', wide: [.635, .215, .745, .285] },
  ],
  // th_baba carries no ambience patch: the airwell shaft, the braise and the iron plate, the charcoal under the
  // plate and the hung lantern.
};

/**
 * Sprites hung over the paintings, per room and orientation. Each is a delivered `th-<name>` sprite laid over the empty
 * hook, peg, pole, rail or line the painting was generated with, so nothing is cut out of a finished picture and
 * no wall has to be repaired behind it. `fx` and `fy` are the sprite's top-left corner and `fw` its width, all as
 * fractions of that orientation's painting, measured on its own pixels; the sprite pivots at its top centre, where
 * its own loop, twine or S-hook meets the painted fitting.
 *
 * Three orientations that the room contract lists a sprite for carry none, and the reason is the same in all three:
 * the painted hook sits at or past x .906, which is the right edge of the slice a 390-wide viewport shows of a
 * portrait painting, so a sprite big enough to read would be cut in half on a phone. They are `th_wang` portrait
 * (nail at x .9145), `th_shophouse` portrait (hook at x .888 to .900) and `th_lanna` portrait (hook bend at x .890).
 * Their empty fittings stay empty, and each room's portrait spends that loop on a patch instead.
 */
export const THAILAND_HUNG: Record<string, { wide?: HungSprite[]; phone?: HungSprite[] }> = {
  th_khlong: {
    // The bamboo cross-pole lashed across the canopy frame runs from (.18, .058) to (.86, .012) in wide and from
    // (.10, .040) to (.90, .012) in portrait; the fish mobile hangs from it on its own thread, and the egret flies
    // in the clean band of morning sky between the pole and the treeline.
    // The two were moved apart on 2026-09-22 after the first live look: at fx .3835 and .265 the fish hung in the
    // same patch of sky as the bird and the pair read as two flying things rather than as a mobile on a pole and
    // an egret behind it. The fish now hangs from the pole half a frame to the right, with the bird's whole body
    // clear of it, and it sits a little lower so the pole crosses above its thread.
    wide: [{ name: 'th-pla-tapian', fx: .500, fy: .0345, fw: .073, sway: 6.5, tone: .92 },
      { name: 'th-egret', fx: .245, fy: .062, fw: .095, sway: 4.6, tone: .96 }],
    phone: [{ name: 'th-pla-tapian', fx: .555, fy: .0225, fw: .125, sway: 6.5, tone: .92 },
      { name: 'th-egret', fx: .195, fy: .052, fw: .125, sway: 4.6, tone: .96 }],
  },
  th_wang: {
    // The iron peg driven into the carved teak post: its tip is at (.2665, .0105) and its collar at (.258, .050),
    // so the mobile's thread goes over it at (.2665, .018). Pale plaited straw against dark teak and frangipani.
    wide: [{ name: 'th-pla-tapian', fx: .2365, fy: .018, fw: .060, sway: 5.4, tone: .88 }],
  },
  th_curry: {
    // The bamboo rail slung under the floor joists: y .095 at x .30 in wide, y .062 at x .42 in portrait. The wide
    // string hangs over the plain dark underside of the floor; the portrait one over the yard's foliage, which is
    // the only clean span of that rail inside the phone band.
    wide: [{ name: 'th-garlic-string', fx: .300, fy: .095, fw: .040, sway: 3.6, tone: .88 }],
    phone: [{ name: 'th-garlic-string', fx: .420, fy: .062, fw: .090, sway: 3.6, tone: .88 }],
  },
  th_shophouse: {
    // The brass hook screwed into the arcade beam outside the shopfront, its curve at (.932, .172). Evening: the
    // lantern is unlit in the sprite and is toned down to sit in the painting's blue hour.
    wide: [{ name: 'th-lantern', fx: .9025, fy: .165, fw: .055, sway: 3.0, tone: .78 }],
  },
  th_paddy: {
    // No hook: the egret flies. The brief asked for a wide clean band of hazy sky over the paddy for exactly this,
    // and the bird is placed inside it in both compositions, crossing in front of the far treeline as a real egret
    // over a harvest field does. The empty bamboo pole and cross-piece on the bund stays empty, as delivered.
    wide: [{ name: 'th-egret', fx: .300, fy: .035, fw: .100, sway: 3.2, tone: .97 }],
    phone: [{ name: 'th-egret', fx: .220, fy: .038, fw: .170, sway: 3.2, tone: .97 }],
  },
  th_isan: {
    // The bamboo rail: the garden fence rail at y .148 in wide, and the clean empty rail across the top of the
    // portrait at y .062. The wide string hangs over gold paddy, the portrait one over the bamboo grove.
    wide: [{ name: 'th-garlic-string', fx: .270, fy: .150, fw: .050, sway: 5.4, tone: .92 }],
    phone: [{ name: 'th-garlic-string', fx: .680, fy: .062, fw: .090, sway: 3.8, tone: .92 }],
  },
  th_lanna: {
    // The iron hook in the teak plank wall beside the grill, its bend at (.946, .156). The sai ua coil arrives with
    // its own S-hook, so it hangs from the painted hook without anything being added to the picture.
    wide: [{ name: 'th-sai-ua', fx: .9185, fy: .148, fw: .055, sway: 2.8, tone: .95 }],
  },
  th_andaman: {
    // The second line strung between the poles, beside the painted one and empty in both compositions: it runs from
    // (.19, .085) to (.60, .057) in wide and from (.06, .052) to (.90, .045) in portrait. The sprite's own twine
    // ends sit on that line, and in wide it stops clear of the painted squid at y .225.
    wide: [{ name: 'th-squid-line', fx: .320, fy: .070, fw: .095, sway: 2.4, tone: .98 }],
    phone: [{ name: 'th-squid-line', fx: .300, fy: .052, fw: .280, sway: 2.4, tone: .98 }],
  },
  th_baba: {
    // The iron hook under the airwell beam: the long stem drops from (.552, .016) to its J at (.548, .135) in wide,
    // and the portrait's hook hangs at (.495, .115), at mid-width and well inside the phone band.
    wide: [{ name: 'th-lantern', fx: .519, fy: .128, fw: .060, sway: 2.6, tone: .86 }],
    phone: [{ name: 'th-lantern', fx: .425, fy: .130, fw: .140, sway: 2.6, tone: .86 }],
  },
};
