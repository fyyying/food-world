/** Always-on painting motion per Spain room, per orientation. Owned by the Room maker. */
import type { AmbientPatch } from "./scene-ambience";

// Every box was measured on the actual wide (1672 x 941) or portrait (941 x 1672) painting.
//
// Spain uses no `breeze` crops any more. Cutting a pepper string out of the finished painting by colour and
// repairing the wall behind it showed its cut edge and its repair on every swing, which the owner rejected on
// 2026-09-16 ("it's just not natural"). Four room orientations now hang the delivered `es-pepper-ristra` sprite from
// the painted hook instead, exactly as the China hotpot room hangs its lanterns, and the string has been painted out
// of those four pictures (scripts/scenes/paint-out-strings.py) so the wall behind the sprite is clean, as it is in
// the hotpot painting. Leaving it there was the owner's second note the same day: "there is in the background the
// same chilli string, the China room doesn't have it." Where neither is possible — a string crossed by a person, cut
// by the frame edge, tangled with a garlic braid, standing on a wall in hard sunlight, or hanging in front of a ham
// and an iron column so the picture cannot be cleaned behind it — the painted string stays still and that room's
// motion budget goes to its lamp, beam, birds, leaves or stream glint instead. The reasons are in docs/spain-rooms.md.
//
// The signature motion of each room lives in PAINTED_SIGNATURES. The engine keeps only the first patches that fit
// under the four-loop ceiling, so the list order inside each room runs from the cue that matters most to the one
// that may be dropped.
export const SPAIN_AMBIENCE: Record<string, AmbientPatch[]> = {
  es_paella: [
    { kind: 'leaves', wide: [.80, 0, 1, .28], phone: [0, .02, .33, .20], leaf: 'olive', color: '#5f7f3b', count: 8, size: 1.5 },   // the orange tree at the edge of the reed shade
  ],
  es_tapas: [
    // The wide composition has no clean sky and no separable hanging bunch, so its three lit lamps and a beam that
    // travels twice as far carry the room. The beam keeps the painting's own direction; only its drift grew.
    // The portrait pepper string is left still: a garlic braid hangs across it and a second smaller string hangs in
    // front of it, so no single sprite can cover the painted peppers.
    { kind: 'sunray', wide: [.44, 0, 1, .68], phone: [.32, 0, 1, .62], angles: [-.35, .35], sway: [.095, .055] },   // the square's light through the arcade
    { kind: 'light', wide: [.852, .012, .934, .205] },   // the lantern in the right arch, wide only, box widened to its glass and halo
    { kind: 'light', wide: [.045, 0, .118, .115] },   // the brass lantern lit above the bar, top left, wide only
  ],
  es_jamon: [
    // The wide boxes were re-measured on the painting: the two column lanterns sit a little right and lower than the
    // first pass placed them, and the ornate lantern hung from the roof trusses is a third pictured lamp. The
    // portrait pepper string stays still and carries no sprite: it hangs in front of a curing ham, an iron column
    // and the bright glazed roof at once, so the painting cannot be cleaned behind it. The market lantern deeper in
    // the hall is its third cue instead.
    { kind: 'light', wide: [.348, .138, .386, .224], phone: [.836, .164, .906, .248] },   // the lit lantern on the near iron column; the portrait shows the one on its own column
    { kind: 'light', wide: [.324, .208, .358, .282] },   // the second column lantern below it, wide only
    { kind: 'light', wide: [.256, 0, .312, .090] },   // the ornate lantern hanging from the roof trusses, wide only
    { kind: 'light', phone: [.598, .236, .638, .270] },   // the lit market lantern down the hall, portrait only, box on its glass
  ],
  // es_tortilla has no ambience list: both orientations carry steam, fire and the hung pepper-string sprite, and the
  // open firebox that used to sit here is now the room's signature.
  es_churros: [
    { kind: 'light', wide: [.472, .112, .508, .19], phone: [.685, .012, .748, .08] },   // the lane lantern in the doorway
  ],
  es_pintxos: [
    { kind: 'light', wide: [.014, .245, .088, .362], phone: [.096, .020, .200, .142] },   // the lamp behind the counter; the portrait shows the one by the stone doorway
    { kind: 'birds', wide: [.665, .175, .935, .218], phone: [.40, .10, .95, .16], period: 5.2, scale: 1.7 },   // the sky band under the awning, over the bay
  ],
  es_gazpacho: [
    // Neither painted string can take a sprite: in the wide painting the man's white shoulder crosses in front of the
    // string's lower tip, and in the portrait the left string is cut by the frame edge while the middle one is
    // crossed by his hand and forearm. Both stay still; the orange canopy is the room's signature instead.
    { kind: 'sunray', wide: [.02, 0, .66, .64], phone: [.26, 0, 1, .52], angles: [-.40, .35], sway: [.055, .095] },
    { kind: 'light', wide: [.318, .19, .352, .29] },   // the courtyard lantern on the whitewashed wall, wide only
    // The portrait has no lantern and no open sky; its third cue is the bougainvillea the painting already carries
    // above the arch, dropping bracts inside its own canopy and clear of both pepper strings and the man below.
    { kind: 'leaves', phone: [.108, 0, .246, .150], leaf: 'blossom', color: '#c7457f', count: 6, size: 1.3 },
  ],
  es_pulpo: [
    { kind: 'light', wide: [.858, .018, .930, .155], phone: [.855, .095, .94, .185] },   // the oil lamp under the granite arcade, wide box widened to its glass
    { kind: 'leaves', wide: [.205, .042, .345, .128], leaf: 'yellow', color: '#c9a63a', count: 8, size: 1.5 },   // the turning trees over the autumn fairground, wide only
  ],
  es_pa_tomaquet: [
    // The portrait string hangs on a limestone wall in direct sun, with the painting's own hard cast shadow beside
    // it; the evenly lit library sprite reads as a pasted object there, so the string stays still.
    { kind: 'sunray', wide: [.36, 0, 1, .70], phone: [.26, 0, 1, .58], angles: [-.35, .35], sway: [.055, .055] },
    { kind: 'leaves', wide: [.84, 0, 1, .33], leaf: 'olive', color: '#6c8a45', count: 5, size: 1.2 },   // the potted orange tree, wide only
  ],
  es_manchego: [
    { kind: 'stream-glint', wide: [.298, .615, .315, .78], color: '#fff3d0', paths: [[[[.45, .02], [.5, .5], [.5, .98]]], undefined] },   // the painted whey drip from the draining table into the bucket, wide only
    { kind: 'leaves', phone: [.13, 0, .48, .16], leaf: 'yellow', color: '#c9a63a', count: 7, size: 1.4 },   // the tree over the farm door, portrait only
    // The doorway beam is portrait-only now: the wide painting already carries the caldero's steam, the whey glint
    // and the hung pepper string, and a beam is the one cue that stalls twice in every cycle.
    { kind: 'sunray', phone: [.08, 0, .66, .52], angles: [-.30, .30], sway: [.085, .080] },   // daylight through the farm door
  ],
  es_sidreria: [
    // Both painted strings run off the left edge of their frame — the portrait one sits outside the slice a phone
    // shows at all — and the wide one's tip disappears behind an apple crate, so neither can carry a sprite. The
    // escanciado is the room's signature instead, and the two cues that were dropped for it come back here.
    { kind: 'leaves', wide: [.09, .02, .33, .28], phone: [0, .01, .26, .22], leaf: 'olive', color: '#6f8f4e', count: 6, size: 1.3 },   // the apple branch in the doorway
    { kind: 'sunray', wide: [.02, 0, .52, .76], phone: [0, 0, .46, .66], angles: [-.35, .30], sway: [.080, .075] },   // daylight through the press-house door
    { kind: 'light', wide: [.066, .170, .098, .232] },   // the iron lantern lit on the door post, wide only, box on its glass
    { kind: 'birds', phone: [.18, .100, .36, .140], period: 6.0, scale: 1.2 },   // the clean sky between the door lintel and the mountain ridge, portrait only
  ],
  es_bodega: [
    { kind: 'stream-glint', wide: [.486, .265, .514, .585], phone: [.667, .175, .697, .655], color: '#ffe6b0',
      paths: [[[[.42, .02], [.43, .5], [.44, .98]]], [[[.48, .02], [.52, .5], [.54, .98]]]] },   // the painted sherry thread from venencia to copita
    { kind: 'light', wide: [.610, .085, .676, .208], phone: [.848, .285, .952, .418] },   // the cellar lantern
  ],
};
