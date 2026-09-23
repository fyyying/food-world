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
    // Portrait only, both. A phone shows x .094 to .906 of the portrait painting and the coal grate runs from the
    // left edge to x .132, so the room's portrait signature is the pair of gas globes over the bar, which a phone
    // does show (see PAINTED_SIGNATURES), and the grate keeps a small glow on the part of its flames inside the
    // band, above the old drinker's cap (2026-09-23). The globe on the bar back that Stage C lit sits behind the
    // back button at 390 wide and was moved to the street's gas lamps through the open door, below the room's
    // name: the wall lamp at (.725, .137) and the double lamp at (.79, .172). In wide the four loops are already
    // the hearth, the steam and the two hung sprites.
    { kind: 'light', phone: [.094, .195, .140, .240], color: '#f3a34b' },
    { kind: 'light', phone: [.700, .112, .820, .198], color: '#ffc47a' },
  ],
  uk_tearoom: [
    // Rain on the plate glass the tea room looks out of, which is what the image brief asked this window for and
    // what both paintings draw: a wet street, an omnibus and a pair of gas standards behind the glass. The wide box
    // is the clear upper half of the right-hand sash, above the omnibus and clear of both mullions; the phone box
    // is the same window recomposed, pulled in to end at x .900 so it stays inside the band a phone shows.
    { kind: 'rain', wide: [.780, .018, .982, .330], phone: [.720, .035, .902, .300], color: '#e8f1ef' },
    // Portrait only, since 2026-09-23: the window's daylight falling down to the left across the tablecloth, below
    // every face. With the plumes off the faces the portrait room measured 0.95 per cent on a phone-sized composite.
    { kind: 'sunray', phone: [.094, .700, .906, 1], angles: [0, .35], sway: [.10, .12] },
  ],
  uk_market: [
    // The haze under the roof at first light, with the locomotive's smoke drifting off the viaduct into it. Since
    // 2026-09-23 it stays above every head: in wide it stops at y .27, over the porter's crate and above his face;
    // in portrait it lies in the glazing between the room's name and the cheesemonger's hair (it had covered his
    // face). Stronger than before (.58 to .66), because the wide room measured 2.8 per cent in two seconds.
    { kind: 'mist', wide: [.530, .075, .835, .270], phone: [.360, .112, .720, .178], alpha: .66 },
    // The market's own gaslight under the iron roof, the lamp on its column at the right of the aisle in wide and
    // the one on its column right of the room's name in portrait (painted at (.715, .105); the box starts at x .686,
    // where the name ends at 390 wide).
    { kind: 'light', wide: [.766, .072, .822, .136], phone: [.686, .072, .746, .138], color: '#ffc47a' },
  ],
  uk_piemash: [
    // Rain on the glazed door onto the wet dock street, in the clear column of glass above the handle rail and
    // below the head rail, so the clip keeps every streak off the stiles and off the men walking past outside.
    // Phone box trimmed on 2026-09-23 to start under the room's name (which runs to y .133 at 390 wide) and to stop
    // left of the old man's cap.
    { kind: 'rain', wide: [.612, .035, .643, .240], phone: [.735, .140, .860, .235], color: '#e8f1ef' },
    // The shop's hanging gas globe over the counter, wide only since 2026-09-23: the portrait globe at (.47, .05)
    // is behind the back button at 390 wide. The box was widened round the globe the same day, so its glow reaches
    // the tiles about it, to hold the room over its floor with the plumes kept off the faces.
    { kind: 'light', wide: [.395, .065, .475, .165], color: '#ffc47a' },
  ],
  uk_chippy: [
    // Rain on the shop window, which is the whole reason the queue is indoors. Wide: the upper light of the
    // right-hand sash, above the shelf of plates and clear of the two hanging lamps. Phone: the same window
    // recomposed; since 2026-09-23 only its lower panes, under the story button at 390 wide and above the old
    // man's cap (the Stage C box lay wholly behind the back button, the room's name and the story button).
    { kind: 'rain', wide: [.532, .030, .628, .215], phone: [.100, .178, .215, .262], color: '#e8f1ef' },
  ],
  uk_breakfast: [
    // The naphtha flare the stall works under, wide only. This is the one night painting in the area and the flare
    // is the largest thing it does; but at 390 wide the portrait's flare (x .10 to .20, y .04 to .17) is behind the
    // back button and the room's name, so since 2026-09-23 the portrait's light is the coals glowing under the
    // griddle, which the portrait pictures and a phone shows.
    { kind: 'light', wide: [.538, .010, .594, .072], color: '#ffc47a' },
    { kind: 'light', phone: [.350, .765, .520, .840], color: '#f3a34b' },
  ],
  uk_lascar: [
    // Portrait only, since 2026-09-23: the glow of the range's open fire under the pots, below the men's faces.
    // The portrait lost its hung lamp (its hook is inside the room's heading) and its plumes were cut to keep them
    // off the faces, so the fire's own light takes the fourth loop. In wide the four loops are the spice fall, the
    // plumes, the fire and the lamp.
    { kind: 'light', phone: [.400, .655, .800, .770], color: '#f3a34b' },
  ],
  // uk_hopkitchen carries no ambience patch: the ladle's pour, the cauldron's plume, the open fire and the hung
  // hop bine are its four loops in wide; the portrait runs on the first three (its bine hung through the heading).
  uk_dairy: [
    // The cold room, and the only room in the area with no heat of any kind, so it spends all three patch slots.
    // The daylight coming in at the open door. Since 2026-09-23 it starts below every face and falls down to the
    // left across the press bench, the pail and the flags in wide, and on the press and its curd in portrait: the
    // Stage C beams ran through the girl with the pail (wide) and through the girl and the woman beside her
    // (portrait). Light on stone and on the press is also not light on light, which the first capture showed a
    // beam over the sunlit meadow to be.
    { kind: 'sunray', wide: [.420, .390, .780, 1], phone: [.380, .360, .906, .720], angles: [.40, -.35], sway: [.098, .092] },
    // The morning air over the pasture and the scar beyond the door. This patch replaced a pair of gulls on
    // 2026-09-22: with the beam, the birds and the tree the wide painting measured 2.1 to 2.5 per cent against its
    // floor, because two silhouettes and eight leaves are a rounding error in a changed-pixel count and the beam
    // stalls twice in every drift cycle. Haze over a Dales pasture at milking time is the largest thing the
    // doorway actually does, and it never stops moving.
    // Both boxes stop above the girl's headscarf since 2026-09-23 (they had covered her face), and inside the
    // doorway's jambs.
    { kind: 'mist', wide: [.675, .100, .855, .290], phone: [.096, .180, .270, .300], alpha: .56 },
    // The tree beside the door, wide only: the portrait crops it to a sliver at the left edge of the phone band.
    // Green and narrow on purpose. The default painted leaves are the hotpot room's red autumn cut-outs, and the
    // live look on 2026-09-22 showed them as red flakes over a green summer pasture, so this is the procedural
    // leaf in the tree's own green.
    // Boxed to the tree's own crown on 2026-09-23 (the old box ran down over the girl's face).
    { kind: 'leaves', wide: [.675, .150, .740, .285], leaf: 'olive', color: '#5f7f3b', count: 8, size: 2.0 },
    // Whey off the draining rack, portrait only, and the room's second cold liquid. The curd sits on slats over a
    // bench and the whey runs off the slats in separate threads; they fade out on the bench, which the painting
    // does not open, so the portrait takes no splash ring here. The press spout's own thread is the signature.
    { kind: 'drip', phone: [.640, .750, .880, .815], color: '#f2eddc', period: 1.2, splash: [false, false],
      paths: [undefined, [[[.10, 0], [.10, 1]], [[.33, 0], [.33, 1]], [[.53, 0], [.53, 1]], [[.77, 0], [.77, 1]]]] },
  ],
  uk_pasty: [
    // Gulls over the cove in the open doorway, portrait only since 2026-09-23. At 1280 x 720 the wide doorway's
    // sky (x .07 to .185) lies behind the back button (to y .077) and the room's name and story button (to
    // y .257): the Stage C strip above the name was behind the back button itself. The portrait gulls fly in the
    // sky below the heading and above the headland.
    { kind: 'birds', phone: [.170, .182, .320, .236], period: 4.8, scale: 1.8 },
  ],
  uk_cockles: [
    // Portrait only, since 2026-09-23: the low sun across the heap and the wet sand in front of the riddle, below the
    // woman's hands. The portrait's copper plume came out (it rose behind the room's heading), so the sunlight takes
    // that loop. In wide the four loops are the sand through the riddle, the plumes, the fire and the gull.
    { kind: 'sunray', phone: [.300, .700, .906, .980], angles: [0, .35], sway: [.10, .12] },
  ],
  // uk_smokehouse carries no ambience patch: the sparks off the pit, the pit's smoke and the table's fish, and the
  // hung sprites — the speet of tied pairs and the gull in wide, the gull alone in portrait.
  uk_distillery: [
    // The shaft from the high window, which is the direction both paintings are lit from. Re-boxed and re-angled
    // on 2026-09-23: the Stage C beams leaned the wrong way for their windows and crossed the maltman (wide) and
    // the older stillman (portrait). The wide shaft now runs from the upper left down to the right across the
    // washback and the malt, right of the maltman's face; the portrait's falls from the window at the upper right
    // down to the left onto the green malt on the floor, below every face (a beam in the window's own bright
    // plaster was light on light and measured under 1 per cent).
    { kind: 'sunray', wide: [.220, .250, .620, .950], phone: [.300, .740, .906, 1], angles: [-.70, .50], sway: [.095, .12] },
  ],
};

/**
 * Sprites hung over the paintings, per room and orientation. Each is a delivered `uk-<name>` sprite laid over the
 * empty hook, bracket, chain end, cross-bar or peg the painting was generated with, so nothing is cut out of a
 * finished picture and no wall has to be repaired behind it. `fx` and `fy` are the sprite's top-left corner and
 * `fw` its width, all as fractions of that orientation's painting, measured on its own pixels; the sprite pivots at
 * its top centre, where its own eye, loop, chain ring or cord meets the painted fitting.
 *
 * Nothing hangs behind a room's heading (walkthrough 43, 2026-09-23). At 390 x 844 the back button, the room's name
 * and the story button cover the top of the phone to y 143 (y 165 under a two-line name); the pub's beam nail, the
 * tea room's chain, the hop line, the market post, the seamen's kitchen hook and the smokehouse cross-bar all sit at
 * portrait y .04 to .11, so those six rooms hang nothing in portrait. Only gulls, which hang from nothing, fly in
 * portrait, each clear of the heading. The pub's portrait street bracket is at x .923, outside the phone band.
 * At 1280 x 720 the name ends at y 134 and the story button at y 179, x 131; every wide sprite, including the
 * market's brace (its S-hook is right of the name "The market"), is clear of them.
 *
 * Painted fittings that stay empty by the contract: the pie shop's brass counter hook, the chippy's iron hook, the
 * dairy's wooden peg, the pasty bakehouse's iron hook, the distillery's wall hook and the coffee stall's canopy hook.
 */
export const LONDON_HUNG: Record<string, { wide?: HungSprite[]; phone?: HungSprite[] }> = {
  uk_pub: {
    // Two fittings in the wide painting. The wrought-iron street bracket runs out of the brick over the open door
    // and its scrolled eye is at (.720, .092), against the wet street; the sign hangs from it in front of the gas
    // standard further down the pavement, which is where a pub sign hangs. The plain iron J-nail under the bar beam
    // is at (.5265, .064), on dark timber, and carries the hop bine that every bar of the period hung over it.
    // In portrait only the beam nail is inside the phone band; the street bracket's eye is at x .923.
    // The portrait bine came out on 2026-09-23: its nail is at y .04 and the bine hung down through the room's
    // name (walkthrough 43).
    wide: [{ name: 'uk-pub-sign', fx: .697, fy: .092, fw: .046, sway: 3.4, tone: .92 },
      { name: 'uk-hop-bine', fx: .499, fy: .064, fw: .055, sway: 5.2, tone: .90 }],
  },
  uk_tearoom: {
    // The brass ceiling chain over the tea room, ending in an empty ring: (.5815, .092) in wide, (.557, .050) in
    // portrait. The lamp arrives with its own chain and ring, so it hangs on the painted ring without anything
    // being added to the picture, and it is unlit in the sprite, as the tea room's own gas is.
    // Wide only since 2026-09-23: the portrait ring is at y .05 and the lamp hung through the room's name.
    wide: [{ name: 'uk-hanging-lamp', fx: .5490, fy: .086, fw: .065, sway: 5.2, tone: .94 }],
  },
  uk_market: {
    // Wide only since 2026-09-23, the reverse of Stage C. The wide S-hook hangs from the beam with its belly at
    // (.262, .163), on plain plaster between the cheesemonger's hair (to x .245) and the post (x .30); the room's
    // name "The market" ends at x .174 and the story button at y .257 at 1280 x 720, and the brace (x .247 to
    // .277, y .158 to .23) stops above the woman's headscarf. Stage C had read the heading's rectangle for a longer
    // name. The portrait hook's belly at (.838, .092) is inside the heading band, and the brace hung through it
    // (walkthrough 43), so the portrait hangs nothing.
    wide: [{ name: 'uk-game-brace', fx: .247, fy: .158, fw: .030, sway: 3.0, tone: .92 }],
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
    // Wide only since 2026-09-23: the portrait hook is at y .11 and the lamp hung through the room's name.
    wide: [{ name: 'uk-hanging-lamp', fx: .6055, fy: .200, fw: .045, sway: 2.8, tone: .90 }],
  },
  uk_hopkitchen: {
    // The empty wire line strung between two poles over the bin, with plain grey sky behind it: it crosses x .600
    // at y .040 in wide and x .400 at y .065 in portrait. A cut bine hung on the line is what a hop garden looks
    // like when the pickers stop for dinner.
    // Wide only since 2026-09-23: the portrait line is at y .065 and the bine hung through the room's name.
    wide: [{ name: 'uk-hop-bine', fx: .5675, fy: .040, fw: .065, sway: 4.6, tone: .94 }],
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
    // Since 2026-09-23 the portrait keeps only the gull, flying in the sky above the room's name and right of the
    // back button: the portrait cross-bar is at y .07 and the speet hung through the name, and the gull's old place
    // at y .18 sat on the right-hand girl's headscarf.
    wide: [{ name: 'uk-smoke-speet', fx: .780, fy: .100, fw: .055, sway: 2.6, tone: .96 },
      { name: 'uk-gull', fx: .600, fy: .015, fw: .075, sway: 3.2, tone: .94 }],
    phone: [{ name: 'uk-gull', fx: .520, fy: .012, fw: .100, sway: 3.2, tone: .94 }],
  },
};
