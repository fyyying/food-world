/** Always-on painting motion per Vietnam room, per orientation. Owned by the Room maker. */
import type { AmbientPatch } from "./scene-ambience";

// Every box was measured on the actual wide (1672 x 941) or portrait (941 x 1672) painting.
//
// Vietnam uses no `breeze` crop. Every one of the twelve paintings was composed with an empty peg, rail, nail or
// beam and a delivered sprite to hang on it, which is the standard the owner asked for on 2026-09-16 after the
// Spanish pepper strings were cut out of their pictures and put back: a library sprite over a clean wall, never a
// colour-keyed hole in a finished painting. So no room here isolates a painted subject by colour, and every
// hanging motion in the set is a `hung` sprite in `scenes-vietnam.ts`.
//
// The signature motion of each room lives in PAINTED_SIGNATURES. The engine keeps only the first patches that fit
// under the four-loop ceiling (`choose` in scene-painted.ts slices this list to `3 - heat`), and a hung sprite
// swings on its own timer and counts as a loop too. Four of the twelve rooms therefore carry no ambience patch at
// all: their four loops are the signature, the steam, the fire and the sprite. The lists below hold the cues that
// fill an orientation the compositions left a loop short — a fire the other orientation does not picture, a
// support outside the slice a phone shows, or a peg the room heading covers — and all but one is given to a
// single orientation, so the other stays at four. The reasons are in docs/vietnam-rooms.md.
export const VIETNAM_AMBIENCE: Record<string, AmbientPatch[]> = {
  // vn_bun_cha, vn_hue_cakes, vn_banh_xeo and vn_mekong_home have no ambience list at all: all four of their
  // loops are the signature, the steam, the fire and the hung sprite.
  vn_pho: [
    // Wide only, and it is the loop this painting's empty peg would have carried. The peg is on the plaster at
    // fx .037 to .099, fy .088 to .135, which is under the room heading at 1280 x 720 (see scenes-vietnam.ts), so
    // the wide orientation hangs nothing and takes a cue the painting already carries instead.
    // The first thing tried here was the blanching water running off the noodle strainer, traced on wide.jpg from
    // the noodle tips at (.411, .497) to the steel rim of the stock pot at (.415, .535). It was configured, read
    // live off the room's own effect canvas, and dropped: a `drip` sizes its drop by `min(w*.22, h*.027, 3.6)`
    // and that fall is only .043 of the painting high, so the drops cap at a 2-pixel radius and the whole cue lit
    // 120 canvas pixels — thirty on the screen. A cue that small is not a loop. The strainer stays as painted.
    // Open sky over Hoàn Kiếm takes the loop: the band below runs between the plane canopy at the upper left and
    // the flagpole at x .656, with nothing under it but cloud, and both rows fly clear of the far shore at y .12.
    { kind: 'birds', wide: [.60, .015, .80, .105], period: 6, scale: 1.5 },   // the lake sky, above the far shore and clear of the trees
  ],
  vn_com_vong: [
    // Wide only. The wide wall peg is under the room heading, so the sieve hangs in the portrait alone and this
    // takes the freed wide loop: sparks off the fire under the roasting pan, the one heat in the one cold room.
    { kind: 'embers', wide: [.09, .775, .215, .875], color: '#ffbe5c' },   // the fire under the roasting pan
  ],
  vn_bun_bo_hue: [
    // Wide only, for the same reason: the wide rail is under the heading. The haze the painting already draws on
    // the Perfume River between the garden rail and the far shore takes the loop.
    { kind: 'mist', wide: [.60, .27, .92, .38], alpha: .42 },   // the river haze under the pagoda hill
  ],
  vn_cao_lau: [
    // Portrait only. The delivered portrait screens the stove behind the left work counter, so this room has no
    // flame on a phone, and its fan nail lies outside the slice a 390-wide viewport shows, so it has no sprite
    // there either. Both freed loops go to the river door the shophouse is built around: the open sky above the
    // far bank, and the haze the painting already draws over the water between the quay and the far shore.
    // Neither box is given a wide rectangle, because the wide painting is already at four loops.
    { kind: 'birds', phone: [.47, .115, .70, .185], period: 6.5, scale: 1.3 },   // the clean sky over the far bank, between the door head and the roofs
    { kind: 'mist', phone: [.46, .255, .74, .40], alpha: .45 },   // the river between the quay and the far bank, where the painting is already hazy
  ],
  vn_mi_quang: [
    // Portrait only. The embers under the copper pot are pictured in the wide painting and not in the portrait,
    // so the phone loses its fire ellipse; the airwell daylight the composition is lit by takes the freed loop.
    { kind: 'sunray', phone: [.30, 0, .78, .50], angles: [-.34, .34], sway: [.085, .090] },   // the airwell over the canal front
  ],
  vn_bread_pate: [
    // Portrait only. The portrait's fan nail sits at fx .909 to .961, outside the phone slice, so this room has
    // no sprite on a phone. The loop goes back to the oven the counter is built on: sparks off the charcoal bed
    // the painting draws under the loaves, inside the mouth and nowhere else.
    { kind: 'embers', phone: [.096, .445, .205, .545], color: '#ffc06a' },   // the charcoal bed inside the oven mouth, cropped to the part a 390-wide phone shows
  ],
  vn_hu_tieu: [
    // Both orientations. This is the one kitchen in the set whose pot stands on a closed stove, so no flame is
    // pictured and neither orientation carries a fire ellipse; the street doorway's daylight takes that loop.
    { kind: 'sunray', wide: [.52, 0, .86, .68], phone: [.55, 0, .90, .50], angles: [.34, .38], sway: [.090, .085] },   // the light off the Chợ Lớn street
  ],
};
